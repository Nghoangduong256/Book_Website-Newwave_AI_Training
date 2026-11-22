---
name: phase-exit-gate
description: Walk a phase exit gate and produce the evidence record — criteria coverage, screen reachability, permission surface, job visibility, deployment currency and the browser journey. Use at the end of a phase, before declaring it closed.
---

# Walking a phase exit gate

Produce `management/Pn-EXIT-GATE.md` from `management/Px-EXIT-GATE.md`.

> **Every number in the record was read off a run, not recalled.** If you did not run it, it does not
> go in the record — it goes in §9, *what this gate could not do*.

## Order of work

1. **Acceptance criteria.** Which test names each criterion in the RD §13? Report `n of n` and name
   every criterion with no test. Re-run individually the ones that are properties rather than
   features, and state what change would break each.
2. **The permission surface**, as one generated table: every route, its permission, and **every route
   without one, by name.**
3. **Screens.** Specified → built → four states. Then: **reachable by clicking from the root?** and
   **is the action that advances each state reachable?**
4. **Responsive.** Every new or changed route at 375px and 768px.
5. **Jobs.** Each one: dispatched, phase persisted, phase rendered, bounded, idempotent.
6. **Migrations and seeds.** Forward on empty and populated; seeds twice; an empty autogenerate diff
   afterwards.
7. **Deployment currency.** Rebuild every image. Assert the new value **from inside the running
   process**. Then ask: **what did the old image write while it was running?**
8. **Suites.** Command, result, duration, and **skipped tests counted with their reasons.**
9. **The journey**, in a browser, with screenshots to `Pn-evidence/`.
10. **NFRs**, measured, with conditions. An unmeasured NFR is reported as unmeasured, not omitted.
11. **The record.** Findings, decisions consumed, ADRs, CRs, documents amended, and every
    `[Proposed]` value shipped with where it is visible on screen.

## Writing it

Verdict first — one sentence honest about both halves. Then the claim this gate makes, the claim it
does **not** make, and what does not close by engineering with its owner.

## §9 is mandatory and never empty

There is always something: an unmeasured quality, a synthetic data set, an integration with no
counterpart yet, a decision still open. **A gate with an empty §9 has not looked hard enough** — and
the next phase will build on a false known.

## Checklist

- [ ] Verdict states what holds and what it does not cover
- [ ] Criteria coverage counted, gaps named
- [ ] Permission surface generated as one table
- [ ] Screens: built, four states, reachable, actions reachable, measured
- [ ] Jobs visible and bounded
- [ ] Images rebuilt; currency asserted from inside the process; the old image's writes accounted for
- [ ] Skipped tests counted and explained
- [ ] Journey walked, screenshots attached
- [ ] NFRs measured with conditions
- [ ] `FINDINGS.md`, `OPEN-DECISIONS.md`, `PROGRESS.md` all updated
- [ ] §9 written, and not empty
