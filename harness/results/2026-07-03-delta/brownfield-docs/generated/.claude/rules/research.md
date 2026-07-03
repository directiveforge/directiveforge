# Trailhead Collective — Research Methodology

3-layer architecture for research-backed decisions (e.g., a vendor choice before a governance lock). Each layer addresses a different epistemic concern; none replaces another.

## 3-LAYER ARCHITECTURE

| Layer | Stance | When | Output |
|---|---|---|---|
| **Layer 1** | Per-dossier input quality | Every research-prompt write-time | 8-gate-verified dossier |
| **Layer 2** | Cross-dossier analytical lenses | Synthesis time, BEFORE construction | 8 protocol outputs |
| **Layer 3** | Forward decision construction | Synthesis time, AFTER analysis | Ranked deliverable + a `governance/DECISIONS.md` lock skeleton |

Layer 2 (analytical) feeds Layer 3 (constructive). NEVER skip Layer 2 — straight-to-recommendation synthesis misses cross-dossier contradictions.

## LAYER 1 — 8-GATE INPUT FILTER

Every dossier passes all 8 gates before it feeds Layer 2 or any locked decision. Failed dossiers get re-dispatched with the gap named, NEVER patched in place.

1. **Source** — every claim cites a primary source. Section + line range for long sources.
2. **Version** — every cited vendor/tool/regulation includes version + effective date. Pre-2026 sources need "still current as of {date}".
3. **Stack fit** — implementable for a founder-run four-depot rental network with a seasonal crew and tight shoulder-season cash, not "in general".
4. **Cost-benefit** — every cost claim covers now AND at scale. Recurring costs surfaced (they are money decisions per the master plan).
5. **Implementation** — a concrete action a depot operator or the founder can take; abstract advice fails.
6. **Cross-reference** — every load-bearing claim corroborated by ≥2 sources OR flagged single-source.
7. **Existing knowledge** — checked against `governance/DECISIONS.md` + existing playbooks; if answered, point to the existing doc.
8. **Quote extraction** — definitional claims (contract terms, exact vendor capability) embed the verbatim quote.

## LAYER 1 DISCIPLINES THAT PROPAGATE (every output, every layer)

Severity tag (BLOCKER/HIGH/MEDIUM/LOW) · numeric confidence (0.0–1.0) · verbatim quote extraction · "what I don't know" appendix · freshness check (pre-2026 needs re-verify) · Context Envelope input · cost at both horizons · re-verification cadence · cross-DECISIONS reconciliation.

## LAYER 2 — 8 ANALYTICAL PROTOCOLS

Run across the Layer-1-verified corpus BEFORE Layer 3 construction. Independent, non-overlapping:

1. **Intake** — per-dossier core claim + severity + clustering.
2. **Contradiction Finder** — tiered table per cross-dossier mutually-exclusive claim.
3. **Citation Chain** — trace concept lineage; skip with a note if none. NEVER fabricate lineage.
4. **Gap Scanner** — ranked gaps the corpus does not answer.
5. **Methodology Audit** — neutral framing (NEVER "weakest" — say "highest-uncertainty").
6. **Master Synthesis (≤400w)** — Consensus / Debates / Strongest Evidence / Key Open Question.
7. **Assumption Catalogue** — unstated shared assumptions: risk if false × consequence.
8. **"So What" TL;DR** — 3 points: proven / unknown / why it matters.

## LAYER 3 — FORWARD CONSTRUCTION

Reads the Layer 1 corpus + Layer 2 outputs; produces a deliverable that (1) ranks options with twin-view when an assumption splits the answer (e.g., high vs low summer paddle volume), (2) runs sensitivity analysis, (3) builds a staged roadmap with trigger conditions, (4) pre-loads founder-elicitation questions, (5) drafts the next-phase architect-prompt skeleton, (6) records a re-verification schedule, (7) writes decidable reversal triggers, (8) reconciles against prior `governance/DECISIONS.md` entries. §1–§8 are the Layer 2 outputs verbatim; §9+ is net-new.

## UNIVERSAL BLOCKS A / B / C (mandatory per dossier)

- **Block A — Context Envelope:** founder-run, seasonal crew, tight shoulder-season cash, propose-only integrations, four named depots. 8–15 lines.
- **Block B — Common Pitfalls:** what operators get wrong here, 3–5 quantified, with corrective.
- **Block C — Freshness Log:** claim × effective-date × verification-date × status. The audit artifact.

## SKILL INVOCATION

- **Layer 1 (write-time)** — `Skill("research-prompt-writer")` (8-gate input filter).
- **Layer 2 + Layer 3 (synthesis-time)** — `Skill("research-synthesizer")` (8 protocols + Layer 3 construction).

## REFERENCES

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §3 — canonical 3-layer architecture
- `.claude/rules/orchestrator-dispatch.md` — sibling dispatch-mechanics rule
- `.claude/skills/research-prompt-writer/SKILL.md` — Layer 1 skill
- `.claude/skills/research-synthesizer/SKILL.md` — Layer 2 + Layer 3 skill
