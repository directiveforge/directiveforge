# Review Changes (grounding review)

Review a batch of changed docs for source-grounding, freshness discipline, index integrity, and governance compliance. This repo has no `.git`, so "the changes" = the docs you (or the operator) just edited this session.

## Steps

1. Identify the changed docs (the session's edits; or ask the operator which files)
2. Read each changed doc in full — plus `OPS-MASTER-PLAN.md` if operating direction changed
3. For each claim, confirm it traces to the master plan, the ledger, or a cited source — flag anything invented
4. Apply the checklist below

## Checklist

**Grounding**
- [ ] No invented depots (only Pinecrest/Ridgeway/Stonebrook/Larkfield), gear lines, figures, or dates
- [ ] Every operating claim traces to `OPS-MASTER-PLAN.md`, a ledger decision, or a cited source
- [ ] No playbook contradicts the master plan

**Freshness**
- [ ] `verified:` bumped only where the content was actually re-confirmed
- [ ] Changed `docs/*.md` carries `owner` + `verified` (YYYY-MM-DD) + `sources`

**Index & single-source**
- [ ] New `docs/*.md` has an `INDEX.md` row; no `INDEX.md` row points at a missing file
- [ ] Facts linked to their single source, not restated

**Governance**
- [ ] No credential / integration wired up — external tools only PROPOSED per D4
- [ ] Money / recurring-cost advice flagged, not assumed
- [ ] Ledger edits append-only

## Output Format

```
## Change Review

### Critical (must fix)
- docs/file.md:42 — description — why it matters

### Warning (should fix)
- docs/file.md:17 — description

### Passed
✓ [list items that look good]

### Verdict
APPROVE / REQUEST CHANGES
```
