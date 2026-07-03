# SlotHarbor — Database & Migrations (app/models.py, migrations/)

> Scope: `app/models.py`, `app/db.py`, `migrations/`. SQLAlchemy 2.0 (sync) + Alembic + Postgres/SQLite.

## MODELS (SQLAlchemy 2.0 declarative)
- DO: use `Mapped[...]` + `mapped_column(...)` typing (matches `Carrier`/`Dock`/`SlotBooking`) — not the legacy `Column(...)` class-attr style.
- DO: declare `relationship(back_populates=...)` on both sides; use `cascade="all, delete-orphan"` where the parent owns children (see `Dock.bookings`).
- DO: put multi-column uniqueness in `__table_args__` (`UniqueConstraint("dock_id","window_start", ...)`) — don't rely on app-level checks alone.
- DO: index foreign keys and query-filter columns (`index=True`) as the existing models do.

## SESSIONS (app/db.py)
- DO: get sessions ONLY through the `get_session()` FastAPI dependency — never construct `SessionLocal()` inline in a handler.
- DO NOT: change the engine to async or remove `pool_pre_ping=True`; SQLite dev needs `check_same_thread=False` (already handled by URL sniffing).

## MIGRATIONS (Alembic)
- DO: generate with `alembic revision --autogenerate -m "msg"`, then READ the generated file — autogenerate misses some column-type changes and constraint renames.
- DO: keep `migrations/env.py` sourcing the URL from `app.config.settings` and metadata from `app.models.Base` — don't hardcode a URL in `alembic.ini` (it's intentionally blank).
- DO NOT: edit an already-applied migration in `migrations/versions/`; add a new revision instead.
- DO: apply with `alembic upgrade head` before treating the schema as current — migrations are the source of truth, models alone are not.

## WHY
- The schema is small and constraint-driven (unique dock/window, SCAC uniqueness); DB-level constraints are the guardrail. Respect them rather than duplicating logic in Python.
