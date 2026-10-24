from datetime import datetime, timezone
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from ...db.session import check_db_connection
from ...schemas.auth import HealthResponse
from ...services.minio_service import minio_service

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint returning application status, database, and MinIO storage connectivity.
    Does not expose passwords or sensitive internal details.
    """
    is_connected, message = check_db_connection()
    minio_check = minio_service.check_connection()
    storage_status = "connected" if minio_check.get("connected") else "disconnected"
    now = datetime.now(timezone.utc)

    if not is_connected:
        return JSONResponse(
            status_code=503,
            content={
                "status": "degraded",
                "database": "disconnected",
                "storage": storage_status,
                "error": "Database service is currently unreachable",
                "timestamp": now.isoformat(),
            },
        )

    return {
        "status": "healthy",
        "database": "connected",
        "storage": storage_status,
        "timestamp": now,
    }
