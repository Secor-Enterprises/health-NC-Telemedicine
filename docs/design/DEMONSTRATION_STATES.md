# Synthetic Data and Demonstration-State Patterns

## Purpose

Secor HealthConnect currently operates as a public, synthetic demonstration. The interface must communicate what is functional, what is simulated and what requires future Azure integration. This prevents stakeholders from mistaking presentation states for production clinical capability.

## Environment banner

Every demonstration screen should expose a persistent but non-obstructive banner or status in the application chrome:

> Synthetic demonstration data only. Not for clinical decisions or real patient information.

The banner must remain visible after role switching and should be included in screenshots used outside the repository.

## Integration-status vocabulary

Only these labels should be used:

| Status | Meaning | UI treatment |
|---|---|---|
| Live | Connected and verified in the current environment | Success tone plus last-checked time |
| Sandbox | Connected to an approved non-production service | Information tone plus environment label |
| Mocked | Simulated locally or through fixtures | Neutral/warning tone and explicit simulation text |
| Unavailable | Expected service is not reachable or not provisioned | Error/warning tone, impact and retry/support action |
| Disabled | Deliberately turned off by policy or configuration | Neutral tone and reason where appropriate |

Do not use vague labels such as `Connected`, `Ready` or `Active` without environment context.

## Data-source annotation

Every dashboard, list, patient summary and clinical record should identify one of:

- Synthetic fixture
- Generated demonstration record
- Approved test dataset
- Sandbox integration response
- Production source — prohibited in the current GitHub Pages environment

## Critical system states

### Loading

- Use skeletons or progress indicators only when they improve understanding.
- Preserve layout to avoid content movement.
- Provide an accessible status.
- Do not imply successful completion before the operation resolves.

### Empty

Explain:

- What is empty
- Why it may be empty
- Whether this is expected
- What action the user can take

Examples:

- No appointments are scheduled for this date.
- No referrals match the selected speciality and facility.
- No audit events match the current filters.

### Error

Include:

- Plain-language description
- What was and was not saved
- Safe next action
- Reference ID that contains no patient information
- Support route where appropriate

Do not show stack traces, tokens, SQL messages or secret names.

### Offline

State clearly:

- Current connectivity condition
- Whether the user can continue
- Whether the draft is stored only on the device or safely queued
- Which actions require reconnection
- Whether clinical data may be stale

### Degraded connectivity

Offer:

- Audio-only or asynchronous alternative where approved
- Retry and reconnect
- Lower-bandwidth document/image behaviour
- Explicit data freshness
- Preservation of entered data

### Permission denied

Explain:

- The requested action cannot be completed with the current role/context
- The user should not retry repeatedly
- The route for access review or support

Do not disclose whether another patient, facility or restricted record exists.

### Session expired

- Preserve non-sensitive draft state where policy permits.
- Require reauthentication before showing protected content.
- Explain whether unsaved changes remain available.
- Return users to a safe location after sign-in.

### Maintenance

- State the affected service or function.
- Provide expected restoration time only when known.
- Identify emergency or alternative workflows.
- Do not block access to approved emergency guidance.

## Role switching

Demo role switching is acceptable only in the synthetic environment.

- Label the control `Demo role`.
- Do not represent it as Entra role assignment.
- Reset role-specific temporary state when switching.
- Prevent the control from appearing in pilot or production builds.
- Connected implementations derive roles from validated Entra claims and server-side authorization.

## Clinical workflow disclosures

### Decision support

Use:

> Advisory suggestion. A qualified clinician must review and confirm.

Never use:

> Diagnosis complete

or any language that implies autonomous clinical authority.

### Prescription and referral

Show a transmission status:

- Draft only
- Mocked submission
- Sandbox submitted
- Live submitted and acknowledged
- Failed

### Consultation recording

- Recording is off by default.
- Do not show an active recording indicator unless an approved policy, consent and technical integration exist.
- Demonstration screenshots must not imply recording is operational.

## Synthetic content standard

Synthetic records should:

- Use fictional names and identifiers
- Avoid combinations that closely resemble known real individuals
- Use clearly fictional contact information
- Avoid real medical record numbers
- Include plausible but explicitly synthetic clinical scenarios
- Avoid copying production screenshots or exports
- Be safe for public demonstration

## Screenshot standard

Before sharing a screenshot or recording:

- [ ] Synthetic-data indicator is visible
- [ ] No personal or production information is present
- [ ] Integration statuses are accurate
- [ ] Browser address, notifications and unrelated tabs are excluded
- [ ] Role and environment are visible
- [ ] Known limitation is disclosed when relevant
- [ ] Clinical alerts are clearly advisory

## Acceptance rule

No Figma frame or GitHub Pages workflow may be approved when it could reasonably cause a viewer to believe that a mocked integration, unvalidated clinical function or synthetic metric is operational production capability.
