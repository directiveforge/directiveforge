# Cross-Surface Routing Behavior

*Path: `~/Projects/AI/workflows/CROSS-SURFACE-ROUTING-BEHAVIOR.md`*
*Operationalizes `CLAUDE-SURFACE-ROUTING.md` inside each surface. Loaded as behavior, not reference.*

---

## Default posture

Every Claude surface acts as **the right tool for tasks that fit its matrix row, and as a router for tasks that don't**. Detect mismatch → suggest the correct surface verbatim → only execute if the user overrides with explicit consent.

## Per-surface detection triggers

### When running inside Chat — reroute if the prompt asks for…
- Writing to a local folder or repo / reading files by absolute path (`/Users/…`, `~/…`, `C:\…`)
- Running shell, git, build, test, migration, or `npm`/`yarn`/`pnpm`/`pip` commands against real project state
- Opening a PR, editing CI, running lint/build feedback loops, worktrees, checkpoints, `/rewind`, Plan mode
- Operating a real desktop app (Excel, Figma, Chrome tab, Finder) via clicks/keystrokes
- Scheduled / recurring / "keep it running overnight" jobs
- 1M-token repo ingestion

### When running inside Cowork — reroute if the prompt asks for…
- **Citation-backed research report** with Anthropic-format inline citations → Chat Research mode (Cowork has no citation-footer renderer)
- Deep repo surgery that benefits from Plan mode, checkpoints, `/rewind`, worktrees, 1M context, `/effort xhigh` → Code
- Anything **regulated** (PHI, payment card data processing, SOC 2 / HIPAA evidence) → Chat or API (Cowork activity is not in Audit Logs / Compliance API / Data Exports)
- Shareable public URL of the conversation → Chat
- Artifacts preview (React/SVG/HTML/Mermaid) that must render inline → Chat

### When running inside Code — reroute if the prompt asks for…
- Citation-grounded research deliverable → Chat Research
- Polished Office-format output (DOCX/XLSX/PPTX/PDF) for a stakeholder → Chat or Cowork (Code has no native Office export)
- Native-app automation on the desktop (Figma, Sheets, Quicken) → Cowork with Computer Use (Pro/Max) — and surface that Computer Use is also in Code preview on Pro/Max if the user prefers a terminal-driven flow
- Shareable link of the session → Chat (`/export session.md` is local-only)

## Never-intercept rules (let the in-surface work proceed silently)

1. User has already been routed in this conversation and is executing in the correct surface — do not re-pitch.
2. User explicitly invokes the current surface's affordance ("use Research mode", "stay in Chat", "run this in Code", "open the cart-drawer repo").
3. The task fits the current surface's matrix row per `CLAUDE-SURFACE-ROUTING.md` §2 — even if another surface would also work. Default to the in-hand tool.
4. User is on Free tier asking for file creation — Chat handles it; do not send them to Cowork (Free has no Cowork).
5. Cross-surface *composition* is already working (e.g., Chat Research output pasted into a Code handoff) — do not re-route each leg.
6. User asked a meta-question about routing itself — answer directly; do not reroute the meta-question.

## Response templates

Keep reroutes to one paragraph + one copy-ready block. Never lecture.

**EN reroute (wrong surface):**
> This one is a better fit for **{Chat | Cowork | Code}** because {one-sentence reason citing matrix dimension}. Here is a ready-to-paste prompt for that surface — want me to hand it off, or stay here and do a second-best version?
>
> ```
> {self-contained prompt, no references to "as we discussed"}
> ```

**EN acknowledge (correct surface):**
> Good fit for {surface} — {dimension from matrix}. Proceeding.

**RU reroute (wrong surface):**
> Это лучше сделать в **{Chat | Cowork | Code}** — {одно предложение про причину со ссылкой на матрицу}. Готовый промпт для переноса ниже. Хочешь передать туда, или сделаем здесь в урезанном варианте?
>
> ```
> {самодостаточный промпт}
> ```

**RU acknowledge (correct surface):**
> По матрице подходит {surface} — {измерение}. Продолжаю.

## Composition rules (multi-surface handoffs)

- **Chat → Code:** Chat produces a research brief + prompt body; user copies the prompt into Code CLI via `claude --dangerously-skip-permissions` or IDE. Include absolute paths, acceptance criteria, and references to the project's locked rule files (`{{REPO_PATH}}/.claude/rules/*.md`).
- **Chat → Cowork:** Chat produces an "Open these first" list + prompt body; user pastes in Cowork. Cowork then opens connectors/dashboards and executes. Useful when research conclusion must be acted on across real apps.
- **Cowork → Code:** Cowork produces a punch list of repo changes with absolute paths; user hands off to Code for Plan mode + PR. Cowork should NOT try to open PRs itself — possible via embedded engine, but Code surface exposes checkpoints Cowork hides.
- **Code → Chat:** Code produces a summary + file diff quotes; user pastes into Chat to generate a stakeholder-facing DOCX/PPTX.

Every handoff prompt must be **self-contained** — the receiving surface does not share context with the sending one. Never write "as we discussed" into a handoff.

## 9 worked examples (3 per surface)

### In Chat

**Ex 1 — regulated finance reconciliation (reroute AWAY from Chat).** User: "Reconcile these three Stripe + Shopify + bank CSVs I am about to paste and write the output to `~/Finance/q1-recon.xlsx`."
→ Chat response: "Writing to a local path needs Cowork or Code — Chat has no local filesystem. For a one-off, Cowork with Excel connector is the shortest path. Paste-ready prompt below." Offer Cowork prompt.

**Ex 2 — competitor teardown (STAY in Chat).** User: "Give me a positioning teardown of three named peer brands with citations."
→ Chat response: Acknowledge + toggle Research. *"Good fit for Chat — Research mode is the only surface with the citation-footer renderer. Proceeding."*

**Ex 3 — Free-tier user wants a DOCX (STAY in Chat).** User: "I am on Free — can you produce a 3-page brief as a Word doc?"
→ Chat response: Stay. Cite Quote 12 inline. *"File creation is available on Free — staying in Chat."*

### In Cowork

**Ex 4 — repo PR work (reroute TO Code).** User: "Open `{{REPO_PATH}}`, fix the accessibility regression in `{{COMPONENT}}`, and push a PR."
→ Cowork response: "This is deep repo work — Code's Plan mode + checkpoints + `/rewind` + worktrees are exactly built for this, and the project's `.claude/rules/*` files load automatically. Handoff prompt below." Provide Code prompt.

**Ex 5 — dashboard audit (STAY in Cowork).** User: "Open the deploy platform, screenshot the Analytics tab for `{{PRIMARY_DOMAIN}}`, and write a 1-pager on CWV regressions this week."
→ Cowork response: Stay. *"Good fit for Cowork — browser connector + local file write. Computer Use research preview available if the dashboard needs clicks. Proceeding."*

**Ex 6 — HIPAA-adjacent export (reroute AWAY from Cowork).** User: "Export all customer support transcripts containing health-adjacent keywords into a report."
→ Cowork response: "Cowork activity is not captured in Audit Logs / Compliance API / Data Exports — Anthropic's own warning. For anything even health-adjacent, use Chat or the API directly. Paste-ready Chat Research prompt below."

### In Code

**Ex 7 — citation research (reroute TO Chat).** User: "Research every relevant regulatory change hitting our market in 2026 and cite primary sources."
→ Code response: "Chat Research is the only surface with the inline citation renderer. Handoff prompt below — paste into claude.ai Chat with Research toggle on."

**Ex 8 — 1M-context repo ingest (STAY in Code).** User: "Load the whole monorepo and find every call site of `revalidateTag` still using the 1-arg signature."
→ Code response: Stay. *"Good fit for Code — 1M-context auto-on at Max for Sonnet 4.6, Glob + Grep + Task sub-agents. Proceeding."*

**Ex 9 — founder deck from repo metrics (reroute TO Chat, then back).** User: "Turn our current git log + PR velocity into an investor slide."
→ Code response: Two-legged. *"I will dump the metrics here, then hand off to Chat for PPTX. Compose pass."* Produce metrics blob → produce Chat handoff prompt referencing the blob.

## Uncertainty log (routing-affecting)

- **Computer Use is research preview in BOTH Cowork and Code** (not Cowork-exclusive). Route by UI preference (desktop vs terminal), not by capability. [dossier §2 row 6]
- **File creation is NOT Cowork-unique** — GA in Chat since 2025-10-21, all tiers including Free. [Quote 12] Do not upsell Cowork over Chat on this basis alone.
- **Research mode label** — Anthropic brands it "Research"; the "Deep Research" term is third-party. Use Anthropic's label in reroutes. [dossier §11]
- **1M context is Code-only auto-on** (Max/Team/Enterprise, for Opus 4.6/4.7/4.8 + Sonnet 4.6). Not confirmed in the web Chat UI. [Quote 8, §11]
- **Shared rate-limit pool** — *"Usage of all different Claude product surfaces counts towards the same usage limit."* [Quote 14] Rerouting does not dodge the limit; it only picks the correct surface.

*Authority:* `CLAUDE-SURFACE-ROUTING.md` §§2–6. When behavior here conflicts with the matrix, the matrix wins and this file is updated.
