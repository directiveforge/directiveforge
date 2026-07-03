# SlotHarbor

Internal dock-slot scheduling service for **Cratewell Logistics**. Carriers
book time-window appointments against loading docks at a warehouse; operations
staff pull utilization reports to balance inbound volume across bays.

Built with FastAPI and SQLAlchemy 2.0, backed by Postgres in production.

## Requirements

- Python 3.9 or newer
- A Postgres database (SQLite is fine for local development)

## Getting started

```bash
pip install .
cp .env.example .env      # then fill in the values
uvicorn app.main:app --reload
```

The service reads its configuration from the environment. See `.env.example`
for the database URL; the app additionally expects `SECRET_KEY` (HMAC signing
key for appointment tokens) and `WAREHOUSE_CODE` (which Cratewell warehouse
this instance serves).

## Endpoints

| Method | Path                   | Purpose                                        |
|--------|------------------------|------------------------------------------------|
| POST   | `/bookings`            | Create a dock-slot appointment                 |
| GET    | `/bookings`            | List bookings, optionally filtered by dock     |
| GET    | `/reports/utilization` | Per-dock booking counts over a time window     |
| GET    | `/v2/analytics`        | Aggregated throughput analytics dashboard feed |
| GET    | `/healthz`             | Liveness probe                                 |

## Database migrations

Schema is managed with Alembic. Apply the latest migrations with:

```bash
alembic upgrade head
```

## Testing

Run the suite with:

```bash
make test
```

## Deployment

SlotHarbor is deployed on Heroku. Pushes to the `main` branch build and
release automatically.
