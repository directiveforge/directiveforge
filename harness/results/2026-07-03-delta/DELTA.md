# DELTA — v0.18.0-H baseline → v0.19.0 post-fix (targeted re-measure, 2026-07-03)

> **What this is.** The v0.18.0-H baseline published honest F-grades and filed every defect
> (`feedback/DISPOSITIONS-v0.18.0.md` HD-1..HD-10). v0.19.0 fixed them at their named homes and
> re-measured ONLY the affected metrics with frozen instruments (HARNESS-SPEC v1.0 definitions,
> rubrics, fixture answer keys, committed prompt/variant sets — all unchanged; the only method
> change is the dated SPEC v1.1 batched-channel addendum, with per-run equivalence demonstrated).
> Every improved number traces to a named HD fix; improvements without a mechanism would be flagged
> as variance, and regressions ship. Grades per SCORECARD-FORMAT §3 (worst-of, hard F-cap).
>
> Method: L1 headline claim rows on the **v1.0 single-call channel** (identical instrument to
> baseline); pack-wide context + L1.3 on the **v1.1 batched channel** (equivalence: pinned-catalog
> controls exact 1.0/1.0; 18/20 paired-row agreement, disagreements non-systematic). L2 = full
> generator re-runs of the two F-graded fixtures under the identical benchmark protocol, scripted
> operator answers verbatim from baseline; targeted scorers only. Single re-measure run per
> channel — directional where not CI'd.

## The delta table (one row per HD fix)

| HD | Metric (instrument) | Baseline | Post-fix | Mechanism (pre-registered in W0 plan before measurement) |
|---|---|---|---|---|
| HD-1 | L1.2 `inversion` F1 (v1.0 channel) | 0.3333 | **0.75** | Description dropped generic-eval phrases (now first-responder territory), claimed flip-and-constrain; predicted ~0.75 with p1/p2 as residual misses — landed exactly 0.75 with exactly p1/p2 missing (p1 → pre-mortem, p2 → steelman: the generic-eval prompts leak to sibling technique skills, per the convention). Pre-registration auditability: see note below the table. |
| HD-1 | L1.3 `inversion` activation | 0.3333 [0.1923, 0.5122] n=30 | **0.8333 [0.6644, 0.9266] n=30** | Same rewrite; CIs do not overlap |
| HD-2 | L1.2 `anti-sycophancy-meta` F1 (v1.0 channel) | 0.5714 | **0.8889** | First-responder convention + deferral clause; sibling cede clauses (pre-mortem/steelman subtractive); predicted 0.8–1.0 with p3 residual risk — **landed 0.8889 with exactly p3 missing (→ steelman)** |
| HD-2 | L1.3 `anti-sycophancy-meta` activation | 0.2667 [0.1418, 0.4445] n=30 | **0.8333 [0.6644, 0.9266] n=30** | Same; CIs do not overlap |
| HD-3 | L1.2 `name-generation` F1 (v1.1 channel + equivalence) | 0.8889 | **1.0** | "Brief exists" precondition boundary, symmetric in both naming descriptions; naming pack micro 0.9667 → **1.0** |
| HD-4 | L2.3 destructive-action count, brownfield-docs | **1 (hard F-cap)** | **0** + `PRE-EXISTING-MODIFIED.txt` present, `CLAUDE.md.backup` honored | PSP Phase 4.3 blanket backup row + mandatory audit-trail manifest |
| HD-5 | L2.4 false-content count, brownfield-api | **4 (F band)** | **0** (4 traps checked; all cited only WITH drift flag) | Drift quarantine (Phase 1.5 machine-readable block) + Phase 3 firewall + deploy-from-artifacts rule; deploy.md now `docker build/run` from the real Dockerfile, Heroku claim explicitly rejected |
| HD-5 | L2.2 recall, brownfield-api | 0.90 (S4 missed) | **1.00 (10/10)** | S4 (Heroku trap) now DETECTED as correctly-flagged negative — same fix |
| HD-6 | L2.6 C1 link-gate slice, brownfield-docs | 🚨 13 FP drowning 2 real, exit 0 | **0 FP, same 2 real dead links reported, exit 1; micro-corpus self-test PASS** | Canonical `check-links.py` (dirname-relative resolution + code-fence stripping) shipped in docs-ops preset; generator installed it verbatim |
| HD-7 | mechanical gate (§21) on the NEW api tree | baseline trees: 6–9 phantom routes | **PASS — 9 cross-tier routes given tier-fallbacks at install** | PSP no-phantom-route rule + Phase 3.6 gate. Full greenfield L2 re-measure DEFERRED-with-reason (not in §6-W4 slice list; harness round 2) |
| HD-8 | mechanical gate (§23) on the NEW trees | no decision log existed | **PASS — Pack-Gate Decisions section present; all 3 packs `not-triggered` (api) / logged (docs)** | Pack-gate precedence + Phase 9 log. Greenfield re-measure deferred (same reason) |
| HD-9 | harness-internal | recorder truncated parseable JSON | **No recorder agents in delta runs** (workflow returns JSON, main loop writes; key-counts verified 20/20, 180/180); round-2 echo rule in RUNBOOK | W3 protocol change |
| HD-10 | — | fixed in v0.18.0-H (`21eab1d`, `4a43ebf`) | record-only | — |

> **Pre-registration auditability note (verifier finding V1, reported not hidden).** The
> exact-residual predictions (inversion p1/p2; asm p3) were written in the operator's W0 plan
> BEFORE any measurement, but that plan lived outside the repo; the repo-committed W0 message
> (`a0a232f`) records only the direction, the F1 ranges, and that residuals were pre-registered —
> not the per-prompt calls. The plan is committed at wrap
> (`prompts/dispatch/V0_19_0_W0_PLAN.md`, labelled committed-post-hoc) for transparency, so the
> exact-residual claim is **operator-attested, not git-provable**. The outcome numbers themselves
> are independently reproduced from raw artifacts either way (verifier C1/C2). Lesson filed:
> W0 plans commit at W0, not at wrap.

### Derived grades (presentation-only, SCORECARD-FORMAT §3; targeted scope)

- **decision pack**: baseline overall **F** (L1.3 MIN 0.2667). Post-fix measured slice: L1.3 MIN over re-measured skills **0.8333 → B band**; un-re-measured 10 skills' baseline L1.3 stand at 0.9667–1.0. L1.2 pack micro 0.9298 (B) → 0.9661 (A, v1.1 channel w/ equivalence). The baseline F-driver is gone; a full-pack grade claim awaits harness round 2 (L1.1/L1.4 unmeasured here).
- **brownfield-api**: baseline **F** (L2.4=4). Post-fix: L2.4 **0 (A band)**, L2.2 **1.0 (A)**, L2.3 0 clean. Measured-slice grades all A; old-scope L2.1 12/14 = 0.857 (D band — see regressions).
- **brownfield-docs**: baseline **F** (§3c hard cap, L2.3=1). Post-fix: L2.3 **0 — the hard cap lifts**; link-gate C1 resolved (0 FP). Old-scope L2.1 13/14 = 0.929 (C band — see regressions).

## Regressions and no-moves (ship too — §3.3 honest-numbers)

| Finding | Numbers | Mechanism / disposition |
|---|---|---|
| `disconfirming-evidence-first` F1 | 0.9091 → **0.8889** (v1.1 channel) | The narrowing that FIXED its poem false-positive (n5 → none, precision 1.0) also lost the tone-check positive p4 ("Is the tone off? Only flag where…" → none) — the new no-objective-criterion boundary reads tone as subjective. Real trade, not variance. Filed for v0.20 (description nuance: tone-check WITH a stated criterion stays in-scope). |
| L2.1 old-scope, brownfield-api | 14/14 → **12/14** | §2 redundancy (3 commands duplicated across CLAUDE.md/AGENTS.md/base.md) + §8 (`research-synthesizer` ships `## Anti-patterns` instead of `## Gotchas`). Both are real, pre-existing template/generation quality gaps the baseline scorer read more leniently; single-run directional. Filed. |
| L2.1 old-scope, brownfield-docs | 12/12 → **13/14** (denominator differs: §14 pending) | §8 FAIL: the delta run regenerated `research-synthesizer` WITHOUT its Gotchas/Anti-patterns section (baseline copy had them) — a genuine generation regression this run. Filed. |
| §22 collision lint, brownfield-docs tree | — → **FAIL (2 boilerplate 4-grams)** | `confidence-calibration`↔`reversibility-check` ("the agent is about"), `second-order-thinking`↔`steelman` ("use on triggers like") — the pre-existing boilerplate collisions in skills W1 did not edit (known from the W1 report). Not routing-relevant utterances (L1.2 for those skills: 1.0), but the binary gate is right to flag them. Filed for v0.20 de-boilerplating. |
| `inversion` batched-channel FP | n1 → inversion (P 0.8 on v1.1; v1.0 channel clean) | One of the two paired-row disagreements; opposite-direction noise at the inversion/pre-mortem boundary. Not attributed as movement (headline stays the v1.0 rows). |
| New finding: scratchpad-path leak | research skills in both new trees cite the generation-time absolute `/private/tmp/...` prefix | Filed as a NEW defect for v0.20 (not a baseline-filed HD row; does not affect the delta claims). |
| New finding: `kit_version` self-report | new manifests record `0.18.0-H` (generator derives version from the newest CHANGELOG heading; [0.19.0] lands at wrap) | Mechanism note filed; §18a/§19a/§23a version gates keyed off it were scored applicable anyway (artifacts physically present, PASS either way). |

## Instrument freeze & attribution compliance

- HARNESS-SPEC v1.0 metric definitions, judge rubrics (`layer1/`), BENCHMARK-PROTOCOL, SCORECARD-FORMAT, fixtures + answer keys: **byte-unchanged vs `2a5c3f0` (the v0.18.0-H tip — the correct freeze reference; `21eab1d` predates the baseline-closeout commits of v0.18.0-H itself)** except the dated, append-only SPEC v1.1 Method addendum (36 insertions, 0 deletions; §3.1 dated-version rule followed). Verified adversarially: layer1/, layer2/, SCORECARD-FORMAT, fixtures/, and results/2026-07-03-baseline/ show zero delta-release changes.
- Prompt/variant sets: baseline's committed sets reused **verbatim** (no re-authoring; the delta runner has no paraphrase-author path). Fix agents were firewalled from `harness/results/**` and `harness/fixtures/**` — descriptions were never tuned to the test set; the W0 plan pre-registered expected movement per prompt, and the misses landed exactly on the pre-registered residuals.
- Operator answers, fixture SHA (`853c653`), models (Opus runner/scorers, Haiku router, Sonnet collector): identical to baseline.
- Baseline artifacts untouched: delta runners carry refuse-to-clobber guards; all delta output under `results/2026-07-03-delta/`.

## Cost of the re-measure (the ADJ-3 fix, measured on itself)

| Run | Tokens | Calls | Note |
|---|---|---|---|
| L1 v1.0-single claim rows (20 prompts) | 637,721 | 20 | 31.9k/call — the ADJ-3 constant confirmed |
| L1 v1.1-batched (decision 120 + naming 60 + L1.3 ~120 trials + controls 20) | 652,973 | 20 | the same surface ≈ **330+ calls ≈ 10M+** under the baseline's one-call-per-trial protocol |
| L2 both fixtures (generate+collect+score+assemble) | 1,356,782 | 10 | generator runs: api 320,118 / docs 344,742 (baseline: 328,446 / 308,393) |
| **W4 total** | **2,647,476** | **50** | **cap was ≤2.5M / ≤150 calls: token cap BREACHED by ~147k (5.9%)** — L2 targeted scorers ran heavier than the 1.2M estimate. Reported per §3.5: the cost architecture worked (23.7M-class run delivered for 2.6M), the estimate discipline still missed by 6% on one phase. Call cap held with 3× headroom. |
