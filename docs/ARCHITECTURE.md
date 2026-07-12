# Secor HealthConnect MVP Architecture

## Context

The MVP demonstrates a role-aware digital health platform for district hospitals and feeder clinics. All records are synthetic.

## Logical components

```text
Browser / Mobile Web
        |
Next.js application
        |
BFF / application services
  |          |          |
Supabase   Entra ID   Integration adapters
Postgres   + Graph    Teams / WhatsApp / FHIR
        |
Azure hosting, Key Vault, Monitor and CI/CD
```

## RBAC roles

- patient
- doctor
- nurse
- specialist
- facility_admin
- provincial_executive
- application_admin

Authorization must be enforced server-side and in PostgreSQL Row-Level Security. UI visibility is not an authorization boundary.

## Priority FHIR R4 resources

Patient, Practitioner, Organization, Location, Appointment, Encounter, Observation, ServiceRequest, DiagnosticReport, MedicationRequest, CarePlan, Consent, Provenance and AuditEvent.

## Demo workflow

1. Patient books or confirms an appointment.
2. Nurse performs remote or facility triage.
3. Doctor starts a Teams-enabled consultation.
4. Specialist referral is created where required.
5. Observation, prescription and referral events are represented as FHIR resources.
6. Patient receives an approved WhatsApp notification.
7. Executive and operations dashboards consume aggregated, de-identified indicators.

## Security baseline

- Microsoft Entra ID with MFA and Conditional Access
- Least privilege and facility-aware permissions
- Supabase RLS
- TLS and encryption at rest
- Key Vault-managed secrets
- Immutable audit-event requirements
- Synthetic demo data
- POPIA-aligned minimisation, purpose limitation and retention controls
