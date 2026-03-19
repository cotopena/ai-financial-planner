---
issue_key: AIF-7
title: S2: Implement the revenue engine, overrides, and Year 1 to Years 2-3 roll-forward
source: Linear
source_url: https://linear.app/gus-projects/issue/AIF-7/s2-implement-the-revenue-engine-overrides-and-year-1-to-years-2-3-roll
status: todo
priority: P1
owner: unassigned
created: 2026-03-19
labels: [area/engine, component/revenue]
linked_ticket: TICKET-1002
linked_plan: none
---

# Summary
Implement the deterministic revenue engine so the app can calculate monthly and annual revenue, COGS, and margin outputs from persisted scenario assumptions. This is the next queued engine task after the active Sprint 1 foundation work.

## Original Request
- Implement revenue-line modeling, Year 1 monthly calculations, quarterly growth behavior, and Years 2-3 roll-forward logic.
- Support line-level overrides and COGS calculations aligned to workbook parity.
- Produce traceable monthly and annual revenue, COGS, and gross-margin outputs by line and in total.

## Acceptance Signals
- Revenue outputs match workbook fixtures within the PRD tolerance.
- Year 2 and Year 3 start points roll correctly from prior-year outputs.
- Override behavior is persisted and traceable per the PRD model.

## Constraints
- Source issue lives under Sprint 2 and is queued behind the active Sprint 1 engine-foundation work.
- The workbook remains the parity oracle; the product must not run Excel directly.
- Existing revenue schema and route structure already exist and should be used rather than replaced.

## Linked Context
- `docs/Implementation PRD - AI Financial Planner (v1).md`
- `docs/MVP PRD — AI Financial Planner (v1).md`
- `docs/progress.md`

## Notes
- Linear currently marks this issue as `Todo` with `High` priority.
- No additional implementation detail was added here beyond the source issue and project docs.
