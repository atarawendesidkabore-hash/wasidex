const STORAGE_KEY = "cirex_microfinance_state_v3";
const IS_STATIC_PUBLIC_DEMO = window.location.hostname.endsWith("github.io");
const API_BASE = window.location.protocol === "file:" ? "http://localhost:3100" : IS_STATIC_PUBLIC_DEMO ? null : "";
const SOURCE_STATUS_POLL_MS = 5 * 60 * 1000;
const INTEREST_CEILING_POLICY = [
  { minimumClients: 0, ceiling: 6, label: "Palier initial" },
  { minimumClients: 1000, ceiling: 9, label: "Palier croissance" },
  { minimumClients: 3000, ceiling: 12, label: "Palier maturité" }
];
const DEFAULT_INTEREST_RATE_CEILING = INTEREST_CEILING_POLICY[0].ceiling;
const MAX_INTEREST_RATE_CEILING = INTEREST_CEILING_POLICY[INTEREST_CEILING_POLICY.length - 1].ceiling;
const STATIC_KNOWLEDGE_PATH = "./data/africa-microfinance-index.json";
const AI_EXAMPLES = [
  "La réglementation BCEAO sur la microfinance s'applique-t-elle au Sénégal ?",
  "Quels textes officiels sur la microfinance sont indexés pour le Burkina Faso ?",
  "La réglementation BCEAO sur la microfinance s'applique-t-elle au Nigeria ?",
  "Quel est le plafond interne de taux dans CIREX ?",
  "Quel dossier de crédit demande un suivi prioritaire aujourd'hui ?",
  "Que dois-je vérifier avant d'accorder un nouveau crédit en Côte d'Ivoire ?"
];

const seedState = {
  metadata: {
    institutionName: "CIREX Microfinance",
    institutionCountry: "Côte d’Ivoire",
    legalRegion: "UEMOA / BCEAO",
    baseCurrency: "XOF",
    lastUpdated: "2026-03-29",
    interestCeilingCurrent: DEFAULT_INTEREST_RATE_CEILING
  },
  branches: [
    { id: "BR-01", name: "Abidjan Centre", region: "Abidjan" },
    { id: "BR-02", name: "Bouaké Marché", region: "Bouaké" },
    { id: "BR-03", name: "Daloa Terrain", region: "Daloa" }
  ],
  officers: [
    { id: "OF-01", name: "Jean Kouassi", branchId: "BR-01" },
    { id: "OF-02", name: "Awa Bamba", branchId: "BR-02" },
    { id: "OF-03", name: "Serge Yao", branchId: "BR-03" }
  ],
  clients: [],
  loans: [],
  repayments: []
};

let state = loadState();
const VIEW_LABELS = {
  overview: "Vue d'ensemble",
  clients: "Clients",
  loans: "Crédits",
  repayments: "Remboursements",
  advisor: "Conseiller IA"
};

const STATUS_LABELS = {
  Current: "En cours",
  Watch: "Sous surveillance",
  Late: "En retard"
};

const RISK_LABELS = {
  Low: "Faible",
  Medium: "Moyen",
  High: "Élevé"
};

const viewMeta = {
  overview: "Suivez les signaux du portefeuille, la visibilité des agences, l'exposition des agents de crédit et la qualité des emprunteurs sur un seul écran.",
  clients: "Enregistrez les clients, rattachez-les à la bonne agence et gardez les notes de relation au plus près du portefeuille.",
  loans: `N'accordez de nouveaux crédits qu'après validation du contrôle IA sur le cadre juridique applicable à votre institution et sur le plafond interne progressif CIREX : ${describeInterestCeilingPolicy()}`,
  repayments: "Enregistrez les remboursements avec le même filtre de conformité pour garder les encaissements cohérents avec le portefeuille et la réglementation.",
  advisor: "Interrogez l'IA intégrée sur la réglementation microfinance africaine, la couverture pays, l'état des sources et les priorités du portefeuille."
};

const aiHistory = [];
let staticKnowledgePromise = null;

const els = {
  viewTitle: document.getElementById("view-title"),
  viewDescription: document.getElementById("view-description"),
  institutionCard: document.getElementById("institution-card"),
  pulseCard: document.getElementById("pulse-card"),
  lastUpdated: document.getElementById("last-updated"),
  heroStrip: document.getElementById("hero-strip"),
  portfolioSpotlight: document.getElementById("portfolio-spotlight"),
  collectionSpotlight: document.getElementById("collection-spotlight"),
  navItems: [...document.querySelectorAll(".nav-item")],
  views: [...document.querySelectorAll(".view")],
  statsGrid: document.getElementById("stats-grid"),
  riskList: document.getElementById("risk-list"),
  branchTable: document.getElementById("branch-table"),
  officerTable: document.getElementById("officer-table"),
  scoreTable: document.getElementById("score-table"),
  clientForm: document.getElementById("client-form"),
  clientBranchSelect: document.getElementById("client-branch-select"),
  clientOfficerSelect: document.getElementById("client-officer-select"),
  clientList: document.getElementById("client-list"),
  loanForm: document.getElementById("loan-form"),
  loanClientSelect: document.getElementById("loan-client-select"),
  loanBranchSelect: document.getElementById("loan-branch-select"),
  loanOfficerSelect: document.getElementById("loan-officer-select"),
  loanInterestInput: document.querySelector('#loan-form [name="interestRate"]'),
  loanComplianceCard: document.getElementById("loan-compliance-card"),
  loanSubmitBtn: document.getElementById("loan-submit-btn"),
  loanList: document.getElementById("loan-list"),
  repaymentForm: document.getElementById("repayment-form"),
  repaymentLoanSelect: document.getElementById("repayment-loan-select"),
  repaymentComplianceCard: document.getElementById("repayment-compliance-card"),
  repaymentSubmitBtn: document.getElementById("repayment-submit-btn"),
  repaymentList: document.getElementById("repayment-list"),
  resetBtn: document.getElementById("reset-btn"),
  exportBtn: document.getElementById("export-btn"),
  aiMetaPills: document.getElementById("ai-meta-pills"),
  aiExamples: document.getElementById("ai-example-prompts"),
  aiChatLog: document.getElementById("ai-chat-log"),
  aiForm: document.getElementById("ai-form"),
  aiQuestion: document.getElementById("ai-question"),
  aiSubmitBtn: document.getElementById("ai-submit-btn"),
  aiSourceTitle: document.getElementById("ai-source-title"),
  aiSourceDescription: document.getElementById("ai-source-description"),
  aiSourceLinks: document.getElementById("ai-source-links"),
  aiRefreshBtn: document.getElementById("ai-refresh-btn")
};

init();

function init() {
  bindNavigation();
  bindForms();
  bindActions();
  bindAi();
  renderAll();
  renderComplianceIdleStates();
  renderAiExamples();
  loadAiSourceDetails();
  startSourceStatusPolling();
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return JSON.parse(JSON.stringify(seedState));
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return JSON.parse(JSON.stringify(seedState));
  }
}

function normalizeState(saved) {
  const stateCopy = JSON.parse(JSON.stringify(seedState));
  Object.assign(stateCopy.metadata, saved.metadata || {});
  stateCopy.branches = Array.isArray(saved.branches) && saved.branches.length ? saved.branches : stateCopy.branches;
  stateCopy.officers = Array.isArray(saved.officers) && saved.officers.length ? saved.officers : stateCopy.officers;
  stateCopy.clients = Array.isArray(saved.clients) ? saved.clients.map((client, index) => ({
    ...client,
    branchId: client.branchId || stateCopy.branches[index % stateCopy.branches.length].id,
    officerId: client.officerId || stateCopy.officers[index % stateCopy.officers.length].id
  })) : stateCopy.clients;
  stateCopy.loans = Array.isArray(saved.loans) ? saved.loans.map((loan) => {
    const linkedClient = stateCopy.clients.find((client) => client.id === loan.clientId);
    return {
      ...loan,
      branchId: loan.branchId || linkedClient?.branchId || stateCopy.branches[0].id,
      officerId: loan.officerId || linkedClient?.officerId || stateCopy.officers[0].id
    };
  }) : stateCopy.loans;
  stateCopy.repayments = Array.isArray(saved.repayments) ? saved.repayments : stateCopy.repayments;
  applyInterestCeilingPolicy(stateCopy);
  return stateCopy;
}

function saveState() {
  applyInterestCeilingPolicy(state);
  state.metadata.lastUpdated = new Date().toISOString().slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getInterestCeilingStageForClientCount(clientCount) {
  const safeClientCount = Number.isFinite(Number(clientCount)) ? Number(clientCount) : 0;
  return INTEREST_CEILING_POLICY.reduce(
    (selectedStage, stage) => (safeClientCount >= stage.minimumClients ? stage : selectedStage),
    INTEREST_CEILING_POLICY[0]
  );
}

function getInterestCeilingStageForCeiling(ceiling) {
  const safeCeiling = Number.isFinite(Number(ceiling)) ? Number(ceiling) : DEFAULT_INTEREST_RATE_CEILING;
  return [...INTEREST_CEILING_POLICY]
    .reverse()
    .find((stage) => safeCeiling >= stage.ceiling) || INTEREST_CEILING_POLICY[0];
}

function applyInterestCeilingPolicy(targetState) {
  if (!targetState?.metadata) return targetState;

  const qualifiedStage = getInterestCeilingStageForClientCount(targetState.clients?.length || 0);
  const storedCeiling = Number(targetState.metadata.interestCeilingCurrent);
  const ratchetedCeiling = Math.max(
    qualifiedStage.ceiling,
    Number.isFinite(storedCeiling) ? storedCeiling : DEFAULT_INTEREST_RATE_CEILING
  );
  const currentCeiling = Math.min(ratchetedCeiling, MAX_INTEREST_RATE_CEILING);
  const currentStage = getInterestCeilingStageForCeiling(currentCeiling);

  targetState.metadata.interestCeilingCurrent = currentCeiling;
  targetState.metadata.interestCeilingUnlockedAtClients = currentStage.minimumClients;

  return targetState;
}

function getCurrentInterestCeiling() {
  const storedCeiling = Number(state.metadata?.interestCeilingCurrent);
  return Number.isFinite(storedCeiling) ? storedCeiling : DEFAULT_INTEREST_RATE_CEILING;
}

function getNextInterestCeilingStage() {
  const currentCeiling = getCurrentInterestCeiling();
  return INTEREST_CEILING_POLICY.find((stage) => stage.ceiling > currentCeiling) || null;
}

function formatCount(value) {
  return Number(value || 0).toLocaleString("fr-FR");
}

function describeInterestCeilingPolicy() {
  return "6% au départ, 9% dès 1 000 clients, puis 12% dès 3 000 clients. Une fois un palier atteint, il reste acquis.";
}

function getInterestCeilingStatusText() {
  const currentCeiling = getCurrentInterestCeiling();
  const nextStage = getNextInterestCeilingStage();

  if (nextStage) {
    return `Le plafond interne actif est de ${currentCeiling}%. Il passera à ${nextStage.ceiling}% lorsque CIREX atteindra ${formatCount(nextStage.minimumClients)} clients.`;
  }

  return `Le plafond interne actif est de ${currentCeiling}%. Le palier final de ${MAX_INTEREST_RATE_CEILING}% est acquis pour la suite des opérations.`;
}

function syncLoanInterestInput() {
  if (!els.loanInterestInput) return;

  const currentCeiling = getCurrentInterestCeiling();
  els.loanInterestInput.max = String(currentCeiling);
  els.loanInterestInput.title = `Plafond interne actuel : ${currentCeiling}%. ${describeInterestCeilingPolicy()}`;
}

function buildInterestCeilingAnswer() {
  const currentCeiling = getCurrentInterestCeiling();
  const nextStage = getNextInterestCeilingStage();

  return {
    answer: nextStage
      ? `Dans CIREX, le plafond interne actuellement appliqué aux nouveaux crédits est de ${currentCeiling}%. La règle maison est évolutive et irréversible: ${describeInterestCeilingPolicy()} Avec ${state.clients.length} clients dans le portefeuille actuel, le prochain palier sera ${nextStage.ceiling}% à ${formatCount(nextStage.minimumClients)} clients.`
      : `Dans CIREX, le plafond interne actuellement appliqué aux nouveaux crédits est de ${currentCeiling}%. ${describeInterestCeilingPolicy()} Le palier final de ${MAX_INTEREST_RATE_CEILING}% est déjà acquis pour la suite de la microfinance.`,
    citations: []
  };
}

function getViewLabel(viewKey) {
  return VIEW_LABELS[viewKey] || viewKey;
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || "-";
}

function getRiskLabel(riskFlag) {
  return RISK_LABELS[riskFlag] || riskFlag || "-";
}

function bindNavigation() {
  els.navItems.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.view;
      els.navItems.forEach((item) => item.classList.toggle("active", item === button));
      els.views.forEach((view) => view.classList.toggle("active", view.id === `view-${target}`));
      els.viewTitle.textContent = button.textContent;
      els.viewDescription.textContent = viewMeta[target] || "";
    });
  });
}

function bindForms() {
  els.clientForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state.clients.unshift({
      id: nextId("CL", state.clients, 1000),
      name: form.get("name").trim(),
      sector: form.get("sector").trim(),
      region: form.get("region").trim(),
      phone: form.get("phone").trim(),
      branchId: form.get("branchId"),
      officerId: form.get("officerId"),
      notes: form.get("notes").trim()
    });
    persistAndRefresh(event.currentTarget);
  });

  els.loanForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const draft = buildLoanDraft(form);
    const compliance = await runComplianceCheck({
      operationType: "loan",
      operationData: draft,
      button: els.loanSubmitBtn,
      idleLabel: "Contrôler puis créer le crédit",
      loadingLabel: "Contrôle juridique...",
      resultCard: els.loanComplianceCard
    });

    if (!compliance || compliance.decision !== "APPROVED") {
      return;
    }

    state.loans.unshift({
      id: nextId("LN", state.loans, 2000),
      clientId: draft.clientId,
      branchId: draft.branchId,
      officerId: draft.officerId,
      purpose: draft.purpose,
      principal: draft.principal,
      outstanding: draft.principal,
      interestRate: draft.interestRate,
      termMonths: draft.termMonths,
      nextDueDate: draft.nextDueDate,
      status: draft.status,
      riskFlag: draft.riskFlag
    });
    persistAndRefresh(event.currentTarget);
    renderComplianceResult(els.loanComplianceCard, {
      ...compliance,
      summary: `${compliance.summary} Le crédit a bien été enregistré dans CIREX.`,
    });
  });

  els.repaymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const draft = buildRepaymentDraft(form);
    const compliance = await runComplianceCheck({
      operationType: "repayment",
      operationData: draft,
      button: els.repaymentSubmitBtn,
      idleLabel: "Contrôler puis enregistrer le remboursement",
      loadingLabel: "Contrôle juridique...",
      resultCard: els.repaymentComplianceCard
    });

    if (!compliance || compliance.decision !== "APPROVED") {
      return;
    }

    state.repayments.unshift({
      id: nextId("RP", state.repayments, 4000),
      loanId: draft.loanId,
      amount: draft.amount,
      paymentDate: draft.paymentDate,
      note: draft.note
    });
    const loan = state.loans.find((entry) => entry.id === draft.loanId);
    if (loan) {
      loan.outstanding = Math.max(0, loan.outstanding - draft.amount);
      loan.status = "Current";
      if (loan.outstanding < loan.principal * 0.35) loan.riskFlag = "Low";
    }
    persistAndRefresh(event.currentTarget);
    renderComplianceResult(els.repaymentComplianceCard, {
      ...compliance,
      summary: `${compliance.summary} Le remboursement a bien été enregistré dans CIREX.`,
    });
  });
}

function bindActions() {
  els.resetBtn.addEventListener("click", () => {
    state = JSON.parse(JSON.stringify(seedState));
    saveState();
    renderAll();
    renderComplianceIdleStates();
  });

  els.exportBtn.addEventListener("click", exportData);

  els.clientList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-print-client]");
    if (!button) return;
    printClientStatement(button.dataset.printClient);
  });

  els.repaymentList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-print-repayment]");
    if (!button) return;
    printRepaymentReceipt(button.dataset.printRepayment);
  });
}

function persistAndRefresh(form) {
  saveState();
  form.reset();
  renderAll();
}

function renderAll() {
  syncLoanInterestInput();
  renderShell();
  populateSelects();
  renderOverview();
  renderClients();
  renderLoans();
  renderRepayments();
}

function renderShell() {
  const activeView = getActiveViewKey();
  const outstanding = sum(state.loans.map((loan) => loan.outstanding));
  const totalRepaid = sum(state.repayments.map((repayment) => repayment.amount));
  const lateLoans = state.loans.filter((loan) => loan.status === "Late");
  const watchLoans = state.loans.filter((loan) => loan.status === "Watch");
  const currentInterestCeiling = getCurrentInterestCeiling();
  const nextInterestCeilingStage = getNextInterestCeilingStage();
  const nextDueLoan = [...state.loans]
    .filter((loan) => loan.nextDueDate)
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))[0];
  const bestBranch = getBranchMetrics()[0];

  els.lastUpdated.textContent = `Mise à jour ${prettyDate(state.metadata.lastUpdated)}`;
  els.viewTitle.textContent = getViewLabel(activeView);
  els.viewDescription.textContent = viewMeta[activeView] || "";

  els.institutionCard.innerHTML = `
    <div class="eyebrow">Institution</div>
    <strong>${state.metadata.institutionName}</strong>
    <p>${state.branches.length} agences, ${state.officers.length} agents et ${state.clients.length} clients actifs dans un pilotage local unique.</p>
    <div class="signal-list">
      <div class="signal-row"><span>Pays</span><strong>${state.metadata.institutionCountry || "-"}</strong></div>
      <div class="signal-row"><span>Périmètre légal</span><strong>${state.metadata.legalRegion || "-"}</strong></div>
      <div class="signal-row"><span>Devise</span><strong>${state.metadata.baseCurrency}</strong></div>
      <div class="signal-row"><span>Plafond interne</span><strong>${currentInterestCeiling}%</strong></div>
      <div class="signal-row"><span>Prochain palier</span><strong>${nextInterestCeilingStage ? `${nextInterestCeilingStage.ceiling}% à ${formatCount(nextInterestCeilingStage.minimumClients)} clients` : "Palier final acquis"}</strong></div>
      <div class="signal-row"><span>Encours crédit</span><strong>${money(outstanding)}</strong></div>
      <div class="signal-row"><span>Total encaissé</span><strong>${money(totalRepaid)}</strong></div>
    </div>
  `;

  els.pulseCard.innerHTML = `
    <div class="eyebrow">Pulse Opérationnel</div>
    <strong>Priorité du jour</strong>
    <p>${lateLoans.length ? "Les dossiers en retard demandent une action immédiate." : "Aucun dossier en retard pour l'instant. La situation du portefeuille est plus sereine."}</p>
    <div class="signal-list">
      <div class="signal-row"><span>Dossiers en retard</span><strong>${lateLoans.length}</strong></div>
      <div class="signal-row"><span>Dossiers sous surveillance</span><strong>${watchLoans.length}</strong></div>
      <div class="signal-row"><span>Agence la plus solide</span><strong>${bestBranch?.branch.name || "-"}</strong></div>
      <div class="signal-row"><span>Contrôle juridique</span><strong>IA active</strong></div>
    </div>
  `;

  els.heroStrip.innerHTML = [
    {
      label: "Taille du portefeuille",
      value: money(outstanding),
      note: `${state.loans.length} crédits actifs répartis sur ${state.branches.length} agences.`
    },
    {
      label: "Flux d'encaissement",
      value: money(totalRepaid),
      note: `${state.repayments.length} remboursements déjà enregistrés dans CIREX.`
    },
    {
      label: "Prochaine échéance",
      value: nextDueLoan ? prettyDate(nextDueLoan.nextDueDate) : "Aucune échéance",
      note: nextDueLoan ? `${getClient(nextDueLoan.clientId)?.name || "Client inconnu"} · ${getStatusLabel(nextDueLoan.status)}` : "Créez un crédit pour lancer le calendrier d'échéances."
    }
  ].map((item) => `
    <article class="hero-mini-card">
      <div class="eyebrow">${item.label}</div>
      <strong>${item.value}</strong>
      <p>${item.note}</p>
    </article>
  `).join("");
}

function populateSelects() {
  const clientOptions = state.clients.length
    ? state.clients.map((client) => `<option value="${client.id}">${client.name} - ${client.sector}</option>`).join("")
    : `<option value="" selected disabled>Aucun client enregistré</option>`;
  const branchOptions = state.branches.map((branch) => `<option value="${branch.id}">${branch.name} - ${branch.region}</option>`).join("");
  const officerOptions = state.officers.map((officer) => `<option value="${officer.id}">${officer.name} - ${getBranch(officer.branchId)?.name || officer.branchId}</option>`).join("");
  const loanOptions = state.loans.length
    ? state.loans.map((loan) => `<option value="${loan.id}">${loan.id} - ${getClient(loan.clientId)?.name || "Client inconnu"}</option>`).join("")
    : `<option value="" selected disabled>Aucun crédit enregistré</option>`;
  els.loanClientSelect.innerHTML = clientOptions;
  els.clientBranchSelect.innerHTML = branchOptions;
  els.loanBranchSelect.innerHTML = branchOptions;
  els.clientOfficerSelect.innerHTML = officerOptions;
  els.loanOfficerSelect.innerHTML = officerOptions;
  els.repaymentLoanSelect.innerHTML = loanOptions;
}

function renderOverview() {
  const outstanding = sum(state.loans.map((loan) => loan.outstanding));
  const lateAmount = sum(state.loans.filter((loan) => loan.status === "Late").map((loan) => loan.outstanding));
  const watchAmount = sum(state.loans.filter((loan) => loan.status === "Watch").map((loan) => loan.outstanding));
  const totalCollected = sum(state.repayments.map((repayment) => repayment.amount));
  const lateLoans = state.loans.filter((loan) => loan.status === "Late");
  const nextDueLoan = [...state.loans]
    .filter((loan) => loan.nextDueDate)
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))[0];
  const stats = [
    { label: "Clients", value: String(state.clients.length), note: "Emprunteurs enregistrés" },
    { label: "Encours", value: money(outstanding), note: "Montant restant dû" },
    { label: "Retards", value: String(state.loans.filter((loan) => loan.status === "Late").length), note: "Suivi immédiat requis" },
    { label: "PAR 30", value: pct(outstanding ? (lateAmount / outstanding) * 100 : 0), note: "Part des retards dans le portefeuille" }
  ];
  els.statsGrid.innerHTML = stats.map((item) => `
    <article class="stat-card">
      <div class="eyebrow">${item.label}</div>
      <div class="stat-value">${item.value}</div>
      <div class="stat-note">${item.note}</div>
    </article>
  `).join("");

  els.portfolioSpotlight.innerHTML = `
    <div class="eyebrow">Focus Portefeuille</div>
    <h3>${lateLoans.length ? `${lateLoans.length} dossiers demandent une action directe` : "Le portefeuille est plus stable aujourd'hui"}</h3>
    <p>${lateLoans.length ? `${money(lateAmount)} se trouvent en retard et doivent passer en priorité dans le suivi agent et la revue d'agence.` : "Aucun dossier n'est actuellement dans le seau de retard, ce qui permet à l'équipe de se concentrer sur la discipline d'encaissement et le développement."}</p>
    <div class="pill-row">
      <span class="pill ${lateLoans.length ? "late" : "good"}">${lateLoans.length ? "Pression retard" : "Retards maîtrisés"}</span>
      <span class="pill ${watchAmount ? "watch" : "good"}">${watchAmount ? `${money(watchAmount)} sous surveillance` : "Surveillance légère"}</span>
      <span class="pill good">${pct(outstanding ? ((outstanding - lateAmount) / outstanding) * 100 : 100)} sain</span>
    </div>
  `;

  els.collectionSpotlight.innerHTML = `
    <div class="eyebrow">Focus Encaissement</div>
    <h3>${money(totalCollected)} encaissés à ce jour</h3>
    <p>${nextDueLoan ? `La prochaine collecte attendue est prévue le ${prettyDate(nextDueLoan.nextDueDate)} pour ${getClient(nextDueLoan.clientId)?.name || "Client inconnu"}.` : "Aucune prochaine échéance n'est encore enregistrée. Créez un crédit pour activer le cycle de remboursement."}</p>
    <div class="signal-list">
      <div class="signal-row"><span>Remboursements saisis</span><strong>${state.repayments.length}</strong></div>
      <div class="signal-row"><span>Score moyen client</span><strong>${averageScore().toFixed(0)} / 100</strong></div>
      <div class="signal-row"><span>Agents actifs</span><strong>${state.officers.length}</strong></div>
    </div>
  `;

  const riskCards = [
    { title: "Exposition en retard", body: `${money(lateAmount)} se trouvent actuellement dans le seau de retard.` },
    { title: "Exposition sous surveillance", body: `${money(watchAmount)} sont actuellement sous surveillance.` },
    { title: "Score moyen client", body: `${averageScore().toFixed(0)} / 100 sur l'ensemble des clients.` }
  ];
  els.riskList.innerHTML = riskCards.map((item) => `<article class="stack-card"><strong>${item.title}</strong><div>${item.body}</div></article>`).join("");

  els.branchTable.innerHTML = renderTable(
    ["Agence", "Clients", "Encours", "Retards"],
    getBranchMetrics().map((item) => [item.branch.name, String(item.clientCount), money(item.outstanding), String(item.lateLoans)])
  );
  els.officerTable.innerHTML = renderTable(
    ["Agent", "Agence", "Encours", "Surveillance + retard"],
    getOfficerMetrics().map((item) => [item.officer.name, getBranch(item.officer.branchId)?.name || "-", money(item.outstanding), String(item.riskLoans)])
  );
  els.scoreTable.innerHTML = renderTable(
    ["Client", "Score", "Niveau de risque", "Marge d'épargne"],
    getClientScores().slice(0, 6).map((item) => [item.client.name, String(item.score), item.levelLabel, money(item.savingsBalance)])
  );
}

function renderClients() {
  if (!state.clients.length) {
    els.clientList.innerHTML = `
      <article class="record-card empty-state-card">
        <header>
          <div>
            <h3>Portefeuille client vide</h3>
            <p>Aucun client n'est encore enregistré dans cette instance publique de CIREX.</p>
          </div>
          <span class="pill good">0 dossier</span>
        </header>
        <div class="record-row">
          <span>Commencez par créer votre premier client avec le formulaire à gauche.</span>
        </div>
      </article>
    `;
    return;
  }

  els.clientList.innerHTML = state.clients.map((client) => {
    const score = scoreClient(client.id);
    const loanTotal = sum(state.loans.filter((loan) => loan.clientId === client.id).map((loan) => loan.outstanding));
    return `
      <article class="record-card">
        <header>
          <div>
            <h3>${client.name}</h3>
            <p>${client.sector} - ${client.region}</p>
          </div>
          <span class="pill ${score.pillClass}">Score ${score.score}</span>
        </header>
        <div class="record-row">
          <span class="muted">${client.phone}</span>
          <span class="muted">${client.id}</span>
        </div>
        <div class="record-row">
          <span>${getBranch(client.branchId)?.name || "Aucune agence"} / ${getOfficer(client.officerId)?.name || "Aucun agent"}</span>
          <span>Crédits ${money(loanTotal)}</span>
        </div>
        <div class="record-row">
          <span class="muted">${score.reason}</span>
          <span class="${score.levelClass}">${score.levelLabel}</span>
        </div>
        <div class="record-actions">
          <button class="ghost-btn" data-print-client="${client.id}">Imprimer la fiche</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderLoans() {
  if (!state.loans.length) {
    els.loanList.innerHTML = `
      <article class="record-card empty-state-card">
        <header>
          <div>
            <h3>Aucun crédit en portefeuille</h3>
            <p>Le portefeuille public démarre volontairement vide pour vous laisser construire vos propres dossiers.</p>
          </div>
          <span class="pill good">0 crédit</span>
        </header>
        <div class="record-row">
          <span>Ajoutez d'abord un client, puis créez un premier crédit.</span>
        </div>
      </article>
    `;
    return;
  }

  els.loanList.innerHTML = state.loans.map((loan) => `
    <article class="record-card">
      <header>
        <div>
          <h3>${getClient(loan.clientId)?.name || "Client inconnu"}</h3>
          <p>${loan.purpose}</p>
        </div>
        <span class="pill ${loan.status.toLowerCase()}">${getStatusLabel(loan.status)}</span>
      </header>
      <div class="record-row">
        <span>${money(loan.outstanding)} d'encours</span>
        <span class="pill ${loan.riskFlag.toLowerCase()}">Risque ${getRiskLabel(loan.riskFlag).toLowerCase()}</span>
      </div>
      <div class="record-row">
        <span>${getBranch(loan.branchId)?.name || "Aucune agence"} / ${getOfficer(loan.officerId)?.name || "Aucun agent"}</span>
        <span>Échéance ${prettyDate(loan.nextDueDate)}</span>
      </div>
      <div class="record-row">
        <span class="muted">${loan.interestRate}% sur ${loan.termMonths} mois</span>
        <span class="muted">Score client ${scoreClient(loan.clientId).score}</span>
      </div>
    </article>
  `).join("");
}

function renderRepayments() {
  if (!state.repayments.length) {
    els.repaymentList.innerHTML = `
      <article class="record-card empty-state-card">
        <header>
          <div>
            <h3>Aucun remboursement saisi</h3>
            <p>Le journal d'encaissement est vide tant qu'aucun remboursement n'a encore été enregistré.</p>
          </div>
          <span class="pill good">0 paiement</span>
        </header>
        <div class="record-row">
          <span>Les prochains paiements apparaîtront ici après création des crédits et saisie des encaissements.</span>
        </div>
      </article>
    `;
    return;
  }

  els.repaymentList.innerHTML = state.repayments.slice(0, 12).map((repayment) => {
    const loan = state.loans.find((entry) => entry.id === repayment.loanId);
    const client = loan ? getClient(loan.clientId) : null;
    return `
      <article class="record-card">
        <header>
          <div>
            <h3>${client?.name || "Client inconnu"}</h3>
            <p>${repayment.note}</p>
          </div>
          <span class="pill good">${prettyDate(repayment.paymentDate)}</span>
        </header>
        <div class="record-row">
          <span>${repayment.loanId}</span>
          <span>${money(repayment.amount)}</span>
        </div>
        <div class="record-actions">
          <button class="ghost-btn" data-print-repayment="${repayment.id}">Imprimer le reçu</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderTable(headers, rows) {
  return [
    `<div class="table-row header">${headers.map((item) => `<span>${item}</span>`).join("")}</div>`,
    ...rows.map((row) => `<div class="table-row">${row.map((cell) => `<span>${cell}</span>`).join("")}</div>`)
  ].join("");
}

function getBranchMetrics() {
  return state.branches.map((branch) => {
    const clients = state.clients.filter((client) => client.branchId === branch.id);
    const loans = state.loans.filter((loan) => loan.branchId === branch.id);
    return {
      branch,
      clientCount: clients.length,
      outstanding: sum(loans.map((loan) => loan.outstanding)),
      lateLoans: loans.filter((loan) => loan.status === "Late").length
    };
  }).sort((a, b) => b.outstanding - a.outstanding);
}

function getOfficerMetrics() {
  return state.officers.map((officer) => {
    const loans = state.loans.filter((loan) => loan.officerId === officer.id);
    return {
      officer,
      outstanding: sum(loans.map((loan) => loan.outstanding)),
      riskLoans: loans.filter((loan) => loan.status === "Watch" || loan.status === "Late").length
    };
  }).sort((a, b) => b.outstanding - a.outstanding);
}

function getClientScores() {
  return state.clients.map((client) => scoreClient(client.id)).sort((a, b) => a.score - b.score);
}

function averageScore() {
  const scores = getClientScores();
  return scores.length ? sum(scores.map((item) => item.score)) / scores.length : 0;
}

function scoreClient(clientId) {
  const client = getClient(clientId);
  const loans = state.loans.filter((loan) => loan.clientId === clientId);
  const savingsBalance = 0;
  let score = 100;

  loans.forEach((loan) => {
    if (loan.status === "Late") score -= 35;
    if (loan.status === "Watch") score -= 18;
    if (loan.riskFlag === "High") score -= 15;
    if (loan.riskFlag === "Medium") score -= 8;
    if (loan.outstanding > loan.principal * 0.85) score -= 8;
  });

  score = Math.max(0, Math.min(100, Math.round(score)));

  let levelLabel = "Sain";
  let levelClass = "positive";
  let pillClass = "score-good";
  let reason = "Le comportement de remboursement reste satisfaisant.";

  if (score < 50) {
    levelLabel = "Alerte élevée";
    levelClass = "negative";
    pillClass = "score-low";
    reason = "Les retards ou la faiblesse du dossier imposent un suivi rapproché.";
  } else if (score < 75) {
    levelLabel = "À surveiller";
    levelClass = "warning";
    pillClass = "score-mid";
    reason = "Le dossier n'est pas critique, mais il mérite une attention régulière.";
  }

  return { client, score, levelLabel, levelClass, pillClass, savingsBalance, reason };
}

function getClient(clientId) {
  return state.clients.find((client) => client.id === clientId);
}

function getBranch(branchId) {
  return state.branches.find((branch) => branch.id === branchId);
}

function getOfficer(officerId) {
  return state.officers.find((officer) => officer.id === officerId);
}

function nextId(prefix, items, base) {
  const max = items.reduce((highest, item) => {
    const value = Number(String(item.id).split("-")[1]);
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, base);
  return `${prefix}-${max + 1}`;
}

function sum(values) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

function money(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(value);
}

function pct(value) {
  return `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)}%`;
}

function prettyDate(value) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function prettyDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getActiveViewKey() {
  return els.navItems.find((item) => item.classList.contains("active"))?.dataset.view || "overview";
}

function bindAi() {
  if (els.aiRefreshBtn) {
    els.aiRefreshBtn.addEventListener("click", () => {
      void requestSourceRefresh();
    });
  }

  if (!els.aiForm) return;

  els.aiForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = els.aiQuestion.value.trim();
    if (!question) return;

    addAiMessage("user", question);
    aiHistory.push({ role: "user", content: question });
    els.aiQuestion.value = "";
    setAiLoadingState(true);

    try {
      const payload = IS_STATIC_PUBLIC_DEMO
        ? await answerStaticAiQuestion(question)
        : await (async () => {
            const response = await fetch(apiUrl("/api/ask"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                question,
                history: aiHistory,
                portfolioContext: buildPortfolioContext()
              })
            });

            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.error || "La requête IA a échoué.");
            }

            return result;
          })();

      addAiMessage("assistant", payload.answer, payload.citations || []);
      aiHistory.push({ role: "assistant", content: payload.answer });
    } catch (error) {
      addAiMessage("assistant", error.message);
    } finally {
      setAiLoadingState(false);
    }
  });
}

function renderAiExamples() {
  if (!els.aiExamples) return;

  els.aiExamples.innerHTML = AI_EXAMPLES.map(
    (prompt) => `<button type="button" class="ghost-btn ai-chip" data-ai-prompt="${escapeHtml(prompt)}">${prompt}</button>`
  ).join("");

  els.aiExamples.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ai-prompt]");
    if (!button) return;
    els.aiQuestion.value = button.dataset.aiPrompt;
    els.aiQuestion.focus();
  });
}

async function loadAiSourceDetails(sourceOverride = null) {
  if (!els.aiSourceTitle) return;

  try {
    const source = sourceOverride || await fetchSourceDetails();
    const capturedAt = source.capturedAt ? prettyDateTime(source.capturedAt) : "-";
    const freshness = source.refreshInProgress
      ? "Actualisation"
      : typeof source.sourceAgeHours === "number"
        ? source.sourceAgeHours < 1
          ? "<1h"
          : `${Math.round(source.sourceAgeHours)}h`
        : "-";

    els.aiSourceTitle.textContent = source.sourceLabel;
    els.aiSourceDescription.textContent = source.descriptionText || (
      source.sourceReady
        ? source.refreshInProgress
          ? `Les sources officielles sont en cours d'actualisation. La dernière base complète date du ${capturedAt} et couvre ${source.countryCount} pays africains avec ${source.documentCount} documents officiels.`
          : `Base réglementaire actualisée le ${capturedAt}. L'actualisation quotidienne reste active tant que le serveur CIREX fonctionne, et l'index en cours couvre ${source.countryCount} pays africains ainsi que ${source.documentCount} documents officiels.`
        : `La base réglementaire connectée n'est pas encore prête. ${source.sourceError || ""}`.trim()
    );

    els.aiMetaPills.innerHTML = [
      createAiPill("Pays", String(source.countryCount || 0)),
      createAiPill("Sources", String(source.documentCount || 0)),
      createAiPill("Fraîcheur", freshness),
      createAiPill("Mode", source.modeLabel || (source.aiEnabled ? "Claude actif" : "Sources seules")),
      createAiPill("Serveur", source.serverLabel || (source.sourceReady ? "Connecté" : "En attente"))
    ].join("");

    if (els.aiRefreshBtn) {
      if (source.refreshSupported === false) {
        els.aiRefreshBtn.disabled = true;
        els.aiRefreshBtn.textContent = "Instantané public";
      } else {
        els.aiRefreshBtn.disabled = Boolean(source.refreshInProgress);
        els.aiRefreshBtn.textContent = source.refreshInProgress ? "Actualisation..." : "Actualiser les sources";
      }
    }

    els.aiSourceLinks.innerHTML = (source.keySources || [])
      .map(
        (item) => `
          <a class="signal-row advisor-link" href="${item.url}" target="_blank" rel="noreferrer">
            <span>${item.label}</span>
            <strong>Ouvrir</strong>
          </a>
        `
      )
      .join("");

    if (source.refreshInProgress) {
      window.setTimeout(() => {
        void loadAiSourceDetails();
      }, 5000);
    }
  } catch (error) {
    els.aiSourceTitle.textContent = "Serveur IA CIREX non connecté";
    els.aiSourceDescription.textContent =
      IS_STATIC_PUBLIC_DEMO
        ? "L'instantané public n'a pas pu être chargé. Rechargez la page ou réessayez plus tard."
        : window.location.protocol === "file:"
        ? "Lancez `npm run dev` dans le dossier microfinance-app, puis rouvrez ce fichier ou utilisez http://localhost:3100."
        : "Lancez `npm run dev` dans le dossier microfinance-app pour activer le conseiller IA.";
    els.aiMetaPills.innerHTML = [
      createAiPill("Serveur", "Hors ligne"),
      createAiPill("Astuce", IS_STATIC_PUBLIC_DEMO ? "Recharger la page" : "Lancer npm run dev")
    ].join("");
    els.aiSourceLinks.innerHTML = "";
    if (els.aiRefreshBtn) {
      els.aiRefreshBtn.disabled = IS_STATIC_PUBLIC_DEMO;
      els.aiRefreshBtn.textContent = IS_STATIC_PUBLIC_DEMO ? "Instantané indisponible" : "Actualiser les sources";
    }
  }
}

async function fetchSourceDetails() {
  if (IS_STATIC_PUBLIC_DEMO) {
    return fetchStaticSourceDetails();
  }

  const response = await fetch(apiUrl("/api/source"));
  if (!response.ok) {
    throw new Error("Le serveur IA de CIREX est inaccessible.");
  }

  return response.json();
}

async function requestSourceRefresh() {
  if (!els.aiRefreshBtn) return;

  if (IS_STATIC_PUBLIC_DEMO) {
    const source = await fetchStaticSourceDetails();
    await loadAiSourceDetails({
      ...source,
      descriptionText: `La version publique de CIREX utilise un instantané réglementaire daté du ${
        source.capturedAt ? prettyDateTime(source.capturedAt) : "-"
      }. L'actualisation quotidienne complète reste réservée à l'instance serveur sécurisée.`
    });
    return;
  }

  els.aiRefreshBtn.disabled = true;
  els.aiRefreshBtn.textContent = "Actualisation...";

  try {
    const response = await fetch(apiUrl("/api/source/refresh"), {
      method: "POST"
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "L'actualisation des sources a échoué.");
    }

    await loadAiSourceDetails(payload);
  } catch (error) {
    els.aiSourceDescription.textContent = error.message;
    els.aiRefreshBtn.disabled = false;
    els.aiRefreshBtn.textContent = "Actualiser les sources";
  }
}

function startSourceStatusPolling() {
  if (IS_STATIC_PUBLIC_DEMO) return;

  window.setInterval(() => {
    void loadAiSourceDetails();
  }, SOURCE_STATUS_POLL_MS);
}

function createAiPill(label, value) {
  return `<span class="pill ai-meta-pill"><span>${label}</span><strong>${value}</strong></span>`;
}

function translateKeySourceLabel(label) {
  switch (label) {
    case "African Union member states":
      return "États membres de l'Union africaine";
    case "Burkina Faso Ministry of Finance":
      return "Ministère des finances du Burkina Faso";
    case "BCEAO UMOA member states":
      return "États membres UMOA de la BCEAO";
    case "BCEAO SFD regulation":
      return "Réglementation BCEAO des SFD";
    default:
      return label;
  }
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'")
    .toLowerCase()
    .trim();
}

function getSourceAgeHoursFromCapturedAt(capturedAt) {
  const timestamp = Date.parse(capturedAt || "");
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, (Date.now() - timestamp) / (1000 * 60 * 60));
}

async function getStaticKnowledgeIndex() {
  if (!staticKnowledgePromise) {
    staticKnowledgePromise = fetch(STATIC_KNOWLEDGE_PATH).then(async (response) => {
      if (!response.ok) {
        throw new Error("L'instantané réglementaire public n'a pas pu être chargé.");
      }

      return response.json();
    });
  }

  return staticKnowledgePromise;
}

async function fetchStaticSourceDetails() {
  const index = await getStaticKnowledgeIndex();
  const countryCount = Number(index.countryCount || index.countries?.length || 0);
  const documentCount = Number(index.documentCount || index.documents?.length || 0);
  const capturedAt = index.ingestedAt || null;

  return {
    title: index.title || "Africa Microfinance AI",
    sourceLabel: "Base réglementaire microfinance Afrique",
    archiveUrl: index.siteUrl || "",
    capturedAt,
    countryCount,
    documentCount,
    keySources: (index.keySources || []).map((item) => ({
      ...item,
      label: translateKeySourceLabel(item.label)
    })),
    aiEnabled: false,
    modeLabel: "Démo publique",
    sourceReady: true,
    sourceError: null,
    sourceAgeHours: getSourceAgeHoursFromCapturedAt(capturedAt),
    refreshInProgress: false,
    refreshSupported: false,
    serverLabel: "Instantané public",
    descriptionText: `Version publique de CIREX: instantané réglementaire daté du ${
      capturedAt ? prettyDateTime(capturedAt) : "-"
    }, couvrant ${countryCount} pays africains et ${documentCount} documents officiels. Les réponses restent fondées sur cet instantané local, sans appel au backend privé.`,
  };
}

function findMentionedCountry(question, index) {
  const normalizedQuestion = normalizeSearchText(question);
  const countries = Array.isArray(index?.countries) ? index.countries : [];
  const aliases = countries.flatMap((country) =>
    [country.shortName, country.officialName, ...(country.aliases || [])]
      .filter(Boolean)
      .map((alias) => ({ country, alias, normalizedAlias: normalizeSearchText(alias) }))
  );

  aliases.sort((left, right) => right.normalizedAlias.length - left.normalizedAlias.length);
  return aliases.find((entry) => normalizedQuestion.includes(entry.normalizedAlias))?.country || null;
}

function describeSourceUrl(url, index, country) {
  const keySource = (index?.keySources || []).find((item) => item.url === url);
  if (keySource?.label) {
    return translateKeySourceLabel(keySource.label);
  }

  if (country?.financeAuthority?.url === url) {
    return country.financeAuthority.name;
  }

  if (url.includes("au.int")) {
    return "Profil pays de l'Union africaine";
  }

  if (url.includes("reglementation-des-systemes-financiers-decentralises")) {
    return "Réglementation BCEAO des SFD";
  }

  if (url.includes("etats-membres")) {
    return "États membres UMOA de la BCEAO";
  }

  if (url.includes("finances.gov.bf")) {
    return "Source officielle du Burkina Faso";
  }

  try {
    return new URL(url).hostname;
  } catch {
    return "Source officielle";
  }
}

function buildCountryCitations(country, index, limit = 4) {
  const prefix = String(country?.shortName || "SRC")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 3)
    .toUpperCase() || "SRC";

  return (country?.sourceUrls || [])
    .filter(Boolean)
    .slice(0, limit)
    .map((url, indexWithinCountry) => ({
      id: `${prefix}-${indexWithinCountry + 1}`,
      section: describeSourceUrl(url, index, country),
      sourceUrl: url
    }));
}

function buildPortfolioAnswer(normalizedQuestion) {
  if (/(taux|rate|interet|int[eé]r[eê]t|plafond|ceiling)/.test(normalizedQuestion)) {
    return buildInterestCeilingAnswer();
  }

  const outstanding = state.loans.reduce((sum, loan) => sum + Number(loan.outstanding || 0), 0);
  const lateLoans = state.loans
    .filter((loan) => loan.status === "Late")
    .sort((left, right) => Number(right.outstanding || 0) - Number(left.outstanding || 0));
  const watchLoans = state.loans
    .filter((loan) => loan.status === "Watch")
    .sort((left, right) => Number(right.outstanding || 0) - Number(left.outstanding || 0));
  const priorityLoan = lateLoans[0] || watchLoans[0] || state.loans[0] || null;

  const branchExposure = state.branches
    .map((branch) => ({
      branch,
      outstanding: state.loans
        .filter((loan) => loan.branchId === branch.id)
        .reduce((sum, loan) => sum + Number(loan.outstanding || 0), 0)
    }))
    .sort((left, right) => right.outstanding - left.outstanding)[0];

  if (priorityLoan && /(suivi|prioritaire|retard|urgent)/.test(normalizedQuestion)) {
    const client = getClient(priorityLoan.clientId);
    return {
      answer: `Le dossier prioritaire dans la démo publique est ${priorityLoan.id} pour ${client?.name || "un client non identifié"}. Le crédit est ${
        getStatusLabel(priorityLoan.status).toLowerCase()
      }, avec un encours de ${money(priorityLoan.outstanding)} et une prochaine échéance au ${prettyDate(priorityLoan.nextDueDate)}.`,
      citations: []
    };
  }

  if (branchExposure && /(agence|branche).*(exposee|exposition)|plus exposee/.test(normalizedQuestion)) {
    return {
      answer: `L'agence la plus exposée est ${branchExposure.branch.name}, avec un encours agrégé de ${money(
        branchExposure.outstanding
      )}.`,
      citations: []
    };
  }

  if (/(encours|portefeuille|outstanding|resume)/.test(normalizedQuestion)) {
    return {
      answer: `Le portefeuille public CIREX contient ${state.loans.length} crédits, ${state.clients.length} clients et un encours total de ${money(
        outstanding
      )}. ${lateLoans.length} dossier(s) sont en retard et ${watchLoans.length} restent sous surveillance.`,
      citations: []
    };
  }

  return {
    answer: `La démo publique CIREX peut déjà résumer le portefeuille, repérer les dossiers prioritaires et rappeler le périmètre réglementaire indexé. Essayez par exemple une question sur le Burkina Faso, le Sénégal, le Nigeria, ou le dossier ${priorityLoan?.id || "prioritaire"}.`,
    citations: []
  };
}

function buildBceaoFrameworkAnswer(index) {
  const memberNames = (index?.countries || [])
    .filter((country) => country.isUmoaMember)
    .map((country) => country.shortName)
    .sort((left, right) => left.localeCompare(right, "fr"));

  return {
    answer: `Dans l'instantané public CIREX, le cadre BCEAO microfinance s'applique aux États UMOA suivants: ${memberNames.join(
      ", "
    )}. Pour un pays hors UMOA comme le Nigeria, ce cadre BCEAO ne s'applique pas.`,
    citations: (index?.keySources || [])
      .filter((item) => item.url && /bceao|au\.int/.test(item.url))
      .slice(0, 3)
      .map((item, itemIndex) => ({
        id: `REG-${itemIndex + 1}`,
        section: translateKeySourceLabel(item.label),
        sourceUrl: item.url
      }))
  };
}

function buildCountryAnswer(country, normalizedQuestion, index) {
  const coverageLevel = country.coverageLevel || "directory";
  const citations = buildCountryCitations(country, index);
  const financeAuthorityLine = country.financeAuthority
    ? ` L'autorité financière indexée est ${country.financeAuthority.name}.`
    : "";

  if (/(bceao|uemoa|umoa).*(appli|concerne)|s'applique/.test(normalizedQuestion)) {
    return {
      answer: country.bceaoFrameworkApplies
        ? `${country.shortName} relève du cadre BCEAO pour la microfinance dans l'instantané public CIREX. Le pays est rattaché à l'UMOA/UEMOA, donc les textes BCEAO sur les SFD font partie du périmètre à consulter.${financeAuthorityLine}`
        : `${country.shortName} ne relève pas du cadre BCEAO pour la microfinance dans l'instantané public CIREX. La base publique ne montre pas d'appartenance UMOA/UEMOA pour ce pays, donc il faut vérifier sa réglementation nationale propre.`,
      citations
    };
  }

  if (/(texte|source|ministere|minist[eè]re|loi|reglement|reglementation)/.test(normalizedQuestion)) {
    const coverageMap = {
      deep: "une couverture approfondie",
      regional: "une couverture régionale",
      directory: "une couverture annuaire"
    };
    const sourceList = (country.sourceUrls || [])
      .slice(0, 4)
      .map((url) => describeSourceUrl(url, index, country))
      .join(", ");

    return {
      answer: `Pour ${country.shortName}, l'instantané public indique ${coverageMap[coverageLevel] || "une couverture disponible"}: ${country.coverageNote}${financeAuthorityLine} Les principales sources mobilisées ici sont ${sourceList || "les sources officielles indexées"}.`,
      citations
    };
  }

  if (/que verifier|avant d'accorder|avant d octroyer|avant d'octroyer/.test(normalizedQuestion)) {
    return {
      answer: `${country.shortName}: vérifiez d'abord si le cadre BCEAO/UMOA/UEMOA s'applique, puis le niveau de couverture disponible dans CIREX. ${country.coverageNote} Quand la couverture reste seulement régionale ou annuaire, la bonne pratique est de passer l'opération en revue manuelle avant validation définitive.`,
      citations
    };
  }

  return {
    answer: `${country.shortName}: ${country.coverageNote}${financeAuthorityLine} ${
      country.bceaoFrameworkApplies
        ? "Le cadre BCEAO microfinance fait partie du périmètre consultable."
        : "Le cadre BCEAO microfinance n'est pas signalé comme applicable dans cet instantané."
    }`,
    citations
  };
}

async function answerStaticAiQuestion(question) {
  const normalizedQuestion = normalizeSearchText(question);
  const index = await getStaticKnowledgeIndex();

  if (/(taux|rate|interet|int[eé]r[eê]t|plafond|ceiling)/.test(normalizedQuestion)) {
    return buildInterestCeilingAnswer();
  }

  if (/(dossier|portefeuille|retard|suivi|agence|client|credit|remboursement)/.test(normalizedQuestion)) {
    return buildPortfolioAnswer(normalizedQuestion);
  }

  const country = findMentionedCountry(question, index);
  if (country) {
    return buildCountryAnswer(country, normalizedQuestion, index);
  }

  if (/(bceao|uemoa|umoa)/.test(normalizedQuestion)) {
    return buildBceaoFrameworkAnswer(index);
  }

  const source = await fetchStaticSourceDetails();
  return {
    answer: `La version publique de CIREX embarque un instantané réglementaire couvrant ${source.countryCount} pays africains et ${source.documentCount} documents officiels. Posez une question sur un pays, la BCEAO, l'UEMOA, ou un dossier du portefeuille CIREX pour obtenir une réponse ciblée.`,
    citations: (source.keySources || []).slice(0, 3).map((item, itemIndex) => ({
      id: `SRC-${itemIndex + 1}`,
      section: item.label,
      sourceUrl: item.url
    }))
  };
}

function translateCitationSection(section) {
  return String(section || "Source")
    .replace("Country profile", "Profil pays")
    .replace("Publication page", "Page de publication")
    .replace("Regulatory index", "Index réglementaire")
    .replace("Official page", "Page officielle")
    .replace("PDF source", "Source PDF")
    .replace("Africa overview", "Vue Afrique")
    .replace("Western Africa", "Afrique de l'Ouest")
    .replace("Eastern Africa", "Afrique de l'Est")
    .replace("Central Africa", "Afrique centrale")
    .replace("Northern Africa", "Afrique du Nord")
    .replace("Southern Africa", "Afrique australe");
}

function addAiMessage(role, content, citations = []) {
  if (!els.aiChatLog) return;

  const article = document.createElement("article");
  article.className = `advisor-message ${role}`;

  const label = document.createElement("div");
  label.className = "eyebrow";
  label.textContent = role === "assistant" ? "Assistant" : "Vous";

  const body = document.createElement("div");
  body.className = "advisor-message-body";
  body.textContent = content;

  article.append(label, body);

  if (citations.length) {
    const citationsWrap = document.createElement("div");
    citationsWrap.className = "advisor-citations";

    citations.forEach((citation) => {
      const item = document.createElement("article");
      item.className = "stack-card advisor-citation";
      item.innerHTML = `
        <strong>Référence ${citation.id}</strong>
        <div>${escapeHtml(translateCitationSection(citation.section))}</div>
        ${
          citation.sourceUrl
            ? `<a class="compliance-link" href="${escapeHtml(citation.sourceUrl)}" target="_blank" rel="noreferrer">Ouvrir la source officielle</a>`
            : ""
        }
      `;
      citationsWrap.append(item);
    });

    article.append(citationsWrap);
  }

  els.aiChatLog.append(article);
  els.aiChatLog.scrollTop = els.aiChatLog.scrollHeight;
}

function setAiLoadingState(isLoading) {
  if (!els.aiSubmitBtn) return;
  els.aiSubmitBtn.disabled = isLoading;
  els.aiSubmitBtn.textContent = isLoading ? "Analyse..." : "Interroger l'IA";
}

function renderComplianceIdleStates() {
  renderComplianceIdleState(
    els.loanComplianceCard,
    `Chaque nouveau crédit est contrôlé avant enregistrement afin de limiter les écarts réglementaires et de respecter la politique interne CIREX. ${getInterestCeilingStatusText()}`
  );
  renderComplianceIdleState(
    els.repaymentComplianceCard,
    "Chaque remboursement est vérifié avant validation pour rester cohérent avec le dossier de crédit et le cadre légal."
  );
}

function renderComplianceIdleState(card, message) {
  if (!card) return;

  card.className = "compliance-card idle";
  card.innerHTML = `
    <div class="eyebrow">Filtre Juridique IA</div>
    <div class="compliance-body">${escapeHtml(message)}</div>
  `;
}

function renderComplianceLoadingState(card, message) {
  if (!card) return;

  card.className = "compliance-card loading";
  card.innerHTML = `
    <div class="compliance-header">
      <div class="eyebrow">Filtre Juridique IA</div>
      <span class="pill loading">Contrôle</span>
    </div>
    <div class="compliance-body">${escapeHtml(message)}</div>
  `;
}

function setActionButtonState(button, isLoading, idleLabel, loadingLabel) {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingLabel : idleLabel;
}

function buildLoanDraft(form) {
  const clientId = String(form.get("clientId") || "");
  const branchId = String(form.get("branchId") || "");
  const officerId = String(form.get("officerId") || "");
  const client = getClient(clientId);
  const branch = getBranch(branchId);
  const officer = getOfficer(officerId);

  return {
    clientId,
    clientName: client?.name || "Client inconnu",
    clientSector: client?.sector || "",
    branchId,
    branchName: branch?.name || branchId,
    officerId,
    officerName: officer?.name || officerId,
    purpose: String(form.get("purpose") || "").trim(),
    principal: Number(form.get("principal")),
    interestRate: Number(form.get("interestRate")),
    termMonths: Number(form.get("termMonths")),
    nextDueDate: String(form.get("nextDueDate") || ""),
    status: String(form.get("status") || ""),
    riskFlag: String(form.get("riskFlag") || "")
  };
}

function buildRepaymentDraft(form) {
  const loanId = String(form.get("loanId") || "");
  const loan = state.loans.find((entry) => entry.id === loanId);
  const client = loan ? getClient(loan.clientId) : null;
  const branch = loan ? getBranch(loan.branchId) : null;
  const officer = loan ? getOfficer(loan.officerId) : null;

  return {
    loanId,
    clientName: client?.name || "Client inconnu",
    branchName: branch?.name || "",
    officerName: officer?.name || "",
    loanStatusBeforePayment: loan?.status || "",
    loanOutstandingBeforePayment: Number(loan?.outstanding || 0),
    loanPrincipal: Number(loan?.principal || 0),
    amount: Number(form.get("amount")),
    paymentDate: String(form.get("paymentDate") || ""),
    note: String(form.get("note") || "").trim()
  };
}

async function runComplianceCheck({ operationType, operationData, button, idleLabel, loadingLabel, resultCard }) {
  const institutionCountry = state.metadata.institutionCountry || "Côte d’Ivoire";
  const operationLabel = operationType === "loan" ? "crédit" : "remboursement";
  const operationDataWithPolicy = {
    ...operationData,
    policyInterestCeiling: getCurrentInterestCeiling(),
    policyCustomerCount: state.clients.length,
    policyRuleSummary: describeInterestCeilingPolicy()
  };

  renderComplianceLoadingState(
    resultCard,
    `CIREX analyse ce ${operationLabel} au regard des sources juridiques indexées pour ${institutionCountry}.`
  );
  setActionButtonState(button, true, idleLabel, loadingLabel);

  try {
    const payload = IS_STATIC_PUBLIC_DEMO
      ? await runStaticComplianceCheck({ operationType, operationData: operationDataWithPolicy, institutionCountry })
      : await (async () => {
          const response = await fetch(apiUrl("/api/compliance/check"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationType,
              operationData: operationDataWithPolicy,
              institutionCountry,
              portfolioContext: buildPortfolioContext()
            })
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || "Le contrôle de conformité a échoué.");
          }

          return result;
        })();

    renderComplianceResult(resultCard, payload);
    return payload;
  } catch (error) {
    renderComplianceResult(resultCard, {
      decision: "REVIEW",
      summary: error.message,
      risks: ["L'opération n'a pas été enregistrée car le contrôle juridique n'a pas pu se terminer."],
      requiredActions: [
        "Réessayez lorsque le serveur IA de CIREX sera à nouveau accessible.",
        "Si le serveur reste indisponible, vérifiez manuellement les sources officielles avant de traiter l'opération."
      ],
      scopeNote: `Pays de l'institution retenu pour ce contrôle : ${institutionCountry}.`,
      citations: []
    });
    return null;
  } finally {
    setActionButtonState(button, false, idleLabel, loadingLabel);
  }
}

function renderComplianceResult(card, payload) {
  if (!card) return;

  const decision = normalizeComplianceDecision(payload?.decision);
  const summary = String(payload?.summary || "").trim() || "Aucun résumé de conformité n'a été retourné.";
  const scopeNote = String(payload?.scopeNote || "").trim();
  const risks = Array.isArray(payload?.risks) ? payload.risks.filter(Boolean) : [];
  const requiredActions = Array.isArray(payload?.requiredActions) ? payload.requiredActions.filter(Boolean) : [];
  const citations = Array.isArray(payload?.citations) ? payload.citations : [];
  const checkedAt = payload?.checkedAt ? prettyDateTime(payload.checkedAt) : null;
  const sourceAge = typeof payload?.sourceAgeHours === "number"
    ? payload.sourceAgeHours < 1
      ? "<1h"
      : `${Math.round(payload.sourceAgeHours)}h`
    : null;

  card.className = `compliance-card ${decision.className}`;
  card.innerHTML = `
    <div class="compliance-header">
      <div class="eyebrow">Filtre Juridique IA</div>
      <span class="pill ${decision.pillClass}">${decision.label}</span>
    </div>
    <div class="compliance-body">${escapeHtml(summary)}</div>
    ${scopeNote ? `<div class="compliance-note">${escapeHtml(scopeNote)}</div>` : ""}
    ${renderComplianceLines("Points de vigilance", risks.length ? risks : [decision.defaultRisk])}
    ${renderComplianceLines("Actions à mener", requiredActions.length ? requiredActions : [decision.defaultAction])}
    ${citations.length ? renderComplianceCitations(citations) : ""}
    <div class="muted">
      ${checkedAt ? `Contrôle effectué le ${checkedAt}.` : "Contrôle effectué à l'instant."}
      ${sourceAge ? ` Âge des sources juridiques : ${sourceAge}.` : ""}
    </div>
  `;
}

function renderComplianceLines(title, items) {
  return `
    <div class="compliance-lines">
      <div class="compliance-line">
        <strong>${escapeHtml(title)}</strong>
        ${items
          .map((item) => `<p>${escapeHtml(item)}</p>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderComplianceCitations(citations) {
  return `
    <div class="compliance-citations">
      ${citations
        .map(
          (citation) => `
            <div class="compliance-citation">
              <strong>Référence ${escapeHtml(citation.id)}</strong>
              <p>${escapeHtml(translateCitationSection(citation.section || "Source"))}</p>
              ${
                citation.sourceUrl
                  ? `<a class="compliance-link" href="${escapeHtml(citation.sourceUrl)}" target="_blank" rel="noreferrer">Ouvrir la source</a>`
                  : ""
              }
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function localComplianceGate(operationType, operationData) {
  if (operationType === "repayment") {
    const amount = Number(operationData.amount);
    const outstanding = Number(operationData.loanOutstandingBeforePayment);

    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        decision: "BLOCK",
        summary: "Le remboursement a été bloqué car le montant est absent ou invalide dans l'enregistrement local CIREX.",
        risks: ["Le montant du remboursement n'est pas une valeur positive valide."],
        requiredActions: ["Saisissez un montant de remboursement valide avant de relancer l'opération."],
        scopeNote: "Ce blocage provient d'un contrôle de cohérence local avant l'analyse réglementaire.",
        citations: []
      };
    }

    if (Number.isFinite(outstanding) && amount > outstanding) {
      return {
        decision: "BLOCK",
        summary: "Le remboursement a été bloqué car il dépasse l'encours restant dans CIREX.",
        risks: ["Le montant du remboursement est supérieur au solde restant du crédit."],
        requiredActions: [
          "Vérifiez le solde du crédit dans CIREX.",
          "Réduisez le montant ou rapprochez le dossier avant validation."
        ],
        scopeNote: "Ce blocage provient d'un contrôle de cohérence local avant l'analyse réglementaire.",
        citations: []
      };
    }
  }

  if (operationType === "loan") {
    const principal = Number(operationData.principal);
    const interestRate = Number(operationData.interestRate);
    const termMonths = Number(operationData.termMonths);
    const currentInterestCeiling = Number.isFinite(Number(operationData.policyInterestCeiling))
      ? Math.min(MAX_INTEREST_RATE_CEILING, Math.max(DEFAULT_INTEREST_RATE_CEILING, Number(operationData.policyInterestCeiling)))
      : getCurrentInterestCeiling();

    if (!Number.isFinite(principal) || principal <= 0) {
      return {
        decision: "BLOCK",
        summary: "Le crédit a été bloqué car le montant principal est absent ou invalide.",
        risks: ["Le montant proposé n'est pas une valeur positive valide."],
        requiredActions: ["Saisissez un montant principal valide avant de relancer l'opération."],
        scopeNote: "Ce blocage provient d'un contrôle de cohérence local avant l'analyse réglementaire.",
        citations: []
      };
    }

    if (!Number.isFinite(interestRate) || interestRate < 0 || !Number.isFinite(termMonths) || termMonths <= 0) {
      return {
        decision: "BLOCK",
        summary: "Le crédit a été bloqué car les données de taux ou de durée sont incomplètes ou invalides.",
        risks: ["Le taux d'intérêt ou la durée du crédit est absent ou hors plage valide."],
        requiredActions: ["Revoyez le taux d'intérêt et la durée avant de relancer l'opération."],
        scopeNote: "Ce blocage provient d'un contrôle de cohérence local avant l'analyse réglementaire.",
        citations: []
      };
    }

    if (interestRate > currentInterestCeiling) {
      return {
        decision: "BLOCK",
        summary: `Le crédit a été bloqué car le taux proposé dépasse le plafond interne CIREX actuellement fixé à ${currentInterestCeiling}%.`,
        risks: [
          `Le taux d'intérêt proposé (${interestRate}%) dépasse la politique interne de tarification.`,
          `Avec ${Number.isFinite(Number(operationData.policyCustomerCount)) ? Number(operationData.policyCustomerCount) : 0} clients retenus, le palier interne applicable reste ${currentInterestCeiling}%.`,
          "L'opération serait incohérente avec la règle maison appliquée aux nouveaux crédits."
        ],
        requiredActions: [
          `Ramenez le taux à ${currentInterestCeiling}% ou moins avant de relancer l'opération.`,
          "Conservez une trace de la décision tarifaire dans le dossier de crédit."
        ],
        scopeNote: `Règle interne CIREX : ${describeInterestCeilingPolicy()} Plafond applicable au dossier actuel : ${currentInterestCeiling}%.`,
        citations: []
      };
    }
  }

  return null;
}

async function runStaticComplianceCheck({ operationType, operationData, institutionCountry }) {
  const localDecision = localComplianceGate(operationType, operationData);
  const source = await fetchStaticSourceDetails();
  const index = await getStaticKnowledgeIndex();
  const country = findMentionedCountry(institutionCountry, index);
  const citations = country ? buildCountryCitations(country, index, 3) : [];
  const checkedAt = new Date().toISOString();

  if (localDecision) {
    return {
      ...localDecision,
      checkedAt,
      sourceAgeHours: source.sourceAgeHours
    };
  }

  if (operationType === "repayment") {
    return {
      decision: "APPROVED",
      summary: "Le remboursement est cohérent avec le dossier local. Dans la version publique, cette validation reste conservatrice et fondée sur l'instantané réglementaire embarqué.",
      risks: [
        "La version publique ne remplace pas la revue réglementaire complète de l'instance sécurisée.",
        "Conservez la trace du dossier et vérifiez les pièces si l'opération est sensible."
      ],
      requiredActions: [
        "Enregistrez le remboursement puis archivez la référence du dossier.",
        "Pour un traitement sensible, confirmez ensuite la base juridique sur l'instance serveur."
      ],
      scopeNote: `Pays de l'institution retenu pour ce contrôle: ${institutionCountry}.`,
      citations,
      checkedAt,
      sourceAgeHours: source.sourceAgeHours
    };
  }

  if (country?.coverageLevel === "deep") {
    return {
      decision: "APPROVED",
      summary: `Le crédit peut être enregistré dans la démo publique: ${institutionCountry} dispose ici d'une couverture officielle approfondie dans l'instantané embarqué.`,
      risks: [
        "La décision publique reste une aide opérationnelle et non un avis juridique exhaustif.",
        "Conservez les références des sources officielles avec le dossier de crédit."
      ],
      requiredActions: [
        "Documentez l'objet du crédit et la décision prise.",
        "Conservez les citations officielles liées au pays dans le dossier client."
      ],
      scopeNote: `Pays de l'institution retenu pour ce contrôle: ${institutionCountry}.`,
      citations,
      checkedAt,
      sourceAgeHours: source.sourceAgeHours
    };
  }

  return {
    decision: "REVIEW",
    summary: `Le crédit n'a pas été validé automatiquement dans la version publique. Pour ${institutionCountry}, l'instantané CIREX confirme seulement une couverture ${country?.coverageLevel || "partielle"}, donc une revue manuelle reste nécessaire avant validation.`,
    risks: [
      "La base publique n'offre pas ici un niveau de profondeur suffisant pour un feu vert automatique.",
      "Un accord trop rapide pourrait ignorer une règle nationale non embarquée dans l'instantané."
    ],
    requiredActions: [
      "Passez le dossier en revue manuelle avant d'octroyer le crédit.",
      "Utilisez l'instance serveur sécurisée pour la validation réglementaire complète si elle est disponible."
    ],
    scopeNote: `Pays de l'institution retenu pour ce contrôle: ${institutionCountry}.`,
    citations,
    checkedAt,
    sourceAgeHours: source.sourceAgeHours
  };
}

function normalizeComplianceDecision(value) {
  switch (String(value || "").toUpperCase()) {
    case "APPROVED":
      return {
        label: "Approuvé",
        className: "approved",
        pillClass: "approved",
        defaultRisk: "Aucun conflit évident n'a été détecté dans le contexte officiel fourni.",
        defaultAction: "Poursuivez le circuit interne habituel et conservez la référence de source avec le dossier."
      };
    case "BLOCK":
      return {
        label: "Bloqué",
        className: "block",
        pillClass: "block",
        defaultRisk: "Le contexte fourni indique que cette opération ne doit pas être validée en l'état.",
        defaultAction: "N'enregistrez pas la transaction tant que le point bloquant n'a pas été corrigé et revu."
      };
    default:
      return {
        label: "À revoir",
        className: "review",
        pillClass: "review",
        defaultRisk: "La couverture juridique ou les faits de l'opération ne sont pas assez complets pour une validation automatique.",
        defaultAction: "Mettez l'opération en attente et demandez une confirmation humaine côté conformité."
      };
  }
}

function buildPortfolioContext() {
  const outstanding = sum(state.loans.map((loan) => loan.outstanding));
  const lateLoans = state.loans
    .filter((loan) => loan.status === "Late")
    .sort((left, right) => right.outstanding - left.outstanding);
  const watchLoans = state.loans
    .filter((loan) => loan.status === "Watch")
    .sort((left, right) => right.outstanding - left.outstanding);
  const currentInterestCeiling = getCurrentInterestCeiling();
  const nextInterestCeilingStage = getNextInterestCeilingStage();
  const branchExposure = getBranchMetrics()
    .slice(0, 3)
    .map((item) => `${item.branch.name}: ${Math.round(item.outstanding)} XOF d'encours, ${item.lateLoans} dossiers en retard`)
    .join("; ");
  const priorityLoans = [...lateLoans, ...watchLoans]
    .slice(0, 4)
    .map((loan) => {
      const client = getClient(loan.clientId);
      const branch = getBranch(loan.branchId);
      const officer = getOfficer(loan.officerId);
      return `${loan.id} | ${client?.name || "Client inconnu"} | ${getStatusLabel(loan.status)} | risque ${getRiskLabel(loan.riskFlag).toLowerCase()} | ${Math.round(loan.outstanding)} XOF d'encours | agence ${branch?.name || "-"} | agent ${officer?.name || "-"}`;
    })
    .join("; ");

  return [
    "Ceci est un instantané local du portefeuille CIREX, et non une source réglementaire officielle.",
    `Institution : ${state.metadata.institutionName}`,
    `Pays de l'institution : ${state.metadata.institutionCountry || "-"}`,
    `Cadre juridique régional : ${state.metadata.legalRegion || "-"}`,
    `Devise : ${state.metadata.baseCurrency}`,
    `Date de l'instantané : ${state.metadata.lastUpdated}`,
    `Agences : ${state.branches.length}; Agents : ${state.officers.length}; Clients : ${state.clients.length}; Crédits : ${state.loans.length}; Remboursements : ${state.repayments.length}`,
    `Politique interne de taux : ${describeInterestCeilingPolicy()}`,
    `Plafond interne actuellement applicable : ${currentInterestCeiling}%`,
    `Prochain palier interne : ${nextInterestCeilingStage ? `${nextInterestCeilingStage.ceiling}% à ${formatCount(nextInterestCeilingStage.minimumClients)} clients` : "Palier final déjà acquis"}`,
    `Encours total : ${Math.round(outstanding)} XOF`,
    `Dossiers en retard : ${lateLoans.length}`,
    `Dossiers sous surveillance : ${watchLoans.length}`,
    `Dossiers prioritaires : ${priorityLoans || "Aucun"}`,
    `Agence la plus exposée : ${branchExposure || "Aucune donnée agence"}`,
    `Score moyen client : ${averageScore().toFixed(0)} / 100`
  ].join("\n");
}

function apiUrl(path) {
  if (API_BASE === null) {
    return path;
  }

  return `${API_BASE}${path}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cirex-microfinance-portefeuille.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function printClientStatement(clientId) {
  const client = getClient(clientId);
  if (!client) return;
  const loans = state.loans.filter((loan) => loan.clientId === clientId);
  const repayments = state.repayments.filter((entry) => loans.some((loan) => loan.id === entry.loanId));
  const score = scoreClient(clientId);
  const html = `
    <html><head><title>Fiche client</title><style>
      body{font-family:Arial,sans-serif;padding:32px;color:#201811}
      .card{border:1px solid #d8c7a7;border-radius:12px;padding:14px;margin:12px 0}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{border-bottom:1px solid #eee2cb;padding:10px 8px;text-align:left}
      .muted{color:#6c6255}
    </style></head><body>
      <h1>${state.metadata.institutionName}</h1>
      <div class="muted">Fiche générée le ${new Date().toLocaleDateString("fr-FR")}</div>
      <div class="card"><strong>${client.name}</strong><div>${client.sector} | ${client.region}</div><div>${getBranch(client.branchId)?.name || ""} | ${getOfficer(client.officerId)?.name || ""}</div><div>Score ${score.score} / 100</div></div>
      <h2>Crédits</h2>
      <table><thead><tr><th>ID</th><th>Objet</th><th>Statut</th><th>Encours</th></tr></thead><tbody>
      ${loans.map((loan) => `<tr><td>${loan.id}</td><td>${loan.purpose}</td><td>${getStatusLabel(loan.status)}</td><td>${money(loan.outstanding)}</td></tr>`).join("") || `<tr><td colspan="4">Aucun crédit</td></tr>`}
      </tbody></table>
      <h2>Remboursements récents</h2>
      <table><thead><tr><th>Date</th><th>Crédit</th><th>Montant</th><th>Note</th></tr></thead><tbody>
      ${repayments.map((entry) => `<tr><td>${prettyDate(entry.paymentDate)}</td><td>${entry.loanId}</td><td>${money(entry.amount)}</td><td>${entry.note}</td></tr>`).join("") || `<tr><td colspan="4">Aucun remboursement</td></tr>`}
      </tbody></table>
    </body></html>`;
  openPrintWindow(html);
}

function printRepaymentReceipt(repaymentId) {
  const repayment = state.repayments.find((entry) => entry.id === repaymentId);
  if (!repayment) return;
  const loan = state.loans.find((entry) => entry.id === repayment.loanId);
  const client = loan ? getClient(loan.clientId) : null;
  const html = `
    <html><head><title>Reçu de remboursement</title><style>
      body{font-family:Arial,sans-serif;padding:32px;color:#201811}
      .receipt{border:2px solid #d8c7a7;border-radius:16px;padding:24px;max-width:700px}
      .row{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #eee2cb}
    </style></head><body>
      <div class="receipt">
        <h1>${state.metadata.institutionName}</h1>
        <div class="row"><strong>ID reçu</strong><span>${repayment.id}</span></div>
        <div class="row"><strong>Client</strong><span>${client?.name || "Inconnu"}</span></div>
        <div class="row"><strong>ID crédit</strong><span>${repayment.loanId}</span></div>
        <div class="row"><strong>Date de paiement</strong><span>${prettyDate(repayment.paymentDate)}</span></div>
        <div class="row"><strong>Montant</strong><span>${money(repayment.amount)}</span></div>
        <div class="row"><strong>Note</strong><span>${repayment.note}</span></div>
      </div>
    </body></html>`;
  openPrintWindow(html);
}

function openPrintWindow(html) {
  const printWindow = window.open("", "_blank", "width=960,height=720");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
