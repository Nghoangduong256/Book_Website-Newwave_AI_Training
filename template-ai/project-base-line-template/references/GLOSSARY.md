# Glossary

A term belongs here when **two people in the project would define it differently.** That is the whole
test. The glossary is not a dictionary; it is a record of agreements.

---

## Domain terms

| Term | Definition | Not to be confused with | Owner |
|---|---|---|---|
| | | | |

## Process terms used in this project

| Term | Definition |
|---|---|
| **RD** | Requirement Definition — *what* the system must do. No implementation detail |
| **BD** | Basic Design — *how* it does it: schema, API, screens, flows |
| **CR** | Change Request — the only way a baselined document changes |
| **ADR** | Architecture Decision Record — why a decision was made, written at the moment |
| **Exit gate** | The evidence record that closes a phase. Verdict first, §9 never empty |
| **Baselined** | Status 🟢. After this, every change is a CR |
| **`[Proposed]`** | A value shipped without ratification. Visible on screen, not only in a document |
| **Finding** | A defect noticed while doing something else. Recorded, not fixed inline |
| **Scope** | `own` / `team` / `assigned` / `all` — always a SQL predicate, never a Python filter |
| **The gate** | `make check` — lint, typecheck, tests **and a real application boot** |
| **Done** | It ran, and the output was read |

## Status markers

| Marker | Meaning |
|---|---|
| 🟡 | Draft — may be edited freely |
| 🟢 | Baselined — changes require a CR |
| 🔵 | Superseded — kept for the record, points at its replacement |
| 🔴 | Blocked |
