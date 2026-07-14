# unitkit — Base Rules

## Execution Protocol

1. **SEARCH FIRST** — `grep -rn "term" src/` before implementing anything new
2. **REUSE FIRST** — extend existing functions and patterns before creating new
3. **READ BEFORE EDIT** — read a file's full content before modifying it
4. **NO ASSUMPTIONS** — only use facts from files you've read, user messages, and tool results
5. **VERIFY** — after every change: `npm run build` (tsc) → `npm run lint`
6. **PLAN FIRST** — for multi-file changes, start in Plan mode
7. **FEEDBACK LOOP** — build + lint after every change; never commit unverified work

## Core Conventions

- Package manager: `npm` (no lockfile committed) — do not switch managers
- Exports: named only (`export function` / `export const`) — no default exports
- File naming: lowercase (`units.ts`, `convert.ts`, `index.ts`)
- TypeScript: strict; `any` is a lint ERROR — never use it

## Commands Reference

| Task | Command |
|------|---------|
| Build (tsc — compiles + type-checks) | `npm run build` |
| Lint | `npm run lint` |
| Run the CLI | `node dist/index.js <value> <from> in <to>` |

## Hard Constraints

- NEVER commit secrets, tokens, or .env values
- NEVER add dependencies without confirming they don't already exist in `package.json`
- NEVER skip the verify step — type errors and lint failures in committed code are unacceptable
- NEVER add temperature units to the `UNITS` factor table — temperature needs offset math (DECISIONS #3)
