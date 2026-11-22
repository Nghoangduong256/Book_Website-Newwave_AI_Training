# UAT Script — <module / phase>

**Version:** 0.1 · **Date:** YYYY-MM-DD · **Environment:** staging
**Tester:** <name and role — a real user of this module, not its author>
**Build:** <commit / image tag> — **verified current before testing started**

---

## Before you start

| | |
|---|---|
| Accounts provided | role → username, with the permissions each is meant to have |
| Test data loaded | which fixture set, and whether it is realistic enough to be meaningful |
| Known gaps | what is deliberately not built yet, so it is not reported as a defect |

## How to record a result

**Pass** means you saw the expected outcome. **Fail** means you did not — record *what you saw*, not
what you think went wrong. A screenshot beats a sentence.

**If you could not run a case, record it as blocked, never as pass.** A blocked case counted as a
pass is how an untested path reaches production.

---

## Scenarios

### UAT-01 · <scenario name>  *(covers FR-nn-mm, BR-nn-mm)*

**As:** <role> · **So that:** <outcome>

| # | Step | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | | | | ⬜ pass / fail / blocked |
| 2 | | | | |

**Overall:** ⬜ Pass · ⬜ Fail · ⬜ Blocked
**Notes:**

---

## Permission cases — mandatory

Not an afterthought: these are the cases a developer cannot test convincingly, because they know
which button to avoid.

| # | As | Attempt | Expected | Actual | Result |
|---|---|---|---|---|---|
| P1 | a role without the permission | open the screen | the action is absent | | |
| P2 | a role without the permission | call the action anyway (a saved link, the back button) | refused by the server | | |
| P3 | a user with narrow scope | list records | only their own appear, **and the count matches** | | |

## Summary

| | Count |
|---|---|
| Scenarios | |
| Passed | |
| Failed | |
| **Blocked** | |

**Verdict:** ⬜ Accepted · ⬜ Accepted with defects (listed, owned, dated) · ⬜ Rejected

**Sign-off:** <name> · <date>
