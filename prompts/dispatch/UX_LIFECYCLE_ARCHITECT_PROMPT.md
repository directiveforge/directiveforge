# ARCHITECT PROMPT — Lifecycle UX Overhaul (install → first win → resume → upgrade → uninstall)

> **Execute POST-LAUNCH (not before 2026-07-15).** ONE Claude Code session at `~/Projects/AI`,
> **Sonnet 5 main** (this prompt contains the decisions; execution is precision work), Opus 4.8 for
> the W7 fresh-context verifier only. Plan mode W0. Budgets: ≤10 subagents, ≤3M subagent tokens.
> **Authored:** 2026-07-11 by Fable (Cowork), from `research/2026-07-11-user-pain-map.md` — the
> evidence-ranked #1 design candidate. Every workstream below cites its evidence row.

## Why this exists (the evidence, so you weigh trade-offs correctly)

The pain map's densest cluster is first-run/lifecycle UX, not artifact quality: devs decide on a
tool in ~minutes and abandon over setup friction (map §UX-cut; the 68% abandonment row); 4 of 5
rival repos carry open day-one install crashes (raw 2b); and our own factual audit (raw 1b) found:
no cost/time disclosure before a 15–45-min run, no visible value until the very end, no
resume-after-failure story, "9 phases" documented vs 14 real, uninstall undocumented. All of it is
entirely in our control — none of it waits on models. Counter-intuitive but evidence-backed: the
question budget (0–1 in a typical run) is ALREADY excellent — praised onboardings REMOVE steps.

## Hard rules

1. **Do not add questions.** The typical-run operator-question budget stays ≤1 (plus pack-gate
   proposals, which are REQUIRED by the pack-gate lock). No setup wizard. Friction dies by
   subtraction. Any workstream that wants a new question must instead find an inference + a
   disclosed assumption the operator can veto.
2. Pre-registration discipline: any new measured metric rides a **dated, append-only
   HARNESS-SPEC addendum** — definitions of existing metrics untouched (v1.1 precedent).
3. Kit-voice claims stay measured: the new preamble discloses cost as a **measured range with its
   source** (the three recorded generator runs: ~270–330k tokens), never a marketing number.
4. Fix agents are firewalled from `harness/results/**` and `harness/fixtures/**` (never tune to
   the frozen test set). VALIDATION_CHECKLIST edits keep `harness/layer1/static-checks.md` in sync.
5. Every W commits separately, conventional prefixes; W0 plan commits at W0.

## W1 — Expectation-setting preamble (evidence: 1b "no cost disclosure"; H7 hedge)

Add a short **"What this run does"** block at the TOP of `generator/PROJECT_SETUP_PROMPT.md`, shown
to the operator before Phase 0 begins. Contents, one line each: wall-time range and measured token
range with source; what gets WRITTEN (file classes + count range by tier); the question budget
promise ("≤1 question in a typical run; pack proposals only when your repo triggers them"); the
resume story (one line, from W3); the uninstall story (one line, from W4); and "abort any time —
nothing is written until Phase 3." Verify that last claim against the real phase order first; if
writes happen earlier, either move them or state the true boundary. Mirror the same block in
`QUICK_START.md` step 2 and the README quickstart card (three surfaces, one truth — keep wording
identical so drift is grep-detectable).

## W1.5 — Surface scope: build ONLY what the operator actually uses (operator decision, 2026-07-11)

Today PSP's default is to generate for BOTH Claude Code and Cursor (mission line 10), inferring
`ide_scope` at Phase 3.4 and asking only on stale-artifact ambiguity (PSP:504). The operator has
ruled: **a single-IDE user must never receive the second surface silently** — it wastes tokens and
litters their repo (pain-map H1 "md sprawl" + H7 cost pain, both evidence-backed). Change the
resolution to:

1. **Default = evidence-based single scope.** Infer from: which surface the session runs in;
   live-ness of `.cursor/` vs `.claude/` (git-log recency of those paths, not mere existence —
   PSP:504's stale-artifact caveat already teaches this); explicit operator words in the intake.
   Generate BOTH only when evidence shows both are live, or the operator says so.
2. **Disclose + veto, don't interrogate.** The W1 preamble gains one line: `Building for: Claude
   Code only (detected: session surface + no live .cursor/). Reply "both" or "cursor" to change.`
   This honors hard rule 1 — it is a disclosed assumption with a veto, not a new blocking
   question; the only blocking ask remains the pre-existing mixed-evidence case.
3. **Mechanics unchanged where they already work:** manifest `ide_scope` records the resolution;
   adding the second surface later routes through `workflows/MIGRATION-CURSOR-CLAUDE.md` (one
   pointer line in QUICK_START so single-IDE users know expansion is cheap and supported).
4. **Cost split (feeds W1 + W6):** once single-scope runs exist, record their measured token range
   separately — the disclosure line should eventually say "Claude-Code-only: ~X; both: ~Y",
   because the difference is exactly the waste this workstream eliminates.

Acceptance addition: a fixture run in a Claude-Code-only repo produces ZERO `.cursor/` artifacts,
states the scope in its preamble, and the manifest says `ide_scope: ["claude-code"]`.

## W2 — First visible win in ≤3 minutes (evidence: map §UX-cut "no value until the end")

Restructure the output ORDER, not the work: Phase 1's codebase analysis already produces the most
immediately valuable artifact — the "here is what I learned about your repo" brief. Make it land
as a standalone file (`docs/AI-WORKFLOW-BRIEF.md` or the tier-appropriate home) **as soon as Phase
1 completes**, with a one-line operator notice ("first artifact written — the rest of the run
builds on it"). A user who aborts at minute 5 still walks away with something real. Add a
progress-narration convention for the remaining phases: one banner line per phase (`Phase k/N —
<what> — <expected output>`), numbers matching W5's honest phase count. No spinners, no fake ETAs.

## W3 — Resume + failure story (evidence: 1b "no resume"; rivals' day-one crash issues in 2b)

Design a minimal checkpoint: after each phase, the generator appends one line to a
`.df-setup-state.json` scratch file (phase id, files written so far, pending decisions). On any
restart, Phase 0 detects the file and offers **resume from phase k** (re-reading its own outputs,
not redoing them) or **clean restart** (state file deleted; prior outputs listed so the operator
can remove them). Document the three realistic failure modes and their one-line recoveries in
QUICK_START: session died mid-run; rate-limit/model unavailable (cite the fallback-chain doctrine);
operator aborted deliberately. Keep the mechanism ≤30 lines of prompt text — this is a protocol,
not software.

## W4 — Truth-in-docs: phase count + uninstall (evidence: 1b "9 documented vs 14 real, uninstall absent")

Recount the real phases (including 0.5, 1.5, 2.1, 3.4, 4.5, 8.5 inserts), then either renumber to
an honest linear sequence or document the sub-phases explicitly — pick whichever produces the
smaller diff, but the documented count MUST equal the narrated count from W2. Add an **Uninstall**
section to QUICK_START + UPGRADE_MODE: the manifest is the uninstall map — every file the kit
wrote is listed there; removal = delete listed files where `owner_customized: false`, review the
rest; `.ai-kit-manifest.json` goes last. State plainly what uninstall does NOT touch (operator's
own files, git history).

## W5 — Artifact evolution: prove upgrades don't eat customizations (evidence: spec-kit #1191,
105👍 — the single most-upvoted rival issue; BMAD upgrade-destroys-customization thread; raw 2b)

UPGRADE_MODE already promises keep/upgrade/adjudicate with owner-hash detection — **prove it**.
Build the missing test: on a fixture install (greenfield-next generated tree), (a) customize 5
files in realistic ways (edit a rule body, extend a command, add a skill of the operator's own,
touch CLAUDE.md, leave 1 kit file untouched); (b) bump kit version with overlapping template
changes; (c) run UPGRADE_MODE end-to-end; (d) measure **customization-survival**: customized
content bytes preserved / flagged-for-adjudication correctly / silently overwritten (must be 0).
Record as a dated result file. Where the test finds real gaps (likely: three-way-merge drafts,
`owner_customized` detection edges), fix UPGRADE_MODE and re-run. This workstream is the "prove
and strengthen" answer to the evidence — not a rebuild.

## W6 — Measurement addendum (pre-registered, small)

HARNESS-SPEC dated addendum defining three first-run metrics, measured from fixture generator runs:
**time-to-first-artifact** (start → W2 brief written), **disclosed-vs-actual cost delta** (W1
range vs run actuals; honest-numbers rule applies), **upgrade customization-survival rate** (from
W5's protocol, n stated). Bands presentation-only, worst-of unchanged. No re-grading of old runs —
these metrics start existing forward from this addendum.

## W7 — Verify + wrap

Fresh-context Opus verifier, firewalled from this prompt's reasoning: (1) run the DISPATCH-C-style
UX rehearsal (cold PSP paste on a tiny scratch repo) and check every W1 disclosure is TRUE for that
run (time in range, tokens in range, question count ≤ promise, first artifact by minute 3, phase
banners match docs); (2) re-run the W5 survival test once, independently; (3) grep the three
surfaces (PSP preamble / QUICK_START / README card) for wording drift. All findings dispositioned;
regressions and misses ship in the result file per house rules. Wrap: CHANGELOG entry, feedback
rows for anything deferred, HANDOFF touch.

## Acceptance

- [ ] Question budget unchanged (≤1 typical); zero new wizard steps
- [ ] Cold-run rehearsal: first artifact ≤3 min; all preamble disclosures true for that run
- [ ] Resume protocol works across a killed session on the fixture
- [ ] Documented phase count == narrated count == real count; uninstall section exists and is manifest-accurate
- [ ] W5 survival test: silent overwrites = 0, with the dated result file committed
- [ ] SPEC addendum dated + append-only; checklist/static-checks kept in sync; budgets reported
