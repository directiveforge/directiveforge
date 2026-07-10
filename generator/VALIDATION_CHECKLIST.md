# Generator Output Validation Checklist

> Run after every execution of `PROJECT_SETUP_PROMPT.md`. All items must pass before the generated workflow is committed to the target project.
>
> Version: v0.19.0 (§18–§23 added — HD-1..HD-8 gates). Last updated 2026-07-03.
>
> Source references: KB-02 §1 (token budgets), §2 (rules quality), §3 (skills), §4 (agents), §5 (no redundancy)

**Harness sync:** this checklist's static gates are mechanized as PASS/FAIL measurement checks in `harness/layer1/static-checks.md` (metric L1.1), and the checklist itself is executed end-to-end as outcome metric L2.1 in `harness/layer2/BENCHMARK-PROTOCOL.md`. When editing gates below, keep the two harness files in sync.

---

## §0. Instrument-validity note (READ FIRST — named contract deliverable)

**This checklist is a GENERATION-TIME GATE, not a quality score. The harness (`harness/HARNESS-SPEC.md`) is GROUND TRUTH.** A checklist PASS-rate MUST NEVER be quoted as quality evidence without a harness grade next to it. Empirical proof of the gap: in the v0.18 harness baseline, three generator runs each passed **12–14 / 14 applicable sections** while the harness graded two of them **F** — one edited a pre-existing `README.md` in place with no backup (HD-4), one propagated a stale Heroku deploy claim into four generated files while its own tech-debt output flagged that same claim as drift (HD-5), and one shipped a link-health gate that misfired on every intra-`docs/` link — 13 false DEAD LINK lines burying 2 real ones (HD-6). The circularity is empirically confirmed: **passing every section means the workflow is complete, consistent, and within budgets — necessary, not sufficient.** §18–§23 below were added to close those specific F-grade holes; they still do not make a checklist PASS a substitute for a harness run.

---

## 1. Token Budget Compliance

**Why this matters**: Overloaded Tier 1 context degrades every interaction (KB-02 §1.1). Research shows performance degrades beyond 3,000 tokens always-loaded.

- [ ] **CLAUDE.md**: Line count ≤ 150 lines
  ```bash
  wc -l CLAUDE.md
  ```
- [ ] **CLAUDE.md**: All six core sections present and non-empty (no minimum line count — a short file carrying all six passes)
  ```bash
  for s in "Build & Test Commands" "Architecture" "Key Conventions" "Common Pitfalls" "Session Protocol" "Definition of Done"; do
    grep -q "^## .*$s" CLAUDE.md || echo "MISSING: $s"
  done
  ```
- [ ] **base.mdc**: Content lines ≤ 30 (excluding YAML frontmatter)
  ```bash
  # Count lines after the closing ---
  awk '/^---$/{found++; next} found>=2' .cursor/rules/base.mdc | wc -l
  ```
- [ ] **Total alwaysApply rules**: Token count ≤ 500 tokens total
  - Estimate: `wc -w` on all `alwaysApply: true` files × 1.3 ≈ token count
  - All `alwaysApply: true` files combined must be under ~400 words

---

## 2. No Redundancy

**Why this matters**: Each fact in exactly one place prevents drift and contradictions (KB-02 §5.3).

- [ ] No fact appears in both `AGENTS.md` and `CLAUDE.md`
  - AGENTS.md = universal (stack, commands, constraints for all IDEs)
  - CLAUDE.md = Claude Code additions (pitfalls, architecture not in AGENTS.md)
- [ ] No command appears in both `CLAUDE.md` and `AGENTS.md` unless they differ between IDEs
- [ ] No rule content duplicated between `base.mdc` and domain-specific `.mdc` files
- [ ] No skill content that belongs in a rule (rules = conventions; skills = multi-step procedures)

---

## 3. All Referenced Paths Exist

**Why this matters**: Rules citing nonexistent paths cause agent confusion and hallucinated fixes.

- [ ] Every directory path mentioned in rules exists in the target project
  ```bash
  # Extract paths from rules and verify
  grep -hEo '`[a-z][a-z0-9/_-]+/`' .cursor/rules/*.mdc | tr -d '`' | sort -u | while read p; do
    [ -d "$p" ] || echo "MISSING: $p"
  done
  ```
- [ ] Every file path cited (schema file, client file, config file) exists
- [ ] Glob patterns in `.mdc` frontmatter match actual file locations
  ```bash
  # Test each glob against the filesystem
  # Example: globs: ["src/components/**"] → ls src/components/ should return files
  ```
- [ ] Dead-rule lint is repeatable, not one-shot: the glob/path checks above must re-run on repo restructures (rules die silently when directories move). Wire one of: a CI step re-running the two checks above, the quarterly `WORKFLOW_HEALTH_AUDIT` lens-3 pass, or an ecosystem linter (e.g., `claude-rules-doctor` — dead-`.claude/rules/` detection with CI exit-1; `agnix` — agent-config lint; both third-party, verify before adopting)

---

## 4. All Commands Are Valid

**Why this matters**: Commands that don't match `package.json` scripts silently fail or confuse agents.

- [ ] Every command in `CLAUDE.md` exists in `package.json` `scripts` (or is a direct binary call)
  ```bash
  # List package.json scripts
  cat package.json | grep -A 50 '"scripts"' | grep ':'
  ```
- [ ] Every command in `base.mdc` matches package.json
- [ ] Every command in `AGENTS.md` matches package.json
- [ ] Migration commands match ORM CLI (`prisma migrate dev` vs `drizzle-kit push` vs `alembic upgrade head`)
- [ ] Package manager prefix is consistent (all `pnpm` / all `npm` / all `bun` — not mixed)

---

## 5. No Secrets or Credentials

**Why this matters**: Generated files are committed to Git. Secrets in generated files = credentials in version control.

- [ ] No `.env` values appear in any generated file
- [ ] No API keys, tokens, passwords, or connection strings
- [ ] MCP config uses `${ENV_VAR}` syntax — not literal values
  ```bash
  grep -rE "sk-[A-Za-z0-9]{8,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|Bearer [A-Za-z0-9._-]{16,}|password=[^${]|secret=[^${]" CLAUDE.md AGENTS.md .cursor/ .claude/ .mcp.json .ai-kit-manifest.json 2>/dev/null
  ```
  Patterns are value-shaped on purpose: a bare `sk-` matches ordinary English ("task-to-route", "per-task-type") and false-positives; `${ENV_VAR}` references must pass.
- [ ] `.env` itself was never read (only `.env.example`)

---

## 6. Conventions Match Actual Codebase

**Why this matters**: Rules that contradict what the codebase actually does get ignored (KB-02 §2.1).

- [ ] Export style in rules matches codebase export style
  ```bash
  # Check actual export patterns
  grep -r "^export default" src/ | wc -l   # default exports
  grep -r "^export const\|^export function" src/ | wc -l  # named exports
  ```
- [ ] File naming convention in rules matches actual files
  ```bash
  ls src/components/  # PascalCase? kebab-case? camelCase?
  ```
- [ ] Import alias in rules matches `tsconfig.json` paths or Python import structure
- [ ] Test framework in testing.mdc matches installed test packages
- [ ] ORM patterns in database.mdc match actual query patterns in codebase

---

## 7. MCP Security Annotations Present

**Why this matters**: 66% of MCP servers have security findings; teams need to know what each server can access (KB-01 §7.4).

- [ ] Every MCP server has an entry in the companion `.mcp.annotations.md` stating: read-only or read-write (config files are strict JSON — inline comments break MCP loading)
- [ ] Every MCP server has an annotations entry stating: what credentials/permissions it needs
- [ ] MCP config files parse as strict JSON:
  ```bash
  python3 -m json.tool < .mcp.json && python3 -m json.tool < .cursor/mcp.json
  ```
- [ ] All credentials use `${ENV_VAR}` placeholders — never hardcoded
- [ ] No experimental or unverified MCP servers added without explicit note
- [ ] MCP config files are `.cursor/mcp.json` (Cursor) and `.mcp.json` (Claude Code) — correct filenames
- [ ] All npm/stdio MCP packages use pinned versions (`@x.y.z`), not `@latest`; remote HTTP servers are version-managed upstream
- [ ] Run `uvx snyk-agent-scan@latest` to verify server/skill security before deployment
  ```bash
  uvx snyk-agent-scan@latest
  ```
  This is **Snyk Agent Scan** (PyPI `snyk-agent-scan`, run with `uvx`) — formerly Invariant Labs' `mcp-scan`, rebranded after Snyk's 2025 acquisition of Invariant Labs. Full verdict needs a free `SNYK_TOKEN` (app.snyk.io); without it the run degrades to inventory and auto-declines stdio servers non-interactively. See `knowledge-base/MCP-SERVER-REGISTRY.md` (security checklist).

---

## 8. Skills Include Gotchas Sections

**Why this matters**: Gotchas section is the highest-signal content in a skill — continuously captures failure points (KB-02 §3.3).

- [ ] Every skill file has a `## Gotchas` section with at least 2 items
- [ ] Every skill file has a `## When NOT to Use This Skill` section
- [ ] Trigger description is written for the model ("use when asked to X") not as a title
- [ ] Steps are numbered and sequential — no ambiguous "you can also" branches

---

## 9. Agents Include Explicit Constraints

**Why this matters**: Agents without explicit constraints will over-reach their intended scope (KB-02 §4.6).

- [ ] Every agent file has a `## Constraints` section with explicit NEVER/ALWAYS rules
- [ ] Every agent file specifies its tool access (what tools it uses — not open-ended)
- [ ] Role description is one sentence — not a paragraph
- [ ] Output format is defined — agent knows what to return
- [ ] No agent has write access to files it doesn't need

---

## 10. File Count and Completeness

Cursor-side items apply only **if Cursor is in scope** (generator Phase 3.4); mark N/A for Claude-only projects. Claude-side items symmetrically require Claude Code in scope.

- [ ] `AGENTS.md` created at project root
- [ ] `CLAUDE.md` created at project root (or updated if existed)
- [ ] `base.mdc` created in `.cursor/rules/` (if Cursor in scope)
- [ ] Domain-specific `.mdc` files created ONLY for domains that exist in the project (if Cursor in scope)
- [ ] Skills created ONLY for procedures that actually apply
- [ ] `.cursor/mcp.json` created (if Cursor in scope)
- [ ] `.mcp.json` created (Claude Code format)
- [ ] `DECISIONS.md` exists at the project's ledger location — root by default, but an existing `governance/` or `docs/` ledger (any entry format) counts and must NOT be duplicated by a new root ledger
- [ ] `.cursorindexingignore` created (prevents junk indexing) (if Cursor in scope)
- [ ] `.cursorignore` created (hides secrets from context) (if Cursor in scope)
- [ ] At least 3 `.claude/commands/` slash commands created (review-pr, update-context + one project-appropriate command; `deploy` only if the project is deployable)

---

## 11. Execution Infrastructure

**Why this matters**: These operational patterns (from Boris Cherny's 13 pro tips) are the difference between an agent that self-corrects and one that ships its first draft. Absence means the workflow is underperforming.

> **Scope note:** the kit provides these artifacts since v0.17.0 (`templates/claude-code/settings.json.template`, `templates/claude-code/agents/`). For projects generated by an earlier kit version, mark Fail and remediate via `generator/UPGRADE_MODE.md`.

- [ ] **Slash commands**: At least 5 defined for daily workflows (review-pr, code-review, test, build/lint, deploy or update-context). Note: `simplify` was renamed to `/code-review` in Claude Code v2.1.147 (correctness review), then v2.1.154 re-introduced a built-in `/simplify` as a *separate* cleanup-only command — the two now coexist. The kit's `Simplifier` subagent still covers the reuse/quality/efficiency lens with project-specific rules.
- [ ] **PostToolUse hooks** (`templates/claude-code/settings.json.template`): `.claude/settings.json` has hooks for Write/Edit (auto-format or budget checks), or `{}` with a report note when no formatter exists
- [ ] **Permissions configured** (`templates/claude-code/settings.json.template`): `.claude/settings.json` has `allow` (git reads, build, lint, test) and `deny` (rm -rf, force push, .env reads)
- [ ] **MCP servers configured**: `.mcp.json` has project-relevant servers (GitHub, database, CMS, etc.)
- [ ] **Feedback loop chain**: Project defines concrete verification steps (build + lint + test + visual + spec) in CLAUDE.md or a slash command
- [ ] **Three mandatory subagents** (`templates/claude-code/agents/`): Simplifier + Reviewer + Verifier defined in `.claude/agents/` (or equivalent). Note: the kit's `Simplifier` subagent is conceptually distinct from KB-05's 12 decision SKILLS — the subagent is a custom kit-internal agent (read-only review for reuse/quality); the decision skills are conversational pressure-test mechanisms. A project at Advanced tier has BOTH.
- [ ] **Plan mode in session protocol**: CLAUDE.md session protocol mentions Plan mode for non-trivial tasks

---

## 12. Decision Skills Installation (KB-05)

**Why this matters**: KB-05 ships 12 conversational decision skills. The 5 BLOCKER skills are irreducible — a kit install without them is decision-engineered in name only. Skills are also invisible to the agent without the router rule documenting them.

- [ ] **5 BLOCKER skills installed** (all tiers): `pre-mortem`, `steelman`, `confidence-calibration`, `reversibility-check`, `anti-sycophancy-meta` each present at `.claude/skills/decision/<name>/SKILL.md` (and Cursor mirror at `.cursor/skills/decision/<name>/SKILL.md` if Cursor is in scope)
  ```bash
  for s in pre-mortem steelman confidence-calibration reversibility-check anti-sycophancy-meta; do
    [ -f ".claude/skills/decision/$s/SKILL.md" ] || echo "MISSING: $s"
  done
  ```
- [ ] **4 HIGH skills installed** (Intermediate+ tier): `inversion`, `second-order-thinking`, `disconfirming-evidence-first` (steelman already in BLOCKERs) — same path convention
- [ ] **3 MEDIUM skills installed** (Advanced tier only): `10-10-10`, `cost-of-inaction`, `bayesian-update`
- [ ] **Council skill installed** (Advanced tier AND plan-tier ≥ Max only): `council-3-voice` at `.claude/skills/decision/council-3-voice/SKILL.md`
- [ ] **Each SKILL.md has YAML frontmatter** with `name` (matches directory slug) + `description` ("pushy" per Anthropic Skills convention) + `severity` + `confidence` + `surface` fields populated
- [ ] **Decision-skill router rule present**: `.claude/rules/decision-skills.md` exists, documents the installed skills + phrase-mapping router + (if council installed) the 15× token cost gate

---

## 13. KB-04 Decision Engineering Installation (Intermediate+ only)

**Why this matters**: KB-04 covers project-scale decisions that need multi-dossier research + locked entries. Without the supporting rules + skills + architect-prompt template, Intermediate+ projects can't apply the discipline.

- [ ] **`docs/prompts/ARCHITECT_PROMPT.template.md` exists** — the 14-section IMPL prompt template (copied from `templates/shared/ARCHITECT_PROMPT.md.template`)
- [ ] **`.claude/rules/orchestrator-dispatch.md` installed** (+ Cursor mirror `.cursor/rules/orchestrator-dispatch.mdc` if Cursor in scope)
- [ ] **`.claude/rules/research.md` installed** (+ Cursor mirror `.cursor/rules/research.mdc` if Cursor in scope)
- [ ] **`.claude/skills/research-prompt-writer/SKILL.md` installed** (+ Cursor flat-format mirror `.cursor/skills/research-prompt-writer.SKILL.md` if Cursor in scope)
- [ ] **`.claude/skills/research-synthesizer/SKILL.md` installed** (+ Cursor mirror)
- [ ] **DECISIONS.md uses Tier 2 format** (with reversal triggers + re-verification cadence per entry) OR Tier 3 format (full TL;DR + Master Synthesis 400w + cross-DECISIONS reconciliation)

---

## 14. Surface Routing Integration (Intermediate+ only)

**Why this matters**: Per-project surface routing tells agents which Claude surface (Chat / Cowork / Code) is right for each recurring task pattern. Without it, agents default to whatever surface the user opened — often suboptimal.

- [ ] **`.claude/rules/ai-workflow.md` exists** — output of running `prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md` against this project (per generator Phase 4.5)
- [ ] **`.cursor/rules/ai-workflow.mdc` exists** if Cursor is in scope (rule-sync mandate)
- [ ] **The rule file maps 6-10 project-recurring tasks to surfaces** (per the integration prompt's output spec)
- [ ] **CLAUDE.md references the new rule file**

If Phase 4.5 was deferred (operator opted to run later), this section may be flagged "pending operator action" rather than failed.

---

## 15. Vigilance Discipline (Advanced tier only, opt-in)

**Why this matters**: Self-improvement discipline that catches silent staleness in the kit. If installed, must be configured correctly — half-configured vigilance produces noise without action.

- [ ] **`workflows/KIT-VIGILANCE.md` exists** in project (adapted copy from `{{KIT_PATH}}/workflows/KIT-VIGILANCE.md`)
- [ ] **`vigilance/WATCHLIST.md` exists** AND is **project-specific** (not just a verbatim copy of the kit's watchlist — Category 2 framework releases should reflect the project's actual stack)
- [ ] **`vigilance/feed/{daily,weekly,monthly,quarterly}/` directories exist** with `.gitkeep` files
- [ ] **`vigilance/state/` directory exists** AND is gitignored
- [ ] **`prompts/dispatch/{DAILY_PULSE_SCAN,WEEKLY_SYNTHESIS,MONTHLY_INTEGRATION}.md` exist** in project (copies from `{{KIT_PATH}}/prompts/dispatch/`)
- [ ] **3 Claude Code Routines registered** on `claude.ai/code/scheduled` — `<project>-vigilance-daily-pulse` / `<project>-vigilance-weekly-synthesis` / `<project>-vigilance-monthly-integration`
- [ ] **Each routine has "Allow unrestricted git push" enabled** AND **explicit `git checkout main; do NOT create a feature branch` instructions** in the Instructions field (prevents the `claude/`-branch issue the kit's own setup hit on first run)

If Phase 7 was offered and declined by the operator, this section is N/A — flag in summary as "operator declined vigilance bootstrap."

---

## 16. Mission-Dispatch Pattern (Advanced tier only, opt-in)

**Why this matters**: When the project needs citation-grounded research that lands as a committed dossier, the mission-dispatch pattern is the kit-portable solution.

- [ ] **`prompts/chat-research-missions.md` exists** in project (copy from kit)
- [ ] **`prompts/code-handoff-prompts.md` exists** in project
- [ ] **`prompts/cowork-browser-operations.md` exists** in project
- [ ] **`prompts/dispatch/` directory exists** with README explaining runnable-mission-instances convention
- [ ] **`research/` directory exists** with README pointing to kit's `research/` for example dossiers

If Phase 8 was offered and declined, this section is N/A.

---

## 17. Cross-Artifact Consistency

**Why this matters**: Each generated doc passes its own gate and still contradicts its siblings — versions drift, commands diverge, references die between artifacts. Consistency is a property of the *set*, not the files (scan-adopted mechanism A8).

- [ ] **Fact agreement across generated docs**: stack versions, package-manager prefix, and command names are identical wherever they appear (CLAUDE.md / AGENTS.md / rules / preset-derived content). Complements §2 (placement) and §4 (existence) — this checks agreement.
- [ ] **Generated↔generated references resolve**: every generated doc citing another generated doc points at a file that exists (§3 covers rules→project paths; this covers the artifact graph)
- [ ] **Install manifest integrity** (after Phase 8.5):
  ```bash
  python3 -m json.tool .ai-kit-manifest.json > /dev/null && echo OK
  ```
  Every generated file from §10's count appears in `files[]`; every listed `path` exists; spot-check 3 entries with `shasum -a 256 <path>` against the recorded `sha256`; `presets` / `maturity_tier` / `ide_scope` match the Phase 9 report.
- [ ] **Doc-derived checks executed**: the Phase 5 checklist-generation step ran for each major generated doc (3-5 falsifiable checks from the doc's own claims) and results are recorded
- [ ] **DECISIONS↔rules coherence**: no rule mandates a pattern a seeded DECISIONS entry marks as reserved/pending (e.g. "retained pending revival decision") without carrying the same framing

---

## 18. Destructive-Action Protocol (HD-4)

**Why this matters**: The v0.18 baseline rewrote a pre-existing `README.md` in place with no backup — a hard-F data-loss defect. A generator must never destroy pre-existing content it can't roll back.

- [ ] **(a) Audit-trail file present.** `PRE-EXISTING-MODIFIED.txt` exists at project root, one line per modified pre-existing path with a backup path or an `append-only` marker; **missing file = FAIL**. Version gate: applies when `.ai-kit-manifest.json` records `kit_version ≥ 0.19.0`; for older-kit trees mark this clause `N/A-by-version` and rely on clause (b).
  ```bash
  KV=$(python3 -c "import json;print(json.load(open('.ai-kit-manifest.json')).get('kit_version','0'))" 2>/dev/null)
  case "$KV" in 0.19.*|0.2*|[1-9]*) [ -f PRE-EXISTING-MODIFIED.txt ] && echo "(a) PASS" || echo "(a) FAIL: PRE-EXISTING-MODIFIED.txt missing";; *) echo "(a) N/A-by-version (kit $KV)";; esac
  ```
- [ ] **(b) Ground-truth backup check** (usable whenever a pre-state is available — VCS history, a backup dir, or, in harness context, the fixture's `repo/` tree at `$PRE`). Every pre-existing path whose post-state content differs from pre-state MUST have a `.backup` sibling OR be an append-only diff. Any in-place rewrite without a backup = **FAIL, section-blocking**.
  ```bash
  # $PRE = path to the pre-state tree (fixture repo/ or a git-stash checkout); $POST = generated tree (usually .)
  find "$PRE" -type f | while read pf; do
    rel=${pf#"$PRE"/}; qf="$POST/$rel"; [ -f "$qf" ] || continue
    if ! cmp -s "$pf" "$qf"; then                       # content changed
      dels=$(diff -U0 "$pf" "$qf" | grep -c '^-[^-]')    # deleted lines (0 = append-only)
      { [ "$dels" -eq 0 ] || [ -f "$qf.backup" ]; } || echo "FAIL rewrite-without-backup: $rel"
    fi
  done
  ```

---

## 19. Drift-Quarantine Integrity (HD-5)

**Why this matters**: The baseline propagated a stale Heroku deploy claim into four generated files while its own tech-debt output flagged it as drift — a self-contradiction the checklist waved through.

- [ ] **(a) Quarantine block present.** A machine-readable `DRIFT-QUARANTINE` block exists in the run's `/tech-debt` output (present-and-empty is allowed). Version-gated exactly like §18(a) (`N/A-by-version` below kit 0.19.0).
  ```bash
  grep -rl 'DRIFT-QUARANTINE' . --include="*.md" >/dev/null && echo "(a) present" || echo "(a) FAIL: no DRIFT-QUARANTINE block"
  ```
- [ ] **(b) Self-contradiction grep** (works on ANY tree, incl. pre-0.19.0). For every claim flagged as drift/stale/contradicted in the run's own tech-debt/analysis output, grep the rest of the generated tree: every occurrence outside the tech-debt/quarantine context MUST carry the drift flag on the same line/paragraph. An un-flagged assertion of a flagged claim = **FAIL (self-contradiction)**.
  ```bash
  # Pull the distinguishing keyword of each quarantined claim (e.g. "heroku"), then hunt un-flagged assertions:
  for claim in $(grep -rhi 'DRIFT-QUARANTINE' -A40 . --include="*.md" | grep '|' | sed -E 's/ *\|.*//' | grep -oiE '[A-Za-z][A-Za-z0-9._-]{3,}' | sort -u); do
    grep -rin --include="*.md" "$claim" . | grep -v '/tech-debt/' | grep -vi 'drift\|quarantine' \
      && echo "FAIL self-contradiction: '$claim' asserted un-flagged above"
  done
  ```

---

## 20. Gate Self-Test (HD-6)

**Why this matters**: A gate that cries wolf is worse than no gate. The baseline's link-health gate resolved `docs/`-relative links from repo root, producing 13 false DEAD LINK lines that buried the 2 real ones. **This item tests the INSTRUMENT, not the corpus.**

- [ ] **Link-gate validated against a known micro-corpus** BEFORE its output is trusted. Build a temp corpus with exactly one genuinely-dead link and two valid intra-repo links (one sibling, one `../` parent) plus a code-fenced fake link; run the project's link-gate from the corpus root. **PASS iff exactly 1 BROKEN report (`missing.md`) AND non-zero exit; any false positive on the two valid links = FAIL, section-blocking.** (If no link gate was generated, mark N/A.)
  ```bash
  D=$(mktemp -d); mkdir -p "$D/docs"
  printf '# Root\n[docs a](docs/a.md)\n' > "$D/README.md"
  printf '# A\n[x](b.md)\n[r](../README.md)\n[dead](missing.md)\n```\n[fake](also-missing.md)\n```\n' > "$D/docs/a.md"
  printf '# B\n' > "$D/docs/b.md"
  ( cd "$D" && python3 "$OLDPWD/.claude/scripts/check-links.py" >out.txt 2>&1; ec=$?
    n=$(grep -c 'BROKEN' out.txt)
    if [ "$n" -eq 1 ] && grep -q 'missing.md' out.txt && [ "$ec" -ne 0 ]; then echo "PASS (1 real dead link, 0 FP)"; else echo "FAIL"; cat out.txt; fi )
  rm -rf "$D"
  ```

---

## 21. Cross-Skill Route Resolution (HD-7)

**Why this matters**: Starter-tier installs shipped full-catalog skill copies whose routes pointed at siblings not installed at that tier — a dead route the agent can never follow.

- [ ] **Every cross-skill route resolves at this tier.** For each installed skill under `.claude/skills/` (and `.cursor/skills/` if present), every backtick-quoted sibling-skill name referenced in its description/body must resolve to an installed directory (`test -d`), OR the referencing line must carry a tier-aware fallback marker (`at this tier`). An unresolved bare route = **FAIL**.
  ```bash
  INSTALLED=$(find .claude/skills .cursor/skills -mindepth 1 -maxdepth 4 -type d 2>/dev/null -exec basename {} \; | sort -u)
  for f in $(find .claude/skills .cursor/skills -name SKILL.md 2>/dev/null); do
    grep -oE '`[a-z][a-z0-9-]+`' "$f" | tr -d '`' | sort -u | while read ref; do
      echo "$INSTALLED" | grep -qx "$ref" && continue                 # resolves — ok
      grep -n "\`$ref\`" "$f" | grep -q 'at this tier' \
        && echo "OK tier-fallback: $ref ($f)" \
        || echo "FAIL unresolved route: $ref ($f)"
    done
  done
  ```
  (Only refs that are themselves kit skill slugs matter; project-noun backticks that match no installed slug and no known kit slug are ignored — the `$INSTALLED` set is the resolution universe.)

---

## 22. Description Collision Lint (HD-1/2/3 proxy)

**Why this matters**: Overlapping trigger phrases across skill descriptions cause router mis-fires (the baseline's `inversion`/`anti-sycophancy-meta`/`name-generation` confusions).

> **HONESTY SCOPE NOTE**: this is a collision *lint* — a necessary-not-sufficient proxy for routing quality. Ground truth for trigger F1 lives in the harness (L1.2). A clean lint does **NOT** certify routing; it only rules out the crudest overlap.

- [ ] **No ≥4-consecutive-word span shared between any two installed skills' frontmatter `description` fields.** A shared 4-gram = a trigger-phrase collision = **FAIL**.
  ```bash
  python3 - <<'PY'
  import os, re, glob
  def desc(p):
      t=open(p,encoding='utf-8',errors='replace').read()
      m=re.search(r'^---\s*$(.*?)^---\s*$', t, re.M|re.S)
      if not m: return ''
      d=re.search(r'^description:\s*(.+)$', m.group(1), re.M)
      return d.group(1).strip() if d else ''
  words=lambda s: re.findall(r'[a-z0-9]+', s.lower())
  files=sum((glob.glob(os.path.join(b,'**','SKILL.md'),recursive=True) for b in ('.claude/skills','.cursor/skills')),[])
  items=[(f, words(desc(f))) for f in files]; N=4; bad=0
  for i in range(len(items)):
      for j in range(i+1,len(items)):
          (fa,wa),(fb,wb)=items[i],items[j]
          ga={tuple(wa[k:k+N]) for k in range(len(wa)-N+1)}
          gb={tuple(wb[k:k+N]) for k in range(len(wb)-N+1)}
          if ga&gb:
              bad+=1; print("COLLISION",os.path.basename(os.path.dirname(fa)),"<->",os.path.basename(os.path.dirname(fb)),":"," ".join(next(iter(ga&gb))))
  print("FAIL" if bad else "PASS")
  PY
  ```

---

## 23. Pack-Gate Decision Log (HD-8)

**Why this matters**: A met pack-detection gate that the runner silently skips (citing "operator minimalism") is an untraceable judgment call. Every conditional-pack decision must be logged, and every skip-despite-met-gate must quote the operator.

- [ ] **(a) `Pack-Gate Decisions` section present** in the Phase 9 report, listing every conditional pack (KB-03 catalog / KB-07 naming / KB-08 design) with disposition `installed` / `proposed-and-declined` / `not-triggered`; **missing section = FAIL**. Version-gated like §18(a).
  ```bash
  grep -q '^### Pack-Gate Decisions' PHASE9*.md 2>/dev/null || grep -rq '^### Pack-Gate Decisions' . --include="*.md" && echo "(a) present" || echo "(a) FAIL: no Pack-Gate Decisions section"
  ```
- [ ] **(b) Judgment clause.** For every `proposed-and-declined` row, the operator's opt-out is quoted verbatim (a quote character on the line). A skip-despite-met-gate without a quote = **FAIL**.
  ```bash
  grep -rh 'proposed-and-declined' . --include="*.md" | while read -r line; do
    echo "$line" | grep -q '"' || echo "FAIL unquoted decline: $line"
  done
  ```

---

## Traceability — HD defect → checklist item → check type

| HD row | New/changed checklist item(s) | Check type |
|--------|-------------------------------|------------|
| HD-1 (inversion trigger) | §22 description collision lint | semi-mechanical (proxy; F1 ground truth = harness L1.2) |
| HD-2 (anti-sycophancy-meta trigger) | §22 description collision lint | semi-mechanical (proxy) |
| HD-3 (name-generation ↔ naming-brief) | §22 description collision lint | semi-mechanical (proxy) |
| HD-4 (in-place README edit) | §18(a) audit-trail file + §18(b) ground-truth backup check | mechanical |
| HD-5 (drift propagated as truth) | §19(a) DRIFT-QUARANTINE block + §19(b) self-contradiction grep | mechanical |
| HD-6 (link-gate false positives) | §20 gate self-test (instrument validation) | mechanical |
| HD-7 (phantom sibling routes) | §21 cross-skill route resolution | mechanical |
| HD-8 (pack-gate vs minimalism) | §23(a) decision-log presence + §23(b) verbatim opt-out quote | mechanical (a) / judgment (b) |
| HD-9 (Haiku recorder truncation) | N/A — harness-internal, see RUNBOOK/W3 | — |
| HD-10 (.gitignore swallows) | N/A — fixed in v0.18.0-H | — |
| — (all sections) | §0 instrument-validity note | contract deliverable |

---

## Sign-off

All items checked? Record:

```
Project: [name]
Generator run: [date]
Checklist passed: [yes/no]
Items failed: [list or "none"]
Validator: [agent or human]
```
