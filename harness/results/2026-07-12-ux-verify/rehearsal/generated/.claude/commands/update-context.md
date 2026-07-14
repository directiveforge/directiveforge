# Update Context

Re-sync `CLAUDE.md`, `AGENTS.md`, and `DECISIONS.md` to reflect the current state of the project after meaningful changes.

## When to Run

Run this command after:
- Adding a new module or major feature (e.g. a temperature/offset conversion path)
- Changing an architectural pattern or directory structure
- Adding or removing a dependency
- Changing build/lint commands or adding a test runner
- Making an architectural decision that should be remembered

Do NOT run after every commit — only after changes that make the existing context files inaccurate.

## Steps

1. Run `git log --oneline -20` — identify what changed since the last context update
2. Read current `CLAUDE.md` and `AGENTS.md`
3. For each changed area, verify:
   - All commands still match `package.json` scripts
   - All directory paths still exist (`src/units.ts`, `src/convert.ts`, `src/index.ts`)
   - The TypeScript version and ESLint config are still accurate
   - No new pitfalls emerged from recent changes
4. Update `CLAUDE.md` — patch only what changed, do not rewrite
5. Update `AGENTS.md` — patch stack summary, commands, or constraints if needed
6. If an architectural decision was made: add one entry to `DECISIONS.md` (Tier 1 one-liner)
7. If new dependencies were added: check if MCP servers exist for them (`/discover-mcp`, new deps only)

## Output

```
## Context Update

Changes detected: [list what changed]
CLAUDE.md: [updated / no changes needed]
AGENTS.md: [updated / no changes needed]
DECISIONS.md: [entry added / no changes needed]

Stale items removed: [list or "none"]
New pitfalls added: [list or "none"]
```

## Quality Reference

- **CLAUDE.md quality**: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §1 — under 150 lines, critical constraints at top
- **Rules quality**: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §2 — DO/DO NOT format, under 40 lines per rule
- **Validation**: `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md` — run after any update

## Constraints

- NEVER rewrite files from scratch — patch only what changed
- NEVER increase CLAUDE.md beyond 150 lines
- NEVER add information already derivable from reading the code
- If nothing meaningful changed: report "Context is current — no updates needed"
