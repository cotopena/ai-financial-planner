---
id: TICKET-1002
title: Ship revenue engine workbook parity
type: Feature
priority: P1
risk_level: medium
status: current
owner: unassigned
created: 2026-03-19
plan_blockers: []
labels: [area/engine, component/revenue, breaking-change:no]
---

# Summary
Implement the deterministic revenue module so scenario calculations produce workbook-aligned Year 1 and Years 2-3 revenue, COGS, and margin outputs. This is the next queued engineering ticket after the active Sprint 1 foundation work because downstream cash flow, reporting, and diagnostics all depend on it.

## Problem / Goal
- Who is impacted: engineers working through the engine roadmap and users waiting on real financial outputs.
- Where it happens (module/service): `src/engine/modules/revenue.ts`, engine orchestration, parity fixtures, and revenue assumption surfaces.
- Why this matters now: the revenue module is still stubbed, which keeps scenario summaries at placeholder values and blocks later engine and reporting tickets.

## Scope (In)
- Replace the stubbed revenue section with deterministic monthly calculations for units, sales, COGS, and margin by line and in total.
- Implement Year 1 monthly growth compounding and Years 2-3 monthly roll-forward behavior from the prior-year ending month.
- Apply revenue overrides using the PRD precedence rules and keep affected outputs traceable by line, month, and metric.
- Keep the engine aligned to the existing `RevenueLineSchema`, `RevenueOverrideSchema`, and Convex table model.
- Add workbook-derived parity fixture coverage for the core revenue cases needed to validate revenue and COGS tolerance.
- Leave downstream engine consumers ready to read the new revenue outputs without introducing new placeholder shapes.

## Out of Scope
- Payroll calculations and payroll parity coverage.
- Revenue workspace editing UI, save-state UX, and override badges in the app shell.
- AI-driven revenue suggestions, COGS helper UX, or wizard step behavior.
- Snapshot persistence, overview/reporting screens, and diagnostics rendering.
- Reworking the existing `revenue_lines` or `revenue_overrides` table design unless a compatibility-safe addition is required.

## Context Pointers
- `docs/Implementation PRD - AI Financial Planner (v1).md:293-317` -- Year 1 and Years 2-3 revenue screen contract.
- `docs/Implementation PRD - AI Financial Planner (v1).md:647-670` -- revenue rules and override precedence.
- `docs/Implementation PRD - AI Financial Planner (v1).md:1548-1569` -- revenue module contract and calculation order.
- `docs/progress.md:24-25` -- current Sprint 1 and Sprint 2 status.
- `src/engine/modules/revenue.ts:1-12` -- current stubbed module.
- `src/engine/orchestrator/calculate-scenario.ts:25-64` -- revenue is part of the global engine output.
- `src/engine/schemas/input-schema.ts:53-78` -- revenue line and override schemas.
- `convex/schema.ts:150-182` -- persisted revenue tables and indexes.
- `convex/assumptions.ts:52-64` -- revenue workspace read surface.
- `src/engine/parity/parity-tests.ts:1-11` -- current parity fixture registry.

## Acceptance Criteria (testable)
- **Scenario:** Year 1 monthly revenue outputs are generated
  - **Verification:** Automated
  - **Given** a scenario with active revenue lines, driver values, and quarterly growth rates
  - **When** the engine calculates the scenario
  - **Then** the revenue section returns monthly units, sales, COGS, and margin outputs for months 1 through 12 by line and in total.
- **Scenario:** Years 2-3 roll-forward starts from prior-year outputs
  - **Verification:** Automated
  - **Given** non-zero Year 1 ending values and Year 2 and Year 3 monthly growth rates
  - **When** the engine calculates months 13 through 36
  - **Then** each new year starts from the prior-year ending month and exposes correct monthly and annual totals.
- **Scenario:** Revenue overrides take precedence and remain traceable
  - **Verification:** Automated
  - **Given** a persisted revenue override for a line, month, and metric
  - **When** the engine calculates the scenario
  - **Then** the override wins according to the PRD rules, inactive months stay excluded, and the affected output can be attributed to the override input.
- **Scenario:** Revenue parity fixtures guard workbook alignment
  - **Verification:** Automated
  - **Given** workbook-derived controlled revenue fixtures
  - **When** the parity checks are executed
  - **Then** revenue and COGS outputs stay within the agreed tolerance and fixture failures identify the drifting case.

## Deliverables
- [ ] Code updated in `src/engine/modules/revenue.ts`, engine helpers, and related parity files
- [ ] Convex schema/functions updated (if applicable)
- [ ] Docs updated (`docs/progress.md` and any revenue parity notes if implementation evidence changes)
- [ ] Telemetry/metrics/alerts defined

## Verification Commands
- [ ] npm run convex:codegen
- [ ] npm run lint
- [ ] npm run typecheck
- [ ] npm run build
- [ ] Manual verification: compare controlled revenue fixture outputs against workbook-derived expectations for revenue and COGS.

## Non-Functional Requirements
- Performance/SLO: revenue calculations remain deterministic across the full 36-month axis and stay efficient for the MVP cap of 12 active revenue lines.
- Security/Privacy constraints: no auth, billing, or AI mutation behavior changes are introduced by this ticket.
- Backward compatibility / migration: preserve compatibility with the existing `revenue_lines` and `revenue_overrides` table model and avoid destructive data migration.

## Access Semantics (auth/permissions tickets only)
- Unauthenticated behavior: not applicable; no public or auth route behavior changes.
- Authenticated but unauthorized behavior: no change; existing scenario ownership checks remain the guardrail on revenue data access.
- Not-found behavior only when explicitly intended: no change.

## Dependencies & Impact
- Services/flags/env vars affected: shared TypeScript engine, parity fixtures, and existing Convex revenue data surfaces; no new env vars are required.
- Include auth/session, billing, AI, routing, and data model impacts when applicable: auth/session unchanged; billing unchanged; AI suggestion flows remain later work; routing unchanged; data model stays anchored to `revenue_lines` and `revenue_overrides`.
- Rollout/rollback considerations: rollout is additive behind current engine stubs; rollback is reverting revenue-engine and parity-fixture changes without schema rollback if no table shape changes land.

## Decisions (resolved)
- Treat the workbook as the parity oracle and keep revenue logic deterministic in shared TypeScript.
- Preserve the workbook split between Year 1 monthly detail and Years 2-3 roll-forward behavior.
- Follow the PRD override precedence rules rather than inventing a UI-driven override model in this ticket.
- Keep this ticket focused on engine and parity behavior, not on the revenue editing UI.

## Open Questions (keep <= 4)
- None.

## Assumptions (keep <= 4)
- Local issue mirror exists at `.documents/issues/current/AIF-7-revenue-engine-roll-forward-2026-03-19.md`.
- No issue-specific research note exists yet; planning can proceed from the PRDs, `docs/progress.md`, and the current stubbed revenue surfaces.
- Sprint 1 foundation work completes before implementation starts on this ticket.
- Workbook-derived fixture data can be added under `src/engine/parity/` without affecting runtime behavior.

## Definition of Done
- [ ] All Acceptance Criteria pass
- [ ] Unit/Integration tests added or updated when appropriate
- [ ] Lint/typecheck/build verification is green
- [ ] Manual verification evidence is recorded
- [ ] Follow-up work is captured if scope changed
