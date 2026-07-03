---
allowed-tools: Read, Glob, Grep, Bash(git diff:*), Bash(git status:*), Bash(git log:*)
description: Grounding review of changed docs — claims sourced, freshness honest, governance respected
---

# Review Changes (Grounding Review)

This is a documentation repo, so "review" means a grounding review, not a code review: are the changed docs sourced, fresh-dated honestly, index-consistent, and governance-respecting?

## Steps

1. Identify changed docs (`git diff --name-only` if git is present; otherwise review the docs the operator names).
2. Read each changed file in full, plus the sources it cites (`sources:` frontmatter → master plan / ledger / sibling playbooks).
3. Run the doc-lint gates from `.claude/rules/quality-gates.md`.
4. Apply the checklist.

## Checklist

**Sourcing & accuracy**
- [ ] Every load-bearing claim traces to a cited source (master plan / `D{N}` ledger entry / sibling playbook)
- [ ] No claim contradicts `OPS-MASTER-PLAN.md` (if it does, the playbook is wrong — reconcile via a decision)
- [ ] No invented depot names, gear lines, or dollar figures
- [ ] A changed playbook that sources a decision is reconciled to that decision's current state (e.g. deposit-and-refund ⇄ `D5`)

**Freshness**
- [ ] `verified:` was bumped only if the content was actually re-checked
- [ ] Frontmatter present and complete: `owner`, `verified:`, `sources:`

**Index & links**
- [ ] Every new playbook has a `docs/INDEX.md` row; no dead links introduced; no orphaned files

**Governance**
- [ ] Ledger untouched OR appended with the next `D{N}` only — no in-place edits to locked entries
- [ ] No credential, key, or integration was wired up (D4 — proposals only)
- [ ] Any spend/recurring-cost change went through a money-gate decision with a stated ceiling

## Output Format

```
## Grounding Review

### Blocking (must fix)
- path — issue — why it matters

### Report-only (freshness / lint)
- path — stale verified: date / frontmatter gap

### Passed
✓ [items that look good]

### Verdict
APPROVE / REQUEST CHANGES
```
