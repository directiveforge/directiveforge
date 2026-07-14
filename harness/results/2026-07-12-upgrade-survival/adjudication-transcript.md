# Adjudication transcript — upgrade-survival first controlled run (2026-07-12)

The dry-run plan's numbered adjudication questions (verbatim from `upgrade-plan.md`) and the
orchestrator-played operator's scripted answers (per `harness/lifecycle/UPGRADE-SURVIVAL-PROTOCOL.md`
§4, extended in the pre-registered spirit for the audit-queue-merged questions).

## Q1 — CLAUDE.md [ADJUDICATE]

> merge the kit's cosmetic "DirectiveForge Kit Reference" rename into your current file (your
> two additions — the tempodeck.app domain note and the "Local overrides" section — are
> preserved verbatim either way, they don't overlap the kit's changed lines)? Reply keep-mine /
> take-kit / merge.

**Operator answer: NONE — deliberately withheld.** (The protocol's silence-preserves test:
UPGRADE_MODE §5.3 must default the row to `keep-mine`.)
**Apply outcome:** keep-mine defaulted; file byte-identical; `owner_customized: true` recorded. ✅

## Q2 — .claude/rules/base.md [ADJUDICATE, audit F3]

> your "Tempo Deck house conventions" block says practice fixtures live in app/fixtures/
> (doesn't exist …) and references a CSV export mapping (no CSV code exists anywhere). Is this
> a planned refactor you haven't done yet (leave the rule as-is, keep-mine), or should the rule
> be corrected …?

**Operator answer:** "Planned refactor I haven't done yet — keep-mine, leave my block as-is."
**Apply outcome:** keep-mine; byte-identical; `owner_customized: true`. ✅

## Q3 — docs/PRACTICE-METRICS.md references [ADJUDICATE, audit F4, covers 2 rows]

> docs/ doesn't exist in this repo. Do you maintain PRACTICE-METRICS.md outside the repo, is it
> not yet created, or should both references be dropped?

**Operator answer:** "It is not yet created — planned. Keep my references. For
`.claude/commands/update-context.md`: do the 3-way MERGE with the kit's template changes — my
step 8 must survive."
**Apply outcome:** merge applied; kit Quality-Reference delta folded in; owner step 8 present
post-apply; `owner_customized: true`. ✅

## Q4 — .claude/skills/git-hygiene/SKILL.md [ADJUDICATE, audit F1+F7]

> this file isn't in the manifest at all and has no .cursor/skills/ twin … Intentional (Cursor
> not used for git ops), or should apply mode (a) register it in the manifest as owner-added,
> (b) fix confidence … (c) mirror it …?

**Operator answer:** "Intentional — Cursor is not used for git ops. No action: do not touch the
file, do not mirror it, do not register it this pass."
**Apply outcome:** untouched byte-identical; not registered. ✅

## ADD rows (2 ADD + 6 add-candidates)

**Operator answer:** "No new files this pass."
**Apply outcome:** none landed; manifest row count unchanged at 44. ✅

## Apply approval

**Operator:** "Approved. Apply on branch `kit-upgrade-2026-07-12` per the plan + my answers.
Run the §5a verification."
