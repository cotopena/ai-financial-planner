# create_ticket.md

You generate concise, engineer-ready tickets for the AI Financial Planner repo (Next.js App Router + Convex + Clerk + Stripe + OpenAI + shared TypeScript finance engine). Optimize for signal over volume with clarity first: tight scope, testable acceptance criteria, and minimal but useful links to code.

---

## Objectives

* Produce a short, specific, testable ticket that a senior engineer can pick up.
* Minimize context size: point to code by `path:line[-line]` instead of pasting large snippets.
* Keep the ticket aligned to the mirrored issue, research note, and current project docs.
* Save the ticket under `.documents/.tickets/` using the exact naming logic below.
* Preserve enough decisions and constraints that planning can proceed without guesswork.

---

## Before You Run
- Read `workflow/README.md` to align on the issue -> research -> ticket -> plan workflow.
- Consult `workflow/tooling.config.json` for search/read fallbacks, `.documents/.tickets/`, `.documents/issues/`, and `.documents/research/`.
- Example Codex CLI prompt: `Follow workflow/commands/create_ticket.md to draft a ticket for wizard step persistence using the latest mirrored issue and research note.`

---

## Input Sources (read minimally)

1. The user request in this conversation.
2. `.documents/issues/.latest` if it exists.
3. `.documents/research/.latest` if it exists.
4. `task-board.md` for the next priority items.
5. `plan.md` for project scope alignment.
6. `.documents/business-model.md` for product constraints.
7. `techstack-decisions.md` for stack constraints.
8. `docs/progress.md` for current implementation status.
9. Any files the user explicitly mentions.

If `.documents/business-model.md` is missing, proceed without it. If `.documents/issues/.latest` or `.documents/research/.latest` is missing, proceed with available context but note the missing artifact in `Assumptions` or `plan_blockers`.

Hard budget: keep the final ticket <= 2000 tokens. No code block > 15 lines.

---

## File Naming & ID Logic (must follow exactly)

* Ticket ID: `TICKET-####`
  * Read or initialize `.documents/.tickets/.counter`.
  * If present, `new_id = last + 1`. If missing, start at `1001`.
* Slug: kebab-case from the ticket title, <= 7 words, only `[a-z0-9-]`.
* Filename: `TICKET-####-slug-YYYY-MM-DD.md`
* Directory:
  * Default: `.documents/.tickets/current/`
  * Drafts: `.documents/.tickets/new/`
* After saving, update `.documents/.tickets/.latest` with the repository-relative path.

This ensures `create_plan.md` can locate the active ticket quickly.

---

## Process

1. Classify the work as `Feature | Bug | Chore | Spike`.
2. Draft a title that states the outcome, not the implementation.
3. Gather minimal context:
   * Identify touched surfaces across `src/app`, `src/components`, `src/lib`, `src/engine`, `convex`, `docs`, and supporting product docs.
   * Record up to 10 `path:line[-line]` pointers.
4. Draft the ticket using the template below.
5. Validate:
   * Scope is tight and out-of-scope is explicit.
   * Acceptance criteria are deterministic and verifiable.
   * `risk_level` is one of `low|medium|high`.
   * `plan_blockers` is `[]` when planning can proceed, otherwise list concrete blockers.
6. Save the ticket, update `.latest`, and return:
   * `Created: .documents/.tickets/<status>/TICKET-####-slug-YYYY-MM-DD.md`
7. If `Open Questions` is not `- None.`, immediately provide an open-question decision brief in plain language with options, pros/cons, and a recommendation.

---

## Plan Handoff Readiness (required)

Before finalizing the ticket, confirm:

* The ticket references the local issue mirror or explains why none exists.
* A research artifact exists or the ticket explicitly states why planning may proceed without one.
* Context pointers cover every in-scope surface.
* `plan_blockers` is empty before moving to planning.
* Rollout/rollback notes are concrete enough for implementation.
* Acceptance criteria map to real verification commands for this repo (`npm run convex:codegen`, `npm run lint`, `npm run typecheck`, `npm run build`, or narrower checks when appropriate).

---

## Ticket Template (use exactly this structure)

`---`
`id: TICKET-####`
`title: <Short outcome-based title>`
`type: Feature|Bug|Chore|Spike`
`priority: P0|P1|P2|P3`
`risk_level: low|medium|high`
`status: draft|current|done`
`owner: unassigned`
`created: YYYY-MM-DD`
`plan_blockers: []`
`labels: [area/..., component/..., breaking-change:no]`
`---`

`# Summary`
`1-2 sentences explaining the goal and who benefits.`

`## Problem / Goal`
`- Who is impacted`
`- Where it happens (module/service)`
`- Why this matters now`

`## Scope (In)`
`- Concrete items to deliver (3-7 bullets)`

`## Out of Scope`
`- Items explicitly excluded (2-6 bullets)`

`## Context Pointers`
``- `path/to/file.ext:123-160` -- reason/behavior to change``
``- `convex/schema.ts:20-44` -- data model reference``
`<!-- max 10 pointers; do not inline code -->`

`## Acceptance Criteria (testable)`
`- **Scenario:** brief name`
  `- **Verification:** Automated|Manual`
  `- **Given** current state`
  `- **When** action occurs`
  `- **Then** observable outcome`

`## Deliverables`
`- [ ] Code updated in <module(s)>`
`- [ ] Convex schema/functions updated (if applicable)`
`- [ ] Docs updated (<doc path>)`
`- [ ] Telemetry/metrics/alerts defined`

`## Verification Commands`
`- [ ] npm run convex:codegen`
`- [ ] npm run lint`
`- [ ] npm run typecheck`
`- [ ] npm run build`
`- [ ] <scope-specific command(s)>`
`- [ ] <manual verification note(s)>`

`## Non-Functional Requirements`
`- Performance/SLO`
`- Security/Privacy constraints`
`- Backward compatibility / migration`

`## Access Semantics (auth/permissions tickets only)`
`- Unauthenticated behavior`
`- Authenticated but unauthorized behavior`
`- Not-found behavior only when explicitly intended`

`## Dependencies & Impact`
`- Services/flags/env vars affected`
`- Include auth/session, billing, AI, routing, and data model impacts when applicable`
`- Rollout/rollback considerations`

`## Decisions (resolved)`
`- Approved decisions that constrain implementation`

`## Open Questions (keep <= 4)`
`- Short, decision-seeking questions only`

`## Assumptions (keep <= 4)`
`- Preconditions believed true that affect scope`

`## Definition of Done`
`- [ ] All Acceptance Criteria pass`
`- [ ] Unit/Integration tests added or updated when appropriate`
`- [ ] Lint/typecheck/build verification is green`
`- [ ] Manual verification evidence is recorded`
`- [ ] Follow-up work is captured if scope changed`

---

## Style & Brevity Rules

* Prefer bullets and short paragraphs.
* Replace prose with checklists where possible.
* Do not inline code unless absolutely necessary.
* Use precise nouns and observable outcomes.
* Avoid vague verbs like “should” or “maybe” inside acceptance criteria.
* Accuracy beats brevity when they conflict.

---

## Example (abbreviated)

Title: “Persist wizard step state across reloads”

* Type: Feature, Priority: P1
* Context Pointers:
  * `src/app/app/businesses/[businessId]/scenarios/[scenarioId]/wizard/[step]/page.tsx:1-80` -- wizard route scaffold
  * `convex/ai.ts:1-70` -- AI suggestion and approval surface
  * `src/lib/route-data.ts:32-42` -- wizard step definitions
* Acceptance Criteria:
  * Given a user saves data in step 3, when they refresh, then the saved values reappear.
  * Given a partially completed wizard, when the user returns later, then progress resumes on the correct step.

Saved as: `.documents/.tickets/current/TICKET-1452-persist-wizard-step-state-2026-03-18.md`

---

## Handoff to Planning

`workflow/commands/create_plan.md` reads the ticket from `.documents/.tickets/current/`. Ensure:

* Frontmatter is complete.
* Acceptance criteria are observable and unambiguous.
* Scope and out-of-scope prevent creep.
* `risk_level` and `plan_blockers` are present and valid.
* The ticket references the relevant issue mirror and research note when available.

---

## Final Self-Check (must pass)

Before finishing, verify:

* Template sections are present and in order.
* Scope and out-of-scope are tight and non-overlapping.
* Acceptance criteria count is between 3 and 7 scenarios.
* `Dependencies & Impact` includes concrete operational details for in-scope systems.
* File naming/id logic and `.latest` update are correct.
* Ticket lints cleanly with `bash workflow/scripts/lint-ticket.sh <ticket-path>`.
