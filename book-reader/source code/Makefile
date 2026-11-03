# <PROJECT> — one entry point for every gate.
#
# The point of this file is R-W1: the gate must be CHEAP, or it does not get run.
# Everything here runs inside the cached dev image. Never `docker run python:… pip install -r …`
# to check something — that reinstalls the whole pinned dependency set before a single check runs.

COMPOSE ?= docker compose
BACKEND  = $(COMPOSE) run --rm --no-deps api

.DEFAULT_GOAL := help

.PHONY: help
help: ## show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

# ── the gates ──────────────────────────────────────────────────────────────
.PHONY: check
check: lint types test boot ## THE gate: lint + typecheck + tests + a real application boot

.PHONY: check-live
check-live: ## the gate against real services — use when the change touches db/broker/storage
	$(COMPOSE) run --rm api pytest -m "integration" -q

.PHONY: lint
lint: ## ruff
	$(BACKEND) ruff check app tests

.PHONY: fmt
fmt: ## ruff format
	$(BACKEND) ruff format app tests

.PHONY: types
types: ## mypy
	$(BACKEND) mypy app

.PHONY: test
test: ## unit tests only — no database, no network
	$(BACKEND) pytest -m "not integration" -q

.PHONY: boot
boot: ## start the application for real. Passing tests are not a running system (R-W2)
	$(BACKEND) python -c "from app.main import create_app; create_app(); print('BOOT OK')"

# ── development ────────────────────────────────────────────────────────────
.PHONY: shell
shell: ## a python shell in the dev image — verify a library's API here, do not recall it (R-W3)
	$(BACKEND) python

.PHONY: up
up: ## bring the stack up
	$(COMPOSE) up -d

.PHONY: logs
logs: ## follow a service's own output. `docker compose ps` healthy is NOT evidence (R-W2)
	$(COMPOSE) logs -f $(SVC)

.PHONY: rebuild
rebuild: ## REBUILD an image. Recreating a container does not put changed code in it (R-W9)
	$(COMPOSE) build $(SVC) && $(COMPOSE) up -d $(SVC)

# ── database ───────────────────────────────────────────────────────────────
.PHONY: migrate
migrate: ## apply migrations
	$(COMPOSE) run --rm api alembic upgrade head

.PHONY: migration
migration: ## autogenerate a migration — then READ AND CORRECT it before committing (R-C5 §22)
	$(COMPOSE) run --rm api alembic revision --autogenerate -m "$(M)"

.PHONY: migrate-check
migrate-check: ## prove metadata and database agree: a second autogenerate must be EMPTY
	$(COMPOSE) run --rm api alembic check

.PHONY: seed
seed: ## run seeds — idempotent, so running this twice must change nothing
	$(COMPOSE) run --rm api python -m app.cli seed

.PHONY: lock
lock: ## re-pin dependencies and invalidate the dev image stamp
	$(BACKEND) pip-compile --generate-hashes -o requirements.lock.txt requirements.txt
	$(COMPOSE) build api
