# DISPOSITIONS — v0.19.0 "The Delta Release" (2026-07-03)

> Release-close accounting: every workstream row, every HD row from DISPOSITIONS-v0.18.0, every
> verifier finding, every new defect surfaced by the re-measure → an explicit disposition.
> **0 silent drops.** Contract: `prompts/dispatch/V0_19_0_ARCHITECT_PROMPT.md`; plan:
> `prompts/dispatch/V0_19_0_W0_PLAN.md` (see its provenance note). Delta evidence:
> `harness/results/2026-07-03-delta/DELTA.md` (adversarially verified, C1–C6 all CONFIRMED).

## Workstream rows

| W | Disposition | Commit |
|---|---|---|
| W0 plan + budgets | SHIPPED — HD map, budgets declared pre-execution, contract-contradiction (batching vs frozen method) surfaced + resolved via §3.1 dated-spec route | `a0a232f` |
| W1 HD fixes | SHIPPED — 6 fix agents' output reviewed by Fable (1 review catch: KB-05 §5.2 stale row contradicting the new convention — fixed in-commit); fix agents firewalled from harness/results+fixtures | `ab147a0` |
| W2 checklist hardening | SHIPPED — §0 validity note + §18–§23; frozen-tree re-score agreement 0/3 → 3/3 (both F-runs fail on exactly their F-defect classes) | `4181b90` |
| W3 cost doctrine + SPEC v1.1 + runners | SHIPPED — KB-04 §4.9 anti-pattern, WORKFLOW §11.6 x-ref, SPEC v1.1 append-only addendum, parameterized non-clobbering delta runners (Fable review catch: draft runner still authored paraphrases — removed; reuse-verbatim enforced) | `5d852fc` |
| W4 targeted re-measure + DELTA | SHIPPED — every baseline F-driver moved on frozen instruments; regressions shipped; W4 token cap breached 5.9% (ADJ-1) | `fafe766` |
| W5 verification + wrap | SHIPPED — fresh-context adversarial verifier: C1–C6 CONFIRMED (all headline numbers reproduced from raw artifacts); 5 findings dispositioned below (V1–V5) | this commit |

## HD rows (the v0.18.0 contract)

| HD | Disposition | Evidence |
|---|---|---|
| HD-1 `inversion` dead trigger | **FIXED + RE-MEASURED**: L1.2 F1 0.3333 → 0.75 (v1.0 channel, same instrument); L1.3 0.3333 [0.19,0.51] → 0.8333 [0.66,0.93], n=30, CIs non-overlapping | DELTA.md; `l1/runA*.json`, `l1/runB*.json` |
| HD-2 `anti-sycophancy-meta` dead trigger | **FIXED + RE-MEASURED**: L1.2 F1 0.5714 → 0.8889 (v1.0); L1.3 0.2667 [0.14,0.44] → 0.8333 [0.66,0.93]. Design question answered: first-responder convention, KB-05 §5.1.1 + §5.2 sync | same |
| HD-3 naming near-miss | **FIXED + RE-MEASURED**: `name-generation` F1 0.8889 → 1.0; pack 0.9667 → 1.0 (v1.1 channel + equivalence; SPEC v1.1 rule 4b) | `l1/naming/scorecard.json` |
| HD-4 backup breach | **FIXED + RE-MEASURED**: brownfield-docs L2.3 1 → 0 (hard F-cap lifts); backups hash-verified, `PRE-EXISTING-MODIFIED.txt` audit trail present + consistent | `brownfield-docs/l2.3-destructive.md` |
| HD-5 drift propagation | **FIXED + RE-MEASURED**: brownfield-api L2.4 4 → 0 (verifier re-grepped all 4 traps independently: every mention drift-flagged); L2.2 0.90 → 1.00; deploy.md derives from Dockerfile, Heroku explicitly rejected | `brownfield-api/l2.4-false-content.md` |
| HD-6 link-gate FPs | **FIXED + RE-MEASURED**: 13 FP/exit 0 → 0 FP, same 2 real dead links, exit 1; micro-corpus self-test PASS; verifier's independent full-tree resolver: 0 FP, 0 FN vs the gate | `brownfield-docs/l2.6-linkgate-slice.md` |
| HD-7 phantom routes | **FIXED + measure split**: fix shipped (PSP no-phantom-route + Phase 3.6 gate); mechanically verified on the new api tree (9 routes tier-fallbacked, §21 PASS). Full greenfield L2 re-measure **DEFERRED-with-reason**: not in the contract §6-W4 slice list; queued for harness round 2 | PSP Phase 3.5/3.6; `brownfield-api/l2.1-checklist-items.md` |
| HD-8 pack-gate precedence | **FIXED + measure split**: precedence rule + Phase 9 decision log shipped; §23 PASS on both new trees (all packs logged). Greenfield L2.2-S3 re-measure **DEFERRED-with-reason** (same) | PSP Phase 1.5/9 |
| HD-9 recorder truncation | **FIXED (protocol)**: delta runs use no recorder agents (workflow returns JSON, main loop writes verbatim; key-counts verified 20/20, 180/180); round-2 recorder briefs get key-count+byte-count echo rule (RUNBOOK §6 gotcha) | RUNBOOK; `l1-delta.workflow.js` |
| HD-10 .gitignore swallows | **RECORD-ONLY**: fixed in v0.18.0-H (`21eab1d`, `4a43ebf`); no recurrence in delta runs | — |

## Verifier findings (V) — fresh-context adversarial pass

| # | Finding | Disposition |
|---|---|---|
| V1 | Exact-residual pre-registration not repo-auditable (W0 plan was outside the repo; W0 commit records direction+ranges only) | **ACCEPTED**: DELTA.md carries an auditability note; plan committed at wrap with provenance note (`V0_19_0_W0_PLAN.md`); claim downgraded to operator-attested. **Lesson locked: W0 plans commit at W0.** |
| V2 | "Ceded to asm" imprecise — inversion's residual misses leak to pre-mortem (p1) / steelman (p2), not asm | **FIXED in DELTA.md** (mechanism cell corrected) |
| V3 | `l2.3-destructive.md` prose says fixture DECISIONS.md = 3761 bytes; actual 3781 (verdict unaffected — startswith re-verified) | **ERRATUM recorded here**; measurement artifact left as-committed (post-hoc edits to scorer output are worse than a filed erratum) |
| V4 | SPEC v1.1 rule-2 interleave not auditable from artifacts (trials carry no call/batch id) | **DEFERRED → harness round 2**: delta runner to record batch ids per trial; CIs already flagged nominal |
| V5 | Freeze-reference commit in the contract/DELTA prose was `21eab1d`; correct reference = `2a5c3f0` (v0.18.0-H tip) | **FIXED in DELTA.md**; freeze verified clean vs `2a5c3f0` |

## New findings from the re-measure (v0.20 queue — the delta run is itself a harness run)

| # | Finding | Disposition |
|---|---|---|
| N1 | Research skills in both new trees leak the generation-time absolute scratchpad path (`/private/tmp/...`) and cite not-yet-created exemplar docs (hedged, so not a §17 FAIL — but operator-hostile) | FILED → v0.20: PSP portability rule (generated files never embed the generator's own working paths) |
| N2 | `kit_version` self-reports `0.18.0-H` in new manifests — the generator derives version from the newest CHANGELOG heading, and `[0.19.0]` lands only at wrap; §18a/§19a/§23a version gates key off it | FILED → v0.20: derive version from a dedicated kit-version source (or PSP notes the wrap-lag); this release: gates scored applicable anyway, artifacts present, PASS either way |
| N3 | `disconfirming-evidence-first` F1 0.9091 → 0.8889: poem-FP fixed but tone-check positive p4 lost to the new no-objective-criterion boundary | FILED → v0.20: description nuance (tone-check WITH stated criterion stays in-scope). Honest trade, shipped in DELTA regressions |
| N4 | `research-synthesizer` generated without `## Gotchas` (api: ships `## Anti-patterns` instead — template heading mismatch vs checklist §8; docs delta run: dropped the section entirely — generation regression) | FILED → v0.20: align template heading with §8, or §8 accepts the Anti-patterns equivalent; investigate the docs-run drop |
| N5 | §22 collision lint FAILs on boilerplate 4-grams in skills W1 didn't edit (`confidence-calibration`↔`reversibility-check`, `second-order-thinking`↔`steelman`, + naming trio noted in W1a2 report) | FILED → v0.20: de-boilerplate the remaining descriptions (routing-irrelevant but the binary gate is right to flag) |
| N6 | §2 redundancy FAIL on new api tree: 3 identical commands duplicated across CLAUDE.md/AGENTS.md/base.md | FILED → v0.20: PSP single-home rule for command duplication across the generated trio |

## Adjudications

| # | Call | Record |
|---|---|---|
| ADJ-1 🚨 | **W4 token cap breached: 2,647,476 vs ≤2.5M (+5.9%)**; call cap held (50/150). Contract §3.5: "if v0.19.0 blows its budget, the cost fix failed — ships honestly." Verdict: the cost *architecture* worked (a 23.7M-class measurement surface delivered for 2.65M — ~9× reduction; per-call constant confirmed at 31.9k); the *estimate* discipline missed on L2 targeted-scorer weight (~0.4M under-estimated). Total release spend 3.95M ≤ 6M hard cap with 2.05M headroom — the boundary checkpoints held everywhere else | spend table below; RUNBOOK §1 |
| ADJ-2 | Greenfield L2 not re-run (HD-7/HD-8 measurement deferred): the contract §6-W4 enumerates the three defect slices (drift, backup, link-gate); greenfield was B-grade; budget cap | queued: harness round 2 |
| ADJ-3 | Contract-internal contradiction (§4.1 mandatory batching vs §3.1 frozen "what was measured or how" + §6-W4 "same method") resolved via the §3.1 escape hatch: dated SPEC v1.1 Method addendum; headline claims measured on v1.0 channel; both numbers ship | HARNESS-SPEC v1.1; DELTA.md |
| ADJ-4 | Workflow `args` reached scripts as a JSON string, not an object (both delta runners' guards threw on first launch) | runners now normalize (`JSON.parse` fallback); RUNBOOK Step C-bis documents it |

## Spend accounting (declared W0 → actual; subagent tokens / orchestration calls)

| WS | Plan | Actual | Calls (plan → actual) |
|---|---|---|---|
| W0 | 0.35M | 324,066 | 4–5 → 4 (Explore ×3 + Plan ×1, session-model) |
| W1 | 0.8M | 359,409 | 12–16 → 4 (Opus) |
| W2 | 1.0M | 337,099 | ~10 → 4 (Opus) |
| W3 | 0.5M | 168,688 | ~6 → 2 (Opus) |
| W4 | 2.45M (cap 2.5M) | **2,647,476 — cap breach +5.9% (ADJ-1)** | ~50 (cap 150) → 50 |
| W5 | 0.3M | 112,066 (verifier) | 2–3 → 1 (Opus) |
| **Total** | **≤5.4M declared / 6M hard cap** | **3,948,804 (66% of declared)** | 85–100 → **65** |

Per-tier: Opus 2,105,816 / 17 calls · Haiku 1,290,694 / 40 calls (routers; 31.9k/call measured) · Sonnet 228,228 / 4 calls · session-model planning agents 324,066 / 4 calls. Baseline comparison: the v0.18.0-H harness run spent **23.7M / ~655 agents**; this release fixed the defects AND re-measured the affected surface for **3.95M / 65 calls total**.

## Totals

6 W-rows SHIPPED · 10 HD rows: **6 fixed+re-measured, 2 fixed+measure-deferred-with-reason, 1 fixed-protocol, 1 record-only** · 5 verifier findings (2 fixed in-wrap, 1 erratum, 1 deferred-with-home, 1 accepted+lesson) · 6 new findings FILED for v0.20 · 4 adjudications recorded (1 honest budget breach) · **0 REJECTED · 0 silently dropped.**
