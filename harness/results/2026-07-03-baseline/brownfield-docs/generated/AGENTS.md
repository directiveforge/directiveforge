# Trailhead Collective — Operations Repository

Cross-tool conventions for any agent working this repo (Claude Code, and any other tool that reads `AGENTS.md`). Full house rules and constraints live in `CLAUDE.md`; this file is the portable interop summary — it does not restate the constraint list.

## What this repo is

A pure-Markdown operations corpus for a founder-run four-depot outdoor-gear rental network. No application code, no package manifest, no build, no runtime. The deliverable is documentation quality: playbooks that are accurate, sourced, fresh-dated, and reachable from an index.

## Corpus map

| Class | Location |
|------|----------|
| Source of truth | `OPS-MASTER-PLAN.md` (root, active) |
| Decision ledger (append-only, `D{N}`) | `governance/DECISIONS.md` |
| Integrations vetting (D4 proposal protocol) | `governance/INTEGRATIONS-REGISTRY.md` |
| Operating playbooks (one topic per file) | `docs/*.md` |
| Navigation root | `docs/INDEX.md` |
| Archive (superseded / one-time reports) | `docs/archive/` |
| Live session state (append-only) | `HANDOFF.md` |
| House rules for AI | `CLAUDE.md` |

## Working rituals (this repo has no shell commands — these are the operating loops)

| Ritual | Cadence | What it does |
|--------|---------|--------------|
| Weekly review | Mondays | Reconcile `HANDOFF.md`; walk `docs/INDEX.md`; flag playbooks over 90 days since `verified:` |
| Season-close | End of each peak season | Re-verify depot-facing playbooks, refresh `verified:` dates, file a `D{N}` if anything structural changed |
| New-tool proposal | On demand | Read `governance/INTEGRATIONS-REGISTRY.md` + `D4`; draft a proposal row; never wire anything |
| Freshness audit | Shoulder seasons | Full re-verification pass across every playbook |

## Documentation conventions

- Every `docs/` playbook carries frontmatter: `owner`, `verified: YYYY-MM-DD`, `sources:`.
- `kebab-case` filenames; sentence-case headings; one topic per file.
- The `verified:` date is only bumped after an actual re-check — a stale date beats a wrong one.
- Single source of truth per fact: link to it (via `sources:`), never restate it.
- Every new playbook gets a `docs/INDEX.md` row in the same change; archive, never delete.

## Key constraints (summary — authoritative copy in `CLAUDE.md`)

- `OPS-MASTER-PLAN.md` wins over any playbook it disagrees with.
- Ledger is append-only `D{N}`; never edit a locked entry; never start a second ledger; never create a root `DECISIONS.md`.
- No credentials or integrations without a founder bootstrap (D4) — propose only.
- Money and recurring bills are governance gates with stated ceilings (`D6`), never casual sign-ups.
- Never invent depot names, gear lines, or dollar figures — Pinecrest / Ridgeway / Stonebrook / Larkfield are the only depots.

## AI Workflow Kit

Engineering standards, MCP catalog, and validation checklists at `<KIT_ROOT>`. Consult when:
- Evaluating an MCP server → `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- Writing or updating rules/agents → `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md`
- Locking a research-backed decision → `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md`
- Verifying generated output → `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`
