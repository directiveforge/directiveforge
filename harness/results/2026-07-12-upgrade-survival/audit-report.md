<!-- Copy of the artifact written inside the scratch substrate; operator paths tokenized (<KIT>, <SCRATCH>) on copy. -->
# AI Workflow Health Audit — Tempo Deck

**Date**: 2026-07-12
**Auditor**: Claude Code forensic pass (read-only), + one independent adversarial verification subagent
**Scope**: `<RUN_WORKDIR>/.../scratchpad/upgrade-survival/copy-a` (a Next.js 15.1 App Router hobby project, kit-generated at Starter tier, kit v0.17.0, generated 2026-07-03, with owner customizations added afterward)
**Write contract honored**: this file is the only write made during the audit.

---

## 1. Executive summary

| Lens | Grade | One-line reason |
|---|---|---|
| 1. Staleness | C | 5 files still assume "no `.git` yet" although the repo has 2 real commits; app-version claims (Next 15.1.6/React 18.3.1) verified accurate against `package.json`. |
| 2. Internal contradictions | C | Owner's `base.md` house-convention block contradicts the actual codebase and CLAUDE.md's own text. |
| 3. Dead references | D | Systemic: a flagship decision-skill's primary routing table points at a skill that was never installed and has no fallback; plus two owner-introduced dead paths (`docs/PRACTICE-METRICS.md`, `app/fixtures/`); plus 5 skill files use unresolvable bare-relative doc paths. |
| 4. Redundancy & context economics | B+ | CLAUDE.md stays inside its own ≤150-line gate; Claude Code ↔ Cursor twin files are deliberate, not accidental duplication; always-loaded tax is modest (~3k tokens, estimate below). |
| 5. Instruction-quality erosion | A- | Modern, direct instructions; no chain-of-thought scaffolding for reasoning models; no found over-constraint. |
| 6. Security & hygiene | A- | No secrets in tracked files; `.env*` correctly ignored/denied; MCP servers are OAuth or version-pinned with no literal credentials. World-fact currency of the two MCP servers/versions was not independently web-verified (see §8 Not examined). |
| 7. Process integrity | D+ | The install manifest — the exact artifact a future upgrade pass depends on to avoid clobbering owner work — is stale in precisely the way that would let it happen. |
| 8. Capability gaps | — | Informational only, see §6 below; not a defect axis. |

**The 3 sentences the owner must read:**

1. `.ai-kit-manifest.json` still says `"owner_customized": false` with pre-edit hashes for the 3 files you hand-edited (`CLAUDE.md`, `.claude/rules/base.md`, `.claude/commands/update-context.md`), and doesn't know your new `git-hygiene` skill exists at all — if an upgrade pass trusts this manifest as-is, your customizations are the thing most at risk of being silently overwritten.
2. Your own `base.md` addition tells agents that practice fixtures live in `app/fixtures/` and must "never" be inline in pages — but `app/fixtures/` doesn't exist and `SEED_SESSIONS` *is* inline in `app/page.tsx` today, so this rule will actively misdirect whoever (human or agent) next touches session data.
3. The kit's own `anti-sycophancy-meta` skill — the one thing installed specifically to stop sycophantic validation — silently breaks one of its four routing branches (finished-artifact review routes to a skill, `disconfirming-evidence-first`, that was never installed and has no documented fallback, unlike the parallel `council-3-voice` case which *is* handled gracefully).

---

## 2. Purpose & liveness table

Every artifact examined. Verdict legend: ALIVE / DEGRADED / SUPERSEDED-BY-X / EXPIRED / ZOMBIE / UNKNOWN.

| Artifact | Reconstructed purpose | Verdict | Key evidence |
|---|---|---|---|
| `CLAUDE.md` | Primary always-loaded agent context: constraints, architecture, conventions, session protocol. | DEGRADED | Owner-edited (git diff `dc92819..72761da`) but manifest doesn't know; line 53 assumes no git despite 2 commits existing. |
| `AGENTS.md` | Canonical stack/command reference, cross-tool convention. | ALIVE | All commands verified against `package.json`; no fact contradicts CLAUDE.md. |
| `DECISIONS.md` | Tier-1 architecture decision ledger. | ALIVE | All 5 dated entries (2026-07-03) verified true against current code/config. |
| `HANDOFF.md` | Ephemeral, agent-filled session-handoff scaffold ("delete after reading"). | DEGRADED | sha256 of file on disk == `template_sha256` in manifest — never templated even once; title still reads `{{PROJECT_NAME}}`. Mechanism is sound; instance never activated. |
| `PHASE9-REPORT.md` | One-time install/generation record (Phase 9 of the generator run). | ALIVE | Self-dated 2026-07-03, internally consistent, correctly frozen as a point-in-time snapshot; referenced by nothing (expected — it's a report, not live guidance). |
| `README.md` | Human-facing project intro. | ALIVE | Consistent with `package.json` and CLAUDE.md. |
| `.ai-kit-manifest.json` | Install manifest — lets a future upgrade distinguish kit-owned vs. owner-customized files. | **DEGRADED (high-impact)** | 3 of 4 owner-touched files show `owner_customized: false` + stale sha256; the 4th (new file) isn't tracked at all. See F1. |
| `.mcp.annotations.md` | Human-readable MCP posture companion to the two `mcp.json` files. | DEGRADED | Line 14 "Tempo Deck has no `.git` yet" — stale. Posture claims otherwise well-formed. |
| `.mcp.json` / `.cursor/mcp.json` | MCP server wiring for Claude Code / Cursor. | ALIVE | Identical servers/versions across both; no literal credentials; `context7` pinned. |
| `.claude/rules/base.md` | Core execution protocol + house conventions. | DEGRADED | Kit-generated baseline (lines 1-36) accurate; owner addition (lines 38-44) contradicts codebase — see F3. |
| `.claude/rules/quality-gates.md` / `.cursor/rules/quality-gates.mdc` | Blocking verification-gate table. | ALIVE | Matches `package.json` scripts exactly; twins are consistent. |
| `.claude/rules/decision-skills.md` / `.cursor/rules/decision-skills.mdc` | Router for the 5 installed decision skills. | ALIVE | Correctly documents `council-3-voice` and higher-tier skills as *not installed at Starter* — the router itself has no dead-reference defect (see F2 for where that knowledge fails to propagate). |
| `.claude/settings.json` | Claude Code permissions/env/hooks. | ALIVE | Deny list correctly blocks `.env` reads and destructive git; allow list matches the commands actually used elsewhere in the workflow. |
| `.claude/agents/{reviewer,simplifier,tester,verifier}.md` + `.cursor/agents/{reviewer,tester}.md` | Delegated review/test/verify subagents. | ALIVE | Tool scoping, constraints, and project-specific checklist items (BPM boundaries, `RESEND_API_KEY` guard) all verified accurate. |
| `.claude/commands/{deploy,discover-mcp,review-pr,security-review,tech-debt}.md` | Slash commands for deploy/MCP-discovery/review/security/debt workflows. | ALIVE | Content accurate to current stack; no dead paths found. |
| `.claude/commands/status.md` | Regenerates HANDOFF's machine section; drift-flags stale claims. | DEGRADED | Line 23: "this project has no `.git` yet... degrade to file-mtime" — stale (2 commits exist). Ironically this command's own job is to catch drift like this. |
| `.claude/commands/workflow-help.md` | Session-start orientation command. | DEGRADED | Line 17: "(once under git)" — same stale assumption. |
| `.claude/commands/update-context.md` | Re-syncs CLAUDE.md/AGENTS.md/DECISIONS.md after meaningful changes. | DEGRADED | Owner-added step 8 points at `docs/PRACTICE-METRICS.md`, which doesn't exist — see F4. |
| `.claude/skills/decision/{pre-mortem,steelman,confidence-calibration,reversibility-check,anti-sycophancy-meta}/SKILL.md` (+ `.cursor/` byte-identical twins) | KB-05 Starter-tier "5 BLOCKER" conversational decision skills. | DEGRADED | Technique content (Klein-Kahneman pre-mortem, Concession-Threshold Protocol, Brier calibration, Type-1/2 gating, anti-sycophancy framing) is well-sourced and internally coherent; routing logic references `disconfirming-evidence-first` and `inversion` as if installed — see F2. |
| `.claude/skills/git-hygiene/SKILL.md` | Owner-added: git staging/commit discipline for Claude Code. | DEGRADED | Content itself is sound and scoped; not mirrored to `.cursor/skills/` (breaks the kit's own cross-IDE-twin convention) and uses `confidence: high` instead of the numeric convention every other decision/agent-adjacent frontmatter in this repo uses — see F7. |
| `.cursor/rules/base.mdc` / `frontend.mdc` / `quality-gates.mdc` | Cursor rule twins (always-apply core + glob-scoped frontend + always-apply gates). | ALIVE | Content consistent with Claude Code twins; `frontend.mdc`'s `app/**/*.ts` sub-glob currently matches 0 files (cosmetic, rule still fires via its other 2 globs — see F8). |
| `.cursor/skills/debug/SKILL.md` | Structured bug-investigation procedure. | DEGRADED | Line 26: "(once under git)" — same stale assumption as F5. |
| `.cursor/skills/deployment/SKILL.md` | Vercel deploy/rollback procedure. | ALIVE | Matches `vercel.json` and `.env.example` exactly. |
| `app/`, `components/`, `lib/email.ts` (source) | The actual application. | ALIVE | Used as ground truth throughout this audit; all workflow-doc claims about these files were checked against them directly. |
| `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `vercel.json`, `.eslintrc.json`, `.env.example`, `.gitignore`, `.cursorignore`, `.cursorindexingignore` | Build/tooling config. | ALIVE | All claims made about these files elsewhere in the workflow (alias mapping, gate commands, ignored paths) verified true. |

---

## 3. Owner adjudication queue

1. **`app/fixtures/`** — `.claude/rules/base.md` instructs agents to keep practice-session fixtures there and never inline `SEED_SESSIONS` in pages, but the directory doesn't exist and `SEED_SESSIONS` is inline in `app/page.tsx` today. Is this a planned refactor you haven't done yet, or should the rule be corrected to describe reality?
2. **CSV export mapping** — same rule block says "never rename `PracticeSession` fields without updating the CSV export mapping," but no CSV-related code exists anywhere in the repo. Does this feature exist elsewhere, is it planned, or should the line be removed?
3. **`docs/PRACTICE-METRICS.md`** — referenced by `CLAUDE.md` and `.claude/commands/update-context.md` as an "owner-maintained metrics doc," but no `docs/` directory exists. Do you maintain this outside the repo, is it not yet created, or should the references be dropped?
4. **`git-hygiene` skill Cursor parity** — added only under `.claude/skills/`, with no `.cursor/skills/` twin, breaking the kit's stated cross-IDE mirroring pattern used everywhere else. Intentional (Cursor not used for git ops) or an oversight to fix?
5. **Manifest regeneration** — confirm you want `.ai-kit-manifest.json` re-hashed/re-flagged now (mechanical, low-risk) versus leaving it for the next full upgrade pass to reconcile.

---

## 4. Findings by severity

### 🚨 Actively harmful or wrong now

**F1 — Install manifest doesn't know about the owner's own customizations; a future upgrade pass driven by it could silently overwrite them.**
- File: `.ai-kit-manifest.json` (`files[]` entries for `CLAUDE.md`, `.claude/rules/base.md`, `.claude/commands/update-context.md`); missing entry for `.claude/skills/git-hygiene/SKILL.md`.
- Evidence: `git diff dc92819 72761da` shows these exact 3 files hand-edited and 1 new file added in the "owner customizations" commit. Current `sha256sum` of all 3 no longer matches the manifest's recorded `sha256`, yet each entry still reads `"owner_customized": false`:
  ```
  CLAUDE.md               | manifest sha256 be123ae5... | on-disk sha256 17b8c550... | owner_customized: false
  .claude/rules/base.md   | manifest sha256 9df150bf... | on-disk sha256 57beb341... | owner_customized: false
  .claude/commands/update-context.md | manifest sha256 013bcb14... | on-disk sha256 6fabb030... | owner_customized: false
  ```
  `.claude/skills/git-hygiene/SKILL.md` does not appear anywhere in the manifest's 44-entry `files` array at all.
- Why it matters: this manifest is the explicit hand-off artifact to `generator/UPGRADE_MODE.md` for future upgrades (per the manifest's own stated role and the kit's upgrade doctrine). Its whole job is to let an upgrade tell "kit template, safe to regenerate" apart from "owner touched this, preserve/merge/ask." Right now it would answer that question wrong for 4 files — exactly the ones the owner actually cares about keeping.
- Fix-class: paragraph — rehash every manifest-tracked file, flip `owner_customized` for any mismatch, and add untracked new files under `.claude/`/`.cursor/` with a `disposition: "owner-added"` entry.

**F2 — `anti-sycophancy-meta`'s primary routing table (and 4 sibling decision skills) points at a skill, `disconfirming-evidence-first`, that was never installed and has no fallback — unlike the parallel `council-3-voice` case, which is handled correctly everywhere.**
- Files: `.claude/skills/decision/anti-sycophancy-meta/SKILL.md:43` (primary 4-branch routing table: "Finished artifact... → `disconfirming-evidence-first`"); also `.claude/skills/decision/{pre-mortem:82, steelman:26,88,104-105, confidence-calibration:84,96, reversibility-check:21,33,93,102}/SKILL.md`; identical text in all 5 `.cursor/skills/decision/*` twins (10 files total). `reversibility-check/SKILL.md:33` additionally routes to `inversion`, also not installed.
- Evidence it doesn't exist: `find . -iname "*disconfirming*"` and `find . -iname "*inversion*"` both return nothing anywhere under `.claude/skills/` or `.cursor/skills/`. Only 5 decision skills are installed (pre-mortem, steelman, confidence-calibration, reversibility-check, anti-sycophancy-meta).
- Evidence this is a real asymmetry, not just tier-gating working as intended: `reversibility-check/SKILL.md:32` handles the parallel case for `council-3-voice` correctly — *"If `council-3-voice` is not installed (Starter/Intermediate tiers), run `steelman` + `pre-mortem` sequentially instead."* No equivalent clause exists anywhere for `disconfirming-evidence-first` or `inversion`. `.claude/rules/decision-skills.md:40` (the router) *does* correctly know these are "Intermediate tier" additions — but that knowledge lives only in the router, not in the skill files' own internal routing logic, which is what actually executes when a user says "is this email good?"
- Why it matters: this is the flagship anti-sycophancy mechanism (`severity: BLOCKER`, `confidence: 0.95`), and one of its four documented artifact-type branches (finished artifacts — emails, code, copy, design) is a dead end at Starter tier, with the skill's own text giving no indication of what to do instead.
- Fix-class: restructure — either (a) install the Intermediate-tier `disconfirming-evidence-first` + `inversion` skills (this doubles as an upgrade-candidate, see §6), or (b) add the same graceful-fallback clause the skills already use for `council-3-voice` to every place `disconfirming-evidence-first`/`inversion` is named as a routing target.

### ⚠ Degrades agent quality

**F3 — Owner's `base.md` house-convention block contradicts the actual codebase and CLAUDE.md's own text.**
- File: `.claude/rules/base.md:40-42`.
- Evidence: line 40 — *"Practice-session fixtures live in `app/fixtures/` — extend `SEED_SESSIONS` there, never inline in pages."* `app/fixtures/` does not exist (`ls app/` → only `globals.css`, `layout.tsx`, `page.tsx`); `SEED_SESSIONS` is declared inline at `app/page.tsx:3`. `CLAUDE.md:7` itself says *"The home page renders a seeded `SEED_SESSIONS` array (`app/page.tsx`)"* — directly contradicting the rule two files away. Line 36 of the same file (kit-generated, 4 lines above the owner's addition) says *"NEVER reference paths that don't exist"* — the owner's own addition violates the rule immediately preceding it. Line 42 — *"Never rename `PracticeSession` fields without updating the CSV export mapping"* — zero CSV-related code exists anywhere in the repo (`grep -rn "CSV" **/*.ts **/*.tsx` → no hits).
- Fix-class: one-liner — either build `app/fixtures/` + the CSV mapping to match the rule, or correct the rule to describe the current inline-in-`page.tsx` reality and drop the CSV line until it exists.

**F4 — `docs/PRACTICE-METRICS.md` referenced twice; `docs/` doesn't exist.**
- Files: `CLAUDE.md:101` ("see `docs/PRACTICE-METRICS.md`"), `.claude/commands/update-context.md:29` (step 8: "Update `docs/PRACTICE-METRICS.md` if session-tracking fields changed").
- Evidence: `ls docs` → "No such file or directory"; no file named `PRACTICE-METRICS.md` exists anywhere under the project (`find . -iname "*PRACTICE-METRICS*"` → empty).
- Fix-class: one-liner — create the stub doc, or remove both references until it exists.

**F5 — Five files still assume "no `.git` yet," but the repo has 2 real commits.**
- Files: `CLAUDE.md:53` ("...once this project is under git"), `.claude/commands/status.md:23` ("this project has no `.git` yet. Until it is initialized, degrade to file-mtime + ledger facts"), `.claude/commands/workflow-help.md:17` ("...once under git"), `.cursor/skills/debug/SKILL.md:26` ("...once under git"), `.mcp.annotations.md:14` ("Tempo Deck has no `.git` yet").
- Evidence: `git log --oneline --all` → `72761da owner customizations`, `dc92819 install state as generated (kit 0.17.0)`.
- Why it matters: `status.md`'s entire job is to catch exactly this kind of drift (its own spec: *"Drift check — for each checkable claim... a commit touching it exists?"*) — it is itself stale about the precondition it depends on.
- Fix-class: one-liner per file — remove the git-absence caveat now that git is initialized.

**F6 — Decision-skill "mandatory reads" use bare relative paths that don't resolve inside the project; the router rule uses correct absolute paths for the identical documents.**
- Files: all 5 `.claude/skills/decision/*/SKILL.md` + 5 `.cursor/skills/decision/*/SKILL.md` (10 files), e.g. `.claude/skills/decision/anti-sycophancy-meta/SKILL.md:24-25` — *"`knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md` §4"* and *"`research/2026-05-26-decision-techniques.md` §2 row 12."*
- Evidence: neither `knowledge-base/` nor `research/` exists anywhere under the project root. Contrast `.claude/rules/decision-skills.md:3` — *"Doctrine: <KIT>/knowledge-base/KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md"* — same document, correct absolute path.
- Fix-class: one-liner (mechanical find-replace to the absolute kit path) across 10 files.

### 🟡 Debt, will bite later

**F7 — `git-hygiene` skill (owner-added) has no Cursor twin and uses a non-numeric `confidence` field.**
- File: `.claude/skills/git-hygiene/SKILL.md:5` — `confidence: high`, versus all 10 kit-installed decision-skill files using numeric values `0.85`–`0.95`. No `.cursor/skills/git-hygiene/` counterpart exists, breaking the cross-IDE-twin pattern every other skill/agent in this repo follows (confirmed via `git show 72761da --stat`: added only under `.claude/`).
- Fix-class: one-liner (numeric confidence) + restructure decision needed on Cursor mirroring (owner adjudication item #4).

**F8 — `.cursor/rules/frontend.mdc`'s `app/**/*.ts` glob currently matches zero files.**
- File: `.cursor/rules/frontend.mdc:3` — `globs: ["app/**/*.tsx", "app/**/*.ts", "components/**/*.tsx", "!**/*.test.*"]`.
- Evidence: `find app -name "*.ts" -not -name "*.tsx"` → no matches (only `.tsx` and `.css` exist under `app/`). The rule as a whole still fires correctly via the other two globs (2 `.tsx` files under `app/`, 3 under `components/`), so this is not a "rule that never fires" — just one forward-looking sub-pattern with nothing to match yet.
- Fix-class: none required; informational.

### 🟢 Cosmetic

**F9 — `HANDOFF.md` was never templated; it is byte-identical to the raw kit template.**
- File: `HANDOFF.md:1` — literal `# Session Handoff — {{PROJECT_NAME}}`, plus 12 more unsubstituted `{{...}}` tokens.
- Evidence: `sha256sum HANDOFF.md` = `684c9a1e0ed6b55c5f05edbe5421a88e1028ecc3efd0ca6df4816fb7181ccb47`, which exactly matches `.ai-kit-manifest.json`'s `template_sha256` for this entry — the file was never touched post-copy. Every other kit-generated file (`CLAUDE.md`, `AGENTS.md`, `DECISIONS.md`) correctly opens with "Tempo Deck," so the project name was known and used elsewhere at generation time.
- Fix-class: none required — this file is explicitly an ephemeral scaffold per its own docstring ("Delete after reading"); noting only because the title placeholder specifically could have been filled trivially like the others were.

---

## 5. Top-10 fixes ranked by impact ÷ effort

| # | Fix | Impact | Effort | Files touched |
|---|---|---|---|---|
| 1 | Re-hash and re-flag `.ai-kit-manifest.json` (F1) | High — protects every future owner edit, not just these 4 files | Low — mechanical rehash + flag pass | 1 |
| 2 | Correct or build out the `app/fixtures/`/CSV claims in `base.md` (F3) | Medium — stops a wrong-directory detour on the next session-data change | Low | 1 |
| 3 | Resolve `docs/PRACTICE-METRICS.md` — create stub or drop refs (F4) | Medium | Low | 2 |
| 4 | Add fallback clauses (or install the skills) for `disconfirming-evidence-first` / `inversion` (F2) | High — restores a broken branch of the flagship BLOCKER skill | Medium-High | 10 |
| 5 | Drop the stale "no `.git` yet" caveats (F5) | Low-Medium — self-corrects once an agent runs `git log`, but `status.md`'s whole job is catching drift like this | Low | 5 |
| 6 | Fix bare relative paths to absolute kit paths in decision skills (F6) | Low-Medium | Low-Medium | 10 |
| 7 | Mirror `git-hygiene` to Cursor + fix `confidence` field type (F7) | Low | Low | 1-2 |
| 8 | (Optional) Fill `HANDOFF.md`'s `{{PROJECT_NAME}}` or leave as designed scaffold (F9) | Cosmetic | Trivial | 1 |
| 9 | (Optional) Trim/complete the `app/**/*.ts` glob in `frontend.mdc` (F8) | Cosmetic | Trivial | 1 |

---

## 6. Upgrade-candidates table

Based on the kit's documented current structure (already in this session's context via the AI-repo's own `CLAUDE.md`; not independently re-verified file-by-file against the live kit repo, per this audit's self-contained scope — see §8). Strictly separate from defects above.

| Candidate | Where it would live | Expected benefit |
|---|---|---|
| Graduate KB-05 decision pack from Starter (5 BLOCKER skills) to Intermediate (+3 HIGH skills: `inversion`, `second-order-thinking`, `disconfirming-evidence-first`, + LLM fallback) | `.claude/skills/decision/`, `.cursor/skills/decision/`, router rules | Directly fixes F2 as a side effect — the two skills the existing routing logic already assumes exist would actually exist. |
| KB-06 Managed Agents / scheduled-work routing | N/A currently | Low priority for a solo hobby project with no hosted/scheduled agent usage; note only, no action implied. |
| Cross-surface routing behavior spec | N/A currently | Low priority — single-repo, Code-only workflow; would matter if the owner starts using Chat/Cowork for this project. |
| Vigilance cadence (quarterly-review reminder) | new lightweight rule or cron | This audit itself is the kind of check vigilance cadence would schedule automatically going forward. |

Note: KB-08 (design-elevation pack) was already evaluated and deliberately declined at generation time despite technically qualifying (React + Tailwind tokens) — logged in `PHASE9-REPORT.md`'s "Gaps & Deviations" §1 as an intentional Starter-tier call, not an oversight. Not re-flagged here.

---

## 7. Coverage ledger

**Always-loaded token estimate** (assumption stated explicitly: Claude Code has no per-file conditional-loading mechanism for `.claude/rules/*.md` the way Cursor's `.mdc` `alwaysApply` flag does, so all 3 rule files are treated as always-loaded alongside `CLAUDE.md`):

- Claude Code: `CLAUDE.md` (6,245 B) + `base.md` (2,364 B) + `quality-gates.md` (1,171 B) + `decision-skills.md` (2,465 B) = **12,245 bytes ≈ ~3,060 tokens** per session, before tool definitions or system prompt.
- Cursor (`alwaysApply: true` only): `base.mdc` (1,526 B) + `quality-gates.mdc` (971 B) = **2,497 bytes ≈ ~625 tokens**. `frontend.mdc` and `decision-skills.mdc` are conditional (`alwaysApply: false`), not counted.

**Disposition list** (● = READ-FULL, ◐ = SKIMMED, ✓= = verified byte-identical to a READ-FULL twin without independent re-read, — = SKIPPED):

| File | Disposition | Reason |
|---|---|---|
| `.ai-kit-manifest.json` | ● | Full read + hash-verified against live files |
| `CLAUDE.md` | ● | Load-bearing |
| `AGENTS.md` | ● | Load-bearing |
| `DECISIONS.md` | ● | Load-bearing |
| `HANDOFF.md` | ● | Load-bearing |
| `PHASE9-REPORT.md` | ● | Historical record, read for Phase 1b reconstruction |
| `README.md` | ● | — |
| `.mcp.annotations.md` | ● | — |
| `.mcp.json` | ● | — |
| `.cursor/mcp.json` | ● | — |
| `.env.example` | ● | — |
| `.eslintrc.json` | ● | — |
| `.gitignore` | ● | — |
| `.cursorignore` | ● | — |
| `.cursorindexingignore` | ● | — |
| `package.json` | ● | — |
| `tsconfig.json` | ● | — |
| `tailwind.config.ts` | ● | — |
| `next.config.ts` | ● | — |
| `vercel.json` | ● | — |
| `package-lock.json` | — | Mechanical lockfile, no guidance content |
| `postcss.config.mjs` | — | Standard PostCSS boilerplate, 157 B, no workflow relevance |
| `next-env.d.ts` | — | Auto-generated, gitignored regeneration target |
| `.claude/agents/{reviewer,simplifier,tester,verifier}.md` | ● | All 4 read in full |
| `.claude/commands/{deploy,discover-mcp,review-pr,security-review,status,tech-debt,update-context,workflow-help}.md` | ● | All 8 read in full |
| `.claude/rules/{base,decision-skills,quality-gates}.md` | ● | All 3 read in full |
| `.claude/settings.json` | ● | — |
| `.claude/skills/decision/anti-sycophancy-meta/SKILL.md` | ● | Full read (exemplar for Phase 1b + F2 discovery) |
| `.claude/skills/decision/{pre-mortem,steelman,confidence-calibration,reversibility-check}/SKILL.md` | ◐ | Frontmatter read in full; body covered via targeted grep with wide context (routing/reference sections); not read start-to-finish |
| `.claude/skills/git-hygiene/SKILL.md` | ● | Full content obtained via `git diff` (new file) |
| `.cursor/agents/{reviewer,tester}.md` | ● | — |
| `.cursor/rules/{base,frontend,quality-gates,decision-skills}.mdc` | ● | — |
| `.cursor/skills/debug/SKILL.md` | ● | — |
| `.cursor/skills/deployment/SKILL.md` | ● | — |
| `.cursor/skills/decision/*/SKILL.md` (5 files) | ✓= | `diff`-confirmed byte-identical to their `.claude/` twins; not independently re-read |
| `app/globals.css`, `app/layout.tsx`, `app/page.tsx` | ● | — |
| `components/{beat-counter,session-list,tempo-badge}.tsx` | ● | — |
| `lib/email.ts` | ● | — |
| `.git` history/branches/remotes | ● | `git log --oneline --all`, `git diff` between both commits, `git branch -a`, `git remote -v`, `git status` all inspected |

Total files on disk (excluding `.git` internals): 65. READ-FULL: 53. SKIMMED: 4. Verified-identical-without-reread: 5. SKIPPED: 3 (`package-lock.json`, `postcss.config.mjs`, `next-env.d.ts` — all mechanical/generated, no guidance content).

---

## 8. Not examined

- **The parent directiveforge repo (`<KIT>/`) itself.** This audit's task scope explicitly framed the target as self-contained. Every cross-reference this project makes to kit paths (e.g. `<KIT>/knowledge-base/KB-05-...`, `.../MCP-SERVER-REGISTRY.md`, `.../generator/VALIDATION_CHECKLIST.md`) was left unverified for existence — treated as reference-only, not confirmed. If a follow-up pass has budget, mechanically checking these ~10 absolute cross-refs for existence would close this gap cheaply.
- **World-fact currency of the two configured MCP servers** (`github` remote HTTP endpoint `https://api.githubcopilot.com/mcp/`, `@upstash/context7-mcp@3.2.2`) — not independently web-verified against current reality in this pass; flagged as a staleness-lens gap, not a confirmed finding.
- **Manifest sha256 values for the other 40 (non-owner-touched) tracked files** — not individually re-hashed; only the 4 files known from `git diff` to have changed were checked. Reasonable to assume the remaining 40 still match since no other commits exist, but not mechanically re-verified file-by-file.
- **`harness/`, `feedback/`, `case-studies/`, and any FIXTURE-CARD file** — explicitly out of scope per the audit dispatch's hard prohibitions; not read.

---

## 9. Verification delta

An independent adversarial subagent re-derived all 8 highest-confidence findings from fresh reads (not from this report's notes), explicitly hunting for a fallback clause, caveat, or contradicting file that would kill or downgrade each one before confirming.

**Result: all 8 SURVIVED with no downgrades.** One finding came back *stronger* than initially framed: for F9 (HANDOFF.md), the verifier additionally confirmed via `sha256sum` that the on-disk file is bit-for-bit identical to the manifest's own `template_sha256`, proving the file was never touched post-copy rather than merely "under-filled." No findings were dropped. F1 (manifest staleness) was identified independently by the primary audit pass after the verification round had already been scoped around F2–F9; it was cross-checked directly against `git diff` + `shasum` rather than run through the adversarial subagent, but the evidence (exact hash mismatches + absent manifest entry) is mechanical and not open to reasonable dispute.
