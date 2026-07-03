# Decision Skills — When to Fire Which

> KB-05 ships 11 decision skills under `.claude/skills/decision/` (the 12th, `council-3-voice`, is NOT installed here — it requires a Max+ plan tier for its ~15× token cost; add it later if the founder is on Max+). This rule documents the router so the agent knows when to invoke them. Doctrine: `<KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md`.

## Anti-sycophancy meta-skill (auto-fires FIRST)

On any user message matching these phrase patterns, fire `decision/anti-sycophancy-meta` BEFORE evaluating content:

- "what do you think of my X" / "is my idea good" / "review my plan"
- "is this a good idea?" / "should I do X?"

The meta-skill detects ownership signal, re-frames as pressure-test (not validation), then routes to the appropriate downstream skill. Skip ONLY for emotional-support framings ("feeling stuck", "vent", hedging present + ownership absent).

## Phrase-mapping router (after meta-skill clears)

| User says | Route to |
|---|---|
| "what could go wrong" / "before we launch" / "before the season opens" | `decision/pre-mortem` |
| "should we commit" / "go/no-go" / "sign the lease or not" | `decision/reversibility-check` |
| "argue against this" / "what's the counter-case" | `decision/steelman` |
| "how confident are you" / "probability" / "what are the odds" | `decision/confidence-calibration` |
| "downstream effects" / "knock-on" / "what does this enable" | `decision/second-order-thinking` |
| "is X a good idea (give me critique)" / "convince me" | `decision/inversion` |
| "is this playbook/email good" / "quick review" | `decision/disconfirming-evidence-first` |
| "10 minutes 10 months 10 years" / "short-term vs long-term" | `decision/10-10-10` |
| "is now the right time" / "should we wait" / "cost of waiting" | `decision/cost-of-inaction` |
| "new info changed my mind" / "should I revise" | `decision/bayesian-update` |

LLM fallback: if no phrase matches AND the message contains decision verbs (should/could/might) + a question mark, pick the single best skill by reading the YAML `description` fields of the installed skills.

## No-council fallback (this tier has no council installed)

When `decision/reversibility-check` returns **Type-1 (irreversible)** — e.g. a lease signature, a permanent supplier lock-in, a depot closure — there is no council to escalate to at this tier. Instead run `decision/steelman` + `decision/pre-mortem` sequentially, then recommend a `D{N}` ledger entry with reversal triggers before committing. Type-1 + money gate (a `D6`-class ceiling call) always ends in a `D{N}` lock, never a casual yes.

## Surface fit per skill

Each skill declares `surface:` in its frontmatter. Respect it:

- Lightweight (10-10-10, cost-of-inaction, disconfirming-evidence-first, bayesian-update) → Chat
- Mid-weight (inversion, second-order, steelman, pre-mortem, calibration, reversibility) → Chat or Code
- Meta (anti-sycophancy-meta) → all surfaces

If the current surface doesn't support the right skill, propose a surface handoff using `<KIT_ROOT>/prompts/code-handoff-prompts.md` or `<KIT_ROOT>/prompts/cowork-browser-operations.md`.

## References

- Full catalog + procedures: `<KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3
- Per-skill spec: `.claude/skills/decision/<name>/SKILL.md`
