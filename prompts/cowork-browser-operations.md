# Cowork Browser-Operations Prompt Library

*Path: `~/Projects/AI/prompts/cowork-browser-operations.md`*
*Purpose: a stack-agnostic template + worked examples for routing recurring non-coding operational audits to Claude Cowork. An agent in a new project reads this file, fills in placeholders, and ships a project-specific Cowork ops library.*
*Surface: Claude Cowork (Desktop tab, GA 2026-04-09). Combines local file system R/W, native-app + browser computer-use (Pro/Max research preview), document generation in a sandbox VM, scheduled tasks, and sub-agents — all without leaving the desktop. See `../knowledge-base/CLAUDE-SURFACE-ROUTING.md` §1, §3 for the surface-fit reasoning.*
*Tier assumption: Pro+ (Cowork is not available on Free).*

Every template in this file follows a strict 5-field structure:

1. **Task name** — what the operator types in the Cowork session header.
2. **When to use** — recurrence trigger or escalation signal.
3. **Open these first** — the dashboards, native apps, and local folders Cowork should be granted access to. This doubles as the pre-flight checklist Cowork uses when it asks the operator to approve connectors and folder access.
4. **Prompt body** — the exact prose pasted into the Cowork chat. Keep it imperative, cite project rule files, and end with the deliverable path.
5. **Deliverable** — the artifact Cowork must produce. Always at least one markdown file checked into the repo (or in a `gitignored` finance folder for sensitive workloads) plus a short in-chat summary.

**Placeholder convention.** Replace before use: `{{PROJECT_NAME}}`, `{{REPO_PATH}}` (absolute path to the repo on the operator's machine), `{{REPO_OWNER}}/{{REPO_NAME}}` (GitHub slug), `{{PRIMARY_DOMAIN}}`, `{{DEPLOY_DASHBOARD_URL}}`, `{{ANALYTICS_PROPERTY_NAME}}`, `{{PAYMENTS_DASHBOARD}}`, `{{AUDIT_DIR}}` (typically `{{REPO_PATH}}/docs/audits/`).

**Why Cowork and not Chat or Code.** Per `../knowledge-base/CLAUDE-SURFACE-ROUTING.md` §3 decision rubric: Cowork wins when a task needs (a) local file write into a real repo folder, (b) authenticated reads from a SaaS dashboard, and (c) recurring scheduling — and is not regulated. Chat lacks local FS; Code lacks the dashboard-clicking and native Office export path. For citation-grounded research follow-ups, hand off to `chat-research-missions.md`; when an audit finding requires a code change, hand off to `code-handoff-prompts.md`.

---

## How to write your own Cowork template

A good Cowork template is **read-only by default, evidence-cited, and ends in a committed file**. Three structural rules:

- **Anchor every claim to a rule file or screenshot.** Cowork will happily hallucinate dashboard numbers if the prompt does not force it to cite. Reference `{{REPO_PATH}}/.claude/rules/*.md` so the audit measures the project against locks the team already agreed to.
- **Bound the budget.** State a time budget ("under 60 min") and a scope bound ("last 7 days"). Cowork loops on agentic work; without bounds it will research forever.
- **Single deliverable.** One markdown file under `{{AUDIT_DIR}}` named with an ISO-week or `YYYY-MM` suffix. The file is the unit of accountability — a future audit can diff against it.

**Categories of work that belong in this library.** Deploy + Core Web Vitals audits. Analytics funnel and conversion reviews. Search Console / SEO coverage. Payments dashboard reconciliation against your order or fulfillment store. CMS bandwidth + usage meter checks. Inventory / catalog hygiene (per-region pricing, channel coverage, variant integrity). Paid-media spend audits. Email deliverability and template render checks. GitHub PR triage + release readiness. Hosting / DB / queue infra health. Competitor or peer teardowns via public storefront screenshots. P&L and cash-runway dashboards.

**Anti-patterns — do not write a Cowork template for any of these.**

- **PII or secrets in the prompt body.** The prompt is logged in the Cowork session transcript; never paste customer emails, card numbers, API keys, or auth tokens into the prompt. Cowork should read them from the dashboard at runtime, not from your prose.
- **Executing trades or moving money.** Read-only audit of a payments or finance dashboard is fine. Initiating a refund, placing a trade, sending a transfer, or paying an invoice is not — always hand off to a human. Compare `../knowledge-base/CLAUDE-SURFACE-ROUTING.md` §4 anti-pattern #2.
- **Regulated workloads where audit logs are load-bearing.** Cowork activity is not captured in Audit Logs, Compliance API, or Data Exports. Anything a regulator could subpoena (GDPR Art. 17 erasure evidence, HIPAA-shaped health data, PCI cardholder data, sanctions-related transaction approvals) must route to a surface with an audit trail — Chat, the API, or a direct dashboard session with the platform's own log.
- **One-off questions.** If you would never run this audit twice, it is a Chat question, not a Cowork template.

---

## Template A — Deployment platform weekly audit

**When to use.** Weekly health check on the primary site. After any production deploy that changes routing, bundle composition, or rendering strategy. Before any marketing push that will drive traffic.
**Open these first.** Deploy platform dashboard at `{{DEPLOY_DASHBOARD_URL}}` (project: `{{PROJECT_NAME}}`) <!-- example: vercel.com/{{team}}/{{project}} --> · Analytics property `{{ANALYTICS_PROPERTY_NAME}}` for real-user CWV · Chrome DevTools or PageSpeed Insights tab · local folder `{{AUDIT_DIR}}`.
**Prompt body.**
> Audit the last 7 days of production deploys for `{{PRIMARY_DOMAIN}}`. For each deploy, record: SHA, author, deploy status, and the Core Web Vitals delta on the top 5 routes (homepage and the four highest-traffic paths from the analytics property). Cross-reference the performance budget locked in `{{REPO_PATH}}/.claude/rules/performance.md` <!-- example budgets: LCP < 2.5s, INP < 200ms, CLS < 0.1, per-route JS ≤ 240KB gzip --> and flag any regression ≥ 5% on any metric. Write findings to `{{AUDIT_DIR}}/cwv-{ISO-week}.md` with columns: regressing metric, suspect commit, one-line fix hypothesis. Cite screenshots inline. Read-only — do not redeploy or roll back. Time budget: 60 min. If a regression looks load-bearing enough to need a code fix, end the file with a handoff block formatted for `code-handoff-prompts.md`.
**Deliverable.** `{{AUDIT_DIR}}/cwv-{ISO-week}.md` (committable diff) plus top-3 regression summary in-chat.

---

## Template B — Analytics funnel review

**When to use.** Monthly conversion review. Anytime a primary KPI moves more than 15% week-on-week. Before any landing-page or checkout redesign ships.
**Open these first.** Analytics property `{{ANALYTICS_PROPERTY_NAME}}` (DebugView + Funnel Exploration) <!-- example: GA4 property "{{project}}-prod" --> · BI / dashboarding tool if connected (Looker Studio, Metabase, Mode, etc.) · `{{REPO_PATH}}/.claude/rules/analytics.md` if the project keeps one · `{{AUDIT_DIR}}`.
**Prompt body.**
> Pull the last 30 days of analytics for `{{PRIMARY_DOMAIN}}` from `{{ANALYTICS_PROPERTY_NAME}}`. Build the primary conversion funnel as defined in `{{REPO_PATH}}/.claude/rules/analytics.md` <!-- example funnel: view_item_list → view_item → add_to_cart → begin_checkout → purchase -->, split by the dimensions called out in that rule file (typically traffic source, device, and any project-specific segment such as price tier or plan). Report drop-off per step, conversion rate vs the baseline locked in the rule file, and identify the single biggest leak with a hypothesis rooted in the page or flow that step renders. Read-only — do not edit GA configuration, audiences, or conversions. Write the report to `{{AUDIT_DIR}}/funnel-{YYYY-MM}.md` with evidence screenshots. If the hypothesis requires deeper external research (benchmarks, competitor patterns), end with a handoff block for `chat-research-missions.md`.
**Deliverable.** Funnel markdown report, top-1 hypothesis, evidence screenshots, optional research handoff block.

---

## Template C — Payments dashboard reconciliation

**When to use.** Weekly (Monday morning). Anytime a customer reports "charged but no record on our side." Before monthly finance close.
**Open these first.** Payments provider dashboard at `{{PAYMENTS_DASHBOARD}}` (Payments + Disputes + Radar / fraud screens) <!-- example: dashboard.stripe.com/{{account}}/payments --> · the project's order, subscription, or fulfillment store (admin UI or DB read replica) · transactional email provider dashboard for confirmation-send status · `{{REPO_PATH}}/.claude/rules/compliance.md` and `{{REPO_PATH}}/.claude/rules/operations.md` if present.
**Prompt body.**
> Reconcile payment-provider charges against the project's order/subscription store for the last 7 days on `{{PRIMARY_DOMAIN}}`. For every successful charge, confirm a matching internal record exists with the same identifier (cart id, subscription id, or invoice id) and that the transactional email provider logged the corresponding confirmation send. Flag: (a) provider-side charges with no internal record (likely lost webhook — check the deduplication logic referenced in `{{REPO_PATH}}/.claude/rules/security.md` if present); (b) internal records with no confirmation email; (c) checkouts stuck in a 3DS / SCA redirect state; (d) any dispute opened in the window. STRICTLY READ-ONLY — never issue refunds, capture authorizations, retry charges, or modify customer records from inside this template. Do not paste any card data (PAN, CVV, expiry) into the prompt. Write findings to `{{AUDIT_DIR}}/payments-recon-{ISO-week}.md` and end with a punch list of records needing manual review by a human operator.
**Deliverable.** Recon report plus punch list (record id, action, owner). Money never moves from this template.

---

## Template D — GitHub PR triage + release readiness

**When to use.** Every Friday. Before cutting a release branch. Before going on PTO. Before any infrastructure freeze window.
**Open these first.** GitHub `{{REPO_OWNER}}/{{REPO_NAME}}` (Pull requests tab + Actions tab) <!-- example: github.com/{{org}}/{{repo}}/pulls --> · `{{REPO_PATH}}/.claude/rules/git.md` and `{{REPO_PATH}}/.claude/rules/cicd.md` if present · local repo at `{{REPO_PATH}}`.
**Prompt body.**
> Triage every open pull request on `{{REPO_OWNER}}/{{REPO_NAME}}`. For each PR record: branch-name adherence (per the conventions in `{{REPO_PATH}}/.claude/rules/git.md` <!-- example: feat/, fix/, chore/ -->), commit-message format compliance, CI status across every required check listed in `{{REPO_PATH}}/.claude/rules/cicd.md`, last activity timestamp, merge-conflict state, and a ship-this-week / hold / abandon recommendation. Flag specifically: (a) PRs that mix code changes with context-file or rule-file edits in a single commit (violates the "never mix" rule in `git.md`); (b) PRs that bypassed pre-commit hooks (look for `--no-verify` in commit metadata); (c) PRs touching `.claude/settings.local.json` or any other path the rules mark as never-commit; (d) failing main-branch checks. Read-only — do not merge, close, or comment on PRs from this template; produce recommendations for a human reviewer. Write the triage to `{{AUDIT_DIR}}/pr-triage-{ISO-week}.md`. For any PR where the recommended action is a code change rather than a merge decision, append a handoff block formatted for `code-handoff-prompts.md`.
**Deliverable.** Per-PR triage row, ship/hold/abandon call, CI failure summary, optional code-handoff blocks.

---

## Compliance note (read before routing any new template)

Per `../knowledge-base/CLAUDE-SURFACE-ROUTING.md` §4 anti-pattern #2: *"Cowork activity is not captured in Audit Logs, Compliance API, or Data Exports."* That single sentence determines which workloads must never run through Cowork, regardless of how convenient the dashboard automation looks:

- **Regulated data flows where audit logs are legally load-bearing.** If a regulator could subpoena the trail of who-did-what-when, Cowork is the wrong surface. Use the platform's own audited admin UI plus the project's API audit log.
- **GDPR-style erasure or rectification work.** The data-subject-rights clock is short and the evidence requirement is precise. Run these through the project's documented admin flow, not Cowork.
- **PCI cardholder data.** Read-only audit of a payments dashboard is acceptable because the provider keeps its own audit log. Never paste PAN, CVV, expiry, or full track data into a Cowork prompt; never run a template that captures, displays, or persists card data locally.
- **HIPAA-shaped or other regulated health data.** Route to a Business-Associate-covered API integration, not Cowork.
- **Sanctions and trade-compliance approvals.** Cowork can compile the briefing pack (and the deeper research leg belongs in `chat-research-missions.md`), but the authoritative decision and its log live with the project's legal channel.
- **Anything that moves money or executes a trade.** Audits are fine; execution is for a human or an audited API key with its own log.

When in doubt, ask: *if this audit were subpoenaed tomorrow, would the Cowork transcript be enough?* If the answer is no, leave Cowork.

---

## Footer

For a fully-instantiated example with 12 production templates (deploy + CWV, GA4 funnel, Search Console coverage, payments reconciliation, CMS bandwidth, catalog hygiene, paid-media audit, email deliverability, PR triage, infra health, competitor teardown, monthly P&L), see `../the private lab's worked instance (not shipped)`.

Sibling libraries on the other two Claude surfaces:

- `chat-research-missions.md` — citation-grounded research missions for Claude.ai Chat (when an audit finding needs deeper external evidence).
- `code-handoff-prompts.md` — repo-scoped handoff prompts for Claude Code (when an audit finding needs a code change, migration, or PR).
