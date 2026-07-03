---
name: reversibility-check
description: Classify any decision as Type-1 (irreversible, one-way door) or Type-2 (reversible, two-way door), estimate rollback cost, and pick the matching decision mode. Use this skill the moment the user asks "should we commit to X" / "go/no-go" / "is this big" — or whenever the agent is about to escalate to council-3-voice. This skill is the gating skill for the council; Type-1 fires the council, Type-2 routes to a single-pass skill.
severity: BLOCKER
confidence: 0.85
surface: Chat-or-Code
---

# Reversibility Check Skill

> **Trigger**: Use this skill the moment a decision-shaped question carries commitment language — "should we commit", "go/no-go", "is this big", "are we sure about X". Auto-fire ahead of every council-3-voice invocation; this skill is the **gate** that decides whether the council fires at all. Math is portable to Chat; Code helps when the rollback cost lives in repo context (migrations, infra commits, schema changes).

## What this skill produces

A one-line classification + cost estimate + recommended decision mode, in the locked format:

```
Type-1/2 • rollback cost • decision mode
```

The output is decidable downstream: a Type-1 verdict triggers `council-3-voice` (per KB-05 §5.4); a Type-2 verdict routes to a single-pass skill (`inversion`, `pre-mortem`, or `disconfirming-evidence-first` depending on artifact type).

## Before invoking — mandatory reads

1. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §5.4 (council invocation threshold — this skill IS the gating mechanism), §6 (council reference architecture), §6.5 (cost gate).
2. `research/2026-05-26-decision-techniques.md` §2 row 8 (canonical procedure + output column), §3 (council architecture).
3. Bezos's 1997 Amazon shareholder letter (the canonical Type-1/Type-2 framing — read the verbatim distinction at least once before invoking).

## Procedure

1. **Classify the decision.** Type-1 (irreversible, one-way door) or Type-2 (reversible, two-way door). The decisive question is not "can it be undone?" — almost everything can be undone in some sense. The decisive question is "what does undoing it cost?" If the answer is "trivial — a code revert, a config flip, a refund", it is Type-2. If the answer involves sunk legal commitments, hiring decisions, public brand positioning, regulatory filings, or anything with a >6 month rollback horizon, it is Type-1.
2. **For Type-1: trigger the full council.** This skill's job is the gate. When Type-1 fires, hand off to `council-3-voice` (Optimist + Pessimist + Synthesizer per KB-05 §6). Do not attempt single-pass evaluation on Type-1 decisions — that is the failure mode this gate exists to prevent. If `council-3-voice` is not installed (Starter/Intermediate tiers), run `steelman` + `pre-mortem` sequentially instead and recommend a DECISIONS entry recording the verdict.
3. **For Type-2: take the cheap experimental cut.** Single-pass skill is the right tool. Route to `inversion` for "is this a good idea?", `pre-mortem` for "what could go wrong?", `disconfirming-evidence-first` for finished artifacts. Council on Type-2 is overkill (15× tokens for a decision that costs nothing to reverse).
4. **Estimate cost of rollback.** Quantify in the unit that matters: dollars, days, headcount-weeks, reputational cost, or "this cannot be undone, only mitigated". A Type-1 verdict without a rollback-cost estimate is incomplete — the cost is what makes the gate meaningful.
5. **Output Type, cost, and recommended decision mode.** Single line, locked format. The downstream router consumes this verdict directly.

## Output format

Verbatim format from the dossier:

```
Type-1/2 • rollback cost • decision mode
```

### Worked example A — Type-2

User: "Should we switch our REST endpoint to GraphQL?"

```
Type-2 • rollback cost: ~1 sprint to revert (versioned endpoints
keep both alive during cutover) • decision mode: single-pass skill
(route to `inversion`).

Rationale: architectural change with parallel-versioning escape
hatch. Council overkill. Cost of being wrong: one quarter of
engineering time, no external commitments. Two-way door.
```

### Worked example B — Type-1 (gates the council)

User: "Should we expand to the EU market?"

```
Type-1 • rollback cost: ~$200k+ sunk (legal entity, hiring,
brand positioning) + 12-18 mo unwind • decision mode: council-3-voice.

Rationale: sunk-cost commitments to legal entities, hiring, and
brand recognition make this a one-way door. Triggering full
council (Optimist + Pessimist + Synthesizer per KB-05 §6).
Cost gate (15× tokens) is justified at this stakes level.
```

## Anti-patterns

- **Treating all decisions as Type-1 (paralysis).** Most decisions are Type-2. If every call gets the full council, the council becomes noise and the user learns to ignore it.
- **Treating all decisions as Type-2 (reckless commits).** Bezos's letter is canonical for a reason: Type-1 decisions disguised as Type-2 are the most expensive class of mistake. Brand commitments, public launches, regulatory filings, and hires feel reversible right up until they aren't.
- **Skipping the rollback-cost estimate.** A Type-1 verdict without a dollar / time figure is unfalsifiable. The cost IS the evidence the verdict is correct.
- **Firing the council on Type-2 to be "safe".** 15× tokens × Pro-tier daily budget = unsustainable. The cost gate exists for a reason; respect it.
- **Bypassing this skill on the way to the council.** Council-3-voice should never be invoked without reversibility-check having gated it first. The router rule from KB-05 §5.4 makes this enforceable.

## Gotchas

- **"Reversible in theory" is not reversible.** A schema migration can be rolled back, but if production data has accumulated under the new schema for two weeks, the rollback destroys data. Reversibility is about practical cost, not theoretical possibility.
- **The cost of being wrong is asymmetric.** A Type-1 misclassified as Type-2 (reckless commit) is much more expensive than a Type-2 misclassified as Type-1 (paralysis). When in doubt, classify as Type-1.
- **Some Type-2 decisions chain into Type-1 decisions.** Each individual sprint commitment is Type-2; ten consecutive sprint commitments down the same architectural path may aggregate to a Type-1 lock-in. Flag the chain if you see it.
- **Bezos's letter qualifier: "many decisions are reversible, two-way doors."** The exact 1997 wording matters because it sets the default — most decisions ARE reversible. The skill's job is to catch the minority that aren't.

## When NOT to use

- For tone checks or single-fact lookups — these have no commitment dimension.
- For emotional-support framings — pressure-testing the irreversibility of a feeling is the wrong tool.
- For pure information-gathering questions ("how does X work?") — no decision, no reversibility classification needed.
- When the user has already named the decision mode they want ("I just want a quick gut-check"). Respect the framing; route directly to `disconfirming-evidence-first`.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §5.4 (gating role), §6 (council architecture)
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 8
- Primary sources:
  - Jeff Bezos, 1997 Amazon shareholder letter — canonical Type-1 (one-way door) / Type-2 (two-way door) dichotomy. Verbatim distinction: most decisions are reversible "two-way doors" and warrant cheap experimental cuts; the rare "one-way doors" warrant deliberation with consultation.
  - CallSphere production engineering note (Mar 2026) and Promptolis agent-design guides — both reference the dichotomy as the standard gating mechanism for multi-agent escalation.
- Sibling skills: `council-3-voice` (the gated escalation this skill fires when Type-1), `pre-mortem` (Pessimist role inside the council; also the single-pass Type-2 default for plans), `inversion` (single-pass Type-2 default for "is this a good idea?"), `disconfirming-evidence-first` (single-pass Type-2 default for finished artifacts).
