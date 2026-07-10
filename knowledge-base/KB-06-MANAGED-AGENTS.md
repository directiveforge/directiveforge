# KB-06 — Managed Agents (The Agent-Org Layer)

> How to evaluate, route to, secure, and operate hosted autonomous agents — Anthropic's Managed Agents surface specifically, and the hosted-agent operational discipline generally. The layer a project needs when its agents outgrow one interactive surface.

> **⚠ BETA SURFACE — read this first.** Every Managed Agents endpoint sits behind the `managed-agents-2026-04-01` beta header ("All Managed Agents API requests require the `managed-agents-2026-04-01` beta header" — reference page, verified 2026-06-10). **No Managed Agents primitive is GA as of 2026-06-10.** This KB is therefore *reference-level* coverage: know the surface, evaluate against it, prototype on it — do not lock production architecture to it without the §8 rubric and the §7 lock-in counterweights. Claims tighten to recommendations when primitives reach GA (§10 refresh triggers).

*Compiled: 2026-06-10 · Sources: Dossier A (`research/2026-06-10-managed-agents-primary-sources.md`, primary-source extraction) + Dossier B (`research/2026-06-10-managed-agents-chat-sources.md`, field evidence) + same-day re-verification fetches (reference, agent-setup, multi-agent pages) · Refresh: monthly via vigilance cadence (§10)*

---

## 0. Executive distillation

Managed Agents (MA) is Anthropic's API-side hosted-agent platform: versioned **agents** run in **sessions** inside managed or self-hosted **environments**, with server-side **scheduled deployments**, per-end-user **vaults** for credentials, rubric-graded **outcomes**, mounted **memory stores**, and **multiagent** session threads. The architecture decouples "the brain from the hands" — the model loop, the durable session log, and the execution sandbox are independently replaceable components rather than one product session.

Five things the rest of the kit needs from this KB:

1. **A fourth surface *shape*, not a fourth column.** Chat/Cowork/Code bind brain and hands to one product session with a human at the keyboard; MA splits them and replaces the human with an event stream. Supervision, persistence, credentials, and scheduling all change shape (§2). Task-level routing stays in `CLAUDE-SURFACE-ROUTING.md`; MA enters that rubric where its shape differs — scheduled/headless work (its §3a) and threat modeling (its §4a).
2. **Scheduled execution is now a three-way call** — MA deployment vs Claude Code Routine vs Cowork scheduled task — driven by identity, credentials, granularity, and governance, not by feature lists (§3).
3. **The containment doctrine is portable even where the platform is beta.** Credentials-never-in-the-sandbox, allowlist-as-capability-grant, environment-layer-first defense: these survive any vendor's implementation (§5).
4. **The economics are unproven and the lock-in critique is the strongest independent objection.** One credible independent production writeup exists and MA *lost* on cost/latency in it; treat vendor case studies as first-party claims (§7).
5. **Adopt/defer is a gated call, not a default-adopt** (§8). The fit-list is narrow and real; the disqualifiers (compliance, portability, cost-control maturity) are hard.

---

## 1. The primitive glossary + beta boundary

Status tiers: **[beta]** = behind the standard MA header only, default-enabled for API accounts · **[preview]** = additionally request-access-gated · statuses as of 2026-06-10.

**Agent [beta].** A reusable, *versioned* configuration: name, model (all Claude 4.5+ models; object form supports `speed: fast`), system prompt, tools, `mcp_servers`, skills, metadata. Updates create new versions (no-op detection; omitted fields preserved; arrays fully replaced; metadata key-merged). Sessions can pin a version → staged rollouts and one-field model migrations. Archive = read-only: running sessions continue, new sessions cannot reference it. No unarchive operation is documented (single-source flag: Dossier B reports archiving as "permanent with no unarchive"; Dossier A confirms only the terminal/read-only semantics).

**Environment [beta].** Where sessions execute. `cloud`: Anthropic-managed container; `packages` pre-install for apt/cargo/gem/go/npm/pip (cached per environment); networking either `unrestricted` default ("a general safety blocklist") or `limited` with an HTTPS `allowed_hosts` allowlist plus `allow_mcp_servers`/`allow_package_managers` booleans (both default false). `self_hosted`: §6. Environments are *not* versioned; every session gets its own container instance — **sessions never share filesystem state**.

**Session [beta].** A running agent instance; a state machine driven by events. Two-step lifecycle: create (provisions sandbox), then send `user.message`. On idle the container is **checkpointed** (filesystem, packages, files); checkpoints retain **30 days** after last activity. Usage (including cache tokens, 5-minute cache TTL) accumulates on the session object. **Stateful by design → not eligible for Zero Data Retention or HIPAA BAA** (overview, verbatim claim); sessions and files are deletable, but deletability ≠ ZDR. Dossier B additionally reports the docs state the SSE event stream "has no replay" — a dropped stream mid tool-confirmation can deadlock a session (single-source flag; not independently re-verified, the events page renders client-side).

**Scheduled deployment [beta].** Server-side cron that creates sessions autonomously: agent + environment + initial `user.message` + `schedule {type: cron, expression, timezone}`. POSIX cron, IANA timezone, **minute granularity, ≤10s jitter**, wall-clock DST semantics (nonexistent times skipped; repeated times fire twice). Optional files, GitHub, memory stores, vaults. Max **1,000 deployments/org**. Every attempt writes a **deployment run** record with typed errors: `environment_archived_error`, `agent_archived_error`, and `session_rate_limited_error` (the rate-limited case gets no retry until the next tick). Pause/unpause (no backfill), terminal archive, manual `run` endpoint for testing. Full mechanics + the three-way surface comparison: §3.

**Vault / credential [beta].** Workspace-scoped, per-end-user credential container, referenced via `vault_ids` at session creation; Anthropic manages OAuth refresh. Three credential types. The two MCP-facing types — `mcp_oauth` and static bearer — each bind to one immutable `mcp_server_url` (1 active credential per URL per vault; 409 on duplicates; ≤20 credentials/vault). Secrets are write-only and re-resolved periodically (rotation propagates to running sessions). The third type, `environment_variable` (SDK v0.109.0), is not URL-bound — it is the doctrine showcase: the sandbox holds an opaque placeholder and the **egress proxy substitutes the real token only on requests to allowed hosts** — "The model never sees the secret" (Sentry cookbook README). Works for any env-var CLI (`gh`, `sentry-cli`, `twilio`, `vercel`). §5.

**Outcome [beta].** `user.define_outcome` (description + required markdown rubric, inline or via Files API; `max_iterations` default 3, max 20) elevates "a session from *conversation* to *work*." The harness provisions a **grader in a separate context window** ("to avoid being influenced by the main agent's implementation choices") returning per-criterion feedback; results: `satisfied | needs_revision | max_iterations_reached | failed | interrupted`. Grader tokens are billed and reported per evaluation. One outcome at a time, chainable. Deliverables land in `/mnt/session/outputs/`, fetched via session-scoped Files API.

**Memory store [beta].** Workspace-scoped text documents mounted under `/mnt/memory/` (≤8 stores/session; attach at creation only; `read_write` default or `read_only` enforced at the filesystem level; `instructions` ≤4,096 chars). Memories ≤100 kB each (~25K tokens); guidance: "many small focused files." Every change creates an immutable **memory version** (30-day retention, recent versions always kept; redact endpoint for compliance; no restore endpoint — write back manually). The docs carry an explicit prompt-injection warning — a poisoned write is "read … as trusted memory" by later sessions; mitigation: `read_only` mounts for reference stores (§5). **Not yet supported with self-hosted sandboxes.**

**Multiagent session [beta, with a documented gating inconsistency].** One coordinator delegates to a roster of agents running in context-isolated **session threads** over a shared sandbox/filesystem/vault set. Full mechanics: §4. Gating caveat: the multi-agent page documents `multiagent.agents` with no preview banner, while the agent-setup page lists the equivalent `callable_agents` field as "a research preview feature; request access to try it" — both verified live on 2026-06-10. Treat multiagent orchestration as possibly request-access-gated until the docs reconcile (§11).

**Dream [preview].** Asynchronous memory curation: inputs = one memory store + 1–100 session transcripts; output = a **new** memory store (input never modified; review, adopt, or discard). Requires `managed-agents-2026-04-01` **and** `dreaming-2026-04-21` headers plus request access. Preview models: `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-4-6`. `instructions` (≤4,096 chars) steer synthesis, not line edits. Runs as an observable session (`dream.session_id`); billed at standard token rates "roughly linearly" with input size. Industry note: between-run memory curation went cross-vendor in the same window — OpenAI shipped its own "Dreaming" for ChatGPT memory on 2026-06-04 (consumer personalization rather than agent self-improvement; convergent mechanism, different target). Frame Dreaming as an industry primitive with two first-party implementations, not an Anthropic-ism.

**MCP tunnel [preview].** Outbound-only path from Anthropic to MCP servers in a private network (no inbound ports, no IP allowlisting): `cloudflared` + an Anthropic-provided proxy in your network that terminates inner TLS and routes by hostname. The beta language is unusually strong — provided **"as-is" with no uptime/support/continuity commitment**; "Anthropic may modify or discontinue MCP tunnels at any time." Three security layers (outer mTLS + IP validation; inner TLS Cloudflare cannot read; per-server OAuth); Cloudflare still sees connection metadata (egress IP, host fingerprint, timing/bytes, assigned subdomain) as a subprocessor. Not available as claude.ai connectors; usable from MA *and* the Messages API (`mcp-client-2025-11-20` header).

**Self-hosted sandbox [public beta, per the 2026-05-19 blog post].** Orchestration stays with Anthropic; tool execution moves to infrastructure you control. §6.

### 1.1 Beta boundary table

| Capability | Status (2026-06-10) | Gate / header |
|---|---|---|
| Managed Agents as a whole | beta, default-enabled for API accounts | `managed-agents-2026-04-01` (SDK auto-sets) |
| Agents, cloud environments, sessions, events, webhooks, files/GitHub | beta | MA header |
| Vaults + credentials (incl. `environment_variable`) | beta | MA header |
| Scheduled deployments | beta | MA header |
| Outcomes (grader/rubric) | beta | MA header (+ `files-api-2025-04-14` for rubric upload) |
| Memory stores + versions | beta ("default capacity and rate limits … while this feature is in beta") | MA header |
| Multiagent sessions | beta on the multi-agent page; `callable_agents` = research preview / request access on agent-setup — **inconsistent, unreconciled** | MA header (+ possibly request access) |
| Self-hosted sandboxes | public beta | MA header + environment key |
| MCP tunnels | research preview, request access, "as-is" | tunnels API; consumer side `mcp-client-2025-11-20` |
| Dreaming | research preview, request access | MA header + `dreaming-2026-04-21` |
| ZDR / HIPAA BAA | **not eligible** (stateful by design) | — |

### 1.2 Limits inventory (one place; all on-page as of 2026-06-10)

Create 300 rpm / read 600 rpm per org · ≤20 MCP servers per agent · ≤20 credentials per vault (1 active per server URL) · ≤20 skills per session (counted across all agents) · ≤8 memory stores per session · ≤100 kB per memory · memory versions retained 30 days (recent always kept) · session checkpoints 30 days after last activity · ≤25 concurrent threads · ≤20 roster agents, delegation depth 1 · ≤1,000 deployments per org · outcomes `max_iterations` ≤20 (default 3) · dreams ≤100 transcripts, `instructions` ≤4,096 chars · prompt-cache TTL 5 min. Partner branding: "Claude Agent" allowed; "Claude Code"/"Claude Cowork" and Code-styled ASCII art not permitted.

---

## 2. Architecture — decoupling the brain from the hands

From Anthropic's "Scaling Managed Agents: Decoupling the brain from the hands" (2026-04-08):

**The meta-harness thesis.** Harnesses encode assumptions that go stale as models improve — the post's worked example: Sonnet 4.5-era "context anxiety" resets became dead weight on Opus 4.5. MA's answer is a harness opinionated about *interfaces*, not implementations (the OS analogy: `read()` outlived disk packs; "programs as yet unthought of").

**Three virtualized components.** *Session* — an append-only durable event log, a context object that lives *outside* the context window. *Harness* — the loop that calls Claude and routes tool calls; recoverable via `wake(sessionId)`; durable writes via `emitEvent()`; the harness can apply arbitrary transformations (compaction, cache-friendly ordering) on top of the log because the log, not the window, is the source of truth. *Sandbox* — provisioned only when a tool call needs one, so inference starts immediately (published figures: p50 TTFT down ~60%, p95 down >90%). Hands are tools — `execute(name, input) → string`; a hand can be "a container, a phone, or a Pokémon emulator," and "brains can pass hands to one another."

**Pets → cattle.** The original all-in-one container lost sessions on failure and was undebuggable because user data shared the box. Decoupled, both container and harness are disposable; infrastructure failures surface as tool-call errors the model can react to.

**The structural security boundary.** Tokens must be *unreachable* from the sandbox, not merely hidden: (1) auth bundled with the resource — Git credentials wired into the local remote during sandbox init, so `push`/`pull` work without the agent ever holding the token; (2) vault + proxy — the proxy fetches credentials and makes the call; "The harness is never made aware of any credentials." This is §5's doctrine in architectural form.

### 2.1 Why MA is a fourth surface *shape* (mapping to `CLAUDE-SURFACE-ROUTING.md`)

| Dimension | Chat / Cowork / Code | Managed Agents |
|---|---|---|
| Brain↔hands binding | One product session, human at the keyboard | Split: harness + durable log + provisioned sandbox |
| Supervision | UI prompts; a human reads the bash | `always_ask` permission events on an API stream — there is no human-in-the-loop *UI*; you build the supervisor |
| Persistence | Product-managed (local for Cowork; cloud for Chat) | Server-side session log + checkpoints; deletable but **not ZDR-eligible** — the opposite trade from Cowork's local-only memory |
| Credentials | OS keychain / connector OAuth | Vaults + host-side proxies; secrets structurally outside the sandbox |
| Scheduling | App feature | First-class server primitive (§3) |

Routing consequence: MA does not get a fourth column in SURFACE-ROUTING's capability matrix — it enters the rubric where its shape differs, i.e. scheduled/headless work (SURFACE-ROUTING §3a) and threat modeling (SURFACE-ROUTING §4a).

### 2.2 Migration mapping (Claude Code / Agent SDK → MA)

The "which surface owns the loop" decoder. Rows 1–3 are the MA migration page's own mappings; rows 4–5 are kit-synthesized from the multi-agent and outcomes/self-hosted docs (marked ☆):

| Claude Code / Agent SDK concept | Managed Agents equivalent |
|---|---|
| `CLAUDE.md` hierarchy (project memory) | Single versioned `system` string on the agent (+ memory stores for evolving context) |
| `permission_mode`, hooks | `permission_policy` per toolset + confirmation events on the stream |
| Plan mode | A planning-only session (separate agent or instruction set) |
| ☆ Subagents (`Task` tool) | Multiagent roster + session threads (§4) |
| ☆ Local filesystem | Per-session container filesystem; deliverables at `/mnt/session/outputs/` |

---

## 3. Scheduled execution — the three-way call

Scheduled agentic work now has three Anthropic-native homes. The decision is driven by **identity, credentials, granularity, and governance** — not by feature count.

| Dimension | MA scheduled deployment | Claude Code Routine | Cowork scheduled task |
|---|---|---|---|
| Status (2026-06-10) | beta (`managed-agents-2026-04-01`) | research preview (on-page banner) | shipped product feature (kit-internal knowledge; not re-verified this cycle) |
| Runs on | Anthropic infra (or your self-hosted sandbox for tool exec) | Anthropic cloud infra, full Claude Code session, **no permission prompts** | User's machine (local VM containment) |
| Granularity | minute-level cron, ≤10s jitter | **1-hour minimum interval**; consistent per-routine stagger | product-defined (cron-style; local) |
| Triggers | cron + manual `run` | cron + per-routine API endpoint (bearer) + GitHub events — combinable | schedule + one-off |
| Identity | API workspace; vaults are per-end-user | **acts as the individual user** — commits, PRs, Slack/Linear actions carry your identity; runs count against your allowance | local user's accounts/connectors |
| Credentials | vaults (`mcp_oauth` / bearer / env-var with proxy substitution; secrets never in sandbox) | env vars in the cloud environment + connector OAuth; **all connected MCP connectors included by default, writes included** (docs advise pruning) | host keychain; VM gets a scoped session token |
| Network egress | cloud: unrestricted-with-blocklist or `limited` allowlist; self-hosted: your policy | "Trusted" default allowlist, editable per environment | VM egress allowlist + defensive MITM proxy |
| Failure model | per-run records, typed errors, pause/archive semantics, no rate-limit retry until next tick | run history in sessions list; retry semantics not stated on-page | app-level |
| Cost model | standard API tokens on the session (+ grader tokens if outcomes) | plan usage / daily run allowance | plan usage |
| Human in the loop | optional `always_ask` events on the stream | none during runs | none during runs (app-level boundaries instead) |
| Org governance | org rate limits, 1,000-deployment cap, workspace scoping | admin Routines disable toggle; org-level | MDM mount-path allowlists |

**The routing call** (mirrored as the decision rubric in `CLAUDE-SURFACE-ROUTING.md` §3a — that section distills, this table is canonical):

- **Repo-centric work where acting as a specific person is acceptable or desired** (the routine commits, opens PRs, posts to the team's Slack *as you*) → **Code Routine**, accepting research-preview churn and the 1-hour floor. Prune its default connector set before first run — write access to every connected MCP is the default.
- **Org-governed, API-surfaced, per-end-user-credentialed, or minute-granular work** (customer-facing agents, multi-tenant back-office loops, anything needing typed run records and workspace governance) → **MA deployment**, accepting beta status and wiring cost enforcement first (§7).
- **Local-files / desktop-context / personal-workflow loops** → **Cowork scheduled task**, inheriting the sealed-VM containment profile.
- **Identity is the sharpest discriminator.** A Routine acting as a person is a feature (your repo, your accountability) and a risk (your identity is the blast radius). MA's vault model is built for *someone else's* credentials — per-end-user, revocable, never in the sandbox.

**One-off vs scheduled.** Routines' one-off runs auto-disable after firing; MA's manual `run` endpoint exists for deployment testing, not ad-hoc work — ad-hoc sessions are just sessions. Adjacent but distinct: Claude Code **dynamic workflows** are *on-demand* multi-agent orchestration scripts (≤16 concurrent agents, ≤1,000 agents/run, subagents always `acceptEdits` inheriting the tool allowlist, org `disableWorkflows` kill-switch), not scheduled execution — they appear in KB-04 §4.7 as the scripted orchestration variant.

**Cost discipline is part of the routing call, not an afterthought.** Every scheduled surface shares the failure mode Dossier B's postmortems establish for hosted agents generally: cost compounds nonlinearly because context accumulates per call, and **monitoring is not enforcement** — alerts fire after spend. Wire in-process enforcement (hard step caps, USD budget gates, duplicate-input loop detectors) before the first scheduled run on *any* of the three surfaces (§7).

---

## 4. Multiagent sessions — the managed implementation

The *pattern mechanics* (peer-hub messaging, lead-spawn-monitor, the append-to-tool-result trick, when async beats wave-based dispatch) live in **KB-04 §4.7** — they are harness-agnostic orchestration patterns implementable on the bare Messages API. This section covers what MA *productizes* on top of them.

**Trust topology.** All agents in a multiagent session share the sandbox, filesystem, and vault credentials, but each runs in its own **session thread** — a context-isolated event stream with persistent history (the coordinator can follow up with an agent that retains its prior turns). Tools, MCP servers, and context are *not* shared: **MCP servers are agent-scoped** while **vault credentials are session-scoped**. The docs' worked example is deliberate: only the researcher agent declares the GitHub MCP server, so the coordinator cannot touch GitHub even though the session's vault carries the credential. This is least-privilege as a roster-design decision — give each roster agent only the servers its role needs.

**Roster mechanics.** The coordinator declares `multiagent: {type: coordinator, agents: [...]}`: `{"type":"agent","id":...}` pins to the referenced agent's latest version *at coordinator create/update time* (or pin explicitly with `version`); `{"type":"self"}` lets the coordinator spawn copies of itself. The roster is **snapshotted** — referenced agents do not silently pick up later definition updates; you update the coordinator to roll the roster forward. Hard limits: ≤20 unique roster agents, delegation depth 1 (deeper is ignored), ≤25 concurrent threads, multiple copies of one agent allowed.

**Observability.** The session-level event stream is the **primary thread**: a condensed cross-thread view (thread starts/ends, `session.thread_created`, `session.thread_status_running/idle/terminated`, `agent.thread_message_received/sent`) plus every *blocking* event. Per-agent reasoning lives in that agent's session-thread stream. Blocking events (`requires_action` — an `always_ask` tool confirmation or a custom-tool result) are **cross-posted to the primary thread** with the originating `session_thread_id`; you post `user.tool_confirmation` / `user.custom_tool_result` once and the server routes it to the right thread. Session `status` aggregates: one `running` thread makes the session `running`.

**Gating caveat (unreconciled, 2026-06-10).** The multi-agent page documents all of the above with no preview banner; the agent-setup page lists the equivalent field as `callable_agents` — "This is a research preview feature; request access to try it." Same feature mid-rename or two gating tiers — the docs do not say. Until they reconcile, treat multiagent orchestration as possibly request-access-gated (§11).

**The security dual.** Multi-agent trust escalation is a named forward risk (§5): a sub-agent that read poisoned content can launder it into "structured facts" the coordinator treats as higher-trust than raw tool output. The mitigation is the same rule KB-04 §4.7 carries inline: **sub-agent output is tool output** — it inherits the trust level of the worst content the sub-agent touched.

---

## 5. Containment & credential doctrine

From "How we contain Claude across products" (2026-05-25) + MA-specific pages. The cross-surface isolation-pattern table and incident postmortems live in `CLAUDE-SURFACE-ROUTING.md` §4a; this section is the MA-specific application plus the portable doctrine.

**The frame.** Risk = P(failure) × blast radius. Two control families: human-in-the-loop supervision — which telemetry shows is fallible (users approved **~93% of permission prompts**) — and **containment**: "supervise what it's *able* to do." Layered defense: environment (the hard boundary), model (probabilistic — one layer, "not a substitute" for a sandbox), and external content (an audited connector ≠ audited data; a passing GitHub connector can still deliver a poisoned README).

**The doctrine that survives any vendor:**

1. **Credentials never enter the sandbox.** "If credentials never enter the sandbox, they can't be exfiltrated." MA implements this three ways: vault `mcp_oauth`/bearer credentials resolved by Anthropic's proxy, never the container; `environment_variable` credentials as in-sandbox placeholders substituted by the egress proxy only on requests to allowed hosts ("The model never sees the secret"); auth bundled with the resource at sandbox init (the Git-remote pattern). Pick per credential type; never export a real secret into agent-reachable env.
2. **An allowlist is a capability grant.** "An allowlist … may be better conceptualized as a capability grant" — every function reachable through an allowed domain is attack surface (the disclosed exfiltration-through-`api.anthropic.com` incident is the type specimen; details in SURFACE-ROUTING §4a). For MA `limited` environments, audit `allowed_hosts` by *what can be done through them*, not by domain reputation.
3. **The environment is the defense that holds.** In Anthropic's internal red-team test, a direct-injection payload via a phished user exfiltrated `~/.aws/credentials` in **24 of 25 retries** past model-layer defenses — "the only defense that holds is the environment" (egress controls + filesystem boundaries). Design MA environments assuming the model *will* comply with a well-crafted injection.
4. **Match isolation strength to oversight capacity.** MA has no supervising human by default — so its environment controls must be *stronger* than an interactive surface's, not equal. If nobody will watch the `always_ask` stream, there should be nothing in the environment worth stealing.

**MA permission posture.** Agent-toolset permission policies default `always_allow`; **MCP toolsets default `always_ask`** — deliberately, so new server-side tools can't execute unapproved. Headless operators must either watch the stream for `requires_action` events or explicitly (and deliberately) relax per-toolset policy.

**Operator-side responsibilities (shared-responsibility split, self-hosted docs).** Anthropic owns control-plane integrity, multi-tenant isolation, and "agent-context minimization." The operator owns: image hardening; egress policy; `ANTHROPIC_ENVIRONMENT_KEY` custody (anomaly detection exists but **no instant revocation**); workspace/environment separation per trust boundary; in-container tool blast radius; data retention ("Anthropic has no visibility into what your worker does with session content once delivered"). **Never set `ANTHROPIC_API_KEY` on the worker host** — it exposes an org-scoped credential to agent tool calls.

**Memory hygiene under adversarial input.** Persistent memory is a persistence mechanism "in the classic post-exploitation sense": product memory, CLAUDE.md-class files, mounted workspaces, and the state directories of scheduled and long-running agents are all reloaded each start, so a poisoned write outlives the session that wrote it. MA's memory docs carry the warning natively (a poisoned write is "read … as trusted memory") and ship the mitigation: **`read_only` mounts for reference stores**, immutable versions + the redact endpoint as audit/recovery, and Dreams as *reviewed, never in-place* consolidation (output is a new store you adopt or discard). Research context (Dossier B): memory-injection attack classes are established (MINJA — query-only memory injection, NeurIPS 2025; Unit 42's Bedrock memory-poisoning PoC; OWASP ASI06), but no public exploit against MA/Dreaming specifically yet. Treat any `read_write` store fed by agent output as untrusted input to every later session. (A general memory-hygiene section is queued for KB-01 §3; until it lands, this paragraph is the kit's canonical treatment.)

**Multi-agent trust escalation.** §4's security dual: sub-agent output inherits the trust of the worst content the sub-agent touched. Named as a forward risk in the containment post; carried inline in KB-04 §4.7.

---

## 6. Self-hosted sandboxes + provider matrix

**The split [public beta].** Orchestration stays with Anthropic; tool execution moves to infrastructure you control — "the agent's code, filesystem, and network egress never leave your environment." A `self_hosted` environment is a **work queue**: your worker claims sessions, downloads skills, executes tools, posts results. Two worker shapes: always-on poller (`ant beta:worker` CLI or SDK) or webhook-triggered (spin up on `session.status_run_started`). Filesystem contract: `/workspace` (working dir; skills at `/workspace/skills/<name>/`) and `/mnt/session/outputs` (deliverables). Auth: `ANTHROPIC_ENVIRONMENT_KEY`, scoped to one environment's queue (on Claude Platform on AWS: IAM SigV4 via `AnthropicSelfHostedEnvironmentAccess`; the work *list* endpoint is unavailable there). Ops endpoints: `work.stats` (depth/pending/oldest_queued_at/workers_polling), `work.stop` (graceful or `force`). Worker platform notes: SDK workers hard-require `/bin/bash`; the TS worker needs `unzip`, `tar`, Node 22+. Memory stores do not yet work self-hosted. Useful CLI flags: `--workdir`, `--on-work` (delegate each item to a script), `--unrestricted-paths`, `--max-idle` (default 60s).

**Provider matrix** (first-party-published but vendor-supplied claims — treat adjectives as marketing):

| Provider | Distinguishing mechanics (as published) | Security-relevant posture |
|---|---|---|
| Cloudflare | microVMs + lighter isolates; reach internal services over Cloudflare's network | zero-trust secrets injection; customizable egress proxies to audit/reroute traffic |
| Daytona | long-running stateful "composable computers"; pause/restore full state; SSH/preview-URL into live sessions | state persistence is the feature *and* the retention surface |
| Modal | custom runtime, sub-second cold start on any image; scales to very large concurrency; CPU+GPU | shares Modal's function/storage/networking primitives |
| Vercel | VM-isolated, millisecond startup, VPC peering, BYO-cloud | **firewall injects credentials at the network boundary "so they never enter the sandbox"** — §5 doctrine, independently implemented |
| Generic worker | any platform: poll the Environments Work endpoints (poll/ack/heartbeat/stop/post/stats) | you implement the entire operator column of §5 yourself |

**Control split (all five):** operator controls image + runtime, resource sizing, egress, file/repo mounting, retention, worker lifecycle; Anthropic controls orchestration, the session log, work-queue integrity, multi-tenant isolation, model access, skill delivery.

---

## 7. Field evidence & economics (evidence-graded)

Grading per Dossier B: **[independent-firsthand]** > **[independent-analysis]** > **[vendor]** (first-party claims) > SEO-recycled (excluded here). Two months post-launch, the field record is thin; what exists is graded below. Notable *absence* of evidence is itself recorded — no practitioner has published an itemized MA bill; no public MA-specific postmortem exists; the documented sharp edges (vault friction, beta-header churn, session limits) have produced essentially no field complaints yet.

**The anchor datapoint [independent-firsthand].** The Wisedocs engineering writeup (document-verification pipeline, by their Head of ML) is the only strong independent production account — and MA *lost* on economics: their existing pipeline ran "7x faster than Managed Agents [at] roughly 1/10th the cost," so MA was relegated to an auditing third-line-of-defense role — where the combined human+AI system delivered "50% faster audits … and catch 30% more mistakes compared to the human baseline." Read: MA won on flexibility and agentic capability, lost on cost and latency. Weight this over every vendor case study; revise when a second independent writeup with itemized costs appears.

**The fit-list [independent-firsthand, narrowly].** The one hands-on practitioner fit-assessment that survives grading: great for dependency updates, migration codemods, test generation, documentation passes, lint/format fixes, bug triage-to-fix pipelines; not great for greenfield architecture, ambiguous product requirements, or security-sensitive changes needing human judgment. (The same post's production numbers are recycled keynote claims — only the fit-list is firsthand.)

**The lock-in critique [independent, named voices; the strongest objection].** (Dossier B grades the HN thread top-tier — independent, named; held one notch below the Wisedocs anchor here only because no commenter reports hands-on MA production use.) Named HN voices: mono-model risk ("being locked into a single model provider is a deal breaker"), reliability skepticism ("making customers reliant on Anthropic software is a big no-no"), and the substantive technical argument that best results come from *mixing* vendors per subtask — an Anthropic-only meta-harness must "beat every other AI company at all subtasks." The framework-churn variant: agentic frameworks are in a CGI-scripts-era phase where "locking in to a framework is a losing proposition." Counterweight pattern: keep orchestration abstracted (LangGraph/CrewAI-class, or your own thin layer) and treat MA as one execution target. The sharpest independent methodology caveat: "Choosing Managed Agents without the methodology discipline produces a hosted service running fragile work, with the hosting making the fragility harder to debug."

**Adoption headliners [vendor].** Notion, Rakuten, Sentry, Asana, Harvey, Netflix all trace to Anthropic launch/conference materials; Harvey's "6×" completion-rate figure is published without an external benchmark. Cite as vendor claims only.

**Cost mechanics [independent-analysis; the richest evidence class].**
- *Runtime fee is noise.* The $0.08/session-hour model (idle billed at zero) projects to ~$58/month for a 24/7 agent before tokens; the consensus verdict: "token efficiency is the variable that matters, and the infrastructure cost is noise." The skeptical arithmetic worth keeping: 24 agents × 8h/day = $15.36/day in session overhead before inference — "ask yourself if it's cheaper to just have an engineer handle it."
- *The 2026-06-15 credit split is the real boundary.* Programmatic usage (Agent SDK, `claude -p`, Claude Code GitHub Actions, third-party agents) moves off subscription limits onto a separate monthly credit ($20 Pro / $100 Max 5x / $200 Max 20x), billed at full API rates, no rollover. Independent framing: an "effective price increase: 12x–175x for heavy agentic workloads"; Zed's estimate that subscriptions "previously subsidised agent usage at roughly 15 to 30 times compared to API pricing." Operative advice: "stop optimizing for the subsidy and start optimizing for the token." Production CI/agents at scale belong on API keys with explicit budgets.
- *The runaway base rate.* No MA-specific postmortem exists, but the hosted-agent genre is vivid: $4,200 in 63 hours (a "keep trying until it works" retry loop); $47K in 11 days (two agents ping-ponging via A2A — "a green dashboard for eleven days … means nothing was wired to fail"); the half-billion-dollar outlier (unlimited licenses, no usage caps). The structural lesson, which transfers to every scheduled deployment: **monitoring is not enforcement** — alerts fire after spend; agentic cost compounds nonlinearly because context accumulates on every call. Wire enforcement in-process: hard step caps, USD budget gates, duplicate-input loop detectors, and MA-side `max_iterations` on outcomes.
- *Model-tier note [practitioner-eval, <48h old at compile time].* Early agent-context evidence suggests Fable 5's premium (2× Opus 4.8) is most defensible precisely in long-horizon, persistent-state agent work (the delta over Opus grows over time in one controlled eval) — but the independent cost verdict is that the premium "is hard to justify for most tasks," and the classifier fallback to Opus 4.8 makes cost unpredictable for security/bio-adjacent workloads. Since 2026-07-07 Fable 5 is usage-credits-only (no subscription inclusion), sharpening the "hard to justify for most tasks" verdict — route hosted-agent defaults to Opus/Sonnet tiers and escalate per task. Routing detail: `CLAUDE-SURFACE-ROUTING.md` §1a.

**Dreaming reception [independent-analysis].** Convergence is real and noticed ("operators of conversational assistants have converged on … explicit user-written stores and background aggregation"); commentary is skeptical of the anthropomorphic framing and the absence of external benchmarks; hands-on evidence is thin. Treat all recall/quality numbers (Anthropic's and OpenAI's) as vendor-stated internal evals.

---

## 8. Adopt / defer rubric

Work through in order; first ❌ defers.

1. **Compliance gate.** Workload requires ZDR or HIPAA BAA → ❌ **defer** (structurally ineligible, §1). No self-hosting exception is documented (§11).
2. **Beta tolerance gate.** Can the org absorb a beta header on every request, "behaviors may be refined between releases," terminal archives, and preview-gated sub-features (tunnels "as-is", Dreaming, possibly multiagent)? If the deliverable is a customer commitment with an SLA → ❌ defer or wrap with fallbacks you own.
3. **Fit gate.** Is the work on the verified fit-list (§7) — bounded, repeatable, reviewable transformations — rather than greenfield architecture, ambiguous requirements, or security-sensitive judgment? Off-list → ❌ keep it interactive (Code/Cowork) where a human steers.
4. **Economics gate.** Has a cost ceiling been computed at launch *and* 10× scale (8-gate #4), and is in-process enforcement (step caps, budget gates, loop detectors) wired? The independent benchmark says DIY pipelines can be 7× faster at 1/10th the cost for high-volume fixed workflows — MA earns its premium on flexibility, not throughput. No enforcement → ❌ do not schedule.
5. **Portability gate.** If model/vendor portability is a stated requirement, keep orchestration in an abstraction you own and use MA as one execution target — never as the foundation (§7 lock-in critique). All-in on MA primitives (vaults+threads+outcomes+memory as your only orchestration layer) is a §9 anti-pattern while the surface is beta.
6. **Oversight gate.** Who watches the `requires_action` stream, and what is the environment's blast radius if nobody does (§5 principle 4)? No answer → ❌ shrink the environment before scheduling anything.

Passing all six = adopt for that workload, reference-level: prototype, measure against the §7 anchors, and keep the §10 refresh triggers wired so GA (or a pricing/gating change) re-opens the call.

---

## 9. Anti-patterns

1. **Writing or building as if MA is GA.** Every endpoint is beta-gated; docs maturity ≠ GA (the kit's own v0.15.2 calibration catch). Track the header; expect refinement between releases.
2. **`ANTHROPIC_API_KEY` on a self-hosted worker host.** Exposes an org-scoped credential to agent tool calls; the worker needs only its environment-scoped key (§5, §6).
3. **Real secrets in agent-reachable env.** Use vault credential types or init-time bundled auth; the egress-proxy placeholder pattern exists so the model never sees the secret (§5).
4. **Relying on permission prompts as the safeguard.** ~93% approval is the published telemetry; design the environment as if every prompt gets approved (§5).
5. **Treating an approved connector/domain as approved data.** Allowlist = capability grant; a passing connector can still deliver poisoned content (§5; SURFACE-ROUTING §4a).
6. **`read_write` memory stores for reference corpora.** Reference stores mount `read_only`; any store agents write to is untrusted input to every later session (§5).
7. **Scheduling before wiring enforcement.** Monitoring alerts after spend; the postmortem base rate says loops + accumulation, not malice, produce the five-figure bills (§3, §7).
8. **Roster agents with the union of all tools.** MCP servers are agent-scoped by design — scope each roster agent to its role; don't hand the coordinator everything (§4).
9. **Treating sub-agent output as higher-trust than tool output.** Trust-escalation laundering is a named forward risk (§4, §5; KB-04 §4.7).
10. **Building the org's only orchestration layer on preview primitives.** Tunnels are provided "as-is" and "Anthropic may modify or discontinue MCP tunnels at any time"; Dreaming and (possibly) multiagent are request-access; the lock-in critique compounds the churn risk (§1, §7).
11. **Archiving as if reversible.** Archives are terminal/read-only; no unarchive is documented (§1; single-source caveat noted).
12. **Regulated workloads on MA.** Not ZDR/HIPAA-eligible, period — the same class of disqualifier as SURFACE-ROUTING anti-pattern #2 for Cowork (§1, §8).

---

## 10. Cross-references + refresh cadence

**Within the kit:**
- `CLAUDE-SURFACE-ROUTING.md` §3a (scheduled-work routing distillation — this KB's §3 is canonical), §4a (threat-model-per-surface — the cross-surface table; this KB's §5 is the MA column expanded), §1a (Fable/Mythos model-class routing).
- `KB-04-DECISION-ENGINEERING.md` §4.7 (async multi-agent orchestration mechanics — peer-hub, lead-spawn-monitor, scripted variant; this KB's §4 is the managed implementation).
- `KB-01-AI-WORKFLOW-ENGINEERING.md` §3 (memory engineering; a §3.7 memory-hygiene-under-adversarial-input extension is queued — until it lands, §5 here is canonical).
- `KB-02-AI-PROJECT-INFRASTRUCTURE.md` §4 (agent architecture; the fallback-chain primitive at §4.5).
- `MCP-SERVER-REGISTRY.md` (MCP tunnels posture entry + MA-consumes-remote-servers note: queued for monthly integration).
- `workflows/WORKFLOW-CLAUDE-CODE.md` (Routines subsection: queued for monthly integration).

**Refresh cadence.** Monthly pass with the vigilance loop. Off-cycle triggers: any MA primitive reaches GA or the `managed-agents-2026-04-01` header retires (re-grade every §1.1 row and tighten §8 from reference-level to recommendation-level); `callable_agents`/`multiagent` docs reconcile (§11); tunnels or Dreaming change gating; MA pricing model changes; the 2026-06-15 credit split takes effect (verify the §7 figures held); first independent MA postmortem or itemized bill publishes (re-anchor §7).

## 11. Uncertainty log

1. **Spill-to-file (>100K outputs).** Listed in early kit-side notes as an MA behavior; absent from every fetched page (reference + events accordions are client-rendered and stayed collapsed under direct fetch, 2026-06-10). The session-log architecture makes some offload mechanism *plausible* (a comparable framework offloads >20K-token tool responses to the filesystem with a path + 10-line preview) — but no Anthropic documentation states it. No body claim anywhere in this KB; resolve with a JS-rendering fetch of the reference page's event tables.
2. **`callable_agents` vs `multiagent` gating.** Live docs inconsistency (2026-06-10): request-access research preview on one page, unbannered full mechanics on another. Mid-rename or two tiers — unknown. §4 is written from the multi-agent page's mechanics with the gate flagged.
3. **ZDR/HIPAA under self-hosting.** The ineligibility statement is unqualified on the overview; whether self-hosted tool execution changes eligibility is not stated. §8 gate 1 assumes it does not until documented otherwise.
4. **`claude agents --json` `waitingFor` (v2.1.162).** Kit-vigilance-supplied; the public claude-code changelog reachable 2026-06-10 tops out at 2.1.110. Unverified; deliberately omitted from KB-04 §4.7. Belongs to the queued v2.1.16x cluster integration.
5. **Cowork scheduled-task internals.** The §3 column is kit-internal knowledge (SURFACE-ROUTING row 8 + containment-post VM profile), not re-verified against product docs this cycle.
6. **All MA cost figures are projections.** No practitioner has published an itemized MA bill; the $0.08/hr arithmetic and every §7 dollar figure inherit that caveat. Single-source flags also apply to: SSE no-replay deadlock and archive-permanence phrasing (Dossier B, citing docs pages this session could not render).
