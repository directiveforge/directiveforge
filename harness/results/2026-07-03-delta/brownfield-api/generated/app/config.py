"""Runtime configuration for SlotHarbor.

Values are pulled from the process environment. See .env.example for the
variables this module expects at boot.
"""
import os


class Settings:
    """Flat settings object read once at import time."""

    # Database connection string (Postgres in prod, SQLite for local dev).
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./slotharbor.db"
    )

    # Signing key for the internal appointment-token HMAC. In production this
    # MUST come from the environment; the fallback below is a placeholder that
    # only exists so the app boots on a fresh dev checkout.
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-me")

    # Which Cratewell warehouse this instance serves. Drives slot capacity
    # lookups and the default timezone applied to booking windows.
    WAREHOUSE_CODE: str = os.getenv("WAREHOUSE_CODE", "CRW-01")

    # Upper bound on rows returned by list endpoints.
    MAX_PAGE_SIZE: int = int(os.getenv("MAX_PAGE_SIZE", "100"))


settings = Settings()
