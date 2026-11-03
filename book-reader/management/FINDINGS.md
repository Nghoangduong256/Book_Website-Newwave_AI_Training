# FINDINGS — defects found while doing something else

**Purpose: to stop a task growing while it is being verified.**

A one-hour task becomes a four-hour one the same way every time. One red test leads to a real
defect, which leads to a missing component, which leads to a new test case, which leads to a fix
that breaks something unrelated. Every individual step is defensible. The **sequence** was never
agreed with anybody, and the person who asked for the first thing never got the chance to say
"record that one, do it next week".

## The rule

A defect noticed while verifying something else goes **here**, in one line, and the work continues.

It is fixed inline **only if it blocks the thing being verified** — a red test standing between the
current change and its gate qualifies; a truncated id on a screen nobody asked about does not.

At the end of the task, the register is reported with the result. The requester prioritises. That is
the whole mechanism.

## How to write a row

`| id | date | where | what | blocks the current task? | est |`

Keep `what` to one sentence a reader can act on, and be honest in `blocks`: **"no" is the answer
that saves the time.**

Ids are `F-Pn-m` — phase, then a number that never gets reused.

---

## Open

| id | date | where | what | blocks? | est |
|---|---|---|---|---|---|
| F-P0-1 | YYYY-MM-DD | `path/to/file` | TBD | no | 30m |

## Fixed

| id | date found | date fixed | where | what | fixed in |
|---|---|---|---|---|---|

## Won't fix

| id | what | why not |
|---|---|---|
