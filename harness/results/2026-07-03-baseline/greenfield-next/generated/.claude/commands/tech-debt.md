---
allowed-tools: Read, Glob, Grep, Bash(git log:*), Bash(wc:*), Bash(npm outdated:*), Bash(npm audit:*)
description: Analyze and prioritize technical debt in the codebase
---

Analyze Tempo Deck for technical debt and produce a prioritized remediation plan.

## Scan Areas

### 1. Dependency Health
- Outdated major versions: `npm outdated`
- Known vulnerabilities: `npm audit`
- Unused dependencies (declared but not imported)

### 2. Code Complexity
- Files over 150 lines in `app/ components/ lib/` (the tree is tiny — anything large is a smell)
- TODO/FIXME/HACK comments: `grep -rn "TODO\|FIXME\|HACK\|XXX" app/ components/ lib/`
- Duplicated logic across the small component set

### 3. Missing Foundations (expected for a pre-MVP side project — rank honestly)
- No test runner — the largest structural gap; note it, don't over-weight it for a solo tool
- No persistence — home page uses a seeded array
- `lib/email.ts` is a stub, not wired up

### 4. Architecture Drift
- Convention violations (files in the wrong directory)
- Inconsistent patterns (e.g. some components adding `'use client'` without reason)
- Deprecated Next.js APIs (check the Next 15 migration guide)

### 5. Configuration
- `.env.example` drift vs actual `process.env` usage
- Build warnings suppressed but unresolved

## Categorization

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0** | Security risk or data loss | Fix now |
| **P1** | Blocks development or causes recurring bugs | Fix soon |
| **P2** | Slows development, has workarounds | Schedule when adjacent |
| **P3** | Cosmetic / nice-to-have | Track, fix opportunistically |

## Output

### Tech Debt Report: Tempo Deck
**Summary**: X findings (Y critical, Z high, W medium, V low)

#### P0 — Critical
- [finding] — [location] — [effort] — [why now]

#### P1 — High / P2 — Medium / P3 — Low
- [finding] — [location] — [effort]

#### Recommended Action Plan
1. Immediate: [P0]
2. Next: [P1 grouped by area]
3. Opportunistic: [P2]
