# GitHub Project View Configuration Runbook

## Objective

Configure and verify the 12 controlled views for **Secor HealthConnect Enterprise Delivery**.

## Common board configuration

For every board view:

1. Open the Project.
2. Select **New view**.
3. Choose the required layout.
4. Name the view exactly as specified below.
5. Apply the controlled filter.
6. Set **Group by** to the controlled field.
7. Set sorting where specified.
8. Save the view.

Use the custom **Workflow** field for Kanban columns. Do not use labels as the board status mechanism.

## Controlled views

### 1. Executive Roadmap

- Layout: Roadmap
- Filter: `is:open`
- Group or slice by: built-in `Milestone`
- Sort: `Planned finish`
- Display: Title, Milestone, Planned start, Planned finish, Delivery confidence, Technical owner

### 2. Programme Backlog

- Layout: Table
- Filter: `-Workflow:"Done"`
- Group by: `Workstream`
- Sort: `Priority`
- Display: Title, Epic, Milestone, Workflow, Priority, Risk rating, Story points, owners, dates

### 3. Current Sprint

- Layout: Board
- Filter: `Sprint:"Sprint 01" -Workflow:"Done"`
- Group by: `Workflow`
- Sort: `Priority`
- Display on cards: Priority, Workstream, Story points, Technical owner, Risk rating

### 4. Next Sprint

- Layout: Board
- Filter: `Sprint:"Sprint 02" -Workflow:"Done"`
- Group by: `Workflow`
- Sort: `Priority`
- Display on cards: Priority, Workstream, Story points, Technical owner, Risk rating

### 5. Architecture and ADRs

- Layout: Table
- Filter: `label:"type: decision",label:"type: documentation"`
- Group by: `Workstream`
- Sort: `Priority`
- Display: Title, Workflow, Technical owner, Planned finish, Evidence link

### 6. Security and Compliance

- Layout: Board
- Filter: `label:"area: security",label:"area: compliance",label:popia`
- Group by: `Workflow`
- Sort: `Priority`
- Display on cards: Risk rating, Compliance owner, Target environment, Evidence link

### 7. Integrations

- Layout: Board
- Filter: `label:"area: teams",label:"area: whatsapp",label:"area: fhir"`
- Group by: `Workflow`
- Sort: `Priority`
- Display on cards: Workstream, Technical owner, Target environment, Release

### 8. Azure Platform

- Layout: Board
- Filter: `label:"area: azure-sql",label:"area: infrastructure",label:"area: devops"`
- Group by: `Workflow`
- Sort: `Priority`
- Display on cards: Workstream, Risk rating, Target environment, Technical owner

### 9. Testing and Defects

- Layout: Board
- Filter: `label:"area: testing",label:"type: defect"`
- Group by: `Workflow`
- Sort: `Priority`
- Display on cards: Priority, Risk rating, Target environment, Release

### 10. Governance and Reporting

- Layout: Table
- Filter: `label:"area: governance",label:"type: governance"`
- Group by: built-in `Milestone`
- Sort: `Planned finish`
- Display: Title, Workflow, Priority, Compliance owner, Planned finish, Evidence link

### 11. Pilot Readiness

- Layout: Table
- Filter: `label:"env: pilot"`
- Group by: `Workflow`
- Sort: `Priority`
- Display: Title, Workstream, owners, Risk rating, Planned finish, Evidence link

### 12. Production Readiness

- Layout: Table
- Filter: `label:"env: production"`
- Group by: `Workflow`
- Sort: `Priority`
- Display: Title, Workstream, owners, Risk rating, Planned finish, Release, Evidence link

## Validation checklist

- [ ] All view names match exactly.
- [ ] Current Sprint uses Sprint 01.
- [ ] Next Sprint uses Sprint 02.
- [ ] Current and Next Sprint exclude Done.
- [ ] Kanban board views use Workflow for grouping.
- [ ] Executive Roadmap uses the built-in Milestone field.
- [ ] No custom Milestone field exists.
- [ ] Filters return representative issues.
- [ ] Required card and table fields are visible.
- [ ] Screenshots of the field list and core views are attached to issue #10.
