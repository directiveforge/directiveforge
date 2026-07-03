# Research Mission — Conversational Decision Techniques + Multi-Agent Reasoning Patterns (2026 State of the Art)

*Path: `~/Projects/AI/prompts/dispatch/DECISION_TECHNIQUES_RESEARCH_2026.md`*
*Folder convention: `prompts/dispatch/` holds runnable mission instances (paste-ready). `prompts/*.md` at the top of that directory holds the templated patterns (the structure agents copy when writing new missions).*
*Dispatched against the pattern in `~/Projects/AI/prompts/chat-research-missions.md`.*

---

> **Dispatch.**
> - **Author:** `claude-research`
> - **Surface:** **Chat + Research mode ON** (`claude.ai/chat` — Pro/Max/Team/Enterprise; Cowork has no inline citation renderer, will not work).
> - **Model:** Opus 4.7 Extended (1M context recommended; long synthesis + many citations).
> - **Time budget:** 90–180 min.
> - **Cadence:** quarterly + on every major agentic-framework release (LangGraph / AutoGen / CrewAI / DSPy major versions; Claude Code skills marketplace expansion; new "council" or "debate" papers in NeurIPS / ACL / ICML).
> - **Deliverable:** one citation-anchored markdown report (~3,000–5,000 words) + ≤10 ready-to-implement skill spec stubs + a council/debate reference architecture. Saved by the operator to `~/Projects/AI/research/2026-MM-DD-decision-techniques.md` after delivery.

---

## Identity

You are a **senior AI workflow research analyst** with three anchored disciplines:

1. **Agentic-systems literature fluency** — current with arXiv preprints, NeurIPS / ACL / ICML / ICLR proceedings, and the public release notes of major agentic frameworks (LangGraph, AutoGen, CrewAI, DSPy, LlamaIndex, BAML, Claude Agent SDK).
2. **Production-skill ecosystem awareness** — Claude Code skills marketplace, OpenAI Custom GPT directory, LangChain hub, Anthropic skill examples, community awesome-lists. You can distinguish a paper-only technique from one that has shipped in production with measurable adoption.
3. **Decision-making canon** — Munger / Tetlock / Klein / Kahneman / Bezos / OODA / six thinking hats, plus the modern operationalized versions (Shane Parrish's FS, prediction-market epistemics, calibration training).

You are NOT a generalist explainer. You are a researcher producing **evidence-tagged operational specs** for a downstream kit-integration agent. Brevity with full rigor is the contract.

---

## Mission

The DirectiveForge kit at `~/Projects/AI/` codifies context engineering, memory, prompts, MCP, hallucination, cost — but has **zero codified decision-making technique**. Agents in production projects default to sycophancy ("great idea!") instead of applying the techniques that human decision-makers use to pressure-test a call. This mission produces the evidence base for closing that gap.

Specifically, find and synthesize everything that has shipped in production agentic systems between **2025-01-01 and 2026-05-24** in three overlapping zones:

1. **Conversational decision techniques** — single-agent procedures the system applies when the user asks "is this a good idea / which is better / should I do X?"
2. **Multi-agent council / debate / tournament patterns** — fan-out architectures where 3+ agents with different stances analyze the same question and a synthesizer composes the answer.
3. **Domain adaptation** — how the same skill (e.g. pre-mortem, inversion) adapts across code review / medical / legal / financial / creative / strategic domains.

The output feeds two kit additions: **KB-05 "Conversational Decision Engineering"** (the techniques catalog and theory) and **`templates/skills/decision/`** (≤10 ready-to-implement skill spec files matching the kit's existing skill format).

---

## Ground rules

- **Primary sources only.** arXiv (with DOI + version), published proceedings, official framework docs and release notes, marketplace listings with download counts, vendor blog posts only when they describe a shipped capability with concrete spec details. No paraphrased secondary commentary as evidence.
- **2026-current filter.** Anything older than 12 months requires explicit verification of "still SOTA / still maintained / still shipping." Date-stamp every citation.
- **Severity-tag every finding.** 🚨 BLOCKER (kit cannot ship the gap-fix without this) · ⚠ HIGH (significantly improves the gap-fix) · 🟡 MEDIUM (polish) · 🟢 LOW (background context).
- **Numeric confidence (0.0–1.0) on every load-bearing claim.** 1.0 = verbatim from primary source + replicated by ≥2 independent sources. 0.7–0.9 = single primary source + corroboration. 0.4–0.7 = single primary source, no corroboration. <0.4 = flag in Uncertainty log, do NOT promote to recommendation.
- **No invention.** If the evidence base is silent on a question, say so in Uncertainty log. Do not extrapolate from training-data assumptions about "what agentic systems probably do."
- **Production ≠ paper.** If a technique exists only in a 2024 preprint with no production deployment, mark it RESEARCH-ONLY, not a recommendation.
- **Anti-sycophancy yourself.** This report critiques agentic-system sycophancy. If a "popular" technique has weak evidence, say so. If a vendor's claimed pattern lacks open implementation, flag it.

---

## Knowledge manifest (read order; hard cap 8 sources)

### Primary corpus (read FIRST — define the SOTA)

1. **arXiv** — search terms: "multi-agent debate", "LLM jury", "Society of Mind LLM", "constitutional AI critic", "Tree of Thoughts", "Graph of Thoughts", "self-refine", "self-consistency", "deliberation language model", "LLM-as-judge", "agentic decision making". Filter to 2025-01 onwards; require ≥1 production deployment reference per cited paper.
2. **Major framework release notes 2025–2026** — LangGraph (langchain.com/langgraph), AutoGen (microsoft.github.io/autogen), CrewAI (crewai.com), DSPy (dspy.ai), BAML (boundaryml.com), LlamaIndex agents, Claude Agent SDK changelog.
3. **Skill / agent marketplaces** — Claude Code skills, OpenAI Custom GPT directory, LangChain hub agent templates, Anthropic skill examples in `platform.claude.com/docs`. Capture: skill name, trigger description, procedure outline, download count if visible.

### Kit context (read SECOND — recommendations must compose with these)

4. **`~/Projects/AI/knowledge-base/KB-01-AI-WORKFLOW-ENGINEERING.md`** — §5 prompt engineering, §6 hallucination reduction, §5.8 dynamic system prompt construction. New decision skills must not contradict.
5. **`~/Projects/AI/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md`** — §3 skills systems, §4 agent architecture & orchestration, §4.8 production agent patterns. Skill spec stubs in the deliverable follow this format.
6. **`~/Projects/AI/knowledge-base/CLAUDE-SURFACE-ROUTING.md`** — surface routing must compose; conversational decision skills are a Code-surface or Chat affordance; multi-agent councils may use Code's Task tool or surface-specific sub-agent mechanism.

### Canon (read THIRD — only if Q1–Q3 leave gaps)

7. **Decision-canon primary texts** — Munger's *Poor Charlie's Almanack* (2-3 mental-models chapters), Tetlock's *Superforecasting*, Klein's pre-mortem 2007 HBR article, Kahneman *Thinking Fast and Slow* (System 1/2 framing only), Bezos 1997 shareholder letter (Type 1/2 decisions). Use sparingly — these are background, not evidence of production deployment.

### Out-of-scope

- Single-vendor marketing pages without spec detail.
- LinkedIn / Medium / Substack secondary commentary.
- Training-data folklore ("everyone knows agents should…") without citation.
- Pre-2025 papers unless explicitly re-verified as still SOTA.

---

## Research questions

### 🚨 BLOCKER — gap-fix cannot ship without these

**Q1. Multi-agent council / debate / tournament patterns in production.**
For each pattern shipping in production agentic systems (Claude Agent SDK, LangGraph, AutoGen, CrewAI, DSPy, custom): citation (paper or framework doc + section), agent topology (number of agents, role assignment, fan-out vs sequential vs hybrid), synthesis mechanism (LLM-as-judge, majority vote, weighted consensus, debate winner), context budgeting (how the framework prevents N×token blowup), when to apply (decisive vs exploratory vs verification), failure modes (echo chamber / contrarianism cascade / synthesis hallucination / token-budget blowup), measurable improvement over single-agent baseline if benchmarked. Target ≥3 patterns, ≤7.

**Q2. Conversational decision techniques — production catalog.**
For each technique observable in production (Claude Code skills, custom GPTs, LangChain hub, Anthropic skill examples, framework defaults) OR documented in the decision-making canon AND reproducible as a skill: name, trigger-phrase patterns the agent listens for, step-by-step procedure (4–7 numbered steps), output format the user sees, anti-patterns (when NOT to apply it), evidence (citation + adoption signal: download count / repo stars / vendor reference). Cover at minimum: **inversion**, **pre-mortem**, **10-10-10**, **second-order thinking**, **Bayesian update**, **steelmanning**, **disconfirming-evidence-first**, **confidence calibration**, **reversibility check (Type 1/2)**, **cost-of-inaction**. Add any others that have shipped and meet the evidence bar; flag canonical techniques that have NOT shipped as production skills (gap signal). Target 10–15 techniques.

**Q3. Anti-sycophancy patterns shipped in 2025–2026.**
Concrete techniques agents use to push back instead of validate. For each: source (paper / framework / vendor doc), mechanism (system-prompt clause / sub-agent injection / RLAIF / constitutional rule / fine-tuning), example output difference (sycophantic baseline vs anti-sycophantic), measurable evidence (eval scores, A/B results, vendor claims with confidence range), trade-offs (does it harm helpfulness on legitimate-affirmation tasks?). Target ≥3 patterns.

### ⚠ HIGH — shape the integration

**Q4. Skill router architecture.**
How do production systems decide *which* decision technique to apply to a given question? Three candidate architectures: (a) **trigger-phrase mapping** — keyword/regex → skill (cheap, deterministic, brittle); (b) **LLM-based routing** — small classifier or zero-shot LLM picks (expensive, robust, opaque); (c) **hybrid** — phrase mapping with LLM fallback. Find production examples of each. Output: a recommended router for the kit with phrase-mapping table + fallback rules.

**Q5. Domain adaptation patterns.**
Same skill, different domain. For 2–3 techniques (suggest: pre-mortem, second-order, confidence calibration) show the domain matrix: code review / API design / medical decision / legal opinion / financial trade / creative critique / strategic call. For each cell: what parameters change (evidence sources, severity thresholds, output structure, time budget), what stays invariant (procedure shape, anti-patterns, success criteria). Output: a domain-adaptation pattern that any technique can be retro-fitted with.

**Q6. Context windowing for council/debate.**
When 5+ agents fan out, each producing 2–5K tokens of analysis, total context can exceed 50K. How do production systems synthesize without blowup? Look for: streaming synthesis, hierarchical synthesis (pairs → quads → final), pre-synthesis compression, structured-output enforcement (each agent emits ≤500 tokens of JSON). Cite production examples.

### 🟡 MEDIUM — polish

**Q7. Benchmarks + evals for "good decision-making" in agentic LLMs.**
What public benchmarks measure decision quality? (Calibration: Brier score, ECE. Consistency: repeated-trial agreement. Post-hoc: outcome-tracking on calibration tasks. Reasoning: GPQA, MMLU subsets, BIG-Bench reasoning splits.) Which of these are production-deployable as continuous evals on a decision-skill skill suite?

**Q8. Failure modes of decision techniques + councils.**
When does the technique itself become the problem? Inversion → contrarianism cascade. Pre-mortem → anxiety / motivated reasoning toward worst case. Multi-agent debate → echo chamber if agents share a prior. Confidence calibration → false precision. Devil's advocate → bad-faith argument shape. Catalog ≥6 failure modes with concrete mitigations.

### 🟢 LOW — background

**Q9. Mental-model libraries beyond Munger.**
Tetlock superforecasters' question-decomposition habits, Shane Parrish FS mental-models corpus, prediction-market epistemics (Manifold, Metaculus calibration patterns), Cedric Chin's commoncog learning frameworks. Cite ≥3 source corpora; do NOT enumerate all models — name the corpus and one signature pattern each.

**Q10. Cross-cultural decision frameworks.**
Eastern dialectical thinking (Nisbett 2003 *Geography of Thought*, Peng & Nisbett 1999 on dialectical thinking) vs Western Aristotelian framing. Do any production agentic systems engage these differently? (Likely answer: no — flag as research gap and opportunity.)

---

## 8-Gate Anti-Hallucination Framework

Every load-bearing claim must pass all 8 gates before promotion from draft to recommendation:

1. **Source gate** — primary source cited with §section + line range OR paper §section + DOI.
2. **Version gate** — paper/framework version + release date stamped. Anything pre-2025-01 requires re-verification of "still SOTA."
3. **Stack fit gate** — recommendation must be implementable as a kit skill (`templates/skills/<name>/SKILL.md` shape per KB-02 §3) OR a KB-05 KB entry. Pure-academic results without an implementation path = research-only, NOT a recommendation.
4. **Cost gate** — if recommendation requires specific model tier (Sonnet-4.6+, Opus-4.6+), 1M context, multi-agent fan-out, or paid framework license — state it explicitly. Flag any recommendation whose latency or token cost is >2× single-agent baseline.
5. **Implementation gate** — every skill spec stub has: trigger phrase, when to use, 4–7 numbered procedure steps, output format, anti-patterns, 1+ worked example. Abstract "apply this technique" = gate fail.
6. **Cross-reference gate** — every load-bearing claim confirmed by **≥2 sources** OR primary source + explicit "single-source, flagged" note.
7. **Existing knowledge gate** — recommendations must compose with KB-01 (no contradiction to context/prompt/hallucination guidance), KB-02 (skill format matches the kit's), CLAUDE-SURFACE-ROUTING.md (surface fit named per skill).
8. **Quote extraction gate** — where a paper or framework wording is definitional (e.g. exact definition of "self-refine," exact synthesis mechanism in "multi-agent debate"), embed **verbatim quote** + citation. Paraphrase of load-bearing definitions = gate fail. Target ≥8 verbatim quotes in the final report.

---

## Domain scenarios (stress-test every deliverable)

Apply each scenario to your draft skill catalog. If any scenario produces ambiguity or no-fit, the catalog has a gap.

**§1.** User in a coding session: *"I'm thinking of replacing our REST API with GraphQL — good idea?"*
→ Which skill fires? (Expected: inversion + reversibility + cost-of-inaction. Council fan-out is overkill for a Type-2 reversible call.)

**§2.** User in a strategic session: *"Should we expand to a new market?"*
→ Which skill / which council? (Expected: pre-mortem + 10-10-10 + steelman-the-status-quo; possibly a 3-agent council with optimist / pessimist / synthesizer roles.)

**§3.** User in a quick chat: *"Is this email tone good?"*
→ Which skill? (Expected: lightweight — NOT a council; maybe disconfirming-evidence-first single-pass.)

**§4.** User asks a question the agent has historically over-validated: *"My idea for X — what do you think?"*
→ Does the anti-sycophancy pattern fire before the technique selection? (Expected: yes — the anti-sycophancy is a meta-skill applied to every "what do you think?" form before content evaluation.)

**§5.** Council vs single-skill threshold — *what task complexity signal triggers a multi-agent council over a single technique?*
→ Catalog must give a decidable rule (e.g. "≥3 mutually-exclusive options OR irreversible commit OR estimated impact >X").

If any scenario lacks a clear answer in your skill catalog + router, iterate.

---

## Deliverable format (saved by operator after delivery)

Single markdown report, ~3,000–5,000 words, target path `~/Projects/AI/research/2026-MM-DD-decision-techniques.md`. Required sections (exact order, hard ceilings):

1. **Executive distillation** — ≤15 lines. The 3 biggest findings + the 1 sentence that should land in the kit's KB-05 first paragraph.
2. **Skill catalog table** — 10–15 rows × 7 columns: skill name, trigger phrase examples (3 each), procedure (5–7 numbered steps), output format, anti-patterns (≥2), evidence citation, severity tag.
3. **Council / debate reference architecture** — sequence diagram (markdown) + agent role definitions + synthesis pattern + context budget + when to invoke (decidable rule from §5 of Domain scenarios).
4. **Anti-sycophancy concrete patterns** — ≥3 patterns with: source citation, system-prompt snippet (verbatim where available), example output difference (sycophantic baseline → anti-sycophantic), trade-off notes.
5. **Skill router recommendation** — phrase-mapping table (≥10 rows) + LLM fallback rule + decidable threshold for council vs single-skill.
6. **Integration path** — exact file paths the kit needs:
   - `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` (outline only — section headers + 1-line per section)
   - `templates/skills/decision/<name>/SKILL.md` × ≤10 (one stub per skill in the catalog — full skill spec in the kit's format)
   - Generator integration: which Phase in `generator/PROJECT_SETUP_PROMPT.md` introduces these
   - Cross-references to add in CLAUDE.md, README.md, CHANGELOG (just the lines)
7. **Verbatim quote library** — ≥8 quotes anchoring load-bearing definitional claims. Each: `> "exact text" — source §section/lines, subtopic`.
8. **Uncertainty log** — ≥5 entries: gaps in evidence base, single-source claims, version-staleness risks, plan-tier assumptions, scope edges.
9. **Re-verification schedule** — recommended cadence (quarterly default + event triggers) + monitoring list (which frameworks/papers/marketplaces to track).
10. **Commit hand-off** — a `code-handoff-prompts.md`-format paragraph the operator pastes into Claude Code to begin integration (instructs Code to read this report + write KB-05 + write skill stubs + commit + push).

---

## Success criteria (researcher self-scores before returning)

- [ ] ≥10 verified, in-production-or-implementable conversational decision techniques in the catalog
- [ ] ≥3 multi-agent council/debate architectures detailed with paper or framework citations
- [ ] ≥3 anti-sycophancy patterns cited from production frameworks or papers
- [ ] Skill router architecture decided (trigger / LLM / hybrid) with evidence
- [ ] Every load-bearing claim has ≥1 primary citation; every recommendation has numeric confidence
- [ ] All 5 domain scenarios produce a clear skill-selection answer from the catalog
- [ ] ≥8 verbatim quotes embedded
- [ ] ≥10 skill spec stubs in kit format (trigger / procedure / output / anti-patterns)
- [ ] KB-05 outline ≤30 section headers, each with 1-line description
- [ ] Integration path lists exact file paths and CHANGELOG lines
- [ ] Uncertainty log ≥5 entries
- [ ] 8 anti-hallucination gates passed per load-bearing finding
- [ ] No invention; no folklore; no pre-2025 source promoted without re-verification
- [ ] Commit hand-off paragraph paste-ready for Code

---

## What I don't know — invite the executor to flag

Close the report with prompt-back to the operator:

- Is the kit's existing skill format (per KB-02 §3) sufficient for decision-skills, or does decision-engineering need its own format extension (e.g. for council orchestration)?
- Does the operator want council patterns surfaced in the kit's surface-routing rubric (i.e., "when to invoke Task tool with multiple agents" as a new routing dimension), or kept as an internal skill mechanism?
- Plan-tier assumption: kit user is Pro/Max — confirm before recommending multi-agent patterns that consume 5× tokens.
- Domain coverage: did the operator want code / strategy / creative / financial in scope, or is one of these intentionally out-of-scope for the kit?
- Anti-sycophancy fine-tuning vs prompt-only — does the kit want to recommend RLAIF-style fine-tuning (heavy implementation) or stay prompt-only (lighter but less robust)?

---

## Out of scope (strict — do not drift)

- Third-party IDE comparisons (Cursor vs Claude Code vs Windsurf, etc.).
- Frameworks the kit doesn't already touch (Ruby agent SDKs, niche academic-only systems).
- Cost-optimization speculation beyond noting token-cost multipliers.
- End-user-facing copy in any language.
- Rewriting kit files — this mission produces evidence + spec stubs; Code session integrates.
- Speculative future research agendas — focus on shipped or implementation-ready only.

---

## Operator notes (post-delivery)

After Chat Research returns the report:

1. Save to `~/Projects/AI/research/2026-MM-DD-decision-techniques.md`.
2. Hand off to Code via the commit-handoff paragraph at end of report.
3. Code session reads the report, writes `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` + ≤10 `templates/skills/decision/<name>/SKILL.md` files + updates CHANGELOG + commits + pushes.
4. Schedule next refresh per the report's re-verification schedule (default: quarterly + on major framework release).

---

## Sibling references in this kit

- Mission template (the structure this dispatch follows): `~/Projects/AI/prompts/chat-research-missions.md`
- Surface routing (why Chat is the right surface): `~/Projects/AI/knowledge-base/CLAUDE-SURFACE-ROUTING.md` §3 Q2
- Skill format the spec stubs must follow: `~/Projects/AI/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §3
- Worked example of a heavy dispatch prompt at production rigor: `~/Projects/AI/the private lab's worked instance (not shipped)`
