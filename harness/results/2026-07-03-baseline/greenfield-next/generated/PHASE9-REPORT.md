# Workflow Generation Report

**Project**: Tempo Deck — a tiny personal metronome-practice tracker (Next.js 15.1 App Router).
**Stack**: Next.js 15.1.6 (App Router) + React 18.3.1 + TypeScript 5 (strict) + Tailwind CSS 3.4.17; no DB, no auth, no tests; npm; deploys to Vercel (hobby).
**Maturity tier (Phase 1.6)**: **Starter** — solo developer, pre-MVP side project, no production users, no `.git`, ~7 source files; operator answered "I just want the basics" and "no" to every opt-in. No stakes override (no money-gates, no locked strategic decisions, no compliance surface).
**Preset used**: **nextjs** (base App Router variant). NOT content-first (no headless CMS client in deps). Content-first fire condition did not fire.
**Owner brief (Phase 0.5)**: N-A — gate did not fire. No dormancy signal (no git history to be stale; the target has no `.git`, which is the expected fixture condition, not a revival trigger), no revival/brief declaration, no HANDOFF/README/git discontinuity. Operator profile confirms an active side project.

---

## Files Created (44 kit artifacts + this report)

### Context & ledgers (root)
- `CLAUDE.md` — 97 lines (≤150 gate PASS; all six required sections; critical constraints at top)
- `AGENTS.md` — 74 lines (canonical stack + command table; no fact duplicated with CLAUDE.md)
- `DECISIONS.md` — 33 lines (Tier 1 Starter format; 5 seeded decisions)
- `HANDOFF.md` — template only, not filled (verbatim kit template — a session-state slot)
- `.mcp.annotations.md` — MCP postures + Phase 2.5 discovery results

### Claude Code (`.claude/`)
- `settings.json` — permissions (allow: git reads/commits, build, lint, dev, `npx tsc`; deny: `rm -rf`, force-push, hard-reset, `.env` reads); env `MAX_THINKING_TOKENS=10000` + `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`; `CLAUDE_CODE_SUBAGENT_MODEL` omitted (inherit); `hooks: {}` (no formatter detected)
- `rules/base.md`, `rules/quality-gates.md`, `rules/decision-skills.md` (router, 40 lines)
- `agents/simplifier.md`, `agents/reviewer.md`, `agents/verifier.md`, `agents/tester.md` (mandatory trio + tester)
- `commands/`: review-pr, deploy, update-context, discover-mcp, security-review, tech-debt, workflow-help, status (8)
- `skills/decision/`: pre-mortem, steelman, confidence-calibration, reversibility-check, anti-sycophancy-meta (5 BLOCKER skills, byte-identical to kit source)

### Cursor (`.cursor/`)
- `mcp.json`
- `rules/base.mdc`, `rules/frontend.mdc`, `rules/quality-gates.mdc`, `rules/decision-skills.mdc`
- `agents/reviewer.md`, `agents/tester.md` (cross-IDE twins; Markdown-only, tools in body)
- `skills/debug/SKILL.md`, `skills/deployment/SKILL.md`
- `skills/decision/`: 5 mirrors of the BLOCKER skills (byte-identical to `.claude/` copies)

### Root ignores / MCP
- `.mcp.json`, `.cursorignore`, `.cursorindexingignore`

### Manifest
- `.ai-kit-manifest.json` — 44 files tracked (Phase 8.5)

## Files Migrated (from existing)
- `.gitignore` — **merged**: appended `.cursor/rules/personal.mdc` (developer-specific, gitignored per Phase 3.2). All prior entries preserved.
- `.env.example` — **kept unchanged**: already well-formed (env var names + purpose comments, no values). Phase 3.1 says "generate if absent"; it was present and correct, so untouched. Not recorded in the manifest (this run did not create or modify it).
- No AI-workflow files pre-existed → **Phase 4 (existing-file handling) skipped entirely** per Phase 0.2.

## Files NOT generated (with reason)
- `.cursor/rules/api.mdc`, `database.mdc`, `testing.mdc` — no API layer, no database, no test runner exist.
- `.cursor/skills/migration/SKILL.md`, `refactor/SKILL.md` — no DB migrations; project is greenfield (refactor skill gated to "existing codebase, not greenfield").
- `.cursor/agents/seo-auditor.md`, `i18n-validator.md`, `security-auditor.md` + `.claude/agents/security-auditor.md` — no public SEO surface beyond one static page, no i18n, no payments/auth/sensitive-data handling (the `RESEND_API_KEY` stub is dormant; the security-auditor gate requires payments/auth/sensitive data).
- KB-04 rules/skills/architect-prompt, research skills, surface-routing (Phase 4.5), vigilance (Phase 7), mission-dispatch (Phase 8) — all Intermediate+/Advanced-only; skipped for Starter tier.

---

## MCP Servers Configured
| Server | Source | Posture | Credentials |
|---|---|---|---|
| `github` (remote HTTP) | kit baseline | RW via OAuth browser consent | none (OAuth) |
| `context7@3.2.2` (npm, pinned) | registry (Production) | RO — public docs only | none |

Both are the kit's zero-credential baseline servers. `context7` is "always" for Next.js per the preset (App Router API changed heavily v13–15). `github` is harmless until the repo is pushed to GitHub.

## MCP Servers Found But Not Adopted (documented in `.mcp.annotations.md`)
- **Vercel MCP** (`https://mcp.vercel.com`, registry-vetted, official, RO OAuth, no creds) — READY to enable; not wired because the operator declined extra MCP servers on a Starter hobby project. Copy-ready block provided.
- **`resend-mcp@2.9.0`** (npm) — quality-gate result: Gate 1 EXISTS ✅ (`github.com/resend/resend-mcp`, official Resend org, MIT), Gate 2 MAINTAINED ✅ (published 2026-06-23, 23 versions, not deprecated), Gate 3 TRUSTED ✅ (official — maintainers are the Resend team incl. co-founder zenorocha), Gate 4 SECURE ⚠ not fully verified (no `SNYK_TOKEN` — see Validation), **Gate 5 USEFUL ❌ FAIL/deferred** — Resend is a dormant stub here (`lib/email.ts` no-ops without a key; no key configured; no email actually sent). Per the Phase 2.5 decision matrix, an unused service does not justify a write-capable email MCP. Copy-ready block + re-enable instructions provided.

npm searches actually run (Phase 2.5 Step 3): `resend mcp`, `mcp-server-resend`, `resend-mcp`, `@resend/mcp` + `npm info resend-mcp`.

## Architecture Decisions Recorded (DECISIONS.md, Tier 1)
1. No database/persistence yet — home page renders seeded `SEED_SESSIONS`.
2. `@/*` alias maps to project root, not `src/`.
3. Named exports for components; route entry files also `export default` (Next.js requirement).
4. `lib/email.ts` ships as a dormant Resend stub (no-ops without `RESEND_API_KEY`).
5. Deploy target is Vercel hobby (`vercel.json`, region `iad1`).

## Install Manifest (Phase 8.5)
- Path: `.ai-kit-manifest.json` — **44 files** tracked; `kit_version` = **0.17.0** (from CHANGELOG.md newest heading); `generated_date` = 2026-07-03T10:50:18Z.
- `python3 -m json.tool` → **PASS** (valid JSON).
- Never lists itself ✅; every listed path exists on disk ✅; only on-disk-but-unlisted file is the manifest itself ✅ (zero escapees).
- 3 hashes spot-checked against `shasum -a 256` → all match.
- `ide_scope`: `["claude-code","cursor"]`; `presets`: `["nextjs"]`; `packs`: `["kb-05-decision-starter"]`.

## Validation Results (Phase 5 — VALIDATION_CHECKLIST executed)
- **§1 Token budget**: PASS — CLAUDE.md 97 lines (≤150); all six sections present; `base.mdc` ~28 content lines (≤30); router rules well under the 100-line ceiling.
- **§2 No redundancy**: PASS (with note) — no fact table duplicated; versions ("Next.js 15.1", "React 18.3") consistent across all files. Minor note: `npm run lint` + `npx tsc --noEmit` appear in both CLAUDE.md and AGENTS.md, but by design — CLAUDE.md's command section is quirks-only + Definition of Done; the canonical command table lives only in AGENTS.md.
- **§3 Paths exist**: PASS — every cited path verified (`app/`, `components/`, `lib/`, `tailwind.config.ts`); confirmed absent paths (`src/`, `app/api/`, `middleware.ts`) are only ever named as "does not exist"; frontend glob `app/**/*.tsx` + `components/**/*.tsx` match real files.
- **§4 Commands valid**: PASS — `npm run dev/build/lint/start` are real scripts; `npx tsc --noEmit` and `npx vercel` are valid direct binary calls; npm prefix consistent (no yarn/pnpm/bun mixing).
- **§5 No secrets**: PASS — secret-pattern scan returns clean; MCP configs use no literal credentials; `.env` never read (only `.env.example`).
- **§6 Conventions match codebase**: PASS — export style, kebab-case/PascalCase naming, `@/`→root alias all verified against actual source.
- **§7 MCP security annotations**: PASS — both active servers have posture entries; both MCP configs + settings.json parse as strict JSON; `context7` pinned `@3.2.2`; `github` remote HTTP version-managed upstream.
- **§8 Skills**: PASS — decision skills carry 5/5 frontmatter fields; debug + deployment skills have `## Gotchas` (≥2) and `## When NOT to Use`.
- **§9 Agents**: PASS — every `.claude/` agent has `tools:`, `## Constraints` with NEVER/ALWAYS, one-sentence role, defined output; Bash-holding agents (verifier, tester) scope their command families in-body (no unqualified Bash grant).
- **§10 File count**: PASS — AGENTS.md, CLAUDE.md, base.mdc, `.mcp.json`, `.cursor/mcp.json`, DECISIONS.md, `.cursorignore`, `.cursorindexingignore` all present; ≥3 commands (8 present incl. deploy since deployable).
- **§11 Execution infrastructure**: PASS — 8 slash commands; settings.json permissions + `hooks:{}` (no formatter, with report note); mandatory trio (simplifier + reviewer + verifier) present; Plan mode in CLAUDE.md session protocol; feedback loop chain in Definition of Done.
- **§12 Decision skills (KB-05)**: PASS — 5 BLOCKER skills installed in `.claude/skills/decision/` + `.cursor/skills/decision/` mirrors; router rule `.claude/rules/decision-skills.md` present with phrase-mapping table; no council (correct for Starter).
- **§13 KB-04**: N-A (Starter).
- **§14 Surface routing**: N-A (Starter — Phase 4.5 skipped).
- **§15 Vigilance / §16 Mission-dispatch**: N-A (Starter — Advanced-only).
- **§17 Cross-artifact consistency**: PASS — versions/commands agree across docs; generated→generated references resolve; manifest integrity verified (parses, all paths exist, spot-checks match); doc-derived "unit tests for English" ran (see below).
- **Snyk scan (Gate 4 / §7)**: **DEGRADED — no full verdict.** `uvx snyk-agent-scan@latest` ran (v0.5.12) but requires a `SNYK_TOKEN` (not available in this environment) for any verdict; it printed the token-required message and exited without scanning. Per the kit's documented degradation caveat, this is recorded honestly. The two configured servers are independently low-risk by inspection (both kit-vetted; `context7` RO + pinned, `github` official OAuth).

### "Unit tests for English" (doc-derived falsifiable checks — all PASS)
- CLAUDE.md claim `@/*`→root → verified `tsconfig.json` `paths` = `{"@/*":["./*"]}`.
- CLAUDE.md claim no `src/`/`app/api/`/`middleware.ts` → verified all three absent.
- CLAUDE.md/AGENTS.md claim Next 15.1.6 / React 18.3.1 → verified in `package.json`.
- CLAUDE.md claim `lib/email.ts` guards on `RESEND_API_KEY` → verified `if (!apiKey)` at line 9.
- CLAUDE.md claim `SEED_SESSIONS` in `app/page.tsx` → verified present.

**Note on live gates**: the target has no `node_modules` (fixture), so `npx tsc --noEmit` / `npm run lint` / `npm run build` could not be executed live. Their wiring was verified statically (scripts exist, tsconfig strict+noEmit, source coherent). A real operator runs `npm install` first.

---

## Cost Optimization Tips
- Use the `opusplan` alias for 40-60% cost reduction on planning (Opus plans, Sonnet implements).
- Monitor token spend with `ccusage` (npx, zero-install).
- Use Plan mode for complex tasks (~50% token reduction) — already referenced in CLAUDE.md session protocol.
- `MAX_THINKING_TOKENS=10000` + `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50` are pre-set in `.claude/settings.json` for this project's routine work.

## Post-Setup Recommendations
- Initialize git (`git init`) — several workflow assets (`/status`, `/workflow-help`, session protocol) assume a git history and currently degrade gracefully to file-mtime facts.
- Create 5-10 evaluation tasks (real features/bugs) to measure workflow quality.
- The single highest-value structural add when the tool grows: a test runner (Vitest + RTL) — the `tester` agent is pre-wired to establish one on approval and update the gates.
- Run `/discover-mcp` when you add a dependency with an external service; the two vetted candidates (Vercel RO, Resend) are already documented in `.mcp.annotations.md`.
- Consider Cursor Automations (beta) for auto-triggering rules on file patterns.

## Decision Skills Installed (KB-05 Starter set — 5 BLOCKER)
| Skill | Severity | Surface | Note |
|---|---|---|---|
| anti-sycophancy-meta | 🚨 BLOCKER | All | **Auto-fires FIRST** on "is my X good / should I do X" before any evaluation; routes downstream |
| pre-mortem | 🚨 BLOCKER | Chat-or-Code | Klein-Kahneman failure reverse-engineering |
| steelman | 🚨 BLOCKER | Chat-or-Code | Charitable restatement + strongest counter |
| confidence-calibration | 🚨 BLOCKER | Chat-or-Code | Forces numeric probability |
| reversibility-check | 🚨 BLOCKER | Chat-or-Code | Type-1/Type-2 gate |

Council (`council-3-voice`, 15× token cost) NOT installed — correct for Starter (Advanced + plan-tier ≥ Max only). Router: `.claude/rules/decision-skills.md` + `.cursor/rules/decision-skills.mdc`. LLM fallback intentionally disabled at Starter (phrase table only).

## Surface Routing Integration (Intermediate+ only)
N-A — Starter tier. Phase 4.5 skipped.

## Vigilance Discipline (Advanced only)
N/A (Starter tier).

## Mission-Dispatch Pattern (Advanced only)
N/A (Starter tier).

## New Environment Variables Required
None. The two configured MCP servers need no credentials (github = OAuth, context7 = none). `RESEND_API_KEY` and `NEXT_PUBLIC_APP_NAME` are pre-existing app env vars (documented in `.env.example`), not new MCP requirements.

---

## Gaps & Deviations Logged

1. **KB-08 design pack — literal gate met, deliberately NOT installed (deviation, logged).** The Phase 1.5 design-pack gate reads "component framework (React) AND a token/theme file (Tailwind config)" — both are literally present (`tailwind.config.ts` has brand tokens). By the letter of that condition the pack would fire. It was **not** installed, for three converging reasons: (a) KB-08 is explicitly an OPTIONAL pack "gated exactly like KB-03/KB-07," and its doctrine (adversarial elevation vs named best-in-world references, verify-by-measurement, production-build Lighthouse/axe gates) is Advanced-grade discipline aimed at projects with a real design mandate; (b) the operator profile is unambiguous — "I just want the basics" (an explicit Starter signal) and the standing rule "any additional optional/opt-in offer → no"; (c) the project reality is a tiny pre-MVP personal tool with a seeded demo list, no design-elevation mandate, and no production users. Installing a 4-skill design-elevation chain + spine doc on it would contradict every operator signal. This is the one genuinely ambiguous call in the run; it is resolved in favor of governing operator intent and logged here for auditability. A real operator wanting design elevation later can install the pack by re-running Phase 3.1's KB-08 rows.

2. **Snyk Gate-4 verdict unavailable (environment limitation, documented).** `snyk-agent-scan` requires `SNYK_TOKEN`, absent here; it degraded to the token-required message (documented kit behavior). Both configured servers are kit-vetted and low-risk by inspection. Resend's Gate 4 likewise deferred (it wasn't adopted anyway — rejected at Gate 5).

3. **Live build/lint/typecheck not executed (fixture has no `node_modules`).** Gate wiring verified statically; a real install runs `npm install` first. Not a defect — expected fixture condition.

4. **No `.git` in target (expected).** Treated as the documented fixture condition, not a Phase 0.5 dormancy/revival trigger. Workflow assets that assume git degrade gracefully; recommendation to `git init` logged above.

5. **Minor §2 command overlap (acceptable by design).** `npm run lint` / `npx tsc --noEmit` appear in both CLAUDE.md and AGENTS.md — but the canonical command *table* lives only in AGENTS.md; CLAUDE.md's mentions are the typecheck quirk-note + Definition of Done, which the checklist permits. Not a duplication defect.

6. **Operator questions — all answered from the profile block; no defaults needed.** IDE scope = both Cursor + Claude Code; maturity = basics/Starter; hosting = Vercel hobby; all opt-ins = no. No question fell through to a documented default.

---

## Sign-off
```
Project: Tempo Deck
Generator run: 2026-07-03
Kit version: 0.17.0
Maturity tier: Starter
Preset: nextjs
IDE scope: Claude Code + Cursor
Checklist passed: yes (§13–16 N-A by tier; Snyk Gate-4 degraded — no token)
Items failed: none
Files generated: 44 (+ manifest)
Validator: Opus 4.8 generator-runner subagent (L2 greenfield-next)
```
