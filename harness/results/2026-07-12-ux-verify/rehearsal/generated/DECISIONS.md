# Architecture Decisions — unitkit

> The canonical project ledger of locked architectural and convention calls. One file per project, root-level, version-controlled.
> AI agents: read this before proposing changes. Never re-open a settled question without writing a *new* entry that explicitly supersedes the old one.

## What goes here (and what doesn't)

In: non-obvious calls with cross-cutting impact and a reversal trigger decidable from observable facts.
Out: changelog entries (git history), one-PR-and-done choices (commit messages), preferences a linter/typecheck enforces (rules), temporary calls (code comments).

**Tier: Starter** — solo dev, side project, one-line entries. Graduate to the fuller format (see the kit's [KB-04 §8](<KIT_ROOT>/knowledge-base/KB-04-DECISION-ENGINEERING.md)) when a decision starts getting re-debated despite being in this ledger.

---

## Active Decisions

- **2026-07-12** — #1 Named exports only, no default exports (verified across `units.ts`, `convert.ts`, `index.ts`). Reason: consistent imports and predictable module surface. Reverse if the project adopts a framework that mandates default exports (none does today).

- **2026-07-12** — #2 Factor-based conversion via a single `UNITS` table (`toBase` factors) with a dimension guard in `convert()`. Reason: one data table drives all conversions; adding a unit = one row; cross-dimension conversion is a caught error, not a silent wrong number. Reverse if a unit family needs non-linear conversion (see #3).

- **2026-07-12** — #3 Temperature is deliberately NOT wired into the factor table (the `dimension` union reserves `"temperature"`, the `UNITS` table omits it). Reason: temperature conversion needs an offset (e.g. °C↔°F), which the single-`toBase`-factor model cannot express. Reverse trigger: when temperature ships, add an offset-aware conversion path — do NOT bolt temperature onto the factor table.

- **2026-07-12** — #4 CommonJS output + strict TypeScript with `@typescript-eslint/no-explicit-any: error`. Reason: Node CLI target (`bin` runs `dist/index.js`); banning `any` keeps the tiny surface fully typed. Reverse if the project moves to ESM (`"type": "module"` + `module: esnext`), which would touch imports and the shebang path.

- **2026-07-12** — #5 No test suite yet (deferred, pre-MVP). Reason: solo side project; behavior is small and readable. When tests are added, use Node's built-in `node:test` (zero new dependency, Node 20) over adding a framework, unless a reason to prefer Vitest/Jest is recorded here first.

Graduation signal: a decision above starts getting re-debated despite being written here → move to the fuller entry format (reversal triggers + re-verify cadence).

---

## Numbering protocol

```bash
grep -c "^- \*\*20" DECISIONS.md   # count entries; next number = highest #N + 1
```

Never re-number a locked entry — it breaks every commit message and rule that references it. If unsure, append a new entry that supersedes the old one by number.
