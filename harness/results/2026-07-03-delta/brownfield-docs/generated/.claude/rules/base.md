# Trailhead Collective — Base Rules

## Execution Protocol

1. **SOURCE OF TRUTH FIRST** — read `OPS-MASTER-PLAN.md` before touching anything; if a playbook disagrees with it, the master plan wins.
2. **SEARCH FIRST** — `grep -r "term" docs/ governance/` before writing a new playbook; a fact usually already lives somewhere.
3. **REUSE / LINK FIRST** — link to the single source of truth for a fact; never restate it in a second place.
4. **READ BEFORE EDIT** — read a file's full content before modifying it.
5. **NO ASSUMPTIONS** — only use facts from files you have read, the master plan, and the ledger. Do not invent depots, gear lines, figures, or dates.
6. **PLAN FIRST** — for a new playbook, a governance decision, or an index restructure, start in Plan mode.
7. **VERIFY** — after every change run the doc-lint gates (`.claude/rules/quality-gates.md`): link health, index drift, ledger integrity.

## Docs-First Protocol

- Single source of truth per fact — link to it, never restate it.
- Ledgers are append-only — never edit an existing DECISIONS entry; add a new superseding one. Keep the D-number sequence; do not start a second ledger.
- Date-stamped claims carry `verified:` — a claim without a confirmed date is an opinion. Stale = older than 90 days; a stale date is more honest than a wrongly-bumped one.
- No orphan docs — every new doc gets an `INDEX.md` row in the same change.
- Archive, don't delete — superseded docs move to `docs/archive/`.

## Hard Constraints

- NEVER add credentials, API keys, or service integrations — propose via `governance/INTEGRATIONS-REGISTRY.md`; the founder bootstraps every credential (D4, binding).
- NEVER flag money/recurring-cost advice silently — cash is tight in shoulder seasons; a recurring bill is a governance decision with a money gate, not a convenience call.
- NEVER bump a `verified:` date without confirming the content.
- NEVER touch `HANDOFF.md` unless you are running the session it describes; append, never rewrite.
- NEVER invent depot names — they are exactly Pinecrest, Ridgeway, Stonebrook, Larkfield.
