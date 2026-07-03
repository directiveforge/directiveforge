# Update Context

Re-sync `CLAUDE.md`, `AGENTS.md`, and `DECISIONS.md` to reflect the current state of SlotHarbor after meaningful changes.

## When to Run

After: adding a router/module, changing an architectural pattern or directory structure, adding/removing a dependency, changing dev commands, or making an architectural decision worth remembering.

Do NOT run after every commit — only after changes that make the existing context files inaccurate.

## Steps

1. Run `git log --oneline -20` — identify what changed since last context update
2. Read current `CLAUDE.md` and `AGENTS.md`
3. For each changed area, verify:
   - All commands still match reality (`pip install .`, `uvicorn app.main:app`, `alembic upgrade head`)
   - All directory paths still exist (`app/routers/*.py`, `migrations/versions/`)
   - Framework versions still accurate (`pyproject.toml`)
   - No new pitfall emerged
4. Update `CLAUDE.md` — patch only what changed, do not rewrite
5. Update `AGENTS.md` — patch stack summary, commands, or constraints if needed
6. If an architectural decision was made: add one `### Implementation #N` entry to `DECISIONS.md` (Tier 2 format)
7. If new dependencies were added: check for MCP servers (run discovery for new deps only)

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

## Quality Reference

- CLAUDE.md quality: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §1 — under 150 lines, critical constraints at top
- Rules quality: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §2 — DO/DO NOT, under 40 lines per rule
- Validation: `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`

## Constraints

- NEVER rewrite files from scratch — patch only what changed
- NEVER increase CLAUDE.md beyond 150 lines
- NEVER add information already derivable from reading the code
- If nothing meaningful changed: report "Context is current — no updates needed"
