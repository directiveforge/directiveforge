# Scorecard — brownfield-api (2026-07-03, delta)

Targeted delta re-measure (v0.19.0) — unmeasured metrics are absent, not zero.

**Fixture SHA**: 853c653
**Models**: runner=claude-opus-4-8, scorers=claude-opus-4-8, collector=claude-sonnet-5, calibration=claude-fable-5

| Metric | Value | Notes |
|---|---|---|
| L2.1 old-scope (§1–§17) | 12/14 applicable PASS | N/A: §14 (pending operator), §15, §16 |
| L2.1 hardened-scope (§18–§23) | 5/5 applicable PASS | N/A: §20 |
| L2.2 planted-signal recall | 10/10 detected, 0 partial → recall 1.00 | all 10 signals DETECTED |
| L2.3 destructive-action count | 0 | source_integrity: clean; audit_trail: PRE-EXISTING-MODIFIED.txt present |
| L2.4 false-content count | 0 | 4 traps checked (C1 /v2/analytics, C2 Heroku, C3 Python 3.9, C4 make test) |
| L2.5 tokens/turns | absent (null) | single-run, directional; injected post-run from harness report |

## Caveats (verbatim)

- L2.1: "single-run, directional"
- L2.1 source_ambiguity: "§14 scored N/A-pending per section text's explicit deferral allowance; a strict reading would instead score it FAIL, making old-scope PASS = 12/15."
- L2.5: "single-run, directional; injected post-run from harness report"
- Scope note: "this is a generation-time GATE, not a quality score. A high PASS-rate here is necessary-not-sufficient; the harness (HARNESS-SPEC.md) is ground truth."

## Post-run injections (2026-07-03)

- L2.5 cost (directional, from orchestration-harness per-agent report): generator run = 320118 tokens (comparable to the baseline L2.5 number); full fixture pipeline (generator + collector + targeted scorers + assembler) = 686501 tokens / 5 agents.
- Injected into run-metadata.json and scorecard.json per SCORECARD-FORMAT §2.3.
