# Claude Surface Routing

*Path: `~/Projects/AI/knowledge-base/CLAUDE-SURFACE-ROUTING.md`*
*Compiled: 2026-04-21 · Last refreshed: 2026-06-26 (v0.16.4 §1a Fable/Mythos SUSPENDED + new §1b model-availability resilience; v0.16.0 §3a/§4a) · 2026-07-10 (§1a Fable RESTORED + usage-credits billing; Sonnet 5 GA routing) · Refresh mechanism: vigilance cadence (daily pulse → monthly integration), NOT a calendar date — a dated marker with no firing mechanism silently expires (field-proven 2026-06-10) · Source: `CLAUDE-SURFACE-MATRIX.md` (April 2026 dossier)*
*Purpose: decide which of three Anthropic-native surfaces (Chat / Cowork / Code) executes a given task. Third-party MCPs out of scope. Scheduled/headless work adds a fourth, differently-shaped surface — **Managed Agents** (API-side, beta) — routed via §3a, not a fourth matrix column (see `KB-06-MANAGED-AGENTS.md` §2.1 for why). Threat models per surface: §4a.*

---

## 1. Executive distillation

- **Claude.ai Chat** — cloud conversational surface (web + mobile + Desktop "Chat" tab). **Killer use case: citation-backed Research mode** (the only surface with Anthropic's agentic multi-search + inline citation renderer, paid plans only). File creation + Artifacts + Projects (cloud, synced). No local FS, no subagents, no Computer Use. [dossier §3.1, §4]
- **Claude Cowork** — a tab inside Claude Desktop, GA 2026-04-09 on macOS + Windows (no Linux, no Free). **Killer use case: agentic non-coding knowledge work with direct local file R/W** — the Code engine reskinned for business users, plus scheduled/recurring tasks, sub-agent coordination, plugin marketplace, and Computer Use in research preview (Pro/Max). Local Projects do **not** sync; **compliance gap** — activity is not captured in Audit Logs / Compliance API / Data Exports. [dossier §3.2, §5]
- **Claude Code** — terminal-first agentic coding tool, also on IDE extensions / Desktop "Code" tab / web / iOS. **Killer use case: deep repo work** — Plan mode, checkpoints/`/rewind`, hooks, worktrees, custom subagents, effort control (the `/effort` slider was relabeled **Faster/Smarter** in v2.1.154), Skills, 1M-token context auto-on Max/Team/Enterprise for Opus 4.6/4.7/4.8 + Sonnet 4.6, plus Sonnet 5 (native 1M). **Sonnet 5 is the CLI default since v2.1.197 (2026-06-30); Fable 5 restored 2026-07-01 (classifier-gated; usage-credits-only since 2026-07-07) — routing economics in §1a.** No Research mode, no Artifacts, no native Office export. [dossier §3.3]

---

## 1a. Model-class routing (Mythos tier) — RESTORED 2026-07-01 (classifier-gated); usage-credits billing since 2026-07-07

**Architectural fact:** Claude **Fable 5 is GA again on all surfaces** (Platform, Claude.ai, Code, Cowork). The US Commerce Department lifted the export-control directive 2026-06-30; Anthropic restored access from 2026-07-01 behind a **new safety classifier** (blocks the flagged jailbreak class in >99% of attempts; Anthropic explicitly names over-blocking of benign coding/security requests as a cost). **Mythos 5 remains restricted** to approved Project Glasswing partners. The 2026-06-12 → 07-01 suspension stays on record as §1b's type specimen ([cnbc.com/2026/06/30](https://www.cnbc.com/2026/06/30/anthropic-says-trump-admin-has-lifted-export-controls-on-claude-fable-5-and-mythos-5.html)).

**Billing state (changed 2026-07-07):** Fable 5 no longer draws from Max/Pro/Team subscription limits — **usage-credits only**, $10/M in + $50/M out (≈2× Opus 4.8; grace period ended 2026-07-12). Any routing or budget assumption written under subscription-inclusion is void.

**The spec:** Mythos-class sits *above* Opus. **Fable 5** (`claude-fable-5`) — SOTA on long/complex tasks with the lead growing on horizon length; 1M context, 128K max output, Jan-2026 cutoff; cyber/bio/distillation requests fall back to Opus 4.8 (visible to the user, billed at Opus prices). **Mythos 5** (`claude-mythos-5`) = same weights, safeguards lifted, restricted-access only.

**The route (refreshed 2026-07-10):** default work → **Opus 4.8**, or **Sonnet 5** (GA 2026-06-30: native-1M, Anthropic's most-agentic Sonnet, **$2/M in + $10/M out promotional through 2026-08-31**, standard rates after — re-verify at the sunset). Reserve **Fable 5** for adjudication-critical synthesis and the longest-horizon work where a ≈2×-Opus pay-as-you-go premium is justified *per task, not per session*. "Fable = main-agent default" patterns written during subscription inclusion are **stale — do not copy them forward.**

**Compliance carry-forward (applies regardless of availability state):** Mythos-class traffic carries **mandatory 30-day retention with no ZDR opt-out** — a procurement-review trigger for regulated / zero-retention workloads (Microsoft restricted internal use over exactly this; see KB-02 §8.5).

---

## 1b. Model-availability resilience (the Fable 5 lesson, 2026-06-12)

A named model can become **administratively unavailable mid-deployment** — not slow, not degraded, *gone* — in hours. Fable 5 is the type specimen (export-control recall) — recalled 2026-06-12, restored 2026-07-01; the full cycle took 19 days; ordinary model deprecations are the slower cousin. Design for it:

- **Pin to a model *class* + a declared fallback chain, never a single model ID.** A routing rubric or `CLAUDE.md` model-pin that names one identifier is a single point of failure.
- **Three failure modes the chain must cover:** (a) **rate-limit / overload** (529s) → next model in chain; (b) **quality-degradation** (classifier reroute, e.g. Fable→Opus) → must be *visible*; (c) **administrative-unavailability** (recall / export control / deprecation) → the whole class can vanish; fall through to a different class.
- **Make substitution visible.** Anthropic itself reversed silent fallback after the 2026-06-11 apology — invisible substitution breaks user trust and reproducibility. Surface the substituting model in logs/output.
- **Mechanics:** Claude Code `fallbackModel` (≤3 models, ordered; v2.1.166) and the Anthropic SDK client-side fallback middleware (v0.108) are the platform primitives — see KB-02 §4.5 (fallback-chain paragraph) + §4.8 (model-class update).

Refresh: via vigilance off-cycle trigger on any model recall / restore.

---

## 2. Capability matrix (3 surfaces × 12 decision-load-bearing dimensions)

Legend: ✓ GA · ⚠ beta/research preview · ✗ absent · — N/A · cites back to dossier §§.

| # | Dimension | Chat | Cowork | Code | Source |
|---|---|---|---|---|---|
| 1 | **Research mode (agentic multi-search + citations)** | ✓ Pro/Max/Team/Ent only | ✗ (agent loop, no citation-footer UI) | ✗ (nearest analog: `/ultrareview`) | §3.1, §3.2, §4 |
| 2 | **Local filesystem R/W** | ✗ | ✓ folder-scoped perm, GA 2026-04-09 | ✓ Read/Write/Edit/Glob/Grep | §2 row 4, §3.2 |
| 3 | **File creation: PDF/DOCX/PPTX/XLSX** | ✓ GA 2025-10-21, **all tiers incl. Free** | ✓ (sandbox VM) | ⚠ indirect via scripts/skills — no native Office export | §2 row 5, Quote 12 |
| 4 | **Computer Use / native-app automation** | ✗ | ⚠ research preview since 2026-03-23 (Pro/Max) | ⚠ research preview since 2026-03-23 (Pro/Max) | §2 row 6, §8 |
| 5 | **Subagent spawning** | ✗ | ✓ (sub-agent coord + Agent Teams) | ✓ (Task tool, custom `.claude/agents/*.md`; no nesting) | §2 row 9, §3.3 |
| 6 | **Git ops + PR creation** | ✗ | ⚠ via embedded Code engine | ✓ native commits/branches/PRs + GitHub Review app + GitLab CI | §2 row 10 |
| 7 | **Shell/build/test execution** | ⚠ Analysis sandbox only | ✓ isolated VM | ✓ Bash + bg tasks + seccomp sandbox | §2 row 11 |
| 8 | **Scheduled / recurring tasks** (route via §3a — now a three-way call incl. MA deployments) | ✗ | ✓ GA 2026-02-24/25 | ✓ local `/schedule` since 2026-04-14; ⚠ cloud Routines (research preview, 1-hour min) | §2 row 21, §8, §3a |
| 9 | **1M context (auto-on)** | ⚠ Chat web UI default still 200K per support.claude.com; 1M-context model variants `claude-opus-4-7[1m]` / `claude-opus-4-8[1m]` / `claude-fable-5[1m]` may be available on paid tiers (parity with Cowork/Code unverified) | ✓ **Cowork on Opus 4.7/4.8 + Fable 5 + Max+ tier confirmed at 1M** — live session evidence 2026-05-27 (4.7), 2026-06-01 (4.8, `claude-opus-4-8[1m]`), 2026-06-10 (Fable 5, `claude-fable-5[1m]`); base 200K for non-1M models | ✓ **auto on Max/Team/Ent** for Opus 4.6/4.7/4.8 + Sonnet 4.6; Fable 5 ships 1M natively (API spec 2026-06-09); Sonnet 5 native-1M (GA 2026-06-30) | §3.1, §3.3, Quotes 6+8 + 2026-05-27 / 2026-06-01 / 2026-06-10 live Cowork evidence |
| 10 | **Artifacts (previewable React/SVG/HTML)** | ✓ GA since 2024-08-27 | ✓ inherited | ✗ | §2 row 12 |
| 11 | **Projects (scope + sync)** | ✓ cloud, sync across devices | ✓ **local only, per-machine, no sync** | ✗ (repo + CLAUDE.md fills role) | §2 row 20, §5 |
| 12 | **Skills + MCP connectors** | ✓ / ✓ (Free = 1 connector) | ✓ / ✓ plugin marketplace since 2026-02-24 | ✓ / ✓ via `claude mcp add`, `/skills` | §2 rows 7–8, Quote 19 |

**Shared constraint (all three):** *"Usage of all different Claude product surfaces (claude.ai, Claude Code, Claude Desktop) counts towards the same usage limit."* [Quote 14] — one rate-limit pool spans all three surfaces.

---

## 3. Decision rubric (ask Q1 → first ✓ wins)

1. **Is the primary deliverable a file edit or shell command inside a git repo (or a PR / CI change)?** → **Code.** (Plan mode + checkpoints + worktrees + 1M context on Max/Team/Ent are Code-exclusive. §3.3)
2. **Does the task require a citation-backed research report synthesizing many web sources?** → **Chat.** (Research mode renders the inline citation footer; Cowork's agent loop does equivalent work but cannot produce the canonical citation format. §4)
3. **Does the task need local file R/W or a dashboard screenshot/click sequence — and is not regulated?** → **Cowork.** (Local FS + Computer Use preview are Cowork's zone. Compliance gap disqualifies regulated workloads — use Chat or API instead. §3.2) **Scheduled/recurring loops are no longer an automatic Cowork route** — apply the §3a three-way split (Cowork remains the home for local-files/desktop-context loops).
4. **Is it one-shot knowledge work you want to share via public URL, or you need Artifacts, or you are on Free tier?** → **Chat.** (Shareable per-chat link + Artifacts + Free-tier file creation are Chat-only. Quotes 12, 15.)
5. **Will the task outrun one interactive session (hours, across closes of the laptop)?** → **Cowork** (remote tasks continue server-side) *unless* it is pure repo work → **Code** (background tasks + `/resume`). §3.2, §3.3

If Q1–Q5 all fail to match cleanly, default to **Chat** and re-scope.

---

## 3a. Scheduled-work routing (three-way, 2026-06-10)

Scheduled agentic work now has three Anthropic-native homes. The drivers are **identity, credentials, granularity, and governance** — not feature count. Full comparison table + mechanics: `KB-06-MANAGED-AGENTS.md` §3 (canonical). The routing distillation:

| Ask first | Route | Status caveat |
|---|---|---|
| Repo-centric, and acting **as a specific person** is acceptable/desired (commits, PRs, Slack/Linear actions carry that user's identity)? | **Claude Code Routine** (cloud; cron ≥1h + API endpoint + GitHub-event triggers) | research preview; all connected MCP connectors included by default *with writes* — prune before first run |
| Org-governed, API-surfaced, per-end-user credentials (vaults), minute-level cron, typed per-run records? | **Managed Agents scheduled deployment** | beta (`managed-agents-2026-04-01`); wire in-process cost enforcement before scheduling (KB-06 §3, §7) |
| Local files, desktop context, personal workflow? | **Cowork scheduled task** | sealed-VM containment profile (§4a) |

Hard gates that override the table: **regulated workloads** route to none of the three by default (Cowork: anti-pattern #2 compliance gap; MA: not ZDR/HIPAA-BAA-eligible, stateful by design — KB-06 §1; Routines: act-as-you identity makes audit posture the user's problem). **Identity is the sharpest discriminator** — a Routine acting as a person is both the feature and the blast radius; MA vaults are built for *someone else's* per-end-user, revocable credentials. Cost discipline is part of the routing call on all three: monitoring is not enforcement (KB-06 §7).

---

## 4. Anti-patterns (never)

1. **Do not use Chat for agentic multi-hour loops** — burns the shared rate-limit pool on work Chat is not architected for. [§7]
2. **Do not use Cowork for regulated workloads** — *"Cowork activity is not captured in Audit Logs, Compliance API, or Data Exports. Do not use Cowork for regulated workloads."* [dossier §3.2 Quirks] — use Chat or API.
3. **Do not use Code for citation-grounded research** — no Research mode, no inline citation renderer. [§7]
4. **Do not assume a connector authorized in claude.ai flows into Code** — broken for Google Drive (issue #32450, 2026-03). [§7]
5. **Do not assume Chat Memory reaches Code** — CLAUDE.md + auto-memory is a separate system. [§7]
6. **Do not rely on Cowork project memory to sync across machines** — local-only, per-machine. [§5]
7. **Do not `sudo npm install -g claude-code`** — use native installer or `claude migrate-installer`. [§3.3 Quirks]
8. **Do not treat "Deep Research" as an Anthropic label** — Anthropic brands it **"Research"**; third-party reviewers echo the OpenAI term. [§11]
9. **Do not assume Computer Use is Cowork-exclusive** — it is in research preview on **both Cowork and Code** (Pro/Max, since 2026-03-23). [§2 row 6, §8]
10. **Cowork on Max+ tier with Opus 4.7/4.8 and Fable 5 has 1M context** (live evidence 2026-05-27 for 4.7, 2026-06-01 for 4.8, 2026-06-10 for Fable 5) — earlier claim that Cowork inherits Desktop 200K/500K ceiling is stale; the `claude-opus-4-7[1m]` / `claude-opus-4-8[1m]` / `claude-fable-5[1m]` model variants ship 1M on Cowork. Code retains 1M auto-on for Max/Team/Ent on Opus 4.6/4.7/4.8 + Sonnet 4.6. Chat web UI 1M availability remains unverified at time of writing — base claim of 200K default holds for Chat until evidence emerges. [§3.1, §11, 2026-05-27 / 2026-06-01 / 2026-06-10 live Cowork session evidence]
11. **Fable 5 / Mythos 5 routing is no longer blocked** — Fable 5 restored 2026-07-01 (classifier-gated) and usage-credits-only since 2026-07-07; Mythos 5 remains Glasswing-restricted (do not route to it outside that program). Fable is a distinct class (Mythos tier) with different economics (≈2× Opus output price, mandatory 30-day retention), and its classifier fallback to Opus 4.8 is *visible* (post-2026-06-11 apology), not silent — so "newest Opus = best default" rubrics still need an explicit class gate; reserve Fable for adjudication-critical/longest-horizon work per §1a's route. The deeper lesson — never pin to one model ID — is §1b. [§1a, §1b]
12. **Do not put regulated workloads on Managed Agents either** — sessions are stateful by design and **not eligible for Zero Data Retention or HIPAA BAA**; deletability ≠ ZDR. The anti-pattern #2 logic extends from Cowork to MA. [KB-06 §1, §8]

---

## 4a. Threat model per surface (2026-06-10)

Source: Anthropic, "How we contain Claude across products" (2026-05-25) + the MA docs. Risk = P(failure) × blast radius; the post's two control families are human-in-the-loop supervision — **fallible by telemetry: users approved ~93% of permission prompts** — and **containment** ("supervise what it's *able* to do"). Full MA-specific treatment: `KB-06-MANAGED-AGENTS.md` §5.

| Isolation pattern | Surface | Boundary | Who/what it protects | Supervision model |
|---|---|---|---|---|
| Ephemeral container (gVisor, server-side) | claude.ai Chat | per-session filesystem, Anthropic infra | infrastructure + tenants — *not* the user's machine | conversation-level; no local blast radius |
| Human-in-the-loop sandbox (Seatbelt/bubblewrap) | Claude Code | reads allowed, writes inside workspace, **network denied by default** (→84% fewer prompts); runtime open-sourced (`anthropic-experimental/sandbox-runtime`) | the user's machine, *if* the user reads the bash | viable only because the median user reads bash; degrades to drift-watching as autonomy grows |
| Sealed local VM (Apple VZ / Windows HCS) | Cowork | own kernel/FS/process table; only selected workspace + `.claude` mounted; **credentials stay in the host keychain, never enter the guest**; defensive MITM proxy in-VM; mount modes incl. read-write-no-delete | the user's machine + accounts, with no bash-literacy assumption | app-level boundaries; no per-action prompts during runs |
| Split brain/hands (MA) | Managed Agents | model loop on Anthropic infra; sandbox managed *or* self-hosted; credentials in vaults / substituted at the egress proxy — structurally outside the sandbox | the operator's credentials + tenants; **no human-in-the-loop UI exists** — supervision is `always_ask` events on an API stream you must consume | strongest-environment-required: design as if every prompt gets approved, because often nobody is watching |

**Doctrine (portable across all four):**

- **An allowlist is a capability grant.** "An allowlist … may be better conceptualized as a capability grant" — every function reachable through an allowed domain is attack surface. Type specimen (disclosed): a malicious workspace file carrying an attacker's API key let workspace files be exfiltrated *through the allowed* `api.anthropic.com` Files API; the fix was an in-VM proxy that passes only requests carrying the VM's own session token.
- **The environment is the defense that holds.** Internal red-team: a direct injection delivered *by the user* (phished employee pasting a routine-looking prompt) exfiltrated `~/.aws/credentials` in **24/25 retries** — intent-anchored model defenses do not stop direct injection; egress controls and filesystem boundaries do.
- **Match isolation strength to oversight capacity.** Code's sandbox assumes a bash-reading human; Cowork's VM assumes none; MA assumes an *absent* one — each step down in oversight demands a step up in environmental containment.
- **Config is an inbound request.** Project-open, config-load, and localhost listeners deserve internet-grade suspicion: a cloned repo's `.claude/settings.json` hook once executed *before* the trust dialog (disclosed + fixed). The same logic makes persistent memory (CLAUDE.md-class files, mounted workspaces, agent state dirs) a post-exploitation persistence surface — see KB-06 §5 memory hygiene.
- **Isolation cuts both ways (EDR blindness).** The VM that contains Claude also blinds endpoint detection; budget for pull-based log export (OTLP) early.
- **Battle-tested primitives over custom components.** Across every deployment in the post, gVisor/seccomp/hypervisors held; the custom proxy/allowlist work is where the breaks happened.

---

## 5. Refresh cadence

- **Monthly** full pass: Anthropic ships material changes ~every 2 weeks. ≈30-minute review. Monitor `support.claude.com/en/articles/12138966` weekly, `anthropic.com/news` RSS, `github.com/anthropics/claude-code/blob/main/CHANGELOG.md` Fridays. [§9]
- **Off-cycle triggers:** new Mythos-class (Fable/Mythos) or Opus/Sonnet/Haiku model; new Desktop tab/surface; beta→GA on Computer Use / Claude in Chrome / Claude Code on the web; any plan-tier pricing or included-features change — **Fable 5 restored 2026-07-01 (classifier-gated; usage-credits-only since 2026-07-07); Mythos 5 still Glasswing-restricted; next hard date: Sonnet-5 promo pricing sunsets 2026-08-31 (§1a)**; any Managed Agents primitive reaching GA or Routines leaving research preview (re-grade §3a status caveats; KB-06 §10 carries the full trigger list). [§9]
- **Quarterly deep pass** re-verifies the capability matrix end-to-end against platform.claude.com/docs — silent capability adds (file-size caps, context expansions) often do not generate news posts. [§9]
- **Open uncertainty items to re-verify next refresh:** 45-min Research cap (unconfirmed); 1M-context availability in web Chat UI; Claude in Chrome GA status; connector propagation claude.ai → Code. [§11]

---

## 6. Verbatim quote library (≥6, each anchored to a decision-load-bearing claim)

1. *"Find Cowork in your desktop app, alongside Chat and Code. Switch to Cowork when you want Claude to execute non-coding tasks."* — claude.com/product/cowork [dossier §10 Q2]
2. *"Claude Cowork uses the same agentic architecture that powers Claude Code, now accessible within Claude Desktop and without opening the terminal."* — support.claude.com/en/articles/13345190 [§10 Q1]
3. *"Research is available for users with paid Claude plans (Pro, Max, Team, or Enterprise) using Claude on the web, Claude Desktop, or Claude Mobile."* — support.claude.com/en/articles/11088861 [§10 Q5] — excludes Free; Research is Chat-surface only.
4. *"Claude's context window size is 200K tokens across all models and paid plans, except for Enterprise plans, which have a 500K context window on some models."* — support.claude.com/en/articles/11647753 [§10 Q6]. **Stale as of 2026-05-27** — Cowork session running `claude-opus-4-7[1m]` shows 1M context window (live evidence: Sam's Cowork session 2026-05-27, 580K/1M usage visible in Context Usage panel). Anthropic appears to have shipped 1M to Cowork on Opus 4.7 + Max+ tier after this support article was last edited. Quote retained for historical citation but the Cowork-specific number is overridden by row 9 update.
5. *"Opus 4.7, Opus 4.6, and Sonnet 4.6 support a 1 million token context window for long sessions with large codebases. … On Max, Team, and Enterprise plans, Opus is automatically upgraded to 1M context with no additional configuration."* — code.claude.com/docs/en/model-config [§10 Q8] — 1M is Code-centric, auto only on Max/Team/Ent.
6. *"Code execution and file creation is available to all Claude users (Free, Pro, Max, Team, and Enterprise) on the web, Claude Desktop, and Claude Mobile."* — support.claude.com/en/articles/12111783 [§10 Q12] — corrects the "Cowork-unique file creation" assumption.
7. *"Usage of all different Claude product surfaces (claude.ai, Claude Code, Claude Desktop) counts towards the same usage limit."* — support.claude.com/en/articles/11647753 [§10 Q14]
8. *"Users on Pro and Max plans can give Claude access to computer use. Claude can open files, run dev tools, point, click, and navigate to what's on your screen to perform tasks itself—with no setup required."* — release notes, 2026-03-23 [§10 Q20] — Computer Use spans Cowork + Code, not Cowork-exclusive.
9. *"All Managed Agents API requests require the `managed-agents-2026-04-01` beta header."* — platform.claude.com/docs/en/managed-agents/reference, verified 2026-06-10 [§3a] — no MA primitive is GA; every §3a MA recommendation is beta-bounded.
10. Users approved ~93% of permission prompts — published telemetry figure (not a verbatim sentence) from anthropic.com/engineering/how-we-contain-claude, 2026-05-25 [§4a] — human-in-the-loop approval is not a load-bearing safeguard; containment is.
11. *"An allowlist … may be better conceptualized as a capability grant."* — same post [§4a] — egress allowlists are audited by reachable *functions*, not domain reputation.
12. *"The model never sees the secret."* — anthropics/claude-cookbooks Sentry-triage README (env-var vault credential + egress-proxy substitution) [§4a, KB-06 §5] — the credentials-never-in-sandbox doctrine, implemented.

---

## 7. Cross-references

- **Managed Agents — primitives, scheduled-deployment mechanics (canonical three-way table), containment, field evidence:** `~/Projects/AI/knowledge-base/KB-06-MANAGED-AGENTS.md` (§3a + §4a here are the routing distillations of its §3 + §5)
- **Async multi-agent orchestration patterns (peer-hub, lead-spawn-monitor, scripted):** `~/Projects/AI/knowledge-base/KB-04-DECISION-ENGINEERING.md` §4.7
- **Routing behavior (detection triggers + reroute templates + worked examples):** `~/Projects/AI/workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md`
- **Cowork prompt library:** `~/Projects/AI/prompts/cowork-browser-operations.md`
- **Chat Research mission library:** `~/Projects/AI/prompts/chat-research-missions.md`
- **Code CLI handoff library:** `~/Projects/AI/prompts/code-handoff-prompts.md`
- **Per-project rule (created by `prompts/CLAUDE_SURFACE_ROUTING_INTEGRATION_PROMPT.md`):** `{{REPO_PATH}}/.claude/rules/ai-workflow.md` (+ Cursor mirror at `.cursor/rules/ai-workflow.mdc` if the project uses Cursor)
- **Worked example of the per-project rule:** `~/Projects/AI/the private lab's worked instance (not shipped)` (a production e-commerce project running this routing)
- **Full evidence dossier (monthly-refreshed):** `~/Projects/AI/knowledge-base/CLAUDE-SURFACE-MATRIX.md`
- **Global pin (always-loaded tier-0 rule):** `~/.claude/CLAUDE.md` §"Claude Surface Routing"
