# SlotHarbor — API Conventions (app/routers/)

> Scope: `app/routers/*.py` and `app/main.py`. Descriptive of THIS codebase (sync FastAPI + SQLAlchemy 2.0).

## ROUTER STRUCTURE
- DO: one `APIRouter(prefix="/x", tags=["x"])` per domain file; include it in `app/main.py` via `app.include_router(...)`.
- DO: define request/response Pydantic models INLINE in the router file (DECISIONS #2) — no `schemas/` package.
- DO NOT: add a service/repository layer — handlers query models directly via `get_session()` (DECISIONS #3).

## HANDLERS (SYNCHRONOUS)
- DO: `def handler(...)` — plain sync functions. Inject the session with `session: Session = Depends(get_session)`.
- DO NOT: use `async def` handlers, `AsyncSession`, or `await` on DB calls (DECISIONS #1) — the whole stack is sync.
- DO: query via `session.get(Model, id)`, `session.scalars(select(...))`, `session.execute(select(...)).all()` — never `session.query()`.

## PYDANTIC (v2)
- DO: `model_config = ConfigDict(from_attributes=True)` on any model that serializes an ORM object (e.g. `BookingOut`).
- DO: `model_dump()` / `field_validator` / `model_validator` — never `.dict()` or `@validator` (v1, removed).
- DO: constrain inputs at the field (`Field(gt=0)`, `Query(le=settings.MAX_PAGE_SIZE)`) — validate at the boundary, not inline later.

## RESPONSES & ERRORS
- DO: set `response_model=` on every route — never return a raw SQLAlchemy model.
- DO: raise `HTTPException(status_code=..., detail="...")` for expected errors (bad window, missing dock) — early, before the happy path.
- DO NOT: return error dicts or bare `Error` objects; do NOT log `SECRET_KEY`, tokens, or full request bodies.

## PAGINATION
- DO: bound every list endpoint — `limit: int = Query(default=..., gt=0, le=settings.MAX_PAGE_SIZE)`. Never return an unbounded query.

## WHY
- Sync + inline-schema + no-service-layer are locked project decisions (DECISIONS #1–#3) — match them; do not import the generic layered FastAPI pattern.
