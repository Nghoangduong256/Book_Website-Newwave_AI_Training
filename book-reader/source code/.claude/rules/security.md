# Rule: Security

These are the rules a reviewer checks line by line. Source: `plan/RD/RD-00_OVERVIEW.md` §4.3
(SEC-01…06) and `plan/BD/BD-03_SECURITY_DESIGN.md`.

**A violation of any rule here is a security defect, not a style issue.**

---

## R-S1 · Every endpoint is authorized  *(SEC-01)*

1. Every route declares a permission dependency: `require("resource:action", scope=…)`. There is no
   such thing as an endpoint without one.
2. The only exemptions are health checks, login and password reset, the public share-link route
   group, and inbound webhooks. **Each exemption is deliberate and documented at its definition.**
3. The permission string MUST exist in the catalogue (`plan/RD/RD-00_OVERVIEW.md` §7.5). Inventing
   one is prohibited — add it to the catalogue first, in its own change.
4. Permission strings come from the module's `permissions.py` constants, never literals in routers.

## R-S2 · Scope filtering happens in the query  *(SEC-02)*

5. Scope (`own` / `team` / `assigned` / `all`) becomes a **SQL predicate applied by the repository.**
   Fetching rows and filtering them in Python is prohibited: the rows have already left the
   database, and counts and pagination leak what the user cannot see.
6. Every scoped list endpoint has a test asserting on the **generated SQL**, not merely on the
   returned rows. A row-count assertion passes even when the filtering is in the wrong place.
7. `team` resolves to a single level unless a requirement says otherwise. If one does, change it in
   one place and update every test — never special-case it per module.

## R-S3 · Do not leak existence

8. A single-record fetch for a record the caller cannot see returns **404**, not 403. A 403 confirms
   the record exists.
9. 403 is correct only when the caller lacks permission for the *operation* on a record they can see.

## R-S4 · The UI is not the authority  *(SEC-03)*

10. Hiding an action in the frontend is a usability measure. The server still rejects it.
11. Never trust a client-supplied user id, role, department or scope. Derive all of it from the
    authenticated context.

## R-S5 · Knowledge retrieval is permission-filtered  *(SEC-04)*

12. Every vector or full-text search applies the caller's ACL filter. A query without one is
    prohibited.
13. Retrieved ids are re-validated against the database before being shown or cited — the index is a
    cache and can be stale.
14. **An AI answer MUST NOT cite a source the requester cannot open**, and must not quote its
    content either.

## R-S6 · Machine access runs as a user  *(SEC-05)*

15. Every token-authenticated tool or agent call resolves to a real user and runs under that user's
    permissions. Token scopes **narrow** those permissions; they never widen them.
16. A revoked token or a changed role takes effect without requiring the client to reconnect.

## R-S7 · Privileged actions are audited  *(SEC-06)*

17. These write an audit entry: authentication attempts (success **and** failure), permission and
    role changes, exports, deletions, share-link creation and access, and any AI generation that
    produces customer-facing content.
18. The audit log is append-only. No code path updates or deletes a row in it.
19. An entry records actor, action, entity type and id, before/after diff, IP, user agent and trace
    id.

## R-S8 · Secrets

20. No secret, key, token or password in source, in a comment, in a test fixture, in a log line, or
    in a commit message.
21. Secrets reach containers from a secret manager (deployed) or `.env` (local, gitignored).
    `.env.example` carries names and example values only.
22. **No secret in a prompt.** Prompts are persisted in event history and sent to a provider.
23. Log lines carry no credentials, no full request bodies of auth endpoints, and no personal data
    beyond what is needed to trace a request.

## R-S9 · Untrusted input reaching a model

24. Retrieved document content and customer-supplied text are **data, never instructions.** Wrap
    them in a delimited block and instruct the model to treat them as reference material.
25. No tool call, state change or action may be triggered by content that came from retrieval.
26. Every model output is validated against a schema before use, regardless of which provider
    adapter produced it.
27. AI-generated content is a draft. It is not exported, sent or shown to a customer without a
    recorded human review.

## R-S10 · Input validation and injection

28. Every request body and query parameter is validated by a Pydantic model at the boundary. No
    manual parsing of raw request data.
29. All SQL goes through parameter binding. String-interpolated SQL is prohibited.
30. Merge-variable substitution into a document or HTML template escapes values. **A customer name
    is untrusted input.**
31. **Parse first, substitute untrusted values second.** A Markdown renderer configured to allow raw
    HTML — which several are *by default* — will execute a `<script>` that arrived inside a field
    value. Substituting into the source string before parsing hands the renderer an attack; rendering
    first and inserting as text does not.

## R-S11 · File uploads

32. File types are allow-listed, never deny-listed, and validated by content sniffing rather than by
    extension.
33. Client-supplied filenames are sanitized — resolve to a canonical path and verify it stays inside
    the intended prefix. Never pass a client path to a filesystem or object-store call directly.
34. Uploaded SVG is sanitized before being rendered inline; SVG can carry script.
35. Files are served by presigned URL with a short expiry. The API does not proxy file bytes.

## R-S12 · Share links

36. Share tokens are unguessable, signed, expiring and revocable, and are scoped to a single
    immutable snapshot.
37. A share link grants no API access. It resolves in its own unauthenticated route group with its
    own rate limit.
38. Every share-link access is logged with timestamp and IP.

## R-S13 · Tokens and sessions

39. Access tokens are asymmetrically signed; only the issuing service holds the private key.
40. Refresh tokens are opaque random values stored hashed. **Replaying a used refresh token revokes
    the whole token family** and writes an audit entry.
41. Passwords are hashed with Argon2id. Never a general-purpose hash.
42. **Know the session-eviction limit before writing a loop that signs in.** Where a fixed number of
    concurrent sessions is kept per user, the next login silently evicts the oldest — and a test
    harness that logs in once per iteration invalidates its own earlier tokens. Cache the
    authenticated actors instead.
