# Deployment Skill

> **Trigger**: Use this skill when asked to deploy, release, ship, or promote Tempo Deck. Also use when asked about rollback.

## Target

Vercel (hobby tier). `vercel.json` sets the Next.js framework preset, build `next build`, install `npm install`, region `iad1`. There is a single production environment — no staging pipeline is configured.

## Pre-Deployment Checklist

Run ALL of these — stop and report if any fail:

1. Type check: `npx tsc --noEmit`
2. Lint: `npm run lint`
3. Build: `npm run build`

(No test suite exists yet — if one is added, add it here.)

## Deploy

The normal path is Git-push to the Vercel-connected repo, which auto-builds. For a manual deploy:

```bash
npx vercel --prod
```

Set environment variables (`RESEND_API_KEY`, `NEXT_PUBLIC_APP_NAME`) in the **Vercel dashboard** before deploying — they are NOT read from `.env.local` in the cloud build.

## Verify Deployment

Open the deployment URL Vercel prints and confirm the home page renders the seeded session list.

## Rollback

Vercel keeps every prior deployment. To roll back, promote a previous deployment to production from the Vercel dashboard (Deployments → ⋯ → Promote to Production) — code-only, there is no database to migrate.

## Gotchas

- Environment variables must be set in the Vercel dashboard BEFORE deploying — blank `RESEND_API_KEY` is fine (email stays disabled).
- `next-env.d.ts` is gitignored and regenerated on build — never commit or hand-edit it.
- A missing `NEXT_PUBLIC_APP_NAME` is harmless — the header falls back to "Tempo Deck".

## When NOT to Use This Skill

- To wire up email/Resend — that's a feature change, not a deploy
- To add a database or auth — those are architecture decisions (record in DECISIONS.md first)
