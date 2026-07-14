# Decision Skills — When to Fire Which

> KB-05 ships 5 decision skills under `.claude/skills/decision/` at this project's Starter tier. This rule documents the router so the agent knows when to invoke them. Doctrine: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md.

## Installed at this tier (Starter — 5 BLOCKER skills)

`anti-sycophancy-meta` · `pre-mortem` · `steelman` · `confidence-calibration` · `reversibility-check`

NOT installed (higher tiers): `inversion`, `second-order-thinking`, `disconfirming-evidence-first`, `10-10-10`, `cost-of-inaction`, `bayesian-update`, `council-3-voice`. Never route to these — use the fallbacks below.

## Anti-sycophancy meta-skill (auto-fires FIRST)

On any user message matching these patterns, fire `decision/anti-sycophancy-meta` BEFORE evaluating content:
- "what do you think of my X" / "is my idea good" / "review my plan"
- "is this a good idea?" / "should I do X?"

It re-frames as pressure-test (not validation), then routes by artifact type: plan → `pre-mortem`; argument → `steelman`; **finished artifact** (email/draft/code) → run a single-pass disconfirming review INLINE (list what's wrong ranked by severity, force a verdict), since `disconfirming-evidence-first` is not installed at this tier. Skip ONLY for emotional-support framings ("feeling stuck", "vent"; hedging present + ownership absent).

## Phrase-mapping router (after the meta-skill clears)

| User says | Route to |
|---|---|
| "what could go wrong" / "before we launch" / "stress-test the plan" | `decision/pre-mortem` |
| "should we commit" / "go/no-go" | `decision/reversibility-check` |
| "argue against this" / "what's the counter-case" / "convince me I'm wrong" | `decision/steelman` |
| "how confident are you" / "probability" / "what's the chance" | `decision/confidence-calibration` |
| Type-1 verdict from `reversibility-check` (no council at this tier) | run `decision/steelman` + `decision/pre-mortem` sequentially, then recommend a DECISIONS.md entry |

LLM fallback: **DISABLED** at Starter tier (KB-05 §12.1) — phrase-mapping only. An unmatched decision-shaped question gets a direct answer or a clarifying question, never a guessed skill.

## Surface fit per skill

- `anti-sycophancy-meta` → all surfaces.
- `pre-mortem` / `steelman` / `confidence-calibration` / `reversibility-check` → Chat or Code.

No council is installed at this tier, so there is no 15×-token council cost gate to manage. Graduating to Intermediate adds `inversion` / `second-order-thinking` / `disconfirming-evidence-first` + the LLM fallback; Advanced adds the council + its cost gate.

## References

- Doctrine + full 12-skill catalog: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md §3
- Per-skill spec: `.claude/skills/decision/<name>/SKILL.md`
