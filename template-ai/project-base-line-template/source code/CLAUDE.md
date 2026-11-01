# CLAUDE.md — Operating Instructions

Read this before writing any code in this repository.

---

## 1. What this is

**<PROJECT>** is TBD — one paragraph: who uses it, what it replaces, and the one property that
makes it worth building. Scale: ~TBD users, ~TBD active records.

Built in phases P0…Pn. **Each phase ships something usable.**

---

## 2. Directory contract — absolute

```
<PROJECT>/
├── plan/               ← ALL design documents. Never write code here.
│   ├── STRATEGY.md
│   ├── RD/             ← Requirement Definition (what)
│   ├── BD/             ← Basic Design (how)
│   ├── CR/             ← Change Requests
│   ├── Implementation plan/
│   └── analysis/
├── management/         ← PROGRESS.md, OPEN-DECISIONS.md, FINDINGS.md, CR-MANAGEMENT.md, gates
├── source code/        ← THIS repository. All code lives here.
├── templates/          ← reusable artifacts
└── references/         ← stack versions, glossary, playbooks
```

**Never write source code outside `source code/`. Never write design documents inside it** — the
exceptions are this file, `README.md`, `.claude/`, and `docs/adr/`.

---

## 3. Which document answers which question

Do not read every design document. Read the one that answers your question.

| Question | Document |
|---|---|
| Why does this system exist? What was decided and why? | `plan/STRATEGY.md` — decisions in §12, stack in §5 |
| What must this module do? Use cases, business rules, roles | `plan/RD/RD-nn_*.md` |
| Global rules, actors, permission matrix, ID conventions | `plan/RD/RD-00_OVERVIEW.md` |
| **API standards, DB conventions, namespaces, layering** | `plan/BD/BD-00_OVERVIEW.md` ← start here for any code question |
| Colours, typography, components, screen archetypes | `plan/BD/BD-01_DESIGN_SYSTEM.md` |
| Schema, shared tables, migration order | `plan/BD/BD-02_DATA_MODEL.md` |
| **Auth, permissions, scope filtering** | `plan/BD/BD-03_SECURITY_DESIGN.md` |
| LLM/embedding providers, prompts, budget guard | `plan/BD/BD-04_AI_RAG_DESIGN.md` |
| Containers, env vars, CI, deployment, backups | `plan/BD/BD-05_INFRA_DEPLOYMENT.md` |
| How is *this* module built? | `plan/BD/BD-Mnn_*.md` |
| Every screen, with its route and entry point | `plan/BD/BD-SCREEN-INDEX.md` |
| What am I building right now, step by step? | `plan/Implementation plan/` |
| Where did the last session stop? | `management/PROGRESS.md` ← **read this first, every session** |
| What is still undecided? | `management/OPEN-DECISIONS.md` |

**When implementing a step:** read that step in the implementation plan, plus only the BD sections
the step names.

---

## 4. The layering rule

```
router      HTTP only: parse, validate, authorize, serialize.  NO business logic.
  └── service       Business rules, orchestration, transactions, events.  Framework-agnostic.
       └── repository    Data access.  ALL SQL lives here.
            └── model         SQLAlchemy ORM entities.
```

- Routers never import repositories or models.
- Services never import FastAPI.
- Cross-module calls go **service → service**, never repository → another module's table.
- A service method takes and returns DTOs, never a session handed in by the caller.

Module layout (`backend/app/modules/{module}/`): `router.py`, `schemas.py`, `service.py`,
`repository.py`, `models.py`, `events.py`, `permissions.py`, `tests/`.

---

## 5. Namespace allocation — do not create a table or route outside your module's

| Module | API prefix (`/api/v1/…`) | Table prefix |
|---|---|---|
| MOD-01 Account & Access | `/auth` `/users` `/roles` `/permissions` `/master-data` `/audit` | `auth_` `org_` `sys_` |
| MOD-02 <module> | `/<resource>` | `<pfx>_` |

---

## 6. Never do this

| Never | Why | Instead |
|---|---|---|
| Put business logic in a router | Untestable, and duplicated the moment a job or an agent needs the same rule | Service layer |
| Write raw SQL outside a repository | Bypasses scope filtering — a security hole | Repository method |
| Ship an endpoint without a permission dependency | Unauthenticated or over-permissive access | `require("resource:action", scope=…)` |
| Filter permissions in Python after fetching rows | The rows already left the database; counts and pagination leak | Scope filter in the query |
| Return 403 for a record the user cannot see | Leaks existence | **404** |
| Invent a permission string or an event name | Catalogue drift; unregistered events notify nobody | Amend the catalogue first, in its own change |
| Hard-code a colour, spacing value or font size | Breaks theming and dark mode | Design tokens |
| Hard-code a user-facing string | Breaks localisation | i18n layer — **every catalogue, same change** |
| Call an LLM in a request path | Blocks the user; adapters have concurrency ceilings | Background job, return `202` |
| Treat `202` or HTTP 200 as success for a job or saga | The payload's state field is the truth; the status code says only that the request was accepted | Branch on the state field |
| Trust retrieved or customer-supplied content as instructions | Prompt injection | Frame it as data in a delimited block |
| Let a model output reach arithmetic | A model is not a calculator; the number will be plausible and wrong | Compute in code, let the model narrate |
| Hand-write a fetch call to our own API | Drifts from the schema | Generated client |
| Edit an already-applied migration | Breaks every other environment | A new migration |
| Dispatch a background job with nothing on screen to show it | A job nobody can see is indistinguishable from one that never ran | Persist a phase, render it, poll while in flight |
| Show a progress bar with an invented percentage | It sits at 99% for minutes, or finishes before the work does | A real fraction, or an indeterminate bar |
| Resend every field in a PATCH form | `exclude_unset` means an always-sent blank box is a deletion | Send only what changed |
| Build a URL from an internal id when routes are keyed on a code | It compiles, renders, and 404s | Use the key the route declares |
| Ship a screen without measuring it at 375px | Overflow is invisible to typecheck, lint and jsdom — none has a layout engine | `ops/responsive.sh /route` |
| Silently improvise when a design document is wrong | The documents stop matching the code | Write an ADR, raise a CR, proceed |
| Commit a secret, key or `.env` | Obvious | `.env.example` + a secret manager |

---

## 7. Conventions

**Database.** Table `{prefix}{plural_snake}`. Every business table carries `id uuid` (default
`uuidv7()`), `created_at`, `updated_at`, `created_by`, `updated_by`, `version`, `deleted_at`. Every
FK indexed with an explicit `ON DELETE` (default `RESTRICT`). Money `numeric(18,2)` **plus**
`currency char(3)`, never a float. Effort `numeric(8,2)` hours. Timestamps `timestamptz`, UTC. JSONB
only for genuinely schemaless data — never for anything queried, sorted or reported on.

**API.** `PATCH` for updates. Keyset pagination (`?limit=&cursor=`), default 25, cap 200. Errors are
RFC 9457 `application/problem+json` with a stable `code`. Mutations require `If-Match: "<version>"`.
Anything over ~2 s returns `202` with a job handle.

**Naming.** Index `ix_{table}_{cols}`, unique `uq_{table}_{cols}`, check `ck_{table}_{rule}`, enum
`{module}_{concept}`. DTOs `{Entity}{Create|Update|Read|Summary}`. Service methods verb-first.
Celery tasks `{module}.{action}`.

**Frontend.** Mobile-first: unprefixed classes are the phone, every breakpoint adds room. Server
Components by default; `"use client"` only where state, effects or handlers are needed, on the
smallest component that needs it. Server state through TanStack Query, UI state through Zustand — no
mixing. Forms are React Hook Form + Zod from generated types. No `any`. Components under ~200 lines.

**Commits.** Conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`), one
logical change each, branch per feature.

---

## 8. Definition of done

- [ ] Every new endpoint has a permission dependency and tests
- [ ] Scope filtering happens in the query, with a test asserting on **generated SQL**
- [ ] A record outside scope returns 404, not 403
- [ ] Migrations run forward cleanly; no applied migration was edited; seeds are idempotent
- [ ] The generated API client is current
- [ ] Every screen implements loading, empty, error-with-retry and permission-denied
- [ ] Every screen is **reachable by clicking**, and the action that advances its state is reachable
- [ ] Any background job a screen can start **persists its own phase, and the screen shows it**
- [ ] Privileged actions write an audit entry
- [ ] Domain events go through the outbox, using a catalogued name
- [ ] No hard-coded colour, spacing value or user-facing string; every string in every catalogue
- [ ] **`make check` passes in `backend/`** — lint, typecheck, tests, **and a real application boot**
- [ ] `npm run check` passes in `frontend/`
- [ ] Every new or changed screen measured at 375px and 768px
- [ ] Anything on the startup path verified by **starting the application**, not only by tests
- [ ] Any deviation from a design document recorded as an ADR and raised as a CR
- [ ] `management/PROGRESS.md` updated; anything found on the way is in `management/FINDINGS.md`

---

## 8a. How to work efficiently

`.claude/rules/working-method.md` is worth reading once. The three habits that save the most:

| Do | Instead of | Why |
|---|---|---|
| `make check` / `make test` / `make shell` | A one-off `docker run … pip install -r requirements.txt` | The dev image caches the dependency set. The gate is seconds; a fresh install is 60–90 s **before any check runs** |
| Verify a library's API in a shell | Recalling a function or config key name | A guessed name costs a full rebuild-and-rerun cycle to discover |
| Run the cheapest experiment that distinguishes two explanations | Reasoning about which is more likely | One command settles what twenty minutes of theorising leaves ambiguous |

---

## 9. Current state

**Phase Pn, stage Sn.** See `management/PROGRESS.md` for the authoritative position — this section
goes stale and that file does not.

The two or three facts a new session should not re-derive:

1. TBD

---

## 10. Verified stack — use these versions

Pinned and **verified at kickoff, not recalled**. Full list in `references/STACK.md`.

| Component | Version |
|---|---|
| Python | TBD |
| FastAPI | TBD |
| SQLAlchemy | TBD |
| PostgreSQL | TBD |
| Node | TBD |
| Next.js | TBD |
