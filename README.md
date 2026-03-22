# AI Financial Planner

AI Financial Planner is a web application for small business owners to build, understand, and compare 3-year financial plans without managing a complex spreadsheet manually.

The product combines a deterministic finance engine with a guided app experience for assumptions, scenarios, statements, and diagnostics. This repository is also a portfolio project showing how a workbook-driven planning process can be rebuilt as a modern full-stack product.

| Item | Detail |
| --- | --- |
| Audience | Small business owners, founders, and operators |
| Primary use case | Build and compare 36-month business plans |
| Product approach | Guided web app with deterministic calculations and AI-assisted workflows |
| Current state | MVP in active development |

## What the app is for

The goal of the product is to help a user answer practical planning questions such as:

- Is this business financially viable?
- How much capital is needed to start or stabilize it?
- What happens to cash month by month over the next 36 months?
- When does the business break even?
- What changes if revenue grows slower or faster than expected?
- Can the business support payroll, debt, and operating expenses?

## Core product capabilities

The intended product experience includes:

- Create businesses and manage multiple planning scenarios
- Capture assumptions for revenue, payroll, expenses, funding, and cash flow
- Generate income statement, balance sheet, break-even, ratio, and diagnostic outputs
- Compare scenarios and version changes over time
- Use an AI-guided wizard to help build a base case
- Require user approval before AI-generated changes are applied

## Current implementation status

Implemented today:

- Clerk-authenticated application shell
- Convex-backed business and scenario CRUD
- Workspace routing for the main planning sections
- Deterministic scenario calculation orchestration
- Revenue engine logic with workbook-parity fixtures
- Local and CI secret scanning with Gitleaks

Still in progress:

- AI onboarding wizard
- End-to-end editable assumption-entry screens
- Persisted reporting snapshots for overview, statements, and diagnostics
- Contextual AI assistant flows
- Imports, exports, and billing enforcement

## Why this approach

This project is intentionally not Excel in the browser.

The spreadsheet model is treated as a parity reference, while the actual application logic is rebuilt as typed, testable code. That makes the system easier to validate, easier to evolve, and easier to explain than a UI that simply wraps spreadsheet formulas.

## Tech stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Convex for backend functions and data
- Clerk for authentication
- Stripe for billing
- OpenAI for planned AI-assisted workflows

## Running locally

### Prerequisites

- Node.js
- npm
- A configured Convex project
- Clerk, Stripe, and OpenAI credentials if you want the full app behavior

### Setup

```bash
npm install
cp .env.example .env.local
npm run convex:codegen
npm run dev
```

Open `http://localhost:3000`.

If you are running a local Convex workflow, use:

```bash
npm run dev:convex
```

## Environment variables

The app expects values for:

- Convex deployment
- Clerk publishable and secret keys
- Stripe publishable key, secret key, and webhook secret
- OpenAI API key

See `.env.example` for the current variable list.

Without those values, some routes will render placeholder or limited states instead of full product behavior.

## Verification

```bash
npm run convex:codegen
npm run lint
npm run typecheck
npm run build
npm run parity:revenue
npm run secrets:scan
```

Install `gitleaks` first if needed:

```bash
brew install gitleaks
```

To scan only staged changes before a commit:

```bash
npm run secrets:scan -- --staged
```

## Project structure

- `src/app/` - Next.js routes
- `src/components/` - UI components
- `src/engine/` - deterministic finance engine
- `convex/` - backend functions and schema-backed app logic
- `docs/` - product and implementation documentation

## Notes

- The financial model horizon is 36 months.
- Year 1 is intended to expose more granular detail than Years 2 and 3.
- The current codebase is an MVP, not a finished production SaaS.

## Disclaimer

This software is a financial planning prototype. It is not financial, legal, tax, or investment advice.

## License

This project uses the PolyForm Noncommercial 1.0.0 license. You may use,
study, and modify the code for noncommercial purposes, but commercial use is
not permitted without separate permission. See `LICENSE`.
