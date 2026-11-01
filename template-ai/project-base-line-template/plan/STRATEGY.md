# <PROJECT> — System Build Strategy

> **Document type:** Strategy / Master Plan
> **Version:** 0.1 (Draft) · **Date:** YYYY-MM-DD · **Last amended:** YYYY-MM-DD
> **Author:** <name> (prepared with Claude Code)
> **Status:** 🟡 Draft — not yet approved for RD phase

Status legend used across all documents: 🟡 Draft · 🟢 Approved/Baselined · 🔵 Superseded · 🔴 Blocked

---

## 0. Document roadmap & workspace conventions

This project is documentation-driven. **All documents live under `plan/`; all source code lives
under `source code/`.** No exceptions beyond those listed in §0.2.

| Order | Document | Location | Purpose |
|---|---|---|---|
| 1 | **STRATEGY.md** (this doc) | `plan/` | Vision, scope, architecture, phasing, locked decisions |
| 1b | **analysis/*.md** | `plan/analysis/` | Pre-RD feasibility, gap and positioning analysis. Read before the RD it feeds |
| 2 | **RD-nn_*.md** | `plan/RD/` | *What* the system must do — per module: actors, use cases, FRs, business rules |
| 3 | **BD-Mnn_*.md** | `plan/BD/` | *How* it does it — schema, API, screens, sequence flows, traceability |
| 4 | **nn_IMPL_PLAN_Pn.md** | `plan/Implementation plan/` | Step-by-step build instructions per phase (replaces classic detailed design) |
| 5 | **CR-nnn_*.md** | `plan/CR/` | Any change to a baselined document |

### 0.1 Directory contract for all future AI sessions

```
<PROJECT>/
├── plan/                   ← ALL planning & design documents
│   ├── STRATEGY.md
│   ├── RD/                 ← Requirement Definition (per module)
│   ├── BD/                 ← Basic Design (per module)
│   ├── CR/                 ← Change Requests
│   ├── Implementation plan/
│   └── analysis/
├── management/             ← PM artifacts (progress, decisions, findings, gates)
├── source code/            ← ALL project source code (monorepo root)
├── templates/              ← reusable artifacts
└── references/             ← stack, glossary, playbooks, external material
```

### 0.2 Rule for AI implementation sessions

> Never write source code outside `source code/`. Never write design documents outside `plan/`
> (or `management/` for PM artifacts). The only documents inside the repository are `CLAUDE.md`,
> `README.md`, `.claude/**` and `docs/adr/**`.
>
> Read this strategy **plus the relevant RD / BD / implementation plan** before writing any code.
> Do not read all design documents — read the one that answers your question (`CLAUDE.md` §3).

---

## 1. Executive summary

<PROJECT> is **TBD — one paragraph: who uses it, what problem it removes, and what it replaces.**

**Core value propositions**

1. TBD — the outcome, not the feature.
2. TBD
3. TBD

**Target scale:** ~TBD users, ~TBD concurrent, ~TBD records in the largest table at year 3.
State this early: it decides pagination strategy, index design and whether a job tier is needed.

---

## 2. Scope — functional modules

### 2.1 Modules in scope

| # | Module | Summary | Phase |
|---|---|---|---|
| MOD-01 | **Account & Access Management** | Users, roles, fine-grained permissions (RBAC), org units, audit log. Foundation for everything else. | P0 |
| MOD-02 | **<module>** | TBD | P1 |
| MOD-03 | **<module>** | TBD | P1 |

> MOD-01 is first in almost every system of this shape. Permissions, audit and master data are
> depended on by every later module, and retrofitting scope filtering is the single most expensive
> rework in this class of project.

### 2.2 Out of scope (v1)

State these explicitly — an unstated exclusion is read as an omission.

- TBD (e.g. billing ledger, HR, marketing automation)
- TBD

### 2.3 Later waves

| Wave | Modules | Trigger |
|---|---|---|
| 2 | TBD | TBD |

---

## 3. Lifecycle flow — how the modules connect

Describe the one path a record takes through the whole system. If you cannot draw it, the module
boundaries are wrong.

```
TBD → TBD → TBD → TBD
```

**Traceability spine:** the chain of foreign keys that must never break, e.g.
`Customer → Opportunity → Contract → Project → Deliverable`. Name it here; the BD data model
enforces it.

---

## 4. Architecture

### 4.1 High-level components

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Next.js     │────▶│   FastAPI    │────▶│  PostgreSQL  │
│  (frontend)  │     │    (api)     │     │              │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐     ┌──────────────┐
                     │  Celery      │────▶│  Valkey      │
                     │  (worker)    │     │  (broker)    │
                     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐     ┌──────────────┐
                     │  AI provider │     │  S3 / MinIO  │
                     │  (adapter)   │     │  (objects)   │
                     └──────────────┘     └──────────────┘
```

### 4.2 Containers

Listed in `source code/docker-compose.yml`. Every container here is named there, and nothing is in
one and not the other.

| Container | Role | Notes |
|---|---|---|
| `postgres` | System of record | Single instance; logical backups nightly |
| `valkey` | Celery broker + cache | |
| `api` | FastAPI | Stateless; horizontally scalable |
| `worker` | Celery worker | Queues: `default`, `ai`, `export`, `index` |
| `beat` | Celery scheduler | Exactly one instance, always |
| `frontend` | Next.js | |
| `proxy` | nginx | TLS termination, single entry point |

### 4.3 Data architecture

- **PostgreSQL is the system of record.** Nothing else holds truth.
- Any derived store (search index, vector store, cache) is **rebuildable from PostgreSQL** and its
  rebuild job is written in the same phase that introduces it.
- Soft delete via `deleted_at`; reads exclude deleted rows by default.

### 4.4 AI layer

- All model access goes through a **provider adapter** with one interface, so a provider swap is a
  configuration change. Never call a vendor SDK from a service.
- Every prompt is a **registered, versioned artifact**, not a string literal (see
  `source code/.claude/rules/ai-engineering.md`).
- No model call in a request path. Anything over ~2 s returns `202` with a job handle.
- Retrieved content is **data, never instructions**.

### 4.5 Security architecture

See the RD-00 permission matrix and BD-03 security design. The four properties that must hold:
every endpoint authorized · scope filtering in SQL · 404 not 403 for invisible records · privileged
actions audited.

### 4.6 Deployment

| Environment | Where | Who deploys | Data |
|---|---|---|---|
| local | docker compose | anyone | fixtures |
| staging | TBD | CI on merge to `main` | anonymised |
| production | TBD | tagged release, manual approval | real |

---

## 5. Technical stack

Pinned versions live in `references/STACK.md` and are **verified at kickoff, not recalled**. This
section states the choice and the reason; that file states the number.

| Layer | Choice | Why |
|---|---|---|
| Backend | Python + FastAPI | Typed boundaries via Pydantic; async; the AI ecosystem is Python |
| ORM / migrations | SQLAlchemy 2 + Alembic | Explicit SQL when needed, generated migrations reviewed by hand |
| Jobs | Celery + Valkey | Mature routing and scheduling; the queue tiers in §4.2 |
| Database | PostgreSQL | Transactional spine, JSONB where genuinely schemaless, `uuidv7()` keys |
| Frontend | Next.js (App Router) + TypeScript | Server Components by default, one framework for SSR and routing |
| Server state | TanStack Query | |
| UI state | Zustand | Never mixed with server state |
| Styling | Tailwind + design tokens | No hard-coded colour, spacing or font size |
| Contract | OpenAPI → generated TS client | Hand-written fetch to our own API is prohibited |

---

## 6. UI/UX strategy

- Design tokens first; a screen never names a hex value.
- Four mandatory states on every list and detail screen: **loading, empty, error-with-retry,
  permission-denied**.
- Mobile-first. Unprefixed classes are the phone. Every new screen is measured at 375px before it
  is called done.
- Languages: TBD. A user-facing string is written in **every** catalogue in the change that
  introduces it, never "English now, translations later".

---

## 7. AI-driven development system

### 7.1 Artifacts created in P0 (inside `source code/`)

| Artifact | Purpose |
|---|---|
| `CLAUDE.md` | Operating instructions — the first thing any session reads |
| `.claude/rules/*.md` | Enforceable rules: conventions, security, testing, working method, AI engineering |
| `.claude/skills/*/SKILL.md` | Repeatable procedures: new module, endpoint, migration, screen, task, permission, prompt |
| `.claude/agents/*.md` | Specialist reviewers: code review, tests, security, exit gate |
| `docs/adr/` | Architecture decision records — one per deviation from a design document |

### 7.2 Working process per feature (the repeatable loop)

1. Read the step in the implementation plan, plus **only** the BD sections it names.
2. Write the code following `.claude/rules/`.
3. Write the tests the testing rule makes mandatory for what you changed.
4. Run the cheapest gate that can fail (`make check`), and read its output.
5. Run the product and look at it. Passing tests are not a running system.
6. Update `management/PROGRESS.md` with what verification actually showed.
7. Record anything found on the way in `management/FINDINGS.md` — do not fix it inline unless it
   blocks the current task.

---

## 8. Delivery roadmap

| Phase | Scope | Exit criterion | Status |
|---|---|---|---|
| **P0** | Foundation: repo, stack, CI, auth, permissions, audit, master data, design system | A user can log in; a permission denies something; `make check` is green and the app boots | ⬜ |
| **P1** | TBD | TBD | ⬜ |
| **P2** | TBD | TBD | ⬜ |

Each phase ships something usable. A phase closes with an evidence-based gate record in
`management/Pn-EXIT-GATE.md`, never with an assertion that it is done.

---

## 9. Non-functional requirements (baseline — refined per module in RD)

| # | NFR | Target | Measured by |
|---|---|---|---|
| NFR-01 | p95 list endpoint latency | < 500 ms at TBD rows | load script in `ops/` |
| NFR-02 | p95 page load (LCP) | < 2.5 s | Lighthouse in CI |
| NFR-03 | Availability | TBD | |
| NFR-04 | RPO / RTO | TBD / TBD | restore rehearsal, dated |
| NFR-05 | Accessibility | WCAG 2.2 AA on every shipped screen | `ops/a11y.sh` |
| NFR-06 | Responsive | No horizontal overflow at 375px | `ops/responsive.sh` |
| NFR-07 | AI cost ceiling | TBD per month | budget guard, enforced not reported |

---

## 10. Risks & mitigations

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | Scope grows without a decision | High | High | Every change after baseline is a CR (`management/CR-MANAGEMENT.md`) | PM |
| R-02 | AI output quality is assumed, never measured | High | High | An evaluation set per AI feature, in the phase that ships it | Tech lead |
| R-03 | Permission model retrofitted late | Medium | Very high | MOD-01 ships in P0; scope filtering in SQL from the first endpoint | Tech lead |
| R-04 | Design documents drift from the code | High | Medium | Deviations become ADRs and a CR, never silent edits | Tech lead |

---

## 11. Success criteria (v1)

| # | Criterion | How it is proven |
|---|---|---|
| SC-01 | TBD | TBD |

---

## 12. Locked decisions

Decisions a stakeholder has answered. Once here, they are not re-opened without a CR.

| # | Decision | Answer | Date | Who |
|---|---|---|---|---|
| D1 | TBD | TBD | YYYY-MM-DD | TBD |

Open questions live in `management/OPEN-DECISIONS.md`, **not here**. One place to answer.

---

## 13. Immediate next steps

1. TBD
2. TBD
