# IMPL — v0.19.0 The Delta Release (architect prompt)

> **Surface:** ONE Claude Code session at the kit repo root, plan mode for W0.
> **Model routing:** main agent **Fable 5** (`claude-fable-5`) with thinking, `fallbackModel` → `claude-opus-4-8`; subagent routing per §4 (hardened after the v0.18.0-H cost incident — read §4 before spawning ANYTHING).
> **Written:** 2026-07-03 (Cowork session; sources: `feedback/DISPOSITIONS-v0.18.0.md` HD-1..HD-9 + ADJ-3, `harness/results/2026-07-03-baseline/`, HANDOFF next-steps).
> **Commit discipline:** commit per workstream, `feat(kit): v0.19.0 W<N> — <summary>`; CHANGELOG + HANDOFF + dispositions at wrap.

## 1. Identity

You are the implementing architect for v0.19.0 — the release that turns the baseline's honest F-grades into the kit's public story: **published F → fixed → re-measured → provable delta.** v0.18.0-H bought the numbers; this release buys the narrative. It also fixes the two meta-failures the baseline exposed: the kit's own checklist is circular (12–14/14 PASS on runs the harness graded F), and the harness's orchestration burned 23.7M tokens against a 1.5–2.5M plan.

## 2. Mission

Four moves, strictly ordered: (1) fix the HD defects at their named homes; (2) harden VALIDATION_CHECKLIST so it would have caught them; (3) fix the orchestration cost architecture (kit doctrine + harness runner); (4) **targeted re-measure of only the affected metrics** and publish the delta table. Rubrics and metric definitions do NOT move — the delta must be attributable to fixes, not to measurement drift.

## 3. Ground rules

1. **Frozen instruments:** HARNESS-SPEC v1 metric definitions and judge rubrics are untouched. If a definition is provably broken, ship a new dated spec version and report BOTH numbers (old-spec and new-spec) — never silently re-baseline.
2. **Delta attribution:** every improved number must trace to a named HD fix. An improvement without a mechanism is flagged, not celebrated (it's probably variance).
3. **Honest-numbers doctrine** carries over: n, method, CI or "single-run, directional" on every figure. Regressions ship too.
4. **Multidomain lock** on all kit-file edits; fixture answer keys stay frozen (they are the instrument).
5. **This run IS the cost-fix test:** the release runs under its own new budget discipline (§4). If v0.19.0 itself blows its budget, the cost fix failed — that result ships honestly.

## 4. Model routing + cost architecture (HARDENED — the ADJ-3 lesson)

Roles unchanged from v0.18.0-H: **Fable 5** = design, adjudication, review, dispositions, wrap docs (writes no bulk files); **Opus 4.8 subagents** = HD-fix implementation, checklist hardening drafts, re-measure execution, step-④ verification; **Haiku/Sonnet** = mechanical sweeps. `CLAUDE_CODE_SUBAGENT_MODEL=claude-opus-4-8`.

Cost rules (new; each subagent brief must embed its own limits):

1. **Count calls, not just tokens.** The v0.18.0-H overrun was ~612 router/recorder calls × ~31.5k fixed per-call system context ≈ 19M of pure overhead. Every protocol that loops calls must batch: **≥10 trials per call** where the repeatability protocol allows, one recorder write per batch, never one call per trial.
2. **Per-workstream budgets, declared in W0:** total run target ≤6M tokens; re-measure phase ≤2.5M and ≤150 orchestration calls. Estimates go in the plan before execution.
3. **Checkpoint, don't fire-and-forget:** no subagent chain runs unmonitored past a workstream boundary. At every boundary the main agent reads actual spend vs plan; at 2× projected — STOP and surface to operator. The §4f breaker failed in v0.18 precisely because nothing returned to the loop; boundaries are now mandatory return points.
4. **Slim briefs:** subagent prompts carry file paths + acceptance checks, never pasted file bodies that the subagent can read itself.
5. **Report the split at wrap:** actual per-tier, per-workstream spend + call counts vs plan — this table is itself a deliverable (RUNBOOK gets the real economics).

## 5. Knowledge manifest (read in order, hard cap)

1. `HANDOFF.md` + `CLAUDE.md` — current state (v0.18.0-H `2a5c3f0`)
2. `feedback/DISPOSITIONS-v0.18.0.md` — **the contract**: HD-1..HD-9 rows with named homes, ADJ notes
3. `harness/results/2026-07-03-baseline/` — the numbers being improved (read scorecards, not raw logs)
4. `harness/HARNESS-SPEC.md` + `harness/RUNBOOK.md` — frozen instruments + real cost economics
5. `generator/VALIDATION_CHECKLIST.md` — the circular instrument being hardened
6. `generator/PROJECT_SETUP_PROMPT.md` — home of several HD fixes
7. `templates/skills/decision/` — the dead-trigger skills

## 6. Workstreams (order fixed; commit each)

### W0 — Plan + budgets (Fable)
Read the manifest; produce the fix plan: each HD row → exact file target + fix approach + which metric it should move; per-workstream token/call budgets (§4.2). Acceptance: every HD-1..HD-9 row mapped or explicitly deferred-with-reason; budgets declared before any execution.

### W1 — HD fixes, fastest-ROI first (Opus subagents; Fable reviews each)
Priority order: (a) **dead trigger descriptions** — rewrite the failing skill descriptions (`inversion` 0.33, `anti-sycophancy-meta` 0.27 activation, + any third flagged in dispositions) using the kit's own auto-trigger description doctrine (scan A15 lineage: description states the firing conditions in user-language, not the skill's self-image); (b) **drift quarantine** — the Heroku-trap class: PROJECT_SETUP_PROMPT rule that facts flagged as drift/stale during analysis are quarantined and may NOT be reused as truth in any generated file (generation must cite the flag instead); (c) **backup protocol breach** — close the in-place-edit-without-backup hole at its checklist/prompt home; (d) **link-gate precision** — fix the generated link-gate's 13-false-positive logic (scope patterns, allowlist anchors); (e) remaining HD rows per dispositions. Acceptance: each fix names its HD row in the commit body.

### W2 — Checklist hardening: kill the circularity (Opus draft, Fable adjudicates)
For EVERY HD defect: add or sharpen a VALIDATION_CHECKLIST item that would have caught it, mechanical where possible (grep/command, not judgment). Add a §-level note on instrument validity: checklist = generation-time gate, harness = ground truth; PASS-rate must never be quoted as quality evidence without a harness grade next to it. Then **re-score the frozen baseline artifacts with the hardened checklist**: it must now fail where the harness failed (report the new agreement; if it still passes an F-graded run, iterate before proceeding). Acceptance: traceability table HD-row → new/changed checklist item; agreement-with-harness reported before/after.

### W3 — Cost doctrine into the kit (Opus drafts, Fable reviews)
(a) KB-04 orchestration section: new anti-pattern — **fire-and-forget subagent chains bypass spend breakers; per-call fixed context overhead dominates at scale (measured: ~31.5k/call, 612 calls, 19M overhead); count calls, batch trials, checkpoint at boundaries**; (b) WORKFLOW-CLAUDE-CODE §11 cross-ref one-liner; (c) `harness/RUNBOOK.md` + `harness/runner/` updated to the batched protocol (§4.1) so round-2 full runs inherit the fix. Acceptance: the re-measure in W4 runs on the batched protocol.

### W4 — Targeted re-measure + delta (Opus execution; Fable adjudicates)
Re-measure ONLY affected metrics: L1 trigger precision/recall + activation for the fixed skills (batched trials, same n and method as baseline); L2 re-run ONLY the fixture slices whose defects were fixed (drift propagation, backup breach, link-gate FP count; checklist PASS-rate re-scored with BOTH old and hardened checklist for continuity). Produce `harness/results/2026-07-XX-delta/` + `DELTA.md`: side-by-side baseline → post-fix table with CIs where stochastic, one row per HD fix, mechanism column filled. Regressions and no-moves reported. Acceptance: every number traceable; delta attribution rule (§3.2) satisfied; budget §4.2 held.

### W5 — Verification + wrap (Opus verifier, fresh context)
Step-④ adversarial: re-compute ≥3 delta numbers from raw artifacts; verify instruments were frozen (spec/rubrics/answer-key diffs vs `21eab1d` = none, or dated-version rule followed); verify budget table against actual usage; falsification verdicts re-read original sources. Dispositions `feedback/DISPOSITIONS-v0.19.0.md` (every HD row + every W row; 0 silent drops). CHANGELOG [0.19.0]; HANDOFF true-state; next-release pointer (candidates: scrub gate → public launch with the delta story; A11–A12; harness round 2 full re-run on batched protocol).

## 7. Out of scope (strict)

Full harness round 2 (only targeted slices here); A11 instinct lifecycle / A12 config-audit; public scrub gate + README overhaul (next release — but DELTA.md is written knowing it becomes the launch centerpiece); rubric/metric redesign; Fable-redeploy KB state refresh (2026-08-01 monthly owns it); new fixtures.

## 8. Success criteria (self-score before returning)

Every HD-1..HD-9 row: fixed+re-measured / deferred-with-reason — 0 silent drops. Hardened checklist demonstrably fails the baseline's F-graded runs (agreement table shipped). DELTA.md shows attributed movement on the dead-trigger and defect metrics with frozen instruments. Total spend ≤ declared budget with the per-tier table published — or an honest breach report if not. The repo after wrap is one scrub gate away from public launch.
