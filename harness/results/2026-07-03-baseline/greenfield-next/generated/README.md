# Tempo Deck

A tiny personal tool for tracking metronome practice sessions. Log what you drilled,
at what BPM, and for how long — then watch your tempo creep up over the weeks.

This is an early-stage solo side project. No accounts, no database yet — the home page
shows a small seeded set of sessions to demonstrate the layout.

## Stack

- **Next.js 15.1** (App Router)
- **React 18.3**
- **TypeScript** (strict mode)
- **Tailwind CSS 3.4** with custom brand tokens (see `tailwind.config.ts`)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next.js ESLint |

## Environment

Copy `.env.example` to `.env.local` and fill in what you need:

- `RESEND_API_KEY` — optional; enables weekly recap emails via `lib/email.ts`. Blank = email disabled.
- `NEXT_PUBLIC_APP_NAME` — optional; overrides the header title (defaults to "Tempo Deck").

## Project layout

```
app/            App Router entry (layout, home page, global styles)
components/      Presentational components (kebab-case files, named exports)
lib/            Small helpers (email stub)
```

## Deploy

Deploys to Vercel as-is (`vercel.json` sets the Next.js framework preset). Push to your
connected repo or run the Vercel CLI — hobby tier is plenty for now.
