# unitkit — Quality Gates

> Scope: whole project; blocking verification chain for every change.

## Gate table

| Gate | Command | Blocking |
|------|---------|----------|
| Build (tsc — compiles + type-checks) | `npm run build` | Yes |
| Lint | `npm run lint` | Yes |

<!-- No Tests gate: unitkit has no test suite yet (DECISIONS #5). Add a Tests row here once a runner is wired.
     No separate Typecheck gate: `npm run build` runs tsc, which type-checks — a green build IS a green typecheck. -->

## When to run

- After every edit batch: `npm run build` + `npm run lint`
- Before every commit: both gates green
- Before publishing / tagging: both gates + a manual smoke run (`node dist/index.js 5 km in miles`)

## Failure protocol

- A failing gate BLOCKS the commit — fix forward or revert; never bypass (no skipped checks)
- Report the exact command + exit code — "should work" is not a verification

## Content policy

- Zero placeholder content (lorem, TODO copy, stub logic) in any shipped surface

## Division of labor

- The verifier agent (`.claude/agents/verifier.md`) runs this table mechanically; this rule binds the main thread to the same gates
