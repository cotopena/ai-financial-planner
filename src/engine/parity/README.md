# Parity Fixtures

This folder is reserved for workbook-derived parity fixtures.

Implemented revenue fixture set for `npm run parity:revenue`:

- `revenue-startup-no-debt` - Year 1 monthly compounding with aggregate sales compatibility
- `revenue-ongoing-opening-balances` - Year 2 and Year 3 roll-forward from the prior-year ending month
- `revenue-sales-override-precedence` - metric-level override precedence and traceability
- `revenue-low-margin-windowed` - inactive month gating with a low-margin line

Implemented foundation fixture set for `npm run parity:foundation`:

- `foundation-startup-no-debt` - balanced opening funding, land exclusion, and straight-line foundation schedules
- `foundation-startup-multiple-debt` - multi-debt amortization with a payment override and Year 2 CapEx fallback timing
- `foundation-ongoing-opening-balances` - ongoing-business opening cash position plus persisted depreciation and amortization

Future parity backlog from the implementation PRD still includes broader payroll, working-capital, cash-flow, statement, and ratio scenarios once those engine modules are implemented.
