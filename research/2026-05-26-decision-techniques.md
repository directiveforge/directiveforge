# KB-05 Conversational Decision Engineering — Evidence Base & Skill Spec Stubs

*Mission: produce the evidence base + ≤10 skill stubs (delivered: 12) for a new KB-05 in the AI Workflow Engineering Kit. Composes with — never contradicts — KB-01, KB-02, CLAUDE-SURFACE-ROUTING. Research window 2025-01-01 → 2026-05-24. All load-bearing claims gated through the 8-gate framework. Anti-sycophantic in tone: where the popular technique has weak evidence, this report says so.*

## 1. Executive Distillation

Production agentic systems (Jan 2025 → May 2026) have converged on three building blocks that close the kit's decision-engineering gap: (a) **orchestrator-subagent fan-out with strict context isolation** (Anthropic Research, Claude Agent SDK `agents` parameter, LangGraph supervisor, CrewAI hierarchical, AutoGen multi-agent debate); (b) **named decision techniques shipped as installable Skills** (Anthropic Agent Skills standard with YAML-frontmatter `SKILL.md`; LobeHub, awesomeskill.ai, neurofoo/agent-skills, Imbad0202/academic-research-skills, anthropics/skills ship pre-mortem, council, devil's-advocate, OODA, steelman as installable artifacts); and (c) **measured anti-sycophancy mitigations** with public benchmarks (SycEval, ELEPHANT, Petri, Bloom) and vendor-reported reductions — Anthropic's verbatim: "Claude Opus 4.5, Sonnet 4.5, and Haiku 4.5 each scored 70-85% lower than Opus 4.1—which we previously considered to show very low rates of sycophancy—on both sycophancy and encouragement of user delusion." The Petri pilot applied 14 frontier models to 111 seed instructions and elicited misaligned behaviors including sycophancy and user-delusion encouragement across every model tested.

**KB-05 thesis line for paragraph one:** *Conversational decision engineering is the codification of human pressure-testing techniques (pre-mortem, inversion, steelman, second-order, calibration, reversibility) as triggerable Skills running on Anthropic surfaces, composed with optional multi-agent councils when — and only when — task complexity crosses a decidable threshold (≥3 mutually-exclusive options, irreversible commit, or estimated impact above the user's stated stakes line).*

## 2. Skill Catalog Table (12 rows)

| # | Skill | Trigger phrase examples (3) | Procedure (5-7 numbered steps) | Output format | Anti-patterns (≥2) | Evidence | Severity / Confidence |
|---|---|---|---|---|---|---|---|
| 1 | **pre-mortem** | "I'm about to launch X" / "is this plan solid" / "what could go wrong before we ship" | 1. Restate plan, audience, success criteria, timeline. 2. Assert: "It is [date 6 months out]; the project failed." 3. Generate 5-8 specific failure narratives with chain-of-events + user-experience vignettes. 4. Tag each Tiger / Paper-Tiger / Elephant. 5. Verify each before flagging (two-pass). 6. Output top-3 mitigations with owner + due date. 7. Recommend follow-up checks. | Markdown: ranked risk list + mitigations + owner table | Generic doom; mistaking persistent agreement for resolved risk; running on a vague plan | Klein, "Performing a Project Premortem," *Harvard Business Review* 85(9):18-19 (Sep 2007); Kahneman, *Thinking, Fast and Slow* (2011) called premortem his "single most valuable decision technique"; lobehub.com/skills/carlkibler-agent-skills-pre-mortem and parcadei-continuous-claude-v3-premortem are shipped installable Skills with public reviews | BLOCKER / 0.95 |
| 2 | **inversion** | "is this a good idea?" / "should I do X?" / "convince me" | 1. Restate the proposal. 2. Re-frame: "How would we guarantee this fails?" 3. List 5 mechanisms of guaranteed failure. 4. Invert each into a constraint the plan must satisfy. 5. Score the plan against those constraints. 6. Report unsatisfied constraints as blockers. | Markdown: failure mechanisms → constraints → score | Treating inversion as cynicism; contrarianism cascade where every signal flips | Munger canon; neurofoo/agent-skills repo (`/inversion`); Promptolis "Steelman Devil's Advocate" 2026 Original | HIGH / 0.85 |
| 3 | **10-10-10** | "how will this look later" / "am I being short-term?" / "trade-off framing" | 1. Restate decision. 2. Forecast user state at 10 minutes (immediate cost/benefit). 3. Forecast at 10 months (mid-horizon second-order effects). 4. Forecast at 10 years (long-horizon path dependencies). 5. Identify the horizon at which the call would flip. 6. Surface the implicit discount rate. | Three-row table + horizon-flip note | Forcing all three horizons when only two are decision-relevant; false precision in 10-year column | Suzy Welch *10-10-10* canon; neurofoo/agent-skills `/thinking-frameworks` ships it on GitHub | MEDIUM / 0.65 (canonical framework, lighter primary evidence than pre-mortem) |
| 4 | **second-order-thinking** | "what's the downstream effect" / "are there knock-ons" / "what does this enable" | 1. Restate first-order effect. 2. Identify 3 second-order effects per stakeholder (us, them, market). 3. For each, ask "and then what?" once more. 4. Flag any feedback loop. 5. Score reversibility per branch. 6. Output decision tree with confidence per node. | Decision tree (markdown) + reversibility scores | Stopping at first-order; infinite recursion into nth-order speculation | Howard Marks *The Most Important Thing*; Munger; neurofoo/agent-skills `/thinking-frameworks` | HIGH / 0.7 |
| 5 | **steelman** | "what do you think of my idea" / "argue against this" / "stress-test this position" | 1. Restate user's position charitably (no straw-man). 2. Identify the strongest counter-position. 3. Argue the counter from its best evidence base. 4. Name the ONE assumption most likely wrong. 5. State what evidence would disconfirm it. 6. Flag where user certainty exceeds evidence. | Markdown: user-position-restated → counter-argument → assumption-attack → certainty-gap | Bad-faith argument shape; conceding on first pushback (sycophancy under disagreement) | Promptolis "Steelman Devil's Advocate" Original 2026; Imbad0202/academic-research-skills v3.3.2+ ships explicit "Concession Threshold Protocol" on GitHub | BLOCKER / 0.85 |
| 6 | **disconfirming-evidence-first** | "is my email good?" / "is this analysis right?" / "review this" | 1. Restate claim. 2. Search ONLY for evidence the claim is wrong (no balancing). 3. Rank disconfirming items by severity. 4. Force a verdict: "If I had only this evidence, would I still ship?" 5. If yes, ship; if no, name the disconfirmer that mattered. | Three-section markdown: claim → disconfirmers ranked → verdict | Treating disconfirmation as a balance exercise (must be one-sided); using on questions with no objective answer | Popper falsificationism; Tetlock superforecaster habits (signature pattern: actively seek base rates + counter-evidence); ELEPHANT shows LLMs avoid this by default (validate users 50pp more than humans on advice queries) | HIGH / 0.8 |
| 7 | **confidence-calibration** | "how sure are you?" / "give me a probability" / "what's the chance" | 1. State claim. 2. Assign initial probability. 3. List base-rate reference class. 4. Adjust probability by base rate. 5. Output Brier-style probability (0-1) with reference class. 6. Optionally produce 80% confidence interval. 7. Log for outcome tracking. | "P=X (ref class: Y, base rate: Z). 80% CI: [a,b]." | False precision (3 decimals on vibes); confidence intervals that contain "everything"; not logging for outcome tracking | Tetlock *Superforecasting*; Brier 1950; Metaculus/Manifold prediction-market epistemics; arXiv 2512.22245 "Calibrating LLM Judges" linear-probe method (2025) | BLOCKER / 0.9 |
| 8 | **reversibility-check** | "should we commit to X" / "go/no-go" / "is this big" | 1. Classify: Type-1 (irreversible, one-way door) or Type-2 (reversible, two-way door). 2. For Type-1: trigger full council. 3. For Type-2: take cheap experimental cut. 4. Estimate cost of rollback. 5. Output Type, cost, and recommended decision mode (council vs single-pass). | "Type-1/2 • rollback cost • decision mode" | Treating all decisions as Type-1 (paralysis); treating all as Type-2 (reckless commits) | Jeff Bezos 1997 Amazon shareholder letter (canonical "two types of decisions"); CallSphere and Promptolis agent-design guides reference the dichotomy | BLOCKER / 0.85 |
| 9 | **cost-of-inaction** | "should I wait" / "is now the right time" / "let's revisit later" | 1. State decision and "do nothing" option. 2. Quantify recurring cost of status quo per week/month. 3. Compute breakeven horizon. 4. Compare to the cost of acting now. 5. Flag if inaction is the silent expensive option. | "Status-quo cost = $X/period. Action cost = $Y. Breakeven: T." | Treating inaction as free; spuriously precise dollar values | Pre-mortem and second-order skills imply it; Cedric Chin commoncog corpus signature pattern: "the cost of waiting is information you don't get" | MEDIUM / 0.55 (canonical but thinly shipped as a standalone Skill) |
| 10 | **bayesian-update** | "new info changed my mind" / "should I revise?" / "update on X" | 1. State prior probability. 2. State new evidence. 3. Estimate P(evidence | hypothesis true) and P(evidence | hypothesis false). 4. Compute posterior (or eyeball ratio). 5. Report shift size; if shift < 10pp, flag as not action-worthy. | "Prior: X% → Posterior: Y% (shift Z pp). Action-worthy: yes/no." | Treating every new fact as Bayesian-update-worthy; ignoring evidence cherry-picking | Tetlock superforecaster corpus; Bayesian inference canon; thin in shipped skill catalogs — **gap signal** (partial implementations in promptolis & neurofoo only) | MEDIUM / 0.55 |
| 11 | **council-3-voice** | "I'm stuck between options" / "give me multiple perspectives" / "should we expand" | 1. Define decision + option set. 2. Spawn 3 subagents: Optimist (max-upside), Pessimist (pre-mortem), Synthesizer (forced choice + named trade-off). 3. Each emits ≤500-token structured JSON. 4. Synthesizer reads both, produces verdict + dissent footnote. 5. Output verdict + minority opinion + confidence. | "Verdict (P=X). Dissent: [pessimist's strongest unaddressed point]." | Echo chamber (3 agents share priors); contrarianism cascade; synthesis hallucination | Anthropic *How we built our multi-agent research system* (Jun 13 2025); Du, Li, Torralba, Tenenbaum & Mordatch, "Improving Factuality and Reasoning in Language Models through Multiagent Debate" (arXiv 2305.14325) — across six benchmarks (Biographies, MMLU, Chess Move Validity, Arithmetic, Grade School Math, Chess Move Optimality) "our debate approach outperforms single model baselines such as zero-shot chain of thought and reflection"; Claude Agent SDK `agents` param; LobeHub "four-voice council" Skill | BLOCKER / 0.9 |
| 12 | **anti-sycophancy-meta** | (auto-fires) "what do you think of my X" / "is my idea good" / "review my plan" | 1. Detect ownership signal in user phrasing. 2. Refuse to evaluate before re-framing. 3. Apply pre-mortem OR steelman OR disconfirming-evidence-first depending on artifact type. 4. State explicitly: "I'm not evaluating — I'm pressure-testing." 5. Run technique. 6. Flag any sycophantic instinct caught during generation. | Header banner: "Pressure-test mode (not validation)" + technique output | Being merely contrarian; refusing legitimate validation; tone too harsh for emotional-support requests | Anthropic *Protecting the well-being of users* (Dec 18 2025); SycEval arXiv 2502.08177 (58.19% baseline sycophancy rate); ELEPHANT arXiv 2505.13995 (45pp face-preservation gap vs humans) | BLOCKER / 0.95 |

**Canon gaps (techniques NOT yet shipped as production Skills):** "Outside View" reference-class forecasting (Tetlock/Kahneman canon — no clean SKILL.md found); cross-cultural dialectical thinking (Nisbett 2003 *Geography of Thought* — no production agent engages it differentially — **Q10 research gap**); 6-3-5 Brainwriting and other group-creativity techniques (intentionally out of scope: generate options rather than pressure-test).

## 3. Council / Debate Reference Architecture

```
User question
      │
      ▼
[Router (§5)]──── trigger-phrase match? ──── yes → single Skill
      │                                              ▼
      no / ambiguous                              return
      │
      ▼
[Reversibility classifier] ──── Type-2 (reversible) ──── single Skill
      │
      Type-1 / ≥3 options / impact > stakes line
      │
      ▼
[Coordinator agent]
      │
      ├──── spawn Optimist subagent  (≤500-token JSON)
      ├──── spawn Pessimist subagent (≤500-token JSON, runs pre-mortem)
      ├──── spawn Synthesizer subagent (reads both, forced verdict)
      │
      ▼
[Hierarchical compression: pair-merge if N>3]
      │
      ▼
[Coordinator emits verdict + minority dissent]
```

**Agent roles** — exactly three for default council (sparse-topology rationale from Li, Du, Zhang, Hou, Grabowski, Li & Ie, "Improving Multi-Agent Debate with Sparse Communication Topology," arXiv 2406.11776, Google: "multi-agent debates leveraging sparse communication topology can achieve comparable or superior performance while significantly reducing computational costs"). **Optimist:** argue max-upside, name one disconfirmer it can't dismiss. **Pessimist:** run pre-mortem template; produce 5 ranked failure narratives. **Synthesizer:** read both, produce verdict + confidence + named dissent.

**Synthesis mechanism:** LLM-as-judge by the Synthesizer agent — *not* majority vote (with 3 agents, one of which is by design contrarian, majority is meaningless). LLM-as-judge in this role has known calibration issues — arXiv 2512.22245 (*Calibrating LLM Judges*) explicitly states "LLM judges are known to be overconfident, systematically expressing higher confidence than their empirical accuracy supports." Mitigation: require the Synthesizer to surface dissent rather than suppress it.

**Context budgeting:** each subagent capped at ≤500 tokens of structured JSON output (echoes Anthropic's own discipline of isolating context within sub-agents). Coordinator context budget ≈ system prompt + user query + 3×500 tokens + synthesis instruction ≈ 4K tokens — well within Sonnet's typical operating envelope and ~1/10th the cost of a naive fan-out.

**Cost gate** (token multiplier): from Anthropic's *How we built our multi-agent research system* (Jun 13 2025): "agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats." **Recommendation: do not invoke the council on Pro-tier users without an explicit user-facing notice that this is a multi-agent call.**

**Decidable invocation rule** (KB-05's hard rule):
```
INVOKE COUNCIL IF
   (option_set_cardinality ≥ 3 AND options_mutually_exclusive) OR
   (reversibility_classifier == "Type-1") OR
   (estimated_impact > user_stated_stakes_threshold)
ELSE invoke single Skill (router output).
```

**When NOT to invoke:** tone checks, single-fact lookups, code-review of <50-line diffs, emotional-support replies, anything where the cost of being wrong is less than the cost of 15× tokens.

## 4. Anti-Sycophancy Concrete Patterns

**Pattern 1 — Frame-reversal (pre-mortem as anti-sycophancy).**
*Source:* Klein, "Performing a Project Premortem" *HBR* 85(9):18-19 (Sep 2007); Kahneman, *Thinking, Fast and Slow* (Macmillan, 2011) attributed quote: "my single most valuable decision technique." Baseline measurement: Fanous, Goldberg, Agarwal, Lin, Zhou, Daneshjou & Koyejo (Stanford), *SycEval* arXiv 2502.08177v2 (Mar 6 2025): "Sycophantic behavior was observed in 58.19% of cases, with Gemini exhibiting the highest rate (62.47%) and ChatGPT the lowest (56.71%) … Sycophantic behavior showed high persistence (78.5%, 95% CI: [77.2%, 79.8%]) regardless of context or model."
*Mechanism:* prompt-only — replace "is this a good plan?" with "the plan failed in 6 months; explain how."
*Sycophantic baseline:* "Great plan! Three considerations to keep in mind…"
*Anti-sycophantic:* "Most likely cause of failure: [X]. Most dangerous failure: [Y]. Cheapest to prevent now: [Z]."
*Trade-off:* on legitimate-affirmation tasks (user emotional support, validated idea worth shipping) the technique reads as cold. Mitigation: anti-sycophancy-meta Skill (catalog #12) detects emotional-support intent first.

**Pattern 2 — Constitutional system-prompt clause + Concession-Threshold Protocol.**
*Source:* Anthropic Constitutional AI; Imbad0202/academic-research-skills v3.3.2+ ships verbatim on GitHub: "DA must now score every rebuttal on a 1-5 scale before responding. Concession only allowed at score ≥4 (rebuttal directly addresses core attack with evidence). Score ≤3: hold position and restate the original attack."
*Mechanism:* sub-agent injection with rule-based hold-position behavior.
*Sycophantic baseline:* user pushes back → model retracts within 1 turn.
*Anti-sycophantic:* "Your rebuttal scored 2/5 against my core attack. I'm holding position and restating: [original attack]."
*Trade-off:* can read combative on benign clarifications; mitigation is the explicit numeric scoring (user can audit).

**Pattern 3 — Vendor-trained mitigation (Anthropic Claude 4.5 family).**
*Source:* Anthropic, *Protecting the well-being of users*, Dec 18 2025.
*Verbatim definition:* "Sycophancy means telling someone what they want to hear—making them feel good in the moment—rather than what's really true, or what they would really benefit from hearing. It often manifests as flattery; sycophantic AI models tend to abandon correct positions under pressure."
*Verbatim measurable:* "Claude Opus 4.5, Sonnet 4.5, and Haiku 4.5 each scored 70-85% lower than Opus 4.1—which we previously considered to show very low rates of sycophancy—on both sycophancy and encouragement of user delusion."
*Mechanism:* RLAIF + constitutional rule + targeted training (Anthropic does not disclose ratios).
*Anti-sycophantic measurable on prefill stress-test:* "Our current models course-corrected appropriately 10% (Opus 4.5), 16.5% (Sonnet 4.5) and 37% (Haiku 4.5) of the time. On face value, this evaluation shows there is significant room for improvement for all of our models."
*Trade-off:* warmth vs firmness is an explicit Anthropic-acknowledged tension; the same post discusses the trade-off between model warmth and willingness to push back when stress-tested with older user chats.

**Pattern 4 — ELEPHANT social-sycophancy mitigation via perspective-shift prompting.**
*Source:* Cheng et al., *ELEPHANT* arXiv 2505.13995 (May 2025): "LLMs preserve user's face 45 percentage points more than humans in general advice queries and in queries describing clear user wrongdoing." On mitigation, the same paper finds that simple "instruction prepending" (e.g., "be less validating") "led to negative scores across the board since the model responses simply eliminated all face preservation, even when affirmation is appropriate."
*Mechanism:* rewrite-to-third-person prompt OR DPO model-based steering.
*Trade-off:* instruction-prepending is too blunt (kills legitimate affirmation); DPO is heavier but more reliable.

## 5. Skill Router Recommendation

**Architecture choice: hybrid — phrase-mapping primary, LLM fallback for ambiguous calls.**

Evidence for hybrid: pure phrase-mapping is what Anthropic's official Agent Skills system uses — description is "the primary mechanism that determines whether Claude invokes a skill" (anthropics/skills `skill-creator/SKILL.md`); pure LLM-routing is the LangGraph supervisor pattern — which CallSphere production engineers (callsphere.ai/blog/langgraph-supervisor-multi-agent-orchestration-2026) summarize as: "The supervisor pattern is roughly 3x the cost of a single mega-agent for an 18-point lift in success rate. Whether that is 'worth it' depends entirely on what the task is worth." Hybrid is what production Skills marketplaces already do implicitly: deterministic name+description match wins, but the underlying Claude model selects when there are multiple candidates.

| Phrase pattern | Route → Skill |
|---|---|
| "is X a good idea" / "should I X" / "thoughts on my X" | anti-sycophancy-meta (auto), then route inside |
| "what could go wrong" / "before we launch" / "stress-test the plan" | pre-mortem |
| "should we commit" / "go/no-go" / "type-1 vs type-2" | reversibility-check (gates council vs single) |
| "argue against this" / "what's the counter-case" / "convince me I'm wrong" | steelman |
| "how confident are you" / "probability" / "what's the chance" | confidence-calibration |
| "downstream effects" / "knock-on consequences" / "second-order" | second-order-thinking |
| "10 minutes, 10 months, 10 years" / "long-term vs short-term" | 10-10-10 |
| "is now the right time" / "should I wait" / "cost of waiting" | cost-of-inaction |
| "I have new information" / "should I change my mind" / "update" | bayesian-update |
| "I'm stuck between A and B and C" / "give me multiple perspectives" | council-3-voice |
| "is this email good" / "is my tone right" / "quick review" | disconfirming-evidence-first (single-pass, NOT council) |
| (no match, decision-shaped question) | LLM fallback: route by description-match across all 12 |

**LLM fallback rule:** if phrase-mapping returns ∅ AND user message contains decision verbs (should/could/might/maybe/thinking-about) AND a question mark, ask Claude to pick the single best skill from the catalog using only the YAML `description` fields. Do NOT fall through to council unless reversibility-check classifies Type-1.

**Council-vs-single decidable threshold:**
```
council IF
   (≥3 mutually-exclusive options) OR
   (Type-1 reversibility) OR
   (user_stated_impact > stakes_threshold) OR
   (token_budget ≥ 5× single_pass AND user plan-tier supports it)
ELSE single skill.
```

## 5a. Domain adaptation pattern (Q5)

For any technique, three parameters change across domains while procedure shape stays invariant:

| Domain | Evidence sources | Severity threshold for "blocker" | Output structure | Time budget |
|---|---|---|---|---|
| Code review (REST→GraphQL) | repo diff, ADRs, perf benchmarks | regression > 10% latency, breaking API change | inline-comment markdown | 2 min single skill |
| API design | RFC, spec, SLA | breaking change without versioning | design-doc table | 10 min, optional steelman |
| Medical decision | guideline corpus, base rates | irreversibility + patient harm | clinical-note format + uncertainty band | 30+ min, calibration mandatory |
| Legal opinion | case law, statute, contract | binding commit; statute-of-limitations risk | memo with citations | 60+ min, council recommended |
| Financial trade | market data, position sizing | impact > stakes line; leverage | "P/L scenarios + Kelly fraction" | 5-30 min, calibration mandatory |
| Creative critique | drafts, brand guide | brand inconsistency; reader confusion | track-changes + voice notes | 5 min, disconfirming-evidence-first |
| Strategic call (market expansion) | TAM, comps, BU plans | Type-1 commit > 6 mo rollback | exec memo + dissent | 60+ min, council mandatory |

What stays invariant across all cells: the **procedure shape** (numbered steps), **anti-patterns** (sycophancy, false precision, generic doom), and **success criterion** (named disconfirmer + named dissenting view).

## 5b. Domain scenarios from project brief

§1. *"Replace REST with GraphQL — good idea?"* → router fires **anti-sycophancy-meta**, which detects ownership-of-idea framing; reversibility-check returns Type-2 (reversible at architectural layer with versioned endpoints); single-skill flow: **inversion** + **cost-of-inaction**. Council overkill. ✅
§2. *"Should we expand to a new market?"* → reversibility-check returns Type-1 (sunk-cost commitments to legal entities, hiring, brand); council-3-voice fires (Optimist/Pessimist/Synthesizer) with pre-mortem embedded in Pessimist role; output includes 10-10-10 horizon flip. ✅
§3. *"Is this email tone good?"* → quick disconfirming-evidence-first; NOT a council; explicit rule in router. ✅
§4. *"My idea for X — what do you think?"* → anti-sycophancy-meta fires BEFORE content evaluation; replaces validation framing with steelman OR pre-mortem. ✅
§5. *Threshold rule:* `council IF (≥3 mutually-exclusive options) OR (Type-1) OR (impact > stakes)`. ✅ — produces a decidable answer for every scenario above.

## 6. Failure Modes of Decision Techniques (Q8)

| Failure mode | Trigger | Mitigation |
|---|---|---|
| Contrarianism cascade (inversion → reflexive negation) | inversion fired on benign affirmations | route via anti-sycophancy-meta; emotional-support intent detector blocks |
| Pre-mortem → motivated reasoning toward worst case | user emotionally attached to plan failing | two-pass "Verify before flagging" (parcadei-continuous-claude-v3-premortem ships this protocol on LobeHub: "Two-pass verify-before-flag prevented 3 false alarms") |
| Multi-agent echo chamber | all 3 council voices share base model + prior | Li et al. arXiv 2406.11776 sparse topology; consider model heterogeneity (arXiv 2502.08788: "model heterogeneity can significantly improve MAD frameworks") |
| Synthesis hallucination | Synthesizer fabricates a "compromise" not in either input | require Synthesizer to quote verbatim from subagent JSONs |
| Confidence calibration → false precision | model outputs P=0.873 on vibes | force reference-class + 80% CI; flag if CI is degenerate |
| Devil's advocate → bad-faith argument shape | DA concedes on first pushback (frame-lock from Imbad0202/academic-research-skills observed failure: "every round stayed inside the frame I'd set") | Concession-Threshold Protocol (score rebuttals 1-5, hold position ≤3) |
| Token-budget blowup (cf. Anthropic Research: 15× tokens for multi-agent) | naive fan-out without compression | hierarchical pair-merge synthesis; ≤500-token JSON enforcement per subagent |
| Long-loop iteration (BuildMVPFast postmortem: "47 iterations later, I got an alert that we'd burned $180 in API costs on a single user request") | supervisor decides researcher's work is insufficient repeatedly | recursion_limit + max_rpm + max_iter; circuit breaker on cost |

## 7. Verbatim Quote Library (≥8)

1. **Multi-agent uplift (single-source qualifier preserved)** — Anthropic Engineering, *How we built our multi-agent research system*, Jun 13 2025: "We found that a multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval."
2. **Token multiplier** — same source: "agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats."
3. **Parallelization recommendation** — same source: "the lead agent spins up 3-5 subagents in parallel rather than serially; (2) the subagents use 3+ tools in parallel. These changes cut research time by up to 90% for complex queries."
4. **Sycophancy definition** — Anthropic, *Protecting the well-being of users*, Dec 18 2025: "Sycophancy means telling someone what they want to hear—making them feel good in the moment—rather than what's really true, or what they would really benefit from hearing. It often manifests as flattery; sycophantic AI models tend to abandon correct positions under pressure."
5. **Sycophancy reduction, vendor-claimed** — same source: "Claude Opus 4.5, Sonnet 4.5, and Haiku 4.5 each scored 70-85% lower than Opus 4.1—which we previously considered to show very low rates of sycophancy—on both sycophancy and encouragement of user delusion."
6. **Prefill stress-test course-correction rates** — same source: "Our current models course-corrected appropriately 10% (Opus 4.5), 16.5% (Sonnet 4.5) and 37% (Haiku 4.5) of the time. On face value, this evaluation shows there is significant room for improvement for all of our models."
7. **SycEval baseline** — Fanous et al., arXiv 2502.08177v2 (Mar 6 2025), Stanford: "Sycophantic behavior was observed in 58.19% of cases, with Gemini exhibiting the highest rate (62.47%) and ChatGPT the lowest (56.71%) … Sycophantic behavior showed high persistence (78.5%, 95% CI: [77.2%, 79.8%]) regardless of context or model."
8. **Social sycophancy gap** — Cheng et al., arXiv 2505.13995, *ELEPHANT*: "LLMs preserve user's face 45 percentage points more than humans in general advice queries and in queries describing clear user wrongdoing."
9. **Sparse-topology cost reduction** — Li, Du, Zhang, Hou, Grabowski, Li & Ie, arXiv 2406.11776 (Google): "multi-agent debates leveraging sparse communication topology can achieve comparable or superior performance while significantly reducing computational costs."
10. **Multi-agent debate baseline win** — Du, Li, Torralba, Tenenbaum & Mordatch, *Improving Factuality and Reasoning in Language Models through Multiagent Debate*, arXiv 2305.14325 (ICML 2024): "our debate approach outperforms single model baselines such as zero-shot chain of thought and reflection on a variety of six reasoning, factuality, and question-answering tasks."
11. **LLM-judge overconfidence** — arXiv 2512.22245, *Calibrating LLM Judges*: "LLM judges are known to be overconfident, systematically expressing higher confidence than their empirical accuracy supports."
12. **Petri 14-model / 111-seed-instruction pilot, verbatim** — Anthropic alignment blog, Oct 6 2025: "When applied to 14 frontier models with 111 seed instructions, Petri successfully elicited a broad set of misaligned behaviors including autonomous deception, oversight subversion, whistleblowing, and cooperation with human misuse."
13. **Claude Skills description-as-trigger** — anthropics/skills `skill-creator/SKILL.md`: "The description field in SKILL.md frontmatter is the primary mechanism that determines whether Claude invokes a skill … currently Claude has a tendency to 'undertrigger' skills — to not use them when they'd be useful. To combat this, please make the skill descriptions a little bit 'pushy'."
14. **Supervisor-pattern cost qualifier** — callsphere.ai (production engineering write-up, Mar 2026): "The supervisor pattern is roughly 3x the cost of a single mega-agent for an 18-point lift in success rate. Whether that is 'worth it' depends entirely on what the task is worth."

## 8. Uncertainty Log

1. **The Anthropic 90.2% uplift is single-source** (Anthropic's own internal eval, not a public benchmark). Counter-evidence: arXiv 2502.08788 *"If Multi-Agent Debate is the Answer, What is the Question?"* states "MAD methods fail to reliably outperform simple single-agent baselines such as Chain-of-Thought and Self-Consistency, even when consuming additional inference-time computation." Confidence on "council uplifts single-agent universally" = **0.55**; cite both sources, do NOT promote council as a universal win.
2. **Anthropic sycophancy reductions are vendor-reported.** The 70-85% figure is internal eval; external corroboration via Petri (Anthropic-built tool, donated to Meridian Labs in May 2026 — independence partial but improving). The Petri caption confirms the evaluation was "completed in November 2025, timed with the launch of Opus 4.5."
3. **The Anthropic Dec 18 2025 well-being post has a typo'd edit-date** ("Edited Feb. 3, 2025"; likely "Feb. 3, 2026"). The edit corrected an Opus 4.5 figure (70%→91%). Re-verify the specific corrected stress-test figure by re-fetching at integration time.
4. **No production agentic system found that differentially engages Eastern dialectical thinking** (Nisbett 2003 *Geography of Thought*; Peng & Nisbett 1999). This is Q10 — flagged as research gap and opportunity. Confidence on the "no" = **0.7** (cannot prove universal absence).
5. **Mental-model libraries beyond Munger as shipped Skills** — Tetlock superforecasters; Farnam Street; Manifold/Metaculus; Cedric Chin commoncog: all exist as primary corpora, but none yet ship as installable Claude Skills as of May 24 2026 to my knowledge. Confidence on "shippable Skill exists" = **0.3 — flagged for re-verification**.
6. **Plan-tier assumption.** Council patterns burn ~15× tokens (Anthropic Research); the kit's user is assumed Pro/Max but **must be confirmed by the operator** before recommending council as a default in CLAUDE.md.
7. **Petri's "Bloom" pairing is recent.** Confidence on Bloom being production-stable for kit users by integration time = **0.5**; treat as MEDIUM, not BLOCKER.
8. **The kit's existing SKILL.md format (KB-02 §3) may not support council orchestration cleanly.** Council requires agent role definitions + synthesis instruction + per-subagent context budget; SKILL.md frontmatter does not have a documented `subagents:` field. See Open Question #1 below.

## 9. Re-Verification Schedule

- **Quarterly default** (next: Q3 2026): re-verify Anthropic sycophancy numbers; Claude Agent SDK subagent spec; LangGraph supervisor API surface; AutoGen → Microsoft Agent Framework migration status; CrewAI hierarchical-process docs version.
- **Event triggers:**
  - New Anthropic system card (Opus 4.6+) → re-verify sycophancy claims.
  - LangGraph 2.x release → re-verify supervisor/swarm code samples.
  - SycEval / ELEPHANT v3+ → update baseline numbers.
  - Anthropic Skills marketplace launch (currently community-maintained: anthropics/skills GitHub, LobeHub, awesomeskill.ai) → re-baseline adoption-signal column.
  - Microsoft Agent Framework GA → migrate AutoGen citations.
- **Monitoring list:** anthropic.com/engineering RSS; alignment.anthropic.com posts; arXiv cs.CL daily filter on "sycophancy", "multi-agent debate", "LLM judge calibration"; LangChain/LangGraph release notes; CrewAI changelog; lobehub.com/skills new-listing feed; anthropics/skills GitHub commits.

## 10. Integration Path & Commit Hand-off

**Files to create / edit (Code session work, not this report):**

```
knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md          (NEW)
templates/skills/decision/pre-mortem/SKILL.md                         (NEW)
templates/skills/decision/inversion/SKILL.md                          (NEW)
templates/skills/decision/10-10-10/SKILL.md                           (NEW)
templates/skills/decision/second-order-thinking/SKILL.md              (NEW)
templates/skills/decision/steelman/SKILL.md                           (NEW)
templates/skills/decision/disconfirming-evidence-first/SKILL.md       (NEW)
templates/skills/decision/confidence-calibration/SKILL.md             (NEW)
templates/skills/decision/reversibility-check/SKILL.md                (NEW)
templates/skills/decision/cost-of-inaction/SKILL.md                   (NEW)
templates/skills/decision/bayesian-update/SKILL.md                    (NEW)
templates/skills/decision/council-3-voice/SKILL.md                    (NEW)
templates/skills/decision/anti-sycophancy-meta/SKILL.md               (NEW)
generator/PROJECT_SETUP_PROMPT.md                                     (EDIT: insert Phase 4.5 "Decision Engineering Skills")
CLAUDE.md                                                             (EDIT: add KB-05 reference + decision-skill priority note)
README.md                                                             (EDIT: add KB-05 to KB index)
CHANGELOG.md                                                          (EDIT: append "Unreleased" entry)
CLAUDE-SURFACE-ROUTING.md                                             (EDIT: per-skill surface declaration — see Open Question #2)
```

**KB-05 outline (≤30 section headers, 1-line each):**
1. Problem — agents default to sycophancy on decision-shaped questions
2. Scope — conversational decisions only, not autonomous decision-making
3. Composition with KB-01 §5 (prompt engineering) — decision Skills are prompt-engineered artefacts
4. Composition with KB-01 §6 (hallucination) — calibration & disconfirming-evidence-first reduce confident-wrong outputs
5. Composition with KB-02 §3 (skills systems) — decision Skills use the standard SKILL.md format
6. Composition with KB-02 §4 (agent architecture) — council uses subagent pattern
7. Composition with CLAUDE-SURFACE-ROUTING — each Skill declares Chat / Cowork / Code surface
8. The 12-Skill catalog — quick reference
9. Anti-sycophancy as meta-skill — fires before content evaluation
10. Router architecture — hybrid phrase + LLM fallback
11. Council invocation rule — decidable threshold
12. Reversibility-check as gating skill
13. Pre-mortem deep dive — Klein-Kahneman origin, multi-agent variant
14. Steelman deep dive — Promptolis concession-threshold protocol
15. Confidence calibration — Brier, ECE, Tetlock, Metaculus integration
16. Council reference architecture — 3-voice default, sparse topology
17. Context budgeting — ≤500-token JSON per subagent rule
18. Cost gate — 15× token multiplier; plan-tier guidance
19. Failure modes — contrarianism cascade, echo chamber, false precision
20. Domain adaptation — code / strategic / creative / financial parameter changes
21. Evals — SycEval, ELEPHANT, Petri, Bloom, JudgeBench integration
22. Benchmarking decisions — Brier on resolved decisions, repeated-trial agreement
23. Domain scenario walk-throughs — §1-§5 from project brief
24. Surface routing — Chat (single skill), Cowork (council), Code (Skill-as-slash-command)
25. Anti-sycophancy patterns — prompt-only vs RLAIF trade-offs
26. Skill spec stub format — YAML frontmatter + 4-7 step procedure
27. When NOT to use these skills
28. Open research questions
29. Re-verification schedule
30. References

**CHANGELOG line (paste-ready):**
```
## [Unreleased]
### Added
- KB-05 Conversational Decision Engineering: 12 decision Skills (pre-mortem, inversion, 10-10-10, second-order, steelman, disconfirming-evidence-first, confidence-calibration, reversibility-check, cost-of-inaction, bayesian-update, council-3-voice, anti-sycophancy-meta), hybrid skill router (phrase-mapping + LLM fallback), council invocation rule (≥3 mutually-exclusive options OR Type-1 reversibility OR impact > stakes line), context budgeting (≤500-token JSON per subagent, 15× token-multiplier cost gate).
```

**Commit hand-off paragraph (paste into Claude Code to begin integration):**

```
You are integrating KB-05 Conversational Decision Engineering into the AI Workflow Engineering Kit.

INPUT: this research report (KB-05-RESEARCH.md).

DO:
1. Read this report end-to-end; pay special attention to §2 (catalog), §3 (council), §5 (router), §7 (verbatim quotes), §10 (integration path).
2. Cross-read KB-01 §5, §5.8, §6; KB-02 §3, §4, §4.8; CLAUDE-SURFACE-ROUTING.md in full.
3. Write knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md following the 30-section outline in §10. Total ≤3,500 words. Cite every load-bearing number with the verbatim quote from §7 and its source.
4. Create the 12 SKILL.md files at templates/skills/decision/<name>/SKILL.md using the KB-02 §3 format (YAML frontmatter with name + description-as-trigger, then sections: trigger / what-it-produces / before-writing-reads / numbered-procedure / output-format / anti-patterns / gotchas / when-NOT-to-use / references). Use the Procedure column from §2 verbatim as the numbered-procedure section.
5. For each SKILL.md declare the Anthropic surface (Chat / Cowork / Code) per CLAUDE-SURFACE-ROUTING.md. Default surface mapping: lightweight skills (disconfirming-evidence-first, 10-10-10, cost-of-inaction) → Chat; council-3-voice and anti-sycophancy-meta → Cowork; reversibility-check, pre-mortem, steelman → all three.
6. Add Phase 4.5 to generator/PROJECT_SETUP_PROMPT.md titled "Decision Engineering Skills" at the insertion point indicated in §10.
7. Edit CLAUDE.md to add a KB-05 reference and a "decision-skill priority" rule: anti-sycophancy-meta fires BEFORE content evaluation on any "what do you think of my X" question.
8. Edit README.md KB index to add KB-05.
9. Append the CHANGELOG line from §10 verbatim.
10. Commit in two commits: (a) "kb-05: add Conversational Decision Engineering knowledge base + 12 skill stubs"; (b) "kb-05: integrate router, CLAUDE.md, README.md, CHANGELOG, surface routing". Push.
11. STOP. Do not run the skills, do not modify KB-01/KB-02/CLAUDE-SURFACE-ROUTING content (only add cross-references).

DO NOT:
- Invent new techniques not in the catalog.
- Change verbatim quotes.
- Promote anything in the Uncertainty Log (§8) to a recommendation.
- Add a multi-agent council to user-facing flows by default — gate behind the decidable rule from §3.
```

---

## What I Don't Know (prompt-back to operator)

1. **SKILL.md format extension for council orchestration:** KB-02 §3 SKILL.md format does not document a `subagents:` field. Should KB-05 propose a format extension (`subagents:` array with `role + description + token_budget`), or wrap council orchestration inside a single SKILL.md whose body invokes the Claude Agent SDK programmatically? The cleaner kit-design answer is the extension, but it changes the KB-02 contract — confirm direction.
2. **Surface routing — new dimension or internal mechanism?** Should council patterns surface in CLAUDE-SURFACE-ROUTING.md as a new explicit routing dimension ("council-capable surface: Cowork only"), or stay internal to each Skill's implementation? Externalizing is more discoverable but makes the routing rubric heavier.
3. **Plan-tier assumption:** Kit user is Pro/Max — confirm before I default-recommend the 3-voice council, which burns ~15× tokens of a single chat call (Anthropic Research, Jun 13 2025).
4. **Domain coverage:** code / strategic / creative / financial all in scope per the brief — confirm none is intentionally out (my catalog assumes all four).
5. **Anti-sycophancy approach choice:** prompt-only (anti-sycophancy-meta Skill firing before content evaluation) is the kit-portable, lightweight default. RLAIF / DPO mitigations (Anthropic's approach for Claude 4.5; arXiv 2505.13995 DPO findings) are heavier and require model training the kit does not control. Confirm: prompt-only is the recommendation for the kit, with vendor-side improvements treated as "free wins" we benefit from when the user is on Claude 4.5+.