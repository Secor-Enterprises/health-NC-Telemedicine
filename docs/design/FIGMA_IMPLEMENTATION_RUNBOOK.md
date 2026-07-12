# Figma Canvas Implementation Runbook

## Purpose

This runbook defines the controlled work required to convert the Secor HealthConnect Figma file from detached demonstration frames into a governed design-system and development-handoff file.

## Target file

- File key: `3qDF55zDbiYe95zfNRjQuE`
- URL: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- Git LFS backup: `design/source/figma/Secor-HealthConnect-Milestone-1-UX-Foundation.fig`
- Local plugin: `tools/figma-healthconnect/manifest.json`
- Parent issue: #11
- Execution issues: #23–#28

## Preferred execution method

Use the repository-managed Figma Desktop plugin to create or reconcile the governed starter canvas:

1. Pull the current repository.
2. Open the canonical Figma file in Figma Desktop.
3. Import `tools/figma-healthconnect/manifest.json` as a development plugin.
4. Run **Secor HealthConnect Canvas Bootstrap**.
5. Complete the verification, refinement and review procedure in `FIGMA_CANVAS_EXECUTION_AND_ACCEPTANCE.md`.

The plugin is idempotent for plugin-managed documentation, component, state, responsive and journey nodes. It does not grant formal approval.

## Execution order

### 1. Foundations and variables — #23

Create local collections in this order:

1. `HealthConnect/Primitives`
2. `HealthConnect/Semantic Color`
3. `HealthConnect/Spacing & Radius`
4. `HealthConnect/Motion & Layout`

Use `design/tokens.json` as the canonical values.

Variable rules:

- Primitive colours have narrow or empty scopes.
- Background semantic colours use `FRAME_FILL` and `SHAPE_FILL`.
- Text semantic colours use `TEXT_FILL`.
- Border colours use `STROKE_COLOR`.
- Spacing variables use `GAP`.
- Radius variables use `CORNER_RADIUS`.
- Every variable has web code syntax aligned to `design/tokens.css`.
- Semantic colours alias primitive variables rather than duplicating raw values.

### 2. Text and effect styles — #23

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

Use Inter in Figma and the token sizes and weights from `design/tokens.json`.

### 3. Page structure

Retain the current portal page and ensure these pages exist:

- `02 Additional MVP Flows`
- `03 Foundations & Tokens`
- `04 Components & Variants`
- `05 Critical States`
- `06 Accessibility & Localisation`
- `07 Developer Handoff`

### 4. Component sequence — #24

Build or reconcile components in dependency order:

1. IconSlot
2. StatusBadge
3. Button
4. TextField
5. SelectField
6. IntegrationStatus
7. NavigationItem
8. Panel
9. MetricCard
10. QueueRow
11. SystemState
12. ConsentNotice
13. ClinicalAlert
14. VitalsCard
15. ReferralCard
16. DataTable
17. ModalDialog
18. ToastNotification
19. AppShell

For each family:

- Use the names and expected API from `design/components.json`.
- Bind fills, strokes, gaps and radii to variables where applicable.
- Expose text, boolean and instance-swap properties where required.
- Add usage, accessibility and safety notes.
- Record resulting node IDs and screenshot evidence.
- Do not create an unmaintainable Cartesian product of every theoretical combination. Add combinations used by actual portal workflows while preserving controlled property names.

### 5. Screen migration — #24 and #26

For each existing portal frame:

- Replace detached button examples with Button instances.
- Replace detached navigation items with NavigationItem instances.
- Replace KPI and content frames with MetricCard and Panel instances.
- Replace status rectangles with StatusBadge or IntegrationStatus instances.
- Preserve layout and content while eliminating visual duplication.
- Add permissions, data source, validation, audit and integration-status annotations.
- Do not detach reusable instances after migration.

### 6. Critical-state frames — #25

Create page, panel and inline examples for:

- Loading
- Empty
- Error
- Offline
- Degraded connectivity
- Permission denied
- Session expired
- Maintenance

Error states must not expose stack traces, secrets or clinical information.

### 7. Priority journey frames — #27

Create and link this sequence:

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

The prototype must disclose synthetic data and integration state. Recording must not be represented as enabled by default. Clinical decision support remains advisory and human-reviewed.

### 8. Responsive completion — #26

Complete and review:

- Patient tablet
- Doctor tablet
- Nurse mobile summary
- Specialist tablet and mobile summary
- Facility administration tablet and mobile queue summary
- Executive mobile alert summary
- Application administration tablet and mobile alert summary

### 9. Accessibility and localisation — #25

Document and demonstrate:

- Focus treatment
- Keyboard order
- Touch targets
- Contrast and non-colour status
- Text scaling and expansion
- Accessible error patterns
- Chart and map alternatives
- English, Afrikaans, isiZulu, isiXhosa, Sepedi, Setswana, Sesotho, Xitsonga, siSwati, Tshivenda and isiNdebele patterns
- SASL and interpreter workflow states
- Low-literacy content patterns
- Low-bandwidth and offline behaviour

### 10. Developer handoff

For every approved frame, record:

- Figma node link
- GitHub issue
- Viewport
- Component and token dependencies
- Synthetic data fixture/source
- Validation and error behaviour
- Role, facility, patient and purpose boundary
- Audit-event expectation
- Integration state
- Review decision

## Validation after every phase

1. Inspect node hierarchy and component instances.
2. Capture adequate-resolution screenshots.
3. Check for clipped text, broken auto-layout and overlap.
4. Verify created and modified node IDs are recorded.
5. Verify no protected patient data or secret appears.
6. Update the relevant issue #23–#28.

## Completion criteria

Issue #11 is complete only when:

- Local variable collections and styles exist and are verified.
- Component sets exist and are used by portal frames.
- Critical states and responsive variants exist.
- End-to-end prototype navigation works without dead ends.
- Accessibility and localisation annotations are present.
- Node-specific links and screenshots are recorded.
- Product, clinical, security/privacy and accessibility review evidence is attached.
- No unresolved critical finding remains.
- The latest `.fig` milestone snapshot is committed through Git LFS.
- `design/figma-acceptance.json` records `accepted`.

## Current status

The repository contracts, Git LFS source backup, local canvas automation, static validation and issues #23–#28 are implemented. The remaining work is to run the plugin in Figma Desktop, inspect and refine the generated canvas, collect screenshots and record formal review decisions. Do not close issue #11 before that evidence exists.
