# Workflow Help

Answer three questions from repo evidence: where am I, what's next, and which command/skill/agent applies.

## When to Run

- Session start, especially returning after a gap
- Unsure what to do next or which workflow asset fits the task
- Onboarding anyone (human or agent) onto this project's workflow

## Inputs (read in order; skip missing files gracefully and SAY which were missing)

1. `CLAUDE.md` — project map + session protocol
2. `HANDOFF.md` — in-progress / blocked items
3. `DECISIONS.md` — last 3 entries
4. `.ai-kit-manifest.json` if present — installed packs, presets, kit version
5. `git log --oneline -10` and `git status --short`
6. `ls .claude/commands/ .claude/skills/ .claude/agents/ 2>/dev/null` — DISCOVER available tooling; never recite from memory

## Steps

1. **Locate**: current branch, last commit (hash + age), uncommitted work, the HANDOFF in-progress item
2. **Derive next actions** (ranked, max 3), in this priority:
   - HANDOFF "In Progress" → continue it
   - HANDOFF "Blocked" → surface the owner questions
   - DECISIONS follow-ups / reversal triggers that have fired
   - Nothing found → recommend `/status` to re-baseline
3. **Map each action to a discovered tool**: decision-shaped → the decision-skill router (`.claude/rules/decision-skills.md`); review-shaped → reviewer agent; verification → verifier agent; context drift → `/update-context`
4. **Freshness check**: if HANDOFF's last touch predates the last commit, flag it and point to `/status`

## Output

```
## Where you are
Branch [x] @ [hash, age] — [uncommitted: N files / clean]
In progress (HANDOFF): [item / none recorded]

## What's next (ranked)
1. [action] — evidence: [file:section or commit] — tool: [command/skill/agent]
2. ...

## Blocked on owner
[numbered questions from HANDOFF/DECISIONS, or "nothing"]

## Context freshness
HANDOFF last touched [date] vs HEAD [date] — [fresh / STALE → run /status]
Missing inputs: [list or "none"]
```

## Constraints

- READ-ONLY — this command never modifies any file
- Every "next" cites its evidence (file:section or commit hash) — no invented priorities
- Tooling lists come from `ls`, never from memory
- If no workflow files exist at all, say so and point to `<KIT_ROOT>/generator/PROJECT_SETUP_PROMPT.md`
