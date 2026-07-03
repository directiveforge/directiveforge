---
name: inversion
description: Apply Munger-style inversion to a proposal. Instead of asking "is this a good idea?" — which invites the sycophantic baseline — re-frame as "how would we guarantee this fails?", enumerate failure mechanisms, then invert each into a constraint the plan must satisfy. Fires on phrases like "is this a good idea?", "should I do X?", "convince me". Use when the user is in evaluation mode on a single proposal and the default agent response would be validation.
severity: HIGH
confidence: 0.85
surface: Chat-or-Code
---

# Inversion Skill

> **Trigger**: User asks the agent to evaluate a single proposal in a way that invites validation ("is this a good idea?", "should I do X?", "convince me"). The skill flips the question into its negative ("how would we guarantee this fails?") and works backward from failure mechanisms to constraints.

## What this skill produces

A failure-mechanism → constraint mapping with a per-constraint score against the proposal as it stands. The output names which constraints the proposal already satisfies, which it violates, and which are unaddressed — surfacing the unaddressed-but-violated ones as blockers. The user leaves with a checklist of things the proposal must fix before it's evaluation-worthy, not a verdict on whether it's "good."

## Before invoking — mandatory reads

1. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §4 (anti-sycophancy as meta-skill) and §10 (contrarianism-cascade failure mode).
2. `research/2026-05-26-decision-techniques.md` §2 row 2 (canonical procedure) and §6 (failure-mode mitigations).
3. The proposal itself — get a one-paragraph restatement from the user before inverting. Inversion on a fuzzy proposal degenerates into reflexive negation.
4. If the user is emotionally invested in the proposal succeeding, `anti-sycophancy-meta` should have detected the ownership signal and routed here intentionally — confirm that re-framing was the chosen path, not validation.

## Procedure

1. **Restate the proposal.** One paragraph, user-confirmed. The inversion is only as sharp as the restatement; ambiguity here cascades into vague failure mechanisms.
2. **Re-frame: "How would we guarantee this fails?"** Literal phrasing. The point is to invert the evaluative frame entirely — not "what could go wrong" (which inversion shares with pre-mortem) but "what would a saboteur with knowledge of the plan do to ensure it fails?"
3. **List 5 mechanisms of guaranteed failure.** Each mechanism is a specific lever a saboteur (or reality) could pull. Vague ("bad timing") fails; specific ("the price point is set above the threshold the second-largest segment will tolerate, so they walk on launch day") passes.
4. **Invert each mechanism into a constraint the plan must satisfy.** Mechanism "price point too high for segment 2 → they walk" becomes constraint "plan must validate segment 2 price tolerance before launch." The inversion is mechanical: a thing that would cause failure becomes a thing the plan must prevent.
5. **Score the plan against those constraints.** Three states per constraint: ✅ satisfied (with evidence), ⚠ partially addressed (with the gap named), ❌ unaddressed. False positives ("we'll figure it out") count as ❌.
6. **Report unsatisfied constraints as blockers.** The output is the list of ❌ and ⚠ items, not a global verdict. Avoid "this is a bad idea" framing; the discipline produces "the plan satisfies 3 of 5 inverted constraints and has 2 unaddressed blockers."

## Output format

Markdown with four sections:

```markdown
## Proposal as restated
[One paragraph, user-confirmed]

## Inverted question
"How would we guarantee this fails?"

## Failure mechanisms → constraints
| # | Failure mechanism | Inverted constraint | Status | Evidence |
|---|-------------------|---------------------|--------|----------|
| 1 | [Specific saboteur lever] | [Plan must prevent X] | ✅/⚠/❌ | [What addresses or fails to address it] |
| 2 | [Specific saboteur lever] | [Plan must prevent Y] | ✅/⚠/❌ | [Same] |
| 3 | [Specific saboteur lever] | [Plan must prevent Z] | ✅/⚠/❌ | [Same] |
| 4 | [Specific saboteur lever] | [Plan must prevent W] | ✅/⚠/❌ | [Same] |
| 5 | [Specific saboteur lever] | [Plan must prevent V] | ✅/⚠/❌ | [Same] |

## Blockers (unsatisfied constraints)
- ❌ [Constraint] — [what's missing, and what evidence would change the status]
- ⚠ [Constraint] — [the gap, and the minimum addition to clear it]
```

Worked shape: proposal to launch a new pricing tier inverts to "price set in saboteur-friendly zone", "competitors copy the tier before differentiation", "internal sales team mis-positions the tier", "support cost per ticket invalidates the margin assumption", "tier launches before the upgrade-path UX exists." Each becomes a constraint; the unsatisfied ones become the launch blockers.

## Anti-patterns

- **Treating inversion as cynicism.** The output is "constraints to satisfy", not "reasons not to do it." Reflexive negation is the contrarianism-cascade failure mode from KB-05 §10.
- **Contrarianism cascade where every signal flips.** Inversion is a one-time frame-flip, not a habit of reversing every claim. If the user comes back with a refinement, evaluate the refinement on its own merits — don't auto-invert again.
- **Skipping step 4's mechanical inversion.** Free-form "what does this need to address" loses the discipline. The inversion is mechanical: each failure mechanism becomes exactly one constraint.
- **Conflating with pre-mortem.** Pre-mortem asserts the plan failed and reverse-engineers narratives. Inversion asks how a saboteur would force failure and converts each lever to a constraint. Outputs differ; if the user wanted failure narratives ranked Tiger/Paper-Tiger/Elephant, route to `pre-mortem` instead.
- **Producing a verdict instead of a blocker list.** "This is a bad idea" violates the skill's design. The skill produces "the plan satisfies N of 5 constraints" and lets the user weigh whether the unsatisfied ones are tolerable.

## Gotchas

- **The 5-mechanism cap is a feature** — fewer than 5 underfits, more than 5 dilutes. Force exactly 5; if you can only think of 3, the proposal is probably too vague (back to step 1).
- **Saboteur framing helps specificity** — "what would an adversary with full plan knowledge do?" produces sharper failure mechanisms than "what could go wrong?" The latter overlaps with pre-mortem.
- **Status emojis matter** — ✅/⚠/❌ is a visual gate; prose status ("addressed", "partially addressed", "not addressed") slides into hedging. Force the emoji.
- **The unsatisfied-constraint list is the answer** — users may push for a global verdict ("but is it good though?"). Decline to globalize; redirect to "you've got 2 blockers; if those clear, the constraints are satisfied."
- **Reflexive-negation detection** — if the agent finds itself inverting every subsequent message in the conversation, `anti-sycophancy-meta` should re-fire to detect the pattern and route to a different skill.

## When NOT to use

- **User wants brainstorming or option generation** — inversion pressure-tests a single proposal; it doesn't generate alternatives. Route to a brainstorming flow instead.
- **Genuinely fuzzy or pre-decisional proposals** — if step 1's restatement keeps failing, the user is in exploration mode, not evaluation mode. Use `10-10-10` or `second-order-thinking` to develop the idea before inverting it.
- **Emotional-support requests** — `anti-sycophancy-meta` should have caught this and skipped inversion. Pressure-testing emotional framings reads as combative.
- **Decisions where ≥3 mutually-exclusive options are on the table** — single-proposal inversion is the wrong tool. Route to `council-3-voice` per KB-05 §5.4.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §4, §5.2 (router), §10 (contrarianism-cascade mitigation).
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 2.
- Primary sources:
  - Charles T. Munger canon — inversion as a recurring mental model in *Poor Charlie's Almanack* (3rd ed., Donning, 2005).
  - `neurofoo/agent-skills` GitHub repo (`/inversion`) — production-shipped Skill following the same procedure shape.
  - Promptolis "Steelman Devil's Advocate" 2026 Original — overlaps with inversion in the contrarian-mode discipline.
- Sibling skills:
  - `pre-mortem` — failure-narrative variant; use when the user wants Tiger/Paper-Tiger/Elephant tagging rather than constraint mapping.
  - `steelman` — different frame (strongest counter-position from its own evidence), use when the user asks "argue against this" rather than "is this a good idea?"
  - `anti-sycophancy-meta` — fires before inversion on user-owned-proposal questions.
