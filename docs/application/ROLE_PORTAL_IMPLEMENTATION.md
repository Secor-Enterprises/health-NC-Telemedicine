# Secor HealthConnect Role Portal Implementation

## Status

The role-based demonstration foundation is implemented in the Next.js application and deployed through the repository's static GitHub Pages pipeline.

## Implemented routes

- `/portals/patient/`
- `/portals/doctor/`
- `/portals/nurse/`
- `/portals/specialist/`
- `/portals/administration/`
- `/portals/executive/`
- `/portals/platform-admin/`

All routes are statically generated for GitHub Pages.

## Shared application architecture

The implementation includes:

- Shared role-aware shell and navigation
- Responsive desktop, tablet and mobile layouts
- Controlled demonstration role switching
- Header search, language selector, notifications and account controls
- Portal metrics, queues and quick actions
- Cross-role patient-care journey
- Reusable loading, empty, error, offline, degraded-connectivity and permission-denied states
- Integration-status disclosure for Azure SQL, Entra ID, Teams, WhatsApp and HL7 FHIR
- Synthetic-data and clinical-safety notices

## Portal coverage

| Portal | GitHub issue | Demonstrated capability |
|---|---:|---|
| Patient | #12 | Appointments, care tasks and consultation readiness |
| Doctor | #13 | Clinical queue, consultation and prescribing/referral actions |
| Nurse | #14 | Triage, vitals and escalation workflow |
| Specialist | #15 | Referral review and multidisciplinary collaboration |
| Facility administration | #16 | Registration, scheduling, queues and notifications |
| Provincial executive | #17 | Access, utilisation and benefits indicators |
| Application administration | #18 | Identity, security, deployment and integration health |

The platform foundation is tracked by issue #19.

## Localisation and accessibility

The user interface exposes the eleven written official-language options:

- English
- Afrikaans
- isiZulu
- isiXhosa
- Sepedi
- Setswana
- Sesotho
- Xitsonga
- siSwati
- Tshivenda
- isiNdebele

South African Sign Language is represented through accessibility and interpreter-workflow indicators rather than as written translation.

The shared shell includes visible focus styles, keyboard-operable controls, reduced-motion handling and status labels that do not rely solely on colour.

## Integration boundary

The public GitHub Pages environment uses synthetic data and mocked service adapters. It does not connect to production healthcare systems.

| Integration | Demonstration status | Production direction |
|---|---|---|
| Azure SQL | Mocked | Server-side API using managed identity |
| Microsoft Entra ID | Mocked | OpenID Connect, app roles and Conditional Access |
| Microsoft Teams | Mocked | Microsoft Graph meeting and calendar services |
| WhatsApp Business | Mocked | Approved templates, consent and secured webhooks |
| HL7 FHIR R4 | Mocked | Validated resources behind an authorised API boundary |

Client-side visibility is not authorization. Privileged and clinical actions require server-side authorization in any connected environment.

## Known limitations

- Role switching is a demonstration control, not production authentication.
- Portal actions operate on synthetic local data and do not persist to Azure SQL.
- Teams, WhatsApp and FHIR actions disclose mocked status and do not transmit data.
- The current automated tests validate domain configuration and static export. Browser-driven end-to-end and axe-based accessibility suites remain future work.
- GitHub Pages is a public demonstration host, not a production clinical platform.
- Product, clinical, security and accessibility review evidence remains required before production-readiness claims.

## Validation commands

```bash
npm install
npm run validate:design
npm run validate:figma-plugin
npm run test
npm run typecheck
npm run build
npm run verify:export
```

Run all checks through:

```bash
npm run check
```

## Azure transition path

The frontend must remain portable between GitHub Pages and Azure hosting. The recommended connected architecture is:

1. Next.js frontend hosted on Azure App Service or Azure Container Apps.
2. Microsoft Entra ID for workforce identity and application roles.
3. Server-side application APIs as the authorization boundary.
4. Azure SQL Database accessed through managed identity.
5. Azure Key Vault for secrets and certificates.
6. Azure Service Bus for asynchronous integration workflows.
7. API Management for external and interoperability APIs.
8. Azure Monitor, Application Insights and Log Analytics for operational telemetry.

No production secret or connection string belongs in browser-visible environment variables or repository source.