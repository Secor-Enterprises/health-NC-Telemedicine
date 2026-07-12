# Figma Canvas Implementation Runbook

## Purpose

This runbook defines the exact work required to convert the current Secor HealthConnect Figma file from detached demonstration frames into a governed design-system and handoff file.

## Target file

- File key: `3qDF55zDbiYe95zfNRjQuE`
- URL: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE

## Execution order

### 1. Foundations and variables

Create local collections in this order:

1. `HealthConnect/Primitives`
2. `HealthConnect/Semantic Color`
3. `HealthConnect/Spacing & Radius`
4. `HealthConnect/Motion & Layout`

Use `design/tokens.json` as the canonical values.

Variable rules:

- Primitive colours use no broad property scope.
- Background semantic colours use `FRAME_FILL` and `SHAPE_FILL`.
- Text semantic colours use `TEXT_FILL`.
- Border colours use `STROKE_COLOR`.
- Spacing variables use `GAP`.
- Radius variables use `CORNER_RADIUS`.
- Every variable has web code syntax matching `design/tokens.css`.
- Semantic colours alias primitive variables rather than duplicating raw values.

### 2. Text and effect styles

Create:

- `HealthConnect/Display/Large`
- `HealthConnect/Title/Large`
- `HealthConnect/Title/Medium`
- `HealthConnect/Body/Large`
- `HealthConnect/Body/Medium`
- `HealthConnect/Body/Small`
- `HealthConnect/Label/Medium`
- `HealthConnect/Label/Small`
- `HealthConnect/Eyebrow`
- `HealthConnect/Elevation/Surface`
- `HealthConnect/Elevation/Floating`
- `HealthConnect/Elevation/Focus`

Use Inter in Figma and the token sizes/weights from `design/tokens.json`.

### 3. Page structure

Retain the current portal page and add:

- `03 Foundations & Tokens`
- `04 Components & Variants`
- `05 Critical States`
- `06 Accessibility & Localisation`
- `07 Developer Handoff`

The current `02 Additional MVP Flows` page may be retained for the end-to-end journeys after confirming it is empty.

### 4. Component sequence

Build components in dependency order:

1. StatusBadge
2. Button
3. TextField
4. SelectField
5. IntegrationStatus
6. NavigationItem
7. Panel
8. MetricCard
9. QueueRow
10. SystemState
11. ConsentNotice
12. ClinicalAlert
13. VitalsCard
14. ReferralCard
15. DataTable
16. ModalDialog
17. ToastNotification
18. AppShell

For each family:

- Create a dedicated documentation section.
- Bind fills, strokes, gaps and radii to variables.
- Create variant combinations from `design/components.json`.
- Expose text, boolean and instance-swap properties where appropriate.
- Add usage, accessibility and safety notes.
- Capture metadata and screenshot evidence.
- Record the resulting node IDs in `design/frame-map.json` or a generated acceptance record.

### 5. Screen migration

For each existing portal frame:

- Replace detached button examples with Button instances.
- Replace detached navigation items with NavigationItem instances.
- Replace KPI and content frames with MetricCard and Panel instances.
- Replace status rectangles with StatusBadge or IntegrationStatus instances.
- Preserve layout and content while eliminating visual duplication.
- Add node-level descriptions or visible annotations for permissions, data source, validation and integration status.

Do not detach reusable component instances after migration.

### 6. Critical-state frames

Create a matrix covering:

- Loading
- Empty
- Error
- Offline
- Degraded connectivity
- Permission denied
- Session expired
- Maintenance

Each state must be demonstrated at page, panel and inline scope where applicable.

### 7. Priority journey frames

Create and link this prototype sequence:

1. Secure sign-in
2. MFA verification
3. Language and accessibility preferences
4. POPIA privacy notice and consent
5. Patient registration and appointment booking
6. Virtual waiting room and readiness
7. Nurse triage and vitals
8. Teams-enabled doctor consultation
9. Specialist referral and multidisciplinary review
10. Prescription, laboratory, imaging and follow-up
11. Administration, audit and platform health

The prototype must disclose integration status and synthetic data at each relevant stage.

### 8. Responsive completion

Add missing responsive variants:

- Patient: tablet
- Doctor: tablet
- Nurse: mobile summary
- Specialist: tablet and mobile summary
- Facility administration: tablet and mobile queue summary
- Executive: mobile alert summary
- Application administration: tablet and mobile alert summary

### 9. Accessibility and localisation page

Document:

- Focus treatment
- Keyboard order examples
- Touch targets
- Contrast examples
- Text-scaling and expansion examples
- Accessible error patterns
- Chart/map alternatives
- Eleven written-language patterns
- SASL/interpreter workflow states
- Low-literacy content patterns
- Low-bandwidth and offline behaviour

### 10. Developer handoff page

For every approved frame, show:

- Figma node link
- GitHub issue
- Viewport
- Component dependencies
- Token dependencies
- Data fixture/source
- Validation and error behaviour
- Role/facility/patient/purpose boundary
- Audit-event expectation
- Integration status
- Review decision

## Validation

After every write phase:

1. Inspect metadata for node hierarchy and component instances.
2. Capture screenshots at adequate resolution.
3. Check for clipped text, broken auto-layout and overlapping elements.
4. Verify that every created/mutated node ID is returned and recorded.
5. Verify that no protected or real patient data appears.

## Completion criteria

The Figma canvas phase is complete only when:

- Local variable collections and styles exist.
- Component sets exist and are used by portal frames.
- Critical states and responsive variants exist.
- End-to-end prototype navigation works.
- Accessibility/localisation annotations are present.
- Node-specific links and screenshots are recorded.
- Product, clinical, security and accessibility review evidence is attached to issue #11.

## Current execution constraint

During the 12 July 2026 implementation attempt, the Figma MCP connection reported that the Starter-plan tool-call limit had been reached before canvas writes could begin. The repository handoff package was completed, but this runbook remains the required canvas execution sequence. Do not mark the Figma acceptance items complete until the writes and validations have actually occurred.
