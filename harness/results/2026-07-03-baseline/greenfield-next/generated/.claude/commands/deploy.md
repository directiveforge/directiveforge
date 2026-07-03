# Deploy

Run pre-deployment checks and deploy Tempo Deck to Vercel.

## Usage

```
/deploy
```

Tempo Deck has a single production environment on Vercel hobby tier — no staging pipeline.

## Pre-flight Checks

Run ALL of these. Stop and report if any fail — do not proceed to deploy.

```bash
npx tsc --noEmit    # No type errors
npm run lint        # No lint errors
npm run build       # Build must succeed
```

(No test suite exists yet. If one is added, run it here too.)

## Deploy

Normal path: push to the Vercel-connected Git repo — Vercel auto-builds. Manual deploy:

```bash
npx vercel --prod
```

**Before deploying**, confirm env vars (`RESEND_API_KEY`, `NEXT_PUBLIC_APP_NAME`) are set in the Vercel dashboard — they are not read from `.env.local` in the cloud build. Blank `RESEND_API_KEY` is fine (email disabled).

Wait for: the deployment URL in Vercel's output.

Verify: open the URL and confirm the home page renders the seeded session list.

## Rollback

Vercel keeps every prior deployment. Roll back by promoting a previous deployment to production from the Vercel dashboard (Deployments → ⋯ → Promote to Production). Code-only — there is no database to migrate.

## Report

After deployment, output:
```
Deployed: Tempo Deck → production (Vercel)
Version: [git SHA]
Status: [healthy / degraded]
URL: [deployment URL]
```
