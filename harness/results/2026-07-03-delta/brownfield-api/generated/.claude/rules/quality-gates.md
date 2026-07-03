# SlotHarbor — Quality Gates

> Scope: whole project; blocking verification chain for every change.
> Note: this project ships **no** lint / typecheck / unit-test / build tooling (none in `pyproject.toml`). The gates below are the ones that actually exist — do not add phantom `ruff`/`mypy`/`pytest`/build rows. If test/lint tooling is later adopted, add its row here.

## Gate table
| Gate | Command | Blocking |
|------|---------|----------|
| App boots (import + app assembly) | `python -c "import app.main"` | Yes |
| Migrations apply | `alembic upgrade head` (against a scratch/SQLite DB) | Yes |

## When to run
- After every edit batch touching `app/`: the import/boot gate (fast)
- Before every commit: both gates (boot + migrate on a scratch DB)
- Before deploy: both gates, plus a manual `/healthz` check against the running container

## Failure protocol
- A failing gate BLOCKS the commit — fix forward or revert; never bypass
- Report the exact command + exit code — "should work" is not a verification
- A migration that fails to apply is never committed to `migrations/versions/`

## Content policy
- Zero placeholder content (stub endpoints, TODO copy) in any shipped surface

## Division of labor
- The verifier agent (`.claude/agents/verifier.md`) runs these gates mechanically; this rule binds the main thread to the same gates
- If a real test suite is added later, wire it into both this rule and the verifier agent in the same change
