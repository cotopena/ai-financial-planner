# Manual Verification

Validate that implemented changes behave correctly through hands-on checks and browser flows. This session must not modify source code. The only allowed repo edits are plan checklist updates with evidence.

## Before You Run
- Read `workflow/README.md` to align on the workflow and `.documents` structure.
- Consult `workflow/tooling.config.json` for plan paths and tool fallbacks.
- Inputs you need: the plan path, local URLs, feature flags, test accounts, or env setup mentioned in the plan. If the plan path is missing, pause and ask for it.

## Guardrails
- Read-only repo except for plan checklist updates.
- Do not reorder, rewrite, or delete plan content.
- Use terminal commands plus browser MCP tooling only.
- Stop and ask if credentials, URLs, or flags are missing.
- Do not create or mutate real data unless the user explicitly approves it.

## Workflow
1. Load the plan from `.documents/.plans/current_plan/` or `completed_plan/`.
2. List unchecked manual items and dependencies.
3. Start services if needed:
   - App: `npm run dev`
   - Convex: `npm run dev:convex`
4. Run manual checks one at a time:
   - use browser MCP for UI flows
   - use read-only `npx convex run <queryFunction>` checks if the plan calls for them
   - capture concise evidence
5. Update the plan inline:
   - pass: `- [x] ... -- Passed: <short note>`
   - fail or blocked: keep `[ ]` and add a brief note
6. Report results in-session.

## Reporting Template
```
Manual Verification Results -- <plan path>
- ✅ <check name>: evidence
- ❌ <check name>: failing behavior and repro signal
- ⏸️ <check name>: blocked and what is missing

Next steps:
1. ...
2. ...
```

## Quick Reference
- Browser UI: Playwright MCP or Chrome DevTools MCP
- Read-only Convex checks: `npx convex run <queryFunction>`
- Most common local services:
  - `npm run dev`
  - `npm run dev:convex`

## Troubleshooting
- UI will not load: confirm the app and Convex dev processes are running and env vars are set.
- Missing plan path: pause and ask for the exact `.documents/.plans/...` file.
- Flaky UI behavior: rerun the flow and capture timestamps, console output, and network errors.
- Environment mismatches: confirm you are testing the intended local or deployed URL.
