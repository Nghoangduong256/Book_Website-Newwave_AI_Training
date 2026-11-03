# Getting started — a new project from this baseline

Target: in one day you have a stack that boots, a strategy a stakeholder can argue with, and an
assistant that knows your rules. Work top to bottom; each step is independently useful.

---

## Step 0 · Copy and rename

```sh
cp -R "project-base-line-template" "<PROJECT>"
cd "<PROJECT>"
git init && git add -A && git commit -m "chore: baseline from project template"
```

Then replace the placeholders. The sweep that catches most of them:

```sh
grep -rn "<PROJECT>\|TBD\|TODO" --include="*.md" . | head -50
```

## Step 1 · Decide the shape before the stack (half a day)

Fill in, in this order, and stop at the first one you cannot answer — that is a question for a
stakeholder, and it belongs in `management/OPEN-DECISIONS.md` rather than in your head:

1. `plan/STRATEGY.md` §1 Executive summary, §2 Scope, §3 Lifecycle flow.
2. `plan/STRATEGY.md` §12 Locked decisions — the answers you already have, dated and attributed.
3. `management/OPEN-DECISIONS.md` — everything you do not have. Every row carries a
   **recommendation**, so the default path is "accept and proceed" rather than "wait".

**Do not start RD until §2 Scope is stable.** An RD written against moving scope is rewritten.

## Step 2 · Make the stack real (1–2 hours)

The data tier runs immediately — nothing in it depends on your code:

```sh
cd "source code"
cp .env.example .env            # fill in the secrets; .env is gitignored
docker compose up -d postgres valkey minio
docker compose ps
```

**`api`, `worker` and `frontend` do not start yet**, and that is expected: their Dockerfiles are
here, but the application they build does not exist. `backend/README.md` and `frontend/README.md`
each list what P0 creates, in order. The first milestone is an app factory that answers `/health`:

```sh
docker compose up -d api
curl -fsS localhost:8000/health && echo OK
```

Then **read the container's own output** (`make logs SVC=api`), not `docker compose ps`. A proxy
reports healthy while returning 502 for every route, because its health route is answered locally
without ever touching an upstream. (`.claude/rules/working-method.md` R-W2.)

## Step 3 · Point the assistant at the rules (30 minutes)

1. Read `source code/CLAUDE.md` end to end once. It is the contract.
2. Fill in its §2 directory contract, §5 namespace allocation table, and §10 verified stack.
3. Skim `.claude/rules/` — four files, each enforceable rather than advisory.
4. Delete the skills you will not use. A skill that does not match your stack is worse than no
   skill: the agent will follow it anyway.

## Step 4 · Write the first module's RD and BD

Copy `plan/RD/RD-TEMPLATE.md` → `plan/RD/RD-01_<module>.md`, and the same for BD. Then:

- Every functional requirement gets an id: `FR-01-01`.
- Every business rule gets an id: `BR-01-01`, and later, a test named after it.
- The BD's §14 traceability table maps each id to a BD section. **Fill it as you write, not at the
  end** — a table filled at the end is a table that rationalises what was built.

## Step 5 · Write the phase plan, then build

Copy `plan/Implementation plan/IMPL-PLAN-TEMPLATE.md` → `01_IMPL_PLAN_P0.md`.

Each stage names `Read / Create / Verify / Manual check`, and a stage is done when **its
verification has been run and its output read** — not when it has been written.

## Step 6 · Close the phase honestly

Copy `management/Px-EXIT-GATE.md` → `management/P0-EXIT-GATE.md`. The gate states a verdict first
and the evidence after, and §9 — *what this gate could not do* — is mandatory and never empty.

---

## The five habits that save the most time

| Habit | What it replaces |
|---|---|
| Run the cheapest gate (`make check`) before claiming anything is done | A reviewer finding a lint error |
| Verify a library's API in a shell rather than recalling it | A full rebuild cycle to discover a guessed name is wrong |
| Record a defect found on the way in `FINDINGS.md` and keep going | A task that silently triples in size |
| Update `PROGRESS.md` at every stage boundary | The next session re-deriving state from `git log` |
| Ask the question in `OPEN-DECISIONS.md` with a recommendation attached | Waiting on an answer that nobody knew was wanted |
