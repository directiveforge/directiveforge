---
allowed-tools: Read, Glob, Grep, Bash(git log:*), Bash(wc:*), Bash(grep:*)
description: Corpus rot report — stale verified: dates, index drift, link rot, orphaned docs
---

Produce a corpus rot report for Trailhead Collective. There is no code here — "tech debt" means documentation rot: staleness, drift, and broken navigation.

## Scan areas

### 1. Freshness rot
- Playbooks with `verified:` over 90 days old (due for shoulder-season re-verification)
- Playbooks whose `sources:` point at a `D{N}` that has since been superseded (content may be out of date)
- Playbooks flagged in `HANDOFF.md` as known-stale but not yet re-verified

### 2. Index & link drift
- `docs/INDEX.md` rows pointing at files that do not exist
- `docs/*.md` playbooks with no `docs/INDEX.md` row (orphans)
- Any `](path.md)` link (in docs, README, master plan) whose target is missing

### 3. Structural rot
- Frontmatter gaps: missing `owner`, `verified:`, or `sources:`
- Filename convention violations (not `kebab-case`)
- Facts restated in two places (should be single-source-of-truth + link) that risk drifting apart
- Thin / stub playbooks the master-plan roadmap says still need filling (e.g. Larkfield staffing)

### 4. Governance hygiene
- Ledger numbering gaps or out-of-order `D{N}` entries
- Registry proposals left open with no founder decision
- Any decision referenced by a playbook but missing from the ledger

## Categorization

| Priority | Criteria |
|----------|----------|
| **P0** | A live playbook contradicts the master plan or a current decision (operators may act on wrong guidance) |
| **P1** | Stale `verified:` on a depot-facing top-tier playbook (recovery, deposit, onboarding) |
| **P2** | Index drift, dead links, orphaned docs, thin stubs |
| **P3** | Frontmatter/style gaps, cosmetic |

## Output

### Corpus Rot Report: Trailhead Collective

**Summary**: X findings (Y P0, Z P1, W P2, V P3)

#### P0 — Contradicts source of truth
- [finding] — [file] — [which master-plan section / decision it violates]

#### P1 — Stale top-tier playbooks
- [finding] — [file] — [days overdue] — [what to reconcile before re-dating]

#### P2 — Navigation & structure
- [finding] — [file]

#### P3 — Hygiene
- [finding] — [file]

#### Recommended pass
1. **This shoulder season**: [P0 + P1]
2. **Next index sweep**: [P2]
3. **Opportunistic**: [P3]
