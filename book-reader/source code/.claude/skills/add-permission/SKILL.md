---
name: add-permission
description: Add a permission to the master catalogue correctly — naming law, catalogue amendment, seed migration, role grants, and the module code that uses it. Use before writing any endpoint whose permission does not yet exist.
---

# Adding a permission

A permission string invented at the point of use is a defect, not a shortcut. The catalogue is what
makes the authorization surface reviewable as one table; a string that exists only in a router is
invisible to every audit.

**This is its own change.** It lands *before* the endpoint that needs it.

## 1 · Naming law

`resource:action`, both singular, both from the closed vocabularies.

- **Resource** is singular: `customer`, not `customers`. A plural resource is the most common drift,
  and it is invisible until two modules spell the same resource differently.
- **Action** comes from the existing verb set. Read the catalogue and use one that is already there.
  Adding a verb widens the vocabulary for the whole system and is a decision, not a convenience —
  if the constraint enumerates actions, widening it is a migration of its own.
- Prefer `admin` over `configure`/`manage` variants if the catalogue already uses it. One vocabulary.

## 2 · Amend the catalogue

Add the row to `plan/RD/RD-00_OVERVIEW.md` §7.5: the resource, the action, what it permits, and the
phase that introduced it.

## 3 · Seed migration

An idempotent data migration that inserts the permission. If the action is new to the constraint, the
same migration **widens the constraint before it seeds** — in that order.

## 4 · Default role grants

Decide which roles get it, and grant them in the same migration. An un-granted permission is a screen
nobody can open and a feature nobody can find.

**Admin-only permissions need no grant row** if admin is full by design — but say so, so the absence
reads as deliberate.

## 5 · Module constant

```python
# backend/app/modules/{module}/permissions.py
RESOURCE_ACTION = "resource:action"
```
Routers reference the constant. A literal in a router is a finding.

## 6 · Tests

- The seed runs twice without duplicating.
- A role without the permission gets 403; with it, 200.
- The scope behaves: `own` / `team` / `assigned` / `all` each have a case.

## Checklist

- [ ] Resource singular, action from the existing vocabulary
- [ ] Catalogue row added with its phase
- [ ] Idempotent seed migration; constraint widened first if the action is new
- [ ] Default role grants in the same migration
- [ ] Constant declared in the module's `permissions.py`
- [ ] Tests: idempotent seed, 403 without, 200 with, one case per scope
- [ ] **This landed before the endpoint that uses it**
