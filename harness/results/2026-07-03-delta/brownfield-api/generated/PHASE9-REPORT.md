# Workflow Generation Report

**Project**: SlotHarbor — internal dock-slot scheduling service for Cratewell Logistics (carriers book time-window appointments against loading docks; ops staff pull utilization reports).
**Stack**: FastAPI 0.115.6 + Pydantic 2.7.4 + SQLAlchemy 2.0.31 (**synchronous**) + Alembic 1.13.2 + Uvicorn 0.30.1; PostgreSQL (prod) / SQLite (dev); Python `>=3.12`; pip (no lockfile); Docker container deploy.
**Maturity tier (Phase 1.6)**: **Intermediate** — operator profile says "production service; we want the kit to help us make defensible decisions" (Intermediate signal) + a real deploy artifact (Dockerfile) exists. No 5+ dev / multi-orchestrator / strategic-legal signals → not Advanced. Tie-break/stakes overrides did not fire.
**Preset used**: **fastapi** (`generator/presets/fastapi.md`). Layered-resolution note: the preset's async-first + layered (schemas/services/repositories) + `@modelcontextprotocol/server-postgres` recommendations were all overridden by Phase-1 facts — this codebase is fully synchronous, flat (inline schemas, no service layer), and the registry supersedes the preset's archived Postgres MCP.
**Owner brief (Phase 0.5)**: N-A — gate did not fire. No `.git` (dormancy uncomputable via git; used file evidence + operator profile per contract), operator intent = "Maintain" (not revive), no HANDOFF/README discontinuity qualifying as revival. Deviation logged: git-based dormancy heuristic unavailable; relied on file evidence + operator profile as instructed.

---

## Files Created

**Context / ledgers (6)**
- `AGENTS.md` (60 lines) — universal stack, commands, structure, constraints
- `CLAUDE.md` (92 lines — ≤150 gate PASS; all six sections present) — Claude-specific critical constraints, architecture, pitfalls
- `DECISIONS.md` (Tier 2 format; 5 seeded entries) — sync-SQLAlchemy, inline-schemas, no-service-layer, legacy-export-pending, Docker-not-Heroku
- `HANDOFF.md` — kit template, unfilled (correct per row)
- `.mcp.annotations.md` — MCP postures + settings-lever appendix
- `.claude/settings.json` — 18 allow / 5 deny permission rules; `hooks: {}` (no formatter); `CLAUDE_CODE_SUBAGENT_MODEL` omitted (inherit)

**Rules (7)**
- `.claude/rules/base.md`, `quality-gates.md` (honest gates: app-boots + migrations-apply; no phantom pytest/ruff/build rows), `api.md`, `database.md`, `decision-skills.md` (router), `orchestrator-dispatch.md`, `research.md`

**Agents (5)** — mandatory trio + tester + security-auditor
- `simplifier.md`, `reviewer.md`, `verifier.md` (Bash scoped to boot+alembic gates only), `tester.md` (honestly flags: no test runner exists; adding pytest is decision-gated), `security-auditor.md` (SECRET_KEY / HMAC-token profile; no payments/auth)

**Commands (8)**
- `review-pr.md`, `deploy.md` (derived from Dockerfile ONLY, Heroku claim quarantined), `update-context.md`, `discover-mcp.md`, `security-review.md`, `tech-debt.md` (carries the `DRIFT-QUARANTINE` block), `workflow-help.md`, `status.md`

**Decision skills — Intermediate = 5 BLOCKER + 3 HIGH (8)**
- `pre-mortem`, `steelman`, `confidence-calibration`, `reversibility-check`, `anti-sycophancy-meta` (BLOCKER); `inversion`, `second-order-thinking`, `disconfirming-evidence-first` (HIGH). Byte-copied from kit, then install-adapted (tier-notes + 2 description de-conflicts — see Validation).

**Research skills + architect template (3)** — Intermediate KB-04
- `.claude/skills/research-prompt-writer/SKILL.md`, `.claude/skills/research-synthesizer/SKILL.md` (placeholders fully resolved), `docs/prompts/ARCHITECT_PROMPT.template.md` (kept as template — path anchors resolved, authoring slots intact)

**Config**
- `.mcp.json` (context7 + postgres), `.env.example.backup`, `PRE-EXISTING-MODIFIED.txt`, `.ai-kit-manifest.json`

Total generated/adapted: **41 files in the manifest** (+ `.ai-kit-manifest.json` itself, which the manifest never lists).

### Files Migrated (from existing)
- `.env.example` — **merged (rewritten)**: original documented only `DATABASE_URL`; regenerated to document all 4 real env vars (`DATABASE_URL`, `SECRET_KEY`, `WAREHOUSE_CODE`, `MAX_PAGE_SIZE`) as NAMES + purpose only (never values). Backed up to `.env.example.backup` first.
- `README.md` — **untouched** (left as-is; its stale claims are quarantined, not edited).
- `.gitignore` — **untouched** (already contained `.env`, `*.db`, `__pycache__/`, `.venv/`; nothing to merge).
- Source/config (`app/**`, `Dockerfile`, `alembic.ini`, `pyproject.toml`, `migrations/**`) — **untouched**.
- `PRE-EXISTING-MODIFIED.txt` written at project root (Phase 4): **1 line** — `.env.example → .env.example.backup`.

---

## MCP Servers Configured
- **context7** — `@upstash/context7-mcp@3.2.2` — source: registry — posture RO (public docs only) — no credentials. Rationale: FastAPI 0.115 / Pydantic v2 / SQLAlchemy 2.0 APIs are frequently hallucinated as older versions.
- **postgres** — `mcp-postgresql-ops@3.2.8` (PyPI via `uvx`) — source: registry (the vetted replacement) — posture RO (30+ read-only DBA tools) — credential `${DATABASE_URL}`. Gate 1 EXISTS confirmed via PyPI (`3.2.8` present; latest `3.3.7`). Gate 5 USEFUL: project uses Postgres in prod; schema inspection / EXPLAIN justified.

## MCP Servers Found But Rejected / Omitted
- **`@modelcontextprotocol/server-postgres`** (npm) — rejected: archived May 2025, known SQL-injection advisory (Datadog Security Labs), no patches. Registry DO-NOT-USE. Replaced by `mcp-postgresql-ops`. (npm search also surfaced a `node-canaries` security canary of the same name — additional confirmation to avoid the npm route.)
- **github** (remote HTTP, kit default) — **omitted**: Gate 5 (USEFUL) fails — no `.git`, no GitHub remote, no CI in the project. Codebase-wins over the template default. Paste-ready config recorded in `.mcp.annotations.md` for when the repo is hosted.
- No other MCP-worthy services found (`.env.example` + imports surface only the database).

## Architecture Decisions Recorded (DECISIONS.md, Tier 2)
1. Synchronous SQLAlchemy, not async (codebase-wins over preset)
2. Inline Pydantic schemas in router files, no `schemas/` package
3. No service/repository layer — routers query models directly
4. Retain `legacy_export.py` unwired, pending removal decision (dead code)
5. Container (Docker) deployment, not Heroku (README Heroku claim quarantined)

## Pack-Gate Decisions
| Pack | Disposition | Evidence |
|---|---|---|
| KB-03 catalog-pipeline | `not-triggered` | Not a data-pipeline / scraping / ETL project — it's an app-code CRUD/reporting API. |
| KB-07 naming | `not-triggered` | No naming/rebrand/agency/multi-SKU-line deliverable in scope (Phase 1.5). |
| KB-08 design | `not-triggered` | Backend API — no user-facing designed surface, no component framework + token/theme file, no design mandate (Phase 1.5). |

No pack gate was met, so no pack was proposed-and-declined. (Operator "no" to opt-in offers is recorded but no met gate was suppressed.)

## Install Manifest (Phase 8.5)
- Path: `.ai-kit-manifest.json` — **41 file entries**; kit_version recorded `0.18.0-H` (newest CHANGELOG heading); `python3 -m json.tool` **PASS**; 3 hashes spot-checked against `shasum -a 256` (CLAUDE.md, .mcp.json, .claude/rules/api.md) — all match. Manifest does not list itself. `ide_scope: ["claude-code"]`, `presets: ["fastapi"]`, `packs: ["kb-04","kb-05-blocker","kb-05-high"]`.

## Validation Results
Checklist v0.19.0 (§1–§23) executed. Results by section:
- **§1 Token budgets** — PASS (CLAUDE.md 92 ≤150; six sections present; no oversized always-load set — Claude Code has no `alwaysApply` file here).
- **§2 No redundancy** — PASS (AGENTS.md holds the canonical command table; CLAUDE.md carries only quirks + pitfalls; no fact duplicated).
- **§3 Referenced paths exist** — PASS (`app/`, `app/routers/`, `migrations/`, `migrations/versions/`, skill dirs all exist).
- **§4 Commands valid** — PASS (only real commands: `uvicorn app.main:app`, `alembic upgrade/revision`, `pip install .`, `docker build/run`, `python -c "import app.main"`). No phantom pytest/ruff/mypy/build asserted as real; the one `pytest` mention is a P1 *recommendation to add* in `/tech-debt`.
- **§5 No secrets** — PASS (value-shaped secret grep clean; `.mcp.json` uses `${DATABASE_URL}`; `.env` never read).
- **§6 Conventions match codebase** — PASS (sync, Pydantic v2, inline schemas, no service layer, `pip` — all verified against source).
- **§7 MCP annotations** — PASS (both servers annotated; strict JSON parses; versions pinned `@3.2.2`/`@3.2.8`; `${ENV_VAR}` for creds).
- **§8 Skills Gotchas/When-NOT** — MOSTLY PASS. All 8 decision skills + research-prompt-writer have `## Gotchas` + `## When NOT`. **1 observation**: `research-synthesizer` (kit template) uses an `## Anti-patterns` table + a When-NOT section instead of a `## Gotchas` heading — shipped kit-template shape, byte-copied; robust anti-pattern coverage present. Logged, not treated as a generation defect.
- **§9 Agents constraints** — PASS (every agent has `## Constraints` NEVER/ALWAYS; Bash grants name their command families — verifier = boot+alembic only, security-auditor = read-only checks).
- **§10 File count** — PASS (AGENTS.md, CLAUDE.md, .mcp.json, DECISIONS.md present; 8 commands, 5 agents, 7 rules, 8 decision skills; Cursor items N/A — Claude-Code-only scope).
- **§11 Execution infra** — PASS (settings.json permissions allow/deny; `hooks: {}` with report note — no formatter; mandatory trio present; Plan mode in session protocol; feedback loop in Definition of Done).
- **§12 Decision skills** — PASS (5 BLOCKER + 3 HIGH installed at correct paths; each has `name`/`description`/`severity`/`confidence`/`surface` frontmatter; router rule `decision-skills.md` present; no council gate — correct, council is Advanced+Max only).
- **§13 KB-04 (Intermediate)** — PASS (architect template + orchestrator-dispatch + research rules + both research skills; DECISIONS.md Tier 2 with reversal triggers + re-verify cadence).
- **§14 Surface routing** — PENDING operator action (Intermediate+ requires the Cowork handoff; block below). Flagged, not failed.
- **§15 Vigilance / §16 Mission-dispatch** — N/A (Advanced-only; this is Intermediate).
- **§17 Cross-artifact consistency** — PASS (versions agree across CLAUDE.md/AGENTS.md/rules; all generated→generated refs resolve; manifest integrity verified; doc-derived checks all TRUE; no DECISIONS↔rules incoherence).
- **§18 Destructive-action protocol (HD-4)** — PASS (a) `PRE-EXISTING-MODIFIED.txt` present; (b) the one modified pre-existing file `.env.example` has `.env.example.backup`.
- **§19 Drift-quarantine integrity (HD-5)** — PASS (a) `DRIFT-QUARANTINE` block present in `/tech-debt` (4 claims: Heroku, Py3.9, `make test`, `/v2/analytics`); (b) self-contradiction grep clean — no generated file asserts a quarantined claim un-flagged (hits are the untouched README source + drift-flagged DECISIONS/tech-debt lines).
- **§20 Gate self-test (HD-6)** — N/A (no link gate generated — code project, not docs repo).
- **§21 Cross-skill route resolution (HD-7)** — PASS (9 routes to non-installed skills — `council-3-voice`, `cost-of-inaction`, `bayesian-update` — each given a tier-aware `at this tier` fallback note; 0 unresolved on re-run).
- **§22 Description collision lint (HD-1/2/3)** — PASS after fix (2 initial ≥4-gram collisions: `confidence-calibration`↔`reversibility-check` "the agent is about to"; `second-order-thinking`↔`steelman` "use on triggers like" — both reworded on one side, preserving trigger semantics; re-run PASS).
- **§23 Pack-gate decision log (HD-8)** — PASS (section present above with all 3 conditional packs; all `not-triggered`, no unquoted decline).

**Doc-derived checks ("unit tests for English")** — executed for CLAUDE.md (5 claims), AGENTS.md (3), DECISIONS.md (3): all TRUE against source (routers included, legacy_export absent from main, MAX_PAGE_SIZE caps limit, get_session exists, fully sync; uvicorn entry / alembic migrations / pip install real; #1/#2/#5 trace to code).

**Snyk Agent Scan (Gate 4 / §7)** — ran `uvx snyk-agent-scan@latest`; **degraded to inventory** (no `SNYK_TOKEN` in this environment) and auto-declined all stdio servers non-interactively, exactly per the documented degradation caveat. It enumerated `mcp-postgresql-ops@3.2.8` and `@upstash/context7-mcp` from the ecosystem with no tool-poisoning/injection finding in the inventory pass. Full verdict requires `SNYK_TOKEN` — recorded honestly as a degraded result, not a pass/fail verdict.

**App-boot ground-truth** — `python -c "import app.main"` fails in THIS validation env only because FastAPI/SQLAlchemy are not installed (system python 3.9.6, deps absent). The gate is correctly specified; this is an environment limitation, not a generated-file defect.

### Cost Optimization Tips
- Use the `opusplan` alias (Opus plan / Sonnet implement) for 40–60% planning-cost reduction on multi-file work.
- Monitor spend with `ccusage` (npx, zero-install; daily/monthly/session from JSONL logs).
- Use Plan mode for non-trivial tasks (~50% token reduction) — already in the CLAUDE.md session protocol.
- `.claude/settings.json` sets `MAX_THINKING_TOKENS=10000` (routine maintenance) and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50` (long sessions).

### Post-Setup Recommendations
- Create 5–10 evaluation tasks (real bugs/features) to measure workflow quality.
- Highest-value debt (from `/tech-debt`): add a `pytest` + `TestClient` baseline (decision-gated) — the project has zero automated tests today; reconcile the 4 quarantined README claims.
- Resolve the `legacy_export.py` keep-vs-remove decision (DECISIONS #4).
- Run `/discover-mcp` when new external-service dependencies are added.

### Decision Skills Installed
| Skill | Severity | Surface |
|---|---|---|
| anti-sycophancy-meta | BLOCKER | all (auto-fires FIRST on ownership-signal phrasing) |
| pre-mortem | BLOCKER | Chat-or-Code |
| steelman | BLOCKER | Chat-or-Code |
| confidence-calibration | BLOCKER | Chat-or-Code |
| reversibility-check | BLOCKER | Chat-or-Code |
| inversion | HIGH | Chat-or-Code |
| second-order-thinking | HIGH | Chat-or-Code |
| disconfirming-evidence-first | HIGH | Chat |

Operator notes: **anti-sycophancy-meta auto-fires** before content evaluation on "is my X good / should I do X" phrasings. **No council-3-voice** (Advanced+Max only) — at this tier, ≥3-mutually-exclusive-option / Type-1 decisions fall back to `reversibility-check` → `steelman` + `pre-mortem` sequentially + a DECISIONS entry (documented in each skill's Tier note and in `decision-skills.md`). LLM fallback router is enabled at Intermediate.

### Surface Routing Integration (Intermediate+)
**Pending — operator should run the Cowork handoff.** After install, open Cowork at this project root and paste:

> Open the AI Workflow Engineering Kit at <KIT_ROOT> and read prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md. Execute its 6 steps end-to-end against THIS project to install per-project surface routing (.claude/rules/ai-workflow.md; no .cursor mirror — Claude-Code-only scope). Commit when done.

### Vigilance Discipline (Advanced only)
N/A — Intermediate tier (Phase 7 not offered).

### Mission-Dispatch Pattern (Advanced only)
N/A — Intermediate tier (Phase 8 not offered).

### New Environment Variables Required
None beyond what the app already uses. The `postgres` MCP reuses the existing `DATABASE_URL` (a read-only DB user is recommended for defense in depth). Context7 needs no credentials.

---

## Gaps / Deviations Logged
1. **No VCS at install** (per contract) — git-based dormancy/heuristics unavailable; used file evidence + operator profile. `status.md` / `workflow-help.md` / `review-pr.md` degrade gracefully when git is absent (noted in each).
2. **No test/lint/typecheck/build tooling** in the project — `quality-gates.md` and the verifier agent were filled with the only real gates (app-boots + migrations-apply); phantom rows deliberately omitted. Adding pytest is surfaced as a decision-gated recommendation, never asserted as present.
3. **GitHub MCP omitted** despite being a kit default — no git/GitHub evidence (Gate 5 USEFUL fails); recorded with a paste-ready re-add block.
4. **Decision skills install-adapted** — 8 tier-note appends (no-phantom-route rule) + 2 description rewrites (§22 collision). File sha256 ≠ template_sha256 for these; manifest records both honestly, `owner_customized: false` (generator adaptation, not owner edit).
5. **`research-synthesizer` §8 observation** — uses `## Anti-patterns` table instead of `## Gotchas` heading (kit-template shape); not modified.
6. **Snyk full verdict unavailable** — no `SNYK_TOKEN` in environment; scan degraded to inventory per documented caveat (not a clean-pass claim).
7. **App-boot gate unrunnable here** — FastAPI/SQLAlchemy not installed in the validation env (system python 3.9.6); gate is correctly specified for a real checkout.
