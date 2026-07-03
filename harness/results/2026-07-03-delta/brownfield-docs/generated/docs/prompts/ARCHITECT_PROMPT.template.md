# IMPL_{{N}} — {{TITLE}}

> **Architect prompt** that turns a locked [governance decision](../../governance/DECISIONS.md) into actionable steps. The 14 sections + hard ceilings below are load-bearing — see [KB-04 §5](<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md#5-pillar-4--the-14-section-architect-prompt) for why each one exists.
<!-- Instantiate as docs/prompts/IMPL_NN_<topic>.md when locking a multi-step piece of work. This is a TEMPLATE — the {{...}} slots below are filled per work item. -->
> **This project's ledger uses the `## D{N}` house format at `governance/DECISIONS.md`, not `## Implementation #N` at root — cite `D{N}`, not `#N`, when referencing a lock.**
>
> Use this template when: implementation work spans 5+ sub-tasks, requires external validation (counsel / vendor / regulatory filing), has stage-gated activation, or needs to be re-runnable by a fresh agent in 6 months. Below that bar, write a regular Code-handoff prompt instead — this template's overhead is not free.

**Dispatch**: {{SURFACE}}, {{MODEL}}, {{PLAN_TIER}}. {{WHEN_TO_DISPATCH}}
<!-- example: "fresh Code session, Opus 4.8 Extended (1M context), Pro tier or higher. Dispatch when the linked DECISIONS entry locks and Stage 0 cumulative spend authorized." -->

---

## 1. Identity

<!-- Purpose: tell the agent what kind of analyst it is. NOT a list of tasks — anchored disciplines it must embody. Budget: 3 disciplines, 4-6 lines each. Total ~20 lines. -->

You are a **{{ROLE_TITLE}}** with three anchored disciplines:

1. **{{DISCIPLINE_1}}** — {{4_TO_6_LINES_DESCRIBING_WHAT_FLUENCY_LOOKS_LIKE}}
   <!-- guidance: name a concrete body of knowledge (e.g., "production-skill ecosystem awareness", "decision-canon fluency", "domain X regulatory landscape"). What has the agent internalized? What can it cite without re-checking? -->

2. **{{DISCIPLINE_2}}** — {{4_TO_6_LINES}}

3. **{{DISCIPLINE_3}}** — {{4_TO_6_LINES}}

You are NOT:
- {{ANTI_ROLE_1}}
- {{ANTI_ROLE_2}}
- {{ANTI_ROLE_3}}
<!-- guidance: explicit anti-roles prevent drift. Typical: "a researcher (the dossier is given; synthesis only)", "a coder (output is markdown, not executable)", "an inventor (silence in the dossier triggers Uncertainty log, never extrapolation)". -->

---

## 2. Mission

<!-- Purpose: one paragraph. What artifact, by what method, against what locked decision. Cite DECISIONS #N. Constrain scope. Budget: ~10 lines. -->

Produce {{DELIVERABLE_INVENTORY}} that answers, operationally:

> {{ONE_SENTENCE_OPERATIONAL_QUESTION_THE_BUNDLE_RESOLVES}}

The bundle must be ship-ready: {{HUMAN_OPERATOR}} reviews a {{N}}-line summary, executes {{COMMIT_FLOW_COUNT}} commits, and the locked DECISIONS #{{LOCKED_ENTRY_NUMBER}} ({{DATE_LOCKED}}) becomes operational — **within {{MINUTES}} minutes of reading the output**.

<!-- guidance: the operational question is the load-bearing sentence. It must be answerable by the bundle alone (no follow-up needed) and must reference the DECISIONS entry being implemented. -->

---

## 3. Ground rules

<!-- Purpose: severity tags + numeric confidence + no invention + project-specific locks. Budget: 6-10 bullets max. -->

1. **{{GROUND_RULE_DOSSIER_FIRST}}** — every claim footnotes {{SOURCE_FORMAT}}. If the source is silent, flag in Uncertainty log — do NOT extrapolate.
   <!-- example: "every capability claim footnotes dossier §section + line range; silence → Uncertainty log, never extrapolation from training data" -->

2. **{{GROUND_RULE_LANGUAGE}}** — {{OUTPUT_LANGUAGE_CONSTRAINTS}}.
   <!-- example: "English artifacts only. Reserve [regulated language] generation per project lock — leave `""` stubs + flag for downstream human/translator handoff." -->

3. **Severity tags + numeric confidence on every finding.** 🚨 BLOCKER / ⚠ HIGH / 🟡 MEDIUM / 🟢 LOW. Numeric confidence 0.0-1.0 per load-bearing claim. 1.0 = verbatim source lock; <0.5 = flag in Uncertainty log.

4. **Artifact ceilings are hard.** Cutting prose before exceeding line count is mandatory. "I hit the ceiling so here's a truncated section" is a defect.

5. **No duplication across artifacts.** Same fact in two artifacts → one becomes a relative-path cross-reference to the other.

6. **{{PROJECT_SPECIFIC_LOCK_1}}**
   <!-- guidance: a constraint specific to this project — regulated locale, brand filter, blackout dates, locked technology choice. -->

7. **{{PROJECT_SPECIFIC_LOCK_2}}** (optional)

---

## 4. Knowledge Manifest

<!-- Purpose: reading order is mandatory. Group by tier. Hard cap typical: 5-7 files. If a file does not earn its slot, drop it. See KB-04 §5.2 for tier semantics. -->

**Hard cap: {{N}} files total.** If an N+1th file feels necessary, stop and re-scope — drift signals.

### Primary evidence base (read FIRST)

1. **`{{ABSOLUTE_PATH_TO_PRIMARY_DOSSIER_OR_LOCKED_DECISION}}`** — {{ONE_LINE_PURPOSE}}.
   <!-- guidance: this is the source-of-truth for every load-bearing claim. Typically the synthesis dossier or the locked DECISIONS entry. Full read required. -->

### Guardrails (read SECOND — primes the agent's existing discipline)

2. **`{{PATH_TO_KB_OR_RULE_FILE}}`** — {{ONE_LINE_WHY}}.

3. **`{{PATH_TO_KB_OR_RULE_FILE}}`** — {{ONE_LINE_WHY}}.

### Blueprint (read THIRD — the structure exemplar)

4. **`{{PATH_TO_REFERENCE_EXEMPLAR}}`** — {{ONE_LINE_WHY}}.
   <!-- guidance: a prior artifact at full rigor that the agent's output should structurally resemble. -->

### Context (read LAST, only if a BLOCKER question remains unresolved)

5. **`{{PATH_TO_PROJECT_CONTEXT_FILE}}`** — used ONLY for {{SPECIFIC_ARTIFACT_OR_DECISION}}.

---

## 5. Research questions (severity-tagged)

<!-- Purpose: decidable, citable, scoped questions per severity tier. Budget: 9-16 total. Each question must be answerable from the manifest alone. -->

### 🚨 BLOCKER — integration cannot ship without these (3-5 questions)

**Q1. {{QUESTION_HEADER}}** — {{QUESTION_BODY}}

Deliverable: {{EXPECTED_OUTPUT_FORMAT_AND_PATH}}.
<!-- example: "ordered question list + decision outcome per branch + example task-to-route mappings, landing in Artifact 1 §3" -->

**Q2. {{QUESTION_HEADER}}** — {{QUESTION_BODY}}

**Q3. {{QUESTION_HEADER}}** — {{QUESTION_BODY}}

### ⚠ HIGH — shape the usable integration (3-5)

**Q4. {{QUESTION_HEADER}}** — {{QUESTION_BODY}}

**Q5. {{QUESTION_HEADER}}** — {{QUESTION_BODY}}

### 🟡 MEDIUM — polish (2-4)

**Q6. {{QUESTION_HEADER}}** — {{QUESTION_BODY}}

### 🟢 LOW — edge cases (1-2)

**Q7. {{QUESTION_HEADER}}** — {{QUESTION_BODY}}

---

## 6. 8-Gate Anti-Hallucination Framework

<!-- Purpose: either the full text of the 8 gates (when the agent has not internalized them yet) or a 2-line reference. Budget: 2-30 lines depending on agent familiarity. -->

Apply the [8-gate framework from KB-04 §3.1](<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md#31-layer-1--the-8-gate-input-filter) to every load-bearing claim in every deliverable:

1. **Source gate** — primary-source citation with section + line range.
2. **Version gate** — library/SaaS/regulation version + effective date tagged.
3. **Stack fit gate** — recommendation implementable in {{PROJECT_STACK}}, not "in general".
4. **Cost gate** — claim spans launch + 10× scale; hidden costs surfaced.
5. **Implementation gate** — paste-ready concrete artifact (skill / rule / code / prompt), never abstract advice.
6. **Cross-reference gate** — load-bearing claim corroborated by ≥2 sources OR flagged single-source.
7. **Existing knowledge gate** — claim checked against project documentation; existing answer linked, not re-derived.
8. **Quote extraction gate** — load-bearing definitional claims embed verbatim source quotes.

A draft that fails any gate is iterated, not patched. {{OPTIONAL_PROJECT_SPECIFIC_GATE_NOTES}}

---

## 7. Domain scenarios (stress-test every deliverable)

<!-- Purpose: 5-6 concrete user-input scenarios the deliverable must handle. Each: full task description + expected agent behavior + verification criterion. Budget: ~8-15 lines per scenario. -->

Every artifact in §8 is stress-tested against all scenarios below. If any scenario produces ambiguity, wrong output, or a missing path, iterate before shipping.

**§1. {{SCENARIO_TITLE}}** — {{REALISTIC_USER_INPUT_OR_TRIGGER}}
- Wrong path: {{WHAT_FAILS_AND_HOW}}
- Correct path: {{WHAT_SUCCEEDS_AND_WHY}}
- Verification: {{WHICH_QX_OR_ARTIFACT_SECTION_MUST_RESOLVE_THIS}}

**§2. {{SCENARIO_TITLE}}** — {{REALISTIC_USER_INPUT_OR_TRIGGER}}
- Wrong path: {{...}}
- Correct path: {{...}}
- Verification: {{...}}

**§3. {{SCENARIO_TITLE}}** — {{...}}

**§4. {{SCENARIO_TITLE}}** — {{...}}

**§5. {{SCENARIO_TITLE}}** — {{...}}

<!-- guidance: scenarios are the deliverable's regression suite. Pick scenarios that stress the BLOCKER questions in §5. Include at least one edge case where the *correct* behavior is "do nothing / stay on current path / refuse to act". -->

---

## 8. Deliverable format (exact structure, hard ceilings)

<!-- Purpose: per artifact, path + line ceiling + required section list. Ceilings are mandatory. Budget: ~8-20 lines per artifact. -->

Save artifacts at exactly these paths + line ceilings. Cutting prose before exceeding ceiling is mandatory.

### Artifact 1 — {{ARTIFACT_1_NAME}}

**Path**: `{{ABSOLUTE_TARGET_PATH}}`
**Line ceiling**: **{{N}} lines hard**
**Required sections (exact order)**:

1. {{SECTION_TITLE}} — {{ONE_LINE_PURPOSE_AND_FORMAT}}
2. {{SECTION_TITLE}} — {{...}}
3. {{SECTION_TITLE}} — {{...}}
<!-- guidance: every section name maps to a Q in §5 OR to a cross-cutting requirement in §9-§11. -->

### Artifact 2 — {{ARTIFACT_2_NAME}}

**Path**: `{{ABSOLUTE_TARGET_PATH}}`
**Line ceiling**: **{{N}} lines hard**
**Required sections**: {{...}}

### Artifact 3 — {{ARTIFACT_3_NAME}}

**Path**: `{{ABSOLUTE_TARGET_PATH}}`
**Line ceiling**: **{{N}} lines hard**
**Required sections**: {{...}}

<!-- guidance: 2-5 artifacts is typical. Total ceiling across all artifacts should reflect 3-6 hours of agent runtime including verification. Over-budget triggers a scope cut, not a ceiling raise. -->

---

## 9. Quote library requirement

<!-- Purpose: minimum count of verbatim source quotes + format. Typical: ≥6 quotes in the primary artifact. Budget: ~6 lines. -->

{{ARTIFACT_HOLDING_THE_QUOTES}} carries a dedicated final section "**Quote library — source excerpts**" with ≥{{MIN_QUOTES}} verbatim quotes anchoring load-bearing definitional claims. Format per quote:

```
> [verbatim source text]
— Source §{section}, lines {start-end}, subtopic: {capability or concept name}
```

The {{MIN_QUOTES}}-quote minimum anchors the BLOCKER Q's evidence base. Paraphrase of load-bearing definitions = Gate 8 fail.

---

## 10. Cross-reference index

<!-- Purpose: every load-bearing claim that sources back to another artifact must link via relative path. No duplication; reference is the rule. Budget: ~5 lines. -->

In Artifacts 2+, every claim that sources back to Artifact 1 must link explicitly via relative path (e.g., `[capability matrix](../path/to/artifact-1.md#section-anchor)`). No duplication of Artifact 1 content across siblings; cross-reference is the rule.

---

## 11. Uncertainty log (per artifact)

<!-- Purpose: each artifact ends with ≥3 entries — source-silent questions, version-staleness risks, single-source claims, project-context gaps. Budget: ~8 lines. -->

Each artifact ends with `## Uncertainty log` containing **minimum 3 entries** drawn from:

- **Source-silent questions** — questions the primary source does not address but the deliverable touches.
- **Version-staleness risks** — claims resting on sources older than {{STALENESS_THRESHOLD}}.
- **Single-source claims** — flagged per Gate 6.
- **Project-context gaps** — plan tier / vendor confirmation / counsel review pending.
- **Artifact-specific gaps** — sections where the manifest under-specifies expected behavior.

Uncertainty is a deliverable, not a failure.

---

## 12. "What I don't know" prompt-back

<!-- Purpose: explicit questions to the human operator before downstream action. Budget: 4-6 questions. -->

Close execution with explicit prompt-back to {{HUMAN_OPERATOR}}:

- {{QUESTION_1_ABOUT_PLAN_TIER_OR_PLATFORM_OR_BUDGET}}
- {{QUESTION_2_ABOUT_SCOPE_EDGES}}
- {{QUESTION_3_ABOUT_INTEGRATION_WITH_EXISTING_SKILLS_OR_RULES}}
- {{QUESTION_4_ABOUT_LANGUAGE_MODE_OR_REGULATED_OUTPUT}}
- {{OPTIONAL_QUESTION_5}}
- {{OPTIONAL_QUESTION_6}}

<!-- guidance: these are the questions whose answers would change the deliverable. The operator answers before any downstream commit. See KB-04 §5.4 for why this section is load-bearing. -->

---

## 13. Out of scope (strict — do not drift)

<!-- Purpose: explicit list of what NOT to drift into. Budget: 5-10 bullets. -->

- **{{OUT_OF_SCOPE_1}}** — {{ONE_LINE_REASON}}.
  <!-- example: "Third-party tool comparisons — project lock confines analysis to the chosen stack." -->
- **{{OUT_OF_SCOPE_2}}** — {{ONE_LINE_REASON}}.
- **{{OUT_OF_SCOPE_3}}** — {{ONE_LINE_REASON}}.
- **{{OUT_OF_SCOPE_4}}** — {{ONE_LINE_REASON}}.
- **{{REGULATED_LANGUAGE_GENERATION}}** — leave `""` + flag for downstream handoff per project lock.
- **Rewriting source KBs** — they are inputs, not outputs. Reference, never modify.

---

## 14. Success criteria (agent self-scores before returning)

<!-- Purpose: checklist of every deliverable ceiling, every gate, every scenario verification, every cross-reference, every quote requirement. Budget: 15-25 items. -->

- [ ] All {{N}} artifacts exist at specified paths with ≤ line ceiling
- [ ] Every load-bearing claim footnotes a primary source (Gate 1)
- [ ] Every BLOCKER question in §5 has a concrete answer landing in a named artifact section
- [ ] All §7 domain scenarios validated (every deliverable passes all)
- [ ] {{N}}-dimension capability matrix / ranked table / decision rubric resolved with no blank cells (if applicable)
- [ ] Every artifact has Uncertainty log ≥3 entries
- [ ] "What I don't know" prompt-back delivered
- [ ] Quote library ≥{{MIN_QUOTES}} verbatim source excerpts in {{ARTIFACT_HOLDING_THE_QUOTES}}
- [ ] All 8 anti-hallucination gates passed per load-bearing finding
- [ ] Zero prose filler — every line earns its place
- [ ] Zero duplication across artifacts — cross-reference via relative path
- [ ] {{REGULATED_LANGUAGE}} customer-facing copy = zero (stubs only)
- [ ] {{PROJECT_RULE_SYNC_REQUIREMENT_IF_APPLICABLE}}
- [ ] No scope creep beyond the {{N}}-artifact deliverable
- [ ] {{SUMMARY_LINE_COUNT}}-line summary for {{HUMAN_OPERATOR}} produced: what shipped (absolute paths) + what to review first + what to commit + refresh-cadence reminder
- [ ] Commit protocol drafted ({{COMMIT_FLOW_COUNT}} flows: {{FLOW_LABELS}})

<!-- guidance: the agent runs this checklist as its own last step before declaring done. Each unchecked item is a defect. -->

---

## Notes for the architect-prompt writer

- **Hard ceilings come from §8 / §11 / §14 working together.** Cut weakest prose first when a ceiling pinches.
- **§5 question count discipline matters.** Too few BLOCKER questions = the prompt is missing constraints; too many = the deliverable becomes a report instead of an artifact bundle. 3-5 is the sweet spot.
- **§7 scenarios are the regression suite.** Pick scenarios that stress the BLOCKER Qs in §5. Include at least one "do nothing / stay on path / refuse" case.
- **§12 prompt-back saves rework.** Ambiguities surfaced here resolve before commit; ambiguities discovered post-commit cost a revert.
- **When to skip a section**: §6 can be 2 lines ("apply 8-gate framework per KB-04 §3.1") if the agent has internalized the gates. §10 can be omitted for single-artifact deliverables.

For full depth on each section's purpose and failure modes, read [KB-04 §5](<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md#5-pillar-4--the-14-section-architect-prompt). For a worked example at production rigor, see [the private lab's worked instance (not shipped)](the private lab's worked instance — not shipped in this snapshot).
