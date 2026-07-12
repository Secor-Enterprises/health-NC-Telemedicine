# Governance Operating Model

## Governance objective

Establish clear decision rights, traceable approvals, timely reporting and controlled escalation across product, clinical, technical, security, privacy, operational and executive workstreams.

## Governance forums

### Executive Steering Committee

- Purpose: strategic direction, scope, budget, benefits, risk acceptance and stage-gate decisions
- Cadence: monthly and at mobilisation, pilot and production gates
- Chair: executive sponsor
- Core attendees: programme manager, Department of Health sponsor, clinical lead, architecture lead, security/privacy lead, M&E lead
- Quorum: chair or delegate, programme manager, and at least one clinical plus one technical/security authority
- Inputs: programme status report, RAID summary, financial/cost report, benefits dashboard, decision requests
- Outputs: approved decisions, actions, accepted risks and stage-gate outcomes

### Programme Management Office Review

- Purpose: delivery coordination, schedule, dependencies, RAID, reporting and action control
- Cadence: weekly
- Chair: programme manager
- Outputs: updated plan, RAID, action log, dependency escalation and weekly summary

### Sprint Planning, Review and Retrospective

- Purpose: commit two-week sprint outcomes, demonstrate completed work and improve delivery practice
- Cadence: fortnightly
- Chair: product/programme delivery lead
- Required evidence: sprint goal, committed issues, acceptance criteria, test evidence and retrospective actions

### Architecture Review Board

- Purpose: approve architecture baselines, ADRs, NFRs, technology exceptions and integration boundaries
- Cadence: fortnightly and on demand for critical decisions
- Chair: architecture lead
- Outputs: approved ADRs, conditions, technical risks and follow-up actions

### Clinical Workflow and Safety Review

- Purpose: validate workflows, clinical risks, alerting, escalation and human-accountability boundaries
- Cadence: fortnightly during design/build; weekly before pilot
- Chair: clinical-governance lead
- Outputs: workflow approval, clinical-safety actions and residual-risk decisions

### Security, Privacy and Compliance Review

- Purpose: review POPIA, identity, access, threat, vulnerability, logging, retention and incident controls
- Cadence: monthly, with weekly defect triage during hardening
- Chair: information/security authority
- Outputs: compliance actions, security acceptance, exceptions and evidence requirements

### Data and Integration Working Group

- Purpose: coordinate Azure SQL, APIs, Teams, WhatsApp, FHIR, terminology and data-quality decisions
- Cadence: fortnightly
- Chair: data/interoperability lead
- Outputs: interface decisions, mappings, test plans, data-quality actions and dependency escalations

### Monitoring, Evaluation and Benefits Forum

- Purpose: define baselines, formulas, data quality, benefits and reporting integrity
- Cadence: monthly and quarterly
- Chair: M&E lead
- Outputs: KPI catalogue, validated formulas, benefits report and data-quality actions

### Pilot and Operational Readiness Review

- Purpose: assess people, process, technology, support, training, facilities, connectivity and evidence before pilot or production
- Cadence: monthly from Month 8; weekly during final readiness window
- Chair: programme manager / operations lead
- Outputs: readiness score, open conditions and go/no-go recommendation

## Decision and action control

- Every material decision must be recorded in an ADR, decision log or meeting record.
- Every action must have an owner and target date.
- Accepted risks require an accountable approver and review date.
- Production-impacting changes require change approval, successful automated checks, rollback planning and post-deployment validation.
- Clinical, security and privacy approvals cannot be substituted by product-owner approval.

## Meeting artefact standard

Each formal forum must capture:

1. Date, attendees and quorum
2. Agenda and inputs
3. Decisions and rationale
4. Risks and issues raised
5. Actions, owners and due dates
6. Evidence links
7. Next meeting date

## Governance checkpoints

### Mobilisation gate

Required evidence:

- Programme charter and benefits case
- Stakeholder register and RACI
- Governance forums and reporting calendar
- Initial RAID register
- Discovery findings
- Architecture, security and data-classification baseline
- Prioritised backlog for Milestones 02 and 03

### UX acceptance gate

Required evidence:

- Figma prototype
- Clinical workflow review
- Accessibility and localisation review
- Design-system handoff

### Integration readiness gate

Required evidence:

- Approved API and data contracts
- Identity and RBAC validation
- Teams/WhatsApp/FHIR test evidence
- Security/privacy approval

### Pilot go/no-go gate

Required evidence:

- UAT and clinical validation
- Security testing and remediation
- Training and support readiness
- Facility and connectivity readiness
- Approved pilot data and consent model
- Incident and escalation readiness

### Production readiness gate

Required evidence:

- Production architecture and operational acceptance
- Penetration-test remediation
- Backup and disaster-recovery evidence
- Access certification
- Compliance evidence pack
- Contractual SLA and support ownership

## Current acceptance

The repository owner has accepted the Milestone 01 repository-mobilisation baseline. External Steering Committee and departmental approvals remain formal later-stage gates and are tracked as dependencies rather than being represented as already granted.
