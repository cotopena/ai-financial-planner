# Create Feature Branch

Create a git branch named from a ticket or plan filename. Use this before implementing work so branch names stay aligned with `.documents/.tickets/...` or `.documents/.plans/...`.

## Inputs
- Required: ticket or plan path (e.g., `.documents/.tickets/current/TICKET-1015-persist-wizard-state-2026-03-18.md` or `.documents/.plans/current_plan/PLAN-1015-persist-wizard-state-2026-03-18.md`). If missing, ask the user for it before continuing.
- Optional: branch type (default `feat`). Allowed types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`.

## Branch Naming Template
`codex/<type>/<slug>`

- `<slug>` is the filename stem lowercased, extension stripped. Keep dashes as-is (do not replace ticket IDs or dates).
- Examples:
  - `codex/feat/PLAN-1015-persist-wizard-state-2026-03-18`
  - `codex/fix/TICKET-2044-fix-snapshot-refresh-2026-03-18`

## Steps
1) **Verify input**  
   - Confirm the provided file exists; if not, stop and ask for a valid path.  
   - Derive `slug` from the filename (strip directory + extension).
2) **Choose type**  
   - Use the provided type or default to `feat`. If unsure, ask the user to pick from the allowed list.
3) **Construct branch name**  
   - `codex/<type>/<slug>`
4) **Check collisions**  
   - Run `git branch --list "<branch-name>"`. If it exists, ask for a variant (e.g., append `-2`).
5) **Create branch**  
   - `git checkout -b <branch-name>`
6) **Report**  
   - Output the new branch name and remind the user if the working tree has unstaged or untracked files (`git status --short`).

## Guardrails
- Do not delete or rename existing branches.
- Do not modify repo files; this command only creates a branch.
- Respect existing uncommitted changes—do not clean or stash without explicit user approval.

## Example Codex CLI Prompt
`Use workflow/commands/make_branch.md for .documents/.plans/current_plan/PLAN-1015-persist-wizard-state-2026-03-18.md (type=feat)`
