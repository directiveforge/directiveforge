# Discover MCP Servers

Scan project dependencies for MCP servers not yet configured. Run after adding new dependencies or when you suspect an MCP could help with a service you're working with.

## Steps

1. Read `package.json` — extract any dependencies that reference external services
2. Read `.env.example` if present — identify services from API-key variable names (unitkit has none today)
3. Read current `.mcp.json` — note what's already configured (currently: `context7` only)
4. **Check the curated registry first**: read `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md` — if the service has a vetted entry, use it (already security-reviewed with config examples)
5. For services NOT in the registry, search npm:
   ```bash
   npm search "mcp-server-{service}"
   npm search "@{service}/mcp"
   npm search "{service}-mcp-server"
   ```
6. Run the Quality Check on each candidate found outside the registry (ALL 5 gates must pass):
   - **EXISTS**: `npm info <package>` succeeds
   - **MAINTAINED**: last publish < 6 months, not deprecated
   - **TRUSTED**: official (by the service provider) OR >1000 weekly downloads OR >50 GitHub stars
   - **SECURE**: `uvx snyk-agent-scan@latest` passes after adding (full verdict needs `SNYK_TOKEN`)
   - **USEFUL**: the project actually uses this service enough to justify MCP access
7. For servers that pass: add to `.mcp.json` with a pinned version (`@x.y.z`), `${ENV_VAR}` for credentials, and a security-posture entry in `.mcp.annotations.md` (strict JSON carries no comments)
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

- Right after initial project setup (the generator already ran MCP discovery — result: Context7 only)
- If no new dependencies have been added since the last run
