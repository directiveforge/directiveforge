# Chat Research Mission Library

*Path: `~/Projects/AI/prompts/chat-research-missions.md`*
*Surface: Claude.ai Chat with Research mode toggled ON. Paid plan required (Pro/Max/Team/Enterprise). Not on Free. See `../knowledge-base/CLAUDE-SURFACE-ROUTING.md` §3 row Q2.*

This file is a template. It teaches the per-mission pattern the kit uses for recurring, citation-grounded research tasks, then ships 3 stack-agnostic example missions you can copy into your own project. The fully-instantiated example for a production e-commerce project lives at `../the private lab's worked instance (not shipped)`.

**Per-mission structure (7 fields, in order):** Dispatch · Identity · Mission · Ground rules · Knowledge manifest · Research questions · Deliverable.

**Severity tagging convention** (apply to every research question and every finding):
🚨 **BLOCKER** (confidence 0.85–1.00) — invalidates a locked rule or shipped decision · ⚠ **HIGH** (0.65–0.85) — would require a rule patch within the next sprint · 🟡 **MEDIUM** (0.40–0.65) — informational, schedule a follow-up · 🟢 **LOW** (0.15–0.40) — signal, no action.

**Placeholder convention:** `{{PROJECT_NAME}}`, `{{REPO_PATH}}` (absolute path to the repo, e.g. `~/Projects/{{PROJECT_NAME}}`), `{{STACK}}`, `{{PRIMARY_DOMAIN}}`, `{{REGION}}`, `{{COMPLIANCE_RULE_FILE}}`, `{{LOCKED_RULES_DIR}}` (e.g. `{{REPO_PATH}}/.claude/rules`). Anything wrapped in `{{...}}` is for the project setup agent to substitute. Inline `<!-- example: ... -->` comments show how a real project filled the slot.

---

## How to write your own mission

**When Chat Research is the right surface.** Chat with Research mode is the only Anthropic-native surface that produces the inline citation footer and runs agentic multi-source search. Reach for it when (a) the deliverable is a citation-backed report synthesizing the open web, (b) the freshness of upstream facts (regulator actions, framework releases, competitor moves) is what makes the deliverable valuable, and (c) you do not need to write into the repo from the same session. The kit's routing doc resolves this on Q2 of the decision rubric — see `../knowledge-base/CLAUDE-SURFACE-ROUTING.md` §3.

**When it is the wrong surface.** If the deliverable is a code edit, a PR, or a shell command, route to Code via `code-handoff-prompts.md`. If the deliverable requires reading a logged-in dashboard, taking a screenshot of a third-party admin UI, or driving a browser through a multi-step flow, route to Cowork via `cowork-browser-operations.md` — Chat Research has no Computer Use, no local FS, and no authenticated-session scraping. If the question can be answered by reading files already in the repo, the agent itself in Code should answer it.

**What makes a good mission.** A good Chat Research mission has four properties. (1) **Bounded primary-source list** — the Ground rules name the domains that count as authoritative (regulator sites, vendor changelogs, the official docs) and explicitly exclude blog aggregators, scraping of gated content, and LLM-generated summaries. (2) **Severity-tagged questions** — every research question carries a 🚨/⚠/🟡/🟢 tag so the report can be triaged at a glance. (3) **Concrete deliverable spec** — name the exact format (markdown report + unified-diff patch block + N-by-M matrix) and the exact files the patch should target. (4) **A delta, not a fresh dump** — the Knowledge manifest cites the *current locked state* in the repo so the report can produce a diff against it instead of restating the baseline.

**What to avoid.** Do not ask Chat Research to write files — it cannot. Do not ask it to verify something only visible to an authenticated session — it cannot. Do not ask it to read your repo — paste the relevant locked-rule excerpts into the Knowledge manifest instead. Do not let a mission drift into open-ended exploration; if the questions cannot be enumerated up front with severity tags, the task belongs in Code with `/ultrareview` or in a Cowork scheduled task.

**Cadence.** Pick a cadence per mission (weekly / monthly / quarterly / pre-release). The cadence is part of the Dispatch line and is what justifies the mission existing as a reusable artifact rather than a one-shot prompt.

---

## Example mission A — Technical stack upgrade watch (monthly)

> **Dispatch:** Author `claude-research` · Surface **Chat + Research ON** · Cadence monthly · Deliverable upgrade-diff report + per-locked-rule impact matrix + `CLAUDE.md` patch proposal.

**Identity.** You are a senior engineer tracking upstream changes that could affect `{{PROJECT_NAME}}` production. <!-- example: tracking Next.js / Medusa v2 / Sanity / Stripe for a production e-commerce project build -->

**Mission.** Monitor the locked upstreams since the last report and surface any release that lands on a rule recorded in `{{REPO_PATH}}/CLAUDE.md` (Common Pitfalls section) or in `{{LOCKED_RULES_DIR}}/*.md`. Upstreams to monitor this cycle:

- `{{STACK_PRIMARY_FRAMEWORK}}` <!-- example: Next.js 16 -->
- `{{STACK_SECONDARY_FRAMEWORKS}}` <!-- example: Medusa v2, Sanity + next-sanity, Stripe SDK -->
- `{{STACK_RUNTIME_OR_ORM}}` <!-- example: MikroORM 6.4, Node 22 LTS -->

**Ground rules.**
- Primary sources only: official blog (e.g. `nextjs.org/blog`, `vercel.com/blog`), GitHub releases page for each package, official docs site. No third-party "what's new in vX" summaries.
- For every release in the window, classify as: **breaks a locked rule** / **enables a locked workaround to be removed** / **neutral**.
- Cite release URL + publication date for every claim.
- Severity-tag per finding.

**Knowledge manifest.** Paste the relevant excerpts into the chat (Chat Research cannot read your repo):
- `{{REPO_PATH}}/CLAUDE.md` — Common Pitfalls section (verbatim).
- `{{LOCKED_RULES_DIR}}/{{PRIMARY_FRAMEWORK_RULE_FILE}}` <!-- example: `.claude/rules/next16.md` --> — locked patterns and their justifications.
- The current locked versions from `package.json` / `requirements.txt` / `go.mod`.

**Research questions.**
- 🚨 Any `{{STACK_PRIMARY_FRAMEWORK}}` release in the window that **invalidates a Common Pitfalls fix** (signature change, deprecated API, behavior reversal)?
- 🚨 Any release that introduces a regression matching a bug we already worked around (i.e., the workaround should *stay*)?
- ⚠ Any release that **obsoletes a workaround** in our locked rules — i.e., we can now delete code?
- ⚠ Security advisories (CVE / GHSA) touching any pinned dependency at our current version.
- 🟡 Minor / patch bumps with no behavior change but worth scheduling for hygiene.
- 🟢 Roadmap items announced for the next release that we should anticipate.

**Deliverable.** Single Chat Research report with: (1) per-upstream release log for the cadence window, (2) impact matrix `locked rule × release` with severity per cell, (3) recommended upgrade order, (4) a unified-diff patch block for `{{REPO_PATH}}/CLAUDE.md` Common Pitfalls if any rule needs updating. If the patch is non-trivial (>20 lines or crosses rule files), flag an ADR candidate and route the implementation through `code-handoff-prompts.md`.

---

## Example mission B — Competitive / positioning scan (quarterly)

> **Dispatch:** Author `claude-research` · Surface **Chat + Research ON** · Cadence quarterly · Deliverable peer-positioning matrix + ≤3 patches to brand/positioning docs.

**Identity.** You are a brand-strategy or product-positioning analyst working from public information only. No scraping of gated or paywalled data. <!-- example: the kit's case study maps 6 production e-commerce peers across 8 dimensions; see ../case-studies/ for the worked instance -->

**Mission.** Map the `{{N_PEERS}}` peer competitor set across `{{N_DIMENSIONS}}` positioning dimensions and surface any movement since the last report. Feed the findings into `{{REPO_PATH}}/{{BRAND_SPEC_PATH}}`.

The peer set this cycle:
- `{{PEER_1}}`, `{{PEER_2}}`, `{{PEER_3}}`, … <!-- example: a 6-brand peer set drawn from the project's market segment -->

The dimensions:
- Positioning statement (hero copy on homepage)
- Pricing anchors at entry, mid, hero tiers
- Heritage / provenance dosage (count of references per landing page)
- Visual-language signature (hero pattern, gallery style, CTA placement)
- Localization footprint (which languages / markets they ship to)
- Recent PR or product launches in the cadence window
- Public-facing tech stack signals (CMS, payment processors, headless vs monolithic)
- `{{DOMAIN_SPECIFIC_DIMENSION}}` <!-- example: schema.org Review / AggregateRating usage at PDP -->

**Ground rules.**
- Public sources only: brand sites, press releases, trade press, official social accounts. No scraping of gated or paywalled content. No competitive-intelligence vendor data unless the project has a license.
- Cite URL + access date for every data point.
- Distinguish primary (brand-controlled) from secondary (trade-press) sources in the report.
- Severity-tag each finding: 🚨 = category-theft or direct positioning collision; ⚠ = pattern peers are converging on that we are not; 🟡 = competitive movement worth tracking; 🟢 = signal-level only.

**Knowledge manifest.**
- `{{REPO_PATH}}/{{BRAND_SPEC_PATH}}` <!-- example: `docs/brand/{{PROJECT_NAME}}-brand-spec.md` --> — current locked positioning + DNA codes.
- `{{REPO_PATH}}/{{LOCKED_RULES_DIR}}/{{LAUNCH_RULE_FILE}}` — beachhead market and competitor framing.
- Any `{{REPO_PATH}}/{{LOCKED_RULES_DIR}}/seo.md` locks that depend on competitor behavior (e.g., schema-org policies).

**Research questions.**
- 🚨 Has any peer launched a line or campaign that directly collides with `{{PROJECT_NAME}}` positioning?
- 🚨 Has any peer abandoned a stance the project's locked rules currently treat as the category norm?
- ⚠ New on-site patterns shipping across peers (PDP layout, checkout flow, content cluster)?
- ⚠ Localization moves — which peers have entered or exited `{{REGION}}` since the last report?
- 🟡 Headline price points across peers — current entry / mid / hero per peer.
- 🟡 Heritage / provenance dosage delta vs last quarter.
- 🟢 Social signal — public follower count / engagement-rate deltas in the cadence window.

**Deliverable.** Markdown report with: (1) `{{N_PEERS}}` × `{{N_DIMENSIONS}}` matrix with cited cells, (2) primary-vs-secondary source split in the citation footer, (3) ≤3 actionable patches to `{{REPO_PATH}}/{{BRAND_SPEC_PATH}}` as unified-diff blocks. If a finding requires verifying a peer's logged-in flow (checkout, account dashboard), do **not** attempt it from Chat — route that sub-task to Cowork via `cowork-browser-operations.md`.

---

## Example mission C — Regulatory / compliance refresh (quarterly)

> **Dispatch:** Author `claude-research` · Surface **Chat + Research ON** · Cadence quarterly · Deliverable delta report + patch to `{{COMPLIANCE_RULE_FILE}}`.

**Identity.** You are a compliance-research analyst producing a quarterly refresh for `{{PROJECT_NAME}}`. Non-lawyer; cite primary sources only. <!-- example: the kit's case study refreshes a sanctions baseline against the relevant national and supranational regulators every quarter -->

**Mission.** Refresh the compliance baseline that underlies `{{REPO_PATH}}/{{COMPLIANCE_RULE_FILE}}` <!-- example: `.claude/rules/compliance.md` --> and `{{REPO_PATH}}/{{COMPLIANCE_REFERENCE_DOC}}` <!-- example: `docs/reference/sanctions-compliance.md` -->. Produce a delta against the last locked snapshot.

**Ground rules.**
- Primary authoritative sources only — name them explicitly. Examples by domain:
  - **Sanctions / trade:** the relevant national designated-nationals list, supranational council regulations, applicable national equivalent for `{{REGION}}`.
  - **Data protection:** EDPB, ICO, national DPA, official Regulation text.
  - **Payments / financial:** local central bank, PCI SSC, processor official documentation.
  - **Tax / VAT:** national finance ministry, official statute, official tax authority guidance.
  - **Accessibility:** W3C WCAG official, applicable national equivalent (EAA, Section 508, EN 301 549).
- Never generate end-user copy in regulated languages — that is a separate skill route.
- Dated-URL citations required for every finding.
- Severity-tag every finding.

**Knowledge manifest.**
- `{{REPO_PATH}}/{{COMPLIANCE_RULE_FILE}}` — current locks (verbatim excerpt of the rule lines that depend on external regulation).
- `{{REPO_PATH}}/{{COMPLIANCE_REFERENCE_DOC}}` — full attorney-vetted baseline if one exists.
- The last delta report's citation footer (so the new report can identify what has changed since).

**Research questions.**
- 🚨 Any new regulator action in the cadence window that **invalidates** a currently locked decision (a vendor we use is sanctioned, a payment rail is closed, a region is gated)?
- 🚨 Any corporate-control change at a vendor that flips them across a regulatory threshold (e.g., a 50% ownership rule)?
- ⚠ New enforcement actions citing `{{REGION}}` specifically — even if no direct vendor overlap, the precedent affects risk posture.
- ⚠ Rule changes affecting registration or filing obligations for `{{PRIMARY_DOMAIN}}` operating in `{{REGION}}`.
- 🟡 Pending regulatory consultations whose outcomes would land in the next quarter.
- 🟢 Investigative-press or trade-press follow-ups on adjacent risk narratives.

**Deliverable.** Single Chat Research report with: (1) inline citations under each finding, (2) a clean delta table (`finding × locked rule × severity × proposed action`), (3) a unified-diff patch block for `{{COMPLIANCE_RULE_FILE}}`. If the patch touches more than the rule file (e.g., needs `operations.md` or a vendor-config change), flag the secondary patches and hand the implementation off via `code-handoff-prompts.md`. If a finding requires verifying current vendor state via a logged-in dashboard, route that verification to Cowork via `cowork-browser-operations.md` before locking the patch.

---

## Footer

For a fully-instantiated example with 6 missions for a production e-commerce project (compliance refresh, peer positioning scan, market-entry refresh, GTM partner audit, technical stack upgrade watch, SEO competitive monitor), see `../the private lab's worked instance (not shipped)`.

Related libraries:
- `cowork-browser-operations.md` — when a research finding needs dashboard verification or screenshot evidence from an authenticated UI.
- `code-handoff-prompts.md` — when a research finding needs to land as a code change, ADR, or repo edit.
- `../knowledge-base/CLAUDE-SURFACE-ROUTING.md` — the surface-fit decision rubric this library sits inside.
