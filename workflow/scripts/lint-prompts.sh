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

require_file() {
  local path="$1"
  [[ -f "$path" ]] && pass "Exists: $path" || fail "Missing: $path"
}

count_pattern() {
  local pattern="$1"
  local target="$2"
  if command -v rg >/dev/null 2>&1; then
    rg -n "$pattern" "$target"
  else
    # Fallback when ripgrep is unavailable (e.g., minimal CI images)
    grep -R -n "$pattern" "$target"
  fi
}

require_count() {
  local desc="$1"
  local pattern="$2"
  local target="$3"
  local min="$4"
  local count
  count=$(count_pattern "$pattern" "$target" | wc -l | tr -d '[:space:]')
  if (( count >= min )); then
    pass "$desc ($count >= $min)"
  else
    fail "$desc ($count < $min)"
  fi
}

require_file "workflow/tooling.config.json"
require_file "workflow/README.md"
require_file "workflow/scripts/lint-ticket.sh"

require_count '"Before You Run" blocks in command docs' "Before You Run" "workflow/commands" 5
require_count 'Command docs referencing tooling.config.json' "tooling.config.json" "workflow/commands" 5
require_count 'Command docs referencing README' "workflow/README.md" "workflow/commands" 5

require_count '"Tools & Defaults" sections in agents' "Tools & Defaults" "workflow/agents" 6
require_count 'Agent briefs referencing tooling.config.json' "tooling.config.json" "workflow/agents" 6
require_count 'Agent briefs referencing README' "workflow/README.md" "workflow/agents" 6

pass "Prompt lint checks complete"
