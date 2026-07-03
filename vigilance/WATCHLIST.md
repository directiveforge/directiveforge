# Vigilance Watchlist — Curated Source List

> The 32 sources the Daily Pulse scans every morning. Curated, balanced across 8 categories, audited quarterly. See `workflows/KIT-VIGILANCE.md` for the doctrine and `prompts/dispatch/DAILY_PULSE_SCAN.md` for the runnable scan.

**Last audit:** initial commit (v0.11.0, 2026-05-25). Next audit due: 2026-07-01.

**Source count:** 32 active sources across 8 categories. Quarterly target: 25–40 active sources, balanced ≥3 per category.

**Severity defaults per category** (the Daily Pulse applies these as starting tags; can be promoted/demoted per item per the doctrine):

| Category | Default ceiling | Notes |
|---|---|---|
| Vendor channels | 🚨 BLOCKER possible | New model GA / pricing change / surface launch all qualify |
| Framework releases | ⚠ HIGH possible | Breaking changes only get 🚨 if a locked kit pattern depends on the old behavior |
| Research preprints | 🟡 MEDIUM default | Production-vs-paper filter: 🟡 unless ≥10 production references or working implementation |
| Practitioner blogs | ⚠ HIGH possible | High signal; severity scales with author's track record |
| Community discourse | 🟡 MEDIUM default | Noise is high; rarely promotes above ⚠ without aggregated dwell-time |
| Skill marketplaces | ⚠ HIGH possible | Adoption count is the signal — downloads × 1k = ⚠+ candidate |
| MCP ecosystem | ⚠ HIGH; 🚨 for security advisories | The kit's MCP registry depends on this being current |
| Anthropic-specific | 🚨 BLOCKER possible | Surface routing rubric depends on these being live-current |

---

## Category 1 — Official vendor channels (6 sources)

The originators. Highest signal-to-noise per fetch; lowest tolerance for staleness.

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 1 | Anthropic news | `https://www.anthropic.com/news` | RSS (`/news/rss.xml` if available; verify at first scan and fall back to scrape) | Model launches, capability changes, Anthropic surface announcements. Highest-priority source in the watchlist. |
| 2 | Anthropic research | `https://www.anthropic.com/research` | RSS or scrape | Constitutional AI extensions, interpretability work, alignment papers. Lower freshness than news but high integration value. |
| 3 | OpenAI blog | `https://openai.com/blog/rss/` | RSS | Tracks frontier model behavior even though the kit's primary target is Claude — OpenAI shifts often pull industry standards with them. |
| 4 | Google DeepMind blog | `https://deepmind.google/discover/blog/` | Scrape (no clean RSS as of audit date — verify quarterly if RSS appears) | Gemini family + research output. |
| 5 | Mistral AI news | `https://mistral.ai/news/` | RSS if present, else scrape | Open-weights frontier; tracks the open-model alternative to Claude/GPT. |
| 6 | x.ai news | `https://x.ai/news` | Scrape | Grok model line; mostly low-fire but new entrants matter for ecosystem balance. |

**Why all six.** Anthropic-only watchlist creates a single-vendor bias. The kit's surface routing recommendations need cross-vendor awareness — if OpenAI ships a feature that changes what users expect from Chat-class surfaces, the kit needs to know. Mistral / DeepMind / x.ai keep the watchlist honest about ecosystem-wide trends.

---

## Category 2 — Framework release channels (10 sources)

Where breaking changes originate. GitHub releases.atom feeds are gold here — clean RSS, dated, structured.

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 7 | Claude Code releases | `https://github.com/anthropics/claude-code/releases.atom` | RSS | THE highest-priority release feed. Surface changes, slash command additions, plan-mode tweaks, hook changes, MCP integration shifts all land here. |
| 8 | Anthropic Python SDK | `https://github.com/anthropics/anthropic-sdk-python/releases.atom` | RSS | API parameter shifts; affects every Claude integration. |
| 9 | LangGraph | `https://github.com/langchain-ai/langgraph/releases.atom` | RSS | Stateful agent orchestration; reference frame for multi-agent patterns the kit will integrate into KB-04 / KB-05. |
| 10 | LangChain core | `https://github.com/langchain-ai/langchain/releases.atom` | RSS | The agentic-framework lingua franca; patterns here often propagate to other frameworks. |
| 11 | Microsoft AutoGen | `https://github.com/microsoft/autogen/releases.atom` | RSS | Multi-agent council / debate patterns originate disproportionately here. |
| 12 | CrewAI | `https://github.com/crewAIInc/crewAI/releases.atom` | RSS | Role-based agent orchestration. |
| 13 | DSPy | `https://github.com/stanfordnlp/dspy/releases.atom` | RSS | Prompt optimization + structured programming model; the place to watch for "prompts as code" shifts. |
| 14 | LlamaIndex | `https://github.com/run-llama/llama_index/releases.atom` | RSS | RAG patterns + agentic-RAG. |
| 15 | Pydantic AI | `https://github.com/pydantic/pydantic-ai/releases.atom` | RSS | Type-safe agentic patterns; the kit recommends Pydantic v2 enforcement (KB-03 derives from this lineage). |
| 16 | BAML | `https://github.com/BoundaryML/baml/releases.atom` | RSS | LLM-function definitions as types; emerging standard. |

**Why these ten.** Each framework occupies a distinct niche. The kit doesn't recommend a specific framework universally — it teaches patterns. So all ten get watched, and the kit integrates patterns observed across multiple frameworks (a pattern that ships in 3+ of these is far stronger evidence than one that ships in 1).

**Note on Claude Agent SDK.** As of audit date, the Agent SDK ships inside the broader `anthropic-sdk-python` (#8) and is documented at `platform.claude.com/docs` (Agent SDK docs; formerly `docs.claude.com/agent-sdk`, now 301-redirected). If a standalone repo materializes during a quarterly audit, add it as #17.

---

## Category 3 — Research (3 sources)

Academic preprints + proceedings. Lowest base-rate of ⚠+ promotion (production-vs-paper filter is harsh) but highest ceiling when something does land.

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 17 | arXiv cs.AI new submissions | `http://export.arxiv.org/rss/cs.AI` | RSS | Daily new submissions. The scan filters by relevance keywords (agentic, LLM, multi-agent, RAG, RLAIF, constitutional, deliberation, debate, jury, council, self-refine, tree-of-thoughts, graph-of-thoughts) before severity-tagging. |
| 18 | arXiv cs.CL new submissions | `http://export.arxiv.org/rss/cs.CL` | RSS | Same filtering. CL (Computational Linguistics) overlaps with cs.AI; both watched because some agentic papers land in only one. |
| 19 | Papers With Code trending | `https://paperswithcode.com/trends` | Scrape | Filters for papers with working code (production-vs-paper filter passes by construction). Trending ≠ adopted, but trending + code = stronger signal. |

**Production-vs-paper filter.** A preprint gets 🟡 by default. It graduates to ⚠ only with one of:
- Reproducible code in the paper's official repo with non-trivial activity (not a stub).
- Integration in any of the Category 2 frameworks within 30 days.
- Citation in a Category 4 practitioner blog with an implementation reference.

If none of these are present, the preprint stays 🟡 forever — useful as background, not as a kit-integration candidate.

---

## Category 4 — Practitioner blogs (5 sources)

In-the-trenches signal. Lower freshness than vendor announcements but higher reliability for "does this actually work."

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 20 | Simon Willison | `https://simonwillison.net/atom/everything/` | RSS | Highest-signal practitioner blog in the ecosystem as of audit date. Covers Claude / Anthropic + tooling + MCP + skills with hands-on rigor. |
| 21 | Eugene Yan | `https://eugeneyan.com/rss/` | RSS | ML systems perspective; the practitioner's practitioner. Lower posting frequency, higher per-post value. |
| 22 | Hamel Husain | `https://hamel.dev/index.xml` | RSS | Evals + agentic-AI production patterns; co-runner of the influential "AI engineering" course material. |
| 23 | Jason Liu | `https://jxnl.co/feed.xml` | RSS | Structured outputs, instructor library, agentic data workflows. |
| 24 | Latent Space | `https://www.latent.space/feed` | RSS | Aggregates ecosystem signal (podcast + newsletter); occasionally surfaces things the vendor channels haven't announced yet. |

**Why these five.** Each has a distinct lens: Willison (tool-user), Yan (systems), Husain (evals), Liu (structured outputs), Latent Space (ecosystem). Together they triangulate well. Quarterly audit checks whether any of them have gone dormant or whether new voices have emerged.

---

## Category 5 — Community discourse (4 sources)

Aggregated patterns that nobody is officially announcing but everyone is discovering. Highest noise level; severity tagging is most important here.

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 25 | r/LocalLLaMA | `https://www.reddit.com/r/LocalLLaMA/hot/.rss` | RSS | Open-model community; tracks frontier-vs-open trade-offs, novel fine-tuning patterns, deployment tricks. |
| 26 | r/ClaudeAI | `https://www.reddit.com/r/ClaudeAI/hot/.rss` | RSS | Claude-specific patterns; surfaces real-user pain points that the kit may need to address. |
| 27 | HackerNews AI filter | `https://hnrss.org/newest?q=Claude+OR+%22agentic+AI%22+OR+LLM+OR+Anthropic` | RSS filter | Industry-wide AI/LLM stories that hit HN; high-quality discussion in the comments. |
| 28 | LessWrong AI tag | `https://www.lesswrong.com/tag/ai.rss` | RSS | Alignment + capability + practical agentic patterns from a rigor-leaning community. |

**Severity discipline here.** A trending Reddit post is 🟡 by default. It graduates to ⚠ only if (a) it cites a primary source we can verify, OR (b) the same pattern appears in ≥2 community sources within 7 days (cross-community dwell). Single-source community claims stay 🟡.

---

## Category 6 — Skill / agent marketplaces (2 sources)

Adoption signal. Downloads + stars are the strongest production evidence available.

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 29 | Claude Code skills marketplace | `https://platform.claude.com/docs` (skills listing; formerly `docs.claude.com/skills`) or equivalent as of audit date | Scrape (verify URL at first scan) | If/when Anthropic ships a public skills marketplace UI, this is the canonical source. Until then, the skill examples in `anthropics/anthropic-cookbook` GitHub fill in. |
| 30 | Anthropic Cookbook | `https://github.com/anthropics/anthropic-cookbook/commits.atom` | RSS | Where Anthropic ships canonical example skills and patterns. Commits.atom catches new patterns within minutes of merge. |

**Pending watchlist additions** (verify at quarterly audit):
- OpenAI GPT directory trending — auth-walled at audit date; if Anthropic ships an equivalent that's RSS-able, add.
- LangChain Hub trending — depends on whether Hub gets a public-facing changelog.

---

## Category 7 — MCP ecosystem (4 sources)

The kit's MCP-SERVER-REGISTRY needs the most vigilant maintenance. New servers ship weekly; security advisories on existing servers ship occasionally.

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 31 | MCP servers official registry | `https://github.com/modelcontextprotocol/servers/commits/main.atom` | RSS | New server additions, version bumps, deprecations. Auto-triages: new server commit → 🟡 (evaluate); deprecation commit → ⚠ (kit registry may need update); security commit → 🚨 (kit registry must update). |
| 32 | Awesome MCP servers | `https://github.com/punkpeye/awesome-mcp-servers/commits/main.atom` | RSS | Community-curated; surfaces servers the official registry hasn't accepted yet. Lower trust default, higher coverage. |
| 32b | GitHub Advisory DB (MCP) | `https://github.com/advisories?query=mcp` | Scrape (GitHub-hosted — **reachable under the cloud routine allowlist**) | CVE-level advisories for MCP servers. Catches third-party server vulns that don't surface in the official-registry commit feed (e.g. the PraisonAI / n8n-mcp May-2026 cluster the narrow scan missed). Added 2026-06-01. Auto-triage: critical/high CVE on a kit-recommended server → 🚨; on a non-kit server → ⚠ hygiene note. |
| (placeholder) | npm new mcp-server-* packages | Search query — `https://www.npmjs.com/search?q=mcp-server-` (sort by date) | Scrape with daily delta | Catches third-party MCP servers that aren't in either curated list yet. Production-vs-paper filter applies (downloads + maintenance + license check before promotion). |

---

## Category 8 — Anthropic-specific (3 sources)

The kit's primary integration target. Surface routing rubric depends on these being current.

| # | Source | URL | Fetch | Notes |
|---|---|---|---|---|
| 33 | support.claude.com articles | `https://support.claude.com/en` | Scrape recent-updates (no clean RSS as of audit date; verify quarterly) | Claude Code feature docs, Cowork docs, Chat affordances, plan-tier specifics. Source of truth for `CLAUDE-SURFACE-ROUTING.md` refresh. |
| 34 | claude.com/product changes | `https://www.claude.com/product` | Scrape periodic snapshot | Surface launches and product-page restructures. Lower freshness than #1 (news) but catches feature-page updates news posts don't announce. |
| 35 | Anthropic platform docs | `https://platform.claude.com/docs` (formerly `docs.claude.com`, 301-redirected) | Scrape recent | API docs, Agent SDK docs, skill docs. Where capability details first land before getting summarized in news posts. |

---

## Fetch-strategy primer

The Daily Pulse scan applies these conventions:

- **RSS preferred.** Lighter than scraping; structured; date-stamped. Use the `.atom` or `.rss` URL if either is provided.
- **GitHub releases / commits.** Always prefer `/releases.atom` over the HTML releases page. For commit-level signal, `/commits/main.atom` is reliable.
- **Reddit.** Append `/.rss` to any subreddit URL. Rate-limit gentle (1 req/source/day is fine).
- **arXiv.** RSS feed updates daily around 01:00 UTC; the kit's 04:00 UTC scan catches the previous day's new submissions.
- **Scrape with politeness.** When RSS isn't available: User-Agent identifying the kit + 2s min delay between requests + cached If-Modified-Since headers where supported. Don't hammer.
- **Auth-walled sources.** Skip. The vigilance scan runs unattended and should never require credential prompts.
- **Failure handling.** Track `consecutive_failures` per source in `vigilance/state/<slug>.json`. After 3 consecutive failures, demote the source to "verify at next quarterly audit" status in the digest, don't keep retrying every day.

---

## Fetch reliability — observed behavior + Tier-2 fallback strategies

The first three daily scans (2026-05-24 → 2026-05-26) produced empirical evidence about which categories of source actually fetch reliably from the routine's cloud environment. **22 of 35 sources returned HTTP 403** on the first scan (anti-bot block on the routine's default User-Agent). Updated reliability matrix:

| Category | Tier-1 fetch (direct RSS/atom) | Tier-2 fetch (fallback) | Notes |
|---|---|---|---|
| 1. Vendor channels (Anthropic news, OpenAI, DeepMind, Mistral, x.ai) | ⚠ Often 403-blocked | ✓ **WebSearch with vendor-domain filter** — proven to recover Anthropic / OpenAI / DeepMind / xAI signal during the 5/24 scan | Cursor advancement: do NOT advance `last_seen_cursor` when only Tier-2 recovered the item (the feed wasn't actually read; the item may re-surface on the next direct scan if the feed recovers) |
| 2. Framework releases (Claude Code, LangGraph, AutoGen, CrewAI, DSPy, LlamaIndex, Pydantic AI, BAML, Anthropic SDK) | ✓ **Reliable** — GitHub `/releases.atom` fetches cleanly | — | This is the single most reliable category. 9 of 10 sources fetched without issue on the first scan |
| 3. Research (arXiv cs.AI / cs.CL / Papers With Code) | ⚠ Mixed — arXiv RSS often blocked; PWC HTML JS-rendered | ✓ **WebSearch** for arXiv with `site:arxiv.org` + topic keywords; PWC scrape if HTML-static path available | Filter post-fetch by relevance keywords (agentic, LLM, multi-agent, RAG, RLAIF, constitutional, deliberation, debate, jury, council, self-refine, tree-of-thoughts, graph-of-thoughts) |
| 4. Practitioner blogs (Simon Willison, Eugene Yan, Hamel Husain, Jason Liu, Latent Space) | ⚠ Often 403 (anti-bot on personal blogs) | ✓ **WebSearch with `site:<domain>` filter**; or, when an aggregator re-publishes (Latent Space is Substack-RSS-able), prefer the aggregator | Personal-domain anti-bot blocks are the most common 403 origin; WebSearch fallback is well-suited because these authors are heavily indexed |
| 5. Community (r/LocalLLaMA, r/ClaudeAI, HackerNews, LessWrong) | 🚨 **Reddit hard-blocked** in cloud-routine context; HN/LW often reachable | ✗ Reddit: **WebSearch also blocks `reddit.com`** (confirmed 2026-06-01 supplemental scan — "domains not accessible to our user agent") — no viable automated fetch from any path; **quarterly manual sample only**. For HN: stable. For LW: stable. | Reddit has no working automated path (neither direct fetch nor WebSearch). HN/LW remain the reliable Cat-5 signal |
| 6. Marketplaces (Claude Code skills, Anthropic Cookbook) | ✓ Cookbook `/commits/main.atom` clean; skills marketplace URL may be JS-rendered | If marketplace HTML is JS-rendered: WebSearch with `site:platform.claude.com skills` | The Anthropic Cookbook commits feed is one of the kit's strongest signal-to-noise sources (caught CMA templates during 5/24-26 dwell) |
| 7. MCP ecosystem (modelcontextprotocol/servers, awesome-mcp-servers, npm) | ✓ GitHub atoms clean; npm search may be JS-rendered | npm: WebSearch with `site:npmjs.com mcp-server-` + week-window | npm search HTML is heavily JS-rendered — Tier-2 is the default for new package detection |
| 8. Anthropic-specific (support.claude.com, claude.com/product, docs.claude.com) | ⚠ JS-rendered; raw HTML often empty / 403 | ✓ **WebSearch with `site:platform.claude.com` or `site:support.claude.com`** plus topic terms | `platform.claude.com/docs` direct scrape returns a JS shell with no content, **but WebSearch returns real content** (confirmed 2026-06-01 supplemental scan) — WebSearch is the steady-state Tier-2 for Cat 8 |

### Tier-2 fallback discipline

When a Tier-1 fetch fails (HTTP 403 / 429 / 5xx, or returns a JS-shell with no content), the scan applies the source's documented Tier-2 strategy:

1. **Run the WebSearch query** noted in the matrix above for that source (typically `site:<domain>` + topic terms + a recent-window restriction).
2. **Tag each Tier-2-recovered item** in the digest with `(via WebSearch fallback; feed <status>)` so the operator can tell direct from recovered signal at a glance.
3. **Do NOT advance the source's `last_seen_cursor`.** WebSearch returns items by relevance, not by the feed's true cursor; advancing on Tier-2 data risks skipping items when the feed recovers. The cursor stays where it was after the last successful Tier-1 fetch.
4. **Increment `consecutive_failures` on Tier-2 use** as if Tier-1 fully failed — Tier-2 is recovery, not success. This keeps the 3-strikes demotion logic honest.
5. **Note systemic Tier-2 use in the digest's Source-health section.** If >30% of sources required Tier-2 in a single scan, flag for the quarterly audit (this is what the 5/24 scan did with "22 of 35" — the discipline working as intended).

### When neither tier works

If both Tier-1 and Tier-2 produce no usable signal for a source on a given day:

- Record `consecutive_failures += 1` in `vigilance/state/<slug>.json`.
- After 3 consecutive failures, demote the source in the digest to "verify at quarterly audit" status. Do not keep retrying daily — that wastes the routine's WebSearch budget without producing signal.
- At the next quarterly audit, decide: drop the source, switch to a different URL/aggregator, or move it to a "best-effort" tier with a lower scan cadence.

### Specific known failures (as of v0.12.0)

These sources are documented as **expected to need Tier-2 by default** based on the 5/24-26 evidence:

- All Category 1 vendor channels except GitHub-hosted release feeds
- All Category 4 practitioner blogs (Simon Willison's `simonwillison.net/atom/everything/` is sometimes clean; the rest are anti-bot blocked)
- Reddit (both subreddits) — Tier-2 is the default
- `platform.claude.com/docs` and `claude.com/product` — JS-rendered, scrape returns empty
- arXiv RSS — mixed reliability; pre-warm with `WebSearch site:arxiv.org` and apply keyword filter
- npm search — JS-rendered; Tier-2 default for `mcp-server-*` detection

Update this list at every quarterly audit based on the past 90 days of `Source health` notes in the daily digests.

---

## What's NOT on the watchlist (and why)

- **Twitter/X direct.** Auth walls, rate limits, dynamic content, low signal-to-noise for unattended scraping. The kit relies on practitioner blogs (Category 4) and ecosystem aggregators (Latent Space, etc.) to surface anything genuinely important from Twitter.
- **TLDR AI / Ben's Bites / generic AI newsletters.** These are aggregators of aggregators; they re-surface what Category 1–4 sources already published. Adding them would echo-chamber the watchlist. If one of them frequently surfaces something none of the primary sources caught, that's a signal to add the underlying primary source, not the aggregator.
- **Vendor pricing / sales pages.** Out of scope. The vigilance discipline is about technical and product evolution, not pricing.
- **Generic ML conferences not focused on agentic/LLM.** ICCV (vision), CHI (HCI), SIGGRAPH — out of scope unless a specific paper crosses over.
- **Sponsored content.** Out of scope on principle.

---

## Quarterly audit checklist (template)

First day of each quarter, the user runs the audit manually using this checklist. See `workflows/KIT-VIGILANCE.md` § Quarterly watchlist audit protocol for the full procedure.

```markdown
## Quarterly Audit — YYYY-Q{N}

Audit window: YYYY-MM-DD to YYYY-MM-DD (90 days)

### Per-source firing stats

| # | Source | Items surfaced | ⚠+ items | Integrations triggered | Verdict |
|---|---|---|---|---|---|
| 1 | Anthropic news | 47 | 12 | 4 | keep |
| ... | ... | ... | ... | ... | keep / drop / monitor |

### Category balance

| Category | Active sources | ⚠+ fires (90d) | Status |
|---|---|---|---|
| 1. Vendor channels | 6 | 18 | healthy |
| 2. Framework releases | 10 | 24 | healthy |
| ... | ... | ... | ... |

### Sources to drop

- (cite the source + reason; "zero ⚠+ in 90 days + no posting activity in 60 days" is the standard trigger)

### Sources to add

- (cite candidate sources surfaced from cross-references in past dailies; one new source per dropped source unless category is over-represented)

### Decision

Watchlist diff committed at <commit hash>.
```

---

## Cross-references

- `workflows/KIT-VIGILANCE.md` — doctrine, cadence architecture, degradation modes
- `prompts/dispatch/DAILY_PULSE_SCAN.md` — the scan that consumes this watchlist
- `prompts/dispatch/WEEKLY_SYNTHESIS.md` — rolls up the daily digests this watchlist produces
- `prompts/dispatch/MONTHLY_INTEGRATION.md` — produces architect prompts from the watchlist's downstream signal
- `vigilance/feed/` — digest archive + state per source
- `knowledge-base/MCP-SERVER-REGISTRY.md` — Category 7 (MCP ecosystem) signal feeds maintenance of this file
- `knowledge-base/CLAUDE-SURFACE-ROUTING.md` — Category 8 (Anthropic-specific) signal feeds maintenance of this file
