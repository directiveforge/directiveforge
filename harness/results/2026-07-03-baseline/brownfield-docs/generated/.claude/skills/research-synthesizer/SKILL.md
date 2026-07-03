---
name: research-synthesizer
description: Run cross-dossier synthesis with Layer 2 (8 analytical protocols) + Layer 3 (forward decision construction). Triggers on "synthesize across these dossiers", "cross-dossier audit", "decision framework synthesis", "build R-class deliverable", or any orchestrator Phase 3 synthesis stage.
---

<!--
  Dual applicability: this template is used unchanged in both
  .cursor/skills/research-synthesizer/SKILL.md (Cursor) and
  .claude/skills/research-synthesizer/SKILL.md (Claude Code).
  Both surfaces consume the same SKILL.md frontmatter format.
-->

# Research Synthesizer Skill

Wraps the 3-layer research architecture from KB-04 §3. Use this skill at synthesis time, after N research dossiers (typically 8–12) have passed Layer 1's 8-gate input filter and you need a single decision-framework deliverable + a DECISIONS lock skeleton.

This is the **synthesis-time companion** to `research-prompt-writer` (the dossier-write-time skill). Invoke that one to design a prompt; invoke this one when a corpus already exists.

**Input:** N Layer-1-verified dossier paths + the project's KB Coverage Matrix + Gap Inventory if available.
**Output:** Layer 3 deliverable with §1–§8 Layer 2 prefix sections + §9+ Layer 3 construction sections + a DECISIONS lock skeleton.

## Mandatory reading order

1. `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §3 — the 3-layer architecture (8 protocols + Layer 3 construction + composability insight)
2. `.claude/rules/research.md` — the project's research-methodology rule (3-layer pointer + locked overrides)
3. `OPS-MASTER-PLAN.md` — the declared source of truth the synthesis must not contradict
4. The relevant existing playbooks + any archived report on the topic (`docs/archive/`) — e.g. the drysuit-supplier comparison is the closest prior work on a supplier decision
5. `governance/DECISIONS.md` — the house `D{N}` entry format + the current ledger numbering (last entry is `D6`; next is `D7`)
6. Each input dossier — open and confirm Layer 1 8-gate verification before this skill runs

## When to invoke

- Orchestrator R-stage / M-stage synthesis (the terminal wave of a multi-dossier track)
- Cross-dossier audit before locking a new DECISIONS entry
- "Phase 3 synthesis" handoff from a research orchestrator
- "Build me an R-class / M-class decision-framework deliverable from these dossiers"

## When NOT to invoke

- Single-dossier review or write-time prompt design — use `research-prompt-writer` instead
- Retroactive analysis of a closed corpus (the project's locked dossiers + DECISIONS are canonical; do not re-run synthesis on them)
- Generating end-user-facing copy in regulated locales — that work belongs to the project's locale-handoff workflow, not synthesis

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

**Layer 2 ALWAYS feeds Layer 3.** The deliverable cannot ship with just §1–§8 (no recommendation made). The deliverable cannot ship with just §9+ (analytical scaffolding skipped, citations weak). Both halves are mandatory.

## 9 inheritance disciplines (mandatory on every Layer 2 protocol output)

Per KB-04 §3.2 — every protocol output, and the Layer 3 deliverable that consumes them, inherit these disciplines from Layer 1:

1. **Severity tag** per finding — 🚨 BLOCKER / ⚠ HIGH / 🟡 MEDIUM / 🟢 LOW. Cross-cutting calibration across the whole corpus, not local-only.
2. **Numeric confidence** per claim — 0.0–1.0 scale. No prose hedges ("most consistent", "settled") without a numeric anchor.
3. **Verbatim quote extraction** — every load-bearing definitional claim cites verbatim primary-source language. Paraphrase of a load-bearing definition = output rejected.
4. **"What I don't know" appendix** — every Layer 2 protocol output ends with explicit unknowns + next-step-to-resolve.
5. **Freshness check** — pre-2026 claims without explicit re-verification = automatic reject.
6. **Stack-fit gate** — project constraints embedded via Universal Block A (Context Envelope) as mandatory input to every protocol.
7. **TCO at launch + 10× scale** — every cost claim includes both horizons. Hidden costs surfaced.
8. **Re-verification cadence** per finding — quarterly / semiannual / annual / event-triggered, recorded inline next to the claim.
9. **Cross-DECISIONS reconciliation** — every Layer 2 output ends with a section enumerating which prior locked entries it preserves or supersedes.

This project layers its own disciplines on top of these nine: D4 propose-only for any integration, money-gate ceilings for any spend (`D6` model), and the no-invented-figures rule. Project-specific overrides live in `.claude/rules/research.md`.

## Anti-patterns (from KB-04 §9 — most relevant to synthesis)

| Anti-pattern | Why it matters | Mitigation in this skill |
|---|---|---|
| No severity calibration | Findings rank by recency or prose length instead of impact | Inherit the 🚨/⚠/🟡/🟢 tag on every protocol output |
| No "What I don't know" appendix | Ambiguities propagate silently into the lock | Mandatory closing section per protocol + per deliverable |
| Paraphrased load-bearing definitions | Audit trail breaks when reviewer cannot find source text | Verbatim quote required; long quotes truncated with `[...]` |
| Project-agnosticism | Recommendations ignore binding constraints | Universal Block A (Context Envelope) is a mandatory input, not optional |
| "Weakest" / "best" pejorative framing | Mischaracterises uncertainty; biases ranking | Use "highest-uncertainty" / "highest-confidence" neutral framing |
| Master Synthesis 400w replacing the full body | Stakeholders read only the 400w; nuance lost | Master Synthesis is a complement to the full body, never a replacement; always link to §9+ from §2 |
| TL;DR trivialising the dense lock | Three bullets become the entire decision record | TL;DR sits *above* the full body, never instead of it |

## DECISIONS template extension

This repo's ledger uses the house `D{N}` heading format, NOT `Implementation #N`. A synthesis-grade decision keeps that heading and adds the TL;DR + Master Synthesis prefix inside the entry, per KB-04 §2.2:

```markdown
## D{N} — {Title}

**Date:** {YYYY-MM-DD}
**Status:** accepted   <!-- add · money gate / · binding on all operators as applicable -->

### TL;DR (smart non-expert, 3 numbered points)

1. What has been proven — [≤3 sentences]
2. What is still unknown — [≤3 sentences]
3. Why it matters — [≤3 sentences]

### Master Synthesis (≤400 words, 4 sections)

**Established Consensus (~100w):** ...
**Active Debates (~100w):** ...
**Strongest Evidence (~100w):** ...
**Key Open Question (~80w):** ...

### Full Decision Body

[Chosen path, ranked matrix, sensitivity, staged roadmap, reversal triggers, re-verification, cross-reconciliation]
```

The lighter `D1`–`D6` entries stay as they are (append-only — never rewritten). Forward entries that carry real research weight inherit the full prefix; a simple call can stay in the short house form.

## Quality checks (before declaring synthesis complete)

- [ ] 8 Layer 2 protocols produced (or explicit "skip" reason recorded for Protocol 3 if no intellectual lineage exists)
- [ ] Layer 3 §9–§16 sections all present; none collapsed into prose
- [ ] All 9 inheritance disciplines applied to every Layer 2 protocol output
- [ ] Every load-bearing claim cites a specific dossier section (e.g., `R3 §4 ¶6.42`) — not "the dossier"
- [ ] Cross-DECISIONS reconciliation explicit (preserves / supersedes for every interacting prior entry)
- [ ] `D{N}` lock skeleton uses the house heading + TL;DR + Master Synthesis 400w prefix; numbering verified (last is `D6` → next is `D7`)
- [ ] Twin-view ranking included where a major assumption splits the answer
- [ ] No regulated-locale customer-facing copy generated inside the deliverable

## Gotchas

- **Ledger heading format** — this repo uses `## D{N}` (house format), NOT `## Implementation #N`. A lock skeleton written in the wrong heading breaks the ledger's append-only numbering and the doc-lint ledger-integrity gate. Always confirm the format in `governance/DECISIONS.md` before drafting.
- **Money-gate decisions never ship as a bare recommendation** — a supplier/lease/expansion synthesis that touches spend must land as a `D{N}` with a stated ceiling (`D6` is the model: hard $48,000/yr), reversal triggers, and a re-verification cadence — never "vendor X is cheaper, go".
- **Never invent to fill a section** — if the corpus has no intellectual lineage, Protocol 3 (Citation Chain) is skipped with an explicit reason, not fabricated. Same for any dollar figure, depot name, or gear line not sourced in a dossier.
- **The synthesis must not contradict `OPS-MASTER-PLAN.md`** — the master plan wins; if a dossier's recommendation conflicts with it, surface the conflict for a governance decision rather than silently overriding.

## Output paths

- Deliverable: `docs/research/<topic>-decision-framework-synthesis.md` (create `docs/research/` on first use — it does not exist yet).
- `D{N}` lock skeleton: drafted parallel to the deliverable. Save inline at the end of the deliverable body, or as a separate handoff file for the next session to append to `governance/DECISIONS.md` after numbering verification:
  ```bash
  grep -c '^## D[0-9]' governance/DECISIONS.md   # count; next number = last D{N} + 1
  ```

## References

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` — §3 (3-layer architecture), §3.4 (Layer 3 construction), §3.5 (composability insight), §6 (Universal Blocks A/B/C), §9 (anti-patterns)
- `.claude/skills/research-prompt-writer/SKILL.md` — Layer 1 sibling skill (8-gate input filter)
- `.claude/rules/research.md` — project's 3-layer methodology rule
- `governance/DECISIONS.md` — the `D{N}` ledger the synthesis locks into (append-only)
