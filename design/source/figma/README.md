# Secor HealthConnect Figma Source

## Current source file

`Secor-HealthConnect-Milestone-1-UX-Foundation.fig`

## Canonical cloud document

- Name: `Secor HealthConnect — Milestone 1 UX Foundation`
- File key: `3qDF55zDbiYe95zfNRjQuE`
- Figma URL: https://www.figma.com/design/3qDF55zDbiYe95zfNRjQuE
- Parent work item: #11
- Canvas work items: #23–#28

## Purpose

The `.fig` file is a versioned backup of the editable Figma document. The cloud Figma file remains the collaborative design workspace; the repository backup supports audit, recovery and milestone snapshots.

## Handling rules

1. Track `.fig` files with Git LFS.
2. Store only synthetic demonstration data.
3. Do not include real patient information, credentials, access tokens, connection strings or production secrets.
4. Export a new source backup before major design reviews and milestone closure.
5. Update `design/frame-map.json` when page or frame node references change.
6. Update `docs/design/REVIEW_AND_ACCEPTANCE_EVIDENCE.md` when review evidence is captured.
7. Do not place `.fig` files in `public/`, `src/`, `docs/` or the repository root.
8. The `.fig` file must not be included in the Next.js or GitHub Pages build.

## Local plugin

Use the repository-managed plugin under `tools/figma-healthconnect/` to create or reconcile the local variables, styles, component starters, critical-state page, responsive frames, prototype journey and developer-handoff pages.

The plugin is an implementation aid, not automatic acceptance. Product, clinical, security/privacy and accessibility reviewers must still inspect the resulting canvas and record their decisions.