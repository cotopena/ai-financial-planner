# **Locked MVP PRD — AI Financial Planner (v1)**

## **What this PRD is based on**

This PRD is based on direct review of the uploaded workbook and the markdown explanation of how it works.

The product architecture intentionally mirrors the real workbook structure:

* Directions

* 1-StartingPoint

* 2a-PayrollYear1

* 2b-PayrollYrs1-3

* 3a-SalesForecastYear1

* 3b-SalesForecastYrs1-3

* 4-AdditionalInputs

* 5a-OpExYear1

* 5b-OpExYrs1-3

* 6a-CashFlowYear1

* 6b-CashFlowYrs1-3

* 7a-IncomeStatementYear1

* 7b-IncomeStatementYrs1-3

* 8-BalanceSheet

* BreakevenAnalysis

* FinancialRatios

* DiagnosticTools

* COGS Calculator

* Amortization\&Depreciation

The main design principle is: **do not run Excel as the product.** Rebuild the model as a deterministic finance engine in TypeScript, and use the workbook as the parity reference.

---

## **Locked product direction**

These decisions are now treated as locked unless explicitly changed later:

1. Audience: **general small business owners first**

2. UX: **hybrid experience**

3. Onboarding: **AI-guided wizard**

4. Visibility: **all 36 months available**

5. Current year treatment: **Year 1 is separated from Years 2 and 3 summary views, like the workbook**

6. Template strategy: **one generic core template at launch**

7. Relevance layer: **business-type-aware language and examples**

8. Revenue lines: **dynamic with caps**

9. Overrides: **controlled overrides only**

10. AI change behavior: **AI proposes changes, explains them, user approves before apply**

11. Unknown inputs: **AI helps estimate with options, pros/cons, and recommendation**

12. Business stage support: **new businesses and ongoing businesses**

13. Ongoing business support: **opening balances plus trailing actuals via CSV/manual entry**

14. Spreadsheet import: **not in v1**

15. Cash shortfall behavior: **user chooses financing behavior**

16. Exports: **PDF \+ CSV**

17. Pricing: **paid from day one**

18. Plans: **2 plans — $50 and $200**

19. AI usage model: **included with plan limits, not unlimited**

20. AI location: **wizard \+ contextual assistant on major screens**

21. AI response discipline: **model-grounded first, general advice clearly labeled**

22. Defaults: **modernized defaults, always editable**

23. Account model: **one user, multiple businesses/models**

---

## **Product definition**

### **Product statement**

A web app that helps small business owners build and understand a real 3-year financial model without needing spreadsheet expertise.

### **Core promise**

**MBA-style financial planning for small business owners, with an AI guide and a real financial engine underneath.**

### **Primary jobs-to-be-done**

A user should be able to answer:

* Is this business viable?

* How much money do I need to start or stabilize it?

* What happens to cash month by month?

* When do I break even?

* Can I afford payroll, debt, and operating expenses?

* What happens if sales grow slower or faster than expected?

* If I don’t know a number, what is a reasonable way to estimate it?

---

## **MVP boundaries**

## **In scope**

### **Planning engine**

* Startup and opening position

* Funding sources

* Revenue forecasting

* Payroll forecasting

* Operating expense forecasting

* Working capital timing

* Debt schedules

* Depreciation and amortization

* Cash flow

* Income statement

* Balance sheet

* Break-even analysis

* Financial ratios

* Diagnostics

* Scenario comparison

### **AI experience**

* AI onboarding wizard

* Persistent contextual AI helper on major screens

* AI concept explanations

* AI estimate helper for unknown numbers

* AI proposal engine for suggested changes

* Change preview \+ approval flow

* Teaching-oriented explanations with options, pros/cons, and recommendation

### **Ongoing business support**

* Opening balances

* Trailing actuals import by CSV

* Manual actuals entry fallback

### **Exports**

* PDF summary report

* CSV export of assumptions and report tables

### **Billing**

* Paid plans only

* $50 plan

* $200 plan

## **Out of scope for v1**

* Spreadsheet upload/import from arbitrary files

* Running the Excel workbook directly in production

* QuickBooks/Xero live integrations

* Multi-user collaboration

* Client/advisor workspace permissions

* White-labeling

* API access for third parties

* Fully custom statement builder

* AI editing formulas or model structure

* Benchmark scraping from the web by default

---

## **Target user and launch positioning**

### **Primary user**

A general small business owner who wants clarity, not accounting software.

### **Best-fit launch users**

Even though the audience is broad, the first product version will work especially well for businesses that think in terms of:

* jobs sold

* units sold

* payroll

* overhead

* startup costs

* working capital

* debt

* cash timing

### **Positioning**

Not “Excel in a browser.”

Instead:

**An AI-guided business planning app that turns assumptions into a real 3-year financial model.**

---

## **Product principles**

1. **Deterministic math, AI-guided experience**

   * The core numbers come from rules, formulas, and structured calculations.

   * AI helps the user understand, estimate, compare, and decide.

2. **Driver-first editing**

   * Users mainly edit assumptions and drivers.

   * Monthly values are generated unless explicitly overridden.

3. **Year 1 detail, Years 2–3 structured extension**

   * Preserve the workbook’s separation between current-year detail and future-year roll-forward logic.

4. **No silent AI edits**

   * AI never changes assumptions or overrides without showing the user exactly what will change.

5. **The app must teach**

   * If the user does not know a concept or a number, the assistant should explain it simply, show alternatives, and recommend a path.

6. **The product must feel like software, not a workbook clone**

   * The engine can match the workbook.

   * The UI should be cleaner, more guided, and easier to review.

---

## **Information architecture**

## **Public pages**

### **1\. Landing page**

Purpose:

* Explain the value

* Show sample outcomes

* Convert visitors into signups

Key sections:

* Headline

* Short explainer

* Feature highlights

* “How it works” strip

* Sample dashboard/report preview

* Pricing section

* CTA buttons

### **2\. Pricing page**

Purpose:

* Explain $50 and $200 plans

* Clarify AI usage model

* Clarify that deterministic modeling remains core regardless of AI usage

### **3\. Sign in / Sign up**

Purpose:

* Account access

* Paid onboarding entry point

---

## **Authenticated app**

### **4\. Business dashboard**

Purpose:

* Home screen after login

* Show all businesses/models

User actions:

* Create business model

* Duplicate model

* Rename model

* Archive model

* Delete model

* Open scenarios

* Review last updated status

Recommended model card fields:

* Model name

* Business name

* Business profile/type

* Last updated

* Base case ending cash

* Base case Year 1 revenue

* Status badge (healthy / warning / needs review)

---

## **AI Wizard — exact flow**

The wizard is the first major product experience.

It should feel like an intelligent interview, not a static form.

## **Wizard behavior rules**

* The wizard asks one concept at a time.

* The wizard adapts wording based on business type.

* The user can answer normally or say “I don’t know.”

* If the user does not know, the AI must switch into estimate-help mode.

* The wizard must never invent hard facts without clearly labeling them as assumptions.

## **Wizard steps**

### **Step 1 — Business basics**

Fields:

* Model name

* Business name

* Preparer name

* Start month

* Start year

* Currency

* Country/region setting

* Business stage: new or ongoing

* Business profile/type

### **Step 2 — Business profile and language skin**

This does not change the core math.

It changes wording, examples, and helper text.

Examples:

* Service business

* Product business

* Contractor / home service

* Agency / consulting

* Retail / local storefront

* Other

### **Step 3 — Opening position / startup picture**

For new businesses:

* Starting cash needed

* Startup costs

* Fixed assets

* Funding sources

* Debt assumptions

For ongoing businesses:

* Current cash

* Accounts receivable

* Prepaid expenses

* Accounts payable

* Accrued expenses

* Existing debt

* Whether trailing actuals will be entered manually or imported by CSV

### **Step 4 — Revenue setup**

The AI should ask:

* What do you sell?

* How do you measure a sale?

* How many units/jobs/customers do you expect in Month 1?

* What is the average price per unit?

* What does one sale cost you to deliver?

* How do you expect demand to grow?

### **Step 5 — COGS help**

If the user does not know cost per unit, the AI should offer:

* simple manual estimate

* component-based estimate

* gross-margin target reverse-calculation

### **Step 6 — Payroll setup**

The AI should ask:

* Who gets paid?

* How many people do you need?

* Are they owners, employees, or contractors?

* Are they hourly or monthly?

* What taxes and benefits should be assumed?

### **Step 7 — Operating expenses setup**

The AI should ask for Year 1 monthly overhead:

* marketing

* rent

* insurance

* office

* software

* travel

* utilities

* professional fees

* etc.

### **Step 8 — Cash timing and financing**

The AI should ask:

* How quickly do customers pay you?

* How quickly do you pay vendors?

* Do you want the model to use a line of credit if cash falls too low?

* What minimum cash balance do you want to keep?

* What tax rates should be assumed?

* Any additional planned equipment or asset purchases?

### **Step 9 — Review and create base case**

The wizard shows:

* Assumption summary

* Funding gap check

* Major warnings

* Revenue summary

* Initial profitability/cash summary

Then creates the model and opens the workspace.

---

## **Workspace shell**

Primary navigation:

* Overview

* Setup

* Revenue

* Payroll

* Expenses

* Cash & Financing

* Statements

* Diagnostics

* Scenarios

* Exports

AI helper should be available as a contextual side panel on all major tabs.

---

## **Exact workspace screens**

## **1\. Overview**

Purpose:

* Executive summary

* Fast health check

Key cards:

* Year 1 revenue

* Year 1 gross margin %

* Year 1 net income

* Ending cash

* Max LOC draw required

* Annual break-even sales

* Monthly break-even sales

* Current ratio

* DSCR

* Balance sheet status

Charts:

* Monthly revenue (Year 1\)

* Monthly gross margin dollars (Year 1\)

* Monthly ending cash (36 months view toggle)

* Monthly net income (Year 1\)

* Scenario comparison summary

Alerts:

* Cash shortfall

* Margin too low

* Sales below break-even

* Owner comp missing

* Heavy debt load

* Balance sheet warning

* Working-capital stress

---

## **2\. Setup**

Purpose:

* Mirror Directions and identity settings

Fields:

* Model name

* Company name

* Preparer name

* Start month

* Start year

* Currency

* Country/region

* Business profile/type

* New vs ongoing business

* Notes

---

## **3\. Opening Position & Funding**

Purpose:

* Mirror 1-StartingPoint

### **Fixed assets section**

Rows:

* Real estate \- land

* Real estate \- buildings

* Leasehold improvements

* Equipment

* Furniture and fixtures

* Vehicles

* Other

Fields per row:

* Amount

* Depreciation years

* Notes

### **Operating capital / startup costs section**

Rows:

* Pre-opening salaries and wages

* Prepaid insurance premiums

* Inventory

* Legal and accounting fees

* Rent deposits

* Utility deposits

* Supplies

* Advertising and promotions

* Licenses

* Other initial startup costs

* Working capital (cash on hand)

### **Funding sources section**

Rows:

* Owner equity

* Outside investors

* Commercial loan

* Commercial mortgage

* Credit card debt

* Vehicle loans

* Other bank debt

Fields where applicable:

* Amount

* Interest rate

* Term in months

* Monthly payment

* Notes

### **Existing business opening balances section**

Fields:

* Cash

* Accounts receivable

* Prepaid expenses

* Accounts payable

* Accrued expenses

* Total cash on hand (calculated)

### **Outputs on this page**

* Total fixed assets

* Total operating capital

* Total required funds

* Total sources of funding

* Funding gap / surplus

* Balanced status

---

## **4\. Revenue**

Purpose:

* Mirror 3a and 3b

### **Structure**

Two sub-views:

* **Year 1 Monthly**

* **Years 2–3 Summary**

### **Dynamic revenue lines**

Recommended MVP cap: **12 active revenue lines**

Each row:

* Line name

* Unit label

* Month 1 units

* Price per unit

* COGS per unit

* Margin per unit (calculated)

* Q1 monthly growth

* Q2 monthly growth

* Q3 monthly growth

* Q4 monthly growth

* Year 2 monthly growth

* Year 3 monthly growth

* Start month (optional advanced)

* End month (optional advanced)

### **Views**

#### **Year 1 Monthly**

For each line:

* Units by month

* Sales by month

* COGS by month

* Margin by month

#### **Years 2–3 Summary**

For each line:

* Year 1 totals

* Year 2 totals

* Year 3 totals

* Sales mix %

### **Override behavior**

Default behavior:

* Generated from assumptions

Allowed behavior:

* Controlled monthly override by row/month

* AI must explain downstream effect before apply

### **Built-in helper**

COGS helper modal / panel:

* Product cost mode

* Service cost mode

* Component-based calculator

* Push result back into revenue line

---

## **5\. Payroll**

Purpose:

* Preserve 2a and 2b, but modernize the UI

### **Structure**

Two sub-views:

* **Year 1 Monthly**

* **Years 2–3 Summary**

### **Dynamic payroll roles**

Recommended MVP cap: **12 active payroll roles**

Each row:

* Role name

* Role type: owner / employee / contractor

* Headcount

* Compensation mode: hourly or monthly

* Average hourly pay or monthly pay

* Hours per week if hourly

* Start month

* End month (optional)

* Year 2 growth

* Year 3 growth

### **Global payroll assumptions**

* Social Security

* Medicare

* FUTA

* SUTA

* Pension

* Workers comp

* Health insurance

* Other benefits

### **Outputs**

#### **Year 1 Monthly**

* Monthly wages by role

* Monthly taxes & benefits

* Monthly total payroll

#### **Years 2–3 Summary**

* Annual totals by role

* Annual tax/benefit totals

* Total payroll by year

### **Override behavior**

* Explicit role/month overrides only

* Must be labeled as override

* AI can recommend overrides, never silently apply

---

## **6\. Expenses**

Purpose:

* Mirror 5a and 5b

### **Structure**

Two sub-views:

* **Year 1 Monthly**

* **Years 2–3 Summary**

### **Default operating expense categories**

* Advertising

* Car and truck expenses

* Commissions and fees

* Contract labor (not in payroll)

* Insurance (other than health)

* Legal and professional services

* Licenses

* Office expense

* Rent/lease — vehicles, machinery, equipment

* Rent/lease — other property

* Repairs and maintenance

* Supplies

* Travel / meals / entertainment

* Utilities

* Miscellaneous

### **Custom categories**

Recommended MVP cap: **8 custom expense lines**

### **Fields**

For Year 1:

* Monthly amount per category

For Years 2–3:

* Growth rate Year 1 to 2

* Growth rate Year 2 to 3

### **Read-only calculated other expenses**

* Depreciation

* Interest by debt type

* Line of credit interest

* Bad debt expense

### **Outputs**

* Total Year 1 monthly OpEx

* Annual OpEx totals by year

* Fixed vs variable expense summary where relevant

---

## **7\. Cash & Financing**

Purpose:

* Mirror 4-AdditionalInputs, 6a, 6b, and debt/capex behavior

### **Sub-sections**

#### **A. Collections timing (A/R)**

* % collected within 30 days

* % collected in 30–60 days

* % collected after 60 days

* Bad debt allowance

#### **B. Disbursement timing (A/P)**

* % paid within 30 days

* % paid in 30–60 days

* % paid after 60 days

#### **C. Minimum cash and line of credit**

* Desired minimum cash balance

* LOC interest rate

* Financing behavior choice:

  * Auto-draw LOC

  * Show shortfall only

  * Manual financing assumption mode

#### **D. Additional fixed asset purchases**

Rows:

* Real estate

* Leasehold improvements

* Equipment

* Furniture and fixtures

* Vehicles

* Other

Fields:

* Depreciation years

* Monthly purchases Year 1

* Year 2 annual purchases

* Year 3 annual purchases

#### **E. Tax settings**

* Effective tax rate Year 1

* Effective tax rate Year 2

* Effective tax rate Year 3

#### **F. Startup amortization**

* Amortization period in years

#### **G. Manual cash items**

* Taxes paid by month

* Owner draws by month

* Dividends by month

* Additional inventory by month

* Manual LOC repayments by month

### **Cash flow views**

#### **Year 1 Cash Flow**

Monthly detail view:

* Beginning balance

* Cash inflows

* Cash outflows

* Financing activity

* Ending cash

* LOC balance

#### **Years 2–3 Cash Flow**

Separate summary view that mirrors workbook separation:

* Year 1 annual total reference

* Year 2 monthly detail available in its own pane

* Year 3 monthly detail available in its own pane

* Annual totals displayed side by side

---

## **8\. Statements**

Purpose:

* Reporting layer

### **A. Income Statement — Year 1**

Monthly accrual view:

* Revenue

* COGS

* Gross margin

* Payroll

* Operating expenses

* EBITDA-like operating income

* Amortization

* Depreciation

* Interest

* Bad debt

* Pretax income

* Tax

* Net income

### **B. Income Statement — Years 2–3**

Annual view:

* Year 1 total

* Year 2 total

* Year 3 total

### **C. Balance Sheet**

Annual view:

* Current assets

* Fixed assets net

* Current liabilities

* Long-term liabilities

* Equity

* Balance check

### **D. Break-even**

* Gross margin %

* Fixed expenses

* Annual break-even sales

* Monthly break-even sales

* Actual vs break-even view

### **E. Ratios**

* Current ratio

* Quick ratio

* Debt to equity

* DSCR

* Sales growth

* COGS to sales

* Gross margin %

* SG\&A to sales

* Net margin

* ROE

* ROA

* Days in receivables

* Inventory turnover

* Sales to assets

Industry norms field should be supported as manual input in v1.

---

## **9\. Diagnostics**

Purpose:

* Convert workbook logic into human-readable warnings and coaching

Examples:

* Owner injection may be too low

* Cash request may be too high

* Loan term may be too aggressive

* Gross margin appears weak

* Owner compensation not set

* Business not profitable under current assumptions

* Receivables are high relative to sales

* Balance sheet is not balanced

* Sales do not exceed break-even

* Debt service is pressuring cash flow

Each diagnostic card should contain:

* Finding title

* Severity: info / caution / warning

* Based on your model

* Why it matters in plain English

* Suggested next action

* Optional “Ask AI to help fix this” action

---

## **10\. Scenarios**

Purpose:

* Make the model decision-oriented

### **Scenario system**

Each business can have multiple scenarios.

Recommended default scenarios:

* Base Case

* Best Case

* Worst Case

### **User actions**

* Duplicate scenario

* Rename scenario

* Compare scenarios

* Make scenario-specific notes

* Branch from scenario

### **Comparison metrics**

* Revenue

* Gross margin

* Payroll

* Operating expenses

* Net income

* Ending cash

* Max LOC draw

* Break-even sales

* Current ratio

* DSCR

### **AI scenario support**

AI can help create scenario variants like:

* “What if sales are 20% lower?”

* “What if payroll starts 2 months later?”

* “What if I finance equipment instead of paying cash?”

AI must show the exact scenario deltas before creating the new scenario.

---

## **11\. Exports**

### **PDF export**

Recommended v1 PDF sections:

* Cover / business info

* Executive summary

* Key metrics

* Revenue summary

* Cash summary

* Income statement summary

* Balance sheet summary

* Break-even summary

* Ratio summary

* Key diagnostics

* Scenario comparison summary

### **CSV export**

Recommended CSV exports:

* Assumptions export

* Revenue lines export

* Payroll export

* Expense export

* Monthly cash flow export

* Income statement export

* Balance sheet export

* Scenario comparison export

---

## **AI system specification**

## **AI locations**

AI exists in two places:

1. **Wizard AI** — onboarding and first model setup

2. **Contextual AI assistant** — available on all major screens inside the workspace

## **AI responsibilities**

### **1\. Explain concepts**

Examples:

* gross margin

* working capital

* A/R timing

* DSCR

* depreciation

* amortization

### **2\. Help estimate unknown numbers**

If the user says “I don’t know,” AI must:

* explain what the number means

* explain why it matters

* present 3 practical ways to estimate it

* give pros and cons of each

* recommend one path

* let the user choose

### **3\. Propose model changes**

Examples:

* lower payroll start date

* change pricing

* change growth assumptions

* adjust bad debt allowance

* switch financing behavior

### **4\. Compare alternatives**

Examples:

* hire now vs later

* debt vs owner cash

* higher price vs higher volume

* lower margin vs faster growth

### **5\. Teach through diagnostics**

If a warning appears, AI should explain:

* what triggered it

* why it matters

* how to improve it

* what tradeoffs each fix creates

## **AI response format**

When teaching or estimating, the default response format should be:

1. **What this means**

2. **Why it matters**

3. **3 practical ways to handle it**

4. **Pros and cons of each**

5. **My recommendation**

6. **What would change in your model if we apply it**

## **AI change-control rules**

AI may:

* read current scenario assumptions

* read current screen context

* read calculated outputs

* propose new assumptions

* propose overrides

* preview impact

* apply changes after approval

AI may not:

* silently change assumptions

* rewrite formulas

* edit locked statement outputs directly

* invent historical actuals and present them as fact

* blur the line between model-derived conclusions and general advice

## **AI approval flow**

Whenever AI proposes a change, the UI should show:

* Current value(s)

* Proposed value(s)

* Why the AI is suggesting it

* Expected impact on revenue / margin / cash / profit / break-even

* Buttons: Approve / Edit / Reject

## **AI reasoning labels**

Every substantive AI answer should separate:

### **Based on your model**

This section must use the user’s actual numbers and calculated outputs.

### **General guidance**

This section may contain broader advice, rules of thumb, or educational explanation.

## **AI logging**

Store:

* prompt/request

* screen context

* proposed changes

* user decision

* final applied changes

This creates an audit trail and improves trust.

---

## **Finance engine specification**

## **Core technical principle**

Use a deterministic calculation engine built in TypeScript.

The workbook is the parity reference, not the production runtime.

## **Calculation order**

1. Normalize user inputs

2. Build period axis (36 months)

3. Calculate opening position

4. Calculate funding and debt schedules

5. Calculate depreciation and amortization schedules

6. Calculate Year 1 revenue monthly

7. Calculate Years 2–3 revenue roll-forward

8. Calculate Year 1 payroll monthly

9. Calculate Years 2–3 payroll growth

10. Calculate Year 1 operating expenses monthly

11. Calculate Years 2–3 operating expense growth

12. Calculate cash collections and disbursement timing

13. Calculate Year 1 cash flow

14. Calculate Years 2–3 cash flow

15. Calculate Year 1 income statement

16. Calculate Years 2–3 income statement

17. Calculate balance sheet

18. Calculate break-even

19. Calculate ratios

20. Calculate diagnostics

21. Build scenario comparison outputs

## **Required parity areas from workbook**

The v1 engine must preserve:

* month-axis generation from start month/year

* Year 1 revenue compounding by quarterly monthly growth

* Years 2–3 monthly roll-forward from previous year ending month

* revenue based on units × price

* COGS based on units × cogs per unit

* payroll from compensation drivers

* payroll taxes and benefits logic

* A/R collection lag

* A/P payment lag

* debt amortization

* depreciation of initial and additional fixed assets

* amortization of startup items

* LOC behavior by chosen rule

* tax logic for pretax income

* balance sheet balancing

* break-even and diagnostics logic

## **Validation requirement**

Before release, the app must be tested against controlled workbook scenarios and should match key outputs within a tight tolerance.

Key parity checks:

* Revenue

* COGS

* Gross margin

* Payroll

* Total OpEx

* Ending cash

* LOC draw

* Net income

* Balance sheet balance

* Break-even sales

* Ratios

---

## **Data model**

## **Core entities**

### **User**

* id

* email

* name

* plan

* createdAt

* updatedAt

### **Subscription**

* userId

* planId

* status

* renewalDate

* aiCreditsRemaining

* aiCreditResetDate

### **BusinessModel**

* id

* userId

* name

* companyName

* preparerName

* businessProfile

* stage

* startMonth

* startYear

* currency

* countryRegion

* notes

* createdAt

* updatedAt

### **Scenario**

* id

* businessModelId

* name

* notes

* isBase

* createdAt

* updatedAt

### **OpeningAsset**

* scenarioId

* category

* amount

* depreciationYears

* notes

### **StartupCost**

* scenarioId

* category

* amount

* notes

### **FundingSource**

* scenarioId

* category

* amount

* interestRate

* termMonths

* monthlyPayment

* notes

### **OpeningBalance**

* scenarioId

* cash

* accountsReceivable

* prepaidExpenses

* accountsPayable

* accruedExpenses

### **RevenueLine**

* scenarioId

* sortOrder

* name

* unitLabel

* month1Units

* pricePerUnit

* cogsPerUnit

* q1Growth

* q2Growth

* q3Growth

* q4Growth

* year2MonthlyGrowth

* year3MonthlyGrowth

* startMonth

* endMonth

* isActive

### **RevenueOverride**

* scenarioId

* revenueLineId

* monthIndex

* fieldType

* overrideValue

* reason

### **PayrollRole**

* scenarioId

* sortOrder

* roleName

* roleType

* compensationMode

* headcount

* hourlyRate

* monthlyComp

* hoursPerWeek

* startMonth

* endMonth

* year2Growth

* year3Growth

* isActive

### **PayrollAssumption**

* scenarioId

* socialSecurityRate

* medicareRate

* futaRate

* sutaRate

* pensionRate

* workersCompRate

* healthInsuranceRate

* otherBenefitsRate

### **PayrollOverride**

* scenarioId

* payrollRoleId

* monthIndex

* fieldType

* overrideValue

* reason

### **OperatingExpense**

* scenarioId

* sortOrder

* category

* isCustom

* monthlyYear1Values

* year2Growth

* year3Growth

* isActive

### **WorkingCapitalSetting**

* scenarioId

* arWithin30

* ar30to60

* arOver60

* badDebtAllowance

* apWithin30

* ap30to60

* apOver60

* desiredMinCash

* locInterestRate

* financingBehavior

### **CapExPlan**

* scenarioId

* category

* depreciationYears

* monthlyYear1Values

* year2AnnualAmount

* year3AnnualAmount

### **TaxSetting**

* scenarioId

* year1TaxRate

* year2TaxRate

* year3TaxRate

* amortizationYears

### **CashAdjustment**

* scenarioId

* monthIndex

* taxesPaid

* ownerDraws

* dividends

* additionalInventory

* locRepayment

### **HistoricalActualImport**

* scenarioId

* sourceType

* uploadName

* mappingJson

* importedPeriods

* createdAt

### **AIConversation**

* id

* scenarioId

* screenContext

* conversationType

* createdAt

### **AISuggestion**

* id

* conversationId

* suggestionType

* proposedChangesJson

* impactSummaryJson

* approved

* approvedAt

* rejectedAt

### **CalculatedOutputSnapshot**

* scenarioId

* version

* monthlyOutputJson

* annualOutputJson

* ratiosJson

* diagnosticsJson

* updatedAt

### **ExportJob**

* scenarioId

* exportType

* status

* fileUrl

* createdAt

---

## **Plans and pricing**

## **Plan 1 — Builder ($50/month)**

Recommended positioning:

* For owners building and updating their own plans

Recommended included features:

* 1 user

* Multiple businesses/models

* Unlimited deterministic calculations

* Scenario planning

* PDF export

* CSV export

* AI Wizard

* AI assistant on major screens

* Ongoing business support with opening balances and CSV/manual trailing actuals entry

* Standard diagnostics and scenario comparison

Recommended AI allowance for launch:

* generous but capped monthly AI usage

* enough for normal planning behavior

* should not be marketed as “unlimited AI”

Suggested operational starting point:

* around **300 AI actions/month**

(One “AI action” means a meaningful assistant request such as explanation, estimate help, diagnostic help, change proposal, or import-mapping help.)

## **Plan 2 — Pro ($200/month)**

Recommended positioning:

* For heavier users who want significantly more AI help and more intensive model work

Recommended included features:

* Everything in Builder

* Much larger AI allowance

* Larger import capacity

* Priority support

* Enhanced PDF/report pack

* Deeper scenario comparison and heavier-use workflows

Suggested operational starting point:

* around **2,000 AI actions/month**

## **Pricing note**

These allowances are recommended starting points and should be validated in beta against real AI cost per user.

---

## **Ongoing business actuals import (v1)**

Since spreadsheet import is out of scope, the ongoing-business bridge is:

### **Manual entry mode**

User enters:

* opening balances

* trailing monthly revenue

* trailing COGS

* trailing payroll

* trailing key expenses

* trailing taxes/debt if desired

### **CSV import mode**

CSV importer should support:

* month/date column

* revenue

* COGS

* payroll

* operating expense categories

* taxes paid

* debt service

* capex

AI may help map CSV columns to model categories, but the user must approve the mapping.

---

## **Year 1 vs Years 2–3 UI rule**

This is important and locked.

The app should not flatten all 36 months into one giant default editing surface.

Instead:

* Year 1 gets its own detailed monthly editing views

* Years 2 and 3 get separate summary-oriented views with access to month-level detail when needed

* Reports should preserve the feeling that the current year is the operational build year, while Years 2 and 3 are the structured forward plan

This mirrors the workbook and keeps the app more usable.

---

## **Overrides policy**

Overrides are allowed, but only deliberately.

### **Override rules**

* Overrides are row-and-month specific

* Overrides must be visibly labeled

* Users can clear overrides and return to generated mode

* AI can suggest overrides but cannot apply them silently

* Reports should be able to indicate where overrides exist

Recommended UI treatment:

* small override badge on affected cells/rows

* side panel showing “generated value vs override value”

* “revert to generated” action

---

## **Guardrails and trust rules**

1. No silent edits by AI

2. No formula editing by AI in v1

3. All AI-derived estimates must be labeled as assumptions

4. Model-derived statements must be separated from general advice

5. Every AI-proposed change must show downstream business impact

6. All applied AI changes should be logged

7. Every key statement should remain traceable to deterministic assumptions

---

## **MVP success criteria**

The MVP is successful if a typical user can:

* create a model in under 20–30 minutes

* finish setup even when they do not know several numbers at the start

* understand what the model is telling them

* compare at least 3 scenarios

* export a professional summary

* trust that the numbers are grounded in real logic

Internal success criteria:

* workbook parity is strong

* AI usage stays economically viable under the two-plan model

* users rely on the AI to learn and decide, not only to chat

* support issues are mostly business-model questions, not “how does this app work?”

---

## **Recommended build order**

## **Phase 0 — Model parity foundation**

Build the deterministic engine and validate against workbook scenarios.

Deliverables:

* input schema

* period generation

* revenue engine

* payroll engine

* expense engine

* debt/depreciation/amortization engine

* cash flow

* income statement

* balance sheet

* break-even

* ratios

* diagnostics

Exit criteria:

* controlled scenarios match workbook outputs with tight tolerance

## **Phase 1 — Core app shell**

Build:

* auth

* billing skeleton

* business dashboard

* business/scenario storage

* workspace shell

Exit criteria:

* user can create and persist businesses and scenarios

## **Phase 2 — AI wizard**

Build:

* onboarding flow

* screen-by-screen question engine

* estimate-help mode

* recommendation format

* review step

Exit criteria:

* user can go from blank to Base Case model

## **Phase 3 — Assumption workspace**

Build:

* setup

* opening position & funding

* revenue

* payroll

* expenses

* cash & financing

* overrides

Exit criteria:

* user can fully edit assumptions outside the wizard

## **Phase 4 — Reporting layer**

Build:

* overview dashboard

* cash flow views

* income statement views

* balance sheet

* break-even

* ratios

* diagnostics

* scenario comparison

Exit criteria:

* user can understand and review model outputs without Excel

## **Phase 5 — AI assistant in workspace**

Build:

* contextual assistant panel

* change proposals

* impact previews

* approval flow

* audit log

Exit criteria:

* AI can explain, estimate, diagnose, and propose edits safely

## **Phase 6 — Ongoing business actuals bridge \+ export**

Build:

* CSV import

* manual actuals entry flow

* PDF export

* CSV export

Exit criteria:

* user can import recent actuals and export a shareable model pack

---

## **Final launch decisions added**

The remaining open items are now resolved.

### **23\. Geographic scope**

**Locked:** US-only at launch.

Implication:

* payroll wording, default assumptions, and guidance can stay US-shaped in v1

* product copy can be simpler and more coherent

* future internationalization stays out of v1 scope

### **24\. Language and business-profile presentation**

**Locked:** English-only at launch.

Interpretation applied for the PRD:

* all UI copy is in English

* all AI responses are in English

* business-profile-aware onboarding remains in place, but the profiles are presented in English only

* launch profile set remains a small curated set inside the generic core model:

  * Service

  * Product

  * Contractor / Home Service

  * Agency / Consulting

  * Retail / Storefront

  * Other

This preserves the earlier product decision of one generic engine with business-type-aware language, while keeping the launch narrow and manageable.

### **25\. $200 Pro plan scope**

**Locked:** the $200 price point is for materially higher AI limits only.

Implication:

* Builder ($50) and Pro ($200) share the same deterministic modeling core

* Pro does not introduce advisor workspaces, collaboration, or a second product surface in v1

* the main differentiator is AI volume capacity

Recommended working launch structure:

* **Builder ($50/month):** generous monthly AI allowance for typical owners

* **Pro ($200/month):** much higher monthly AI allowance for heavier users

The exact monthly AI action numbers should still be validated during beta based on real usage and model cost.

### **26\. Legal/product positioning of AI**

**Locked:** planning tool with guided recommendations, clearly not professional financial advice.

Implication:

* onboarding, assistant copy, and exports should include clear boundaries

* the AI can recommend, explain, compare, and teach

* the AI should not be positioned as a licensed financial advisor, accountant, or attorney

---

## **Final locked launch profile**

The MVP is now fully locked at the product-definition level:

* US-only launch

* English-only UI and AI

* one generic financial model engine

* business-profile-aware onboarding language

* AI-guided wizard

* contextual AI assistant on major screens

* AI proposes changes, user approves before apply

* general small business audience

* support for new and ongoing businesses

* opening balances \+ trailing actuals via CSV/manual entry

* full 36-month availability

* Year 1 separated from Years 2–3 summary-oriented views

* controlled overrides

* PDF \+ CSV export

* paid from day one

* Builder $50

* Pro $200 with higher AI limits only

* planning tool positioning, not professional financial advice

---

## **Final status**

This PRD is now defined enough to move directly into the implementation pack:

1. wireframes

2. database schema

3. calculation-engine module design

4. AI behavior flows

5. sprint planning

6. pricing/usage enforcement rules for the two plans

## **Recommended next document**

The next artifact should be:

**Implementation PRD / Engineering Plan**

It should include:

* route map

* screen-by-screen wireframe notes

* exact field definitions

* calculation module boundaries

* AI prompt/system behavior rules

* approval-flow UX

* CSV import format

* export spec

* billing/usage enforcement design

* phased sprint plan

This MVP definition is now complete enough to hand to design and engineering.

