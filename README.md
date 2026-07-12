# Secor HealthConnect — MVP Demo

A responsive, synthetic-data telemedicine portal demonstration for the Northern Cape programme.

## Included

- Role switching for patient, doctor, nurse, specialist, administration, executive and Azure administration
- Responsive desktop, tablet and mobile presentation
- 11-language selector
- Representative clinical and operational workflows
- Entra ID, Teams, WhatsApp and FHIR integration placeholders
- POPIA, audit, MFA and Row-Level Security indicators
- Synthetic data only

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Architecture direction

- Next.js App Router and TypeScript
- Supabase/PostgreSQL with RLS
- Microsoft Entra ID and Graph/Teams
- WhatsApp Business Platform
- HL7 FHIR R4 API boundary
- Azure hosting, Key Vault, Monitor and CI/CD

## Safety

This repository is a product demonstration. It must not be used for real clinical decisions or real patient data without formal clinical, security, privacy and regulatory validation.
