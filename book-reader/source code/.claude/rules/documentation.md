# Rule: Documentation

The documents are the source of truth. These rules keep that true for longer than a month.

---

## R-D1 · Where a thing is written

1. *What* the system must do → `plan/RD/`. *How* it does it → `plan/BD/`. *What I am building now* →
   `plan/Implementation plan/`. *Why we chose this* → `plan/STRATEGY.md` or an ADR.
2. **Never write design documents inside `source code/`**, and never write code under `plan/`. The
   exceptions are `CLAUDE.md`, `README.md`, `.claude/` and `docs/adr/`.
3. A fact is written **once**, in the document that owns it, and referenced from everywhere else by
   section number. Two copies drift, and the reader cannot tell which is current.

## R-D2 · When the code and a document disagree

4. The moment execution contradicts a design document, **write the ADR then** — not at the end of
   the stage. The reasoning is gone by then and gets reconstructed into something tidier and less
   true.
5. An ADR records what was decided and why, including the option that was rejected. **A rule prevents
   a future mistake; an ADR explains a past decision.** If the trap is invisible from the code, it
   needs both.
6. After the ADR, raise a CR against the baselined document. The document is then amended — not
   silently edited, and not left wrong.

## R-D3 · Traceability

7. Every requirement has an id. Every id appears in the BD's §14 traceability table and in at least
   one test name.
8. **Fill the traceability table as you write, not at the end.** A table completed afterwards
   rationalises what was built instead of proving what was required.
9. At a phase gate, anything unmapped is either missed work or a deliberate deferral with a note.
   There is no third category.

## R-D4 · Status discipline

10. Every document carries a status: 🟡 Draft · 🟢 Baselined · 🔵 Superseded · 🔴 Blocked, with a date
    and a version.
11. Baselining is a deliberate act, and after it **every change is a CR.** Baselining too early is as
    expensive as baselining too late.
12. A document containing `TODO`, `TBD` or an unanswered open item is not baselined, whatever its
    status line says.

## R-D5 · Open items and decisions

13. An open item inside a document is **also** a row in `management/OPEN-DECISIONS.md` when somebody
    outside engineering must answer it. One place to answer.
14. Every such row carries a **recommendation** and states what is blocked — the build, or only the
    first real row of data. Conflating those two stalls work that could have proceeded.
15. A value shipped without ratification is marked `[Proposed]` **on the screen**, not only in the
    document.

## R-D6 · Writing style for documents in this project

16. Lead with the claim, then the evidence. A gate verdict, a finding and an ADR all read better as
    conclusion-first.
17. **State what is not covered.** A document that only says what works is a document a later reader
    cannot calibrate. Every gate record has a "what this could not do" section, and it is never
    empty.
18. Numbers come from a run, not from memory. If a number is in a document, the command that
    produced it is beside it.
19. Prefer a table to a paragraph for anything enumerable, and a sentence to a table for anything
    that needs a reason.
