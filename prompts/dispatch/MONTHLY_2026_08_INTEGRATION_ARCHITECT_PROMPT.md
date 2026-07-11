# ARCHITECT PROMPT — Monthly Integration 2026-08 (the spine, banked 2026-07-11)

> **Execute 2026-08-01 ± 2 days.** ONE Claude Code session at `~/Projects/AI`. **Sonnet 5 main**
> (per the kit's own refreshed §1a routing: bulk integration = cost-rational tier; note the irony
> and enjoy it), **Opus 4.8** fresh-context verifier at W6. Plan mode W0. Budgets: ≤20 subagent
> invocations, ≤5M subagent tokens; count calls, batch, checkpoint (KB-04 §4.9 applies).
> **Authored 2026-07-11 by Fable** on the last subscription-included Fable day — this file is the
> PRIORITY SPINE. Three weeklies (2026-28/29/30) and the 8/01 manifest will land between now and
> execution: W0 reconciles them against this spine; the spine's priorities yield only to 🚨 items.

## W0 — Reconcile (do not skip; the spine is 3 weeks old by run time)

Read: `vigilance/feed/monthly/2026-08.md` (if the routine produced it) + weeklies 2026-28..31 +
`vigilance/feed/daily/2026-07-11-supplemental.md` + `launch/LAUNCH-DAY-RUNBOOK.md` §H-sheet (the
graded H1–H8) + open GitHub friction issues + `feedback/2026-07-10-pre-hn-hardening.md` (PH-8/PH-9
upstream rows). Produce the final cut list: this spine's P1–P6, each marked
`unchanged / extended-by-<source> / superseded-by-<source>`, plus any NEW 🚨-tier candidate.
H-grade rule: if H4 confirmed (install/invocation friction ≥40%), UX-prompt items may be promoted
INTO this session's scope; if H1 confirmed hard (ceremony pushback), bias every edit below toward
subtraction over addition. Commit the reconciled plan (W0-commits-at-W0).

## P1 — Sonnet 5 routing rewrite, the REMAINING half (weekly-27 #1; partly pre-done 2026-07-10)

Already shipped pre-HN (do NOT redo): CLAUDE-SURFACE-ROUTING §1/§1a/§1b/§2/§9, KB-02 §4.8, KB-04
§4.1, KB-06 model-tier note, WCC price rows. Remaining, in priority order:
1. **KB-01 §context: the load-bearing "1M-native vs `[1m]`-variant" refactor** — the kit still
   teaches `[1m]` as *the* 1M primitive; Sonnet 5 (and Fable 5) are native-1M. Rewrite the concept:
   variant-1M (opt-in model ID) vs native-1M (property of the model), routing implications of each.
2. **Templates identity blocks**: `templates/claude-code/CLAUDE.md.template` +
   `templates/shared/ARCHITECT_PROMPT.md.template` still name `claude-opus-4-7[1m]`/`4-8` as
   routing targets — refresh to class+chain form (never single IDs — §1b), with Sonnet 5 as the
   named cost-rational default and Fable as adjudication-tier.
3. **KB-04 §5**: promo-pricing-as-routing-input pattern — and since the $2/$10 promo sunsets
   **2026-08-31**, write the sunset as a vigilance off-cycle trigger + a dated re-verify line, so
   September's kit doesn't quote July's prices (the exact failure class we fixed pre-HN).
4. **NEW caveat (supplemental 2026-07-11 ⚠): agentic tool-call regression.** Opus 4.8 + Sonnet 5
   emit malformed calls against CUSTOM tool schemas (invented fields; worse than older models;
   Willison 07-04 + HN + v2.1.201 harness patch). Add to KB-01 §tool-use + KB-04 §dispatch: prefer
   platform-baked tools; when shipping custom tools, add schema-validation-with-retry; watch
   whether post-v2.1.201 harness fixes close it (check at W0 — may be `superseded`).
5. `templates/skills/decision/*`: audit for hardcoded Opus-tier routing hints (weekly-27 cut e).

## P2 — Claude Code v2.1.16x→v2.1.20x+ cluster (7th+ consecutive week; extend, don't reopen)

Extend the dispatched July Architect Prompt #2 with the post-27 accumulation. Load-bearing cuts:
**AskUserQuestion no-auto-continue + permission-mode `default`→`Manual`** (v2.1.200) →
`templates/claude-code/rules/orchestrator-dispatch.md.template` idiom; **stacked slash-skills
(≤5)** (v2.1.199) → new authoring rule for `templates/skills/` (skills must be composable,
single-purpose, no shared-state assumptions); **subagent-partial-work-return + hook stderr
surfacing** → KB-04 §subagent-orchestration anchors; **`anthropicAws` gateway + model-not-found
failover advancement** (v2.1.198) → MCP-SERVER-REGISTRY §provider-fallback + KB-04 §dispatch;
**org-level default models** (v2.1.196) → KB-02 fleet note; **workflow-size config + workflow OTel
attrs** (v2.1.202) → settings template spot-note + AGENTS.md §Observability; **auto-mode
transcript-tampering block + `rm -rf`-unresolved-variable guardrail + no-human-input notification
note** (v2.1.205) → KB-06 §hosted-agent-safety two-bullet cluster + CLAUDE.md.template
background-notification note; `/doctor`→`/checkup` + reserved "Claude Browser/Preview" MCP names →
surface-routing spot-lines. W0 extends this list from weeklies 28–31 (the cluster will not have
paused).

## P3 — KB-06 Managed Agents primitives expansion (weekly-27 #3, first re-entry-after-resolution)

KB-06 §primitives: rows for SDK v0.115.0's five (event_deltas · agent_with_overrides · reverse
pagination · vault-credential scoping · lifecycle webhooks) + v0.116.0 `agent-memory-2026-07-22`
beta header; cite `roadtrip_planner` as the canonical reference impl beside each; add the
benchmark-reproduction pattern (Cookbook `evals/`, DeepSearchQA/BrowseComp reproducers) to KB-04
or KB-01 §evals. **Containment-doctrine anchors** (from the Fable-redeploy governance cluster):
cross-vendor 4-dimension jailbreak-severity framework · Anthropic's acknowledged over-blocking
cost · 24h-monitoring/immediate-mitigation pattern. **Cross-vendor validation paragraph**: GPT-5.6
multi-agent orchestration + ChatGPT Work scheduled/triggered tasks + Grok Voice Agent Builder
(supplemental 07-11) — the MA bet is now table stakes across vendors; KB-06 §economics cites it.
Pins in `templates/shared/ai-kit-manifest.json` guidance: `anthropic>=0.116.0` (memory-beta
consumers), `pydantic-ai>=2.7.0`, `crewai>=1.15.2` — W0 re-verifies all three against August
latest before writing.

## P4 — Model-state residuals + small slots

KB-01 framework-comparison table is version-stale (GPT-5.4/Gemini 3.1 → verify current: GPT-5.6,
Gemini 3.5?, Grok 4.5) — refresh WITH dates, per the freshness discipline. KB-02 §4.8: add
post-restore Fable / Sonnet-5 SWE-bench rows IF published (W0 check; else keep the dated absence
note). Clean suspension-era framing from `prompts/dispatch/KB06_*` (queued since weekly-27 #4).
Pydantic AI evaluator/security small-edit slot (weekly-27 #5): KB-01 evaluator-pattern subsection
(GEval + span-based) + `sanitize_messages` as KB-06 inbound-containment primitive. MCP registry
min-safe-version table if July's slot didn't land it (W0 checks).

## P5 — Vigilance process hardening (the launch week's own lessons)

1. **URL fetch-verify-before-record** becomes a written rule in `workflows/KIT-VIGILANCE.md` +
   the daily dispatch prompt: Tier-2 WebSearch items must fetch-verify cited URLs before the
   digest records them (the `redeploying-fable-5` dead-link propagated into shipped doctrine and
   was caught only by a commit-#2 executor — file the incident as the rule's motivating example).
2. **Supplemental Saturday cadence**: the 3-week lapse (06-20→07-11) made three weeklies
   GitHub-only. Add the supplemental to the operator's weekly rhythm doc; evaluate a scheduled
   Cowork task as the trigger (KB-06 §scheduled-work routing decides the surface).
3. Record Tier-2-as-steady-state + the `raw_atom_snapshot` idea as INPUTS to the 2026-10-01
   quarterly audit (do not implement now — cadence discipline).

## W6 — Verify + W7 wrap

Fresh-context Opus verifier: (a) every price/date/version claim written this session re-verified
against live sources (the W0.3 pattern from the pre-HN dispatch); (b) grep for leftover stale
identifiers (`claude-opus-4-7[1m]` as routing target, GPT-5.4-as-current, "suspended" present
tense); (c) VALIDATION_CHECKLIST ↔ static-checks sync if any gate/template changed; (d) confirm
no edit re-introduced an unmeasured multiplier (the truth-debt grep from DISPATCH-A W1.7). Wrap:
CHANGELOG minor entry (this is a x.Y.0-class release ONLY if generator/templates changed enough to
warrant it — adjudicate at W7 and re-run the harness release gate if so), dispositions file with
zero silent drops, HANDOFF refresh, memory-worthy state changes listed for the operator.

## Acceptance

- [ ] W0 reconciliation table committed first; every P-item marked vs the fresher corpus
- [ ] No routing text names a single model ID without a class+chain (§1b lock)
- [ ] 2026-08-31 promo sunset exists as a dated trigger, not prose
- [ ] All pins/prices/versions re-verified at run time, not copied from this spine
- [ ] Truth-debt grep clean; suspension-tense grep clean; checklist sync intact
- [ ] Budgets reported; dispositions complete; release-gate adjudication recorded
