# Dispatch — KB-06 Primary-Source Research (Dossier A: Managed Agents + agent-org layer)

> **⚠ POST-RUN ANNOTATION (2026-06-10, v0.16.0):** this dispatch RAN and its dossier (`research/2026-06-10-managed-agents-primary-sources.md`) FALSIFIED or could not verify several context claims baked into the prompt body below — do not treat them as facts if re-running: "dynamic workflows default-ON for Enterprise since 2026-06-08" (RECONCILED by operator re-check 2026-06-10 — the claim was CORRECT: launch blog says Enterprise OFF *at launch* (May 28), but support article 13930452 states workflows "turn on for your whole organization by default on June 8, 2026"; Dossier B's "falsified" verdict read only the blog — a verification-of-the-verifier catch); "spill-to-file >100K outputs" as an MA primitive (NOT FOUND on any fetched page — Dossier A §A/§I.1); `claude agents --json` `waitingFor` (unverified — Dossier A §I.5); the "KIT-VIGILANCE anti-pattern #4" citation for beta discipline (mispointer — that file's #4 is watchlist pruning; Dossier A §I.8). Prompt body kept verbatim as provenance for the dossier.

> **Primary surface:** Cowork desktop, **fresh session** (full network egress + kit filesystem access — both required; Chat is disqualified because it cannot read the repo for the integration-mapping half).
> **Role:** research-extraction agent. You produce a **dossier**, not KB edits. Do NOT touch `knowledge-base/`, `templates/`, `workflows/` — the authoring step is a separate architect-prompt dispatch.
> **Output:** `research/YYYY-MM-DD-managed-agents-primary-sources.md` (date of run).
> **Companion:** Dossier B (`KB06_FIELD_EVIDENCE_RESEARCH.md`) runs in parallel on Chat + Research mode — field evidence is its job, not yours. You read ONLY first-party primary sources.
> **Consumer:** the KB-06 architect prompt (monthly integration 2026-07-01) reads both dossiers.

## Why this exists

KB-06 (`KB-06-MANAGED-AGENTS.md`) is the kit's reserved slot for the managed-agents / agent-organization layer. The vigilance loop confirmed 2-week cross-cutting dwell (weeklies 2026-22 + 2026-23 candidate #1) and the 2026-06-09 coordinated delivery (docs tree + SDK v0.108–0.109.1 + two cookbook examples) made the surface stable enough to author against. Per the depth-ladder feedback (the lab's depth-ladder methodology note (private)), authoring must rest on full primary-source reads, not digest summaries.

## Sources (fetch each; verify every date/claim on the fetched page, never from a search snippet)

**Cat 8 — docs (Tier-2 reality: direct scrape may return a JS shell; WebSearch returns real content; Chrome MCP `get_page_text` also works):**
1. `platform.claude.com/docs/en/managed-agents/overview` — then walk the whole tree: quickstart, agent setup, sessions, multi-agent sessions, deployments (scheduled), vaults/credentials, MCP connector/tunnels, skills, self-hosted sandboxes, migration. Record the **beta header** (`managed-agents-2026-04-01`) status per page.
2. `code.claude.com/docs/en/workflows` — dynamic workflows (default-ON for Enterprise since 2026-06-08; `disableWorkflows` managed setting).

**Cat 1 — engineering posts:**
3. `anthropic.com/engineering/managed-agents` — "Scaling Managed Agents: Decoupling the brain from the hands" (architecture framing).
4. `anthropic.com/engineering/how-we-contain-claude` (dated 2026-05-25) — containment doctrine: 3 isolation patterns × surfaces, allowlist-as-capability-grant, memory poisoning, multi-agent trust escalation. Note the open-sourced `github.com/anthropic-experimental/sandbox-runtime`.
5. `claude.com/code-with-claude/tokyo` — Tokyo restatement: customer-controlled sandboxes (Cloudflare / Daytona / Modal / Vercel / generic worker), private MCP tunnels, multiagent shared filesystem, Dreaming.

**Cat 6 — cookbook (fetch RAW via `raw.githubusercontent.com` to avoid HTML noise):**
6. Async multi-agent orchestration example (`anthropics/anthropic-cookbook` commit `e22e683`, PR #696) — extract BOTH patterns at code level: (a) fixed N-agent peer team with shared message hub; (b) lead agent that spawns / monitors / dismisses async subagents.
7. Sentry triage scheduled-agent example (commit `3dc70b5`, PR #698) — vault credentials (`sentry-cli`), deployments-API cron, `anthropic >= 0.109.0` requirement, report output path.

**Cat 2 — SDK release notes (GitHub release tags v0.107.0 → v0.109.1):**
8. v0.107.0 (Managed Agents types), v0.108.0 (server-side fallbacks + client middleware), v0.109.0 (deployments + env-var vault credentials), v0.109.1 (`frontier_llm` refusal category).

## Extraction targets (dossier sections — in this order)

A. **Primitive glossary with beta status** — agent, session, multi-agent session, deployment (scheduled), vault, Outcomes, Dreaming, MCP tunnel, self-hosted sandbox, spill-to-file (>100K outputs). One paragraph each; mark each: GA / beta-header / research-preview.
B. **Architecture** — brain/hands/session decoupling, mapped explicitly against the kit's Chat/Cowork/Code rubric (`CLAUDE-SURFACE-ROUTING.md`).
C. **Scheduled-deployment mechanics** + a comparison table: Managed Agents deployments vs Claude Code Routines vs Cowork scheduled tasks (capabilities, network egress, credentials, cost model, failure modes). This feeds a new SURFACE-ROUTING Q3 row.
D. **Multi-agent orchestration patterns** — peer-hub vs lead-spawn-monitor from the cookbook, plus how Claude Code `claude agents --json` `waitingFor` (v2.1.162) instruments the second pattern.
E. **Containment / threat-model-per-surface** — the 3 isolation patterns, incident postmortems, forward risks (memory poisoning of CLAUDE.md-class files, multi-agent trust escalation, agent identity).
F. **Sandbox provider matrix** — 4 named providers + generic worker; what the operator controls vs Anthropic controls.
G. **Beta boundary table** — stable vs `managed-agents-2026-04-01`-gated vs research-preview (MCP tunnels, Dreaming). The KB-06 author needs this to write beta-bounded claims (KIT-VIGILANCE anti-pattern #4).
H. **Kit integration map** — grep the kit first (`managed agent|dreaming|outcomes|multi-agent|orchestrat|fallback|sandbox|containment|threat`), then table: finding → kit file + section → action (new / extend / cross-ref). Include: KB-06 outline proposal, KB-04 async-orchestration subsection, SURFACE-ROUTING new row + §threat-model-per-surface, MCP-SERVER-REGISTRY cross-refs, KB-01 memory-hygiene note.
I. **Open questions** — anything unverifiable or contradictory across sources; do NOT resolve by guessing.

## Discipline

- **Verify-before-cite:** every GA/date/price claim from a fetched primary page. Log date-traps caught (search-prose dates that the page contradicts) — the 06-08 supplemental caught 3; the pattern is real.
- **Beta-bounded:** never describe a beta feature as shipped-stable. Quote the beta header where applicable.
- **Multidomain:** world-facts only; no project-specific tokens.
- **Budget:** summarize each source immediately after reading it; don't accumulate raw pages. Dossier cap ~500 lines.
- **Honesty:** unreachable source = say so + what Tier-2 fallback you used. "The docs do not state X" is a valid, valuable finding.
- **No commits:** write the dossier file, then notify the operator with a ≤10-line summary for review + `aikit-commit`.
