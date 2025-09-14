"""
API routes for Skribe backend
"""

from fastapi import APIRouter
from .sessions import router as sessions_router
from .qr_codes import router as qr_router

router = APIRouter()

# Include all API route modules
router.include_router(sessions_router, prefix="/sessions", tags=["sessions"])
router.include_router(qr_router, prefix="/qr", tags=["qr-codes"])
