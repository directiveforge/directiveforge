# L1 Scorecard — Pack: naming

**Date**: 2026-07-03 · **Label**: baseline · **Layer**: 1 (single run — n as noted per metric, no repeated trials)

**Models**: static=claude-sonnet-5, author=claude-opus-4-8, router=claude-haiku-4-5, judge=claude-opus-4-8, calibration=claude-fable-5 (Fable §6 re-judge pending, injected post-run)

No letter grades — see SCORECARD-FORMAT.md.

---

## L1.1 — Static structural checks

Target: `templates/skills/naming/`. N/A families: S6 (template source, all 6 skills).

**Pack rollup**: 30/30 passed — pass_rate 1.0

| Artifact | Passed | Failed | Pass rate |
|---|---|---|---|
| name-generation/SKILL.md | 5 | 0 | 1.0 |
| naming-brief/SKILL.md | 5 | 0 | 1.0 |
| name-scorecard/SKILL.md | 5 | 0 | 1.0 |
| linguistic-screen/SKILL.md | 5 | 0 | 1.0 |
| availability-gate/SKILL.md | 5 | 0 | 1.0 |
| trademark-clearance/SKILL.md | 5 | 0 | 1.0 |

All checks S1–S5 PASS on every artifact; S6 marked N/A (template source, no live invocation).

---

## L1.2 — Trigger precision/recall (router)

10 prompts per skill (5 positive / 5 other-or-none), n=60 total prompts across the pack.

**Pack micro**: TP 29, FP 1, FN 1 — precision 0.9667, recall 0.9667, f1 0.9667

| Skill | TP | FP | FN | Positives | Precision | Recall | F1 |
|---|---|---|---|---|---|---|---|
| naming-brief | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| name-generation | 4 | 0 | 1 | 5 | 1.0 | 0.8 | 0.8889 |
| linguistic-screen | 5 | 1 | 0 | 5 | 0.8333 | 1.0 | 0.9091 |
| trademark-clearance | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| availability-gate | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| name-scorecard | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |

**Confusions observed:**
- `name-generation-p3` — expected `name-generation`, router fired `naming-brief` (FN for name-generation).
- `linguistic-screen-n5` — expected `none`, router fired `linguistic-screen` (FP for linguistic-screen).

---

## L1.3 — deferred

**Status**: deferred

**Caveat**: L1.3 measured on the decision pack only in this baseline; deferred for this pack per spend circuit-breaker adjudication (HARNESS-SPEC §7.5) — see DISPOSITIONS-v0.18.0.

---

## L1.4 — Rubric quality (LLM judge)

n=6 artifacts (all 6 naming skills), judge=claude-opus-4-8.

**Overall mean**: 5 (out of 5, all dimensions)

| Dimension | Mean |
|---|---|
| Actionability | 5 |
| Scope calibration | 5 |
| Failure content quality | 5 |
| Constraint explicitness | 5 |

All 6 artifacts (naming-brief, name-generation, linguistic-screen, trademark-clearance, availability-gate, name-scorecard) scored 5/5 on every dimension. Per-artifact judge notes cite concrete evidence: numbered DO-step procedures, explicit "When NOT to use" sections with named sibling-skill routes, and Anti-patterns/Gotchas sections naming specific failure modes with fixes. Single judge run (n=6, no repeated trials) — no inter-rater variance data in this baseline.

---

## Calibration

**Judge agreement**: pending Fable §6 re-judge — to be injected post-run.

---

## Caveats (pack-wide)

- All metrics reflect a single run (n as stated per metric) — no repeated-trial variance data at Layer 1 for this pack.
- L1.3 not measured for this pack in this baseline (deferred, see above).
- L1.4 judge agreement/calibration not yet available — pending Fable 5 re-judge pass.
- All numbers above copied verbatim from source artifacts: `l1.1-static.json`, `l1.2-trigger.json`, `l1.4-rubric.json`. No values computed or derived in this document.

## Post-run injections (2026-07-03)

- **Calibration (spec §6, Fable 5)**: L1.4 exact-agreement 18/20 (0.90), ±1 20/20 (1.00); L1.2 random 2/2; adversarial probe vs router 1/4 / vs author labels 4/4 (weak-skill-stratified by design). Record: `../../calibration-fable.md`.
