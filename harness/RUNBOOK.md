# RUNBOOK — reproduce the v0.18.0-H proof harness end-to-end

> **Acceptance (spec §7.1):** an independent operator reproduces the ENTIRE harness from this file
> alone; a fresh-context dry-read finds zero unresolvable steps. Every step below names its
> **executor** (who/what runs it), its **inputs**, its **outputs** (path), and its **verification**
> (how you know it worked). `KIT` = `<KIT_ROOT>`. Paths inside the committed runner
> scripts are absolute to the original machine — **adapt `KIT`, `SCRATCH`, and the results date-dir
> to yours** before running.

---

## 1. Prerequisites

- **A Claude Code session at `KIT` root** with a Workflow/subagent-orchestration tool. The two
  runner scripts (`harness/runner/w4-l1-baseline.workflow.js`, `…/w4-l2-baseline.workflow.js`) are
  the source of truth for the agent briefs. If you have no Workflow tool, execute their briefs
  manually — each `*Brief()` function returns the exact verbatim prompt for one subagent.
- **Model access** for the frozen routing table (§4): Opus 4.8, Haiku 4.5, Sonnet 5, Fable 5.
- **Network** for registry lookups (npm / PyPI / WebFetch) — Layer 2 Phase 2.5 MCP discovery needs
  it. `snyk-agent-scan` degrades to N/A without `SNYK_TOKEN` (record honestly, not as a failure).
- **Token budget — the per-call-overhead reality (read before you plan spend):** each subagent call
  carries a **measured ~31.5k of fixed per-call system context** — the *planning constant* you multiply
  by call count *before* launch (spec §7.5 breaker: `call_count × 31.5k` is the floor, projected ~2×
  over → stop). This constant is why call-count, not payload size, dominates Layer 1 cost.
  - **v1.0 single-call channel (the frozen baseline's record):** the real 2026-07-03 run reported
    **~20.4M for Layer 1** (612 subagents) + **~2.3M for Layer 2** (18 subagents), **~25M total**. L1
    dominates because 612 calls × ~31.5k ≈ **19M of that total is fixed per-call overhead**, not
    measurement content. This was expected under v1.0, not a leak — but it is the cost defect the v1.1
    batched channel fixes. Wall clock that run: L1 ~14 min, L2 ~28 min. The L2 generator itself runs
    ~273k / 328k / 308k tokens per fixture (greenfield / brownfield-api / brownfield-docs).
  - **v1.1 batched channel (`l1-delta.workflow.js`, K ≤ 15 prompts/call — spec §"Method addenda"):**
    a router call now amortizes the ~31.5k constant across up to 15 prompts. **Illustrative L1
    re-measure math:** 120 prompts ÷ 15/call = **8 router calls ≈ 8 × ~31.5k ≈ 0.3M** — versus
    **120 calls × ~31.5k ≈ 3.8M** under the v1.0 channel for the *same* 120 prompts. The measurement
    content is identical; only the fixed-overhead multiplier collapses (~12× on that slice). Use
    v1.1-batched for scoped re-measures and round-2 full runs; use v1.0-single only for headline
    movement-vs-baseline rows (spec §"Method addenda" headline-delta rule) where exact CI coverage
    is required.
  - **MEASURED (2026-07-03 delta run, `results/2026-07-03-delta/`):** the batched protocol held in
    practice — L1 v1.0-single claim rows: 637,721 tokens / 20 calls (**31.9k/call — the planning
    constant confirmed**); L1 v1.1-batched (decision 120 + naming 60 L1.2 prompts + ~120 L1.3 trials
    + 20 control rows): **652,973 / 20 calls** — the same surface ≈ 330+ calls ≈ 10M+ under v1.0;
    L2 two-fixture pipeline (generate + collect + targeted scoring + assemble): 1,356,782 / 10
    (generators: api 320,118 / docs 344,742 — baseline was 328,446 / 308,393; post-fix runs do more
    work). W4 total 2,647,476 / 50 calls vs a 2.5M declared sub-cap — **a 5.9% breach, reported
    honestly (DISPOSITIONS-v0.19.0 ADJ-1): the under-estimate was the L2 targeted-scorer weight
    (~0.4M), not the router protocol.** Whole-release spend incl. fixes, hardening, verification:
    3.95M / 65 calls (the v0.18 baseline harness alone: 23.7M / ~655).
  - **Pre-launch estimate rule (spec §7.5, ADJ-3):** compute `call_count × ~31.5k` *before* dispatch.
    `l1-delta.workflow.js` shrinks `call_count` by batching; you still owe the multiplication —
    and budget L2 scorers at ≥0.2M per fixture-tree pass (the measured v0.19.0 miss).
- **No installs.** Fixtures are install-free by construction (spec §8): no lockfiles requiring
  install, no network needed to *analyze* them.

## 2. Read order (before touching anything)

1. `harness/HARNESS-SPEC.md` — the pre-registered contract (§2 honest-numbers, §7 reproducibility,
   §10 scorecard binding). **Run only under the committed spec version.**
2. `harness/layer1/*.md` — `static-checks.md` (L1.1), `judge-rubrics.md` (L1.2/L1.4),
   `repeatability.md` (L1.3): the serialization + method for each Layer 1 metric.
3. `harness/layer2/BENCHMARK-PROTOCOL.md` — the 10-step Layer 2 procedure (metrics L2.1–L2.6).
4. **This RUNBOOK**, then `harness/SCORECARD-FORMAT.md` for grade computation.

## 3. Run steps (in order)

### Step A — verify spec + fixture commit SHAs (executor: you, in a shell)

- **Input:** the git repo at `KIT`.
- **Run:**
  ```bash
  git -C KIT log -1 --format='%h %s' -- harness/HARNESS-SPEC.md   # baseline: 601b3c5 (W0 pre-registration)
  git -C KIT log -1 --format='%h'    -- harness/fixtures/          # baseline: 4a43ebf (fixup) over 853c653 (W1)
  ```
- **Output:** the two SHAs, recorded into each run's `run-metadata.json` (`fixture_sha`).
- **Verify:** the spec's first commit **predates** the first results commit (spec §7 pre-registration;
  the release verifier W7 re-checks this in git history). If spec was committed after results, STOP —
  the pre-registration contract is broken.

### Step B — Layer 2 prep (executor: you, in a shell; per fixture)

For each fixture `<name>` in `greenfield-next brownfield-api brownfield-docs`, with
`R=KIT/harness/results/<date>-<label>/<name>` and `W=$SCRATCH/l2-runs/<name>`:

1. **Results dir + pre-manifest** (BENCHMARK-PROTOCOL §2):
   ```bash
   mkdir -p "$R"
   cd KIT/harness/fixtures/<name>/repo && find . -type f | sort | xargs shasum -a 256 > "$R/pre-manifest.txt"
   wc -l < "$R/pre-manifest.txt"    # = pre_files; record in run-metadata.json
   ```
   - **Verify:** `pre-manifest.txt` is non-empty; line count matches files on disk.
2. **Scratchpad workdir copy** (§3 — copy `repo/` CONTENTS only, NEVER `FIXTURE-CARD.md`):
   ```bash
   W=$SCRATCH/l2-runs/<name> && mkdir -p "$W"
   cp -R KIT/harness/fixtures/<name>/repo/. "$W"/
   ```
   - **Verify:** `find "$W" -name FIXTURE-CARD.md` returns **nothing**. The copy has no `.git` — that
     is the expected condition (the generator falls back to file evidence + operator profile).
3. **Extract the operator profile** (§4 — ONLY the scripted-answers block; the runner must never see
   the rest of the card):
   ```bash
   awk '/^## Scripted operator answers/{f=1} f; /^---[[:space:]]*$/{if(f&&NR>1&&seen)exit; seen=1}' \
     KIT/harness/fixtures/<name>/FIXTURE-CARD.md > "$R/operator-profile.md"
   ```
   (The committed runner hardcodes each fixture's block in `PROFILES` — either extraction is valid;
   the awk is for manual runs. Confirm the extracted block matches the committed `operator-profile.md`.)
   - **Output:** `$R/operator-profile.md`. **Verify:** it contains ONLY the scripted-answers table,
     no answer key, no warts catalog.

### Step C — launch the runners (executor: Workflow tool, or you dispatching briefs manually)

- **Inputs:** the prepped `$R` dirs + workdir copies from Step B; `KIT/generator/PROJECT_SETUP_PROMPT.md`
  (run AS WRITTEN, no harness edits — spec §5).
- **Run:**
  ```bash
  # via the Workflow tool — FULL baseline (frozen record of how the baseline ran):
  harness/runner/w4-l1-baseline.workflow.js     # Layer 1: static + trigger + repeatability + rubric
  harness/runner/w4-l2-baseline.workflow.js     # Layer 2: PSP generator vs 3 fixtures + L2.1-L2.6
  # via the Workflow tool — SCOPED L1 re-measure / round-2 (cost-fixed, non-clobbering):
  harness/runner/l1-delta.workflow.js           # Layer 1 L1.2/L1.3 only, parameterized by args (see §3bis)
  ```
  Manual equivalent: the scripts ARE the brief source of truth. Execute each `*Brief()` string as one
  clean-context subagent on the model its brief names. **Adapt the absolute `KIT` / `SCRATCH` / `RB`
  constants at the top of each baseline script to your machine first.** The two `w4-*-baseline` scripts
  are the **frozen record** of the 2026-07-03 run — do NOT edit them; the delta runner supersedes them
  for re-measures.
- **Outputs:** L1 → `l1/<pack>/{l1.1-static,l1.2-trigger,l1.3-repeatability,l1.4-rubric}.json` +
  `scorecard.{json,md}`. L2 → per fixture `{pre,post}-manifest.txt`, `diff-sets.md`,
  `generated/`, `PHASE9-REPORT.md`, `l2.{1,2,3,4,6}-*.md`, `run-metadata.json`, `scorecard.{json,md}`.
- **Verify (Layer 1):** each `*.json` parses (`python3 -m json.tool < f`); L1.3 ran on the **decision
  pack only** at baseline (naming/design carry `{"status":"deferred",…}` per the assembler's `l13note`
  — this is the spend-breaker adjudication, not a gap to fill).
- **Verify (Layer 2):** for each fixture, the source-integrity gate is clean:
  ```bash
  cd KIT/harness/fixtures/<name>/repo && find . -type f | sort | xargs shasum -a 256 | diff - "$R/pre-manifest.txt"
  # MUST be empty. Non-empty = the run touched the fixture source → abort, discard, file 🚨 (protocol §10).
  ```

### Step C-bis — the scoped L1 delta runner (`l1-delta.workflow.js`)

Use this instead of `w4-l1-baseline` for **targeted L1.2/L1.3 re-measures** (e.g. the W4 fast-path
re-measure of a fixed skill) and for **round-2 full L1 runs** — it inherits the v1.1 cost fix and the
non-clobber guard. The baseline scripts stay as the frozen record; this one is parameterized.

- **Everything comes from `args`** — nothing about the run is hard-coded. Shape:
  ```jsonc
  {
    "kit": "<KIT_ROOT>",        // optional; defaults to the kit root
    "outDir": "…/harness/results/2026-07-10-inversion-fix/l1",  // REQUIRED; caller-chosen
    "date": "2026-07-10",                        // REQUIRED (no argless new Date() in this runtime)
    "label": "inversion-fix",                    // NOT "baseline" (guard refuses it)
    "specVersion": "1.1",
    "channel": "v1.1-batched",                   // or "v1.0-single" (headline-delta rows)
    "batchK": 15,                                 // K ≤ 15; ignored for v1.0-single
    "scope": [                                    // which packs/skills/metrics run
      { "pack": "decision", "catalog": "<name+description frontmatter, verbatim>",
        "runL12": true,  "l12PromptSets": [ { "skill": "inversion", "prompts": [ /* the COMMITTED 10, reused verbatim */ ] } ],
        "runL13": true,  "l13Skills": { "inversion": [ /* the 5 committed positives */ ] } }
    ],
    "controls": {                                 // SPEC v1.1 rule 3 equivalence block (batched runs)
      "pinnedCatalog": "<reference-commit catalog, verbatim>", "catalogSha": "601b3c5",
      "promptSets": [ { "skill": "<stable control skill>", "prompts": [ /* committed set */ ] } ]
    }
  }
  ```
- **Reuse-verbatim, never re-author:** the script accepts pre-authored prompt sets (`l12PromptSets`)
  and positive sets (`l13Skills`) and **never writes prompts** — it has no author brief for L1.2 (spec
  §4 L1.2 / §7.2: prompt sets are committed and reused verbatim on re-runs). Only the L1.3 *paraphrase*
  author (Opus) runs, exactly as at baseline.
- **Channel selection** (`args.channel`):
  - `"v1.1-batched"` (default) — router calls take `batchK ≤ 15` prompts each, with the
    independent-judgment instruction and the `{verdicts:[{id,skill}]}` array return; L1.3 batches
    **interleave variants across skills** (round-robin — never a same-skill cluster in one call). Wilson
    CIs from batched trials are flagged **nominal** (`wilson_ci_nominal: true`) per spec §"Method
    addenda" rule 5.
  - `"v1.0-single"` — one prompt per call (the baseline channel), for headline movement-vs-baseline
    rows. Ship these alongside the equivalence block OR measure them on this channel (spec headline-delta
    rule). CIs are exact-coverage.
  - Both `measureL12` and the L1.3 rounds route through the same `routeItems(catalog, items, channel, K)`
    dispatcher — the two code paths (`CODE PATH 1` single / `CODE PATH 2` batched) are the only place the
    channel branches.
- **Refuse-to-clobber (the defect this runner fixes):** the script **throws** before doing any work if
  `args.outDir` resolves to a frozen baseline dir (`…/results/<x>baseline<y>/…`) or if `args.label`
  is `baseline`. The 2026-07-03-baseline tree is frozen (spec §2.3 / §7); a delta run MUST target a new
  dated dir. There is **no code path** that can write into the baseline tree.
- **Main-loop-writes-results (no recorder agents):** the workflow **RETURNS** the assembled result JSON;
  it never uses a Haiku recorder and never touches the filesystem. **You (the main session) write the
  returned payload** under `args.outDir` — e.g. `l1.2-trigger.json`, `l1.3-repeatability.json`, and the
  equivalence block — then run `python3 -m json.tool` on each and assemble the scorecard exactly as the
  baseline assembler did. This closes HD-9's recorder-truncation channel for delta-sized payloads (§6
  gotcha 6). For round-2 **full** runs whose payload is too large for main context, see the recorder
  rule in §6 gotcha 6 before reintroducing a recorder.
- **Equivalence demonstration (batched runs):** when `channel` is batched and you claim any metric
  MOVEMENT vs a v1.0-measured baseline, pass `args.controls` with a **pinned reference catalog** so the
  router channel is the only variable; the returned `equivalence_controls` block must reproduce the
  control rows' reference values within the baseline Wilson CIs (spec §"Method addenda" rule 3–4).
- **Verify:** `node --check harness/runner/l1-delta.workflow.js` passes; the returned JSON's
  `channel` / `batch_k` fields match what you requested; every published number recomputes from the
  returned `raw_router_outputs` / `trials_by_skill` (spec §2.2).

### Step D — post-run injections (executor: you + the calibration model)

1. **L2.5 cost** — read the orchestration harness's per-agent token/turn report for each generator
   runner. Inject `tokens`, `duration_s`, `turns`, `method`, `caveat` into `run-metadata.json.l2_5`
   AND `scorecard.json.metrics.L2.5`, and add the dated line to the twin's `## Post-run injections`
   section. **Directional always** (spec §5 L2.5). Reference values: greenfield 273137 tok / 1074s;
   brownfield-api 328446 / 1137s; brownfield-docs 308393 / 1279s.
2. **§6 calibration** — the **strongest available model** (Fable 5) independently re-judges a ~10%
   subsample, **cap 15 items**, stratified across L1.2 / L1.4 / L2.4 / L2.6, **selection rules stated
   BEFORE looking at any original verdict** (deterministic, recorded). Publish exact-agreement +
   (for 1–5 rubrics) ±1-agreement. **Worked example to copy the shape/honesty from:**
   `harness/results/2026-07-03-baseline/calibration-fable.md` (note it documents where blindness was
   only partial rather than smoothing it over). Inject aggregates into each scorecard's `calibration`
   block + the twin's injections section.
   - **Verify:** §6 invalidation check — if >1/3 of a *representative* subsample disagrees, that
     metric's run is invalid pending rubric revision (= new spec version). The baseline's adversarial
     probe (1/4 vs router) is biased-by-design and does NOT trigger this — read the record's note.

### Step E — scorecard grades (executor: you, per SCORECARD-FORMAT.md)

- **Input:** the emitted `scorecard.json` files.
- **Compute:** per-metric bands + worst-of overall + the L2.3 / source-integrity F-cap, per
  `harness/SCORECARD-FORMAT.md` §3. Grades are presentation-only; **never write them into the
  scorecard** and **never show a grade without its number** (spec §2.4).
- **Verify:** every graded number maps to a §10 metric ID; a number with no binding is a defect
  (SCORECARD-FORMAT §4 exit 2).

### Step F — commit results (executor: you, in a shell)

- **Retain + commit** the spec §7.2 raw-artifact list per run: `generated/` tree, `pre-`/`post-manifest.txt`,
  prompt sets + paraphrase sets, per-trial router-sim outputs, judge outputs with evidence quotes,
  run logs, `PHASE9-REPORT.md`, `run-metadata.json`, `scorecard.{json,md}`.
- **Rule:** every published figure must be recomputable from these alone (spec §2.2). A number with
  no backing artifact does not ship.
- **Watch the two `.gitignore` gotchas** (§6 below) — verify tracked-file count vs disk after
  committing (`git status --porcelain` clean; `git ls-files harness/results/<dir> | wc -l` matches
  `find harness/results/<dir> -type f | wc -l`).

## 3bis. Lifecycle protocols (LC-1..LC-3, spec v1.2)

The lifecycle metrics run off two pre-registered instruments in `harness/lifecycle/` — manual
briefs, no runner script yet (deliberately: the survival flow has a mid-pass human gate the
batch runners don't model; scripting is deferred until the protocol survives two runs):

- `harness/lifecycle/UPGRADE-SURVIVAL-PROTOCOL.md` — LC-3: customize a manifest-backed install,
  run `generator/UPGRADE_MODE.md` end-to-end, measure customization survival (silent-overwrite
  hard gate = 0). Substrate is COPIED out of the frozen baseline by the orchestrator; results
  land only in a new dated dir (never `*baseline*`).
- `harness/lifecycle/UX-REHEARSAL-PROTOCOL.md` — LC-1/LC-2 + the fresh-context lifecycle
  verification (cold PSP paste on a synthetic non-fixture repo, boundary-stop + resume,
  firewalled verifier).

Same discipline as §3: retain + commit every raw artifact the published numbers need
(spec §2.2), checkpoint between agents (§6bis), circuit breakers (§7) apply unchanged.

## 4. Model-routing table (as run — frozen per spec §3)

| Role | Model | Notes |
|---|---|---|
| Generator runner (L2), rubric judge (L1.4), all L1.2/L2 scorers, adversarial reviewer (L2.6), assemblers-if-Opus | `claude-opus-4-8` | The model class real users run. **The generator NEVER runs on Fable** (spec §3). |
| Router-sim (L1.2/L1.3), catalog extraction, JSON recorders | `claude-haiku-4-5` | Cheap, mechanical, high call-count. |
| Static scorer (L1.1), collectors, scorecard assemblers | `claude-sonnet-5` | Mechanical mid-tier. |
| Calibration re-judge (§6) | `claude-fable-5` | Strongest available; blind subsample; **never runs the generator.** |

## 5. Expected variance (what may differ from the committed baseline — spec §7.4)

| Metric | Determinism | Tolerance before you suspect a defect |
|---|---|---|
| L1.1 static PASS | deterministic given identical trees | any change → investigate |
| L1.2 trigger F1 | stochastic | moves within its per-skill CIs; a swing outside → investigate |
| L1.3 repeatability | stochastic | proportions move within their Wilson CIs |
| L2.1 checklist | stable statuses | section statuses stable; reason **wording** varies freely |
| L2.2 recall | mostly stable | ±1 signal at the margin |
| L2.3 destructive count | deterministic given identical trees | **any nonzero change → investigate immediately** |
| L2.4 false-content | stochastic | ±1–2 with reviewer stochasticity |
| L2.5 cost | free | **varies freely — directional only**, never a defect signal |
| L2.6 defect count | stochastic | ±1–2 with reviewer stochasticity |

Two honest runs differ only in *these* values — never in *what* was measured or *how* (spec §7.4).

## 6. Known gotchas (each with its fix)

1. **Unanchored `.claude/` in a repo-root `.gitignore`** swallows generated results trees → the kit
   rule is now **root-anchored `/.claude/`** (`.gitignore:11`). Fix: anchor it.
2. **A fixture's own nested `.gitignore`** can swallow fixture files at commit time (happened:
   greenfield `next-env.d.ts`, fixed in `4a43ebf`). Fix: after committing fixtures, verify
   `git ls-files` count == `find … -type f` count.
3. **Committed `generated/` trees contain live `.claude/skills/` dirs** that a Claude Code session
   surfaces as directory-scoped skills. Harmless — ignore them.
4. **The generator runner must NEVER see `FIXTURE-CARD.md`** — only the extracted "Scripted operator
   answers" block (Step B.3 awk / the runner's `PROFILES`). Fix: pass only the extracted block.
5. **`snyk-agent-scan` degrades without `SNYK_TOKEN`** → record as **N/A**, not a failure (spec §3:
   N/A-until-environment is honest status).
6. **Haiku recorder silently truncates large JSON while keeping it parseable (HD-9).** Root cause of the
   baseline data-loss incident: the L1.3 recorder was handed a large `trials_by_skill` payload; the
   Haiku RECORDER wrote a **truncated** file that **still passed `python3 -m json.tool`** — so the
   parse-check gave a false green, and per-trial data for 11/12 skills was lost (recovered byte-exact
   from the orchestration journal, W7 finding F1). A valid-JSON check does NOT prove completeness. Two
   rules:
   - **(a) Delta-sized runs skip recorder agents entirely.** `l1-delta.workflow.js` RETURNS the result
     JSON and the **main loop writes it** — no Haiku recorder in the loop for L1 re-measures (Step
     C-bis). This is the default; prefer it.
   - **(b) When recorders ARE unavoidable** (round-2 full runs with a payload too big for main context),
     the recorder brief **MUST include a key-count + byte-count echo** that the orchestrator **verifies
     against the source payload** before accepting the write: the recorder returns `{keys:<N>,
     bytes:<M>}` computed from what it wrote; the orchestrator compares `N`/`M` to the source object's
     key count and `JSON.stringify(...).length` and **rejects the write on any mismatch** (re-dispatch,
     do not accept). A parseable file is necessary but not sufficient — the count echo is the
     completeness gate.

## 6bis. Checkpoint discipline (no fire-and-forget past a boundary)

The baseline's ~10× spend surprise (ADJ-3: projected 1.5–2.5M, actual ≈23.7M) happened because a
fire-and-forget workflow exposes cost **only at completion** — the §7 spend breaker literally cannot
fire mid-run if control never returns to the orchestrator loop until the chain is fully spent.

- **No fire-and-forget past a workstream/stage boundary.** At each boundary (per pack, per phase, per
  workstream) control must return to the orchestrator so it can compare **actual spend vs plan**.
- **The ≥2× rule:** at each boundary, if actual spend ≥ 2× the pre-launch estimate
  (`call_count × ~31.5k`, §1), **STOP and surface to the operator** — do not launch the next stage
  (spec §7.5). The baseline breaker "never fired" precisely because there was no boundary to check at.
- `l1-delta.workflow.js` helps by design — it batches (fewer calls to overshoot on) and returns per
  pack, giving natural checkpoints — but the discipline is the operator's, not the script's.
- **Cross-reference:** KB-04 §4.9 anti-pattern **"Fire-and-forget subagent chains"** — the four-teeth
  fix (return-to-loop boundaries + pre-launch cost math + the breaker + a hard cap).

## 7. Circuit breakers (stop conditions)

- **L1.3 early-stop:** stop sampling a skill once the Wilson half-width **≤ 0.08** (a clean skill
  stops at n≈25; `repeatability.md`). n<20 without a breaker-stop ships with the small-n caveat.
- **Spend breaker (spec §7.5):** every subagent brief carries a token estimate; projected **~2×
  overrun → STOP and surface to the operator.** (This is why baseline L1.3 was decision-pack-only.)
- **L2.3 > 0 → the run FAILED.** File a 🚨 defect, publish the count honestly, **do NOT tune** the
  generator or answer key to make it pass (that is a spec change, not a fix).

## 8. What NOT to do

- **Never edit a metric after seeing results.** A metric change requires a NEW dated spec version
  and a re-run (spec §2.3 / §7). Retro-editing is the one unrecoverable integrity break.
- **Never tune rubrics, gates, or answer keys to pass a run.** Weak scores are published and filed as
  defects (spec §2.3).
- **Never let the generator runner read `harness/`, `feedback/`, `case-studies/`, or the fixture
  card** (BENCHMARK-PROTOCOL §4(e)). It sees only the workdir copy + the scripted operator block.
- **Never run the generator on a Fable-class model** (spec §3). Fable is calibration-only; the
  generator must run on the model class real users run (Opus 4.8).
- **Never grade off a composite/average** — overall grade is worst-of (SCORECARD-FORMAT §3b); a
  weighted composite invites gaming and is explicitly rejected.
