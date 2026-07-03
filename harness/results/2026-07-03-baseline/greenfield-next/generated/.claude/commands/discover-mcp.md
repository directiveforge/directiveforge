# Discover MCP Servers

Scan Tempo Deck's dependencies for MCP servers not yet configured. Run after adding new dependencies or when an MCP could help with a service you're working with.

## Steps

1. Read `package.json` — extract dependencies that reference external services
2. Read `.env.example` — identify services from API key variable names (`RESEND_API_KEY` → Resend)
3. Read current `.cursor/mcp.json` and `.mcp.json` — note what's already configured (and read `.mcp.annotations.md` for the vetted-but-not-installed candidates: Vercel RO, Resend)
4. **Check the curated registry first**: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md` — if the service has a vetted entry, use it
5. For services NOT in the registry, search npm:
   ```bash
   npm search "mcp-server-{service}"
   npm search "@{service}/mcp"
   npm search "{service}-mcp-server"
   ```
6. Run the 5-gate Quality Check on each candidate found outside the registry:
   - **EXISTS**: `npm info <package>` succeeds
   - **MAINTAINED**: last publish < 6 months, not deprecated
   - **TRUSTED**: official OR >1000 weekly downloads OR >50 GitHub stars
   - **SECURE**: `uvx snyk-agent-scan@latest` passes (Snyk Agent Scan, PyPI; full verdict needs `SNYK_TOKEN`)
   - **USEFUL**: the project actually uses the service enough to justify the MCP surface (a dormant stub like `lib/email.ts` does NOT)
7. For servers that pass all 5 gates: add to both `.cursor/mcp.json` and `.mcp.json` with a pinned version, an `${ENV_VAR}` for credentials, and a posture entry in `.mcp.annotations.md`
8. Run `uvx snyk-agent-scan@latest` on the updated config

## Output

```
## MCP Discovery Report
Servers added: [package@version — service — posture — requires: ENV_VARS]
Servers found but rejected: [package — reason: failed gate N]
Services without MCP: [service — using Context7 for docs]
New environment variables needed: [VAR — description]
```

## When NOT to Use

- Right after initial setup (the generator already ran discovery — see `.mcp.annotations.md`)
- If no new dependencies have been added since the last run
