# Feedback Dispositions — v0.17.0

> Release-close accounting: every Suggested-Changes row from the three validation-run friction
> reports mapped to a disposition. Vocabulary: **SHIPPED vX.Y.Z (workstream)** / **DEFERRED → home** /
> **REJECTED — reason** / **N/A — project-local**. Zero silently dropped rows is a v0.17.0 success
> criterion (architect prompt §8). Next release repeats the exercise as `DISPOSITIONS-v0.18.0.md`.

## feedback/2026-06-10-P1.md (brownfield-docs; 17 rows)

| # | Suggestion (short) | Disposition | Where / Why |
|---|---|---|---|
| 1 | Replace phantom `npx @anthropic/mcp-scan` invocation | SHIPPED v0.16.2 | Superseded by the `snyk-agent-scan` rename in v0.16.3 |
| 2 | Fix KIT-VIGILANCE dead pointers | SHIPPED v0.16.2 | |
| 3 | Cursor-side rows → "If Cursor in scope"; deploy → "Only if deployable" | SHIPPED v0.16.2 | Row-condition legend, PSP §3.1 |
| 4 | Phase 0.2 inventory: `.claude/skills|agents`, governance/docs ledgers | SHIPPED v0.16.2 | Extended again in v0.17.0 (`.cursor/skills|agents`, manifest guard) |
| 5 | PyPI search lances in Phase 2.5 Step 3 | SHIPPED v0.16.2 | |
| 6 | Governance branch in Phase 2.5 Step 5 | SHIPPED v0.16.2 | |
| 7 | "sections 1-10" → all sections, 14-16 tier-pending | SHIPPED v0.16.2 | v0.17.0 appends §17 note |
| 8 | Phase 4.1 active-context root-archival rule | SHIPPED v0.16.2 | |
| 9 | No-manifest repo branch | SHIPPED v0.16.2 | Branch in Phase 1.1; generation side completed by `presets/docs-ops.md` — v0.17.0 (D) |
| 10 | ARCHITECT template `{{DECISIONS_PATH}}`/`{{AI_KIT_PATH}}` placeholders | SHIPPED v0.16.2 | |
| 11 | orchestrator-dispatch conditional refs + placeholders | SHIPPED v0.16.2 | Line-count contradiction (defect #13) resolved v0.17.0 (I): router/dispatch exemption class, ≤100 ceiling |
| 12 | discover-mcp duplicated step numbers | SHIPPED v0.16.2 | |
| 13 | Value-shaped secret-grep patterns | SHIPPED v0.16.2 | v0.17.0 (A8) extends the sweep to `.ai-kit-manifest.json` |
| 14 | Condition checklist §10/§11; mark "(if kit provides them)" | SHIPPED v0.16.2 | Markers REMOVED v0.17.0 (B) — the kit now provides settings.json + the agent trio |
| 15 | `presets/docs-ops.md` | SHIPPED v0.17.0 (D) | |
| 16 | Claude Code agent templates | SHIPPED v0.17.0 (B) | 5 templates (trio + reviewer/security-auditor/tester ports); `i18n-validator`/`seo-auditor` claude-side via the MIGRATION-CURSOR-CLAUDE §3.3 transform (cursor templates remain the source) |
| 17 | Phase 1.6 stakes axis (money-gates bump tier) | SHIPPED v0.16.2 | v0.17.0 (C) adds the owner-brief ambition signal on top |

Defects #13 / #16 (tracked outside the Suggested-Changes list): both RESOLVED v0.17.0 (I) — gate scoping and the six-required-sections rule.

## feedback/2026-06-11-P2.md (brownfield-code, dormant revival; 12 rows)

| # | Suggestion (short) | Disposition | Where / Why |
|---|---|---|---|
| 1 | `next`+`pages/` routing → Pages-Router preset; general-node postgres swap | SHIPPED v0.17.0 (D) + v0.16.3 | `presets/nextjs-pages.md` + routing rewrite; postgres swap shipped v0.16.3 |
| 2 | Phase 0.5 owner-brief intake + revival doctrine | SHIPPED v0.17.0 (C) | |
| 3 | Strict-JSON mcp templates + github remote + annotations companion | SHIPPED v0.17.0 (E) | `templates/shared/mcp-annotations.md.template` → `.mcp.annotations.md` (N=4's field filename) |
| 4 | Phase 3.4 session-evidence rule | SHIPPED v0.17.0 (G) | + stale-artifact ASK caveat |
| 5 | reversibility-check council fallback (Starter/Intermediate) | SHIPPED v0.17.0 (verification fix-up) | Skill Procedure + `{{IF_NOT_ADVANCED}}` router row |
| 6 | KB-05 reconciliation (cost-of-inaction tier; "Five skills" count) | SHIPPED v0.16.3 | |
| 7 | `mcp-scan` → `snyk-agent-scan` rename + caveats | SHIPPED v0.16.3 | |
| 8 | Phase 1 deploy-drift subsection | DEFERRED → promote on a 2nd code-repo run confirming | Single-run finding; not in the [0.16.3] deferred contract; queued in CHANGELOG |
| 9 | Phase 4.2 attachment-config check | SHIPPED v0.17.0 (verification fix-up) | 2-run-adjacent — scan A3 dead-rule lint confirmed the defect class |
| 10 | CLAUDE.md/AGENTS.md command-split encoded in templates | SHIPPED v0.17.0 (verification fix-up) | Template note: command TABLE lives in AGENTS.md |
| 11 | `.env.example` row in §3.1 | SHIPPED v0.17.0 (verification fix-up) | First drafted as "SHIPPED v0.16.2" — the adversarial verifier FALSIFIED that claim (git -S: the row never existed); shipped in-session. Names + purpose comments only, never values |
| 12 | Phase 0.2 inventory: `.cursor/agents/` | SHIPPED v0.17.0 (verification fix-up) | + `.cursor/skills/` |

Addendum (IDE-scope correction, migration worked example) → SHIPPED v0.17.0 (G): `workflows/MIGRATION-CURSOR-CLAUDE.md`.

## feedback/2026-06-13-P3.md (greenfield-with-locked-stack; 12 rows)

| # | Suggestion (short) | Disposition | Where / Why |
|---|---|---|---|
| 1 | Greenfield-with-locked-stack branch (Phase 1.6/2.1) | DEFERRED → promote after a 2nd greenfield run | Ground rule: single-run greenfield findings do not ship speculatively |
| 2 | TODO-aware command blocks (`{{COMMANDS_OR_TODO_AFTER_SCAFFOLD}}`) | DEFERRED → promote after a 2nd greenfield run | Same |
| 3 | `N/A-until-scaffold` status in checklist §4/§6 | DEFERRED → promote after a 2nd greenfield run | Same |
| 4 | nextjs content-first/headless variant | SHIPPED v0.17.0 (D) | Named in the [0.16.3] deferred contract → variant section in `presets/nextjs.md` |
| 5 | Comment-free mcp.json + `.mcp.annotations.md` + github remote | SHIPPED v0.17.0 (E) | |
| 6 | snyk-agent-scan rename + caveats | SHIPPED v0.16.3 | |
| 7 | Registry: Sanity npm→remote; context7 re-pin | SHIPPED v0.17.0 (I) | Web-verified 2026-07-02 (npm deprecation string; latest 3.2.2 pinned). `docs/ai-workflow-notes.md` clause: N/A — project-local |
| 8 | base.md.template: restore the 7-rule protocol | SHIPPED v0.17.0 (I) | + cursor twin parity (29 content lines, within the ≤30 gate) |
| 9 | `.claude/agents/` destination + templates | SHIPPED v0.17.0 (B) | |
| 10 | Compliance-class rule pattern (>2 hard constraints) | DEFERRED → promote after a 2nd greenfield run | Single-run |
| 11 | research-template refs: emit docs or document the fallback | DEFERRED → promote after a 2nd greenfield run | Already degrades gracefully (as the report notes) |
| 12 | cost-of-inaction HIGH-vs-MEDIUM resolution | SHIPPED v0.16.3 | Checklist §12 authoritative: MEDIUM/Advanced |

## Totals

41 rows: **34 SHIPPED** (25 in v0.16.2/0.16.3, 9 in v0.17.0) · **6 DEFERRED with homes** (5 pending a 2nd greenfield run; 1 pending a 2nd code-repo run) · **1 sub-clause N/A** (project-local) · **0 REJECTED** · **0 silently dropped**.
