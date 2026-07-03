---
name: naming-brief
description: Run a structured intake at the START of a naming effort when no brief exists yet — capture strategy, target audience, the "target sound", markets/languages, must-clear Nice classes, and domain flexibility, then lock the success criterion as "is it right?" not "do I like it?". PRECONDITION — fires when the user wants to begin naming (or rebranding) but the requirements, constraints, and territory are not yet defined — "we need a name for X, where do we start", "help me define what the name should do", "name my product/company", or jumps to brainstorming before any brief is written. This skill does NOT produce candidate names itself — it defines the requirements and then explicitly hands off to the name-generation skill once the brief exists. It is the upstream gate for the whole naming pipeline; every downstream skill consumes its output.
severity: MEDIUM
confidence: 0.8
surface: Chat-or-Code
---

# Naming Brief Skill

> **Trigger**: A user wants to name (or rename) a brand, product, or company and has no written brief — or is about to start generating names from a one-line prompt. The tell is naming intent without a captured strategy, audience, sound target, market list, or legal scope.

## What this skill produces

A filled creative brief in two forms: a human-readable markdown brief (the 14-field template from KB-07 §11) and a machine-readable JSON object that `name-generation`, `linguistic-screen`, `trademark-clearance`, and `availability-gate` all consume directly. The brief locks the decision rule up front — "is it right?" — so a later committee can't quietly swap in "do we like it?".

## Before invoking — mandatory reads

1. `knowledge-base/KB-07-BRAND-NAMING.md` §11 (the end-to-end pipeline + the copy-ready 14-field brief template — this is the spine of the skill).
2. KB-07 §1 (Executive Distillation) — internalize two findings before intake: the single biggest amateur mistake is letting exact-match .com availability drive the name, and validating by "do I like it?" in a group. Both must be designed out in the brief.
3. KB-07 §9 (Validation) — so the success-criteria question (#14) is framed as fit/risk, not appeal.

## Procedure

1. **Walk the 14 brief questions (§11) in order.** Company/product + one-liner; category + 5 competitor names; positioning ("the zag"); audience; 3-5 personality adjectives; target SOUND; desired connotations/imagery; name types in/out of scope; markets & languages; must-clear Nice classes + geographies (Madrid?); domain/handle requirements; constraints/no-go words; decision-makers + timeline; success criteria.
2. **Force a target-SOUND answer (#6).** "Imagine the sound of your brand before you start naming. Should it sound fast? full? reliable? soft? premium?" (Placek). A brief without a sound target produces unsteerable generation. Do not let the user skip this.
3. **Lock the success criterion as "is it right?" (#14).** If the user answers "we'll know it when we like it", correct it explicitly: the brief commits the project to fit + risk clearance, not group appeal. Cite Watkins (§9) if they push back.
4. **Capture markets, languages, and scripts precisely (#9).** These feed `linguistic-screen` — list dialects and writing systems (Cyrillic / Armenian / CJK / Arabic), not just "global".
5. **Capture Nice classes + geographies (#10).** Which of the 45 classes does the business actually touch? This scopes `trademark-clearance` and any Madrid filing.
6. **Capture domain/TLD flexibility (#11) — and pre-empt the .com trap.** Record whether an exact-match .com is a hard must-have or flexible. Default the user toward flexible (Placek: the .com is "just an area code"); a hard .com requirement should be a conscious, documented choice.
7. **Emit the brief (markdown) + JSON, then confirm.** Read the restatement back; get explicit sign-off before any generation begins.

## Output format

Markdown brief (the §11 template, all 14 fields filled) followed by a fenced JSON block, e.g.:

```json
{
  "product": "…", "category": "…", "competitors": ["…"],
  "positioning": "…", "audience": "…", "personality": ["…","…","…"],
  "target_sound": ["fast","light"], "connotations": ["…"],
  "name_types": {"in": ["coined","compound"], "out": ["founder"]},
  "markets": [{"country":"…","languages":["…"],"scripts":["Latin","Cyrillic"]}],
  "nice_classes": [9, 42], "madrid": true,
  "domain": {"must_have_tld": null, "flexible": true},
  "no_go_words": ["…"], "decision_makers": ["…"], "timeline": "…",
  "success_criterion": "is it right (fit + clearance), not do-I-like-it"
}
```

Worked example shape: a B2B SaaS brief locks `target_sound: ["crisp","short"]`, `nice_classes: [9,42]`, `domain.flexible: true`, scopes screening to EN + DE + JP, and records the "is it right" criterion — handing `name-generation` everything it needs to steer volume.

## Anti-patterns

- **Skipping the target sound.** The most common failure; without #6 generation is a random walk. The skill has failed if the brief ships without a sound target.
- **Accepting "do I like it?" as the success metric.** Quietly converts the project to consensus-comfort selection and pre-kills polarizing-but-strong names. Correct it in step 3, every time.
- **Letting an exact-match .com become a hard requirement by default.** Document it as a deliberate constraint if truly required; never let it silently narrow generation.
- **Vague market scope.** "Global" is not a screenable input. Force country + language + script lists.

## Gotchas

- **The JSON contract is load-bearing.** Downstream skills key off these field names — keep them stable. A renamed key silently breaks `linguistic-screen` (markets/scripts) and `trademark-clearance` (nice_classes).
- **Decision-makers (#13) is a sycophancy landmine.** A large approval committee predicts death-by-consensus. Flag it now and route the eventual selection through `name-scorecard` + KB-05 anti-sycophancy.
- **Brief depth scales with budget.** A 20-candidate internal sprint needs a 5-line brief; a serious launch needs all 14 fields. Match effort to stakes.

## When NOT to use

- **A brief (or explicit equivalent constraints) already exists** — the intake is done; producing actual name candidates is the `name-generation` skill's job. Do not re-run intake; hand off.
- **Trivial internal/codename projects** where a throwaway label suffices — don't impose a 14-field brief on a feature-flag name.
- **Mandated founder/place names or existing brand equity** — when the name is already decided by ownership or heritage, skip generation and go straight to `linguistic-screen` + `trademark-clearance` on the chosen name.

## References

- KB-07: `knowledge-base/KB-07-BRAND-NAMING.md` §11 (pipeline + brief template), §1 (executive distillation), §9 (validation), §12 Skill 1 (stub spec).
- Primary sources: Alexandra Watkins, *Hello, My Name Is Awesome* (the "is it right, not do I like it" rule); David Placek / Lexicon Branding (target-sound; ".com is just an area code").
- Sibling skills:
  - `name-generation` — the immediate downstream consumer of the brief JSON.
  - `name-scorecard` — selects the brief preset (Premium / Value / Global / Local / Online-first / B2C) whose weights this brief implies.
