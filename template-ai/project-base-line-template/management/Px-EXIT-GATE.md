# Pn exit gate — <module / theme>

**Walked YYYY-MM-DD at Pn-Sn.** Verdict first, evidence after, and **every number below was read
off a run rather than recalled.** What this gate could not do is in §9, and that section is never
empty.

---

## Verdict: **<one sentence that is honest about both halves>**

A good verdict names what holds *and* what it does not cover. "All 20 criteria are exercised by
tests that name them, and the module has never been pointed at real data" is a verdict. "P<n>
complete ✅" is not — it tells a later reader nothing they can act on.

State the claim this gate makes, narrowly enough to be falsifiable:

> TBD.

And the claim it does **not** make:

> TBD.

### What does not close by engineering

| Not met | Why | Who owns it |
|---|---|---|
| TBD | a decision, a procurement, a measurement that cannot be taken yet | TBD |

---

## 1. Acceptance criteria

`<the command that checks coverage>` →
**`n of n criteria from RD-nn §13 are named by at least one test`**

The ones re-run individually, because each is a property rather than a feature:

| Criterion | Asserted by | What would break it |
|---|---|---|
| 1 | `test_…` | the concrete change that would make it fail |

---

## 2. The authorization surface, as one assertion

Not endpoint by endpoint — one table, generated from the running application, so a new unprotected
route fails the check rather than the review.

| | Count |
|---|---|
| Endpoints | n |
| With a permission dependency | n |
| Deliberately public (each documented at its definition) | n |

---

## 3. Screens

| | Count |
|---|---|
| Specified in BD §5 | n |
| Built | n |
| With all four states | n |
| **Reachable by clicking from the root** (not only by URL) | n |
| Measured at 375px and 768px, no horizontal overflow | n |

> Reachability is asserted, not assumed. So is the **action** that advances each state — a screen
> you can open whose next step is invisible is still a dead end.

---

## 4. The journey, in a browser

What a human did, in order, and what they saw. Screenshots in `Pn-evidence/`.

1. TBD

---

## 5. Background jobs

| Job | Dispatched? | Phase visible on screen? | Bounded? | Idempotent? |
|---|---|---|---|---|

> A job the user started and cannot see is indistinguishable from a job that never ran.

---

## 6. The measured NFRs

Measured, not estimated. Name the script and the conditions.

| NFR | Target | Measured | Conditions |
|---|---|---|---|

---

## 7. The suites

| Suite | Command | Result | Duration |
|---|---|---|---|
| Backend gate | `cd backend && make check` | | |
| Live services | `make check-live` | | |
| Frontend gate | `cd frontend && npm run check` | | |
| E2E | `npm run e2e` | | |

**Skipped tests are reported with their reason.** A skip nobody counted is a gap nobody knows about.

| Skipped | Count | Reason |
|---|---|---|

---

## 8. Deployment currency

| Check | Result |
|---|---|
| Every image rebuilt from current source | |
| Asserted **from inside the running process**, not from its environment | |
| **What did the old image write while it was running?** | |

> Recreating a container is not rebuilding its image, and a stale image is a data hazard, not only a
> behavioural one — it writes well-formed wrong rows that outlive the container.

---

## 9. What this gate could not do

**Mandatory. Never empty.** Everything the gate wanted to verify and could not, with the reason.

| Not verified | Why | What would make it possible |
|---|---|---|

---

## 10. The record at this gate

| | |
|---|---|
| Findings produced | `FINDINGS.md` F-Pn-1 … |
| Decisions still open that this phase consumed | `OPEN-DECISIONS.md` #n |
| ADRs written | `source code/docs/adr/` |
| CRs raised | `plan/CR/` |
| Documents amended | |
| `[Proposed]` values shipped | each one, and where it is visible on screen |

---

## Gate checklist

- [ ] Every acceptance criterion exercised by a test that names it
- [ ] Every endpoint's permission dependency asserted as one table
- [ ] Every screen built, four states, reachable, measured at 375px
- [ ] Every state-advancing action reachable
- [ ] Every background job persists and displays a phase, and is bounded
- [ ] Migrations run forward on an empty database and on one with representative data
- [ ] Seeds run twice without duplicating
- [ ] All images rebuilt; deployed code asserted current from inside the process
- [ ] The journey walked in a browser, with screenshots
- [ ] NFRs measured, with the conditions stated
- [ ] Skipped tests counted and explained
- [ ] `FINDINGS.md` reported with the result
- [ ] `PROGRESS.md` current position updated
- [ ] §9 written and non-empty
