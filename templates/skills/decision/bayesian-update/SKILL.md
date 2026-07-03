---
name: bayesian-update
description: Convert "I just learned X, should I change my mind?" into an explicit Bayesian update with prior, likelihood ratio, posterior, and an action-worthiness threshold. Fires on phrases like "new info changed my mind", "should I revise?", "update on X", "does this change anything", or any time the user is staring at a fresh data point and weighing whether it should flip a prior call. Use this whenever evidence arrives mid-decision — without the explicit math, motivated reasoning silently does it for you.
severity: MEDIUM
confidence: 0.55
surface: Chat
---

# Bayesian Update Skill

> **Trigger**: User has a pre-existing belief or decision-in-progress, receives new evidence, and is now asking whether the evidence should change their mind. Fires on "new info changed my mind", "should I revise?", "update on X", "does this change anything", "how should I weigh this new data".

## What this skill produces

A single update statement in the locked format:

```
Prior: X% → Posterior: Y% (shift Z pp). Action-worthy: yes/no.
```

Plus the underlying likelihood ratios that produced the shift, so the user (or a future you) can audit the update rather than treating the posterior as a black-box pronouncement.

The output's load-bearing role is the action-worthiness flag. Most "I just learned X" moments produce posterior shifts under 10 percentage points; those shifts are real but should not flip a decision. The skill names the threshold explicitly so the user doesn't confuse update-noise with update-signal.

## Before invoking — mandatory reads

1. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog row 10) and §10 (failure modes — the "treating every new fact as Bayesian-update-worthy" pattern).
2. `research/2026-05-26-decision-techniques.md` §2 row 10 (the canonical procedure).
3. The pre-existing belief or decision the user holds — restate it back before computing anything. A Bayesian update on a fuzzy prior produces a fuzzy posterior.
4. Sibling skill `confidence-calibration/SKILL.md` — the prior should already be in calibrated form (probability with reference class). If it isn't, run calibration first.

## Procedure

1. **State the prior probability.** Convert the user's pre-existing belief into a numeric prior `P(H)`. If they've previously run `confidence-calibration`, use that number. If not, eyeball with explicit reference class — vague priors corrupt the rest of the update.
2. **State the new evidence.** One declarative sentence. Strip emotional framing; the update is math on facts, not on how the facts feel.
3. **Estimate `P(evidence | H true)` and `P(evidence | H false)`.** This is the likelihood ratio — how much more likely is this evidence in worlds where H is true vs where H is false? If both are equal, the evidence is uninformative regardless of how dramatic it feels.
4. **Compute posterior (or eyeball ratio).** Bayes formula:

   ```
   posterior odds = prior odds × likelihood ratio
   P(H | E) = [P(E | H) × P(H)] / [P(E | H) × P(H) + P(E | ¬H) × P(¬H)]
   ```

   For quick estimation, work in odds form: `posterior_odds = prior_odds × (P(E|H) / P(E|¬H))`. A likelihood ratio of 3 triples the odds; a likelihood ratio of 0.5 halves them.
5. **Report shift size; if shift < 10pp, flag as not action-worthy.** The percentage-point shift is the headline number. Below 10pp is noise relative to the calibration uncertainty in the prior itself — surface it ("noted, but not action-worthy") rather than letting the user pivot on a sub-threshold signal. Above 10pp, name the threshold the new posterior crosses (decision flip, escalation trigger, etc.).

## Output format

Verbatim format from the dossier:

```
Prior: X% → Posterior: Y% (shift Z pp). Action-worthy: yes/no.
```

### Worked example

User: "We thought our Q3 launch had a 60% chance of hitting the revenue target. We just learned the third-party API we depend on is deprecating one of our critical endpoints in October. Should I update?"

```
Prior: P(hit target) = 60% (ref class: last 6 launches in this category, 4 hit).

Evidence: Critical third-party API endpoint deprecated in October —
falls inside the launch window.

Likelihood ratio:
  P(deprecation notice | will hit target) ≈ 0.30
    (some launches survive vendor deprecations via migration)
  P(deprecation notice | will miss target) ≈ 0.70
    (deprecations in-window correlate strongly with misses in our history)
  LR = 0.30 / 0.70 ≈ 0.43

Prior odds: 60/40 = 1.5
Posterior odds: 1.5 × 0.43 ≈ 0.65
Posterior probability: 0.65 / (1 + 0.65) ≈ 39%

Prior: 60% → Posterior: 39% (shift 21 pp). Action-worthy: yes.

Threshold crossed: posterior now below 50% — decision flips from
"ship as planned" to "either delay or scope-cut to remove API dependency".
```

A counter-example where the skill correctly says no: user reports a single user-research interview that contradicted the plan. `P(one contradicting interview | plan is right)` ≈ 0.40; `P(one contradicting interview | plan is wrong)` ≈ 0.55. LR ≈ 0.73. Prior 70% → posterior ≈ 63%. Shift 7pp. **Not action-worthy** — one data point doesn't move a calibrated prior across a decision threshold.

## Anti-patterns

- **Treating every new fact as Bayesian-update-worthy.** The 10pp threshold exists because most updates are noise. If the user runs this skill on every new email, they're confusing "new" with "decision-relevant".
- **Ignoring evidence cherry-picking.** A user who reports only the evidence that supports their preferred direction will produce systematically biased posteriors. Ask explicitly: "what evidence in the other direction also arrived?" before computing.
- **False precision in likelihood ratios.** `P(E|H) = 0.347` produced without a reference class is theatre. Round to 0.1 or 0.2 increments unless the user has a real frequency table behind the estimate.
- **Updating on the evidence twice.** If the user already mentioned the evidence informally during prior-setting, then formally during the update, they've double-counted. Sanity-check: is this genuinely new, or is it the prior wearing a hat?
- **Gap signal — thinly shipped as a standalone production Skill.** The dossier flags this skill at confidence 0.55 specifically because it's underrepresented in shipped Skill catalogs (partial implementations in promptolis and neurofoo only). The math is canonical (Tetlock superforecaster corpus, Bayesian inference); the SKILL.md format for it isn't yet a community-shared artifact. Treat this skill as opportunity rather than precedent — re-verify the format against any new community Skills at the next quarterly cadence.

## Gotchas

- **Likelihood ratios are harder than priors.** Most users can guess a prior; few can guess `P(E | H)` and `P(E | ¬H)` separately. Force the two-question framing — never let them collapse it into "this evidence is 70% credible" (that's not what likelihood ratio means).
- **Odds form is faster than probability form.** For quick mental math, work in odds. Prior 80% = 4:1 odds. LR of 2 → posterior odds 8:1 → posterior probability ≈ 89%. Saves the user from arithmetic errors mid-conversation.
- **Action-worthiness threshold is calibrated to decision granularity.** The 10pp default works when the decision has multiple thresholds (50%, 70%, 90%). On a binary one-threshold decision, even a 5pp shift across the threshold is action-worthy; on a continuous decision, 20pp may not be. Adjust the threshold to the decision, not the other way around.
- **Posterior of 50% is not the same as "no information".** A posterior at exactly 50% after starting at 80% means strongly disconfirming evidence — the decision should flip. Don't read 50% as "shrug".

## When NOT to use

- **First-time decisions with no prior.** If the user has no pre-existing belief, run `confidence-calibration` to set one, then return to this skill on the next evidence arrival.
- **Decisions with no resolution criterion.** Bayesian updates need a hypothesis with a future verifiable outcome. "Is this beautiful?" can't be updated; "will this campaign hit 10K signups?" can.
- **Tone checks, single-fact lookups, emotional-support framings.** Wrong tool, wrong cost. Route to `disconfirming-evidence-first` or `anti-sycophancy-meta`'s opt-out path.
- **When the evidence is huge and obvious.** If the user already knows the decision flipped ("the customer cancelled — we don't have a launch anymore"), they don't need a calibrated update; they need to act. Skill is for ambiguous evidence, not unambiguous facts.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3, §10.
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 10.
- Primary sources:
  - Tetlock, *Superforecasting: The Art and Science of Prediction* (Crown, 2015) — superforecaster signature pattern of small, frequent, evidence-anchored updates rather than large infrequent flips.
  - Bayesian inference canon — Bayes 1763 *An Essay towards solving a Problem in the Doctrine of Chances*; Jaynes, *Probability Theory: The Logic of Science* (Cambridge, 2003) for the modern treatment.
  - Promptolis + neurofoo/agent-skills — partial Bayesian-update Skill implementations referenced in the dossier as the closest current production analogs.
- Sibling skills:
  - `confidence-calibration` — produces the prior this skill updates from.
  - `disconfirming-evidence-first` — when the user wants a qualitative review rather than a numeric update.
  - `pre-mortem` — when the new evidence is bad news and the user is weighing whether the plan still ships.
