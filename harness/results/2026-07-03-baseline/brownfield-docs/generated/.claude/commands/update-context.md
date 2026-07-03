# Update Context

Re-sync `CLAUDE.md`, `AGENTS.md`, and the corpus map to reflect the current state of the repo after meaningful changes. The decision ledger lives at `governance/DECISIONS.md` (append-only, `D{N}`) — this command never edits it, only points at it.

## When to Run

Run after:
- Adding a new playbook, a new depot, or a new gear line
- Changing the corpus structure (new directory, moved files, new archive)
- A governance decision that changes how the repo is organized or governed
- Changing a documented convention (frontmatter shape, freshness cadence)

Do NOT run after every edit — only after changes that make `CLAUDE.md` / `AGENTS.md` inaccurate.

## Steps

1. `git log --oneline -20` (or, absent git, read `HANDOFF.md` recent entries) — identify what changed since the last context update
2. Read current `CLAUDE.md` and `AGENTS.md`
3. For each changed area, verify:
   - The corpus map still matches the real directory layout
   - Every path cited in `CLAUDE.md` / `AGENTS.md` still exists
   - The rituals and conventions still describe reality
   - No new pitfall emerged that belongs in Common Pitfalls
4. Patch `CLAUDE.md` — only what changed; do not rewrite; keep it ≤150 lines
5. Patch `AGENTS.md` — corpus map / rituals / conventions if needed; do not duplicate `CLAUDE.md`'s constraint list
6. If a governance decision was made: it is recorded in `governance/DECISIONS.md` as the next `D{N}` — reference it from context files, never inline the decision into `CLAUDE.md`

## Output

```
## Context Update
Changes detected: [list]
CLAUDE.md: [updated / no changes needed]
AGENTS.md: [updated / no changes needed]
Ledger reference: [pointed at governance/DECISIONS.md D{N} / no change]
Stale items removed: [list or none]
New pitfalls added: [list or none]
```

## Constraints

- NEVER rewrite files from scratch — patch only what changed
- NEVER exceed 150 lines in `CLAUDE.md`
- NEVER edit `governance/DECISIONS.md` from this command — it is append-only and owned by the decision flow
- If nothing meaningful changed: "Context is current — no updates needed"
