# AI Workflow Engineering: Definitive Knowledge Base (March 2026)

> **Purpose**: Complete reference for AI-assisted development techniques, patterns, tools, and protocols. Use this document to understand HOW to work with AI effectively — the science behind context, memory, prompts, retrieval, grounding, cost management, and tooling.
>
> **Audience**: AI agents building context architectures, senior developers optimizing AI workflows, and teams evaluating AI development infrastructure.
>
> **Sources**: Synthesized from 4 independent research documents totaling ~4,200 lines — Claude Opus 4.6 domain research, GPT Deep Research analysis, and gap-filling deep dive (March 2026).

---

## Table of Contents

1. [The Paradigm Shift: Context Engineering](#1-the-paradigm-shift)
2. [Context Engineering](#2-context-engineering)
3. [Memory Engineering](#3-memory-engineering)
4. [RAG Pipelines & Retrieval](#4-rag-pipelines--retrieval)
5. [Prompt Engineering (2026 State of the Art)](#5-prompt-engineering)
6. [Hallucination Reduction & Grounding](#6-hallucination-reduction--grounding)
7. [MCP Ecosystem](#7-mcp-ecosystem)
8. [AI IDE & Tooling Landscape](#8-ai-ide--tooling-landscape)
9. [Cost Engineering](#9-cost-engineering)
10. [AI Observability & Monitoring](#10-ai-observability--monitoring)
11. [Development Workflow Optimization](#11-development-workflow-optimization)
12. [Myths Debunked](#12-myths-debunked)
13. [Cross-Domain Patterns](#13-cross-domain-patterns)
14. [Tools & Resources Directory](#14-tools--resources-directory)

---

## 1. The Paradigm Shift

### From Prompt Engineering to Context Engineering

In 2024, the question was "how do I write a better prompt?" In 2026, the question is "what information ecosystem do I build around my model?"

Andrej Karpathy's framing captured it: **the LLM is the CPU, the context window is RAM, and your job is to be the operating system**. The teams delivering production value are not prompt craftspeople — they are information architects managing context pipelines that include system prompts, retrieved documents, conversation history, tool definitions, and memory systems.

### The 10 Highest-Impact Findings

| # | Finding | Impact | Confidence |
|---|---------|--------|------------|
| 1 | **Context engineering replaces prompt engineering as core discipline** — tiered context architectures (always-on → on-demand → deep reference) consistently outperform prompt-only optimization | Transformative | High |
| 2 | **Agent scaffolding matters more than model selection** — SWE-bench shows 22+ point swing between scaffolds with same model vs only 1.3% between frontier models | Transformative | High |
| 3 | **MCP is de facto infrastructure** — 97M+ monthly SDK downloads, 1,200+ servers, adopted by all major AI providers, governed by Linux Foundation | Transformative | High |
| 4 | **Hybrid search + reranking is highest-ROI RAG upgrade** — BM25 + vector + cross-encoder reranking improves retrieval 15-30% over vector-only | Transformative | High |
| 5 | **Model routing cuts costs 40-80%** — cheap models for triage, expensive for reasoning. Plan-and-Execute pattern reduces costs up to 90% | Transformative | High |
| 6 | **Prompt caching delivers 80-90% cost reduction** on repeated context across Anthropic, OpenAI, and Google | Transformative | High |
| 7 | **Structured AI development produces 1.7x fewer defects** than ad-hoc prompting (CodeRabbit analysis of 470 PRs) | Transformative | High |
| 8 | **CLAUDE.md under 300 lines reduces manual corrections by ~40%** — aggressive curation outperforms exhaustive documentation | Transformative | High |
| 9 | **"Search before implementing" is the single highest-ROI rule** — prevents the #1 failure: duplicating existing functionality | Transformative | High |
| 10 | **Multi-agent systems are over-applied** — only 2% of orgs have deployed at full scale; 40%+ projected canceled by 2027 | Useful (caution) | High |

### Three Things Most Teams Do Wrong

1. **Stuffing context instead of curating it.** More context ≠ better output. Performance degrades at ~3,000-token prompts and drops significantly after 32K. Best teams use minimum high-signal tokens.
2. **Defaulting to multi-agent when single-agent suffices.** Each sub-agent burns ~3x tokens, adds latency, and creates failure modes. Start with a well-tooled single agent.
3. **Obsessing over model selection instead of harness quality.** The 22+ point swing between scaffolds using the same model dwarfs the 1.3% spread between frontier models.

---

## 2. Context Engineering

### 2.1 The Three-Tier Model

**Tier 1 — Always-On Context** (loaded every call):
- System prompt, core behavioral instructions, safety constraints, output format specs, tool definitions
- Keep lean: total prompt effectiveness degrades around 3,000 tokens
- Target 150-300 words for core instruction set, ~500-1,500 tokens total

**Tier 2 — On-Demand Context** (loaded per task):
- Retrieved documents (RAG), relevant code files, compressed conversation history, user metadata
- Retrieved via tools, MCP servers, or RAG pipelines
- Key discipline: retrieve only what's relevant to current query (~2,000-5,000 tokens)

**Tier 3 — Deep Reference** (available but not loaded):
- Full documentation, entire codebases, historical data, knowledge bases
- Accessible via search tools, MCP servers, or dedicated retrieval
- Model requests when needed; never occupies context space unnecessarily

**Measured impact**: Teams going from "dump everything" to curated tiered loading report 60-80% token cost reduction while improving output relevance.

### 2.2 The "Lost in the Middle" Problem

Stanford/UC Berkeley research confirms: LLM performance degrades for information placed in the middle of long contexts, even with 1M+ token windows. Models focus on beginning and end.

**Key data**: Model correctness starts dropping around 32K tokens in practice, regardless of advertised window sizes. Cost and latency scale linearly.

**Proven mitigations**:
- Place most critical information at beginning and end of prompt
- Use shorter, focused contexts rather than dumping everything
- Implement retrieval with reranking so most relevant information appears first
- Use structured formatting (XML tags, headers) to create navigable landmarks

### 2.3 Token Budget Optimization

**Practical decision framework — what to load when**:

| Priority | Content | Token Budget | When |
|----------|---------|--------------|------|
| Always | Core system instructions, tool definitions, output format | 500-1,500 | Every call |
| First turn | Project rules, user preferences | 500-1,000 | Session start |
| Per query | RAG results (top 5-10), relevant code files, conversation summary | 2,000-5,000 | Each query |
| On demand | Full file contents, documentation sections, historical data | Variable | Only when explicitly needed |

**Claude Code specifics**: 200K token context window fills quickly once you factor in ~50 internal system instructions from the harness, CLAUDE.md content, file contents, tool outputs, and conversation history.

**Context editing** (Claude Code 2026): Automatically clears stale tool call outputs while preserving conversation flow — cut token consumption by 84% for 100-turn workflows.

**Operator-level numeric levers** (env vars verified 2026-07-02; see WORKFLOW-CLAUDE-CODE §11.3 for the settings table): cap extended thinking for routine work (`MAX_THINKING_TOKENS`); lower the autocompact trigger for long sessions (`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`); route mechanical subagents to the cheapest model class (`CLAUDE_CODE_SUBAGENT_MODEL`); keep the MCP surface under ~10 servers / ~80 active tools — tool descriptions bill against every call and can shrink a 200K window toward ~70K usable. Compact at logical breakpoints (post-research, post-milestone, post-abandoned-approach), never mid-implementation.

### 2.4 Context File Formats

| Tool | File | Hierarchy | Notes |
|------|------|-----------|-------|
| Claude Code | `CLAUDE.md` | `~/.claude/` → `./` → subdirectories | Wrapped in `<system-reminder>` that tells model to ignore irrelevant content |
| Cursor | `.cursor/rules/*.mdc` | `alwaysApply` → glob-scoped → description-matched | YAML frontmatter controls activation |
| Cross-IDE | `AGENTS.md` | Nearest to file takes precedence | Supported by Claude Code, Cursor, Copilot, Gemini CLI, Windsurf, Aider, Zed, Warp |
| GitHub Copilot | `.github/copilot-instructions.md` | Workspace-level | Custom agents via extensions |
| Windsurf | Rules files | Similar to Cursor | Cascade system for persistent context |

**AGENTS.md** is the interop layer — if you use multiple tools, maintain this as the single source of cross-tool conventions.

### 2.5 Prompt Caching

**Anthropic**: Cache static portions (system instructions, few-shot examples, retrieved docs). Cached content costs up to 90% less. 5-minute TTL extended with each use. Structure: static prefix first, dynamic content last.

**OpenAI**: Automatic caching for identical prompt prefixes. 50% discount on cached tokens. No explicit API needed.

**Google Gemini**: Explicit cache creation API for large contexts. Particularly useful with 2M token window — cache a document once, query multiple times.

**Implementation**: Identify stable portions (system instructions, tool definitions, few-shot examples). Place first. Place dynamic portions (user query, conversation history, fresh RAG results) last. Teams report 60-90% input token cost reduction.

---

## 3. Memory Engineering

### 3.1 Persistent Memory Architectures

**Scratchpad Memory**: Simplest pattern. Agents write notes to persistent store during execution. Anthropic's multi-agent researcher uses this — LeadResearcher saves plans to memory that sub-agents access.

**Sliding Window + Summarization**: Keep last N turns verbatim. Summarize earlier turns into rolling context summary. Prevents conversation history from dominating context window.

**Hierarchical Memory** (episodic/semantic/procedural):
- Episodic: specific past interactions
- Semantic: extracted facts and knowledge
- Procedural: learned patterns and preferences
- Claude Code's memory system and ChatGPT's dual-mode memory implement simplified versions

**Cross-Session Persistence**: Explicit save/load of key facts, preferences, project state works. Persisting entire conversations fails (too expensive, too noisy).

### 3.2 Memory Scoring Algorithms

No AI coding tool implements sophisticated memory scoring natively. The algorithms exist in agent frameworks and research systems.

**The canonical scoring formula** (Stanford Generative Agents, Park et al. 2023):

```
retrieval_score = α * recency + β * importance + γ * relevance

where:
  recency    = 0.995 ^ hours_since_last_access    # exponential decay
  importance = LLM_score(memory) / 10              # normalized [0,1]
  relevance  = cosine_similarity(query_emb, memory_emb)
  α = β = γ = 1.0                                  # equal weights baseline
```

The **decay constant of 0.995/hour** means memories reach half-strength at ~138 hours (~5.75 days). Most widely replicated parameter in literature.

**Production-grade unified scoring** (Mnemosyne framework v2.2.0):

```python
def score_memory(memory, query, current_time):
    age_days = (current_time - memory.last_accessed).days
    recency = math.exp(-age_days / 30)                    # τ=30 days half-life
    access_boost = min(memory.access_count * 0.1, 2.0)    # +0.1 per retrieval, capped
    graph_boost = len(memory.neighbors) * 0.05             # +0.05 per connection
    search_score = (0.20 * bm25_score(query, memory.text) +
                    0.70 * cosine_sim(query_emb, memory.emb) +
                    0.10 * graph_expansion_score(query, memory))
    return recency + access_boost + graph_boost + search_score
```

**A-MAC framework** (2025): Five scoring dimensions — future utility, factual confidence, semantic novelty, temporal recency, content type prior. Achieves F1=0.583 on LoCoMo, beating MemGPT (0.324). Key insight: novelty matters as much as relevance.

### 3.3 Memory Compaction

MemGPT/Letta standard three-tier hierarchy:
- **Core memory**: Always in-context (like RAM)
- **Recall memory**: Searchable conversation history
- **Archival memory**: Long-term cold storage

Compaction triggers at threshold — Letta recommends evicting 70% of messages while preserving 30% for continuity, generating recursive summary from evicted portion.

**Coding-specific retention policies**:

| Tier | Retention | Trigger | Format |
|------|-----------|---------|--------|
| Session context | Current session | Auto-evict at 60% capacity | Conversation turns |
| Working memory | 7-30 days active | Access frequency drops below threshold | Structured summaries |
| Project knowledge | 90+ days | Importance < 2 AND no access in 90 days | CLAUDE.md / MEMORY.md |
| Archival | Indefinite | Superseded after 7 days | Compressed embeddings |

### 3.4 Cross-Session Knowledge Graphs

Production implementations:
- **CodeGraphContext** (1.4K stars): 14 languages, multiple backends (KuzuDB, FalkorDB, Neo4j), live file watching, MCP integration
- **CodeGraph Analyzer**: Two-pass analysis — AST parsing then cross-file relationship resolution (IMPORTS, EXPORTS, CALLS, EXTENDS, IMPLEMENTS)
- **Neo4j agent-memory library**: Combines short-term (conversation), long-term (entity knowledge graph), and reasoning memory (decision traces with provenance)

### 3.5 Memory Benchmarks

**LongMemEval** (ICLR 2025): 500 curated questions, five abilities. Results hierarchy:
- Ensemble approaches: ~99%
- Letta filesystem: 74%
- Mem0 graph: 68.5%
- Naive RAG: 52%

Critical finding: round-level storage granularity outperforms session-level; structured JSON format improves reading accuracy by up to 10 absolute points.

### 3.6 Cross-Session Handoff

**The HANDOFF.md protocol** (converged across multiple independent implementations):

```markdown
# Handoff: [Task Title]
**Generated**: [timestamp] | **Branch**: [branch] | **Status**: In Progress

## Goal
Single sentence: what we're building and why.

## Completed
- [x] Task 1 (file path)

## Failed Approaches — DO NOT REPEAT
[What was tried and why it failed — saves hours]

## Key Decisions
| Decision | Rationale | Revisit If |
|----------|-----------|------------|

## Current State
**Working**: [what functions]
**Broken**: [specific error at specific line]
**Blocked**: [dependencies]

## Code Signatures (not descriptions)
[Actual code snippets with file:line references]

## Resume Instructions
[Numbered steps with expected outcomes]
```

Critical elements: **failed approaches are mandatory**, **code signatures beat descriptions**, **test steps need expected outcomes**.

**Contextual Commits** standard (`berserkdisruptors/contextual-commits`):

```
feat(auth): add OAuth2 login flow
intent(auth): enable third-party login without storing passwords
decision(auth): chose oauth4webapi over passport.js
rejected(auth): passport.js caused middleware conflicts
constraint(auth): must support Google and GitHub providers
learned(auth): refresh tokens must be httpOnly cookies
```

The `/recall` command queries git history for these action lines by scope.

**Claude Code Session Memory** (v2.0.64+): Automatic background summaries including session title, status, key results, and work log to `~/.claude/projects/<project-hash>/`. On session start, automatically recalled. `/remember` promotes patterns to permanent CLAUDE.md.

---

## 4. RAG Pipelines & Retrieval

### 4.1 The Production-Proven 3-Stage Pipeline

**Stage 1 — Hybrid Search**: BM25 (keyword) + dense vector search, fused via Reciprocal Rank Fusion (RRF)
- BM25 catches exact terms (IDs, codes, proper nouns) that vector search misses
- Vector search catches semantic matches that keyword search misses
- RRF combines rankings without needing score normalization

**Stage 2 — Reranking**: Cross-encoder (MS MARCO MiniLM or ColBERT) reranks fused candidates
- Retrieve top-100 via hybrid search, rerank to select final 5-10
- Reranking alone is "one of the highest ROI upgrades in RAG"
- 15-30% precision improvement over vector-only

**Stage 3 — Contextual Compression**: Extract or summarize only parts relevant to query
- Reduces token consumption for the LLM call
- Removes noise from retrieved chunks

### 4.2 Advanced Retrieval Patterns

**Contextual Retrieval** (Anthropic): Prepend each chunk with AI-generated summary of its context within the full document before embedding. Chunks often lose critical context ("this section refers to the authentication module").

**HyDE** (Hypothetical Document Embeddings): Generate a hypothetical answer, embed it, search for similar real documents. Effective when user queries are very different from document language.

**Multi-Query Generation**: Generate 3-5 query variations to broaden retrieval coverage. Catches different phrasings of the same concept.

**ColBERT/ColPali**: Late-interaction models encoding query and document separately for efficient token-level similarity. Good balance of accuracy and speed.

**Parent-Child Indexing**: Embed small child chunks but return the larger parent span for context. When multiple children from the same section appear, the parent provides coherent context.

### 4.3 Chunking Strategy

**Semantic chunking over fixed-size**. Split on headings, paragraphs, logical boundaries.

| Document Type | Recommended Chunk Size | Strategy |
|---------------|----------------------|----------|
| Dense technical docs | 256-512 tokens | Section boundaries |
| Narrative text | 512-1024 tokens | Paragraph boundaries |
| Code files | Function/class boundaries | AST-aware splitting |
| FAQ/definitions | Natural entry boundaries | One entry per chunk |

### 4.4 Embedding Models (March 2026)

| Model | Dimensions | Best For | Cost |
|-------|-----------|----------|------|
| OpenAI text-embedding-3-large | 3072 | English, general purpose | Moderate |
| OpenAI text-embedding-3-small | 1536 | High-volume, cost-sensitive | Low |
| Cohere embed-v4 | — | Multilingual | Moderate |
| BGE-M3 (open-source) | — | Self-hosted, multilingual | Free |
| Sentence Transformers | Various | Privacy-sensitive, self-hosted | Free |

**Critical insight**: The embedding model determines the ceiling of retrieval quality. The best vector database cannot compensate for poor embeddings.

### 4.5 Anti-Patterns

- Pure BM25 misses semantic matches
- Pure vector search misses exact terms
- No reranking means noisy results
- No evaluation framework means undetected regressions (70% of RAG systems lack this)
- Fixed-size chunks splitting mid-concept

---

## 5. Prompt Engineering

### 5.1 Chain-of-Thought and Reasoning

**Standard CoT**: ~19-point boost on MMLU-Pro for non-reasoning models. Most reliable technique for mathematical, commonsense, and multi-step reasoning.

**Adaptive Thinking** (Claude 4.6): Model dynamically decides when and how deeply to reason. Reliably outperforms manual extended thinking in Anthropic's evaluations. Use `thinking: {type: "adaptive"}`.

**CRITICAL**: Do NOT add "think step by step" to reasoning models (Claude thinking mode, GPT o-series, Gemini Thinking). They already perform internal CoT. Adding explicit instructions is redundant and can hurt performance. OpenAI explicitly warns against this.

**Tree-of-Thought**: 3-5x compute cost vs CoT. Marginal improvement for most practical tasks. Reserve for high-stakes, verifiable-answer problems.

**Self-Consistency**: Generate multiple paths, select most common answer. Adds cost proportional to samples but improves reliability on clear-answer tasks.

### 5.2 Prompt Allocation

| Layer | Content | Properties |
|-------|---------|------------|
| System prompt | Behavioral instructions, persona, constraints, format, safety | Stable across conversations; benefits most from caching |
| Tool descriptions | What each tool does, parameters, outputs, error states | Stable; "Goldilocks zone" — not too abstract, not too prescriptive |
| User prompt | Specific task, query, input data | Changes every turn |

**Optimal structure**: Static behavior → tool definitions → dynamic task context. Maximizes prompt cache hit rates.

### 5.3 Role Prompting

Useful for open-ended/creative tasks where the model needs specific perspective. Negligible effect on classification and factual QA.

**Practical rule**: Use brief, relevant descriptions. "You are a backend engineer specializing in API design" beats elaborate personas. One sentence. Value comes from priming relevant knowledge, not backstories.

### 5.4 Few-Shot vs Zero-Shot

**Zero-shot first**: Modern frontier models (Opus 4.6, GPT-5.4, Gemini 3.1 Pro) are excellent at inferring intent. Try zero-shot first; add examples only when it fails.

**Few-shot wins when**: Custom classification categories, domain-specific style, precise output formatting, tasks where instructions are ambiguous but examples are clear. Diminishing returns after 3-5 examples.

**Hybrid approach**: System prompt with clear instructions + 1-2 examples demonstrating edge cases. Flexibility of zero-shot + precision of few-shot without excessive tokens.

### 5.5 Positive Framing

The "Pink Elephant Problem" — telling a model NOT to do something forces it to process that concept. "Only use real data" outperforms "don't use mock data."

Audit all negative instructions. Reframe as positive directives. Test both versions.

### 5.6 Prompt Injection Defense (Defense-in-Depth)

**Attack vectors (2025-2026)**:
1. Direct injection: malicious instructions in user input
2. Indirect injection: payloads in retrieved documents, tool results, images
3. Tool-mediated: MCP responses redirecting agent behavior
4. Jailbreaks: social engineering to bypass safety
5. Lookalike tools: names similar to trusted ones, silently intercepting

**Defense layers**:
1. **Input validation**: Sanitize, detect patterns, classifiers (Lakera Guard)
2. **Prompt isolation**: XML tags/delimiters separating trusted from untrusted content
3. **Permission boundaries**: Tool permissions at application level, not prompt level
4. **Output monitoring**: Scan for PII, credentials, behavioral anomalies
5. **Constitutional AI**: Model-level resistance to manipulation

### 5.7 Prompt Scoring Metrics

**Structural** (no execution needed): Length vs complexity, instruction clarity, output format spec, separation of concerns.

**Semantic** (require evaluation): Task completion rate, consistency across runs, hallucination rate, format compliance, token efficiency.

**Best practice**: Maintain 10-50 representative inputs with expected outputs. Run every revision against this dataset. Track over time to detect degradation after model updates.

### 5.8 Dynamic System Prompt Construction

Production AI agents assemble system prompts dynamically from multiple layers. The ordering
and caching strategy directly impacts cost and latency.

#### Pipeline Architecture

| Layer | Content | Cacheable | Update Frequency |
|-------|---------|-----------|------------------|
| 1. Static instructions | Behavioral rules, persona, safety constraints, output format | Yes (global) | Per deployment |
| 2. Tool descriptions | Auto-generated from tool schemas (name, params, usage) | Yes (global) | Per session |
| 3. Dynamic boundary | Marker separating cacheable from volatile content | — | — |
| 4. Session context | Memory files (CLAUDE.md), environment info, language preference | Yes (session) | Per session |
| 5. Volatile context | MCP server state, active tools, output style overrides | No | Per turn |

**Critical principle**: Everything above the dynamic boundary gets a global cache scope
(shared across turns and potentially users). Everything below recomputes per session or turn.

#### Cache-Optimized Ordering

Place content that changes rarely at the top, content that changes per-turn at the bottom.
This maximizes prompt cache hit rates (see §2.3 for caching mechanics).

**Anti-pattern**: Injecting user name or timestamp at the top of the system prompt. This
invalidates the entire cache on every turn. Move volatile data to the bottom.

#### Section Registry Pattern

Each prompt section declares its caching behavior:

- **Memoized** (default): Computed once per session, cached. Examples: memory content,
environment info, language preference. Use for anything stable within a session.
- **Volatile**: Recomputed every turn. Requires explicit justification because each change
breaks the prompt cache. Example: MCP server instructions (servers connect/disconnect
mid-session).

**Production rule**: Default to memoized. Mark volatile only with a documented reason.

#### Token Budget Per Layer

| Layer | Budget | Notes |
|-------|--------|-------|
| Static instructions | 1,500–2,500 tokens | Core behavioral rules. Exceeding 3K → split into tiers |
| Tool descriptions | ~150 tokens per tool | 20 tools ≈ 3,000 tokens. Deferred loading for rarely-used tools |
| Memory (CLAUDE.md) | 500–1,000 tokens | Project + user memory combined. See KB-02 §1 for hierarchy |
| Environment info | 100–300 tokens | OS, shell, git status, working directory |
| MCP instructions | Variable | Proportional to connected servers. Cap at 1,000 tokens |

**Total system prompt**: 5,000–10,000 tokens for most agents. Beyond 10K, response quality
measurably degrades (see §2.1 "lost in the middle" problem).

#### Model-Specific Variations

Frontier models (Opus, GPT-5.x) need fewer explicit instructions — they infer conventions
from context. Smaller models (Haiku, GPT-4o-mini) need more prescriptive rules.

**Pattern**: Maintain a base prompt + model-specific overlays. The base covers universal
behavior. Overlays add/remove instructions based on model capability tier.

#### Practical Assembly Pattern

```
sections = [
  staticInstructions(),           # Layer 1: always present
  toolDescriptions(activeTools),  # Layer 2: from tool schemas
  "--- DYNAMIC BOUNDARY ---",    # Layer 3: cache boundary marker
  memoryContent(project, user),   # Layer 4: memoized per session
  environmentInfo(os, shell, git),# Layer 4: memoized per session
  mcpInstructions(servers),       # Layer 5: volatile (servers change)
  outputStyleOverride(preference),# Layer 5: volatile (user can change)
]
systemPrompt = sections.filter(Boolean).join("\n\n")
```

**Key**: `filter(Boolean)` removes null sections (e.g., no MCP servers connected). Never
include empty sections — they waste tokens and confuse the model.

---

## 6. Hallucination Reduction & Grounding

### 6.1 Root Causes

Three categories:
1. **Knowledge boundary failures**: Model lacks knowledge, fabricates instead of admitting uncertainty
2. **Faithfulness failures**: Model distorts provided source material
3. **Confidence miscalibration**: Uncertain information presented with same confidence as established facts

Fundamental tension: training objectives reward confident, fluent generation over calibrated uncertainty (OpenAI Sep 2025 paper).

### 6.2 Production Grounding Techniques

| Technique | How | Effectiveness | Best For |
|-----------|-----|--------------|----------|
| RAG | Shift source of truth from parametric to retrievable | Transformative | Factual queries with corpus |
| Tool-Augmented Generation | Model calls tools to verify claims | Transformative | Current events, computation |
| Forced Citation | Require sources for every claim | Useful | Research, documentation |
| Self-Consistency Voting | Generate N responses, select most consistent | Useful | Clear-answer tasks |
| Chain-of-Verification (CoVe) | Generate → verify questions → answer → revise | Situational | High-stakes prose |
| CRAG (Corrective RAG) | Evaluate retrieval quality before generation | Useful | Adaptive retrieval |

### 6.3 Domain-Specific Strategies

**Code generation**: Run it. Execution-based verification is gold standard. Self-repair loops (generate → test → fix) achieve 15-25% higher completion rates.

**Prose generation**: Forced citation with source verification. Self-consistency for opinion/analysis.

**Data analysis**: Use code execution (Python/R) for computations. Models are unreliable at arithmetic without tools.

### 6.4 Confidence Calibration

**Practical strategy**:
1. Factual claims → require tool verification
2. Generated content → self-consistency (generate 3, flag claims in <2 of 3)
3. High-stakes → human-in-the-loop for unverifiable claims
4. Code → run tests (beats all other confidence measures)

**When to trust without verification**: Creative writing, brainstorming, summarization of provided text. **Never** for medical/legal/financial, statistics, dates, attributions.

### 6.5 Coding-Specific Hallucination Patterns

| Pattern | Prevention | Detection |
|---------|------------|-----------|
| Phantom imports | "Only import from packages in package.json" | Type checker |
| Non-existent APIs | "Verify method exists via @docs or type definitions" | Type checker |
| Wrong signatures | "Read function signatures before calling" | Type checker |
| Invented packages | "Verify package exists with `npm search`" | npm install failure |
| Outdated patterns | Include framework version in rules | Deprecation warnings |
| Cross-framework conflation | Explicit framework specification with examples | Type checker / runtime |

---

## 7. MCP Ecosystem

### 7.1 Protocol Overview

MCP is an open protocol using JSON-RPC 2.0, enabling standardized LLM ↔ tool communication. Released by Anthropic Nov 2024, donated to Linux Foundation's Agentic AI Foundation Dec 2025.

**Scale**: 97M+ monthly SDK downloads, 1,200+ servers, 34,700+ dependent TypeScript projects, adopted by Anthropic, OpenAI, Google, Microsoft.

**Capabilities**: Tools (functions), Resources (data), Prompts (templates), Sampling (server-requested completions).

**Transport**: stdio (local processes) and Streamable HTTP (remote services).

### 7.2 MCP Server Directory (Battle-Tested)

| Server | Category | Quality | Stars | Key Strength |
|--------|----------|---------|-------|-------------|
| GitHub MCP | Git/VCS | Production | 3.2K | Comprehensive API: repos, issues, PRs, code search |
| Playwright MCP | Browser | Production | 6.1K | Best-in-class browser automation |
| PostgreSQL MCP | Database | Production | — | Schema inspection, read-only default |
| Context7 | Docs | Production | 50K | Up-to-date code documentation |
| Filesystem MCP | Files | Production | — | Fine-grained directory restrictions |
| Brave Search MCP | Search | Production | — | Web search, no Google account needed |
| Cognee | Memory/RAG | Production | 15K | Graph RAG + vector + full-text, 30+ formats |
| Sentry MCP | Monitoring | Production | — | Error tracking, stack traces, performance |
| Neon MCP | Database | Production | — | Serverless Postgres, natural language |
| SQLite MCP | Database | Production | — | Local dev, Datasette-compatible |
| Figma MCP | Design | Beta | — | Component generation from designs |
| Supabase MCP | Database+BaaS | Beta | — | Full platform: DB, auth, storage |
| Datadog MCP | Monitoring | Beta | — | Official Cursor plugin partnership |
| MCPX/Lunar | Gateway | Production | 410 | Centralized MCP management at scale |

### 7.3 MCP vs Alternatives

| Comparison | MCP Advantage | Alternative Advantage |
|------------|--------------|----------------------|
| vs Native Function Calling | Provider-agnostic, tool portability | Simpler for single-provider |
| vs Direct API | Write once, consumed by all clients | Simpler for single-tool/consumer |
| vs OpenAI Plugins (deprecated) | Open standard, multi-provider | N/A (deprecated) |

**Key signal**: OpenAI's Agents SDK treats MCP identically to native function tools. When the leading competitor builds first-class support, you've won the standard.

### 7.4 MCP Security

**April 2025 findings** (Invariant Labs): Individually safe MCP tools become dangerous in combination — the "Lethal Trifecta": LLM + privileged data access + untrusted input + external channel = data exfiltration.

**Documented attack vectors**:
- **Tool Poisoning**: Malicious instructions hidden in tool descriptions (invisible to users)
- **Cross-Server Cascades**: 72.4% cascade rate when multiple servers compromised. No isolation between servers
- **Rug Pulls**: Tools pass initial review, silently update with malicious code
- **CVE-2025-6514**: mcp-remote npm package (437K+ downloads) — command injection
- **CVE-2025-68143/68144/68145**: Anthropic's own mcp-server-git — unrestricted git_init (CVSS 8.8)
- **SANDWORM_MODE** (Feb 2026): 19 typosquatting npm packages injected rogue MCP configs

**AgentSeal scan**: 1,808 servers — **66% had security findings** (8,282 tool-level issues). Equixly: **43% contained command injection flaws**.

**Docker-based sandboxing** (Docker MCP Gateway):

```yaml
services:
  mcp-gateway:
    image: docker/mcp-gateway
    security_opt: [no-new-privileges:true]
    deploy:
      resources:
        limits: { cpus: '1.0', memory: 2G, pids: 100 }
    networks: [mcp-isolated]

  mcp-gateway-untrusted:
    image: docker/mcp-gateway:dind
    privileged: true
    networks: [mcp-untrusted]

networks:
  mcp-isolated: { driver: bridge }
  mcp-untrusted: { driver: bridge, internal: true }  # No external access
```

**OWASP MCP Security Minimum Bar** (5 categories, FAIL in 1-2 blocks deployment):
1. Strong Identity/Auth/Policy (OAuth 2.1, PKCE, resource indicators)
2. Strict Isolation and Lifecycle Control (per-server containerization)
3. Trusted and Controlled Tooling (version pinning, checksums, snyk-agent-scan)
4. Schema-Driven Validation (input/output sanitization)
5. Hardened Deployment (network isolation, egress controls, audit logging)

### 7.5 Building Custom MCP Servers

**When to build**: Internal tools/databases/services that AI agents need; multiple clients need same integration.

**Architecture decisions**:
- Prefer stateless servers (each request carries all context)
- Return structured errors with codes, messages, recovery suggestions
- Implement idempotency for write operations
- Validate inputs server-side (never trust model parameters)
- Expose fewer than 15-20 tools (models struggle with more)
- Set server-side timeouts for all external API calls
- Return structured data, not unstructured text

**Testing**: MCP Inspector for interactive debugging. Integration tests simulating real clients. Test error paths explicitly. Test with multiple hosts (Claude Desktop, Cursor, etc.).

---

## 8. AI IDE & Tooling Landscape

### 8.1 The Big Four (March 2026)

| Tool | Type | Key Strength | SWE-bench | Pricing | Best For |
|------|------|-------------|-----------|---------|----------|
| **Claude Code** | Terminal agent | Architectural reasoning, multi-agent | 80.8% | $20-200/mo | Senior devs, large refactors |
| **Cursor** | AI-native IDE | Fastest autocomplete, visual editing | — | $20-200/mo | Integrated editing experience |
| **GitHub Copilot** | IDE extension | GitHub integration, widest adoption | — | Free-$39/mo | GitHub-centric teams, budget |
| **Windsurf** | AI IDE | Cheapest paid, Cascade context | — | Free-$200/mo | Price-conscious, Devin integration |

### 8.2 Terminal Agents

| Tool | Model | Cost | Key Feature |
|------|-------|------|-------------|
| **Codex CLI** (OpenAI) | GPT | Free (with ChatGPT Plus) | Cloud sandboxes, open source |
| **Aider** | Any (BYOK) | BYOK | Git-integrated, model transparent |
| **OpenCode** | DeepSeek | ~$2-5/mo | 95K+ stars, near-zero cost |
| **Cline** | Any (BYOK) | BYOK | 5M VS Code installs, Samsung adoption |

### 8.3 Decision Framework

- **Raw quality**: Claude Code with Opus 4.6
- **Speed and flow**: Cursor with Supermaven autocomplete
- **Cost efficiency**: OpenCode + DeepSeek, or GitHub Copilot Free
- **Simplicity**: GitHub Copilot
- **Control**: Cline or Aider (open source, BYOK)
- **Most common setup**: IDE agent (Cursor/Windsurf) daily + terminal agent (Claude Code/Codex) for complex tasks

### 8.4 IDE-Agnostic Context Patterns

1. **Project README as context anchor** — highest-signal document for any AI agent
2. **Typed interfaces as implicit docs** — TypeScript types constrain solution space dramatically
3. **Test files as examples** — best few-shot examples demonstrating behavior and conventions
4. **Related code close together** — flat, clear module structures over deep fragmented trees
5. **Conventional over clever** — AI trained on millions of standard patterns; unconventional confuses it

---

## 9. Cost Engineering

### 9.1 Model Pricing (March 2026)

| Model | Input/Output per M tokens | SWE-bench | Notes |
|-------|--------------------------|-----------|-------|
| MiniMax M2.5 | $0.30 / $1.20 | 80.2% | Open-weight leader |
| DeepSeek V3.2 | $0.28 / $0.42 | — | Cheapest frontier-quality |
| Gemini 3.1 Pro | $2 / $12 | 80.6% | Best price-performance |
| GPT-5.4 | $2.50 / $15 | 80.0% | Fast |
| Claude Sonnet 4.6 | $3 / $15 | 79.6% | Strong balance |
| Claude Opus 4.6 | $5 / $25 | 80.8% | Deepest reasoning |

**25x price gap** between cheapest and most expensive frontier model — cost-per-task matters more than cost-per-token.

### 9.2 Token Consumption Patterns

Average Claude Code usage: **$6/developer/day** (90th percentile under $12). But:
- **Over 90% of tokens are cache reads** — prompt caching is the #1 cost lever
- Agentic usage consumes **5-20x more tokens** than standard completions
- Agent teams in plan mode: ~7x more tokens than standard
- One developer documented 47 iterations on a single ALTER TABLE: "$30 learning experience about a $0.50 problem"

### 9.3 Model Routing Strategy

```python
def select_model(task):
    if task.type in ['classify', 'extract', 'validate', 'format']:
        return 'haiku'       # $1/$5 per MTok
    elif task.type in ['generate', 'analyze', 'debug', 'test']:
        return 'sonnet'      # $3/$15 per MTok
    elif task.type in ['architecture', 'security_review', 'complex_debug']:
        return 'opus'        # $5/$25 per MTok
    else:
        return 'sonnet'      # Default middle tier
```

Organizations report **30-70% cost reductions** with model routing. The `opusplan` alias (Opus for planning, Sonnet for implementation) is the most effective variant.

**"Steering tax" heuristic**: Opus with thinking needs less steering (fewer correction cycles), resulting in faster total task time despite slower per-token speed. If you'd need to correct Sonnet's output once, Opus was cheaper — the cost of one correction cycle exceeds the model price difference. Default to Opus for multi-file implementation and architecture; Sonnet for reads/audits; Haiku for mechanical subtasks.

### 9.4 Six Proven Cost Levers

1. **Model routing** (40-60% savings)
2. **Prompt caching** (up to 90% on cached content)
3. **Response caching** (common query/response pairs)
4. **Token budgets** (hard limits per task to prevent runaway loops)
5. **Batch processing** (Anthropic/OpenAI batch APIs at 50% discount)
6. **Structured outputs** (reduce waste by constraining format)

### 9.5 TCO Comparison

| Profile | Tool Stack | Monthly | Annual | Notes |
|---------|-----------|---------|--------|-------|
| Solo dev (light) | Copilot Pro | $10 | $120 | Most predictable |
| Solo dev (light) | Cursor Pro | $20 | $240 | Includes $20 API credits |
| Solo dev (power) | Cursor Ultra + Claude Max | $400 | $4,800 | Heavy agentic |
| 5-person team | Copilot Business | $95 | $1,140 | $19/user/mo |
| 5-person team | Cursor Teams + Claude API | $600-1,200 | $7,200-14,400 | Variable |
| 20-person team | Copilot Enterprise | $1,200 | $14,400 | $60/user |
| 20-person team | Cursor Enterprise + monitoring | $2,000-5,000 | $24,000-60,000 | Agentic multiplier |

**Sticker price understates by 2-5x** for power users. Tab completions: ~$0.50-1/day. Agent sessions: $2-5+ each.

### 9.6 Cost Monitoring Stack

- **ccusage**: npx zero-install, daily/monthly/session reports from JSONL logs
- **Helicone**: Open-source proxy (2B+ interactions), caching reduces costs 20-30%
- **LiteLLM**: Unified gateway across 100+ providers with per-team budgets
- **Faros AI**: Connects Claude Code usage to DORA metrics

### 9.7 Circuit Breakers for Agent Loops

Hard limits on total tokens, step counts, and time per agent task. Uncontrolled loops burn through API budgets in hours.

**Implementation**: Set token budgets per task, step-count limits (max 15 tool calls), wall-clock time limits. On breach: return partial results with status flag, don't silently fail.

A 10-step agent workflow takes 10-50 seconds minimum. Multi-agent systems multiply further.

### 9.8 Vercel AI SDK

Standard for building AI-powered web applications in the Next.js ecosystem:

- **AI SDK Core**: Model-agnostic API for text generation, structured output, tool calling (OpenAI, Anthropic, Google through unified interface)
- **AI SDK RSC**: Stream AI responses into React Server Components without separate API endpoints
- **AI SDK UI**: Pre-built hooks (`useChat`, `useCompletion`, `useAssistant`) for common patterns
- **MCP integration**: `@ai-sdk/mcp` connects to MCP servers (v2.0.0-beta, March 2026)
- **`maxSteps`**: Enables multi-step tool use loops within a single API call

**Best practice**: AI SDK for web-facing applications. LangChain/LangGraph for complex backend agent orchestration. Different layers of the stack.

---

## 10. AI Observability & Monitoring

### 10.1 Minimum Viable Observability

Log every LLM call with: prompt hash, model, token counts, latency, cost, and a quality signal. Non-negotiable for production.

### 10.2 Tool Comparison

| Tool | Type | Best For | Pricing |
|------|------|----------|---------|
| **Langfuse** | Open-source | Self-hosted, tracing + prompt management | Free/managed |
| **LangSmith** | Managed | LangChain/LangGraph ecosystem | Freemium |
| **Braintrust** | Managed | A/B testing prompts, evaluation | Freemium |
| **Arize** | Managed | Production monitoring, drift detection | Freemium |
| **Helicone** | Open-source | Quick cost monitoring, one-line proxy | Free/paid |

### 10.3 Prompt Management

Treat prompts as code artifacts: version control, test against evaluation datasets before deployment, monitor in production, roll back on degradation. "PromptOps" discipline is becoming standard.

**Tools**: LangSmith (versioning + Polly comparison), Braintrust (A/B with statistical significance), PromptLayer (lighter weight).

### 10.4 Prompt Regression Testing

**Promptfoo** (acquired by OpenAI): Declarative YAML test suites, side-by-side comparison, assertion-based validation, GitHub Actions integration.

**Braintrust**: Environment-based deployment (dev → staging → production) with quality gates blocking regressions.

**Langfuse**: Open-source prompt version control with A/B testing via traffic-splitting labels.

**Statistical methodology**: LLM outputs are high-variance. Single-run tests flip rankings 83% of the time. Start with 100-200 eval tasks. Always run A/A test first. Don't stop tests early (peeking problem).

---

## 11. Development Workflow Optimization

### 11.1 AI-Assisted Code Review

**What works**: Pattern detection, style violations, security issues, obvious bugs. Use as first-pass filter before human review.

**What doesn't**: Architectural decisions, business logic, "why" behind changes. Too permissive or too noisy.

**Best practice**: Focus AI on security, style compliance, test coverage, obvious bugs, documentation. Reserve human review for architecture and business logic.

### 11.2 Test Generation

**Unit tests**: Reasonable for well-defined functions. Often tests happy paths, misses edge cases. Best as starting point for human refinement.

**Integration/E2E tests**: AI generates scaffolding but struggles with environment setup, mocking, system boundaries. Significant human refinement needed.

### 11.3 CI/CD Integration

**PR Review Bots**: Most mature pattern. Focus on specific, actionable issues. Noisy bots get disabled within weeks.

**Deployment Agents**: AI creates, tests, submits PRs autonomously. Best for well-scoped, repetitive tasks.

**Anti-pattern**: Unreviewed AI write access to production branches. Even best models produce incorrect code 15-20% on complex tasks.

### 11.4 Documentation Generation

Code → Docs: 60-80% correct on first pass. AI's strongest use case — well-defined, verifiable, massive time-saver.

### 11.5 Refactoring with AI

**Works well**: Pattern replacement, simple migrations, dead code removal, style standardization.

**Works moderately**: Large architectural refactoring — AI as pair-programming partner.

**Fails**: Business logic understanding, race conditions, performance implications.

### 11.6 Human-AI Collaboration

**Delegate fully**: Routine, well-scoped tasks with clear acceptance criteria and automated verification.

**Pair-program**: Complex tasks requiring both AI capability and human judgment.

**Stay manual**: Novel problem-solving, security-critical code, performance-critical micro-optimizations.

**Key insight** (byteiota, March 2026): The real advantage is not speed but reduced mental load. AI handles context, repetition, scaffolding → developers focus on design, correctness, long-term thinking.

### 11.7 Feedback Loop Engineering

**The single highest-ROI pattern**: An agent with feedback loops (build, lint, test, visual check) self-corrects to 2-3x quality vs an agent without.

**Design principles for verification chains**:
1. **Mechanical first**: build + lint + test can be automated via hooks — zero agent reasoning needed
2. **Progressive specificity**: build catches compile errors → lint catches conventions → tests catch logic → visual catches UX
3. **Fail fast**: run the cheapest check first (lint < build < test < visual). Don't run E2E if build fails
4. **Close the loop**: always re-read the original requirements and score PASS/MISS per item before declaring done

**Implementation pattern**: Configure PostToolUse hooks for mechanical checks. Include spec compliance as the final step in every slash command. When writing prompts for agents, ALWAYS specify the verification chain — never say "build it" without saying "verify it this way."

**Anti-pattern**: Agents that implement, commit, and move on without verification. This produces code that works in isolation but fails in integration. The fix is always cheaper than the debug.

---

## 12. Myths Debunked

### Myth 1: Bigger Context Windows Solve Everything
**Reality**: Correctness degrades at ~32K tokens. Attention is O(n²). GPT-5 starts "summarizing" after ~600K. Claude maintains to ~950K but with 6.5x latency. Curated small contexts consistently outperform dumps.

### Myth 2: More Agents = Better Results
**Reality**: Google/MIT shows capability saturation. Token costs scale linearly with agents. 40%+ agentic projects predicted canceled by 2027.

### Myth 3: Tree-of-Thought > Chain-of-Thought
**Reality**: 3-5x compute cost for marginal improvement on most tasks. Reserve for high-stakes, verifiable problems.

### Myth 4: "Think Step by Step" Helps Reasoning Models
**Reality**: Reasoning models already do internal CoT. Explicit instructions are redundant and can trigger wrong sub-model in GPT-5's router.

### Myth 5: Model Leaderboard = Best Tool
**Reality**: All six frontier models within 1.3% on SWE-bench. Rank reversals across benchmarks are common. The 22+ point scaffold swing dwarfs model differences.

### Myth 6: Vector Search Suffices for RAG
**Reality**: Misses exact terms. Hybrid + reranking improves precision 15-30%.

### Myth 7: Fine-Tuning for Domain Tasks
**Reality**: RAG + context engineering outperforms at fraction of cost. Fine-tuning: $10K-100K+, creates model management overhead, doesn't help with factual grounding. Hallucinations just become domain-specific.

### Myth 8: More Context Is Always Better
**Reality**: Beyond ~2,000 tokens of always-on rules, additional context degrades output due to "lost in the middle" and Claude's relevance filtering.

### Myth 9: AI Can Self-Verify Without Tools
**Reality**: Without type checking, linting, test execution — frequent subtle errors undetectable by reasoning alone. Phantom imports and non-existent APIs are trivially caught by tooling.

### Myth 10: One Giant Agent Can Do Everything
**Reality**: Context fills with irrelevant information from earlier subtasks. Separate context windows per subtask produce better results.

---

## 13. Cross-Domain Patterns

### Universal Principles

1. **"Smallest viable context" appears everywhere** — Context, memory, prompts, agents all optimize for minimum high-signal tokens. Curation beats accumulation.

2. **Harness/scaffold > core component** — In agents (22+ point swing), RAG (pipeline > database), IDEs (integration > model). Infrastructure beats intelligence.

3. **Standardization is winning** — MCP for tools, AGENTS.md for context, SWE-bench for benchmarks. Bespoke → interoperable.

4. **Cost engineering = new reliability engineering** — Model routing, caching, budgets, batching are as critical as model quality.

5. **Verification > generation** — Highest-impact improvements come from adding verification (type check, lint, test) rather than improving generation.

6. **Progressive disclosure is the meta-pattern** — Load minimum necessary, pull more on demand. Applies to rules, skills, MCP, memory.

### Where the Field Is Heading

1. **Agent-native infrastructure**: 40% enterprise apps embedding agents by end 2026 (Gartner)
2. **MCP maturation**: Horizontal scaling, `.well-known` discovery, async operations, enterprise readiness
3. **Open-weight parity**: MiniMax at 80.2% SWE-bench for $0.30/$1.20 — self-hosted viable
4. **Evaluation-first development**: Tools like LangSmith/Braintrust suggest test-driven AI development
5. **Inter-agent protocols**: Google's A2A + Agent Network Protocol for multi-agent ecosystems
6. **Cost democratization**: 25x price gap means frontier-quality accessible to individuals

---

## 14. Tools & Resources Directory

### Context Engineering
| Tool | URL | Purpose |
|------|-----|---------|
| Anthropic Context Engineering Blog | anthropic.com/engineering | Foundational patterns |
| Agent Rules Builder | agentrulegen.com | Generate .mdc files |
| awesome-cursorrules | github.com (37.9K stars) | Community rule examples |

### Memory & RAG
| Tool | URL | Purpose |
|------|-----|---------|
| LlamaIndex | llamaindex.ai | Data ingestion, hierarchical indexing |
| LangChain/LangGraph | langchain.com | Orchestration, agent logic |
| Cognee | github.com/topoteretes/cognee | Graph RAG + vector + full-text |
| CodeGraphContext | github.com (1.4K stars) | Cross-session knowledge graphs |

### Agent Frameworks
| Tool | URL | Best For |
|------|-----|----------|
| LangGraph | langchain-ai.github.io/langgraph | Production agent workflows (fastest, most token-efficient) |
| CrewAI | crewai.com | Rapid prototyping |
| OpenAI Agents SDK | github.com/openai | Clean handoffs, built-in guardrails |
| Google ADK | google.github.io/adk-docs | Hierarchical agents, Gemini-optimized |

### Vector Databases
| Tool | Best For | Performance |
|------|----------|-------------|
| pgvector/pgvectorscale | Postgres teams | 471 QPS at 99% recall on 50M vectors |
| Pinecone | Zero-ops managed | SOC 2, HIPAA, higher cost |
| Qdrant | Self-hosted performance | 22ms p95, Rust-based |
| Milvus/Zilliz | Billion-scale | GPU-accelerated, <10ms p50 |
| Chroma | Prototyping | Simple, not production-scale |

### Observability
| Tool | Type | Best For |
|------|------|----------|
| Langfuse | Open-source | Self-hosted tracing |
| LangSmith | Managed | LangChain ecosystem |
| Braintrust | Managed | Prompt A/B testing |
| Helicone | Open-source | Quick cost monitoring |
| ccusage | CLI | Claude Code session costs |

### Security
| Tool | Purpose |
|------|---------|
| Snyk Agent Scan (`uvx snyk-agent-scan@latest`) | Scan MCP servers/skills for vulnerabilities (formerly Invariant Labs `mcp-scan`; needs `SNYK_TOKEN`) |
| Docker MCP Gateway | Sandboxed MCP execution |
| Lakera Guard | Prompt injection detection |
| NeMo Guardrails (NVIDIA) | Programmable LLM guardrails |

### Benchmarks
| Benchmark | URL | What It Measures |
|-----------|-----|-----------------|
| SWE-bench Verified | swebench.com | Real GitHub issue resolution (500 tasks) |
| SWE-bench Pro | — | Harder, less scaffolding |
| Terminal-Bench 2.0 | — | Terminal task execution |
| LongMemEval | ICLR 2025 | Memory system effectiveness |
| Aider Polyglot | aider.chat | Multi-language coding |

---

*Compiled March 2026. Synthesized from 4 research documents (~4,200 lines). All findings include effectiveness ratings and confidence levels. For project infrastructure and systems architecture, see KB-02-AI-PROJECT-INFRASTRUCTURE.md.*
