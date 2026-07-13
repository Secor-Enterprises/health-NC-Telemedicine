# GitHub Pages Deployment Verification

## Automated verification

The CI workflow validates the generated static export before deployment:

- `out/index.html`
- `out/404.html`
- All seven `out/portals/<role>/index.html` files
- Next.js static assets under `out/_next`

## Post-deployment verification

After a successful `Deploy Secor HealthConnect` workflow, verify:

1. https://secor-enterprises.github.io/health-NC-Telemedicine/
2. `/portals/patient/`
3. `/portals/doctor/`
4. `/portals/nurse/`
5. `/portals/specialist/`
6. `/portals/administration/`
7. `/portals/executive/`
8. `/portals/platform-admin/`

For every route confirm:

- HTTP page load succeeds
- Styles and Next.js assets load
- Role navigation works
- Synthetic-data notice is visible
- Mocked integration status is visible
- No secret or real patient information is displayed
- Mobile and desktop navigation remains usable

## Evidence record

- Commit SHA:
- CI run URL:
- Deployment run URL:
- Verification date:
- Reviewer:
- Failed routes:
- Console errors:
- Known limitations:

## Constraint

The connector used for repository automation may not expose push-triggered workflow listings or live browser rendering. In that case, the deployment is not considered independently verified until a reviewer records the live-route checks above.