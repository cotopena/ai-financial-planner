---
id: TICKET-1001
title: Bootstrap AI planner workflow
type: Chore
priority: P1
risk_level: medium
status: current
owner: unassigned
created: 2026-03-18
plan_blockers: []
labels: [area/workflow, area/docs, component/prompts, component/repo-scaffold, breaking-change:no]
---

# Summary
Bootstrap the reusable repo workflow for AI Financial Planner so local issue sync, research, planning, implementation, and validation can run inside this repo without QuoteNclose-specific assumptions.

## Problem / Goal
- Who is impacted: engineers using Codex/CLI workflows in this repo.
- Where it happens (module/service): missing `workflow/` and `.documents/` scaffolding.
- Why this matters now: the repo has product code and PRDs, but no repo-local issue mirror, research tracker, plan flow, or sub-agent prompt system.

## Scope (In)
- Add `workflow/README.md` and `workflow/tooling.config.json` tailored to this repo's directories, scripts, and docs.
- Port the existing command set from the QuoteNclose template into `workflow/commands/` with AI Financial Planner context.
- Port the existing agent prompts into `workflow/agents/` while preserving the current child-agent division of labor.
- Preserve the workflow order: Linear issue -> local issue file -> codebase research -> evidence-backed plan -> implementation -> manual verification -> validate/ship.
- Preserve ticket creation, plan creation, research, and manual verification flows, including explicit sub-agent spawning guidance.
- Bootstrap `.documents/` tracking folders for tickets, plans, and research, including `.counter` and `.latest` mechanics where needed.
- Add a repo-local place to mirror external issue context before planning starts.
- Create repo-specific support docs needed by the workflow, using existing PRDs and `docs/progress.md` as source material.
- Update any copied lint or validation scripts so they point at this repo's prompt and docs layout.

## Out of Scope
- Implementing new product features in the financial planner app.
- Reworking the finance engine, Convex schema, auth, billing, or AI behavior.
- Replacing the locked MVP or Implementation PRDs with new product strategy.
- Automating workflow generation across multiple repos from one shared package.
- Replacing Linear as the external system of record for issue tracking.
- Changing the existing command naming convention unless adaptation is required for correctness.

## Context Pointers
- `README.md:1-48` -- repo stack, setup, verification commands, and external services.
- `package.json:5-39` -- actual scripts and dependency surfaces prompts must reference.
- `docs/progress.md:7-31` -- current phase and sprint tracking that can seed task-board and plan docs.
- `Implementation PRD - AI Financial Planner (v1).md:14-38` -- locked implementation assumptions and stack.
- `Implementation PRD - AI Financial Planner (v1).md:53-126` -- route map and preferred Convex function surface.
- `MVP PRD — AI Financial Planner (v1).md:51-99` -- product direction and AI approval constraints.
- `src/lib/route-data.ts:9-75` -- current app and workspace navigation tree.
- `src/components/layout/workspace-shell.tsx:31-212` -- active workspace shell and persistent AI panel context.
- `src/engine/orchestrator/calculate-scenario.ts:25-65` -- deterministic finance engine orchestration to reference in research prompts.
- `convex/schema.ts:46-260` -- core data model surfaces the workflow must treat as first-class code areas.
<!-- max 10 pointers; do not inline code -->

## Acceptance Criteria (testable)
- **Scenario:** Workflow scaffold exists in repo
  - **Verification:** Manual
  - **Given** the AI Financial Planner repository root
  - **When** an engineer lists `workflow/` and `.documents/`
  - **Then** the repo contains commands, agents, and ticket/plan tracking directories without QuoteNclose-only placeholders.
- **Scenario:** Ticket command is repo-specific
  - **Verification:** Manual
  - **Given** `workflow/commands/create_ticket.md`
  - **When** it is reviewed
  - **Then** it references AI Financial Planner docs, code areas, scripts, and business context rather than roofing quote workflows.
- **Scenario:** Planning commands preserve child-agent structure
  - **Verification:** Manual
  - **Given** `workflow/commands/create_plan.md` and `workflow/commands/research_codebase.md`
  - **When** they are reviewed
  - **Then** they still instruct Codex to use the repo's locator, analyzer, and pattern-finder agents and describe AI Financial Planner code surfaces correctly.
- **Scenario:** Research tracker bootstraps correctly
  - **Verification:** Automated
  - **Given** a fresh repo with no prior workflow state
  - **When** the workflow scaffold is created
  - **Then** `.documents/research/` exists with a `.latest` tracker so research artifacts can be recorded before planning begins.
- **Scenario:** Ticket and plan trackers bootstrap correctly
  - **Verification:** Automated
  - **Given** a fresh repo with no prior workflow state
  - **When** the first ticket is created
  - **Then** `.documents/.tickets/.counter`, `.documents/.tickets/.latest`, and the tickets/plans directory tree exist with deterministic paths and IDs starting at `TICKET-1001`.
- **Scenario:** Workflow verification uses real repo commands
  - **Verification:** Automated
  - **Given** the copied workflow scripts and docs
  - **When** lint and validation instructions are executed
  - **Then** they use this repo's real commands such as `npm run lint`, `npm run typecheck`, `npm run build`, and the repo-local prompt lint scripts.

## Deliverables
- [ ] Code updated in `workflow/commands`, `workflow/agents`, and `workflow/scripts`
- [ ] Convex schema/functions updated (if applicable)
- [ ] Docs updated (`workflow/README.md`, `task-board.md`, `plan.md`, `techstack-decisions.md`, `.documents/business-model.md`, `.documents/research/`)
- [ ] Telemetry/metrics/alerts defined for any workflow automation added

## Verification Commands
- [ ] npm run lint
- [ ] npm run typecheck
- [ ] npm run build
- [ ] bash workflow/scripts/lint-prompts.sh
- [ ] bash workflow/scripts/lint-ticket.sh .documents/.tickets/.latest
- [ ] Manual verification: review `workflow/commands/create_ticket.md`, `workflow/commands/create_plan.md`, and `workflow/commands/research_codebase.md` for AI Financial Planner context plus preserved sub-agent handoff rules.

## Non-Functional Requirements
- Performance/SLO: workflow docs and scripts must not slow normal app runtime or modify production request paths.
- Security/Privacy constraints: no secrets or `.env.local` content may be copied into workflow docs; reference `.env.example` only.
- Backward compatibility / migration: additions must be additive and must not rename or relocate existing app, Convex, or engine directories.

## Access Semantics (auth/permissions tickets only)
- Not applicable. This ticket bootstraps repo workflow and documentation rather than an application auth surface.

## Dependencies & Impact
- Services/flags/env vars affected
  - No runtime env changes are required for the scaffold itself, but prompt docs must accurately reference Clerk, Convex, Stripe, and OpenAI setup from existing repo docs.
- Detail dependency bullets are allowed here for accuracy
  - Source template comes from `/Users/coto/Documents/Code Projects/quotenclose/workflow/` and must be adapted rather than copied verbatim.
  - External work intake will originate in Linear, then be mirrored into repo-local issue files before research and planning.
- Include auth/session, routing/allowlist, and provisioning/bootstrap dependencies when applicable
  - Auth/session: workflow docs should recognize Clerk-authenticated app routes and AI approval constraints.
  - Routing/allowlist: prompts must point to the current `src/app` and workspace route structure.
  - Provisioning/bootstrap: `.documents` tracker files and supporting docs must exist before later issue/research/ticket/plan commands run.
- Data model/tables touched
  - No product data tables should change; this ticket is about repo docs, scripts, and workflow scaffolding.
- Detail impact bullets are allowed here for accuracy
  - Future issue, research, ticket, and plan sessions become repo-local and stop depending on QuoteNclose-specific wording.
- Rollout/rollback considerations
  - Rollout is additive and can ship on a normal branch; rollback is deleting the scaffolded workflow and doc files if adaptation is incorrect.

## Decisions (resolved)
- QuoteNclose is the template source, but final workflow content must be rewritten for AI Financial Planner.
- Preserve the current command and agent split plus child-agent spawning patterns unless a repo-specific constraint requires change.
- Keep ticket and plan naming, counter, and `.latest` conventions consistent with the existing cross-repo workflow.
- Linear remains the external issue tracker, but each issue must be mirrored locally before research and planning.
- Research is a first-class phase and must leave an artifact in `.documents/research/` before implementation planning starts.
- Seed workflow context from the current PRDs, README, and `docs/progress.md` instead of inventing new product direction.

## Open Questions (keep <= 4)
- None.

## Assumptions (keep <= 4)
- The QuoteNclose workflow files are the approved baseline for this repo family.
- AI Financial Planner will continue using Next.js App Router, Convex, Clerk, Stripe, and OpenAI.
- Existing PRDs and `docs/progress.md` are current enough to seed repo-specific workflow docs.
- No deeper-scope `AGENTS.md` file exists for `ai-finincial-planner`.

## Definition of Done
- [ ] All Acceptance Criteria pass
- [ ] Unit/Integration tests added or updated when appropriate
- [ ] Lint/typecheck/build verification is green
- [ ] Manual verification evidence is documented where needed
- [ ] Follow-up workflow gaps are captured if anything remains out of scope
