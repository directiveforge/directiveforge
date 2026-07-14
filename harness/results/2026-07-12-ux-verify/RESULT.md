# W7 fresh-context verification — lifecycle UX overhaul (LC-1 / LC-2 + independent LC-3 re-run), 2026-07-12

**Instrument:** `harness/lifecycle/UX-REHEARSAL-PROTOCOL.md` (pre-registered, committed before the
run). **Structure:** cold PSP paste on a synthetic non-fixture TypeScript-CLI repo (segment 1,
instructed boundary-stop after Phase 3) → fresh-context resume (segment 2, through Phase 9) →
independent Opus-class survival re-run on a byte-identical substrate (copy-b) → firewalled Opus
verifier judging only from surfaces + raw artifacts (never the architect prompt or the authoring
session's expectations). All Opus-class agents. Raw evidence in this directory; the verifier's
full report is reproduced in the findings below.

| # | Step | Result | Evidence |
|---|---|---|---|
| 1a | Wall-time disclosure per LC-2 (as written) | **FALSE-as-written / confounded** | 2570 s vs 1260 s ceiling; pre-registered both-segments sum on an instrumented interrupted-and-resumed run — kit context loaded 3× vs the single-session baseline basis. Verifier: "not a product defect." Shipped as recorded; LC-2 resume carve-out deferred to the next spec version (UXD-4) — NOT amended post-hoc. |
| 1b | Token disclosure per LC-2 (as written) | **FALSE-as-written / confounded** | 636,138 vs 330k ceiling (same confound); segment 1 alone = 327,331 — inside the disclosed range, but phases 0–3 only → directional warning (UXD-5). |
| 1c | Question budget ≤1 | PASS | 1 blocking question total across both segments — the resume offer, which the docs place outside the typical-run budget; generation questions = 0 |
| 1d | First artifact (LC-1 394 s) | PASS on the contract's actual words ("early in the run" — brief landed at Phase 1 completion, ~27% into segment 1); LC-1 ≤180 s presentation band MISSED | `timing-log.txt`, `seg1.json`, state-file row phase 1 |
| 1e | `Building for:` line vs manifest + tree | PASS | line says claude-code (greenfield, session surface); manifest `ide_scope: ["claude-code"]`; zero `.cursor/**` |
| 1f | Abort-boundary claim vs segment-1 timeline | PASS | before the brief: only the checkpoint written; revival gate did not fire → no OWNER_BRIEF (consistent with the stated exception) |
| 1g | Resume claim | PASS | offer made with exactly two options; choice resume; rejoined at Phase 4; zero regeneration (hash-proof vs between-segments manifest; sole diffs = 5 Phase-5 validation fixes, attributed) |
| 1h | Uninstall pointer resolves | PASS | QUICK_START `## Uninstall` exists; recipe consistent with the run's manifest |
| 2 | Scope purity (W1.5 acceptance instance) | PASS | zero `.cursor/**`; `ide_scope` exactly `["claude-code"]`; T1 silent |
| 3 | Banners == documented == real (14) | PASS | 6 (seg 1) + 8 (seg 2) = 14 contiguous steps incl. 5 skipped-phase banners |
| 4 | Uninstall docs vs the run's manifest | PASS | 29/29 rows `created` + `owner_customized:false` → deletable per recipe; does-NOT-touch list holds (LICENSE/README/src/etc. absent from manifest); manifest-last ordering stated |
| 5 | Three-surface drift | PASS | identical hashes pre-fix (`ed83d9e2…`) and post-fix (`064a560e…`) — `drift-grep.md` |
| 6 | Checklist §10 ↔ static-checks family T sync | PASS | T1/T2/T3 mirrors agree (T2 noted as a mechanical subset of §10's manifest clause) |
| 7 | Independent LC-3 re-run (Opus class) | **PASS — survival 41/41 = 1.0, silent overwrites = 0**, flagging 3/3, §7.4 = 0 touched, protected path byte-identical | verifier's own recomputation from copy-b git history; `survival-rerun/` |

## Corrections made during the pass

1. **Segment-2 stop-condition carryover (verifier F5):** the segment-1 wrapper's stop condition,
   kept verbatim in segment 2, halted the resumed agent at the Phase 3→4 boundary it had already
   passed. Run-control error, not a generator defect — the resume mechanics themselves verified
   clean before the halt. Lifted via continuation; protocol §2 amended with a dated correction.
2. **Post-verification doc fixes (verifier F1/F4), commit cd74a8b:** DF-RUN-CONTRACT Writes range
   widened to the honest recorded span (29–44, tier- AND scope-dependent) after this run's 29-file
   Starter/single-IDE install undercut the old 34 floor; Resume bullet now discloses that a
   resumed run re-reads context and costs more. Block re-hashed byte-identical post-edit.

## Findings + dispositions (verifier's table, dispositioned)

| # | Finding | Disposition |
|---|---|---|
| F1 | LC-2 cost disclosures FALSE-as-written under the resume confound; LC-2 lacks a resume carve-out (unlike LC-1) | **FIXED (doc)** — resumed-run cost clause added to the contract (cd74a8b); spec carve-out **DEFERRED → UXD-4** (never amended post-hoc against a graded run) |
| F2 | No clean single-continuous run exists on the orchestration-clock basis to validate 18–21 min / 270–330k; seg-1 (phases 0–3) alone hit 24.5 min / 327k on that basis | **DEFERRED → UXD-5**: run one clean continuous Starter run before leaning on the figures further; range keeps its named source + single-run caveat meanwhile |
| F3 | Kit decision-skill templates ship the S21 phantom-route-marker gaps + the S22 description 4-gram collision that Phase 5 had to fix in-run (S22 = known residual N5) | **DEFERRED → UXD-6** (template fixes belong to the v0.20.1 release train, not this branch) |
| F4 | Writes range 34–44 under-described a Starter single-IDE run (29) | **FIXED (doc)** — cd74a8b |
| F5 | Wrapper stop-condition carryover (run-control) | **FIXED (protocol)** — dated §2 correction, cd74a8b |
| F6 | LC-1 ≤180 s presentation band missed (394 s) while the contract's qualitative promise held | **DEFERRED → UXD-7**: re-band or footnote at the next spec version; band is presentation-only, no re-grade |
| F7 | Empty `PRE-EXISTING-MODIFIED.txt` written under a "skipped" Phase 4 banner (cosmetic self-contradiction; uninstall handles it correctly) | **DEFERRED → UXD-8** (one-line banner guidance) |
| F8 | README carries no phase count (silent, not contradictory) | **ACCEPTED — no change** (the quickstart card deliberately stays lean; count lives in PSP + QUICK_START) |

## GO / NO-GO

**GO** (verifier's verdict, quoted): "Every substantive lifecycle behavior the overhaul introduces
verifies mechanically … the only failures are the two LC-2 cost disclosures, which fail only
as-written under the deliberately interrupted-and-resumed rehearsal — a measurement confound the
raw file itself flags — not as a product defect."

## Non-blocking notes carried forward

- The 15 generated files under `rehearsal/generated/` carrying the literal kit path join the
  existing BRIDGE sanitize class (same as the committed baseline trees) — flagged for
  SNAPSHOT-MANIFEST rows at the next rebuild, alongside `survival-rerun/post-apply-ai-kit-manifest.json`
  and the W5 dir's manifest copy.
- Model-class comparison across the two survival runs: the Opus dry-run matched the pre-registered
  answer key exactly (KEEP 33 / UPGRADE 8 / ADJUDICATE 2 / PROT 1) where the Sonnet run had
  deviated conservatively on two verdict classes; the Opus apply additionally HELD the protected
  file's `.mdc` twin (coupling reasoning) where Sonnet upgraded it, and rejected raw template
  substitution for AGENTS.md because the recorded `placeholders` map lacks the newer template's
  analysis placeholders — two legitimate judgment splits worth folding into UPGRADE_MODE doctrine
  (UXD-9).
- Mid-phase-kill robustness remains untested (protocol limitation, pre-registered) — UXD-3.

**n = 1 rehearsal run + 1 independent survival re-run. Single-run, directional.**
