# AI Financial Planner

AI Financial Planner is an open-source product and portfolio project for building a small-business financial planning app around a deterministic 3-year modeling engine.

The core idea is simple: most small business owners need real planning answers, not a fragile spreadsheet. This project rebuilds a workbook-style financial model as a TypeScript engine, then wraps it in a web app with scenario management, guided onboarding, and explainable outputs.

## What the product is supposed to do

The target product helps a small business owner answer questions like:

- Is this business viable?
- How much cash do I need to start or stabilize it?
- What happens to cash month by month over 36 months?
- When do I break even?
- What changes if revenue grows slower or faster than expected?
- Can I afford payroll, debt, and operating expenses?
- If I do not know a number yet, what is a reasonable assumption to start with?

The long-term product direction in this repo is:

- An AI-guided onboarding wizard for building a base case
- Multiple businesses and multiple scenarios per user
- A deterministic 36-month finance engine
- Revenue, payroll, expenses, cash flow, statements, ratios, and diagnostics
- Scenario comparison and versioning
- PDF and CSV exports
- AI suggestions that require explicit user approval before changes are applied

## Why this project exists

This codebase is intentionally not "Excel in the browser." The workbook is treated as a parity reference, while the actual product logic is rebuilt as application code that is easier to test, version, and evolve.

That makes this project useful as both:

- A product prototype for an AI-assisted financial planning workflow
- A portfolio example of how to turn a spreadsheet-driven business process into a full-stack application with a typed engine underneath

## Current status

This project is in active MVP development.

Implemented today:

- Authenticated app shell with Clerk
- Convex-backed business and scenario CRUD
- Workspace routing for the major planning sections
- Deterministic scenario calculation orchestration
- Revenue engine logic with workbook-parity fixtures
- Secret scanning for local and CI workflows

In progress:

- AI onboarding wizard
- Editable assumption-entry screens across all model sections
- Persisted reporting snapshots for overview, statements, and diagnostics
- AI assistant suggestion flows
- Imports, exports, and billing enforcement

## Product scope

The MVP is designed around general small business owners first, with a US-only, English-only initial release. The planning model supports both startup and ongoing businesses and keeps all 36 months visible, while still separating Year 1 detail from Years 2-3 summary views.

Planned model areas:

- Setup and business profile
- Opening position and funding
- Revenue forecasting
- Payroll forecasting
- Operating expense forecasting
- Working capital and financing behavior
- Cash flow
- Income statement
- Balance sheet
- Break-even analysis
- Financial ratios
- Diagnostics and scenario comparison

## Architecture

The current implementation is built around a deterministic shared engine and a web app shell:

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend and data layer: Convex
- Auth: Clerk
- Billing: Stripe
- AI integration target: OpenAI Responses API
- Modeling approach: workbook-informed parity, but implemented as code

Key architectural rule:

- The spreadsheet is the reference, not the runtime.

## Repository highlights

Useful places to start:

- `docs/MVP PRD — AI Financial Planner (v1).md` for the locked product definition
- `docs/Implementation PRD - AI Financial Planner (v1).md` for the engineering plan and route map
- `docs/progress.md` for the current implementation status
- `src/engine/` for the finance engine modules
- `convex/` for backend functions and schema-backed app logic
- `src/app/` and `src/components/` for the application UI

## Local setup

```bash
npm install
cp .env.example .env.local
npm run convex:codegen
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

The app expects values for:

- Convex deployment
- Clerk publishable and secret keys
- Stripe publishable key, secret key, and webhook secret
- OpenAI API key

See `.env.example` for the current variable list.

## Verification

```bash
npm run convex:codegen
npm run lint
npm run typecheck
npm run build
npm run parity:revenue
npm run secrets:scan
```

Install `gitleaks` first if you want to run the local secret scan:

```bash
brew install gitleaks
npm run secrets:scan
```

To scan only staged changes before a commit:

```bash
npm run secrets:scan -- --staged
```

## Notes for reviewers

This is currently an MVP-in-progress rather than a finished SaaS product. Some screens are fully wired to real Convex data, while others are still scaffolded to match the target route map and product flow.

The most important technical throughline in the repo is the attempt to keep the financial model deterministic, testable, and explainable even as AI-assisted UX is layered on top.

## Disclaimer

This project is a software prototype for financial planning workflows. It is not financial, legal, tax, or investment advice.
