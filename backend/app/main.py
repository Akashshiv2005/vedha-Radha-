import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db.session import check_db_connection, SessionLocal
from .services.auth_service import bootstrap_initial_admin
from .services.minio_service import minio_service
from .api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("vedharadha_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager: verifies DB and MinIO on startup."""
    logger.info("Initializing %s...", settings.PROJECT_NAME)

    # 1. Check PostgreSQL Database Connectivity
    is_connected, msg = check_db_connection()
    if is_connected:
        logger.info("PostgreSQL database connection verified successfully.")
        # Bootstrap default admin safely if not existing
        db = SessionLocal()
        try:
            bootstrap_initial_admin(db)
        except Exception as e:
            logger.warning("Auto-bootstrap notice: %s", e)
        finally:
            db.close()
    else:
        logger.error(
            "CRITICAL: Failed to connect to PostgreSQL database! Reason: %s\n"
            "Please ensure PostgreSQL is running at %s with database 'vedharadha_db'.",
            msg,
            settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "localhost",
        )

    # 2. Check MinIO Object Storage Connectivity
    minio_status = minio_service.check_connection()
    if minio_status.get("connected"):
        logger.info("MinIO object storage verified successfully (Bucket: '%s').", settings.MINIO_BUCKET)
    else:
        logger.warning(
            "MinIO object storage check warning: %s. Verify MinIO is running at %s.",
            minio_status.get("error"),
            settings.MINIO_ENDPOINT,
        )

    yield

    logger.info("Shutting down %s...", settings.PROJECT_NAME)


def create_application() -> FastAPI:
    """FastAPI application factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="FastAPI Backend for Vedha Radha Thangamaaligai luxury jewellery e-commerce",
        lifespan=lifespan,
    )

    # Configure Cross-Origin Resource Sharing (CORS)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routes (/api/auth/login, /api/auth/me, /api/auth/logout, /api/health)
    app.include_router(api_router)

    @app.get("/", tags=["Root"])
    async def root():
        return {
            "name": settings.PROJECT_NAME,
            "version": "1.0.0",
            "status": "online",
            "docs_url": "/docs",
        }

    return app


app = create_application()
