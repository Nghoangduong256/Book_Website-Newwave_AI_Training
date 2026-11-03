# Prompt — `<module>_<purpose>`

> **Version:** 1.0.0 · **Tier:** cheap | primary · **Status:** 🟡 Proposed · 🟢 Reviewed
> **Owner:** <name> · **Reviewed by a domain practitioner:** yes / no — **and if no, say so wherever
> this prompt's output is shown.**

---

## 1. What the model is asked to do

One sentence. If it takes a paragraph, the prompt is doing two jobs and should be two prompts.

## 2. What the model is **not** asked to do

| Not asked for | Why | How it is enforced |
|---|---|---|
| any number, score or total | a model is not a calculator; the number will be plausible and wrong | **absent from the output schema** |
| | | |

**Enforcement is the schema, not the prose.** A model that returns a field finds nowhere for it to
land. Asking it not to is a request.

## 3. Deterministic pre-processing

What rules extract before the model is called. Anything a rule can do, a rule does.

| Field | Extracted by | Applied |
|---|---|---|
| email, phone, URL, postal code | regex rules | **last in the merge, as a second guard** |

## 4. Input

| Input | Source | Trusted? |
|---|---|---|
| | | **No** if it came from a document, a customer or retrieval |

Untrusted input is wrapped in a delimited block and framed as reference material. No tool call or
state change may be triggered by what is inside it.

## 5. Output schema

```json
{
  "field": "type — and what it means",
  "confidence": "low | medium | high"
}
```

Validated before use, every time, regardless of adapter. A validation failure is a recorded,
actionable state — never a silent fallback and never a retry loop that burns budget.

## 6. The prompt

```text
<the text>
```

**Checklist for the text itself:**

- [ ] The **easy case is stated explicitly**, not only the hard one — a prompt that explains an edge
      case at length and leaves the obvious case implicit reads, to a model, as if the obvious case
      were optional. This is the most common prompt defect and it is invisible in review.
- [ ] Untrusted input is delimited and framed as data
- [ ] No secret, no personal data beyond what the task needs
- [ ] The output format is specified once, unambiguously

## 7. Consumers

Every place this text is read. **Prompt and tool text is often dual-purpose** — read by a model *and*
rendered on a screen, or used as a tool description. A wording change made for the model can silently
rewrite a user-facing label.

| Consumer | How it uses the text |
|---|---|

## 8. Evaluation

| | |
|---|---|
| Evaluation set | `ops/evaluations/<name>.jsonl` — **ships in the same change as this prompt** |
| Size | n cases |
| Labelled by | <name> — **a domain reader, not the prompt's author** |
| Metric | e.g. field-level exact match, recall@5 |
| Current score | n% on YYYY-MM-DD, against version 1.0.0 |
| Regression threshold | report-only until <owner> sets one (`OPEN-DECISIONS.md` #n) |

## 9. Cost

| | |
|---|---|
| Model | |
| Typical input / output tokens | |
| Cost per call | |
| Calls per typical use | |
| Concurrency cap | n — **measured**, not assumed |

## 10. Changelog

| Version | Date | What the previous version got wrong |
|---|---|---|
| 1.0.0 | YYYY-MM-DD | initial |

> "Improved the wording" is not a changelog entry. **What it previously got wrong** is.
