---
description: Diagnose validation failures by inspecting code, logs, data, and browser output
model: codex-high
---

# Debug

Use this command when manual verification or validation uncovers a bug after implementation. Gather evidence without editing source files so you can open a focused follow-up fix or plan.

## Before You Run
- Re-read `workflow/README.md` to align on repo layout and the validate -> commit order.
- Consult `workflow/tooling.config.json` for key paths (`src/app`, `src/engine`, `convex`, `.documents/.plans/...`, `.documents/research/...`, `.documents/prs/...`).
- Use browser MCP for browser-only failures and note which tool captured the evidence.

## Step 1 – Capture Context
1. Ask the user for:
   - plan and ticket references
   - exact failing step
   - expected versus actual result
   - when it last worked
2. Read the relevant plan phase and ticket acceptance criteria.
3. Create a short checklist of hypotheses or components to inspect.

## Step 2 – Reproduce the Issue
1. Re-run the failing flow and capture outputs:
   - app: `npm run dev`
   - Convex: `npm run dev:convex`
2. For browser flows:
   - reproduce in browser MCP
   - collect console, network, and screenshot evidence
3. If seed data is required, use the documented setup only and log what was run.

## Step 3 – Inspect the Environment
- `git status`
- `git log --oneline -n 5`
- `git diff`
- relevant app or Convex logs
- read-only `npx convex run <queryFunction>` checks when the plan provides them
- inspect env/config usage in `next.config.ts`, `proxy.ts`, `.env.example`, or related files

## Step 4 – Summarize Findings
Produce a concise report:

```markdown
## Debug Report -- <short title>

### Scenario
- Plan: `.documents/.plans/current_plan/PLAN-...`
- Manual step: "..."
- Expected: ...
- Actual: ...

### Evidence
- `path:line` -- relevant code or log reference
- Browser evidence: screenshot or console summary

### Hypothesis
- ...

### Next Actions
1. ...
2. ...
```

## Step 5 – Archive & Share
1. Save the final report to `.documents/thoughts/debug/DBG-YYYYMMDD-ss-<slug>.md`.
2. Update `.documents/thoughts/debug/.latest` with the repository-relative path.
3. Link that debug file in any follow-up ticket, plan, or PR.

## Guardrails & Tips
- Stay in investigative mode; do not edit source files.
- Prefer concrete evidence over speculation.
- If you uncover a new bug, suggest opening a follow-up ticket linked to the debug note.
