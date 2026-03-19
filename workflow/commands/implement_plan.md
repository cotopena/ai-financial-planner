---
description: Execute validated plans with continuous verification and communication
model: codex-high
---

# Implement Plan

Translate validated plans into working code for AI Financial Planner. Follow the approved plan step by step, communicate progress, and keep artifacts tidy.

## Before You Run
- Re-read `workflow/README.md` so you follow the documented order from plan recap -> implementation -> manual verification -> validation -> commit.
- Inspect `workflow/tooling.config.json` to confirm the current plan directory, related ticket roots, and key code roots.
- Example Codex CLI prompt: `Run workflow/commands/implement_plan.md to implement .documents/.plans/current_plan/PLAN-1001-persist-wizard-state-2026-03-18.md.`

## Initial Response

When invoked:
1. Confirm you have the validated plan path and linked ticket.
2. Reply with:
```
I'll implement PLAN-####-slug.md. I'll restate the scope and checks before coding.
```

## Step 1 – Reconfirm Scope & Refresh Research

1. Read the plan, linked ticket, linked issue mirror, and linked research note fully.
2. Re-open all referenced files so you know their current state.
3. Re-run targeted research if anything is unfamiliar.
4. Summarize:
```
Plan: PLAN-1234-...
Phases:
- Phase 1 - ...
- Phase 2 - ...
Checks: npm run convex:codegen, npm run lint, npm run typecheck, npm run build, ...
Questions: ...
```
Resolve open questions before editing files.

## Step 2 – Execute Phase by Phase

For each phase:
1. Restate the phase goal and files to touch.
2. Implement the work in small, scoped edits.
3. Run required commands early and often, such as:
   - `npm run convex:codegen`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
   - `npm run dev:convex` if the plan calls for live Convex validation
4. If you must deviate from the plan, update the plan or ticket with rationale.
5. Share interim summaries before moving to the next phase.
6. Run every automated verification listed in the plan unless impossible.

## Step 3 – Automated Verification Before Manual Checks

1. Run every automated check from the plan.
2. Share status with the user:
```
Phase 1 - Complete ✅
Phase 2 - Complete ✅
Checks: convex:codegen ✅ | lint ✅ | typecheck ✅ | build ✅
```
3. Update the plan file checkboxes for automated criteria with pass, fail, or blocked notes.

Manual verification happens in a separate session via `manual_verification.md`.

## Step 4 – Handoff & Documentation

1. After manual verification passes, follow `workflow/commands/commit.md`.
2. Update the plan file:
   - mark phase checkboxes complete
   - record automated verification results
   - note deviations or follow-ups
3. Update the ticket with validation evidence, plan location, and outstanding items.

## Guardrails & Best Practices

- Keep changes tightly scoped; large refactors need a new plan.
- Do not change secrets or external account settings without explicit instruction.
- Respect AI approval-first behavior when touching suggestion flows.
- Document data migrations or snapshot/backfill logic so they are reproducible.
- Ask for guidance when the live repo diverges from the approved plan.
