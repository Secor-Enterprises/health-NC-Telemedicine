# Stakeholder Register, RACI and Escalation Ownership

## Stakeholder register

| Stakeholder group | Interest / authority | Expected contribution | Engagement cadence | Named representative |
|---|---|---|---|---|
| Secor Enterprises executive sponsor | Programme sponsorship, commercial and delivery authority | Approve scope, priorities, funding and escalations | Monthly Steering Committee | To be formally nominated |
| Programme manager / repository owner | Day-to-day delivery and repository governance | Maintain plan, backlog, RAID, reports and decisions | Weekly and fortnightly | Raydo Matthee / delegate |
| Northern Cape Department of Health sponsor | Policy, operational and public-value authority | Confirm strategic alignment, pilot scope and acceptance gates | Monthly / stage gates | To be nominated by client |
| Provincial clinical governance lead | Clinical safety and workflow authority | Validate clinical workflows, risks and acceptance evidence | Fortnightly clinical review | To be nominated |
| District and facility management | Operational readiness and local constraints | Provide facility, staffing, scheduling and connectivity inputs | Fortnightly / pilot cadence | To be nominated per district/facility |
| Doctors and specialists | Clinical-user requirements | Validate consultation, referral, documentation and escalation workflows | Sprint reviews and clinical workshops | Representative group required |
| Nurses and allied health professionals | Intake, triage and care-coordination requirements | Validate vitals, handoff, vaccination and observation workflows | Sprint reviews and clinical workshops | Representative group required |
| Patient/community representatives | Accessibility, language and experience requirements | Validate consent, access, usability and communication patterns | Design and pilot checkpoints | Representative group required |
| Information officer / privacy lead | POPIA and information-governance authority | Review lawful processing, consent, retention, sharing and incident controls | Monthly / stage gates | To be nominated |
| Security and identity lead | Cybersecurity and access-control authority | Approve Entra, RBAC, logging, privileged access and security controls | Fortnightly / monthly | To be nominated |
| Enterprise / solution architect | Technical design authority | Maintain architecture, ADRs, NFRs and integration boundaries | Fortnightly Architecture Review Board | To be nominated |
| Azure platform / DevSecOps lead | Cloud, CI/CD and observability delivery | Implement and operate environments, pipelines and telemetry | Weekly engineering review | To be nominated |
| Data / interoperability lead | Azure SQL, reporting and FHIR authority | Govern data model, quality, terminology and interfaces | Fortnightly data/integration review | To be nominated |
| Change, training and support lead | Adoption and operational readiness | Prepare training, support model, communications and handover | Monthly then weekly before pilot | To be nominated |
| Monitoring and evaluation lead | Benefits and KPI assurance | Define measures, baselines, data quality and reporting | Monthly / quarterly | To be nominated |
| Suppliers and integration partners | Specialist product and service inputs | Provide approved interfaces, licensing, support and assurance evidence | As required / supplier review | To be nominated by supplier |

## RACI legend

- **R** — Responsible for completing the work
- **A** — Accountable for final decision or acceptance
- **C** — Consulted before decision or delivery
- **I** — Informed of decision or progress

## Programme RACI

| Deliverable / decision | Executive sponsor | Programme manager | Clinical lead | Architecture lead | Security/privacy | Platform lead | Facility reps | M&E lead |
|---|---|---|---|---|---|---|---|---|
| Programme charter and scope | A | R | C | C | C | I | C | C |
| Benefits case and KPI catalogue | A | R | C | I | C | I | C | R |
| Delivery roadmap and milestones | A | R | C | C | C | C | I | I |
| Figma and workflow acceptance | I | R | A | C | C | C | C | I |
| Architecture and ADR approval | I | C | C | A/R | C | C | I | I |
| Azure SQL and API design | I | C | C | A | C | R | I | C |
| Entra ID, RBAC and privileged access | I | C | C | C | A | R | I | I |
| Teams, WhatsApp and FHIR integrations | I | R | C | A | C | R | C | I |
| POPIA and data-governance controls | I | C | C | C | A/R | C | I | C |
| Clinical-safety assessment | I | C | A/R | C | C | I | C | I |
| CI/CD and Azure environments | I | C | I | C | C | A/R | I | I |
| Pilot readiness | A | R | A | C | A | R | R | C |
| Production readiness | A | R | A | A | A | R | C | C |
| Incident response | I | A | C | C | R | R | I | I |
| Monthly programme report | I | A/R | C | C | C | C | I | C |
| Steering Committee decision log | A | R | C | C | C | I | I | I |

## Decision rights

- Scope, budget, pilot and production decisions require executive-sponsor approval.
- Clinical workflow and patient-safety decisions require clinical-governance approval.
- Architecture standards and exceptions require Architecture Review Board approval.
- Privacy, security and access-control decisions require the designated information/security authority.
- Repository backlog sequencing and sprint commitment are managed by the programme/product delivery team within approved scope.
- No individual technical contributor may approve their own production security exception.

## Escalation model

| Severity | Examples | Initial owner | Escalation target | Target acknowledgement |
|---|---|---|---|---|
| P1 / Critical | Patient-safety concern, suspected breach, production outage, unauthorised data exposure | Incident commander / security or clinical lead | Executive sponsor, information officer, clinical authority | 15 minutes |
| P2 / High | Major integration failure, high-risk defect, milestone-threatening dependency | Programme manager | Technical/clinical lead and Steering Committee sponsor | 30 minutes |
| P3 / Medium | Sprint blocker, test-environment issue, unresolved design decision | Workstream lead | Programme manager / Architecture Review Board | 4 business hours |
| P4 / Low | Documentation gap, minor defect, deferred improvement | Issue owner | Workstream lead | 1 business day |

## Governance dependency

Named external representatives remain a mobilisation dependency. Their absence does not block repository-bootstrap completion, but it blocks formal pilot and production approval. This dependency is carried in the RAID register and must be resolved before the relevant stage gates.
