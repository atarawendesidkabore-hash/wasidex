# NGAEX — Nigeria Raw Export Index Fund

## Status: Detailed Prototype Ready

## Fund Identity

| Field | Value |
|---|---|
| Fund Name | NGAEX Fund |
| Full Name | Nigeria Raw Export Index Fund |
| Benchmark | Nigeria Raw Export Index |
| Ticker | NGAEX |
| ISO3 | NGA |
| Base Currency | NGN |
| Comparison | USD (continental) |
| Base Index Level | 100.0 (2023-01-01) |

## Classification

| Field | Value |
|---|---|
| Family | AFEX — Africa Export Index Family |
| Subfamily | WAEX — West Africa Export Index Family |
| Role | Energy Anchor Member |
| Model | Coastal Export Model |
| Profile | Detailed Prototype Ready |

## Investment Objective

Track the evolution of the main raw materials exported from Nigeria through a transparent, rules-based benchmark measured in NGN.

### Economic Thesis

- Nigeria is Africa's largest oil producer and the continent's biggest economy, with an export base heavily concentrated in hydrocarbons.
- Crude oil and natural gas account for over 90% of export revenues.
- Agricultural exports (cocoa, sesame, rubber) represent a secondary but structurally important layer.
- NGN denomination makes the benchmark locally relevant for Nigerian institutional investors and pension funds.
- The Lagos-Apapa and Bonny Island export corridors anchor the physical flow of Nigerian commodity exports.

## Benchmark Methodology

| Field | Value |
|---|---|
| Weighting | Trailing 20-year average export tonnage |
| Reconstitution | Annual |
| Rebalancing | Quarterly |
| Pricing | Reference prices in NGN |
| Coverage | All major raw material exports |

**Caution:** Extreme energy concentration means the index is heavily correlated with global oil prices. Pure tonnage weighting amplifies LNG and crude relative to agricultural exports.

## Constituent Universe (6 commodities)

| # | Commodity | Category | Futures Candidate | Illustrative Weight |
|---|---|---|---|---|
| 1 | Crude Oil | Energy | Yes | 58.20% |
| 2 | Natural Gas (LNG) | Energy | Yes | 28.50% |
| 3 | Cocoa Beans | Softs | Yes | 5.40% |
| 4 | Sesame Seeds | Agriculture | No | 4.10% |
| 5 | Natural Rubber | Industrial Agri | Yes | 2.30% |
| 6 | Urea (Fertilizer) | Petrochemicals | No | 1.50% |

**Note:** Illustrative weights are prototype values. Replace with official 20-year data from NBS and Nigeria Customs before launch.

## Energy Concentration Warning

Oil + Gas = ~86.7% of the index by tonnage. This reflects the structural reality of Nigeria's export economy but creates extreme correlation with global energy markets.

## Corridor Relevance

Nigeria's port system (Lagos/Apapa, Onne, Calabar) serves the entire West African subregion. Corridors to Benin, Niger, Cameroon, and Chad are critical trade links.

## Risk Factors

- Extreme energy concentration (>85%)
- Global oil price volatility and OPEC policy
- NGN exchange rate volatility and FX liquidity
- Oil theft and pipeline vandalism impact on volumes
- Data quality and NNPC reporting transparency
- SEC Nigeria regulatory and approval risk
- PIA (Petroleum Industry Act) transition risk

## Regulatory Positioning

- **Regulator:** Securities and Exchange Commission Nigeria (SEC Nigeria)
- **Framework:** Investments and Securities Act 2007
- **Stock Exchange:** Nigerian Exchange Group (NGX)
- A future ETF or collective investment product requires SEC Nigeria approval.
- The fund vehicle must remain separate from any microfinance or banking entity.
- PIA 2021 impacts must be monitored for export volume reporting.

## Technology Layer

- Tokenization: design only (ready when permitted)
- CBDC: eNaira launched, acknowledged but not yet integrated
- x402: programmable access layer ready
- NGX listing pathway available for future ETF

## Required Next Documents

1. Full benchmark methodology document
2. Fund term sheet
3. SEC Nigeria regulatory memo
4. NNPC data access agreement
5. Data source policy
6. Index governance charter
7. Risk disclosure document
8. Investor factsheet

## References

- https://sec.gov.ng/
- https://ngxgroup.com/
- https://www.nigerianstat.gov.ng/
- https://www.nnpcgroup.com/
