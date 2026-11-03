from fastapi import APIRouter
from .routes.auth import router as auth_router
from .routes.health import router as health_router
from .routes.products import router as products_router
from .routes.public_products import router as public_products_router
from .routes.prices import router as prices_router
from .routes.orders import router as orders_router
from .routes.customer_auth import router as customer_auth_router
from .routes.cart import router as cart_router
from .routes.checkout import router as checkout_router
from .routes.payments import router as payments_router
from .routes.public_orders import router as public_orders_router

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(health_router)
api_router.include_router(products_router)
api_router.include_router(public_products_router)
api_router.include_router(prices_router)
api_router.include_router(orders_router)
api_router.include_router(customer_auth_router)
api_router.include_router(cart_router)
api_router.include_router(checkout_router)
api_router.include_router(payments_router)
api_router.include_router(public_orders_router)

__all__ = ["api_router"]
