# User-Pain Raw — PSP first-run factual audit (2026-07-11)
> Beat: 1b-psp-firstrun · Method: full read of PROJECT_SETUP_PROMPT + install/quickstart docs · Sonnet subagent, Dispatch D

## First-run journey (factual, numbered per the 6 sections above)

### 1. Install path(s)

**Plugin path** (README.md:41-48, QUICK_START.md:11-24) — 2 shell commands:
```
claude plugin marketplace add directiveforge/directiveforge
claude plugin install directiveforge
```
This installs 22 skills + workflow commands only (no rules, no agents, no router, no manifest — QUICK_START.md:24 states this explicitly: "If the plugin is all you wanted, you are done — stop here."). `--scope project` is an optional flag to share via repo (QUICK_START.md:20).

**Generator (manual drop-in) path** (QUICK_START.md:26-70) — 3 named steps, 4 discrete actions:
- Step 1: `git clone https://github.com/directiveforge/directiveforge.git ~/Documents/GitHub/AI` (1 command; note the doc's own example path `~/Documents/GitHub/AI` does not match where this repo actually lives on this machine, `~/Projects/AI` — the user must substitute their real path)
- Step 2: `cd /path/to/your/project && claude` (or `cursor .`) (2 commands, 1 step)
- Step 3: paste a ~24-line prompt block (QUICK_START.md:47-69) as the first message of a fresh session, which itself tells the agent to go read `generator/PROJECT_SETUP_PROMPT.md` (1023 lines) and follow it phase-by-phase

**Cursor copy-based path** (KIT-INSTALL-PIPELINE.md:329-338) — a third, less-recommended path: `git clone` + `cp -R ~/kit/templates/skills/{decision,naming,design} .cursor/skills/`. Explicitly flagged as incomplete: "this copies the skills but not the router rule or the rest of the workflow — the generator path is the recommended Cursor route."

### 2. What the generator asks the user — every question/decision point in PROJECT_SETUP_PROMPT.md

Total distinct question/decision points found: **9**, all but one gated behind a conditional trigger (none fire unconditionally on every run).

| # | Question (quoted/paraphrased) | Phase | Fires when | Has a default? |
|---|---|---|---|---|
| 1 | "Intent: `maintain` / `evolve` / `revive`?" | 0.5 (line 101) | Only if dormancy (>6mo since last commit), operator declares revival, or HANDOFF/README contradict git history (lines 90-97) | No — "record answers verbatim" (line 99) |
| 2 | "Who is this project for now (audience may have changed since dormancy)?" | 0.5 (line 102) | Same gate as #1 | No |
| 3 | "Quality bar / ambition for the next phase?" | 0.5 (line 103) | Same gate as #1 | No |
| 4 | "What must NOT change (locked decisions, visual identity, APIs others depend on)?" | 0.5 (line 104) | Same gate as #1 | No |
| 5 | "Which decisions does the owner reserve (money, publishing, dependencies)?" | 0.5 (line 105) | Same gate as #1 | No |
| 6 | Maturity-tier tie-break question (wording not shown in PSP itself; described only in KIT-INSTALL-PIPELINE.md:18: "ask you a single tie-break question if the signals are mixed") | 1.6 | Only if Phase 1.6 signals are mixed/ambiguous (PSP:237 "Tie-break rule") | **Yes** — PSP:237 "When signals are mixed... classify as Intermediate" is the stated fallback if unanswered |
| 7 | IDE-scope ask — "ASK rather than assume 'both'" when neither `.cursor/` nor `.claude/` exists; also "ASK the operator about IDE scope" when `.cursor/` artifacts look stale and the generator runs in Claude Code | 3.4 (lines 470, 504) | Only in the ambiguous edge cases named; the common case resolves via a stated inference rule (session IDE, or whichever single directory exists) with no question asked | Partial — inference rule covers most cases (lines 470, 502-503), but the genuinely-ambiguous case has no stated fallback answer |
| 8 | "Want me to bootstrap it now? (yes/no)" — vigilance discipline | 7.1 (line 856) | Advanced tier only, offered not forced (line 839: "OFFER the bootstrap; the operator decides") | No — no fallback if unanswered |
| 9 | "Want me to install the pattern? (yes/no)" — mission-dispatch pattern | 8.1 (line 906) | Advanced tier only, offered not forced (line 891) | No — no fallback if unanswered |

Notable structural facts: the 5 Phase-0.5 questions only fire for revival/dormant/discontinuous projects — a normal greenfield or actively-maintained first run skips all 5. The two Advanced-tier yes/no gates (#8, #9) only fire if Phase 1.6 already classified the project Advanced. For the modal "new project, Starter or Intermediate tier" first run, the realistic count of questions actually put to the user is **0 to 1** (only the IDE-scope ask, and only if directory evidence is ambiguous).

### 3. Expectation-setting

**Duration** — QUICK_START.md:5: "**Time**: 15-45 minutes depending on project size + tier. Starter ≈ 15 min. Intermediate ≈ 25 min. Advanced ≈ 40-45 min including optional opt-ins."

**Requirements** — QUICK_START.md:7: "**Requirements**: Cursor or Claude Code with file-system access to both this kit and the target project. For Advanced-tier features (Claude Code Routines for vigilance discipline), Pro/Max/Team/Enterprise plan." No minimum plan is stated for Starter/Intermediate generator runs themselves.

**Model requirement** — absent. No file states which Claude model (Opus/Sonnet/Haiku) the generator session itself should run on. The only model-adjacent guidance appears in the Phase 9 output template as a *post-setup* tip: PSP:980 "Recommend `opusplan` alias — the premium model plans, the cheaper model implements."

**Token/cost of running the generator itself** — absent. Grepped every doc; the only token-cost figures found are downstream operating costs, not generation cost: PSP:551 "`decision/council-3-voice` burns ~15× tokens of a single chat call," and PSP:854 "Cost: 3 Routines on claude.ai/code/scheduled (Pro: 5/day budget; Max: 15/day; usage ~1.2/day across the three)" — both apply only after install, only at Advanced tier, only if the operator opts in.

**What you get at the end** — README.md:50: "The generator reads your codebase, asks you a short profile of questions, and writes your `CLAUDE.md`, `.cursor/rules/*.mdc`, `.claude/commands/`, agents, and MCP config — tailored to your stack." Per-tier file trees are enumerated in QUICK_START.md:77-121 and KIT-INSTALL-PIPELINE.md §4.

**Phase count claim vs. actual** — QUICK_START.md:53 tells the user the master prompt "has 9 phases (0-8 + summary) that you MUST follow in order." The actual file has **14** `## Phase` headings (0, 0.5, 1, 2, 2.5, 3, 4, 4.5, 5, 6, 7, 8, 8.5, 9) — the quickstart's "9 phases" undercounts by 5 (the four `.5` phases plus Phase 1.6 is a `###` subsection, not counted either way).

### 4. Failure paths

Documented, narrow, per-item degrades — no session-level failure/resume doctrine found:
- Install-manifest guard (PSP:82): if `.ai-kit-manifest.json` already exists, "STOP and route to `generator/UPGRADE_MODE.md` instead of re-running this generator (a re-run over a prior install destroys the upgrade contract)" — this is a pre-flight guard against re-running on an already-installed project, not a mid-run failure recovery.
- MCP quality-gate failure (PSP:352): "Gate 4 (security) fails → DO NOT add. Note in report: 'failed security scan'" — one discovered MCP server is skipped; the rest of the run continues.
- Snyk scan degrade (PSP:344): "without it [`SNYK_TOKEN`] it still enumerates servers but degrades to inventory, and stdio servers are auto-declined in non-interactive runs" — a partial-capability degrade, not a hard failure.
- Phase 4 backup principle (PSP:714, 716): "NEVER delete files — move to `docs/archive/` if not needed... emit `PRE-EXISTING-MODIFIED.txt`... one line per pre-existing path this run modified, each with its backup path... or an `append-only` marker" — this protects pre-existing project files from being clobbered, but says nothing about recovering the generator's own newly-written files if the run itself is interrupted.
- Phase 5 (PSP:797): "Fix any failures before reporting completion" — validation failures are expected to be corrected in-session before the agent reports done; there is no branch for "what if they can't be fixed."
- VALIDATION_CHECKLIST.md §0 (line 15) discloses a known checklist/reality gap rather than a run-failure path: "three generator runs each passed 12–14 / 14 applicable sections while the harness graded two of them F" — i.e., passing the checklist does not guarantee a good result, but this is about output quality, not mid-run crash recovery.

**What's undocumented**: no retry logic, no checkpoint/resume mechanism for the PSP session itself (e.g., context window exhaustion, model refusal, network drop mid-Phase-3), no rollback of the generator's own already-written new files if a later phase fails, and no guidance on what a user should do if the session dies at, say, Phase 3 of 9/14 with half the files written. The manifest (Phase 8.5) is written "LAST" (PSP:929) specifically so an interrupted run leaves no manifest — but nothing tells the operator that an interrupted run is detectable this way, or what to do next (rerun from scratch is the only implied option, and Phase 0.2's guard would not even fire since no manifest exists yet).

### 5. Time-to-first-value

**Plugin path**: value is nominally available seconds after the 2 install commands, but it is not demonstrated to the user at install time — the skills "self-trigger on the right prompts" (QUICK_START.md:20); the user must send a decision-shaped message (e.g. "is this a good idea?") before any visible output occurs. No demo/example invocation ships in the install flow itself.

**Generator path**: the documented first-value moment is the *end* of a single, non-incremental session. Nothing in the docs describes intermediate/streaming value (e.g., "CLAUDE.md is usable as soon as Phase 3 finishes even if later phases haven't run") — the process is framed as one continuous session from Phase 0 through the Phase 9 summary, gated by the Phase 5 validation pass and (per PSP:797) fixing failures "before reporting completion." Per the stated durations (QUICK_START.md:5), the earliest point of usable output is **~15 minutes in**, for a Starter-tier project, and only after the full single-session run completes and self-validates — there is no earlier checkpoint the docs point the user to.

### 6. Post-generation

- Phase 9 Summary Report (PSP:941-1003) is itself an 18-subsection structured template (Files Created, Files Migrated, MCP Servers Configured/Rejected, Architecture Decisions Recorded, Pack-Gate Decisions, Install Manifest, Validation Results, Cost Optimization Tips, Post-Setup Recommendations, Decision Skills Installed, Surface Routing Integration, Vigilance Discipline, Mission-Dispatch Pattern, New Environment Variables Required) the user is handed at the end of every run.
- The Validation Checklist (generator/VALIDATION_CHECKLIST.md, 455 lines) has **23 numbered sections (§1–§23)** plus a preface (§0, "Instrument-validity note") and a closing **Sign-off** block (lines 445-455: "Checklist passed: [yes/no] / Items failed: [list or 'none'] / Validator: [agent or human]"). Sections 14-16 (Surface Routing / Vigilance / Mission-Dispatch) are explicitly allowed to read "Pending/N-A by tier" (PSP:796).
- Intermediate+ tier leaves one manual, out-of-session step: Phase 4.5 does not do the surface-routing integration itself — it outputs a paste-ready block (PSP:775-781) the operator must copy into a **separate, fresh Cowork session** ("You — the generator agent — do NOT run the integration prompt directly inside this generator session," PSP:773). The Phase 9 report is required to flag this "pending operator action" if not yet done (PSP:790).
- Advanced tier leaves further manual follow-through: if vigilance is accepted (Phase 7.2), the operator must manually register 3 Claude Code Routines at `claude.ai/code/scheduled` with specific cron expressions and permissions (PSP:881); QUICK_START.md:73-151 restates this as an "Advanced topics" maintenance burden.
- QUICK_START.md:127-132 gives ongoing maintenance instructions post-install ("After code changes: tell the agent 'update context'"; "Periodically: run the validation checklist"), but these are prose recommendations, not a scripted checklist the user runs once and is done with.

## Counts table
| metric | value | where measured (file:line) |
|---|---|---|
| Questions/decision points, total distinct | 9 | generator/PROJECT_SETUP_PROMPT.md:99-105 (5), :237 (1), :470/:504 (1), :856 (1), :906 (1) |
| Questions with a stated default/fallback if unanswered | 1 full (tie-break→Intermediate) + 1 partial (IDE-scope inference rule) | generator/PROJECT_SETUP_PROMPT.md:237, :470, :502-503 |
| Install steps — plugin path | 2 commands | README.md:43-46; QUICK_START.md:15-18 |
| Install steps — generator/manual path (named steps) | 3 | QUICK_START.md:26-70 (Step 1/2/3) |
| Install steps — generator/manual path (discrete commands) | 4 | QUICK_START.md:29, 37-38 (clone, cd, launch, paste) |
| Docs' stated duration — Starter | ≈15 min | QUICK_START.md:5 |
| Docs' stated duration — Intermediate | ≈25 min | QUICK_START.md:5 |
| Docs' stated duration — Advanced | 40-45 min | QUICK_START.md:5 |
| Docs' stated token/$ cost of running the generator itself | none found (absent) | grep across QUICK_START.md, PROJECT_SETUP_PROMPT.md, KIT-INSTALL-PIPELINE.md, README.md |
| Validation checklist section count | 23 numbered (§1-§23) + §0 preface + Sign-off | generator/VALIDATION_CHECKLIST.md:19,44,57,78,94,109,129,151,162,174,192,208,226,239,252,268,282,298,321,340,358,378,410,445 |
| Phases in PROJECT_SETUP_PROMPT.md (actual `## Phase` headings) | 14 | generator/PROJECT_SETUP_PROMPT.md:14,88,134,243,282,367,710,761,792,819,835,887,923,941 |
| Phases as stated by QUICK_START.md | "9 phases (0-8 + summary)" | QUICK_START.md:53 |

## Notable verbatim expectation-setting quotes (with file:line)

- QUICK_START.md:5 — "**Time**: 15-45 minutes depending on project size + tier. Starter ≈ 15 min. Intermediate ≈ 25 min. Advanced ≈ 40-45 min including optional opt-ins."
- QUICK_START.md:7 — "**Requirements**: Cursor or Claude Code with file-system access to both this kit and the target project. For Advanced-tier features (Claude Code Routines for vigilance discipline), Pro/Max/Team/Enterprise plan."
- QUICK_START.md:24 — "If the plugin is all you wanted, you are done — stop here. The plugin is the skills-and-commands layer only."
- QUICK_START.md:53 — "It has 9 phases (0-8 + summary) that you MUST follow in order."
- README.md:50 — "The generator reads your codebase, asks you a short profile of questions, and writes your `CLAUDE.md`, `.cursor/rules/*.mdc`, `.claude/commands/`, agents, and MCP config — tailored to your stack."
- workflows/KIT-INSTALL-PIPELINE.md:18 — "The generator's Phase 1.6 will re-derive the tier from codebase evidence and ask you a single tie-break question if the signals are mixed, but the install runs cleaner when you arrive with a working hypothesis."
- generator/PROJECT_SETUP_PROMPT.md:99 — "Intake — ask the operator, max 5 questions, record answers verbatim:"
- generator/PROJECT_SETUP_PROMPT.md:856 — "Want me to bootstrap it now? (yes/no)"
- generator/PROJECT_SETUP_PROMPT.md:906 — "Want me to install the pattern? (yes/no)"
- generator/PROJECT_SETUP_PROMPT.md:82 — "if `.ai-kit-manifest.json` exists, this project already carries a kit-generated workflow — STOP and route to `generator/UPGRADE_MODE.md` instead of re-running this generator (a re-run over a prior install destroys the upgrade contract)."
- generator/PROJECT_SETUP_PROMPT.md:773 — "You — the generator agent — do NOT run the integration prompt directly inside this generator session."
- generator/VALIDATION_CHECKLIST.md:15 — "three generator runs each passed 12–14 / 14 applicable sections while the harness graded two of them **F**... passing every section means the workflow is complete, consistent, and within budgets — necessary, not sufficient."

## What surprised me

1. The quickstart's own headline number ("9 phases") undercounts the file it is describing — the master prompt actually has 14 `## Phase`-level headings once the `.5` phases (0.5, 2.5, 4.5, 8.5) are counted, plus a separate `### 1.6` maturity classification subsection with its own operator-facing decision.
2. Realistically, for the common case (an actively-developed, non-dormant, Starter-or-Intermediate project with unambiguous IDE tooling), the generator asks the user **zero** questions during the run — all 5 Phase-0.5 questions and both Phase-7/8 yes/no gates are conditionally skipped, and the IDE-scope ask only fires on ambiguous directory evidence. The "asks you a short profile of questions" framing in README.md:50 is true only for revival/dormant projects or Advanced-tier opt-ins.
3. There is no documented token or dollar cost anywhere for running the generator session itself — every token-cost figure in the docs is a downstream, opt-in, Advanced-tier operating cost (council-3-voice's 15×, or the vigilance routines' daily budget), not the cost of the one-time 15-45 minute generation session a first-time user actually pays for.
4. There is no stated minimum or recommended Claude model for running the generator (Opus vs. Sonnet vs. Haiku) — the only model guidance in the entire pipeline is a *post-setup* cost tip (`opusplan` alias) that assumes the workflow is already installed.
5. QUICK_START.md's own copy-paste prompt block hardcodes an example kit path (`~/Documents/GitHub/AI`) that does not match where this actual repo lives on this machine (`~/Projects/AI`) — a first-time user following the doc literally would paste a wrong path and have to notice and correct it themselves; the doc does flag this with "(adjust path if cloned elsewhere)" but only as a parenthetical.
6. There is no documented resume/retry/rollback mechanism for the generator run itself. Phase 4's backup protocol (`.backup` files, `PRE-EXISTING-MODIFIED.txt`) protects only pre-existing project files from being overwritten — it says nothing about what happens to the generator's own newly-created files if the session is interrupted mid-run (e.g., context exhaustion at Phase 3 of 14). The install-manifest is deliberately written last (Phase 8.5) "so an interrupted run leaves no manifest," but no doc tells the operator this is how they'd detect an incomplete prior run, or what to do about it.
7. The Validation Checklist explicitly warns that its own pass rate is not a quality signal (§0, VALIDATION_CHECKLIST.md:15) — citing a documented case where 3 real generator runs each passed 12-14 of 14 applicable checklist sections while an independent harness graded two of those same runs an outright F. This means the very artifact the user is told to run for reassurance ("run the validation checklist to catch drift," QUICK_START.md:130) is documented, in its own text, as insufficient for exactly that purpose.
8. Intermediate-tier and above leaves at least one required step that cannot be completed inside the generator session at all: Phase 4.5's surface-routing integration is explicitly designed to be handed off to a *second, separate* Cowork session via a paste-ready block, because "Cowork has the file system + multi-app affordances the integration prompt assumes" and running it inline "would dilute this generator session's flow" (PSP:773). A user who only runs the one documented session (Steps 1-3 of QUICK_START.md) will not get this file unless they notice the handoff block and act on it separately.
9. Advanced tier's vigilance opt-in requires the operator to manually register 3 scheduled cloud routines on a different Anthropic surface entirely (`claude.ai/code/scheduled`) with specific cron strings and a non-obvious permission ("Allow unrestricted git push") plus an explicit anti-default instruction each routine must carry ("git checkout main; do NOT create a feature branch") to avoid a documented failure mode where "commits land on a `claude/` branch that nobody reads" (KIT-INSTALL-PIPELINE.md:294-296). This is presented as a known pitfall the kit's own team already hit, not a hypothetical.
10. The Phase 9 summary report the user is handed at the end is itself a fairly heavy artifact — 14 required subsections — before the user even gets to the separate 455-line, 23-section Validation Checklist. There is no single-page "you're done, here's what to look at" surface; the end-of-run experience is two stacked structured documents.
11. Only one of the two "install paths" (plugin vs. generator) is genuinely one-shot and fast (2 commands, seconds); the other — which README.md and KIT-INSTALL-PIPELINE.md both call "the recommended route for any project past a side-project" — is a full open-ended agentic session with a stated 15-45 minute duration and no guaranteed stopping point if validation failures need fixing (PSP:797's "fix any failures before reporting completion" has no stated retry cap).

## Source log
- ~/Projects/AI/generator/PROJECT_SETUP_PROMPT.md (full read, 1023 lines, two chunked reads: 1-633, 634-1024)
- ~/Projects/AI/README.md (full read, 155 lines — quickstart + architecture + limitations sections)
- ~/Projects/AI/workflows/KIT-INSTALL-PIPELINE.md (full read, 375 lines)
- ~/Projects/AI/QUICK_START.md (full read, 161 lines)
- ~/Projects/AI/generator/VALIDATION_CHECKLIST.md (section headers via grep for full-file structure; lines 1-60 and 427-455 read directly for §0 instrument-validity note and Sign-off)
- ~/Projects/AI/.claude-plugin/plugin.json (full read)
- ~/Projects/AI/.claude-plugin/marketplace.json (full read)
- ~/Projects/AI/plugin/commands/status.md (full read, 53 lines)
- ~/Projects/AI/plugin/commands/workflow-help.md (full read, 56 lines)
- Targeted greps across the above set for: question/ask patterns, token/cost mentions, model/plan requirements, failure/retry/rollback/resume language, `## Phase` heading enumeration
- Not read in full (out of scope per dispatch): plugin/commands/report-friction.md, generator/presets/*, templates/*, harness/* (referenced only where cited by the files above)
