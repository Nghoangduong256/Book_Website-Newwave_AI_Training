# Rule: AI Engineering

Rules for every part of the system that calls a model. They exist because AI features fail
differently from ordinary features: **they fail plausibly.** A wrong number from a model looks
exactly like a right one, carries no stack trace, and reaches a customer through the same code path
as the correct answer.

Source: `plan/BD/BD-04_AI_RAG_DESIGN.md`. Security rules for untrusted input are in `security.md`
R-S9; this document assumes them.

---

## R-AI1 · The model is behind an adapter

1. All model access goes through **one provider-agnostic interface**. A service never imports a
   vendor SDK, and swapping providers is a configuration change.
2. **A `fake` adapter ships from day one and is the default in test and CI.** It returns
   schema-valid, deterministic output. Every business rule, state transition and failure path must
   be reachable with no API key configured and no money spent — a feature that cannot be tested
   without a provider is a feature that will not be tested.
3. Adapters are versioned. Anything that caches model output keys on the adapter **version**, not
   its name — otherwise a fixed adapter re-serves the old wrong text and the fix appears not to
   work. (`testing.md` R-T8 §39.)
4. Model ids are configuration, never literals in business code. Pin them; a silently-updated model
   is an unannounced behaviour change.

## R-AI2 · No model call in a request path

5. Anything that calls a model returns `202` with a job handle and runs on a dedicated queue.
   Providers have concurrency ceilings and multi-second latencies; a request path that waits on one
   is a request path that times out under load.
6. The AI queue is **separate from the fast queues.** A 20-minute generation must not sit in front of
   a 200 ms export.
7. Every call has a timeout, a bounded retry policy, and a recorded failure state. A retry on a
   non-transient refusal just spends money twice.
8. The job's phase is persisted and shown on screen (`coding-conventions.md` R-C11). AI jobs are the
   longest in the system and therefore the ones where an invisible job hurts most.

## R-AI3 · Prompts are versioned artifacts, not string literals

9. Every prompt lives in a **registry**, with an id, a semantic version, its model tier, its output
   schema, and a changelog. A prompt embedded in a function cannot be reviewed, diffed or rolled
   back.
10. A prompt change is a **version bump with a recorded reason.** "Improved the wording" is not a
    reason; what it previously got wrong is.
11. **Prompt text can be dual-purpose.** The same string may be read by a model *and* rendered on a
    screen or passed to a tool definition. Before editing one, know every consumer — a wording change
    made for a model can silently rewrite a user-facing label.
12. **State the easy case explicitly, not only the hard one.** A prompt that explains an edge case at
    length and leaves the obvious case implicit reads, to a model, as if the obvious case were
    optional. This is the single most common prompt defect, and it is invisible in review because
    the prose looks thorough.
13. Prompts carry no secrets and no personal data beyond what the task requires. They are persisted
    in event history and sent to a third party.

## R-AI4 · Deterministic before AI, and the schema enforces it

14. **Anything a rule can extract, a rule extracts.** Emails, phone numbers, dates, currencies,
    identifiers and postal codes come from deterministic parsing. The model is asked only for what
    genuinely needs judgement.
15. **The output schema has no field for what the model must not produce.** This is the enforcement,
    not a convention: a model that returns a number finds nowhere to put it. Prose asking it not to
    is a request; an absent field is a wall.
16. Deterministic rules are applied **last** in the merge, as a second guard.

## R-AI5 · No model output reaches arithmetic

17. **No LLM anywhere near a number.** Scores, totals, variances, probabilities and rankings are
    computed in code from stored values. A model may *narrate* a number it is given; it may never
    produce one.
18. A computed score is renderable only **with its evidence** — the inputs, their weights and their
    contributions. Make this a serializer invariant, not a UI convention, and a score cannot be
    displayed bare by any future screen.
19. Where there is insufficient data, the system says `insufficient_data` and shows no number. A
    plausible guess is worse than a visible gap.
20. **Weights nobody ratified ship marked `[Proposed]`, and the marking is visible on the screen.**
    A judged weight set must never be described as fitted — enforce it with a database constraint
    tied to the outcome count, not with a code comment.

## R-AI6 · Validate, then trust nothing

21. Every response is validated against its schema **before use**, regardless of adapter.
22. A validation failure is a recorded, actionable failure state — never a silent fallback to an
    empty object, and never a retry loop that burns budget.
23. Retrieved and customer-supplied content is **data, never instructions** (`security.md` R-S9). No
    tool call or state change may be triggered by retrieved content.
24. **AI output is a draft.** It is not exported, sent or shown to a customer without a recorded
    human review, and the record names the reviewer.
25. Every AI-generated artifact is **labelled as AI-generated** wherever a human can see it, and
    carries provenance: prompt id and version, model, timestamp, inputs.

## R-AI7 · Quality is measured, not assumed

26. **Every AI feature ships with an evaluation set in the phase that ships it.** Inputs, expected
    outputs, and a metric. Without one, there is no way to tell a prompt improvement from a
    regression, and "it seems better" is the only available evidence.
27. The evaluation set is versioned alongside the prompt and is **labelled by someone who knows the
    domain**, not by the prompt's author. An author grading their own prompt measures their
    intention.
28. A prompt or model change runs the evaluation set and records the delta. The gate is report-only
    at first; it becomes blocking at a threshold somebody has agreed to — and that threshold is a
    decision for the project owner, in `OPEN-DECISIONS.md`, not for engineering.
29. State the quality that is **not** measured. A pipeline exercised end to end against a fake
    embedding provider demonstrates a mechanism and says nothing about whether the grouping is
    meaningful — say so at the gate rather than letting the green run imply otherwise.

## R-AI8 · Cost and concurrency are designed, not discovered

30. Prompts declare a **tier** (`cheap` / `primary`). The expensive model is used where judgement
    needs it, not by default.
31. A per-installation budget guard is **enforced**, not reported. It refuses calls above the
    ceiling, and the refusal is a visible state.
32. Token counts and cost per call are recorded. Without them, nobody can answer which feature is
    expensive, and the first answer always arrives as an invoice.
33. Concurrency is capped per provider, and the cap is a measured number. A provider's throughput
    decides whether a batch job takes twenty minutes or four hours — measure it before promising a
    deadline.
34. Long AI chains checkpoint. A four-hour run that fails at the final step must resume, not restart.

## R-AI9 · Retrieval

35. Every retrieval applies the caller's permission filter, and retrieved ids are re-validated
    against the database before being shown or cited (`security.md` R-S5).
36. The index is a **cache, never a source of truth.** Everything in it is rebuildable from the
    database, and the rebuild job ships in the same phase as the index.
37. Chunking strategy, embedding model and dimensions are recorded with each stored vector. Changing
    any of them requires a re-index, and a mixed index returns results that are quietly wrong.
38. An answer cites its sources, and **every citation is openable by the person reading it.**

## R-AI10 · Agents and tools

39. A tool call runs as a real user, with scopes that narrow and never widen their permissions.
40. A tool's `description` is dual-purpose: it is read by the model *and* often rendered to a human.
    Changing it changes model behaviour. Treat it as a prompt, with a version.
41. Every tool is idempotent or explicitly guarded. A model will retry.
42. An agent loop is bounded: maximum turns, maximum spend, maximum wall-clock. All three, and all
    three visible.
43. Declaring a tool that nothing serves is a defect, not a placeholder. It reaches the model as a
    promise the system cannot keep.
