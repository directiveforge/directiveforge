# Tempo Deck

A personal metronome-practice tracker for a single developer — logs what was drilled, at what BPM, for how long.

## Stack

- **Language**: TypeScript 5 (strict mode)
- **Framework**: Next.js 15.1.6 (App Router) + React 18.3.1
- **Database**: none (home page renders a seeded in-memory array)
- **Auth**: none
- **Styling**: Tailwind CSS 3.4.17 with custom brand tokens (`tailwind.config.ts`)
- **Testing**: none configured
- **Package manager**: npm (`package-lock.json`)
- **Deployment**: Vercel (hobby tier; `vercel.json`, region `iad1`)

## Dev Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (next build)
npm run start        # Serve the production build
npm run lint         # ESLint via next lint (next/core-web-vitals)
npx tsc --noEmit     # Type check (no dedicated script; tsconfig is strict + noEmit)
```

There is intentionally **no `test`, `typecheck`, `migrate`, or `seed` script** — this project has no test runner, no database, and no migrations. Do not invent commands for them.

## Directory Structure

```
app/            # App Router: layout.tsx (wrapper), page.tsx (home), globals.css
components/      # Presentational components (kebab-case files, named exports)
lib/             # Helpers — email.ts (dormant Resend stub)
```

No `src/`, no `app/api/`, no `middleware.ts`, no `prisma/` — do not reference paths that do not exist.

## Architecture

- App Router with server components by default — no client components exist yet; add `'use client'` only for interactivity.
- Data flows as typed props top-down (`page.tsx` → `session-list` → `beat-counter` → `tempo-badge`) — no fetching, no state library, no API layer.
- `@/*` path alias resolves to the **project root** (not `src/`).

## Key Constraints

- NEVER commit secrets or `.env` / `.env.local` values — `RESEND_API_KEY` stays in the environment only.
- NEVER add a dependency without confirming it is not already in `package.json`.
- NEVER claim tests pass — there is no test runner. The verify step is `npx tsc --noEmit` + `npm run lint`.
- All data is passed as typed props validated at the TypeScript boundary — keep the `PracticeSession` type as the single source of shape.

## AI Workflow Kit

Engineering standards, MCP catalog, and validation checklists are at `<KIT_ROOT>`. Consult when:
- Discovering or evaluating MCP servers → `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- Writing or updating rules/agents → `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md`
- Verifying generated output quality → `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`

## Environment Variables

See `.env.example` for names. Never read `.env` / `.env.local` directly.
- `RESEND_API_KEY` — optional; enables the `lib/email.ts` recap stub. Blank = email disabled.
- `NEXT_PUBLIC_APP_NAME` — optional; overrides the header title (defaults to "Tempo Deck").

## File Location Reference

| Type | Location |
|------|----------|
| Route entry (home) | `app/page.tsx` |
| Root layout + metadata | `app/layout.tsx` |
| Global styles | `app/globals.css` |
| Components | `components/*.tsx` |
| Helpers | `lib/*.ts` |
| Brand tokens | `tailwind.config.ts` |
