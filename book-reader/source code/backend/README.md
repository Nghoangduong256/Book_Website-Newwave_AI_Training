# backend

FastAPI + Celery + Alembic. The gate is `make check` **from the repository root**, not from here.

## What P0 must create here

The Dockerfiles and the directory structure are in place; the application itself is P0's first
stage. In order:

| # | File | Note |
|---|---|---|
| 1 | `requirements.txt` / `requirements-dev.txt` | then `make lock` to produce `requirements.lock.txt` |
| 2 | `app/main.py` | the app factory, `create_app()` — `make boot` calls it |
| 3 | `app/core/config.py` | typed settings from the environment; **no literal reads of `os.environ` elsewhere** |
| 4 | `app/core/db.py`, `logging.py`, `errors.py` | the RFC 9457 handler lives in `errors.py` |
| 5 | `app/core/security/` | auth, the `require(...)` permission dependency |
| 6 | `alembic.ini` + `migrations/` | |
| 7 | `app/workers/celery_app.py` | queues: `default`, `ai`, `export`, `index` |
| 8 | `tests/conftest.py` | **the TestClient fixture is a context manager**, or startup is never covered |

## The one that is always skipped

```python
# tests/conftest.py
@pytest.fixture
def client():
    with TestClient(create_app()) as c:   # `with` is load-bearing
        yield c
```

Without the context manager, the lifespan never runs — so logging, pools and provider clients are
entirely untested, and the application can crash on its first log line with a fully green suite.
