"""Legacy CSV export endpoints.

Superseded by the /reports router. Kept around from the v0.x line while the
old ops dashboard was decommissioned. This module is not wired into main.py.
"""
from __future__ import annotations

import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_session
from app.models import SlotBooking

router = APIRouter(prefix="/legacy", tags=["legacy"])


@router.get("/export.csv")
def export_bookings_csv(
    session: Session = Depends(get_session),
) -> StreamingResponse:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["id", "dock_id", "carrier_id", "window_start", "window_end", "status"])
    for booking in session.scalars(select(SlotBooking)):
        writer.writerow(
            [
                booking.id,
                booking.dock_id,
                booking.carrier_id,
                booking.window_start.isoformat(),
                booking.window_end.isoformat(),
                booking.status,
            ]
        )
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="text/csv")
