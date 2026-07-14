<!-- Copy of the artifact written inside the scratch substrate copy-b; operator paths tokenized on copy. -->
# Upgrade Plan — Tempo Deck

**Mode**: DRY-RUN (UPGRADE_MODE.md). This file is the ONLY write this pass makes. Nothing is applied; every verdict below is a proposal awaiting explicit operator approval, and apply (if approved) runs only on a branch.

## Header block

| Field | Value |
|---|---|
| Installed kit version | **0.17.0** (manifest `kit_version`, all 44 entries) |
| Current kit version | **0.20.0** (`.claude-plugin/plugin.json`) |
| Manifest origin | `generated` (genuine generation-time provenance — the safe-UPGRADE cell of the 2×2 is reachable) |
| Manifest `generated_date` | 2026-07-03T10:50:18Z |
| Install profile | tier **Starter** · ide_scope **[claude-code, cursor]** · presets **[nextjs]** · packs **[kb-05-decision-starter]** |
| Audit consumed | `AI-WORKFLOW-AUDIT-2026-07-12.md` (2026-07-12, 0 days old — fresh, ≤90d; §2 route 1: consume, do not re-audit) |
| Diff basis | exact-byte `shasum -a 256`, no normalization (§3); owner side = file-on-disk vs manifest `sha256`; kit side = current `<KIT>/<template>` vs manifest `template_sha256` |

**Protected paths (§3a): `.claude/rules/quality-gates.md` — operator-declared compliance lock at entry.** Quarantined from the entire pass: verdict is **KEEP-PROTECTED** regardless of the 2×2; no merge draft, no overwrite. The plan may only ATTACH a note that newer kit doctrine exists (see the coupling note below). Apply mode must verify this file is byte-identical pre/post or abort + revert.

> Audit scope note: the consumed audit's §1 scope line names the sibling path `.../copy-a`; per the pass instructions it is the designated audit for THIS install (`copy-b`) and is consumed as such. Every finding it cites (owner-edited `CLAUDE.md`/`base.md`/`update-context.md`, added `git-hygiene`, stale manifest) is independently reconfirmed by this pass's fresh hashing below — the diff engine does not depend on the audit's path label.

---

## Verdict table (46 rows = 44 manifest entries + 2 ADD)

`owner state` ∈ untouched/modified/missing · `kit state` ∈ unchanged/updated/new/n-a · `action` ∈ none/overwrite/add/question · evidence = `ownerManifest{=|≠}ownerDisk / templateManifest{=|→}templateNow` (8-char truncations).

| path | class | owner state | kit state | verdict | action | evidence |
|---|---|---|---|---|---|---|
| `CLAUDE.md` | context | modified | updated | **ADJUDICATE** | question | `be123ae5≠17b8c550 / ed09e20c→9e6a5cfb` — both moved; audit DEGRADED (F1/F4/F5) → Q1 |
| `.claude/commands/update-context.md` | command | modified | updated | **ADJUDICATE** | question | `013bcb14≠6fabb030 / d643ab05→121bcb94` — both moved; audit DEGRADED (F4) → Q2 |
| `AGENTS.md` | context | untouched | updated | **UPGRADE** | overwrite | `cc489125=cc489125 / 44097f1d→903cac4f` |
| `.cursor/rules/quality-gates.mdc` | rule | untouched | updated | **UPGRADE** | overwrite | `41657ca5=41657ca5 / fe155f20→f4b342f0` — ⚠ twin of protected file, see coupling note |
| `.claude/skills/decision/pre-mortem/SKILL.md` | skill | untouched | updated | **UPGRADE** | overwrite | `c703c923=c703c923 / c703c923→232de935` |
| `.claude/skills/decision/steelman/SKILL.md` | skill | untouched | updated | **UPGRADE** | overwrite | `f579f0b5=f579f0b5 / f579f0b5→92c7b705` |
| `.claude/skills/decision/anti-sycophancy-meta/SKILL.md` | skill | untouched | updated | **UPGRADE** | overwrite | `f93e3a1f=f93e3a1f / f93e3a1f→3b544e50` — does NOT close F2, see note |
| `.cursor/skills/decision/pre-mortem/SKILL.md` | skill | untouched | updated | **UPGRADE** | overwrite | `c703c923=c703c923 / c703c923→232de935` |
| `.cursor/skills/decision/steelman/SKILL.md` | skill | untouched | updated | **UPGRADE** | overwrite | `f579f0b5=f579f0b5 / f579f0b5→92c7b705` |
| `.cursor/skills/decision/anti-sycophancy-meta/SKILL.md` | skill | untouched | updated | **UPGRADE** | overwrite | `f93e3a1f=f93e3a1f / f93e3a1f→3b544e50` |
| `.claude/rules/quality-gates.md` | rule | untouched | updated | **KEEP-PROTECTED** | none | `2b0023c7=2b0023c7 / 6db38ca9→33618e15` — kit doctrine moved but file quarantined (§3a); ATTACH-only |
| `.claude/rules/base.md` | rule | modified | unchanged | **KEEP** | none | `9df150bf≠57beb341 / cf61fc94=cf61fc94` — `owner_customized:true`, differ/match = legitimate adaptation (§3 row 3); audit F3 content is an owner-adjudication item, not an upgrade action → Q4/Q5 |
| `DECISIONS.md` | ledger | untouched | unchanged | **KEEP** | none | `7d6d3d9e=7d6d3d9e / ade58761=ade58761` |
| `HANDOFF.md` | doc | untouched | unchanged | **KEEP** | none | `684c9a1e=684c9a1e / 684c9a1e=684c9a1e` — never templated (audit F9, cosmetic, ephemeral scaffold) |
| `.mcp.json` | mcp-config | untouched | unchanged | **KEEP** | none | `727131b4=727131b4 / c4187e9f=c4187e9f` |
| `.cursor/mcp.json` | mcp-config | untouched | unchanged | **KEEP** | none | `d60f1f0a=d60f1f0a / 76decbe5=76decbe5` |
| `.mcp.annotations.md` | mcp-config | untouched | unchanged | **KEEP** | none | `f1543aa2=f1543aa2 / f493c263=f493c263` — audit F5 stale-git line is content, template unmoved (not upgrade-addressable) |
| `.gitignore` | ignore | untouched | n-a | **KEEP** | none | `ce1fece8=ce1fece8 / n-a` — `template:null` (merged-existing) |
| `.cursorignore` | ignore | untouched | unchanged | **KEEP** | none | `8ccefec6=8ccefec6 / be8783b0=be8783b0` |
| `.cursorindexingignore` | ignore | untouched | unchanged | **KEEP** | none | `59335b86=59335b86 / 1f9552ba=1f9552ba` |
| `.claude/settings.json` | mcp-config | untouched | unchanged | **KEEP** | none | `462fb4d5=462fb4d5 / 2ef1a153=2ef1a153` — byte-current with kit template; no new levers |
| `.claude/rules/decision-skills.md` | rule | untouched | n-a | **KEEP** | none | `463ba5f0=463ba5f0 / n-a` — `template:null` analysis-generated router |
| `.cursor/rules/base.mdc` | rule | untouched | unchanged | **KEEP** | none | `3b95da68=3b95da68 / c82ec8cf=c82ec8cf` |
| `.cursor/rules/frontend.mdc` | rule | untouched | unchanged | **KEEP** | none | `db4e314a=db4e314a / f5fabfb0=f5fabfb0` — audit F8 dead sub-glob, cosmetic |
| `.cursor/rules/decision-skills.mdc` | rule | untouched | n-a | **KEEP** | none | `e5a61e21=e5a61e21 / n-a` — `template:null` |
| `.claude/agents/simplifier.md` | agent | untouched | unchanged | **KEEP** | none | `fd66a53b=fd66a53b / 83c00c59=83c00c59` |
| `.claude/agents/reviewer.md` | agent | untouched | unchanged | **KEEP** | none | `0386d6db=0386d6db / 0dab3631=0dab3631` |
| `.claude/agents/verifier.md` | agent | untouched | unchanged | **KEEP** | none | `81744a89=81744a89 / 0bcc3b8b=0bcc3b8b` |
| `.claude/agents/tester.md` | agent | untouched | unchanged | **KEEP** | none | `6e67a24f=6e67a24f / d08a0b32=d08a0b32` |
| `.cursor/agents/reviewer.md` | agent | untouched | unchanged | **KEEP** | none | `e8de4cc8=e8de4cc8 / 56569eac=56569eac` |
| `.cursor/agents/tester.md` | agent | untouched | unchanged | **KEEP** | none | `a31bdf52=a31bdf52 / 47645918=47645918` |
| `.claude/commands/review-pr.md` | command | untouched | unchanged | **KEEP** | none | `4ba96c6b=4ba96c6b / c5b2fcf7=c5b2fcf7` |
| `.claude/commands/deploy.md` | command | untouched | unchanged | **KEEP** | none | `653d9c2a=653d9c2a / 3bf5b2cb=3bf5b2cb` |
| `.claude/commands/discover-mcp.md` | command | untouched | unchanged | **KEEP** | none | `cff92cee=cff92cee / a5eb5d8a=a5eb5d8a` |
| `.claude/commands/security-review.md` | command | untouched | unchanged | **KEEP** | none | `4e78348a=4e78348a / 0ba50d4a=0ba50d4a` |
| `.claude/commands/tech-debt.md` | command | untouched | unchanged | **KEEP** | none | `be7b3599=be7b3599 / 164ae80e=164ae80e` |
| `.claude/commands/workflow-help.md` | command | untouched | unchanged | **KEEP** | none | `7b3c0788=7b3c0788 / 170fb6cf=170fb6cf` — audit F5 stale-git content, template unmoved |
| `.claude/commands/status.md` | command | untouched | unchanged | **KEEP** | none | `4a508226=4a508226 / 1d0d2c6c=1d0d2c6c` — audit F5 stale-git content, template unmoved |
| `.claude/skills/decision/confidence-calibration/SKILL.md` | skill | untouched | unchanged | **KEEP** | none | `bf736f2d=bf736f2d / bf736f2d=bf736f2d` |
| `.claude/skills/decision/reversibility-check/SKILL.md` | skill | untouched | unchanged | **KEEP** | none | `d0639603=d0639603 / d0639603=d0639603` |
| `.cursor/skills/decision/confidence-calibration/SKILL.md` | skill | untouched | unchanged | **KEEP** | none | `bf736f2d=bf736f2d / bf736f2d=bf736f2d` |
| `.cursor/skills/decision/reversibility-check/SKILL.md` | skill | untouched | unchanged | **KEEP** | none | `d0639603=d0639603 / d0639603=d0639603` |
| `.cursor/skills/debug/SKILL.md` | skill | untouched | unchanged | **KEEP** | none | `cb6ae338=cb6ae338 / bf64d77a=bf64d77a` — audit F5 stale-git content, template unmoved |
| `.cursor/skills/deployment/SKILL.md` | skill | untouched | unchanged | **KEEP** | none | `6158bd73=6158bd73 / 1cc77cbb=1cc77cbb` |
| `.claude/commands/report-friction.md` | command | missing | new | **ADD** | add | not in manifest; current kit generates it "Always (all tiers)" per PSP §Phase-3 table → Q8-adjacent, see ADD section |
| `.cursor/skills/report-friction.SKILL.md` | skill | missing | new | **ADD** | add | not in manifest; current kit generates it "if Cursor in scope" (it is) |

---

## Summary counts (§4.3 — MUST equal table row counts)

| Verdict | Count |
|---|---|
| KEEP | **33** (incl. 1 owner-customized: `.claude/rules/base.md`) |
| UPGRADE | **8** |
| ADJUDICATE | **2** |
| KEEP-PROTECTED | **1** |
| ADD | **2** |
| **Total rows** | **46** |

33 + 8 + 2 + 1 + 2 = 46 = 44 manifest entries + 2 ADD rows. All three core classes populated (none empty).

---

## Adjudication questions (§4.4 / §5)

One numbered list, answerable in one message. **Q1–Q2 are bijective with the 2 ADJUDICATE rows** (no ADJUDICATE row lacks a question; no upgrade-conflict question lacks a row). **Q3–Q8 merge the consumed audit's owner-adjudication queue (§2 rule 2) plus the F2/ADD offer (§2 rule 3)** — they are NOT manifest ADJUDICATE rows and are tagged as such. Unanswered rows default to `keep-mine` — silence preserves, never destroys (§5.3).

1. **[ADJUDICATE row — `CLAUDE.md`]** Both sides moved: you hand-edited it (manifest `be123ae5` → disk `17b8c550`, audit F1) and the kit template advanced (`ed09e20c` → `9e6a5cfb`). 3-way baseline = original generation; yours adds project prose + carries the stale "once under git" line (F5) and the `docs/PRACTICE-METRICS.md` ref (F4); kit output = refreshed v0.20.0 context template. Choose: **`keep-mine`** (untouched, manifest re-flagged `owner_customized:true`) · **`take-kit`** (v0.20.0 template replaces it — your customizations are explicitly forfeited) · **`merge`** (I draft a 3-way merge for your review, nothing auto-applied)?
2. **[ADJUDICATE row — `.claude/commands/update-context.md`]** Both sides moved: your added step 8 points at the non-existent `docs/PRACTICE-METRICS.md` (manifest `013bcb14` → disk `6fabb030`, audit F4) and the kit template advanced (`d643ab05` → `121bcb94`). Choose: **`keep-mine`** · **`take-kit`** (forfeits your step 8) · **`merge`** (draft that grafts your step 8 onto the v0.20.0 command, gated on whether Q5 resolves the missing doc)?
3. **[audit queue #1 — `app/fixtures/` in `base.md` (F3)]** Your `base.md` rule says fixtures live in `app/fixtures/` and `SEED_SESSIONS` must never be inline, but the dir doesn't exist and `SEED_SESSIONS` is inline in `app/page.tsx`. Planned refactor, or correct the rule to describe reality? (No upgrade action either way — `base.md` is KEEP/owner-customized.)
4. **[audit queue #2 — CSV export mapping in `base.md` (F3)]** Same block forbids renaming `PracticeSession` fields without updating a CSV export mapping, but no CSV code exists. Feature elsewhere, planned, or drop the line?
5. **[audit queue #3 — `docs/PRACTICE-METRICS.md` (F4)]** Referenced by `CLAUDE.md` and `update-context.md` step 8; `docs/` doesn't exist. Maintained out-of-repo, not-yet-created, or drop the refs? (Your answer conditions the Q1/Q2 merge drafts.)
6. **[audit queue #4 — `git-hygiene` skill parity (F7)]** Owner-added at `.claude/skills/git-hygiene/` with no `.cursor/` twin and a non-numeric `confidence: high`. Confirmed on disk this pass; NOT in the manifest and NOT a kit-generated file, so it is out of the upgrade footprint (§7.4) and untouched. Intentional (Cursor not used for git ops), or mirror + fix the field?
7. **[audit queue #5 — manifest regeneration]** Re-hash/re-flag `.ai-kit-manifest.json` now (mechanical, low-risk) versus letting apply mode reconcile it? Note: apply mode's LAST action already rewrites the manifest (§5), so if you approve any apply this is handled automatically; a standalone regen is only needed if you decline all applies but still want the manifest honest about your 4 customizations (F1).
8. **[ADD-candidate / audit F2 remediation]** The flagship `anti-sycophancy-meta` routes finished-artifact review to `disconfirming-evidence-first`, which is not installed at Starter and has no fallback (F2). **The 3 skill UPGRADEs above do NOT fix this** — the v0.20.0 templates still name `disconfirming-evidence-first`/`inversion` as routing targets with no Starter fallback clause. The clean fix is to graduate the KB-05 pack Starter → Intermediate, which installs `disconfirming-evidence-first` + `inversion` (+`second-order-thinking`) across both IDEs — the exact skills the routing already assumes. Graduate the pack (adds ~6 files, non-destructive), or instead have apply-mode add graceful `council-3-voice`-style fallback clauses to the existing skills? This is a tier decision, not an auto-ADD (current kit keeps Starter at 5 skills).

---

## ADD detail (§3 last verdict row)

**Firm ADDs (2 rows, action `add`, current kit generates for THIS exact profile, absent from manifest — verified absent on disk):**
- `.claude/commands/report-friction.md` — PSP Phase-3 table: *"Always (all tiers — the feedback organ)."* v0.17.0 predates it.
- `.cursor/skills/report-friction.SKILL.md` — PSP: *"If Cursor in scope"* (it is). Cursor twin of the above.

Non-destructive by construction; still applied only on approval.

**Candidates evaluated and NOT auto-added (gate/tier not met — offered, not firm rows):**
- **`security-auditor` agent** (`.claude/agents/` + `.cursor/agents/`) — current kit gates it on *"payments, auth, or handles sensitive data."* Tempo Deck (practice-tempo hobby app, `RESEND_API_KEY` email only, no auth/payments observed) does not meet the gate. Not added; note only.
- **KB-05 Intermediate graduation** (`disconfirming-evidence-first` + `inversion` + `second-order-thinking`, ×2 IDEs) — a tier decision, not same-profile generation (Starter stays 5 skills in v0.20.0). Surfaced as Q8; resolves F2.
- **Vigilance cadence / cross-surface routing / KB-06 managed-agents** — Starter tier explicitly SKIPS these (PSP §Starter); audit §6 rates them low-priority/N-A for a solo Code-only hobby repo. Note only, no action implied. KB-08 design pack was intentionally declined at generation (PHASE9-REPORT §1) — not re-flagged.

---

## Coupling note — protected file vs its Cursor twin (⚠ apply-time decision)

`.claude/rules/quality-gates.md` is **frozen** (KEEP-PROTECTED, old doctrine `2b0023c7`) while its lock-step Cursor twin `.cursor/rules/quality-gates.mdc` is a clean **UPGRADE** (`fe155f20`→`f4b342f0`, new doctrine). The kit's multi-IDE sync mandate requires these twins to move together. **Applying the `.mdc` UPGRADE while the `.md` stays frozen will make the two quality-gate rules diverge in doctrine.** Options for apply time: (a) hold the `.mdc` UPGRADE too, keeping both twins on the frozen doctrine (safest for parity); (b) apply the `.mdc` and accept divergence until you manually fold the new doctrine into the protected `.md`; (c) lift the protection and adjudicate both. Per §3a the plan may only ATTACH this — the decision is yours. Recommended default: **(a) hold**, so a compliance-locked twin is never silently out-of-step with its enforced sibling.

**Audit findings NOT addressable by this upgrade** (content-level defects in owner-untouched files whose kit templates did NOT move — they belong to the audit's fix list, applied outside upgrade mode): F5 stale "no `.git` yet" in `status.md`/`workflow-help.md`/`.cursor/skills/debug/SKILL.md`/`.mcp.annotations.md`; F6 bare-relative doc paths in the 4 unchanged decision skills; F8 dead `app/**/*.ts` sub-glob.

---

## Token-economy delta (§4.5 — all figures ESTIMATE until §5a smoke measurement)

**Method**: always-loaded weight = `CLAUDE.md` + always-on `.claude/rules/*.md` (Claude Code has no per-file conditional load) and `alwaysApply:true` `.mdc` files (Cursor), per the audit's Phase-1 method. Skills/commands/agents load on demand → zero always-loaded impact.

| Surface | Always-loaded now | Post-upgrade projection | Δ (estimate) |
|---|---|---|---|
| Claude Code | 12,245 B ≈ **~3,060 tok** (`CLAUDE.md` 6,245 + `base.md` 2,364 + `quality-gates.md` 1,171 + `decision-skills.md` 2,465) | `quality-gates.md` FROZEN (protected) · `base.md` keep-custom · `decision-skills.md` keep · `CLAUDE.md` = Q1: **keep-mine → unchanged ~3,060 tok**; **take-kit → ~2,750 tok** (new template ~5,000 B substituted) | **0** (keep-mine default) / **~−310 tok** (take-kit, forfeits customizations) |
| Cursor | 2,497 B ≈ **~625 tok** (`base.mdc` 1,526 + `quality-gates.mdc` 971) | `base.mdc` keep · `quality-gates.mdc` UPGRADE 971 B → ~1,800 B substituted | **~+207 tok IF the `.mdc` UPGRADE is applied** — and it desyncs from the frozen protected twin (see coupling note). Hold it → **0**. |
| On-demand | — | 3 decision-skill UPGRADEs + 2 report-friction ADDs | **0 always-loaded** (loaded only when invoked) |

**Settings-level levers (WORKFLOW-CLAUDE-CODE §11.3):** `.claude/settings.json` is byte-current with the v0.20.0 template (KEEP) — this install does **not** predate any template-level lever. The manual levers — thinking cap, autocompact threshold, subagent model, MCP surface ceiling — remain available but unset; **unchanged by this upgrade** (setting them is a separate operator choice, not a kit-propagated change).

Net: the mechanical upgrade is close to **token-neutral** on the always-loaded path. The only always-loaded increase (Cursor `quality-gates.mdc`, ~+207 tok est) is coupled to a protected-twin divergence and is recommended held. Quality is never traded for tokens silently — these estimates are replaced by measured numbers only after a §5a smoke run on approval.

---

## Self-check (§8)

- [x] All three core verdict classes populated (KEEP 33 / UPGRADE 8 / ADJUDICATE 2) — none empty or omitted; plus KEEP-PROTECTED 1, ADD 2.
- [x] Summary counts equal table row counts per verdict (33 + 8 + 2 + 1 + 2 = 46 rows).
- [x] Every ADJUDICATE row has a corresponding numbered question, bijectively: `CLAUDE.md` → Q1, `update-context.md` → Q2. Q3–Q8 are the merged audit queue + F2/ADD offer (§2), explicitly tagged, not manifest ADJUDICATE rows.
- [x] Dry-run write contract: this plan is the only file this pass creates in the repo. (`AI-WORKFLOW-AUDIT-2026-07-12.md` was already untracked at entry — pre-existing, not produced by this pass.)
- [x] Protected path declared in header (`.claude/rules/quality-gates.md`); its verdict is KEEP-PROTECTED and its twin-coupling is surfaced as an attach-only note.

**Nothing was applied. No manifest was touched. Apply runs only after you approve a reviewed plan, and only on a branch.**

---

# Verification results (APPLY pass — 2026-07-12, branch `kit-upgrade-2026-07-12`)

Apply executed on branch `kit-upgrade-2026-07-12` (cut from `master`; default branch untouched) after operator approval + recorded adjudication answers. The pre-upgrade state persists on `master`; **merging the branch is the operator's action, not the agent's** (§5a.4 rollback rail).

## Operator adjudication answers applied

| Q | Answer (verbatim) | Action taken |
|---|---|---|
| Q1 `CLAUDE.md` | **UNANSWERED — declined** | §5.3 default **`keep-mine`**: file untouched; manifest re-flagged `owner_customized:true`. Silence preserves. |
| Q2 `update-context.md` | "merge — draft the 3-way merge; my step 8 must survive" | **`merge`** drafted on-branch: owner spine preserved incl. **step 8 intact** (`docs/PRACTICE-METRICS.md`, kept per Q5); folded in v0.20.0 doctrine (DirectiveForge branding + expanded Quality Reference w/ new *Rules quality* bullet). Lives on the branch for review; not merged to `master`. |
| Q3/Q4 `base.md` | "Planned refactor I haven't done yet — keep my block as-is" | **KEEP** (owner-customized). `app/fixtures/` + CSV-mapping block untouched. |
| Q5 `docs/PRACTICE-METRICS.md` refs | "Not yet created — planned. Keep my references" | References kept in `CLAUDE.md` (keep-mine) and in the `update-context.md` merge step 8. |
| Q6 `git-hygiene` skill | "Intentional — no action: do not touch, do not mirror, do not register" | `.claude/skills/git-hygiene/` **untouched**, no Cursor twin created, not added to manifest. |
| Q7 manifest | "Let apply mode reconcile it, per §5" | Manifest rewritten as the LAST apply action (below). |
| Q8 + all `add` rows | "No new files this pass; no pack graduation; no fallback-clause edits to existing skills" | **ADD rows NOT applied** (`report-friction` command + skill). No KB-05 graduation. No fallback edits to `anti-sycophancy-meta` (the template UPGRADE is a faithful v0.20.0 replacement, adds no fallback). |

## Files touched by the apply (8)

| path | verdict | action taken | owner_customized |
|---|---|---|---|
| `AGENTS.md` | UPGRADE | **content-preserving fold-in** — applied the only content-level v0.20.0 delta ("AI Workflow Kit"→"DirectiveForge Kit" heading + "MCP catalog"→"MCP server catalog"); ALL Tempo Deck analysis content preserved. Raw template substitution was rejected: the manifest `placeholders` map lacks ~30 of the v0.20.0 template's analysis placeholders (`PROJECT_DESCRIPTION`, `LANGUAGE`, `ARCH_POINT_*`, `CONSTRAINT_*`, …), so a mechanical overwrite would leak placeholders AND reintroduce invalid `test`/`migrate`/`seed` command lines the analysis correctly omitted — a net-destructive apply barred by §7.3. `4a973248` | false |
| `.claude/commands/update-context.md` | ADJUDICATE→merge | 3-way merge (Q2), step 8 survives. `ae33dc22` | true |
| `.claude/skills/decision/pre-mortem/SKILL.md` | UPGRADE | direct copy (placeholder-free; owner==old-template baseline). `232de935` | false |
| `.claude/skills/decision/steelman/SKILL.md` | UPGRADE | direct copy. `92c7b705` | false |
| `.claude/skills/decision/anti-sycophancy-meta/SKILL.md` | UPGRADE | direct copy (v0.20.0 template; does NOT add a Starter fallback — faithful to kit). `3b544e50` | false |
| `.cursor/skills/decision/pre-mortem/SKILL.md` | UPGRADE | direct copy. `232de935` | false |
| `.cursor/skills/decision/steelman/SKILL.md` | UPGRADE | direct copy. `92c7b705` | false |
| `.cursor/skills/decision/anti-sycophancy-meta/SKILL.md` | UPGRADE | direct copy. `3b544e50` | false |

## Files deliberately NOT touched

- **`CLAUDE.md`** — keep-mine (Q1 declined, §5.3). Byte-untouched.
- **`.claude/rules/base.md`** — KEEP owner-customized (Q3/Q4). Byte-untouched.
- **`.claude/rules/quality-gates.md`** — KEEP-PROTECTED (§3a). Byte-identical pre/post (verified below).
- **`.cursor/rules/quality-gates.mdc`** — UPGRADE **HELD** per the coupling note's recommended default **(a)**: applying it would desync the quality-gate doctrine from its frozen protected twin `.claude/rules/quality-gates.md`. The operator declared the twin protected and gave no override authorizing divergence → held. The pending upgrade stays visible to future passes (manifest `template_sha256` left at the pre-move value `fe155f20`).
- **`.claude/skills/git-hygiene/SKILL.md`** — Q6 (do not touch/mirror/register).
- **`report-friction` command + skill** — Q8 (no new files this pass).
- All other 31 KEEP rows — byte-current on both sides; no change.

## §5a gate results

1. **Static verification** (`harness/layer1/static-checks.md`, target type = generated install tree): all **8 touched files PASS** (skills S1–S6 incl. placeholder hygiene; `update-context.md` C1 numbered-step sequence; no placeholder leaks anywhere in the tree). Tree-level: T1 ide-scope purity PASS, T3 checkpoint-clean PASS, T2 N/A (no `docs/AI-WORKFLOW-BRIEF.md` — v0.17.0 install predates Phase 1.7; not upgrade-introduced). **3 pre-existing FAILs in UNTOUCHED KEEP files** — `.cursor/skills/debug/SKILL.md` + `.cursor/skills/deployment/SKILL.md` (S1/S2/S3: Cursor skill format lacks the Claude-skill frontmatter the S-family expects) and `.claude/commands/workflow-help.md` (C1 numbering). These are **not upgrade-introduced** (git shows they were never modified) and are **not fixed** — the apply instruction forbids touching KEEP-verdict files; they belong to the consumed audit's own fix list (plan §"Audit findings NOT addressable by this upgrade"). **Zero static regressions introduced by the apply.**
2. **Protected-path byte-identity** (`.claude/rules/quality-gates.md`): SHA-256 **pre = post = `2b0023c783421e56121a13980007d344e680d40c5a6fa0b4f7ac5af8eb3274ab`** → MATCH. No §3a abort.
3. **Smoke set** (doc-level, mechanical): **(a)** every command named in `CLAUDE.md` + `base.md` (`npm run dev`/`build`/`lint`, `npx tsc --noEmit`) resolves to a `package.json` script or the sanctioned typecheck — PASS; **(b)** `.mcp.json` / `.claude/settings.json` / `.cursor/mcp.json` strict-parse — PASS; **(c)** every path referenced by `.claude/rules/decision-skills.md` (5 local decision skills + 3 kit-absolute docs) resolves on disk — PASS.

## Token-economy — measured (replaces §4.5 estimates)

Always-loaded weight is **unchanged** by this apply: `CLAUDE.md` keep-mine, `base.md` keep, `.claude/rules/quality-gates.md` frozen (protected), `.claude/rules/decision-skills.md` keep. The Cursor `quality-gates.mdc` UPGRADE was **held**, so its projected **+207 tok** always-loaded increase did **not** land. The 6 skill UPGRADEs + 1 merge are all on-demand/command surfaces → **0 always-loaded delta**. Net: token-neutral on the always-loaded path, confirming the plan's keep-mine-default estimate.

## Manifest reconciliation (LAST apply action, §5/§7.5)

`.ai-kit-manifest.json` rewritten as the final write: top-level `kit_version` 0.17.0→0.20.0; 8 touched files got new `sha256` + `template_sha256` + `kit_version:0.20.0` (`update-context.md` also `owner_customized:true` for the merge outcome); `CLAUDE.md` reconciled to disk `sha256` + `template_sha256`→`9e6a5cfb` + `owner_customized:true` (keep-mine, prevents a future pass from auto-clobbering the declined file); `base.md` reconciled to disk `sha256` + `owner_customized:true`; `.claude/rules/quality-gates.md` marked `protected:true` with `template_sha256` LEFT at the pre-move `6db38ca9` so newer kit doctrine stays visible for manual fold-in (§3a); held `.cursor/rules/quality-gates.mdc` left at pre-move `template_sha256` so its upgrade re-surfaces next pass. Files list stays at 44 entries (no ADDs, no git-hygiene registration).

**Branch `kit-upgrade-2026-07-12` is ready for the operator's review. `master` is unchanged. Merge at your discretion.**
