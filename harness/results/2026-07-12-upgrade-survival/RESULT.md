# Upgrade customization-survival — first controlled run (LC-3), 2026-07-12

**Instrument:** `harness/lifecycle/UPGRADE-SURVIVAL-PROTOCOL.md` (committed 274cd0d, BEFORE this
run; spec: HARNESS-SPEC v1.2). **Mode under test:** `generator/UPGRADE_MODE.md` end-to-end
(audit → dry-run → adjudication → apply-on-branch → §5a), executed by three cold-context
Sonnet-class subagents against a customized copy of the frozen greenfield-next install
(kit 0.17.0 → kit at branch `ux-lifecycle`, real 0.17→0.20 template drift; pre-scan
11 drifted / 30 same / 3 template-null of 44 — matched the frozen expectation exactly).
**Evidence discipline:** every number below recomputed mechanically from the substrate's git
history by the orchestrator (hash proofs, not transcript trust); raw artifacts in this dir.

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | Substrate prep: two-commit history (install dc92819 → owner customizations 72761da; 4 owner actions, 15 owner-changed lines + 1 new file) | PASS | `customizations.diff`, `pre-upgrade-manifest.txt` |
| 2 | Health audit (§2.2 mandatory: 44 files > 20 + owner-modified hashes), read-only, single write | PASS | `audit-report.md` (14 ALIVE / 11 DEGRADED / 0 ZOMBIE-EXPIRED; 5 owner-queue items) |
| 3 | Dry-run plan: single new file (§7.1), counts==table, questions bijective (§8) | PASS | `upgrade-plan.md` header + self-check |
| 4 | Plan vs pre-registered answer key: 8/8 UPGRADE, 1/1 KEEP-PROTECTED, both differ/differ files ADJUDICATE, ADD ≥1 | PASS (2 conservative deviations, see below) | `survival.json.answer_key_deviations` |
| 5 | **LC-3(a) survival rate** | **1.0 (15/15 owner lines)** | `survival.json`; keep-mine rows byte-identical, merge row retains owner step 8 |
| 6 | **LC-3(b) adjudication-flagging correctness** | **1.0 (3/3)** | post-apply manifest: `owner_customized: true` on all 3 |
| 7 | **LC-3(c) silent-overwrite count — HARD GATE = 0** | **0 — PASS** | §5.3 silence test: CLAUDE.md question deliberately unanswered → keep-mine defaulted, byte-identical |
| 8 | §7.4 non-manifest untouched (19 app/report files + operator-own skill) | PASS | `post-apply-manifest.txt` vs `pre-upgrade-manifest.txt` |
| 9 | §3a protected path byte-identical while unprotected twin upgraded | PASS | `.claude/rules/quality-gates.md` identical; `.cursor/rules/quality-gates.mdc` upgraded |
| 10 | Manifest rewritten LAST: kit_version→0.20.0, sha256==disk on touched rows, kit_version bumps on 8 UPGRADE rows, declined ADDs not landed, git-hygiene not registered | PASS | `post-apply-ai-kit-manifest.json` |
| 11 | §5a: static checks (121 PASS / 10 FAIL — all 10 pre-existing on KEEP/keep-mine files, zero regressions introduced), protected hash, doc-level smoke | PASS | `upgrade-plan.md` § Verification results |
| 12 | Frozen baseline untouched post-run | PASS | `git status --porcelain harness/results/2026-07-03-baseline` empty |

## Verdict on the hard gate

**Silent overwrites = 0. Customization survival = 1.0. The keep/upgrade/adjudicate promise held
end-to-end on this run** — including the nastiest pre-registered edge: an owner-modified file
whose adjudication question the operator never answered came through byte-identical with the
customization flag set (§5.3 silence-preserves).

## Corrections / deviations recorded (not gate breaches)

1. **base.md verdict:** answer key said KEEP+flag (differ/match); the planner routed it to
   ADJUDICATE because the audit's owner-queue flagged the owner block's content (§2.2 merge).
   Conservative direction — one extra question, nothing lost, same final outcome.
2. **git-hygiene row:** answer key said "no verdict row"; the planner surfaced it as an
   audit-queue ADJUDICATE. Scripted "no action" honored: untouched, unregistered.
3. **Token estimate honesty:** 549,854 actual vs 300k estimated (1.83×, under the 2× breaker) —
   driven by the audit's adversarial re-derivation subpass. Recorded in `run-metadata.json`.

## Non-blocking notes carried forward

- Model class: Sonnet-class this run vs UPGRADE_MODE's highest-capability recommendation —
  disclosed threat-to-validity; the independent W7 re-run covers Opus-class.
- The audit misreads a by-design manifest property as a defect (its top finding calls
  generation-time hashes + `owner_customized: false` "stale in the way that defeats its
  purpose" — that is exactly the state the 2×2 diff engine consumes to DETECT customization).
  Candidate one-line clarification in the audit prompt's manifest lens → feedback row.
- `keep-mine` rows got their `template_sha256` refreshed to the current kit template — coherent
  (next pass sees differ/match → KEEP+flag, stable), but UPGRADE_MODE §5 says "new
  template_sha256 where the template moved" without naming keep-mine rows explicitly →
  candidate doc clarification, feedback row.
- Mid-phase-kill robustness and a nonconforming-operator-skill variant remain pre-registered
  future variants (protocol §3a note).

**n = 1 controlled run (this file). Single-run, directional. Second, independent run: W7
(`harness/results/2026-07-12-ux-verify/survival-rerun/`).**
