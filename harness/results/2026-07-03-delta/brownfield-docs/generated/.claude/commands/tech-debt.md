---
allowed-tools: Read, Glob, Grep, Bash(python3 .claude/scripts/check-links.py:*), Bash(grep:*), Bash(ls:*), Bash(find:*), Bash(wc:*)
description: Rot report for the ops corpus — stale verified dates, index drift, link rot, orphaned docs, ledger open items
---

Produce a prioritized rot report for the Trailhead Collective corpus. This repo has no code — "tech debt" here is documentation rot.

## Scan Areas

### 1. Freshness rot
- `grep -rn "verified:" docs/` — flag every playbook whose `verified:` date is older than 90 days
- Cross-check HANDOFF open items against the stale set (some stale dates are known-lying — the audit's whole point)

### 2. Link rot
- `python3 .claude/scripts/check-links.py docs/archive` — every `BROKEN ->` line is a dead link

### 3. Index drift
- Every `docs/*.md` (except INDEX) has an `INDEX.md` row?
- Every `INDEX.md` link resolves to a real file?

### 4. Orphaned / thin docs
- Playbooks reachable from no index
- Stub sections (e.g., a staffing section that is still a placeholder — Larkfield onboarding is a known stub)

### 5. Ledger open items
- Scan `governance/DECISIONS.md` for decisions with unreconciled downstream work (e.g., a policy playbook not yet reconciled to a superseding decision)

## Categorization

| Priority | Criteria |
|----------|----------|
| **P0** | A live playbook gives wrong operating guidance (contradicts the master plan or a superseding decision) |
| **P1** | Dead link / index drift / a depot-facing playbook past 90 days |
| **P2** | Thin/stub section; a doc reachable from no index |
| **P3** | Cosmetic / minor freshness on a low-traffic reference doc |

## DRIFT-QUARANTINE block (mandatory, machine-readable)

Emit a fenced block listing every documented claim contradicted by the corpus. One claim per line, greppable. If nothing drifted, emit the block empty.

```
DRIFT-QUARANTINE
<quarantined claim> | actual: <truth> | source: <artifact>
```

## Output

### Rot Report: Trailhead Collective

**Summary**: X findings (Y P0, Z P1, W P2, V P3)

#### P0
- [finding] — [file] — [why now]

#### P1
- [finding] — [file] — [impact if deferred]

#### P2 / P3
- [finding] — [file]

#### Recommended action
1. **This week**: P0 + any depot-facing P1 before the next peak
2. **Next shoulder-season audit**: remaining P1/P2
