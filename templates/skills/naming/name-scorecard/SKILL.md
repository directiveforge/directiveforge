---
name: name-scorecard
description: Score and rank the gated survivors on a weighted 100-point rubric (legal defensibility, distinctiveness, fluency, strategic fit, cross-language safety, digital availability, extendability) using the brief-appropriate preset, then recommend a top 3 by "is it right?" — deliberately surfacing polarizing-but-strong candidates instead of averaging to the least-objectionable name. Use this skill when the user says "score the names", "rank the shortlist", "which one should we pick", "help me decide". Only score candidates that have already passed linguistic-screen + trademark-clearance + availability-gate.
severity: MEDIUM
confidence: 0.65
surface: Chat-or-Code
---

# Name Scorecard Skill

> **Trigger**: Gated survivors exist and a choice must be made. The default failure this prevents: selecting the highest-consensus, least-objectionable name — "a mediocre name that met with the least resistance rather than the very best name" (Watkins).

## What this skill produces

A ranked table scoring each survivor 0-100 with a visible component breakdown, plus a recommendation memo for the top 3 framed as "is it right?" (fit + defensibility), explicitly preserving polarizing-but-strong candidates rather than averaging them away. It also lists the remaining human steps (attorney opinion, native-linguist verification, optional fit testing).

## Before invoking — mandatory reads

1. `knowledge-base/KB-07-BRAND-NAMING.md` §8 (the 100-point rubric + the six tunable brief presets: Premium / Value-Mass / Global / Local-retail / Online-first-B2B / B2C).
2. KB-07 §9 (Validation) — test for *fit and risk*, never *appeal*; focus groups kill strong names (Sonos "not entertainment enough", Azure "dumb", BlackBerry "crazy").
3. KB-07 §1 finding 9 — the defensibility-vs-comprehension conflict is genuine and unresolved; resolve it per-brief, surface it, don't hide it.

## Procedure

1. **Load the §8 rubric and select the brief preset.** The brief's positioning picks the weight column (e.g., Online-first/B2B raises digital availability + distinctiveness; Global maximizes cross-language safety; Premium de-prioritizes the exact .com).
2. **Score each survivor 0-100 across the seven criteria**, pulling component inputs from the upstream gates: legal defensibility from `trademark-clearance` (Abercrombie + knockout), cross-language safety from `linguistic-screen`, digital availability from `availability-gate`, and fluency/distinctiveness/fit/extendability from the name itself + brief.
3. **Show the component breakdown** — never a bare total. The weights are reasoned syntheses, not empirically validated (confidence 0.65), so the user must be able to re-weight.
4. **Surface polarizing-but-strong candidates.** Do not collapse to the consensus pick. Flag high-variance, high-ceiling names explicitly (Grove on Pentium: "I see the polarization here… that tells me there's energy").
5. **Recommend the top 3 with an "is it right?" rationale**, naming the defensibility-vs-comprehension tradeoff each embodies.
6. **List remaining human steps** — attorney opinion before filing, native-linguist sign-off on flagged language cells, and optional fit/imagery testing (the Swiffer test), not appeal voting.

## Output format

```markdown
## Preset: {Online-first/B2B}  (weights: defensibility 22 · distinctiveness 22 · fluency 13 · fit 13 · x-lang 7 · availability 18 · legs 5)

| Candidate | Defens. | Distinct. | Fluency | Fit | X-lang | Avail. | Legs | Total |
|-----------|---------|-----------|---------|-----|--------|--------|------|-------|
| Vircel | 24 | 20 | 12 | 12 | 7 | 16 | 4 | 95 |

## Top 3 (is it right?)
1. **Vircel** — fanciful, max defensibility; .ai available; polarizing but high-ceiling. Tradeoff: zero free comprehension (must teach the word).
2. …
## Remaining human steps
- Attorney opinion (trademark-clearance flagged 1 phonetic neighbor)
- RU native-linguist sign-off (linguistic-screen flagged cell)
- Optional: fit/imagery test — NOT an appeal vote
```

Worked example shape: five survivors are scored under the B2B preset; the highest total is a coined, polarizing name the committee initially disliked — the memo recommends it anyway, names the comprehension tradeoff, and routes the committee's "but do we like it?" reflex to the anti-sycophancy discipline.

## Anti-patterns

- **Picking the least-objectionable / highest-consensus name.** The cardinal naming sin (Watkins, §9). The scorecard exists to beat consensus-comfort, not encode it.
- **Hiding the defensibility-vs-comprehension tradeoff.** Every recommendation must name which side of the §1-finding-9 conflict it takes.
- **Averaging a polarizing winner into blandness.** High variance with a high ceiling is a feature for distinctive brands; flag it, don't smooth it.
- **Scoring un-gated candidates.** Scoring names that haven't passed the three gates wastes the rubric and produces a falsely confident ranking.

## Gotchas

- **The weights are not empirical.** Confidence 0.65 — always expose the breakdown and invite re-weighting; don't present the total as objective truth.
- **Committee dynamics are a sycophancy trap.** When stakeholders push toward the comfortable name, route to KB-05 `anti-sycophancy-meta` / `pre-mortem` — the scorecard's job is to keep "is it right?" in front of "do we like it?".
- **Test for fit, not appeal.** If the user wants validation testing, steer to the Swiffer-style fit/imagery test and representative samples — never a like/dislike vote that lets a focus group veto a strong name.

## When NOT to use

- **Before gating is complete** — run `linguistic-screen`, `trademark-clearance`, and `availability-gate` first; the scorecard ranks survivors, not raw candidates.
- **As an appeal poll** — if the user only wants "which do people like most?", that's the failure mode this skill is built to resist; reframe to fit/risk.

## References

- KB-07: `knowledge-base/KB-07-BRAND-NAMING.md` §8 (rubric + presets), §9 (validation), §1 finding 9, §12 Skill 6.
- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` — anti-sycophancy + decision discipline for the committee-selection moment.
- Primary sources: Marty Neumeier, *The Brand Gap* (7 criteria); Alexandra Watkins, *Hello, My Name Is Awesome* (SMILE/SCRATCH; the consensus-name warning); Andy Grove on Pentium polarization.
- Sibling skills: `naming-brief` (preset selection), `linguistic-screen` / `trademark-clearance` / `availability-gate` (supply component scores).
