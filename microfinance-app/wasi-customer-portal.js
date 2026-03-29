const CIREX_KEYS = ["cirex_microfinance_state_v3", "cirex_microfinance_state_v2"];
const PORTAL_KEY = "wasi_customer_portal_state_v1";
const WASI_URL = "https://atarawendesidkabore-hash.github.io/wasi-platform/index.html?excel_auto=1";
const STEPS = ["Candidature", "Analyse WASI (48h)", "Compartiment", "Structuration", "Book Building (15j)", "Admission (30j)", "Cotation", "Suivi"];
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
const QUESTIONS = [
  "Quels titres privés me sont ouverts aujourd'hui ?",
  "Comment fonctionne le processus d'émission WASI ?",
  "Quel fonds WASI est le plus simple pour commencer ?",
  "Puis-je acheter CIREX Private Stock avec mon accès actuel ?"
];

const els = {
  gate: document.getElementById("access-gate"),
  accessInput: document.getElementById("customer-access-input"),
  accessBtn: document.getElementById("access-btn"),
  demoBtn: document.getElementById("demo-access-btn"),
  demoList: document.getElementById("demo-access-list"),
  app: document.getElementById("app"),
  notifBar: document.getElementById("notif-bar"),
  notifMsg: document.getElementById("notif-msg"),
  notifClose: document.getElementById("notif-close"),
  navButtons: [...document.querySelectorAll("#main-nav button")],
  customerChip: document.getElementById("customer-chip"),
  ticker: document.getElementById("ticker-track"),
  hero: document.getElementById("hero-strip"),
  clientProfile: document.getElementById("client-profile-card"),
  eligibilityList: document.getElementById("eligibility-list"),
  relationship: document.getElementById("relationship-summary"),
  watchlist: document.getElementById("watchlist"),
  chatMessages: document.getElementById("chat-messages"),
  chatSuggestions: document.getElementById("chat-suggestions"),
  chatForm: document.getElementById("chat-form"),
  chatInput: document.getElementById("chat-input"),
  chatFocus: document.getElementById("chat-focus"),
  portalStatus: document.getElementById("portal-status"),
  jumpPrivateBtn: document.getElementById("jump-private-btn"),
  jumpFundsBtn: document.getElementById("jump-funds-btn"),
  issuance: document.getElementById("issuance-flow"),
  privateListings: document.getElementById("private-listings"),
  orderAsset: document.getElementById("order-asset"),
  orderQuantity: document.getElementById("order-quantity"),
  orderSummary: document.getElementById("order-summary"),
  placeOrderBtn: document.getElementById("place-order-btn"),
  accessPoints: document.getElementById("market-access-points"),
  fundCards: document.getElementById("fund-cards"),
  altCards: document.getElementById("alternative-cards"),
  portfolioMetrics: document.getElementById("portfolio-metrics"),
  holdings: document.getElementById("holdings-table"),
  history: document.getElementById("order-history"),
  screens: ["intel", "private", "funds", "portfolio"].reduce((acc, key) => ({ ...acc, [key]: document.getElementById(`screen-${key}`) }), {})
};

const cirex = loadCirex();
const customers = deriveCustomers(cirex);
const portal = loadPortal();
let customer = customers.find((entry) => entry.id === portal.currentCustomerId) || null;
let activeScreen = "intel";
let notifTimer = null;

init();

function init() {
  bind();
  renderDemoButtons();
  if (customer) activate(customer, false);
}

function bind() {
  els.accessBtn.addEventListener("click", login);
  els.demoBtn.addEventListener("click", () => customers[0] && activate(customers[0], true));
  els.accessInput.addEventListener("keydown", (event) => event.key === "Enter" && (event.preventDefault(), login()));
  els.notifClose.addEventListener("click", hideNotif);
  els.navButtons.forEach((button) => button.addEventListener("click", () => switchScreen(button.dataset.screen)));
  els.chatForm.addEventListener("submit", (event) => { event.preventDefault(); ask(els.chatInput.value); els.chatInput.value = ""; });
  els.jumpPrivateBtn.addEventListener("click", () => switchScreen("private"));
  els.jumpFundsBtn.addEventListener("click", () => switchScreen("funds"));
  els.orderAsset.addEventListener("change", renderOrderSummary);
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
      region: client.region || "Côte d’Ivoire",
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
  const norm = normalize(raw);
  const digits = raw.replace(/\D/g, "");
  const match = customers.find((entry) => normalize(entry.id) === norm || normalize(entry.name) === norm || (digits && entry.phoneDigits.endsWith(digits)));
  if (!match) return showNotif("Aucun client CIREX éligible n'a été trouvé avec cet identifiant.", "error");
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
    content: `Bienvenue ${customer.name}. Votre accès investisseur est actif grâce à ${customer.activeLoanCount} prêt(s) CIREX en cours.`
  }];
  savePortal();
  render();
  els.gate.style.display = "none";
  els.app.hidden = false;
  if (announce) showNotif(`Bienvenue ${customer.name}. Votre portail WASI client est ouvert.`, "success");
}

function render() {
  renderNav();
  renderTicker();
  renderHero();
  renderProfile();
  renderIntel();
  renderMarket();
  renderFunds();
  renderPortfolio();
}

function renderNav() {
  els.customerChip.textContent = `${customer.name} · ${customer.tier}`;
  els.portalStatus.textContent = `${customer.activeLoanCount} prêt(s) actif(s)`;
  els.chatFocus.textContent = `Focus : ${customer.sector} · ${customer.region}`;
  els.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.screen === activeScreen));
  Object.entries(els.screens).forEach(([key, screen]) => screen.classList.toggle("active", key === activeScreen));
}

function renderTicker() {
  const html = ASSETS.slice(0, 6).map((asset, index) => {
    const move = index % 2 === 0 ? `+${(index + 1.3).toFixed(1)}%` : `-${(index + 0.7).toFixed(1)}%`;
    return `<div class="ticker-item"><strong>${escape(asset.name)}</strong><span>${money(asset.price)}</span><span class="${move.startsWith("+") ? "pos" : "neg"}">${move}</span></div>`;
  }).join("");
  els.ticker.innerHTML = `${html}${html}`;
}

function renderHero() {
  const invested = investedAmount();
  const wallet = walletBalance();
  const remaining = Math.max(0, customer.limit - invested);
  const items = [
    ["Enveloppe investisseur", money(customer.limit), "Capacité d'accès marché calculée à partir de la relation de crédit active."],
    ["Liquidité disponible", money(wallet), "Solde client simulé pour les ordres de marché privé et fonds WASI."],
    ["Capital déjà alloué", money(invested), `${holdings().length} ligne(s) déjà ouvertes sur le portail.`],
    ["Capacité restante", money(remaining), `${recommended().length} instrument(s) compatibles avec le profil client.`]
  ];
  els.hero.innerHTML = items.map(([label, value, note]) => `<article class="hero-card"><div class="hero-label">${escape(label)}</div><div class="hero-value">${escape(value)}</div><div class="hero-note">${escape(note)}</div></article>`).join("");
}

function renderProfile() {
  els.clientProfile.innerHTML = [
    `<div class="stack-item"><strong>${escape(customer.name)}</strong><p>${escape(customer.sector)} · ${escape(customer.region)}</p><div class="chip-row" style="margin-top:10px;"><span class="mini-tag gold">${escape(customer.tier)}</span><span class="mini-tag good">${customer.activeLoanCount} prêt(s) actif(s)</span><span class="mini-tag">Score ${customer.score}/100</span></div></div>`,
    `<div class="stack-item"><strong>Identifiants d'accès</strong><p>Code client : ${escape(customer.id)}</p><p>Téléphone : ${escape(customer.phone)}</p></div>`,
    `<div class="stack-item"><strong>Cadre d'accès</strong><p>Accès réservé aux clients CIREX avec prêt actif, sous réserve de revue interne et des validations réglementaires applicables.</p></div>`
  ].join("");
}

function renderIntel() {
  const accesses = [
    ["Actions privées participantes", "Acheter des titres privés ouverts aux clients CIREX dans le marché WASI."],
    ["CIREX Private Stock", "Souscrire au titre privé CIREX destiné à la base client et à l'expansion du réseau."],
    ["Fonds WASI", "Accéder au WASI Index Fund et aux paniers thématiques construits pour les particuliers."],
    ["Autres placements", "Compléter l'exposition actions avec des placements alternatifs supervisés."]
  ];
  els.eligibilityList.innerHTML = accesses.map(([title, description]) => `<div class="access-item"><strong>${escape(title)}</strong><p>${escape(description)}</p></div>`).join("");
  els.relationship.innerHTML = [["Encours crédit", money(customer.outstanding)], ["Plafond d'accès marché", money(customer.limit)], ["Niveau de risque crédit", customer.risk], ["Passerelle complète", "Plateforme WASI disponible"]].map(([label, value]) => `<div class="summary-row"><div class="hero-label">${escape(label)}</div><div class="hero-value" style="font-size:1rem;">${escape(value)}</div></div>`).join("");
  els.watchlist.innerHTML = recommended().slice(0, 4).map((asset) => `<div class="watch-item"><strong>${escape(asset.name)}</strong><p>${escape(asset.note)}</p><div class="chip-row" style="margin-top:10px;"><span class="mini-tag gold">${escape(asset.stage)}</span><span class="mini-tag">${money(asset.price)}</span></div></div>`).join("");
  els.chatSuggestions.innerHTML = QUESTIONS.map((question) => `<button class="secondary-chip" type="button">${escape(question)}</button>`).join("");
  [...els.chatSuggestions.querySelectorAll(".secondary-chip")].forEach((button) => button.addEventListener("click", () => ask(button.textContent.trim())));
  els.chatMessages.innerHTML = (portal.chats[customer.id] || []).map((message) => `<div class="chat-msg ${escape(message.role)}">${escape(message.content)}</div>`).join("");
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
}

function ask(question) {
  if (!customer || !question || !question.trim()) return;
  portal.chats[customer.id].push({ role: "user", content: question.trim() }, { role: "assistant", content: answer(question.trim()) });
  savePortal();
  renderIntel();
}

function answer(question) {
  const msg = normalize(question);
  const cirexStock = assetById("CIREX-PS");
  const topFund = assetById("WASI-INDEX");
  const best = recommended()[0] || cirexStock;
  if (msg.includes("cirex") || msg.includes("private stock")) return `Oui. ${cirexStock.name} est accessible à partir de ${money(cirexStock.minimumTicket)}. Le prix indicatif est ${money(cirexStock.price)} par unité, dans la limite de votre enveloppe investisseur de ${money(customer.limit)}.`;
  if (msg.includes("emission") || msg.includes("book") || msg.includes("cotation")) return "Le parcours d'émission suit huit étapes: candidature, analyse WASI, compartiment, structuration, book building, admission, cotation puis suivi. Le portail client vous montre les opportunités déjà ouvertes à la souscription.";
  if (msg.includes("fonds") || msg.includes("index") || msg.includes("etf")) return `${topFund.name} est le point d'entrée le plus simple: ticket minimum ${money(topFund.minimumTicket)}, exposition diversifiée et logique progressive pour les clients qui veulent commencer sans se concentrer sur un seul titre.`;
  if (msg.includes("placement") || msg.includes("alternatif") || msg.includes("autres")) return "En plus des actions privées et des fonds WASI, ce portail ouvre des notes privées commerce et des paniers matières stratégiques comme compléments éventuels à votre allocation principale.";
  return `Pour votre profil ${customer.tier.toLowerCase()}, l'actif le plus cohérent à regarder en premier est ${best.name}. Il reste compatible avec votre enveloppe de ${money(customer.limit)}.`;
}

function renderMarket() {
  els.issuance.innerHTML = STEPS.flatMap((step, index) => [`
    <div class="issuance-step"><div class="num">${index + 1}</div><div class="label">${escape(step)}</div></div>
  `, index < STEPS.length - 1 ? '<div class="issuance-arrow">→</div>' : ""]).join("");
  els.privateListings.innerHTML = ASSETS.filter((asset) => asset.group === "private").map((asset) => `
    <article class="listing-card">
      <div><div class="card-kicker">${escape(asset.issuer)}</div><h3>${escape(asset.name)}</h3></div>
      <p>${escape(asset.description)}</p>
      <div class="listing-price">${money(asset.price)}</div>
      <div class="listing-meta"><span>${escape(asset.type)}</span><span>${escape(asset.stage)}</span><span>${money(asset.minimumTicket)} minimum</span></div>
      <div class="listing-tags"><span>${escape(asset.note)}</span></div>
      <button class="listing-action" type="button" data-asset-id="${asset.id}" ${asset.minimumTicket > customer.limit ? "disabled" : ""}>Préparer un achat client</button>
    </article>
  `).join("");
  [...els.privateListings.querySelectorAll("[data-asset-id]")].forEach((button) => button.addEventListener("click", () => { els.orderAsset.value = button.dataset.assetId; switchScreen("private"); renderOrderSummary(); }));
  els.orderAsset.innerHTML = ASSETS.filter((asset) => asset.minimumTicket <= Math.max(customer.limit, walletBalance())).map((asset) => `<option value="${asset.id}">${escape(asset.name)} · ${money(asset.price)}</option>`).join("");
  if (!els.orderAsset.value && els.orderAsset.options.length) els.orderAsset.value = els.orderAsset.options[0].value;
  els.accessPoints.innerHTML = [
    `Accès client actuel : ${customer.tier}`,
    `Prêt(s) actif(s) retenu(s) : ${customer.activeLoanCount}`,
    `Plafond interne d'accès marché : ${money(customer.limit)}`,
    `Plateforme complète : ${WASI_URL}`
  ].map((entry) => `<div class="stack-item"><p>${escape(entry)}</p></div>`).join("");
  renderOrderSummary();
}

function renderOrderSummary() {
  const asset = selectedAsset();
  if (!asset) {
    els.orderSummary.innerHTML = `<div class="order-row"><span>Aucun instrument disponible</span><strong>-</strong></div>`;
    els.placeOrderBtn.disabled = true;
    return;
  }
  const quantity = clamp(Number(els.orderQuantity.value || 0), 1, 999999);
  const gross = asset.price * quantity;
  const remaining = Math.max(0, customer.limit - investedAmount());
  const wallet = walletBalance();
  els.orderQuantity.value = String(quantity);
  els.orderSummary.innerHTML = [["Instrument", asset.name], ["Montant brut", money(gross)], ["Ticket minimum", money(asset.minimumTicket)], ["Capacité restante", money(remaining)], ["Liquidité disponible", money(wallet)]].map(([label, value]) => `<div class="order-row"><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join("");
  els.placeOrderBtn.disabled = gross < asset.minimumTicket || gross > wallet || gross > remaining;
}

function placeOrder() {
  const asset = selectedAsset();
  const quantity = clamp(Number(els.orderQuantity.value || 0), 1, 999999);
  const total = asset.price * quantity;
  if (!asset) return;
  if (total < asset.minimumTicket) return showNotif(`Le ticket minimum pour ${asset.name} est ${money(asset.minimumTicket)}.`, "warn");
  if (total > walletBalance()) return showNotif("La liquidité client disponible dans ce portail est insuffisante pour cet ordre.", "warn");
  if (total > Math.max(0, customer.limit - investedAmount())) return showNotif("L'ordre dépasse la capacité d'accès marché actuellement ouverte pour ce client.", "warn");
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
  orders().unshift({ id: `ORD-${Date.now()}`, assetName: asset.name, units: quantity, total, status: "Validé portail", placedAt: new Date().toISOString() });
  savePortal();
  render();
  switchScreen("portfolio");
  showNotif(`Ordre enregistré: ${quantity} unité(s) de ${asset.name}.`, "success");
}

function renderFunds() {
  const renderCard = (asset) => `
    <article class="listing-card">
      <div><div class="card-kicker">${escape(asset.issuer)}</div><h3>${escape(asset.name)}</h3></div>
      <p>${escape(asset.description)}</p>
      <div class="listing-meta"><span>${escape(asset.type)}</span><span>${escape(asset.stage)}</span><span>${money(asset.minimumTicket)} minimum</span></div>
      <div class="listing-tags"><span>${escape(asset.note)}</span></div>
      <button class="listing-action" type="button" data-select-asset="${asset.id}">Préparer une souscription</button>
    </article>
  `;
  els.fundCards.innerHTML = ASSETS.filter((asset) => asset.group === "fund").map(renderCard).join("");
  els.altCards.innerHTML = ASSETS.filter((asset) => asset.group === "alt").map(renderCard).join("");
  [...document.querySelectorAll("[data-select-asset]")].forEach((button) => button.addEventListener("click", () => { els.orderAsset.value = button.dataset.selectAsset; switchScreen("private"); renderOrderSummary(); }));
}

function renderPortfolio() {
  els.portfolioMetrics.innerHTML = [["Capital investi", money(investedAmount())], ["Liquidité restante", money(walletBalance())], ["Lignes ouvertes", `${holdings().length}`], ["Ordres passés", `${orders().length}`]].map(([label, value]) => `<div class="portfolio-metric"><div class="label">${escape(label)}</div><div class="value">${escape(value)}</div></div>`).join("");
  els.holdings.innerHTML = holdings().length ? `
    <div class="table-row header"><div>Instrument</div><div>Quantité</div><div>Prix moyen</div><div>Valeur</div></div>
    ${holdings().map((holding) => `<div class="table-row"><div><strong>${escape(holding.assetName)}</strong><div class="muted">${escape(holding.type)}</div></div><div>${holding.units} unité(s)</div><div>${money(holding.avgPrice)}</div><div>${money(holding.units * holding.avgPrice)}</div></div>`).join("")}
  ` : `<div class="stack-item"><strong>Aucune ligne ouverte</strong><p>Le client n'a pas encore passé d'ordre depuis ce portail.</p></div>`;
  els.history.innerHTML = orders().length ? orders().slice(0, 8).map((order) => `<div class="history-item"><strong>${escape(order.assetName)}</strong><p>${order.units} unité(s) · ${money(order.total)} · ${prettyDate(order.placedAt)}</p><div class="history-tags" style="margin-top:10px;"><span>${escape(order.status)}</span><span>${escape(order.id)}</span></div></div>`).join("") : `<div class="history-item"><strong>Aucun ordre</strong><p>Le journal s'alimentera automatiquement dès qu'une souscription sera enregistrée.</p></div>`;
}

function renderDemoButtons() {
  els.demoList.innerHTML = customers.slice(0, 3).map((entry) => `<button class="demo-credential" type="button" data-customer-id="${entry.id}">${escape(entry.name)} · ${escape(entry.id)}</button>`).join("");
  [...els.demoList.querySelectorAll("[data-customer-id]")].forEach((button) => button.addEventListener("click", () => {
    const match = customers.find((entry) => entry.id === button.dataset.customerId);
    if (match) activate(match, true);
  }));
}

function switchScreen(screen) {
  activeScreen = screen;
  renderNav();
}

function recommended() {
  return [...ASSETS].sort((left, right) => scoreAsset(right) - scoreAsset(left));
}

function scoreAsset(asset) {
  const sector = normalize(customer.sector);
  const themeBoost = asset.themes.some((theme) => sector.includes(normalize(theme))) ? 18 : 0;
  const relationshipBoost = asset.id === "CIREX-PS" ? 14 : 0;
  const stageBoost = asset.stage === "Ouvert" || asset.stage === "Cotation privée" ? 10 : 4;
  const pricePenalty = asset.minimumTicket > customer.limit * 0.6 ? 10 : 0;
  return themeBoost + relationshipBoost + stageBoost - pricePenalty;
}

function selectedAsset() {
  return ASSETS.find((asset) => asset.id === els.orderAsset.value) || null;
}

function assetById(id) {
  return ASSETS.find((asset) => asset.id === id);
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

function showNotif(message) {
  els.notifMsg.textContent = message;
  els.notifBar.className = "notif-bar show";
  clearTimeout(notifTimer);
  notifTimer = setTimeout(hideNotif, 4200);
}

function hideNotif() {
  els.notifBar.className = "notif-bar";
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
