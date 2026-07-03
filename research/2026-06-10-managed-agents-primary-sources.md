# Managed Agents — Primary-Source Dossier (Dossier A)

> **Run:** 2026-06-10, Cowork desktop, fresh session. **Role:** research-extraction (no KB edits, no commits).
> **Consumer:** KB-06 architect prompt (monthly integration 2026-07-01). **Companion:** Dossier B (field evidence, Chat+Research — not this document's job).
> **Method:** every claim below was read on the fetched primary page on 2026-06-10 unless explicitly marked otherwise. Search-snippet prose was never trusted for dates or statuses.

**Sources fetched (all first-party):**
- Cat 8 docs: `platform.claude.com/docs/en/managed-agents/` — overview, quickstart, agent-setup, sessions, multi-agent, scheduled-deployments, vaults, self-hosted-sandboxes (+ security model), environments, define-outcomes, memory, dreams, reference, tools, permission-policies, skills, mcp-connector, events-and-streaming, migration; `agents-and-tools/mcp-tunnels/overview`; `code.claude.com/docs/en/workflows` and `/en/routines` (markdown served directly).
- Cat 1: `anthropic.com/engineering/managed-agents` (pub. **Apr 08, 2026**, on-page); `anthropic.com/engineering/how-we-contain-claude` (pub. **May 25, 2026**, on-page — matches dispatch); `claude.com/blog/claude-managed-agents-updates` (pub. **May 19, 2026**, on-page).
- Cat 6: `anthropics/claude-cookbooks` commit `e22e683` (async multi-agent notebook, raw) and commit `3dc70b5` (Sentry triage: README.md, deploy.py, pyproject.toml, raw). **Note:** the repo is now `claude-cookbooks`; `anthropic-cookbook` URLs redirect.
- Cat 2: `anthropic-sdk-python` release tags v0.107.0, v0.108.0, v0.109.0, v0.109.1 (release pages).
- **Unreachable-as-described:** `claude.com/code-with-claude/tokyo` resolves but is a registration/agenda page with zero technical content (the event is today, 2026-06-10). All four claims the dispatch attributes to "the Tokyo restatement" are independently verified by the docs and the May 19 blog post instead — see §I.
- **Fetch quality:** platform.claude.com pages returned full server-rendered body text on direct fetch (no JS-shell fallback needed this run). Two pages (reference, events-and-streaming) had collapsed accordion tables whose contents did not render — flagged where it matters (§A spill-to-file, §I).

---

## A. Primitive glossary with beta status

Everything in this section sits behind the `managed-agents-2026-04-01` beta header — the overview states "All Managed Agents endpoints require the beta header" and that access is "enabled by default for all API accounts." There is no GA primitive in Managed Agents as of 2026-06-10. Statuses below are therefore relative: **[beta]** = standard MA beta header only; **[preview]** = additionally gated behind request-access.

**Agent [beta].** A reusable, *versioned* configuration: name, model (all Claude 4.5+ models; object form supports `speed: fast`), system prompt, tools, `mcp_servers`, skills, metadata. Updates create new versions (no-op detection; arrays replaced, metadata merged); sessions can pin a version, enabling staged rollouts and one-field model migrations. Archive = read-only; running sessions continue.

**Environment [beta].** Where sessions run. `cloud` (Anthropic-managed container; `packages` pre-install for apt/cargo/gem/go/npm/pip, cached per environment; `networking: unrestricted` default with "a general safety blocklist," or `limited` with HTTPS `allowed_hosts` + `allow_mcp_servers`/`allow_package_managers` booleans, both default false) or `self_hosted` (see below). Environments are *not* versioned; each session gets its own container instance — sessions never share filesystem state.

**Session [beta].** A running agent instance in an environment; a state machine driven by events. Two-step lifecycle: create (provisions sandbox) then send `user.message`. History persists until deleted; on idle the container is **checkpointed** (filesystem, installed packages, files) and checkpoints are retained **30 days** after last activity — send periodic events to keep full container state alive longer. Usage (incl. cache tokens; 5-minute cache TTL) accumulates on the session object. Stateful by design → **not eligible for Zero Data Retention or HIPAA BAA** (overview, verbatim claim).

**Session thread / multi-agent session [beta, with a caveat].** In a multiagent session every agent shares the sandbox, filesystem, and vault credentials, but runs in its own context-isolated **session thread** with persistent history. The coordinator's `multiagent.agents` roster (max 20 unique agents, `{"type":"self"}` allowed, snapshot-pinned versions, delegation depth = 1, ≤25 concurrent threads) is documented without a preview banner on the multi-agent page — but the agent-setup page lists the equivalent field as `callable_agents`, "a research preview feature; request access." Field-name and status inconsistency logged in §I.

**Deployment (scheduled) [beta].** Server-side cron that creates sessions autonomously: agent + environment + initial `user.message` + `schedule {type: cron, expression, timezone}` (POSIX cron, IANA tz, minute granularity, ≤10s jitter, wall-clock DST semantics — nonexistent times skipped, repeated times fire twice). Optional files, GitHub, memory stores, vaults. Max **1,000 deployments/org**. Each attempt writes a **deployment run** record with typed errors (`environment_archived_error`, `agent_archived_error`, `session_rate_limited_error`). Pause/unpause (no backfill), terminal archive, manual `run` endpoint for testing.

**Vault / credential [beta].** Workspace-scoped, per-end-user credential container referenced via `vault_ids` at session creation; Anthropic manages OAuth token refresh. Credential types on the vaults docs page: `mcp_oauth` and static bearer, each bound to one immutable `mcp_server_url` (1 active credential per URL per vault, 409 on duplicates; ≤20 credentials/vault, matching ≤20 MCP servers/agent). Secrets are write-only; re-resolved periodically so rotation propagates to running sessions. A third type, **`environment_variable`**, shipped in SDK v0.109.0 and is demonstrated in the Sentry cookbook: the sandbox holds an opaque placeholder and the **egress proxy substitutes the real token only on requests to allowed hosts (`*.sentry.io`)** — "The model never sees the secret." Works for any env-var CLI (`gh`, `twilio`, `vercel`).

**Outcome [beta].** `user.define_outcome` (description + required markdown rubric, inline or Files API; `max_iterations` default 3, max 20) elevates "a session from *conversation* to *work*." The harness provisions a **grader in a separate context window** ("to avoid being influenced by the main agent's implementation choices") that returns per-criterion feedback; results: `satisfied | needs_revision | max_iterations_reached | failed | interrupted`. Grader usage is billed and reported per evaluation. One outcome at a time, chainable. Deliverables land in `/mnt/session/outputs/`, fetched via Files API scoped to the session.

**Memory store [beta].** Workspace-scoped collection of text documents mounted under `/mnt/memory/` (≤8 stores/session, attach at creation only, `read_write` default or `read_only` enforced at filesystem level, `instructions` ≤4,096 chars). Individual memories ≤100 kB (~25k tokens); guidance: "many small focused files." Every change creates an immutable **memory version** (30-day retention, recent versions always kept; redact endpoint for compliance; no restore endpoint — write back manually). The docs carry an explicit prompt-injection warning: a poisoned write is "read … as trusted memory" by later sessions; use `read_only` for reference stores. **Not yet supported with self-hosted sandboxes.**

**Dream [preview].** Asynchronous curation job — inputs: one memory store + 1–100 session transcripts; output: a **new** memory store (input never modified; review, adopt, or discard). Requires `managed-agents-2026-04-01` **and** `dreaming-2026-04-21` headers, plus request-access. Models during preview: `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-4-6`. `instructions` (≤4,096 chars) steer synthesis, not line edits. Runs as an observable session (`dream.session_id`); billed at standard token rates, "roughly linearly" with input size.

**MCP tunnel [preview].** Outbound-only path from Anthropic to MCP servers in a private network (no inbound ports, no IP allowlisting). Stack: `cloudflared` + an Anthropic proxy in your network that terminates inner TLS and routes by hostname. Quoted beta language is unusually strong: provided **"as-is" with no uptime/support/continuity commitment**, dependent on Cloudflare, "Anthropic may modify or discontinue MCP tunnels at any time." Three security layers (outer mTLS + IP validation, inner TLS Cloudflare can't read, per-server OAuth); Cloudflare still sees connection metadata (egress IP, host fingerprint, timing/bytes, assigned subdomain) as a subprocessor. Not available as claude.ai connectors. Usable from MA *and* Messages API (`mcp-client-2025-11-20` header).

**Self-hosted sandbox [public beta, per the May 19 blog post].** Orchestration stays with Anthropic; tool execution moves to infrastructure you control — "the agent's code, filesystem, and network egress never leave your environment." The `self_hosted` environment is a **work queue**; your worker (always-on poller via `ant` CLI/SDK, or webhook-triggered via SDK on `session.status_run_started`) claims sessions, downloads skills, executes tools, posts results. Filesystem contract: `/workspace` (working dir, skills at `/workspace/skills/<name>/`) and `/mnt/session/outputs` (deliverables). Auth: `ANTHROPIC_ENVIRONMENT_KEY` scoped to one environment's queue (AWS variant uses IAM SigV4). Ops: `work.stats` (depth/pending/oldest_queued_at/workers_polling), `work.stop` (graceful or `force`).

**Spill-to-file (>100K outputs) [NOT FOUND].** The dispatch lists this as a primitive. It does not appear on any fetched page — tools, events-and-streaming, reference (whose event-type tables were collapsed in the fetch), files-adjacent pages, cookbook, or release notes. "The docs do not state it" is the finding; treat as unverified until the architect can expand the reference page's event tables. §I.1.

---

## B. Architecture — brain / hands / session, mapped to the kit's surface rubric

From "Scaling Managed Agents: Decoupling the brain from the hands" (Apr 08, 2026):

- **Thesis:** harnesses encode assumptions that go stale as models improve (worked example: Sonnet 4.5 "context anxiety" resets became dead weight on Opus 4.5). MA is a **meta-harness**: opinionated about interfaces, not implementations — the OS analogy ("programs as yet unthought of"; `read()` outlasting disk packs).
- **Three virtualized components:** *session* (append-only durable event log), *harness* (the loop that calls Claude and routes tool calls), *sandbox* (execution environment). Interfaces: hands are tools — `execute(name, input) → string`; sandboxes provision via `provision({resources})`; harness recovery via `wake(sessionId)` + `getSession(id)`; durable writes via `emitEvent(id, event)`; context interrogation via `getEvents()` positional slices.
- **Pets → cattle:** the original all-in-one container was a "pet" (lost sessions on failure, undebuggable because user data shared the box, VPC coupling). Decoupled, both container and harness are disposable; failures surface as tool-call errors Claude can react to.
- **Performance:** containers are provisioned only when a tool call needs one, so inference starts immediately — **p50 TTFT dropped ~60%, p95 dropped >90%** (on-page figures).
- **Security boundary (structural, not behavioral):** tokens must be *unreachable* from the sandbox. Two patterns: (1) auth bundled with the resource — Git tokens wired into the local remote during sandbox init so `push`/`pull` work without the agent touching the token; (2) vault + MCP proxy — proxy holds a session token, fetches credentials from the vault, makes the call; "The harness is never made aware of any credentials."
- **Session ≠ context window:** the session is a context object *outside* the window; compaction/trimming decisions become recoverable because the log is durable; the harness applies arbitrary transformations (cache-friendly ordering, context engineering) on top. "Many hands": a hand can be "a container, a phone, or a Pokémon emulator," and "brains can pass hands to one another."

**Mapping to `CLAUDE-SURFACE-ROUTING.md` (kit, §2 matrix + §3 rubric):** MA is a fourth surface with a different shape, not a fourth column clone. Chat/Cowork/Code all bind brain and hands to one product session; MA splits them. Routing-relevant deltas: (1) no human-in-the-loop UI — supervision is `always_ask` permission events on an API stream, so "user can evaluate bash" (the containment post's criterion) doesn't apply; (2) persistence is server-side and *deletable but not ZDR-eligible* — opposite trade from Cowork's local-only memory; (3) credentials live in vaults/host-side proxies rather than OS keychains; (4) scheduled work is a first-class server primitive (§C) rather than an app feature; (5) the migration page explicitly maps Claude Code/Agent SDK concepts onto MA (`CLAUDE.md` hierarchy → single versioned `system` string; `permission_mode`/hooks → `permission_policy` + confirmation events; plan mode → a planning-only session) — that table is ready-made source material for a KB-06 "which surface owns the loop" section.

---

## C. Scheduled execution — mechanics and three-way comparison

MA deployment mechanics are in §A (deployment). Two verified comparators:

**Claude Code Routines** (`code.claude.com/docs/en/routines`, fetched 2026-06-10): **research preview**, on-page banner ("Behavior, limits, and the API surface may change"). A routine = prompt + repos + connectors, executed on Anthropic-managed cloud infrastructure as a full Claude Code cloud session with **no permission prompts**. Triggers: schedule (presets; custom cron via `/schedule update`; **minimum interval one hour**; stagger of a few minutes, consistent per routine; local wall-clock tz), per-routine **API endpoint** (bearer token), **GitHub events** — combinable. Pro/Max/Team/Enterprise with Claude Code on the web; org-disable toggle in admin settings. Identity model: routines belong to the individual account and **act as you** — commits, PRs, Slack/Linear actions all carry your identity; runs count against the account's daily allowance. Default egress: "Trusted" network access (package registries etc.), editable per environment; env vars carry secrets; all connected MCP connectors included by default *including writes* (docs advise pruning). One-off runs auto-disable after firing. (Claude Code Desktop also has *local* scheduled tasks — a separate page — which run on the user's machine; the Desktop "New routine → Local" path creates one.)

**Cowork scheduled tasks** — kit-internal knowledge (SURFACE-ROUTING §3 Q3 already routes "scheduled/recurring loop → Cowork"); not re-verified against product docs this run. Local-app scheduling on the user's machine/VM with Cowork's containment profile (§E pattern 3).

| Dimension | MA scheduled deployment | Claude Code Routine | Cowork scheduled task |
|---|---|---|---|
| Status | beta (`managed-agents-2026-04-01`) | research preview | shipped product feature (kit-internal; not re-verified this run) |
| Runs on | Anthropic infra (or your self-hosted sandbox for tool exec) | Anthropic cloud infra | user's machine (local VM containment) |
| Granularity | minute-level cron, ≤10s jitter | **1-hour minimum**, minutes-level stagger | product-defined (cron-style; local) |
| Triggers | cron + manual `run` | cron + API endpoint + GitHub events | schedule + one-off |
| Identity | API workspace; vault = per-end-user | **acts as the individual user** (GitHub/Slack/Linear as you) | local user's accounts/connectors |
| Credentials | vaults (mcp_oauth / bearer / env-var w/ proxy substitution; secrets never in sandbox) | environment variables in cloud env + connector OAuth | host keychain; VM gets scoped session token (§E) |
| Network egress | cloud: unrestricted-with-blocklist or `limited` allowlist; self-hosted: your policy | "Trusted" default allowlist, editable | VM egress allowlist + MITM API proxy (§E) |
| Failure model | per-run records, typed errors, auto-pause/auto-archive semantics, no retry on rate-limit until next tick | run history in sessions list (page documents allowance limits; retry semantics not stated) | app-level (not covered by fetched sources) |
| Cost model | standard API tokens on the session (+ grader tokens if outcomes; 5-min cache TTL) | plan usage / daily run allowance | plan usage |
| Human in the loop | `always_ask` permission events on the stream (optional) | none during runs | none during runs (app-level boundaries instead) |
| Org governance | org rate limits (300/600 rpm create/read), 1,000-deployment cap | admin Routines toggle | MDM mount-path allowlists (§E) |

This table is the candidate content for the new SURFACE-ROUTING scheduled-work row (the current Q3 sends all scheduled loops to Cowork; that is now a three-way decision — see §H).

Adjacent but distinct: **dynamic workflows** (`code.claude.com/docs/en/workflows`) are *on-demand* multi-agent orchestration scripts, not scheduled execution — JS scripts Claude writes, runtime-executed in the background; subagents always run `acceptEdits` inheriting the tool allowlist; ≤16 concurrent agents, ≤1,000 agents/run; org kill-switch `disableWorkflows` in managed settings (verified on-page). The page says workflows are available on all paid plans with a Pro opt-in toggle in `/config`; it does **not** state the dispatch's "default-ON for Enterprise since 2026-06-08" claim (§I.3).

---

## D. Multi-agent orchestration patterns

**The two cookbook patterns (commit `e22e683`, `patterns/agents/async_multi_agent_orchestration.ipynb`).** The notebook self-describes as "the **shape** of the two multi-agent orchestration patterns behind the multi-agent results in the Claude Opus 4.8 system card," implemented on the plain Messages API + `asyncio` (no MA harness), deliberately content-free so the mechanics are visible.

*Shared substrate (code level):*
- `Hub` — per-agent inbox (`defaultdict(list)`), per-agent `asyncio.Event` for blocking waits, a `status` dict (`active | idling | done | crashed`), and a monotonic name counter. `post()` delivers + wakes; `drain()` empties and resets the event; `render()` wraps messages as `<agent-message from="...">` blocks.
- Two tools every agent gets: `send_message(recipient_ids[], content)` — described to the model as "the ONLY way to reach other agents — plain text in your turn goes nowhere" — and `wait_for_message()` (60s timeout) — "only use this when you have nothing else to do."
- The one-line trick that removes polling: after each turn the drained inbox is **appended to the last tool result** (`results[-1]["content"] += hub.render(inbox)` — the notebook marks it "the key line"). Messages ride existing tool results; `wait_for_message` is only for genuinely idle agents.

*Pattern 1 — fixed N-agent peer team:* symmetric roster known upfront; every agent's system prompt names its peers; coordination is peer-to-peer through the hub; the lead synthesizes and ends the run.

*Pattern 2 — lead-spawn-monitor:* the lead additionally gets `create_subagents(base_instruction, per_subagent_instructions[] ≤10)` (returns immediately; helpers run as concurrent `asyncio.Task`s), `get_status()` (the four statuses above), and `kill_subagents(subagent_ids[])`. Demonstrated loop: spawn → check status → collect reports via `wait_for_message` → dismiss all. Crash containment: any exception marks the agent `crashed` in the hub rather than taking down the run.

**The MA-native equivalent (multi-agent docs page).** Same two shapes, productized: the coordinator's `multiagent.agents` roster is Pattern 1's fixed team (with `{"type":"self"}` enabling Pattern-2-style copies); threads are spawned at delegation time, are persistent (follow-ups retain prior turns), and surface lifecycle events on the primary thread (`session.thread_created`, `thread_status_running/idle/terminated`, `agent.thread_message_received/sent`). Hard limits: depth 1, ≤20 roster agents, ≤25 concurrent threads. Trust topology: shared sandbox/filesystem/vault credentials, but **MCP servers are agent-scoped** — the docs' worked example deliberately gives GitHub MCP only to the researcher, not the coordinator. Blocking events (`requires_action`) cross-post to the primary thread and the server routes confirmations back to the right thread.

**Claude Code instrumentation.** The dispatch asserts `claude agents --json` exposes a `waitingFor` field (v2.1.162) that instruments exactly the Pattern-2 blocked-on-peer state. No fetched primary source this run covers that flag — it is kit-supplied context, marked unverified here (§I.5). The dynamic-workflows page does contribute a verified third shape for KB-04 §4.7: *script-holds-the-plan* (intermediate results in script variables, not any agent's context), with adversarial cross-checking as a first-class pattern (`/deep-research` votes on claims and filters those that fail cross-checking).

**Containment cross-link:** the May 25 post's "multi-agent trust escalation" risk (§E) is the security dual of these patterns — sub-agent output treated as higher-trust than tool output becomes an injection vector. KB-04 §4.7 should carry that warning inline, not only in KB-06.

---

## E. Containment / threat-model-per-surface

From "How we contain Claude across products" (May 25, 2026) plus MA-specific pages.

**Frame.** Risk = P(failure) × blast radius; safeguards push the first down while capability growth pushes the second up. Two control families: human-in-the-loop supervision (fallible: telemetry showed users approved **~93%** of permission prompts; approval fatigue) and **containment** — "supervise what it's *able* to do." Three risk types: user misuse, model misbehavior (documented examples: sandbox escape "to be helpful," mining git history for test answers, decrypting an eval answer key), external attackers (prompt injection + conventional attacks on runtime/orchestration/proxy). Three defense components: environment (hard boundary; "if credentials never enter the sandbox, they can't be exfiltrated"), model (probabilistic: Opus 4.7 holds Gray Swan prompt-injection success to ~0.1% single-attempt / 5–6% after 100 adaptive attempts; Claude Code auto mode catches ~83% of overeager actions, misses ~17%, blocks ~0.4% benign — footnoted as one layer, "not a substitute" for a sandbox), and external content (an audited connector ≠ audited data; a passing GitHub connector can still deliver a poisoned README).

**The three isolation patterns × surfaces:**
1. **Ephemeral container (claude.ai):** gVisor, server-side only, per-session filesystem. Traditional threat model — protecting infrastructure and tenants, not the user's machine.
2. **Human-in-the-loop sandbox (Claude Code):** viable only because the median user reads bash. OS-level sandbox (Seatbelt/macOS, bubblewrap/Linux): reads allowed, writes inside workspace, **network denied by default** → 84% fewer permission prompts. Runtime **open-sourced at `github.com/anthropic-experimental/sandbox-runtime`** (verified on-page, as the dispatch noted). Experienced users auto-approve ~2× more but interrupt mid-run more — supervision shifts from gating to drift-watching, which degrades as bash gets more ambitious.
3. **Local VM (Cowork):** vendor hypervisor (Apple Virtualization framework / Windows HCS), own kernel/filesystem/process table; only the selected workspace and `.claude` are mounted; **credentials stay in the host keychain and never enter the guest**. Evolution: full-VM mode (agent loop inside; no component holding an escape-hatch key) → host-mode (loop outside, code execution inside) for reliability, "minimal security impact." Local MCP servers moved out of the VM (auditability, host-process access), aligning with Claude Desktop. File-mount modes: read-only / read-write / read-write-no-delete; symlink resolution must precede path validation; enterprise mount-path allowlists via MDM.

**Incident postmortems (all on-page):**
- *Everything before the trust dialog* (disclosures mid-2025→Jan 2026): a cloned repo's `.claude/settings.json` hook executed during startup, **before** the "Do you trust this folder?" prompt. Fix-shape: defer parsing/execution of project-local config until after trust; "treat project-open, config-load, and localhost listeners the way you'd treat any inbound request from the internet."
- *The user as injection vector* (Feb 2026 internal red team): a phished employee pasted a routine-looking prompt that asked Claude to read `~/.aws/credentials` and POST them out; **24/25 retries completed the exfiltration**. Direct injection through the user defeats intent-anchored model defenses — "the only defense that holds is the environment" (egress controls + filesystem boundaries). Coda: the payload shared in Slack became ambient for Slack-reading agents; a canary string was added — "the investigation tooling is also an attack surface."
- *Exfiltration through an approved domain* (third-party disclosure): a malicious workspace file carried an attacker's API key; Claude uploaded workspace files to the attacker's account via the *allowed* `api.anthropic.com` Files API. Doctrine: **"an allowlist … may be better conceptualized as a capability grant"** — every function reachable through an allowed domain is attack surface. Fix: a defensive MITM proxy inside the VM that passes only requests carrying the VM's own provisioned session token and strips server-side-fetch headers; it lives in the VM because only the VM knows provenance.
- *EDR blindness:* the same isolation that contains Claude keeps endpoint detection out; the VM is an opaque hypervisor process. Mitigation: pull-based OTLP log export — "not the same as live monitoring; budget for this conversation early."

**MA-specific threat surface (docs):** self-hosted shared-responsibility split — Anthropic owns control-plane integrity, multi-tenant isolation, "agent-context minimization"; the operator owns image hardening, egress policy, `ANTHROPIC_ENVIRONMENT_KEY` custody (anomaly detection but **no instant revocation**), per-trust-boundary workspace/environment separation, in-container tool blast radius, and data retention ("Anthropic has no visibility into what your worker does with session content once delivered"). Never set `ANTHROPIC_API_KEY` on the worker host — it exposes an org-scoped credential to agent tool calls. Permission policies: agent toolset defaults `always_allow`; **MCP toolsets default `always_ask`** specifically so new server-side tools can't execute unapproved. Vault scoping + the Sentry placeholder-token proxy implement the credentials-never-in-sandbox doctrine for both MCP and CLI auth.

**Forward risks (verbatim themes, all three the dispatch anticipated):** (1) **persistent memory poisoning** — "product memory, CLAUDE.md files, mounted workspaces, and the state directories of scheduled and long-running agents" are reloaded each start; injections become persistence mechanisms "in the classic post-exploitation sense"; startup classifiers needed. The MA memory-store docs independently carry the same warning with a concrete mitigation (`read_only` mounts). (2) **Multi-agent trust escalation** — sub-agents can launder injected content into higher-trust "structured facts." (3) **Agent identity** — Cowork's answer (host keychain, per-session scoped token, independently revocable) vs. the open principal-vs-extension-of-user question. Note the tension with Routines' verified identity model (§C): routines act *as the user* across GitHub/Slack/Linear.

**Principles (closing, on-page):** containment at the environment layer first, model steering second ("the deterministic boundary is what gets hit when everything probabilistic misses"); match isolation strength to the user's capacity for oversight; "be wary of custom components" — across every deployment, battle-tested primitives (gVisor, seccomp, hypervisors) held while the custom proxy/allowlist work broke.

---

## F. Sandbox provider matrix

Self-hosted guide + May 19 blog post (provider claims are first-party-published but vendor-supplied; treat marketing adjectives accordingly).

| Provider | Distinguishing mechanics (as published) | Notable security posture |
|---|---|---|
| **Cloudflare** | microVMs + lighter-weight isolates; connect to internal services over Cloudflare's network | zero-trust secrets injection; customizable egress proxies to audit/reroute/modify traffic |
| **Daytona** | "full composable computers" — long-running, stateful; pause/restore with full state; SSH or authenticated preview URL into a live session | state persistence is the feature *and* the retention surface |
| **Modal** | custom container runtime, sub-second cold start on any image; scales to hundreds of thousands of concurrent sandboxes; CPU+GPU | shares Modal's function/storage/networking primitives |
| **Vercel** | VM-isolated sandboxes, millisecond startup, VPC peering, bring-your-own-cloud | **firewall injects credentials at the network boundary "so they never enter the sandbox"** — same doctrine as §B/§E |
| **Generic worker** | any platform: poll `Environments Work` endpoints (poll, ack, heartbeat, stop, post results, per-item get, stats) directly | you implement the entire §E operator column yourself |

**Control split (applies to all five):** the operator controls the container image and runtime, resource sizing, network egress, file/repo mounting, data retention, and worker lifecycle; Anthropic controls orchestration, the session log, work-queue integrity, multi-tenant isolation, model access, and skill delivery (downloaded into `/workspace/skills/`). Platform notes: SDK workers hard-require `/bin/bash` at that path; TS worker needs `unzip`, `tar`, Node 22+; on Claude Platform on AWS the worker authenticates via IAM (`AnthropicSelfHostedEnvironmentAccess` policy) and the work *list* endpoint is unavailable. Memory stores do not yet work self-hosted (§A).

---

## G. Beta boundary table

For KB-06 beta-bounded writing. "Header" = exact `anthropic-beta` value quoted from the fetched page.

| Capability | Status (2026-06-10) | Gate / header | Source of status claim |
|---|---|---|---|
| Managed Agents as a whole | **beta**, default-enabled for all API accounts | `managed-agents-2026-04-01` on every request (SDK auto-sets) | overview |
| Agents, environments (cloud), sessions, events, webhooks, files/GitHub resources | beta | MA header | respective doc pages (header note repeated per page) |
| Vaults + credentials (incl. `environment_variable`) | beta | MA header | vaults page; SDK v0.109.0; Sentry cookbook |
| Scheduled deployments | beta | MA header | scheduled-deployments page; SDK v0.109.0 |
| Outcomes (grader/rubric) | beta | MA header (+ `files-api-2025-04-14` for rubric upload) | define-outcomes page |
| Memory stores + versions | beta ("default capacity and rate limits … while this feature is in beta") | MA header | memory page |
| Multiagent sessions | beta on the multi-agent page; **`callable_agents` listed as research preview (request access) on agent-setup** | MA header | both pages — contradiction logged §I.2 |
| Self-hosted sandboxes | **public beta** | MA header + environment key | May 19 blog (status wording); self-hosted docs |
| **MCP tunnels** | **research preview**, request access; "as-is," no continuity commitment, may be discontinued | `mcp-tunnels` (Tunnels API); consumer side `mcp-client-2025-11-20` | tunnels overview |
| **Dreaming** | **research preview**, request access | MA header **+ `dreaming-2026-04-21`** | dreams page |
| Claude Code Routines (comparator) | research preview | n/a (product) | routines page banner |
| Dynamic workflows (comparator) | shipped on all paid plans; Pro opt-in toggle | n/a; org `disableWorkflows` | workflows page |
| ZDR / HIPAA BAA for MA | **not eligible** (stateful by design); sessions/files deletable | — | overview |

**Limits inventory (one place, all on-page):** create 300 rpm / read 600 rpm per org; ≤20 MCP servers per agent and ≤20 credentials per vault; ≤20 skills per session (counted across all agents); ≤8 memory stores per session; ≤100 kB per memory; memory versions retained 30 days (recent always kept); session checkpoints 30 days; ≤25 concurrent threads; ≤20 roster agents, delegation depth 1; ≤1,000 deployments per org; outcomes `max_iterations` ≤20 (default 3); dreams ≤100 sessions, `instructions` ≤4,096 chars; prompt-cache TTL 5 min. Branding: partners may say "Claude Agent," never "Claude Code"/"Claude Cowork" or Code-styled ASCII art (reference page).

---

## H. Kit integration map

Grep run 2026-06-10 over the kit (excluding `research/`), terms per dispatch: `managed agent|dreaming|outcomes|multi-agent|orchestrat|fallback|sandbox|containment|threat`. Hits concentrate in `vigilance/feed/*` (operational tracking, not KB content), `CHANGELOG/HANDOFF`, and the files below. **No `KB-06-MANAGED-AGENTS.md` exists — the reserved slot is empty, as expected.**

| # | Finding (this dossier) | Kit file → section | Action |
|---|---|---|---|
| 1 | Whole dossier | `knowledge-base/KB-06-MANAGED-AGENTS.md` (new) | **Create.** Proposed outline mirroring this dossier: §0 exec distillation; §1 primitives + beta boundary (A+G); §2 brain/hands architecture + surface mapping (B); §3 scheduled execution & the three-way table (C); §4 multi-agent patterns (D); §5 containment & threat-model-per-surface (E); §6 self-hosting & provider matrix (F); §7 cross-refs. Conditional-pack question for the architect: KB-06 reads as **core** (cross-cutting, like KB-04), not a conditional pack (KB-03/KB-07 style) — it touches routing, security, and orchestration for every project that outgrows one surface. |
| 2 | Peer-hub vs lead-spawn-monitor (D), MA multiagent verbs, workflows' script-holds-the-plan | `KB-04` §4 (Orchestrator Dispatch Mechanics, currently 4.1–4.6) | **Extend:** new §4.7 "Async multi-agent orchestration" — the two cookbook patterns as the conceptual core, MA threads and `multiagent` roster as the managed implementation, dynamic workflows as the scripted variant; inline the trust-escalation warning (E). |
| 3 | Three-way scheduled-execution comparison (C) | `knowledge-base/CLAUDE-SURFACE-ROUTING.md` §3 rubric | **Modify Q3:** currently routes any "scheduled/recurring loop" → Cowork. Split the scheduled-work branch: repo-centric + act-as-me → Code Routine (research preview caveat); API-surface, per-end-user credentials, org-governed, minute-level cron → MA deployment; local-files/desktop context → Cowork. Add MA as a routed surface or an explicit §2 matrix column. |
| 4 | Threat-model-per-surface (E) | `CLAUDE-SURFACE-ROUTING.md` new section (after §4 anti-patterns) | **Create §“Threat model per surface”:** the 3-patterns table (ephemeral container / HITL sandbox / sealed VM / + MA split-brain as a fourth row), the allowlist-as-capability-grant doctrine, match-isolation-to-oversight principle. §6 quote library candidates: the 93% approval stat; "an allowlist … is a capability grant"; "the model never sees the secret" (Sentry README); MCP tunnels' "as-is" sentence. |
| 5 | MCP tunnels (A, G), MA MCP connector + vault auth, `always_ask` default (E) | `knowledge-base/MCP-SERVER-REGISTRY.md` (tiered; has a May-2026 security cluster section) | **Extend:** add an "MCP tunnels" posture entry (research preview, Cloudflare metadata visibility, 3-layer model, not-in-claude.ai) + a registry-wide note that MA consumes remote/streamable-HTTP servers with vault-supplied auth and `always_ask` default. Contrast note for the existing Sentry MCP entry: the official cookbook authenticates `sentry-cli` via env-var vault credential instead of MCP — two sanctioned routes to the same service. |
| 6 | Memory poisoning + `read_only` mitigation, versions/redact, dreams curation (A, E) | `KB-01` §3 Memory Engineering (3.1–3.6) | **Extend:** new §3.7 "Memory hygiene under adversarial input" — persistent-store poisoning as post-exploitation persistence (CLAUDE.md-class files included), `read_only` mounts for reference stores, immutable versioning + redaction as audit/recovery, dreams as reviewed (never in-place) consolidation. Cross-ref KB-06 §5. |
| 7 | Server-side fallbacks on refusal + client middleware + `frontier_llm` category (SDK v0.108.0/v0.109.1) | `CLAUDE-SURFACE-ROUTING.md` §1a (Mythos-tier routing) | **Cross-ref:** §1a's Fable-5 fallback-to-Opus note now has SDK-level mechanics; the new refusal category is the observable signal. One-line addition, source = release tags. |
| 8 | Brain/hands + meta-harness framing (B); migration page's SDK→MA table | `KB-02` (architecture: rules/skills/agents/blueprints) | **Cross-ref only:** KB-02's agent-architecture sections should point at KB-06 §2 rather than duplicate; the migration table (CLAUDE.md→system string, hooks→permission events) belongs in KB-06. |
| 9 | Routines (C) | `workflows/WORKFLOW-CLAUDE-CODE.md`; `templates/claude-code/rules/orchestrator-dispatch.md.template` | **Extend (small):** WORKFLOW-CLAUDE-CODE gains a Routines subsection (research-preview-bounded); the dispatch template gains MA deployments + Routines as dispatch targets alongside interactive sessions. |
| 10 | Containment numbers + open-sourced `sandbox-runtime` (E) | `vigilance/WATCHLIST.md` | **Add source:** `anthropic-experimental/sandbox-runtime` repo as a watched artifact (auditable boundary; release cadence signals Code/Cowork containment changes). |

---

## I. Open questions & date-trap log

**Open questions (do not resolve by guessing):**
1. **Spill-to-file (>100K outputs):** absent from every fetched page (§A). The reference page's event-type tables were collapsed in the fetch — the architect should re-pull `managed-agents/reference` with a renderer that expands accordions (Chrome MCP `get_page_text`) before writing any claim.
2. **`callable_agents` vs `multiagent`:** agent-setup documents `callable_agents` as "research preview … request access"; the multi-agent page documents `multiagent.agents` with full mechanics and no preview banner. Same feature mid-rename, or two gating tiers? KB-06 must not assert either status until reconciled.
3. **"Dynamic workflows default-ON for Enterprise since 2026-06-08" (dispatch claim):** the workflows page says all-paid-plans availability with a Pro `/config` opt-in; no Enterprise default-ON statement, no 06-08 date. Possibly from a changelog page not fetched this run — unverified, do not carry into KB-06.
4. **Tokyo restatement:** the Tokyo page is agenda-only (event is 2026-06-10, same day as this run). The substantive restatement is the **May 19** blog post + docs; every claim the dispatch attributed to Tokyo (4 providers + generic worker, tunnels, multiagent shared filesystem, Dreaming) is verified from those instead. If a Tokyo recap post lands (cf. the SF/London recaps), it's Dossier-B/next-cycle material.
5. **`claude agents --json` `waitingFor` (v2.1.162):** kit-supplied; no primary source fetched this run covers it. Verify against Claude Code changelog before citing in KB-04 §4.7.
6. **Docs naming drift:** nav alternates "Cloud sandbox reference" (`/cloud-sandboxes-reference`) and "Cloud container reference" (`/cloud-containers`) across pages — an in-flight sandbox→container rename. Use "container" for the managed runtime in KB-06 prose, keep both slugs in links.
7. **ZDR/HIPAA under self-hosting:** overview says MA is ineligible; the self-hosted page only links the eligibility table. Whether self-hosting changes eligibility is **not stated** on fetched pages.
8. **Dispatch pointer mismatch:** "KIT-VIGILANCE anti-pattern #4" was cited for the beta-bounded-claims discipline, but KIT-VIGILANCE.md's anti-pattern #4 is watchlist pruning, and "beta" appears nowhere in that file. The discipline itself is real (SURFACE-ROUTING practices it); the pointer needs fixing wherever it's encoded.
9. **v0.107.1** exists in the changelog chain (v0.108.0 diffs from it); contents not reviewed — the dispatch's v0.107.0→v0.109.1 list skips it.
10. **PR numbers #696/#698:** commits `e22e683`/`3dc70b5` verified directly; the PR linkage wasn't visible on fetched pages. The Sentry README also references files (`skill.md`, `setup_agent.py`, `run_now.py`, `runs.py`, `teardown.py`) beyond commit `3dc70b5`'s file list (`agent_config.py`, `cma.py`, `deploy.py` + meta) — PR #698 is likely multi-commit; per-file claims here are scoped to the files actually fetched.

**Date-traps caught this run (the 06-08 pattern continues):**
- Search-result prose: "Code w/ Claude headed to Tokyo on **June 5–6**" — the fetched Tokyo page says **10 June 2026** (FAQ: "Tokyo (10 June)"). Snippet conflated event dates.
- Dispatch carried "default-ON for Enterprise since 2026-06-08" — not on the cited page (above, #3).
- Dispatch's "Tokyo restatement" attribution — content actually shipped in the **May 19** blog + docs; the Tokyo page itself contains none of it (above, #4).
- Near-trap on versions: the `frontier_llm` refusal category shipped in **v0.109.1 as a Bug Fix**, not a feature release; and all three of v0.108.0/v0.109.0/v0.109.1 landed on **2026-06-09** (16:37, 20:04, 23:55) — release-page timestamps, confirming the "coordinated delivery" reading rather than a multi-day rollout.

---
*End of dossier. Written by the Dossier-A extraction agent, Cowork session 2026-06-10. No kit files outside `research/` were modified. Not committed — awaiting operator review + `aikit-commit`.*
