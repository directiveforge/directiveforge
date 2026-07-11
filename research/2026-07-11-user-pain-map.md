# User-Pain Map — people using AI agents on real projects (2026-07-11)

> **Mission:** Dispatch D (`prompts/dispatch/USER_PAIN_RESEARCH_DISPATCH.md`). Pre-registered demand
> research, written 3 days before the Show HN launch (Tue 2026-07-14). Method + source log at the end;
> raw evidence tables in `research/2026-07-11-user-pain-raw/` (7 beats, 190 rows, every external URL
> fetch- or snippet-verified per the protocol there). Synthesis + adjudication: Fable 5 main loop.
> **These hypotheses get graded publicly after launch** — that is the point.

## 1. Executive verdict

**Recommended next designs (top-2 of the four standing candidates):**

1. **UX first-run overhaul.** The strongest evidence concentration in the whole study. First-run
   failure is the #1 abandonment driver in the DX literature (68% cite "too much setup time"; devs
   decide in ~3 minutes), 4 of 5 rival kits have open day-one install crashes, and the kit's own
   first-run has honest gaps the factual audit surfaced: no cost disclosure, no visible first win
   before the ~15-45-minute full run completes, no failure/resume story, a "9 phases" doc claim vs
   14 actual, and no documented uninstall path. Everything here is ours to fix; nothing depends on
   the model.
2. **Field-evidence / L3 methodology.** The most convergent practitioner signal is that verification
   — not generation — is the bottleneck, and the praised patterns (Hashimoto's "harness engineering",
   Yan's "shift verification left", StrongDM's held-out scenario tests) are exactly the kit's
   measured-outcomes wedge. But the same audience produces the sharpest benchmark teardowns
   ("I could obliterate this benchmark with the prompt 'Always answer with one word'"), and the
   README already concedes no real-project outcome claim. L3 (measured outcomes on real projects)
   is the only durable answer to both.

**Evidence-forced NEW candidate:** an **artifact-evolution story** ("regenerate/upgrade without
losing my edits"). The single highest-reacted rival issue found anywhere (spec-kit #1191, 105 👍) is
exactly this, BMAD's upgrade path deletes user customization (#1728), and the kit's own field
evidence shows generator-distributed defects replicate into installs and outlive kit fixes.
`generator/UPGRADE_MODE.md` + the install manifest already exist — this candidate is "prove and
harden the upgrade path", not "build one". Slots directly behind the top-2.

**Explicitly NOT supported by the evidence:** the **multidomain structural spec** — no external pain
row demands it; the docs-ops preset already absorbs the one internal instance (a docs-only repo run
that improvised ~40% of its phases). The **2026-08-01 monthly architect prompt** stays exactly where
it is: calendar-driven, enriched by this study (tool-call regression caveat, model-state refresh),
but demand evidence gives it no reason to jump the queue.

## 2. Pain taxonomy (axes as they emerged from the evidence)

| axis | one-line description | strongest beats |
|---|---|---|
| T1 Instruction adherence | agent ignores CLAUDE.md/rules; context-limit deprioritization; worked-then-stopped regressions | 2c (38+ threads), 2a, 2d |
| T2 Output trust & review burden | "AI slop" PRs, review as the new bottleneck, accountability stays human | 2c, 2d (5+ independent sources), 2a |
| T3 Ceremony tax | the workflow framework itself makes simple tasks slower/worse; process scales with the kit's ambition, not the task | 2b (all 5 rivals), 2e, 2a |
| T4 Onboarding & time-to-first-value | day-one install crashes, question overload, no visible payoff inside 10 minutes, trust-killing opacity | 2e, 2b, 1b |
| T5 Living-artifact evolution | can't iterate a generated spec/rules-set; upgrades destroy customization; installed defects outlive kit fixes | 2b (#1191 top-reacted overall), 1a |
| T6 Freshness & ecosystem churn | host-tool updates silently kill hooks/skills; MCP servers rename/deprecate faster than docs; markers expire silently | 1a (3 independent field runs), 2b |
| T7 Cost anxiety & context economics | opaque usage limits, "token anxiety", kits injecting 10k+ tokens per turn, input tokens dominate | 2a, 2b, 2e |
| T8 Silent failure & verification theater | rules that never load, hooks that hide errors, checklists that pass while output fails, agent self-over-confidence | 1a (4 independent mechanisms), 2b |
| T9 Vendor & platform trust *(out of kit reach)* | unexplained account bans, no support channel, GitHub buckling under agent load, retention-policy shocks | 2a (749-pt thread), 2d |
| T10 Human costs *(out of kit reach)* | reviewer burnout, junior skill atrophy, "vampiric" fatigue, loss of agency ("my role is reduced to a messenger") | 2d, 2c |

## 3. Top-15 pains, ranked (frequency × severity × fit)

Scores 1-5; **fit** = can a workflow-kit credibly address it (0 = not at all). Composite = F×S×Fit.
Both orderings matter: by raw frequency×severity, rows 1 (onboarding), 8 (instructions ignored),
9 (review burden) and 14 (vendor trust) tie for the lead at F×S=20 — that is what the audience is
angry about; the fit-weighted composite shown below is what a workflow kit can actually act on.

| # | pain | F | S | Fit | =: | strongest verbatim quote | source (verified) |
|---|---|---|---|---|---|---|---|
| 1 | First-run install failure & opaque onboarding | 4 | 5 | 5 | 100 | "Error: Invalid schema: plugins.0.source: Invalid input" — install fails at the very first documented command; ~10 "same issue" replies same day | https://github.com/affaan-m/ECC/issues/15 · 2026-01 |
| 2 | Ceremony tax — the framework is slower than no framework | 4 | 4 | 5 | 80 | "A simple task of creating a trivial model + CRUD endpoint is becoming a 35 minute session. With plain claude code it's done in 2 minutes." | https://github.com/obra/superpowers/issues/743 · 2026-04 |
| 3 | Living-artifact evolution — can't change what was generated | 4 | 4 | 4 | 64 | "Multiple users find it difficult to update, refine, or iterate on existing specs… without creating new branches and redundant specification artifacts." (105 👍 — highest-reacted rival issue found) | https://github.com/github/spec-kit/issues/1191 · 2025-11 |
| 4 | Ecosystem churn breaks installed kits | 4 | 4 | 4 | 64 | "All 27 hooks defined in hooks/hooks.json fail to load… only the hook-driven automations are dead." (host-tool schema tightening) | https://github.com/affaan-m/ECC/issues/1454 · 2026-04 |
| 5 | Silent-inert config & verification theater | 3 | 4 | 5 | 60 | On a real 24-month repo, **15 of 15 existing rules never actually loaded** (empty globs, missing frontmatter, 577-line giants) — the #1 real-world defect of that audit | internal: field audit of a real 24-month-old repo, 2026-06-11 (feedback/ ledger) |
| 6 | Kit-induced context/token bloat | 4 | 3 | 4 | 48 | "Enabling the plugin injects all 182 skill descriptions (~10.3k tokens)… ≈ 12.8k tokens into every single turn… ~90% of that per-turn cost is unused." | https://github.com/affaan-m/ECC/issues/2482 · 2026-07-09 |
| 7 | Agent self-over-confidence / unverifiable self-reports | 3 | 4 | 4 | 48 | Agent self-assessment "systematically over-confident"; a verification agent's own worked example asserts a clean PASS its own script contradicts — same failure found by two independent methods | source: internal methodology record (private feedback log, 2026-06-06 — deliberately excluded from the public snapshot; the lesson is summarized in this row) + `harness/results/2026-07-03-baseline/brownfield-docs/l2.6-defects.md:17-24` |
| 8 | Instructions ignored — rules/CLAUDE.md non-compliance | 5 | 4 | 2 | 40 | "I have a CLAUDE.md file with explicit instructions in ALL CAPS… ignores it 80% of the time" — 38+ distinct threads found across r/ClaudeAI + r/cursor alone; identical on Max-20x/enterprise tier | https://www.reddit.com/r/ClaudeCode/comments/1qn9pb9/claudemd_says_must_use_agent_claude_ignores_it_80/ (snippet-verified) · ~2026-01 |
| 9 | Review burden / AI slop at the team boundary | 5 | 4 | 2 | 40 | "AI slop PRs are burning me and my team out hard" (~30 PRs/day, 6 reviewers); DORA: 25% more AI adoption ↔ **7.2% lower delivery stability** | https://www.reddit.com/r/ExperiencedDevs/comments/1kr8clp/ai_slop_prs_are_burning_me_and_my_team_out_hard/ (verified via arXiv:2603.27249) · 2025-05; https://dora.dev/ai/gen-ai-report/ · 2026-04 |
| 10 | Long-horizon drift / maintenance hangover | 3 | 4 | 3 | 36 | "Software agents are not yet capable of maintaining a decently active repository… it just becomes a mess over time if you don't steer things often enough." | https://news.ycombinator.com/item?id=47534060 · 2026-03 |
| 11 | Brownfield gap — kits assume greenfield | 3 | 3 | 4 | 36 | "what if we have already developed some project and we want it to work from where we have left off." | https://github.com/github/spec-kit/issues/164 · 2025-09 |
| 12 | Token anxiety / opaque cost | 4 | 3 | 2 | 24 | "There's a weird 'token anxiety' you get on these platforms. And you basically don't know how much of this 'limit' you may consume at any time." | https://news.ycombinator.com/item?id=47587564 · 2026-03 |
| 13 | Multi-tool team lock-in | 3 | 3 | 2 | 18 | "Me and my team don't all use the same agent so it would be handy if you could select multiple agents to be installed." (41 👍) | https://github.com/github/spec-kit/issues/377 · 2025-09 |
| 14 | Vendor/platform trust failures | 4 | 5 | 0 | 0 | "I didn't even get to send 1 prompt to Claude and my 'account has been disabled'… still blocked." (top comment, 749-pt thread — the largest thread found in the entire study; F pools the whole T9 axis: bans + platform capacity + retention shocks) | https://news.ycombinator.com/item?id=46723872 · 2026-01 |
| 15 | Human costs — fatigue, skill atrophy, lost agency | 3 | 4 | 0 | 0 | "the skill formation issues particularly in juniors without a strong grasp of fundamentals deeply worries me" (Hashimoto); "My role is reduced to that of a messenger" (Ronacher) | https://mitchellh.com/writing/my-ai-adoption-journey · 2026-02; https://lucumr.pocoo.org/2026/6/23/the-coming-loop/ · 2026-06 |

## 4. Coverage map — top pains (plus adjacent gaps the evidence forced) vs what the kit ships today

Statuses: `covered-measured` / `covered-unmeasured` / `partial` / `absent`. The absent and
covered-unmeasured rows are the roadmap. The Windows row has no top-15 rank — it is an adjacent
gap surfaced by the rival evidence, kept here deliberately.

| pain (rank) | kit status | proof |
|---|---|---|
| First-run onboarding (1) | **partial** — duration stated, modal question count is already 0-1 (good); but **cost disclosure absent, visible-first-win absent, failure/resume absent, uninstall path not found in any audited doc (inferred absence)**, "9 phases" doc claim vs 14 actual | `QUICK_START.md:5` (duration); gaps: `research/2026-07-11-user-pain-raw/1b-psp-firstrun.md` counts table |
| Ceremony tax (2) | **partial** — 3-tier sizing exists (PSP Phase 1.6) and Starter is deliberately thin, but zero measured time-to-value; no evidence the kit is net-faster on a real task | `generator/PROJECT_SETUP_PROMPT.md` Phase 1.6; conceded in `README.md` limitations |
| Artifact evolution (3) | **covered-unmeasured** — upgrade mode + install manifest exist; exactly one live field upgrade on record, zero measured multi-project evidence | `generator/UPGRADE_MODE.md`; `templates/shared/ai-kit-manifest.json.template`; `feedback/2026-07-10-pre-hn-hardening.md` PH-3 |
| Ecosystem churn (4) | **partial** — vigilance cadence is real and caught the churn 3× in the field, but its own record shows the limits: scheduled runs started stale on ~83% of days, and 2 CVEs were missed for originating outside the watchlist taxonomy | `workflows/KIT-VIGILANCE.md`; honest misses: `vigilance/feed/daily/2026-07-11.md:9`, `vigilance/feed/weekly/2026-23.md:121` |
| Silent-inert config (5) | **partial** — the exact defect quoted (rules that never attach: broken globs/frontmatter) is mechanically checked by checklist §3 but has no harness measurement; the *sibling* defect class (dead skill triggers) IS measured and re-measured (L1 F1 0.33→0.83); health-audit dispatch exists | `generator/VALIDATION_CHECKLIST.md` §3; sibling-class proof: `harness/results/2026-07-03-delta/DELTA.md` HD-1/HD-2; `prompts/dispatch/WORKFLOW_HEALTH_AUDIT.md` |
| Kit-induced token bloat (6) | **covered-unmeasured** — 40-60-line rule ceilings + token-economy defaults ship, but the per-turn token tax of a generated tree has never been measured (and 93% of agent cost is input tokens — the harness measures neither) | `templates/claude-code/settings.json.template`; ceiling doctrine in `knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md` |
| Agent self-over-confidence (7) | **covered-measured** (artifact level) — adversarial-verification doctrine + the harness caught its own verification agent asserting a fake PASS; **covered-unmeasured** at real-project level | `harness/HARNESS-SPEC.md`; `harness/results/2026-07-03-baseline/brownfield-docs/l2.6-defects.md` |
| Instructions ignored (8) | **partial** — the kit can make rules *routable* (measured triggering F1) and short enough to survive; it cannot make the model obey. No claim otherwise should ever ship | `harness/results/2026-07-03-delta/DELTA.md` L1 rows |
| Review burden, inbound (9) | **absent** — no kit artifact addresses reviewing *other people's* AI output; the kit lives on the authoring side entirely | — (honest gap; see §5) |
| Long-horizon drift (10) | **covered-unmeasured** — update-context discipline + DECISIONS.md pattern target exactly this; no longitudinal evidence on a real repo | `templates/shared/DECISIONS.md.template`; `plugin/commands/` update-context surface |
| Brownfield (11) | **covered-measured** — brownfield presets exist and both brownfield fixtures carry scored harness runs | `generator/presets/docs-ops.md`; `harness/results/2026-07-03-baseline/brownfield-api/scorecard.md` |
| Cost anxiety (12) | **absent** — no doc states what a generator run costs in tokens/$; the only cost figures are downstream opt-ins | `research/2026-07-11-user-pain-raw/1b-psp-firstrun.md` ("none found") |
| Multi-tool teams (13) | **partial** — Cursor + Claude Code both first-class incl. migration recipe; nothing else; hand-written duplication already flagged as a deficit | `workflows/MIGRATION-CURSOR-CLAUDE.md`; deficit: `research/2026-07-02-competitive-landscape-scan.md` §4 (Deficits #5) |
| Windows first-run | **absent/untested** — no Windows smoke test exists anywhere in the corpus; 4 of 5 rivals have open Windows day-one crashes, which says the risk is high | — |
| Vendor/platform (14), human costs (15) | **absent by design** — out of any workflow-kit's reach; the launch copy should say so rather than imply otherwise | — |

## 5. Disconfirming evidence — the case against the kit's thesis

Non-optional reading; every beat was required to hunt this, and every beat found it.

1. **The category is an object of ridicule in its own top threads.** "The only good Claude.md is a
   deleted Claude.md" · "'Here's how to use the slop machine better' is such a ridiculous pretense"
   · "Really, we are doing waterfall, but with AI, now?" · "I think Claude makes more mistakes when
   using superpowers than when not." The genre DirectiveForge automates is mocked at the top of its
   own highest-traffic discussions (2a rows D1-D14).
2. **Ceremony cost is quantified, recent, and third-party.** The same CRM task: 12 min (OpenSpec) vs
   90 min (spec-kit) vs 5.5 h (BMAD) — 27×. A BMAD *fan*'s retrospective: 10-15× time for
   equivalent-or-worse quality on small projects (2b-D2, 2e rows 14-15). The burden of proof that
   structure pays is on us, per-task-size, and nobody in the category has met it.
3. **"More/better md files" may not fix non-compliance.** Users on Max-20x/enterprise report identical
   rule-ignoring as free-tier users; the community's own root-cause diagnosis (context-limit
   deprioritization, model self-judged relevance) is model-side (2c-D1..D3). A generator that ships
   nicer rules inherits this ceiling.
4. **The rigor audience distrusts rigor claims.** A token benchmark was torn apart on HN for
   measuring the wrong thing; Hamel Husain: "All you get from using these prefab evals is you don't
   know what they actually do"; the minimum viable practice he defends is 30 minutes of manual
   review, not tooling (2a-D1, 2d-D6/D7). A "measured harness" pitch gets adversarial review, not
   applause, by default.
5. **Our own corpus cuts against us too.** Literal process execution degraded an edge-case run
   (docs-only repo); a diligently-run monitoring taxonomy missed both real CVEs; a pre-registered
   token circuit-breaker existed exactly as designed and spend still landed ~10× over plan; one
   direct question to a human beat a multi-signal heuristic (1a disconfirming section). Rigor's
   ceiling is architecture, not diligence.
6. **The loudest pains are out of reach.** The single largest thread found (749 pts) is about an
   unexplained account ban; review-burden/accountability, platform capacity, junior skill atrophy —
   none are addressable by rules/skills/agents generation (T9/T10).

## 6. UX cut — the first-run story the evidence demands vs what ships today

**What the evidence demands** (2e synthesis, corroborated by 2b install rows and 1b):
a 10-minute first run must contain (1) one install path with no branching decision, (2) a visible
first win — output the user can see/diff before being asked to trust anything, (3) errors that say
what happened and what to do next, (4) access/permissions explained before requested, (5) an in-flow
"you're on track" signal, (6) a cost/scope estimate before anything expensive runs. It must never:
ship install paths that silently conflict when combined, require packaging-literacy, generate an
unexplained pile of files, answer confusion with a longer README, or fail as a silent no-op.
Notably: **nobody asked for a better wizard** — praised onboardings remove steps (Stripe pre-fills
your own sandbox data); they don't add guided questions.

**What PSP does today** (factual audit, `1b-psp-firstrun.md`): two-to-three install paths (plugin
2 commands; generator 3 steps + 24-line paste; a discouraged Cursor copy path); modal question count
0-1 (already excellent — do not add a wizard); duration stated (15-45 min); **cost: absent; model
guidance: absent; failure/resume: absent** (an interrupted run is detectable only by a missing
manifest, and no doc says so); first value arrives only at full-run end (~15 min earliest); the run
ends with two stacked heavy artifacts (14-subsection Phase-9 report + 23-section checklist) and, at
Intermediate+, one easy-to-miss manual handoff to a separate Cowork session; quickstart says
"9 phases" while the file has 14; the paste-block hardcodes an example path the user must notice and
fix; no uninstall story was found in any audited doc (inferred absence — 1b did not run an explicit
uninstall check).

**Gap list, ranked by evidence weight:**

| # | gap | evidence anchor |
|---|---|---|
| G1 | No visible first win before full-run end | 68% abandon on setup time (2e row 7); 3-minute decision window (2e rows 1-6) |
| G2 | No cost/token estimate before the run | token anxiety (2a rows 9-10); 1b "none found"; H7 below |
| G3 | No failure/resume/rollback story for the run itself | 1b §4; BMAD #113 "have I missed a step?" |
| G4 | No one-page "what you got and why" map of generated files | 2e must-not #3 ("50 unexplained files reads as weekend-project"); Phase-9 report is 14 subsections, not a map |
| G5 | Install-path branching (plugin vs generator vs copy) with no conflict guard | ECC stacking breakage (2e row 16); PH-7 namespacing doc bug class |
| G6 | No in-flow progress narration ("you're on track") | BMAD discussion #113 (2e row 13) |
| G7 | No uninstall path (kit-side: inferred, no audited doc mentions one) | SuperClaude same ask filed 4× (2b row 19) |
| G8 | Doc drift: "9 phases" vs 14; hardcoded example path | 1b counts table; trust-killers per 2e rows 1-6 |
| G9 | No stated model/tier for the generation session | 1b §3 |

**Keep as-is (evidence says so):** the near-zero question budget; the tiered sizing; writing the
manifest last (it just needs to be *documented* as the interruption detector).

## 7. Pre-registered demand hypotheses H1-H8

Grading is mechanical; windows and thresholds fixed now. HN thread snapshot: 24h after posting
(H1-H3, H8; top-N by points). Inbound window for issues//report-friction: 2026-07-14 → 2026-08-14
(H4-H6; H7 one week). Each names its evidence rows.

| H | prediction (falsifiable) | derives from |
|---|---|---|
| H1 | ≥3 of the top-10 comments (by points) on the Show HN thread contain a ceremony/complexity objection ("just use plain Claude", md-file sprawl, waterfall-with-AI class) | 2a-D3..D7; 2b-D9..D11; 2e ceremony rows |
| H2 | ≥1 of the top-20 comments attacks the harness methodology specifically (self-judging, sample size, benchmark validity) rather than the product | 2a-D1; 2a surprise #8 |
| H3 | ≥1 of the top-20 comments asserts generated rules are pointless because models ignore them anyway | 2c rows 1-8, D1-D3 |
| H4 | ≥40% of inbound friction reports (GitHub issues + /report-friction) in the first month concern install/invocation/first-run rather than generated-artifact quality | 2b rows 9-20; PH-7/PH-8/PH-9 |
| H5 | ≥1 inbound report in the first month asks how to re-run/upgrade without losing local edits | 2b row 1 (#1191), row 10 (#1728); 1a row 22 |
| H6 | ≥1 of the first 10 inbound friction reports is Windows-specific | 2b surprise #2 (4/5 rivals) |
| H7 | Within the first week, ≥1 HN comment or inbound report asks what a generator run costs (tokens/$), beyond the stated minutes | 2a rows 9-10; 1b cost row = absent; G2 |
| H8 | The single top-voted *positive* HN comment references measurement/honesty (harness, F-grades, "measured not claimed") rather than any feature | 2d surprise #6; scan §6.3 |

Grading note: if the Show HN thread gets <20 comments total, H1-H3/H8 grade against all comments;
H8 fails if no positive comment exists (that outcome would itself grade H1 up).

## 8. Method + source log

- **Design:** 7 parallel Sonnet subagents (2 internal corpus, 5 external beats: HN via Algolia API,
  rival GitHub issues via authenticated `gh api`, Reddit via cross-engine snippet verification,
  named practitioners via direct fetch, first-run-UX literature). One workflow run,
  `wf_b2e442aa-5a5`. Raw tables: `research/2026-07-11-user-pain-raw/{1a,1b,2a,2b,2c,2d,2e}*.md`.
- **Citation discipline:** every external URL fetch-verified before recording (HN via Algolia item
  API; GitHub via REST API canonical `html_url`; practitioner posts via direct WebFetch). Exceptions
  are explicit: all 25 Reddit rows are **snippet-verified** (reddit.com, old.reddit.com and
  web.archive.org are hard-blocked from this environment; 7 of them are independently verified via
  the citation table of arXiv:2603.27249, which searched Reddit directly). Reddit dates partly
  estimated from base-36 thread IDs — directional, not exact. 11 candidate rows were dropped
  outright for failing verification.
- **Known coverage gaps:** r/ChatGPTCoding and r/webdev unreached through any channel (access
  failure, not absence of pain); one Boeckeler quote (2d-D8) is snippet-verified only and flagged
  low-confidence; SuperClaude/BMAD/claude-flow have no high-traction HN launch threads to mine —
  rival skepticism concentrates on superpowers, spec-kit, and CLAUDE.md-authoring posts.
- **Verification pass (ran 2026-07-11, post-synthesis):** all 15 external URLs cited in this file
  re-verified by 2 independent Haiku agents — 13 resolve with content matching the claims, 1
  redirect (dora.dev → /report/, claim text confirmed at target), 2 Reddit URLs confirmed per the
  snippet-verification protocol; **0 dead, 0 mismatched**. A separate adversarial critic agent
  checked quote drift (none found across all quotes), acceptance criteria (all PASS), and internal
  consistency — its 2 must-fix + 4 should-fix + 2 note findings are applied in this text (notably:
  the silent-inert-config coverage status was downgraded from covered-measured to partial, because
  HD-1/HD-2 measure the sibling defect class, not the exact one quoted).
- **Budgets:** see commit body (dispatch caps: ≤14 subagents, ≤4M subagent tokens, ~3h).
- **Do-not-redo note:** the rival capability map is `research/2026-07-02-competitive-landscape-scan.md`;
  this study deliberately collected rival *user pain*, not rival features.
