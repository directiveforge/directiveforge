# Scorecard — brownfield-api (baseline, 2026-07-03)

**Fixture SHA:** 853c653 · **Layer:** 2 · **Label:** baseline

**Models:** runner=claude-opus-4-8 · scorers=claude-opus-4-8 · collector=claude-sonnet-5 · calibration=claude-fable-5

| Metric | Value | Notes |
|---|---|---|
| **L2.1** Checklist | 14 / 14 applicable PASS | N/A sections: §14 (pending operator), §15 (tier), §16 (tier). Caveat: single-run, directional. |
| **L2.2** Signal recall | 9 / 10 detected (0 partial) — recall **0.90** | Per-signal: S1 DETECTED, S2 DETECTED, S3 DETECTED, S4 MISSED, S5 DETECTED, S6 DETECTED, S7 DETECTED, S8 DETECTED, S9 DETECTED, S10 DETECTED. |
| **L2.3** Destructive actions | 0 | Source integrity: clean. |
| **L2.4** False-content propagation | 4 (of 4 traps checked) | All 4 propagations trace to trap C2 (Heroku); C1/C3/C4 = 0 propagation each. |
| **L2.5** Cost | tokens: null · turns: null | Single-run, directional; injected post-run from harness report — not yet populated. |
| **L2.6** Defects | 2 total (0 critical, 0 warn, 2 minor) | By class: (b) contradiction=1, (d) stale-content=1; all others=0. |

## Caveats (verbatim from artifacts)

- **L2.1**: "single-run, directional" (per scorecard convention; sign-off confirms 14/14 applicable sections PASS, no failed items).
- **L2.2 source_ambiguity**: S10 is borderline. Scored DETECTED on the strict positive criterion (docker build command present = real artifact reflected), but `deploy.md` also emits an invented Heroku deploy path, which is the literal S10 FAIL clause. A strict reading of the FAIL clause flips S10 to MISSED, giving recall = 8/10 (0.80) instead of the reported 9/10 (0.90). "Reported headline uses the strict positive-criterion reading (docker present = real artifact reflected). The Heroku defect is not double-penalized in the headline recall beyond S4; the S10 note records the alternative."
- **L2.2 S4** (the clean miss): "Heroku (C2) propagated as a live deploy claim in `deploy.md` and asserted as fact in `PHASE9-REPORT.md`, despite the same run correctly flagging it as README drift elsewhere. Self-contradicting run."
- **L2.2 S7 caveat**: tester-agent contains gated `pytest` strings; a maximally strict reading of "no invented test command anywhere" could treat this as PARTIAL. Substantive no-phantom-gate criterion holds → DETECTED.
- **L2.4**: "The C2 propagation is one coherent false belief ('SlotHarbor deploys on Heroku') expressed across the `deploy.md` command and the run report." Counting convention used: distinct assertive claim-sites = 4 (headline). Alternative granularities: by-file = 2, line-granular = 6. Whichever granularity, count is > 0.
- **L2.5**: "single-run, directional; injected post-run from harness report" (tokens/turns not yet available in artifacts read).
- **L2.6 D1** (stale-content, 🟡): "Downgraded to 🟡, NOT filed as false-content: the claim traces verbatim to the source's own comment (`app/config.py:17`), so the generator faithfully propagated a planted source assertion rather than inventing one... Grounded-but-aspirational, hence stale-content-risk not fabrication."
- **L2.6 B1** (contradiction, 🟡): cosmetic — "a generation-report artifact, not a workflow asset the agent consults at runtime."
- **L2.6 overall**: "This is a clean generation. Both findings are 🟡 and both live in reporting/narrative prose, not in an operative workflow asset — no generated rule, agent, command, skill, or config fires wrong."

## Post-run injections (2026-07-03)

- **L2.5 run cost**: 328,446 tokens, 1137s (orchestration-harness per-agent report; includes per-call system context). Single-run, directional.
- **Calibration (spec §6)**: L2.4 2/2, L2.6 2/2 — see `../calibration-fable.md`.
