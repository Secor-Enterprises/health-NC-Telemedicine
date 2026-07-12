# Design and Figma Governance

This directory contains the controlled UX, accessibility, localisation, clinical-safety and development-handoff documentation for Milestone 02.

## Documents

| Document | Purpose |
|---|---|
| `DESIGN_SYSTEM_HANDOFF.md` | Complete design-to-development contract for issues #11–#19 |
| `FIGMA_FRAME_REGISTER.md` | Node-specific Figma links and issue mappings |
| `FIGMA_IMPLEMENTATION_RUNBOOK.md` | Detailed canvas sequence for variables, components, states, journeys and QA |
| `FIGMA_CANVAS_EXECUTION_AND_ACCEPTANCE.md` | Operational procedure for running the plugin, reviewing the canvas and closing #11 |
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
- `design/figma-acceptance.json`

## Source and automation

- Figma: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- Git LFS backup: `design/source/figma/Secor-HealthConnect-Milestone-1-UX-Foundation.fig`
- Source handling: `design/source/figma/README.md`
- Local canvas plugin: `tools/figma-healthconnect/`
- Parent delivery issue: #11
- Canvas execution issues: #23–#28
- Portal feature issues: #12–#18
- Next.js platform epic: #19

## Acceptance status

The GitHub handoff package, source backup, local canvas automation and static validation are implemented. Issue #11 remains open until the plugin is run in Figma Desktop, the generated canvas is inspected, screenshots are attached and product, clinical, security/privacy and accessibility decisions are recorded through issues #23–#28.
