# Kit Install Pipeline — Feature Map, Tier Selection, and Maintenance Cadence

> Operator-facing reference for planning a kit install. **QUICK_START.md** tells you how to invoke the generator. **This document** tells you what you're invoking, which tier to ask for, what surface area lands in your repo, and how to keep it healthy over time.
>
> Audience: kit operators (the human who runs the generator against a target project). Read this once before your first install, then revisit when planning a tier upgrade or a maintenance pass.

---

## 0. What this is

The DirectiveForge kit is a layered system. Each version (v0.8.0 → v0.14.0) added a discrete capability layer: baseline workflow, project-scale decision discipline, self-improvement vigilance, cloud-hosted scheduling, conversational pressure-testing, generator wiring. The current generator (v0.14.0) can install any subset of those layers in a single run, but **which subset is right for your project depends on four answers you should have before invoking it**:

1. **Which maturity tier** matches your project — Starter, Intermediate, or Advanced? (§2)
2. **What lands in your repo** at that tier — concrete files and directories? (§4)
3. **Which optional opt-ins** apply — vigilance discipline, surface routing integration, mission-dispatch pattern? (§3, §4)
4. **How will you maintain it** over time — what cadences and which kit-upstream changes do you need to track? (§5, §6)

Answer those four, then dispatch the generator. The generator's Phase 1.6 will re-derive the tier from codebase evidence and ask you a single tie-break question if the signals are mixed, but the install runs cleaner when you arrive with a working hypothesis.

---

## 1. Full kit feature map

Every capability layer the kit ships, by version. The generator can install any combination; tier classification (§2) determines which combinations are sensible for which projects.

| Version | Layer | What it adds to a target project |
|---|---|---|
| **v0.8.0** (baseline) | CLAUDE.md + AGENTS.md + DECISIONS.md + rules + skills + agents + commands + MCP scaffolding | Standard app-code workflow — every file the agent needs to ramp without re-discovering project conventions. |
| **v0.10.0** | KB-04 Decision Engineering + `ARCHITECT_PROMPT` template + DECISIONS.md 3-tier upgrade + `orchestrator-dispatch.md` rule + `research.md` rule + 2 research skills (`research-prompt-writer`, `research-synthesizer`) | Project-scale decision discipline. Locked entries with reversal triggers + re-verification cadence; 8-gate research framework; 14-section architect prompts for major implementation phases. |
| **v0.11.0** | `KIT-VIGILANCE` doctrine + `vigilance/WATCHLIST.md` + 3 dispatch prompts (Daily Pulse / Weekly Synthesis / Monthly Integration) + `vigilance/feed/` + `vigilance/state/` | Self-improvement discipline. The kit watches the AI ecosystem on a 3-cadence loop and produces architect prompts for kit updates when sustained signal accumulates. |
| **v0.12.0** | Claude Code Routines migration | Cloud-hosted scheduled tasks. The vigilance loop fires regardless of laptop state — closed lid, dead battery, vacation, the routine runs on Anthropic infrastructure and commits results back via routine git auth. |
| **v0.13.0** | KB-05 Conversational Decision Engineering + 12 decision skills + hybrid phrase-mapping/LLM router + 3-voice council + 4 anti-sycophancy patterns | Conversational pressure-testing discipline. Agent fires the right pressure-test (pre-mortem, steelman, calibration, reversibility, council) on decision-shaped user prompts instead of validating the prior. |
| **v0.14.0** (current) | Generator pipeline wired for all the above — 9 phases, tier-aware file generation, multi-IDE path conventions, decision-skill router rule injection, optional Phase 7 vigilance bootstrap, optional Phase 8 mission-dispatch | One-command install of any subset of the full surface area, governed by Phase 1.6 maturity classification. |

Each layer is independently useful and composes with the others. A project can ship v0.8.0 baseline and never touch decision discipline if its decision cadence doesn't justify the overhead. A project can ship Advanced from day one if the cost-of-a-bad-decision crosses the discipline's overhead on week one.

---

## 2. Tier selection — Starter / Intermediate / Advanced

Generator Phase 1.6 classifies the project from codebase evidence. The signals below mirror what Phase 1.6 looks for, so you can self-classify in advance. Reference: `knowledge-base/KB-04-DECISION-ENGINEERING.md` §8 + `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §12.

### 2.1 Starter — minimum viable kit

**Who it's for.** Solo developer, side project, pre-MVP. Decisions are reversible and recoverable; the cost of a bad call is a refactor, not a rewrite.

**Decidable signals.** 1-2 contributors over project lifetime · No production deployment artifacts · <6 months old AND <10k LOC · Operator says "just the basics."

**What's installed.** v0.8.0 baseline (CLAUDE.md, AGENTS.md, rules, agents, commands, MCP, ignore files) + DECISIONS.md Tier 1 (1-liner-per-entry) + the 5 BLOCKER decision skills (`anti-sycophancy-meta`, `pre-mortem`, `steelman`, `confidence-calibration`, `reversibility-check`) + `decision-skills.md` router rule (BLOCKER-only entries).

**What's NOT installed.** KB-04 rules (`orchestrator-dispatch.md`, `research.md`) · architect prompt template · research skills · HIGH/MEDIUM decision skills · council · surface routing integration · vigilance · mission-dispatch.

**When to graduate.** A decision gets re-debated despite being in the ledger; you find yourself wishing for `inversion` or `second-order-thinking`; the project gets a second long-running contributor; production deploys land.

### 2.2 Intermediate — production discipline

**Who it's for.** Small team (2-5), production deployment exists, multi-month roadmap with locked architectural choices. The cost of a bad call is measured in weeks, not days.

**Decidable signals.** 2-5 developers · Production deployment exists · Multi-stakeholder (team lead + designer + PM, or equivalent) · Multi-month roadmap with locked architectural choices · Operator says "I want defensible decisions."

**What's installed.** Everything in Starter, plus: DECISIONS.md Tier 2 (TL;DR + reversal triggers + re-verification cadence per entry) · KB-04 rules (`orchestrator-dispatch.md`, `research.md`) · 2 research skills (`research-prompt-writer`, `research-synthesizer`) · 4 HIGH decision skills (`inversion`, `second-order-thinking`, `disconfirming-evidence-first`, `cost-of-inaction`) · `ARCHITECT_PROMPT.template.md` at `docs/prompts/` · LLM-fallback enabled in the decision-skill router · surface routing integration offered (Phase 4.5 handoff).

**What's NOT installed.** MEDIUM decision skills · council · vigilance · mission-dispatch.

**When to graduate.** A decision requires >4 research dossiers; the synthesizer misses a cross-dossier contradiction that downstream work surfaces; cross-orchestrator boundaries start blurring; strategic stakes appear (regulatory commitment, external counsel review, market-defining bet).

### 2.3 Advanced — full discipline + self-improvement

**Who it's for.** 5+ developers OR multi-team coordination · multi-orchestrator multi-month research tracks · strategic stakes that need external-audit-grade reasoning trails. The cost of a bad call is measured in quarters or years.

**Decidable signals.** 5+ developers OR multi-team · Multi-orchestrator research tracks exist or planned · Strategic stakes (legal exposure, regulatory commitments, market-defining bets) · External counsel / auditor / partners need to re-derive decisions · Operator says "I want the full kit including vigilance / dispatch / per-project surface routing."

**What's installed.** Everything in Intermediate, plus: DECISIONS.md Tier 3 (full TL;DR + Master Synthesis 400w + reversal + re-verify + cross-DECISIONS reconciliation) · 3 MEDIUM decision skills (`10-10-10`, `cost-of-inaction`, `bayesian-update`) · `council-3-voice` skill (if plan-tier ≥ Max — 15× tokens per invocation gated behind cost rule) · per-project `ai-workflow.md` surface routing rule (via Phase 4.5 Cowork handoff) · vigilance discipline bootstrap (via Phase 7 opt-in) · mission-dispatch pattern (via Phase 8 opt-in).

**What's NOT installed.** Nothing intentionally withheld at this tier. Advanced is the ceiling.

**When to NOT graduate.** A solo developer building a side project does not need Advanced. The discipline scales with stakes, not project age. A 6-month side project might never need more than Starter; a 2-month strategic launch needs Advanced from day one.

**Tie-break rule.** When signals are mixed (e.g., 3 developers + production deploy + no strategic stakes), classify as **Intermediate** and flag candidate-Advanced features in the Phase 9 summary so the operator can opt in later.

---

## 3. Install flow walk-through (9 phases)

```
Phase 0:   Foundation (read KB sections + inventory existing files)
              ↓
Phase 1:   Deep codebase analysis (stack, versions, architecture, conventions, domain)
              ↓
Phase 1.6: Maturity-tier classification (Starter / Intermediate / Advanced)
              ↓
Phase 2:   Stack detection + preset loading (nextjs / fastapi / general-node / none)
              ↓
Phase 2.5: MCP discovery (scan dependencies + .env.example, 5-gate quality check)
              ↓
Phase 3:   File generation (templates → tier-aware install of rules / skills / agents / commands)
              ↓
Phase 3.4: Multi-IDE path conventions (.claude/ + .cursor/ mirror sync mandate)
              ↓
Phase 3.5: Decision-skill router rule injection (decision-skills.md documenting which skill fires when)
              ↓
Phase 4:   Existing file handling (merge, never overwrite; archive, never delete)
              ↓
Phase 4.5: Surface routing integration         (Intermediate+ only — Cowork handoff)
              ↓
Phase 5:   Validation (run generator/VALIDATION_CHECKLIST.md sections 1-10)
              ↓
Phase 6:   Cost & session optimization (CLAUDE.md session-management additions)
              ↓
Phase 7:   Vigilance discipline bootstrap     (Advanced only — opt-in)
              ↓
Phase 8:   Mission-dispatch pattern           (Advanced only — opt-in)
              ↓
Phase 9:   Summary report (files created, MCP servers, decisions seeded, validation results)
```

The generator pauses for operator input at three points: Phase 1.6 if tier signals are ambiguous, Phase 7 if Advanced and offering vigilance, Phase 8 if Advanced and offering mission-dispatch. Every other phase runs without prompting.

---

## 4. What lands where — per-tier install map

The trees below are accurate against generator Phase 3.1's file-generation table. Cursor mirrors land iff `.cursor/rules/` exists or is being created fresh; the multi-IDE sync mandate (Phase 3.4) keeps the two trees in lock-step.

### 4.1 Starter tier

```
/
├── CLAUDE.md
├── AGENTS.md
├── DECISIONS.md                              (Tier 1 — 1-liner-per-entry)
├── HANDOFF.md                                (template only — not filled)
├── .cursorignore
├── .cursorindexingignore
├── .mcp.json                                 (baseline + Phase 2.5 discoveries)
├── .claude/
│   ├── commands/
│   │   ├── review-pr.md
│   │   ├── deploy.md
│   │   ├── update-context.md
│   │   ├── discover-mcp.md
│   │   ├── security-review.md
│   │   └── tech-debt.md
│   ├── rules/
│   │   ├── base.md
│   │   └── decision-skills.md                (router — BLOCKER entries only)
│   └── skills/
│       └── decision/
│           ├── anti-sycophancy-meta/SKILL.md
│           ├── pre-mortem/SKILL.md
│           ├── steelman/SKILL.md
│           ├── confidence-calibration/SKILL.md
│           └── reversibility-check/SKILL.md
└── .cursor/                                  (mirror if Cursor in scope)
    ├── mcp.json
    ├── rules/
    │   ├── base.mdc
    │   ├── frontend.mdc                      (if frontend exists)
    │   ├── api.mdc                           (if API layer exists)
    │   ├── database.mdc                      (if database exists)
    │   ├── testing.mdc                       (if tests exist)
    │   └── decision-skills.mdc
    ├── agents/
    │   ├── reviewer.md
    │   ├── tester.md
    │   ├── seo-auditor.md                    (if public pages)
    │   ├── i18n-validator.md                 (if i18n)
    │   └── security-auditor.md               (if payments/auth/PII)
    └── skills/
        ├── debug/SKILL.md
        ├── deployment/SKILL.md               (if deployable)
        ├── migration/SKILL.md                (if DB migrations)
        ├── refactor/SKILL.md                 (if existing codebase)
        └── decision/                         (mirror of .claude/skills/decision/)
            └── ... (5 BLOCKER skills)
```

### 4.2 Intermediate tier adds

```
├── DECISIONS.md                              (UPGRADED to Tier 2 — reversal triggers + re-verify per entry)
├── docs/prompts/
│   └── ARCHITECT_PROMPT.template.md          (14-section IMPL prompt template)
├── .claude/
│   ├── rules/
│   │   ├── orchestrator-dispatch.md
│   │   ├── research.md
│   │   └── ai-workflow.md                    (added by Phase 4.5 Cowork handoff)
│   └── skills/
│       ├── research-prompt-writer/SKILL.md
│       ├── research-synthesizer/SKILL.md
│       └── decision/
│           ├── inversion/SKILL.md
│           ├── second-order-thinking/SKILL.md
│           ├── disconfirming-evidence-first/SKILL.md
│           └── cost-of-inaction/SKILL.md
└── .cursor/                                  (mirror — same files, .mdc extension for rules)
    ├── rules/
    │   ├── orchestrator-dispatch.mdc
    │   ├── research.mdc
    │   └── ai-workflow.mdc
    └── skills/
        ├── research-prompt-writer.SKILL.md   (legacy flat-file convention)
        ├── research-synthesizer.SKILL.md
        └── decision/                         (mirror — 4 HIGH skills)
```

Note: `decision-skills.md` router gets the HIGH-skill entries injected; the LLM-fallback section also unlocks.

### 4.3 Advanced tier adds

```
├── DECISIONS.md                              (UPGRADED to Tier 3 — TL;DR + Master Synthesis 400w + cross-DECISIONS reconciliation)
├── workflows/
│   └── KIT-VIGILANCE.md                      (adapted from kit; re-sync quarterly — Phase 7)
├── vigilance/                                (Phase 7)
│   ├── WATCHLIST.md                          (specialized for project stack — categories 2+5 customized)
│   ├── feed/
│   │   ├── daily/.gitkeep
│   │   ├── weekly/.gitkeep
│   │   ├── monthly/.gitkeep
│   │   └── quarterly/.gitkeep
│   └── state/                                (gitignored — per-source delta state)
├── prompts/                                  (Phase 7 + Phase 8)
│   ├── chat-research-missions.md             (Phase 8)
│   ├── code-handoff-prompts.md               (Phase 8)
│   ├── cowork-browser-operations.md          (Phase 8)
│   └── dispatch/
│       ├── README.md                         (folder convention)
│       ├── DAILY_PULSE_SCAN.md               (Phase 7)
│       ├── WEEKLY_SYNTHESIS.md               (Phase 7)
│       └── MONTHLY_INTEGRATION.md            (Phase 7)
├── research/                                 (Phase 8 — dossiers land here)
│   └── README.md
├── .claude/
│   └── skills/
│       └── decision/
│           ├── 10-10-10/SKILL.md
│           ├── cost-of-inaction/SKILL.md     (already present at Intermediate — confirm)
│           ├── bayesian-update/SKILL.md
│           └── council-3-voice/SKILL.md      (iff plan-tier ≥ Max — council cost gate documented in decision-skills.md)
└── .cursor/skills/decision/                  (mirror — 3 MEDIUM + council)
```

Phase 7 also updates `.gitignore` to exclude `vigilance/state/` and outputs 3-routine setup instructions in the Phase 9 summary (Daily Pulse / Weekly Synthesis / Monthly Integration with cron expressions, "Allow unrestricted git push" permission, explicit `git checkout main` directive).

---

## 5. Maintenance cadence

What the operator does after the initial install, by frequency. The cadences below assume an Advanced-tier install with vigilance bootstrapped; Intermediate and Starter projects skip the vigilance-dependent rows.

| Cadence | Action | Effort |
|---|---|---|
| **Daily** | Nothing. The vigilance Daily Pulse routine fires at 08:00 local on Anthropic infrastructure and commits a digest to `vigilance/feed/daily/YYYY-MM-DD.md`. | 0 min |
| **Weekly** | Read Sunday's `vigilance/feed/weekly/YYYY-WW.md` — ≤5 action candidates synthesized from the past 7 daily digests. Triage: which need a project response (rule update, DECISIONS amendment, dependency bump)? | 5-15 min |
| **Monthly** | Review `vigilance/feed/monthly/YYYY-MM.md` integration manifest. For sustained-signal candidates, dispatch the architect prompts the monthly synthesis produced. | 30-60 min |
| **Quarterly** | Audit `vigilance/WATCHLIST.md` — are the source feeds still alive? (403s and dead RSS feeds are the modal failure.) Add new feeds for newly-adopted dependencies; retire feeds for sunset tools. Run DECISIONS.md re-verification per the cadence each entry declares. | 1-2 h |
| **On Anthropic model/plan release** | Re-verify per `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §16 (model availability, plan-tier limits, council cost shifts) + `knowledge-base/KB-04-DECISION-ENGINEERING.md` re-verification schedules. Update CLAUDE.md if model defaults change. | 30-60 min |
| **On significant project change** | New service, new framework version major-bump, new compliance regime, new team member, new market: re-run the generator via `/update-context` or full re-install. Phase 1.6 will re-classify the tier if signals have shifted. | 15-30 min |

The vigilance loop is what makes the maintenance cadence sustainable — without it, daily and weekly drop to zero and quarterly becomes "remember to check sometimes," which eventually becomes never.

---

## 6. Upgrade flow — keeping the project synced with the upstream kit

The kit ships new versions on a roughly-monthly cadence. The target project does NOT auto-update; the operator absorbs upstream changes manually so the project's locked decisions are not silently overwritten.

**Concrete steps:**

1. **Subscribe to the kit repo.** Watch releases at `github.com/directiveforge/directiveforge`. New kit versions show up in the release feed and in the kit's own `vigilance/feed/monthly/` (the kit dogfoods its own discipline).

2. **Read the CHANGELOG entry** for the new version. The kit's `CHANGELOG.md` documents which layers changed, which files were touched, and which migration steps the operator needs to run.

3. **Identify which kit surface layers your project uses.** Cross-reference the project's tier (§2) against the changed layers. A v0.13.x → v0.13.y patch that only touched decision skills is irrelevant to a Starter-tier project that hasn't installed the council; a v0.14.x → v0.15.0 that changed the generator Phase 1.6 heuristics may warrant re-running the generator to re-classify.

4. **For each layer that changed**, either re-run the relevant generator phase (`/update-context`) OR manually port the diff. Most diffs are 5-20 lines and apply cleanly; ones that don't are usually because the project specialized the file and needs a 3-way merge.

5. **Plan ~30 min quarterly** to absorb kit updates for an Advanced-tier project. Intermediate and Starter projects can let multiple kit versions stack and absorb in a half-day session every 6 months.

The discipline that prevents drift on both sides — kit drift from reality, project drift from the kit — is documented in `workflows/KIT-VIGILANCE.md`.

---

## 7. Common pitfalls operators hit

Eight patterns observed during real kit-install runs. Read this section once and you will save yourself most of them.

1. **Installing everything at Starter tier.** A solo side project does not need orchestrator dispatch, the 14-section architect prompt, or the council. The overhead exceeds the benefit; the agent reads padding instead of project context. Default to Starter and graduate when warning signs appear.

2. **Skipping the surface-routing integration (Phase 4.5).** Decision skills declare a `surface:` field in their frontmatter. If `.claude/rules/ai-workflow.md` is missing, the agent has no project-specific map for when to handoff a council invocation from Chat to Code, or a research dossier from Code to Chat Research. The skills become invisible to the agent because the routing layer never fires.

3. **Forgetting to enable "Allow unrestricted git push" on Routines.** The vigilance routines commit their digests via routine git auth. Without unrestricted push, commits land on a `claude/` branch that nobody reads and the digest archive silently bifurcates from `main`. Symptom: `vigilance/feed/daily/` looks empty on `main` but the routine logs say it succeeded.

4. **Forgetting to explicit-checkout `main` in Routine prompts.** Same root cause as #3 but a different mitigation. Each Routine's Instructions field must say "git checkout main; do NOT create a feature branch" because routine sessions default to branching for safety. Both #3 and #4 must be addressed; one without the other still leaves the loop broken.

5. **Setting up vigilance without specializing the WATCHLIST.** The kit's stock `vigilance/WATCHLIST.md` watches the general AI ecosystem. The project's WATCHLIST must REPLACE Category 2 (framework releases) with the project's actual stack feeds. A Next.js project that watches the FastAPI release feed gets daily noise and misses Next.js majors.

6. **Running the generator without Phase 0 reading.** Phase 0.1 specifies 8 KB reading targets. Skipping them lets the agent guess kit conventions — wrong file paths, wrong skill format, wrong rule glob patterns. The generator's anti-hallucination guarantees only hold if the agent actually loaded the source-of-truth files first.

7. **Modifying generated files without recording in DECISIONS.md.** Six weeks later, the operator re-runs `/update-context`, the generator overwrites the modification because there is no ledger entry telling it "this deviation is intentional," and the work is lost. Every meaningful deviation from generator output gets a DECISIONS entry.

8. **Treating maturity tier as a one-time classification.** A project that started Starter and grew to Intermediate needs to re-run the generator with the new tier hypothesis. Phase 1.6 will re-derive from current evidence; the install adds the Intermediate-tier delta without disturbing existing files (Phase 4 protocol). Tier classification is a moving target, not a permanent label.

---

## 7.5 Distribution channels — how the kit reaches a project

Three ways the kit lands in a project. They are not mutually exclusive; the plugin and the generator install cleanly on top of each other.

### (1) Plugin — one command, skills + commands only

```bash
claude plugin marketplace add directiveforge/directiveforge
claude plugin install directiveforge          # add --scope project to share with a team
```

Ships the 22 measured skills (decision / naming / design packs) and the workflow commands — including `/report-friction` — namespaced `/directiveforge:<skill>`, self-triggering on the right prompts. **Global** by default (available in every project on the machine); `--scope project` commits the plugin reference into the repo. Updates land via a version bump upstream, absorbed with `/plugin marketplace update` + `claude plugin update directiveforge`.

**Use when.** You want the reasoning skills and commands fast, without a per-project workflow build. No rules, no agents, no router, no manifest — that is by design.

### (2) Generator dispatch — full per-project workflow

The 9-phase generator (QUICK_START.md → `generator/PROJECT_SETUP_PROMPT.md`) reads the codebase, classifies the maturity tier, and installs the tier-appropriate surface: `CLAUDE.md` / `AGENTS.md` / `DECISIONS.md`, rules, agents, the decision-skill router, `.mcp.json`, and the `.ai-kit-manifest.json` that upgrades run against. Upgrades go through `generator/UPGRADE_MODE.md`, which diffs the installed surface against the current kit using the manifest.

**Use when.** The project needs the whole discipline — project-specific rules, review/verify/test agents, surface routing, and a manifest-tracked upgrade path. This is the recommended route for any project past a side-project.

### (3) Cursor copy-based path

Cursor has no plugin runtime, so the skills are copied in directly:

```bash
git clone https://github.com/directiveforge/directiveforge.git ~/kit
cp -R ~/kit/templates/skills/{decision,naming,design} .cursor/skills/
```

**Use when.** Cursor-only project and you want the skills quickly. Note: this copies the skills but not the router rule or the rest of the workflow — **the generator path is the recommended Cursor route** (it installs the Cursor mirrors AND the `.cursor/rules/` router that makes the skills discoverable to the agent).

### When to use which

| Situation | Channel |
|---|---|
| Just want the measured skills + commands, any project, fast | Plugin (1) |
| Full per-project workflow: rules, agents, router, manifest, upgrades | Generator (2) |
| Team should share the skills via the repo | Plugin `--scope project` (1), or Generator (2) for the full surface |
| Cursor-only, skills-only, quick | Copy (3) — but prefer Generator (2) for the router |

---

## 8. Cross-references

Front door and invocation:
- `QUICK_START.md` — how to invoke the generator against a target project
- `generator/PROJECT_SETUP_PROMPT.md` — the master 9-phase generator prompt
- `generator/VALIDATION_CHECKLIST.md` — post-install verification (Phase 5)
- `generator/presets/` — stack-specific generator additions (Next.js, FastAPI, general Node)

Knowledge base:
- `knowledge-base/KB-01-AI-WORKFLOW-ENGINEERING.md` — context engineering, hallucination reduction, MCP ecosystem, cost
- `knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` — context architecture, rules engineering, skill/agent patterns
- `knowledge-base/KB-03-CATALOG-PIPELINE-ARCHITECTURE.md` — multi-source catalog pipeline patterns (conditional read)
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` — locks, 3-layer research, dispatch, architect prompts, maturity gradient §8
- `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` — 12 decision skills, hybrid router, council, maturity gradient §12
- `knowledge-base/MCP-SERVER-REGISTRY.md` — curated MCP servers with security postures
- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — Chat / Cowork / Code capability matrix

Workflows:
- `workflows/WORKFLOW-CLAUDE-CODE.md` — complete Claude Code workflow
- `workflows/WORKFLOW-CURSOR.md` — complete Cursor IDE workflow
- `workflows/KIT-VIGILANCE.md` — vigilance discipline (cadences, watchlist, dispatch)
- `workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md` — per-surface behavior (Chat / Cowork / Code reroute triggers)

Worked instance:
- the private lab's worked instance (not shipped) — a worked reference of the full discipline (12 research dossiers, 13 locked DECISIONS entries, 9 orchestrator-dispatched implementation tracks). Use as a concrete reference when the abstract patterns in KB-04 / KB-05 are hard to picture.
