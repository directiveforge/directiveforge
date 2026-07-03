# Workflow Generation Report

**Project**: Trailhead Collective — Operations Repository — pure-Markdown ops corpus for a founder-run four-depot outdoor-gear rental network (Cascade Foothills).
**Stack**: None (no manifest, no code, no build, no server, no `.git`). Markdown corpus: playbooks + governance ledger + integrations registry.
**Maturity tier (Phase 1.6)**: **Intermediate** — solo-founder-run (Starter signal) but the **stakes override** fires: a governance ledger with a money gate (D6, signed $48,000/yr lease ceiling), a binding credential-governance lock (D4), and a decision ledger external parties could audit. Per KB-04 §8.4 doctrine ("a solo founder with real money on locked decisions is Intermediate at minimum") + operator profile ("real money on locked decisions; I want defensible decisions"). Advanced was NOT selected: operator declined all Advanced opt-ins (vigilance, mission-dispatch, hosted-agent, scheduled scans).
**Preset used**: **docs-ops** (Phase 1.1 no-manifest branch fired: no `package.json`/`requirements.txt`/`pyproject.toml`/lockfiles; `*.md` dominates).
**IDE scope**: **Claude Code only** (operator profile: "Claude Code only"; no `.cursor/` present). No Cursor mirrors generated.
**Owner brief (Phase 0.5)**: N-A — gate did not fire. No dormancy (HANDOFF/ledger dated 2026-06-29, well within 6 months of the 2026-07-03 run), operator intent = "Evolve" (not revive/brief-driven), no README↔reality discontinuity of the kind the gate targets.
**Phases completed**: 0, 1, 2, 2.5, 3, 4, 4.5 (handoff block only — Intermediate), 5, 6, 8.5, 9. Phases 7 & 8 = N/A (Advanced-only, and declined per operator profile).

---

## Files Created

Root / governance / docs (7):
- `AGENTS.md` (73 lines) — corpus-adapted (no stack/commands slots)
- `PRE-EXISTING-MODIFIED.txt` (6 lines) — Phase 4 audit trail
- `.mcp.json` (3 lines) — empty `mcpServers` (governance branch)
- `.mcp.annotations.md` (52 lines) — propose-only MCP posture
- `docs/prompts/ARCHITECT_PROMPT.template.md` (311 lines) — KB-04 14-section template (Intermediate)
- `.ai-kit-manifest.json` (Phase 8.5, 35 files recorded)
- (`CLAUDE.md`, `governance/DECISIONS.md` = merged — see Migrated)

`.claude/` (28):
- rules (6): `base.md`, `quality-gates.md` (doc-lint gates), `corpus-conventions.md`, `decision-skills.md` (router), `research.md`, `orchestrator-dispatch.md`
- agents (3): `reviewer.md`, `simplifier.md`, `verifier.md` — mandatory trio, docs-adapted, least-privilege tools
- commands (7): `review-pr.md`, `update-context.md`, `discover-mcp.md`, `security-review.md`, `tech-debt.md`, `workflow-help.md`, `status.md`
- scripts (1): `check-links.py` — CANONICAL docs-ops link-checker, verbatim
- config (1): `settings.json` — hooks `{}` (no formatter), docs-repo permissions, subagent-model key omitted
- decision skills (8): `pre-mortem`, `steelman`, `confidence-calibration`, `reversibility-check`, `anti-sycophancy-meta` (5 BLOCKER) + `inversion`, `second-order-thinking`, `disconfirming-evidence-first` (3 HIGH)
- research skills (2): `research-prompt-writer`, `research-synthesizer`

**Total generated: 35 files** (all in the manifest).

**Not generated (with reason)**:
- `.env.example` — no `process.env`/`os.environ` surface in a no-code corpus; nothing to document.
- `deploy` command + deployment skill, `debug`/`refactor`/`migration` skills — docs-ops no-runtime (Phase 3.1 legend).
- `tester` + `security-auditor` agents — no test runtime; no payments/auth/PII code (docs-ops preset marks them out unless the corpus has that dimension; the governance-security dimension is covered by the remapped `/security-review` command instead).
- Cursor mirrors (`.cursor/**`, `.cursorignore`, `.cursorindexingignore`, `.cursor/mcp.json`) — Claude-Code-only scope.
- Advanced decision skills (`10-10-10`, `cost-of-inaction`, `bayesian-update`, `council-3-voice`) + `docs/reference/*` long-form — not this tier.

## Files Migrated (from existing)

- `CLAUDE.md` → **merged** (backup: `CLAUDE.md.backup`). House rules preserved + restructured into the six core sections, docs-ops adapted. 80 lines (≤150).
- `README.md` → **merged, append-safe** (backup: `README.md.backup`). Only the structure-diagram line updated to point at `docs/archive/` + `.claude/`.
- `governance/DECISIONS.md` → **append-only**. D1–D6 byte-intact (verified); **D7 appended** (Intermediate Tier-2 format: reversal triggers + re-verify + cross-references) recording the kit adoption. No second/root ledger created (respects Phase 4.3 + the house "do not start a second ledger" rule).
- `AUDIT-2026-05.md`, `VENDOR-COMPARISON-2026-04.md`, `ONBOARDING-NOTES-2026-03.md` → **archived** to `docs/archive/` (content unchanged), per operator approval ("archive the one-time reports, keep the master plan"). Each self-identifies as "safe to archive."
- `HANDOFF.md` → **kept as-is** (filled live session state; Phase 4.3 keeps a filled HANDOFF untouched).
- `OPS-MASTER-PLAN.md` → **kept as-is** (active source of truth; the "master plan" the operator said to keep).

`PRE-EXISTING-MODIFIED.txt` written at project root: **6 lines** (CLAUDE.md→backup, README.md→backup, DECISIONS.md→append-only, + 3 archive moves).

## MCP Servers Configured

**None.** `.mcp.json` ships with an empty `mcpServers` object.

Governance branch (Phase 2.5 Step 5) fired: D4 is a binding credential-governance lock and the operator profile is "Propose only — the founder bootstraps credentials." Combined with docs-ops posture (GitHub yes only if on GitHub; Context7 only for library-API docs; no DB connectors) and Phase-1 facts (no `.git`/remote, no dependency manifest, corpus is business-ops not library docs), **no dev-workflow MCP server earns a slot**. The propose-only path is documented in `.mcp.annotations.md` + the remapped `/discover-mcp` command.

## MCP Servers Found But Rejected

- **GitHub MCP** — not applicable (no `.git`, no GitHub remote). If the repo is ever hosted, the vetted remote HTTP endpoint is documented in the annotations.
- **Context7** — skipped (business-ops corpus, no library-API hallucination surface).
- **Phase 2.5 Step 3 npm/PyPI searches**: zero dev-worthy services were extracted (no manifest, no `.env.example`, no service imports in the corpus; the 3 business tools in the registry — Ledgerline / DepotHold / FieldRoster — are fictional founder-gated SaaS with no MCP servers and are D4-governed anyway). With zero services found, there were no per-service searches to run; recorded honestly rather than fabricated.

## Architecture Decisions Recorded

Appended to the existing `governance/DECISIONS.md` (house `## D{N}` format), NOT a new root ledger:
- **D7 — Adopt the AI Workflow Engineering Kit at Intermediate tier (Claude Code only)** — records scope, what installs, what does NOT change (source of truth, ledger format, D4, founder authority), with 2 decidable reversal triggers + a quarterly/event-triggered re-verify + cross-references preserving D4.

The pre-existing D1–D6 are the detected business decisions (four-depot model, replacement-cost deposits, seasonal crew, propose-only integrations, payment-processor switch, Stonebrook lease money-gate) — preserved verbatim, not re-seeded.

## Pack-Gate Decisions

| Pack | Disposition | Detection evidence |
|---|---|---|
| KB-03 catalog-pipeline | `not-triggered` | No data-pipeline / scraping / multi-source-ingestion / ETL signal — pure Markdown ops corpus. |
| KB-07 naming | `not-triggered` | No naming/rebrand/multi-SKU-line deliverable. Brand ("Trailhead Collective") is fixed and pre-existing. |
| KB-08 design | `not-triggered` | No user-facing designed surface — no component framework, no token/theme file, backend-less docs repo. |

No conditional pack's detection gate was met, so there is no `proposed-and-declined` row and no operator opt-out to quote. (KB-04 and the KB-05 decision-skill packs are not in this table — KB-04 is tier-gated, not detection-gated, and installed per the Intermediate stakes-override; KB-05 BLOCKER+HIGH installed by tier.)

## Install Manifest (Phase 8.5)

- Path: `.ai-kit-manifest.json` — **35 files** recorded.
- `kit_version`: **0.18.0-H** (from the newest `## [x.y.z]` heading in the kit CHANGELOG, not memory).
- `python3 -m json.tool` → **PASS**. 3 spot-check hashes (`CLAUDE.md`, `quality-gates.md`, `pre-mortem/SKILL.md`) re-hashed with `shasum -a 256` → **MATCH**.
- Reconciliation: every generated file ∈ manifest; every manifest path exists on disk; manifest excludes itself; backups not recorded. **RECONCILED: True.**
- `packs`: `["kb-04","kb-05-blocker","kb-05-high"]`; `presets`: `["docs-ops"]`; `ide_scope`: `["claude-code"]`; `maturity_tier`: `Intermediate`.

## Validation Results

| Checklist section | Result |
|---|---|
| §1 Token budget — CLAUDE.md ≤150 | **PASS** (80 lines) |
| §1 Six core sections present | **PASS** (all six) |
| §2 / §17 No redundancy across CLAUDE.md/AGENTS.md | **PASS** (command table lives in AGENTS.md; CLAUDE.md carries pitfalls/constraints) |
| §3 Referenced paths exist | **PASS** (every cited path resolves) |
| §5 No secrets | **PASS** (1 hit = `/security-review` documenting the grep patterns to hunt — value-shaped false positive per the checklist's own note; no real credential) |
| §7 MCP annotations + strict JSON | **PASS** (empty config annotated; `.mcp.json` + `.claude/settings.json` parse) |
| §8 Skills Gotchas/Anti-patterns + When-NOT | **PASS** (all 10 skills) |
| §9 Agents Constraints + tool scoping | **PASS** (trio; verifier Bash is command-scoped) |
| §10 File-count completeness | **PASS** (AGENTS/CLAUDE/.mcp.json/ledger present; 7 commands ≥3) |
| §12 Decision skills (5 BLOCKER + 3 HIGH) + frontmatter + router | **PASS** (all 8 installed; name/description/severity/confidence/surface populated; `decision-skills.md` router present) |
| §13 KB-04 Intermediate assets | **PASS** (ARCHITECT_PROMPT template + orchestrator-dispatch + research rules + 2 research skills; DECISIONS Tier-2) |
| §14 Surface routing (Intermediate) | **PENDING operator action** — Phase 4.5 handoff block provided (see below); not run inside this session by design |
| §18 Destructive-action protocol (HD-4) | **PASS** — `PRE-EXISTING-MODIFIED.txt` present; CLAUDE.md/README.md backed up; DECISIONS append-only (D1–D6 byte-intact verified) |
| §19 Drift-quarantine (HD-5) | **PASS** — DRIFT-QUARANTINE block emitted (below); no generated file asserts a quarantined claim as truth |
| §20 Gate self-test (HD-6) | **PASS** — link-checker validated on a micro-corpus: exactly 1 real dead link, 0 false positives on sibling/parent/fenced links, non-zero exit |
| §21 Cross-skill route resolution (HD-7) | **PASS** — every route to a non-installed Advanced skill (`council-3-voice`/`10-10-10`/`cost-of-inaction`/`bayesian-update`) carries a tier-fallback note in its skill file |
| §22 Description collision lint (HD-1/2/3) | **KNOWN-BENIGN 2 hits** — "the agent is about" (confidence-calibration↔reversibility-check) + "use on triggers like" (second-order↔steelman) are boilerplate connectives inherited verbatim from the kit's own shipping descriptions, not user-utterance trigger overlaps. §22's own HONESTY-SCOPE note: the lint is a proxy, not routing ground truth. Not mutated — mutating kit-verbatim shipping descriptions would diverge the install and is out of scope. |
| §23 Pack-gate decision log (HD-8) | **PASS** — this report's Pack-Gate Decisions section present; no `proposed-and-declined` rows (no gate met), so no verbatim-quote clause applies |
| "Unit tests for English" (Phase 5) | **PASS** — CLAUDE.md (5/5), AGENTS.md (6/6 File-Location paths + link cmd runs), decision-router (routed skills installed, no council route) |
| snyk-agent-scan (Phase 5) | **DEGRADED (honest)** — not runnable in this env (no `SNYK_TOKEN`/network); moot regardless: `.mcp.json` has zero servers → zero attack surface |

**Doc-lint gate on the LIVE corpus surfaced a real PRE-EXISTING defect** (not generation-introduced): 2 dead `docs/INDEX.md` rows. Recorded in the DRIFT-QUARANTINE block for the founder to act on via `/tech-debt`; the generator does not silently rewrite client content.

### DRIFT-QUARANTINE

```
DRIFT-QUARANTINE
docs/INDEX.md links to depot-closing-checklist.md | actual: file does not exist (playbook never written) | source: docs/ file listing + check-links.py
docs/INDEX.md links to gear-replacement-cost-list.md | actual: file does not exist (playbook never written; D2 deposit model keys off it) | source: docs/ file listing + check-links.py
```
No documented claim was asserted as current truth in any generated file; both are cited only with the drift flag. (These are corpus content defects the founder owns — the workflow now catches them; the fix — write the two missing playbooks or remove the rows — is a founder call, not an auto-edit.)

## Cost Optimization Tips

- `.claude/settings.json`: `MAX_THINKING_TOKENS=10000` (routine doc work), `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50` (long freshness-audit sessions); subagent-model key omitted for inherit.
- Recommend the `opusplan` alias for planning-heavy sessions and `ccusage` for token-spend monitoring.
- Plan mode for structural changes (new playbook, governance decision, index restructure) — CLAUDE.md session protocol names it.

## Post-Setup Recommendations

- **Fix the 2 dead INDEX rows** (P1 rot): write `docs/depot-closing-checklist.md` + `docs/gear-replacement-cost-list.md`, or remove the rows. `gear-replacement-cost-list.md` is load-bearing — D2's replacement-cost deposit model references it.
- **Reconcile the two stale playbooks** flagged in HANDOFF (`gear-recovery-protocol.md` three-strike rule; `deposit-and-refund-policy.md` vs D5 hold semantics) before summer peak — re-verify, then bump `verified:`.
- **Fill the Larkfield staffing stub** pending the shared-crew-pool decision.
- Run `/tech-debt` at each shoulder-season audit; `/status` at session close.

## Decision Skills Installed

| Skill | Severity | Surface |
|---|---|---|
| anti-sycophancy-meta | BLOCKER (auto-fires first) | All |
| pre-mortem | BLOCKER | Chat or Code |
| steelman | BLOCKER | Chat or Code |
| confidence-calibration | BLOCKER | Chat or Code |
| reversibility-check | BLOCKER (council gate) | Chat or Code |
| inversion | HIGH | Chat or Code |
| second-order-thinking | HIGH | Chat or Code |
| disconfirming-evidence-first | HIGH | Chat |

Operator note: `anti-sycophancy-meta` auto-fires on ownership-evaluation asks. `council-3-voice` is **not installed** at Intermediate — a Type-1 (irreversible) verdict from `reversibility-check` runs `steelman` + `pre-mortem` sequentially and recommends a `governance/DECISIONS.md` entry (relevant to money-gated calls like a lease above the D6 ceiling). All 8 skills carry a tier-fallback note so no route points at an uninstalled sibling.

## Surface Routing Integration (Intermediate+)

**PENDING — operator should run the Cowork handoff.** Open Cowork at the project root and paste:

> Open the AI Workflow Engineering Kit at <KIT_ROOT> and read prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md. Execute its 6 steps end-to-end against THIS project to install per-project surface routing (.claude/rules/ai-workflow.md; no .cursor mirror — Claude-Code-only project). Commit when done.

After it runs, the project gains `.claude/rules/ai-workflow.md` (~40-60 lines mapping recurring corpus tasks — freshness audit, governance lock, vendor research, ritual reconcile — to Chat/Cowork/Code) and a CLAUDE.md reference.

## Vigilance Discipline (Advanced only)

**N/A (Intermediate tier)** — and the operator declined all Advanced opt-ins ("No" to scheduled scans / research-mission automation / hosted-agent patterns; standing "no" to optional offers).

## Mission-Dispatch Pattern (Advanced only)

**N/A (Intermediate tier)** — declined per operator profile.

## New Environment Variables Required

**None.** No MCP servers configured, no credentials introduced (D4 honored). `.claude/settings.json` uses only literal numeric env levers (`MAX_THINKING_TOKENS`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`), no secrets.

---

## Gaps / Deviations Logged

1. **Operator-question gaps (Phase 0.5-style)**: none unanswered — every ASK in the prompt was resolved from the operator profile block (IDE scope, maturity/ambition, evolve-intent, root-cleanup approval, advanced opt-ins declined, MCP propose-only). No documented-default fallback was needed.
2. **`.git` absent (expected)**: git-dependent command steps (`/status`, `/workflow-help`, orchestrator numbering reservation check) were adapted to the no-git condition — session state sourced from HANDOFF + ledger + manifest, not git history. Not treated as a failure per the contract.
3. **snyk-agent-scan degraded**: not runnable in this environment (no token/network). Moot — zero MCP servers means zero attack surface. Recorded honestly per the prompt's degradation caveat.
4. **§22 collision lint**: 2 boilerplate 4-gram overlaps inherited verbatim from the kit's own shipping-quality decision descriptions; not user-trigger collisions; not mutated (would diverge the install from canonical). Recorded as known-benign per §22's own honesty-scope note.
5. **Pre-existing corpus drift**: 2 dead `docs/INDEX.md` rows — client content defect the doc-lint gate now catches. Quarantined, reported for `/tech-debt`, not auto-fixed (generator does not silently rewrite client content).
6. **DECISIONS placement deviation from the naive generation-table row**: the table says "generate root `DECISIONS.md`," but Phase 0.2 + Phase 4.3 + the house rule override — the existing `governance/DECISIONS.md` ledger is the single source of truth; the run appended D7 to it rather than forking a second ledger. This is the correct application of the anti-fork rule, logged for transparency.
