# BD-00 — Overview & Common Standards

> **Version:** 0.1 · **Date:** YYYY-MM-DD · **Status:** 🟡 Draft

The standards every module BD inherits. Start here for any code question. Module BDs state deltas.

---

## 1. Architecture summary

See `plan/STRATEGY.md` §4. One FastAPI application, one PostgreSQL instance, one Celery worker
tier, one Next.js frontend. **One shared core:** cross-module calls are in-process service → service
calls, not HTTP.

---

## 2. Project layout

```
source code/
├── backend/app/
│   ├── core/          config, db, logging, errors, security, types
│   ├── shared/        cross-module services (audit, outbox, storage, jobs, search)
│   ├── modules/<m>/   router.py schemas.py service.py repository.py models.py events.py permissions.py tests/
│   ├── workers/       celery app, queues, schedules
│   └── main.py        app factory
├── frontend/src/
│   ├── app/(auth)/    unauthenticated routes
│   ├── app/(app)/     authenticated routes, per module
│   ├── features/<m>/  components, hooks, forms, types
│   ├── components/    shared UI
│   └── lib/api/       GENERATED client — never hand-edited
└── infra/             nginx, container configs
```

---

## 3. Namespace allocation

| Module | API prefix | Table prefix | Celery prefix |
|---|---|---|---|
| MOD-01 | `/auth` `/users` `/roles` `/permissions` `/master-data` `/audit` | `auth_` `org_` `sys_` | `auth.` |
| MOD-02 | `/<resource>` | `<pfx>_` | `<module>.` |

A module creates nothing outside its allocation. This is what makes a table's owner readable from
its name.

---

## 4. Layering

```
router      HTTP only: parse, authorize, serialize.  NO business logic.
  └── service       Business rules, orchestration, transactions, events.  Framework-agnostic.
       └── repository    Data access.  ALL SQL lives here.
            └── model         ORM entities.
```

---

## 5. Cross-module integration

5.1 **One shared core.** A cross-module call is a function call into the owning module's *published*
service functions, with a documented signature. Never a query against another module's tables.

5.2 A module that other modules read from publishes a small, typed **downstream read service**. That
is the contract; its tables are not.

---

## 6. API standards

| Topic | Standard |
|---|---|
| Versioning | `/api/v1` |
| Updates | `PATCH`, with `If-Match` and 409 on version mismatch |
| Pagination | keyset (`?limit=&cursor=`), default 25, cap 200 |
| Errors | RFC 9457 `application/problem+json` with a stable machine-readable `code` |
| Filtering | explicit typed query parameters; no generic query language |
| Sorting | whitelisted columns only |
| Long operations | `202` + job handle |
| Dates | ISO 8601, UTC |

---

## 7. Frontend standards

7.1 Routes: `app/(auth)/` unauthenticated, `app/(app)/<module>/` authenticated,
`app/share/[token]/` public links.

7.2 Four mandatory states on every list and detail screen: loading skeleton, empty, error with
retry, permission-denied.

7.3 Server Components by default. Server state through TanStack Query, UI state through Zustand,
never mixed.

7.4 Design tokens only. No hard-coded colour, spacing, radius, shadow, font size or duration.

7.5 Every user-facing string in the i18n layer, in **all** catalogues, in the same change.

---

## 8. Screen archetypes

| Archetype | Contents |
|---|---|
| List | filter bar, data table, pagination, row actions, the four states |
| Detail | header with status and actions, tabbed panels, audit trail |
| Form | sections, inline validation, unsaved-changes guard |
| Dashboard | KPI row, charts, drill-through |
| Wizard | stepper, per-step validation, resumable draft |

---

## 9. Database standards

See the module BD template §3. Money `numeric(18,2)` + `currency char(3)`. Effort `numeric(8,2)`.
Timestamps `timestamptz`. JSONB only for genuinely schemaless payloads — never for anything
filtered, sorted, aggregated or reported on.

---

## 10. Test standards

See `source code/.claude/rules/testing.md`. The module BD's §13 states what *this* module needs
beyond the baseline.
