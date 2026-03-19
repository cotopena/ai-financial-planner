# Validate Plan

Confirm that an implemented plan matches expectations before merge or release. Validation compares code, docs, tests, and manual evidence against the approved plan.

## Before You Run
- Read `workflow/README.md` for the standard workflow and paths.
- Reference `workflow/tooling.config.json` for `.documents/.plans/current_plan/`, `.documents/.plans/completed_plan/`, tickets, and research roots.
- Example Codex CLI prompt: `Use workflow/commands/validate_plan.md to verify .documents/.plans/current_plan/PLAN-1001-persist-wizard-state-2026-03-18.md before commit.`

## Step 1 – Collect Evidence
- Read the latest plan from `.documents/.plans/current_plan/` or `completed_plan/`.
- Review linked tickets, issue mirrors, and research docs.
- Inspect relevant diffs or commits to map implementation back to plan phases.

Summarize:
```
Plan: <filename>
Target phases: [...]
Linked ticket: [...]
Linked research: [...]
```

## Step 2 – Verify Phase Completion
For each phase:
1. Compare implemented files with the plan instructions.
2. Ensure plan checklists are updated appropriately.
3. Note deviations, gaps, or scope drift.

## Step 3 – Run Verification
- Execute automated commands listed in the plan.
- Review manual verification evidence from the plan.
- Record pass, fail, or blocked outcomes.

## Step 4 – Produce Validation Report
Use this structure:
```
## Validation Report -- <Plan Name>

### Summary
Ready or Needs Work with a short rationale.

### Phase Review
- Phase X -- ✅ / ⚠️

### Verification Results
- Automated: ...
- Manual: ...

### Findings
- Matches plan:
  - ...
- Deviations / Issues:
  - ...

### Next Steps
- [ ] ...
```

## Guardrails
- Stay objective and evidence-driven.
- Stop if you encounter unexpected work outside the plan and ask how to proceed.
- If validation passes, remind the user to finish commit and PR steps if not already done.
