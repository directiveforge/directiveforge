# Generator Preset: Next.js (App Router)

> Supplement for `PROJECT_SETUP_PROMPT.md` when the target project uses Next.js 13+ with App Router.
> Detected by: `"next"` in dependencies AND presence of `app/` directory.

---

## Stack Detection Signals

```bash
# Confirm App Router (not Pages Router)
ls app/                        # exists → App Router
ls app/layout.tsx              # root layout present
grep -r "use client" app/      # count of client components
grep -r "use server" app/      # count of server actions
```

## CLAUDE.md Additions

Add to the Architecture section:

```markdown
## Architecture
- **Rendering**: Server components by default — add `'use client'` only for interactivity (state, events, browser APIs)
- **Data fetching**: fetch() in server components with `revalidate` tags; React Query for client mutations
- **Server Actions**: `app/actions/` — `'use server'` directive; validated with Zod before execution
- **Routing**: File-based in `app/` — `page.tsx` renders, `layout.tsx` wraps, `loading.tsx` streams
- **API routes**: `app/api/[resource]/route.ts` — export `GET`, `POST`, etc.
- **Middleware**: `middleware.ts` at root — Edge runtime only (no Node.js built-ins)
```

## Cursor Rules Additions

### `app/` glob rule additions

```markdown
## NEXT.JS APP ROUTER
- Server components: no hooks, no event handlers — async by default
- Client components: add 'use client' at top — minimize their scope
- NEVER use useEffect for data that can be server-fetched
- NEVER import server-only modules ('server-only') in client components

## SERVER ACTIONS
- Define in app/actions/ with 'use server'
- Validate ALL inputs with Zod before any DB operation
- Return { success: true, data } or { success: false, error } — never throw to client

## IMAGE OPTIMIZATION
- ALWAYS use next/image — never <img> tags
- ALWAYS provide width + height or fill prop

## METADATA
- Export generateMetadata() from page.tsx — no manual <head> tags
```

### Common Pitfalls for CLAUDE.md

```markdown
## Common Pitfalls
- Middleware runs on Edge — no fs, crypto, or Node built-ins in middleware.ts
- 'use server' does NOT mean server component — it's for Server Actions only
- React cache() for request-level deduplication; unstable_cache for cross-request
- next/headers and cookies() are async in Next.js 15 — await them
- Static params with generateStaticParams must return all paths or set dynamicParams
```

## MCP Additions

If project uses Vercel for deployment:

```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@vercel/mcp-adapter"],
  "env": {
    "VERCEL_TOKEN": "${VERCEL_TOKEN}"
  }
}
```

## Recommended Skills

- `deployment/SKILL.md` — covers `vercel deploy --prod` workflow
- `migration/SKILL.md` — if using Prisma/Drizzle with the project

## Recommended MCP Servers

- **Context7** — always (prevents Next.js App Router API hallucinations — API changed significantly in v13-15)
- **GitHub** — always (PR workflow)
- **shadcn/ui MCP** — if using shadcn/ui (component registry, blocks, e-commerce patterns)
- **Official Figma MCP** — if team uses Figma for design (design-to-code, Code Connect, design tokens)
- **21st.dev Magic MCP** — for rapid React/Tailwind UI scaffolding from descriptions
- **Lighthouse MCP** — for performance-critical sites (Core Web Vitals, SEO, accessibility)
- **Playwright MCP** — for E2E tests and visual verification
- **Vercel** — if deployed on Vercel
- **Database connector** — based on DB choice (Prisma → PostgreSQL MCP, Drizzle → same)
- **Flowbite MCP** — if using Tailwind for e-commerce blocks and brand-to-theme generation

## Key Files to Check During Analysis

```
app/layout.tsx          # Root layout — identify metadata, providers, auth wrapper
app/middleware.ts        # Auth guards, redirects, edge logic
next.config.ts           # Feature flags, redirects, image domains, experimental flags
tailwind.config.ts       # Theme, content paths, plugins
src/lib/auth.ts          # Auth configuration (NextAuth, Clerk, etc.)
prisma/schema.prisma     # DB schema (if using Prisma)
```

## Variant: Content-First / Headless CMS (conditional)

**Fire condition** — a headless CMS client in dependencies (`sanity` / `next-sanity` / `contentful` / `@payloadcms/*` / `@strapi/*`) AND no relational-DB/auth stack (`prisma`, `drizzle-orm`, `next-auth`, `@clerk/*` absent). Record the preset selection in the install manifest as `nextjs:content-first`.

The base preset above assumes an app with a database and auth; a content hub has neither. Adjust:

**DROP** (do not generate):
- Prisma/Drizzle migration skill and DB-connector MCP rows
- Server-Actions-with-Zod DB-mutation guidance (content mutations go through the CMS client)
- NextAuth/Clerk auth assumptions and auth-related key files
- React-Query-mutation guidance; e-commerce block recommendations (shadcn/Flowbite rows)

**SUBSTITUTE**:
- Data layer = the typed CMS query layer (e.g. GROQ / GraphQL client) — queries colocated per the project's convention; treat query files as the schema surface to check during analysis
- Image pipeline = the CMS image loader + `next/image` (CMS CDN params, not bare defaults)
- `middleware.ts` = locale routing when i18n libs are present (`next-intl` etc.) — not auth
- Data-fetching guidance centers on SSG/ISR: `generateStaticParams` + `revalidate` over per-request fetching

**KEEP**: server components by default, `generateMetadata`, all App Router rules above.

**MCP**: add the CMS server per `MCP-SERVER-REGISTRY.md` (registry entry carries the current transport + posture — do not pin here).
