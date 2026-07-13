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

Azure Boards may consume synchronised or exported work items where required, but must not be maintained as a separate competing backlog.

## Programme mobilisation baseline

Milestone 01 governance, discovery and architecture evidence is maintained under `docs/programme/`:

- Programme charter and benefits case
- Stakeholder register, RACI and escalation model
- Governance forums and stage gates
- RAID register
- Reporting calendar and SLAs
- Initial clinical, facility, connectivity and integration discovery
- Azure-native architecture, security and data-classification baseline
- Milestone 01 completion and acceptance report

See: `docs/programme/README.md`

The repository mobilisation baseline is complete. Formal Department of Health, Steering Committee, clinical-governance, privacy, pilot and production approvals remain explicit later-stage gates.

## Figma and design-system handoff

- Figma file: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- Figma/design parent issue: https://github.com/Secor-Enterprises/health-NC-Telemedicine/issues/11
- Canvas work items: issues #23–#28
- Git LFS source backup: `design/source/figma/Secor-HealthConnect-Milestone-1-UX-Foundation.fig`
- Design-system source of truth: `design/README.md`
- Machine-readable acceptance register: `design/figma-acceptance.json`
- Local Figma canvas plugin: `tools/figma-healthconnect/`
- Design governance and handoff: `docs/design/README.md`
- Node-specific frame register: `docs/design/FIGMA_FRAME_REGISTER.md`
- Canvas implementation runbook: `docs/design/FIGMA_IMPLEMENTATION_RUNBOOK.md`
- Accessibility checklist: `docs/design/ACCESSIBILITY_CHECKLIST.md`
- Localisation and SASL guidance: `docs/design/LOCALISATION_AND_SASL.md`
- Clinical/security review: `docs/design/CLINICAL_SECURITY_REVIEW.md`

The repository contains canonical design tokens, CSS variables, component APIs, Figma-to-issue mappings, a Git LFS source backup, local canvas automation and acceptance templates. Run the local plugin in Figma Desktop and complete issues #23–#28 before closing issue #11.

## Role portal application

The role portal foundation is implemented through issue #19 and PR #30.

- Portal implementation: `docs/application/ROLE_PORTAL_IMPLEMENTATION.md`
- Demonstration script: `docs/application/DEMONSTRATION_SCRIPT.md`
- Acceptance status: `docs/application/ACCEPTANCE_STATUS.md`
- Release checklist: `docs/application/RELEASE_CHECKLIST.md`
- Review record: `docs/application/REVIEW_RECORD.md`
- Deployment verification: `docs/application/DEPLOYMENT_VERIFICATION.md`

Static role routes:

- `/portals/patient/`
- `/portals/doctor/`
- `/portals/nurse/`
- `/portals/specialist/`
- `/portals/administration/`
- `/portals/executive/`
- `/portals/platform-admin/`

## Demonstrated capabilities

- Patient, doctor, nurse, specialist, facility administration, provincial executive and application administration portals
- Responsive desktop, tablet and mobile layouts
- Eleven written-language interface plan plus SASL accessibility and interpreter workflows
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

## Validate and build

```bash
npm run validate:design
npm run validate:figma-plugin
npm run test
npm run typecheck
npm run build
npm run verify:export
```

Run the full validation sequence with:

```bash
npm run check
```

The static export is written to `out/` and is deployed by `.github/workflows/deploy-pages.yml`.

## Safety and limitations

This repository is a synthetic product demonstration. It must not be used for real clinical decisions, real patient data or production health-service delivery without formal clinical, security, privacy, interoperability and regulatory validation.
