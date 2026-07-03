---
name: design-architect
description: Run the read-only adversarial design critique and produce the ranked implementNow plan — grounded in the REAL render plus in-repo evidence, judged against a NAMED best-in-world reference, honoring the project's locks. Use this skill when the user asks "critique this page", "why does this feel flat/loud", "plan the elevation", "what's the gap to best-in-world". Refuses to plan when no decision spine exists — author the spine first.
severity: MEDIUM
confidence: 0.8
surface: Code
---

# Design Architect Skill

> **Trigger**: A surface needs an evidence-grounded critique or an elevation plan. The default failures this prevents: generic polish ("make it nicer"), taste-polling the owner with option menus, and plans that break locked invariants because the critics were never told the locks.

## What this skill produces

A ranked `implementNow` list — deduped, lock-safe, implementable-now findings ordered by impact-to-effort — plus a gap statement against a named best-in-world reference. Read-only: this skill never edits project files.

## Before invoking — mandatory reads

1. The project's decision spine (`docs/design/DESIGN-SPINE.md` or the project's equivalent) — the concept sentence, the locks/budgets, the ordered decision rubric. **No spine → STOP**: authoring the spine (from the kit's spine template) precedes any critique.
2. `knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md` §4 (the elevation recipe), §6 (no taste-polls), §2 (escalation is the failure mode of a good concept).

## Procedure

1. **Ground in reality.** Read the surface's actual current code AND observe how it renders in the real browser (hydrated, real viewport) — never critique from code alone.
2. **Tell every critic the locks.** Extract the spine's locks/budgets/invariants and put them in each critic prompt — a critic that proposes a lock-breaking change wastes the pass.
3. **Fan out critics** — one per section of the surface + cross-cutting critics (typography/rhythm, motion, CRO, a11y, perf). **Batch ≤3-4 agents at a time**, sequential batches — a large parallel burst trips server-side rate limits.
4. **Each critic must**: (a) cite the real render + in-repo evidence; (b) name the specific best-in-world reference and the technique it uses that this surface doesn't; (c) rate the gap honestly — *"competent" is a failure*; (d) return ranked, concrete, lock-safe, implementable-now findings.
5. **Synthesize**: dedupe across critics; drop the vague and the needs-new-assets; rank by impact-to-effort. The survivors are the `implementNow` list.
6. **Hand off**: the list goes to `design-engineer` verbatim; the merge-gate is `design-reviewer`. Scale rigor to the ask — "find issues" → few critics; "best-in-world / exhaustive" → larger pool + synthesis + adversarial verify.

## Output format

```markdown
## Elevation Plan: [surface]
Concept sentence: [from the spine] | Locks honored: [list]
Reference: [named best-in-world site/pattern] — gap: [honest rating + why]

### implementNow (ranked)
1. [finding] — evidence: [render observation / file:line] — reference technique: [what they do] — impact/effort: [H/M/L / H/M/L]
2. …

### Dropped (with reasons)
- [vague / needs-new-assets / lock-breaking — one line each]
```

## Anti-patterns

- **Critiquing from code without the render.** The most expensive design bugs are invisible in source — a "subtle parallax" can be silently dead.
- **Unnamed references.** "Make it more premium" is not a critique; "reference X does technique Y, we don't" is falsifiable.
- **Option menus.** Deliver the expert call ranked by evidence; reserve questions for genuine brand forks only.

## Gotchas

- **Critics not told the locks propose lock-breaking changes** — then the whole pass gets discarded at the gate. Locks go in every critic prompt, not just the synthesis.
- **"Competent" ratings hide the gap.** Force the best-in-world comparison; a critic that returns "this is fine" has failed its brief.
- **Escalation disguised as elevation**: more of the calibrated signature move is usually the wrong finding — the budget IS the design.

## When NOT to use

- **No decision spine exists** — author `docs/design/DESIGN-SPINE.md` from the kit template first; a critique without locks produces lock-breaking findings.
- **The ask is a bug fix, not elevation** — a broken layout goes through the normal fix loop, not a multi-critic pass.

## References

- KB-08 §4 (recipe), §6 (anti-taste-poll), §9 (anti-patterns)
- Chain: `design-architect` → `design-engineer` → `design-reviewer`, orchestrated by `elevation-workflow`
