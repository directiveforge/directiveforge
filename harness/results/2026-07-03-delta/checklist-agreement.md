# Checklist↔Harness Agreement — before/after hardening (v0.19.0 W2)

> **What this measures.** The v0.18 baseline exposed instrument circularity: `generator/VALIDATION_CHECKLIST.md` passed 12–14/14 applicable sections on three generator runs the harness graded F/F/B (HANDOFF "circularity threat empirically confirmed"). W2 hardened the checklist (new §0 instrument-validity note + mechanical §18–§23, traceability table in-file), then re-scored the SAME three frozen baseline trees. Acceptance: the hardened checklist must FAIL the two harness-F runs. Frozen trees untouched (read-only scoring; scratch in mktemp).
>
> Method: three independent Opus scorers (one per tree), fresh context, executing §18–§23 verbatim against `harness/results/2026-07-03-baseline/<fixture>/generated/` with pre-state = `harness/fixtures/<fixture>/repo/`. Old-checklist figures taken from the frozen baseline scorecards, not recomputed. Single-run, directional.

## Agreement table (section level)

| Tree | Harness grade (baseline) | OLD checklist | HARDENED checklist | Failing sections → matching harness defect |
|---|---|---|---|---|
| greenfield-next | **B** (L2.6 W=1: A1 phantom routes ⚠) | 13/13 PASS | **FAIL** | §21 (6 unresolved sibling routes = defect A1 / HD-7) · §22 (pre-W1 description collisions = HD-1/2 class) |
| brownfield-api | **F** (L2.4 count=4: Heroku propagation) | 14/14 PASS | **FAIL** | **§19(b) self-contradiction = the exact L2.4/HD-5 defect** (flagged `tech-debt.md:31`, asserted un-flagged `deploy.md:3/25/33/39`, `PHASE9-REPORT.md:4-5`) · §21 (9 routes) · §22 · §18(b) (see note 2) |
| brownfield-docs | **F** (L2.3 count=1 hard-cap + L2.6 🚨 C1) | 12/12 PASS | **FAIL** | **§18(b) = the exact L2.3/HD-4 defect** (README.md rewritten in place, 2 deleted lines, no backup) · **§20 = the exact 🚨 C1/HD-6 defect** (tree's own link-gate: 3 FPs + exit 0 on the micro-corpus) · §21 (7 routes) · §22 |

**Before:** checklist agreed with the harness on 0/3 trees (all PASS vs F/F/B-with-filed-defects).
**After:** hardened checklist fails 3/3 — both F-runs fail on exactly their F-defect classes; the B-run fails on its two real filed defects (HD-7 routes, HD-1/2 collisions), which is stricter than the letter grade but consistent with the filed-defect record. Acceptance met: no F-graded run passes the hardened checklist.

## Item-level detail

| Section (item) | greenfield-next | brownfield-api | brownfield-docs |
|---|---|---|---|
| §18(a) audit-trail file | N/A-by-version | N/A-by-version | N/A-by-version |
| §18(b) ground-truth backup | PASS (only append-only .gitignore) | FAIL (.env.example comment line rewritten, no backup — note 2) | **FAIL (README.md, the HD-4 defect)** |
| §19(a) quarantine block | N/A-by-version | N/A-by-version | N/A-by-version |
| §19(b) self-contradiction | PASS (no drifted claims) | **FAIL (Heroku, the HD-5 defect: 6 un-flagged assertion sites)** | PASS (vacuous) |
| §20 gate self-test | N/A (no link gate in tree) | N/A (no link gate in tree) | **FAIL (1 real + 3 FP + exit 0, the HD-6 defect)** |
| §21 route resolution | FAIL (6 phantom routes, incl. `pre-mortem`→`disconfirming-evidence-first`) | FAIL (9 routes: `council-3-voice` ×6, `bayesian-update`, `cost-of-inaction` ×2) | FAIL (7 `council-3-voice` routes) |
| §22 collision lint | FAIL (3+ trigger collisions, pre-W1 descriptions) | FAIL (8 4-grams; 2 substantive trigger collisions) | FAIL (18 4-grams) |
| §23(a) pack-gate log | N/A-by-version | N/A-by-version | N/A-by-version |
| §23(b) verbatim opt-out | PASS (vacuous; KB-08 decline logged in prose with quote) | PASS (vacuous) | PASS (vacuous) |

## Notes (honest caveats)

1. **Version gating behaved as designed.** All three baseline trees record `kit_version: 0.17.0` in `.ai-kit-manifest.json` (the baseline runs used the then-current generator), so §18(a)/§19(a)/§23(a) resolve N/A-by-version and the verdicts ride on the version-independent (b)/ground-truth clauses. Post-v0.19.0 trees will be held to the (a) clauses too.
2. **One stricter-than-harness finding, reported not hidden:** §18(b) flags brownfield-api's `.env.example` (one comment line replaced in place, no `.backup`; the same edit also appended the three intended missing vars). The baseline harness L2.3 scored this tree 0 — the harness read the edit under the Phase-4 merge/append protocol; §18(b)'s letter (deleted-lines>0 AND no backup) is stricter. Either reading is defensible; the hardened item errs toward the data-loss-safe side. This does NOT affect the agreement claim: brownfield-api's FAIL is independently driven by §19(b).
3. **§22 noise floor:** beyond the substantive trigger collisions, the lint also fires on template-boilerplate spans ("fires on phrases like", "the agent is about"). The in-file HONESTY SCOPE NOTE already scopes §22 as a necessary-not-sufficient proxy; boilerplate hits are real 4-gram collisions per the mechanical rule. Post-W1 template descriptions were de-collided for the routing-relevant pairs (W1 commit `ab147a0`).
4. §20's micro-corpus test ran each tree's OWN gate (brownfield-docs' improvised cwd-relative command), not the new canonical `check-links.py` — the test validates the instrument that tree actually shipped.

## Traceability

HD-row → checklist-item mapping lives in `generator/VALIDATION_CHECKLIST.md` (in-file traceability table, v0.19.0). Scorer transcripts: session artifacts (W2, 2026-07-03); deciding command outputs quoted in the JSON blocks above are reproducible from the frozen trees.
