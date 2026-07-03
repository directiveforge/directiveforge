# Kit Vigilance — Continuous Improvement Doctrine

> The discipline that prevents the most insidious failure mode of any knowledge base: silent staleness. Three cadences, eight source categories, one feedback loop that compounds rather than degrades.

---

## What this is

A meta-discipline applied to the kit itself. Every day at 8:00 local time, a Claude Code Routine (cloud-hosted, laptop-independent — Anthropic infrastructure) scans a curated watchlist of high-signal sources across the AI ecosystem (vendor changelogs, framework releases, research preprints, practitioner blogs, skill marketplaces, MCP ecosystem activity), severity-tags everything new, checks against what the kit already covers, commits a digest directly to the repo. Once a week, the digests get synthesized into a short list of action candidates. Once a month, the action candidates that have sustained signal get rolled into an architect prompt that dispatches a Code session to actually update the kit (new KB section, new skill stub, new template, new case-study).

The primary scheduling primitive is **Claude Code Routines** (`claude.ai/code/scheduled`, GA April 2026). Routines run on Anthropic-managed cloud infrastructure regardless of operator hardware state — laptop closed, dead battery, on a flight, on vacation — the routine fires anyway. Each routine clones the repo at run start and commits results back via routine git auth (no auth prompts, no failed pushes). Available to Pro / Max / Team / Enterprise plan tiers (Pro: 5 runs/day; Max: 15/day; Team/Enterprise: 25/day — our usage averages ~1.2 runs/day across the three cadences). The local fallback is Cowork scheduled tasks running against the kit folder; see § Cowork local fallback below.

The discipline eats its own dogfood: the monthly integration prompt is a KB-04 §5 architect prompt. The kit's own decision-engineering discipline drives the kit's own updates.

This file is the doctrine. The runnable artifacts are at `prompts/dispatch/DAILY_PULSE_SCAN.md`, `prompts/dispatch/WEEKLY_SYNTHESIS.md`, and `prompts/dispatch/MONTHLY_INTEGRATION.md`. The watchlist lives at `vigilance/WATCHLIST.md`. The digest archive lives at `vigilance/feed/`.

---

## Why this exists

KB-01 was written in March 2026. Two-thirds of it is still correct. The third that isn't, no one notices, because the doc reads fluently. Agents using the kit ship subtly outdated patterns. The gap compounds. By month 12 the kit recommends practices nobody runs anymore, and trust in the kit craters.

This is not a hypothetical failure mode. It is the *modal* failure mode for any knowledge base in a fast-moving field. The fix is not "write better docs" — every KB starts well-written. The fix is an operational practice that catches drift early enough to address it.

The naive version of this practice is "subscribe to newsletters." That fails because newsletters have no kit-compose awareness — they tell you what's new, not what's new *that the kit doesn't already have*. The kit ends up integrating duplicates, churning on transient hype, and growing into a junk drawer.

The right version of this practice is curated, severity-tagged, kit-aware, dwell-time-gated. It produces an action triage, not a newsletter. It rejects 90% of new signal as either already-covered, too-transient, or off-stack. The 10% that survives the filters compounds into a kit that gets better every month instead of worse.

---

## The three-cadence architecture

Different signal needs different cadences. Daily catches what's new. Weekly separates signal from noise. Monthly acts on what survived.

### Daily Pulse

**When:** every day, 8:00 local time (your local timezone (UTC offset configurable) — adjust in the scheduled task if your local time differs).

**What it does:**

1. Reads `vigilance/WATCHLIST.md` to know what sources to scan.
2. For each source: fetches via the most appropriate mechanism (RSS where available, scrape where necessary, search query where source is gated). Maintains per-source delta state in `vigilance/state/<source-slug>.json` (last-seen cursor / timestamp / hash).
3. Severity-tags every new item: 🚨 BLOCKER (kit must respond — new Anthropic model GA, breaking framework change, security advisory) / ⚠ HIGH (worth integrating into the kit) / 🟡 MEDIUM (interesting, monitor) / 🟢 LOW (background context).
4. For each ⚠+ item: runs a kit-compose check. Does the kit already cover this? If yes, tag as "already covered, no action." If no, tag with a candidate integration path (KB-X §Y / new skill / new template / new MCP entry / new case-study).
5. Writes the digest to `vigilance/feed/daily/YYYY-MM-DD.md`. Most days: short or empty above 🟡. When something fires, the digest has 🚨/⚠ items at the top with their action recommendations.
6. Commits the digest locally. Push is best-effort (no user prompt; if push fails on auth, the commit stays local and the next scheduled run or the user's next push catches up).

**Job:** capture signal, don't lose anything. The Daily Pulse is the floor sensor.

### Weekly Synthesis

**When:** every Sunday, 9:00 local time.

**What it does:**

1. Reads the past 7 daily digests from `vigilance/feed/daily/`.
2. Rolls up themes — what showed up on multiple days? what hit ⚠+ severity at least twice across the week?
3. Filters by dwell-time: signal that appeared once and never again is hype; it gets dropped from the action set (still preserved in the dailies, just not promoted).
4. For each surviving theme: re-runs the kit-compose check across the *aggregated* signal (a theme might cite five different sources making the same point — the kit-compose check evaluates against the synthesized claim, not each individual source).
5. Produces an action candidate list (≤5 items, severity-ranked) with recommended integration path per item.
6. Writes the synthesis to `vigilance/feed/weekly/YYYY-WW.md`. ISO week numbering.
7. Commits locally.

**Job:** separate signal from noise. The Weekly Synthesis is the filter.

### Monthly Integration

**When:** first day of each month, 10:00 local time.

**What it does:**

1. Reads the past 4 weekly synthesis files from `vigilance/feed/weekly/`.
2. For each action candidate that has appeared in ≥2 weekly synths (the dwell-time gate): promotes to integration candidate. Items that appeared in only 1 week get deferred (re-evaluated next month).
3. For each integration candidate: produces a fully-formed architect prompt per KB-04 §5 (Identity / Mission / Ground rules / Knowledge manifest / Severity-tagged research questions / 8-Gate Framework / Domain scenarios / Deliverable format / Quote library / Cross-reference index / Uncertainty log / Out of scope / Success criteria). The prompt is paste-ready for a fresh Code session.
4. Bundles the architect prompts into `vigilance/feed/monthly/YYYY-MM.md` as a manifest with one architect prompt per integration candidate.
5. Commits locally.
6. The user reviews the monthly manifest, picks the architect prompts worth dispatching, and runs them through Code sessions. Code does the actual kit updates (new KB sections, new skill stubs, new templates, new case-study entries) and commits as separate PRs.

**Job:** act on sustained signal, not transient hype. The Monthly Integration is the writer.

The cadences are deliberately staged: daily captures, weekly filters, monthly writes. Skipping a cadence collapses the discipline. Running monthly without weekly means transient hype gets integrated. Running weekly without daily means significant signal gets missed. Running daily without weekly/monthly means signal accumulates without ever turning into kit improvements.

---

## Source taxonomy — eight categories

Diversity prevents blind spots. If all sources are Anthropic-leaning, the kit develops a single-vendor bias. If all sources are practitioner blogs, the kit misses primary research. The watchlist must span all eight categories. The quarterly audit flags categories that go quiet (zero ⚠+ fires in 90 days → either the category is genuinely dormant or the sources in it are stale).

### 1. Official vendor channels (LLM providers)

Anthropic news, Anthropic engineering, OpenAI changelog, Google DeepMind blog, Mistral AI, Meta AI Research, x.ai news. These are where new model launches, capability changes, and pricing shifts originate. Highest signal-to-noise per fetch.

### 2. Framework release channels (agentic frameworks)

Claude Code releases, Claude Agent SDK, LangGraph, LangChain core, AutoGen, CrewAI, DSPy, LlamaIndex, BAML, Pydantic AI. New major versions often break compatibility with locked kit patterns. Watching releases.atom feeds catches breaking changes within hours of release.

### 3. Research (academic preprints + proceedings)

arXiv cs.AI and cs.CL new submissions (filtered by relevance), Papers With Code trending, major conference proceedings when they drop (NeurIPS, ACL, ICML, ICLR, EMNLP). Production-vs-paper filter applies hard here — preprints get a 🟡 by default and only graduate to ⚠ with explicit replication or implementation reference.

### 4. Practitioner blogs (in-the-trenches experience)

Simon Willison, Eugene Yan, Hamel Husain, Jason Liu, Latent Space, Andrew Ng's DeepLearning.AI The Batch. The signal is post-hoc: what actually worked when someone built with these tools. Higher reliability than vendor announcements but lower freshness.

### 5. Community (aggregated discourse)

r/LocalLLaMA, r/MachineLearning, HackerNews AI-tagged stories, LessWrong AI-tag. Surfaces patterns that nobody is officially announcing but everyone is discovering. Noise level is highest; severity tagging is most important here.

### 6. Skill / agent marketplaces

Claude Code skills marketplace, OpenAI GPT directory trending, LangChain Hub trending. Tracks what patterns are actually being adopted at scale. Adoption count is a useful signal — a skill with 10K downloads has stronger production evidence than a paper with 10K citations.

### 7. MCP ecosystem

modelcontextprotocol/servers official registry, awesome-mcp-servers, npm/PyPI new packages tagged `mcp-server-*`, security advisories on MCP packages. The MCP ecosystem changes weekly; the kit's MCP-SERVER-REGISTRY needs vigilant maintenance to stay accurate.

### 8. Anthropic-specific (where the kit's primary integration target lives)

support.claude.com articles (Claude Code feature docs, Cowork docs, Chat affordances), claude.com/product/ announcements, Anthropic engineering blog. The kit's surface routing rubric depends on this category being current. Refresh cadence here is by far the most aggressive.

---

## Source selection criteria — what gets on the watchlist

Not every source is worth scanning. The bar:

1. **Primary or near-primary.** The source is either the originator of the information (Anthropic's own announcement) or an immediate aggregator with editorial judgment (Simon Willison commenting on Anthropic's announcement). Tertiary commentary blogs are excluded.

2. **High signal-to-noise.** Over the past 90 days, the source has produced at least 3 items that would have justified a ⚠+ tag. Sources that fire 100 items a week of which 99 are noise are excluded.

3. **Diversity contribution.** The source adds something the rest of the watchlist doesn't already cover. Two Anthropic-leaning practitioner blogs are redundant; one Anthropic-leaning + one OpenAI-leaning + one open-model-leaning is balanced.

4. **Fetchable.** RSS preferred. Stable HTML scrapable as backup. Auth-walled sources are problematic for unattended scheduled fetches; if a source requires auth, we either skip it or rely on aggregators that re-publish.

5. **Active.** The source has posted at least once in the past 30 days. Dormant sources get flagged in the quarterly audit and either dropped or watched for revival.

Sources that fail any criterion get rejected at watchlist time, not at scan time. The watchlist is curated; the scan is mechanical.

---

## The scan logic in detail

### Delta detection

Per source, the scan keeps state in `vigilance/state/<source-slug>.json`:

```json
{
  "source_slug": "anthropic-news",
  "url": "https://www.anthropic.com/news",
  "fetch_strategy": "rss",
  "last_fetched_utc": "2026-05-24T04:00:00Z",
  "last_seen_cursor": "2026-05-23T18:42:00Z",
  "last_seen_item_hash": "ab39…",
  "consecutive_empty_scans": 0,
  "consecutive_failures": 0
}
```

The scan only surfaces items newer than `last_seen_cursor`. After successful fetch, `last_seen_cursor` advances to the newest item's timestamp.

### Severity tagging

Severity is decidable from the item's content + the kit's existing scope:

- **🚨 BLOCKER** — the kit *must* respond within days. New Anthropic model GA. Breaking framework change in a locked dependency. Security advisory on an MCP the kit recommends. Anthropic surface launch that changes the routing rubric.
- **⚠ HIGH** — worth integrating into the kit within the month. New skill pattern with measurable adoption. New framework feature that changes a locked recommendation. New research with clear production-implementation path.
- **🟡 MEDIUM** — interesting; monitor for dwell-time. Speculative pattern. Niche tooling. Single-source claim that hasn't been corroborated yet.
- **🟢 LOW** — background context. Trends, opinions, soft signal.

The scan applies severity automatically but conservatively. Anything ambiguous gets the lower severity (a borderline 🚨/⚠ item gets ⚠). The Weekly Synthesis can promote items based on aggregated signal; the Daily Pulse should not over-promote.

### Kit-compose check

Before any ⚠+ item lands as an "action candidate," it gets cross-checked against the kit:

1. Grep the kit (`grep -rli "<topic-keyword>" knowledge-base/ workflows/ generator/ templates/ prompts/`) — does the kit already mention this?
2. If yes: tag the item as "already covered" + cite the file the kit covers it in. No action; just note for the audit log.
3. If no: tag the item with a candidate integration path (specific file path: `KB-01 §5.X` / `templates/<new-skill-name>/SKILL.md` / `knowledge-base/MCP-SERVER-REGISTRY.md` / `case-studies/<project>/<artifact>.md`).

The kit-compose check is what prevents the discipline from churning on duplicates. It is the single highest-leverage filter in the scan.

### Action recommendation

For each ⚠+ item that survives the kit-compose check, the recommendation includes:

- **Integration target** (which kit file, which §section, what kind of change).
- **Effort estimate** (one-line change / paragraph / new section / new file / new architect-prompt dispatch).
- **Production-vs-paper status** (already shipped in N production frameworks / only in academic preprints / only in vendor announcements / mixed).
- **Dwell-time so far** (first seen N days ago / has appeared in M daily digests).
- **Recommended cadence** (handle this week / queue for monthly integration / continue monitoring).

---

## Seven degradation modes — what we design against

The discipline works only if these failure modes are explicitly fenced.

### 1. Trend chasing

The most common failure. Twitter loves prompts that sound clever and don't survive production. Newsletters echo each other on the same week's hot take.

**Fence:** the production-vs-paper filter (`vigilance/WATCHLIST.md` source selection criterion #1 + the action recommendation's status field). Nothing graduates to kit integration without ≥10 production references or working implementation in a maintained framework.

### 2. Noise contamination

If the kit integrates everything shiny, it becomes a junk drawer where users can't find anything because everything is in it.

**Fence:** the dwell-time gate (Monthly Integration §2). Items must appear in ≥2 weekly synths before promotion to integration candidate. Pure spikes don't graduate.

### 3. Echo chambers

Same Twitter circle re-sharing same takes makes a single source look like five. The signal feels strong but rests on one origin.

**Fence:** the source-diversity check (Weekly Synthesis flags themes that rest on ≤2 source categories). A "theme" that all comes from practitioner blogs and zero from vendor channels or research gets demoted.

### 4. Scope creep

Kit grows in size without growing in value. Every new section is justified locally but the aggregate becomes unmaintainable.

**Fence:** every integration must answer "what does this REPLACE?" If the answer is "nothing — it's additive," the bar raises (the new content must clearly serve a use case no existing section covers).

### 5. Conflicting integrations

A new skill recommends a pattern that contradicts a locked KB rule.

**Fence:** the monthly integration architect prompt includes mandatory cross-DECISIONS reconciliation per KB-04 §2.6. Conflicts get surfaced before integration, not after.

### 6. Source bias

If all sources lean toward one vendor or one school of thought, the kit develops blind spots.

**Fence:** category-balance check in the quarterly audit. If any of the 8 source categories has zero ⚠+ fires in 90 days, the audit either prunes (the category is dormant for valid reasons) or expands (the existing sources in the category are weak; add new ones).

### 7. Stale watchlist

Sources go quiet, change owners, change formats. The watchlist doesn't update. Eventually the scan runs against half-dead sources.

**Fence:** quarterly watchlist audit (next protocol section). Track which sources fired ⚠+ findings; drop the ones that haven't fired in 180 days; add new ones surfaced from cross-references in the dailies.

---

## Quarterly watchlist audit protocol

First day of every quarter (Jan 1, Apr 1, Jul 1, Oct 1), the user runs the watchlist audit manually. It is not a scheduled task because it requires human judgment.

**Inputs:**
- All daily digests from the past 90 days.
- All weekly synthesis files from the past 90 days.
- Current `vigilance/WATCHLIST.md`.

**Outputs:**
- Per-source stats: total items surfaced, ⚠+ items, kit-integrations triggered.
- Sources with zero ⚠+ in 90 days → propose drop OR explain why kept.
- New source candidates → cited from cross-references in the past quarter's dailies (e.g., "Simon Willison frequently linked to <new blog> — propose add").
- Category balance check: any category with zero ⚠+ over 90 days flagged.
- Decision: update the watchlist + commit.

The audit produces a markdown report at `vigilance/feed/quarterly/YYYY-Q.md` and a watchlist diff. Both get committed.

---

## Success metrics

The vigilance discipline is working when:

1. **The kit gets quantifiably better quarter-over-quarter.** Measurable via: number of integration architect prompts dispatched per quarter, number that resulted in shipped kit updates, average dwell-time from first-signal to kit-integration.
2. **No silent staleness incidents.** Defined as: a user discovers an outdated kit pattern not because the vigilance discipline surfaced it but because they hit the friction in production. If a stale-pattern incident occurs, post-mortem the vigilance discipline — which sources missed it, why didn't it fire.
3. **Watchlist stays balanced across all 8 categories.** No category goes dormant for more than one quarter without an explicit decision to deprioritize it.
4. **Daily digest fatigue stays low.** The user actually reads weekly synth files. If they stop, severity tagging is over-firing (too many ⚠ — calibrate down) or the source list is too noisy (audit early).
5. **The discipline auto-prunes hype.** Items that look exciting in week 1 and dead by week 4 never appear in monthly integration. Track post-hoc: of all 🚨/⚠ items that fired in dailies, what percentage graduated to integration? Healthy range: 10–30%. Below 10% = severity tagging is over-firing. Above 30% = the kit is integrating too easily; raise the dwell-time gate.

---

## Anti-patterns — never do this

1. **Auto-merge findings into the kit.** Every kit change goes through a Code session with explicit human review. The vigilance discipline produces *candidate* integrations, never automatic edits.
2. **Subscribe to a generic AI newsletter and trust it.** Newsletters are sources, not synth. The discipline's value is in the kit-compose check; newsletters don't do that.
3. **Treat severity tags as decorative.** A 🚨 tag means the kit must respond within days. If the user dismisses 🚨 tags routinely, either severity is over-firing (re-calibrate downward) or the kit's blast radius is too small (the discipline is overkill — drop to weekly cadence).
4. **Let the watchlist grow without pruning.** A watchlist of 200 sources at quarterly audit means 170 are dead weight. Prune ruthlessly.
5. **Skip the kit-compose check.** Without it, every integration is duplicative. Within 6 months the kit has three sections on the same topic with subtly conflicting recommendations.
6. **Lower the dwell-time gate "just this once."** Once you graduate transient hype, the discipline collapses. The dwell-time gate is what separates this from a newsletter.
7. **Run the scheduled tasks but never read the outputs.** The discipline is a feedback loop with a human in it. If the human stops reading, the loop is broken.

---

## Connection to KB-04 — the self-referencing pattern

The Monthly Integration prompt produces a KB-04 §5 architect prompt. That architect prompt then dispatches a Code session to update the kit. The Code session may itself produce a DECISIONS.md entry (per KB-04 §2 discipline) if the integration is consequential enough to warrant a lock.

So:

- The kit teaches decision engineering (KB-04).
- The vigilance discipline applies decision engineering to the kit's own updates.
- Each kit update follows the kit's own discipline.

This isn't a coincidence — it's intentional. The kit's value rests on the discipline being internally consistent. If the kit's own updates were governed by a *different* discipline (ad-hoc, gut-feel, "what we think we should add"), the kit would slowly drift away from the discipline it teaches. By applying KB-04 to the kit itself, the discipline reinforces itself.

The integration path:

```
Daily Pulse digest
   ↓ (7 days)
Weekly Synthesis
   ↓ (4 weeks, dwell-time gate)
Monthly Integration → architect prompt (KB-04 §5 format)
   ↓ (Code session)
Kit update (new KB section / skill / template / case-study)
   ↓ (if consequential)
DECISIONS.md entry locks the new pattern
   ↓ (90 days)
Quarterly audit verifies the integration is still serving its purpose
```

Each step is the same discipline at a different cadence. The compounding effect: as the kit grows, the discipline grows with it. The kit at month 12 is not the kit at month 1 plus 11 months of accretion — it's the kit at month 1 plus 11 months of curated, dwell-gated, kit-aware, severity-tagged, KB-04-disciplined improvements.

---

## What this discipline is NOT

- Not a newsletter. The output is an action triage, not a narrative summary.
- Not an auto-merge bot. Nothing lands in the kit without a Code session reviewing.
- Not a Twitter feed reader. Curated source lists only, no raw timeline.
- Not a way to chase trends. The dwell-time gate and production-vs-paper filter actively slow integration.
- Not a substitute for thinking. The discipline produces candidates; the user (with Code) decides.
- Not free. It costs WebSearch/WebFetch quota, daily attention to the weekly synth (~5 minutes), monthly attention to the integration plan (~30 minutes). The cost is justified by the kit's compounding quality; if the kit isn't compounding, drop the discipline.
- Not project-specific. The vigilance discipline is multidomain like the rest of the kit. Project-specific applications (e.g., a vigilance scan for a particular product's competitive landscape) live in case-studies, not here.

---

## Cross-references

- `vigilance/WATCHLIST.md` — the curated source list (8 categories, ~30 sources at v1.0).
- `vigilance/feed/` — digest archive (daily / weekly / monthly / quarterly subfolders + state).
- `prompts/dispatch/DAILY_PULSE_SCAN.md` — runnable scan prompt body (used by both Routines and Cowork fallback).
- `prompts/dispatch/WEEKLY_SYNTHESIS.md` — weekly synthesis prompt body (used by both Routines and Cowork fallback).
- `prompts/dispatch/MONTHLY_INTEGRATION.md` — manual-trigger prompt (first of month).
- `knowledge-base/KB-04-DECISION-ENGINEERING.md` — the discipline whose §5 architect-prompt format the Monthly Integration produces.
- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — surface fit for the scheduled tasks (Claude Code Routines primary, Cowork local fallback) and the integration phase (Code).

---

## Cloud routine network limitations (locked 2026-05-28)

**Empirical finding from vigilance daily-pulse 5/27 + 5/28:** Claude Code Routines run in a cloud environment with a **restrictive network egress allowlist**. As of 2026-05-28, the routines runtime permits outbound HTTP only to:

- `github.com` + `api.github.com` (GitHub feeds, including `*.atom` release/commit feeds)
- `npmjs.com` + `registry.npmjs.org` (npm registry queries)
- Sometimes `platform.claude.com/docs` (formerly `docs.claude.com`, now 301-redirected; 5/27 reachable, 5/28 not — inconsistent)

All other hosts return HTTP 403 with `x-deny-reason: host_not_allowed`. This affects **22 of the kit's 35 watchlist sources** — every Cat 1 vendor channel (Anthropic news/research, OpenAI, DeepMind, Mistral, x.ai), every Cat 3 research source (arXiv, Papers With Code), every Cat 4 practitioner blog (Willison, Yan, Husain, Liu, Latent Space), every Cat 5 community discourse (Reddit, HackerNews, LessWrong), and Cat 8 Anthropic-specific docs that depend on JS rendering.

**Implication for Tier-2 fallback discipline.** The "WebSearch with site: filter" Tier-2 strategy documented in `vigilance/WATCHLIST.md §Fetch reliability` was conceived under the assumption that WebSearch goes through a different network path than direct WebFetch. Empirically (2026-05-28 routine output), this is **NOT true** in the cloud routines environment — WebSearch is subject to the same egress allowlist. Tier-2 fallback as documented does not work on cloud routines.

### Hybrid model — recommended response

Until Anthropic loosens the cloud routines network policy, the kit's vigilance discipline operates under a **hybrid model**:

- **Cloud routines (daily 08:00):** scan the 13 reachable sources (all GitHub release/commit atoms + npm new-package searches). This is the always-on, laptop-independent baseline. Catches all framework-release and security-commit signal — the operationally-critical category.
- **Periodic Cowork desktop session (operator-triggered, suggested weekly):** open Cowork on the operator's local machine, run the dispatch from `prompts/dispatch/SUPPLEMENTAL_SCAN.md`, scan the cloud-unreachable sources. Cowork desktop has full network access (the operator's local egress, not the cloud allowlist), so vendor channels + practitioner blogs + research feeds all reachable. Output appended to that day's `vigilance/feed/daily/YYYY-MM-DD.md` as a supplemental section, or saved as separate `YYYY-MM-DD-supplemental.md`.

The weekly synthesis routine reads both the daily files + any supplemental files when present, so the discipline's filtering + dwell-gating logic remains intact across the two paths.

**Status — operational as of 2026-06-01.** The first supplemental scan ran 2026-06-01 (`vigilance/feed/daily/2026-06-01-supplemental.md`), covering week 2026-22's blocked sources after the weekly synthesis flagged the ~18-source outage as a 🚨 source-health failure. It confirmed the weekly-22 candidates and surfaced two new themes (Apple Xcode 26.3 Agent-SDK surface; cross-vendor managed-agent convergence) plus a third-party-MCP-CVE blind-spot. The scan is now formalized as a dedicated dispatch (`prompts/dispatch/SUPPLEMENTAL_SCAN.md`) and a recurring **Saturday 08:00** Cowork scheduled task (`kit-vigilance-supplemental-scan`). Empirical Tier-2 updates from that run are folded into `vigilance/WATCHLIST.md`: Reddit is unreachable even via WebSearch (manual-only); `platform.claude.com/docs` returns real content to WebSearch (correct Cat-8 Tier-2); GitHub Advisory DB added to Cat 7 (reachable under the cloud allowlist — closes the MCP-CVE gap at the routine level).

### Operator action — until Anthropic widens cloud routines network

1. Treat cloud-routine daily output as **complete for GitHub + npm signal**; **partial for everything else**.
2. Once per week (Saturday 08:00, before Sunday's weekly synthesis), the `kit-vigilance-supplemental-scan` Cowork task runs `prompts/dispatch/SUPPLEMENTAL_SCAN.md` to supplement (set up 2026-06-01).
3. Document the cloud-vs-Cowork-source split in the project's `vigilance/WATCHLIST.md` (mark each source `tier1` reachable from cloud vs `desktop-only`).
4. Quarterly audit: re-test cloud routines network reachability — Anthropic may widen the allowlist.

### Why not migrate back to Cowork desktop tasks entirely (undo v0.12.0)

Tempting but bad trade-off. Cowork desktop tasks require Claude Desktop running + system awake at scheduled time. Laptop closed = missed runs. Cloud routines fire regardless of laptop state. The 13 reachable cloud-routine sources are exactly the highest-signal-per-fetch category (framework release feeds, npm security advisories) — losing those guarantees daily coverage would degrade the discipline more than losing 22 lower-signal sources daily.

The hybrid model preserves the best of both: cloud-always-on for high-signal feeds, operator-weekly-Cowork for breadth.

---

## Cowork local fallback

If Claude Code Routines is unavailable on the operator's plan tier OR the operator wants local-only execution (no cloud dependency, no shared rate-limit pool with Anthropic-hosted runs), the same dispatch prompts can run via Cowork scheduled tasks against the local kit folder. Set up via the Cowork Schedule sidebar: each task is a short wrapper that opens `~/Projects/AI/` and executes the corresponding `prompts/dispatch/*.md` file.

Trade-offs vs. Routines: Cowork tasks require Claude Desktop running + system awake at scheduled time. If the laptop is asleep, the task fires on next wake (catch-up). Push to remote requires local git auth (Routines handles this via its own auth). Cowork tasks live outside the repo (in `~/Documents/Claude/Scheduled/`) and don't version-control their prompts the way Routines do.

Use Routines when available. Use Cowork fallback only when Routines is genuinely unavailable.
- `workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md` — surface composition for hybrid Cowork → Code handoffs.

The vigilance discipline ships as v0.11.0 of the kit. CHANGELOG entry documents the initial watchlist + the cadence locks.

- **Release-gate cadence:** every minor kit release (x.Y.0) re-runs the proof harness per `harness/RUNBOOK.md` and commits new dated scorecards to `harness/results/`. A grade regression against the prior baseline is release-blocking until dispositioned.
