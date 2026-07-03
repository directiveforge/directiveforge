# DirectiveForge — Quick Start

**What this does**: drops production-grade AI-assisted development discipline into any codebase. A single generator-prompt session reads the kit's knowledge base, classifies your project's maturity tier, and installs the right surface area — from baseline rules + skills + MCP scaffolding (Starter) all the way to decision-engineering skills + vigilance discipline + surface routing + mission-dispatch pattern (Advanced).

**Time**: 15-45 minutes depending on project size + tier. Starter ≈ 15 min. Intermediate ≈ 25 min. Advanced ≈ 40-45 min including optional opt-ins.

**Requirements**: Cursor or Claude Code with file-system access to both this kit and the target project. For Advanced-tier features (Claude Code Routines for vigilance discipline), Pro/Max/Team/Enterprise plan.

---

## Step 0 — fastest path (plugin)

Want the measured skills and workflow commands in seconds, without running the generator? Install the plugin:

```bash
claude plugin marketplace add directiveforge/directiveforge
claude plugin install directiveforge
```

This ships the 22 measured skills (decision / naming / design packs) and the workflow commands — including `/report-friction`. Skills are namespaced `/directiveforge:<skill>` and self-trigger on the right prompts. Add `--scope project` to `claude plugin install` to commit the plugin reference into the repo and share it with a team.

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

## Step 3: Paste this prompt

Copy everything below the line and paste as the first message of a fresh session:

---

You are about to set up a production-grade AI workflow for this project. Before writing a single file, you study the kit, classify this project's maturity tier, and install the right surface area — no more, no less.

**Phase 0: Read the kit**

Read these files from the DirectiveForge kit at `~/Documents/GitHub/AI` (adjust path if cloned elsewhere):

1. `~/Documents/GitHub/AI/generator/PROJECT_SETUP_PROMPT.md` — your MASTER INSTRUCTION. Read it fully. It has 9 phases (0-8 + summary) that you MUST follow in order.
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

## Advanced topics

- **Per-project skills + agents**: the generator creates the foundation. For project-specific needs, ask the agent to create additional skills (`.claude/skills/<name>/SKILL.md` or `.cursor/skills/<name>.SKILL.md`) or agents (`.cursor/agents/<name>.md`) following the patterns in `~/Documents/GitHub/AI/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §3 (skills) and §4 (agents).
- **Project-scale decisions**: when a call needs multi-dossier research + an architect prompt + a locked DECISIONS.md entry, follow the discipline in `~/Documents/GitHub/AI/knowledge-base/KB-04-DECISION-ENGINEERING.md`.
- **Conversational decisions**: when a user asks "is this a good idea?" the installed decision skills (KB-05) handle it. Router rule at `.claude/rules/decision-skills.md` tells the agent which skill fires when.
- **Surface routing**: the per-project `.claude/rules/ai-workflow.md` (Intermediate+) maps your project's recurring tasks to Chat / Cowork / Code. See `~/Documents/GitHub/AI/knowledge-base/CLAUDE-SURFACE-ROUTING.md` for the global rubric.
- **Worked examples**: a fully-instantiated kit install for a production e-commerce project lives at `~/Documents/GitHub/AI/the private lab's worked instance (not shipped)` — useful as a reference for what an Advanced-tier install looks like in production.

## Cross-references

- `workflows/KIT-INSTALL-PIPELINE.md` — full feature map + tier-selection guide + maintenance cadence (the planning companion to this quick-start)
- `generator/PROJECT_SETUP_PROMPT.md` — the master generator prompt (9 phases)
- `generator/VALIDATION_CHECKLIST.md` — post-install verification (11 categories)
- All 6 KB docs in `knowledge-base/`
- `workflows/KIT-VIGILANCE.md` — vigilance discipline doctrine
- `workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md` — per-surface routing behavior
