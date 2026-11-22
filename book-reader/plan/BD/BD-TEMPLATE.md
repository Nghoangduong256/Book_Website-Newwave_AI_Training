# BD-Mnn — <Module Name>

> **Module ID:** MOD-nn · **RD source:** `../RD/RD-nn_<module>.md` · **Phase:** Pn
> **Version:** 0.1 · **Date:** YYYY-MM-DD
> **Depends on:** BD-00 (Overview & Common Standards), BD-02 (Data Model), BD-01 (Design System),
> BD-03 (Security Design — referenced, not restated)
> **API prefixes:** `/<resource>` · **Table prefix:** `<pfx>_`
> **Status:** 🟡 Draft for review

**What this document is.** *How* the module is built: schema, endpoints, screens, flows, and the
traceability that proves every requirement has somewhere to live. It never re-argues scope — that
was settled in the RD.

---

## 1. Scope & design summary

One paragraph on what this module owns, then the decisions a reader needs before any section makes
sense.

**Key design decisions**

| # | Decision | Why | Where |
|---|---|---|---|
| D1 | TBD | the alternative and why it loses | §n |

**Deviations from BD-00 / BD-02:** none / list them. A deviation that is not listed here will be
found by a reviewer and will cost more then than now.

---

## 2. Domain model

### 2.1 Entities

| Entity | Summary | Business code |
|---|---|---|
| <Entity> | TBD | `XXX-{seq5}` |

### 2.2 Relationships

| From | To | Cardinality | `ON DELETE` |
|---|---|---|---|

### 2.3 Enumerations

| Enum | Values | Notes |
|---|---|---|

> Adding a value to a PostgreSQL enum is **two edits**: `ALTER TYPE … ADD VALUE` *and* the Python
> class. Doing only the first raises `LookupError` at runtime, not at migration time.

### 2.4 State machines

States, legal transitions, the guard on each, and who may make it. Enumerate the transitions in a
table so a new edge fails a test rather than a review.

---

## 3. Database schema

### 3.1 Tables

Every business table carries the common columns (BD-00): `id uuid` default `uuidv7()`,
`created_at`, `updated_at`, `created_by`, `updated_by`, `version`, `deleted_at`. Append-only tables
may omit the mutation columns **and must say so in a comment**.

```sql
CREATE TABLE <pfx>_<plural> (
    id           uuid PRIMARY KEY DEFAULT uuidv7(),
    -- domain columns
    name         text NOT NULL,
    amount       numeric(18,2),
    currency     char(3),
    status       <pfx>_<concept> NOT NULL DEFAULT 'draft',
    -- common
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid NOT NULL REFERENCES auth_users(id) ON DELETE RESTRICT,
    updated_by   uuid          REFERENCES auth_users(id) ON DELETE RESTRICT,
    version      integer     NOT NULL DEFAULT 1,
    deleted_at   timestamptz,
    CONSTRAINT ck_<pfx>_<plural>_amount_has_currency
        CHECK ((amount IS NULL) = (currency IS NULL))
);
```

### 3.2 Indexes — and the query each one serves

| Index | Columns | Serves |
|---|---|---|
| `ix_<pfx>_<plural>_<col>` | TBD | the list screen's default sort |

An index with no named query is an index nobody can safely drop later.

### 3.3 Constraints

| Constraint | Rule it enforces | RD rule |
|---|---|---|
| `ck_…` | TBD | BR-nn-mm |

**A business rule enforced by a database constraint cannot be bypassed by a new code path.** Prefer
it wherever the rule is expressible.

### 3.4 Seed / reference data

Idempotent. Running the seed twice produces no duplicates, and there is a test proving it.

### 3.5 Migration notes

Add → backfill → constrain → drop in a later release. No blocking rewrite of a table expected to
grow.

---

## 4. API design

### 4.1 `/<resource>`

| Method | Path | Permission | Request | Response | Notes |
|---|---|---|---|---|---|
| GET | `/<resource>` | `<res>:read` | query params | `Page[<Entity>Summary]` | keyset pagination |
| POST | `/<resource>` | `<res>:create` | `<Entity>Create` | `<Entity>Read` 201 | |
| GET | `/<resource>/{id}` | `<res>:read` | — | `<Entity>Read` | **404** when out of scope |
| PATCH | `/<resource>/{id}` | `<res>:update` | `<Entity>Update` | `<Entity>Read` | `If-Match` required, 409 on mismatch |

**A PATCH DTO's fields are all optional and the service applies only what was set.** A form that
always sends every field turns an untouched blank box into a deletion.

### 4.n Long-running operations

Anything over ~2 s returns `202` with a job handle, and the job persists its own phase so a screen
can show it. `202` is not success — the caller branches on the payload's state field.

---

## 5. Screen design

| ID | Screen | Route | Archetype | Permission | Entry point |
|---|---|---|---|---|---|
| SC-nn-01 | TBD | `/<module>` | list | `<res>:read` | main nav → <module> |

For each screen: layout, the components used, the four mandatory states, what each permission
hides, and **the action that advances the state machine** — a reachable screen with no reachable
action is still a dead end.

---

## 6. Sequence flows

Draw only the flows that cross a boundary — a transaction spanning two modules, a saga, an
optimistic UI with server validation, a job chain. A CRUD call needs no diagram.

```
Actor        UI            API           Service        DB
  │ action   │              │              │            │
  ├─────────▶│   POST       │              │            │
  │          ├─────────────▶│  validate    │            │
  │          │              ├─────────────▶│  tx begin  │
```

State explicitly whether a flow is **one transaction** or a saga with compensations. It changes
every failure path.

---

## 7. Business rule implementation

| Rule | Implemented in | Mechanism |
|---|---|---|
| BR-nn-01 | `service.py::method` | guard before transition |
| BR-nn-02 | database | `ck_…` constraint |

---

## 8. Events published & consumed

| Event | When | Payload | Transactional? |
|---|---|---|---|
| `<module>.<thing>_<verb>` | TBD | TBD | published through the outbox, inside the transaction |

---

## 9. Background jobs

| Task | Queue | Trigger | Idempotent? | On failure |
|---|---|---|---|---|
| `<module>.<action>` | `default` | TBD | yes — running twice is a no-op | retries transient, records permanent |

---

## 10. AI integration

| Prompt | Purpose | Tier | Input | Output schema | Failure |
|---|---|---|---|---|---|
| `<module>_<purpose>` | TBD | cheap/primary | TBD | TBD | TBD |

Untrusted input is delimited and framed as data. Output is schema-validated before use. No model
output reaches arithmetic.

---

## 11. Performance & scale notes

The query that will be slowest, the row count at which it becomes slow, and the index or cache that
answers it.

---

## 12. Security notes

Deltas from BD-03 only. Name every endpoint that is deliberately unauthenticated and why.

---

## 13. Test plan

| Area | What is tested | Where |
|---|---|---|
| Endpoints | happy path, validation, 403, out-of-scope 404, 409 on version mismatch | integration |
| Scope | the predicate appears in the **generated SQL** | integration |
| State machine | one test per legal transition, one per illegal | unit |
| Business rules | one test per `BR-nn-mm`, named after it | unit |
| Calculations | worked values from this document, plus boundaries | unit |
| Screens | four states, light and dark, permission-conditional actions | component |
| Journey | one Playwright test end to end | e2e |

---

## 14. Traceability

**Fill this as you write, not at the end.** A table completed afterwards rationalises what was
built instead of proving what was required.

### 14.1 Functional requirements → BD section

| FR | BD section |
|---|---|
| FR-nn-01 | §4.1 |

### 14.2 Business rules → BD section

| BR | BD section |
|---|---|

### 14.3 Use cases → primary BD section

| UC | BD section |
|---|---|

### 14.4 Screens → §5

| SC | §5 entry |
|---|---|

---

## 15. Open items

| # | Item | Blocks | Owner |
|---|---|---|---|
| 1 | TBD | TBD | TBD |
