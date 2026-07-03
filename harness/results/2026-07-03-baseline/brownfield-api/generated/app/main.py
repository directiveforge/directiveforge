"""SlotHarbor application entrypoint.

Assembles the FastAPI app and mounts the active routers. Run locally with:
    uvicorn app.main:app --reload
"""
from fastapi import FastAPI

from app.config import settings
from app.routers import items, reports

app = FastAPI(
    title="SlotHarbor",
    version="1.4.0",
    summary="Dock-slot scheduling for Cratewell Logistics",
)

app.include_router(items.router)
app.include_router(reports.router)


@app.get("/healthz", tags=["ops"])
def healthz() -> dict[str, str]:
    return {"status": "ok", "warehouse": settings.WAREHOUSE_CODE}
