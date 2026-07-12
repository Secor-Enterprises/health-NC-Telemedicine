# GitHub Project Management Baseline

## Purpose

This document defines the canonical engineering work-management structure for Secor HealthConnect. GitHub Issues, Milestones and the organisation-level GitHub Project are the engineering source of truth. Azure Boards may consume synchronised or exported work items where a Microsoft programme-management requirement exists, but it must not become an independently maintained duplicate backlog.

## Provisioned assets

The bootstrap automation manages:

- 49 controlled repository labels
- Nine structured GitHub Milestones covering 13 July 2026 to 9 July 2027
- An organisation Project named **Secor HealthConnect Enterprise Delivery**
- Sixteen custom Project fields
- Classification and milestone assignment for canonical issues #1–#4

Configuration is stored under `.github/project-management/` and is designed to be idempotent.

## Project workflow

Use the custom **Workflow** field for the board columns:

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

Labels classify work. They must not be used as a substitute for Project status, sprint, effort, ownership or target dates.

## Project fields

| Field | Type | Purpose |
|---|---|---|
| Epic | Text | Parent epic or programme outcome |
| Milestone | Built-in | GitHub Milestone association |
| Sprint | Single select | Sprint 01 through Sprint 24 |
| Workflow | Single select | Kanban delivery state |
| Workstream | Single select | Primary engineering or governance domain |
| Priority | Single select | Critical, High, Medium or Low |
| Risk rating | Single select | Delivery, safety, security or compliance risk |
| Story points | Number | Relative delivery effort |
| Target environment | Single select | Development, Test, Demo, Pilot or Production |
| Clinical owner | Text | Accountable clinical representative |
| Technical owner | Text | Accountable technical representative |
| Compliance owner | Text | Accountable privacy, assurance or governance representative |
| Planned start | Date | Baseline start date |
| Planned finish | Date | Baseline completion date |
| Delivery confidence | Single select | Green, Amber, Red or Not assessed |
| Release | Text | Target release or deployment train |
| Evidence link | Text | Test, approval, audit or delivery evidence |

GitHub automatically provides built-in fields such as Title, Assignees, Labels, Repository and Milestone. Do not create duplicate custom versions of those fields.

## Required views

GitHub currently does not expose complete Project view creation and configuration through the supported CLI/API surface. Create the following views in the Project UI using `.github/project-management/project.json` as the controlled definition.

| View | Layout | Grouping | Primary use |
|---|---|---|---|
| Executive Roadmap | Roadmap | Milestone | Timeline, confidence and executive reporting |
| Programme Backlog | Table | Workstream | Prioritisation and refinement |
| Current Sprint | Board | Workflow | Active two-week sprint |
| Next Sprint | Board | Workflow | Ready and proposed work |
| Architecture and ADRs | Table | Workstream | Decisions and architecture documentation |
| Security and Compliance | Board | Workflow | Security, POPIA, audit and clinical-safety controls |
| Integrations | Board | Workflow | Teams, WhatsApp and FHIR delivery |
| Azure Platform | Board | Workflow | Azure SQL, infrastructure and DevSecOps |
| Testing and Defects | Board | Workflow | Test execution and defect management |
| Governance and Reporting | Table | Milestone | Governance actions, reports and decisions |
| Pilot Readiness | Table | Workflow | Pilot gate evidence and readiness actions |
| Production Readiness | Table | Workflow | Production assurance and operational handover |

## Milestone calendar

| # | Milestone | Planned start | Planned completion |
|---:|---|---:|---:|
| 1 | Programme Mobilisation, Governance and Discovery | 13 Jul 2026 | 14 Aug 2026 |
| 2 | UX, Figma Design System and Clinical Workflow Validation | 27 Jul 2026 | 25 Sep 2026 |
| 3 | Next.js Role-Based Portal Application | 24 Aug 2026 | 20 Nov 2026 |
| 4 | Azure SQL Data Platform and Application APIs | 5 Oct 2026 | 15 Jan 2027 |
| 5 | Microsoft Entra ID, Enterprise Application and RBAC | 16 Nov 2026 | 26 Feb 2027 |
| 6 | Teams, WhatsApp and HL7 FHIR Integrations | 14 Dec 2026 | 9 Apr 2027 |
| 7 | Azure Infrastructure, DevSecOps and Observability | 11 Jan 2027 | 14 May 2027 |
| 8 | Pilot Readiness, Testing, Training and Demonstration | 12 Apr 2027 | 18 Jun 2027 |
| 9 | Production Readiness, Operational Handover and Scale-Out | 17 May 2027 | 9 Jul 2027 |

The milestones intentionally overlap because architecture, security, integration and operational work must progress continuously rather than as isolated waterfall stages.

## Sprint model

Use 24 two-week sprints. Recommended capacity allocation:

- 65% planned product and platform delivery
- 15% defects and technical debt
- 10% security, privacy, audit and clinical-safety work
- 10% discovery, support and unplanned work

Every sprint requires a goal, committed issues, dependencies, test evidence, security/clinical review requirements and retrospective actions.

## Governance cadence

- Weekly PMO and engineering delivery sync
- Weekly RAID and security-defect review
- Fortnightly sprint planning, review and retrospective
- Fortnightly architecture and clinical workflow review
- Monthly programme status, budget, benefits, security and compliance reporting
- Monthly Steering Committee pack issued at least three business days before the meeting
- Quarterly executive steering, access certification, architecture governance and audit evidence review

## Reporting service levels

| Deliverable | Frequency | Target SLA |
|---|---|---|
| Weekly delivery summary | Weekly | Friday by 15:00 |
| RAID update | Weekly | Before the programme review |
| Sprint report | Fortnightly | Within one business day of sprint close |
| Programme status report | Monthly | Third business day of the following month |
| Steering Committee pack | Monthly | Three business days before the meeting |
| Security and compliance report | Monthly | Within five business days of month-end |
| Azure cost and capacity report | Monthly | Within three business days of billing close |
| Access certification | Quarterly | Within ten business days of quarter-end |
| Executive KPI and benefits pack | Quarterly | Within seven business days of quarter-end |
| Major incident initial report | Per incident | Within 24 hours |
| Major incident root-cause analysis | Per incident | Within five business days |

Contractual Department of Health obligations take precedence where they specify stricter reporting or incident SLAs.

## Project token requirement

Repository labels and milestones use the workflow `GITHUB_TOKEN`. Organisation-level GitHub Projects require a token with Projects write access.

1. Create a fine-grained token or GitHub App token with organisation Projects read/write access.
2. Store it as the repository Actions secret `PROJECTS_TOKEN`.
3. Run **Bootstrap Project Management** from the Actions tab.

The workflow will create or update the Project fields and add all open repository issues. The view definitions remain controlled in `project.json` and must be configured in the Project UI.

## Change control

All taxonomy, milestone and Project-field changes must be proposed through pull requests. Direct manual changes must be reconciled back into the JSON definitions to prevent configuration drift.
