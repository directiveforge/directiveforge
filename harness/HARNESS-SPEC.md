# HARNESS-SPEC — v0.18.0-H Proof Harness (pre-registered measurement spec)

> **Spec version:** 1.0 · **Date:** 2026-07-03 · **Author:** Fable 5 (main agent, v0.18.0-H session)
> **Pre-registration contract (ground rule 6):** this file is committed BEFORE any measurement run.
> Results never edit metrics retroactively — any metric change requires a new dated spec version
> (`## Spec version history` below) and re-runs under the new version. The release verifier (W7)
> checks in git history that this file's first commit predates the first results commit.

## 1. What we measure and why

Nobody in the ecosystem publishes measured validation of generated workflows (scan 2026-07-02
§3g); the only prior art, wshobson PluginEval, scores artifacts and stops there. This harness
measures both levels, on the kit itself first:

- **Layer 1 — artifact quality:** are the workflow files the kit ships/generates well-formed,
  triggerable, and repeatably activatable? (Statistical scoring of skills/rules/agents/commands.)
- **Layer 2 — outcome quality:** when the full generator runs against a known project, does it
  detect what is there, respect what exists, avoid inventing what isn't, and pass its own
  validation gates? (End-to-end benchmark against fixed synthetic fixture repos with answer keys.)

Layer 1 scores never substantiate Layer 2 claims or vice versa. Measurement validity beats
measurement volume: few metrics, each defensible, each carrying a threats-to-validity note.

## 2. Honest-numbers doctrine

1. Every published figure carries **n**, **method**, and a **95% CI** — or the explicit caveat
   **"single-run, directional"**. No round marketing percentages, ever.
2. A number that cannot be recomputed from a committed raw artifact in `harness/results/` does
   not ship.
3. Weak scores are published and filed as defects. Rubrics, gates, and answer keys are never
   tuned post-hoc to pass a run (that is a spec change → new spec version → re-run).
4. Letter grades (defined in `SCORECARD-FORMAT.md`) are presentation only and never replace the
   underlying numbers.

## 3. Definitions

- **Artifact classes:** `skill` (SKILL.md, dir format), `rule`, `agent`, `command`, `mcp-config`,
  `context-doc` (CLAUDE.md/AGENTS.md class).
- **Fixture:** a 100% synthetic reference repo under `harness/fixtures/<name>/` with a
  `FIXTURE-CARD.md` declaring planted signals (the answer key) and scripted operator answers.
- **Planted signal:** a fixture fact the generator should detect and reflect, with a falsifiable
  detection criterion (e.g. negative signal: "no `testing` rule generated — fixture has no tests").
- **Applicable checklist section:** a `VALIDATION_CHECKLIST.md` section not N/A for the run's
  tier / IDE scope / greenfield status (N/A-until-scaffold is honest status, not failure).
- **Judge models (fixed for this spec version):** router-sim = Haiku (`claude-haiku-4-5`); rubric
  judge + adversarial reviewer + generator runner = Opus 4.8 (`claude-opus-4-8`, the model class
  real users run — the generator never runs on Fable); calibration re-judge = Fable 5.

## 4. Layer 1 metrics

### L1.1 Static-gate PASS rate

- **Definition:** share of mechanical checks passed per artifact; checks derived from
  `VALIDATION_CHECKLIST.md` + generator §3.3 gates (frontmatter validity/completeness, line
  ceilings incl. the router-rule ≤100 exemption, strict-JSON parse, placeholder hygiene,
  least-privilege tool scoping, glob/path validity, required sections present).
- **Scale:** proportion 0–1 per artifact and per pack; every check is PASS/FAIL with a command.
- **Method:** `harness/layer1/static-checks.md` executed by a scorer subagent; each check must be
  reproducible by copy-pasting its command.
- **Threats to validity:** measures form, not usefulness — a well-formed useless skill passes;
  ceilings invite padding/truncation gaming. Mitigation: pair with L1.4; never report L1.1 alone.

### L1.2 Trigger precision / recall / F1

- **Definition:** does the artifact's `description` frontmatter route correctly? Per skill:
  ≥10 synthetic prompts — 5 positive (should fire it), 5 negative (2 near-miss adjacent-skill,
  2 unrelated-domain, 1 drawn from the skill's own "When NOT to use"). TP = target fires on a
  positive; FP = target fires on a negative. Precision = TP/(TP+FP), Recall = TP/5, F1 harmonic.
- **Scale:** 0–1 per skill; pack-level micro-average.
- **Method:** prompt author (Opus) writes realistic user messages and MUST paraphrase — never
  quote the description's trigger phrases verbatim (anti-overfit rule). Router-sim (Haiku) sees
  what a real router sees — the catalog's name+description frontmatter + one prompt — and returns
  one skill name or "none". Prompt sets are committed with results and reused verbatim on re-runs.
- **Threats to validity:** prompts may still overfit descriptions (author read them); Haiku
  router-sim approximates, not reproduces, production routing. Mitigations: paraphrase rule;
  near-miss negatives; §6 calibration; per-skill confusion detail in raw artifacts.

### L1.3 Activation repeatability

- **Definition:** stability of positive-prompt activation under paraphrase + sampling noise.
  Per skill: paraphrase variants of the 5 positive prompts run as independent router-sim trials.
- **Scale:** activation proportion + Wilson 95% CI.
- **Method:** batches of 5 trials; min n=10, target n=20, max n=30; **early-stop circuit breaker:
  stop once CI half-width ≤ 0.08** (at perfect activation this triggers at n≈20 — the target and
  the breaker cohere). n < 20 without breaker-stop ships with an explicit small-n caveat.
  Wilson formula (pure arithmetic, no deps) lives in `harness/layer1/repeatability.md`.
- **Threats to validity:** paraphrase generator shares model family with router; proportion
  conflates paraphrase robustness with sampling noise. Mitigation: commit sets; report n + CI.

### L1.4 Judge rubric scores

- **Definition:** anchored 1–5 rubric per artifact class on 4 dimensions: actionability
  (DO/DON'T density vs prose), scope calibration (worker not orchestrator; one job),
  failure-content quality (Gotchas/Anti-patterns/When-NOT substance), constraint explicitness
  (agents: NEVER/ALWAYS + tool scoping; skills: numbered steps).
- **Scale:** 1–5 per dimension; anchors name concrete failure examples (the 1 and 3 anchors cite
  real friction-report defect classes). PluginEval statistical vocabulary adopted; no text copied.
- **Method:** Opus judge, one artifact per judgment, rubric-in-context, evidence quote required
  per score; dispatch prompt in `harness/layer1/judge-rubrics.md`.
- **Threats to validity:** LLM-judge leniency + anchoring bias; self-grading risk (the kit's
  conventions leak into the judge via rubric authorship). Mitigations: mandatory evidence quotes;
  Fable re-judge per §6 with **judge-agreement rate published in the scorecard**; anchors frozen
  at this spec's commit, before any scoring.

## 5. Layer 2 metrics

All Layer 2 runs execute `generator/PROJECT_SETUP_PROMPT.md` as written (no harness-specific
edits), Opus 4.8, clean context per run, against a scratchpad copy of the fixture, with the
fixture's scripted operator answers. Protocol: `harness/layer2/BENCHMARK-PROTOCOL.md`.

### L2.1 Checklist PASS rate
- Sections of `VALIDATION_CHECKLIST.md` passing / applicable, with the N/A list + reasons.
  A section passes only if all its applicable items pass; item-level detail in raw artifacts.
- **Scale:** x/y sections; single-run directional (one generator run per fixture at baseline).
- **Threats:** the checklist is the kit's own instrument — circular by construction; it measures
  self-consistency, not external quality — pair with L2.2/L2.6 (answer-key-scored).

### L2.2 Planted-signal recall
- Detected signals / total answer-key signals (each ≥8 per fixture, each with a falsifiable
  detection criterion evaluated mechanically or by evidence-quoted review).
- **Threats:** answer keys share authorship with the generator — fixture-overfitting risk runs
  both directions. Mitigation: fixture authors (W1) have NOT read the generator prompt; signal
  criteria frozen at fixture commit, before any run.

### L2.3 Destructive-action count (must be 0)
- Any of: pre-existing file overwritten without the protocol backup, pre-existing file deleted,
  existing ledger forked/renumbered, existing config entries removed, writes outside the fixture
  copy. **Method:** mechanical — pre-run hash manifest vs post-run tree; every changed
  pre-existing path must be byte-identical, carry a `.backup` sibling, or match an explicit
  Phase-4 merge/append protocol. **Scale:** count; >0 fails the run and files a 🚨 defect.

### L2.4 False-content count
- Claims in generated files contradicting fixture reality (stale-README trap; invented
  commands/paths/versions). Each counted item needs claim file:line + the contradicting fact.
- **Threats:** reviewer judgment at the margin (is a hedged claim false?); rule: count only
  claims falsifiable against the fixture tree as committed.

### L2.5 Run cost
- Tokens and (where reported) turn count of the generator run, as reported by the executing
  harness; measurement method noted per run. **Single-run, directional — always.**

### L2.6 Workflow-defect count by class
- Independent Opus adversarial review (step-④ style, fresh context) of the generated workflow,
  scored against the friction-report defect taxonomy, severity-tagged 🚨/⚠/🟡:
  (a) phantom-reference (package/path/tool that doesn't exist) · (b) contradiction (doc↔doc or
  doc↔repo) · (c) dead-asset (file that can never fire: dead globs, unpassable gate, placeholder-
  riddled) · (d) stale-content · (e) scope-misroute (wrong preset/tier/IDE scope) ·
  (f) governance-violation (edits where propose-only was required) · (g) placeholder-leak
  (`{{…}}` in non-template output) · (h) duplication-drift (same fact in two places, diverging).
- **Threats:** reviewer variance; classes overlap at edges (a vs d). Rule: one primary class per
  defect; evidence quote mandatory; zero-finding classes named explicitly (v0.16.0 precedent).

## 6. Judge calibration (what makes the cheap judge defensible)

Fable 5 independently re-judges a ~10% subsample of Opus/Haiku-judged items (cap 15, stratified
across L1.2/L1.4/L2.4/L2.6), blind to the original scores. Scorecards publish the
**exact-agreement rate** and (for 1–5 rubrics) the **±1-agreement rate**. Disagreements are
listed item-by-item in raw artifacts; systematic disagreement (>1/3 of subsample) invalidates
that metric's run pending rubric revision (= new spec version).

## 7. Reproducibility requirements

1. An independent operator reproduces everything from `harness/RUNBOOK.md` alone (W5 acceptance:
   fresh-context dry-read finds zero unresolvable steps).
2. Raw artifacts committed per run under `harness/results/<date>-<label>/`: generated file tree,
   pre/post hash manifests, prompt sets + paraphrase sets, per-trial router-sim outputs,
   judge outputs with evidence quotes, run logs, scorecards (JSON + MD).
3. Fixtures are frozen by commit SHA; scorecards record fixture SHA + spec version + model IDs.
4. Two independent runs of the same fixture may differ only in stochastic metrics (L1.2/L1.3
   trials, L2.4–L2.6 counts — CI'd or caveated), never in what was measured or how.
5. Spend circuit-breakers: every subagent brief carries a token estimate; projected overrun
   ~2× → stop, surface to operator. Repeatability early-stop per L1.3.

## 8. Fixture integrity (multidomain lock, strictest form)

- Fixtures are 100% synthetic: invented product, invented names, no resemblance to any real
  client project; no real feedback-report content inside fixtures.
- **Leak-scan:** the denylist of real project/client names is derived at runtime from repo
  contents (`case-studies/` dir names, `feedback/*.md` filename stems) — NEVER committed as
  literals inside `harness/`. Gate: grep of fixture trees against it returns 0 matches.
- Fixtures are install-free to analyze: no lockfiles requiring install, no network access needed.

## 9. Non-goals (v0.18.0-H)

- **No competitor-comparative claims.** We measure the kit against its own baselines only;
  comparative benchmarking needs its own legal/ethical design (deferred).
- No cross-model comparisons; no infra benchmarks; no real-project-outcome claims from
  synthetic-fixture results (fixtures bound what generalizes); no CI wiring in this release
  (exit-code convention documented in SCORECARD-FORMAT.md only).

## 10. Scorecard binding

Every number in a published scorecard maps to exactly one metric ID above (L1.1–L1.4,
L2.1–L2.6) plus the §6 agreement rates. Serialization, letter-grade mapping, and the
exit-code convention live in `harness/SCORECARD-FORMAT.md`; anything not defined here does
not appear in a scorecard.

## Method addenda (dated; definitions above are untouched)

### v1.1 (2026-07-03) — batched router-sim channel (L1.2 / L1.3 execution only)

**What changes:** the router-sim stimulus MAY present K prompts per call (K ≤ 15) instead of the
v1.0 one-prompt-per-call channel. **What does not change:** every metric definition, scale,
prompt-set rule (committed, reused verbatim), the L1.3 schedule (batch5-min10-target20-max30,
half-width ≤ 0.08 breaker), rubrics, answer keys, grading.

**Why:** ADJ-3 (DISPOSITIONS-v0.18.0) — each router/recorder subagent call carries ~31.5k of
fixed per-call system context; the v1.0 channel spent ≈19M of the 23.7M baseline on per-call
overhead, not measurement content. Batching is a cost fix, not a redefinition.

**Batched-channel requirements (all mandatory):**
1. One call = K prompts, each labelled by id; the brief instructs the router to judge each prompt
   INDEPENDENTLY (no cross-referencing, no distribution balancing) and return a JSON array of
   `{id, skill}` verdicts against the same catalog the v1.0 channel would show.
2. L1.3 batched calls interleave variants across skills — never a same-skill paraphrase cluster
   in one call (recognizable clusters weaken trial independence).
3. **Per-run equivalence demonstration:** every run using the batched channel ships an
   equivalence block — control rows (unfixed/stable skills, and/or the same rows measured on
   both channels within the run) reproducing their reference values within the baseline Wilson
   95% CIs. Controls comparing against v1.0-era numbers must pin the catalog to the reference
   commit so channel is the only variable.
4. **Headline-delta rule:** any claim of metric MOVEMENT vs a v1.0-measured baseline must either
   (a) be measured on the v1.0 single-call channel, or (b) ship alongside the equivalence block
   with the caveat naming the channel. Scorecards state the channel per metric
   (`channel: "v1.0-single"` / `"v1.1-batched-K<k>"`).
5. Wilson CIs computed from batched trials are flagged **nominal** (trial independence is weakened
   by batching even with rule 2) — treat as directional bounds, not exact coverage.

## Spec version history

- **1.0 (2026-07-03)** — initial pre-registration, committed before any measurement run.
- **1.1 (2026-07-03)** — Method addendum only: optional batched router-sim channel for L1.2/L1.3
  execution (K ≤ 15, independence instruction, per-run equivalence demonstration, headline-delta
  rule, nominal-CI flag). No definition, scale, rubric, answer key, or grading change. Reason:
  ADJ-3 per-call-overhead cost incident. Numbers measured under 1.0 remain valid and comparable
  per addendum rules.
