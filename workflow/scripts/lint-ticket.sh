#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${PROMPT_DIR}/.." && pwd)"

cd "$REPO_ROOT"

pass() {
  printf '✓ %s\n' "$1"
}

fail() {
  printf '✗ %s\n' "$1"
  exit 1
}

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

first_match_line() {
  local pattern="$1"
  local target="$2"
  if command -v rg >/dev/null 2>&1; then
    rg -n -m1 "$pattern" "$target" | cut -d: -f1
  else
    grep -n -m1 -E "$pattern" "$target" | cut -d: -f1
  fi
}

match_count() {
  local pattern="$1"
  local target="$2"
  if command -v rg >/dev/null 2>&1; then
    { rg -n "$pattern" "$target" || true; } | wc -l | tr -d '[:space:]'
  else
    { grep -n -E "$pattern" "$target" || true; } | wc -l | tr -d '[:space:]'
  fi
}

ticket_path="${1:-}"
if [[ -z "$ticket_path" ]]; then
  [[ -f ".documents/.tickets/.latest" ]] || fail "Missing .documents/.tickets/.latest"
  ticket_path="$(cat .documents/.tickets/.latest)"
fi

[[ -f "$ticket_path" ]] || fail "Ticket not found: $ticket_path"
pass "Lint target: $ticket_path"

frontmatter_delims="$(match_count '^---$' "$ticket_path")"
if (( frontmatter_delims >= 2 )); then
  pass "Frontmatter delimiters present"
else
  fail "Frontmatter delimiters missing or malformed"
fi

required_frontmatter_fields=(
  "id"
  "title"
  "type"
  "priority"
  "risk_level"
  "status"
  "owner"
  "created"
  "plan_blockers"
  "labels"
)

for field in "${required_frontmatter_fields[@]}"; do
  if [[ -n "$(first_match_line "^${field}:" "$ticket_path" || true)" ]]; then
    pass "Frontmatter field present: ${field}"
  else
    fail "Missing frontmatter field: ${field}"
  fi
done

risk_level_line="$(grep -m1 -E '^risk_level:' "$ticket_path" || true)"
risk_level_value="$(trim "${risk_level_line#risk_level:}")"
if [[ "$risk_level_value" =~ ^(low|medium|high)$ ]]; then
  pass "risk_level is valid: ${risk_level_value}"
else
  fail "risk_level must be one of: low, medium, high"
fi

plan_blockers_line="$(grep -m1 -E '^plan_blockers:' "$ticket_path" || true)"
plan_blockers_value="$(trim "${plan_blockers_line#plan_blockers:}")"
if [[ "$plan_blockers_value" =~ ^\[[^]]*\]$ ]]; then
  pass "plan_blockers uses inline list syntax"
else
  fail "plan_blockers must use inline list syntax, e.g. [] or [\"item\"]"
fi

status_line="$(grep -m1 -E '^status:' "$ticket_path" || true)"
status_value="$(trim "${status_line#status:}")"
if [[ "$plan_blockers_value" != "[]" && "$status_value" == "current" ]]; then
  fail "status must not be current when plan_blockers is non-empty"
fi
pass "status/plan_blockers combination is valid"

required_sections=(
  "^# Summary$"
  "^## Problem / Goal$"
  "^## Scope \\(In\\)$"
  "^## Out of Scope$"
  "^## Context Pointers$"
  "^## Acceptance Criteria \\(testable\\)$"
  "^## Deliverables$"
  "^## Verification Commands$"
  "^## Non-Functional Requirements$"
  "^## Access Semantics"
  "^## Dependencies & Impact$"
  "^## Decisions \\(resolved\\)$"
  "^## Open Questions"
  "^## Assumptions"
  "^## Definition of Done$"
)

last_line=0
for section_pattern in "${required_sections[@]}"; do
  section_line="$(first_match_line "$section_pattern" "$ticket_path" || true)"
  [[ -n "$section_line" ]] || fail "Missing required section matching: ${section_pattern}"
  if (( section_line <= last_line )); then
    fail "Section order is incorrect around pattern: ${section_pattern}"
  fi
  last_line=$section_line
done
pass "Required sections exist and are in order"

scenario_count="$(match_count '^- \*\*Scenario:\*\*' "$ticket_path")"
if (( scenario_count >= 3 && scenario_count <= 7 )); then
  pass "Acceptance criteria scenarios count is valid (${scenario_count})"
else
  fail "Acceptance criteria scenarios must be between 3 and 7 (found ${scenario_count})"
fi

open_questions_block="$(
  awk '
    /^## Open Questions/ { in_block=1; next }
    /^## / && in_block { exit }
    in_block { print }
  ' "$ticket_path"
)"

[[ -n "$open_questions_block" ]] || fail "Open Questions section is empty"

if printf '%s\n' "$open_questions_block" | grep -qE '^- None\.$'; then
  oq_bullets="$(printf '%s\n' "$open_questions_block" | grep -cE '^- ' || true)"
  if (( oq_bullets == 1 )); then
    pass "Open Questions correctly marked as None"
  else
    fail "Open Questions has '- None.' plus extra bullets"
  fi
else
  oq_bullets="$(printf '%s\n' "$open_questions_block" | grep -cE '^- ' || true)"
  if (( oq_bullets < 1 || oq_bullets > 4 )); then
    fail "Open Questions must contain 1 to 4 bullets when not None"
  fi
  non_question_lines="$(
    printf '%s\n' "$open_questions_block" \
      | grep -E '^- ' \
      | grep -vE '\?$' || true
  )"
  if [[ -n "$non_question_lines" ]]; then
    fail "Open Questions bullets must be decision-seeking questions ending with '?'"
  fi
  pass "Open Questions rules are valid (${oq_bullets} questions)"
fi

pass "Ticket lint checks complete"
