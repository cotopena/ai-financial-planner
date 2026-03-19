# Revenue Engine Workbook Parity Implementation Plan

## Overview
Implement deterministic revenue calculations that match the workbook for Year 1 and Years 2-3, using the existing revenue assumption model and keeping downstream engine consumers ready for non-placeholder revenue outputs. This plan stays inside the ticket boundary: engine math, parity coverage, and enough Convex recalc wiring to calculate from persisted revenue data, but not revenue UI editing or snapshot/reporting rollout.

## Inputs
- Issue: `.documents/issues/current/AIF-7-revenue-engine-roll-forward-2026-03-19.md`
- Ticket: `.documents/.tickets/current/TICKET-1002-ship-revenue-engine-workbook-parity-2026-03-19.md`
- Research: `.documents/research/RSRCH-1002-revenue-engine-workbook-parity-2026-03-19.md`

## Current State Analysis
- `src/engine/modules/revenue.ts:5` - `calculateRevenue` still returns a stub section with no deterministic math.
- `src/engine/orchestrator/calculate-scenario.ts:25` - the orchestrator already calls revenue in the section assembly flow, but `summary.revenue` and `summary.grossMarginPct` are still hard-coded placeholders.
- `src/engine/schemas/output-schema.ts:24` - the generic section payload only supports aggregate `monthly`, `annual`, and `notes`, so there is no typed place for line-level revenue detail or applied override attribution.
- `src/engine/schemas/input-schema.ts:53` - revenue line and override inputs already carry the drivers required by the PRD: month-1 units, price, COGS, quarterly growth, later-year growth, active window, and override metadata.
- `src/engine/core/period-axis.ts:22` - the engine already has a typed 36-month axis with calendar month/year, quarter, year bucket, and display labels, so revenue math can stay pure and period-driven.
- `convex/schema.ts:150` - `revenue_lines` and `revenue_overrides` already persist the needed driver and override fields, with a `by_line_month_metric` index available for override lookup.
- `convex/assumptions.ts:52` - the revenue workspace read path is live, but `upsertRevenue` remains stubbed at `convex/assumptions.ts:206`.
- `convex/engine.ts:6` - the recalc action still runs `calculateScenario(createEmptyScenarioInput())`, so persisted scenario revenue data never reaches the engine today.
- `src/engine/parity/parity-tests.ts:1` - parity scaffolding is only a required-fixture registry; there are no workbook-derived fixtures or runnable parity checks yet.
- `docs/Implementation PRD - AI Financial Planner (v1).md:647` - the PRD requires monthly units, sales, COGS, and margin, inactive-month gating, and explicit override precedence.
- `docs/Implementation PRD - AI Financial Planner (v1).md:1586` - the key formulas lock revenue to `units * price`, COGS to `units * cogs`, margin to `sales - cogs`, quarterly Year 1 compounding, and Year 2/3 roll-forward from the prior-year ending month.
- `docs/MVP PRD — AI Financial Planner (v1).md:1705` - workbook parity for revenue, COGS, and gross margin is a release-level requirement.

## Desired End State
- `calculateRevenue` returns deterministic 36-month outputs for units, sales, COGS, and margin by revenue line and in total, respecting active windows and override precedence.
- `sections.revenue` exposes a typed detail payload that future working-capital, reporting, and diagnostics work can consume without guessing at placeholder shapes.
- `calculateScenario` summary values derive revenue and gross-margin metrics from real revenue totals instead of placeholder zeros.
- Convex recalc can assemble enough persisted scenario data to run deterministic revenue math without needing the revenue UI to be finished.
- Workbook-derived parity fixtures protect Year 1 compounding, Year 2/3 roll-forward, override precedence, and low-margin cases from regressions.

## Key Discoveries
- `docs/Implementation PRD - AI Financial Planner (v1).md:1496` requires the engine to stay deterministic, side-effect free, and traceable back to assumptions.
- `.documents/.tickets/current/TICKET-1002-ship-revenue-engine-workbook-parity-2026-03-19.md:22` keeps this ticket focused on the shared TypeScript engine, parity fixtures, and existing Convex revenue surfaces.
- `.documents/.tickets/current/TICKET-1002-ship-revenue-engine-workbook-parity-2026-03-19.md:30` explicitly excludes revenue UI editing, snapshot/reporting screens, and diagnostics rendering from this implementation.
- `convex/schema.ts:387` stores snapshot payloads as `v.any()`, so richer revenue payloads do not require a table migration even though snapshot persistence itself remains out of scope.
- `package.json:5` has no parity-specific command today, so the implementation needs to add one if parity coverage is going to be repeatable in CI and local verification.

## What We're NOT Doing
- Revenue route/editor UI, override badges, save-state UX, or COGS helper interfaces.
- Payroll engine parity or shared reporting-layer implementation beyond keeping the revenue payload future-friendly.
- Snapshot persistence rollout, overview/reporting UI integration, or diagnostics page rendering.
- Destructive redesign of `revenue_lines` or `revenue_overrides`; only compatibility-safe engine-side typing additions are allowed if traceability needs them.

## Implementation Approach
- Introduce a revenue-specific output contract instead of broadening every section payload. Keep the existing `monthly` and `annual` arrays as total sales aggregates for compatibility, then add typed revenue detail fields for per-line metrics, total metric series, and applied override attribution.
- Keep revenue math pure inside `src/engine/`, with small helpers for growth lookup, active-month gating, annual rollups, and override application.
- Add a thin Convex-side adapter that reads persisted business, opening-balance, revenue-line, and revenue-override records and maps them into the engine input shape without coupling the shared engine directly to Convex document types.
- Add workbook-derived parity fixtures and a dedicated revenue parity runner so the module ships with a real regression harness instead of ad hoc fixture comments.

## Phase 1 - Revenue Contract and Input Wiring
### Goal
Create the revenue-specific engine contract and persisted-input adapter needed to support traceable outputs before the math is implemented.

### Implementation Steps
1. `src/engine/schemas/output-schema.ts` - add a `RevenueSectionPayloadSchema` and related types for line-level monthly metrics, annual rollups, total metric series, and applied override metadata while preserving aggregate `monthly`, `annual`, and `notes`.
2. `src/engine/schemas/input-schema.ts` - add compatibility-safe optional traceability keys for revenue inputs where needed, using engine-friendly string keys rather than Convex-specific ID types so existing callers and `createEmptyScenarioInput()` stay valid.
3. `src/engine/orchestrator/calculate-scenario.ts` - switch `sections.revenue` to the specialized payload type and derive `summary.revenue` plus `summary.grossMarginPct` from calculated revenue totals instead of placeholder constants.
4. `convex/engine.ts` plus a new helper under `convex/lib/` if needed - assemble the minimal persisted scenario input required for revenue calculation: business metadata, opening balances, revenue lines, and revenue overrides, with existing scenario ownership guardrails preserved.

### Acceptance Criteria
#### Automated
- [x] `npm run convex:codegen`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] Revenue output schema parses a representative calculated payload with line detail and applied override attribution.

#### Manual
- [x] Inspect one calculated scenario response and confirm `sections.revenue.monthly` still behaves as a total-sales series while revenue-specific detail fields carry the line/month metric breakdown. -- Passed: revenue-startup-no-debt returned 36 total-sales monthly values; `sections.revenue.monthly` matched `totals.sales.monthly`; line detail exposed units, sales, cogs, and margin for Jan 2026.

### Assets / Docs
- `docs/Implementation PRD - AI Financial Planner (v1).md:647-670`
- `docs/Implementation PRD - AI Financial Planner (v1).md:1496-1503`

## Phase 2 - Deterministic Revenue Math and Parity Fixtures
### Goal
Implement workbook-aligned revenue calculations for all 36 months and lock the behavior with controlled parity fixtures.

### Implementation Steps
1. `src/engine/modules/revenue.ts` - replace the stub with pure logic that computes active-month units, sales, COGS, and margin by line for months 1-12 using quarterly monthly growth compounding, then months 13-36 using prior-year ending-month roll-forward.
2. `src/engine/modules/` new revenue helper file if needed - isolate growth-rate selection, month activity checks, annual rollups, total-series accumulation, and traceability metadata assembly so parity fixtures can exercise the math directly.
3. `src/engine/modules/revenue.ts` or its helper module - codify override precedence explicitly: metric-level overrides win per line/month, `sales` overrides supersede generated `units * price`, inactive months stay zeroed, and applied overrides are emitted as traceable output metadata.
4. `src/engine/parity/` new fixture data files and runner - add workbook-derived controlled cases covering Year 1 compounding, Year 2/3 roll-forward, sales override precedence, and an inactive or low-margin case, while keeping fixture naming aligned with `requiredParityFixtures`.
5. `package.json` and any supporting script entrypoint - add a dedicated revenue parity command so parity checks are repeatable during implementation and later regression validation.

### Acceptance Criteria
#### Automated
- [x] `npm run parity:revenue`
- [x] `npm run convex:codegen`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

#### Manual
- [x] Compare at least one controlled workbook case against the new fixture output for monthly revenue, COGS, and gross margin totals across Year 1 and the first month of Year 2. -- Passed: temp workbook copy matched revenue-ongoing-opening-balances for Year 1 totals and first Year 2 month (14400 revenue, 3600 COGS, 10800 margin; month 13 1200/300/900).
- [x] Confirm fixture failure messages identify the drifting line, month, and metric rather than only reporting a section-level mismatch. -- Passed: parity drift messages identify fixture, line/total scope, month/year, and metric instead of only a section-level mismatch.

### Assets / Docs
- `docs/MVP PRD — AI Financial Planner (v1).md:1705-1749`
- `docs/Implementation PRD - AI Financial Planner (v1).md:1586-1593`
- `src/engine/parity/README.md`

## Phase 3 - Convex Recalc Readiness and Documentation
### Goal
Make the persisted revenue surfaces capable of producing real deterministic revenue outputs without pulling the ticket into snapshot/reporting or UI scope.

### Implementation Steps
1. `convex/engine.ts` plus the Phase 1 adapter - replace `createEmptyScenarioInput()` execution with a real persisted-input load path so recalc returns actual revenue-driven summary values for scenarios that have saved revenue assumptions.
2. `convex/assumptions.ts` - keep `upsertRevenue` UI persistence out of scope unless a small compatibility fix is required for implementation; if no write-path change is needed, document that explicitly in the ticket follow-up notes instead of expanding scope.
3. `docs/progress.md` and any related parity note under `.documents/` - update Sprint 2 evidence after implementation to reference deterministic revenue math and the new revenue parity runner.
4. Operational signal definition - treat the parity runner and deterministic recalc summary response as the observability surface for this ticket rather than introducing external telemetry or alerting infrastructure that the repo does not yet contain.

### Acceptance Criteria
#### Automated
- [x] `npm run parity:revenue`
- [x] `npm run convex:codegen`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

#### Manual
- [x] Trigger the revenue calculation path from persisted scenario data and confirm the action response no longer behaves like a revenue stub for revenue-only scenarios. -- Passed: seeded scenario `ns78z8qas7rym44cx9v1t5r9ds837sdb` returned `status: "calculated"` from `engine.recalculateScenario` with `summary.revenue = 14400`, `summary.grossMarginPct = 75`, and a populated `revenueSection`.
- [x] Verify the scope boundary is preserved: overview/snapshot UI remains unchanged, but the recalc path returns real revenue summary values. -- Passed: the action returned live revenue summary data and detailed `revenueSection`, while the response note still states snapshot persistence is pending.

### Assets / Docs
- `docs/progress.md:24-27`
- `.documents/research/RSRCH-1002-revenue-engine-workbook-parity-2026-03-19.md`

## Testing Strategy
- Unit/module-level: cover growth compounding, active-window gating, override precedence, annual rollups, and low-margin inputs in pure revenue helpers.
- Integration: cover `calculateScenario` and the Convex recalc path so persisted revenue rows produce non-zero revenue summary values and parse through the specialized revenue section schema.
- Regression/parity: execute workbook-derived fixtures through `npm run parity:revenue`, with explicit tolerance checks for revenue, COGS, and gross margin.
- Manual: compare one controlled workbook case end to end and inspect the returned revenue payload for line/month/override traceability.

## Performance / Security / Migration Notes
- Performance: keep revenue math `O(active revenue lines × 36)` and avoid per-period database reads; the MVP cap of 12 active revenue lines keeps this inexpensive in memory.
- Security: preserve existing `requireOwnedScenario` guardrails when loading scenario data for recalc; no auth, billing, or AI behavior changes are part of this work.
- Migration: no destructive Convex schema change is required. Any traceability-key addition in the engine input contract must remain optional and backward-compatible.
- Rollback: revert revenue module, output schema, parity runner, and recalc-adapter changes together; no snapshot-table rollback should be necessary if this plan is followed.

## Implementation Notes
- Automated implementation completed on 2026-03-19 against this plan while the file remained under `.documents/.plans/pending/`.
- `convex/assumptions.ts` write-path stubs were intentionally left unchanged to preserve the ticket boundary around engine math, parity coverage, and persisted recalc reads.
- Manual verification ran on 2026-03-19 in this worktree: Phase 1 and Phase 2 passed from the original report, and the Phase 3 persisted recalc check was later unblocked with a seeded Convex scenario under identity `seed-manual-verification-revenue`.

## Completed Automated Verifications
- [x] `npm run parity:revenue`
- [x] `npm run convex:codegen`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

## References
- `.documents/issues/current/AIF-7-revenue-engine-roll-forward-2026-03-19.md`
- `.documents/.tickets/current/TICKET-1002-ship-revenue-engine-workbook-parity-2026-03-19.md`
- `.documents/research/RSRCH-1002-revenue-engine-workbook-parity-2026-03-19.md`
- `docs/MVP PRD — AI Financial Planner (v1).md:1705-1749`
- `docs/Implementation PRD - AI Financial Planner (v1).md:293-317`
- `docs/Implementation PRD - AI Financial Planner (v1).md:647-670`
- `docs/Implementation PRD - AI Financial Planner (v1).md:1496-1503`
- `docs/Implementation PRD - AI Financial Planner (v1).md:1548-1593`
- `docs/progress.md:24-27`
- `src/engine/modules/revenue.ts:1-12`
- `src/engine/orchestrator/calculate-scenario.ts:25-64`
- `src/engine/schemas/input-schema.ts:53-78`
- `src/engine/schemas/output-schema.ts:24-114`
- `convex/schema.ts:150-182`
- `convex/assumptions.ts:52-64`
- `convex/engine.ts:1-20`
- `src/engine/parity/parity-tests.ts:1-12`
