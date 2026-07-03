# SCORECARD-FORMAT — serialization, grades, exit codes (v0.18.0-H proof harness)

> Serializes HARNESS-SPEC §10 (scorecard binding). This doc defines the two scorecard shapes
> that already exist on disk under `harness/results/<date>-<label>/`, plus the two fields
> injected post-run (`l2_5` / `L2.5` cost and `calibration`). Letter grades and the exit-code
> convention live HERE and nowhere else (spec §10). **Grades are presentation-only (spec §2.4):
> they never replace, and never appear without, the underlying number** (§2.1 honest-numbers).
> Every number a scorecard emits maps to exactly one metric ID L1.1–L1.4 / L2.1–L2.6 or a §6
> agreement rate; a number with no binding is a defect (exit 2 below).

---

## 1. Two scorecard shapes

Both shapes ship as a **JSON file + a Markdown twin** (`scorecard.json` + `scorecard.md`) in the
same result dir. Twin rule in §2. Neither shape contains a letter grade — grades are computed by
the consumer per §3, never baked into the artifact.

### 1a. Layer 1 pack scorecard (`l1/<pack>/scorecard.json`)

Emitted by the L1 pack-scorecard assembler (`runner/w4-l1-baseline.workflow.js`). One per template
pack (`decision`, `naming`, `design`). Real reference: `l1/decision/scorecard.json`.

Top-level fields (all **required** unless noted):

| Field | Type | Semantics |
|---|---|---|
| `spec_version` | string | HARNESS-SPEC version this run executed under (e.g. `"1.0"`). Must match the committed spec header. |
| `layer` | number | `1`. |
| `pack` | string | Template pack slug under `templates/skills/`. |
| `date`, `label` | string | Run date (`YYYY-MM-DD`) and short label (`baseline`). |
| `models` | object | The frozen model IDs (spec §3): `static`, `author`, `router`, `judge`, `calibration`. Records which model produced each class of judgment. |
| `metrics` | object | One key per L1 metric ID — see below. |
| `calibration` | object | §6 Fable re-judge aggregates. Injected post-run (§2.3). |

`metrics.L1.1` — **binds L1.1 static-gate PASS rate.**
- `target` (string): the scored dir, e.g. `templates/skills/decision/`.
- `na_families` (string[]): check families excluded from the denominator, each with its reason
  (e.g. `"S6 (template source, {{PLACEHOLDER}} expected under templates/)"`). Empty array allowed.
- `empty_dirs` (string[]): unpopulated skill-wrapper dirs (structural note, not scored). Optional.
- `artifacts` (object[]): one row per `SKILL.md` — `path`, `class`, `checks` (per-check
  `PASS`/`FAIL`/`INDETERMINATE`), `na` (N/A check ids), `passed`, `failed`, `pass_rate` (raw
  proportion, ≤4 dp). Some assemblers omit `checks`/`na`/`class` and keep only `passed`/`failed`/
  `pass_rate` — both are valid; the pack roll-up is authoritative.
- `pack` (object): `passed`, `failed`, `pass_rate` — the **micro-average** (spec §4 L1.1: weight by
  check count, not artifact). **This is the L1.1 headline number.**

`metrics.L1.2` — **binds L1.2 trigger precision / recall / F1.**
- `prompts_per_skill` (number): `10` (5 positive + 5 negative, spec §4 L1.2).
- `pack_micro` (object): `TP`, `FP`, `FN`, `precision`, `recall`, `f1` — micro-averaged over the
  pack. **`f1` is the L1.2 headline.**
- `per_skill` (object[]): per skill — `skill`, `TP`, `FP`, `FN`, `positives`, `precision`,
  `recall`, `f1`.

`metrics.L1.3` — **binds L1.3 activation repeatability.** Two mutually-exclusive shapes:
- **Measured:** `schedule` (string, e.g. `"batch5-min10-target20-max30-halfwidth0.08"`) +
  `per_skill` (object[]): `skill`, `n`, `activations`, `proportion`, `wilson_ci` (`[lo, hi]`),
  `stopped_early` (bool). **The L1.3 headline is the MIN `proportion` across skills** — worst-skill,
  never a mean (a mean hides a dead skill).
- **Deferred:** `{"status":"deferred","caveat":"…spend circuit-breaker adjudication…"}`. A deferred
  L1.3 is **excluded from grading** and carries its caveat verbatim (baseline: naming + design packs).

`metrics.L1.4` — **binds L1.4 judge rubric scores.**
- `n` (number): artifacts judged.
- `per_dimension_mean` (object): `actionability`, `scope_calibration`, `failure_content_quality`,
  `constraint_explicitness` — each a 1–5 mean.
- `overall_mean` (number): **the L1.4 headline** (1–5). Grade band carries the `n` caveat (§3).

`calibration` (§6, injected post-run) — `l1_4_exact` / `l1_4_within_1` (e.g. `"18/20 (0.90)"`),
`l1_2_random`, `l1_2_adversarial_probe`, `items_total`, `record` (relpath to `calibration-fable.md`),
`judge_agreement_note`. **These are diagnostic; they are not graded**, but a §6 invalidation
(>1/3 systematic disagreement on a representative subsample) voids the affected metric's grade.

### 1b. Layer 2 fixture scorecard (`<fixture>/scorecard.json`)

Emitted by the L2 scorecard assembler (`runner/w4-l2-baseline.workflow.js`). One per fixture. Real
references: `brownfield-docs/scorecard.json`, `brownfield-api/scorecard.json`,
`greenfield-next/scorecard.json`.

Top-level: `spec_version`, `layer` (`2`), `fixture`, `fixture_sha` (frozen commit SHA, spec §7.3),
`date`, `label`, `models` (`runner`, `scorers`, `collector`, `calibration`), `metrics`,
`calibration`. All required.

`metrics.L2.1` — **binds L2.1 checklist PASS rate.** `pass`, `applicable`, `na_sections` (string[]
with per-section reason), `caveat` (`"single-run, directional"`). Headline: `pass/applicable`.

`metrics.L2.2` — **binds L2.2 planted-signal recall.** `detected`, `partial`, `total` (≥8, spec
§5), `recall` (`(detected + 0.5·partial)/total`), `per_signal` (S1..Sn → `DETECTED`/`MISSED`/
`PARTIAL`). Optional `source_ambiguity` (string): a documented borderline verdict and the reading
chosen (baseline brownfield-api S10 uses this). Headline: `recall`.

`metrics.L2.3` — **binds L2.3 destructive-action count (must be 0).** `count` (number),
`source_integrity` (`"clean"`/`"violated"` — the harness-self gate, protocol §10, distinct from the
count). **`count>0` OR `source_integrity:"violated"` caps the overall grade at F (§3).**

`metrics.L2.4` — **binds L2.4 false-content count.** `count`, `traps_checked`. Lower is better;
`0` is best.

`metrics.L2.5` — **binds L2.5 run cost.** `tokens`, `duration_s`, `turns` (null if unreported),
`caveat` (`"single-run, directional; injected post-run from harness report"`). **Injected post-run
(§2.3); always directional; never graded** (spec §5 L2.5) — reported for the record only.

`metrics.L2.6` — **binds L2.6 workflow-defect count by class.** `total`, `by_class` (keys `a`–`h`,
spec §5's 8 classes), `by_severity` (`critical`/`warn`/`minor`, mapping 🚨/⚠/🟡). Graded by a
severity-weighted score (§3).

`calibration` (§6): `l2_4_agreement`, `l2_6_agreement` (each `"x/y (grade note)"`), `record`.

**Companion `run-metadata.json`** (same dir, spec §7.2 / protocol §1): `spec_version`, `fixture`,
`fixture_sha`, `models`, `date`, `label`, `workdir`, `pre_files`, `post_files`, and the `l2_5`
block (`tokens`, `duration_s`, `turns`, `method`, `caveat`). This is where L2.5 cost first lands
before the assembler mirrors it into the scorecard.

---

## 2. Markdown-twin requirement

Every `scorecard.json` has a `scorecard.md` twin in the same dir (real: `brownfield-docs/scorecard.md`,
`l1/decision/scorecard.md`). Rules:

1. **Same numbers.** Every figure in the twin is copied verbatim from the JSON — the assembler
   computes nothing new (runner contract). A twin number absent from the JSON is a defect.
2. **Human table.** One row per metric ID, `| Metric | Value | Notes |`, headline number bolded.
3. **Caveats verbatim.** A `## Caveats (verbatim)` block reproduces each metric's `caveat` string
   exactly — no paraphrase.
4. **`## Post-run injections (<date>)` section** (convention): the twin ends with this section
   recording what was added AFTER the measurement run — the `L2.5` cost line and the `calibration`
   (§6) aggregates — each dated. This makes the injection auditable (§2.3) rather than silently
   merged. L1 twins put the calibration injection here; L2 twins put both cost and calibration here.

### 2.3 Post-run injection convention

Two fields are written AFTER the scoring run, not by the scoring subagents:
- **`L2.5` / `l2_5` cost** — read from the orchestration harness's per-agent report once the run
  finishes (the scorers never see it). Injected into both `run-metadata.json` and the scorecard.
- **`calibration`** — the Fable §6 re-judge, produced by the strongest available model after all
  primary scoring. Injected into the scorecard `calibration` block + the twin's injections section.

Rule: injected fields are labelled as such (their `caveat`/`method`/`judge_agreement_note` say
"injected post-run") and dated in the twin. Injecting a field is NOT a spec change and NOT a metric
edit — it is completing a field the run always specified but could only fill post-hoc.

---

## 3. Letter-grade mapping (presentation-only, spec §2.4)

Grades are a **conservative, gaming-resistant** projection of the numbers, computed by the scorecard
consumer — **never stored in the scorecard**. A grade never appears without its number beside it
(`F1 0.9298 (B)`). Bands are **frozen at this doc's commit** and change only via a new spec version
(spec §2.3). Rationale for the design choices is stated inline; read them before proposing changes.

### 3a. Per-metric bands

| Metric | Graded quantity | A | B | C | D | F |
|---|---|---|---|---|---|---|
| **L1.1** | pack `pass_rate` | ≥0.98 | ≥0.95 | ≥0.90 | ≥0.80 | <0.80 |
| **L1.2** | pack `f1` | ≥0.95 | ≥0.90 | ≥0.80 | ≥0.70 | <0.70 |
| **L1.3** | **MIN** per-skill `proportion` | ≥0.90 | ≥0.80 | ≥0.70 | ≥0.60 | <0.60 |
| **L1.4** | `overall_mean` (÷5) | ≥4.75 | ≥4.25 | ≥3.75 | ≥3.25 | <3.25 |
| **L2.1** | `pass/applicable` | ≥0.98 | ≥0.95 | ≥0.90 | ≥0.80 | <0.80 |
| **L2.2** | `recall` | ≥0.95 | ≥0.90 | ≥0.80 | ≥0.70 | <0.70 |
| **L2.3** | `count` | =0 → not-F | — | — | — | **>0 → F (hard cap, §3c)** |
| **L2.4** | `count` (zero-based) | =0 | =1 | =2 | =3 | ≥4 |
| **L2.6** | severity-weighted score `W` | W=0 | W≤2 | W≤4 | W≤6 | W>6 **or any 🚨** |

- **L2.5 has no band** — run cost is directional-only (spec §5 L2.5), reported never graded.
- **L1.3 deferred** → no band; excluded from the overall grade, carries its caveat (§1a).
- **L1.4 `n` caveat**: an L1.4 grade is annotated with `n` (e.g. `A (n=12)`); a small-n mean
  (`n<6`) additionally carries `directional` — a high mean on few artifacts is not a confirmed A.

**L2.6 severity weight `W` = 3·critical + 1·warn + 0·minor.** Rationale: minors are noise-floor
(every real workflow has cosmetic nits); a single critical (🚨 phantom-reference / dead-asset /
governance-violation) is disqualifying-ish, so it alone forces F. Weighting, not raw count, prevents
"3 minors look worse than 1 critical" inversions.

### 3b. Overall grade = **worst-of (MIN across metrics)**

The overall pack/fixture grade is the **minimum** of its per-metric grades — explicitly **NOT a
weighted composite or average.** Rationale (stated so it is not "fixed" later): a weighted composite
invites gaming — pad the cheap-to-max metrics (L1.1 form is trivially gameable via padding, spec §4
L1.1 threat) to drown a real failure in a strong average. Worst-of makes every metric a gate: you
cannot buy back a failing trigger recall with a perfect static score. A deferred/ungraded metric is
skipped in the MIN (it is not a 0).

### 3c. Hard F-cap (overrides everything, including a clean worst-of)

The overall grade is **F regardless of all other metrics** if EITHER:
- **L2.3 `count` > 0** (a destructive action occurred — spec §5: `>0` fails the run + files 🚨), OR
- **source-integrity violation** (`source_integrity:"violated"`, or an L1 analogue: any evidence the
  harness wrote outside its sandbox).

This cap is non-negotiable and cannot be averaged away — a workflow that overwrites a user file
without backup has failed, whatever its form scores. (An L2.6 🚨 also forces the L2.6 metric to F via
its band, but the L2.3/source-integrity cap is the stronger, whole-scorecard gate.)

---

## 4. Exit-code convention (documented only — CI wiring out of scope, spec §9)

A future `scorecard-check <scorecard.json>` invocation (NOT built this release) reads the scorecard,
applies bands from §3, and compares each headline against **thresholds supplied by the consumer's
config** — thresholds live in the checker's config, never in the scorecard (the scorecard reports
numbers; the config decides what passes). Convention:

- **exit 0** — every graded metric is at/above its configured threshold (all gates pass).
- **exit 1** — any graded metric is below its threshold (a soft failure: the numbers are valid, the
  bar was not met).
- **exit 2** — a **structural** failure, dominating exit 1: L2.3 `count`>0 OR a source-integrity
  violation (§3c) OR a scorecard number that maps to no §10 metric ID (an unbindable figure — spec
  §10 says it must not ship). Exit 2 means "do not trust this scorecard," not "the bar was missed."

Precedence: 2 > 1 > 0. A scorecard with both a below-threshold metric and an L2.3 violation exits 2.

---

## 5. Worked example — 2026-07-03 baseline grades

Computed from the real committed scorecards, worst-of per §3b, F-cap per §3c. **The weak spots show —
that is the point (spec §2.3: weak scores are published, not tuned away).**

### 5a. Layer 1 packs

| Pack | L1.1 | L1.2 | L1.3 (min prop) | L1.4 | **Overall** |
|---|---|---|---|---|---|
| **decision** | 1.0 **(A)** | 0.9298 **(B)** | 0.2667 **(F)** ← inversion/anti-sycophancy-meta | 4.896 **(A, n=12)** | **F** |
| **naming** | 1.0 **(A)** | 0.9667 **(A)** | deferred (ungraded) | 5.0 **(A, n=6)** | **A** |
| **design** | 1.0 **(A)** | 1.0 **(A)** | deferred (ungraded) | 4.875 **(A, n=4)** | **A** |

- **decision → F**, driven entirely by L1.3: two skills (`inversion` proportion 0.3333, wilson
  [0.1923, 0.5122]; `anti-sycophancy-meta` proportion 0.2667, wilson [0.1418, 0.4445]) do not
  activate reliably. Worst-of refuses to let a 1.0 static and 4.896 rubric mask a dead-trigger skill
  — exactly the design intent. This is a filed defect, not a failed release (DISPOSITIONS-v0.18.0).
- **naming → A**: L1.3 deferred is excluded from the MIN (carries its spend-breaker caveat), and the
  three graded metrics are all A. The grade is honest only *because* the deferral is labelled — an A
  here means "A on what was measured; L1.3 unmeasured."
- **design → A**: raw numbers confirmed against `l1/design/scorecard.json` (F1 1.0, overall_mean
  4.875, n=4); same labelled-deferral honesty rule as naming applies to its unmeasured L1.3.

### 5b. Layer 2 fixtures

| Fixture | L2.1 | L2.2 | L2.3 | L2.4 | L2.6 (W) | **Overall** |
|---|---|---|---|---|---|---|
| **brownfield-docs** | 12/12=1.0 **(A)** | 1.0 **(A)** | **count=1 → F-CAP** | 0 **(A)** | 6: crit1/warn2/min3, W=5 **(D)** | **F** (§3c cap) |
| **brownfield-api** | 14/14=1.0 **(A)** | 0.9 **(B)** | 0 (ok) | 4 **(F)** | 2: 2 min, W=0 **(A)** | **F** ← L2.4=4 |
| **greenfield-next** | 13/13=1.0 **(A)** | 0.9 **(B)** | 0 (ok) | 0 **(A)** | 3: warn1/min2, W=1 **(B)** | **B** ← L2.2 |

- **brownfield-docs → F by the §3c hard cap**: L2.3 `count=1` (README.md changed in place, no
  backup, not append-only, not a move). Every other metric is strong (all-A checklist, perfect
  recall) but the destructive action caps the whole scorecard at F — the cap doing exactly its job.
  Note the L2.6 flagship C1 🚨 (link-health gate misfires) would independently force L2.6 to F too.
- **brownfield-api → F**: L2.3 clean, but L2.4 `count=4` (four planted contradictions propagated)
  lands in the ≥4 → F band; worst-of carries it to overall F despite A/B elsewhere. (L2.2 headline
  0.9 is the strict positive-criterion reading; the scorecard's `source_ambiguity` note records that
  a literal FAIL-clause reading would give 0.8/C — the F-driver is L2.4, unaffected either way.)
- **greenfield-next → B**: cleanest fixture. L2.3 clean, L2.4=0, L2.6 W=1 (B). The binding
  constraint is L2.2 recall 0.9 (S3 missed) → B. Overall B = worst-of(A,B,—,A,B).

**Read-out:** across the baseline the harness grades itself honestly to **three F's and two/three
A–B's** — the F's each trace to one concrete, filed defect (decision L1.3 dead triggers;
brownfield-docs destructive write; brownfield-api false-content propagation), none tuned away. That
is the honest-numbers doctrine (spec §2) rendered as grades.
