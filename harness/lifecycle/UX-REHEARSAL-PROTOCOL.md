# UX Rehearsal Protocol (LC-1 / LC-2 instrument + fresh-context lifecycle verification)

> **Pre-registered instrument** for HARNESS-SPEC v1.2 metrics **LC-1** (time-to-first-artifact)
> and **LC-2** (disclosed-vs-actual cost delta), plus the fresh-context verification pass over
> the lifecycle UX surfaces (DF-RUN-CONTRACT preamble, single-IDE scope, checkpoint/resume,
> honest phase count, uninstall docs). DISPATCH-C step-4 lineage: cold PSP paste on a synthetic
> scratch repo that is NOT a harness fixture — the fixture firewall stays trivially clean.
> The verifier is FIREWALLED from the design reasoning: it receives surfaces, artifacts, and an
> acceptance checklist — never the architect prompt or the authoring session's expectations.

## 1. Rehearsal substrate (built by the orchestrator, mechanical)

`<SCRATCH>/ux-rehearsal/repo/` — a synthetic ~10-file **TypeScript CLI utility** (invented
product; different stack from every harness fixture and from DISPATCH-C's rehearsal repo):
`package.json` (name, scripts: `build` = tsc, `lint`), `tsconfig.json` (strict), `src/` ×3,
one test-less `README.md` that honestly describes it, `LICENSE`, `.gitignore`. `git init` with
3–4 commits by a synthetic author (`user.name="Fixture Operator"`). **No `.cursor/`
directory, no `.claude/` directory** → the run doubles as the W1.5 acceptance instance:
expected `ide_scope: ["claude-code"]`, ZERO `.cursor/**` artifacts, scope stated in the
printed run contract. Snapshot the repo source + `git log` + a pre-run tree-hash manifest into
the results dir before dispatch.

## 2. Run structure — two segments, one resume

**Segment 1 (cold paste + instructed boundary-stop).** The run-control wrapper (NOT part of the
PSP; quoted in the results) gives the agent: the kit path, the target path, the scripted
operator profile ("solo side project, just want the basics; answer honestly from the repo;
log every operator consultation and whether it blocked"), an instruction to echo
`BRIEF-WRITTEN <ISO8601 UTC>` immediately after the Phase 1.7 write (LC-1 source), and a stop
instruction: "end your turn immediately after the Phase 3 checkpoint row lands in
`.df-setup-state.json`." A boundary-stop is byte-indistinguishable on disk from a
boundary-kill (the checkpoint records phases ≤3; later outputs don't exist), and it preserves
the per-agent billing report that LC-2 needs — a hard client-side kill destroys it.
**Honest limitation, pre-registered:** mid-phase kill (half-written file) is NOT tested by this
protocol → standing feedback-deferral row.

*Between segments* the orchestrator snapshots: full tree-hash manifest, the state file, all
mtimes.

**Segment 2 (resume).** Fresh context, SAME wrapper + paste, same repo — with ONE deliberate
wrapper delta (correction, 2026-07-12, from the first run's F5 finding: the segment-1 stop
condition carried verbatim into segment 2 halts the agent at the boundary it already passed):
segment 2's wrapper adds the operator's scripted resume choice and DROPS the stop condition —
segment 2 runs to completion. Expected: the agent
detects `.df-setup-state.json` BEFORE Phase 0.1, offers exactly resume / clean-restart, and on
"resume" completes through Phase 9 without regenerating segment-1 outputs.

**Mechanical verification of the resume claim:** (a) transcript shows the offer and the choice;
(b) every segment-1 output byte-identical post-run (hash proof against the between-segments
manifest — trust the disk, not the transcript); (c) run completes (manifest written, state file
deleted); (d) blocking questions across BOTH segments ≤ 1, the resume offer counted and
reported separately (it fires only after a failure — the docs say the typical-run budget is
unchanged; if the docs are ambiguous about whether the offer counts, that is a truth-in-docs
finding, not a failure).

**LC-1 on this run** = segment 1 only (dispatch timestamp → `BRIEF-WRITTEN` echo,
cross-checked against the brief file's filesystem timestamps). **LC-2** = disclosed ranges AS
PRINTED in the run's own contract block vs (tokens: per-agent orchestration report, both
segments summed; wall-time: orchestrator `date -u` brackets, both segments summed —
the disclosed range describes a full run).

## 3. Survival re-run (independence leg)

Fresh `copy-b` built by the orchestrator per `UPGRADE-SURVIVAL-PROTOCOL.md` §2–§4 (same
patches, same scripted answers, same answer key). The W5 audit report MAY be copied to copy-b's
root before dispatch (UPGRADE_MODE §2.1 permits consuming a fresh audit; copy-b is
byte-identical to the audited state — documented as a setup step). Independence = fresh agents,
different model class (Opus-class vs the first run's Sonnet-class), zero exposure to the first
run's outputs (dry-run + apply agents never see copy-a or its results). LC-3 recomputed from
copy-b raw evidence by the verifier, not copied from the first run.

## 4. Verifier synthesis (the firewalled verdict agent)

**Gets:** the three surface files (PSP / QUICK_START / README), the generated rehearsal tree +
its manifest + the segment artifacts, the survival re-run raw artifacts, the acceptance
checklist below — verbatim, nothing else. **Does NOT get:** the architect prompt, the W0 plan,
commit messages, or the orchestrator's expectations.

Acceptance checklist (1:1 with the result table):

1. Every DF-RUN-CONTRACT disclosure judged TRUE/FALSE for THIS run per LC-2 rules — time in
   range, tokens in range, questions ≤ promise, first artifact per LC-1, `Building for:` line
   matches the manifest `ide_scope` and the tree, write-boundary claim true against the
   segment-1 file timeline, resume claim true per §2, uninstall pointer resolves.
2. Zero `.cursor/**` in the rehearsal tree; manifest `ide_scope` = `["claude-code"]`.
3. Phase banners: printed count == documented count (14) == distinct banner lines; skipped
   phases bannered.
4. Uninstall docs vs the rehearsal manifest: every `owner_customized: false` +
   `disposition: created` row is deletable per the recipe; manifest-last ordering stated;
   does-NOT-touch list consistent with the §7.4 class.
5. Three-surface drift: extract between the DF-RUN-CONTRACT sentinels in all three files,
   hash — identical or FINDING.
6. Checklist/static-checks sync: §10 lifecycle items each have a family-T mirror.
7. LC-3 recomputed from copy-b evidence; silent overwrites = 0 (hard gate).
8. Findings table: every finding gets a proposed disposition.

## 5. Disposition rules (pre-stated)

**BLOCKING** (fix + bounded re-verify — ≤2 reserve dispatches; doc-only fixes re-checked
mechanically by the orchestrator, no agent): FALSE disclosure (LC-2 over-ceiling) · silent
overwrite > 0 · resume failure · `.cursor/**` leak in a single-IDE run · phase-count mismatch ·
surface drift · checklist/static-checks desync. Anything still red after the bound ships as a
FAIL row + feedback row — the instrument is never tuned to pass (HARNESS-SPEC §2.3).
**NON-BLOCKING** (ship as notes + feedback rows): under-runs below disclosed floors · cosmetic
banner wording · single-run small-n caveats · model-variance observations.

## 6. Result files — `harness/results/<date>-ux-verify/`

`RESULT.md` (DISPATCH-C house format: numbered PASS/FAIL table 1:1 with §4's checklist,
corrections section, findings + dispositions table, GO/NO-GO verdict, non-blocking notes) ·
`verify-metadata.json` (LC-1/LC-2 values + evidence chain, per-agent tokens with the L2.5
method caveat, models, timestamps, branch + protocol SHAs) · `rehearsal/` (repo snapshot,
wrapper text, pre/post tree-hash manifests, state-file snapshot after segment 1, banner
transcript, generated `.ai-kit-manifest.json` copy) · `survival-rerun/` (same shape as the
first run's dir) · `drift-grep.md` (the three extracted blocks + hashes). Tokenized paths
throughout; the same manifest-`kit_path` exception class as the first run, flagged not silent.
