---
name: new-change-request
description: Raise, assess and close a change request against a baselined document — impact assessment, options with a do-nothing row, decision authority and document amendment. Use whenever a baselined RD, BD or strategy must say something different.
---

# Raising a change request

Read `management/CR-MANAGEMENT.md` for the governance; this is the procedure.

## 1 · Is it a CR?

> **Would a reader of the baselined document be surprised by what the system now does?**

If yes, it is a CR. If the document is still 🟡 Draft, just edit it. If the *code* is wrong and the
document is right, it is a fix and a row in `FINDINGS.md`.

**If the document was found wrong by the code: write the ADR first, at that moment**, then raise the
CR. The reasoning is gone by the end of the stage.

## 2 · Raise it

```sh
cp "plan/CR/CR-TEMPLATE.md" "plan/CR/CR-00n_<slug>.md"
```
Add the row to `plan/CR/CR-INDEX.md` and to `management/CR-MANAGEMENT.md` §6.

## 3 · Quote the baseline

§3 of the CR quotes the current document **with its section number**. If you cannot quote it, the
behaviour was never baselined — this is a missing requirement, and it belongs in the RD rather than
in a CR.

## 4 · Write the replacement text

§4 is the text the document will say afterwards, verbatim. Not a description of the change — the
implementation applies this directly, and a description gets interpreted twice.

## 5 · Assess the impact honestly

Requirements, design, schema, API, screens, tests, security, **data** and documents.

The row people skip is **data**: can existing rows be migrated, or is history lost? That answer
sometimes reverses the decision on its own.

Effort with its **basis**, not a feeling. Confidence stated.

## 6 · Options, including doing nothing

**A CR with no "do nothing" row is an incomplete assessment.** Sometimes the current behaviour is
cheaper than the change, and that option deserves its cost stated rather than being implied to be
zero.

## 7 · Recommend

One paragraph, stated plainly, so the default path is "accept and proceed". A CR that asks an open
question without recommending anything waits.

## 8 · Decision

By the authority in `CR-MANAGEMENT.md` §3. Record the rationale **in the decider's words** — that is
the row a future reader needs, more than the decision itself.

A rejected CR stays in the register. The next person to ask the same question needs the reason.

## 9 · Implement and close

Amend the documents **as part of the change**, not afterwards. Bump versions. Close only when the
documents, the code and the tests all agree.

## Checklist

- [ ] Confirmed it is a CR and not an edit, a fix or a decision
- [ ] ADR written first if the code found the document wrong
- [ ] Baseline quoted with its section number
- [ ] Replacement text written verbatim
- [ ] Impact assessed across all rows, **including data**
- [ ] Options include a costed do-nothing
- [ ] A recommendation is stated
- [ ] Decision recorded with the decider's own rationale
- [ ] Documents amended and versions bumped in the implementing change
- [ ] Registers and metrics updated
