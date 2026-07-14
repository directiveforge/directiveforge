---
allowed-tools: Read, Glob, Grep, Bash(git log:*), Bash(wc:*), Bash(npm outdated:*), Bash(npm audit:*)
description: Analyze and prioritize technical debt in the codebase
---

Analyze unitkit for technical debt and produce a prioritized remediation plan.

## Scan Areas

### 1. Dependency Health

Check `package.json` for:
- Outdated major versions: `npm outdated`
- Known vulnerabilities: `npm audit`
- Unused dependencies (declared but not imported)

### 2. Code Complexity

Search for:
- Files over 300 lines in `src/` (today all three are tiny)
- TODO/FIXME/HACK comments: `grep -rn "TODO\|FIXME\|HACK\|XXX" src/`
- Deeply nested logic (>3 levels of indentation)
- Functions with excessive parameters (>5 arguments)
- Duplicated conversion logic that should live in the `UNITS` table

### 3. Test Coverage Gaps

- unitkit has NO test suite yet (DECISIONS #5) — this is the standing P1 debt item
- Critical paths with no coverage: `convert()` (factor math + dimension guard), `findUnit()` (alias lookup), `index.ts` exit codes

### 4. Architecture Drift

- Convention violations (files outside `src/`, default exports creeping in)
- Inconsistent patterns (factors scattered outside `src/units.ts`)
- `any` usage sneaking past lint

### 5. Configuration

- Outdated TypeScript / ESLint versions
- Missing `engines` field in `package.json` (Node version is currently undeclared)
- No lockfile committed (dependency versions are not reproducible)

## Categorization

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0 — Critical** | Correctness bug (wrong conversion), data loss | Fix now |
| **P1 — High** | Blocks confidence or causes recurring bugs (e.g. no tests) | Fix within a couple of sessions |
| **P2 — Medium** | Slows development but has workarounds | Schedule when adjacent work |
| **P3 — Low** | Cosmetic or nice-to-have | Track, fix opportunistically |

## Output

### Tech Debt Report: unitkit

**Summary**: X findings (Y critical, Z high, W medium, V low)

#### P0 — Critical
- [finding] — [file/location] — [estimated effort] — [why now]

#### P1 — High
- [finding] — [file/location] — [estimated effort] — [impact if deferred]

#### P2 — Medium
- [finding] — [file/location] — [estimated effort]

#### P3 — Low
- [finding] — [file/location]

#### Recommended Action Plan
1. **Immediate**: [P0 items]
2. **Next**: [P1 items — e.g. wire `node:test` + cover `convert()`/`findUnit()`]
3. **Opportunistic**: [P2 items]
