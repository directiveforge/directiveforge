# Seven under-documented gaps in AI-assisted development

**AI coding assistants like Cursor and Claude Code have well-documented basics, but practitioners consistently hit walls in seven specific areas: memory management, session handoff, configuration testing, MCP security, cost modeling, domain-specific rules, and quality measurement.** This supplement addresses each gap with production-ready algorithms, templates, and concrete data. Where evidence is strong, the report says so; where it's thin, confidence ratings are explicit. These gaps represent the frontier between "using AI tools" and "engineering reliable AI-augmented workflows."

---

## GAP 1: Memory scoring algorithms that actually exist in production

Current AI coding assistants — Cursor, Claude Code, Aider — use **no numerical memory scoring**. Claude Code relies on LLM judgment to decide what's worth saving to MEMORY.md. Cursor's community-built Memory Bank is pure documentation. Aider uses FIFO with threshold-based summarization. The algorithmic sophistication exists elsewhere, in agent frameworks and research systems, and can be adapted.

### The canonical scoring formula

The Stanford Generative Agents paper (Park et al., 2023) established the dominant approach. Every production variant derives from it:

```
retrieval_score = α * recency + β * importance + γ * relevance

where:
  recency    = 0.995 ^ hours_since_last_access    # exponential decay
  importance = LLM_score(memory) / 10              # normalized to [0,1]
  relevance  = cosine_similarity(query_emb, memory_emb)
  α = β = γ = 1.0                                  # equal weights (baseline)
```

The **decay constant of 0.995 per hour** means memories reach half-strength at ~138 hours (~5.75 days). This is the most widely replicated parameter in the literature. LangChain's `TimeWeightedVectorStoreRetriever` uses a slightly different formulation — `score = (1.0 - decayRate)^hoursPassed + vectorRelevance` — where `decayRate` is configurable and hours are measured from **last access**, not creation. This access-based timing is critical: frequently retrieved memories stay fresh.

### Production-grade unified scoring

The Mnemosyne framework (v2.2.0) provides the most complete production implementation with explicit constants:

```python
# Mnemosyne-style unified scoring (adapted for coding context)
def score_memory(memory, query, current_time):
    age_days = (current_time - memory.last_accessed).days

    # Exponential recency: τ=30 days half-life
    recency = math.exp(-age_days / 30)

    # Access frequency boost: +0.1 per retrieval, capped at +2.0
    access_boost = min(memory.access_count * 0.1, 2.0)

    # Graph proximity: +0.05 per connected memory
    graph_boost = len(memory.neighbors) * 0.05

    # Hybrid search: BM25 (keyword) + vector similarity
    keyword_score = bm25_score(query, memory.text)      # weight: 0.20
    vector_score = cosine_sim(query_emb, memory.emb)     # weight: 0.70
    graph_score = graph_expansion_score(query, memory)    # weight: 0.10

    search_score = (0.20 * keyword_score +
                    0.70 * vector_score +
                    0.10 * graph_score)

    return recency + access_boost + graph_boost + search_score
```

The **A-MAC framework** (2025) pushes further with five scoring dimensions — future utility, factual confidence, semantic novelty, temporal recency, and content type prior — achieving F1=0.583 on LoCoMo, beating all alternatives including MemGPT (0.324). Its key insight: novelty matters as much as relevance. Memories that merely confirm what's already known should score lower.

### Memory compaction for coding sessions

MemGPT/Letta established the three-tier hierarchy now considered standard: **core memory** (always in-context, like RAM), **recall memory** (searchable conversation history), and **archival memory** (long-term cold storage). Compaction triggers when token usage hits a threshold — Letta recommends evicting **70% of messages** while preserving 30% for continuity, generating a recursive summary from the evicted portion.

For coding-specific retention, these policies emerge from production systems:

| Tier              | Retention        | Trigger                                               | Format                |
| ----------------- | ---------------- | ----------------------------------------------------- | --------------------- |
| Session context   | Current session  | Auto-evict at 60% context capacity                    | Conversation turns    |
| Working memory    | 7-30 days active | Access frequency drops below threshold                | Structured summaries  |
| Project knowledge | 90+ days         | Importance < 2 AND no access in 90 days → soft-delete | CLAUDE.md / MEMORY.md |
| Archival          | Indefinite       | Superseded memories archived after 7 days             | Compressed embeddings |

### Cross-session knowledge graphs

Production implementations exist. **CodeGraphContext** (1.4k GitHub stars) supports 14 programming languages with multiple backends (KuzuDB for zero-config, FalkorDB, Neo4j), live file watching, and MCP integration. **CodeGraph Analyzer** does two-pass analysis: AST parsing followed by cross-file relationship resolution, extracting IMPORTS, EXPORTS, CALLS, EXTENDS, and IMPLEMENTS relationships into Neo4j. **Neo4j's own agent-memory library** combines short-term (conversation), long-term (entity knowledge graph using a Person-Organization-Location-Event-Object model), and reasoning memory (decision traces with provenance) in a single graph.

### How to measure if memory helps

**LongMemEval** (ICLR 2025) is the standard benchmark: 500 curated questions testing five abilities — information extraction, multi-session reasoning, knowledge updates, temporal reasoning, and abstention. Current results reveal a stark hierarchy: ensemble approaches hit ~99%, Letta's filesystem approach reaches 74%, Mem0's graph variant manages 68.5%, and naive RAG sits at 52%. The critical finding: **even with perfect recall, accurately reading retrieved memories is non-trivial** — round-level storage granularity outperforms session-level, and structured JSON format improves reading accuracy by up to 10 absolute points.

**Effectiveness: ★★★★☆** — Algorithms are well-documented in agent frameworks; the gap is that no AI coding tool implements them natively.  
**Confidence: ★★★★☆** — Formulas and constants from published papers and open-source code; coding-specific adaptation is inferred.

---

## GAP 2: Cross-session handoff without losing your mind

Session amnesia is the single most common complaint in AI-assisted development. Claude Code's `--continue` and `--resume` flags preserve raw conversation, but context quality degrades. The community has converged on a file-based handoff protocol that works across tools.

### The HANDOFF.md standard

Multiple independent implementations have converged on a near-identical template. The `willseltzer/claude-handoff` plugin (GitHub), `softaworks/agent-toolkit` (523 stars), and the `qdhenry/Claude-Command-Suite` all produce variants of this structure:

````markdown
# Handoff: [Task Title]

**Generated**: 2026-03-29 14:30 | **Branch**: feature/auth | **Status**: In Progress

## Goal

Single sentence stating what we're building and why.

## Completed

- [x] OAuth2 provider config (src/auth/config.ts)
- [x] Login endpoint returns valid tokens (POST /api/auth/login)

## Failed Approaches — DO NOT REPEAT

Tried passport.js — middleware ordering conflict with Express custom auth.
`req.user` was always undefined because passport's session middleware
ran after our auth check. Switched to oauth4webapi.

## Key Decisions

| Decision                         | Rationale                        | Revisit If              |
| -------------------------------- | -------------------------------- | ----------------------- |
| oauth4webapi over passport       | Lighter, no middleware conflicts | Need >3 OAuth providers |
| Refresh token in httpOnly cookie | More secure than localStorage    | Mobile app needs tokens |

## Current State

**Working**: Login flow returns valid access + refresh tokens
**Broken**: Refresh endpoint returns 500 — `TokenExpiredError` at refresh.ts:42
**Blocked**: Nothing

## Code Signatures (not just descriptions)

```typescript
// src/auth/refresh.ts:38-45 — THE BUG IS HERE
export async function refreshToken(req: Request): Promise<TokenPair> {
	const decoded = jwt.verify(token, process.env.JWT_SECRET); // Wrong secret!
	// Should use REFRESH_SECRET, not JWT_SECRET
}
```
````

## Resume Instructions

1. Fix refresh.ts:42 — use REFRESH_SECRET env var
2. Add logout: clear httpOnly cookie via POST /api/auth/logout
3. Run: `npm test -- --grep "auth"` — expect 12/14 passing (2 are the refresh tests)

## Environment

- `OAUTH_CLIENT_SECRET` must be set (see .env.example)
- OAuth sandbox resets daily at midnight UTC

```

The critical elements practitioners have identified: **failed approaches are mandatory** (saving hours of re-exploration), **code signatures beat descriptions** ("created a hook" is useless), and **test steps need expected outcomes** (not just "run tests").

### Cross-tool handoff: Cursor ↔ Claude Code

Both tools operate on the same filesystem, making git the universal handoff layer. The emerging workflow pattern uses each tool's strengths:

Claude Code excels at **parallel exploration** — spinning up subagents for multi-file autonomous changes, long-running debugging, and documentation generation. Cursor excels at **convergence** — inline autocomplete (Cmd+K), visual diff review, and tight feedback loops. The practical pattern is: plan and explore in Claude Code's terminal, implement and refine in Cursor's editor. HANDOFF.md and CLAUDE.md files serve as the cross-tool state layer since both tools read the same project files.

Git worktrees enable parallel agent execution — Cursor automatically creates and manages worktrees for background agents, and Claude Code's `--remote` flag creates independent cloud sessions. Addy Osmani's documented workflow: "Spin up a fresh git worktree per feature. Each chunk ends up as its own commit or PR."

### Contextual commits as institutional memory

The **Contextual Commits** open standard (`berserkdisruptors/contextual-commits`) encodes decisions directly in git history using five structured action types:

```

feat(auth): add OAuth2 login flow
intent(auth): enable third-party login without storing passwords
decision(auth): chose oauth4webapi over passport.js
rejected(auth): passport.js caused middleware conflicts with Express
constraint(auth): must support both Google and GitHub providers
learned(auth): refresh tokens must be httpOnly cookies, not localStorage

````

The `/recall` command queries git history for these action lines by scope, giving any new agent starting a fresh session access to every prior decision. The complementary **Lore Protocol** (arXiv 2603.15566) uses git trailers for structured metadata about rejected alternatives and constraints.

### Session Memory in Claude Code

Claude Code v2.0.64+ introduced automatic session memory (feature flag `tengu_session_memory`). It writes background summaries including session title, current status, key results, and a work log to `~/.claude/projects/<project-hash>/`. On session start, these summaries are automatically recalled. The `/remember` command promotes patterns from session memory to permanent CLAUDE.md entries. This is the most significant native cross-session feature in any coding assistant, though it's still rolling out gradually.

**Effectiveness: ★★★★☆** — HANDOFF.md protocol is battle-tested across multiple teams and tools.
**Confidence: ★★★★★** — Directly documented in open-source repos, official docs, and practitioner blogs.

---

## GAP 3: What 401 repositories reveal about cursor rules — and why nobody A/B tests them

The most important finding in this gap is a negative result: **no published study has directly A/B tested different .cursorrules configurations against each other.** Studies characterize what's in these files but don't measure which phrasings work better. This is the frontier.

### The MSR '26 study: "Beyond the Prompt"

Shaokang Jiang and Daye Nam analyzed **401 public GitHub repositories** containing `.mdc` cursor rule files (arXiv: 2512.18925, presented at MSR '26). After filtering 487 initial repos for quality, they performed qualitative inductive coding (~40 hours per researcher) and developed a five-category taxonomy: **Conventions, Guidelines, Project Information, LLM Directives, and Examples**. Average rule file length was **462.67 lines** (SD=1,197; max 11,076), with an average of **9.31 .mdc files per repo** and **16 days between commits** to rule directories. The study found developers are adapting traditional documentation norms — contribution guidelines, project overviews — to AI contexts, but noted that "excessive or unoptimized context can lead to more complex and less accurate responses, as well as higher costs and latency."

### The velocity-quality tradeoff study

A companion CMU paper (arXiv: 2511.04427) used a difference-in-differences design comparing **1,380 matched repositories** and found Cursor adoption produces a **statistically significant but transient velocity increase** — concentrated in the first one to two months before returning to baseline — alongside a **substantial and persistent increase in static analysis warnings and code complexity**. The velocity gain is fully cancelled by approximately **4.94x increase in warnings** or **3.28x increase in complexity**. Quality assurance was identified as the "major bottleneck" for early adopters.

### What you can measure today

The gap between existing benchmarks and what teams need is bridgeable with these metrics:

| Metric | How to Measure | Baseline (from literature) |
|--------|---------------|--------------------------|
| First-pass compile rate | CI compilation step on AI-generated code | ~95% Python, ~80% C++ |
| Test pass rate | pytest/JUnit on generated changes | Model-dependent; SWE-bench Verified top: 80.9% |
| Package hallucination rate | Check imports against registry | 19.7% average across 16 models; ~5% commercial |
| Static analysis warnings | SonarQube/ESLint delta post-generation | ~30% increase after Cursor adoption (CMU study) |
| AI modification rate | Lines changed by human / lines generated by AI | Target: <1.5x human baseline |
| Pattern conformance | Custom linter rules matching team conventions | Target: >80% |

### Prompt regression testing in CI

**Promptfoo** (now acquired by OpenAI) is the most mature tool: declarative YAML test suites, side-by-side comparison, assertion-based validation (deterministic + LLM-as-judge), and GitHub Actions integration that posts before/after comparisons on PRs. **Braintrust** adds environment-based deployment (dev → staging → production) with quality gates that block regressions. **Langfuse** provides open-source prompt version control with A/B testing via traffic-splitting labels.

The statistical methodology requires care: LLM outputs are high-variance, and **single-run tests can flip rankings versus multi-run evaluations in 83% of scenarios**. Start with 100-200 eval tasks for meaningful results. Always run an A/A test first to validate infrastructure. Don't stop tests early — the "peeking problem" produces false conclusions with LLMs just as with web A/B tests.

**Effectiveness: ★★★☆☆** — The study characterizes rules but doesn't tell you which ones work; tooling exists but nobody's published configuration-level comparisons.
**Confidence: ★★★★★** — The MSR '26 papers are peer-reviewed. The absence of A/B testing studies is itself a high-confidence finding.

---

## GAP 4: MCP security is worse than you think

The April 2025 security findings from Invariant Labs revealed that **individually safe MCP tools become dangerous in combination** — what Simon Willison coined the "Lethal Trifecta": an LLM with (1) privileged data access, (2) exposure to untrusted input, and (3) an external communication channel can exfiltrate entire databases via a single MCP interaction. This is not theoretical. In June 2025, researchers demonstrated that Cursor IDE plus Supabase MCP (running with privileged `service_role` access) could read support tickets containing embedded SQL injection commands and execute them, exposing API tokens publicly.

### Documented attack vectors

**Tool Poisoning** (Invariant Labs, April 2025): Malicious instructions hidden in MCP tool descriptions — visible to the LLM but invisible to users in standard UIs. A WhatsApp MCP exploit used a "Fact of the Day" server to exfiltrate entire chat histories. **Cross-Server Cascades**: AgentSeal found a **72.4% cascade rate** when multiple MCP servers are compromised. The MCP spec defines no isolation boundaries between servers — responses from Server A can influence invocations on Server B. **Rug Pulls**: Tools pass initial security review, then silently update with malicious code. Auto-update without version pinning enables persistent compromise.

The vulnerability surface is concrete: **CVE-2025-6514** (mcp-remote npm package, 437k+ downloads) enabled command injection affecting Cloudflare/HuggingFace/Auth0 users. **CVE-2025-68143/68144/68145** hit Anthropic's own mcp-server-git with unrestricted git_init (CVSS 8.8) and argument injection. AgentSeal scanned 1,808 MCP servers: **66% had security findings** totaling 8,282 tool-level issues. Equixly found **43% contained command injection flaws**.

### Docker-based sandboxing: production configs

Docker's official MCP Gateway provides the most mature sandboxing. Each MCP server runs in an isolated container with signed images and SBOMs:

```yaml
# docker-compose.yml — MCP Gateway with security hardening
services:
  mcp-gateway:
    image: docker/mcp-gateway
    command:
      - --transport=sse
      - --servers=github,filesystem,sequential-thinking
      - --memory=512Mb
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ~/.docker/mcp:/mcp
    ports:
      - "8811:8811"
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
          pids: 100
    networks:
      - mcp-isolated

  # High-isolation: Docker-in-Docker for untrusted servers
  mcp-gateway-untrusted:
    image: docker/mcp-gateway:dind
    privileged: true  # Required for DinD
    command:
      - --transport=sse
      - --servers=fetch
      - --memory=256Mb
    ports:
      - "8812:8080"
    networks:
      - mcp-untrusted  # Separate network, no egress

networks:
  mcp-isolated:
    driver: bridge
  mcp-untrusted:
    driver: bridge
    internal: true  # No external network access
````

For hardened deployments, add: read-only root filesystem with targeted bind mounts, `--cap-drop ALL` to remove kernel capabilities, seccomp/AppArmor profiles, and per-service resource budgets.

### Security audit checklist

The **OWASP GenAI Security Project** published a "MCP Security Minimum Bar" with five categories. Any FAIL in categories 1 or 2 blocks deployment:

- **Strong Identity/Auth/Policy Enforcement**: OAuth 2.1 with mandatory PKCE, resource indicators (RFC 8707), progressive scope elevation
- **Strict Isolation and Lifecycle Control**: Per-server containerization, no cross-server trust propagation
- **Trusted and Controlled Tooling**: Pin exact versions, verify checksums, scan with mcp-scan (`uvx mcp-scan@latest`)
- **Schema-Driven Validation**: Input/output sanitization on all tool calls
- **Hardened Deployment**: Network isolation, egress controls, audit logging

### Supply chain threat: confirmed attacks

The **SANDWORM_MODE campaign** (February 2026) deployed 19 typosquatting npm packages that injected rogue MCP server configurations into Claude Code, Cursor, VS Code Continue, and Windsurf. The malware harvested LLM API keys and SSH keys, remained dormant for 48-96 hours to avoid detection, and self-propagated through modified Git hooks.

**Effectiveness: ★★★★★** — Attack vectors are proven with CVEs; Docker Gateway is production-ready.  
**Confidence: ★★★★★** — CVEs, security firm research, and confirmed incidents from official sources.

---

## GAP 5: What AI-assisted development actually costs per task

Claude Code's official measurement across its user base shows an average of **$6 per developer per day**, with the 90th percentile under $12. But this headline number obscures enormous variance driven by model choice and agentic usage patterns.

### Token consumption patterns

A detailed case study from developer Kyle Redelinghuys tracked 10 months of Claude Code usage. In July 2025 alone, he consumed **2.4 billion tokens** — which at raw API rates would have cost $5,623, but on the Max plan cost ~$100. The critical insight: **over 90% of tokens are cache reads**. Input/output tokens represent under 1% combined, with cache writes at ~6%. This means prompt caching is the single largest cost lever.

Agentic usage consumes **5x to 20x more tokens** than standard completions — this is the primary cost variable. Agent teams using teammates in plan mode consume approximately **7x more tokens** than standard sessions. One developer documented an agent spending **47 iterations** on a single ALTER TABLE command: "a $30 learning experience about a $0.50 problem."

### Model routing: the 40-60% savings

The dominant heuristic routes by task complexity:

```python
# Production model routing heuristic
def select_model(task):
    if task.type in ['classify', 'extract', 'validate', 'format']:
        return 'haiku'       # $1/$5 per MTok
    elif task.type in ['generate', 'analyze', 'debug', 'test']:
        return 'sonnet'      # $3/$15 per MTok
    elif task.type in ['architecture', 'security_review', 'complex_debug']:
        return 'opus'        # $5/$25 per MTok
    elif task.input_tokens > 50_000:
        return 'sonnet'      # Long context = moderate model
    else:
        return 'sonnet'      # Default to middle tier
```

Organizations using model routers report **30-70% cost reductions**. Claude Code's `opusplan` alias automates the most effective variant: Opus during planning for complex reasoning, Sonnet during implementation for code generation. Augment Code reports that "Claude Haiku 4.5 achieves 90% of Sonnet 4.5's performance" in agentic coding evaluation, making it the clear default for routine tasks.

### TCO comparison across team sizes

| Profile              | Tool Stack                     | Monthly Cost | Annual Cost    | Notes                              |
| -------------------- | ------------------------------ | ------------ | -------------- | ---------------------------------- |
| **Solo dev (light)** | Copilot Pro                    | $10          | $120           | Most predictable                   |
| **Solo dev (light)** | Cursor Pro                     | $20          | $240           | Includes $20 API credits           |
| **Solo dev (power)** | Cursor Ultra + Claude Max 20x  | $400         | $4,800         | Heavy agentic usage                |
| **Solo dev (power)** | Claude API direct              | $200-500     | $2,400-6,000   | Highly variable                    |
| **5-person team**    | Copilot Business               | $95          | $1,140         | $19/user/mo                        |
| **5-person team**    | Cursor Teams + Claude API      | $600-1,200   | $7,200-14,400  | $40/user + API variable            |
| **20-person team**   | Copilot Enterprise             | $1,200       | $14,400        | $60/user (includes GH Enterprise)  |
| **20-person team**   | Cursor Enterprise + monitoring | $2,000-5,000 | $24,000-60,000 | Agentic multiplier drives variance |

The **sticker price understates real costs by 2-5x** for power users. Tab completions cost ~$0.50-1.00/day; agent sessions cost $2-5+ each. The invisible "usage wall" where flat-rate becomes metered defines real value.

### Cost monitoring stack

For Claude Code: **ccusage** (npx zero-install) provides daily/monthly/session reports from local JSONL logs. For team-scale: **Helicone** (open-source proxy, 2B+ interactions processed) adds caching that reduces costs 20-30%, with Slack/email alerts. **LiteLLM** provides a unified gateway across 100+ providers with per-team budget limits. **Faros AI** connects Claude Code usage to DORA metrics for engineering leadership visibility.

**Effectiveness: ★★★★☆** — Pricing data is current; task-level token measurements remain a gap (only session/daily aggregates exist).  
**Confidence: ★★★★☆** — Pricing from official sources; usage patterns from developer reports and one detailed case study.

---

## GAP 6: Domain-specific rules that survive contact with reality

Coverage across domains is starkly uneven. Frontend (Next.js/React) has **excellent** community documentation with battle-tested rules. Data/ML has **sparse** coverage, relying mostly on workarounds. The key insight from practitioners: **specific beats general**. "Use React best practices" produces nothing useful; "Always create error.tsx alongside every page.tsx as a client component receiving error and reset props" produces correct code consistently.

### Frontend: the gold standard

```markdown
# .cursor/rules/nextjs-patterns.mdc

---

description: Next.js App Router conventions
globs: **/\*.tsx,**/\*.ts
alwaysApply: false

---

- Use App Router with `page.tsx` files in route directories
- Client components MUST be marked with `'use client'` — justify every usage
- Keep most components as React Server Components (RSC)
- Create small client component wrappers around interactive elements
- Use kebab-case for directories, PascalCase for components
- Named exports only — no default exports
- Use Server Actions for form handling, not client-side fetch
- Always create error.tsx alongside every page.tsx
- error.tsx must be a client component receiving {error, reset} props
```

The word "alongside" in the error boundary rule was specifically tested — "use error boundaries" alone produced nothing, while the precise instruction generated correct error handling every time.

### Backend API: contract enforcement

```markdown
# .cursor/rules/api-patterns.mdc

---

description: FastAPI conventions and safety rules
globs: \*_/_.py

---

- Use Pydantic v2 models for ALL request/response validation
- Receive an Object, Return an Object (RORO pattern)
- Error handling at function start with early returns; happy path last
- Use FastAPI dependency injection for database connections and auth
- NEVER log sensitive data (passwords, tokens, card numbers)
- Use parameterized queries exclusively — no string interpolation in SQL
- Async by default; sync only when calling blocking I/O libraries
- All routes under app/api/{resource}/route.py
- Validate with Zod/Pydantic at function boundaries, not inline
```

### Full-stack monorepo: the import boundary pattern

The critical rule for monorepos isn't about style — it's about preventing cross-package contamination:

```markdown
# Root .cursorrules — workspace-wide only

## Import Boundaries (ENFORCED)

- apps/ can import from packages/ but NEVER from other apps/
- packages/ui can import from packages/config only
- packages/db must not import from any app or other package
- Use workspace imports: @myapp/ui — never relative cross-package paths
- When generating code in apps/web, NEVER import from apps/api
- When generating code in packages/db, NEVER import React
```

Cursor walks up from the current file and applies the innermost `.cursorrules` plus root. Claude Code merges sub-directory CLAUDE.md files. GitHub Copilot, Windsurf, Cline, and OpenAI Codex support **root-level rules only** — no nesting.

### Infrastructure: blast radius awareness

```markdown
# .cursor/rules/terraform-safety.mdc

---

description: IaC safety rules for Terraform
globs: **/\*.tf,**/\*.tfvars

---

- Always use modules from registry.terraform.io
- Never hardcode credentials — use provider configuration or Vault
- Tag EVERY resource with 'owner', 'env', and 'managed_by=terraform'
- Use least-privilege IAM — no wildcard (\*) actions in policies
- Remote backend (S3/GCS) with state locking and encryption
- ALWAYS run `terraform plan` before ANY apply
- Lock provider versions: required_providers block is mandatory
- For destructive changes: add lifecycle { prevent_destroy = true } first
- K8s: prefer Deployments + Services, avoid naked Pods
- Never modify .tfstate files directly
```

### Legacy codebases: constraint-first rules

```markdown
# CLAUDE.md for legacy modernization

## CONSTRAINTS — READ FIRST

- Tech stack: Python 3.9, Django 3.2, PostgreSQL 13 — Do NOT suggest upgrades
- Do NOT refactor callback patterns to async/await unless explicitly asked
- Do NOT suggest Python 3.12+ syntax (match statements, etc.)
- NEVER modify database migration files directly
- Before changing ANY function, check usages in /src/api/ first

## Business Logic

- The "Wraps" module generates annual video summaries — do not rename
- Tax calculations in /src/billing/tax.py use region-specific rules;
  assume US unless told otherwise
- The `process_order` function MUST remain synchronous —
  downstream webhook handlers depend on blocking execution
```

### Data/ML: the underdeveloped frontier

This domain has the worst rule coverage. Cursor struggles with `.ipynb` files natively. The workaround is `.py` files with `# %%` cell markers for Jupyter-style workflows. A `cursor-notebook-mcp` server exists for cell manipulation, and Cursor 1.0 improved notebook editing (Claude Sonnet models only). No dedicated experiment tracking, MLOps pipeline, or model versioning rules were found in any community repository. This represents a genuine opportunity.

**Effectiveness: ★★★★☆** — Frontend/backend rules are production-proven; Data/ML and Infrastructure are early-stage.  
**Confidence: ★★★★★** — Rules sourced from awesome-cursorrules (37.9k stars), cursor.directory, and practitioner testing.

---

## GAP 7: The uncomfortable truth about measuring AI coding tool effectiveness

The most important metrics finding is a tension: **developers consistently believe AI makes them faster, while controlled experiments show mixed-to-negative results for experienced practitioners.** Understanding this gap is essential for any evaluation framework.

### The foundational studies disagree

The **METR randomized controlled trial** (July 2025, arXiv: 2507.09089) studied 16 experienced open-source developers across 246 tasks using Cursor Pro with Claude 3.5/3.7 Sonnet. Result: AI usage **increased completion time by 19%** (95% CI: [-40%, -2%]). Before the study, developers predicted a 24% speedup. After the study — having been objectively slower — they still believed they were 20% faster. The perception gap exceeded **40 percentage points**.

Conversely, the **MIT/Harvard/Microsoft field experiments** across 4,867 developers at three companies found a **26.08% increase in completed tasks**. Short-tenure developers saw 27-39% gains; junior developers 21-40%. Senior developers saw modest 7-16% gains. The GitHub Copilot trial with 95 Upwork professionals showed **55.8% faster** task completion.

These aren't contradictory — they measure different things. METR tested experienced developers on **their own mature codebases** (average 22k+ stars, 1M+ lines). The productivity studies tested developers on **newer or less familiar** codebases. The CMU longitudinal study resolves the timeline: Cursor adoption produces **3-5x velocity spikes in month one**, then gains dissipate while **static analysis warnings increase 30%** and **code complexity rises 41%** permanently.

### A practical quality dashboard

Drawing from Anthropic's evaluation framework (January 2026) and practitioner literature, a project-specific eval suite should track:

```python
# Canary task regression detection
class CanaryTaskSuite:
    """
    Tasks that graduated from capability evals to regression suite.
    Should maintain ~100% pass rate. Any decline signals breakage.
    """
    def __init__(self, project_root):
        self.tasks = self.load_tasks(f"{project_root}/.evals/canary/")
        self.history = []  # Track scores over time

    def run_eval(self, agent_config):
        results = {
            'compile_rate': 0,        # % generated code that compiles
            'test_pass_rate': 0,      # % unit tests passing
            'lint_clean_rate': 0,     # % files with zero lint violations
            'pattern_conformance': 0, # % matching team conventions
            'hallucination_rate': 0,  # % fabricated imports/APIs
        }

        for task in self.tasks:
            output = agent_config.generate(task.prompt)
            results['compile_rate'] += self.check_compiles(output)
            results['test_pass_rate'] += self.run_tests(output, task.tests)
            results['lint_clean_rate'] += self.run_linter(output)
            results['pattern_conformance'] += self.check_patterns(output)
            results['hallucination_rate'] += self.check_imports(output)

        # Normalize and compare to baseline
        normalized = {k: v / len(self.tasks) for k, v in results.items()}
        regression = self.detect_regression(normalized)
        return normalized, regression

    def detect_regression(self, current):
        """Flag if any metric drops >5% from rolling 7-day average."""
        if not self.history:
            return []
        baseline = self.rolling_average(window=7)
        return [
            metric for metric, value in current.items()
            if value < baseline[metric] * 0.95  # 5% threshold
        ]
```

Anthropic's key pattern: **capability evals with high pass rates "graduate" to become regression suites** run continuously. Tasks that once measured "can we do this at all?" become monitors for "can we still do this reliably?"

### Developer satisfaction: what to actually survey

The **SPACE framework** (Forsgren et al., 2021, ACM Queue) is the gold standard, now adapted for AI tools. BNY Mellon's peer-reviewed study (arXiv: 2602.03593, 2,989 respondents) found that while **satisfaction with AI coding tools is high, reported time savings are modest**. Stack Overflow's 2025 survey of developers revealed a paradox: 80% adoption, but trust in AI accuracy **fell from 40% to 29%**, and 66% spend more time fixing "almost-right" AI code. DX Research across **121,000 developers** found AI-authored code now represents 26.9% of production code, yet measured productivity gains haven't moved past ~10%. The bright spot: onboarding time (measured by "time to 10th PR") was **cut in half**.

### The cost-quality Pareto frontier

The practical framing: **cost per completed task**, not cost per token. DataRobot's **syftr** framework (open-source multi-objective Bayesian optimization) found that non-agentic workflows frequently dominate the Pareto frontier — they're faster and cheaper. The workflow at the "knee point" of the frontier loses just a few percentage points in accuracy while being **10x cheaper**. GPT-4o-mini appears disproportionately in Pareto-optimal configurations for balanced quality and cost.

On the Aider polyglot benchmark, the spread is dramatic: GPT-5 achieves 88.0% at $29.08 per eval run; o3-pro reaches 84.9% at **$146.32** per run — 5x the cost for 3.1 fewer percentage points. This kind of data enables rational model selection rather than defaulting to the most expensive option.

**Effectiveness: ★★★★☆** — Evaluation frameworks are mature; the challenge is organizational adoption.  
**Confidence: ★★★★★** — Built on peer-reviewed RCTs, ICLR papers, and large-scale surveys.

---

## What these gaps reveal about the state of AI-assisted development

Three cross-cutting themes emerge from investigating these seven gaps. First, **the tooling is ahead of the methodology**. Docker MCP Gateway, Promptfoo, and ccusage exist and work, but few teams have integrated them into systematic workflows. Second, **perception consistently outpaces measurement**. Developers believe they're faster (by 20-39%) while controlled studies show mixed results, and the one longitudinal study found velocity gains that evaporate within two months while technical debt accumulates permanently. Third, **the community is solving problems that vendors haven't addressed**. HANDOFF.md, Memory Bank, contextual commits, and domain-specific rule files all emerged from practitioners, not from Anthropic or Cursor.

The most actionable finding across all seven gaps: **invest in evaluation infrastructure before expanding AI usage**. Teams that track first-pass compile rates, maintain canary task suites, and monitor cost-per-completed-task will extract compounding value. Teams that adopt aggressively without measurement will hit the pattern the CMU study documented — a transient velocity spike followed by persistent quality degradation that nobody notices because everyone _feels_ more productive.
