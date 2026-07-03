# Tempo Deck — Quality Gates

> Scope: whole project; blocking verification chain for every change.

## Gate table
| Gate | Command | Blocking |
|------|---------|----------|
| Typecheck | `npx tsc --noEmit` | Yes |
| Lint | `npm run lint` | Yes |
| Build | `npm run build` | Yes |

No test gate — no test runner is installed. If you add one (Vitest/Jest/Playwright), add a `test` script, add a Tests row here, and update `AGENTS.md` + `CLAUDE.md`'s Definition of Done.

## When to run
- After every edit batch: typecheck + lint (fast gates)
- Before every commit: typecheck + lint + build
- Before deploy: the full table

## Failure protocol
- A failing gate BLOCKS the commit — fix forward or revert; never bypass (no `--no-verify`, no skipped CI)
- Report the exact command + exit code — "should work" is not a verification

## Content policy
- Zero placeholder content (lorem, TODO copy, stub assets) in any shipped surface. Note: `lib/email.ts` is a deliberate, documented stub — not placeholder copy.

## Division of labor
- The verifier agent (`.claude/agents/verifier.md`) runs this table mechanically; this rule binds the main thread to the same gates
