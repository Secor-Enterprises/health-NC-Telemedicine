# Project Management Configuration

This directory contains the controlled configuration used to bootstrap and verify the Secor HealthConnect enterprise GitHub Project.

- `labels.json` — repository label taxonomy
- `milestones.json` — nine 12-month delivery milestones
- `project.json` — Project title, custom fields, workflow options and controlled view definitions

The configuration is applied by `.github/workflows/bootstrap-project-management.yml` and the scripts under `scripts/`.

Current controlled sprint views:

- Current Sprint: `Sprint:"Sprint 01" -Workflow:"Done"`
- Next Sprint: `Sprint:"Sprint 02" -Workflow:"Done"`

The `Workflow` custom field is used for Kanban grouping. `Milestone` remains GitHub's built-in field and must not be recreated as a custom field.
