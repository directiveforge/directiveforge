# Decision Skills — When to Fire Which

> KB-05 ships 8 decision skills under `.claude/skills/decision/` at this Intermediate install (5 BLOCKER + 3 HIGH; council + the 3 MEDIUM skills are Advanced-only and NOT installed here). This rule documents the router so the agent knows when to invoke them. Doctrine: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md.

## Anti-sycophancy meta-skill (auto-fires FIRST)

On any user message matching these phrase patterns, fire `decision/anti-sycophancy-meta` BEFORE evaluating content:

- "what do you think of my X" / "is my idea good" / "review my plan"
- "is this a good idea?" / "should I do X?"

The meta-skill detects ownership signal, re-frames as pressure-test (not validation), then routes to the appropriate downstream skill. Skip ONLY for emotional-support framings ("feeling stuck", "vent", hedging language present + ownership absent).

## Phrase-mapping router (after meta-skill clears)

| User says | Route to |
|---|---|
| "what could go wrong" / "before we launch" | `decision/pre-mortem` |
| "should we commit" / "go/no-go" | `decision/reversibility-check` |
| "argue against this" / "what's the counter-case" | `decision/steelman` |
| "how confident are you" / "probability" | `decision/confidence-calibration` |
| "downstream effects" / "knock-on" | `decision/second-order-thinking` |
| "is X a good idea (give me critique)" | `decision/inversion` |
| "is my email good" / "quick review" | `decision/disconfirming-evidence-first` |
| Type-1 verdict from `reversibility-check` (no council installed at this tier) | `decision/steelman` + `decision/pre-mortem` sequentially, then recommend a DECISIONS entry |

LLM fallback (enabled at Intermediate): if no phrase matches AND the user message contains decision verbs (should/could/might) + a question mark, pick the single best skill by reading the YAML descriptions of the installed skills.

## Not installed at this tier (Intermediate)

`10-10-10`, `cost-of-inaction`, `bayesian-update`, and `council-3-voice` are Advanced-tier skills and are NOT installed. When a situation would call for one of them, use the inline fallback documented in each installed skill's "Tier note":
- ≥3 mutually-exclusive options / Type-1 irreversible → run `reversibility-check`, then `steelman` + `pre-mortem` sequentially, and recommend a DECISIONS entry (do NOT route to `council-3-voice`).
- "should I wait / is now the right time" → weigh the cost of waiting inline (no `cost-of-inaction` skill).
- "new evidence changed my mind" → do the prior→posterior update inline (no `bayesian-update` skill).
- "10 minutes / 10 months / 10 years" framing → reason through the three horizons inline (no `10-10-10` skill).

## Surface fit per skill

Each skill declares `surface:` in its frontmatter. Respect the declaration:
- Lightweight (disconfirming-evidence-first) → Chat
- Mid-weight (inversion, second-order-thinking, steelman, pre-mortem, confidence-calibration, reversibility-check) → Chat or Code
- Meta (anti-sycophancy-meta) → all surfaces

If the current surface doesn't support the right skill, propose a surface handoff using <KIT_ROOT>/prompts/code-handoff-prompts.md or <KIT_ROOT>/prompts/cowork-browser-operations.md patterns.

## References

- Full catalog + procedures: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md §3
- Per-skill spec: `.claude/skills/decision/<name>/SKILL.md`
- Evidence base: <KIT_ROOT>/research/2026-05-26-decision-techniques.md
