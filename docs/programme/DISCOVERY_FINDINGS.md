# Initial Discovery Findings

## Discovery scope

The mobilisation discovery synthesises the available proposal, presentation, meeting-pack requirements, current Figma work, repository implementation and architecture decisions. It is an initial planning baseline, not a substitute for on-site facility assessment or formal Department of Health validation.

## Clinical and service findings

1. **Telemedicine must be treated as a care pathway, not a video-call feature.** The required journey spans registration, consent, appointment, triage, consultation, documentation, referral, results, prescription, follow-up and operational reporting.
2. **Role separation is material.** Patient, nurse, doctor, specialist, facility administration, provincial executive and application administration experiences require distinct permissions and task models.
3. **Human clinical accountability must remain explicit.** Triage support, decision support, transcription and AI concepts may assist users but must not autonomously diagnose, prescribe or close clinical decisions.
4. **Referral management is a primary value pathway.** Structured referrals, specialist review, evidence requests and transfer-avoidance measures are central to rural service improvement.
5. **Continuity of care requires a longitudinal view.** Appointments, encounters, observations, medications, requests, results, referrals, consent and communications need coherent history and provenance.
6. **Clinical validation is currently representative rather than formally signed off.** Named clinical authorities and representative users remain required before pilot acceptance.

## Facility and operational findings

1. District hospitals and feeder clinics will have different staffing, equipment, scheduling and escalation patterns.
2. The administration workflow must coordinate patients, clinicians, rooms, devices, interpreters and remote sessions.
3. Queue and waiting-room state must remain consistent across patient, nurse, doctor and administration views.
4. Facility readiness must include power, connectivity, privacy, device, support and escalation assessment.
5. Operational dashboards must disclose data freshness and avoid presenting synthetic demonstration metrics as official statistics.
6. Pilot facility selection requires formal criteria covering clinical demand, connectivity, staffing, leadership support and supportability.

## Connectivity and accessibility findings

1. Rural connectivity variability is a material delivery risk.
2. The design must include reconnect, retry, low-bandwidth, offline-draft and asynchronous communication states.
3. Video consultation cannot be the only supported interaction pattern.
4. Accessibility is broader than responsive layout and must include keyboard, focus, contrast, text scaling, screen-reader support and plain-language content.
5. Written-interface planning covers English, Afrikaans, isiZulu, isiXhosa, Sepedi, Setswana, Sesotho, Xitsonga, siSwati, Tshivenda and isiNdebele.
6. South African Sign Language support should be implemented through accessibility and interpreter workflows rather than treated as a direct written translation.

## Identity, security and privacy findings

1. Microsoft Entra ID is the target workforce identity authority and must provide app roles, MFA alignment, Conditional Access integration and auditable access governance.
2. Patient identity requires a separate approved model; workforce Entra assumptions must not automatically be applied to all patients.
3. Client-side role switching is acceptable only for the synthetic demonstration and is not an authorization boundary.
4. Azure SQL and server-side APIs must enforce user, role, facility, patient and purpose context.
5. POPIA controls require lawful purpose, minimisation, consent where applicable, retention, sharing restrictions, access logging and incident handling.
6. Real patient information, production credentials and secret values are prohibited in GitHub Pages and repository fixtures.
7. Privileged administration requires least privilege, separation of duties, reauthentication, audit and break-glass monitoring.

## Data and interoperability findings

1. Azure SQL Database is the approved target application data platform for the current architecture baseline.
2. Core application entities include users, practitioners, facilities, patients, appointments, encounters, observations, referrals, medications, diagnostic results, consent, notifications, audit events and integration events.
3. HL7 FHIR R4 is the intended interoperability boundary, subject to confirmation of provincial/national profiles and terminology requirements.
4. Priority resources include Patient, Practitioner, PractitionerRole, Organization, Location, Appointment, Encounter, Observation, ServiceRequest, DiagnosticReport, MedicationRequest, Consent, Provenance, DocumentReference and AuditEvent.
5. Executive reporting should use governed views and aggregated/de-identified projections rather than unrestricted operational tables.
6. Data quality, provenance, versioning and terminology validation must be defined before external exchange.

## Integration findings

1. Microsoft Teams and Graph are appropriate for workforce calendar and consultation orchestration, subject to tenant, guest, licensing, consent and recording policies.
2. WhatsApp Business is appropriate for approved transactional communications such as confirmations and reminders, subject to opt-in, template, retention and escalation controls.
3. Integrations need explicit live, sandbox, mocked, disabled and unavailable states.
4. Asynchronous processing, retry, dead-letter handling and monitoring are required for reliable integrations.
5. External APIs must be protected by approved identity, API management, throttling, validation and audit controls.

## Product and engineering findings

1. The repository has been consolidated on Next.js App Router, React and TypeScript.
2. The public GitHub Pages deployment is suitable for a synthetic executive demonstration, not a production health-service workload.
3. The existing portal demonstration provides a useful visual baseline but requires route structure, typed domain services, automated tests, accessibility hardening and adapter boundaries.
4. The Figma file contains role frames and additional flow frames that should be mapped directly to GitHub issues and development acceptance criteria.
5. Azure hosting must be introduced without coupling application architecture to GitHub Pages static hosting.
6. CI currently validates type checking, production build and static export; the quality roadmap must add unit, component, end-to-end, accessibility, security and infrastructure validation.

## Prioritised backlog for Milestones 02 and 03

### Milestone 02 priorities

- Issue #11: Figma design system, high-fidelity role portals and end-to-end workflow handoff
- Clinical workflow review
- Accessibility and localisation review
- Error, loading, offline and permission states
- Development annotations and component inventory

### Milestone 03 priorities

- Issue #19: shared Next.js application foundation
- Issue #12: patient portal
- Issue #14: nurse portal
- Issue #13: doctor portal
- Issue #15: specialist portal
- Issue #16: facility administration portal
- Issue #17: provincial executive portal
- Issue #18: application administration portal

Recommended sequence: platform shell and design tokens; patient booking; nurse triage; doctor consultation; specialist referral; administration; executive and application-administration views.

## Discovery gaps carried forward

- Named Department of Health sponsor and formal governance representatives
- On-site facility, device, privacy, connectivity and support assessment
- Approved patient identity and consent model
- Provincial systems/interface catalogue
- Approved FHIR profiles and terminology
- Teams/Graph tenant and licensing confirmation
- WhatsApp Business account and processing approval
- Formal clinical-safety, privacy and production-hosting approvals

These gaps are recorded in the RAID register and remain stage-gate dependencies.
