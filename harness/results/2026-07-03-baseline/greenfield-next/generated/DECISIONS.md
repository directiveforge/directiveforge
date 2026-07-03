# Architecture Decisions — Tempo Deck

> The canonical project ledger of locked architectural calls. One file per project, root-level, version-controlled.
> AI agents: read this before proposing changes. Never re-open a settled question without writing a *new* dated entry that explicitly supersedes the old one.

## What goes here (and what doesn't)

In: non-obvious calls with cross-cutting impact worth defending for ≥90 days.

Out: changelog entries (git history), one-PR-and-done calls (commit messages), preferences a linter/typecheck enforces (rules), temporary calls (code comments).

---

## Tier 1 — Starter format

Single-line entries: date + decision + one-sentence reason. This is a solo pre-MVP side project; stay in Tier 1 until a decision starts getting re-debated despite being in the ledger, then graduate to the Tier 2 format documented in `<KIT_ROOT>/templates/shared/DECISIONS.md.template`.

### Active Decisions

- **2026-07-03** — No database or persistence layer yet; the home page renders a seeded `SEED_SESSIONS` array in `app/page.tsx`. Reason: pre-MVP, single user, no accounts — a store is unjustified until the tool proves useful.

- **2026-07-03** — `@/*` path alias maps to the **project root**, not a `src/` directory. Reason: the app is small enough that a top-level `app/` + `components/` + `lib/` layout is clearer than nesting under `src/`.

- **2026-07-03** — Named exports for components; route entry files (`app/page.tsx`, `app/layout.tsx`) additionally `export default`. Reason: named exports tree-shake and grep better, but Next.js requires a default export for pages and layouts.

- **2026-07-03** — Email (`lib/email.ts`) ships as a dormant Resend stub that no-ops without `RESEND_API_KEY`. Reason: keeps local/hobby setups zero-config; the recap feature is deferred until there is data worth recapping.

- **2026-07-03** — Deploy target is Vercel hobby tier (`vercel.json`, region `iad1`). Reason: zero-ops Next.js hosting is free at this scale; no need for a container or custom infra.

Graduation signal: a decision above starts getting re-debated despite being recorded here → move to Tier 2 (full entries with reversal triggers + re-verification cadence).
