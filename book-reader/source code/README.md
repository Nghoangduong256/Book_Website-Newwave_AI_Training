# <PROJECT> — source

The monorepo. **All code lives here; no design documents live here** — they are in `../plan/` and
`../management/`. The only documents in this tree are `CLAUDE.md`, this file, `.claude/**` and
`docs/adr/**`.

## Run it

```sh
cp .env.example .env     # fill in the secrets; .env is gitignored
docker compose up -d
make migrate && make seed
open http://localhost:8080
```

Then **read the containers' own output** (`make logs SVC=api`). `docker compose ps` showing healthy
is not evidence that anything works.

## The gate

```sh
make check          # lint + typecheck + tests + a real application boot
make check-live     # add this when the change touches the database, broker or object store
```

Run it before claiming any step is done, and **read its output**.

## Layout

```
backend/            FastAPI, Celery, Alembic
  app/core/         config, db, logging, errors, security
  app/shared/       cross-module services (audit, outbox, storage, jobs)
  app/modules/<m>/  router · schemas · service · repository · models · events · permissions · tests
  app/workers/      celery app, queues, schedules
frontend/           Next.js (App Router), TypeScript
  src/app/(app)/    authenticated routes
  src/features/<m>/ components, hooks, forms
  src/lib/api/      GENERATED client — never hand-edited
infra/              nginx and container configuration
ops/                operational scripts (responsive, a11y, load, evaluations)
docs/adr/           architecture decision records
.claude/            the rules, skills and agents the assistant works under
```

## Before you write code

Read [CLAUDE.md](CLAUDE.md). It is short, and it is the contract.
