"""Database engine and session factory.

Uses the SQLAlchemy 2.0 style: a single Engine plus a sessionmaker whose
sessions are handed to request handlers through the `get_session` dependency.
"""
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings

_connect_args = (
    {"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    connect_args=_connect_args,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a scoped session per request."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
