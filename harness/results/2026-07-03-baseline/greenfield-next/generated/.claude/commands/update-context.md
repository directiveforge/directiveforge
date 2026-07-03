# Update Context

Re-sync `CLAUDE.md`, `AGENTS.md`, and `DECISIONS.md` to reflect the current state of Tempo Deck after meaningful changes.

## When to Run

Run after:
- Adding a new component, helper, or route
- Changing an architectural pattern or directory structure
- Adding or removing a key dependency (especially a test runner, database, or auth)
- Changing build/lint commands
- Making an architectural decision worth remembering

Do NOT run after every commit — only after changes that make the context files inaccurate.

## Steps

1. Run `git log --oneline -20` — identify what changed since the last context update
2. Read current `CLAUDE.md` and `AGENTS.md`
3. For each changed area, verify:
   - All commands still match `package.json` scripts (and the `npx tsc --noEmit` typecheck note still holds)
   - All directory paths still exist (no invented `src/` / `app/api/` / `middleware.ts`)
   - Next.js / React versions still accurate
   - No new pitfalls emerged
4. Update `CLAUDE.md` — patch only what changed; keep it ≤150 lines
5. Update `AGENTS.md` — patch stack summary, commands, or constraints if needed
6. If an architectural decision was made: add one dated entry to `DECISIONS.md`
7. If new dependencies with external services were added: run `/discover-mcp` for those deps only

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

## Quality Reference

- CLAUDE.md quality: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §1
- Validation: `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`
