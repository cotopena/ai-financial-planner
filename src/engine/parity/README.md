# Parity Fixtures

This folder is reserved for workbook-derived parity fixtures.

Implemented revenue fixture set for `npm run parity:revenue`:

- `revenue-startup-no-debt` - Year 1 monthly compounding with aggregate sales compatibility
- `revenue-ongoing-opening-balances` - Year 2 and Year 3 roll-forward from the prior-year ending month
- `revenue-sales-override-precedence` - metric-level override precedence and traceability
- `revenue-low-margin-windowed` - inactive month gating with a low-margin line

Future parity backlog from the implementation PRD still includes broader cash, debt, and statement scenarios once those engine modules are implemented.
