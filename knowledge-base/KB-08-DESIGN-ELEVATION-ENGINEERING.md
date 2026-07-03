# KB-08 — Design-Elevation Engineering

> **Status (v0.17.0, 2026-07-02):** reference doc **and** skill family **shipped**. `templates/skills/design/` (design-architect, design-engineer, design-reviewer, elevation-workflow) + `templates/shared/DESIGN-SPINE.md.template` install via the conditional generator gate (PROJECT_SETUP_PROMPT Phase 0.1 item 10 / Phase 1.5 / §3.1 / §3.8) — fired on frontend/design/UX detection (component framework + token/theme file), wired exactly like KB-03/KB-07.

> **Companion:** **KB-05** (Conversational-Decision-Engineering — its adversarial/anti-sycophancy
> discipline is the *parent* of the design-critique loop here; reuse it, don't reinvent), **KB-04**
> (Decision-Engineering — lock a chosen design direction in `DECISIONS.md` the same way you lock any
> decision), **KB-02 §6** (Quality & Accuracy Maximization — this doc *extends* "prove it works"
> from code correctness to visual/CWV/a11y by measurement).
>
> **When to read (CONDITIONAL):** read only when a project has a **frontend / design / UX
> deliverable** — the same way KB-03 (catalog) is read only for data-pipeline projects and KB-07
> (naming) only for branding work. If the project is back-end / data / API only, skip this.
>
> **The one-line thesis:** *design quality is engineered, not vibed.* You **establish** a coherent
> design concept, **elevate** it adversarially toward best-in-world, and **verify it by
> measurement** — never by "does this look good to me?". And you **codify the decision LOGIC** so the
> next agent builds *in the concept* understanding the why, not by copying the last screen.

---

## §1 — Why this exists (the gap this fills)

LLM agents are good at producing *plausible* UI and bad at three things that separate competent
frontends from best-in-world ones:

1. **They assert instead of measure.** "The animation works / the parallax is subtle / desktop is
   unchanged" — stated, not measured. The most expensive frontend bugs are confident assumptions
   that were never checked against the running browser.
2. **They copy instead of decide.** Given an existing good page, an agent reproduces its *shape* on
   a new page without understanding *why* that shape was chosen — so the new element is wrong for its
   own job, or the concept slowly drifts.
3. **They elevate by taste-poll.** Asked to "make it better," they either ask the human which option
   they prefer (a menu) or apply generic polish — instead of running an adversarial, evidence-grounded
   critique that names the gap to best-in-world and closes it.

KB-08 is the discipline that fixes all three. It is **brand-agnostic** — the *process*, not any
project's tokens. A worked instance lives in `case-studies/` (§10); never inline a project's design
specifics into this doc.

---

## §2 — Establish the concept (a design system is a sentence written in time + space)

Before any elevation, a project needs a **singular, coherent design concept** an agent can decide
*from*. The hallmarks of a concept that survives many agents:

- **One identity, statable in a sentence.** A concept you can't compress to a sentence ("things
  arrive, never shout"; "brutally honest, brutally fast") is a mood board, not a system. Everything —
  layout, motion, type, color, copy — must be *the same sentence* expressed in a different medium.
  Motion that contradicts the brand sentence at the engine level is a defect, however pretty.
- **A CLOSED vocabulary, not an open one.** The biggest *structural* weakness of most AI frontends
  is too few section *shapes* (many sections, two layouts). Fix it with a **closed, fixed set of
  section archetypes** — each doing one job, each carrying one locked behavior. Richness comes from
  *sequencing* the vocabulary, not from inventing new shapes per page. A closed set is what makes the
  system *teachable and enforceable*.
- **A locked budget / set of invariants — and the budget IS the design.** The ceiling (e.g. "one
  ceremonial motion per page", "zero `transition:all`", "CLS 0.00") is not a constraint *on* the
  design; it *is* the design. The recurring failure mode of a good concept is not loudness — it is
  **escalation** (taking one calibrated move and using it everywhere until it tips). Guard the
  budget; never multiply a signature.
- **Grounded in measured evidence, not assertion.** Establish the concept against a *measured*
  reference set (study how the field's leaders actually build — real durations, real layout widths,
  real perf numbers — via a live-site observation pass), and an honest measurement of your own
  starting point. "We are understated" or "we are too loud" should be a measured claim, not a vibe.

Lock the chosen concept as a decision (KB-04 discipline) so it is auditable and stable.

---

## §3 — Codify the decision LOGIC (the spine: teach how to choose, not what to copy)

A concept's *values* (the exact tokens, the archetype specs, the motion identity) will live in
reference docs. But values alone let an agent copy, not decide. The high-leverage artifact is a
**decision spine** — one START-HERE doc that an agent reads before building any new element, that
walks an ordered decision sequence:

> **job + emotional moment → archetype → layout → motion (or static) → primitive → type/color/a11y →
> responsive → verify by measurement.**

Each step is a **rubric** ("when you face situation X, choose Y *because* Z"), not a spec. The spine:

- **Teaches the WHY, so a new case can diverge.** "The homepage did X" is never a reason; *why* it
  did X is — and the why may call for a different X on the new element. This is the difference between
  *building in the concept* and *cloning the last screen*.
- **Carries the project's hard-won lessons** (a "gotchas / war-stories" section) so the next pass
  starts where the last ended, not from zero.
- **Names the boundary:** the spine + reference docs hold the project specifics; the generalized
  discipline is KB-08. Keep them separate.

The spine is the single most valuable design artifact you can produce for a multi-agent project —
it converts a pile of locked values into a *decision system*.

---

## §4 — The adversarial elevation recipe (how to make a surface best-in-world)

The proven loop to elevate any page/surface. Do **not** elevate by generic polish or a taste-poll.

1. **Adversarial critique grounded in the REAL render + in-repo evidence.** Run a multi-critic pass
   (one critic per section + cross-cutting critics for typography/rhythm/motion/CRO/a11y/perf). Each
   critic: (a) reads the actual current code AND how it renders live, (b) names the *specific*
   best-in-world reference + the technique it uses that you don't, (c) honestly rates the gap, (d)
   returns **ranked, concrete, lock-safe, implementable-now** findings. The bar is explicit:
   *"competent" is a failure*. Critics must be told the locks/invariants so they don't propose
   lock-breaking changes.
2. **Synthesize → a ranked `implementNow` list** (dedupe across critics; drop the vague / the
   needs-new-assets; rank by impact-to-effort). This list gets implemented verbatim.
3. **Implement reusing primitives** (§7) — compose, never re-inline.
4. **VERIFY BY MEASUREMENT** (§5) — the non-negotiable step.
5. **Adversarial gate** before merge (§5).

**Scale the rigor to the ask:** "find any bugs" → a few critics, single-vote verify; "make it
best-in-world / be exhaustive" → a larger critic pool + a synthesis stage + adversarial verify.

**Operational lessons (cross-project):**
- **Batch fan-out workflows ≤ 3–4 agents at a time** on a busy server. A 12-agent *burst* trips
  server-side rate-limits ("temporarily limiting requests · not your usage limit") even when you're
  under your own quota — run them in sequential batches (`for (i += 3) await parallel(slice)`), not
  one parallel blast.
- **The critique grounds in reality, the synthesis ranks, the human signs off on the *result*** (the
  live surface), not on a menu of options. Show the measured outcome, not a choose-your-own poll.
- **A reusable agent chain** carries the loop: an *architect* agent (designs the plan/score,
  read-only) → an *engineer* agent (implements, with a permanent DRY/extract-not-duplicate/right-
  layer/leave-cleaner mandate) → an *adversarial reviewer* agent (the measuring merge-gate). Install
  these once per project; they inherit the locks.

---

## §5 — Verify by measurement (the cardinal rule)

**Prove it; never assert it.** This is KB-02 §6's "prove it works" extended from code to the
*visual/behavioral/performance* surface. Every claim is a measured number against the running app:

- **Motion:** measure the actual `transform` (or a `getBoundingClientRect` delta) across scroll
  positions — a scroll/parallax animation that "should" move can be silently dead. Read **after
  `requestAnimationFrame ×2` + a small timeout**: a real browser's devtools read taken synchronously
  right after a programmatic scroll returns the *pre-scroll* frame. Drive the **real browser** (it
  hydrates client components; lightweight preview harnesses often don't).
- **Responsive / "unchanged" claims:** `getComputedStyle` the changed values at each breakpoint. If
  an owner **locks a surface** ("don't touch the desktop — I love it"), every change is scoped to the
  unlocked breakpoints (e.g. base/`sm:` + an `lg:` guard restoring the desktop value) and **byte-
  parity is proven by measuring the computed value at the locked width** — never trusted from the
  responsive-split intent. (A real instance: a reviewer-suggested "min-height" fix *grew* a locked
  desktop band by un-clipping content; only a measurement at the locked width caught it.)
- **Perf / a11y / stability:** measure CLS across a full scroll (target 0); run an axe/accessibility
  pass + Lighthouse. Note dev-server perf is inflated (unminified bundles + placeholder asset hosts) —
  the gate is the **production/CI build**, not the dev number.
- **The adversarial gate before merge:** a reviewer that *measures* (every locked anti-pattern + real
  Lighthouse/CWV + axe + reduced-motion parity) and renders an **identity-coherent Y/N** — a
  clean-but-incoherent change does NOT merge — plus a generic correctness/security/dedup reviewer.
- **Grep the diff** for the project's lock literals (banned easings, `transition:all`, layout-prop
  animations, banned color/copy patterns).

**Why this is the cardinal rule:** across a long real arc, the most costly mistakes were *all*
confident assumptions never checked against the browser — a "subtle parallax" that was 0%; a
"desktop-unchanged" split that wasn't; a "static resting state" that animated. Measurement is cheap;
the bug it prevents is not.

---

## §6 — Don't elevate by taste-poll (the anti-sycophancy parallel)

Aesthetic judgment feels un-falsifiable, so agents either ask the human to pick (a menu) or apply
generic polish. Both are failures. The discipline (a sibling of KB-05's anti-sycophancy):

- **Critique against a NAMED best-in-world reference + a measured gap**, not "do I like it?". "VCA
  does X with technique Y; we don't; here's the lock-safe way to close it" is falsifiable and
  actionable. "I think it's nicer blue" is not.
- **Deliver the expert call; show the result.** When the work is a clear engineering/design judgment,
  make it and show the measured live outcome — don't survey the human with option-menus. Reserve
  questions for genuine forks the human alone can resolve (brand taste at a real branch point), and
  even then ground them in evidence, not preference.
- **The human's taste is a locked *lens*, applied with evidence.** Capture the owner's taste
  direction once (e.g. "measured boldness — noticeable but never loud") and *apply* it through the
  critique; don't re-poll it every iteration. (A documented anti-pattern: running
  research→recommend→ask→react in a loop instead of delivering one complete, evidence-grounded pass.)

---

## §7 — Compose, don't reinvent (the primitive + lock discipline)

- **Reuse-first, extract-don't-duplicate.** New work composes from the project's shipped primitive
  vocabulary (the one image-slot, the one heading, the one reveal, the one underline). If a job
  genuinely has no primitive and recurs (≥2×), *extract* a new one at the right layer — never one-off
  it. Leave the codebase cleaner than you found it.
- **Locks are sacred.** A change that breaks a locked invariant (the motion budget, a brand-color
  scope, a crown-law like "product pixels are always real photos") is wrong by definition, however
  good it looks. Lock-safety is a critic/gate criterion, not a suggestion.
- **Lock the elevation's outcomes** (new primitives, an amended ceiling, the codified process) as a
  decision (KB-04) so the system stays coherent across agents and the next pass inherits it.

---

## §8 — Install (the reusable toolkit)

The portable pieces of this discipline, to seed into a frontend project:

- **A decision-spine doc** (§3) — the project authors it from its own concept; this KB is the
  template for *what a spine must contain* (the ordered rubric + the lessons + the boundary note).
- **The agent chain** (§4) — architect → engineer (with the DRY/quality mandate) → adversarial
  reviewer (the measuring gate). Generalized skill/agent templates live under
  `templates/skills/design/<name>/SKILL.md` (strip any project's tokens; keep the *process*).
- **The elevation workflow** — a multi-critic + synthesis script (batched ≤3–4), reusable per
  surface.
- **Generator wiring** — a Phase-1.5 detection branch ("does the project have a frontend/design/UX
  deliverable?") installs the design pack, mirroring exactly how the naming/catalog conditional packs
  are gated. Detect a design/UX surface (a component framework + a token/theme file) → install the
  spine template + the agent chain + this KB pointer.

---

## §9 — Anti-patterns (the meta-failure modes — each has bitten a real project)

- **Asserting instead of measuring.** "It works / it's subtle / desktop is unchanged" with no
  measured number. → Measure it (§5).
- **Copying instead of deciding.** Reproducing a good page's shape on a new element without the why.
  → Run the spine (§3); decide from the rubric.
- **Elevating by taste-poll or generic polish.** → Adversarial critique vs a named reference (§4/§6).
- **Escalation.** Multiplying a calibrated signature until the concept tips loud. → Guard the budget;
  the budget is the design (§2).
- **Re-inlining.** Hand-rolling what a primitive already does → drift + divergence. → Compose (§7).
- **Skipping the gate.** Merging motion/visual changes without the measuring adversarial review. →
  Gate every surface (§5).
- **The 12-agent burst.** Fanning out a large critic workflow in one parallel blast → rate-limit. →
  Batch ≤3–4 (§4).
- **No silent caps.** If a critique/pass bounds its coverage (top-N, sampling, one breakpoint),
  *say so* — silent truncation reads as "covered everything" when it didn't.

---

## §10 — Case study (the worked instance — referenced, never inlined)

The patterns here were distilled from a real-world **a production e-commerce project storefront experience
system**: a singular motion identity, a closed archetype vocabulary, a locked one-ceremony-per-page
budget, a decision spine (`building-in-the-concept.md`), and an
architect→engineer→adversarial-reviewer elevation chain. The fully-instantiated worked example — the
project's motion name, color tokens, archetype set, brand invariants, and the elevation arc whose
lessons (a silently-dead parallax caught by measuring transform; desktop byte-parity-by-measurement;
the batched critique workflow) seeded §4/§5 — lives at the private lab's worked instance (not shipped). **This KB
holds only the domain-agnostic discipline; every project specific stays project-local.**

---

**Refresh:** event-triggered when a new frontend/design project exercises the discipline and surfaces
a generalizable lesson, or when the agent-chain/skill templates evolve. Baseline 2026-06-24 (lifted
from the the private lab's worked instance (not shipped) elevation arc). Next free KB number after this: **KB-09**.
