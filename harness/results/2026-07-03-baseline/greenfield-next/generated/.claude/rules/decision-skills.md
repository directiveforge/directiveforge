# Decision Skills — When to Fire Which

> KB-05 ships 5 decision skills under `.claude/skills/decision/` (Starter set). This rule documents the router so the agent knows when to invoke them. Doctrine: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md.

## Anti-sycophancy meta-skill (auto-fires FIRST)

On any user message matching these phrase patterns, fire `decision/anti-sycophancy-meta` BEFORE evaluating content:

- "what do you think of my X" / "is my idea good" / "review my plan"
- "is this a good idea?" / "should I do X?"

The meta-skill detects the ownership signal, re-frames as pressure-test (not validation), then routes to the appropriate downstream skill. Skip ONLY for emotional-support framings ("feeling stuck", "vent", hedging language present + ownership absent).

## Phrase-mapping router (after meta-skill clears)

| User says | Route to |
|---|---|
| "what could go wrong" / "before we launch" / "stress-test the plan" | `decision/pre-mortem` |
| "should we commit" / "go/no-go" / "is this reversible" | `decision/reversibility-check` |
| "argue against this" / "what's the counter-case" / "steelman it" | `decision/steelman` |
| "how confident are you" / "give me a probability" | `decision/confidence-calibration` |
| Type-1 verdict from `reversibility-check` (no council installed at this tier) | `decision/steelman` + `decision/pre-mortem` sequentially, then recommend a DECISIONS entry |

LLM fallback is NOT enabled at Starter tier — use the phrase table only. If no phrase matches, respond normally.

## Surface fit per skill

Each skill declares `surface:` in its frontmatter. Respect the declaration:
- Mid-weight (steelman, pre-mortem, calibration, reversibility) → Chat or Code
- Meta (anti-sycophancy-meta) → all surfaces

If the current surface doesn't support the right skill, propose a surface handoff using <KIT_ROOT>/prompts/code-handoff-prompts.md patterns.

## References

- Full catalog + procedures: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md §3
- Per-skill spec: `.claude/skills/decision/<name>/SKILL.md`
- Evidence base: <KIT_ROOT>/research/2026-05-26-decision-techniques.md

> Graduation: at Intermediate tier, add the 3 HIGH skills (inversion / second-order-thinking / disconfirming-evidence-first) + the LLM fallback; at Advanced, add the 4 remaining skills + council-3-voice with its cost gate.
