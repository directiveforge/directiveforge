# Dispatch — KB-06 Field-Evidence Research (Dossier B: practitioner experience)

> **⚠ POST-RUN ANNOTATION (2026-06-10, v0.16.0):** this dispatch RAN; output landed at `research/2026-06-10-managed-agents-chat-sources.md` (NOT the `-field-evidence` filename below). Two context claims in the prompt body were subsequently falsified/unverified by the dossiers — do not treat as facts if re-running: "dynamic workflows default-ON for Enterprise 2026-06-08" (this dossier's caveat called it falsified, but operator re-check 2026-06-10 RECONCILED it as CORRECT: blog = OFF at launch, support article 13930452 = auto-ON for whole org from 2026-06-08; the dossier read only the blog) and "spill-to-file >100K outputs" as a documented MA behavior (not found in any first-party doc — Dossier A §I.1). Prompt body kept verbatim as provenance.

> **Primary surface:** claude.ai **Chat + Research mode** (the only surface with agentic multi-search + inline citation renderer — this dossier is open-web breadth, Research mode's killer feature).
> **How to run:** paste the prompt below into a fresh Chat with Research mode on. When the report finishes, save it verbatim to `research/YYYY-MM-DD-managed-agents-field-evidence.md` (date of run).
> **Companion:** Dossier A (`KB06_PRIMARY_SOURCE_RESEARCH.md`) covers first-party docs in a Cowork session. This dossier deliberately does NOT re-explain official capabilities — only what the field says about them.
> **Consumer:** the KB-06 architect prompt (monthly integration 2026-07-01) reads both dossiers.

---

## Prompt (copy everything below into Chat + Research mode)

Research the real-world practitioner experience with **Claude Managed Agents** (Anthropic's hosted agent platform, public beta since 2026-04-08) and hosted/managed AI-agent platforms generally, April 8 2026 → today. I need field evidence, not vendor marketing — I already have the official docs covered separately.

Questions, in priority order:

1. **Adoption reports.** Who is publicly using Claude Managed Agents (or migrating to/from it), for what workloads, with what outcomes? Case writeups, conference talks, engineering blogs.
2. **Pain points.** What do early adopters complain about — cost surprises, sandbox setup friction, vault/credential handling, beta-header churn, session limits, debugging/observability gaps, the >100K-token spill-to-file behavior?
3. **Critiques and comparisons.** Managed Agents vs running your own harness on the Agent SDK; vs OpenAI's workspace agents / comparable hosted offerings; vs LangGraph/CrewAI-style frameworks. How is "decoupling the brain from the hands" (Anthropic's framing) received — praised, disputed, ignored?
4. **Memory primitives reception.** Practitioner commentary on "Dreaming" (between-session memory curation) and "Outcomes" — and on OpenAI shipping its own "Dreaming" for ChatGPT memory (~2026-06-04). Is cross-vendor convergence on this primitive being discussed?
5. **Security and ops commentary.** Reception of Anthropic's containment doctrine ("How we contain Claude across products"); reactions to Claude Code dynamic workflows defaulting ON for Enterprise orgs (2026-06-08) — especially token-cost and governance concerns; prompt-injection / memory-poisoning discussion specific to long-running hosted agents.
6. **Cost experiences.** Scheduled-deployment billing in practice; effects of the 2026-06-15 Agent SDK / GitHub Actions credit split; Fable 5 pricing (2× Opus) reactions specifically in agent/automation contexts.
7. **Failure stories.** Public postmortems or detailed accounts of managed/hosted agents going wrong (cost runaways, wrong actions, trust-boundary violations).

Output requirements:
- Group by theme, not by source. Every claim cited inline with a working link and an explicit date.
- **Separate clearly:** first-party vendor claims vs independently verifiable practitioner experience vs single anonymous anecdotes. Grade source quality.
- Quote 3–6 of the sharpest practitioner verbatims (with attribution) — exact wording matters for my downstream use.
- End with: (a) "What I could NOT find" — questions above with no real field evidence yet (this is expected for a 2-month-old beta and is itself a finding); (b) a 10-line executive summary ranking the themes by evidence strength.
- Length: ≤2,500 words excluding citations. Evidence density over completeness — skip themes with nothing real rather than padding.
