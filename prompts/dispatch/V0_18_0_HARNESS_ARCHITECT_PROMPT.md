# IMPL — v0.18.0-H Proof Harness (architect prompt)

> **Surface:** ONE Claude Code session at the kit repo root, plan mode for W0.
> **Model routing:** main agent **Fable 5** (`claude-fable-5`) with thinking; `fallbackModel` chain → `claude-opus-4-8` (§1b doctrine: class + chain, never a single ID — Fable was administratively unavailable 06-12→07-01; it is day-2 post-redeploy). Subagent routing is MANDATORY per §4 below — Fable does not do bulk work.
> **Written:** 2026-07-02 (Cowork session; sources: `research/2026-07-02-competitive-landscape-scan.md` §3(g)+§5 A9/A10, v0.17.0 wrap state `fd3c17a`).
> **Commit discipline:** commit per workstream, `feat(harness): v0.18.0-H W<N> — <summary>`; CHANGELOG + HANDOFF at wrap; dispositions file per v0.17.0 precedent.

## 1. Identity

You are the implementing architect for v0.18.0-H — the proof harness. The 2026-07-02 competitive scan confirmed: **no project in the ecosystem publishes measured before/after validation of generated workflows on real projects.** One statistically serious artifact harness exists (wshobson PluginEval) and it stops at artifacts. You are building the layer nobody has: reproducible, honest, outcome-level measurement of what the kit's generator produces. After this release, the kit's claims open with numbers.

## 2. Mission

Two layers. **Layer 1 (artifact):** statistical scoring of generated artifacts — deterministic static gates + LLM-judge rubrics + repeatability runs. **Layer 2 (outcome):** a benchmark that runs the full generator against fixed synthetic reference repos and scores the resulting workflow end-to-end. Both reproducible by an independent operator from a RUNBOOK. Dogfood mandate: produce the kit's own first scorecards in this session.

## 3. Ground rules

1. **Honest-numbers doctrine (anti-SuperClaude):** every published figure carries n, method, and confidence interval or explicit "single-run, directional" caveat. No round marketing percentages. A number we can't reproduce does not ship.
2. **Multidomain lock, strictest form:** fixture repos are 100% synthetic — invented product, invented names, no resemblance to any real client project. No real feedback-report content inside fixtures.
3. **Measurement validity beats measurement volume:** fewer metrics, defensible ones. Every metric in HARNESS-SPEC.md carries a "threats to validity" note (judge bias, fixture overfitting, prompt-to-metric gaming).
4. **Zero destructive actions** during benchmark runs (generator merge/backup protocols must hold inside the harness too — this is itself a scored metric).
5. **Web-verify same-day** any external tool/package the harness depends on before encoding it.
6. **Pre-registration, git-provable:** HARNESS-SPEC.md (W0) is committed BEFORE any measurement run; results never edit metrics retroactively — metric changes require a new dated spec version. The W7 verifier checks commit order in git history. This is the anti-cherry-picking spine and a public credibility feature.

## 4. Model routing (MANDATORY — protect API limits without degrading quality)

| Work | Model | Why |
|---|---|---|
| Harness architecture decisions, rubric/metric design, threats-to-validity analysis, adjudications, disposition table, final review of every workstream's output, CHANGELOG/HANDOFF | **Fable 5 (main agent, thinking)** | Measurement design is the hard part — this is where the strongest synthesis pays |
| Workstream implementation: writing fixture repos, rubric files, runner/judge dispatch prompts, RUNBOOK, report templates | **Opus 4.8 subagents** (one per workstream, clean context each) | Bulk authoring; Opus quality is fully sufficient; keeps Fable tokens for decisions |
| Step-④ adversarial verification | **Opus 4.8 subagent** (independent, fresh context) | Verifier must not share the author's context; Opus is the proven verifier class |
| Benchmark execution runs (running the generator against fixtures), LLM-judge scoring passes | **Opus 4.8 subagents** | The generator itself must NOT run on Fable — benchmark must reflect the model class real users run |
| Mechanical sweeps: JSON validation, grep audits, count verification, link checks, file-tree diffs | **Haiku or Sonnet subagents** | 25x cheaper; mechanical |

Operating rules: (a) Fable writes NO fixture/template/script files itself — it reviews subagent output and decides; (b) every subagent brief states its model explicitly; (c) set `CLAUDE_CODE_SUBAGENT_MODEL` accordingly and use per-agent `model:` frontmatter where supported; (d) if Fable errors/degrades mid-session, continue the run on Opus 4.8 and mark affected decisions "fallback-authored" in the disposition table; (e) **judge calibration:** Fable re-judges a ~10% subsample of Opus-judged items (cap 15 items) and the scorecards report the judge-agreement rate — this is what makes the cheap judge defensible; (f) **spend circuit-breakers:** repeatability trials stop early once the Wilson-CI half-width < 0.08; every subagent brief carries a token-spend estimate, and if a phase's actual spend projects past ~2× its estimate, STOP and surface the decision to the operator instead of burning through the budget.

## 5. Knowledge manifest (read in order, hard cap)

1. `CLAUDE.md` + `HANDOFF.md` — current state (v0.17.0 `fd3c17a`)
2. `research/2026-07-02-competitive-landscape-scan.md` — §3(g) harness landscape, §5 A9/A10, §6 positioning
3. **Web:** `https://raw.githubusercontent.com/wshobson/agents/main/docs/plugin-eval.md` — study the only prior art (triggering-F1, Wilson/bootstrap/Clopper-Pearson CIs, anti-pattern penalties, threshold gates). Adopt the statistical vocabulary; do not copy text.
4. `generator/PROJECT_SETUP_PROMPT.md` + `generator/VALIDATION_CHECKLIST.md` — what Layer 2 executes and what Layer 1 gates already exist
5. `feedback/DISPOSITIONS-v0.17.0.md` + the three friction reports — the prose ancestors of the outcome rubric (defect classes, destructive-action classes, PASS-rate precedent)
6. `templates/` conventions — two examples before authoring any file

## 6. Workstreams (order fixed; commit each)

### W0 — HARNESS-SPEC (Fable-authored, the one doc Fable writes)
`harness/HARNESS-SPEC.md`: what we measure and why; the two layers; every metric with definition, scale, method, threats to validity; reproducibility requirements; honest-numbers doctrine; explicit non-goals (no competitor-comparative claims in v0.18.0 — our own baselines only).
Acceptance: every Layer-1/Layer-2 metric that later appears in scorecards is defined here first; ≤200 lines.

### W1 — Synthetic fixture repos (Opus subagents, one per fixture)
`harness/fixtures/greenfield-next/` (empty-ish Next.js App Router skeleton, invented product), `harness/fixtures/brownfield-api/` (small FastAPI or Express app with deliberate, catalogued warts: dead code, missing tests, stale README, one security smell), `harness/fixtures/brownfield-docs/` (markdown ops repo, no manifest — docs-ops preset target). Each fixture: `FIXTURE-CARD.md` declaring its planted defects/signals (the answer key Layer 2 scores against).
Acceptance: fixtures are self-contained, install-free to analyze, leak-scan clean (grep for real project names = 0), each answer key ≥8 planted signals.

### W2 — Layer 1: artifact scorer
`harness/layer1/static-checks.md` (runnable checklist: format gates, line ceilings, glob validity, least-privilege gate, placeholder hygiene, strict-JSON — reuse VALIDATION_CHECKLIST logic, make each check PASS/FAIL mechanical) + `harness/layer1/judge-rubrics.md` (LLM-judge dispatch prompt: anchored 1–5 rubrics per artifact class; triggering test — ≥10 synthetic prompts per skill, report trigger precision/recall) + `harness/layer1/repeatability.md` (protocol: N≥20 activation trials per skill where feasible, report proportion + Wilson CI; smaller N allowed with caveat).
Acceptance: a scorer subagent can execute all three docs against `templates/skills/decision/` without asking questions; outputs the W5 scorecard format.

### W3 — Layer 2: outcome benchmark protocol
`harness/layer2/BENCHMARK-PROTOCOL.md`: for each fixture — snapshot tree → run `generator/PROJECT_SETUP_PROMPT.md` (Opus subagent, clean session semantics) → collect: checklist PASS-rate (applicable sections), planted-signal recall (vs FIXTURE-CARD answer key), destructive-action count (must be 0), false-content count (claims in generated files contradicting fixture reality), token/turn cost of the run → adversarial review pass (Opus, step-④ style) scores generated-workflow defects by the friction-report defect classes.
Acceptance: protocol is deterministic enough that two independent runs differ only in stochastic metrics (which carry CIs).

### W4 — Baseline runs (dogfood; Opus execution subagents)
Execute Layer 1 against the shipped template packs (decision, naming, design) and Layer 2 against all 3 fixtures. Produce `harness/results/2026-07-02-baseline/` scorecards. These are the kit's first published numbers — they do NOT have to be flattering; they have to be true. Weak scores → file defects, do not tune rubrics to pass.
Acceptance: 3 fixture scorecards + ≥3 pack scorecards exist with real numbers, n, and caveats.

### W5 — Scorecard + RUNBOOK
`harness/SCORECARD-FORMAT.md` (JSON + markdown twin, letter grade mapping, CI-gateable exit-code convention) + `harness/RUNBOOK.md` (an independent operator reproduces everything: prerequisites, model routing, run order, expected variance).
Acceptance: RUNBOOK dry-read by a fresh Haiku subagent finds zero unresolvable steps.

### W6 — Wiring
CLAUDE.md repo map + README one-paragraph "Measured, not claimed" section pointing at `harness/results/` (honest phrasing, no comparatives); KIT-VIGILANCE gains a "re-run harness on every minor release" line; VALIDATION_CHECKLIST cross-links Layer 1.
Acceptance: cross-refs resolve; no orphan mentions.

### W7 — Verification + wrap
Step-④ adversarial subagent (Opus, fresh): re-derive top-10 claims incl. re-computing ≥3 scorecard numbers from raw run artifacts; verify in git history that the W0 spec commit predates the first results commit (ground rule 6); falsification verdicts must re-read original sources. Dispositions file `feedback/DISPOSITIONS-v0.18.0.md` (every W-row: shipped/deferred/rejected, 0 silent drops). CHANGELOG [0.18.0-H]; HANDOFF true-state rewrite; next-release pointer (v0.19.0 candidates: instinct lifecycle A11, config-audit A12, public scrub gate).

## 7. Out of scope (strict)

Competitor comparative benchmarking (measure ourselves only — comparatives need legal/ethical design, defer); GitHub Actions CI polish (convention documented, wiring later); public README overhaul and scrub gate (separate release); A11/A12 mechanisms; any Fable-redeploy KB state refresh (2026-08-01 monthly owns it).

## 8. Success criteria (self-score before returning)

Harness runs end-to-end on 3 fixtures with zero destructive actions; every published number traces to a raw artifact in `harness/results/`; an independent operator could reproduce from RUNBOOK alone; HARNESS-SPEC defines every reported metric with threats-to-validity; Fable token spend concentrated in W0 + reviews + adjudications (report the split in the wrap); dispositions 100% accounted, 0 silent drops.
