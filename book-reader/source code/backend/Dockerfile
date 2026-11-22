# Production image. Source is COPIED IN, not mounted — which is why a backend edit needs
# `docker compose build api` before it exists in the container. Recreating the container
# restarts it from the existing image and changes nothing (R-W9).
FROM python:3.13-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.lock.txt ./
RUN pip install --require-hashes -r requirements.lock.txt

COPY app ./app
COPY migrations ./migrations
COPY alembic.ini ./

# Not root. A container that runs as root is one container escape from a host compromise.
RUN useradd -m -u 10001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
