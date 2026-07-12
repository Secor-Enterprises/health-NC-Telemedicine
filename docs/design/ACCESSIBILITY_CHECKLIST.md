# Accessibility and Inclusive-Design Checklist

## Scope

This checklist applies to Figma review, Next.js implementation and acceptance of issues #11–#19. It is designed for a multilingual healthcare service operating across desktop, tablet, mobile and constrained-connectivity contexts.

## Structure and navigation

- [ ] Every screen has a single clear page title.
- [ ] Heading levels form a logical hierarchy.
- [ ] Landmarks and regions are identifiable in code and in Figma annotations.
- [ ] Keyboard focus order follows the visual and task order.
- [ ] Skip navigation is available for repeated application chrome.
- [ ] Collapsed navigation retains accessible names and tooltips.
- [ ] Modal focus is trapped and returned to the trigger on close.
- [ ] No essential operation requires pointer-only dragging.

## Focus and interaction

- [ ] Every interactive element has a visible focus state.
- [ ] Focus does not depend on colour alone.
- [ ] Minimum target size is 44 × 44 px; 48 × 48 px is preferred for clinical and mobile contexts.
- [ ] Hover-only content is also available through focus or activation.
- [ ] Disabled controls remain understandable and explain why the action is unavailable where needed.
- [ ] Destructive and privileged actions require clear confirmation.
- [ ] Time-limited sessions warn users and support continuation where policy permits.

## Colour and contrast

- [ ] Text contrast meets the approved accessibility standard.
- [ ] Large-text and non-text contrast are checked separately.
- [ ] Clinical urgency, integration health and validation errors include text/icon indicators.
- [ ] Charts, maps and trends do not rely on a red/green distinction.
- [ ] Focus rings remain visible against all supported surfaces.
- [ ] Disabled-state contrast remains legible without implying interactivity.

## Typography and scaling

- [ ] Body text is readable at default browser settings.
- [ ] Layout remains usable at 200% text zoom.
- [ ] Content reflows without horizontal scrolling at supported mobile widths, except for genuinely two-dimensional content with an alternative.
- [ ] Fixed-height text containers do not clip translated or enlarged text.
- [ ] Abbreviations and medical terminology are expanded or explained where practical.
- [ ] Plain-language alternatives are provided for patient-facing clinical content.

## Forms and validation

- [ ] Inputs retain visible labels; placeholders are not used as labels.
- [ ] Required fields are identified in text and programmatically.
- [ ] Instructions precede complex input groups.
- [ ] Errors identify the field, problem and corrective action.
- [ ] Error summaries move focus appropriately.
- [ ] Numeric clinical fields include units.
- [ ] Vitals and other clinical inputs define allowed formats and validation behaviour.
- [ ] Date, time, language and facility selectors are keyboard operable.
- [ ] Autocomplete attributes are used where appropriate and safe.

## Status and messaging

- [ ] Loading status is exposed to assistive technology.
- [ ] Toasts use an appropriate live region and remain long enough to understand.
- [ ] Critical alerts use assertive announcement only when justified.
- [ ] Background refresh does not unexpectedly move focus.
- [ ] Offline, degraded and reconnect states clearly explain what is saved and what is not.
- [ ] Integration status uses the controlled labels Live, Sandbox, Mocked, Unavailable or Disabled.
- [ ] Error messages do not expose secrets, stack traces or unnecessary patient information.

## Tables, charts and maps

- [ ] Tables include captions and meaningful header relationships.
- [ ] Sort and filter states are announced.
- [ ] Row actions have contextual accessible names.
- [ ] Dense desktop tables have a mobile card or summary alternative.
- [ ] Charts include titles, metric definitions and tabular alternatives.
- [ ] Maps include a non-map facility/service coverage alternative.
- [ ] Data date, freshness and synthetic/unvalidated status are visible.

## Media and consultations

- [ ] Consultation controls have accessible names and states.
- [ ] Device and connectivity checks provide text results.
- [ ] Captions and interpreter requirements are represented.
- [ ] Recording is not presented as enabled by default.
- [ ] A non-video or asynchronous alternative is documented for constrained connectivity.
- [ ] Uploaded images and documents include descriptive labels and purpose.

## Localisation and SASL

- [ ] Language selection is reachable before complex consent or registration.
- [ ] Interface layout supports text expansion.
- [ ] Language names are understandable and consistently ordered.
- [ ] South African Sign Language is represented through accessibility and interpreter workflows, not as a written translation file.
- [ ] Interpreter request, availability, confirmation and cancellation states exist.
- [ ] Patient-facing content is reviewed for literacy and terminology appropriateness.

## Cognitive and clinical safety

- [ ] Priority tasks are visually prominent without excessive competing alerts.
- [ ] Clinical facts, patient-reported information and system suggestions are distinguished.
- [ ] Advisory decision support explicitly requires human confirmation.
- [ ] Stale, missing and incomplete clinical data is visible.
- [ ] Confirmation messages repeat the action and relevant context.
- [ ] Users can recover from accidental navigation or unsaved changes.
- [ ] Emergency instructions are clear and do not imply the application replaces emergency services.

## Review evidence

For each approved portal, record:

- Viewport(s) tested
- Keyboard review result
- Screen-reader review result
- Contrast review result
- Text scaling result
- Localisation expansion result
- Low-bandwidth/offline-state result
- Reviewer name/role
- Date
- Exceptions and linked remediation issue

## Acceptance rule

No portal is accepted with an unresolved critical barrier that blocks access to registration, consent, triage, consultation, referral, medication, results, administration or emergency guidance.
