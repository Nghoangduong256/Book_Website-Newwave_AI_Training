# RD-nn — <Module Name>

> **Module ID:** MOD-nn · **Phase:** Pn · **Version:** 0.1 · **Date:** YYYY-MM-DD
> **Depends on:** RD-00 (Overview & Common Specification); MOD-01 (Account & Access) for users,
> roles and shared master data
> **Status:** 🟡 Draft for review

**What this document is.** It states *what* the module must do, in terms a stakeholder can confirm
and a tester can check. It contains **no implementation detail** — no table names, no endpoints, no
component names. Those belong in the BD.

---

## 1. Purpose & scope

### 1.1 Purpose

One paragraph: what this module is the system of record for, which business outcome it serves, and
what goes wrong today without it.

### 1.2 In scope

- TBD
- TBD

### 1.3 Out of scope (v1)

Each line names where the capability lives instead, or says it is out of the system entirely.

- TBD (owned by MOD-nn)
- TBD (out of system scope per STRATEGY §2.2)

### 1.4 Dependencies on other modules

| Module | Nature of dependency |
|---|---|
| MOD-01 | Users, roles, permissions, shared master data |
| MOD-nn | TBD |

> **Phasing note.** Name any dependency that ships in a later phase and state what this module does
> until then — an empty state, not an error. A dependency that is not yet built and not named here
> becomes a runtime failure in the demo.

---

## 2. Actors & permissions

Actors are defined in RD-00 §3; the default permission matrix is RD-00 §4.2.

| Actor | Access | Notes |
|---|---|---|
| Admin | Full | |
| <role> | Write within own scope | |
| <role> | Read | |

Module-specific notes: scopes used (`own` / `team` / `assigned` / `all`), and any approval authority.

---

## 3. Key concepts / domain glossary

| Term | Definition |
|---|---|
| <Term> | One sentence. If two people in the project would define it differently, it belongs here. |

---

## 4. Use cases

| ID | Use case | Primary actor | Trigger | Outcome |
|---|---|---|---|---|
| UC-nn-01 | TBD | TBD | TBD | TBD |

Expand only the non-obvious ones with a main flow and its alternates.

### UC-nn-01 · <name>

**Pre-conditions:** TBD
**Main flow:** 1. … 2. … 3. …
**Alternate flows:** A1 … · A2 …
**Post-conditions:** TBD

---

## 5. Functional requirements

Every row gets an id. The id appears in the BD's §14 traceability table and in a test name.

| ID | Requirement | Priority | Use case |
|---|---|---|---|
| FR-nn-01 | The system MUST … | Must | UC-nn-01 |
| FR-nn-02 | The system SHOULD … | Should | UC-nn-02 |

Use RFC 2119 words deliberately: MUST is testable and non-negotiable; SHOULD can be deferred with a
recorded decision; MAY is an option, not a plan.

---

## 6. Business rules

A business rule is a constraint that stays true regardless of which screen or API touched the data.
Each gets an id and, later, **a test named after it that would fail if the rule were deleted.**

| ID | Rule | Enforced where | Failure behaviour |
|---|---|---|---|
| BR-nn-01 | TBD | service / database constraint | the error the user sees |

> A rule enforced only in the UI is not enforced. State the server-side point of enforcement.

---

## 7. Data requirements

### 7.1 Entities & key attributes

| Entity | Purpose | Key attributes | Retention |
|---|---|---|---|
| <Entity> | TBD | TBD | TBD |

### 7.2 Relationships

| From | To | Cardinality | On delete |
|---|---|---|---|

### 7.3 State machines

| Entity | States | Legal transitions | Who may make them |
|---|---|---|---|

Draw it if it has more than four states. Every transition needs an actor and a guard.

### 7.4 Master data used

| Type | Owner | Used for |
|---|---|---|

---

## 8. Screens

| ID | Screen | Route | Primary actor | Purpose |
|---|---|---|---|---|
| SC-nn-01 | TBD | `/…` | TBD | TBD |

> **Every screen needs a way in.** State which menu entry, list row or button reaches it. A screen
> with no entry point is a screen nobody will ever open, and the gap is invisible to every test
> that navigates by URL.

---

## 9. Reports & exports

| ID | Report | Audience | Format | Contents |
|---|---|---|---|---|
| RPT-nn-01 | TBD | TBD | CSV / PDF | TBD |

---

## 10. Integrations & events

### 10.1 Consumed from other modules

| Source | What | When |
|---|---|---|

### 10.2 Published domain events

| Event | Payload | Consumers |
|---|---|---|
| `<module>.<thing>_<verb_past>` | TBD | MOD-nn |

Event names come from the canonical catalogue. Inventing one means nobody is notified.

### 10.3 External integrations

| System | Direction | Protocol | Failure behaviour |
|---|---|---|---|

---

## 11. AI requirements

State explicitly, even when the answer is "none" — a later reader needs to know it was decided
rather than forgotten.

| # | Requirement | Note |
|---|---|---|
| AI-nn-01 | What the model is asked to do | The input, the output schema, and what happens when it fails |
| AI-nn-02 | What the model is **never** asked to do | e.g. arithmetic, authorization, deciding a state transition |

- Human review before any AI output reaches a customer: **required / not applicable**.
- Data leaving the installation: **what, to whom, and the decision that permitted it**.
- Quality measurement: the evaluation set, its size, and the metric that gates a release.

---

## 12. Non-functional requirements (deltas from RD-00 §8)

| ID | NFR | Target |
|---|---|---|
| NFR-nn-01 | TBD | TBD |

---

## 13. Acceptance criteria

The list a gate walks. Each one is a sentence someone can run and get a yes or no from.

| # | Criterion | Verified by |
|---|---|---|
| 1 | TBD | test / manual check / report |

---

## 14. Open items

| # | Item | Blocks | Owner |
|---|---|---|---|
| OI-nn-1 | TBD | TBD | TBD |

Anything a stakeholder must answer is **also** a row in `management/OPEN-DECISIONS.md`, with a
recommendation attached.
