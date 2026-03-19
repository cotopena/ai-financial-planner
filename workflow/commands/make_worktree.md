# Create Worktrees for Current Plans

Create a git worktree, with its own branch, for every plan file under `.documents/.plans/current_plan/`.

## Inputs
- Optional: plans directory (default `.documents/.plans/current_plan`)
- Optional: branch type (default `feat`; allowed: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`)
- Optional: base branch (default `main`)

## Naming Rules
- Plan stem: filename without directory or `.md`
- Branch: `codex/<type>/<plan-stem>`
- Worktree dir: `.worktrees/<stem-without-date-lowercased>`

## Steps
1. Prep
   - `cd /Users/coto/Documents/Code Projects/ai-finincial-planner`
   - verify the plans directory exists
   - `git fetch --all --prune`
   - `git worktree prune`
   - `mkdir -p .worktrees`
2. Discover plans
   - `find .documents/.plans/current_plan -maxdepth 1 -type f -name 'PLAN-*.md' | sort`
3. For each plan file
   - derive the branch and worktree names
   - check for collisions
   - create the worktree from the base branch
4. Verify with `git worktree list`

## Guardrails
- Do not delete existing worktrees or branches.
- Do not modify repo files; only create branches and worktrees.
- Respect uncommitted changes in the main working tree.
