# Layer 1 — Activation Repeatability (implements L1.3)

> Metric: **L1.3 Activation repeatability** per HARNESS-SPEC §4. Router-sim = Haiku
> (`claude-haiku-4-5`); paraphrase author = Opus 4.8 (`claude-opus-4-8`), spec §3.
> Threats to validity: HARNESS-SPEC §4 L1.3. Do not restate. Serialize per §10.

## What this measures

Stability of positive-prompt activation under paraphrase + sampling noise. Reuses the **5
positive prompts** authored for L1.2 (`judge-rubrics.md` Protocol 1a) — do not author new
positives here.

## Paraphrase-trial protocol

For each skill:

1. **Generate paraphrase variants** (author = Opus 4.8) of the skill's 5 L1.2 positive prompts.
   Each variant preserves intent, changes surface form (different verbs, framing, register). The
   full paraphrase set is committed with results (spec §7.2) and reused verbatim on re-runs.
   ```
   You are the L1.3 PARAPHRASE AUTHOR. Model: Opus 4.8. Given 5 positive prompts for skill <S>,
   produce paraphrase variants — each preserves the user's intent but changes surface wording
   (verbs, sentence shape, register). Do NOT quote the skill description's trigger phrases.
   Output a JSON array: [{"id":"<S>-v1","base":"<S>-p1","text":"..."}]. Produce enough variants
   to cover up to n=30 trials (≥6 distinct variants per base prompt).
   ```
2. **Each trial = one router-sim call** (Haiku) on one variant, using the L1.2 router-sim
   dispatch verbatim (`judge-rubrics.md` Protocol 1b: catalog + one message → one skill name or
   `none`).
3. **Activation** = the router returns the **target** skill name. Anything else (sibling or
   `none`) is a non-activation. Record the returned name for every trial (confusion carries over).

## Trial schedule + early-stop circuit breaker

- Run in **batches of 5** trials (cycle through the committed variants; if variants < n, reuse
  in round-robin — sampling noise still varies the outcome).
- **min n = 10, target n = 20, max n = 30.**
- After each batch, compute the Wilson 95% interval (below). **Early-stop once the half-width
  ≤ 0.08.** The crossing sits at n≈21 for perfect activation (x=20,n=20 → 0.0806, just over;
  x=21,n=21 crosses under), so with batch-of-5 checkpoints a clean skill stops at n=25 — the
  target (20) and the breaker cohere (spec §4 L1.3).
- If n reaches 30 without the breaker firing, stop at 30.
- **Small-n caveat:** if a skill stops at n < 20 for any reason OTHER than the breaker firing
  (e.g. run aborted, spend circuit-breaker §7.5), publish with `stopped_early: false` and this
  exact caveat sentence in the scorecard:

  > **Small-n caveat:** this skill's L1.3 proportion rests on n=<N> trials (<20) with no
  > breaker-stop; the Wilson CI is wide and the point estimate is directional, not confirmed.

## Wilson score interval (pure arithmetic, no deps)

For `x` activations in `n` trials at 95% confidence, `z = 1.96`, `z² = 3.8416`:

```
p̂       = x / n
denom   = 1 + z²/n
center  = ( p̂ + z²/(2n) ) / denom
margin  = ( z · sqrt( p̂·(1−p̂)/n  +  z²/(4·n²) ) ) / denom
lo      = center − margin
hi      = center + margin
half-width (breaker test) = margin
```

### Worked example — x=18, n=20 (double-checked)

```
p̂      = 18/20                                   = 0.9
z²/n   = 3.8416/20                               = 0.19208
denom  = 1 + 0.19208                             = 1.19208
center = (0.9 + 3.8416/40) / 1.19208
       = (0.9 + 0.096040) / 1.19208
       = 0.996040 / 1.19208                      = 0.835548
inner  = 0.9·0.1/20 + 3.8416/(4·400)
       = 0.0045 + 0.0024010                      = 0.0069010
sqrt   = 0.0830723
margin = 1.96·0.0830723 / 1.19208
       = 0.162822 / 1.19208                      = 0.136586
lo     = 0.835548 − 0.136586                     = 0.698962   (≈ 0.699)
hi     = 0.835548 + 0.136586                     = 0.972134   (≈ 0.972)
half-width = 0.136586  →  > 0.08  →  breaker does NOT fire; keep sampling.
```

So x=18/n=20 → **[0.699, 0.972]**, half-width 0.137. (Contrast x=20/n=20 → [0.839, 1.000],
half-width 0.0806 — just over 0.08; the first batch checkpoint past the crossing is n=25:
x=25/n=25 → [0.8668, 1.000], half-width 0.0666 → breaker fires.)

### Pure-python3 snippet (no scipy)

```python
import math
def wilson(x, n, z=1.96):
    p = x / n
    z2 = z * z
    denom = 1 + z2 / n
    center = (p + z2 / (2 * n)) / denom
    margin = (z * math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / denom
    return round(center - margin, 4), round(center + margin, 4), round(margin, 4)

lo, hi, half = wilson(18, 20)          # -> (0.699, 0.9721, 0.1366)
stopped_early = half <= 0.08           # -> False
```

## Serialization — metric L1.3

One object per skill:

```json
{
  "metric": "L1.3", "pack": "decision", "spec_version": "1.0",
  "models": {"paraphrase_author": "claude-opus-4-8", "router": "claude-haiku-4-5"},
  "per_skill": [
    {"skill": "pre-mortem", "n": 25, "activations": 25, "proportion": 1.0,
     "wilson_ci": [0.8668, 1.0], "stopped_early": true},
    {"skill": "steelman", "n": 30, "activations": 27, "proportion": 0.9,
     "wilson_ci": [0.7438, 0.9654], "stopped_early": false}
  ]
}
```

`proportion` is raw `activations/n`, unrounded beyond 4 dp (honest-numbers §2.1); every row
carries `n` + `wilson_ci`. Per-trial router outputs + the committed paraphrase set live under
`harness/results/<run>/l1.3/`. Skills flagged `stopped_early: false` with n<20 carry the
small-n caveat sentence above. Letter grades are NOT computed here (deferred to
`harness/SCORECARD-FORMAT.md`).
