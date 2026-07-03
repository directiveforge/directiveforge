# Tempo Deck — Base Rules

## Execution Protocol

1. **SEARCH FIRST** — `grep -rn "term" app/ components/ lib/` before implementing anything new
2. **REUSE FIRST** — extend existing components/helpers before creating new ones (the tree is small — reuse `BeatCounter` / `TempoBadge` / `SessionList`)
3. **READ BEFORE EDIT** — always read a file's full content before modifying it
4. **NO ASSUMPTIONS** — only use facts from files you've read, user messages, and tool results
5. **VERIFY** — after every change: `npx tsc --noEmit` → `npm run lint`
6. **PLAN FIRST** — for multi-file changes, start in Plan mode; execute only after the plan accounts for all requirements
7. **FEEDBACK LOOP** — typecheck + lint after every change; self-correct before committing; never commit unverified work

## Core Conventions

- Package manager: `npm` — NEVER introduce yarn/pnpm/bun (`package-lock.json` is the lockfile)
- Exports: named for components (`export function X`); route entry files also `export default` — Next.js requires it for pages/layouts
- File naming: `kebab-case.tsx` files, `PascalCase` components
- TypeScript: strict mode (`tsconfig.json`) — no `any`; type props explicitly

## Commands Reference

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint + fix | `npm run lint` |
| Type check | `npx tsc --noEmit` |
| Build | `npm run build` |

There is no test command — no test runner is installed.

## Hard Constraints

- NEVER commit secrets, tokens, or `.env` / `.env.local` values (`RESEND_API_KEY` lives in the environment only)
- NEVER add dependencies without confirming they don't already exist in `package.json`
- NEVER skip the verify step — type errors and lint failures in committed code are unacceptable
- NEVER reference paths that don't exist (no `src/`, no `app/api/`, no `middleware.ts`, no database) — the `@/` alias resolves to the project root
