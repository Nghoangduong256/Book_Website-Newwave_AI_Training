---
name: new-module
description: Scaffold a complete business module at the start of a phase — package structure, namespace registration, models, permissions, events, router mounting, frontend feature folder, and tests. Use once per module, not per endpoint.
---

# Scaffolding a module

Use this at the start of a phase, when a module has no code yet. To add to an existing module, use
`new-api-endpoint` or `new-frontend-page`.

## Before you write anything

1. **Read the module's RD** — §1 scope, §2 actors and permissions, §5 functional requirements,
   §6 business rules.
2. **Read the module's BD** — §2 domain model, §3 schema, §4 API, §5 screens, §7 rule implementation,
   §8 events.
3. **Read the module's row in `CLAUDE.md` §5** for its API prefix and table prefix. These are fixed.
4. **Check `plan/BD/BD-INDEX.md` §8–§9 and `management/OPEN-DECISIONS.md`** for issues and decisions
   affecting this module. Some carry answers you need before starting.

## Steps

### 1 · Backend package
```
backend/app/modules/{module}/
├── __init__.py
├── router.py          # endpoints, mounted under the module's prefix
├── schemas.py         # DTOs
├── service.py         # business logic
├── repository.py      # data access
├── models.py          # ORM entities
├── events.py          # domain events published
├── permissions.py     # permission string constants
└── tests/
```

### 2 · Permissions
Declare every permission as a constant in `permissions.py`, copied from the catalogue. If the module
needs one that is not catalogued, **add it to the catalogue first, in its own change** — use the
`add-permission` skill. Inventing permission strings is how a catalogue drifts.

### 3 · Models and migration
Define the entities from the BD §2–§3, then use `new-db-migration`. All tables use the module's
prefix.

### 4 · Events
Declare domain events in `events.py`, using names from the canonical catalogue. Do not invent one —
an unregistered event notifies nobody and fails silently. Publish through the outbox, inside the
business transaction.

### 5 · Service boundaries
If other modules will read this module's data, publish an explicit **downstream read service**: a
small set of typed functions with documented signatures. That is the contract; your tables are not.
When *you* consume another module, call its published functions and match the signature exactly.

### 6 · Router mounting
Mount under the allocated prefix in the app factory. Every route gets a permission dependency.

### 7 · Frontend feature folder
```
frontend/src/features/{module}/     # components, hooks, forms, types
frontend/src/app/(app)/{module}/    # routes
```
**Add the module's navigation entries to the app shell, permission-filtered.** A module whose screens
have no menu entry is a module nobody can reach — and no test that navigates by URL will notice.

### 8 · Tests
Fixtures as factory functions. Then, per `.claude/rules/testing.md`: an endpoint suite, a scope-SQL
assertion for every scoped list, a state-machine suite, and a test per `BR-nn-mm`.

### 9 · Traceability
Work through the BD §14 table. Every `FR-nn-mm` maps to code by phase end. Anything unmapped is
either missed work or a deliberate deferral with a note.

## Checklist

- [ ] Package structure complete, no extra files
- [ ] Every permission constant traced to the catalogue
- [ ] All tables use the module's prefix; FKs indexed with explicit `ON DELETE`
- [ ] Event names from the catalogue; published through the outbox
- [ ] Downstream read service published if other modules need this data
- [ ] Router mounted under the allocated prefix; every route authorized
- [ ] Frontend feature folder **and permission-filtered navigation entries**
- [ ] Fixtures are factories; tests per `.claude/rules/testing.md`
- [ ] BD §14 traceability reviewed
- [ ] `management/PROGRESS.md` updated

## Common mistakes

| Mistake | Consequence |
|---|---|
| Querying another module's tables directly | Couples the modules; scope filtering silently bypassed |
| Inventing a permission or event name | Catalogue drift; events that notify nobody |
| Calling a consumed service with a guessed signature | Integration breaks late, in the phase that can least afford it |
| Skipping the navigation entries | Twelve screens nobody can reach, and no failing test |
| Leaving traceability until the end | Missed requirements surface at UAT |
