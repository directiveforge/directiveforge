# Generator Preset: Next.js (Pages Router)

> Supplement for `PROJECT_SETUP_PROMPT.md` when the target project uses Next.js with the Pages Router.
> Detected by: `"next"` in dependencies AND presence of `pages/` directory AND no `app/` directory.
> Large legacy population; dormant-revival runs land here — field-confirmed.

---

## Stack Detection Signals

```bash
# Confirm Pages Router (not App Router)
ls pages/                      # exists → Pages Router
ls app/ 2>/dev/null            # must NOT exist (both present → incremental migration, see routing table)
ls pages/api/                  # API routes live here
ls pages/_app.* pages/_document.* 2>/dev/null   # global wrappers
grep -rl "getServerSideProps\|getStaticProps\|getStaticPaths" pages/ | head -5
cat next.config.js 2>/dev/null || cat next.config.mjs 2>/dev/null
```

## CLAUDE.md Additions

Add to the Architecture section:

```markdown
## Architecture
- **Routing**: File-based in `pages/` — `pages/index.tsx` → `/`, `[slug].tsx` dynamic, `[...catchall].tsx` wildcard
- **Data fetching (per page)**: `getStaticProps` (+ `revalidate` for ISR) / `getStaticPaths` (fallback semantics) / `getServerSideProps` — page-level only, not per-component
- **Client fetching**: SWR / React Query for client-side data and mutations
- **API routes**: `pages/api/*` — `export default function handler(req, res)` with a method switch — NOT `route.ts`
- **Global wrappers**: `_app.tsx` = providers + persistent layout; `_document.tsx` = HTML shell (server-only)
- **Middleware**: `middleware.ts` at root — still Edge runtime (no Node built-ins)
```

## Cursor Rules Additions

### `pages/` glob rule additions

The centerpiece: agents default to App Router idioms — these rules block that hallucination class.

```markdown
## NEXT.JS PAGES ROUTER
- NEVER use 'use client' / 'use server' — no server components, no Server Actions here
- NEVER create app/-isms: layout.tsx, route.ts, loading.tsx, generateMetadata — use next/head per page
- Import from next/router, NOT next/navigation
- Data fetching lives in page files: getStaticProps / getServerSideProps — components receive props
- Props crossing getStaticProps/getServerSideProps must be JSON-serializable — no Date, undefined, functions

## API ROUTES (pages/api)
- export default function handler(req, res) with an explicit req.method switch; 405 on unhandled methods
- Validate request bodies at the handler boundary — API routes are public endpoints
- API routes run on Node by default (not Edge) — Node built-ins allowed here, unlike middleware

## SERVER/CLIENT BOUNDARY
- Keep server-only imports (db clients, secrets) INSIDE getStaticProps/getServerSideProps — the page file bundles for both targets
- Browser-only libraries: dynamic(() => import('...'), { ssr: false })
```

### Common Pitfalls for CLAUDE.md

```markdown
## Common Pitfalls
- next/navigation imports compile but break at runtime here — Pages Router uses next/router
- getStaticPaths fallback: false → 404s, true → needs router.isFallback UI, 'blocking' → SSR-like wait
- _app remounts page components on route change only if the component identity changes — persistent layout goes in _app
- API routes are Node runtime; middleware.ts is Edge — don't share Node-dependent code between them
- ISR: revalidate in getStaticProps is per-page; on-demand via res.revalidate(path) from an API route
```

## MCP Additions

Same as the App Router preset (Vercel adapter if deployed on Vercel).

## Recommended Skills

- `deployment/SKILL.md` — covers the project's deploy workflow
- `migration/SKILL.md` — if using Prisma/Drizzle with the project

## Recommended MCP Servers

- **Context7** — always; Pages↔App Router API confusion is the #1 Next.js hallucination class — pin docs lookups to the installed major version
- **GitHub** — always (PR workflow)
- **Playwright MCP** — for E2E tests and visual verification
- **Lighthouse MCP** — for performance-critical sites
- **Vercel** — if deployed on Vercel
- **Database connector** — based on DB choice

## Key Files to Check During Analysis

```
pages/_app.tsx           # Providers, persistent layout, global CSS import (only place it's allowed)
pages/_document.tsx      # HTML shell customization
pages/api/               # Every handler = a public endpoint; check validation
next.config.js           # Rewrites, redirects, image domains, i18n config (Pages Router has built-in i18n)
middleware.ts            # Edge logic — auth guards, redirects
tailwind.config.js       # Theme, content paths (if Tailwind)
```
