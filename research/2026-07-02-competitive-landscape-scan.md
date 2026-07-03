# Competitive Landscape Scan — AI-Workflow-Setup Ecosystem

**Date:** 2026-07-02 · **Method:** two parallel research subagents (one full-README digest of everything-claude-code, one web sweep of 9+ adjacent projects) · **Purpose:** identify mechanisms worth adopting into the kit and confirm/deny the kit's differentiation claims before the public-release push.

**Data caveats:** GitHub API responses were served from a cache dated ~2026-05-27 — star counts marked *(API)* are late-May values. SuperClaude / superpowers / claude-flow API calls were rate-limited; their figures come from dated secondary sources and are marked UNVERIFIED where applicable. ECC analysis is grounded in a 100% read of its 1,766-line README (v2.0.0-rc.1, Apr 2026).

---

## §1 Landscape at a glance

| Project | Scale / activity | Core mechanism | One-line verdict |
|---|---|---|---|
| **affaan-m/everything-claude-code (ECC)** | README self-claims 182K+ ★ / 28K+ forks / 170+ contributors; star-history ~171K; MIT; single maintainer; $19/seat/mo Pro tier | Curated catalog (60 agents / 232 skills / 34 rules / hooks / 14 MCP) + marketplace plugin + installer with state store; "instincts" learning loop; AgentShield config scanner | The category breakout of 2026. Breadth + distribution engineering + one novel primitive (instincts). **No generator, no currency mechanism, no decision layer.** |
| **github/spec-kit** | 106,332 ★ *(API)*; first-party GitHub | `specify` CLI: constitution → specify → clarify → plan → tasks → implement, with `/speckit.analyze` + `/speckit.checklist` gates; 30+ agent integrations; 4-layer template resolution; `self check/upgrade` | The first-party heavyweight. Spec-pipeline for greenfield features; weak brownfield/ops; self-labels outcome validation "experimental goal". |
| **obra/superpowers** | >121K ★ (Apr 2026, UNVERIFIED current); official Anthropic marketplace | ~20 composable **auto-triggering** skills encoding a full SDLC: brainstorm → design → worktree → plan → subagent-per-task + two-stage review → strict TDD | Radical simplicity won. Zero invocation burden; methodology-as-skills. Coding-only, deliberately closed to contributions, no measurements. |
| **ruvnet/claude-flow → "Ruflo"** | ~59K ★ (Jun 2026); very active; 22.2M+ claimed npm downloads | Two-tier install (lite plugin vs full: 98 agents, ~210 MCP tools, swarm topologies, vector memory, federation); published infra benchmarks; `ruflo verify` crypto install verification | Maximal-surface orchestration play. Benchmarks are infra (latency/RSS), not workflow quality. Brand churn (rename) is a cautionary tale. |
| **bmad-code-org/BMAD-METHOD v6** | 47,753 ★ *(API)* | `npx bmad-method install`; multi-persona agile method (PM/Architect/Dev/UX…); module ecosystem; `bmad-help` wayfinder; web-bundles for flat-rate planning | Method-first, human-facilitated. Heavy prerequisites, agile-ceremony opinionated, coding/product-only, zero measurements. |
| **hesreallyhim/awesome-claude-code** | 44,891 ★ *(API)*; last push 2026-04-27 — curation slowing | Generated README from a resource DB; agent-only PR intake; honest editorial staleness notes | The category's radar. CC BY-NC-ND license blocks derivative reuse. Even automated intake went ~a month without a push. |
| **wshobson/agents** | 35,739 ★ *(API)* | 78–88 granular plugins (avg 3.6 components, ~1000 tokens each); 4-tier model routing with cost math; **PluginEval** statistical harness | The token-budget-first marketplace, and home of the only real eval harness in the space. Catalog breadth over methodology depth. |
| **SuperClaude-Org/SuperClaude_Framework** | ~20.4K ★ (Jan 2026, UNVERIFIED) | pipx installer injecting 30 `/sc:*` commands + 7 behavioral modes + deep-research subsystem (hop budgets, confidence thresholds) | Mid-2025 pioneer, plateaued. "2-3x faster / 30-50% fewer tokens" claims ship with **no methodology** — the anti-example for proof discipline. |
| **VoltAgent/awesome-claude-code-subagents** | 20,242 ★ *(API)* | 154+ agent definitions; least-privilege tool matrix per role; per-agent model routing; agent-installer meta-agent | Static prompt catalog with explicit "we do not audit" disclaimer. Steal the permission matrix, skip the rest. |
| Volume/misc entrants | jeremylongshore (425 plugins/2,810 skills, `ccpi` CLI); VoltAgent/awesome-agent-skills (1,000+, cross-vendor Agent Skills spec); netresearch (agentskills.io portability standard); microsoft/amplifier (moved provider-agnostic) | — | Signal: distribution consolidating on marketplaces + cross-vendor Agent Skills spec; Microsoft winding down internal Claude Code licenses by 2026-06-30 (Forbes 2026-06-01) — consolidation pressure is real. |

---

## §2 ECC deep profile (the one to beat on distribution)

**What it is:** a curated static catalog + professional installer, NOT a generator. "This repo is the raw code only. The guides explain everything" — methodology lives in three off-repo X threads. Cross-harness adapters for ~11 tools (Claude Code native; Cursor via a hook adapter translating 20 Cursor events → 8 CC-format events so one `scripts/hooks/*.js` set serves both; Codex/OpenCode/Copilot/Gemini at documented degradation levels, with an honest parity matrix).

**Its distinctive mechanisms (full list in scan notes):**

1. **Instincts — decaying, confidence-scored, shareable learning units.** Markdown + frontmatter with Action/Evidence/Examples sections. Lifecycle: observation → pending instinct (30d TTL) → confidence scoring → `/promote` (project→global) or `/prune` → `/evolve` clusters instincts into full skills → `/instinct-export` for team sharing. Fed by Stop-hook session pattern-extraction, `/learn` mid-session, and git-history mining. **The single most novel primitive in the category** — learned knowledge is versioned, scoped, expiring, and portable, vs everyone else's append-only memory files.
2. **AgentShield** — security scanner for the AI-config layer itself (CLAUDE.md, settings.json, MCP configs, hooks, agents, skills): 1,282 tests, 102 static rules, secrets/permissions/hook-injection/MCP-risk/agent-review categories; `--opus` runs a red-team/blue-team/auditor 3-agent adversarial pipeline; outputs A–F letter grade; **exit code 2 on critical findings = CI build gate**; `scan --fix`; GitHub Action.
3. **Token economy as numbers, not advice:** `MAX_THINKING_TOKENS: 10000` ("~70% reduction in hidden thinking cost"); `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: 50`; subagent-model=haiku; strategic-compact skill (compact at logical breakpoints, never mid-implementation); "keep under 10 MCPs enabled and under 80 tools active."
4. **Install lifecycle engineering:** manifest-driven plan/apply installer, SQLite install-state store, `doctor`/`repair`/`uninstall --dry-run`, incremental updates, `npx ecc consult "<need>"` advisor. The long reset section exists because breakage without state tracking is common — the lesson is the state store, not the breakage.
5. **Machine-generated status handoff:** `ecc status --markdown --write status.md` renders readiness/sessions/health/pending-governance from a state store; `--exit-code` fails CI when readiness degrades.
6. **997 internal tests** — but they validate *plumbing* (packaging, hooks, manifests, catalog counts), not outcomes.

**Its proof posture:** strong engineering-correctness proof, **zero outcome proof**. Unattributed round-number claims ("~60% cost reduction", "80%+ of tasks"). No before/after benchmarks, no published eval of ECC itself.

**Its confirmed gaps (= kit's confirmed moats):** no project analysis/generation (per-project tailoring = "pick which prebuilt components to install"); no content-staleness mechanism (currency = one maintainer shipping weekly; acknowledged bus-factor); no decision-support layer (two micro decision-frameworks total); operator/business lane exists (investor-materials, market-research, content-engine…) but is skills-only, not methodology; self-documented fragility (duplicate-install footguns, fix/revert cycles #29/#52/#103, rules can't ship via plugin at all); 232-skill catalog is its own context-bloat liability; internal count inconsistencies within one README.

---

## §3 Cross-cutting findings

**(g) Eval/benchmark harnesses — the high ground is empty.** Exactly one statistically serious harness exists: **wshobson PluginEval** — 3 layers (deterministic static checks incl. portability lints; LLM judge with synthetic-prompt **triggering-F1** and anchored rubrics; Monte Carlo 50–100 runs with Wilson/bootstrap/Clopper-Pearson CIs), 10 weighted dimensions → composite × anti-pattern penalty → letter grades + Bronze–Platinum badges gated on score AND Elo, `--threshold` CI gate. **Limitation: it scores artifacts (skills/plugins), not whether a workflow improves real project outcomes.** Ruflo publishes infra benchmarks (cold start/RSS/latency vs LangGraph/AutoGen/CrewAI) with raw JSON — not quality. Superpowers embeds skill pressure-testing methodology — no numbers. SuperClaude asserts percentages with no methodology. **Nobody in the ecosystem publishes measured before/after validation of generated workflows on real projects.** The kit's N-run friction-report discipline (feedback/, ≥2-run promotion rule) is already the closest thing in existence; formalizing it into a reproducible harness would occupy an empty position.

**(h) Freshness/staleness — nobody re-validates content against upstream.** Best-in-class partials: spec-kit `self check`/`self upgrade` (CLI+template version freshness, dry-run, tag pinning); marketplace plugins inherit update flow (version freshness only); ericbuess/claude-code-docs mirrors Anthropic docs every few hours; claude-rules-doctor detects dead rules (`paths:` globs matching nothing → CI exit 1); agnix lints agent configs. **Nothing detects outdated knowledge** (model changes, deprecated guidance, upstream feature shifts). The kit's vigilance cadence (daily delta scan → weekly synthesis → monthly integration, dated claims, verified-date discipline) has **no analogue in the ecosystem** — it is a real moat, provided the stale-clone defect gets fixed (an ironic vulnerability: the unique organ has a chronic illness).

---

## §4 Kit positioning — confirmed moats and confirmed deficits

**Moats confirmed by this scan (no rival has any of the four):**
1. **Generation from project analysis** — every rival ships static catalogs or human-facilitated pipelines; none reads a codebase and synthesizes a bespoke workflow.
2. **Freshness discipline** (vigilance cadence + dated claims) — §3(h).
3. **Decision-engineering layer** (KB-04 locks/dispatch/architect-prompts + KB-05 conversational skills + anti-sycophancy) — nearest rival artifact is two micro decision-frameworks in ECC.
4. **Multidomain methodology** (docs-ops/brownfield-business repos, naming pack, design-elevation pack) — rivals are coding-SDLC-only; wshobson's business plugins and ECC's operator lane are thin skill collections, not methodology.

**Deficits confirmed by this scan (what "best in the world" still requires):**
1. **Distribution** — kit is a folder you drop into a repo. Winners are plugins/marketplaces/CLIs with self-upgrade (spec-kit `self upgrade`, superpowers auto-updating via official marketplace, ECC plan/apply+state store). No installer, no state, no update path = no public adoption ceiling at all.
2. **Outcome-proof harness** — the empty high ground (§3g). Friction reports are prose; nobody can re-run them.
3. **Learning-loop primitive** — kit has memory *hygiene* guidance; ECC has a learning *lifecycle* (instincts). The gap is real.
4. **Config-layer security audit** — kit audits MCP servers (registry postures, snyk-agent-scan) but nothing audits the generated workflow files themselves as an attack surface with a CI-gateable grade.
5. **Hand-written duplication across tools** — two parallel workflow docs vs ECC's single-source adapter architecture.
6. **Hand-written status/handoff** — HANDOFF.md demonstrably lags reality (observed again 2026-07-02); ECC generates status from state with an exit code.

---

## §5 Adoption candidates — triaged

Numbers continue the kit's convention: fast-path = mechanical, ships next patch; v0.17.0 = queued capability release; v0.18.0-H = the proof-harness release this scan argues for; KB-WS = knowledge-base workstream (monthly integration or dedicated session).

| # | Mechanism (source) | Kit home | Triage |
|---|---|---|---|
| A1 | Least-privilege tool matrix per agent role — read-only reviewers get `Read/Grep/Glob` only (VoltAgent) | `templates/cursor/agents/*`, `templates/claude-code/agents/*` (v0.17.0 artifact) | **fast-path** — encode into templates as defaults |
| A2 | Numeric token-economy defaults: MAX_THINKING_TOKENS, autocompact-PCT, subagent-model, <10 MCP/<80 tools ceilings, compact-at-breakpoints doctrine (ECC) | `templates/claude-code/settings.json` (already queued v0.17.0 checklist-§11), WORKFLOW-CLAUDE-CODE, KB-01 token-economics | **fast-path** into the queued settings.json artifact + doc paragraphs |
| A3 | Dead-rule lint: detect rules whose `paths:` globs match nothing; CI exit-1 (claude-rules-doctor); agent-config lint (agnix) | `generator/VALIDATION_CHECKLIST.md`, `prompts/dispatch/WORKFLOW_HEALTH_AUDIT.md`, MCP-SERVER-REGISTRY adjacent-tools note | **fast-path** — one checklist item + one audit step |
| A4 | Wayfinder skill — "what's next" navigator over the generated workflow (BMAD `bmad-help`) | new template `templates/skills/` or claude-code command; generator wires it | **v0.17.0** — small, high UX value for generated projects |
| A5 | Install manifest + state: generator writes a manifest (files, versions, hashes) enabling diff/upgrade/repair/uninstall (ECC plan/apply + spec-kit self-upgrade) | upgrade/audit mode (already v0.17.0 scope) — this is the missing mechanism that makes upgrade mode *real* | **v0.17.0** — promote to the spine of upgrade mode |
| A6 | Machine-generated HANDOFF/status from repo state, with exit-code degradation signal (ECC `status --markdown --exit-code`) | new `templates/claude-code/commands/status.md` + kit's own HANDOFF discipline | **v0.17.0** — also fixes the kit's own chronic HANDOFF lag |
| A7 | Layered template resolution: project overrides > presets > extensions > core (spec-kit) | `generator/presets/` architecture + PROJECT_SETUP_PROMPT precedence rules | **v0.17.0** — formalize precedence (currently implicit) |
| A8 | Artifact-quality gates: checklist-generation for generated docs, "unit tests for English" + cross-artifact consistency pass (spec-kit `/speckit.checklist`, `/speckit.analyze`) | VALIDATION_CHECKLIST + generator Phase-final verification | **v0.17.0** — merge into checklist upgrade |
| A9 | **Statistical artifact harness: triggering-F1, Monte-Carlo activation with Wilson CI, anti-pattern penalties, letter grades, `--threshold` CI gate (wshobson PluginEval — study its docs before designing)** | new `harness/` — score kit-generated skills/rules/agents | **v0.18.0-H layer 1** |
| A10 | **End-to-end outcome benchmark: fixed reference repos (greenfield/brownfield-code/brownfield-docs) + rubric scoring + reproducibility spec — formalizes the friction-report discipline; NOBODY has this** | new `harness/` + `feedback/` promotion rules | **v0.18.0-H layer 2 — the differentiator** |
| A11 | Instinct-style learning lifecycle: pending → confidence → TTL → promote/prune → cluster-into-skills → import/export (ECC continuous-learning v2) | KB-01 §3.7 memory-hygiene workstream (queued) — upgrade from hygiene to lifecycle; + a `templates/skills/` continuous-learning skill | **KB-WS** — design against KB-06 §5 memory canon first |
| A12 | Config-layer security audit of generated workflow files (CLAUDE.md/settings/hooks/agents/MCP) with A–F grade + exit-code CI gate + red/blue/auditor adversarial mode (ECC AgentShield) | security-auditor agent template + VALIDATION_CHECKLIST §security + WORKFLOW_HEALTH_AUDIT; aligns with kit's existing step-④ adversarial-verification doctrine | **KB-WS** — spec in a monthly integration, ship template v0.18.0 |
| A13 | Single-source cross-tool architecture: shared core + per-tool adapters (ECC's Cursor 20→8 hook-event adapter) instead of two hand-written workflow docs | KB-02 architecture section + long-term restructure of `workflows/` | **KB-WS** — doctrine first, restructure later |
| A14 | Subagent-per-task + two-stage review (spec compliance, then quality); plans written for "an enthusiastic junior engineer" (superpowers) | KB-04 §4.7 orchestration + KB-02 planning guidance | **KB-WS** — fold at next monthly integration |
| A15 | Auto-trigger description engineering — skills fire from initial instructions without user invocation; meta-skill for writing+pressure-testing skills (superpowers `writing-skills`) | KB-02 skill-authoring guidance + templates/skills descriptions sweep | **KB-WS** |
| A16 | Two-tier output: minimal vs full workflow profiles at generation time (Ruflo lite-plugin vs full; ECC minimal/core/full profiles) | PROJECT_SETUP_PROMPT tiering (Starter/Advanced exists — add explicit minimal profile) | **watch** — validate demand via next friction reports first |
| A17 | Web-bundle cost arbitrage: run heavy planning on flat-rate web LLMs, implement in metered IDE (BMAD) | CLAUDE-SURFACE-ROUTING note | **watch** — one paragraph at monthly integration |
| A18 | STATUS.md "what currently works" honesty doc + `verify` cryptographic install verification (Ruflo) | overlaps A6; crypto-verify premature | **watch** |

**Watchlist adds (vigilance):** Claude Code native **Workflow tool** (`.claude/workflows/*.js`, deterministic multi-agent scripts — check kit coverage at next monthly integration) and **Agent Teams** re-platforming; cross-vendor **Agent Skills spec** (agentskills.io); ericbuess/claude-code-docs (3-hourly Anthropic-docs mirror — candidate Tier-2 source); claudemarketplaces.com (21,600+ skills, daily refresh); PluginEval evolution.

---

## §6 Strategic implications for the public release

1. **Distribution is now the entry ticket, not a nice-to-have.** 2026's winners are marketplace plugins (superpowers via official Anthropic marketplace), first-party CLIs with self-upgrade (spec-kit), or installer+state systems (ECC). A public kit that is "a folder you clone" will not compete regardless of content quality. Target form: plugin/marketplace packaging for the skills+commands layer, generator as a dispatch prompt (current form) plus an install manifest (A5) for upgradeability.
2. **Positioning writes itself from §4:** every rival is a *catalog* or a *pipeline*; the kit is a *generator with a freshness organ, a decision layer, and (post-v0.18.0-H) measured outcomes*. The scan found zero occupants of that quadrant.
3. **Proof beats stars at entry.** The kit cannot out-star 171K overnight; it can be the only project whose README opens with reproducible measured results (A9+A10). SuperClaude's unmeasured "2-3x faster" is the cautionary anti-example; PluginEval's existence proves the audience values statistical rigor.
4. **Licensing/naming:** MIT everywhere among winners; avoid CC BY-NC-ND (blocks reuse — awesome-claude-code's mistake). Brand churn is costly (claude-flow→Ruflo rename; ECC's three identifiers) — pick one name once (KB-07 pipeline exists for exactly this).
5. **Single-maintainer bus-factor is the ecosystem's shared disease** (ECC ships weekly on one person; awesome-list stalls a month). The kit's vigilance routines are the structural answer — automation as co-maintainer — one more reason the stale-clone defect must die before going public.
6. **Scrub gate before publication** (standing lock): case-studies/, project-named prompts and feedback files, vigilance feeds with personal data, HANDOFF history. Automated grep-based scrub checklist, not manual review.

---

## Sources

- ECC: https://github.com/affaan-m/everything-claude-code (README v2.0.0-rc.1 read in full) · https://www.star-history.com/affaan-m/everything-claude-code/ · https://www.augmentcode.com/learn/everything-claude-code-github-stars
- spec-kit: https://github.com/github/spec-kit · https://github.github.io/spec-kit/
- superpowers: https://github.com/obra/superpowers · https://blog.fsck.com/2025/10/09/superpowers/
- Ruflo: https://github.com/ruvnet/claude-flow · benchmarks gist: https://gist.github.com/ruvnet/298f8c668c8859b369f91734a0e9cbbe
- BMAD: https://github.com/bmad-code-org/BMAD-METHOD · https://docs.bmad-method.org
- awesome-claude-code: https://github.com/hesreallyhim/awesome-claude-code
- wshobson/agents + PluginEval: https://github.com/wshobson/agents · https://raw.githubusercontent.com/wshobson/agents/main/docs/plugin-eval.md
- SuperClaude: https://github.com/SuperClaude-Org/SuperClaude_Framework
- VoltAgent: https://github.com/VoltAgent/awesome-claude-code-subagents · https://github.com/VoltAgent/awesome-agent-skills
- Linters: https://github.com/agent-sh/agnix · https://github.com/nulone/claude-rules-doctor
- Misc: https://github.com/microsoft/amplifier · https://www.forbes.com/sites/jonmarkman/2026/06/01/microsoft-ends-claude-code-licenses-as-it-pushes-copilot-cli/ · https://github.com/jeremylongshore/claude-code-plugins-plus-skills · https://claudemarketplaces.com/
