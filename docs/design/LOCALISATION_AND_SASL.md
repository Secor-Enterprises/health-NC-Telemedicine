# Localisation and South African Sign Language Guidance

## Purpose

Secor HealthConnect must support multilingual patient access without treating language as a cosmetic preference. Language, literacy, interpretation and accessibility affect consent, triage, consultation, medication and follow-up safety.

## Written interface languages

The planned written-interface resources are:

1. English
2. Afrikaans
3. isiZulu
4. isiXhosa
5. Sepedi
6. Setswana
7. Sesotho
8. Xitsonga
9. siSwati
10. Tshivenda
11. isiNdebele

South African Sign Language is supported through accessibility and interpreter workflows, not through a direct written translation resource.

## Language-selection pattern

- Provide language selection before complex registration, privacy or consent content.
- Persist the selected language for the current user/session where lawful and technically appropriate.
- Display the current language in the global application chrome.
- Allow users to change language without losing entered form data.
- Record whether clinical content was communicated through an interpreter.
- Do not infer proficiency solely from home language or location.

## Figma requirements

Each priority patient and clinician journey must include:

- A language selector state
- A long-text expansion example
- A translated-content fallback state
- An untranslated clinical term indicator where approved terminology is unavailable
- Interpreter required/requested/confirmed/unavailable/cancelled states
- A SASL access indicator
- Mobile layouts tested with expanded labels and instructions

## Content rules

- Prefer plain language and short sentences in patient-facing content.
- Avoid untranslated abbreviations when an understandable full term exists.
- Keep medical terms consistent across appointments, medication, results and referrals.
- Do not machine-translate final clinical instructions without human review and an approved workflow.
- Preserve the source-language version and translation provenance for high-risk content.
- Identify whether a translation is approved, draft or machine-assisted.
- Avoid embedding text inside images.

## Layout rules

- Use auto-layout and content-driven heights.
- Avoid fixed-width buttons that clip translated labels.
- Allow a minimum 30% text expansion during review; test higher expansion for compact labels.
- Avoid all-uppercase body copy.
- Keep icons supplementary rather than language-dependent.
- Use left-to-right layouts for the listed written languages unless a future approved language requires another direction.

## SASL and interpreter workflow

### Patient preference

Capture:

- Preferred communication language
- SASL requirement
- Interpreter required
- Interpreter type or modality
- Accessibility notes
- Consent to involve an interpreter where applicable

### Booking states

- Not requested
- Requested
- Searching
- Confirmed
- Changed
- Cancelled
- Unavailable
- Alternative arrangement required

### Consultation states

- Interpreter joined
- Interpreter delayed
- Interpreter disconnected
- Reconnect required
- Consultation paused
- Alternative communication channel active

### Governance

- Interpreter access must be purpose-limited and auditable.
- Interpreters receive only the information required for the interaction.
- Confidentiality requirements must be visible in operational procedures.
- The application must not represent automated sign-language generation as a substitute for a qualified interpreter.

## Low-literacy support

- Pair critical instructions with clear icons and concise headings.
- Break long workflows into logical steps.
- Confirm understanding for consent, medication and follow-up instructions.
- Provide a read-aloud or assisted-service pattern where approved.
- Avoid shame-inducing or technical error language.
- Make help and human support easy to find.

## Translation workflow

1. Source content approved in English or another designated source language.
2. Clinical terminology reviewed by a clinical content owner.
3. Translation completed by an approved translator.
4. Independent review or back-translation for high-risk content.
5. Accessibility and layout review.
6. Version, reviewer and approval date recorded.
7. Resource deployed and regression-tested.

## Resource naming

Recommended code resource structure:

```text
locales/
  en/
  af/
  zu/
  xh/
  nso/
  tn/
  st/
  ts/
  ss/
  ve/
  nr/
```

Recommended key pattern:

```text
patient.appointment.book.title
patient.consent.teleconsultation.summary
nurse.triage.vitals.oxygenSaturation.label
doctor.referral.submit.confirmation
common.integration.mocked
common.error.offlineDraftSaved
```

## Acceptance evidence

For each language release, record:

- Content version
- Translator and reviewer roles
- Clinical terminology review
- Screens tested
- Text expansion defects
- Accessibility result
- Date approved
- Known untranslated content
- Linked remediation issues

## Safety boundary

The design may demonstrate translated text with synthetic content. It must not imply that clinical translations are approved for operational use until the documented translation and clinical-review workflow is complete.
