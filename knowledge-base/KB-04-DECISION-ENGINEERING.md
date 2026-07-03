# KB-04 — Decision Engineering

> How to structure, defend, lock, and reverse decisions across long agentic loops. The discipline that prevents an agentic project from drifting into contradictions, re-debates, and silent rewrites.

---

## 0. Executive distillation

KB-01 covers context engineering. KB-02 covers project infrastructure. KB-03 covers data-pipeline architecture. **KB-04 covers what those agents have to do when the project's success depends on a non-obvious call** — pick a library, settle a legal posture, lock a launch sequence, commit to a market.

The discipline rests on four pillars, each independently useful, all four reinforcing each other:

1. **Decision-Lock Discipline** — one canonical project ledger (`DECISIONS.md`) where every consequential call lands as a numbered entry with TL;DR, master synthesis, full body, reversal triggers, and re-verification cadence. Agents read it before proposing changes; they never silently re-debate.
2. **The 3-Layer Research Architecture** — separate per-dossier input quality (Layer 1, the 8-gate filter), cross-dossier analytical lenses (Layer 2, the 8 protocols), and forward decision construction (Layer 3, the ranked-matrix-and-roadmap deliverable). Each layer does one thing; together they produce decisions that survive external review.
3. **Orchestrator Dispatch Mechanics** — when a decision needs N research dossiers and a synthesis pass, the orchestrator routes per surface, sequences waves by dependency DAG, refreshes RAG between waves, and forces the right model on the right step. Without this, parallel-everything dispatch collapses under context-budget reality.
4. **The 14-Section Architect Prompt** — the format a downstream implementation prompt takes once a decision is locked. Identity / mission / ground rules / knowledge manifest / severity-tagged research questions / 8-gate framework / domain scenarios / deliverable / quote library / cross-reference index / uncertainty log / "what I don't know" / out-of-scope / success criteria. Hard ceilings on every section.

This KB is targeted at agentic-system designers, prompt engineers, and repo maintainers who have outgrown one-shot "write the code" prompts and need their agents to make defensible calls that other humans (counsel, partners, auditors, future selves) can re-derive.

A worked instance of every pattern in this KB lives at the private lab's worked instance (not shipped) (a production e-commerce project that ran the full discipline through 12 research dossiers, 13 locked DECISIONS entries, and 9 orchestrator-dispatched implementation tracks).

---

## 1. Why decision engineering matters

Default LLM behavior is to validate. Ask an agent "is this a good idea?" and most will say yes, then list reasons that confirm your prior. This is not malice; it is the shape of next-token prediction trained on a corpus where helpful = agreeable. The same dynamic plays out in multi-agent projects: agents inherit each other's framings, contradictions go unresolved because no agent has the standing to challenge a sibling's output, and decisions land by accretion — whoever wrote the most prose wins.

**The cost of this failure mode is invisible at small scale and catastrophic at large.** A single weak decision costs a refactor. A weak decision chain over six months costs a rewrite. A locked decision that everyone has internalized and the orchestrator is enforcing but that was wrong from the start costs the project.

Decision engineering closes the gap with three complementary mechanisms.

**Locks** — once a call is made, it goes into a canonical ledger with the evidence that supported it, the reversal triggers that would unwind it, and the re-verification schedule that catches when the evidence base has moved. Agents read the ledger before proposing alternatives. New evidence triggers an explicit reversal entry, never a silent rewrite.

**Layered research** — input quality (Layer 1) is enforced per dossier before any synthesis happens. Cross-dossier analytical lenses (Layer 2) surface contradictions and concept lineage *before* the constructive synthesis (Layer 3) builds a recommendation. The constructive step inherits the analytical step's outputs; it does not redo them.

**Surface-aware dispatch** — research happens on the surface that has the citation renderer (Chat Research). Synthesis happens on the surface that has the context window (Code, 1M context). Audits happen on the surface that has dashboard access (Cowork). Routing is decided up front, not improvised mid-loop.

The compounding effect: by the time a project has shipped six or seven decisions through this discipline, the kit of locked entries + dossiers + architect prompts becomes the project's authoritative documentation. New agents ramp in hours, not weeks. External counsel can audit the chain without a synchronous meeting. Reversal triggers fire automatically when a quarterly re-verify surfaces stale evidence.

---

## 2. Pillar 1 — Decision-Lock Discipline (`DECISIONS.md`)

The canonical project ledger of locked architectural and strategic calls. One file per project, root-level, version-controlled.

### 2.1 Why a single ledger

Agents need exactly one place to look. If decisions live in commit messages, Notion docs, Slack threads, and a half-remembered design review, no agent can reliably read them. A ledger consolidates them with a stable numbering scheme that the rest of the project (commit messages, architect prompts, code comments, rule files) can reference unambiguously.

The ledger is *not* a changelog. Changelogs record what was built. The ledger records *what was decided and why*. They serve different audiences and answer different questions.

### 2.2 Entry anatomy

Every entry follows a fixed structure. The structure is opinionated — it deliberately constrains how decisions get documented so that all entries are diffable, scannable, and externally auditable.

```markdown
## Implementation #N — {Title} ({Date YYYY-MM-DD})

### TL;DR (smart non-expert audience, 3 numbered points)

1. **What has been proven** — ≤3 sentences. The evidence-backed claim that justifies the lock.
2. **What is still unknown** — ≤3 sentences. The dominant residual uncertainty.
3. **Why it matters** — ≤3 sentences. Why this is in the ledger, not a commit message.

### Master Synthesis (≤400 words, 4 sections)

**Established Consensus (~100w):** The claims that cross-dossier analysis confirmed.
**Active Debates (~100w):** Where evidence is split or evolving.
**Strongest Evidence (~100w):** The 2-3 verbatim quotes or studies that carry the most weight.
**Key Open Question (~80w):** The single question whose answer would most change the recommendation.

### Full Decision Body

The dense lock structure. Free-form but typically includes:
- The chosen path (what was picked)
- Why this path vs the alternatives (ranked matrix or comparison table)
- Sensitivity to assumption changes (4 weight regimes is a useful default)
- Staged roadmap (when this decision activates which actions)
- Costs at launch + 10× scale
- Required external validation (legal, counsel, vendor confirmation)

### Reversal Triggers

Per stage of the staged roadmap, the conditions that would unwind the lock. Each trigger is decidable (you can tell from observable facts whether it has fired), ranked by severity, and points to a specific alternative path.

### Re-Verification Schedule

| Cadence | Items |
|---|---|
| Quarterly | Items whose evidence base evolves on a 90-day cycle |
| Semiannual | Items whose evidence base evolves on a 180-day cycle |
| Annual | Stable evidence, just spot-check |
| Event-triggered | Specific external events that force a re-look |

### Cross-DECISIONS Reconciliation

For each prior numbered entry that this entry interacts with: "preserves Implementation #M (one-sentence reason)" or "supersedes Implementation #M (one-sentence reason)". No silent overrides.
```

The TL;DR and Master Synthesis are 2026-canonical additions; earlier entries can use a more abbreviated structure as long as they include reversal triggers and re-verification at minimum. New entries inherit the full template.

### 2.3 Numbering protocol

```bash
grep -c "^## Implementation #" DECISIONS.md
```

Add 1; that is the next free number. Verify against any reservation comments in recent commits (`git log --since='2 weeks ago' --grep='reserve'`) — orchestrators sometimes reserve a number before the synthesis is complete.

**Conflict resolution.** If two orchestrators race for the same number, escalate to the human user via an explicit question. Do *not* silently mutate numbering. Re-numbering a locked entry breaks every architect prompt, rule file, and commit message that references it.

### 2.4 When to lock

A decision goes into the ledger when *all* of these are true:

- The choice is non-obvious — an unfamiliar agent might reasonably reach a different conclusion.
- The choice has cross-cutting impact — it affects more than one file, surface, or future task.
- The evidence base is mature enough to defend the choice for at least 90 days.
- A reversal trigger can be written that is decidable from observable facts.

If any of these are false, leave the decision in commit messages, code comments, or a planning doc. Premature locking creates ledger entries that get re-debated, which defeats the purpose.

### 2.5 When and how to reverse

A locked decision is reversed by adding a *new* entry, not by editing the original. The new entry's "Cross-DECISIONS Reconciliation" section explicitly says "supersedes Implementation #N (reason: trigger T fired on date D, evidence shifted to X)". The original entry stays in the ledger as historical record.

A reversal is not a sign of weak decision-making; it is the discipline working. The reversal trigger fired because the evidence base moved, the team caught it via re-verification, and the new entry documents the shift. External auditors can re-derive the chain.

### 2.6 Anti-patterns

- **Silent rewrite.** Editing a locked entry in place. Breaks every downstream reference; obliterates the audit trail.
- **Premature lock.** Locking a call before the evidence base supports a 90-day commitment. Generates entries that need re-debate, which trains the team to ignore the ledger.
- **Lock without reversal triggers.** The entry says what was picked but not under what conditions it would unwind. Re-verification becomes guesswork.
- **Lock without numeric confidence on the framework overall.** "We're pretty sure" is not a confidence interval. The Master Synthesis needs a numeric anchor (typical: 0.0-1.0 on the framework as a whole; per-claim confidences in Layer 1 disciplines).
- **Ledger as changelog.** Recording what was built, not what was decided. The two are not the same.
- **Decision in commit message only.** Future agents will not find it. If it is consequential enough to land in the ledger, write the entry.

---

## 3. Pillar 2 — The 3-Layer Research Architecture

Decisions backed by research are only as strong as the research backing them. The 3-layer architecture separates three distinct epistemic concerns that get conflated in single-pass synthesis: input quality, cross-input analysis, and forward construction.

| Layer | Stance | When | Output |
|---|---|---|---|
| **Layer 1** | Per-dossier input quality | Every research-prompt write-time | 8-gate-verified dossier |
| **Layer 2** | Cross-dossier analytical lenses | Synthesis time, *before* construction | 8 protocol outputs (analytical) |
| **Layer 3** | Forward decision construction | Synthesis time, *after* analysis | Ranked-matrix-and-roadmap deliverable |

**Critical insight.** Layer 2 (analytical / post-hoc) feeds Layer 3 (constructive / forward). Neither replaces the other. The common failure mode is to skip Layer 2 — the synthesizer goes straight from a stack of dossiers to a recommendation, missing cross-dossier contradictions that would have changed the ranking. The reverse failure (Layer 2 without Layer 3) is rarer but equally bad: you get a beautiful analytical report that does not actually make a call.

### 3.1 Layer 1 — The 8-Gate Input Filter

Every research dossier passes 8 gates before it is allowed to feed Layer 2 or any locked DECISIONS entry.

1. **Source gate** — every claim cites a primary source, not paraphrased commentary. Vendor docs, published papers, official release notes, government registries. Section + line range for long sources.
2. **Version gate** — every cited library, SaaS, framework, regulation includes its version + effective date. Pre-{current-year} sources require explicit re-verification ("still current as of {date}").
3. **Stack fit gate** — every recommendation is implementable in the project's actual stack (not "in general"). A library that does not exist in the project's package manager is not a recommendation; it is research-only.
4. **Cost-benefit gate** — every cost claim includes both horizons: at launch and at 10× scale. Hidden costs (audit fees, compliance overhead, monitoring subscriptions) surfaced explicitly.
5. **Implementation gate** — every technique is implementable as a concrete artifact (skill, rule, code snippet, prompt template). Abstract advice ("apply best practice") fails this gate.
6. **Cross-reference gate** — every load-bearing claim is corroborated by ≥2 sources OR explicitly flagged as single-source-uncorroborated.
7. **Existing knowledge gate** — every claim is checked against existing project documentation. If the question has been answered, the dossier points to the existing doc rather than re-deriving.
8. **Quote extraction gate** — where source wording is definitional (a regulation's exact text, a vendor's exact capability claim), the dossier embeds the verbatim quote with citation. Paraphrase of load-bearing definitions fails this gate.

A dossier that fails any gate is targeted for re-dispatch, not patched in place. Patching erodes the discipline; re-dispatch with the gap explicitly named in the new prompt produces a clean replacement.

### 3.2 Layer 1 disciplines that propagate to all layers

Beyond the 8 gates, every dossier (and every Layer 2 protocol output, and every Layer 3 deliverable) inherits a set of cross-cutting disciplines:

1. **Severity tag per finding** — 🚨 BLOCKER / ⚠ HIGH / 🟡 MEDIUM / 🟢 LOW. Calibration is cross-cutting across the project, not local to one dossier.
2. **Numeric confidence per claim** — 0.0-1.0 scale. No prose hedges ("most consistent", "settled") without a numeric anchor.
3. **Verbatim quote extraction** — every load-bearing definitional claim embeds the source's exact wording.
4. **"What I don't know" appendix** — every output ends with explicit unknowns and the next-step-to-resolve.
5. **Freshness check** — pre-{current-year} claims without re-verification are rejected.
6. **Stack-fit gate** — project constraints embedded via Universal Blocks A/B/C (see §6 below) as mandatory inputs.
7. **TCO at launch + 10× scale** — every cost claim spans both horizons.
8. **Re-verification cadence per finding** — quarterly / semiannual / annual / event-triggered, recorded inline.
9. **Cross-DECISIONS reconciliation** — every output ends with a section enumerating which prior locked entries the output interacts with.

The remaining disciplines are project-specific lock enforcements (brand filter, locale rules, compliance posture, blackout dates). The kit's generic version stops at the nine listed above; projects layer their own on top.

### 3.3 Layer 2 — The 8 Analytical Protocols

Before synthesis constructs a recommendation, Layer 2 runs eight analytical protocols across the corpus of Layer-1-verified dossiers. Each protocol surfaces a specific kind of cross-dossier signal. The protocols are independent — they can run in any order and produce non-overlapping outputs.

**Protocol 1 — Intake.** Establish a structured baseline of the dossier corpus. Catalogue per-dossier core claim (≤20 words), severity ranking, author session. Cluster the corpus into 2-5 theoretical-framework groups. Flag direct cross-dossier contradictions for Protocol 2.

**Protocol 2 — Contradiction Finder.** For every cross-dossier mutually-exclusive claim: render in a tiered table (Contested Claim / Position A with §cite / Position B with §cite / Tier 1 root cause type / Tier 2 mechanism / Tier 3 resolution owner / Confidence / Severity). Tier taxonomy: methodology, dataset, time period, definition of terms, market posture, scope. Resolution owner is whoever can resolve the contradiction (Layer 3 synthesis, external counsel, user elicitation, external data).

**Protocol 3 — Citation Chain.** Trace intellectual history of key concepts across the corpus. Origin → Challenger → Refiner → Current Status. Useful when a concept (e.g. a particular cost model, a particular regulatory interpretation) appears in multiple dossiers and has evolved. Skip with explicit note when no lineage exists; do not pad.

**Protocol 4 — Gap Scanner.** Rank the questions the corpus does *not* answer. Per gap: closest prior work in the corpus, path-to-resolution (which new dossier or external source would close it), severity, why-it-matters-now.

**Protocol 5 — Methodology Audit.** Neutral framing of the corpus's methodological diversity. Which dossiers used primary sources vs aggregator data; which used quantitative vs qualitative methods; which are reproducible (link to data + script) vs not. The point is not to rank methodology but to surface where the recommendation's confidence ultimately rests.

**Protocol 6 — Master Synthesis (≤400 words).** Four 100-word blocks: Established Consensus, Active Debates, Strongest Evidence, Key Open Question. This block becomes the Master Synthesis section of the DECISIONS entry that locks the decision.

**Protocol 7 — Assumption Catalogue.** Enumerate the assumptions the corpus is making (often unspoken). Flexible count (1-N, no max). Per assumption: risk level × consequence-if-wrong, monitoring approach.

**Protocol 8 — "So What" TL;DR.** Three numbered points for a smart non-expert: what has been proven / what is still unknown / why it matters. Becomes the TL;DR of the DECISIONS entry.

The eight protocol outputs feed directly into the Layer 3 deliverable. Layer 3's §1-§8 prefix sections are the Layer 2 outputs; Layer 3's §9+ construction sections are net new.

### 3.4 Layer 3 — Forward Decision Construction

The constructive synthesis. Reads the Layer 1 dossier corpus + the Layer 2 protocol outputs; produces a deliverable that:

1. **Ranks options across criteria.** Twin-view when applicable (a primary view + an alternate view conditioned on a key assumption being false). Each option gets a score per criterion; total weighted by a default weight vector.
2. **Runs sensitivity analysis.** Re-score under 4 weight regimes (e.g., "growth-maximizer", "cost-minimizer", "speed-maximizer", "risk-averse") and 2 scale shocks (e.g., 3× scale, 0.3× scale). The ranking that survives all six regimes is the robust choice.
3. **Builds a staged roadmap.** Per stage: trigger condition, cumulative spend, time-to-activate, critical actions, required external validation. Stages activate by revenue / scale / time triggers, not by date.
4. **Pre-loads user elicitation.** Three or four pre-baked questions for an `AskUserQuestion` (or equivalent UI) call that the next phase will dispatch. Pre-baking ensures the questions are grounded in the actual evidence rather than improvised by the next agent.
5. **Drafts the architect prompt skeleton for the next phase.** The implementation architect prompt (§5 below) gets a skeleton with knowledge-manifest paths, identity statement, mission, and section headers. The Phase 3 user-elicitation answers fill the remaining slots.
6. **Re-verification schedule.** Quarterly / semiannual / annual / event-triggered items, each with the specific monitoring approach.
7. **Reversal triggers per stage.** What would unwind each stage of the staged roadmap.
8. **Cross-DECISIONS reconciliation.** Which prior locked entries are preserved, which are superseded, with one-sentence reasons.

A Layer 3 deliverable typically runs 600-1,500 lines depending on corpus size. Shorter than 600 usually means cross-dossier tensions were under-explored; longer than 1,500 usually means the synthesizer is re-deriving Layer 1 evidence instead of citing it.

### 3.5 The composability insight

The reason this architecture beats single-pass synthesis: Layer 2's analytical lenses produce structured signals that the Layer 3 constructor can *cite* rather than re-derive. The Master Synthesis paragraph in the DECISIONS entry is Protocol 6's output, verbatim. The TL;DR is Protocol 8. The Assumption Catalogue is Protocol 7. The contradiction resolution is Protocol 2. The cross-DECISIONS reconciliation is the final section of every Layer 2 protocol output, aggregated.

A single-pass synthesizer skips this scaffolding and produces a recommendation backed by intuitions that are hard to cite. The 3-layer architecture forces the citations.

---

## 4. Pillar 3 — Orchestrator Dispatch Mechanics

When a decision needs more than one research dossier — typically the case for anything strategic — an orchestrator dispatches the dossiers, sequences synthesis, and locks the decision. Doing this well requires explicit mechanics; doing it ad-hoc collapses under context-budget reality.

### 4.1 Surface routing per phase

A multi-prompt orchestrator track has phases that fit different surfaces. Decide up front; do not improvise mid-loop.

| Phase | Surface | Why |
|---|---|---|
| Individual research dispatch (per dossier) | **Chat + Research mode** | Inline citation renderer (only surface that has it); fresh-session isolation per dossier; long compute (1-3h per) |
| Final synthesis (≥200K tokens of dossier input) | **Code** (default) or **Cowork** (also 1M on Opus 4.7/4.8 + Fable 5 / Max+ — 2026-05-27 for 4.7, 2026-06-01 for 4.8, 2026-06-10 for Fable 5) | Code remains default for synthesis: filesystem reads (no upload friction), sub-agent dispatch for parallel synthesis, repo-aware tooling for downstream commit work. Cowork at 1M context can handle ≥200K input but synthesis still benefits from Code's repo affordances. Model note: Fable 5 (Mythos-class) was the strongest synthesis model but is **SUSPENDED since 2026-06-12 (US export-control directive) — administratively unavailable; use Opus 4.8** (the cost-rational default regardless). See CLAUDE-SURFACE-ROUTING §1a/§1b. |
| Phase 3 lock (DECISIONS edit + architect prompt draft + commit) | **Code** | Repo writes; commit discipline; rule-file mirrors |
| Cross-app audits feeding research (deploy dashboards, analytics, vendor portals) | **Cowork** | Browser + native-app + filesystem; document generation when needed |

Surfaces that should *never* run regulated workloads: any surface without an audit log. Sanctions work, PHI-adjacent data, attorney-review trails belong on a surface where the platform's own audit log captures the activity.

### 4.2 Chat Project setup pattern

For a multi-dossier orchestrator track, a one-time Chat Project setup pays back across every individual dossier dispatch. The setup pattern:

**Create a Project.** Name it `{ProjectSlug} {Track} Research`. Description: 2-3 lines citing the orchestrator's mission and the dispatch-protocol document.

**Custom instructions (paste into Project settings).** Specify research output language, output format, the 8-gate framework, severity tag conventions, numeric confidence requirements, Universal Blocks A/B/C as mandatory dossier sections, project context envelope (the constraints every dossier must respect).

**Knowledge file upload (initial baseline).** Target 12-18 files at ~200-350 KB total. Selection logic:

| File class | Why |
|---|---|
| Project rule files in the track's domain | Auto-applied behavioral constraints |
| Existing research dossiers in the domain | Prior research forming baseline; prevents re-derivation |
| Reference docs (locked decisions, vendor lists, strategy specs) | Decision context |
| Brand / positioning spec | Track-invariant context |
| Orchestrator meta-docs (dispatch protocol, gap inventory, integration brief) | Per-orchestrator context |

Do *not* upload code files, environment files, or rule files outside track scope. Token budget at upload time is non-trivial; over-uploading degrades RAG retrieval quality.

### 4.3 Wave-based RAG refresh (Law #4 — Deferred Dependencies)

The critical mechanic that prevents parallel-everything dispatch from collapsing.

**Build a dependency DAG of all prompts in the orchestrator track.** Read each prompt's stated dependencies and cross-references. Group prompts that are *fully independent* (no upstream dossier dependency) into Wave 1. Prompts depending on Wave 1 preliminary findings go to Wave 1.5 or Wave 2. The final synthesis prompt (terminal wave) reads everything.

**Do not mechanically split prompts evenly across waves.** Run the DAG analysis; let independent prompts run in parallel; defer prompts that need upstream output.

**Wave cycle template (per wave):**

```
1. User opens M parallel chats (one prompt per chat)
2. Each chat: best-reasoning model + Research mode ON + paste full prompt
3. Wait 1-3h per chat for dossier output
4. User saves each dossier to docs/research/{track}/{slug}.md
5. Orchestrator session 8-gate verifies each dossier (Layer 1)
6. If any gate-fail: targeted re-dispatch (do NOT proceed)
7. After all M dossiers pass: orchestrator commits Wave N PR (squash-merge)
8. User uploads M dossiers to Project Knowledge (drag-drop in claude.ai UI)
9. Wave N+1 unblocked
```

**Why upload between waves rather than at the end.** Subsequent-wave prompts reference upstream preliminary findings. Without RAG access to the upstream dossiers, subsequent-wave prompts re-derive instead of synthesize. Phase-aware RAG refresh = compounding quality improvement across waves.

**Why final synthesis does not use Project RAG.** Synthesis runs on Code with `@`-mentions or direct filesystem reads. Code reads the dossiers in full, faster than RAG retrieval and without retrieval ceilings. Project RAG remains useful for ad-hoc consultations during synthesis but not as primary input.

### 4.4 Sub-agent model directive (Opus mandate for synthesis)

Default sub-agent dispatch on Claude Code uses Haiku-4.5 (efficiency optimization). For decision-grade synthesis, force Opus. Add this block verbatim to dispatch prompts for synthesis sessions:

```
Sub-agent model directive (CRITICAL for this task): every Task tool
invocation in this session MUST use model: "opus" — NOT default Haiku/
Sonnet. This synthesis is decision-grade work requiring Opus-class
reasoning for quote extraction, freshness-log aggregation, and ranking-
matrix construction. Quality > speed for single-shot critical synthesis.
```

Apply for: final synthesis prompts (the R-class deliverable), Phase 3 elicitation sessions (DECISIONS lock + architect prompt draft), any cross-dossier integration that risks losing nuance under Haiku.

Skip for: trivial mechanical tasks (file listing, simple greps, scaffolding).

### 4.5 Synthesis prompt quality bar

A synthesis prompt is *not* a long version of a research prompt. It is a different artifact. Required components:

1. **Dossier-anchored.** Every claim cites the source dossier and section (`R{N} §{X}`, `M{N} §{X}`), not training data.
2. **Cross-dossier tensions pre-identified.** The synthesis prompt lists the specific conflicts the synthesizer must resolve. Don't make the synthesizer rediscover them.
3. **Twin-view ranking when applicable.** When a major assumption splits the answer (e.g., "Russia is a market" vs "Russia is not a market"), produce both views ranked, not just the modal one.
4. **Phase 3 elicitation Q1-Q4 pre-loaded.** Questions for the next agent's `AskUserQuestion` call, grounded in the dossier evidence.
5. **Architect prompt skeleton for the next phase.** Section headers + knowledge-manifest paths + identity statement. Phase 3 fills the remaining slots based on user-elicitation answers.
6. **Re-verification schedule.** Quarterly / semiannual / annual / event-triggered items, each with monitoring approach.
7. **Universal Blocks A/B/C consolidated.** The synthesis aggregates Block A (Context Envelope), Block B (Common Pitfalls), and Block C (Freshness Log) from across the corpus.
8. **Length target.** 600-1,500 lines typical. Shorter usually means under-explored tensions; longer usually means re-derivation.

If the existing synthesis prompt in your track does not follow this pattern, rewrite it before dispatch. Pre-dispatch upgrade of a synthesis prompt is high-leverage work; dispatching a stale-baseline prompt against a fresh dossier corpus wastes the dossiers' value.

### 4.6 DECISIONS.md numbering verification

Every Phase 3 lock requires a numbering check before the entry is appended:

```bash
grep -c "^## Implementation #" DECISIONS.md
```

Result + 1 = next free number. Cross-check against reservation comments in recent commits. If a conflict surfaces, escalate to the human user — do not silently mutate.

### 4.7 Async multi-agent orchestration (peer-hub vs lead-spawn-monitor)

Everything above this point is *wave-based* orchestration: a human mediates between waves, dossiers are the unit of work, and synthesis happens after the corpus is complete. A second orchestration mode exists — **async multi-agent**: multiple live agents coordinating *during* a run through message passing, with no human between turns. The conceptual core is two patterns published in Anthropic's async-multi-agent cookbook (the notebook self-describes as "the **shape** of the two multi-agent orchestration patterns behind the multi-agent results in the Claude Opus 4.8 system card"), implemented on the bare Messages API + `asyncio` — deliberately harness-agnostic, so the mechanics transfer to any stack.

**The shared substrate.** A hub holds a per-agent inbox, a per-agent wake event, and a status register (`active | idling | done | crashed`). Every agent gets exactly two coordination tools: `send_message(recipient_ids[], content)` — described to the model as "the ONLY way to reach other agents — plain text in your turn goes nowhere" — and `wait_for_message()` (60s timeout) — "only use this when you have nothing else to do." The mechanic that removes polling: after each turn, the agent's drained inbox is **appended to its last tool result**, so incoming messages ride context the agent was already going to read; `wait_for_message` is only for genuinely idle agents. Crash containment is structural: an exception marks that agent `crashed` in the hub instead of taking down the run.

**Pattern 1 — fixed peer team (peer-hub).** A symmetric roster known up front; every agent's system prompt names its peers; coordination is peer-to-peer through the hub; a designated lead synthesizes and ends the run. Fits when the decomposition is known at dispatch time and roles are stable — e.g., one agent per source domain with cross-checking between peers.

**Pattern 2 — lead-spawn-monitor.** The lead additionally gets `create_subagents(base_instruction, per_subagent_instructions[] ≤10)` (returns immediately; helpers run concurrently), `get_status()`, and `kill_subagents(subagent_ids[])`. Demonstrated loop: spawn → poll status → collect reports via `wait_for_message` → dismiss. Fits when the decomposition *emerges* from early findings — the lead discovers how many workers it needs and what each should do.

**The scripted variant (script-holds-the-plan).** Claude Code dynamic workflows are the third shape: an orchestration *script* (written by the model, executed by the runtime) holds the plan and intermediate results in script variables rather than in any agent's context window. Subagents always run `acceptEdits` inheriting the tool allowlist; ≤16 concurrent agents, ≤1,000 per run; org kill-switch `disableWorkflows`. Its first-class adversarial pattern is worth stealing for any stack: fan out the same claim to multiple agents, vote, and filter claims that fail cross-checking.

**The managed implementation.** Managed Agents productizes these shapes as multiagent sessions: a coordinator's roster of versioned agents, context-isolated session threads (persistent — follow-ups retain prior turns), lifecycle + message events on a primary stream, and hard limits (≤20 roster agents, delegation depth 1, ≤25 concurrent threads). Roster references are snapshot-pinned; `{"type":"self"}` gives Pattern-2-style copies. Mechanics, gating caveats, and trust topology: `KB-06-MANAGED-AGENTS.md` §4.

**Async vs waves — when each wins.**

| Use waves (§4.3) | Use async multi-agent |
|---|---|
| Decision-grade synthesis: human 8-gate-verifies between stages | Throughput work: human reviews the end artifact, not the intermediates |
| Dependencies form a clean DAG known up front | Decomposition emerges mid-run (lead-spawn-monitor) or peers must negotiate (peer-hub) |
| Each unit of work is hours of Research-mode compute | Each unit is minutes of tool-running compute |
| Token budget is the binding constraint — waves cap concurrent context | Wall-clock is the binding constraint — parallelism pays |

Decision-grade research orchestration stays wave-based: the human gate between waves *is* the quality mechanism (Layer 1 verification, §4.3 step 5), and async coordination would route unverified intermediate claims directly into sibling contexts. Async multi-agent is for implementation-grade throughput once the decision is locked.

**Trust-escalation warning (inline by design).** Sub-agent output is **tool output** — it inherits the trust level of the worst content the sub-agent touched. The documented failure mode is laundering: a sub-agent reads injected content and reports it upward as higher-trust "structured facts" the lead acts on. Anthropic's containment post names multi-agent trust escalation a forward risk; the mitigation is the same at every scale — treat inter-agent messages with the same suspicion as external content, and never grant the coordinator the union of all roster tools (scope each agent to its role; see KB-06 §5).

**Cost note.** Async fan-out compounds token spend nonlinearly — every message ride-along grows every recipient's context, and hosted-agent postmortems consistently show *loops + accumulation*, not single calls, producing runaway bills. Wire in-process enforcement (step caps, budget gates, duplicate-message detectors) into the hub before scaling N; "monitoring is not enforcement" (KB-06 §7). The complementary scale trap — fixed per-call overhead × call count swamping the work, and a spend breaker that never fires because control never returns mid-run — is the "fire-and-forget subagent chains" anti-pattern in §4.9.

### 4.8 Pre-dispatch verification checklist

Run before dispatching each wave:

- All required upstream dossiers exist + 8-gate-verified + committed
- Wave dossiers uploaded to Project Knowledge (between waves)
- Track-specific custom instructions applied to the Project
- User on a plan tier that supports the required surface affordances (Research mode, 1M context auto-on)
- No project-specific blackout dates conflicting with dispatch
- Cross-orchestrator boundary clean (no silent mutation of a peer orchestrator's scope)

### 4.9 Anti-patterns

- Run synthesis on Chat web UI with ≥200K input (Chat default still 200K per support.claude.com; Cowork has 1M on Opus 4.7/4.8 + Fable 5 Max+ — 2026-05-27 / 2026-06-01 / 2026-06-10 — but Chat-UI parity with that figure is unverified)
- Upload all dossiers at the end (skip wave-RAG refresh) — degrades subsequent waves
- Dispatch dependent prompts in parallel with their dependencies (violates Law #4)
- Pre-lock specific waves before running the dependency DAG analysis
- Use Cowork for any regulated workload
- Silently mutate another orchestrator's scope (their DECISIONS entries, their rule files, their agents)
- Lock DECISIONS without `grep`-checking numbering
- Dispatch synthesis without the sub-agent Opus directive
- Dispatch synthesis with stale evidence baseline (rewrite the synthesis prompt from real dossiers per §4.5)
- **Fire-and-forget subagent chains.** Launching a chain and awaiting it only at completion bypasses spend breakers *by construction*: a breaker that checks projected-vs-actual can only fire if control returns to the orchestrator loop, and a fire-and-forget chain reports its cost exactly once — after it is spent. Four teeth:
  1. **Checkpoints at stage/workstream boundaries are mandatory return points.** At each boundary the orchestrator reads actual spend vs plan; ≥2× projected → stop and surface to the operator. No boundary return = no breaker, no matter how the breaker is written.
  2. **Per-call fixed context overhead dominates at scale — measured, not estimated.** In the v0.18.0-H harness baseline (ADJ-3), ~31.5k tokens of fixed per-call system context × 612 subagent calls ≈ 19M of a 23.7M run was per-call overhead, not work. Model per-call cost at the *measured* constant of your harness, never at the naive 3–4k.
  3. **Count calls, not just tokens.** Budget = calls × per-call-overhead + content. Any protocol that loops calls must batch (≥10 items per call where the protocol's independence requirements allow) and write results once per batch, never once per item.
  4. **Pre-compute before launch.** Projected calls × measured per-call overhead is a two-line arithmetic check that would have predicted the 10× overrun before spending it.

---

## 5. Pillar 4 — The 14-Section Architect Prompt

Once a decision is locked, the *next* phase typically needs an implementation architect — a long, structured prompt that turns the lock into actionable engineering steps. The architect prompt follows a fixed 14-section structure. The structure is opinionated and the hard ceilings are load-bearing.

### 5.1 When to write an architect prompt

When the locked decision triggers implementation work that:

- spans multiple sub-tasks (5+ steps)
- requires external validation (counsel, vendor confirmation, regulatory filings)
- has stage-gated activation (Stage 0 now / Stage 1 at trigger T / Stage 2 at trigger U)
- needs to be re-runnable by a fresh agent in 6 months

If the implementation is a single PR's worth of work and does not span sub-tasks or external validation, write a regular Code-handoff prompt (see `prompts/code-handoff-prompts.md`), not an architect prompt.

### 5.2 The 14 sections

```markdown
# IMPL_{N} — {Title}

**Phase 4 architect prompt** for {what decision locks this work}.
**Dispatch:** {surface, model, plan tier, when to dispatch}.

## 1. Identity

3 anchored disciplines the architect agent must embody (e.g., "production-skill ecosystem awareness", "decision-canon fluency", "domain X expertise"). 4-6 lines per discipline.

NOT lists. The agent should know what kind of analyst it is.

## 2. Mission

One paragraph. Explicitly: produce what artifact, by what method, against what locked decision (cite DECISIONS #N). Constrain scope.

## 3. Ground rules

Severity tags + numeric confidence + no invention + brand filter + project-specific locks. 6-10 bullets max.

## 4. Knowledge manifest (hard cap on file count)

Reading order is mandatory. Group by tier:
- Primary evidence base (read FIRST)
- Guardrails (read SECOND)
- Blueprint (read THIRD)
- Context (read LAST, only if a BLOCKER question remains)

Hard cap typical: 5-7 files. If a file does not earn its slot, drop it.

## 5. Research questions (severity-tagged)

🚨 BLOCKER — integration cannot ship without these (3-5 questions)
⚠ HIGH — shape the usable integration (3-5)
🟡 MEDIUM — polish (2-4)
🟢 LOW — edge cases (1-2)

Each question: decidable, citable, scoped.

## 6. 8-Gate Anti-Hallucination Framework

Either the full text of the 8 gates (when the agent has not internalized them yet) or a 2-line "apply 8-gate framework per KB-04 §3.1" reference.

## 7. Domain scenarios (stress-test every deliverable)

5-6 concrete user-input scenarios that the deliverable must handle. Each: full task description + expected agent behavior + verification criterion.

Every artifact in the deliverable is stress-tested against all scenarios.

## 8. Deliverable format (exact structure, hard ceilings)

Per artifact: path, line ceiling, required section list. Line ceilings are mandatory; cutting prose before exceeding ceiling is mandatory; "I hit the ceiling so here's a truncated section" is a defect.

## 9. Quote library requirement

Required count of verbatim source quotes (typical: ≥6). Format per quote (source + section + verbatim text).

## 10. Cross-reference index

Every load-bearing claim that sources back to another artifact must link via relative path. No duplication; reference is the rule.

## 11. Uncertainty log (per artifact)

Each artifact ends with ≥3 entries:
- Source-silent questions
- Version-staleness risks
- Single-source claims
- Project-personal-context gaps

Uncertainty is a deliverable, not a failure.

## 12. "What I don't know" prompt-back

Close with explicit questions to the human operator: plan-tier assumptions, scope edges, integration-with-existing-skills, language-mode confirmation. The operator answers before the agent ships.

## 13. Out of scope (strict)

Explicit list of what NOT to drift into. Typical: third-party tool comparisons, frameworks the project doesn't use, end-user copy generation in regulated languages, rewriting upstream KB.

## 14. Success criteria (agent self-scores before returning)

Checklist (10-25 items). Every deliverable ceiling, every gate, every scenario verification, every cross-reference, every quote requirement. Agent self-scores against this list before declaring done.
```

### 5.3 Hard ceilings — why

Line ceilings on every deliverable section enforce density. Without ceilings, agents pad. With ceilings, agents cut weakest prose first. The ceiling forces a choice between two ways of saying something; the choice produces sharper prose.

Token cost is real. A 5,000-line architect prompt that turns into a 10,000-line deliverable is expensive to run, expensive to read, and harder to act on. The discipline is to ship the sharpest version that meets the brief.

### 5.4 The "What I don't know" prompt-back as a deliverable

A surprising amount of high-leverage clarification happens after the architect agent runs but before its output gets acted on. The "What I don't know" section makes that clarification explicit: the agent surfaces 4-6 questions whose answers would change the recommendation. The operator answers; the agent's output gets revised before any downstream commit.

Without this step, ambiguities propagate silently into the implementation phase and surface as surprise rework.

### 5.5 Worked example

the private lab's worked instance (not shipped) is one such architect prompt in full rigor (430 lines, 17 sections, 6-file knowledge manifest). It is one project's instance; the section *names* match this KB's 14-section structure, the section *content* is project-specific.

---

## 6. Universal Blocks A / B / C

Three mandatory sections that appear in every dossier and that the synthesizer aggregates into the final deliverable. They are project-specific in content, structural in form.

### 6.1 Block A — Context Envelope

The project's binding constraints. What the project *cannot* change: budget reality, regulatory posture, team capacity, locked technology choices, market reality, founder-or-leadership constraints.

Block A is what differentiates a generic recommendation from a project-fit recommendation. A research dossier on "best CMS for a luxury brand" can produce a perfect answer that is wrong for a project running a $7K marketing budget with no full-time developer; Block A makes that wrongness impossible by forcing the dossier to engage the budget constraint.

Structure: 8-15 lines. Founder cash / team / locked inventory / stage tiers / regulated locale list / non-negotiables.

### 6.2 Block B — Common Pitfalls

Adversarial: "what do smart operators get wrong in this domain?" 3-5 quantified examples with primary-source evidence. Each pitfall: the wrong move + the cost of the wrong move + the source documenting the wrongness + the corrective.

Block B prevents the synthesizer from producing a clean recommendation that ignores known failure modes. The pitfalls are documented; the recommendation must engage them.

### 6.3 Block C — Freshness Log

Aggregated citation table: claim × effective-date × verification-date × status (✅ verified / ⚠ stale-but-load-bearing / ❓ unverifiable). One row per load-bearing citation in the dossier.

Block C is the audit artifact. An external reviewer (counsel, partner, future self) can scan Block C and immediately see which claims rest on recent evidence, which rest on aging evidence, and which the dossier could not verify. The reviewer's confidence in the dossier scales with Block C's density and freshness.

### 6.4 How the synthesizer uses A/B/C

The Layer 3 deliverable's first three sections are typically the aggregated A/B/C across the corpus. Block A becomes the deliverable's executive constraint summary; Block B becomes the deliverable's anti-pattern catalog; Block C becomes the deliverable's freshness log. The synthesizer does *not* re-derive these; it aggregates them.

---

## 7. Reversal Triggers + Re-Verification Cadence

The discipline that keeps locked decisions alive instead of fossilized.

### 7.1 How to write a reversal trigger

A trigger is *decidable* (you can tell from observable facts whether it has fired), *ranked* (severity tag indicates how urgently it forces a re-look), and *actionable* (it points to a specific alternative path the project switches to when it fires).

Bad trigger: "the market changes" (not decidable).
Better trigger: "regulator publishes a new policy targeting our entity type" (decidable from the regulator's official channel).
Best trigger: "regulator's official channel posts a policy affecting our entity type AND our compliance counsel confirms the policy applies to us" (decidable + two-source confirmation + actionable corrective path is named).

Every staged decision (a roadmap with Stage 0 / 1 / 2 / 3 activation triggers) gets a corresponding stage-level reversal trigger. Stage N's trigger answers: "what would force us to skip / defer / abandon Stage N?"

### 7.2 Cadence taxonomy

| Cadence | Use when |
|---|---|
| **Quarterly (90d)** | Evidence base evolves on weeks-to-months horizon (regulator activity, vendor policy, sanctions lists, competitor positioning, ad-platform algorithm shifts) |
| **Semiannual (180d)** | Evidence base evolves on months-to-half-year horizon (tax policy, compliance frameworks, IP regimes, banking eligibility) |
| **Annual** | Evidence base stable (industry benchmarks, strategic positioning, brand discipline) |
| **Event-triggered** | A specific external event forces an immediate re-look (new SDN designation, new platform major release, founder-or-leadership event) |

A re-verification entry per cadence + a monitoring list (which channels to watch for each item) becomes the re-verification schedule of the DECISIONS entry.

### 7.3 Recording reversals

When a re-verification surfaces evidence that fires a trigger, the project does *not* edit the locked entry. The project writes a new DECISIONS entry whose "Cross-DECISIONS Reconciliation" section explicitly says "supersedes Implementation #N (reason: trigger T fired on date D)". The original entry remains in the ledger; the new entry locks the new direction.

This is the discipline that keeps the audit trail honest.

---

## 8. The maturity gradient

Not every project needs the full discipline. Three tiers; graduate when warning signs appear.

### 8.1 Starter (small team, one-off decisions)

A single `DECISIONS.md` file at root, lightweight entry format (date + decision + one-sentence reason). 10-20 entries max before the file becomes hard to scan.

Warning sign for graduation: decisions get re-debated despite being in the ledger.

### 8.2 Intermediate (multi-week project, multiple consequential decisions)

`DECISIONS.md` with full entry structure (TL;DR / Master Synthesis 400w / Full Body / Reversal / Re-verify / Cross-reconcile). 8-gate Layer 1 framework applied to every research dossier. No Layer 2 / Layer 3 yet; synthesis is single-pass.

Warning sign for graduation: a decision required >4 research dossiers, or the synthesizer missed a cross-dossier contradiction that downstream work surfaced.

### 8.3 Advanced (multi-orchestrator, multi-month, strategic stakes)

Full 3-layer architecture. Orchestrator dispatch mechanics. 14-section architect prompts for major implementation phases. Universal Blocks A/B/C mandatory in every dossier. Skills (`research-prompt-writer`, `research-synthesizer`) deployed.

Warning sign for further investment: cross-orchestrator boundaries blurring (one orchestrator silently affecting another's scope). Add a `orchestrator-dispatch.md` rule + cross-orchestrator reconciliation protocol.

### 8.4 When *not* to graduate

A solo developer building a side project does not need the 3-layer architecture; the overhead exceeds the benefit. The discipline scales with stakes, not with project age. A 6-month side project might never need more than Starter; a 2-month strategic launch needs Advanced from day one.

The forcing function for graduation is *cost-of-a-bad-decision*. When that cost crosses the discipline's overhead, graduate.

---

## 9. Anti-patterns catalog

Compiled across the four pillars; each anti-pattern has been observed in real projects.

1. **Silent rewrite of a locked DECISIONS entry.** Breaks every reference, obliterates audit trail. Reverse with a new numbered entry instead.
2. **Premature lock.** Locking a call before the evidence base supports a 90-day commitment. Train the team to ignore the ledger.
3. **Lock without reversal triggers.** Re-verification becomes guesswork; the lock fossilizes.
4. **Single-source claim treated as load-bearing without a flag.** Crosses the 8-gate cross-reference threshold silently.
5. **Layer 2 skipped — straight from dossiers to recommendation.** Cross-dossier contradictions go unresolved into the lock.
6. **Layer 3 without Layer 3.** A beautiful analytical report that does not make a call.
7. **Mechanical even-split across waves.** Dependent prompts run before their dependencies; Wave 2 re-derives Wave 1.
8. **Default sub-agent (Haiku) for decision-grade synthesis.** Quote extraction degrades; freshness-log aggregation misses citations.
9. **Stale-baseline synthesis prompt against a fresh corpus.** Pre-dispatch upgrade of the synthesis prompt is high-leverage work, not optional.
10. **Architect prompt without hard ceilings.** Padded deliverable; expensive to run, harder to act on.
11. **Architect prompt without "What I don't know" prompt-back.** Ambiguities propagate silently into implementation.
12. **DECISIONS numbering not `grep`-checked.** Two orchestrators race for the same number; one silently mutates the other.
13. **Cross-orchestrator boundary breach.** Orchestrator A silently mutates orchestrator B's scope (its DECISIONS entries, its rule files, its agents).
14. **Universal Block A missing or generic.** Dossier produces project-agnostic recommendations that ignore the binding constraints.
15. **Block C (freshness log) skipped.** External reviewer cannot audit; aging citations go unnoticed.
16. **Reversal trigger that is not decidable.** "The market changes" — no observable fact tells you whether it has fired.
17. **Re-verification cadence without a monitoring list.** Re-verification becomes "remember to check sometimes"; eventually never happens.
18. **Decisions in commit messages or chat threads, not in the ledger.** Future agents will not find them.
19. **Fire-and-forget subagent chains.** Cost surfaces only at completion, so the spend breaker never fires; per-call overhead × call count swamps the work. Checkpoint at boundaries, count calls not just tokens, pre-compute calls × measured per-call overhead before launch (§4.9).

---

## 10. Integration with the rest of the kit

### 10.1 KB-01 (Workflow Engineering)

Decision engineering *consumes* the context-engineering discipline. The 8-gate framework's Source / Version / Stack-fit / Cost gates are projections of KB-01 §6 (hallucination reduction). The 14-section architect prompt extends KB-01 §5 (prompt engineering) with structural constraints specific to multi-step strategic work. Do not skip KB-01 to read KB-04 — the techniques compose.

### 10.2 KB-02 (Project Infrastructure)

Decision engineering *extends* the skill and rule patterns from KB-02 §3 (skills) and §4 (agents). The `research-prompt-writer` and `research-synthesizer` skills follow KB-02's skill format. The `orchestrator-dispatch` rule follows KB-02's rule format. The architect prompt sits alongside KB-02's prompt patterns as a heavier sibling.

### 10.3 KB-03 (Catalog Pipeline Architecture)

Orthogonal. A data-pipeline project's deliverable is a typed dataset; KB-03 governs the pipeline. KB-04 governs the *decisions* the pipeline owner makes (source selection, schema evolution, license posture). The two can be applied independently or together.

### 10.4 CLAUDE-SURFACE-ROUTING

The surface-routing rubric (`knowledge-base/CLAUDE-SURFACE-ROUTING.md`) is *consumed* by §4.1 above. Surface-routing decisions are not themselves DECISIONS-ledger material — they are repeatable per task. But surface-routing competence is a prerequisite for orchestrator dispatch.

### 10.5 The generator (`generator/PROJECT_SETUP_PROMPT.md`)

The generator's Phase 3 (file generation) gets a new branch when KB-04 is in scope: install `DECISIONS.md` with the full entry template, install the `orchestrator-dispatch.md` rule + Cursor mirror, install the two skills (`research-prompt-writer`, `research-synthesizer`), install the architect prompt template. The generator detects KB-04-in-scope by reading the project's stated complexity (single-developer side project → Starter; multi-stakeholder strategic launch → Advanced).

---

## 11. Common questions

**Do I need all three layers?**
No. Start with Layer 1 (the 8-gate framework on every research dossier). Add Layer 2 when your synthesis is missing cross-dossier contradictions that downstream work surfaces. Add Layer 3 when a decision needs >4 dossiers and a ranked recommendation that survives sensitivity analysis.

**How many decisions before `DECISIONS.md` is worth maintaining?**
Three. Two decisions can live in commit messages; four start to cross-interact. By the third consequential decision, the ledger pays back.

**When does an architect prompt earn its 400-600 lines?**
When the work it dispatches spans 5+ sub-tasks, requires external validation, or has stage-gated activation. Below that bar, a regular Code-handoff prompt (see `prompts/code-handoff-prompts.md`) is the right format.

**How do I prevent an agent from silently mutating my `DECISIONS.md`?**
Lock the file in your rule discipline: `.claude/rules/git.md` (or equivalent) names `DECISIONS.md` as a never-edit-silently file. The orchestrator-dispatch rule (`.claude/rules/orchestrator-dispatch.md`) enforces the `grep`-then-+1 numbering protocol. Code-review checks every PR that touches `DECISIONS.md` against the rule.

**What if two orchestrators race for the same Implementation number?**
Escalate to the human user via an explicit question (e.g., an `AskUserQuestion` call in Cowork or a Plan-mode pause in Code). Do not silently mutate. Re-numbering a locked entry breaks every architect prompt, rule file, and commit message that references it.

**Can Layer 2 protocols be skipped if no cross-dossier tensions exist?**
Yes, with an explicit "skip" note + reason. Protocol 3 (Citation Chain) is the most commonly skipped — many corpora do not have intellectual lineage worth tracing. Protocol 4 (Gap Scanner) is the *least* skippable; almost every corpus has gaps worth ranking.

**What if my project does not have a Block A (context envelope) yet?**
Write one. Founder cash, team size, locked technology choices, regulatory exposure, market constraints. 8-15 lines. Without it, your research produces generic recommendations that ignore the project's binding constraints.

**Do I need to use claude.ai Projects for the orchestrator pattern?**
The pattern is surface-aware, not platform-specific. The Projects mechanism handles Knowledge file uploads + custom instructions + RAG. Equivalent setups exist in other platforms; the principle (per-wave RAG refresh) holds across them. Adjust the §4.2 setup pattern to your platform's affordances.

**My project is a solo side project — is decision engineering overhead?**
Probably yes, at full discipline. Use the Starter tier: a lightweight `DECISIONS.md` with 1-line-per-entry format. Graduate when decisions start cross-interacting.

---

## 12. Templates + skills (companion artifacts in this kit)

KB-04 ships with companion templates and skills under the kit's existing `templates/` conventions:

- `templates/shared/DECISIONS.md.template` — full discipline template (Starter format + Intermediate format + Advanced format in one file, with selector guidance). Replaces the older 1-liner-per-entry stub.
- `templates/shared/ARCHITECT_PROMPT.md.template` — 14-section architect-prompt skeleton with `{{PLACEHOLDER}}` slots and inline guidance per section.
- `templates/claude-code/rules/orchestrator-dispatch.md.template` — generic mirror of the orchestrator-dispatch rule (surface routing per phase, wave DAG, sub-agent directive, DECISIONS numbering, anti-patterns).
- `templates/claude-code/rules/research.md.template` — generic mirror of the 3-layer research-methodology rule (8-gate framework reference, severity tags, numeric confidence, Universal Blocks A/B/C).
- `templates/cursor/skills/research-prompt-writer.SKILL.md.template` — the per-dossier-write-time skill (Layer 1). Works equally for Cursor (`.cursor/skills/`) and Claude Code (`.claude/skills/`) — the skill format is identical.
- `templates/cursor/skills/research-synthesizer.SKILL.md.template` — the synthesis-time skill (Layer 2 + Layer 3 enhancement pattern). Same dual applicability as above.

Worked instances of all of the above live at the private lab's worked instance (not shipped) (the source project for this KB's patterns).

---

## 13. Cross-references

- `knowledge-base/KB-01-AI-WORKFLOW-ENGINEERING.md` — context engineering, prompt engineering, hallucination reduction (KB-04 consumes)
- `knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` — skills + agent architecture (KB-04 extends)
- `knowledge-base/KB-03-CATALOG-PIPELINE-ARCHITECTURE.md` — orthogonal (data pipelines)
- `knowledge-base/KB-06-MANAGED-AGENTS.md` — the managed implementation of §4.7's orchestration patterns (session threads, rosters, scheduled deployments) + the hosted-agent containment doctrine
- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — consumed by §4.1
- `workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md` — consumed by §4.1 / §4.4
- `prompts/chat-research-missions.md` — the research-prompt template at §3.1 input quality
- `prompts/code-handoff-prompts.md` — the Code-handoff alternative at §5.1 (when an architect prompt is *too* much)
- `prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md` — a per-project install prompt that wires the kit's surface routing into a target project; a worked example of the §5 architect-prompt pattern
- the private lab's worked instance (not shipped) — worked instance of every pattern in this KB
- `generator/PROJECT_SETUP_PROMPT.md` Phase 3 — file generation branch that installs KB-04 artifacts when project complexity warrants

---

## 14. What this KB does NOT cover

- **Conversational decision-making techniques** (inversion, pre-mortem, second-order thinking, Bayesian update, steelmanning, reversibility check) — these are short-horizon, single-turn techniques. They live in the sibling KB at `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md`. KB-05 ships 12 decision skills + a hybrid router + a 3-voice council reference architecture; a consequential KB-05 pressure-test may escalate to a KB-04 architect prompt for project-scale lock.
- **Multi-agent council / debate / tournament patterns** — when a question warrants 3+ agents with different priors attacking it in parallel. Covered in KB-05 §6 (Council Reference Architecture). Gated invocation: KB-05 §5.4 + §6.5 (15× token cost gate).
- **Anti-sycophancy patterns** — how to make an agent push back instead of validate. Covered in KB-05 §4 (Anti-sycophancy as meta-skill) + §7 (four concrete patterns with verbatim sources).
- **Domain-specific decision frameworks** (medical, legal, financial) — KB-04 is the meta-discipline; project teams layer domain-specific framework rules on top in their own `.claude/rules/` files.
- **Game theory, prediction markets, formal verification** — adjacent disciplines worth knowing about but not collapsible into the four pillars above.

The pillars above are the *project* discipline. The sibling KB targeted at the *conversational* discipline is the natural complement.
