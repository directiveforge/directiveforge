---
name: research-prompt-writer
description: Generate research or evidence-grounded decision prompts using the 8-gate anti-hallucination framework. Routes guardrails, blueprints, and context per task type. Triggers on phrases like "write a research prompt", "draft a prompt to investigate X", "compose a dispatch prompt for citation-grounded research".
---

# Research Prompt Writer Skill

> **Trigger**: Use this skill when asked to write a research prompt for a citation-grounded surface, OR a decision prompt that requires evidence-grounded conclusions (e.g., a vendor evaluation before a governance lock). This is Layer 1 of the 3-Layer Research Architecture — per-dossier input quality enforcement.

## What this skill produces

Two prompt types, both Layer-1-disciplined:

1. **Research prompts** — dispatched to a citation-rendering surface. Output: a dossier that passes the 8-gate framework (e.g., a supplier comparison the founder can lock a decision on).
2. **Decision-work prompts** — a knowledge-routed brief with a verification checklist for a fresh agent.

Both inherit the 8-gate framework and the cross-cutting Layer 1 disciplines from KB-04 §3.1-§3.2.

## Before writing any prompt

Mandatory reads (in this order):

1. `OPS-MASTER-PLAN.md` — the source of truth the prompt must respect.
2. `governance/DECISIONS.md` — verify the prompt does not silently contradict a locked decision (D1–D7).
3. `governance/INTEGRATIONS-REGISTRY.md` — if the research touches a tool/vendor, respect the propose-only protocol (D4).
4. KB-04 §3.1 (the 8 gates) + §3.2 (the 9 cross-cutting disciplines) from the kit.

If any of these are missing, surface that gap before writing — do not improvise the routing.

## For research prompts (the 8-Gate Anti-Hallucination Framework — paste verbatim into the prompt)

1. **Source gate** — every claim cites a primary source. Section + line range for long sources.
2. **Version gate** — every cited vendor/regulation/tool includes version + effective date. Pre-2026 sources require explicit "still current as of {date}" re-verification.
3. **Stack fit gate** — every recommendation is implementable for a founder-run four-depot rental network with a seasonal crew and tight shoulder-season cash, not "in general".
4. **Cost-benefit gate** — every cost claim spans both horizons: now AND at scale (more depots / more fleet). Recurring costs surfaced explicitly (they are money decisions per the master plan).
5. **Implementation gate** — every recommendation is a concrete action a depot operator or the founder can take, not abstract advice.
6. **Cross-reference gate** — every load-bearing claim corroborated by ≥2 sources OR flagged single-source.
7. **Existing knowledge gate** — every claim checked against `governance/DECISIONS.md` + existing playbooks. If already answered, point to the existing doc.
8. **Quote extraction gate** — definitional claims (a contract's exact terms, a vendor's exact capability) embed the verbatim quote with citation.

**Severity tags** (every finding): 🚨 BLOCKER / ⚠ HIGH / 🟡 MEDIUM / 🟢 LOW.
**Numeric confidence** (every load-bearing claim): 0.0–1.0. No prose hedges without a numeric anchor.

## Universal Blocks A / B / C (mandatory in every dossier — KB-04 §6)

- **Block A — Context Envelope** (8–15 lines): binding constraints — founder-run, seasonal crew, tight shoulder-season cash, propose-only integrations, four named depots.
- **Block B — Common Pitfalls** (3–5 quantified examples): what operators in this domain get wrong + cost + evidence + corrective.
- **Block C — Freshness Log** (one row per load-bearing citation): claim × effective-date × verification-date × status.

## Output

Save the written prompt to `docs/prompts/<SLUG>.md` (e.g., `R1_drysuit_supplier`). Keep it separate from any playbook change.

## Quality checks (before declaring the prompt complete)

- [ ] 8-gate framework included verbatim (research prompts)
- [ ] Universal Blocks A / B / C required in the dossier output
- [ ] Severity tags + numeric confidence requirements stated
- [ ] No silent contradiction of any `governance/DECISIONS.md` entry — cross-reference noted
- [ ] Out-of-scope boundary explicit
- [ ] Propose-only respected — a tool/vendor prompt never instructs wiring anything up (D4)

## Gotchas

- A prompt that omits Block A produces a perfect answer that ignores the shoulder-season cash reality — the whole reason the drysuit decision waits for summer numbers.
- A vendor-research prompt that drifts into "and set up the account" violates D4 — research informs a founder decision; it never wires anything.
- Restating a master-plan fact inside the prompt instead of pointing to it breaks single-source-of-truth.

## When NOT to use this skill

- For a single playbook edit — just edit it; this is for evidence-grounded decision work.
- For Layer 2 / Layer 3 synthesis across multiple dossiers — use the `research-synthesizer` sibling skill.
- For an ad-hoc "explain this" question — no 8-gate discipline needed.

## References

- KB-04 §3.1 — the 8-gate framework (canonical)
- KB-04 §3.2 — the 9 cross-cutting Layer 1 disciplines
- KB-04 §6 — Universal Blocks A / B / C
- Sibling skill: `research-synthesizer` — Layer 2 + Layer 3 enhancement
- `governance/DECISIONS.md` — locked decisions to cross-reference against
