# Secor HealthConnect Design-System Handoff

## Purpose

This document translates the Figma experience into a controlled implementation contract for the Next.js application. It covers foundations, reusable components, responsive behaviour, system states, security boundaries and the delivery mapping to issues #12–#19.

## Design source

- File: **Secor HealthConnect — Milestone 1 UX Foundation**
- URL: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- Primary UX issue: #11
- Platform epic: #19

## Current verified design coverage

The active canvas contains:

- Foundations and component-example frames
- Desktop designs for patient, doctor, nurse, specialist, facility administration, provincial executive and application administration roles
- Patient and doctor mobile designs
- Nurse and executive tablet designs
- A prototype and user-flow frame

The latest inspection found no local Figma variable collections, local text/effect styles or local component/component-set nodes. Existing component examples are detached frames. The handoff therefore defines the target governed structure rather than treating copied frames as reusable components.

## Design-system architecture

### Foundations

The canonical token contract is `design/tokens.json`. The CSS implementation contract is `design/tokens.css`.

Figma should implement four local collections:

1. **Primitives** — raw colour values; one mode; hidden from most property pickers.
2. **Semantic Color** — application roles such as background, text, border, focus and status; Light mode initially.
3. **Spacing & Radius** — spacing, target sizes and corner radii.
4. **Motion & Layout** — durations, breakpoints and layout constants where Figma variable support is appropriate.

Text styles should use Inter in Figma. The code stack is `Inter, Segoe UI, Arial, Helvetica, sans-serif`. The current application uses Arial/Helvetica and should be reconciled under issue #19.

### Component families

The governed component API is in `design/components.json`. Priority component families are:

- AppShell
- NavigationItem
- Button
- TextField
- SelectField
- StatusBadge
- IntegrationStatus
- MetricCard
- Panel
- QueueRow
- SystemState
- ConsentNotice
- ClinicalAlert
- VitalsCard
- ReferralCard
- DataTable
- ModalDialog
- ToastNotification

Component variants must represent interaction state explicitly. Hover, focus, pressed, loading, disabled and error states must not be inferred from copied screens.

## Responsive model

| Class | Width | Primary use |
|---|---:|---|
| Mobile | 320–699 px | Patient self-service, clinician summary, alerts and short tasks |
| Tablet | 700–979 px | Nurse intake stations, executive briefings and mobile clinical review |
| Desktop | 980–1439 px | Full clinical and administrative workspaces |
| Wide | 1440 px and above | Executive demonstrations and dense operations consoles |

Responsive design is not simple scaling. Each portal must define:

- Navigation adaptation
- Priority information order
- Table-to-card transformations
- Dialog and form width behaviour
- Touch-target sizing
- Chart/map alternatives
- Connectivity and offline behaviour

## Portal handoff

### Patient — issue #12

Required implementation states:

- Dashboard and care reminders
- Appointment booking and rescheduling
- Consent and privacy notice
- Virtual waiting room and readiness checks
- Teams launch state
- Medication, result and referral summaries
- WhatsApp communication preferences
- Language, accessibility and interpreter preferences

### Doctor — issue #13

Required implementation states:

- Schedule and patient queue
- Triage, observations and timeline review
- Consultation workspace
- Structured notes and unsaved-change protection
- Prescription, laboratory, imaging and referral states
- Teams, Graph and FHIR integration disclosure
- Advisory clinical alerts with human confirmation

### Nurse — issue #14

Required implementation states:

- Intake and identity confirmation
- Consent review
- Vitals capture and validation
- Triage and escalation
- Observation timeline
- Vaccination and medication-administration patterns
- Offline draft and reconnect states
- Doctor handoff

### Specialist — issue #15

Required implementation states:

- Referral queue and evidence review
- Accept, request information, redirect, defer and decline states
- Second-opinion response
- Multidisciplinary review
- Specialist consultation scheduling
- Referring-clinician handoff and outcome state

### Facility administration — issue #16

Required implementation states:

- Registration and patient search
- Scheduling and resource conflicts
- Queue management
- Interpreter and accessibility scheduling
- WhatsApp notification status
- Referral and transfer coordination
- Operational exceptions and reporting

### Provincial executive — issue #17

Required implementation states:

- Province, district and facility drill-down
- GIS/service-coverage visualisation and table alternative
- Access, waiting-time, consultation, referral and transfer indicators
- Benefits-realisation calculations with assumptions
- Data freshness and confidence
- Security, privacy and platform-health summary

### Application administration — issue #18

Required implementation states:

- Entra application, role and group overview
- User lifecycle and access-review status
- Azure SQL and platform-service health
- Teams, WhatsApp and FHIR integration status
- Audit-event search
- Environment, release, incident, backup and recovery views
- Privileged-action confirmation and reauthentication patterns

## Journey handoff

The end-to-end prototype path is:

1. Entra sign-in
2. MFA verification
3. Language and accessibility preferences
4. POPIA notice and purpose-specific consent
5. Patient registration and appointment booking
6. Virtual waiting room and device/connectivity checks
7. Nurse intake, triage and vitals
8. Teams-enabled doctor consultation
9. Referral and specialist/MDT review
10. Prescription, diagnostic and follow-up states
11. Administration, audit and platform-health review

Every integration step must show one of these labels:

- **Live** — connected and verified in the current environment
- **Sandbox** — connected to an approved non-production service
- **Mocked** — simulated in the interface
- **Unavailable** — expected but currently failing or not provisioned
- **Disabled** — deliberately turned off by policy or configuration

## Data and validation annotations

Each Figma frame and key component must annotate:

- Data source or synthetic fixture
- Required and optional fields
- Validation and error behaviour
- Role, facility, patient and purpose context
- Audit-event expectation
- Integration status
- Clinical review requirement
- Empty, loading, error, offline and permission states

## Developer implementation rules

1. Use shared React components rather than reproducing portal-specific markup.
2. Use the token names from `design/tokens.css` or document the migration plan.
3. Client-side role switching is demonstration behaviour only.
4. Connected APIs enforce authorization server-side.
5. Real patient data and production credentials are prohibited in GitHub Pages and repository fixtures.
6. Accessible names, focus order, validation text and live-region behaviour are part of the component API.
7. Clinical alerts, AI suggestions and transcription require visible human-review states.

## Definition of ready for development

A frame is ready when:

- It has a node-specific Figma link.
- It maps to an issue in `design/frame-map.json`.
- Its viewport and responsive behaviour are identified.
- Its component dependencies use the governed inventory.
- Its validation, permissions, audit and integration boundaries are annotated.
- Accessibility and clinical/security review status are recorded.
- It contains synthetic data only.

## Known gap

The GitHub handoff contract is complete. Figma canvas creation of local variables, actual component sets, critical-state frames and annotations was blocked by the Figma Starter-plan MCP call limit during this execution. The repository must not mark issue #11 complete until those canvas objects and screenshots are verified.
