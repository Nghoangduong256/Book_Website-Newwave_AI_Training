# Rule: Testing

What must be tested, and what "tested" means here. Source: `plan/BD/BD-00_OVERVIEW.md` §10 and each
module BD's §13.

The goal is not a coverage percentage. It is that **the failures we care about are caught before
review** — and that a green suite means something.

---

## R-T1 · What must have a test

1. **Every endpoint** — at minimum the happy path, one validation failure, and one permission-denied
   case.
2. **Every scoped list endpoint** — a test asserting on the **generated SQL** that the scope
   predicate is present. A test that only counts returned rows passes when the filtering happens in
   the wrong place, so it does not satisfy this rule.
3. **Every state machine** — one test per legal transition, plus one proving an illegal transition
   is rejected with the right error.
4. **Every business rule with an id** (`BR-nn-mm`) — a test that would fail if the rule were
   removed. The rule id appears in the test name.
5. **Every permission-scope pair** the module uses — `own`, `team`, `assigned`, `all` behave
   differently and each needs its own case.
6. **Every calculation** — with the worked values from the BD, plus the boundaries: zero, negative,
   division by zero, and the pre-baseline case where a denominator does not exist yet.
7. **Every migration** — applies forward on an empty database **and** on one holding representative
   data.
8. **Every seed** — running it twice produces no duplicates.
9. **Every screen** — the four mandatory states render: loading, empty, error-with-retry,
   permission-denied.
10. **Every background job** — succeeds · runs twice with the same input and produces the same result
    · retries a transient failure · does **not** retry a business-rule rejection · records failure
    somewhere a human will see it.
11. **Every user journey that crosses screens** — one end-to-end test.
12. **Reachability** — every screen in the index is reachable by clicking from the root, and the
    action that advances each state is reachable too. Assert reachability, not just that a URL
    renders.

## R-T2 · What does not need a test

13. Framework behaviour, generated code and pure pass-through wrappers. Do not test that the
    framework validates a schema.
14. Design-token values. Test that a component *uses* a token, not that the token equals a hex
    string.

## R-T3 · Test structure

15. `backend/tests/unit/` for service and pure logic with no database; `backend/tests/integration/`
    for anything touching the database, broker, object store or network.
16. Unit tests MUST NOT touch a database or the network.
17. Integration tests leave no state behind. **A test that passes only on a second run is a failing
    test**, and so is one that passes only on the first.
18. Fixtures are factory functions, never shared mutable module-level objects. Two tests must never
    depend on each other's data.
19. Taxonomy, role and permission fixtures derive from the same seed the application uses, so a seed
    change breaks tests loudly instead of leaving them stale.
20. **A fixture dated in the future owns page one of every list, forever.** Several resources have no
    delete endpoint, so residue cannot be cleaned up through the API. Date test fixtures in the past.
21. **A test that holds a session and also calls the API must commit between them**, or the API sees
    a database the test has not written to yet.

## R-T4 · Naming and intent

22. Test names state the behaviour and, where applicable, the requirement id:
    `test_pm_cannot_read_unassigned_project_returns_404`,
    `test_BR_08_04_only_approved_hours_feed_evm`.
23. One assertion subject per test. If the name needs "and", split it.
24. **A test MUST fail for the reason it claims.** Break the code deliberately, confirm the test
    catches it, restore. A test that has never failed proves nothing, and this step is not optional.
25. **Never assert on a formatted string you have not printed.** Locale output separates with
    non-breaking spaces, browsers serialize tiny durations in scientific notation, and a bounding box
    is fractional. Print the actual value once and copy it; the default assumption is that the
    formatter is right and the expectation is wrong.

## R-T5 · Security tests are mandatory

26. At least one test proves a user with a narrower scope cannot see another's records via the list
    endpoint.
27. At least one test proves a single-record fetch outside scope returns **404, not 403**.
28. For any module touching a knowledge base, at least one test proves a permission-filtered
    retrieval excludes a restricted record — **including that its content does not appear in a
    generated answer.**
29. Every audited action has a test asserting the entry was written with the right actor and entity.

## R-T6 · Gates

30. Lint, typecheck and tests pass on both sides before a pull request is opened. CI runs the same
    commands — a local pass is expected, not a surprise.
31. **A failing test is never skipped or marked expected-failure to get a build green.** Fix it, or
    revert the change that broke it. Skipped tests are counted and explained at every gate.
32. Flaky tests are bugs. Quarantining one requires an issue and an owner, not a retry decorator.
33. **Never pipe a command whose exit code matters.** A pipeline reports the *last* command's status,
    so a failing gate behind a `grep` looks green. Run it, capture the status, then filter the saved
    output. (`grep -c` also exits non-zero when the count is zero — a clean lint that reads as a
    broken command.)
34. **One live suite at a time.** Two runs against a shared database make each other lie.

## R-T7 · Data used in tests

35. No production data in tests or fixtures, ever — including anonymized exports.
36. No real customer names, employee names or contract values. Use obvious placeholders.

## R-T8 · Testing AI features

37. **The business logic is tested with a fake provider.** Every rule, every state transition and
    every failure path must be reachable with no API key configured and no money spent. A feature
    that cannot be tested without a provider is a feature that will not be tested.
38. **Quality is a separate measurement from correctness.** A schema-valid response proves the
    plumbing works and says nothing about whether the answer is right. Quality needs an evaluation
    set with expected outputs and a metric — see `ai-engineering.md` R-AI7.
39. **A cached result does not exercise a fixed adapter.** If a cache keys on the adapter's *name*
    rather than its version, a rebuilt worker serves the pre-fix output and the test proves nothing.
    Clear the cache row, or key it on the version.
40. Record the prompt version a test was written against. A prompt change that breaks an assertion
    is information, not noise.
