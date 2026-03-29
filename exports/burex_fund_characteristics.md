# BUREX Fund Characteristics

## Status

- Stage: `proposed_pre_launch`
- Vehicle status: `not_yet_constituted`
- Purpose: prepare a structured profile for upload into another intelligence platform

## Core Identity

- Fund name: `BUREX Fund`
- Full name: `Burkina Faso Raw Export Index Fund`
- Benchmark: `Burkina Faso Raw Export Index`
- Benchmark code: `BUREX`
- Fund family: `WAEX`
- Base currency: `XOF`
- NAV currency: `XOF`
- Strategy type: `rules-based index tracking`
- Region: `Burkina Faso`

## Family Position

- `WAEX` = `West Africa Export Index Family`
- `BUREX` is the landlocked-corridor member inside the family
- Shared family rule: country funds keep their own raw-export methodology but stay aligned to one naming, governance, and upload structure
- Current sibling fund: `CIREX`

## Investment Objective

- Track the main raw materials exported from Burkina Faso in `XOF`
- Represent the country's physical export economy through a transparent benchmark
- Create a future foundation for a regulated investment product linked to Burkina Faso's export base

## Methodology Adjustment

- Burkina Faso is landlocked
- The benchmark should use `outbound export tonnage across all transport modes`
- It should not be framed as a seaborne shipment index
- The corridor overlay should explicitly include `Ghana`, `Togo`, `Benin`, `Cote d'Ivoire`, `Mali`, and `Niger`

## Benchmark Methodology

- Weighting: `trailing 20-year average export tonnage`
- Transport basis: `road, rail, air, and transit export flows`
- Corridor-country coverage: `Ghana, Togo, Benin, Cote d'Ivoire, Mali, Niger`
- Reconstitution: `annual`
- Rebalancing: `quarterly`
- Pricing basis: `reference commodity prices in XOF`
- Coverage rule: `all major raw materials exported from Burkina Faso`
- Important caution: pure tonnage weighting pushes very low weights onto high-value low-mass exports like gold

## Proposed Fund Structure

- Vehicle type: `separate regulated investment vehicle`
- Relationship to microfinance: `must be separate from any SFD microfinance entity`
- Current form: `reference fund profile`
- Future forms:
  - collective investment vehicle
  - structured note
  - tokenized fund shares

## Constituent Universe

| Code | Name | Category | In Reference Index | Futures Candidate | Illustrative Weight | 2023 Quantity |
|---|---|---|---|---|---|---|
| `other_oily_seeds` | Other Oily Seeds | Softs | Yes | No | 41.94% | 212,623,000 kg |
| `cashew_nuts` | Cashew Nuts | Softs | Yes | No | 25.26% | 128,061,000 kg |
| `raw_cotton` | Raw Cotton | Softs | Yes | Yes | 24.52% | 124,346,000 kg |
| `sesame_seeds` | Sesame Seeds | Softs | Yes | No | 8.24% | 41,783,000 kg |
| `zinc_ore` | Zinc Ore | Metals | Yes | No | 0.04% | 196,000 kg |
| `gold` | Gold | Metals | Yes | Yes | 0.00% | 17 kg |

## Important Weight Note

- The illustrative weights above are derived from currently verified `2023` export quantities
- They are not final institutional weights
- Official trailing 20-year export-tonnage data should replace them before launch

## Market Context

- World Bank reporting shows gold represented about `85%` of Burkina Faso's exports in `2021`
- That makes `BUREX` very different from a value-weighted benchmark
- Tonnage weighting reflects physical export flow, not export-value concentration
- Coastal transit corridors to monitor: `Cote d'Ivoire`, `Ghana`, `Togo`, `Benin`
- Sahel border trade links to monitor: `Mali`, `Niger`
- As of `January 29, 2025`, Burkina Faso, Mali, and Niger ceased ECOWAS membership, but ECOWAS stated that goods and services from the three countries would continue to be treated under the ECOWAS Trade Liberalization Scheme and ECOWAS Investment Policy until further notice

## Data Requirements

- Customs export records by commodity
- Transport and transit tonnage records
- Border-post and corridor-flow data for `Ghana`, `Togo`, `Benin`, `Cote d'Ivoire`, `Mali`, and `Niger`
- Official trade statistics
- Recognized spot or reference prices
- XOF pricing or FX conversion logic
- Index committee and documented source hierarchy

## Governance

- Index committee required: `Yes`
- Roles:
  - constituent review
  - pricing source review
  - methodology change control
  - exception management
- Independent oversight required: `Yes`

## Target Users

- WAEMU high-net-worth investors
- Family offices
- Africa-focused institutions
- Commodity/export-theme allocators
- Research and advisory platforms

## Key Risks

- commodity price volatility
- country concentration
- data quality risk
- illiquidity for non-futures constituents
- regulatory approval risk
- operational governance risk

## Technology Layer

- Tokenization ready: `Yes`
- Tokenization status: `design only`
- CBDC ready: `Yes`
- CBDC status: `do not assume a live XOF CBDC in this profile`
- x402 ready: `Yes`
- x402 role: programmable access and payment layer, not the legal fund ledger

## Microfinance Relationship

- Allowed relationship:
  - export context for credit decisions
  - borrower sector monitoring
  - client education
- Disallowed assumption:
  - the microfinance entity should not itself be treated as the fund vehicle

## Regulatory Positioning

- SFD microfinance activity covers deposits, loans, and signature guarantees
- A future collective investment product would require the relevant capital-markets approval process
- The fund should be separated from any SFD balance sheet

## Source References

- WITS cashew exports 2023: [https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/080130](https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/080130)
- WITS cotton exports 2023: [https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/520100](https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/520100)
- WITS sesame exports 2023: [https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/120740](https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/120740)
- WITS other oily seeds exports 2023: [https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/120799](https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/120799)
- WITS zinc ore exports 2023: [https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/260800](https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/260800)
- WITS gold exports 2023: [https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/710812](https://wits.worldbank.org/trade/comtrade/en/country/BFA/year/2023/tradeflow/Exports/partner/ALL/product/710812)
- World Bank Burkina Faso Economic Update: [https://documents1.worldbank.org/curated/en/099215005172234233/pdf/P17725409e482f08108e0d082f60e93b442.pdf](https://documents1.worldbank.org/curated/en/099215005172234233/pdf/P17725409e482f08108e0d082f60e93b442.pdf)
- ECOWAS withdrawal and continuity notice dated January 30, 2025: [https://www.ecowas.int/burkina-faso-mali-and-nigers-withdrawal-from-ecowas-is-now-a-reality/](https://www.ecowas.int/burkina-faso-mali-and-nigers-withdrawal-from-ecowas-is-now-a-reality/)
- BCEAO SFD operations: [https://www.bceao.int/fr/documents/operations-que-les-sfd-sont-autorises-realiser](https://www.bceao.int/fr/documents/operations-que-les-sfd-sont-autorises-realiser)
- CREPMF General Regulation: [https://www.crepmf.org/assets/docs/general/Reglement_General.pdf](https://www.crepmf.org/assets/docs/general/Reglement_General.pdf)
