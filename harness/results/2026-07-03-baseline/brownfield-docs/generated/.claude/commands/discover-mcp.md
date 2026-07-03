# Discover MCP Servers (Propose-Only)

Scan for MCP servers that could help this repo. **Governance override (D4): this command PROPOSES, it never wires.** No config is edited, no account created, no key stored. Output is a proposal + a founder-bootstrap checklist, per `governance/INTEGRATIONS-REGISTRY.md`.

## Why propose-only here

`D4` binds all operators and assistants: no external service credentials or integrations without a founder bootstrap. An MCP server is an external integration. So even a server that passes every quality gate stops at a proposal — the founder decides and bootstraps.

## Steps

1. Read `governance/INTEGRATIONS-REGISTRY.md` — what is already vetted, what is already proposed
2. Read `.env.example` if present (this repo has none — there are no secrets by design)
3. Identify candidate services this repo actually uses. For a pure-Markdown ops repo the realistic set is small:
   - **GitHub** (if the repo is hosted on GitHub) — issues/PRs on the docs
   - **Context7** — only if the corpus starts discussing external library APIs (it does not today)
   - Database / payments / CMS connectors — **not applicable** (no runtime, no DB, no code)
4. For any candidate NOT in the kit registry, check the registry first: `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
5. Run the 5-gate quality check on each candidate (EXISTS / MAINTAINED / TRUSTED / SECURE via `uvx snyk-agent-scan@latest` / USEFUL)
6. **Stop at a proposal.** Draft a registry row under "Proposed — awaiting founder bootstrap" in `governance/INTEGRATIONS-REGISTRY.md` with: tool, job it does, why an existing vetted tool cannot cover it, recurring cost if any, and the least-privilege credential surface. Do not touch any `.mcp.json`.

## Output

```
## MCP Discovery Report (proposals only)

Proposed (drafted into the registry, awaiting founder bootstrap):
- [server] — [job] — [least-privilege scope] — [recurring cost] — passed gates: [list]

Rejected:
- [server] — reason: [failed gate N]

Not applicable:
- [service] — [why this repo does not need it]

Founder action required:
- Review governance/INTEGRATIONS-REGISTRY.md "Proposed" section; bootstrap or reject each.
```

## When NOT to Use

- Right after initial setup (setup already resolved MCP posture: propose-only, no servers wired)
- When no new external-service dependency has appeared (none can, without a decision)
