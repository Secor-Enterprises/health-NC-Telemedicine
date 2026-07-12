# Architecture, Security and Data-Classification Baseline

## Architecture decision baseline

Secor HealthConnect will use an Azure-native architecture. Supabase is not part of the target platform.

```text
Users
  │
Azure Front Door / Web Application Firewall
  │
Next.js Web Application
  │
Application API / service layer
  ├── Microsoft Entra ID
  ├── Azure SQL Database
  ├── Azure Blob Storage
  ├── Azure Service Bus
  ├── Azure API Management
  ├── Microsoft Graph / Teams
  ├── WhatsApp Business adapter
  └── HL7 FHIR integration services
          │
Azure Key Vault
Azure Monitor
Application Insights
Log Analytics
Defender for Cloud
```

## Technology baseline

| Layer | Baseline |
|---|---|
| Web application | Next.js App Router, React and TypeScript |
| Application services | Server-side APIs, preferably ASP.NET Core or an approved equivalent |
| Database | Azure SQL Database |
| Identity | Microsoft Entra ID for workforce identity |
| Role model | Entra app roles/groups plus server-side RBAC and contextual authorisation |
| Clinical interoperability | HL7 FHIR R4 services and governed resource profiles |
| Documents | Azure Blob Storage with controlled metadata and access |
| Asynchronous integration | Azure Service Bus |
| Secrets and certificates | Azure Key Vault and managed identities |
| API governance | Azure API Management |
| Consultation and calendar | Microsoft Teams and Microsoft Graph |
| Patient messaging | WhatsApp Business integration adapter |
| Monitoring | Azure Monitor, Application Insights and Log Analytics |
| Security posture | Defender for Cloud, WAF, private endpoints and policy controls |
| CI/CD | GitHub Actions with environment protection |
| Infrastructure | Bicep or Terraform, selected through ADR |
| Demonstration | GitHub Pages with synthetic data only |

## Security baseline

### Identity and access

- Microsoft Entra ID is the workforce identity authority.
- MFA and Conditional Access alignment are required for privileged and workforce access.
- Application roles must be explicit and mapped to approved business roles.
- Privileged roles require least privilege, separation of duties and periodic access review.
- Managed identities are preferred over stored service credentials.
- Patient identity requires a separately approved pattern.

### Authorisation

- Client-side navigation and role visibility are not security boundaries.
- Server-side APIs enforce role, facility, patient, purpose and resource context.
- Azure SQL Row-Level Security may provide defence in depth where appropriate.
- Stored procedures and governed views are used for sensitive operations and reporting where justified.
- Administrative, export and support-access actions require explicit permissions and audit evidence.

### Data protection

- Encryption in transit and at rest is mandatory.
- Secrets, keys and certificates are stored in Key Vault.
- Private endpoints and network restrictions are applied to production-grade data services where feasible.
- Non-production environments use synthetic or approved de-identified data.
- Production data must not be copied into lower environments without approved controls.
- Backup, restore and disaster-recovery procedures must be tested.

### Application and platform security

- Secure coding, dependency scanning, secret scanning and CodeQL are required.
- Infrastructure and container artefacts require validation and security scanning.
- Web ingress requires TLS and WAF controls.
- Sessions require secure cookies, timeout and reauthentication controls appropriate to role and risk.
- Logging must avoid secrets and unnecessary clinical information.
- High-risk events must be forwarded to approved monitoring and incident processes.

### Clinical safety

- Clinical decision support is advisory and human-reviewed.
- No autonomous diagnosis, prescription or treatment decision is permitted by the baseline.
- Clinical alerts must identify source, severity, limitations and required action.
- Stale, missing and incomplete clinical data must be visibly disclosed.
- Clinical workflows require formal validation before pilot use.

## Data-classification model

| Classification | Examples | Default handling |
|---|---|---|
| Public | Approved website content, public programme information | May be published after content approval |
| Internal | Plans, non-sensitive architecture, sprint reports, synthetic demo instructions | Authenticated organisational access unless approved for publication |
| Confidential | Commercials, internal risk registers, security design, supplier details | Need-to-know access, controlled sharing and audit where appropriate |
| Restricted personal information | Names, contact details, identifiers, appointment details, communications preferences | Lawful purpose, minimisation, access control, retention and audit |
| Restricted health information | Diagnoses, observations, prescriptions, referrals, results, images and clinical notes | Highest application protection, clinical purpose limitation, encryption and detailed audit |
| Restricted security material | Secrets, tokens, certificates, connection strings, private keys and break-glass credentials | Key Vault or approved secret store only; never committed or displayed |

## Core data domains

- Identity and role mappings
- Facilities, districts, locations and services
- Patients and approved relationships/dependants
- Practitioners and practitioner roles
- Appointments, schedules and queues
- Encounters and consultation records
- Observations and vital signs
- Conditions, allergies and medications
- Service requests, referrals and tasks
- Diagnostic reports and document references
- Consent and communication preferences
- Notifications and delivery status
- Audit events and provenance
- Integration events and operational telemetry references

## Data-governance controls

- Each data domain requires an accountable owner.
- Purpose, lawful basis, source, quality, retention and sharing rules must be documented.
- Data minimisation applies to interfaces, exports, logs and reports.
- Executive reporting should use aggregated, de-identified or minimised views.
- Small-cell and re-identification risks must be assessed for drill-down reporting.
- FHIR resources require profile, terminology, validation, provenance and versioning controls.
- Consent versions and changes must be auditable.

## Environment baseline

| Environment | Permitted data | Purpose |
|---|---|---|
| Development | Synthetic only | Developer implementation and unit testing |
| Test | Synthetic or specifically approved test data | Integration, system and automated testing |
| Demo | Synthetic only | Public/executive demonstration |
| Pilot | Approved pilot data under signed governance | Controlled clinical and operational validation |
| Production | Authorised production data | Approved health-service operation |

## Initial non-functional requirements

- Accessibility: WCAG-aligned implementation and documented exceptions
- Availability: targets to be agreed for pilot and production
- Performance: usable over constrained networks; page and API targets to be baselined
- Auditability: sensitive access and change events retrievable for assurance
- Recoverability: documented RPO/RTO and tested restore procedures before production
- Scalability: district/facility growth without redesign of role or tenancy controls
- Interoperability: validated FHIR and API contracts
- Maintainability: typed code, reusable components, ADRs, automated tests and infrastructure as code
- Observability: health, performance, integration and security telemetry

## Baseline acceptance

This document is accepted as the initial implementation baseline for repository and demonstration development. Final Azure landing-zone, data-residency, network, clinical, privacy and production controls require formal approval in later milestones.
