# Workflow Help

Answer three questions from repo evidence: where am I, what's next, which command/skill/agent applies.

## When to Run

- Session start, especially returning after a gap
- Unsure what to do next or which workflow asset fits
- Onboarding anyone (human or agent) onto this repo's workflow

## Inputs (read in order; skip missing files gracefully and SAY which were missing)

1. `CLAUDE.md` — house rules + rituals
2. `OPS-MASTER-PLAN.md` — source of truth + roadmap
3. `HANDOFF.md` — in-progress / blocked items (top entry is newest)
4. `governance/DECISIONS.md` — last 3 `D{N}` entries
5. `docs/INDEX.md` — playbook navigation + freshness
6. `.ai-kit-manifest.json` if present — installed packs, presets, kit version
7. `git log --oneline -10` + `git status --short` (this repo may have no git history — say so and fall back to HANDOFF)
8. `ls .claude/commands/ .claude/skills/ .claude/agents/` — DISCOVER tooling; never recite from memory

## Steps

1. **Locate**: current state (branch/commit if git present, else newest HANDOFF entry), uncommitted work, the HANDOFF in-progress item
2. **Derive next actions** (ranked, max 3):
   - HANDOFF "open items" / mid-flight audit → continue it
   - Master-plan roadmap items (e.g. Larkfield staffing, freshness audit, drysuit decision) → next
   - Stale `verified:` playbooks past 90 days → schedule re-verification
   - Nothing found → recommend `/status` to re-baseline
3. **Map each action to a tool**: decision-shaped → the decision-skill router (`.claude/rules/decision-skills.md`); grounding review → `/review-pr` or the reviewer agent; rot report → `/tech-debt`; freshness → the verifier agent; new tool → `/discover-mcp` (propose-only)
4. **Freshness check**: if HANDOFF's newest entry predates recent doc changes, flag it and point to `/status`

## Output

```
## Where you are
State: [branch@hash / no git — newest HANDOFF entry date]
In progress (HANDOFF): [item / none recorded]

## What's next (ranked)
1. [action] — evidence: [file:section] — tool: [command/skill/agent]
2. ...

## Blocked on owner
[numbered questions from HANDOFF / open registry proposals, or "nothing"]

## Freshness
HANDOFF newest entry [date] vs recent changes — [fresh / STALE → run /status]
Missing inputs: [list or none]
```

## Constraints

- READ-ONLY — never modifies any file
- Every "next" cites its evidence (file:section) — no invented priorities
- Tooling lists come from `ls`, never memory
- If no workflow files exist at all, point to `<KIT_ROOT>/generator/PROJECT_SETUP_PROMPT.md`
