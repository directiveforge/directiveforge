# Judge Calibration Record — Fable 5 re-judge (HARNESS-SPEC §6)

> Calibrator: Fable 5 (`claude-fable-5`, main session agent) · Date: 2026-07-03 · Items: 15/15 (cap met)
> Stratification: 5 × L1.4, 6 × L1.2, 2 × L2.4, 2 × L2.6. Selection rules stated per block below —
> deterministic and recorded BEFORE looking at any per-item original verdict.
> Blindness grades per block are reported honestly: not all blocks reached full per-item blindness;
> each deviation is documented rather than smoothed over.

## Block 1 — L1.4 rubric re-judge (5 artifacts, 20 dimension scores; BLIND)

Selection rule: decision pack alphabetical indices 1, 4, 7, 10 + design pack index 0.
Calibrator read only the artifact + the frozen rubric (judge-rubrics.md §2a), scored all 4 dimensions,
THEN extracted the Opus scores. Pack-level means had been seen beforehand (unavoidable — they were in
the workflow summary); per-artifact/per-dimension scores had not.

| Artifact | Fable (A/S/F/C) | Opus (A/S/F/C) | Exact | ±1 |
|---|---|---|---|---|
| decision/anti-sycophancy-meta | 5/2/5/5 | 5/1/5/5 | 3/4 | 4/4 |
| decision/cost-of-inaction | 5/5/5/5 | 5/5/5/5 | 4/4 | 4/4 |
| decision/pre-mortem | 5/5/5/5 | 5/5/5/5 | 4/4 | 4/4 |
| decision/second-order-thinking | 5/5/5/5 | 5/5/5/5 | 4/4 | 4/4 |
| design/design-architect | 5/4/5/5 | 5/5/5/5 | 3/4 | 4/4 |

**Exact agreement 18/20 (0.90) · ±1 agreement 20/20 (1.00).** The only disagreements are one-notch,
both on scope_calibration. Notably, calibrator and judge **independently converged on the same single
defect** — anti-sycophancy-meta matching the orchestrator-style anchor (Fable 2 vs Opus 1) — which is
evidence the rubric discriminates rather than that the judge flatters. Leniency hypothesis (raised by
the 4.88–5.0 pack means): NOT supported; the high means reflect artifacts that genuinely match the
5-anchors, and the one anchor-defect present was caught by both judges.

## Block 2 — L1.2 router re-judge (6 items)

### 2a. Adversarial probe (4 items; item-blind, selection deliberately biased)

Selection rule: the `-p3` positive prompt of the three weakest-F1 skills + one clean skill.
This OVERSAMPLES known-weak skills by design — it probes the failures, it does NOT estimate router
quality. Do not read 1/4 as an unbiased agreement rate.

| Prompt | Haiku fired | Fable (blind) | Author label | Fable vs router | Fable vs label |
|---|---|---|---|---|---|
| inversion-p3 | pre-mortem | inversion | inversion | ✗ | ✓ |
| anti-sycophancy-meta-p3 | steelman | anti-sycophancy-meta | anti-sycophancy-meta | ✗ | ✓ |
| steelman-p3 | steelman | steelman | steelman | ✓ | ✓ |
| name-generation-p3 | naming-brief | name-generation | name-generation | ✗ | ✓ |

**Interpretation:** where the cheap router diverges, it diverges from BOTH the stronger judge and the
ground-truth labels, and only on the skills L1.2/L1.3 already flag. The weak trigger scores are real
description-level routing failures, not judge noise. The spec §6 invalidation clause (>1/3 systematic
disagreement) presumes a representative subsample; this block is deliberately adversarial and sides
with ground truth, so it corroborates the metric instead of invalidating it. Recorded openly.

### 2b. Random subsample (2 items; BLIND)

Selection rule: fixed indices — decision `raw_router_outputs[17]`, design `raw_router_outputs[13]`.

| Prompt | Haiku fired | Fable (blind) | Agreement |
|---|---|---|---|
| anti-sycophancy-meta-n3 (expected none) | none | none | ✓ |
| design-engineer-p4 (expected target) | design-engineer | design-engineer | ✓ |

**Random agreement 2/2.** On non-adversarial items the router is reliable.

## Block 3 — L2.4 false-content re-judge (2 items; VERIFICATION-GRADE, not blind)

Honesty note: the calibrator had read the scorer's trap-by-trap reasoning before re-judging these
items (sequencing error, documented rather than hidden). These are independent verifications of the
verdicts against the raw trees, not blind re-judgments.

| Item | Scorer verdict | Fable verification | Agreement |
|---|---|---|---|
| brownfield-api `deploy.md:3` ("Production releases happen via Heroku auto-deploy") | counted +1 | Assertive, unhedged; fixture has Dockerfile only, no Procfile → correctly counted | ✓ |
| brownfield-api `AGENTS.md:15` ("Deployment: Docker … README also names Heroku") | not counted | Attribution to README, primary claim is Docker → correctly not counted (borderline, scorer flagged it as such) | ✓ |

## Block 4 — L2.6 defect re-judge (2 items; evidence RE-EXECUTED)

Method: the finding text was read (necessary to know what to check), then the evidence was re-derived
by executing the quoted commands against the committed trees — stronger than agreement-by-reading.

| Item | Reviewer verdict | Fable re-derivation | Agreement |
|---|---|---|---|
| brownfield-docs C1 🚨 (link-health gate resolves docs/-relative links from repo root → false verdicts) | 🚨 real | Re-ran the gate command verbatim from the generated tree root: 13 DEAD LINK lines; the 2 genuinely dead links indistinguishable from 9 healthy playbook links + 2 template paths. Confirmed exactly. | ✓ |
| greenfield A1 ⚠ (Starter 5-skill install ships full-catalog routes to non-installed skills) | ⚠ real | `ls .claude/skills/decision/` → 5 skills; `anti-sycophancy-meta/SKILL.md:18,26,43` routes to `disconfirming-evidence-first`; router rule line 40 confirms it is an Intermediate graduation add. Confirmed. | ✓ |

## Aggregate (published in scorecards)

- **L1.4:** exact 18/20 (0.90), ±1 20/20 (1.00) — blind.
- **L1.2:** random 2/2; adversarial probe vs router 1/4, vs author labels 4/4 (biased-by-design, diagnostic).
- **L2.4:** 2/2 (verification-grade). **L2.6:** 2/2 (evidence re-executed).
- **Invalidation check (spec §6):** no metric shows systematic judge unreliability on representative
  items; no run invalidated. The concentrated router disagreement is the finding the metric exists to
  surface (weak trigger descriptions), filed as defects in DISPOSITIONS-v0.18.0.
