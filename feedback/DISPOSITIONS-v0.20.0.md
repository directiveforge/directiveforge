# DISPOSITIONS — v0.20.0 (The Public Launch Release)

> Release-close accounting, 2026-07-03. Every workstream row, every N-row from v0.19.0, every
> W5 verifier finding, every mid-release deviation — explicit disposition. **0 silently dropped.**
> Convention: SHIPPED / FIXED / DEFERRED → home / REJECTED — reason / ACCEPTED — reason.

## 1. Workstream rows (architect prompt §6)

| W | Deliverable | Disposition |
|---|---|---|
| W0 | Plan committed FIRST (66819ea): N-triage, launch bar, snapshot strategy (a) fresh repo, budgets, 3 operator decisions | SHIPPED — the v0.19.0 pre-registration lock honored: plan is the release's first commit |
| W1 | Name via KB-07 dogfood → **DirectiveForge adopted** (87/100 vs 61 nearest; NAMING-DECISION.md) | SHIPPED — Gate 0 org-availability first; 3 batched Opus web screens 224k ≤1M budget; challengers Specsmith/Caliper/Plumbline BLOCKED on evidence; CLI alias NONE (no CLI ships; dforge contested) |
| W2 | Scrub gate: scrub-check.py + build-snapshot.sh + verify-transform.sh + manifest (554 ship / 117 sanitize / 19 exclude, 67 BRIDGE) + N1 fix + RISK-REGISTER | SHIPPED — candidate snapshot gated 0 hits dual-scan; bridge 67/67 verified, 3 privacy-withheld disclosed |
| W3 | Plugin/marketplace (validate PASS) + /report-friction trio + issue form + feedback wiring + install docs | SHIPPED — clean-clone smoke 12/12; 22 skills ship unmoved (byte-identical measured artifacts) |
| W4 | README rebuild (hero delta table, 10 limitations, unmeasured claim DELETED) + MIT + launch/ materials | SHIPPED — every quantitative claim traced verbatim in-snapshot (V-B: zero dangling); voice-pass caught one number-pairing error in SHOW-HN before commit |
| W5 | 3 fresh-context verifiers (independent leak scan / claim-trace+bar / clean-env install) | SHIPPED — LAUNCH-SAFE; 10 findings, all dispositioned in the W5 verification record (private launch-ops; 9 FIXED/PLANNED, 1 ACCEPTED) |
| W6 | Wrap: CHANGELOG, HANDOFF, this file, OPERATOR-CHECKLIST, spend table, final freeze rebuild | SHIPPED — this commit |

## 2. N-rows from v0.19.0 (triage frozen in the W0 plan; outcomes)

| N | Triage (W0) | Outcome |
|---|---|---|
| N1 — generated files embed generator working paths + phantom exemplar cites | LAUNCH-BLOCKING | **FIXED** — PSP Portability rule (Phase 3, after drift firewall); l1/l2-delta runners require A.kit (no baked machine default); template example paths de-tripped. Verification mechanical (grep-level); behavioral re-measure deferred to public harness round 2 and disclosed in README limitations |
| N2 — `kit_version` CHANGELOG-heading wrap-lag | v0.20.1-queued | DEFERRED → v0.20.1. Mitigation shipped: `plugin.json` carries explicit `version: 0.20.0` (a dedicated version source the future fix can read); wrap-lag disclosed in README limitations |
| N3 — `disconfirming-evidence-first` F1 0.9091→0.8889 honest trade | v0.20.1-queued | DEFERRED → v0.20.1 (description nuance: tone-check WITH stated criterion stays in-scope). Disclosed verbatim in README + all launch materials |
| N4 — `research-synthesizer` Gotchas/Anti-patterns heading mismatch + one generation drop | v0.20.1-queued | DEFERRED → v0.20.1 (align template heading with §8 or accept equivalent; investigate the docs-run drop). README limitations row |
| N5 — §22 boilerplate 4-gram collisions in unedited skills | v0.20.1-queued | DEFERRED → v0.20.1 (de-boilerplate descriptions). Routing-irrelevant (affected skills' L1.2 = 1.0); README limitations row |
| N6 — 3 identical commands duplicated across generated trio | v0.20.1-queued | DEFERRED → v0.20.1 (PSP single-home rule). README limitations row |

## 3. W5 verifier findings

All ten rows in the W5 verification record (private launch-ops) §Disposition: W5-1 allowlist-must-ship FIXED (relocated to `scripts/`), W5-2 tag-object personal email FIXED (noreply for commit+tag), W5-3 CHANGELOG stale claim FIXED (dated correction), W5-4 sed residue FIXED (SECTION K), W5-5 template old-name FIXED + research/ exception documented, W5-6 README KB count FIXED, W5-7 CHANGELOG-[0.20.0]-then-rebuild PLANNED→executed in this wrap, W5-8 live-rebuild process note ACCEPTED + final sign-off on frozen stage, W5-9 QUICK_START friction FIXED, W5-10 KB attributed technique figures ACCEPTED (not kit-performance claims, not launch surfaces).

## 4. Mid-release deviations & adjudications (chronological)

| # | Deviation | Disposition |
|---|---|---|
| D1 | `marketplace.json` root `description` hard-errors on CLI 2.1.87 → moved to `metadata.description` (docs/CLI skew) | ACCEPTED — validate-passing is the deliverable; skew recorded for the next CLI bump |
| D2 | Plugin `commands/` component is deprecated upstream in favor of skills | ACCEPTED — shipped deliberately as slash-commands (validated clean); revisit if a CLI version hard-errors |
| D3 | 3 hash-anchored generated files carried a client-name link label → `bridge_class=withheld` (lossy neutralization; forward hash + manifest anchor verifiable; inverse operator-attested) | ACCEPTED with disclosure (SCRUB-TRANSFORM.md, README limitations, RISK-REGISTER R11) — options (a) regenerate / (b) exclude rejected: (a) touches frozen instruments mid-launch, (b) holes the evidence tree. Retired by public round 2 regeneration |
| D4 | `vigilance/feed/` content excluded wholesale (43-hit operational file; lab state) — mechanism + skeleton + format ship; public digest starts fresh | ACCEPTED — recorded in SNAPSHOT-MANIFEST |
| D5 | `case-studies/` ships as EMPTY dir + stub README (architecture references stay true; client instances private) | ACCEPTED |
| D6 | One-name scope: frozen evidence (`harness/results/**`, baseline runner records, `research/**` dated dossiers) keeps the generation-time working title; `.ai-kit-manifest.json` stays as technical id | ACCEPTED — NAMING-DECISION §5 records scope + rationale; PROVENANCE discloses |
| D7 | Build stage accidentally committed to the lab repo after a gate-failed build (`git add -A` capture) | FIXED same-session — stage untracked + gitignored (`/launch/stage/`) |
| D8 | Operator surname = client brand; industry descriptors de-anonymize P0 | MITIGATED per operator decision #2 — fixed generalizations shipped; residual inference risk ACCEPTED (RISK-REGISTER R1) |
| D9 | W1 X-handle check inconclusive (unauthenticated 402) | DEFERRED → operator checklist step 5 (manual logged-in verify + register) |
| D10 | Budgets | HELD — see spend table in CHANGELOG [0.20.0]: ~1.62M measured subagent tokens (≤5M), 17 subagent runs / 15 orchestration invocations (≤80), naming 224k (≤1M). No 2× STOP triggered. Main-loop tokens not separately metered by the session harness — reported as unmeasured, not estimated |

## 5. Standing items carried forward (not this release's scope)

| Item | Home |
|---|---|
| v0.20.1 fix queue: N2–N6 + fixture regen for the 3 withheld bridge rows + sed-residue source cleanups if any surface | next patch release |
| Harness round 2 — full re-run, PUBLIC repo, zero-asterisk evidence (retires D3, verifies N1 behaviorally) | post-launch, declared in README |
| A11 instincts / A12 config-audit | post-launch backlog (unchanged from v0.19.0) |
| P0 production upgrade (private client project) | separate run, separate repo (private) |
| Attorney TM opinion (cls 9/42, FORGE-dilution brief) before enterprise revenue | operator checklist step 10 |
| Fable-redeploy KB state refresh | 2026-08-01 monthly |
