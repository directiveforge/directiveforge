---
name: trademark-clearance
description: Run a trademark knockout pass on a shortlist — classify each name on the Abercrombie distinctiveness spectrum, identify the Nice classes the business touches, search USPTO/EUIPO/WIPO for exact and phonetic conflicts, apply likelihood-of-confusion reasoning, and flag likely descriptiveness refusals. Use this skill when the user asks "is it clear", "trademark check", "can we register this", "is it taken". The agent performs the automated knockout only; a registrability/infringement opinion ALWAYS requires a human attorney before filing.
severity: BLOCKER
confidence: 0.7
surface: Cowork-or-Code
---

# Trademark Clearance Skill

> **Trigger**: A shortlist needs a legal sanity check before money is spent on domains, design, or filing. The default failure this prevents: the agent asserting a name is "registrable" or "clear" — a legal conclusion the model is not licensed or competent to give.

## What this skill produces

A per-candidate trademark-risk rating (Clear / Caution / Blocked), an Abercrombie classification, the Nice class list the business touches, and a mandatory hand-off note: an attorney opinion is required before any filing. The output is a *knockout* (first-pass risk triage), never a clearance.

## Before invoking — mandatory reads

1. `knowledge-base/KB-07-BRAND-NAMING.md` §6 (Abercrombie spectrum; DuPont/Sleekcraft likelihood-of-confusion factors; Nice classification; genericide; Madrid Protocol; 2025 fee restructure).
2. KB-07 §1 finding 1 — coined/fanciful and arbitrary marks are the most defensible (and, contra myth, often cheaper to build). This is the strategic lens for ranking risk.
3. KB-07 §13 quotes 8-10 (the verbatim Abercrombie + DuPont language) and §10 genericide losses (aspirin / escalator / thermos / cellophane).

## Procedure

1. **Classify each candidate on the Abercrombie spectrum.** Generic → descriptive → suggestive → arbitrary → fanciful. Generic is never protectable; descriptive needs secondary meaning (likely §2(e)(1) refusal); suggestive/arbitrary/fanciful are inherently distinctive. Coined/arbitrary score lowest-risk.
2. **Identify the Nice classes the business touches** (from the brief — e.g., 9 software, 42 SaaS, 35 retail, 25 apparel, 41 education, 43 food, 5 pharma). Clearance in one class does NOT protect another.
3. **Knockout-search USPTO / EUIPO / WIPO** for exact + phonetic equivalents in those classes, using live search tools (USPTO search system, EUIPO eSearch, WIPO Global Brand Database) plus common-law/web/domain checks.
4. **Apply DuPont / Sleekcraft reasoning.** Flag a conflict where a similar mark covers the same/related goods in overlapping channels such that consumers would assume a common source. Note: similarity is judged on appearance, sound, connotation, and commercial impression.
5. **Flag likely descriptiveness refusals** (§2(e)(1)) and any genericide exposure for category-defining names.
6. **Output a risk rating + the mandatory attorney gate.** Clear / Caution / Blocked per candidate per class — and an explicit statement that a human attorney must give the registrability + infringement opinion before filing.

## Output format

```markdown
| Candidate | Abercrombie | Nice classes | USPTO | EUIPO | WIPO | Phonetic conflicts | Risk |
|-----------|-------------|--------------|-------|-------|------|--------------------|------|
| Vircel | fanciful | 9, 42 | none live | none | none | "Vercel" (cl. 42) ⚠ | Caution |

Likely §2(e)(1) descriptiveness refusals: …
Genericide exposure (category-defining names): …
> NOT LEGAL ADVICE. This is an automated knockout. A licensed attorney must
> provide the registrability + infringement opinion before any filing.
```

Worked example shape: a coined candidate classifies as *fanciful* (strongest), returns no live USPTO/EUIPO mark in classes 9 and 42, but a phonetic near-neighbor in class 42 flags it Caution — routed to an attorney with the conflict cited, not declared clear by the agent.

## Anti-patterns

- **Asserting "registrable" / "clear" without an attorney.** A legal conclusion outside the model's competence. The output is always a knockout + an attorney gate (KB-07 §6 stage 3).
- **Ignoring phonetic and translation equivalents.** Likelihood-of-confusion turns on sound and connotation, not spelling — a "sound-alike" in the same class is a real flag.
- **Single-class tunnel vision.** Searching only one Nice class when the business spans several leaves the brand exposed; file in every class it touches.

## Gotchas

- **The knockout is a first pass, not a full search.** A clean knockout still needs a comprehensive paid search (phonetics, translations, design marks, state/common-law) before high-stakes filing.
- **Genericide is terminal and self-inflicted.** Category-defining brands lose protection when the public uses the mark as the noun; advise adjective-+-generic-noun usage ("Xerox® copies") early.
- **2025 fee landscape shifted.** USPTO base is $350/class (Jan 18 2025); Madrid §66(a) rose to $600/class (Feb 18 2025). Re-verify fees quarterly — they are still settling (§6 / KB-VIGILANCE).

## When NOT to use

- **As a replacement for legal counsel — ever.** This skill triages; the attorney opinion stage is always human.
- **For pure availability questions** (domains/handles) with no registration intent — route to `availability-gate` instead.

## References

- KB-07: `knowledge-base/KB-07-BRAND-NAMING.md` §6 (clearance + spectrum + Madrid + fees), §1 finding 1, §10 (genericide), §13 quotes 8-10, §12 Skill 4.
- Primary sources: *Abercrombie & Fitch Co. v. Hunting World*, 537 F.2d 4 (2d Cir. 1976); *In re E.I. du Pont* 476 F.2d 1357; *AMF v. Sleekcraft* 599 F.2d 341; USPTO 2025 fee rules; WIPO Madrid System.
- Sibling skills:
  - `name-generation` — upstream; supplies ungated candidates.
  - `availability-gate` — parallel gate (domains/handles); run both, since registry-availability ≠ trademark-clearance.
  - `name-scorecard` — consumes the legal-defensibility score (§8 rubric, 25 pts default — the heaviest weight).
