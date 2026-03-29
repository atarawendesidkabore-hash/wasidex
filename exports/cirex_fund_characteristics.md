# CIREX Fund Characteristics

## Status

- Stage: `proposed_pre_launch`
- Vehicle status: `not_yet_constituted`
- Purpose: prepare a structured profile for upload into another intelligence platform

## Core Identity

- Fund name: `CIREX Fund`
- Full name: `Cote d'Ivoire Raw Export Index Fund`
- Benchmark: `Cote d'Ivoire Raw Export Index`
- Benchmark code: `CIREX`
- Fund family: `WAEX`
- Base currency: `XOF`
- NAV currency: `XOF`
- Strategy type: `rules-based index tracking`
- Region: `Cote d'Ivoire`

## Family Position

- `WAEX` = `West Africa Export Index Family`
- `CIREX` is the coastal-anchor member inside the family
- Shared family rule: country funds keep their own raw-export methodology but stay aligned to one naming, governance, and upload structure
- Current sibling fund: `BUREX`

## Investment Objective

- Track the main raw materials exported from Cote d'Ivoire in `XOF`
- Represent the physical export economy through a transparent benchmark
- Create a future foundation for a regulated investment product linked to Cote d'Ivoire's export base

## Benchmark Methodology

- Weighting: `trailing 20-year average export tonnage`
- Reconstitution: `annual`
- Rebalancing: `quarterly`
- Pricing basis: `reference commodity prices in XOF`
- Coverage rule: `all major raw materials exported from Cote d'Ivoire`
- Important caution: pure tonnage weighting pushes very low weights onto high-value low-mass exports like gold and diamonds

## Proposed Fund Structure

- Vehicle type: `separate regulated investment vehicle`
- Relationship to microfinance: `must be separate from any SFD microfinance entity`
- Current form: `reference fund profile`
- Future forms:
  - collective investment vehicle
  - structured note
  - tokenized fund shares

## Constituent Universe

| Code | Name | Category | In Reference Index | Futures Candidate | Illustrative Weight |
|---|---|---|---|---|---|
| `cocoa_beans` | Cocoa Beans | Softs | Yes | Yes | 33.90% |
| `natural_rubber` | Natural Rubber | Industrial Agriculture | Yes | Yes | 19.26% |
| `cashew_nuts` | Cashew Nuts | Softs | Yes | No | 15.10% |
| `crude_oil` | Crude Oil | Energy | Yes | Yes | 11.71% |
| `manganese` | Manganese Ore | Metals | Yes | No | 7.86% |
| `palm_oil` | Palm Oil | Industrial Agriculture | Yes | Yes | 4.47% |
| `raw_cotton` | Raw Cotton | Softs | Yes | Yes | 3.70% |
| `coffee` | Coffee | Softs | Yes | Yes | 2.39% |
| `nickel` | Nickel Ore | Metals | Yes | Yes | 1.62% |
| `gold` | Gold | Metals | Yes | Yes | 0.00% |
| `diamonds` | Diamonds | Metals | Yes | No | 0.00% |

## Important Weight Note

- The illustrative weights above come from the current local prototype dataset
- They are not final institutional weights
- Official 20-year shipment data should replace them before launch

## Data Requirements

- Port loading data by commodity
- Customs export records
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

## Current Stage

Live now:

- offline ecosystem hub
- offline microfinance operations app
- prototype CIREX market dashboard

Not live yet:

- regulated fund vehicle
- investor portal
- live data pipeline
- tokenized share issuance

## Source References

- BCEAO SFD operations: [https://www.bceao.int/fr/documents/operations-que-les-sfd-sont-autorises-realiser](https://www.bceao.int/fr/documents/operations-que-les-sfd-sont-autorises-realiser)
- CREPMF General Regulation: [https://www.crepmf.org/assets/docs/general/Reglement_General.pdf](https://www.crepmf.org/assets/docs/general/Reglement_General.pdf)
