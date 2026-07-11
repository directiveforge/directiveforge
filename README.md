# DirectiveForge

> An AI-workflow generator that publishes its own report card. It reads your codebase and forges a project-specific workflow — rules, skills, commands, agents, MCP config, memory — then measures the pieces it ships against a pre-registered harness and commits the raw scores, weak grades included.

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.20.0-black.svg)](CHANGELOG.md)

## The delta table

The last release published F grades. Then it fixed the causes at their named homes and re-measured on frozen instruments. Every row below traces to a committed artifact that ships in this repo — open it and check.

| What was broken (published as F) | Baseline | Post-fix | Instrument note |
|---|---|---|---|
| `inversion` skill — trigger F1 | 0.3333 | **0.75** | v1.0 single-call channel, same instrument as baseline · [`.../l1/decision/scorecard.md`](harness/results/2026-07-03-delta/l1/decision/scorecard.md) |
| `inversion` — activation repeatability | 0.3333 [0.1923, 0.5122], n=30 | **0.8333 [0.6644, 0.9266]**, n=30 | Wilson 95% CIs do not overlap · [`.../DELTA.md`](harness/results/2026-07-03-delta/DELTA.md) |
| `anti-sycophancy-meta` — trigger F1 | 0.5714 | **0.8889** | v1.0 channel · [`.../l1/decision/scorecard.md`](harness/results/2026-07-03-delta/l1/decision/scorecard.md) |
| `anti-sycophancy-meta` — activation | 0.2667 [0.1418, 0.4445], n=30 | **0.8333 [0.6644, 0.9266]**, n=30 | CIs do not overlap · [`.../DELTA.md`](harness/results/2026-07-03-delta/DELTA.md) |
| `name-generation` — trigger F1 | 0.8889 | **1.0** | v1.1 batched channel + equivalence block · [`.../l1/naming/scorecard.md`](harness/results/2026-07-03-delta/l1/naming/scorecard.md) |
| brownfield-api — false-content count | 4 | **0** | all 4 planted traps cited only WITH a drift flag · [`.../brownfield-api/l2.4-false-content.md`](harness/results/2026-07-03-delta/brownfield-api/l2.4-false-content.md) |
| brownfield-api — planted-signal recall | 0.90 | **1.00** (10/10) | same fix; the Heroku trap now detected as a correctly-flagged negative · [`.../brownfield-api/l2.2-signals.md`](harness/results/2026-07-03-delta/brownfield-api/l2.2-signals.md) |
| brownfield-docs — destructive-action count | 1 (hard F-cap) | **0** | backup + audit-trail manifest; hard cap lifts · [`.../brownfield-docs/l2.3-destructive.md`](harness/results/2026-07-03-delta/brownfield-docs/l2.3-destructive.md) |
| brownfield-docs — link-gate false positives | 13 FP (drowned 2 real dead links, exit 0) | **0 FP** (same 2 real dead links kept, exit 1) | canonical resolver + code-fence stripping · [`.../brownfield-docs/l2.6-linkgate-slice.md`](harness/results/2026-07-03-delta/brownfield-docs/l2.6-linkgate-slice.md) |

Grades on the measured slice: the decision pack moved **F → B band** (the F-driver L1.3 MIN 0.2667 → 0.8333); brownfield-api moved **F → A band** on the measured metrics; brownfield-docs' hard F-cap lifts. Full derivation and scope caveats: [`harness/results/2026-07-03-delta/DELTA.md`](harness/results/2026-07-03-delta/DELTA.md).

**Regressions ship too.** One skill got worse in the same release: `disconfirming-evidence-first` F1 fell **0.9091 → 0.8889** — the boundary rewrite that fixed its poem false-positive also lost a tone-check positive. That is a real trade, not variance, and it is in the delta table alongside the wins ([`DELTA.md` §Regressions](harness/results/2026-07-03-delta/DELTA.md)). We publish the row that costs us, because a report card that only shows the good numbers is marketing.

## Measured, not claimed

The harness is pre-registered. The measurement spec (`harness/HARNESS-SPEC.md`) is committed **before** any run — the release verifier checks in git history that the spec's first commit predates the first results commit, so metrics can never be redefined after seeing the numbers. Rubrics, answer keys, and fixtures are frozen; tuning them to pass a run is a spec change, a new dated version, and a re-run, not a quiet edit.

Every published figure carries its **n**, its **method**, and a **95% CI** — or an explicit "single-run, directional" caveat where a single run is all that exists. No round marketing percentages. A number that cannot be recomputed from a committed raw artifact does not ship.

- **Pre-registered spec + reproduction:** [`harness/HARNESS-SPEC.md`](harness/HARNESS-SPEC.md) · [`harness/RUNBOOK.md`](harness/RUNBOOK.md)
- **The delta story (baseline → fixes → re-measure):** [`harness/results/2026-07-03-delta/DELTA.md`](harness/results/2026-07-03-delta/DELTA.md)
- **Baseline scorecards (the F grades, as recorded):** [`harness/results/2026-07-03-baseline/`](harness/results/2026-07-03-baseline/)
- **Judge calibration:** a Fable-5 blind re-judge of the rubric scores agreed with the primary judge **exact 18/20 (0.90)** and **within ±1 on 20/20 (1.00)** ([`calibration-fable.md`](harness/results/2026-07-03-baseline/calibration-fable.md)) — evidence the judge discriminates rather than flatters.

## 60-second quickstart

**1 — Install the skills + commands as a plugin** (fastest path):

```bash
claude plugin marketplace add directiveforge/directiveforge
claude plugin install directiveforge
```

This installs the 22 measured skills (decision / naming / design packs) and the workflow commands, including `/report-friction` (invoked as `/directiveforge:report-friction` when installed as the plugin).

**2 — Generate a project-specific workflow** (Claude Code or Cursor): open a session at the root of your target project and paste [`generator/PROJECT_SETUP_PROMPT.md`](generator/PROJECT_SETUP_PROMPT.md). The generator reads your codebase, asks you a short profile of questions, and writes your `CLAUDE.md`, `.cursor/rules/*.mdc`, `.claude/commands/`, agents, and MCP config — tailored to your stack.

**3 — Cursor skills:** Cursor consumes skills as files. Copy `templates/skills/<pack>/` into your project per [`workflows/WORKFLOW-CURSOR.md`](workflows/WORKFLOW-CURSOR.md).

Full walkthrough: [`QUICK_START.md`](QUICK_START.md).

## What this is

- **A generator, not a catalog.** It reads your codebase and synthesizes a workflow for *your* stack and conventions. It does not hand you a pile of prebuilt components to pick from.
- **22 measured skills** across three packs — decision (12), naming (6), design-elevation (4) — each with trigger and activation numbers in the harness results, not just prose.
- **A proof harness** that scores the generator on itself first: artifact-level statistical scoring (trigger F1, activation repeatability with CIs, anchored rubrics) plus an end-to-end generator benchmark on synthetic fixture repos with answer keys.
- **A vigilance loop** that scans the AI ecosystem daily, synthesizes weekly, and integrates monthly — so the kit's knowledge does not silently rot as models and frameworks move.

## What this is NOT

- **Not a CLI or a SaaS.** There is no binary and no server. The plugin installs skills; the generator is a prompt you paste; upgrades run through a manifest.
- **Not a 200-skill catalog.** 22 skills, each with a published trigger score. Breadth is not the pitch; measurement is.
- **Not infrastructure benchmarks.** We do not publish latency, RSS, or throughput numbers. The harness measures workflow-artifact quality and generator behavior on fixtures — a different axis entirely.
- **Not autonomous.** The generator asks before it writes. Upgrade mode DRY-RUNs by default and shows you a plan. `/report-friction` never submits anything without your explicit review. Nothing edits your repo behind your back.
- **Not self-congratulatory.** The baseline published F grades. That is the point — the numbers are recorded before they are fixed, and the regressions ship in the same table as the wins.

## Architecture

```
directiveforge/
├── README.md                 # you are here
├── LICENSE                   # MIT
├── QUICK_START.md            # install + first generation walkthrough
├── CHANGELOG.md              # version history
├── .claude-plugin/           # plugin.json + marketplace.json (one-command install)
├── plugin/                   # plugin-packaged commands (incl. /report-friction)
├── PROVENANCE.md             # how this public repo relates to the private lab (SHAs attested)
├── SCRUB-TRANSFORM.md        # the privacy transform, disclosed + reproducible
├── scripts/
│   ├── build-snapshot.sh     # builds the public snapshot from the private tree
│   ├── scrub-check.py        # leak-scan gate (ships public-safe patterns only)
│   └── verify-transform.sh   # one-command reproduction of the privacy transform
├── knowledge-base/           # the doctrine (10 files)
│   ├── KB-01-AI-WORKFLOW-ENGINEERING.md      # HOW: context, memory, RAG, prompts, MCP, cost
│   ├── KB-02-AI-PROJECT-INFRASTRUCTURE.md    # WHAT: rules, skills, agents, blueprints
│   ├── KB-03-CATALOG-PIPELINE-ARCHITECTURE.md# DATA: multi-source catalog pipelines (optional pack)
│   ├── KB-04-DECISION-ENGINEERING.md         # DECISIONS: locks, 3-layer research, dispatch
│   ├── KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md # 12 decision skills, anti-sycophancy
│   ├── KB-06-MANAGED-AGENTS.md               # hosted-agent evaluation + containment (beta-bounded)
│   ├── KB-07-BRAND-NAMING.md                 # naming pipeline (optional pack, 6 skills)
│   ├── KB-08-DESIGN-ELEVATION-ENGINEERING.md # design quality by measurement (optional pack, 4 skills)
│   └── MCP-SERVER-REGISTRY.md                # curated MCP servers + security postures
├── workflows/                # IDE guides, migration, vigilance cadence, routing behavior
├── generator/                # the main deliverable
│   ├── PROJECT_SETUP_PROMPT.md               # paste into a session at your target project
│   ├── UPGRADE_MODE.md                       # manifest-diff upgrade planner (DRY-RUN default)
│   ├── VALIDATION_CHECKLIST.md               # post-generation verification
│   └── presets/                              # stack-specific additions (Next.js, FastAPI, Node, docs-ops)
├── templates/                # copy-ready templates with {{PLACEHOLDER}} syntax
│   ├── cursor/ · claude-code/ · shared/
│   └── skills/               # decision (12) + naming (6) + design (4) = 22 measured skills
├── harness/                  # the proof harness
│   ├── HARNESS-SPEC.md · RUNBOOK.md · SCORECARD-FORMAT.md
│   ├── layer1/ · layer2/ · fixtures/ · runner/
│   └── results/              # dated scorecards (baseline + delta + DELTA.md)
├── feedback/                 # per-release DISPOSITIONS (every report answered, zero silent drops)
├── vigilance/                # watchlist + digest feeds (daily/weekly/monthly)
├── case-studies/             # ships empty (with its README) — client instances stay private
├── research/                 # raw research + dated dossiers
└── prompts/                  # research + dispatch prompt libraries
```

## Upgrading

Two upgrade paths, both explicit:

- **Plugin:** a version bump through the marketplace. `plugin.json` pins `version` (currently `0.20.0`), so your installed skills and commands update through the normal plugin flow.
- **Generated workflow:** the generator writes an `.ai-kit-manifest.json` into your project recording which files, versions, and hashes it installed. [`generator/UPGRADE_MODE.md`](generator/UPGRADE_MODE.md) diffs your manifest against the current kit and produces a 3-way plan — keep / upgrade / adjudicate — and **DRY-RUNs by default**. You see the plan before anything changes.

## Freshness

Knowledge rots silently — the modal failure mode of any knowledge base in a fast field. The vigilance loop is the fence: a **daily** scan of a curated, severity-tagged watchlist; a **weekly** synthesis that separates signal from noise; a **monthly** integration that turns sustained signal into kit updates through a reviewed session (never an auto-merge). Doctrine: [`workflows/KIT-VIGILANCE.md`](workflows/KIT-VIGILANCE.md).

**The public promise:** a **weekly digest** — what moved upstream, what it means for kit users, what shipped or is queued, and the open friction-report count with disposition status — published to GitHub Releases/Discussions. Format spec: [`vigilance/PUBLIC-DIGEST-FORMAT.md`](vigilance/PUBLIC-DIGEST-FORMAT.md). The first issue posts at launch on the repo's Releases page.

## Honest limitations

Specific, not boilerplate. These are the things we know are not settled, each with a home in the committed record.

- **Not everything was re-measured.** The delta re-ran only the metrics that carried an F: L1.1 (static gates) and L1.4 (rubric scores) were not re-measured post-fix, and the greenfield L2 fixture was deferred to public harness round 2. "Absent, not zero" — see the scope notes in [`DELTA.md`](harness/results/2026-07-03-delta/DELTA.md) and each scorecard header.
- **Single-run directionality.** Layer 2 and the L1.2 claim rows are single re-measure runs per channel; where a metric is not CI'd, it is labelled directional, not proven. ([`DELTA.md`](harness/results/2026-07-03-delta/DELTA.md), method note.)
- **Batched-channel CIs are nominal.** The L1.3 activation CIs were measured on the batched router channel; per-trial batch interleave is not yet auditable from the artifacts (the trials carry no batch id — filed for harness round 2). Equivalence to the single-call channel is demonstrated on pinned controls, but the CIs ship flagged nominal. ([`.../l1/decision/scorecard.md`](harness/results/2026-07-03-delta/l1/decision/scorecard.md).)
- **The L2.1 checklist is the kit's own instrument.** It measures self-consistency, not external quality — circular by construction. The circularity was hardened (an independent re-score moved from 0/3 to 3/3 agreement on the F-defect classes), but the checklist is still self-authored. Answer-key-scored metrics (L2.2/L2.4/L2.6) are the external check.
- **Judge-model dependence.** Trigger routing is simulated with Haiku and rubric scores are judged by Opus; both are LLM judges. The Fable blind re-judge calibrates the rubric judge (18/20 exact), but the metrics inherit a model dependence — a different judge could move borderline rows.
- **Synthetic-fixture boundary.** Layer 2 runs against synthetic reference repos with answer keys, not real projects. **We make no claim that the kit improves real-project outcomes.** Nobody in the ecosystem measures that yet — including us. What we measure is generator behavior on known fixtures.
- **A regression shipped this release** (disclosed above): `disconfirming-evidence-first` F1 0.9091 → 0.8889. Filed for the next patch.
- **Six residual defects are open.** N1 (generated files leaking the generator's own working paths) is fixed at the generator level this release; N2–N6 are queued for v0.20.1: `kit_version` self-reports the prior version from a CHANGELOG-heading lag; the shipped regression above; a `research-synthesizer` section-heading mismatch (and one generation drop of that section); a collision-lint failure on boilerplate 4-grams in a few skill descriptions; and a command-duplication redundancy across the generated trio. Each is one line in [`feedback/DISPOSITIONS-v0.19.0.md`](feedback/DISPOSITIONS-v0.19.0.md).
- **The re-measure breached its own token budget by 5.9%** — 2,647,476 tokens against a ≤2.5M cap, reported rather than hidden. The cost *architecture* held (a measurement surface that cost ~23.7M under the old channel was delivered for ~2.6M via the batched channel, equivalence verified on a pinned catalog); the *estimate* missed on one phase. ([`DELTA.md` §Cost](harness/results/2026-07-03-delta/DELTA.md).)
- **Three evidence artifacts are partly withheld for privacy.** Of 67 hash-bridged harness artifacts in the public snapshot, 3 carry `bridge_class=withheld`: a client-name reference in generated output was neutralized. The forward hash and the original-hash anchor stay externally verifiable; the inverse is operator-attested, because the replaced string is a client reference the privacy rule forbids disclosing. Fixture regeneration retires the exception in round 2. See [`SCRUB-TRANSFORM.md`](SCRUB-TRANSFORM.md) and [`PROVENANCE.md`](PROVENANCE.md).

## Feedback

Found friction? Run **`/directiveforge:report-friction`** in a session. It harvests the defect (file:line, expected vs actual, severity), buckets your project profile without naming it, runs a mechanical sanitization pass over paths/names/emails, and renders the report in the feedback taxonomy — then stops at a **review gate**. Nothing is submitted until you approve it. On approval it opens a labelled GitHub issue (or falls back to a paste URL).

**The disposition guarantee:** every report is answered in a public `DISPOSITIONS` file with an explicit disposition — fixed, deferred-with-reason, or rejected-with-reason. **Zero silent drops.** See [`feedback/`](feedback/) and, for the shape of the accounting, [`feedback/DISPOSITIONS-v0.19.0.md`](feedback/DISPOSITIONS-v0.19.0.md).

## License & provenance

MIT — see [`LICENSE`](LICENSE).

This is a fresh public repository. The private development lab, its client case-studies, and its full history stay private. What crossed the boundary is attested: [`PROVENANCE.md`](PROVENANCE.md) records the private-lab commit SHAs behind this snapshot, and [`SCRUB-TRANSFORM.md`](SCRUB-TRANSFORM.md) + [`scripts/verify-transform.sh`](scripts/verify-transform.sh) make the privacy transform reproducible in one command — so the harness evidence is verifiable without exposing anything private.
