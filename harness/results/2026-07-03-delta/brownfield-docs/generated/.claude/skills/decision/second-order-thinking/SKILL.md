---
name: second-order-thinking
description: Force the agent past first-order effects into the 2nd- and 3rd-order downstream consequences of a decision before approving it. Use on triggers like "what's the downstream effect", "are there knock-ons", "what does this enable", or any plan whose 30-second pitch hides reflexive industry / market / stakeholder reactions. Skip on tone checks and single-fact lookups.
severity: HIGH
confidence: 0.70
surface: Chat-or-Code
---

# Second-Order Thinking Skill

> **Trigger**: A user proposes an action and is framing the discussion around its immediate (first-order) effect — "this will increase X" / "this fixes Y" — without naming what the system does NEXT in response. Fires on phrases "downstream effects", "knock-on consequences", "second-order", "what does this enable", "are there knock-ons", or any change to a system with stakeholders who will react.

> **Tier note (this project = Intermediate).** `cost-of-inaction` and `council-3-voice` are NOT installed here (Advanced-only). Where this skill pairs with `cost-of-inaction` for a "do nothing" branch: at this tier, frame the status-quo cost inline. Where it escalates ≥3 mutually-exclusive paths to `council-3-voice`: at this tier, run `steelman` + `pre-mortem` sequentially and recommend a `governance/DECISIONS.md` entry instead.

## What this skill produces

A decision tree (markdown) showing:

- The user's stated first-order effect
- 3 second-order effects per relevant stakeholder (us / them / market)
- One "and then what?" recursion on each (third-order)
- Flags on any branch that forms a feedback loop
- A reversibility score per branch
- Confidence per node (0.0–1.0)

The output's value is in the named branches the user had not considered — not in the tree's symmetry. If every branch reads as plausible, you have not pushed hard enough.

## Before invoking — mandatory reads

1. KB-05 §3 (the 12-skill catalog) — confirm `second-order-thinking` is the correct route. If user phrasing is "argue against this", route to `steelman` instead. If "what could go wrong before we launch", route to `pre-mortem`.
2. KB-05 §10 (Failure modes) — note the "infinite recursion into nth-order speculation" anti-pattern. Stop at third-order unless a feedback loop is identified.
3. Project's `DECISIONS.md` if one exists — check whether downstream effects on locked decisions are being silently violated.

## Procedure

1. **Restate the first-order effect** in the user's own framing. One sentence. No reframe yet.
2. **Identify 3 second-order effects per stakeholder** across three buckets: us (the actor), them (whoever the action targets), market (the broader system — competitors, regulators, peers, supply chain). Nine effects total before pruning.
3. **For each effect, ask "and then what?" exactly once.** This produces the third-order layer. Stop here unless a feedback loop is found.
4. **Flag any feedback loop** — an effect that amplifies or dampens the original first-order effect. Feedback loops change the decision because they are non-linear and often invisible at first-order.
5. **Score reversibility per branch** — Type-1 (one-way door, expensive to reverse) or Type-2 (two-way door, cheap to reverse). Borrowed from `reversibility-check` skill; if a branch is Type-1, surface it as a blocker.
6. **Output decision tree with confidence per node** — 0.0–1.0 numeric, not prose hedges. Low-confidence branches get explicit "verify by [evidence type]" notes.

## Output format

Markdown decision tree. Verbatim structure:

```
First-order effect: <user's stated effect>

Second-order (us):
  1. <effect> [conf: 0.X] [reversibility: Type-1/2]
     → Third-order: <effect> [conf: 0.X]
  2. ...
  3. ...

Second-order (them):
  1. ...

Second-order (market):
  1. ...

Feedback loops identified:
  - <branch> amplifies/dampens <first-order> via <mechanism>

Type-1 (irreversible) branches:
  - <list>

What this changes about the decision:
  <one paragraph, opinionated>
```

**Worked example.** First-order effect: "Migrating from REST to GraphQL will let the mobile team fetch exactly the fields they need."
- Second-order (us): backend team owns a new query-cost analyzer indefinitely [conf: 0.85] → on-call rotation expands to include GraphQL incident class [conf: 0.7]
- Second-order (them): mobile team writes their own resolvers, drifts from backend conventions [conf: 0.6] → backend loses ability to enforce data-access patterns [conf: 0.5]
- Second-order (market): future engineering hires expect GraphQL fluency [conf: 0.4]; competitors who stayed on REST ship features faster Q1 because no migration tax [conf: 0.6] → 6-month feature-velocity gap relative to peers [conf: 0.55]
- Feedback loop: query-cost analyzer requires backend headcount → headcount competes with feature work → features slow → mobile team writes more bespoke resolvers to compensate → analyzer burden grows.
- Type-1: schema migration past N+1 mobile-app versions deployed in production.

## Anti-patterns

- **Stopping at first-order.** "This will increase conversion 5%" with no naming of what competitors / regulators / your own team does in response. The skill's whole point is escaping this stopping condition.
- **Infinite recursion into nth-order speculation.** Past third-order, the confidence per node drops below 0.3 and the output becomes science fiction. Stop at third-order unless a feedback loop is identified — feedback loops earn an extra layer because they are non-linear and decision-changing.
- **Symmetric trees that read as plausible everywhere.** If every branch is equally weighted, you are pattern-matching to "thoroughness" rather than thinking. Prune low-confidence branches; flag the one branch that would change the decision.
- **Ignoring the "and then what?" question for the user's stakeholder.** Easy to second-order on competitors and forget that the user's own team has to live with the change.

## Gotchas

- **Stakeholder bucket "market" is the most-skipped.** Engineers default-think us+them; the market bucket catches regulator reactions, competitor responses, supply-chain effects. Force three entries here even when it feels like reaching.
- **Confidence inflation in third-order.** A 0.85-confidence second-order × 0.5-confidence third-order is 0.42 joint. Mark joint confidence on third-order nodes, not local.
- **Feedback loops compound silently.** A loop that adds 5% cost per cycle is a 28% cost increase over 5 cycles. Name the cycle period (per quarter, per release) so the math is auditable.
- **Reversibility scoring is per-branch, not per-decision.** A decision can have one Type-1 branch and four Type-2 branches; the Type-1 branch governs.
- **Don't use this skill to generate options.** It pressure-tests an option the user brings. If the user hasn't proposed an action yet, route to a brainstorming workflow first.

## When NOT to use

- Tone checks, single-fact lookups, code review of <50-line diffs — too lightweight for the tree-building overhead.
- Questions with no stakeholder model (pure-physics questions, mathematical proofs) — there is no "us / them / market" structure to populate.
- When the user explicitly wants validation of an emotional decision — route to `anti-sycophancy-meta`'s opt-out path instead.
- When the decision is project-scale and irreversible — escalate to KB-04 (multi-dossier research + DECISIONS.md lock + architect prompt), not this skill.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog), §8 (domain adaptation), §10 (failure modes)
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 4
- Primary sources:
  - Howard Marks, *The Most Important Thing* — second-order thinking canon for investment decisions
  - Charlie Munger, mental-models corpus — "and then what?" as core discipline
  - neurofoo/agent-skills `/thinking-frameworks` — shipped production Skill referencing both Marks and Munger
- Sibling skills:
  - `reversibility-check` — used to score branches Type-1 vs Type-2
  - `pre-mortem` — sibling pressure-test, fires on "what could go wrong" framing
  - `cost-of-inaction` — pairs naturally when "do nothing" is one of the second-order branches
  - `council-3-voice` — escalation path if the third-order tree surfaces ≥3 mutually-exclusive decision paths
