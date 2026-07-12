# GitHub Project Verification Status

This document records the acceptance status for the organisation-level Project **Secor HealthConnect Enterprise Delivery**.

## Current status

- Project secret configured: Confirmed in issue #10
- Bootstrap workflow executed: Confirmed in issue #10
- Project existence: Confirmed in issue #10
- Custom-field verification: Automated verification pending latest workflow run
- Open-issue membership verification: Automated verification pending latest workflow run
- Twelve controlled views: Manual configuration and visual verification required
- Current Sprint filter: Controlled definition is `Sprint:"Sprint 01" -Workflow:"Done"`
- Next Sprint filter: Controlled definition is `Sprint:"Sprint 02" -Workflow:"Done"`
- Kanban grouping: Controlled definition uses `Workflow`
- Milestone field: Must remain GitHub's built-in field
- Direct Project URL: Pending automated verification report and documentation update

## Evidence sources

- `.github/project-management/project.json`
- `docs/project-management/GITHUB_PROJECT_SETUP.md`
- `docs/project-management/PROJECT_ACCEPTANCE_CRITERIA.md`
- `docs/project-management/VIEW_CONFIGURATION_RUNBOOK.md`
- GitHub issue #10
- `Bootstrap Project Management` workflow summary

## Closure rule

This status may be changed to **Accepted** only after:

1. Automated field verification reports no missing fields.
2. Automated issue-membership verification reports no missing open issues.
3. All 12 views are configured and visually checked.
4. Current and Next Sprint filters are active.
5. Workflow is used for Kanban grouping.
6. Milestone remains the built-in GitHub field.
7. The direct Project URL is committed to project documentation.
8. Evidence is attached to issue #10.
