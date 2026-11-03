# Verified Stack

> **Fill this in at kickoff by checking each version, not by recalling it.** A guessed version number
> is discovered to be wrong at the worst possible moment — usually during a build, usually at the end
> of a day. Record the date it was verified, and re-verify at each major phase.
>
> Versions are pinned in lockfiles. This file is the human-readable record of *why* each pin exists.

**Last verified:** YYYY-MM-DD by <name>

---

## Backend

| Component | Version | Verified | Note |
|---|---|---|---|
| Python | | | |
| FastAPI | | | |
| Pydantic | | | |
| SQLAlchemy | | | 2.x style, typed |
| Alembic | | | |
| Celery | | | |
| psycopg | | | 3.x |
| pytest | | | |
| ruff | | | lint + format, one tool |
| mypy | | | |

## Frontend

| Component | Version | Verified | Note |
|---|---|---|---|
| Node | | | LTS |
| Next.js | | | App Router |
| TypeScript | | | |
| TanStack Query | | | server state |
| Zustand | | | UI state only |
| Tailwind CSS | | | |
| React Hook Form + Zod | | | schemas derived from generated types |
| Vitest | | | |
| Playwright | | | |

## Infrastructure

| Component | Version | Verified | Note |
|---|---|---|---|
| PostgreSQL | | | `uuidv7()` is native from 18 |
| Valkey / Redis | | | broker + cache |
| nginx | | | |
| Docker Compose | | | the `version:` key is obsolete |
| MinIO / S3 | | | same API both sides |

## AI

| Component | Value | Verified | Note |
|---|---|---|---|
| Primary model | `claude-opus-5` | | judgement-heavy tasks |
| Cheap model | `claude-haiku-4-5-20251001` | | classification, labelling, narration |
| SDK | | | |
| Embedding model | | | **dimensions are recorded with every stored vector** |
| Vector store | | | only if retrieval is in scope |

> Model ids are **configuration, never literals in business code.** A silently-updated model is an
> unannounced behaviour change, and it will be noticed first as an output-quality complaint.

## Upgrade policy

1. An upgrade is its own change, with its own ADR when behaviour could differ.
2. Re-verify the version is current at the moment of the upgrade.
3. Security patches are not deferred to a convenient phase.
4. Record the date each pin was last verified in this table — a pin nobody has looked at for a year
   is a pin nobody can defend.
