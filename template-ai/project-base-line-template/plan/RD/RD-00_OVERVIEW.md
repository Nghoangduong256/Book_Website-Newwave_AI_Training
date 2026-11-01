# RD-00 — Overview & Common Specification

> **Version:** 0.1 · **Date:** YYYY-MM-DD · **Status:** 🟡 Draft

The rules every module's RD inherits. A module RD states its **deltas** from this document, never a
restatement of it.

---

## 1. Business objectives

| ID | Objective | Measured by |
|---|---|---|
| BO-1 | TBD | TBD |

Every functional requirement in every module should trace to one of these. A requirement that
traces to none is a feature nobody asked for.

---

## 2. Scope summary

See `plan/STRATEGY.md` §2. This document does not restate scope; it states the common rules.

---

## 3. Actors

| Actor | Description | Has login |
|---|---|---|
| Admin | System administration, master data, permissions | Yes |
| <role> | TBD | Yes |
| Customer contact | Named on records; receives documents | **No** (v1) |

### 3.1 Scopes

| Scope | Meaning |
|---|---|
| `own` | Rows where the user is owner or creator |
| `team` | Rows owned by the user's department — **single level, not the subtree** |
| `assigned` | Rows the user is explicitly assigned to |
| `all` | Every row |

A scope is a **SQL predicate**, never a filter applied in Python after fetching.

---

## 4. Common rules

### 4.1 Permission model

Permission strings are `resource:action`. The master catalogue is §7.5 of this document and is the
only place a permission is born. A string invented at the point of use is a defect.

### 4.2 Default permission matrix

| Module | Admin | <role> | <role> |
|---|---|---|---|
| MOD-01 | F | R | — |

Legend: `F` full · `W` write · `R` read · `A` approve · `@own`/`@team`/`@assigned` narrows scope.

### 4.3 Security requirements

| ID | Requirement |
|---|---|
| SEC-01 | Every endpoint declares a permission dependency |
| SEC-02 | Scope filtering is applied in the query |
| SEC-03 | The UI is never the authority; the server re-checks |
| SEC-04 | Knowledge retrieval is permission-filtered, including what an AI answer may cite |
| SEC-05 | Machine/agent access runs as a real user, with scopes that narrow and never widen |
| SEC-06 | Privileged actions are audited, append-only |

### 4.4 Global business rules

| ID | Rule |
|---|---|
| GBR-01 | Money is stored with its currency; a converted value carries its rate snapshot |
| GBR-02 | Timestamps are UTC; display is in the viewer's timezone |
| GBR-03 | Deletion is soft by default; hard deletion is a permissioned, audited action |
| GBR-04 | Modules never send email directly — they emit an event the notification module consumes |

---

## 5. ID conventions

| Artifact | Form | Example |
|---|---|---|
| Module | `MOD-nn` | MOD-02 |
| Functional requirement | `FR-nn-mm` | FR-02-07 |
| Business rule | `BR-nn-mm` | BR-02-14 |
| Use case | `UC-nn-mm` | UC-02-01 |
| Screen | `SC-nn-mm` | SC-02-03 |
| Report | `RPT-nn-mm` | RPT-02-01 |
| Non-functional | `NFR-nn-mm` | NFR-02-02 |
| Decision | `Dn` (strategy) / `#n` (open) | D7 / #12 |
| Finding | `F-Pn-m` | F-P3-14 |
| Change request | `CR-nnn` | CR-004 |
| ADR | `ADR-nnnn` | ADR-0012 |

---

## 6. Lifecycle flow

See `plan/STRATEGY.md` §3.

---

## 7. Master data & catalogues

### 7.1 Master data types

| Type | Owner | Editable by |
|---|---|---|

### 7.5 Permission catalogue

The single source of truth for permission strings. A module may not use a string absent here.

| Resource | Actions | Added by |
|---|---|---|
| `user` | `read` `create` `update` `delete` `admin` | P0 |

---

## 8. Non-functional baseline

See `plan/STRATEGY.md` §9. Module RDs state deltas only.
