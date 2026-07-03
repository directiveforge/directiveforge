# Trailhead Collective — Quality Gates (doc-lint)

> Scope: whole corpus; blocking verification chain for every change. This repo has no
> compiler — these doc-lint gates ARE the feedback loop.

## Doc-Lint Gates

| Gate | Command / check | Blocking |
|------|-----------------|----------|
| Link health | `python3 .claude/scripts/check-links.py docs/archive` | Yes |
| Index drift | every `docs/*.md` (except INDEX) has an `INDEX.md` row ⇄ every `INDEX.md` link points at a real file | Yes |
| Ledger integrity | `governance/DECISIONS.md` numbering monotonic + append-only (no in-place edits to D1..D{last}) | Yes |
| Stale `verified:` | grep frontmatter dates older than 90 days | No (report) |
| Frontmatter lint | changed `docs/*.md` carry `owner` + `verified` (YYYY-MM-DD) + `sources` | No (report) |

The link-health gate excludes `docs/archive/` — archived reports are frozen and may
carry links to superseded siblings; they are not part of the live corpus.

## When to run

- After every doc edit: link health + index drift (fast gates)
- Before finalizing any change: all blocking gates
- Weekly review ritual + season-close: the full table, including the report-only gates

## Failure protocol

- A failing blocking gate STOPS the change — fix forward; never ship a dead link or an orphan doc
- Report the exact check + result — "should be fine" is not a verification
- A stale `verified:` date is reported, not auto-fixed: NEVER bump it without confirming the content (a stale date is more honest than a wrong one)

## Content policy

- No placeholder content (lorem, TODO copy, empty stub sections) in any shipped playbook
- Single source of truth per fact — link to it, never restate it

## Division of labor

- The verifier agent (`.claude/agents/verifier.md`) runs this table mechanically; this rule binds the main thread to the same gates.
