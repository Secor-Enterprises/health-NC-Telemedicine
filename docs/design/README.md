# Design and Figma Governance

This directory contains the controlled UX, accessibility, localisation, clinical-safety and development-handoff documentation for Milestone 02.

## Documents

| Document | Purpose |
|---|---|
| `DESIGN_SYSTEM_HANDOFF.md` | Complete design-to-development contract for issues #11–#19 |
| `FIGMA_FRAME_REGISTER.md` | Node-specific Figma links and issue mappings |
| `FIGMA_IMPLEMENTATION_RUNBOOK.md` | Exact sequence for variables, components, states, journeys and QA |
| `ACCESSIBILITY_CHECKLIST.md` | Cross-portal accessibility and inclusive-design acceptance criteria |
| `LOCALISATION_AND_SASL.md` | Eleven written languages and SASL/interpreter design guidance |
| `DEMONSTRATION_STATES.md` | Synthetic-data, integration-status and critical-state rules |
| `CLINICAL_SECURITY_REVIEW.md` | Clinical-safety, identity, privacy and integration review checklist |
| `REVIEW_AND_ACCEPTANCE_EVIDENCE.md` | Review record and sign-off template |

## Design-system artefacts

The machine-readable design contract is under `design/`:

- `design/tokens.json`
- `design/tokens.css`
- `design/components.json`
- `design/frame-map.json`

## Source file

- Figma: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- Primary delivery issue: #11
- Portal feature issues: #12–#18
- Next.js platform epic: #19

## Acceptance status

The GitHub handoff package is development-ready. The Figma file already contains the seven desktop role portals and selected responsive frames, but it does not yet have verified local variable collections, component sets, critical-state matrices, complete responsive journey coverage or final review evidence. Issue #11 remains open until the canvas implementation and validation are complete.
