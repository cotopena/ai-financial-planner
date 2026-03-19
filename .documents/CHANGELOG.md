# Changelog

All notable changes to AI Financial Planner are documented here.
Entries follow Keep a Changelog conventions with project-specific beta version headers.
Dates use `YYYY-MM-DD` and newest entries belong at the top.

## AI Financial Planner Beta 0.1 -- 2026-03-19

### Added
- Added deterministic revenue workbook parity coverage for `AIF-7` / `TICKET-1002`, including a dedicated `npm run parity:revenue` runner and controlled fixtures for Year 1 compounding, Years 2-3 roll-forward, override precedence, and inactive low-margin cases.

### Changed
- Replaced stubbed revenue calculations with real 36-month line-level and total revenue, COGS, and margin outputs, plus Convex recalc wiring that reads persisted scenario revenue assumptions.

### Docs
- Archived the PR description and verification evidence for `PLAN-1002` under `.documents/prs/`.
