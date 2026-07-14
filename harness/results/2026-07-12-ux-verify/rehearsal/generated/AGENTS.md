# unitkit

A tiny command-line unit converter (metric ↔ imperial, length + mass) for developers and CLI users.

## Stack

- **Language**: TypeScript 5.4.2 (`strict: true`, `target: ES2022`, `module: commonjs`)
- **Runtime**: Node.js (types `@types/node` 20.11; no `engines` field declared)
- **Framework**: none — plain Node CLI (`bin.unitkit` → `dist/index.js`)
- **Database**: none · **Auth**: none · **Styling**: none
- **Testing**: none yet — recommended runner: Node's built-in `node:test` (zero-dependency; DECISIONS #5)
- **Lint**: ESLint 8.57 + `@typescript-eslint` 7.1 (`no-explicit-any: error`)
- **Package manager**: npm (no lockfile committed)
- **Deployment**: none (npm-publishable via `bin`; not currently published)

## Dev Commands

```bash
npm run build                       # tsc: compile src/ → dist/ (also type-checks)
npm run lint                        # eslint src --ext .ts
node dist/index.js 5 km in miles    # run the built CLI  →  5 km = 3.1069 miles
```

## Directory Structure

```
src/
  units.ts      # UnitDef interface + UNITS table + findUnit()
  convert.ts    # convert() + ConversionError (factor math + dimension guard)
  index.ts      # CLI entry (bin → dist/index.js): argv parse + exit codes
dist/           # compiled CommonJS output (git-ignored, built by tsc)
```

## Architecture

- Single-package Node CLI. Entry `src/index.ts` (shebang `#!/usr/bin/env node`), published as `bin.unitkit` → `dist/index.js`.
- Data-driven conversion: one `UNITS` table of `toBase` factors drives every conversion — add a unit by adding a row, no code change.
- Layering: `index.ts` (I/O + exit codes) → `convert.ts` (pure math + errors) → `units.ts` (data). Lower layers never import upward.

## Key Constraints

- NEVER use `any` — `.eslintrc.json` sets `@typescript-eslint/no-explicit-any: error`.
- NEVER add temperature units to the `UNITS` factor table — temperature needs offset math, not a single factor (DECISIONS #3).
- Named exports only — no default exports.
- Run `npm run build` + `npm run lint` after every change; do not report done on a red gate.

## DirectiveForge Kit

Engineering standards, MCP catalog, and validation checklists are at `<KIT_ROOT>`. Consult when:
- Discovering / evaluating MCP servers → `<KIT_ROOT>/knowledge-base/MCP-SERVER-REGISTRY.md`
- Writing or updating rules / agents → `<KIT_ROOT>/knowledge-base/KB-02-AI-PROJECT-INFRASTRUCTURE.md`
- Verifying generated output → `<KIT_ROOT>/generator/VALIDATION_CHECKLIST.md`

## Environment Variables

unitkit reads NO environment variables (no `process.env` usage in `src/`). There is no `.env.example` and none is needed.

## File Location Reference

| Type | Location |
|------|----------|
| Unit definitions / table | `src/units.ts` |
| Conversion math + errors | `src/convert.ts` |
| CLI entry + arg parsing | `src/index.ts` |
| Build output (git-ignored) | `dist/` |
