# Decision ledger

> House format: one decision per section, `## D{N} — <title>`, appended in sequence,
> never rewritten. To reverse a decision, add a new decision that supersedes it and note
> the supersession here — do not edit the original. The next decision after D6 is D7.

---

## D1 — Four-depot network, not one flagship

**Date:** 2026-01-12
**Status:** accepted

We commit to a distributed four-depot model (Pinecrest, Ridgeway, Stonebrook, Larkfield)
rather than a single large flagship location. Rationale: gear travels to where the trail
demand is, and a distributed footprint halves customer drive time in the region, which is
the single biggest driver of repeat rentals. Cost: four times the staffing and inventory
coordination overhead, absorbed via seasonal crews and shared playbooks.

---

## D2 — Deposit holds sized to replacement cost, not flat fee

**Date:** 2026-02-03
**Status:** accepted

Every rental carries a deposit hold sized to the item's replacement cost, not a flat
per-rental fee. A flat fee under-covers high-value winter and climbing gear and over-charges
cheap paddle accessories. Replacement-cost holds keep the fleet whole. Implemented in
`docs/deposit-and-refund-policy.md`. This is the financial backbone of the recovery model.

---

## D3 — Seasonal crew model, no year-round floor staff beyond founder

**Date:** 2026-02-20
**Status:** accepted

Outside the founder, all depot staff are seasonal, hired for the summer and winter peaks
and released in the shoulder seasons. Rationale: two hard demand peaks with near-zero
shoulder-season walk-in traffic make year-round floor staff uneconomic. Consequence:
onboarding must be fast and playbook-driven every peak; the onboarding playbook is a
top-tier document.

---

## D4 — No external service credentials or integrations without founder bootstrap

**Date:** 2026-03-05
**Status:** accepted · **binding on all operators and assistants**

No external service credentials or integrations are added without a founder bootstrap.
Every integration is **PROPOSED** via `governance/INTEGRATIONS-REGISTRY.md` first, and is
never self-installed. This applies to humans and to any AI assistant working in this repo:
you may recommend a tool, you may draft its registry entry as a proposal, but you do not
wire it up, you do not store a key, and you do not sign the business up for anything. The
founder personally bootstraps every credential. This exists because a single leaked or
runaway integration bill can erase a shoulder-season's cash cushion.

---

## D5 — Payment processor switch to deposit-hold-native provider

**Date:** 2026-06-04
**Status:** accepted

We switch the card processor to one that supports native pre-authorization holds and
release, rather than charge-then-refund. Rationale: charge-then-refund on replacement-cost
deposits (per D2) was tying up customer funds for the full refund window and generating
disputes. Native holds release automatically on clean gear return. The deposit-and-refund
policy playbook must be reconciled to the new hold semantics (open item as of the switch).

---

## D6 — Stonebrook lease renewal authorization, ceiling $48,000/yr

**Date:** 2026-06-11
**Status:** accepted · **money gate**

The founder authorizes renewal of the Stonebrook depot lease for a further 24-month term
at a signed ceiling of **$48,000 per year** ($96,000 total over the term). Any renewal
term exceeding this annual ceiling is NOT authorized under this decision and requires a
new decision. Stonebrook carries the summer paddle line and its location is load-bearing
for summer revenue, which is why the renewal is pre-authorized rather than deferred — but
the ceiling is hard. No party may sign a lease above it without a superseding decision.

---

## D7 — Adopt the AI Workflow Engineering Kit at Intermediate tier (Claude Code only)

**Date:** 2026-07-03
**Status:** accepted

We adopt the AI Workflow Engineering Kit's Intermediate-tier workflow to keep this corpus
maintainable by AI assistants without loosening the governance discipline. Rationale: the
repo carries real money-gated decisions (D6's signed $48,000/yr ceiling) and a binding
credential-governance lock (D4), so a solo-founder-run docs repo still needs defensible,
auditable maintenance — which is the Intermediate bar, not Starter. Scope is Claude Code
only (no Cursor). What this installs: `.claude/` rules (base, quality-gates as doc-lint
gates, decision-skills router, research + orchestrator-dispatch), the mandatory
review/simplify/verify agent trio adapted to a docs corpus, slash commands remapped to
grounding/rot/context checks, the five BLOCKER + three HIGH decision skills, the two
research skills, and an architect-prompt template. What it does NOT change: the source of
truth (`OPS-MASTER-PLAN.md`), the append-only D-ledger format, the propose-only integration
protocol (D4), and the founder's reserved credential/spend authority. No external service,
credential, or recurring bill is introduced — the kit is local Markdown scaffolding only.

**Reversal triggers.** (1) The AI-workflow scaffolding starts contradicting the house
conventions (a generated rule tells an operator to do something CLAUDE.md forbids) → strip
the offending asset and re-verify against `OPS-MASTER-PLAN.md`. (2) The maintenance overhead
of `.claude/` exceeds its value for a repo this size → downgrade to Starter tier (drop the
research/orchestrator assets, keep the five BLOCKER decision skills + doc-lint gates).

**Re-verify.** Quarterly: re-run the doc-lint gates and confirm `.claude/` rules still match
the corpus. Event-triggered: on any new AI Workflow Kit release, review the upgrade path via
`generator/UPGRADE_MODE.md` (a `.ai-kit-manifest.json` records the install for diffing).

**Cross-references.** Preserves D4 (propose-only integrations — the kit proposes MCP servers,
never wires them). Preserves the CLAUDE.md house rule against a second ledger (this entry is
appended here, not forked to a root `DECISIONS.md`).
