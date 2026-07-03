# KB-07: Brand Naming — Generation, Screening, Legal & Digital Availability (2026)

> **Purpose**: Reusable doctrine for naming a brand, product, or company end-to-end — divergent generation, linguistic/phonetic screening, trademark clearance, and digital-availability gating — backed by primary sources (court opinions, USPTO/WIPO, peer-reviewed phonetics) and verified-vs-myth cautionary cases. Use this when the project's deliverable includes *naming or renaming* an entity (greenfield product, rebrand, naming agency, multi-SKU line).
>
> **Audience**: Founders, brand/marketing operators, and AI agents running a naming pipeline with live tools (RDAP/registrar APIs, USPTO/EUIPO/WIPO search, web search). The doctrine is domain-agnostic; the AI-execution notes assume an agent that can call those tools and knows when to hand off to a human (attorney opinion, non-Latin slang screening).
>
> **Companion**: KB-05 (Conversational Decision Engineering) supplies the anti-sycophancy + decision discipline that keeps a "do I like it?" naming committee from killing strong names — `name-scorecard` defers to it. The six installable skills that operationalize this doctrine ship under `templates/skills/naming/` (`naming-brief` → `name-generation` → `linguistic-screen` → `trademark-clearance` → `availability-gate` → `name-scorecard`); their spec lives in §12.
>
> **When to read (CONDITIONAL)**: This is an *optional domain pack*, not core kit doctrine — read it only when a project has a naming/branding deliverable, the same way KB-03 (catalog pipeline) is read only for data-pipeline projects. Skip entirely for app-code projects with no naming need. The generator (`generator/PROJECT_SETUP_PROMPT.md`) installs the naming skills only when Phase 1 detects a naming/branding need.
>
> **Provenance & freshness**: This document arrived synthesis-grade and is self-provenancing — §13 is the verbatim-quote appendix and §14 the methodology/limitations layer, so no separate `research/` dossier is split out. It carries fast-moving figures (USPTO fee restructure Jan 18 2025; Madrid §66(a) $500→$600 Feb 18 2025; .ai wholesale → $160/2yr Mar 5 2026; AEO/GEO discoverability). Treat every per-§ **Re-verification** tag as binding and re-check pricing/fee/AI-search claims **quarterly** (see KB-VIGILANCE / `vigilance/WATCHLIST.md`).

## Table of Contents
- §1 Executive Distillation
- §2 Naming Technique & Criteria Catalog (table)
- §3 Generation Strategies (detailed)
- §4 Linguistic & Phonetic Science
- §5 Cross-Language Screening Protocol (step-by-step, reusable, incl. non-Latin)
- §6 Trademark Clearance Protocol + Distinctiveness Spectrum
- §7 Digital Availability Gating Protocol (domains / handles / SEO / AI-search)
- §8 Weighted Scoring Rubric (+ tunable presets by brief)
- §9 Validation & Testing Methods
- §10 Failure Modes & Cautionary Cases (VERIFIED vs APOCRYPHAL)
- §11 End-to-End Process Pipeline + Creative-Brief Template
- §12 Skill-Stub Specs
- §13 Verbatim Quotes Appendix
- §14 Methodology & Limitations

---

## §1 Executive Distillation

The single biggest mistake amateurs make: letting domain availability (specifically the exact-match .com) drive the naming decision, and validating names by asking "do I like it?" in a group setting — both of which systematically kill strong, distinctive names in favor of comfortable, forgettable, or already-taken ones. Lexicon Branding founder David Placek states the .com "has become 'just an area code'"; Watkins warns that surveying everyone produces "a mediocre name that met with the least resistance rather than the very best name."

Highest-leverage findings:

1. **Coined/fanciful and arbitrary names are both the most legally defensible AND, contrary to popular belief, cheaper to build into brands.** The Abercrombie spectrum places fanciful/arbitrary marks at the strong, "prima facie registrable" end; Placek (Lexicon) adds that "invented names like Pentium actually take less money to build into brands than existing words—despite a common myth to the contrary." Effectiveness: **Transformative.** Confidence: **High (0.85).** Severity: HIGH. Re-verify: annual.
2. **Sound symbolism is real and measurable.** Front vowels (i/e) signal small/fast/light; back vowels (o/u) signal large/slow/heavy; the bouba/kiki effect replicates across 25 languages and 10 writing systems at 95–98% (Köhler 1929/1947; Ramachandran & Hubbard 2001; Ćwiek et al. 2022; Yorkston & Menon 2004; Klink 2000). Effectiveness: **Useful.** Confidence: **High (0.8).** Severity: MEDIUM. Re-verify: annual.
3. **Processing fluency predicts real outcomes.** Easier-to-pronounce stock names/tickers outperformed disfluent ones short-term (Alter & Oppenheimer 2006, PNAS). Effectiveness: **Useful.** Confidence: **Medium-High (0.7).** Severity: MEDIUM. Re-verify: annual.
4. **Most famous cross-language naming disasters are myths.** Chevy Nova is debunked (Snopes/NPR); but Mitsubishi Pajero, Honda Fitta, Vicks/Germany, and Mercedes "Bensi" are verified. You must screen — but cite verified cases, not legends. Effectiveness: **Transformative** (for skill accuracy). Confidence: **High (0.9).** Severity: HIGH. Re-verify: annual.
5. **Genericide is a real terminal risk.** Aspirin, escalator, thermos, cellophane all lost protection (court-verified). Effectiveness: **Situational** (only category-defining brands). Confidence: **High (0.9).** Severity: BLOCKER. Re-verify: annual.
6. **Naming is a volume game.** Lexicon generates 1,000–3,000+ candidates per project to find one survivor; ~90% are vaporized by legal/linguistic/strategy filters. Effectiveness: **Transformative.** Confidence: **High (0.85).** Severity: HIGH. Re-verify: annual.
7. **LLMs systematically over-produce already-taken names.** An AI naming agent MUST gate every candidate through live availability + TM checks. Effectiveness: **Transformative** (for AI implementation). Confidence: **Medium (0.6).** Severity: HIGH. Re-verify: quarterly.
8. **Domain TLD choice carries no SEO ranking weight.** Google treats new gTLDs the same as .com — "Keywords in a TLD do not give any advantage or disadvantage in search" (Google Search Central, 2015, reaffirmed). Effectiveness: **Useful.** Confidence: **High (0.85).** Severity: LOW. Re-verify: quarterly (fast-moving).
9. **The defensibility-vs-comprehension tradeoff is a genuine, unresolved expert conflict.** Lexicon/Neumeier favor coined-but-defensible; some marketers favor descriptive-but-instantly-understood. Resolve per-brief, not dogmatically. Confidence: **High (0.8)** that the conflict exists.

**What changed 2024→2026:**
- **USPTO restructured fees Jan 18, 2025** — a single base application fee of **$350/class** replaced the TEAS Plus ($250)/TEAS Standard ($350) tiers, with new surcharges ($100/class insufficient info; $200/class free-form goods description; $200 per extra 1,000 characters). The §66(a) Madrid US designation fee rose **$500→$600/class** effective Feb 18, 2025.
- **.ai exploded** — .ai crossed **1 million registrations on January 2, 2026** (up from 60,000 in 2022 and 354,000 in 2023, per Instant Domain Search), with Anguilla's government earning an estimated **$93 million** from .ai fees in 2025 (~47% of total government revenue). Wholesale rose to ~$160/2yr March 5, 2026.
- **AI search (AEO/GEO) emerged as a discoverability layer** — being cited in ChatGPT/Perplexity/Google AI Overviews answers is now a brand-visibility concern distinct from SEO (as of 2026; re-verify quarterly).

---

## §2 Naming Technique & Criteria Catalog

One row per generation technique and per evaluation criterion.

| # | Name (technique/criterion) | What it is | When to use / weight | Procedure or test (steps) | Evidence (source) | Effectiveness | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | Morphological recombination | Combining roots/morphemes into a novel word | Coined names; tech/pharma | List root morphemes → recombine → screen pronounceability/TM | Lexicon (Dasani, "san"=health) | Transformative | High 0.8 |
| 2 | Classical-root mining | Latin/Greek roots carrying meaning | Premium, science, health | Map concept → Latin/Greek root → add affix | Lexicon (Pentium, "pent"=5) | Useful | High 0.8 |
| 3 | Sound-symbol seeding | Choosing phonemes for connotation | When an attribute (speed/size/luxury) matters | Pick target attribute → select front/back vowels & plosive/sonorant consonants | Klink 2000; Yorkston & Menon 2004 | Useful | High 0.8 |
| 4 | Metaphor mining | Borrowing a vivid image from another domain | Evocative/imagery names | Brainstorm adjacent domains → extract image words (BlackBerry, Amazon) | Lexicon; Watkins (SMILE-Imagery) | Useful | High 0.8 |
| 5 | Blend/portmanteau | Fusing two words at a phoneme boundary | Compact meaning (Microsoft, Pinterest, Groupon) | Identify 2 concept words → splice | Practitioner consensus | Useful | Medium 0.7 |
| 6 | Semantic-field mapping | Mapping all words around a concept | Generation volume | List category → synonyms, antonyms, associations | Lexicon "diamond" framework | Useful | Medium 0.7 |
| 7 | Real-word arbitrary repurposing | Common word, unrelated product | Strong TM (Apple, Outback) | Pick vivid common word unrelated to category | Abercrombie spectrum | Transformative | High 0.85 |
| 8 | Mash-up / affix systems | Prefixes/suffixes (-ly, -ify, -ster, e-, i-) | SaaS/consumer apps | Stem + productive affix → screen for over-used patterns | Practitioner consensus | Situational | Medium 0.6 |
| 9 | SMILE (Watkins) | Suggestive, Memorable, Imagery, Legs, Emotional | Shortlist evaluation (positive) | Score each candidate on 5 qualities | Watkins, *Hello, My Name Is Awesome* | Useful | Medium 0.65 |
| 10 | SCRATCH (Watkins) | 7 deal-breakers | Negative screen | Reject if Spelling-challenged / Copycat / Restrictive / Annoying / Tame / Curse-of-knowledge / Hard-to-pronounce | Watkins | Useful | Medium 0.65 |
| 11 | Neumeier 7 criteria | Distinctive, brief, appropriate, easy-spell/pronounce, likable, extendable, protectable | Holistic scorecard | Score 1–5 each | Neumeier, *The Brand Gap* | Useful | Medium 0.65 |
| 12 | Abercrombie distinctiveness | Legal strength spectrum | Every name (legal gate) | Classify generic→descriptive→suggestive→arbitrary→fanciful | *Abercrombie v. Hunting World* 537 F.2d 4 | Transformative | High 0.95 |
| 13 | Fluency/pronounceability | Ease of processing the name | Every name | Pronunciation test + syllable count | Alter & Oppenheimer 2006 (PNAS) | Useful | High 0.7 |
| 14 | Availability heuristics | Bias generation toward open names | AI generation | Prefer 2–3 syllables, uncommon letter patterns, compounds, coined forms | Author analysis + Placek | Situational | Medium 0.6 |

---

## §3 Generation Strategies (detailed)

**What it is.** Generation is the divergent phase of naming: producing a large volume of raw candidates before any judgment. The governing principle across leading firms is *separate creation from evaluation*.

**Why it matters.** Lexicon Branding — creators of Pentium, PowerBook, Swiffer, BlackBerry, Dasani, Sonos, Azure, Impossible Foods, Vercel — recommends generating "at least 1,000 creative ideas before selecting a shortlist of 50 to 100 candidates. (We usually generate thousands.)" Placek states: out of 3,000 ideas, "maybe 250 are diamonds worth polishing." The reason for the volume is downstream attrition: legal clearance, linguistic filters, and strategy criteria "will vaporize 90% of candidates." [single-source for the exact 90%/3,000 figures — Lexicon/Placek, corroborated directionally by the Stanford GSB Swiffer case and CNN profile]

**The name-type taxonomy (extends v1) with trademark-strength implications.** For each: definition, three real cross-domain examples, strengths/weaknesses, when to choose.

1. **Descriptive** — directly names a feature. Examples: Holiday Inn (hospitality), PayPal (fintech), Whole Foods (CPG/retail). *Strength:* instant comprehension. *Weakness:* weakest TM — refused under Lanham Act §2(e)(1) absent secondary meaning. *Choose when:* you have budget/time to build secondary meaning and value instant clarity (value/local brands).
2. **Suggestive** — hints at a benefit without describing it. Examples: Netflix (streaming), Airbus (aerospace/B2B), Citibank (banking). *Strength:* inherently distinctive AND meaningful; protectable. *Weakness:* the suggestive/descriptive line is litigated and fuzzy. *Choose when:* you want meaning + defensibility.
3. **Arbitrary** — real word, unrelated product. Examples: Apple (computers), Amazon (retail), Outback (Subaru SUV). *Strength:* strong TM, memorable, cheaper to build than myth holds. *Weakness:* no inherent category cue. *Choose when:* you can afford initial meaning-building.
4. **Fanciful/coined** — invented words. Examples: Pentium (chips), Kodak (film), Verizon (telecom), Häagen-Dazs (ice cream). *Strength:* strongest TM — "prima facie registrable"; signals "new/innovative." *Weakness:* zero free comprehension; must teach the word. *Choose when:* you're creating a new category (Placek: "Nobody loved mopping until P&G created the Swiffer").
5. **Compound** — two whole words joined. Examples: Facebook, PowerBook (Apple), Salesforce (B2B SaaS). *Strength:* meaning + often available .com via two-word combos. *Weakness:* variable TM strength.
6. **Blend/portmanteau** — fused fragments. Examples: Microsoft, Pinterest, Instagram. *Strength:* compact, often coined-strength. *Weakness:* spelling ambiguity.
7. **Metaphor/evocative** — image transfer. Examples: BlackBerry (phones), Amazon (vastness), Oracle (enterprise). *Strength:* high imagery (Watkins SMILE), memorable. *Weakness:* must fit positioning.
8. **Founder/place** — Examples: Ford, Tesla, Disney (founders); Nokia (town), Fuji (mountain). *Strength:* heritage/authenticity. *Weakness:* restrictive, weaker TM without secondary meaning.
9. **Acronym/initialism** — Examples: IBM, BMW, KFC, HSBC. *Strength:* compresses long names. *Weakness:* low imagery (SCRATCH "Curse of knowledge"); hard to build de novo.
10. **Onomatopoeia** — Examples: Schweppes (beverage), TikTok, Twitter. *Strength:* phonetically vivid, high imagery. *Weakness:* limited applicability.
11. **Foreign-borrowing** — Examples: Volvo ("I roll," Latin), Audi (Latin), Lego ("leg godt," Danish). *Strength:* meaning + distinctiveness. *Weakness:* MUST cross-language screen (see §5/§10).
12. **Real-word misspelling** — Examples: Flickr, Lyft, Froot Loops, Houzz. *Strength:* domain availability, distinctiveness. *Weakness:* SCRATCH "Spelling-challenged" — constant verbal correction.

**Concrete generation techniques used by working firms** (morphological recombination, root/affix systems, sound-symbol seeding, metaphor mining, semantic-field mapping, mash-ups, classical roots) are catalogued in §2 rows 1–8.

**Documented firm methods with sourced examples:**
- **Lexicon Branding** (David Placek, founded 1982, ~$8M annual revenue, ~$350B+ of products sold under Lexicon names): a three-team structure — one team knows the real brief, one believes it's naming a competitor, one names an unrelated category (e.g., "a bike"). Windsurf (formerly Codeium) "came from a team just listing 'flow' concepts, not thinking about IDEs at all." Combines small creative teams with structural linguistics and a global network of 100+ linguists across ~75 countries. Names: Pentium, PowerBook, Swiffer, BlackBerry, Dasani, Sonos, OnStar, Febreze, Outback, Zima, DeskJet, Navan. Early hires Will Leben (Stanford linguistics professor) and Bob Cohen built the linguistics model.
- **Eat My Words** (Alexandra Watkins): SMILE/SCRATCH framework; brief-first; rule: "don't ask 'do I like it?' but 'is it right?'" Names include Burger King's Mac 'n Cheetos, the Neato robotic vacuum, Spoon Me frozen yogurt.
- Catchword, Igor, A Hundred Monkeys, Operative Words (named in brief) practice similar generate-then-screen pipelines [practitioner category; not independently re-verified here].

**How to apply (step-by-step):**
1. Write a creative brief (see §11).
2. Define the target sound ("Imagine the sound of your brand before you start naming. Should your name sound fast? Full? Reliable?" — Placek).
3. Generate across ≥5 techniques and ≥3 metaphor domains; ban evaluation during generation.
4. Target 500–1,000+ candidates for a serious project (scale to budget).
5. Pre-filter with availability heuristics (2–3 syllables, compounds, uncommon letter patterns, coined forms) to bias toward open names.

**When NOT to use volume generation:** trivial internal projects; mandated founder-name/existing-equity names; tiny budgets where a 20-candidate sprint suffices.

**Effectiveness:** Transformative. **Confidence:** High (0.85). **Severity:** HIGH. **Re-verification:** annual.

---

## §4 Linguistic & Phonetic Science

**Sound symbolism / phonetic symbolism** — the non-arbitrary association between speech sounds and meaning.

- **Bouba/kiki effect.** Köhler (1929; 2nd ed. 1947, *Gestalt Psychology*) found people pair "takete"/"maluma" with jagged/round shapes. Ramachandran & Hubbard (2001, "Synaesthesia: A window into perception, thought and language," *Journal of Consciousness Studies* 8(12):3–34) renamed it bouba/kiki; ~95% of subjects (English and Tamil speakers) paired bouba=round, kiki=jagged. Ćwiek et al. (2022, *Philosophical Transactions of the Royal Society B* 377:20200390) confirmed robustness across 25 languages and 10 writing systems (917 participants).
- **Sapir (1929)**, "A study in phonetic symbolism," *Journal of Experimental Psychology*: "mil" perceived as smaller than "mal" (front vs back vowel) — the foundational vowel-magnitude finding.
- **Vowel frontness/backness.** Klink (2000, *Marketing Letters* 11(1):5–20): front-vowel names (e.g., "nidax") were perceived as smaller, lighter, faster, milder, friendlier, weaker, prettier; back-vowel names ("nodax") larger, heavier, slower, stronger. Two studies confirmed sound alone conveys size/speed/strength/weight, with or without supporting marketing.
- **Yorkston & Menon (2004, *JCR* 31(1):43–51):** the fictional ice cream "Frosh" (back vowel /o/) was judged smoother, creamier, richer than "Frish" (front vowel /i/); the effect is "automatic in as much as it is uncontrollable, outside awareness and effortless."
- **Lowrey & Shrum (2007, *JCR*):** people preferred "tiddip" (sharp-sounding) for a knife but "toddip" (duller) for a hammer — sound-to-attribute matching.
- **Plosive vs fricative/sonorant.** Higher-frequency sounds (front vowels, fricatives, voiceless consonants) associate with lightness/speed/smallness; lower-frequency (back vowels, stops, voiced consonants) with potency/heaviness (review: Motoki/Pathak/Calvert literature; Spence).

**Processing fluency & memorability.**
- **Alter & Oppenheimer (2006, PNAS 103(24):9369–9372):** "fluently named stocks robustly outperformed stocks with disfluent names in the short term"; a $1,000 investment "yielded a profit of $112 more after 1 day of trading" for fluently-named shares; even pronounceable tickers (KAR) beat unpronounceable (RDO, ~$85 up day one). *Limit:* effect strongest immediately post-IPO and short-term; a $20 one-year edge in one analysis — do not over-claim long-run causation.
- Sound repetition/alliteration (Coca-Cola, TikTok, PayPal) produces positive affect (Argo, Popa & Smith 2010, *Journal of Marketing*, "The Sound of Brands").

**Structural features that correlate with "stickiness":** pronounceability, 2–3 syllables, orthographic simplicity, sound repetition/rhythm, and vivid imagery.

**Limits of the evidence.** Most studies use *fictional* names in lab settings; real-world brand success is multi-causal (distribution, product, marketing spend). Sound symbolism is a *tendency*, not a deterministic law, and effect sizes vary. Treat phonetics as a tie-breaker and a connotation-aligner, not a guarantee.

**Effectiveness:** Useful. **Confidence:** High (0.8) for the existence of the effects; Medium (0.65) for predictive power on real brands. **Severity:** MEDIUM. **Re-verification:** annual.

---

## §5 Cross-Language Screening Protocol (step-by-step, reusable, incl. non-Latin)

**What it is.** Linguistic risk analysis: checking a candidate for offensive meanings, profanity, unfortunate homophones, religious/cultural taboos, hard phonotactics, and transliteration problems across all target languages and scripts. As practiced commercially, Lexicon describes "linguistic evaluation — by our global network of 100+ linguists across 75 countries."

**Why it matters.** Verified failures (see §10) — Mitsubishi Pajero, Honda Fitta, Vicks/Germany, Mercedes "Bensi" — cost rebranding, dealer complaints, and reputation.

**Reusable protocol:**
1. **Define market scope.** List target countries and their languages, major dialects, and scripts.
2. **Phonetic transcription.** Render the name in IPA; anticipate how each language's phonotactics will pronounce it (e.g., German "v"→/f/, which made "Vicks"≈"ficken").
3. **Semantic check per language** — meaning, connotation, slang, profanity. Use native speakers or vetted slang dictionaries; LLMs are a *first pass only* (they miss slang).
4. **Homophone/near-homophone check** — does it *sound like* a taboo word? (Mercedes "Bensi" 奔死 ≈ "rush to die" in Chinese).
5. **Script-specific transliteration:**
   - **Cyrillic (Russian):** watch Latin↔Cyrillic visual false-friends (Latin "B"=Cyrillic /v/, "P"=/r/, "H"=/n/); verify the name reads sensibly transliterated and check for collision with Russian profanity/slang.
   - **Armenian:** unique 39-letter alphabet; verify the name can be transliterated and pronounced, and that it doesn't collide with an Armenian taboo word. [Published guidance is thin — engage a native linguist; single-source/uncorroborated for any specific rule.]
   - **CJK (Chinese/Japanese/Korean):** Chinese requires choosing characters by *both* sound and meaning — Coca-Cola's 可口可乐 means "to permit the mouth to rejoice." Avoid the "bite the wax tadpole" trap of sound-only transliteration. Japanese: check katakana rendering and homophones (Siri≈colloquial "buttocks"). Korean: check Hangul rendering.
   - **Arabic:** right-to-left; check religious sensitivity (e.g., Nike recalled products when a flame logo resembled "Allah" in Arabic script) and that no profane root is invoked.
6. **Cultural/religious taboo check** — numbers, animals, colors, gestures by region.
7. **Pronounceability score** — can target-market speakers say it correctly on first sight?
8. **Document & rate** each language Pass/Caution/Fail; a Fail in a *primary* market is a BLOCKER; a Fail in a secondary market is a HIGH caution.

**When NOT to use full screening:** purely local single-language brands (still screen that language plus significant local-community languages).

**Tool/stack fit (AI agent executability):** Steps 1–2, 6–7 and a first-pass of step 3 are doable by an AI agent with web search + dictionaries. Steps 3–5 for non-Latin scripts and slang **require native-speaker/linguist verification — flag as human-in-the-loop.**

**Effectiveness:** Transformative. **Confidence:** High (0.85). **Severity:** BLOCKER. **Re-verification:** event-triggered (each new market entry).

---

## §6 Trademark Clearance Protocol + Distinctiveness Spectrum

**The Abercrombie spectrum of distinctiveness (extends v1).** Governing case: *Abercrombie & Fitch Co. v. Hunting World, Inc.*, 537 F.2d 4 (2d Cir. 1976), opinion by Judge Henry Friendly. The court held "marks are generally classified in categories of generally increasing distinctiveness… (1) generic; (2) descriptive; (3) suggestive; (4) arbitrary; or (5) fanciful":

1. **Generic** — never protectable (the common name of the product). The case itself canceled A&F's "Safari" registrations where the term was generic for certain goods.
2. **Descriptive** — protectable only with acquired distinctiveness / secondary meaning. "Merely descriptive" marks are refused under Lanham Act §2(e)(1) (15 U.S.C. §1052(e)(1)); §2(f) "removes a considerable part of the sting," allowing registration once distinctive, with 5 years' substantially exclusive use as prima facie evidence.
3. **Suggestive** — inherently distinctive; protectable without secondary meaning. (The court noted the suggestive category arose from "the felt need to accord protection to marks that were neither exactly descriptive… nor truly fanciful.")
4. **Arbitrary** — inherently distinctive (common word, unfamiliar use; APPLE/computers).
5. **Fanciful/coined** — strongest; "invented solely for their use as trademarks."

The court's "Deep Bowl Spoon" illustration: "Deep Bowl" is descriptive of a spoon but generic as to a deep bowl; "a term may be generic in one market and descriptive or suggestive or fanciful in another." This is why coined/arbitrary are strongest: no §2(e)(1) descriptiveness debate and easier infringement proof.

**Likelihood-of-confusion analysis.** Two governing tests:
- **DuPont factors (13):** *In re E.I. du Pont de Nemours & Co.*, 476 F.2d 1357 (CCPA 1973) — used by the USPTO/TTAB/Federal Circuit. Factor 1: "The similarity or dissimilarity of the marks in their entireties as to appearance, sound, connotation and commercial impression."
- **Sleekcraft factors (8):** *AMF Inc. v. Sleekcraft Boats*, 599 F.2d 341 (9th Cir. 1979): (1) strength of the mark; (2) proximity of goods; (3) similarity of marks; (4) evidence of actual confusion; (5) marketing channels; (6) type of goods/degree of purchaser care; (7) defendant's intent; (8) likelihood of expansion. The Second Circuit uses Polaroid factors; the Third uses Lapp. No single factor is dispositive; the list is "not exhaustive."

"Confusingly similar in the same class" in practice means: a similar mark + related goods/services in overlapping trade channels such that consumers would likely believe a common source.

**Nice Classification.** 45 international classes (1–34 goods; 35–45 services) under the Nice Agreement (WIPO). Classes that matter most by business type: **Class 9** (software/electronics), **35** (advertising/retail/business services), **42** (SaaS/tech services), **25** (clothing/fashion), **41** (education/entertainment), **43** (food/hospitality), **5** (pharma/healthcare). You must file in *every* class your business touches; a clearance in Class 25 does not protect you in Class 9.

**Clearance methodology (3 stages):**
1. **Knockout search** (free/automated) — USPTO search tooling (the system that replaced the legacy TESS interface), EUIPO eSearch, WIPO Global Brand Database, plus common-law/web/domain searches. **AI agent can do this.**
2. **Full search** (comprehensive, often a paid vendor) — phonetic equivalents, translations, design marks, state registrations, common-law uses.
3. **Attorney opinion** — registrability + infringement risk. **REQUIRES a human attorney — flag as such.**

**International protection — Madrid Protocol (WIPO).** One application, one language (EN/FR/ES), one currency (CHF), covering multiple members. Fees: **basic fee 653 CHF** (black & white) / **903 CHF** (color); **supplementary fee 100 CHF** per class beyond three (only when no individual fees apply); plus a **complementary fee 100 CHF** per designated member that doesn't set its own fee, **OR variable individual fees** set by members. **90% basic-fee reduction** for Least Developed Countries (→65/90 CHF). Renewal every 10 years. The USPTO **Section 66(a) Madrid designation fee rose from $500 to $600/class effective Feb 18, 2025** (per the USPTO Federal Register final rule "adjusting the existing flat application fee for Madrid applications to $600 per class, as paid in Swiss francs to WIPO"); Madrid filings are exempt from the insufficient-info and free-form surcharges.

**Genericide risk.** When the public uses the mark as the product's common name, protection dies. Court-verified losses: **aspirin** (Bayer; US rights lost — *Bayer Co. v. United Drug Co.*, 1921), **escalator** (Otis; canceled 1950, *Haughton Elevator*), **thermos** (*King-Seeley Thermos Co. v. Aladdin Industries*, 1963), **cellophane** (*DuPont Cellophane Co. v. Waxed Products Co.*, 85 F.2d 75, 2d Cir. 1936). Counter-case: *Elliott v. Google LLC* (9th Cir. 2017; cert. denied) held that verb use of "google" did NOT render GOOGLE generic — "nothing in the Lanham Act… limits trademark use to any particular part of speech." **Avoidance:** use the mark as an adjective + generic noun ("Xerox® copies," never "to xerox"); provide and promote a generic alternative; police third-party/dictionary/media usage.

**Cost (launch vs scale):**
- **US filing (launch):** $350/class base application (USPTO, effective Jan 18, 2025), which replaced TEAS Plus $250/Standard $350. Surcharges: $100/class insufficient info; $200/class for free-form (custom) goods identification; $200 per additional 1,000 characters. A single-class application using custom (free-form) IDs commonly totals **~$550/class**. [The $550 sum is a practitioner computation; USPTO lists only the component fees verbatim.]
- **At scale:** a 3-class US filing ≈ **$1,050+** (base only); international via Madrid: **653 CHF basic + per-member fees** (often hundreds of CHF each, e.g., EU, Japan); §66(a) US designation **$600/class**.
- **Hidden costs:** attorney opinion ($1,000s); office-action responses; opposition/cancellation proceedings ($10,000s); trademark **watch services** (annual subscription); **aftermarket domain** purchase ($15K–$30K typical for a good .com per Placek; far higher for premium — see §7).

**Effectiveness:** Transformative. **Confidence:** High (0.9). **Severity:** BLOCKER. **Re-verification:** quarterly for fees/rules (post-2025 changes are still settling); event-triggered per filing.

---

## §7 Digital Availability Gating Protocol

**The domain landscape (as of 2026).**
- **.com scarcity.** Short/pronounceable .coms are largely taken; exact-match often requires an aftermarket purchase. Placek: the .com "has become 'just an area code'… Don't let domain availability drive your naming decision."
- **.com pricing (launch vs scale, as of early 2026).** Transparent registrars: Cloudflare at-cost ~$10.44–10.46/yr (registration = renewal); Spaceship ~$9.98/yr; Porkbun ~$11.08/yr; Namecheap renewal ~$14.98–18.68/yr; GoDaddy ~$21.99/yr renewal. Plus a mandatory ~$0.18–0.20 ICANN fee. *At scale:* multiply by N defensive variants; renewals recur annually.
- **.ai (Anguilla ccTLD).** Minimum **2-year** registration; retail ~$70–85/yr (Dynadot $85.60 register/renew). Anguilla raised wholesale **$20 effective March 5, 2026 — a 29% increase on the annual rate — to $160 per 2-year registration** (Domain Name Wire: "the wholesale cost will increase by $10 per year or $20 per registration or renewal, raising the fee to $160"). **.ai crossed 1 million registrations on January 2, 2026** (60,000 in 2022; 354,000 in 2023). Premium/aftermarket: average .ai resale ~$239,516 (the highest of any TLD per Instant Domain Search); fin.ai sold for **$1,000,000** (March 2025, now Intercom's Fin agent). For scale on .com aftermarket: **ai.com sold for $70 million** (deal closed April 2025, revealed Feb 2026; buyer Kris Marszalek, Crypto.com CEO) — the largest publicly disclosed domain sale ever per NameBio, eclipsing Voice.com ($30M).
- **Other gTLDs:** .io, .co, .shop, .store, .app, .pet — viable; market acceptance is high for tech (.io, .ai) and retail (.shop, .store).
- **SEO treatment.** Google treats new gTLDs the same as .com: "Keywords in a TLD do not give any advantage or disadvantage in search" (Google Search Central, July 2015, reaffirmed since). TLD choice is a branding/trust decision, not an SEO one.
- **APIs/quirks.** RDAP (modern, structured, replacing WHOIS) and registrar/Vercel domain APIs allow programmatic availability checks. Quirks: "available" at the registry ≠ free of trademark conflict; premium/aftermarket domains show as "registered" but are purchasable; some ccTLDs impose local-presence requirements; Cloudflare requires its own nameservers and does not support internationalized domain names.

**Social-handle strategy.** A uniform handle across X, Instagram, TikTok, YouTube, LinkedIn, and GitHub maximizes recall and prevents impersonation. Handle-squatting is common; fractured handles (@brand on one platform, @brandapp on another) dilute recognition and create support/PR confusion. Check all priority platforms before finalizing.

**Discoverability.**
- **Branded-search SERP ownership.** A distinctive/coined name lets you own page 1 for your name; a dictionary-word name collides with a well-capitalized namesake (you cannot outrank Apple/Amazon for the bare word — a real, if informal, "penalty").
- **App-store constraints.** Name length limits, uniqueness requirements, and keyword fields.
- **AI/LLM answers (as of 2026; fast-moving).** Brands now compete to be cited in ChatGPT/Perplexity/Gemini/Google AI Overviews answers — Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO). Distinctive names are easier for LLMs to disambiguate; generic/collision names get confused with namesakes. Tracking tools (Profound, Adobe LLM Optimizer, Writesonic, LLMrefs, Evertune) measure "share of model." Vendor-sourced; re-verify quarterly.

**Reusable availability-gating protocol (order of checks, pass/fail thresholds):**
1. **Trademark knockout** (USPTO/EUIPO/WIPO) — exact + phonetic in target Nice classes. **FAIL = BLOCKER** if a confusingly similar live mark exists in the same/related class.
2. **Domain check via RDAP/registrar API** — exact-match .com (or category-canonical TLD). PASS if .com or strong-fit TLD available ≤~$50/yr OR aftermarket ≤ budget; CAUTION if only compound/prefixed available. **Do NOT auto-fail on bare-.com unavailability** (per Placek).
3. **Social-handle sweep** — ≥4 of 6 priority platforms available → PASS.
4. **Branded-SERP test** — search the bare name; FAIL if a well-capitalized exact namesake dominates page 1.
5. **App-store name check** (if applicable) — uniqueness + length.
6. **AI-search disambiguation check** — query an LLM "what is [name]?"; CAUTION if it confidently returns a different established entity.

**Cost (launch vs scale).** Launch: ~$10–15 (.com) to ~$160 (.ai 2yr) + handles (free). Scale: defensive registration of typo/ccTLD variants ($10–15 each × N); aftermarket premium ($15K–$30K typical, up to seven/eight figures for premium); recurring renewals.

**Effectiveness:** Useful (Transformative for AI-agent implementation). **Confidence:** High (0.8); Medium (0.6) for AI-search. **Severity:** HIGH (the TM step is a BLOCKER). **Re-verification:** quarterly (pricing, gTLD policy, AI-search).

---

## §8 Weighted Scoring Rubric (+ tunable presets by brief)

**Synthesized 100-point rubric** (extends the v1 6-criterion scorecard; weights grounded in Neumeier's 7 criteria, Watkins SMILE/SCRATCH, Abercrombie, and the fluency/sound-symbolism literature):

| Criterion | Default weight | Evidence basis |
|---|---|---|
| Legal defensibility (Abercrombie strength + clearance) | 25 | Abercrombie 537 F.2d 4; DuPont/Sleekcraft; genericide cases |
| Distinctiveness / memorability | 20 | Neumeier; Lexicon; Alter & Oppenheimer |
| Pronounceability / fluency / spelling | 15 | Alter & Oppenheimer 2006; Watkins SCRATCH |
| Strategic fit / appropriateness | 15 | Neumeier; Watkins SMILE (Suggestive) |
| Cross-language safety | 10 | §10 verified cases |
| Digital availability (domain/handle) | 10 | §7 |
| Extendability / legs | 5 | Neumeier; Watkins (Legs) |
| **Total** | **100** | |

**Tunable presets (weights re-sum to 100):**

| Criterion | Premium | Value/Mass | Global | Local retail/signage | Online-first/B2B SaaS | B2C consumer |
|---|---|---|---|---|---|---|
| Legal defensibility | 25 | 22 | 25 | 22 | 22 | 20 |
| Distinctiveness | 25 | 15 | 17 | 18 | 22 | 22 |
| Fluency/spelling | 12 | 20 | 13 | 20 | 13 | 15 |
| Strategic fit | 15 | 18 | 10 | 15 | 13 | 18 |
| Cross-language | 10 | 10 | 20 | 5 | 7 | 8 |
| Digital availability | 5 | 10 | 10 | 12 | 18 | 12 |
| Extendability | 8 | 5 | 5 | 8 | 5 | 5 |
| **Total** | **100** | **100** | **100** | **100** | **100** | **100** |

*Rationale:* Premium favors distinctiveness + full/back-vowel sound symbolism and de-prioritizes the exact .com. Value/mass raises pronounceability + clarity (suggestive names acceptable). Global maximizes cross-language safety + Madrid-readiness. Local retail drops cross-language and raises signage pronounceability + branded-SERP. Online-first/B2B raises digital availability + distinctiveness (LLM disambiguation). B2C raises emotional/imagery (folded into fit + distinctiveness).

**Conflict surfaced.** The *descriptive-but-memorable* camp (instant comprehension wins) vs the *coined-but-defensible* camp (Lexicon/Neumeier: distinctiveness + protectability win long-term). This rubric weights toward defensibility (25), but the value/local presets can raise appropriateness/fluency to favor comprehension.

**Effectiveness:** Useful. **Confidence:** Medium (0.65) — weights are reasoned syntheses, not empirically validated. **Severity:** MEDIUM. **Re-verification:** annual.

---

## §9 Validation & Testing Methods

**How professionals test shortlists:**
- Association/perception tests (what does the name evoke?), pronunciation tests, implicit vs stated preference.
- Lexicon's **Swiffer test**: parents heard the name and imagined "an easier, more joyful cleaning experience" *before* learning the product's features — testing *fit/imagery*, not mere liking.
- Neumeier: field tests measure five things — **distinctiveness, relevance, memorability, extendability, depth.**

**The well-known pitfall — "liking" predicts poorly; focus groups kill strong names.** Verified by practitioner accounts: **Sonos** was "initially rejected by the team for not being 'entertainment' enough"; **Azure** was called "dumb"; the **BlackBerry** founders thought the name "crazy." Intel CEO Andy Grove on Pentium: "I see the polarization here . . . that tells me there's energy for Pentium." Watkins: "If you ask everyone to chime in, you will end up with a mediocre name that met with the least resistance rather than the very best name." Neumeier: "Focus groups are meant to focus the research, not be the research."

**Conflict surfaced — should you test at all?** Camp A (Lexicon, Watkins): testing-by-committee destroys distinctiveness and selects for comfort. Camp B (research-driven marketers): structured testing reduces catastrophic risk (offensive meaning, unpronounceability — cf. the Ford Edsel often cited in this literature). **Resolution:** test for *fit and risk* ("Is it right? Any red flags?"), NOT for *appeal* ("Do people like it?"); keep samples representative; never let a focus group veto a polarizing-but-strong name.

**What predicts real-world success vs noise:** distinctiveness, fluency, and strategic fit have research support; raw "liking" scores are weak predictors. Sample sizes should give directional signal, not false statistical precision.

**Effectiveness:** Useful. **Confidence:** Medium (0.6). **Severity:** MEDIUM. **Re-verification:** annual.

---

## §10 Failure Modes & Cautionary Cases (VERIFIED vs APOCRYPHAL)

### VERIFIED (documented)
- **Mitsubishi Pajero → Montero.** "Pajero" is Spanish slang for "masturbator/wanker"; renamed Montero in Spanish-speaking markets (Shogun in the UK). Widely documented across multiple trade sources. *Lesson:* screen slang in every target language. **Severity: HIGH.**
- **Honda Fitta → Jazz/Fit.** "Fitta" is a vulgar term for female genitalia in Swedish/Norwegian/Danish; renamed before/at the 2001 launch. Verified. *Lesson:* check ALL target-region languages, not just dominant ones. **Severity: HIGH.**
- **Mercedes-Benz "Bensi" in China.** The early Chinese name 奔死 "Bensi" (奔 = "rush/run" + 死 = "to die") meant "rush to die"; the firm rebranded to 奔驰 "Benchi" ("run quickly as if flying"), per Week In China ("What's in a name", 2012) quoting Landor Associates' Ray Ally; registered as Benchi via its 2005 BAIC Beijing joint venture (Daxue Consulting). *Lesson:* homophone/tonal check in Chinese. **Severity: MEDIUM.**
- **Vicks in Germany.** German "v"→/f/ makes "Vicks" ≈ "ficken" (vulgar); corroborated by Inc. and translation firms. *Lesson:* phonetic transcription per language. **Severity: MEDIUM.**
- **Nokia Lumia.** "Lumia" is a colloquial/archaic (Romani-derived) Spanish term for "prostitute" — the meaning exists, but Nokia launched anyway and the association was weak (most associate the Latin root *lūmen* = light). *Lesson:* assess *salience*, not just dictionary existence; a low-salience hit is not a BLOCKER. **Severity: LOW.**
- **Genericide:** aspirin, escalator, thermos, cellophane — all court-verified losses (see §6). **Severity: BLOCKER (terminal).**

### APOCRYPHAL / MYTH
- **Chevy Nova "no va" ("doesn't go").** **DEBUNKED.** Snopes: "nova" (one word, stress on the first syllable) ≠ "no va" (two words, stress on the second); the Nova sold well in Mexico and *exceeded* projections in Venezuela; Pemex sold "Nova" gasoline; it was never renamed "Caribe" (that was a VW Golf). NPR (2011) issued an on-air correction: "In Spanish, nova means the same as it does in English… The Nova sold very well in both Mexico and Venezuela." A Spanish speaker would say "no funciona"/"no camina," not "no va." *Lesson:* cite verified cases, not legends — those who repeat Nova commit the very research failure they mock.
- **Coca-Cola "bite the wax tadpole."** **PARTIAL MYTH.** Snopes: Coke did NOT name itself this; *Chinese shopkeepers*, before an official transliteration existed, improvised sound-alike character strings that read nonsensically ("bite the wax tadpole," "female horse stuffed with wax"). Coca-Cola then chose 可口可乐 (≈ "to permit the mouth to rejoice"), registered as its Chinese trademark in 1928. *Lesson:* the *underlying risk* (sound-only transliteration into a meaning-bearing script) is real, even though the corporate-blunder framing is false.
- **KFC "Finger-Lickin' Good" → "Eat Your Fingers Off" in Chinese.** **WIDELY REPEATED, POORLY SOURCED.** No solid primary Chinese-language source; likely embellished. Treat as unverified legend. *Lesson:* do not propagate unsourced anecdotes in a skill.
- **Ford Pinto "small genitals" in Brazilian Portuguese.** The *linguistic* claim ("pinto" = slang for small penis) is plausible/likely true; the *business-impact* story (Ford renamed it "Corcel" because of this) is weakly sourced — Corcel was a distinct model. Rate: **linguistic claim plausible; business story unverified.**

### Other failure modes
- **Collision / TM loss** — choosing a name confusingly similar to a senior mark → opposition, forced rebrand. *Lesson:* knockout-search before falling in love.
- **Restrictive names blocking expansion** — geographic/product-locked names. Tony Hsieh: "Zappos.com originally started out as ShoeSite.com, but that limited our potential future growth." (Watkins SCRATCH "Restrictive.") *Lesson:* name the ambition, not the first product.
- **Trend-chasing — the vowel-dropping era** (Flickr, Tumblr, Scribd, Grindr): driven largely by .com unavailability — Flickr's Caterina Fake wanted "Flicker" but "the guy who had it wouldn't sell," so the team removed the "e." (Documented by HowStuffWorks, 2016, and Campaign.) SCRATCH "Spelling-challenged"; the trend reversed in the 2020s toward literal names. *Lesson:* don't adopt a spelling that requires constant verbal correction.
- **Reliance on a domain/handle you don't fully own** — building equity on a leased/shared domain or an uncontrolled handle. *Lesson:* secure assets before launch.

**Effectiveness:** Transformative (for skill accuracy). **Confidence:** High (0.9). **Severity:** ranges LOW→BLOCKER. **Re-verification:** annual.

---

## §11 End-to-End Process Pipeline + Creative-Brief Template

**The full agency pipeline:**
1. **Brief** — strategy, positioning, audience, target sound, constraints.
2. **Generation** — 500–3,000+ candidates; creation separated from judgment.
3. **Screening funnel** — internal SMILE/SCRATCH + strategy filter → shortlist 50–100.
4. **Linguistic + TM clearance** — cross-language screen + knockout TM + domain check on the shortlist → ~5–25 survivors.
5. **Optional testing** — fit/risk perception tests (not appeal voting).
6. **Decision/governance** — choose the polarizing-but-strong candidate; secure domain/handles; file TM.

**Realistic ratios.** Lexicon generates 1,000–3,000+ ideas per project; ~250 "diamonds"; shortlist 50–100; ultimately one survivor. Attrition is ~90%+ from legal/linguistic/strategy filters. A typical Lexicon engagement runs 8–10 weeks.

**Copy-ready creative-brief template:**
```
BRAND NAMING BRIEF
1.  Company/product & one-line description
2.  Category & competitors (list 5 competitor names)
3.  Positioning / what makes us different (the "zag")
4.  Target audience (who, tribe, values)
5.  Brand personality (3–5 adjectives)
6.  Target SOUND (fast? full? reliable? soft? premium?)
7.  Desired connotations / imagery
8.  Name types in/out of scope (e.g., no founder names)
9.  Markets & languages (for screening)
10. Must-clear Nice classes & geographies (Madrid?)
11. Domain/handle requirements (must-have TLD? flexible?)
12. Constraints / no-go words / legal landmines
13. Decision-makers & timeline
14. Success criteria ("is it right?" — not "do I like it?")
```

**Adapting the pipeline for an AI agent with live tools:**
- **Generation:** instruct the LLM to produce volume across techniques; **CRITICAL — LLMs systematically over-produce already-taken/real-company names**, so never trust generation output; gate everything.
- **Gating loop:** for each candidate → (a) RDAP/registrar API domain check; (b) USPTO/EUIPO/WIPO TM knockout via search; (c) cross-language web search; (d) social-handle check; (e) branded-SERP + AI-disambiguation check. Drop fails; rank survivors by the §8 rubric.
- **Where LLMs fail:** hallucinating availability ("yes, that .com is free" without checking), missing slang, asserting TM clearance. **Mitigation:** tool-verify every claim; require RDAP/API evidence; flag the attorney opinion and non-Latin slang screening as human-in-the-loop.

**Effectiveness:** Transformative. **Confidence:** High (0.8). **Severity:** HIGH. **Re-verification:** annual (pipeline); quarterly (tool behaviors).

---

## §12 Skill-Stub Specs

**Skill 1: `naming-brief`**
- **Description / trigger phrases:** "help me name," "naming brief," "start a naming project."
- **Procedure:** (1) Ask the 14 brief questions (§11). (2) Force a "target sound" answer + the "is it right" success criterion. (3) Capture markets/languages + Nice classes. (4) Capture domain/TLD flexibility. (5) Output a structured brief (markdown + JSON). (6) Confirm with the user.
- **Output format:** filled brief template (markdown) + machine-readable JSON.
- **Anti-patterns:** (a) skipping the target-sound; (b) accepting "do I like it" as the success metric.
- **Severity:** MEDIUM. **Confidence:** 0.8.

**Skill 2: `name-generation`**
- **Trigger phrases:** "generate names," "brainstorm names" (after brief complete).
- **Procedure:** (1) Load brief. (2) Generate ≥200 candidates across ≥5 techniques (§2) and ≥3 metaphor domains. (3) Ban self-evaluation during generation. (4) Apply availability heuristics (2–3 syllables, compounds, coined forms). (5) De-duplicate; flag obvious real-company collisions. (6) Pass all to gating — never present as "available."
- **Output format:** candidate list (no quality/availability claims).
- **Anti-patterns:** (a) presenting candidates as available/clearable without tool checks; (b) self-censoring volume to a "safe" handful.
- **Severity:** HIGH. **Confidence:** 0.65.

**Skill 3: `linguistic-screen`**
- **Trigger phrases:** "screen for language," "check meanings" (shortlist ready).
- **Procedure:** (1) Load target languages/scripts. (2) IPA-transcribe each candidate. (3) Per-language semantic + homophone + slang check. (4) Non-Latin transliteration (Cyrillic/Armenian/CJK/Arabic). (5) Pronounceability score. (6) Rate Pass/Caution/Fail; flag non-Latin slang for a human linguist.
- **Output format:** matrix of candidate × language with verdicts.
- **Anti-patterns:** (a) trusting the LLM for slang (it misses it) without native verification; (b) sound-only transliteration into CJK.
- **Severity:** BLOCKER. **Confidence:** 0.7.

**Skill 4: `trademark-clearance`**
- **Trigger phrases:** "trademark check," "is it clear."
- **Procedure:** (1) Classify on the Abercrombie spectrum. (2) Identify Nice classes. (3) Knockout-search USPTO/EUIPO/WIPO (exact + phonetic). (4) Apply DuPont/Sleekcraft reasoning (same/related class + similar mark). (5) Flag likely §2(e)(1) descriptiveness refusals. (6) Output a risk rating + REQUIRE an attorney opinion before filing.
- **Output format:** per-candidate TM risk (Clear/Caution/Blocked) + class list.
- **Anti-patterns:** (a) asserting "registrable" without an attorney; (b) ignoring phonetic/translation equivalents.
- **Severity:** BLOCKER. **Confidence:** 0.7.

**Skill 5: `availability-gate`**
- **Trigger phrases:** "check availability," "domains and handles."
- **Procedure:** (1) RDAP/registrar API domain check (.com + category TLD). (2) Social-handle sweep (6 platforms). (3) Branded-SERP test. (4) AI-disambiguation query. (5) Price domains (launch + renewal + aftermarket). (6) Rate; do NOT auto-fail on .com unavailability (offer prefix/.ai/buy options).
- **Output format:** availability table + cost (launch vs scale).
- **Anti-patterns:** (a) hallucinating domain availability without RDAP; (b) treating the exact .com as a hard gate.
- **Severity:** HIGH. **Confidence:** 0.7.

**Skill 6: `name-scorecard`**
- **Trigger phrases:** "score the names," "rank the shortlist."
- **Procedure:** (1) Load the §8 rubric + select a brief preset. (2) Score each survivor 0–100. (3) Show the component breakdown. (4) Surface polarizing-but-strong candidates (don't average to blandness). (5) Recommend the top 3 with rationale ("is it right"). (6) Note remaining human steps (attorney, native linguist, testing).
- **Output format:** ranked table + recommendation memo.
- **Anti-patterns:** (a) picking the least-objectionable/highest-consensus name; (b) hiding the defensibility-vs-comprehension tradeoff.
- **Severity:** MEDIUM. **Confidence:** 0.65.

---

## §13 Verbatim Quotes Appendix

1. "Overall, our systems treat new gTLDs like other gTLDs (like .com & .org). Keywords in a TLD do not give any advantage or disadvantage in search." — John Mueller, Google Search Central Blog, "Google's handling of new top level domains," July 2015. https://developers.google.com/search/blog/2015/07/googles-handling-of-new-top-level
2. "The base application filing fee for each class of goods or services in a Section 1 or Section 44 application is $350 if the application meets the requirements." — USPTO, "Trademark fee information," updated Jan 18, 2025. https://www.uspto.gov/trademarks/trademark-fee-information
3. "This final rule replaced the two types of application fees—Trademark Electronic Application System (TEAS) Plus and TEAS Standard—with one base application fee… The changes became effective on January 18, 2025 for fees paid to the USPTO, and on February 18, 2025 for fees paid to WIPO." — USPTO, "Summary of 2025 trademark fee changes." https://www.uspto.gov/trademarks/fees-payment-information/summary-2025-trademark-fee-changes
4. "We recommend generating at least 1,000 creative ideas before selecting a shortlist of 50 to 100 candidates. (We usually generate thousands.)" — David Placek, Lexicon Branding, Lenny's Newsletter, "How to find the perfect name." https://www.lennysnewsletter.com/p/how-to-find-the-perfect-name
5. "Invented names like Pentium actually take less money to build into brands than existing words—despite a common myth to the contrary." — David Placek, Lenny's Newsletter. https://www.lennysnewsletter.com/p/how-to-find-the-perfect-name
6. "I see the polarization here . . . that tells me there's energy for Pentium." — Andy Grove (Intel CEO), quoted in Lenny's Newsletter, "Naming expert David Placek." https://www.lennysnewsletter.com/p/naming-expert-david-placek
7. "Domain availability is no longer a deal-breaker. The .com has become 'just an area code.'" — summary of David Placek, Lenny's Newsletter. https://www.lennysnewsletter.com/p/naming-expert-david-placek
8. "marks are generally classified in categories of generally increasing distinctiveness of: (1) generic; (2) descriptive; (3) suggestive; (4) arbitrary; or (5) fanciful." — *Abercrombie & Fitch Co. v. Hunting World, Inc.*, 537 F.2d 4, 9 (2d Cir. 1976). https://law.justia.com/cases/federal/appellate-courts/F2/537/4/468363/
9. "§ 2(f) removes a considerable part of the sting by providing that… nothing in this chapter shall prevent the registration of a mark used by the applicant which has become distinctive of the applicant's goods in commerce." — *Abercrombie & Fitch Co. v. Hunting World*, 537 F.2d 4 (2d Cir. 1976). https://law.justia.com/cases/federal/appellate-courts/F2/537/4/468363/
10. "The similarity or dissimilarity of the marks in their entireties as to appearance, sound, connotation and commercial impression." — *In re E.I. du Pont de Nemours & Co.*, 476 F.2d 1357 (CCPA 1973), factor 1. https://www.duetsblog.com/2011/01/articles/trademarks/why-marketing-should-use-du-pont-and-sleekcraft-factors/
11. "We demonstrate that consumers use information they gather from phonemes in brand names to infer product attributes and to evaluate brands… automatic in as much as it is uncontrollable, outside awareness and effortless." — Yorkston & Menon, "A Sound Idea," *Journal of Consumer Research* 31(1):43–51 (2004). https://doi.org/10.1086/383422
12. "In both a laboratory study and two analyses of naturalistic real-world stock market data, fluently named stocks robustly outperformed stocks with disfluent names in the short term." — Alter & Oppenheimer, *PNAS* 103(24):9369–9372 (2006). https://www.pnas.org/doi/10.1073/pnas.0601071103
13. "an initial investment of $1,000 yielded a profit of $112 more after 1 day of trading for a basket of fluently named shares than for a basket of disfluently named shares." — Alter & Oppenheimer, *PNAS* (2006). https://pmc.ncbi.nlm.nih.gov/articles/PMC1482615/
14. "Results of two studies indicate that the sound of a brand name can communicate information about the product, e.g. its size, speed, strength, weight." — Klink, "Creating Brand Names With Meaning: The Use of Sound Symbolism," *Marketing Letters* 11(1):5–20 (2000). https://link.springer.com/article/10.1023/A:1008184423824
15. "95% of people will select the curvy shape as 'bouba' and the jagged one as 'kiki'." — summarizing Ramachandran & Hubbard (2001), "Synaesthesia: A window into perception, thought and language," *Journal of Consciousness Studies* 8(12):3–34. https://en.wikipedia.org/wiki/Bouba/kiki_effect
16. "the story is just a story and never actually happened… this Nova blunder never occurred." — Deseret News, "Chevy Nova tale, other global marketing myths debunked" (2011). https://www.deseret.com/2011/7/22/20385745/
17. "In Spanish, nova means the same as it does in English. You need to insert a space to get to no va… The Nova sold very well in both Mexico and Venezuela." — Neal Conan, NPR, "Letters: The Myth Of The Chevy Nova" (2011). https://www.npr.org/2011/10/19/141473384/
18. "It was the real thing, with no wax tadpoles or female horses, and Coca-Cola registered it as its Chinese trademark in 1928." — Snopes, "Bite the Wax Tadpole." https://www.snopes.com/fact-check/bite-the-wax-tadpole/
19. "A great name makes you SMILE because it is Suggestive… Meaningful… uses Imagery… has Legs… and is Emotional… A bad name… makes you SCRATCH your head because it is Spelling challenged… Copycat… Restrictive… Annoying… Tame… Curse of Knowledge… and is Hard to pronounce." — Alexandra Watkins, *Hello, My Name Is Awesome* (publisher/Goodreads summary). https://www.goodreads.com/book/show/20578350-hello-my-name-is-awesome
20. "If you ask everyone to chime in, you will end up with a mediocre name that met with the least resistance rather than the very best name." — Alexandra Watkins, *Hello, My Name Is Awesome* (Nat Eliason notes). https://www.nateliason.com/notes/hello-name-awesome
21. "Make sure the name of your brand is distinctive, brief, appropriate, easy to spell, easy to pronounce, likeable, extendible, and protectable." — Marty Neumeier, *The Brand Gap*. https://www.martyneumeier.com/strong-vs-weak-names
22. "basic fee – 653 CHF for a black and white mark; 903 CHF for a mark in color… A 'supplementary fee' of 100 CHF for each class of goods and services over three." — WIPO, Madrid System "Fees and Payments." https://www.wipo.int/en/web/madrid-system/how_to/file/fees
23. "ASPIRIN, CELLOPHANE and ESCALATOR are all examples of words that were once trademarks, but ultimately came to be used and understood by the public as the names for the products themselves… This loss of trademark rights is known as 'genericide.'" — Lexology/Mondaq, "Avoiding Genericide: Lessons from a Recent Case." https://www.lexology.com/library/detail.aspx?g=ebd53846-e3ce-48cf-be5c-fec4504224a0
24. "The minimum two-year registration period costs $70 per year… Starting March 5, the wholesale cost will increase by $10 per year or $20 per registration or renewal, raising the fee to $160." — Domain Name Wire, ".AI domain name prices going up $20," Feb 2, 2026. https://domainnamewire.com/2026/02/02/ai-domain-name-prices-going-up-20/
25. "Zappos.com originally started out as ShoeSite.com, but that limited our potential future growth." — Tony Hsieh, endorsement in *Hello, My Name Is Awesome*. https://www.amazon.com/Hello-My-Name-Awesome-Create/dp/1626561869
26. "'We wanted Flicker, but the guy who had it wouldn't sell,' says co-Founder Caterina Fake. 'So I suggested to the team, "Let's remove this 'e' thing."'" — Campaign, "Why Flickr dropped the 'e' and started a trend." https://www.campaignlive.co.uk/article/why-flickr-dropped-e-started-trend/1341902

---

## §14 Methodology & Limitations

**Sources & search strategy.** ~18 web searches plus targeted fetches and one focused subagent, prioritizing primary sources: court opinions (Justia/Casemine for *Abercrombie*, *DuPont*, *Sleekcraft*), USPTO.gov, WIPO.gov, peer-reviewed journals (PNAS, *Journal of Consumer Research*, *Marketing Letters*, *Phil. Trans. R. Soc. B*) for phonetics, Snopes/NPR for myth-busting, registrar pages and Domain Name Wire for pricing, Google Search Central for SEO, and practitioner primary sources (Lexicon Branding, Alexandra Watkins, Marty Neumeier).

**Source-type distinctions.** *Peer-reviewed* (Yorkston & Menon, Klink, Alter & Oppenheimer, Ćwiek et al., Köhler, Ramachandran & Hubbard, Sapir) — strongest for phonetics/fluency. *Legal primary* (statutes/cases/WIPO/USPTO) — strongest for trademark and cost. *Practitioner/agency claims* (Lexicon, Watkins, Neumeier) — credible but self-interested; flagged as practitioner. *Secondary trade press* — used for corroboration and pricing only.

**Cross-reference status.** Load-bearing legal, phonetic, pricing, and myth-vs-fact claims are corroborated by ≥2 independent sources. Single-source items are flagged inline: the exact Lexicon 90%/3,000 attrition figures (Placek/Lexicon); Armenian-specific screening rules; the $93M Anguilla revenue and average .ai resale figures (Instant Domain Search/DomainsProject); the ai.com $70M sale (NameBio, via aftermarket reporting).

**Sparse/contested areas:**
- The §8 weighted-rubric weights are reasoned syntheses, NOT empirically validated — Confidence Medium (0.65).
- AI-search/AEO impact on naming (§7) is fast-moving and largely vendor-sourced — re-verify quarterly.
- Armenian-specific screening guidance is thin in published literature — engage native linguists.
- The $550 custom-ID per-class total is a practitioner sum, not a single USPTO sentence; the $600 §66(a) figure is confirmed via the USPTO final rule + IP-firm corroboration.

**Verified-vs-myth calls:** Pajero, Fitta, Vicks, Mercedes "Bensi," Nokia Lumia (meaning exists, salience low) = **VERIFIED.** Chevy Nova = **MYTH (debunked).** Coca-Cola "wax tadpole" = **PARTIAL MYTH** (shopkeepers, not Coke; underlying transliteration risk real). KFC "eat your fingers off" = **UNVERIFIED legend.** Ford Pinto = linguistic claim plausible, business-impact story unverified.

**Fast-moving areas flagged "re-verify":** all domain pricing (.com, .ai — note .ai wholesale changed March 5, 2026); new-gTLD policy; USPTO fee rules (changed Jan 18 / Feb 18, 2025); AI-search/AEO discoverability (as of 2026). Anything dated before 2025 should be re-verified.

**"What I don't know" appendix (unknowns + next step to resolve each):**
- Exact current USPTO §66(a) fee verbatim from the USPTO Fee Schedule — *next step:* fetch uspto.gov/learning-and-resources/fees-and-payment/uspto-fee-schedule.
- Whether Google's 2015 gTLD-SEO stance has any 2025+ official revision — *next step:* check current Search Central documentation and recent Mueller statements.
- Empirical validation of any specific weighted naming rubric — *next step:* search marketing-science literature for predictive naming models.
- Squadhelp/Atom proprietary scoring internals — *next step:* fetch their methodology pages (not reachable within this budget).
- Current Verisign .com wholesale cap and the exact 2026 ICANN per-domain fee — *next step:* Verisign/ICANN primary pages.
- Whether the vowel-dropping trend reversal is quantified — *next step:* locate the Crunchbase-based survey referenced in trade press.

--- END OF BRAND-NAMING RESEARCH ---