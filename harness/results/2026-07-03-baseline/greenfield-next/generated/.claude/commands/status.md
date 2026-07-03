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
git diff --stat HEAD~5..HEAD 2>/dev/null       # recent changed areas
tail -30 DECISIONS.md                          # ledger tail
cat .ai-kit-manifest.json 2>/dev/null          # kit version + generated set
```

Note: this project has no `.git` yet. Until it is initialized, degrade to file-mtime + ledger facts and say so.

## Steps

1. **Compute mechanical state**: branch; HEAD hash + date; commits since HANDOFF was last touched; top changed directories; uncommitted files; last DECISIONS entry date; kit version from the manifest
2. **Rewrite ONLY the `## Current State (machine-generated)` section of `HANDOFF.md`** with those facts. Never touch the hand-written sections. If `HANDOFF.md` is missing, create it from the kit HANDOFF template with only the machine section filled, and say so
3. **Drift check** — for each checkable claim in the hand-written sections: named file exists? a commit touching it exists? "Tests: pass" claim (there is no test runner — flag any such claim as false)? Each contradiction becomes a `DRIFT:` line appended UNDER the machine section
4. **Emit the final line**: `STATUS: CLEAN` or `STATUS: DRIFT (N findings)`

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

- The machine section is the ONLY thing this command writes
- Every statement traces to a command output above — no memory
- Hand-written prose is never rewritten — drift is flagged for the owner
- Template lives at `<KIT_ROOT>/templates/shared/HANDOFF.md.template`
