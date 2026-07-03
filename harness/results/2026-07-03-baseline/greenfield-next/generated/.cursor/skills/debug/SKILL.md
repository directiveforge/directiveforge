# Debug Skill

> **Trigger**: Use this skill when encountering a bug, unexpected behavior, or error that needs systematic investigation.

## Problem Classification

| Type | Approach |
|------|----------|
| Runtime error with stack trace | Start at the error, trace upward through the call stack |
| Silent wrong behavior | Add logging, bisect the problem space |
| Hydration mismatch | Compare server vs client render — usually a `'use client'` boundary or non-deterministic value |
| Type error / build failure | Read the full error, check recent changes to involved files |
| Styling not applying | Check the Tailwind `content` globs in `tailwind.config.ts` cover the file; confirm the token exists |

## Phase 1: Reproduce

1. Get exact reproduction steps from the user or error log
2. Run `npm run dev` and reproduce in the browser, or `npm run build` for build-time errors
3. Isolate: can you reproduce with a minimal input or the seeded `SEED_SESSIONS` data?
4. Record the exact error message, stack trace, or wrong output

## Phase 2: Investigate

1. Read the failing code and its direct dependencies (imports, called components)
2. Search for the same function/variable across `app/ components/ lib/`
3. Check recent changes: `git log --oneline -10 -- <path>` and `git diff HEAD~3 -- <path>` (once under git)

## Phase 3: Diagnose

1. Form a hypothesis about the root cause (state it explicitly)
2. Verify with one targeted change: a focused log or assertion
3. If the hypothesis is wrong, return to Phase 2 with new information

## Phase 4: Fix

1. Make the minimal fix that addresses the root cause — not the symptom
2. Run `npx tsc --noEmit` to verify no type regressions
3. Run `npm run lint` to verify no lint violations
4. Search for the same bug pattern in adjacent code

## Gotchas

- Server components can't use hooks or browser APIs — a "window is not defined" error means you need `'use client'` or a client child
- The `@/` alias resolves to the project root, not `src/` — a "module not found" often means a wrong assumed path
- Tailwind classes silently do nothing if the file isn't covered by the `content` globs — check `tailwind.config.ts`

## When NOT to Use

- For feature requests or new functionality (use the implementation workflow)
- For code review (use the reviewer agent)
- For refactoring (refactoring during debugging masks the real issue)
