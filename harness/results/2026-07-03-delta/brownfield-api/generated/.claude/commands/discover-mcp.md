# Discover MCP Servers

Scan project dependencies for MCP servers not yet configured. Run after adding new dependencies or when an MCP could help with a service you're working with.

## Steps

1. Read `pyproject.toml` — extract dependencies that reference external services
2. Read `.env.example` and `app/config.py` — identify services from env-var names (`DATABASE_URL` → Postgres/SQLite)
3. Read current `.mcp.json` — note what's already configured (context7, postgres)
4. **Check the curated registry first**: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md` — if the service has a vetted entry, use it (already security-reviewed)
5. For services NOT in the registry, search:
   ```bash
   npm search "mcp-server-{service}"
   pip index versions "{service}-mcp"        # or check https://pypi.org/search/?q={service}+mcp
   ```
6. Run the Quality Check on each candidate outside the registry (ALL 5 gates must pass):
   - **EXISTS**: `npm info <package>` / PyPI JSON succeeds
   - **MAINTAINED**: last publish < 6 months, not deprecated
   - **TRUSTED**: official OR >1000 weekly downloads OR >50 GitHub stars
   - **SECURE**: `uvx snyk-agent-scan@latest` passes (full verdict needs `SNYK_TOKEN`)
   - **USEFUL**: the project actually uses this service enough to justify MCP
7. For servers that pass: add to `.mcp.json` with a pinned version + a `${ENV_VAR}` for any credential + a security-posture entry in `.mcp.annotations.md`
8. Run `uvx snyk-agent-scan@latest` on the updated config

## Registry note for THIS stack

- Postgres: the archived `@modelcontextprotocol/server-postgres` is DO-NOT-USE (SQL-injection advisory). Use `mcp-postgresql-ops` (PyPI via `uvx`, read-only) — already configured.
- Docs: `@upstash/context7-mcp` (read-only) — already configured; keeps FastAPI/Pydantic v2/SQLAlchemy API signatures fresh.

## Output

```
## MCP Discovery Report
Servers added:
- [package@version] — [service] — [posture] — requires: [ENV_VARS]
Servers found but rejected:
- [package] — reason: [failed gate N]
Services without MCP:
- [service] — no server found (using Context7 for docs)
New environment variables needed:
- [VAR_NAME] — [description]
```

## When NOT to Use

- Right after initial setup (the generator already ran MCP discovery)
- If no new dependencies were added since the last run
