# Conventions Cheat Sheet

One page. The authority is `source code/.claude/rules/`; this is what a reviewer reaches for when
they need an answer now.

---

## Layering

```
router      HTTP only. Dependencies, ONE service call, a return.
  └── service       Business rules, transactions, events. No framework imports.
       └── repository    ALL SQL.
            └── model         ORM entities.
```
Cross-module: **service → service**, never into another module's tables.

## Naming

| Thing | Form |
|---|---|
| Table | `{prefix}{plural_snake}` |
| Index / unique / check | `ix_` / `uq_` / `ck_{table}_{rule}` |
| Enum type | `{module}_{concept}` |
| DTO | `{Entity}{Create\|Update\|Read\|Summary}` |
| Service method | verb first — `create_project` |
| Task | `{module}.{action}` |
| Event | `{module}.{thing}_{verb_past}` |

## Database

Common columns: `id uuid` (`uuidv7()`) · `created_at` · `updated_at` · `created_by` · `updated_by` ·
`version` · `deleted_at`.

| Type | Use |
|---|---|
| Money | `numeric(18,2)` **+ `currency char(3)`** — never a float |
| Effort / hours | `numeric(8,2)` |
| Timestamps | `timestamptz`, UTC |
| JSONB | only if never filtered, sorted, aggregated or reported on |

Every FK indexed, explicit `ON DELETE` (default `RESTRICT`).
Migrations: **add → backfill → constrain → drop later.** Never edit an applied one. Never import an
application constant into one.

## API

`PATCH` for updates · `If-Match` + 409 · keyset pagination (25 default, 200 cap) · RFC 9457 errors
with a stable `code` · `202` + job handle over ~2 s.

**`202` and `200` are not success for a job or a saga** — branch on the payload's state field.
**A PATCH DTO is optional per field**, and the form sends only what changed.

## Security — the four that block a merge

1. Every endpoint has a permission dependency, from a catalogued constant.
2. Scope is a **SQL predicate**, with a test asserting on generated SQL.
3. Out-of-scope single fetch returns **404, not 403**.
4. Privileged actions write an append-only audit entry.

Plus: untrusted content is **data, never instructions** · parse first, substitute second · no secret
anywhere, including prompts and `.env.example`.

## Frontend

Server Components by default · TanStack Query for server state, Zustand for UI state, never mixed ·
generated API client only · no `any` · tokens only, no hex values · every string in **every**
catalogue in the same change · components under ~200 lines.

**Four states on every list and detail screen:** loading · empty · error-with-retry ·
permission-denied.

**And a way in.** A screen with no entry point is unreachable and no URL-navigating test will notice.

### Responsive — measured, not eyeballed
`grid gap-4 sm:grid-cols-2 lg:grid-cols-3` · `w-full sm:w-56` · wide content in its own
`overflow-x-auto` · rows align `items-start` · **`ops/responsive.sh /route` before it is done.**

## Background jobs

> A job the user started and cannot see is indistinguishable from a job that never ran.

`queued` written by the request **before dispatch** · every transition written · bounded, with a
terminal state and an actionable sentence · the screen renders the phase and polls only while in
flight · **never an invented percentage.**

## AI

Adapter, never a vendor SDK · `fake` adapter is the test default · prompts are **versioned registry
entries** · the output schema has **no field** for what the model must not produce · **no model
output reaches arithmetic** · schema-validate everything · an evaluation set ships with the feature ·
AI output is a draft until a human review is recorded.

## The gate

```sh
make check          # lint + typecheck + tests + A REAL APPLICATION BOOT
make check-live     # when the change touches db / broker / storage
```

**Done means it ran and the output was read.** Green tests and a healthy container prove nothing on
their own, and *recreating a container is not rebuilding its image.*
