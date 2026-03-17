# Implementation PRD / Engineering Plan - AI Financial Planner (v1)

## 1. Purpose

This document translates the locked MVP PRD into an implementation-ready engineering plan.

It is based on two source artifacts in this repo:

1. `MVP PRD - AI Financial Planner (v1).md` as the locked product definition
2. `Financial Projections Template.xlsx` as the workbook parity reference

Core rule: the production app is not Excel in the browser. The workbook is the parity oracle for the deterministic finance engine.

## 2. Scope and Locked Assumptions

This plan assumes:

- US-only launch
- English-only UI and AI
- single-user accounts only in v1
- multiple businesses and multiple scenarios per user
- deterministic calculation engine in TypeScript
- AI used for onboarding, explanation, estimation help, diagnostics help, scenario creation, and change proposals
- AI never writes directly to assumptions without explicit user approval
- PDF and CSV export included in both plans
- paid plans from day one with AI usage limits

Recommended implementation stack:

- Frontend: Next.js App Router + React + TypeScript + Tailwind + shadcn/ui
- Backend and database: Convex
- Calculation engine: shared TypeScript module consumed by Convex actions and the UI
- Auth: Clerk or equivalent OIDC provider
- Billing: Stripe
- AI: OpenAI Responses API with structured tool outputs
- Background work: Convex actions and scheduling where needed

The UI route map below assumes Next.js App Router. The backend surface should be implemented as Convex queries, mutations, actions, and HTTP actions rather than a separate REST API.

## 3. Workbook Parity Map

| App area | Workbook tabs | Notes |
| --- | --- | --- |
| Setup | `Directions` | Identity, period start, currency/region, high-level instructions |
| Opening Position & Funding | `1-StartingPoint` | Fixed assets, startup costs, funding, opening balances |
| Payroll | `2a-PayrollYear1`, `2b-PayrollYrs1-3` | Year 1 monthly detail, Years 2-3 growth |
| Revenue | `3a-SalesForecastYear1`, `3b-SalesForecastYrs1-3`, `COGS Calculator` | Dynamic revenue lines plus COGS helper |
| Cash & Financing | `4-AdditionalInputs`, `6a-CashFlowYear1`, `6b-CashFlowYrs1-3`, `Amortization&Depreciation` | Working capital, LOC, tax, debt, capex |
| Expenses | `5a-OpExYear1`, `5b-OpExYrs1-3` | Year 1 monthly OpEx, Years 2-3 growth |
| Statements | `7a-IncomeStatementYear1`, `7b-IncomeStatementYrs1-3`, `8-BalanceSheet`, `BreakevenAnalysis`, `FinancialRatios` | Reporting and KPI layer |
| Diagnostics | `DiagnosticTools` | Human-readable findings derived from model outputs |

## 4. Route Map

### 4.1 Public routes

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | Landing page | Product positioning, examples, CTA |
| `/pricing` | Pricing page | Builder vs Pro, AI usage explanation |
| `/sign-in` | Sign in | Email/password or magic link |
| `/sign-up` | Sign up | Account creation |
| `/legal/terms` | Terms | Required for paid launch |
| `/legal/privacy` | Privacy | Required for paid launch |

### 4.2 Authenticated app routes

| Route | Purpose | Notes |
| --- | --- | --- |
| `/app` | Business dashboard | Default post-login screen |
| `/app/businesses/new` | Create business | Opens wizard or manual setup |
| `/app/businesses/[businessId]` | Business redirect | Redirects to base scenario overview |
| `/app/businesses/[businessId]/settings` | Business-level metadata | Rename/archive/delete business |
| `/app/businesses/[businessId]/scenarios` | Scenario list | Base, best, worst, custom scenarios |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/wizard/step-1` ... `/step-9` | AI wizard | One concept per screen |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/overview` | Executive summary | Default scenario home |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/setup` | Setup screen | Identity and high-level model settings |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/opening-funding` | Opening position and funding | Mirrors `1-StartingPoint` |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/revenue/year-1` | Revenue monthly detail | Year 1 edit grid |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/revenue/years-2-3` | Revenue summary | Growth-driven forward plan |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/payroll/year-1` | Payroll monthly detail | Year 1 edit grid |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/payroll/years-2-3` | Payroll summary | Year 2-3 growth |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/expenses/year-1` | OpEx monthly detail | Year 1 edit grid |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/expenses/years-2-3` | OpEx summary | Year 2-3 growth |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/cash-financing` | Working capital, tax, debt, capex | Primary assumptions page |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/statements/income-statement` | Income statement | Year 1 monthly + Year 2-3 annual |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/statements/balance-sheet` | Balance sheet | Annual only in v1 |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/statements/break-even` | Break-even | Annual and monthly |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/statements/ratios` | Ratios | Includes manual industry norms |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/diagnostics` | Diagnostics | Explainable warnings and suggested actions |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/scenarios` | Scenario compare/manage | Clone, branch, compare |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/imports/actuals` | CSV/manual actuals import | Ongoing business support |
| `/app/businesses/[businessId]/scenarios/[scenarioId]/exports` | Export center | PDF and CSV jobs |
| `/app/settings/billing` | Billing and plan usage | Stripe portal, AI usage meter |
| `/app/settings/account` | Profile | Name, email, password |

### 4.3 Convex function surface

Preferred backend shape:

| Function | Type | Purpose |
| --- | --- | --- |
| `businesses.listByUser` | query | Dashboard business list |
| `businesses.create` | mutation | Create business |
| `businesses.updateMeta` | mutation | Rename/archive/update business metadata |
| `scenarios.listByBusiness` | query | Scenario list |
| `scenarios.create` | mutation | Create scenario |
| `scenarios.clone` | mutation | Duplicate scenario |
| `scenarios.updateMeta` | mutation | Update scenario metadata |
| `assumptions.getWorkspace` | query | Load all writable inputs for current screen |
| `assumptions.upsert*` | mutation | Save screen-specific assumption groups |
| `engine.recalculateScenario` | action | Rebuild deterministic outputs and persist snapshots |
| `snapshots.getOverview` | query | Read KPI summary and charts |
| `snapshots.getStatements` | query | Read statement outputs |
| `snapshots.getDiagnostics` | query | Read diagnostic cards |
| `imports.uploadCsv` | action | Parse uploaded CSV |
| `imports.saveMapping` | mutation | Store approved mapping |
| `imports.applyActuals` | action | Normalize and apply imported actuals |
| `exports.generatePdf` | action | Queue/build PDF export |
| `exports.generateCsv` | action | Queue/build CSV export bundle |
| `ai.respond` | action | Wizard/contextual assistant entrypoint |
| `ai.approveSuggestion` | mutation | Apply approved AI change set |
| `ai.rejectSuggestion` | mutation | Reject AI change set |
| `billing.createCheckoutSession` | action | Start Stripe checkout |
| `billing.createPortalSession` | action | Open Stripe customer portal |
| `billing.stripeWebhook` | httpAction | Subscription state sync from Stripe |

## 5. App Shell

Shared shell for all scenario workspace routes:

```text
+----------------------------------------------------------------------------------+
| Top bar: Business switcher | Scenario switcher | Last calc | Export | User menu |
+----------------------------------------------------------------------------------+
| Left nav: Overview | Setup | Revenue | Payroll | Expenses | Cash | Statements   |
|           Diagnostics | Scenarios | Imports | Exports | Billing                  |
+----------------------------------------------------------------------------------+
| Main content area                                                        | AI    |
|                                                                          | panel |
|                                                                          |       |
+----------------------------------------------------------------------------------+
| Footer: workbook parity version | legal disclaimer | AI usage meter             |
+----------------------------------------------------------------------------------+
```

Rules:

- AI side panel is persistent on all major screens
- recalculation happens automatically on saved assumption changes, debounced
- all writable tables show save state, override badges, and validation status
- Year 1 screens default to monthly edit grids
- Years 2-3 screens default to summary tables with month-detail drawer on demand

## 6. Screen-by-Screen Wireframes

### 6.1 Business dashboard

Route: `/app`

```text
+----------------------------------------------------------------------------------+
| Header: My Businesses                                     [New Business Model]   |
+----------------------------------------------------------------------------------+
| Filters: Search | Status | Profile Type | Last Updated                           |
+----------------------------------------------------------------------------------+
| Card grid                                                                      |
| +----------------------+  +----------------------+  +----------------------+      |
| | Business name        |  | Business name        |  | Business name        |      |
| | Base scenario badge  |  | Base scenario badge  |  | Base scenario badge  |      |
| | Ending cash          |  | Ending cash          |  | Ending cash          |      |
| | Year 1 revenue       |  | Year 1 revenue       |  | Year 1 revenue       |      |
| | Status               |  | Status               |  | Status               |      |
| | [Open] [Scenarios]   |  | [Open] [Scenarios]   |  | [Open] [Scenarios]   |      |
| +----------------------+  +----------------------+  +----------------------+      |
+----------------------------------------------------------------------------------+
```

Key actions:

- create business
- duplicate base scenario
- rename/archive/delete business
- open scenario workspace

### 6.2 Wizard shell

Routes: `/wizard/step-1` through `/wizard/step-9`

```text
+----------------------------------------------------------------------------------+
| Stepper: 1 Basics | 2 Profile | 3 Opening | 4 Revenue | 5 COGS | 6 Payroll ... |
+----------------------------------------------------------------------------------+
| Left: AI-guided interview                                                     |
| +----------------------------------------------------------------------------+ |
| | AI question                                                                | |
| | field(s) for current concept                                               | |
| | helper text                                                                | |
| | [I don't know] [Use estimate help]                                         | |
| +----------------------------------------------------------------------------+ |
| Right: running summary                                                       |
| +----------------------------+                                               |
| | Business basics summary    |                                               |
| | Current assumptions        |                                               |
| | Warnings / missing fields  |                                               |
| +----------------------------+                                               |
+----------------------------------------------------------------------------------+
| Back | Save draft | Continue                                                   |
+----------------------------------------------------------------------------------+
```

Wizard steps:

| Step | Route | Fields |
| --- | --- | --- |
| 1 | `/wizard/step-1` | model name, business name, preparer name, start month, start year, currency, country/region, business stage |
| 2 | `/wizard/step-2` | business profile/type |
| 3 | `/wizard/step-3` | opening position, startup picture, funding source rows, opening balances |
| 4 | `/wizard/step-4` | first revenue lines, Month 1 units/jobs, price, COGS, growth |
| 5 | `/wizard/step-5` | COGS estimate helper selection and result confirmation |
| 6 | `/wizard/step-6` | payroll roles and global payroll assumptions |
| 7 | `/wizard/step-7` | Year 1 operating expenses and Years 2-3 growth assumptions |
| 8 | `/wizard/step-8` | A/R timing, A/P timing, minimum cash, LOC behavior, taxes, capex |
| 9 | `/wizard/step-9` | assumption review, warnings, funding gap check, create base case |

### 6.3 Overview

Route: `/overview`

```text
+----------------------------------------------------------------------------------+
| Header: Scenario name | Status badge | Last updated | [Compare] [Export]         |
+----------------------------------------------------------------------------------+
| KPI row: Revenue | Gross Margin % | Net Income | Ending Cash | Max LOC | DSCR    |
+----------------------------------------------------------------------------------+
| Left: charts                                 | Right: alerts                       |
| Revenue by month                             | Cash shortfall                     |
| Ending cash by month                         | Margin too low                     |
| Net income by month                          | Break-even not met                 |
| Scenario comparison mini-chart               | Balance sheet warning              |
+----------------------------------------------------------------------------------+
| Summary cards: break-even | current ratio | diagnostics count | AI summary        |
+----------------------------------------------------------------------------------+
```

### 6.4 Setup

Route: `/setup`

```text
+----------------------------------------------------------------------------------+
| Setup                                                                           |
+----------------------------------------------------------------------------------+
| Left: form                                                                      |
| Model name                                                                      |
| Business name                                                                   |
| Preparer name                                                                   |
| Start month / year                                                              |
| Currency                                                                        |
| Country / region                                                                |
| Business profile                                                                |
| Stage                                                                           |
| Notes                                                                           |
|                                                                                 |
| Right: read-only model rules                                                    |
| Year 1 detail / Years 2-3 summary                                               |
| US-only / English-only                                                          |
| Scenario metadata                                                               |
+----------------------------------------------------------------------------------+
```

### 6.5 Opening Position & Funding

Route: `/opening-funding`

```text
+----------------------------------------------------------------------------------+
| Opening Position & Funding                                                      |
+----------------------------------------------------------------------------------+
| Fixed assets table                    | Funding sources table                    |
| category | amount | dep years | notes | source | amount | rate | term | pay     |
+----------------------------------------------------------------------------------+
| Startup / operating capital table     | Existing business opening balances       |
| category | amount | notes             | cash | A/R | prepaid | A/P | accrued     |
+----------------------------------------------------------------------------------+
| Footer outputs: total fixed assets | total operating capital | total required    |
| funds | total sources | funding gap / surplus | balanced status                  |
+----------------------------------------------------------------------------------+
```

### 6.6 Revenue Year 1

Route: `/revenue/year-1`

```text
+----------------------------------------------------------------------------------+
| Revenue - Year 1                                              [Add line]        |
+----------------------------------------------------------------------------------+
| Driver table                                                                     |
| line | unit label | month 1 units | price | COGS | margin | Q1 | Q2 | Q3 | Q4  |
+----------------------------------------------------------------------------------+
| Monthly grid                                                                     |
| line | Jan | Feb | Mar | ... | Dec | annual total | override badge             |
+----------------------------------------------------------------------------------+
| Right panel: COGS helper / AI explanation / line detail                         |
+----------------------------------------------------------------------------------+
```

### 6.7 Revenue Years 2-3

Route: `/revenue/years-2-3`

```text
+----------------------------------------------------------------------------------+
| Revenue - Years 2-3                                                             |
+----------------------------------------------------------------------------------+
| Summary table                                                                    |
| line | Year 1 total | Year 2 monthly growth | Year 2 total | Year 3 growth | Y3 |
+----------------------------------------------------------------------------------+
| Lower panel: month-detail drawer for selected line                               |
| Month 13..24 or Month 25..36                                                     |
+----------------------------------------------------------------------------------+
```

### 6.8 Payroll Year 1

Route: `/payroll/year-1`

```text
+----------------------------------------------------------------------------------+
| Payroll - Year 1                                              [Add role]        |
+----------------------------------------------------------------------------------+
| Role drivers table                                                               |
| role | type | headcount | hourly/monthly | pay | hours/wk | start | end         |
+----------------------------------------------------------------------------------+
| Monthly payroll grid                                                             |
| role | Jan | Feb | ... | Dec | annual total | override badge                    |
+----------------------------------------------------------------------------------+
| Tax and benefits assumptions                                                     |
| SS | Medicare | FUTA | SUTA | Pension | Workers comp | Health | Other           |
+----------------------------------------------------------------------------------+
```

### 6.9 Payroll Years 2-3

Route: `/payroll/years-2-3`

```text
+----------------------------------------------------------------------------------+
| Payroll - Years 2-3                                                             |
+----------------------------------------------------------------------------------+
| Role summary                                                                     |
| role | Year 1 total | growth 1->2 | Year 2 total | growth 2->3 | Year 3 total  |
+----------------------------------------------------------------------------------+
| Benefits summary                                                                 |
| tax/benefit line | Year 1 | Year 2 | Year 3                                     |
+----------------------------------------------------------------------------------+
```

### 6.10 Expenses Year 1

Route: `/expenses/year-1`

```text
+----------------------------------------------------------------------------------+
| Expenses - Year 1                                           [Add custom line]   |
+----------------------------------------------------------------------------------+
| Monthly OpEx grid                                                                 |
| category | Jan | Feb | ... | Dec | annual total                                 |
+----------------------------------------------------------------------------------+
| Read-only calculated section                                                      |
| depreciation | interest by debt type | LOC interest | bad debt                   |
+----------------------------------------------------------------------------------+
```

### 6.11 Expenses Years 2-3

Route: `/expenses/years-2-3`

```text
+----------------------------------------------------------------------------------+
| Expenses - Years 2-3                                                            |
+----------------------------------------------------------------------------------+
| category | Year 1 total | growth 1->2 | Year 2 total | growth 2->3 | Year 3    |
+----------------------------------------------------------------------------------+
| Read-only calculated other expenses remain visible below                         |
+----------------------------------------------------------------------------------+
```

### 6.12 Cash & Financing

Route: `/cash-financing`

```text
+----------------------------------------------------------------------------------+
| Cash & Financing                                                                 |
+----------------------------------------------------------------------------------+
| A/R timing         | A/P timing           | Min cash / LOC                       |
| 0-30 | 30-60 | 60+ | 0-30 | 30-60 | 60+  | min cash | LOC rate | behavior       |
+----------------------------------------------------------------------------------+
| Additional capex table                                                           |
| category | dep years | M1..M12 | Y1 total | Y2 annual | Y3 annual               |
+----------------------------------------------------------------------------------+
| Tax + amortization                                                               |
| tax Y1 | tax Y2 | tax Y3 | amortization years                                    |
+----------------------------------------------------------------------------------+
| Manual cash items by month                                                       |
| taxes paid | owner draws | dividends | inventory | manual LOC repayment          |
+----------------------------------------------------------------------------------+
```

### 6.13 Statements

Routes:

- `/statements/income-statement`
- `/statements/balance-sheet`
- `/statements/break-even`
- `/statements/ratios`

```text
+----------------------------------------------------------------------------------+
| Statements                                                                       |
+----------------------------------------------------------------------------------+
| Tab row: Income Statement | Balance Sheet | Break-even | Ratios                  |
+----------------------------------------------------------------------------------+
| Selected report table                                                            |
| read-only, export-friendly, parity checked                                       |
+----------------------------------------------------------------------------------+
| Right rail: explanation, drill-down source, AI teaching                          |
+----------------------------------------------------------------------------------+
```

### 6.14 Diagnostics

Route: `/diagnostics`

```text
+----------------------------------------------------------------------------------+
| Diagnostics                                                                      |
+----------------------------------------------------------------------------------+
| Filters: severity | area | status                                                |
+----------------------------------------------------------------------------------+
| Card list                                                                         |
| title | severity | based on your model | why it matters | next action | Ask AI   |
+----------------------------------------------------------------------------------+
```

### 6.15 Scenarios

Route: `/scenarios`

```text
+----------------------------------------------------------------------------------+
| Scenarios                                                        [New Variant]   |
+----------------------------------------------------------------------------------+
| Table                                                                             |
| name | notes | last updated | ending cash | net income | compare checkbox        |
+----------------------------------------------------------------------------------+
| Bottom compare panel                                                              |
| metric matrix across selected scenarios                                           |
+----------------------------------------------------------------------------------+
```

### 6.16 Imports / Actuals

Route: `/imports/actuals`

```text
+----------------------------------------------------------------------------------+
| Import Trailing Actuals                                                           |
+----------------------------------------------------------------------------------+
| Step 1 Upload CSV                                                                 |
| Step 2 Map columns                                                                |
| Step 3 Validate periods and totals                                                |
| Step 4 Preview normalized rows                                                    |
| Step 5 Apply import                                                               |
+----------------------------------------------------------------------------------+
| Right rail: mapping help from AI, approval required                               |
+----------------------------------------------------------------------------------+
```

### 6.17 Exports

Route: `/exports`

```text
+----------------------------------------------------------------------------------+
| Exports                                                                           |
+----------------------------------------------------------------------------------+
| PDF export card        | CSV export card      | Recent jobs                       |
| choose scenario        | choose files         | status | file | created           |
| choose sections        | [Generate]           |                                     |
| [Generate PDF]         |                      |                                     |
+----------------------------------------------------------------------------------+
```

### 6.18 Billing

Route: `/app/settings/billing`

```text
+----------------------------------------------------------------------------------+
| Billing                                                                           |
+----------------------------------------------------------------------------------+
| Current plan | renewal date | AI actions used / limit | upgrade CTA              |
+----------------------------------------------------------------------------------+
| Plan comparison: Builder vs Pro                                                  |
+----------------------------------------------------------------------------------+
| Stripe portal | invoices | payment method                                         |
+----------------------------------------------------------------------------------+
```

## 7. Exact Fields and Input Rules

### 7.1 Global model metadata

| Field | Type | Rules | Default |
| --- | --- | --- | --- |
| `model_name` | text | required, 2-80 chars | none |
| `business_name` | text | required, 2-120 chars | none |
| `preparer_name` | text | optional, 0-120 chars | account name |
| `start_month` | integer | required, `1-12` | current month |
| `start_year` | integer | required, `2000-2100` | current year |
| `currency_code` | enum | launch enum = `USD` only | `USD` |
| `country_region` | enum | launch enum = `US` only | `US` |
| `business_stage` | enum | `new`, `ongoing` | `new` |
| `business_profile` | enum | `service`, `product`, `contractor_home_service`, `agency_consulting`, `retail_storefront`, `other` | `service` |
| `notes` | text | optional, 0-5000 chars | blank |

### 7.2 Opening assets

Allowed categories:

- `land`
- `buildings`
- `leasehold_improvements`
- `equipment`
- `furniture_fixtures`
- `vehicles`
- `other`

| Field | Type | Rules |
| --- | --- | --- |
| `category` | enum | required, one row per category in default UI |
| `amount` | decimal(14,2) | required, `>= 0`, max `999999999999.99` |
| `depreciation_years` | decimal(5,2) | required except `land`; `> 0` and `<= 40` |
| `notes` | text | optional, 0-500 chars |

Rules:

- `land` must have `depreciation_years = null`
- all other asset categories require depreciation years
- total fixed assets is calculated, never user-entered

### 7.3 Startup cost / operating capital rows

Default categories:

- `pre_opening_wages`
- `prepaid_insurance`
- `inventory`
- `legal_accounting_fees`
- `rent_deposits`
- `utility_deposits`
- `supplies`
- `advertising_promotions`
- `licenses`
- `other_initial_startup_costs`
- `working_capital_cash_on_hand`

| Field | Type | Rules |
| --- | --- | --- |
| `category` | enum | required |
| `amount` | decimal(14,2) | required, `>= 0` |
| `notes` | text | optional, 0-500 chars |

### 7.4 Funding sources

Allowed categories:

- `owner_equity`
- `outside_investors`
- `commercial_loan`
- `commercial_mortgage`
- `credit_card_debt`
- `vehicle_loans`
- `other_bank_debt`

| Field | Type | Rules |
| --- | --- | --- |
| `category` | enum | required |
| `amount` | decimal(14,2) | required, `>= 0` |
| `interest_rate` | decimal(7,6) | nullable for equity/investors, else `0-1` |
| `term_months` | integer | nullable for equity/investors, else `1-480` |
| `monthly_payment_override` | decimal(14,2) | optional, `>= 0`; if blank engine computes amortized payment |
| `notes` | text | optional, 0-500 chars |

Rules:

- debt rows with `amount > 0` require `interest_rate` and `term_months`
- equity rows must not carry debt terms
- total sources of funding is calculated
- funding gap/surplus is calculated as total sources minus total required funds

### 7.5 Opening balances for ongoing businesses

| Field | Type | Rules |
| --- | --- | --- |
| `cash` | decimal(14,2) | required if stage = `ongoing`, else `0` |
| `accounts_receivable` | decimal(14,2) | `>= 0` |
| `prepaid_expenses` | decimal(14,2) | `>= 0` |
| `accounts_payable` | decimal(14,2) | `>= 0` |
| `accrued_expenses` | decimal(14,2) | `>= 0` |

Rules:

- total cash on hand is calculated as `cash + A/R + prepaid - A/P - accrued`
- ongoing business requires either manual actuals entry intent or CSV import intent

### 7.6 Revenue lines

Caps:

- max 12 active revenue lines per scenario in v1

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `name` | text | required, 1-60 chars | line label |
| `unit_label` | text | required, 1-30 chars | `units`, `jobs`, `customers`, etc. |
| `month1_units` | decimal(12,4) | required, `>= 0` | initial demand |
| `price_per_unit` | decimal(14,4) | required, `>= 0` | sales price |
| `cogs_per_unit` | decimal(14,4) | required, `>= 0` | unit delivery cost |
| `q1_monthly_growth` | decimal(7,6) | required, `-1` to `5` | -100% to +500% |
| `q2_monthly_growth` | decimal(7,6) | required, `-1` to `5` | same |
| `q3_monthly_growth` | decimal(7,6) | required, `-1` to `5` | same |
| `q4_monthly_growth` | decimal(7,6) | required, `-1` to `5` | same |
| `year2_monthly_growth` | decimal(7,6) | required, `-1` to `5` | same |
| `year3_monthly_growth` | decimal(7,6) | required, `-1` to `5` | same |
| `start_month_index` | integer | optional, `1-36` | defaults to `1` |
| `end_month_index` | integer | optional, `1-36`, `>= start_month_index` | blank = active through month 36 |
| `is_active` | boolean | required | soft delete support |

Derived fields:

- `margin_per_unit = price_per_unit - cogs_per_unit`
- monthly units, sales, COGS, and margin are calculated

Rules:

- negative margin is allowed but creates a diagnostic
- line is inactive outside `start_month_index` to `end_month_index`
- direct monthly overrides are allowed only through the override flow

### 7.7 Revenue overrides

| Field | Type | Rules |
| --- | --- | --- |
| `revenue_line_id` | fk | required |
| `month_index` | integer | required, `1-36` |
| `metric` | enum | `units`, `sales`, `cogs`, `margin` |
| `override_value` | decimal(14,4) | required |
| `reason` | text | required, 1-500 chars |
| `source` | enum | `manual`, `ai_approved` |

Rules:

- only one active override per line + month + metric
- `sales` override takes precedence over generated `units * price`
- override badges must be visible on affected rows/cells

### 7.8 Payroll roles

Caps:

- max 12 active payroll roles per scenario in v1

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `role_name` | text | required, 1-60 chars | `Founder`, `Sales Rep`, etc. |
| `role_type` | enum | `owner`, `employee`, `contractor` | required |
| `headcount` | decimal(10,2) | required, `>= 0` | fractional headcount allowed for planning |
| `compensation_mode` | enum | `hourly`, `monthly` | required |
| `hourly_rate` | decimal(12,4) | required when hourly, else null | `>= 0` |
| `monthly_pay` | decimal(14,2) | required when monthly, else null | `>= 0` |
| `hours_per_week` | decimal(8,2) | required when hourly, `0-168` | null when monthly |
| `start_month_index` | integer | required, `1-36` | default `1` |
| `end_month_index` | integer | optional, `1-36`, `>= start_month_index` | blank = through month 36 |
| `year2_growth` | decimal(7,6) | required, `-1` to `5` | |
| `year3_growth` | decimal(7,6) | required, `-1` to `5` | |
| `is_active` | boolean | required | |

Rules:

- contractor roles do not incur payroll tax/benefit burden by default
- owner and employee roles do incur payroll tax/benefit burden
- hourly monthly pay formula: `headcount * hourly_rate * hours_per_week * 52 / 12`
- monthly mode formula: `headcount * monthly_pay`

### 7.9 Payroll assumptions

| Field | Type | Rules |
| --- | --- | --- |
| `social_security_rate` | decimal(7,6) | `0-1` |
| `medicare_rate` | decimal(7,6) | `0-1` |
| `futa_rate` | decimal(7,6) | `0-1` |
| `futa_wage_base` | decimal(14,2) | `>= 0` |
| `suta_rate` | decimal(7,6) | `0-1` |
| `suta_wage_base` | decimal(14,2) | `>= 0` |
| `pension_rate` | decimal(7,6) | `0-1` |
| `workers_comp_rate` | decimal(7,6) | `0-1` |
| `health_insurance_rate` | decimal(7,6) | `0-1` |
| `other_benefits_rate` | decimal(7,6) | `0-1` |

Rules:

- defaults should be US-shaped but editable
- tax and benefit rates apply to eligible payroll roles only
- annual wage-base capped taxes must respect year-to-date wage accumulation

### 7.10 Payroll overrides

Same structure as revenue overrides:

- `payroll_role_id`
- `month_index`
- `metric` enum: `gross_pay`, `tax_benefit_total`
- `override_value`
- `reason`
- `source`

### 7.11 Operating expense lines

Default categories:

- `advertising`
- `car_truck`
- `commissions_fees`
- `contract_labor`
- `insurance_other_than_health`
- `legal_professional`
- `licenses`
- `office_expense`
- `rent_lease_equipment`
- `rent_lease_other_property`
- `repairs_maintenance`
- `supplies`
- `travel_meals_entertainment`
- `utilities`
- `miscellaneous`

Custom category cap:

- max 8 active custom categories

| Field | Type | Rules |
| --- | --- | --- |
| `category_key` | enum/text | required |
| `label` | text | required, 1-60 chars |
| `is_custom` | boolean | required |
| `year2_growth_rate` | decimal(7,6) | required, `-1` to `5` |
| `year3_growth_rate` | decimal(7,6) | required, `-1` to `5` |
| `is_active` | boolean | required |

Monthly inputs:

- one row per `month_index 1-12`
- `amount decimal(14,2)`, required, `>= 0`

Rules:

- Year 1 is entered monthly
- Years 2-3 are derived from annual growth assumptions
- depreciation, interest, LOC interest, and bad debt expense are read-only outputs

### 7.12 Working capital and financing settings

| Field | Type | Rules | Notes |
| --- | --- | --- | --- |
| `ar_within_30` | decimal(7,6) | required, `0-1` | |
| `ar_30_to_60` | decimal(7,6) | required, `0-1` | |
| `ar_over_60` | decimal(7,6) | required, `0-1` | |
| `bad_debt_allowance` | decimal(7,6) | required, `0-1` | percent of sales |
| `ap_within_30` | decimal(7,6) | required, `0-1` | |
| `ap_30_to_60` | decimal(7,6) | required, `0-1` | |
| `ap_over_60` | decimal(7,6) | required, `0-1` | |
| `desired_min_cash` | decimal(14,2) | required, `>= 0` | |
| `loc_interest_rate` | decimal(7,6) | required, `0-1` | |
| `financing_behavior` | enum | `auto_loc`, `shortfall_only`, `manual_financing` | required |

Rules:

- A/R percentages must sum to exactly `1.0000` within a tolerance of `0.0001`
- A/P percentages must sum to exactly `1.0000` within a tolerance of `0.0001`
- if `financing_behavior = auto_loc`, engine may draw LOC to protect minimum cash
- if `financing_behavior = shortfall_only`, engine shows negative cash warning and no automatic financing
- if `financing_behavior = manual_financing`, user must add explicit debt/equity assumptions or manual cash items

### 7.13 CapEx plan rows

Allowed categories:

- `real_estate`
- `leasehold_improvements`
- `equipment`
- `furniture_fixtures`
- `vehicles`
- `other`

| Field | Type | Rules |
| --- | --- | --- |
| `category` | enum | required |
| `depreciation_years` | decimal(5,2) | required, `> 0`, `<= 40`; real estate may use `20` default |
| `year1_month_1` ... `year1_month_12` | decimal(14,2) | each `>= 0` |
| `year2_annual_amount` | decimal(14,2) | `>= 0` |
| `year3_annual_amount` | decimal(14,2) | `>= 0` |

### 7.14 Tax and amortization settings

| Field | Type | Rules |
| --- | --- | --- |
| `year1_tax_rate` | decimal(7,6) | required, `0-1` |
| `year2_tax_rate` | decimal(7,6) | required, `0-1` |
| `year3_tax_rate` | decimal(7,6) | required, `0-1` |
| `amortization_years` | decimal(5,2) | required, `> 0`, `<= 20` |

### 7.15 Manual cash items

Stored by `month_index 1-36`.

| Field | Type | Rules |
| --- | --- | --- |
| `taxes_paid` | decimal(14,2) | `>= 0` |
| `owner_draws` | decimal(14,2) | `>= 0` |
| `dividends` | decimal(14,2) | `>= 0` |
| `additional_inventory` | decimal(14,2) | `>= 0` |
| `manual_loc_repayment` | decimal(14,2) | `>= 0` |

### 7.16 Ratio norms

| Field | Type | Rules |
| --- | --- | --- |
| `ratio_key` | enum | required |
| `year1_norm` | decimal(12,6) | nullable |
| `year2_norm` | decimal(12,6) | nullable |
| `year3_norm` | decimal(12,6) | nullable |
| `notes` | text | optional, 0-250 chars |

### 7.17 Validation behavior

Validation states:

- inline error: blocking save
- inline warning: save allowed, diagnostic generated
- derived warning: no field error, but model issue flagged in diagnostics

Blocking validations:

- required text missing
- invalid enum
- invalid date period input
- negative amount where forbidden
- A/R or A/P percentages not totaling 100%
- debt row missing rate/term when amount exists
- end month before start month
- monthly override missing reason

Warning-only validations:

- negative unit margin
- zero owner compensation
- gross margin below threshold
- very high debt load
- shortfall with no financing behavior selected

## 8. Convex Data Model

### 8.1 Convex modeling rules

- Define tables in `convex/schema.ts`
- Convex automatically adds `_id` and `_creationTime` to every document
- Optional fields must use `v.optional(...)`; `undefined` should not be treated as stored data
- Indexes should be declared up front for every common ownership and lookup path
- Large derived payloads should be split across multiple tables/documents to stay well below Convex document size limits
- Field-level rules still come from Section 7; this section defines the storage model and indexes

Primary hierarchy:

`users -> businesses -> scenarios -> assumption tables -> derived snapshot tables`

### 8.2 Core tables

#### `users`

Purpose: local mirror of authenticated users for ownership and billing.

Fields:

- `authSubject: v.string()`
- `email: v.string()`
- `fullName: v.string()`
- `defaultPlanKey: v.union(v.literal("builder"), v.literal("pro"))`
- `lastSeenAt: v.number()`

Indexes:

- `by_auth_subject`
- `by_email`

Notes:

- `authSubject` should map to the authenticated Clerk/OIDC subject used in Convex auth checks

#### `subscriptions`

Purpose: Stripe-backed billing state and user-visible AI allowance.

Fields:

- `userId: v.id("users")`
- `planKey: v.union(v.literal("builder"), v.literal("pro"))`
- `status: v.union(v.literal("trialing"), v.literal("active"), v.literal("past_due"), v.literal("canceled"), v.literal("incomplete"))`
- `stripeCustomerId: v.optional(v.string())`
- `stripeSubscriptionId: v.optional(v.string())`
- `currentPeriodStart: v.number()`
- `currentPeriodEnd: v.number()`
- `aiActionLimit: v.number()`
- `aiActionsUsed: v.number()`
- `lastResetAt: v.number()`

Indexes:

- `by_user`
- `by_stripe_customer_id`
- `by_stripe_subscription_id`

#### `businesses`

Purpose: top-level business container.

Fields:

- `userId: v.id("users")`
- `name: v.string()`
- `companyName: v.string()`
- `preparerName: v.optional(v.string())`
- `businessProfile: v.string()`
- `businessStage: v.string()`
- `startMonth: v.number()`
- `startYear: v.number()`
- `currencyCode: v.literal("USD")`
- `countryRegion: v.literal("US")`
- `notes: v.optional(v.string())`
- `archivedAt: v.optional(v.number())`

Indexes:

- `by_user`
- `by_user_archived`

#### `scenarios`

Purpose: scenario shell and current version pointer.

Fields:

- `businessId: v.id("businesses")`
- `name: v.string()`
- `notes: v.optional(v.string())`
- `isBase: v.boolean()`
- `status: v.union(v.literal("draft"), v.literal("ready"), v.literal("archived"))`
- `currentVersion: v.number()`

Indexes:

- `by_business`
- `by_business_base`

#### `scenario_versions`

Purpose: immutable audit/version stream.

Fields:

- `scenarioId: v.id("scenarios")`
- `versionNumber: v.number()`
- `changeSource: v.union(v.literal("manual"), v.literal("wizard"), v.literal("ai_approved"), v.literal("csv_import"), v.literal("system"))`
- `aiSuggestionId: v.optional(v.id("ai_suggestions"))`
- `summary: v.optional(v.string())`
- `createdByUserId: v.optional(v.id("users"))`

Indexes:

- `by_scenario`
- `by_scenario_version`

### 8.3 Assumption tables

Each table below is keyed by scenario ownership and designed for Convex queries filtered by `scenarioId`.

#### `opening_assets`

Fields:

- `scenarioId: v.id("scenarios")`
- `category: v.string()`
- `amount: v.number()`
- `depreciationYears: v.optional(v.number())`
- `notes: v.optional(v.string())`

Indexes:

- `by_scenario`
- `by_scenario_category`

#### `startup_costs`

Fields:

- `scenarioId: v.id("scenarios")`
- `category: v.string()`
- `amount: v.number()`
- `notes: v.optional(v.string())`

Indexes:

- `by_scenario`

#### `funding_sources`

Fields:

- `scenarioId: v.id("scenarios")`
- `category: v.string()`
- `amount: v.number()`
- `interestRate: v.optional(v.number())`
- `termMonths: v.optional(v.number())`
- `monthlyPaymentOverride: v.optional(v.number())`
- `notes: v.optional(v.string())`

Indexes:

- `by_scenario`
- `by_scenario_category`

#### `opening_balances`

Fields:

- `scenarioId: v.id("scenarios")`
- `cash: v.number()`
- `accountsReceivable: v.number()`
- `prepaidExpenses: v.number()`
- `accountsPayable: v.number()`
- `accruedExpenses: v.number()`

Indexes:

- `by_scenario`

#### `revenue_lines`

Fields:

- `scenarioId: v.id("scenarios")`
- `sortOrder: v.number()`
- `name: v.string()`
- `unitLabel: v.string()`
- `month1Units: v.number()`
- `pricePerUnit: v.number()`
- `cogsPerUnit: v.number()`
- `q1MonthlyGrowth: v.number()`
- `q2MonthlyGrowth: v.number()`
- `q3MonthlyGrowth: v.number()`
- `q4MonthlyGrowth: v.number()`
- `year2MonthlyGrowth: v.number()`
- `year3MonthlyGrowth: v.number()`
- `startMonthIndex: v.number()`
- `endMonthIndex: v.optional(v.number())`
- `isActive: v.boolean()`

Indexes:

- `by_scenario`
- `by_scenario_sort_order`

#### `revenue_overrides`

Fields:

- `scenarioId: v.id("scenarios")`
- `revenueLineId: v.id("revenue_lines")`
- `monthIndex: v.number()`
- `metric: v.string()`
- `overrideValue: v.number()`
- `reason: v.string()`
- `source: v.string()`
- `isActive: v.boolean()`

Indexes:

- `by_scenario`
- `by_line_month_metric`

#### `payroll_roles`

Fields:

- `scenarioId: v.id("scenarios")`
- `sortOrder: v.number()`
- `roleName: v.string()`
- `roleType: v.string()`
- `compensationMode: v.string()`
- `headcount: v.number()`
- `hourlyRate: v.optional(v.number())`
- `monthlyPay: v.optional(v.number())`
- `hoursPerWeek: v.optional(v.number())`
- `startMonthIndex: v.number()`
- `endMonthIndex: v.optional(v.number())`
- `year2Growth: v.number()`
- `year3Growth: v.number()`
- `isActive: v.boolean()`

Indexes:

- `by_scenario`
- `by_scenario_sort_order`

#### `payroll_assumptions`

Fields:

- `scenarioId: v.id("scenarios")`
- `socialSecurityRate: v.number()`
- `medicareRate: v.number()`
- `futaRate: v.number()`
- `futaWageBase: v.number()`
- `sutaRate: v.number()`
- `sutaWageBase: v.number()`
- `pensionRate: v.number()`
- `workersCompRate: v.number()`
- `healthInsuranceRate: v.number()`
- `otherBenefitsRate: v.number()`

Indexes:

- `by_scenario`

#### `payroll_overrides`

Fields:

- `scenarioId: v.id("scenarios")`
- `payrollRoleId: v.id("payroll_roles")`
- `monthIndex: v.number()`
- `metric: v.string()`
- `overrideValue: v.number()`
- `reason: v.string()`
- `source: v.string()`
- `isActive: v.boolean()`

Indexes:

- `by_scenario`
- `by_role_month_metric`

#### `operating_expense_lines`

Fields:

- `scenarioId: v.id("scenarios")`
- `sortOrder: v.number()`
- `categoryKey: v.string()`
- `label: v.string()`
- `isCustom: v.boolean()`
- `year2GrowthRate: v.number()`
- `year3GrowthRate: v.number()`
- `isActive: v.boolean()`

Indexes:

- `by_scenario`
- `by_scenario_sort_order`

#### `operating_expense_months`

Fields:

- `expenseLineId: v.id("operating_expense_lines")`
- `monthIndex: v.number()`
- `amount: v.number()`

Indexes:

- `by_expense_line`
- `by_expense_line_month`

#### `working_capital_settings`

Fields:

- `scenarioId: v.id("scenarios")`
- `arWithin30: v.number()`
- `ar30To60: v.number()`
- `arOver60: v.number()`
- `badDebtAllowance: v.number()`
- `apWithin30: v.number()`
- `ap30To60: v.number()`
- `apOver60: v.number()`
- `desiredMinCash: v.number()`
- `locInterestRate: v.number()`
- `financingBehavior: v.string()`

Indexes:

- `by_scenario`

#### `capex_lines`

Fields:

- `scenarioId: v.id("scenarios")`
- `category: v.string()`
- `depreciationYears: v.number()`
- `year2AnnualAmount: v.number()`
- `year3AnnualAmount: v.number()`

Indexes:

- `by_scenario`
- `by_scenario_category`

#### `capex_months`

Fields:

- `capexLineId: v.id("capex_lines")`
- `monthIndex: v.number()`
- `amount: v.number()`

Indexes:

- `by_capex_line`
- `by_capex_line_month`

#### `tax_settings`

Fields:

- `scenarioId: v.id("scenarios")`
- `year1TaxRate: v.number()`
- `year2TaxRate: v.number()`
- `year3TaxRate: v.number()`
- `amortizationYears: v.number()`

Indexes:

- `by_scenario`

#### `cash_adjustment_months`

Fields:

- `scenarioId: v.id("scenarios")`
- `monthIndex: v.number()`
- `taxesPaid: v.number()`
- `ownerDraws: v.number()`
- `dividends: v.number()`
- `additionalInventory: v.number()`
- `manualLocRepayment: v.number()`

Indexes:

- `by_scenario`
- `by_scenario_month`

#### `ratio_norms`

Fields:

- `scenarioId: v.id("scenarios")`
- `ratioKey: v.string()`
- `year1Norm: v.optional(v.number())`
- `year2Norm: v.optional(v.number())`
- `year3Norm: v.optional(v.number())`
- `notes: v.optional(v.string())`

Indexes:

- `by_scenario`
- `by_scenario_ratio`

### 8.4 Import, AI, and derived output tables

#### `historical_actual_imports`

Fields:

- `scenarioId: v.id("scenarios")`
- `sourceType: v.union(v.literal("csv"), v.literal("manual"))`
- `uploadName: v.string()`
- `mappingJson: v.any()`
- `importStatus: v.union(v.literal("uploaded"), v.literal("mapped"), v.literal("validated"), v.literal("applied"), v.literal("failed"))`
- `periodCount: v.number()`

Indexes:

- `by_scenario`
- `by_scenario_status`

#### `historical_actual_rows`

Fields:

- `importId: v.id("historical_actual_imports")`
- `periodStart: v.string()`
- `metricKey: v.string()`
- `categoryKey: v.optional(v.string())`
- `amount: v.number()`

Indexes:

- `by_import`
- `by_import_period`

#### `ai_conversations`

Fields:

- `scenarioId: v.id("scenarios")`
- `screenContext: v.string()`
- `conversationType: v.string()`

Indexes:

- `by_scenario`

#### `ai_messages`

Fields:

- `conversationId: v.id("ai_conversations")`
- `role: v.string()`
- `content: v.string()`
- `modelName: v.optional(v.string())`
- `usageJson: v.optional(v.any())`

Indexes:

- `by_conversation`

#### `ai_suggestions`

Fields:

- `conversationId: v.id("ai_conversations")`
- `scenarioId: v.id("scenarios")`
- `suggestionType: v.string()`
- `proposedChangesJson: v.any()`
- `impactSummaryJson: v.any()`
- `status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("expired"))`
- `approvedAt: v.optional(v.number())`
- `rejectedAt: v.optional(v.number())`

Indexes:

- `by_scenario`
- `by_conversation`
- `by_scenario_status`

#### `ai_usage_events`

Fields:

- `userId: v.id("users")`
- `scenarioId: v.optional(v.id("scenarios"))`
- `conversationId: v.optional(v.id("ai_conversations"))`
- `actionType: v.string()`
- `actionsConsumed: v.number()`
- `providerCostUsd: v.number()`

Indexes:

- `by_user`
- `by_user_period`

#### `scenario_snapshot_meta`

Purpose: one lightweight doc per scenario version.

Fields:

- `scenarioId: v.id("scenarios")`
- `versionNumber: v.number()`
- `parityHash: v.optional(v.string())`
- `generatedAt: v.number()`

Indexes:

- `by_scenario`
- `by_scenario_version`

#### `scenario_snapshot_summary`

Purpose: KPI cards and overview payload.

Fields:

- `scenarioId: v.id("scenarios")`
- `versionNumber: v.number()`
- `summaryJson: v.any()`

Indexes:

- `by_scenario_version`

#### `scenario_snapshot_monthly`

Purpose: monthly tables and charts split by section to avoid oversized documents.

Fields:

- `scenarioId: v.id("scenarios")`
- `versionNumber: v.number()`
- `sectionKey: v.string()`
- `payloadJson: v.any()`

Indexes:

- `by_scenario_version`
- `by_scenario_version_section`

#### `scenario_snapshot_annual`

Purpose: annual statements and summary tables.

Fields:

- `scenarioId: v.id("scenarios")`
- `versionNumber: v.number()`
- `sectionKey: v.string()`
- `payloadJson: v.any()`

Indexes:

- `by_scenario_version`
- `by_scenario_version_section`

#### `scenario_snapshot_diagnostics`

Purpose: diagnostic card payloads.

Fields:

- `scenarioId: v.id("scenarios")`
- `versionNumber: v.number()`
- `cardsJson: v.any()`

Indexes:

- `by_scenario_version`

#### `scenario_snapshot_ratios`

Purpose: ratio table payloads and norms.

Fields:

- `scenarioId: v.id("scenarios")`
- `versionNumber: v.number()`
- `ratiosJson: v.any()`

Indexes:

- `by_scenario_version`

#### `export_jobs`

Fields:

- `scenarioId: v.id("scenarios")`
- `exportType: v.union(v.literal("pdf"), v.literal("csv"))`
- `status: v.union(v.literal("queued"), v.literal("running"), v.literal("completed"), v.literal("failed"))`
- `optionsJson: v.any()`
- `storageId: v.optional(v.string())`
- `fileUrl: v.optional(v.string())`
- `completedAt: v.optional(v.number())`

Indexes:

- `by_scenario`
- `by_scenario_status`

## 9. Calculation Engine Modules

### 9.1 Design principles

- deterministic and side-effect free
- all calculations derived from typed normalized inputs
- calculation order is explicit and testable
- no AI inside the math path
- every output traceable back to assumptions
- workbook parity tests run against controlled fixtures

### 9.2 Package structure

```text
/src/engine
  /schemas
    input-schema.ts
    output-schema.ts
  /core
    period-axis.ts
    normalize-inputs.ts
  /modules
    opening-position.ts
    debt-schedules.ts
    depreciation.ts
    amortization.ts
    revenue.ts
    payroll.ts
    operating-expenses.ts
    working-capital.ts
    cash-flow.ts
    income-statement.ts
    balance-sheet.ts
    break-even.ts
    ratios.ts
    diagnostics.ts
    scenario-comparison.ts
  /orchestrator
    calculate-scenario.ts
  /parity
    workbook-fixtures/
    parity-tests.ts
```

### 9.3 Module boundaries

| Module | Inputs | Outputs |
| --- | --- | --- |
| `period-axis` | start month/year | 36-month period list, quarter map, year buckets |
| `normalize-inputs` | DB records | typed scenario input object with defaults |
| `opening-position` | assets, startup costs, funding, opening balances | opening balance state, funding totals |
| `debt-schedules` | debt funding rows, manual repayment assumptions | monthly interest, principal, ending balances |
| `depreciation` | opening assets, capex rows | monthly depreciation by asset class |
| `amortization` | startup costs, amortization years | monthly startup amortization |
| `revenue` | revenue lines, overrides, periods | monthly units, sales, COGS, margin by line and total |
| `payroll` | roles, payroll assumptions, overrides, periods | monthly wages and benefits by role and total |
| `operating-expenses` | expense lines, Year 1 monthly inputs, growth rates | monthly OpEx by category and total |
| `working-capital` | A/R, A/P, bad debt settings, revenue, COGS, expenses | cash collection and disbursement schedules |
| `cash-flow` | opening state, working capital, payroll, expenses, debt, tax, cash adjustments | monthly cash flow, LOC draw, ending cash |
| `income-statement` | revenue, payroll, expenses, depreciation, amortization, interest, tax | monthly and annual P&L |
| `balance-sheet` | opening balances, cash flow, debt, fixed assets, retained earnings | annual balance sheet and balance check |
| `break-even` | annual revenue, margin, payroll, fixed expenses | annual and monthly break-even outputs |
| `ratios` | statements, balance sheet, user norms | annual financial ratios |
| `diagnostics` | outputs + assumptions | ordered diagnostic cards with severity and suggestions |
| `scenario-comparison` | multiple scenario snapshots | comparison tables and charts |

### 9.4 Calculation order

1. Normalize inputs and fill defaults
2. Build 36-month period axis
3. Compute opening position and funding
4. Build debt schedules
5. Build depreciation schedules
6. Build startup amortization schedule
7. Calculate Year 1 revenue monthly
8. Roll revenue into Years 2-3 monthly detail and annual totals
9. Calculate Year 1 payroll monthly
10. Roll payroll into Years 2-3 totals
11. Calculate Year 1 operating expenses
12. Roll operating expenses into Years 2-3 totals
13. Apply A/R and A/P timing
14. Calculate bad debt expense
15. Calculate cash flow and LOC behavior
16. Calculate income statement
17. Calculate balance sheet
18. Calculate break-even
19. Calculate ratios
20. Calculate diagnostics
21. Build scenario comparison payloads

### 9.5 Key formulas

Revenue:

- `sales = units * price_per_unit`
- `cogs = units * cogs_per_unit`
- `margin = sales - cogs`
- quarterly Year 1 growth compounds monthly within each quarter
- Year 2 month 1 starts from Year 1 month 12 output
- Year 3 month 1 starts from Year 2 month 12 output

Payroll:

- hourly role monthly pay = `headcount * hourly_rate * hours_per_week * 52 / 12`
- monthly role monthly pay = `headcount * monthly_pay`
- eligible taxes/benefits apply only to owner and employee roles
- wage-base taxes cap against cumulative taxable wages per year

Working capital:

- collections are distributed according to A/R percentages and month lags
- disbursements are distributed according to A/P percentages and month lags
- bad debt expense = sales * bad debt allowance

Debt:

- use standard amortization schedule unless monthly payment override is present
- payment split into interest and principal monthly

LOC:

- if auto-draw mode, draw only enough to preserve desired minimum cash
- LOC interest accrues monthly on average or ending balance, to be locked in parity tests

Taxes:

- tax expense applies only to positive pretax income
- tax rates are per-year settings

Break-even:

- `gross_margin_pct = gross_margin / revenue`
- `annual_break_even_sales = fixed_expenses / gross_margin_pct`
- `monthly_break_even_sales = annual_break_even_sales / 12`

### 9.6 Calculation persistence

On any approved input change:

1. write assumption change
2. increment scenario version
3. recompute full snapshot
4. persist snapshot
5. update scenario `updated_at`

No partial spreadsheet-style recalculation in v1. Full scenario recompute is simpler and safer.

### 9.7 Parity testing

Required fixture set:

- startup business with no debt
- startup business with multiple debt sources
- ongoing business with opening balances
- low-margin business with warnings
- cash shortfall case with auto LOC
- shortfall case with no financing

Required parity outputs:

- revenue
- COGS
- gross margin
- payroll
- total OpEx
- ending cash
- LOC draw
- net income
- balance sheet balance
- break-even sales
- ratios

Tolerance:

- currency outputs within `+/- $1`
- percentages/ratios within `+/- 0.001`

## 10. AI Behavior and Approval Flows

### 10.1 AI modes

1. Wizard AI
2. Contextual workspace assistant
3. CSV import mapping helper
4. Diagnostic explainer

### 10.2 Hard safety rules

- AI cannot write directly to tables
- AI cannot alter formulas or module logic
- AI cannot fabricate historical actuals
- AI must separate model-specific reasoning from general guidance
- all estimates must be labeled as assumptions
- all changes must be proposed as explicit diffs
- user must approve or edit before apply

### 10.3 Standard response shape

Every substantial AI response should use this structure:

1. What this means
2. Why it matters
3. 3 practical ways to handle it
4. Pros and cons of each
5. My recommendation
6. What would change in your model if we apply it

Every response should also include:

- `Based on your model`
- `General guidance`

### 10.4 Allowed AI actions

| Action | Result |
| --- | --- |
| explain concept | plain-language explanation with model context |
| estimate unknown input | assumption options, pros/cons, recommendation |
| propose assumption change | suggestion record with structured diff |
| propose override | suggestion record with override diff |
| compare alternatives | textual comparison plus scenario delta preview |
| map CSV columns | draft mapping JSON requiring user approval |
| explain diagnostic | reason, impact, next action |

### 10.5 Suggestion payload contract

Each AI suggestion should be persisted as structured JSON:

```json
{
  "summary": "Delay founder salary start to Month 3",
  "changes": [
    {
      "entity": "payroll_role",
      "entityId": "uuid",
      "field": "start_month_index",
      "from": 1,
      "to": 3
    }
  ],
  "impact": {
    "revenue": 0,
    "grossMargin": 0,
    "endingCash": 12000,
    "netIncome": 12000,
    "breakEvenSales": -18000
  }
}
```

### 10.6 Approval flow

State machine:

1. `pending`
2. `approved`
3. `rejected`
4. `expired`

UI flow:

1. user asks for help
2. AI returns explanation or suggestion
3. if suggestion exists, show review card with:
   - current value
   - proposed value
   - reason
   - downstream impact
4. user chooses:
   - Approve
   - Edit before apply
   - Reject
5. approved change writes assumptions, increments version, recalculates, logs audit trail

### 10.7 Approval card wireframe

```text
+----------------------------------------------------------------------------------+
| AI Proposal                                                                      |
+----------------------------------------------------------------------------------+
| Suggested change: Delay founder payroll start from Month 1 to Month 3           |
| Why: protects minimum cash while keeping Year 1 revenue unchanged                |
| Current: start_month_index = 1                                                   |
| Proposed: start_month_index = 3                                                  |
| Impact: ending cash +12000 | net income +12000 | break-even unchanged           |
| [Approve] [Edit] [Reject]                                                        |
+----------------------------------------------------------------------------------+
```

### 10.8 Prompting rules

System prompt requirements:

- remind model this is a planning tool, not professional advice
- prohibit silent edits and unsupported claims
- require separation between model-derived and general guidance
- require assumption labels when estimates are used
- require concise answer formatting
- require structured diff output for any proposed change

Context passed to model:

- current route and screen
- relevant scenario assumptions only
- key outputs needed for answer
- diagnostics relevant to screen
- remaining AI usage

Do not pass:

- full database dump
- unrelated scenarios
- raw export files unless explicitly requested

## 11. CSV Import Format

### 11.1 Supported import cases in v1

- trailing actuals for ongoing businesses
- AI-assisted column mapping with user approval
- manual entry fallback if CSV fails validation

### 11.2 Canonical CSV shape

Primary supported shape: one row per month, wide format.

Required columns:

- `period`
- `revenue`
- `cogs`
- `payroll`

Optional columns:

- `taxes_paid`
- `debt_service`
- `capex`
- `owner_draws`
- `dividends`
- `inventory_change`
- one column for each default OpEx category
- optional custom category columns

Canonical header example:

```csv
period,revenue,cogs,payroll,advertising,car_truck,commissions_fees,contract_labor,insurance_other_than_health,legal_professional,licenses,office_expense,rent_lease_equipment,rent_lease_other_property,repairs_maintenance,supplies,travel_meals_entertainment,utilities,miscellaneous,taxes_paid,debt_service,capex,owner_draws,dividends,inventory_change
2025-01-01,25000,9000,7000,500,0,1200,0,200,300,0,150,0,1800,0,100,0,250,75,0,500,0,0,0,0
```

### 11.3 Column rules

| Column | Type | Rules |
| --- | --- | --- |
| `period` | date | required, first day of month preferred, monthly unique |
| numeric columns | decimal(14,2) | blank treated as `0`, non-numeric rejected |

Validation:

- periods must be monthly and non-duplicated
- max import window in v1: 24 trailing months
- import may include fewer than 24 months
- revenue, COGS, payroll cannot be negative
- expense and cash item columns cannot be negative unless explicitly allowed later

### 11.4 Mapping model

Import workflow:

1. upload CSV
2. detect headers
3. auto-suggest mapping
4. optional AI mapping help
5. user approves mapping
6. preview normalized rows
7. apply import

Normalized internal metrics:

- `revenue`
- `cogs`
- `payroll`
- `opex:<category_key>`
- `taxes_paid`
- `debt_service`
- `capex`
- `owner_draws`
- `dividends`
- `inventory_change`

### 11.5 Apply rules

Imported actuals are used to:

- seed trailing trend context
- support ongoing-business setup
- inform diagnostics and AI explanations

Imported actuals do not:

- replace the forecast engine
- edit formulas
- bypass user review

## 12. PDF and CSV Export Spec

### 12.1 PDF export

Format:

- generated server-side
- portrait cover, portrait summary pages, landscape statement tables if needed
- one PDF per scenario export job

Sections in order:

1. Cover page
2. Executive summary
3. Key metrics
4. Revenue summary
5. Cash summary
6. Income statement summary
7. Balance sheet summary
8. Break-even summary
9. Ratio summary
10. Diagnostics summary
11. Scenario comparison summary
12. Assumption appendix
13. Disclaimer page

Required metadata on cover/footer:

- business name
- scenario name
- exported timestamp
- currency
- 36-month planning horizon
- disclaimer: planning tool, not professional financial advice

Charts:

- Year 1 monthly revenue
- Year 1 monthly ending cash
- Year 1 monthly net income
- scenario comparison chart

### 12.2 CSV export

Recommended output: zip bundle containing multiple CSV files.

Required files:

- `assumptions_business.csv`
- `assumptions_opening_funding.csv`
- `revenue_lines.csv`
- `revenue_monthly.csv`
- `payroll_roles.csv`
- `payroll_monthly.csv`
- `operating_expenses.csv`
- `cash_flow_monthly.csv`
- `income_statement_monthly.csv`
- `income_statement_annual.csv`
- `balance_sheet_annual.csv`
- `break_even.csv`
- `ratios.csv`
- `diagnostics.csv`
- `scenario_comparison.csv`

CSV rules:

- UTF-8
- comma-delimited
- header row required
- ISO dates
- decimal dot separator
- values exported in display currency without currency symbols

## 13. Billing and AI Usage Enforcement

### 13.1 Plans

Launch plan configuration:

| Plan | Price | AI actions/month | Deterministic calculations |
| --- | --- | --- | --- |
| Builder | `$50/mo` | `300` starting allowance | unlimited |
| Pro | `$200/mo` | `2000` starting allowance | unlimited |

Notes:

- exact allowance values can be adjusted in config before launch
- pricing copy must not say unlimited AI
- deterministic modeling remains available even when AI quota is exhausted

### 13.2 What counts as one AI action

One completed assistant request/response cycle counts as one AI action when it results in:

- explanation
- estimate help
- diagnostic help
- change proposal
- scenario generation help
- CSV mapping help

No AI action charged for:

- local validation errors before model call
- canceled requests before model invocation
- failed provider responses that do not return usable output

Internal tracking should also store:

- prompt tokens
- completion tokens
- provider cost

This supports later tuning without changing the user-visible action model.

### 13.3 Enforcement behavior

Usage thresholds:

- 80%: show warning badge
- 95%: show upgrade banner and confirmation before each AI call
- 100%: block new AI requests until reset or upgrade

When quota is exhausted:

- wizard AI and contextual AI are disabled
- deterministic calculation engine, manual editing, scenario management, and exports continue to work
- UI should explain next reset date and upgrade option

### 13.4 Subscription state handling

| Subscription state | Behavior |
| --- | --- |
| `active` | full access |
| `trialing` | same as active if trial is used |
| `past_due` | grace period, warnings shown |
| `canceled` | app access ends at period end |
| `incomplete` | no scenario creation until billing fixed |

### 13.5 Stripe events to handle

- checkout completed
- subscription created
- subscription updated
- invoice paid
- invoice payment failed
- subscription canceled

Preferred implementation:

- Stripe webhook terminates in a Convex `httpAction`
- webhook writes normalized subscription state into `subscriptions`
- UI requests checkout and portal URLs through Convex actions

### 13.6 AI usage meter UI

Always show:

- plan name
- actions used
- actions remaining
- reset date

The usage meter appears in:

- billing screen
- app shell footer
- AI panel header

## 14. Phased Sprint Plan

Assumption: 2-week sprints, small senior team.

### Sprint 0 - Project foundation

Goals:

- repo setup
- auth
- billing skeleton
- Convex schema and generated types
- app shell
- design tokens and base table/grid components

Exit criteria:

- user can sign in
- subscription state can be mocked
- business/scenario CRUD works

### Sprint 1 - Engine foundation

Goals:

- normalized input schema
- period axis
- opening position
- funding
- debt schedules
- depreciation
- amortization

Exit criteria:

- scenario assumptions can be normalized and calculated through funding/debt layers

### Sprint 2 - Revenue and payroll engine

Goals:

- revenue module
- payroll module
- override data model
- Year 1 and Years 2-3 parity fixtures

Exit criteria:

- revenue and payroll outputs match workbook fixtures within tolerance

### Sprint 3 - Expense, working capital, and cash flow engine

Goals:

- operating expense module
- A/R and A/P timing
- bad debt logic
- LOC behavior
- cash flow outputs

Exit criteria:

- cash flow parity achieved for controlled fixtures

### Sprint 4 - Statements, ratios, diagnostics

Goals:

- income statement
- balance sheet
- break-even
- ratios
- diagnostics
- snapshot persistence

Exit criteria:

- full scenario snapshot generated and parity-tested end to end

### Sprint 5 - Assumption workspace

Goals:

- overview
- setup
- opening funding
- revenue screens
- payroll screens
- expense screens
- cash financing screen
- auto-recalculate pipeline

Exit criteria:

- user can fully build and edit a model without AI

### Sprint 6 - Wizard and AI approval flows

Goals:

- wizard step flow
- contextual AI panel
- structured suggestion payloads
- approval/reject/edit UX
- AI audit logging

Exit criteria:

- user can create a base case from the wizard
- AI suggestions are safe, reviewable, and logged

### Sprint 7 - Imports, exports, and billing enforcement

Goals:

- CSV upload and mapping
- manual actuals entry
- PDF export
- CSV export bundle
- AI usage meter
- quota enforcement and Stripe webhooks

Exit criteria:

- ongoing business flow works
- exports are usable
- AI limits enforce correctly by plan

### Sprint 8 - Hardening and beta readiness

Goals:

- accessibility pass
- performance pass
- parity regression suite
- legal/disclaimer copy pass
- analytics and support tooling
- beta bug fixes

Exit criteria:

- product meets MVP success criteria
- parity suite green
- launch checklist complete

## 15. Acceptance Criteria for This Plan

This implementation plan is complete when engineering can start building without needing a separate design brief for:

- route structure
- major screen layouts
- field contracts and validation
- database tables and relationships
- calculation engine boundaries
- AI approval behavior
- CSV import format
- PDF/CSV export outputs
- billing and AI limit enforcement
- sprint sequencing

## 16. Immediate Next Build Artifacts

The next repo artifacts should be:

1. `convex/schema.ts` with the tables and indexes above
2. initial Convex queries, mutations, actions, and `httpAction` stubs
3. engine input/output TypeScript schemas
4. route scaffold for the authenticated workspace
5. parity test fixture pack derived from the workbook
