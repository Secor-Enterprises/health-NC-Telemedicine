#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-Secor-Enterprises/health-NC-Telemedicine}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/.github/project-management/project.json"
OWNER="$(jq -r '.owner' "$CONFIG")"
TITLE="$(jq -r '.title' "$CONFIG")"
DESCRIPTION="$(jq -r '.description' "$CONFIG")"

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

while IFS= read -r issue_url; do
  [[ -z "$issue_url" ]] && continue
  gh project item-add "$project_number" --owner "$OWNER" --url "$issue_url" >/dev/null 2>&1 || true
done < <(gh issue list --repo "$REPO" --state open --limit 250 --json url --jq '.[].url')

project_url="$(gh project view "$project_number" --owner "$OWNER" --format json | jq -r '.url')"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "## GitHub Project provisioned"
    echo
    echo "- Project: [$TITLE]($project_url)"
    echo "- Custom fields: created or verified"
    echo "- Open repository issues: added"
    echo "- Views: configure from \`.github/project-management/project.json\`; GitHub does not expose complete Project view creation through the supported CLI/API."
  } >> "$GITHUB_STEP_SUMMARY"
fi

echo "Project ready: $project_url"
