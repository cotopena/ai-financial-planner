# AI Financial Planner MVP Plan

## Goals
- Ship a web app that helps small business owners build a 3-year financial model without spreadsheet expertise.
- Preserve workbook parity through a deterministic TypeScript engine rather than running Excel directly.
- Support multiple businesses and scenarios per user under a single-user v1 account model.
- Use AI for onboarding, estimation help, explanation, and controlled change proposals.
- Support reporting, actuals import, export, and paid plans from day one.

## Stack
- Frontend: Next.js App Router + React + TypeScript
- Backend/DB: Convex
- Auth: Clerk
- Billing: Stripe
- AI: OpenAI Responses API
- Styling/UI: Tailwind CSS + shadcn/ui-style components
- Core model: shared TypeScript finance engine under `src/engine/`

## Confirmed Decisions
- Workbook is the parity oracle, not the runtime product surface.
- Year 1 and Years 2-3 remain separate experiences, following the workbook structure.
- AI never mutates assumptions without explicit user approval.
- v1 supports one user account with multiple businesses and multiple scenarios.
- Exports include PDF and CSV.
- Pricing launches with a lower-cost builder tier and a higher-cost pro tier.

## Current Delivery Phases
- Phase 0: Model parity foundation
- Phase 1: Core app shell
- Phase 2: AI wizard
- Phase 3: Assumption workspace
- Phase 4: Reporting layer
- Phase 5: Contextual AI assistant
- Phase 6: Actuals import, export, and billing enforcement
- Phase 7: Hardening and beta readiness

## Definition of Done
- A user can create a business and scenario, enter assumptions, and generate real outputs.
- Major workspace routes render persisted data rather than placeholders.
- AI guidance is contextual and approval-based.
- Billing, exports, and actuals workflows support the promised MVP surfaces.
- Lint, typecheck, build, and workflow validation steps pass for shipped work.
