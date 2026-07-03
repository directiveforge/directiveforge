# Status

Regenerate HANDOFF's machine section from repo state — mechanical facts, not prose recall — and flag drift where hand-written claims contradict git.

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
git diff --stat HEAD~5..HEAD 2>/dev/null      # recent changed areas
tail -30 DECISIONS.md                          # ledger tail (last entries)
cat .ai-kit-manifest.json 2>/dev/null          # kit version + generated set
```

> This project may not be under version control yet (no `.git` at install time). If git commands fail, degrade gracefully: use file mtimes + the manifest + DECISIONS tail, and say VCS is absent.

## Steps

1. **Compute mechanical state**: branch; HEAD hash + date (or "no VCS"); commits since HANDOFF was last touched; top changed directories; uncommitted files; last DECISIONS entry number/date; kit version from the manifest
2. **Rewrite ONLY the `## Current State (machine-generated)` section of `HANDOFF.md`** with those facts. Never touch the hand-written sections. If `HANDOFF.md` is missing, create it from `<KIT_ROOT>/templates/shared/HANDOFF.md.template` with only the machine section filled, and say so
3. **Drift check** — for each checkable claim in the hand-written sections (What Was Done / In Progress / Files Changed / Tests): named file exists? commit touching it exists? "Tests pass" newer than last code commit? Each contradiction becomes a `DRIFT:` line appended UNDER the machine section — hand-written text is flagged, never silently rewritten
4. **Emit the final line**: `STATUS: CLEAN` or `STATUS: DRIFT (N findings)`

## Output

The regenerated machine section, then:

```
## Status Report
HEAD: [hash, date | no VCS] | HANDOFF hand-written sections last touched: [date]
Commits since HANDOFF touch: [N] | Uncommitted: [N files]
DRIFT findings: [list or "none"]

STATUS: CLEAN | DRIFT (N findings)
```

## Constraints

- The machine section is the ONLY thing this command writes
- Every statement traces to a command output above — no memory
- Hand-written prose is never rewritten — drift is flagged for the owner, not corrected
- No manifest? Degrade to git/file + ledger facts and note it; template lives at `<KIT_ROOT>/templates/shared/HANDOFF.md.template`
