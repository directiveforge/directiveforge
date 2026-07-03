"""Slot-booking endpoints: create and list dock appointments."""
from __future__ import annotations

import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_session
from app.models import Dock, SlotBooking

router = APIRouter(prefix="/bookings", tags=["bookings"])


class BookingCreate(BaseModel):
    dock_id: int = Field(gt=0)
    carrier_id: int = Field(gt=0)
    window_start: dt.datetime
    window_end: dt.datetime


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dock_id: int
    carrier_id: int
    window_start: dt.datetime
    window_end: dt.datetime
    status: str


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(
    payload: BookingCreate,
    session: Session = Depends(get_session),
) -> SlotBooking:
    if payload.window_end <= payload.window_start:
        raise HTTPException(status_code=422, detail="window_end must follow window_start")

    dock = session.get(Dock, payload.dock_id)
    if dock is None:
        raise HTTPException(status_code=404, detail="dock not found")

    booking = SlotBooking(
        dock_id=payload.dock_id,
        carrier_id=payload.carrier_id,
        window_start=payload.window_start,
        window_end=payload.window_end,
    )
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking


@router.get("", response_model=list[BookingOut])
def list_bookings(
    dock_id: int | None = Query(default=None, gt=0),
    limit: int = Query(default=50, gt=0, le=settings.MAX_PAGE_SIZE),
    session: Session = Depends(get_session),
) -> list[SlotBooking]:
    stmt = select(SlotBooking).order_by(SlotBooking.window_start)
    if dock_id is not None:
        stmt = stmt.where(SlotBooking.dock_id == dock_id)
    stmt = stmt.limit(limit)
    return list(session.scalars(stmt))
