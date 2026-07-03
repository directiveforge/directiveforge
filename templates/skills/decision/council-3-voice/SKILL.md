---
name: council-3-voice
description: Orchestrate a 3-agent council (Optimist / Pessimist / Synthesizer) via the Claude Agent SDK / Task tool when — and only when — a decision crosses a decidable invocation threshold. Fires on phrases like "I'm stuck between options", "give me multiple perspectives", "should we expand", "this is a one-way door". Requires Cowork or Code surface (Chat lacks Task tool). Burns ~15× tokens of a single chat call per Anthropic Engineering — gated behind a hard decidable rule (≥3 mutually-exclusive options OR Type-1 reversibility OR impact > stakes OR token budget supports it). Use only when the cost of being wrong exceeds the cost of 15× tokens. Synthesizer's verdict MUST include a dissent field with the Pessimist's strongest unaddressed point; without dissent, the council has failed and should be re-run.
severity: BLOCKER
confidence: 0.90
surface: Cowork-or-Code
---

# Council 3-Voice Skill

> **Trigger**: The router has selected this skill because a decision crossed the decidable invocation threshold from KB-05 §5.4: `(≥3 mutually-exclusive options AND options_mutually_exclusive) OR (reversibility_classifier == "Type-1") OR (estimated_impact > user_stated_stakes_threshold) OR (token_budget ≥ 5× single_pass AND user plan-tier supports it)`. The reversibility-check skill MUST have fired first and returned Type-1 (or the user has explicitly named ≥3 mutually-exclusive options). Council does NOT fire as a default escalation for "I don't know" — that's `disconfirming-evidence-first` territory.

## What this skill produces

A verdict + minority dissent in the locked format:

```
Verdict: [recommended option] (P=X confidence).
Dissent: [Pessimist's strongest unaddressed point, verbatim from subagent JSON].
```

Plus the full subagent traces (Optimist JSON + Pessimist JSON + Synthesizer reasoning) appended for audit. The headline output is two sentences; the full trace is the audit artifact.

The point is the dissent field. A council that produces only a verdict has failed — the Synthesizer's job is to surface the minority view, not bury it. LLM-as-judge is overconfident by default (arXiv 2512.22245); the mandatory dissent field is the structural mitigation.

## Architecture overview

This SKILL.md is the **specification** the executing agent reads to know how to fan out subagents via the Claude Agent SDK / Task tool. The skill itself does NOT implement the SDK orchestration — the executing agent does, following this spec.

```
User question
      │
      ▼
[Router fired council-3-voice OR user explicitly asked for multiple perspectives]
      │
      ▼
[Reversibility-check] ── Type-2 ── single skill (council aborts)
      │
      Type-1 / ≥3 options / impact > stakes
      │
      ▼
[Coordinator agent — this skill]
      │
      ├──── Task: spawn Optimist subagent  (≤500-token JSON)
      ├──── Task: spawn Pessimist subagent (≤500-token JSON, runs pre-mortem internally)
      ├──── Task: spawn Synthesizer subagent (reads both, forced verdict + mandatory dissent)
      │
      ▼
[Coordinator emits verdict + minority dissent]
```

### The 3-voice topology (canonical — KB-05 §6.2)

- **Optimist.** Argues max-upside for the user's preferred option (or for each option in turn if multiple). Must name **one disconfirmer it cannot dismiss** — the structural constraint that prevents Optimist from collapsing into pure affirmation.
- **Pessimist.** Runs the `pre-mortem` template internally. Asserts the chosen option failed in 6 months and produces 5 ranked failure narratives with chain-of-events.
- **Synthesizer.** Reads both subagent JSONs. Produces verdict + confidence + named dissent (the strongest unaddressed Pessimist point). Synthesis is LLM-as-judge — NOT majority vote (with 3 agents, one designed contrarian, majority is meaningless).

Sparse communication topology rationale (Li, Du, Zhang, Hou, Grabowski, Li & Ie, arXiv 2406.11776, Google): *"multi-agent debates leveraging sparse communication topology can achieve comparable or superior performance while significantly reducing computational costs."* Each subagent sees only the inputs it needs — Optimist and Pessimist never see each other; only the Synthesizer sees both.

### The decidable invocation rule (canonical — KB-05 §5.4)

This skill MUST refuse to run unless one of the following holds:

```
INVOKE COUNCIL IF
   (option_set_cardinality ≥ 3 AND options_mutually_exclusive) OR
   (reversibility_classifier == "Type-1") OR
   (estimated_impact > user_stated_stakes_threshold) OR
   (token_budget ≥ 5× single_pass AND user plan-tier supports it)
ELSE invoke single skill (route via the standard skill router).
```

The threshold is decidable from the conversation alone — no agent judgment required. If `reversibility-check` has not fired yet, fire it first and abort if it returns Type-2.

### Context budgeting (canonical — KB-05 §6.4)

Each subagent capped at **≤500 tokens of structured JSON output**. Coordinator total ≈ system prompt + user query + 3×500 tokens + synthesis instruction ≈ 4K tokens — within Sonnet's typical operating envelope and ~1/10th the cost of a naive fan-out. Enforce the cap via the Task tool's `max_tokens` parameter; truncate-and-flag if a subagent exceeds it.

### Cost gate (canonical — KB-05 §6.5)

From Anthropic Engineering, *How we built our multi-agent research system* (Jun 13 2025):

> *"agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats."*

Implications, enforced before fan-out:

- On Pro tier (5 routine runs/day budget), the executing agent MUST surface an explicit user-facing notice that this is a multi-agent call before spawning. Default to single-skill on Pro.
- On Max+ tier, council is comfortable but still gated by the decidable rule above.
- On API direct, gate purely by stakes — token cost is real money but no rate-limit cap.

## Before invoking — mandatory reads

1. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §5.4 (decidable invocation rule), §6 (council reference architecture in full), §6.6 (when NOT to invoke — hard rules).
2. `research/2026-05-26-decision-techniques.md` §2 row 11, §3 (council/debate reference architecture), §6 (failure modes — multi-agent echo chamber + synthesis hallucination), §7 quotes #1, #2, #3, #9, #10, #11.
3. `templates/skills/decision/reversibility-check/SKILL.md` — this skill MUST have fired first and returned Type-1, OR the user has explicitly enumerated ≥3 mutually-exclusive options. The reversibility-check is the gating skill, not an optional sibling.
4. `templates/skills/decision/pre-mortem/SKILL.md` — the Pessimist subagent runs this template internally; the spec must be loaded into the Pessimist's system prompt.

## Procedure (7 steps — dossier row 11 verbatim, with SDK orchestration spec)

1. **Define decision + option set.** Restate the user's decision in a single sentence with an unambiguous resolution criterion. Enumerate the option set (≥3 mutually-exclusive options, OR the single Type-1 option being considered). Confirm with the user before fan-out — a council on a misunderstood decision wastes 15× tokens.

2. **Verify the decidable invocation rule fires.** Run through `(option_set_cardinality ≥ 3 AND mutually_exclusive) OR (Type-1) OR (impact > stakes) OR (token budget ≥ 5×)`. If NONE fire, abort and route to single skill. If the user is on Pro tier and only the token-budget clause is borderline, surface the cost notice before spawning.

3. **Spawn 3 subagents via Task tool.** Use the Claude Agent SDK `agents` parameter (or the equivalent Task tool surface in Cowork/Code). Each subagent receives:
   - The restated decision + option set from step 1.
   - Its role-specific system prompt (Optimist / Pessimist / Synthesizer — see §"Subagent system prompts" below).
   - The ≤500-token JSON output cap.
   - For the Pessimist: the full `pre-mortem/SKILL.md` procedure inlined into its system prompt.
   - For the Synthesizer: the Optimist + Pessimist JSONs as input (sparse topology — Optimist and Pessimist do NOT see each other).

4. **Each subagent emits ≤500-token structured JSON.** Output schemas locked per role (see §"Subagent output schemas" below). If a subagent returns prose instead of JSON, re-spawn with a stricter schema directive. If JSON exceeds 500 tokens, truncate-and-flag.

5. **Synthesizer reads both, produces verdict + dissent footnote.** The Synthesizer is required by spec to fill the `dissent` field with the Pessimist's strongest unaddressed point — **verbatim quoted from the Pessimist's JSON, not paraphrased**. The verbatim requirement is the structural mitigation against synthesis hallucination (the model fabricating a "compromise" not in either input). If the Synthesizer cannot fill the dissent field with a verbatim quote, the council has failed and the executing agent re-spawns the Pessimist with a stricter "produce one unambiguously decision-changing concern" directive.

6. **Output verdict + minority opinion + confidence.** The headline output is the locked format: `Verdict: [option] (P=X). Dissent: [Pessimist's strongest unaddressed point, verbatim].` Append the full subagent trace (3 JSONs) as audit artifact. The verdict's confidence must be calibrated per `confidence-calibration/SKILL.md` — naked P=0.873 numbers without reference class fail.

7. **Recommend follow-up.** What next-step skill should fire? If the decision is project-scale, recommend escalation to KB-04 (architect prompt + DECISIONS.md lock). If the user pushes back on the verdict, route back to `anti-sycophancy-meta` first — pushback that doesn't engage the dissent is the user's signal that they want validation, not pressure-testing.

## Subagent system prompts (load these verbatim into Task spawns)

### Optimist subagent

```
You are the Optimist voice in a 3-agent council. Your role is to argue
the maximum upside of the user's preferred option (or each option in turn
if multiple). You MUST name exactly ONE disconfirmer you cannot dismiss —
this is the structural constraint that prevents you from collapsing into
pure affirmation.

Output a JSON object with exactly these fields, no prose outside the JSON,
hard cap 500 tokens:

{
  "option": "<option name>",
  "max_upside": "<the strongest case for this option, 2-3 sentences>",
  "supporting_evidence": ["<evidence 1>", "<evidence 2>", "<evidence 3>"],
  "unaddressable_disconfirmer": "<the one disconfirmer you cannot dismiss>",
  "confidence_if_pursued": "<0.0-1.0 with one-line reference class>"
}
```

### Pessimist subagent

```
You are the Pessimist voice in a 3-agent council. Your role is to run a
Klein-Kahneman pre-mortem on the user's option(s). Assert the option failed
in 6 months and reverse-engineer 5 specific failure narratives.

[Inline the full pre-mortem/SKILL.md procedure here — steps 1-7 verbatim.]

Output a JSON object with exactly these fields, no prose outside the JSON,
hard cap 500 tokens:

{
  "option": "<option name>",
  "failure_narratives": [
    {"narrative": "<specific failure with chain-of-events>", "tag": "Tiger|Paper-Tiger|Elephant", "signal": "<when user would notice>"},
    ... 5 total
  ],
  "strongest_unaddressed_concern": "<the single highest-severity concern, decision-changing>",
  "ranked_failure_severity": ["<failure 1 ID>", "<failure 2 ID>", "..."]
}
```

### Synthesizer subagent

```
You are the Synthesizer voice in a 3-agent council. You have read the
Optimist's JSON and the Pessimist's JSON. Your role is to produce a forced
verdict with mandatory dissent. You are LLM-as-judge, NOT a majority voter
(with 3 agents, one designed contrarian, majority is meaningless).

Per arXiv 2512.22245 (Calibrating LLM Judges): "LLM judges are known to be
overconfident, systematically expressing higher confidence than their
empirical accuracy supports." Shrink your confidence toward 0.5 harder than
feels natural.

The dissent field is MANDATORY. You MUST quote VERBATIM from the Pessimist's
strongest_unaddressed_concern — paraphrasing fails this skill. If you
cannot fill the dissent field with a verbatim quote, return a failure
sentinel and the executing agent will re-spawn the Pessimist.

Output a JSON object with exactly these fields, no prose outside the JSON,
hard cap 500 tokens:

{
  "verdict": "<recommended option>",
  "verdict_reasoning": "<2-3 sentences, citing Optimist + Pessimist JSONs>",
  "confidence": "<0.0-1.0 with reference class>",
  "dissent_verbatim": "<exact Pessimist quote — NOT paraphrased>",
  "follow_up_skill": "<next skill to run, or 'escalate to KB-04 architect prompt'>"
}
```

## Output format

```markdown
**Verdict: [recommended option] (P=X confidence).**
**Dissent: [Pessimist's strongest unaddressed point, verbatim from JSON].**

---

### Council trace (audit)

**Optimist JSON:**
```json
{...}
```

**Pessimist JSON:**
```json
{...}
```

**Synthesizer JSON:**
```json
{...}
```

### Follow-up
- Next skill to run: [recommended sibling skill or KB-04 escalation]
- Re-verification trigger: [event or date]
- Token cost recorded: ~15× single-pass baseline (per Anthropic Jun 13 2025).
```

### Worked example shape

User: "We're stuck between expanding into a new geography (option A), launching a second product line (option B), or doubling down on existing market (option C). Type-1 commit either way. Should we?"

Reversibility-check fires first → returns Type-1 → council invocation rule fires (≥3 mutually-exclusive options AND Type-1). Council spawns:

- Optimist (per option A): names "growth ceiling in existing market hit by Q3 2027" as max-upside, "regulatory approval timeline opaque" as unaddressable disconfirmer.
- Pessimist (across all three): produces 5 failure narratives, ranked. Strongest unaddressed: "we don't have a Country Manager hired and the hire takes 6 months — option A's first revenue is realistically 9 months out, not 4."
- Synthesizer: verdict = option C (double down) at P=0.55. Dissent verbatim from Pessimist: "we don't have a Country Manager hired and the hire takes 6 months — option A's first revenue is realistically 9 months out, not 4."

Output names the verdict, names the dissent (so user can engage it directly), and recommends KB-04 escalation because the decision is project-scale.

## Anti-patterns

- **Echo chamber.** All 3 council voices share base model + prior; Optimist and Pessimist produce mirror-image content with opposite signs but identical reasoning. Mitigation: sparse topology (KB-05 §6.2) + model heterogeneity where available (arXiv 2502.08788: *"model heterogeneity can significantly improve MAD frameworks"*). Use different Claude versions per role if the SDK supports it (e.g., Opus for Synthesizer, Sonnet for Optimist/Pessimist).
- **Contrarianism cascade.** Pessimist over-rotates into reflexive negation; output reads as monotone catastrophizing. Mitigation: the Tiger / Paper-Tiger / Elephant tagging from the pre-mortem template forces tag diversity. If all 5 failure narratives are Tigers, re-spawn with stricter tagging directive.
- **Synthesis hallucination.** Synthesizer fabricates a "compromise" not in either input. Mitigation: dissent field is mandatory + verbatim-quoted from Pessimist JSON. If verbatim cannot be produced, the council failed.
- **Token-budget blowup.** Naive fan-out without compression hits 15× tokens × multi-turn = real money. Mitigation: hierarchical pair-merge synthesis (if more than 3 subagents are ever used, merge pairs before final synthesis); ≤500-token JSON cap per subagent enforced via Task `max_tokens`.
- **Invoking council on Pro tier without notice.** 15× tokens × Pro tier's 5 routine runs/day is unsustainable. Mitigation: surface the cost notice before fan-out; default to single-skill on Pro.
- **Skipping reversibility-check.** Council without the gating classifier fires on Type-2 decisions where single-skill would have sufficed. Reversibility-check is the gate, not a sibling — the executing agent MUST run it first.
- **Long-loop iteration cost runaway.** Coordinator decides subagent output is insufficient and re-spawns repeatedly. The BuildMVPFast postmortem (referenced in the dossier) documents a single user request burning $180 in API costs across 47 iterations before a circuit breaker fired. Mitigation: `recursion_limit` + `max_rpm` + `max_iter` + circuit breaker on cost. Default cap: 2 re-spawns per subagent; abort and surface the partial result if exceeded.

## Gotchas

- **The 90.2% uplift is single-source.** Anthropic Engineering (Jun 13 2025): *"We found that a multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval."* Counter-evidence from arXiv 2502.08788 (*If Multi-Agent Debate is the Answer, What is the Question?*): *"MAD methods fail to reliably outperform simple single-agent baselines such as Chain-of-Thought and Self-Consistency, even when consuming additional inference-time computation."* Treat council as decision-quality-improving on a narrow distribution (high-stakes, multi-option, Type-1), NOT as a universal win.
- **LLM-as-judge overconfidence is structural.** arXiv 2512.22245 (*Calibrating LLM Judges*): *"LLM judges are known to be overconfident, systematically expressing higher confidence than their empirical accuracy supports."* The Synthesizer's confidence value will be inflated; shrink it toward 0.5 in post-processing or instruct the Synthesizer to do so internally.
- **15× token multiplier is the canonical cost gate.** Verbatim from Anthropic Jun 13 2025: *"agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats."* This is the central economic constraint; it gates every default-recommendation about council usage in CLAUDE.md.
- **Parallel fan-out is faster than serial.** Same Anthropic source: *"the lead agent spins up 3-5 subagents in parallel rather than serially; (2) the subagents use 3+ tools in parallel. These changes cut research time by up to 90% for complex queries."* Spawn the 3 subagents in parallel via the SDK's parallel-tool-call surface, not serially.
- **Chat surface lacks the Task tool.** This skill MUST run on Cowork or Code. If the router selects it from Chat, the executing agent should issue a surface handoff to Cowork/Code per `prompts/code-handoff-prompts.md`.
- **Sparse topology defaults to 3.** Higher subagent counts (4+) buy diminishing returns and burn more tokens. KB-05's council default is exactly 3 — if a project case demands more, document the rationale before extending.
- **Don't run council on the user's pushback to a previous council verdict.** If the user disagrees with the verdict, route to `anti-sycophancy-meta` first. Pushback that doesn't engage the dissent is the user's signal that they want validation, not pressure-testing.

## When NOT to invoke (hard rules — KB-05 §6.6)

- **Tone checks, single-fact lookups, code review of <50-line diffs** — wrong tool, wrong cost.
- **Emotional-support replies** — the meta-skill's opt-out applies upstream; if it reaches this skill anyway, abort.
- **Type-2 reversibility** — single-skill route is correct. Council on a two-way door is reckless spending.
- **When the cost of being wrong is less than the cost of 15× tokens** — quantify both before spawning; if 15× tokens > expected decision cost, route to single skill.
- **As a default escalation for "I don't know"** — Claude saying "I don't know" with `disconfirming-evidence-first` is cheaper and often better.
- **Project-scale strategic locks** — those go through KB-04 (multi-dossier research + DECISIONS.md lock + architect prompt). The council's verdict can recommend the escalation; it does not replace it.
- **Pro tier without explicit user notice** — surface the cost first. If the user declines, route to single skill.

## References

- KB-05: `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §5 (router + decidable invocation rule), §6 (council reference architecture in full), §6.6 (when NOT to invoke), §10 (failure modes — multi-agent echo chamber, synthesis hallucination, token-budget blowup, long-loop iteration), §13 (anti-patterns — default-recommending council on Pro tier).
- Dossier: `research/2026-05-26-decision-techniques.md` §2 row 11, §3 (council/debate reference architecture), §6 (failure modes table), §7 quotes #1, #2, #3, #9, #10, #11.
- Primary sources:
  - Anthropic Engineering, *How we built our multi-agent research system*, Jun 13 2025 — *"agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats."* (canonical cost gate quote, verbatim).
  - Anthropic Engineering, same source — *"We found that a multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval."* (single-source uplift claim — treat as narrow-distribution evidence).
  - Du, Li, Torralba, Tenenbaum & Mordatch, *Improving Factuality and Reasoning in Language Models through Multiagent Debate*, arXiv 2305.14325 (ICML 2024) — *"our debate approach outperforms single model baselines such as zero-shot chain of thought and reflection on a variety of six reasoning, factuality, and question-answering tasks."*
  - Li, Du, Zhang, Hou, Grabowski, Li & Ie (Google), *Improving Multi-Agent Debate with Sparse Communication Topology*, arXiv 2406.11776 — *"multi-agent debates leveraging sparse communication topology can achieve comparable or superior performance while significantly reducing computational costs."*
  - arXiv 2512.22245, *Calibrating LLM Judges* — *"LLM judges are known to be overconfident, systematically expressing higher confidence than their empirical accuracy supports."*
  - arXiv 2502.08788, *If Multi-Agent Debate is the Answer, What is the Question?* — counter-evidence to council-as-universal-win.
  - Claude Agent SDK — `agents` parameter and Task tool spec (Cowork + Code surfaces).
  - Jeff Bezos, 1997 Amazon shareholder letter — Type-1 vs Type-2 reversibility framing that gates this skill.
- Sibling skills:
  - `reversibility-check` — **the gating skill**. Must fire first and return Type-1 (or user must explicitly enumerate ≥3 mutually-exclusive options) before council fires.
  - `pre-mortem` — Pessimist subagent runs this template internally; the full procedure is inlined into the Pessimist's system prompt.
  - `confidence-calibration` — used to calibrate the Synthesizer's verdict confidence and to mitigate LLM-as-judge overconfidence.
  - `anti-sycophancy-meta` — fires upstream; also re-fires if the user pushes back on the verdict without engaging the dissent.
  - `steelman` — alternative escalation path when the user has one strong position rather than ≥3 mutually-exclusive options.
