# Role Portal Foundation Acceptance Status

## Delivery status

The role portal foundation from issue #19 has been implemented and merged through PR #30.

## Verified by automated checks

- Seven role portal configurations exist.
- Seven stable static portal routes exist.
- Eleven written official-language options are represented.
- Integration states are explicitly marked as mocked in the public demonstration.
- Domain tests execute through Node's test runner.
- TypeScript compilation is enforced.
- Next.js static export is generated.
- The export verifier checks the home page, 404 page and all seven portal route files.
- Design-system and Figma automation contracts remain validated.

## Partially verified

- Desktop, tablet and mobile behaviour is implemented through responsive CSS, but formal multi-browser screenshot evidence remains outstanding.
- Keyboard focus and reduced-motion rules are implemented, but browser-driven axe testing remains outstanding.
- The cross-role journey is represented in the application, but full Playwright browser automation remains outstanding.

## Not yet production-complete

- Live Microsoft Entra authentication
- Server-side Azure SQL APIs
- Live Teams consultation creation
- Live WhatsApp messaging
- Live HL7 FHIR exchange
- Production-grade audit persistence
- Departmental product, clinical, security, privacy and accessibility approval
- Pilot and production hosting assurance

## Acceptance boundary

The current implementation is an approved candidate for synthetic executive demonstration after CI and GitHub Pages deployment succeed. It is not a production clinical application and must not process real patient information.
