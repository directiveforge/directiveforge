---
name: research-prompt-writer
description: Generate research or implementation prompts using the 8-gate anti-hallucination framework. Routes guardrails, blueprints, and context per task type. Triggers on phrases like "write a research prompt", "draft an implementation prompt", "compose a dispatch prompt for Chat Research".
---

# Research Prompt Writer Skill

> **Trigger**: Use this skill when asked to write a research prompt for dispatch to Chat Research mode (or equivalent citation-grounded surface), OR an implementation prompt that requires evidence-grounded decisions. This is Layer 1 of the 3-Layer Research Architecture — per-dossier input quality enforcement.

## What this skill produces

Two prompt types, both Layer-1-disciplined:

1. **Research prompts** — dispatched to Chat Research / a citation-rendering surface. Output: a dossier that passes the 8-gate framework.
2. **Implementation prompts** — handed to a coding agent. Output: a knowledge-routed work brief with a verification checklist.

Both inherit the 8-gate framework and the cross-cutting Layer 1 disciplines from KB-04 §3.1-§3.2.

## Before writing any prompt

Mandatory reads (in this order):

1. `.claude/rules/base.md` + `.claude/rules/api-python.md` — SlotHarbor's locked conventions the prompt must respect (sync stack, Pydantic v2, no async).
2. `DECISIONS.md` — verify the prompt does not silently contradict a locked entry (#1 sync, #2 legacy-export, #3 config).
3. KB-04 §3.1 (the 8 gates) and §3.2 (the 9 cross-cutting disciplines) from the kit.

If any of these are missing, surface that gap before writing — do not improvise the routing.

## For implementation prompts

1. **Identify the task type** — endpoint / model / migration / config / integration.
2. **Build a Knowledge Manifest** (hard cap 5-7 files, grouped by reading order):
   - **Guardrails** (read FIRST) — `.claude/rules/base.md`, `.claude/rules/api-python.md`; locked anti-patterns.
   - **Blueprint** (read SECOND) — the exact spec: the affected router / model / migration.
   - **Context** (read LAST, only if a BLOCKER question remains) — supporting research dossiers.
3. Reference sections, not whole files (`§Section 3` or `lines N-M`) — never full-file dumps.
4. **Extract a Verification Checklist** — every spec requirement becomes a `grep` / `Read` / boot-and-curl check the agent runs before declaring done. Format: `[ ] N of M requirements verified`.
5. Include: anti-patterns inline, reading order, "what NOT to drift into" boundary (e.g. "do not add async", "do not mount legacy_export").

## For research prompts (the 8-Gate Anti-Hallucination Framework — paste verbatim into the prompt)

1. **Source gate** — every claim cites a primary source. Section + line range for long sources.
2. **Version gate** — every cited library/SaaS/framework/regulation includes its version + effective date. Pre-2026 sources require explicit re-verification.
3. **Stack fit gate** — every recommendation must be implementable in FastAPI 0.115 + SQLAlchemy 2.0 (sync) + Pydantic 2.7 + Alembic + Postgres/SQLite. A library not in `pyproject.toml` is research-only, not a recommendation.
4. **Cost-benefit gate** — every cost claim spans launch AND 10× scale. Hidden costs surfaced explicitly.
5. **Implementation gate** — every technique is implementable as a concrete artifact (rule, snippet, migration, prompt). Abstract advice fails.
6. **Cross-reference gate** — every load-bearing claim corroborated by ≥2 independent sources OR flagged single-source-uncorroborated.
7. **Existing knowledge gate** — every claim checked against `DECISIONS.md` + existing docs. If answered, point to the existing doc.
8. **Quote extraction gate** — definitional claims embed the verbatim quote with citation. Paraphrase of load-bearing definitions fails.

**Severity tags** (every finding): 🚨 BLOCKER / ⚠ HIGH / 🟡 MEDIUM / 🟢 LOW.
**Numeric confidence** (every load-bearing claim): 0.0-1.0 scale.

## Universal Blocks A / B / C (mandatory in every dossier — KB-04 §6)

- **Block A — Context Envelope** (8-15 lines): SlotHarbor's binding constraints (small maintenance-mode service, sync stack locked, no test tooling, Postgres prod / SQLite dev).
- **Block B — Common Pitfalls** (3-5 quantified examples): what smart operators get wrong in this domain.
- **Block C — Freshness Log** (one row per load-bearing citation): claim × effective-date × verification-date × status.

## Output

Save the written prompt to `docs/prompts/<SLUG>.md`. Commit separately from any code change:

```
docs(prompts): write <topic> prompt — <type> / <scope>
```

## Quality checks (run before declaring the prompt complete)

- [ ] Knowledge Manifest ≤ 7 files, section-specific references (never whole-file dumps)
- [ ] Reading order explicit: guardrails → blueprint → context
- [ ] Verification checklist extracted from the actual blueprint (implementation prompts only)
- [ ] 8-gate framework included verbatim (research prompts only)
- [ ] Universal Blocks A / B / C required in the dossier output (research prompts only)
- [ ] Severity tags + numeric confidence requirements stated
- [ ] No silent contradiction of any `DECISIONS.md` entry
- [ ] Out-of-scope boundary explicit (no async, no mounting legacy_export)

## Gotchas

- Knowledge manifests over 7 files degrade retrieval and bloat per-dispatch token cost — cut the weakest file rather than expand the cap.
- Implementation prompts without a verification checklist drift into "agent says done" — always extract the checklist from the blueprint.
- Research prompts that omit Block A produce stack-fit failures: a perfect answer that ignores SlotHarbor's sync-only, no-tooling reality.

## When NOT to use this skill

- For a single-PR coding task — write a regular Code-handoff prompt instead.
- For Layer 2 / Layer 3 synthesis work — use the `research-synthesizer` sibling skill.
- For ad-hoc "explain this concept" prompts — those do not need the 8-gate discipline.

## References

- KB-04 §3.1 — the 8-gate framework (canonical)
- KB-04 §3.2 — the 9 cross-cutting Layer 1 disciplines
- KB-04 §6 — Universal Blocks A / B / C
- Sibling skill: `research-synthesizer` — Layer 2 + Layer 3 enhancement pattern
- `DECISIONS.md` — locked decisions to cross-reference against
