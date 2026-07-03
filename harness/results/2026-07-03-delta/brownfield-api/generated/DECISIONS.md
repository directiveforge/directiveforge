# Architecture Decisions — SlotHarbor

> The canonical project ledger of locked architectural calls. One file, root-level, version-controlled.
> AI agents: read this before proposing changes. Never re-open a settled question without writing a *new* numbered entry that supersedes the old one.

## What goes here (and what doesn't)

In: non-obvious calls with cross-cutting impact, defensible for ≥90 days, with a reversal trigger decidable from observable facts.
Out: changelog entries, one-PR decisions, linter-enforceable preferences, temporary calls.

Background + entry anatomy + reversal/re-verify mechanics: see [KB-04 §2](<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md#2-pillar-1--decision-lock-discipline-decisionsmd).

This project uses the **Tier 2 (Intermediate)** format below: full entry structure with reversal triggers + re-verification cadence, single-pass synthesis.

> Note: these entries were **seeded from codebase analysis** during kit install (2026-07-03), reconstructing the decisions the code already embodies. Confirm or amend with the code owner before treating any as owner-ratified.

---

## Implementation #1 — Synchronous SQLAlchemy, not async (2026-07-03)

**Decision** — All DB access is synchronous: `sqlalchemy.orm.Session` via a `sessionmaker`, sync `def` route handlers, `session.execute(select(...))` / `session.scalars(...)` / `session.get(...)`. No `AsyncSession`, no `async def` handlers.

**Rationale** — The codebase is uniformly sync (`app/db.py`, `app/routers/items.py`, `app/routers/reports.py`). FastAPI runs sync handlers in a threadpool, which is adequate for this internal, low-concurrency scheduling service. Introducing async piecemeal would fracture the session model and the migration environment. The generic FastAPI preset recommends async by default; **codebase wins** — this project is descriptively sync.

**Reversal triggers** — (1) Sustained request-concurrency or slow-DB-call latency makes threadpool saturation observable in production → evaluate a full async migration (engine + sessionmaker + all handlers together, never piecemeal). (2) A new dependency requires an async-only driver → re-assess.

**Re-verify** — Event-triggered: on any latency/throughput incident tied to DB blocking, or before adding a high-fan-out endpoint.

**Cross-references** — Enforced by `CLAUDE.md` Critical Constraints and `.claude/rules/api.md`.

---

## Implementation #2 — Inline Pydantic schemas in router files, no schemas/ package (2026-07-03)

**Decision** — Request/response Pydantic models are defined inline in the router that uses them (e.g. `BookingCreate`/`BookingOut` in `app/routers/items.py`, `UtilizationReport` in `app/routers/reports.py`). No shared `app/schemas/` package.

**Rationale** — The service is small (3 domain routers); colocating a schema with its single consumer keeps the change surface local and readable. A shared package would add indirection with no current reuse to justify it.

**Reversal triggers** — (1) The same schema is needed by ≥2 routers (real duplication, not speculative) → extract it to `app/schemas/`. (2) Router files grow past readable size and schemas dominate them → split.

**Re-verify** — On each new router: check whether it re-declares a schema an existing router already defines.

**Cross-references** — `CLAUDE.md` Critical Constraints; `.claude/rules/api.md`.

---

## Implementation #3 — No service/repository layer; routers query models directly (2026-07-03)

**Decision** — Route handlers call `get_session()` and query `app/models.py` directly (`session.get`, `select(...)`, aggregate queries). There is no service or repository layer between routers and the ORM.

**Rationale** — Business logic is thin (window validation, dock existence, count aggregation). A service layer would be ceremony without payoff at this size. The generic preset assumes routers → services → repositories; codebase wins.

**Reversal triggers** — (1) Business logic starts being duplicated across routers, or a single handler exceeds ~40 lines of non-query logic → introduce `app/services/`. (2) A second entry point (CLI, worker, scheduled job) needs the same logic → extract to a shared service.

**Re-verify** — On each feature that adds non-trivial business logic to a handler.

**Cross-references** — `.claude/rules/api.md`; `.claude/agents/simplifier.md` flags premature service abstraction.

---

## Implementation #4 — Retain legacy_export.py unwired, pending removal decision (2026-07-03)

**Decision** — `app/routers/legacy_export.py` (a `/legacy/export.csv` CSV endpoint) is kept in the tree but is **NOT** included in `app/main.py`. It is dead code retained from the v0.x line while the old ops dashboard was decommissioned.

**Rationale** — The module docstring states it was superseded by `/reports` and kept during dashboard decommissioning. Retained (not deleted) pending owner confirmation that no external consumer still expects the CSV shape.

**Reversal triggers** — (1) Owner confirms no consumer depends on the CSV export → delete the module (archive per the no-delete-in-place discipline). (2) A live need for CSV export resurfaces → wire the router into `main.py` and add tests before exposing it.

**Re-verify** — Next maintenance pass, or when the ops-dashboard decommissioning is confirmed complete.

**Cross-references** — Flagged in `CLAUDE.md` Key Conventions; surfaced by `/tech-debt`.

---

## Implementation #5 — Container (Docker) deployment, not Heroku (2026-07-03)

**Decision** — Deployment target is a Docker container: `Dockerfile` builds on `python:3.12-slim`, installs the package, and runs `uvicorn app.main:app --host 0.0.0.0 --port 8000`. Deploy commands and platform claims derive from the `Dockerfile` only.

**Rationale** — `Dockerfile` is the only deploy artifact present. There are no Heroku artifacts (`Procfile`, `app.json`, `heroku.yml`), no CI/CD deploy job, and no `.git` remote. **`README.md` claims "deployed on Heroku, pushes to main build and release automatically" — flagged as DRIFT, actual deploy artifact is the Dockerfile** (Phase 1.5 drift quarantine). The Heroku claim is unverified prose and is NOT used to author any deploy command.

**Reversal triggers** — (1) A real Heroku pipeline is introduced (Procfile / heroku.yml / verified pipeline config committed) → update this entry and the deploy skill from those artifacts. (2) The container is orchestrated (compose/k8s/fly/railway manifest added) → record the actual platform + deploy command from that artifact.

**Re-verify** — On any change to `Dockerfile` or the addition of any CI/CD or hosting manifest.

**Cross-references** — `.claude/skills/deployment/SKILL.md` and `.claude/commands/deploy.md` derive from `Dockerfile`; the Heroku README line is quarantined and must never enter a generated deploy file as current truth.

---

## Numbering protocol

```bash
grep -c "^## Implementation #" DECISIONS.md
```

Result + 1 = next free number. If two sessions race for the same number, escalate to a human — never silently mutate. Re-numbering a locked entry breaks every reference to it.

## When to graduate to Tier 3 (Advanced)

Warning signs from [KB-04 §8](<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md#8-the-maturity-gradient): a decision needs >4 research dossiers; single-pass synthesis missed a cross-dossier contradiction that surfaced downstream; multi-orchestrator dispatch begins. Don't graduate without a trigger.
