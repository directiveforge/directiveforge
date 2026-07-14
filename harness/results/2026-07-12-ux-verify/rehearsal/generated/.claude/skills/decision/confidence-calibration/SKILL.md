---
name: confidence-calibration
description: Convert vague confidence into a Brier-style probability with reference class, base rate, and 80% confidence interval. Use this skill whenever the user asks "how sure are you?" / "give me a probability" / "what's the chance" — or any time the agent is about to commit to a numeric forecast without naming the reference class behind it.
severity: BLOCKER
confidence: 0.90
surface: Chat-or-Code
---

# Confidence Calibration Skill

> **Trigger**: Use this skill the moment a decision-shaped question demands a probability — "how sure are you?", "give me a probability", "what's the chance", "how likely is X". Also auto-fire when the agent is about to assert a forecast without naming the reference class it's drawn from. Math is portable to Chat; Code helps when the reference class lives in repo data (test pass rates, deploy success rates, historical incident counts).

## What this skill produces

A single calibrated probability statement in the locked Brier format:

```
P=X (ref class: Y, base rate: Z). 80% CI: [a,b].
```

Plus, optionally, a one-line log entry for outcome tracking. The output is decision-grade: external reviewers (or a future you) can audit both the probability and the reasoning that produced it.

## Before invoking — mandatory reads

1. `<KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog), §7.1 (frame-reversal context), §10 (failure modes — false-precision row).
2. `<KIT_ROOT>/research/2026-05-26-decision-techniques.md` §2 row 7 (canonical procedure + output column).
3. Any project-specific outcome log (e.g., `decisions/calibration-log.md`). If one does not exist, the first invocation should propose creating one — calibration without outcome tracking is theatre.

## Procedure

1. **State the claim.** Restate the prediction in a single declarative sentence with an unambiguous resolution criterion (so the future can verify it).
2. **Assign initial probability.** Eyeball estimate before any reference-class work — this is the "intuition prior" the reference class will correct.
3. **List base-rate reference class.** Name an explicit population of analogous past events ("of N prior launches in this category…", "of M PRs of this size in this repo…"). If you cannot name a reference class, that is the finding — flag it and lower confidence accordingly.
4. **Adjust probability by base rate.** Move the intuition prior toward the reference-class base rate. The size of the adjustment depends on the strength of case-specific signals — explain it in one sentence.
5. **Output Brier-style probability (0–1) with reference class.** Use the locked format: `P=X (ref class: Y, base rate: Z).`
6. **Optionally produce 80% confidence interval.** Lower + upper bound the answer would still fall within 4 times out of 5. The interval must exclude at least some plausible outcomes — a CI that contains "everything" has zero information.
7. **Log for outcome tracking.** Append one row to the calibration log: claim, P, CI, resolution date. Without the log, calibration cannot improve over time.

## Output format

Verbatim format from the dossier:

```
P=X (ref class: Y, base rate: Z). 80% CI: [a,b].
```

### Worked example

User: "How likely is this deploy to roll back within 24 hours?"

```
Claim: This deploy will be rolled back within 24 hours of going live.

P=0.18 (ref class: last 40 production deploys in this repo, 
base rate: 7 of 40 rolled back = 17.5%). 80% CI: [0.10, 0.30].

Adjustment from intuition prior (0.10): the diff touches the auth
middleware, which historically correlates with rollbacks; nudged
upward toward base rate.

Log: 2026-05-27 / deploy-abc123 / P=0.18 / CI [0.10, 0.30] /
resolves 2026-05-28 18:00 UTC.
```

## Anti-patterns

- **False precision (3 decimals on vibes)** — `P=0.873` produced without a reference class is theatre. Round to 0.05 or 0.10 increments unless the reference class actually supports the precision.
- **Confidence intervals that contain "everything"** — `80% CI: [0.05, 0.95]` is information-free. If you cannot exclude any range, say "I have no reference class for this" instead.
- **Skipping the reference class** because the question feels obvious. The reference class IS the work; the number is a side-effect.
- **Not logging for outcome tracking.** A probability that is never resolved against reality cannot calibrate. The log is the discipline; the format is the artifact.
- **LLM-as-judge overconfidence.** Per *Calibrating LLM Judges* (arXiv 2512.22245): *"LLM judges are known to be overconfident, systematically expressing higher confidence than their empirical accuracy supports."* When the model's intuition prior is high (≥0.80), shrink it toward the base rate harder than feels natural.

## Gotchas

- The reference class is the most contested step. Two analysts can pick different reference classes and get different probabilities — both legitimate. Surface the choice explicitly so the user can challenge it.
- "Base rate of zero" is suspicious. If your reference class has never seen the event, the population is probably too narrow or too small. Widen until you find a non-zero base rate, then narrow with adjustments.
- The 80% CI is wider than people expect. If your CI feels comfortable, it is probably too narrow. Tetlock's superforecasters' signature pattern is wider intervals than novices choose.
- Calibration is a long game. A single P=0.20 prediction that resolves "happened" tells you nothing. Calibration measurements (Brier score, ECE) need ≥20 logged predictions to be meaningful.

## When NOT to use

- For questions without a verifiable resolution criterion ("is this beautiful?", "is this the right vibe?"). Calibration requires a future fact to check against.
- For deterministic queries where the answer is known with certainty (a closed-form calculation, a database lookup). Probability is the wrong frame.
- For tone checks or single-fact lookups (use `disconfirming-evidence-first` instead).
- When the cost of getting the probability wrong is less than the cost of running the procedure. For a Pro-tier user weighing a 5-second decision, calibration is overkill.

## References

- KB-05: `<KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md`
- Dossier: `<KIT_ROOT>/research/2026-05-26-decision-techniques.md` §2 row 7
- Primary sources:
  - Tetlock, *Superforecasting: The Art and Science of Prediction* (Crown, 2015) — reference-class forecasting + 80% CI discipline.
  - Brier, "Verification of Forecasts Expressed in Terms of Probability," *Monthly Weather Review* 78(1):1–3 (Jan 1950) — original Brier score.
  - Metaculus / Manifold prediction-market epistemics — community calibration norms.
  - *Calibrating LLM Judges*, arXiv 2512.22245 (2025) — linear-probe method + verbatim overconfidence finding.
- Sibling skills: `bayesian-update` (when new evidence shifts the prior), `disconfirming-evidence-first` (when the question is qualitative, not probabilistic), `reversibility-check` (when the probability would change the decision mode).

## Starter-tier routing note (this project)

Not installed at this tier (Starter): `disconfirming-evidence-first`, `bayesian-update`. Fallbacks:
- **Qualitative (non-probabilistic) question** → run the single-pass disconfirming review INLINE instead of routing to `disconfirming-evidence-first`.
- **New evidence should shift the estimate** → update the prior INLINE (state prior P, the evidence's likelihood ratio, the posterior) instead of routing to `bayesian-update`.

Full router: `.claude/rules/decision-skills.md`.
