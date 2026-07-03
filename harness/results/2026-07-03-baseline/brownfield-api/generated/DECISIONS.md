# Architecture Decisions — SlotHarbor

> The canonical project ledger of locked architectural calls. One file per project, root-level, version-controlled.
> AI agents: read this before proposing changes. Never re-open a settled question without writing a *new* numbered entry that explicitly supersedes the old one.

## What goes here (and what doesn't)

In: non-obvious calls with cross-cutting impact, evidence-backed enough to defend for ≥90 days, with a reversal trigger decidable from observable facts.

Out: changelog entries (git history), one-PR-and-done decisions (commit messages), preferences enforceable by linter/typecheck (rules), temporary calls (code comments).

Background discipline + entry anatomy: see [KB-04 §2](<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md#2-pillar-1--decision-lock-discipline-decisionsmd).

---

## Tier 2 — Intermediate format

Full entry structure per decision; synthesis is single-pass. Apply the 8-gate framework to any research dossier that backs a Tier 2 entry.

Entries below were seeded from the existing codebase at kit-install time (2026-07-03). They document choices the code already demonstrates, so a future agent does not silently reverse them.

---

### Implementation #1 — Synchronous SQLAlchemy 2.0, not async (2026-07-03)

**Decision** — The DB layer is synchronous SQLAlchemy 2.0: sync `Engine` via `create_engine`, sync `sessionmaker`, sync `def` route handlers, `get_session()` yields a sync `Session`. No `AsyncSession` / `create_async_engine` / `async def` anywhere.

**Rationale** — The service is small (three tables, a handful of endpoints) and CPU-light; sync is simpler to reason about and debug, and SQLite dev + `check_same_thread=False` works cleanly. Async would add a driver dependency (asyncpg/aiosqlite) and colored functions with no measured latency benefit at this scale. The FastAPI-preset default (async) is explicitly overridden here by the observed codebase.

**Reversal triggers** — (1) A single endpoint's p95 latency becomes dominated by DB wait under real Cratewell load → benchmark async for that path only. (2) A new dependency forces async I/O (e.g. an async-only message bus in a handler) → reassess the affected router, not the whole app.

**Re-verify** — Event-triggered only: on any perf regression report or when a new I/O-bound integration is added. No calendar cadence.

**Cross-references** — Overrides `<KIT_ROOT>/generator/presets/fastapi.md` async guidance (preset describes the typical FastAPI stack; this codebase is sync). Touches `.claude/rules/api-python.md`, `app/db.py`, every router.

---

### Implementation #2 — `legacy_export.py` retained but unmounted (2026-07-03)

**Decision** — `app/routers/legacy_export.py` (the `/legacy/export.csv` CSV router) stays in the tree but is deliberately NOT included in `app/main.py`. It is superseded by `app/routers/reports.py`.

**Rationale** — The module docstring states it was kept "from the v0.x line while the old ops dashboard was decommissioned." Deleting it now risks losing the CSV-export shape before confirming no external consumer still expects it; mounting it would re-expose a superseded surface. Unmounted-but-present is the safe middle state pending a removal decision.

**Reversal triggers** — (1) Confirmation that no consumer needs CSV export → delete the module (move to `docs/archive/` per kit cleanup doctrine, do not silently `rm`). (2) A live consumer surfaces → re-mount deliberately with tests, and record a new entry.

**Re-verify** — Semiannual: check whether any consumer still references CSV export; if none after two cycles, promote to deletion.

**Cross-references** — Documented as a pitfall in `CLAUDE.md` (Common Pitfalls) and `AGENTS.md` (Directory Structure).

---

### Implementation #3 — Plain `os.getenv` config, not pydantic-settings (2026-07-03)

**Decision** — Runtime config is a hand-rolled `Settings` class in `app/config.py` that reads `os.getenv` at import and exposes a `settings` singleton. `pydantic-settings` / `BaseSettings` is intentionally not used.

**Rationale** — Only four variables (`DATABASE_URL`, `SECRET_KEY`, `WAREHOUSE_CODE`, `MAX_PAGE_SIZE`), each with a simple default; the plain class has zero extra dependencies and is trivially importable by `migrations/env.py`. Pydantic settings would add validation ceremony disproportionate to four flat values.

**Reversal triggers** — (1) Config grows past ~8 variables OR needs typed validation / nested structure → migrate to `pydantic-settings`. (2) A boot-time misconfiguration ships to prod because a bad value wasn't validated → adopt `BaseSettings` with field validators.

**Re-verify** — Event-triggered: whenever a new environment variable is added.

**Cross-references** — Touches `app/config.py`, `migrations/env.py`. Independent of #1 and #2.

---

## Numbering protocol

```bash
grep -c "^### Implementation #" DECISIONS.md
```

Result + 1 = next free number. If two agents race for a number, escalate to a human — never silently mutate. Re-numbering a locked entry breaks every reference to it.

---

## When to graduate tiers

- **Intermediate → Advanced**: a decision needs >4 research dossiers, OR single-pass synthesis missed a cross-dossier contradiction that downstream work surfaced, OR you start running multi-orchestrator dispatch.
- **Don't graduate without a trigger.** The forcing function is cost-of-a-bad-decision, not project age.

## Anti-patterns (condensed from KB-04 §2.6)

1. **Silent rewrite** — editing a locked entry in place. Reverse with a new numbered entry instead.
2. **Premature lock** — locking before evidence supports a 90-day commitment.
3. **Lock without reversal triggers** — re-verification becomes guesswork.
4. **Ledger as changelog** — recording what was *built*, not what was *decided*.
