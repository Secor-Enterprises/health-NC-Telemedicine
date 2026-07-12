#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-Secor-Enterprises/health-NC-Telemedicine}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LABELS_FILE="$ROOT/.github/project-management/labels.json"
MILESTONES_FILE="$ROOT/.github/project-management/milestones.json"

command -v gh >/dev/null || { echo "gh CLI is required" >&2; exit 1; }
command -v jq >/dev/null || { echo "jq is required" >&2; exit 1; }
: "${GH_TOKEN:?GH_TOKEN is required}"

encode_uri() {
  jq -rn --arg value "$1" '$value | @uri'
}

upsert_labels() {
  echo "Applying controlled label taxonomy to $REPO"
  while IFS= read -r item; do
    name="$(jq -r '.name' <<<"$item")"
    color="$(jq -r '.color' <<<"$item")"
    description="$(jq -r '.description' <<<"$item")"
    encoded="$(encode_uri "$name")"

    if gh api "/repos/$REPO/labels/$encoded" >/dev/null 2>&1; then
      jq -n \
        --arg new_name "$name" \
        --arg color "$color" \
        --arg description "$description" \
        '{new_name:$new_name,color:$color,description:$description}' \
        | gh api --method PATCH "/repos/$REPO/labels/$encoded" --input - >/dev/null
      echo "Updated label: $name"
    else
      jq -n \
        --arg name "$name" \
        --arg color "$color" \
        --arg description "$description" \
        '{name:$name,color:$color,description:$description}' \
        | gh api --method POST "/repos/$REPO/labels" --input - >/dev/null
      echo "Created label: $name"
    fi
  done < <(jq -c '.labels[]' "$LABELS_FILE")
}

upsert_milestones() {
  echo "Applying 12-month milestone structure to $REPO"
  existing="$(gh api --paginate "/repos/$REPO/milestones?state=all&per_page=100" | jq -s 'add')"

  while IFS= read -r item; do
    title="$(jq -r '.title' <<<"$item")"
    description="$(jq -r '.description' <<<"$item")"
    state="$(jq -r '.state' <<<"$item")"
    due_on="$(jq -r '.due_on' <<<"$item")"
    number="$(jq -r --arg title "$title" '.[] | select(.title == $title) | .number' <<<"$existing" | head -n 1)"

    payload="$(jq -n \
      --arg title "$title" \
      --arg description "$description" \
      --arg state "$state" \
      --arg due_on "$due_on" \
      '{title:$title,description:$description,state:$state,due_on:$due_on}')"

    if [[ -n "$number" ]]; then
      gh api --method PATCH "/repos/$REPO/milestones/$number" --input - <<<"$payload" >/dev/null
      echo "Updated milestone #$number: $title"
    else
      gh api --method POST "/repos/$REPO/milestones" --input - <<<"$payload" >/dev/null
      echo "Created milestone: $title"
    fi
  done < <(jq -c '.milestones[]' "$MILESTONES_FILE")
}

milestone_number_by_title() {
  local title="$1"
  gh api --paginate "/repos/$REPO/milestones?state=all&per_page=100" \
    | jq -s -r --arg title "$title" 'add | .[] | select(.title == $title) | .number' \
    | head -n 1
}

classify_existing_epics() {
  echo "Classifying canonical milestone issues"

  declare -A issue_milestone=(
    [1]="02 — UX, Figma Design System and Clinical Workflow Validation"
    [2]="03 — Next.js Role-Based Portal Application"
    [3]="04 — Azure SQL Data Platform and Application APIs"
    [4]="07 — Azure Infrastructure, DevSecOps and Observability"
  )

  declare -A issue_labels
  issue_labels[1]='["type: epic","priority: critical","area: ux-figma","status: needs-review","env: demo","accessibility","localisation","clinical-safety"]'
  issue_labels[2]='["type: epic","priority: high","area: frontend","status: ready","env: demo","accessibility","localisation","sasL"]'
  issue_labels[3]='["type: epic","priority: high","area: azure-sql","area: api","area: entra","area: teams","area: whatsapp","area: fhir","status: ready","env: development","popia","audit","clinical-safety"]'
  issue_labels[4]='["type: epic","priority: high","area: infrastructure","area: devops","area: security","area: operations","status: ready","env: demo","popia","audit"]'

  for issue in 1 2 3 4; do
    milestone_title="${issue_milestone[$issue]}"
    milestone_number="$(milestone_number_by_title "$milestone_title")"
    labels="${issue_labels[$issue]}"

    jq -n \
      --argjson milestone "$milestone_number" \
      --argjson labels "$labels" \
      '{milestone:$milestone,labels:$labels}' \
      | gh api --method PATCH "/repos/$REPO/issues/$issue" --input - >/dev/null
    echo "Updated issue #$issue"
  done
}

write_summary() {
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    {
      echo "## Project-management bootstrap"
      echo
      echo "- Controlled labels applied from \`.github/project-management/labels.json\`."
      echo "- Nine 12-month milestones applied from \`.github/project-management/milestones.json\`."
      echo "- Existing canonical issues #1–#4 classified and assigned."
    } >> "$GITHUB_STEP_SUMMARY"
  fi
}

upsert_labels
upsert_milestones
classify_existing_epics
write_summary
