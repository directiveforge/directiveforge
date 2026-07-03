"""SQLAlchemy 2.0 declarative models for SlotHarbor.

Three tables model the dock-slot domain:
  - Dock       : a physical loading bay at a Cratewell warehouse.
  - SlotBooking: a carrier appointment for a time window at a dock.
  - Carrier    : the trucking company that holds a booking.
"""
from __future__ import annotations

import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Carrier(Base):
    __tablename__ = "carrier"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scac_code: Mapped[str] = mapped_column(String(4), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))

    bookings: Mapped[list["SlotBooking"]] = relationship(
        back_populates="carrier", cascade="all, delete-orphan"
    )


class Dock(Base):
    __tablename__ = "dock"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    warehouse_code: Mapped[str] = mapped_column(String(16), index=True)
    label: Mapped[str] = mapped_column(String(32))
    max_trailer_length_ft: Mapped[int] = mapped_column(Integer, default=53)

    bookings: Mapped[list["SlotBooking"]] = relationship(
        back_populates="dock", cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("warehouse_code", "label", name="uq_dock_wh_label"),
    )


class SlotBooking(Base):
    __tablename__ = "slot_booking"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    dock_id: Mapped[int] = mapped_column(ForeignKey("dock.id"), index=True)
    carrier_id: Mapped[int] = mapped_column(ForeignKey("carrier.id"), index=True)
    window_start: Mapped[dt.datetime] = mapped_column(DateTime, index=True)
    window_end: Mapped[dt.datetime] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(16), default="booked")

    dock: Mapped["Dock"] = relationship(back_populates="bookings")
    carrier: Mapped["Carrier"] = relationship(back_populates="bookings")

    __table_args__ = (
        UniqueConstraint("dock_id", "window_start", name="uq_booking_dock_start"),
    )
