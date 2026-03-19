---
date: 2026-03-19T10:53:10-0400
researcher: Codex
git_commit: 4e1218155b61
branch: main
repository: ai-finincial-planner
topic: "Revenue engine workbook parity codebase map"
tags: [research, codebase, revenue, engine, parity]
status: complete
last_updated: 2026-03-19
last_updated_by: Codex
linked_issue: .documents/issues/current/AIF-7-revenue-engine-roll-forward-2026-03-19.md
linked_ticket: .documents/.tickets/current/TICKET-1002-ship-revenue-engine-workbook-parity-2026-03-19.md
---

# Research: Revenue engine workbook parity codebase map

## Research Question
What revenue-related code, data contracts, UI surfaces, and parity scaffolding exist today for `TICKET-1002`, and how do they currently interact?

## Summary
The repository already contains the documented revenue requirements, the 36-month engine period axis, typed revenue input schemas, Convex persistence tables, and a revenue workspace read query. The current execution path is still scaffold-only: `calculateRevenue` returns a zeroed stub section, the orchestrator summary is hard-coded to zeros except for opening cash, the Convex engine action recalculates from `createEmptyScenarioInput()` instead of scenario records, and snapshot queries fall back to placeholder payloads. Revenue UI routes exist, but they currently render static PRD-style preview content rather than live assumption data, and the parity area contains only a reserved folder plus a fixture-name registry.

## Detailed Findings

### Product contract and sprint placement
- `.documents/issues/current/AIF-7-revenue-engine-roll-forward-2026-03-19.md:15` - the mirrored issue defines the target as deterministic monthly and annual revenue, COGS, and margin outputs from persisted scenario assumptions.
- `.documents/issues/current/AIF-7-revenue-engine-roll-forward-2026-03-19.md:18` - the issue explicitly calls for Year 1 monthly calculations, Years 2-3 roll-forward, line-level overrides, and traceable outputs.
- `.documents/.tickets/current/TICKET-1002-ship-revenue-engine-workbook-parity-2026-03-19.md:22` - the current ticket scopes the work to the shared TypeScript engine, parity fixtures, and existing Convex revenue surfaces, while leaving revenue UI editing and snapshot/reporting screens out of scope.
- `docs/progress.md:24` - Sprint 1 is still marked in progress, with real Convex-backed assumption reads and verified end-to-end calculations incomplete.
- `docs/progress.md:25` - Sprint 2 is marked in progress, with revenue/payroll modules and tables present but workbook parity and UI editing still missing.
- `docs/Implementation PRD - AI Financial Planner (v1).md:293` - the implementation PRD defines separate Year 1 and Years 2-3 revenue routes and expects Year 1 monthly grids plus later-period summary/detail views.
- `docs/Implementation PRD - AI Financial Planner (v1).md:647` - the PRD states that monthly units, sales, COGS, and margin are calculated, lines can be inactive outside start/end months, and overrides are handled through the override flow.
- `docs/Implementation PRD - AI Financial Planner (v1).md:659` - the override contract already specifies `month_index`, `metric`, `override_value`, `reason`, and `source`, plus precedence of `sales` overrides over generated `units * price`.
- `docs/Implementation PRD - AI Financial Planner (v1).md:1548` - the PRD places revenue ahead of working capital, cash flow, statements, break-even, ratios, and diagnostics in the calculation stack.
- `docs/MVP PRD — AI Financial Planner (v1).md:1711` - the MVP PRD preserves Year 1 quarterly growth compounding, Years 2-3 roll-forward from the prior-year ending month, revenue as `units × price`, and COGS as `units × cogs per unit`.

### Revenue assumptions and persistence surfaces
- `src/engine/schemas/input-schema.ts:53` - `RevenueLineSchema` already models the driver fields expected by the PRD: Month 1 units, price, COGS, quarterly Year 1 growth, Years 2-3 monthly growth, active window, and `isActive`.
- `src/engine/schemas/input-schema.ts:71` - `RevenueOverrideSchema` already models month, metric, override value, reason, source, and active state for overrides.
- `convex/schema.ts:150` - Convex persistence mirrors the engine schema through `revenue_lines`, including sorted lines, quarterly growth fields, later-year growth, active window, and `isActive`.
- `convex/schema.ts:171` - `revenue_overrides` persists `revenueLineId`, `monthIndex`, `metric`, `overrideValue`, `reason`, `source`, and `isActive`, with a `by_line_month_metric` index.
- `convex/assumptions.ts:20` - the shared workspace query already has a `"revenue"` branch under `getWorkspace`.
- `convex/assumptions.ts:52` - the `"revenue"` workspace read returns `revenueLines` sorted by `by_scenario_sort_order` and `revenueOverrides` by scenario.
- `convex/assumptions.ts:206` - `upsertRevenue` exists, but it currently returns a stub response and payload preview instead of writing to `revenue_lines` or `revenue_overrides`.

### Engine runtime and output contracts
- `src/engine/core/period-axis.ts:22` - the engine already builds a typed 36-month axis from `startMonth` and `startYear`, with month index, calendar month/year, quarter, year bucket, and display label.
- `src/engine/core/normalize-inputs.ts:7` - scenario calculation currently accepts partial in-memory input and fills defaults via `createEmptyScenarioInput`; there is no repository-local adapter here from Convex scenario records into a richer revenue input object.
- `src/engine/modules/revenue.ts:5` - `calculateRevenue` is present but currently delegates to `createStubSection("revenue", ...)` with a note that revenue math lands in Sprint 2.
- `src/engine/modules/helpers.ts:4` - the shared stub helper emits one scalar monthly array for all 36 periods, one scalar annual array for Years 1-3, and notes.
- `src/engine/orchestrator/calculate-scenario.ts:25` - the orchestrator already calls `calculateRevenue` in the global section assembly sequence.
- `src/engine/orchestrator/calculate-scenario.ts:56` - the top-level scenario summary is still hard-coded to zeros for revenue, gross margin, net income, max LOC, and DSCR, with only `endingCash` seeded from opening balances.
- `src/engine/schemas/output-schema.ts:24` - the typed section contract is currently `sectionKey`, aggregate `monthly`, aggregate `annual`, and `notes`; it does not define a typed line-level or override-attribution shape inside `sections.revenue`.
- `convex/engine.ts:6` - the Convex recalc action invokes `calculateScenario(createEmptyScenarioInput())`, returns `status: "stubbed"`, and does not read persisted revenue assumptions before calculating.
- `src/engine/modules/working-capital.ts:5` - working-capital math remains stubbed, so downstream cash collection and disbursement logic is not yet consuming revenue outputs.
- `src/engine/modules/income-statement.ts:5` - income statement assembly is also still stubbed, so later reporting layers do not yet derive from revenue calculations.
- `src/engine/modules/diagnostics.ts:4` - diagnostics currently return a single placeholder card instead of revenue-driven warnings such as low-margin cases.

### UI, snapshots, and parity scaffolding
- `src/app/app/businesses/[businessId]/scenarios/[scenarioId]/revenue/[view]/page.tsx:1` - the revenue route resolves `view` and renders `RoutePage` from static `revenueViewContent`; it does not load workspace data itself.
- `src/lib/route-content.ts:203` - the Year 1 and Years 2-3 revenue screens are represented as static preview content with example rows and descriptive notes.
- `src/components/workspace/route-page.tsx:32` - `RoutePage` is a generic presentational wrapper for text, preview tables, and notes rather than a data-bound editor surface.
- `src/components/layout/workspace-shell.tsx:79` - the workspace shell still labels calculation status as "Snapshot pipeline pending" and describes assumption-entry screens as later sprint work.
- `src/components/scenarios/scenario-overview-client.tsx:84` - the scenario overview continues to show "Revenue snapshot pending" and other placeholder reporting cards.
- `convex/schema.ts:381` - snapshot tables already exist for summary, monthly payloads, annual payloads, diagnostics, and ratios, and the monthly/annual payload columns are stored as `v.any()`.
- `convex/snapshots.ts:7` - snapshot read queries are live, but overview and diagnostics fall back to stubbed payloads when snapshot records are absent.
- `src/engine/parity/README.md:1` - the parity folder is reserved for workbook-derived fixtures and documents the planned fixture categories.
- `src/engine/parity/parity-tests.ts:1` - the current parity file only exports a required fixture-name list; no workbook-derived revenue fixture payloads or runner logic are present in `src/engine/parity/`.
- `package.json:5` - repository scripts currently cover development, build, lint, typecheck, Convex codegen, and a combined `check`, but there is no dedicated parity-test script in `package.json`.

## Code References
- `src/engine/modules/revenue.ts:5` - current revenue module entrypoint and stubbed section output.
- `src/engine/orchestrator/calculate-scenario.ts:25` - section assembly order and hard-coded summary values.
- `src/engine/schemas/input-schema.ts:53` - typed revenue line and override schemas.
- `src/engine/schemas/output-schema.ts:24` - current typed section payload contract.
- `convex/schema.ts:150` - persisted revenue tables and snapshot tables.
- `convex/assumptions.ts:20` - revenue workspace read and stubbed write surfaces.
- `convex/engine.ts:6` - current recalc action behavior.
- `src/app/app/businesses/[businessId]/scenarios/[scenarioId]/revenue/[view]/page.tsx:1` - current revenue route implementation.
- `src/engine/parity/parity-tests.ts:1` - current parity fixture registry.

## Historical Context
- `.documents/issues/current/AIF-7-revenue-engine-roll-forward-2026-03-19.md` - mirrored Linear issue defining revenue roll-forward, override, and parity targets.
- `.documents/.tickets/current/TICKET-1002-ship-revenue-engine-workbook-parity-2026-03-19.md` - execution ticket clarifying in-scope module, parity, and downstream readiness boundaries.
- `docs/progress.md:24` - sprint tracker showing engine foundation and revenue/payroll work as still in progress.

## Related Research
- `.documents/research/RSRCH-1001-repo-workflow-bootstrap-2026-03-18.md` - earlier repo-structure note that mapped the engine, Convex, and workflow directories at a repo-wide level.

## Open Questions
- Which runtime payload is intended to carry per-line revenue detail and override attribution, given that `src/engine/schemas/output-schema.ts:24` currently defines only aggregate monthly and annual arrays while `convex/schema.ts:387` stores snapshot payloads as untyped `payloadJson`?
- Where will workbook-derived revenue fixture data and its execution path live, given that `src/engine/parity/README.md:3` reserves the folder and `src/engine/parity/parity-tests.ts:1` names required fixtures, but no fixture files or runner entrypoints exist today?
