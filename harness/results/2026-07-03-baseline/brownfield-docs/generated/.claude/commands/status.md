# Status

Regenerate `HANDOFF.md`'s machine section from repo state — mechanical facts, not prose recall — and flag drift where hand-written claims contradict the corpus. Note: `HANDOFF.md` in this repo is an append-only narrative log, so this command adds/refreshes a machine-facts block at the TOP without rewriting any dated entry.

## When to Run

- End of session, before handing off
- Whenever HANDOFF is suspected stale (`/workflow-help` flags it)
- After a milestone lands (season close, freshness audit, new decision)

## Inputs

```bash
git log --oneline -20 2>/dev/null                 # may be empty — this repo has no git history yet
git status --short 2>/dev/null
grep -c '^## D[0-9]' governance/DECISIONS.md       # ledger entry count
grep -oE '^## D[0-9]+' governance/DECISIONS.md | tail -1   # last D{N}
ls docs/*.md | wc -l                               # playbook count
grep -rE '^verified:' docs/*.md                    # freshness snapshot
cat .ai-kit-manifest.json 2>/dev/null              # kit version + generated set (degrade if absent)
```

## Steps

1. **Compute mechanical state**: git state if present (else "no git history — narrative-only repo"); playbook count; last `D{N}` number + date; count of playbooks past 90 days on `verified:`; kit version from the manifest.
2. **Emit a `## Current State (machine-generated)` block** with those facts. In this narrative-log HANDOFF, place it at the top under the intro blockquote; never rewrite a dated `##` session entry.
3. **Drift check** — for each checkable claim in the newest hand-written HANDOFF entry (open items, "not started", "do not"):
   - Named file exists? Named playbook's `verified:` matches the claim (e.g. "still stale")?
   - A claimed change (e.g. "three-strike rule propagated") actually present in the referenced playbook?
   Each contradiction becomes a `DRIFT:` line under the machine block — hand-written text is flagged, never silently rewritten.
4. **Emit the final line**: `STATUS: CLEAN` or `STATUS: DRIFT (N findings)` — greppable.

## Output

The regenerated machine block, then:

```
## Status Report
State: [git hash+date / no git] | Playbooks: [N] | Last decision: [D{N}, date]
Playbooks past 90d verified:: [N] | Open registry proposals: [N]
DRIFT findings: [list or none]

STATUS: CLEAN | DRIFT (N findings)
```

## Constraints

- The machine block is the ONLY thing this command writes into HANDOFF; dated narrative entries are never rewritten
- Every statement traces to a command output above — no memory
- Hand-written prose is flagged for the owner on drift, never corrected
- The ledger lives at `governance/DECISIONS.md`; this command reads it, never edits it
- No manifest? Degrade to corpus + ledger facts and note it; template at `<KIT_ROOT>/templates/shared/HANDOFF.md.template`
