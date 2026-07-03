# FIXTURE-CARD — greenfield-next

**Tempo Deck** is an invented early-stage, solo hobby-tier Next.js App Router web app for
logging metronome practice sessions (a musician drills a pattern at some BPM for some
minutes; the app shows the sessions and total time on the click). It is deliberately thin:
a seeded in-memory session list rendered by three presentational components, one email
helper stub, and standard Next.js + Tailwind config. There is no database, no auth, no
tests, no i18n, no CMS, and no `pages/` directory — those absences are the negative signals.
The design surface is real (customized Tailwind theme tokens: brand colors, a display
font-family var, a custom spacing token, a custom radius). The fixture is 100% synthetic and
install-free (the lockfile is a stub that is never installed).

## File tree

```
greenfield-next/
├── FIXTURE-CARD.md                 ← this answer key (OUTSIDE repo/, never copied into a run)
└── repo/                           ← the fake project (only this dir is copied for a benchmark run)
    ├── .env.example                 2 vars, each with a purpose comment
    ├── .eslintrc.json               next/core-web-vitals (matches `next lint`)
    ├── .gitignore                   standard Next.js ignores
    ├── README.md                    accurate; matches code (zero false-content traps)
    ├── next-env.d.ts                Next.js type shim
    ├── next.config.ts               minimal config
    ├── package-lock.json            lockfileVersion 3 stub, root entry only (strict JSON)
    ├── package.json                 npm; scripts dev/build/start/lint only (NO test)
    ├── postcss.config.mjs           tailwindcss + autoprefixer
    ├── tailwind.config.ts           CUSTOMIZED theme (color/font/spacing/radius tokens)
    ├── tsconfig.json                strict: true
    ├── vercel.json                  minimal real-schema deploy config
    ├── app/
    │   ├── globals.css              @tailwind layers + brand css vars
    │   ├── layout.tsx               RootLayout — named export (+ default re-export)
    │   └── page.tsx                 HomePage — reads NEXT_PUBLIC_APP_NAME
    ├── components/
    │   ├── beat-counter.tsx         BeatCounter — named export
    │   ├── session-list.tsx         SessionList — named export
    │   └── tempo-badge.tsx          TempoBadge — named export
    └── lib/
        └── email.ts                 sendPracticeRecap — reads process.env.RESEND_API_KEY
```

19 files in `repo/` (≤20 ceiling satisfied).

## Answer key (frozen at fixture commit)

| ID | Fixture fact | Falsifiable detection criterion on the generated workflow |
|----|--------------|------------------------------------------------------------|
| **S1** | Stack is Next.js **App Router**, version **15.1** (`next` pinned `15.1.6` in `package.json`); React 18.3, TypeScript, Tailwind 3.4. | Generated `CLAUDE.md` **and** `AGENTS.md` each name "Next.js" **and** "App Router" **and** the exact `major.minor` **`15.1`** (from `package.json` `next` field). FAIL if either file omits App Router, states a different major.minor (e.g. `14.x`, `15.3`), or claims Pages Router. |
| **S2** | Package manager is **npm** — `package-lock.json` present; no `pnpm-lock.yaml`/`yarn.lock`/`bun.lockb`. | Every install/run command in generated `CLAUDE.md`, `AGENTS.md`, rules, and any command/skill file uses `npm ...` (`npm install`, `npm run dev/build/lint`). **Zero** occurrences of `pnpm`, `yarn`, or `bun` as a command verb anywhere in the generated workflow. |
| **S3** | Design surface present: React components **plus** a customized Tailwind theme (`tailwind.config.ts` `extend` adds custom `colors.beat/stage/accent`, `fontFamily.display` via css var, `spacing.gutter`, `borderRadius.card`). | The design pack installs: `.claude/skills/design/` contains **4** skills — `design-architect`, `design-engineer`, `design-reviewer`, `elevation-workflow` — **and** a `docs/design/DESIGN-SPINE.md` template exists. FAIL if the design pack is absent, or fewer than the 4 named skills are present. |
| **S4** | **NEGATIVE — no tests.** No test files, no test runner in deps, no `test` script in `package.json`. | No testing rule file is generated (no `.claude/rules/testing.md` / `.cursor/rules/*test*` / equivalent), **and** no `test` command string (`npm test`, `vitest`, `jest`, `playwright test`) appears in any generated file. FAIL if a testing rule or a test command is introduced. |
| **S5** | **NEGATIVE — no database.** No ORM/DB deps, no `prisma/`, no migrations, no schema. | No database rule file generated **and** no migration skill/command generated (no `migrate`/`prisma`/`drizzle`/`db:*` command or skill). FAIL if any DB rule, migration skill, or migration command appears. |
| **S6** | **Deployable to Vercel** — `vercel.json` present with the Next.js framework preset. | A deploy command **or** deploy skill is generated (e.g. `.claude/commands/deploy.md` or a `deploy` skill) that references Vercel. `vercel.json` is the evidence the target is deployable. FAIL if no deploy affordance is generated at all. |
| **S7** | **Conventions:** named exports only (every component/`lib` file uses `export function`/`export const`; the two App Router entries add a `default` re-export as the framework requires); filenames are **kebab-case**. | Generated rules (Claude and/or Cursor) explicitly state **named exports** as the convention **and** **kebab-case** file naming. FAIL if rules mandate default exports, or PascalCase/camelCase file naming, contradicting the actual code. |
| **S8** | **Strict TypeScript** — `tsconfig.json` has `"strict": true`. | Generated `CLAUDE.md` and/or a generated rule states TypeScript **strict mode** is in force. FAIL if strict mode is never asserted, or a rule tells the agent to relax/disable strict. |
| **S9** | `.env.example` exists with exactly 2 vars: `RESEND_API_KEY` (read in `lib/email.ts`) and `NEXT_PUBLIC_APP_NAME` (read in `app/page.tsx`). | The pre-existing `.env.example` is **not deleted and not overwritten** (its 2 original lines/comments survive byte-identical or as an append base). If the generator adds env var names, each added name is one **actually read in code** (grep `process.env.<NAME>` hits a repo file). FAIL on deletion, wholesale rewrite, or an added var name that is read nowhere in `repo/`. |
| **S10** | **No phantom commands** — the only scripts that exist are `dev`, `build`, `start`, `lint`; the only lint/deploy binaries evidenced are `next lint` / Vercel. | Every command string in generated `CLAUDE.md`, `AGENTS.md`, and rules resolves to (a) a script in `package.json` `scripts`, or (b) a binary the repo evidences (`next` via the `next` dep, `npm`, `vercel` via `vercel.json`). FAIL on any invented command (e.g. `npm run typecheck`, `npm test`, `npm run format`) with no backing script or evidenced binary. |

## Scripted operator answers

Verbatim answers a setup/generator agent should receive for any interactive question it asks.
If the agent asks something not covered here, apply the closest match; default bias is the
minimal, hobby-tier, no-extras option.

| If the agent asks… | Answer verbatim |
|--------------------|-----------------|
| Which IDE(s) / surface scope? | **"Both Cursor and Claude Code"** |
| Project maturity / ambition / how far to take this? | **"I just want the basics"** (solo side project, no production users yet) |
| Where does this deploy? / hosting? | **"Vercel hobby"** |
| Any opt-in offers (extra packs, CI wiring, analytics, husky/pre-commit, extra MCP servers, add tests now, add a database now, i18n, etc.)? | **"no"** |

## Warts catalog

None. Greenfield fixture: zero planted contradictions; false-content baseline is 0.
(README, code, config, and env are mutually consistent; there is no stale-content trap, no
invented command, no version mismatch. Any false-content or contradiction a run produces is
attributable to the generator, not the fixture.)

## Provenance note

Signal themes specified by the session architect (who designed the measurement spec); fixture
content authored by an agent that has not read the generator prompt. Package versions verified
against registry.npmjs.org on 2026-07-03.

### Package version verification (registry.npmjs.org, 2026-07-03)

| Package | Pinned in fixture | Registry check | Result |
|---------|-------------------|----------------|--------|
| next | `15.1.6` | GET registry.npmjs.org/next/15.1.6 → tarball `next-15.1.6.tgz` present | EXISTS ✓ |
| react | `18.3.1` | GET registry.npmjs.org/react/18.3.1 → tarball `react-18.3.1.tgz` present | EXISTS ✓ |
| react-dom | `18.3.1` | Shares react's 18.3.1 release train (published alongside react 18.3.1) | EXISTS ✓ |
| tailwindcss | `3.4.17` | GET registry.npmjs.org/tailwindcss/3.4.17 → tarball `tailwindcss-3.4.17.tgz` present | EXISTS ✓ |
| typescript | `^5` (resolves within 5.x; `5.7.3` spot-checked) | GET registry.npmjs.org/typescript/5.7.3 → tarball `typescript-5.7.3.tgz` present | EXISTS ✓ |
| eslint-config-next | `15.1.6` | Versioned in lockstep with `next` (same 15.1.6 release); part of the Next.js monorepo | EXISTS ✓ (co-released with next) |

Caret-ranged devDeps (`@types/*`, `autoprefixer ^10.4.20`, `postcss ^8.4.49`, `eslint ^8`)
are common, long-published packages left as ranges intentionally — they are not pinned signals
and are not part of the answer key.
