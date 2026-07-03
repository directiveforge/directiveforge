# Discover MCP Servers

Scan for MCP servers that could help — then, per this repo's governance, PROPOSE only. Nothing gets wired up.

## Governance gate (read FIRST)

Per **D4** and `governance/INTEGRATIONS-REGISTRY.md`, no MCP server, credential, or service is installed without a founder bootstrap. This command NEVER edits `.mcp.json`. Its only output is a proposal you draft into the registry for the founder to bootstrap.

## Steps

1. Identify the need — what external service or capability is the current work reaching for? (This is a docs repo with no dependency manifest, so there is nothing to scan mechanically; the trigger is a concrete workflow need.)
2. **Check the curated registry first**: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md` — if the service has a vetted entry, cite it (security posture + config already documented)
3. For a service NOT in the registry, search:
   ```bash
   npm search "mcp-server-{service}"
   npm search "@{service}/mcp"
   ```
4. Run the 5-gate quality check on any candidate (EXISTS / MAINTAINED / TRUSTED / SECURE via `uvx snyk-agent-scan@latest` / USEFUL)
5. **Do NOT add it.** Draft a candidate row in `governance/INTEGRATIONS-REGISTRY.md` under "Proposed — awaiting founder bootstrap" with: the tool, the job, why a vetted tool can't cover it, the least-privilege credential scope, and any recurring cost
6. Stop. The founder bootstraps the credential and moves the row to "Vetted and in use"

## Output

```
## MCP Discovery Report (proposal only)
Need: [what capability is reaching for a server]
Candidate: [package@version] — [security posture] — requires: [scope]
Registry status: [vetted entry cited / passed 5 gates / rejected: reason]
Registry row drafted: [yes — awaiting founder bootstrap / no candidate warranted]
```

## When NOT to Use

- There is no concrete workflow need — a docs-ops repo rarely needs an MCP server
- Right after initial setup (the generator already ran discovery and found none warranted)
