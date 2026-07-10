# AI Project Infrastructure & Systems Architecture: Definitive Knowledge Base (March 2026)

> **Purpose**: Complete reference for building AI-powered project infrastructure — context architecture blueprints, agent systems, rules engineering, evaluation frameworks, security governance, domain-specific patterns, and team workflows. Use this document to understand HOW TO BUILD AI systems for projects.
>
> **Audience**: AI agents setting up project infrastructure, architects designing AI-first development environments, and teams building the organizational layer around AI tools.
>
> **Companion**: For the underlying techniques and science (context engineering, memory algorithms, RAG, prompts, etc.), see `KB-01-AI-WORKFLOW-ENGINEERING.md`.
>
> **Sources**: Synthesized from 4 research documents (~4,200 lines) — Claude Opus 4.6 research, GPT Deep Research, and gap-filling deep dive (March 2026).

---

## Table of Contents

1. [Context Architecture Blueprint](#1-context-architecture-blueprint)
2. [Rules Engineering](#2-rules-engineering)
3. [Skills System](#3-skills-system)
4. [Agent Architecture & Orchestration](#4-agent-architecture--orchestration)
5. [Project Organization for AI-First Development](#5-project-organization)
6. [Quality & Accuracy Maximization](#6-quality--accuracy-maximization)
7. [Agent Evaluation & Quality Metrics](#7-agent-evaluation--quality-metrics)
8. [Security & Governance](#8-security--governance)
9. [Domain-Specific Context Patterns](#9-domain-specific-context-patterns)
10. [Cross-Session Handoff & Continuity](#10-cross-session-handoff)
11. [Team Workflows & Organizational Patterns](#11-team-workflows)
12. [The Complete Blueprint (Copy-Ready)](#12-the-complete-blueprint)
13. [What Changed: Obsolete vs Current Patterns](#13-obsolete-vs-current)
14. [Anti-Patterns Checklist](#14-anti-patterns-checklist)
15. [Evaluation & ROI Measurement](#15-evaluation--roi)

---

## 1. Context Architecture Blueprint

### 1.1 The Four-Tier Context Hierarchy

Modern AI IDEs follow a four-tier loading hierarchy. Understanding this is essential for efficient token budget management.

**Tier 1 — Always-Loaded** (`alwaysApply: true`):
- Loaded into every AI interaction: chat, autocomplete, code generation
- Use for: universal project conventions, package manager, language/framework mandates
- Budget: Under 500 tokens total. Every token here is spent on every interaction.
- Cursor processes these first, giving highest attention weight

**Tier 2 — Glob-Scoped** (auto-loaded by file path match):
- Activated when active file matches glob patterns
- Use for: framework-specific conventions, testing patterns, database conventions
- Budget: Up to 1,000 tokens per rule (only loads when relevant)

**Tier 3 — On-Demand** (agent-requested or description-matched):
- Not loaded by default. Agent reads `description` field and decides whether to pull in content
- Use for: skills, procedural knowledge, complex workflows, reference documentation
- Budget: Can be larger — loaded only when truly needed

**Tier 4 — Deep Reference Docs**:
- External documentation via @docs, @web, or MCP servers
- Not stored in context files — fetched at query time
- Use for: API documentation, library references, third-party specs

**Key insight**: Most teams overload Tier 1 and underutilize Tiers 2-4. Moving framework-specific rules from alwaysApply to glob-scoped reduces noise in every interaction.

### 1.2 File-Level Context Systems

#### CLAUDE.md (Claude Code)

Three-level hierarchy, merged in specificity order:
1. `~/.claude/CLAUDE.md` — Global personal instructions
2. `./CLAUDE.md` — Project root (team-shared via Git)
3. Subdirectory `CLAUDE.md` — Scoped to specific codebase parts

**Critical detail**: Claude Code wraps CLAUDE.md in `<system-reminder>` stating content "may or may not be relevant." The more irrelevant content, the more important instructions get ignored.

**Target size**: typical well-formed range is 80-150 lines (~800-1,500 tokens); the enforced gate is ≤150 lines + six required sections — no minimum (a disciplined 71-line file passes). Maximum 200 lines for hand-authored files outside the generator gate. Delete 70% of what `/init` generates.

**Structure**:
```markdown
# Project: [Name]
One-line description with tech stack.

## Build & Test Commands
- `pnpm dev` — start dev server
- `pnpm test` — run unit tests
- `pnpm lint:fix` — fix lint errors
- `pnpm typecheck` — TypeScript checking

## Code Style
- [3-5 specific conventions, not generic "best practices"]

## Architecture
- [Key structural decisions]

## Key Conventions
- [Where things go]

## Common Pitfalls
- [What the agent will get wrong without this]
```

#### .cursor/rules/*.mdc (Cursor)

YAML frontmatter controls activation:

```yaml
---
description: "Purpose and when to apply"
globs: ["src/components/**", "!**/*.test.ts"]
alwaysApply: false
---
# Rule Content
```

Fields:
- `alwaysApply: true` — every interaction regardless of file
- `globs` — minimatch patterns; activates on file match
- `description` — agent decides whether to load based on relevance

Legacy `.cursorrules` is deprecated. Lacks scoping, wastes tokens loading everything always.

#### AGENTS.md (Cross-IDE Standard)

Launched mid-2025 under Linux Foundation's Agentic AI Foundation. Supported by: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, Aider, Zed, Warp, RooCode.

Standard Markdown, no special schema. Nearest to file takes precedence. User prompts override everything.

**If you use multiple AI tools, this is your interop layer.**

### 1.3 Scope Precedence

**Cursor**:
1. Manual/Local (@ruleName) — highest
2. Auto Attached (glob matches)
3. Always Apply rules
4. User Rules (Settings > Rules) — lowest

**Claude Code**:
1. Explicit user prompts — always override
2. Subdirectory CLAUDE.md — closest to file
3. Project root CLAUDE.md — shared team config
4. `~/.claude/CLAUDE.md` — personal global
5. Auto-memory — learnings saved automatically

### 1.4 Cross-IDE Compatibility Strategy

**AGENTS.md as interop**: Universal conventions read by all tools.

**Tool-specific additions**:
- `.cursor/rules/*.mdc` for glob-scoped rules (Claude Code ignores)
- `CLAUDE.md` for Claude Code-specific instructions (Cursor ignores)
- `.claude/commands/` for slash commands
- `.cursor/skills/` for on-demand procedural knowledge

**Dual-file pattern**: `AGENTS.md` (universal) + `CLAUDE.md` (Claude-specific additions).

**MCP config**: `.cursor/mcp.json` for Cursor, `.mcp.json` for Claude Code (same JSON format).

---

## 2. Rules Engineering

### 2.1 What Gets Followed

**Highest compliance patterns**:
1. ALL-CAPS headers for critical rules: `## NEVER USE DEFAULT EXPORTS`
2. Numbered execution sequences (models follow ordered lists well)
3. Code examples showing expected output (3-5 lines)
4. NEVER/ALWAYS binary constraints (no ambiguity)
5. First-person directives: "You must" beats "The developer should"
6. Negative examples: "NEVER X — breaks Y" followed more than positive-only

**Lowest compliance patterns**:
1. Paragraphs of explanation without action items
2. "Consider" or "when appropriate" hedging
3. Rules contradicting strong training priors
4. Rules buried in middle of long file ("lost in the middle")
5. Complex conditionals: "If X and Y but not Z, then..."

### 2.2 Rule Format

```markdown
## RULE NAME (ALL CAPS)
- DO: [concrete instruction with code example]
- DO NOT: [concrete anti-pattern with code example]
- WHY: [one sentence, max]
```

**The "martial arts" approach** (Elementor Engineering): Short, direct, combat-style instructions. No fluff. Every word costs tokens. Refined through weeks of human reinforcement learning.

### 2.3 The Highest-ROI Single Rule

```
SEARCH FIRST — Use codebase search and grep to find similar functionality
or confirm none exists. Be 100% sure before implementing anything new.
REUSE FIRST — Check existing functions/patterns/structure. Extend before creating.
```

This prevents the #1 failure mode: duplicating existing functionality or ignoring established patterns.

### 2.4 What Research Shows (MSR '26 Study)

Shaokang Jiang and Daye Nam analyzed **401 public GitHub repositories** with .mdc cursor rule files (arXiv: 2512.18925, MSR '26):

- Average rule file: **462.67 lines** (SD=1,197; max 11,076)
- Average **9.31 .mdc files per repo**
- **16 days between commits** to rule directories
- Five-category taxonomy: Conventions, Guidelines, Project Information, LLM Directives, Examples
- Finding: "excessive or unoptimized context can lead to more complex and less accurate responses"

### 2.5 The Velocity-Quality Tradeoff (CMU Study)

arXiv: 2511.04427 — 1,380 matched repositories:
- Cursor adoption: **statistically significant but transient velocity increase** (first 1-2 months, then baseline)
- **4.94x increase in static analysis warnings**
- **3.28x increase in code complexity** — persistent
- Quality assurance identified as "major bottleneck"

**Implication**: Rules that enforce quality checks (typecheck, lint, test after every change) are not optional luxuries — they directly counter the documented quality degradation.

### 2.6 Nobody Has A/B Tested Rules

**Most important negative finding**: No published study has directly compared different rule configurations against each other. Studies characterize what's in rule files but don't measure which phrasings work better.

**What you can measure today**:

| Metric | How | Baseline |
|--------|-----|----------|
| First-pass compile rate | CI on AI-generated code | ~95% Python, ~80% C++ |
| Test pass rate | pytest/JUnit on changes | Top: 80.9% SWE-bench |
| Package hallucination rate | Check imports against registry | 19.7% avg, ~5% commercial |
| Static analysis warnings | SonarQube/ESLint delta | ~30% increase post-Cursor (CMU) |
| Pattern conformance | Custom linter rules | Target: >80% |

---

## 3. Skills System

### 3.1 Skills vs Rules vs Agents

| Aspect | Rules (.mdc) | Skills (SKILL.md) | Agents (.md) |
|--------|-------------|-------------------|---------------|
| **Purpose** | Declarative conventions | Procedural knowledge | Specialized execution |
| **Loading** | Always or glob-scoped | On-demand, triggered | Invoked explicitly |
| **Tone** | "Always do X" | "Here's how to do Y" | "You are Z" |
| **Size** | Under 500 lines | No hard limit, progressive disclosure | Focused prompt + tools |
| **When to create** | Pattern appears in 3+ conversations | Procedure requires multiple steps | Task benefits from specialization |

### 3.2 Skill Architecture

Skills are **folders, not files**:

```
.cursor/skills/
  deployment/
    SKILL.md          # Entry point with trigger description
    references/       # API docs, schema files
    scripts/          # Shell scripts, templates
    examples/         # Working code examples
```

The `description` field in SKILL.md is a **trigger** — write it for the model ("when should I fire?"), not as a summary.

**Progressive disclosure**: Agent reads SKILL.md first, pulls subdirectory contents as needed.

**Dynamic injection**: Embed `` `!command` `` in SKILL.md to run shell commands at invocation time. Agent sees only the output.

### 3.3 Skill Design Principles

From `shanraisshan/claude-code-best-practice`:
- Don't state the obvious — focus on what pushes the agent out of default behavior
- Don't railroad the agent — give goals and constraints, not prescriptive steps
- Include a **Gotchas section** — highest-signal content, continuously updated with failure points
- Skills should have a "When NOT to" section

---

## 4. Agent Architecture & Orchestration

### 4.1 Single vs Multi-Agent Decision

**Single agent when**:
- Task fits in one context window
- Tight coordination between steps needed
- Speed > thoroughness
- Cost is a concern (multi-agent uses 3x+ tokens)

**Multi-agent when**:
- Naturally independent subtasks
- Different expertise or tool access per subtask
- Task too large for one context window
- Principle of least privilege matters
- Clear evidence of domain overload in single-agent

**Critical data**: Only 2% of organizations have deployed agents at full production scale. Gartner predicts 40%+ of agentic projects canceled by 2027 due to costs, unclear value, or risk.

### 4.2 Multi-Agent Patterns

**Hub-and-Spoke** (Centralized Orchestration): Central orchestrator manages all agents. Predictable, debuggable. Bottleneck risk. Google/MIT: reduces error amplification, optimal for financial reasoning.

**Hierarchical**: Tiered supervision — high-level agents supervise worker agents. Dominant pattern in production deployments. Balances flexibility and oversight.

**Fan-Out/Fan-In**: Parallelize independent subtasks, aggregate results. Effective for research, data gathering, embarrassingly parallel work. Claude Code Agent Teams implement this.

**Hybrid**: Centralized orchestrator for strategy, local autonomy for tactical execution.

### 4.3 Orchestration Frameworks (Honest Comparison)

| Framework | Pattern | Speed | Lock-in | Best For |
|-----------|---------|-------|---------|----------|
| **LangGraph** | Directed graph + conditional edges | Fastest (2.2x vs CrewAI) | Model-agnostic | Production, full control |
| **CrewAI** | Role-based crews | Slower (5s/tool) | Model-agnostic | Rapid prototyping |
| **OpenAI Agents SDK** | Explicit handoffs | Production-grade | OpenAI only | Clean handoffs, guardrails |
| **Google ADK** | Hierarchical agent tree | Good | Multi-provider | Gemini-optimized, MCP |
| **AutoGen/AG2** | Conversational GroupChat | 8-9x less tokens vs LangChain | Model-agnostic | Multi-agent discussion |

### 4.4 Agentic Coding Patterns

**Plan-then-Execute**: Expensive model plans, cheap model executes. Most cost-effective — up to 90% reduction. Planning needs reasoning depth; execution needs instruction-following.

**Iterative Refinement**: Generate → test → analyze → fix → test. Standard loop. 15-25% higher completion than single-pass. Limit to 3-5 cycles (diminishing returns beyond).

**Best-of-N**: Generate N solutions, evaluate against criteria, select best. Expensive (N × cost). Useful for critical paths with clear acceptance criteria.

**Self-Repair Loops**: Generate → run tests → feed errors back → fix → repeat. Backbone of modern coding agents. Error feedback is critical — models much better at fixing when they see specific failures.

**ReAct**: Alternate reasoning and acting. 15-25% higher completion than CoT alone on 3-8 step tasks. Beyond 10+ steps, Plan-then-Execute more reliable.

### 4.5 Sub-Agent Delegation

**Context Isolation**: Each sub-agent receives only context relevant to its subtask. Prevents pollution, reduces costs, improves focus.

**Result Aggregation**: Merge, select, validate, or synthesize sub-agent outputs.

**Failure Handling**: Timeouts, fallback strategies, clear error propagation. Sub-agent failures must not crash parent.

**Fallback chains are now a first-class platform primitive** (June 2026), not a hand-rolled retry pattern — design agents to declare a model fallback chain instead of failing or retrying blind. Three coordinated surfaces shipped within days of each other: (a) Anthropic SDK v0.108.0 added server-side fallbacks (beta header `server-side-fallback-2026-06-01`; Claude API + Claude Platform on AWS only — not Bedrock/Vertex) plus client-side fallback middleware (Python/TS/Go/Java/C#); (b) Claude Code v2.1.166 added a top-level `fallbackModel` setting; (c) Fable 5 itself runs an internal Fable→Opus-4.8 fallback in production (see §4.8 model-class update) — the canonical proof the pattern operates at frontier scale. Wire fallbacks for rate-limit/overload resilience and cost ceilings, and surface fallback events in logs — silent model degradation breaks reproducibility assumptions. **Field-proven 2026-06-12:** the Fable 5 export-control suspension made *administrative unavailability* a same-day outage — a **third failure mode** beyond rate-limit and quality-degradation, and the reason to **pin to a model *class*, not a single ID** (`CLAUDE-SURFACE-ROUTING.md` §1b). Anthropic's 2026-06-11 apology for *silent* Fable→Opus fallback is the canonical lesson that substitution must be **visible by default**.

**Three-stage pipeline** (production Claude Code):
1. **pm-spec agent** — Reads input, writes spec with acceptance criteria (tools: Read, Write to docs only)
2. **architect-review agent** — Validates against constraints, produces decision record
3. **implementer-tester agent** — Writes code and tests, updates docs (tools: Bash, Edit)

### 4.6 Minimum Viable Agent Set

**Core set (any project)**:
1. Research agent — explores codebase, builds context
2. Implementation agent — writes and edits code
3. Testing agent — writes tests, runs suite, reports gaps
4. Review agent — reviews diffs for bugs, security, design

**Extended set (larger teams)**:
5. Documentation agent
6. DevOps agent
7. Security agent (Cursor templates catch 200+ vulnerabilities/week across 3K+ PRs)

**Three mandatory subagents** (quality gate for every project):
1. **Simplifier** — runs after implementation, reviews for reuse/dead code/overengineering (read-only)
2. **Reviewer** — code review before commit, checks correctness/security/conventions (read-only)
3. **Verifier** — runs build + lint + test, reports pass/fail mechanically (Bash + Read only)

These three form a feedback loop that compounds: simplifier catches complexity, reviewer catches bugs, verifier catches regressions. Define as `.claude/agents/` files in Claude Code or `.cursor/agents/` in Cursor.

**Rule**: Don't create 15 agents for a small project. Start with the three mandatory plus 1-2 domain-specific agents. Add more when you feel pain.

**Least-privilege tool matrix** (apply when defining ANY agent; default deny, every grant justified by one line — field-confirmed convention across large public agent catalogs, verified 2026-07-02):

| Agent class | Tool grant | Never |
|---|---|---|
| Auditor/reviewer (reviewer, security-auditor, seo-auditor, i18n-validator, simplifier) | Read, Grep; Bash ONLY if the audit runs checks — command-scoped, read-only | Write, Edit, network calls, package installs |
| Generator (tester, doc-writer) | Read, Grep + Write scoped to its output file class (test files, docs) | Editing source files, unscoped Write |
| Fixer (refactor, build-fix) | Read, Grep, Edit; Bash for verification commands only | Deploy/publish commands, dependency changes without approval |
| Verifier | Bash + Read only | Any file mutation |

A Bash grant must name its allowed command families in the agent file (e.g., "run the project's test command", "run read-only security checks") — an unqualified `Bash` line is a finding in workflow audits.

### 4.7 Background Agents & Automations

**Cursor Automations** (Feb/Mar 2026): Event-driven background agents. Cloud sandbox execution with MCP access and cross-run memory. Triggers: GitHub webhooks, cron schedules, codebase changes.

Use cases: automated PR review on push, scheduled security scanning, dependency monitoring, test execution. Security teams report catching 200+ vulnerabilities/week across 3,000+ PRs.

**Limitations**: Work best with well-structured, modern codebases. Legacy monoliths with inconsistent conventions need more manual steering.

**Cloud Agents with Computer Use**: Virtual machines with browser access, ability to visually verify work. Screen recordings attached to PRs.

**Self-Hosted Cloud Agents**: Keep code and execution in your own network.

### 4.8 Agent Benchmarks (March 2026)

**SWE-bench Verified** (500 real GitHub issues):
| Model | Score |
|-------|-------|
| Claude Opus 4.5 | 80.9% |
| Claude Opus 4.6 | 80.8% |
| Gemini 3.1 Pro | 80.6% |
| MiniMax M2.5 (open-weight) | 80.2% |
| GPT-5.2 | 80.0% |
| Claude Sonnet 4.6 | 79.6% |

**Key**: All within 1.3%. The harness drives remaining variance, not the model.

**SWE-bench Pro** (harder): GPT-5.3 Codex: 56.8%, Gemini 3.1 Pro: 54.2%, Opus 4.5: 45.89%.

**Model-class update (2026-06-09)**: the table above predates the **Mythos-class tier** — Anthropic's new class *above* Opus. **Claude Fable 5** (`claude-fable-5`) is the first generally available Mythos-class model: state-of-the-art on nearly all tested capability benchmarks, with the lead growing on longer/more complex tasks; $10/M in + $50/M out (≈2× Opus-class); 1M context; cyber/bio-chem/distillation requests answered via **Opus 4.8 fallback** (<5% of sessions, user informed, billed at Opus prices). Sibling **Mythos 5** = same weights, safeguards lifted, restricted access (Project Glasswing / trusted-access programs). Agent-harness implication: "newest Opus = default" rubrics need an explicit Fable gate — see `CLAUDE-SURFACE-ROUTING.md` §1a/§1b. **NOTE (updated 2026-07-10): Fable 5 restored 2026-07-01 behind a new safety classifier (Mythos 5 remains Glasswing-restricted); since 2026-07-07 Fable is usage-credits-only — not included in subscription limits. Claude Sonnet 5 GA'd 2026-06-30 (native 1M context, $2/$10 promotional through 2026-08-31, Claude Code CLI default since v2.1.197).** Re-run benchmark comparisons when post-restore Fable and Sonnet-5 SWE-bench rows publish.

### 4.9 Production Agent Implementation Patterns

Patterns distilled from production AI CLI agents. Language-agnostic — applicable to any
agent framework.

#### Tool Factory Pattern

Every tool follows a standardized contract:

| Property | Purpose | Default |
|----------|---------|---------|
| `name` | Unique identifier (+ optional aliases for backward compat) | Required |
| `inputSchema` | Validated schema (Zod, JSON Schema, Pydantic) | Required |
| `call()` | Execution logic: receives validated input + context, returns result | Required |
| `checkPermissions()` | Returns grant/deny/prompt decision before execution | Grant all |
| `isReadOnly()` | Declares whether the tool modifies state | `false` (assume writes) |
| `isConcurrencySafe()` | Declares whether parallel invocations are safe | `false` (assume unsafe) |
| `prompt()` | Generates tool description for system prompt injection | Required |

**Fail-closed defaults**: Both `isReadOnly` and `isConcurrencySafe` default to the
restrictive option. Tools must explicitly opt in to being read-only or parallelizable.

#### Tool Directory Structure

Each tool is a self-contained module:

```
tools/
  ToolName/
    ToolName.ts    # Definition (schema, call, permissions)
    prompt.ts      # System prompt description for this tool
    utils.ts       # Tool-specific helpers
    index.ts       # Re-export
```

**Benefits**: Independently testable, discoverable via filesystem, replaceable without
touching other tools. Prompt descriptions colocated with implementation.

#### Rich Tool Context

Tools receive a context object at call time — never access globals directly:

- **Abort controller**: Cancellation of long-running tool calls
- **File state cache**: LRU of recently read files (prevents redundant reads within session)
- **App state**: Read/write access to session-scoped mutable state
- **Progress callback**: Report incremental progress to UI (streaming output)
- **Available tools**: List of other tools (for tools that delegate, like Agent tool)
- **MCP clients**: Connected MCP servers for protocol-level operations

**Why context, not globals**: Enables testing with mock context, enforces security boundaries,
makes all dependencies explicit, supports concurrent sessions.

#### Query Engine State Machine

The core agent loop:

```
1. User message → API call (system prompt + message history)
2. API returns text and/or tool_use blocks
3. For each tool_use:
   a. Validate input against schema
   b. Check permissions (grant/deny/prompt user)
   c. Execute tool, collect result
   d. Feed tool_result as next message
4. Goto 2 (API sees tool results, may request more tools)
5. When API returns end_turn (no tool_use) → turn complete
```

**Key mechanisms**:
- **Auto-compact**: When conversation approaches context limit, summarize older messages
  while preserving recent context and tool results
- **Token tracking**: Per-turn cost tracking with budget enforcement (max spend per session)
- **Retry with backoff**: Classify API errors as retryable (rate limit, overload) vs fatal
  (auth, invalid request). Exponential backoff for retryable errors
- **Result size management**: Tool results exceeding size limits → persist to disk, replace
  with preview + file path reference in conversation

#### File State Cache

LRU cache tracking all file reads/writes within a session:

- **Normalized paths**: Handles relative/absolute, mixed separators
- **Partial view tracking**: Marks files read with offset/limit as incomplete (forces
  explicit full-read before allowing edits)
- **Change detection**: Diff cached content vs disk to detect external modifications
- **Configurable limits**: Default ~100 entries, 25MB cap

**Production rule**: Never allow editing a file that hasn't been fully read in the current
session. Partial reads (auto-injected context like CLAUDE.md) don't count.

#### Command System Types

Three archetypes for slash commands:

| Type | Behavior | LLM Involved | Example |
|------|----------|-------------|---------|
| **PromptCommand** | Sends prompt to LLM with scoped `allowedTools` | Yes | `/review-pr` |
| **LocalCommand** | Runs in-process, returns text | No | `/cost`, `/version` |
| **LocalJSXCommand** | Renders interactive UI component | No | `/doctor`, `/compact` |

**Critical pattern**: `allowedTools` scoping on PromptCommands. Each command defines exactly
which tools the LLM can invoke during execution. `/review-pr` allows only read tools +
git commands. `/deploy` allows shell execution. This implements principle of least privilege
per workflow (see §8.6 for permission architecture).

#### Skill System Architecture

Skills = reusable workflow bundles with prompts + tool configs:

- **Name + trigger description**: Model can auto-invoke when trigger matches user intent
- **allowedTools**: Scoped tool access (same pattern as commands)
- **disableModelInvocation**: If true, user must explicitly invoke (not auto-triggered)
- **Progressive disclosure**: Skill provides entry prompt; sub-files loaded only if needed

**Production skill patterns**:
- **Parallel fan-out**: Skill spawns multiple sub-agents reviewing different aspects
  simultaneously, aggregates results (e.g., code review with 3 lenses)
- **Progressive investigation**: Skill enables logging/diagnostics first, then guides
  step-by-step investigation based on findings
- **Tool-scoped execution**: Each skill restricts tools to its domain — a review skill
  gets only read access, a deploy skill gets shell access

---

## 5. Project Organization

### 5.1 File Structures AI Agents Navigate Well

```
src/
  app/           # Routes / pages
  components/    # Shared components
  lib/           # Utility functions and clients
  hooks/         # Custom hooks
  types/         # TypeScript type definitions
  services/      # Business logic
  db/            # Database schema and migrations
docs/
  architecture/  # ADRs and system design
tests/
  e2e/           # End-to-end tests
```

**Principles**:
- **Colocation**: Tests next to source (`user.ts` + `user.test.ts`) gives agents immediate context
- **Explicit naming**: `getUserById.ts` > `utils.ts` for AI retrieval
- **Index files**: Barrel exports help agents discover available functionality
- **Flat within reason**: 5+ levels of nesting makes paths verbose and error-prone

### 5.2 TypeScript Patterns That Improve AI Output

- **`strict: true`** in tsconfig — eliminates implicit `any`
- **Explicit return types** on exported functions — AI verifies output matches
- **Interface-first design** — define interfaces before implementations
- **Barrel exports** — agents discover available modules
- **Zod schemas alongside types** — runtime validation + type info

```typescript
export interface CreateUserInput {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user']),
});

export async function createUser(input: CreateUserInput): Promise<User> {
  // AI knows input shape, output shape, and validation rules
}
```

### 5.3 Documentation That Serves AI

**JSDoc on all exported functions**: AI reads these to understand purpose without reading implementation.

**ADRs in `docs/architecture/`**: Numbered markdown files. AI references when making design decisions.

**Directory READMEs**: Brief explanation of purpose, key files, conventions. Dramatically improves @folder retrieval quality.

### 5.4 Monorepo Patterns

**Workspace-scoped rules**: Glob patterns targeting specific packages.

**Package-level CLAUDE.md**: Per-package conventions with project-wide root.

**Shared types package**: Single source of truth prevents duplicate type definitions.

**Cross-package rules**:
```
- apps/ can import from packages/ but NEVER from other apps/
- packages/ui can import from packages/config only
- packages/db must not import from any app or other package
- Use workspace imports: @myapp/ui — never relative cross-package paths
- When generating code in apps/web, NEVER import from apps/api
```

Cursor walks up from file applying innermost `.cursorrules` plus root. Claude Code merges sub-directory CLAUDE.md. GitHub Copilot, Windsurf, Cline support root-level only.

### 5.5 Config Files AI Leverages

- **tsconfig.json**: Path aliases, strict mode, target output
- **ESLint/Biome**: Convention enforcement (Biome preferred for auto-fix capability)
- **.env.example**: Tells AI what env vars exist without exposing values
- **Prettier/formatter config**: Agent runs formatter rather than formatting itself (more reliable)

---

## 6. Quality & Accuracy Maximization

### 6.1 The Grounding Pipeline

Add to rules — run after every code change:

```
After every code change:
1. Save all modified files
2. Run `pnpm typecheck` — fix ALL type errors
3. Run `pnpm lint:fix` — auto-fix lint issues
4. Run affected tests — fix any failures
5. Only report completion when all checks pass
```

### 6.2 Anti-Hallucination Rules

**Read-before-edit** (most effective single technique):
```
ALWAYS read a file's current content before making changes.
NEVER edit a file based on assumptions about its content.
```

**No-assumption rule**:
```
NO ASSUMPTIONS — Only use: files you've read, user messages, and tool results.
If information is missing, search the codebase, then ask the user.
NEVER guess at import paths, API signatures, or function parameters.
```

**Type-checking as guardrail**: TypeScript strict mode catches hallucinated interfaces, missing properties, wrong signatures immediately.

### 6.3 Test-Driven AI Development

**Pattern**: Write tests first, let AI implement to pass them.

**Why**: Tests serve as unambiguous specifications. AI can verify its own output. Edge cases defined upfront. Implementation grounded in concrete expectations.

**Workflow**: Human writes tests → AI implements → Human reviews → AI adjusts.

**Best for**: Greenfield functions with clear I/O contracts. Less effective for UI, integration points, or refactoring.

### 6.4 Code Review Patterns

**Patterns that catch real bugs**:
- "Review for SQL injection, XSS, CSRF, and auth bypass"
- "Walk through each conditional branch and verify edge cases"
- "Identify N+1 queries, unnecessary re-renders, O(n²) operations"

**Patterns that produce noise**:
- Generic "review this code"
- Style reviews (let linter handle)
- Reviews without full file context

**Best practice**: Dedicated review agent with full file context, not just diffs. Point at specific concern areas.

### 6.5 Validation Strategy

1. **Automated checks**: Type check + lint + tests (grounding pipeline)
2. **Diff review**: Read every line — AI makes subtle errors passing automated checks
3. **Behavioral testing**: Run app, test changed functionality manually
4. **Boundary testing**: Edge cases, null inputs, error paths
5. **Integration testing**: Verify with rest of system

**"Prove it works" pattern**: Ask agent to diff against main, run tests, demonstrate functionality. Adversarial check catches issues agent wouldn't surface proactively.

### 6.6 Feedback Loop Configuration

An agent with feedback loops self-corrects; one without ships its first draft. Configure at the project level:

1. **PostToolUse hooks** (mechanical): auto-format after Write/Edit, budget checks after edits
2. **Slash command suffixes**: every implementation command ends with "run build + lint + test"
3. **Spec compliance**: agent re-reads requirements and scores PASS/MISS before declaring done
4. **Visual verification**: preview server screenshot or accessibility snapshot for UI changes

When writing prompts for agents, ALWAYS specify the verification chain. See `WORKFLOW-CLAUDE-CODE.md` §15 for details.

---

## 7. Agent Evaluation & Quality Metrics

### 7.1 The Foundational Studies Disagree

**METR RCT** (July 2025, arXiv: 2507.09089): 16 experienced OSS developers, 246 tasks, Cursor Pro with Claude 3.5/3.7 Sonnet.
- Result: AI **increased completion time by 19%** (95% CI: [-40%, -2%])
- Before study: developers predicted 24% speedup
- After study (being objectively slower): still believed 20% faster
- **Perception gap exceeded 40 percentage points**

**MIT/Harvard/Microsoft field experiments**: 4,867 developers at three companies.
- **26.08% increase in completed tasks**
- Short-tenure: 27-39% gains; Junior: 21-40%; Senior: modest 7-16%

**GitHub Copilot trial**: 95 Upwork professionals — **55.8% faster**.

**These aren't contradictory**: METR tested experienced devs on **their own mature codebases**. Productivity studies tested on **newer/less familiar** codebases.

**CMU longitudinal resolution**: Cursor adoption produces **3-5x velocity spikes in month one**, then gains dissipate while **static analysis warnings increase 30%** and **code complexity rises 41%** permanently.

### 7.2 A Practical Quality Dashboard

```python
class CanaryTaskSuite:
    """
    Tasks that graduated from capability evals to regression suite.
    Maintain ~100% pass rate. Any decline signals breakage.
    """
    def run_eval(self, agent_config):
        results = {
            'compile_rate': 0,        # % generated code that compiles
            'test_pass_rate': 0,      # % unit tests passing
            'lint_clean_rate': 0,     # % files with zero lint violations
            'pattern_conformance': 0, # % matching team conventions
            'hallucination_rate': 0,  # % fabricated imports/APIs
        }
        # ... run tasks, normalize, detect regression
        # Flag if any metric drops >5% from rolling 7-day average

    def detect_regression(self, current):
        baseline = self.rolling_average(window=7)
        return [
            metric for metric, value in current.items()
            if value < baseline[metric] * 0.95
        ]
```

Anthropic's key pattern: **capability evals with high pass rates "graduate" to regression suites** run continuously.

### 7.3 Developer Satisfaction

**SPACE framework** (Forsgren et al., 2021) adapted for AI tools.

BNY Mellon study (2,989 respondents): High satisfaction, modest time savings. Stack Overflow 2025: 80% adoption, but trust in accuracy **fell from 40% to 29%**, and 66% spend more time fixing "almost-right" code.

DX Research (121,000 developers): AI-authored code = 26.9% of production. Measured productivity gains haven't moved past ~10%. Bright spot: **onboarding time (to 10th PR) cut in half**.

### 7.4 The Cost-Quality Pareto Frontier

DataRobot's **syftr** framework (Bayesian optimization): Non-agentic workflows frequently dominate the Pareto frontier — faster and cheaper. The workflow at the "knee point" loses a few percentage points in accuracy while being **10x cheaper**.

Aider polyglot benchmark: GPT-5 achieves 88.0% at $29.08/run; o3-pro reaches 84.9% at **$146.32/run** — 5x cost for 3.1 fewer points.

### 7.5 ROI Measurement Framework

| Metric | How | Notes |
|--------|-----|-------|
| Time to PR merge | Track before/after AI adoption | End-to-end productivity |
| Code review cycle time | First-review turnaround | Should decrease |
| Test coverage delta | Meaningful coverage increase | Not just lines |
| Bug escape rate | Bugs reaching production | Should decrease |
| Developer satisfaction | Survey (SPACE framework) | Subjective but important |
| Cost per resolved issue | API + compute + review time | For agent-based systems |

**Pitfall**: Measuring lines generated or "AI-assisted %" without quality assessment. More AI code is not better — what matters is shipping higher-quality software faster.

---

## 8. Security & Governance

### 8.1 MCP Attack Surface

**Confirmed attacks**:
- **CVE-2025-6514**: mcp-remote npm (437K+ downloads) — command injection
- **CVE-2025-68143/44/45**: Anthropic's own mcp-server-git — unrestricted git_init (CVSS 8.8)
- **SANDWORM_MODE** (Feb 2026): 19 typosquatting npm packages injecting rogue MCP configs into Claude Code, Cursor, VS Code Continue, Windsurf. Harvested API keys and SSH keys, dormant 48-96h, self-propagated via Git hooks.

**AgentSeal scan of 1,808 servers**: 66% had findings (8,282 tool-level issues). Equixly: 43% contained command injection.

### 8.2 Docker Sandboxing

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
  mcp-untrusted: { driver: bridge, internal: true }
```

Hardened additions: read-only root filesystem, `--cap-drop ALL`, seccomp/AppArmor profiles, per-service budgets.

### 8.3 OWASP MCP Security Minimum Bar

FAIL in categories 1-2 blocks deployment:

1. **Strong Identity/Auth**: OAuth 2.1 + PKCE, resource indicators (RFC 8707), progressive scope
2. **Strict Isolation**: Per-server containerization, no cross-server trust propagation
3. **Trusted Tooling**: Pin versions, verify checksums, scan with snyk-agent-scan
4. **Schema Validation**: Input/output sanitization on all tool calls
5. **Hardened Deployment**: Network isolation, egress controls, audit logging

### 8.4 Security Best Practices for Teams

1. **Least privilege**: Read-only database connections by default
2. **Directory restrictions**: Filesystem MCP — explicitly list allowed dirs. Never `/` or home root
3. **Credential management**: Env vars, not committed configs
4. **Sandboxing**: Docker containers for servers with write access
5. **Audit**: Review data access. GitHub MCP with full repo access can read secrets
6. **Version pinning**: No auto-update without review (prevents rug pulls)
7. **Supply chain**: Verify npm package names, check for typosquatting

### 8.5 Compliance Considerations

**Data residency**: Models process at hosted location. EU data → EU-region processing.

**PII handling**: Never include in training data or caches without consent. Implement automatic PII detection and masking.

**EU AI Act** (2026): Coding assistants likely "limited risk" — transparency required. Agents with autonomous decisions may face additional requirements.

**Audit trails**: Every LLM call, tool invocation, and agent decision logged. Both compliance requirement and operational necessity.

**Model-retention gate (2026-06)**: a model *class* can carry **mandatory retention that voids zero-retention (ZDR) DPAs**. Mythos-class (Fable 5 / Mythos 5) shipped with 30-day mandatory retention, no opt-out, on all traffic — overriding existing zero-retention contracts. Treat any class with mandatory retention as a **procurement-review trigger** for regulated / ZDR-bound workloads before adoption. Field evidence: Microsoft restricted internal employee use over exactly this; Forrester flagged it as voiding prior zero-retention commitments ([forrester.com](https://www.forrester.com/blogs/how-fable-5-and-mythos-5-change-ai-security-data-retention-and-vendor-risk/)). Routing impact: `CLAUDE-SURFACE-ROUTING.md` §1a.

### 8.6 Agent Permission Architecture

How production agents gate tool invocations. Applies to any agent system where tools can
modify state (files, databases, shell commands, deployments).

#### Permission Mode Spectrum

| Mode | Behavior | Use Case |
|------|----------|----------|
| **default** | Prompt user for every non-read operation | Interactive exploration, unfamiliar codebase |
| **acceptEdits** | Auto-allow file edits, prompt for shell/destructive | Trusted editing sessions |
| **plan** | Show full plan, ask once before execution batch | Complex multi-step tasks |
| **auto** | ML classifier decides per-operation | Experienced users, CI pipelines |
| **bypassPermissions** | Allow everything without prompting | Sandboxed environments only (Docker) |

**Production default**: Start at `default`, let users escalate. Never default to `bypass`
outside sandboxed containers.

#### Wildcard Permission Rules

Pattern syntax: `ToolName(pattern)` with glob-style matching:

```
Bash(git *)            # Allow all git commands
Bash(npm test:*)       # Allow test scripts only
FileEdit(/src/*)       # Allow edits within src/
FileRead(*)            # Allow reading any file
WebFetch(https://*)    # Allow HTTPS fetches only
```

**Three rule behaviors**:
- `alwaysAllow`: Auto-grant without prompting
- `alwaysDeny`: Reject without prompting (overrides allow)
- `alwaysAsk`: Always prompt regardless of mode

**Precedence**: User-level deny > project-level deny > user-level allow > project-level
allow > mode default. Project-level rules cannot override user-level deny rules (principle
of user sovereignty).

#### Tool-Level Permission Flow

For each tool invocation:

1. **Validate input** — Reject malformed input before permission check
2. **Tool-specific check** — `checkPermissions()` runs tool-specific logic (e.g., BashTool
   checks command against dangerous patterns like `rm -rf /`)
3. **Apply wildcard rules** — Match against alwaysAllow/alwaysDeny/alwaysAsk lists
4. **Apply mode default** — If no rule matched, behavior depends on current permission mode
5. **Prompt if needed** — Present tool name, input summary, and risk assessment to user

**Deny always wins**: If any rule at any level denies, the tool call is blocked regardless
of other allow rules.

#### Progressive Trust Model

Track agent behavior to adjust trust dynamically:

- **Consecutive denials** (threshold: ~3): Agent keeps requesting denied operations →
  fall back to explicit prompting even in `auto` mode
- **Total denials** (threshold: ~20): Too many denials in a session → likely the agent
  is stuck or confused. Surface warning to user
- **Session-scoped**: Trust resets with each new session. No cross-session trust persistence
- **Background agents**: Agents without UI access (CI, background tasks) auto-deny any
  operation that would require user prompting

#### Permission Audit Patterns

- **Log every decision**: Tool name, input summary, decision (grant/deny/prompt), source
  (rule match or mode default), timestamp
- **Track denial reasons**: Use for workflow optimization — frequent denials indicate
  missing allow rules or agent behavior issues
- **Pre-tool hooks**: Shell hooks that run before tool execution for automated checks
  (e.g., lint before file write, test after code change)
- **Team baselines**: Project-level settings file (`.claude/settings.json` or equivalent)
  for team-wide permission defaults. Committed to repo, applied to all team members

---

## 9. Domain-Specific Context Patterns

### 9.1 Frontend (Next.js/React) — Gold Standard

```markdown
# .cursor/rules/nextjs-patterns.mdc
---
description: Next.js App Router conventions
globs: **/*.tsx, **/*.ts
---
- Use App Router with `page.tsx` in route directories
- Client components MUST be 'use client' — justify every usage
- Server Components (RSC) by default
- Small client wrappers around interactive elements
- kebab-case directories, PascalCase components
- Named exports only — no defaults
- Server Actions for forms, not client-side fetch
- Always create error.tsx alongside every page.tsx
- error.tsx: client component with {error, reset} props
```

The word "alongside" in error boundary rule was specifically tested — "use error boundaries" produced nothing; precise instruction generated correct handling every time.

### 9.2 Backend API (FastAPI/Express)

```markdown
# .cursor/rules/api-patterns.mdc
---
description: FastAPI conventions and safety
globs: **/*.py
---
- Pydantic v2 models for ALL request/response validation
- RORO pattern: Receive an Object, Return an Object
- Error handling at function start, early returns; happy path last
- FastAPI dependency injection for DB connections and auth
- NEVER log sensitive data (passwords, tokens, card numbers)
- Parameterized queries exclusively — no string interpolation in SQL
- Async by default; sync only for blocking I/O
- Validate at function boundaries, not inline
```

### 9.3 Full-Stack Monorepo — Import Boundaries

```markdown
# Root .cursorrules — workspace-wide
## Import Boundaries (ENFORCED)
- apps/ can import from packages/ but NEVER from other apps/
- packages/ui can import from packages/config only
- packages/db must not import from any app or other package
- Use workspace imports: @myapp/ui — never relative cross-package
- When in apps/web, NEVER import from apps/api
- When in packages/db, NEVER import React
```

### 9.4 Infrastructure (Terraform)

```markdown
# .cursor/rules/terraform-safety.mdc
---
description: IaC safety for Terraform
globs: **/*.tf, **/*.tfvars
---
- Always use modules from registry.terraform.io
- Never hardcode credentials — use Vault
- Tag EVERY resource: 'owner', 'env', 'managed_by=terraform'
- Least-privilege IAM — no wildcard (*) actions
- Remote backend (S3/GCS) with state locking + encryption
- ALWAYS terraform plan before ANY apply
- Lock provider versions: required_providers mandatory
- Destructive changes: lifecycle { prevent_destroy = true } first
- K8s: prefer Deployments + Services, avoid naked Pods
- Never modify .tfstate directly
```

### 9.5 Legacy Codebases — Constraints First

```markdown
# CLAUDE.md for legacy modernization
## CONSTRAINTS — READ FIRST
- Tech stack: Python 3.9, Django 3.2, PostgreSQL 13 — Do NOT suggest upgrades
- Do NOT refactor callbacks to async/await unless explicitly asked
- Do NOT suggest Python 3.12+ syntax (match statements)
- NEVER modify migration files directly
- Before changing ANY function, check usages in /src/api/ first

## Business Logic
- "Wraps" module generates annual summaries — do not rename
- Tax in /src/billing/tax.py uses region-specific rules; assume US
- process_order MUST remain synchronous — downstream depends on blocking
```

### 9.6 Data/ML — The Underdeveloped Frontier

Worst rule coverage. Cursor struggles with `.ipynb` natively. Workaround: `.py` files with `# %%` cell markers. `cursor-notebook-mcp` server exists. Cursor 1.0 improved notebook editing (Claude Sonnet only).

No dedicated experiment tracking, MLOps pipeline, or model versioning rules found in any community repository. **Genuine opportunity for teams to pioneer patterns.**

---

## 10. Cross-Session Handoff

### 10.1 The HANDOFF.md Protocol

Multiple independent implementations converged on near-identical template. Critical elements:

- **Failed approaches are mandatory** (saves hours of re-exploration)
- **Code signatures beat descriptions** ("created a hook" is useless)
- **Test steps need expected outcomes** (not just "run tests")

Template: See KB-01, Section 3.6 for complete structure.

### 10.2 Cross-Tool Handoff (Cursor ↔ Claude Code)

Both operate on same filesystem. **Git is the universal handoff layer.**

**Claude Code strengths**: Parallel exploration, multi-file autonomous changes, long debugging, documentation.

**Cursor strengths**: Inline autocomplete (Cmd+K), visual diff review, tight feedback loops.

**Pattern**: Plan and explore in Claude Code's terminal. Implement and refine in Cursor's editor. HANDOFF.md and CLAUDE.md serve as cross-tool state layer.

**Git worktrees**: Enable parallel agent execution. Cursor auto-creates worktrees for background agents. Claude Code `--remote` creates independent cloud sessions.

### 10.3 Contextual Commits as Institutional Memory

Five structured action types in git history:
```
feat(scope): what was done
intent(scope): why it was done
decision(scope): what was chosen
rejected(scope): what was NOT chosen and why
constraint(scope): what limits apply
learned(scope): what was discovered
```

`/recall` queries git history for these by scope, giving new agents access to every prior decision.

### 10.4 Session Memory (Claude Code v2.0.64+)

Automatic background summaries to `~/.claude/projects/<hash>/`. On start, automatically recalled. `/remember` promotes to permanent CLAUDE.md.

---

## 11. Team Workflows

### 11.1 Sharing AI Configuration

1. **Version control**: Commit `.cursor/rules/`, `AGENTS.md`, `CLAUDE.md`, `.cursor/mcp.json`
2. **Personal overrides**: `.cursor/rules/personal.mdc` in `.gitignore`
3. **Auto-onboarding**: New members get team AI config on clone
4. **Review process**: PRs modifying AI context reviewed by team
5. **Team Marketplace** (Cursor 2026): Share skills, agents, automations

### 11.2 Context File Review Checklist

For PRs modifying AI context:
- Does the instruction apply to >80% of sessions? If not, glob-scope it
- Is it specific and testable? ("Use Zustand" vs "use appropriate state management")
- Conflicts with existing rules?
- Token budget reasonable? Check total alwaysApply line count
- Code examples current?

### 11.3 The Onboarding Pattern

Well-maintained AGENTS.md + CLAUDE.md serves as onboarding for both humans and AI agents. New developer cloning the repo gets the same AI quality as a veteran because context files encode accumulated team knowledge.

### 11.4 Handling Disagreements

Personal preferences → personal override file (gitignored). Project rules define team standard. Mirrors: shared ESLint config + personal editor preferences.

### 11.5 The "AI Workflow Lead" Role

Emerging role similar to how "DevOps engineer" emerged as specialization. Focuses on:
- Context engineering (rules, skills, agents optimization)
- Prompt and tool configuration
- Cost monitoring and model routing decisions
- Workflow optimization for the team
- Maintaining evaluation infrastructure

### 11.6 GitHub Action for Compounding Engineering

Install Claude Code GitHub Action (`/install-github-action`) to enable @claude tagging on PRs. This creates a CI-integrated learning loop: every PR review finding is a candidate for a new CLAUDE.md rule or `.claude/rules/` entry.

**Pattern**: Human reviewer focuses on architecture and business logic. @claude catches mechanical issues (style, security patterns, test coverage). Findings that recur across PRs get promoted to permanent rules → codebase gets smarter from every review.

### 11.7 Organizational Adoption Reality

84% adoption rate masks bimodal distribution. Some developers >50% AI workflow; others minimal. Gap correlates with **dedicated time to learn effective workflows**, not seniority or skill level.

---

## 12. The Complete Blueprint

### Copy-Ready Directory Structure

```
project-root/
├── .cursor/
│   ├── rules/
│   │   ├── base.mdc              # Always-apply core conventions
│   │   ├── frontend.mdc          # Glob: src/components/**, src/app/**
│   │   ├── api.mdc               # Glob: src/app/api/**
│   │   ├── testing.mdc           # Glob: **/*.test.ts, **/*.spec.ts
│   │   ├── database.mdc          # Glob: src/db/**, prisma/**
│   │   └── personal.mdc          # .gitignored personal preferences
│   ├── skills/
│   │   ├── deployment/
│   │   │   ├── SKILL.md
│   │   │   └── scripts/
│   │   └── migration/
│   │       ├── SKILL.md
│   │       └── references/
│   ├── agents/
│   │   ├── reviewer.md           # Code review subagent
│   │   ├── tester.md             # Testing subagent
│   │   └── security.md           # Security audit subagent
│   └── mcp.json                  # MCP server configuration
├── .claude/
│   ├── commands/
│   │   ├── review-pr.md          # PR review workflow
│   │   ├── deploy-staging.md     # Staging deployment
│   │   └── tech-debt.md          # Tech debt audit
│   └── rules/
│       └── migration.md          # Temporary migration rules
├── AGENTS.md                      # Cross-IDE standard
├── CLAUDE.md                      # Claude Code memory
├── .gitignore                     # Includes .cursor/rules/personal.mdc
└── src/
```

### Example: base.mdc

```yaml
---
alwaysApply: true
description: "Core project conventions for every interaction"
---
# EXECUTION PROTOCOL
1. SEARCH FIRST — grep/search for existing patterns before implementing
2. REUSE FIRST — extend existing code before creating new
3. NO ASSUMPTIONS — only use files read, user messages, tool results
4. VERIFY — run typecheck and lint after every change

# CORE CONVENTIONS
- TypeScript strict mode — NEVER use `any`
- Named exports only — NEVER default exports
- pnpm — NEVER npm or yarn
- ES modules — NEVER CommonJS require()

# COMMANDS
- Dev: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm lint:fix`
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
```

### Example: CLAUDE.md

```markdown
# Project: [Name]
[Tech stack in one line]

## Commands
- `pnpm dev` — dev server on port 3000
- `pnpm test` — unit tests
- `pnpm typecheck` — TypeScript checks
- `pnpm db:migrate` — run migrations

## Architecture
- App Router with RSC
- API routes: src/app/api/ (thin → services)
- Business logic: src/services/ (never in components)
- DB queries: src/db/queries/ (ORM, never raw SQL)

## Key Pitfalls
- [Webhook must verify signatures]
- [Prices in cents — convert for display only]
- [Auth middleware runs on all /api except webhooks]
```

### Example: Custom Agent

```yaml
---
name: code-reviewer
description: "Reviews diffs for bugs, security, design. Invoke for PRs."
tools: [Read, Bash, WebFetch]
model: sonnet
---
# Role
Senior code reviewer for TypeScript/Next.js.

# Protocol
1. Read full diff: `git diff main...HEAD`
2. For each file, read surrounding context (not just diff)
3. Check: logic errors, security vulns, perf issues, type safety
4. Verify imports exist
5. Check error handling coverage
6. Verify tests for new functionality

# Output
- **File**: [path]
- **Line**: [number]
- **Severity**: Critical / Warning / Suggestion
- **Issue**: [description]
- **Fix**: [suggestion]

# Constraints
- NEVER approve unhandled promise rejections
- NEVER approve code logging sensitive data
- ALWAYS flag raw SQL (should use ORM)
- Zero issues found? Say so — don't invent problems
```

### Example: MCP Configuration

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": { "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}" }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./src", "./docs"]
    }
  }
}
```

---

## 13. Obsolete vs Current Patterns

| Obsolete | Current | When Changed |
|----------|---------|-------------|
| Single `.cursorrules` file | `.cursor/rules/*.mdc` multi-file | 2025 |
| Manual context inclusion only | Tiered auto-loading + skills | v2.4, early 2026 |
| One agent per session | Parallel subagents (up to 10) | 2026 |
| No persistent memory | Auto-memory + `/memory` commands | Claude Code v2.0, Jan 2026 |
| Generic "review this code" | Specialized agents with scoped tools | 2025-2026 |
| Everything in CLAUDE.md | Progressive: CLAUDE.md + rules + skills | 2026 |
| Cursor editor-only | JetBrains (ACP), web, mobile, Slack | Mar 2026 |
| No background automation | Cursor Automations: event-driven agents on webhooks/cron/changes with cloud sandboxes | Feb/Mar 2026 |
| Copy-paste AI ↔ tools | MCP server integration | 2025-2026 |
| MCP theoretical | 1,200+ servers, native config | 2025-2026 |
| "Vibe coding" | Structured approaches produce 1.7x fewer defects | 2025-2026 |

---

## 14. Anti-Patterns Checklist

Use as audit checklist. Any checked item needs fixing.

- [ ] CLAUDE.md exceeds 200 lines
- [ ] Single alwaysApply rule exceeds 500 tokens
- [ ] Framework-specific rules in alwaysApply instead of glob-scoped
- [ ] No "search first" rule in base conventions
- [ ] No verification step (typecheck/lint/test) in agent prompts
- [ ] Agent reads assumptions instead of files before editing
- [ ] Multiple AI tools with no AGENTS.md interop file
- [ ] MCP servers with write access unsandboxed
- [ ] MCP server versions not pinned
- [ ] No cost monitoring on agentic usage
- [ ] Context files not version-controlled
- [ ] Skills used for declarative conventions (should be rules)
- [ ] Rules used for procedural knowledge (should be skills)
- [ ] 15+ specialized agents on a small project
- [ ] Background agents with no human review gate
- [ ] Using "think step by step" with reasoning models
- [ ] Long sessions without starting fresh
- [ ] Hedging language in rules ("consider", "when possible")
- [ ] No evaluation dataset for prompt quality
- [ ] Trusting AI output without tool verification

---

## 15. Evaluation & ROI

### 15.1 What to Measure

| Metric | What It Tells You | How to Track |
|--------|-------------------|-------------|
| First-pass compile rate | Generation accuracy | CI step |
| Test pass rate | Functional correctness | Test runner |
| Package hallucination rate | Grounding quality | Import checker |
| Static analysis delta | Quality impact | SonarQube/ESLint |
| AI modification rate | Human edit burden | Lines changed / generated |
| Pattern conformance | Rule effectiveness | Custom linter rules |
| Time to PR merge | Productivity impact | Git analytics |
| Cost per resolved issue | Economic efficiency | ccusage + time tracking |

### 15.2 What the Data Says

- **26% increase in completed tasks** (MIT/Harvard/Microsoft, 4,867 devs)
- **55.8% faster** task completion (GitHub Copilot, 95 professionals)
- **19% slower** for experienced devs on mature codebases (METR RCT, 16 devs)
- **3-5x velocity spike month one**, then baseline with permanent quality degradation (CMU longitudinal)
- **Onboarding time halved** (time to 10th PR — DX Research, 121K devs)
- **1.7x fewer defects** with structured AI development (CodeRabbit, 470 PRs)
- **~40% fewer manual corrections** with well-crafted CLAUDE.md (SFEIR Institute)

### 15.3 The Investment Framework

**Week 1**: Set up base.mdc + CLAUDE.md + AGENTS.md. Install 2-3 MCP servers. Every correction becomes a rule.

**Week 2-4**: Add glob-scoped rules for each domain area. Create first skills for repeated procedures. Set up cost monitoring.

**Month 2-3**: Add specialized agents for review, testing, security. Set up evaluation dataset and canary tasks. Monitor quality metrics.

**Ongoing**: Monthly context file review. Update rules when framework versions change. Track metrics. Promote learnings from auto-memory to permanent rules.

**The most actionable finding across all research**: **Invest in evaluation infrastructure before expanding AI usage.** Teams that track compile rates, maintain canary suites, and monitor cost-per-task extract compounding value. Teams that adopt without measurement hit the CMU pattern — transient velocity spike followed by persistent quality degradation that nobody notices because everyone _feels_ more productive.

---

*Compiled March 2026. Synthesized from 4 research documents (~4,200 lines). For the underlying science and techniques, see KB-01-AI-WORKFLOW-ENGINEERING.md. Together, these documents form the complete knowledge base for AI-first development.*
