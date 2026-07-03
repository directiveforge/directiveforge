---
name: cost-of-inaction
description: Quantify the recurring cost of the status quo and compute the breakeven horizon against acting now. Use this skill whenever the user asks "should I wait" / "is now the right time" / "let's revisit later" — or any time the agent is about to recommend "monitor and re-evaluate" without naming what monitoring costs.
severity: MEDIUM
confidence: 0.55
surface: Chat
---

# Cost of Inaction Skill

> **Trigger**: Use this skill the moment a decision question is framed around waiting — "should I wait", "is now the right time", "let's revisit later", "let's hold off and see". Also auto-fire when the agent itself is about to recommend deferring a decision; "do nothing" is a choice with a price tag, and that price tag is what this skill surfaces. Single-turn comparison, no filesystem needs — Chat is sufficient.

## What this skill produces

A three-line ledger: status-quo cost per period, action cost, breakeven horizon. Plus a single explicit flag: is inaction the silent expensive option here?

```
Status-quo cost = $X/period. Action cost = $Y. Breakeven: T.
```

The point is not the precision of the dollar figures; the point is that the cost of waiting becomes visible. Default agentic behavior is to validate "let's wait and see" without naming what the wait costs — this skill inverts that default.

## Before invoking — mandatory reads

1. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog — note the 0.55 confidence rating and the "gap signal" framing), §10 (failure modes).
2. `research/2026-05-26-decision-techniques.md` §2 row 9 (canonical procedure + output column; also the "thinly shipped as a standalone Skill" note).
3. Any project-specific opportunity-cost log (operations costs, monitoring subscriptions, technical-debt interest tracking).

## Procedure

1. **State the decision and the "do nothing" option.** Make both explicit. The default-do-nothing option is often unstated, which is exactly why it goes un-costed. Name it: "If we wait, we continue to [Z]."
2. **Quantify recurring cost of status quo per week/month.** Engineering hours lost to workarounds, customer churn from the unfixed issue, audit / compliance exposure that accumulates, opportunity cost of capital tied up in the current configuration. Pick the right period unit — weekly for fast-moving operational costs, monthly for strategic ones.
3. **Compute breakeven horizon.** If acting now costs `$Y` and waiting costs `$X/period`, breakeven is `T = Y / X` periods. Beyond `T`, inaction costs more than action.
4. **Compare to the cost of acting now.** Surface the comparison explicitly. Often the action cost feels large in absolute terms while the recurring status-quo cost is invisible because it never lands in a single line item.
5. **Flag if inaction is the silent expensive option.** State it in one sentence: "Waiting is the more expensive choice here" OR "Waiting is the cheaper choice here, breakeven at T". The flag is the deliverable; the math is the supporting evidence.

## Output format

Verbatim format from the dossier:

```
Status-quo cost = $X/period. Action cost = $Y. Breakeven: T.
```

### Worked example

User: "Should we upgrade our auth library now or wait until next quarter?"

```
Decision: upgrade auth library now vs defer to next quarter.
Do-nothing option: continue running v2 (EOL'd 8 months ago,
manual security patches monthly).

Status-quo cost = ~$3,200/month (1 engineer-day/mo manual
patching + ~$800/mo monitoring subscription that exists only
because the library is unsupported).

Action cost = ~$18,000 (3 engineer-weeks upgrade + regression
test cycle).

Breakeven: 5.6 months.

Flag: defer-to-next-quarter (3 months out) is the cheaper choice
in absolute terms — but the breakeven sits at 5.6 months, so if
the upgrade slips past Q3, inaction overtakes action as the
expensive option. Decide with the slip risk in mind, not the
absolute Q1-vs-Q2 framing.
```

## Anti-patterns

- **Treating inaction as free.** The default agentic failure mode this skill exists to correct. "Let's revisit later" reads as cautious; it is often expensive. Always name the cost of waiting before recommending the wait.
- **Spuriously precise dollar values.** `$3,247.50/month` produced from gut feel is theatre — same failure mode as `confidence-calibration` row's false-precision warning. Round to one significant figure unless the data supports the precision.
- **Confusing breakeven with recommendation.** Breakeven horizon is a threshold, not an answer. The recommendation depends on the user's confidence in the action cost estimate, the recurring cost estimate, and the slip risk on the action timeline.
- **Single-skill canonical / thinly shipped (the meta-anti-pattern).** This skill ships in the kit's BLOCKER+HIGH+MEDIUM bundle because it covers a signature use-case the other skills don't — the cost of waiting. But the dossier's confidence rating is 0.55 because, unlike `pre-mortem` (0.95) or `confidence-calibration` (0.90), there is no canonical Klein-Kahneman / Tetlock-Brier-style production Skill shipped on LobeHub or `anthropics/skills` to point at as the reference implementation. The kit is shipping a first-of-its-kind production Skill here. Treat the procedure as the canon, not the marketplace pedigree, and re-verify against any later shipped Skill that defines the technique with stronger evidence.

## Gotchas

- **The status-quo cost is often invisible because it's distributed across many line items.** Workaround engineering time hides inside individual tickets; monitoring subscriptions hide inside infrastructure budgets; customer churn hides inside aggregate growth metrics. The skill's value is in pulling these apart and summing them.
- **"Information you don't get by waiting" is also a cost.** Cedric Chin's commoncog corpus signature pattern: every period you wait is a period you don't generate data that would inform the decision. Hard to quantify but worth flagging when the decision is information-dependent.
- **Some delays compound non-linearly.** Technical-debt interest, regulatory exposure, and brand-positioning windows can have step-function cost spikes (a regulation goes into force; a competitor takes a category). Linear `$X/period` assumes constant cost; flag when non-linear.
- **The breakeven horizon can be longer than the user's planning horizon.** If breakeven is 18 months and the user's planning horizon is 6 months, breakeven is irrelevant — wait is the right call. State the horizon comparison explicitly.

## When NOT to use

- For decisions with no time-value dimension. If the cost of waiting is genuinely zero (the option will be exactly as available in 12 months as it is today, no recurring cost), this skill produces noise.
- For purely qualitative decisions (tone, brand fit, aesthetic) where dollar figures are meaningless.
- For decisions already in flight — once execution has started, `pre-mortem` is the right tool, not `cost-of-inaction`.
- For emotional-support framings — the skill reads as cold when the user is asking for permission to defer a hard call. Anti-sycophancy-meta should detect this and skip routing here.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog severity + confidence), §10 (failure modes).
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 9.
- Primary sources:
  - `pre-mortem` and `second-order-thinking` skills imply the cost-of-inaction frame (failure-by-omission is one of the failure narratives `pre-mortem` generates).
  - Cedric Chin, commoncog corpus — signature pattern: *"the cost of waiting is information you don't get."* Canonical statement of the information-cost dimension.
- Sibling skills: `reversibility-check` (Type-1 decisions amplify the cost of getting the timing wrong), `confidence-calibration` (cost figures benefit from explicit reference classes), `pre-mortem` (when waiting itself is the candidate plan being pressure-tested).
