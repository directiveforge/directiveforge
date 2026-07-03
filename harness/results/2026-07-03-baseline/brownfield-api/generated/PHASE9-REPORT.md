# Workflow Generation Report

**Project**: SlotHarbor — internal dock-slot scheduling API for Cratewell Logistics (carriers book time-window appointments against warehouse loading docks; ops staff pull utilization reports).
**Stack**: FastAPI 0.115.6 + Pydantic 2.7.4 + SQLAlchemy 2.0.31 (**synchronous**) + Alembic 1.13.2 + Uvicorn 0.30.1; PostgreSQL (prod) / SQLite (dev); Python >=3.12; pip (no lockfile); Docker + Heroku deploy. No auth (internal); `SECRET_KEY` HMAC-signs appointment tokens.
**Maturity tier (Phase 1.6)**: **Intermediate** — production deployment exists (Dockerfile + Heroku auto-deploy from `main`); operator profile says "production service; we want the kit to help us make defensible decisions" (the documented Intermediate signal) with intent = "Maintain". No strategic/legal/money-gate stakes → no stakes-override bump. Tie-break not needed; signals cohere on Intermediate.
**Preset used**: `fastapi` (`generator/presets/fastapi.md`). **Layered-resolution note**: the preset's async guidance (`AsyncSession`, `async def` handlers) was DROPPED — Phase-1 facts win over preset guidance, and this codebase is entirely synchronous. Locked as DECISIONS #1.
**Owner brief (Phase 0.5)**: N/A — gate did not fire. No revival/brief-driven declaration; no dormancy signal available (target has no `.git`, per the harness's expected condition — file evidence + operator profile used instead); README/code discontinuities were handled as ordinary drift findings, not a dormancy trigger.
**IDE scope**: Claude Code only (per operator profile). No `.cursor/` generated. No `.cursor/*` rows, mirrors, or ignore files — all correctly out of scope.

---

## Files Created

### Context / ledger (root)
| File | Lines | Notes |
|---|---|---|
| `CLAUDE.md` | 98 | ≤150 ✓; all six required sections; critical constraints at TOP (sync-only, no-tooling, SECRET_KEY) |
| `AGENTS.md` | 75 | Stack + commands table (canonical; not duplicated in CLAUDE.md) |
| `DECISIONS.md` | 86 | Tier 2 (Intermediate) format; 3 seeded entries from codebase evidence |
| `HANDOFF.md` | 49 | Template only — session-fill slots retained (not filled), per generation table |
| `.mcp.json` | 19 | 3 servers; strict JSON (parses) |
| `.mcp.annotations.md` | 50 | Posture + credential entry for every server + skipped-server rationale + settings appendix |
| `.claude/settings.json` | 37 | Permissions (pip/alembic/docker/git reads allow; force-push/hard-reset/.env deny); `hooks: {}` (no formatter); `CLAUDE_CODE_SUBAGENT_MODEL` omitted for inherit |
| `.env.example` | 18 | **merged-existing** — added `SECRET_KEY`, `WAREHOUSE_CODE`, `MAX_PAGE_SIZE` (names + purpose only; no values) |
| `.ai-kit-manifest.json` | 416 | 38 files; json.tool passes; 3 hashes spot-checked OK |

### Rules (`.claude/rules/`)
| File | Lines | Notes |
|---|---|---|
| `base.md` | 34 | Execution protocol + hard constraints (sync-only, no-legacy-mount) |
| `quality-gates.md` | 30 | **Adapted** — no test/lint/typecheck tooling exists; gates = app-boot + migration-apply + migration-review (≥1 real gate, per Phase 3.1) |
| `api-python.md` | 33 | Glob `app/**/*.py` + `migrations/**/*.py`; sync-only, Pydantic v2, SQLAlchemy 2.0 — async rules stripped |
| `decision-skills.md` | 42 | Router; Intermediate rendering (8 skills, LLM fallback, no council, Type-1 non-council fallback row) |
| `orchestrator-dispatch.md` | 57 | KB-04 Intermediate+; router rule (≤100 ceiling) |
| `research.md` | 73 | KB-04 3-layer methodology; long-form reference marked not-installed |

### Agents (`.claude/agents/`) — mandatory trio + tester + security-auditor
| File | Lines | Tools (least-privilege) |
|---|---|---|
| `simplifier.md` | 61 | Read, Grep |
| `reviewer.md` | 71 | Read, Grep |
| `verifier.md` | 50 | Bash (scoped: app-boot + alembic only), Read |
| `tester.md` | 63 | Read, Grep, Write (tests/ only), Bash (pytest only) — pre-condition: pytest not installed, first delegation must establish it via DECISIONS |
| `security-auditor.md` | 80 | Read, Grep, Bash (read-only checks only) — qualifies on SECRET_KEY HMAC + user input |

### Commands (`.claude/commands/`) — 8
`review-pr.md` (51), `update-context.md` (50), `discover-mcp.md` (46), `security-review.md` (59), `tech-debt.md` (71), `workflow-help.md` (55), `status.md` (52), `deploy.md` (51 — deployable: Docker build + Heroku). Always-on set + deploy (deployable condition met).

### Skills (`.claude/skills/`)
- **Decision (KB-05, Intermediate = 5 BLOCKER + 3 HIGH), copied verbatim (shipping-quality, no placeholders):** `pre-mortem` (98), `steelman` (107), `confidence-calibration` (96), `reversibility-check` (102), `anti-sycophancy-meta` (147), `inversion` (94), `second-order-thinking` (111), `disconfirming-evidence-first` (108). Council NOT installed (Advanced+Max only).
- **Research (KB-04, Intermediate+), instantiated from templates:** `research-prompt-writer/SKILL.md` (97), `research-synthesizer/SKILL.md` (108).

### Docs
`docs/prompts/ARCHITECT_PROMPT.template.md` (311) — KB-04 14-section template, IDE-neutral, template only (not instantiated).

**Total files created/merged: 38** (37 created + 1 merged-existing `.env.example`).

## Files Migrated (from existing)
- `.env.example` — **merged**: preserved the existing `DATABASE_URL` entry verbatim, appended the three env vars the code (`app/config.py`) reads but the file omitted (`SECRET_KEY`, `WAREHOUSE_CODE`, `MAX_PAGE_SIZE`). Names + purpose only; no values.
- No other pre-existing AI-workflow files existed → **Phase 4 skipped entirely** (Phase 0.2 inventory returned NONE; no `.ai-kit-manifest.json`, so no upgrade-mode reroute). No `CLAUDE.md.backup`/`.cursorrules.legacy` needed.

## MCP Servers Configured
| Server | Source | Posture | Credentials | Version |
|---|---|---|---|---|
| `github` | registry | RW (OAuth, 51 tools, lockdown mode) | none (browser OAuth) | remote HTTP (upstream-managed) |
| `context7` | registry | RO (public docs only) | none | `@upstash/context7-mcp@3.2.2` (pinned; live-verified latest) |
| `postgres` | registry | RO (30+ read-only DBA tools) | `${DATABASE_URL}` | `mcp-postgresql-ops@3.2.8` (PyPI/uvx; registry pin) |

`context7` is high-value here: FastAPI/Pydantic-v2/SQLAlchemy-2.0 APIs are frequently hallucinated as their v1/1.x forms. `postgres` matches the Postgres-prod stack; the kit registry's forbidden `@modelcontextprotocol/server-postgres` (archived, SQL-injection CVE) was avoided — the vetted Python replacement used instead.

## MCP Servers Found But Rejected / Skipped
- `@modelcontextprotocol/server-postgres` — **rejected**: archived May 2025, known SQL-injection vuln (registry anti-recommendation). Replaced by `mcp-postgresql-ops`.
- `git` MCP (`mcp-server-git`, PyPI) — **skipped**: Claude Code has built-in git; adding it duplicates tool surface (registry "skip when built-in sufficient").
- `SQLite` MCP — **skipped**: dev-only DB; postgres-ops + built-in file access cover schema needs without extra tool surface.
- npm search for FastAPI-specific MCP returned only unrelated packages (`@lff-vibe/mcp-gateway`, `fin-ratios`) — none useful. Resolved: none added.

## Architecture Decisions Recorded (seeded into DECISIONS.md, Tier 2)
1. **#1 — Synchronous SQLAlchemy 2.0, not async.** Codebase uses sync `create_engine`/`Session`/`def` handlers; explicitly overrides the FastAPI-async preset default. Reversal triggers + event-triggered re-verify recorded.
2. **#2 — `legacy_export.py` retained but unmounted.** Dead-code router deliberately not included in `main.py`; superseded by `reports.py`. Keep-but-unmounted pending a removal decision.
3. **#3 — Plain `os.getenv` config, not pydantic-settings.** Four flat vars; zero-dependency `Settings` singleton; migrate if config grows past ~8 vars or needs validation.

## Install Manifest (Phase 8.5)
- Path: `.ai-kit-manifest.json` — **38 files**, `kit_version` `0.17.0` (from kit CHANGELOG newest heading), `maturity_tier` Intermediate, `ide_scope` `["claude-code"]`, `presets` `["fastapi"]`, `packs` `["kb-04","kb-05-intermediate"]`.
- `python3 -m json.tool` **passes**. Manifest excludes itself; every listed path exists; 3 recorded sha256 hashes spot-checked against `shasum -a 256` — all match. Template + template_sha256 recorded per file (null for the 3 analysis-derived files: CLAUDE.md, api-python.md, decision-skills.md, and the merged .env.example).

## Validation Results (Phase 5 — VALIDATION_CHECKLIST §1–§17)
| § | Check | Result |
|---|---|---|
| 1 | CLAUDE.md ≤150 lines (98) + all 6 required sections | PASS |
| 1 | Rule line budgets (convention ≤40, router ≤100) | PASS (max convention 34; max router 73) |
| 2 | No fact duplication AGENTS.md↔CLAUDE.md (commands table only in AGENTS.md) | PASS |
| 3 | All referenced paths exist; globs (`app/**`, `migrations/**`) match real dirs | PASS |
| 4 | Every command real (`pip install .`, `uvicorn app.main:app`, `alembic upgrade head`) | PASS |
| 5 | Secret scan (value-shaped patterns) returns nothing; `${ENV_VAR}` used; `.env` never read | PASS |
| 6 | Conventions match codebase — 0 `async def`, 0 `AsyncSession`, 0 Pydantic-v1, 0 `session.query()` | PASS |
| 7 | Every server annotated (posture + credentials); JSON strict-parses; versions pinned | PASS |
| 7 | `uvx snyk-agent-scan@latest` run | RAN — degraded to **inventory-only** (no `SNYK_TOKEN`; stdio servers auto-declined non-interactively — the documented degradation). Our 3 servers are all registry-vetted with documented postures; not a blocker. |
| 8 | Skills: Gotchas + When-NOT — all 8 decision skills PASS; `research-prompt-writer` PASS | PASS (benign variance below) |
| 9 | Agents: Constraints section + tool frontmatter + one-sentence role + output format + least-privilege | PASS (all 5) |
| 10 | File completeness: AGENTS/CLAUDE/DECISIONS/.mcp.json + ≥3 commands (8) | PASS |
| 11 | Execution infra: settings.json permissions+hooks, mandatory trio, ≥5 commands, feedback chain in CLAUDE.md, Plan mode in session protocol | PASS |
| 12 | Decision skills: 5 BLOCKER + 3 HIGH installed; router rule present; 5/5 frontmatter fields each | PASS |
| 13 | KB-04 Intermediate: ARCHITECT template + orchestrator-dispatch + research rules + 2 research skills + DECISIONS Tier 2 | PASS |
| 14 | Surface routing (Intermediate+) | **PENDING — operator action** (Phase 4.5 handoff block below) |
| 15 | Vigilance (Advanced only) | N/A (Intermediate) |
| 16 | Mission-dispatch (Advanced only) | N/A (Intermediate) |
| 17 | Cross-artifact consistency: version/command agreement, generated↔generated refs resolve, manifest integrity, DECISIONS↔rules coherence | PASS |

**Per-doc falsifiable checks** (Phase 5 checklist-generation):
- CLAUDE.md — 4/4 claims verified (legacy_export unmounted; items.py=/bookings; MAX_PAGE_SIZE bound; plain os.getenv config).
- AGENTS.md — 4/4 claims verified (fastapi==0.115.6; sqlalchemy==2.0.31; requires-python>=3.12; 3 models exist).
- decision-skills.md — router paths all resolve; the automated "no council" substring check flagged 2 matches, **manually verified as correct** (both explicitly document council's *absence* and route the Type-1 fallback to steelman+pre-mortem — the intended Intermediate rendering, not a defect).

**Benign variance (not a failure):** `research-synthesizer/SKILL.md` uses `## Anti-patterns` + `## When NOT to invoke` instead of a literal `## Gotchas` header — this is verbatim from the kit's shipped synthesizer template (a Layer-2/3 procedural skill with its own section structure), not a generation error.

### Cost Optimization Tips
- Use the `opusplan` alias (Opus for planning, Sonnet for implementation) — 40-60% planning-cost reduction.
- Monitor spend with `ccusage` (npx, zero-install).
- Use Plan mode for complex tasks (~50% token reduction) — already in CLAUDE.md session protocol.

### Post-Setup Recommendations
- **Highest-value next task: establish a test suite.** The repo ships zero tests and no test tooling — this is the single largest tech-debt item. `.claude/agents/tester.md` is pre-wired to propose `pytest` + `httpx` (as a DECISIONS entry, not a silent add) and then write endpoint/model tests. Wire the resulting gates into `quality-gates.md` + CLAUDE.md Definition of Done.
- **Fix README drift** (documented as pitfalls, not silently changed): `make test` (no Makefile), `/v2/analytics` (no router), "Python 3.9+" (pyproject requires 3.12), Heroku-only claim vs the present Dockerfile. `/tech-debt` enumerates these as findings.
- Create 5-10 evaluation tasks (real bugs/features) to measure workflow quality.
- Run `/discover-mcp` when new service dependencies are added.

### Decision Skills Installed
5 BLOCKER (all `severity: BLOCKER`): `pre-mortem` (surface Chat-or-Code), `steelman` (Chat-or-Code), `confidence-calibration` (Chat-or-Code), `reversibility-check` (Chat-or-Code), `anti-sycophancy-meta` (**surface: All — auto-fires FIRST** on ownership+evaluation phrasing before any content evaluation). 3 HIGH: `inversion`, `second-order-thinking`, `disconfirming-evidence-first`. Router at `.claude/rules/decision-skills.md` with LLM fallback enabled. **Council NOT installed** — it is Advanced+Max-tier only (15× token cost gate); the Type-1 path instead routes to steelman+pre-mortem sequentially.

### Surface Routing Integration (Intermediate+)
**Pending — operator should run the Cowork handoff.** Per Phase 4.5, the integration is best executed in a fresh Cowork session (not inside this generator run). After install completes, open Cowork at this project root and paste:

> Open the AI Workflow Engineering Kit at `<KIT_ROOT>` and read `prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md`. Execute its 6 steps end-to-end against THIS project to install per-project surface routing (`.claude/rules/ai-workflow.md`; no `.cursor/` mirror — this project is Claude-Code-only). Commit when done.

Once run, the project will have `.claude/rules/ai-workflow.md` (~40-60 lines mapping recurring SlotHarbor tasks to Chat/Cowork/Code) + a CLAUDE.md reference to it.

### Vigilance Discipline (Advanced only)
N/A — Intermediate tier. Not offered (Phase 7 is Advanced-only).

### Mission-Dispatch Pattern (Advanced only)
N/A — Intermediate tier. Not offered (Phase 8 is Advanced-only).

### New Environment Variables Required
- MCP: `DATABASE_URL` (already a project env var — reused by the `postgres` MCP server; use a read-only DB user for defense in depth).
- Optional for full MCP security verdict: `SNYK_TOKEN` (free, app.snyk.io) so `snyk-agent-scan` produces a full verdict instead of inventory-only.
- No net-new project env vars introduced by the workflow install.

---

## Gaps / Deviations Logged
1. **App-boot gate not exercised in the generator environment.** `python -c "import app.main"` fails here with `ModuleNotFoundError: No module named 'sqlalchemy'` — the sandbox has no `pip install .` run and no venv. This is an environment artifact, NOT a code defect: `app/main.py` and routers parse cleanly as Python AST. The generated `verifier` agent + `quality-gates.md` correctly define this gate for the operator's own environment where deps are installed.
2. **Snyk Agent Scan degraded to inventory-only** (no `SNYK_TOKEN`; stdio servers `context7`/`postgres` auto-declined in non-interactive mode; `github` HTTP enumerated). Recorded honestly per the prompt's degradation caveat. All 3 configured servers are registry-vetted with documented postures — no security blocker. Operator can set a free `SNYK_TOKEN` for a full verdict.
3. **README ↔ code drift (surfaced, not auto-fixed).** `make test` (no Makefile), `/v2/analytics` (no router), "Python 3.9+" vs pyproject `>=3.12`, Heroku-only deploy claim vs present Dockerfile, `.env.example` originally missing 3 vars the code reads. Per "codebase always wins", these are captured as CLAUDE.md pitfalls + DECISIONS entries + `/tech-debt` findings; the README itself was left unmodified (out of scope for a workflow-generation run; flagged for the operator).
4. **No test/lint/typecheck tooling in the repo.** `quality-gates.md`, `verifier.md`, and CLAUDE.md Definition of Done were adapted to the gates that genuinely exist (app-boot, migration-apply/review) rather than fabricating phantom `pytest`/`ruff`/`mypy` gates. Establishing real tooling is the top post-setup recommendation.
5. **Target has no `.git`** — the harness-expected condition. Handled per contract: file evidence + operator profile used in place of git heuristics; not treated as a failure. No commits made anywhere (per contract).
6. **Operator-profile "no" standing rule honored:** no optional/opt-in packs offered beyond tier baseline (KB-03 not triggered — data-backed API, not a data-pipeline/catalog project; KB-07 naming + KB-08 design not triggered — no naming/frontend deliverable; vigilance + mission-dispatch are Advanced-only and thus not offered at Intermediate).

**Sign-off:** Project: SlotHarbor · Generator run: 2026-07-03 · Checklist passed: yes (§14 pending operator action; §15/§16 N/A by tier) · Items failed: none · Validator: Opus 4.8 generator-runner subagent.
