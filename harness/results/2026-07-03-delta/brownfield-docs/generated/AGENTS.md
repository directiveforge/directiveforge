# Trailhead Collective — Operations Repository

Pure-Markdown operations repo for a four-depot outdoor-gear rental network (Cascade Foothills). Documentation only — no code, no build, no server, no `.git`. The audience is depot operators, the founder, and AI assistants maintaining the corpus.

## Corpus

- **Type**: Markdown operations corpus (playbooks + governance ledger + integrations registry). No manifest, no dependencies, no runtime.
- **Source of truth**: `OPS-MASTER-PLAN.md` (root, active). Playbooks implement it; they never override it.
- **Governance**: `governance/DECISIONS.md` (append-only `## D{N}` ledger, D1–D6) + `governance/INTEGRATIONS-REGISTRY.md` (propose-only external-tool front door, D4).

## Rituals (this repo's equivalent of dev commands)

Nothing here executes. The verification chain is the doc-lint gate table.

```bash
python3 .claude/scripts/check-links.py docs/archive   # link-health gate (excludes archived reports)
```

- **Weekly (Mondays)**: reconcile `HANDOFF.md`; walk `docs/INDEX.md`; flag playbooks with a `verified:` date over 90 days.
- **Season-close**: re-verify every depot-facing playbook; refresh `verified:` dates; file a decision if anything structural changed.
- **New-tool**: read `governance/INTEGRATIONS-REGISTRY.md` + D4 before proposing any external service. Propose only.

## Directory Structure

```
OPS-MASTER-PLAN.md         # declared source of truth (active)
README.md                  # repo overview + how-to-use
CLAUDE.md                  # house rules for AI assistants
HANDOFF.md                 # live session state (append; newest on top; do not archive)
governance/
  DECISIONS.md             # decision ledger (D1..D6; append-only; next is D7)
  INTEGRATIONS-REGISTRY.md # vetted external tools + propose-only protocol (D4)
docs/
  INDEX.md                 # navigation root — every playbook reachable from here
  *.md                     # operating playbooks (one topic per file, kebab-case)
  archive/                 # superseded / dated one-time reports (audit trail)
.claude/                   # AI-workflow assets (rules, skills, agents, commands, scripts)
docs/prompts/              # architect-prompt template for larger locked work
```

## Key Constraints

- NEVER add credentials, API keys, or service integrations — propose via `governance/INTEGRATIONS-REGISTRY.md`; the founder bootstraps every credential (D4, binding).
- NEVER bump a `verified:` date without confirming the content is still accurate — a stale date is more honest than a wrong one.
- NEVER edit an existing DECISIONS entry in place — reverse by appending a new superseding entry; keep the D-number sequence; do not start a second ledger.
- NEVER invent depot names/locations, gear lines, dollar figures, or dates. Depots are exactly Pinecrest, Ridgeway, Stonebrook, Larkfield.
- Single source of truth per fact — link, don't restate. Every new doc gets an `INDEX.md` row in the same change. Archive, don't delete.

## File Location Reference

| Type | Location |
|------|----------|
| Source of truth | `OPS-MASTER-PLAN.md` |
| Playbooks | `docs/*.md` (index at `docs/INDEX.md`) |
| Decision ledger | `governance/DECISIONS.md` |
| Integrations registry | `governance/INTEGRATIONS-REGISTRY.md` |
| Live session state | `HANDOFF.md` |
| Archived reports | `docs/archive/` |

## AI Workflow Kit

Standards, MCP catalog, and validation checklists live at `<KIT_ROOT>`. Consult when discovering MCP servers (`knowledge-base/MCP-SERVER-REGISTRY.md`), writing rules/agents (`knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md`), or verifying output (`generator/VALIDATION_CHECKLIST.md`).
