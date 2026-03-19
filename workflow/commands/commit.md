# Commit Changes

Package work for the `ai-finincial-planner` repo: create clean git commits and update `.documents/CHANGELOG.md`. Keep `workflow/README.md` and `workflow/tooling.config.json` handy for repo paths and workflow order.

## Process
1. Review the repo state with `git status` and `git diff`.
2. Group changes into one or more logical commits tied to the active issue, ticket, and plan.
3. Present the proposed commits and exact messages to the user for confirmation.
4. Execute only after confirmation.
5. Update `.documents/CHANGELOG.md` with a new top entry.

## Guardrails
- Do not add co-authors or tool attributions.
- Never use `git add -A` or `git add .`.
- Stage only specific files.

## Commit Planning
- Favor focused, imperative commit messages.
- Conventional prefixes are encouraged: `feat:`, `fix:`, `docs:`, `refactor:`, `build:`, `test:`.
- Ask:
  - `I plan to create [N] commit(s) with these changes. Shall I proceed?`

## Changelog Format
- Header format:
  - `## AI Financial Planner Beta <MAJOR>.<MINOR> -- <YYYY-MM-DD>`
- Default behavior: increment the minor number.
- Keep newest entries at the top.
- Prefer Keep a Changelog sections such as Added, Changed, Fixed, Docs, and Tooling.
- Reference the related issue, ticket, and plan inline when known.

## Post-Commit Reminder
- If the changelog update is the only remaining change, create a final changelog commit.
