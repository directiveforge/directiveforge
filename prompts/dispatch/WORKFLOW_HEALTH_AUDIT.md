# Dispatch — AI-Workflow Health Audit (read-only forensic pass on an existing install)

> **Primary surface:** Claude Code session opened in the target repo (filesystem + subagent spawning). **Model: the highest-capability model available** (long-horizon, large-context work — this is exactly its profile). Cowork with the target folder mounted is an acceptable alternative.
> **Role:** forensic auditor. **Zero writes** to the existing workflow — the ONLY file you create is the report. You do not fix anything, however tempting. Findings, not patches.
> **Output:** `<REPO>/AI-WORKFLOW-AUDIT-YYYY-MM-DD.md` (single new file at the target repo root) + a 10-line chat summary.
> **Consumer:** the operator decides what to fix; the follow-up upgrade pass is `generator/UPGRADE_MODE.md` — it consumes this report (≤90 days old) and applies approved items on a branch.
> **When to run:** on any long-lived AI workflow (CLAUDE.md + rules + skills + KB + agents) that has grown over weeks/months without a systematic review — especially before applying any upgrade or generator pass on top of it. **Recommended cadence: quarterly, plus after any repo restructure/rename** (field calibration 2026-06-10: ~2.5 months of drift ≈ one 3-hour fix session).

## Why this exists

Long-lived AI workflows degrade silently along predictable axes: world facts go stale (models, prices, URLs, command names), contradictions creep in between files written months apart, references die as files move, auto-loaded context bloats until it taxes every session, and security hygiene drifts. The owner can no longer see the whole because they built it incrementally. An audit must therefore prove *coverage*, not just produce impressions.

## Phase 0 — Census & coverage ledger (the honesty backbone)

1. Full inventory: every file in the repo (`find` — path, bytes, last-modified). Group by zone (context files / rules / skills / commands / agents / KB / configs / docs / other).
2. Open a **coverage ledger** keyed by file path. By the end of the audit every file must carry a disposition: **READ-FULL / SKIMMED / SKIPPED + reason**. The ledger ships inside the report. "Understood absolutely everything" is only claimable because unexamined files are *listed*, not hidden.
3. Budget honesty: if the repo exceeds what one pass can deep-read, deep-read the load-bearing zones (Phase 1) fully, skim the rest, and say so — a partial audit with an honest ledger beats a shallow "complete" one.

## Phase 1 — Load-bearing map

Before judging content, map *what actually reaches an agent's context and when*:

- **Always-loaded:** CLAUDE.md (and equivalents), always-on rules, hooks. Estimate their combined token weight — this is the per-session tax every conversation pays.
- **Conditionally loaded:** skills (trigger descriptions), commands, agent definitions, glob-scoped rules.
- **Reference-only:** KB documents an agent reads on direction.
- **Orphans:** files referenced by nothing and loaded by nothing. List as archive candidates — orphaned guidance silently diverges from live guidance.

## Phase 1b — Purpose & liveness reconstruction (understand before judging)

Nothing may be called obsolete mechanically. For **every artifact** (each KB doc, rule, skill, command, agent, config), reconstruct and record:

1. **Original intent** — what was this FOR when written? Evidence: its own header/preamble, content, `git log --follow` commit messages, what references it and in what role. Write one sentence of reconstructed purpose per artifact. If you cannot reconstruct the purpose from evidence — that is a finding of class UNKNOWN, not a license to guess.
2. **Liveness triangulation** — referenced ≠ alive. Cross three signals: (a) *inbound references* (who points at it); (b) *git history* (last meaningful content change, not formatting); (c) *content self-dating* (facts inside it date themselves — model names, URLs, project phases long completed). A KB referenced by CLAUDE.md but untouched for months with self-dated stale content is a **ZOMBIE**: the reference manufactures false liveness and silently feeds agents dead doctrine.
3. **Verdict per artifact**, exactly one of:
   - **ALIVE** — purpose current, content current.
   - **DEGRADED** — purpose current, content partially stale (lens findings attached).
   - **SUPERSEDED-BY-X** — purpose now served by a named other artifact; this one should be archived and its inbound references repointed.
   - **EXPIRED** — purpose itself is gone (project phase ended, decision long locked); archive candidate.
   - **ZOMBIE** — dead content kept "alive" by inbound references; every such inbound reference is itself a defect (log under lens 3).
   - **UNKNOWN** — evidence insufficient; goes to the owner adjudication queue, never silently to the archive list.
4. **Owner adjudication queue** — a dedicated report section of questions only the owner can answer ("KB-X reads as superseded by Y — confirm?", "Rule Z references a process I see no trace of — still real?"). The audit's intelligence ceiling is honesty about where reconstruction ends; deliberate beats confident-wrong.

## Phase 2 — Eight audit lenses

Run each lens over the relevant zones. Every finding: **file:line + severity + verbatim evidence quote + fix-class (one-liner / paragraph / restructure)**. Severity: 🚨 actively harmful or wrong now · ⚠ degrades agent quality · 🟡 debt, will bite later · 🟢 cosmetic.

1. **Staleness.** Model names/pins, pricing, context-window claims, product facts, URLs, CLI commands, API parameters — check against current reality (verify via web fetch/search when uncertain; never assume training knowledge is current). Date-stamped claims older than ~2 months are suspects by default.
2. **Internal contradictions.** Rule-vs-rule, CLAUDE.md-vs-rules, skill-vs-skill. Duplicated sources of truth (two ledgers, two conventions for the same thing, conflicting tone/format directives). For every suspected contradiction, quote BOTH sides.
3. **Dead references.** Links to files/sections that don't exist, skills invoking removed scripts, cross-refs pointing at renamed headings, paths that moved. **Includes dead scoping:** any rule whose `globs:`/`paths:` frontmatter matches zero files in the current tree is a rule that never fires — test every glob mechanically against the filesystem (repos restructure; rules die silently). Each zero-match glob is a finding, minimum ⚠.
4. **Redundancy & context economics.** Guidance duplicated across files; rules restating defaults the model already follows; always-loaded content with low instruction-per-token value. Bloat is not cosmetic — it dilutes every instruction around it.
5. **Instruction-quality erosion.** Patterns that fight current model behavior (e.g., chain-of-thought scaffolding for reasoning models, obsolete tool-use idioms), over-constraint that forces violations, instructions written for a weaker model generation.
6. **Security & hygiene.** Secrets or tokens in tracked files; ignore-file coverage (.gitignore/.cursorignore-class); MCP server configs vs the 2026 advisory wave (wrapper-parameter injection, env-var interpolation); CI agent actions without version floors; credentials referenced in plain text.
7. **Process integrity.** Decision-ledger discipline (append-only? single ledger? entries still numbered correctly?), handoff/memory files that describe a state months gone, scheduled/automation prompts pointing at moved files.
8. **Capability gaps vs the current kit** (read `~/Projects/AI` live for what now exists: decision skills, surface routing, model-class routing, fallback-chain guidance, vigilance cadence, KB-06 agent-org layer). Mark these **UPGRADE-CANDIDATE**, strictly separated from defects — absence of a new capability is not degradation.

## Phase 3 — Independent adversarial verification

Spawn a separate verification subagent with a hostile brief: re-derive the **top 10 findings** from the files themselves (fresh reads, not your notes). Rules learned the hard way: a "falsified/contradiction" verdict must re-read the *original cited source* of the claim, not just one contradicting file; for staleness findings the verifier re-checks the world fact independently. Findings that don't survive are dropped or downgraded — record the delta in the report.

## Phase 4 — The report

Single file `AI-WORKFLOW-AUDIT-YYYY-MM-DD.md` at the target repo root:

1. **Executive summary** — health grade per lens (A–F) + the 3 sentences the owner must read.
2. **Purpose & liveness table** — every artifact: reconstructed purpose (one sentence) + verdict (ALIVE / DEGRADED / SUPERSEDED-BY-X / EXPIRED / ZOMBIE / UNKNOWN) + key evidence. This table IS the "full understanding" deliverable.
3. **Owner adjudication queue** — the UNKNOWN/confirm questions; numbered so the owner can answer in one message.
4. **Findings by severity** — 🚨 first; each with file:line, evidence quote, fix-class. No finding without evidence.
5. **Top-10 fixes ranked by impact ÷ effort** — what one focused session should do first.
6. **Upgrade-candidates table** — kit capabilities worth adopting, each with where-it-would-live and expected benefit. Separate from defects.
7. **Coverage ledger** — full disposition list + combined always-loaded token estimate.
8. **Not examined** — explicit list with reasons (empty if coverage was total).
9. **Verification delta** — what the adversarial pass killed or downgraded.

## Discipline

- **Read-only contract:** the report is your only write. If you catch yourself editing a workflow file — stop; that is the follow-up session's job, post-review.
- **Understanding-first rule:** no artifact may be tagged SUPERSEDED/EXPIRED/archive-candidate without (a) a stated reconstruction of its original purpose and (b) cited evidence of its current state. Thin evidence → UNKNOWN + adjudication question. Confident-wrong classifications poison the follow-up cleanup; deliberate uncertainty does not.
- **Evidence over vibes:** "feels bloated" is not a finding; "CLAUDE.md lines 40–95 duplicate rules/style.md lines 3–60, ~1,400 always-loaded tokens" is.
- **Verify-before-cite** for every world-fact claim (models, prices, URLs, CVEs).
- **No project-specific content flows back into the kit** from this audit; the report lives in the target repo. If a finding reveals a *generalizable* kit lesson, note it in the chat summary for the operator to route via `feedback/` (abstracted).
