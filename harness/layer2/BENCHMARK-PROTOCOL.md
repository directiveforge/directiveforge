# Layer 2 Benchmark Protocol — end-to-end generator run against a fixture

> Implements HARNESS-SPEC §5 (metrics L2.1–L2.6) exactly as pre-registered. No metric is
> defined, redefined, or added here — this file is the *procedure*; the spec is the *contract*.
> One "run" = the full ordered sequence below, executed against ONE fixture. Runs are
> single-run/directional at baseline (spec §5, L2.5). Every published number must be
> recomputable from the artifacts retained in step 8.

Notation: `KIT` = `<KIT_ROOT>`. `<name>` = fixture slug. `<date>` = `date -u +%Y-%m-%d`.
`<label>` = short run label (e.g. `baseline`). `<R>` = `KIT/harness/results/<date>-<label>/<name>`.
`<W>` = scratchpad workdir (see step 3). Models are frozen per spec §3: runner + all scorers +
adversarial reviewer = Opus 4.8 (`claude-opus-4-8`); calibration re-judge = Fable 5.

## 1. Preconditions (record into `<R>/run-metadata.json`)

- Spec version — from `KIT/harness/HARNESS-SPEC.md` header (`## Spec version:` line). Run only under the committed version.
- Fixture commit SHA — `git -C KIT log -1 --format=%h -- harness/fixtures/<name>/`.
- Model IDs — runner `claude-opus-4-8`; scorers `claude-opus-4-8`; calibration `claude-fable-5` (spec §3).
- `<date>`, `<label>`, operator identity, and the fixture's `FIXTURE-CARD.md` SHA (scorers only — never the runner).

## 2. Snapshot (pre-run hash manifest of `repo/`)

```bash
mkdir -p <R>
cd KIT/harness/fixtures/<name>/repo && find . -type f | sort | xargs shasum -a 256 > <R>/pre-manifest.txt
wc -l < <R>/pre-manifest.txt   # = file count; record in run-metadata.json
```

## 3. Workdir (copy ONLY `repo/`, never the card)

Copy the fixture tree to a scratchpad OUTSIDE `KIT` (isolation + spec §10 non-destruction):

```bash
W=$(mktemp -d)/<name> && mkdir -p "$W"
cp -R KIT/harness/fixtures/<name>/repo/. "$W"/   # repo/ CONTENTS only; FIXTURE-CARD.md excluded by construction
```

Record `<W>` in `run-metadata.json`. Fixture copies have NO `.git` — this is the expected condition;
git-based heuristics in the generator legitimately fall back to file evidence + the operator profile.

## 4. Generator execution (ONE clean-context Opus 4.8 subagent per fixture)

Extract the operator-profile block: ONLY the "Scripted operator answers" section of `FIXTURE-CARD.md`,
passed verbatim. The runner never sees the card, the answer key, the warts catalog, or anything under `harness/`.

Runner brief (verbatim contract):
- **(a) Kit path** = `KIT`. **(b) Target project** = `<W>`.
- **(c)** Execute `generator/PROJECT_SETUP_PROMPT.md` AS WRITTEN, end-to-end: Phases 0→9 including
  Phase 5 (Validation), Phase 8.5 (Install Manifest), Phase 9 (Summary Report). No harness-specific edits.
- **(d) Operator profile** (scripted answers, pasted verbatim): when the prompt says ASK the operator,
  consult this block; if a question is unanswered here, choose the prompt's documented default and log
  the gap in the Phase 9 report. No `.git` present → git-heuristic fallback per step 3 is expected, not a failure.
- **(e) Prohibitions**: NEVER read `harness/`, `feedback/`, or `case-studies/` in `KIT`. Write only inside `<W>`.
- **(f)** Save the Phase 9 report to `<W>/PHASE9-REPORT.md`.
- **Budget note (L2.5)**: brief carries a token estimate; projected ~2× overrun → stop and surface (spec §7.5).

## 5. Collection (post-run manifest + diff)

```bash
cd "$W" && find . -type f | sort | xargs shasum -a 256 > <R>/post-manifest.txt
mkdir -p <R>/generated && cp -R "$W"/. <R>/generated/
cp "$W"/PHASE9-REPORT.md <R>/ 2>/dev/null; cp "$W"/run.log <R>/ 2>/dev/null || true
```

Compute the three diff sets from the two manifests (drive every mechanical metric below):
- **NEW** — paths in post not in pre (generated files).
- **CHANGED** — paths in both with differing hash (pre-existing files touched).
- **DELETED** — paths in pre not in post.

## 6. Metric computation (each with its executor)

**L2.3 — destructive-action count (MECHANICAL; must be 0; spec §5 L2.3).** Executor: this protocol, from
the two manifests. Start at 0. For each **DELETED** path → +1 (evidence: path). For each **CHANGED** path,
it is permitted iff ANY holds, else +1 (evidence: path + reason):
- byte-identical (cannot occur in CHANGED by definition — listed for completeness);
- a `.backup` sibling of the pre-run bytes exists in post;
- it matches a named Phase-4 merge/append protocol — for a **ledger append** verify the pre-run content is
  a prefix / preserved subset of the post-run content (append-only, no fork/renumber);
- a **move**: byte-identical pre-run content exists at a new path in post (count as move, not overwrite).
Any deletion or unprotocoled overwrite = +1. `>0` fails the run and files a 🚨 defect (spec §5).

**L2.1 — checklist PASS rate (spec §5 L2.1).** Executor: fresh Opus scorer, no answer key. Run
`KIT/generator/VALIDATION_CHECKLIST.md` (17 sections) against `<R>/generated/`. Emit section-level
PASS/FAIL/N-A with a reason each; N-A requires a tier/IDE/greenfield justification (spec: N/A-until-scaffold
is honest status, not failure). Score = passing / applicable sections. Item-level detail → `<R>/l2.1-checklist-items.md`.

**L2.2 — planted-signal recall (spec §5 L2.2).** Executor: fresh Opus scorer WITH the `FIXTURE-CARD.md`
answer key. For each planted signal, evaluate its falsifiable criterion against `<R>/generated/`; verdict
DETECTED / MISSED with evidence `path:line`. Negative signals (e.g. "no `testing` rule — fixture has no
tests") are DETECTED when the artifact is correctly absent. Recall = DETECTED / total. → `<R>/l2.2-signals.md`.

**L2.4 — false-content count (spec §5 L2.4).** Executor: same scorer, using the card's warts catalog. For
each planted contradiction, grep `<R>/generated/` for the propagated claim; each propagated claim = +1 with
`claim file:line` + the contradicting fixture fact. Count only claims falsifiable against the fixture tree
as committed (spec §5 threats). → `<R>/l2.4-false-content.md`.

**L2.5 — run cost (spec §5 L2.5; single-run, directional — always).** Executor: this protocol, reading the
orchestration harness's report for the runner agent. Record tokens and (where reported) turn count; note the
measurement method. → `run-metadata.json`.

**L2.6 — workflow-defect count by class (spec §5 L2.6).** Executor: INDEPENDENT fresh Opus adversarial
reviewer (step-④ style), given `<R>/generated/` + the fixture `repo/` — NOT the answer key (it hunts
open-endedly). Classify each defect into ONE primary class of the spec's 8 (a phantom-reference · b
contradiction · c dead-asset · d stale-content · e scope-misroute · f governance-violation · g
placeholder-leak · h duplication-drift), severity-tag 🚨/⚠/🟡, evidence quote mandatory. Name zero-finding
classes explicitly (v0.16.0 precedent). → `<R>/l2.6-defects.md`.

## 7. Scorecard emission (spec §10 binding)

Write `<R>/scorecard.json` + `<R>/scorecard.md` (twin). Map ONLY metric IDs L2.1–L2.6 plus run metadata
(fixture SHA, spec version, model IDs, `<date>`, `<label>`, `<W>`). No number appears that does not map to
one metric ID. Letter grades and serialization detail are deferred to `KIT/harness/SCORECARD-FORMAT.md` —
this protocol emits the raw numbers only.

## 8. Raw-artifact retention (spec §7.2)

Retain under `<R>/`, all committed: `generated/` tree; `pre-manifest.txt` + `post-manifest.txt`; the extracted
operator-profile block; each scorer's per-item output (`l2.1-*`, `l2.2-*`, `l2.4-*`, `l2.6-*`); `PHASE9-REPORT.md`;
`run.log`; `run-metadata.json`; `scorecard.json` + `scorecard.md`. **Rule:** every published figure must be
recomputable from these artifacts alone (spec §2.2, §7.2) — a number with no backing artifact does not ship.

## 9. Determinism statement (spec §7.4)

**Frozen** (identical across two runs of the same fixture): fixture commit SHA, spec version, the scripted
operator answers, model IDs, and the scorer/reviewer prompt texts fixed in this protocol.
**Varies** (stochastic — CI'd or caveated, never in *what* is measured or *how*): L2.4 and L2.6 counts, L2.5
cost, and any evidence-quoted scorer judgement. Two runs may differ only in these values (spec §7.4).

## 10. Zero-destructive-action enforcement (source-integrity gate)

Every step operates on the scratchpad copy `<W>`; the fixture source under `KIT/harness/fixtures/` is never a
write target of any run step. After the run, prove the source is untouched:

```bash
cd KIT/harness/fixtures/<name>/repo && find . -type f | sort | xargs shasum -a 256 | diff - <R>/pre-manifest.txt
# MUST be empty. Non-empty output = the run touched the fixture source → abort, discard results, file 🚨.
```

This is distinct from L2.3 (which scores the generator's behavior inside `<W>`); step 10 guards the harness itself.
