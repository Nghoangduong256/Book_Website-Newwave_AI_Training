# Rule: Working Method

How to work on this repository without wasting time.

The other rules (`coding-conventions`, `security`, `testing`, `ai-engineering`) govern *what* to
produce. This one governs *how to get there* — because on a project of this shape the code is rarely
the expensive part. **The diagnostic loops are.**

Every rule here is a trap that is invisible from the code. As the project runs, add yours: a rule
earns its place by costing somebody a day.

---

## R-W1 · Run the gate, and make the gate cheap

1. Run `make check` before claiming any step is done. It is lint, typecheck, tests **and a real
   application boot**, and it is fast because the dependency set is cached in a dev image.
2. Never run a one-off `docker run python:… pip install -r requirements.txt` to check something.
   That reinstalls the whole pinned dependency set — 60–90 seconds **before a single check runs**.
   Use `make check`, `make test`, `make shell`.
3. After changing dependencies, run `make lock`. It invalidates the dev image stamp, so the next
   gate rebuilds once.
4. Use `make check-live` when a change touches the database, broker or object store.

## R-W2 · Passing tests are not a running system

5. A step that adds or changes anything on the startup path is not done until the application has
   **actually started**. `make boot` does this; `make check` includes it.

   This is not belt-and-braces. A test client used without a context manager never runs the
   lifespan — so logging, pools and provider clients are entirely uncovered, and the application can
   crash on its first log line with the whole suite green.
6. **After changing container configuration, read the container's actual output.** `docker compose
   ps` showing `healthy` is not evidence: a proxy answers its own health route locally without ever
   touching an upstream, and will report healthy while returning 502 for every route.

## R-W3 · Verify library APIs; do not recall them

7. Before calling an unfamiliar function, attribute or config key, confirm it exists **in the
   installed version**:
   ```sh
   make shell
   python -c "import <lib>; print([a for a in dir(<lib>.<Thing>) if not a.startswith('_')])"
   ```
   A guessed name costs a full rebuild-and-rerun cycle to discover.
8. Do not add a configuration directive to fix a problem it does not address. **If you cannot state
   precisely what a directive does, look it up or leave it out.**
9. When a dependency's behaviour is the question, prove it with a five-line script rather than
   reasoning about it.

## R-W4 · Diagnose with data, not with theory

10. When an observation contradicts your model, run the **cheapest experiment that distinguishes the
    possibilities.** Do not iterate on explanations — one command settles what twenty minutes of
    theorising leaves ambiguous.
11. Change one variable per experiment.
12. **Before diagnosing a failure in your own probe, confirm the probe is sound.** Investigating
    correct behaviour because the test harness was wrong is a common and expensive way to spend an
    afternoon.

## R-W5 · Read the target before editing it

13. Read the region you are about to modify, not just the filename or a grep hit. A row inserted
    under a heading that turned out to be *inside a fenced code block* edits a template, not a
    document.
14. Prefer a targeted edit over a scripted string replacement when a single occurrence is intended.
    **A script that silently matches nothing, or matches the wrong instance, is worse than an edit
    that fails loudly.**
15. **A scripted edit must assert on the result, not on the anchor it matched.** First-match
    replacement edits the wrong call site when the anchor is not unique; pick a unique anchor, and
    `git diff` after.

## R-W6 · Record a finding once, in the right place

16. When execution contradicts a design document, write the ADR **at that moment**. Batching it to
    the end of the stage means re-deriving the reasoning from memory, and the details are gone.
17. State what verification actually showed, **with the output** — not that verification was
    performed. `PROGRESS.md` is read by the next session to decide what to trust.
18. If a trap is not discoverable from reading the code, it belongs in a rule or the `CLAUDE.md`
    never-do-this table, not only in an ADR. An ADR explains a past decision; **a rule prevents a
    future mistake.**

## R-W7 · Use the gate that exists, and read its exit code

19. One command, one exit code. Do not hand-chain `tsc | grep …; eslint | grep -c …` — that chain
    produces false failures and hides real ones.
20. **Never pipe a command whose exit code matters** (see `testing.md` R-T6 §33).

## R-W8 · A change to a shared component is a change to every test that renders it

21. Adding a required context, provider or prop to a shared component breaks every existing test
    that renders it. **Update the test harness in the same change**, not after the suite goes red.
22. The harness supplies the real providers and the real string catalogue, never stubs. A component
    rendering a raw key because the key does not exist must fail a test — and it cannot if the test
    invents its own dictionary.

## R-W9 · Recreating a container is not rebuilding its image

23. `docker compose up -d --force-recreate <svc>` restarts from the **existing image**. Code changed
    on disk is not in it. Only `docker compose build <svc>` puts it there — and the two look
    identical from outside, because the service comes up healthy and serves.
24. After changing anything the container's behaviour depends on, **assert the new value from inside
    the running process**:
    ```sh
    docker compose exec api python -c "from app.core.config import settings; print(settings.X)"
    ```
    `exec api sh -c 'echo $VAR'` proves only that the variable was passed. It says nothing about
    whether any code read it.
25. When a fix "does not work", **check that the fix is deployed before changing it again.**
26. **A stale image is a data-integrity hazard, not only a behavioural one.** A worker on an old
    image writes *well-formed wrong rows* that outlive the container, and nothing looks broken: the
    batch reports success and the rows pass every constraint. After rebuilding, **ask what the old
    image wrote while it was running** — a nightly batch had a whole night to write it.

    The tell that names this in one query: *two code paths that cannot disagree, disagreeing.* When
    stored data contradicts the code that supposedly wrote it, compare rows by **when** and by
    **which process**, before reading the code again.

## R-W10 · Bound every wait loop

27. Any polling loop has a **maximum iteration count** and fails loudly when it is exhausted. An
    unbounded poll waiting for something that was never dispatched costs a day and looks like work.
28. Before waiting for a job, **assert it was dispatched.** Most "it never finished" investigations
    end at "it never started".

## R-W11 · A dropped return value becomes a lie

29. When a function computes a diagnosis, a count or a reason and the caller discards it, the system
    reports "nothing changed" — and that is indistinguishable from the real thing. If a value is
    worth computing, it is worth returning, logging or persisting.

## R-W12 · Two verification tiers

30. **Per step:** the cheapest gate that can fail — seconds. **Per stage:** one sweep — the live
    suite, the browser journey, the responsive check.
31. Never launch the expensive gate to find a typo.

## R-W13 · A fix for a development path must not reach a product path

32. A proxy rule, a dev-server setting or a test shim that changes behaviour in development must be
    scoped so it **cannot** apply in production. A dev-only workaround that leaked into the product
    once broke the language switch for every user, and nothing in the change looked product-facing.

## R-W14 · The working tree may hold somebody else's work

33. Before committing, check what is actually modified. Files you never touched showing as modified
    means another session or tool is active in the same tree. **Scope every `git add` to the files
    you changed; never `git add -A`.**

## R-W15 · Put the remedy where the problem is stated

34. A correct instruction to go and look somewhere else is still unfinished work. If a rule, a
    document or an error message names a problem, the fix belongs next to it — not in a different
    file the reader has to know to open.

## R-W16 · When a screen is unreadable, check the DTO

35. A screen showing a uuid, a code or a blank where a name belongs is usually a serializer that
    never included the readable value. **The value is almost always already in the database.** Check
    the DTO before adding a lookup, a join, or a second request.
