# SlotHarbor — Base Rules

## Execution Protocol

1. **SEARCH FIRST** — `grep -rn "term" app/` before implementing anything new
2. **REUSE FIRST** — extend existing routers, models, and the `get_session` dependency before creating new
3. **READ BEFORE EDIT** — always read a file's full content before modifying it
4. **NO ASSUMPTIONS** — only use facts from files you've read, user messages, and tool results
5. **VERIFY** — after every change: app boots (`uvicorn app.main:app`) → any migration applies (`alembic upgrade head` on a scratch DB) → conventions match
6. **PLAN FIRST** — for multi-file changes, start in Plan mode; execute only after the plan accounts for all requirements
7. **FEEDBACK LOOP** — boot + migrate check after every change; self-correct before committing; never commit unverified work

## Core Conventions

- Package manager: `pip` (`pip install .` from `pyproject.toml`) — no lockfile; do not introduce poetry/uv/pipenv without a decision
- Python `>=3.12` — 3.12+ syntax is allowed (the Dockerfile pins `python:3.12-slim`)
- Async: NONE — synchronous SQLAlchemy `Session` + sync `def` handlers only (DECISIONS #1)
- Pydantic: v2 API (`model_dump`, `field_validator`, `ConfigDict`) — never v1

## Commands Reference

| Task | Command |
|------|---------|
| Dev server | `uvicorn app.main:app --reload` |
| Apply migrations | `alembic upgrade head` |
| New migration | `alembic revision --autogenerate -m "msg"` |
| Install | `pip install .` |

No lint / typecheck / test / build commands exist — do not invent or run phantom ones.

## Hard Constraints

- NEVER commit secrets, tokens, or `.env` values — config comes from the environment (`app/config.py` + `.env.example`)
- NEVER add dependencies without confirming they don't already exist in `pyproject.toml`
- NEVER use `AsyncSession` / `async def` handlers, or the legacy `session.query()` API
- NEVER return a SQLAlchemy model without a Pydantic `response_model`
