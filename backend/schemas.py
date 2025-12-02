"""
Legacy import shim.

All schemas now live in backend.app.schemas; this file re-exports them to avoid
breaking existing imports.
"""
from backend.app.schemas import *  # noqa: F401,F403
