# KB-05 — Conversational Decision Engineering

> Codifying human pressure-testing techniques (pre-mortem, inversion, steelman, second-order, calibration, reversibility) as triggerable Skills running on Anthropic surfaces, composed with optional multi-agent councils when — and only when — task complexity crosses a decidable threshold.

---

## 0. Executive distillation

KB-01 covers techniques. KB-02 covers infrastructure. KB-03 covers data pipelines. KB-04 covers **project-scale** decisions — the kind that get locked in `DECISIONS.md` after multi-dossier research. **KB-05 covers what happens when a user asks the agent "is this a good idea?" in a single conversational turn** — the high-frequency, low-formality decision questions where most agentic systems silently fail.

The failure mode is sycophancy. Default LLM behavior on decision-shaped questions is to validate: "Great plan! Three considerations to keep in mind…" Stanford's *SycEval* measured this baseline at **58.19% of cases across frontier models** (Mar 2025). Cheng et al.'s *ELEPHANT* showed LLMs preserve user's face **45 percentage points more than humans** in advice queries (May 2025). Anthropic's own *Petri* pilot applied 14 frontier models to 111 seed instructions and elicited sycophancy + user-delusion encouragement across **every model tested** (Oct 2025).

Production agentic systems (Jan 2025 → May 2026) have converged on three building blocks that close this gap:

1. **Anti-sycophancy as a meta-skill** that fires *before* content evaluation on any "what do you think of my X" framing. Detects ownership signal, replaces validation framing with pressure-test framing, then routes to the technique-specific skill.
2. **Named decision techniques shipped as installable Skills** in the standard `SKILL.md` format. Pre-mortem, inversion, steelman, second-order, confidence-calibration, reversibility-check, and others are now installable artifacts on Anthropic's marketplace, LobeHub, awesomeskill.ai, and dedicated GitHub repos (neurofoo/agent-skills, Imbad0202/academic-research-skills, anthropics/skills).
3. **Multi-agent councils as a gated escalation**, never a default. Three-voice (Optimist / Pessimist / Synthesizer) with sparse communication topology and ≤500-token JSON per subagent. Cost gate: ~15× tokens of a single chat call per Anthropic's own engineering blog. Invoke only when a decidable threshold fires.

The kit ships KB-05 as **12 decision Skills + 1 anti-sycophancy meta-skill + 1 hybrid router + 1 council reference architecture**. The evidence base lives at `research/2026-05-26-decision-techniques.md` (14 verbatim quotes from primary sources, 8 uncertainty-log entries, full reproducibility).

This is **a different scale than KB-04**. KB-04 governs decisions that need 12 dossiers and a Phase 3 user-elicitation lock; KB-05 governs decisions that need a 30-second conversational pressure-test. Both apply the same underlying discipline: name the technique, follow the procedure, surface the disconfirmer, record the call.

---

## 1. Why this knowledge base exists

The most expensive class of mistake in an agentic workflow is the one you can't see — the call the agent said yes to that should have been no, where the user moved forward, the consequences accumulated, and by the time anyone noticed, the fix was a rewrite. This failure mode compounds. Each unchallenged "great idea!" trains the user to stop asking for pressure-testing because the agent never pushes back. After six months, the user is making consequential calls in an agent context that's been gradually optimized for validation, not truth.

Decision engineering at the project scale (KB-04) catches this for high-stakes locked decisions — but those go through architect prompts and DECISIONS.md ledgers, which is heavyweight machinery for the dozens of smaller calls a working session generates each day. The conversational scale is where most decisions actually live.

The cost of closing this gap is small. The dossier identified 12 well-evidenced techniques, all shippable as ≤200-line SKILL.md files. Each one takes a single conversational turn to fire. The router (phrase-mapping + LLM fallback) costs no extra tokens; it's prompt-engineering pattern-matching. The 15× token cost only fires when the council actually escalates, which is rare by design.

The cost of *not* closing this gap is invisible accumulation of un-pressure-tested calls.

---

## 2. Scope and non-goals

**In scope:**
- Single-turn or short-multi-turn decision questions: "is this a good idea?" / "should I do X?" / "what do you think of my plan?" / "go/no-go?"
- Decision techniques codified as installable Skills following the kit's existing format (KB-02 §3).
- Multi-agent councils as an *escalation*, gated by a decidable invocation rule.
- Anti-sycophancy patterns at the prompt-engineering layer.

**Out of scope:**
- Autonomous decision-making (agents making consequential calls without human-in-the-loop). KB-05 is for *pressure-testing* a human's call, not making the call.
- Project-scale strategic decisions that need multi-dossier research → those go through KB-04.
- Vendor-side RLAIF / DPO model training. KB-05 is the kit-portable, prompt-only layer. Vendor-side improvements (e.g., Anthropic's Claude 4.5 family showing 70-85% lower sycophancy than Opus 4.1) are *bonuses*; KB-05 doesn't depend on them.
- Generating decision options (brainstorming, 6-3-5 brainwriting, etc.). KB-05 pressure-tests options the user brings; it doesn't invent them.
- End-user-facing copy in any regulated language. Locked kit rule.

---

## 3. The 12-skill catalog

The kit ships 12 decision Skills under `templates/skills/decision/`. Each follows the standard kit `SKILL.md` format (frontmatter with `name` + `description-as-trigger`, then numbered procedure + output format + anti-patterns + references). Full per-skill specs in `research/2026-05-26-decision-techniques.md` §2 (the canonical catalog table).

| # | Skill | Severity | Confidence | When it fires |
|---|---|---|---|---|
| 1 | **pre-mortem** | 🚨 | 0.95 | "I'm about to launch X" / "is this plan solid" / "what could go wrong" |
| 2 | **inversion** | ⚠ | 0.85 | "is this a good idea?" / "should I do X?" / "convince me" |
| 3 | **10-10-10** | 🟡 | 0.65 | "how will this look later" / "am I being short-term?" |
| 4 | **second-order-thinking** | ⚠ | 0.70 | "what's the downstream effect" / "what does this enable" |
| 5 | **steelman** | 🚨 | 0.85 | "what do you think of my idea" / "argue against this" |
| 6 | **disconfirming-evidence-first** | ⚠ | 0.80 | "is my email good?" / "review this" |
| 7 | **confidence-calibration** | 🚨 | 0.90 | "how sure are you?" / "give me a probability" |
| 8 | **reversibility-check** | 🚨 | 0.85 | "should we commit to X" / "go/no-go" |
| 9 | **cost-of-inaction** | 🟡 | 0.55 | "should I wait" / "is now the right time" |
| 10 | **bayesian-update** | 🟡 | 0.55 | "new info changed my mind" / "should I revise?" |
| 11 | **council-3-voice** | 🚨 | 0.90 | "I'm stuck between options" (gated — see §6) |
| 12 | **anti-sycophancy-meta** | 🚨 | 0.95 | (auto-fires before content evaluation) |

Severity tags follow the kit's standard 🚨 BLOCKER / ⚠ HIGH / 🟡 MEDIUM / 🟢 LOW convention. Confidence is the dossier's numeric value (0.0–1.0) per primary-source evidence weight.

Six skills carry 🚨 BLOCKER severity — the irreducible core: pre-mortem, steelman, confidence-calibration, reversibility-check, council-3-voice, anti-sycophancy-meta. The Starter tier ships five of them; `council-3-voice` is BLOCKER-grade but gated to Advanced for cost (§6, §12.3). A kit can ship without 10-10-10 or bayesian-update (🟡, lighter evidence base) but cannot ship without the blocker core and still call itself decision-engineered.

The 🟡 skills (10-10-10, cost-of-inaction, bayesian-update) ship anyway because they cover signature use-cases the 🚨 skills don't (long-horizon framing, silent-status-quo cost, evidence revision). They get lower confidence ratings because they're less ubiquitous as shipped production Skills, not because the canon behind them is weaker — Suzy Welch's 10-10-10 is established; Tetlock's Bayesian-update is canonical. The dossier marks these as "gap signals" — opportunities for the kit to ship the first reference-quality production Skill.

---

## 4. Anti-sycophancy as a meta-skill

The first skill that fires on any decision-shaped question is `anti-sycophancy-meta`. It's a meta-skill in the strict sense: it doesn't itself produce the pressure-test, it detects when one is needed and routes to the right downstream skill.

### 4.1 Detection — ownership signal in user phrasing

The auto-fire triggers are phrases that signal user ownership of the artifact being evaluated:

- "what do you think of my X"
- "is my idea good"
- "review my plan"
- "is this a good idea?"
- "should I do X?"

When these patterns hit, the agent does *not* proceed to content evaluation. It re-frames:

> "I'm not evaluating — I'm pressure-testing."

Then routes to the appropriate downstream skill based on the artifact type (pre-mortem for plans, steelman for arguments, disconfirming-evidence-first for finished artifacts, etc.).

### 4.2 Why this fires first

Anthropic's *Protecting the well-being of users* (Dec 18 2025) defines sycophancy as: *"telling someone what they want to hear—making them feel good in the moment—rather than what's really true, or what they would really benefit from hearing. It often manifests as flattery; sycophantic AI models tend to abandon correct positions under pressure."*

If the agent evaluates first and pressure-tests second, the first response carries the sycophantic baseline (SycEval's 58.19% rate); the user reads it; subsequent pressure-testing arrives after the validation has already landed. The order matters.

Anti-sycophancy-meta inverts this: pressure-test framing arrives first, evaluation never happens at all (in the validation sense). The user gets the disconfirmer, not the affirmation.

### 4.3 When NOT to auto-fire

The meta-skill has an opt-out: emotional-support framings ("I'm feeling stuck about X" / "this is hard, just want to talk through it"). On these, anti-sycophancy-meta detects the emotional-support intent and *skips* — pressure-testing emotional vulnerability is the bad reading of the discipline.

The opt-out detection is itself a pattern-match (ownership signal absent, hedging language present, "feeling" / "stuck" / "frustrated" terms present). Conservative defaults: when in doubt, fire. The cost of a false-positive pressure-test on an emotional-support request is far smaller than the cost of a missed pressure-test on a real decision.

---

## 5. The hybrid skill router

The router decides which downstream skill fires after anti-sycophancy-meta clears. Hybrid architecture: phrase-mapping primary, LLM fallback for ambiguous calls.

### 5.1 Why hybrid

Pure phrase-mapping is what Anthropic's official Agent Skills system uses (`anthropics/skills/skill-creator/SKILL.md`):

> *"The description field in SKILL.md frontmatter is the primary mechanism that determines whether Claude invokes a skill … currently Claude has a tendency to 'undertrigger' skills — to not use them when they'd be useful. To combat this, please make the skill descriptions a little bit 'pushy'."*

Pure LLM-routing is the LangGraph supervisor pattern. CallSphere's production engineering note (Mar 2026):

> *"The supervisor pattern is roughly 3x the cost of a single mega-agent for an 18-point lift in success rate. Whether that is 'worth it' depends entirely on what the task is worth."*

Hybrid is what marketplaces already do implicitly: deterministic name+description match wins first, the underlying Claude model selects when there are multiple candidates.

### 5.1.1 The first-responder convention (description de-confliction)

"Pushy" descriptions have a failure mode the §5.1 guidance doesn't address on its own: when several skills all make their descriptions pushy on the *same* utterance, the router (which picks the argmax over `name` + `description` frontmatter only) sees a tie and mis-routes. A user who says "is my plan any good?" is claimed simultaneously by `anti-sycophancy-meta`, `steelman`, `pre-mortem`, `inversion`, and `disconfirming-evidence-first` if each catalog description reaches for the generic evaluation phrasing. The pushiness is correct per skill and wrong in aggregate — the argmax becomes a coin-flip and the meta-skill's own downstream routes leak into first-responder position.

The convention that resolves this is **first-responder ownership of the generic utterance**:

1. **`anti-sycophancy-meta` is the first responder.** It — and only it — claims the neutral ownership-evaluation utterance: the user brings their own idea, plan, or artifact and asks for a verdict in generic terms ("is it any good?", "give me your take", "thoughts on my plan?", "should I do this?"). On that signal the router routes to `anti-sycophancy-meta` *first*; it pre-empts its own downstream siblings, re-frames to pressure-test mode, then hands off internally by artifact type (§4.1).
2. **Downstream technique skills fire directly only on an explicit technique request or unmistakable frame-specific phrasing** — a named pre-mortem, a named steelman, an inversion-into-constraints request, a flaws-only teardown, an explicit "how could this fail?". These never claim the generic utterance; they claim their distinctive frame.
3. **Catalog descriptions must implement the convention in text.** The meta-skill's description carries an explicit *deferral clause* (it does not fire when the user names a technique or requests a specific frame); each sibling's description carries the reciprocal *cede clause* (generic ownership-evaluation asks belong to `anti-sycophancy-meta`; this skill owns only its frame-specific request). The convention lives in the descriptions because the descriptions are the routing surface — a convention documented only in KB prose but not in the frontmatter does not reach the router.

This is the design answer to the open question logged in `feedback/DISPOSITIONS-v0.18.0.md` (HD-2): the meta-skill and its siblings were claiming overlapping utterance space, so positive-space signals for `inversion` and `anti-sycophancy-meta` leaked to each other and to `pre-mortem`. Assigning first-responder ownership to the meta-skill and rewriting each sibling to claim only its distinctive frame removes the tie. The `SKILL.md` descriptions under `templates/skills/decision/` are the enforcement point; the phrase-mapping table in §5.2 encodes the same routing so the deterministic path agrees with the description-level convention.

### 5.2 The phrase-mapping table

Fourteen mappings cover the common decision-question shapes:

| User says… | Routes to |
|---|---|
| "is X a good idea" / "should I X" / "thoughts on my X" | `anti-sycophancy-meta` first, then route inside |
| "what could go wrong" / "before we launch" / "stress-test the plan" | `pre-mortem` |
| "should we commit" / "go/no-go" / "type-1 vs type-2" | `reversibility-check` (which then gates council vs single) |
| "argue against this" / "what's the counter-case" / "convince me I'm wrong" | `steelman` |
| "how confident are you" / "probability" / "what's the chance" | `confidence-calibration` |
| "downstream effects" / "knock-on consequences" / "second-order" | `second-order-thinking` |
| "10 minutes, 10 months, 10 years" / "long-term vs short-term" | `10-10-10` |
| "is now the right time" / "should I wait" / "cost of waiting" | `cost-of-inaction` |
| "I have new information" / "should I change my mind" / "update" | `bayesian-update` |
| "I'm stuck between A and B and C" / "give me multiple perspectives" | `council-3-voice` |
| "is this email good" / "is my tone right" / "quick review" | `anti-sycophancy-meta` first (generic ownership-evaluation ask per §5.1.1), routes to `disconfirming-evidence-first` for finished artifacts |
| "tell me only what's wrong" / "tear into it" / "find the holes" | `disconfirming-evidence-first` directly (explicit flaws-only frame; single-pass, NOT council) |
| "how would we guarantee this fails" / "turn the risks into requirements" / "flip it into constraints" | `inversion` directly (explicit flip-and-constrain frame) |
| (no match, decision-shaped question) | LLM fallback |

### 5.3 LLM fallback rule

If phrase-mapping returns ∅ AND the user message contains decision verbs (should/could/might/maybe/thinking-about) AND a question mark, ask the model to pick the single best skill from the catalog using only the YAML `description` fields. Do NOT fall through to council unless the reversibility-check classifies the question as Type-1.

### 5.4 Council vs single-skill threshold

A separate decidable rule fires *after* a skill is selected, only relevant when the selected skill is reversibility-check or when the user explicitly asks for multiple perspectives:

```
INVOKE COUNCIL IF
   (option_set_cardinality ≥ 3 AND options_mutually_exclusive) OR
   (reversibility_classifier == "Type-1") OR
   (estimated_impact > user_stated_stakes_threshold) OR
   (token_budget ≥ 5× single_pass AND user plan-tier supports it)
ELSE invoke single skill.
```

The threshold is decidable from the conversation alone — no agent judgment required. Type-1 vs Type-2 reversibility comes from Jeff Bezos's 1997 Amazon shareholder letter: one-way doors get a council; two-way doors get a single skill.

---

## 6. Council reference architecture

When the threshold from §5.4 fires, the `council-3-voice` skill takes over. Three subagents, sparse topology, ≤500-token JSON each, synthesis by an LLM-as-judge.

### 6.1 The 3-voice topology

```
User question
      │
      ▼
[Router: phrase-map fired OR LLM fallback]
      │
      ▼
[Reversibility classifier] ── Type-2 ── single skill
      │
      Type-1 / ≥3 options / impact > stakes
      │
      ▼
[Coordinator agent]
      │
      ├──── spawn Optimist subagent  (≤500-token JSON)
      ├──── spawn Pessimist subagent (≤500-token JSON, runs pre-mortem)
      ├──── spawn Synthesizer subagent (reads both, forced verdict)
      │
      ▼
[Coordinator emits verdict + minority dissent]
```

Sparse topology rationale from Li, Du, Zhang, Hou, Grabowski, Li & Ie (Google), *Improving Multi-Agent Debate with Sparse Communication Topology*, arXiv 2406.11776:

> *"multi-agent debates leveraging sparse communication topology can achieve comparable or superior performance while significantly reducing computational costs."*

Three subagents at full connectivity is dense (each sees all others); three subagents at sparse connectivity (each sees only the inputs they need) is the kit's default.

### 6.2 Agent roles

**Optimist.** Argues max-upside. Must name one disconfirmer it can't dismiss.
**Pessimist.** Runs the pre-mortem template (assumes plan failed in 6 months, produces 5 ranked failure narratives).
**Synthesizer.** Reads both. Produces verdict + confidence + named dissent (the strongest unaddressed Pessimist point).

### 6.3 Synthesis mechanism

LLM-as-judge by the Synthesizer agent — *not* majority vote (with three agents, one of which is contrarian by design, majority is meaningless). LLM-as-judge has known calibration issues; arXiv 2512.22245 *Calibrating LLM Judges*:

> *"LLM judges are known to be overconfident, systematically expressing higher confidence than their empirical accuracy supports."*

Mitigation: the Synthesizer is *required* to surface dissent rather than suppress it. The output format includes a mandatory "Dissent" field with the Pessimist's strongest unaddressed point — if the Synthesizer can't fill it, the council has failed and should be re-run.

### 6.4 Context budgeting

Each subagent ≤500 tokens of structured JSON output. Coordinator total ≈ system prompt + user query + 3×500 tokens + synthesis instruction ≈ 4K tokens — within Sonnet's typical operating envelope and ~1/10th of a naive fan-out.

### 6.5 Cost gate

From Anthropic Engineering, *How we built our multi-agent research system*, Jun 13 2025:

> *"agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats."*

Implications:

- On Pro tier (5 routine runs/day budget), council invocations should be rare. Default-recommend single-skill routes.
- On Max+ tier (15-25 runs/day), council is comfortable. Default-recommend gated invocation per §5.4.
- On API direct (no per-day budget), gate purely by stakes — token cost is real money but no rate-limit cap.

### 6.6 When NOT to invoke

The 15× cost makes false-positive council invocations expensive. Hard rules:

- Never invoke for tone checks, single-fact lookups, or code reviews of <50-line diffs.
- Never invoke for emotional-support replies.
- Never invoke when the cost of being wrong is less than the cost of 15× tokens.
- Never invoke as a default escalation for "I don't know" — Claude saying "I don't know" with disconfirming-evidence-first is cheaper and often better.

---

## 7. Anti-sycophancy patterns

Four patterns the kit ships, from the dossier's §4. Each addresses a different layer (prompt structure, sub-agent injection, vendor-side training, prompt rewriting).

### 7.1 Pattern 1 — Frame-reversal (pre-mortem as anti-sycophancy)

*Source:* Klein, *Performing a Project Premortem*, HBR 85(9), Sep 2007. Kahneman attributed it as *"my single most valuable decision technique"* in *Thinking, Fast and Slow* (2011).

**Mechanism:** prompt-only — replace "is this a good plan?" with "the plan failed in 6 months; explain how."

Sycophantic baseline output: *"Great plan! Three considerations to keep in mind…"*
Anti-sycophantic output: *"Most likely cause of failure: [X]. Most dangerous failure: [Y]. Cheapest to prevent now: [Z]."*

Trade-off: on legitimate-affirmation tasks (emotional support, validated idea worth shipping), this reads as cold. The anti-sycophancy-meta skill detects emotional-support intent first to prevent miscalibration.

### 7.2 Pattern 2 — Constitutional system-prompt clause + Concession-Threshold Protocol

*Source:* Anthropic's Constitutional AI; Imbad0202/academic-research-skills v3.3.2+ ships this verbatim on GitHub:

> *"DA must now score every rebuttal on a 1-5 scale before responding. Concession only allowed at score ≥4 (rebuttal directly addresses core attack with evidence). Score ≤3: hold position and restate the original attack."*

**Mechanism:** sub-agent injection with rule-based hold-position behavior. Concession requires evidence-based rebuttals; pushback alone is not enough to flip a position.

Sycophantic baseline: user pushes back → model retracts within one turn.
Anti-sycophantic: *"Your rebuttal scored 2/5 against my core attack. I'm holding position and restating: [original attack]."*

Trade-off: can read combative on benign clarifications; the explicit numeric scoring makes the discipline auditable.

### 7.3 Pattern 3 — Vendor-trained mitigation (Claude 4.5 family)

*Source:* Anthropic, *Protecting the well-being of users*, Dec 18 2025.

> *"Claude Opus 4.5, Sonnet 4.5, and Haiku 4.5 each scored 70-85% lower than Opus 4.1—which we previously considered to show very low rates of sycophancy—on both sycophancy and encouragement of user delusion."*

**Mechanism:** RLAIF + constitutional rule + targeted training. Anthropic does not disclose ratios.

The same post discloses a residual gap on prefill stress-tests:

> *"Our current models course-corrected appropriately 10% (Opus 4.5), 16.5% (Sonnet 4.5) and 37% (Haiku 4.5) of the time. On face value, this evaluation shows there is significant room for improvement for all of our models."*

KB-05's stance: vendor-side mitigations are bonuses, not foundations. The kit's prompt-only anti-sycophancy-meta skill works regardless of which Claude version is running. When the user is on Claude 4.5+, they get vendor + kit working together. When they're on older models or other vendors, they get the kit alone — still useful.

### 7.4 Pattern 4 — Perspective-shift prompting (ELEPHANT)

*Source:* Cheng et al., *ELEPHANT* arXiv 2505.13995 (May 2025):

> *"LLMs preserve user's face 45 percentage points more than humans in general advice queries and in queries describing clear user wrongdoing."*

On mitigation, the same paper finds simple "instruction prepending" (e.g., "be less validating") *"led to negative scores across the board since the model responses simply eliminated all face preservation, even when affirmation is appropriate."*

**Mechanism:** rewrite-to-third-person prompt OR DPO model-based steering. Lighter mechanism: have the agent restate the user's question as if it came from a third party, then evaluate that restated version. Heavier mechanism: DPO training (vendor-side; kit doesn't control).

The kit ships the prompt-only version inside `anti-sycophancy-meta` and `steelman`. The heavier DPO version is documented as a vendor-side optimization the user can pursue separately.

---

## 8. Domain adaptation

For any technique, three parameters change across domains while the procedure shape stays invariant.

| Domain | Evidence sources | Severity threshold | Output structure | Time budget |
|---|---|---|---|---|
| Code review | repo diff, ADRs, perf benchmarks | regression >10% latency, breaking API | inline-comment markdown | 2 min single skill |
| API design | RFC, spec, SLA | breaking change without versioning | design-doc table | 10 min, optional steelman |
| Medical decision | guideline corpus, base rates | irreversibility + patient harm | clinical-note format + uncertainty band | 30+ min, calibration mandatory |
| Legal opinion | case law, statute, contract | binding commit; SoL risk | memo with citations | 60+ min, council recommended |
| Financial trade | market data, position sizing | impact > stakes; leverage | P/L scenarios + Kelly fraction | 5–30 min, calibration mandatory |
| Creative critique | drafts, brand guide | brand inconsistency; reader confusion | track-changes + voice notes | 5 min, disconfirming-evidence-first |
| Strategic call | TAM, comps, BU plans | Type-1 commit > 6 mo rollback | exec memo + dissent | 60+ min, council mandatory |

Invariants across all domains: **procedure shape** (numbered steps), **anti-patterns** (sycophancy, false precision, generic doom), and **success criterion** (named disconfirmer + named dissenting view).

The domain adaptation pattern means a project doesn't need 7 different pre-mortem skills (one per domain). It needs one `pre-mortem/SKILL.md` plus a per-project rule file that specifies the domain's evidence sources, severity threshold, output structure, and time budget. The skill's procedure is invariant.

---

## 9. Domain scenario walk-throughs

The five domain scenarios from the dossier brief, with the router's output for each:

**§1 — "Replace REST with GraphQL — good idea?"**
Router fires `anti-sycophancy-meta` (ownership signal detected). Reversibility-check returns Type-2 (architectural-layer change, versioned endpoints make rollback cheap). Single-skill flow: `inversion` + `cost-of-inaction`. Council overkill.

**§2 — "Should we expand to a new market?"**
Reversibility-check returns Type-1 (sunk-cost commitments to legal entities, hiring, brand recognition; rollback is high). `council-3-voice` fires. Pessimist runs pre-mortem; Optimist names disconfirmer; Synthesizer outputs verdict + dissent + 10-10-10 horizon flip.

**§3 — "Is this email tone good?"**
Quick `disconfirming-evidence-first`. Explicitly NOT a council — wrong tool, wrong cost. Router rule "tone checks are never councils" fires.

**§4 — "My idea for X — what do you think?"**
`anti-sycophancy-meta` fires BEFORE content evaluation. Re-frames as pressure-test, routes to `steelman` or `pre-mortem` depending on artifact type.

**§5 — Threshold rule decidability test:**
`council IF (≥3 mutually-exclusive options) OR (Type-1) OR (impact > stakes)`. Decidable for every scenario above. No agent judgment required at threshold check.

If any decision-shaped question fails to produce a clear skill-selection answer through the router, the router itself is incomplete and needs an additional phrase mapping. The catalog is the implementation; the scenarios are the regression tests.

---

## 10. Failure modes

Eight failure modes from the dossier's §6, each with a documented mitigation.

| Failure mode | Trigger | Mitigation |
|---|---|---|
| Contrarianism cascade (inversion → reflexive negation) | inversion fires on benign affirmation | route via `anti-sycophancy-meta`; emotional-support detector blocks |
| Pre-mortem → motivated reasoning toward worst case | user emotionally attached to plan failing | two-pass "verify before flagging" (per `parcadei-continuous-claude-v3-premortem`) |
| Multi-agent echo chamber | all 3 council voices share base model + prior | sparse topology (arXiv 2406.11776); consider model heterogeneity (arXiv 2502.08788: *"model heterogeneity can significantly improve MAD frameworks"*) |
| Synthesis hallucination | Synthesizer fabricates a "compromise" not in either input | require verbatim quotes from subagent JSONs |
| Confidence calibration → false precision | model outputs P=0.873 on vibes | force reference-class + 80% CI; flag if CI is degenerate |
| Devil's advocate → bad-faith argument shape | DA concedes on first pushback | Concession-Threshold Protocol (score rebuttals 1-5, hold ≤3) |
| Token-budget blowup | naive fan-out without compression | hierarchical pair-merge synthesis; ≤500-token JSON cap |
| Long-loop iteration cost runaway | supervisor decides researcher's work insufficient repeatedly | `recursion_limit` + `max_rpm` + `max_iter`; circuit breaker on cost |

These failure modes appear in production deployments; they aren't hypothetical. The BuildMVPFast postmortem (referenced in the dossier) documents a single user request burning $180 in API costs across 47 iterations before a circuit breaker fired.

---

## 11. Surface routing per skill

Each skill declares its supported Anthropic surfaces in its `SKILL.md` frontmatter. Defaults per skill class:

| Skill class | Default surface(s) | Why |
|---|---|---|
| Lightweight single-turn (10-10-10, cost-of-inaction, disconfirming-evidence-first, bayesian-update) | **Chat** | One-prompt-one-response; no filesystem or tool fan-out needed |
| Mid-weight skills (inversion, second-order-thinking, steelman, pre-mortem, confidence-calibration, reversibility-check) | **Chat or Code** | May benefit from Code's repo-aware context for technical decisions, but Chat is sufficient for non-repo questions |
| Heavy skills (council-3-voice, anti-sycophancy-meta with full re-routing) | **Cowork or Code** | Multi-agent fan-out via Task tool requires either Cowork (browser/sub-agent support) or Code (native Task tool); not Chat |

This composes with `knowledge-base/CLAUDE-SURFACE-ROUTING.md`. Each SKILL.md frontmatter has a `surface:` field listing the supported surfaces. The router consults this when selecting which skill to fire; if the current surface doesn't support the right skill, the router proposes a surface handoff (`prompts/code-handoff-prompts.md` / `prompts/cowork-browser-operations.md`).

No new surface-routing dimension is introduced; council orchestration is internal to the `council-3-voice` skill, not surfaced as a top-level rubric concern.

---

## 12. Maturity gradient

Not every project needs all 12 skills. Three tiers; graduate when the warning signs from KB-04 §8 appear (decisions accumulating un-pressure-tested, repeated bad calls, drift toward sycophancy in agent outputs).

### 12.1 Starter

Ship the 5 BLOCKER skills: `anti-sycophancy-meta`, `pre-mortem`, `steelman`, `confidence-calibration`, `reversibility-check`. Skip the council (Pro-tier-friendly). The router is the phrase-mapping table from §5.2; no LLM fallback yet.

### 12.2 Intermediate

Add the 3 HIGH skills (`inversion`, `second-order-thinking`, `disconfirming-evidence-first`) and enable the LLM fallback. Most projects ship Intermediate.

### 12.3 Advanced

Add the 4 remaining skills (`10-10-10`, `cost-of-inaction`, `bayesian-update`, `council-3-voice`). Enable the council invocation rule. Configure per-skill surface declarations. Wire the cost gate into the project's CLAUDE.md so the agent default-warns the user when a council invocation is about to fire.

Advanced is also where the project may want to ship its own *project-specific* decision skills layered on top — e.g., a `regulatory-compliance-check/SKILL.md` for a project with regulatory exposure (uses confidence-calibration + reversibility-check internally, but specializes the evidence sources and severity thresholds).

---

## 13. Anti-patterns

Eight patterns to avoid; each has been observed in production.

1. **Skip `anti-sycophancy-meta`, evaluate first.** Lets the sycophantic baseline land before the pressure-test. Order matters.
2. **Default-recommend council on Pro tier.** 15× tokens × Pro tier's 5 routine runs/day is unsustainable. Gate behind the decidable rule.
3. **Use council for tone checks or single-fact lookups.** Wrong tool, wrong cost. Hard rules in §6.6.
4. **Treat severity tags as decorative.** 🚨 BLOCKER skills are irreducible. If the kit ships without them, the discipline is a façade.
5. **Build a project-specific decision skill without using the kit's `SKILL.md` format.** Breaks composability. Use the format; specialize the evidence sources and thresholds inside.
6. **Ship the council without the cost gate documented in CLAUDE.md.** User runs the council 50× in a week, hits rate limit, blames the kit. The cost gate is operator-visible discipline.
7. **Promote any uncertainty-log entry from the dossier to a recommendation.** The 8 entries in `research/2026-05-26-decision-techniques.md` §8 are flagged BECAUSE they're not solid enough to recommend on. Re-verify before promoting.
8. **Modify verbatim quotes.** The 14 quotes in the dossier are exact attributions. Paraphrasing them defeats the citation chain. If a quote needs context, add the context around it; don't edit the quote.

---

## 14. Composition with the rest of the kit

KB-05 is designed to compose with — not contradict — the existing kit. Composition points:

**KB-01 §5 (Prompt Engineering).** Decision skills ARE prompt-engineered artifacts. The 12 skills in KB-05 are concrete instances of the patterns KB-01 teaches abstractly. KB-05 does not introduce new prompt-engineering primitives; it specializes existing ones to decision-shaped questions.

**KB-01 §5.8 (Dynamic System Prompt Construction).** Anti-sycophancy-meta is implemented at the system-prompt level (it fires before content evaluation, which means it's part of the static + dynamic prompt scaffold). Surface assignment per skill influences which prompt sections load.

**KB-01 §6 (Hallucination Reduction).** Calibration and disconfirming-evidence-first directly reduce confident-wrong outputs (the dominant hallucination failure mode in decision contexts).

**KB-02 §3 (Skills Systems).** All 12 KB-05 skills use the standard `SKILL.md` format from KB-02 §3. No format extension is required for v1; council orchestration is wrapped inside `council-3-voice/SKILL.md` body via Claude Agent SDK / Task tool invocation. The kit's existing SKILL.md contract is preserved.

**KB-02 §4 (Agent Architecture).** The council pattern uses subagent fan-out per KB-02 §4.9. KB-05 specializes the pattern to the 3-voice topology with sparse communication and ≤500-token JSON per subagent.

**KB-04 (Decision Engineering — sibling).** KB-04 governs project-scale decisions that get locked in DECISIONS.md after multi-dossier research. KB-05 governs conversational-scale decisions that pressure-test in a single turn. Both apply the same underlying discipline. A consequential conversational decision *may* escalate to a KB-04 architect prompt for project-scale lock; the council-3-voice's verdict can include "this needs a DECISIONS.md entry — dispatch architect prompt." The two KBs are explicitly aware of each other.

**CLAUDE-SURFACE-ROUTING.md.** Each skill's `surface:` field declares which Anthropic surface supports it. The router consults the field when selecting a skill; mismatched surfaces trigger handoff prompts (`prompts/code-handoff-prompts.md` etc.).

**Generator (`generator/PROJECT_SETUP_PROMPT.md`).** A new Phase 4.5 ("Decision Engineering Skills") instructs the generator to install the 5 BLOCKER skills by default + offer the Intermediate / Advanced tiers based on detected project maturity.

---

## 15. What this KB does NOT cover

- **Autonomous decision-making.** KB-05 pressure-tests a human's call. It does not make calls for the human. Agents that need autonomous decision authority belong in a different framework (operator-approved checkpoints, human-in-loop with veto rights, etc.).
- **Project-scale strategic locks.** Multi-dossier research + DECISIONS.md entries + architect prompts — see KB-04.
- **Decision-option generation.** Brainstorming, 6-3-5 brainwriting, divergent ideation — out of scope. KB-05 takes options the user brings.
- **Vendor-side RLAIF / DPO model training.** Anthropic ships this for Claude 4.5+; the kit benefits but does not contribute to it. Prompt-only is the kit's lane.
- **Real-time benchmarking of decision quality.** Brier / ECE / Tetlock-style outcome tracking is documented as the right approach but not shipped as kit infrastructure. A project that needs it can implement on top of the calibration skill.
- **Domain-specific decision frameworks.** Medical / legal / financial each have specialized canons. KB-05's domain adaptation pattern (§8) gives the structure for specializing; the specializations themselves are project-owned.

---

## 16. Re-verification schedule

The decision-engineering landscape moves fast. Re-verify the kit's KB-05 evidence base at this cadence:

- **Quarterly default (next: 2026-09-01)** — re-verify Anthropic sycophancy numbers; Claude Agent SDK subagent spec; LangGraph supervisor API surface; AutoGen → Microsoft Agent Framework migration status; CrewAI hierarchical-process docs version.
- **Event-triggered:**
  - New Anthropic system card (Opus 4.6+) → re-verify sycophancy claims.
  - LangGraph 2.x release → re-verify supervisor/swarm code samples.
  - SycEval / ELEPHANT v3+ → update baseline numbers.
  - Anthropic Skills marketplace launch → re-baseline adoption-signal column for the 12 skills.
  - Microsoft Agent Framework GA → migrate AutoGen citations.
- **Monitoring list:** `anthropic.com/engineering` RSS, `alignment.anthropic.com` posts, arXiv cs.CL daily filter on "sycophancy" / "multi-agent debate" / "LLM judge calibration", LangChain/LangGraph release notes, CrewAI changelog, `lobehub.com/skills` new-listing feed, `anthropics/skills` GitHub commits.

The vigilance discipline (`workflows/KIT-VIGILANCE.md`) catches most of these via the standing watchlist. The KB-05-specific re-verifications are flagged in the watchlist's Anthropic-specific category.

---

## 17. Common questions

**Do I need all 12 skills?**
No. Start with the 5 BLOCKER skills (Starter tier in §12.1). Add the HIGH skills when you find yourself wishing for inversion or second-order-thinking. Add the MEDIUM skills (10-10-10, cost-of-inaction, bayesian-update) when the project's decision cadence justifies the full toolbox.

**How does this differ from KB-04?**
KB-04 is project-scale (multi-dossier research + DECISIONS.md locks + architect prompts). KB-05 is conversational-scale (single-turn pressure-tests). Both apply the same underlying discipline. A consequential conversational pressure-test may escalate to a KB-04 architect prompt; the bridge is the council-3-voice skill's optional "this needs a DECISIONS.md entry" verdict.

**Can I ship KB-05 skills as a separate package outside the kit?**
Yes. Each `SKILL.md` follows the kit's KB-02 §3 format, which is also the Anthropic Agent Skills standard. The 12 skills are portable. The router, the council architecture, and the maturity gradient are kit-specific composition layers.

**What if my Claude version doesn't have RLAIF anti-sycophancy training?**
The kit's anti-sycophancy-meta skill works at the prompt-engineering layer, not the model layer. It works regardless of Claude version. Older models will be more sycophantic in the baseline; the meta-skill closes more of the gap on them than on Claude 4.5+.

**What if the user pushes back on the council verdict?**
The Synthesizer's mandatory "Dissent" field is the answer. If the user disagrees with the verdict, they can engage the dissent directly — that's the strongest unaddressed Pessimist point, already surfaced. Pushback that doesn't engage the dissent is the user's signal that they want validation, not pressure-testing. Anti-sycophancy-meta should fire again on the pushback.

**How much does the council actually cost?**
Per Anthropic Engineering: ~15× tokens of a single chat call. If a chat call costs $0.05, the council costs ~$0.75. Below the stakes line for most decisions. Above the stakes line for the kit's discipline (the cost gate is in §6.5).

---

## 18. Cross-references

- **Research dossier (evidence base):** `research/2026-05-26-decision-techniques.md` — 14 verbatim quotes, 8 uncertainty entries, full procedural detail per skill.
- **Skills (12 stubs):** `templates/skills/decision/<name>/SKILL.md` — one per skill in the catalog.
- **Sibling discipline:** `knowledge-base/KB-04-DECISION-ENGINEERING.md` — project-scale decisions.
- **Foundational layers:**
  - `knowledge-base/KB-01-AI-WORKFLOW-ENGINEERING.md` §5, §5.8, §6 — prompt engineering, dynamic prompt construction, hallucination reduction.
  - `knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §3, §4 — skills systems, agent architecture.
- **Surface routing:** `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — per-skill surface declarations.
- **Vigilance integration:** `workflows/KIT-VIGILANCE.md` — re-verification cadence is monitored as part of the standing vigilance discipline.
- **Mission spec (closed):** `prompts/dispatch/DECISION_TECHNIQUES_RESEARCH_2026.md` — the research dispatch that produced this KB.
- **Generator integration:** `generator/PROJECT_SETUP_PROMPT.md` Phase 4.5 — installation hooks for project setup.

The dossier at `research/2026-05-26-decision-techniques.md` is the kit's canonical evidence base for this KB. Every claim with a verbatim quote in §7 of the dossier is load-bearing; treat them as the citation chain. If a future re-verification produces conflicting evidence, update the dossier first, then the KB.
