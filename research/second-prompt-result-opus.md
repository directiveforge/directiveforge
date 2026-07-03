# AI-First Development: Context, Memory & Agent Engineering — State of the Art (March 2026)

## Table of Contents

- [Executive Summary](#executive-summary)
- [Gold Tier: The 15–20 Most Impactful Practices](#gold-tier-the-1520-most-impactful-practices)
- [Section 1: Context Architecture for AI IDEs](#section-1-context-architecture-for-ai-ides)
  - [1.1 File-Level Context Systems](#11-file-level-context-systems)
  - [1.2 Tiered Context Loading](#12-tiered-context-loading)
  - [1.3 Rule Effectiveness](#13-rule-effectiveness)
  - [1.4 Skills vs Rules vs Agents](#14-skills-vs-rules-vs-agents)
  - [1.5 Scope Levels](#15-scope-levels)
  - [1.6 Token Budget Reality](#16-token-budget-reality)
  - [1.7 Cross-IDE Compatibility](#17-cross-ide-compatibility)
  - [1.8 Real Examples from Open-Source Repos](#18-real-examples-from-open-source-repos)
- [Section 2: MCP Ecosystem — Practical Usage Guide](#section-2-mcp-ecosystem--practical-usage-guide)
  - [2.1 MCP Server Directory by Category](#21-mcp-server-directory-by-category)
  - [2.2 Configuration](#22-configuration)
  - [2.3 MCP vs Native Tools Decision Framework](#23-mcp-vs-native-tools-decision-framework)
  - [2.4 Performance and Reliability](#24-performance-and-reliability)
  - [2.5 Security](#25-security)
- [Section 3: Memory & Knowledge Management](#section-3-memory--knowledge-management)
  - [3.1 Session Persistence](#31-session-persistence)
  - [3.2 Persistent Context Patterns](#32-persistent-context-patterns)
  - [3.3 Context Pollution](#33-context-pollution)
  - [3.4 Context Governance](#34-context-governance)
  - [3.5 RAG-Like Patterns](#35-rag-like-patterns)
  - [3.6 Cursor's Context System](#36-cursors-context-system)
  - [3.7 Claude Code Memory](#37-claude-code-memory)
- [Section 4: Prompt Patterns Inside IDE Agents](#section-4-prompt-patterns-inside-ide-agents)
  - [4.1 Agent Prompt Structure](#41-agent-prompt-structure)
  - [4.2 Agent Types and Templates](#42-agent-types-and-templates)
  - [4.3 Anti-Hallucination Techniques](#43-anti-hallucination-techniques)
  - [4.4 Task Delegation](#44-task-delegation)
  - [4.5 Role Prompting Effectiveness](#45-role-prompting-effectiveness)
  - [4.6 Extended Thinking](#46-extended-thinking)
  - [4.7 Prompt Caching](#47-prompt-caching)
  - [4.8 Rule Compliance](#48-rule-compliance)
- [Section 5: Agent Architecture Patterns](#section-5-agent-architecture-patterns)
  - [5.1 Single vs Multi-Agent](#51-single-vs-multi-agent)
  - [5.2 Specialization Patterns](#52-specialization-patterns)
  - [5.3 Agent Orchestration](#53-agent-orchestration)
  - [5.4 Best-of-N Patterns](#54-best-of-n-patterns)
  - [5.5 Task Decomposition](#55-task-decomposition)
  - [5.6 Error Recovery](#56-error-recovery)
- [Section 6: Project Organization for AI-First Development](#section-6-project-organization-for-ai-first-development)
  - [6.1 File and Folder Structures](#61-file-and-folder-structures)
  - [6.2 TypeScript Patterns](#62-typescript-patterns)
  - [6.3 Documentation Standards](#63-documentation-standards)
  - [6.4 Monorepo Patterns](#64-monorepo-patterns)
- [Section 7: Quality & Accuracy Maximization](#section-7-quality--accuracy-maximization)
  - [7.1 Grounding Techniques](#71-grounding-techniques)
  - [7.2 Test-Driven AI Development](#72-test-driven-ai-development)
  - [7.3 Hallucination Patterns in Coding](#73-hallucination-patterns-in-coding)
  - [7.4 Code Review with AI](#74-code-review-with-ai)
  - [7.5 Validation Strategies](#75-validation-strategies)
- [Section 8: Tools & Workflow Optimization](#section-8-tools--workflow-optimization)
  - [8.1 Cost Optimization](#81-cost-optimization)
  - [8.2 Speed Optimization](#82-speed-optimization)
  - [8.3 Git Workflows](#83-git-workflows)
  - [8.4 Team Workflows](#84-team-workflows)
- [Section 9: Latest Innovations (March 2026)](#section-9-latest-innovations-march-2026)
  - [9.1 Cursor Latest](#91-cursor-latest)
  - [9.2 Claude Code Latest](#92-claude-code-latest)
  - [9.3 New MCP Servers](#93-new-mcp-servers)
  - [9.4 Community Innovations](#94-community-innovations)
  - [9.5 Obsolete Patterns](#95-obsolete-patterns)
- [Anti-Patterns & Myths](#anti-patterns--myths)
- [The Ideal Context Architecture Blueprint](#the-ideal-context-architecture-blueprint)
- [MCP Server Directory](#mcp-server-directory)
- [Cross-Cutting Insights](#cross-cutting-insights)
- [Tools & Resources](#tools--resources)
- [Methodology](#methodology)

---

## Executive Summary

### Top 10 Findings with Highest Impact

1. **CLAUDE.md / AGENTS.md under 300 lines reduces manual corrections by ~40%** — An 80-line CLAUDE.md on a 50K-line TypeScript project eliminated repeated corrections overnight. The key is aggressive curation: every line competes for attention. ([Source: SFEIR Institute, Feb 2026](https://institute.sfeir.com/en/claude-code/claude-code-memory-system-claude-md/deep-dive/); [HumanLayer Blog](https://www.humanlayer.dev/blog/writing-a-good-claude-md))

2. **Tiered .cursor/rules/*.mdc files outperform monolithic .cursorrules** — The multi-file MDC format with YAML frontmatter (alwaysApply, globs, description) enables scoped context loading that keeps token budgets focused. Single-file .cursorrules is deprecated. ([Source: Cursor Docs](https://cursor.com/docs/context/rules); [Agent Rules Builder Guide, Feb 2026](https://www.agentrulegen.com/guides/cursor-rules-guide))

3. **"Search before implementing" as an always-on rule is the highest-ROI single instruction** — Forcing the agent to search the codebase before writing new code prevents the #1 failure mode: duplicating existing functionality or ignoring established patterns. ([Source: Elementor Engineering, Dec 2025](https://medium.com/elementor-engineers/cursor-rules-best-practices-for-developers-16a438a4935c))

4. **AGENTS.md is the cross-IDE standard** — Launched mid-2025 under the Linux Foundation's Agentic AI Foundation, AGENTS.md is supported by Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, Aider, Zed, Warp, and RooCode. If you use multiple AI tools, this is your interop layer. ([Source: Data Science Collective, Mar 2026](https://medium.com/data-science-collective/the-complete-guide-to-ai-agent-memory-files-claude-md-agents-md-and-beyond-49ea0df5c5a9))

5. **Cursor subagents and skills (shipped v2.4) are the biggest architectural leap since Agent Mode** — Subagents run in parallel with independent context, and skills provide on-demand procedural knowledge. Custom subagents with scoped tool access implement principle-of-least-privilege in agent architecture. ([Source: Cursor Changelog v2.4](https://cursor.com/changelog/2-4))

6. **Structured AI development produces 1.7× fewer defects than ad-hoc prompting** — A CodeRabbit analysis of 470 open-source PRs (Dec 2025) found that projects with MCP servers, subagents, and scoped CLAUDE.md configurations had measurably fewer bugs and 2.74× fewer security vulnerabilities. ([Source: DEV Community, Mar 2026](https://dev.to/lizechengnet/how-to-structure-claude-code-for-production-mcp-servers-subagents-and-claudemd-2026-guide-4gjn))

7. **Context editing in Claude Code (2026) cuts token consumption by 84%** — Automatic clearing of stale tool call outputs while preserving conversation flow prevents the context exhaustion that previously killed long workflows. ([Source: DEV Community, Mar 2026](https://dev.to/lizechengnet/how-to-structure-claude-code-for-production-mcp-servers-subagents-and-claudemd-2026-guide-4gjn))

8. **Claude Code injects a system reminder that makes it ignore irrelevant CLAUDE.md content** — The harness wraps CLAUDE.md in `<system-reminder>` tags telling Claude the context "may or may not be relevant." Overstuffed files get selectively ignored. This is why conciseness beats exhaustiveness. ([Source: HumanLayer Blog](https://www.humanlayer.dev/blog/writing-a-good-claude-md))

9. **Cursor Automations enable event-driven background agents** — Trigger on GitHub webhooks, cron schedules, or codebase changes. Cloud sandbox execution with MCP access and cross-run memory. Security teams report catching 200+ vulnerabilities per week across 3,000+ PRs. ([Source: Cursor Changelog, Mar 2026](https://cursor.com/changelog))

10. **The MCP ecosystem has exploded to 1,200+ servers** — But quality varies wildly. The reference implementations on github.com/modelcontextprotocol/servers are explicitly "not production-ready." GitHub MCP (3.2K stars), Playwright MCP, Postgres MCP, and Context7 (50K stars) are the most battle-tested. ([Source: awesome-mcp-servers](https://github.com/appcypher/awesome-mcp-servers); [MCP Awesome](https://mcp-awesome.com/))

### The Single Biggest Mistake Teams Make

**Stuffing everything into a single context file and never curating it.** The Claude Code harness has ~50 internal system instructions already consuming context budget. Every instruction you add competes with the agent's actual task context. Research consistently shows that a focused 80–150 line CLAUDE.md outperforms a 500+ line file. The same applies to Cursor rules: one sprawling alwaysApply rule degrades performance more than five focused, glob-scoped rules. The mechanism is well-understood: LLMs exhibit the "lost in the middle" effect where instructions in the middle of long contexts get lower attention weight.

### What Changed Since 2024 That Makes Old Patterns Obsolete

- **.cursorrules (single file)** → Replaced by `.cursor/rules/*.mdc` (multi-file with frontmatter). Still works but is deprecated and limits scoping.
- **Manual context inclusion only** → Cursor now has tiered auto-loading (alwaysApply, glob-scoped, description-matched) and skills with on-demand activation.
- **No persistent memory** → Claude Code auto-memory saves learnings across sessions. `/memory` command for inspection and refresh.
- **Single-agent, single-turn interactions** → Subagent orchestration with parallel execution, up to 10 simultaneous subagents in Claude Code.
- **MCP was theoretical** → 1,200+ servers, official registries, Cursor and Claude Code both have native MCP configuration.
- **Background agents didn't exist** → Cursor Automations (Feb/Mar 2026) run agents on schedules and webhook triggers with cloud sandboxes.
- **Cursor was editor-only** → Now available in JetBrains IDEs via Agent Client Protocol (ACP), plus web, mobile, and Slack.
- **"Vibe coding" was acceptable** → Evidence now shows structured approaches with rules, MCP, and specialized agents produce measurably fewer defects.

---

## Gold Tier: The 15–20 Most Impactful Practices

### 1. Write a CLAUDE.md/AGENTS.md Under 300 Lines

**What**: A concise project memory file loaded into every AI session containing only universally-applicable instructions: project overview (one line), code style preferences (specific, not generic), exact build/test/lint commands, key architectural decisions, and common pitfalls.

**Why**: Every line competes with task-relevant context. Claude Code's harness wraps CLAUDE.md in a system reminder that tells the model to ignore irrelevant content. Overstuffed files trigger this filtering.

**How**: Run `/init` in Claude Code, then delete 70% of what it generates. Keep only what the agent would get wrong without the file. Target ~80 lines for most projects, never exceed 200.

**Confidence**: High — Multiple independent sources confirm this pattern.
**Effectiveness**: Transformative

### 2. Use Multi-File .cursor/rules/*.mdc with Scoped Frontmatter

**What**: Replace the legacy single `.cursorrules` with multiple `.mdc` files in `.cursor/rules/`, each with YAML frontmatter specifying `alwaysApply`, `globs`, and `description`.

**Why**: Scoped rules load only when relevant, preserving token budget. A `frontend.mdc` with `globs: ["src/components/**"]` only activates when working on components.

**How**:
```yaml
# .cursor/rules/base.mdc
---
alwaysApply: true
description: "Core project conventions"
---
# Core Conventions
- TypeScript strict mode — never use `any`
- Named exports only
- pnpm as the package manager
```

```yaml
# .cursor/rules/frontend.mdc
---
globs:
  - "src/components/**"
  - "src/app/**"
description: "Frontend-specific rules for Next.js"
---
# Frontend Rules
- App Router only — never suggest Pages Router
- Server Components by default
- Tailwind CSS for all styling
```

**Confidence**: High
**Effectiveness**: Transformative

### 3. Enforce "Search Before Implementing"

**What**: An always-on rule requiring the agent to search the codebase for similar functionality before writing new code.

**Why**: The #1 failure mode of AI coding agents is duplicating existing patterns, creating new utilities that already exist, or ignoring established conventions visible in the code.

**How**: Add to your base always-apply rule:
```
SEARCH FIRST - Use codebase search and grep to find similar functionality
or confirm none exists. Be 100% sure before implementing anything new.
REUSE FIRST - Check existing functions/patterns/structure. Extend before creating.
```

**Confidence**: High
**Effectiveness**: Transformative

### 4. Create Agent Skills for Complex Procedural Knowledge

**What**: SKILL.md files in `.cursor/skills/` (Cursor) or `.claude/skills/` (Claude Code) containing domain-specific procedures, reference scripts, and examples that load on-demand rather than always.

**Why**: Skills are the correct abstraction for "how-to" knowledge that is only relevant sometimes — deployment procedures, database migration patterns, testing frameworks, API integration guides. Loading them always wastes context; loading them on-demand when the agent detects relevance keeps context focused.

**How**: Structure skills as folders with progressive disclosure:
```
.cursor/skills/
  deployment/
    SKILL.md          # Entry point with description trigger
    references/       # API docs, schema files
    scripts/          # Shell scripts, code templates
    examples/         # Working examples
```

The description field in SKILL.md is a trigger, not a summary — write it for the model: "When should I fire?"

**Confidence**: High
**Effectiveness**: Transformative

### 5. Use Subagents for Parallel Execution

**What**: Independent agents specialized to handle discrete parts of a parent agent's task, running in parallel with their own context windows.

**Why**: Faster execution, more focused context per subtask, and principle of least privilege (each subagent has scoped tool access). Claude Code supports up to 10 simultaneous subagents.

**How**: In Cursor, define custom subagents in `.cursor/agents/`. In Claude Code, use `context: fork` in skills or say "use subagents" to offload work. Structure three-stage pipelines: spec → review → implement.

**Confidence**: High
**Effectiveness**: Transformative

### 6. Integrate the Top 3 MCP Servers for Your Stack

**What**: Connect GitHub MCP, your database MCP (Postgres/Supabase/Neon), and a search/docs MCP (Context7 or Brave Search) as your baseline MCP configuration.

**Why**: MCP eliminates the copy-paste loop between AI and tools. The agent can directly read issues, query databases, and fetch documentation without leaving the conversation.

**How**: Create `.cursor/mcp.json` or `.mcp.json` at project root. Start with stdio transport for local servers, HTTP for cloud services.

**Confidence**: High
**Effectiveness**: Useful to Transformative (depends on workflow)

### 7. Separate Global from Project Rules

**What**: Put universal personal preferences in `~/.cursor/rules/` or `~/.claude/CLAUDE.md`, and project-specific conventions in project-level files.

**Why**: Personal preferences (indentation, commit style, language) apply everywhere. Project conventions (framework version, architecture, deployment) are specific. Mixing them creates noise in every project.

**How**: Global: `~/.claude/CLAUDE.md` for Claude Code, Cursor Settings > Rules for user-level. Project: `./CLAUDE.md` and `.cursor/rules/*.mdc`.

**Confidence**: High
**Effectiveness**: Useful

### 8. Use Plan Mode Before Complex Multi-File Tasks

**What**: In Cursor, enable Plan Mode so the agent maps out the full scope of work before executing. In Claude Code, use plan mode to halve token consumption.

**Why**: Plan mode reduces back-and-forth generation, prevents the agent from going down wrong paths, and gives you a chance to correct the approach before code is written.

**How**: Toggle Plan Mode in Cursor's agent panel. In Claude Code, explicitly ask Claude to "plan first, then implement."

**Confidence**: High
**Effectiveness**: Useful

### 9. Keep Linting and Type-Checking in the Agent Loop

**What**: Configure auto-run linting and type-checking after agent edits, feeding errors back to the agent for correction.

**Why**: Mechanical checks catch hallucinated imports, wrong function signatures, and type errors immediately. This grounds the agent in reality.

**How**: In Claude Code, use hooks to run formatters after file edits. In Cursor, enable terminal auto-run. Add to rules: "After making changes, run `pnpm typecheck` and fix any errors before reporting completion."

**Confidence**: High
**Effectiveness**: Transformative

### 10. Start New Sessions Instead of Extending Old Ones

**What**: Begin fresh agent sessions for each distinct task rather than continuing a single conversation indefinitely.

**Why**: Context accumulates stale tool outputs, abandoned approaches, and irrelevant file contents. Cursor's context indicator shows consumption; when it's high, quality degrades.

**How**: Develop the habit of scoping sessions: "Add Stripe webhooks" is one session. "Refactor billing service" is a separate session. Don't carry unrelated context.

**Confidence**: High
**Effectiveness**: Useful

### 11. Write Rules in Imperative, Martial-Arts Tone

**What**: Use short, direct, action-oriented instructions rather than descriptive or explanatory prose.

**Why**: Community testing consistently shows imperative commands ("Use named exports") get followed more reliably than descriptive guidelines ("Our project prefers named exports when possible"). Every word counts in the token budget.

**How**: Write like internal docs — clear do/don't. One concern per rule. Anchor with concrete code samples. Avoid hedging language ("when possible", "generally", "consider").

**Confidence**: Medium — Based on practitioner reports, not controlled studies.
**Effectiveness**: Useful

### 12. Use @-Mentions Aggressively in Prompts

**What**: Reference specific files, folders, rules, and docs with @file, @folder, @codebase, @web, @docs in Cursor prompts.

**Why**: @-mentions give the agent precise, high-signal context rather than relying on its own retrieval. This dramatically improves accuracy for targeted tasks.

**How**: Instead of "update the API endpoint," write "@src/api/users.ts update the GET endpoint to include pagination using the pattern in @src/api/products.ts".

**Confidence**: High
**Effectiveness**: Useful

### 13. Version Control All Context Files

**What**: Commit `.cursor/rules/`, `AGENTS.md`, `CLAUDE.md`, and `.cursor/mcp.json` to Git. Gitignore only personal overrides.

**Why**: Team consistency — everyone gets the same AI behavior. Also enables branch-specific rules for migrations or major refactors.

**How**:
```bash
git add .cursor/rules/ AGENTS.md CLAUDE.md .cursor/mcp.json
git commit -m "chore: add AI context configuration"
echo ".cursor/rules/personal.mdc" >> .gitignore
```

**Confidence**: High
**Effectiveness**: Useful

### 14. Challenge the Agent Instead of Accepting First Output

**What**: Use adversarial prompting: "grill me on these changes," "prove to me this works," "knowing everything you know now, scrap this and implement the elegant solution."

**Why**: The default agent behavior is to agree and comply. Pushing back produces better solutions, catches edge cases, and surfaces design issues.

**How**: After a mediocre fix, try: "knowing everything you know now, scrap this and implement the elegant solution." Have Claude diff between main and your branch before merging.

**Confidence**: Medium
**Effectiveness**: Useful

### 15. Build Slash Commands for Inner-Loop Workflows

**What**: Create custom slash commands in `.claude/commands/` for workflows you repeat multiple times daily: review PR, run tests, deploy staging, tech debt audit.

**Why**: Saves repeated prompting, ensures consistency, and commands are version-controlled in Git for team sharing.

**How**: Create markdown files in `.claude/commands/` with the prompt template. Invoke with `/command-name` in Claude Code.

**Confidence**: High
**Effectiveness**: Useful

---

## Section 1: Context Architecture for AI IDEs

### 1.1 File-Level Context Systems

The landscape of AI context files has converged on a simple idea: a markdown file in your repository that the AI reads before doing anything. The differences are in naming, scoping, and how hierarchy works.

#### CLAUDE.md (Claude Code)

CLAUDE.md is Claude Code's persistent memory file, automatically loaded into the system prompt at the start of every session. It exists at three levels, merged in order of specificity:

1. **`~/.claude/CLAUDE.md`** — Global personal instructions applied to all projects
2. **`./CLAUDE.md`** — Project root instructions, shared via Git with the team
3. **Subdirectory `CLAUDE.md`** — Scoped instructions for specific parts of the codebase

The file closest to the code being edited takes highest precedence. Since Claude Code v2.0 (January 2026), the system also supports modular rules via `.claude/rules/` for additional scoped instructions.

Critical implementation detail: Claude Code wraps CLAUDE.md content in a `<system-reminder>` tag stating "this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task." This means the agent will selectively ignore instructions it deems irrelevant to the current task. The more irrelevant content in the file, the more likely important instructions get ignored.

**Recommended structure for a project CLAUDE.md** (target: 80–150 lines):

```markdown
# Project: [Name]

E-commerce platform built with Next.js 14, Postgres, and Stripe.

## Build & Test Commands
- `pnpm dev` — start dev server
- `pnpm test` — run unit tests (Vitest)
- `pnpm test:e2e` — run E2E tests (Playwright)
- `pnpm lint:fix` — fix lint errors
- `pnpm typecheck` — run TypeScript type checking

## Code Style
- ES modules, named exports only
- 2-space indentation, single quotes
- Prefer functional components with hooks
- Use Zod for all input validation
- Error handling: all async functions use try/catch

## Architecture
- App Router (never Pages Router)
- Server Components by default, 'use client' only when necessary
- Database: Prisma ORM with Postgres
- Auth: NextAuth.js with JWT strategy
- State: Zustand for client state, React Query for server state

## Key Conventions
- API routes in src/app/api/
- Shared types in src/types/
- Business logic in src/services/ (never in components)
- Tests colocated with source files (*.test.ts)

## Common Pitfalls
- NEVER use default exports (breaks tree-shaking)
- NEVER put business logic in API route handlers — call services
- The Stripe webhook handler at src/app/api/webhooks/stripe must verify signatures
- Database migrations require `pnpm prisma migrate dev`, not `prisma db push`
```

Sources: [HumanLayer Blog](https://www.humanlayer.dev/blog/writing-a-good-claude-md), [SFEIR Institute Deep Dive, Feb 2026](https://institute.sfeir.com/en/claude-code/claude-code-memory-system-claude-md/deep-dive/), [DEV Community Guide, Mar 2026](https://dev.to/lizechengnet/how-to-structure-claude-code-for-production-mcp-servers-subagents-and-claudemd-2026-guide-4gjn)

#### AGENTS.md (Cross-IDE Standard)

AGENTS.md emerged in mid-2025 from a collaboration between Sourcegraph, OpenAI, Google, Cursor, and others. It is now maintained by the Agentic AI Foundation under the Linux Foundation. Its purpose is simple: one file, any agent.

Supported by: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, Aider, Zed, Warp, RooCode, and more.

AGENTS.md uses standard Markdown with no special schema or YAML frontmatter required. The closest AGENTS.md to the file being edited takes precedence, and explicit user prompts override everything.

If you use only one AI tool, use its native format (CLAUDE.md for Claude Code, .cursor/rules/ for Cursor). If you use multiple tools, maintain an AGENTS.md as your interop layer.

Source: [Data Science Collective Guide, Mar 2026](https://medium.com/data-science-collective/the-complete-guide-to-ai-agent-memory-files-claude-md-agents-md-and-beyond-49ea0df5c5a9)

#### .cursor/rules/*.mdc (Cursor — Current Standard)

The MDC (Markdown with Configuration) format is Cursor's current, recommended rule system. Each `.mdc` file has YAML frontmatter controlling activation:

```yaml
---
description: "A human-readable explanation of purpose and when to apply"
globs:
  - "src/components/**"
  - "!**/*.test.ts"
alwaysApply: false
---
# Rule Content Here
```

Frontmatter fields:
- **`alwaysApply: true`** — Loaded into every interaction regardless of file context
- **`globs`** — Minimatch/glob patterns; rule activates only when the active file matches
- **`description`** — Used by the agent to decide whether to load the rule when relevant

The legacy `.cursorrules` single file is still supported but deprecated. It lacks scoping, wastes tokens by loading everything always, and cannot target specific file types or directories.

Source: [Cursor Docs](https://cursor.com/docs/context/rules), [Agent Rules Builder Guide](https://www.agentrulegen.com/guides/cursor-rules-guide)

#### .cursor/skills/*/SKILL.md (Cursor — New)

Skills are a Cursor v2.4 addition (early 2026). They differ from rules in a critical way: skills are on-demand procedural knowledge, while rules are declarative conventions.

Skills are folders, not files. A skill consists of:
```
.cursor/skills/
  deployment/
    SKILL.md          # Entry point with trigger description
    references/       # API docs, schema files
    scripts/          # Shell scripts, templates
    examples/         # Working code examples
```

The `description` field in SKILL.md is a trigger — write it for the model ("when should I fire?"), not as a summary. Skills support progressive disclosure: the agent reads SKILL.md first, then pulls in subdirectory contents as needed.

Skills can also embed `!`command`` to inject dynamic shell output into the prompt — Claude runs it on invocation and the model only sees the result.

Source: [Cursor Changelog v2.4](https://cursor.com/changelog/2-4), [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)

#### .cursor/agents/*.md (Cursor — Custom Subagents)

Custom subagent definitions for parallel task execution. Each file defines a specialized agent with its own prompt, tool access, and optionally a different model.

```yaml
---
name: api-tester
description: "Tests REST endpoints, validates response schemas"
tools: [Bash, Read, WebFetch]
model: sonnet
---
You are a specialized API testing agent. When invoked, you:
1. Read the OpenAPI spec from /docs/api.yaml
2. Test each endpoint against the running dev server
3. Compare responses against the expected schema
4. Report failures with request, expected output, and actual output
```

Source: [Cursor Changelog v2.4](https://cursor.com/changelog/2-4), [DEV Community Guide](https://dev.to/lizechengnet/how-to-structure-claude-code-for-production-mcp-servers-subagents-and-claudemd-2026-guide-4gjn)

### 1.2 Tiered Context Loading

Context loading in modern AI IDEs follows a four-tier hierarchy. Understanding this hierarchy is essential for efficient token budget management.

**Tier 1: Always-Loaded** (`alwaysApply: true`)
- Loaded into every AI interaction: chat, autocomplete, code generation
- Use for: universal project conventions, package manager preference, language/framework mandates
- Size constraint: Keep minimal. Every token here is spent on every interaction. Under 500 tokens is ideal.
- Cursor processes these first, giving them highest attention weight

**Tier 2: Glob-Scoped** (auto-loaded by file path match)
- Activated automatically when the user's active file matches glob patterns
- Use for: framework-specific conventions (frontend.mdc for React, api.mdc for route handlers), testing patterns, database conventions
- Size constraint: More generous since they only load when relevant. Up to 1,000 tokens per rule is reasonable.

**Tier 3: On-Demand** (agent-requested or description-matched)
- Not loaded by default. The agent reads the `description` field and decides whether to pull in the content.
- Use for: skills, procedural knowledge, complex workflows, reference documentation
- Size constraint: Can be larger since they're only loaded when truly needed. Skills can be multi-file with progressive disclosure.

**Tier 4: Deep Reference Docs**
- External documentation pulled via @docs, @web, or MCP servers
- Not stored in context files at all — fetched at query time
- Use for: API documentation, library references, third-party specifications

The key insight: most teams overload Tier 1 (always-loaded) and underutilize Tiers 2–4. Moving framework-specific rules from alwaysApply to glob-scoped reduces context noise in every interaction where those rules aren't relevant.

Sources: [Cursor Docs](https://cursor.com/docs/context/rules), [Mervin Praison Deep Dive](https://mer.vin/2025/12/cursor-ide-rules-deep-dive/)

### 1.3 Rule Effectiveness

What makes a rule that the AI actually follows? Community experimentation has revealed several patterns:

**Rules that get followed:**
- Imperative commands: "Use named exports" beats "We prefer named exports"
- Specific examples: Include a 3-5 line code snippet showing the expected pattern
- Concrete constraints: "Maximum 50 lines per function" beats "Keep functions small"
- Numbered execution sequences: "1. Search existing code. 2. Reuse patterns. 3. Implement only if no match found"
- Negative examples: "NEVER use default exports — breaks tree-shaking" is followed more reliably than "Use named exports"
- Anchored references: "@filename.ts references to provide useful anchors"

**Rules that get ignored:**
- Vague guidance: "Write clean code" or "Follow best practices"
- Overly long explanations: The why-paragraph after a rule dilutes the instruction
- Rules contradicting model training: Fighting deeply-ingrained LLM patterns (like trying to ban comments entirely) requires more aggressive phrasing
- Rules buried in paragraphs: List-based rules get followed more than prose paragraphs
- Hedging language: "When possible," "generally," "consider" are interpreted as optional

**The "martial arts" approach** from Elementor Engineering: Write rules in short, direct, combat-style instructions. No fluff. Every word costs tokens. This approach was refined over weeks of human reinforcement learning — constant tweaks until the rules produced reliable behavior.

Recommended format per rule:
```markdown
## RULE NAME (ALL CAPS for attention)
- DO: [concrete instruction with code example]
- DO NOT: [concrete anti-pattern with code example]
- WHY: [one sentence, max]
```

**Effectiveness**: Useful
**Confidence**: Medium — Based on extensive practitioner reports but limited controlled studies. One academic study (arXiv 2026, 401 repositories) confirmed that rules vary significantly by project type, highlighting the importance of tailored files.

Sources: [Elementor Engineering](https://medium.com/elementor-engineers/cursor-rules-best-practices-for-developers-16a438a4935c), [digitalchild/cursor-best-practices](https://github.com/digitalchild/cursor-best-practices), [Startupbricks Guide, Jan 2026](https://www.startupbricks.in/blog/cursor-rules-why-needed-setup-guide)

### 1.4 Skills vs Rules vs Agents

These three constructs serve different purposes and should not be conflated:

| Aspect | Rules (.mdc) | Skills (SKILL.md) | Agents (.md) |
|--------|-------------|-------------------|---------------|
| **Purpose** | Declarative conventions | Procedural knowledge | Specialized execution |
| **Loading** | Always or glob-scoped | On-demand, triggered | Invoked explicitly |
| **Tone** | "Always do X" | "Here's how to do Y" | "You are an agent that does Z" |
| **Size** | Under 500 lines | No hard limit, progressive disclosure | Focused prompt + tool config |
| **Examples** | "Use named exports" | "How to deploy to staging" | "API testing subagent" |
| **State** | Stateless | Can run scripts, reference files | Has own context window |
| **When to create** | Pattern appears in 3+ conversations | Procedure requires multiple steps | Task benefits from specialization |

**Key insight from shanraisshan/claude-code-best-practice**: "Don't state the obvious in skills — focus on what pushes the agent out of its default behavior. Don't railroad the agent in skills — give goals and constraints, not prescriptive step-by-step instructions."

Skills should have a Gotchas section — highest-signal content, continuously updated with the agent's failure points over time.

**Effectiveness**: Transformative (when used correctly)
**Confidence**: High

Sources: [Cursor Changelog v2.4](https://cursor.com/changelog/2-4), [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)

### 1.5 Scope Levels

Cursor evaluates rules in the following precedence order:

1. **Manual/Local**: Explicitly included with @ruleName — highest precedence
2. **Auto Attached**: Files matching glob patterns
3. **Always Apply**: `alwaysApply: true` rules
4. **User Rules**: Global rules from Cursor Settings > Rules — lowest precedence

For Claude Code, the hierarchy is:
1. **Explicit user prompts** — always override
2. **Subdirectory CLAUDE.md** — closest to the file being edited
3. **Project root CLAUDE.md** — shared team config
4. **`~/.claude/CLAUDE.md`** — personal global preferences
5. **Auto-memory** — learnings Claude saves automatically

Best practice for scope allocation:
- **User-level** (`~/.cursor/rules/` or `~/.claude/CLAUDE.md`): Language preference, commit message style, personal formatting preferences
- **Project-level** (`.cursor/rules/` or `./CLAUDE.md`): Tech stack, architecture, naming conventions, build commands
- **Subdirectory-level**: Module-specific patterns, migration-specific temporary rules
- **Branch-specific**: Temporary rules for major refactors (add in `.claude/rules/migration.md`, remove after merge)

Sources: [Cursor Docs](https://cursor.com/docs/context/rules), [SFEIR Institute FAQ](https://institute.sfeir.com/en/claude-code/claude-code-memory-system-claude-md/faq/)

### 1.6 Token Budget Reality

Claude Code has a 200,000-token context window. This sounds enormous but fills quickly once you factor in: system prompt (~50 internal instructions from the harness), CLAUDE.md content, file contents from tool calls, tool outputs, and conversation history.

**The "Lost in the Middle" problem**: Research consistently shows that LLMs attend more to content at the beginning and end of their context window, with reduced attention to content in the middle. For IDE context, this means:

- Put the most critical rules at the top and bottom of your files
- Keep total always-loaded context under 2,000 tokens
- Don't rely on rules that end up in the middle of a long context window

**Practical token budgets**:
- CLAUDE.md: Target 80–150 lines (~800–1,500 tokens). Maximum ~200 lines.
- Always-apply Cursor rules: Combined total under 500 tokens
- Glob-scoped rules: Up to 1,000 tokens each (they don't all load simultaneously)
- Skills: No hard limit, but progressive disclosure means the entry SKILL.md should be under 500 tokens, with deeper reference pulled on demand

**Claude Code's context editing feature** (2026): Automatically clears stale tool call outputs while preserving conversation flow. In evaluation, this cut token consumption by 84% for 100-turn workflows. This is currently the most effective tool for managing long sessions.

**Plan mode** in Claude Code halves token consumption by mapping work before executing. Use it at the start of any complex multi-file task.

**Effectiveness**: Transformative (understanding token budgets)
**Confidence**: High

Sources: [HumanLayer Blog](https://www.humanlayer.dev/blog/writing-a-good-claude-md), [DEV Community Guide](https://dev.to/lizechengnet/how-to-structure-claude-code-for-production-mcp-servers-subagents-and-claudemd-2026-guide-4gjn)

### 1.7 Cross-IDE Compatibility

If your team uses both Cursor and Claude Code (or other AI tools), the compatibility strategy is:

**AGENTS.md as the interop layer**: Maintain an AGENTS.md at project root with universal conventions. This is read by both Cursor and Claude Code, plus Copilot, Gemini CLI, Windsurf, and others.

**Tool-specific files for tool-specific features**:
- `.cursor/rules/*.mdc` for Cursor's glob-scoped rules (Claude Code ignores these)
- `CLAUDE.md` for Claude Code-specific instructions (Cursor ignores this in most configurations)
- `.claude/commands/` for Claude Code slash commands
- `.cursor/skills/` for Cursor skills

**Shared configuration**:
- MCP configuration is similar but stored differently: `.cursor/mcp.json` for Cursor, `.mcp.json` for Claude Code
- Both tools support project-level and user-level MCP config

**The dual-file pattern**: Many teams maintain both `AGENTS.md` (read by all tools) and `CLAUDE.md` (Claude Code-specific additions). The AGENTS.md contains universal conventions; CLAUDE.md adds Claude-specific commands and behaviors.

**Effectiveness**: Useful
**Confidence**: High

Sources: [DeployHQ Guide, Mar 2026](https://www.deployhq.com/blog/ai-coding-config-files-guide), [Data Science Collective](https://medium.com/data-science-collective/the-complete-guide-to-ai-agent-memory-files-claude-md-agents-md-and-beyond-49ea0df5c5a9)

### 1.8 Real Examples from Open-Source Repos

**shanraisshan/claude-code-best-practice** ([GitHub](https://github.com/shanraisshan/claude-code-best-practice))
A comprehensive collection of Claude Code best practices compiled from Boris Cherny (Claude Code creator), community discussions, and production experience. Covers the full Command → Agent → Skill pattern, memory configuration, subagent orchestration, and debugging workflows. Particularly strong on skill design ("skills are folders, not files") and the distinction between what belongs in CLAUDE.md vs commands vs skills.

**digitalchild/cursor-best-practices** ([GitHub](https://github.com/digitalchild/cursor-best-practices))
Focused Cursor configuration guide covering the MDC rule system, instructions.md patterns, and Composer workflows. Good examples of rule file structures with concrete glob patterns.

**Cursor's own MCP servers list** ([GitHub](https://github.com/cursor/mcp-servers))
Curated list of MCP servers specifically tested with Cursor, useful for quick reference when setting up project MCP configurations.

---

## Section 2: MCP Ecosystem — Practical Usage Guide

### 2.1 MCP Server Directory by Category

The Model Context Protocol ecosystem has grown to over 1,200 servers as of March 2026. Quality varies dramatically. The official reference implementations at github.com/modelcontextprotocol/servers are explicitly described as "educational examples, not production-ready solutions."

Below are the servers most relevant to development workflows, with honest quality assessments.

#### Browser Automation

**Playwright MCP** (`@playwright/mcp`)
- **What**: Browser automation — control browsers, take screenshots, fill forms, extract data
- **Quality**: Production-ready
- **Stars**: ~6.1K monthly searches, widely adopted
- **Strengths**: Best-in-class browser automation, excellent Cursor integration
- **Limitations**: Requires local Chromium installation, can be slow for complex page interactions
- **URL**: https://github.com/playwright-community/mcp-playwright

**Puppeteer MCP** (`@modelcontextprotocol/server-puppeteer`)
- **What**: Browser automation via Puppeteer
- **Quality**: Beta — reference implementation
- **Strengths**: Lighter weight than Playwright for simple tasks
- **Limitations**: Less feature-complete than Playwright MCP, explicitly not production-ready

#### Database Access

**PostgreSQL MCP** (`@modelcontextprotocol/server-postgres`)
- **What**: PostgreSQL database integration with schema inspection and query capabilities
- **Quality**: Production-ready (with read-only default)
- **Strengths**: Schema inspection, query execution, maintains read-only safety by default
- **Limitations**: Connection pooling needs manual configuration for production use
- **URL**: https://github.com/modelcontextprotocol/servers (reference implementation)

**SQLite MCP** (`@modelcontextprotocol/server-sqlite`)
- **What**: SQLite database operations with built-in analysis features
- **Quality**: Production-ready
- **Strengths**: Supports Datasette-compatible metadata, good for local development
- **URL**: https://github.com/modelcontextprotocol/servers

**Supabase MCP**
- **What**: Supabase platform integration — database, auth, storage, edge functions
- **Quality**: Beta
- **Strengths**: Full Supabase platform access beyond just database
- **Limitations**: API-dependent, latency for complex queries

**Neon MCP**
- **What**: Neon serverless Postgres platform integration
- **Quality**: Production-ready
- **Strengths**: Natural language interactions with Neon for database management, serverless-native
- **URL**: Listed on awesome-mcp-servers with ⭐ indicator

#### Git/GitHub

**GitHub Official MCP** (`@modelcontextprotocol/server-github`)
- **What**: Access repos, issues, PRs, code search, manage issues, review PRs
- **Quality**: Production-ready
- **Stars**: ~3.2K
- **Strengths**: Official implementation, comprehensive API coverage
- **Limitations**: Rate limiting for high-volume operations
- **URL**: https://github.com/modelcontextprotocol/servers

**GitKraken MCP** (`gk mcp`)
- **What**: CLI that wraps GitKraken APIs, Jira, GitHub, GitLab, and more
- **Quality**: Beta
- **Strengths**: Multi-platform integration (not just Git)
- **URL**: https://github.com/gitkraken

#### File System and Code Search

**Filesystem MCP** (`@modelcontextprotocol/server-filesystem`)
- **What**: Local file system access with configurable permissions
- **Quality**: Production-ready
- **Strengths**: Fine-grained directory restrictions, fundamental capability
- **Critical security note**: Never add home directory root or `/` as allowed path
- **URL**: https://github.com/modelcontextprotocol/servers

**Context7** (`upstash/context7`)
- **What**: Up-to-date code documentation for LLMs and AI code editors
- **Quality**: Production-ready
- **Stars**: ~50K (as of Mar 2026)
- **Strengths**: Massive community adoption, continuously updated documentation
- **URL**: https://github.com/upstash/context7

#### Monitoring

**Sentry MCP**
- **What**: Sentry.io integration for error tracking and performance monitoring
- **Quality**: Production-ready
- **Strengths**: Direct access to error reports, stack traces, performance data
- **URL**: Listed in awesome-mcp-servers

**Datadog MCP**
- **What**: Datadog integration — recently added as Cursor plugin (Mar 2026)
- **Quality**: Beta
- **Strengths**: Official Cursor plugin partnership

#### Design Tools

**Figma MCP**
- **What**: Figma design file access — components, styles, layout inspection
- **Quality**: Beta
- **Strengths**: Generate components directly from Figma designs. Copy component URL and give it to Cursor for code generation.
- **Limitations**: First output usually needs a few iterations to match design precisely

#### Documentation/Knowledge

**Brave Search MCP** (`@modelcontextprotocol/server-brave-search`)
- **What**: Web search capabilities via Brave Search API
- **Quality**: Production-ready
- **Strengths**: No Google account needed, good privacy story
- **URL**: https://github.com/modelcontextprotocol/servers

**Fetch MCP** (`@modelcontextprotocol/server-fetch`)
- **What**: Efficiently fetches and processes web content
- **Quality**: Production-ready
- **URL**: https://github.com/modelcontextprotocol/servers

#### Deployment

**Vercel MCP**
- **What**: Vercel platform integration for deployment management
- **Quality**: Beta
- **Strengths**: Direct deployment from agent workflows

**Netlify MCP**
- **What**: Netlify platform integration
- **Quality**: Experimental

#### Memory and Knowledge Graphs

**Cognee** (`topoteretes/cognee`)
- **What**: Memory manager for AI apps using various graph and vector stores, supports 30+ data ingestion formats
- **Quality**: Production-ready
- **Stars**: ~15K
- **URL**: https://github.com/topoteretes/cognee

**Qdrant MCP**
- **What**: Vector search engine for keeping and retrieving memories
- **Quality**: Beta
- **URL**: Listed on awesome-mcp-servers with ⭐ indicator

### 2.2 Configuration

#### Cursor MCP Configuration

Create `.cursor/mcp.json` at project root:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "./src",
        "./docs"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    }
  }
}
```

#### Claude Code MCP Configuration

Project-level: create `.mcp.json` at project root (same JSON format).
User-level: configure in `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

**Best practice**: Keep credentials in environment variables, not hardcoded in config files. Use project-level config for shared team servers, user-level for personal tools.

**Transport types**:
- **stdio**: Local process, communicates via stdin/stdout. Used for Filesystem, PostgreSQL, Playwright — anything needing local access.
- **HTTP/SSE**: Remote server over the internet. Used for cloud services like GitHub, Sentry, Vercel.

HTTP servers are simpler to configure (just a URL); stdio servers require Node.js or Python installed locally.

Sources: [Publora MCP Guide](https://publora.com/blog/10-best-mcp-servers-for-developers-2026), [Cursor MCP Docs](https://cursor.com/docs)

### 2.3 MCP vs Native Tools Decision Framework

| Use MCP When | Use Native Tools When |
|---|---|
| Agent needs to interact with external services (GitHub, databases, APIs) | Agent needs to read/write project files (use built-in file tools) |
| You want consistent tool behavior across multiple AI tools | The tool is specific to one IDE (Cursor's @codebase, Claude Code's bash) |
| The interaction requires state or authentication | Simple, stateless operations |
| You need to share tool configuration with your team | Personal workflow tools |
| The MCP server is production-ready and well-maintained | The MCP server is experimental or abandoned |

**Default stance**: Start without MCP. Add MCP servers one at a time when you find yourself repeatedly copy-pasting between the AI and another tool. The overhead of configuring and maintaining MCP connections only pays off if you use them frequently.

### 2.4 Performance and Reliability

MCP latency characteristics to be aware of:

- **stdio servers** (local): Sub-100ms per tool call typically. Performance depends on the tool itself (a database query may take seconds).
- **HTTP/SSE servers** (remote): Network-dependent. Expect 200ms–2s per call. Cloud services have their own rate limits.
- **Timeout strategies**: Most MCP clients have a default timeout of 30 seconds. For long-running operations (database migrations, large file processing), this may need increasing.
- **Error handling**: MCP failures should be non-fatal. The agent should be able to fall back to alternative approaches (manual instructions, direct API calls) when an MCP server is unavailable.
- **Reliability pattern**: MCP servers are additional capabilities, not dependencies. Design workflows so they work (less efficiently) without MCP, and better with it.

### 2.5 Security

**Critical risks of MCP servers with write access**:

The awesome-mcp-servers maintainers warn: "When running MCP servers without proper sandboxing, they can execute arbitrary code on your system with the same permissions as the host process."

**Security best practices**:
1. **Principle of least privilege**: Only grant MCP servers the minimum permissions needed. Use read-only database connections by default.
2. **Directory restrictions**: For filesystem MCP, explicitly list allowed directories. Never allow `/` or home directory root.
3. **Credential management**: Store tokens in environment variables, not in config files committed to Git. Use `.env` files gitignored from the repository.
4. **Sandboxing**: Consider running MCP servers in Docker containers for isolation, especially servers with write access.
5. **Audit**: Review what data MCP servers can access. A GitHub MCP with full repo access can read secrets in your repository.

Sources: [awesome-mcp-servers security warning](https://github.com/appcypher/awesome-mcp-servers), [Publora Guide](https://publora.com/blog/10-best-mcp-servers-for-developers-2026)

---

## Section 3: Memory & Knowledge Management

### 3.1 Session Persistence

Understanding what survives between sessions is critical for effective AI-assisted development.

**Cursor**:
- Chat history is preserved in the IDE but not automatically reloaded as context
- Codebase embeddings persist and update incrementally
- `.cursor/rules/*.mdc` files are re-read at the start of each session
- No automatic memory of what was discussed in previous sessions
- Notepads provide shared context that persists across sessions

**Claude Code**:
- CLAUDE.md is loaded at every session start
- Auto-memory: Claude Code saves learnings (build commands, debugging insights) across sessions without you writing anything
- `/memory show` inspects loaded context; `/memory refresh` forces a reload
- `.claude/rules/` modular rules persist and are loaded per session
- Conversation history does NOT carry over between sessions — each session starts fresh

**Key implication**: Both tools are fundamentally stateless between sessions. The only persistent state is what you put in configuration files (CLAUDE.md, rules, skills) and what auto-memory captures.

### 3.2 Persistent Context Patterns

**CLAUDE.md as cross-session memory**: The primary mechanism. Every correction you make repeatedly should become a line in CLAUDE.md. "The agent kept using npm instead of pnpm" → add "Package manager: pnpm (never npm or yarn)" to CLAUDE.md. The corrections stop overnight.

**Memory files pattern**: Some teams maintain a `docs/ai-context/` directory with:
- `architecture.md` — System design decisions and rationale
- `conventions.md` — Coding standards with examples
- `pitfalls.md` — Known gotchas and past mistakes
- `changelog-ai.md` — What the AI should know about recent changes

These files aren't auto-loaded but can be referenced via @file mentions when relevant.

**Slash commands as memory**: Claude Code's `.claude/commands/` directory lets you package repeated workflows. A `/review-pr` command encapsulates your team's review checklist, code standards, and common issues — persistent, version-controlled, shared.

### 3.3 Context Pollution

Context pollution occurs when irrelevant information in the context window degrades output quality. This is one of the most underappreciated problems in AI-assisted development.

**Symptoms of context pollution**:
- Agent starts ignoring rules it previously followed
- Responses become generic, losing project-specific patterns
- Hallucinations increase as the model has more noise to confuse signals
- Agent agrees with everything instead of pushing back

**Causes**:
- Overstuffed CLAUDE.md/rules files with instructions for rare situations
- Long sessions with accumulated stale tool outputs
- Too many always-on rules that aren't universally relevant
- Including full API documentation in context instead of summaries

**Solutions**:
1. **Aggressive curation**: Remove any CLAUDE.md line that applies to fewer than 80% of sessions
2. **Scope rules with globs**: Move framework-specific rules out of alwaysApply
3. **Start new sessions**: For each distinct task, begin fresh
4. **Use progressive disclosure**: Skills and on-demand rules over always-on
5. **Context editing** (Claude Code 2026): Automatic stale output clearing
6. **Plan mode**: Map work before executing to reduce back-and-forth

### 3.4 Context Governance

Keeping context files accurate and current requires active maintenance.

**Update triggers**:
- New dependency added → update CLAUDE.md tech stack section
- Build command changed → update CLAUDE.md commands section
- Architecture decision made → update relevant rules
- Agent makes the same mistake 3 times → add rule or pitfall entry
- Framework upgraded → review all version-specific rules

**Staleness detection**:
- Monthly review of CLAUDE.md (schedule it)
- Track when rules were last modified (`git log --oneline -- CLAUDE.md .cursor/rules/`)
- Test rules by asking the agent about them: "What package manager does this project use?"

**Automated validation**: Some teams add CI checks that verify CLAUDE.md references correct file paths and commands actually exist in the project.

Source: [SFEIR Institute Tutorial](https://institute.sfeir.com/en/claude-code/claude-code-memory-system-claude-md/tutorial/)

### 3.5 RAG-Like Patterns

Several MCP servers enable retrieval-augmented generation over project knowledge:

- **Context7** (50K stars): Up-to-date code documentation as MCP resources. Continuously updated. The most widely-adopted documentation MCP.
- **Cognee** (15K stars): Full RAG platform combining graph RAG, vector search, and full-text search. Production-ready for large knowledge bases.
- **ApeRAG** (1.1K stars): Production-ready RAG platform for enterprise use.
- **Qdrant MCP**: Vector search for memories — useful for building custom knowledge retrieval.

For most projects, Cursor's built-in @codebase search (which uses embeddings) and Claude Code's grep/codebase search tools are sufficient. MCP-based RAG becomes valuable when you need to search beyond the codebase: documentation, design specs, Slack conversations, or external knowledge bases.

### 3.6 Cursor's Context System

Cursor provides several @-mention types for context injection:

- **@file**: Include a specific file's contents in the prompt. Highest precision.
- **@folder**: Include all files in a directory (use with caution — can be large).
- **@codebase**: Semantic search across the entire codebase using embeddings. Cursor uses a custom embedding model for best-in-class recall.
- **@web**: Search the web for current information. Good for documentation lookups.
- **@docs**: Reference indexed documentation from configured sources.

**Optimizing @codebase results**:
- Cursor's codebase indexer works best with well-structured code (clear file names, JSDoc/docstrings, explicit types)
- The embedding model captures semantic meaning, so descriptive function names improve retrieval
- Large codebases (>100K files) may have indexing delays; check indexing status in settings
- `.cursorignore` and `.cursorindexingignore` control what gets indexed — use them to exclude generated files, node_modules, and build artifacts

Source: [Markaicode Guide](https://markaicode.com/cursor-beta-features-2026/), [Prismic Cursor Review](https://prismic.io/blog/cursor-ai)

### 3.7 Claude Code Memory

Claude Code's memory system operates at three levels:

1. **CLAUDE.md files** (explicit, version-controlled): The primary mechanism. Team-shared conventions.
2. **Auto-memory** (implicit, local): Claude Code saves learnings automatically — build commands, debugging patterns, project quirks. Stored locally, not committed to Git.
3. **`.claude/rules/`** (modular, version-controlled): Additional scoped rules for specific contexts.

**Auto-memory management**:
- `/memory show` — Inspect currently loaded memory
- `/memory refresh` — Force reload from disk
- The auto-memory file is configurable via `settings.json`
- Best practice: `.gitignore` auto-memory files (they're personal), version CLAUDE.md and `.claude/rules/` (they're team-shared)

**The "remember" pattern**: During a session, tell Claude Code "remember that we use Biome instead of ESLint" — it saves this to auto-memory for future sessions. Use for lasting personal preferences. Reserve CLAUDE.md for team rules.

Sources: [SFEIR Institute](https://institute.sfeir.com/en/claude-code/claude-code-memory-system-claude-md/deep-dive/), [Claude Code Docs](https://code.claude.com/docs/en/overview)

---

## Section 4: Prompt Patterns Inside IDE Agents

### 4.1 Agent Prompt Structure

Effective agent prompts in `.cursor/agents/*.md` or Claude Code custom agents follow a consistent structure:

```markdown
---
name: [agent-name]
description: "[trigger description — when should this agent fire?]"
tools: [Bash, Read, Write, WebFetch]  # Scoped tool access
model: sonnet  # or opus for complex reasoning
---

# Role
You are a [specific role] specializing in [domain].

# Context
- This project uses [tech stack]
- Key files: [file paths]
- Reference: @[relevant-rule-or-doc]

# Task Protocol
1. [First step — usually "read/search before acting"]
2. [Analysis step]
3. [Implementation step]
4. [Verification step]

# Output Format
- [What the response should look like]
- [File naming conventions]
- [Required sections or artifacts]

# Constraints
- NEVER [anti-pattern]
- ALWAYS [required behavior]
- When uncertain, [fallback behavior]

# Error Handling
- If [condition], then [response]
- If tests fail, [procedure]
```

**Mandatory sections** (based on community experience):
- Role definition (even a brief one improves output)
- Verification step (prevents shipping broken code)
- Constraints with NEVER/ALWAYS (clearest signal to the model)

**Sections that add value when present**:
- Conflict resolution (what to do when rules contradict)
- Decision authority (what the agent can decide vs. what needs human input)
- Context pointers (@file references to relevant code)

### 4.2 Agent Types and Templates

**Code Generator Agent**:
- Focus: Creating new code from specifications
- Key instruction: "Search existing codebase for similar implementations before writing new code"
- Verification: "Run type checker and linter after generating code"
- Common pitfall: Generates code that duplicates existing utilities

**Code Reviewer Agent**:
- Focus: Reviewing diffs for bugs, style violations, and design issues
- Key instruction: "Focus on logic errors, security issues, and performance problems — not formatting"
- Verification: "For each issue found, explain the impact and suggest a specific fix"
- Common pitfall: Produces noise by flagging style issues instead of real bugs

**Architect Agent**:
- Focus: System design decisions, dependency evaluation, pattern selection
- Key instruction: "Consider existing architecture decisions in docs/adr/ before proposing new patterns"
- Verification: "Validate that proposed changes don't break existing interfaces"
- Common pitfall: Over-engineers solutions

**QA/Testing Agent**:
- Focus: Writing and running tests, identifying coverage gaps
- Key instruction: "Read the implementation code thoroughly before writing tests"
- Verification: "Run the test suite and ensure all tests pass before reporting completion"
- Common pitfall: Writes tests that test the implementation rather than the behavior

**Documentation Agent**:
- Focus: Generating and updating documentation
- Key instruction: "Read the actual code — do not document based on assumptions about what the code does"
- Verification: "Verify all code examples in documentation actually compile and run"
- Common pitfall: Documents what the code should do, not what it actually does

### 4.3 Anti-Hallucination Techniques

Hallucinations in coding agents manifest differently from conversational AI hallucinations. The key types and countermeasures:

**"Read before edit" rule**: The single most effective anti-hallucination technique. Force the agent to read the current state of any file before modifying it:
```
ALWAYS read a file's current content before making changes.
NEVER edit a file based on assumptions about its content.
```

**Type-checking as a guardrail**: TypeScript strict mode catches hallucinated interfaces, missing properties, and wrong function signatures immediately. Add to rules:
```
After making changes, run `pnpm typecheck` and fix ALL errors before proceeding.
```

**Linting as reality check**: Lint rules catch hallucinated imports, unused variables, and style violations. Configure auto-run linting after every agent edit.

**Verification steps in agent prompts**:
```
After implementing:
1. Run type checker — fix all errors
2. Run linter — fix all errors  
3. Run relevant tests — ensure they pass
4. If any step fails, debug and fix before reporting completion
```

**Explicit "no assumption" rules**:
```
NO ASSUMPTIONS — Only use: files you've read, user messages, and tool results.
If information is missing, search the codebase, then ask the user.
NEVER guess at import paths, API signatures, or function parameters.
```

**Effectiveness**: Transformative
**Confidence**: High

### 4.4 Task Delegation

For parent agent → sub-agent patterns, the critical challenge is that sub-agents lack the parent's conversational context.

**What works**:
- Write self-contained task descriptions that include all necessary context
- Reference specific file paths rather than "the component we discussed"
- Include acceptance criteria that the sub-agent can verify independently
- Scope tool access per sub-agent (principle of least privilege)

**Three-stage pipeline pattern** (from production Claude Code usage):
1. **pm-spec agent** — Reads task input, writes a structured spec with acceptance criteria
2. **architect-review agent** — Validates spec against platform constraints, produces decision record
3. **implementer-tester agent** — Writes code and tests, updates documentation

Each agent has limited tool access — the spec agent can only Read and Write to docs; the implementer can Bash and Edit.

Source: [DEV Community Guide](https://dev.to/lizechengnet/how-to-structure-claude-code-for-production-mcp-servers-subagents-and-claudemd-2026-guide-4gjn)

### 4.5 Role Prompting Effectiveness

**Does "You are a senior engineer" actually improve coding output?**

The evidence is mixed but leans positive:

**For**: Role prompting helps the model adopt appropriate rigor, vocabulary, and decision-making patterns. "You are a senior security engineer" produces more thorough security reviews than "Review this code for security issues." The role activates relevant knowledge patterns in the model's weights.

**Against**: Overly specific role prompts can narrow the model's response range unnecessarily. "You are a Ruby expert with 20 years of experience" may make the model less willing to suggest that a task is better suited for Python.

**Practical recommendation**: Use brief, relevant role descriptions. "You are a backend engineer specializing in API design" is better than either no role or an elaborate persona. Keep it to one sentence. The value comes from priming relevant knowledge, not from elaborate backstories.

**Effectiveness**: Useful (modest improvement)
**Confidence**: Medium

### 4.6 Extended Thinking

Extended thinking (chain-of-thought reasoning visible to the user) is available in both Cursor and Claude Code with supported models.

**When to enable**:
- Complex architectural decisions
- Debugging multi-step issues
- Designing new systems from scratch
- Tasks where you want to verify the agent's reasoning before it acts

**When not to enable**:
- Simple edits, renames, formatting
- Tasks where speed matters more than reasoning depth
- Straightforward implementations where the approach is obvious

**Measured impact**: Extended thinking with Claude models (Opus tier) produces more correct code on complex tasks but significantly increases latency and cost. For simple tasks, it's overhead.

**Cost/latency tradeoffs**: Extended thinking tokens are charged at reduced rates but still accumulate. A complex architectural discussion with extended thinking can use 10–20× more tokens than a direct implementation.

**Effectiveness**: Situational
**Confidence**: Medium

### 4.7 Prompt Caching

Both Cursor and Claude Code benefit from prompt caching, where identical prompt prefixes across requests hit a cache and reduce latency and cost.

**How to maximize cache hits**:
- Put stable content (rules, CLAUDE.md) at the beginning of the context, not the end
- Keep rules files stable — frequent changes invalidate caches
- System prompts and always-on rules are the most-cached content
- Task-specific content goes after the stable prefix

**In practice**: This is handled automatically by the harness. The main user-facing implication is that stable, well-structured rules files are more efficient than frequently-modified ones.

**Effectiveness**: Useful (cost/latency reduction)
**Confidence**: High

### 4.8 Rule Compliance

What syntax and structure in rules gets the AI to actually follow them?

Based on extensive community testing:

**Highest compliance patterns**:
1. ALL-CAPS headers for critical rules: `## NEVER USE DEFAULT EXPORTS`
2. Numbered execution sequences (models follow ordered lists well)
3. Code examples showing the expected output
4. NEVER/ALWAYS binary constraints (no ambiguity)
5. First-person directives: "You must" beats "The developer should"

**Lowest compliance patterns**:
1. Paragraphs of explanation without clear action items
2. "Consider" or "when appropriate" hedging
3. Rules that contradict the model's strong training priors
4. Rules buried in the middle of a long file (lost in the middle effect)
5. Complex conditional logic: "If X and Y but not Z, then..."

**The feedback loop**: When an agent violates a rule, don't just correct it — strengthen the rule. Add "Reply with 'Applying rules X,Y,Z'" as a compliance verification step (as seen in the Elementor Engineering approach).

Sources: [Elementor Engineering](https://medium.com/elementor-engineers/cursor-rules-best-practices-for-developers-16a438a4935c), [Cursor Forum](https://forum.cursor.com/t/optimal-structure-for-mdc-rules-files/52260)

---

## Section 5: Agent Architecture Patterns

### 5.1 Single vs Multi-Agent

**Single agent** is better when:
- The task is self-contained and fits in one context window
- The task requires tight coordination between steps
- Speed is more important than thoroughness
- The codebase is small enough for one agent to understand

**Multi-agent** is better when:
- The task has naturally independent subtasks
- Different subtasks require different expertise or tool access
- The task is too large for one context window
- You want to apply principle of least privilege to tool access

**Evidence**: Claude Code's introduction of up to 10 simultaneous subagents (2026) was motivated by production experience showing that parallel specialization produces better results than sequential single-agent execution for complex tasks. The key win is not just speed — it's that each subagent has a focused context window free of irrelevant information from other subtasks.

**Effectiveness**: Transformative (multi-agent for complex tasks)
**Confidence**: High

### 5.2 Specialization Patterns

**Minimum viable agent set for a mature project**:

1. **Research agent** (built into Cursor by default) — Explores codebase, reads files, builds context
2. **Implementation agent** (default) — Writes and edits code
3. **Testing agent** — Writes tests, runs test suite, reports coverage gaps
4. **Review agent** — Reviews diffs for bugs, security issues, design problems

**Extended set for larger teams**:
5. **Documentation agent** — Generates and updates docs from code changes
6. **DevOps agent** — Handles deployment, CI/CD, infrastructure
7. **Security agent** — Scans for vulnerabilities, reviews auth flows (Cursor's security automation templates catch 200+ vulnerabilities/week)

**When NOT to specialize**: Don't create 15 narrow agents for a small project. The overhead of managing agent definitions, maintaining their prompts, and choosing the right agent per task exceeds the benefit. Start with the minimum set and add specialists when you feel actual pain.

Source: [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)

### 5.3 Agent Orchestration

The Command → Agent → Skill pattern from Claude Code best practices:

1. **Command**: The user invokes a slash command or prompt
2. **Agent**: The appropriate agent (or subagent) activates
3. **Skill**: The agent loads relevant skills for domain-specific knowledge

**Context passing between agents**:
- Use `context: fork` to run a skill in an isolated subagent — the main context only sees the final result, not intermediate tool calls
- Write intermediate results to files (specs, decision records) that subsequent agents read
- Don't pass conversation history between agents — pass artifacts

**Result aggregation**: The orchestrator (Claude Code itself, or the parent agent in Cursor) coordinates multi-agent workflows, assigns subtasks, and merges results.

### 5.4 Best-of-N Patterns

Running parallel attempts and selecting the best result. Cursor's internal architecture uses this approach.

**When this is worth the additional cost**:
- Critical code paths where correctness matters more than speed
- Design decisions with multiple valid approaches
- When the first attempt is likely to miss edge cases

**Implementation**: Create multiple subagents with the same task but different approaches (one test-first, one implementation-first, one starting with research). Compare outputs and select the best.

**Effectiveness**: Situational (high cost, high quality for critical paths)
**Confidence**: Low — Limited public evidence on developer-facing best-of-N patterns.

### 5.5 Task Decomposition

How to break complex coding tasks for multi-step agent execution:

**Granularity guidelines**:
- Each subtask should be completable in one agent session
- Each subtask should have verifiable acceptance criteria
- Subtasks should be as independent as possible (minimal cross-dependencies)
- Prefer horizontal slicing (feature complete end-to-end) over vertical slicing (all models, then all routes, then all UI)

**Decomposition template**:
```
Task: [high-level description]

Subtask 1: [name]
- Input: [what this subtask needs]
- Output: [what this subtask produces]
- Acceptance criteria: [how to verify completion]
- Dependencies: [other subtasks that must complete first]

Subtask 2: [name]
...
```

### 5.6 Error Recovery

What to do when agents produce incorrect code, go off track, or get stuck in loops:

**Detection patterns**:
- Agent apologizes repeatedly (sign of confusion)
- Same error appears after multiple "fix" attempts (stuck in a loop)
- Agent starts modifying unrelated files (lost context)
- Output quality degrades noticeably (context exhaustion)

**Recovery strategies**:
1. **Start a new session** — Most effective. Fresh context eliminates accumulated confusion.
2. **Reduce scope** — "Focus only on [specific file]" narrows the problem space.
3. **Provide explicit correction** — "Stop. The issue is [X]. The fix is to change [Y] in [file]."
4. **Switch models** — Sometimes a different model approaches the problem differently.
5. **Manual intervention** — Fix the blocking issue yourself, then resume agent work.

**Post-recovery**: After a significant agent failure, add the learned pitfall to your CLAUDE.md or create a rule to prevent recurrence.

---

## Section 6: Project Organization for AI-First Development

### 6.1 File and Folder Structures

AI agents navigate projects better when the structure is predictable and well-named.

**Structures that work well**:
```
src/
  app/           # Routes / pages (Next.js App Router)
  components/    # Shared React components
  lib/           # Utility functions and clients
  hooks/         # Custom React hooks
  types/         # TypeScript type definitions
  services/      # Business logic
  db/            # Database schema and migrations
docs/
  architecture/  # ADRs and system design
  api/           # API documentation
tests/
  e2e/           # End-to-end tests
  integration/   # Integration tests
```

**Key principles**:
- **Colocation**: Tests next to source files (`user.ts` and `user.test.ts` in the same directory) gives agents immediate context
- **Explicit naming**: `getUserById.ts` is better than `utils.ts` for AI retrieval
- **Index files as navigation**: `index.ts` barrel exports help agents discover available functionality
- **Flat within reason**: Deep nesting (5+ levels) makes path references verbose and error-prone in prompts

### 6.2 TypeScript Patterns

TypeScript with strict mode gives AI the richest context for code generation.

**Patterns that improve AI output**:
- **`strict: true`** in tsconfig — Eliminates implicit `any`, forces explicit types
- **Explicit return types** on all exported functions — AI can verify its output matches expected types
- **Interface-first design** — Define interfaces before implementations; AI generates implementations from interfaces more reliably than reverse-engineering types from implementations
- **Barrel exports** — `export { UserService } from './user.service'` in index files helps AI discover available modules
- **Zod schemas alongside types** — Runtime validation schemas give AI both type information and validation rules

```typescript
// Good: AI has maximum context
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
  // AI knows the input shape, output shape, and validation rules
}
```

### 6.3 Documentation Standards

Documentation that serves both humans and AI:

**JSDoc**: Write JSDoc on all exported functions. AI reads these to understand function purpose, parameters, and return values without needing to read the implementation.

```typescript
/**
 * Creates a new user account and sends a welcome email.
 * @param input - Validated user creation data
 * @returns The created user with generated ID
 * @throws {ConflictError} If email is already registered
 */
export async function createUser(input: CreateUserInput): Promise<User> {
```

**README placement**: Every significant directory should have a brief README explaining its purpose, key files, and conventions. This dramatically improves @folder retrieval quality.

**Architecture Decision Records (ADRs)**: Store in `docs/architecture/` as numbered markdown files. AI agents reference these when making design decisions:
```
docs/architecture/
  001-app-router.md
  002-postgres-over-mongodb.md
  003-zustand-state-management.md
```

### 6.4 Monorepo Patterns

For monorepos with AI-assisted development:

**Workspace-scoped rules**: Use glob patterns in `.cursor/rules/*.mdc` to target specific packages:
```yaml
---
globs: ["packages/api/**"]
description: "API package conventions — Express routes and middleware"
---
# API Package Rules
- All routes use express.Router()
- Middleware chain: auth → validate → handler → error
- Response format: { data, error, meta }
```

**Package-level CLAUDE.md**: Place CLAUDE.md files in individual packages for package-specific conventions. Claude Code's hierarchy means the package-level file takes precedence when working in that package, while the root CLAUDE.md provides project-wide context.

**Shared types package**: A `packages/shared-types/` package that all other packages depend on gives AI a single source of truth for types. This prevents the agent from creating duplicate type definitions in different packages.

**Cross-package navigation**: Barrel exports in each package root make it easy for AI to discover available functionality. An `index.ts` in `packages/auth/` that re-exports all public APIs helps the agent understand what the auth package provides without reading every file.

**Monorepo-specific rules to add**:
```
- When modifying shared packages, check all consuming packages for breakage
- Run `pnpm --filter <package> test` to test specific packages
- Cross-package imports use workspace protocol: `@acme/shared-types`
- Never create circular dependencies between packages
```

### 6.5 Config Patterns AI Agents Leverage

Configuration files that AI agents read and benefit from:

**tsconfig.json with strict mode**: AI agents read tsconfig to understand path aliases, strict mode settings, and target output. Ensure `strict: true`, `noImplicitAny: true`, and path aliases are configured:
```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

**ESLint / Biome configuration**: AI agents reference linting config to understand project conventions. When the agent sees that `no-unused-vars` is an error, it avoids leaving unused imports. Biome is increasingly preferred because it can auto-fix more issues, creating a tighter feedback loop when the agent runs the linter after edits.

**Prettier / formatting config**: Less critical (the agent can follow explicit formatting rules), but having a `.prettierrc` means the agent can run the formatter rather than trying to format code itself — which is more reliable.

**.env.example**: AI agents should never access `.env` directly, but `.env.example` tells the agent what environment variables exist without exposing values. Reference this in your CLAUDE.md: "See .env.example for required environment variables."

---

## Section 7: Quality & Accuracy Maximization

### 7.1 Grounding Techniques

**Ensuring AI-generated code actually compiles and works**:

1. **Read-before-edit** (see 4.3): The foundation of grounded code generation
2. **Type-checking in the loop**: Run `tsc --noEmit` after every agent edit; feed errors back
3. **Linting in the loop**: Run the linter after every edit; auto-fix when possible (Biome is preferred for auto-fixing capability)
4. **Test execution**: Run relevant tests after implementation
5. **Build verification**: Ensure the project builds after changes

**The grounding pipeline** (add to rules):
```
After every code change:
1. Save all modified files
2. Run `pnpm typecheck` — fix all type errors
3. Run `pnpm lint:fix` — auto-fix lint issues
4. Run affected tests — fix any failures
5. Only report completion when all checks pass
```

**Effectiveness**: Transformative
**Confidence**: High

### 7.2 Test-Driven AI Development

**Pattern**: Write tests first, then let AI implement to pass them.

**Evidence**: This pattern produces higher-quality AI output because:
- Tests serve as unambiguous specifications
- The AI can verify its own output against the tests
- Edge cases are defined upfront rather than discovered later
- The implementation is grounded in concrete expectations

**Workflow**:
1. Human writes test cases covering requirements and edge cases
2. AI implements to pass all tests
3. Human reviews the implementation
4. AI adjusts based on review feedback

**When this works best**: Greenfield functions with clear input/output contracts. Less effective for UI components, integration points, or refactoring existing code.

**Effectiveness**: Useful
**Confidence**: Medium

### 7.3 Hallucination Patterns in Coding

The most common AI coding hallucinations and how to prevent each:

**Phantom imports**: The AI imports from packages that don't exist in the project or uses incorrect import paths.
- Prevention: Rule — "Only import from packages listed in package.json. Verify import paths by reading the source file."
- Detection: Type checker catches immediately

**Non-existent APIs**: The AI uses methods, properties, or parameters that don't exist on the libraries being used.
- Prevention: Rule — "When using library APIs, verify the method exists. Check against @docs or the library's type definitions."
- Detection: Type checker catches most; some runtime-only APIs need testing

**Wrong function signatures**: The AI calls functions with incorrect argument count, wrong types, or in wrong order.
- Prevention: Rule — "Read function signatures before calling them. Never guess at parameters."
- Detection: Type checker catches in TypeScript

**Invented package names**: The AI suggests installing packages that don't exist on npm.
- Prevention: Rule — "Never suggest installing a package without verifying it exists. Use `npm search [package]` to confirm."
- Detection: Manual review or npm install failure

**Outdated API patterns**: The AI uses deprecated patterns from older library versions.
- Prevention: Include framework version in rules. "This project uses Next.js 15 with App Router — NEVER suggest Pages Router patterns."
- Detection: Deprecation warnings in linter output

**Conflated patterns from different frameworks**: The AI mixes patterns from React and Vue, or Express and Fastify.
- Prevention: Explicit framework specification in rules with examples.
- Detection: Usually caught by type checker or runtime errors

### 7.4 Code Review with AI

**Patterns that catch real bugs**:
- Security-focused review: "Review this diff for SQL injection, XSS, CSRF, and authentication bypass vulnerabilities"
- Logic review: "Walk through each conditional branch and verify the logic handles all edge cases"
- Performance review: "Identify any N+1 queries, unnecessary re-renders, or O(n²) operations"

**Patterns that produce noise**:
- Generic "review this code" prompts produce vague feedback
- Style-focused reviews overlap with linters (let the linter handle formatting)
- Reviews without access to the full context (reviewing a diff without seeing the surrounding code)

**Best practice**: Use a dedicated code review agent with access to the full file context, not just the diff. Point it at specific concern areas rather than asking for general feedback.

### 7.5 Validation Strategies

Systematic approaches to verify AI-generated code before committing:

1. **Automated checks**: Type checking + linting + tests (the grounding pipeline)
2. **Diff review**: Read every line of the generated diff. AI makes subtle errors that pass automated checks.
3. **Behavioral testing**: Run the application and manually test the changed functionality
4. **Boundary testing**: Check edge cases, null inputs, error paths
5. **Integration testing**: Verify the change works with the rest of the system

**The "prove it works" pattern**: Ask the agent "prove to me this works" — it will diff between main and your branch, run tests, and demonstrate the functionality. This adversarial check catches issues the agent might not surface proactively.

---

## Section 8: Tools & Workflow Optimization

### 8.1 Cost Optimization

**Task-to-model matching strategy**:

| Task Type | Recommended Model | Rationale |
|-----------|------------------|-----------|
| Simple edits, renames, formatting | Fast/cheap (Cursor's built-in, Haiku) | Speed matters, complexity is low |
| Standard implementation | Sonnet-tier (Claude Sonnet 4, GPT-4o) | Best cost/quality balance |
| Complex architecture, debugging | Opus-tier (Claude Opus, o3) | Reasoning depth needed |
| Code review | Sonnet-tier | Sufficient for pattern matching |
| Planning, design decisions | Opus-tier with extended thinking | Worth the cost for correctness |

**Cost reduction techniques**:
- Use Plan Mode to reduce back-and-forth token usage
- Start new sessions instead of extending long ones
- Use scoped rules (glob-based) to reduce always-loaded context
- Leverage prompt caching by keeping rules files stable
- Use subagents with cheaper models for mechanical subtasks

### 8.2 Speed Optimization

**Parallel task execution**: Use multiple subagents or background agents for independent tasks. Cursor supports this natively with subagents; Claude Code supports up to 10 simultaneous subagents.

**Background agents**: Cursor Automations (2026) run agents in cloud sandboxes triggered by events. Use for:
- Automated PR review on push
- Scheduled security scanning
- Dependency update monitoring
- Test suite execution

**Session management**: Start fresh sessions for each task. Don't wait for context exhaustion.

**@-mention precision**: `@src/api/users.ts` is faster than letting the agent search the codebase for the relevant file.

### 8.3 Git Workflows

**Branching for AI-assisted development**:
- Create feature branches before starting agent work
- Let background agents work on their own branches
- Use conventional commits for AI-generated changes (the agent can follow a commit convention rule)

**Claude Code git integration**:
- "Challenge: grill me on these changes and don't make a PR until I pass your test"
- "Diff between main and my branch, explain every change"
- Git worktrees for parallel agent development (each agent gets its own worktree)

**Rules for git behavior**:
```markdown
## Git Conventions
- Commit messages: conventional commits format (feat:, fix:, chore:)
- One logical change per commit
- Never commit without running the test suite
- Always rebase on main before creating a PR
```

### 8.4 Team Workflows

**Sharing AI context configurations**:

1. **Version control**: Commit `.cursor/rules/`, `AGENTS.md`, `CLAUDE.md`, `.cursor/mcp.json` to Git
2. **Personal overrides**: `.cursor/rules/personal.mdc` in `.gitignore` for individual preferences
3. **Onboarding**: New team members get the team's AI configuration automatically on clone
4. **Review process**: PRs that modify AI context files should be reviewed by the team — these files affect everyone's AI behavior
5. **Team Marketplace** (Cursor 2026): Share skills, agents, and automations across your organization

**The onboarding pattern**: A well-maintained AGENTS.md + CLAUDE.md serves as onboarding documentation for both humans and AI agents. A new developer cloning the repo gets the same AI assistance quality as a veteran team member because the context files encode the team's accumulated knowledge.

**Context file review checklist** (for PRs modifying AI context):
- Does the new rule/instruction apply to >80% of sessions? If not, should it be glob-scoped?
- Is the instruction specific and testable? ("Use Zustand for client state" vs "use appropriate state management")
- Does it conflict with any existing rules?
- Is the token budget still reasonable? (Check total line count of alwaysApply rules)
- Are code examples up to date with current project patterns?

**Handling disagreements**: When team members prefer different AI behaviors, use the personal override pattern. Project rules define the team standard; personal `.cursor/rules/personal.mdc` (gitignored) overrides individual preferences. This mirrors how teams handle editor settings: shared ESLint config + personal editor preferences.

### 8.5 Extensions and Complementary Tools

**Biome** (linter/formatter): Increasingly preferred over ESLint + Prettier because it auto-fixes more issues. AI agents benefit from a linter that can self-correct — the agent runs `biome check --write` and most formatting/style issues resolve without another round-trip.

**Conventional Commits**: Enforce via rules ("All commits use conventional commit format: feat:, fix:, chore:, refactor:"). AI agents follow this reliably when stated as a rule.

**Husky + lint-staged**: Pre-commit hooks catch issues before they hit the repo. Add to rules: "Pre-commit hooks run typecheck and lint — if they fail, fix the errors before trying to commit again."

**GitHub Actions for AI validation**: Some teams add CI checks that verify CLAUDE.md references are accurate — checking that file paths mentioned in context files actually exist and that commands actually run.

---

## Section 9: Latest Innovations (March 2026)

### 9.1 Cursor Latest

**Cursor 2.0 / Composer 2** (early 2026): Complete interface overhaul with agent-centric design. Frontier-level coding performance on challenging tasks.

**Subagents and Skills** (v2.4): Independent parallel agents with scoped context and tools. Skills for on-demand procedural knowledge. Image generation from agent prompts.

**Cursor Automations** (Feb/Mar 2026): Event-driven background agents. Cloud sandbox execution. Webhook triggers from GitHub, Slack, Linear. Memory across runs. Security automation templates.

**Cloud Agents with Computer Use**: Agents get virtual machines with browser access, ability to visually verify their work. Screen recordings of agent runs attached to PRs.

**Bugbot Autofix** (Feb 2026): Graduated from reviewer to fixer — finds issues in PRs, spins up a cloud agent, tests a fix, and proposes it directly.

**JetBrains IDE Support** (Mar 2026): Cursor available in IntelliJ, PyCharm, WebStorm via Agent Client Protocol (ACP).

**Fast Local Code Search**: New text indexing for large repos that speeds up regex matching for agentic workflows.

**Self-Hosted Cloud Agents**: Keep code and tool execution in your own network.

Sources: [Cursor Changelog](https://cursor.com/changelog), [Markaicode](https://markaicode.com/cursor-beta-features-2026/), [Releasebot](https://releasebot.io/updates/cursor)

### 9.2 Claude Code Latest

**Claude Code v2.0** (January 2026): Memory files support importing modular rules via `.claude/rules/`. Enhanced auto-memory system.

**Context Editing** (2026): Automatically clears stale tool call outputs. Cut token consumption by 84% in evaluation.

**Up to 10 Simultaneous Subagents**: Parallel execution for complex tasks with specialized agents.

**Agent SDK**: Build custom agents powered by Claude Code's tools and capabilities, with full control over orchestration.

**Hooks**: Run shell commands before/after Claude Code actions — auto-formatting after file edits, linting before commits.

**Desktop App and Web Access**: Beyond the terminal CLI and VS Code extension.

Sources: [Claude Code Docs](https://code.claude.com/docs/en/overview), [SFEIR Institute](https://institute.sfeir.com/en/claude-code/claude-code-memory-system-claude-md/)

### 9.3 New MCP Servers

**Context7** (upstash/context7, 50K stars): The breakout MCP of 2025–2026. Up-to-date code documentation for LLMs. Widely adopted as the go-to documentation MCP.

**Cognee** (15K stars): Production-ready AI memory management with graph RAG, vector search, and 30+ data format support.

**MCPX/Lunar** (410 stars): Production-ready gateway for managing MCP servers at scale — centralized tool discovery and access management.

**Microsoft MCP Gateway** (540 stars): Reverse proxy and management layer for MCP servers with session-aware routing.

**30+ Cursor Partner Plugins** (Mar 2026): Atlassian, Datadog, GitLab, Glean, Hugging Face, monday.com, PlanetScale, and more added as native plugins.

Sources: [best-of-mcp-servers](https://github.com/tolkonepiu/best-of-mcp-servers), [Cursor Changelog](https://cursor.com/changelog)

### 9.4 Community Innovations

**The "interview then execute" pattern**: Start with a minimal spec, ask Claude Code to interview you using the AskUserQuestion tool, then start a new session with the complete spec to execute. Separates planning from implementation context.

**Agent teams with git worktrees**: Use tmux and git worktrees for parallel development — each agent gets its own working directory and branch. Multiple agents can work simultaneously without conflicts.

**Dynamic skill injection**: Embed `!`command`` in SKILL.md to run shell commands at invocation time. The agent sees only the output, keeping the skill prompt fresh with current project state.

**Cursor Blame for AI attribution**: Distinguishes between code from Tab completions, agent runs (broken down by model), and human edits. Tracks AI usage patterns across a team's codebase.

Sources: [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice), [Cursor Changelog](https://cursor.com/changelog)

### 9.5 Obsolete Patterns

| Obsolete Pattern | Replacement | When It Changed |
|---|---|---|
| Single `.cursorrules` file | `.cursor/rules/*.mdc` multi-file | 2025 |
| Manual-only context inclusion | Tiered auto-loading + skills | v2.4, early 2026 |
| One agent per session | Parallel subagents (up to 10) | 2026 |
| No persistent memory | Auto-memory + `/memory` commands | Claude Code v2.0, Jan 2026 |
| Generic "review this code" prompts | Specialized review agents with scoped tool access | 2025–2026 |
| Stuffing everything in CLAUDE.md | Progressive disclosure: CLAUDE.md (core) + rules (scoped) + skills (on-demand) | 2026 |
| Cursor as editor-only | Cursor on JetBrains (ACP), web, mobile, Slack | Mar 2026 |
| Copy-paste between AI and tools | MCP server integration | 2025–2026 |

---

## Anti-Patterns & Myths

### Myth 1: More Context Is Always Better
**Reality**: Beyond ~2,000 tokens of always-on rules, additional context degrades output quality due to the "lost in the middle" effect and Claude Code's system reminder that flags potentially irrelevant content.
**Evidence**: HumanLayer's analysis of Claude Code's harness found the system prompt already contains ~50 instructions, consuming nearly a third of the instruction budget.
**What To Do Instead**: Aggressive curation. Target 80–150 lines for CLAUDE.md. Move non-universal rules to glob-scoped or on-demand.

### Myth 2: AI Agents Don't Need Rules — They're Smart Enough
**Reality**: Without rules, agents default to generic patterns from training data: default exports, Pages Router, npm, loose TypeScript. They also eagerly agree with everything you say instead of pushing back.
**Evidence**: Elementor Engineering reported weeks of reinforcement learning to shape rules that turned the agent "from a yes-man into a reliable teammate."
**What To Do Instead**: Invest time upfront in rules. The first week of corrections should become permanent rules.

### Myth 3: .cursorrules Is Still Fine
**Reality**: .cursorrules works but is deprecated. It loads everything into every interaction, wastes tokens, and cannot scope rules to specific file types or directories.
**Evidence**: Cursor's official documentation recommends `.cursor/rules/*.mdc` as the current standard.
**What To Do Instead**: Migrate to multi-file MDC format with frontmatter. Keep one alwaysApply base rule; scope everything else.

### Myth 4: You Should Let AI Write Your CLAUDE.md
**Reality**: Claude's `/init` generates a CLAUDE.md, but it includes obvious information (yes, this is a TypeScript project — visible from package.json) that wastes tokens.
**Evidence**: HumanLayer blog: "delete most of what it generates. Every line in CLAUDE.md competes for attention with the actual work."
**What To Do Instead**: Use `/init` as a starting point, then cut 70%. Keep only what the agent would get wrong without the file.

### Myth 5: One Giant Agent Can Do Everything
**Reality**: Single-agent approaches fail for complex tasks because the context window fills with irrelevant information from earlier subtasks.
**Evidence**: Claude Code's subagent architecture was specifically designed to address this — separate context windows per subtask produce better results.
**What To Do Instead**: Use subagents for complex tasks. Each subagent gets focused context and scoped tool access.

### Myth 6: MCP Servers Are Plug-and-Play Reliable
**Reality**: The official reference implementations are explicitly "not production-ready." Many community MCP servers are experimental, poorly maintained, or abandoned.
**Evidence**: The modelcontextprotocol/servers README warns about security risks and educational intent.
**What To Do Instead**: Vet every MCP server before adding it. Check star count, last commit date, open issues. Start with the production-tested ones (GitHub, Postgres, Filesystem, Context7).

### Myth 7: Background Agents Can Replace Human Oversight
**Reality**: Background agents work best with well-structured, modern codebases. Legacy monoliths with inconsistent conventions need more manual steering.
**Evidence**: Cursor's own documentation notes this limitation.
**What To Do Instead**: Use background agents for well-defined, automatable tasks (PR review, security scanning, dependency updates). Keep humans in the loop for design decisions.

### Myth 8: Longer, More Detailed Rules Work Better
**Reality**: In the token economy, every word costs. Verbose rules waste context budget and get filtered by Claude's relevance detection.
**Evidence**: Community consensus: "martial arts tone — short, direct, no fluff." Conciseness trumps exhaustiveness.
**What To Do Instead**: One concern per rule. Imperative commands. Code examples over prose explanations.

### Myth 9: AI Can Self-Verify Its Own Code Without Tools
**Reality**: Without type checking, linting, and test execution, AI-generated code frequently contains subtle errors that the model cannot detect through reasoning alone.
**Evidence**: Hallucination patterns (phantom imports, non-existent APIs) are undetectable by the model but trivially caught by tooling.
**What To Do Instead**: Always include verification steps in agent prompts. Type check → lint → test → only then report completion.

### Myth 10: Role Prompting Is Either Essential or Useless
**Reality**: Brief, relevant role descriptions produce modest but measurable improvements. Elaborate persona prompts waste tokens without proportional benefit.
**Evidence**: Mixed experimental results across the research community, but consistent practitioner reports of modest benefit from brief role prompts.
**What To Do Instead**: One sentence of relevant role context. "You are a backend engineer specializing in API design." No elaborate backstories.

### Myth 11: You Need Every MCP Server
**Reality**: Each MCP server adds configuration complexity, potential failure points, and security surface area. Most projects need 2–4 MCP servers.
**Evidence**: The MCP ecosystem has 1,200+ servers, but production teams consistently report using fewer than 5.
**What To Do Instead**: Start with zero MCP servers. Add one at a time when you find yourself repeatedly copy-pasting between AI and a specific tool. GitHub + Database + Search covers most needs.

---

## The Ideal Context Architecture Blueprint

A copy-ready directory structure for a new project:

```
project-root/
├── .cursor/
│   ├── rules/
│   │   ├── base.mdc              # Always-apply core conventions
│   │   ├── frontend.mdc          # Glob-scoped: src/components/**, src/app/**
│   │   ├── api.mdc               # Glob-scoped: src/app/api/**
│   │   ├── testing.mdc           # Glob-scoped: **/*.test.ts, **/*.spec.ts
│   │   ├── database.mdc          # Glob-scoped: src/db/**, prisma/**
│   │   └── personal.mdc          # .gitignored — personal preferences
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
│   │   ├── review-pr.md          # Slash command for PR review
│   │   ├── deploy-staging.md     # Slash command for staging deploy
│   │   └── tech-debt.md          # Slash command for tech debt audit
│   └── rules/
│       └── migration.md          # Temporary migration-specific rules
├── AGENTS.md                      # Cross-IDE standard (all tools read this)
├── CLAUDE.md                      # Claude Code-specific memory
├── .gitignore                     # Includes .cursor/rules/personal.mdc
└── src/
    └── ...
```

### Example: base.mdc

```yaml
---
alwaysApply: true
description: "Core project conventions applied to every interaction"
---
# EXECUTION PROTOCOL
1. SEARCH FIRST — grep/search for existing patterns before implementing
2. REUSE FIRST — extend existing code before creating new
3. NO ASSUMPTIONS — only use files read, user messages, tool results
4. VERIFY — run typecheck and lint after every change

# CORE CONVENTIONS
- TypeScript strict mode — NEVER use `any`
- Named exports only — NEVER use default exports
- pnpm as package manager — NEVER use npm or yarn
- ES modules — NEVER use CommonJS require()

# COMMANDS
- Dev: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm lint:fix`
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
```

### Example: frontend.mdc

```yaml
---
globs:
  - "src/components/**"
  - "src/app/**"
  - "!src/app/api/**"
description: "Frontend conventions for React/Next.js components"
---
# FRONTEND RULES
- Next.js 15 App Router — NEVER suggest Pages Router
- Server Components by default — add 'use client' only when needed
- Tailwind CSS for all styling — no inline styles, no CSS modules
- shadcn/ui for primitives — NEVER modify files in components/ui/
- Zustand for client state — React Query for server state
- All components: explicit prop types with interfaces (not type aliases)
```

### Example: CLAUDE.md

```markdown
# Project: Acme E-Commerce

Next.js 15 e-commerce platform with Stripe, Postgres (Prisma), and Clerk auth.

## Commands
- `pnpm dev` — dev server on port 3000
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright E2E tests
- `pnpm db:migrate` — run Prisma migrations
- `pnpm db:seed` — seed development database

## Architecture
- App Router with RSC (React Server Components)
- API routes at src/app/api/ (thin handlers calling services)
- Business logic in src/services/ (never in components or routes)
- Database queries in src/db/queries/ (Prisma, never raw SQL)

## Key Pitfalls
- Stripe webhook handler MUST verify signatures (src/app/api/webhooks/stripe)
- All prices stored in cents (integer) — convert for display only
- Auth middleware runs on all /api routes except /api/webhooks
- Environment: .env.local for dev, Vercel env vars for production
```

### Example: AGENTS.md

```markdown
# AGENTS.md

## Project
Acme E-Commerce — Next.js 15, TypeScript, Prisma, Stripe, Clerk

## Conventions
- Named exports only
- Functional components with TypeScript interfaces
- Zod validation on all API inputs
- Conventional commits (feat:, fix:, chore:)

## Structure
- src/app/ — Next.js routes
- src/components/ — React components
- src/services/ — Business logic
- src/db/ — Prisma schema and queries
- src/types/ — Shared TypeScript types

## Testing
- Unit: Vitest (colocated *.test.ts files)
- E2E: Playwright (tests/e2e/)
- Run: `pnpm test` (unit), `pnpm test:e2e` (E2E)
```

### Example: .cursor/agents/reviewer.md

```yaml
---
name: code-reviewer
description: "Reviews code diffs for bugs, security issues, and design problems. Invoke when reviewing PRs or before committing."
tools: [Read, Bash, WebFetch]
model: sonnet
---
# Role
You are a senior code reviewer specializing in TypeScript/Next.js applications.

# Review Protocol
1. Read the full diff: `git diff main...HEAD`
2. For each changed file, read the surrounding context (not just the diff)
3. Check for: logic errors, security vulnerabilities, performance issues, type safety
4. Verify imports exist and are correct
5. Check that error handling covers all failure modes
6. Verify tests exist for new functionality

# Output Format
For each issue found:
- **File**: [path]
- **Line**: [number]
- **Severity**: Critical / Warning / Suggestion
- **Issue**: [one-line description]
- **Fix**: [concrete suggestion]

# What NOT To Review
- Formatting (the linter handles this)
- Style preferences (the rules handle this)
- Obvious things that the type checker would catch

# Constraints
- NEVER approve code with unhandled promise rejections
- NEVER approve code that logs sensitive data
- ALWAYS flag raw SQL queries (should use Prisma)
- If you find zero issues, say so — don't invent problems
```

### Example: .cursor/skills/deployment/SKILL.md

```markdown
---
description: "How to deploy to staging and production environments. Use when the user asks about deployment, releasing, or pushing to staging/production."
---
# Deployment Skill

## Staging Deployment
1. Ensure all tests pass: `pnpm test && pnpm test:e2e`
2. Build the project: `pnpm build`
3. Deploy to staging: `vercel --env staging`
4. Verify staging URL responds: `curl -s https://staging.acme.com/api/health`

## Production Deployment
1. Create a release PR with conventional commit summary
2. Ensure staging has been tested and approved
3. Merge to main — Vercel auto-deploys production
4. Monitor Sentry for errors in first 30 minutes

## Rollback Procedure
1. In Vercel dashboard: Deployments → Previous → Promote
2. Or via CLI: `vercel rollback`
3. Notify team in #engineering Slack channel

## Gotchas
- Database migrations must be run BEFORE deploying code that depends on them
- Environment variables differ between staging and production — check .env.example
- The CDN cache takes 5 minutes to invalidate after deploy
```

### Example: .claude/commands/review-pr.md

```markdown
Review the current PR by doing the following:

1. Run `git diff main...HEAD` to see all changes
2. Read each changed file in full (not just the diff)
3. Check for:
   - Logic errors and edge cases
   - Security issues (SQL injection, XSS, auth bypass)
   - Performance problems (N+1 queries, unnecessary re-renders)
   - Missing error handling
   - Missing tests for new functionality
4. Run `pnpm typecheck` and `pnpm lint` to catch mechanical issues
5. Summarize findings with severity (Critical/Warning/Suggestion)
6. If all checks pass, say "LGTM — ready to merge"
```

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./src", "./docs"]
    }
  }
}
```

---

## MCP Server Directory

| Name | Category | What It Does | Quality | URL | When To Use | When To Avoid |
|------|----------|-------------|---------|-----|-------------|---------------|
| GitHub MCP | Git/VCS | Repo access, issues, PRs, code search | Production-ready | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Team uses GitHub for project management | Rarely — low overhead |
| Playwright MCP | Browser | Browser automation, screenshots, form filling | Production-ready | [playwright-community/mcp-playwright](https://github.com/playwright-community/mcp-playwright) | E2E testing, web scraping, visual verification | Simple projects without web interaction |
| PostgreSQL MCP | Database | Schema inspection, query execution (read-only default) | Production-ready | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Database-backed projects | Projects without PostgreSQL |
| SQLite MCP | Database | SQLite operations, analysis, Datasette-compatible | Production-ready | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Local development, prototyping | Production database work |
| Neon MCP | Database | Serverless Postgres with natural language management | Production-ready | [neondatabase/mcp-server-neon](https://github.com/neondatabase/mcp-server-neon) | Neon-hosted databases | Other Postgres hosts |
| Supabase MCP | Database + BaaS | Full Supabase platform — DB, auth, storage | Beta | Supabase official | Supabase-based projects | Non-Supabase stacks |
| Filesystem MCP | File System | Local file access with directory restrictions | Production-ready | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Any MCP client needing file access | IDE already has native file tools |
| Context7 | Docs/Knowledge | Up-to-date code docs for LLMs (50K stars) | Production-ready | [upstash/context7](https://github.com/upstash/context7) | Any project needing current library docs | Small projects with few dependencies |
| Brave Search MCP | Search | Web search via Brave API | Production-ready | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Research, documentation lookup | Projects with no web research needs |
| Fetch MCP | Web | Web content fetching and processing | Production-ready | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Scraping, content ingestion | Simple projects |
| Sentry MCP | Monitoring | Error tracking, performance monitoring | Production-ready | Sentry official | Production apps with Sentry | Apps without error tracking |
| Datadog MCP | Monitoring | Metrics, monitoring, alerting | Beta | Datadog / Cursor plugin | Datadog-monitored infrastructure | Non-Datadog setups |
| Figma MCP | Design | Design file access, component inspection | Beta | Figma official | Design-to-code workflows | Text-heavy projects |
| Slack MCP | Communication | Channel management, messaging | Beta | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Team communication integration | Solo developers |
| Linear MCP | Project Mgmt | Issue tracking system integration | Beta | Linear official | Linear-based project management | Non-Linear teams |
| Vercel MCP | Deployment | Vercel platform management | Beta | Vercel official | Vercel-deployed projects | Other hosting providers |
| GitKraken MCP | Git + PM | Wraps GitKraken, Jira, GitHub, GitLab | Beta | [gitkraken](https://github.com/gitkraken) | Multi-platform project management | Simple Git-only workflows |
| Cognee | Memory/RAG | AI memory with graph + vector stores (15K stars) | Production-ready | [topoteretes/cognee](https://github.com/topoteretes/cognee) | Large knowledge bases, enterprise RAG | Small projects |
| Qdrant MCP | Memory | Vector search for memories | Beta | Qdrant official | Custom knowledge retrieval | Projects without vector search needs |
| MCPX/Lunar | Gateway | MCP server management at scale (410 stars) | Production-ready | [TheLunarCompany/lunar](https://github.com/TheLunarCompany/lunar) | Enterprise with many MCP servers | Small teams with few servers |
| Puppeteer MCP | Browser | Browser automation via Puppeteer | Beta | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Simple browser tasks | Prefer Playwright for production |
| MongoDB MCP | Database | MongoDB collection querying and analysis | Beta | Community | MongoDB-based projects | Relational database projects |
| Notion MCP | Knowledge | Notion API integration for docs and tasks | Beta | Community | Notion-based documentation | Non-Notion teams |

---

## Cross-Cutting Insights

### Patterns That Appear Across Multiple Domains

1. **Progressive disclosure is the meta-pattern**: From tiered rules to on-demand skills to MCP server connections, the winning strategy is always "load the minimum necessary context, with the ability to pull in more." This applies to CLAUDE.md (concise core), rules (scoped globs), skills (on-demand), and MCP (connected when needed).

2. **Verification beats generation**: Across all domains, the highest-impact improvements come from adding verification steps (type checking, linting, testing) rather than from improving generation quality. The model is already good at generating; it's bad at self-checking.

3. **Separation of concerns applies to AI configuration**: Just as good code separates business logic from presentation, good AI configuration separates universal conventions (base rules) from domain-specific knowledge (scoped rules) from procedural knowledge (skills) from execution specialization (agents).

4. **The token economy is the new performance bottleneck**: Understanding that every line of context has a cost — and optimizing for the highest-value context per token — is the skill that separates effective AI-assisted development from mediocre AI-assisted development.

### Where the Field Is Heading (Near-Term Predictions)

- **Convergence on AGENTS.md** as the universal format (Confidence: High) — Every major tool supports it now.
- **MCP becomes the standard integration layer** (Confidence: High) — 1,200+ servers and counting, major vendors adopting.
- **Background agents become mainstream** (Confidence: Medium) — Cursor Automations point the direction, but reliability needs improvement for legacy codebases.
- **Agent specialization replaces general-purpose prompting** (Confidence: Medium) — The subagent pattern will become standard for complex tasks.
- **Context management tools become first-class features** (Confidence: High) — IDE-level context budget indicators, automatic stale context clearing, and context optimization suggestions.

### Knowledge Gaps

- **Controlled experiments on rule effectiveness**: Most evidence is anecdotal. The arXiv 2026 study of 401 repositories is a start, but more rigorous measurement is needed.
- **MCP server reliability data**: No systematic benchmarking of MCP server reliability, latency, and error rates across the ecosystem.
- **Multi-agent coordination best practices**: Subagent orchestration is new enough that best practices are still emerging.
- **Cost-benefit analysis of AI context investment**: How much time should a team spend on AI context architecture? No data on ROI.

---

## Tools & Resources

### Context Architecture
| Name | URL | Pricing | Purpose |
|------|-----|---------|---------|
| Agent Rules Builder | https://www.agentrulegen.com | Free | Generate .cursorrules and .mdc files |
| Cursor Docs | https://cursor.com/docs | Free | Official documentation |
| Claude Code Docs | https://code.claude.com/docs | Free | Official documentation |

### MCP Ecosystem
| Name | URL | Pricing | Purpose |
|------|-----|---------|---------|
| MCP Registry | https://github.com/modelcontextprotocol/servers | Free | Official reference implementations |
| awesome-mcp-servers | https://github.com/appcypher/awesome-mcp-servers | Free | Community-curated server list |
| best-of-mcp-servers | https://github.com/tolkonepiu/best-of-mcp-servers | Free | Ranked server list with quality scores |
| MCP Awesome | https://mcp-awesome.com | Free | Searchable directory with 1,200+ servers |

### Community Resources
| Name | URL | Pricing | Purpose |
|------|-----|---------|---------|
| shanraisshan/claude-code-best-practice | https://github.com/shanraisshan/claude-code-best-practice | Free | Comprehensive Claude Code best practices |
| digitalchild/cursor-best-practices | https://github.com/digitalchild/cursor-best-practices | Free | Cursor configuration guide |
| Cursor Community Forum | https://forum.cursor.com | Free | Community discussions and troubleshooting |
| r/cursor (Reddit) | https://reddit.com/r/cursor | Free | Community tips and workflows |
| r/ClaudeAI (Reddit) | https://reddit.com/r/ClaudeAI | Free | Claude-specific tips |

### IDEs and Tools
| Name | URL | Pricing | Purpose |
|------|-----|---------|---------|
| Cursor | https://cursor.com | Free / Pro $20/mo / Business $40/mo | AI-first IDE |
| Claude Code | https://code.claude.com | Requires Claude subscription or API | Terminal-based AI coding agent |
| Windsurf | https://windsurf.ai | Free / Pro plans | AI IDE alternative |
| Aider | https://aider.chat | Free (open source) | Terminal-based AI pair programmer |

---

## Methodology

### Sources Consulted

This document synthesizes information from:

1. **Official documentation**: Cursor Docs, Claude Code Docs, MCP specification
2. **GitHub repositories**: modelcontextprotocol/servers, shanraisshan/claude-code-best-practice, digitalchild/cursor-best-practices, appcypher/awesome-mcp-servers, tolkonepiu/best-of-mcp-servers, cursor/mcp-servers, upstash/context7
3. **Practitioner blog posts**: Elementor Engineering (Dec 2025), HumanLayer Blog, SFEIR Institute (Feb 2026), Prismic Cursor Review, Markaicode, DEV Community
4. **Community forums**: Cursor Community Forum, Reddit r/cursor, Reddit r/ClaudeAI
5. **Product changelogs**: Cursor Changelog (through Mar 2026), Claude Code release notes
6. **Technical guides**: Agent Rules Builder Guide, Data Science Collective, DeployHQ Guide
7. **Research**: arXiv 2026 study of 401 open-source repositories with cursor rules (referenced in secondary source)

### Search Strategy

Targeted web searches across official documentation, GitHub repositories, community forums, and practitioner blogs. Priority given to sources from late 2025 and early 2026 to capture current state.

### Validation Approach

- Cross-referenced claims across multiple independent sources before rating Confidence as High
- Verified MCP server existence by checking GitHub repositories and star counts
- Distinguished between vendor marketing claims and independent practitioner reports
- Flagged areas where information was sparse or rapidly evolving

### Limitations

1. **Rapidly evolving field**: Both Cursor and Claude Code ship features weekly. Specific version numbers and feature availability may have changed since research was conducted.
2. **Limited controlled experiments**: Most effectiveness claims come from practitioner reports rather than controlled studies. The arXiv 2026 study is a notable exception.
3. **Survivorship bias**: Open-source repos with excellent AI context architecture are more likely to be discovered and cited than failed approaches.
4. **MCP ecosystem velocity**: With 1,200+ servers, comprehensive quality assessment is impossible. Assessments focus on the most widely-adopted servers.
5. **Tool bias**: This document focuses on Cursor and Claude Code as the two most mature AI-first development tools. Windsurf, Aider, Copilot, and Gemini CLI receive less coverage but share many of the same patterns (especially via AGENTS.md compatibility).
6. **Cost data**: Pricing for models and tools changes frequently. Model recommendations should be validated against current pricing.

### Areas Where Information Is Evolving Too Fast for Confident Recommendations

- **Cursor Automations**: Launched very recently (Feb/Mar 2026). Best practices for automation templates are still emerging.
- **Claude Code Agent SDK**: Recently released. Custom agent orchestration patterns are preliminary.
- **MCP security best practices**: The ecosystem is growing faster than security guidance. Exercise caution with any MCP server that has write access.
- **Background agent reliability on legacy codebases**: Acknowledged limitation by Cursor; specific guidance on what "well-structured" means is still informal.
