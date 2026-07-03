# MCP Server Registry

> Curated, opinionated list of MCP servers recommended for AI-assisted development workflows.
> Organized by deployment confidence. Source: KB-01 §7 (MCP Ecosystem), cross-referenced with WORKFLOW-CURSOR.md and WORKFLOW-CLAUDE-CODE.md §MCP sections.
>
> Security posture legend: **RO** = read-only | **RW** = read-write | **LOCAL** = no external calls

**Last verified:** 2026-05-28 (live npm registry checks performed on `@modelcontextprotocol/server-github`, `@modelcontextprotocol/server-filesystem`, `@modelcontextprotocol/server-memory`, `@upstash/context7-mcp` per v0.14.2 patch responding to vigilance daily-pulse 5/28 BLOCKER on `modelcontextprotocol/servers` security cluster). **2026-07-02 (v0.17.0)**: live re-checks on `@sanity/mcp-server` (deprecated → remote `https://mcp.sanity.io`) and `@upstash/context7-mcp` (re-pinned `@3.0.0` → `@3.2.2`).

---

## ⚠ May 2026 security cluster (operator action required)

Between 2026-05-05 and 2026-05-16, the upstream `modelcontextprotocol/servers` monorepo shipped **4 security commits** addressing auth bypass + DoS (npm deps) and command injection + XXE (Python deps). The kit's recommendations below reflect post-cluster verification, but operators with existing `.mcp.json` configurations should:

1. Run `npm audit` against your installed MCP server packages — flag any high/critical findings against the 2026-05-16 baseline.
2. For each kit-recommended server below, verify your pinned version is at or above the version listed in the entry.
3. If your project predates 2026-05-16 and uses any `@modelcontextprotocol/server-*` package without a version pin (i.e. `npx -y @modelcontextprotocol/server-X` without `@x.y.z`), repin explicitly per the kit's version-pin policy.

This security cluster surfaced in `vigilance/feed/daily/2026-05-28.md` as the kit's first 🚨 BLOCKER from the live vigilance cadence (caught on cadence day 5 of operations).

---

## Tier 1 — Production-Tested (Most Projects)

These servers are battle-tested, widely adopted, and appropriate for nearly every project.

### GitHub MCP

**UPDATED 2026-04-09**: GitHub now publishes an **official remote MCP server** at `https://api.githubcopilot.com/mcp/` with **51 tools** (vs ~32 in the npm package), OAuth auto-flow (no PAT in env), and explicit lockdown mode for prompt injection. Prefer the remote version unless air-gapped or PAT-only environment.

🚨 **UPDATED 2026-05-28 (v0.14.2):** `@modelcontextprotocol/server-github` npm package is **DEPRECATED by Anthropic**. Live npm-registry check on 2026-05-28 returned `"deprecated":"Package no longer supported. Contact Support at https://www.npmjs.com/support for more info."` Latest npm version is `2025.4.8` (April 2025) — frozen since, did not receive the May 2026 security cluster patches. The legacy-npm option below should NOT be used for new installs; existing installs should migrate to the remote HTTP endpoint.

- **Server**: `github/github-mcp-server` (26.9K stars, GitHub/Microsoft official, updated April 2026)
- **Install (RECOMMENDED — only supported option):** Remote HTTP — `https://api.githubcopilot.com/mcp/`
- **Install (legacy npm — DEPRECATED, do not use):** ~~`npx -y @modelcontextprotocol/server-github`~~ — package frozen at `2025.4.8` (April 2025), Anthropic marked deprecated, no security patches. Migrate any existing config to the remote HTTP endpoint above.
- **Quality**: Production (remote HTTP only)
- **Security posture**: **RW** — full GitHub API access via OAuth (remote). Remote includes lockdown mode for prompt injection.
- **Credentials**: None for remote OAuth (browser-based consent)
- **Capabilities**: Repos, issues, PRs (51 tools), code search, branch mgmt, Actions workflow debugging, Dependabot security alerts
- **Use when**: Project is on GitHub and agents need to create PRs, read issues, search code, monitor CVEs
- **Skip when**: Air-gapped environments where remote HTTP is not reachable (in which case GitHub MCP is not available; use direct `gh` CLI via Bash tool as fallback)

```json
// Only supported install — remote OAuth
"github": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/"
}
```

---

### Context7

- **Package**: `@upstash/context7-mcp`
- **Install**: `npx -y @upstash/context7-mcp@3.2.2` *(version pinned per kit policy; live-verified latest 2026-07-02)*
- **Stars**: 50K | Quality: Production
- **Security posture**: **RO** — fetches public documentation only; no credentials required
- **Credentials**: None
- **Capabilities**: Up-to-date library documentation for 1,000+ packages; prevents hallucinated API signatures
- **Use when**: Always — prevents the most common coding hallucination (wrong API signatures from outdated training data)
- **Skip when**: Fully offline/air-gapped environments

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@3.2.2"]
}
```

---

### PostgreSQL MCP

⚠️ **SECURITY ADVISORY (2026-04-09)**: `@modelcontextprotocol/server-postgres` was **archived May 2025** and has a **known SQL injection vulnerability** documented by Datadog Security Labs (read-only transaction wrapper can be bypassed). Despite ~21,000 weekly npm downloads, the package is abandoned and will not receive patches. **DO NOT USE.**

**Replacement**: Use **MCP-PostgreSQL-Ops** (Python via uvx) — 30+ read-only tools, actively maintained, purpose-built for Postgres DBA operations (schema inspection, EXPLAIN, index health, vacuum monitoring). Alternative for advanced DBA features (if it resumes development): `crystaldba/postgres-mcp` (Postgres MCP Pro with HypoPG-based index recommendations).

- **Package**: `mcp-postgresql-ops` (PyPI, run via `uvx`)
- **Install**: `uvx mcp-postgresql-ops@3.2.8` (pin the version)
- **Quality**: Production
- **Security posture**: **RO** — 30+ read-only tools, no write surface. Connection string via `DATABASE_URL` env var. Use read-only DB user for defense in depth
- **Credentials**: `DATABASE_URL` (read-only user recommended)
- **Capabilities**: Schema inspection, EXPLAIN plan analysis, table/index stats, vacuum monitoring, connection info
- **Use when**: Project uses PostgreSQL and agents need to understand schema or verify queries
- **Skip when**: Production database (use read replica or dev DB only); sensitive PII without column-level masking

```json
"postgres": {
  "command": "uvx",
  "args": ["mcp-postgresql-ops@3.2.8"],
  "env": { "DATABASE_URL": "${DATABASE_URL}" }
}
```

Source: real-project MCP research dossier (2026-04-09) §Anti-recommendations.

---

### Filesystem MCP

⚠️ **NOTE (2026-04-09)**: Claude Code already has built-in file system access with sandboxing. Installing this MCP adds redundant tool surface area that may confuse tool selection. **Skip unless using a client without built-in file access.**

- **Package**: `@modelcontextprotocol/server-filesystem`
- **Install**: `npx -y @modelcontextprotocol/server-filesystem@2026.1.14 /path/to/allow` *(version pinned per kit policy; live-verified latest 2026-05-28 = `2026.1.14`. Note: latest publish is from Jan 2026, predates the May 2026 security cluster; operators should `npm audit` their transitive deps to verify vulnerable upstream packages are not bundled.)*
- **Quality**: Production
- **Security posture**: **RW** scoped to specified directories; fine-grained directory allowlist
- **Credentials**: None (path-based access control)
- **Capabilities**: Read, write, list files within allowed directories
- **Use when**: Cursor or other client without built-in file access
- **Skip when**: Claude Code (built-in is sufficient); home directory access (~/) is overly broad

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/docs", "/path/to/configs"]
}
```

---

### Memory MCP

- **Package**: `@modelcontextprotocol/server-memory`
- **Install**: `npx -y @modelcontextprotocol/server-memory@2026.1.26`
- **Quality**: Production (official MCP reference server, 100K+ monorepo stars)
- **Security posture**: **LOCAL** — JSONL knowledge graph stored on disk, no network access
- **Credentials**: None
- **Capabilities**: Persistent entities + relations + observations across Claude sessions. Lightweight, zero dependencies
- **Use when**: Cross-session knowledge continuity, project context preservation, decision history
- **Skip when**: Project already has structured memory system (custom Markdown, vector DB, etc.)
- **Note**: npm last published Jan 26 2026 — stable/mature, monorepo actively maintained. Set `MEMORY_FILE_PATH` to persist outside project root to avoid git pollution

```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory@2026.1.26"],
  "env": {
    "MEMORY_FILE_PATH": "/path/to/persistent/mcp-memory.jsonl"
  }
}
```

---

### Git MCP (local repository operations)

- **Package**: `mcp-server-git` (PyPI, run via `uvx`) — **note**: not on npm despite some docs suggesting otherwise
- **Install**: `uvx mcp-server-git@2026.1.14`
- **Quality**: Production (official MCP reference server)
- **Security posture**: **LOCAL** — reads local `.git` directories only, no network calls
- **Credentials**: None
- **Capabilities**: status, diff, log, search, branch listing, commit history. Complements GitHub MCP (which uses GitHub API) with fast direct access to local git state
- **Use when**: Local git context analysis, diff review before committing, log filtering across repos
- **Skip when**: Claude Code's built-in git access feels sufficient (overlap is real)

```json
"git": {
  "command": "uvx",
  "args": ["mcp-server-git@2026.1.14"]
}
```

---

## Tier 2 — Stack-Specific (Add When Relevant)

Add these when the project uses the corresponding technology.

### Playwright MCP

- **Package**: `@playwright/mcp`
- **Install**: `npx -y @playwright/mcp`
- **Stars**: 6.1K | Quality: Production
- **Security posture**: **LOCAL** — browser automation runs locally; no external credentials
- **Credentials**: None (browser profiles may contain session data)
- **Capabilities**: Browser automation, screenshot, form interaction, JS execution in browser context
- **Use when**: Project has E2E tests, requires browser-based verification, or generates UI components
- **Skip when**: CI environments without display; security-sensitive sessions in browser profiles

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp"]
}
```

---

### Neon MCP (Serverless PostgreSQL)

- **Package**: `@neondatabase/mcp-server-neon`
- **Install**: `npx -y @neondatabase/mcp-server-neon`
- **Quality**: Production
- **Security posture**: **RW** — full Neon platform access (branch creation, query execution)
- **Credentials**: `NEON_API_KEY`
- **Capabilities**: Database branching, natural language SQL, migration management
- **Use when**: Project uses Neon as database provider; especially useful for branch-per-PR workflows
- **Skip when**: Non-Neon PostgreSQL; production database (use dev branch only)

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon"],
  "env": { "NEON_API_KEY": "${NEON_API_KEY}" }
}
```

---

### Supabase MCP

- **Package**: `@supabase/mcp-server-supabase`
- **Quality**: Beta
- **Security posture**: **RW** — full platform access (DB, auth, storage, edge functions)
- **Credentials**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (service role = full access, use carefully)
- **Capabilities**: Database operations, auth management, storage, edge functions, realtime
- **Use when**: Project uses Supabase as BaaS
- **Skip when**: Using only Supabase as PostgreSQL host (use PostgreSQL MCP instead); service_role key is too broad for read-only needs

```json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase"],
  "env": {
    "SUPABASE_URL": "${SUPABASE_URL}",
    "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
  }
}
```

---

### SQLite MCP

- **Package**: `@modelcontextprotocol/server-sqlite`
- **Install**: `npx -y @modelcontextprotocol/server-sqlite --db-path ./db.sqlite`
- **Quality**: Production
- **Security posture**: **RW** scoped to specified SQLite file; **LOCAL**
- **Credentials**: None (file-path based)
- **Use when**: Local development with SQLite; CLI tools; testing environments
- **Skip when**: Production workloads; PostgreSQL/MySQL projects

---

### Sentry MCP

- **Package**: `@sentry/mcp-server`
- **Quality**: Production
- **Security posture**: **RO** — reads error data; no write operations to production systems
- **Credentials**: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`
- **Capabilities**: Error tracking, stack traces, performance issues, release tracking
- **Use when**: Project has Sentry integration and agents need to debug production errors
- **Skip when**: No Sentry configured; no production error budget (early projects)

---

### Sanity MCP (CMS)

🚨 **UPDATED 2026-07-02**: `@sanity/mcp-server` npm package is **DEPRECATED by Sanity**. Live npm-registry check on 2026-07-02 returned `"This package has been deprecated. Use the remote MCP server at https://mcp.sanity.io instead."` (latest npm version `0.12.2`, frozen). Migrate any existing config to the remote HTTP endpoint.

- **Server**: Remote HTTP at `https://mcp.sanity.io` (Sanity official, hosted; docs: sanity.io/docs/ai/mcp-server)
- **Install (RECOMMENDED — only supported option)**: `claude mcp add Sanity -t http https://mcp.sanity.io --scope user` (or equivalent `"type": "http"` entry)
- **Install (legacy npm — DEPRECATED, do not use)**: ~~`@sanity/mcp-server`~~ — deprecated upstream 2026, no further releases
- **Quality**: Production (remote; managed infrastructure, auto-updated)
- **Security posture**: **RW** — GROQ queries, document read/write, schema exploration; scoped via OAuth-granted project access
- **Credentials**: None for remote OAuth (browser-based consent; no `SANITY_TOKEN` to generate or rotate)
- **Use when**: Project uses Sanity as headless CMS and agents need to query or update content
- **Skip when**: Content operations are human-only; air-gapped environments where remote HTTP is not reachable

```json
"sanity": {
  "type": "http",
  "url": "https://mcp.sanity.io"
}
```

*(web-verified 2026-07-02: npm deprecation string + official Sanity MCP docs)*

---

### Stripe MCP

- **Package**: `@stripe/agent-toolkit` (MCP adapter)
- **Quality**: Beta
- **Security posture**: **RW** — financial operations; use restricted keys with minimum necessary permissions
- **Credentials**: `STRIPE_SECRET_KEY` — **use restricted key, never full secret key**
- **Use when**: Project has Stripe integration and agents need to inspect subscriptions or products
- **Skip when**: Never for write operations in production without human confirmation gate

---

### Vercel MCP

- **Server**: Remote HTTP at `https://mcp.vercel.com` (Vercel official, hosted)
- **Install**: `claude mcp add --transport http vercel https://mcp.vercel.com`
- **Quality**: Production (Vercel official)
- **Security posture**: **RO** — read-only access via OAuth, confused-deputy attack prevention
- **Credentials**: None — OAuth flow opens browser for consent
- **Capabilities**: Deployments, projects, environment variables (read), build logs, Vercel docs search
- **Use when**: Project deployed to Vercel; need deploy health monitoring, env var inspection, build log debugging
- **Skip when**: Not on Vercel; OAuth token expires too frequently
- **Note**: Read-only is a feature, not a limitation — prevents accidental destructive operations on production deploys

```json
"vercel": {
  "type": "http",
  "url": "https://mcp.vercel.com"
}
```

---

### i18n MCP (Translation Drift Detection)

- **Package**: `i18n-mcp` (community, dalisys/i18n-mcp)
- **Install**: `npx -y i18n-mcp@1.0.10` with config flags
- **Quality**: Production (418 stars, active 2026)
- **Security posture**: **LOCAL** — reads/writes JSON locale files only, no network
- **Credentials**: None
- **Capabilities**: Detect missing keys between locales, scan source for hardcoded strings, generate TypeScript types from translations, validate next-intl nested namespace format, get coverage stats
- **Use when**: Multi-locale projects (especially next-intl), bilingual content QA, i18n type safety
- **Skip when**: Single-locale projects; pure runtime translation (no source files)
- **Note**: Currently the only purpose-built i18n drift MCP. Cannot detect SEMANTIC drift (where keys exist but meanings diverge) — that's a known gap

```json
"i18n": {
  "command": "npx",
  "args": [
    "-y", "i18n-mcp@1.0.10",
    "--dir", "./src/i18n/messages",
    "--base-language", "en",
    "--src-dir", "./src",
    "--project-root", ".",
    "--frameworks", "react"
  ]
}
```

---

### Notion MCP (Knowledge Base / Docs)

- **Server**: Official hosted, remote HTTP at `https://mcp.notion.com/mcp` (makenotion, Streamable HTTP transport)
- **Install (RECOMMENDED — hosted OAuth):** `claude mcp add --transport http notion https://mcp.notion.com/mcp` → authenticate via `/mcp`
- **Quality**: Production (Notion official)
- **Security posture**: **RW** — reads + writes workspace content (pages, databases, comments). Access is scoped by the user at OAuth consent time — grant only the pages/databases the agent needs (minimum-permission)
- **Credentials**: None — OAuth browser consent (no token in env, same model as GitHub/Vercel/Sanity hosted servers)
- **Capabilities**: Search / read / create / update pages + databases, comments, workspace navigation
- **Use when**: Project or personal knowledge base lives in Notion (specs, PRDs, meeting notes, task tracking) and agents need to read or write it
- **Skip when**: No Notion workspace; content is human-only; or you want a pinned/air-gapped setup (use the token-based local option below)
- **Note**: Hosted URL has no version to pin (like GitHub/Vercel/Sanity). Local/pinnable alternative = `@notionhq/notion-mcp-server` (official, uses a Notion internal-integration token via `NOTION_TOKEN` env) — prefer only when OAuth isn't viable. After connecting, run a `tools/list` probe before trusting tool loading (Notion's official surface is clean, but the kit's invalid-tool-name guard applies to every new server)

```json
// Hosted OAuth (recommended)
"notion": {
  "type": "http",
  "url": "https://mcp.notion.com/mcp"
}
```

---

## Tier 3 — Experimental (Evaluate Before Adopting)

These servers are newer, less-tested, or have higher security risk profiles.

### Brave Search MCP

- **Package**: `@modelcontextprotocol/server-brave-search`
- **Security posture**: **RO** — web search; requires Brave Search API key
- **Credentials**: `BRAVE_API_KEY`
- **Use when**: Agents need to search the web for up-to-date information (e.g., checking npm package existence, CVEs)
- **Note**: Free tier is limited; Context7 covers documentation better for known libraries

---

### Cognee (Memory/RAG)

- **Package**: `cognee-mcp`
- **Stars**: 15K | Quality: Production
- **Security posture**: **RW** — reads and writes to local graph/vector store
- **Credentials**: Optional (external vector DB credentials if configured)
- **Capabilities**: Graph RAG, vector search, full-text search across 30+ data formats
- **Use when**: Project needs persistent cross-session agent memory or knowledge graph over large codebases
- **Evaluate**: Setup complexity is higher; validate fit before committing

---

### Datadog MCP

- **Quality**: Beta (official Cursor plugin partnership)
- **Security posture**: **RO** — reads metrics, logs, traces
- **Credentials**: `DATADOG_API_KEY`, `DATADOG_APP_KEY`
- **Use when**: Project uses Datadog for observability and agents need production metrics during debugging
- **Evaluate**: Beta status; verify tool stability before adopting in team workflows

---

### Figma MCP (Official)

- **Package**: Remote HTTP server at `https://mcp.figma.com/mcp`
- **Quality**: Production (open beta, 14 tools)
- **Security posture**: **RW** — reads design context + writes to canvas (beta)
- **Credentials**: Figma account (OAuth via MCP)
- **Capabilities**: Read components/variables/auto-layout, generate code (React+Tailwind default), write-to-canvas, Code Connect (maps Figma components to codebase), FigJam diagram generation, live UI capture
- **Use when**: Design-to-code workflows, design system extraction, component scaffolding from Figma files
- **Skip when**: Figma Starter plan (only 6 MCP calls/month — Professional at $15/mo is realistic minimum)
- **Setup Cursor**: Settings → MCP → add HTTP server → `https://mcp.figma.com/mcp`
- **Setup Claude Code**: `claude mcp add --transport http figma https://mcp.figma.com/mcp`
- **Note**: Write-to-canvas free during beta, will become usage-based. Never run multiple Figma MCP servers simultaneously — confuses the AI agent

---

### Framelink MCP (Figma Read-Only)

- **Package**: `figma-developer-mcp`
- **Stars**: 13.1K | Quality: Production
- **Security posture**: **RO** — simplifies Figma API responses to layout-relevant data only
- **Credentials**: `FIGMA_ACCESS_TOKEN` (personal access token)
- **Capabilities**: Token-efficient Figma reads, layout data, component properties
- **Use when**: Supplement to Official Figma MCP for lightweight reads that don't burn rate limits; Cursor context window optimization
- **Skip when**: Need write access or Code Connect (use Official Figma MCP)
- **Note**: Community consensus: "Way better at one-shotting designs than pasting screenshots." Free on all Figma plans

```json
"framelink": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp"],
  "env": { "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}" }
}
```

---

### shadcn/ui MCP (Component Library)

- **Package**: Remote HTTP server at `https://ui.shadcn.com/docs/mcp`
- **Quality**: Production (official)
- **Security posture**: **RO** — reads component registry, blocks, and documentation
- **Credentials**: None
- **Capabilities**: Browse full shadcn registry (components, blocks, e-commerce patterns), natural language install, multi-registry search, dry-run/diff
- **Use when**: ANY React + Tailwind project using shadcn/ui (or considering it). Essential for luxury e-commerce UI scaffolding
- **Skip when**: Not using React or Tailwind
- **Setup Cursor**: Add to `.cursor/mcp.json`
- **Setup Claude Code**: Use `/mcp` command
- **Note**: Free and open-source. Built on Radix primitives, outputs Tailwind CSS. CLI v4 (March 2026) supports natural language commands

---

### 21st.dev Magic MCP (UI Generation)

- **Package**: `@21st-dev/magic-mcp`
- **Stars**: 4.4K | Quality: Production
- **Security posture**: **RO** — retrieves and generates components from community library
- **Credentials**: `TWENTY_FIRST_API_KEY` (free tier available)
- **Capabilities**: Generate production-ready React/TypeScript/Tailwind components from descriptions — hero sections, pricing tables, navigation, forms. Library-based retrieval (not pure generation)
- **Use when**: Rapid UI scaffolding, luxury component variations, exploring design patterns
- **Skip when**: Need pixel-perfect Figma reproduction (use Figma MCP instead)
- **Note**: Free tier ~5 generations/month. Functions as "v0 in your IDE"

```json
"21st-magic": {
  "command": "npx",
  "args": ["-y", "@21st-dev/magic-mcp"],
  "env": { "TWENTY_FIRST_API_KEY": "${TWENTY_FIRST_API_KEY}" }
}
```

---

### Lighthouse MCP (Performance/SEO/Accessibility)

- **Package**: `@danielsogl/lighthouse-mcp`
- **Quality**: Production
- **Security posture**: **LOCAL** — runs Lighthouse audits locally
- **Credentials**: None
- **Capabilities**: Core Web Vitals (LCP, FID, CLS), performance budgets, accessibility audits, SEO scoring, security checks
- **Use when**: Performance-critical projects (e-commerce, content sites), accessibility compliance, SEO optimization
- **Skip when**: CI already runs Lighthouse (avoid duplication)

```json
"lighthouse": {
  "command": "npx",
  "args": ["-y", "@danielsogl/lighthouse-mcp@latest"]
}
```

---

### BrowserTools MCP (Chrome DevTools for Cursor)

- **Package**: `@anthropic/browser-tools-mcp`
- **Stars**: 4.5K+ | Quality: Production
- **Security posture**: **LOCAL** — connects to real Chrome via extension + Node middleware
- **Credentials**: None (requires Chrome extension + Node server)
- **Capabilities**: Console logs, network requests, screenshots, DOM inspection, Lighthouse audits — all surfaced in Cursor
- **Use when**: Cursor-specific debugging workflows, visual verification, performance profiling
- **Skip when**: Claude Code only (use Playwright MCP instead); setup overhead not justified for simple projects
- **Note**: Three-component setup (Chrome extension + Node server + MCP server) but exceptional developer experience

---

### Flowbite MCP (Tailwind Components)

- **Package**: Remote server at `https://flowbite.com/docs/getting-started/mcp/`
- **Quality**: Production (official)
- **Security posture**: **RO** — Tailwind CSS context and component library
- **Credentials**: None
- **Capabilities**: Tailwind context for LLMs, Figma-to-code converter, theme generation from brand colors, pre-built e-commerce blocks
- **Use when**: Tailwind projects needing component scaffolding and brand-to-theme conversion
- **Skip when**: Already using shadcn/ui exclusively
- **Note**: Free and open-source. Supports React, Svelte, and raw HTML

---

### Design Token Bridge MCP

- **Package**: `design-token-bridge-mcp` (GitHub: kenneives/design-token-bridge-mcp)
- **Quality**: Beta
- **Security posture**: **RO** — reads token files, generates output
- **Credentials**: None
- **Capabilities**: Extract tokens from Tailwind/CSS/Figma/W3C DTCG format, generate native themes (Material 3, SwiftUI, Tailwind config, CSS Variables), WCAG contrast validation
- **Use when**: Multi-platform token translation, design system documentation, accessibility validation
- **Skip when**: Single-platform project with simple token needs

---

### Draw.io MCP (Diagramming)

- **Package**: Remote HTTP server at `https://mcp.draw.io/mcp`
- **Quality**: Production (official by JGraph, Feb 2026)
- **Security posture**: **RO** — renders diagrams, no external data access
- **Credentials**: None
- **Capabilities**: Render Mermaid syntax into editable draw.io diagrams, XML and CSV-to-diagram conversion
- **Use when**: Architecture diagrams, user flow mapping, system design documentation
- **Skip when**: Already using Miro or Excalidraw
- **Note**: Zero installation required. "Gets you 80-90% of the way there" for professional diagrams

---

### Miro MCP (Collaborative Diagramming)

- **Package**: Remote HTTP server at `https://mcp.miro.com/`
- **Quality**: Production (official)
- **Security posture**: **RW** — creates and modifies Miro board content
- **Credentials**: Miro OAuth 2.1
- **Capabilities**: Sequence diagrams, flowcharts, sticky notes, visual flows on Miro boards
- **Use when**: Team collaboration, user journey mapping, workshop facilitation
- **Skip when**: Solo developer (Draw.io is simpler)
- **Note**: One connection per user per team at a time

---

## UI/Design MCP Recommended Stacks

### Luxury E-Commerce (Next.js + Tailwind)

Priority order:
1. **Official Figma MCP** — primary design context, Code Connect ($15/mo)
2. **shadcn/ui MCP** — component scaffolding, registry search (free)
3. **21st.dev Magic** — rapid luxury UI generation (freemium)
4. **Playwright MCP** — browser preview, screenshots (free)
5. **Framelink MCP** — lightweight Figma reads, saves rate limits (free)
6. **Lighthouse MCP** — Core Web Vitals, SEO, accessibility (free)
7. **Flowbite MCP** — Tailwind e-commerce blocks, brand-to-theme (free)

### Education / Content Platform

1. **Official Figma MCP** or **Framelink** — design context
2. **shadcn/ui MCP** — component library
3. **Playwright MCP** — browser preview
4. **Lighthouse MCP** — accessibility compliance (WCAG critical for education)
5. **Draw.io MCP** — architecture and flow diagrams

### Key Workflow Principles

- Structure Figma files with semantic layer names and Auto Layout for MCP success
- Follow sequence: get_design_context → get_screenshot → download assets → implement → validate
- Store all API tokens in environment variables
- Pin MCP server versions and review changelogs
- Never run multiple Figma MCP servers simultaneously
- AI-generated code from Figma MCP delivers 50-70% time savings, producing "80-90% correct" first drafts

---

## Security Checklist Before Adding Any Server

From KB-01 §7.4 (OWASP MCP Security Minimum Bar):

1. **Verify the package**: Check npm for download count, publishing org, and recent activity
   ```bash
   npm info <package-name> | grep -E "version|downloads|publisher"
   ```
2. **Pin versions**: Use exact versions in production, not `-y` (latest)
3. **Minimum permissions**: Use read-only credentials where possible; restrict scope
4. **No production write access**: Development agents should not have write access to production systems
5. **Audit with Snyk Agent Scan** before deploying team configs:
   ```bash
   uvx snyk-agent-scan@latest
   ```
   `snyk-agent-scan` (PyPI, run with `uvx`) is **Snyk Agent Scan** — formerly Invariant Labs' `mcp-scan`, rebranded after **Snyk's 2025 acquisition of Invariant Labs** (web-verified 2026-06-26). It auto-discovers local agent configs (Claude, Cursor, etc.) and scans MCP servers, skills, and harnesses for 15+ risk categories (prompt injection, tool poisoning/shadowing, toxic flows, hardcoded secrets). The **full verdict requires a free `SNYK_TOKEN`** (app.snyk.io); without it the scan still enumerates components but degrades to inventory, and stdio servers are auto-declined in non-interactive (non-TTY) runs. The old npm `mcp-scan` is an unrelated third-party tool, and `@anthropic/mcp-scan` never existed.
6. **Review tool descriptions**: Tool poisoning hides instructions in descriptions invisible to users
7. **Separate untrusted servers**: Use Docker MCP Gateway for servers with higher risk profiles

---

## Config Format Reference

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": { "KEY": "${KEY}" }
    }
  }
}
```

**Claude Code** (`.mcp.json` at project root):
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": { "KEY": "${KEY}" }
    }
  }
}
```

Both formats are identical JSON — only the filename and location differ.

---

## Anti-Recommendations (DO NOT INSTALL)

Updated 2026-04-09 from a real-project MCP server research dossier (e-commerce stack: Next.js + Medusa v2 + Sanity + Stripe).

| Server | Reason | Replacement |
|--------|--------|-------------|
| `@modelcontextprotocol/server-postgres` | ⚠️ Archived May 2025, **known SQL injection vulnerability** (Datadog Security Labs), no patches | `mcp-postgresql-ops` via uvx |
| `getsentry/sentry-mcp` | Search tools use embedded agents that **send Sentry data including stack traces to OpenAI/Anthropic APIs** (`OPENAI_API_KEY`/`ANTHROPIC_API_KEY` required) | None — view Sentry dashboard manually |
| `Quegenx/vercel-mcp-server` | Vercel API token **hardcoded in source files**; only 3 commits, last activity Oct 2025 | Official Vercel MCP at `https://mcp.vercel.com` |
| `doobidoo/mcp-memory-service` | Requires PyTorch + ChromaDB + sentence-transformers (~2-4 GB install), Apple Silicon needs special handling — **overkill for solo developer** | Official Memory MCP (zero deps) |
| BrowserStack MCP | Requires **active paid BrowserStack subscription** | Playwright MCP (free, local) |
| `andrasfe/vulnicheck` | Optionally sends vulnerability data to third-party LLMs when `OPENAI_API_KEY`/`ANTHROPIC_API_KEY` configured. Only 9 stars | OSV MCP (StacklokLabs) for clean free CVE checks |
| `@modelcontextprotocol/server-filesystem` | Redundant with Claude Code's built-in file access. Adds tool surface that confuses tool selection | Use Claude Code built-in |
| `@iflow-mcp/medusa-mcp@1.0.0` | 🚨 **Bricks Claude Code** — exposes Medusa's MongoDB-style filter operators (`$and`, `$or`) as top-level `inputSchema.properties` keys on `GetCollections` / `GetOrders` / `GetProducts` (and 6+ other Get* tools). `$` is invalid per Anthropic regex `^[a-zA-Z0-9_.-]{1,64}$` → entire `tools[]` array is rejected with HTTP 400 → no Claude Code request can complete in any project that loads this MCP. Confirmed against `dist/oas/store.json` 2026-04-09. Bug is structural (Medusa's REST API genuinely uses `$`-prefixed operators across 9+ store endpoints). | `mcp-postgresql-ops` for direct DB queries + Medusa CLI via Bash + Medusa Admin UI |

## Tool-loading Risk Note

API error `tools.N.custom.input_schema.properties: Property keys should match pattern '^[a-zA-Z0-9_.-]{1,64}$'` is caused by an MCP server publishing a tool with an invalid parameter name (e.g., starts with `$`, contains `:`, or unicode). The whole `tools[]` array is rejected by the API, breaking the session. **Real-world example**: `@iflow-mcp/medusa-mcp@1.0.0` (see Anti-Recommendations above) — confirmed 2026-04-09 after an MCP audit increased the total tool count and surfaced the latent bug. Mitigation: when adding many MCPs, prefer ones with small tool surfaces (Drift's 50+ and CodeMCP/CKB's 74 increase risk surface), pin versions so an upstream change can't silently break tool loading, and probe new MCPs with a JSON-RPC `tools/list` scanner before adding them to `.mcp.json` (run a `tools/list` scanner against any new server before adding it).
