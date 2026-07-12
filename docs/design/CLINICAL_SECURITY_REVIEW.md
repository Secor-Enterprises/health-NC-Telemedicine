# Clinical-Safety and Security Design Review

## Purpose

This review ensures that Figma and frontend designs do not introduce unsafe clinical assumptions, misleading integration claims, excessive information exposure or privileged actions without adequate controls.

## Review roles

At minimum, approval requires representation from:

- Product owner
- Clinical workflow owner
- Security or identity owner
- Privacy/compliance owner
- Accessibility reviewer
- Technical lead

Formal pilot and production approval requires the governance authorities defined by the programme operating model.

## Identity and access review

- [ ] Workforce authentication is represented as Microsoft Entra ID.
- [ ] MFA and Conditional Access states are distinguishable from application-level prompts.
- [ ] Patient identity is not assumed to use the workforce Entra pattern without approval.
- [ ] Role visibility is explicitly separated from authorization.
- [ ] Role and facility context are visible where operationally necessary.
- [ ] Permission-denied states do not disclose restricted records.
- [ ] Privileged actions require confirmation or reauthentication patterns.
- [ ] Break-glass access is not represented as routine navigation.
- [ ] Joiner, mover, leaver and access-review states are covered in application administration.

## Privacy and POPIA review

- [ ] Patient-facing notices explain purpose in plain language.
- [ ] Consent is purpose-specific and versioned where consent is the applicable mechanism.
- [ ] Decline and withdrawal states are designed.
- [ ] Communication preferences distinguish WhatsApp and other channels.
- [ ] Default executive reporting is aggregated or minimised.
- [ ] Export, print, download and share actions are controlled.
- [ ] Screens avoid unnecessary identifiers and clinical detail.
- [ ] Audit expectations are annotated for sensitive access and changes.
- [ ] Screenshot and demonstration states contain synthetic data only.
- [ ] Retention and deletion expectations are documented outside the visual design where needed.

## Clinical workflow review

- [ ] Registration, consent, triage, consultation, referral and follow-up form a coherent pathway.
- [ ] Clinical facts, patient-reported data and system suggestions are visually distinct.
- [ ] Decision support is labelled advisory and human-reviewed.
- [ ] Stale, missing, incomplete or unverified data is clearly indicated.
- [ ] Clinical alerts state source, severity, required action and limitations.
- [ ] Observation values include units and recording context.
- [ ] Reference ranges and thresholds are not treated as approved until clinically validated.
- [ ] Prescription and referral states distinguish draft, mocked, sandbox and live submission.
- [ ] Consultation recording is off by default.
- [ ] Emergency guidance does not imply that the application replaces emergency services.

## Data-integrity review

- [ ] Create, edit, cancel and status-change workflows show confirmation and failure states.
- [ ] Unsaved changes and concurrent update conflicts are represented.
- [ ] Audit and provenance expectations are annotated.
- [ ] System-generated timestamps are distinguishable from user-entered dates.
- [ ] Correct facility, practitioner and patient context is visible before high-risk actions.
- [ ] Duplicate-patient and record-merge workflows are treated as privileged operations.
- [ ] Integration retry does not create duplicate prescriptions, referrals or appointments.

## Integration review

### Microsoft Teams and Graph

- [ ] Meeting links are not exposed to unauthorised users.
- [ ] Waiting-room and guest-access assumptions are explicit.
- [ ] Recording is not shown as default.
- [ ] Calendar availability and booking failure states are designed.
- [ ] Live, sandbox and mocked states are labelled.

### WhatsApp

- [ ] Opt-in, opt-out and channel-preference states exist.
- [ ] Message templates avoid unnecessary clinical information.
- [ ] Failed delivery and escalation states are visible.
- [ ] Uploads require purpose, consent and classification controls.
- [ ] The interface does not imply WhatsApp is a clinical emergency channel unless explicitly approved.

### HL7 FHIR

- [ ] FHIR is represented as an interoperability boundary, not the application database.
- [ ] Validation, versioning, provenance and error states are considered.
- [ ] Resource previews do not expose restricted data by default.
- [ ] Failed or partial exchange states are visible.
- [ ] The design does not imply interoperability certification that has not occurred.

### Azure SQL and platform services

- [ ] Azure SQL is the target application database.
- [ ] Row-Level Security is described as defence in depth, not the only authorization control.
- [ ] Secrets and connection strings are never displayed.
- [ ] Platform telemetry is separated from clinical record content.
- [ ] Environment distinctions are visible in administration and deployment views.

## Application-administration review

- [ ] Read-only status and destructive actions are visually distinct.
- [ ] Privileged changes use a two-step confirmation pattern.
- [ ] Audit-event search supports purpose-limited access.
- [ ] Secret metadata may be shown, but secret values may not.
- [ ] Service principal, managed identity and application-role states are understandable.
- [ ] Production actions cannot be confused with demo or test actions.
- [ ] Failed integrations, security alerts and incidents have clear ownership/escalation states.

## Clinical-safety severity

| Severity | Definition | Design acceptance |
|---|---|---|
| Critical | Could directly contribute to patient harm, incorrect treatment, unauthorised disclosure or loss of control over a privileged action | Blocks approval |
| High | Could materially mislead a clinician or expose sensitive information under realistic use | Blocks approval unless formally accepted with immediate remediation |
| Medium | Creates friction, ambiguity or incomplete evidence but has a safe workaround | Requires tracked remediation |
| Low | Cosmetic or minor consistency concern | May be scheduled |

## Evidence record

For every reviewed portal or journey, record:

- Figma node link
- GitHub issue
- Review date
- Reviewers and roles
- Findings by severity
- Decision: Approved, Approved with conditions, Rework required, Rejected
- Conditions and due dates
- Linked remediation issues

## Acceptance boundary

Repository and executive-demo approval does not equal pilot or production clinical approval. Pilot and production gates require formal evidence, authorised reviewers, operational procedures, security assurance and approved data governance.
