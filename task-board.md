# AI Financial Planner Task Board

## AFP-001: Workbook parity foundation
Description:
- [ ] Finish deterministic engine parity against the workbook reference.
- [ ] Persist scenario snapshots from real recalculation outputs.

Acceptance Criteria:
- [ ] Core engine modules produce stable 36-month outputs from saved assumptions.
- [ ] Snapshot reads are backed by real engine data instead of placeholders.
- [ ] Parity checks document tolerances and known exceptions.

## AFP-002: AI wizard onboarding
Description:
- [ ] Replace scaffold wizard steps with a real interview flow.
- [ ] Let AI help estimate unknown values without silently writing changes.

Acceptance Criteria:
- [ ] Users can move through the wizard and save a viable base scenario.
- [ ] AI suggestions remain reviewable before assumptions change.
- [ ] Wizard progress is resilient to reloads and partial completion.

## AFP-003: Assumption workspace completion
Description:
- [ ] Turn scaffold screens into editable assumption workflows.
- [ ] Keep the workspace shell and navigation aligned to the PRD route map.

Acceptance Criteria:
- [ ] Setup, opening funding, revenue, payroll, expenses, and cash screens save end to end.
- [ ] Saved values are visible after refresh and recalculation.
- [ ] Validation messages are clear and screen-specific.

## AFP-004: Reporting and diagnostics
Description:
- [ ] Connect overview, statements, ratios, and diagnostics to persisted scenario snapshots.
- [ ] Present explainable financial outputs instead of placeholder values.

Acceptance Criteria:
- [ ] Overview shows real KPI summaries from snapshots.
- [ ] Statement routes render real income statement and balance sheet data.
- [ ] Diagnostics explain detected issues using current scenario outputs.

## AFP-005: Contextual AI assistant
Description:
- [ ] Replace assistant placeholders with contextual responses and structured suggestions.
- [ ] Support approval and rejection flows with audit-friendly records.

Acceptance Criteria:
- [ ] AI assistant responds from the current screen context.
- [ ] Suggested changes preview the impact before approval.
- [ ] Approved and rejected suggestions are recorded with status history.

## AFP-006: Actuals imports, exports, and billing enforcement
Description:
- [ ] Ship CSV/manual actuals workflows, exports, and real billing enforcement.
- [ ] Replace billing stubs with Stripe-backed behavior.

Acceptance Criteria:
- [ ] Actuals import supports mapping, validation, and apply flows.
- [ ] PDF and CSV export routes generate real output artifacts.
- [ ] Billing status gates AI usage and paid plan limits correctly.

## AFP-007: Hardening and beta readiness
Description:
- [ ] Close accessibility, performance, legal, analytics, and QA gaps.
- [ ] Stabilize the app for external beta testing.

Acceptance Criteria:
- [ ] Core routes pass agreed accessibility and regression checks.
- [ ] Legal and disclaimer copy is present on required surfaces.
- [ ] Beta checklist is complete and documented.
