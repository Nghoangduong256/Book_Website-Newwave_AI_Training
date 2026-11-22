# Pn Implementation Plan — <Module / theme>

**Source documents:** `RD-nn_<module>.md` · `BD-Mnn_<module>.md` §2–§9, §13, §14 ·
`BD-00 §4` (layering) · `BD-02 §n` (shared tables) · `BD-03 §n` (security) ·
`management/OPEN-DECISIONS.md` #n
**Depends on:** P0…Pn-1 shipped.
**Written:** YYYY-MM-DD. 📋 **PLAN ONLY, NO CODE.**

---

## 0. How to use this document

Each stage names **Read / Create / Verify / Manual check**.

> **A stage is done when its verification has been run and its output has been read.** Not when the
> verification has been written. Not when the tests are green. Green tests and a healthy container
> both prove less than they appear to.

The property this phase must protect above all others — state it in one sentence, here, before any
stage:

> TBD.

---

## 1. What Pn delivers

| | Count | Note |
|---|---|---|
| Tables | n | prefix `<pfx>_` |
| Endpoints | n | every one with a permission dependency |
| Screens | n | each with four states and an entry point |
| Permissions | n | **catalogued before the first router** |
| Events | n | names from the catalogue |
| Jobs | n | queue, idempotency and visible phase each |
| Prompts | n | registered and versioned |
| Acceptance criteria | n | RD-nn §13 |

### 1.1 What this phase does *not* build

Name the absences deliberately, so a later reader knows they were scheduled rather than forgotten.

### 1.2 Entry conditions — blockers

| # | Blocker | Why it blocks | Who owns it |
|---|---|---|---|

Two that block almost every phase of this shape:

- **Permissions not in the catalogue.** A permission string invented at the point of use is
  prohibited; cataloguing it is its own reviewable change and lands *before* stage 1.
- **A decision nobody has made.** If `management/OPEN-DECISIONS.md` has an unanswered row that this
  phase consumes, say whether it blocks the *build* or only the *first real row of data*. Those are
  very different, and conflating them stalls a phase that could have proceeded.

### 1.3 Assumptions checked in the code — measured YYYY-MM-DD

**Check them; do not recall them.** Every row here is the result of actually looking.

| # | Assumption | Checked where | Result |
|---|---|---|---|
| 1 | TBD | `path/to/file.py` | ✅ / ⚠️ / ❌ with what was found |

### 1.4 The assumptions that did not hold

What the check above changed about the plan. This section is the reason the check is worth doing.

---

## 2. Decisions and build order

| # | Decision | Rationale |
|---|---|---|
| D1 | TBD | |

**Build order and why it is this order:** dependencies, the riskiest unknown first, and the screen
that must exist before anything else can be configured.

---

## 3. Stages

### S1 · <name>

**Read:** the BD sections this stage implements — named individually, by section number.
**Create:**
- `backend/app/modules/<m>/models.py` — entities from BD §2
- migration `pn_<mod>_001`
- …

**Verify:**
```sh
cd backend && make check            # lint, typecheck, tests, and a real application boot
make check-live                     # when the change touches Postgres / broker / storage
```
**Manual check:** what a human opens, clicks, and sees. Name the route and the expected text.

**Done when:** one sentence stating the observable property, not the activity.

---

### S2 · <name>

…

---

### Sn · Exit gate

Walk `management/Pn-EXIT-GATE.md`. Produce evidence, not assertions:

- every acceptance criterion exercised by a test that names it
- every screen built, with four states, measured at 375px and 768px
- every endpoint's permission dependency asserted as one table
- the deployed image rebuilt and verified current — recreating a container is not rebuilding it
- the journey walked in a browser
- the findings register reported with the result

---

## 4. Screen coverage

Checked programmatically from S1, not by inspection at S10.

| Screen | Route | Built at | States | Entry point |
|---|---|---|---|---|

---

## 5. Acceptance-criteria ownership

| Criterion | Stage | Asserted by |
|---|---|---|

---

## 6. What this plan deliberately does not contain

And what the companion BD must settle before the stage that needs it.
