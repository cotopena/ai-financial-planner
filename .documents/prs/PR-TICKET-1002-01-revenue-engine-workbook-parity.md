## Linked Context
- Issue: `AIF-7`
- Ticket: `TICKET-1002`
- Plan: `.documents/.plans/pending/PLAN-1002-revenue-engine-workbook-parity-2026-03-19.md`
- Research: `.documents/research/RSRCH-1002-revenue-engine-workbook-parity-2026-03-19.md`

## Problem
The revenue engine was still stubbed, which kept scenario summaries at placeholder values and blocked downstream cash-flow, reporting, and diagnostics work. Convex recalculation also ignored saved scenario revenue data because it always ran the engine against an empty input.

## Summary
- Replace the stubbed revenue module with deterministic 36-month revenue, COGS, and margin calculations by line and in total.
- Add typed revenue output detail for line-level monthly and annual metrics, total-series rollups, and applied override traceability while preserving aggregate sales compatibility fields.
- Wire `engine.recalculateScenario` to real persisted business, opening-balance, revenue-line, and revenue-override records instead of empty placeholder inputs.
- Add controlled workbook-derived revenue parity fixtures plus a dedicated `npm run parity:revenue` regression runner.
- Update plan and progress docs with implementation and verification evidence.

## What Changed For Users
- Saved scenarios with persisted revenue assumptions now return real revenue summary values from the Convex recalc action.
- Revenue outputs now expose per-line monthly and annual units, sales, COGS, margin, and override attribution needed by later reporting work.
- Workbook parity coverage now protects the key v1 revenue cases: Year 1 compounding, Year 2 and Year 3 roll-forward, sales override precedence, and inactive low-margin windows.

## Implementation Details
- Added a revenue-specific output contract in `src/engine/schemas/output-schema.ts` and compatibility-safe traceability keys in `src/engine/schemas/input-schema.ts`.
- Implemented pure revenue math in `src/engine/modules/revenue.ts` with helpers for growth lookup, activity gating, total rollups, and override handling in `src/engine/modules/revenue-helpers.ts`.
- Updated `src/engine/orchestrator/calculate-scenario.ts` so summary revenue and gross margin percent derive from calculated totals instead of placeholders.
- Added `convex/lib/scenario_calculation_input.ts` and updated `convex/engine.ts` so persisted scenario data feeds the shared engine during recalculation.
- Added fixture definitions and a parity runner under `src/engine/parity/` and exposed them through `npm run parity:revenue`.

## Scope Notes
- Revenue UI editing, override badges, snapshot persistence, reporting UI, and diagnostics rendering remain out of scope for this PR.
- `convex/assumptions.ts` revenue write-path stubs were intentionally left unchanged to keep the PR inside the approved ticket boundary.
- Snapshot persistence is still explicitly pending, and the recalc action note continues to say so.

## Verification
- [x] `npm run parity:revenue`
- [x] `npm run convex:codegen`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] Manual: `calculateScenario` returned 36 monthly values, 3 annual values, and `sections.revenue.monthly` matched `totals.sales.monthly` while line detail exposed units, sales, COGS, and margin.
- [x] Manual: controlled workbook comparison matched the `revenue-ongoing-opening-balances` fixture for Year 1 totals and Month 13.
- [x] Manual: parity failure messages identify fixture, scope, month or year, and metric rather than only a section-level mismatch.
- [x] Manual: `npx convex run engine:recalculateScenario '{"scenarioId":"ns78z8qas7rym44cx9v1t5r9ds837sdb"}' --identity '{"subject":"seed-manual-verification-revenue","email":"seed+revenue@example.com","name":"Revenue Parity Seed"}'` returned `status: "calculated"`, `summary.revenue: 14400`, `summary.grossMarginPct: 75`, and a populated `revenueSection`.

## Risks And Follow-Ups
- Revenue persistence writes are still stubbed, so seeded or pre-existing records are required to exercise the persisted recalc path today.
- Snapshot persistence and scenario overview/reporting integration are still future work, so the new revenue payload is currently consumed primarily by the recalc action and parity harness.
- Payroll parity and downstream statement/cash-flow modules still need equivalent deterministic coverage.

## Changelog Summary
This PR turns revenue from a placeholder module into a workbook-aligned engine surface with real Convex-backed recalculation and repeatable parity regression coverage.
