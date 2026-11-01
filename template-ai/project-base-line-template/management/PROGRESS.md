# PROGRESS

Running log of implementation progress. **Update this after every stage.** A new session reads this
first to find where the last one stopped, and to decide what it may trust.

Plan: `plan/Implementation plan/nn_IMPL_PLAN_Pn.md` (current phase).

---

## Current position

**This table is the first thing a new session reads. It is the first thing to update at every stage
boundary** — a stale row here sends the next session to the wrong file, and it goes stale more often
than any other row in the project.

| | |
|---|---|
| **Phase** | **Pn — <name> — IN PROGRESS / CLOSED YYYY-MM-DD.** Plan: `plan/Implementation plan/nn_IMPL_PLAN_Pn.md`. Gate record: `management/Pn-EXIT-GATE.md` |
| **Stage** | **Pn-Sn — <state>.** What was run, and what its output said |
| **Next step** | The single next action, concrete enough to start without re-reading the plan |
| **Open work** | What is built but not finished, and what is deferred with a decision behind it |
| **Blocked on** | Nothing, or the decision id and who owns it |

---

## How to write an entry

One section per stage, newest at the top of the log below. Each entry states:

1. **What was built** — in behaviour, not in file names.
2. **What verification actually showed** — the command, and its output. Not "tests pass"; the
   number that passed, and the one thing it does not cover.
3. **What was found** — defects go to `FINDINGS.md`; decisions go to `OPEN-DECISIONS.md`;
   contradictions with a design document become an ADR **at that moment**, not at the end of the
   stage, because the reasoning is gone by then.
4. **What a later reader should not re-derive** — the two or three facts that cost time to learn.

> **"Done" means it ran and the output was read.** A green suite proves the code the tests reach is
> the code that was intended. It does not prove the application boots, the container holds the new
> image, the screen is reachable, or the job wrote the right rows.

---

## Pn-Sn · YYYY-MM-DD · <stage name> — **DONE / IN PROGRESS / BLOCKED**

**What it does now.** TBD — one paragraph a non-author can read.

**What was verified, and how.**

```
$ cd backend && make check
<the actual output line that matters>
```

| Check | Result |
|---|---|
| `make check` | TBD |
| `make check-live` | TBD |
| Screens measured at 375px | TBD |
| Journey walked in a browser | TBD |

**What was found.**

| # | Finding | Where it went |
|---|---|---|
| 1 | TBD | `FINDINGS.md` F-Pn-m |

**Worth not re-deriving.**

1. TBD
