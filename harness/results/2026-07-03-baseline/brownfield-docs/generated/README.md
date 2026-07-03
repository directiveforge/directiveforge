# Trailhead Collective — Operations Repository

This repository is the single documentation home for **Trailhead Collective**, a
four-depot outdoor-gear rental network operating across the Cascade Foothills region.
It holds every operating playbook, the governance ledger, and the vendor / integration
records the business runs on. **There is no application code here** — this is a
pure-Markdown operations repository.

## What Trailhead Collective is

We rent backpacking, climbing, paddle, and winter gear out of four staffed depots
(Pinecrest, Ridgeway, Stonebrook, Larkfield). The business is founder-run with a small
seasonal crew that swells during the summer and winter peaks. Everything an operator
needs to run a depot shift, close a season, or vet a new tool lives in this repo.

## Source of truth

The authoritative operating direction is **[OPS-MASTER-PLAN.md](OPS-MASTER-PLAN.md)** at
the repository root. When a playbook and the master plan disagree, the master plan wins;
open a governance decision to reconcile them.

## Structure

```
.
├── README.md                     ← you are here
├── CLAUDE.md                     ← house rules for AI assistants
├── AGENTS.md                     ← cross-tool conventions (interop layer)
├── HANDOFF.md                    ← live session state (do not archive)
├── OPS-MASTER-PLAN.md            ← declared source of truth (active)
├── governance/
│   ├── DECISIONS.md              ← the decision ledger (D1..D6)
│   └── INTEGRATIONS-REGISTRY.md  ← vetted external tools + proposal protocol
├── docs/
│   ├── INDEX.md                  ← index of every playbook
│   ├── *.md                      ← operating playbooks (one topic per file)
│   ├── prompts/                  ← architect-prompt template for research-backed decisions
│   └── archive/                  ← dated one-time audits / comparisons, kept for the record
└── .claude/                      ← AI workflow: rules, commands, agents, decision skills
```

## How to use this repo

- **Running a shift?** Start in `docs/INDEX.md` and open the relevant playbook.
- **Making a call that sticks?** Record it in `governance/DECISIONS.md`.
- **Bringing in a new tool or service?** Follow the proposal protocol in
  `governance/INTEGRATIONS-REGISTRY.md` — nothing gets wired up without it.
- **Picking up a paused thread?** Read `HANDOFF.md` first.

## Conventions

Every playbook in `docs/` carries frontmatter (`owner`, `verified`, `sources`) and is
named in `kebab-case`. Freshness is tracked by the `verified:` date — a playbook older
than 90 days is due for a re-check. See `CLAUDE.md` for the full house style.
