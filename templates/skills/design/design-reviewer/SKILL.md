---
name: design-reviewer
description: The measuring merge-gate for design/motion/visual changes — measures actual transforms, computed styles per breakpoint (including locked-width byte-parity), CLS across full scroll, axe + Lighthouse on the production build, reduced-motion parity, and greps the diff for lock literals; renders an identity-coherent Y/N. Use this skill before merging ANY design-affecting change: "does this merge", "design review", "verify the elevation".
severity: HIGH
confidence: 0.8
surface: Code
---

# Design Reviewer Skill

> **Trigger**: A design/motion/visual change wants to merge. The default failure this prevents is the assert-instead-of-measure class: "the animation works / desktop is unchanged / it's subtle" — stated, never checked against the running browser. A clean-but-identity-incoherent change also does NOT merge.

## What this skill produces

A measured gate verdict — every claim a number from the real browser — ending in an explicit **MERGE: YES/NO** with the failing measurements named. Runs alongside (not instead of) the generic correctness/security reviewer.

## Before invoking — mandatory reads

1. The project's decision spine — concept sentence, locks/budgets, lock literals (banned easings, `transition:all`, layout-prop animations, banned patterns).
2. `knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md` §5 (verify by measurement — the cardinal rule).

## Procedure

1. **Motion claims → measure the transform.** Read the actual `transform` (or a `getBoundingClientRect` delta) across scroll positions in the REAL browser. Read **after `requestAnimationFrame ×2` + a small timeout** — a synchronous read right after a programmatic scroll returns the pre-scroll frame. A "should move" that measures 0 is a silent-dead animation.
2. **Responsive / "unchanged" claims → `getComputedStyle` at each breakpoint.** If the owner locked a surface ("don't touch desktop"), prove **byte-parity at the locked width** by measuring the computed values — never trust the responsive-split intent.
3. **Stability → CLS across a full scroll** (target: the project's locked budget, typically 0).
4. **A11y + perf → axe pass + Lighthouse on the PRODUCTION build** — dev-server numbers are inflated (unminified bundles, placeholder asset hosts) and do not count.
5. **Reduced-motion parity**: with `prefers-reduced-motion`, ceremonial motion degrades per the spine's rule — measure, don't assume.
6. **Grep the diff for lock literals**: banned easings, `transition:all`, layout-property animations, banned color/copy patterns — any hit is an automatic NO.
7. **Identity-coherence check**: does the change speak the concept sentence? Technically clean but off-concept → NO, with the incoherence named.

## Output format

```markdown
## Design Gate: [change/surface]
| Check | Claim | Measured | Verdict |
|-------|-------|----------|---------|
| motion: [element] | moves on scroll | transform 0→[Npx] @ rAF×2 | PASS |
| locked width [W] | unchanged | computed values byte-equal: [y/n] | PASS/FAIL |
| CLS (full scroll) | ≤ [budget] | [number] | … |
| axe / Lighthouse (prod build) | — | [violations / scores] | … |
| reduced-motion | degrades per spine | [measured behavior] | … |
| lock-literal grep | clean | [hits] | … |
Identity-coherent: [YES/NO — one sentence why]

MERGE: YES / NO — [failing measurements if NO]
```

## Anti-patterns

- **Accepting asserted numbers.** The implementer's "verified locally" is a claim, not a measurement — this gate re-measures.
- **Gating on the dev build.** Dev perf numbers are fiction; only the production/CI build counts.
- **Passing clean-but-incoherent work.** Zero violations + wrong identity = NO. The concept sentence is a gate criterion.

## Gotchas

- **The pre-scroll-frame trap**: devtools reads taken synchronously after a programmatic scroll return the previous frame — always rAF×2 + timeout before reading.
- **Lightweight preview harnesses don't hydrate client components** — a "dead" animation may just be an unhydrated one; drive the real browser.
- **A locked-surface fix can leak**: a well-intended change (e.g. a min-height fix) can grow a locked band by un-clipping content — only the measurement at the locked width catches it.

## When NOT to use

- **Non-visual changes** (pure logic, data, docs) — the generic reviewer + verifier cover those; this gate adds nothing.
- **Exploratory prototypes that will not merge** — measure before merge, not during sketching.

## References

- KB-08 §5 (measurement protocol), §9 (anti-patterns)
- Chain: `design-architect` → `design-engineer` → `design-reviewer`, orchestrated by `elevation-workflow`
