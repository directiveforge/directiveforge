---
name: research-synthesizer
description: Run cross-dossier synthesis with Layer 2 (8 analytical protocols) + Layer 3 (forward decision construction). Triggers on "synthesize across these dossiers", "cross-dossier audit", "build a decision framework from these", or any multi-dossier synthesis stage before a governance lock.
---

# Research Synthesizer Skill

Wraps the 3-layer research architecture from KB-04 §3. Use this skill at synthesis time, after several research dossiers have passed Layer 1's 8-gate input filter and you need a single decision-framework deliverable + a DECISIONS lock skeleton (e.g., synthesizing multiple supplier comparisons into a locked vendor choice once summer numbers land).

This is the **synthesis-time companion** to `research-prompt-writer` (the dossier-write-time skill).

**Input:** N Layer-1-verified dossier paths.
**Output:** Layer 3 deliverable with §1–§8 Layer 2 prefix sections + §9+ Layer 3 construction + a DECISIONS lock skeleton.

## Mandatory reading order

1. `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` §3 — the 3-layer architecture
2. `.claude/rules/research.md` — this project's research-methodology rule
3. `governance/DECISIONS.md` — the entry format + current numbering (next after D7 is D8)
4. Each input dossier — confirm its Layer 1 8-gate verification before this skill runs

## When to invoke

- Cross-dossier audit before locking a new `governance/DECISIONS.md` entry
- "Build me a decision framework from these dossiers"

## When NOT to invoke

- Single-dossier review or write-time prompt design — use `research-prompt-writer` instead
- Re-analysis of already-locked decisions (D1–D7 are canonical; do not re-run synthesis on them)

## Output structure (mandatory shape from KB-04 §3)

```markdown
# {Topic} — Decision Framework Synthesis (Layer 2 + Layer 3)

## §1 TL;DR (Protocol 8 — 3 numbered points)
## §2 Master Synthesis (Protocol 6 — ≤400w, 4 sections)
## §3 Contradiction Table (Protocol 2 — tiered)
## §4 Assumption Catalogue (Protocol 7)
## §5 Concept Trace (Protocol 3 — skip with reason if no lineage)
## §6 Methodology Classification (Protocol 5 — neutral framing)
## §7 Intake Catalogue (Protocol 1)
## §8 Gap Inventory (Protocol 4)
## §9 Staged roadmap  ## §10 Twin-view ranked matrix  ## §11 Sensitivity
## §12 Founder elicitation Qs  ## §13 Architect-prompt skeleton
## §14 Re-verification schedule  ## §15 Reversal triggers  ## §16 Cross-DECISIONS reconciliation
```

**Layer 2 ALWAYS feeds Layer 3.** The deliverable cannot ship with just §1–§8 (no recommendation) or just §9+ (weak citations). Both halves are mandatory.

## 9 inheritance disciplines (mandatory on every Layer 2 output)

Severity tag · numeric confidence · verbatim quote extraction · "what I don't know" appendix · freshness check · Context Envelope input · cost at both horizons · re-verification cadence · cross-DECISIONS reconciliation. (KB-04 §3.2.)

## DECISIONS lock skeleton

Every lock skeleton from this skill uses the house format: `## D{N} — title`, Date, Status, body with reversal triggers + re-verify + cross-references. It is APPENDED to `governance/DECISIONS.md` (never a root ledger) after numbering verification (`grep -c "^## D" governance/DECISIONS.md` + 1).

## Quality checks (before declaring synthesis complete)

- [ ] 8 Layer 2 protocols produced (or explicit "skip" reason for Protocol 3 if no lineage)
- [ ] Layer 3 §9–§16 present; none collapsed into prose
- [ ] All 9 inheritance disciplines applied
- [ ] Every load-bearing claim cites a specific dossier section — not "the dossier"
- [ ] Twin-view ranking where a major assumption splits the answer (e.g., "summer volume high" vs "low")
- [ ] Lock skeleton uses the house `## D{N}` format, appended not forked

## Output paths

- Deliverable: `docs/research/<topic>-decision-framework-synthesis.md`
- DECISIONS lock skeleton: drafted at the end of the deliverable for the next session to append to `governance/DECISIONS.md`.

## References

- `<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md` — §3, §3.4, §3.5, §6, §9
- `.claude/rules/research.md` — this project's 3-layer methodology rule
- Sibling: `research-prompt-writer` — Layer 1 (8-gate input filter)
