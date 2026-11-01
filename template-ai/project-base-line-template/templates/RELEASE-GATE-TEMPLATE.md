# Release Gate — v<n.n.n>

**Date:** YYYY-MM-DD · **Release manager:** <name> · **Build:** <tag / commit>
**Decision:** ⬜ Go · ⬜ Go with conditions · ⬜ No-go

---

## Verdict

One sentence that is honest about both halves: what this release delivers, and what is knowingly
unfinished in it.

## 1. Scope

| Phase / CR | Delivered | Gate record |
|---|---|---|

## 2. Quality

| Check | Result | Evidence |
|---|---|---|
| All phase exit gates closed | | |
| Full suite green | | the command and its output |
| **Skipped tests counted and explained** | | |
| UAT accepted | | sign-off, by a real user of the module |
| Security review | | `security-reviewer` report |
| Open critical/high defects | **must be 0** | |
| Accessibility on shipped screens | | |
| Responsive at 375px on shipped screens | | |

## 3. Performance

| NFR | Target | Measured | Conditions |
|---|---|---|---|

Measured on this build, under stated conditions. A number from two releases ago is not a measurement
of this one.

## 4. Operational readiness

| | Ready | Note |
|---|---|---|
| Migrations rehearsed **on a copy of production data** | | not only on an empty database |
| **Rollback rehearsed** | | an untested rollback is not a rollback |
| **Backup restore rehearsed, and dated** | | the only proof a backup exists |
| Monitoring and alerting cover the new surfaces | | |
| Runbook updated | | |
| Secrets in place in the target environment | | |
| On-call briefed on what is new | | |

## 5. AI features in this release

| Feature | Evaluation score | Human review enforced? | Budget guard | `[Proposed]` values visible? |
|---|---|---|---|---|

## 6. Known issues shipping

| # | Issue | Impact | Workaround | Fix planned |
|---|---|---|---|---|

Shipping with known issues is normal. Shipping with **unlisted** known issues is how support learns
about them from a customer.

## 7. Communication

| Audience | What they are told | When | By |
|---|---|---|---|

## 8. Conditions on a conditional go

| # | Condition | Owner | Due |
|---|---|---|---|

## Sign-off

| Role | Name | Date |
|---|---|---|
| Tech lead | | |
| QA | | |
| Product / PM | | |
| Sponsor (if contractual) | | |
