import uuid
from decimal import Decimal
from typing import List, Optional, Tuple
from sqlalchemy import or_, and_, func, asc, desc
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ..models.product import Product
from ..schemas.product import (
    ProductCreate,
    ProductUpdate,
    infer_product_type,
    normalize_image_reference,
    normalize_product_type,
)
from .minio_service import minio_service

# Default showroom products for initial database population
SEED_PRODUCTS = [
    {
        "sku": "SA-001",
        "name": "Handcrafted Silver Anklet",
        "subtitle": "One of a kind • Handcrafted",
        "category": "Silver Jewellery",
        "sub_category": "Anklets & Kolusu",
        "item_type": "unique",
        "price": Decimal("12800.00"),
        "status": "reserved",
        "image_url": "/images/product_anklet.jpg",
        "description": "Traditional heavy Chettinad silver payal with intricately sculpted peacock clasps and melodic chime ghungroos. Handcrafted by master silversmiths.",
        "purity": "925 Sterling Silver",
        "gross_weight": "45.00 g",
        "net_weight": "45.00 g",
        "hallmark_details": "925 Fineness Stamped",
        "stock_quantity": 1,
        "location": "Showroom Counter 3 - Silver Section",
    },
    {
        "sku": "GC-1045",
        "name": "22K Gold Chain",
        "subtitle": "22K 916 Hallmark • Classic Curb",
        "category": "Gold Jewellery",
        "sub_category": "Chains & Neckwear",
        "item_type": "regular",
        "price": Decimal("48500.00"),
        "status": "available",
        "image_url": "/images/product_gold_chain.jpg",
        "description": "22K yellow gold classic curb chain featuring precision soldered links with BIS hallmarked lock mechanism.",
        "purity": "22K (916 Fineness)",
        "gross_weight": "24.20 g",
        "net_weight": "24.20 g",
        "hallmark_details": "916 BIS Laser Inscription",
        "stock_quantity": 3,
        "location": "Locker Safe B - Vault 2",
    },
    {
        "sku": "SB-778",
        "name": "Silver Bowl",
        "subtitle": "Pure Silver Pooja Kinnam",
        "category": "Silver Articles",
        "sub_category": "Pooja Utensils",
        "item_type": "regular",
        "price": Decimal("16200.00"),
        "status": "available",
        "image_url": "/images/product_silver_bowl.jpg",
        "description": "Solid sterling silver ceremonial bowl crafted for sacred rituals, archana offering, and deity abhishekams.",
        "purity": "92.5% Silver Grade",
        "gross_weight": "118.00 g",
        "net_weight": "118.00 g",
        "hallmark_details": "925 Silver Fineness Mark",
        "stock_quantity": 4,
        "location": "Display Shelf 2 - Pooja Silver",
    },
    {
        "sku": "TP-201",
        "name": "Temple Lakshmi Haram",
        "subtitle": "Antique Nakshi • Goddess Motif",
        "category": "Temple Jewellery",
        "sub_category": "Long Harams",
        "item_type": "unique",
        "price": Decimal("245000.00"),
        "status": "available",
        "image_url": "/images/product_gold_chain.jpg",
        "description": "Heritage antique gold long haram depicting Goddess Lakshmi seated on a lotus, flanked by imperial temple peacocks.",
        "purity": "22K Antique Finish",
        "gross_weight": "86.50 g",
        "net_weight": "84.10 g",
        "hallmark_details": "916 BIS Hallmarked",
        "stock_quantity": 1,
        "location": "High-Value Vault Locker A",
    },
    {
        "sku": "BR-902",
        "name": "Bridal Emerald Choker",
        "subtitle": "Royal Heritage • Zambian Emeralds",
        "category": "Bridal Jewellery",
        "sub_category": "Chokers",
        "item_type": "unique",
        "price": Decimal("380000.00"),
        "status": "sold",
        "image_url": "/images/product_anklet.jpg",
        "description": "Magnificent bridal choker encrusted with unheated natural emeralds and heirloom polki diamond motifs.",
        "purity": "22K Yellow Gold",
        "gross_weight": "98.20 g",
        "net_weight": "92.40 g",
        "hallmark_details": "916 BIS Stamped & Certified",
        "stock_quantity": 0,
        "location": "Sold - Awaiting Vault Dispatch",
    },
    {
        "sku": "CB-001",
        "name": "24K Lakshmi Gold Coin 8g",
        "subtitle": "999 Pure Gold • Certified Tamper-Proof",
        "category": "Coins & Bars",
        "sub_category": "Gold Coins",
        "item_type": "regular",
        "price": Decimal("58400.00"),
        "status": "available",
        "image_url": "/images/product_gold_chain.jpg",
        "description": "Certified 24 Karat 999 fineness pure gold coin embossed with divine Goddess Lakshmi posture.",
        "purity": "24K (999 Purity)",
        "gross_weight": "8.00 g",
        "net_weight": "8.00 g",
        "hallmark_details": "999 Fine Gold Assayer Certified",
        "stock_quantity": 12,
        "location": "Safe Deposit Counter 1",
    },
]


def seed_initial_products_if_empty(db: Session) -> None:
    """Populates showroom catalogue with seed products if not already present."""
    for item in SEED_PRODUCTS:
        exists = db.query(Product).filter(Product.sku == item["sku"]).first()
        if not exists:
            prod = Product(**item, is_active=True)
            db.add(prod)
        elif not exists.is_active:
            exists.is_active = True
            for k, v in item.items():
                setattr(exists, k, v)
    db.commit()


def get_products(
    db: Session,
    page: int = 1,
    page_size: int = 50,
    search: Optional[str] = None,
    product_type: Optional[str] = None,
    category: Optional[str] = None,
    sub_category: Optional[str] = None,
    status_filter: Optional[str] = None,
    item_type: Optional[str] = None,
    availability: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    include_inactive: bool = False,
) -> Tuple[List[Product], int]:
    """Retrieve filtered, searched, and paginated products."""
    query = db.query(Product)
    if not include_inactive:
        query = query.filter(Product.is_active == True)

    # 1. Search Query
    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Product.name).like(term),
                func.lower(Product.sku).like(term),
                func.lower(Product.category).like(term),
                func.lower(func.coalesce(Product.sub_category, "")).like(term),
                func.lower(func.coalesce(Product.subtitle, "")).like(term),
                func.lower(func.coalesce(Product.description, "")).like(term),
            )
        )

    # 1b. Product Type Filter
    if product_type and product_type.lower() != "all":
        pt_clean = normalize_product_type(product_type)
        if pt_clean:
            query = query.filter(Product.product_type == pt_clean)

    # 2. Category Filter
    if category and category.lower() != "all":
        cat_lower = category.strip().lower()
        gold_storefront_categories = (
            "gold",
            "earrings",
            "rings",
            "bangle & bracelets",
            "bangles",
            "necklace",
            "necklaces",
            "nosepin",
            "occasion",
            "chains",
            "pendant",
            "pendants",
            "anklets",
            "toe rings",
        )
        if cat_lower == "gold":
            query = query.filter(
                or_(
                    func.lower(Product.category).like("%gold%"),
                    func.lower(Product.category).in_(gold_storefront_categories),
                )
            )
        elif cat_lower in ("silver", "silver_jewellery"):
            query = query.filter(
                and_(
                    func.lower(Product.category).like("%silver%"),
                    ~func.lower(Product.category).like("%article%"),
                )
            )
        elif cat_lower == "silver_articles":
            query = query.filter(
                and_(
                    func.lower(Product.category).like("%silver%"),
                    or_(
                        func.lower(Product.category).like("%article%"),
                        func.lower(Product.category).like("%pooja%"),
                        func.lower(Product.category).like("%utensil%"),
                    ),
                )
            )
        elif cat_lower == "temple":
            query = query.filter(func.lower(Product.category).like("%temple%"))
        elif cat_lower == "bridal":
            query = query.filter(func.lower(Product.category).like("%bridal%"))
        elif cat_lower in ("coins", "coins-bars", "coins_bars"):
            query = query.filter(
                or_(
                    Product.product_type == "coins_bars",
                    func.lower(Product.category).like("%coin%"),
                    func.lower(Product.category).like("%bar%"),
                )
            )
        else:
            query = query.filter(
                or_(
                    func.lower(Product.category) == cat_lower,
                    func.lower(Product.category).like(f"%{cat_lower}%"),
                )
            )

    # 2b. Sub-Category Filter
    if sub_category and sub_category.lower() != "all":
        sub_lower = sub_category.strip().lower()
        query = query.filter(
            or_(
                func.lower(func.coalesce(Product.sub_category, "")).like(f"%{sub_lower}%"),
                func.lower(Product.name).like(f"%{sub_lower}%"),
            )
        )

    # 3. Status Filter
    if status_filter and status_filter.lower() != "all":
        stat_lower = status_filter.strip().lower()
        if stat_lower == "sold":
            query = query.filter(func.lower(Product.status).like("%sold%"))
        else:
            query = query.filter(func.lower(Product.status) == stat_lower)

    # 4. Item Type Filter
    if item_type and item_type.lower() != "all":
        it_lower = item_type.strip().lower()
        query = query.filter(func.lower(Product.item_type) == it_lower)

    # 5. Availability Filter
    if availability and availability.lower() != "all":
        avail_lower = availability.strip().lower()
        if avail_lower == "in_stock":
            query = query.filter(
                and_(
                    ~func.lower(Product.status).like("%sold%"),
                    Product.stock_quantity > 0,
                )
            )
        elif avail_lower == "out_of_stock":
            query = query.filter(
                or_(
                    func.lower(Product.status).like("%sold%"),
                    Product.stock_quantity <= 0,
                )
            )

    # 6. Price Range Filters
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    total = query.count()

    # 7. Sorting
    clean_sort = (sort_by or "created_at").lower()
    if clean_sort == "price-low":
        query = query.order_by(asc(Product.price), asc(Product.id))
    elif clean_sort == "price-high":
        query = query.order_by(desc(Product.price), desc(Product.id))
    elif clean_sort in ("name", "title"):
        query = query.order_by(asc(Product.name), asc(Product.id))
    else:
        sort_column = getattr(Product, sort_by, Product.created_at)
        if sort_order and sort_order.lower() == "asc":
            query = query.order_by(asc(sort_column), asc(Product.id))
        else:
            query = query.order_by(desc(sort_column), desc(Product.id))

    # 8. Pagination
    limit = max(1, min(page_size, 200))
    offset = max(0, (page - 1) * limit)
    items = query.offset(offset).limit(limit).all()

    return items, total


def get_product_by_id_or_sku(db: Session, identifier: str, include_inactive: bool = False) -> Optional[Product]:
    """Lookup product by UUID or case-insensitive SKU."""
    clean_id = identifier.strip()
    try:
        product_uuid = uuid.UUID(clean_id)
        q = db.query(Product).filter(Product.id == product_uuid)
        if not include_inactive:
            q = q.filter(Product.is_active == True)
        product = q.first()
        if product:
            return product
    except ValueError:
        pass

    q = db.query(Product).filter(func.lower(Product.sku) == clean_id.lower())
    if not include_inactive:
        q = q.filter(Product.is_active == True)
    return q.first()


def create_product(db: Session, payload: ProductCreate) -> Product:
    """Create a new inventory product."""
    clean_sku = payload.sku.strip()

    # Reject duplicate SKU
    existing = db.query(Product).filter(func.lower(Product.sku) == clean_sku.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"success": False, "error": f"Product with SKU '{clean_sku}' already exists."},
        )

    price_dec = payload.resolve_price()
    if price_dec < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": "Price must be non-negative."},
        )

    stock_qty = payload.stock_quantity if payload.stock_quantity is not None else 1
    if stock_qty < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": "Stock quantity must be non-negative."},
        )

    item_type = payload.resolve_item_type()

    clean_image = normalize_image_reference(payload.image_url)
    clean_pt = normalize_product_type(payload.product_type) or infer_product_type(payload.category)

    product = Product(
        sku=clean_sku,
        name=payload.name.strip(),
        subtitle=payload.subtitle.strip() if payload.subtitle else None,
        description=payload.description.strip() if payload.description else None,
        product_type=clean_pt,
        category=payload.category.strip(),
        sub_category=payload.sub_category.strip() if payload.sub_category else None,
        item_type=item_type,
        price=price_dec,
        status=payload.status.strip().lower(),
        image_url=clean_image,
        stock_quantity=stock_qty,
        purity=payload.purity.strip() if payload.purity else None,
        gross_weight=payload.gross_weight.strip() if payload.gross_weight else None,
        net_weight=payload.net_weight.strip() if payload.net_weight else None,
        hallmark_details=payload.hallmark_details.strip() if payload.hallmark_details else None,
        location=payload.location.strip() if payload.location else None,
        is_active=True,
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product: Product, payload: ProductUpdate) -> Product:
    """Update editable fields of an existing product."""
    # Check if SKU changed and conflicts
    if payload.sku and payload.sku.strip().lower() != product.sku.lower():
        new_sku = payload.sku.strip()
        conflict = db.query(Product).filter(func.lower(Product.sku) == new_sku.lower()).first()
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"success": False, "error": f"Product with SKU '{new_sku}' already exists."},
            )
        product.sku = new_sku

    if payload.name is not None:
        product.name = payload.name.strip()
    if payload.subtitle is not None:
        product.subtitle = payload.subtitle.strip() if payload.subtitle else None
    if payload.description is not None:
        product.description = payload.description.strip() if payload.description else None
    if payload.product_type is not None:
        product.product_type = normalize_product_type(payload.product_type)
    if payload.category is not None:
        product.category = payload.category.strip()
        if not product.product_type:
            product.product_type = infer_product_type(payload.category)
    if payload.sub_category is not None:
        product.sub_category = payload.sub_category.strip() if payload.sub_category else None

    # Handle item_type / is_unique
    if payload.item_type is not None:
        product.item_type = payload.item_type.strip().lower()
    elif payload.is_unique is not None:
        product.item_type = "unique" if payload.is_unique else "regular"

    # Price
    if payload.price is not None:
        product.price = Decimal(str(payload.price))
    elif payload.numeric_price is not None:
        product.price = Decimal(str(payload.numeric_price))

    # Status Safeguards
    if payload.status is not None:
        clean_status = payload.status.strip().lower()
        product.status = clean_status

    old_image_to_cleanup: Optional[str] = None
    if payload.image_url is not None:
        new_image = normalize_image_reference(payload.image_url)
        if product.image_url and product.image_url != new_image and product.image_url.startswith("products/"):
            old_image_to_cleanup = product.image_url
        product.image_url = new_image

    if payload.stock_quantity is not None:
        product.stock_quantity = max(0, payload.stock_quantity)
    if payload.purity is not None:
        product.purity = payload.purity.strip() if payload.purity else None
    if payload.gross_weight is not None:
        product.gross_weight = payload.gross_weight.strip() if payload.gross_weight else None
    if payload.net_weight is not None:
        product.net_weight = payload.net_weight.strip() if payload.net_weight else None
    if payload.hallmark_details is not None:
        product.hallmark_details = payload.hallmark_details.strip() if payload.hallmark_details else None
    if payload.location is not None:
        product.location = payload.location.strip() if payload.location else None
    if payload.is_active is not None:
        product.is_active = payload.is_active

    db.commit()
    db.refresh(product)

    # Safely clean up previous replaced image only after successful DB commit
    if old_image_to_cleanup:
        minio_service.delete_object_if_unreferenced(old_image_to_cleanup, db, exclude_product_id=product.id)

    return product


def soft_delete_product(db: Session, product: Product) -> None:
    """Soft delete product (set is_active=False and status='unavailable')."""
    product.is_active = False
    product.status = "unavailable"
    db.commit()


def delete_product_permanent(db: Session, product: Product) -> None:
    """Permanently delete product from database and cleanup unreferenced MinIO image."""
    image_to_cleanup = product.image_url if product.image_url and product.image_url.startswith("products/") else None
    prod_id = product.id
    db.delete(product)
    db.commit()
    if image_to_cleanup:
        minio_service.delete_object_if_unreferenced(image_to_cleanup, db, exclude_product_id=prod_id)
