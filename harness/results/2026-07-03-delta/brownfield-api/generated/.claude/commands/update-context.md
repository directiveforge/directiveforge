# Update Context

Re-sync `CLAUDE.md`, `AGENTS.md`, and `DECISIONS.md` to the current state of the project after meaningful changes.

## When to Run

Run after:
- Adding a new router, model, or major feature
- Changing an architectural pattern or directory structure
- Adding or removing a dependency in `pyproject.toml`
- Changing dev/migration commands
- Making an architectural decision that should be remembered

Do NOT run after every commit — only after changes that make the context files inaccurate.

## Steps

1. `git log --oneline -20` — identify what changed since the last context update
2. Read current `CLAUDE.md` and `AGENTS.md`
3. For each changed area, verify:
   - All commands still match `pyproject.toml` / the real toolchain (`uvicorn`, `alembic`, `pip`)
   - All directory paths still exist (`app/`, `app/routers/`, `migrations/`)
   - Framework versions still accurate (FastAPI 0.115.6, Pydantic 2.7.4, SQLAlchemy 2.0.31)
   - No new pitfalls emerged
4. Patch `CLAUDE.md` — only what changed, do not rewrite (keep ≤150 lines)
5. Patch `AGENTS.md` — stack summary, commands, or constraints if needed
6. If an architectural decision was made: add one Tier-2 entry to `DECISIONS.md`
7. If new dependencies were added: check for MCP servers (run `/discover-mcp` for new deps only)

## Output

```
## Context Update
Changes detected: [list]
CLAUDE.md: [updated / no changes needed]
AGENTS.md: [updated / no changes needed]
DECISIONS.md: [entry added / no changes needed]
Stale items removed: [list or "none"]
New pitfalls added: [list or "none"]
```

## Constraints

- NEVER rewrite files from scratch — patch only what changed
- NEVER increase CLAUDE.md beyond 150 lines
- NEVER add information already derivable from reading the code
- If nothing meaningful changed: report "Context is current — no updates needed"
