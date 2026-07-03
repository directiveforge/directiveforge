# L1 Scorecard — pack: design

**Date**: 2026-07-03 | **Label**: baseline | **Spec version**: 1.0

**Models**: static=claude-sonnet-5, author=claude-opus-4-8, router=claude-haiku-4-5, judge=claude-opus-4-8, calibration=claude-fable-5

**Caveat**: single run (n=1 per artifact/prompt unless noted). No letter grades — see SCORECARD-FORMAT.md.

---

## L1.1 — Static structural checks

Target: `templates/skills/design/`

N/A families this pack: S6 (template source), R (no rule files present), A (no agent files present), C (no command files present), J (no JSON artifacts present).

Empty dirs: none.

| Artifact | Class | S1 | S2 | S3 | S4 | S5 | N/A | Passed | Failed | Pass rate |
|---|---|---|---|---|---|---|---|---|---|---|
| design-reviewer/SKILL.md | skill | PASS | PASS | PASS | PASS | PASS | S6 | 5 | 0 | 1.0 |
| elevation-workflow/SKILL.md | skill | PASS | PASS | PASS | PASS | PASS | S6 | 5 | 0 | 1.0 |
| design-engineer/SKILL.md | skill | PASS | PASS | PASS | PASS | PASS | S6 | 5 | 0 | 1.0 |
| design-architect/SKILL.md | skill | PASS | PASS | PASS | PASS | PASS | S6 | 5 | 0 | 1.0 |

**Pack rollup**: passed 20, failed 0, pass_rate 1.0

---

## L1.2 — Trigger precision/recall

Models: author=claude-opus-4-8, router=claude-haiku-4-5. Prompts per skill: 10.

| Skill | TP | FP | FN | Positives | Precision | Recall | F1 |
|---|---|---|---|---|---|---|---|
| design-architect | 5 | 0 | 0 | 5 | 1 | 1 | 1 |
| design-engineer | 5 | 0 | 0 | 5 | 1 | 1 | 1 |
| design-reviewer | 5 | 0 | 0 | 5 | 1 | 1 | 1 |
| elevation-workflow | 5 | 0 | 0 | 5 | 1 | 1 | 1 |

**Pack micro**: TP 20, FP 0, FN 0, precision 1, recall 1, f1 1

(Confusion notes: several `expected: other`/`none` negative prompts correctly routed to a sibling skill or to `none` rather than the target skill — no false positives recorded against target skills; see raw router outputs in `l1.2-trigger.json` for full detail.)

---

## L1.3 — Deferred

**Status**: deferred.

**Caveat**: L1.3 measured on the decision pack only in this baseline; deferred for this pack per spend circuit-breaker adjudication (HARNESS-SPEC §7.5) — see DISPOSITIONS-v0.18.0.

---

## L1.4 — Rubric judge scores

Judge: claude-opus-4-8. n=4 artifacts.

| Artifact | Actionability | Scope calibration | Failure content quality | Constraint explicitness |
|---|---|---|---|---|
| design/design-architect | 5 | 5 | 5 | 5 |
| design/design-engineer | 5 | 5 | 5 | 5 |
| design/design-reviewer | 5 | 5 | 5 | 5 |
| design/elevation-workflow | 5 | 3 | 5 | 5 |

**Per-dimension mean**: actionability 5, scope_calibration 4.5, failure_content_quality 5, constraint_explicitness 5

**Overall mean**: 4.875 (n=4)

### Judge notes (verbatim)

- **design/design-architect** — Score-5 across all 4 dims: concrete numbered Procedure with checkable batch/rate-limit constraints; produces its own implementNow list (not an orchestrator-style skill despite naming sibling skills); 3 Gotchas + 3 Anti-patterns each with specific failure+fix; explicit When-NOT with named routes (author spine first / normal fix loop). Not generic — the "competent is a failure" and "Batch ≤3-4 agents" specifics exceed the score-3 well-formed-but-generic bar.
- **design/design-engineer** — Genuine doer-skill: 6 concrete numbered steps, single crisp job routing out to design-architect (not an orchestrator), 3 specific Anti-patterns + 3 specific Gotchas, and a named-route When-NOT. Non-generic on every dimension; 5s justified under no-inflation rule.
- **design/design-reviewer** — Every Procedure step is a concrete measurable DO/DON'T with checkable outcome; distinct Anti-patterns and Gotchas sections each name a specific failure+fix; numbered Procedure plus explicit When-NOT with named sibling routes. Does the measuring itself (not orchestrator-style); the chain reference at the tail is a pointer, not a dispatch.
- **design/elevation-workflow** — Scope calibration held at 3 (not 1): the "Orchestrator-style skill" defect fits on its face — the Procedure dispatches design-architect (step 2), design-engineer (step 4), design-reviewer (step 5), i.e. ≥2 sibling skills — but it is NOT a score-1 pure orchestrator because it does substantive first-party work itself (step 3 synthesis: dedupe/rank into implementNow; step 6 honest coverage declaration; step 7 DECISIONS lock + spine gotchas). It bleeds into siblings' territory (the score-3 anchor: "Does one job but bleeds into a sibling's territory"). When-NOT (l.56-59) routes out cleanly to design-reviewer and names back-end surfaces, supporting constraint_explicitness=5 alongside the numbered Procedure (l.22-31).

---

## Calibration

**Judge agreement**: pending Fable §6 re-judge — injected post-run.

## Post-run injections (2026-07-03)

- **Calibration (spec §6, Fable 5)**: L1.4 exact-agreement 18/20 (0.90), ±1 20/20 (1.00); L1.2 random 2/2; adversarial probe vs router 1/4 / vs author labels 4/4 (weak-skill-stratified by design). Record: `../../calibration-fable.md`.
