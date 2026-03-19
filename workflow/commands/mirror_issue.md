# Mirror Issue

Create a local issue mirror from Linear or another external tracker before research or planning starts.

## Before You Run
- Read `workflow/README.md` to confirm the issue -> research -> ticket -> plan workflow.
- Inspect `workflow/tooling.config.json` for the `.documents/issues/` root and available read/search fallbacks.
- Example Codex CLI prompt: `Use workflow/commands/mirror_issue.md to mirror Linear issue AFP-42 about wizard step persistence into .documents/issues/current/.`

## Inputs
- Required: issue key or source title.
- Required: issue summary/body from Linear, pasted text, or a public issue URL.
- Optional: source URL, status, priority, owner, labels, acceptance criteria, linked docs.

If the issue body is not accessible from local context or a public URL, ask the user to paste the relevant issue content before continuing.

## File Rules
- Directory: `.documents/issues/current/`
- Filename: `<ISSUEKEY>-short-slug-YYYY-MM-DD.md`
  - Keep the issue key exactly as provided (`AFP-42`, `ENG-103`, etc.)
  - Slug should be kebab-case, <= 7 words
- After saving, update `.documents/issues/.latest` with the repository-relative path.

## Process
1. Read the issue source material in full.
2. Preserve the original request faithfully; do not invent acceptance criteria or implementation details.
3. Convert the issue into a concise local mirror using the template below.
4. Save the file and update `.latest`.
5. Return:
   - `Created: .documents/issues/current/<ISSUEKEY>-slug-YYYY-MM-DD.md`

## Template

`---`
`issue_key: <ISSUEKEY>`
`title: <Issue title>`
`source: Linear|GitHub|Other`
`source_url: <url-or-none>`
`status: backlog|todo|in_progress|done|canceled|unknown`
`priority: P0|P1|P2|P3|unknown`
`owner: <name-or-unassigned>`
`created: YYYY-MM-DD`
`labels: [label-one, label-two]`
`linked_ticket: none`
`linked_plan: none`
`---`

`# Summary`
`1-2 sentence issue summary in plain language.`

`## Original Request`
`- Preserve the main ask from the source issue.`
`- Include any explicit user-facing problem statement.`

`## Acceptance Signals`
`- List explicit success criteria from the source issue only.`
`- If the issue has no clear acceptance criteria, say so.`

`## Constraints`
`- Known deadlines, dependencies, blockers, or non-goals from the source issue.`

`## Linked Context`
`- Relevant repo docs, PRDs, screenshots, or URLs mentioned in the issue.`

`## Notes`
`- Keep this section factual. Do not add implementation guesses.`

## Guardrails
- The local issue mirror is an intake artifact, not an implementation plan.
- Do not add speculative file pointers or code-level decisions here.
- Use `create_ticket.md` after research if the work needs an execution-ready engineering ticket.
