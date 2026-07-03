"""initial schema: carrier, dock, slot_booking

Revision ID: 0001_initial
Revises:
Create Date: 2024-07-02 10:15:00.000000
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "carrier",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("scac_code", sa.String(length=4), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.UniqueConstraint("scac_code", name="uq_carrier_scac"),
    )
    op.create_index("ix_carrier_scac_code", "carrier", ["scac_code"])

    op.create_table(
        "dock",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("warehouse_code", sa.String(length=16), nullable=False),
        sa.Column("label", sa.String(length=32), nullable=False),
        sa.Column("max_trailer_length_ft", sa.Integer(), nullable=False),
        sa.UniqueConstraint("warehouse_code", "label", name="uq_dock_wh_label"),
    )
    op.create_index("ix_dock_warehouse_code", "dock", ["warehouse_code"])

    op.create_table(
        "slot_booking",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("dock_id", sa.Integer(), sa.ForeignKey("dock.id"), nullable=False),
        sa.Column("carrier_id", sa.Integer(), sa.ForeignKey("carrier.id"), nullable=False),
        sa.Column("window_start", sa.DateTime(), nullable=False),
        sa.Column("window_end", sa.DateTime(), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.UniqueConstraint("dock_id", "window_start", name="uq_booking_dock_start"),
    )
    op.create_index("ix_slot_booking_dock_id", "slot_booking", ["dock_id"])
    op.create_index("ix_slot_booking_carrier_id", "slot_booking", ["carrier_id"])
    op.create_index("ix_slot_booking_window_start", "slot_booking", ["window_start"])


def downgrade() -> None:
    op.drop_table("slot_booking")
    op.drop_table("dock")
    op.drop_table("carrier")
