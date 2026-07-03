# Dispatch — Supplemental Scan (Cowork desktop, hybrid-model Tier-2 coverage)

> **Primary surface:** Cowork desktop (full network egress — required). **Not** a cloud Claude Code Routine: the whole point is to cover sources the cloud routine's `github.com`+`npmjs.com` allowlist blocks.
> **Cadence:** weekly, Saturday ~08:00 local — runs *before* Sunday's weekly synthesis so the synthesis can roll up both the GitHub-only dailies and this supplemental file.
> **Output:** `vigilance/feed/daily/YYYY-MM-DD-supplemental.md` (daily-pulse format; the weekly synthesis reads `*-supplemental.md` files alongside the regular dailies).
> **First run:** 2026-06-01 (see that file for the worked example + the Tier-2 reality findings this dispatch encodes).

## Why this exists

The cloud vigilance routine (`DAILY_PULSE_SCAN.md`) runs under a restrictive egress allowlist — `github.com` + `npmjs.com` only (see `workflows/KIT-VIGILANCE.md` § "Cloud routine network limitations"). That permanently blocks **~18–22 of the 35 watchlist sources** at the routine level, including every Cat 1 vendor channel and every Cat 3 research source. WebSearch is *also* subject to the allowlist on cloud routines, so the documented Tier-2 fallback does not work there. Cowork desktop has unrestricted network, so this supplemental scan is the only path that covers the blocked sources. It is the operator-triggered half of the kit's hybrid vigilance model.

## Sources to cover (the cloud-blocked set)

Scan via WebSearch with `site:` filters + a 7-day date window (or since the last supplemental file):

- **Cat 1 vendor:** anthropic.com/news, anthropic.com/engineering + /research, openai.com/blog, deepmind.google, mistral.ai/news, x.ai/news
- **Cat 3 research:** arxiv.org cs.AI + cs.CL (keywords: agentic, LLM, multi-agent, RAG, RLAIF, constitutional, deliberation, debate, council, eval, self-refine), paperswithcode.com trends
- **Cat 4 practitioner:** simonwillison.net, eugeneyan.com, hamel.dev, jxnl.co, latent.space
- **Cat 5 community:** Hacker News (Claude/Anthropic/agentic), lesswrong.com AI tag — **Reddit excluded, see below**
- **Cat 8 Anthropic:** support.claude.com, claude.com/product, platform.claude.com/docs

## Method

Follow the same scan logic as `DAILY_PULSE_SCAN.md`: per source find what is NEW in the window; severity-tag conservatively (🚨 BLOCKER only for breaking changes / security advisories / GA the kit must respond to within days; ⚠ notable; 🟡 background; 🟢 noise). For every ⚠-or-higher item, run a **kit-compose check** (grep `knowledge-base/`, `workflows/`, `templates/`, `prompts/`, `generator/`) and state covered / partially-covered-stale / not-covered. Apply the production-vs-paper filter for Cat 3 (preprint = 🟡 unless working code + real adoption) and community-dwell discipline for Cat 5 (single-source = 🟡).

**Framing:** the value of this scan is finding what the GitHub blind-spot caused the most recent weekly synthesis to miss or mis-rank. For each finding note whether it confirms / challenges-and-re-ranks / is entirely new vs the current weekly action candidates.

## Tier-2 realities (empirical, from the 2026-06-01 first run — re-test at quarterly audit)

- **Reddit is blocked even via WebSearch** ("domains not accessible to our user agent"). There is no viable automated fetch from any path. Treat r/LocalLLaMA + r/ClaudeAI as **quarterly manual sample only** — do not spend scan budget trying to reach them.
- **`platform.claude.com/docs` returns real content to WebSearch** even though direct scrape gets a JS shell. WebSearch is the correct steady-state Tier-2 for Cat 8.
- **GitHub Advisory DB** (`github.com/advisories?query=mcp`) is reachable under the *cloud* allowlist — it belongs in the daily routine (Cat 7), not here. It closes the third-party-MCP-CVE blind-spot at the routine level.
- Budget: x.ai, latent.space, lesswrong, paperswithcode are low-fire; query them only if budget remains after the high-signal sources.

## Output format

Write `vigilance/feed/daily/YYYY-MM-DD-supplemental.md`, capped ~150 lines:
1. Header (type, window, sources-reached count, findings-by-severity count).
2. Executive summary + verdict: did the missed sources change the picture vs the current weekly candidates? Any new themes?
3. Findings grouped by severity. Each: source + URL, 1–2 line summary, kit-compose status, confirms/challenges/new, recommended cadence.
4. Source-health note: which sources reached vs not; any Tier-2 surprises (feeds the next quarterly audit + the hybrid-model doctrine).

Cite every factual claim with a URL. Never fabricate — "nothing notable" is a valid finding.

**Commit discipline:** write the file, then leave it for the operator to commit via `aikit-commit`. Do **not** run `git commit`/`git push` from the Cowork sandbox — it cannot clear `.git/*.lock` (see `HANDOFF.md`). Notify the operator with the summary so they can review + commit.
