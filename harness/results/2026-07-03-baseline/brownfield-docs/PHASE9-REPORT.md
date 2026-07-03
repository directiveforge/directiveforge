# Workflow Generation Report

**Project**: Trailhead Collective — Operations Repository — a pure-Markdown operations corpus for a founder-run four-depot outdoor-gear rental network (Cascade Foothills).
**Stack**: None (no code, no manifest, no runtime). Markdown corpus + governance ledger + integrations registry. Package manager: N/A. Deployment: N/A.
**Maturity tier (Phase 1.6)**: **Advanced** — by the **stakes override**, not headcount. Solo founder, but the governance ledger carries real-money locked decisions external parties could audit: `D6` (Stonebrook lease, hard **$48,000/yr** ceiling — a money gate), `D5` (payment-processor switch), and `D4` (credential governance binding on all operators). KB-04 §8.4: "the forcing function is cost-of-a-bad-decision, not team size." Operator profile confirmed: "real money on locked decisions; I want defensible decisions."
**Preset used**: **docs-ops** (Phase 1.1 no-manifest branch fired — no `package.json`/`requirements.txt`/`pyproject.toml`/`go.mod`/`Cargo.toml`; `*.md` dominates; ledger present).
**Owner brief (Phase 0.5)**: **N-A** — gate did not fire. No dormancy signal (repo dates cluster 2026-01 to 2026-06; today 2026-07-03), no discontinuity, operator declared intent = **Evolve** (not revive/brief-driven). The existing hand-built layer was respected and extended, not reconstructed.
**IDE scope (Phase 3.4)**: **Claude Code only** (operator). No `.cursor/` existed; no Cursor mirrors generated.

---

## Phases completed

0 (Foundation), 1 (Codebase/corpus analysis), 2 (Stack detection → docs-ops preset), 2.5 (MCP discovery → governance branch), 3 (Generation), 4 (Existing-file handling: cleanup + merge), 4.5 (Surface-routing → handoff produced, pending operator), 5 (Validation), 6 (Cost/session — folded into CLAUDE.md), 7 (Vigilance — offered, declined), 8 (Mission-dispatch — offered, declined), 8.5 (Install manifest), 9 (this report). **All phases executed end-to-end.**

---

## Files Created

**Context / interop (3)**
- `AGENTS.md` (49 lines) — cross-tool interop summary (corpus map, rituals, conventions; no constraint-duplication with CLAUDE.md)
- `CLAUDE.md` (80 lines) — merged from the existing hand-built house-rules file (see Files Migrated)
- `.mcp.annotations.md` (46 lines) — MCP posture doc, adapted into a **propose-only proposals + founder-bootstrap checklist** (D4 governance)

**Config (1)**
- `.claude/settings.json` — read-only corpus Bash allow-list (git reads, grep/find/wc/ls/cat/awk/sed), deny destructive + `.env` reads; `hooks: {}` (no formatter); `CLAUDE_CODE_SUBAGENT_MODEL` omitted (inherit)

**Rules (5)** — all under `.claude/rules/`
- `base.md` — execution protocol + DOCS-FIRST protocol + governance/money constraints (docs-ops adaptation)
- `quality-gates.md` — doc-lint gates (link health, index drift, ledger integrity, source reconciliation) replacing build/lint/test
- `decision-skills.md` — KB-05 router (router-class rule, 48 lines); documents the 11 installed skills + no-council fallback
- `orchestrator-dispatch.md` — KB-04 dispatch mechanics (router-class, 64 lines); ledger regex `^## D`, surface routing per phase
- `research.md` — KB-04 3-layer research methodology (ledger = `governance/DECISIONS.md`, project-specific D4/money-gate overlays)

**Agents (3, mandatory trio — KB-02 §4)** — all under `.claude/agents/`, adapted to the corpus
- `reviewer.md` (Read+Grep) — grounding reviewer (sourcing / freshness / governance)
- `simplifier.md` (Read+Grep) — corpus-hygiene reviewer (single-source-of-truth / orphans)
- `verifier.md` (Bash read-only + Read) — doc-lint gate runner (link/index/ledger)

**Commands (7)** — all under `.claude/commands/`, docs-ops semantics remap
- `review-pr.md` (grounding review), `tech-debt.md` (corpus rot report), `update-context.md`, `discover-mcp.md` (propose-only), `security-review.md` (governance/credential/money-gate hygiene), `workflow-help.md`, `status.md`

**Skills (13)** — under `.claude/skills/`
- `research-prompt-writer/SKILL.md`, `research-synthesizer/SKILL.md` — KB-04 research skills (placeholders resolved to this project; Gotchas section added to synthesizer)
- 11 KB-05 decision skills under `decision/`: pre-mortem, steelman, confidence-calibration, reversibility-check, anti-sycophancy-meta, inversion, second-order-thinking, disconfirming-evidence-first, 10-10-10, cost-of-inaction, bayesian-update (copied verbatim — content sha256 == template sha256 for all 11)

**Templates / docs (1)**
- `docs/prompts/ARCHITECT_PROMPT.template.md` — KB-04 14-section architect prompt (path refs resolved; author-fill `{{}}` slots intentionally retained)

**Manifest (1)**
- `.ai-kit-manifest.json` — 34-file install manifest (Phase 8.5)

Total generated: **34 files** (manifest-tracked) + `.ai-kit-manifest.json` itself + `CLAUDE.md.backup`.

## Files Migrated (from existing)

| File | Action |
|------|--------|
| `CLAUDE.md` | **Merged.** Backed up to `CLAUDE.md.backup`. All hand-built substance preserved (depot names, seasons, verified-date discipline, D4 propose-only, "things not to do") and re-expressed across the six template sections + docs-ops corpus map. Result 80 lines (≤150). |
| `README.md` | **Merged (patched).** Structure block updated to reflect the archived reports, the new `.claude/` layer, `AGENTS.md`, and `docs/prompts/` + `docs/archive/`. Prose untouched. |
| `governance/DECISIONS.md` | **Kept as source of truth — NOT duplicated.** Existing `D{N}` ledger (D1–D6, append-only). No root `DECISIONS.md` generated (Phase 4.3 + 0.2: never fork an existing ledger). All generated rules/commands/skills point at `governance/DECISIONS.md` and its `D{N}` format. |
| `governance/INTEGRATIONS-REGISTRY.md` | **Kept unchanged.** The D4 proposal front door; `discover-mcp.md` and `.mcp.annotations.md` route proposals here. |
| `HANDOFF.md` | **Kept as-is** (live session state; Phase 4.3 — the template row applies only when no HANDOFF exists). |
| `OPS-MASTER-PLAN.md` | **Kept at root** (active source of truth; operator: "keep the master plan"). |
| `AUDIT-2026-05.md` | **Archived** → `docs/archive/` (operator approved; self-declared "safe to archive"; no un-extracted decisions). |
| `ONBOARDING-NOTES-2026-03.md` | **Archived** → `docs/archive/` (one-time Larkfield field notes; content already folded into `docs/larkfield-depot-onboarding.md`). |
| `VENDOR-COMPARISON-2026-04.md` | **Archived** → `docs/archive/` (drysuit comparison; no decision locked; roadmap defers it to summer numbers). |
| 9 `docs/*.md` playbooks + `docs/INDEX.md` | **Untouched** (domain content — not the AI layer; not edited, per "never invent" + evolve-scope). |

## MCP Servers Configured

**None wired.** The Phase 2.5 **governance branch fired** on decision **D4** ("no external service credentials or integrations without a founder bootstrap … binding on all operators and assistants"). Per the prompt, project governance wins: no `.cursor/mcp.json` / `.mcp.json` was created or edited. Instead `.mcp.annotations.md` records **proposals + a founder-bootstrap checklist**.

- **github** — remote HTTP. **PROPOSE-ONLY.** Applies only if/when the repo is hosted on GitHub (currently no git remote / no `.git`). `gh` CLI via Bash covers occasional needs meanwhile.
- **context7** — **NOT APPLICABLE.** The corpus documents no library/framework APIs, so nothing to ground.
- Database / payments / CMS connectors — **NOT APPLICABLE** (no runtime, no code; DepotHold Payments + Ledgerline are vendor accounts governed via the registry, never MCP targets; customer card/PII never routed through an agent surface).

## MCP Servers Found But Rejected

None reached a quality-gate rejection: for a pure-Markdown ops repo the realistic candidate set is tiny, and every candidate resolved to propose-only (github) or not-applicable (all others) before a gate could fail. No `uvx snyk-agent-scan` verdict was needed because **no config was wired to scan** (governance branch left `.mcp.json` absent by design). `uvx` is available in-env; any future founder-bootstrapped server must be scanned before first use (noted in `.mcp.annotations.md`).

## Architecture Decisions Recorded

**No new ledger entries seeded.** The existing `governance/DECISIONS.md` (D1–D6) is the append-only source of truth and was not forked or appended by this install (the generation-table "seed 3-5 decisions" row is overridden by Phase 4.3 for a pre-existing ledger). The decisions the generated layer now enforces (and points at) are the existing ones: D1 (four-depot network), D2 (replacement-cost deposit holds), D3 (seasonal crew model), D4 (credential governance — drives the MCP branch), D5 (payment-processor switch), D6 (Stonebrook lease, $48k/yr money gate — drives the Advanced-tier stakes override).

## Install Manifest (Phase 8.5)

- Path: `.ai-kit-manifest.json` — **34 files** tracked. `kit_version` **0.17.0** (from the kit's CHANGELOG newest `## [x.y.z]`). `python3 -m json.tool` **passes**. Does not list itself. 3 recorded hashes spot-checked against `shasum -a 256` → **MATCH**. Header: tier=Advanced, ide_scope=[claude-code], presets=[docs-ops], packs=[kb-04, kb-05-decision].
- Dispositions: `CLAUDE.md` + `README.md` = **merged-existing**; all others = **created**. Decision-skill `sha256 == template_sha256` for all 11 (byte-identical verbatim copy verified).

## Validation Results

| Checklist section | Result |
|---|---|
| §1 Token budget (CLAUDE.md ≤150) | **PASS** — 80 lines; all six core sections present (Architecture, Key Conventions, Common Pitfalls, Session Protocol, Definition of Done + Critical-Constraints-at-top). "Build & Test Commands" is replaced by Session-Protocol rituals per the docs-ops no-manifest adaptation. |
| §2 No redundancy | **PASS** — AGENTS.md carries the interop summary; CLAUDE.md the constraints. No command/fact duplicated (no build commands exist to duplicate). |
| §3 Referenced paths exist | **PASS** — every project-relative path (16 checked) and every kit-absolute path (7 KB files) resolves. |
| §4 Commands valid | **N-A** — no package manifest; commands are doc-lint rituals, validated against the corpus directly (they run clean). |
| §5 No secrets | **PASS** — secrets scan clean across CLAUDE.md, AGENTS.md, `.claude/`, `.mcp.annotations.md`. |
| §6 Conventions match codebase | **PASS** — docs-first conventions (frontmatter, `verified:`, `kebab-case`, single-source-of-truth) match the 9 real playbooks. |
| §7 MCP security annotations | **PASS (adapted)** — no server wired (D4 governance); `.mcp.annotations.md` documents propose-only posture + bootstrap protocol. `.claude/settings.json` valid strict JSON. |
| §8 Skills Gotchas + When-NOT | **PASS** — all 11 decision skills carry both; research-prompt-writer both; research-synthesizer: When-NOT + Anti-patterns table + Gotchas (added). |
| §9 Agents constraints + least-privilege | **PASS** — trio each has `## Constraints` (NEVER/ALWAYS); reviewer/simplifier=Read+Grep, verifier=Bash(read-only-named)+Read. |
| §10 File count / completeness | **PASS** — AGENTS.md + CLAUDE.md at root; `.mcp.json` intentionally absent (governance); ledger at `governance/` not duplicated; 7 commands (>3, no deploy — not deployable). |
| §11 Execution infrastructure | **PASS (adapted)** — 7 commands; `hooks: {}` (no formatter, noted); permissions allow/deny set; feedback loop = doc-lint gates in CLAUDE.md + quality-gates.md; mandatory trio present; Plan mode in session protocol. |
| §12 Decision skills (KB-05) | **PASS** — 5 BLOCKER + 3 HIGH + 3 MEDIUM installed (11); council-3-voice intentionally NOT installed (no Max evidence) and flagged in the router; router rule present. |
| §13 KB-04 (Intermediate+) | **PASS** — architect template + orchestrator-dispatch + research rules + both research skills installed; ledger uses the house `D{N}` structure (with reversal/re-verify discipline documented). |
| §14 Surface routing (Intermediate+) | **PENDING operator action** — Phase 4.5 handoff produced below; `.claude/rules/ai-workflow.md` to be generated in a fresh Cowork session. |
| §15 Vigilance (Advanced opt-in) | **N-A** — offered, operator declined. |
| §16 Mission-dispatch (Advanced opt-in) | **N-A** — offered, operator declined. |
| §17 Cross-artifact consistency | **PASS** — fact agreement across docs; generated↔generated refs resolve; manifest integrity verified (json.tool pass, all paths exist, 3-hash spot-check MATCH); doc-derived falsifiable checks all PASS (see below). |

**Doc-derived falsifiable checks ("unit tests for English")**
- CLAUDE.md: ledger next-number = D7 (last is D6) ✓ · four depot names in master plan ✓ · D6 = Stonebrook $48,000 money gate ✓ · 9/9 playbooks carry frontmatter ✓
- AGENTS.md: corpus-map paths all exist ✓ · no code manifest present ✓
- decision-skills.md: every routed skill installed ✓ · council flagged NOT installed ✓

**Doc-lint gate dry-run on the live corpus** (proves the generated gates work AND surfaces pre-existing fixture drift — findings for the operator, NOT edited by this run):
- Index drift: `docs/INDEX.md` links **2 dead rows** — `depot-closing-checklist.md` and `gear-replacement-cost-list.md` (neither file exists). Pre-existing.
- Stale `verified:`: 2 playbooks past 90 days — `gear-recovery-protocol.md` (2026-02-14) and `deposit-and-refund-policy.md` (2026-02-18) — exactly the two `HANDOFF.md` already flags as open re-verify items. Corpus is internally consistent about its own known-stale set.
- Ledger integrity: D1–D6 monotonic, gap-free. Clean.

## Cost Optimization Tips

- Use the `opusplan` alias for planning-heavy sessions (40-60% cost reduction on the plan phase).
- Monitor spend with `ccusage`.
- Use Plan mode for multi-file doc changes (documented in CLAUDE.md Session Protocol) — ~50% token reduction on complex tasks.
- `.claude/settings.json` already caps `MAX_THINKING_TOKENS=10000` (routine doc work) and sets `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50` (long freshness-audit sessions).

## Post-Setup Recommendations

- Fix the 2 dead `docs/INDEX.md` rows (create the missing playbooks or remove the rows) — the new `/tech-debt` and verifier agent will keep flagging them until resolved.
- Re-verify the 2 stale playbooks (`gear-recovery-protocol`, `deposit-and-refund-policy`) — reconcile the latter against `D5` before bumping its date, per HANDOFF.
- Run the Phase 4.5 Cowork surface-routing handoff (below) to add `.claude/rules/ai-workflow.md`.
- Create 5-10 evaluation tasks (e.g. a real freshness-audit pass, a supplier-decision research dispatch) to measure the workflow.
- Re-run `/discover-mcp` (propose-only) if the repo ever moves to GitHub or starts documenting software.

## Decision Skills Installed

| Skill | Severity | Surface |
|---|---|---|
| anti-sycophancy-meta | BLOCKER (auto-fires first) | all |
| pre-mortem | BLOCKER | Chat/Code |
| steelman | BLOCKER | Chat/Code |
| confidence-calibration | BLOCKER | Chat/Code |
| reversibility-check | BLOCKER | Chat/Code |
| inversion | HIGH | Chat/Code |
| second-order-thinking | HIGH | Chat/Code |
| disconfirming-evidence-first | HIGH | Chat |
| 10-10-10 | MEDIUM | Chat |
| cost-of-inaction | MEDIUM | Chat |
| bayesian-update | MEDIUM | Chat |

**Operator note — council-3-voice NOT installed.** Advanced tier normally ships it, but it gates on plan-tier ≥ Max (its 3-voice fan-out burns ~15× tokens) and this run had no Max confirmation. The router (`.claude/rules/decision-skills.md`) documents the absence and a no-council fallback: on a Type-1 (irreversible) verdict — e.g. signing a lease at the D6 ceiling — run steelman + pre-mortem sequentially, then lock a `D{N}` with reversal triggers. Add council later if the founder is on Max+. **anti-sycophancy-meta auto-fires** on ownership-signal phrases ("is my plan good", "should I…") before any content evaluation.

## Surface Routing Integration (Intermediate+)

**PENDING — operator should run the Cowork handoff.** Paste-ready block for a fresh Cowork session at this project root:

```
Open the AI Workflow Engineering Kit at <KIT_ROOT> and read
prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md. Execute its 6 steps
end-to-end against THIS project to install per-project surface routing
(.claude/rules/ai-workflow.md — no Cursor mirror, this project is Claude Code
only). Map the recurring task patterns: freshness audit, grounding review,
supplier/lease research dispatch, ledger lock, registry proposal, vendor-portal
audit. Commit when done.
```

After it runs, expect `.claude/rules/ai-workflow.md` (~40-60 lines) + a CLAUDE.md reference to it.

## Vigilance Discipline (Advanced only)

**Offered and declined.** Per the operator profile (Advanced-only opt-ins → "No"). Can be bootstrapped later by re-running Phase 7. (Note: cloud Routines assume a git remote; this repo has no `.git` yet — a prerequisite the operator would resolve first.)

## Mission-Dispatch Pattern (Advanced only)

**Offered and declined.** Per the operator profile. Can be installed later by re-running Phase 8.

## New Environment Variables Required

**None.** No MCP server was wired (D4 governance), and the repo has no runtime. `.claude/settings.json` uses only non-secret env levers (`MAX_THINKING_TOKENS`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`). No `.env.example` generated — there are zero env vars in a pure-Markdown corpus, and D4 forbids credentials in the repo entirely.

---

## Gaps & Deviations Logged

1. **No root `DECISIONS.md` generated (correct deviation).** The generation-table "DECISIONS.md — Always (seed 3-5)" row was overridden by Phase 4.3 / Phase 0.2: an existing ledger lives at `governance/DECISIONS.md` (`D{N}` house format). Forking it would break the append-only audit trail. All generated assets point at the existing ledger.
2. **`.mcp.json` intentionally absent (correct deviation).** Phase 2.5 Step 5 governance branch fired on D4 — configs left untouched; proposals + bootstrap checklist emitted in `.mcp.annotations.md` instead. This is the "project governance wins" path.
3. **council-3-voice not installed.** Advanced tier + no Max plan-tier evidence + council's 15× cost + operator's standing "no to opt-ins." Flagged in the router with a documented fallback.
4. **CLAUDE.md six-section adaptation.** "Build & Test Commands" has no analog in a no-runtime corpus; replaced by Session-Protocol operating rituals per the docs-ops preset. All other five sections present verbatim-in-spirit.
5. **research-synthesizer Gotchas section added.** The kit's flat template ships with "When NOT to invoke" + an Anti-patterns table but no `## Gotchas` heading; §8 requires both. A project-specific Gotchas section was added (ledger format, money-gate, no-invent, master-plan-wins).
6. **Pre-existing fixture drift surfaced, not fixed.** 2 dead `docs/INDEX.md` rows + 2 stale `verified:` dates are domain-content defects the generated gates now catch; per "never invent depot content" and evolve-scope, they were logged for the operator, not edited by the install.
7. **No git repo (expected).** Target has no `.git` (harness-declared normal). File evidence + the operator profile substituted for git heuristics throughout; Phase 0.5 dormancy check used file dates. Session-Protocol and `/status` degrade gracefully to "no git history."
8. **No `.env.example` generated.** Correct skip — zero env vars in the corpus; D4 forbids credentials in-repo.

**No operator questions went unanswered** — every ASK in the prompt was resolved from the operator profile (IDE scope, maturity/ambition, evolve intent, root-cleanup approval, opt-in declines, MCP propose-only).
