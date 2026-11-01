# nn_<TOPIC>_ANALYSIS

> **Version:** 0.1 · **Date:** YYYY-MM-DD · **Status:** 🟡 Draft
> **Read after:** `plan/STRATEGY.md` · **Read before:** `RD-nn_<module>.md`

**When to write one of these.** Before an RD, when the feature is new *in kind* rather than new in
detail — a capability the system has never had, a positioning question, or a build/buy decision. A
module that resembles one already built needs no analysis; it needs an RD.

---

## 1. The question

One sentence. If it takes a paragraph, it is more than one question — split it.

## 2. Current state

What exists today, measured rather than assumed. For each claim, the file, table or report it was
read from.

| Area | Today | Evidence |
|---|---|---|

## 3. Gap analysis

| # | Gap | Impact | Severity |
|---|---|---|---|
| GAP-1 | TBD | what it costs | high / medium / low |

## 4. Data readiness

The question that sinks most AI features: **does the data exist, and is it good enough?**

| Data needed | Exists? | Volume | Quality | Where it would come from |
|---|---|---|---|---|

> Anything that **cannot be back-filled** belongs in the earliest possible phase. Point-in-time
> history is the usual example: every month of delay is a month of data that can never be recovered,
> and the capture job is almost always cheap compared with the capability it unlocks later.

## 5. Options

| # | Option | Effort | Risk | Reversibility | Verdict |
|---|---|---|---|---|---|
| A | Do nothing | 0 | | — | |
| B | TBD | | | | **recommended** |

## 6. Classification — reuse / extend / new

Honest accounting of how much is genuinely new. The temptation is to classify as `new` what is
really `extend`, because new is more interesting to build.

| Capability | REUSE | EXTEND | NEW | Note |
|---|---|---|---|---|

## 7. Boundary resolution

Where this feature ends and an existing module begins. Every overlap gets an owner, stated as a
sentence both modules' RDs can quote.

| Overlap | Owner | Rule |
|---|---|---|

## 8. Principles

The handful of properties the design must hold, each with **a named mechanism and a way to check
it**. A principle with no mechanism is a slogan.

| # | Principle | Mechanism | Checkable by |
|---|---|---|---|

## 9. Assumptions

| # | Assumption | If it is wrong | How we would find out |
|---|---|---|---|

## 10. Implementation impact

What this means for phases, schema, existing modules, and the roadmap.

## 11. Recommendation

One paragraph, then the decisions it needs — each of which becomes a row in
`management/OPEN-DECISIONS.md` with the recommendation attached.
