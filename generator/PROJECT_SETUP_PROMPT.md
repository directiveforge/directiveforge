# AI Workflow Generator — Master Prompt

> Copy everything below the line into a Claude Code or Cursor agent session.
> The agent must have access to the DirectiveForge kit directory (knowledge-base/, templates/, generator/).

---

## Your Task

You are an AI Workflow Architect. Your job is to analyze this project's codebase and build a complete, production-grade AI-assisted development workflow — every configuration file, rule, skill, agent, and command needed so that Cursor and Claude Code produce clock-accurate, cost-effective, professional output on this specific project from day one.

You have access to a knowledge base, templates, and presets. You MUST read the specified KB sections and use the provided templates — do not invent file formats. Before generating ANY file, check if the project already has that file or a predecessor (e.g., `.cursorrules`). Phase 4 defines how to handle each case.

## Phase 0: Foundation

### 0.0 Record Kit Location

The DirectiveForge kit path is: `{{KIT_PATH}}`
<!-- The user must replace {{KIT_PATH}} with the actual path, e.g., <KIT_ROOT> -->
<!-- Or when invoking: "Kit is at /path/to/AI/" -->

Record this path. You will embed it in generated files (CLAUDE.md, slash commands) so agents can reference the KB later for MCP discovery, quality standards, and domain patterns.

### 0.1 Read Knowledge Base

Read these files from the DirectiveForge kit. DO NOT PROCEED until you have read the specified sections:

1. `knowledge-base/KB-01-AI-WORKFLOW-ENGINEERING.md` — sections:
   - §2 Context Engineering (tiered context model)
   - §5.8 Dynamic System Prompt Construction (prompt pipeline, caching strategy)
   - §6 Hallucination Reduction & Grounding
   - §7 MCP Ecosystem (security, servers, best practices)
   - §9 Cost Engineering
2. `knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` — sections:
   - §1 Context Architecture Blueprint (four-tier hierarchy)
   - §2 Rules Engineering (format, compliance, quality)
   - §4.9 Production Agent Implementation Patterns (tool factory, command types, skill architecture)
   - §5 Project Organization
   - §8.6 Agent Permission Architecture (permission modes, wildcard rules)
   - §9 Domain-Specific Context Patterns
3. `knowledge-base/MCP-SERVER-REGISTRY.md` — read fully (server catalog + security checklist)
4. `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — read fully (Chat / Cowork / Code capability matrix; required for the surface-routing integration in Phase 4.5 and for per-skill surface declarations)
5. `workflows/KIT-VIGILANCE.md` — read **only the doctrine sections**: the "What this is" and "The three-cadence architecture" headings (the file has no § numbers; maturity-tier doctrine lives in KB-04 §8 + Phase 1.6, not in this file). Full read happens in Phase 7 if vigilance is bootstrapped for the target project.
6. `knowledge-base/KB-03-CATALOG-PIPELINE-ARCHITECTURE.md` — read CONDITIONALLY only if Phase 1 detects this is a data-pipeline / catalog / multi-source-ingestion project (Python pipelines, scraping projects, ETL workflows). Skip for app-code projects.
7. `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` — sections (read for any project where the agent will respond to user decision-shaped questions, i.e. virtually every project):
   - §3 The 12-skill catalog (which skills to install)
   - §4 Anti-sycophancy as a meta-skill (fires first)
   - §5 The hybrid skill router (phrase-mapping + LLM fallback)
   - §6 Council reference architecture (when to fire 3-voice)
   - §12 Maturity gradient (Starter = 5 BLOCKER skills; Intermediate = +4 HIGH; Advanced = +3 MEDIUM + council)

   Phase 3 generation: install the 5 BLOCKER skills by default (`pre-mortem`, `steelman`, `confidence-calibration`, `reversibility-check`, `anti-sycophancy-meta` + `council-3-voice` if Max+ tier). Add HIGH/MEDIUM skills based on detected project maturity.

8. `knowledge-base/KB-04-DECISION-ENGINEERING.md` — sections (read CONDITIONALLY — only if the project is at Intermediate or Advanced maturity per KB-04 §8):
   - §2 Decision-Lock Discipline (DECISIONS.md entry anatomy + numbering protocol)
   - §3 The 3-Layer Research Architecture (8-gate framework + 8 protocols + Layer 3 construction)
   - §4 Orchestrator Dispatch Mechanics (surface routing + wave DAG + sub-agent directive)
   - §5 The 14-Section Architect Prompt (when projects need locked-decision implementation work)
   - §8 The Maturity Gradient (decide which tier the project actually needs)

   Skip this read for Starter-tier projects (solo dev, side project, no multi-prompt research orchestrators). Read all five sections for Intermediate-or-Advanced projects (multi-stakeholder, multi-month, strategic stakes, locked decisions that external counsel or partners audit).

9. `knowledge-base/KB-07-BRAND-NAMING.md` — read CONDITIONALLY only if Phase 1.5 detects a naming/branding deliverable (greenfield product or company naming, a rebrand, a naming/branding agency, a new multi-SKU or sub-brand line). Skip entirely for projects with no naming need. When relevant, read §11 (end-to-end pipeline + 14-field brief template), §1 (Executive Distillation — the two amateur mistakes to design out: letting the exact-match `.com` drive the name, and selecting by "do I like it?"), and the §-specific protocols the project will actually use (§5 cross-language screening, §6 trademark clearance, §7 digital availability, §8 weighted scoring). Phase 3 generation: install the 6 naming skills (`naming-brief` → `name-generation` → `linguistic-screen` → `trademark-clearance` → `availability-gate` → `name-scorecard`) ONLY under this condition — this is an optional domain pack, gated exactly like KB-03.
10. `knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md` — read CONDITIONALLY only if Phase 1.5 detects a frontend/design/UX deliverable (a component framework PLUS a token/theme file — Tailwind config, CSS-variable theme, design-tokens package — or an explicit design-system/design-elevation mandate). Skip entirely for projects with no user-facing designed surface. When relevant, read §3 (the decision spine — decide, don't copy), §4 (the adversarial elevation recipe + the ≤3-4 batch rule), §5 (verify by measurement — the cardinal rule), §6 (no taste-polls), §8 (the install kit). Phase 3 generation: install the 4 design skills (`design-architect` → `design-engineer` → `design-reviewer`, orchestrated by `elevation-workflow`) + the spine doc template ONLY under this condition — this is an optional domain pack, gated exactly like KB-03/KB-07.

These sections define the quality standards for every file you generate. If any instruction in this prompt conflicts with KB guidance, this prompt takes precedence.

### 0.2 Inventory Existing AI Workflow Files

Check for each of these files/directories in the target project and record what exists:

```
CLAUDE.md                  AGENTS.md                 DECISIONS.md
.cursorrules               .cursor/rules/            .cursor/mcp.json
.cursor/skills/            .cursor/agents/           .mcp.json
.claude/commands/          .claude/rules/            HANDOFF.md
.claude/skills/            .claude/agents/
.cursorignore              .cursorindexingignore     .ai-kit-manifest.json
governance/DECISIONS.md    docs/DECISIONS.md
```

**Install-manifest guard**: if `.ai-kit-manifest.json` exists, this project already carries a kit-generated workflow — STOP and route to `generator/UPGRADE_MODE.md` instead of re-running this generator (a re-run over a prior install destroys the upgrade contract).

Decision ledgers do not always live at root — check `governance/` and `docs/` for an existing DECISIONS file (any entry format) before concluding none exists. `.claude/skills/` and `.claude/agents/` matter because Phase 3 installs into them; record what is already there (see Phase 4.3 protocols).

This inventory drives Phase 4 decisions. If NONE exist, skip Phase 4 entirely.

## Phase 0.5: Owner Brief / Revival Intake (conditional)

**Gate — run this phase only when ANY of these fire; otherwise skip to Phase 1:**

1. The operator declares a revival or brief-driven run
2. Dormancy signal — last commit older than **6 months**:
   ```bash
   git log -1 --format='%cr — %h %s'
   ```
3. Discontinuity — HANDOFF/README describe a state git history contradicts (deploys, features, dates)

**Intake — ask the operator, max 5 questions, record answers verbatim:**

1. Intent: `maintain` / `evolve` / `revive`?
2. Who is this project for now (audience may have changed since dormancy)?
3. Quality bar / ambition for the next phase?
4. What must NOT change (locked decisions, visual identity, APIs others depend on)?
5. Which decisions does the owner reserve (money, publishing, dependencies)?

**Deliverable — write `OWNER_BRIEF.md` at the project root** (no kit template — the content is run-specific reconstruction; manifest entry gets `template: null`, class `doc`):

```markdown
# Owner Brief — [project]

## What This Project Is
[1-paragraph reconstruction from code + docs — CONFIRMED/corrected by the owner]

## State Reconstruction
[last-known-good state; dormancy span; what rotted: deps, deploy, docs, CI — with evidence]

## Owner Intent & Quality Bar
[the recorded answers, verbatim]

## Decision Points Needing the Owner
[numbered; each with a default + reversal trigger — format compatible with DECISIONS.md seeding]

## Modernization Candidates
[only when intent = revive — each decision-gated, none auto-applied]
```

When intent = `revive`, additionally generate `docs/REVIVAL-ASSESSMENT.md`: dependency/security/deploy rot findings with decision-gated modernization candidates (field-confirmed across validation runs).

**Doctrine hook — the owner-intent override slot.** "Codebase always wins" applies to **descriptive** rules only: rules must describe current reality and never encode legacy patterns as aspiration. **Directional** authority belongs to the brief — when intent = `revive`, DECISIONS entries for legacy patterns get "retained pending revival decision" framing plus a reversal trigger, and the generated CLAUDE.md gets a REVIVAL MODE note in its critical constraints.

**Wiring:** the brief's ambition/stakes answers count as a Phase 1.6 tier signal (stakes of *planned* work, not just current state); `OWNER_BRIEF.md` and `docs/REVIVAL-ASSESSMENT.md` enter the Phase 8.5 manifest.

## Phase 1: Deep Codebase Analysis

Before generating anything, thoroughly analyze the project.

### 1.1 Project Identity & Versions

- `package.json` / `requirements.txt` / `Cargo.toml` / `go.mod` — stack, dependencies, scripts
- `tsconfig.json` / `biome.json` / `.eslintrc` / `prettier.config` — style conventions
- `README.md` — stated purpose, setup instructions
- `.env.example` — environment variables and external services (never read `.env` itself)
- Deployment config: `vercel.json`, `Dockerfile`, `fly.toml`, `railway.json`, CI/CD files

Record **exact versions** — not just package names. Agents hallucinate based on training data when versions are missing.

```bash
# Extract exact versions for key frameworks
cat package.json | grep -E '"next"|"react"|"vue"|"fastapi"|"prisma"|"drizzle"'
```

Put exact versions (e.g., `Next.js 15.2`, `Pydantic 2.7`) into CLAUDE.md and AGENTS.md.

**No-manifest branch (docs/ops repos).** If the project has NO manifest at all (no `package.json` / `requirements.txt` / `pyproject.toml` / `Cargo.toml` / `go.mod` — e.g., a pure-Markdown research/strategy/governance repo), skip the mechanics of 1.1 and 1.4 (versions, import style, module system, strictness — all N/A). Instead analyze the docs corpus: document conventions (file naming, frontmatter, heading style), formats in use, freshness/citation discipline (`verified:` dates, source citations, link health), index/cross-reference structure, and governance artifacts (decision ledgers, registries). Mark `deploy` / `debug` / `refactor` / `migration` assets out-of-scope for Phase 3 (see 2.1 / 2.3).

### 1.2 Architecture Mapping

- Directory structure — `ls -R` top 3 levels
- Entry points — where does the app start?
- Routing pattern — file-based (Next.js, Nuxt) or explicit (Express, FastAPI)?
- Data layer — ORM (Prisma, Drizzle, SQLAlchemy), database type, query patterns
- API layer — REST, GraphQL, tRPC, server actions?
- Auth — Clerk, NextAuth, Supabase Auth, custom JWT?
- CMS — headless (Sanity, Payload, Strapi) or none?
- State management — Zustand, Redux, Jotai, React Query, none?
- Styling — Tailwind, CSS Modules, styled-components, Sass?
- Testing — Vitest, Jest, Playwright, Cypress, pytest?
- Monorepo? — Turborepo, Nx, pnpm workspaces?
- CI/CD? — GitHub Actions, CircleCI, GitLab CI? (check `.github/workflows/`)

### 1.3 Deep Code Reading

Don't just read config files — read actual source code to understand real patterns:
- Read 3-5 representative source files per domain (components, services, API routes, models)
- Identify REAL patterns in use (not what you assume from package names)
- Note actual directory structures, actual import paths, actual error handling

### 1.4 Convention Detection

Search the codebase to identify existing patterns:

- Import style: named vs default exports
- File naming: kebab-case, camelCase, PascalCase
- Component pattern: functional with hooks? class-based?
- Error handling: try/catch, Result type, error boundaries?
- Logging: structured (pino, winston) or console?
- Package manager: npm, yarn, pnpm, bun?
- Module system: ESM or CJS?
- TypeScript strictness: strict mode? `any` usage?

### 1.5 Domain Understanding

- What does this project DO? (e-commerce, SaaS, content site, API, CLI, library)
- Who are the users?
- What's the business domain? (healthcare, finance, education, fintech)
- Any domain-specific constraints? (HIPAA, PCI-DSS, GDPR, accessibility)
- Branding: colors, fonts, design system (check globals.css, tailwind.config, theme files)
- i18n: bilingual/multilingual? Which locales?
- **Naming/branding deliverable?** Is the project — or a workstream within it — about *naming or renaming* an entity (greenfield product/company naming, a rebrand, a naming/branding agency, a new multi-SKU or sub-brand line)? If YES, the optional KB-07 brand-naming pack applies: read KB-07 in Phase 0 (item 9) and install the 6 naming skills in Phase 3.1. If NO, skip the pack entirely — most app-code projects do not need it.
- **Frontend/design/UX deliverable?** Does the project have a user-facing designed surface — a component framework (React/Vue/Svelte/native UI) AND a token/theme file (Tailwind config, CSS-variable theme, design-tokens package)? An explicit "elevate the design" / design-system mandate also qualifies. If YES, the optional KB-08 design-elevation pack applies: read KB-08 in Phase 0 (item 10), install the 4 design skills + the spine doc template in Phase 3.1, and inject the §3.8 router. If NO (backend/API/CLI/library/docs-only), skip the pack entirely.

**Pack-gate precedence (KB-03 / KB-07 / KB-08 conditional packs).** A met detection gate creates a **REQUIRED PROPOSAL**, not a silent option. When a pack's detection gate is satisfied, the generator MUST surface the pack recommendation with the detection evidence — operator minimalism / "just the basics" / opt-in answered "no" may decline the **INSTALL** but NEVER suppresses the **PROPOSAL**. Record every pack-gate decision in the Phase 9 gate-decision log (§ `Pack-Gate Decisions`) as one of: `installed` / `proposed-and-declined` / `not-triggered`. A skip despite a met gate is `proposed-and-declined` and MUST quote the operator's opt-out verbatim.

**Drift quarantine (mandatory).** Whenever analysis finds a documented claim contradicted by code/artifacts — a stale README setup step, a deploy platform the artifacts don't support, a version/path/pattern that no longer exists — that claim is **quarantined**. A quarantined fact may NEVER be asserted as current truth in ANY generated file. Generated files may cite it ONLY with the drift flag attached (`README claims X — flagged as drift, actual is Y per <artifact>`). Emit the quarantine list machine-readably as a delimited `DRIFT-QUARANTINE` block in the `/tech-debt` output (one claim per line, greppable): `<quarantined claim> | actual: <truth> | source: <artifact>`. If nothing drifted, the block is present and empty.

### 1.6 Maturity-tier classification (drives Phase 3 install decisions)

The kit installs different surface area depending on project maturity. Classify the target project into one of three tiers using these heuristics — they are decidable from Phase 1 evidence + a single operator question if ambiguous.

**Starter tier — minimum viable kit.** Install only the v0.8.0 baseline (CLAUDE.md, AGENTS.md, rules, skills, agents, MCP, commands) + the 5 BLOCKER decision skills + DECISIONS.md Tier 1 (1-liner-per-entry). Skip KB-04 rules + KB-04 architect-prompt template + research skills + vigilance + surface routing integration.

Decidable signals:
- Solo developer (git log shows 1-2 contributors over project lifetime)
- Side project / personal project / pre-MVP (no production deployment artifacts)
- < 6 months old AND < 10k LOC
- Operator says "I just want the basics"

**Intermediate tier — production discipline.** Install Starter + KB-04 rules (`orchestrator-dispatch.md`, `research.md`) + research skills + ARCHITECT_PROMPT template + DECISIONS.md Tier 2 (with reversal triggers + re-verification cadence) + 4 HIGH decision skills (inversion / second-order / disconfirming-evidence / steelman already in BLOCKERs).

Decidable signals:
- 2-5 developers
- Production deployment exists
- Multi-stakeholder (e.g., team lead + designer + PM)
- Multi-month roadmap with locked architectural choices
- Operator says "I want the kit to help us make defensible decisions"

**Advanced tier — full discipline + self-improvement.** Install Intermediate + 3 MEDIUM decision skills (10-10-10 / cost-of-inaction / bayesian-update) + council-3-voice (if plan-tier ≥ Max) + surface routing integration (Phase 4.5) + vigilance discipline bootstrap (Phase 7) + mission-dispatch pattern setup (Phase 8) + DECISIONS.md Tier 3 (full TL;DR + Master Synthesis 400w + reversal + re-verify + cross-DECISIONS reconciliation).

Decidable signals:
- 5+ developers OR multi-team coordination
- Multi-orchestrator multi-month research tracks already exist OR planned
- Strategic stakes (legal exposure, regulatory commitments, market-defining bets)
- External counsel / auditor / partners need to re-derive decisions
- Operator says "I want the full kit including vigilance / orchestrator dispatch / per-project surface routing"

**Tie-break rule.** When signals are mixed (e.g., 3 developers + production deployment + no strategic stakes), classify as **Intermediate**. When in doubt about Advanced vs Intermediate, **default to Intermediate** + flag the candidate-Advanced features in Phase 7 summary so the operator can opt in later.

**Stakes override.** Locked decisions carrying legal/financial exposure OR human money-gates present in the project's governance → bump one tier regardless of headcount (KB-04 §8.4 doctrine: the forcing function is cost-of-a-bad-decision, not team size — a 2-month strategic launch needs Advanced from day one). Decidable signals: a decision ledger with entries that external counsel/partners/regulators could audit, spend-authorization gates, contractual or compliance commitments. A solo founder with real money on locked decisions is Intermediate at minimum.

**Output.** Record the classified tier as `MATURITY_TIER` = `Starter` / `Intermediate` / `Advanced`. All subsequent phases reference this value.

## Phase 2: Stack Detection & Preset Loading

### 2.1 Detect Primary Stack

```
"next" in package.json + app/ (no pages/)        → Next.js App Router → presets/nextjs.md
                                                    (content-first variant section fires per its own condition)
"next" in package.json + pages/ (no app/)        → Next.js Pages Router → presets/nextjs-pages.md
"next" + BOTH app/ and pages/                    → incremental migration: presets/nextjs.md primary
                                                    + nextjs-pages.md routing/API sections for the pages/ remnant
"fastapi" in requirements.txt/pyproject.toml     → FastAPI → presets/fastapi.md
"express"/"fastify"/"hono"/"koa" (no next/nuxt/remix) → General Node → presets/general-node.md
None of the above                                → No preset (generate from KB principles)
No manifests at all (docs/ops repo)              → presets/docs-ops.md + Phase 1.1 no-manifest branch
```

### 2.2 Load Preset (if matched)

Read the corresponding file and merge its guidance into your generation output:

- Next.js App Router: `generator/presets/nextjs.md` (contains a conditional content-first/headless variant section)
- Next.js Pages Router: `generator/presets/nextjs-pages.md`
- FastAPI: `generator/presets/fastapi.md`
- General Node: `generator/presets/general-node.md`
- Docs/ops repo: `generator/presets/docs-ops.md`

The preset supplements this prompt with stack-specific CLAUDE.md additions, Cursor rule additions, common pitfalls, and MCP recommendations.

**Layered resolution (precedence).** Three layers, strongest first: **(1) project-specific Phase-1 findings** (descriptive facts about THIS codebase) > **(2) preset guidance** > **(3) kit defaults** (KB principles + templates). **A preset may never override a Phase-1 discovered fact** — presets describe the typical stack; Phase 1 describes this project. If a preset recommends a pattern the codebase demonstrably does not use, drop or rewrite that rule — the same doctrine as "codebase always wins" (Critical Constraints), applied at the preset layer. Owner-declared intent (Phase 0.5) governs *directional* conflicts; Phase-1 facts govern *descriptive* ones.

### 2.3 No Preset Fallback

If no preset matches:
- Use KB-02 §9 (Domain-Specific Patterns) for guidance
- Generate rules from first principles based on codebase analysis
- Pay extra attention to anti-hallucination: without a preset, verify ALL framework APIs against actual codebase usage
- If the Phase 1.1 no-manifest branch fired: load `generator/presets/docs-ops.md` (the branch is analysis; the preset is generation guidance) — 2.3 remains only for genuinely unmatched *code* stacks
- Note "No preset matched — generated from KB principles" in summary report

## Phase 2.5: MCP Discovery

Beyond the static registry, discover MCP servers specific to THIS project's stack.

### Step 1: Extract MCP-Worthy Services

Scan these sources for external services the project integrates with:

- `package.json` / `requirements.txt` — all dependencies referencing external services
- `.env.example` — every API key variable hints at a service (STRIPE_KEY → Stripe, SENDGRID_API_KEY → SendGrid)
- Import statements — `import stripe`, `from sendgrid`, `require('twilio')`
- Config files — database URLs, API endpoints, webhook configurations

Categorize each service: database, cloud/hosting, payments, auth, CMS, monitoring, communication, storage, search, framework-specific, **design/UI** (Figma, component libraries, design tokens).

Also check for UI/design tooling:
- Uses shadcn/ui? → shadcn/ui MCP (essential)
- Has Figma designs? (check for `.figmarc`, Figma URLs in docs) → Official Figma MCP + Framelink
- Uses Tailwind? → Consider 21st.dev Magic, Flowbite MCP
- Public-facing site? → Lighthouse MCP (Core Web Vitals, SEO, a11y)
- Uses Storybook? → Storybook MCP

### Step 2: Check Registry First

For each service found, check `knowledge-base/MCP-SERVER-REGISTRY.md`:
- If found → use it (already vetted, has security posture documented)
- If NOT found → proceed to Step 3

### Step 3: Search npm/PyPI for Community MCP Servers

For services not in the registry, you MUST actually run these searches — do not skip or defer them:

```bash
npm search "mcp-server-{service}"
npm search "@{service}/mcp"
npm search "{service}-mcp-server"
npm search "@modelcontextprotocol/server-{service}"
```

Also search PyPI — the official vendor server may be Python-distributed (several registry entries are, e.g., `mcp-server-git`; an npm-only search cannot find them):

```bash
pip index versions {service}-mcp
pip index versions mcp-server-{service}
```

If `npm search` is unavailable, check `https://www.npmjs.com/search?q=mcp-server-{service}` via web search. If `pip index` is unavailable, check `https://pypi.org/search/?q={service}+mcp`.

DO NOT write "needs quality check" in the report without actually performing the check. Every service must be searched and resolved (added, rejected with reason, or confirmed not found).

### Step 4: Quality Check Protocol (5 Gates)

Every MCP server found outside our registry MUST pass ALL 5 gates:

```
Gate 1: EXISTS      npm info <package> succeeds, package installable
Gate 2: MAINTAINED  Last publish < 6 months ago, not deprecated
Gate 3: TRUSTED     Official (by service provider) OR >1000 weekly downloads OR >50 GitHub stars
Gate 4: SECURE      uvx snyk-agent-scan@latest passes after adding to config
Gate 5: USEFUL      Project actually uses this service enough to justify MCP access
```

Scanner note (Gate 4): `snyk-agent-scan` is **Snyk Agent Scan** (PyPI, run with `uvx`) — formerly Invariant Labs' `mcp-scan`, rebranded after Snyk's 2025 acquisition of Invariant Labs. Full verdict needs a free `SNYK_TOKEN` (app.snyk.io); without it it still enumerates servers but degrades to inventory, and stdio servers are auto-declined in non-interactive runs. The old npm `mcp-scan` is unrelated. See `knowledge-base/MCP-SERVER-REGISTRY.md` (security checklist).

**Decision matrix:**

| Result | Action |
|--------|--------|
| Official + all gates pass | Add with full security annotations |
| Community + all gates pass | Add + record a "Community MCP — verify before production" entry in `.mcp.annotations.md` (config files are strict JSON — no comments) |
| Gate 4 (security) fails | DO NOT add. Note in report: "failed security scan" |
| <100 downloads OR unmaintained | DO NOT add. Note as "available but not recommended" |
| No MCP found | Skip. Note in report. Use Context7 for docs |

### Step 5: Configure Discovered MCPs

**Governance branch (check FIRST):** if the project gates credentials/identity — its own MCP vetting registry, locked decisions requiring human credential bootstrap, OAuth/service accounts only a human may create — do NOT edit config files. Output **proposals + a bootstrap checklist** instead: for each passing candidate, record server, pinned version, security posture, required env vars, and the project's registry-gate status in the summary report, and leave `.cursor/mcp.json` / `.mcp.json` untouched. Project governance wins over this prompt, same as codebase-wins.

Otherwise, for each MCP that passes quality check:
- Add to both `.cursor/mcp.json` and `.mcp.json`
- Pin exact version (`@x.y.z`) for npm/stdio servers; remote HTTP servers are version-managed upstream
- Add security posture (read-only / read-write) and credential-requirement entries to `.mcp.annotations.md` — the config files are strict JSON; `//` comments break MCP loading in both IDEs
- Use `${ENV_VAR}` for all credentials
- List required env vars in the summary report

## Phase 3: Generate AI Workflow Files

For each file below: read the template, replace all `{{PLACEHOLDER}}` values with data from Phase 1 analysis, and write the result. Templates are in the `templates/` directory of the kit.

**Important**: Replace `{{AI_KIT_PATH}}` in all generated files with the actual kit path recorded in Phase 0.0. This allows agents to reference the KB, MCP registry, and validation checklist during ongoing work — not just during initial setup.

**Drift firewall**: no fact on the Phase 1.5 `DRIFT-QUARANTINE` list may enter any generated file as current truth. Cite a quarantined fact only with its drift flag; never let it become a setup step, a command, or a platform claim. A generated file that both flags a claim as drift AND asserts it as live elsewhere is a self-contradiction defect.

**Portability rule (N1, since v0.20.0)**: generated files must never embed the generator's own working paths — scratchpad/session directories (`/private/tmp/...`, dash-encoded home-directory session slugs), temp clones, or any path that exists only on the generating machine. The only absolute paths permitted in generated output are the Phase 0.0 `{{AI_KIT_PATH}}` substitution and paths inside the target project itself. Reference/exemplar citations may point only at files verified to exist at generation time (in the kit or the project); a planned-but-not-yet-created doc may be mentioned only hedged as future ("once created at `<path>`"), never cited as existing. Self-check before writing any file: grep your draft for `/tmp`, `/private/`, and your own session directory — any hit is a generation defect.

### 3.1 File Generation Table

| Output File | Template | Condition |
|-------------|----------|-----------|
| `AGENTS.md` | `templates/shared/AGENTS.md.template` | Always |
| `CLAUDE.md` | `templates/claude-code/CLAUDE.md.template` | Always |
| `DECISIONS.md` | `templates/shared/DECISIONS.md.template` | Always (seed with 3-5 detected decisions) |
| `.cursor/rules/base.mdc` | `templates/cursor/rules/base.mdc.template` | If Cursor in scope (Phase 3.4) |
| `.cursor/rules/frontend.mdc` | `templates/cursor/rules/frontend-react.mdc.template` OR `frontend-vue.mdc.template` | Only if frontend exists |
| `.cursor/rules/api.mdc` | `templates/cursor/rules/api-rest.mdc.template` | Only if API layer exists |
| `.cursor/rules/database.mdc` | `templates/cursor/rules/database.mdc.template` | Only if database exists |
| `.cursor/rules/testing.mdc` | `templates/cursor/rules/testing.mdc.template` | Only if tests exist |
| `.cursor/skills/deployment/SKILL.md` | `templates/cursor/skills/deployment.SKILL.md.template` | Only if deployable |
| `.cursor/skills/migration/SKILL.md` | `templates/cursor/skills/migration.SKILL.md.template` | Only if DB migrations exist |
| `.cursor/agents/reviewer.md` | `templates/cursor/agents/reviewer.md.template` | If Cursor in scope (Phase 3.4) |
| `.cursor/agents/tester.md` | `templates/cursor/agents/tester.md.template` | If Cursor in scope (Phase 3.4) |
| `.cursor/agents/seo-auditor.md` | `templates/cursor/agents/seo-auditor.md.template` | If project has SEO needs (public pages, metadata, sitemap) |
| `.cursor/agents/i18n-validator.md` | `templates/cursor/agents/i18n-validator.md.template` | If project has i18n (multiple locales, translation files) |
| `.cursor/agents/security-auditor.md` | `templates/cursor/agents/security-auditor.md.template` | If project has payments, auth, or handles sensitive data |
| `.cursor/mcp.json` | `templates/cursor/mcp.json.template` | If Cursor in scope (Phase 3.4) (+ Phase 2.5 discoveries) |
| `.mcp.json` | `templates/claude-code/mcp.json.template` | Always (+ Phase 2.5 discoveries) |
| `.claude/commands/review-pr.md` | `templates/claude-code/commands/review-pr.md.template` | Always |
| `.claude/commands/deploy.md` | `templates/claude-code/commands/deploy.md.template` | Only if deployable (same condition as the deployment skill) |
| `.claude/commands/update-context.md` | `templates/claude-code/commands/update-context.md.template` | Always |
| `.claude/commands/discover-mcp.md` | `templates/claude-code/commands/discover-mcp.md.template` | Always |
| `.claude/commands/security-review.md` | `templates/claude-code/commands/security-review.md.template` | Always |
| `.claude/commands/tech-debt.md` | `templates/claude-code/commands/tech-debt.md.template` | Always |
| `.claude/commands/workflow-help.md` | `templates/claude-code/commands/workflow-help.md.template` | Always |
| `.claude/commands/status.md` | `templates/claude-code/commands/status.md.template` | Always |
| `.claude/commands/report-friction.md` | `templates/claude-code/commands/report-friction.md.template` | Always (all tiers — the feedback organ). Fill `{{KIT_REPO_SLUG}}` (default `directiveforge/directiveforge`) and `{{PROJECT_NAME}}` (used ONLY so Step 3 knows what to redact — never emitted into output) |
| `.cursor/skills/debug/SKILL.md` | `templates/cursor/skills/debug.SKILL.md.template` | If Cursor in scope (Phase 3.4) |
| `.cursor/skills/refactor/SKILL.md` | `templates/cursor/skills/refactor.SKILL.md.template` | Only if existing codebase (not greenfield) |
| `.cursor/skills/report-friction.SKILL.md` | `templates/cursor/skills/report-friction.SKILL.md.template` | If Cursor in scope (Phase 3.4) — Cursor twin of the `/report-friction` command; fill `{{KIT_REPO_SLUG}}` + `{{PROJECT_NAME}}` (redact-only) |
| `.claude/rules/base.md` | `templates/claude-code/rules/base.md.template` | Always |
| `.claude/rules/quality-gates.md` | `templates/claude-code/rules/quality-gates.md.template` | Always — fill only gates whose commands exist in `{{PACKAGE_FILE}}` scripts (delete phantom rows; ≥1 gate required). No-manifest/docs repos: fill with corpus checks — for the Link-health gate install the CANONICAL `.claude/scripts/check-links.py` verbatim from `generator/presets/docs-ops.md` (never improvise a `grep`-based one-liner: it resolves links from the cwd, mis-reporting every intra-subdir link — HD-6); other corpus checks (markdown lint, index drift) if applicable, else skip with a report note |
| `.cursor/rules/quality-gates.mdc` | `templates/cursor/rules/quality-gates.mdc.template` | If Cursor in scope (Phase 3.4) — same fill rule |
| `.claude/settings.json` | `templates/claude-code/settings.json.template` | Always — fill `{{CMD_*}}` from Phase 1.1; replace the `hooks` value with `{}` if no formatter detected; omit the `CLAUDE_CODE_SUBAGENT_MODEL` key for inherit (v2.1.196+) |
| `.mcp.annotations.md` | `templates/shared/mcp-annotations.md.template` | Always — single copy at project root; covers both MCP configs + the settings-levers appendix |
| `.env.example` | (no template — generated from analysis) | Generate if absent — env var NAMES + purpose comments only, derived from a `process.env` / `os.environ` grep; NEVER values |
| `.claude/agents/simplifier.md` | `templates/claude-code/agents/simplifier.md.template` | Always — mandatory trio (KB-02 §4) |
| `.claude/agents/reviewer.md` | `templates/claude-code/agents/reviewer.md.template` | Always — mandatory trio (KB-02 §4) |
| `.claude/agents/verifier.md` | `templates/claude-code/agents/verifier.md.template` | Always — mandatory trio (KB-02 §4) |
| `.claude/agents/tester.md` | `templates/claude-code/agents/tester.md.template` | Always |
| `.claude/agents/security-auditor.md` | `templates/claude-code/agents/security-auditor.md.template` | If project has payments, auth, or handles sensitive data (same condition as the Cursor twin) |
| `HANDOFF.md` | `templates/shared/HANDOFF.md.template` | Template only — not filled |
| `.ai-kit-manifest.json` | `templates/shared/ai-kit-manifest.json.template` | Always — written LAST, in Phase 8.5, never skipped |
| `.cursorignore` | `templates/cursor/.cursorignore.template` | If Cursor in scope (Phase 3.4) |
| `.cursorindexingignore` | `templates/cursor/.cursorindexingignore.template` | If Cursor in scope (Phase 3.4) |
| **KB-05 decision skills (per maturity tier — see Phase 1.6)** | | |
| `.claude/skills/decision/pre-mortem/SKILL.md` | `templates/skills/decision/pre-mortem/SKILL.md` | Always (BLOCKER skill) |
| `.claude/skills/decision/steelman/SKILL.md` | `templates/skills/decision/steelman/SKILL.md` | Always (BLOCKER skill) |
| `.claude/skills/decision/confidence-calibration/SKILL.md` | `templates/skills/decision/confidence-calibration/SKILL.md` | Always (BLOCKER skill) |
| `.claude/skills/decision/reversibility-check/SKILL.md` | `templates/skills/decision/reversibility-check/SKILL.md` | Always (BLOCKER skill) |
| `.claude/skills/decision/anti-sycophancy-meta/SKILL.md` | `templates/skills/decision/anti-sycophancy-meta/SKILL.md` | Always (BLOCKER skill — auto-fires) |
| `.claude/skills/decision/inversion/SKILL.md` | `templates/skills/decision/inversion/SKILL.md` | Intermediate+ (HIGH skill) |
| `.claude/skills/decision/second-order-thinking/SKILL.md` | `templates/skills/decision/second-order-thinking/SKILL.md` | Intermediate+ (HIGH skill) |
| `.claude/skills/decision/disconfirming-evidence-first/SKILL.md` | `templates/skills/decision/disconfirming-evidence-first/SKILL.md` | Intermediate+ (HIGH skill) |
| `.claude/skills/decision/10-10-10/SKILL.md` | `templates/skills/decision/10-10-10/SKILL.md` | Advanced (MEDIUM skill) |
| `.claude/skills/decision/cost-of-inaction/SKILL.md` | `templates/skills/decision/cost-of-inaction/SKILL.md` | Advanced (MEDIUM skill) |
| `.claude/skills/decision/bayesian-update/SKILL.md` | `templates/skills/decision/bayesian-update/SKILL.md` | Advanced (MEDIUM skill) |
| `.claude/skills/decision/council-3-voice/SKILL.md` | `templates/skills/decision/council-3-voice/SKILL.md` | Advanced AND plan-tier ≥ Max (council burns 15× tokens) |
| `.cursor/skills/decision/*/SKILL.md` (mirror) | (same source as `.claude/skills/decision/*`) | If `.cursor/rules/` exists in project — Cursor mirror per multi-IDE sync mandate (see Phase 3.4) |
| **KB-04 research-engineering skills (Intermediate+)** | | |
| `.claude/skills/research-prompt-writer/SKILL.md` | `templates/cursor/skills/research-prompt-writer.SKILL.md.template` | Intermediate+ |
| `.claude/skills/research-synthesizer/SKILL.md` | `templates/cursor/skills/research-synthesizer.SKILL.md.template` | Intermediate+ |
| `.cursor/skills/research-prompt-writer.SKILL.md` (mirror) | (same source) | If `.cursor/rules/` exists — Cursor mirror |
| `.cursor/skills/research-synthesizer.SKILL.md` (mirror) | (same source) | If `.cursor/rules/` exists — Cursor mirror |
| **KB-04 orchestration + research rules (Intermediate+)** | | |
| `.claude/rules/orchestrator-dispatch.md` | `templates/claude-code/rules/orchestrator-dispatch.md.template` | Intermediate+ |
| `.claude/rules/research.md` | `templates/claude-code/rules/research.md.template` | Intermediate+ |
| `.cursor/rules/orchestrator-dispatch.mdc` (mirror) | (same source — convert to `.mdc` frontmatter) | If `.cursor/rules/` exists |
| `.cursor/rules/research.mdc` (mirror) | (same source — convert to `.mdc` frontmatter) | If `.cursor/rules/` exists |
| **KB-04 architect-prompt template (Intermediate+)** | | |
| `docs/prompts/ARCHITECT_PROMPT.template.md` | `templates/shared/ARCHITECT_PROMPT.md.template` | Intermediate+ — the 14-section IMPL prompt template the project uses for major implementation phases (instantiate as `docs/prompts/IMPL_NN_<topic>.md` when locking work) |
| **KB-07 naming skills (CONDITIONAL — only if Phase 1.5 detected a naming/branding deliverable; install as a set, in pipeline order)** | | |
| `.claude/skills/naming/naming-brief/SKILL.md` | `templates/skills/naming/naming-brief/SKILL.md` | If naming/branding need |
| `.claude/skills/naming/name-generation/SKILL.md` | `templates/skills/naming/name-generation/SKILL.md` | If naming/branding need |
| `.claude/skills/naming/linguistic-screen/SKILL.md` | `templates/skills/naming/linguistic-screen/SKILL.md` | If naming/branding need |
| `.claude/skills/naming/trademark-clearance/SKILL.md` | `templates/skills/naming/trademark-clearance/SKILL.md` | If naming/branding need |
| `.claude/skills/naming/availability-gate/SKILL.md` | `templates/skills/naming/availability-gate/SKILL.md` | If naming/branding need |
| `.claude/skills/naming/name-scorecard/SKILL.md` | `templates/skills/naming/name-scorecard/SKILL.md` | If naming/branding need |
| `.cursor/skills/naming/*/SKILL.md` (mirror) | (same source as `.claude/skills/naming/*`) | If naming need AND `.cursor/rules/` exists — Cursor mirror per multi-IDE sync mandate (see Phase 3.4) |
| **KB-08 design skills (CONDITIONAL — only if Phase 1.5 detected a frontend/design/UX deliverable; install as a chain)** | | |
| `.claude/skills/design/design-architect/SKILL.md` | `templates/skills/design/design-architect/SKILL.md` | If frontend/design/UX deliverable |
| `.claude/skills/design/design-engineer/SKILL.md` | `templates/skills/design/design-engineer/SKILL.md` | If frontend/design/UX deliverable |
| `.claude/skills/design/design-reviewer/SKILL.md` | `templates/skills/design/design-reviewer/SKILL.md` | If frontend/design/UX deliverable |
| `.claude/skills/design/elevation-workflow/SKILL.md` | `templates/skills/design/elevation-workflow/SKILL.md` | If frontend/design/UX deliverable |
| `.cursor/skills/design/*/SKILL.md` (mirror) | (same source as `.claude/skills/design/*`) | If design need AND Cursor in scope — mirror per multi-IDE sync mandate (see Phase 3.4) |
| `docs/design/DESIGN-SPINE.md` | `templates/shared/DESIGN-SPINE.md.template` | If frontend/design/UX deliverable — template only, the PROJECT authors it from its own concept; no elevation work before the spine exists |

**Row-condition legend (all gates resolve via Phase 3.4):**

- **Always** — generate for every project (subject to the IDE gate below).
- **If Cursor in scope (Phase 3.4)** — generate only when Phase 3.4 resolves Cursor as an active IDE (`.cursor/` exists, or the operator explicitly confirms Cursor for a greenfield setup — when neither directory exists, ASK rather than assume "both"). **If this generator session is itself running in Claude Code (or Cursor), that IDE is in scope regardless of directory existence.** Every `.cursor/*`, `.cursorignore`, `.cursorindexingignore` row carries this gate implicitly, even when its condition names another trigger — "Only if frontend exists" means *Cursor in scope AND frontend exists*. Symmetrically, `.claude/*` rows require Claude Code in scope per Phase 3.4.
- **Only if deployable** — the project has a real deploy target (deployment config, CI/CD deploy job, hosting manifest). Gates both the deployment skill and the `deploy.md` command; a non-deployable project gets neither. **Deploy-from-artifacts rule**: every `{{CMD_DEPLOY_*}}` value and platform claim in the deploy skill/command derives ONLY from deploy artifacts (Dockerfile, CI/CD configs, `Procfile`, `fly.toml`/`vercel.json`/`railway.json`, infra scripts, lockfiles). README deployment prose is an UNVERIFIED claim — it enters the generated deploy files only after cross-checking against those artifacts; on conflict the artifact wins and the README claim is quarantined (Phase 1.5). Never author a deploy command from README prose alone.
- Phase 1.1 no-manifest branch fired → `deploy` / `debug` / `refactor` / `migration` rows are out-of-scope regardless of other conditions.

For stacks without a matching template (Go, Rust, Django, etc.), create `.cursor/rules/*.mdc` files from scratch using KB-02 §2 formatting rules.

### 3.4 Multi-IDE skill installation path conventions

The kit ships skills under three template trees with intentionally different naming conventions for different reasons:

| Source | Convention | Notes |
|---|---|---|
| `templates/cursor/skills/<name>.SKILL.md.template` | Flat-file, `.template` extension | Legacy single-file skill format. Used by `debug`, `deployment`, `migration`, `refactor`, `research-prompt-writer`, `research-synthesizer`. |
| `templates/skills/decision/<name>/SKILL.md` | Directory-with-SKILL.md | Modern multi-IDE-portable format. Used by the 12 KB-05 decision skills. No `.template` extension because the content is already shipping-quality (not template-with-placeholders). |
| `templates/skills/naming/<name>/SKILL.md` | Directory-with-SKILL.md | Same modern format as the decision skills. Used by the 6 KB-07 naming skills (`naming-brief`, `name-generation`, `linguistic-screen`, `trademark-clearance`, `availability-gate`, `name-scorecard`). Shipping-quality, no `.template` extension. Installed only when Phase 1.5 detects a naming/branding need. |
| `templates/claude-code/rules/<name>.md.template` + `templates/cursor/rules/<name>.mdc.template` | Per-IDE | Rule templates ship per-IDE; sync mandate (below) keeps them parallel. |

**Installation destination rules per IDE:**

| Asset class | Claude Code destination | Cursor destination |
|---|---|---|
| Decision skills (KB-05) | `.claude/skills/decision/<name>/SKILL.md` | `.cursor/skills/decision/<name>/SKILL.md` |
| Naming skills (KB-07, conditional) | `.claude/skills/naming/<name>/SKILL.md` | `.cursor/skills/naming/<name>/SKILL.md` |
| Research skills (KB-04) | `.claude/skills/<name>/SKILL.md` | `.cursor/skills/<name>.SKILL.md` (legacy flat) |
| Other skills (debug, deployment, etc.) | `.claude/skills/<name>/SKILL.md` | `.cursor/skills/<name>.SKILL.md` (legacy flat) |
| Rules | `.claude/rules/<name>.md` | `.cursor/rules/<name>.mdc` (with `.mdc` frontmatter) |
| Agents | `.claude/agents/<name>.md` (YAML frontmatter: `name`/`description`/`tools`) | `.cursor/agents/<name>.md` (Markdown-only, tools in body) |
| Commands | `.claude/commands/<name>.md` | (Cursor has no equivalent) |
| Architect prompt template | `docs/prompts/ARCHITECT_PROMPT.template.md` | (same — IDE-neutral location) |

**Multi-IDE sync mandate.** Projects that use BOTH Cursor AND Claude Code must keep `.claude/` and `.cursor/` mirrors in lock-step. When a skill, rule, or command changes on one side, it changes on the other in the same commit. Drift between the two is a defect. Agent twins: `reviewer` / `security-auditor` / `tester` ship as cross-IDE twins (lock-step edits, same commit); `simplifier` / `verifier` ship Claude-Code-only — for Cursor-only projects, adapt by moving the frontmatter `tools:` into a body `## Tools` section (the reverse transform; recipe in `workflows/MIGRATION-CURSOR-CLAUDE.md`).

If the project uses **only Cursor** (no `.claude/` directory present), install Cursor versions only — unless this session is running in Claude Code (session evidence puts Claude Code in scope).
If the project uses **only Claude Code** (no `.cursor/` directory present), install Claude Code versions only.
**Stale-artifact caveat**: directory existence is weak evidence in BOTH directions — an organically grown `.cursor/` (misconfigured frontmatter, dead globs, empty attachment fields) does not prove Cursor is in active use, and `.claude/` being absent does not prove Claude Code is not. When `.cursor/` artifacts look stale and the generator runs in Claude Code, ASK the operator about IDE scope. Post-install scope corrections follow `workflows/MIGRATION-CURSOR-CLAUDE.md`.
If both directories exist or both are being created fresh, install both + add a rule-sync mandate line to the project's `CLAUDE.md` (per Phase 3.5 below).

### 3.5 Decision-skill router rule injection (mandatory when any KB-05 skill is installed)

KB-05 skills are invisible to the agent unless the project's rule scaffolding documents that they exist and when to fire which one. After installing the decision skills in Phase 3.1, **inject a new rule file** documenting the router and the council cost gate:

**Generate:** `.claude/rules/decision-skills.md` (+ `.cursor/rules/decision-skills.mdc` if Cursor is in scope)

**Required content** (~40-60 lines):

```markdown
# Decision Skills — When to Fire Which

> KB-05 ships {{N}} decision skills under `.claude/skills/decision/`. This rule documents the router so the agent knows when to invoke them. Doctrine: {{KIT_PATH}}/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md.

## Anti-sycophancy meta-skill (auto-fires FIRST)

On any user message matching these phrase patterns, fire `decision/anti-sycophancy-meta` BEFORE evaluating content:

- "what do you think of my X" / "is my idea good" / "review my plan"
- "is this a good idea?" / "should I do X?"

The meta-skill detects ownership signal, re-frames as pressure-test (not validation), then routes to the appropriate downstream skill. Skip ONLY for emotional-support framings ("feeling stuck", "vent", hedging language present + ownership absent).

## Phrase-mapping router (after meta-skill clears)

| User says | Route to |
|---|---|
| "what could go wrong" / "before we launch" | `decision/pre-mortem` |
| "should we commit" / "go/no-go" | `decision/reversibility-check` |
| "argue against this" / "what's the counter-case" | `decision/steelman` |
| "how confident are you" / "probability" | `decision/confidence-calibration` |
{{IF_INTERMEDIATE_PLUS}}| "downstream effects" / "knock-on" | `decision/second-order-thinking` |
| "is X a good idea (give me critique)" | `decision/inversion` |
| "is my email good" / "quick review" | `decision/disconfirming-evidence-first` |{{END_IF}}
{{IF_ADVANCED}}| "10 minutes 10 months 10 years" | `decision/10-10-10` |
| "is now the right time" / "cost of waiting" | `decision/cost-of-inaction` |
| "should I revise on new info" | `decision/bayesian-update` |
| "I'm stuck between A B C" | `decision/council-3-voice` (after reversibility-check Type-1) |{{END_IF}}
{{IF_NOT_ADVANCED}}| Type-1 verdict from `reversibility-check` (no council installed at this tier) | `decision/steelman` + `decision/pre-mortem` sequentially, then recommend a DECISIONS entry |{{END_IF}}

LLM fallback: if no phrase matches AND user message contains decision verbs (should/could/might) + question mark, pick the single best skill by reading the YAML descriptions of installed skills.

{{IF_COUNCIL_INSTALLED}}
## Council cost gate

`decision/council-3-voice` burns ~15× tokens of a single chat call (Anthropic Engineering, *How we built our multi-agent research system*, Jun 13 2025). Invoke ONLY when:

- ≥3 mutually-exclusive options, AND options_mutually_exclusive=true, OR
- `decision/reversibility-check` returns Type-1 (irreversible), OR
- User stated stakes > threshold AND plan-tier supports it

Never invoke for tone checks, single-fact lookups, code reviews of <50-line diffs, emotional-support replies, or anything where the cost of being wrong is less than the cost of 15× tokens.
{{END_IF}}

## Surface fit per skill

Each skill declares `surface:` in its frontmatter. Respect the declaration:
- Lightweight skills (10-10-10, cost-of-inaction, disconfirming-evidence-first, bayesian-update) → Chat
- Mid-weight (inversion, second-order, steelman, pre-mortem, calibration, reversibility) → Chat or Code
- Heavy (council-3-voice) → Cowork or Code (Task tool required)
- Meta (anti-sycophancy-meta) → all surfaces

If the current surface doesn't support the right skill, propose a surface handoff using `{{KIT_PATH}}/prompts/code-handoff-prompts.md` or `{{KIT_PATH}}/prompts/cowork-browser-operations.md` patterns.

## References

- Full catalog + procedures: {{KIT_PATH}}/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md §3
- Per-skill spec: `.claude/skills/decision/<name>/SKILL.md`
- Evidence base: {{KIT_PATH}}/research/2026-05-26-decision-techniques.md
```

The `{{IF_INTERMEDIATE_PLUS}}` / `{{IF_ADVANCED}}` / `{{IF_COUNCIL_INSTALLED}}` placeholders are conditional rendering — include the gated sections only if the corresponding skills were installed in Phase 3.1.

**No-phantom-route rule (applies to EVERY router rule and EVERY installed skill body — decision / naming / design / research).** At install time, every cross-skill route mentioned in an installed skill's description OR body must resolve to a sibling that is actually installed at this tier. When the tier excludes the target, do ONE of: (a) rewrite the route to the nearest installed equivalent, or (b) append a tier-aware fallback line (`at this tier, do <X> inline instead`). This generalizes the v0.17.0 reversibility-fallback (reversibility-check → council: `steelman` + `pre-mortem` when council is absent; router `{{IF_NOT_ADVANCED}}` row above) to ALL cross-references — no installed skill may route to a non-installed one.

### 3.6 Update Phase 3.3 Quality Gates — Add Decision Skills

Add to the existing Phase 3.3 quality gates:

- **Decision skills**: each `SKILL.md` has YAML frontmatter with `name` (kebab-case matching directory) + `description` ("pushy" per Anthropic Skills convention) + `severity` + `confidence` + `surface`. Procedure section uses numbered steps verbatim from KB-05 §3 catalog. Anti-patterns + When-NOT-to-use sections required.
- **Decision-skill router rule** (`decision-skills.md`): all installed skills appear in the phrase-mapping table. Council cost gate present iff council skill installed. Surface fit table present iff ≥3 skills installed.
- **Naming-skill router rule** (`naming-skills.md`, only if the naming pack was installed): all 6 skills appear in pipeline order; the two human-in-the-loop gates (attorney opinion, native-speaker slang verification) and the two §1 guardrails (`.com` is not a gate; "is it right?" not "do I like it?") are present.
- **Design-skill router rule** (`design-skills.md`, only if the design pack was installed): chain order present (architect → engineer → reviewer, orchestrated by elevation-workflow); the three hard gates (verify-by-measurement, locks-are-sacred, no-taste-polls) present; the ≤3-4 batching rule present; the spine pointer present.
- **No phantom routes** (all router rules + installed skill bodies): every cross-skill route resolves to a sibling installed at this tier (no-phantom-route rule above). Routes to tier-excluded siblings are either rewritten to the nearest installed equivalent or carry a tier-aware fallback line.

### 3.7 Naming-skill router rule injection (mandatory when the KB-07 naming pack is installed)

The 6 naming skills are an ordered pipeline, not independent reflexes — they must run in sequence, and two stages have hard human-in-the-loop gates. After installing them in Phase 3.1, **inject a rule file** documenting the pipeline, the router, and the gates (skip this entirely if the naming pack was not installed):

**Generate:** `.claude/rules/naming-skills.md` (+ `.cursor/rules/naming-skills.mdc` if Cursor is in scope)

**Required content** (~35-50 lines):

```markdown
# Naming Skills — Pipeline Order & Gates

> KB-07 ships 6 naming skills under `.claude/skills/naming/`. They run as an ordered pipeline, not as independent reflexes. Doctrine: {{KIT_PATH}}/knowledge-base/KB-07-BRAND-NAMING.md.

## Pipeline order (do not skip stages)

1. `naming/naming-brief` — intake; locks "is it right?" not "do I like it?". No generation without a brief.
2. `naming/name-generation` — high-volume, judgment-free candidates. Emits an UNGATED list; makes NO availability/trademark claims.
3. `naming/linguistic-screen` — cross-language + script screen. BLOCKER on a primary-market Fail. Flags non-Latin slang for a human linguist.
4. `naming/trademark-clearance` — Abercrombie classification + USPTO/EUIPO/WIPO knockout. BLOCKER. Attorney opinion required before any filing.
5. `naming/availability-gate` — RDAP/registrar + handles + branded-SERP + AI-disambiguation. Never claims a domain free without a live lookup; never hard-fails on bare `.com`.
6. `naming/name-scorecard` — score gated survivors on the §8 rubric; surface polarizing-but-strong names; recommend top 3.

## Phrase-mapping router

| User says | Route to |
|---|---|
| "help me name" / "name my product" / "start a naming project" | `naming/naming-brief` |
| "generate names" / "brainstorm names" | `naming/name-generation` (a brief must exist first) |
| "check meanings" / "will this offend anyone" / "screen for language" | `naming/linguistic-screen` |
| "trademark check" / "is it clear" / "can we register this" | `naming/trademark-clearance` |
| "check availability" / "is the domain free" / "are the handles open" | `naming/availability-gate` |
| "score the names" / "rank the shortlist" / "which should we pick" | `naming/name-scorecard` |

## Human-in-the-loop gates (never auto-clear)

- **Attorney opinion** before filing — `trademark-clearance` produces a knockout, not a clearance.
- **Native-speaker verification** for non-Latin slang and culturally-loaded meanings — `linguistic-screen` flags, it does not clear, those cells.
- **Live tooling required** for availability — if no RDAP/registrar tool is present, hand off to a Cowork/Code surface; never guess a domain's status.

## Two non-negotiable guardrails (KB-07 §1)

- The exact-match `.com` is a preference, not a gate — never kill a strong name on `.com` unavailability alone (Placek: it is "just an area code").
- The selection criterion is "is it right?" (fit + defensibility), never "do we like it?" — route committee-consensus pressure to KB-05 `decision/anti-sycophancy-meta`.

## Surface fit per skill

Each skill declares `surface:`. `naming-brief` / `name-generation` / `name-scorecard` → Chat or Code. `linguistic-screen` / `trademark-clearance` / `availability-gate` → Cowork or Code (they need live web search, trademark databases, and RDAP/registrar APIs). If the current surface lacks the tools, propose a handoff using {{KIT_PATH}}/prompts/code-handoff-prompts.md or {{KIT_PATH}}/prompts/cowork-browser-operations.md.

## References

- Doctrine + procedures: {{KIT_PATH}}/knowledge-base/KB-07-BRAND-NAMING.md (§11 pipeline, §5/§6/§7/§8 protocols)
- Per-skill spec: `.claude/skills/naming/<name>/SKILL.md`
```

### 3.8 Design-skill router rule injection (mandatory when the KB-08 design pack is installed)

The 4 design skills are an ordered chain with hard measurement gates, not independent reflexes. After installing them in Phase 3.1, **inject a rule file** documenting the chain, the router, and the gates (skip this entirely if the design pack was not installed):

**Generate:** `.claude/rules/design-skills.md` (+ `.cursor/rules/design-skills.mdc` if Cursor is in scope)

**Required content** (~35-50 lines):

```markdown
# Design Skills — Chain Order & Gates

> KB-08 ships 4 design skills under `.claude/skills/design/`. They run as a chain, not as independent reflexes. Doctrine: {{KIT_PATH}}/knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md.

## Chain order (do not skip stages)

1. `design/design-architect` — read-only adversarial critique vs a NAMED best-in-world reference; produces the ranked implementNow list. Refuses without a spine.
2. `design/design-engineer` — implements the list VERBATIM; reuse-first, extract on ≥2× recurrence, leave-cleaner; never invents scope.
3. `design/design-reviewer` — the MEASURING merge-gate: transforms, computed styles per breakpoint (locked-width byte-parity), CLS, axe + Lighthouse on the production build, reduced-motion parity, lock-literal grep. Identity-coherent Y/N.
4. `design/elevation-workflow` — orchestrates 1→2→3 for a full surface pass; multi-critic fan-out batched ≤3-4 agents.

## Phrase-mapping router

| User says | Route to |
|---|---|
| "elevate this page" / "make it best-in-world" / "raise the design quality" | `design/elevation-workflow` |
| "critique this" / "why does this feel flat/loud" / "plan the elevation" | `design/design-architect` |
| "implement the plan" / "apply the findings" | `design/design-engineer` |
| "design review" / "does this merge" / "verify the elevation" | `design/design-reviewer` |
| "build a new section/element" | read `docs/design/DESIGN-SPINE.md` first, then `design/design-architect` |

## Hard gates (never auto-clear)

- **Verify by measurement** — no visual/motion/responsive claim merges without a measured number from the real browser (production build for perf). Assertion is not verification.
- **Locks are sacred** — a change that breaks a locked invariant (motion budget, brand-color scope, crown laws) is wrong by definition, however good it looks; auto-reject.
- **No taste-polls** — critique vs named references with measured gaps; the owner signs off on the measured RESULT, never on an option menu.

## The spine

Read `docs/design/DESIGN-SPINE.md` before building ANY designed element. If it is still the unauthored template, author it from the project's concept first — no elevation work before the spine exists.

## Surface fit

All four skills → Code (they need the real browser: hydration, measurement, production builds). Chat may draft critique prompts, never render verdicts.

## References

- Doctrine: {{KIT_PATH}}/knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md (§3 spine, §4 recipe, §5 measurement, §6 no-taste-polls, §7 primitives/locks)
- Per-skill spec: `.claude/skills/design/<name>/SKILL.md`
```

### 3.2 Additional Files (No Template Needed)

- `.cursor/rules/personal.mdc` — add to `.gitignore` only (developers create their own)
- Hooks live in `.claude/settings.json` (template-provided — see the settings row in §3.1); if no formatter is detected, the generator replaces the `hooks` value with `{}`
- `.claude/rules/` — only for temporary rules (active migration, feature flags)

### 3.3 Quality Gates Per File Type

- **CLAUDE.md**: Maximum 150 lines; must contain, non-empty, the six core sections from `templates/claude-code/CLAUDE.md.template` — Build & Test Commands, Architecture, Key Conventions, Common Pitfalls, Session Protocol, Definition of Done; most critical constraints at TOP (not buried in middle); no content obvious from package.json. There is no minimum line count — a short file carrying all six sections passes
- **base.mdc**: Under 30 content lines, `alwaysApply: true`, under 500 tokens total
- **Domain .mdc**: Under 40 content lines each, correct glob patterns verified against actual directories, code examples 3-5 lines. Files over 40 lines are DOCUMENTATION, not rules — split them. **Exception — router/dispatch rules** (`decision-skills`, `naming-skills`, `design-skills`, `ai-workflow`, `orchestrator-dispatch`): these are routing tables, not convention rules — exempt from the 40-line gate, own ceiling **100 lines**, and must never be `alwaysApply`/unconditionally loaded
- **Skills**: Numbered steps, `## Gotchas` section (≥2 items), `## When NOT to Use` section
- **Agents**: One-sentence role, `## Constraints` with NEVER/ALWAYS, and least-privilege tool access per the KB-02 §4 tool matrix (auditor/reviewer = Read+Grep, Bash only command-scoped read-only; generator = Write scoped to output file class; fixer = Edit + verification Bash; verifier = Bash+Read only). Every Bash grant names its allowed command families — an unqualified `Bash` line fails this gate
- **MCP configs**: Strict JSON (must pass `python3 -m json.tool` — comments break MCP loading), pinned versions for npm/stdio servers, `${ENV_VAR}` for credentials, a security-posture entry for every server in `.mcp.annotations.md`

## Phase 4: Existing File Handling

(continues below; Phase 4.5 runs after Phase 4 cleanup)

**Principle: NEVER delete files — move to `docs/archive/` if not needed. But DO NOT blindly preserve broken or bloated files. Audit everything.**

**Mandatory audit trail — emit `PRE-EXISTING-MODIFIED.txt` at the project root** (same home as `.ai-kit-manifest.json` / `OWNER_BRIEF.md`, committed with the install). One line per pre-existing path this run modified, each with its backup path (`README.md → README.md.backup`) or an `append-only` marker (`DECISIONS.md → append-only`). Write an empty file if nothing pre-existing was touched. This makes the backup protocol below mechanically checkable post-hoc.

If Phase 0 found NO existing files, skip this phase entirely (still emit an empty `PRE-EXISTING-MODIFIED.txt`).

### 4.1 Root Directory Cleanup

If the project root has non-essential .md files (old prompts, audits, one-time guides, implementation specs):
- Classify each as: **active context** (keep), **reference docs** (move to `docs/`), **obsolete** (move to `docs/archive/`)
- Before archiving, extract any valuable decisions/conventions into DECISIONS.md or CLAUDE.md
- After cleanup, root should have ONLY: CLAUDE.md, AGENTS.md, DECISIONS.md, HANDOFF.md, README.md (+ code files) — plus any file classified as active context in the step above (e.g., a master plan); never archive a file other root docs link to

### 4.2 Existing Rule Files Audit

For each existing `.cursor/rules/*.mdc` file:

0. Check FIRST: **does this rule ever attach?** Frontmatter present; `description` OR `globs` OR `alwaysApply` set; globs match real paths (a zero-match glob never fires); `alwaysApply` files within the token budget. On organically grown repos this is the modal defect → classification `fix-attachment-config`
1. Read fully. Check: does content match the CURRENT codebase? (verify paths, imports, patterns exist)
2. Check: is it actionable rules (DO/DO NOT) or documentation/tutorials?
3. Check: line count — is it under 40 lines? (router/dispatch rules: 100-line ceiling)
4. Check: does it overlap with other rule files or newly generated rules?

| File State | Action |
|-----------|--------|
| Never attaches (empty/missing frontmatter, dead globs) | Fix the attachment config first, then re-classify (`fix-attachment-config`) |
| Valid rules, under 40 lines (router/dispatch: under 100), no overlap | Keep as-is |
| Valid rules but OVER 40 lines (router/dispatch: over 100) | Extract 10-15 most critical DO/DO NOT rules. Move rest to `docs/` |
| Pure documentation (no actionable rules) | Move to `docs/`, remove from .cursor/rules/ |
| Outdated (references paths/patterns that don't exist) | Fix or archive |
| Overlaps with another rule or generated file | Merge unique content, archive duplicate |

### 4.3 Other Existing Files

| Existing File | Protocol |
|---------------|----------|
| **ANY pre-existing file not covered by a more specific row below** (incl. `README.md` and any `docs/*`) | Back up as `<name>.backup` sibling BEFORE any modification, OR modify strictly append-only (never rewrite in place). Deletion is never allowed — archive per the Phase 4 principle. This is the catch-all: a file with no specific row still gets backup-or-append protection. |
| `CLAUDE.md` | Read fully. Extract project-specific content. Merge into new template output. Back up as `CLAUDE.md.backup` before overwriting. |
| `AGENTS.md` | Same as CLAUDE.md — read, extract, merge, backup. |
| `.cursorrules` (legacy) | Read fully. Distribute content into appropriate `.cursor/rules/*.mdc` files. Rename to `.cursorrules.legacy`. |
| `.cursor/mcp.json` or `.mcp.json` | Read existing. Preserve configured servers. Add new recommended servers. Never remove servers. |
| `DECISIONS.md` | Read existing. Append new decisions only. Never overwrite existing entries. Applies wherever the ledger lives (root, `governance/`, `docs/` — per Phase 0.2) and whatever its entry format — never generate a second root ledger that forks an existing source of truth. |
| `.cursorignore` / `.cursorindexingignore` | Read existing. Merge in missing entries. Never remove existing entries. |
| `.claude/commands/` or `.claude/rules/` | Keep all existing files. Add new ones that don't conflict. |
| `.claude/skills/` or `.claude/agents/` entry the generator would install | Diff against the kit template. Byte-identical → keep, record "already installed (current)". Project-customized → keep the project version. Older than a newer kit template → keep + offer the upgrade in the summary report; never overwrite silently. |
| `HANDOFF.md` exists and is filled | Keep as-is — it is live session state, not a template slot. The generation-table row ("Template only — not filled") applies only when no HANDOFF.md exists. |

## Phase 4.5: Per-project surface routing integration (Intermediate+ only)

For Intermediate and Advanced projects, install the per-project surface routing rule that maps the project's recurring task patterns to Chat / Cowork / Code surfaces.

**Skip this phase entirely for Starter tier.**

### Mechanics

The kit ships a paste-ready dispatcher at `{{KIT_PATH}}/prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md` (~130 lines). It is a Cowork-session prompt that reads the kit's surface-routing knowledge + the target project's CLAUDE.md + `.claude/rules/*` and produces `.claude/rules/ai-workflow.md` (~60 lines) + Cursor mirror at `.cursor/rules/ai-workflow.mdc`.

### Execution

You — the generator agent — do NOT run the integration prompt directly inside this generator session. The integration is best executed in a fresh Cowork session because (a) Cowork has the file system + multi-app affordances the integration prompt assumes, (b) it needs ~5-10 minutes of focused work that would dilute this generator session's flow, (c) the output is a small targeted rule file, not a large generation.

Instead, at the end of this generator run, **output a paste-ready handoff block** the operator can drop into a fresh Cowork session:

```
After kit install completes, open Cowork at this project root and paste:

Open the DirectiveForge kit at {{KIT_PATH}} and read prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md. Execute its 6 steps end-to-end against THIS project to install per-project surface routing (.claude/rules/ai-workflow.md + .cursor/rules/ai-workflow.mdc mirror). Commit when done.
```

### Verification

After the operator runs the surface-routing integration, the project should have:
- `.claude/rules/ai-workflow.md` (~40-60 lines) documenting per-project task → surface mapping
- `.cursor/rules/ai-workflow.mdc` (Cursor mirror if `.cursor/rules/` exists)
- A reference in CLAUDE.md to the new rule file

Add to the Phase 7 summary report whether the operator has performed the integration. If not yet, flag as "pending operator action."

## Phase 5: Validation

After generating all files, run validation:

1. Read `generator/VALIDATION_CHECKLIST.md` and execute every check in all sections; sections 14-16 may be Pending/N-A by tier (§17 runs after Phase 8.5 writes the manifest)
2. Fix any failures before reporting completion

Critical validations to run immediately:

```bash
wc -l CLAUDE.md                                    # Must be ≤ 150
grep -rE "sk-[A-Za-z0-9]{8,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|Bearer [A-Za-z0-9._-]{16,}|password=[^${]|secret=[^${]" CLAUDE.md AGENTS.md .cursor/ .claude/ .mcp.json .ai-kit-manifest.json 2>/dev/null
# ↑ Must return nothing (no secrets). Value-shaped patterns — bare "sk-" matches
#   ordinary English ("task-to-route") and false-positives; `${ENV_VAR}` refs are allowed.
python3 -m json.tool < .mcp.json && python3 -m json.tool < .claude/settings.json
# ↑ Both must parse — strict JSON, no comments (add .cursor/mcp.json if Cursor in scope)
```

- Verify every command in CLAUDE.md exists in package.json scripts
- Verify every glob pattern in `.mdc` files matches actual directories
- Verify no fact is duplicated between AGENTS.md and CLAUDE.md
- Run `uvx snyk-agent-scan@latest` on final MCP configs (Snyk Agent Scan, PyPI via `uvx`; full verdict needs `SNYK_TOKEN`)

**Checklist-generation for generated docs** ("unit tests for English"): for each major generated doc — CLAUDE.md, AGENTS.md, OWNER_BRIEF.md if present, the decision-router rule — derive 3-5 falsifiable checks from the doc's own claims (every command it names exists in scripts; every path it cites exists; every version it states matches the lockfile) and execute them. Record pass/fail per doc for the Phase 9 Validation Results.

Record pass/fail status for the summary report.

## Phase 6: Cost & Session Optimization

(then continues with Phase 7 — Vigilance bootstrap and Phase 8 — Mission-dispatch pattern setup, both Advanced-tier only)

Add these to the generated CLAUDE.md:

**Session management**:
- "Start each session: `git log --oneline -20` to understand recent changes"
- "Fresh session per task — don't chain unrelated work in one session"
- "If context feels exhausted (repetitive errors, forgetting prior instructions): start a new session"
- "Before complex tasks: use Plan mode to align on approach before writing code"

**Corrections become rules**: "When corrected, remember the correction. If project-wide, add to Common Pitfalls."

**Commit format**: Include a commit format example matching the project's convention (conventional commits if no existing convention detected).

## Phase 7: Vigilance discipline bootstrap (Advanced tier only — optional opt-in)

The vigilance discipline (`{{KIT_PATH}}/workflows/KIT-VIGILANCE.md`) is the kit's self-improvement loop. It catches silent staleness in the project's locked decisions, rules, and patterns by running a daily curated source scan + weekly synthesis + monthly integration cycle, all on cloud-hosted Claude Code Routines that fire independent of the operator's laptop state.

**Skip this phase entirely for Starter and Intermediate tiers.** For Advanced tier, OFFER the bootstrap; the operator decides whether to opt in.

### 7.1 Generate the operator-facing offer

Output this block in the Phase 9 summary report:

```
## Optional: Bootstrap project-specific vigilance discipline?

Your project is classified as Advanced tier. The vigilance discipline (3-cadence daily/weekly/monthly scan + Claude Code Routines) catches silent staleness in the kit's locked patterns. It will:

1. Daily 08:00 local — scan a project-specific curated source list, severity-tag findings, commit a digest to vigilance/feed/daily/YYYY-MM-DD.md
2. Sunday 09:00 local — synthesize the past 7 daily digests into ≤5 action candidates at vigilance/feed/weekly/YYYY-WW.md
3. 1st of month 10:00 local — produce architect prompts for integration candidates at vigilance/feed/monthly/YYYY-MM.md

Cost: 3 Routines on claude.ai/code/scheduled (Pro: 5/day budget; Max: 15/day; usage ~1.2/day across the three).

Want me to bootstrap it now? (yes/no)
```

### 7.2 If operator says yes — install the bootstrap

Generate:

1. `workflows/KIT-VIGILANCE.md` — copy the kit's doctrine to the project's `workflows/` (or `docs/workflows/` if no top-level `workflows/`). Add a note at top: "Adapted from {{KIT_PATH}}/workflows/KIT-VIGILANCE.md; re-sync quarterly."

2. `vigilance/WATCHLIST.md` — draft a PROJECT-SPECIFIC watchlist. Start from `{{KIT_PATH}}/vigilance/WATCHLIST.md` as the template, then specialize:
   - Category 1 (vendor channels) — keep as-is (Anthropic / OpenAI / etc. apply to every project)
   - Category 2 (framework releases) — REPLACE with the project's actual stack. Identify from Phase 1: if Next.js, watch `vercel/next.js/releases.atom`. If FastAPI, watch `tiangolo/fastapi/releases.atom`. If Medusa, Sanity, Stripe, etc. — watch each of their release feeds.
   - Category 3 (research) — keep arXiv categories relevant to project domain
   - Category 4 (practitioner blogs) — keep general AI practitioner set
   - Category 5 (community) — keep r/LocalLLaMA + r/ClaudeAI; add domain-specific subreddits if relevant
   - Categories 6-8 — keep as-is or trim per project relevance

3. `vigilance/feed/{daily,weekly,monthly,quarterly}/` directories with `.gitkeep` files

4. `vigilance/state/` directory (per-source delta state, gitignored)

5. Update `.gitignore` to exclude `vigilance/state/`

6. `prompts/dispatch/DAILY_PULSE_SCAN.md`, `WEEKLY_SYNTHESIS.md`, `MONTHLY_INTEGRATION.md` — copy from `{{KIT_PATH}}/prompts/dispatch/`. These reference vigilance/WATCHLIST.md and run against the project's repo. No edits needed; they use repo-relative paths.

7. Output 3-routine setup instructions in the Phase 9 summary report, pointing the operator at `claude.ai/code/scheduled` with the exact prompts to paste for each routine (Daily Pulse / Weekly Synthesis / Monthly Integration), the cron expressions (`0 8 * * *`, `0 9 * * 0`, `0 10 1 * *` local time), the "Allow unrestricted git push" permission, and the rule that each Routine's Instructions field should explicitly say "git checkout main; do NOT create a feature branch" to prevent the `claude/`-branch issue the kit's own setup encountered.

### 7.3 If operator says no

Skip the bootstrap. Note in Phase 9 summary that vigilance was offered and declined. Operator can opt in later by re-running this phase.

## Phase 8: Mission-dispatch pattern setup (Advanced tier only — optional opt-in)

The mission-dispatch pattern (`{{KIT_PATH}}/prompts/dispatch/` folder convention + `{{KIT_PATH}}/prompts/chat-research-missions.md` template) lets the project dispatch its own Chat Research missions for citation-grounded research that needs to land in the project's repo as committed dossiers.

**Skip this phase for Starter and Intermediate tiers.** For Advanced tier, OFFER the pattern setup.

### 8.1 Generate the operator-facing offer

```
## Optional: Install mission-dispatch pattern?

Your project is Advanced tier. When you need citation-grounded research (regulatory verification, competitive analysis, technical-upgrade scan, market sizing), the mission-dispatch pattern gives you:

1. A template at prompts/chat-research-missions.md showing how to write a research mission
2. A prompts/dispatch/ folder convention for runnable mission instances
3. The 8-gate anti-hallucination framework from KB-04 §3.1 applied to each mission's output

Output ends up as a dossier at research/YYYY-MM-DD-<topic>.md the project can cite.

Want me to install the pattern? (yes/no)
```

### 8.2 If yes — install

Generate:

1. `prompts/chat-research-missions.md` — copy from `{{KIT_PATH}}/prompts/chat-research-missions.md` (the generic template)
2. `prompts/code-handoff-prompts.md` — copy from `{{KIT_PATH}}/prompts/code-handoff-prompts.md` (sibling pattern for Code-handoff prompts)
3. `prompts/cowork-browser-operations.md` — copy from `{{KIT_PATH}}/prompts/cowork-browser-operations.md` (sibling for Cowork ops prompts)
4. `prompts/dispatch/` directory with a `.gitkeep` and a README explaining the convention (runnable mission instances live here; the templated patterns live one level up)
5. `research/` directory (where dossiers land) with a README pointing to the kit's `research/` for example dossiers (e.g., `{{KIT_PATH}}/research/2026-05-26-decision-techniques.md` is the worked example)

### 8.3 If no

Skip. Note in summary that pattern was offered and declined. Operator can opt in later.

## Phase 8.5: Write the Install Manifest (mandatory, all tiers)

Every generator run — every tier, every preset, no exceptions — ends by writing `.ai-kit-manifest.json` at the project root, committed with the install. It is the contract `generator/UPGRADE_MODE.md` executes against; without it, drift between the install and future kit versions is unattributable ("fixing the kit does not heal installs" — field-confirmed, first health-audit run).

**Procedure** (template: `templates/shared/ai-kit-manifest.json.template`):

1. Enumerate every file this run **created or merged** — the same enumeration Phase 9's "Files Created" / "Files Migrated" lists report; build it once, use it twice. Run this step LAST, after Phases 4.5/7/8 opt-ins have landed their files (a file that escapes the manifest escapes every future upgrade).
2. For each file record: `path` (relative to project root); `sha256` — exact bytes, never reformat before hashing:
   ```bash
   shasum -a 256 "<path>" | awk '{print $1}'   # fallback: sha256sum
   ```
   `class` (context / rule / skill / agent / command / mcp-config / ledger / ignore / doc); `disposition` (created / merged-existing / kept-existing, from Phase 4 outcomes); `template` — the kit source path, or JSON `null` for files generated from analysis with no kit source (CLAUDE.md prose, OWNER_BRIEF.md, domain rules); `template_sha256` — hash of that kit source **at generation time** (`null` when `template` is null); per-file `kit_version`; `owner_customized: false`.
3. Fill the header fields: `kit_version` from the newest `## [x.y.z]` heading in the kit's CHANGELOG.md (a verifiable source, not memory); `generated_date` via `date -u +%Y-%m-%dT%H:%M:%SZ`; `ide_scope` from Phase 3.4's resolution; `presets` from Phase 2 selections (variant markers like `nextjs:content-first` included); `packs` for every conditional pack installed (`kb-04`, `kb-05-*`, `kb-07-naming`, `kb-08-design`, `vigilance`, `mission-dispatch`, `owner-brief`); `placeholders` — the resolved placeholder map, **paths and names only, never secret values** (env var *names* are fine, values never).
4. **Exclusions (explicit)**: the manifest never lists itself; never lists files the run didn't touch; never records secret values.
5. **Verify**: `python3 -m json.tool .ai-kit-manifest.json` parses; spot-check 3 recorded hashes against `shasum -a 256`.

(The Phase 0.2 install-manifest guard handles the reverse direction: if a manifest already exists, the generator must not have gotten this far — route to `generator/UPGRADE_MODE.md`.)

## Phase 9: Summary Report

Output a structured summary:

```
## Workflow Generation Report

**Project**: [name] — [one-sentence description]
**Stack**: [framework version] + [db] + [auth] + [key deps]
**Maturity tier (Phase 1.6)**: Starter / Intermediate / Advanced — [reason]
**Preset used**: [nextjs / nextjs:content-first / nextjs-pages / fastapi / general-node / docs-ops / none — generated from KB principles]
**Owner brief (Phase 0.5)**: [generated / N-A — gate did not fire]

### Files Created
[list each file with line count]

### Files Migrated (from existing)
[list each with action: merged / archived / appended / skipped]
[confirm `PRE-EXISTING-MODIFIED.txt` written at project root (Phase 4); state line count or "empty (nothing pre-existing touched)"]

### MCP Servers Configured
[list each with: source (registry/discovered), security posture, credentials needed]

### MCP Servers Found But Rejected
[list with reason: failed security scan / unmaintained / low adoption]

### Architecture Decisions Recorded
[list decisions seeded into DECISIONS.md]

### Pack-Gate Decisions
[one row per conditional pack (KB-03 catalog / KB-07 naming / KB-08 design): `installed` / `proposed-and-declined` / `not-triggered`. For every met gate: state the detection evidence. For any `proposed-and-declined` despite a met gate: quote the operator's opt-out verbatim (Phase 1.5 pack-gate precedence)]

### Install Manifest (Phase 8.5)
[path: .ai-kit-manifest.json — file count, kit version recorded, json.tool pass]

### Validation Results
[pass/fail per checklist section]

### Cost Optimization Tips
- Recommend `opusplan` alias for 40-60% cost reduction on planning
- Recommend `ccusage` tool for monitoring token spend
- Recommend Plan mode for complex tasks (50% token reduction)

### Post-Setup Recommendations
- Create 5-10 evaluation tasks (real bugs, features) to measure workflow quality
- Consider Cursor Automations (beta) for auto-triggering rules on file patterns
- Run /discover-mcp periodically as new dependencies are added

### Decision Skills Installed
[list each KB-05 decision skill installed with its severity + surface; flag any Advanced-tier skills the operator should know about (council cost gate, anti-sycophancy auto-fire)]

### Surface Routing Integration (Intermediate+ only)
[either "Installed at .claude/rules/ai-workflow.md + .cursor/rules/ai-workflow.mdc" OR "Pending — operator should run the Cowork handoff (see Phase 4.5 block above)"]

### Vigilance Discipline (Advanced only)
[either "Bootstrapped — see vigilance/ folder; operator must register 3 Routines on claude.ai/code/scheduled" OR "Offered and declined" OR "N/A (Starter/Intermediate tier)"]

### Mission-Dispatch Pattern (Advanced only)
[either "Installed at prompts/dispatch/ + research/" OR "Offered and declined" OR "N/A"]

### New Environment Variables Required
[list any new env vars needed for discovered MCP servers]
```

## Critical Constraints

**Anti-hallucination** (highest priority):
- NEVER invent file paths, function names, package names, or commands — only reference what you've actually read
- NEVER assume a file's contents — read it first, then reference it
- NEVER invent tool parameters — only use parameters you've verified exist
- If uncertain about a fact (path, API, version): search the codebase, then state uncertainty if still unresolved

**Conflict priority**: When codebase patterns conflict with KB recommendations — **codebase always wins**. Rules must reflect what the project actually does, not what's theoretically optimal. Owner-declared intent (Phase 0.5) may override codebase-wins for *direction-setting* content only (roadmap, modernization, quality bar) — never for descriptive facts.

**Generating files**:
- NEVER include generic/obvious rules ("use TypeScript" in a TS project — it's obvious)
- NEVER include rules that contradict existing codebase patterns unless asked
- NEVER generate a file without first checking the Phase 0 inventory — if the file already exists, follow Phase 4 protocol
- ALWAYS use the project's actual file paths, commands, and conventions
- EVERY file must be immediately usable — no placeholder values remaining
- NEVER use "think step by step" in prompts for reasoning models — they reason internally
- Test every command by checking package.json / pyproject.toml scripts before including it
- Respect the token economy: concise > exhaustive, always
