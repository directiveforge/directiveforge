# DirectiveForge

## What This Repo Is

A portable knowledge base and generator for building production-grade AI-assisted development workflows. You drop this into any project, run the setup prompt, and an agent builds a complete, project-specific AI workflow (rules, skills, agents, MCP, memory) tailored to that project's stack, codebase, and conventions.

## Repo Structure

```
AI/  (public name: DirectiveForge — NAMING-DECISION.md)
├── CLAUDE.md                 ← You are here (agent working context)
├── README.md                 ← Public-facing: hero delta table, quickstart, limitations
├── CHANGELOG.md              ← Version history and roadmap
├── LICENSE                   ← MIT (since v0.20.0)
├── NAMING-DECISION.md        ← The evidence-scored name decision + one-name scope
├── .claude-plugin/           ← plugin.json + marketplace.json (one-command install)
├── plugin/commands/          ← plugin-packaged commands (report-friction, status, workflow-help)
├── .github/ISSUE_TEMPLATE/   ← friction-report issue form (feedback taxonomy)
├── scripts/                  ← scrub-check.py + build-snapshot.sh + verify-transform.sh + scrub-allowlist.txt (ships)
├── launch/                   ← PRIVATE launch ops (never ships): W0 plan, snapshot manifest+lists, materials, checklist, stage/, private/ (operator-held patterns+sed map, gitignored)
├── knowledge-base/
│   ├── KB-01-AI-WORKFLOW-ENGINEERING.md   # HOW: techniques, patterns, tools (969 lines)
│   ├── KB-02-AI-PROJECT-INFRASTRUCTURE.md # WHAT: architecture, templates, blueprints (1300 lines)
│   ├── KB-03-CATALOG-PIPELINE-ARCHITECTURE.md # DATA: multi-source catalog pipeline patterns
│   ├── KB-04-DECISION-ENGINEERING.md      # DECISIONS: locks, 3-layer research, dispatch, architect prompts
│   ├── KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md  # CONVERSATIONAL: 12 decision skills, hybrid router, 3-voice council, anti-sycophancy
│   ├── KB-06-MANAGED-AGENTS.md           # AGENT-ORG: hosted agents (beta-bounded), scheduled-work routing, containment doctrine, field evidence
│   ├── KB-07-BRAND-NAMING.md             # OPTIONAL PACK: naming pipeline (gen → screen → TM → domains → score); conditional like KB-03
│   ├── KB-08-DESIGN-ELEVATION-ENGINEERING.md  # OPTIONAL PACK: design quality is engineered — establish-concept → decision-spine → adversarial-elevation → VERIFY-BY-MEASUREMENT; conditional (frontend/design/UX projects)
│   └── MCP-SERVER-REGISTRY.md            # Curated MCP servers with security postures
├── workflows/
│   ├── WORKFLOW-CURSOR.md                 # Complete Cursor IDE workflow
│   ├── WORKFLOW-CLAUDE-CODE.md            # Complete Claude Code workflow
│   ├── MIGRATION-CURSOR-CLAUDE.md         # Cursor↔Claude migration recipe (both directions)
│   ├── CROSS-SURFACE-ROUTING-BEHAVIOR.md  # Proactive reroute behavior spec
│   ├── KIT-INSTALL-PIPELINE.md            # Install pipeline
│   └── KIT-VIGILANCE.md                   # Vigilance cadence (daily/weekly/monthly)
├── generator/
│   ├── PROJECT_SETUP_PROMPT.md            # Master prompt — drop into any project
│   ├── UPGRADE_MODE.md                    # Kit-aware upgrade planner (manifest-driven, dry-run default)
│   ├── VALIDATION_CHECKLIST.md            # Post-generation verification checklist (17 sections)
│   └── presets/                           # Stack-specific generator additions
│       ├── nextjs.md                      # Next.js App Router (+ content-first/headless variant)
│       ├── nextjs-pages.md                # Next.js Pages Router (anti-App-Router-hallucination)
│       ├── fastapi.md                     # FastAPI + Pydantic v2 patterns
│       ├── general-node.md               # Express/Fastify patterns
│       └── docs-ops.md                    # Markdown-first no-manifest repos (doc-lint gates)
├── templates/                             # Copy-ready templates with {{PLACEHOLDER}} syntax
│   ├── cursor/rules/                      # 7 templates: base, react, vue, api, database, testing, quality-gates
│   ├── cursor/skills/                     # 6 templates: deployment, migration, debug, refactor, research-*
│   ├── cursor/agents/                     # 5 templates: reviewer, tester, seo-auditor, i18n-validator, security-auditor
│   ├── cursor/.cursorindexingignore.template  # Prevents junk indexing
│   ├── cursor/.cursorignore.template          # Hides secrets from context
│   ├── cursor/mcp.json.template               # Strict JSON (annotations live in the companion doc)
│   ├── claude-code/                       # CLAUDE.md, 8 commands, 4 rules, 5 agents, settings.json, mcp.json
│   ├── shared/                            # AGENTS.md, DECISIONS.md, HANDOFF.md, ARCHITECT_PROMPT, ai-kit-manifest.json, mcp-annotations, DESIGN-SPINE templates
│   └── skills/                            # decision/ (12 KB-05) + naming/ (6 KB-07) + design/ (4 KB-08) — optional packs
├── feedback/                              # Lessons learned from real-project usage + inbound /report-friction issues
│   ├── README.md                          # How to record and incorporate feedback (incl. inbound GitHub-issue wiring)
│   └── DISPOSITIONS-v0.2x.0.md            # Release-close accounting per release (latest: v0.20.0 — launch rows, W5 findings, deviations D1-D10)
├── harness/                               # Proof harness — measure the generator, don't claim
│   ├── HARNESS-SPEC.md                    # Pre-registered metrics (L1 artifact-level + L2 generator benchmark)
│   ├── layer1/                            # Artifact-level scoring: static-checks, judge-rubrics, repeatability
│   ├── layer2/                            # End-to-end generator benchmark protocol on synthetic fixtures
│   ├── fixtures/                          # Synthetic targets: greenfield-next, brownfield-api, brownfield-docs
│   ├── runner/                            # Workflow scripts: frozen baseline runners + parameterized batched delta runners (l1-delta, l2-delta)
│   └── results/                           # Dated scorecards (2026-07-03-baseline; 2026-07-03-delta + DELTA.md — the measured F→fixed story)
├── case-studies/                          # Project-specific worked instances (multidomain lock keeps them here)
├── vigilance/                             # Cadence feeds (daily/weekly/monthly)
├── research/                              # Raw research + dated dossiers (read only when KB docs lack detail)
└── prompts/                               # Research prompts + dispatch/ (runnable mission instances)
```

## Key Files You Need to Know

| Need | Read |
|------|------|
| Understanding techniques (context, memory, RAG, prompts, hallucination, MCP) | `knowledge-base/KB-01-*` |
| Understanding architecture (rules, skills, agents, blueprints, templates) | `knowledge-base/KB-02-*` |
| Building a multi-source catalog pipeline (scraping + Wikidata + media + i18n) | `knowledge-base/KB-03-*` |
| Locking strategic decisions, running multi-prompt research orchestrators, writing architect prompts | `knowledge-base/KB-04-*` |
| Pressure-testing a user's call in a single conversational turn — pre-mortem, steelman, calibration, reversibility, council, anti-sycophancy | `knowledge-base/KB-05-*` |
| Evaluating/routing/securing hosted autonomous agents — Managed Agents primitives (beta), scheduled-work three-way routing, hosted-agent containment + economics | `knowledge-base/KB-06-*` |
| Naming or renaming a brand/product — generation → linguistic/TM/domain screening → scoring (OPTIONAL pack, conditional install) | `knowledge-base/KB-07-*` + `templates/skills/naming/` |
| Building/elevating a frontend design concept — establish a singular concept → codify a decision-spine (teach the logic, decide-don't-copy) → adversarial elevation → **verify by measurement, not assertion** (OPTIONAL pack, conditional install) | `knowledge-base/KB-08-*` + `templates/skills/design/` |
| MCP server selection and security postures | `knowledge-base/MCP-SERVER-REGISTRY.md` |
| Upgrading a kit-generated project to the current kit (manifest diff, keep/upgrade/adjudicate) | `generator/UPGRADE_MODE.md` |
| Migrating a workflow between Cursor and Claude Code (either direction) | `workflows/MIGRATION-CURSOR-CLAUDE.md` |
| Cursor-specific setup and workflow | `workflows/WORKFLOW-CURSOR.md` |
| Claude Code-specific setup and workflow | `workflows/WORKFLOW-CLAUDE-CODE.md` |
| Copy-ready template files | `templates/` |
| Stack-specific generator additions | `generator/presets/` |
| Post-generation verification | `generator/VALIDATION_CHECKLIST.md` |
| Measuring generator/artifact quality — reproducible scorecards (pre-registered spec, honest numbers) | `harness/HARNESS-SPEC.md` + `harness/RUNBOOK.md` |
| Raw research for edge-case details | `research/` (read only when KB docs lack detail) |

## The Mission (Completed v0.3.0)

~~Build `generator/PROJECT_SETUP_PROMPT.md`~~ — Done. The next phase is real-project validation.

The generator prompt:

1. An agent reads alongside this knowledge base
2. Analyzes the target project (codebase, stack, dependencies, conventions, branding)
3. Generates a complete AI workflow: CLAUDE.md, .cursor/rules/*.mdc, .cursor/skills/, .cursor/agents/, .mcp.json, AGENTS.md, .claude/commands/, .claude/rules/
4. Every generated file is informed by the state-of-the-art patterns in our knowledge base
5. Result: project gets clock-accurate, cost-effective, professional AI-assisted development from day one

## Working on This Repo

- This is a knowledge engineering project, not a software project
- Quality = precision of information × actionability of output
- Every file must earn its place — no filler, no redundancy
- The knowledge base (KB-01, KB-02) is the foundation — all other files depend on it
- Templates encode KB patterns — verify against source sections before modifying
- Research files are source material — stay in research/ for reference, not for editing
- Feedback from real-project usage goes in `feedback/` — see `feedback/README.md`

## Commands

```bash
# Count total knowledge base
wc -l knowledge-base/* workflows/*

# Verify no broken cross-references
grep -r "KB-01\|KB-02\|WORKFLOW-" . --include="*.md" | grep -v research/
```
