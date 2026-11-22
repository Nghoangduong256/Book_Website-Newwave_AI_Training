## What this changes

One paragraph, in behaviour. A reader should know what is different for a user without reading the
diff.

## Design sections implemented

- `RD-nn §x` — FR-nn-01, FR-nn-02
- `BD-Mnn §y` — SC-nn-03
- Implementation plan: `nn_IMPL_PLAN_Pn.md` S<n>

## How it was verified

Commands, and **what their output said** — not "tests pass".

```
$ make check
<the line that matters>
```

| Check | Result |
|---|---|
| `make check` | |
| `make check-live` (if the change touches db/broker/storage) | |
| `npm run check` (frontend changes) | |
| Measured at 375px (new or changed screens) | |
| Ran the product and looked at it | |

## Definition of done

- [ ] Every new endpoint has a permission dependency and tests
- [ ] Scope filtering is in the query, with a generated-SQL assertion
- [ ] Out-of-scope single fetch returns 404
- [ ] Migrations forward-safe; no applied migration edited; seeds idempotent
- [ ] Screens have all four states, an entry point, and were measured at 375px
- [ ] Background jobs persist a phase the screen renders
- [ ] Audited actions write an entry
- [ ] No hard-coded colour, spacing or string; every catalogue updated
- [ ] Generated API client current
- [ ] Any design deviation has an ADR and a CR

## New dependencies

| Package | Version | Why | What it logs at INFO |
|---|---|---|---|

## Findings recorded

Defects noticed while doing this, which were **not** fixed here: `FINDINGS.md` F-Pn-m.

## Risk

What could break, and what would reveal it first.
