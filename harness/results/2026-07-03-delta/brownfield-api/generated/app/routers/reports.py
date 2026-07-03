"""Reporting endpoints: dock utilization summaries for operations staff."""
from __future__ import annotations

import datetime as dt

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import get_session
from app.models import Dock, SlotBooking

router = APIRouter(prefix="/reports", tags=["reports"])


class DockUtilization(BaseModel):
    dock_id: int
    dock_label: str
    booking_count: int


class UtilizationReport(BaseModel):
    warehouse_code: str
    window_start: dt.datetime
    window_end: dt.datetime
    docks: list[DockUtilization]


@router.get("/utilization", response_model=UtilizationReport)
def dock_utilization(
    warehouse_code: str = Query(min_length=1),
    since: dt.datetime = Query(...),
    until: dt.datetime = Query(...),
    session: Session = Depends(get_session),
) -> UtilizationReport:
    stmt = (
        select(Dock.id, Dock.label, func.count(SlotBooking.id))
        .join(SlotBooking, SlotBooking.dock_id == Dock.id)
        .where(Dock.warehouse_code == warehouse_code)
        .where(SlotBooking.window_start >= since)
        .where(SlotBooking.window_start < until)
        .group_by(Dock.id, Dock.label)
        .order_by(Dock.label)
    )
    rows = session.execute(stmt).all()
    docks = [
        DockUtilization(dock_id=r[0], dock_label=r[1], booking_count=r[2])
        for r in rows
    ]
    return UtilizationReport(
        warehouse_code=warehouse_code,
        window_start=since,
        window_end=until,
        docks=docks,
    )
