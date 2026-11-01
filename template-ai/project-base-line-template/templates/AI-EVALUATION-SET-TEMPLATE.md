# Evaluation Set — `<feature>`

> **Prompt:** `<module>_<purpose>` v1.0.0 · **Created:** YYYY-MM-DD
> **Labelled by:** <name, role> — a domain reader, **not the prompt's author**
> **Cases:** n · **Last run:** YYYY-MM-DD → <score>

**Why this exists.** Without it, a prompt change cannot be distinguished from a prompt regression,
and "it seems better" is the only available evidence. An AI feature that ships without one has no way
to get worse visibly.

---

## 1. What is being measured

| | |
|---|---|
| Task | what the model produces |
| Metric | exact match per field / recall@k / rubric score — and **why this metric** |
| Passing | the score at which the feature is acceptable |
| Regression threshold | how many points of loss fail a build — **the owner's decision**, not engineering's |

## 2. What this set does **not** measure

The honest half. For example: it contains no Japanese documents, so extraction quality on Japanese
prose is unmeasured; or the embedding provider in this installation is a fake, so clustering
behaviour is unmeasured whatever the run reports.

**State this at every gate.** A green run that implies a property it never tested is worse than no
run.

## 3. Composition

| Category | Cases | Why included |
|---|---|---|
| Typical | n | the common path |
| Edge | n | the cases the prompt text argues about |
| **Adversarial** | n | prompt-injection attempts, contradictory input, empty input |
| **Negative** | n | input where the right answer is "I cannot tell" |

The last two decide whether the feature fails safely. A set of only typical cases measures a demo.

## 4. Storage

`ops/evaluations/<name>.jsonl`, one case per line:

```json
{"id": "case-001", "input": {...}, "expected": {...}, "category": "typical", "note": "why this case"}
```

Versioned with the prompt. **Never contains production data, real customer names or real contract
values.**

## 5. Running it

```sh
python ops/evaluate_<feature>.py --prompt-version 1.0.0
```

Reports per-case results, the aggregate, and the delta against the last recorded run.

## 6. History

| Date | Prompt version | Model | Score | Delta | Note |
|---|---|---|---|---|---|
| YYYY-MM-DD | 1.0.0 | | | — | baseline |

## 7. Cases needing review

Cases where the label is disputed or the expected output may be wrong. **A wrong label makes a
correct model look broken**, and it will send someone to fix a prompt that was already right.

| Case | Issue | Raised | Resolved |
|---|---|---|---|
