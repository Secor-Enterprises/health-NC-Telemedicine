# Secor HealthConnect Canvas Bootstrap

## Purpose

This local Figma plugin creates or reconciles the repository-governed canvas structures required by issues #11 and #23–#28.

It is designed for the canonical file:

- `Secor HealthConnect — Milestone 1 UX Foundation`
- File key: `3qDF55zDbiYe95zfNRjQuE`
- Repository backup: `design/source/figma/Secor-HealthConnect-Milestone-1-UX-Foundation.fig`

## What the plugin creates

- Four local variable collections
- Primitive and semantic colour variables
- Spacing, radius, motion, touch-target and breakpoint variables
- HealthConnect text styles
- Surface, floating and focus effect styles
- `03 Foundations & Tokens`
- `04 Components & Variants`
- `05 Critical States`
- `06 Accessibility & Localisation`
- `07 Developer Handoff`
- Eleven linked journey frames on `02 Additional MVP Flows`
- Ten missing responsive role frames
- Local component-set starters for all 18 controlled component families
- A local `HC/IconSlot` component set and Carbon-icon replacement strategy
- GitHub issue, role, viewport, data and review metadata on the seven existing desktop portal frames
- PNG export settings on portal, responsive and journey frames

## Safety boundaries

The plugin:

- Uses synthetic demonstration content only
- Does not connect to Azure SQL, Microsoft Entra, Teams, WhatsApp or FHIR
- Labels integrations as mocked in the generated journey examples
- Does not enable recording
- Does not make a clinical decision
- Does not mark any screen clinically, technically or regulatorily approved

## Install in Figma Desktop

1. Clone or pull the repository.
2. Open Figma Desktop.
3. Open the canonical cloud file, or import the `.fig` backup from `design/source/figma/`.
4. Select **Plugins → Development → Import plugin from manifest…**.
5. Select:

   ```text
   tools/figma-healthconnect/manifest.json
   ```

6. Run **Plugins → Development → Secor HealthConnect Canvas Bootstrap**.
7. Wait for the completion message.
8. Inspect all generated pages before saving a new `.fig` backup.

## Idempotency

Generated top-level nodes are tagged through shared plugin data. Rerunning the plugin replaces plugin-managed documentation, component, state, accessibility, handoff, journey and responsive nodes rather than continually duplicating them.

Existing desktop portal frames are not deleted. They receive shared handoff metadata and PNG export settings.

## Required manual review after execution

The automation does not replace professional review. Complete the following work items:

- #23 — Verify variables and styles
- #24 — Refine component properties, variant coverage and instance-swap behaviour
- #25 — Verify critical states and accessibility/localisation examples
- #26 — Review responsive portal layouts and shared-component migration
- #27 — Verify all prototype links and journey content
- #28 — Export screenshots and record product, clinical, security/privacy and accessibility decisions

## Known implementation boundary

The plugin creates a practical canonical component starter set without generating every Cartesian product listed in `design/components.json`. Generating all combinations would create approximately one thousand variants and make the file difficult to maintain. Reviewers should add only combinations that are required by actual portal workflows, while preserving the controlled property names and safety rules.

## Validation

Run:

```bash
npm run validate:figma-plugin
npm run validate:design
npm run typecheck
npm run build
```

The static validator checks the manifest, required pages, collection names, component families, journey definitions, safety language and issue references. It cannot execute the Figma Plugin API; canvas verification must be performed in Figma Desktop.
