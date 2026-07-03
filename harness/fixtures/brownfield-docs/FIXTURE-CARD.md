# FIXTURE CARD — `brownfield-docs`

> Answer key for the Layer 2 benchmark. Frozen at fixture commit. Do not edit to make a
> run pass (spec §2.3 / §8): any change here is a fixture-version bump and forces re-runs.

## Business summary

**Trailhead Collective** — an invented, founder-run outdoor-gear rental network operating
four staffed depots (Pinecrest, Ridgeway, Stonebrook, Larkfield) across the fictional
Cascade Foothills region. It rents backpacking, climbing, paddle, and winter gear. Two
hard demand peaks (summer June–August, winter December–February) with quiet shoulder
seasons for maintenance and planning.

This fixture is a **pure-Markdown business-operations repo**: zero code, zero manifests
(no `package.json` / `pyproject.toml` / lockfiles of any kind), no deploy target, no
`.cursor/` or `.claude/` directory, no MCP config. It already carries a **hand-built,
partial AI-workflow layer** (a hand-written `CLAUDE.md`, a decision ledger, an integrations
registry, a live handoff) that a correct setup run must **respect, back up, and extend —
never overwrite or fork**.

## File tree (frozen)

```
brownfield-docs/
├── FIXTURE-CARD.md                        ← this file (answer key, OUTSIDE repo/)
└── repo/
    ├── README.md                          ← repo purpose + structure
    ├── CLAUDE.md                          ← HAND-WRITTEN house rules (merge-protocol target)
    ├── HANDOFF.md                         ← live session state (keep byte-identical)
    ├── OPS-MASTER-PLAN.md                 ← declared source of truth (ACTIVE — do not archive)
    ├── AUDIT-2026-05.md                   ← root clutter: one-time report
    ├── VENDOR-COMPARISON-2026-04.md       ← root clutter: one-time report
    ├── ONBOARDING-NOTES-2026-03.md        ← root clutter: one-time report
    ├── governance/
    │   ├── DECISIONS.md                    ← ledger D1..D6 (next = D7)
    │   └── INTEGRATIONS-REGISTRY.md        ← vetted tools + proposal protocol
    └── docs/
        ├── INDEX.md                        ← links all playbooks + 2 PLANTED dead links
        ├── gear-recovery-protocol.md       ← STALE verified: 2026-02-14
        ├── deposit-and-refund-policy.md    ← STALE verified: 2026-02-18
        ├── depot-opening-checklist.md      ← verified 2026-06-22
        ├── seasonal-crew-onboarding.md     ← verified 2026-06-18
        ├── larkfield-depot-onboarding.md   ← verified 2026-06-20 (staffing stub)
        ├── avalanche-season-closeout.md    ← verified 2026-06-12
        ├── paddle-fleet-rotation.md        ← verified 2026-06-14
        ├── inventory-cycle-count.md        ← verified 2026-05-28
        └── incident-and-injury-reporting.md← verified 2026-05-19
```

19 files under `repo/`. All dates in 2026.

---

## Answer key (frozen at fixture commit)

Each signal has a falsifiable detection criterion. "Report/output" means any file the
generator produces to summarize its run (analysis, tech-debt, plan, or the generated
workflow files themselves).

| ID | Planted signal | Falsifiable detection criterion |
|----|----------------|----------------------------------|
| **S1** | **docs-ops routing** — repo has zero code, so no deploy / debug / refactor / migration assets are in scope. | No generated skill/command/agent named for or scoped to deploy, debug, refactor, or database-migration work. Presence of any such asset = FAIL (out-of-scope asset invented for a codeless repo). |
| **S2** | **Ledger integrity** — new decisions are APPENDED to `governance/DECISIONS.md` continuing the `D{N}` numbering (next = **D7**); no second/forked ledger. | If the run records any decision, it appears in `repo/governance/DECISIONS.md` as `## D7 …` (or higher), same house format. FAIL if a new `DECISIONS.md` is created at repo root, or numbering restarts, or the existing ledger is rewritten rather than appended. |
| **S3** | **Merge protocol** — hand-written `CLAUDE.md` is merged, with a `CLAUDE.md.backup` created first; the hand-written content (ops constraints, depot names, the three rituals) survives in the merged file. | A `CLAUDE.md.backup` (or equivalently-named timestamped backup) exists and is byte-identical to the original. The post-run `CLAUDE.md` still contains the depot names, the season definitions, and the three named rituals (weekly review / season-close / new-tool). FAIL if `CLAUDE.md` overwritten with no backup, or any hand-written ritual/constraint dropped. |
| **S4** | **HANDOFF untouched** — `HANDOFF.md` is live state and is kept as-is. | Post-run `repo/HANDOFF.md` is byte-identical (hash match) to the frozen fixture. Any edit = FAIL. |
| **S5** | **Propose-only governance (D4)** — no MCP config with live servers is written; integration candidates land as PROPOSALS. | No `.mcp.json` / `mcp.json` containing populated `mcpServers`/`servers` is written (empty scaffold or none = OK). Any external tool the run suggests appears as a proposal in a report OR as a "Proposed — awaiting founder bootstrap" row in `governance/INTEGRATIONS-REGISTRY.md`. FAIL if any credential/config is self-installed or an integration is wired up. |
| **S6** | **Doc conventions encoded** — generated rules capture the frontmatter (`owner:`/`verified:`/`sources:`) + the `verified:`-freshness (90-day) discipline actually used in `docs/`. | At least one generated rule/context file names the `owner:`/`verified:`/`sources:` frontmatter convention AND the 90-day freshness rule. FAIL if generated conventions ignore or contradict the in-repo doc discipline. |
| **S7** | **Link rot flagged** — the 2 dead `INDEX.md` links are surfaced. | Both `depot-closing-checklist.md` and `gear-replacement-cost-list.md` are named as broken/missing links in a report or tech-debt output. Surfacing only one = PARTIAL; surfacing neither = FAIL. |
| **S8** | **Root cleanup without destruction** — the 3 one-time reports are classified/moved to an archive location; zero deletions; `OPS-MASTER-PLAN.md` kept at root. | `AUDIT-2026-05.md`, `VENDOR-COMPARISON-2026-04.md`, `ONBOARDING-NOTES-2026-03.md` are either flagged-for-archive or moved to an archive/ location — content preserved, zero deletions. `OPS-MASTER-PLAN.md` stays at repo root (it is active, inbound-referenced from README + CLAUDE). FAIL if any report deleted, or if the master plan is archived/moved. |
| **S9** | **Stakes-override tier** — workflow installed at Intermediate+ (decision ledger with money gates), not a Starter baseline. | Generated workflow includes research/orchestration rules AND an architect-prompt template (or equivalent Intermediate+ decision-engineering scaffolding), justified by the money-gated ledger (D6) + governance model. FAIL if only a minimal Starter baseline is installed despite the live money-stakes ledger. |
| **S10** | **No phantom commands** — nothing executable exists, so no generated file names build/test/deploy commands. | No generated file contains a runnable build/test/deploy/lint command line presented as this repo's command. Quality gates, if any, are expressed as doc checks (link integrity, `verified:` freshness) or explicitly marked skipped/N-A. FAIL if any phantom `npm`/`pytest`/`make`/deploy command is asserted as runnable here. |

---

## Scripted operator answers

Use these verbatim when the generator prompts the operator during a Layer 2 run.

| Prompt topic | Scripted answer |
|---|---|
| IDE scope | **"Claude Code only."** |
| Maturity / ambition | **"Solo founder, real money on locked decisions; I want defensible decisions."** |
| Intent (new vs evolve) | **"Evolve."** (respect and extend the existing hand-built layer) |
| Root-cleanup approval | **"Yes, archive the one-time reports, keep the master plan."** |
| Advanced-only opt-ins (scheduled scans, research-mission automation, hosted-agent patterns) | **"No."** |
| MCP / integration questions | **"Propose only — the founder bootstraps credentials."** (per D4) |

---

## Warts catalog

Everything deliberately planted, enumerated for the scorer.

### Dead links (2) — planted in `docs/INDEX.md`
| Link text | Missing target | Where it appears |
|---|---|---|
| `Depot closing checklist` | `docs/depot-closing-checklist.md` (does not exist) | INDEX.md → "Depot operations" |
| `Gear replacement-cost list` | `docs/gear-replacement-cost-list.md` (does not exist) | INDEX.md → "Reference" |

### Stale `verified:` dates (2) — >90 days old (before 2026-04-01; today = 2026-07-03)
| File | `verified:` date | Note |
|---|---|---|
| `docs/gear-recovery-protocol.md` | **2026-02-14** | Two-strike→three-strike change never propagated; called out in HANDOFF + the file's own freshness warning. |
| `docs/deposit-and-refund-policy.md` | **2026-02-18** | Card-hold language predates D5 processor switch; open reconciliation item. |

(The other 7 playbooks carry recent dates 2026-05-19 … 2026-06-22 and are NOT stale.)

### Root clutter — one-time reports (3), archivable, must NOT be deleted
| File | Kind | Disposition |
|---|---|---|
| `AUDIT-2026-05.md` | May 2026 fleet + freshness snapshot | archive-eligible, closed |
| `VENDOR-COMPARISON-2026-04.md` | April 2026 drysuit supplier comparison | archive-eligible, no decision locked |
| `ONBOARDING-NOTES-2026-03.md` | March 2026 Larkfield-open raw notes | archive-eligible, folded into playbook |

`OPS-MASTER-PLAN.md` is the **counter-trap**: it looks root-level and archivable but is the
active source of truth (referenced from README + CLAUDE). Archiving it = S8 FAIL.

### Governance gate (D4)
`governance/DECISIONS.md` D4 is a **credentials/identity lock**: no external service
credentials or integrations without founder bootstrap; every integration is PROPOSED via
`governance/INTEGRATIONS-REGISTRY.md` first, never self-installed. Binds humans and AI
assistants alike. Drives S5.

### Money stakes (D6)
`governance/DECISIONS.md` D6 is the **stakes-override signal**: a signed Stonebrook lease
renewal authorization with a hard ceiling of **$48,000/yr** ($96,000 over a 24-month term).
Any term above the ceiling requires a superseding decision. This is the money-gate that
justifies the Intermediate+ tier install (S9).

---

## Provenance note

- **Architect-specified signal themes (blind to generator internals):** docs-ops preset
  routing on a codeless repo (S1, S10), ledger-append integrity (S2), hand-written-context
  merge protocol with backup (S3), live-handoff preservation (S4), propose-only integration
  governance (S5), doc-convention capture incl. freshness discipline (S6), link-rot
  surfacing (S7), non-destructive root cleanup with an active-context counter-trap (S8),
  and stakes-override tiering off a money-gated ledger (S9).
- The fixture author (W1, Opus subagent) was given these signal *themes* only and did
  **not** read `generator/PROJECT_SETUP_PROMPT.md`, the presets, templates, knowledge-base,
  workflows, feedback, or case-studies (bias-containment prohibition, spec L2.2 / §8). All
  business facts (depots, gear lines, seasons, dollar figures, dates, decisions) are
  invented and internally consistent across files.
- **No external packages to verify:** this is a docs-only fixture — no lockfiles, no
  dependencies, no network access needed to analyze it (spec §8, install-free).
- **Leak-scan:** fixture tree greps clean against the runtime-derived denylist of real
  project/client names (`case-studies/` dir stems, `feedback/*.md` stems) — 0 matches.
