# Upgrade Mode — kit-aware project upgrade planner

> **Primary surface:** Claude Code session opened at the target project root, with the kit path known — read it from the manifest's `kit_path` field; if the manifest is absent, the operator supplies it. `<KIT>` below means that path. **Model: the highest-capability model available** — the hash forensics are mechanical, but 3-way adjudication summaries are synthesis work, and a confident-wrong merge draft costs more than the whole pass.
> **Role:** upgrade planner. **Default mode is DRY-RUN.** The ONLY write a dry-run produces is the plan file — you diff, you classify, you ask. You do not apply anything, however obvious the fix looks.
> **Output:** `<REPO>/AI-KIT-UPGRADE-PLAN-YYYY-MM-DD.md` (single new file at the target repo root) + a short chat summary. Same single-file write contract as the health audit.
> **Apply mode:** runs ONLY after explicit operator approval of a reviewed plan, and always on a branch — never on the default branch, never in the same breath as the dry-run that produced the plan.
> **Contract:** the install manifest `.ai-kit-manifest.json` (written by `generator/PROJECT_SETUP_PROMPT.md` Phase 8.5 since kit v0.17.0) is the ground truth this mode executes against. No manifest → §6 first.
> **When to run:** after any kit release the operator wants propagated to an install, or whenever an install's `generated_date` lags the current kit by a version or more.

## Why this exists

Fixing the kit does not heal installs (field-confirmed, first health-audit run — the lab's first health-audit field report (private)). Every improvement lands in the kit repo and stops there: projects generated from earlier kit versions keep running yesterday's doctrine until someone re-propagates it. And the naive re-propagation — "just re-run the generator" — is worse than the disease, because it tramples owner customizations, which are legitimate local adaptations, not defects.

The manifest closes this gap. It records per-file provenance — what the generator wrote, from which kit template, at which content hash — so drift becomes *attributable*: the owner moved, the kit moved, or both. Upgrade Mode turns that attribution into a per-file verdict, a reviewable plan, and (only on approval) a branch-isolated apply. The mode's entire value is that it never has to guess who changed what.

## §1 — Entry conditions & routing

Three-way routing, checked in order at the target project root:

- **(a) `.ai-kit-manifest.json` present** → manifest-backed install. Proceed to §2 (audit-first), then §3 (diff engine). Sanity-check the manifest before trusting it: `manifest_version` recognized, `kit_path` resolves to a real kit checkout, `files` non-empty. A manifest that fails these checks is treated as absent → route (b).
- **(b) Manifest absent, but kit-shaped artifacts present** — any of the generator's Phase 0.2 inventory: `CLAUDE.md`, `AGENTS.md`, `DECISIONS.md`, `HANDOFF.md`, `.cursor/rules/`, `.cursor/skills/`, `.cursor/agents/`, `.claude/rules/`, `.claude/commands/`, `.claude/skills/`, `.claude/agents/`, `.mcp.json`, `.cursor/mcp.json` → a pre-v0.17.0 install. Run §6 (manifest reconstruction) FIRST, then continue with its hard-conservative rules in force for the rest of the pass.
- **(c) No kit artifacts at all** → this is not an upgrade; it is a fresh install. Stop and route the operator to `generator/PROJECT_SETUP_PROMPT.md`. Do not improvise a hybrid — an upgrade pass over nothing produces a worse install than the generator does.

## §2 — Audit-first convergence

The lock: **audit first, upgrade second.** An upgrade is an act of trust in the install's current state; the audit is what earns that trust. Upgrading an unexamined install propagates new kit doctrine on top of undetected rot.

Resolve the audit requirement in this order:

1. **Fresh audit exists:** an `AI-WORKFLOW-AUDIT-*.md` report at the repo root ≤90 days old (the audit's own quarterly cadence) → consume it; do not re-audit.
2. **Non-trivial install, no fresh audit:** if the manifest lists more than 20 files, OR a quick pre-scan detects any owner-modified hashes, OR `generated_date` is older than 3 months — run `prompts/dispatch/WORKFLOW_HEALTH_AUDIT.md` as a separate pass (subagent or separate session) BEFORE planning. Do not fold a full audit into the upgrade session: the audit's read-only contract and this mode's write contract must not share session state.
3. **Small, unmodified, recent install:** an inline mini-audit is permitted — lenses 1–3 only (staleness, internal contradictions, dead references), scoped strictly to manifest-listed files. Anything the mini-audit cannot cover is out of its scope by construction, not silently assumed healthy.

**Consumption rules** for whichever audit you have:

1. Artifacts the audit verdicts **ZOMBIE**, **SUPERSEDED-BY-X**, or **EXPIRED** are NEVER auto-upgraded — upgrading dead doctrine reanimates it. Each goes to the plan's ADJUDICATE section with the audit verdict attached, so the owner decides archive-vs-revive with full context instead of receiving a freshly re-polished corpse.
2. The audit's **owner adjudication queue** merges into the plan's adjudication section — one numbered list, one owner reply covers both.
3. Audit lens-8 **UPGRADE-CANDIDATE** items feed the ADD list (§3, last verdict row): capabilities the current kit would generate that this install predates.

## §3 — Diff engine — the 2×2

For every manifest `files` entry, recompute both sides. Exact bytes, no normalization, no "helpful" cleanup before hashing:

- **Owner side:** hash the file as it exists now — `shasum -a 256 <path> | awk '{print $1}'` — and compare against the manifest's `sha256`.
- **Kit side:** for every entry with a non-null `template`, hash the current kit source file at `<KIT>/<template>` the same way and compare against the manifest's `template_sha256`. Template-vs-template is the correct comparison — both hashes are of the placeholder-bearing kit source, so substituted project values never pollute the kit-side signal.
- **ADD detection:** derive what the *current* kit would generate for this install — from the manifest's `maturity_tier`, `ide_scope`, `presets`, and `packs` — and list generated-file paths absent from the manifest.

Verdict table:

| Owner side (file vs manifest `sha256`) | Kit side (current kit source vs `template_sha256`) | Verdict |
|---|---|---|
| match | match | **KEEP** — current on both sides |
| match | differ | **UPGRADE** — safe: the owner never touched it and the kit moved |
| differ | match | **KEEP** + set `owner_customized: true` — customization is legitimate adaptation, not a defect (mirror the audit's stance) |
| differ | differ | **ADJUDICATE** — both sides moved; 3-way merge territory (§5) |
| file missing | any | **ADJUDICATE** — the owner may have removed it deliberately; offer reinstall, never assume |
| `template: null` | n/a | **KEEP** unless the audit flagged it — analysis-generated files (CLAUDE.md prose, DECISIONS.md, HANDOFF.md) are never auto-touched |
| not in manifest, current kit would generate it | n/a | **UPGRADE** row with action `add` — new capability; non-destructive by construction; still applied only on approval |

**False-positive note:** line-ending or trailing-newline drift (editor autosave, git `autocrlf`) can make an untouched file hash as "owner-modified." This degrades *safely* — the worst case is a spurious ADJUDICATE, which costs the owner one question and never loses a customization. When you suspect it (whitespace-only `git diff` against a regenerated baseline is the tell), say so in the plan row's evidence — but do not normalize before hashing. The conservative direction is the contract.

## §3a — Protected paths (operator-declared compliance locks)

The operator may declare **protected paths** at entry (and apply mode records them in the manifest as `protected: true`): files carrying compliance or business locks — platform-policy rules, legal citation formats, launch gates, regulatory constraints. Protected files are quarantined from the entire pass: their verdict is always **KEEP-PROTECTED** regardless of the 2×2; no merge drafts, no upgrade suggestions — the plan may only ATTACH a note that newer kit doctrine exists for the owner to fold in manually if they choose. Apply mode verifies post-apply that every protected file is **byte-identical** (pre-hash = post-hash); any mismatch aborts the apply and reverts the branch. Rationale: a compliance rule silently weakened by an upgrade is the worst failure class this mode can produce — strictly worse than any staleness it could fix. If no protected paths are declared, the plan's header must state "protected paths: none declared" so the omission is visible, not silent.

## §4 — Dry-run plan format

The deliverable: `AI-KIT-UPGRADE-PLAN-YYYY-MM-DD.md` at the target repo root, containing —

1. **Header block** — installed kit version → current kit version; manifest `origin` and `generated_date`; which audit was consumed (path + date) or the mini-audit's scope statement.
2. **The verdict table** — ONE markdown table, one row per file:

   | path | class | owner state | kit state | verdict | action | evidence |
   |---|---|---|---|---|---|---|
   | `.claude/rules/base.md` | rule | untouched | updated | UPGRADE | overwrite | `a1b2c3d4=a1b2c3d4 / e5f6a7b8→09c0d1e2` |

   Column vocabularies: `owner state` ∈ untouched / modified / missing · `kit state` ∈ unchanged / updated / new / n-a · `action` ∈ none / overwrite / add / merge-draft / question / reinstall-offer. `evidence` carries both hash pairs (owner pair, then kit pair), each hash truncated to 8 chars — enough to re-verify, short enough to scan.
3. **Summary counts** per verdict — N KEEP / N UPGRADE / N ADJUDICATE. These counts MUST equal the table's actual row counts (§8 checks this mechanically).
4. **Adjudication questions** — a single numbered list the owner can answer in one message, merging the audit's owner-adjudication queue with the upgrade conflicts. Each question names the file, its verdict (with the audit verdict attached where one exists), and the concrete choice being asked. No question, no ADJUDICATE row — the two lists are bijective.
5. **Token-economy delta** — measured always-loaded context weight now (CLAUDE.md + always-on rules + hooks, per the audit's Phase-1 method) vs projected post-upgrade weight, plus the settings-level levers the install predates (WORKFLOW-CLAUDE-CODE §11.3: thinking cap, autocompact threshold, subagent model, MCP surface ceiling). Savings figures are marked **estimates** until §5a's smoke measurement confirms them — quality is never traded for tokens silently.

## §5 — Adjudication protocol

For every ADJUDICATE row:

1. Present a **3-way summary**: manifest baseline (what the generator originally wrote) vs current file (what the owner has now) vs new kit output (what the current kit would generate, placeholders re-substituted from the manifest's `placeholders` map). Summarize the deltas in prose; quote only load-bearing lines.
2. Offer exactly three options:
   - **`keep-mine`** — file untouched; manifest updated to record the customization.
   - **`take-kit`** — current kit output replaces the file; the owner's delta is explicitly forfeited, and the plan says so in those words.
   - **`merge`** — the agent DRAFTS a 3-way merge for the owner's review. A merge draft is never auto-applied; it ships in (or alongside) the plan for approval like everything else.
3. **NEVER overwrite an owner-modified file without a recorded owner answer.** Unanswered rows default to `keep-mine` — silence preserves, never destroys.

**Apply mode** (post-approval, on a branch) inherits the generator's Phase 4 doctrine wholesale: back up before overwriting; archive, don't delete (`docs/archive/` — never `rm`); DECISIONS.md and HANDOFF.md are append-only — an upgrade may append an entry recording itself, never rewrite history.

**Apply mode's last action:** rewrite `.ai-kit-manifest.json` — new `sha256` for every touched file, new `template_sha256` where the template moved, per-file `kit_version` bumps, and `owner_customized: true` on every `keep-mine` and `merge` outcome. The manifest must leave this session as trustworthy as this session needed it to be on entry.

## §5a — Post-apply verification (branch-gate; kit ≥v0.18.0)

Apply is not complete until, still on the branch:

1. **Static verification:** run `harness/layer1/static-checks.md` over the upgraded install — dead-glob lint, strict-JSON, placeholder hygiene, least-privilege gate, line ceilings. Failures are fixed on the branch or the corresponding change is reverted; they never merge.
2. **Protected-path check:** every §3a file byte-identical (hash pre = hash post). Mismatch → abort + revert the branch, per §3a.
3. **Smoke protocol:** execute 3–5 representative tasks from the project's daily profile with the upgraded workflow and compare against pre-upgrade behavior — output quality and token cost both. A quality regression or unexplained cost increase is a finding that blocks merge, not an acceptable loss; the §4.5 token-delta estimates get replaced with these measured numbers.
4. **Rollback rail:** the pre-upgrade state persists on the default branch until the owner merges; **merging is the owner's action, never the agent's**. The plan file gains a final "Verification results" section (append — the plan is the single artifact of record for the whole pass).

## §6 — No-manifest fallback (pre-v0.17.0 installs)

Reconstruct a provisional manifest before any planning:

1. **Inventory** kit-shaped artifacts using the Phase 0.2 list (§1 route (b)).
2. **Kit-source matching:** for each artifact, attempt to identify its kit template by reverse-substituting known placeholder values — kit path, project name, ledger paths — into the current kit templates, then byte-comparing. An exact match → record `disposition: created`, treat as untouched. Anything else → **owner-modified-presumed**.
3. **HARD CONSERVATIVE RULE:** a manifest with `origin: "reconstructed"` may NEVER yield an auto-UPGRADE verdict. Every non-identical file is ADJUDICATE, no matter how confident the template match looks. The 2×2's safe-upgrade cell requires generation-time provenance; a reconstruction cannot supply it, so the cell is unreachable by construction.
4. **Do NOT attempt similarity scoring against historical template versions.** A shallow or version-pinned kit clone makes similarity scores confident-wrong — the same doctrine as the audit's UNKNOWN class: deliberate uncertainty beats manufactured certainty.
5. The reconstructed manifest is written to disk **only in apply mode** — writing it during dry-run would be a second write and a contract breach. In the dry-run it lives inside the plan as a table.

## §7 — Zero-destructive-actions guarantee

Enumerated invariants — all of them hold, always, or the pass is aborted:

1. Dry-run writes exactly ONE file: the plan. No manifest touch-ups, no "harmless" formatting fixes, no backup directories.
2. Apply runs only after explicit operator approval of the plan, and only on a branch.
3. Nothing is ever deleted — replaced files are backed up first; retired files move to `docs/archive/`.
4. No file outside the manifest's `files` list plus the kit-shaped inventory (§1 route (b)) is ever read-for-modification or touched. Application code is out of scope by definition.
5. The manifest rewrite is the LAST apply action — if apply aborts mid-way, the old manifest still describes more of the tree correctly than a half-new one would.
6. Protected paths (§3a) leave the pass byte-identical, verified by hash post-apply — or the apply aborts and the branch is reverted.
7. The upgraded branch merges only by the owner's hand, only after §5a verification results are in the plan.

## §8 — Self-check before returning

Before handing the plan to the operator, verify mechanically:

- [ ] The verdict table has all three verdict classes populated or explicitly declared empty — `UPGRADE: 0` is a statement, not an omission.
- [ ] `git status --porcelain` after the dry-run shows exactly one new file: the plan. Anything else is a contract breach — revert it and say so in the chat summary.
- [ ] Every ADJUDICATE row has a corresponding numbered question in the adjudication section (bijective, per §4).
- [ ] Summary counts equal the actual table row counts per verdict.

If any check fails, fix the plan — not the project — and re-run the checks.
