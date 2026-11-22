---
name: new-frontend-page
description: Build a screen from its BD §5 specification — route, layout, the four mandatory states, permission behaviour, i18n, responsive measurement and tests. Use when implementing any SC-nn-mm screen.
---

# Building a screen

## Before you write

1. The BD §5 entry for this screen: archetype, layout, components, permission behaviour.
2. The screen's row in `plan/BD/BD-SCREEN-INDEX.md` — **including its entry point.**
3. The endpoints it calls, and whether any of them starts a background job.

## Steps

### 1 · Route
`app/(app)/{module}/…` for authenticated, `app/(auth)/` for unauthenticated, `app/share/[token]/`
for public links.

**Build the route from the key the route declares.** If routes are keyed on a human-readable code and
your hook carries a uuid, the link compiles, typechecks, renders — and 404s on click. Typecheck
cannot catch it; both are strings.

### 2 · Server or client
Server Component by default. `"use client"` only where state, effects or handlers are needed, on the
smallest component that needs it.

**Anything a Server Component calls lives in a module with no `"use client"` directive.** Importing a
plain function from a client module gets you a proxy: the call does not throw, it simply does not
run. Nothing fails at build time, in typecheck, or in lint.

### 3 · The four states
Loading skeleton · empty · error with retry · permission-denied. Use the shared components; a
hand-rolled empty state is a second empty state to maintain.

### 4 · Permissions
Hide what the user cannot do — **and know that hiding it is a usability measure, not enforcement.**
The server rejects it regardless.

### 5 · Background jobs
If an action on this screen starts a job, the screen reads and renders the job's **persisted phase**,
polls while in flight, and stops by itself. A pending-mutation flag covers the milliseconds of the
`202` and then goes false while the work runs for minutes.

### 6 · Tokens and strings
No hard-coded colour, spacing, radius, shadow, font size or duration. No hard-coded user-facing
string — **and every new key goes into every catalogue in this change.** A key in one catalogue and
not another renders an English sentence to a Vietnamese reader, or renders its own key path to
everyone.

If you add a *table* of keys resolved dynamically, add it to the key-coverage test: a scanner that
reads literal `t("…")` calls cannot see them.

### 7 · Responsive — measure it
```sh
ops/responsive.sh /your/route
```
- Grids start at one column: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- No fixed width on a control in a flex row: `w-full sm:w-56`.
- Wide content — tables, charts, code — in its own `overflow-x-auto` wrapper.
- Rows of fields align with `items-start`, not `items-end`.

**This is not optional and no other gate can catch it:** typecheck, lint and jsdom have no layout
engine, and an `overflow-hidden` frame clips rather than scrolls, so nothing looks broken until
somebody holds a phone.

### 8 · The way in
**Add the navigation entry, list link or button that reaches this screen**, permission-filtered. A
screen with no entry point is unreachable, and every test that navigates by URL will pass anyway.

### 9 · Tests
Renders in light and dark · all four states · permission-conditional actions appear and disappear ·
reachable by clicking · an end-to-end test for the journey it belongs to.

## Checklist

- [ ] Route under the right group, built from the key the route declares
- [ ] Server Component unless it genuinely needs to be client
- [ ] All four states, using shared components
- [ ] Permission-conditional actions, with the server still enforcing
- [ ] Job phase rendered, if the screen can start one
- [ ] No hard-coded colour, spacing or string; every catalogue updated
- [ ] Measured at 375px and 768px
- [ ] **Entry point added and permission-filtered**
- [ ] Component and e2e tests written
