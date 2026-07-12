# Secor HealthConnect Programme Charter and Benefits Case

## Document control

- Programme: Secor HealthConnect — Northern Cape Telemedicine
- Repository: `Secor-Enterprises/health-NC-Telemedicine`
- Baseline date: 12 July 2026
- Initial delivery horizon: 13 July 2026 to 9 July 2027
- Executive sponsor: Secor Enterprises representative — named appointment required
- Programme lead: Raydo Matthee / delegated programme manager
- Status: Repository mobilisation baseline approved for execution

## Purpose

Secor HealthConnect is an enterprise digital-health and telemedicine programme intended to improve access to clinical services across geographically dispersed communities while reducing avoidable travel, referral delays, hospital congestion and administrative inefficiency.

The programme will deliver a governed, secure and interoperable platform foundation based on Microsoft Azure, Azure SQL Database, Microsoft Entra ID, Microsoft Teams, WhatsApp Business integration patterns and HL7 FHIR.

## Vision

Create a secure provincial digital-health platform that connects patients, nurses, doctors, specialists, facility administrators, provincial executives and application administrators through coherent role-based workflows.

## Strategic outcomes

1. Improve access to healthcare for rural and remote communities.
2. Reduce avoidable patient transfers and travel expenditure.
3. Shorten waiting times and specialist-referral turnaround.
4. Improve continuity of care through governed digital records and workflows.
5. Improve utilisation visibility for facilities, clinical teams and provincial leadership.
6. Establish an Azure-native platform that can progress from synthetic demonstration to controlled pilot and production readiness.
7. Embed POPIA, clinical safety, accessibility, auditability and interoperability from inception.

## In scope

- Programme mobilisation, governance and reporting
- Clinical and operational workflow discovery
- Figma wireframes, high-fidelity designs and design system
- Next.js role-based patient, clinical, administrative and executive portals
- Azure SQL data platform and application APIs
- Microsoft Entra enterprise application, authentication and RBAC
- Teams and Microsoft Graph integration patterns
- WhatsApp Business patient-engagement workflows
- HL7 FHIR R4 interoperability boundary
- Azure infrastructure, CI/CD, monitoring and security hardening
- Synthetic-data demonstration environment
- Testing, training, pilot-readiness and operational-handover planning

## Out of scope for the mobilisation baseline

- Use of real patient information
- Production clinical operation
- Autonomous diagnosis or treatment decisions
- Final Department of Health policy approval
- Final medical-device or clinical-software classification
- Production Teams recording
- Unapproved cross-border or third-party data sharing
- Production integration to provincial systems before interface and data-governance approval

## Delivery principles

- Azure SQL Database replaces Supabase as the target data platform.
- Microsoft Entra ID is the target identity authority.
- Server-side policy enforcement is the security boundary.
- GitHub Projects is the engineering source of truth.
- GitHub Pages is a synthetic demonstration channel only.
- Clinical decision support remains advisory and human-reviewed.
- Accessibility includes eleven written official languages and South African Sign Language interpreter/accessibility workflows.
- Infrastructure, configuration, decisions and acceptance evidence must be version controlled.
- No secret, credential or real patient information may be committed to the repository.

## Benefits case

| Benefit | Indicator | Baseline requirement | Target-setting approach |
|---|---|---|---|
| Reduced patient travel | Avoided kilometres and travel events | Facility and referral baseline | Agree pilot baseline before go-live |
| Reduced transfers | Transfers avoided after remote consultation | Transfer-reason baseline | Track validated specialist/doctor outcomes |
| Faster access | Median appointment and referral waiting time | Current service waiting times | Compare pilot to approved baseline |
| Improved specialist reach | Remote consultations by district/facility | Specialist availability baseline | Measure completed consultations and coverage |
| Reduced missed appointments | Cancellation/no-show rate | Existing appointment records | Measure after governed reminder deployment |
| Better utilisation | Clinician, room and session utilisation | Approved facility capacity baseline | Use governed operational metrics |
| Improved continuity | Percentage of encounters with complete handoff | Define minimum dataset | Audit against agreed FHIR/application fields |
| Reduced administrative effort | Time per booking/referral/confirmation | Time-and-motion baseline | Compare pilot workflows |
| Stronger governance | Timely reporting, access reviews and audit evidence | Establish reporting SLA | Measure compliance monthly and quarterly |
| Improved patient experience | Satisfaction and accessibility indicators | Approved survey instrument | Measure during pilot with consent |

No cost-saving or clinical-outcome value may be presented as an official result until the formula, source data, owner and validation method are approved.

## Major deliverables

- Governed backlog, labels, milestones and Project structure
- Programme charter, RACI, governance model, RAID register and reporting calendar
- Figma design system and validated workflows
- Responsive Next.js demonstration application
- Azure SQL/API architecture and implementation
- Entra, Teams, WhatsApp and FHIR integration workstreams
- Azure infrastructure and DevSecOps baseline
- Security, privacy, testing and clinical-safety evidence
- Pilot-readiness and production-readiness packs

## Success criteria

- The nine delivery milestones are established and governed.
- The first two milestones have prioritised, actionable backlogs.
- Scope, roles, reporting and escalation paths are documented.
- The Azure-native architecture baseline is accepted for implementation.
- Synthetic demonstration controls are explicit.
- Risks, assumptions, issues and dependencies have owners.
- External departmental, clinical, privacy and production approvals are treated as formal future gates.

## Approval record

The repository owner has instructed that Milestone 01 be treated as complete for the repository-bootstrap and programme-mobilisation scope. This acceptance does not replace external Steering Committee, Department of Health, clinical-governance, privacy or production approvals.
