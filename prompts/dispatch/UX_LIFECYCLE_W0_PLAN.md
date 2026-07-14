# W0 PLAN — Lifecycle UX Overhaul (branch `ux-lifecycle`)

> Committed at W0 per hard rule 5 of `UX_LIFECYCLE_ARCHITECT_PROMPT.md`. Executed 2026-07-12 on
> branch `ux-lifecycle` (Fable 5 main session; the architect prompt routed main work to Sonnet 5 —
> the operator dispatched it into a Fable session, noted here for the record). Merge decision is
> the operator's: default Wed 2026-07-15 post-launch; the early-ship window is structurally
> unreachable from this session (rebuild + push are forbidden by the branch rules).

## Context

Design of record: `prompts/dispatch/UX_LIFECYCLE_ARCHITECT_PROMPT.md` (W0–W7), built from
`research/2026-07-11-user-pain-map.md`. The evidence: first-run/lifecycle UX is the densest pain
cluster (68% abandon on setup time; no cost disclosure before an ~18–21-min run; no visible value
until the end; no resume story; "9 phases" documented vs 14 real; uninstall undocumented; the
top-voted rival issue is upgrade-destroys-customization). All fixable in-repo. Hard rules: no new
questions (≤1 typical-run budget), pre-registered metrics only, measured cost claims only, fix
agents firewalled from `harness/results/**` + `harness/fixtures/**`, per-workstream commits.

**Binding session rules:** work ONLY on `ux-lifecycle`; never touch main, never push, never run
`scripts/build-snapshot.sh`. Budgets: ≤10 subagents, ≤3M subagent tokens. W7 verifier = Opus 4.8;
everything else main-session. Pre-existing working-tree dirt (a modified launch digest + three
untracked items) is never staged — every commit uses explicit `git add <paths>`.

**Scrub discipline:** every new/edited shipping file uses repo-relative paths only — zero
operator home paths, zero client names.

## Verified facts the plan builds on

- PSP (`generator/PROJECT_SETUP_PROMPT.md`, 1023 lines): paste-line L3, `---` L6, mission L10,
  `## Phase 0` L14. **14 real `## Phase` headings**: 0, 0.5, 1, 2, 2.5, 3, 4, 4.5, 5, 6, 7, 8,
  8.5, 9. No preamble, no resume, no banners, no self phase-count claim.
- First unconditional write = Phase 3 (L367); **Phase 0.5 conditionally writes `OWNER_BRIEF.md`
  (L107) + `docs/REVIVAL-ASSESSMENT.md` (L128) earlier** → the "nothing until Phase 3" claim is
  false as drafted; preamble states the true boundary instead.
- Phase 1 brief is in-context only today. IDE-scope resolution at L502–505 (defaults to BOTH).
  `ide_scope` filled at L935; manifest template has `ide_scope` + per-file `owner_customized`.
- "9 phases" lives at `QUICK_START.md:53,156` + `workflows/KIT-INSTALL-PIPELINE.md:83,325,355`.
- Measured runs (`harness/results/2026-07-03-baseline/*/run-metadata.json`): 273k/1074s,
  328k/1137s, 308k/1279s → ~18–21 min, ~270–330k tokens, manifests recorded 34/38/44 files.
- W5 substrate: `harness/results/2026-07-03-baseline/greenfield-next/generated/` (64-file
  installed tree, manifest kit_version 0.17.0). Pre-scan vs HEAD templates: 11 of 44 entries have
  real kit-side drift → **all four 2×2 cells covered by real 0.17→0.20 drift, no synthetic edits**.
- HARNESS-SPEC addenda anchor L198, v1.1 precedent format; spec commit must predate results
  commit. `L3.*` metric namespace is RESERVED by `L3_FIELD_EVIDENCE_ARCHITECT_PROMPT.md` → new
  metrics named **LC-1..LC-3**.
- Fallback-chain doctrine: `workflows/WORKFLOW-CLAUDE-CODE.md:703`.
- Frozen runners hard-code phase IDs ("Phases 0 through 9 … Phase 8.5") → **never renumber**.
- VALIDATION_CHECKLIST ↔ `harness/layer1/static-checks.md` bidirectional sync rule (checklist L9).

## Commit sequence (each = one conventional-prefix commit)

1. **W0** — this plan + fix stale figure at `UX_LIFECYCLE_ARCHITECT_PROMPT.md:14`
   (`15–45-min` → `~18–21-min`, measured). Never touch `research/**` / `feedback/**` history
   (immutable audit evidence).
2. **W1.5** — single-IDE scope default.
3. **W2** — Phase 1.7 first-artifact brief + banner convention.
4. **W3** — checkpoint/resume protocol + QUICK_START failure modes.
5. **W4** — honest phase count + uninstall sections.
6. **W1 (LAST of doc workstreams — so every preamble claim is true at its commit)** —
   DF-RUN-CONTRACT block on three surfaces.
7. **W6** — HARNESS-SPEC v1.2 addendum (spec BEFORE any LC measurement — pre-registration).
8. **W5 instrument** — protocol docs committed before the run.
9. Execute W5 (3 Sonnet subagents) → conditional `fix(generator)` commits for real
   UPGRADE_MODE gaps → **W5 results** (`harness/results/2026-07-12-upgrade-survival/`).
10. Execute W7 (5 Opus subagents) → **W7 results** (`harness/results/2026-07-12-ux-verify/`)
    + bounded fix commits.
11. **Wrap** — CHANGELOG `[Unreleased — ux-lifecycle branch]` section, HANDOFF touch
    (operator merge note), feedback deferral rows.

## W1 — DF-RUN-CONTRACT preamble (three surfaces, one truth)

Canonical block wrapped in sentinel comments `<!-- DF-RUN-CONTRACT v1 -->` …
`<!-- /DF-RUN-CONTRACT v1 -->` so drift is mechanically grep/hash-detectable. Content (one line
each): time & tokens (~18–21 min, ~270–330k, three recorded runs, single-run directional, source
named); writes (34–44 files in recorded runs, tier-dependent, all manifest-listed); questions
(≤1 typical; pack proposals only when triggered); building-for line with detected scope +
evidence + veto open until Phase 3; first artifact (`docs/AI-WORKFLOW-BRIEF.md` as soon as
Phase 1 completes; stands alone); resume (re-paste the prompt — checkpoint offers resume or
clean restart); uninstall (manifest is the map; recipe in QUICK_START § Uninstall); abort
boundary stated truthfully (until the Phase 1 brief, the only writes are the checkpoint file and
— revival runs only — `OWNER_BRIEF.md` + `docs/REVIVAL-ASSESSMENT.md`). No numeric "≤3 min"
promise in kit voice.

Placements: PSP new `## Before You Begin — the run contract` between `---` (L6) and
`## Your Task` (L8) — below the paste-line so operators see it in-session — plus the echo
instruction (agent's FIRST output = scope-detect, block printed verbatim with `Building for:`
filled; no wait; proceed to Phase 0). QUICK_START Step 2: intro line + block + MIGRATION pointer
line; comment near L5 that numbers must match the block. README: replace the L52 heads-up with
the block (keep "plugin install is instant"); fix L50 → "asks at most one question in a typical
run". QUICK_START/README carry the template form (`<detected scope>`) — bytes identical across
all three surfaces.

## W1.5 — evidence-based single-IDE scope

- **Mission line PSP:10**: surfaces resolved by evidence in Phase 3.4; default single surface;
  "a single-IDE operator never receives the second surface silently".
- **Replace PSP:502–505**: signals strongest-first — (1) operator words, final; (2) session
  surface, always in scope; (3) live-ness via `git log -1 --format='%ci' -- .cursor/` /
  `-- .claude/`; ≥6-months-stale while sibling active = stale; no git history → signals 1–2.
  Default: install ONLY live surfaces; BOTH only when both live or operator says so. Keep the
  ONE pre-existing blocking ask for genuinely mixed evidence. Keep the L500 sync-mandate
  paragraph (applies when scope resolves to both). Corrections route through
  `workflows/MIGRATION-CURSOR-CLAUDE.md`.
- **PSP:935**: annotate ide_scope fill (evidence-based single-scope default).
- **Phase 9 report** (~L952): add `IDE scope (Phase 3.4): [value — evidence + veto status]`.
- **VALIDATION_CHECKLIST §10** new item: no `.cursor/**` when manifest ide_scope excludes cursor
  (the W1.5 acceptance gate) + mirrored static-checks entry, same commit.
- **Cost-split disclosure (architect W1.5.4): DEFER** — 2 of 3 recorded runs were claude-only and
  the sole "both" run was cheapest; a scope-split from n=3 is a dishonest cross-fixture
  comparison. Feedback row: collect same-fixture pairs first.

## W2 — first visible win + banners

- New `### 1.7 Write the codebase brief — first artifact (mandatory, all tiers)` after L241:
  `docs/AI-WORKFLOW-BRIEF.md` (≤120 lines: identity/stack, architecture/conventions, domain,
  drift-quarantine list, tier + evidence) as soon as 1.1–1.6 complete; manifest entry class
  `doc`, `template: null`; pre-existing file → Phase 4 protocol. One operator notice line.
- New `## Run Protocol — banners, checkpoints, resume` before `## Phase 0` (banners half):
  `Phase <id> — <name> (step <k> of 14) — writes: <expected files | "nothing">`; fixed step map
  0→1 … 9→14; skipped conditional phases still print a banner (`: skipped — <gate>`). No
  spinners, no ETAs. Count phrase everywhere: **"14 phases, numbered 0–9 with half-steps 0.5,
  2.5, 4.5 and 8.5"**. NEVER renumber (frozen runners + cross-refs).
- VALIDATION_CHECKLIST §10 item: brief exists + mirrored static-check, same commit.

## W3 — checkpoint + resume (protocol text ≤30 lines)

- Run Protocol second half: after each phase append ONE JSON-Lines row to
  `.df-setup-state.json` (project root; `{"phase","done","written":[],"pending":[]}`; never in
  manifest). Session start, before Phase 0.1: if file exists → exactly two options: **Resume**
  (re-read `written`, never regenerate, rejoin at first not-done phase) or **Clean restart**
  (list union of `written`, confirm deletions, delete + state file, Phase 0). No state file → no
  offer (typical-run budget unchanged). Phase 9 final action: delete the state file. State file
  + existing manifest = stale leftover → Phase 0.2 guard.
- PSP Phase 8.5 exclusions (L936): never list the checkpoint. PSP Phase 9: deletion line.
- QUICK_START new `## If a run fails`: session died → re-paste, resume offer; rate-limit/model →
  resume + `fallbackModel` chain doctrine (`workflows/WORKFLOW-CLAUDE-CODE.md`); deliberate
  abort → clean restart removes listed files, or keep the standalone brief.
- VALIDATION_CHECKLIST §10 item: `.df-setup-state.json` ABSENT post-run + mirror, same commit.
  (JSON Lines despite the name — no `json.tool` gate on it.)

## W4 — truth-in-docs: phase count + uninstall

- Phase-count fixes: `QUICK_START.md:53,156`; `KIT-INSTALL-PIPELINE.md:83` heading + add
  Phase 0.5 / 8.5 rows, mark 1.6/3.4/3.5 as sub-steps; `:325,:355` "9-phase" → "14-phase";
  ~L117 add the resume pause. Leave the historical version-table "9 phases" row (L33).
- Cheap stale descriptors, same commit: `CLAUDE.md:41` "(17 sections)" → "(§0–§23)";
  `QUICK_START.md:157` "(11 categories)" → "(§0–§23)".
- **QUICK_START `## Uninstall`**: manifest is the map; delete `owner_customized: false` +
  `disposition: created` entries; review merged/kept/customized (backups in `docs/archive/`);
  `.ai-kit-manifest.json` LAST; plugin path `claude plugin uninstall directiveforge`; explicit
  "does NOT touch: your own files, git history, merged pre-existing files".
- **UPGRADE_MODE new `## §9 — Uninstall (manifest-driven removal)`**: dry-run plan first (§4
  format; DELETE only when owner_customized:false ∧ disposition:created ∧ current sha ==
  recorded sha; else REVIEW via §5); order files → empty kit dirs → manifest last; out of scope:
  non-manifest files, git history, archives, protected paths (§3a); reconstructed manifests (§6)
  downgrade every DELETE to REVIEW.

## W6 — HARNESS-SPEC v1.2 addendum (commit BEFORE any measurement)

`### v1.2 (2026-07-12) — first-run + upgrade lifecycle metrics (LC-1..LC-3)` + version-history
row. Namespace note (`L3.*` reserved by the field-evidence program; LC-* are controlled-fixture
counterparts — cross-reference, never duplicate). **LC-1** time-to-first-artifact (dispatch →
brief on disk non-empty; orchestrator UTC stamps + echoed post-write stamp + file birth time;
upper bound; resumed runs measured on initial segment; presentation band ≤180 s). **LC-2**
disclosed-vs-actual cost delta (per disclosed quantity, signed delta vs the range AS WRITTEN in
that run's preamble; over-ceiling = FALSE disclosure, blocking; under-floor = reported delta,
not false; token source = orchestration per-agent report, L2.5 method + caveat). **LC-3**
upgrade customization-survival (per pre-registered protocol; survival rate = owner-changed lines
preserved / total; adjudication-flagging correctness = 1.0 required; **silent-overwrite count
HARD GATE = 0**; plus §7.4 non-manifest untouched, protected paths byte-identical; n stated).
Boilerplate per v1.1 precedent: L1.*/L2.* untouched; worst-of + §3c unchanged; bands
presentation-only; no re-grading; LC values in dated result files; scorecard binding only under
a future spec version. One line recording the L1.1 check-pack growth from W1.5/W2/W3 items
(forward-only denominator change, §18–§23 precedent).

## W5 — upgrade customization-survival test

Instrument first: `harness/lifecycle/UPGRADE-SURVIVAL-PROTOCOL.md` +
`harness/lifecycle/UX-REHEARSAL-PROTOCOL.md` (verbatim subagent briefs, answer key, scripted
adjudication answers, firewall clauses per l2-delta pattern) + one RUNBOOK pointer.

- **Substrate**: MAIN SESSION (not a fix agent) copies the frozen greenfield-next generated tree
  → scratch `copy-a/`; `git init`, install-state commit (synthetic author), customization
  patches as commit 2. Agents get scratch paths only + prohibition on reading `harness/`,
  `feedback/`, `case-studies/`. Post-run: baseline results dir verified untouched.
- **Customization matrix** (real 0.17→0.20 drift; expected verdicts pre-registered):
  1. `.claude/rules/base.md` + owner block, kit-same → KEEP + set owner_customized (differ/match)
  2. `.claude/commands/update-context.md` + owner step, kit-drift → ADJUDICATE → scripted "merge"
  3. `CLAUDE.md` owner section + line edit, kit-drift → ADJUDICATE, deliberately UNANSWERED →
     must default keep-mine (§5.3) + flag set — the predicted detection edge
  4. `.claude/skills/git-hygiene/SKILL.md` NEW operator-own file (outside manifest) → §7.4
     untouched invariant
  5. Sentinels: `.claude/commands/status.md` (match/match KEEP);
     `.claude/skills/decision/pre-mortem/SKILL.md` (match/differ UPGRADE);
     `.claude/rules/quality-gates.md` declared protected (§3a KEEP-PROTECTED while its `.cursor`
     twin upgrades)
- **New kit version = real HEAD (v0.20.0)** — no synthetic template edits; protocol step 0
  re-runs the hash pre-scan at branch SHA (fallback: one synthetic edit in a SCRATCH kit copy
  only, never in repo).
- **Execution**: 3 Sonnet subagents cold-reading `generator/UPGRADE_MODE.md` — audit pass (§2.2),
  dry-run plan, apply-on-branch + §5a verification. Main session plays operator with scripted
  answers. Sonnet-vs-"highest-capability" disclosed as threat-to-validity; W7's Opus re-run
  covers the other model class.
- **Results**: `harness/results/2026-07-12-upgrade-survival/` — RESULT.md (house PASS/FAIL
  table, corrections, verdict, notes), survival.json, plan/adjudication/audit copies,
  customizations.diff, pre/post hash manifests, run-metadata.json (tokenized paths). Copied
  install-manifests unavoidably carry `kit_path` — flagged in HANDOFF for BRIDGE rows at next
  rebuild.
- Real UPGRADE_MODE gaps → separate `fix(generator)` commits + re-run affected steps.
- **Runner script: NOT this round** (mid-pass human gate doesn't fit the batch pattern) →
  feedback deferral row: script it after two protocol runs.

## W7 — fresh-context verification (Opus 4.8, firewalled)

- **Rehearsal substrate**: fresh synthetic ~10-file TypeScript CLI repo in scratch (NOT a harness
  fixture), git history, **no `.cursor/`** → doubles as the W1.5 acceptance instance (zero
  `.cursor/` artifacts, manifest `ide_scope: ["claude-code"]`, scope in preamble).
- **5 Opus agents**: (a) rehearsal segment 1 — cold PSP paste, instructed stop right after
  Phase 3's checkpoint line lands (boundary-stop ≡ boundary-kill on disk; preserves the billing
  report for LC-2; mid-phase-kill honestly listed untested → feedback row); (b) segment 2 —
  fresh context, same paste, must detect the state file, offer resume, complete through Phase 9;
  hash-proof no redone work; (c)+(d) independent survival re-run per the protocol doc on fresh
  copy-b (never sees W5 outputs); (e) verifier synthesis — gets surfaces + acceptance checklist
  + raw artifacts, NOT the architect prompt or session reasoning; judges every preamble
  disclosure TRUE/FALSE per LC-2, checks uninstall vs the rehearsal manifest, 3-surface drift
  grep on the DF-RUN-CONTRACT sentinels, checklist/static-checks sync, recomputes re-run LC-3,
  findings table with dispositions.
- Timing/tokens: main session brackets each dispatch with `date -u`; LC-1 from segment 1 only.
- **Results**: `harness/results/2026-07-12-ux-verify/` (RESULT.md in DISPATCH-C format mapping
  1:1 to the acceptance checklist + GO/NO-GO, verify-metadata.json, rehearsal/ +
  survival-rerun/ + drift-grep.md).
- **Disposition rules (pre-stated)**: BLOCKING = false disclosure, silent overwrite >0, resume
  failure, `.cursor/` leak, phase-count mismatch, surface drift, checklist desync → bounded fix
  loop (≤2 reserve dispatches; doc-only fixes re-checked mechanically by the main session;
  still-red ships as FAIL row + feedback row — never tune the instrument). NON-BLOCKING →
  notes + rows.

## Budgets

8 planned subagents (3 Sonnet W5 + 5 Opus W7), ~0.9–1.0M tokens; 2 slots + ~2M reserve for the
bounded fix loop. Per-boundary actual-vs-estimate checks; ≥2× overrun → stop and surface.
Spend line in CHANGELOG per house style.

## Wrap

- CHANGELOG: `## [Unreleased — ux-lifecycle branch] — 2026-07-12` + W subsections + dispositions
  line (findings dispositioned in RESULT.md; deferrals in the feedback file; roll-up owed at
  next release close — stated so the DISPOSITIONS-file omission is visible, not silent) +
  measured-budgets line.
- HANDOFF: dated block (branch state, unpushed, LC metrics defined, results); post-launch
  candidate marked EXECUTED-on-branch; operator merge note (conflicts expected only in
  CHANGELOG/HANDOFF — keep both dated blocks; branch otherwise additive; never touches
  `launch/**`); snapshot flag (new shipped files change SNAPSHOT-MANIFEST counts; two manifest
  copies need BRIDGE rows for `kit_path`).
- `feedback/2026-07-12-ux-lifecycle-deferrals.md`: scope-split cost line (needs same-fixture
  n≥2), survival runner script, mid-phase-kill robustness, LC scorecard binding, W7
  non-blocking findings.

## Acceptance mapping

- Question budget ≤1 + zero wizard steps → W7 transcript question count.
- First artifact ≤3 min + all disclosures true → LC-1/LC-2 in W7 RESULT.md.
- Resume across killed session → W7 segment-2 hash-proof.
- Documented == narrated == real phase count (14) → W7 grep + banner transcript.
- Uninstall manifest-accurate → W7 cross-check vs the rehearsal manifest.
- W5 silent overwrites = 0 + dated result file committed.
- SPEC addendum dated append-only; checklist/static-checks sync — same-commit rule enforced.
- Budgets reported → CHANGELOG line + verify-metadata.json.
- Final branch check: full commit sequence on `ux-lifecycle`; working tree clean except the four
  known dirt items; no push, no snapshot, main untouched.
