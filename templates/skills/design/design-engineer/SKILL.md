---
name: design-engineer
description: Implement a design-architect implementNow list verbatim under the permanent reuse-first / extract-don't-duplicate / leave-cleaner mandate, with the project's locks treated as sacred. Use this skill when an elevation plan exists and the user says "implement the plan", "apply the findings", "build it". Never invents scope beyond the list.
severity: MEDIUM
confidence: 0.8
surface: Code
---

# Design Engineer Skill

> **Trigger**: A ranked `implementNow` list exists (from `design-architect`) and needs implementing. The default failures this prevents: re-inlining what a primitive already does, silently expanding scope beyond the plan, and "improving" a locked invariant.

## What this skill produces

The implemented `implementNow` list — every finding either shipped or explicitly returned with a reason — composed from the project's primitive vocabulary, leaving the codebase cleaner than found.

## Before invoking — mandatory reads

1. The `implementNow` list being implemented (verbatim — it is the scope contract).
2. The project's decision spine — specifically the **primitive vocabulary** section and the **locks/budgets**.
3. `knowledge-base/KB-08-DESIGN-ELEVATION-ENGINEERING.md` §7 (compose, don't reinvent).

## Procedure

1. **Take the list verbatim.** Each finding is a work item; nothing outside the list gets touched. A tempting adjacent improvement goes back to `design-architect` as a note, not into this diff.
2. **Reuse first.** For every item, search the primitive vocabulary (the project's one image-slot, one heading treatment, one reveal, one underline…) before writing anything new — compose, never re-inline.
3. **Extract when a job recurs.** No primitive fits AND the job recurs (≥2×)? Extract a new primitive at the right layer and note it for the spine's vocabulary table. One-off hand-rolls are a defect.
4. **Locks are sacred.** Before each edit, check it against the locks (motion budget, brand-color scope, crown laws). A finding that turns out to require breaking a lock is RETURNED, not implemented "carefully".
5. **Self-verify while working**: run the project's quality gates after each batch; measure the specific visual/motion claims you are changing (the `design-reviewer` gate re-measures, but don't ship blind).
6. **Leave it cleaner**: dead styles, orphaned variants, and duplicated fragments touched by this work get cleaned in the same pass.

## Output format

```markdown
## Implementation Report: [surface]
| # | Finding | Status | How (primitive used / extracted) |
|---|---------|--------|----------------------------------|
| 1 | [item] | shipped | composed from [primitive] |
| 2 | [item] | RETURNED | requires breaking [lock] — back to architect |

New primitives extracted: [name + layer, or "none"] → add to the spine vocabulary
Cleanup performed: [list or "none"]
```

## Anti-patterns

- **Scope invention.** "While I was here I also…" — the plan is the scope; adjacent ideas go back to the architect.
- **Re-inlining.** Hand-rolling what a primitive does creates drift; the divergence surfaces months later as visual inconsistency.
- **Careful lock-breaking.** There is no careful way to break a lock — a lock-breaking finding is mis-planned and goes back.

## Gotchas

- **The ≥2× extraction rule cuts both ways**: extracting a primitive for a one-off job adds abstraction cost with no reuse payoff — wait for the second occurrence.
- **New primitives that never reach the spine's vocabulary table are invisible** to the next agent — the extraction isn't done until the spine knows about it.
- **Dev-server rendering lies about perf** — unminified bundles and placeholder asset hosts inflate numbers; leave perf verdicts to the reviewer's production-build measurement.

## When NOT to use

- **No implementNow list exists** — run `design-architect` first; implementing from a raw critique or a verbal wish re-opens the taste-poll failure mode.
- **The change is pure copy/content** — content edits don't need the elevation chain, just the normal review gates.

## References

- KB-08 §7 (primitive + lock discipline), §5 (measurement — the reviewer's gate)
- Chain: `design-architect` → `design-engineer` → `design-reviewer`, orchestrated by `elevation-workflow`
