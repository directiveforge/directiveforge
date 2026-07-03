# Generator Preset: FastAPI

> Supplement for `PROJECT_SETUP_PROMPT.md` when the target project uses Python/FastAPI.
> Detected by: `fastapi` in `requirements.txt` / `pyproject.toml` / `uv.lock`.

---

## Stack Detection Signals

```bash
# Confirm FastAPI and supporting stack
grep -i "fastapi\|pydantic\|sqlalchemy\|alembic\|uvicorn" requirements.txt pyproject.toml 2>/dev/null
ls alembic/                    # Alembic migrations present
grep -r "AsyncSession\|async def" app/  # async vs sync patterns
grep -r "BaseModel" app/        # Pydantic v1 vs v2 usage
python --version               # Python version
```

## CLAUDE.md Additions

Add to Architecture section:

```markdown
## Architecture
- **Entry**: `main.py` or `app/main.py` — FastAPI app instance, router includes, lifespan
- **Routing**: `app/routers/` — one file per domain (users.py, items.py); prefix + tags pattern
- **Schemas**: `app/schemas/` — Pydantic models for request/response; separate from DB models
- **Models**: `app/models/` — SQLAlchemy ORM models; NEVER use these in API responses directly
- **Services**: `app/services/` — business logic; routers call services, services call repositories
- **DB**: SQLAlchemy async sessions via `app/db/session.py`; Alembic for migrations
- **Config**: `app/core/config.py` — `pydantic_settings.BaseSettings` reads from `.env`
```

## Cursor Rules Additions

### `app/` glob rule additions

```markdown
## FASTAPI CONVENTIONS
- ALWAYS use Pydantic models for request/response — never dict or raw JSON
- ALWAYS use async def for route handlers — never blocking I/O in async context
- NEVER use SQLAlchemy models as response schemas — map to Pydantic schemas
- Dependency injection: use Depends() — never instantiate DB session or services inline

## PYDANTIC (v2)
- Use model_validator, field_validator — not @validator (v1 deprecated)
- Use model.model_dump() — not model.dict() (v1 deprecated)
- Define Config via model_config = ConfigDict(...) — not inner class Config

## ERROR HANDLING
- Raise HTTPException for expected errors — never return error dicts
- Use exception handlers for unexpected errors (register on app)
- Log with structured logger — never bare print()

## ASYNC / DATABASE
- ALWAYS use AsyncSession — never sync Session in route handlers
- NEVER run CPU-bound work in async def — use run_in_executor or background task
- Use select() from sqlalchemy.future — not legacy query API
```

### Common Pitfalls for CLAUDE.md

```markdown
## Common Pitfalls
- Pydantic v2 breaking changes: .dict() → .model_dump(), @validator → @field_validator
- SQLAlchemy async: use `await session.execute(select(...))` — not `session.query()`
- Alembic auto-generate misses: check migration files — it doesn't detect all column type changes
- Background tasks (BackgroundTasks) run after response — don't use for critical data writes
- lifespan context manager replaces deprecated @app.on_event startup/shutdown
```

## MCP Additions

If project uses PostgreSQL:

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "${DATABASE_URL}"
  }
}
```

## Recommended Skills

- `migration/SKILL.md` — Alembic workflow: generate → review → apply
- `deployment/SKILL.md` — Docker/cloud deployment with environment variable management

## Recommended MCP Servers

- **Context7** — always (FastAPI + Pydantic v2 API is frequently hallucinated as v1)
- **GitHub** — always
- **PostgreSQL MCP** — if using PostgreSQL (read-only schema inspection is safe)

## Key Files to Check During Analysis

```
main.py / app/main.py        # App factory, router registration, lifespan
app/core/config.py           # Settings class — env vars and their types
app/db/session.py            # Async session factory, engine config
alembic/env.py               # Migration environment — target metadata
alembic/versions/            # Check for pending migrations
pyproject.toml / setup.cfg   # Python version, dependencies
.env.example                 # Required environment variables
Dockerfile                   # Base image, entrypoint, port
```

## Python Package Manager Detection

```bash
# Check which package manager is in use
ls uv.lock     → uv     → commands use `uv run`, `uv add`
ls poetry.lock → poetry → commands use `poetry run`, `poetry add`
ls Pipfile     → pipenv → commands use `pipenv run`, `pipenv install`
ls requirements.txt (only) → pip → commands use `pip install`
```
