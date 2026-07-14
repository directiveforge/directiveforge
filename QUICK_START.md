# DirectiveForge — Quick Start

**What this does**: drops production-grade AI-assisted development discipline into any codebase. A single generator-prompt session reads the kit's knowledge base, classifies your project's maturity tier, and installs the right surface area — from baseline rules + skills + MCP scaffolding (Starter) all the way to decision-engineering skills + vigilance discipline + surface routing + mission-dispatch pattern (Advanced).

**Time & cost:** two measurement bases, both published. The three recorded baseline runs took **~18–21 minutes / ~270–330k tokens** on the harness's internal generation clock (`harness/results/2026-07-03-baseline/`); one clean end-to-end run measured **27m28s wall-clock / ~367k tokens** including orchestration overhead the internal clock never sees (`feedback/2026-07-13-uxd5-clean-run-timing.md`, n=1). Budget for the wall-clock figure; larger repos can take longer. Few questions: the recorded runs needed zero live questions (the project profile was answered up front) — expect roughly one if your repo is ambiguous. Every file written is listed in the run report and the manifest.

**Requirements**: Cursor or Claude Code with file-system access to both this kit and the target project. For Advanced-tier features (Claude Code Routines for vigilance discipline), Pro/Max/Team/Enterprise plan.

---

## Step 0 — fastest path (plugin)

Want the measured skills and workflow commands in seconds, without running the generator? Install the plugin:

```bash
claude plugin marketplace add directiveforge/directiveforge
claude plugin install directiveforge
```

This ships the 22 measured skills (decision / naming / design packs) and the workflow commands — including `/report-friction` (invoked as `/directiveforge:report-friction`). Both skills and commands are namespaced under `/directiveforge:` — the skills self-trigger on the right prompts, and commands are typed with the namespace prefix. Add `--scope project` to `claude plugin install` to commit the plugin reference into the repo and share it with a team.

Working from a local clone instead of GitHub? The marketplace add accepts a path: `claude plugin marketplace add /path/to/directiveforge`.

**If the plugin is all you wanted, you are done — stop here.** The plugin is the skills-and-commands layer only. For the full per-project workflow — rules, agents, the decision-skill router, the install manifest — continue with the generator below (Steps 1-3).

## Step 1: Clone or reference the kit

```bash
git clone https://github.com/directiveforge/directiveforge.git ~/Documents/GitHub/AI
```

Or if already cloned, note the path (e.g., `~/Documents/GitHub/AI` or `~/Projects/AI`).

## Step 2: Open the target project

```bash
cd /path/to/your/project
claude   # or: cursor .
```

While that session opens — the contract for the run you are about to start (the generator prints this same block, scope filled in, as its first output):

<!-- DF-RUN-CONTRACT v1 — keep this block byte-identical across generator/PROJECT_SETUP_PROMPT.md, QUICK_START.md, README.md (drift is a defect: extract between the sentinel comments and hash) -->
**What this run does**

- **Time & tokens:** two measurement bases, both published — ~18–21 min / ~270–330k tokens on the harness's internal clock (`harness/results/2026-07-03-baseline/`, n=3); one clean end-to-end run measured 27m28s wall-clock / ~367k tokens including orchestration overhead (`feedback/2026-07-13-uxd5-clean-run-timing.md`, n=1). Budget for the wall-clock figure; larger repos take longer.
- **Writes:** 29–44 files in the recorded runs, tier- and scope-dependent — context docs, rules, skills, agents, commands, MCP config, decision ledger — every one listed in `.ai-kit-manifest.json`.
- **Questions:** at most 1 in a typical run; conditional pack proposals appear only when your repo triggers them.
- **Building for:** `<detected scope>` (detected: `<evidence>`). Reply "both" or "cursor" to change — the veto stays open until Phase 3 generation starts.
- **First artifact:** the codebase brief (`docs/AI-WORKFLOW-BRIEF.md`) lands as soon as Phase 1 analysis completes — early in the run, and it stands alone if you stop there.
- **Resume:** if the session dies, paste the same prompt again — the `.df-setup-state.json` checkpoint offers resume-from-where-it-stopped or a clean restart. A resumed run re-reads context, so it costs more than the single-pass figures above.
- **Uninstall:** `.ai-kit-manifest.json` maps everything the kit wrote; removal recipe in `QUICK_START.md` § Uninstall.
- **Abort any time.** Until the Phase 1 brief, the only writes are the checkpoint file and — in revival runs only (Phase 0.5 gate) — `OWNER_BRIEF.md` (+ `docs/REVIVAL-ASSESSMENT.md`). Everything written so far is always listed in the checkpoint.
<!-- /DF-RUN-CONTRACT v1 -->

Built for one IDE and adopting the other later? Adding the second surface is a supported recipe: `workflows/MIGRATION-CURSOR-CLAUDE.md`.

## Step 3: Paste this prompt

Copy everything below the line and paste as the first message of a fresh session:

---

You are about to set up a production-grade AI workflow for this project. Before writing a single file, you study the kit, classify this project's maturity tier, and install the right surface area — no more, no less.

**Phase 0: Read the kit**

Read these files from the DirectiveForge kit at `~/Documents/GitHub/AI` (adjust path if cloned elsewhere):

1. `~/Documents/GitHub/AI/generator/PROJECT_SETUP_PROMPT.md` — your MASTER INSTRUCTION. Read it fully. It has 14 phases — numbered 0-9 with half-steps 0.5, 2.5, 4.5 and 8.5 — that you MUST follow in order.
2. Set `{{KIT_PATH}}` = `~/Documents/GitHub/AI`.
3. Follow every phase in `PROJECT_SETUP_PROMPT.md` exactly.

**Critical rules**:

- Read the knowledge base BEFORE generating anything — it contains token budgets, format standards, anti-hallucination patterns, and the maturity-tier heuristics that drive what gets installed.
- NEVER invent file formats — use the templates in `~/Documents/GitHub/AI/templates/`.
- NEVER exceed CLAUDE.md 150 lines or base.mdc 30 content lines.
- NEVER put secrets in any generated file.
- ALWAYS verify package versions, file paths, and commands against the actual codebase.
- Each fact in exactly one place — no duplication between CLAUDE.md and AGENTS.md.
- Maturity-tier classification (Phase 1.6) drives every subsequent install decision. Get it right before generating.

**After completing all phases**, run the validation checklist at `~/Documents/GitHub/AI/generator/VALIDATION_CHECKLIST.md` and report the results.

Start now. Begin with Phase 0.

---

## If a run fails

Three realistic failure modes, one-line recoveries — all rest on the checkpoint file the generator appends after every phase (`.df-setup-state.json` at the project root, deleted on successful completion):

1. **Session died mid-run** (window closed, laptop slept, context exhausted): open a fresh session in the same directory, paste the same prompt — the generator detects the checkpoint and offers resume-from-where-it-stopped (it re-reads what it already wrote; it never regenerates it).
2. **Rate limit / model unavailable**: wait it out or switch models, then resume as above. For unattended resilience, declare a `fallbackModel` chain before long runs — pin a model class + chain, never a single ID (doctrine: `workflows/WORKFLOW-CLAUDE-CODE.md`, resilience lever).
3. **You aborted deliberately**: everything written so far is listed in the checkpoint. Re-paste the prompt and pick **clean restart** to have it removed — or keep `docs/AI-WORKFLOW-BRIEF.md`; the Phase 1 brief stands alone.

## What You Get (by maturity tier)

The generator's Phase 1.6 classifies the project into one of three tiers based on team size, age, deployment status, and operator intent. Each tier installs a different surface area — full feature map at `workflows/KIT-INSTALL-PIPELINE.md`.

### Starter — minimum viable kit

For solo developers, side projects, pre-MVP work. Install:

| File | Purpose |
|---|---|
| `CLAUDE.md` | Claude Code primary context (≤150 lines) — architecture, commands, pitfalls |
| `AGENTS.md` | Universal context for all AI tools — stack, structure, constraints |
| `DECISIONS.md` (Tier 1) | Lightweight 1-liner-per-entry decision ledger |
| `.cursor/rules/*.mdc` | Domain-specific rules (frontend, API, database, testing) |
| `.cursor/skills/*.SKILL.md` | Multi-step procedures (debug, deployment, migration, refactor) |
| `.cursor/agents/*.md` | Specialized review agents (reviewer, tester, optional SEO/i18n/security) |
| `.claude/skills/decision/{pre-mortem,steelman,confidence-calibration,reversibility-check,anti-sycophancy-meta}/SKILL.md` | 5 BLOCKER conversational decision skills from KB-05 |
| `.claude/rules/decision-skills.md` | Router rule documenting when each skill fires |
| `.cursor/mcp.json` + `.mcp.json` | MCP servers (auto-discovered from dependencies) |
| `.claude/commands/*.md` | Slash commands (/review-pr, /deploy, /update-context, /discover-mcp, /security-review, /tech-debt) |
| `.cursorignore` + `.cursorindexingignore` | Secret hiding + junk indexing prevention |

### Intermediate — production discipline

For multi-developer projects with production deployments and multi-month roadmaps. Starter + adds:

| Additional file | Purpose |
|---|---|
| `DECISIONS.md` (Tier 2) | Adds reversal triggers + re-verification cadence per entry |
| `docs/prompts/ARCHITECT_PROMPT.template.md` | 14-section IMPL prompt template for major implementation phases |
| `.claude/skills/{research-prompt-writer,research-synthesizer}/SKILL.md` | KB-04 research engineering skills (Layer 1 input filter + Layer 2/3 synthesis) |
| `.claude/skills/decision/{inversion,second-order-thinking,disconfirming-evidence-first}/SKILL.md` | 3 additional HIGH decision skills |
| `.claude/rules/{orchestrator-dispatch,research}.md` | KB-04 orchestration + 3-layer research methodology rules |
| Updated `.claude/rules/decision-skills.md` | Router rule expanded with HIGH-skill phrase mappings |
| `.claude/rules/ai-workflow.md` (after Phase 4.5 Cowork handoff) | Per-project surface routing (Chat / Cowork / Code) |

### Advanced — full discipline + self-improvement

For multi-team projects with strategic stakes, external auditors, multi-orchestrator research tracks. Intermediate + adds:

| Additional file | Purpose |
|---|---|
| `DECISIONS.md` (Tier 3) | Full discipline — TL;DR + Master Synthesis 400w + reversal + re-verify + cross-DECISIONS reconciliation |
| `.claude/skills/decision/{10-10-10,cost-of-inaction,bayesian-update}/SKILL.md` | 3 MEDIUM decision skills |
| `.claude/skills/decision/council-3-voice/SKILL.md` | Multi-agent council (gated; 15× tokens; Max+ plan only) |
| Updated `.claude/rules/decision-skills.md` | Router rule expanded with MEDIUM-skill mappings + council cost gate |
| `vigilance/WATCHLIST.md` + `vigilance/feed/` + 3 dispatch prompts | Self-improvement discipline (opt-in via Phase 7) |
| `prompts/chat-research-missions.md` + `prompts/code-handoff-prompts.md` + `prompts/cowork-browser-operations.md` + `prompts/dispatch/` + `research/` | Mission-dispatch pattern (opt-in via Phase 8) |
| 3 Claude Code Routines on `claude.ai/code/scheduled` | Daily Pulse + Weekly Synthesis + Monthly Integration (operator-registered after Phase 7) |

## Maintaining It

After the initial setup:

- **After code changes**: tell the agent "update context" or "sync rules" — it should update affected files.
- **After research**: tell the agent "integrate this research into context" with your research document.
- **When switching tools**: tell the agent "create a handoff to [Cursor/Claude Code]" for cross-tool continuity.
- **Periodically**: run the validation checklist (`VALIDATION_CHECKLIST.md`) to catch drift.
- **For Advanced-tier projects with vigilance**: read each Sunday's weekly-synthesis output; review each monthly integration manifest; run the quarterly watchlist audit per the template in `vigilance/WATCHLIST.md`.
- **On Anthropic releases (every 2-4 weeks)**: re-verify per KB-05 §16 re-verification schedule; expect the vigilance discipline to surface drift candidates automatically.

## Upgrading the Kit

The kit at `github.com/directiveforge/directiveforge` evolves continuously. To keep your target project's installed surface in sync:

1. `git pull` the kit periodically (monthly recommended).
2. Read the kit's CHANGELOG entry for new versions.
3. Identify which kit surface layers your project uses (per its tier).
4. For each layer that changed, re-run the relevant generator phase OR manually port the diff into your project.

An Advanced-tier project typically spends ~30 min/quarter absorbing kit updates. The vigilance discipline catches most of the load-bearing changes automatically.

## Uninstall

The install manifest is the uninstall map — every file the kit wrote is listed in `.ai-kit-manifest.json` at your project root.

1. Entries with `owner_customized: false` AND `disposition: created` — delete the file.
2. Entries with `disposition: merged-existing` / `kept-existing`, or `owner_customized: true` — review before touching: they carry your content or your edits (`PRE-EXISTING-MODIFIED.txt` and the `docs/archive/` backups from install/upgrade time show what changed).
3. Delete `.ai-kit-manifest.json` LAST — while it exists, it still correctly describes what remains.
4. Installed the plugin instead of (or alongside) the generator? `claude plugin uninstall directiveforge`.

**What uninstall does NOT touch:** your own files (anything absent from the manifest), your git history, and pre-existing files the kit merged into — those get a review, never a blind delete. For a planned, adjudicated removal run, see `generator/UPGRADE_MODE.md` §9.

## Advanced topics

- **Per-project skills + agents**: the generator creates the foundation. For project-specific needs, ask the agent to create additional skills (`.claude/skills/<name>/SKILL.md` or `.cursor/skills/<name>.SKILL.md`) or agents (`.cursor/agents/<name>.md`) following the patterns in `~/Documents/GitHub/AI/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §3 (skills) and §4 (agents).
- **Project-scale decisions**: when a call needs multi-dossier research + an architect prompt + a locked DECISIONS.md entry, follow the discipline in `~/Documents/GitHub/AI/knowledge-base/KB-04-DECISION-ENGINEERING.md`.
- **Conversational decisions**: when a user asks "is this a good idea?" the installed decision skills (KB-05) handle it. Router rule at `.claude/rules/decision-skills.md` tells the agent which skill fires when.
- **Surface routing**: the per-project `.claude/rules/ai-workflow.md` (Intermediate+) maps your project's recurring tasks to Chat / Cowork / Code. See `~/Documents/GitHub/AI/knowledge-base/CLAUDE-SURFACE-ROUTING.md` for the global rubric.
- **Worked examples**: a fully-instantiated kit install for a production e-commerce project lives at `~/Documents/GitHub/AI/the private lab's worked instance (not shipped)` — useful as a reference for what an Advanced-tier install looks like in production.

## Cross-references

- `workflows/KIT-INSTALL-PIPELINE.md` — full feature map + tier-selection guide + maintenance cadence (the planning companion to this quick-start)
- `generator/PROJECT_SETUP_PROMPT.md` — the master generator prompt (14 phases: 0-9 + half-steps 0.5, 2.5, 4.5, 8.5)
- `generator/VALIDATION_CHECKLIST.md` — post-install verification (§0-§23)
- All 6 KB docs in `knowledge-base/`
- `workflows/KIT-VIGILANCE.md` — vigilance discipline doctrine
- `workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md` — per-surface routing behavior
