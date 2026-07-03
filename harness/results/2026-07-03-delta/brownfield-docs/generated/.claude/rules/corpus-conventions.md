# Corpus Conventions

> Scope: `docs/**` and `governance/**`. The one rule that replaces frontend/api/db/testing
> rules for a Markdown ops corpus.

## Naming & structure

- **Playbooks** live in `docs/`, one topic per file, `kebab-case.md`. Headings are sentence case.
- **Dated one-time reports** (audits, comparisons, raw field notes) live in `docs/archive/`, named `TOPIC-YYYY-MM.md`. They are frozen — not living playbooks.
- Every new `docs/*.md` playbook gets a row in `docs/INDEX.md` in the same change. No orphans.

## Frontmatter (every `docs/*.md` playbook)

```
owner: <role or name>
verified: YYYY-MM-DD
sources: <where this was confirmed from>
```

- `verified:` is load-bearing — the freshness signal for the 90-day audit. NEVER bump it without re-confirming the content.

## Citation & freshness discipline

- One source of truth per fact: link to it, never restate it. If two files would state the same fact, one links to the other.
- A date-stamped claim without a `verified:` date is an opinion, not a playbook fact.
- `OPS-MASTER-PLAN.md` sits above every playbook; a playbook that contradicts it is the thing that's wrong — reconcile via a governance decision, do not silently diverge.

## Governance artifacts

- `governance/DECISIONS.md`: `## D{N} — title`, appended in sequence, never rewritten. Reverse by appending a new superseding entry. Next after the last is the next number — do not start a second ledger.
- `governance/INTEGRATIONS-REGISTRY.md`: propose external tools under "Proposed — awaiting founder bootstrap"; never move a row to "Vetted and in use" yourself (D4 — founder bootstraps credentials).
