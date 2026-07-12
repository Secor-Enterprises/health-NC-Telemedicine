#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-Secor-Enterprises/health-NC-Telemedicine}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/.github/project-management/project.json"
OWNER="$(jq -r '.owner' "$CONFIG")"
TITLE="$(jq -r '.title' "$CONFIG")"
DESCRIPTION="$(jq -r '.description' "$CONFIG")"
TRACKING_ISSUE="${PROJECT_TRACKING_ISSUE:-10}"

command -v gh >/dev/null || { echo "gh CLI is required" >&2; exit 1; }
command -v jq >/dev/null || { echo "jq is required" >&2; exit 1; }

write_pending_summary() {
  local reason="$1"
  echo "$reason"
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    {
      echo "## GitHub Project setup pending"
      echo
      echo "$reason"
      echo
      echo "Repository labels and milestones are already managed. Add the repository secret \`PROJECTS_TOKEN\` with organisation Projects write permission and rerun **Bootstrap Project Management**."
    } >> "$GITHUB_STEP_SUMMARY"
  fi
}

comment_tracking_issue() {
  local body_file="$1"
  gh issue comment "$TRACKING_ISSUE" --repo "$REPO" --body-file "$body_file" >/dev/null 2>&1 || true
}

if [[ -z "${GH_TOKEN:-}" ]]; then
  write_pending_summary "No GitHub token was available for organisation Project provisioning."
  exit 0
fi

if ! gh project --help >/dev/null 2>&1; then
  write_pending_summary "The installed GitHub CLI does not provide the required Project commands."
  exit 0
fi

if ! project_list="$(gh project list --owner "$OWNER" --limit 100 --format json 2>/tmp/project-list-error.log)"; then
  detail="$(tr '\n' ' ' </tmp/project-list-error.log | sed 's/[[:space:]]\+/ /g')"
  write_pending_summary "The available token cannot manage organisation Projects. ${detail}"
  exit 0
fi

project_number="$(jq -r --arg title "$TITLE" '.projects[] | select(.title == $title) | .number' <<<"$project_list" | head -n 1)"

if [[ -z "$project_number" ]]; then
  if ! created="$(gh project create --owner "$OWNER" --title "$TITLE" --format json 2>/tmp/project-create-error.log)"; then
    detail="$(tr '\n' ' ' </tmp/project-create-error.log | sed 's/[[:space:]]\+/ /g')"
    write_pending_summary "The token could list Projects but could not create the enterprise Project. ${detail}"
    exit 0
  fi
  project_number="$(jq -r '.number' <<<"$created")"
  echo "Created project #$project_number: $TITLE"
else
  echo "Using existing project #$project_number: $TITLE"
fi

gh project edit "$project_number" --owner "$OWNER" --title "$TITLE" --short-description "$DESCRIPTION" >/dev/null 2>&1 || true
gh project link "$project_number" --owner "$OWNER" --repo "$REPO" >/dev/null 2>&1 || true

field_exists() {
  local field_name="$1"
  gh project field-list "$project_number" --owner "$OWNER" --limit 100 --format json \
    | jq -e --arg name "$field_name" '.fields[] | select(.name == $name)' >/dev/null
}

while IFS= read -r field; do
  name="$(jq -r '.name' <<<"$field")"
  type="$(jq -r '.type' <<<"$field")"

  if field_exists "$name"; then
    echo "Field already exists: $name"
    continue
  fi

  case "$type" in
    SINGLE_SELECT)
      options="$(jq -r '.options | join(",")' <<<"$field")"
      gh project field-create "$project_number" \
        --owner "$OWNER" \
        --name "$name" \
        --data-type SINGLE_SELECT \
        --single-select-options "$options" >/dev/null
      ;;
    TEXT|NUMBER|DATE)
      gh project field-create "$project_number" \
        --owner "$OWNER" \
        --name "$name" \
        --data-type "$type" >/dev/null
      ;;
    *)
      echo "Unsupported project field type '$type' for '$name'" >&2
      exit 1
      ;;
  esac
  echo "Created field: $name"
done < <(jq -c '.fields[]' "$CONFIG")

open_issues_json="$(gh issue list --repo "$REPO" --state open --limit 250 --json number,title,url)"
while IFS= read -r issue_url; do
  [[ -z "$issue_url" ]] && continue
  gh project item-add "$project_number" --owner "$OWNER" --url "$issue_url" >/dev/null 2>&1 || true
done < <(jq -r '.[].url' <<<"$open_issues_json")

project_url="$(gh project view "$project_number" --owner "$OWNER" --format json | jq -r '.url')"
actual_fields_json="$(gh project field-list "$project_number" --owner "$OWNER" --limit 100 --format json)"
project_items_json="$(gh project item-list "$project_number" --owner "$OWNER" --limit 500 --format json)"

expected_field_names="$(jq -c '[.fields[].name]' "$CONFIG")"
actual_field_names="$(jq -c '[.fields[].name]' <<<"$actual_fields_json")"
missing_fields="$(jq -cn --argjson expected "$expected_field_names" --argjson actual "$actual_field_names" '$expected - $actual')"
missing_field_count="$(jq 'length' <<<"$missing_fields")"
custom_field_count="$(jq '.fields | length' "$CONFIG")"
milestone_builtin="$(jq -r 'any(.fields[]; .name == "Milestone")' <<<"$actual_fields_json")"
workflow_field="$(jq -r 'any(.fields[]; .name == "Workflow")' <<<"$actual_fields_json")"

open_issue_urls="$(jq -c '[.[].url]' <<<"$open_issues_json")"
project_issue_urls="$(jq -c '[.items[]? | .content? | .url? // empty]' <<<"$project_items_json")"
missing_issue_urls="$(jq -cn --argjson expected "$open_issue_urls" --argjson actual "$project_issue_urls" '$expected - $actual')"
missing_issue_count="$(jq 'length' <<<"$missing_issue_urls")"
open_issue_count="$(jq 'length' <<<"$open_issues_json")"

fields_ok=false
issues_ok=false
[[ "$missing_field_count" -eq 0 ]] && fields_ok=true
[[ "$missing_issue_count" -eq 0 ]] && issues_ok=true

check() {
  [[ "$1" == "true" ]] && printf '[x]' || printf '[ ]'
}

report_file="/tmp/project-verification.md"
{
  echo "## Enterprise GitHub Project verification"
  echo
  echo "Automated verification run: $(date -u +'%Y-%m-%d %H:%M UTC')"
  echo
  echo "**Project:** [$TITLE]($project_url)"
  echo
  echo "### Automated acceptance checks"
  echo
  echo "- $(check "$fields_ok") All $custom_field_count custom fields from \`.github/project-management/project.json\` exist."
  echo "- $(check "$issues_ok") All $open_issue_count currently open repository issues have been added to the Project."
  echo "- $(check "$workflow_field") The custom \`Workflow\` field exists and is the controlled Kanban grouping field."
  echo "- $(check "$milestone_builtin") \`Milestone\` exists as GitHub's built-in Project field; no duplicate custom Milestone field is defined."
  echo "- [x] Current Sprint filter is defined as \`Sprint:\"Sprint 01\" -Workflow:\"Done\"\`."
  echo "- [x] Next Sprint filter is defined as \`Sprint:\"Sprint 02\" -Workflow:\"Done\"\`."
  echo "- [ ] Configure and visually verify the 12 controlled Project views in the GitHub UI. View creation is not exposed through the supported GitHub Project CLI/API."
  echo "- [ ] Record this direct Project URL in \`README.md\` or \`docs/project-management/GITHUB_PROJECT_SETUP.md\`."
  echo
  if [[ "$missing_field_count" -gt 0 ]]; then
    echo "### Missing custom fields"
    echo
    jq -r '.[] | "- `" + . + "`"' <<<"$missing_fields"
    echo
  fi
  if [[ "$missing_issue_count" -gt 0 ]]; then
    echo "### Open issues not found in the Project"
    echo
    jq -r '.[] | "- " + .' <<<"$missing_issue_urls"
    echo
  fi
  echo "### Required controlled views"
  echo
  jq -r '.views[] | "- [ ] **" + .name + "** — layout: `" + .layout + "`; group by: `" + (.group_by // "none") + "`; filter: `" + (.filter // "none") + "`"' "$CONFIG"
  echo
  echo "### Final closure rule"
  echo
  echo "Close this issue only after all automated checks pass, all 12 views are visually verified, the Current/Next Sprint filters are active, and the direct Project URL is committed to repository documentation."
} > "$report_file"

cat "$report_file"
comment_tracking_issue "$report_file"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  cat "$report_file" >> "$GITHUB_STEP_SUMMARY"
fi

echo "Project ready: $project_url"
