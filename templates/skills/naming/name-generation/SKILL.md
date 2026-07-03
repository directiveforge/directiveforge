---
name: name-generation
description: Produce actual name candidates in high volume across multiple linguistic techniques and metaphor domains — the divergent brainstorm stage — then hand EVERYTHING to the gating skills, never presenting any candidate as "available" or "clearable". PRECONDITION — fires only when a naming brief already exists (or the message itself carries explicit constraints — territory, positioning, audience, target sound) AND the user wants candidates now — "generate names against this brief", "give me 30 options for [defined territory]", "brainstorm candidates". If NO brief or equivalent constraints exist yet, do NOT generate — route to the naming-brief skill first to define requirements, then come back here. Critical guardrail — LLMs systematically over-produce names that are already taken or belong to real companies, so this skill is forbidden from making any availability, trademark, or clearance claim; that is the downstream gates' job.
severity: HIGH
confidence: 0.65
surface: Chat-or-Code
---

# Name Generation Skill

> **Trigger**: A completed `naming-brief` exists and the user wants candidates. The default failure mode this skill exists to prevent: the agent generates 10 names and asserts which `.com`s are "free" — both the volume (too low) and the claim (hallucinated) are wrong.

## What this skill produces

A large, deduplicated candidate list (≥200 for a serious project) with NO quality ranking and NO availability/trademark claims — explicitly labelled "ungated, must pass linguistic-screen + trademark-clearance + availability-gate". Generation is the divergent phase; judgment is banned here by design.

## Before invoking — mandatory reads

1. `knowledge-base/KB-07-BRAND-NAMING.md` §3 (Generation Strategies — the name-type taxonomy + the governing principle: *separate creation from evaluation*).
2. KB-07 §2 (the technique/criterion catalog, rows 1-8 are generation techniques: morphological recombination, classical-root mining, sound-symbol seeding, metaphor mining, blend/portmanteau, semantic-field mapping, real-word arbitrary, mash-up/affix).
3. KB-07 §1 findings **6 and 7** — naming is a volume game (Lexicon generates 1,000-3,000+ to find one survivor; ~90% vaporized by filters) AND *LLMs systematically over-produce already-taken names* (every candidate MUST be gated). Finding 7 is the reason this skill makes zero availability claims.

## Procedure

1. **Load the brief JSON.** Pull `target_sound`, `personality`, `name_types.in/out`, `connotations`, and `category`. Generation is steered by the sound target — not by what's "available".
2. **Generate across ≥5 techniques and ≥3 metaphor domains (§2 / §3).** Mix coined (morphological recombination, classical roots, blends), arbitrary real-word repurposing, compounds, and metaphor mining. Use the three-team trick from §3 if helpful: name as if for a competitor, and as if for an unrelated category (e.g., "a bike"), then pull the strongest forms back.
3. **Ban self-evaluation during generation.** Do not stop to judge, screen, or reject mid-flow. Quantity now; quality later. Target ≥200 candidates for a serious project; scale down only for explicit small-budget sprints.
4. **Apply availability *heuristics* (not checks).** Bias the set toward open-name shapes: 2-3 syllables, uncommon letter patterns, compounds, coined forms (§2 row 14). This raises the downstream pass rate — it is NOT an availability claim.
5. **Deduplicate and flag obvious real-company collisions.** Remove near-duplicates; tag candidates that are obviously an existing well-known brand ("Apple", "Nike") as `likely-collision` — but do not assert clearance either way.
6. **Hand the entire list to gating.** Output with an explicit banner that no candidate has been checked for language, trademark, or availability. Never sort by "best" and never say a domain is free.

## Output format

A plain candidate list grouped by technique, with a mandatory header line:

```markdown
> UNGATED CANDIDATES — no language, trademark, domain, or availability claim has been made.
> Every name below must pass: linguistic-screen → trademark-clearance → availability-gate → name-scorecard.

### Coined / morphological (n=…)
- …
### Arbitrary real-word (n=…)
- …
### Compound (n=…)
- …
### Metaphor / evocative (n=…)
- …
[flagged] likely-collision: …, …
```

Worked example shape: a brief with `target_sound: ["fast","light"]` yields front-vowel coined forms, light-consonant blends, and speed-metaphor real words across 200+ entries — passed wholesale to `linguistic-screen` with no claim about which are takeable.

## Anti-patterns

- **Presenting candidates as available or clearable without tool checks.** The single most damaging LLM naming failure (KB-07 §1 finding 7, §11). This skill is structurally forbidden from saying "this .com is free" or "this is trademark-clear". Route those claims to `availability-gate` / `trademark-clearance`.
- **Self-censoring volume to a "safe" handful.** Ten polished names is not generation; it's premature evaluation. Hit the volume target.
- **Judging during generation.** Mixing the divergent and convergent phases collapses the candidate space toward the comfortable and forgettable.

## Gotchas

- **The model's "I'm pretty sure that's available" instinct is a hallucination, not knowledge.** Suppress it. Generation never touches a registry or TM database.
- **Coined ≠ harder to build.** Don't bias away from invented names on a false "it costs more" belief (§1 finding 1, Placek) — coined/arbitrary are the most defensible AND often cheaper to build.
- **Over-used affix patterns** (-ly, -ify, e-, i-) read as dated and crowd the TM space; generate them sparingly and expect heavy downstream attrition.

## When NOT to use

- **No brief or explicit constraints yet** — if the user wants a name but the territory, positioning, audience, and target sound are undefined, there is nothing to steer generation. Route to `naming-brief` first, then return here.
- **Mandated founder/place/equity names** — there is nothing to generate; skip to screening + clearance on the fixed name.
- **Tiny-budget 20-candidate sprints** where the user explicitly wants a quick handful — still ban availability claims, just lower the volume target.

## References

- KB-07: `knowledge-base/KB-07-BRAND-NAMING.md` §3 (generation), §2 (technique catalog), §1 findings 1/6/7, §12 Skill 2.
- Primary sources: David Placek / Lexicon Branding (1,000-3,000+ candidates; ~90% attrition; three-team method); Klink 2000 & Yorkston & Menon 2004 (sound-symbol seeding).
- Sibling skills:
  - `naming-brief` — upstream; supplies the steering JSON.
  - `linguistic-screen`, `trademark-clearance`, `availability-gate` — the mandatory downstream gates that turn ungated candidates into survivors.
