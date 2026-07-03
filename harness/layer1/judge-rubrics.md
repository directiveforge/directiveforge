# Layer 1 — Judge Rubrics (implements L1.2 trigger + L1.4 rubric)

> Metrics: **L1.2 Trigger precision/recall/F1** and **L1.4 Judge rubric scores** per
> HARNESS-SPEC §4. Models fixed by spec §3: router-sim = Haiku (`claude-haiku-4-5`); prompt
> author + rubric judge = Opus 4.8 (`claude-opus-4-8`). Calibration re-judge (Fable 5) is §6 —
> not run here. Threats to validity: HARNESS-SPEC §4 L1.2/L1.4. Do not restate.
>
> Serialize per §10. Letter grades are NOT computed here (deferred to `SCORECARD-FORMAT.md`).

---

# Protocol 1 — Trigger test (L1.2)

Three dispatches per pack. The catalog = the `name:` + `description:` frontmatter of ALL
installed skills in the pack under test (this is what a real router sees — spec §4 L1.2).

## 1a. PROMPT-AUTHOR dispatch (Opus, one call per skill)

```
You are the PROMPT-AUTHOR for L1.2 of the v0.18.0-H harness. Model: Opus 4.8.
INPUT: the full skill catalog (name+description of every installed skill in the pack), and
ONE target skill (its SKILL.md, including its "When NOT to use" section).

Write EXACTLY 10 synthetic user prompts — realistic first-person messages a user would type:
  - 5 POSITIVE (expected "target"): should fire the target skill.
  - 5 NEGATIVE:
      - 2 NEAR-MISS: should fire a DIFFERENT, adjacent skill drawn from THIS catalog
        (expected "other"). Name a plausible sibling from the catalog for each.
      - 2 UNRELATED-DOMAIN (expected "none"): outside every skill in the catalog.
      - 1 WHEN-NOT (expected "none" or "other" per the case): drawn from the target skill's
        own "When NOT to use" list — paraphrased into a user message.

PARAPHRASE RULE (anti-overfit, spec §4 L1.2): NEVER quote the target description's trigger
phrases verbatim. Rephrase intent in the user's own words. If your prompt reuses a ≥4-word
span from any description, rewrite it.

OUTPUT: a JSON array, one object per prompt, no prose around it:
[{"id":"<skill>-p1","text":"...","expected":"target|none|other","rationale":"..."}]
Exactly 10 objects: 5 target, then near-miss/unrelated/when-not as above.
```

Prompt sets are committed with results and **reused verbatim on re-runs** (spec §4 L1.2, §7.2).

## 1b. ROUTER-SIM dispatch (Haiku, one call per prompt)

```
You are a skill ROUTER. Model: Haiku 4.5. You see the installed skill catalog and ONE user
message. Decide which single skill (if any) should activate.
CATALOG:
<name + description frontmatter of every installed skill, verbatim>
USER MESSAGE:
<one prompt text>
OUTPUT: exactly one line — a single skill name from the catalog, or the literal word: none
No reasoning, no punctuation, no explanation. One token/name only.
```

Run once per prompt. Record the raw returned name. One prompt = one call = one router output.

## 1c. Scoring formulas (exactly per spec §4 L1.2)

Per skill, over its 10 prompts, let the target skill = T:

- **TP** = positives (expected `target`) where router returned T.
- **FP** = negatives (expected `none` or `other`) where router returned T.
- **FN** = positives where router returned anything other than T (a sibling name, or `none`).
- **Precision** = `TP / (TP + FP)` — if `TP+FP = 0`, precision is undefined; record `null` and
  note "target never fired" (do not coerce to 0 or 1).
- **Recall** = `TP / 5` (5 positives per skill, per spec).
- **F1** = `2·P·R / (P+R)` — if P is `null` or `P+R = 0`, F1 = `null`.
- **Pack micro-average:** sum TP, FP, FN across all skills in the pack, then compute one
  precision/recall/F1 from the pack totals (micro, not macro).

**Confusion detail (mandatory, spec §4 L1.2):** for every prompt where the router returned a
skill ≠ T on a negative, or `none`/sibling on a positive, record WHICH skill fired. This is the
per-skill confusion column — it tells us if `pre-mortem` prompts are leaking to `steelman`.

## 1d. Serialization — metric L1.2

```json
{
  "metric": "L1.2", "pack": "decision", "spec_version": "1.0",
  "models": {"author": "claude-opus-4-8", "router": "claude-haiku-4-5"},
  "per_skill": [
    {"skill": "pre-mortem", "TP": 5, "FP": 0, "FN": 0,
     "precision": 1.0, "recall": 1.0, "f1": 1.0,
     "confusion": [{"prompt": "pre-mortem-n1", "expected": "other", "fired": "steelman"}]}
  ],
  "pack_micro": {"TP": 58, "FP": 4, "FN": 2, "precision": 0.935, "recall": 0.967, "f1": 0.951}
}
```

Raw router outputs (one per prompt) commit under `harness/results/<run>/l1.2/`. Proportions are
raw, unrounded (§2.1). Weak scores publish as defects (§2.3).

---

# Protocol 2 — Rubric judgment (L1.4)

Anchored 1–5 rubric, 4 dimensions (spec §4 L1.4): **actionability**, **scope calibration**,
**failure-content quality**, **constraint explicitness**. One rubric table per artifact class.
The score-1 and score-3 anchors each cite a concrete documented defect class (frozen at this
spec's commit, before scoring):

> Defect classes (cite verbatim): **dead-asset** (rule with empty description+globs+
> alwaysApply:false — can never attach), **placeholder-riddled** file, **unqualified-Bash** agent
> grant, **two-sentence agent role**, **skill-without-Gotchas**, **orchestrator-style skill**
> (dispatches other skills instead of doing one job).

## 2a. Rubric — SKILL class

| Dim | 1 (anchor) | 3 (anchor) | 5 |
|---|---|---|---|
| Actionability | Prose only; no numbered DO steps — reads like an essay | Numbered steps exist but ≥half are vague ("consider X"); like a **skill-without-Gotchas**, form present, substance thin | Every step is a concrete DO/DON'T with a checkable outcome |
| Scope calibration | **Orchestrator-style skill**: dispatches ≥2 other skills, does no work itself | Does one job but bleeds into a sibling's territory (overlapping triggers) | One job, crisp boundary, routes-out cleanly in When-NOT |
| Failure-content quality | No Gotchas and no Anti-patterns (**skill-without-Gotchas**) | Gotchas present but generic ("be careful with edge cases") | ≥2 Gotchas + Anti-patterns, each naming a specific failure + fix |
| Constraint explicitness | No numbered Procedure; no When-NOT | Steps numbered but When-NOT missing or one-liner | Numbered Procedure + explicit When-NOT with named routes |

## 2b. Rubric — RULE class

| Dim | 1 (anchor) | 3 (anchor) | 5 |
|---|---|---|---|
| Actionability | Tutorial/explanation, zero DO/DON'T imperatives | Mixes rules with prose; **placeholder-riddled** unfilled `{{...}}` in an install | Tight DO/DON'T list, each line an imperative |
| Scope calibration | **Dead-asset**: empty description+globs+alwaysApply:false — attaches to nothing | Over-broad globs or over-ceiling (domain >40 lines) → padding | Correct ceiling, globs match real paths, one domain |
| Failure-content quality | No constraints, no pitfalls named | Names constraints but no consequence/rationale | Hard constraints with the failure they prevent |
| Constraint explicitness | No NEVER/hard-constraint anywhere | Some NEVERs, but package-manager/secret rules absent | Explicit NEVER set incl. secrets + package-manager guard |

## 2c. Rubric — AGENT class

| Dim | 1 (anchor) | 3 (anchor) | 5 |
|---|---|---|---|
| Actionability | No Protocol/steps — just a role blurb | Protocol present but Output Format missing | Numbered Protocol + defined Output Format |
| Scope calibration | **Two-sentence agent role** — scope undefined, over-reaches | One-sentence role but Scope section absent (implicit over-reach) | One-sentence role + explicit Scope ("review ONLY what changed") |
| Failure-content quality | No review checklist / no failure taxonomy | Checklist present but no severity tiers | Checklist + severity-tagged output tiers |
| Constraint explicitness | **Unqualified-Bash** grant, or no Constraints section | Constraints exist but tool grant not least-privilege | NEVER/ALWAYS + least-privilege tools; every Bash grant names command families |

## 2d. Rubric — COMMAND class

| Dim | 1 (anchor) | 3 (anchor) | 5 |
|---|---|---|---|
| Actionability | No numbered steps; ambiguous "you could" branches | Numbered but a step references an undefined command | Sequential numbered steps, each a runnable action |
| Scope calibration | Does five unrelated jobs in one command | One job but no stated precondition/exit | One job, stated precondition + done-state |
| Failure-content quality | No failure/rollback handling mentioned | Mentions failure but no recovery step | Names failure modes + recovery/rollback step |
| Constraint explicitness | No guardrails (destructive ops unguarded) | Some guardrails, but not on the destructive step | Explicit guard on every destructive step |

## 2e. Judge dispatch (Opus, ONE artifact per judgment)

```
You are the L1.4 RUBRIC JUDGE. Model: Opus 4.8. Judge ONE artifact against ONE rubric table.
INPUT: the artifact's full text, its class, and the class rubric (2a-2d) verbatim in context.
RULES:
  - Score each of the 4 dimensions 1-5 using the anchors. The 1 and 3 anchors name real defect
    classes — if the artifact matches an anchor's defect, that IS the score.
  - You MUST quote verbatim evidence (exact line(s) from the artifact) for EVERY dimension score.
    A score without a quote is invalid — re-do it.
  - No leniency inflation. A well-formed but generic artifact scores 3, not 5.
OUTPUT JSON only:
{"artifact":"<path>","class":"skill|rule|agent|command",
 "scores":{
   "actionability":{"score":N,"evidence":"<verbatim line>"},
   "scope_calibration":{"score":N,"evidence":"<verbatim line>"},
   "failure_content_quality":{"score":N,"evidence":"<verbatim line>"},
   "constraint_explicitness":{"score":N,"evidence":"<verbatim line>"}},
 "notes":"<one line, optional>"}
```

## 2f. Serialization — metric L1.4

Emit one judge object per artifact (the JSON above). Pack roll-up = mean per dimension across
artifacts + overall mean; report as raw means with n:

```json
{"metric":"L1.4","pack":"decision","spec_version":"1.0","judge":"claude-opus-4-8","n":12,
 "per_dimension_mean":{"actionability":4.3,"scope_calibration":4.6,
   "failure_content_quality":4.1,"constraint_explicitness":4.5},
 "overall_mean":4.375,
 "artifacts":[ /* the per-artifact judge objects above */ ]}
```

Every mean carries `n` (§2.1). Fable §6 re-judge (10% subsample, cap 15) and the published
exact-/±1-agreement rate are computed by the calibration step, NOT here — this doc only emits
the Opus judgments the calibrator consumes. Weak scores publish as defects, never tuned (§2.3).
