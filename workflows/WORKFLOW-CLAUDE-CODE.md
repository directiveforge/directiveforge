# Claude Code — Complete Workflow Guide (March 2026)

> Everything you need to set up and master Claude Code (terminal + desktop app) for maximum AI-assisted development quality. Covers the full system: CLAUDE.md, memory, rules, commands, subagents, hooks, MCP, session management, cost control, and team workflows.

---

## 1. Initial Setup

### 1.1 Directory Structure

Create this on day one for any project:

```
project-root/
├── CLAUDE.md                     # Primary project memory (team-shared)
├── AGENTS.md                     # Cross-IDE interop
├── .claude/
│   ├── commands/
│   │   ├── review-pr.md          # /review-pr slash command
│   │   ├── deploy-staging.md     # /deploy-staging
│   │   ├── tech-debt.md          # /tech-debt
│   │   └── test-feature.md       # /test-feature
│   └── rules/
│       └── migration.md          # Temporary scoped rules
├── .mcp.json                     # MCP server configuration
└── src/
```

User-level (global, all projects):
```
~/.claude/
├── CLAUDE.md                     # Personal preferences (all projects)
├── settings.json                 # Auto-memory config, MCP global
└── projects/
    └── <hash>/                   # Auto-generated session memory
```

### 1.2 Initialize

```bash
# Start Claude Code in your project
cd your-project
claude

# Generate initial CLAUDE.md (then cut 70%)
/init

# Check what memory is loaded
/memory show
```

### 1.3 Git Configuration

```bash
# Commit team-shared:
git add CLAUDE.md AGENTS.md .claude/commands/ .claude/rules/ .mcp.json

# Gitignore personal:
echo ".claude/settings.json" >> .gitignore
# Auto-memory files are stored in ~/.claude/, not in project
```

---

## 2. CLAUDE.md — The Core Memory File

### 2.1 How It Works

CLAUDE.md is loaded into the system prompt at every session start. Claude Code wraps it in a `<system-reminder>` tag telling the model content "may or may not be relevant." This means:

- Overstuffed files trigger selective ignoring
- Every line competes with task-relevant context
- Concise files outperform exhaustive files
- The harness already has ~50 internal instructions consuming context budget

### 2.2 Three-Level Hierarchy

Merged in specificity order (most specific wins):

1. **`~/.claude/CLAUDE.md`** — Global personal (language preference, commit style, formatting)
2. **`./CLAUDE.md`** — Project root (shared team conventions)
3. **Subdirectory `CLAUDE.md`** — Scoped to specific part of codebase

### 2.3 Writing the Ideal CLAUDE.md

**Target**: typical well-formed range is 80-150 lines; the enforced gate is ≤150 + six required sections — no minimum (a disciplined 71-line file passes). Maximum 200 for hand-authored files. Delete 70% of what `/init` generates.

**Keep only what the agent would get wrong without the file.**

```markdown
# Project: Acme E-Commerce

Next.js 15 e-commerce platform with Stripe, Postgres (Prisma), Clerk auth.

## Build & Test Commands
- `pnpm dev` — dev server on port 3000
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright E2E
- `pnpm lint:fix` — fix lint errors
- `pnpm typecheck` — TypeScript checking
- `pnpm db:migrate` — run Prisma migrations
- `pnpm db:seed` — seed dev database

## Code Style
- TypeScript strict mode — never use `any`
- Named exports only — never default exports
- ES modules — never CommonJS
- pnpm — never npm or yarn
- 2-space indent, single quotes
- Functional components with hooks
- Zod for all input validation
- Error handling: all async functions use try/catch

## Architecture
- App Router with RSC (React Server Components)
- 'use client' only when explicitly necessary
- API routes at src/app/api/ — thin handlers calling services
- Business logic in src/services/ — never in components or routes
- Database queries in src/db/queries/ — Prisma, never raw SQL
- Shared types in src/types/
- Tests colocated: *.test.ts next to source

## Key Pitfalls
- Stripe webhook handler MUST verify signatures (src/app/api/webhooks/stripe)
- All prices stored in cents (integer) — convert for display only
- Auth middleware runs on all /api routes except /api/webhooks
- DB migrations BEFORE deploying code that depends on them
- .env.local for dev, Vercel env vars for production

## Search Before Implementing
ALWAYS search existing code before creating new files or functions.
Reuse existing patterns. Extend before creating.
```

### 2.4 What Goes Where

| Content | Where | Why |
|---------|-------|-----|
| Language preference, commit style | `~/.claude/CLAUDE.md` | Personal, all projects |
| Tech stack, commands, conventions | `./CLAUDE.md` | Team-shared, project-specific |
| Module-specific patterns | `./src/api/CLAUDE.md` | Scoped to that module |
| Temporary migration rules | `.claude/rules/migration.md` | Remove after merge |
| Repeated workflow | `.claude/commands/*.md` | Slash command |

---

## 3. Memory System

### 3.1 Three Memory Levels

1. **CLAUDE.md** (explicit, version-controlled): Team-shared conventions. You write and maintain it.
2. **Auto-memory** (implicit, local): Claude Code saves learnings automatically (build commands, debugging patterns, quirks). Stored in `~/.claude/projects/<hash>/`, not committed to Git.
3. **`.claude/rules/`** (modular, version-controlled): Additional scoped rules for specific contexts.

### 3.2 Memory Commands

| Command | Action |
|---------|--------|
| `/memory show` | Inspect all loaded memory sources |
| `/memory refresh` | Force reload from disk |
| `/init` | Generate initial CLAUDE.md from codebase analysis |
| `/remember [text]` | Promote a learning to permanent CLAUDE.md |

### 3.3 Auto-Memory

Claude Code saves learnings across sessions without you writing anything:
- Build commands discovered during debugging
- Error patterns encountered and resolved
- Project-specific quirks learned during work

**Management**: Auto-memory files are personal (stored in `~/.claude/`). `.gitignore` them. CLAUDE.md and `.claude/rules/` are team-shared — version control them.

### 3.4 The "Remember" Pattern

During a session: "Remember that we use Biome instead of ESLint"

Claude saves to auto-memory for future sessions. Use for lasting personal preferences. Reserve CLAUDE.md for team rules.

### 3.5 Session Memory (v2.0.64+)

Feature flag `tengu_session_memory`: Writes background summaries (title, status, results, work log) to `~/.claude/projects/<hash>/`. On session start, automatically recalled.

### 3.6 Every Correction Becomes a Rule (Compounding Engineering)

**The pattern**: Agent keeps using npm → add to CLAUDE.md: "Package manager: pnpm (never npm or yarn)." Corrections stop overnight.

If you correct the agent on something that applies broadly, add it to CLAUDE.md immediately — don't wait for 3 occurrences. Corrections compound: each one makes every future session smarter. The team that adds 2 rules per week has a CLAUDE.md that prevents 100+ mistakes by month 3.

**Compounding effect**: CLAUDE.md, PR reviews, and session corrections all feed the same system. Every PR review finding → rule. Every debug discovery → pitfall. The codebase gets smarter from every interaction.

---

## 4. Slash Commands (.claude/commands/)

### 4.1 How They Work

Markdown files in `.claude/commands/` become slash commands. Invoke with `/command-name`. Version-controlled, team-shared, consistent.

### 4.2 Essential Commands

**review-pr.md**:
```markdown
Review the current PR:

1. Run `git diff main...HEAD` to see all changes
2. Read each changed file in full (not just the diff)
3. Check for:
   - Logic errors and edge cases
   - Security issues (SQL injection, XSS, auth bypass)
   - Performance problems (N+1 queries, re-renders)
   - Missing error handling
   - Missing tests for new functionality
4. Run `pnpm typecheck` and `pnpm lint`
5. Summarize findings with severity (Critical/Warning/Suggestion)
6. If all checks pass, say "LGTM — ready to merge"
```

**deploy-staging.md**:
```markdown
Deploy to staging environment:

1. Run `pnpm test` — ensure all tests pass
2. Run `pnpm build` — ensure clean build
3. Run `vercel --env staging`
4. Wait for deployment URL
5. Run `curl -s [staging-url]/api/health` to verify
6. Report deployment status and URL
```

**tech-debt.md**:
```markdown
Audit technical debt in the current codebase:

1. Run `pnpm lint` — count total warnings and errors
2. Run `pnpm typecheck` — count type errors
3. Search for TODO/FIXME/HACK comments: `grep -r "TODO\|FIXME\|HACK" src/`
4. Check for unused dependencies: `npx depcheck`
5. Check for outdated dependencies: `pnpm outdated`
6. Summarize findings ranked by severity
7. Suggest top 3 items to address first
```

**test-feature.md**:
```markdown
Test the current feature branch thoroughly:

1. Run `git diff main...HEAD --stat` to see what changed
2. For each changed file, run related tests
3. If no tests exist for changed code, write them
4. Run full test suite: `pnpm test`
5. Run typecheck: `pnpm typecheck`
6. Report: what passed, what failed, what's untested
```

### 4.3 Inner-Loop Commands

Commands should cover things you do **many times per day**, not just weekly operations. The highest-ROI commands are the ones you invoke reflexively:

| Frequency | Example Commands |
|-----------|-----------------|
| After every code write (reuse / quality) | Custom `Simplifier` subagent — read-only review for reuse opportunities, dead code, overengineering (defined per project in `.claude/agents/`). As of v2.1.154 Claude Code also ships a built-in `/simplify` (cleanup-only) covering a similar lens; the custom subagent stays useful for project-specific rules. |
| After every code write (correctness) | `/code-review` — built-in slash command for correctness bugs; choose effort via the relabeled Faster/Smarter control, `--fix` applies findings to the working tree. (History: `simplify` was renamed to `/code-review` in v2.1.147, then v2.1.154 re-introduced `/simplify` as a *separate* cleanup-only command — the two now coexist rather than one aliasing the other.) |
| Before every commit | `/review-pr` — self-review before pushing |
| After every feature | `/test-feature` — verify coverage |
| Weekly | `/tech-debt`, `/deploy-staging` |

**Rule of thumb**: If you do it 3+ times per session, it should be a slash command. If you do it every session, it should be in the daily checklist.

---

## 5. Modular Rules (.claude/rules/)

> Migrating rules/skills/agents from a Cursor setup (or standing up a Cursor mirror)? Recipe: `workflows/MIGRATION-CURSOR-CLAUDE.md`.

### 5.1 When to Use

For rules that are scoped to specific contexts or temporary:

```markdown
# .claude/rules/migration.md
# Active during the v2 API migration. Remove after merge.

- All new API routes use /api/v2/ prefix
- Old v1 routes must remain functional
- Add deprecation headers to v1 responses
- Every v2 route needs corresponding v1 compatibility test
```

### 5.2 Relationship to CLAUDE.md

CLAUDE.md = universal, always loaded. `.claude/rules/` = modular additions loaded per session. Keep CLAUDE.md focused on permanent conventions; use rules/ for temporary or situational context.

---

## 6. Subagents

### 6.1 Overview

Claude Code supports up to 10 simultaneous subagents. Each gets:
- Independent context window (no pollution from parent)
- Scoped file access and tools
- Parallel execution

### 6.2 When to Use

| Use Subagents | Stay Single |
|--------------|-------------|
| Naturally independent subtasks | Sequential, dependent steps |
| Different expertise per subtask | Simple tasks one agent handles |
| Task too large for one context | Speed matters over quality |
| Need parallel execution | Cost is a concern |

### 6.3 How to Invoke

In prompts: "Use subagents to handle this in parallel" or "Fork a subagent for [specific task]."

In skills: Use `context: fork` to run in isolated subagent — main context only sees final result, not intermediate tool calls.

### 6.4 Three-Stage Pipeline Pattern

```
1. pm-spec agent   — Reads input, writes spec with acceptance criteria
                     Tools: Read, Write (docs only)

2. review agent    — Validates spec against constraints, decision record
                     Tools: Read

3. implementer     — Writes code + tests, updates docs
                     Tools: Bash, Read, Write
```

Each agent has scoped tool access. Artifacts (specs, decision records) pass between agents via files, not conversation.

### 6.5 Result Aggregation

The parent Claude Code session coordinates:
- Assigns subtasks to subagents
- Receives results
- Merges/selects/validates

Write intermediate results to files that subsequent agents read. Don't pass conversation history — pass artifacts.

### 6.6 Three Standard Subagents (Minimum Viable Set)

Every project should define at minimum:

1. **Simplifier** — runs after implementation. Reviews for reuse opportunities, dead code, unnecessary complexity. Does NOT write — only reports.
2. **Reviewer** — code review before commit. Checks correctness, security, conventions, test coverage. Read-only access.
3. **Verifier** — runs build + lint + test, reports pass/fail. Mechanical verification, not reasoning.

Define as `.claude/agents/` markdown files. The simplifier catches overengineering. The reviewer catches bugs. The verifier catches regressions. Together they form a quality gate that compounds across sessions.

---

## 7. Hooks

### 7.1 What They Are

Shell commands that run before/after Claude Code actions. Auto-formatting, linting, custom validation.

### 7.2 Common Hooks

**After file edit** — auto-format:
```bash
# Runs after any file modification
biome check --write $FILE
```

**Before commit** — lint + typecheck:
```bash
pnpm typecheck && pnpm lint
```

**After file edit** — run related tests:
```bash
# Run test for the modified file if it exists
TEST_FILE="${FILE%.ts}.test.ts"
if [ -f "$TEST_FILE" ]; then
  pnpm vitest run "$TEST_FILE"
fi
```

### 7.3 Benefits

- Catches errors immediately (tighter feedback loop)
- Auto-fixes formatting (agent doesn't waste tokens on style)
- Enforces quality gates without relying on agent compliance
- Mechanical verification > model reasoning

### 7.4 PostToolUse Hook Configuration

Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx biome check --write \"$CLAUDE_FILE\" 2>&1 || true"
          }
        ]
      }
    ]
  }
}
```

**Standard hooks to configure per project**:
- After `Write|Edit` → auto-format (Biome/Prettier/project formatter)
- After `Write|Edit` → budget/lint checks (if project has line budgets or rules)
- After `Bash(git commit)` → run lint to catch last-mile issues

Don't rely on the agent to format correctly — hooks guarantee it mechanically.

### 7.5 Permissions Configuration

Configure allow/deny lists in `.claude/settings.json` instead of `--dangerously-skip-permissions`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git log:*)", "Bash(git diff:*)", "Bash(git status:*)",
      "Bash(git branch:*)", "Bash(git show:*)", "Bash(git add:*)",
      "Bash(git commit:*)", "Bash(ls:*)", "Bash(wc:*)", "Bash(which:*)",
      "Bash(cd PROJECT && PKG_MGR build)",
      "Bash(cd PROJECT && PKG_MGR lint)",
      "Bash(cd PROJECT && PKG_MGR test)"
    ],
    "deny": [
      "Bash(rm -rf:*)", "Bash(git push --force:*)",
      "Bash(git reset --hard:*)",
      "Read(.env)", "Read(.env.local)", "Read(.env.production)"
    ]
  }
}
```

**Principle**: Pre-allow everything safe (git reads, builds, lints, tests). Deny everything destructive (force push, hard reset, secret files). The agent moves fast on safe operations, pauses for dangerous ones. Never use `--dangerously-skip-permissions` — configure granular access instead.

---

## 8. MCP Configuration

### 8.1 Setup

Create `.mcp.json` at project root:

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
      "args": [
        "-y", "@modelcontextprotocol/server-filesystem",
        "./src", "./docs"
      ]
    }
  }
}
```

User-level (all projects) in `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "..." }
    }
  }
}
```

### 8.2 Recommended Stack

| Server | Project-level | User-level | Why |
|--------|:---:|:---:|-----|
| GitHub MCP | Yes | — | Project-specific token |
| Database MCP | Yes | — | Project-specific connection |
| Filesystem MCP | Yes | — | Scoped to project dirs |
| Context7 | — | Yes | Docs for any project |
| Brave Search | — | Yes | Web research for any project |

### 8.3 Transport Types

- **stdio**: Local process (stdin/stdout). For Filesystem, Postgres, Playwright.
- **HTTP/SSE**: Remote server. For cloud services (GitHub, Sentry, Vercel).

### 8.4 MCP as Unified Interface

The goal is making Claude Code the **single UI for all tools**. Not just code but also project management, error logs, analytics, database queries, CMS. Each MCP server replaces one browser tab or CLI context switch. Audit your daily tool switches — each is a candidate for MCP integration.

### 8.5 Security

- Read-only DB by default
- Filesystem: list allowed dirs explicitly
- Env vars for all credentials
- Pin server versions
- Scan: `uvx snyk-agent-scan@latest` (Snyk Agent Scan; needs `SNYK_TOKEN` for full verdict)

---

## 9. Session Management

### 9.1 Session Lifecycle

**Conversations don't carry over between sessions.** Each session starts fresh. The only persistent state:
- CLAUDE.md (loaded every time)
- Auto-memory (recalled automatically)
- `.claude/rules/` (loaded every time)

### 9.2 When to Start Fresh

Start a new session when:
- Switching to a different task
- Context feels exhausted (generic answers, ignoring rules)
- After completing a feature
- After debugging a complex issue (stale error context)

### 9.3 Continuing Sessions

```bash
# Continue the most recent session (raw conversation preserved)
claude --continue

# Resume a specific session by ID
claude --resume <session-id>
```

**Caution**: Context quality degrades in long sessions. Fresh sessions with focused context outperform continued sessions with accumulated noise.

### 9.4 Context Editing (2026)

Automatic clearing of stale tool call outputs while preserving conversation flow. Cut token consumption by 84% for 100-turn workflows. This is the most effective tool for long sessions.

### 9.5 Plan Mode Protocol

Halves token consumption by mapping work before executing. **Start every non-trivial session in Plan mode** (Shift+Tab twice in terminal).

**Protocol**:
1. Enter Plan mode before writing any code
2. Agent explores codebase, reads relevant files, maps affected areas
3. Review the plan — challenge assumptions, add missed files, clarify scope
4. Iterate until the plan accounts for all requirements
5. Switch to execution (auto-accept mode if trusted)

**When to use**: any task touching 3+ files, any architectural change, any feature involving multiple concerns (data + API + UI). The only tasks that skip planning are single-file fixes with obvious scope.

**Why it works**: Planning uses ~50% fewer tokens than blind implementation + correction cycles. The plan itself becomes a checklist that prevents drift mid-implementation.

---

## 10. Workflow Patterns

### 10.1 Daily Development Flow

```
1. cd project && claude
2. One task per session — keep focused
3. "Plan first" for complex tasks
4. Let agent search before implementing
5. Review each file change
6. Agent runs typecheck + lint + tests
7. Commit with conventional commits
8. Start new session for next task
```

### 10.2 The "Interview Then Execute" Pattern

Separates planning from implementation context:

```
Session 1: "Interview me about [feature]. Ask questions to build a complete spec."
  → Claude asks clarifying questions
  → You answer
  → Claude writes spec to docs/specs/feature.md

Session 2: "Implement the spec in docs/specs/feature.md"
  → Fresh context, focused on execution
```

### 10.3 Complex Feature Implementation

```
1. Plan: "Map all files that need changes for [feature]"
2. Review plan, adjust
3. "Implement the data layer changes first" (one area at a time)
4. Verify: "Run typecheck and tests"
5. "Now implement the API routes"
6. Verify again
7. "Now implement the UI components"
8. Final: "Review all changes, run full test suite"
```

### 10.4 Debugging Flow

```
1. Paste error or describe bug
2. "Search the codebase for where [function/module] is used"
3. Agent investigates, forms hypothesis
4. "Fix it and run the tests to verify"
5. If stuck: "What have we tried? What else could cause this?"
```

### 10.5 The "Challenge" Pattern

```
"Knowing everything you know now, scrap this and do it the right way."
"Grill me on these changes and don't make a PR until I pass your test."
"Diff between main and my branch — explain every change."
"Prove to me this works."
```

### 10.6 Git Workflow

```bash
# Agent can manage git directly
"Create a feature branch, implement [feature], commit with conventional commits"

# Git worktrees for parallel agents
git worktree add ../feature-auth -b feature/auth
git worktree add ../feature-payments -b feature/payments
# Run separate Claude Code sessions in each worktree
```

### 10.7 Parallel Development with Worktrees

Each agent gets its own working directory and branch:

```bash
# Terminal 1
cd feature-auth && claude
# "Implement OAuth2 login flow"

# Terminal 2
cd feature-payments && claude
# "Add Stripe webhook handling"
```

Use tmux for multiple sessions simultaneously. Agents work in parallel without conflicts.

### 10.8 Parallel Execution Across Sessions

Run 3-5 Claude Code terminal sessions simultaneously for independent tasks. **If two tasks touch different files, they should be in parallel sessions.**

**Setup**:
1. Number terminal tabs 1-5 (or use tmux panes)
2. Each session gets one focused task with a distinct scope
3. Enable system notifications for "input needed" — work on other tabs while one processes
4. Commit frequently from each session to prevent merge conflicts

**Combining local and web sessions**: Use claude.ai/code alongside terminal sessions for read-heavy tasks (research, code review, architecture questions) while terminal sessions handle implementation. Use `--teleport` to move a session from terminal to web or back.

**Anti-pattern**: Never sequence independent work. Time is a resource. If auth and payments don't share files, they run in parallel.

---

## 11. Cost Optimization

### 11.1 Token Budget Reality

200K token context window. Fills fast once you factor:
- ~50 internal harness instructions
- CLAUDE.md content
- File contents from tool calls
- Tool outputs
- Conversation history

### 11.2 Model Selection

Default to **Opus with thinking** for implementation tasks — it's slower per-token but needs less steering, resulting in faster total time and fewer correction cycles.

| Task Type | Model | Why |
|-----------|-------|-----|
| Multi-file implementation | Opus + thinking | Better tool use, less steering needed |
| Architecture planning | Opus + thinking | Deeper reasoning, catches edge cases |
| Quick code reads/audits | Sonnet | Fast enough, saves cost |
| Simple lookups, linting | Haiku (subagent) | Mechanical tasks, 25x cheaper |
| Exploratory research | Sonnet (subagent) | Good enough for search + summarize |

**Heuristic**: If you'd need to correct Sonnet's output, Opus was cheaper. The cost of one correction cycle > the cost difference between models.

**Resilience lever (2026-06)**: declare a `fallbackModel` chain (Claude Code v2.1.166 — up to 3 models tried in order) so overload/unavailability degrades gracefully instead of failing, and so a model going *administratively unavailable* (as Fable 5 did on 2026-06-12) doesn't strand the run. Pin to a model **class + chain, never a single ID** (`CLAUDE-SURFACE-ROUTING.md` §1b).

### 11.3 Cost Levers

| Strategy | Savings | How |
|----------|---------|-----|
| Plan mode | ~50% tokens | Map before executing |
| Fresh sessions | Eliminates waste | No stale context accumulation |
| Concise CLAUDE.md | Reduces per-call overhead | 80-150 lines, not 500 |
| Context editing | 84% reduction | Automatic stale output clearing |
| `opusplan` alias | 40-60% | Opus for planning, Sonnet for implementation |
| Subagents with cheaper models | Variable | Mechanical tasks on Sonnet/Haiku |

**Settings-level numeric levers** (env vars verified against the official env-vars docs 2026-07-02; effect figures are field reports from large public config catalogs — directional, not benchmarked):

| Env var (in `settings.json` `env` or shell) | Lever | Effect |
|---|---|---|
| `MAX_THINKING_TOKENS` | Cap at ~10,000 for routine work; `0` disables thinking entirely | Cuts hidden thinking cost per request (field-reported ~70% on routine tasks) |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | `50` for long sessions (official docs' own example; default triggers near full window) | Compacts earlier — avoids the quality cliff near a full context window |
| `CLAUDE_CODE_SUBAGENT_MODEL` | `haiku` for mechanical subagents (v2.1.196+: `inherit` = unset) | Enforces the §11.2 routing table mechanically |

**MCP surface ceiling**: every enabled server's tool descriptions bill against every call — a bloated MCP config can shrink a 200K window toward ~70K usable. Field convention: keep under ~10 servers / ~80 active tools enabled per project; disable the rest per-project rather than globally.

**Compaction doctrine**: run `/compact` at logical breakpoints — after a research phase, after a milestone, after abandoning an approach — instead of relying on autocompact firing near a full window. Never compact mid-implementation: you lose variable names, file paths, and partial state.

### 11.4 Pricing (March 2026)

| Plan | Monthly | Usage |
|------|---------|-------|
| Pro | $20 | Included with Claude Pro subscription |
| Max 5x | $100 | 5x Pro usage |
| Max 20x | $200 | 20x Pro usage |
| API direct | Variable | Pay-per-token (most flexible, most variable) |

Average: **$6/developer/day** (90th percentile under $12).

### 11.5 Cost Monitoring

```bash
# Zero-install usage tracking
npx ccusage

# Shows daily, monthly, and per-session reports from local JSONL logs
```

### 11.6 The "$30 Mistake"

One developer documented an agent spending 47 iterations on a single ALTER TABLE command. Prevention:
- Set clear scope before starting
- Interrupt agent loops early ("Stop. The issue is X. The fix is Y.")
- Use plan mode to prevent blind iteration
- Circuit breakers: "If you haven't solved this in 5 attempts, stop and explain what's blocking you"

**The scale variant — fire-and-forget subagent chains.** Subagent orchestration at scale costs `calls × ~31.5k` of fixed per-call context *before any work happens* — count calls (not just tokens), batch trials, and checkpoint at stage/workstream boundaries so a fire-and-forget chain can't spend past its budget before control returns. Full anti-pattern in KB-04 §4.9 ("fire-and-forget subagent chains"); measured basis in harness `RUNBOOK.md` §1 cost reality.

---

## 12. Agent SDK

### 12.1 What It Is

Build custom agents powered by Claude Code's tools and capabilities, with full orchestration control. Beyond the built-in subagents.

### 12.2 When to Use

- Complex multi-agent pipelines
- Custom orchestration logic beyond simple subagent delegation
- Integration with external systems
- Automated workflows triggered by events

---

## 13. Cross-Tool Workflow (Cursor + Claude Code)

### 13.1 The Dual-Tool Pattern

**Claude Code** excels at: parallel exploration, multi-file autonomous changes, long debugging, architecture reasoning, documentation generation.

**Cursor** excels at: inline autocomplete (Cmd+K), visual diff review, tight feedback loops, quick edits.

**Pattern**: Plan and explore in Claude Code → implement and refine in Cursor.

### 13.2 Shared State

Both operate on the same filesystem. Shared state files:
- `AGENTS.md` — both tools read this
- `CLAUDE.md` — Claude Code reads
- `.cursor/rules/` — Cursor reads
- Git — universal handoff layer

### 13.3 HANDOFF.md Protocol

When switching between tools mid-task, write a handoff file:

```markdown
# Handoff: [Task]
**Status**: In Progress | **Branch**: feature/auth

## Completed
- [x] OAuth2 config (src/auth/config.ts)

## Failed Approaches — DO NOT REPEAT
Tried passport.js — middleware conflict. Switched to oauth4webapi.

## Current State
**Working**: Login returns valid tokens
**Broken**: Refresh endpoint 500 at refresh.ts:42

## Code Signature
// src/auth/refresh.ts:38 — BUG: wrong secret
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Should use REFRESH_SECRET

## Resume Instructions
1. Fix refresh.ts:42 — use REFRESH_SECRET
2. Add logout endpoint
3. Run: `pnpm test -- --grep "auth"` (expect 12/14 passing)
```

---

## 14. Team Workflows

### 14.1 Sharing Configuration

**Version control**:
```bash
git add CLAUDE.md AGENTS.md .claude/commands/ .claude/rules/ .mcp.json
```

**Onboarding**: New member clones → gets full AI context. Same quality as veteran.

### 14.2 Personal vs Team

| Team (commit) | Personal (don't commit) |
|--------------|------------------------|
| CLAUDE.md | `~/.claude/CLAUDE.md` |
| .claude/commands/ | Auto-memory files |
| .claude/rules/ | ~/.claude/settings.json |
| .mcp.json | |
| AGENTS.md | |

### 14.3 Context Governance

- New dependency → update CLAUDE.md stack
- Build command change → update CLAUDE.md commands
- Same mistake 3x → add to CLAUDE.md pitfalls
- Framework upgrade → review all version references
- Monthly: review CLAUDE.md for staleness

---

## 15. Feedback Loops — The Quality Multiplier

An agent without feedback loops produces mediocre work. An agent WITH feedback loops self-corrects to **2-3x quality**. This is the single highest-ROI pattern in AI-assisted development.

### 15.1 The Verification Chain

Every implementation must run through a concrete chain before commit:

```
1. Build    → Does it compile? (catches import errors, type mismatches)
2. Lint     → Does it pass style? (catches formatting, convention violations)
3. Test     → Do affected tests pass? (catches regressions, logic errors)
4. Visual   → Does it look right? (preview server if applicable)
5. Spec     → Does it match requirements? (re-read original task, score PASS/MISS)
```

Steps 1-3 are mechanical (hooks can automate). Steps 4-5 require agent reasoning. Together they catch ~95% of issues before commit.

### 15.2 Configuring Feedback Loops

**Minimal**: `build && lint && test` after every change. Configure as PostToolUse hooks or as the last step in every slash command.

**Standard**: Add visual verification via preview server. After UI changes, take a screenshot or check accessibility snapshot.

**Full**: Add spec compliance check. Agent re-reads the original task description and scores each requirement PASS/MISS.

### 15.3 When Writing Prompts for Agents

ALWAYS specify the feedback loop chain. Never say "build it" without saying "and verify it this way."

Bad: "Implement the contact form"
Good: "Implement the contact form. After implementation: run `yarn build && yarn lint`, run affected tests, verify the form renders in preview, and confirm all fields from the spec are present."

---

## 16. GitHub Action Integration

### 16.1 @claude on PRs

Install the Claude Code GitHub Action (`/install-github-action`) to enable tagging @claude on any PR. Claude reviews the diff, comments with findings, and can even fix issues and push commits.

**Security floor — pin `claude-code-action` ≥ v1.0.94.** Pre-v1.0.94 versions automatically trusted any GitHub actor whose username ended in `[bot]`. A fake-bot account plus prompt injection in an issue body could exfiltrate OIDC tokens and gain repo write access (RyotaK / GMO Flatt Security disclosure, CVSS 7.8, public 2026-06-04; fixed in v1.0.94 via enforced `checkHumanActor`, child-process env-var scrubbing, a wrapped `gh` CLI, and ignore-edited-after-trigger logic). Workflows pinned to a floating `@v1`-style tag pick up the fix automatically — verify; explicit SHA/version pins must be bumped by hand.

**Never ship `allowed_non_write_users: "*"`.** Anthropic's own early issue-triage example contained this setting; repos that copied it let any GitHub user trigger the agent. Treat issue and PR bodies from non-collaborators as untrusted prompt-injection input, and scope `allowed_non_write_users` to an explicit list or remove it entirely.

### 16.2 Compounding Engineering

Every PR review finding is a candidate for a new rule. When @claude finds a pattern issue across multiple PRs, add it to CLAUDE.md or `.claude/rules/`. The codebase gets smarter from every review.

### 16.3 Setup

```bash
# In Claude Code terminal
/install-github-action
# Follow prompts to configure repository access
```

Use case: tag @claude on coworkers' PRs for automated first-pass review. Human reviewer focuses on architecture and business logic; Claude catches mechanical issues.

### 16.4 Billing note (effective 2026-06-15)

From 2026-06-15, GitHub Actions usage (along with Agent SDK and `claude -p` headless usage) stops drawing on plan rate limits and draws on a separate per-user monthly SDK credit (one-time opt-in; Pro $20 / Max 5x $100 / Max 20x $200 / Team $20–$100 / Enterprise $20–$200; no rollover; overflow goes to usage credits at API rates or stops). Production CI at scale should run on API keys, not plan credentials — per Anthropic's own guidance (support.claude.com article 15036540). Audit which credential your Action uses before the cutover.

---

## 17. Long-Running Task Management

### 17.1 Background Agents

Use `run_in_background` for tasks that don't need immediate results (test suites, builds, large refactors). Work on other tasks while background agents process.

### 17.2 Session Handoff

When approaching context limits (~80% of window), create a structured handoff rather than pushing through degraded quality:
1. Commit all current work
2. Write HANDOFF.md with status, remaining items, failed approaches
3. Start a fresh session that reads the handoff

### 17.3 Phase-Based Commits

For large tasks, commit after each logical phase. If context exhausts mid-task, no work is lost. Each phase's commit message documents what was done and what remains.

### 17.4 Stop Hooks

Configure hooks that run when a session ends to perform deterministic verification — ensuring no half-finished state is left behind.

---

## 18. Troubleshooting

### 18.1 Agent Ignoring CLAUDE.md

- File too long? Cut to 80-150 lines
- Irrelevant content? Claude's `<system-reminder>` wrapper causes filtering
- Test: ask "What package manager does this project use?"
- `/memory show` to verify what's loaded

### 18.2 Context Exhaustion

- Symptoms: generic answers, ignoring rules, agreeing with everything
- Fix: start new session
- Prevention: plan mode, fresh sessions per task, concise CLAUDE.md

### 18.3 Auto-Memory Issues

- `/memory show` to inspect
- `/memory refresh` to force reload
- Delete `~/.claude/projects/<hash>/` to reset

### 18.4 MCP Not Working

- Check `.mcp.json` syntax (JSON must be valid)
- Verify env vars are set in your shell
- Test server independently in terminal
- Check Claude Code MCP panel for errors

### 18.5 Subagent Failures

- Subagent failures should not crash parent
- If stuck: reduce scope, provide explicit instructions
- Write self-contained task descriptions (subagents lack parent context)
- Include file paths, not "the component we discussed"

---

## 19. Quick Reference

### Commands

| Command | Action |
|---------|--------|
| `/init` | Generate CLAUDE.md |
| `/memory show` | Inspect loaded memory |
| `/memory refresh` | Reload from disk |
| `/remember [text]` | Save to permanent memory |
| `/[command-name]` | Run custom slash command |
| `--continue` | Resume most recent session |
| `--resume <id>` | Resume specific session |

### File Locations

| File | Location | Purpose |
|------|----------|---------|
| Project memory | `./CLAUDE.md` | Team conventions |
| Global memory | `~/.claude/CLAUDE.md` | Personal preferences |
| Slash commands | `.claude/commands/*.md` | Reusable workflows |
| Modular rules | `.claude/rules/*.md` | Scoped/temporary rules |
| MCP config (project) | `.mcp.json` | Project tool integrations |
| MCP config (global) | `~/.claude/settings.json` | Personal tool integrations |
| Auto-memory | `~/.claude/projects/<hash>/` | Automatic learnings |
| Interop | `./AGENTS.md` | Cross-IDE standard |

### Daily Checklist

- [ ] Fresh session for each distinct task
- [ ] Plan mode for non-trivial tasks (Shift+Tab twice)
- [ ] Parallel sessions for independent work
- [ ] Agent searches before implementing
- [ ] Review each file change
- [ ] Feedback loop: build + lint + test + visual after changes
- [ ] Conventional commit messages
- [ ] Any correction that applies broadly → add to CLAUDE.md immediately
- [ ] End of day: `/memory show` to check what was learned

---

*Complete Claude Code workflow reference. April 2026. Integrates Boris Cherny's 13 pro tips. For Cursor IDE workflow, see WORKFLOW-CURSOR.md.*
