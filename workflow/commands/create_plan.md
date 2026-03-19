---
description: Create detailed implementation plans through research and iteration
model: codex-high
---

# Implementation Plan

Produce high-fidelity implementation plans for AI Financial Planner. Plans must be research-driven, collaborative, and specific enough for execution agents to follow without guessing.

## Before You Run
- Read `workflow/README.md` for the full issue -> research -> ticket -> plan -> implementation workflow.
- Open `workflow/tooling.config.json` to confirm `.documents/issues/`, `.documents/research/`, `.documents/.tickets/`, `.documents/.plans/pending/`, and the repo code roots.
- Example Codex CLI prompt: `Use workflow/commands/create_plan.md with .documents/.tickets/current/TICKET-1234-persist-wizard-state-2026-03-18.md and the latest research note.`

## Initial Response

When invoked:

1. If a ticket path is provided, read it in full and start Step 1.
2. If no parameters are provided, respond with:
```
I'll help you create a detailed implementation plan. Please share:
1. The ticket path or description
2. The related research note path (or confirm `.documents/research/.latest`)
3. Any extra constraints
```
Then wait for input.

## Step 1 – Context Gathering & Initial Analysis

1. Read all directly relevant files in full:
   - Current ticket in `.documents/.tickets/current/`
   - Mirrored issue from `.documents/issues/.latest` when available
   - Research note from `.documents/research/.latest` or user-provided path
   - Supporting docs: `task-board.md`, `plan.md`, `.documents/business-model.md`, `techstack-decisions.md`, `docs/progress.md`, and any cited PRDs or code files
2. Extract ticket controls:
   - `risk_level`
   - `plan_blockers`
   - If `plan_blockers` is non-empty, stop with:
```
Planning blocked by ticket plan_blockers:
- <blocker 1>
- <blocker 2>
Resolve blockers in the ticket before running create_plan.md.
```
3. Fail fast if no research artifact exists:
   - If the ticket does not reference research and `.documents/research/.latest` is empty, stop and tell the user to run `research_codebase.md` first.
4. Spawn initial research tasks before asking questions:
   - `workflow/agents/codebase-locator.md` for relevant files under `src/app`, `src/components`, `src/lib`, `src/engine`, `convex`, and `docs`
   - `workflow/agents/codebase-analyzer.md` for current route, data, AI, billing, and engine behavior
   - `workflow/agents/codebase-pattern-finder.md` for similar implementations already in the repo
5. Read the cited files yourself after those agents return.
6. Create a TodoWrite list summarizing research tasks and keep it updated.
7. Synthesize understanding and questions for the user. Ask only what you cannot resolve from code or docs.

## Step 2 – Deeper Research & Option Framing

1. Verify any user answers against the codebase or saved research docs.
2. Expand TodoWrite with new threads when needed.
3. Spawn focused follow-up tasks if needed:
   - wizard state persistence
   - scenario snapshot generation
   - assumption save flows
   - billing and AI gating
   - export/import surfaces
4. Wait for all tasks before synthesizing.
5. Present:
```
Current State:
- ...

Design Options:
1. Option A
   Pros: ...
   Cons: ...
2. Option B
   Pros: ...
   Cons: ...

Recommendation: ...
Open Questions: ...
```
Confirm the chosen approach before writing the plan.

## Step 3 – Plan Structure Alignment

1. Propose a structure:
```
## Overview
<1-2 sentences>

## Phases
1. Phase name - outcome
2. Phase name - outcome
3. ...
```
2. Get approval or edits before writing details.

## Step 4 – Write the Detailed Plan

1. Filename and location:
   - `.documents/.plans/pending/PLAN-####-short-slug-YYYY-MM-DD.md`
2. Depth by ticket risk:
   - `low`: 1-2 focused phases
   - `medium`: 2-4 phases with explicit integration and verification coverage
   - `high`: include dedicated rollback and risk-mitigation coverage
3. Use this template:

````markdown
# [Feature/Task Name] Implementation Plan

## Overview
[brief purpose + value]

## Inputs
- Issue: `.documents/issues/...` or `none`
- Ticket: `.documents/.tickets/...`
- Research: `.documents/research/...`

## Current State Analysis
- `src/app/...:line` - existing behavior
- `src/engine/...:line` - model behavior
- `convex/...:line` - query/mutation/schema behavior
- `docs/...` or PRD references - constraints

## Desired End State
- Functional outcome
- Data/storage expectations
- AI, billing, auth, or export expectations when in scope

## Key Discoveries
- [finding + file:line]

## What We're NOT Doing
- explicit deferred work

## Implementation Approach
- chosen strategy and why

## Phase 1 - [Name]
### Goal
[why this phase exists]
### Implementation Steps
1. `path` - change
2. `path` - change
### Acceptance Criteria
#### Automated
- [ ] `npm run convex:codegen`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Any scope-specific command
#### Manual
- [ ] Describe the exact UI or data flow to verify
### Assets / Docs
- related docs or notes

## Phase 2 - ...

## Testing Strategy
- Unit / module-level
- Integration / end-to-end
- Manual checklist

## Performance / Security / Migration Notes
- env, auth, billing, AI, or data concerns

## References
- issue path
- ticket path
- research path
- similar code examples
````

4. No unresolved open questions may remain in the final plan.

## Step 5 – Review & Hand-off

1. Share the saved plan path and any items needing approval.
2. Once approved, move the plan to `.documents/.plans/current_plan/` and update the ticket with the plan location.
3. Keep TodoWrite updated or close it out.

## Ongoing Guidelines

- Be skeptical: verify assumptions against actual routes, engine modules, Convex functions, and env-driven behavior.
- Be interactive: pause for feedback after summaries, options, and structure proposals.
- Be practical: favor incremental phases, real commands, and rollback-friendly steps.
- Track progress: TodoWrite is required for non-trivial planning work.
- Fail fast when blockers or missing research would make the plan speculative.
