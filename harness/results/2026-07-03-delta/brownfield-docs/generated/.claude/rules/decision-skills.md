# Decision Skills — When to Fire Which

> KB-05 ships 8 decision skills under `.claude/skills/decision/` at this project's Intermediate tier (5 BLOCKER + 3 HIGH; council + the 3 MEDIUM skills are Advanced-only, not installed). This rule documents the router so the agent knows when to invoke them. Doctrine: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md.

## Anti-sycophancy meta-skill (auto-fires FIRST)

On any user message matching these phrase patterns, fire `decision/anti-sycophancy-meta` BEFORE evaluating content:

- "what do you think of my X" / "is my idea good" / "review my plan"
- "is this a good idea?" / "should I do X?" / "thoughts on my plan?"

The meta-skill detects the ownership signal, re-frames as pressure-test (not validation), then routes to the appropriate downstream skill by artifact type. Skip ONLY for emotional-support framings ("feeling stuck", "vent", hedging present + ownership absent) or when the user names a specific technique/frame (route straight to that skill).

## Phrase-mapping router (after meta-skill clears)

| User says | Route to |
|---|---|
| "what could go wrong" / "before we launch" / "stress-test the plan" | `decision/pre-mortem` |
| "should we commit" / "go/no-go" / "is this big" | `decision/reversibility-check` |
| "argue against this" / "what's the counter-case" / "convince me I'm wrong" | `decision/steelman` |
| "how confident are you" / "probability" / "what's the chance" | `decision/confidence-calibration` |
| "downstream effects" / "knock-on consequences" / "second-order" | `decision/second-order-thinking` |
| "how would we guarantee this fails" / "turn the risks into requirements" / "flip it into constraints" | `decision/inversion` |
| "tell me only what's wrong" / "tear into it" / "find the holes" | `decision/disconfirming-evidence-first` |
| Type-1 verdict from `reversibility-check` (no council installed at this tier) | `decision/steelman` + `decision/pre-mortem` sequentially, then recommend a `governance/DECISIONS.md` entry |

LLM fallback: if no phrase matches AND the user message contains decision verbs (should/could/might) + a question mark, pick the single best installed skill by reading the YAML `description` fields.

## No council at this tier

`decision/council-3-voice` is Advanced-only and is NOT installed here. When a decision is Type-1 (irreversible) per `reversibility-check`, do NOT route to council — run `decision/steelman` then `decision/pre-mortem` inline, then recommend locking the call in `governance/DECISIONS.md`. This matters for money-gated calls (e.g., a lease renewal above the D6 ceiling is Type-1).

## Surface fit per skill

- Lightweight (`disconfirming-evidence-first`) → Chat
- Mid-weight (`inversion`, `second-order-thinking`, `steelman`, `pre-mortem`, `confidence-calibration`, `reversibility-check`) → Chat or Code
- Meta (`anti-sycophancy-meta`) → all surfaces

If the current surface doesn't support the right skill, propose a surface handoff using `<KIT_ROOT>/prompts/code-handoff-prompts.md` patterns.

## References

- Full catalog + procedures: <KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md §3
- Per-skill spec: `.claude/skills/decision/<name>/SKILL.md`
