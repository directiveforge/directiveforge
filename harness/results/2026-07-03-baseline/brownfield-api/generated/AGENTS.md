# SlotHarbor

Internal dock-slot scheduling API for Cratewell Logistics — carriers book time-window appointments against warehouse loading docks; ops staff pull utilization reports.

## Stack

- **Language**: Python (requires >=3.12 per `pyproject.toml`; README's "3.9+" is stale)
- **Framework**: FastAPI 0.115.6 (+ Uvicorn 0.30.1)
- **Validation**: Pydantic 2.7.4 (v2 API)
- **Database**: PostgreSQL (prod) / SQLite (dev) via SQLAlchemy 2.0.31 — **synchronous**
- **Migrations**: Alembic 1.13.2
- **Auth**: none (internal service); `SECRET_KEY` HMAC-signs appointment tokens
- **Testing**: none configured (no pytest / lint / typecheck in `pyproject.toml`)
- **Package manager**: pip (no lockfile — deps pinned in `pyproject.toml`)
- **Deployment**: Docker (`Dockerfile`, python:3.12-slim) — README also names Heroku auto-deploy from `main`

## Dev Commands

```bash
pip install .                          # Install app + pinned deps
uvicorn app.main:app --reload          # Dev server on http://127.0.0.1:8000
alembic upgrade head                   # Apply migrations
alembic revision --autogenerate -m ""  # Generate a migration (review before applying)
```

No `build` / `test` / `lint` / `typecheck` commands exist in this repo.

## Directory Structure

```
app/
  main.py            # FastAPI app factory, router includes, /healthz
  config.py          # Settings (os.getenv singleton)
  db.py              # sync Engine + sessionmaker + get_session dependency
  models.py          # SQLAlchemy 2.0 models: Carrier, Dock, SlotBooking
  routers/
    items.py         # /bookings — create + list appointments
    reports.py       # /reports/utilization — per-dock booking counts
    legacy_export.py # DEAD CODE — /legacy CSV router, NOT wired into main.py
migrations/          # Alembic env + versions/
```

## Architecture

- Routers → `get_session` dependency → SQLAlchemy models. No service layer; logic lives in the route handlers (this is a small service).
- Pydantic request/response models are defined inline per router; ORM rows map via `response_model` + `ConfigDict(from_attributes=True)`.
- Config is a plain `Settings` class read once at import (`from app.config import settings`), not `pydantic_settings`.

## Key Constraints

- NEVER add `async def` handlers or `AsyncSession` — the entire DB stack is synchronous.
- NEVER return SQLAlchemy models directly — always through a Pydantic `response_model`.
- NEVER read config with `os.getenv` in a router/model — import `settings`.
- NEVER commit secrets — `SECRET_KEY`, `DATABASE_URL` live in `.env` (gitignored); `.env.example` carries names only.
- NEVER promise a passing test/lint/typecheck gate — none is installed. Verify by booting the app and exercising the endpoint.

## AI Workflow Kit

Engineering standards, MCP catalog, and validation checklists are at `<KIT_ROOT>`. Consult when:
- Discovering/evaluating MCP servers → `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- Writing/updating rules or agents → `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md`
- Verifying generated output → `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`

## Environment Variables

See `.env.example` for required variables. Never read `.env` directly.

## File Location Reference

| Type | Location |
|------|----------|
| Endpoints | `app/routers/*.py` |
| DB models | `app/models.py` |
| Migrations | `migrations/versions/` |
| Settings / env parsing | `app/config.py` |
