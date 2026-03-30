const SEND_RATES_XOF = {
  EUR: 655.957,
  USD: 615.0,
  GBP: 782.0,
  CAD: 455.0
};

const RECEIVE_RATES_XOF = {
  XOF: 1,
  XAF: 1,
  NGN: 0.389,
  GHS: 39.7,
  KES: 4.77,
  ZAR: 33.8
};

const PRICING_TIERS = [
  { min: 0, max: 199, feePct: 0.012, fxPct: 0.004, label: "Starter" },
  { min: 200, max: 999, feePct: 0.01, fxPct: 0.004, label: "Growth" },
  { min: 1000, max: Number.POSITIVE_INFINITY, feePct: 0.008, fxPct: 0.004, label: "Pro" }
];

const WAVE_BENCHMARK = 0.02;

const els = {
  amount: document.getElementById("send-amount"),
  sendCurrency: document.getElementById("send-currency"),
  receiveCurrency: document.getElementById("receive-currency"),
  receiveAmount: document.getElementById("receive-amount"),
  corridorRate: document.getElementById("corridor-rate"),
  breakdown: document.getElementById("breakdown"),
  tierLabel: document.getElementById("pricing-tier-label"),
  pricingGrid: document.getElementById("pricing-grid"),
  chips: Array.from(document.querySelectorAll(".chip")),
  beneficiaryBtns: Array.from(document.querySelectorAll(".beneficiary")),
  continueBtn: document.getElementById("continue-btn")
};

init();

function init() {
  renderPricingGrid();
  bindEvents();
  updateQuote();
}

function bindEvents() {
  [els.amount, els.sendCurrency, els.receiveCurrency].forEach((el) => {
    el.addEventListener("input", updateQuote);
    el.addEventListener("change", updateQuote);
  });

  els.chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      els.amount.value = chip.dataset.amount;
      setChipActive(chip.dataset.amount);
      updateQuote();
    });
  });

  els.beneficiaryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.receiveCurrency.value = btn.dataset.currency;
      updateQuote();
    });
  });

  els.continueBtn.addEventListener("click", () => {
    const q = computeQuote();
    if (!q) return;
    const msg = `Transfert prêt: ${formatAmount(q.receiveAmount, q.receiveCurrency)} ${q.receiveCurrency} pour ${formatAmount(q.sendAmount, q.sendCurrency)} ${q.sendCurrency}.`;
    window.alert(msg);
  });
}

function getTier(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  return PRICING_TIERS.find((tier) => value >= tier.min && value <= tier.max) || PRICING_TIERS[0];
}

function computeQuote() {
  const sendAmount = Number.parseFloat(els.amount.value);
  const sendCurrency = els.sendCurrency.value;
  const receiveCurrency = els.receiveCurrency.value;

  if (!Number.isFinite(sendAmount) || sendAmount <= 0) return null;
  const sendRateXof = SEND_RATES_XOF[sendCurrency];
  const receiveRateXof = RECEIVE_RATES_XOF[receiveCurrency];
  if (!sendRateXof || !receiveRateXof) return null;

  const tier = getTier(sendAmount);
  const feeAmount = sendAmount * tier.feePct;
  const netAmount = sendAmount - feeAmount;

  const grossXof = sendAmount * sendRateXof;
  const deliveredXof = netAmount * sendRateXof * (1 - tier.fxPct);
  const receiveAmount = deliveredXof / receiveRateXof;

  const midRate = sendRateXof / receiveRateXof;
  const appliedRate = midRate * (1 - tier.fxPct);
  const effectivePct = tier.feePct + tier.fxPct;

  return {
    sendAmount,
    sendCurrency,
    receiveCurrency,
    tier,
    feeAmount,
    receiveAmount,
    midRate,
    appliedRate,
    effectivePct,
    waveReceive: (grossXof * (1 - WAVE_BENCHMARK)) / receiveRateXof
  };
}

function updateQuote() {
  const quote = computeQuote();
  if (!quote) {
    els.receiveAmount.textContent = "-";
    els.corridorRate.textContent = "Montant invalide";
    els.breakdown.innerHTML = "";
    return;
  }

  els.receiveAmount.textContent = `${formatAmount(quote.receiveAmount, quote.receiveCurrency)} ${quote.receiveCurrency}`;
  els.corridorRate.textContent = `1 ${quote.sendCurrency} = ${formatRate(quote.appliedRate)} ${quote.receiveCurrency} (appliqué)`;
  els.tierLabel.textContent = `Palier ${quote.tier.label} • Coût ${toPct(quote.effectivePct)}`;

  els.breakdown.innerHTML = [
    row("Taux mid-market", `1 ${quote.sendCurrency} = ${formatRate(quote.midRate)} ${quote.receiveCurrency}`),
    row(`Frais WASI (${toPct(quote.tier.feePct)})`, `-${formatAmount(quote.feeAmount, quote.sendCurrency)} ${quote.sendCurrency}`, true),
    row(`Marge FX (${toPct(quote.tier.fxPct)})`, `Taux final ${formatRate(quote.appliedRate)}`),
    row("Coût total", toPct(quote.effectivePct), false, true),
    row("Comparatif Wave", `Wave: ${formatAmount(quote.waveReceive, quote.receiveCurrency)} ${quote.receiveCurrency}`)
  ].join("");

  highlightTier(quote.tier.label);
  setChipActive(String(Math.round(quote.sendAmount)));
}

function renderPricingGrid() {
  els.pricingGrid.innerHTML = PRICING_TIERS.map((tier) => {
    const upper = Number.isFinite(tier.max) ? `${tier.max}` : "+";
    const amountLabel = Number.isFinite(tier.max) ? `${tier.min}-${upper}` : `${tier.min}+`;
    const total = tier.feePct + tier.fxPct;
    return `
      <div class="pricing-item" data-tier="${tier.label}">
        <strong>${tier.label} • ${amountLabel}</strong>
        <span>Frais ${toPct(tier.feePct)} + FX ${toPct(tier.fxPct)} = ${toPct(total)}</span>
      </div>
    `;
  }).join("");
}

function highlightTier(label) {
  document.querySelectorAll(".pricing-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.tier === label);
  });
}

function setChipActive(amount) {
  els.chips.forEach((chip) => chip.classList.toggle("active", chip.dataset.amount === String(amount)));
}

function row(label, value, negative = false, total = false) {
  const classes = ["break-row"];
  if (negative) classes.push("negative");
  if (total) classes.push("total");
  return `<div class="${classes.join(" ")}"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`;
}

function formatAmount(value, currency) {
  if (currency === "XOF" || currency === "XAF") {
    return Math.round(value).toLocaleString("fr-FR");
  }
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatRate(value) {
  if (value >= 1) return value.toFixed(4);
  return value.toFixed(6);
}

function toPct(value) {
  return `${(value * 100).toFixed(2).replace(".", ",")}%`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
