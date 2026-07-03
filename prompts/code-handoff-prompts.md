# Claude Code Handoff Prompt Library — Generic Template

*Path: `prompts/code-handoff-prompts.md`*
*Surface: Claude Code (CLI / IDE extensions / Desktop "Code" tab / web / iOS). "Code" in this kit means the agentic coding surface — CLI repo-write + MCP + Skills + custom subagents + git ops + Bash + per-call WebSearch/WebFetch — not a generic chat. See `knowledge-base/CLAUDE-SURFACE-ROUTING.md` for the routing matrix and `workflows/WORKFLOW-CLAUDE-CODE.md` for conventions this file inherits.*
*Plan: paid tier required (Pro/Max/Team/Enterprise); 1M-context is auto-on for Opus 4.6/4.7/4.8 and Sonnet 4.6 on Max/Team/Enterprise.*

This file is a **template you instantiate per project**. The kit ships it generic; you fill placeholders, add stack-specific rule references, and drop the 3–4 worked examples below into your repo's own `prompts/code-handoff-prompts.md`. Once instantiated, the file becomes the canonical place to grab the prompt you need for a recurring Code workflow without re-typing the constraints every time.

**Where this fits in the kit.** The kit splits recurring AI work across three Anthropic-native surfaces — Chat (citation-backed research), Cowork (local file R/W + dashboard ops + scheduled tasks), and Code (this file: agentic repo work, audits, gates). Each surface gets its own prompt library so you can route a task to the right tool the first time. The split is enforced by `knowledge-base/CLAUDE-SURFACE-ROUTING.md` decision rubric: if the deliverable is a file edit, a code-grounded report, or a git artifact, it belongs here; otherwise it belongs in one of the siblings.

**Per-template 5-field structure.** Every template in this library uses the same five fields, in this order. Do not invent new fields; if a constraint needs space, push it into the rule files under `.claude/rules/` and reference them.

1. **Task name** — short, action-led, unique inside the file (e.g. *Locked-rule conformance pass*).
2. **When to use** — the trigger condition. One or two sentences. If you can't write a trigger, the template doesn't earn its place.
3. **Open these first** — the files Claude Code should read before doing anything else. Almost always: `CLAUDE.md`, the relevant `.claude/rules/*.md`, and the directory the work touches.
4. **Prompt body** — the actual prompt you'll paste. Written in second person to the agent. Start with `cwd is {{REPO_PATH}}`. State Plan-mode usage explicitly. List BLOCKING constraints inline. End with the build/test commands the agent must run before returning.
5. **Deliverable** — what comes back. Usually one of: PASS/FAIL markdown report, branch + diff + DoD checklist, migration plan, hypothesis tree, gate report.

**Conventions inherited from the kit.**

- *Cwd convention.* All prompts assume `cwd = {{REPO_PATH}}` unless stated. Sub-directory cwds (e.g. `{{REPO_PATH}}/{{FRONTEND_DIR}}`) are stated explicitly in the prompt body's first sentence.
- *Placeholder syntax.* `{{DOUBLE_BRACES}}` for project-specific values the instantiator fills in once (`{{BUILD}}`, `{{LINT}}`, `{{TEST_E2E}}`, `{{PRIMARY_BRANCH}}`, `{{AUDITOR_AGENT_NAME}}`). `{SINGLE_BRACES}` for runtime values the operator fills per invocation (`{PAGE_NAME}`, `{METRIC}`, `{DATE_RANGE}`).
- *Cross-references.* When a Code template needs dashboard data (analytics, error counts, Lighthouse scores from a live URL), it depends on output from `prompts/cowork-browser-operations.md`. When it needs prior research synthesis (vendor comparisons, regulatory checks, citation-backed claims), it depends on `prompts/chat-research-missions.md`. Code does not do citation-grounded research and does not click through dashboards.

**Common placeholders to fill once at the top of your instantiated file.**

| Placeholder | What it stands for | Typical value |
|---|---|---|
| `{{REPO_PATH}}` | absolute path to the repo root | `~/Projects/Acme` |
| `{{PRIMARY_BRANCH}}` | the branch PRs target | `main` or `trunk` |
| `{{BUILD}}` | the one command that produces a clean build | `pnpm build` / `cargo build --release` / `make build` |
| `{{LINT}}` | the lint + format + typecheck umbrella | `pnpm lint && pnpm typecheck` |
| `{{TEST_E2E}}` | the end-to-end test runner invocation | `pnpm test:e2e` / `playwright test` |
| `{{ROUTES_OR_ENTRYPOINTS}}` | the subtrees worth scanning | `apps/web/ apps/api/` or `src/` |
| `{{AUDITOR_AGENT_NAME}}` | the project's release-gate subagent, if any | the file under `.claude/agents/` |
| `{{E2E_DIR}}` | where the E2E specs live | `e2e/` or `tests/e2e/` |

If a placeholder doesn't apply to your stack, delete the template that uses it rather than leaving an unfilled `{{...}}` in production prompts — half-filled prompts are worse than no prompt.

---

## How to write your own template

A new template earns its place when **all three** of these are true: the workflow recurs across PRs or sprints; the constraint list is long enough that re-typing it costs you more than reading a template; and the deliverable is a file edit, a code-grounded report, or a git artifact. If any one fails, the work belongs elsewhere.

**Anti-patterns.** One-off scripts that won't run again — write them inline, don't template them. Pure research with no repo touch (vendor comparison, regulatory survey, citation-grounded brief) — belongs in `prompts/chat-research-missions.md`; Code has no Research mode and no citation renderer. Dashboard ops (pulling numbers from Vercel/Stripe/GA4, taking screenshots of a deployed page) — belongs in `prompts/cowork-browser-operations.md`; Code has no Computer Use and no browser. Long agentic loops with no terminal state — Code's Plan mode + checkpoints are designed for bounded coding loops, not for open-ended exploration; if you can't write a tight Deliverable line, you don't have a Code template yet.

**Writing the prompt body.** Lead with `cwd is …`. State Plan mode explicitly if the task is risky (`Enter Plan mode first; surface the plan before writing any code.`). Inline only the BLOCKING constraints; everything else lives in `.claude/rules/*.md` and gets referenced by path. Close with the exact commands the agent runs before returning (e.g. `{{BUILD}} && {{LINT}}` — if either fails, fix before returning). Cap long scans with a wall-clock budget (`Cap the scan at 15 minutes.`) — 1M-context tempts unbounded reads.

**Sizing.** A good Code template is 8–25 lines in the prompt body. Shorter than 8 means the constraints don't justify a template. Longer than 25 means the constraint set should be promoted to a `.claude/rules/*.md` file and referenced.

**Tier and context-budget notes.** 1M-context (Sonnet 4.6 / Opus 4.6+) is auto-on for Max/Team/Enterprise on Code — see `knowledge-base/CLAUDE-SURFACE-ROUTING.md` row 9. On Pro tier you stay at 200K, so audit templates (Template B) should narrow the scan path explicitly rather than blanket-globbing. The `/effort` slider and the cheaper Explore subagent (Haiku 4.5) exist precisely so you can spend Opus 4.7 only on the synthesis pass; if a template reads a lot but writes a little, delegate the read leg.

**Plan mode.** Use it for any template whose prompt body lists more than two BLOCKING constraints. Plan mode forces the agent to surface its approach before file writes, which is the cheapest place to catch a misread constraint. Templates A, C, and D below explicitly invoke it; Template B does not, because its output is a report-only audit with no write step to gate.

**Subagent delegation.** Three subagent roles recur across these templates: an **Explore** agent (Haiku 4.5) for cheap broad reads, a **synthesis** agent (Sonnet 4.6 or Opus 4.7) for ranking and reporting, and a domain **auditor** agent (e.g. the `{{AUDITOR_AGENT_NAME}}` referenced in Template D) for release-blocking constraint enforcement. Define each as a `.claude/agents/*.md` once and invoke by name from the templates rather than inlining their constraint catalogs.

**Expected rule files.** The templates below assume your project has at minimum `.claude/rules/performance.md` (referenced by Template C), and either a single `.claude/rules/release.md` or multiple concern-scoped files like `.claude/rules/a11y.md`, `.claude/rules/seo.md`, `.claude/rules/security.md` (referenced by Template D). If those files don't exist yet, generate them before instantiating the templates — running Template A against an empty `.claude/rules/` returns a thin "no rules found" report rather than meaningful conformance signal.

---

## Template A — Locked-rule conformance pass (before any PR)

**When to use.** Before opening any PR that touches code under enforcement. Before any release branch cuts.
**Open these first.** `{{REPO_PATH}}/CLAUDE.md` · all of `.claude/rules/*.md` · the changed files on the branch.
**Prompt body.**
> cwd is `{{REPO_PATH}}`. Enter Plan mode. Read every file under `.claude/rules/` and every "Common Pitfalls" bullet in `CLAUDE.md`. Then diff the current branch against `{{PRIMARY_BRANCH}}`. <!-- example: main --> For every changed file produce: (a) which rule files apply; (b) per-rule conformance PASS/FAIL with a cited line number; (c) any CLAUDE.md Common Pitfall that the diff risks triggering.
>
> Specifically enforce the project's locked rules — read them from `.claude/rules/` rather than re-stating here, so this template stays in sync as rules evolve. <!-- example: framework version pins, awaited async APIs, single-source SEO helpers, no-`sudo` global installs -->
>
> Produce a single markdown report with FAIL rows ranked by severity (BLOCKING / HIGH / MEDIUM / LOW). Do NOT edit files — report only.

**Deliverable.** PASS/FAIL markdown report + ranked FAIL punch list (file:line + rule + fix sketch).

*Common variations.* Tighten the diff base to a previous release tag instead of `{{PRIMARY_BRANCH}}` when auditing what landed since the last cut. Pre-narrow to the directories the PR claims to touch when the branch is large — Plan mode will surface that narrowing for your approval before the read leg starts.

---

## Template B — 1M-context monorepo audit (hunting a pattern everywhere)

**When to use.** Whenever a locked rule changes and you need to find every call site of the old pattern. Whenever a dependency upgrade changes a signature you used in many places. Whenever you suspect a forbidden token or stale import lingers in dead corners of the repo.
**Open these first.** Whichever rule file defines the new lock (or the changelog entry that introduced the breaking change) · the working branch.
**Prompt body.**
> cwd is `{{REPO_PATH}}`. 1M-context is auto-on for Sonnet 4.6 / Opus 4.6+ on Max/Team/Enterprise (see `knowledge-base/CLAUDE-SURFACE-ROUTING.md` row 9). Delegate broad exploration to the Explore subagent (Haiku 4.5) to preserve Opus/Sonnet budget on the synthesis step.
>
> Task: find every call site of `{PATTERN}` across `{{REPO_PATH}}` (include `{{ROUTES_OR_ENTRYPOINTS}}`, exclude build artifacts and vendored dirs). <!-- example: every `revalidateTag(tag)` 1-arg call across `storefront/` and `api/` --> For each hit produce: file:line · surrounding 3 lines of context · fix required (yes/no) · fix sketch (≤2 lines).
>
> Then produce a single migration-plan markdown ordered by blast radius (number of dependents touched), plus a per-file change list ordered for safe sequential application. Do NOT edit files — report only. Cap the scan at 15 minutes; if incomplete, return what you have plus a continuation note.

**Deliverable.** Migration plan + per-file change list + blast-radius ranking.

*Common variations.* When the audit is for a forbidden token (a deprecated import, a banned utility class, a removed environment variable name) rather than a signature change, replace the "fix required" column with a "delete vs replace" column. When the migration is mechanical (one-to-one substitution with no judgement call), a follow-up Code session can take the per-file change list and apply edits; keep the audit pass strictly read-only so the diff base for that follow-up stays clean.

---

## Template C — Performance regression hunt

**When to use.** Anytime a perf metric regresses against the baseline — Core Web Vitals on a web project, p95 latency on an API, cold-start time on a service, bundle size or memory footprint on any build. Pair with a fresh dashboard pull from `prompts/cowork-browser-operations.md` so the hypothesis tree has real numbers to anchor on.
**Open these first.** The regression artifact (perf audit markdown, profiler trace, bundle analyzer output) · `.claude/rules/performance.md` (or the project's equivalent) · the build config the regression likely touches.
**Prompt body.**
> cwd is `{{REPO_PATH}}`. A regression landed: `{METRIC}` regressed `{DELTA}` on `{TARGET}` over `{DATE_RANGE}`. <!-- example: LCP regressed +480ms on /collection between 2026-04-12 and 2026-04-18 --> Enter Plan mode first. Do NOT fix — diagnose and rank.
>
> Produce a ranked hypothesis tree (top-5) drawn from the project's known regression vectors per `.claude/rules/performance.md`. Categories to consider: build output growth (bundle, image, font, asset payloads against the per-route budgets in the rule file); new code paths in the hot route (added client components, new middleware, added DB queries, N+1s); dependency upgrades since the baseline; config drift (build flags, caching headers, CDN rules); third-party load order or new external calls.
>
> For each of the top 3 hypotheses produce: (a) one-line statement of the hypothesis; (b) the exact diagnostic command(s) to confirm or refute it — shell, build flags, profiler invocation, or a short Playwright/k6/equivalent script; (c) the signal that would confirm; (d) estimated fix scope (XS/S/M/L).
>
> Target: 15 minutes of analysis. Then a rank-1 fix sketch only (no code yet).

**Deliverable.** Hypothesis tree (markdown) + diagnostic command sequence + rank-1 fix sketch.

*Common variations.* For API projects, replace the web-specific categories with: query plan changes (EXPLAIN regression), connection-pool saturation, added serialization work, retry-storm patterns, cache-hit-rate drop. For services, add: cold-start payload size, container image growth, sidecar config drift. The structure (top-5 hypotheses → top-3 diagnostics → rank-1 fix sketch) holds across all three; only the category catalog changes.

---

## Template D — Pre-release gate (cross-cutting checks)

**When to use.** Before any release that touches a user-facing surface, an API contract, or a security-sensitive path. As a standing monthly audit even when no release is queued. The specific checks (a11y, SEO, security, perf budgets, license compliance) come from your project's own `.claude/rules/*.md` — this template wires them into one pass.
**Open these first.** Test specs that the gate uses (`{{REPO_PATH}}/{{E2E_DIR}}` and friends) · every `.claude/rules/*.md` whose name matches a release-gate concern · the `{{AUDITOR_AGENT_NAME}}` subagent definition if one exists. <!-- example: .claude/agents/seo-auditor.md -->
**Prompt body.**
> cwd is `{{REPO_PATH}}`. Run the project's pre-release gate. No fixes this pass — report PASS/FAIL only with ranked remediation.
>
> Step 1: run the scoped automated checks. <!-- example: `{{TEST_E2E}} -g a11y` for axe-core specs --> Capture failures with file:line and the failing rule ID.
>
> Step 2: run any full-surface checks the project has wired up (Lighthouse, axe full-page, license scan, dependency-audit, secret scan — whichever apply per `.claude/rules/`). Reconcile against the scoped results when both exist; the rule file explains where scoped and full-surface diverge for this project.
>
> Step 3: if a domain-specific subagent exists (`{{AUDITOR_AGENT_NAME}}`), invoke it to enforce the release-blocking constraints catalogued in its definition — never re-state those constraints inline here; the subagent is the source of truth.
>
> Step 4: produce one markdown report: PASS/FAIL per gate · per-failure remediation ranked by severity (BLOCKING / HIGH / MEDIUM / LOW) · estimated fix scope per item · a one-line release recommendation (SHIP / HOLD).
>
> Commands the agent must have run before returning: `{{BUILD}}` (must be green), `{{LINT}}` (must be green), `{{TEST_E2E}}` (record failures; do not auto-skip).

**Deliverable.** Pre-release gate markdown · PASS/FAIL per gate · ranked remediation list · SHIP/HOLD recommendation.

*Common variations.* Split into separate templates (D-a a11y, D-b security, D-c SEO) once any single gate's constraint list grows past what fits in one head; until then, one Template D with subagent delegation per concern is leaner. If the project has no dedicated auditor subagent yet, skip Step 3 — but consider whether the recurring concern justifies authoring one under `.claude/agents/`.

---

## Calibration notes

A few patterns that consistently make these templates work well in practice.

*Keep the "Open these first" list short.* Three to six paths is the sweet spot. More than that and the agent's first move becomes a long read that burns the synthesis budget before it does anything useful. If you find yourself wanting eight paths, that's a signal a rule file is missing — promote the shared context into `.claude/rules/<concern>.md` and reference one path instead.

*Inline only what changes between invocations.* The 6th time you re-paste the same constraint into a template, move it to a rule file. The template body should read like a thin coordination layer over rules, not like a re-statement of them. The case study referenced in the footer demonstrates the inverse failure mode (long inline constraint blocks) — readable when you know the project, less portable across PRs.

*Treat the Deliverable line as a contract.* The agent will literally produce what that line names. "PASS/FAIL markdown report + ranked FAIL punch list" returns exactly that. "Branch + diff + DoD checklist" returns exactly that. Vague Deliverable lines ("a summary of findings") return vague output. If you can't write the Deliverable in 12 words, the template needs more sharpening.

*Wire the build/test commands into the prompt body, not the Deliverable.* The Deliverable describes what comes back to you; the build/test commands describe what the agent had to make green before returning. Putting them in the body lets you tighten or loosen them per template without touching the Deliverable contract.

*Re-read your templates on every locked-rule change.* When a rule file changes, the templates that reference it may now silently drift. The Locked-rule conformance pass (Template A) catches drift in code, but it does not audit your own prompt library — that's on you. A quick quarterly sweep through `prompts/code-handoff-prompts.md` for outdated example comments and constraint phrasing keeps the library honest.

---

## Worked invocation example

To show how a template lands in practice, here is Template A invoked on a hypothetical project on Pro tier (200K context):

> *Operator action.* Open a Claude Code session in `~/Projects/Acme`. Run `/clear` to get a clean context. Paste:
>
> > cwd is `~/Projects/Acme`. Enter Plan mode. Read every file under `.claude/rules/` and every "Common Pitfalls" bullet in `CLAUDE.md`. Then diff the current branch against `main`. For every changed file produce: (a) which rule files apply; (b) per-rule conformance PASS/FAIL with a cited line number; (c) any CLAUDE.md Common Pitfall that the diff risks triggering. Specifically enforce the project's locked rules — read them from `.claude/rules/` rather than re-stating here, so this template stays in sync as rules evolve. Produce a single markdown report with FAIL rows ranked by severity (BLOCKING / HIGH / MEDIUM / LOW). Do NOT edit files — report only.
>
> *Expected return.* A markdown report titled e.g. `Locked-rule conformance — feature/checkout-redesign @ 2026-05-24`, one section per changed file, FAIL rows sorted by severity, each FAIL row carrying file:line + rule name + a 1–2-line fix sketch. No code written, no commits made.

That is the full lifecycle: instantiate placeholders once, paste the body, get a contract-shaped Deliverable back. Every template in this library should round-trip the same way.

---

## Footer

For a fully-instantiated example with 6 templates for a Next.js + Medusa e-commerce project (locked-rule conformance, storefront page build from blueprint, 1M-context monorepo audit, subscriber + workflow authoring, performance regression hunt, accessibility + SEO pre-release gate), see `../the private lab's worked instance (not shipped)`.

For the sibling surface libraries — Cowork (dashboards, browser ops, scheduled tasks) and Chat (citation-backed research) — see `prompts/cowork-browser-operations.md` and `prompts/chat-research-missions.md`. The three together form the cross-surface playbook described in `knowledge-base/CLAUDE-SURFACE-ROUTING.md`.
