# 12-Factor Prompts — AI Financial Planner

This folder standardizes how Codex runs commands and how agents use tools in this repo.

## Before You Run
1. Inspect `workflow/tooling.config.json` for the latest workspace, documents, and tool fallback mappings.
2. Confirm `.documents/` mirrors the structure in the config: issues, tickets, plans, research, thoughts, PR drafts, and `CHANGELOG.md`.
3. Note whether you are in Codex CLI or an IDE agent so you follow the right Search/Read/List fallbacks.
4. Keep network access in mind. Skip Web tooling automatically when it is restricted and rely on local repo evidence instead.

## Paths
- Workspace root: `./`
- Documents root: `.documents/`
- Supporting docs root: `docs/`
- Local issue mirror: `.documents/issues/`
- Execution tickets: `.documents/.tickets/`
- Plans: `.documents/.plans/`
- Research notes: `.documents/research/`
- Historical notes and debug artifacts: `.documents/thoughts/`
- PR descriptions: `.documents/prs/`
- Changelog: `.documents/CHANGELOG.md`
- Business model: `.documents/business-model.md`
- Product PRD: `docs/MVP PRD — AI Financial Planner (v1).md`
- Implementation PRD: `docs/Implementation PRD - AI Financial Planner (v1).md`
- Progress tracker: `docs/progress.md`
- App routes: `src/app/`
- Components: `src/components/`
- Shared logic: `src/lib/`
- Finance engine: `src/engine/`
- Convex backend: `convex/`
- Static assets: `public/`
- Config map: `workflow/tooling.config.json`

## Tools & Defaults
Agents should follow the priorities encoded in `tooling.config.json`:
- Search -> IDE (`builtin:Search`, `builtin:CodeSearch`) or CLI (`rg`, `grep`)
- Glob/List -> IDE (`builtin:ListFiles`, `builtin:List`) or CLI (`rg --files`, `find`, `ls`)
- Read -> IDE (`builtin:Read`) before CLI fallbacks (`sed -n`, `cat`)
- Web -> only when network access allows (`builtin:WebSearch`, `builtin:WebFetch`)

## Workflow (Your Order)
1. The source issue lives in Linear. Mirror it locally into `.documents/issues/current/` with `workflow/commands/mirror_issue.md` before planning or coding.
2. Run `workflow/commands/research_codebase.md` for the mirrored issue or question and save the research note under `.documents/research/`.
3. Create or refine an execution ticket with `workflow/commands/create_ticket.md` so scope, acceptance criteria, and repo-specific constraints are explicit in `.documents/.tickets/current/`.
4. In a new session, run `workflow/commands/create_plan.md` using the current ticket plus research evidence. Save the plan to `.documents/.plans/pending/`, review it, then move it to `.documents/.plans/current_plan/`.
5. In a new session, run `workflow/commands/implement_plan.md` for the approved current plan. Complete all automated verification listed in the plan.
6. In a new session, run `workflow/commands/manual_verification.md` for the same plan. This session must not change code; it only records manual pass/fail evidence in the plan file.
7. Run `workflow/commands/validate_plan.md` to compare the implementation against the approved plan before shipping.
8. When validation passes, move the plan to `.documents/.plans/completed_plan/`, move the ticket to `.documents/.tickets/done/`, run `workflow/commands/commit.md`, then use `workflow/commands/describe_pr.md`.

Optional: use `workflow/commands/make_branch.md` before implementation or `workflow/commands/make_worktree.md` when you want isolated plan-specific worktrees.

## Prompt Linting
- Run `bash workflow/scripts/lint-prompts.sh` from the repo root to verify command and agent docs still meet the acceptance checks in this README and `tooling.config.json`.
- Run `bash workflow/scripts/lint-ticket.sh <ticket-path>` (or no argument to lint `.documents/.tickets/.latest`) before planning.

## Conventions
- Use repository-relative paths in prompts.
- Keep local issue mirrors faithful to the source issue; do not silently rewrite requirements during intake.
- Keep research evidence under `.documents/research/` and treat it as a prerequisite for planning.
- Treat `docs/` as the default source of project context; do not assume a task board or separate project-plan doc exists.
- Keep tickets focused and name them `TICKET-####-short-slug-YYYY-MM-DD.md`.
- Prefer small, iterative plans with explicit acceptance criteria and real verification commands.
- For this repo, the most common verification set is `npm run convex:codegen`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- Archive debugging reports under `.documents/thoughts/debug/DBG-YYYYMMDD-ss-slug.md`.

## Local Service Reminder
- `npm run dev` starts the Next.js app.
- `npm run dev:convex` starts the local Convex backend.
- If Clerk, Stripe, Convex, or OpenAI env vars are missing, some flows will show placeholder or configuration states instead of full behavior.

If a tool is unavailable, agents should automatically use the next fallback defined in `workflow/tooling.config.json`.
