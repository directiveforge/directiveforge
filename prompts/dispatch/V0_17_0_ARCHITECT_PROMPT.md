# IMPL — v0.17.0 Capability Release (architect prompt)

> **Surface:** Claude Code session at the kit repo root, strongest available model, plan mode for Phase 0.
> **Written:** 2026-07-02 (Cowork session; sources: CHANGELOG [0.16.3] Deferred, HANDOFF queue, `research/2026-07-02-competitive-landscape-scan.md` §5).
> **Commit discipline:** Code session commits directly (`git` works there — the sandbox-bash lock is a Cowork-only constraint). Conventional message `feat(kit): v0.17.0 — <summary>`; CHANGELOG entry mandatory; HANDOFF refresh mandatory (it lagged 2 releases — do not repeat).

## 1. Identity

You are the implementing architect for v0.17.0 of the DirectiveForge kit (then under its working title) — the first **capability** release since the v0.16.x fast-path series. You are not writing an essay; you are shipping files. Every deliverable below has a path, a ceiling, and an acceptance check.

## 2. Mission

Close the 3-run-evidenced capability debt (brownfield-docs N=2, code-revival N=3, greenfield N=4 friction reports) and land the five scan-adopted mechanisms (A4–A8) that make the generator upgradeable, navigable, and layered. v0.17.0 is the last release before the proof-harness release (v0.18.0-H) — leave the repo in a state a benchmark can be run against.

## 3. Ground rules

1. **Multidomain lock:** no project names, paths, or client-specific numbers in kit files; provenance goes as "field-confirmed across N validation runs" + pointer to `feedback/` filenames only where the kit already does so.
2. **Verification-by-measurement:** every claimed count (files, lines, sections) re-verified with a command before it enters CHANGELOG. Every external fact (package names, env vars, CLI flags) web-verified same-day — the `mcp-scan` → `snyk-agent-scan` double-staleness is the standing cautionary tale.
3. **No silent half-packs:** if a deliverable ships partially, its Status banner and the CLAUDE.md index row must say so (KB-08 doc-only precedent).
4. **Templates carry `{{PLACEHOLDER}}` syntax** consistent with existing `templates/` conventions; check two existing templates before writing any new one.
5. **≥2-run evidence rule:** single-run findings (greenfield N=4) ship only where a second run or the scan independently confirmed the same need — mark the rest QUEUED, do not ship speculatively.

## 4. Knowledge manifest (read in order, hard cap)

1. `CLAUDE.md` + `HANDOFF.md` — repo map + current state
2. `CHANGELOG.md` — [0.16.3] "Deferred to v0.17.0" section is the contract
3. `research/2026-07-02-competitive-landscape-scan.md` — §4 deficits, §5 candidates A4–A8, §6 strategic frame
4. `feedback/2026-06-10-P1.md`, `feedback/2026-06-11-P2.md`, `feedback/2026-06-13-P3.md` — the defect ledgers this release answers
5. `generator/PROJECT_SETUP_PROMPT.md` + `generator/VALIDATION_CHECKLIST.md` — the surfaces most workstreams modify
6. `knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md` — for workstream H
7. `prompts/dispatch/WORKFLOW_HEALTH_AUDIT.md` — for workstream F convergence

## 5. Workstreams (priority order; each = deliverable paths + acceptance check)

### A. Upgrade mode with install manifest (scan A5 + deferred "upgrade/audit mode") — THE SPINE
- Generator writes `.ai-kit-manifest.json` at generation time: kit version, generated file list with content hashes, preset/pack selections, placeholder values. Add to PROJECT_SETUP_PROMPT as a mandatory final Phase step + template at `templates/shared/ai-kit-manifest.json.template`.
- New `generator/UPGRADE_MODE.md`: entry point for kit-aware projects — reads the manifest, diffs current files vs manifest hashes (owner-modified vs kit-original), converges with `WORKFLOW_HEALTH_AUDIT` (audit first, upgrade second; never overwrite owner-modified files without adjudication).
- Acceptance: a dry-run against any repo with a prior generator output produces a 3-column plan (keep / upgrade / adjudicate) and zero destructive actions.

### B. Claude Code agent templates (deferred; unblocks checklist §11)
- `templates/claude-code/agents/`: simplifier, reviewer, verifier (the KB-02 §4 mandatory trio) + port the two domain agents with cross-IDE value (security-auditor, tester). Apply the KB-02 §4 least-privilege tool matrix (shipped v0.16.5) — every Bash grant names its command families.
- `templates/claude-code/settings.json.template`: permissions allowlist skeleton + the three verified env-var levers (`MAX_THINKING_TOKENS`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, `CLAUDE_CODE_SUBAGENT_MODEL` — semantics per WORKFLOW-CLAUDE-CODE §11.3, verified 2026-07-02).
- Remove every "(if kit provides them)" marker in VALIDATION_CHECKLIST §11 — the kit now provides them.
- Acceptance: grep for the marker returns zero; each agent file passes the least-privilege gate in PROJECT_SETUP_PROMPT §3.3.

### C. Owner-brief / revival mode — generator Phase 0.5 (deferred, 2-run evidenced)
- New section in PROJECT_SETUP_PROMPT between Phase 0 and 1: for dormant/revival repos, generate `OWNER_BRIEF.md` (what this project is, state reconstruction, decision points needing the owner) before any workflow generation; gate: fires when git shows a dormancy gap or the operator declares revival.
- Acceptance: section is self-contained, ≤60 lines, references the dormancy signals concretely.

### D. Preset expansion + layered resolution (deferred + scan A7)
- `generator/presets/nextjs-pages.md` (Pages Router — the routing defect from N=3: general-node's own header excludes `next`), `generator/presets/docs-ops.md` (non-code Phase-1 branch, from N=2).
- Formalize precedence in PROJECT_SETUP_PROMPT: project-specific findings > preset > kit defaults, one paragraph + conflict rule (a preset may never override a Phase-1 discovered fact).
- Acceptance: preset-routing table sends Pages-Router Next.js and markdown-ops repos to the right preset; no preset header excludes its own routed stack.

### E. mcp.json strict-JSON + quality-gates rule template (deferred, 2-run evidenced)
- Sweep all `mcp.json` templates: no `//` comments inside JSON (install-breaking); companion `.md` annotation convention; remote-server defaults where the registry marks them preferred.
- `templates/cursor/rules/quality-gates.mdc.template` + claude-code equivalent rule: build/lint/test/typecheck gate wiring per detected toolchain.
- Acceptance: every shipped `*.json.template` parses with `python3 -m json.tool`.

### F. Wayfinder + machine status (scan A4 + A6)
- `templates/claude-code/commands/workflow-help.md.template`: "what's next" navigator over the generated workflow (reads CLAUDE.md, DECISIONS.md, HANDOFF.md, open items; answers "where am I, what's next, which skill/command applies").
- `templates/claude-code/commands/status.md.template`: regenerates HANDOFF.md § "Current state" from git log + ledger tails + manifest — mechanical state, not prose recall; flags drift when hand-written claims contradict git.
- Acceptance: both templates ≤80 lines, zero project-specific assumptions.

### G. Cursor↔Claude migration recipe (deferred, worked example exists in N=3 addendum)
- `workflows/MIGRATION-CURSOR-CLAUDE.md`: both directions, file-by-file mapping table (.mdc ↔ rules/, agents, commands/skills, mcp.json), the IDE-scope heuristic fix from the N=3 addendum.
- Acceptance: every mapping row names both source and destination paths that actually exist in `templates/`.

### H. KB-08 skill pack + generator gate (deferred; removes the doc-only banner)
- `templates/skills/design/` per KB-08's skill-family spec; conditional generator gate mirroring KB-03/KB-07 (fires on frontend/design/UX signals); update the KB-08 Status banner + CLAUDE.md index row.
- Acceptance: gate logic identical in shape to the KB-07 gate; banner no longer says doc-only.

### I. Mechanical debt (batch, single commit)
- Registry refresh: Sanity npm→remote, context7 pin (web-verify both same-day).
- Defect #13: reconcile the 40-line agent gate vs the 87-line orchestrator-dispatch template (scope the gate or split the template — decide, document).
- Defect #16: replace the unenforceable CLAUDE.md 80-line floor with a measurable rule.
- WORKFLOW-CLAUDE-CODE duplicate `### 11.3` headings (Cost Levers + Pricing) — renumber trailing sections.
- KB-02 duplicate `### 4.7` headings (pre-existing, queued since v0.16.0) — same treatment.

## 6. Verification (mandatory, before commit)

Spawn an independent adversarial subagent (step-④ discipline): fresh reads, re-derive the top findings; any falsification verdict must re-fetch the claim's original cited source (the 2026-06-10 meta-lesson). Then run the kit's own VALIDATION_CHECKLIST sections that apply to kit-internal changes; `python3 -m json.tool` every JSON template; grep-sweep for leftover "(if kit provides them)" markers, `//` in JSON, and multidomain leakage (project names) in every new file.

## 7. Out of scope (strict)

Proof-harness implementation (v0.18.0-H — scan §5 A9/A10); instinct-lifecycle KB work (A11, needs KB-06 §5 design pass); AgentShield-style config-audit template (A12, spec at monthly integration first); any Fable-redeploy state refresh (2026-08-01 monthly integration owns it); public-release scrub (separate gate).

## 8. Success criteria (self-score before returning)

Every workstream A–I: shipped / partially (banner + index row updated) / explicitly deferred with reason. CHANGELOG [0.17.0] written from verified counts. HANDOFF "Current state at a glance" rewritten to true state. All acceptance checks pass. The three friction reports' Suggested-Changes tables: every row now maps to shipped / deferred-with-home / rejected-with-reason — zero silently dropped rows.
