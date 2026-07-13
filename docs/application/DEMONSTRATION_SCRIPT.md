# Secor HealthConnect Demonstration Script

## Purpose

Provide a repeatable executive demonstration of the synthetic role-based portal application without implying that mocked integrations are production services.

## Preparation

1. Confirm the GitHub Pages site loads.
2. Confirm all seven portal routes return successfully.
3. Use a private browsing session to avoid stale browser state.
4. Confirm the interface displays `Synthetic demonstration data only`.
5. Confirm integration badges show mocked or demonstration status.
6. Do not enter real patient, clinician or facility information.

## Recommended 12-minute walkthrough

### 1. Platform introduction — 1 minute

Open the home page and explain:

- The solution is a provincial digital-health and telemedicine demonstration.
- The public deployment uses synthetic data only.
- Azure SQL, Microsoft Entra ID, Teams, WhatsApp and FHIR are represented through controlled adapter boundaries.
- Production authorization will be enforced server-side.

### 2. Patient booking and readiness — 2 minutes

Open `/portals/patient/`.

Demonstrate:

- Upcoming appointment
- Care tasks and medication reminder
- Appointment booking action
- Virtual-consultation readiness
- Language and accessibility controls
- SASL/interpreter support indicator

State that WhatsApp and Teams are mocked in the public demo.

### 3. Nurse triage — 2 minutes

Open `/portals/nurse/`.

Demonstrate:

- Triage queue
- Urgency represented with text and visual treatment
- Vitals and observation workflow
- Escalation to a doctor
- Degraded-connectivity or offline system-state example

State that triage guidance remains human-reviewed and is not an autonomous diagnosis.

### 4. Doctor consultation — 2 minutes

Open `/portals/doctor/`.

Demonstrate:

- Prioritised patient queue
- Consultation action
- Prescription and referral actions
- Teams integration status
- Cross-role care journey

State that no prescription, referral or clinical record is transmitted by the public demo.

### 5. Specialist referral — 1 minute

Open `/portals/specialist/`.

Demonstrate:

- Referral inbox
- Priority and evidence states
- Multidisciplinary collaboration
- Clinical opinion workflow

State that FHIR resources are mocked and require validated server-side exchange in production.

### 6. Facility administration — 1 minute

Open `/portals/administration/`.

Demonstrate:

- Facility scheduling
- Patient registration action
- Operational queues
- Notification workflow

Explain that consent and approved communication templates will govern connected WhatsApp messaging.

### 7. Provincial executive portal — 1 minute

Open `/portals/executive/`.

Demonstrate:

- Province-level metrics
- Facility coverage
- Avoided-transfer and cost-saving indicators
- Clear synthetic-data boundary

State that figures are illustrative and not official Department of Health statistics.

### 8. Application administration — 1 minute

Open `/portals/platform-admin/`.

Demonstrate:

- Entra, Azure SQL and FHIR service-health indicators
- Audit-log action
- Deployment and security posture
- Environment and integration status

Explain that no secret values or real credentials are displayed.

### 9. Close — 1 minute

Summarise the phased path:

1. Complete portal implementation and accessibility validation.
2. Introduce Azure-hosted server-side APIs and Azure SQL.
3. Register the Microsoft Entra enterprise application and app roles.
4. Connect Teams, WhatsApp and FHIR through approved service boundaries.
5. Complete clinical, security, privacy, interoperability and operational assurance before pilot or production use.

## Reset procedure

The current demonstration uses non-persistent synthetic data. Refresh the page or reopen the portal route to reset temporary state.

Before every formal demonstration:

```bash
npm run check
```

Confirm the latest `main` deployment completed successfully and record the commit SHA used for the demonstration.

## Presenter cautions

Do not claim:

- Production readiness
- Regulatory approval
- Clinical validation
- Live Department of Health data
- Live Teams, WhatsApp or FHIR connectivity
- Guaranteed savings or patient outcomes

Use the terms `synthetic`, `demonstration`, `mocked`, `proposed` and `subject to validation` consistently.