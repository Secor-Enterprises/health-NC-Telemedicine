# RAID Register

## Control

- Review cadence: weekly PMO review; monthly Steering Committee summary
- Rating: impact and likelihood are Low, Medium, High or Critical
- Status: Open, Monitoring, Mitigated, Closed or Accepted

## Risks

| ID | Risk | Impact | Likelihood | Rating | Owner | Mitigation / response | Review trigger | Status |
|---|---|---:|---:|---:|---|---|---|---|
| R-001 | External Department of Health sponsor and decision authorities are not formally named | High | High | High | Executive sponsor | Obtain written nominations and decision rights before pilot scope approval | Pilot planning | Open |
| R-002 | Clinical workflows are implemented without sufficient representative clinician validation | Critical | Medium | Critical | Clinical lead | Fortnightly workflow review, clinical-safety log and sign-off gates | Any workflow affecting triage, prescribing or referral | Open |
| R-003 | Demonstration content is mistaken for a production-ready clinical system | High | Medium | High | Programme manager | Prominent synthetic-demo labels, limitations, integration-state disclosures and production gate | External demonstration | Monitoring |
| R-004 | Real patient data or credentials are introduced into source control or GitHub Pages | Critical | Low | High | Security lead | Synthetic-data policy, secret scanning, review controls and incident response | Any data import or external contributor | Monitoring |
| R-005 | Rural connectivity limitations make synchronous consultation unreliable | High | High | High | Platform/operations lead | Low-bandwidth states, retry patterns, connectivity assessment and asynchronous alternatives | Facility discovery and pilot selection | Open |
| R-006 | Entra, Teams, WhatsApp or FHIR permissions/licensing delay integration | High | Medium | High | Integration lead | Early tenant, licensing, consent and sandbox validation; mocked adapters remain isolated | Integration planning | Open |
| R-007 | Azure costs exceed budget due to unmanaged environments or telemetry | Medium | Medium | Medium | Azure platform lead | Budgets, tags, alerts, environment teardown and monthly cost review | Azure deployment | Open |
| R-008 | Executive KPIs or benefits claims are based on unvalidated assumptions | High | Medium | High | M&E lead | KPI catalogue, formula ownership, source dates and synthetic-data disclosure | Executive dashboard release | Open |
| R-009 | Duplicate backlogs emerge between GitHub Projects and Azure Boards | Medium | Medium | Medium | Programme manager | GitHub Projects remains source of truth; Azure Boards is synchronised/export-only | Azure Boards onboarding | Monitoring |
| R-010 | Accessibility and language support are treated as late-stage enhancements | High | Medium | High | Product/design lead | Include accessibility and localisation acceptance criteria in every portal issue | Sprint planning and design review | Open |
| R-011 | Privileged administration features expose secrets or permit unsafe actions | Critical | Low | High | Security lead | Metadata-only secret views, reauthentication, least privilege and audit controls | Application administration build | Open |
| R-012 | Incomplete data-retention and sharing decisions create POPIA exposure | Critical | Medium | Critical | Information officer | Data inventory, processing purpose, retention schedule, consent and sharing approval | Before pilot data use | Open |

## Assumptions

| ID | Assumption | Owner | Validation action | Target point | Status |
|---|---|---|---|---|---|
| A-001 | Microsoft Azure is the approved target cloud environment | Executive/architecture sponsor | Obtain written cloud and hosting confirmation | Architecture gate | Open |
| A-002 | Azure SQL Database is acceptable for the application data platform | Architecture lead | Validate NFRs, residency, integration and operational model | Data architecture review | Monitoring |
| A-003 | Microsoft Entra ID will be available for workforce identity and RBAC | Identity lead | Confirm tenant, licensing, app registration and admin consent | Entra milestone start | Open |
| A-004 | Teams and Graph can be used for approved teleconsultation scheduling | Integration/privacy leads | Confirm licensing, guest/external-user policy and recording policy | Teams design review | Open |
| A-005 | WhatsApp Business may be used for approved non-diagnostic patient communications | Privacy/communications leads | Confirm opt-in, templates, retention and escalation model | WhatsApp design review | Open |
| A-006 | HL7 FHIR R4 is the interoperability baseline | Architecture/data leads | Confirm provincial/national profiles and terminology constraints | FHIR design review | Monitoring |
| A-007 | GitHub Pages remains suitable for synthetic public demonstration only | Programme/security leads | Verify build contains no secrets or real data | Every demo release | Monitoring |

## Issues

| ID | Issue | Impact | Owner | Resolution | Target | Status |
|---|---|---:|---|---|---|---|
| I-001 | Exact direct organisation Project URL and visual view evidence have not been independently captured through the connector | Medium | Programme manager | Capture in GitHub UI or successful bootstrap workflow summary; update `PROJECT_URL.md` | Project acceptance follow-up | Open |
| I-002 | External stakeholder names and formal Steering Committee minutes are not available in the repository | High | Executive sponsor | Nominate representatives and upload approved meeting record | Before pilot gate | Open |
| I-003 | Current application is a static demonstration without live Azure SQL or Entra integration | High | Technical lead | Deliver Milestones 04–07 with environment and integration evidence | Integration roadmap | Open |

## Dependencies

| ID | Dependency | Required for | Owner | Required by | Status |
|---|---|---|---|---|---|
| D-001 | Named Department of Health sponsor, clinical and information-governance leads | Formal acceptance and pilot | Executive sponsor | Pilot planning | Open |
| D-002 | Azure subscription, tenant, networking and policy access | Azure SQL and infrastructure | Azure platform lead | Milestones 04 and 07 | Open |
| D-003 | Microsoft 365/Teams licensing and Graph consent | Teams integration | Identity/integration lead | Milestone 06 | Open |
| D-004 | WhatsApp Business account, number and template approval | Patient messaging | Integration lead | Milestone 06 | Open |
| D-005 | Approved FHIR profiles, terminology and interface owners | Interoperability | Data lead | Milestone 06 | Open |
| D-006 | Representative users and facilities | Workflow validation, UAT and pilot | Clinical/operations leads | Milestones 02 and 08 | Open |
| D-007 | Approved POPIA processing, consent, retention and incident model | Pilot data use | Information officer | Milestone 08 | Open |

## Acceptance note

Open RAID items do not invalidate repository-mobilisation completion. They are controlled inputs to later stage gates and must remain visible, owned and reviewed.
