# Secor HealthConnect Design System

This directory is the version-controlled design-to-development contract for the Secor HealthConnect telemedicine platform.

## Sources of truth

- Figma: `Secor HealthConnect — Milestone 1 UX Foundation`
- Figma file key: `3qDF55zDbiYe95zfNRjQuE`
- GitHub issue: #11
- Portal delivery issues: #12–#18
- Next.js platform epic: #19

## Files

| File | Purpose |
|---|---|
| `tokens.json` | Canonical colour, typography, spacing, radius, elevation, motion and breakpoint contract |
| `tokens.css` | Developer-ready CSS variables matching the token contract |
| `components.json` | Governed component families, variants, properties and safety notes |
| `frame-map.json` | Figma page/frame register and mapping to GitHub issues |

Supporting governance and implementation guidance is maintained under `docs/design/`.

## Operating rules

1. Figma variables and components must use the names in these files unless a reviewed design decision changes the contract.
2. Code and Figma changes that alter a token or component API must update both representations in one pull request or record an explicit follow-up issue.
3. Role visibility in a prototype is not authorization. Connected implementations enforce authorization through server-side APIs and Microsoft Entra context.
4. All public and repository-hosted demonstrations use synthetic data only.
5. Teams, WhatsApp, FHIR, Azure SQL and Azure platform states must be labelled `Live`, `Sandbox`, `Mocked`, `Unavailable` or `Disabled`.
6. Clinical decision-support concepts remain advisory and human-reviewed.
7. Accessibility, localisation, POPIA and clinical-safety requirements are acceptance criteria, not optional polish.

## Status

The token, component and frame-map contracts are ready for use by the Next.js implementation. Figma canvas variables, component sets, annotations and additional journey frames require verification after the Figma MCP write limit is available again.
