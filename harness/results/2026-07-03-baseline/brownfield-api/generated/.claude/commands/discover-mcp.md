# Discover MCP Servers

Scan project dependencies for MCP servers not yet configured. Run after adding new dependencies or when an MCP could help with a service you're working with.

## Steps

1. Read `pyproject.toml` — extract dependencies that reference external services
2. Read `.env.example` — identify services from variable names (`DATABASE_URL` → Postgres)
3. Read current `.mcp.json` — note what's already configured
4. **Check the curated registry first**: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md` — if the service has a vetted entry, use it (already security-reviewed with config examples)
5. For services NOT in the registry, search npm AND PyPI (vendor servers are often Python-distributed):
   ```bash
   npm search "mcp-server-{service}"
   pip index versions {service}-mcp        # or check https://pypi.org/search/?q={service}+mcp
   ```
6. Run Quality Check on each candidate found outside the registry (ALL 5 gates must pass):
   - **EXISTS**: `npm info <package>` / PyPI JSON succeeds
   - **MAINTAINED**: last publish < 6 months, not deprecated
   - **TRUSTED**: official OR >1000 weekly downloads OR >50 GitHub stars
   - **SECURE**: `uvx snyk-agent-scan@latest` passes (full verdict needs `SNYK_TOKEN`)
   - **USEFUL**: project actually uses this service enough to justify MCP
7. For servers that pass: add to `.mcp.json` with a pinned version + `${ENV_VAR}` credentials, and annotate posture in `.mcp.annotations.md`
8. Run `uvx snyk-agent-scan@latest` on the updated config

## Output

```
## MCP Discovery Report

Servers added:
- [package@version] — [service] — [security posture] — requires: [ENV_VARS]

Servers found but rejected:
- [package] — reason: [failed gate N: details]

Services without MCP:
- [service] — no MCP server found (using Context7 for docs)

New environment variables needed:
- [VAR_NAME] — [description]
```

## When NOT to Use

- Right after initial project setup (the generator already ran MCP discovery)
- If no new dependencies have been added since last run
