# Reporting Calendar and Service Levels

## Reporting principles

- Reports must use a consistent reporting period, status date and RAG method.
- Every metric must identify its owner, source, refresh date and known limitation.
- Programme reporting must distinguish synthetic demonstration values from validated operational data.
- Clinical, privacy, security and financial exceptions must not be hidden by aggregate RAG status.
- Contractual or Department of Health reporting obligations override this baseline where stricter.

## Delivery calendar

| Artefact / forum | Frequency | Owner | Distribution / attendees | SLA |
|---|---|---|---|---|
| Engineering and delivery sync | Weekly | Technical lead | Delivery team | Agenda before meeting; actions within 1 business day |
| PMO status and RAID review | Weekly | Programme manager | Workstream leads | Friday by 15:00 |
| Security defect and dependency triage | Weekly | Security lead | Security, platform and delivery leads | Updated issue status within 1 business day |
| Backlog refinement | Fortnightly | Product/programme lead | Product, clinical and technical representatives | At least 2 business days before sprint planning |
| Sprint planning | Fortnightly | Delivery lead | Sprint team | Sprint goal and commitments recorded same day |
| Sprint review and demonstration | Fortnightly | Delivery lead | Stakeholders | Evidence and outcomes within 1 business day |
| Sprint retrospective | Fortnightly | Scrum/delivery lead | Sprint team | Actions recorded within 1 business day |
| Architecture Review Board | Fortnightly | Architecture lead | Architecture, security, data and platform leads | ADR decision within 2 business days |
| Clinical workflow and safety review | Fortnightly | Clinical lead | Clinical, product and design representatives | Findings within 2 business days |
| Integration working group | Fortnightly | Integration lead | Teams, WhatsApp, FHIR, API and identity owners | Dependency/actions within 2 business days |
| Programme status report | Monthly | Programme manager | Steering Committee | Third business day of following month |
| Steering Committee pack | Monthly | Programme manager | Steering Committee | At least 3 business days before meeting |
| Security and compliance report | Monthly | Security/privacy lead | Steering Committee and control owners | Within 5 business days of month-end |
| Azure cost and capacity report | Monthly | Azure platform lead | Programme and finance owners | Within 3 business days of billing close |
| Benefits and KPI report | Monthly / quarterly | M&E lead | Steering Committee | Monthly summary; quarterly pack within 7 business days |
| Access review and certification | Quarterly | Identity/security lead | System and business owners | Within 10 business days of quarter-end |
| Architecture health review | Quarterly | Architecture lead | Architecture Review Board | Before quarterly roadmap approval |
| Audit evidence pack | Quarterly | Compliance lead | Audit and Steering Committee | Within 10 business days of quarter-end |
| Supplier and licence review | Quarterly | Commercial/programme lead | Supplier owners | Within 10 business days of quarter-end |
| Disaster-recovery / resilience exercise | Quarterly or risk-based | Operations lead | Platform, security and business owners | Report within 5 business days of exercise |
| Annual programme review | Annual | Executive sponsor / programme manager | Executive governance | Within 20 business days of year-end |

## Incident-reporting SLAs

| Severity | Examples | Acknowledge | Initial response | Update cadence | Initial report | RCA target |
|---|---|---:|---:|---:|---:|---:|
| P1 Critical | Patient-safety event, suspected personal-data breach, critical outage, unauthorised disclosure | 15 minutes | 30 minutes | Every 30 minutes | Within 24 hours | Within 5 business days |
| P2 High | Major degradation, failed critical integration, high-risk vulnerability | 30 minutes | 2 hours | Every 2 hours | Within 1 business day | Within 7 business days |
| P3 Medium | Limited service impact, non-critical workflow failure | 4 business hours | 1 business day | Daily | Within 2 business days | As required, normally 10 business days |
| P4 Low | Minor defect, documentation or cosmetic issue | 1 business day | 3 business days | Weekly | Included in sprint/reporting cycle | Not normally required |

A suspected personal-information breach must be escalated immediately to the designated information officer and security authority. Statutory or contractual notification decisions remain with authorised governance roles.

## Monthly programme report minimum content

1. Executive summary and decision requests
2. Milestone and sprint progress
3. Scope, schedule, budget and resource status
4. Top risks, issues, assumptions and dependencies
5. Security, privacy, clinical safety and audit status
6. Architecture and integration decisions
7. Quality, testing and defect trends
8. Azure cost, capacity and environment health
9. Benefits and KPI status, with data-quality notes
10. Stakeholder, training and change-management status
11. Actions and approvals required

## RAG definitions

- **Green:** On plan; no material unmitigated risk to the committed outcome.
- **Amber:** Outcome remains achievable but requires management action, trade-off or dependency resolution.
- **Red:** Outcome or date is not achievable without executive intervention or re-baselining.
- **Grey:** Not started, not assessed or data unavailable. Grey must not be used to conceal an exception.

## Twelve-month governance schedule

| Month | Primary governance focus |
|---|---|
| Jul–Aug 2026 | Mobilisation, charter, RACI, discovery, initial architecture and RAID |
| Aug–Sep 2026 | UX, clinical workflow, accessibility and localisation acceptance |
| Sep–Nov 2026 | Portal implementation, sprint demonstrations and quality baseline |
| Oct 2026–Jan 2027 | Azure SQL, APIs, data governance, security and migration controls |
| Nov 2026–Feb 2027 | Entra enterprise application, RBAC and access-governance reviews |
| Dec 2026–Apr 2027 | Teams, WhatsApp and FHIR integration reviews |
| Jan–May 2027 | Azure infrastructure, DevSecOps, cost, monitoring and resilience |
| Apr–Jun 2027 | UAT, clinical validation, training, support and pilot readiness |
| May–Jul 2027 | Production readiness, operational handover and scale-out decision |

## Approval status

The repository reporting cadence and SLAs are approved as the programme baseline. Named external stakeholders may impose additional or stricter requirements before pilot or production operation.
