# L1 delta scorecard — decision pack (targeted re-measure, v0.19.0 W4)

> Scope: **L1.2 + L1.3 only** — L1.1/L1.4 not re-measured (absent, not zero). Baseline for
> comparison: `results/2026-07-03-baseline/l1/decision/`. Spec v1.1 (Method addendum: batched
> router channel); metric definitions unchanged from v1.0. Prompt/variant sets = the baseline's
> committed sets, reused verbatim (no re-authoring).

| Metric | Value | Notes |
|---|---|---|
| L1.2 `inversion` (v1.0-single channel, claim row) | **F1 0.75** (P 1.0, R 0.6) | baseline 0.3333 — HD-1; misses = pre-registered residuals p1, p2 |
| L1.2 `anti-sycophancy-meta` (v1.0-single, claim row) | **F1 0.8889** (P 1.0, R 0.8) | baseline 0.5714 — HD-2; miss = pre-registered residual p3 (→ steelman) |
| L1.2 pack micro (v1.1-batched-K15, full pack) | **F1 0.9661** (TP 57, FP 1, FN 3) | baseline 0.9298; ships with equivalence block |
| L1.2 `disconfirming-evidence-first` (v1.1-batched) | F1 0.8889 (P 1.0, R 0.8) | baseline 0.9091 — **small regression, ships honestly**: poem FP (n5) FIXED by the no-objective-criterion boundary, but tone-check positive p4 now routes `none` (recall −1 row) |
| L1.3 `inversion` | **0.8333 [0.6644, 0.9266] n=30** | baseline 0.3333 [0.1923, 0.5122] — CIs do not overlap |
| L1.3 `anti-sycophancy-meta` | **0.8333 [0.6644, 0.9266] n=30** | baseline 0.2667 [0.1418, 0.4445] — CIs do not overlap |
| L1.3 headline (MIN over measured skills) | **0.8333** | baseline MIN 0.2667; other 10 skills' baseline values stand un-re-measured (0.9667–1.0) |

## Equivalence (SPEC v1.1 rule 3)

- **Controls on pinned baseline catalog (`2a5c3f0`), batched channel:** `10-10-10` F1 1.0 (baseline 1.0), `pre-mortem` F1 1.0 (baseline 1.0) — **exact reproduction; channel is the only variable, no drift detected.**
- **Paired rows, same (new) catalog, both channels:** 18/20 agree; both disagreements are `inversion` rows in opposite directions (p1 miss→hit, n1 clean→FP) — sampling noise at the inversion/pre-mortem boundary, not a systematic channel bias. `anti-sycophancy-meta` rows 10/10 identical.

## Caveats (verbatim)

- "Method note (spec v1.1, 2026-07-03): batched trials 15/call, independent-judgment instruction, JSON-array return, vs v1.0 one-prompt channel (ADJ-3 cost fix). Metric definitions unchanged."
- "HD-1/HD-2 L1.2 movement claims rest on the v1.0-single channel rows (same instrument as baseline)."
- "L1.3 movement (0.3333->0.8333, 0.2667->0.8333) measured on the batched channel; baseline vs delta Wilson CIs do not overlap ([0.1923,0.5122] vs [0.6644,0.9266]; [0.1418,0.4445] vs [0.6644,0.9266]) — the movement is an order of magnitude larger than any plausible channel effect bounded by the equivalence block."
- "single re-measure run per channel; stochastic router (Haiku); L1.2 per-skill numbers move within ~±1 prompt granularity (0.2 recall steps at n=5 positives)."
- "baseline prompt-set id typo preserved verbatim ('disconfirming-effidence-first-p4') — ids are opaque keys; scoring unaffected (reuse-verbatim rule)."

## Post-run injections (2026-07-03)

- Run cost (directional, from orchestration-harness per-agent reports): v1.0-single claim-row run = 637,721 subagent tokens / 20 calls (~31.9k/call — the ADJ-3 constant confirmed); v1.1-batched run (decision 120 + naming 60 + L1.3 interleaved rounds + controls) = 652,973 subagent tokens / 20 calls. The same 180-prompt L1.2 surface cost ~330 calls ≈ 10.4M-equivalent under the baseline's one-call-per-trial protocol.
- No recorder agents: workflow returned JSON; main session wrote all artifacts verbatim (HD-9 channel closed for delta-sized payloads). Raw returns: `runA-v1.0-single.json`, `runB-v1.1-batched.json` (key-count verified on write: 20/20 and 180/180 raw router outputs).
