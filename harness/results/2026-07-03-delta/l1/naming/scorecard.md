# L1 delta scorecard — naming pack (targeted re-measure, v0.19.0 W4)

> Scope: **L1.2 only** (HD-3) — L1.1/L1.4 not re-measured; L1.3 remains deferred (baseline
> spend-breaker adjudication ADJ-1 stands). Spec v1.1 batched channel; prompt sets = baseline's,
> reused verbatim.

| Metric | Value | Notes |
|---|---|---|
| L1.2 pack micro (v1.1-batched-K15) | **F1 1.0** (TP 30, FP 0, FN 0) | baseline 0.9667 |
| L1.2 `name-generation` | **F1 1.0** (P 1.0, R 1.0) | baseline 0.8889 — HD-3: "brief exists" precondition boundary |
| L1.2 `naming-brief` | F1 1.0 | baseline 1.0 — no regression from the boundary edit |
| L1.2 other 4 skills | F1 1.0 each | unchanged descriptions; baseline 1.0 |

## Caveats (verbatim)

- "Method note (spec v1.1, 2026-07-03): batched channel; equivalence block lives in ../decision/scorecard.json (same run, same channel, controls exact)."
- "HD-3 movement (name-generation f1 0.8889->1.0) is measured on the batched channel only — per SPEC v1.1 rule 4b it ships alongside the run's equivalence block rather than a v1.0 re-measure; treat as strongly-supported directional."
- "single re-measure run; stochastic router."

## Post-run injections (2026-07-03)

- Run cost: included in the shared v1.1-batched run (652,973 subagent tokens / 20 calls total across decision+naming+L1.3+controls; see ../decision/scorecard.md).
- No recorder agents; main session wrote artifacts verbatim from the workflow return (`../runB-v1.1-batched.json`).
