# Feedback Dispositions — v0.18.0-H

> Release-close accounting for the proof-harness release. Inputs this cycle: the architect prompt's
> 8 workstreams (W0–W7), the two scan rows the release executes (A9/A10), the in-release
> adjudications, the W7 adversarial-verifier findings, and — new artifact class — the **defects the
> harness itself filed** (HD-rows). Vocabulary: SHIPPED / DEFERRED → home / REJECTED — reason.
> Zero silently dropped rows. Next release repeats as `DISPOSITIONS-v0.19.0.md`.

## Workstreams (architect prompt `prompts/dispatch/V0_18_0_HARNESS_ARCHITECT_PROMPT.md`)

| W | Deliverable | Disposition |
|---|---|---|
| W0 | `harness/HARNESS-SPEC.md` (pre-registered, ≤200 lines, Fable-authored) | SHIPPED `601b3c5` — exactly 200 lines; W7 confirmed spec-commit precedes first-results-commit (`git merge-base --is-ancestor`) |
| W1 | 3 synthetic fixtures + frozen answer keys | SHIPPED `853c653` (+ completeness fix `4a43ebf` — nested-.gitignore swallow, see HD-10); leak-scan 0 hits, verified twice (Fable + W7) |
| W2 | `harness/layer1/` scorer docs ×3 | SHIPPED `6c206bc` — incl. 2 Fable review fixes (batch-checkpoint coherence n=25; corrected steelman CI example) |
| W3 | `harness/layer2/BENCHMARK-PROTOCOL.md` | SHIPPED `ffb418d` — 1 Fable review fix (calibration model ID) |
| W4 | Baseline runs: L1 ×3 packs + L2 ×3 fixtures + raw artifacts | SHIPPED `21eab1d` — 6 scorecards with real numbers, n, CIs, caveats; L2.5 + §6 calibration injected post-run |
| W5 | `SCORECARD-FORMAT.md` + `RUNBOOK.md` | SHIPPED `0094646` — Haiku dry-read gate: "ZERO unresolvable steps"; 1 Fable fix (design-pack grades filled with confirmed raw numbers) |
| W6 | Wiring (CLAUDE.md, README, KIT-VIGILANCE, checklist) | SHIPPED `7ca27e1` — 10/10 paths resolve; 1 Fable fix (README "never fired" → real activation numbers 0.27/0.33) |
| W7 | Adversarial verification + wrap | SHIPPED (this commit) — 10/10 claims CONFIRMED, 0 falsified; findings F1/F2 dispositioned below |

## Scan rows (research/2026-07-02-competitive-landscape-scan.md §5)

| Row | Mechanism | Disposition |
|---|---|---|
| A9 | Statistical artifact harness (trigger F1, Wilson-CI activation, anchored rubrics, threshold/exit-code convention) | SHIPPED — `harness/layer1/` + baseline scorecards; PluginEval statistical vocabulary adopted, no text copied; grades/exit-codes documented in SCORECARD-FORMAT.md (CI wiring deferred per §7 out-of-scope) |
| A10 | End-to-end outcome benchmark on fixed reference repos with answer keys | SHIPPED — `harness/layer2/` + `harness/fixtures/` + 3 baseline fixture scorecards; the friction-report defect classes are now the L2.6 taxonomy |

## W7 verifier findings

| # | Finding | Disposition |
|---|---|---|
| F1 🟡 | L1.3 per-trial data missing for 11/12 skills — the Haiku recorder truncated `trials_by_skill` while keeping valid JSON; published counts violated spec §2.2 recompute-from-raw | **Fixed in-session (this commit)** — full per-trial content recovered byte-exact from the orchestration journal (workflow `wf_1b26eb1d-d6a` recorder transcript); recovered counts recomputed and matched all 12 published x/n before replacement; provenance note embedded in the artifact. Root cause filed as HD-9 |
| F2 🟡 | `DISPOSITIONS-v0.18.0.md` referenced by scorecards/calibration record but absent at verification time | **Expected sequencing** — the file is a W7 deliverable authored after verification by design (same pattern as v0.17.0's wrap-artifacts finding #5); closed by this commit |

Verifier zero-finding checks (named): metric-ID registration sweep, proportion-without-n sweep,
small-n-caveat trigger, placeholder residue, single-run caveats, L1.2 grouping robustness against
the `disconfirming-effidence-first-p4` id typo, L1.3 early-stop coherence.

## Defects filed by the harness (HD-rows — measurement output, NOT tuned away)

| # | Defect (evidence) | Disposition |
|---|---|---|
| HD-1 | `inversion` trigger fails routing: F1 0.33 (4/5 positives leak to pre-mortem/steelman); activation 0.3333 [0.1923, 0.5122] n=30 | DEFERRED → v0.19.0 fast-path: rewrite `templates/skills/decision/inversion` description for router discrimination, then re-measure L1.2/L1.3 (grade must move, rubric must not) |
| HD-2 | `anti-sycophancy-meta` trigger fails routing: F1 0.57; activation 0.2667 [0.1418, 0.4445] n=30; confusion targets are its own downstream routes | DEFERRED → v0.19.0: description rewrite + a design question (should the router pre-empt downstream siblings when ownership signal present? KB-05 §5 territory) |
| HD-3 | `name-generation` near-miss confusion with `naming-brief` (F1 0.89) | DEFERRED → v0.19.0 fast-path: sharpen both descriptions' boundary ("brief exists" precondition) |
| HD-4 | L2.3 = 1 (brownfield-docs): generator edited pre-existing README.md in place — no backup, not append-only | DEFERRED → v0.19.0: PSP Phase 4.3 gains a blanket row "ANY pre-existing file edit requires backup-sibling or append-only; README explicitly included" |
| HD-5 | L2.4 = 4 (brownfield-api): Heroku README trap propagated into deploy.md + PHASE9 report while the SAME run flagged it as drift in tech-debt (self-contradiction) | DEFERRED → v0.19.0: PSP anti-hallucination constraint "deploy commands derive from deploy artifacts (Dockerfile/CI), never from README prose; README claims enter generated files only after artifact cross-check" |
| HD-6 | L2.6 🚨 (brownfield-docs): generated link-health gate resolves `docs/`-relative links from repo root → 13 false DEAD LINK lines drown the 2 real ones (re-executed & confirmed by Fable calibration + W7) | DEFERRED → v0.19.0: fix the link-check command pattern in `templates/*/rules/quality-gates*` + docs-ops preset (resolve relative to the linking file's dir; exclude template example-paths) |
| HD-7 | Starter-tier installs ship full-catalog skill copies whose routes point at non-installed siblings (greenfield: `anti-sycophancy-meta` → `disconfirming-evidence-first` absent at Starter) | DEFERRED → v0.19.0: PSP §3.1/3.5 route-pruning or tier-aware fallback lines at install time (extends the v0.17.0 reversibility-fallback pattern to all cross-references) |
| HD-8 | KB-08 gate ambiguity: fixture met the literal design-pack detection gate; runner skipped install citing operator minimalism ("just the basics", opt-ins "no"); answer key scored MISSED (L2.2 S3) | DEFERRED → v0.19.0: PSP precedence clarification — detection-based pack gates vs operator-minimalism; the answer-key verdict stands (frozen pre-run), the ambiguity is the finding |
| HD-9 | Harness-internal: Haiku recorder truncated a large JSON payload while keeping it parseable (root cause of F1) | Fixed for the data (F1); mechanism DEFERRED → next harness revision: recorder briefs gain a key-count/byte-count echo verification; noted in RUNBOOK gotchas |
| HD-10 | Harness-internal: two .gitignore swallows — kit-root unanchored `.claude/` hid generated results trees; fixture's own nested .gitignore hid a fixture file at W1 commit | **Fixed in-release** (`21eab1d` root-anchor + `4a43ebf` completeness fix); both documented as RUNBOOK gotchas |

## In-release adjudications (Fable)

| # | Call | Record |
|---|---|---|
| ADJ-1 | L1.3 measured on the decision pack only; naming/design DEFERRED with explicit scorecard caveat | Spend circuit-breaker (§7.5) applied at design time; home: next harness run measures both |
| ADJ-2 | §6 calibration blindness graded per block (L1.4 blind; L1.2 item-blind with biased selection documented; L2.4 verification-grade; L2.6 evidence re-executed) | `harness/results/2026-07-03-baseline/calibration-fable.md` — sequencing error on L2.4 documented, not hidden |
| ADJ-3 | Token-spend estimate error: plan projected 1.5–2.5M subagent tokens; actual ≈23.7M (L1 alone 20.4M — each of ~550 router/trial calls carries ~31.5k per-call system context the estimate modeled at 3–4k) | The §4f breaker never fired because fire-and-forget workflows expose cost only at completion — a real breaker design gap. Real costs now in RUNBOOK prerequisites; future runner scripts should pre-compute call-count × measured per-call overhead before launch |
| ADJ-4 | Grade philosophy locked: worst-of MIN, no weighted composite, L2.3>0 hard-F | SCORECARD-FORMAT.md §3; bands frozen at commit |

## Totals

8 W-rows SHIPPED · 2 scan rows SHIPPED · 2 verifier findings (1 fixed in-session, 1 expected-by-design)
· 10 HD defects (2 fixed in-release, 8 DEFERRED with named homes) · 4 adjudications recorded ·
**0 REJECTED · 0 silently dropped**.
