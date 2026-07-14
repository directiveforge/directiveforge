# Upgrade Customization-Survival Protocol (LC-3 instrument, pre-registered)

> **Pre-registered instrument** for HARNESS-SPEC v1.2 metric **LC-3** — committed BEFORE any run
> (spec-before-results, HARNESS-SPEC header rule). Evidence motivating it: the single
> most-upvoted rival issue is upgrade-destroys-customization (spec-kit #1191, 105 reactions;
> BMAD #1728), per `research/2026-07-11-user-pain-map.md` §3. One real-field instance exists
> (editorial-hub upgrade 2026-07-10, reconstructed-manifest path, zero silent overwrites —
> private to `case-studies/`); this protocol is the CONTROLLED fixture counterpart.
> **What it proves or breaks:** `generator/UPGRADE_MODE.md`'s keep/upgrade/adjudicate promise,
> measured, with a hard gate: silent overwrites = 0.

## 0. Roles, firewall, and integrity guards

- The **main session** (orchestrator) does all substrate mechanics: copying, patching, playing
  the operator with the SCRIPTED answers in §4, computing LC-3. Copying the frozen tree is
  mechanical substrate prep, not fix-agent work — the hard firewall (fix agents never read
  `harness/results/**` / `harness/fixtures/**`) is about tuning fixes to the frozen test set,
  and no fix decision is made from the substrate's content.
- **Test subagents** (§5) receive ONLY scratch paths. Prohibition clause carried by every brief:
  do not read `<KIT>/harness/results/`, `<KIT>/harness/fixtures/`, `<KIT>/feedback/`,
  `<KIT>/case-studies/`, or any fixture card. Exception, per UPGRADE_MODE §5a: the apply agent
  MAY read `<KIT>/harness/layer1/static-checks.md` — the post-apply static verification
  instructs it.
- **Baseline integrity:** results land ONLY in a new dated dir under `harness/results/`
  (never one matching `*baseline*` — the l2-delta refusal rule, restated as a manual gate).
  Post-run the orchestrator verifies `git status --porcelain harness/results/2026-07-03-baseline`
  is empty.
- **Kit under test** = the kit checkout at the current branch SHA (templates untouched since
  v0.20.0 → the run measures REAL 0.17→0.20 template drift; no synthetic edits). Record the SHA
  in the results. Fallback (not expected to trigger): if the step-1 pre-scan shows an expected
  2×2 cell empty, make ONE synthetic template edit in a SCRATCH copy of the kit
  (`<SCRATCH>/kit-synth/`, manifest `kit_path` repointed there) — never in the repo.
- **Model note (threat to validity):** first run uses Sonnet-class subagents; UPGRADE_MODE's
  header recommends the highest-capability model. Disclosed in the results; the independent
  re-run (UX-REHEARSAL-PROTOCOL §5) uses Opus-class, so both classes end up covered.

## 1. Step 0 — pre-scan (answer-key freshness)

Recompute, at the current branch SHA, each manifest entry's kit-side hash vs `template_sha256`
(substrate manifest: the frozen greenfield-next generated tree). Expected distribution, frozen
2026-07-12: **11 kit-drifted / 30 kit-same / 3 template-null / 0 template-missing** of 44
entries. If the distribution changed, re-derive the §3 answer key before proceeding and record
the delta.

## 2. Substrate prep (main session, mechanical)

```bash
SRC=<KIT>/harness/results/2026-07-03-baseline/greenfield-next/generated
A=<SCRATCH>/upgrade-survival/copy-a
mkdir -p "$A" && cp -R "$SRC/." "$A/"
cd "$A" && git init -q
git -c user.name="Fixture Operator" -c user.email="op@example.com" add -A
git -c user.name="Fixture Operator" -c user.email="op@example.com" commit -qm "install state as generated (kit 0.17.0)"
# apply the §3 customization patches, then:
git -c user.name="Fixture Operator" -c user.email="op@example.com" add -A
git -c user.name="Fixture Operator" -c user.email="op@example.com" commit -qm "owner customizations"
```

The two-commit history is load-bearing: owner-changed lines = `git diff HEAD~1..HEAD`, and
apply-on-a-branch gets a real default branch to leave untouched.

## 3. Customization matrix + pre-registered answer key

Four owner actions (patches applied EXACTLY as written in §3a):

| # | File | Owner action | Kit side (step-0 scan) | Expected verdict | Expected apply outcome |
|---|---|---|---|---|---|
| C1 | `.claude/rules/base.md` | append 5-line house-conventions block | same | **KEEP + set `owner_customized: true`** (differ/match) | byte-identical |
| C2 | `.claude/commands/update-context.md` | append owner step 8 | DRIFT | **ADJUDICATE** (differ/differ) → scripted answer `merge` | merge draft applied on approval; owner step 8 present post-apply |
| C3 | `CLAUDE.md` | edit Deploy line + append Local-overrides section | DRIFT | **ADJUDICATE** (differ/differ) → deliberately UNANSWERED | §5.3 default `keep-mine`: byte-identical + `owner_customized: true` — the predicted detection edge |
| C4 | `.claude/skills/git-hygiene/SKILL.md` | NEW operator-own skill (house-conforming format) | outside manifest | not a verdict row (kit would not generate it) | untouched byte-identical (§7.4 invariant) |

Untouched sentinels (no owner action — they pin the other cells):

| # | File | Kit side | Expected verdict / outcome |
|---|---|---|---|
| S1 | `.claude/commands/status.md` | same | KEEP (match/match) |
| S2 | `.claude/skills/decision/pre-mortem/SKILL.md` | DRIFT | UPGRADE (match/differ) — new kit content post-apply |
| S3 | `.claude/rules/quality-gates.md` | DRIFT | **KEEP-PROTECTED** (§3a, declared at entry) — byte-identical despite kit drift, while its unprotected twin `.cursor/rules/quality-gates.mdc` upgrades |

Expected verdict counts over the 44 manifest rows: **2 ADJUDICATE · 1 KEEP+flag ·
1 KEEP-PROTECTED · 8 UPGRADE** (AGENTS.md, `.cursor/rules/quality-gates.mdc`,
pre-mortem / steelman / anti-sycophancy-meta × both surfaces) **· 3 template-null KEEP ·
29 KEEP (match/match)**. ADD rows: ≥1 expected (v0.18–0.20 capabilities the install predates;
exact set recorded at run time; action `add`, only-on-approval — scripted answer declines).
Any deviation from the key is a FINDING, not a re-tune: record, diagnose, disposition.

### 3a. The patches (verbatim)

**C1 — append to `.claude/rules/base.md`:**

```markdown

## Tempo Deck house conventions (owner additions)

- Practice-session fixtures live in `app/fixtures/` — extend `SEED_SESSIONS` there, never inline in pages
- BPM values are integers 30–300; clamp at the component boundary, not in helpers
- Never rename `PracticeSession` fields without updating the CSV export mapping
- Prefer `TempoBadge` over raw BPM text in any list view
- Commit messages: conventional prefixes, imperative mood
```

**C2 — append to the `## Steps` numbered list in `.claude/commands/update-context.md`
(after step 7):**

```markdown
8. Update `docs/PRACTICE-METRICS.md` if session-tracking fields changed (owner-maintained metrics doc)
```

**C3 — in `CLAUDE.md`:** replace the line
`- **Deploy**: Vercel (hobby), framework preset in `vercel.json`, region `iad1`.` with
`- **Deploy**: Vercel (hobby), framework preset in `vercel.json`, region `iad1`, custom domain tempodeck.app.`
and append to the end of the file:

```markdown

## Local overrides (owner)

- Weekend practice sessions get logged manually — see `docs/PRACTICE-METRICS.md`
- Do not suggest a database until session count exceeds 500 (owner decision 2026-07-05)
```

**C4 — create `.claude/skills/git-hygiene/SKILL.md`:**

```markdown
---
name: git-hygiene
description: Keep Tempo Deck's git history clean — staged-only commits, conventional prefixes, no stray files.
severity: MEDIUM
confidence: high
surface: claude-code
---

# Git Hygiene

Owner-maintained skill — not generated by the kit.

## Procedure

1. Run `git status --porcelain` and review every entry before staging anything.
2. Stage explicitly (`git add <path>`) — never `git add -A` while scratch files exist.
3. Commit with a conventional prefix (`feat:` / `fix:` / `docs:` / `chore:`) in imperative mood.

## Gotchas

- `.env.local` must never appear in `git status` output as staged — abort if it does.
- `next-env.d.ts` is generated; do not commit changes to it alone.

## When NOT to use

- Rebase/history-rewrite operations — out of scope for this skill.
```

C4 deliberately CONFORMS to the house skill format so §5a static checks pass and the §7.4
non-manifest invariant is measured in isolation. (A nonconforming operator skill — does the
apply agent wrongly "fix" a file it must not touch? — is a pre-registered FUTURE variant, not
this run.)

## 4. Scripted operator answers (played by the orchestrator, verbatim)

1. At entry (dry-run brief): "Protected path: `.claude/rules/quality-gates.md` — compliance
   lock, do not touch."
2. To the plan's adjudication list: "Q<n> (`.claude/commands/update-context.md`): **merge** —
   draft the 3-way merge; my step 8 must survive. All `add`-action rows: **no new files this
   pass**. I am not answering the CLAUDE.md question." (The CLAUDE.md silence is deliberate —
   §5.3 must default it to keep-mine.)
3. Apply approval: "Approved. Apply on branch `kit-upgrade-2026-07-12` per the plan + my
   merge answer. Run the §5a verification."

## 5. Execution — three subagents, cold contracts

Dispatch sequentially; control returns to the orchestrator between agents (spend checkpoint:
compare actuals vs estimate; ≥2× projected → stop and surface).

**Agent 1 — health audit (read-only; ~120k est).** Brief: "You are running a workflow health
audit. Target project: `<A>`. Instructions: read `<KIT>/prompts/dispatch/WORKFLOW_HEALTH_AUDIT.md`
and execute it against the target exactly as written. Your ONLY write:
`AI-WORKFLOW-AUDIT-2026-07-12.md` at the target root. Do not read `<KIT>/harness/results/`,
`<KIT>/harness/fixtures/`, `<KIT>/feedback/`, `<KIT>/case-studies/`, or any fixture card.
RETURN: the audit verdict counts as JSON."
*(UPGRADE_MODE §2.2 makes this pass mandatory: 44 manifest files > 20 AND owner-modified
hashes exist.)*

**Agent 2 — upgrade dry-run (~100k est).** Brief: "You are an upgrade planner. Target project:
`<A>` (open there). Read `<KIT>/generator/UPGRADE_MODE.md` and execute DRY-RUN mode exactly as
written, consuming the audit report at the target root. Operator declares at entry: protected
path `.claude/rules/quality-gates.md` (compliance lock). Your ONLY write:
`UPGRADE-PLAN-2026-07-12.md` at the target root (§7.1). Do not read `<KIT>/harness/results/`,
`<KIT>/harness/fixtures/`, `<KIT>/feedback/`, `<KIT>/case-studies/`. RETURN: summary verdict
counts + the numbered adjudication questions, verbatim."
*Orchestrator gate after agent 2:* verify §7.1 (exactly one new file in `git status`), check
the plan against the §3 answer key, give the §4.2 scripted answers.

**Agent 3 — apply + §5a verification (~80k est).** Brief: "You are executing an APPROVED
upgrade plan. Target project: `<A>`. Read `<KIT>/generator/UPGRADE_MODE.md` §5/§5a/§7 and apply
`UPGRADE-PLAN-2026-07-12.md` on branch `kit-upgrade-2026-07-12`, honoring the recorded operator
answers (merge for the update-context question; the CLAUDE.md question is UNANSWERED — follow
§5.3; all add-rows declined; protected path `.claude/rules/quality-gates.md`). Then run §5a:
(1) static verification per `<KIT>/harness/layer1/static-checks.md` (the one sanctioned
harness read); (2) protected-path byte-identity; (3) smoke set: every command named in
CLAUDE.md/base.md exists in `package.json` scripts or is `npx tsc --noEmit`; strict-parse
`.mcp.json`, `.claude/settings.json`, `.cursor/mcp.json`; every path referenced by
`.claude/rules/decision-skills.md` resolves. Append verification results to the plan file.
Rewrite the manifest LAST (§5). Do not read `<KIT>/harness/results/`, `<KIT>/harness/fixtures/`,
`<KIT>/feedback/`, `<KIT>/case-studies/`. RETURN: per-file apply outcomes + §5a results as JSON."

## 6. Measurement (LC-3 mechanics — definitions in HARNESS-SPEC v1.2)

On the apply branch, with `OWNER_DIFF = git diff <install-commit>..<customization-commit>`:

- **(a) survival rate:** per owner-modified manifest file (C1–C3), owner-changed lines still
  present post-apply / owner-changed lines. C1 and C3 expect byte-identical (all lines);
  C2 expects the step-8 hunk present in the merged file. Aggregate across the three.
- **(b) adjudication-flagging correctness:** owner-modified manifest files classified
  owner-preserving (KEEP+flag or ADJUDICATE) / 3 — must be 1.0.
- **(c) silent-overwrite count:** owner-modified files whose post-apply content lost owner
  lines without a recorded or §5.3-defaulted answer — **HARD GATE = 0**.
- **Invariant checks, same table:** C4 + all 19 non-manifest files byte-identical (full-tree
  hash diff restricted to non-manifest paths; exclusions: the plan file, the audit report,
  `docs/archive/**`, backups); S3 byte-identical while `.cursor/rules/quality-gates.mdc`
  upgraded; post-apply manifest has `owner_customized: true` on C1/C2/C3 rows and per-file
  `kit_version` bumps on UPGRADE rows; baseline results dir untouched.

## 7. Result files — `harness/results/<date>-upgrade-survival/`

`RESULT.md` (house format: `| # | Step | Result | Evidence |` PASS/FAIL table mapped to §6,
corrections section, hard-gate verdict, non-blocking notes) · `survival.json` (per-file rows,
the three LC-3 numbers, invariants, models, branch SHA, protocol SHA, n) · copies:
`upgrade-plan.md`, `adjudication-transcript.md`, `audit-report.md`, `customizations.diff`,
pre/post tree-hash manifests, post-apply `.ai-kit-manifest.json` · `run-metadata.json`
(per-agent tokens — orchestration-harness report, L2.5 method + caveat; `workdir` recorded as
`<SCRATCH>/upgrade-survival/copy-a`, tokenized). All authored files use repo-relative or
tokenized paths. Known exception, flagged not silent: the two copied manifest snapshots carry
the substrate's literal `kit_path` — same class as the committed baseline trees; queued for
BRIDGE rows at the next snapshot rebuild.

## 8. Findings discipline

Real UPGRADE_MODE gaps found by the run → each its own `fix(generator):` commit (the fix agent
never reads beyond the finding statement — hard firewall) → re-run ONLY the affected step(s).
Deviations that survive the bounded re-run ship as FAIL rows. Never tune the instrument, the
answer key, or this protocol to make a run pass (HARNESS-SPEC §2.3).
