---
name: elevation-workflow
description: Orchestrate the full design-elevation loop for a surface — multi-critic adversarial critique (batched ≤3-4 agents), synthesis into a ranked implementNow list, then the architect → engineer → measuring-reviewer chain; owner signs off on the measured result, never on an option menu. Use this skill when the user says "elevate this page", "make it best-in-world", "raise the design quality of X".
severity: MEDIUM
confidence: 0.8
surface: Code
---

# Elevation Workflow Skill

> **Trigger**: A surface needs end-to-end elevation, not a single critique or fix. The default failures this prevents: the 12-agent parallel burst (rate-limit trip), taste-poll loops (research → recommend → ask → react instead of one complete pass), and silent coverage caps.

## What this skill produces

One complete, evidence-grounded elevation pass over a named surface: critique → synthesis → implementation → measured gate — ending with the measured live outcome presented for owner sign-off.

## Before invoking — mandatory reads

1. The project's decision spine (locks, budgets, primitive vocabulary). No spine → author it first (kit spine template); the workflow refuses to run without locks.
2. `knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md` §4 (the recipe + operational lessons), §6 (no taste-polls).

## Procedure

1. **Scale rigor to the ask.** "Find issues" → a few critics, single-vote verify. "Best-in-world / exhaustive" → larger critic pool + synthesis stage + adversarial verify. State the chosen scale up front.
2. **Critique** — run `design-architect`: one critic per section + cross-cutting critics (typography/rhythm, motion, CRO, a11y, perf), every critic told the locks, every critic naming a best-in-world reference. **Batch ≤3-4 agents at a time, sequential batches** — a large parallel blast trips server-side rate limits even under your own quota.
3. **Synthesize** — dedupe, drop vague/needs-new-assets, rank by impact-to-effort → the `implementNow` list.
4. **Implement** — run `design-engineer` on the list verbatim (reuse-first, extract-≥2×, locks sacred).
5. **Gate** — run `design-reviewer`: the measuring gate (transforms, computed styles at breakpoints, CLS, axe + Lighthouse on the prod build, reduced-motion, lock-literal grep) + the generic correctness reviewer.
6. **Declare coverage honestly.** If the pass bounded anything (top-N findings, one breakpoint, sampled sections) — SAY SO; silent truncation reads as "covered everything".
7. **Close the loop**: present the measured before/after to the owner for sign-off on the RESULT (never an option menu); lock new primitives / amended budgets as a DECISIONS entry; append lessons to the spine's gotchas.

## Output format

```markdown
## Elevation Pass: [surface] — [rigor scale chosen]
Critique: [N critics in M batches] → [K findings] → implementNow: [J items]
Implemented: [J-R shipped, R returned (reasons)]
Gate: MERGE [YES/NO] — [measured highlights: CLS x, transform deltas, Lighthouse y]
Coverage: [full / bounded — what was NOT covered]
Owner sign-off on: [the measured live outcome]
Locked: [new primitives / budget amendments → DECISIONS entry]
```

## Anti-patterns

- **The 12-agent burst.** One parallel blast of critics trips rate limits — batch ≤3-4, sequential.
- **The ask-react loop.** Research → recommend → ask → react per iteration is a taste-poll in slow motion; deliver ONE complete evidence-grounded pass, then sign-off.
- **Elevation without a spine.** Critics without locks return lock-breaking findings; the pass is wasted.

## Gotchas

- **Rate-limit messages ≠ your quota** — "temporarily limiting requests" is server-side pressure from the burst pattern; the fix is batching, not waiting.
- **The synthesis stage is where quality happens**: raw critic output is redundant and uneven — skipping dedupe/ranking ships noise to the engineer.
- **Sign-off drift**: owners asked to pick between options start art-directing; owners shown a measured result make one decision. Frame the close accordingly.

## When NOT to use

- **A single finding or bug** — use the fix loop or `design-reviewer` alone; the full workflow is overhead.
- **Back-end / API / data surfaces** — nothing to render, nothing to measure visually.

## References

- KB-08 §4 (recipe), §5 (measurement), §6 (no taste-polls), §9 (anti-patterns)
- Chain skills: `design-architect`, `design-engineer`, `design-reviewer`
