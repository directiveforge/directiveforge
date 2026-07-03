---
name: disconfirming-evidence-first
description: Review a present, finished artifact (email, analysis, code change, claim) by searching ONLY for evidence it is wrong — never balancing pros and cons. Triggered when the user explicitly asks for flaws only — "tell me only what's wrong", "don't tell me what works", "tear into it", "what would make this fail", "find the holes". Requires a falsifiable claim with a ship / no-ship criterion; declines subjective-only artifacts with no objective standard (poems, colour choices). This skill is asymmetric on purpose — balanced review is the sycophantic default and produces validation, not audit.
severity: HIGH
confidence: 0.80
surface: Chat
---

# Disconfirming-Evidence-First Skill

> **Trigger**: User explicitly asks for the flaws only on a present, finished artifact — "tell me only what's wrong", "don't tell me what works", "tear into it", "find the holes", "what would make this fail?". The artifact already exists and carries a falsifiable claim with a ship / no-ship criterion; the user wants a one-sided audit, not a brainstorm. Generic ownership-evaluation asks ("is my email good?") land on `anti-sycophancy-meta` first, which routes here for finished artifacts. This is the single-pass lightweight skill that runs on Chat surface; for argument-shaped positions use `steelman`, for plans use `pre-mortem`.

## What this skill produces

A three-section markdown output:

1. **Claim restated.** What is the artifact claiming or trying to do? (One sentence.)
2. **Disconfirmers, ranked by severity.** Only evidence that the claim is wrong. No balancing entries.
3. **Verdict.** If the user only had this disconfirming evidence, would they still ship? Yes (ship) or no (the disconfirmer that mattered).

The output's value is in what it does NOT contain. There is no "things you got right" section, no "considerations", no "on the other hand". The skill is asymmetric by design.

## Before invoking — mandatory reads

1. KB-05 §3 (the 12-skill catalog) — confirm `disconfirming-evidence-first` is the right route. If artifact is a plan with future failure modes, route to `pre-mortem`. If artifact is an argument the user wants stress-tested, route to `steelman`. This skill is for finished artifacts where the user is about to ship.
2. KB-05 §10 (Failure modes) — note "treating disconfirmation as a balance exercise" as the dominant misuse.
3. The artifact itself, in full. Disconfirming-evidence-first on a partial reading is worse than no review; you will miss the actual disconfirmer.

## Procedure

1. **Restate the claim.** What is the artifact's central claim or purpose? If the user provided an email, the claim is what the email is asking for. If they provided an analysis, the claim is what the analysis concludes. If they provided code, the claim is what the code does. One sentence.
2. **Search ONLY for evidence the claim is wrong (no balancing).** This is the load-bearing asymmetry. Do not list pros and cons; list only the items that would make a reasonable reviewer say "no, this isn't right" or "no, don't ship this." If the artifact's claim is "this email closes the deal", search only for reasons it might not close the deal. The skill is one-sided on purpose.
3. **Rank disconfirming items by severity.** BLOCKER (the artifact fails its purpose if this is true) / HIGH (significantly degrades the outcome) / MEDIUM (worth fixing but the artifact still works). Do not include LOW items — they are noise.
4. **Force a verdict.** Ask explicitly: "If I had only this evidence, would I still ship?" Yes or no. No "it depends." The verdict must be forced; the user can override it but the skill must take a position.
5. **If yes, ship.** Output the verdict and the ranked list (the disconfirmers were not severe enough to block). The user has an audit trail of what was considered and dismissed.
6. **If no, name the disconfirmer that mattered.** One item from the ranked list, with concrete remediation. Not "address the disconfirmers" — "fix [specific item]."

## Output format

```
## Claim
<one sentence: what is the artifact claiming or trying to do?>

## Disconfirmers (ranked)

### BLOCKER
- <disconfirmer with specific evidence from the artifact>

### HIGH
- <disconfirmer with specific evidence>

### MEDIUM
- <disconfirmer with specific evidence>

## Verdict
<Ship | Do not ship>

<If Do not ship: the one disconfirmer that mattered + concrete remediation>
```

**Worked example.** User asks "is this email good?" with an email to a senior stakeholder requesting a 2-week deadline extension.

- *Claim:* The email is asking [stakeholder] to approve a 2-week deadline extension on [project].
- *Disconfirmers (ranked):*
  - **BLOCKER:** The email does not state what changes if the extension is denied. Senior stakeholders deny requests that look optional; without the consequence of denial, this reads as preference, not need.
  - **HIGH:** The email leads with "I hope you are doing well" — three lines of pleasantry before the ask. Stakeholders at this level scan; the ask should be in the first sentence.
  - **HIGH:** The proposed new date is given without a confidence interval. "Two weeks" reads as one-shot; if the actual risk is "2-4 weeks", saying 2 sets up another extension request.
  - **MEDIUM:** No CC. If [stakeholder]'s chief of staff handles their calendar, this routes through them anyway.
- *Verdict:* Do not ship. The disconfirmer that mattered: stating what changes if the extension is denied. Rewrite the opening: "I'm requesting a 2-week extension on [project] to [new date]. Without it, [specific consequence — feature ships incomplete / customer commitment slips / etc.]. With it, [specific benefit]." Move the pleasantry to a single line at the end.

## Anti-patterns

- **Treating disconfirmation as a balance exercise.** "Here are 3 things that could go wrong AND here are 3 things you got right." This is the most common misuse and the entire reason the skill exists. The skill is asymmetric by design — balanced output IS the sycophantic baseline this skill exists to defeat. If you find yourself adding affirmative items, you are running a different skill.
- **Using on questions with no objective answer.** "Is my poem good?" — poetry has no objective ship/no-ship criterion. Disconfirming-evidence-first requires a claim that can be wrong; subjective-only artifacts violate the precondition.
- **Listing every imperfection.** The MEDIUM tier exists; the LOW tier does not. If a disconfirmer would not change the ship/no-ship decision, omit it. Noise dilutes the disconfirmers that matter.
- **Refusing to force a verdict.** "There are things to consider on both sides" is the failure mode the skill prevents. Yes or no — the user can override.
- **Including affirmative findings to "soften" the disconfirmers.** This is sycophancy disguised as politeness. The user asked for an audit; deliver one.

## Gotchas

- **The user often pushes back with "but X is fine, you didn't mention X."** They are looking for the affirmative section that was deliberately omitted. Response: "X is not a disconfirmer; this skill only surfaces what could be wrong. The artifact's other elements were not flagged." Do not retroactively add affirmation — that defeats the skill.
- **Severity tagging tends toward inflation.** If every item is BLOCKER, none is. Discipline: BLOCKER is reserved for items where the artifact fails its purpose if the item is true. "Could be better" is MEDIUM at most.
- **The "if I had only this evidence, would I ship?" question is the integrity check.** If you find yourself answering "ship" when the BLOCKER list is non-empty, the severity tagging is wrong. Re-rank.
- **The verdict is forced, not consensus.** The user may disagree with the verdict. That is fine; the verdict's value is in being explicit so the user has something concrete to disagree with. "It depends" is not a verdict.
- **For tone-only reviews, the disconfirmers are tone failures only.** Don't drift into content disagreements when the user asked about tone. The asymmetry is also a scope discipline.

## When NOT to use

- Plan-shaped artifacts where the artifact does not yet exist — route to `pre-mortem` (you cannot disconfirm what hasn't been written).
- Argument-shaped artifacts where the user wants a counter-position built — route to `steelman`.
- Open-ended brainstorming, option generation, or creative ideation — those need divergent thinking, not asymmetric pruning.
- Decisions involving ≥3 mutually-exclusive options or Type-1 reversibility — escalate via `reversibility-check` to `council-3-voice`.
- Emotional-support requests — route to `anti-sycophancy-meta`'s opt-out path; do not audit a vulnerable artifact.
- Subjective aesthetic judgments with no ship/no-ship criterion ("which color do you prefer?") — the skill's precondition is a falsifiable claim.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog), §5 (router — phrase mapping "is this email good"), §11 (surface routing — lightweight Chat default)
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 6
- Primary sources:
  - Karl Popper, falsificationism — every claim must specify what would disconfirm it
  - Philip Tetlock, *Superforecasting* — signature pattern of superforecasters is actively seeking base rates and counter-evidence rather than balancing them
  - Cheng et al., *ELEPHANT* arXiv 2505.13995 (May 2025): LLMs preserve user's face 45 percentage points more than humans in advice queries — the empirical gap this skill exists to close
- Sibling skills:
  - `steelman` — heavier counter-argument construction for argument-shaped positions
  - `pre-mortem` — for plan-shaped pressure-testing
  - `anti-sycophancy-meta` — fires first on "is my X good?" framing, routes here for finished artifacts
  - `confidence-calibration` — pairs naturally when a disconfirmer is "the artifact claims certainty the evidence doesn't support"

## Tier note (Intermediate install)

This project is Intermediate tier: `council-3-voice` is NOT installed. Rule: at this tier, for ≥3 mutually-exclusive options or Type-1 reversibility, escalate via `reversibility-check` then run `steelman` + `pre-mortem` sequentially, instead of `council-3-voice`.
