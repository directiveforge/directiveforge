# v0.19.0 — The Delta Release (W0 plan, final)

## Context

v0.18.0-H shipped the first honest harness baseline (`harness/results/2026-07-03-baseline/`, frozen at `21eab1d`): 3 F-grades (decision-pack L1.3 dead triggers; brownfield-api L2.4 false-content ×4; brownfield-docs L2.3 destructive edit + 🚨 broken link-gate), a circular VALIDATION_CHECKLIST (12–14/14 PASS on the same F-graded runs), and a 23.7M-token orchestration overrun vs a 1.5–2.5M plan (~612 calls × ~31.5k fixed per-call context ≈ 19M pure overhead — ADJ-3). v0.19.0 = published F → fixed → re-measured → provable delta. Contract: `prompts/dispatch/V0_19_0_ARCHITECT_PROMPT.md` + `feedback/DISPOSITIONS-v0.18.0.md` HD-1..HD-10. Instruments frozen; every improved number traces to a named HD fix; this release runs under its own new cost discipline (if it blows its budget, that ships honestly).

**Contract-internal contradiction, surfaced (not papered over):** §4.1 mandates ≥10-trials-per-call batching, but frozen HARNESS-SPEC v1.0 L1.2 Method says router-sim sees "the catalog + **one prompt**" and §7.4 freezes "what was measured **or how**". Resolution via the §3.1 escape hatch: W3 ships a **dated HARNESS-SPEC v1.1 Method addendum** (definitions untouched; K-prompts-per-call channel with independent-judgment instruction + per-run equivalence demonstration), and the HD-1/HD-2 headline delta rows are measured on the **v1.0 single-call channel** (affordable: 2 skills × 10 committed rows = 20 calls ≈ 0.65M). Both numbers ship.

## Setup (before W1)

- `CLAUDE_CODE_SUBAGENT_MODEL=claude-opus-4-8` (contract §4); Haiku/Sonnet only for mechanical sweeps.
- Multidomain lock + "fixture answer keys frozen" go into every W1/W4 subagent brief's acceptance section.
- Slim briefs: paths + acceptance checks; no pasted file bodies.

## HD → fix map (DISPOSITIONS-v0.18.0.md:42-53; 0 silent drops)

| HD | Defect (baseline evidence) | Fix target | Fix approach | Re-measure | WS |
|---|---|---|---|---|---|
| HD-1 | `inversion` F1 0.33, activation 0.3333 [0.1923,0.5122] n=30; positives leak to pre-mortem | `templates/skills/decision/inversion/SKILL.md` description | Cede "is this a good idea?/should I do X?" to asm; claim saboteur-framing + hole→constraint conversion | L1.2 v1.0-channel + L1.3 | W1a→W4 |
| HD-2 | `anti-sycophancy-meta` F1 0.57, activation 0.2667 [0.1418,0.4445] n=30; confused with own downstream routes | `.../anti-sycophancy-meta/SKILL.md` + KB-05 §5 | First-responder convention: asm owns initial neutral ownership-evaluation utterance, defers on explicit technique requests; convention recorded normatively in KB-05 §5 (the HD-2 design question: yes, pre-empt downstream siblings on ownership signal) | L1.2 v1.0-channel + L1.3 | W1a→W4 |
| HD-3 | `name-generation`↔`naming-brief` near-miss F1 0.89 | both naming descriptions | "Brief exists" precondition boundary | L1.2 naming batched (first cut candidate) | W1a→W4 |
| HD-4 | L2.3=1: README edited in place, no backup (hard F) | PSP Phase 4.3 | Blanket row: ANY pre-existing file edit → backup-sibling or append-only; README named; Phase 4 emits `PRE-EXISTING-MODIFIED.txt` manifest (makes the gate mechanically checkable — W2 item) | L2 brownfield-docs re-run | W1c→W4 |
| HD-5 | L2.4=4: Heroku trap propagated into deploy.md while same run flagged it as drift | PSP deploy-authoring + analysis phases | Drift quarantine: facts flagged drift/stale during analysis may NOT re-enter generated files as truth (cite the flag instead); deploy commands derive from artifacts (Dockerfile/CI), never README prose; quarantine list emitted machine-readable | L2 brownfield-api re-run | W1b→W4 |
| HD-6 | L2.6 🚨: generated link-gate resolves docs/-relative links from repo root → ~13 FPs drown 2 real | `templates/*/rules/quality-gates*` + `generator/presets/docs-ops.md` | Ship canonical correct link-check pattern (resolve relative to linking file's dir; exclude template example-paths) so the generator stops improvising; none exists today (confirmed) | L2 brownfield-docs re-run: FP count | W1d→W4 |
| HD-7 | Starter installs ship skills routing to absent siblings (greenfield A1 ⚠) | PSP Phase 3 (§3.1/3.5) / Phase 8 manifest | Route-pruning / tier-aware fallback at install (extend v0.17.0 reversibility-fallback pattern) | Fixed + mechanical check (W2 item: sibling-route resolution); full re-measure DEFERRED-with-reason (greenfield not in §6-W4 slice list; harness round 2) | W1e |
| HD-8 | KB-08 gate met literally, runner skipped citing operator minimalism; answer key MISSED (L2.2 S3) | PSP gate-precedence doc | Explicit precedence: detection-based pack gates vs operator-minimalism + gate-decision log requirement | Fixed + judgment checklist item; re-measure DEFERRED-with-reason (same) | W1e |
| HD-9 | Haiku recorder truncated large JSON (parseable → silent) | `harness/RUNBOOK.md` gotchas + runner briefs | Recorder briefs gain key-count/byte-count echo verification; delta runner sidesteps recorders entirely (workflow returns JSON → main loop Writes artifacts verbatim) | harness-internal; N/A in W2 table ("see W3") | W3 |
| HD-10 | .gitignore swallows | — | Already fixed (`21eab1d`, `4a43ebf`) | record-only in dispositions | — |

## W1 — HD fixes (Opus agents; Fable reviews each; commit per workstream)

**W1a — decision + naming descriptions. The edit set is FIVE decision skills, not two** (router = argmax over competing descriptions; confusion data `l1/decision/l1.2-trigger.json`):

| Skill | Edit | Pre-registered expected movement (= DELTA mechanism column, written before measurement) |
|---|---|---|
| anti-sycophancy-meta | Rewrite: owns initial neutral ownership-evaluation utterance; explicit "defers to pre-mortem/steelman/DEF on explicit technique requests" clause (protects n1) | p1 pre-mortem→asm; p2 DEF→asm; p3 residual risk vs steelman (pre-registered). F1 0.57→~0.8–1.0 |
| inversion | Rewrite: drop "is this a good idea?/should I do X?/convince me"; claim "what would have to be true for this to blow up", hole→constraint | p3,p4 pre-mortem→inversion; p1/p2 pre-registered residual misses (each −0.2 recall). F1 0.33→~0.75; do NOT promise 1.0 |
| pre-mortem | Subtractive only: delete "whenever a user brings a plan they own"; keep assume-failure phrasings | Frees asm-p1, inversion-p3/p4; own recall stays 1.0 (positives all explicitly failure-simulation) |
| steelman | Subtractive only: delete "what do you think of my idea" | Frees asm-p3; own recall stays 1.0 |
| disconfirming-evidence-first | Narrow: explicit-asymmetry phrasings + artifact-present; no-objective-criterion exclusion | Frees asm-p2; may clear own poem FP (F1 0.909→≤1.0); positives hold (all contain explicit asymmetry) |

Plus naming pair (HD-3). One Opus agent for the decision-pack set, one for the naming pair. Description style per KB-05 §5.1 doctrine (pushy, firing conditions in user-language). Acceptance: frontmatter parses, line ceilings hold (L1.1-class static checks pass locally), no two descriptions share a ≥4-word span, multidomain lock.

**W1b/c/d/e** — HD-5, HD-4, HD-6, HD-7+HD-8 per the map above (4 more Opus agents; briefs name HD row + commit-body requirement). KB-05 §5 first-responder note rides with W1a.

## W2 — Checklist hardening: kill the circularity

- New items live in **new sections** (L2.1 scores section-level per HARNESS-SPEC:112 — don't silently flip old sections); agreement table reports section-level AND item-level.
- Mechanical items (designed; refine in execution): **HD-4** `PRE-EXISTING-MODIFIED.txt` manifest must exist + every listed path has backup sibling or append-only diff (re-score form: `diff -rq` fixture `repo/` vs generated tree); **HD-5** drift-quarantine grep — every quarantined term's occurrence outside tech-debt must co-occur with drift/stale flag; **HD-6** link-gate self-test against a 3-file micro-corpus (PASS iff exactly the 1 real dead link fires) — tests the instrument, kills the circularity class; **HD-7** sibling-route resolution (`test -d` per referenced skill); **HD-1/2/3 proxy** description-collision lint (≥4-word shared span) — scoped honestly as collision lint, not F1 predictor. **HD-8** semi-mechanical (gate-decision log + judgment wording); **HD-9** N/A → W3.
- **Instrument-validity §-note (named contract deliverable):** checklist = generation-time gate, harness = ground truth; PASS-rate never quoted as quality evidence without a harness grade next to it.
- Then re-score the 3 frozen baseline `generated/` trees with the hardened checklist: must FAIL brownfield-api + brownfield-docs; iterate until agreement; ship before/after agreement table + HD→item traceability table.

## W3 — Cost doctrine + batched protocol

- KB-04 §4.9 new anti-pattern: fire-and-forget subagent chains bypass spend breakers; per-call fixed overhead dominates at scale (measured ~31.5k/call × 612 ≈ 19M); count calls, batch trials, checkpoint at boundaries. Cross-ref one-liner in WORKFLOW-CLAUDE-CODE **§11 "Cost Optimization"** (verified: workflows/WORKFLOW-CLAUDE-CODE.md:678).
- **HARNESS-SPEC v1.1 dated Method addendum** (definitions/rubrics/answer keys untouched; version-history entry): K-prompts-per-call router channel + equivalence requirement. Never silently re-baseline.
- RUNBOOK + `harness/runner/` updated: batched protocol; **parameterized output dir/date/label** (today hard-coded to `.../2026-07-03-baseline`, `w4-l1-baseline.workflow.js:15,70` — unfixed, the delta run would clobber frozen baseline artifacts); recorder-free main-loop writes for delta-sized payloads + HD-9 key-count echo rule for round-2 recorder use; RUNBOOK gotchas updated.
- Acceptance: W4 runs on this protocol; freeze-diff vs `21eab1d` clean except the dated v1.1 addendum.

## W4 — Targeted re-measure + DELTA.md

**L1 (~1.35M, ~39 calls):**
- **Claim rows (v1.0 channel):** 20 single calls — `inversion` + `anti-sycophancy-meta` × their 10 committed prompts each, new catalog. Headline HD-1/HD-2 L1.2 delta rests on these (same instrument as baseline).
- **Pack context (v1.1 channel):** decision 120 prompts ≈ 8 batched calls (15/call); naming 60 ≈ 4 calls. Catalog-relativity: full-pack re-run required because 5 descriptions changed; regressions ship.
- **Channel equivalence:** paired comparison of the 20 v1.0 rows vs the same 20 rows inside the batched run (same catalog both channels — isolates batching) + 1 batched control call: 10 committed prompts of an unfixed stable skill against the **baseline catalog reconstructed from `2a5c3f0`** (isolates batching from catalog shift). Pre-declared fallback: controls/pairs outside baseline Wilson CIs → claim rows stand (already v1.0), pack-wide numbers ship v1.1-only with confound caveat.
- **L1.3 (v1.1, batched):** 2 fixed skills, baseline variant texts verbatim, schedule batch5-min10-target20-max30-halfwidth0.08 executed as batched calls with variants **interleaved across skills** (never 10 same-skill paraphrases in one call); Wilson CIs flagged nominal (independence weakened).
- No recorder agents: workflow returns JSON, main loop writes scorecards (kills recorder cost + HD-9 risk).
- Scorecard caveat text (adapt per metric): "Method note (spec v1.1, dated): trials 10–15/call, independent-judgment instruction, JSON-array return, vs v1.0 one-prompt channel (ADJ-3 cost fix). Definitions unchanged. Equivalence: [paired-rows + control numbers vs baseline Wilson CIs]. HD-1/HD-2 L1.2 rows additionally measured on v1.0 single-call channel [numbers]; delta claims rest on those. L1.3 CIs nominal."

**L2 (~1.1M, ~8–10 calls):** brownfield-api + brownfield-docs full generator re-runs (0.7M planned; baseline actuals 328k/308k + post-fix does more work). Targeted scorers only: L2.4 traps (api), L2.3 mechanical fixture-diff + backup check (docs), link-gate FP re-execution count (docs), L2.1 dual old+hardened (one agent per tree runs both — shared tree context). Collectors (pre/post manifests, diff-sets) = main-loop Bash, zero subagent cost. Greenfield NOT re-run (HD-7/HD-8 deferred-with-reason per §6-W4 slice list + budget cap).

**Pre-declared degradation order** (if boundary checkpoint shows overrun trajectory): (1) cut naming re-run (−0.14M, HD-3 re-measure → deferred-with-reason); (2) L2.1 old-checklist pass on one tree only (−0.08M); claim rows are never cut.

**Output:** `harness/results/2026-07-XX-delta/` mirroring baseline structure + SCORECARD-FORMAT JSON/md twins (label "delta", spec_version 1.1 where applicable) + `DELTA.md`: side-by-side baseline→post-fix, one row per HD fix, mechanism column pre-filled from W1a table, CIs where stochastic, regressions/no-moves included; improvement without mechanism = flagged as variance.

## W5 — Verification + wrap

- Fresh-context Opus verifier: re-compute ≥3 delta numbers from raw artifacts; freeze check `git diff 21eab1d -- harness/HARNESS-SPEC.md harness/layer1/ harness/layer2/ harness/SCORECARD-FORMAT.md harness/fixtures/` = clean or dated-v1.1-rule followed; budget table vs actual usage; **falsification verdicts re-read original sources**.
- `feedback/DISPOSITIONS-v0.19.0.md`: every HD-1..HD-10 row + every W row, 0 silent drops; CHANGELOG [0.19.0]; HANDOFF true-state; next-release pointer (scrub gate → public launch with DELTA.md as centerpiece; A11–A12; harness round 2 on batched protocol).
- Per-tier, per-workstream actual-vs-plan spend + call-count table → RUNBOOK economics (deliverable).

## Budgets (§4.2, declared before execution)

| WS | Tokens (plan) | Calls | Checkpoint trigger (2×) |
|---|---|---|---|
| W0 | 0.35M (actual ~0.33M) | 4 read-only agents | — |
| W1 | 0.8M | 12–16 (6 fix agents + reviews) | 1.6M |
| W2 | 1.0M | ~10 | 2.0M |
| W3 | 0.5M | ~6 | 1.0M |
| W4 | 2.45M (cap 2.5M) | ~50 (cap 150) | cap itself + degradation order |
| W5 | 0.3M | 2–3 | 0.6M |
| **Total** | **5.4M ≤ 6M** | **~85–100** | reserve 0.6M |

Boundary discipline: at every W-boundary read actual per-agent usage vs this table; ≥2× projected → STOP, surface to operator. No subagent chain runs unmonitored past a boundary. Planning constant 31.5k/call (measured, ADJ-3).

## Verification chain (per commit)

Docs-repo: no build/lint — verify = W2 agreement table (hardened checklist fails the F-runs), W4 delta attribution + channel-equivalence numbers, W5 adversarial re-compute + freeze diff, `grep -r "KB-01\|KB-02\|WORKFLOW-" --include="*.md"` cross-ref sanity, commit per workstream `feat(kit): v0.19.0 W<N> — <summary>`, dispositions/CHANGELOG/HANDOFF at wrap.

---

> **Provenance note (added at wrap, 2026-07-03).** This is the operator W0 plan, written and
> approved BEFORE W1 execution and before any measurement, but committed to the repo only at W5
> wrap — so its pre-registration claims (the W1a expected-movement table with per-prompt residual
> calls: inversion p1/p2, asm p3) are operator-attested, not git-provable (verifier finding V1,
> DISPOSITIONS-v0.19.0). Lesson: W0 plans commit at W0. The W4 measurement outcomes matched the
> table's residual calls exactly; see harness/results/2026-07-03-delta/DELTA.md.
