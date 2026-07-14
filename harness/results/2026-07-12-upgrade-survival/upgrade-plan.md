<!-- Copy of the artifact written inside the scratch substrate; operator paths tokenized (<KIT>, <SCRATCH>) on copy. -->
# Upgrade Plan — Tempo Deck

**Mode**: DRY-RUN (per `generator/UPGRADE_MODE.md`). This is the ONLY write this pass makes. No file was modified, no manifest touched, no branch created. Apply mode runs only after explicit operator approval, on a branch.

**Installed kit version**: 0.17.0 (manifest `kit_version`, `generated_date` 2026-07-03T10:50:18Z)
**Current kit version**: 0.20.0 (CHANGELOG.md head), plus 8 post-launch commits through 2026-07-12 (unversioned errata — branding rename "AI Workflow Kit" → "DirectiveForge", `quality-gates` HD-6 link-check doctrine, `anti-sycophancy-meta`/`pre-mortem`/`steelman` first-responder rework). Kit checkout: `<KIT>`.
**Manifest**: `.ai-kit-manifest.json`, `origin: "generated"`, 44 tracked files, `maturity_tier: Starter`, `ide_scope: [claude-code, cursor]`, `presets: [nextjs]`, `packs: [kb-05-decision-starter]`.
**Audit consumed**: `AI-WORKFLOW-AUDIT-2026-07-12.md` (dated 2026-07-12, same day — fresh per §2.1). Not re-audited; findings and owner-adjudication queue consumed per §2's consumption rules.
**Protected paths** (operator-declared at entry, per §3a): `.claude/rules/quality-gates.md` — compliance lock. Verdict is unconditionally **KEEP-PROTECTED**; no merge draft, no overwrite, regardless of what the 2×2 below would otherwise say. Newer kit doctrine for this file is ATTACHED as a note only (row below) for the owner to fold in manually if they choose.

---

## 1. The verdict table

Column vocabulary: `owner state` ∈ untouched / modified / missing / untracked · `kit state` ∈ unchanged / updated / new / n-a · `action` ∈ none / overwrite / add / merge-draft / question. `evidence` = owner pair (manifest`sha256`{=|→}on-disk), then kit pair (manifest`template_sha256`{=|→}current-kit-template), 8-char hashes. `=` means match, `→` means differ (manifest value → current value).

### 1a. KEEP — untouched on both sides (32 rows)

| path | class | owner state | kit state | verdict | action | evidence |
|---|---|---|---|---|---|---|
| `DECISIONS.md` | ledger | untouched | unchanged | KEEP | none | `7d6d3d9e=7d6d3d9e` / `ade58761=ade58761` |
| `HANDOFF.md` | doc | untouched | unchanged | KEEP | none | `684c9a1e=684c9a1e` / `684c9a1e=684c9a1e` |
| `.mcp.json` | mcp-config | untouched | unchanged | KEEP | none | `727131b4=727131b4` / `c4187e9f=c4187e9f` |
| `.cursor/mcp.json` | mcp-config | untouched | unchanged | KEEP | none | `d60f1f0a=d60f1f0a` / `76decbe5=76decbe5` |
| `.mcp.annotations.md` | mcp-config | untouched | unchanged | KEEP | none | `f1543aa2=f1543aa2` / `f493c263=f493c263` |
| `.gitignore` | ignore | untouched | n/a (`template: null`) | KEEP | none | `ce1fece8=ce1fece8` / n-a |
| `.cursorignore` | ignore | untouched | unchanged | KEEP | none | `8ccefec6=8ccefec6` / `be8783b0=be8783b0` |
| `.cursorindexingignore` | ignore | untouched | unchanged | KEEP | none | `59335b86=59335b86` / `1f9552ba=1f9552ba` |
| `.claude/settings.json` | mcp-config | untouched | unchanged | KEEP | none | `462fb4d5=462fb4d5` / `2ef1a153=2ef1a153` |
| `.claude/rules/decision-skills.md` | rule | untouched | n/a (`template: null`) | KEEP | none | `463ba5f0=463ba5f0` / n-a |
| `.cursor/rules/base.mdc` | rule | untouched | unchanged | KEEP | none | `3b95da68=3b95da68` / `c82ec8cf=c82ec8cf` |
| `.cursor/rules/frontend.mdc` | rule | untouched | unchanged | KEEP | none | `db4e314a=db4e314a` / `f5fabfb0=f5fabfb0` |
| `.cursor/rules/decision-skills.mdc` | rule | untouched | n/a (`template: null`) | KEEP | none | `e5a61e21=e5a61e21` / n-a |
| `.claude/agents/simplifier.md` | agent | untouched | unchanged | KEEP | none | `fd66a53b=fd66a53b` / `83c00c59=83c00c59` |
| `.claude/agents/reviewer.md` | agent | untouched | unchanged | KEEP | none | `0386d6db=0386d6db` / `0dab3631=0dab3631` |
| `.claude/agents/verifier.md` | agent | untouched | unchanged | KEEP | none | `81744a89=81744a89` / `0bcc3b8b=0bcc3b8b` |
| `.claude/agents/tester.md` | agent | untouched | unchanged | KEEP | none | `6e67a24f=6e67a24f` / `d08a0b32=d08a0b32` |
| `.cursor/agents/reviewer.md` | agent | untouched | unchanged | KEEP | none | `e8de4cc8=e8de4cc8` / `56569eac=56569eac` |
| `.cursor/agents/tester.md` | agent | untouched | unchanged | KEEP | none | `a31bdf52=a31bdf52` / `47645918=47645918` |
| `.claude/commands/review-pr.md` | command | untouched | unchanged | KEEP | none | `4ba96c6b=4ba96c6b` / `c5b2fcf7=c5b2fcf7` |
| `.claude/commands/deploy.md` | command | untouched | unchanged | KEEP | none | `653d9c2a=653d9c2a` / `3bf5b2cb=3bf5b2cb` |
| `.claude/commands/discover-mcp.md` | command | untouched | unchanged | KEEP | none | `cff92cee=cff92cee` / `a5eb5d8a=a5eb5d8a` |
| `.claude/commands/security-review.md` | command | untouched | unchanged | KEEP | none | `4e78348a=4e78348a` / `0ba50d4a=0ba50d4a` |
| `.claude/commands/tech-debt.md` | command | untouched | unchanged | KEEP | none | `be7b3599=be7b3599` / `164ae80e=164ae80e` |
| `.claude/commands/workflow-help.md` | command | untouched | unchanged | KEEP | none | `7b3c0788=7b3c0788` / `170fb6cf=170fb6cf` |
| `.claude/commands/status.md` | command | untouched | unchanged | KEEP | none | `4a508226=4a508226` / `1d0d2c6c=1d0d2c6c` |
| `.claude/skills/decision/confidence-calibration/SKILL.md` | skill | untouched | unchanged | KEEP | none | `bf736f2d=bf736f2d` / `bf736f2d=bf736f2d` |
| `.claude/skills/decision/reversibility-check/SKILL.md` | skill | untouched | unchanged | KEEP | none | `d0639603=d0639603` / `d0639603=d0639603` |
| `.cursor/skills/decision/confidence-calibration/SKILL.md` | skill | untouched | unchanged | KEEP | none | `bf736f2d=bf736f2d` / `bf736f2d=bf736f2d` |
| `.cursor/skills/decision/reversibility-check/SKILL.md` | skill | untouched | unchanged | KEEP | none | `d0639603=d0639603` / `d0639603=d0639603` |
| `.cursor/skills/debug/SKILL.md` | skill | untouched | unchanged | KEEP | none | `cb6ae338=cb6ae338` / `bf64d77a=bf64d77a` |
| `.cursor/skills/deployment/SKILL.md` | skill | untouched | unchanged | KEEP | none | `6158bd73=6158bd73` / `1cc77cbb=1cc77cbb` |

### 1b. KEEP-PROTECTED — operator compliance lock (1 row)

| path | class | owner state | kit state | verdict | action | evidence |
|---|---|---|---|---|---|---|
| `.claude/rules/quality-gates.md` | rule | untouched | updated (frozen by declaration) | **KEEP-PROTECTED** | none | `2b0023c7=2b0023c7` / `6db38ca9→33618e15` |

**ATTACH note** (informational only, not applied): the current kit added an HD-6 comment block to this template — canonical link-check guidance for docs/markdown repos ("use `.claude/scripts/check-links.py`, never re-improvise a shell one-liner"). Not relevant to Tempo Deck today (no docs-ops preset, no compiler-less repo), but if the owner ever wants it, it must be added by hand — this pass will never touch this file. Its untouched Cursor twin (`.cursor/rules/quality-gates.mdc`, NOT declared protected) is proposed for a normal UPGRADE below and would receive this exact text, so approving that row alone will make the two twins diverge in content (Claude Code frozen at the old text, Cursor gets the new HD-6 block). Flagging for awareness — the operator's protected-path declaration governs, this is not a request to override it.

### 1c. UPGRADE — safe, owner never touched, kit moved (8 rows)

| path | class | owner state | kit state | verdict | action | evidence |
|---|---|---|---|---|---|---|
| `AGENTS.md` | context | untouched | updated | UPGRADE | overwrite | `cc489125=cc489125` / `44097f1d→903cac4f` |
| `.cursor/rules/quality-gates.mdc` | rule | untouched | updated | UPGRADE | overwrite | `41657ca5=41657ca5` / `fe155f20→f4b342f0` |
| `.claude/skills/decision/pre-mortem/SKILL.md` | skill | untouched | updated | UPGRADE | overwrite | `c703c923=c703c923` / `c703c923→232de935` |
| `.claude/skills/decision/steelman/SKILL.md` | skill | untouched | updated | UPGRADE | overwrite | `f579f0b5=f579f0b5` / `f579f0b5→92c7b705` |
| `.claude/skills/decision/anti-sycophancy-meta/SKILL.md` | skill | untouched | updated | UPGRADE | overwrite | `f93e3a1f=f93e3a1f` / `f93e3a1f→3b544e50` |
| `.cursor/skills/decision/pre-mortem/SKILL.md` | skill | untouched | updated | UPGRADE | overwrite | `c703c923=c703c923` / `c703c923→232de935` |
| `.cursor/skills/decision/steelman/SKILL.md` | skill | untouched | updated | UPGRADE | overwrite | `f579f0b5=f579f0b5` / `f579f0b5→92c7b705` |
| `.cursor/skills/decision/anti-sycophancy-meta/SKILL.md` | skill | untouched | updated | UPGRADE | overwrite | `f93e3a1f=f93e3a1f` / `f93e3a1f→3b544e50` |

Evidence detail:
- `AGENTS.md`: kit-side change is a cosmetic rename, "AI Workflow Kit" → "DirectiveForge Kit" heading. No functional delta.
- `.cursor/rules/quality-gates.mdc`: same HD-6 link-check doctrine block described in §1b's ATTACH note — this is the Cursor twin of the protected Claude Code file, but was not itself declared protected, so it upgrades normally.
- `pre-mortem` / `steelman` / `anti-sycophancy-meta` (4 IDE-paired files, 2 skills + shared): kit-side changes are the v0.19.0 "first-responder convention" rework (HD-2 in CHANGELOG) — `anti-sycophancy-meta` gains an explicit deferral clause so it stops pre-empting named-technique requests, description/trigger text sharpened. This is a measured quality improvement (activation-rate delta documented in the kit's harness results), not a cosmetic change — safe to apply, no owner content touches these files.

### 1d. ADJUDICATE — both sides moved, or audit-flagged content risk requiring an owner decision (4 rows)

| path | class | owner state | kit state | verdict | action | evidence |
|---|---|---|---|---|---|---|
| `CLAUDE.md` | context | modified | updated | ADJUDICATE | question | `be123ae5→17b8c550` / `ed09e20c→9e6a5cfb` |
| `.claude/rules/base.md` | rule | modified | unchanged | ADJUDICATE | question | `9df150bf→57beb341` / `cf61fc94=cf61fc94` |
| `.claude/commands/update-context.md` | command | modified | updated | ADJUDICATE | question | `013bcb14→6fabb030` / `d643ab05→121bcb94` |
| `.claude/skills/git-hygiene/SKILL.md` | skill | untracked | n-a | ADJUDICATE | question | not in manifest at all — reverse of the §3 "file missing" row: file present on disk, absent from the manifest's 44-entry `files[]` |

Note on `.claude/rules/base.md`: the raw 2×2 (owner differs / kit unchanged) is a textbook safe **KEEP + `owner_customized: true`** — pure customization, kit never touched it. It is promoted to ADJUDICATE here only because the audit's owner-adjudication queue (items 1–2) flags two of the five added lines as factually wrong about the current codebase, which the owner needs to resolve either way. This is a content-correctness escalation, not a diff-engine conflict — see §3 below for the exact reasoning.

---

## 2. 3-way summaries for the 4 ADJUDICATE rows (§5)

### 2.1 `CLAUDE.md`
- **Manifest baseline** (`be123ae5`, `git show dc92819:CLAUDE.md` in this repo): kit-generated, `{{...}}` placeholders substituted, e.g. `Deploy: Vercel (hobby), framework preset in vercel.json, region iad1.`
- **Current file** (`17b8c550`, owner commit `72761da`): two owner edits — (a) appended ", custom domain tempodeck.app" to the deploy line; (b) added a new "## Local overrides (owner)" section: `Weekend practice sessions get logged manually — see docs/PRACTICE-METRICS.md` and `Do not suggest a database until session count exceeds 500 (owner decision 2026-07-05)`.
- **New kit output** (current template `9e6a5cfb`, placeholders re-substituted): identical structurally to baseline except one heading rename, `## AI Workflow Kit Reference` → `## DirectiveForge Kit Reference`, and the one prose sentence under it. No line overlap with the owner's edits.
- **Options**: `keep-mine` (skip the rename, keep current file exactly) / `take-kit` (forfeits both owner additions — NOT recommended, they're real project facts) / `merge` (apply the kit's heading+sentence rename, keep both owner additions verbatim — trivial, zero line conflicts). Ties to Q3 below on whether the `docs/PRACTICE-METRICS.md` line should survive the merge as-is.

### 2.2 `.claude/rules/base.md`
- **Manifest baseline / current kit output**: identical (`cf61fc94` both sides) — the kit-generated portion (lines 1–36, core execution protocol) never moved and needs no merge.
- **Current file**: owner appended a "## Tempo Deck house conventions" block (5 lines) after the kit content, untouched otherwise.
- **The actual question** (from the audit, not the diff engine): 2 of those 5 lines describe a codebase that doesn't exist today — `app/fixtures/` is not a real directory (`app/` has only `globals.css`, `layout.tsx`, `page.tsx`) and `SEED_SESSIONS` is declared inline in `app/page.tsx`, contradicting both this rule and `CLAUDE.md`'s own text ("The home page renders a seeded `SEED_SESSIONS` array"). The CSV-export line references a feature (CSV export) that doesn't exist anywhere in the repo (`grep -rn CSV` → no hits).
- **Options**: `keep-mine` (leave as a forward-looking spec for a refactor not yet done) / correct the two lines to describe the inline-in-`page.tsx` reality and drop the CSV line until it exists / build `app/fixtures/` + the CSV mapping to match the rule as written. No kit-side content is in conflict here — this is pure owner-content adjudication.

### 2.3 `.claude/commands/update-context.md`
- **Manifest baseline / current file**: owner added one line, step 8: `Update docs/PRACTICE-METRICS.md if session-tracking fields changed (owner-maintained metrics doc)`.
- **New kit output**: one cosmetic rename in the unrelated "Quality Reference" section, "the AI Workflow Kit" → "the DirectiveForge kit". No line overlap with the owner's step 8.
- **Options**: `merge` is trivial and lossless (disjoint lines) regardless of how Q3 (below) resolves — the rename applies either way. The open question is solely whether step 8's `docs/PRACTICE-METRICS.md` reference is correct, since `docs/` doesn't exist in this repo yet (audit F4).

### 2.4 `.claude/skills/git-hygiene/SKILL.md`
- Not a kit-templated file — owner-authored, added in commit `72761da`, absent from `.ai-kit-manifest.json`'s 44-entry list entirely (audit F1). No baseline/kit-output triad applies; the open questions are purely about the owner's intent and manifest bookkeeping (audit F7 + owner-queue item 4): (a) should this get a `.cursor/skills/git-hygiene/SKILL.md` twin, matching the cross-IDE mirroring convention every other skill in this repo follows, or is Cursor-parity deliberately skipped for git operations? (b) its frontmatter uses `confidence: high` where all 10 installed decision-skill files use a numeric `0.85`–`0.95` scale — cosmetic but worth normalizing. Whatever the owner decides, apply mode would register this file in the manifest with `disposition: "owner-added"`, `owner_customized: true` (nothing here is destructive either way).

---

## 3. Adjudication questions (owner replies once, covers all 4 rows above)

1. **`CLAUDE.md`** [ADJUDICATE] — merge the kit's cosmetic "DirectiveForge Kit Reference" rename into your current file (your two additions — the `tempodeck.app` domain note and the "Local overrides" section — are preserved verbatim either way, they don't overlap the kit's changed lines)? Reply `keep-mine` / `take-kit` / `merge`.
2. **`.claude/rules/base.md`** [ADJUDICATE, audit F3] — your "Tempo Deck house conventions" block says practice fixtures live in `app/fixtures/` (doesn't exist; `SEED_SESSIONS` is inline in `app/page.tsx` today) and references a CSV export mapping (no CSV code exists anywhere). Is this a planned refactor you haven't done yet (leave the rule as-is, `keep-mine`), or should the rule be corrected to describe the current inline-in-`page.tsx` reality and the CSV line dropped until it exists?
3. **`CLAUDE.md` line "see `docs/PRACTICE-METRICS.md`" + `.claude/commands/update-context.md` step 8** [ADJUDICATE, audit F4, one answer covers both rows] — `docs/` doesn't exist in this repo. Do you maintain `PRACTICE-METRICS.md` outside the repo, is it not yet created, or should both references be dropped?
4. **`.claude/skills/git-hygiene/SKILL.md`** [ADJUDICATE, audit F1 + F7, owner-queue item 4] — this file isn't in the manifest at all and has no `.cursor/skills/` twin, breaking the cross-IDE mirroring every other skill in this repo follows. Intentional (Cursor not used for git ops), or should apply mode (a) register it in the manifest as `owner-added`, (b) fix `confidence: high` → a numeric value matching the other 10 skill files, and (c) mirror it to `.cursor/skills/git-hygiene/SKILL.md`?

Unanswered rows default to `keep-mine` per §5.3 — silence preserves, never destroys.

---

## 4. ADD — new kit capability this install predates

| path | class | owner state | kit state | verdict | action | evidence |
|---|---|---|---|---|---|---|
| `.claude/commands/report-friction.md` | command | missing | new | UPGRADE | add | not in manifest; kit template `templates/claude-code/commands/report-friction.md.template` ships "always, all tiers" per `generator/PROJECT_SETUP_PROMPT.md` line 462 |
| `.cursor/skills/report-friction/SKILL.md` | skill | missing | new | UPGRADE | add | not in manifest; kit template `templates/cursor/skills/report-friction.SKILL.md.template` ships "if Cursor in scope" — this install's `ide_scope` includes `cursor` |

Both need `{{KIT_REPO_SLUG}}` (default `directiveforge/directiveforge` — not recorded in this install's `placeholders` map, confirm before generating) and `{{PROJECT_NAME}}` (`Tempo Deck`, already known) filled at apply time. Non-destructive by construction (new files only); still applied only on approval.

**Evaluated, not proposed**: `.claude/agents/security-auditor.md` / `.cursor/agents/security-auditor.md` (condition: "project has payments, auth, or handles sensitive data" — Tempo Deck has none of these; `lib/email.ts` is an unauthenticated transactional-email stub, no payment/auth surface) and `.cursor/agents/seo-auditor.md` / `.cursor/agents/i18n-validator.md` (no public-SEO surface, single locale). `.cursor/rules/{api-rest,database,testing}.mdc` also evaluated and correctly absent — no API layer, no database, no test runner in `package.json`.

### 4a. Candidate, not counted as a hard ADD — gated behind an owner decision (audit §6 lens-8, feeds this list per UPGRADE_MODE §2 rule 3)

**Graduate the KB-05 decision pack from Starter (5 BLOCKER skills, current) to Intermediate** (+3 HIGH skills: `inversion`, `second-order-thinking`, `disconfirming-evidence-first`, 6 files total — one per skill × 2 IDEs — plus a router update to `.claude/rules/decision-skills.md` / `.cursor/rules/decision-skills.mdc`).

This is presented as a candidate, not a numbered adjudication question, because it is not a diff-engine conflict (none of the 44 tracked files are in dispute) — it is a capability the owner may opt into. Context for the decision, from the audit's F2: the currently-installed `anti-sycophancy-meta` skill (and its 4 siblings, 10 files across both IDEs) routes finished-artifact reviews to `disconfirming-evidence-first`, which doesn't exist at Starter tier and has no fallback clause — unlike the parallel `council-3-voice` case, which *is* handled gracefully with an explicit "if not installed, do X instead" clause. Verified against the current kit templates in this pass: this gap is still present in today's kit source (checked `templates/skills/decision/anti-sycophancy-meta/SKILL.md` HEAD vs v0.17.0 — the routing table still names `disconfirming-evidence-first` as one of three branches, unconditionally), so the §1c UPGRADE rows above do NOT fix F2 on their own. Two ways to close it:
- **(a) Accept this ADD** — installs the 3 missing skills, resolves F2 as a structural side effect (the routing table's targets actually exist).
- **(b) Decline** — instead patch a graceful-fallback clause into the 10 files that currently name `disconfirming-evidence-first`/`inversion` as routing targets, mirroring the existing `council-3-voice` fallback pattern. Smaller, Starter tier stays as declared in the manifest.

Either choice is a legitimate, self-contained follow-up; this plan does not default to one on the owner's behalf.

---

## 5. Findings explicitly out of scope for this pass (not silently dropped)

The audit's F5 (5 files assume "no `.git` yet" — `CLAUDE.md:53`, `.claude/commands/status.md:23`, `.claude/commands/workflow-help.md:17`, `.cursor/skills/debug/SKILL.md:26`, `.mcp.annotations.md:14`), F6 (10 decision-skill files use unresolvable bare-relative doc paths instead of the absolute kit path), F8 (`frontend.mdc`'s `app/**/*.ts` glob matches 0 files, informational, no action needed per the audit itself), and F9 (`HANDOFF.md` never templated, informational, no action needed per the audit itself) are **generated-content staleness**, not kit-template-vs-owner-file conflicts — all 5 F5/F6 files are diff-engine KEEP or UPGRADE rows above (owner never touched them; the drift is between the file's *content* and the project's *current state*, which the hash-diff mechanism cannot see or fix). Upgrading these files from the kit does not correct this drift; it requires a targeted content edit or an `/update-context` run. Flagging here so nothing the audit found is silently dropped, per this mode's zero-destructive/zero-silent-drop discipline — recommended as a fast manual follow-up, not part of this plan's apply surface.

The audit's owner-adjudication-queue item 5 ("confirm you want `.ai-kit-manifest.json` re-hashed/re-flagged now") is answered by existing doctrine, not a new question: `UPGRADE_MODE.md` §5 already specifies that apply mode's *last* action is always rewriting the manifest — new `sha256` for every touched file, `owner_customized: true` on every `keep-mine`/`merge` outcome, and a fresh entry for `git-hygiene` once Q4 is answered. No separate confirmation is needed beyond approving this plan.

---

## 6. Token-economy delta (§4.5 — estimates, not measured; §5a smoke protocol was not run in this dry-run)

Baseline figures below are the audit's own measured Phase-1 numbers (§7 of the audit), reused per §2 rather than re-measured.

| Surface | Current always-loaded weight | Post-upgrade (this plan, if all UPGRADE rows approved) | Delta |
|---|---|---|---|
| Claude Code (`CLAUDE.md` + all 3 `.claude/rules/*.md`) | 12,245 B ≈ ~3,060 tokens | ~3,050–3,060 tokens | ≈0 — `AGENTS.md` and the 3 skill-file UPGRADEs are lazy-loaded (Skill-tool invocation, not injected per-turn); `CLAUDE.md`'s only kit-side change is a ~14-byte heading rename; `.claude/rules/quality-gates.md` is frozen (protected), so its HD-6 addition never lands here |
| Cursor (`alwaysApply: true` only — `base.mdc` + `quality-gates.mdc`) | 2,497 B ≈ ~625 tokens | ~750 tokens | **+~125 tokens** — `.cursor/rules/quality-gates.mdc` is NOT protected and would gain the ~500-byte HD-6 link-check comment block on UPGRADE |

New capability, zero always-loaded cost: `.claude/commands/report-friction.md` and `.cursor/skills/report-friction/SKILL.md` are both invoked on demand (slash command / skill match), never injected into the base context window.

**Settings-level levers** (`.claude/settings.json`, cross-checked against `workflows/WORKFLOW-CLAUDE-CODE.md` §11.3): `MAX_THINKING_TOKENS=10000` and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50` are already set — this install predates neither of those two doctrine additions. Missing: `CLAUDE_CODE_SUBAGENT_MODEL` is unset (defaults to `inherit`) — the kit's §11.2 routing table recommends `haiku` for mechanical subagents (e.g. `simplifier`); not currently enforced. MCP surface: 2 servers (`context7`, `github`) configured across both `.mcp.json` / `.cursor/mcp.json`, well under the ~10-server / ~80-tool ceiling — no action needed.

---

## 7. Summary counts

- **KEEP**: 32
- **KEEP-PROTECTED**: 1
- **UPGRADE** (overwrite, safe): 8
- **UPGRADE** (add, new capability): 2 (`report-friction` pair) — 6 more files are a conditional candidate (§4a), not counted until the owner answers whether to graduate the KB-05 pack
- **ADJUDICATE**: 4
- **Total rows in this plan**: 47 (44 manifest entries + 1 untracked owner file surfaced by the audit + 2 ADD rows) — matches manifest count once the untracked file and the 2 unconditional ADD rows are accounted for.

These counts equal the actual row counts in §1a–§1d and §4 above (§8 self-check).

---

## 8. Verification results (§5a — appended post-apply, branch `kit-upgrade-2026-07-12`)

**Apply mode ran** against the operator's recorded adjudication (verbatim, see apply-session record): Q1 (`CLAUDE.md`) unanswered → default `keep-mine` per §5.3; Q2 (`.claude/rules/base.md`) explicit `keep-mine`; Q3 (`docs/PRACTICE-METRICS.md` refs) `keep-mine` for `CLAUDE.md`'s line, `merge` for `.claude/commands/update-context.md` step 8; Q4 (`.claude/skills/git-hygiene/SKILL.md`) explicit no-action — not touched, not mirrored, not registered in the manifest this pass. All §4/§4a `add` rows and the add-candidate declined — no new files this pass.

**Files touched (9):**
- `AGENTS.md` — UPGRADE overwrite: 1-line heading rename `## AI Workflow Kit` → `## DirectiveForge Kit` (the sole kit-template delta since v0.17.0, confirmed via `git show 87282ad -- templates/shared/AGENTS.md.template`). New sha256 `791806d0…`.
- `.cursor/rules/quality-gates.mdc` — UPGRADE overwrite: inserted the HD-6 canonical-link-check HTML comment block after the gate table (sole kit-template delta since v0.17.0, confirmed via `git show ab147a0 -- templates/cursor/rules/quality-gates.mdc.template`). New sha256 `aef4d9dd…`.
- `.claude/skills/decision/pre-mortem/SKILL.md`, `.claude/skills/decision/steelman/SKILL.md`, `.claude/skills/decision/anti-sycophancy-meta/SKILL.md`, and their `.cursor/skills/decision/…` twins (6 files total) — UPGRADE overwrite: owner never touched these (byte-identical literal kit-source copies, no placeholder substitution), so the current kit source was copied in verbatim. New hashes match plan evidence exactly: `232de935…` (pre-mortem), `92c7b705…` (steelman), `3b544e50…` (anti-sycophancy-meta).
- `.claude/commands/update-context.md` — ADJUDICATE → merge: preserved step 8 (`docs/PRACTICE-METRICS.md`) verbatim per Q3; applied the kit's cosmetic Quality-Reference branding line ("Follow the standards in the DirectiveForge kit:") as the closest textual equivalent of the kit-side delta (this project's rendering of the file is bespoke-generated prose, not literal template substitution, so the literal "AI Workflow Kit" string the template-diff names does not appear verbatim in this file — the merge applied the equivalent branding update to the section it belongs to). New sha256 `d5c224aa…`.

**Files explicitly NOT touched (adjudicated `keep-mine` / protected / declined):**
- `CLAUDE.md` — Q1 unanswered → `keep-mine` by default. Byte-identical pre/post (`17b8c550…`). Manifest updated: `owner_customized: true`, `template_sha256` refreshed to current kit template hash `9e6a5cfb…` (bookkeeping only — no content applied).
- `.claude/rules/base.md` — Q2 explicit `keep-mine` ("planned refactor I haven't done yet"). Byte-identical pre/post (`57beb341…`). Manifest updated: `owner_customized: true` (kit-side never moved for this file, so `template_sha256` unchanged).
- `.claude/rules/quality-gates.md` — protected path (§3a). Byte-identical pre/post, manifest entry left fully untouched including `kit_version` (quarantined from the entire pass, per instruction).
- `.claude/skills/git-hygiene/SKILL.md` — Q4 explicit no-action. Byte-identical pre/post (`d6a1e53d…`). No manifest entry added (confirmed still absent from `.ai-kit-manifest.json`'s `files[]`). No `.cursor/skills/git-hygiene/` twin created (confirmed absent).
- `.claude/commands/report-friction.md`, `.cursor/skills/report-friction/SKILL.md`, and the §4a KB-05 Intermediate-tier graduation (3 skills × 2 IDEs) — declined per "no new files this pass." None created.

### 8.1 Static verification (`harness/layer1/static-checks.md`)

Ran against the full install tree (`TARGET` = repo root). **121 PASS / 10 FAIL / 8 N/A** (micro-average pass rate 0.924 excluding N/A).

All 10 failures are on files whose verdict this pass is `KEEP` or `keep-mine` — none of them are among the 9 files this apply touched, so **the apply introduced zero static-check regressions**. Per the apply constraints, files with a KEEP/keep-mine/KEEP-PROTECTED verdict (and the git-hygiene file) were never touched to fix these — they are pre-existing conditions carried over unmodified from the prior state:

| Check | File | Verdict lock | Note |
|---|---|---|---|
| S1/S2/S3 | `.cursor/skills/deployment/SKILL.md` | KEEP | pre-existing: missing 5-key frontmatter (no `name/description/severity/confidence/surface`), no numbered Procedure section |
| S1/S2/S3 | `.cursor/skills/debug/SKILL.md` | KEEP | pre-existing: same frontmatter/Procedure gaps |
| R1 | `.claude/rules/base.md` | keep-mine (Q2) | 33 content lines > 30-line base ceiling — the owner's 5-line "house conventions" block pushes it over; explicitly frozen by Q2 |
| A4 | `.claude/agents/verifier.md` | KEEP | pre-existing: unqualified `Bash` grant (not scoped to named command families) |
| A1 | `.claude/agents/tester.md` | KEEP | pre-existing: role/description line has 2 sentence-terminators, over the ≤1 mechanical proxy |
| C1 | `.claude/commands/workflow-help.md` | KEEP | pre-existing: numbered-step sequence irregularity |

N/A families (8): R2 on 5 base/domain-class rule files (router-only check), C1 on 2 prose-only command files (`security-review.md`, `deploy.md`), T2 (Phase-1.7 codebase-brief check — forward-only addendum, this install predates that lifecycle instrumentation).

**Disposition:** no fix-on-branch action taken; no revert needed. All 10 are out of this pass's apply surface by the explicit KEEP/keep-mine/protected lock — fixing them would mean touching files this session was instructed never to touch.

### 8.2 Protected-path byte-identity (§3a)

`.claude/rules/quality-gates.md` — pre-apply sha256 `2b0023c783421e56121a13980007d344e680d40c5a6fa0b4f7ac5af8eb3274ab`, post-apply sha256 `2b0023c783421e56121a13980007d344e680d40c5a6fa0b4f7ac5af8eb3274ab`. **Match — byte-identical.** No abort triggered.

### 8.3 Smoke set (doc-level, mechanical)

1. **Commands in `CLAUDE.md` + `.claude/rules/base.md` resolve** — `npm run dev`, `npm run lint`, `npm run build` all present in `package.json` `scripts`; `npx tsc --noEmit` used consistently as the typecheck substitute (no dedicated script, matches both files' own documented convention). **PASS.**
2. **Strict-JSON parse** — `.mcp.json`, `.claude/settings.json`, `.cursor/mcp.json` all parse clean via `python3 -m json.tool`. **PASS.**
3. **`.claude/rules/decision-skills.md` path resolution** — 3 kit-absolute paths (`KB-05-CONVERSATIONAL-DECISION-ENGINEERING.md`, `prompts/code-handoff-prompts.md`, `research/2026-05-26-decision-techniques.md`) resolve under `<KIT>`; all 5 referenced `.claude/skills/decision/<name>/SKILL.md` paths resolve on disk. **PASS.**

**Smoke verdict: PASS, no regressions, no token-cost measurement performed this pass** (this was a doc-level/mechanical smoke per the operator's dispatch scope, not the full 3-5 representative-task behavioral smoke described in §5a.3 — the §4.5 token-economy estimates in this plan remain estimates, not measured).

### 8.4 Manifest rewrite

`.ai-kit-manifest.json` rewritten as the LAST apply action. Top-level `kit_version` → `0.20.0`. Per-file: new `sha256` for the 9 touched files; `template_sha256` refreshed wherever the kit template moved (including for the 2 `keep-mine` ADJUDICATE rows, `CLAUDE.md` and — n/a for `base.md`, whose template never moved); `owner_customized: true` set on `CLAUDE.md`, `.claude/rules/base.md`, and `.claude/commands/update-context.md` (the 3 rows with a recorded owner outcome this pass); `.claude/rules/quality-gates.md`'s entry left **fully untouched** (including `kit_version`, still `0.17.0`) — protected-path quarantine extended to manifest bookkeeping, not just file bytes. `.claude/skills/git-hygiene/SKILL.md` remains absent from `files[]` per Q4. No entries added for the declined ADD rows.

### 8.5 Rollback rail

Pre-upgrade state persists unchanged on `master` (the default branch) — this branch (`kit-upgrade-2026-07-12`) was never merged. Merging is the owner's action.

