---
description: Generate repository-ready PR descriptions with local archives
model: codex-high
---

# Describe Pull Request

Craft thorough pull request descriptions for AI Financial Planner, store them under `.documents/prs/`, and optionally sync them to GitHub.

## Before You Run
- Read `workflow/README.md` to confirm the required order: plan -> manual verification -> validate -> commit -> PR.
- Consult `workflow/tooling.config.json` for the `.documents/prs/` root and relevant ticket/plan/research paths.
- Example Codex CLI prompt: `Use workflow/commands/describe_pr.md to summarize the PR for PLAN-1001 and save it to .documents/prs/.`

## Step 1 – Review Inputs
1. Read the linked ticket, plan, validation results, and relevant research docs.
2. Open `.documents/CHANGELOG.md` so wording stays aligned with release notes.
3. Use this structure:
   - Linked issue / ticket / plan
   - What problem was solved
   - What changed for users
   - How it was implemented
   - How to verify it
   - Changelog summary

## Step 2 – Collect Git & PR Metadata
- `git status`
- `git log --oneline -n 5`
- `gh pr view ...` if GitHub CLI is configured
- `gh pr diff` or `git diff` as needed

## Step 3 – Analyze the Changes
- Identify user-facing changes.
- Identify internal implementation details.
- Cross-check against the approved plan.
- Note deviations, follow-ups, or risks.

## Step 4 – Document Verification Evidence
- At minimum, record the relevant automated and manual checks from the plan.
- Mark completed items with `[x]`.
- Note anything not run or still blocked.

## Step 5 – Write & Save the Description
- Save to `.documents/prs/PR-<ticket>-<sequence>-slug.md`
- Update `.documents/prs/.latest`
- Keep sections tight and scannable

## Step 6 – Sync with GitHub & Docs
- Optionally sync the body with `gh pr edit`.
- Ensure `.documents/CHANGELOG.md` already reflects the change.
- Call out any unchecked verification steps in the PR body.

## Guardrails
- Keep changelog entries shorter than PR descriptions.
- Pause if the work drifted beyond the approved plan.
