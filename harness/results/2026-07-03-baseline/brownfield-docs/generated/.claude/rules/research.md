# Trailhead Collective — Research Methodology

3-layer architecture for research-backed strategic decisions (supplier selection, lease terms, depot expansion, processor changes). Each layer addresses a different epistemic concern; none replaces another. Canonical doctrine: `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §3.

## 3-LAYER ARCHITECTURE

| Layer | Stance | When | Output |
|---|---|---|---|
| **Layer 1** | Per-dossier input quality | Research-prompt write time | 8-gate-verified dossier |
| **Layer 2** | Cross-dossier analytical lenses | Synthesis time, BEFORE construction | 8 protocol outputs |
| **Layer 3** | Forward decision construction | Synthesis time, AFTER analysis | Ranked deliverable + `D{N}` ledger lock |

Layer 2 feeds Layer 3. NEVER skip Layer 2 — straight-to-recommendation synthesis misses cross-dossier contradictions that surface downstream.

## LAYER 1 — 8-GATE INPUT FILTER

Every dossier passes all 8 gates before it feeds synthesis or a locked `D{N}`. Failed dossiers get re-dispatched with the gap named, never patched in place.

1. **Source** — every claim cites a primary source (vendor terms, official docs, government registries, published data). Section/line range for long sources.
2. **Version** — every cited vendor/SaaS/regulation/supplier term includes version + effective date. Pre-2026 sources need explicit "still current as of {date}".
3. **Fit** — every recommendation is implementable as a docs/governance change here and fits operating reality: four depots, seasonal crews, shoulder-season cash tightness, D4 propose-only credentials.
4. **Cost-benefit** — every cost claim covers launch AND scale; recurring bills flagged as money-gate decisions, never casual.
5. **Implementation** — every recommendation lands as a concrete artifact: a new playbook, a registry proposal, or a `D{N}` entry.
6. **Cross-reference** — every load-bearing claim corroborated by ≥2 sources OR flagged single-source.
7. **Existing knowledge** — checked against `governance/DECISIONS.md`, existing playbooks, and archived reports (`docs/archive/`) before re-deriving.
8. **Quote extraction** — load-bearing definitional claims (a supplier's exact warranty terms, a processor's exact hold semantics) embed the verbatim wording with citation.

## PROPAGATING DISCIPLINES (every output, every layer)

Severity tag (BLOCKER/HIGH/MEDIUM/LOW) · numeric confidence (0.0–1.0) · verbatim quotes for definitions · "What I don't know" appendix · freshness check (pre-2026 rejected without re-verify) · Context-Envelope fit gate · cost at launch + scale · re-verification cadence · cross-`D{N}` reconciliation.

**Project-specific overrides layered on top**: D4 propose-only for any integration; money-gate ceiling for any spend (`D6` is the model — hard $48,000/yr); the no-invented-figures rule (never fabricate a depot name, gear line, or dollar figure).

## LAYER 2 — 8 ANALYTICAL PROTOCOLS

Run across the Layer-1-verified corpus BEFORE Layer 3. Each surfaces a distinct cross-dossier signal: (1) Intake · (2) Contradiction Finder · (3) Citation Chain (skip with a note when no lineage exists — never fabricate) · (4) Gap Scanner · (5) Methodology Audit (neutral "highest-uncertainty" framing, never "weakest") · (6) Master Synthesis ≤400w · (7) Assumption Catalogue · (8) "So What" TL;DR. Full templates: KB-04 §3.3.

## LAYER 3 — FORWARD CONSTRUCTION

Reads the Layer 1 corpus + Layer 2 outputs; produces a deliverable that ranks options (twin-view when an assumption splits the answer, e.g. summer volume high vs low), runs sensitivity analysis, builds a staged roadmap with decidable triggers per stage, records a re-verification schedule, and reconciles against prior `D{N}` entries. Layer 3 §1–§8 ARE the Layer 2 outputs verbatim; §9+ is net-new construction.

## UNIVERSAL BLOCKS A / B / C (mandatory per dossier)

- **Block A — Context Envelope:** the binding constraints (four depots, seasonal crews, shoulder-season cash, D4, money gates). 8–15 lines. Differentiates project-fit from generic advice.
- **Block B — Common Pitfalls:** what smart operators get wrong in this domain, quantified with evidence.
- **Block C — Freshness Log:** claim × effective-date × verification-date × status. The audit artifact.

## SKILL INVOCATION

- **Layer 1 (per-dossier write-time)** → `Skill("research-prompt-writer")` — the 8-gate input filter.
- **Layer 2 + Layer 3 (synthesis-time)** → `Skill("research-synthesizer")` — the 8 protocols + forward construction + `D{N}` lock skeleton.

## REFERENCES

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §3 — canonical 3-layer architecture
- `.claude/rules/orchestrator-dispatch.md` — sibling dispatch-mechanics rule
- `.claude/skills/research-prompt-writer/SKILL.md` · `.claude/skills/research-synthesizer/SKILL.md` — invocable skills
