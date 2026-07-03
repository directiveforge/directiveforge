# Deploy

Run pre-deployment checks for SlotHarbor. Production releases happen via Heroku auto-deploy on push to `main`; this command is the pre-flight gate that must pass BEFORE you push.

## Usage

```
/deploy [check|staging]
```

Default: `check` (pre-flight only). SlotHarbor has no separate staging pipeline configured — confirm the target before assuming one exists.

## Pre-flight Checks

Run ALL of these. Stop and report if any fail — do not push to `main`.

```bash
python -c "import app.main"     # App imports cleanly (no test/lint/typecheck tooling exists)
alembic upgrade head            # Migrations apply against the target DB
docker build -t slotharbor .    # The image builds (matches the prod Dockerfile)
```

Also confirm required env vars are set in the deploy target: `DATABASE_URL`, `SECRET_KEY`, `WAREHOUSE_CODE` (and optionally `MAX_PAGE_SIZE`). A missing `SECRET_KEY` means the app boots on the insecure `dev-secret-change-me` fallback — a production blocker.

## Deploy (Heroku auto-deploy)

Per the README, pushes to `main` build and release automatically:

```bash
git push origin main
```

Migrations do NOT run automatically — run `alembic upgrade head` against the production DB as a release step (or wire a Heroku release-phase command).

Verify after release: `curl https://<app-host>/healthz` → expect `{"status":"ok","warehouse":"<WAREHOUSE_CODE>"}`.

## Rollback

Heroku: `heroku releases:rollback` on the app.

⚠ Rollback reverts code only. If a migration ran, it is NOT auto-reverted — run `alembic downgrade -1` deliberately and confirm the schema state before rolling code back.

## Report

```
Pre-flight: [PASS / FAIL — which gate]
Deployed: SlotHarbor → [environment]
Version: [git SHA]
Migrations applied: [yes/no]
Health: [/healthz status]
```
