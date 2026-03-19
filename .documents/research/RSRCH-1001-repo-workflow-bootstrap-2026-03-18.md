---
date: 2026-03-18T23:23:44-0400
researcher: Codex
git_commit: uncommitted
branch: main
repository: ai-finincial-planner
topic: "Repo workflow bootstrap for AI Financial Planner"
tags: [research, workflow, prompts, docs]
status: complete
last_updated: 2026-03-18
last_updated_by: Codex
linked_issue: none
linked_ticket: .documents/.tickets/current/TICKET-1001-bootstrap-ai-planner-workflow-2026-03-18.md
---

# Research: Repo workflow bootstrap for AI Financial Planner

## Research Question
What repo structure, project docs, and code surfaces should the reusable workflow target when adapting the QuoteNclose prompt system to AI Financial Planner?

## Summary
The repo is a Next.js App Router application with Convex, Clerk, Stripe, and a shared TypeScript finance engine. The most important surfaces for workflow prompts are the workspace route tree under `src/app`, shared route metadata under `src/lib`, deterministic model logic under `src/engine`, and the Convex schema and action/query layer under `convex/`. Product and roadmap context already exists in the PRDs, `README.md`, and `docs/progress.md`, but the repo was missing workflow docs, tracker directories, and supporting planning artifacts.

## Detailed Findings

### Product and roadmap context
- `README.md:1-48` - locked stack, local setup, verification commands, and external services.
- `docs/progress.md:7-31` - current MVP phases and sprint status.
- `Implementation PRD - AI Financial Planner (v1).md:14-126` - stack assumptions, route map, and preferred Convex surface.
- `MVP PRD — AI Financial Planner (v1).md:51-99` - product direction, audience, pricing, and AI approval constraints.

### App and navigation surfaces
- `src/app/app/layout.tsx:1-5` - authenticated app shell entry.
- `src/lib/route-data.ts:9-75` - dashboard links, wizard steps, and workspace navigation structure.
- `src/components/layout/workspace-shell.tsx:31-212` - persistent workspace chrome and AI panel context.

### Deterministic model and backend surfaces
- `src/engine/orchestrator/calculate-scenario.ts:25-65` - orchestration point for model output generation.
- `convex/schema.ts:46-260` - primary data model for businesses, scenarios, assumptions, billing, exports, and AI suggestions.
- `convex/ai.ts:5-70` - current AI response and suggestion approval/rejection surface.

## Code References
- `README.md:19-48` - local setup and verification commands to reuse in workflow docs.
- `docs/progress.md:11-30` - phase and sprint backlog source material.
- `src/lib/route-data.ts:32-75` - wizard and workspace route patterns for codebase research prompts.
- `src/engine/orchestrator/calculate-scenario.ts:25-65` - model orchestration for planning and debug prompts.
- `convex/schema.ts:46-260` - schema coverage for tickets, plans, and research.

## Historical Context
- `.documents/.tickets/current/TICKET-1001-bootstrap-ai-planner-workflow-2026-03-18.md` - bootstrap scope for issue mirror, research, ticket, plan, implementation, and validation flow.

## Related Research
- None yet.

## Open Questions
- Should mirrored local issue files always live under `.documents/issues/current/`, or should the repo also expose a top-level `issues/` alias?
