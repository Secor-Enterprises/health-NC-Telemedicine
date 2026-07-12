# CI and GitHub Pages Deployment

## Purpose

This document defines the supported build and deployment path for the Secor HealthConnect demonstration application.

## Active application

The deployable application is the Next.js App Router implementation under:

- `src/app/`
- `src/lib/demo-data.ts`

The repository also contains legacy Vite/React source files under `src/pages`, `src/components` and related folders. These files are retained for reference but are excluded from the active Next.js TypeScript build until they are deliberately migrated.

## Root causes corrected

The failed workflows were caused by three configuration conflicts:

1. `postcss.config.js` referenced Tailwind CSS and Autoprefixer even though those packages were not dependencies of the active Next.js application.
2. `tsconfig.json` included every TypeScript file in the repository, causing Next.js to type-check the legacy Vite application and report missing Radix, React Router, React Query, Zod and other packages.
3. `package-lock.json` belonged to the former Vite/Shadcn application and conflicted with the current minimal Next.js `package.json`.

## Validation pipeline

Every pull request and push to `main` now performs:

1. Node.js 22 setup.
2. Clean dependency installation from exact top-level versions.
3. Type checking of the active Next.js application.
4. Static Next.js build.
5. Verification that `out/index.html` exists.

## Pages deployment

The Pages workflow performs the same validation, then uploads the generated `out/` directory and publishes it through GitHub Pages.

Expected URL:

`https://secor-enterprises.github.io/health-NC-Telemedicine/`

## Repository settings

GitHub Pages must use **GitHub Actions** as its build and deployment source.

## Future improvement

When the legacy clinical screens are migrated into the Next.js App Router, add their required dependencies intentionally and expand the TypeScript include paths one feature at a time. Do not restore a broad `**/*.tsx` include until the migration is complete.
