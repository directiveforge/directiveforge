# Research Task: AI-First Development — Context Architecture, Memory & Agent Engineering for Cursor and Claude Code (State of the Art, March 2026)

## Your Role

You are a senior technical researcher producing a comprehensive reference document. Your audience is experienced developers and AI architect agents who use Cursor IDE and Claude Code daily. The output document will be loaded as context by AI agents whose job is to set up optimal AI-assisted development environments for any project.

## What You Are Producing

Respond with a single, self-contained Markdown document of 15,000–20,000 words titled:

**"AI-First Development: Context, Memory & Agent Engineering — State of the Art (March 2026)"**

This document serves as the definitive knowledge base for AI agents that:
- Set up context architecture (AGENTS.md, .cursor/rules/, .cursor/skills/, .cursor/agents/, CLAUDE.md) for new projects
- Configure MCP (Model Context Protocol) servers for specific project needs
- Write agent prompts, rules, and skill definitions
- Organize project knowledge so every AI interaction produces highest-quality output
- Reduce hallucinations and increase accuracy in real IDE workflows
- Choose between tools, patterns, and workflows when starting new tasks

## Research Domains

Research each domain exhaustively. For each finding: state What it is, Why it matters, How to implement it, When NOT to use it, its Effectiveness rating (Transformative / Useful / Situational / Overhyped / Outdated), Confidence level (High / Medium / Low), and Sources with URLs.

### Domain 1: Context Architecture for AI IDEs

This is the core topic. Allocate the most depth here.

- **File-level context systems**: AGENTS.md, CLAUDE.md, .cursorrules (legacy, single-file), .cursor/rules/*.mdc (current, multi-file with frontmatter), .cursor/skills/*/SKILL.md, .cursor/agents/*.md — what goes in each file, proven structures, community-agreed line/token limits, what content actually changes AI behavior versus what gets ignored
- **Tiered context loading**: always-loaded (alwaysApply: true) → glob-scoped (auto-loaded by file path match) → on-demand (agent-requested or description-matched) → deep reference docs — best implementations, how Cursor and Claude Code actually process each tier
- **Rule effectiveness**: What makes a rule that the AI actually follows? Research syntax, structure, length, specificity, imperative versus descriptive phrasing. Include community findings on what patterns get obeyed versus ignored.
- **Skills versus rules versus agents**: Precise definitions, when to create each, optimal size limits (lines and tokens), proven templates from open-source repos
- **Scope levels**: Project-level (.cursor/rules/) versus workspace-level versus user-level (~/.cursor/rules/) context — when to use each, override behavior, precedence order
- **Token budget reality**: How much context is too much? Research on the "Lost in the Middle" problem applied to IDE context. What to prioritize when context windows are constrained. Measured impact of context size on output quality.
- **Cross-IDE compatibility**: Patterns that work in both Cursor AND Claude Code. Differences between how each tool loads and processes context files.
- **Real examples**: Find open-source repositories with excellent AI context architectures. Link to specific repos and describe what makes them effective.

### Domain 2: MCP Ecosystem — Practical Usage Guide

Focus on USING existing MCP servers, NOT building them.

- **Top MCP servers by category** — for each, provide: name, URL/source, what it does, quality rating (Production-ready / Beta / Experimental / Toy), honest assessment of reliability, known limitations:
  - Browser automation: Playwright MCP, Puppeteer MCP, browser-use
  - CMS integration: Sanity MCP, Contentful MCP, Strapi MCP
  - Database access: Postgres MCP, SQLite MCP, Supabase MCP, Neon MCP
  - Git/GitHub: GitHub official MCP, GitLab MCP, GitKraken MCP
  - File system and code search: filesystem MCP, ripgrep MCP
  - Monitoring: Sentry MCP, Datadog MCP
  - Design tools: Figma MCP
  - Documentation/knowledge: Brave Search MCP, Exa MCP, web fetch MCPs
  - Deployment: Vercel MCP, Netlify MCP
  - AI/ML tools: Prompt Lab MCP, OpenAI MCP
- **Configuration**: How to configure MCP servers in Cursor (.cursor/mcp.json) and Claude Code (project-level .mcp.json or ~/.claude/settings.json). Best practices for project-level versus user-level MCP config.
- **When MCP versus native tools**: When is MCP the right choice versus when native Cursor/Claude Code tool use is better? Provide a decision framework.
- **Performance**: MCP latency characteristics, reliability patterns, error handling, timeout strategies.
- **Security**: Risks of MCP servers with write access, credential management, sandboxing approaches.

### Domain 3: Memory & Knowledge Management in IDE Sessions

- **Session persistence**: What context survives between chat sessions in Cursor versus Claude Code? How do embeddings, codebase indexing, and @-mentions work under the hood?
- **Persistent context patterns**: AGENTS.md as cross-session memory, memory files, project knowledge documents, conversation summaries
- **Context pollution**: How too much irrelevant context degrades output quality. Techniques for keeping context focused and high-signal.
- **Context governance**: How to keep context files current and accurate. Update triggers, staleness detection, automated validation approaches.
- **RAG-like patterns**: Any MCP server or tool that enables retrieval-augmented generation over project knowledge.
- **Cursor's context system**: @file, @folder, @codebase, @web, @docs, embeddings — how to optimize each for best results. What the codebase indexer actually indexes and how to improve retrieval quality.
- **Claude Code memory**: Memory files, project knowledge, CLAUDE.md patterns, how context accumulates across sessions.

### Domain 4: Prompt Patterns Inside IDE Agents

- **Agent prompt structure**: How to write .cursor/agents/*.md files that produce reliable results. Proven templates, mandatory sections (role, safety, tools, output format), sections that add value when present (conflict resolution, decision authority, context pointers).
- **Agent types**: Code generator, code reviewer, architect, QA/testing, documentation, devops — what makes each type's prompt different. Include concrete examples.
- **Anti-hallucination techniques**: Grounding strategies specific to coding agents. "Read before edit" rules, verification steps, linting integration, type-checking as guardrails.
- **Task delegation**: Parent agent → sub-agent patterns. How to structure task descriptions for sub-agents that lack parent context.
- **Role prompting**: Does role prompting ("You are a senior engineer...") actually improve coding output? Research evidence for and against.
- **Extended thinking / reasoning**: When to enable extended thinking, measured impact on code quality, cost and latency tradeoffs.
- **Prompt caching**: How Cursor and Claude Code handle prompt caching. How to structure prompts to maximize cache hits.
- **Rule compliance**: What syntax and structure in rules gets the AI to actually follow them? Research on imperative commands versus descriptive guidelines, specificity level, example inclusion.

### Domain 5: Agent Architecture Patterns

- **Single versus multi-agent**: When each is better for coding tasks. Evidence on quality and speed tradeoffs.
- **Specialization patterns**: What agent types a mature project should define. The minimum viable agent set.
- **Agent orchestration**: How parent agents should delegate to specialized sub-agents. Context passing, result aggregation.
- **Best-of-N patterns**: Running parallel attempts (for example, Cursor's best-of-n-runner) and selecting the best result. When this is worth the additional cost.
- **Task decomposition**: How to break complex coding tasks for multi-step agent execution. Granularity guidelines.
- **Error recovery**: What to do when agents produce incorrect code, go off track, or get stuck in loops.

### Domain 6: Project Organization for AI-First Development

- **File and folder structures** that AI navigates best. Flat versus nested, naming conventions, index files as navigation aids.
- **TypeScript patterns** that give AI better context: strict mode, explicit return types, barrel exports, interface-first design.
- **Documentation standards** that serve both humans AND AI: JSDoc, README placement, architecture decision records.
- **Monorepo patterns** for AI-assisted development: workspace configuration, cross-package navigation, scoped context.
- **Config patterns**: tsconfig, eslint, prettier configurations that AI agents leverage for better output.

### Domain 7: Quality & Accuracy Maximization

- **Grounding techniques**: Ensuring AI-generated code actually compiles and works. Read-before-edit, type-checking, linting loops.
- **Test-driven AI development**: Write tests first, let AI implement. Evidence on effectiveness.
- **Hallucination patterns in coding**: Phantom imports, non-existent APIs, wrong function signatures, invented package names. How to detect and prevent each.
- **Code review with AI**: Patterns for AI-assisted review that catch real bugs versus patterns that produce noise.
- **Validation strategies**: Systematic approaches to verify AI-generated code before committing.

### Domain 8: Tools & Workflow Optimization

- **Extensions and tools** that maximize AI effectiveness in Cursor and Claude Code.
- **Git workflows**: Branching, committing, PR creation patterns optimized for AI-assisted development.
- **Cost optimization**: When to use fast/cheap models versus expensive ones. Task-to-model matching strategies with concrete model recommendations.
- **Speed optimization**: How to structure work for fastest AI turnaround. Parallel task execution, background agents.
- **Team workflows**: How multiple developers share AI context and configurations. Version-controlled context patterns.

### Domain 9: Latest Innovations (as of March 2026)

- **Cursor**: Latest features, capabilities, and best practices that are new or changed since mid-2025.
- **Claude Code**: Latest features, capabilities, and best practices.
- **New MCP servers** that have emerged as game-changers in late 2025 or early 2026.
- **Community innovations**: What power users have discovered that is not yet in official documentation.
- **Obsolete patterns**: What advice from 2024–2025 is now outdated and what replaces it.

## Required Output Structure

Your output must follow this exact document structure:

```
# AI-First Development: Context, Memory & Agent Engineering — State of the Art (March 2026)

## Table of Contents
[Full hierarchical TOC with section and subsection links]

## Executive Summary
- Top 10 findings with highest impact on AI-assisted development quality
- The single biggest mistake teams make with AI context (with evidence)
- What changed since 2024 that makes old patterns obsolete

## Gold Tier: The 15–20 Most Impactful Practices
[Practices with highest ROI. Each with: What / Why / How / Confidence / Effectiveness]

## Section 1: Context Architecture for AI IDEs
[Findings from Domain 1]

## Section 2: MCP Ecosystem — Practical Usage Guide
[Findings from Domain 2, including the MCP Server Directory table]

## Section 3: Memory & Knowledge Management
[Findings from Domain 3]

## Section 4: Prompt Patterns Inside IDE Agents
[Findings from Domain 4]

## Section 5: Agent Architecture Patterns
[Findings from Domain 5]

## Section 6: Project Organization for AI-First Development
[Findings from Domain 6]

## Section 7: Quality & Accuracy Maximization
[Findings from Domain 7]

## Section 8: Tools & Workflow Optimization
[Findings from Domain 8]

## Section 9: Latest Innovations (March 2026)
[Findings from Domain 9]

## Anti-Patterns & Myths
[At least 10 common mistakes. Format each as: Myth → Reality → Evidence → What To Do Instead]

## The Ideal Context Architecture Blueprint
[A concrete, copy-ready directory structure and file templates showing exactly how to set up .cursor/, AGENTS.md, CLAUDE.md, rules, skills, agents, and docs for a new project. Include example file contents with realistic placeholder text.]

## MCP Server Directory
[Table: Name | Category | What It Does | Quality Rating | URL | When To Use | When To Avoid]

## Cross-Cutting Insights
- Patterns that appear across multiple domains
- Where the field is heading (near-term predictions with confidence levels)
- Knowledge gaps where information is sparse or conflicting
- Recommended follow-up research topics

## Tools & Resources
[Categorized links: name, URL, pricing tier (Free / Paid / Freemium), purpose]

## Methodology
[Sources consulted, search strategy, validation approach, limitations, areas where information was sparse or evolving too fast for confident recommendations]
```

## Completion Checklist

Before finalizing your response, verify that the document:
1. Contains all sections listed in the Required Output Structure above
2. Falls within the 15,000–20,000 word target range
3. Includes Effectiveness and Confidence ratings for every major recommendation
4. Cites sources with URLs for every major claim (or explicitly marks claims as "[source not found — based on general knowledge]")
5. Contains at least 10 anti-patterns in the Anti-Patterns section
6. Includes the copy-ready Context Architecture Blueprint with example file contents
7. Lists at least 20 MCP servers in the directory table with quality ratings
8. Contains no fabricated URLs, tool names, repository names, or citations
9. Presents conflicting expert opinions where they exist rather than arbitrarily choosing one side

## Quality Standards (Non-Negotiable)

### Evidence & Citation Rules
1. Every major claim must have a source citation with URL. Acceptable sources in priority order: official documentation, GitHub repositories, peer-reviewed research, established community resources (curated lists, widely-cited posts), individual practitioner posts.
2. Do NOT fabricate any URL, tool name, repository name, or citation. If you cannot find a source, write "[source not found — based on general knowledge]" and lower the confidence rating to Low.
3. When sources conflict, present both viewpoints and note the disagreement explicitly.
4. Do NOT use vendor marketing materials as sole evidence for effectiveness claims. Require independent corroboration.

### Rating System
For each major recommendation, provide both ratings:
- **Effectiveness**: Transformative (fundamental improvement) / Useful (measurable improvement) / Situational (helps in specific cases) / Overhyped (less useful than commonly claimed) / Outdated (was useful, no longer recommended)
- **Confidence**: High (multiple corroborating sources) / Medium (limited sources but consistent) / Low (single source or personal assessment)

### Writing Style
- Write in clear, structured, factual prose — as a reference document, not a blog post or tutorial
- Use concrete examples with exact file paths, naming patterns, and code snippets
- Every recommendation must be actionable: state what to do, where to do it, and what pattern to follow
- Organize hierarchically so readers and AI agents can locate specific topics quickly via the TOC
- Use tables for comparisons, ordered lists for sequential steps, and fenced code blocks for file examples

### Scope Boundaries
- **IN SCOPE**: Maximizing AI assistant effectiveness when working inside Cursor IDE, Claude Code, Windsurf, and similar AI-native code editors. Context architecture, persistent memory, MCP server usage, agent prompts, project organization, workflow patterns, quality techniques.
- **OUT OF SCOPE**: Building new AI tools or IDEs from scratch, ML model training or fine-tuning, non-development AI applications, general software architecture advice unrelated to AI assistance, mobile app development tools, cloud IDE platforms (Replit, Gitpod) unless directly relevant to context architecture patterns.

### Depth Assumptions
- Target audience: senior developers who use Cursor or Claude Code daily
- Do not explain what an LLM is, how chat interfaces work, or basic programming concepts
- Prioritize depth over breadth: a thorough analysis of 50 important topics is more valuable than a shallow mention of 200 topics

## Research Process Instructions

1. Search broadly across all 9 domains first to identify the highest-impact areas
2. Deep-dive the top findings with additional targeted searches
3. Cross-reference claims across multiple sources before rating confidence as "High"
4. Check official documentation for Cursor, Claude Code, and MCP before relying on third-party sources
5. Search for open-source repositories that demonstrate excellent AI context architecture — link to specific repos with descriptions of what makes them effective
6. Search community discussions (GitHub Discussions, Discord servers, Reddit r/cursor and r/ClaudeAI, Hacker News, X/Twitter) where practitioners share what actually works in production
7. For each MCP server listed, verify it exists by checking its GitHub repository or npm package, note its star count and last update date, and assess current maintenance status
8. Flag any area where information is evolving too fast for confident recommendations and state what is known as of March 2026

## Constraints

1. No fabricated sources, URLs, repository names, or tool names. Verify existence before citing.
2. No vendor marketing claims presented as evidence without independent corroboration.
3. Apply equal evaluation criteria across competing tools (Cursor versus Claude Code versus Windsurf).
4. Prioritize production-proven patterns over theoretically elegant ones.
5. If a domain is evolving too fast for reliable research, state this explicitly in the Methodology section with a description of what is known and what is uncertain.
6. Do not include proprietary or confidential information about any tool's internal workings unless it is publicly documented.
7. Present conflicting expert opinions when they exist rather than arbitrarily choosing one side.
