# Trailhead Collective — Operations Repository

The single documentation home for Trailhead Collective, a founder-run four-depot outdoor-gear rental network in the Cascade Foothills. Pure-Markdown ops repo — no code, no build, no server, and there never will be one. Do not scaffold one.

## Critical Constraints (read first)

- **`OPS-MASTER-PLAN.md` is the source of truth.** If a playbook contradicts it, the master plan wins and the playbook is the thing that's wrong. Superseding the master plan requires a governance decision.
- **Governance ledger is `governance/DECISIONS.md`, append-only, `D{N}` format.** The next decision after the last one (`D6`) is `D7` — full stop. Never edit a locked entry; reverse it by adding a new `D{N}` that supersedes it and noting the supersession. Do not start a second ledger, and never create a root `DECISIONS.md`.
- **No credentials, no integrations, ever — propose only (D4).** You may recommend a tool and draft its `governance/INTEGRATIONS-REGISTRY.md` proposal row. You never create an account, store a key, or wire anything up. The founder personally bootstraps every credential. A proposal that arrives pre-wired is a governance violation.
- **Money is a governance gate, not a convenience call.** Anything that costs money or signs up for a recurring bill is flagged, never assumed (cash is tight in shoulder seasons). Spend above the depot threshold needs a signed authorization decision with a stated ceiling (see `D6`: Stonebrook lease, hard $48,000/yr).
- **Never invent depot locations, gear lines, or dollar figures.** If it is not written down here, ask — do not fill it in.

## Domain Facts (load-bearing)

- **Four depots** — Pinecrest, Ridgeway, Stonebrook, Larkfield. Get the names right; staff and customers key off them. Larkfield is newest (opened 2026-03) and least mature — its playbooks are still being filled in.
- **Seasons drive everything.** Summer peak June–August (backpacking, paddle). Winter peak December–February (winter, climbing). The two shoulder seasons between are for maintenance, playbook re-verification, and planning.
- **"Gear out the door has to come back" is the whole business.** Recovery discipline and replacement-cost deposit holds are the margin, not paperwork (`D2`).
- **Seasonal crew model** — outside the founder, all depot staff are seasonal, hired per peak and released in shoulder seasons (`D3`). Onboarding must be fast and playbook-driven every peak.

## Architecture (corpus map)

- `OPS-MASTER-PLAN.md` (root, active) — declared source of truth; sits above every playbook.
- `README.md` — repo purpose + how-to-use; `CLAUDE.md` (this file) — house rules for AI assistants; `HANDOFF.md` — live session state (append-only, do not archive or rewrite).
- `governance/DECISIONS.md` — append-only `D{N}` decision ledger. `governance/INTEGRATIONS-REGISTRY.md` — vetted external tools + the D4 proposal protocol (the vetting front door).
- `docs/` — operating playbooks, one topic per file; `docs/INDEX.md` is the navigation root (every playbook reachable from it). `docs/archive/` — superseded / one-time dated reports kept for the record.

## Key Conventions

- **Frontmatter on every `docs/` playbook**: `owner`, `verified: YYYY-MM-DD`, `sources:`. Filenames are `kebab-case`; headings are sentence case; one topic per file.
- **The `verified:` date is load-bearing.** If you cannot confirm a playbook is still accurate, do NOT bump the date — a stale date is more honest than a wrong one. Past 90 days = due for re-verification in the shoulder-season audit.
- **Single source of truth per fact** — link to it, never restate it. `sources:` cite the master plan / ledger / a sibling playbook.
- **No orphan docs** — every new playbook gets a `docs/INDEX.md` row in the same change. Archive, don't delete — superseded docs move to `docs/archive/`.

## Common Pitfalls

- **Bumping a `verified:` date without confirming the content.** The whole point of the freshness audit is that a wrong date lies. Re-verify, then date.
- **Editing a locked `D{N}` entry in place.** Breaks the audit trail. Add a new superseding entry instead.
- **Restating a fact instead of linking to its source of truth.** Two copies drift; when they disagree, nobody knows which is right.
- **Touching `HANDOFF.md` when you are not the one running the session it describes** — it is another operator's live state.
- **Editing a playbook without reconciling against the ledger it sources.** E.g. the deposit-and-refund policy must reconcile to `D5` (payment-processor switch) before its date is touched.

## Session Protocol

- Start each session: `git log --oneline -20` for recent changes; read `HANDOFF.md` first when picking up a paused thread. (This repo currently has no git history — fall back to `HANDOFF.md` + the ledger.)
- **Weekly review ritual (Mondays):** reconcile `HANDOFF.md` against what actually happened; walk `docs/INDEX.md` top to bottom and note any playbook whose `verified:` date is now over 90 days old.
- **Season-close ritual:** at each peak's end, re-verify every depot-facing playbook, refresh its `verified:` date, and file a `D{N}` decision if anything structural changed.
- **New-tool ritual:** before proposing any external service, read `governance/INTEGRATIONS-REGISTRY.md` and `D4`. Propose; never wire.
- Fresh session per task. Use Plan mode before multi-file doc changes. If context feels exhausted (repeating yourself, forgetting instructions), start a new session.

## Definition of Done

A doc change is done ONLY when: every claim traces to a cited source (master plan / ledger / sibling playbook); `verified:` reflects an actual re-check (or is deliberately left stale with a note); no `docs/INDEX.md` orphan or dead link was introduced; the ledger's append-only `D{N}` discipline is intact; and any tool/spend touched went through the D4 / money-gate governance path. Run `/status` before handing off.

## Decision Support

This repo runs at Advanced decision-discipline (real money on locked calls: `D5`, `D6`; binding credential governance `D4`). Decision-shaped questions ("should we…", "is this a good idea", "go/no-go", "what could go wrong") route through the decision-skill router — see `.claude/rules/decision-skills.md`. Research-backed strategic calls (supplier selection, lease terms, network expansion) follow the 3-layer research method — see `.claude/rules/research.md` — and land as a `D{N}` ledger entry.

## Commit Format

```
type(scope): description

# Examples:
docs(gear-recovery): propagate three-strike rule from Ridgeway (D-pending)
chore(index): add larkfield-onboarding row
governance(decisions): add D7 — drysuit supplier selection
```

## Corrections Become Rules

When corrected, apply the correction to all future work this session. If it is repo-wide, add it to Common Pitfalls above.

## AI Workflow Kit Reference

Generated by the AI Workflow Engineering Kit at `<KIT_ROOT>`. Consult when needed:
- **Rules / agents engineering**: `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` §2, §4
- **Decision engineering**: `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` + `KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md`
- **MCP catalog + security postures**: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- **Docs/ops preset** (this project's stack guidance): `<KIT_ROOT>/generator/presets/docs-ops.md`
- **Validation checklist**: `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`
