# Deep-Research Dossier — 2026-07-01 Monthly Integration (5 vigilance themes)

> **Compiled:** 2026-06-26 (Cowork desktop session — unrestricted web, the hybrid-model Tier-2 path).
> **Purpose:** turn the vigilance signal accumulated in weeks 2026-22 → 2026-25 into integration-ready,
> primary-source-verified findings for the **2026-07-01 monthly integration** (the first monthly that
> has ≥4 weekly synths behind it — 22, 23, 24, 25 — so it can finally fire for real).
> **Method:** 4 parallel research agents, one per workstream; each web-verified the load-bearing claims
> against **primary, dated sources**, read the actual kit files to compute the delta, and proposed an
> architect-prompt-ready integration path. This dossier synthesizes + adversarially reconciles them.
> **Confidence convention:** ✅ verified (primary source) · 🟡 inferred / single-soft-source · ❌ refuted
> or unverifiable (do NOT propagate into kit content).
> **Doctrine note:** per the kit's step-④ lock, an **independent adversarial verification subagent must
> run against the architect-prompt OUTPUTS at integration time** — this dossier is the input spec, not a
> license to auto-merge. The claims flagged 🟡/❌ below are where that pass should concentrate.

---

## Executive summary

| # | Theme | Severity (vigilance) | Net research verdict |
|---|-------|----------------------|----------------------|
| 1 | Model availability & resilience (Fable 5 / Mythos 5 suspension + fallback-chain primitive) | 🚨 (2 wks top) | **Confirmed.** Still suspended as of 6/26. Kit §1a routes to an uncallable model — highest-urgency edit. |
| 2 | MCP security cluster + author-expectations | ⚠ (3rd wk) | **Confirmed + larger than scoped.** 6 community CVEs verified with real numbers; 1 vigilance claim unverifiable. |
| 3 | Claude Code v2.1.16x→v2.1.18x cluster | ⚠ (4th wk) | **Confirmed verbatim** from official changelog. Breaks the kit's "no nesting" lock; destructive-block default inverts kit guidance. |
| 4 | (folded into #1) fallback-chain primitive | ⚠ | **Confirmed.** SDK v0.108 middleware + Claude Code v2.1.166 `fallbackModel`. |
| 5 | Bedrock multi-vendor / multi-region matrix | ⚠ (3rd wk) | **Confirmed core; one vigilance claim REFUTED** (SDK FoundryClient v0.107.1 fix does not exist). |

**The three corrections the research forced on the vigilance feed** (the adversarial payoff — these would have shipped as defects):

1. ❌ **"Anthropic SDK FoundryClient `x-api-key` auth fix ~v0.107.1"** — *does not exist.* The anthropic-sdk-typescript CHANGELOG tops out at **0.106.0 (2026-06-24)**; there is no 0.107.x and no FoundryClient x-api-key entry. The only "send all configured auth headers" fixes are old (0.40.0 / 0.50.0, 2025). **Drop this claim** from the Bedrock integration. ([anthropic-sdk-typescript CHANGELOG](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/CHANGELOG.md))
2. ❌ **"meta-ads-mcp unauthenticated HTTP token leak"** — *no CVE / GHSA / vendor advisory found.* Only the project's own product pages exist. **Do not catalog as a CVE**; mark unconfirmed pending an advisory.
3. 🟡 **Kit-anchor premises were wrong in the weekly synthesis** — KB-02 has **no `§deployment-targets`** section; CLAUDE-SURFACE-ROUTING row 9 is **1M-context, not Bedrock**; the "no nesting" lock is at **line 38 / matrix row 5**. The integration paths below use the *corrected* anchors (agents read the live files).

---

## Theme 1 — Model availability & resilience (🚨 highest urgency)

### Verified current state ✅

**Fable 5 / Mythos 5 suspension — dated timeline:**

- **2026-06-09** — Fable 5 (first GA Mythos-class) + Mythos 5 ship. ([anthropic.com/news/claude-fable-5-mythos-5](https://www.anthropic.com/news/claude-fable-5-mythos-5))
- **~2026-06-11** — Anthropic apologizes for the **invisible** anti-distillation guardrail ("we made the wrong trade-off") and changes it so flagged queries fall back to **Opus 4.8 with a visible notification**. ([gizmodo.com](https://gizmodo.com/anthropic-apologizes-for-one-of-the-guardrails-on-its-fable-5-model-and-will-change-it-2000770365))
- **2026-06-12, 5:21 pm ET** — US-government export-control directive received; Anthropic disables Fable 5 + Mythos 5 for **all** customers globally (cannot filter by nationality across clouds). Stated trigger: a narrow cyber "jailbreak" (asking the model to read a codebase and fix flaws). Verbatim in Anthropic's own statement. ([anthropic.com/news/fable-mythos-access](https://www.anthropic.com/news/fable-mythos-access) · [fortune.com](https://fortune.com/2026/06/13/anthropic-disables-fable-mythos-export-controls-national-security-threat/) · [natlawreview.com](https://natlawreview.com/article/ai-company-anthropic-suspends-access-claude-fable-5-claude-mythos-5-following-us))
- **As of 2026-06-25/26: STILL SUSPENDED.** No restoration; status page "Monitoring"; reports of reappearance are false. An Anthropic MD floated "coming days" (Seoul, 6/17) but gave no firm date. ([explainx.ai](https://explainx.ai/blog/is-fable-5-back-2026))

**Mythos-class retention / fallout:**
- **30-day mandatory retention on all Mythos-class traffic, no ZDR opt-out** — in Anthropic's statement (links support article 15425996). Forrester: it **overrides existing zero-retention DPAs; flagged items kept up to ~2 years.** ([forrester.com](https://www.forrester.com/blogs/how-fable-5-and-mythos-5-change-ai-security-data-retention-and-vendor-risk/))
- **Microsoft restricted internal employee access** pending retention legal review (still offered to *customers*). ([letsdatascience.com](https://letsdatascience.com/news/microsoft-restricts-employee-access-to-claude-fable-5-cb0f8e84))

**Fallback-chain primitives:**
- **anthropic-sdk-python v0.108.0 (2026-06-09):** server-side fallback-on-refusal + **client-side fallbacks middleware** for Bedrock/Vertex/Foundry. ([SDK releases](https://github.com/anthropics/anthropic-sdk-python/releases/tag/v0.108.0))
- **Claude Code `fallbackModel` (v2.1.166):** up to **3 models tried in order** on overload/unavailability; auth/rate-limit/size errors still surface immediately. ([code.claude.com/docs/en/changelog](https://code.claude.com/docs/en/changelog))

### Delta vs kit
- **CLAUDE-SURFACE-ROUTING.md §1a** — *wrong framing.* Treats Fable 5/Mythos as live and routable with future-tense gates ("plan inclusion ending 2026-06-22"); the model has been **administratively unavailable since 6/12**. §1a routes traffic nobody can send.
- **§1a + anti-pattern #11 (~line 89)** — reason only about classifier *fallback-to-Opus* (quality substitution); neither names **administrative unavailability** as a failure class.
- **KB-04 §4.1 synthesis table** — names Fable 5 "strongest synthesis model," no availability caveat.
- **KB-02** — *no fallback-chain primitive, no enterprise-readiness/ZDR-procurement gate* (only scattered retry-with-backoff at ~§line 465).
- **WORKFLOW-CLAUDE-CODE.md §11.2** — model-selection table has no `fallbackModel` guidance despite v2.1.166.

### Integration path (architect-prompt-ready)
1. **SURFACE-ROUTING §1a → reframe as ARCHITECTURAL FACT.** Lead: "As of 2026-06-12 (5:21pm ET) Fable 5 + Mythos 5 are **administratively unavailable** under a US export-control directive; restoration is an **event to watch, not a near-term expectation** — do not author routing that depends on it." Move all Fable-vs-Opus routing under a "when/if restored" conditional; keep as a dated lock refreshed via vigilance cadence.
2. **SURFACE-ROUTING → new §model-availability-resilience.** Doctrine: **pin to model-CLASS, never a single ID** + declare a fallback chain. Three failure modes: (a) rate-limit/overload, (b) quality-degradation (classifier reroute — must be *visible*), (c) **administrative-unavailability** (export control / recall — Fable 5 is the type specimen).
3. **KB-02 → new §fallback-chain-primitive** (near retry-with-backoff): **visible-by-default doctrine**, citing Anthropic's own 6/11 apology as field evidence. Two shapes — Claude Code `fallbackModel` (≤3, ordered) and SDK client-side middleware. Best shape: *primary class → same-class peer → lower tier, substituting model surfaced to caller.*
4. **KB-02 → new §enterprise-readiness-gate:** mandatory retention that voids ZDR is a **procurement-review trigger** for regulated/ZDR-bound workloads (Microsoft restriction as field anchor).
5. **KB-04 §4.1 + WORKFLOW §11.2** — one-line availability caveat + add `fallbackModel` as a resilience lever.

### Confidence / open items
- 🟡 Retention article (support 15425996) could not be fetched directly (timeouts); the "up to 2 years" specific rests on Forrester's reading, not the primary text.
- 🟡 SDK `BetaFallbackState` API naming from cookbook/search, not raw SDK source.
- Restoration date is genuinely open — track via off-cycle trigger, do not assume.

---

## Theme 2 — MCP security cluster + author-expectations (⚠ 3rd week)

### Verified current state ✅ (CVEs with real numbers)
- **gemini-mcp-tool** — CVE-2026-0755, OS command injection + `@file` exfiltration; CVSS 9.8; fixed 1.1.6. ([GitLab Advisory](https://advisories.gitlab.com/npm/gemini-mcp-tool/CVE-2026-0755/) · [ZDI-26-021](https://www.zerodayinitiative.com/advisories/ZDI-26-021/))
- **mcp-server-kubernetes** — CVE-2026-46519, access-control bypass (filters enforced at `tools/list`, not `tools/call`); CVSS 8.8; fixed 3.6.0. ([GitLab Advisory](https://advisories.gitlab.com/npm/mcp-server-kubernetes/CVE-2026-46519/))
- **docker/mcp-gateway** — CVE-2026-55887, arg injection via OCI image label → root RCE; fixed 0.42.2. ([GitLab Advisory](https://advisories.gitlab.com/golang/github.com/docker/mcp-gateway/CVE-2026-55887/))
- **n8n (@n8n/mcp-browser)** — CVE-2026-54309, unauth browser-control over HTTP transport (stdio unaffected). ([GitLab Advisory](https://advisories.gitlab.com/npm/n8n/CVE-2026-54309/))
- **OpenClaw** — CVE-2026-53840, custom headers forwarded on cross-origin redirect. ([GitLab Advisory](https://advisories.gitlab.com/npm/openclaw/CVE-2026-53840/))
- **netlicensing-mcp** — GHSA-hxpf-9xvq-wph8, REST path traversal bypasses APIKEY redaction. ([GitLab Advisory](https://advisories.gitlab.com/pypi/netlicensing-mcp/GHSA-hxpf-9xvq-wph8/))
- **Broader exposure:** Trend Micro — 1,467 exposed servers; CVSS 9.8 cmd-injection in unofficial `aws-mcp-server` (**CVE-2026-5058**). ([Trend Micro](https://www.trendmicro.com/vinfo/us/security/news/vulnerabilities-and-exploits/update-on-exposed-mcp-servers-the-threat-widens-to-the-cloud)) · Censys — **12,520** exposed MCP services, ~40% no-auth (2026-04-28). ([Censys](https://censys.com/blog/mcp-servers-on-the-internet/))

**Author-expectation patterns ✅/🟡:**
- ✅ **Memory knowledge-graph exposed as a readable Resource + `resources/subscribe`** (mutation tools emit `notifications/resources/updated`). ([repo/src/memory](https://github.com/modelcontextprotocol/servers/blob/main/src/memory/README.md))
- ✅ **URL elicitation + infinite-loop guard** — SEP-2322 embeds elicitation in `InputRequiredResult`; SEP-2260 makes "server-initiated only while processing a client request" **required**. ([MCP RC blog](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/))
- 🟡 **get-annotated-message** — could not pin to a dated PR; only the general ToolAnnotations spec line is confirmed → mark inference.

**Dependency floors ✅:** idna ≥3.15.0 (CVE-2026-45409); starlette ≥1.3.1 (CVE-2026-54283) + ≥1.0.1 (CVE-2026-48710); urllib3 ≥2.7.0 (CVE-2026-44431); vitest UI off-by-default (CVE-2026-47429 / -53633); tornado patched.

### Delta vs kit
- **MCP-SERVER-REGISTRY.md §"⚠ May 2026 security cluster" (L12–22)** — stops at the May upstream-monorepo cluster; **no June community-server wave, no Trend Micro/Censys exposure data.**
- **No "author expectations" section** anywhere; canonical patterns uncatalogued.
- **No cumulative community-CVE table**; **no dependency-floor guidance** (checklist L553–571 only says "run `npm audit`").
- **Docker MCP Gateway** is the kit's *isolation* recommendation (checklist L571) yet now has its own RCE → needs a "pin ≥0.42.2" caveat.
- Registry "Last verified 2026-05-28" is ~1 month stale.

### Integration path
1. **Rename §"May 2026 security cluster" → "May–June 2026 security cluster"**; append a **cumulative community-CVE table** (Server | CVE | Class | CVSS | Fixed-in | Source) with the 6 verified + aws-mcp-server; add the Trend Micro/Censys exposure one-liner.
2. **New top-level §"MCP server author expectations"**: (a) expose primary state as a readable Resource; (b) `resources/subscribe` + `notifications/resources/updated`; (c) URL elicitation for OAuth/secrets; (d) loop guard (SEP-2260); (e) treat tool annotations as **untrusted hints, never the security boundary** — *enforce at the execution layer, not at discovery* (the k8s CVE lesson).
3. **Security checklist → add "pin dependency floors"** (verified table) + "enforce auth/access-control at execution layer" (cite CVE-2026-46519).
4. **Docker MCP Gateway** caveat: pin ≥0.42.2 (CVE-2026-55887).

### Confidence / open items
- ❌ meta-ads-mcp token leak — unverifiable; do not catalog.
- 🟡 get-annotated-message + the exact everything-server elicitation PR — capability confirmed, exact commit not pinned.

---

## Theme 3 — Claude Code v2.1.16x → v2.1.18x cluster (⚠ 4th week)

### Verified current state ✅ (verbatim from [official changelog](https://code.claude.com/docs/en/changelog))
- **Destructive-block default inversion — v2.1.183 (2026-06-19):** auto mode BLOCKS `git reset --hard`, `git checkout -- .`, `git clean -fd`, `git stash drop` (unless you asked to discard), `git commit --amend` on non-agent commits, and `terraform/pulumi/cdk destroy` (unless stack named). 2nd dated source: [DevelopersIO](https://dev.classmethod.jp/en/articles/20260619-cc-updates-v2-1-183/).
- **`Tool(param:value)` permission syntax — v2.1.178 (2026-06-15):** e.g. `Agent(model:opus)`; `*` wildcard supported.
- **`/config key=value` inline settings — v2.1.181 (2026-06-17)** (+ `/config --help` v2.1.183).
- **Nested sub-agents ≤5 levels — v2.1.172 (2026-06-10):** "Sub-agents can now spawn their own sub-agents (up to 5 levels deep)." ([claudeupdates.dev/version/2.1.172](https://www.claudeupdates.dev/version/2.1.172))
- **`enforceAvailableModels` — v2.1.175; `footerLinksRegexes` — v2.1.176** (admin/managed settings).
- **`--safe-mode`, `/cd`, `disableBundledSkills` — v2.1.169 (2026-06-08).**
- **Bedrock GovCloud `us-gov-*` prefix fix — v2.1.174; Bedrock credential caching — v2.1.176.**
- **Hook `if` conditions on file paths — v2.1.176** (`Edit(src/**)`, `Read(.env)` match).
- **Stream-stall hint reword — v2.1.185 (2026-06-20)** (minor; 20s threshold).

### Delta vs kit
- **CLAUDE-SURFACE-ROUTING.md line 38, matrix row 5** — "`(Task tool, custom .claude/agents/*.md; no nesting)`" is now **FALSE** (nesting shipped v2.1.172). *This is the locked "no nesting" assertion.*
- **WORKFLOW-CLAUDE-CODE.md §7.5 (L432–441)** — deny-list tells YOU to deny `git reset --hard` / `git push --force`; as of v2.1.183 auto mode blocks these by default → **framing inverted.** §6 says "up to 10 subagents," no depth cap.
- **KB-02 §8.6 (L826–901)** — permission model omits the v2.1.183 default-block layer; `Tool(param:value)` param-matching absent; no admin-policy primitives.
- **templates/claude-code/rules/** — no permission-rule template exists (the new unblock pattern has no home).

### Integration path
1. **SURFACE-ROUTING row 5** — replace "`no nesting`" with "`nests ≤5 levels deep (v2.1.172+)`".
2. **WORKFLOW §7.5** — invert framing: lead with "platform blocks destructive ops by default in auto mode (v2.1.183+)"; recast deny-list as belt-and-suspenders for non-auto modes; **add an unblock example** (e.g. `Bash(terraform destroy:*)` in `allow` for repos that tear down ephemeral stacks); refresh examples to `Tool(param:value)`; add the ≤5-level depth cap in §6.
3. **KB-02 §8.6** — add "Platform-default destructive block (v2.1.183)" subsection (rules now identify what to UNBLOCK); add `Tool(param:value)` param-matching; add an **admin-policy mode-3 case study** (`enforceAvailableModels` + `footerLinksRegexes` + managed `availableModels`).
4. Document **`/config key=value`** as the canonical inline-settings interface (WORKFLOW §9 + KB-02 §8.6).

### Confidence / open items
- 🟡 `Agent(model:opus)` param-matching is changelog-stated but **not in public permissions docs** — flag as changelog-sourced.
- 🟡 `footerLinksRegexes` confirmed **undocumented** ([issue #68105](https://github.com/anthropics/claude-code/issues/68105)).
- 🟡 **Exact unblock mechanism** for the v2.1.183 block (pure `/config` vs `allow`-list `Tool()`) is unstated — *the architect prompt must verify before publishing the unblock example.*

---

## Theme 4 — fallback-chain primitive

Folded into **Theme 1** (model availability & resilience) — same workstream, same KB-02 §fallback-chain-primitive deliverable. Kept as a separate vigilance candidate only for dwell-tracking.

---

## Theme 5 — Bedrock multi-vendor / multi-region matrix (⚠ 3rd week)

### Verified current state ✅
- **AWS region precedence — v2.1.172 (2026-06-10):** Bedrock reads region from `~/.aws` when `AWS_REGION` unset; `/status` shows the source. ([changelog](https://code.claude.com/docs/en/changelog))
- **Bedrock GovCloud `us-gov-*` prefix fix — v2.1.174.**
- **Bedrock credential caching — v2.1.176:** `awsCredentialExport` cached until `Expiration` (−5 min), not a fixed 1h.
- **OpenAI GPT-5.5 / GPT-5.4 + Codex GA on Amazon Bedrock — 2026-06-01** (Responses API / `bedrock-mantle`; data residency stays in-Region). ([AWS News](https://aws.amazon.com/blogs/aws/get-started-with-openai-gpt-5-5-gpt-5-4-models-and-codex-on-amazon-bedrock/))
- **Multi-cloud commitments (thesis backbone):** OpenAI–AWS $38B/7yr; Claude GA on Bedrock + Vertex + Microsoft Foundry (already in kit §1a).

### Delta vs kit
- **KB-01 §8 (L634–661)** — zero Bedrock/Vertex/Foundry mention; Codex CLI row treats it as "OpenAI/ChatGPT Plus only" (now stale — Codex also runs on Bedrock).
- **KB-02** — premise correction: **no `§deployment-targets` exists.** Closest anchor §4.5 L334 already notes server-side fallbacks are "Claude API/Platform on AWS only — not Bedrock/Vertex."
- **CLAUDE-SURFACE-ROUTING.md** — premise correction: **no row 9 "Bedrock entry"** (row 9 is 1M-context). Bedrock appears only as model *availability* in §1a; the matrix has no procurement dimension (correctly out of its stated 3-surface scope).

### Integration path
1. **KB-02 → new §8.7 "Deployment Targets & the Bedrock Procurement Layer":** narrative (Bedrock as the multi-vendor access plane — Claude + Gemini + OpenAI/Codex via one Region-scoped, IAM-governed billing plane) + a 4-row table (Provider | Surface | Auth | Region/residency). Domain-agnostic.
2. **KB-01 §8.2** — footnote on the Codex CLI row: "also GA on Bedrock (2026-06-01)"; §8.3 — add cloud-procurement as a selection axis.
3. **KB-02 §8.7 → "Claude Code on Bedrock" ops notes:** region precedence (v2.1.172), GovCloud prefix fix (gate gov installs ≥v2.1.174), credential durability (v2.1.176) — each with changelog URL.
4. **SURFACE-ROUTING §7 cross-references** — pointer to KB-02 §8.7 with a one-line note that procurement/deployment-target choice is **orthogonal** to the 3-surface routing call (changes billing/governance/region, not which surface executes). No matrix row needed.

### Confidence / open items
- ❌ SDK FoundryClient `x-api-key` v0.107.1 fix — **does not exist** (TS SDK tops at 0.106.0). Drop.
- 🟡 No Oracle/OCI Bedrock-equivalent for Claude (Oracle = OpenAI compute + Oracle–AWS networking only).

---

## Recommended architect-prompt dispatch plan (for 2026-07-01)

Per the kit's KB-04 architect-prompt pattern + step-④ adversarial verification. Suggested priority and grouping:

1. **Priority 1 — Model availability & resilience** (Theme 1+4). Single architect prompt: SURFACE-ROUTING §1a reframe + new §model-availability-resilience + KB-02 §fallback-chain-primitive + §enterprise-readiness-gate + KB-04/WORKFLOW one-liners. *Highest urgency — the kit currently routes to an uncallable model.*
2. **Priority 2 — MCP security + author-expectations** (Theme 2). Registry section rename + cumulative CVE table + new author-expectations section + dependency floors. *Cross-link to the security-auditor agent template if/when it ships.*
3. **Priority 3 — Claude Code v2.1.18x** (Theme 3). SURFACE-ROUTING row 5 ("no nesting" → ≤5) + WORKFLOW §7.5 destructive-block inversion + KB-02 §8.6 permission/admin-policy. *Verify the unblock mechanism before publishing the example.*
4. **Priority 4 — Bedrock procurement layer** (Theme 5). New KB-02 §8.7 + KB-01 footnotes + SURFACE-ROUTING cross-ref. *Drop the refuted FoundryClient claim.*

**Before merge:** run an independent adversarial verification subagent over the architect-prompt outputs, concentrating on every 🟡/❌ item above (FoundryClient ❌, meta-ads ❌, get-annotated-message 🟡, `Agent(model:opus)` 🟡, `footerLinksRegexes` 🟡, v2.1.183 unblock mechanism 🟡, retention "2 years" 🟡).

---

## Method appendix

4 parallel general-purpose research agents (workstreams: model-availability+resilience; MCP-security+author-patterns; Claude-Code-v2.1.18x; Bedrock-matrix). Each: web-verified against primary dated sources, read the live kit files for the delta, returned a cited mini-dossier. Total: ~75 tool-uses, ~366k research tokens. Premise grounding (3 prior searches) confirmed all themes are real, web-verifiable June-2026 events. Multidomain lock honored throughout — no end-user project specifics in this dossier.
