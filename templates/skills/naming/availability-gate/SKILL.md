---
name: availability-gate
description: Check digital availability for a shortlist using LIVE tools — domains via RDAP/registrar APIs (.com + category TLD), social handles across priority platforms, the branded-SERP test, and an AI-search disambiguation query — then price each (launch + renewal + aftermarket). Use this skill when the user asks "check availability", "is the domain free", "are the handles open", "can we get the .com". Two hard rules: never assert a domain is free without an RDAP/API check, and never auto-fail a name on bare exact-match .com unavailability (offer prefix / .ai / aftermarket options instead).
severity: HIGH
confidence: 0.7
surface: Cowork-or-Code
---

# Availability Gate Skill

> **Trigger**: A shortlist needs its digital footprint checked before selection. The default failures this prevents: (1) the agent hallucinating "yes, that .com is free" with no lookup, and (2) killing a strong name because the exact .com is taken — the single biggest amateur mistake per KB-07 §1.

## What this skill produces

An availability table per candidate — domain (registry status + price), social handles across 6 platforms, branded-SERP verdict, AI-search disambiguation result — with launch-vs-scale costs and a verdict that treats the exact .com as a preference, not a gate.

## Before invoking — mandatory reads

1. `knowledge-base/KB-07-BRAND-NAMING.md` §7 (the domain landscape, RDAP/registrar APIs, social-handle strategy, branded-SERP ownership, AEO/GEO, and the ordered gating protocol with pass/fail thresholds).
2. KB-07 §1 finding 8 (TLD choice carries no SEO ranking weight) and the Placek principle that the .com is "just an area code" — don't let it drive selection.

## Procedure

1. **Domain check via RDAP / registrar API.** Check exact-match .com + the category-canonical TLD (.ai for AI, .io for dev tools, .shop/.store for retail) using a *live* tool. RDAP is the modern structured protocol (replacing WHOIS). PASS if a strong-fit TLD is available ≤ ~$50/yr OR aftermarket ≤ budget; CAUTION if only a compound/prefixed variant is open. **Do NOT auto-fail on bare-.com unavailability.**
2. **Social-handle sweep.** Check the 6 priority platforms (X, Instagram, TikTok, YouTube, LinkedIn, GitHub). PASS if ≥4 of 6 are available with a uniform handle.
3. **Branded-SERP test.** Search the bare name. FAIL if a well-capitalized exact namesake dominates page 1 (you cannot outrank Apple/Amazon for the bare word).
4. **AI-search disambiguation query.** Ask an LLM "what is [name]?". CAUTION if it confidently returns a different established entity (the name is hard to disambiguate in AI answers — an emerging AEO/GEO concern).
5. **Price each candidate** — launch (.com ~$10-15, .ai ~$160/2yr), renewal (recurring), and any aftermarket cost ($15K-$30K typical for a good .com; far higher for premium). Show launch vs scale.
6. **Rate, offering options instead of hard-failing.** When the exact .com is taken, present prefix/suffix/compound, alternative TLD, or aftermarket-purchase paths — let the brief's domain-flexibility flag decide.

## Output format

```markdown
| Candidate | .com (RDAP) | category TLD | handles (≥4/6?) | branded-SERP | AI-disambig | launch $ | verdict |
|-----------|-------------|--------------|-----------------|--------------|-------------|----------|---------|
| Lumio | taken (aftermarket ~$18k) | lumio.ai available | 5/6 | clear | clear | ~$160/2yr | PASS (use .ai) |

Options where exact .com is taken: getlumio.com, lumio.ai, aftermarket bid …
> Availability reflects live RDAP/registry lookups at check time; registry-available
> ≠ trademark-clear (run trademark-clearance) and aftermarket prices move.
```

Worked example shape: a candidate whose .com sits in the aftermarket still PASSES on an available category-fit .ai + 5/6 handles + a clean branded SERP — the .com is noted as a buy option, not a veto.

## Anti-patterns

- **Hallucinating domain availability without RDAP.** The classic LLM failure. If no live lookup tool is available, say so and decline to claim availability — never guess.
- **Treating the exact .com as a hard gate.** KB-07 §1's headline amateur mistake. The .com is a preference; offer alternatives and defer to the brief's flexibility flag.
- **Ignoring the aftermarket.** "Registered" ≠ "unavailable" — many strong .coms are purchasable; price them rather than rejecting the name.

## Gotchas

- **Registry-available ≠ legally safe.** A free .com can still infringe a live trademark — this skill runs alongside `trademark-clearance`, not instead of it.
- **ccTLD quirks.** Some impose local-presence requirements; some registrars (Cloudflare) require their own nameservers and don't support internationalized domains; .ai requires a minimum 2-year registration.
- **AEO/GEO is fast-moving and vendor-sourced.** The AI-disambiguation check is directional, not authoritative — re-verify the tooling landscape quarterly (§7 / KB-VIGILANCE).
- **TLD ≠ SEO.** Don't recommend a TLD "for SEO"; Google treats new gTLDs like .com (§1 finding 8). TLD is a trust/branding call.

## When NOT to use

- **No live RDAP/registrar tool available** — do not run a "from memory" availability check; flag that the gate requires live tooling and hand off to a surface (Cowork/Code) that has it.
- **Names with no digital presence requirement** (internal codenames, signage-only local brands) — a branded-SERP + handle sweep may be all that's warranted.

## References

- KB-07: `knowledge-base/KB-07-BRAND-NAMING.md` §7 (digital availability gating), §1 findings 7-8, §13 quotes 1 (Google gTLD/SEO) & 24 (.ai pricing), §12 Skill 5.
- Primary sources: Google Search Central (gTLD/SEO 2015, reaffirmed); Domain Name Wire (.ai pricing Feb 2026); David Placek (".com is just an area code").
- Sibling skills:
  - `name-generation` — upstream; supplies candidates.
  - `trademark-clearance` — parallel legal gate; registry-availability and TM-clearance are independent.
  - `name-scorecard` — consumes the digital-availability score (§8 rubric, 10 pts default; up to 18 for online-first/B2B).
