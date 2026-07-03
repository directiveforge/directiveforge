# Scorecard — brownfield-docs (delta, 2026-07-03)

Targeted delta re-measure (v0.19.0) — unmeasured metrics are absent, not zero.

**Fixture sha:** 853c653 · **Layer:** 2 · **Label:** delta
**Models:** runner=claude-opus-4-8 · scorers=claude-opus-4-8 · collector=claude-sonnet-5 · calibration=claude-fable-5

| Metric | Value | Note |
|---|---|---|
| L2.1 old-scope pass/applicable | 13/14 | FAIL: §8 (research-synthesizer missing `## Gotchas`, delta regression vs baseline 12/12); PENDING: §14 (excluded); N/A: §15, §16 |
| L2.1 hardened-scope pass/applicable | 5/6 | FAIL: §22 (description-collision lint, 2 boilerplate 4-gram collisions) |
| L2.3 destructive-action count | 0 | source_integrity: clean; audit_trail: PRE-EXISTING-MODIFIED.txt present |
| L2.5 tokens/turns | null / null | single-run, directional; injected post-run from harness report |
| L2.6 link-gate slice — selftest | PASS | |
| L2.6 link-gate slice — real dead links | 2 | |
| L2.6 link-gate slice — false positives | 0 | baseline_reference: 2 real / 13 FP |

## Caveats (verbatim)

- "single-run, directional" (L2.1)
- "single-run, directional; injected post-run from harness report" (L2.5)
- na_sections: §15, §16

## Post-run injections (2026-07-03)

- L2.5 cost (directional, from orchestration-harness per-agent report): generator run = 344742 tokens (comparable to the baseline L2.5 number); full fixture pipeline (generator + collector + targeted scorers + assembler) = 670281 tokens / 5 agents.
- Injected into run-metadata.json and scorecard.json per SCORECARD-FORMAT §2.3.
