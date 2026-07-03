# SlotHarbor

Internal dock-slot scheduling service for Cratewell Logistics — carriers book time-window appointments against loading docks; ops staff pull utilization reports.

## Stack

- **Language**: Python (requires `>=3.12` per `pyproject.toml`; Docker image `python:3.12-slim`)
- **Framework**: FastAPI 0.115.6
- **Validation**: Pydantic 2.7.4 (v2 API)
- **Database**: PostgreSQL (prod) / SQLite (local dev) via SQLAlchemy 2.0.31 — **synchronous** sessions
- **Migrations**: Alembic 1.13.2
- **Server**: Uvicorn 0.30.1
- **Auth**: none (internal service); `SECRET_KEY` is an HMAC signing key for appointment tokens
- **Testing**: none configured (no test suite, no test runner in dependencies)
- **Package manager**: pip (`pip install .` — `pyproject.toml` + setuptools; no lockfile)
- **Deployment**: Docker container (`Dockerfile`, `python:3.12-slim`, runs `uvicorn app.main:app`)

## Dev Commands

```bash
uvicorn app.main:app --reload      # Start dev server (http://127.0.0.1:8000)
alembic upgrade head               # Apply DB migrations
alembic revision --autogenerate -m "msg"   # Generate a migration from model changes
pip install .                      # Install the package + dependencies
```

No build, lint, typecheck, test, or seed commands exist in this project — do not invent them.

## Directory Structure

```
app/
  main.py            # FastAPI app instance; includes items + reports routers; /healthz
  config.py          # Settings class — env vars read at import time (flat, no pydantic-settings)
  db.py              # SQLAlchemy engine + sessionmaker; get_session() request dependency
  models.py          # SQLAlchemy 2.0 declarative models: Carrier, Dock, SlotBooking
  routers/
    items.py         # POST/GET /bookings — create + list dock appointments
    reports.py       # GET /reports/utilization — per-dock booking counts
    legacy_export.py # /legacy CSV export — NOT wired into main.py (dead router)
migrations/          # Alembic env + versions/
  versions/0001_initial_schema.py
```

## Architecture

- Request flow: `app/routers/*` handlers → `get_session()` dependency → SQLAlchemy `Session` → `app/models.py`. There is no service or repository layer — routers query models directly.
- Pydantic request/response schemas are defined **inline inside each router file** (e.g. `BookingCreate`/`BookingOut` in `items.py`), not in a separate `schemas/` package.
- `app/config.py` reads env vars via `os.getenv` at import time into a flat `Settings` object — it does NOT use `pydantic-settings`.

## Key Constraints

- NEVER use `AsyncSession` or `async def` route handlers — this codebase is fully synchronous (`sqlalchemy.orm.Session`, sync `def` handlers). Match the existing style.
- NEVER return SQLAlchemy models directly without a Pydantic `response_model` — every endpoint maps to a `BaseModel` with `ConfigDict(from_attributes=True)`.
- NEVER store secrets in code — `SECRET_KEY`, `DATABASE_URL`, `WAREHOUSE_CODE`, `MAX_PAGE_SIZE` come from the environment (see `.env.example`).
- Run `alembic upgrade head` after pulling schema changes; migrations are the only schema source of truth. Alembic autogenerate misses some column-type changes — review every generated migration.

## AI Workflow Kit

Engineering standards, MCP server catalog, and validation checklists are at `<KIT_ROOT>`. Consult when:
- Discovering or evaluating MCP servers → `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- Writing or updating rules/agents → `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md`
- Verifying generated output quality → `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`

## Environment Variables

See `.env.example` for required variables. Never read `.env` directly.

## File Location Reference

| Type | Location |
|------|----------|
| API routers | `app/routers/` |
| ORM models | `app/models.py` |
| Inline request/response schemas | inside each `app/routers/*.py` |
| DB migrations | `migrations/versions/` |
| Runtime config / env vars | `app/config.py` |
