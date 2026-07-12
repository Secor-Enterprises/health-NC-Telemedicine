# Figma Canvas Execution and Acceptance

## Purpose

This procedure converts the repository-governed design contracts into Figma canvas objects and records the evidence required to close issue #11.

## Inputs

- Canonical cloud file: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- Git LFS backup: `design/source/figma/Secor-HealthConnect-Milestone-1-UX-Foundation.fig`
- Tokens: `design/tokens.json`
- Components: `design/components.json`
- Frame mapping: `design/frame-map.json`
- Acceptance register: `design/figma-acceptance.json`
- Local plugin: `tools/figma-healthconnect/manifest.json`

## Controlled work items

| Issue | Scope | Blocking evidence |
|---:|---|---|
| #23 | Variables, text styles and effect styles | Collection/style inventory and foundations screenshots |
| #24 | Components, variants and icon strategy | Component-set inventory, instance checks and component screenshots |
| #25 | Critical states, accessibility, localisation and SASL | State matrix and accessibility/localisation screenshots |
| #26 | Responsive portals and portal review readiness | Responsive screenshots and portal review status |
| #27 | End-to-end prototype navigation | Prototype start point, links and walkthrough evidence |
| #28 | Final screenshots and review decisions | Product, clinical, security/privacy and accessibility decisions |

## Execution procedure

### 1. Prepare the file

1. Pull the latest `main` branch.
2. Confirm Git LFS has downloaded the `.fig` object rather than leaving only the pointer file.
3. Open the canonical cloud file in Figma Desktop. Use the repository backup only for restoration or controlled comparison.
4. Create a named Figma version before running automation.
5. Confirm the file contains no real patient information or production secret.

### 2. Import and run the plugin

1. In Figma Desktop, select **Plugins → Development → Import plugin from manifest…**.
2. Select `tools/figma-healthconnect/manifest.json`.
3. Run **Secor HealthConnect Canvas Bootstrap**.
4. Record the completion message.
5. Confirm the following pages exist:
   - `02 Additional MVP Flows`
   - `03 Foundations & Tokens`
   - `04 Components & Variants`
   - `05 Critical States`
   - `06 Accessibility & Localisation`
   - `07 Developer Handoff`

### 3. Verify foundations

Confirm:

- `HealthConnect/Primitives`
- `HealthConnect/Semantic Color`
- `HealthConnect/Spacing & Radius`
- `HealthConnect/Motion & Layout`
- HealthConnect text styles
- HealthConnect surface, floating and focus effect styles
- Explicit scopes and web syntax
- Semantic aliases rather than duplicated raw values

Update #23 with counts, screenshots and findings.

### 4. Verify components

Confirm all 18 component families exist as local component sets or controlled local wrappers.

The plugin intentionally creates a maintainable starter matrix rather than approximately one thousand Cartesian-product variants. Add only combinations demonstrated by a real portal workflow. Preserve the controlled property names and component safety notes.

Verify:

- Variables are bound to fills, strokes, spacing and radii where applicable
- Text and icon properties are exposed where required
- `HC/IconSlot` documents Carbon icon replacement
- Portal frames use instances rather than duplicated detached patterns
- Instances remain attached
- Status, urgency and clinical meaning do not rely on colour alone

Update #24 with component-set IDs and screenshots.

### 5. Verify critical states and inclusive design

Inspect every generated state at page, panel and inline scope:

- Loading
- Empty
- Error
- Offline
- Degraded connectivity
- Permission denied
- Session expired
- Maintenance

Verify keyboard, focus, touch-target, text-expansion, non-colour status, screen-reader, low-literacy, low-bandwidth, language and SASL/interpreter examples.

Update #25 with evidence.

### 6. Verify responsive portals

Inspect the seven existing desktop portals and ten generated responsive frames.

Confirm:

- No clipped or overlapping text
- Logical reading and focus order
- 44px minimum interactive targets
- Synthetic-data disclosure
- Integration-state disclosure
- Role/facility/patient/purpose boundary annotations
- PNG export settings

Update #26 with screenshots and portal-by-portal review readiness.

### 7. Verify prototype navigation

Set `Secure Sign-in` as the prototype starting point. Walk every CTA through:

1. Secure sign-in
2. MFA verification
3. Language and accessibility
4. POPIA consent
5. Appointment booking
6. Virtual waiting room
7. Nurse triage and vitals
8. Doctor consultation
9. Specialist referral and MDT
10. Prescription, results and follow-up
11. Administration, audit and platform health

Verify there are no dead ends and no claim that mocked services are live.

Update #27 with prototype URL and walkthrough evidence.

### 8. Complete formal reviews

Use `docs/design/REVIEW_AND_ACCEPTANCE_EVIDENCE.md` for each review domain:

- Product
- Clinical
- Security and privacy
- Accessibility and localisation

Each review record must contain:

- Reviewer
- Role
- Date
- Scope
- Decision
- Findings
- Severity
- Follow-up issue
- Evidence link

Reviewers must not approve work outside their authority.

### 9. Export evidence

Export PNG evidence for:

- Seven desktop portals
- Existing patient/doctor mobile and nurse/executive tablet views
- Ten newly generated responsive frames
- Foundations page
- Components page
- Critical states page
- Accessibility/localisation page
- Developer handoff page
- Representative journey frames

Attach evidence or approved links to #28 and #11.

### 10. Close-out

Issue #11 may close only when:

- #23–#28 are complete
- All acceptance criteria have evidence
- No unresolved critical clinical-safety, security, privacy, product or accessibility finding remains
- The latest `.fig` milestone snapshot is committed through Git LFS
- `design/figma-acceptance.json` is updated to `accepted`
- CI passes design, Figma automation, TypeScript and production-build validation

## Acceptance boundary

Running the plugin does not constitute formal acceptance. It creates the controlled canvas baseline. Human review, evidence and recorded decisions remain mandatory.
