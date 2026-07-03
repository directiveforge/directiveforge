---
allowed-tools: Read, Glob, Grep, Bash(git log:*), Bash(wc:*), Bash(pip:*)
description: Analyze and prioritize technical debt in the codebase
---

Analyze SlotHarbor for technical debt and produce a prioritized remediation plan.

## Scan Areas

### 1. Dependency Health
- Outdated versions (FastAPI 0.115.6, Pydantic 2.7.4, SQLAlchemy 2.0.31, Alembic 1.13.2, Uvicorn 0.30.1 are pinned `==` in `pyproject.toml`)
- Known vulnerabilities: `pip-audit` if available
- Pinned `==` deps drift silently — check release notes on the re-verify cadence

### 2. Code Complexity
- Files over 300 lines in `app/`
- `grep -rn "TODO\|FIXME\|HACK\|XXX" app/`
- Deeply nested logic; functions with >5 parameters
- Duplicated logic across routers

### 3. Test Coverage Gaps
- **No test suite exists** (no runner in `pyproject.toml`) — this is the single largest debt item. Critical paths (booking creation, window validation, uniqueness collision, utilization aggregation) have zero automated coverage.

### 4. Architecture Drift / Dead Code
- `app/routers/legacy_export.py` is unwired dead code (DECISIONS #4) — decide keep-vs-remove
- Convention violations (async sneaking into a sync codebase; service layer added against DECISIONS #3)

### 5. Configuration & Documentation Drift
- `.env.example` completeness vs `app/config.py` (all of `DATABASE_URL`, `SECRET_KEY`, `WAREHOUSE_CODE`, `MAX_PAGE_SIZE` documented?)
- README claims vs code reality — see the DRIFT-QUARANTINE block below

## DRIFT-QUARANTINE

<!-- Machine-readable; one claim per line: `<quarantined claim> | actual: <truth> | source: <artifact>`.
     These README claims are contradicted by the code/artifacts and MUST NEVER be asserted as current truth
     in any generated file without the drift flag attached. Present-and-empty is allowed; this run found 4. -->

```
README says "deployed on Heroku, pushes to main build and release automatically" | actual: Docker container deploy (python:3.12-slim, uvicorn), no Procfile/heroku.yml/CI present | source: Dockerfile + repo tree
README says "Python 3.9 or newer" | actual: requires-python >=3.12; Docker base python:3.12-slim | source: pyproject.toml + Dockerfile
README says "Run the suite with make test" | actual: no Makefile and no test suite/runner exist anywhere in the repo | source: repo tree (no Makefile, no tests/, no pytest dep)
README endpoint table lists "GET /v2/analytics — Aggregated throughput analytics dashboard feed" | actual: no analytics router exists; main.py mounts only items + reports; /healthz is the only extra route | source: app/main.py + app/routers/
```

## Categorization

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0 — Critical** | Security risk, data loss, or production instability | Fix this sprint |
| **P1 — High** | Blocks feature work or causes recurring bugs | Fix within 2 sprints |
| **P2 — Medium** | Slows development but has workarounds | Schedule with adjacent work |
| **P3 — Low** | Cosmetic / nice-to-have | Track, fix opportunistically |

## Output

### Tech Debt Report: SlotHarbor

**Summary**: X findings (Y critical, Z high, W medium, V low)

#### P0 — Critical
- [finding] — [file/location] — [effort] — [why now]

#### P1 — High
- No automated tests — `app/` — medium effort — every change is unverified beyond boot+migrate
- README drift (4 claims, see DRIFT-QUARANTINE) — `README.md` — low effort — correct or delete stale claims (Heroku, Py3.9, make test, /v2/analytics)

#### P2 — Medium
- Dead `legacy_export.py` router (DECISIONS #4) — decide keep-vs-remove

#### P3 — Low
- [finding] — [file/location]

#### Recommended Action Plan
1. **Immediate**: [P0 items]
2. **Next sprint**: add a pytest + TestClient baseline; reconcile README with reality
3. **Opportunistic**: resolve the legacy-export decision
