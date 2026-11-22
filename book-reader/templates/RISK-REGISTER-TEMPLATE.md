# Risk Register — <PROJECT>

Reviewed at every phase gate. A risk nobody reviewed is a risk nobody is managing.

**Score** = likelihood (1–5) × impact (1–5). Review anything ≥ 12 at every gate; anything ≥ 20 needs
a named owner and a dated mitigation, not a note.

---

## Active

| # | Risk | Category | L | I | Score | Mitigation | Trigger — what tells us it is happening | Owner | Reviewed |
|---|---|---|---|---|---|---|---|---|---|
| R-01 | | technical / schedule / people / external / AI | 3 | 4 | 12 | | | | YYYY-MM-DD |

The **trigger** column is the one that earns the register its keep. A risk with a mitigation but no
trigger is one you will act on after it has already happened.

## Closed

| # | Risk | Why it closed | Date |
|---|---|---|---|

## Realised — risks that became issues

| # | Risk | What happened | Cost | What the register should have said |
|---|---|---|---|---|

The last column is the point of this section. A realised risk whose entry was accurate but
unactioned is a process failure, not a forecasting one.

---

## Risks worth pre-loading on a project of this shape

| Risk | Typical trigger |
|---|---|
| Permission model retrofitted late | The first endpoint ships without a scope predicate |
| AI quality assumed, never measured | A feature ships with no evaluation set |
| Design documents drift from the code | The second silent deviation with no ADR |
| Scope grows without a decision | Three "small" changes in one phase with no CR |
| A single person holds the deployment knowledge | Nobody else has run the release |
| Test data residue breaks the demo | A future-dated fixture appears on page one |
