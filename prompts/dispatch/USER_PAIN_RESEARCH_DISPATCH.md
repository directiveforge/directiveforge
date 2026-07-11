# DISPATCH D — User-Pain Research: what do people who use AI on real projects actually suffer from?

> **Surface:** ONE Claude Code session at `~/Projects/AI`. **Main model: Fable 5** (last
> subscription-included day — main loop does strategy, synthesis, adjudication ONLY).
> **Subagents: Sonnet 5** for all web research, **Haiku** for mechanical corpus sweeps.
> No nested subagents (kit lock). Plan mode for W0.
> **Written:** 2026-07-11 (Fable, Cowork). Show HN is Tue 2026-07-14 — this research pre-registers
> demand hypotheses that the launch thread will grade.

## Mission

Produce `research/2026-07-11-user-pain-map.md`: the pain of people using AI agents on real
projects, **in their own words**, ranked, mapped against what DirectiveForge covers today, with
special depth on **first-run UX** — ending in an adjudicated verdict on what to design next.
This is a READ-ONLY mission for the kit: no shipping surface is edited. Outputs are new files in
`research/` only (they ship in the next snapshot rebuild — that is intentional and on-brand:
pre-registered demand hypotheses are exactly the kind of thing we publish and let reality grade).

## Non-negotiables

1. **Evidence, not vibes.** Every pain item carries: verbatim quote (or tight paraphrase), source
   URL, date, and a frequency signal (upvotes/replies/recurrence). **Fetch-verify every URL before
   recording it** — a citation that doesn't resolve is worse than no citation (the kit already ate
   this lesson once: a vigilance item carried a dead anthropic.com link into shipped doctrine).
2. **Hunt disconfirming evidence too.** Capture pain the kit CANNOT solve, and skepticism about
   our own thesis (people for whom "measured harness" talk is noise, who want speed not rigor).
   A coverage map with no "absent" rows is a failed mission.
3. **Recency weighting:** 2026 > 2025 H2 > older. The agentic-coding pain landscape moves quarterly.
4. **Budgets:** ≤14 subagent invocations, ≤4M subagent tokens, ~3h wall-clock. If a budget is
   about to 2×, stop and ask the operator.
5. Main loop (Fable) never does bulk reading — dispatch it. Fable synthesizes and decides.

## W0 — Plan + internal context (30 min)

0.1 Commit this file if untracked (plan-first lock).
0.2 Read (main loop, these are short): `research/2026-07-02-competitive-landscape-scan.md` (the
    rival map — do NOT redo it), `feedback/2026-07-10-pre-hn-hardening.md`,
    `feedback/DISPOSITIONS-v0.19.0.md` §N-rows, `vigilance/feed/daily/2026-07-11-supplemental.md`,
    `harness/results/2026-07-03-baseline/` scorecard headers (the HD defect classes = pain we
    measured on ourselves). Note: the kit's README already concedes "no real-project outcome
    claim" — this research is step one of closing that honestly.

## W1 — Internal corpus sweep (2 Haiku/Sonnet subagents, parallel with W2)

1a. **Our own recorded pain:** sweep `vigilance/feed/` (dailies + weeklies, Cat-4/Cat-5 items),
    `feedback/*.md`, the private case-study upgrade prompt's header notes (case-studies/, single
    instance), and the Dispatch-B friction notes in `feedback/2026-07-10-pre-hn-hardening.md` →
    inventory of pain signals ALREADY in-house, each with file:line. Schema below.
1b. **UX self-audit inputs:** extract from `generator/PROJECT_SETUP_PROMPT.md` what a first-run
    user actually experiences (how many questions, in what order, what expectation-setting exists,
    what happens on failure) — a factual description, no judgment. This grounds the W3 UX cut.

## W2 — External fan-out (5 Sonnet researchers, parallel, one beat each)

Every researcher gets the same output schema — a markdown table of pain items:
`| # | pain (verbatim quote) | source URL (verified) | date | persona guess | frequency signal | severity guess | notes |`
plus a 10-line "what surprised me" free-text section (this is where discoveries live).

2a. **Hacker News.** Search + read: comment sections of rival launches (SuperClaude, BMAD-METHOD,
    spec-kit, Every/Claude-Code-workflow posts, "Show HN" AI-workflow tools 2025-2026) — these
    comments are literally our Tuesday audience rehearsing. Also threads on: context rot,
    "CLAUDE.md", cursor rules bloat, "AI wrote code I don't trust", agent ignored instructions,
    AI slop / review burden, vibe-coding maintenance hangover, token/cost anxiety.
2b. **Rival GitHub issues.** Top-reacted + recent issues of: SuperClaude_Framework, BMAD-METHOD,
    github/spec-kit, ECC/everything-claude-code, obra/superpowers (or nearest equivalents found).
    Classify: bug / confusion / feature-ask / abandonment signal. What do users of OUR competitors
    beg for and rage about?
2c. **Reddit.** r/ClaudeAI, r/cursor, r/ChatGPTCoding, r/ExperiencedDevs AI threads: complaint
    taxonomy from working devs. WebSearch path (site:reddit.com queries) — read via search
    snippets + accessible threads.
2d. **Practitioners.** Willison, eugene-yan, hamel.dev, latent.space, Ronacher, Karpathy-adjacent
    commentary 2026: what do the people who write about agentic engineering say breaks at real-team
    scale? Include their PRAISED patterns too (pain's mirror = what good looks like).
2e. **First-run UX of winning dev tools.** What makes devs abandon a tool in the first 10 minutes
    (install friction, question overload, cost surprise, unclear payoff) and what the best
    onboardings do (expectation-setting, progress narration, instant first win, recoverable
    failure). Sources: dev-tool onboarding teardowns, DX writing, HN "why I dropped X" threads.
    This beat feeds the UX overhaul design directly.

## W3 — Synthesis (Fable main loop — the reason today exists)

3.1 Merge + dedupe all seven inputs → **pain taxonomy** (expect axes like: trust/verification of
    agent output · context/instruction drift · onboarding & time-to-value · cost anxiety ·
    team consistency & handoff · maintenance/upgrade fear · capability discovery · tool sprawl).
    Let the axes EMERGE from evidence; do not force these.
3.2 Rank: frequency × severity × fit (can a workflow-kit credibly address it?). Show the top 15
    with their strongest verbatim quotes.
3.3 **Coverage map:** for each top pain → kit status: `covered-measured` / `covered-unmeasured` /
    `partial` / `absent`, each with the file that proves the status. The `absent` and
    `covered-unmeasured` rows are the product roadmap.
3.4 **UX cut:** the specific first-run story the evidence demands (time-to-first-win target,
    question budget, cost disclosure, failure recovery), contrasted with W1b's factual description
    of what PSP does today. Gap list, ranked.
3.5 **Pre-registered demand hypotheses** H1–H8: falsifiable predictions about (a) what Tuesday's
    HN thread will complain/ask about, (b) what the first month of `/report-friction` issues will
    cluster on. Each hypothesis names the evidence row it derives from. These get GRADED publicly
    after launch — write them so grading is mechanical.
3.6 **Verdict:** rank the four standing design candidates — field-evidence/L3 methodology ·
    UX first-run overhaul · 2026-08-01 monthly architect prompt · multidomain structural spec —
    against the evidence, add any NEW candidate the evidence forced, and recommend today's top-2
    with one paragraph of reasoning each. Note explicitly which candidates the evidence does NOT
    support (that's a finding, not a failure).

## W4 — Wrap

4.1 Write `research/2026-07-11-user-pain-map.md` (structure: executive verdict → taxonomy →
    ranked top-15 with quotes → coverage map → UX cut → hypotheses → method + source log).
    Keep it under ~400 lines; the per-researcher raw tables land as
    `research/2026-07-11-user-pain-raw/<beat>.md`.
4.2 Commit: `research(demand): user-pain map + pre-registered demand hypotheses (pre-HN)`.
4.3 **STOP.** Present the verdict (3.6) and the hypotheses list to the operator in-chat. Do NOT
    begin building any design — that is a separate, operator-approved dispatch.

## Acceptance

- [ ] Every quote's URL fetch-verified; no dead citations
- [ ] Disconfirming-evidence section exists and is non-empty
- [ ] Coverage map has ≥3 honest `absent`/`covered-unmeasured` rows
- [ ] Hypotheses are falsifiable and mechanically gradeable post-launch
- [ ] Kit shipping surfaces untouched; only research/ files + this dispatch committed
- [ ] Budgets held (≤14 subagents, ≤4M tokens) — report actuals in the commit body
