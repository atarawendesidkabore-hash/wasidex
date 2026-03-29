const subfamilies = [
  {
    code: "NAEX",
    name: "North Africa Export Index Family",
    color: "#b45309",
    countries: [
      { code: "ALGEX", country: "Algeria", currency: "DZD", model: "coastal_export_model", role: "energy_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Condensates", "Iron Ore", "Phosphates"] },
      { code: "EGYEX", country: "Egypt", currency: "EGP", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Gold", "Raw Cotton", "Phosphates"] },
      { code: "LBYEX", country: "Libya", currency: "LYD", model: "coastal_export_model", role: "energy_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Condensates", "Petrochemical Feedstocks"] },
      { code: "MAREX", country: "Morocco", currency: "MAD", model: "coastal_export_model", role: "diversified_coastal_member", detail: "starter_profile", commodities: ["Phosphates", "Fish and Seafood", "Citrus", "Lead and Zinc Concentrates"] },
      { code: "TUNEX", country: "Tunisia", currency: "TND", model: "coastal_export_model", role: "coastal_diversified_member", detail: "starter_profile", commodities: ["Olive Oil", "Phosphates", "Crude Oil", "Dates"] },
      { code: "SUDEX", country: "Sudan", currency: "SDG", model: "coastal_export_model", role: "agri_and_minerals_member", detail: "starter_profile", commodities: ["Gold", "Gum Arabic", "Livestock", "Sesame Seeds", "Raw Cotton"] }
    ]
  },
  {
    code: "WAEX",
    name: "West Africa Export Index Family",
    color: "#2c884b",
    countries: [
      { code: "BENEX", country: "Benin", currency: "XOF", model: "coastal_export_model", role: "coastal_corridor_member", detail: "starter_profile", commodities: ["Raw Cotton", "Cashew Nuts", "Soybeans", "Shea Nuts"] },
      { code: "BUREX", country: "Burkina Faso", currency: "XOF", model: "landlocked_corridor_model", role: "landlocked_corridor_member", detail: "detailed_prototype_ready", commodities: ["Other Oily Seeds", "Cashew Nuts", "Raw Cotton", "Sesame Seeds", "Zinc Ore", "Gold"] },
      { code: "CABEX", country: "Cabo Verde", currency: "CVE", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Fish and Seafood", "Salt", "Marine Products"] },
      { code: "CIREX", country: "Cote d'Ivoire", currency: "XOF", model: "coastal_export_model", role: "coastal_anchor_member", detail: "detailed_prototype_ready", commodities: ["Cocoa Beans", "Natural Rubber", "Cashew Nuts", "Crude Oil", "Manganese", "Palm Oil", "Raw Cotton", "Coffee", "Nickel", "Gold", "Diamonds"] },
      { code: "GMBEX", country: "The Gambia", currency: "GMD", model: "coastal_export_model", role: "river_coastal_member", detail: "starter_profile", commodities: ["Groundnuts", "Fish and Seafood", "Sesame Seeds", "Cashew Nuts"] },
      { code: "GHAEX", country: "Ghana", currency: "GHS", model: "coastal_export_model", role: "coastal_anchor_member", detail: "starter_profile", commodities: ["Cocoa Beans", "Gold", "Crude Oil", "Manganese", "Bauxite", "Timber"] },
      { code: "GUIEX", country: "Guinea", currency: "GNF", model: "coastal_export_model", role: "minerals_anchor_member", detail: "starter_profile", commodities: ["Bauxite", "Gold", "Diamonds", "Iron Ore"] },
      { code: "GNBEX", country: "Guinea-Bissau", currency: "XOF", model: "coastal_export_model", role: "single_crop_member", detail: "starter_profile", commodities: ["Cashew Nuts", "Fish and Seafood", "Groundnuts"] },
      { code: "LIBEX", country: "Liberia", currency: "LRD", model: "coastal_export_model", role: "minerals_and_agriculture_member", detail: "starter_profile", commodities: ["Natural Rubber", "Iron Ore", "Gold", "Palm Oil", "Timber"] },
      { code: "MALIEX", country: "Mali", currency: "XOF", model: "landlocked_corridor_model", role: "landlocked_corridor_member", detail: "starter_profile", commodities: ["Gold", "Raw Cotton", "Livestock", "Sesame Seeds", "Shea Nuts"] },
      { code: "MRTEX", country: "Mauritania", currency: "MRU", model: "coastal_export_model", role: "minerals_and_fisheries_member", detail: "starter_profile", commodities: ["Iron Ore", "Gold", "Copper Concentrate", "Fish and Seafood"] },
      { code: "NEREX", country: "Niger", currency: "XOF", model: "landlocked_corridor_model", role: "landlocked_corridor_member", detail: "starter_profile", commodities: ["Uranium", "Crude Oil", "Livestock", "Cowpeas", "Onions"] },
      { code: "NGAEX", country: "Nigeria", currency: "NGN", model: "coastal_export_model", role: "energy_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Cocoa Beans", "Sesame Seeds", "Natural Rubber"] },
      { code: "SENEX", country: "Senegal", currency: "XOF", model: "coastal_export_model", role: "coastal_diversified_member", detail: "starter_profile", commodities: ["Phosphates", "Gold", "Fish and Seafood", "Groundnuts", "Zircon"] },
      { code: "SLEX", country: "Sierra Leone", currency: "SLE", model: "coastal_export_model", role: "minerals_member", detail: "starter_profile", commodities: ["Diamonds", "Iron Ore", "Rutile", "Bauxite", "Cocoa"] },
      { code: "TOGEX", country: "Togo", currency: "XOF", model: "coastal_export_model", role: "coastal_corridor_member", detail: "starter_profile", commodities: ["Phosphates", "Raw Cotton", "Soybeans", "Cashew Nuts"] }
    ]
  },
  {
    code: "CAEX",
    name: "Central Africa Export Index Family",
    color: "#7c3aed",
    countries: [
      { code: "CAMEX", country: "Cameroon", currency: "XAF", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Cocoa Beans", "Timber", "Raw Cotton", "Coffee", "Natural Gas"] },
      { code: "CAFEX", country: "Central African Republic", currency: "XAF", model: "landlocked_corridor_model", role: "minerals_and_forest_member", detail: "starter_profile", commodities: ["Timber", "Gold", "Diamonds", "Raw Cotton"] },
      { code: "CHAEX", country: "Chad", currency: "XAF", model: "landlocked_corridor_model", role: "energy_and_livestock_member", detail: "starter_profile", commodities: ["Crude Oil", "Livestock", "Sesame Seeds", "Gum Arabic", "Raw Cotton"] },
      { code: "COGEX", country: "Republic of the Congo", currency: "XAF", model: "coastal_export_model", role: "energy_member", detail: "starter_profile", commodities: ["Crude Oil", "Timber", "Iron Ore", "Potash"] },
      { code: "DRCEX", country: "DR Congo", currency: "CDF", model: "landlocked_corridor_model", role: "minerals_anchor_member", detail: "starter_profile", commodities: ["Copper", "Cobalt", "Gold", "Tin Ore", "Coltan", "Diamonds"] },
      { code: "EQGEX", country: "Equatorial Guinea", currency: "XAF", model: "coastal_export_model", role: "energy_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Methanol", "Timber", "Cocoa Beans"] },
      { code: "GABEX", country: "Gabon", currency: "XAF", model: "coastal_export_model", role: "energy_and_metals_member", detail: "starter_profile", commodities: ["Crude Oil", "Manganese", "Timber", "Gold"] },
      { code: "STPEX", country: "Sao Tome and Principe", currency: "STN", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Cocoa Beans", "Fish and Seafood", "Palm Products"] }
    ]
  },
  {
    code: "EAEX",
    name: "East Africa Export Index Family",
    color: "#0284c7",
    countries: [
      { code: "BDIEX", country: "Burundi", currency: "BIF", model: "landlocked_corridor_model", role: "agri_and_minerals_member", detail: "starter_profile", commodities: ["Coffee", "Tea", "Gold", "Nickel Ore"] },
      { code: "COMREX", country: "Comoros", currency: "KMF", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Vanilla", "Cloves", "Ylang-Ylang", "Fish and Seafood"] },
      { code: "DJIEX", country: "Djibouti", currency: "DJF", model: "coastal_export_model", role: "trade_gateway_member", detail: "starter_profile", commodities: ["Salt", "Livestock", "Fish and Seafood"] },
      { code: "ERIEX", country: "Eritrea", currency: "ERN", model: "coastal_export_model", role: "metals_member", detail: "starter_profile", commodities: ["Gold", "Copper", "Zinc", "Potash", "Salt"] },
      { code: "ETHEX", country: "Ethiopia", currency: "ETB", model: "landlocked_corridor_model", role: "agri_anchor_member", detail: "starter_profile", commodities: ["Coffee", "Gold", "Sesame Seeds", "Oilseeds", "Livestock"] },
      { code: "KENEX", country: "Kenya", currency: "KES", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Tea", "Coffee", "Soda Ash", "Titanium Ore", "Cut Flowers"] },
      { code: "RWAEX", country: "Rwanda", currency: "RWF", model: "landlocked_corridor_model", role: "minerals_and_agri_member", detail: "starter_profile", commodities: ["Gold", "Tin Ore", "Tantalum", "Tungsten", "Coffee", "Tea"] },
      { code: "SOMEX", country: "Somalia", currency: "SOS", model: "coastal_export_model", role: "livestock_member", detail: "starter_profile", commodities: ["Livestock", "Sesame Seeds", "Frankincense", "Fish and Seafood"] },
      { code: "SSDEX", country: "South Sudan", currency: "SSP", model: "landlocked_corridor_model", role: "energy_member", detail: "starter_profile", commodities: ["Crude Oil", "Gum Arabic", "Livestock", "Sesame Seeds"] },
      { code: "TZAEX", country: "Tanzania", currency: "TZS", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Gold", "Cashew Nuts", "Coffee", "Raw Cotton", "Tobacco", "Natural Gas"] },
      { code: "UGAEX", country: "Uganda", currency: "UGX", model: "landlocked_corridor_model", role: "agri_anchor_member", detail: "starter_profile", commodities: ["Coffee", "Gold", "Raw Cotton", "Tea", "Fish and Seafood"] }
    ]
  },
  {
    code: "SAEX",
    name: "Southern Africa Export Index Family",
    color: "#dc2626",
    countries: [
      { code: "ANGEX", country: "Angola", currency: "AOA", model: "coastal_export_model", role: "energy_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Diamonds", "Iron Ore", "Coffee"] },
      { code: "BOTEX", country: "Botswana", currency: "BWP", model: "landlocked_corridor_model", role: "diamonds_member", detail: "starter_profile", commodities: ["Diamonds", "Copper", "Nickel", "Soda Ash", "Beef"] },
      { code: "ESWEX", country: "Eswatini", currency: "SZL", model: "landlocked_corridor_model", role: "agri_industrial_member", detail: "starter_profile", commodities: ["Sugar", "Wood Pulp", "Citrus", "Coal"] },
      { code: "LESEX", country: "Lesotho", currency: "LSL", model: "landlocked_corridor_model", role: "small_minerals_member", detail: "starter_profile", commodities: ["Wool", "Mohair", "Diamonds"] },
      { code: "MDGEX", country: "Madagascar", currency: "MGA", model: "island_export_model", role: "agri_and_minerals_member", detail: "starter_profile", commodities: ["Vanilla", "Nickel and Cobalt", "Cloves", "Chromium Ore", "Ilmenite"] },
      { code: "MWIEX", country: "Malawi", currency: "MWK", model: "landlocked_corridor_model", role: "agri_member", detail: "starter_profile", commodities: ["Tobacco", "Tea", "Sugar", "Macadamia Nuts"] },
      { code: "MUSEX", country: "Mauritius", currency: "MUR", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Sugar", "Fish and Seafood", "Molasses"] },
      { code: "MOZEX", country: "Mozambique", currency: "MZN", model: "coastal_export_model", role: "energy_and_mining_member", detail: "starter_profile", commodities: ["Coal", "Natural Gas", "Graphite", "Heavy Mineral Sands", "Aluminum"] },
      { code: "NAMEX", country: "Namibia", currency: "NAD", model: "coastal_export_model", role: "minerals_member", detail: "starter_profile", commodities: ["Diamonds", "Uranium", "Zinc", "Copper", "Fish and Seafood"] },
      { code: "SEYEX", country: "Seychelles", currency: "SCR", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Fish and Seafood", "Tuna", "Cinnamon", "Vanilla"] },
      { code: "ZAFEX", country: "South Africa", currency: "ZAR", model: "coastal_export_model", role: "continental_anchor_member", detail: "starter_profile", commodities: ["Gold", "Platinum Group Metals", "Coal", "Iron Ore", "Manganese", "Chromium"] },
      { code: "ZMBEX", country: "Zambia", currency: "ZMW", model: "landlocked_corridor_model", role: "copper_anchor_member", detail: "starter_profile", commodities: ["Copper", "Cobalt", "Emeralds", "Sugar"] },
      { code: "ZIMEX", country: "Zimbabwe", currency: "ZWG", model: "landlocked_corridor_model", role: "minerals_anchor_member", detail: "starter_profile", commodities: ["Gold", "Platinum", "Lithium", "Tobacco", "Nickel"] }
    ]
  }
];

const allCountries = subfamilies.flatMap((sf) => sf.countries);
const totalCountries = allCountries.length;
const detailedCount = allCountries.filter((c) => c.detail === "detailed_prototype_ready").length;
const starterCount = totalCountries - detailedCount;
const uniqueCommodities = new Set(allCountries.flatMap((c) => c.commodities)).size;
const coastalCount = allCountries.filter((c) => c.model === "coastal_export_model").length;
const landlockedCount = allCountries.filter((c) => c.model === "landlocked_corridor_model").length;
const islandCount = allCountries.filter((c) => c.model === "island_export_model").length;
const uniqueCurrencies = new Set(allCountries.map((c) => c.currency)).size;
const largestSubfamily = subfamilies.reduce((largest, current) => current.countries.length > largest.countries.length ? current : largest, subfamilies[0]);
const commodityFrequency = Object.entries(
  allCountries.reduce((acc, country) => {
    country.commodities.forEach((commodity) => {
      acc[commodity] = (acc[commodity] || 0) + 1;
    });
    return acc;
  }, {})
).sort((a, b) => b[1] - a[1]);

const stats = [
  { label: "Family code", value: "AFEX", note: "Continental umbrella for the export-index family", meta: "Core layer", tone: "accent" },
  { label: "Countries", value: String(totalCountries), note: "54 sovereign African states", meta: "Full coverage", tone: "green" },
  { label: "Subfamilies", value: "5", note: "NAEX, WAEX, CAEX, EAEX, SAEX", meta: "Regional lattice", tone: "blue" },
  { label: "Detailed prototypes", value: String(detailedCount), note: "Priority country packages with richer logic", meta: "Deep builds", tone: "accent" },
  { label: "Starter profiles", value: String(starterCount), note: "Country templates ready for further validation", meta: "Expansion queue", tone: "purple" },
  { label: "Tracked commodities", value: String(uniqueCommodities), note: "Distinct raw materials across all funds", meta: "Commodity spread", tone: "green" },
  { label: "Currencies", value: String(uniqueCurrencies), note: "Base currencies across all countries", meta: "Monetary map", tone: "blue" },
  { label: "Comparison currency", value: "USD", note: "Continent-wide comparison layer", meta: "Shared benchmark", tone: "purple" }
];

document.getElementById("stats-grid").innerHTML = stats.map((item) => `
  <article class="stat-card tone-${item.tone}">
    <div class="eyebrow">${item.label}</div>
    <div class="stat-value">${item.value}</div>
    <div class="muted small-text">${item.note}</div>
    <div class="stat-meta">${item.meta}</div>
  </article>
`).join("");

document.getElementById("family-pulse").innerHTML = `
  <div class="section-head">
    <div>
      <div class="eyebrow">Family Pulse</div>
      <h2>Regional weight and operating posture</h2>
      <p>See where the largest country coverage sits, how many packages are deep enough to open immediately, and where the family is still mostly starter-grade.</p>
    </div>
  </div>
  <div class="signal-matrix">
    <article class="signal-panel">
      <div class="eyebrow">Largest subfamily</div>
      <strong>${largestSubfamily.code}</strong>
      <div class="muted">${largestSubfamily.countries.length} countries in the broadest regional block.</div>
    </article>
    <article class="signal-panel">
      <div class="eyebrow">Detailed depth</div>
      <strong>${detailedCount}/${totalCountries}</strong>
      <div class="muted">${formatWholePercent((detailedCount / totalCountries) * 100)} of the library already has richer prototype logic.</div>
    </article>
    <article class="signal-panel">
      <div class="eyebrow">Starter queue</div>
      <strong>${starterCount}</strong>
      <div class="muted">Country files still waiting for deeper package treatment and review.</div>
    </article>
  </div>
  <div class="pulse-list">
    ${subfamilies.map((sf) => {
      const share = (sf.countries.length / totalCountries) * 100;
      return `
        <div class="pulse-row">
          <div class="pulse-head">
            <strong>${sf.code}</strong>
            <span class="muted">${sf.countries.length} countries · ${formatWholePercent(share)}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${share}%; background: linear-gradient(90deg, ${sf.color}, rgba(79, 136, 255, 0.78));"></div>
          </div>
        </div>
      `;
    }).join("")}
  </div>
`;

document.getElementById("model-distribution").innerHTML = `
  <div class="section-head">
    <div>
      <div class="eyebrow">Method Mix</div>
      <h2>Transport logic and recurring export themes</h2>
      <p>The AFEX family leans coastal overall, but the corridor and island models remain essential for the continent-wide picture.</p>
    </div>
  </div>
  <div class="distribution-stack">
    ${[
      { name: "Coastal export model", count: coastalCount, color: "#4f88ff" },
      { name: "Landlocked corridor model", count: landlockedCount, color: "#c8922a" },
      { name: "Island export model", count: islandCount, color: "#7c3aed" }
    ].map((item) => {
      const share = (item.count / totalCountries) * 100;
      return `
        <div class="distribution-row">
          <div class="distribution-head">
            <span>${item.name}</span>
            <strong>${item.count} · ${formatWholePercent(share)}</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${share}%; background: linear-gradient(90deg, ${item.color}, rgba(255, 255, 255, 0.18));"></div>
          </div>
        </div>
      `;
    }).join("")}
  </div>
  <div class="overview-stack">
    <div>
      <div class="eyebrow">Most repeated commodities</div>
      <div class="pill-row">
        ${commodityFrequency.slice(0, 8).map(([commodity, count]) => `<span class="pill soft">${commodity} · ${count}</span>`).join("")}
      </div>
    </div>
    <div>
      <div class="eyebrow">Design reading</div>
      <p>The current family is strongest where port exports dominate, while corridor and island models act as the specialization layer that keeps the library realistic across inland and archipelago markets.</p>
    </div>
  </div>
`;

const familyTags = ["54 sovereign states", "USD comparison layer", "5 regional subfamilies", "3 methodology models", "Country benchmarks", "WASI-ready packages", "Rules-based index tracking"];
document.getElementById("family-tags").innerHTML = familyTags.map((tag) => `
  <span class="pill">${tag}</span>
`).join("");

document.getElementById("subfamily-grid").innerHTML = subfamilies.map((sf) => `
  <article class="mini-card" style="border-left: 4px solid ${sf.color}">
    <div class="code-chip" style="background: ${sf.color}">${sf.code}</div>
    <strong>${sf.name}</strong>
    <div class="muted">${sf.countries.length} countries</div>
  </article>
`).join("");

const modules = [
  {
    name: "Microfinance Operations",
    status: "ready",
    summary: "Daily operations layer for clients, loans, savings, branches, scoring, and receipts.",
    bullets: ["Offline browser app", "Local pilot operations", "Receipts and score flows"],
    href: "../microfinance-app/index.html",
    cta: "Open app"
  },
  {
    name: "WASI DEX Intelligence Platform",
    status: "ready",
    summary: "The main terminal for all 54 AFEX instruments with search, comparison, and export-package access.",
    bullets: ["54 instruments indexed", "Grid, table, and compare views", "Package access from one terminal"],
    href: "../index.html",
    cta: "Open WASI DEX"
  },
  {
    name: "Upload Packages",
    status: "ready",
    summary: "Machine-readable JSON, Markdown, and bundle outputs that feed the wider WASI stack.",
    bullets: ["AFEX manifest", "Detailed prototype bundles", "Country package folders"],
    href: "../exports/afex_all54_manifest.md",
    cta: "Open manifest"
  },
  {
    name: "Tokenization and Rails",
    status: "future",
    summary: "Future CBDC, tokenization, and programmable settlement layer around the fund family.",
    bullets: ["Comes after compliant fund setup", "Wraps the legal vehicle instead of replacing it", "Best added once live data is stable"],
    href: "",
    cta: "Planned"
  }
];

document.getElementById("modules-grid").innerHTML = modules.map((item) => `
  <article class="card">
    <div class="status ${item.status}">${labelStatus(item.status)}</div>
    <h3>${item.name}</h3>
    <p>${item.summary}</p>
    <div class="pill-row">${item.bullets.map((b) => `<span class="pill soft">${b}</span>`).join("")}</div>
    <div class="action-row">${item.href ? `<a class="secondary-btn" href="${item.href}">${item.cta}</a>` : `<span class="secondary-btn disabled">${item.cta}</span>`}</div>
  </article>
`).join("");

// Region filter and country grid
let activeRegion = "all";
let regionSearchTerm = "";

function matchesCountrySearch(country) {
  const query = regionSearchTerm.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    country.code,
    country.country,
    country.currency,
    formatModel(country.model),
    formatRole(country.role),
    ...country.commodities
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function getCountryLinks(country) {
  const code = country.code.toLowerCase();

  if (country.code === "CIREX") {
    return {
      json: "../exports/cirex_fund_characteristics.json",
      md: "../exports/cirex_fund_characteristics.md",
      zip: "../exports/cirex_wasi_upload_package.zip"
    };
  }

  if (country.code === "BUREX") {
    return {
      json: "../exports/burex_fund_characteristics.json",
      md: "../exports/burex_fund_characteristics.md",
      zip: "../exports/burex_wasi_upload_package.zip"
    };
  }

  return {
    json: `../exports/${code}/${code}_fund_characteristics.json`,
    md: `../exports/${code}/${code}_fund_characteristics.md`,
    zip: ""
  };
}

function renderRegionFilter() {
  const el = document.getElementById("region-filter");
  const buttons = [{ code: "all", label: "All 54", color: "var(--accent)" }];
  subfamilies.forEach((sf) => buttons.push({ code: sf.code, label: `${sf.code} (${sf.countries.length})`, color: sf.color }));
  el.innerHTML = buttons.map((btn) => `
    <button class="region-btn ${activeRegion === btn.code ? "active" : ""}" data-region="${btn.code}" style="--btn-color: ${btn.color}">${btn.label}</button>
  `).join("");
  el.querySelectorAll(".region-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeRegion = btn.dataset.region;
      renderRegionFilter();
      renderRegionContainer();
    });
  });
}

function renderRegionContainer() {
  const el = document.getElementById("region-container");
  const regions = activeRegion === "all" ? subfamilies : subfamilies.filter((sf) => sf.code === activeRegion);
  const blocks = regions.map((sf) => {
    const visibleCountries = sf.countries.filter(matchesCountrySearch);
    if (!visibleCountries.length) return "";

    return `
    <div class="region-block">
      <div class="region-header" style="border-color: ${sf.color}">
        <span class="code-chip" style="background: ${sf.color}">${sf.code}</span>
        <strong>${sf.name}</strong>
        <span class="muted">${visibleCountries.length} ${visibleCountries.length > 1 ? "countries" : "country"} visible</span>
      </div>
      <div class="country-grid">
        ${visibleCountries.map((c) => {
          const links = getCountryLinks(c);
          return `
          <article class="country-card ${c.detail === "detailed_prototype_ready" ? "detailed" : ""}">
            <div class="country-topline">
              <div class="code-chip small">${c.code}</div>
              ${c.detail === "detailed_prototype_ready" ? '<span class="detail-badge">Detailed</span>' : ""}
            </div>
            <strong>${c.country}</strong>
            <div class="country-meta">
              <div>${c.currency} · ${formatModel(c.model)}</div>
              <div>${formatRole(c.role)}</div>
            </div>
            <div class="commodity-pills">
              ${c.commodities.slice(0, 3).map((com) => `<span class="commodity-pill">${com}</span>`).join("")}
              ${c.commodities.length > 3 ? `<span class="commodity-pill more">+${c.commodities.length - 3}</span>` : ""}
            </div>
            <div class="action-row compact">
              <a class="secondary-btn small-btn" href="${links.json}">JSON</a>
              <a class="secondary-btn small-btn" href="${links.md}">Notes</a>
              ${links.zip ? `<a class="secondary-btn small-btn" href="${links.zip}">ZIP</a>` : ""}
            </div>
          </article>
        `;
        }).join("")}
      </div>
    </div>
  `;
  }).join("");

  el.innerHTML = blocks || `
    <div class="empty-state">
      <div>
        <strong>No country matches that search.</strong>
        <div class="muted">Try a country name, code, commodity, currency, or methodology model.</div>
      </div>
    </div>
  `;
}

renderRegionFilter();
renderRegionContainer();
document.getElementById("region-search").addEventListener("input", (event) => {
  regionSearchTerm = event.target.value;
  renderRegionContainer();
});

// Detailed prototypes (CIREX and BUREX)
const detailedFunds = [
  {
    code: "CIREX",
    name: "Cote d'Ivoire Raw Export Index",
    country: "Cote d'Ivoire",
    role: "Coastal anchor",
    status: "building",
    summary: "Coastal export benchmark centered on raw materials leaving through the country's export system.",
    transportModel: "Seaborne loading and export-tonnage logic",
    uploadJson: "../exports/cirex_fund_characteristics.json",
    uploadMd: "../exports/cirex_fund_characteristics.md",
    notes: [
      "Designed for a port-led export economy",
      "Prototype weights already prepared",
      "Best for cocoa-led coastal commodity exposure"
    ],
    weights: [
      { name: "Cocoa Beans", weight: 33.9 },
      { name: "Natural Rubber", weight: 19.26 },
      { name: "Cashew Nuts", weight: 15.1 },
      { name: "Crude Oil", weight: 11.71 },
      { name: "Manganese Ore", weight: 7.86 }
    ]
  },
  {
    code: "BUREX",
    name: "Burkina Faso Raw Export Index",
    country: "Burkina Faso",
    role: "Landlocked corridor member",
    status: "building",
    summary: "Landlocked export benchmark built around outbound tonnage moving through regional corridors and border relationships.",
    transportModel: "Road, rail, air, and transit corridor tonnage",
    uploadJson: "../exports/burex_fund_characteristics.json",
    uploadMd: "../exports/burex_fund_characteristics.md",
    corridorCountries: ["Ghana", "Togo", "Benin", "Cote d'Ivoire", "Mali", "Niger"],
    notes: [
      "Built for corridor-based trade instead of seaborne loading",
      "Gold dominates value but not tonnage",
      "Explicitly tracks the six-country corridor overlay"
    ],
    weights: [
      { name: "Other Oily Seeds", weight: 41.94 },
      { name: "Cashew Nuts", weight: 25.26 },
      { name: "Raw Cotton", weight: 24.52 },
      { name: "Sesame Seeds", weight: 8.24 },
      { name: "Zinc Ore", weight: 0.04 }
    ]
  }
];

document.getElementById("fund-grid").innerHTML = detailedFunds.map((fund) => `
  <article class="fund-card">
    <div class="fund-topline">
      <div>
        <div class="code-chip">${fund.code}</div>
        <h3>${fund.name}</h3>
      </div>
      <div class="status ${fund.status}">${labelStatus(fund.status)}</div>
    </div>
    <p>${fund.summary}</p>
    <div class="metric-list">
      <div class="metric-row"><span>Country</span><strong>${fund.country}</strong></div>
      <div class="metric-row"><span>Family role</span><strong>${fund.role}</strong></div>
      <div class="metric-row"><span>Transport model</span><strong>${fund.transportModel}</strong></div>
      <div class="metric-row"><span>Top weight</span><strong>${fund.weights[0].name} ${formatPercent(fund.weights[0].weight)}</strong></div>
    </div>
    ${fund.corridorCountries ? `<div class="sub-block"><div class="eyebrow">Corridor countries</div><div class="pill-row">${fund.corridorCountries.map((c) => `<span class="pill soft">${c}</span>`).join("")}</div></div>` : ""}
    <div class="sub-block">
      <div class="eyebrow">What matters</div>
      <ul>${fund.notes.map((note) => `<li>${note}</li>`).join("")}</ul>
    </div>
    <div class="sub-block">
      <div class="eyebrow">Top weights</div>
      <div class="weight-stack">
        ${fund.weights.map((item) => `
          <div class="weight-row">
            <div class="weight-head"><span>${item.name}</span><strong>${formatPercent(item.weight)}</strong></div>
            <div class="weight-track"><div class="weight-fill" style="width:${Math.max(item.weight, 1)}%"></div></div>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="action-row">
      <a class="secondary-btn" href="${fund.uploadJson}">Open JSON</a>
      <a class="secondary-btn" href="${fund.uploadMd}">Open Markdown</a>
    </div>
  </article>
`).join("");

// Architecture
const familyMap = [
  { title: "1. AFEX umbrella", body: "One continental family name for 54 sovereign country export-index funds with shared documentation, governance rules, and USD comparison." },
  { title: "2. Five subfamilies", body: "NAEX (North), WAEX (West), CAEX (Central), EAEX (East), SAEX (Southern) — each with its own regional comparison currency where applicable." },
  { title: "3. Three methodology models", body: "Coastal export model for port-led economies, landlocked corridor model for border-trade economies, and island export model for maritime/air flows." },
  { title: "4. Country specialization", body: "Each country keeps its own export methodology, weighting, and candidate commodity universe while staying aligned to the family architecture." },
  { title: "5. Shared governance", body: "Every fund stays separate legally, but the methodology framework, risk language, upload format, and naming rules remain aligned continent-wide." }
];

document.getElementById("family-map").innerHTML = familyMap.map((item) => `
  <article class="card"><strong>${item.title}</strong><div class="muted">${item.body}</div></article>
`).join("");

// Methodology models
const methodologyModels = [
  {
    name: "Coastal Export Model",
    count: coastalCount,
    description: "Use outbound export tonnage across port-led export flows and official trade statistics.",
    examples: "CIREX, ALGEX, EGYEX, NGAEX, KENEX, ZAFEX"
  },
  {
    name: "Landlocked Corridor Model",
    count: landlockedCount,
    description: "Use outbound export tonnage across road, rail, air, border-post, and transit-corridor flows rather than seaborne loading.",
    examples: "BUREX, ETHEX, MALIEX, DRCEX, ZMBEX, ZIMEX"
  },
  {
    name: "Island Export Model",
    count: islandCount,
    description: "Use outbound export tonnage across maritime and air flows, with an explicit diversification caution where the raw-material base is narrow.",
    examples: "CABEX, STPEX, COMREX, MDGEX, MUSEX, SEYEX"
  }
];

document.getElementById("methodology-grid").innerHTML = methodologyModels.map((m) => `
  <article class="compare-card">
    <h3>${m.name}</h3>
    <div class="stat-value">${m.count}</div>
    <div class="muted">countries</div>
    <p>${m.description}</p>
    <div class="pill-row">${m.examples.split(", ").map((item) => `<span class="pill soft">${item}</span>`).join("")}</div>
  </article>
`).join("");

// Upload center
const uploadPackages = [
  {
    name: "AFEX All-54 Manifest",
    summary: "Master manifest for the entire 54-country library.",
    links: [
    { label: "JSON", href: "../exports/afex_all54_manifest.json" },
    { label: "Markdown", href: "../exports/afex_all54_manifest.md" }
    ]
  },
  {
    name: "CIREX Detailed Package",
    summary: "Cote d'Ivoire detailed prototype with weights.",
    links: [
    { label: "JSON", href: "../exports/cirex_fund_characteristics.json" },
    { label: "ZIP", href: "../exports/cirex_wasi_upload_package.zip" }
    ]
  },
  {
    name: "BUREX Detailed Package",
    summary: "Burkina Faso detailed prototype with corridor overlay.",
    links: [
    { label: "JSON", href: "../exports/burex_fund_characteristics.json" },
    { label: "ZIP", href: "../exports/burex_wasi_upload_package.zip" }
    ]
  },
  {
    name: "WAEX Family Package",
    summary: "West Africa umbrella family characteristics.",
    links: [
    { label: "JSON", href: "../exports/waex_family_characteristics.json" },
    { label: "ZIP", href: "../exports/waex_wasi_upload_package.zip" }
    ]
  }
];

subfamilies.forEach((sf) => {
  uploadPackages.push({
    name: `${sf.code} Region (${sf.countries.length})`,
    summary: `${sf.countries.length} country packages in ${sf.name}.`,
    links: sf.countries.slice(0, 2).map((c) => ({
      label: c.code,
      href: `../exports/${c.code.toLowerCase()}/${c.code.toLowerCase()}_fund_characteristics.json`
    }))
  });
});

document.getElementById("upload-center").innerHTML = uploadPackages.map((pkg) => `
  <article class="mini-card">
    <strong>${pkg.name}</strong>
    <div class="muted">${pkg.summary}</div>
    <div class="action-row compact">${pkg.links.map((link) => `<a class="secondary-btn small-btn" href="${link.href}">${link.label}</a>`).join("")}</div>
  </article>
`).join("");

// Scope notes
const scopeNotes = [
  { title: "54 sovereign states", body: "This library follows the 54-sovereign-state interpretation of Africa. The African Union has 55 member states, including the Sahrawi Arab Democratic Republic." },
  { title: "Pre-launch status", body: "All country packages are proposed and pre-launch. Official country trade statistics, benchmark rules, and legal review should be completed before institutional launch." },
  { title: "Regulatory separation", body: "Country-specific legal and securities review is required. Do not assume one regulatory regime applies across all 54 sovereign states." },
  { title: "Microfinance separation", body: "Fund vehicles should remain separate from any microfinance balance sheet." }
];

document.getElementById("scope-notes").innerHTML = scopeNotes.map((item) => `
  <article class="card"><strong>${item.title}</strong><div class="muted">${item.body}</div></article>
`).join("");

function labelStatus(status) {
  if (status === "ready") return "Ready now";
  if (status === "building") return "Built in workspace";
  return "Future";
}

function formatWholePercent(value) {
  return `${Math.round(value)}%`;
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function formatModel(model) {
  if (model === "coastal_export_model") return "Coastal";
  if (model === "landlocked_corridor_model") return "Landlocked";
  return "Island";
}

function formatRole(role) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
