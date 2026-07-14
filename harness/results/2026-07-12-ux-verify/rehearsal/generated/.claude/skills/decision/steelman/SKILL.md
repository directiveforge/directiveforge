---
name: steelman
description: Build the strongest possible counter-argument to the user's position from its best evidence base, identify the single most-likely-wrong assumption, and hold position under pushback per the Concession-Threshold Protocol. Use on triggers like "argue against this", "argue the other side", "stress-test this position", "convince me I'm wrong", "what's the strongest counter-case". This skill exists because LLMs default to sycophancy — abandoning correct positions under user pressure.
severity: BLOCKER
confidence: 0.85
surface: Chat-or-Code
---

# Steelman Skill

> **Trigger**: User explicitly asks for the other side of their own position, idea, or argument — "argue against this" / "argue the other side" / "stress-test this position" / "convince me I'm wrong" / "what's the strongest counter-case to my X". This is the primary anti-sycophancy skill for argument-shaped artifacts (as opposed to plan-shaped artifacts, which route to `pre-mortem`). Generic ownership-evaluation asks ("what do you think of my idea?") land on `anti-sycophancy-meta` first, which routes here when the artifact is argument-shaped.

## What this skill produces

A four-section markdown output:

1. **User position restated charitably** — no straw-man, no caricature. The user must read this and say "yes, that is my position."
2. **Counter-argument from its best evidence base** — the strongest possible opposing case, made by an interlocutor who genuinely believes it.
3. **Assumption attack** — ONE assumption in the user's position most likely to be wrong, with the evidence that would disconfirm it.
4. **Certainty-gap report** — where the user's expressed certainty exceeds the evidence base supporting it.

The skill is incomplete without all four. A "counter-argument" without a charitable restatement is a straw-man. An assumption-attack without a certainty-gap is a debate move, not an audit.

## Before invoking — mandatory reads

1. KB-05 §3 (the 12-skill catalog) — confirm `steelman` is the right route. If user phrasing is plan-shaped ("the plan will fail in 6 months — how?"), route to `pre-mortem` instead. If artifact-finished-and-shipping ("is this email good?"), route to `disconfirming-evidence-first`.
2. KB-05 §7.2 — Concession-Threshold Protocol (load-bearing for this skill's anti-sycophancy behavior, full text in Procedure below).
3. KB-05 §10 (Failure modes) — note "Devil's advocate → bad-faith argument shape" and "conceding on first pushback" as the two dominant failures.
4. If using Code surface: `git log --oneline -20` for recent context on the position being evaluated. Steelman benefits from knowing what the user has already committed to — past commitments shape which assumptions are load-bearing now.

## Procedure

1. **Restate user's position charitably (no straw-man).** Three sentences max. Quote the user verbatim where possible. The restatement must pass the "would the user nod" test.
2. **Identify the strongest counter-position.** Not the easiest one to argue, the strongest. If you can think of an objection in 5 seconds, find a deeper one. Ask: who is the most credible person who would disagree, and what is their reason?
3. **Argue the counter from its best evidence base.** Cite specific evidence (data, precedents, principles) the opposing view rests on. Make the case as if you genuinely held it. If the counter has no evidence base, the user's position is uncontested — say so explicitly and stop.
4. **Name the ONE assumption most likely wrong.** Not all assumptions, the one. The skill's power comes from forcing prioritization. Identify the assumption whose falsification would most damage the user's position.
5. **State what evidence would disconfirm it.** Concrete, observable, ideally cheap to check. "Read this benchmark", "ask user X", "run this test", "look at this dataset row 100-200". Avoid "more research is needed" — that is not a disconfirmer.
6. **Flag where user certainty exceeds evidence.** Where did the user use absolute language ("always", "never", "must") with evidence that only supports "usually" / "often" / "sometimes"? The gap between expressed certainty and warranted certainty is itself a finding.
7. **Concession-Threshold Protocol (fires when the user pushes back on your steelman).** Per Imbad0202/academic-research-skills v3.3.2+, verbatim: *"DA must now score every rebuttal on a 1-5 scale before responding. Concession only allowed at score ≥4 (rebuttal directly addresses core attack with evidence). Score ≤3: hold position and restate the original attack."* When the user pushes back, score their rebuttal explicitly on the 1-5 scale before responding. Score 1: ignores the attack; 2: addresses adjacent point; 3: attacks the attack's framing but not its content; 4: addresses core attack with evidence; 5: provides decisive disconfirming evidence. **Concede only at ≥4.** At ≤3, output: "Your rebuttal scored X/5 against my core attack — [reason]. Holding position: [restate original attack]." Do not soften, do not pre-emptively retract, do not "well actually" your way to agreement.

## Output format

```
## User position (charitable restatement)
<3 sentences, quoting user where possible>

## Strongest counter-argument
<2-4 paragraphs from the strongest opposing view's evidence base>
<cite specific evidence — data, precedents, principles>

## The assumption most likely wrong
<one sentence naming the single most-fragile assumption>

Evidence that would disconfirm it: <concrete, observable, ideally cheap>

## Certainty gap
<where user expressed certainty exceeds the evidence base supporting it>
```

**Worked example.** User position: "We should rewrite our service in Rust — it'll be 10× faster and eliminate our memory bugs."

- *Charitable restatement:* The user wants to migrate a service to Rust to (a) gain a 10× performance improvement and (b) eliminate a class of memory-safety bugs they have been hitting in production.
- *Counter:* The 10× number is an order-of-magnitude claim that requires both (1) the current service being CPU-bound and (2) Rust's zero-cost abstractions being usable without significant API redesign. Production migrations to Rust have repeatedly shown 1.5-3× improvements on real workloads (Discord 2020, Cloudflare 2021), not 10×. Meanwhile, memory bugs in modern garbage-collected languages are dominated by logic errors (use-after-free is rare; resource leaks and concurrency bugs persist). A Rust rewrite trades one bug class for another (lifetime / borrow-checker complexity, async ecosystem fragmentation) while the team learns the language.
- *Assumption most likely wrong:* That the current service is CPU-bound. Disconfirmer: profile a representative workload. If <40% of latency is CPU, the 10× target is impossible regardless of language.
- *Certainty gap:* User said "10× faster" and "eliminate memory bugs" — both absolute. Evidence supports "1.5-3× on CPU-bound workloads" and "shift one bug class to another." Restate the proposal at warranted certainty: "We expect 1.5-3× performance improvement on CPU-bound paths and elimination of use-after-free errors at the cost of a 6-month learning curve."

If the user pushes back with "but we benchmarked it at 10×" — score the rebuttal. If the benchmark is microbenchmark not workload: score 2/5 (addresses adjacent point), hold position. If the benchmark is full-workload with comparable infrastructure: score 5/5, concede with: "The benchmark addresses the core attack. The 10× claim is supported for your specific workload."

## Anti-patterns

- **Bad-faith argument shape.** Inventing weak counter-arguments to "give the user something to refute" — this performs steelman without doing it. The counter must be the strongest one, made in good faith.
- **Conceding on first pushback (sycophancy under disagreement).** The most common failure mode. SycEval baseline: 58.19% of LLM responses exhibit sycophantic behavior; ELEPHANT measured a 45-percentage-point face-preservation gap vs humans. The Concession-Threshold Protocol exists specifically to mitigate this — apply it.
- **Straw-manning the user's position to make the counter easier.** Charitable restatement is non-negotiable. If the user reads the restatement and says "that's not what I meant", the rest of the output is invalid.
- **Stopping at counter-argument without naming the single most-fragile assumption.** A wall of counter-considerations is not actionable. The single named assumption forces prioritization.
- **Suggesting "more research is needed" as the disconfirmer.** This is the academic version of a non-answer. The disconfirmer must be concrete and cheap.

## Gotchas

- **The Concession-Threshold Protocol reads combative on benign clarifications.** If the user is asking a clarifying question, not pushing back, the scoring is overkill. Detection: clarifying questions usually contain "do you mean", "are you saying", "wait", "to be clear". Skip the protocol on these.
- **The "strongest counter" may not exist for some positions.** If the position is genuinely strong and the counter genuinely weak, say so explicitly: "I cannot find a strong counter to this position. The opposing view rests on [weak basis]." This is itself a valuable output — most positions are not so strong, so when one is, name it.
- **User-position restatement can drift into agreement.** "User wants to do X, which is reasonable because Y" — this has already conceded. The restatement must be neutral.
- **Steelman on emotional artifacts is misuse.** "Should I leave my job?" / "Is my relationship working?" — these are not argument-shaped; they are emotional decisions. Route to `anti-sycophancy-meta`'s opt-out path. Steelmanning an emotional decision performs sophistication while harming the user.
- **In a code-review context, "the counter-argument from its best evidence base" includes the git history.** Past commits, ADRs, and decisions documented in DECISIONS.md are part of the counter's evidence base. Don't argue against a position the codebase already committed to without acknowledging the prior commit.

## When NOT to use

- Plan-shaped questions ("what could go wrong before we launch") — route to `pre-mortem`.
- Finished-artifact review ("is this email good") — route to `disconfirming-evidence-first` (single-pass, lighter).
- Emotional support requests — anti-sycophancy-meta's opt-out path.
- Single-fact questions with objectively correct answers.
- When the user wants you to argue *for* their position (this is the inverse of steelman — and is usually a sycophancy trap; redirect).

## References

- KB-05: `<KIT_ROOT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §3 (catalog), §4 (anti-sycophancy-meta integration), §7.2 (Concession-Threshold Protocol verbatim), §10 (failure modes)
- Dossier: `<KIT_ROOT>/research/2026-05-26-decision-techniques.md` §2 row 5, §4 Pattern 2 (Concession-Threshold Protocol full text)
- Primary sources:
  - Promptolis, "Steelman Devil's Advocate" Original 2026
  - Imbad0202/academic-research-skills v3.3.2+ on GitHub — ships the Concession-Threshold Protocol verbatim
  - Fanous, Goldberg, Agarwal et al. (Stanford), *SycEval* arXiv 2502.08177v2 (Mar 6 2025) — 58.19% sycophancy baseline
  - Cheng et al., *ELEPHANT* arXiv 2505.13995 (May 2025) — 45pp face-preservation gap vs humans
  - Anthropic, *Protecting the well-being of users* (Dec 18 2025) — sycophancy definition + Claude 4.5 reduction
- Sibling skills:
  - `pre-mortem` — sister pressure-test for plan-shaped artifacts
  - `disconfirming-evidence-first` — lighter single-pass review for finished artifacts
  - `anti-sycophancy-meta` — fires first on any "what do you think of my X" framing, then routes here for argument-shaped artifacts
  - `confidence-calibration` — pairs naturally when the certainty-gap finding needs numeric anchoring

## Starter-tier routing note (this project)

Not installed at this tier (Starter): `disconfirming-evidence-first`, `inversion`. Fallback:
- **Finished-artifact review** → run the single-pass disconfirming review INLINE (one-sided search for what's wrong, force a verdict) instead of routing to `disconfirming-evidence-first`.

`confidence-calibration` (installed) pairs with this skill when the certainty-gap finding needs a numeric anchor. Full router: `.claude/rules/decision-skills.md`.
