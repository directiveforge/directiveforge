# Deploy

Build and run the SlotHarbor container. **Deploy facts here derive ONLY from the `Dockerfile`** — the only deploy artifact in the repo.

> DRIFT NOTE: `README.md` claims "deployed on Heroku, pushes to main build and release automatically." This is flagged as drift (DECISIONS #5) — there is no Procfile / heroku.yml / CI pipeline in the repo. Do NOT author a Heroku deploy command from that prose. If a real Heroku pipeline is added, update DECISIONS #5 and this file from the committed pipeline config, not from the README.

## Usage

```
/deploy
```

There is no staging/production split and no CI deploy job configured. This command builds and runs the container image the `Dockerfile` defines.

## Pre-flight Checks

Run these. Stop and report if any fail — do not build.

```bash
python -c "import app.main"     # app imports / assembles
alembic upgrade head            # migrations apply (run against the target DB)
```

## Build the image

```bash
docker build -t slotharbor:$(git rev-parse --short HEAD 2>/dev/null || echo local) .
```

The image is based on `python:3.12-slim`, installs the package (`pip install .`), copies `app/` + `migrations/` + `alembic.ini`, exposes `8000`, and runs `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

## Run the container

```bash
docker run --rm -p 8000:8000 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e SECRET_KEY="$SECRET_KEY" \
  -e WAREHOUSE_CODE="$WAREHOUSE_CODE" \
  slotharbor:<tag>
```

All four config vars (`DATABASE_URL`, `SECRET_KEY`, `WAREHOUSE_CODE`, optional `MAX_PAGE_SIZE`) must be supplied from the environment — the container has no `.env`.

## Verify

```bash
curl -fsS http://localhost:8000/healthz    # expect {"status":"ok","warehouse":"..."}
```

## Report

```
Built: slotharbor:[tag]
Health: [ok / degraded]
Warehouse: [WAREHOUSE_CODE from /healthz]
```

## Rollback

No orchestration platform is configured — rollback = re-run the container from the previous image tag. If a migration ran, plan the down-revision (`alembic downgrade -1`) deliberately; migrations are not auto-reverted.
