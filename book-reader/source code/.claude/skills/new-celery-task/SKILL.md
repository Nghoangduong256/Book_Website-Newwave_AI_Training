---
name: new-celery-task
description: Add a background task — queue choice, idempotency, retries, timeouts, the persisted job phase the UI reads, and failure behaviour. Use for anything that cannot complete inside a request.
---

# Adding a background task

## The property this skill exists to protect

> **A job the user started and cannot see is indistinguishable from a job that never ran.**

Most background-job defects are not in the job. They are in the fact that nothing on screen knows it
exists.

## Steps

### 1 · Choose the queue
`default` (seconds) · `ai` (minutes, provider-bound, concurrency-capped) · `export` (CPU/render) ·
`index` (embedding and search). **A long job never shares a queue with a fast one** — a twenty-minute
generation in front of a 200 ms export means the export never runs.

### 2 · Name it
`{module}.{action}`, registered in the module's task list.

### 3 · Make it idempotent
It will run twice. Either it is naturally idempotent, or it guards on a state it checks and sets in
the same transaction. "It only runs once" is not a design.

### 4 · Persist the phase — before dispatch
The **request** writes `queued` *before* it dispatches, because the worker may start before the
request returns. The worker writes `running`, then `done` or `failed`.

A nullable JSONB column carrying `{phase, started_at, finished_at, counts, detail}` is the cheapest
shape that works: no enum migration when a phase is added, and it carries the *sentence* a failure
needs alongside the phase.

**A job blocked on something else must say what it is waiting for.** "Waiting for the virus scan,
check 3 of 20" and "extracting" send a user to completely different places.

### 5 · Bound everything
A timeout, a bounded retry policy, and a terminal state. **A job that gives up sets `failed` with a
sentence naming the likely cause and the next step** — never `pending` forever, which reads
identically to work in flight.

Retry transient failures. **Never retry a business-rule rejection** — it will fail identically, three
more times, and spend money doing it.

### 6 · Render it
The screen that can start the job shows its phase, polls while something is in flight (3–5 s, not
1 s), and stops by itself when the data says the work has settled.

**Never invent a percentage.** A real fraction — "7 of 12 sections" — or an indeterminate indicator
with no `aria-valuenow`.

### 7 · Make failure reach a human
A failed job that only logs is a failed job nobody knows about. Record it where it is visible, and
emit the event that notifies.

### 8 · Tests
Succeeds · runs twice with the same input and produces the same result · retries a transient failure
· does **not** retry a business-rule rejection · writes each phase · records failure visibly.

## Checklist

- [ ] Queue chosen deliberately; long work is not in front of fast work
- [ ] Name is `{module}.{action}`
- [ ] Idempotent, or guarded in a transaction
- [ ] `queued` written by the request, before dispatch
- [ ] Every transition written, including the non-progress ones
- [ ] Timeout, bounded retries, terminal state with an actionable sentence
- [ ] Screen renders the phase and polls only while in flight
- [ ] No invented percentage
- [ ] Failure is visible to a human, not only in a log
- [ ] **The worker image was rebuilt before the live check** — recreating a container is not
      rebuilding it, and a stale worker writes well-formed wrong rows
