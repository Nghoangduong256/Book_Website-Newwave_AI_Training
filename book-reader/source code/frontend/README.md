# frontend

Next.js (App Router) + TypeScript. The gate is `npm run check` — typecheck, lint, format and tests
behind **one command and one exit code**. Never hand-chain `tsc | grep …; eslint | grep -c …`: a
pipeline reports the last command's status, so a failing gate looks green.

## What P0 must create here

| # | File | Note |
|---|---|---|
| 1 | `package.json` | with a `check` script that runs everything |
| 2 | `src/app/layout.tsx`, `src/app/(app)/`, `src/app/(auth)/` | the route groups from BD-00 §7.1 |
| 3 | `src/styles/theme.css` | design tokens — **every colour, spacing and size lives here** |
| 4 | `src/components/` | the shared four states: skeleton, empty, error-with-retry, permission-denied |
| 5 | `src/lib/api/` | **generated** from the OpenAPI schema; never hand-edited |
| 6 | `src/i18n/` | one catalogue per language, held to exact key parity by a test |
| 7 | `src/test/render.tsx` | the harness: **real** providers and the **real** catalogue, never stubs |
| 8 | `playwright.config.ts` | including the responsive spec at 375 and 768 |

## Two harness rules that save a bad afternoon

1. **Adding a required provider or prop to a shared component breaks every test that renders it.**
   Update `src/test/render.tsx` in the *same* change, not after the suite goes red.
2. **The harness uses the real string catalogue.** A component rendering a raw key because the key
   does not exist must fail a test — and it cannot if the test invents its own dictionary.
