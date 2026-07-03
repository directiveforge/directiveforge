---
description: Regenerate HANDOFF's machine section from repo state — mechanical git facts, not prose recall — and flag drift where hand-written claims contradict the git record.
---

# Status

Rebuild the machine-generated section of `HANDOFF.md` from what git actually says, then flag any hand-written claim the repo contradicts. Never rewrite prose — drift is surfaced for the owner, not silently corrected.

## When to Run

- End of session, before handing off
- Whenever HANDOFF is suspected stale (`/workflow-help` flags it)
- After a milestone lands

## Inputs

```bash
git log --oneline -20
git log -1 --format='%h %ci'                  # HEAD
git log -1 --format=%ci -- HANDOFF.md         # HANDOFF last touch
git status --short
git diff --stat HEAD~5..HEAD 2>/dev/null       # recent changed areas
tail -30 DECISIONS.md                           # ledger tail (if present)
cat .ai-kit-manifest.json 2>/dev/null           # kit version + generated set — degrade gracefully if absent
```

## Steps

1. **Compute mechanical state**: branch; HEAD hash + date; commits since HANDOFF was last touched; top changed directories; uncommitted files; last DECISIONS entry number/date; kit version from the manifest if present.
2. **Rewrite ONLY the `## Current State (machine-generated)` section of `HANDOFF.md`** with those facts. Never touch hand-written sections. If `HANDOFF.md` is missing, say so and skip the rewrite.
3. **Drift check** — for each checkable claim in the hand-written sections (What Was Done / In Progress / Files Changed / Tests): named file exists and has a commit touching it? "Tests: pass" claim newer than the last code commit? In-progress files actually showing recent activity? Each contradiction becomes a `DRIFT:` line appended UNDER the machine section.
4. **Emit the final line**: `STATUS: CLEAN` or `STATUS: DRIFT (N findings)` — greppable by scripts and CI.

## Output

The regenerated machine section, then:

```
## Status Report
HEAD: [hash, date] | HANDOFF hand-written sections last touched: [date]
Commits since HANDOFF touch: [N] | Uncommitted: [N files]
DRIFT findings: [list or "none"]

STATUS: CLEAN | DRIFT (N findings)
```

## Constraints

- The machine section is the ONLY thing this command writes.
- Every statement traces to a command output above — no memory, no summaries of summaries.
- Hand-written prose is never rewritten — drift is flagged for the owner, not corrected.
- No `.ai-kit-manifest.json`? Degrade to git + ledger facts and note it.
