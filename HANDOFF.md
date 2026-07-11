# Agent Handoff — DirectiveForge

> Read this first if you are a fresh agent picking up work on the AI kit. Then read `CLAUDE.md` for the full repo map.

**Last updated:** 2026-07-10 — **2026-07-10 hardening (Sonnet 5 session, Fable-authored dispatch):** pre-HN truth-debt sweep + model-state refresh + upgrade-plan rename shipped as errata to v0.20.0 and pushed as public commit #2. Public commit #2 pushed: `5e2e510d5584d0209198cb4f60dbe42dfaba8d17` (stage tree a591b48f, private source a8f447a). Post-push verification: `claude plugin validate` PASS, `verify-transform.sh` 67/67 (3 withheld), README + CLAUDE-SURFACE-ROUTING §1a confirmed rendering RESTORED on github.com. Launch state: org/repo/DNS/landing LIVE; X handle secured (profile fill pending); remaining gates = clean-machine plugin smoke (DISPATCH-B), Show HN Tue 2026-07-14.

2026-07-03 — **v0.20.0 "The Public Launch Release" session (Claude Code, Fable 5 main + Opus/Haiku subagents per dispatch §4).** Committed, in order: W0 plan-first `66819ea` → W1 naming `50ac443` → W2 scrub gate `815bdea..03331b4` → W3 packaging `54663da` → W4 materials `dfe5cb0` → W5 verification `87282ad` → W6 wrap (this commit). All 7 workstreams SHIPPED; three fresh-context W5 verifiers all LAUNCH-SAFE; dispositions `feedback/DISPOSITIONS-v0.20.0.md` (0 silent drops; budgets held ≈1.62M measured subagent tokens of ≤5M). **The kit is now `DirectiveForge`** (`NAMING-DECISION.md`, 87/100 evidence-scored). The public snapshot is BUILT, GATED (0 hits dual-scan) and FROZEN at `launch/stage/directiveforge-public` (tag `v0.20.0-public`). **Next action: the operator presses the buttons — `launch/OPERATOR-CHECKLIST.md` is the exact ordered list (org → push → marketplace → DNS → Show HN → digest).** Nothing else blocks launch.

---

## Current state at a glance

- **Kit version: v0.20.0 (committed 2026-07-03) — public-launch ready.** Name: **DirectiveForge** (slug `directiveforge` everywhere: org/repo/plugin/marketplace/scope; domain owned; X handle pending manual verify — checklist step 5). Public snapshot: fresh-repo strategy, 640-ish files, scrub gate 0 hits under BOTH the operator pattern list and W5's 55 independently-derived patterns; hash bridge 67/67 verified (3 `withheld` disclosed); plugin `claude plugin validate` PASS + clean-clone install smokes 12/12 and 9/9; README numbers-first with every claim traced verbatim in-snapshot. Launch surfaces ready in `launch/` (SHOW-HN + first comment, LONGREAD, X-THREAD, DIGEST-001, LANDING, OPERATOR-CHECKLIST). New shipped infrastructure: `scripts/{scrub-check.py,build-snapshot.sh,verify-transform.sh}` + `scripts/scrub-allowlist.txt` (ships, auditable), `.claude-plugin/`, `plugin/commands/` (incl. `/report-friction`), `.github/ISSUE_TEMPLATE/friction-report.yml`, `PROVENANCE.md`/`SCRUB-TRANSFORM.md` (generated into the snapshot). N1 FIXED (PSP portability rule); N2–N6 → v0.20.1.
- **v0.19.0 state (previous):** The Delta Release: every v0.18 baseline F-driver fixed at its named home and re-measured on frozen instruments. **The public story now exists as evidence**: `harness/results/2026-07-03-delta/DELTA.md` — `inversion` L1.2 F1 0.33→0.75 / L1.3 0.33→0.83, `anti-sycophancy-meta` 0.57→0.89 / 0.27→0.83 (CIs non-overlapping), naming pack →1.0, brownfield-docs L2.3 1→0 (hard F-cap lifted), brownfield-api L2.4 4→0 + L2.2 →1.00, link-gate 13 FP→0 FP. Regressions shipped too (DEF 0.909→0.889 + 6 new findings filed N1–N6). Checklist circularity killed: hardened VALIDATION_CHECKLIST (§0 validity note + §18–§23) fails the baseline F-runs — agreement 0/3→3/3. Cost architecture fixed and measured on itself: 3.95M/65 calls for the whole release vs 23.7M/655 for the baseline harness alone; W4 sub-cap breached 5.9%, reported honestly (ADJ-1). HARNESS-SPEC at v1.1 (dated append-only batched-channel addendum; definitions untouched).
- **v0.18.0-H state (previous):** The proof-harness release — the kit now measures its own generator (scan rows A9+A10; the position nobody in the ecosystem occupies). `harness/`: pre-registered HARNESS-SPEC (metrics L1.1–L1.4, L2.1–L2.6, git-provably committed before any measurement) · 3 synthetic fixtures with frozen 10-signal answer keys · layer1 scorer docs · layer2 benchmark protocol with contamination firewall · SCORECARD-FORMAT (worst-of grades, hard F-cap on destructive actions) · RUNBOOK (Haiku dry-read: zero unresolvable steps) · runner scripts · **first baseline scorecards** at `harness/results/2026-07-03-baseline/`.
- **First published numbers (honest, includes three F grades):** L1.2 trigger F1 0.93/0.97/1.0 per pack; L1.3 exposed two dead-trigger skills (`inversion` 0.33, `anti-sycophancy-meta` 0.27 activation — Wilson CIs in the scorecards); L2 runs: greenfield **B**, brownfield-api **F** (Heroku false-content propagated 4×, self-contradicting the same run's drift flag), brownfield-docs **F** (one in-place README edit without backup = destructive-action violation; plus a 🚨 broken generated link-health gate). The validation checklist passed 12–14/14 on all three runs while these defects existed — the circularity threat is now empirically confirmed. **These are filed defects (HD-1..HD-8 in DISPOSITIONS-v0.18.0), not failures to hide.**
- **Judge economics validated:** Opus judges + Haiku router with Fable calibration re-judge — L1.4 exact agreement 18/20 (0.90), ±1 20/20; the cheap-judge setup is defensible and the calibration record (`calibration-fable.md`) shows exactly where it isn't (weak-trigger routing).
- **KIT-VIGILANCE now carries a release gate:** every minor release (x.Y.0) re-runs the harness per RUNBOOK; grade regression is release-blocking until dispositioned.
- **Cost reality (RUNBOOK prerequisites):** a full L1+L2 baseline ≈ 23.7M subagent tokens / ~655 agents (each tiny router call carries ~31.5k per-call system context — the estimate-vs-actual gap is ADJ-3 in dispositions). Generator runs themselves: ~270–330k tokens each.
- Prior chain: v0.17.0 `fd3c17a` (capability release, 41/41 dispositions) → v0.16.5 → … The vigilance routines push daily, so HEAD moves on its own.

## Queued work (read before starting new direction)

### Immediate: LAUNCH (operator, human steps)

`launch/OPERATOR-CHECKLIST.md` — org `directiveforge` → push snapshot + tag → verify rendering → marketplace/install smoke from a machine that never saw the lab → X handle + npm org → DNS/landing (`launch/LANDING.md`) → Show HN (`launch/SHOW-HN.md`, Tue–Thu 14:00–16:00 UTC, post the first comment immediately) → X thread → DIGEST-001 → day-2 watchlist (24h issue SLA, pre-push scrub hook, attorney brief).

### Post-launch candidates (pick with Sam)

1. **v0.20.1 fix queue** (`feedback/DISPOSITIONS-v0.20.0.md` §2/§5): N2–N6 + fixture regen retiring the 3 withheld bridge rows.
2. **Harness round 2 — PUBLIC, on the batched protocol**: full L1+L2 re-run in the public repo (zero-asterisk evidence; promotes HD-7/HD-8 deferrals; batch-id trial provenance; verifies N1 behaviorally). Declared in the public README.
3. **A11 instinct lifecycle / A12 config-audit** (scan-queued KB workstreams).
4. **Validation debt:** 2nd greenfield + 2nd code-repo real-project runs.
5. **Inbound friction**: first `/report-friction` issues → `feedback/YYYY-MM-DD-gh<issue#>-<tag>.md` → next DISPOSITIONS.

### Monthly integration 2026-08-01

Owns: Fable-5-redeploy KB state refresh; the 4 remaining themes from `research/2026-06-26-monthly-integration-dossier.md` (MCP author-expectations+CVE cluster, Claude Code v2.1.18x destructive-blocks/nested-subagents vs the no-nesting lock, fallback-chain verify-not-duplicate, Bedrock matrix); KB-06 follow-on queue (see v0.16.0 notes in git history of this file).

### Vigilance stale-clone fix — operator step still pending

On `claude.ai/code/scheduled`, prepend to each routine's stored prompt: "First action: `git pull --rebase origin main`, then read and execute `prompts/dispatch/<NAME>.md`." Kit-side Step-0 shipped in v0.16.1; this makes it immediate.

---

## Operational pattern — commit + push (context-dependent)

**Cowork sandbox sessions:** NEVER run `git commit/merge/push` from sandbox bash (`.git/*.lock` issue) — write `.commit-msg-vX.Y.Z.txt` and hand to Sam's `aikit-commit`. **Claude Code on the host (like the v0.18.0-H session): direct git commit/push works fine** — commit per workstream with conventional prefixes, pull --rebase before starting (vigilance routines push daily).

---

## Architectural locks (do NOT re-debate)

- **Multidomain principle.** Project-specific content lives in `case-studies/`; the main kit stays project-agnostic. Memory: `[[ai-kit-must-stay-multidomain]]`. The harness extends this: fixtures are 100% synthetic, leak-scan is a release gate.
- **Optional domain pack pattern.** KB-03/KB-07/KB-08 instances; conditional generator gates.
- **KB-06 is core (beta-bounded), not an optional pack.** Scheduled-work canon in KB-06 §3.
- **Cloud routine network limitation** (allowlist github.com+npmjs.com) → hybrid model with Cowork supplemental scans.
- **Vigilance fast-path vs cadence boundary** — don't promote MEDIUM signal to fast-path.
- **NEW (v0.18.0-H): pre-registration discipline.** HARNESS-SPEC commits before measurements; results never retro-edit metrics (new dated spec version instead); rubrics/answer keys are never tuned to pass a run; letter grades are presentation-only, worst-of MIN, hard F-cap on destructive actions. Weak numbers ship as filed defects.
- **NEW (v0.19.0): pre-registration extends to plans — W0 plans commit at W0, not at wrap** (verifier V1: an uncommitted operator plan makes "predicted exactly these residuals" operator-attested instead of git-provable). Fix agents are firewalled from `harness/results/**` + `harness/fixtures/**` (never tune descriptions to the frozen test set). Method changes ride dated append-only SPEC addenda with per-run equivalence demonstration (v1.1 precedent).

---

## Memory files the new chat should rely on

- `[[ai-kit-must-stay-multidomain]]` — the multidomain principle.
- `[[optional-domain-packs]]` — the KB-03/07/08 pattern.
- `[[project-ai-kit-state-2026-05-30]]` — long-horizon session state (pre-harness era; this file supersedes it for current state).

---

## Quick orientation checklist for the new chat

1. ✅ Read this `HANDOFF.md`.
2. ✅ Read `CLAUDE.md` (repo map — now includes `harness/`).
3. ✅ Skim `CHANGELOG.md` [0.18.0-H] + [0.17.0].
4. ✅ `git status` + `git pull --rebase --autostash origin main` (routines push daily).
5. If touching the generator or templates: read `harness/results/2026-07-03-baseline/` scorecards first — the HD-defects are the highest-signal to-do list the kit has ever had, and any gate/template edit must keep `harness/layer1/static-checks.md` in sync (checklist sync note).
6. Then ask Sam which direction: v0.19.0 HD-fixes / A11-A12 / scrub gate / harness round 2 / monthly integration prep.

Don't redo decisions that are already locked. Build forward.
