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

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "PROJECTS_TOKEN is not configured; skipping organisation Project creation."
  echo "Create an organisation-scoped token with Projects write access, save it as PROJECTS_TOKEN, and rerun this workflow."
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    {
      echo "## GitHub Project setup pending"
      echo
      echo "The repository labels and milestones were applied. Organisation-level GitHub Projects require a token with Projects write access."
      echo "Add the repository secret \`PROJECTS_TOKEN\` and rerun **Bootstrap Project Management**."
    } >> "$GITHUB_STEP_SUMMARY"
  fi
  exit 0
fi

if ! gh project --help >/dev/null 2>&1; then
  echo "The installed gh CLI does not provide project commands." >&2
  exit 1
fi

project_number="$(gh project list --owner "$OWNER" --limit 100 --format json \
  | jq -r --arg title "$TITLE" '.projects[] | select(.title == $title) | .number' \
  | head -n 1)"

if [[ -z "$project_number" ]]; then
  created="$(gh project create --owner "$OWNER" --title "$TITLE" --format json)"
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

# Add all current open issues to the project. The operation is idempotent.
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
    echo "- Views: configure from \`.github/project-management/project.json\` because GitHub does not expose full Project view creation through the supported CLI/API."
  } >> "$GITHUB_STEP_SUMMARY"
fi

echo "Project ready: $project_url"
