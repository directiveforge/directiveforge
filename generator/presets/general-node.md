# Generator Preset: General Node.js (Express / Fastify)

> Supplement for `PROJECT_SETUP_PROMPT.md` when the target project is a Node.js server without a full-stack framework.
> Detected by: Node.js project with `express` or `fastify` in dependencies; no `next`, `nuxt`, or `remix`.

---

## Stack Detection Signals

```bash
# Identify server framework and supporting stack
grep -E '"express"|"fastify"|"hono"|"koa"' package.json
grep -E '"prisma"|"drizzle-orm"|"typeorm"|"knex"|"mongoose"' package.json
grep -E '"zod"|"joi"|"yup"|"typebox"' package.json  # validation library
grep -E '"vitest"|"jest"|"mocha"' package.json       # test framework
cat tsconfig.json | grep '"module"'                  # ESM vs CJS
```

## CLAUDE.md Additions

Add to Architecture section:

```markdown
## Architecture
- **Entry**: `src/index.ts` — app factory, middleware registration, server start
- **Routing**: `src/routes/` — one file per domain; registered in `src/app.ts`
- **Controllers**: `src/controllers/` — parse request, call service, format response
- **Services**: `src/services/` — business logic; no HTTP concepts (no req/res)
- **DB layer**: `src/db/` or `src/repositories/` — all database access isolated here
- **Middleware**: `src/middleware/` — auth, error handler, request logger
- **Types**: `src/types/` — shared TypeScript interfaces; no runtime code
```

## Cursor Rules Additions

### `src/` glob rule additions

```markdown
## NODE.JS SERVER CONVENTIONS
- Layer order: route → controller → service → repository — never skip layers
- NEVER import db client or ORM outside src/db/ (or src/repositories/)
- NEVER use req.body without validation — use Zod/Joi at controller boundary
- ALWAYS return consistent response shape: { data, error, meta }

## ASYNC / ERROR HANDLING
- ALWAYS use async/await — no callbacks or raw Promises in new code
- Wrap async route handlers with asyncHandler() or equivalent — never unhandled rejections
- Error middleware must be last — (err, req, res, next) signature
- Use structured logging (pino/winston) — never bare console.log in production paths

## TYPESCRIPT
- Extend Request type for user session: declare module 'express' { interface Request { user?: User } }
- Use zod .parse() not .safeParse() at controller boundary — let errors propagate to error handler
- NEVER use 'any' — use 'unknown' and narrow
```

### Common Pitfalls for CLAUDE.md

```markdown
## Common Pitfalls
- Express error handlers require 4 params (err, req, res, next) — 3-param versions are not called for errors
- Fastify serialization: response schemas are enforced — extra fields are stripped unless schema allows them
- Body parser middleware must be registered before routes that use req.body
- ORM connection pool: singleton pattern required — multiple PrismaClient instances cause connection exhaustion
- ESM with Node: use .js extension in imports even for .ts files when targeting ESM output
```

## MCP Additions

Based on detected stack:

**PostgreSQL:**
```json
"postgres": {
  "command": "uvx",
  "args": ["mcp-postgresql-ops@3.2.8"],
  "env": { "DATABASE_URL": "${DATABASE_URL}" }
}
```
> ⚠️ `@modelcontextprotocol/server-postgres` is archived (May 2025) with a known SQL-injection bypass (Datadog Security Labs) — banned by `MCP-SERVER-REGISTRY.md`. Use `mcp-postgresql-ops` (PyPI via `uvx`, read-only DBA tools).

**MongoDB:**
```json
"mongodb": {
  "command": "npx",
  "args": ["-y", "mongodb-mcp-server"],
  "env": { "MONGODB_URI": "${MONGODB_URI}" }
}
```

## Recommended Skills

- `deployment/SKILL.md` — Docker build + deploy workflow
- `migration/SKILL.md` — if project uses Prisma or Drizzle migrations

## Recommended MCP Servers

- **Context7** — always (framework API hallucinations are common, especially Express v5 vs v4)
- **GitHub** — always
- **Database connector** — match to detected ORM/DB

## Key Files to Check During Analysis

```
src/index.ts / src/server.ts     # Entry point — startup sequence
src/app.ts                        # App factory — middleware order matters
src/routes/index.ts               # Route registration — discover all endpoints
src/middleware/errorHandler.ts    # Error shape and logging pattern
src/db/client.ts                  # ORM singleton — confirm single instance
package.json scripts              # dev, build, test, lint, migrate commands
tsconfig.json                     # paths aliases, module system, outDir
.env.example                      # Required env vars
Dockerfile                        # Base image, build steps, CMD
```

## ESM vs CJS Detection

```bash
cat package.json | grep '"type"'
# "type": "module"  → ESM → imports use .js extension
# no "type" or "type": "commonjs" → CJS → require() or ts-node
cat tsconfig.json | grep '"module"'
# "NodeNext" or "ESNext" → ESM output
# "CommonJS" → CJS output
```

Include detected module system in CLAUDE.md under Code Style.
