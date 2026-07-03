---
allowed-tools: Read, Glob, Grep, Bash(git log:*), Bash(wc:*), Bash(pip list:*), Bash(pip-audit:*)
description: Analyze and prioritize technical debt in the codebase
---

Analyze SlotHarbor for technical debt and produce a prioritized remediation plan.

## Scan Areas

### 1. Dependency Health

Check `pyproject.toml` for:
- Outdated versions: `pip list --outdated`
- Known vulnerabilities: `pip-audit` (if installed)
- Deps declared but not imported anywhere in `app/`

### 2. Code Complexity

- Files over 300 lines under `app/`
- TODO/FIXME/HACK comments: `grep -rn "TODO\|FIXME\|HACK\|XXX" app/`
- Handlers with excessive branching or parameters
- Duplicated logic across routers

### 3. Test Coverage Gaps

- **No test suite exists at all** — this is the single largest debt item (P1). Every endpoint and the two unique constraints are untested.
- Critical paths with no coverage: booking creation validation, utilization aggregation, `MAX_PAGE_SIZE` bound.

### 4. Architecture / Documentation Drift

- README claims that contradict code: `make test` (no Makefile), `/v2/analytics` (no router), Python "3.9+" (pyproject requires 3.12), Heroku deploy (only a Dockerfile present), `SECRET_KEY`/`WAREHOUSE_CODE` env vars absent from `.env.example`.
- `app/routers/legacy_export.py` — dead code (tracked in DECISIONS #2).
- Deprecated-API usage (none currently — Pydantic v2 + SQLAlchemy 2.0 are current).

### 5. Configuration & Infrastructure

- `.env.example` is incomplete — documents only `DATABASE_URL`, missing `SECRET_KEY`, `WAREHOUSE_CODE`, `MAX_PAGE_SIZE`.
- No CI configuration.
- Hardcoded `dev-secret-change-me` fallback in `app/config.py` (safe only if always overridden in prod).

## Categorization

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0 — Critical** | Security risk, data loss, production instability | Fix this sprint |
| **P1 — High** | Blocks development or causes recurring bugs | Fix within 2 sprints |
| **P2 — Medium** | Slows development, has workarounds | Schedule when adjacent |
| **P3 — Low** | Cosmetic / nice-to-have | Opportunistic |

## Output

### Tech Debt Report: SlotHarbor

**Summary**: X findings (Y critical, Z high, W medium, V low)

#### P0 — Critical
- [finding] — [file/location] — [effort] — [why now]

#### P1 — High
- [finding] — [file/location] — [effort] — [impact if deferred]

#### P2 — Medium
- [finding] — [file/location] — [effort]

#### P3 — Low
- [finding] — [file/location]

#### Recommended Action Plan
1. **Immediate** (this week): [P0 items]
2. **Next sprint**: [P1 items]
3. **Opportunistic**: [P2 items]
