# Tech Stack Decisions

## Goal
Ship the AI Financial Planner MVP quickly while keeping the deterministic model, app shell, and AI flows maintainable.

## Decisions and Rationale

### Frontend: Next.js App Router + TypeScript
- App Router matches the planned route-heavy workspace and authenticated shell.
- TypeScript keeps route, engine, and backend contracts aligned.
- Server and client boundaries are explicit enough for AI, billing, and reporting flows.

### Backend and Data: Convex
- Convex gives queries, mutations, actions, and scheduling without a separate API layer.
- The project already models businesses, scenarios, assumptions, snapshots, billing, and AI records in Convex.
- Convex keeps the schema close to the TypeScript app and engine.

### Auth: Clerk
- Clerk provides a fast path for authentication inside a Next.js App Router app.
- The current repo already depends on Clerk and has sign-in/sign-up routes wired.
- Single-user v1 accounts do not require a heavier custom auth surface.

### Billing: Stripe
- Stripe fits the paid-from-day-one plan model and existing repo surface.
- Checkout, portal, and webhook flows are standard and well-supported.

### AI: OpenAI Responses API
- The product requires guided onboarding, explanations, estimate help, and structured change proposals.
- Responses-style structured outputs fit approval-first workflows better than free-form chat alone.

### Deterministic Model: Shared TypeScript finance engine
- The workbook remains the reference, but runtime calculations belong in versioned application code.
- A shared engine lets Convex actions and the UI depend on the same calculation logic.
- This keeps parity work testable and avoids spreadsheet-as-product coupling.

## Constraints
- US-only launch and English-only UI in v1.
- AI suggestions must remain reviewable before apply.
- PDF and CSV exports are part of the MVP promise.
- The route map, model structure, and workspace stages should stay aligned with the implementation PRD unless explicitly changed.
