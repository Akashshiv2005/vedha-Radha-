from fastapi import APIRouter
from .routes.auth import router as auth_router
from .routes.health import router as health_router
from .routes.products import router as products_router
from .routes.public_products import router as public_products_router
from .routes.prices import router as prices_router

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(health_router)
api_router.include_router(products_router)
api_router.include_router(public_products_router)
api_router.include_router(prices_router)

__all__ = ["api_router"]
