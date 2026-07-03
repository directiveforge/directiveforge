---
name: 10-10-10
description: Forecast the consequences of a decision at three horizons — 10 minutes, 10 months, 10 years — to surface the implicit discount rate and the horizon at which the call would flip. Fires on phrases like "how will this look later", "am I being short-term?", "trade-off framing", "10 minutes 10 months 10 years". Use when the user is weighing short-term comfort against long-horizon consequences and needs the time-horizon math made explicit.
severity: MEDIUM
confidence: 0.65
surface: Chat
---

# 10-10-10 Skill

> **Trigger**: User is making a decision where short-term and long-term effects diverge, and the dominant pull is toward the short-term frame (or vice-versa). The skill forces the three-horizon comparison so the implicit time-discount becomes visible.

## What this skill produces

A three-row table — 10 minutes, 10 months, 10 years — with the forecast user-state at each horizon, plus a horizon-flip note identifying when (if ever) the decision would reverse. The user leaves seeing the discount rate they're implicitly applying. The skill does not recommend a decision; it makes the trade-off math legible so the user can choose with eyes open.

## Before invoking — mandatory reads

1. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog entry) and §9 §2 (the market-expansion scenario uses 10-10-10 as a council sub-component).
2. `research/2026-05-26-decision-techniques.md` §2 row 3 (canonical procedure).
3. The decision itself — must be concrete enough that the three horizons produce different answers. "Should I take up running" doesn't flip across horizons; "should I quit my job to start a company" does.

## Procedure

1. **Restate decision.** One sentence, user-confirmed. The skill is invariant to phrasing; the restatement just locks the decision so all three horizons forecast the same call.
2. **Forecast user state at 10 minutes** — immediate cost/benefit. What does the user feel / pay / gain in the first few minutes after the decision lands? Concrete: "10 minutes after sending the resignation email, you feel relief and your manager calendar-invites you for tomorrow."
3. **Forecast at 10 months** — mid-horizon second-order effects. What's the user's life look like at the ~1-year mark? Concrete: "10 months in, you've burned $40K of savings, shipped MVP, have 12 paying customers, and you're either ramen-profitable or pivoting."
4. **Forecast at 10 years** — long-horizon path dependencies. What does the path opened or closed by this decision look like a decade later? Concrete: "10 years out, you're either a founder running a $5M ARR business or you've returned to FAANG with founder-experience on your resume; the alternative — never having tried — is the path you closed."
5. **Identify the horizon at which the call would flip.** If the user weighs 10 minutes most heavily, the answer is X; if 10 months, Y; if 10 years, Z. The flip-point is where the discount rate matters most. State it explicitly: "Decision flips between 10 months and 10 years — the call depends on whether you weight medium-horizon savings depletion or long-horizon optionality more heavily."
6. **Surface the implicit discount rate.** What rate of time-preference does the user's current lean imply? "Choosing the 10-minute comfort here implies a discount rate that values present pain-avoidance ~3x the 10-year optionality cost." Numeric precision is unnecessary; the qualitative direction is the load-bearing output.

## Output format

A three-row table plus a flip-note section:

```markdown
## Decision
[One-sentence restatement]

## Forecast at three horizons
| Horizon | User state | Cost / benefit |
|---------|-----------|----------------|
| 10 minutes | [Immediate post-decision state] | [Concrete short-term effect] |
| 10 months | [Mid-horizon state] | [Concrete mid-term effect] |
| 10 years | [Long-horizon state] | [Concrete long-term effect, named path-dependency] |

## Horizon-flip note
The call flips between [horizon A] and [horizon B]. If you weight [A] more heavily, the answer leans [X]; if [B], leans [Y].

## Implicit discount rate
Your current lean implies a discount rate that values [near-horizon weight] over [far-horizon weight] at approximately [qualitative ratio]. Is that the discount rate you'd endorse if you were stating it explicitly?
```

Worked shape: a user deciding whether to ship a quick fix or refactor a fragile area. 10 minutes: quick fix lands, on-call quiets, user goes to bed. 10 months: the fragile area has accumulated 4 more quick fixes; the next on-call rotation will resent the team. 10 years: this codebase pattern has either been refactored away or the project is dead. Flip between 10 months and 10 years; discount rate currently favors on-call comfort over team morale at ~2:1.

## Anti-patterns

- **Forcing all three horizons when only two are decision-relevant.** If 10 years adds nothing meaningful ("either way, I'm still alive and employed"), drop it and run a 10-minute / 10-month comparison. Forcing the third horizon for symmetry is false depth.
- **False precision in the 10-year column.** "In 10 years, the SaaS market will have consolidated and AI will have eaten 40% of analyst jobs" is unfalsifiable speculation. Constrain 10-year forecasts to *path-dependencies the decision opens or closes*, not market predictions.
- **Naming a decision before stating the discount rate.** The skill ends at the flip-note + implicit-rate; recommending a choice is out of scope. Let the user weight the horizons.
- **Confusing 10-10-10 with cost-of-inaction.** If the question is "should I wait", route to `cost-of-inaction` — different framing (status-quo cost vs horizon-flip).
- **Treating 10 minutes as throwaway.** Immediate cost/benefit shapes whether the user actually executes the decision; skipping it in favor of "the real long-term effects" loses the comfort/discomfort tradeoff that often drives behavior.

## Gotchas

- **The "10" numbers are anchors, not constraints.** If the decision-relevant horizons are 10 minutes / 6 weeks / 3 years, use those — the skill name is mnemonic, the procedure is "three horizons spanning short, medium, long." Don't force calendar-10 if 3 is the real medium-horizon for the decision.
- **Path-dependency framing is the heavy lift for the long horizon.** Concrete user-state at 10 years is often unknowable; path-dependencies (which futures the decision opens or closes) are tractable. Default to path-dependencies when state-prediction gets speculative.
- **The discount-rate surface is the load-bearing output.** Users often haven't named their own time-preference; making it explicit ("you're implicitly discounting future-you at ~3:1 versus present-you") is what shifts decisions. If the skill ends without this surfaced, it has under-delivered.
- **Don't recommend a horizon weighting.** That's the user's call. The skill makes the math legible; choosing the weighting is the human's job.
- **Single-turn forecasting** — this is a Chat-class skill by design. If the decision genuinely needs multi-horizon analysis with sources and base rates, escalate to `confidence-calibration` (for the probabilities) or `council-3-voice` (for full deliberation).

## When NOT to use

- **Decisions where all three horizons converge.** If the answer is the same at 10 minutes and 10 years, the skill produces no useful output. Route to `disconfirming-evidence-first` for a quick review instead.
- **Decisions about timing specifically** ("should I wait until Q3?") — route to `cost-of-inaction`. 10-10-10 is about *whether* to act; cost-of-inaction is about *when*.
- **High-stakes Type-1 decisions.** A single-skill 10-10-10 is insufficient for irreversible commits; use it as a sub-component within `council-3-voice` (per KB-05 §9 §2's market-expansion scenario), not standalone.
- **Emotional-support requests.** `anti-sycophancy-meta` should detect and skip; forecasting the user's state at 10 years on a vulnerability disclosure is callous.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog), §9 §2 (scenario use).
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 3.
- Primary sources:
  - Suzy Welch, *10-10-10: A Fast and Powerful Way to Get Unstuck in Love, at Work, and with Your Family* (Scribner, 2009) — canonical framework origin.
  - `neurofoo/agent-skills` GitHub repo (`/thinking-frameworks`) — production-shipped Skill listing 10-10-10 among the framework set.
- Sibling skills:
  - `cost-of-inaction` — when the question is "when" not "whether"; complements 10-10-10's horizon framing with status-quo-cost math.
  - `second-order-thinking` — when the user wants knock-on effects rather than time-horizon comparisons.
  - `council-3-voice` — when the decision is Type-1 and 10-10-10 should be a sub-component of full deliberation rather than the standalone answer.
