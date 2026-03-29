const CIREX_KEYS = ["cirex_microfinance_state_v3", "cirex_microfinance_state_v2"];
const PORTAL_KEY = "wasi_customer_portal_state_v1";
const STEPS = ["Candidature", "Analyse WASI (48h)", "Compartiment", "Structuration", "Book Building (15j)", "Admission (30j)", "Cotation", "Suivi"];
const QUESTIONS = [
  "Puis-je acheter CIREX Private Stock aujourd'hui ?",
  "Quel ticket minimum faut-il prévoir ?",
  "Quel fonds WASI est le plus simple pour commencer ?",
  "Quelle allocation convient à mon profil ?"
];
const DEMO = {
  clients: [
    { id: "CL-1001", name: "Aminata Koné", sector: "Commerce d'anacarde", region: "Bouaké", phone: "+225 0701010101" },
    { id: "CL-1002", name: "Mariam Traoré", sector: "Transformation agroalimentaire", region: "Yamoussoukro", phone: "+225 0703030303" },
    { id: "CL-1003", name: "Kouadio N'Dri", sector: "Logistique locale", region: "Abidjan", phone: "+225 0709090909" }
  ],
  loans: [
    { clientId: "CL-1001", outstanding: 640000, principal: 850000, status: "Current", riskFlag: "Low" },
    { clientId: "CL-1002", outstanding: 410000, principal: 650000, status: "Late", riskFlag: "High" },
    { clientId: "CL-1003", outstanding: 525000, principal: 900000, status: "Watch", riskFlag: "Medium" }
  ]
};
const ASSETS = [
  { id: "CIREX-PS", group: "private", name: "CIREX Private Stock", issuer: "CIREX Microfinance", type: "Action privée", stage: "Cotation privée", price: 12500, minimumTicket: 50000, description: "Titre privé réservé aux clients CIREX pour financer l'expansion, le digital et l'infrastructure de marché.", note: "Participation client au capital privé CIREX", themes: ["finance", "microfinance", "commerce", "services"] },
  { id: "AGRLINK", group: "private", name: "AgroLink Croissance", issuer: "AgroLink CI", type: "Action participante", stage: "Book Building", price: 3200, minimumTicket: 25000, description: "Entreprise participante de transformation et logistique agro dans les bassins de production.", note: "Agro-industrie et transformation locale", themes: ["agro", "agriculture", "anacarde", "cacao", "transformation"] },
  { id: "SOLBRIDGE", group: "private", name: "SolarBridge PME", issuer: "SolarBridge West Africa", type: "Action participante", stage: "Admission", price: 4750, minimumTicket: 30000, description: "Valeur privée orientée énergie productive, mini-réseaux et équipement pour PME.", note: "Énergie distribuée et équipements solaires", themes: ["energie", "services", "solaire"] },
  { id: "KORALOG", group: "private", name: "Kora Logistics Hub", issuer: "Kora Logistics", type: "Action participante", stage: "Pré-admission", price: 5400, minimumTicket: 40000, description: "Société participante sur la distribution urbaine, les entrepôts mutualisés et les corridors régionaux.", note: "Chaînes logistiques et distribution urbaine", themes: ["logistique", "transport", "commerce"] },
  { id: "WASI-INDEX", group: "fund", name: "WASI Index Fund Core", issuer: "WASI Asset Desk", type: "Fonds indiciel", stage: "Ouvert", price: 10000, minimumTicket: 30000, description: "Exposition diversifiée aux signatures africaines les plus résilientes.", note: "Panier multi-pays orienté leaders africains", themes: ["index", "diversifie", "services", "commerce"] },
  { id: "WASI-UEMOA", group: "fund", name: "WASI UEMOA Leaders", issuer: "WASI Asset Desk", type: "Fonds thématique", stage: "Ouvert", price: 8500, minimumTicket: 25000, description: "Panier UEMOA concentré sur la consommation, la logistique et les services.", note: "Entreprises UEMOA et croissance domestique", themes: ["uemoa", "commerce", "logistique", "services"] },
  { id: "WASI-GROWTH", group: "fund", name: "WASI PME Growth Basket", issuer: "WASI Asset Desk", type: "Panier privé", stage: "Ouvert", price: 12000, minimumTicket: 40000, description: "Panier des sociétés participantes à plus forte dynamique de croissance.", note: "PME participantes et marché privé de croissance", themes: ["pme", "croissance", "innovation", "agro"] },
  { id: "WASI-NOTE", group: "alt", name: "Note privée rendement commerce", issuer: "WASI Credit Desk", type: "Placement alternatif", stage: "Ouvert", price: 15000, minimumTicket: 45000, description: "Produit alternatif conçu autour de flux commerciaux documentés.", note: "Flux adossés au commerce local", themes: ["commerce", "distribution", "services"] },
  { id: "WASI-GOLD", group: "alt", name: "Panier or & matières stratégiques", issuer: "WASI Commodity Desk", type: "Placement alternatif", stage: "Ouvert", price: 18000, minimumTicket: 54000, description: "Panier alternatif pour compléter l'exposition actions privées et fonds indiciels.", note: "Diversification matières premières", themes: ["or", "matiere", "defensif"] }
];
const FILTERS = [
  { id: "private", label: "Nos actions" },
  { id: "fund", label: "Fonds WASI" },
  { id: "alt", label: "Autres placements" }
];

const els = {
  gate: document.getElementById("access-gate"),
  accessInput: document.getElementById("customer-access-input"),
  accessBtn: document.getElementById("access-btn"),
  demoBtn: document.getElementById("demo-access-btn"),
  demoList: document.getElementById("demo-access-list"),
  toast: document.getElementById("toast"),
  toastMessage: document.getElementById("toast-message"),
  toastClose: document.getElementById("toast-close"),
  app: document.getElementById("app"),
  switchCustomerBtn: document.getElementById("switch-customer-btn"),
  heroTier: document.getElementById("hero-tier"),
  heroName: document.getElementById("hero-name"),
  heroSubtitle: document.getElementById("hero-subtitle"),
  heroMetrics: document.getElementById("hero-metrics"),
  featuredStock: document.getElementById("featured-stock"),
  recommendedList: document.getElementById("recommended-list"),
  accessSummary: document.getElementById("access-summary"),
  issuanceSteps: document.getElementById("issuance-steps"),
  assetFilters: document.getElementById("asset-filters"),
  marketList: document.getElementById("market-list"),
  selectedAssetCard: document.getElementById("selected-asset-card"),
  orderQuantity: document.getElementById("order-quantity"),
  qtyMinus: document.getElementById("qty-minus"),
  qtyPlus: document.getElementById("qty-plus"),
  orderSummary: document.getElementById("order-summary"),
  placeOrderBtn: document.getElementById("place-order-btn"),
  walletMetrics: document.getElementById("wallet-metrics"),
  holdingsList: document.getElementById("holdings-list"),
  orderHistory: document.getElementById("order-history"),
  adviceSummary: document.getElementById("advice-summary"),
  adviceSuggestions: document.getElementById("advice-suggestions"),
  adviceThread: document.getElementById("advice-thread"),
  screens: ["home", "invest", "wallet", "advice"].reduce((acc, key) => ({ ...acc, [key]: document.getElementById(`screen-${key}`) }), {}),
  navButtons: [...document.querySelectorAll("#bottom-nav button")],
  jumpButtons: [...document.querySelectorAll("[data-jump-screen]")]
};

const cirex = loadCirex();
const customers = deriveCustomers(cirex);
const portal = loadPortal();
let customer = customers.find((entry) => entry.id === portal.currentCustomerId) || null;
let activeScreen = "home";
let activeGroup = "private";
let selectedAssetId = "CIREX-PS";
let toastTimer = null;

init();

function init() {
  bind();
  renderDemoButtons();
  if (customer) activate(customer, false);
}

function bind() {
  els.accessBtn.addEventListener("click", login);
  els.demoBtn.addEventListener("click", () => customers[0] && activate(customers[0], true));
  els.accessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      login();
    }
  });
  els.toastClose.addEventListener("click", hideToast);
  els.switchCustomerBtn.addEventListener("click", reopenGate);
  els.navButtons.forEach((button) => button.addEventListener("click", () => switchScreen(button.dataset.screen)));
  els.jumpButtons.forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.highlightAsset) selectedAssetId = button.dataset.highlightAsset;
    switchScreen(button.dataset.jumpScreen);
    renderInvest();
  }));
  els.qtyMinus.addEventListener("click", () => nudgeQuantity(-1));
  els.qtyPlus.addEventListener("click", () => nudgeQuantity(1));
  els.orderQuantity.addEventListener("input", renderOrderSummary);
  els.placeOrderBtn.addEventListener("click", placeOrder);
}

function loadCirex() {
  for (const key of CIREX_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.clients) && Array.isArray(parsed.loans)) return parsed;
    } catch {}
  }
  return JSON.parse(JSON.stringify(DEMO));
}

function deriveCustomers(state) {
  const list = (state.clients || []).map((client) => {
    const loans = (state.loans || []).filter((loan) => loan.clientId === client.id && Number(loan.outstanding || 0) > 0);
    if (!loans.length) return null;
    const outstanding = loans.reduce((sum, loan) => sum + Number(loan.outstanding || 0), 0);
    const risk = loans.some((loan) => loan.riskFlag === "High") ? "Élevé" : loans.some((loan) => loan.riskFlag === "Medium") ? "Moyen" : "Faible";
    const score = clamp(78 - loans.filter((loan) => loan.riskFlag === "High").length * 18 - loans.filter((loan) => loan.status === "Late").length * 10 + loans.length * 4, 34, 88);
    return {
      id: client.id,
      name: client.name || "Client CIREX",
      sector: client.sector || "Activité non renseignée",
      region: client.region || "Côte d'Ivoire",
      phone: client.phone || "-",
      phoneDigits: String(client.phone || "").replace(/\D/g, ""),
      activeLoanCount: loans.length,
      outstanding,
      risk,
      score,
      tier: score >= 72 ? "Signature" : score >= 56 ? "Croissance" : "Essentiel",
      limit: Math.round(clamp(outstanding * 0.45 + loans.length * 75000, 150000, 1500000))
    };
  }).filter(Boolean);
  return list.length ? list : deriveCustomers(DEMO);
}

function loadPortal() {
  const raw = localStorage.getItem(PORTAL_KEY);
  if (!raw) return { currentCustomerId: null, wallets: {}, holdings: {}, orders: {}, chats: {} };
  try {
    const parsed = JSON.parse(raw);
    return {
      currentCustomerId: parsed.currentCustomerId || null,
      wallets: parsed.wallets || {},
      holdings: parsed.holdings || {},
      orders: parsed.orders || {},
      chats: parsed.chats || {}
    };
  } catch {
    return { currentCustomerId: null, wallets: {}, holdings: {}, orders: {}, chats: {} };
  }
}

function savePortal() {
  localStorage.setItem(PORTAL_KEY, JSON.stringify(portal));
}

function login() {
  const raw = String(els.accessInput.value || "").trim();
  const normalized = normalize(raw);
  const digits = raw.replace(/\D/g, "");
  const match = customers.find((entry) => normalize(entry.id) === normalized || normalize(entry.name) === normalized || (digits && entry.phoneDigits.endsWith(digits)));
  if (!match) return showToast("Aucun client CIREX éligible n'a été trouvé avec cet identifiant.");
  activate(match, true);
}

function activate(nextCustomer, announce) {
  customer = nextCustomer;
  portal.currentCustomerId = customer.id;
  portal.wallets[customer.id] ??= Math.round(customer.limit * 0.55);
  portal.holdings[customer.id] ??= [];
  portal.orders[customer.id] ??= [];
  portal.chats[customer.id] ??= [{
    role: "assistant",
    content: `Bienvenue ${customer.name}. Vous pouvez acheter les titres ouverts à votre profil directement depuis cette app mobile.`
  }];
  selectedAssetId = "CIREX-PS";
  savePortal();
  render();
  els.gate.style.display = "none";
  els.app.hidden = false;
  if (announce) showToast(`Bienvenue ${customer.name}. L'app client est prête.`);
}

function reopenGate() {
  els.accessInput.value = "";
  els.gate.style.display = "flex";
}

function render() {
  if (!customer) return;
  renderShell();
  renderHome();
  renderInvest();
  renderWallet();
  renderAdvice();
}

function renderShell() {
  els.heroTier.textContent = `Profil ${customer.tier}`;
  els.heroName.textContent = customer.name;
  els.heroSubtitle.textContent = `${customer.sector} · ${customer.region} · ${customer.activeLoanCount} prêt(s) actif(s)`;
  els.heroMetrics.innerHTML = [
    metricCard("Enveloppe active", money(customer.limit)),
    metricCard("Liquidité", money(walletBalance())),
    metricCard("Investi", money(investedAmount())),
    metricCard("Risque crédit", customer.risk)
  ].join("");
  els.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.screen === activeScreen));
  Object.entries(els.screens).forEach(([screen, node]) => node.classList.toggle("active", screen === activeScreen));
}

function renderHome() {
  const featured = assetById("CIREX-PS");
  els.featuredStock.innerHTML = featured ? assetCard(featured, {
    note: `Ticket minimum ${money(featured.minimumTicket)} · Action prioritaire ouverte aux clients CIREX.`,
    cta: "Acheter cette émission"
  }) : "";
  wireAssetButtons(els.featuredStock);

  els.recommendedList.innerHTML = recommended().slice(0, 4).map((asset) => assetCard(asset, {
    cta: "Préparer l'achat"
  })).join("");
  wireAssetButtons(els.recommendedList);

  els.accessSummary.innerHTML = [
    detailCard("Encours de crédit", money(customer.outstanding), "Votre accès investisseur s'appuie sur votre relation active avec CIREX."),
    detailCard("Capacité restante", money(Math.max(0, customer.limit - investedAmount())), "Montant encore disponible pour de nouvelles souscriptions."),
    detailCard("Accès autorisés", "Actions privées, fonds WASI, placements complémentaires", "L'ouverture finale reste encadrée par la politique interne et vos validations.")
  ].join("");

  els.issuanceSteps.innerHTML = STEPS.map((step, index) => `
    <div class="step-card">
      <div class="step-num">${index + 1}</div>
      <div class="step-label">${escape(step)}</div>
    </div>
  `).join("");
}

function renderInvest() {
  els.assetFilters.innerHTML = FILTERS.map((filter) => `
    <button class="filter-chip ${filter.id === activeGroup ? "active" : ""}" type="button" data-filter="${filter.id}">
      ${escape(filter.label)}
    </button>
  `).join("");
  [...els.assetFilters.querySelectorAll("[data-filter]")].forEach((button) => button.addEventListener("click", () => {
    activeGroup = button.dataset.filter;
    selectedAssetId = filteredAssets()[0]?.id || "CIREX-PS";
    renderInvest();
  }));

  const assets = filteredAssets();
  els.marketList.innerHTML = assets.length
    ? assets.map((asset) => assetCard(asset, { cta: "Choisir ce titre" })).join("")
    : `<div class="detail-card"><strong>Aucun instrument disponible</strong><p class="detail-copy">Aucun instrument n'est actuellement compatible avec ce profil.</p></div>`;
  wireAssetButtons(els.marketList);

  const asset = selectedAsset();
  els.selectedAssetCard.innerHTML = asset ? `
    <div class="selected-card">
      <div class="asset-head">
        <div>
          <div class="section-kicker">${escape(asset.issuer)}</div>
          <h3>${escape(asset.name)}</h3>
        </div>
        <div class="asset-price">${money(asset.price)}</div>
      </div>
      <p class="asset-copy">${escape(asset.description)}</p>
      <div class="asset-meta">
        <span class="tag gold">${escape(asset.stage)}</span>
        <span class="tag">${escape(asset.type)}</span>
        <span class="tag">${money(asset.minimumTicket)} minimum</span>
      </div>
    </div>
  ` : `<div class="detail-card"><strong>Aucun instrument sélectionné</strong></div>`;
  renderOrderSummary();
}

function renderOrderSummary() {
  const asset = selectedAsset();
  if (!asset || !customer) {
    els.orderSummary.innerHTML = `<div class="order-line"><span>Aucune sélection</span><strong>-</strong></div>`;
    els.placeOrderBtn.disabled = true;
    return;
  }
  const quantity = clamp(Math.round(Number(els.orderQuantity.value || 0)), 1, 999999);
  const gross = asset.price * quantity;
  const remaining = Math.max(0, customer.limit - investedAmount());
  const wallet = walletBalance();
  els.orderQuantity.value = String(quantity);
  els.orderSummary.innerHTML = [
    ["Montant brut", money(gross)],
    ["Ticket minimum", money(asset.minimumTicket)],
    ["Liquidité disponible", money(wallet)],
    ["Capacité restante", money(remaining)]
  ].map(([label, value]) => `<div class="order-line"><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join("");
  els.placeOrderBtn.disabled = gross < asset.minimumTicket || gross > wallet || gross > remaining;
}

function renderWallet() {
  els.walletMetrics.innerHTML = [
    metricCard("Capital investi", money(investedAmount())),
    metricCard("Liquidité restante", money(walletBalance())),
    metricCard("Lignes", `${holdings().length}`),
    metricCard("Ordres", `${orders().length}`)
  ].join("");

  els.holdingsList.innerHTML = holdings().length
    ? holdings().map((holding) => `
      <div class="holding-card">
        <div class="holding-head">
          <div>
            <div class="section-kicker">${escape(holding.type)}</div>
            <h3>${escape(holding.assetName)}</h3>
          </div>
          <div class="asset-price">${money(holding.units * holding.avgPrice)}</div>
        </div>
        <div class="holding-meta">
          <span class="mini-tag gold">${holding.units} unité(s)</span>
          <span class="mini-tag">Prix moyen ${money(holding.avgPrice)}</span>
          <span class="mini-tag">${prettyDate(holding.updatedAt)}</span>
        </div>
      </div>
    `).join("")
    : `<div class="detail-card"><strong>Aucune ligne ouverte</strong><p class="detail-copy">Le client n'a pas encore acheté de titre depuis cette app.</p></div>`;

  els.orderHistory.innerHTML = orders().length
    ? orders().slice(0, 10).map((order) => `
      <div class="detail-card">
        <div class="detail-row">
          <strong>${escape(order.assetName)}</strong>
          <span class="status-pill">${escape(order.status)}</span>
        </div>
        <div class="history-line">
          <span class="history-tag">${order.units} unité(s)</span>
          <span class="history-tag">${money(order.total)}</span>
          <span class="history-tag">${prettyDate(order.placedAt)}</span>
        </div>
      </div>
    `).join("")
    : `<div class="detail-card"><strong>Aucun ordre pour l'instant</strong><p class="detail-copy">Les achats validés apparaîtront ici automatiquement.</p></div>`;
}

function renderAdvice() {
  els.adviceSummary.innerHTML = [
    detailCard("Profil investisseur", `${customer.tier} · score ${customer.score}/100`, "Le niveau d'accès marché dépend de la qualité de la relation de crédit et du risque observé."),
    detailCard("Instrument conseillé", recommended()[0]?.name || "CIREX Private Stock", answer("Quelle allocation convient à mon profil ?")),
    detailCard("Passerelle complète", "WASI Intelligence disponible", "Le portail complet permet d'aller plus loin si vous souhaitez une vue plus large du marché.")
  ].join("");

  els.adviceSuggestions.innerHTML = QUESTIONS.map((question) => `
    <button class="suggestion-btn" type="button" data-question="${escape(question)}">${escape(question)}</button>
  `).join("");
  [...els.adviceSuggestions.querySelectorAll("[data-question]")].forEach((button) => button.addEventListener("click", () => ask(button.dataset.question)));

  els.adviceThread.innerHTML = (portal.chats[customer.id] || []).slice(-6).map((message) => `
    <div class="thread-bubble ${escape(message.role)}">
      <div class="thread-role">${message.role === "assistant" ? "WASI" : "Client"}</div>
      <div>${escape(message.content)}</div>
    </div>
  `).join("");
}

function renderDemoButtons() {
  els.demoList.innerHTML = customers.slice(0, 3).map((entry) => `
    <button class="demo-pill" type="button" data-customer-id="${entry.id}">
      ${escape(entry.name)} · ${escape(entry.id)}
    </button>
  `).join("");
  [...els.demoList.querySelectorAll("[data-customer-id]")].forEach((button) => button.addEventListener("click", () => {
    const match = customers.find((entry) => entry.id === button.dataset.customerId);
    if (match) activate(match, true);
  }));
}

function wireAssetButtons(scope) {
  [...scope.querySelectorAll("[data-buy-asset]")].forEach((button) => button.addEventListener("click", () => {
    selectedAssetId = button.dataset.buyAsset;
    activeGroup = assetById(selectedAssetId)?.group || activeGroup;
    switchScreen("invest");
    renderInvest();
  }));
}

function ask(question) {
  if (!customer || !question) return;
  portal.chats[customer.id].push({ role: "user", content: question }, { role: "assistant", content: answer(question) });
  savePortal();
  renderAdvice();
}

function answer(question) {
  const msg = normalize(question);
  const cirexStock = assetById("CIREX-PS");
  const topFund = assetById("WASI-INDEX");
  const best = recommended()[0] || cirexStock;
  if (msg.includes("cirex") || msg.includes("private stock")) {
    return `Oui. ${cirexStock.name} est accessible à partir de ${money(cirexStock.minimumTicket)} avec un prix indicatif de ${money(cirexStock.price)} par unité.`;
  }
  if (msg.includes("ticket") || msg.includes("minimum")) {
    return `Le ticket minimum dépend du titre choisi. Pour ${best.name}, il faut prévoir ${money(best.minimumTicket)} au minimum dans l'enveloppe active du client.`;
  }
  if (msg.includes("fonds") || msg.includes("index")) {
    return `${topFund.name} reste le point d'entrée le plus simple pour commencer grâce à une exposition diversifiée et un ticket minimum de ${money(topFund.minimumTicket)}.`;
  }
  return `Pour votre profil ${customer.tier.toLowerCase()}, l'actif qui ressort en priorité est ${best.name}. Il reste cohérent avec votre secteur ${customer.sector.toLowerCase()} et votre enveloppe actuelle de ${money(customer.limit)}.`;
}

function switchScreen(screen) {
  activeScreen = screen;
  renderShell();
}

function nudgeQuantity(delta) {
  els.orderQuantity.value = String(clamp(Number(els.orderQuantity.value || 1) + delta, 1, 999999));
  renderOrderSummary();
}

function filteredAssets() {
  return ASSETS.filter((asset) => asset.group === activeGroup && asset.minimumTicket <= Math.max(customer.limit, walletBalance()));
}

function selectedAsset() {
  const allowed = filteredAssets();
  if (!allowed.length) return null;
  if (allowed.some((asset) => asset.id === selectedAssetId)) return assetById(selectedAssetId);
  selectedAssetId = allowed[0]?.id || "CIREX-PS";
  return assetById(selectedAssetId) || null;
}

function placeOrder() {
  const asset = selectedAsset();
  const quantity = clamp(Math.round(Number(els.orderQuantity.value || 0)), 1, 999999);
  if (!asset) return;
  const total = asset.price * quantity;
  if (total < asset.minimumTicket) return showToast(`Le ticket minimum pour ${asset.name} est ${money(asset.minimumTicket)}.`);
  if (total > walletBalance()) return showToast("La liquidité disponible dans ce portefeuille est insuffisante.");
  if (total > Math.max(0, customer.limit - investedAmount())) return showToast("L'ordre dépasse la capacité d'accès marché active pour ce client.");

  portal.wallets[customer.id] -= total;
  const existing = holdings().find((holding) => holding.assetId === asset.id);
  if (existing) {
    const units = existing.units + quantity;
    existing.avgPrice = Math.round(((existing.avgPrice * existing.units) + (asset.price * quantity)) / units);
    existing.units = units;
    existing.updatedAt = new Date().toISOString();
  } else {
    holdings().push({ assetId: asset.id, assetName: asset.name, type: asset.type, units: quantity, avgPrice: asset.price, updatedAt: new Date().toISOString() });
  }
  orders().unshift({ id: `ORD-${Date.now()}`, assetName: asset.name, units: quantity, total, status: "Validé app", placedAt: new Date().toISOString() });
  savePortal();
  render();
  switchScreen("wallet");
  showToast(`Ordre enregistré: ${quantity} unité(s) de ${asset.name}.`);
}

function recommended() {
  return [...ASSETS].filter((asset) => asset.minimumTicket <= customer.limit).sort((left, right) => scoreAsset(right) - scoreAsset(left));
}

function scoreAsset(asset) {
  const sector = normalize(customer.sector);
  const themeBoost = asset.themes.some((theme) => sector.includes(normalize(theme))) ? 18 : 0;
  const relationshipBoost = asset.id === "CIREX-PS" ? 16 : 0;
  const stageBoost = asset.stage === "Ouvert" || asset.stage === "Cotation privée" ? 10 : 4;
  const pricePenalty = asset.minimumTicket > customer.limit * 0.6 ? 10 : 0;
  return themeBoost + relationshipBoost + stageBoost - pricePenalty;
}

function assetCard(asset, options = {}) {
  return `
    <article class="asset-card">
      <div class="asset-head">
        <div>
          <div class="section-kicker">${escape(asset.issuer)}</div>
          <h3>${escape(asset.name)}</h3>
        </div>
        <div class="asset-price">${money(asset.price)}</div>
      </div>
      <p class="asset-copy">${escape(options.note || asset.description)}</p>
      <div class="asset-meta">
        <span class="tag gold">${escape(asset.stage)}</span>
        <span class="tag">${escape(asset.type)}</span>
        <span class="tag">${money(asset.minimumTicket)} minimum</span>
      </div>
      <div class="asset-actions">
        <button class="action-chip" type="button" data-buy-asset="${asset.id}">${escape(options.cta || "Acheter")}</button>
      </div>
    </article>
  `;
}

function detailCard(title, value, copy) {
  return `
    <div class="detail-card">
      <div class="detail-row">
        <strong>${escape(title)}</strong>
        <span class="detail-chip">${escape(value)}</span>
      </div>
      <p class="detail-copy">${escape(copy)}</p>
    </div>
  `;
}

function metricCard(label, value) {
  return `
    <div class="metric-card">
      <div class="metric-label">${escape(label)}</div>
      <div class="metric-value">${escape(value)}</div>
    </div>
  `;
}

function assetById(id) {
  return ASSETS.find((asset) => asset.id === id) || null;
}

function holdings() {
  return portal.holdings[customer.id] || [];
}

function orders() {
  return portal.orders[customer.id] || [];
}

function walletBalance() {
  return Number(portal.wallets[customer.id] || 0);
}

function investedAmount() {
  return holdings().reduce((sum, holding) => sum + Number(holding.units || 0) * Number(holding.avgPrice || 0), 0);
}

function showToast(message) {
  els.toastMessage.textContent = message;
  els.toast.className = "toast show";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4200);
}

function hideToast() {
  els.toast.className = "toast";
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function prettyDate(value) {
  try {
    return new Date(value).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return String(value || "-");
  }
}

function money(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escape(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
