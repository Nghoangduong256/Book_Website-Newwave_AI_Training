# Decisions

**This is the one place to answer.** Open items are at the top; answered ones are kept below as the
record of what was decided and why.

**To answer:** write in the **Answer** column, or just say it in conversation and it gets recorded
here. Either way it ends up in this file.

---

## How to write a row that gets answered

A question with no recommendation attached waits. A question with a recommendation becomes "accept
and proceed", and the project does not stall. So every row carries:

| Column | What goes in it |
|---|---|
| **#** | A number that is never reused |
| **Open decision** | The question, **plus the recommendation and the evidence behind it** |
| **Blocks** | Precisely what cannot proceed — and whether it blocks the *build* or only the *first real row of data*. Those are very different, and conflating them stalls work that could have continued |
| **Effort for you** | "One number." "Name a person." "Confirm the recommendation or say which part to change." If answering looks expensive, it will not happen |

Three further rules, each from a failure this register exists to prevent:

1. **A value shipped without ratification ships marked `[Proposed]`,** and the marking is visible on
   the screen that uses it — not only in this file. A number nobody ratified that looks ratified is
   worse than a visible gap.
2. **Engineering does not silently answer a question that belongs to somebody else.** It states a
   recommendation, builds against it, and says so at the gate.
3. **A decision deferred is still an answer** — record it with its date and who deferred it, so the
   next session does not ask again.

---

## Open

| # | Open decision | Blocks | Effort for you | Answer |
|---|---|---|---|---|
| 1 | **TBD — question, then: *Recommendation:* …, because …** | Pn-Sn; the build proceeds on the recommendation | One line | |

## Triage — what actually has to be answered when

| When it is genuinely needed | Items | If unanswered |
|---|---|---|
| Before Pn starts | # | the real consequence, not "it is blocked" |
| At the Pn exit gate | # | proceeds on the recommendation, and the gate says so |
| Not blocking | # | nothing today |

---

## Answered

| # | Decision | Answer | Date | Who | Where it was applied |
|---|---|---|---|---|---|
