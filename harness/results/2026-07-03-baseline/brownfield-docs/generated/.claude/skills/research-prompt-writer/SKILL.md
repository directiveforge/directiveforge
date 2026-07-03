---
name: research-prompt-writer
description: Generate research or implementation prompts using the 8-gate anti-hallucination framework. Routes guardrails, blueprints, and context per task type. Triggers on phrases like "write a research prompt", "draft an implementation prompt", "compose a dispatch prompt for Chat Research".
---

<!--
  Skill template — works for both Cursor (`.cursor/skills/<name>/SKILL.md`)
  and Claude Code (`.claude/skills/<name>/SKILL.md`). The format is identical
  between the two systems; copy this file into whichever directory your
  project uses (or both — keep them in sync).
-->

# Research Prompt Writer Skill

> **Trigger**: Use this skill when asked to write a research prompt for dispatch to Chat Research mode (or equivalent citation-grounded surface), OR an implementation prompt that requires evidence-grounded decisions. This is Layer 1 of the 3-Layer Research Architecture — per-dossier input quality enforcement.

## What this skill produces

Two prompt types, both Layer-1-disciplined:

1. **Research prompts** — dispatched to Chat Research / a citation-rendering surface. Output: a dossier that passes the 8-gate framework.
2. **Implementation prompts** — handed to a coding agent (Claude Code, Cursor, etc.). Output: a knowledge-routed work brief with a verification checklist.

Both inherit the 8-gate framework and the cross-cutting Layer 1 disciplines from KB-04 §3.1-§3.2.

## Before writing any prompt

Mandatory reads (in this order):

1. `OPS-MASTER-PLAN.md` — the declared source of truth; a research prompt must not commission work that contradicts it.
2. `CLAUDE.md` — the project's house rules and locked constraints (D4 propose-only, money gates, no-invented-figures) the prompt must enforce.
3. `governance/DECISIONS.md` — verify the prompt does not silently contradict a locked `D{N}` entry.
4. KB-04 §3.1 (the 8 gates) and §3.2 (the 9 cross-cutting disciplines) from the kit.

If any of these are missing for the project, surface that gap before writing — do not improvise the routing.

## For implementation prompts

1. **Identify the task type** — the recurring strategic-question shapes here: supplier / vendor selection, depot expansion, lease terms, payment-processor change, seasonal-staffing model, deposit / recovery policy, integration proposal (or another decision the master plan flags). Ground it in `OPS-MASTER-PLAN.md` + the relevant playbook.
2. **Build a Knowledge Manifest** (hard cap 5-7 files, grouped by reading order):
   - **Guardrails** (read FIRST) — what NOT to do; locked anti-patterns
   - **Blueprint** (read SECOND) — the exact spec from component-library / page-blueprints / API contract / schema
   - **Voice** (read THIRD) — locked strings, naming conventions, brand register for user-facing copy
   - **Context** (read LAST, only if a BLOCKER question remains) — supporting research dossiers
3. Reference sections, not whole files (`§Section 3` or `lines N-M`) — never full-file dumps.
4. **Extract a Verification Checklist** from the blueprint — every spec requirement becomes a `grep` / `Read` check the agent runs before declaring done. Format: `[ ] N of M requirements verified`.
5. Include: locked constraints inline (D4 propose-only, money gates, no invented figures), reading order, "what NOT to drift into" boundary.

## For research prompts (the 8-Gate Anti-Hallucination Framework — paste verbatim into the prompt)

1. **Source gate** — every claim cites a primary source (vendor docs, published papers, official release notes, government registries). Section + line range for long sources. No paraphrased commentary as load-bearing evidence.
2. **Version gate** — every cited vendor, SaaS, regulation, or supplier term includes its version + effective date. Pre-2026 sources require explicit re-verification ("still current as of {date}").
3. **Stack fit gate** — every recommendation must be implementable as a docs/governance change in THIS repo (a new playbook, a registry proposal, a `D{N}` ledger entry) and must fit the operating reality: four depots, seasonal crews, shoulder-season cash tightness. A recommendation that assumes year-round staff, an unbudgeted recurring bill, or an un-proposed integration is research-only, not a recommendation.
4. **Cost-benefit gate** — every cost claim spans both horizons: at launch AND at 10× scale. Hidden costs (audit fees, compliance overhead, monitoring subscriptions) surfaced explicitly.
5. **Implementation gate** — every technique is implementable as a concrete artifact (skill, rule, code snippet, prompt template). Abstract advice ("apply best practice") fails this gate.
6. **Cross-reference gate** — every load-bearing claim is corroborated by ≥2 independent sources OR explicitly flagged as single-source-uncorroborated.
7. **Existing knowledge gate** — every claim is checked against `governance/DECISIONS.md` + existing playbooks + archived reports (`docs/archive/`). If the question is already answered (e.g. the drysuit comparison in `docs/archive/`), the prompt points to the existing doc rather than re-deriving.
8. **Quote extraction gate** — where source wording is definitional (a regulation's exact text, a vendor's exact capability claim), embed the verbatim quote with citation. Paraphrase of load-bearing definitions fails this gate.

**Severity tags** (every finding): 🚨 BLOCKER / ⚠ HIGH / 🟡 MEDIUM / 🟢 LOW. Calibration is cross-cutting, not local.

**Numeric confidence** (every load-bearing claim): 0.0-1.0 scale. No prose hedges ("most consistent", "settled") without a numeric anchor.

## Universal Blocks A / B / C (mandatory in every dossier — KB-04 §6)

Every research prompt explicitly requires the dossier to include:

- **Block A — Context Envelope** (8-15 lines): the project's binding constraints (budget, team capacity, locked technology, regulatory posture, market constraints). Without it, the dossier produces generic recommendations that ignore project reality.
- **Block B — Common Pitfalls** (3-5 quantified examples): "what do smart operators get wrong in this domain?" Each pitfall: wrong move + cost + primary-source evidence + corrective.
- **Block C — Freshness Log** (one row per load-bearing citation): claim × effective-date × verification-date × status (✅ verified / ⚠ stale-but-load-bearing / ❓ unverifiable). This is the audit artifact.

## Output

Save the written prompt to `docs/prompts/<SLUG>.md`. <!-- example slug: `R1_drysuit_supplier` or `R2_larkfield_crew_pool` -->

Commit the prompt separately from any doc changes:

```
docs(prompts): write <topic> prompt — research / <scope>
```

<!-- example: docs(prompts): write drysuit-supplier prompt — research / summer-numbers gate -->

## Quality checks (run before declaring the prompt complete)

- [ ] Knowledge Manifest ≤ 7 files, section-specific references (never whole-file dumps)
- [ ] Reading order explicit: guardrails → blueprint → voice → context
- [ ] Verification checklist extracted from the actual blueprint (implementation prompts only)
- [ ] 8-gate framework included verbatim (research prompts only)
- [ ] Universal Blocks A / B / C required in the dossier output (research prompts only)
- [ ] Severity tags + numeric confidence requirements stated
- [ ] No silent contradiction of any entry in `governance/DECISIONS.md` — cross-reference noted where applicable
- [ ] Out-of-scope boundary explicit (what the dispatched agent must NOT drift into)

## Gotchas

- Knowledge manifests over 7 files bloat per-dispatch token cost and dilute focus — cut the weakest file rather than expand the cap.
- A research prompt that omits Block A (Context Envelope) produces stack-fit failures: the dossier returns a clean answer that ignores this business's binding reality — four depots, seasonal crews, shoulder-season cash tightness, D4 propose-only credentials.
- A prompt that commissions a spend recommendation must require the dossier to state costs at launch AND at scale, and to land as a money-gate `D{N}` with a ceiling — never a bare "vendor X is cheaper".

## When NOT to use this skill

- For a single-PR coding task — write a regular Code-handoff prompt instead (see `prompts/code-handoff-prompts.md`)
- For Layer 2 / Layer 3 synthesis work — use the `research-synthesizer` sibling skill instead
- For end-user copy in regulated languages — delegate to the project's locked copy workflow, not this skill
- For ad-hoc "explain this concept" prompts — those do not need the 8-gate discipline

## References

- KB-04 §3.1 — the 8-gate framework (canonical)
- KB-04 §3.2 — the 9 cross-cutting Layer 1 disciplines
- KB-04 §6 — Universal Blocks A / B / C
- Sibling skill: `research-synthesizer` — Layer 2 + Layer 3 enhancement pattern
- `OPS-MASTER-PLAN.md` — the declared source of truth every prompt must respect
- `governance/DECISIONS.md` — locked `D{N}` decisions to cross-reference against
