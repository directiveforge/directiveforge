# SlotHarbor

Internal dock-slot scheduling API for Cratewell Logistics — FastAPI 0.115.6 + SQLAlchemy 2.0.31 (sync) + Pydantic 2.7.4, Postgres in prod / SQLite in dev.

## Critical Constraints (read first)

- **SQLAlchemy is SYNCHRONOUS here** — sync `Session`, sync `def` route handlers, `create_engine`. NEVER introduce `AsyncSession`, `async def` handlers, or `create_async_engine` — the whole DB layer (`app/db.py`, `app/models.py`, every router) is sync. Match it.
- **No test / lint / typecheck tooling exists.** `pyproject.toml` declares no `pytest`, `ruff`, `black`, or `mypy`; there is no `Makefile` despite the README's `make test`. Do not run or promise gates that are not installed — see Definition of Done.
- **`SECRET_KEY` signs appointment-token HMACs.** It is real security surface. Never log it, never return it, never commit a real value (`.env.example` ships only names).

## Build & Test Commands

<!-- Canonical stack table lives in AGENTS.md; these are quirks only. -->
```bash
pip install .                          # Install app + deps (pip; no lockfile)
uvicorn app.main:app --reload          # Run dev server on :8000
alembic upgrade head                   # Apply migrations
alembic revision --autogenerate -m ""  # Generate a migration (review it — see Pitfalls)
```

## Code Style

- Pydantic v2 only: `model_config = ConfigDict(from_attributes=True)`, `model_dump()`, `field_validator` — never v1 `class Config`, `.dict()`, `@validator`.
- Request/response bodies are Pydantic models per router (`BookingCreate`, `BookingOut`); ORM models are never returned raw — `response_model` + `from_attributes` maps them.
- SQLAlchemy 2.0 style: `select(...)` + `session.scalars()` / `session.execute()`; never the legacy `session.query()` API.

## Architecture

- **Entry**: `app/main.py` — builds the `FastAPI` app, includes `items` + `reports` routers, exposes `/healthz`.
- **Routing**: `app/routers/` — one file per domain. `items.py` serves the `/bookings` prefix (create + list); `reports.py` serves `/reports/utilization`.
- **Models**: `app/models.py` — `Carrier`, `Dock`, `SlotBooking` (SQLAlchemy 2.0 `DeclarativeBase` + `Mapped`/`mapped_column`).
- **DB**: `app/db.py` — sync `Engine` + `sessionmaker`; `get_session()` is the per-request `Depends` dependency. SQLite gets `check_same_thread=False`.
- **Config**: `app/config.py` — plain `Settings` class reading `os.getenv` at import; `settings` singleton. Not `pydantic_settings`.
- **Migrations**: Alembic; URL injected from `app.config.settings` in `migrations/env.py` (`alembic.ini` leaves `sqlalchemy.url` blank).

## Key Conventions

- Config is read via `from app.config import settings` — never `os.getenv` inline in routers/models.
- DB access is always via the `get_session` dependency (`session: Session = Depends(get_session)`) — never instantiate `SessionLocal()` in a handler.
- List endpoints cap results at `settings.MAX_PAGE_SIZE` via a `Query(..., le=settings.MAX_PAGE_SIZE)` bound.

## Common Pitfalls

- `app/routers/legacy_export.py` is DEAD CODE — the `/legacy/export.csv` router is intentionally NOT wired into `main.py`. Do not "fix" its absence by mounting it; confirm intent before touching it.
- The README documents `/v2/analytics` and `SECRET_KEY`/`WAREHOUSE_CODE` env vars that are NOT all present in code / `.env.example` — treat the README as aspirational, the code as truth. `/v2/analytics` has no router.
- Alembic autogenerate misses column-type changes and some constraints — always read the generated migration in `migrations/versions/` before applying.
- `migrations/env.py` imports `app.config` + `app.models` — a model import error breaks migrations, not just the app.

## Search Before Implementing

Run `grep -rn "def <name>" app/` before adding utilities. Existing helpers live in `app/db.py` (session) and `app/config.py` (settings) — reuse them.

## Session Protocol

- Start each session: `git log --oneline -20` (once the repo is under git) to understand recent changes.
- Fresh session per task — don't chain unrelated work in one session.
- If context feels exhausted (repetitive errors, forgetting prior instructions): start a new session.
- Before complex tasks: use Plan mode to align on approach before writing code.

## Definition of Done

No automated gates ship with this repo yet. A task is done when: the app imports and boots (`uvicorn app.main:app` starts cleanly), any new migration applies with `alembic upgrade head`, and you have manually exercised the changed endpoint. If you add `pytest`/`ruff`/`mypy`, wire them into `.claude/rules/quality-gates.md` and this section.

## Commit Format

```
type(scope): description

# Examples:
feat(bookings): reject overlapping windows on the same dock
fix(reports): exclude cancelled bookings from utilization counts
```

## Corrections Become Rules

When you make a mistake and get corrected: remember the correction and apply it for the rest of the session. If it is project-wide, add it to Common Pitfalls above.

## AI Workflow Kit Reference

This workflow was generated by the AI Workflow Engineering Kit at `<KIT_ROOT>`.

When you need deeper guidance, consult:
- **MCP server catalog**: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- **Rules engineering**: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §2
- **Anti-hallucination**: `<KIT_ROOT>/knowledge-base/KB-01-AI-WORKFLOW-ENGINEERING.md` §6
- **Domain patterns**: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §9
- **Validation checklist**: `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`
- **Stack preset**: `<KIT_ROOT>/generator/presets/fastapi.md`
- **Decision skills router**: `.claude/rules/decision-skills.md`

## MCP Awareness

When working with an external service and struggling with its API:
1. Check `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md` first.
2. If not in registry: search npm / PyPI for an MCP server.
3. Quality-check (maintained? adoption? `uvx snyk-agent-scan@latest` passes? — full verdict needs `SNYK_TOKEN`).
4. If it passes, add to `.mcp.json` with a pinned version + annotate in `.mcp.annotations.md`.
5. Run `/discover-mcp` for a full dependency scan.
