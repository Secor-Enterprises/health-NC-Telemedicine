# CI and GitHub Pages Deployment

## Purpose

This document defines the supported build and deployment path for the Secor HealthConnect demonstration application.

## Canonical application

The deployable application is the Next.js App Router implementation under:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/demo-data.ts`

The previous Vite application entry points, Vite configuration, duplicate route pages, Tailwind configuration and Shadcn configuration were removed. Reusable component prototypes may remain for deliberate future migration, but they are not application entry points and are excluded from the active build.

## Duplicate files removed

The cleanup removed:

- Root Vite `index.html`
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `src/vite-env.d.ts`
- Legacy `src/index.css`
- Legacy `tailwind.config.ts`
- Legacy `components.json`
- Duplicate React Router route pages under `src/pages/`
- Temporary custom Next.js filenames `page.page.tsx` and `layout.page.tsx`

The Next.js application now uses the standard `page.tsx` and `layout.tsx` filenames.

## Root causes corrected

The failed workflows were caused by three configuration conflicts:

1. A PostCSS configuration referenced Tailwind CSS and Autoprefixer even though those packages were not dependencies of the active Next.js application.
2. TypeScript included the legacy Vite application, causing Next.js to report missing Radix, React Router, React Query, Zod and related packages.
3. The committed lockfile belonged to the former Vite/Shadcn application and conflicted with the current minimal Next.js package manifest.

## Validation pipeline

Every pull request and push to `main` performs:

1. Node.js 22 setup.
2. Dependency installation from pinned top-level versions.
3. Type checking of the active Next.js application.
4. Static Next.js build.
5. Verification that `out/index.html` exists.
6. Verification that `out/_next` exists for Pages deployment.

## Pages deployment

The Pages workflow performs the same validation, uploads the generated `out/` directory and publishes it through GitHub Pages.

Expected URL:

`https://secor-enterprises.github.io/health-NC-Telemedicine/`

## Repository settings

GitHub Pages must use **GitHub Actions** as its build and deployment source.

## Azure progression

GitHub Pages hosts the static demonstration only. The Azure target architecture adds server-side services, Microsoft Entra ID, Azure SQL Database, Key Vault, monitoring and governed integrations. Those production-oriented services must not be represented as operational until the corresponding Azure environments and credentials are configured.

## Future development rule

Add new clinical screens directly to the Next.js App Router. Reuse retained component prototypes selectively, migrate their dependencies intentionally and delete superseded source files in the same pull request. Do not introduce a second application entry point or parallel router.
