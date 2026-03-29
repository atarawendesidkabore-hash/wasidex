const DEX_MANIFEST_PATH = "./exports/afex_all54_manifest.json";
const INTELLIGENCE_URL = "https://atarawendesidkabore-hash.github.io/wasi-platform/index.html?excel_auto=1";
const DEX_URL = "./index.html";
const PROCESS = [
  "Candidature",
  "Analyse WASI (48h)",
  "Compartiment",
  "Structuration",
  "Book Building (15j)",
  "Admission (30j)",
  "Cotation",
  "Suivi"
];

const TIMELINE = [
  { title: "WASI Intelligence", copy: "Décision, analyse, navigation et lecture stratégique de l’écosystème africain." },
  { title: "WASI DEX", copy: "54 pays AFEX, familles régionales, profils export et référentiel FX XOF." },
  { title: "Ecosystem Hub", copy: "Passerelles entre les apps, modules et flux structurants du groupe WASI." },
  { title: "CIREX Microfinance", copy: "Portefeuille crédit, conformité, relation client et investissement." }
];

const els = {
  installBtn: document.getElementById("install-btn"),
  networkStatus: document.getElementById("network-status"),
  navButtons: [...document.querySelectorAll("#bottom-nav button")],
  jumpButtons: [...document.querySelectorAll("[data-jump-screen]")],
  moduleButtons: [...document.querySelectorAll("[data-open-module]")],
  screens: ["home", "intelligence", "dex", "apps"].reduce((acc, key) => ({ ...acc, [key]: document.getElementById(`screen-${key}`) }), {}),
  overviewMetrics: document.getElementById("overview-metrics"),
  timeline: document.getElementById("timeline-strip"),
  process: document.getElementById("process-strip"),
  dexMetrics: document.getElementById("dex-metrics"),
  regionGrid: document.getElementById("region-grid")
};

let deferredPrompt = null;
let activeScreen = "home";

init();

async function init() {
  bind();
  renderTimeline();
  renderProcess();
  updateNetworkState();
  await loadDexSnapshot();
  await registerServiceWorker();
}

function bind() {
  els.navButtons.forEach((button) => button.addEventListener("click", () => switchScreen(button.dataset.screen)));
  els.jumpButtons.forEach((button) => button.addEventListener("click", () => switchScreen(button.dataset.jumpScreen)));
  els.moduleButtons.forEach((button) => button.addEventListener("click", () => openModule(button.dataset.openModule)));
  els.installBtn.addEventListener("click", installApp);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    els.installBtn.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    els.installBtn.hidden = true;
  });

  window.addEventListener("online", updateNetworkState);
  window.addEventListener("offline", updateNetworkState);
}

function switchScreen(screen) {
  activeScreen = screen;
  els.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.screen === activeScreen));
  Object.entries(els.screens).forEach(([key, screenNode]) => screenNode.classList.toggle("active", key === activeScreen));
}

function openModule(module) {
  if (module === "intelligence") {
    window.open(INTELLIGENCE_URL, "_blank", "noopener,noreferrer");
    return;
  }
  if (module === "dex") {
    window.location.href = DEX_URL;
  }
}

async function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice.catch(() => null);
  deferredPrompt = null;
  els.installBtn.hidden = true;
}

function updateNetworkState() {
  const online = navigator.onLine;
  els.networkStatus.textContent = online ? "En ligne" : "Hors ligne";
  els.networkStatus.classList.toggle("offline", !online);
}

async function loadDexSnapshot() {
  try {
    const response = await fetch(DEX_MANIFEST_PATH, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const manifest = await response.json();
    renderDexMetrics(manifest);
    renderRegions(manifest.subfamilies || []);
  } catch (_) {
    renderDexMetrics({ country_count: 54, generated_on: "2026-03-23", family_name: "Africa Export Index Family", subfamilies: [] });
    renderRegions([
      { subfamily_code: "WAEX", subfamily_name: "West Africa Export Index Family", country_count: 16 },
      { subfamily_code: "EAEX", subfamily_name: "East Africa Export Index Family", country_count: 11 },
      { subfamily_code: "SAEX", subfamily_name: "Southern Africa Export Index Family", country_count: 13 },
      { subfamily_code: "CAEX", subfamily_name: "Central Africa Export Index Family", country_count: 8 },
      { subfamily_code: "NAEX", subfamily_name: "North Africa Export Index Family", country_count: 6 }
    ]);
  }
}

function renderDexMetrics(manifest) {
  const regions = Array.isArray(manifest.subfamilies) ? manifest.subfamilies.length : 5;
  const metrics = [
    ["Pays AFEX", `${manifest.country_count || 54}`],
    ["Sous-familles", `${regions}`],
    ["Package", manifest.family_name || "AFEX"],
    ["Mise à jour", prettyDate(manifest.generated_on)]
  ];

  els.overviewMetrics.innerHTML = metrics.map(([label, value]) => metricCard(label, value)).join("");
  els.dexMetrics.innerHTML = [
    metricCard("Couverture", `${manifest.country_count || 54} pays`),
    metricCard("Référence", "USD + FX XOF"),
    metricCard("Famille", manifest.family_name || "AFEX"),
    metricCard("Généré le", prettyDate(manifest.generated_on))
  ].join("");
}

function renderTimeline() {
  els.timeline.innerHTML = TIMELINE.map((item) => `
    <div class="timeline-card">
      <strong>${escape(item.title)}</strong>
      <p>${escape(item.copy)}</p>
    </div>
  `).join("");
}

function renderProcess() {
  els.process.innerHTML = PROCESS.map((step, index) => `
    <div class="process-card">
      <div class="process-num">${index + 1}</div>
      <div class="process-label">${escape(step)}</div>
    </div>
  `).join("");
}

function renderRegions(subfamilies) {
  els.regionGrid.innerHTML = subfamilies.map((region) => `
    <div class="region-card">
      <div class="detail-row">
        <strong>${escape(region.subfamily_code || "-")}</strong>
        <span class="region-badge">${escape(String(region.country_count || 0))} pays</span>
      </div>
      <p>${escape(region.subfamily_name || "Sous-famille AFEX")}</p>
    </div>
  `).join("");
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("./wasi-app-sw.js");
  } catch (_) {
    // Ignore SW registration issues in browsers that block it.
  }
}

function metricCard(label, value) {
  return `
    <div class="metric-card">
      <div class="metric-label">${escape(label)}</div>
      <div class="metric-value">${escape(value)}</div>
    </div>
  `;
}

function prettyDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function escape(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
