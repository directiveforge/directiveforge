# Trailhead Collective — Base Rules

> Scope: whole corpus. This is a documentation repository — there is no code, build, or runtime. Rules govern how docs, the ledger, and governance artifacts are written and changed.

## Execution Protocol

1. **SEARCH FIRST** — `grep -rn "term" docs/ governance/` before writing a new playbook or claim; the fact may already live somewhere.
2. **REUSE FIRST** — link to the existing source of truth for a fact; extend an existing playbook before creating a new one.
3. **READ BEFORE EDIT** — read a file's full content (and the sources it cites) before modifying it.
4. **NO ASSUMPTIONS** — only use facts written in this repo, the master plan, the ledger, or the operator's messages. Never invent depot names, gear lines, or dollar figures.
5. **VERIFY** — after every change run the doc-lint gates (`.claude/rules/quality-gates.md`): link health, index drift, ledger integrity.
6. **PLAN FIRST** — for multi-file doc changes, start in Plan mode; execute only after the plan accounts for source reconciliation and index updates.
7. **FEEDBACK LOOP** — re-run the gates after every change; self-correct before finishing.

## DOCS-FIRST PROTOCOL

- **Single source of truth per fact** — link to it, never restate it. Duplicated facts drift.
- **The ledger is append-only** — never edit an existing `D{N}` entry; add a new one that supersedes it. Never create a second ledger or a root `DECISIONS.md`.
- **Date-stamped claims carry `verified:`** — a claim without a date is an opinion. Bump the date only after an actual re-check.
- **No orphan docs** — every new doc gets a `docs/INDEX.md` row in the same change.
- **Archive, don't delete** — superseded docs move to `docs/archive/`.

## Governance & Money

- **Propose, never wire (D4)** — recommend a tool and draft its `governance/INTEGRATIONS-REGISTRY.md` proposal row; never create an account, store a key, or connect anything. The founder bootstraps every credential.
- **Money is a governed gate** — any cost or recurring bill is flagged, not assumed; spend above the depot threshold needs a signed `D{N}` with a stated ceiling (`D6`).

## Hard Constraints

- NEVER commit secrets, tokens, credentials, or account access — none belong in this repo at all (D4).
- NEVER add an external service or dependency — propose it via the registry; the founder decides.
- NEVER skip the doc-lint gates — a dead link or index orphan is a defect.
- NEVER bump a `verified:` date you did not actually confirm.
- NEVER let a playbook override `OPS-MASTER-PLAN.md` — the master plan wins; reconcile via a governance decision.
