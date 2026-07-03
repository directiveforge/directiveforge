# Status

Regenerate a mechanical snapshot of corpus state — facts from files, not prose recall — and flag drift where written claims contradict the corpus. This repo has no `.git`, so state comes from the files themselves, not git history.

## When to Run

- End of session, before handing off
- Whenever HANDOFF is suspected stale
- After a freshness audit or a governance decision lands

## Inputs

```bash
ls docs/ governance/                              # current corpus set
grep -rn "verified:" docs/                        # freshness dates
grep -c "^## D" governance/DECISIONS.md           # ledger entry count
python3 .claude/scripts/check-links.py docs/archive  # link health
cat .ai-kit-manifest.json 2>/dev/null             # kit version + generated set (degrade if absent)
```

## Steps

1. **Compute mechanical state**: playbook count; how many are over 90 days `verified:`; last DECISIONS entry number/date; link-health exit; kit version from the manifest
2. **Drift check** — for each checkable claim in `HANDOFF.md` (Where things stand / Not started / Do-not):
   - Named file exists?
   - A "verified date is stale" claim still true against the current frontmatter?
   - A "not started" item still not started (the referenced stub still a stub)?
   Each contradiction becomes a `DRIFT:` line — HANDOFF prose is FLAGGED, never silently rewritten (HANDOFF is append-only live state)
3. **Emit the final line**: `STATUS: CLEAN` or `STATUS: DRIFT (N findings)`

## Output

```
## Status Report
Playbooks: [N] | over-90-days verified: [N]
Last decision: [D{N}, date] | Link health: [clean / N broken]
Kit version (manifest): [x.y.z / no manifest]
DRIFT findings: [list or "none"]

STATUS: CLEAN | DRIFT (N findings)
```

## Constraints

- Every statement traces to a command output above — no memory, no summaries of summaries
- HANDOFF prose is never rewritten — drift is flagged for the owner, not corrected (append-only live state)
- No `.git` here: do NOT reach for git log/status — the corpus files are the source of state
- No manifest? Degrade to corpus + ledger facts and note it; template at `<KIT_ROOT>/templates/shared/HANDOFF.md.template`
