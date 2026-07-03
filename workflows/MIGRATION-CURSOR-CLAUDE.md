# Cursor ↔ Claude Code Migration Recipe

> Migrate a kit-generated workflow between IDEs — or stand up / retire a mirror tree — without losing content, scoping, or cross-references.
> Audience: the operator + the executing agent, in a session at the target project root.
> Provenance: field-confirmed on a dormant-revival validation run (worked example in `feedback/2026-06-11-P2.md`, same-day addendum: 11 rules, 3 skills, 4 agents, ~20 cross-reference fixes).

## 0. When this fires

- The operator corrects IDE scope post-install (the field case: generator assumed "both", only one was real)
- The project adopts a second IDE (mirror stand-up) or abandons one (mirror retirement)
- Drift detected between `.cursor/` and `.claude/` — a sync-mandate violation (generator Phase 3.4)

## 1. Decide scope BEFORE migrating — the IDE-scope heuristic

- **Directory existence is weak evidence in BOTH directions.** `.cursor/` existing does not mean Cursor is in use (it may be organically grown and stale); `.claude/` absent does not mean Claude Code is not in use.
- **Session evidence rule**: if the generator/migration session is itself running in Claude Code (or Cursor), that IDE is in scope regardless of directories.
- **Stale-artifact signal**: an organically grown `.cursor/` with misconfigured rules — empty `description` + `globs` + `alwaysApply: false` (never attaches), missing frontmatter, dead globs, filename typos — means ASK the operator about IDE scope; never assume "both".
- Generator-time version of this heuristic: `generator/PROJECT_SETUP_PROMPT.md` Phase 3.4.

## 2. Asset-class mapping table

Kit-template columns name the shipped template when one exists; destination paths follow the generator's Phase 3.4 destination table.

| Artifact class | Cursor side | Claude Code side | Transform |
|---|---|---|---|
| Base rule | `templates/cursor/rules/base.mdc.template` → `.cursor/rules/base.mdc` | `templates/claude-code/rules/base.md.template` → `.claude/rules/base.md` | §3.1 frontmatter ↔ Scope line; cursor side keeps ≤30 content lines |
| Quality-gates rule | `templates/cursor/rules/quality-gates.mdc.template` → `.cursor/rules/quality-gates.mdc` | `templates/claude-code/rules/quality-gates.md.template` → `.claude/rules/quality-gates.md` | Twins — content identical, wrapper differs (§3.1) |
| Domain rules | `templates/cursor/rules/{api-rest,database,frontend-react,frontend-vue,testing}.mdc.template` → `.cursor/rules/*.mdc` | `.claude/rules/<name>.md` — transform output; no claude-side kit template ships | §3.1: YAML → `> Scope:` line |
| Dispatch/research rules | `.cursor/rules/{orchestrator-dispatch,research}.mdc` — mirror output; no cursor-side template ships | `templates/claude-code/rules/{orchestrator-dispatch,research}.md.template` → `.claude/rules/*.md` | Reverse §3.1: synthesize frontmatter from the Scope line |
| Legacy flat skills | `templates/cursor/skills/{debug,deployment,migration,refactor,research-prompt-writer,research-synthesizer}.SKILL.md.template` → `.cursor/skills/<name>.SKILL.md` | `.claude/skills/<name>/SKILL.md` | §3.2: flat → directory + YAML frontmatter |
| Decision skills (KB-05) | `templates/skills/decision/<name>/SKILL.md` → `.cursor/skills/decision/<name>/SKILL.md` | same source → `.claude/skills/decision/<name>/SKILL.md` | Byte-identical copy — NO transform (shipping-quality doctrine) |
| Naming skills (KB-07) | `templates/skills/naming/<name>/SKILL.md` → `.cursor/skills/naming/<name>/SKILL.md` | same source → `.claude/skills/naming/<name>/SKILL.md` | Byte-identical copy — NO transform |
| Design skills (KB-08) | `templates/skills/design/<name>/SKILL.md` → `.cursor/skills/design/<name>/SKILL.md` | same source → `.claude/skills/design/<name>/SKILL.md` | Byte-identical copy — NO transform |
| Agents (twins) | `templates/cursor/agents/{reviewer,security-auditor,tester}.md.template` → `.cursor/agents/*.md` | `templates/claude-code/agents/{reviewer,security-auditor,tester}.md.template` → `.claude/agents/*.md` | Templates exist BOTH sides — install per-IDE, don't transform; §3.3 explains the wrapper difference |
| Agents (cursor-only templates) | `templates/cursor/agents/{seo-auditor,i18n-validator}.md.template` → `.cursor/agents/*.md` | `.claude/agents/<name>.md` — transform output | §3.3: body-only → YAML frontmatter, least-privilege preserved |
| Agents (claude-only templates) | `.cursor/agents/<name>.md` — transform output | `templates/claude-code/agents/{simplifier,verifier}.md.template` → `.claude/agents/*.md` | Reverse §3.3: frontmatter `tools:` folds into a body `## Tools` section |
| Commands | (Cursor has no equivalent) | `templates/claude-code/commands/*.md.template` (8) → `.claude/commands/*.md` | Claude→Cursor: fold the command's Steps into a skill, or drop — DOCUMENTED in the migration commit, never silent |
| MCP config | `templates/cursor/mcp.json.template` → `.cursor/mcp.json` | `templates/claude-code/mcp.json.template` → `.mcp.json` (project root) | Filename/location + remote-syntax difference only (`"type": "http"` claude-side); strict JSON both; ONE shared `.mcp.annotations.md` covers both |
| Annotations companion | `templates/shared/mcp-annotations.md.template` → `.mcp.annotations.md` | same file — IDE-neutral | No transform; update entries when servers move |
| Settings / permissions | (no Cursor equivalent) | `templates/claude-code/settings.json.template` → `.claude/settings.json` | Cursor→Claude adds it; Claude→Cursor: nothing to carry |
| Ignore files | `templates/cursor/{.cursorignore,.cursorindexingignore}.template` → project root | (no equivalent) | Re-express secret-hiding as `settings.json` `deny` rules (`Read(.env)` etc.) — do NOT invent a `.claudeignore` |
| Shared root docs | `templates/shared/{AGENTS.md,DECISIONS.md,HANDOFF.md,ARCHITECT_PROMPT.md}.template` | same files — IDE-neutral | No transform; AGENTS.md IDE-specific rows updated per §4 |
| Install manifest | `.ai-kit-manifest.json` (IDE-neutral, project root) | same | §5: update `ide_scope` + per-file entries after migrating |

## 3. Frontmatter transform rules

### 3.1 Rules: `.mdc` YAML ↔ Scope line

**Cursor → Claude**: strip the YAML block (`description` / `globs` / `alwaysApply`); encode the attachment semantics as a first-line blockquote:

```markdown
> Scope: API routes (src/app/api/**) — was glob-attached in Cursor; loaded per session here.
```

Doctrinal note: `.claude/rules/` has **no glob attachment** (WORKFLOW-CLAUDE-CODE §5 — modular rules load per session). Two consequences: `alwaysApply` giants must be TRIMMED on the way in (the field run replaced ~970 always-applied lines with a 21-line base), and the token cost of the whole rules directory is session-borne — keep the migrated set lean.

**Claude → Cursor**: synthesize `description` from the Scope line; derive `globs` from the scoped directories (verify each glob matches real files — a zero-match glob never fires); `alwaysApply: true` only for the base rule.

### 3.2 Skills: flat file ↔ directory

**Cursor legacy flat → Claude**: `.cursor/skills/<name>.SKILL.md` → `.claude/skills/<name>/SKILL.md`; add YAML frontmatter — `name:` (matches the directory slug), `description:` (pushy trigger phrasing written for the model, per checklist §8). **Claude → Cursor**: flatten; keep the `description` as the trigger blockquote. Directory-format skills (decision/naming/design) copy byte-identical in both directions — never transform them.

### 3.3 Agents: body-only ↔ YAML frontmatter

**Cursor → Claude**: cursor kit agents are body-only (`# Title` / `**Role**:` / `## Tools` in prose). Claude Code agents need YAML frontmatter. Transform: role sentence → `description:`; the `## Tools` bullets → a `tools:` name list — **preserving KB-02 §4 least-privilege scoping**: the command-family qualifiers ("the project's test command only", "read-only security checks") stay in the body `## Tools` section, because frontmatter grants are names-only and an unqualified `Bash` fails the generator's §3.3 gate.

**Claude → Cursor**: hoist frontmatter into the body — `description:` → the `**Role**:` sentence, `tools:` → a `## Tools` section with the body's command-family lines carried over.

## 4. Cross-reference fixup checklist (the "~20 fixes" class)

Every path that names the OTHER IDE's tree is a candidate. Sweep in this order:

1. **CLAUDE.md**: rules/skills/commands discovery lists; the rule-sync mandate line — ADD it when going dual-IDE, REMOVE it when going single-IDE
2. **AGENTS.md**: IDE-specific rows (which assistants are configured, where their assets live)
3. **Router rules** (`decision-skills`, `naming-skills`, `design-skills`, `ai-workflow`): every `.claude/skills/...` vs `.cursor/skills/...` path in the phrase-mapping tables
4. **`.mcp.annotations.md`**: config-file references
5. **HANDOFF + DECISIONS**: append a migration entry (see §5) — never rewrite history

Copy-paste grep battery:

```bash
grep -rn '\.cursor/' CLAUDE.md AGENTS.md .claude/ 2>/dev/null     # stale cursor refs after cursor retirement
grep -rn '\.claude/' .cursor/ 2>/dev/null                          # stale claude refs after claude retirement
# per migrated rule: verify its Scope claims — do the named directories still exist?
```

## 5. Post-migration protocol

1. **Archive the retired tree** to `docs/archive/` — never delete (generator Phase 4 doctrine)
2. **Update `.ai-kit-manifest.json`** if present: `ide_scope`, per-file entries for moved/added files (new hashes), `owner_customized` preserved — an upgrade pass must not read the migration as owner drift
3. **Re-run VALIDATION_CHECKLIST** sections: §1 (budgets — the migrated side must meet ITS budgets), §3 (referenced paths exist), §10 (file count with scope N/A flips), §12/§13 (skill mirrors + router)
4. **Record a DECISIONS entry**: IDE scope is a decision with a reversal trigger ("revisit if the team adopts X")

## When NOT to migrate

- Both IDEs are genuinely in use → don't retire a side to "simplify"; keep the sync mandate instead
- The `.cursor/` tree is stale AND the operator hasn't confirmed scope → ask first (§1), migrate second
- Mid-refactor working tree → migrate from a clean tree; the fixup greps (§4) drown in unrelated noise otherwise
