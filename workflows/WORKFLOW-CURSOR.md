# Cursor IDE — Complete Workflow Guide (March 2026)

> Everything you need to set up and master Cursor for maximum AI-assisted development quality. Covers the full system: rules, skills, agents, MCP, context patterns, automations, cost control, and team workflows.

---

## 1. Initial Setup

> Migrating an existing Claude Code workflow into Cursor (or the reverse)? Recipe: `workflows/MIGRATION-CURSOR-CLAUDE.md`.

### 1.1 Directory Structure

Create this on day one for any project:

```
.cursor/
├── rules/
│   ├── base.mdc              # Always-apply core conventions
│   ├── frontend.mdc          # Glob: src/components/**, src/app/**
│   ├── api.mdc               # Glob: src/app/api/**, src/routes/**
│   ├── testing.mdc           # Glob: **/*.test.ts, **/*.spec.ts
│   ├── database.mdc          # Glob: src/db/**, prisma/**, drizzle/**
│   └── personal.mdc          # .gitignored — individual preferences
├── skills/
│   ├── deployment/
│   │   ├── SKILL.md           # "How to deploy" — loaded on demand
│   │   └── scripts/
│   └── migration/
│       ├── SKILL.md           # "How to run DB migrations"
│       └── references/
├── agents/
│   ├── reviewer.md            # Code review subagent
│   ├── tester.md              # Test generation subagent
│   └── security.md            # Security audit subagent
└── mcp.json                   # MCP server configuration
```

Also create at project root:

```
AGENTS.md                      # Cross-IDE interop (Claude Code, Copilot, etc.)
```

### 1.2 Indexing Configuration

Control what Cursor indexes for @codebase searches:

**.cursorindexingignore** — exclude from embeddings:
```
node_modules/
.next/
dist/
build/
coverage/
*.min.js
*.map
*.lock
```

**.cursorignore** — exclude from all AI operations:
```
.env
.env.local
*.pem
credentials.json
secrets/
```

### 1.3 Git Configuration

```bash
# Commit these (team-shared):
git add .cursor/rules/ .cursor/skills/ .cursor/agents/ .cursor/mcp.json AGENTS.md

# Gitignore these (personal):
echo ".cursor/rules/personal.mdc" >> .gitignore
```

---

## 2. Rules System (.cursor/rules/*.mdc)

### 2.1 How Rules Work

Each `.mdc` file has YAML frontmatter controlling when it loads:

```yaml
---
description: "Human-readable purpose"
globs: ["src/components/**", "!**/*.test.ts"]
alwaysApply: false
---
# Rule content in Markdown
```

**Three activation modes**:

| Mode | Frontmatter | When It Loads | Use For |
|------|-------------|---------------|---------|
| Always | `alwaysApply: true` | Every interaction | Universal conventions, commands |
| Glob-scoped | `globs: [patterns]` | Active file matches pattern | Framework-specific, domain-specific |
| Description-matched | `description: "..."` only | Agent decides based on relevance | Situational reference |

**Precedence** (highest first):
1. Manual/Local — explicitly included with @ruleName
2. Auto Attached — file matches glob
3. Always Apply — `alwaysApply: true`
4. User Rules — Cursor Settings > Rules (lowest)

### 2.2 base.mdc — The Foundation

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
- Named exports only — NEVER use default exports
- pnpm as package manager — NEVER npm or yarn
- ES modules — NEVER CommonJS require()

# COMMANDS
- Dev: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm lint:fix`
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
```

Budget: under 500 tokens total for all alwaysApply rules combined.

### 2.3 Glob-Scoped Rules

**frontend.mdc**:
```yaml
---
globs: ["src/components/**", "src/app/**", "!src/app/api/**"]
description: "Frontend conventions for React/Next.js"
---
# FRONTEND
- Next.js 15 App Router — NEVER Pages Router
- Server Components by default — 'use client' only when needed
- Tailwind CSS — no inline styles, no CSS modules
- shadcn/ui for primitives — NEVER modify components/ui/
- Zustand for client state, React Query for server state
- All components: explicit prop types with interfaces
- Always create error.tsx alongside every page.tsx
- error.tsx: client component with {error, reset} props
```

**api.mdc**:
```yaml
---
globs: ["src/app/api/**", "src/routes/**"]
description: "API route conventions"
---
# API ROUTES
- Thin route handlers — call services, never business logic here
- Zod validation on ALL request bodies
- Consistent response format: { data, error, meta }
- NEVER log sensitive data (passwords, tokens, card numbers)
- Parameterized queries only — no string interpolation in SQL
- Error handling: try/catch with typed error responses
```

**testing.mdc**:
```yaml
---
globs: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"]
description: "Testing conventions"
---
# TESTING
- Vitest for unit tests, Playwright for E2E
- Colocate test files: user.test.ts next to user.ts
- Test behavior, not implementation
- Mock external services, never internal functions
- Each test: arrange → act → assert (one assertion focus)
- Descriptive names: "should return 404 when user not found"
```

**database.mdc**:
```yaml
---
globs: ["src/db/**", "prisma/**", "drizzle/**"]
description: "Database conventions"
---
# DATABASE
- Prisma ORM — NEVER raw SQL unless explicitly approved
- Migrations: `pnpm db:migrate` — never `prisma db push` in production
- All queries in src/db/queries/ — never in components or routes
- Use transactions for multi-table writes
- Index all foreign keys and frequently queried columns
```

### 2.4 Writing Effective Rules

**Rules that work** (highest compliance):
- Imperative commands: "Use named exports" beats "We prefer named exports"
- Code examples (3-5 lines showing expected pattern)
- NEVER/ALWAYS binary constraints
- Numbered execution sequences
- ALL-CAPS headers for critical rules

**Rules that get ignored**:
- "Write clean code" or "Follow best practices" (vague)
- Long explanations after the rule (dilutes)
- "When possible", "generally", "consider" (hedging = optional)
- Rules contradicting strong training priors
- Paragraphs instead of lists

**Format per rule**:
```markdown
## RULE NAME
- DO: [instruction + code example]
- DO NOT: [anti-pattern + code example]
- WHY: [one sentence max]
```

**Feedback loop**: When agent violates a rule, strengthen it. Add compliance verification: "After applying rules, confirm which rules you followed."

---

## 3. Skills System (.cursor/skills/)

### 3.1 When to Use Skills vs Rules

| Use Rules | Use Skills |
|-----------|-----------|
| "Always do X" (convention) | "Here's how to do Y" (procedure) |
| Loads always or by glob | Loads on demand when relevant |
| Short, declarative | Can be multi-file, step-by-step |
| Pattern in 3+ conversations | Multi-step procedure |

### 3.2 Skill Structure

Skills are **folders**, not files:

```
.cursor/skills/
  deployment/
    SKILL.md          # Entry point — trigger description
    references/       # API docs, configs
    scripts/          # Shell scripts, templates
    examples/         # Working code samples
```

The `description` in SKILL.md is a **trigger** — write for the model ("when should I fire?"):

```markdown
---
description: "How to deploy to staging and production. Use when user asks about deployment, releasing, pushing to staging/production, or rollback."
---
# Deployment Skill

## Staging
1. Ensure tests pass: `pnpm test && pnpm test:e2e`
2. Build: `pnpm build`
3. Deploy: `vercel --env staging`
4. Verify: `curl -s https://staging.acme.com/api/health`

## Production
1. Create release PR with conventional commit summary
2. Ensure staging tested and approved
3. Merge to main — Vercel auto-deploys
4. Monitor Sentry for 30 minutes

## Rollback
1. Vercel dashboard: Deployments → Previous → Promote
2. Or: `vercel rollback`
3. Notify #engineering

## Gotchas
- DB migrations BEFORE deploying dependent code
- Env vars differ staging/production — check .env.example
- CDN cache: 5 minutes to invalidate
```

**Progressive disclosure**: Agent reads SKILL.md first, pulls subdirectory contents as needed.

**Dynamic injection**: Embed `` `!command` `` to run shell at invocation — agent sees only output.

### 3.3 Design Principles

- Don't state the obvious — focus on what pushes agent out of defaults
- Don't railroad — give goals and constraints, not prescriptive step-by-step
- Include a **Gotchas section** — highest-signal, continuously updated
- Include "When NOT to use this" guidance

---

## 4. Custom Agents (.cursor/agents/)

### 4.1 Agent Definition Format

```yaml
---
name: agent-name
description: "Trigger: when should this fire?"
tools: [Bash, Read, Write, WebFetch]
model: sonnet   # or opus for complex reasoning
---
# Role
You are a [specific role] specializing in [domain].

# Context
- This project uses [stack]
- Key files: [paths]

# Protocol
1. [First step — usually search/read before acting]
2. [Analysis]
3. [Implementation]
4. [Verification]

# Output Format
- [What response should contain]

# Constraints
- NEVER [anti-pattern]
- ALWAYS [required behavior]
- When uncertain, [fallback]
```

### 4.2 Essential Agents

**reviewer.md** — Code Review:
```yaml
---
name: code-reviewer
description: "Reviews diffs for bugs, security, design. Invoke for PRs or before committing."
tools: [Read, Bash, WebFetch]
model: sonnet
---
# Role
Senior code reviewer for TypeScript/Next.js.

# Protocol
1. `git diff main...HEAD` — read full diff
2. For each changed file, read surrounding context (not just diff)
3. Check: logic errors, security vulns, perf issues, type safety
4. Verify imports exist and correct
5. Check error handling coverage
6. Verify tests for new functionality

# Output
For each issue:
- **File**: path | **Line**: number
- **Severity**: Critical / Warning / Suggestion
- **Issue**: description | **Fix**: suggestion

# What NOT To Review
- Formatting (linter handles this)
- Style preferences (rules handle this)
- Things type checker catches

# Constraints
- NEVER approve unhandled promise rejections
- NEVER approve code logging sensitive data
- ALWAYS flag raw SQL (use ORM)
- Zero issues? Say so — don't invent problems
```

**tester.md** — Test Generation:
```yaml
---
name: test-writer
description: "Writes tests for new or changed code. Invoke when implementation is complete."
tools: [Read, Write, Bash]
model: sonnet
---
# Role
Test engineer writing Vitest unit tests.

# Protocol
1. Read the implementation thoroughly
2. Identify all code paths (happy, error, edge)
3. Write tests covering each path
4. Run `pnpm test` to verify all pass
5. Report coverage gaps

# Constraints
- Test behavior, not implementation details
- One assertion focus per test
- Mock external services only, never internal functions
- Descriptive test names
```

**security.md** — Security Audit:
```yaml
---
name: security-auditor
description: "Security review. Invoke before releases or when auth/payment code changes."
tools: [Read, Bash, WebFetch]
model: opus
---
# Role
Application security engineer.

# Protocol
1. Scan for: SQL injection, XSS, CSRF, auth bypass, SSRF
2. Check: input validation, output encoding, auth checks
3. Review: dependency vulnerabilities (`pnpm audit`)
4. Check: secrets not hardcoded, env vars used correctly

# Output
- **Finding**: description
- **Severity**: Critical / High / Medium / Low
- **Location**: file:line
- **Remediation**: specific fix

# Constraints
- ALWAYS check auth middleware on protected routes
- ALWAYS verify webhook signature validation
- Flag any `eval()`, `innerHTML`, or `dangerouslySetInnerHTML`
```

### 4.3 Subagent Execution

Cursor supports parallel subagents (v2.4+):
- Each subagent runs with independent context window
- Scoped tool access per agent (principle of least privilege)
- Three-stage pipelines: spec → review → implement
- Each agent sees only its relevant files, not full conversation

---

## 5. MCP Configuration

### 5.1 Setup

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
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### 5.2 Recommended Starter Stack

| Server | Why | Priority |
|--------|-----|----------|
| GitHub MCP | Issues, PRs, code search without leaving agent | High |
| Your database MCP | Schema inspection, read-only queries | High |
| Context7 | Up-to-date library documentation (50K stars) | Medium |
| Playwright MCP | E2E testing, visual verification | Medium |
| Brave Search | Web research for docs/solutions | Low |

### 5.3 When to Add MCP

Start with zero. Add one at a time when you repeatedly copy-paste between AI and a tool. Most projects need 2-4 servers.

### 5.4 Security

- Least privilege: read-only DB connections by default
- Directory restrictions: explicitly list allowed paths (never `/` or home)
- Env vars for credentials, never hardcoded in mcp.json
- Version-pin servers: no auto-update without review
- Check: `uvx snyk-agent-scan@latest` to scan for vulnerabilities (Snyk Agent Scan; needs `SNYK_TOKEN`)

---

## 6. Context Patterns

### 6.1 @-Mention System

| Mention | What It Does | When to Use |
|---------|-------------|-------------|
| `@file` | Include specific file contents | Precise context for targeted edits |
| `@folder` | Include all files in directory | Small directories only (can be large) |
| `@codebase` | Semantic search via embeddings | "Find similar patterns" queries |
| `@web` | Web search | Current docs, solutions |
| `@docs` | Indexed documentation sources | Library/API reference |
| `@ruleName` | Load specific rule manually | Force a rule into context |

**Best practice**: Be precise. `@src/api/users.ts update the GET endpoint to include pagination using the pattern in @src/api/products.ts` beats "update the API endpoint."

### 6.2 Optimizing @codebase

Cursor uses a custom embedding model for codebase search. Improve results with:
- Well-structured code (clear filenames, JSDoc, explicit types)
- Descriptive function/class names (semantic meaning)
- Check indexing status in Settings if results seem stale
- Use `.cursorindexingignore` to exclude noise (build artifacts, generated files)

### 6.3 Notepads

Persistent scratchpads that survive across sessions. Use for:
- Architecture notes the agent should reference
- Temporary context for a multi-day feature
- Design decisions not yet permanent enough for rules

---

## 7. Workflow Patterns

### 7.1 Daily Development Flow

```
1. Open Cursor
2. Start new session for each distinct task (don't extend old ones)
3. Use @file to give precise context
4. Use Agent Mode for multi-file changes
5. Review diffs after each agent action
6. Let linter/typecheck run in terminal
7. Commit with conventional commits
```

### 7.2 Plan Mode

Toggle Plan Mode so agent maps full scope before executing. Reduces back-and-forth, prevents wrong paths, gives you correction opportunity before code.

**When**: Complex multi-file tasks, architectural changes, unfamiliar code areas.

### 7.3 Complex Feature Implementation

```
1. Plan Mode: "Plan how to implement [feature]. Map all files that need changes."
2. Review plan, adjust if needed
3. Agent Mode: "Implement step 1 of the plan"
4. Review diff, run tests
5. Continue through plan steps
6. Final: "Review all changes against the original plan"
```

### 7.4 Debugging Flow

```
1. Paste error message or describe behavior
2. @file the relevant source files
3. "Search the codebase for similar patterns or related error handling"
4. Agent investigates, proposes fix
5. "Run the relevant tests to verify the fix"
```

### 7.5 The "Challenge" Pattern

After mediocre output:
- "Knowing everything you know now, scrap this and implement the elegant solution"
- "Grill me on these changes — find every issue"
- "Diff between main and this branch, explain every change"

Pushing back produces better solutions and catches edge cases.

---

## 8. Background Agents & Automations

### 8.1 Cursor Automations (Feb/Mar 2026)

Event-driven agents running in cloud sandboxes:

**Triggers**: GitHub webhooks, cron schedules, codebase changes, Slack messages, Linear updates.

**Capabilities**: Full MCP access, memory across runs, screen recordings attached to PRs.

**Use cases**:
- Automated PR review on every push
- Scheduled security scanning
- Dependency update monitoring
- Nightly test suite execution
- Automated code style enforcement

### 8.2 Bugbot Autofix (Feb 2026)

Finds issues in PRs → spins up cloud agent → tests fix → proposes directly.

### 8.3 Cloud Agents with Computer Use

Virtual machines with browser access. Agent can visually verify its work. Screen recordings of runs attached to PRs.

### 8.4 Self-Hosted

Keep code and tool execution on your own network for security-sensitive projects.

---

## 9. Cost Optimization

### 9.1 Model Selection per Task

| Task | Model Tier | Why |
|------|-----------|-----|
| Simple edits, renames, formatting | Fast/cheap (Haiku) | Speed matters, complexity low |
| Standard implementation | Sonnet | Best cost/quality balance |
| Architecture, complex debugging | Opus | Reasoning depth needed |
| Code review | Sonnet | Sufficient for pattern matching |
| Planning, design decisions | Opus + extended thinking | Worth cost for correctness |

### 9.2 Token Budget Strategies

- **Scoped rules** (glob-based) to reduce always-loaded context
- **Plan Mode** to reduce back-and-forth tokens
- **Fresh sessions** per task (don't extend exhausted contexts)
- **@file precision** over @codebase (less retrieval noise)
- **Stable rules files** maximize prompt cache hits
- **Subagents with cheaper models** for mechanical subtasks

### 9.3 Pricing (March 2026)

| Plan | Monthly | Includes |
|------|---------|----------|
| Free | $0 | 2,000 completions + 50 premium requests |
| Pro | $20 | $20 API credits, unlimited completions |
| Pro+ | $60 | More premium requests |
| Ultra | $200 | Highest limits |
| Business | $40/user | Team management |

---

## 10. Team Workflows

### 10.1 Shared vs Personal

**Commit to Git (team)**:
```
.cursor/rules/ (except personal.mdc)
.cursor/skills/
.cursor/agents/
.cursor/mcp.json
AGENTS.md
```

**Gitignore (personal)**:
```
.cursor/rules/personal.mdc
```

### 10.2 Onboarding

New team member clones repo → gets full AI context automatically. Same agent quality as veteran because rules encode accumulated knowledge.

### 10.3 Context File Review Process

PRs modifying AI context should be reviewed. Checklist:
- Applies to >80% of sessions? If not, glob-scope it
- Specific and testable?
- Conflicts with existing rules?
- Token budget still reasonable?
- Code examples current?

### 10.4 Cursor Blame

Distinguishes: Tab completions, agent runs (by model), human edits. Tracks AI usage patterns across team.

### 10.5 Team Marketplace (2026)

Share skills, agents, and automations across organization.

---

## 11. Advanced Features

### 11.1 JetBrains Support (Mar 2026)

Cursor available in IntelliJ, PyCharm, WebStorm via Agent Client Protocol (ACP). Same rules, skills, and agents system.

### 11.2 Fast Local Code Search

Text indexing for large repos. Speeds up regex matching in agentic workflows. Benefits @codebase quality.

### 11.3 Composer (Agent Mode)

Multi-file orchestration. Agent reads, searches, edits across files, runs terminal commands, verifies. The primary mode for non-trivial work.

### 11.4 Image Generation

From v2.4: agents can generate images from prompts. Useful for design-to-code workflows.

---

## 12. Troubleshooting

### 12.1 Agent Ignoring Rules

- Rule in middle of long file? Move critical rules to top/bottom
- Hedging language? Replace "consider" with "ALWAYS" / "NEVER"
- Too many alwaysApply? Reduce; move to glob-scoped
- Check: `alwaysApply: true` actually set in frontmatter?

### 12.2 Poor @codebase Results

- Check indexing status in Settings
- Update `.cursorindexingignore` to exclude noise
- Add JSDoc/docstrings to improve semantic matching
- Try `@file` with specific path instead

### 12.3 Context Exhaustion Symptoms

- Agent agrees with everything, stops pushing back
- Output becomes generic
- Hallucinations increase
- **Fix**: Start a new session. Each task = fresh context.

### 12.4 MCP Server Failures

- Check server is running: look for error in MCP panel
- Verify env vars are set (not just in mcp.json but in shell)
- Test independently: `npx @modelcontextprotocol/server-github` in terminal
- MCP failures should be non-fatal — agent should work without them

---

## 13. Quick Reference

### File Locations

| File | Location | Purpose |
|------|----------|---------|
| Rules | `.cursor/rules/*.mdc` | Conventions |
| Skills | `.cursor/skills/*/SKILL.md` | Procedures |
| Agents | `.cursor/agents/*.md` | Specialized execution |
| MCP | `.cursor/mcp.json` | Tool integrations |
| Interop | `AGENTS.md` (project root) | Cross-IDE standard |
| User rules | `~/.cursor/rules/` | Global personal |
| Indexing | `.cursorindexingignore` | Exclude from search |
| Ignore | `.cursorignore` | Exclude from all AI |

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Agent/Composer | Cmd+I |
| Inline edit | Cmd+K |
| Toggle Plan Mode | In agent panel |
| @-mention file | Type @ in prompt |
| New session | Cmd+Shift+N |

### Daily Checklist

- [ ] Fresh session for each distinct task
- [ ] @file for precise context
- [ ] Plan Mode for complex multi-file work
- [ ] Review every diff before accepting
- [ ] Typecheck + lint after changes
- [ ] Tests pass before committing
- [ ] Conventional commit messages

---

*Complete Cursor workflow reference. March 2026. For Claude Code workflow, see WORKFLOW-CLAUDE-CODE.md.*
