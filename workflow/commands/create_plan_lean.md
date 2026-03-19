---
description: Create a lean implementation plan for small, low-risk changes
model: codex-high
---

# Implementation Plan (Lean)

Use this prompt when the work is small, low-risk, or isolated, such as UI copy tweaks, a single Convex function change, or a focused route adjustment.

## When to Use
- Frontend-only or single-surface changes
- No broad schema migrations
- Clear entry points already exist in the ticket or research note

If the task spans multiple systems (for example Next.js + Convex + AI + billing) or still has unclear scope, stop and recommend `workflow/commands/create_plan.md`.

## Initial Response
1. If a ticket or plan path is provided, read it in full and start Step 1.
2. If no parameters are provided, request:
```
Share:
1. Ticket path or description
2. Research note path (if available)
3. Any known file pointers
```

## Step 1 - Minimal Context Pass
- Read the ticket and the latest research note if one exists.
- Read only the files explicitly referenced there.
- If no file pointers exist, find the smallest useful entry point with a quick search.
- Do not run broad multi-agent discovery unless the task stops being lean.

## Step 2 - Clarify (Only If Needed)
- Ask up to 3 short questions to resolve missing requirements.
- If answers are not required to proceed, state assumptions and continue.

## Step 3 - Draft the Plan
- Write the plan to `.documents/.plans/pending/PLAN-####-short-slug-YYYY-MM-DD.md`
- Keep the plan concise and avoid large templates.
- Cite only files you actually read.
- Include real repo commands such as `npm run convex:codegen`, `npm run lint`, `npm run typecheck`, and `npm run build` when relevant.

### Lean Template
````markdown
# [Feature/Task Name] Implementation Plan (Lean)

## Overview
[1-2 sentences]

## Inputs
- Ticket: `.documents/.tickets/...`
- Research: `.documents/research/...` or `none`

## Current State (Key References)
- `path:line` - what exists today

## Desired End State
- what should be true after implementation

## Scope
### In
- ...
### Out
- ...

## Implementation Steps
1. `path` - change
2. `path` - change

## Testing
- Automated: command(s)
- Manual: short scenario with expected outcome

## Risks / Notes
- risk, assumption, or follow-up

## References
- ticket path
- key files
````

## Guidelines
- Keep plans under roughly one page.
- Favor precise steps over exhaustive analysis.
- Include at least one automated and one manual verification step.
