# ARCHITECT PROMPT — L3: the Field-Evidence Layer (real projects, honestly measured)

> **Execute POST-LAUNCH (not before 2026-07-15; ideally after the first field-trial reports and
> friction issues exist — real inputs make the spec concrete).** ONE Claude Code session at
> `~/Projects/AI`, **Sonnet 5 main**, Opus 4.8 for the adversarial W5 verifier. Plan mode W0.
> Budgets: ≤8 subagents, ≤2.5M tokens.
> **Authored:** 2026-07-11 by Fable (Cowork), from `research/2026-07-11-user-pain-map.md` — the
> evidence-ranked #2 design candidate, and strategically the one that makes "best in the world"
> a measurable claim instead of a slogan.

## Why this exists

The README and landing publicly concede: "We make no claim that the kit improves real-project
outcomes. Nobody in the ecosystem measures that yet — including us." The pain map's practitioner
beat (raw 2d: Ronacher, Danjou, Hashimoto, DORA's −7.2% stability) converges on verification as
the bottleneck — and the same audience shreds benchmarks that can be gamed ("I could obliterate
this benchmark with 'Always answer with one word'"). L1 measures artifacts; L2 measures the
generator on synthetic fixtures; **L3 measures what happens on real projects** — the empty high
ground of the entire ecosystem, and the only durable answer to benchmark skepticism. The prize is
not a bigger number: it is being the first project whose real-project claims survive an
adversarial reader.

## Hard rules

1. **Pre-registration before collection.** `harness/L3-SPEC.md` commits BEFORE any L3 number is
   computed; the verifier will check git order, same as HARNESS-SPEC. Metrics defined after seeing
   data = new dated spec version + disclosure.
2. **The evidence ladder is load-bearing.** Every L3 claim carries exactly one tier label:
   `measured` (recomputable from a committed artifact) / `operator-attested` (asserted by a named
   operator role, artifact withheld for privacy — the 3-withheld-rows precedent) / `anecdotal`
   (quoted report, no verification). Tier inflation anywhere = the release fails its own gate.
3. **Denominator honesty.** No rate ships without its denominator and collection window: "4 of 6
   field installs" — never "most installs". Selection bias gets a standing disclosure paragraph
   (who sends reports: self-selected early adopters, not a sample).
4. **Privacy absolutes.** Bucket-only project descriptions per the /report-friction taxonomy; the
   sanitization rules of FIELD_TRIAL_SETUP_PROMPT §6 bind ALL L3 inputs; client-identifying
   material never leaves `case-studies/` (private) — the public artifact is the sanitized twin.
5. **No outcome claims in v1.** L3 v1 measures adoption-mechanics and process-health, NOT "your
   code got better" (that requires baselines we don't have). The README's no-outcome-claim line
   stays until an L3 spec version earns its removal — do not soften it as a side effect.

## W1 — L3-SPEC.md (the core deliverable, ~150 lines, sibling of HARNESS-SPEC)

Define, with definition/scale/method/threats for each (HARNESS-SPEC format):

- **L3.1 Install success rate** — documented-path installs that reach "plugin listed + one skill
  triggers" without undocumented intervention. Source: field-trial reports + DISPATCH-B-class
  smokes. (The 2026-07-10 container smoke is retroactively instance #0 — already recorded.)
- **L3.2 Friction density** — friction items per install, classed by the taxonomy (a–h), split
  install-phase vs generation-phase vs usage-phase. Feeds H4 grading directly.
- **L3.3 Time-to-first-win** — minutes from paste to first standing artifact, as reported;
  pairs with the UX overhaul's disclosed range (the two prompts cross-reference, never duplicate).
- **L3.4 Upgrade customization-survival** — from the UX prompt's W5 protocol run on REAL installs
  (the editorial-hub field upgrade = instance #1, already executed 2026-07-10 (recorded privately
  in case-studies/): reconstructed-manifest path, everything adjudicate-only, zero silent
  overwrites — mine it from the case-study record).
- **L3.5 Report-response integrity** — median days issue→disposition; % silent drops (must be 0).
  The zero-silent-drops promise becomes a measured number instead of a slogan.
- **L3.6 Retention proxy** — installs still active (manifest present, kit files uncustomized-away)
  at day 30/90, from voluntary re-reports only; expect and disclose massive undercount.

For each: the collection instrument (which report field feeds it), the minimum n before any public
aggregate ships, and the gaming vector + its mitigation (e.g., L3.1 gamed by only counting happy
reports → mitigated by publishing the denominator rule and counting every received report).

## W2 — The collection pipeline (make the instruments feed the spec)

Trace each L3 metric back to its sources and close the gaps: extend the friction-report GitHub
issue form with the 3 optional fields L3 needs (install outcome, minutes-to-first-artifact,
CLI/OS bucket) — optional, never gating submission; add a §Report-format appendix to
FIELD_TRIAL_SETUP_PROMPT so trial reports emit the L3 fields natively; define
`harness/results/l3/<YYYY-MM-DD>-intake.md` as the append-only intake ledger (one row per report:
source link, tier label, fields extracted). Wire nothing automatic — a human (or a reviewed
session) transcribes intake; automation is a later spec version once volume justifies it.

## W3 — Instance #1: the editorial-hub case study, published honest

From the private case-study directory (case-studies/, single instance — the executor runs in the
lab and will find it) produce the sanitized public twin
`case-studies/PUBLIC-CASE-001-editorial-hub-upgrade.md`: bucket description (content/editorial
repo, kit v0.16.2 → v0.20.0, reconstructed-manifest path), what UPGRADE_MODE did (everything
adjudicate-only), the three frictions it surfaced (already public as PH-3/PH-4/PH-5) and their
dispositions, L3.4 result with tier label `operator-attested` (the repo is private; the manifest
diff is the withheld artifact). End with the standing selection-bias disclosure. This file is the
template every future case study copies — write it as the exemplar.

## W4 — First-90-days protocol + hypothesis grading hooks

A one-page `harness/L3-PROTOCOL-90D.md`: what gets collected passively (friction issues), what
actively (field-trial dispatches to volunteers from the launch thread — the FIELD_TRIAL prompt is
the recruiting asset), the review cadence (intake weekly with the digest; first public L3
aggregate no earlier than n≥5 installs or 2026-08-15, whichever later), and the pre-registered
grading of pain-map hypotheses **H4** (friction clusters install/invocation ≥40%) and **H5**
(upgrade-without-losing-edits asked within a month) — each graded in the digest when its window
closes, pass or fail, publicly.

## W5 — Adversarial verify + wrap

Fresh-context Opus verifier with one instruction: *read L3-SPEC and the case study as the most
hostile competent HN commenter* — hunt tier-inflation, missing denominators, gameable metrics,
outcome-claims smuggled past rule 5, privacy leaks in the public twin. Every finding dispositioned
in-file. Then wrap: CHANGELOG entry, README §Honest-limitations gains one line ("real-project
measurement: L3 spec v1 registered, collection open, no aggregates yet — the no-outcome-claim
stands"), HANDOFF touch, feedback rows for deferrals.

## Acceptance

- [ ] L3-SPEC committed before any L3 aggregate exists (git-order verifiable)
- [ ] Every metric has: instrument, min-n, denominator rule, gaming vector + mitigation
- [ ] Case study #1 published with correct tier labels and the selection-bias disclosure
- [ ] Issue form + FIELD_TRIAL emit L3 fields; intake ledger format exists
- [ ] H4/H5 grading pre-wired into the digest cadence with explicit windows
- [ ] README no-outcome-claim untouched; verifier findings all dispositioned; budgets reported
