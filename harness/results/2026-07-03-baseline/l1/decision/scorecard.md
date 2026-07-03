# Pack Scorecard — decision (Layer 1, baseline, 2026-07-03)

**Models**: static=claude-sonnet-5 · author=claude-opus-4-8 · router=claude-haiku-4-5 · judge=claude-opus-4-8 · calibration=claude-fable-5

**Caveats**: All L1.2/L1.4 figures are single-run (n as noted per section) unless L1.3 explicitly re-samples. No letter grades — see SCORECARD-FORMAT.md. `judge_agreement` calibration figure is pending — injected post-run by Fable §6 re-judge.

---

## L1.1 — Static checks

Target: `templates/skills/decision/`. NA family: **S6** (template-source dirs are exempt — `{{PLACEHOLDER}}` expected under `templates/`). No empty dirs.

Pack rollup: **60/60 passed (pass_rate 1.0)**

| Artifact | S1 | S2 | S3 | S4 | S5 | S6 | Pass rate |
|---|---|---|---|---|---|---|---|
| 10-10-10/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| anti-sycophancy-meta/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| bayesian-update/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| confidence-calibration/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| cost-of-inaction/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| council-3-voice/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| disconfirming-evidence-first/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| inversion/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| pre-mortem/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| reversibility-check/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| second-order-thinking/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |
| steelman/SKILL.md | PASS | PASS | PASS | PASS | PASS | N/A | 1.0 (5/5) |

---

## L1.2 — Trigger precision/recall (single run, 10 prompts/skill: 5 positive + 5 negative)

Pack micro: **TP=53, FP=1, FN=7 → precision 0.9815, recall 0.8833, f1 0.9298**

| Skill | TP | FP | FN | positives (n) | precision | recall | f1 |
|---|---|---|---|---|---|---|---|
| 10-10-10 | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| anti-sycophancy-meta | 2 | 0 | 3 | 5 | 1.0 | 0.4 | 0.5714 |
| bayesian-update | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| confidence-calibration | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| cost-of-inaction | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| council-3-voice | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| disconfirming-evidence-first | 5 | 1 | 0 | 5 | 0.8333 | 1.0 | 0.9091 |
| inversion | 1 | 0 | 4 | 5 | 1.0 | 0.2 | 0.3333 |
| pre-mortem | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| reversibility-check | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| second-order-thinking | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |
| steelman | 5 | 0 | 0 | 5 | 1.0 | 1.0 | 1.0 |

**Notable confusions (single run, n=5 positives/skill)**:
- `anti-sycophancy-meta` (recall 0.4, n=5): 3 of 5 positive prompts fired a downstream sibling instead (pre-mortem, disconfirming-evidence-first, steelman) — meta-skill under-fires in favor of the more specific skill it would otherwise route to.
- `inversion` (recall 0.2, n=5): 4 of 5 positive prompts fired `pre-mortem` or `steelman` instead of `inversion` — router confuses inversion's "sabotage/what-would-break-this" framing with pre-mortem's "assume it failed" framing.
- `disconfirming-evidence-first` (precision 0.8333, n=5): 1 false positive on a negative ("poem — is it any good?") prompt.

---

## L1.3 — Repeatability (adaptive batch-5, min10/target20/max30, half-width 0.08)

| Skill | n | activations | proportion | Wilson 95% CI | stopped early |
|---|---|---|---|---|---|
| 10-10-10 | 25 | 25 | 1.0 | [0.8668, 1.0] | true |
| anti-sycophancy-meta | 30 | 8 | 0.2667 | [0.1418, 0.4445] | false |
| bayesian-update | 25 | 25 | 1.0 | [0.8668, 1.0] | true |
| confidence-calibration | 25 | 25 | 1.0 | [0.8668, 1.0] | true |
| cost-of-inaction | 25 | 25 | 1.0 | [0.8668, 1.0] | true |
| council-3-voice | 30 | 29 | 0.9667 | [0.8333, 0.9941] | false |
| disconfirming-evidence-first | 25 | 25 | 1.0 | [0.8668, 1.0] | true |
| inversion | 30 | 10 | 0.3333 | [0.1923, 0.5122] | false |
| pre-mortem | 30 | 29 | 0.9667 | [0.8333, 0.9941] | false |
| reversibility-check | 25 | 25 | 1.0 | [0.8668, 1.0] | true |
| second-order-thinking | 25 | 25 | 1.0 | [0.8668, 1.0] | true |
| steelman | 25 | 25 | 1.0 | [0.8668, 1.0] | true |

**Note**: `anti-sycophancy-meta` and `inversion` did not converge within the max-30 budget (proportion << 1, wide CI) — these two are the pack's repeatability weak points, consistent with their L1.2 recall miss. `council-3-voice` and `pre-mortem` converged near-ceiling (0.9667) but did not hit the early-stop threshold within min10.

---

## L1.4 — Rubric (LLM-judge, n=12 artifacts, single judge pass)

Overall mean: **4.896** (n=12)

| Dimension | Mean (n=12) |
|---|---|
| actionability | 5.0 |
| scope_calibration | 4.583 |
| failure_content_quality | 5.0 |
| constraint_explicitness | 5.0 |

**Per-artifact scores**:

| Artifact | actionability | scope_calibration | failure_content_quality | constraint_explicitness |
|---|---|---|---|---|
| 10-10-10 | 5 | 5 | 5 | 5 |
| anti-sycophancy-meta | 5 | 1 | 5 | 5 |
| bayesian-update | 5 | 5 | 5 | 5 |
| confidence-calibration | 5 | 5 | 5 | 5 |
| cost-of-inaction | 5 | 5 | 5 | 5 |
| council-3-voice | 5 | 4 | 5 | 5 |
| disconfirming-evidence-first | 5 | 5 | 5 | 5 |
| inversion | 5 | 5 | 5 | 5 |
| pre-mortem | 5 | 5 | 5 | 5 |
| reversibility-check | 5 | 5 | 5 | 5 |
| second-order-thinking | 5 | 5 | 5 | 5 |
| steelman | 5 | 5 | 5 | 5 |

**Notable low score**: `anti-sycophancy-meta` scope_calibration = 1/5 — judge notes it is orchestrator-style (dispatches to pre-mortem/steelman/disconfirming-evidence-first and "produces no content evaluation; it routes"), pulling the dimension mean down from what would otherwise be a clean 5.0 across the board. This aligns with the same skill's L1.2 recall miss (0.4) and L1.3 non-convergence (0.2667) — three independent metrics agree `anti-sycophancy-meta` is the pack's outlier.

`council-3-voice` scope_calibration = 4/5 — judge notes a "hard dependency on reversibility-check gate" keeps it just under 5, but distinguishes it from the orchestrator-style defect (it does real synthesis work itself via subagents, not sibling-skill routing).

---

## Calibration

`judge_agreement`: **pending Fable §6 re-judge — injected post-run**

## Post-run injections (2026-07-03)

- **Calibration (spec §6, Fable 5)**: L1.4 exact-agreement 18/20 (0.90), ±1 20/20 (1.00); L1.2 random 2/2; adversarial probe vs router 1/4 / vs author labels 4/4 (weak-skill-stratified by design). Record: `../../calibration-fable.md`.
