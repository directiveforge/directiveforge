---
name: research-synthesizer
description: Run cross-dossier synthesis with Layer 2 (8 analytical protocols) + Layer 3 (forward decision construction). Triggers on "synthesize across these dossiers", "cross-dossier audit", "decision framework synthesis", "build R-class deliverable", or any orchestrator Phase 3 synthesis stage.
---

# Research Synthesizer Skill

Wraps the 3-layer research architecture from KB-04 §3. Use this skill at synthesis time, after N research dossiers have passed Layer 1's 8-gate input filter and you need a single decision-framework deliverable + a DECISIONS lock skeleton.

This is the **synthesis-time companion** to `research-prompt-writer` (the dossier-write-time skill).

**Input:** N Layer-1-verified dossier paths.
**Output:** Layer 3 deliverable with §1–§8 Layer 2 prefix sections + §9+ Layer 3 construction sections + a DECISIONS lock skeleton.

## Mandatory reading order

1. `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §3 — the 3-layer architecture (8 protocols + Layer 3 construction + composability insight).
2. `.claude/rules/research.md` — the project's research-methodology rule (3-layer pointer + locked overrides).
3. `DECISIONS.md` — the entry template + most recent ledger numbering.
4. Each input dossier — confirm the Layer 1 8-gate verification stamp before this skill runs.

(Long-form Layer-2 reference `docs/reference/research-synthesis-protocols.md` is NOT installed for SlotHarbor — rely on KB-04 §3.3.)

## When to invoke

- Orchestrator R-stage / M-stage synthesis (the terminal wave of a multi-dossier track).
- Cross-dossier audit before locking a new DECISIONS entry.
- "Phase 3 synthesis" handoff from a research orchestrator.

## When NOT to invoke

- Single-dossier review or write-time prompt design — use `research-prompt-writer` instead.
- Retroactive analysis of a closed corpus (the project's locked dossiers + DECISIONS are canonical).

## Output structure (mandatory shape from KB-04 §3)

```markdown
# {Topic} — Decision Framework Synthesis (Layer 2 + Layer 3)

## §1 TL;DR (Protocol 8 — smart non-expert, 3 numbered points)
## §2 Master Synthesis (Protocol 6 — ≤400w, 4 sections)
## §3 Contradiction Table (Protocol 2 — tiered, tabular)
## §4 Assumption Catalogue (Protocol 7 — flexible count, risk × consequence)
## §5 Concept Trace (Protocol 3 — only where intellectual lineage exists; explicit "skip" with reason otherwise)
## §6 Methodology Classification (Protocol 5 — neutral framing)
## §7 Intake Catalogue (Protocol 1 — per-dossier table + 2–5 clusters)
## §8 Gap Inventory (Protocol 4 — ranked, with closest-prior-work + path-to-resolution)

## §9 Staged roadmap (Layer 3 construction)
## §10 Twin-view ranked matrix
## §11 Sensitivity analysis (4 weight regimes + 2 scale shocks)
## §12 Phase 3 user elicitation Q1–Qn
## §13 Architect prompt skeleton for the next implementation phase
## §14 Re-verification schedule (quarterly / semiannual / annual / event-triggered)
## §15 Reversal triggers per stage
## §16 Cross-DECISIONS reconciliation (preserves / supersedes prior #N)
```

**Layer 2 ALWAYS feeds Layer 3.** The deliverable cannot ship with just §1–§8 (no recommendation made), nor with just §9+ (analytical scaffolding skipped). Both halves are mandatory.

## 9 inheritance disciplines (mandatory on every Layer 2 protocol output)

Per KB-04 §3.2:

1. **Severity tag** per finding — 🚨 / ⚠ / 🟡 / 🟢. Cross-cutting calibration across the whole corpus.
2. **Numeric confidence** per claim — 0.0–1.0. No prose hedges without a numeric anchor.
3. **Verbatim quote extraction** — every load-bearing definitional claim cites verbatim primary-source language.
4. **"What I don't know" appendix** — every Layer 2 protocol output ends with explicit unknowns + next-step-to-resolve.
5. **Freshness check** — pre-2026 claims without re-verification = automatic reject.
6. **Stack-fit gate** — project constraints embedded via Universal Block A as mandatory input to every protocol.
7. **TCO at launch + 10× scale** — every cost claim includes both horizons.
8. **Re-verification cadence** per finding — quarterly / semiannual / annual / event-triggered.
9. **Cross-DECISIONS reconciliation** — every Layer 2 output enumerates which prior locked entries it preserves or supersedes.

## Anti-patterns (from KB-04 §9 — most relevant to synthesis)

| Anti-pattern | Why it matters | Mitigation in this skill |
|---|---|---|
| No severity calibration | Findings rank by recency instead of impact | Inherit the 🚨/⚠/🟡/🟢 tag on every protocol output |
| No "What I don't know" appendix | Ambiguities propagate silently into the lock | Mandatory closing section per protocol + per deliverable |
| Paraphrased load-bearing definitions | Audit trail breaks | Verbatim quote required; long quotes truncated with `[...]` |
| Project-agnosticism | Recommendations ignore binding constraints | Universal Block A is a mandatory input, not optional |
| "Weakest"/"best" pejorative framing | Mischaracterises uncertainty | Use "highest-uncertainty"/"highest-confidence" neutral framing |
| Master Synthesis 400w replacing the full body | Nuance lost | Master Synthesis complements the full body, never replaces it |

## DECISIONS template extension

Every new DECISIONS entry from this skill's lock-skeleton output starts with the TL;DR + Master Synthesis 400w prefix, per KB-04 §2.2. (SlotHarbor's ledger is currently Tier 2; when an entry needs >4 dossiers, graduate it to the Tier 3 prefix.)

## Quality checks (before declaring synthesis complete)

- [ ] 8 Layer 2 protocols produced (or explicit "skip" reason recorded for Protocol 3 if no lineage exists)
- [ ] Layer 3 §9–§16 sections all present; none collapsed into prose
- [ ] All 9 inheritance disciplines applied to every Layer 2 protocol output
- [ ] Every load-bearing claim cites a specific dossier section — not "the dossier"
- [ ] Cross-DECISIONS reconciliation explicit (preserves / supersedes for every interacting prior entry)
- [ ] Twin-view ranking included where a major assumption splits the answer

## Output paths

- Deliverable: `docs/research/<N>-decision-framework-synthesis.md`
- DECISIONS lock skeleton: drafted parallel to the deliverable; append to `DECISIONS.md` after numbering verification (`grep -c "^### Implementation #" DECISIONS.md` + 1).

## References

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` — §3, §3.4, §3.5, §6, §9
- `.claude/rules/research.md` — project's 3-layer methodology rule
- `.claude/skills/research-prompt-writer/SKILL.md` — Layer 1 sibling skill
