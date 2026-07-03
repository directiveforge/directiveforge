# Trailhead Collective — Quality Gates (Doc-Lint)

> Scope: whole corpus. This repo has no compiler/lint/test toolchain — these doc-lint gates ARE the verification chain for every change. They replace build/lint/test.

## Gate table

| Gate | Check | Blocking |
|------|-------|----------|
| Link health | Extract `](path)` refs from changed docs; every relative target must resolve to a real file | Yes |
| Index drift | Every `docs/*.md` playbook ⇄ a `docs/INDEX.md` row; every `docs/INDEX.md` row points at a real file | Yes |
| Ledger integrity | `governance/DECISIONS.md` `D{N}` numbering is monotonic + gap-free; entries are append-only (no in-place edits to locked entries) | Yes |
| Source reconciliation | Every changed playbook's claims trace to its `sources:` (master plan / ledger / sibling); no claim contradicts `OPS-MASTER-PLAN.md` | Yes |
| Stale `verified:` | Grep frontmatter dates older than 90 days | No (report) |
| Frontmatter lint | Changed docs carry `owner` + `verified:` + `sources:`; `kebab-case` filename; sentence-case headings | No (report) |

## Runnable checks

```bash
# Link health — flag relative doc links whose target is missing
grep -roE '\]\(([^)]+\.md[^)]*)\)' docs/ governance/ README.md | sed -E 's/.*\(([^)#]+).*/\1/' | while read p; do [ -e "$p" ] || echo "DEAD LINK: $p"; done
# Index drift — playbooks not listed in INDEX.md
for f in docs/*.md; do b=$(basename "$f"); [ "$b" = INDEX.md ] && continue; grep -q "$b" docs/INDEX.md || echo "ORPHAN: $b"; done
# Index drift — INDEX rows pointing at missing files
grep -oE '\]\(([a-z0-9-]+\.md)\)' docs/INDEX.md | sed -E 's/.*\(([^)]+)\)/\1/' | while read p; do [ -e "docs/$p" ] || echo "INDEX->MISSING: $p"; done
# Ledger monotonic + gap-free
grep -oE '^## D[0-9]+' governance/DECISIONS.md | grep -oE '[0-9]+'
# Stale verified: dates (report only)
grep -rE '^verified:' docs/ | awk '{print $2, FILENAME}'
```

## When to run

- After every doc edit batch: link health + index drift (fast).
- Before finishing any change: the full blocking table.
- Before a season-close or freshness audit: the full table plus the stale-`verified:` report.

## Failure protocol

- A failing blocking gate BLOCKS the change — fix forward, never suppress.
- A dead link or index orphan is a defect, not a warning.
- Report the exact failing path — "looks fine" is not verification.

## Division of labor

- The verifier agent (`.claude/agents/verifier.md`) runs this table mechanically; this rule binds the main thread to the same gates.
