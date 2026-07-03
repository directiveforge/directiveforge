# Update Context

Re-sync `CLAUDE.md`, `AGENTS.md`, and the corpus map to reflect the current state after meaningful changes. Context files need the same freshness discipline as any playbook.

## When to Run

Run this after:
- Adding, renaming, or archiving a playbook (changes the corpus map + `docs/INDEX.md`)
- Restructuring `docs/` or `governance/`
- A governance decision that changes how the corpus is maintained
- Changing a house convention (frontmatter, naming, ritual cadence)

Do NOT run after every edit — only after changes that make the context files inaccurate.

## Steps

1. List what changed this session (edited/added/archived docs)
2. Read current `CLAUDE.md` and `AGENTS.md`
3. For each changed area verify:
   - The corpus map (Architecture section) still matches the real `docs/` + `governance/` layout
   - Every path cited in CLAUDE.md / AGENTS.md still exists
   - `docs/INDEX.md` matches the real playbook set (no orphans, no dead rows)
   - No new pitfall emerged that belongs in Common Pitfalls
4. Patch `CLAUDE.md` — only what changed; do not rewrite
5. Patch `AGENTS.md` — corpus map, constraints, or file-location table if needed
6. If a maintenance decision was made: append an entry to `governance/DECISIONS.md` (never a root ledger)

## Output

```
## Context Update
Changes detected: [list]
CLAUDE.md: [updated / no changes needed]
AGENTS.md: [updated / no changes needed]
governance/DECISIONS.md: [entry appended / no changes needed]
Stale items removed: [list or "none"]
```

## Constraints

- NEVER rewrite files from scratch — patch only what changed
- NEVER increase CLAUDE.md beyond 150 lines
- NEVER add information already derivable from reading the corpus
- NEVER start a second ledger — decisions append to `governance/DECISIONS.md`
- If nothing meaningful changed: report "Context is current — no updates needed"
