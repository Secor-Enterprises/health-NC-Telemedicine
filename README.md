# Secor HealthConnect — Northern Cape Telemedicine Demo

A responsive, role-aware telemedicine product demonstration for district hospitals and feeder clinics in the Northern Cape.

## Live application

**GitHub Pages:** https://secor-enterprises.github.io/health-NC-Telemedicine/

> The Pages workflow deploys automatically from `main`. GitHub Pages must be configured to use **GitHub Actions** as its source in the repository settings.

## Enterprise project management

The engineering source of truth is the organisation-level GitHub Project **Secor HealthConnect Enterprise Delivery**.

- Organisation Projects directory: https://github.com/orgs/Secor-Enterprises/projects
- Project setup and operating model: `docs/project-management/GITHUB_PROJECT_SETUP.md`
- Project acceptance criteria: `docs/project-management/PROJECT_ACCEPTANCE_CRITERIA.md`
- Controlled view runbook: `docs/project-management/VIEW_CONFIGURATION_RUNBOOK.md`
- Project verification tracking: https://github.com/Secor-Enterprises/health-NC-Telemedicine/issues/10

The direct Project URL must replace the organisation-directory link in `docs/project-management/PROJECT_URL.md` before issue #10 is closed. Azure Boards may consume synchronised or exported work items where required, but must not be maintained as a separate competing backlog.

## Demonstrated capabilities

- Patient, doctor, nurse, specialist, administration, executive and Azure administration portals
- Responsive desktop, tablet and mobile layouts
- Eleven-language interface selector
- Role switching for stakeholder demonstrations
- Patient queues, triage, appointment and referral workflows
- Executive operational and cost-saving indicators
- Microsoft Entra ID, Teams and Microsoft Graph architecture
- WhatsApp Business patient-engagement workflows
- HL7 FHIR R4 interoperability boundary
- Azure SQL Database data architecture
- POPIA, MFA, audit, least-privilege and Row-Level Security indicators
- Synthetic demonstration data only

## Technology

- Next.js App Router
- React and TypeScript
- Azure SQL Database
- Microsoft Entra ID
- Microsoft Graph and Teams
- WhatsApp Business Platform
- HL7 FHIR R4
- Azure App Service or Azure Container Apps for the future Azure environment
- Azure Key Vault, Monitor, Application Insights and Defender for Cloud
- GitHub Actions and GitHub Pages for the public demonstration

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

The static export is written to `out/` and is deployed by `.github/workflows/deploy-pages.yml`.

## Safety and limitations

This repository is a synthetic product demonstration. It must not be used for real clinical decisions, real patient data or production health-service delivery without formal clinical, security, privacy, interoperability and regulatory validation.
