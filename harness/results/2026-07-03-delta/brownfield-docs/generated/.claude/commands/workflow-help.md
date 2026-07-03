# Workflow Help

Answer three questions from repo evidence: where am I, what's next, and which command/skill/agent applies.

## When to Run

- Session start, especially returning after a gap
- Unsure what to do next or which workflow asset fits the task
- Onboarding anyone (human or agent) onto this repo's workflow

## Inputs (read in order; skip missing files gracefully and SAY which were missing)

1. `OPS-MASTER-PLAN.md` — source of truth + roadmap
2. `CLAUDE.md` — house rules + corpus map + rituals
3. `HANDOFF.md` — live session state (in-progress / not-started / do-not items)
4. `governance/DECISIONS.md` — last 3 entries + any open reversal triggers
5. `.ai-kit-manifest.json` if present — installed packs, presets, kit version
6. `ls .claude/commands/ .claude/skills/ .claude/agents/ 2>/dev/null` — DISCOVER available tooling; never recite from memory

> No `.git` in this repo — session state lives in `HANDOFF.md`, not git history.

## Steps

1. **Locate**: what the master-plan roadmap says is current; the HANDOFF "Where things stand" item
2. **Derive next actions** (ranked, max 3):
   - HANDOFF open item → continue it (e.g., the shoulder-season freshness re-verify of gear-recovery + deposit-and-refund)
   - HANDOFF "not started" → surface it (e.g., the Larkfield staffing stub)
   - Roadmap item from `OPS-MASTER-PLAN.md` → propose it
   - Nothing found → recommend `/tech-debt` to re-baseline rot
3. **Map each action to a tool**: decision-shaped → the decision-skill router (`.claude/rules/decision-skills.md`); grounding review → reviewer agent; doc-lint → verifier agent; rot scan → `/tech-debt`; context drift → `/update-context`
4. **Freshness check**: which playbooks are over 90 days `verified:`

## Output

```
## Where you are
Master-plan roadmap says: [current focus]
HANDOFF open item: [item / none recorded]

## What's next (ranked)
1. [action] — evidence: [file:section] — tool: [command/skill/agent]
2. ...

## Blocked / awaiting founder
[numbered items from HANDOFF/DECISIONS, or "nothing"]

## Freshness
Playbooks over 90 days verified: [list or "none flagged"]
Missing inputs: [list or "none"]
```

## Constraints

- READ-ONLY — never modifies any file
- Every "next" cites its evidence (file:section) — no invented priorities
- Tooling lists come from `ls`, never from memory
- If no workflow files exist at all, point to `<KIT_ROOT>/generator/PROJECT_SETUP_PROMPT.md`
