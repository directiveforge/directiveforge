# AI Workflow Brief — unitkit

> First artifact of the DirectiveForge setup run. Run-specific codebase analysis (Phase 1).
> The maturity tier decided here drives every subsequent install decision.

## Project Identity
- **Name**: unitkit v0.3.1 — "Tiny CLI for converting between metric and imperial units"
- **Type**: Node CLI, npm-publishable (`bin.unitkit` → `dist/index.js`, shebang `#!/usr/bin/env node`)
- **License**: MIT · **Repo**: created 2026-07-12 · 4 commits · 1 contributor

## Stack (exact versions, from package.json / tsconfig.json / .eslintrc.json)
- **TypeScript** 5.4.2 — `strict: true`, `target: ES2022`, `module: commonjs`, `rootDir: src`, `outDir: dist`, `declaration: false`, `esModuleInterop`, `skipLibCheck`
- **Node types** `@types/node` ^20.11.0
- **ESLint** 8.57.0 + `@typescript-eslint/parser` 7.1.0 + `@typescript-eslint/eslint-plugin` 7.1.0 — extends `eslint:recommended` + `plugin:@typescript-eslint/recommended`; project rule `@typescript-eslint/no-explicit-any: error` (bans `any` outright)
- **Package manager**: npm (per README `npm run …`; no lockfile committed — inferred, not lockfile-proven)
- **Scripts**: `build` = `tsc` · `lint` = `eslint src --ext .ts` · (no `test` script)

## Architecture (src/, 63 LOC, 3 files)
- `src/units.ts` — `UnitDef` interface + `UNITS` table + `findUnit(token)` name/alias lookup (lowercased). Dimension union `"length" | "mass" | "temperature"`; only length + mass populated.
- `src/convert.ts` — `ConversionError extends Error` + `convert(value, from, to)`: factor-based `(value * f.toBase) / t.toBase` with a dimension-mismatch guard.
- `src/index.ts` — entry point; positional parse `unitkit <value> <from> in <to>`; returns exit codes (0 ok / 1 ConversionError / 2 usage); `console.log`/`console.error`; `process.exit(main(...))`.
- No server / router / DB / ORM / auth / CMS / state-mgmt / styling / i18n. Not a monorepo. No CI/CD, no deploy target.

## Conventions (detected from source, not assumed)
- **Named exports/imports only** — zero default exports.
- **Module system**: CommonJS (ESM import syntax compiled to CJS). Relative imports, no file extensions.
- **File naming**: lowercase single-word (`units.ts`, `convert.ts`, `index.ts`).
- **Error handling**: custom `Error` subclass + throw, caught at the CLI boundary via `instanceof`; exit codes encode the failure class; unexpected errors are re-thrown.
- **Logging**: `console.*` (correct for a CLI — not structured logging).
- **TS strictness**: `strict` + `no-explicit-any: error`.

## Domain & Constraints
- Developer utility / CLI tooling. Users: CLI/dev users. Personal side project, pre-MVP.
- No regulatory constraints (no PII / payments / auth / PHI). No branding or designed surface. No i18n.
- **Pack gates**: KB-03 catalog-pipeline — `not-triggered` · KB-07 naming — `not-triggered` · KB-08 design — `not-triggered`. No pack proposals surfaced: no detection gate is met.

## DRIFT-QUARANTINE
```
DRIFT-QUARANTINE
(empty — every README claim verified against code: usage example `5 km` → `3.1069 miles`
computes exactly [(5*1000)/1609.344 = 3.10686 → toFixed(4)]; build/lint scripts match
package.json; "temperature on the roadmap" matches units.ts [dimension union carries
temperature, UNITS table omits it]; "No tests yet" matches the absent test script.)
```

## Maturity Tier: STARTER
All four Starter signals fire; zero Intermediate/Advanced signals; no stakes override:
- **Solo developer** — 1 contributor across 4 commits.
- **Side project / pre-MVP** — README "Personal side project"; no deployment artifacts.
- **< 6 months old AND < 10k LOC** — created today; 63 LOC total.
- **Operator** — "Solo personal side project, pre-MVP … I just want the basics."
- **Stakes override — not triggered**: no decision ledger with external-audit exposure, no spend-authorization gates, no compliance/contractual commitments.

**Install consequence**: v0.8.0 baseline (context docs, rules, skills, agents, MCP, commands) + the 5 BLOCKER decision skills + DECISIONS.md Tier 1 (one-line entries). Skipped by tier: KB-04 rules / architect-prompt / research skills, the HIGH+MEDIUM decision skills, `council-3-voice`, surface-routing integration (Phase 4.5), vigilance bootstrap (Phase 7), mission-dispatch (Phase 8).

**Preset**: none matched (not Next.js / FastAPI / Express-family; a manifest exists, so not the docs-ops branch) → generated from KB principles.

**IDE scope**: `claude-code` (greenfield — neither `.cursor/` nor `.claude/` exists with git history; the session surface alone decides).
