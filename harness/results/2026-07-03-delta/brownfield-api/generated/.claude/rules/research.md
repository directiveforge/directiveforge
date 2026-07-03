# SlotHarbor — Research Methodology

3-layer architecture for research-backed decisions. Each layer addresses a different epistemic concern; none replaces another.

## 3-LAYER ARCHITECTURE

| Layer | Stance | When | Output |
|---|---|---|---|
| **Layer 1** | Per-dossier input quality | Every research-prompt write-time | 8-gate-verified dossier |
| **Layer 2** | Cross-dossier analytical lenses | Synthesis time, BEFORE construction | 8 protocol outputs |
| **Layer 3** | Forward decision construction | Synthesis time, AFTER analysis | Ranked-matrix-and-roadmap deliverable + DECISIONS lock |

Layer 2 (analytical / post-hoc) feeds Layer 3 (constructive / forward). NEVER skip Layer 2 — straight-to-recommendation synthesis misses cross-dossier contradictions that surface downstream.

## LAYER 1 — 8-GATE INPUT FILTER

Every dossier passes all 8 gates before it feeds Layer 2 or any locked DECISIONS entry. Failed dossiers get re-dispatched with the gap named, NEVER patched in place.

1. **Source** — every claim cites a primary source; vendor docs, official release notes, government registries, peer-reviewed papers. Section + line range for long sources.
2. **Version** — every cited library/SaaS/framework/regulation includes version + effective date. Pre-2026 sources require explicit "still current as of {date}" re-verification.
3. **Stack fit** — every recommendation is implementable in SlotHarbor's actual stack (FastAPI 0.115 + SQLAlchemy 2.0 sync + Alembic + Postgres/SQLite), not "in general".
4. **Cost-benefit** — every cost claim covers launch AND 10× scale. Hidden costs (audit, compliance, monitoring) surfaced explicitly.
5. **Implementation** — every technique is implementable as a concrete artifact (skill, rule, snippet, prompt). Abstract advice fails.
6. **Cross-reference** — every load-bearing claim corroborated by ≥2 sources OR flagged as single-source-uncorroborated.
7. **Existing knowledge** — every claim checked against existing project docs (`CLAUDE.md`, `DECISIONS.md`). If answered, point to the existing doc; don't re-derive.
8. **Quote extraction** — load-bearing definitional claims embed verbatim source wording with citation. Paraphrase of definitions fails.

## LAYER 1 DISCIPLINES THAT PROPAGATE (every output, every layer)

1. **Severity tag** per finding — BLOCKER / HIGH / MEDIUM / LOW.
2. **Numeric confidence** per claim — 0.0–1.0 scale. No prose hedges without a numeric anchor.
3. **Verbatim quote extraction** — every load-bearing definitional claim embeds source wording.
4. **"What I don't know" appendix** — every output ends with explicit unknowns + next-step-to-resolve.
5. **Freshness check** — pre-2026 claims without re-verification rejected.
6. **Stack-fit gate** — Universal Block A (context envelope) embedded as mandatory input; generic recommendations rejected.
7. **TCO at launch + 10× scale** — every cost claim spans both horizons.
8. **Re-verification cadence** per finding — quarterly / semiannual / annual / event-triggered.
9. **Cross-DECISIONS reconciliation** — every output enumerates which prior locked entries it interacts with.

## LAYER 2 — 8 ANALYTICAL PROTOCOLS

Run across the Layer-1-verified corpus BEFORE Layer 3 construction. Each protocol surfaces a specific cross-dossier signal. Independent; non-overlapping.

1. **Intake** — structured baseline: per-dossier core claim (≤20 words), severity, cluster grouping, preview-flag contradictions for Protocol 2.
2. **Contradiction Finder** — tiered table per cross-dossier mutually-exclusive claim: Position A/B + root-cause type + mechanism + resolution owner + confidence + severity.
3. **Citation Chain** — trace intellectual lineage (Origin → Challenger → Refiner → Current Status). Skip with explicit note when no lineage exists. NEVER fabricate lineage.
4. **Gap Scanner** — ranked gaps the corpus does NOT answer: closest prior work, path-to-resolution, severity, cost-of-inaction.
5. **Methodology Audit** — neutral framing of methodological diversity; highest-uncertainty methodology (NEVER "weakest").
6. **Master Synthesis (≤400w)** — 4 sections: Established Consensus / Active Debates / Strongest Evidence / Key Open Question.
7. **Assumption Catalogue** — foundational unstated assumptions: risk if false × consequence tier × monitoring approach.
8. **"So What" TL;DR** — 3 numbered points for smart non-expert: what's proven / what's unknown / why it matters.

## LAYER 3 — FORWARD CONSTRUCTION

Reads the Layer 1 corpus + Layer 2 outputs; produces a deliverable that (1) ranks options with twin-view when an assumption splits the answer, (2) runs sensitivity analysis, (3) builds a staged roadmap with trigger conditions per stage, (4) pre-loads Phase 3 elicitation (Q1–Q4), (5) drafts the next-phase architect prompt skeleton, (6) records a re-verification schedule, (7) writes decidable reversal triggers per stage, (8) reconciles against prior DECISIONS entries. §1–§8 are the Layer 2 outputs verbatim; §9+ are net-new. Typical length 600–1,500 lines.

## UNIVERSAL BLOCKS A / B / C (mandatory per dossier)

- **Block A — Context Envelope:** project's binding constraints (internal logistics service, sync stack, no test tooling, container deploy). 8–15 lines.
- **Block B — Common Pitfalls:** "what do smart operators get wrong here?" 3–5 quantified examples with primary-source evidence + corrective.
- **Block C — Freshness Log:** aggregated citation table — claim × effective-date × verification-date × status.

## SKILL INVOCATION

- **Layer 1 (per-dossier write-time)** — invoke `Skill("research-prompt-writer")`.
- **Layer 2 + Layer 3 (synthesis-time)** — invoke `Skill("research-synthesizer")`.

## REFERENCES

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §3 — canonical 3-layer architecture
- `.claude/rules/orchestrator-dispatch.md` — sibling dispatch-mechanics rule
- `.claude/skills/research-prompt-writer/SKILL.md` — Layer 1 invocable skill
- `.claude/skills/research-synthesizer/SKILL.md` — Layer 2 + Layer 3 invocable skill
