# Feedback — UXD-5 clean-run timing: dual-basis correction (2026-07-13)

**Source:** one clean, uninterrupted Starter-tier generator run, executed the night before launch
specifically to validate the published timing claim before it carried further public weight.

- **The measurement:** one clean, uninterrupted Starter-tier generator run; Express/`general-node`
  fixture, 32 files; orchestration-clock basis T0 `2026-07-13T14:17:33Z` → T1
  `2026-07-13T14:45:01Z` = **27m28s**; **~367k tokens**; 0 operator questions; all 6 completion
  sanity checks passed.
- **The gap vs the published figure:** ~31% over the 21-min ceiling of the published "~18–21 min";
  tokens over the published "~270–330k" range.
- **Root cause:** basis mismatch, not noise — roughly 7 minutes of KB reads and dispatch overhead
  sit before the first phase banner and are invisible to the harness's internal per-run
  `duration_s`. Both bases are real; they measure different things. The user experiences the wall
  clock, not the internal generation clock.
- **Caveats, plainly:** n=1; this run was driven by a Sonnet-class session rather than the
  HARNESS-SPEC-pinned Opus-class runner, so the model class may shift the number; one fixture size
  (32 files — larger repos will run longer).
- **Provenance note:** the same disposition lives on the `ux-lifecycle` branch
  (`feedback/2026-07-12-ux-lifecycle-deferrals.md`, row UXD-5, commit `0c51931`). After the
  Wednesday `ux-lifecycle` → `main` merge, that row is the canonical record; this file remains as
  the launch-eve record that motivated the same-night public correction.
- **Disposition:** the public timing claim is corrected to dual-basis in this same commit
  (`README.md`, `QUICK_START.md`) — the recorded baseline range stays published alongside the new
  wall-clock figure, not replaced by it.
