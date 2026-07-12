# Figma Frame Register

## Source file

- **File:** Secor HealthConnect — Milestone 1 UX Foundation
- **File URL:** https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- **File key:** `3qDF55zDbiYe95zfNRjQuE`
- **Primary issue:** #11

## Verified pages

| Page | Node | Status |
|---|---|---|
| Secor HealthConnect MVP Demo | `0:1` | Active; contains foundations, role portals and responsive frames |
| 02 Additional MVP Flows | `14:2` | Present but empty at the latest verified inspection |

## Foundations and handoff frames

| Frame | Node-specific link | GitHub issue | Status |
|---|---|---:|---|
| 01 — Design System | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=2-28 | #11 | Existing detached foundation documentation |
| 02 — Component Library | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=2-60 | #11 | Existing detached examples; component-set migration required |
| Prototype & Complete User Flows | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-453 | #11 | Existing; requires journey and annotation validation |

## Portal frames

| Role | Viewport | Node-specific link | Issue | Status |
|---|---|---|---:|---|
| Patient | Desktop | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-2 | #12 | Existing |
| Patient | Mobile | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-373 | #12 | Existing |
| Doctor | Desktop | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-55 | #13 | Existing |
| Doctor | Mobile | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-391 | #13 | Existing |
| Nurse | Desktop | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-108 | #14 | Existing |
| Nurse | Tablet | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-409 | #14 | Existing |
| Specialist | Desktop | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-161 | #15 | Existing |
| Facility administration | Desktop | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-214 | #16 | Existing |
| Provincial executive | Desktop | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-267 | #17 | Existing |
| Provincial executive | Tablet | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-431 | #17 | Existing |
| Application administration | Desktop | https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE?node-id=4-320 | #18 | Existing; currently named Azure Administration Desktop |

## Required responsive additions

| Role/journey | Required viewports | Issues |
|---|---|---|
| Patient registration, consent and appointment booking | Mobile, tablet, desktop | #11, #12, #16 |
| Virtual waiting room and readiness | Mobile, tablet, desktop | #11, #12, #13 |
| Nurse intake, triage and vitals | Tablet, desktop; mobile summary | #11, #14 |
| Doctor consultation | Desktop, tablet; mobile summary | #11, #13 |
| Specialist referral and MDT review | Desktop, tablet | #11, #15 |
| Facility queue and scheduling | Desktop, tablet, mobile queue summary | #11, #16 |
| Executive dashboard | Desktop, tablet, mobile alert summary | #11, #17 |
| Application administration | Desktop, tablet, mobile alert summary | #11, #18 |

## Required additional journey frames

The following frames must be created on `02 Additional MVP Flows` or a replacement journey page:

1. Secure sign-in
2. MFA verification
3. Language and accessibility preferences
4. POPIA privacy notice and purpose-specific consent
5. Patient registration and appointment booking
6. Virtual waiting room and device/connectivity checks
7. Nurse intake, triage and vitals
8. Teams-enabled doctor consultation
9. Specialist referral and multidisciplinary review
10. Prescription, laboratory, imaging and follow-up states
11. Administration, audit and platform-health states
12. Critical system states

## Required design-system pages

- `03 Foundations & Tokens`
- `04 Components & Variants`
- `05 Critical States`
- `06 Accessibility & Localisation`
- `07 Developer Handoff`

## Frame annotation standard

Every frame that is ready for development must include or link to:

- GitHub issue number
- Target viewport
- Data source or synthetic fixture
- Required and optional fields
- Validation and error behaviour
- Role/facility/patient/purpose permission context
- Audit-event expectation
- Integration status: Live, Sandbox, Mocked, Unavailable or Disabled
- Clinical review requirement
- Accessibility review status
- Product/design review status

## Acceptance rule

A role portal is not considered approved solely because a desktop frame exists. Approval requires responsive coverage, reusable component usage, critical states, annotations and recorded product, accessibility, security and clinical review evidence.
