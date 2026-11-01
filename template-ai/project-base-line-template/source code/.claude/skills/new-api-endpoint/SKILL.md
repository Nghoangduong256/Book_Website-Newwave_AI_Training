---
name: new-api-endpoint
description: Add a REST endpoint to an existing backend module — router, schemas, service, repository, permission, tests, and the regenerated client. Use when adding any new route under /api/v1.
---

# Adding an API endpoint

## Before you write

1. The BD §4 row for this endpoint: method, path, permission, request and response DTOs.
2. The business rules it enforces (`BR-nn-mm`) and the functional requirement it satisfies.
3. Whether it mutates a versioned resource (then `If-Match` and 409) and whether it is audited.

## Steps

### 1 · Permission first
The string must already be in the catalogue and in the module's `permissions.py`. If it is not, stop
and use `add-permission` — that is its own reviewable change.

### 2 · Schemas
`{Entity}Create` / `{Entity}Update` / `{Entity}Read` / `{Entity}Summary`.

**On an update DTO every field is optional**, and the service applies only what was set. The form
sends what changed — with `exclude_unset`, a form that always sends every field turns an untouched
empty box into a deletion.

### 3 · Repository
All SQL here. **Scope becomes a predicate in the query**, never a filter after the fetch.

For a list: keyset pagination, whitelisted sort columns, `deleted_at IS NULL` by default.

### 4 · Service
The business rules, the transaction boundary, and the event — published through the outbox **inside**
the transaction.

A service method takes and returns DTOs, never a session from its caller, and never imports the web
framework.

### 5 · Router
```python
@router.post("/{id}/action", status_code=202)
async def do_action(
    id: UUID,
    body: ActionRequest,
    ctx: Context = Depends(require(P.RESOURCE_ACTION, scope="assigned")),
    svc: Service = Depends(get_service),
) -> JobHandle:
    return await svc.start_action(ctx, id, body)
```
Dependencies, one service call, a return. Nothing else.

**A state-changing action that carries its own validation and audit semantics gets its own action
endpoint**, not a generic `PATCH` — the two have different rules and different audit meaning.

### 6 · Long-running work
Over ~2 seconds: return `202` with a job handle, and the job persists its own phase so a screen can
show it. `202` is acceptance, not success.

### 7 · Tests
Happy path · validation failure with the right error `code` · 403 · **out of scope 404, not 403** ·
409 on version mismatch · audit entry if audited · **generated-SQL assertion** for a scoped list ·
an omitted-field-is-untouched test for a PATCH.

### 8 · Regenerate the client
Run the generator and commit the result. Never hand-write a fetch to our own API.

## Checklist

- [ ] Permission from a constant, catalogued, with the right scope
- [ ] Update DTO optional-by-field; the service applies only what was set
- [ ] Scope in the query, asserted in a test on generated SQL
- [ ] Out-of-scope single fetch returns 404
- [ ] `If-Match` + 409 if the resource is versioned
- [ ] Event through the outbox, inside the transaction
- [ ] Audit entry if the action is in the audited set
- [ ] RFC 9457 error with a stable `code`
- [ ] Generated client regenerated and committed
- [ ] `make check` run, and its output read
