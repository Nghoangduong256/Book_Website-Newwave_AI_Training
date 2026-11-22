# CR-nnn — <short title>

> **Raised:** YYYY-MM-DD · **Raised by:** <name> · **Type:** scope / design / defect / schedule
> **Priority:** critical / high / medium / low
> **Status:** 🟡 Proposed · 🔵 Under assessment · 🟢 Approved · 🔴 Rejected · ⚫ Implemented
> **Affects:** `RD-nn §x`, `BD-Mnn §y`, phase Pn
> **Decision due:** YYYY-MM-DD

---

## 1. What is being asked for

Two or three sentences, in the requester's terms. No solution yet.

## 2. Why — the trigger

What changed. One of:

- a stakeholder changed their mind (name them and the date)
- a design document was found wrong when it met the code (link the ADR)
- an assumption failed (name it, and where it was written down)
- a defect requires a design change rather than a fix (link the `F-Pn-m` finding)
- an external constraint moved (regulation, vendor, deadline)

## 3. Current baselined behaviour

Quote the document being changed, with its section number. If you cannot quote it, the behaviour
was never baselined and this is not a CR — it is a missing requirement, and belongs in the RD.

> RD-nn §x: "…"

## 4. Proposed behaviour

What it says after the change. Write the replacement text, not a description of it — the
implementation applies this verbatim.

## 5. Impact assessment

| Area | Impact | Detail |
|---|---|---|
| Requirements | FR-nn-mm added / changed / removed | |
| Design | BD-Mnn §y | |
| Schema | migration required? backfill? | a backfill is a separate, reversible step |
| API | breaking? client regeneration? | |
| Screens | SC-nn-mm | |
| Tests | which suites change | |
| Security | permission added? scope changed? | a new permission is a catalogue amendment first |
| Data | existing rows affected | **can they be migrated, or is history lost?** |
| Documents | which documents are re-baselined | |

**Effort:** <n> days · **Confidence:** high / medium / low · **Basis:** what the number is derived
from, not a feeling.

## 6. Options considered

| # | Option | Effort | Risk | Verdict |
|---|---|---|---|---|
| A | Do nothing | 0 | what it costs to live with | |
| B | <proposal> | | | **recommended** |
| C | <alternative> | | | |

**A CR without a "do nothing" row is an incomplete assessment.** Sometimes the current behaviour is
cheaper than the change.

## 7. Recommendation

One paragraph. State the recommendation plainly so the default path is "accept and proceed".

## 8. Decision

| | |
|---|---|
| **Decision** | approved / rejected / deferred |
| **Decided by** | |
| **Date** | YYYY-MM-DD |
| **Conditions** | |
| **Rationale** | why, in the decider's words — this is the row a future reader needs |

## 9. Implementation

| | |
|---|---|
| Phase / stage | |
| Documents amended | list each, with the version it became |
| Migrations | |
| ADR | ADR-nnnn, if the change contradicts a design document |
| Verified by | the command that was run, and what its output said |
| Closed | YYYY-MM-DD |

---

## Rules for this document

1. **A change to a baselined document is a CR, not an edit.** Baselined means status 🟢.
2. The CR amends the document; the document is not amended in place without one.
3. A CR is closed only when the documents, the code and the tests all agree — not when the code
   merges.
4. A rejected CR stays in the register. The next person to ask the same question needs the reason.
