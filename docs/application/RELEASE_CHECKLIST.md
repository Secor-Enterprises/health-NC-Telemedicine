# Role Portal Release Checklist

## Automated gates

- [ ] Design-system validation passes
- [ ] Figma automation validation passes
- [ ] Role portal domain tests pass
- [ ] TypeScript validation passes
- [ ] Next.js production build succeeds
- [ ] Static export route verification passes

## Demonstration checks

- [ ] Home page loads
- [ ] Patient portal loads
- [ ] Doctor portal loads
- [ ] Nurse portal loads
- [ ] Specialist portal loads
- [ ] Facility administration portal loads
- [ ] Provincial executive portal loads
- [ ] Application administration portal loads
- [ ] Mobile navigation is usable
- [ ] Tablet layout is usable
- [ ] Desktop layout is usable
- [ ] Language selector contains eleven written-language options
- [ ] SASL/interpreter workflow indicator is visible
- [ ] Integration badges identify mocked services
- [ ] Synthetic-data disclosure is visible
- [ ] No secret or real patient information is present

## Evidence

Record:

- Commit SHA
- CI workflow URL
- Deployment workflow URL
- Live deployment URL
- Reviewer
- Date
- Known limitations

## Production boundary

Passing this checklist confirms readiness for a synthetic demonstration only. Production readiness requires separate Azure, identity, clinical, privacy, security, interoperability and operational assurance.