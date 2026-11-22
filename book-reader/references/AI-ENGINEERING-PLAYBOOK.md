# AI Engineering Playbook

How AI features are built on this project, and the ways they fail. The enforceable version is
`source code/.claude/rules/ai-engineering.md`; this is the reasoning behind it.

---

## 1. The thing that makes AI features different

Ordinary features fail loudly. A null reference throws, a constraint rejects, a type error does not
compile.

**AI features fail plausibly.** A wrong extraction, a wrong score, a confidently wrong summary — each
arrives as a well-formed object through the same code path as a correct one, passes every schema
check, renders beautifully, and is wrong. There is no stack trace, and the first person to notice is
usually a customer.

Everything below follows from that one asymmetry: **the system cannot tell good output from bad, so
the design must make bad output either impossible or visible.**

## 2. Make it impossible before you make it visible

In order of strength:

| Strength | Mechanism | Example |
|---|---|---|
| Strongest | **The schema has no field for it** | the model cannot return a total, because `total` is not in the output type |
| Strong | **A deterministic rule does the job instead** | emails, dates and amounts are parsed, never inferred |
| Strong | **A database constraint** | a weight set cannot be marked `fitted` below an outcome count |
| Medium | A service-layer guard | a draft cannot be exported without a recorded review |
| **Weak** | Prose in the prompt | "do not invent numbers" |

Teams reach for the weakest mechanism first because it is the easiest to write. **Prose in a prompt
is a request, not a constraint.** Spend the design effort moving each rule up this table.

## 3. Never let a model near a number

A model will produce a number that looks right and is not, and no downstream check will catch it
because the number is in range, correctly typed and plausibly precise.

- **Compute in code.** Scores, totals, variances, probabilities, rankings.
- **The model may narrate a number it is given.** It may never produce one.
- **A score is not renderable without its evidence** — inputs, weights, contributions. Make it a
  serializer invariant, so no future screen can display a bare number.
- **`insufficient_data` beats a guess.** A visible gap is information; a plausible number is a lie
  that compounds.

## 4. Deterministic first, model for judgement only

Ask: *could a rule do this?* If yes, a rule does it.

The model's share should be the part that genuinely needs reading comprehension — classification,
disambiguation, summarisation, structuring prose. Everything mechanical around it is rules, and the
rules run **last** in the merge as a second guard.

This is also the cheapest architecture: the model gets smaller inputs, smaller outputs, and is called
less often.

## 5. Prompts are code

A prompt embedded in a function cannot be reviewed, diffed, rolled back or measured.

- A registry entry: id, semantic version, tier, output schema, changelog.
- **A changelog entry names what the previous version got wrong.** "Improved the wording" is not an
  entry.
- **State the easy case explicitly.** The most common prompt defect by a wide margin: a prompt
  explains a hard edge case at length, leaves the obvious case implicit, and the model treats the
  obvious case as optional. It is invisible in review *because* the prose looks thorough.
- Know every consumer before editing. Prompt and tool text is often read by a model **and** rendered
  to a human.

## 6. Quality is a measurement, not an impression

A schema-valid response proves the plumbing works. It says nothing about whether the answer is right.

- **An evaluation set ships with the feature**, in the same change. Inputs, expected outputs, a
  metric.
- **Labelled by a domain reader, not the prompt's author.** An author grading their own prompt
  measures their own intention.
- Include **adversarial** cases (injection, contradiction, empty input) and **negative** cases (where
  the right answer is "I cannot tell"). A set of only typical cases measures a demo.
- Report the delta on every prompt or model change. Report-only until the owner sets a threshold.
- **Say what the set does not measure.** A pipeline exercised against a fake embedding provider
  demonstrates a mechanism and proves nothing about grouping quality — and a green run that implies
  otherwise is worse than no run.

## 7. Everything AI is asynchronous, and therefore must be visible

Model calls take seconds to minutes and have concurrency ceilings, so they never run in a request
path. That makes every AI feature a background job — and background jobs fail in a way that is
entirely about the UI:

> **A job the user started and cannot see is indistinguishable from a job that never ran.**

Persist the phase in the database (not in a hook), write `queued` before dispatch, name what a
blocked job is waiting for, bound the wait, end in a state a user can act on, and never invent a
percentage.

## 8. Cost is designed, not discovered

The first answer to "which feature is expensive?" usually arrives as an invoice.

- Tier every prompt. The expensive model where judgement needs it, not by default.
- Record tokens and cost per call from the first day.
- **Enforce a budget guard**, do not merely report it.
- **Measure provider concurrency before promising a deadline.** The same batch is twenty minutes or
  four hours depending on it, and that difference has decided feature scope on real projects.
- Long chains checkpoint. A four-hour run that fails at the last step must resume.

## 9. Untrusted input is the largest surface

Any text the model reads that the company did not write is an injection vector: retrieved documents,
uploads, customer messages, scraped pages.

- Delimit it and frame it as **reference material, not instructions**.
- **No tool call or state change may be triggered by retrieved content.**
- Validate output against a schema regardless of adapter.
- Re-validate retrieved ids against the database before showing or citing them — the index is a
  cache, and it can be stale.
- **An answer must not cite what the reader cannot open**, and must not quote it either.

## 10. The human stays responsible

- AI output is a **draft** until a human review is recorded, with the reviewer's name.
- Every generated artifact is **labelled as AI-generated** wherever a human sees it, with provenance:
  prompt id and version, model, timestamp, inputs.
- **Consequential decisions are recorded decisions** with an owner and a reason — not model outputs
  that nobody owns.

## 11. The traps, collected

| Trap | What it looks like |
|---|---|
| A cache keyed on adapter *name* | A fixed adapter re-serves the old wrong output; the fix appears not to work |
| An enum value added in only one place | Runtime `LookupError`, long after the migration passed |
| A stale worker image | Well-formed wrong rows, written all night, with a successful batch report |
| A fake embedding provider | Clustering "works" and groups nothing |
| A prompt that explains only the hard case | The easy case silently becomes optional |
| A tool declared with nothing serving it | A promise to the model that the system cannot keep |
| An unbounded agent loop | Cost discovered at the end of the month |
| `202` treated as success | A saga that failed, reported as complete |
