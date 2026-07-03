# Trailhead Collective — Operations Repository

Pure-Markdown operations repo for a four-depot outdoor-gear rental network (Cascade Foothills). No code, no build, no server — documentation only. Do not scaffold one.

## Critical Constraints (read first)

- **`OPS-MASTER-PLAN.md` is the source of truth.** If a playbook contradicts it, the master plan wins and the playbook is what's wrong. Reconcile via a governance decision.
- **No credentials, no integrations, ever.** Every external tool is PROPOSED via `governance/INTEGRATIONS-REGISTRY.md` first; the founder personally bootstraps every credential (D4, binding). You propose; you never wire anything up, store a key, or sign the business up for a bill.
- **Cash is tight in the shoulder seasons.** Any advice that costs money or creates a recurring bill must be flagged, not assumed — it is a money decision, not a convenience call.
- **Depot names are exact:** Pinecrest, Ridgeway, Stonebrook, Larkfield. Staff and customers both key off them.
- **Do not invent** depot locations, gear lines, dollar figures, or dates. If it is not written down here, ask — do not fill it in.

## Build & Test Commands

Rituals, not shell commands — nothing here executes. The verification chain for this repo is the doc-lint gate table in `.claude/rules/quality-gates.md` (link health, index drift, ledger integrity, freshness).

```bash
python3 .claude/scripts/check-links.py docs/archive   # Link-health gate (the one runnable check)
```

## Architecture (corpus map)

- **`OPS-MASTER-PLAN.md`** (root, active): declared source of truth for how the business runs.
- **`docs/`**: operating playbooks, one topic per file, kebab-case. `docs/INDEX.md` is the navigation root — every playbook reachable from it.
- **`docs/archive/`**: superseded / dated one-time reports, kept for the record (audit trail).
- **`governance/DECISIONS.md`**: the decision ledger — `## D{N}`, appended in sequence, never rewritten. Next after D6 is D7.
- **`governance/INTEGRATIONS-REGISTRY.md`**: vetted external tools + the propose-only protocol (D4 front door).
- **`HANDOFF.md`** (root): live session state, newest entry on top — append, never rewrite past entries.

## Key Conventions

- **Frontmatter:** every file in `docs/` starts with `owner`, `verified` (YYYY-MM-DD), `sources`.
- **The `verified:` date is load-bearing.** If you cannot confirm a playbook is still accurate, do NOT bump the date. A stale date is more honest than a wrong one; stale = older than 90 days.
- **File naming:** kebab-case. **Headings:** sentence case. One topic per file.
- **Ledger:** governance decisions go in `governance/DECISIONS.md`, appended, never rewritten. Keep the D-number sequence going. Do not start a second ledger.
- **Single source of truth per fact:** link to it, never restate it. No orphan docs — every new doc gets an `INDEX.md` row in the same change.
- **Archive, don't delete:** superseded docs move to `docs/archive/`.

## Common Pitfalls

- Bumping a `verified:` date without actually re-confirming the content — the whole point of the audit is that stale dates lie (see HANDOFF: two dates lied in the 2026-06 audit).
- Editing an existing DECISIONS entry in place — reverse only by appending a new superseding entry.
- Touching `HANDOFF.md` when you are not the one running the session it describes.
- Deleting the dated report files (now in `docs/archive/`) — they are the audit trail.
- Proposing an external tool as though proposing = installing — a proposal that arrives pre-wired is a D4 governance violation and gets torn out.

## The rituals of the house (season-driven cadence)

- **Weekly review (Mondays):** open `HANDOFF.md`, reconcile against what actually happened last week, then walk `docs/INDEX.md` top to bottom and flag any playbook whose `verified:` date is now over 90 days old.
- **Season-close:** at the end of each peak season (summer = Jun–Aug, winter = Dec–Feb), re-verify every depot-facing playbook, refresh its `verified:` date, and file a decision if anything structural changed. Shoulder seasons (spring, fall) are for maintenance, re-verification, and planning.
- **New-tool:** before proposing any external service, read `governance/INTEGRATIONS-REGISTRY.md` and D4. Propose only.

## Session Protocol

- Start each session by reading `OPS-MASTER-PLAN.md`, then `HANDOFF.md` (live state), then the relevant `docs/` playbook.
- Fresh session per task — don't chain unrelated work in one session.
- Before a structural change (a new playbook, a governance decision, an index restructure): use Plan mode to align on approach first.
- If context feels exhausted (repetitive errors, forgetting prior instructions): start a new session.
- No `.git` in this repo — session state lives in `HANDOFF.md`, not in git history.

## Definition of Done

A change is complete ONLY when: the doc-lint gates in `.claude/rules/quality-gates.md` pass (link health, index has no dead rows / no orphan docs), any new doc carries valid frontmatter, no `verified:` date was bumped without confirmation, and any decision that changes how a depot operates / what is spent / who is integrated with is recorded in `governance/DECISIONS.md`.

## Decisions & pressure-testing

- Record cross-cutting, money-, or integration-affecting calls in `governance/DECISIONS.md` (Tier 2 format — see the file). Do not lock one-PR-and-done or linter-enforceable calls.
- Decision-shaped questions ("is this a good idea?", "should we commit?", "what could go wrong?") route through the decision-skill router — see `.claude/rules/decision-skills.md`.

## Corrections Become Rules

When corrected, apply the correction to all future work this session. If it is repo-wide, add it to Common Pitfalls above.

## AI Workflow Kit Reference

Generated by the AI Workflow Engineering Kit at `<KIT_ROOT>`. Consult when needed:
- Docs/ops generation guidance: `<KIT_ROOT>/generator/presets/docs-ops.md`
- MCP server catalog + security postures: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- Decision engineering (ledger + research): `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md`
- Validation checklist: `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`
