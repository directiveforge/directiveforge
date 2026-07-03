---
name: linguistic-screen
description: Screen a name shortlist for offensive meanings, profanity, unfortunate homophones, religious/cultural taboos, and transliteration problems across every target language and script — including non-Latin (Cyrillic, Armenian, CJK, Arabic). Use this skill once a shortlist exists and the user says "screen for language", "check meanings", "will this offend anyone", or is about to go global. A Fail in a primary market is a BLOCKER. The agent is a first pass only — non-Latin slang and culturally-loaded checks MUST be flagged for native-speaker verification.
severity: BLOCKER
confidence: 0.7
surface: Cowork-or-Code
---

# Linguistic Screen Skill

> **Trigger**: A naming shortlist is heading toward markets with more than one language or script. The default failure this prevents: shipping a name that is vulgar, taboo, or unpronounceable in a target language — the verified Pajero / Fitta / Vicks / Mercedes-"Bensi" class of disaster.

## What this skill produces

A candidate × language matrix with a Pass / Caution / Fail verdict per cell, IPA transcriptions, and an explicit list of cells flagged for human-linguist verification. A Fail in a *primary* market is a hard BLOCKER; a Fail in a secondary market is a HIGH caution.

## Before invoking — mandatory reads

1. `knowledge-base/KB-07-BRAND-NAMING.md` §5 (the 8-step cross-language protocol, including the script-specific transliteration rules for Cyrillic / Armenian / CJK / Arabic).
2. KB-07 §4 (sound symbolism) — so the screen also notes phonetic connotation mismatches (front/back vowels signalling size/speed), not only taboos.
3. KB-07 §10 **VERIFIED vs APOCRYPHAL** — cite only verified cases (Pajero, Fitta, Vicks, Bensi, low-salience Lumia). Do NOT propagate the debunked Chevy Nova or the unsourced KFC "eat your fingers" legend; repeating them commits the exact research failure the section warns against.

## Procedure

1. **Load target languages, dialects, and scripts** from the brief JSON (`markets[].languages`, `markets[].scripts`).
2. **IPA-transcribe each candidate** and anticipate each language's phonotactics (e.g., German "v" → /f/, which turned "Vicks" ≈ "ficken").
3. **Per-language semantic + homophone + slang check.** Meaning, connotation, slang, profanity, and near-homophones of taboo words (Mercedes "Bensi" 奔死 ≈ "rush to die"). LLM output is a *first pass only* — it misses slang.
4. **Non-Latin transliteration (§5 step 5).** Cyrillic: watch Latin↔Cyrillic visual false-friends (B=/v/, P=/r/, H=/n/). Armenian: verify transliteration/pronunciation in the 39-letter alphabet (published guidance is thin → native linguist required). CJK: choose by BOTH sound and meaning — avoid the sound-only "wax tadpole" trap. Arabic: right-to-left; check religious sensitivity and profane roots.
5. **Cultural/religious taboo check** — numbers, animals, colors, gestures by region.
6. **Pronounceability score** — can target-market speakers say it correctly on first sight?
7. **Assess salience, not mere existence.** A dictionary hit with low salience (Nokia Lumia: archaic Romani-derived term; most hear Latin *lūmen* = light) is a LOW caution, not a blocker. Rate the *likelihood a real speaker makes the association*.
8. **Rate Pass / Caution / Fail per language; flag every non-Latin slang and culturally-loaded cell as human-in-the-loop.** A primary-market Fail blocks the candidate.

## Output format

A matrix plus a flagged-for-human list:

```markdown
| Candidate | IPA | EN | DE | RU (Cyrillic) | ZH (CJK) | Verdict |
|-----------|-----|----|----|---------------|----------|---------|
| Lumio | /ˈluː.mi.oʊ/ | Pass | Pass | Caution¹ | Pass² | Caution |

¹ near-homophone check needs RU native speaker — FLAGGED
² 可 character choice unverified — FLAGGED for CJK linguist
Primary-market Fails (BLOCKERS): …
Human-linguist queue: …
```

Worked example shape: a shortlist bound for Sweden + Spain gets each candidate IPA-transcribed, screened against Swedish/Spanish slang, and any near-miss (the Fitta/Pajero class) flagged as a primary-market BLOCKER with a native-speaker verification note.

## Anti-patterns

- **Trusting the LLM for slang.** Models miss regional and generational slang; a clean LLM pass is not clearance. Flag non-Latin and slang-sensitive cells for native verification — always.
- **Sound-only transliteration into CJK.** The "bite the wax tadpole" trap — characters must carry acceptable meaning, not just sound. Never approve a Chinese rendering on phonetics alone.
- **Citing debunked cases.** Do not present Chevy Nova ("no va") or KFC "eat your fingers off" as real — they are myth/unsourced (§10). Use verified cases only.
- **Treating any dictionary hit as a blocker.** Over-blocking on low-salience meanings kills good names; rate salience (step 7).

## Gotchas

- **Primary vs secondary market weighting.** The same Fail is a BLOCKER in a launch market and a HIGH caution in a fringe one — always tie the verdict to the brief's market priority.
- **Armenian (and other thin-coverage scripts).** Published screening guidance is sparse; do not fabricate confidence — engage a native linguist and mark the cell unverified.
- **Phonetic traps are systematic, not random.** German v→/f/, Spanish j→/x/, etc. Run the transcription step before the semantic step, or you will miss the homophone class entirely.

## When NOT to use

- **Purely local, single-language brands** — but still screen that language plus any significant local-community languages (immigrant-community languages in the launch city count).
- **As a substitute for a native speaker** in any non-Latin or slang-sensitive market — this skill *flags*, it does not *clear*, those cells.

## References

- KB-07: `knowledge-base/KB-07-BRAND-NAMING.md` §5 (protocol), §4 (phonetics), §10 (verified vs myth), §12 Skill 3.
- Primary sources: verified cases — Mitsubishi Pajero→Montero, Honda Fitta→Jazz/Fit, Vicks/Germany, Mercedes 奔死→奔驰; Snopes/NPR debunk of Chevy Nova; Ćwiek et al. 2022 (bouba/kiki across 25 languages).
- Sibling skills:
  - `name-generation` — upstream; supplies the ungated shortlist.
  - `name-scorecard` — consumes the cross-language safety score (§8 rubric, 10 pts default).
