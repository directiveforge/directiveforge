# SlotHarbor — Base Rules

## Execution Protocol

1. **SEARCH FIRST** — `grep -rn "term" app/` before implementing anything new
2. **REUSE FIRST** — extend existing functions, patterns, and utilities before creating new
3. **READ BEFORE EDIT** — always read a file's full content before modifying it
4. **NO ASSUMPTIONS** — only use facts from files you've read, user messages, and tool results
5. **VERIFY** — after every change: boot the app (`uvicorn app.main:app`), apply any new migration, exercise the changed endpoint. No test/lint/typecheck gate exists yet.
6. **PLAN FIRST** — for multi-file changes, start in Plan mode; execute only after the plan accounts for all requirements
7. **FEEDBACK LOOP** — boot + migrate + manual-exercise after every change; self-correct before committing; never commit unverified work

## Core Conventions

- Package manager: `pip` (deps pinned in `pyproject.toml`; no lockfile) — do not introduce poetry/uv/pipenv without a DECISIONS entry
- Config access: `from app.config import settings` — never `os.getenv` inline in routers/models
- DB access: always via the `get_session` dependency (`Depends(get_session)`) — never `SessionLocal()` in a handler
- Python: requires >=3.12 (`pyproject.toml`); the README's "3.9+" is stale — target 3.12 syntax

## Commands Reference

| Task | Command |
|------|---------|
| Dev server | `uvicorn app.main:app --reload` |
| Install | `pip install .` |
| Apply migrations | `alembic upgrade head` |
| New migration | `alembic revision --autogenerate -m "..."` |

## Hard Constraints

- NEVER commit secrets, tokens, or `.env` values (`SECRET_KEY`, `DATABASE_URL`)
- NEVER add dependencies without confirming they don't already exist in `pyproject.toml`
- NEVER introduce async DB code — the stack is synchronous SQLAlchemy 2.0 (DECISIONS #1)
- NEVER mount `app/routers/legacy_export.py` — it is intentionally unwired dead code (DECISIONS #2)
