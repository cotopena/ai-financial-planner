---
description: Document the AI Financial Planner codebase as it exists today
model: codex-high
---

# Research Codebase

Conduct evidence-first research across the codebase to answer a question, map an issue, or prepare planning inputs. Research is read-only and must produce a saved artifact under `.documents/research/`.

## Before You Run
- Read `workflow/README.md` to confirm the issue -> research -> ticket -> plan flow.
- Consult `workflow/tooling.config.json` for `.documents/issues/`, `.documents/research/`, `.documents/thoughts/`, and code roots plus the required search/list/read fallbacks.
- Example Codex CLI prompt: `Use workflow/commands/research_codebase.md to map scenario snapshot generation and save the report under .documents/research/.`

## CRITICAL: Document What Exists
- Do not suggest improvements unless the user explicitly asks.
- Do not critique the implementation or turn the report into a plan.
- Do not change files besides writing the final research note.
- Focus on what exists, where it exists, how it works, and how components interact.

## Initial Setup

When invoked, respond with:
```
I'm ready to research the codebase. Share the question, issue path, or area you want mapped and I'll gather evidence before any planning or coding.
```

Then wait for the research question if none was provided.

## Steps to follow after receiving the research query

1. Read directly mentioned files in full before spawning any sub-tasks.
   - Prioritize mirrored issues in `.documents/issues/`, current tickets, relevant research notes, and explicitly named source files.
2. Break the question into composable research areas.
   - Use TodoWrite to track the investigation.
3. Spawn parallel sub-agent tasks as needed:
   - `workflow/agents/codebase-locator.md` to find where relevant code lives.
   - `workflow/agents/codebase-analyzer.md` to explain how the code currently works.
   - `workflow/agents/codebase-pattern-finder.md` to surface similar patterns already in the repo.
   - `workflow/agents/thoughts-locator.md` for related docs under `.documents/`.
   - `workflow/agents/thoughts-analyzer.md` for extracting key decisions from those docs.
   - `workflow/agents/web-search-researcher.md` only when external documentation is explicitly needed and network access allows.
4. Wait for all sub-agents to complete, then synthesize findings.
   - Treat live code as the primary source of truth.
   - Use `.documents/` history as supporting context.
   - Cite repository-relative `path:line` references for key claims.
5. Save the research artifact:
   - Directory: `.documents/research/`
   - Filename: `RSRCH-XXXX-description-YYYY-MM-DD.md`
     - Use the ticket number when available, otherwise omit it.
     - Examples:
       - `RSRCH-1452-scenario-snapshots-2026-03-18.md`
       - `wizard-persistence-2026-03-18.md`
   - Update `.documents/research/.latest` with the repository-relative path.
6. Present a concise summary in-session with the saved path and key findings.
7. For follow-up questions, append to the same research file and refresh `last_updated`.

## Research Document Template

```markdown
---
date: [ISO timestamp with timezone]
researcher: [name or handle]
git_commit: [commit hash]
branch: [branch name]
repository: [repository name]
topic: "[research topic]"
tags: [research, codebase, relevant-areas]
status: complete
last_updated: [YYYY-MM-DD]
last_updated_by: [name or handle]
linked_issue: [path-or-none]
linked_ticket: [path-or-none]
---

# Research: [Topic]

## Research Question
[original question]

## Summary
[high-level explanation of what exists]

## Detailed Findings

### [Area 1]
- `path:line` - what exists
- connections to related files

### [Area 2]
- ...

## Code References
- `path:line` - short description

## Historical Context
- `.documents/...` - relevant supporting note

## Related Research
- `.documents/research/...`

## Open Questions
- ...
```

## Guidelines
- Always run fresh codebase research; do not rely only on old notes.
- Keep the main agent focused on synthesis while sub-agents gather evidence.
- Prefer repository-relative paths in the final document.
- If you use Web research, include titles, dates, and URLs in the saved note.
- Keep research factual. Planning and recommendations belong in later steps.
