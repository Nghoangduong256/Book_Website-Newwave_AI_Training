---
name: new-ai-prompt
description: Add or change a model prompt — registry entry, version, output schema, untrusted-input framing, fake-adapter path, evaluation set and cost tier. Use for any change to what a model is asked.
---

# Adding or changing a prompt

A prompt is a **versioned artifact with a schema and a test**, not a string in a function. Read
`.claude/rules/ai-engineering.md` first.

## 1 · Decide what the model is actually for

**Anything a rule can extract, a rule extracts.** Emails, phone numbers, dates, amounts, identifiers
and postal codes come from deterministic parsing. The model gets what genuinely needs judgement.

Then write down what the model must **never** produce — and enforce it by **leaving that field out of
the output schema.** A model that returns a number finds nowhere for it to land. Prose asking it not
to is a request; an absent field is a wall.

## 2 · Register it

| Field | Value |
|---|---|
| id | `{module}_{purpose}` |
| version | semver; **bump on every change, with a reason** |
| tier | `cheap` or `primary` — the expensive model where judgement needs it, not by default |
| output schema | the validated shape |
| changelog | what the previous version got wrong |

"Improved the wording" is not a reason. *What it previously got wrong* is.

## 3 · Write the prompt

**State the easy case explicitly, not only the hard one.** This is the single most common prompt
defect and it is invisible in review: a prompt that explains an edge case at length and leaves the
obvious case implicit reads, to a model, as if the obvious case were optional. The prose looks
thorough precisely because it covered the difficult thing.

**Frame untrusted input as data.** Retrieved content and customer-supplied text go in a delimited
block with an instruction to treat them as reference material. No tool call or state change may be
triggered by what is inside it.

**No secrets, no personal data beyond the task.** Prompts are persisted and sent to a third party.

## 4 · Know every consumer

Prompt and tool text is often dual-purpose — read by a model *and* rendered on a screen or used as a
tool description. Before editing, find every consumer: a wording change made for a model can silently
rewrite a user-facing label.

## 5 · Validate the output

Schema validation before use, every time, regardless of adapter. A failure is a recorded, actionable
state — never a silent fallback to an empty object, and never a retry loop that burns budget.

## 6 · The fake adapter path

The `fake` adapter returns schema-valid deterministic output for this prompt, so every business rule
and failure path is reachable with no API key and no spend.

## 7 · The evaluation set

**Ships in the same change as the prompt.** Inputs, expected outputs, a metric.

Labelled by somebody who knows the domain — an author grading their own prompt measures their
intention. Run it on every prompt or model change and record the delta. Report-only until a threshold
somebody has agreed to; that threshold is a project-owner decision in `OPEN-DECISIONS.md`.

## 8 · Cost

Record tokens and cost per call. Cap concurrency per provider at a **measured** number — provider
throughput is what decides whether a batch takes twenty minutes or four hours.

## Checklist

- [ ] Deterministic extraction does everything a rule can do
- [ ] Output schema has no field for what the model must not produce
- [ ] Registered with id, version, tier, schema and a changelog entry naming the defect fixed
- [ ] The easy case is stated, not only the hard one
- [ ] Untrusted input delimited and framed as data
- [ ] No secret, no unnecessary personal data
- [ ] Every consumer of the text identified before editing
- [ ] Output schema-validated; failure recorded, not swallowed
- [ ] Fake adapter covers every business path
- [ ] Evaluation set shipped in the same change, labelled by a domain reader
- [ ] Cost and tokens recorded; concurrency capped at a measured number
- [ ] **Any cache keyed on adapter version, not adapter name** — or the fix will not be visible
