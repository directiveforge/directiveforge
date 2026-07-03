# Changelog

All notable changes to DirectiveForge (the AI-workflow engineering kit).

Format: `## [version or milestone] — YYYY-MM-DD`

---

## [0.20.0] — 2026-07-03

The Public Launch Release. Executes the v0.20.0 launch architect prompt (private dispatch instance; W0–W6): the kit becomes **DirectiveForge** and ships as a leak-clean public snapshot + one-command Claude Code plugin, with a numbers-first README built around the v0.19.0 delta story. Model routing per §4: Fable 5 main (W0 decisions, naming adjudication, snapshot strategy, voice-pass, verification dispositions, wrap); Opus 4.8 subagents (naming screens, scrub implementation, packaging, launch drafts, W5 verifiers); Haiku smokes. Commits: W0 `66819ea` (plan FIRST — the v0.19.0 lock honored) → W1 `50ac443` → W2 `815bdea..03331b4` → W3 `54663da` → W4 `dfe5cb0` → W5 `87282ad` → W6 wrap (this commit).

### Name (W1 — KB-07 dogfooded verbatim)

- **DirectiveForge** adopted on evidence: 87/100 (Online-first/B2B preset) vs nearest challenger 61; the only CLEAR collision screen of six candidates (Specsmith/Caliper/Plumbline BLOCKED on fatal same-category collisions; Dirigo/Metrion CAUTION). Gate 0: GitHub org 404-verified before any spend. Crowded-Forge verdict: composite escapes only because the `Directive` prefix is verified collision-free. CLI alias: NONE (no CLI ships; ECC three-identifier lesson). Full evidence: `NAMING-DECISION.md`.

### Public snapshot + scrub gate (W2)

- Strategy **(a) fresh public repo** (filter-repo rejected — rewrite invalidates SHAs recorded inside artifacts). `scripts/scrub-check.py` (builtin generic set + operator-held pattern list, `--require-external` release gate, shipped auditable allowlist), `scripts/build-snapshot.sh` (archive → prune → manifest-scoped sed → gate → fresh init + tag), `scripts/verify-transform.sh`.
- **One-command-reproducible hash bridge** (`SCRUB-TRANSFORM.md`): 67 bridged files, transform constants disclosed (operator decision), verified 67/67 against post-manifests; **3 rows `bridge_class=withheld`** (a client-name reference in generated output — the privacy absolute overrides reproducibility for exactly those rows; disclosed, retired by public round 2 regen). Disposition table: 554 ship / 117 sanitize / 19 exclude.
- **N1 fixed (launch-blocking)**: PSP Portability rule — generated files never embed generator working paths; exemplar cites hedged; delta runners require explicit kit root.

### Packaging + feedback (W3)

- Public repo = marketplace + its single plugin `directiveforge` v0.20.0 (`claude plugin validate` PASS; 22 measured skills referenced in place, byte-identical). Install: `claude plugin marketplace add directiveforge/directiveforge && claude plugin install directiveforge`. Clean-clone smoke 12/12.
- **`/report-friction`** trio (plugin command + claude-code template at every tier + Cursor SKILL): defect loop → bucket-only profile → mechanical sanitization → **hard user-review gate** → labelled GitHub issue via the new issue form; inbound wired into the zero-silent-drops disposition pipeline (`feedback/README.md`).

### Launch materials (W4)

- README rebuilt numbers-first: hero delta table (every row linked to its committed artifact), "Measured, not claimed", 60-second quickstart, what-this-is/is-NOT, 10 specific limitations, disposition guarantee, MIT + provenance. **The unmeasured "3-5x quality / 40-60% cost" claim is deleted.** `LICENSE` (MIT). `launch/`: SHOW-HN (confession-first + pre-drafted method-FAQ first comment), LONGREAD, X-THREAD (per-tweet source comments), DIGEST-001, LANDING; public digest format ships at `vigilance/PUBLIC-DIGEST-FORMAT.md`.

### Verification (W5 — three fresh-context verifiers, all LAUNCH-SAFE)

- V-A independent leak scan: 55 self-derived patterns, **0 real leaks**, client not identifiable semantically, commit metadata clean, bridge spot-checks pass. V-B claim-trace: **every quantitative token in README + launch materials resolves verbatim in-snapshot**; marketing sweep clean; W0 bar 5/5. V-C clean-env install: 9/9 after the allowlist-must-ship fix. 10 findings — all dispositioned (W5 verification record, private launch-ops), incl. tag-identity noreply fix and a dated correction of a false historical "grep returns 0" CHANGELOG claim.

### Dispositions & spend

- `feedback/DISPOSITIONS-v0.20.0.md`: 7 W-rows SHIPPED · N1 FIXED + N2–N6 deferred to v0.20.1 with reasons · 10 W5 rows · 10 deviations D1–D10 · **0 silently dropped**.
- **Budgets held**: measured subagent spend **≈1.62M tokens** across 17 subagent runs / 15 orchestration invocations (caps: ≤5M / ≤80); naming web-research **224k** (≤1M). Per-tier (measured): Opus-designated ≈1.05M, Haiku smokes ≈0.11M, default-routed exploration/design ≈0.46M. Main-loop (Fable) tokens not separately metered by the session harness — reported as unmeasured, not estimated. No 2× STOP triggered.
- Residual for v0.20.1: N2–N6, fixture regen retiring the 3 withheld bridge rows; post-launch: public harness round 2 (declared in README), operator launch steps in the private launch-ops checklist.

---

## [0.19.0] — 2026-07-03

The Delta Release. Executes `prompts/dispatch/V0_19_0_ARCHITECT_PROMPT.md` (W0–W5): the baseline's honest F-grades → fixed at their named homes → re-measured on frozen instruments → **provable, adversarially verified delta** (`harness/results/2026-07-03-delta/DELTA.md`). Model routing per §4: Fable 5 main agent (plan, reviews, adjudication, scorecard assembly, wrap); Opus 4.8 subagents (fixes, checklist hardening, scoring, verification); Haiku router-sims. Commits: W0 `a0a232f` → W1 `ab147a0` → W2 `4181b90` → W3 `5d852fc` → W4 `fafe766` → W5 wrap (this commit).

### The delta (every baseline F-driver moved; instruments frozen; verifier C1–C6 all CONFIRMED)

- **HD-1 `inversion`**: L1.2 F1 **0.3333 → 0.75** (v1.0 single-call channel — the identical instrument), L1.3 activation **0.3333 [0.19,0.51] → 0.8333 [0.66,0.93]** n=30 (CIs non-overlapping). **HD-2 `anti-sycophancy-meta`**: F1 **0.5714 → 0.8889**, activation **0.2667 [0.14,0.44] → 0.8333 [0.66,0.93]**. Mechanism: first-responder convention (KB-05 §5.1.1) — the meta-skill owns the generic ownership-evaluation utterance with an explicit deferral clause; five sibling descriptions de-collided (pre-mortem/steelman subtractive, disconfirming-evidence-first narrowed). **HD-3**: `name-generation` F1 **0.8889 → 1.0** ("brief exists" precondition); naming pack **0.9667 → 1.0**.
- **HD-4**: brownfield-docs L2.3 destructive-count **1 (hard F-cap) → 0** — PSP Phase 4.3 blanket backup row + mandatory `PRE-EXISTING-MODIFIED.txt` audit trail (backups hash-verified by the adversarial verifier). **HD-5**: brownfield-api L2.4 false-content **4 → 0** and L2.2 recall **0.90 → 1.00** — drift quarantine (machine-readable block, Phase 3 firewall) + deploy-from-artifacts rule (deploy.md now derives from the real Dockerfile; the Heroku trap is explicitly rejected). **HD-6**: the generated link-gate went from **13 false positives drowning 2 real dead links (exit 0)** to **0 FP, the same 2 real dead links, exit 1** — canonical `check-links.py` (dirname-relative resolution, code-fence stripping) shipped single-sourced in the docs-ops preset. **HD-7/HD-8** fixed in PSP (no-phantom-route rule + pack-gate precedence with Phase 9 decision log), mechanically verified on the new trees; full greenfield re-measure deferred-with-reason to harness round 2.
- **Regressions ship too**: `disconfirming-evidence-first` 0.9091 → 0.8889 (poem-FP fixed, tone-check positive lost — real trade, filed); L2.1 old-scope 12/14 (api) and §8 Gotchas regression (docs); §22 boilerplate collisions in unedited skills; 6 new findings filed for v0.20 (DISPOSITIONS-v0.19.0 N1–N6).

### Added — circularity killed (W2)

- VALIDATION_CHECKLIST v0.19.0: **§0 instrument-validity note** (checklist = generation-time gate, harness = ground truth; a PASS-rate is never quality evidence without a harness grade) + mechanical **§18–§23** (destructive-action audit trail, drift-quarantine self-contradiction grep, link-gate micro-corpus self-test, cross-skill route resolution, description collision lint, pack-gate decision log) + in-file HD→item traceability. Re-scored against the frozen baseline trees: **agreement with the harness 0/3 → 3/3** — both F-graded runs now FAIL on exactly their F-defect classes (`harness/results/2026-07-03-delta/checklist-agreement.md`).

### Added — cost architecture (W3, the ADJ-3 fix)

- KB-04 §4.9 anti-pattern **"fire-and-forget subagent chains"** (breaker-bypass by construction; measured 31.5k/call × 612 ≈ 19M overhead; count calls, batch ≥10/call, checkpoint at boundaries; pre-compute calls × measured constant) + WORKFLOW-CLAUDE-CODE §11.6 cross-ref. **HARNESS-SPEC v1.1** — dated, append-only Method addendum (+36/−0): batched router channel (K≤15, independence instruction, per-run equivalence demonstration, headline-delta rule, nominal-CI flag); definitions/rubrics/answer keys untouched. New parameterized, **non-clobbering** runners (`l1-delta`, `l2-delta`: refuse-to-clobber guards, arg-driven identity, recorder-free main-loop writes closing the HD-9 channel); RUNBOOK batched economics + checkpoint discipline + HD-9 recorder gotcha.
- **Measured on itself**: the re-measure surface that would have cost 10M+ under the baseline's one-call-per-trial protocol ran for **2.65M / 50 calls** (equivalence controls exact: pinned-catalog 1.0/1.0; paired rows 18/20). **W4 token cap ≤2.5M breached by 5.9% — reported honestly per §3.5 (ADJ-1)**; release total **3.95M / 65 calls vs 6M hard cap** (baseline harness: 23.7M / 655).

### Verification & accounting

- Fresh-context adversarial verifier: **C1–C6 all CONFIRMED** — every headline number recomputed from raw artifacts (own F1/Wilson implementations, own link resolver, own trap greps); instrument freeze verified vs `2a5c3f0` (only change: the dated SPEC v1.1 addendum); prompt/variant reuse byte-identical (80/80 texts). 5 findings dispositioned (V1–V5), incl. the honest one: exact-residual pre-registration lived in the operator plan outside the repo — committed at wrap with provenance note, claim downgraded to operator-attested, lesson locked (**W0 plans commit at W0**).
- Dispositions `feedback/DISPOSITIONS-v0.19.0.md`: 6 W-rows SHIPPED · 10 HD rows all dispositioned (6 fixed+re-measured, 2 fixed+measure-deferred, 1 protocol-fixed, 1 record-only) · 5 verifier findings · 6 new findings filed → v0.20 · 4 adjudications · **0 silently dropped**.

### Deferred

Harness round 2 (full re-run on the batched protocol; greenfield slice for HD-7/HD-8; L1.3 naming/design; batch-id trial provenance for interleave audit — V4) · A11–A12 · public scrub gate (next release; DELTA.md is written as its centerpiece) · v0.20 fix queue N1–N6.

## [0.18.0-H] — 2026-07-03

The proof-harness release. Executes `prompts/dispatch/V0_18_0_HARNESS_ARCHITECT_PROMPT.md` (W0–W7): the kit now measures its own generator instead of claiming — the position the 2026-07-02 competitive scan found empty (§3g: nobody publishes measured validation of generated workflows; sole prior art PluginEval stops at artifacts). Model routing per §4: Fable 5 authored the spec, reviews, calibration, adjudications; Opus 4.8 subagents did all bulk authoring, generator runs, judging, adversarial verification; Haiku ran router-sims and mechanical sweeps.

### Added — the harness (`harness/`, scan rows A9+A10)

- **`HARNESS-SPEC.md`** (exactly 200 lines, pre-registered): metrics L1.1–L1.4 (static gates / trigger P·R·F1 / Wilson-CI activation repeatability / anchored 1–5 rubrics) + L2.1–L2.6 (checklist PASS-rate / planted-signal recall / destructive-action count / false-content count / run cost / defect count by the friction-report taxonomy a–h), each with definition-scale-method-threats; honest-numbers doctrine (n + method + CI or explicit "single-run, directional"); §6 judge calibration (Fable re-judge, agreement rates published); §8 fixture integrity with runtime-derived leak-scan denylist. **Committed BEFORE any measurement** — W7 proved the git order (`601b3c5` ≺ `21eab1d`, `merge-base --is-ancestor`).
- **3 synthetic fixtures** with frozen answer keys (10 falsifiable signals each + scripted operator answers, card outside the copied tree): `greenfield-next` (Tempo Deck — Next.js 15.1.6 App Router), `brownfield-api` (SlotHarbor — FastAPI 0.115.6, 4 planted README contradictions, dead router, secret-fallback smell), `brownfield-docs` (Trailhead Collective — 19 md files, D{N} ledger, propose-only credentials lock, $48K money-gate). 100% synthetic; leak-scan 0 hits (verified twice); authors blind to the generator prompt.
- **`layer1/`** static-checks (mechanical PASS/FAIL, INDETERMINATE=FAIL) + judge-rubrics (prompt-author/router-sim dispatches, paraphrase anti-overfit rule, anchors citing real defect classes, evidence quotes mandatory) + repeatability (pure-arithmetic Wilson, batch-5 schedule, half-width ≤0.08 breaker). **`layer2/BENCHMARK-PROTOCOL.md`**: 10-step run with contamination firewall (runner never sees the answer key; only extracted operator answers), mechanical L2.3 from hash manifests, source-integrity gate.
- **`SCORECARD-FORMAT.md`**: both scorecard shapes field-bound to spec §10; presentation-only letter grades — frozen per-metric bands, overall = worst-of MIN (no weighted composite), L2.3>0 = hard F-cap; exit-code convention documented (CI wiring deferred). **`RUNBOOK.md`**: independent-operator reproduction; acceptance = fresh Haiku dry-read, verdict "ZERO unresolvable steps". **`runner/`**: the three orchestration workflow scripts as run artifacts.

### Added — first published numbers (`harness/results/2026-07-03-baseline/`)

- **Layer 1** (22 skills, 3 packs): L1.1 static 1.0 everywhere (110/110 checks). L1.2 trigger F1 micro — decision **0.9298**, naming **0.9667**, design **1.0** (220 router calls, prompt sets committed). L1.3 (decision pack, 320 committed trials): 9/12 skills at 1.0 [0.8668, 1.0] n=25; **`anti-sycophancy-meta` 0.2667 [0.1418, 0.4445]** and **`inversion` 0.3333 [0.1923, 0.5122]** — systematic trigger failures, filed as defects HD-1/HD-2, not tuned away. L1.4 anchored rubric: 4.896 / 5.0 / 4.875.
- **Layer 2** (3 full generator runs, Opus 4.8, clean context, 273k/328k/308k tokens): greenfield-next L2.2 9/10 · L2.3 0 · L2.4 0 → **B**; brownfield-api L2.2 9/10 · L2.3 0 · **L2.4 4** (the Heroku trap propagated into deploy.md while the same run flagged it as drift — HD-5) → **F**; brownfield-docs L2.2 10/10 · **L2.3 1** (README edited in place without backup — HD-4) · L2.6 1×🚨 (generated link-health gate produces 13 false DEAD LINKs — HD-6) → **F**. The checklist scored 12–14/14 applicable PASS on all three runs while these defects existed — empirical confirmation of L2.1's registered circularity threat.
- **Judge calibration** (spec §6, Fable, 15/15 items): L1.4 exact 18/20 (0.90), ±1 20/20 (1.00) — leniency hypothesis not supported; L1.2 random 2/2; adversarial probe sided with ground-truth labels 4/4 where the cheap router failed, corroborating the trigger defects. Record: `calibration-fable.md`.

### Verification & accounting

- Step-④: independent adversarial Opus verifier, fresh context, own recomputations — **10/10 release claims CONFIRMED, 0 falsified** (L1.2 micro, L2.3, L2.4 recomputed to the last digit; Wilson CIs re-implemented from formula text). Findings: 2 🟡 — F1 (recorder had truncated L1.3 per-trial data 11/12 skills; recovered byte-exact from the orchestration journal, all 12 counts re-matched, provenance embedded) and F2 (dispositions file expected-by-design at wrap). Full table: `feedback/DISPOSITIONS-v0.18.0.md`.
- Dispositions: 8 W-rows + 2 scan rows SHIPPED · 10 harness-filed defects (2 fixed in-release, 8 deferred with named v0.19.0 homes) · 4 adjudications · **0 silently dropped**.
- Spend split (§4 mandate): subagents ≈23.7M tokens across 655 agents (L1 measurement 20.4M — ~550 router/trial calls × ~31.5k per-call system context; L2 2.3M; authoring/verification ~1M); Fable concentrated in the spec, 5 review fixes, 15-item calibration, adjudications, wrap. Estimate error and breaker gap recorded as ADJ-3.

### Deferred

L1.3 for naming/design packs (spend-breaker adjudication, explicit scorecard caveats) · CI exit-code wiring · HD-1..8 defect fixes → v0.19.0 · competitor-comparative benchmarking (needs its own legal/ethical design).

## [0.17.0] — 2026-07-02

First capability release after the v0.16.x fast-path series. Executes `prompts/dispatch/V0_17_0_ARCHITECT_PROMPT.md` (9 workstreams A–I): closes the 3-run-evidenced capability debt + lands scan mechanisms A4–A8. All counts below command-verified; per-workstream commits `4f7eb8c`→`83de7b6`.

### Added — the upgrade spine (A: scan A5 + A6-adjacent)

- **Install manifest**: `templates/shared/ai-kit-manifest.json.template` (strict JSON — parses raw) — per-file `sha256` + `template_sha256` (generation-time kit-source hash = a 3-way merge base), class/disposition/per-file kit_version/owner_customized; header: kit version (read from CHANGELOG, not memory), ide_scope, presets (variant markers), packs, placeholder map (names only — never secrets). Written by new **Phase 8.5 (mandatory, all tiers, LAST file)**; Phase 0.2 gains the existing-manifest guard (re-run over an install → route to upgrade mode).
- **`generator/UPGRADE_MODE.md`** (121 lines): dry-run-default upgrade planner — single-write plan file; three-way entry routing; **audit-first convergence** with `WORKFLOW_HEALTH_AUDIT` (≤90-day report consumed; ZOMBIE/SUPERSEDED/EXPIRED never auto-upgraded); the 2×2 diff engine (owner-hash × kit-hash → KEEP/UPGRADE/ADJUDICATE); adjudication defaults to keep-mine, merge drafts never auto-apply; **reconstructed manifests (pre-v0.17.0 installs) can never auto-UPGRADE**; zero-destructive invariants. Motivation: "fixing the kit does not heal installs" (first health-audit field run).
- **A8 merge**: `VALIDATION_CHECKLIST` **§17 Cross-Artifact Consistency** (fact agreement across generated docs, artifact-graph refs, manifest integrity, doc-derived checks, DECISIONS↔rules coherence) + Phase 5 checklist-generation step (3-5 falsifiable checks per major generated doc); §5 + Phase-5 secret sweeps extended to the manifest (kept character-identical).

### Added — the Claude Code agent layer (B; unblocks checklist §11)

- `templates/claude-code/agents/` ×5: **simplifier + reviewer + verifier** (the KB-02 §4 mandatory trio) + **security-auditor + tester** (cross-IDE ports; twins stay diffable). YAML frontmatter `name`/`description`/`tools`; command-family Bash scoping in the body (passes the §3.3 least-privilege gate); no `model:` field — routing stays at the `CLAUDE_CODE_SUBAGENT_MODEL` lever.
- `templates/claude-code/settings.json.template` (strict JSON): §7.5 permissions allow/deny skeleton, the 3 verified env levers, minimal PostToolUse format-on-write hook (`{}` when no formatter).
- `VALIDATION_CHECKLIST` §11: all 4 `(if kit provides them)` markers removed (grep = 0); scope note routes pre-v0.17.0 installs to UPGRADE_MODE.

### Added — revival + presets (C+D)

- **Phase 0.5 Owner Brief / Revival Intake** (46 lines, conditional): gate = operator declaration OR last commit >6 months OR HANDOFF/git discontinuity; ≤5 intake questions; inline OWNER_BRIEF.md skeleton; intent=revive → `docs/REVIVAL-ASSESSMENT.md`; owner intent overrides codebase-wins for **directional** content only.
- `generator/presets/nextjs-pages.md` (anti-App-Router-hallucination centerpiece) + `generator/presets/docs-ops.md` (doc-lint gates replace build/test; command-semantics remap) + **content-first/headless variant section** in `presets/nextjs.md` (manifest marker `nextjs:content-first`). Presets now 5.
- Phase 2.1 routing rewritten — `next`+`pages/` → nextjs-pages (fixes the mis-route to general-node, whose own header excludes `next`); BOTH-directories incremental-migration row; no-manifest → docs-ops. **Layered resolution formalized (scan A7)**: Phase-1 findings > preset > kit defaults; "a preset may never override a Phase-1 discovered fact" (the kit's 3 layers map scan A7's 4 — no extensions layer exists).

### Added — wayfinder + machine status (F: scan A4 + A6) and migration (G)

- `templates/claude-code/commands/workflow-help.md.template` (55 lines) — where am I / ranked ≤3 evidence-cited next actions / which tool applies; tooling discovered via `ls`, never memory; read-only. `status.md.template` (52 lines) — rewrites ONLY the new machine-generated HANDOFF section (heading added to `templates/shared/HANDOFF.md.template`); drift check flags hand-written claims contradicting git (`DRIFT:` lines, never rewrites prose); greppable `STATUS: CLEAN|DRIFT (N)`. Commands now 8. Cursor-side wayfinder: QUEUED (no run evidenced the need).
- `workflows/MIGRATION-CURSOR-CLAUDE.md` (98 lines, 19-row mapping table — every named template path verified extant): both directions; IDE-scope heuristic (directory existence weak both ways; session-evidence rule; stale-artifact ASK); frontmatter transforms preserving least-privilege; cross-ref fixup grep battery; post-migration protocol. Phase 3.4 amendments shipped (session-evidence rule + stale-artifact caveat).

### Added — KB-08 design pack (H; de-doc-only'd)

- `templates/skills/design/` ×4 (shipping-quality, zero placeholders): design-architect (critique vs NAMED best-in-world reference; refuses without a spine), design-engineer (implementNow verbatim; reuse-first/extract-≥2×/locks-sacred), design-reviewer (the measuring merge-gate — transforms after rAF×2, locked-width byte-parity, CLS, axe+Lighthouse on production builds, lock-literal grep, identity-coherent Y/N), elevation-workflow (multi-critic batched ≤3-4; no taste-polls) + `templates/shared/DESIGN-SPINE.md.template`.
- Generator gate, 5 touchpoints identical in shape to KB-07's: Phase 0.1 item 10, Phase 1.5 detection (component framework + token/theme file), §3.1 conditional block, **§3.8 router injection** (mirrors §3.7; 3 hard gates: verify-by-measurement / locks-sacred / no-taste-polls), §3.6 gate bullet. KB-08 banner rewritten.

### Changed — strict-JSON MCP + registry (E + I-i1)

- Both `mcp.json` templates → strict 2-server JSON (all 4 kit JSON templates pass `python3 -m json.tool`); github npm server + GITHUB_TOKEN deleted → remote OAuth `https://api.githubcopilot.com/mcp/`; optional blocks moved to the new companion `templates/shared/mcp-annotations.md.template` (installs as `.mcp.annotations.md` — one file, both IDE configs + settings-levers appendix). The generator's 3 comment-mandates swept (Phase 2.5 ×2, §3.3); checklist §7 accepts annotations entries + gains a strict-JSON parse item.
- Quality-gates rule templates (both IDEs): `{{CMD_*}}` gate table, never-bypass failure protocol, flaky-quarantine w/ DECISIONS entry, zero-placeholder-content policy; generator fills only gates whose commands exist.
- **Registry refresh (web-verified 2026-07-02)**: Sanity npm `@sanity/mcp-server` DEPRECATED (npm deprecation string quoted) → remote `https://mcp.sanity.io` (OAuth, no tokens); context7 re-pinned `@3.0.0` → `@3.2.2` (live dist-tags check).

### Fixed — mechanical debt (I)

- **Defect #13** (40-line gate vs 87-line orchestrator-dispatch): gate SCOPED — router/dispatch rules are routing tables, exempt from the 40-line gate, own ceiling ≤100 lines, never alwaysApply. (Split-the-template rejected: the gate was already self-contradicted by Phase 3.5/4.5's own 40-60-line router specs — scoping repairs three inconsistencies at once.)
- **Defect #16** (unenforceable 80-line CLAUDE.md floor): replaced by a measurable rule — six required sections + ≤150 ceiling, **no minimum** (a disciplined 71-line file passes); checklist §1 grep-loop; KB-02 §1 + WORKFLOW-CLAUDE-CODE §2.3 reworded consistently.
- **Duplicate-heading renumbers**: WORKFLOW-CLAUDE-CODE `### 11.3` ×2 → Pricing 11.4 / Monitoring 11.5 / $30 11.6 (Cost Levers keeps 11.3 — zero external refs broken). KB-02 `### 4.7` ×2 → Benchmarks 4.8 / Production Patterns 4.9; live refs updated (KB-02 §4.5-internal, KB-05, PSP manifest, CLAUDE-SURFACE-ROUTING → §4.5+§4.8); historical entries deliberately not edited — discharges [0.16.3]'s queued ambiguity item. Repo-wide duplicate-heading sweep: no third pair.
- **7-rule base restore** (N=4 #8): claude-code base +REUSE FIRST/PLAN FIRST/FEEDBACK LOOP; cursor base +NO ASSUMPTIONS/PLAN FIRST/FEEDBACK LOOP (29 content lines — within the ≤30 gate).
- **Verification fix-ups** (`83de7b6`, pre-adversarial sweep): reversibility-check council fallback for Starter/Intermediate (+`{{IF_NOT_ADVANCED}}` router row); Phase 4.2 check-0 "does this rule ever attach?" + `fix-attachment-config` action (2-run-adjacent via scan A3); CLAUDE.md.template command-split note; Phase 0.2 inventory +`.cursor/skills|agents`.

### Validation & verification

- Feedback dispositions: **41 rows (17 P1 / 12 P2 / 12 P3) → `feedback/DISPOSITIONS-v0.17.0.md`** — 34 SHIPPED, 6 DEFERRED-with-homes, 1 sub-clause N/A, **0 silently dropped**.
- Workstream scoreboard: **A–I all SHIPPED** (F's cursor-side equivalents and the deferred rows below are the only explicitly-queued remainders).
- Step-④ discipline: independent adversarial verifier (fresh reads, own commands, live npm re-fetch for falsifications) checked 13 release claims → **1 🚨 / 1 ⚠ / 3 🟡**, all dispositioned pre-wrap (the 🚨 was a falsely-SHIPPED disposition row — the `.env.example` §3.1 row is now actually shipped and the falsification recorded). Mechanical battery (json.tool ×4, marker/comment/npm-github/multidomain/renumber greps, budget wc checks) clean. Full delta table: HANDOFF § v0.17.0 step-④ disposition.

### Deferred (with homes)

Pending a **2nd greenfield run**: greenfield-with-locked-stack branch; TODO-aware command blocks; N/A-until-scaffold checklist status; compliance-class rule pattern; research-template ref clarification. Pending a **2nd code-repo run**: Phase-1 deploy-drift subsection. QUEUED: cursor-side wayfinder skill; `{{KIT_PATH}}`/`{{AI_KIT_PATH}}` placeholder normalization (pre-existing split — §3.7/§3.8 use `{{KIT_PATH}}` for shape parity); KB-02 §4 matrix Glob amendment (agents ship matrix-literal Read+Grep). Out of scope per contract: A9/A10 (v0.18.0-H proof harness), A11 (instinct lifecycle → KB-WS), A12 (config-audit → monthly spec), Fable-redeploy refresh (2026-08-01 monthly), public-release scrub.

---

## [0.16.5] — 2026-07-02

### Added — competitive-scan fast-path (3 mechanical adoptions) + v0.17.0 architect prompt

Sourced from `research/2026-07-02-competitive-landscape-scan.md` (two-subagent scan: full ECC README digest + 9-project ecosystem sweep → 18 adoption candidates triaged A1–A18; the dossier commits separately, dossier-first pattern). The scan confirmed 4 kit moats with zero occupants (generation-from-analysis, freshness discipline, decision layer, multidomain) and 6 deficits; the 3 mechanical candidates ship here, 5 fold into v0.17.0, 2 define v0.18.0-H (proof harness).

- **A1 — least-privilege tool matrix.** KB-02 §4 gains the canonical agent-class → tool-grant table (auditor / generator / fixer / verifier; default deny; every Bash grant names its command families — an unqualified `Bash` line is an audit finding). `PROJECT_SETUP_PROMPT` §3.3 agent quality gate enforces it. The 4 cursor agent templates granting Bash re-scoped: tester (project's test command only), seo-auditor (build/dev only, no network beyond localhost), security-auditor (read-only checks), i18n-validator (read-only compare scripts).
- **A2 — numeric token-economy levers.** WORKFLOW-CLAUDE-CODE §11.3 gains a settings-level lever table: `MAX_THINKING_TOKENS`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` (=50, the official docs' own example), `CLAUDE_CODE_SUBAGENT_MODEL` (v2.1.196+ `inherit` semantics) — **all three env vars verified against code.claude.com/docs/en/env-vars same-day**; effect figures explicitly marked unbenchmarked field reports. Plus MCP surface ceiling (~10 servers / ~80 active tools; bloat shrinks 200K toward ~70K usable) and compact-at-breakpoints doctrine (never mid-implementation). KB-01 §2.3 cross-links the levers.
- **A3 — dead-rule lint.** `WORKFLOW_HEALTH_AUDIT` lens 3 extended with **dead scoping** (a rule whose globs match zero files never fires; test mechanically; minimum ⚠). `VALIDATION_CHECKLIST` §3 gains a repeatability item — the glob checks must re-run on restructures (CI step / quarterly audit / third-party linters `claude-rules-doctor`, `agnix` — marked verify-before-adopting).
- **v0.17.0 architect prompt manifested:** `prompts/dispatch/V0_17_0_ARCHITECT_PROMPT.md` — 9 workstreams (A: upgrade mode on an install manifest — the spine; B: claude-code agents + settings.json; C: owner-brief/revival Phase 0.5; D: nextjs-pages + docs-ops presets + layered resolution; E: strict-JSON mcp sweep + quality-gates rule; F: wayfinder + machine-status commands; G: Cursor↔Claude migration; H: KB-08 skill pack + gate; I: mechanical debt incl. defects #13/#16 and the duplicate-heading fixes), KB-04 dispatch format, step-④ verification mandate, strict out-of-scope (harness → v0.18.0-H; Fable-redeploy refresh → 2026-08-01 monthly).

---

## [0.16.4] — 2026-06-26

### Fixed — model-availability fast-path (the kit was routing to a suspended model)

Theme 1 of `research/2026-06-26-monthly-integration-dossier.md`, shipped as fast-path (stale-reference/blocker per the vigilance boundary lock). The kit's surface-routing still sent work to **Fable 5 / Mythos 5, which have been administratively unavailable since 2026-06-12** under a US export-control directive (still offline 2026-06-26, no restoration date; web-verified — [anthropic.com/news/fable-mythos-access](https://www.anthropic.com/news/fable-mythos-access)).

**`CLAUDE-SURFACE-ROUTING.md`:**
- **§1a reframed to an architectural fact** — leads with the suspension ("do not author routing that depends on these models"); the model spec is demoted to "reference only — if/when restored"; the compliance lesson is carried forward.
- **New §1b — model-availability resilience:** pin to a model *class* + a declared fallback chain, never a single ID; three failure modes (rate-limit/overload, quality-degradation, **administrative-unavailability**); substitution must be *visible* (Anthropic reversed silent fallback after its 2026-06-11 apology).
- Stale Fable-as-live references fixed: §1 Claude Code blurb (line 13), anti-pattern #11, off-cycle trigger list, header refresh marker.

**`KB-02`:** §4.7 fallback-chain paragraph augmented with the third failure mode + visible-by-default doctrine (Fable suspension as field proof); the model-class note carries the suspension; **new §8.5 model-retention gate** — a class with mandatory retention that voids ZDR/zero-retention DPAs (Mythos-class 30-day, no opt-out) is a procurement-review trigger (Microsoft restriction + Forrester as field evidence).

**`KB-04` §4.1 + `WORKFLOW-CLAUDE-CODE` §11.2:** the "Fable = strongest synthesis model" routing line now says suspended / use Opus 4.8; WORKFLOW §11.2 gains a `fallbackModel` resilience lever.

Themes 2–5 (MCP security cluster + author-expectations, Claude Code v2.1.18x, Bedrock matrix) remain queued for the **2026-07-01 monthly integration** per the dossier's dispatch plan.

---

## [0.16.3] — 2026-06-26

### Fixed — stale-reference fast-path (v0.16.2's own scanner fix had already gone stale)

**MCP scanner rebrand swept across the kit (16 occurrences, 9 files).** Field-confirmed by two clean-room generator runs (P2 N=3, P3 N=4) and **web-verified 2026-06-26**: Invariant Labs' `mcp-scan` was rebranded **Snyk Agent Scan** (PyPI `snyk-agent-scan`, run `uvx snyk-agent-scan@latest`) after Snyk's 2025 acquisition of Invariant Labs — so v0.16.2's `uvx mcp-scan@latest` fix went stale within days. All invocations now use `uvx snyk-agent-scan@latest`; anchor notes record the rebrand, the **`SNYK_TOKEN` requirement** for a full verdict (without it the scan degrades to inventory), and the non-TTY stdio-consent behavior. Files: `generator/PROJECT_SETUP_PROMPT.md`, `generator/VALIDATION_CHECKLIST.md`, `templates/claude-code/commands/discover-mcp.md.template`, `templates/claude-code/CLAUDE.md.template`, `knowledge-base/KB-01`, `knowledge-base/KB-02`, `knowledge-base/MCP-SERVER-REGISTRY.md` (canonical anchor), `workflows/WORKFLOW-CLAUDE-CODE.md`, `workflows/WORKFLOW-CURSOR.md`. The 4 surviving `mcp-scan` mentions are intentional "formerly / old npm" history.

**KB-05 self-inconsistencies reconciled** (P2 #6 + P3 #13). §2 catalog said "Five skills at 🚨 BLOCKER" then listed six → "Six … BLOCKER severity; Starter ships five, `council-3-voice` gated to Advanced for cost." `cost-of-inaction` was tagged HIGH in §12.2 but MEDIUM everywhere else (catalog, generator table, checklist §12); §12.2/§12.3 now agree with the authoritative MEDIUM/Advanced placement (§12.2 = 3 HIGH; §12.3 = 4 remaining incl. `cost-of-inaction`).

**Banned Postgres server purged from a shipped preset** (P2 #1). `generator/presets/general-node.md` recommended `@modelcontextprotocol/server-postgres` — archived May 2025, known SQL-injection bypass (Datadog), already banned by the registry. Swapped to `mcp-postgresql-ops` (PyPI via `uvx`, pinned `@3.2.8`) with an inline advisory.

### Added — KB-08 Design-Elevation Engineering (OPTIONAL pack, doc-only this release)

`knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md` — design quality is engineered: establish a singular concept → codify a decision-spine → adversarial elevation → **verify by measurement, not assertion**. Conditional like KB-03/KB-07 (frontend/design/UX only). **Doc-only:** the skill family (`templates/skills/design/`) + conditional generator gate are deferred to v0.17.0 — a `Status` banner in the doc and the CLAUDE.md index row both say so (no silent half-pack). §10 brought into **multidomain compliance** (KB-03 provenance pattern: abstract prose + the private lab's worked instance (not shipped) path pointer; motion name, tokens, archetypes, `IMPL_42` specifics stay project-local).

### Validation — generator now run on 3 real projects

`feedback/2026-06-11-P2.md` (N=3, first CODE-repo run, dormant-revival — 11 defects + 12 suggested changes), `feedback/2026-06-13-P3.md` (N=4, first greenfield-with-locked-stack, first Advanced-tier validation — 14 findings + 12 suggested changes), the lab's first health-audit field report (private) (first `WORKFLOW_HEALTH_AUDIT` field run — 6 abstracted candidates). Mechanical, ≥2-run-confirmed items ship here; capability items converge into v0.17.0.

### Housekeeping

Committed the two Cowork supplemental scans feeding weeks 24–25 (`vigilance/feed/daily/2026-06-13-supplemental.md`, `2026-06-20-supplemental.md`). `WORKFLOW_HEALTH_AUDIT.md` gained a recommended-cadence line (quarterly + post-restructure). `CLAUDE-SURFACE-ROUTING.md` refresh marker reworded to a firing mechanism (vigilance cadence, not a calendar date). HANDOFF refreshed to true state.

### Deferred to v0.17.0 (capability work — now 3-run evidenced)

Owner-brief / revival mode (Phase 0.5); `presets/nextjs-pages.md` + nextjs content-first/headless variant; quality-gates rule template; `mcp.json` strict-JSON + companion-annotations convention (install-breaking `//` comments + remote-server defaults); Cursor↔Claude migration recipe; `templates/claude-code/agents/*` + `.claude/agents/` destination; upgrade/audit mode (converge with `WORKFLOW_HEALTH_AUDIT`); KB-08 skill pack + generator gate; registry refresh (Sanity npm→remote, context7 pin). Single-run greenfield findings promote after a 2nd greenfield run.

---

## [0.16.2] — 2026-06-10

### Fixed — P1 clean-room friction report: 15 of 17 suggested changes executed

The first clean-room generator validation (strategy step ⑤, brownfield docs repo) produced `feedback/2026-06-10-P1.md` — 16 defects, 7 missing patterns, 17 file:line-precise suggested changes. This release executes the 15 mechanical items verbatim against verified line targets. The two capability items — `generator/presets/docs-ops.md` and the `templates/claude-code/agents/*` set — are deferred to v0.17.0 scope per the HANDOFF triage (they are new artifacts, not fixes).

**Phantom-scanner fix (the 🚨).** `@anthropic/mcp-scan` does not exist (npm 404, live-checked 2026-06-10) — the KB-01 §6.5 phantom-package failure inside the kit's own generator. The kit named the scanner three different ways, none fully correct. All occurrences now use the verified Invariant Labs invocation `uvx mcp-scan@latest`: `generator/PROJECT_SETUP_PROMPT.md` (Gate 4 + Phase 5), `generator/VALIDATION_CHECKLIST.md` §7, `templates/claude-code/commands/discover-mcp.md.template` (×2), `templates/claude-code/CLAUDE.md.template`, and `knowledge-base/MCP-SERVER-REGISTRY.md` (which said bare `npx mcp-scan`). The registry now carries the anchor line distinguishing the PyPI scanner from npm's unrelated third-party `mcp-scan`; `workflows/WORKFLOW-*.md` and KB-01's tooling table already had the correct invocation.

**`generator/PROJECT_SETUP_PROMPT.md`:**

- Phase 0.1 item 5: KIT-VIGILANCE pointers now name the file's real headings ("What this is", "The three-cadence architecture") — it has no § numbers and no maturity-tiers section (that doctrine lives in KB-04 §8 + Phase 1.6).
- Phase 0.2 inventory: added `.claude/skills/`, `.claude/agents/` (the very directories Phase 3 installs into) and `governance/`/`docs/` ledger locations — DECISIONS files do not always live at root.
- Phase 1.1: **no-manifest branch** for docs/ops repos — skip 1.1/1.4 mechanics, analyze the docs corpus (conventions, freshness/citation discipline, governance artifacts) instead; `deploy`/`debug`/`refactor`/`migration` assets out-of-scope. Wired into the 2.1 detection table and the 2.3 fallback.
- Phase 1.6: **stakes override** — locked decisions with legal/financial exposure OR human money-gates bump one tier regardless of headcount (aligns the heuristic with KB-04 §8.4; the P1 run under-classified relative to revealed need).
- Phase 2.5 Step 3: PyPI search lances (`pip index versions {service}-mcp`) + note that official vendor servers may be Python-distributed — the npm-only search could not find them.
- Phase 2.5 Step 5: **governance branch** — projects that gate credentials/identity (or keep their own MCP vetting registry) get proposals + a bootstrap checklist instead of config edits; governance wins like codebase wins.
- Phase 3.1 table: seven Cursor-side "Always" rows → "If Cursor in scope (Phase 3.4)"; `deploy.md` → "Only if deployable" (same condition as the deployment skill — was the placeholder-riddled-dead-file trap); row-condition legend added, including the greenfield rule (neither IDE dir present → ASK, "both being created fresh" was undefined).
- Phase 4.1: root-cleanup list now exempts files classified as active context (e.g., a master plan) and forbids archiving any file other root docs link to — closes the archive-the-most-important-file-in-the-repo hazard.
- Phase 4.3: two new protocol rows — installed skill/agent (diff vs kit template: identical → keep; customized → keep; older → keep + offer upgrade, never overwrite silently) and filled HANDOFF.md (keep; the "Template only" generation row applies only when none exists). DECISIONS row generalized to any ledger location/format; never fork an existing source of truth with a second root ledger.
- Phase 5: "execute every check in sections 1-10" → all sections (the checklist has 16; the stale pointer dropped the kit's most distinctive checks), 14-16 may be Pending/N-A by tier. Secret-grep synced with the checklist's value-shaped patterns (drift prevention — same check, two homes).

**`generator/VALIDATION_CHECKLIST.md`:**

- §5: secret grep tightened to value-shaped patterns (`sk-[A-Za-z0-9]{8,}`, `AKIA[0-9A-Z]{16}`, `ghp_[A-Za-z0-9]{20,}`, value-shaped Bearer/password/secret) — bare `sk-` fired on "ta**sk-**to-route" prose; `${ENV_VAR}` refs pass.
- §7: scanner invocation fixed (above).
- §10: Cursor-side items conditioned on "if Cursor in scope"; DECISIONS item accepts non-root ledgers and forbids duplicating them; `deploy` command no longer assumed in the minimum-3 commands.
- §11: scope note + "(if kit provides them)" markers on PostToolUse hooks, settings.json permissions, and the three mandatory subagents — the kit ships no templates for these, so the items were unpassable by construction. Markers come off when v0.17.0 ships the artifacts.

**Templates:**

- `templates/shared/ARCHITECT_PROMPT.md.template` (lines 3/133/310): `(./DECISIONS.md)` → `{{DECISIONS_PATH}}`; all `../../../` kit-internal links → `{{AI_KIT_PATH}}/...` (the relative base escapes any repo that isn't the kit); guidance comment added per the template's placeholder-with-comments style.
- `templates/claude-code/rules/orchestrator-dispatch.md.template`: long-form-reference line conditional ("if present" — do not invent the path); DECISIONS numbering block → `{{DECISIONS_PATH}}` + `{{DECISIONS_ENTRY_REGEX}}` (default `^## Implementation #`) with the silent-collision warning — the hardcoded grep returned 0 on a `## D{N}` ledger and would have collided with D10.
- `templates/claude-code/commands/discover-mcp.md.template`: duplicated step numbers (5,6,7,6,7) → sequential 1-9; scanner invocation fixed (×2).

**Also entering the repo in this commit** (untracked from the step-⑤ session): `feedback/2026-06-10-P1.md` (the friction report itself) and `prompts/dispatch/WORKFLOW_HEALTH_AUDIT.md` (legacy-workflow audit dispatch, written same day — converges with upgrade/audit mode in v0.17.0 scope).

**Deferred to v0.17.0** (capability work, per triage): docs-ops preset + non-code template variants; `templates/claude-code/agents/*` mirroring the Cursor agent set; upgrade/audit mode for kit-aware projects; checklist §11 artifact templates. Note: the 40-line-rule-vs-87-line-template tension and the unenforceable CLAUDE.md 80-line floor (defects #13/#16) had no entries in the feedback's Suggested Changes section and ride with v0.17.0.

---

## [0.16.1] — 2026-06-10

### Fixed — Vigilance stale-clone self-healing (Step 0 in all three cloud dispatches)

The cloud-routine stale-clone failure mode fired 3 times in 7 days (06-04, 06-07, 06-10 daily pulses) and separately halted the 06-01 monthly-integration run. Root cause: the routine container's clone can be days behind `origin/main`, so the scan establishes its cursor baseline against missing history — prior digests look absent, already-covered findings resurface, and the digest must be rebased-and-tightened post-composition (the 06-10 digest's "CORRECTION-AND-TIGHTEN" note is the canonical example).

Fix: **Step 0 — Sync the clone** (`git pull --rebase origin main` as the mandatory first action, with a fail-open "possibly-stale baseline" framing rule) added to `prompts/dispatch/DAILY_PULSE_SCAN.md`, `WEEKLY_SYNTHESIS.md`, and `MONTHLY_INTEGRATION.md`. The daily's header claim "Routines clone the repo fresh at run start" — the documented-but-false premise — corrected to record the observed reality.

**Bootstrap caveat (operator action recommended):** a routine whose clone predates this commit reads the *old* dispatch and never sees Step 0 — the in-repo fix only becomes fully self-healing once it has been on `main` longer than typical staleness (~a week). To make it immediate, prepend one line to each routine's stored prompt on `claude.ai/code/scheduled`: "First action: `git pull --rebase origin main`, then read and execute `prompts/dispatch/<NAME>.md`."

---

## [0.16.0] — 2026-06-10

### Added — KB-06 Managed Agents + the agent-org layer (strategy steps ③–④)

Executes the 5-step strategy locked 2026-06-10 (HANDOFF § "Next major: KB-06"), steps ③ (author via architect prompt) and ④ (independent adversarial verification). Steps ① (v0.15.2 deck-clear) and ② (two research dossiers, committed `42df785`) were complete; the monthly-integration promotion gate (2-week cross-cutting dwell, weeklies 22+23) was already exceeded, so authoring ran on the locked strategy rather than waiting for 2026-07-01. **Beta discipline applied throughout** per the v0.15.2 calibration note: every Managed Agents claim is bounded to the `managed-agents-2026-04-01` beta header reality as of 2026-06-10; no GA claims anywhere; preview-gated sub-features (Dreaming, MCP tunnels, possibly multiagent) flagged as such.

#### 1. `prompts/dispatch/KB06_ARCHITECT_PROMPT.md` (new)

The KB-04 §5 14-section architect prompt, written fresh from the two dossiers *after* reading them (per the strategy lock), then executed in-session. Records the in-session re-verification of Dossier A's open questions: reference page re-fetched (beta-header line, 300/600 rpm, branding rules confirmed; event accordions client-rendered → spill-to-file stays unverified), agent-setup + multi-agent pages re-fetched (`callable_agents` "research preview … request access" vs unbannered `multiagent.agents` — live docs inconsistency confirmed, documented as such), public claude-code changelog tops out at 2.1.110 (`waitingFor` unverifiable → omitted).

#### 2. `knowledge-base/KB-06-MANAGED-AGENTS.md` (new — fills the reserved slot)

Core KB (cross-cutting like KB-04, not an optional pack — Dossier A §H.1). §0 distillation; §1 primitive glossary with per-primitive [beta]/[preview] status + beta boundary table + limits inventory; §2 brain/hands/session architecture, fourth-surface-*shape* mapping, Code/SDK→MA migration table; §3 scheduled execution + the canonical three-way table (MA deployment vs Code Routine vs Cowork task); §4 multiagent sessions (agent-scoped MCP, snapshot-pinned rosters, thread observability, gating caveat); §5 containment & credential doctrine (credentials-never-in-sandbox ×3 implementations, allowlist-as-capability-grant, 93%/24-of-25 evidence, memory hygiene incl. MINJA-class research context); §6 self-hosted work queue + provider matrix; §7 evidence-graded field economics (Wisedocs 7×/10× anchor, lock-in critique, $0.08-is-noise, 2026-06-15 credit split, runaway postmortems → "monitoring is not enforcement"); §8 six-gate adopt/defer rubric; §9 twelve anti-patterns; §10 cross-refs + GA-triggered refresh; §11 uncertainty log (spill-to-file, `callable_agents` gating, ZDR-under-self-hosting, `waitingFor`, Cowork internals, all-costs-are-projections).

#### 3. KB-04 §4.7 "Async multi-agent orchestration" (new) — §4.7/§4.8 renumbered to §4.8/§4.9

The two cookbook patterns (peer-hub fixed team; lead-spawn-monitor) with the shared hub substrate and the append-inbox-to-last-tool-result mechanic; the scripted variant (dynamic workflows, script-holds-the-plan, adversarial cross-checking); pointer to KB-06 §4 for the managed implementation; an async-vs-waves decision table (decision-grade synthesis stays wave-based — the human gate *is* the quality mechanism); the multi-agent trust-escalation warning inline (sub-agent output is tool output); cost note. **Renumber notice:** pre-0.16.0 CHANGELOG/HANDOFF references to "KB-04 §4.8 anti-pattern" (v0.15.1/v0.15.2 entries) refer to the section now numbered §4.9; historical entries deliberately not edited. §13 cross-references gain KB-06.

#### 4. CLAUDE-SURFACE-ROUTING.md — §3a scheduled-work routing + §4a threat-model-per-surface

Purpose line reframed (MA = fourth surface routed via §3a, not a fourth matrix column); matrix row 8 marked three-way (+ cloud Routines ⚠ in the Code cell); rubric Q3 no longer auto-routes scheduled loops to Cowork; new **§3a** (ask-first routing table + hard gates: regulated-workload exclusion across all three, identity-as-discriminator, cost-enforcement-before-scheduling) distilling KB-06 §3; new **§4a** (four-row isolation-pattern table — ephemeral container / HITL sandbox / sealed VM / MA split-brain — plus the six portable doctrine bullets: capability-grant allowlists, environment-is-the-defense 24/25, isolation-matched-to-oversight, config-is-inbound, EDR blindness, battle-tested primitives) distilling KB-06 §5 + the 2026-05-25 containment post; anti-pattern #12 (no regulated workloads on MA); §5 off-cycle trigger for MA GA / Routines preview exit; §6 quote library +4 (beta-header line, ~93%, capability grant, "The model never sees the secret"); §7 cross-refs gain KB-06 + KB-04 §4.7.

#### 5. Bookkeeping

CLAUDE.md + README repo maps and key-files/coverage sections gain KB-06 (the "(KB-06 reserved …)" parentheticals retired); README knowledge-base count 7→8 files.

### Verified (step ④ — independent adversarial verification)

- Independent subagent re-checked every load-bearing claim against both dossiers, independently re-fetched the three MA doc pages + the public claude-code CHANGELOG + `git log`, and swept doc↔kit cross-reference consistency. **Result: 0 🚨 / 4 ⚠ / 8 🟡 — all twelve dispositioned before commit; full disposition table in HANDOFF § "v0.16.0 step-④ disposition".** Three checks returned zero findings: beta discipline (no GA assertion anywhere), numbers sweep (every limit/figure matches the dossiers), multidomain lock.
- In-session primary-source re-fetches during authoring (2026-06-10): MA reference, agent-setup, multi-agent pages (resolved Dossier A open questions §I.2 → documented-as-inconsistency; §I.1/§I.5 → remain unverified); public claude-code CHANGELOG (tops out at 2.1.110).
- Unverified items appear in uncertainty logs only **within `knowledge-base/` and the new artifacts** (grep-checked: no body claim for spill-to-file / `waitingFor` / Enterprise-workflows-default). The two pre-dossier dispatch prompts retain those claims verbatim as provenance — now carrying ⚠ post-run falsification annotations at their heads (verification finding #3).
- Cross-reference sweep: KB-06 ↔ KB-04 §4.7 ↔ SURFACE-ROUTING §3a/§4a pointers resolve; canonical-table ownership respected (three-way table lives in KB-06 §3 only); KB-04 renumber clean outside immutable historical entries.

### Deferred (unchanged from [0.15.2], plus KB-06 follow-ons)

Strategy step ⑤ (live generator validation on a fresh project — closes the N=1 debt); KB-01 §3.7 memory-hygiene extension (KB-06 §5 is canonical until it lands); MCP-SERVER-REGISTRY tunnels posture entry + MA-consumes-remote-servers note; WORKFLOW-CLAUDE-CODE Routines subsection; orchestrator-dispatch template MA/Routines dispatch targets; KB-02 §agent-architecture cross-ref; WATCHLIST `sandbox-runtime` source add; v2.1.16x cluster; MCP author-checklist; Bedrock multi-vendor framing; CI-HARDENING reference page. **New from step-④ verification:** KB-02 duplicate `### 4.7` headings (lines ~363/~375 — makes "KB-02 §4.7" references ambiguous; pre-existing, surfaced by the renumber sweep) and the "KIT-VIGILANCE anti-pattern #4" mispointer sweep (Dossier A §I.8 — the beta-discipline citation actually points at watchlist pruning; encodings annotated, canonical fix queued). All queued for monthly integration 2026-07-01.

---

## [0.15.2] — 2026-06-10

### Fixed — Clock-accuracy refresh: Fable 5 / Mythos 5 GA + claude-code-action CI hardening

Second cadence-confirmed fast-path (pattern: v0.14.1 / v0.14.2 / v0.15.1). Trigger: 2026-06-10 daily-pulse 🚨 #1 (Fable 5 + Mythos 5 GA, kit-compose status NOT COVERED — `grep -ri "fable|mythos"` across kit surfaces returned zero) + weekly-23 candidate #4 ("handle this week": claude-code-action RyotaK CVE, the kit's own §16 recommendation directly exposed). Facts verified primary-source at patch time: direct fetch of `anthropic.com/news/claude-fable-5-mythos-5` (2026-06-09), direct fetch of SDK `v0.109.1` release tag (2026-06-09, `frontier_llm` refusal category), live runtime evidence `claude-fable-5[1m]` in this Cowork session (2026-06-10) — same evidentiary standard as the v0.14.1/v0.15.1 1M-context claims.

#### 1. Fable 5 / Mythos 5 model-class refresh

Anthropic shipped a model tier **above Opus** (Mythos-class) on 2026-06-09: **Fable 5** (`claude-fable-5`, GA everywhere; $10/$50 per M ≈2× Opus; 1M context; cyber/bio-chem/distillation requests fall back to Opus 4.8, <5% of sessions, user informed, billed at Opus prices; plan-tier inclusion only through 2026-06-22, usage-credits-only from 2026-06-23; mandatory 30-day retention on Mythos-class traffic) and **Mythos 5** (same weights, safeguards lifted, Glasswing/trusted-access only). Kit updates:

- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — new **§1a Model-class routing (Mythos tier)** (Fable-vs-Opus-4.8 routing call + the three caveats: classifier fallback on cyber/bio-adjacent repos, 2026-06-22/23 plan-inclusion deadline, 30-day retention); Claude Code capability line (Fable 5 selectable as of v2.1.170); row 9 1M-context (adds `claude-fable-5[1m]`, live Cowork evidence 2026-06-10); anti-pattern #10 extended + new **anti-pattern #11** ("do not treat Fable 5 as Opus 5" — different class, different economics, needs an explicit gate not a silent swap); §5 off-cycle triggers (Mythos-class added; next known date 2026-06-23).
- `knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` — §4.7 model-class update block (benchmark table predates the Mythos tier; re-run comparisons when post-Fable SWE-bench numbers publish); §4.5 new **fallback-chain-as-first-class-primitive** paragraph (SDK v0.108.0 server-side fallbacks via `server-side-fallback-2026-06-01` beta header — API + AWS only — plus client middleware in 5 languages; Claude Code v2.1.166 `fallbackModel`; Fable→Opus-4.8 internal fallback as the frontier-scale production proof; log fallback events — silent model degradation breaks reproducibility).
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` — §4.1 synthesis-surface row + §4.8 anti-pattern (Cowork 1M list adds Fable 5; synthesis model note: Fable strongest but 2× price, Opus 4.8 stays cost-rational default).
- Templates deliberately untouched: they pin via `{{PLACEHOLDER}}`, no stale model strings to refresh (verified by grep).

#### 2. §16 CI hardening (WORKFLOW-CLAUDE-CODE.md)

The kit's §16 recommends `/install-github-action`; pre-v1.0.94 `claude-code-action` trusted any `[bot]`-suffixed actor — fake-bot + issue-body prompt injection could exfiltrate OIDC tokens and gain write access (RyotaK / GMO Flatt Security, CVSS 7.8, disclosed 2026-06-04, fixed v1.0.94). Added to §16.1: **version floor ≥ v1.0.94** (with the fix's four mechanisms named) + **never ship `allowed_non_write_users: "*"`** (Anthropic's own early example contained it). New **§16.4 billing note**: from 2026-06-15, GitHub Actions / Agent SDK / `claude -p` usage moves off plan limits onto per-user monthly SDK credits ($20–$200 by plan, no rollover); production CI at scale belongs on API keys. Closes weekly-23 candidate #4's fast-path half; the consolidating `CLAUDE-CODE-CI-HARDENING.md` reference page stays queued for monthly integration.

#### Also riding in this commit (vigilance backfill, uncommitted from prior desktop sessions)

`vigilance/feed/daily/2026-06-06-supplemental.md` + `2026-06-08-supplemental.md` (2nd + 3rd Cowork supplemental scans), the lab's depth-ladder methodology note (private) (methodology: depth ladder + independent-verification-beats-self-calibration, KB-05 candidate), and the 6/01 monthly-routine stale-clone diagnosis notes in CHANGELOG/HANDOFF.

### Calibration note (vigilance QA)

The 2026-06-10 daily-pulse framed Managed Agents as "no longer a beta-stub surface" after the 6/09 docs+SDK+cookbook delivery. Cross-check against the docs: the surface still requires the `managed-agents-2026-04-01` **beta** header — docs maturity ≠ GA. The weekly-23 synthesis had it right (severity capped per anti-pattern #4). KB-06 authoring (queued, monthly integration 2026-07-01) must write against a beta surface with bounded claims. Operational: the routine's **stale-clone failure mode recurred a 3rd time in 7 days** (06-04, 06-07, 06-10) — the standing mitigation (dispatch Step 1 = `git pull --rebase origin main` before cursor establishment) is now overdue for the next routine-config revision.

### Deferred (acknowledged, not in this patch)

- **KB-06-MANAGED-AGENTS.md** — 2-week cross-cutting dwell, promotion overdetermined; ships via monthly-integration architect prompt (2026-07-01) against the now-stable-enough beta surface (docs tree + SDK v0.109 deployments + Sentry-triage scheduled-deployment cookbook + async multi-agent cookbook).
- **Claude Code v2.1.16x cluster** (fallbackModel/waitingFor/requiredMinimumVersion/OTel/dynamic-workflows org-policy) — weekly-23 candidate #2, monthly integration. Only the fallback-chain *concept* note shipped now (KB-02 §4.5); the template/workflow integration is the architect-prompt's job.
- **MCP author-checklist** (§author-expectations in MCP-SERVER-REGISTRY) + **Bedrock multi-vendor framing** + **containment doctrine / CI-HARDENING reference page** — monthly integration per weekly-23 #3/#5 and the 06-08 supplemental.

### Verified

- Post-patch grep: `fable|mythos` now present in the three load-bearing routing/capability surfaces (SURFACE-ROUTING, KB-02, KB-04) and CHANGELOG only; zero hits in templates/generator/prompts (correct — placeholders + monthly-integration scope).
- §16 patch carries: version floor, `allowed_non_write_users` warning, threat mechanism, billing date + credential guidance.
- Dates cross-checked against primary sources: 06-09 GA, 06-15 billing, 06-22/23 plan-inclusion, 06-04 CVE disclosure.
- Multidomain-clean: world-facts only; no project-specific tokens introduced.

---

## [0.15.1] — 2026-06-01

### Fixed — Clock-accuracy refresh: Opus 4.8 GA + docs URL redirect + `/simplify` ↔ `/code-review` split

First kit patch of the new session, and the first **confirmed by the vigilance discipline's first weekly synthesis** (`vigilance/feed/weekly/2026-22.md`, ISO week 22). Three of that synthesis's five action candidates — #2 command split, #4 docs redirect, #5 Opus 4.8 GA — matched the v0.15.1 fast-path queue carried over from the 5/29 daily-pulse, independent cadence corroboration that these were real. CMA/KB-06 (candidate #1) and Pydantic AI v2 (candidate #3) deliberately deferred (see below). Same fast-path operational pattern as v0.14.1 / v0.14.2.

Facts re-verified against the kit's own GitHub-sourced daily digests (2026-05-29 → 2026-06-01) and first-party live runtime evidence (`claude-opus-4-8[1m]` observed in this Cowork session, 2026-06-01). Direct WebFetch to the GitHub release pages was timing out at patch time; citations rest on the digests' captured release-note URLs plus the live model-string observation — the same evidentiary standard the kit used for the v0.14.1 Opus-4.7 1M-context claim. (Post-patch, a WebSearch on 2026-06-01 independently confirmed Opus 4.8 GA on 2026-05-28 with a 1M-token context window default on the Claude API / Bedrock / Vertex AI, pricing unchanged at $5/$25 — sources: `anthropic.com/news/claude-opus-4-8`, `platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8`.)

#### 1. Opus 4.8 model-reference refresh

Claude Code v2.1.154 (2026-05-29) set **Opus 4.8** as the default model and relabeled the `/effort` slider to **Faster/Smarter**; Anthropic Python SDK v0.105.0 GA'd the `claude-opus-4-8` identifier; v2.1.158 extended Auto mode (Opus 4.7 + 4.8) to Bedrock/Vertex/Foundry via `CLAUDE_CODE_ENABLE_AUTO_MODE=1`. The kit's model references stopped at Opus 4.7. Updated the capability/routing claims only (historical/provenance references correctly record what was used at authoring time and were left intact):

- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — Claude Code capability line (Opus 4.8 default + Faster/Smarter rename), row 9 (1M-context auto-on now lists Opus 4.6/4.7/4.8; `claude-opus-4-8[1m]` Cowork live evidence 2026-06-01), anti-pattern #10.
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` §4.1 surface table + §4.8 anti-pattern (Cowork 1M now 4.7/4.8).
- `workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md` uncertainty log (1M model list).
- `prompts/code-handoff-prompts.md` plan-tier note; `templates/shared/ARCHITECT_PROMPT.md.template` dispatch example.

Left untouched deliberately: research-provenance lines (README, KB-01/KB-02 source headers), the Opus 4.6 SWE-bench score table, verbatim Quote 5 in CLAUDE-SURFACE-ROUTING.md (a cited external quotation — not rewritten), and co-author lines in case studies.

#### 2. `docs.claude.com` → `platform.claude.com/docs` sweep

`docs.claude.com` now 301-redirects permanently to `platform.claude.com/docs`. Updated the live kit-level references: `knowledge-base/CLAUDE-SURFACE-ROUTING.md` (quarterly-pass URL), `workflows/KIT-VIGILANCE.md` (reachability note), `prompts/dispatch/DECISION_TECHNIQUES_RESEARCH_2026.md` (marketplace source), and `vigilance/WATCHLIST.md` (#35 source URL + name, #29 skills URL, Cat-2 Agent SDK note, two Tier-2 `site:` filters). Source #35 preserved as a watchlist entry with its URL updated. Historical references in `vigilance/feed/**` digests and the v0.14.2 CHANGELOG entry left intact for audit accuracy; the `case-studies/` reference is left in its isolated worked-example per the multidomain lock.

#### 3. `/simplify` ↔ `/code-review` command split

Claude Code v2.1.147 renamed `/simplify` → `/code-review` (correctness); v2.1.154 then **re-introduced `/simplify` as a separate cleanup-only command** — the two now coexist rather than one aliasing the other. The kit treated the rename as a one-way replacement. Updated `workflows/WORKFLOW-CLAUDE-CODE.md` inner-loop table (two-command distinction: `/code-review` correctness + `--fix` + Faster/Smarter; `/simplify` cleanup-only) and `generator/VALIDATION_CHECKLIST.md` parallel note. The generic "simplify" verb in `templates/cursor/skills/refactor.SKILL.md.template` is not the command — left as-is.

### Deferred (acknowledged, not in this patch)

- **CMA / `KB-06-MANAGED-AGENTS.md`** (synthesis candidate #1) — the week's only cross-cutting theme (5-day dwell × 3 source categories) and the strongest signal, but beta (`managed-agents-2026-04-01` preview); per KIT-VIGILANCE anti-pattern #4 ("no kit lock-in on betas") it earns reference-level coverage via the monthly-integration architect-prompt path, not a fast-path lock. Separate larger effort.
- **Pydantic AI v2** (candidate #3) — beta; monitor only.
- **SDK v0.105.0 "mid-conversation system blocks" KB-02 note** — deferred pending direct release-note re-read (WebFetch was down at patch time); the primitive is real but the kit won't encode behavior it hasn't verified from source.

### Verified

- Post-sweep grep: zero live `docs.claude.com` references remain in main-kit surfaces (`knowledge-base/`, `workflows/`, `generator/`, `prompts/`, `templates/`, `vigilance/WATCHLIST.md`) except intentional "formerly …" annotations; historical digests + CHANGELOG + isolated case-study untouched.
- Opus 4.8 now present in the four load-bearing routing/capability claims; provenance/score/quote references confirmed untouched by grep.
- Command-split edits land in both the workflow doc and the validation checklist.
- Multidomain-clean: world-facts only (model versions, URLs, command behavior); no project-specific tokens introduced.

### Why this matters

Silent staleness is the kit's top failure mode, and this is the first patch where the **weekly cadence** — not just the daily pulse or operator eyeballing — supplied the corroboration. The kit's model references, doc URLs, and command surface are now current to the 2026-06-01 ecosystem state, and the deferral discipline (betas wait, GA ships) held under real signal.

### Changed — Vigilance: first supplemental Cowork scan + hybrid-model hardening

The weekly-22 synthesis flagged a 🚨 source-health failure — ~18 of 35 watchlist sources (all Cat 1 vendor channels, all Cat 3 research) unreachable all week under the cloud routine's `github.com`+`npmjs.com` allowlist. This session ran the **first operator-triggered Cowork supplemental scan** to cover them — the hybrid-model half designed in v0.14.2 but never executed.

- **First supplemental scan** (`vigilance/feed/daily/2026-06-01-supplemental.md`) — 14/21 blocked sources reached via WebSearch. Verdict: weekly-22's 5 candidates all hold. Net-new: (a) CMA is bigger than scoped — KB-06 needs a real architecture chapter (Dreaming / Outcomes / brain-hands-session decoupling), not a stub; (b) a third-party MCP-CVE blind-spot (PraisonAI / n8n-mcp May-29 cluster — ⚠, no kit-recommended server affected); (c) two new themes (Apple Xcode 26.3 Agent-SDK surface; cross-vendor managed-agent convergence — GPT-5.5 Instant default, Mistral Vibe, DeepMind Co-Scientist); (d) practitioner/community channels confirm KB-05 council + anti-pattern #4. All routed to monthly integration; none forced a fast-path edit.
- **New dispatch** `prompts/dispatch/SUPPLEMENTAL_SCAN.md` (thin-pointer pattern) + recurring `kit-vigilance-supplemental-scan` Cowork task (Sat 08:00 local). This cadence *must* be Cowork — cloud routines can't reach the blocked sources.
- **WATCHLIST Tier-2 corrections** (empirical from the scan): Reddit unreachable even via WebSearch → marked manual-only; `platform.claude.com/docs` returns real content to WebSearch → confirmed Cat-8 Tier-2; **GitHub Advisory DB** (`github.com/advisories?query=mcp`) added to Cat 7 — reachable under the cloud allowlist, closing the MCP-CVE blind-spot at the routine level.
- **KIT-VIGILANCE.md** § hybrid model: operational-status note + dispatch/schedule references updated.

**Outstanding:** the monthly-integration cloud routine fired 2026-06-01 (14:04, completed) but **halted on a stale clone** — it reported an empty `vigilance/feed/weekly/` and dailies only through 2026-05-29, missing weekly-22 and the 5/30–6/01 dailies that are on `origin/main`. Non-urgent (monthly needs ≥4 weekly synths and only 1 exists, so it is dormant-by-design for ~3 more weeks), but the cloud-routine clone staleness should be diagnosed before enough weeklies accumulate. The routine's own "run weekly synthesis" recommendation is moot — weekly-22 already exists on main.

---

## [0.15.0] — 2026-05-29

### Added — KB-07 Brand Naming (optional domain pack: doctrine + 6 skills + conditional generator wiring)

Integrated a self-contained brand/product **naming** capability as the kit's second optional domain pack (the first being KB-03's catalog-pipeline patterns). Like KB-03, it is *conditional* — the generator reads and installs it only when a project has a naming/branding deliverable, so app-code projects that don't need it carry zero extra surface area.

#### 1. Doctrine — `knowledge-base/KB-07-BRAND-NAMING.md`

- Evidence base covering generation strategy, linguistic/phonetic science, a reusable cross-language screening protocol (incl. non-Latin: Cyrillic/Armenian/CJK/Arabic), trademark clearance (Abercrombie spectrum + DuPont/Sleekcraft + Nice classes + Madrid + genericide), digital-availability gating (RDAP/handles/SERP/AEO-GEO), a tunable 100-point scoring rubric, validation methods, and a VERIFIED-vs-APOCRYPHAL cautionary-case file (Pajero/Fitta/Vicks/Bensi verified; Chevy Nova debunked).
- Self-provenancing: §13 verbatim-quote appendix + §14 methodology/limitations stand in for a separate `research/` dossier. Carries fast-moving figures (USPTO 2025 fee restructure; Madrid §66(a) $500→$600; .ai → $160/2yr Mar 5 2026) — flagged for quarterly re-verification per the per-§ tags.

#### 2. Skills — `templates/skills/naming/<name>/SKILL.md` (6, modern directory format)

- `naming-brief` → `name-generation` → `linguistic-screen` → `trademark-clearance` → `availability-gate` → `name-scorecard`. Authored in the KB-05 decision-skill house style (frontmatter with severity/confidence/surface; Procedure / Anti-patterns / Gotchas / When-NOT-to-use / References). Two hard human-in-the-loop gates encoded: attorney opinion before filing, native-speaker verification for non-Latin slang. Two §1 guardrails encoded across the pack: the exact `.com` is never a hard gate, and the selection criterion is "is it right?" not "do I like it?".

#### 3. Generator wiring — `generator/PROJECT_SETUP_PROMPT.md`

- Phase 0 conditional read (item 9, gated like KB-03); Phase 1.5 naming/branding-need detection signal; Phase 3.1 conditional install block for the 6 skills (+ `.cursor` mirror per the multi-IDE sync mandate); Phase 3.4 skill-tree convention row; new Phase 3.7 naming-skill router rule injection (`.claude/rules/naming-skills.md`) documenting pipeline order, the phrase-mapping router, the human-in-the-loop gates, and surface fit.

#### Numbering note

- Brand-naming deliberately took **KB-07**, not KB-06: the 0.14.2 changelog + the 5/24–5/29 daily-pulse feed had earmarked `KB-06-MANAGED-AGENTS.md` for the queued Claude Managed Agents integration (monthly cadence, June 1). KB-06 is left reserved for that doc.

### Verified

- All 6 skill frontmatter blocks parse (name matches directory; severity/confidence/surface present).
- Generator install-table paths resolve to the actual `templates/skills/naming/*/SKILL.md` files.
- Zero `KB-06` references remain in the brand-naming doc, skills, or generator after the renumber; the Managed-Agents `KB-06` references in this changelog + the vigilance feed are deliberately untouched.
- Multidomain-clean: world-facts only (fees/prices/cases), no project-specific names — pack is safe in the main kit per the multidomain discipline.

### Why this matters

The kit can now bootstrap a rigorous, tool-gated naming pipeline for any branding project from day one — while staying invisible to the projects that don't need it. It also proves the "optional domain pack" pattern (KB doc + skill family + conditional generator gate) generalizes beyond KB-03's catalog pipeline.

---

## [0.14.2] — 2026-05-28

### Fixed — MCP security cluster + 3 vigilance operational issues caught by 5/28 daily-pulse

The vigilance discipline's 5/28 daily-pulse fired its first 🚨 BLOCKER (MCP servers registry security cluster — 4 commits 5/05-5/16 in `modelcontextprotocol/servers` addressing auth bypass + DoS + command injection + XXE). Diagnostic also surfaced 3 vigilance-operational issues: missing 5/27 digest file, stale `/simplify` false-positive flag, Tier-2 fallback non-functional on cloud routines. All four addressed in this patch via the kit's own fast-path discipline.

#### 1. MCP Server Registry security + version pin policy enforcement

Live npm-registry checks performed 2026-05-28 surfaced two issues beyond the upstream security cluster:

- **`@modelcontextprotocol/server-github` is DEPRECATED by Anthropic.** npm registry returns `"deprecated":"Package no longer supported"`. Latest version frozen at `2025.4.8` (April 2025); did not receive May 2026 security patches. Kit had recommended this as "legacy npm fallback" — now flagged as DO-NOT-USE with strong migration guidance to the remote HTTP endpoint (`https://api.githubcopilot.com/mcp/`).
- **Version pins missing on multiple recommended packages** in violation of the kit's own policy. Fixed:
  - `@upstash/context7-mcp` → now pinned to `@3.0.0` (live-verified latest 2026-05-28)
  - `@modelcontextprotocol/server-filesystem` → now pinned to `@2026.1.14` (live-verified latest 2026-05-28; note: predates May 2026 security cluster, operators should `npm audit` transitive deps)

Added to `knowledge-base/MCP-SERVER-REGISTRY.md`:
- "Last verified 2026-05-28" header at top
- New "⚠ May 2026 security cluster (operator action required)" section with 3-step operator action checklist (npm audit, version-pin verification, repin unpinned packages)

#### 2. Restored deleted 5/27 daily digest

Commit `850869b` originally added `vigilance/feed/daily/2026-05-27.md` (69 lines, 14 findings, 0 🚨 + 3 ⚠ + 11 🟡). Some later commit deleted the file. Restored from git blob `885bd28` — historical record preserved.

#### 3. Defused `/simplify` grep false-positive

The 5/28 routine flagged `workflows/WORKFLOW-CLAUDE-CODE.md:262` as still naming `/simplify` — but the string was in the rename-context explanation ("renamed from `/simplify`"), not as a recommendation. Naive grep can't distinguish. Fixed by changing the explanatory phrasing to `"renamed from the prior \`simplify\` command"` (no leading slash) — same meaning, won't trigger future routine grep flags. Applied to both `workflows/WORKFLOW-CLAUDE-CODE.md:262` and `generator/VALIDATION_CHECKLIST.md:171`.

#### 4. Cloud routine network limitation documented + hybrid model proposed

Empirical finding from 5/27 + 5/28 routine output: Claude Code Routines cloud runtime has a **restrictive network egress allowlist** (`github.com`, `api.github.com`, `npmjs.com`, `registry.npmjs.org`; sometimes `docs.claude.com`). 22 of 35 watchlist sources permanently blocked at the routine level. Tier-2 WebSearch fallback documented in `vigilance/WATCHLIST.md` does NOT work — WebSearch subject to same egress allowlist on cloud routines.

Architectural response: **hybrid model**. New `workflows/KIT-VIGILANCE.md` § "Cloud routine network limitations" documents:
- Cloud routines (daily 08:00) scan the 13 reachable sources (GitHub release/commit atoms + npm new-package). Always-on, laptop-independent. Highest-signal-per-fetch.
- Periodic Cowork desktop session (operator-triggered weekly, suggested Saturday) supplements the 22 cloud-unreachable sources via Cowork desktop's full network access.
- Weekly synthesis reads both daily files + supplemental files when present; dwell-gating logic intact across both paths.
- Why not migrate back to Cowork desktop tasks entirely (undo v0.12.0): the 13 reachable cloud-routine sources are exactly the highest-signal category; losing always-on coverage of framework releases + security advisories degrades discipline more than losing 22 lower-signal sources daily.
- Quarterly audit task: re-test cloud routines network reachability — Anthropic may widen the allowlist.

### Verified

- Five files modified (MCP-SERVER-REGISTRY.md, WORKFLOW-CLAUDE-CODE.md, VALIDATION_CHECKLIST.md, KIT-VIGILANCE.md, CHANGELOG.md) + one file restored (vigilance/feed/daily/2026-05-27.md)
- Live npm-registry checks performed against 4 packages via WebFetch — versions cited are post-verification not from memory
- Cloud routine network policy documented with empirical evidence (two consecutive daily-pulse runs' source-health sections)
- Discipline's fast-path-vs-cadence boundary respected: BLOCKER + stale-reference-fix + missing-file-restore + architectural-constraint-documentation all qualify for fast-path; new features like KB-06-MANAGED-AGENTS still queued for monthly integration cadence (June 1) per doctrine

### Why this matters

This is the **first patch driven by the vigilance discipline's own live signal**. v0.13.x `/simplify` fast-path came from operator inspection of accumulated daily digests; v0.14.1 Cowork 1M context came from operator visual catch of stale claim. v0.14.2 came from the routine's own 5/28 output flagging the BLOCKER. The cadence is now actually producing actionable kit improvements — exactly the loop the discipline was designed to close.

---

## [0.14.1] — 2026-05-27

### Fixed — Stale Cowork context-window claims (1M on Opus 4.7 + Max+ tier)

The kit's surface-routing knowledge (compiled 2026-04-21) stated Cowork "inherits Desktop 200K/500K ceiling." Live evidence from operator's Cowork session (2026-05-27, `claude-opus-4-7[1m]` model variant showing 580K/1M usage in Context Usage panel) confirms Anthropic shipped 1M context to Cowork on Opus 4.7 + Max+ tier sometime after the dossier was compiled. Classic silent-staleness drift — operator caught it visually before the vigilance cadence's first weekly synthesis (scheduled 2026-05-31) had a chance to surface it.

Fixed:

- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` row 9 (capability matrix — Cowork now ✓ 1M with live-evidence citation)
- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` anti-pattern #10 (rewritten to clarify Cowork has 1M, Chat UI parity unverified)
- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` Quote 4 annotation (200K base claim retained for citation but flagged as overridden for Cowork)
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` §4.1 surface routing table (synthesis can now run on Cowork too, Code still default for repo-aware work)
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` anti-pattern (≥200K synthesis caveat clarified — Chat-specific, not Cowork)

KB-01 §5 mention of "Claude Code 200K token context window" retained as-is — it correctly applies to non-Max non-Opus-4.6/4.7 model+tier combinations.

### Verified

Same fast-path pattern as v0.14.0's `/simplify` → `/code-review` fix: stale reference caught by operator, evidence in hand, immediate patch rather than waiting for vigilance cadence.

### Re-verification trigger queued

Anthropic likely updated other documentation that the watchlist's vendor-channel and Anthropic-specific categories will catch on next daily-pulse / weekly-synthesis run. If multiple 1M-context references appear across the corpus, that's strong signal Anthropic is documenting the shift more broadly — flag for the kit-wide context-window refresh at next quarterly audit (2026-09-01).

---

## [0.14.0] — 2026-05-27

### Changed — Generator pipeline wired for v0.10–v0.13 capabilities (closes 44 gaps from diagnostic audit)

The kit shipped ~6 major capability layers across v0.10–v0.13 (KB-04 Decision Engineering, KB-05 Conversational Decision Engineering, Vigilance Discipline, Claude Code Routines migration, Surface Routing Integration Prompt, Mission-Dispatch Pattern). The generator pipeline (`generator/PROJECT_SETUP_PROMPT.md`) was still operating on v0.8.0 surface area — referencing partial subsets of two layers and installing zero of the new artifacts. The kit's "drop into any project" promise was structurally false for everything we shipped in v0.10–v0.13. v0.14.0 closes the gap end-to-end via three coherent commits ahead of this release entry, all under a single banner.

A 44-gap diagnostic audit (10 categories: A–J, severity-tagged 🚨/⚠/🟡/🟢) drove the work. Eight 🚨 BLOCKERs clustered around three root causes: (1) decision skills shipped as a folder but never wired into Phase 3, (2) QUICK_START.md never updated past v0.8.0, (3) vigilance discipline shipped as workflow doc but generator didn't know it existed. All eight BLOCKERs + 22 HIGH + 13 MEDIUM + 1 LOW finding closed in this release.

#### Commit 1 — Phase 3 wiring

`generator/PROJECT_SETUP_PROMPT.md` Phase 3 file-generation table grew from 28 rows to **47 rows** with new sections:

- **KB-05 decision skills (12)** with per-tier install conditions (5 BLOCKER always; 3 HIGH Intermediate+; 3 MEDIUM Advanced; council-3-voice Advanced + plan-tier ≥ Max). Each skill lands at `.claude/skills/decision/<name>/SKILL.md` + Cursor mirror at `.cursor/skills/decision/<name>/SKILL.md` per multi-IDE sync mandate.
- **KB-04 research-engineering skills (2)** — `research-prompt-writer` + `research-synthesizer` — Intermediate+.
- **KB-04 orchestration + research rules (2)** — `orchestrator-dispatch.md` + `research.md` — Intermediate+ + Cursor `.mdc` mirrors.
- **ARCHITECT_PROMPT template** — `docs/prompts/ARCHITECT_PROMPT.template.md` — Intermediate+ — the 14-section IMPL prompt template projects use for major implementation phases.

Plus three new sub-sections in Phase 3:

- **Phase 3.4 Multi-IDE skill installation path conventions** documents the three template-tree naming conventions (legacy flat `.SKILL.md.template` vs modern `<name>/SKILL.md` vs per-IDE rules) + the per-asset-class destination map + the multi-IDE sync mandate.
- **Phase 3.5 Decision-skill router rule injection (mandatory when any KB-05 skill is installed)** generates `.claude/rules/decision-skills.md` documenting: the anti-sycophancy-meta auto-fire on ownership signals, the phrase-mapping router with tier-conditional rendering, the council cost gate (15× tokens) when council is installed, and per-skill surface fit declarations.
- **Phase 3.6 Quality gates** updated to include decision-skill frontmatter validation + router-rule completeness.

Closes: A1, A2, A3, A4, A5, A6 (Category A), C5, C6 (Category C), D2, D3, D4, D5, D8, D9, D10 (Category D), F1, F2, F3 (Category F), H1, H2, H3, H4 (Category H).

#### Commit 2 — New pipeline phases + Phase 0.1 expansion

Generator gains four new phases:

- **Phase 1.6 Maturity-tier classification** (Starter / Intermediate / Advanced) with decidable signals per tier + tie-break rule (default to Intermediate when ambiguous). Drives every subsequent install decision.
- **Phase 4.5 Per-project surface routing integration** (Intermediate+ only) — instructs the generator to output a Cowork-handoff block the operator pastes into a fresh Cowork session to install `.claude/rules/ai-workflow.md` + `.cursor/rules/ai-workflow.mdc` via the kit's `CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md` dispatcher.
- **Phase 7 Vigilance discipline bootstrap** (Advanced only, opt-in) — offers the 3-cadence self-improvement discipline; if accepted, installs the doctrine + project-specific WATCHLIST + 3 dispatch prompts + feed/state structure + .gitignore updates + 3-routine setup instructions for `claude.ai/code/scheduled` with explicit "Allow unrestricted git push + `git checkout main; do NOT create a feature branch`" Instructions (prevents the `claude/`-branch issue the kit's own setup encountered).
- **Phase 8 Mission-dispatch pattern setup** (Advanced only, opt-in) — installs `prompts/chat-research-missions.md` + sibling pattern files + `prompts/dispatch/` convention + `research/` directory with reference to kit's worked examples.

Phase 0.1 reading list expanded from 5 targets to **8 targets**: added `knowledge-base/CLAUDE-SURFACE-ROUTING.md` (always), `workflows/KIT-VIGILANCE.md` doctrine sections (always), `knowledge-base/KB-03-CATALOG-PIPELINE-ARCHITECTURE.md` (conditional on data-pipeline detection). Renumbered subsequent items.

Phase 9 (renumbered from Phase 7) Summary Report adds five new fields: maturity tier rationale, decision-skills installed, surface-routing integration status, vigilance-discipline status, mission-dispatch-pattern status.

Closes: B1, B2, B3, B4 (Category B), C1, C2, C3, C4 (Category C), D1, D6, D7 (Category D), G1, G2, G4 (Category G), I3, I4 (Category I), J1, J2 (Category J).

#### Commit 3 — Operator-facing documentation rewrite

- **`QUICK_START.md` full rewrite** (~150 lines) — reflects v0.13.0 surface area, three-tier install model, all v0.10–v0.13 capabilities (decision skills, vigilance, surface routing, mission-dispatch), maintenance cadence, upgrade flow. Replaces the v0.8.0-era "What You Get" table with per-tier install maps.
- **New `workflows/KIT-INSTALL-PIPELINE.md`** (332 lines) — operator-facing reference doc. 8 sections: full kit feature map (v0.8.0 → v0.14.0), tier selection guide with decidable signals + graduation triggers, 9-phase install flow walk-through, per-tier "what lands where" install trees, maintenance cadence (daily through on-Anthropic-release), upgrade flow for keeping target projects synced with upstream kit, 8 common pitfalls operators hit, cross-references.
- **`generator/VALIDATION_CHECKLIST.md` upgrade** — 5 new sections (12–16) covering: Decision Skills Installation (KB-05), KB-04 Decision Engineering Installation, Surface Routing Integration, Vigilance Discipline, Mission-Dispatch Pattern. Total checks roughly doubled from v0.13.0 to v0.14.0.

Closes: E1, E2, E3, E4, E5, E6 (Category E), I1, I2 (Category I), D11 (Category D).

### Verified

- All 44 audit findings (8 BLOCKER + 22 HIGH + 13 MEDIUM + 1 LOW) closed
- Generator now installs full kit surface area (v0.8.0 baseline through v0.13.0 KB-05 skills) on a maturity-tier-appropriate basis
- Multi-IDE sync mandate documented in Phase 3.4 + propagated to checklist Section 12-13
- Operator can plan an install before invoking it (via KIT-INSTALL-PIPELINE.md), invoke it (via QUICK_START.md), and verify it (via VALIDATION_CHECKLIST.md)
- "Drop into any project" promise now structurally true for the full kit, not just v0.8.0 baseline

### Why this matters

Without v0.14.0, every kit feature shipped in v0.10–v0.13 (decision engineering, vigilance, surface routing, mission-dispatch) was infrastructure that **only the kit's own repo benefited from** — every other project using the kit got the v0.8.0 capabilities. v0.14.0 makes the kit's last 4 versions' worth of discipline actually transferable. The operator drops the kit into a new project once and gets the full discipline, tier-appropriate, idempotent, validatable.

---

## [0.13.0] — 2026-05-27

### Added — KB-05 Conversational Decision Engineering

KB-05 is the conversational-scale sibling to KB-04 (project-scale decision engineering). When a user asks "is this a good idea?" in a single turn, default LLM behavior is sycophantic validation — Stanford's SycEval measured **58.19% baseline sycophancy** across frontier models (Mar 2025); Cheng et al.'s ELEPHANT showed LLMs preserve user's face **45 percentage points more than humans** in advice queries (May 2025); Anthropic's own Petri pilot applied 14 frontier models to 111 seed instructions and elicited sycophancy across **every model tested** (Oct 2025). v0.13.0 ships the operational discipline that closes this gap at the prompt-engineering layer (vendor-side RLAIF improvements like Claude 4.5's 70-85% reductions are treated as bonuses, not foundations).

**Source dossier (canonical evidence base):**
- `research/2026-05-26-decision-techniques.md` (~315 lines) — Chat Research output from the mission dispatched in v0.10.0's `prompts/dispatch/DECISION_TECHNIQUES_RESEARCH_2026.md`. 14 verbatim quotes from primary sources (Klein HBR 2007, Kahneman *Thinking Fast and Slow* 2011, Bezos 1997 Amazon letter, Anthropic Engineering Jun/Dec 2025, SycEval/ELEPHANT/Petri benchmarks, multi-agent debate papers arXiv 2305.14325 / 2406.11776 / 2502.08788 / 2512.22245, Anthropic Skills `skill-creator/SKILL.md` description-as-trigger convention). Passed all 8 anti-hallucination gates + all 14 success criteria from the mission spec. Explicit counter-evidence surfaced (arXiv 2502.08788 cited against the Anthropic 90.2% multi-agent uplift claim, confidence dropped to 0.55) — the discipline doing what it should.

**New knowledge-base doc:** `knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` (502 lines, 18 numbered sections). Covers: executive distillation; why-this-exists; scope/non-goals; the 12-skill catalog overview; anti-sycophancy as meta-skill (fires first); the hybrid router (phrase-mapping + LLM fallback); council reference architecture (3-voice sparse topology, ≤500-token JSON per subagent, 15× token cost gate); 4 anti-sycophancy patterns; domain adaptation pattern; domain scenario walk-throughs; 8 failure modes with mitigations; per-skill surface routing; maturity gradient (Starter = 5 BLOCKER / Intermediate = +4 HIGH / Advanced = +3 MEDIUM + council); anti-patterns; composition with KB-01/02/04 + CLAUDE-SURFACE-ROUTING; what NOT covered; re-verification schedule; common questions; cross-references.

**12 new decision skills** under `templates/skills/decision/<name>/SKILL.md`:

| # | Skill | Severity | Confidence | Surface | Lines |
|---|---|---|---|---|---|
| 1 | `pre-mortem/` | BLOCKER | 0.95 | Chat-or-Code | 98 |
| 2 | `inversion/` | HIGH | 0.85 | Chat-or-Code | 94 |
| 3 | `10-10-10/` | MEDIUM | 0.65 | Chat | 89 |
| 4 | `second-order-thinking/` | HIGH | 0.70 | Chat-or-Code | 111 |
| 5 | `steelman/` | BLOCKER | 0.85 | Chat-or-Code | 107 |
| 6 | `disconfirming-evidence-first/` | HIGH | 0.80 | Chat | 108 |
| 7 | `confidence-calibration/` | BLOCKER | 0.90 | Chat-or-Code | 97 |
| 8 | `reversibility-check/` | BLOCKER | 0.85 | Chat-or-Code | 102 |
| 9 | `cost-of-inaction/` | MEDIUM | 0.55 | Chat | 99 |
| 10 | `bayesian-update/` | MEDIUM | 0.55 | Chat | 117 |
| 11 | `council-3-voice/` | BLOCKER | 0.90 | Cowork-or-Code | 286 |
| 12 | `anti-sycophancy-meta/` | BLOCKER | 0.95 | All | 147 |

Total: ~1,555 lines of new skill content. Each SKILL.md follows the kit's KB-02 §3 format (frontmatter + Trigger + What-it-produces + Mandatory-reads + Procedure + Output-format + Anti-patterns + Gotchas + When-NOT-to-use + References). Frontmatter descriptions are "pushy" per Anthropic Skills `skill-creator/SKILL.md` convention. Procedure steps verbatim from dossier §2 catalog. Verbatim source quotes (Klein, Kahneman, Bezos, Anthropic engineering, arXiv papers) embedded where load-bearing.

**Council orchestration** (skill #11) wraps the Claude Agent SDK / Task tool fan-out inside the SKILL.md body — no KB-02 §3 format extension required. The skill specifies the 3-voice topology (Optimist / Pessimist / Synthesizer), the decidable invocation rule (≥3 mutually-exclusive options OR Type-1 reversibility OR impact > stakes threshold), the ≤500-token JSON subagent budget, and the LLM-as-judge synthesis with **mandatory dissent field** (per arXiv 2512.22245's note that "LLM judges are known to be overconfident"). The reversibility-check skill is the gating skill that fires before council.

**Anti-sycophancy-meta** (skill #12) auto-fires on ownership signals ("what do you think of my X" / "is my idea good"). It re-frames as pressure-test BEFORE evaluation, then routes to pre-mortem / steelman / disconfirming-evidence-first based on artifact type. Has an explicit emotional-support opt-out (ownership-signal absent + hedging language present + "feeling/stuck/frustrated" terms = skip pressure-test).

**Cross-references wired:**
- `CLAUDE.md` — repo-structure tree + Key Files matrix include KB-05
- `README.md` — repo tree + new "KB-05: Conversational Decision Engineering" section under KB Coverage
- `generator/PROJECT_SETUP_PROMPT.md` — Phase 0.1 reading list includes KB-05 (read for virtually every project, with explicit Phase 3 install rules: 5 BLOCKER skills by default, HIGH/MEDIUM added by maturity)
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` §15 ("What this KB does NOT cover") — pointer updated from "research mission lives at..." to "KB-05 is the sibling discipline at..."
- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — surface fit per skill declared in SKILL.md frontmatter (not in routing rubric itself; routing rubric stays stable)

**Mission contract closed:** the `prompts/dispatch/DECISION_TECHNIQUES_RESEARCH_2026.md` mission dispatched in v0.10.0 is now complete; the dossier landed and integrated. Re-verification cadence: quarterly default (next: 2026-09-01) + event-triggered (new Anthropic system card; LangGraph 2.x; SycEval/ELEPHANT v3+; Microsoft Agent Framework GA).

### Verified

- KB-05 + 12 SKILL.md files + cross-references pass project-token grep (zero forbidden tokens)
- All 12 SKILL.md frontmatter `name` fields match directory slugs (kebab-case)
- Severity/confidence values in CHANGELOG table match dossier §2 catalog exactly
- KB-04 §15 pointer correctly references KB-05 as sibling (not as orphan mission)
- generator/PROJECT_SETUP_PROMPT.md Phase 0.1 ordering preserved (KB-05 read before conditional KB-04)

---

## [0.12.0] — 2026-05-25

### Changed — Vigilance scheduling primitive migrated to Claude Code Routines

v0.11.0 shipped the vigilance discipline using Cowork desktop scheduled tasks. Those run locally on the operator's machine, require Claude Desktop running + system awake, and have known fragilities (machine sleep delays runs to catch-up time; push auth must be solved locally). Anthropic shipped **Claude Code Routines** (GA April 14, 2026) — cloud-hosted scheduled tasks that run on Anthropic-managed infrastructure regardless of hardware state. v0.12.0 makes Routines the primary scheduling primitive for the kit's vigilance cadence and keeps Cowork as a documented local fallback.

**Why Routines is strictly better for this use case:**

- **Laptop-independent.** Closed lid, dead battery, on a flight, on vacation — routine fires.
- **Repo-native.** Each run clones the repo fresh, commits results back via routine git auth — no auth prompts, no failed pushes accumulating in local-only commits.
- **Plan-tier eligibility wide.** Pro (5 runs/day), Max (15/day), Team/Enterprise (25/day). Our usage averages ~1.2 runs/day across the three cadences — well within Pro headroom.
- **Native cadence semantics.** Hourly minimum interval (matches our daily/weekly/monthly cadence cleanly).

**Changes shipped:**

- `prompts/dispatch/DAILY_PULSE_SCAN.md` (174 lines, header rewritten): primary surface = Claude Code Routine, local fallback = Cowork. All `~/Projects/AI/` absolute paths converted to repo-relative paths so the prompt works in both contexts (Routines clones the repo and runs from repo root; Cowork wrapper cds to `~/Projects/AI/`).
- `prompts/dispatch/WEEKLY_SYNTHESIS.md` (171 lines, same conversions).
- `prompts/dispatch/MONTHLY_INTEGRATION.md` (~212 lines, same conversions plus the Surface section restructured to "Primary surface / Local fallback surface").
- `workflows/KIT-VIGILANCE.md` (480 lines): executive distillation rewritten to lead with Routines; new `§ Cowork local fallback` section documents the trade-offs and when to use the fallback.
- Cross-reference footer updates throughout the doctrine.

**Cowork scheduled tasks set up in v0.11.0 are now disabled** via `mcp__scheduled-tasks__update_scheduled_task` with `enabled: false`. They remain in the Cowork Schedule sidebar for archival purposes (and as a quick re-enable target if Routines ever becomes unavailable) but won't fire.

### Operator setup (one-time, ~10 min)

The kit ships the dispatch prompts and the doctrine; the operator sets up the three Routines manually via `claude.ai/code/scheduled`. The setup is identical for all three (different schedule, different prompt, same repo + environment):

For each of the three routines below: open `claude.ai/code/scheduled` → click **New scheduled task** → fill the form.

**Routine 1 — kit-vigilance-daily-pulse**
- Name: `Kit Vigilance Daily Pulse`
- Repo: the kit repo (e.g. `directiveforge/directiveforge` for this canonical instance)
- Environment: Default (or custom if the kit's MCP connectors need preset env vars)
- Schedule: Daily at 08:00 local time
- Prompt: `Read prompts/dispatch/DAILY_PULSE_SCAN.md and execute it. The prompt is self-contained — follow it step by step. Write the digest to vigilance/feed/daily/YYYY-MM-DD.md and commit to main. Output a 5-10 line summary.`
- Branch permissions: enable "Allow unrestricted branch pushes" (the discipline writes to `vigilance/feed/` which is isolated from regular development; direct-to-main is fine)
- Connectors: include WebSearch + any RSS/HTTP fetch connectors the watchlist sources need

**Routine 2 — kit-vigilance-weekly-synthesis**
- Schedule: Weekly on Sunday at 09:00 local time
- Prompt: `Read prompts/dispatch/WEEKLY_SYNTHESIS.md and execute it. Read the past 7 daily digests from vigilance/feed/daily/. Write the synthesis to vigilance/feed/weekly/YYYY-WW.md and commit. Output a 5-line summary.`
- Same repo + environment + branch permissions as Routine 1

**Routine 3 — kit-vigilance-monthly-integration**
- Schedule: Monthly on day 1 at 10:00 local time (use the closest preset + `/schedule update` to set `0 10 1 * *` cron if needed)
- Prompt: `Read prompts/dispatch/MONTHLY_INTEGRATION.md and execute it. Read the past 4 weekly synthesis files. Produce up to 5 14-section architect prompts per KB-04 §5 / templates/shared/ARCHITECT_PROMPT.md.template. Write the manifest to vigilance/feed/monthly/YYYY-MM.md and commit. Output a 10-line summary listing the architect prompts produced.`
- Same repo + environment + branch permissions

After all three are created, click "Run now" on the Daily Pulse routine once to verify the setup. The first run may need to approve connector access prompts; once approved, future runs are autonomous.

### Verified

- Dispatch prompts use repo-relative or home-relative (`~/Projects/AI/`) paths — no machine-absolute `/Users/...` paths. Repo-relative paths work for both Routine cwd (cloned repo root) and Cowork fallback cwd (`~/Projects/AI/`). [Correction, v0.20.0 W5: the original entry claimed home-relative paths were fully removed too ("grep returns 0") — that was false as shipped; home-relative references remain by design and are username-free.]
- Doctrine + dispatch prompts cross-references intact.
- Cowork tasks disabled via API; no double-fire when Routines is set up.

---

## [0.11.0] — 2026-05-25

### Added — Kit Vigilance Discipline (continuous improvement loop)

The kit's most insidious failure mode is silent staleness — KBs written months ago that read fluently but recommend outdated patterns. v0.11.0 ships the discipline that catches drift early, with a three-cadence feedback loop that compounds rather than degrades. The discipline eats its own dogfood: it applies KB-04 decision engineering to the kit's own updates.

**New doctrine doc:** `workflows/KIT-VIGILANCE.md` (470 lines). Covers:
- The 3-cadence architecture (Daily Pulse / Weekly Synthesis / Monthly Integration).
- Source taxonomy across 8 categories (vendor channels / framework releases / research / community / practitioner blogs / skill marketplaces / MCP ecosystem / Anthropic-specific).
- Source selection criteria (primary-or-near-primary, high signal-to-noise, diversity contribution, fetchable, active).
- The scan logic (delta detection per source, severity tagging, kit-compose check, action recommendation).
- 7 degradation modes the discipline explicitly fences against (trend chasing, noise contamination, echo chambers, scope creep, conflicting integrations, source bias, stale watchlist).
- Quarterly watchlist audit protocol with template.
- Success metrics + 7 anti-patterns.
- The self-referencing pattern (Monthly Integration produces KB-04 §5 architect prompts → Code session updates the kit per KB-04 §2 discipline).

**New curated watchlist:** `vigilance/WATCHLIST.md` (260 lines, 32 active sources across 8 categories). RSS feeds preferred where available; scrape fallback documented. Severity-default-per-category locked. Quarterly audit checklist template included.

**Three runnable dispatch prompts under `prompts/dispatch/`:**
- `DAILY_PULSE_SCAN.md` (174 lines) — daily 8:00 local Cowork scheduled task. Reads watchlist, scans 32 sources, delta-detects via `vigilance/state/<slug>.json`, severity-tags conservatively, runs kit-compose check on every ⚠+ item, writes digest to `vigilance/feed/daily/YYYY-MM-DD.md`, commits locally with best-effort push.
- `WEEKLY_SYNTHESIS.md` (170 lines) — Sunday 9:00 local Cowork scheduled task. Reads past 7 daily digests, clusters by theme, applies dwell-time gate (≥2 days OR ≥2 source categories), source-diversity check, kit-compose check at theme level, ranks by severity × dwell × diversity, caps at 5 action candidates, writes synth to `vigilance/feed/weekly/YYYY-WW.md`.
- `MONTHLY_INTEGRATION.md` (~210 lines) — 1st of month 10:00 local. Reads past 4 weekly synths, applies stricter cross-week dwell gate (≥2 weeks), cross-DECISIONS reconciliation per candidate, cross-orchestrator boundary check, instantiates 14-section architect prompts (per KB-04 §5 + templates/shared/ARCHITECT_PROMPT.md.template) for top-5 integration candidates, bundles into `vigilance/feed/monthly/YYYY-MM.md` manifest. The user reviews the manifest and dispatches selected architect prompts through Code sessions which then execute actual kit updates.

**Feed archive structure:**
- `vigilance/feed/daily/`, `weekly/`, `monthly/`, `quarterly/` (each with `.gitkeep`)
- `vigilance/state/` — gitignored per-source delta state
- `vigilance/feed/README.md` (75 lines) — explains the archive, what's tracked vs. gitignored, cadence stack composition, file ownership conventions

**Scheduled tasks registered (Cowork):**
- `kit-vigilance-daily-pulse` — `0 8 * * *` (every day 08:00 local)
- `kit-vigilance-weekly-synthesis` — `0 9 * * 0` (Sundays 09:00 local)
- `kit-vigilance-monthly-integration` — `0 10 1 * *` (1st of month 10:00 local)

Each scheduled-task prompt is a short pointer that instructs Cowork to read the canonical dispatch file at `~/Projects/AI/prompts/dispatch/<NAME>.md` and execute it. The dispatch files are the source of truth for the scan logic; the scheduled-task prompts are thin wrappers. This way, edits to scan logic land via normal commits, not via the scheduled-task UI.

**Hygiene:**
- `.gitignore` updated to exclude `vigilance/state/` (per-source delta state files; recreated on first scan if absent).
- `CHANGELOG` entry [0.11.0] documents the discipline + every artifact + the rationale.

### Verified

- Doctrine + watchlist + 3 dispatch prompts + feed README all pass the project-token grep. Zero forbidden tokens; voice consistent with the kit's existing patterns.
- KB-04 cross-references intact (the discipline is the kit's own application of KB-04 §5 and §2).
- CLAUDE-SURFACE-ROUTING.md surface assignments respected (scheduled tasks on Cowork; integration architect prompts dispatch to Code).

### Why this ships now

Without active maintenance, the kit's per-month quality degrades as the underlying ecosystem evolves. v0.11.0 closes that loop. The 32 sources on the watchlist were chosen to span the 8 categories that the kit's primary integration target (Claude + agentic ecosystem) actually moves through. The discipline is opinionated about what NOT to chase (single-source community claims, transient hype, off-stack tooling) which is what prevents it from collapsing into a junk drawer over time.

---

## [0.10.0] — 2026-05-24

### Added — KB-04 Decision Engineering

The kit's biggest missing pillar. KB-01 covers techniques, KB-02 architecture, KB-03 data pipelines — but until now there was zero codified discipline for how an agentic project structures, defends, locks, and reverses non-trivial decisions. Default LLM behavior is to validate; without explicit decision engineering, agentic projects accrete weak decisions that survive into production. KB-04 closes the gap.

**New knowledge-base doc:** `knowledge-base/KB-04-DECISION-ENGINEERING.md` (687 lines). Four pillars:

1. **Decision-Lock Discipline (`DECISIONS.md`)** — canonical project ledger with TL;DR + Master Synthesis 400w + Full Body + Reversal Triggers + Re-Verification Schedule + Cross-DECISIONS Reconciliation. Numbering protocol (`grep`-then-+1; never silent mutation). When to lock + when to reverse. 6 anti-patterns.

2. **The 3-Layer Research Architecture** — Layer 1 (8-gate per-dossier input filter: Source / Version / Stack-fit / Cost / Implementation / Cross-reference / Existing-knowledge / Quote-extraction) feeds Layer 2 (8 cross-dossier analytical protocols: Intake / Contradiction Finder / Citation Chain / Gap Scanner / Methodology Audit / Master Synthesis 400w / Assumption Catalogue / "So What" TL;DR) which feeds Layer 3 (forward decision construction: twin-view ranked matrix + 4 sensitivity weight regimes + 2 scale shocks + staged roadmap + Phase 3 user elicitation + architect-prompt skeleton + re-verification schedule). Layer 2 always feeds Layer 3; neither replaces the other.

3. **Orchestrator Dispatch Mechanics** — surface routing per phase (research dispatch → Chat Research; final synthesis → Code with 1M context; Phase 3 lock → Code; cross-app audits → Cowork). Wave-based RAG refresh via Law #4 (Deferred Dependencies): build dependency DAG, parallel-where-independent, refresh Project Knowledge between waves. Sub-agent Opus directive for decision-grade synthesis (not default Haiku). Synthesis-prompt quality bar (8 components). DECISIONS.md numbering verification (`grep`-then-+1).

4. **The 14-Section IMPL Architect Prompt** — when a locked DECISIONS entry triggers multi-step implementation work that needs external validation or stage-gated activation. Identity / Mission / Ground rules / Knowledge manifest (hard cap on file count) / Severity-tagged research questions / 8-Gate Framework / Domain scenarios (stress-test) / Deliverable format (hard ceilings) / Quote library / Cross-reference index / Uncertainty log / "What I don't know" prompt-back / Out of scope / Success criteria. Hard ceilings on every section.

**Universal Blocks A/B/C** (mandatory in every dossier): Block A — Context Envelope (project's binding constraints), Block B — Common Pitfalls (adversarial; 3-5 quantified examples with primary-source evidence), Block C — Freshness Log (claim × effective-date × verification-date × status).

**Maturity gradient** with graduation criteria: Starter (small team, lightweight `DECISIONS.md`), Intermediate (full entry structure + 8-gate Layer 1), Advanced (full 3-layer + orchestrator dispatch + architect prompts).

**Anti-patterns catalog** (18 entries spanning all four pillars).

**New companion templates:**

- `templates/shared/DECISIONS.md.template` (183 lines) — UPGRADED from the previous 45-line stub. Three maturity tiers in one file with selector guidance; Tier 3 includes a fully worked Advanced entry showing all six required sections.
- `templates/shared/ARCHITECT_PROMPT.md.template` (310 lines) — NEW. All 14 sections from KB-04 §5.2 with `{{PLACEHOLDER}}` slots, inline guidance comments, and per-section line budgets.
- `templates/claude-code/rules/orchestrator-dispatch.md.template` (86 lines) — NEW. Condensed auto-loaded rule covering surface routing per phase, wave DAG, sub-agent directive, synthesis quality bar, DECISIONS numbering, pre-dispatch checklist, anti-patterns.
- `templates/claude-code/rules/research.md.template` (83 lines) — NEW. Condensed auto-loaded rule covering 3-layer architecture, 8 gates, 9 propagating disciplines, 8 Layer 2 protocols, Layer 3 paragraph, Universal Blocks A/B/C, skill-invocation guidance.
- `templates/cursor/skills/research-prompt-writer.SKILL.md.template` (118 lines) — NEW. The Layer 1 skill (per-dossier-write-time). Works for both Cursor and Claude Code skill systems.
- `templates/cursor/skills/research-synthesizer.SKILL.md.template` (146 lines) — NEW. The Layer 2 + Layer 3 skill (synthesis-time). Wraps the 8 analytical protocols plus the forward construction pattern.

**Generator integration:** `generator/PROJECT_SETUP_PROMPT.md` Phase 0.1 now includes conditional KB-04 reading: skip for Starter-tier projects, read all five §-references for Intermediate-or-Advanced projects.

**Cross-references updated:** CLAUDE.md repo-structure table + "Key Files You Need to Know" matrix; README.md repo tree + "Knowledge Base Coverage" section.

### Verified

- KB-04 + all 6 companion templates passed the project-token grep (only intentional the private lab's worked instance (not shipped) cross-references remain, matching the v0.9.0 multidomain convention).
- KB-04 §12 paths corrected to match actual template locations (`templates/shared/` and `templates/cursor/skills/` per the kit's existing conventions, not the speculative `templates/decisions/` or `templates/skills/research/` paths from the initial draft).
- Generator phase 0.1 conditional reads documented (Starter projects skip; Intermediate/Advanced read all five KB-04 §-references).

---

## [0.9.0] — 2026-05-24

### Changed — Multidomain Discipline (project-agnostic kit)

The kit had drifted: real-project work (a client catalog project catalog pipeline, a retail brand e-commerce + brand work) had leaked specific project names, scale numbers, dashboard URLs, and stack-specific paths into the main kit surfaces. The kit's whole promise is "drop into any project," which the contamination defeated. This release pulls all project-specific content into an isolated `case-studies/` folder and rewrites the affected kit surfaces as project-agnostic templates.

- **New `case-studies/` folder**: holds project-specific worked examples that the kit references but does not embed. Two case studies bootstrapped: the private lab's worked instance (not shipped) (the source of KB-03's patterns) and the private lab's worked instance (not shipped) (the source of the prompts/ library patterns). New `case-studies/README.md` explains the convention.
- **`knowledge-base/KB-03-CATALOG-PIPELINE-ARCHITECTURE.md`** — genericized in place. a client catalog project name, scale numbers, source domains (an external source, an external source, Wikidata, Wikimedia Commons), automotive-specific layer names (make/model/generation/body_variant/trim) all removed. Patterns preserved intact: five-layer identity schema, source cascade, match cascade, single-pass scrape, deferred image pipeline, polymorphic media, migration via tuples, per-domain worker pools, HTTP cache, license posture, anti-patterns. Provenance line at top points readers to the case study.
- **`prompts/chat-research-missions.md`** — rewritten from scratch as a generic template (155 lines, 3 worked stack-agnostic example missions: technical stack upgrade watch, competitive positioning scan, regulatory/compliance refresh). Placeholder convention: `{{PROJECT_NAME}}`, `{{REPO_PATH}}`, `{{STACK}}`, etc.
- **`prompts/cowork-browser-operations.md`** — rewritten from scratch (103 dense lines, 4 worked templates: deploy + CWV audit, analytics funnel review, payments dashboard reconciliation, GitHub PR triage). Includes "how to write your own" section plus a compliance note covering regulated/audit-log/PII workloads that must NOT route through Cowork.
- **`prompts/code-handoff-prompts.md`** — rewritten from scratch (172 lines, 4 worked templates: locked-rule conformance pass, 1M-context monorepo audit, performance regression hunt, pre-release gate).
- **`prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md`** — rewritten as a short per-project integration prompt. The original was a 430-line monster that recreated the kit's surface-routing artifacts from a dossier; the new version (130 lines) just wires the kit's already-existing rubric, behavior spec, and three prompt libraries into a target project's `.claude/rules/ai-workflow.md`.
- **`workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md`** — P0-specific paths and competitor names replaced with placeholders and neutral examples.
- **`knowledge-base/CLAUDE-SURFACE-ROUTING.md`** — cross-reference footer cleaned. Now points to the private lab's worked instance (not shipped) for a worked example instead of embedding the project's rule path.
- **`knowledge-base/MCP-SERVER-REGISTRY.md`** — a multilingual product catalog attribution lines replaced with neutral "real-project MCP research dossier" phrasing.
- **`feedback/README.md`** — convention updated: feedback files that have been mined for generalizable patterns move to `case-studies/<project>/`. The `feedback/` directory now holds only current unprocessed feedback.
- **Moved into the private lab's worked instance (not shipped)**: `P0_BRAND_ORCHESTRATOR.md`, `P0_STONE_MARK_MASTER_DESIGN.md`, `PACKAGING_WORKER_FIRST_SESSION.md`, `MCP_ECOSYSTEM_DEEP_RESEARCH.md`, `feedback-2026-04-01-color-system.md`, plus the original P0-baked versions of `chat-research-missions.md`, `cowork-browser-operations.md`, `code-handoff-prompts.md`, `CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md`.
- **Moved into the private lab's worked instance (not shipped)**: `feedback-2026-05-01.md`.

### Verified
Grep across `knowledge-base/`, `workflows/`, `generator/`, `templates/`, `prompts/`, `feedback/`, and top-level docs returns zero hits for project tokens (a client catalog project, P0, a multilingual product catalog, an external source, Yerevan, etc.) except the explicit `case-studies/` pointers that are intentional cross-references.

---

## [0.8.0] — 2026-04-01

### Added — Production Agent Patterns (distilled from Claude Code architecture)
- KB-01 §5.8: Dynamic System Prompt Construction — pipeline architecture (static → tools →
  dynamic → memory → volatile), cache-optimized ordering, section registry pattern
  (memoized vs volatile), token budgets per layer, model-specific variations
- KB-02 §4.8: Production Agent Implementation Patterns — tool factory pattern, tool directory
  structure, rich tool context, query engine state machine (tool-call loop), file state cache,
  command system types (PromptCommand/LocalCommand/LocalJSXCommand), skill system architecture
- KB-02 §8.6: Agent Permission Architecture — 5-level permission spectrum
  (default/acceptEdits/plan/auto/bypass), wildcard rule patterns, tool-level permission flow,
  progressive trust model, denial tracking, permission audit patterns
- 2 new Cursor skill templates:
  - `templates/cursor/skills/debug.SKILL.md.template` — 4-phase structured debugging
    (reproduce → investigate → diagnose → fix)
  - `templates/cursor/skills/refactor.SKILL.md.template` — 3-lens parallel review
    (reuse, quality, efficiency)
- 2 new Claude Code command templates:
  - `templates/claude-code/commands/security-review.md.template` — vulnerability-focused
    branch review with scoped allowed-tools
  - `templates/claude-code/commands/tech-debt.md.template` — prioritized debt analysis
    (P0-P3 categorization)
- Generator: 4 new rows in Phase 3 file generation table, updated Phase 0.1 KB reading list

---

## [0.7.0] — 2026-03-30

### Added — UI/Design MCP Ecosystem
- MCP-SERVER-REGISTRY.md: 11 new UI/Design servers with full documentation:
  - **Figma Official MCP** (RW, 14 tools, Code Connect, write-to-canvas)
  - **Framelink MCP** (13.1K stars, token-efficient Figma reads)
  - **shadcn/ui MCP** (official, component registry + blocks)
  - **21st.dev Magic MCP** (4.4K stars, "v0 in your IDE")
  - **Lighthouse MCP** (Core Web Vitals, SEO, accessibility)
  - **BrowserTools MCP** (Chrome DevTools for Cursor)
  - **Flowbite MCP** (Tailwind context, e-commerce blocks)
  - **Design Token Bridge MCP** (cross-platform token translation)
  - **Draw.io MCP** (official, zero-install diagramming)
  - **Miro MCP** (official, collaborative diagramming)
- MCP-SERVER-REGISTRY.md: "Recommended Stacks" section (Luxury E-Commerce, Education/Content)
- Generator MCP Discovery: UI/design tooling detection (shadcn, Figma, Tailwind, Storybook)
- Next.js preset: 6 new MCP recommendations (shadcn, Figma, 21st.dev, Lighthouse, Flowbite, Playwright)

---

## [0.6.0] — 2026-03-30

### Added
- 3 conditional agent templates (created from real-world e-commerce project test):
  - `templates/cursor/agents/seo-auditor.md.template` — SEO validation (metadata, JSON-LD, hreflang, OG, canonicals)
  - `templates/cursor/agents/i18n-validator.md.template` — i18n validation (compound locales, translations, encoding, API locale params)
  - `templates/cursor/agents/security-auditor.md.template` — Security audit (payments, secrets, auth, injection, CORS)
- Generator prompt: 3 new conditional rows in file generation table (SEO if public pages, i18n if locales, security if payments/auth)

---

## [0.5.0] — 2026-03-29

### Added — Bulletproof Generator Rewrite
- **Full rewrite of `generator/PROJECT_SETUP_PROMPT.md`** (~350 lines, 8 phases):
  - Phase 0: Foundation — explicit KB reading instructions with file paths and section numbers
  - Phase 0.2: Existing file inventory — detect all AI workflow files before generating
  - Phase 2: Stack detection — auto-detect Next.js/FastAPI/Node and load matching preset
  - Phase 2.5: MCP Discovery — scan ALL project dependencies for MCP servers beyond static registry
  - Phase 3: Template reference table — 23 templates mapped to output files (replaces inline specs)
  - Phase 4: Existing file handling — migration matrix for CLAUDE.md merge, .cursorrules archive, MCP additive-only
  - Phase 5: Validation — explicit reference to VALIDATION_CHECKLIST.md with critical inline checks
- **MCP Discovery System** — 3-level automated discovery:
  - Setup-time: full dependency scan → registry check → npm/PyPI search → 5-gate quality check
  - Runtime: MCP Awareness section in CLAUDE.md template (search when struggling with API)
  - On-demand: `/discover-mcp` slash command template for manual rescan
- **5-Gate MCP Quality Check**: EXISTS → MAINTAINED → TRUSTED → SECURE (mcp-scan) → USEFUL
- `templates/claude-code/commands/discover-mcp.md.template` — post-setup MCP discovery command

### Changed
- CLAUDE.md template: added MCP Awareness section
- update-context command template: added MCP discovery step for new dependencies

---

## [0.4.0] — 2026-03-29

### Added
- `templates/cursor/.cursorindexingignore.template` — prevents Cursor from indexing junk (node_modules, dist, lock files)
- `templates/cursor/.cursorignore.template` — hides secrets (.env, .pem, credentials) from Cursor context
- `templates/shared/HANDOFF.md.template` — cross-session handoff template for agent continuity
- Validation checklist: mcp-scan check, version pinning check, DECISIONS.md/cursorignore completeness checks

### Changed
- CLAUDE.md template: added session protocol, definition of done, commit format, corrections-become-rules sections
- MCP templates: all packages now use pinned versions (`@x.y.z`), not `@latest`
- base.mdc template: added "don't think step by step with reasoning models" warning
- Generator prompt: focused on Cursor + Claude Code only (removed "Copilot, etc." references)

---

## [0.3.0] — 2026-03-29

### Added
- `templates/` — 17 production-ready template files with `{{PLACEHOLDER}}` syntax
  - `templates/cursor/rules/` — 6 rule templates (base, frontend-react, frontend-vue, api-rest, database, testing)
  - `templates/cursor/skills/` — 2 skill templates (deployment, migration)
  - `templates/cursor/agents/` — 2 agent templates (reviewer, tester)
  - `templates/cursor/mcp.json.template` — Cursor MCP config with security annotations
  - `templates/claude-code/` — 5 Claude Code templates (CLAUDE.md, review-pr command, deploy command, base rules, mcp.json)
  - `templates/shared/AGENTS.md.template` — Cross-IDE interop template
- `generator/presets/` — Stack-specific generator additions
  - `nextjs.md` — Next.js App Router conventions, Server Actions, middleware patterns
  - `fastapi.md` — FastAPI/Pydantic v2, async SQLAlchemy, Alembic patterns
  - `general-node.md` — Express/Fastify layered architecture, ESM/CJS detection
- `generator/VALIDATION_CHECKLIST.md` — 10-category post-generation verification checklist
- `knowledge-base/MCP-SERVER-REGISTRY.md` — Curated 3-tier MCP server registry with security postures
- `CHANGELOG.md` — This file
- `feedback/README.md` — Feedback loop process for continuous improvement

---

## [0.2.0] — 2026-03-27

### Added
- `generator/PROJECT_SETUP_PROMPT.md` — Master generator prompt (186 lines)
  - Phase 1: Deep codebase analysis (identity, architecture, conventions, domain)
  - Phase 2: Generate complete AI workflow (10 file types)
  - Phase 3: Quality verification (7 checks)
  - Phase 4: Summary report

---

## [0.1.0] — 2026-03-25

### Added
- `knowledge-base/KB-01-AI-WORKFLOW-ENGINEERING.md` — 893 lines
  - Context engineering, memory engineering, RAG pipelines, prompt engineering
  - Hallucination reduction, MCP ecosystem, AI IDE landscape, cost engineering
  - AI observability, development workflow optimization
- `knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` — 1,103 lines
  - Context architecture blueprints, rules engineering, skills systems
  - Agent architecture & orchestration, project organization, quality maximization
  - Security & governance, domain-specific patterns, team workflows
- `workflows/WORKFLOW-CURSOR.md` — 770 lines — Complete Cursor IDE setup and workflow guide
- `workflows/WORKFLOW-CLAUDE-CODE.md` — 795 lines — Complete Claude Code setup and workflow guide
- `research/` — 4 raw research files (~4,200 lines)
  - `first-prompt-result-opus.md` — Broad AI infrastructure (Claude Opus 4.6)
  - `first-prompt-result-gpt-dr.md` — General overview (GPT Deep Research)
  - `second-prompt-result-opus.md` — IDE-specific deep dive (Claude Opus 4.6)
  - `gap-filling-deep-dive.md` — Targeted gap-filling (Claude Opus 4.6)
- `prompts/` — 2 research prompts used to generate the research above

---

## Roadmap

- [ ] Validate generator on 3+ real projects (different stacks)
- [ ] Add preset for monorepo (Turborepo/Nx)
- [ ] Add preset for React Native / Expo
- [ ] Add preset for Go (standard library + chi/gin)
- [ ] Refine templates based on validation feedback
- [ ] Add `generator/presets/django.md`
