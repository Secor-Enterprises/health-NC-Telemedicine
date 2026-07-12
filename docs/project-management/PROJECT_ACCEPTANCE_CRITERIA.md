# Enterprise GitHub Project Acceptance Criteria

## Purpose

This checklist is the closure standard for the organisation-level GitHub Project **Secor HealthConnect Enterprise Delivery**.

The Project is the engineering source of truth. Azure Boards may receive synchronised or exported work items where required for Microsoft programme reporting, but it must not be maintained as a separate competing backlog.

## 1. Custom-field verification

The following custom fields must exist exactly as defined in `.github/project-management/project.json`:

- [ ] Epic
- [ ] Workflow
- [ ] Sprint
- [ ] Workstream
- [ ] Priority
- [ ] Risk rating
- [ ] Story points
- [ ] Target environment
- [ ] Clinical owner
- [ ] Technical owner
- [ ] Compliance owner
- [ ] Planned start
- [ ] Planned finish
- [ ] Delivery confidence
- [ ] Release
- [ ] Evidence link

### Acceptance criteria

- [ ] All 16 custom fields are visible in Project settings.
- [ ] Single-select fields contain the controlled options from `project.json`.
- [ ] No duplicate custom field named `Milestone` exists.
- [ ] GitHub's built-in `Milestone` field remains available.
- [ ] GitHub's built-in Title, Assignees, Labels and Repository fields remain unchanged.

## 2. Repository-issue verification

### Acceptance criteria

- [ ] Every currently open issue in `Secor-Enterprises/health-NC-Telemedicine` appears as a Project item.
- [ ] Issues #1–#4 are present and retain their GitHub Milestone assignments.
- [ ] Governance issue #10 is present.
- [ ] No duplicate draft items exist for issues already linked by URL.
- [ ] Closed duplicate issues #5 and #6 are excluded from active sprint views.
- [ ] Newly opened issues are added by the bootstrap workflow or project auto-add workflow.

## 3. Controlled Project views

Create and verify the following 12 views.

| View | Layout | Filter | Grouping | Sort |
|---|---|---|---|---|
| Executive Roadmap | Roadmap | `is:open` | Milestone | Planned finish |
| Programme Backlog | Table | `-Workflow:"Done"` | Workstream | Priority |
| Current Sprint | Board | `Sprint:"Sprint 01" -Workflow:"Done"` | Workflow | Priority |
| Next Sprint | Board | `Sprint:"Sprint 02" -Workflow:"Done"` | Workflow | Priority |
| Architecture and ADRs | Table | `label:"type: decision",label:"type: documentation"` | Workstream | Priority |
| Security and Compliance | Board | `label:"area: security",label:"area: compliance",label:popia` | Workflow | Priority |
| Integrations | Board | `label:"area: teams",label:"area: whatsapp",label:"area: fhir"` | Workflow | Priority |
| Azure Platform | Board | `label:"area: azure-sql",label:"area: infrastructure",label:"area: devops"` | Workflow | Priority |
| Testing and Defects | Board | `label:"area: testing",label:"type: defect"` | Workflow | Priority |
| Governance and Reporting | Table | `label:"area: governance",label:"type: governance"` | Milestone | Planned finish |
| Pilot Readiness | Table | `label:"env: pilot"` | Workflow | Priority |
| Production Readiness | Table | `label:"env: production"` | Workflow | Priority |

### Acceptance criteria

- [ ] All 12 views exist with the names above.
- [ ] Current Sprint is filtered to Sprint 01.
- [ ] Next Sprint is filtered to Sprint 02.
- [ ] Both sprint views exclude `Workflow = Done`.
- [ ] Board views use `Workflow` for Kanban grouping.
- [ ] Executive Roadmap uses the built-in `Milestone` field.
- [ ] Table views expose owner, priority, risk, dates and evidence fields where relevant.
- [ ] View filters are checked against representative issues.

## 4. Workflow field and Kanban columns

The custom `Workflow` single-select field must contain:

1. Intake
2. Triage
3. Approved
4. Ready
5. In Progress
6. In Review
7. Security Review
8. Clinical Review
9. Testing
10. Blocked
11. Ready for Release
12. Done

### Acceptance criteria

- [ ] `Workflow` is the grouping field for Current Sprint, Next Sprint, Security and Compliance, Integrations, Azure Platform, Testing and Defects, Pilot Readiness and Production Readiness.
- [ ] Issues move between columns by changing the Workflow field, not by changing labels.
- [ ] Status labels remain classification or exception indicators only.
- [ ] Done items are excluded from active sprint views but retained for reporting.

## 5. Built-in Milestone confirmation

### Acceptance criteria

- [ ] The Project exposes GitHub's built-in `Milestone` field.
- [ ] No custom Milestone field is created.
- [ ] The nine repository milestones are selectable from Project items.
- [ ] Executive Roadmap groups or slices work by the built-in Milestone field.
- [ ] Milestone dates remain managed in the repository Milestones feature.

## 6. Project URL documentation

The direct Project URL must be recorded in at least one version-controlled location:

- `README.md`, and/or
- `docs/project-management/GITHUB_PROJECT_SETUP.md`

### Acceptance criteria

- [ ] The recorded URL opens the exact Project, not the generic organisation Projects directory.
- [ ] The link text is `Secor HealthConnect Enterprise Delivery`.
- [ ] The URL is accessible to intended programme stakeholders.
- [ ] Issue #10 contains the same URL as verification evidence.

## 7. Automation verification

### Acceptance criteria

- [ ] `Bootstrap Project Management` completes successfully.
- [ ] The labels-and-milestones job completes successfully.
- [ ] The organisation-project job confirms the Project exists.
- [ ] The workflow confirms all expected custom fields exist.
- [ ] The workflow confirms all open issues are Project items.
- [ ] The workflow posts its verification report to issue #10.
- [ ] Re-running the workflow creates no duplicate fields, milestones or items.

## 8. Final closure criteria

Issue #10 may be closed only when:

- [ ] All automated verification checks pass.
- [ ] All 12 views are visually verified in GitHub.
- [ ] Current Sprint and Next Sprint filters are active.
- [ ] Workflow is confirmed as the Kanban grouping field.
- [ ] Milestone remains the built-in GitHub field.
- [ ] The direct Project URL is committed to repository documentation.
- [ ] Screenshots or equivalent evidence are attached to issue #10.
- [ ] The Project owner accepts GitHub Projects as the engineering system of record.
