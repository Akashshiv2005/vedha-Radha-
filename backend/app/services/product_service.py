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
        "product_type": "silver",
        "category": "Silver Jewellery",
        "sub_category": "Anklets & Kolusu",
        "item_type": "unique",
        "price": Decimal("12800.00"),
        "status": "reserved",
        "image_url": "/images/products/silver/anklets/silver-new-arrival-salem-ghungroo-payal-01.jpg",
        "images": [
            "/images/products/silver/anklets/silver-new-arrival-salem-ghungroo-payal-01.jpg",
            "/images/products/silver/anklets/silver-new-arrival-salem-ghungroo-payal-02.jpg",
            "/images/products/silver/anklets/silver-new-arrival-salem-ghungroo-payal-03.jpg",
        ],
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
        "product_type": "gold",
        "category": "Gold Jewellery",
        "sub_category": "Chains & Neckwear",
        "item_type": "regular",
        "price": Decimal("48500.00"),
        "status": "available",
        "image_url": "/images/products/gold/chains/gold-new-arrival-nawabi-rope-chain-01.jpg",
        "images": [
            "/images/products/gold/chains/gold-new-arrival-nawabi-rope-chain-01.jpg",
            "/images/products/gold/chains/gold-new-arrival-nawabi-rope-chain-02.jpg",
            "/images/products/gold/chains/gold-new-arrival-nawabi-rope-chain-03.jpg",
        ],
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
        "product_type": "silver",
        "category": "Silver Articles",
        "sub_category": "Pooja Utensils",
        "item_type": "regular",
        "price": Decimal("16200.00"),
        "status": "available",
        "image_url": "/images/product_silver_bowl.jpg",
        "images": ["/images/product_silver_bowl.jpg"],
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
        "product_type": "gold",
        "category": "Temple Jewellery",
        "sub_category": "Long Harams",
        "item_type": "unique",
        "price": Decimal("245000.00"),
        "status": "available",
        "image_url": "/images/products/gold/necklaces/gold-new-arrival-ashtalakshmi-haram-01.jpg",
        "images": [
            "/images/products/gold/necklaces/gold-new-arrival-ashtalakshmi-haram-01.jpg",
            "/images/products/gold/necklaces/gold-new-arrival-ashtalakshmi-haram-02.jpg",
            "/images/products/gold/necklaces/gold-new-arrival-ashtalakshmi-haram-03.jpg",
        ],
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
        "product_type": "gold",
        "category": "Bridal Jewellery",
        "sub_category": "Chokers",
        "item_type": "unique",
        "price": Decimal("380000.00"),
        "status": "sold",
        "image_url": "/images/products/gold/necklaces/collections-new-arrival-bridal-peacock-vaddanam-01.jpg",
        "images": [
            "/images/products/gold/necklaces/collections-new-arrival-bridal-peacock-vaddanam-01.jpg",
            "/images/products/gold/necklaces/collections-new-arrival-bridal-peacock-vaddanam-02.jpg",
            "/images/products/gold/necklaces/collections-new-arrival-bridal-peacock-vaddanam-03.jpg",
        ],
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
        "product_type": "coins_bars",
        "category": "Coins & Bars",
        "sub_category": "Gold Coins",
        "item_type": "regular",
        "price": Decimal("58400.00"),
        "status": "available",
        "image_url": "/images/coins-bars/gold-coin-lakshmi-01.jpg",
        "images": [
            "/images/coins-bars/gold-coin-lakshmi-01.jpg",
            "/images/coins-bars/gold-coin-lakshmi-02.jpg",
            "/images/coins-bars/gold-coin-lakshmi-03.jpg",
        ],
        "description": "Certified 24 Karat 999 fineness pure gold coin embossed with divine Goddess Lakshmi posture.",
        "purity": "24K (999 Purity)",
        "gross_weight": "8.00 g",
        "net_weight": "8.00 g",
        "hallmark_details": "999 Fine Gold Assayer Certified",
        "stock_quantity": 12,
        "location": "Safe Deposit Counter 1",
    },
    {
        "sku": "ER-101",
        "name": "22K Traditional Ruby Studs",
        "subtitle": "22K 916 BIS Hallmarked • Floral Ruby",
        "product_type": "gold",
        "category": "Earrings",
        "sub_category": "Studs",
        "item_type": "regular",
        "price": Decimal("32000.00"),
        "status": "available",
        "image_url": "/images/products/gold/earrings/gold_studs_1-01.jpg",
        "images": [
            "/images/products/gold/earrings/gold_studs_1-01.jpg",
            "/images/products/gold/earrings/gold_studs_1-02.jpg",
            "/images/products/gold/earrings/gold_studs_1-03.jpg",
        ],
        "description": "Handcrafted 22K hallmarked gold floral studs centred with unheated natural cabochon rubies and granular micro-filigree borders.",
        "purity": "22K 916 BIS Hallmarked",
        "gross_weight": "5.80 g",
        "net_weight": "5.60 g",
        "hallmark_details": "916 BIS Laser Inscription",
        "stock_quantity": 5,
        "location": "Counter 1 - Earrings Section",
    },
    {
        "sku": "ER-102",
        "name": "Chettinad Antique Bell Jhumkas",
        "subtitle": "22K Royal Antique • Temple Architecture",
        "product_type": "gold",
        "category": "Earrings",
        "sub_category": "Jhumkas",
        "item_type": "regular",
        "price": Decimal("65000.00"),
        "status": "available",
        "image_url": "/images/products/gold/earrings/gold_jhumkas_19-01.jpg",
        "images": [
            "/images/products/gold/earrings/gold_jhumkas_19-01.jpg",
            "/images/products/gold/earrings/gold_jhumkas_19-02.jpg",
            "/images/products/gold/earrings/gold_jhumkas_19-03.jpg",
        ],
        "description": "Ornate Chettinad multi-tier bell jhumkas crafted with temple lotus crowns and dainty pearl cluster drops in 22K antique gold.",
        "purity": "22K 916 BIS Hallmarked",
        "gross_weight": "12.40 g",
        "net_weight": "11.90 g",
        "hallmark_details": "916 BIS Hallmarked",
        "stock_quantity": 4,
        "location": "Counter 1 - Jhumka Showcase",
    },
    {
        "sku": "RG-101",
        "name": "22K Navratna Engagement Band",
        "subtitle": "Auspicious Proposal Band • Solitaire Accents",
        "product_type": "gold",
        "category": "Rings",
        "sub_category": "Engagement Rings",
        "item_type": "regular",
        "price": Decimal("42000.00"),
        "status": "available",
        "image_url": "/images/products/gold/rings/gold_engagement_rings_26-01.jpg",
        "images": [
            "/images/products/gold/rings/gold_engagement_rings_26-01.jpg",
            "/images/products/gold/rings/gold_engagement_rings_26-02.jpg",
            "/images/products/gold/rings/gold_engagement_rings_26-03.jpg",
        ],
        "description": "Majestic 22K yellow gold dual-channel band crowned with a brilliant centre gemstone flanked by micropave sparkle accents.",
        "purity": "22K 916 BIS Hallmarked",
        "gross_weight": "7.80 g",
        "net_weight": "7.50 g",
        "hallmark_details": "916 BIS Hallmarked",
        "stock_quantity": 6,
        "location": "Counter 2 - Rings Showcase",
    },
    {
        "sku": "RG-102",
        "name": "22K Classic Casual Band Ring",
        "subtitle": "Geometric Satin Finish • Comfort Fit",
        "product_type": "gold",
        "category": "Rings",
        "sub_category": "Casual Rings",
        "item_type": "regular",
        "price": Decimal("25000.00"),
        "status": "available",
        "image_url": "/images/products/gold/rings/gold_casual_rings_33-01.jpg",
        "images": [
            "/images/products/gold/rings/gold_casual_rings_33-01.jpg",
            "/images/products/gold/rings/gold_casual_rings_33-02.jpg",
            "/images/products/gold/rings/gold_casual_rings_33-03.jpg",
        ],
        "description": "Minimalist geometric grooved casual gold ring forged in solid 22K hallmarked gold with seamless comfort-fit inner shank.",
        "purity": "22K 916 BIS Hallmarked",
        "gross_weight": "4.60 g",
        "net_weight": "4.60 g",
        "hallmark_details": "916 BIS Hallmarked",
        "stock_quantity": 8,
        "location": "Counter 2 - Casual Rings",
    },
    {
        "sku": "CB-002",
        "name": "24K Ashtalakshmi Gold Coin 10g",
        "subtitle": "24K 999 Pure Gold • Auspicious Gifting",
        "product_type": "coins_bars",
        "category": "Coins & Bars",
        "sub_category": "Gold Coins",
        "item_type": "regular",
        "price": Decimal("72500.00"),
        "status": "available",
        "image_url": "/images/coins-bars/gold-coin-ashtalakshmi-01.jpg",
        "images": [
            "/images/coins-bars/gold-coin-ashtalakshmi-01.jpg",
            "/images/coins-bars/gold-coin-ashtalakshmi-02.jpg",
            "/images/coins-bars/gold-coin-ashtalakshmi-03.jpg",
        ],
        "description": "Certified 24 Karat 999 pure fine gold coin featuring relief of Ashtalakshmi within ornate lion and floral motifs.",
        "purity": "24K 999 Pure Gold",
        "gross_weight": "10.00 g",
        "net_weight": "10.00 g",
        "hallmark_details": "999 Pure Gold Assayer Stamped",
        "stock_quantity": 10,
        "location": "Safe Deposit Vault 1",
    },
    {
        "sku": "ER-S101",
        "name": "925 Oxidized Floral Studs",
        "subtitle": "925 Sterling Silver • Antique Patina",
        "product_type": "silver",
        "category": "Silver Jewellery",
        "sub_category": "Earrings",
        "item_type": "regular",
        "price": Decimal("3800.00"),
        "status": "available",
        "image_url": "/images/products/silver/earrings/silver-studs-floral-01.jpg",
        "images": [
            "/images/products/silver/earrings/silver-studs-floral-01.jpg",
        ],
        "description": "Intricate tribal oxidized sterling silver floral studs crafted in authentic 92.5 purity silver.",
        "purity": "925 Sterling Silver",
        "gross_weight": "8.50 g",
        "net_weight": "8.50 g",
        "hallmark_details": "925 Fineness Stamped",
        "stock_quantity": 7,
        "location": "Silver Section - Earrings Counter",
    },
    {
        "sku": "RG-S101",
        "name": "925 Sterling Casual Band",
        "subtitle": "925 Sterling Silver • Modern Minimalist",
        "product_type": "silver",
        "category": "Silver Jewellery",
        "sub_category": "Rings",
        "item_type": "regular",
        "price": Decimal("2500.00"),
        "status": "available",
        "image_url": "/images/products/silver/rings/silver-rings-solitaire-01.jpg",
        "images": [
            "/images/products/silver/rings/silver-rings-solitaire-01.jpg",
        ],
        "description": "Sleek and polished 925 sterling silver daily wear comfort band with fine hallmark certification.",
        "purity": "925 Sterling Silver",
        "gross_weight": "4.20 g",
        "net_weight": "4.20 g",
        "hallmark_details": "925 Fineness Stamped",
        "stock_quantity": 9,
        "location": "Silver Section - Rings Counter",
    },
    {
        "sku": "CB-S001",
        "name": "999 Fine Pure Silver Bar 500g",
        "subtitle": "999 Fine Pure Silver • Investment Grade",
        "product_type": "coins_bars",
        "category": "Coins & Bars",
        "sub_category": "Silver Bars",
        "item_type": "regular",
        "price": Decimal("48000.00"),
        "status": "available",
        "image_url": "/images/coins-bars/silver-bar-500g-cast-01.jpg",
        "images": [
            "/images/coins-bars/silver-bar-500g-cast-01.jpg",
            "/images/coins-bars/silver-bar-500g-cast-02.jpg",
            "/images/coins-bars/silver-bar-500g-cast-03.jpg",
        ],
        "description": "Investment grade 999 pure fine silver cast bar bearing individual serial number and refinery assayer assay certificate.",
        "purity": "999 Fine Pure Silver",
        "gross_weight": "500.00 g",
        "net_weight": "500.00 g",
        "hallmark_details": "999 Pure Silver Assay Certified",
        "stock_quantity": 5,
        "location": "Vault Locker S - Bullion",
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
                func.lower(func.coalesce(Product.qr_code, "")).like(term),
                func.lower(Product.category).like(term),
                func.lower(func.coalesce(Product.sub_category, "")).like(term),
                func.lower(func.coalesce(Product.sub_type, "")).like(term),
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
                and_(
                    or_(
                        Product.product_type == "gold",
                        func.lower(Product.category).like("%gold%"),
                        func.lower(Product.category).in_(gold_storefront_categories),
                        and_(
                            or_(
                                Product.product_type == "coins_bars",
                                func.lower(Product.category).like("%coin%"),
                                func.lower(Product.category).like("%bar%"),
                            ),
                            or_(
                                func.lower(Product.name).like("%gold%"),
                                func.lower(Product.category).like("%gold%"),
                                func.lower(Product.sku).like("cb-0%"),
                                func.lower(Product.sku).like("cb-g%"),
                            ),
                        ),
                    ),
                    Product.product_type != "silver",
                    ~func.lower(Product.category).like("%silver%"),
                    ~func.lower(Product.name).like("%silver%"),
                )
            )
        elif cat_lower in ("silver", "silver_jewellery"):
            query = query.filter(
                and_(
                    or_(
                        Product.product_type == "silver",
                        func.lower(Product.category).like("%silver%"),
                        and_(
                            or_(
                                Product.product_type == "coins_bars",
                                func.lower(Product.category).like("%coin%"),
                                func.lower(Product.category).like("%bar%"),
                            ),
                            or_(
                                func.lower(Product.name).like("%silver%"),
                                func.lower(Product.category).like("%silver%"),
                                func.lower(Product.sku).like("%-s%"),
                            ),
                        ),
                    ),
                    Product.product_type != "gold",
                    ~func.lower(Product.category).like("%gold%"),
                    ~func.lower(Product.name).like("%gold%"),
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
                func.lower(func.coalesce(Product.sub_type, "")).like(f"%{sub_lower}%"),
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
    """Lookup product by UUID, SKU, QR code, or human-readable name slug."""
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
    product = q.first()
    if product:
        return product

    q = db.query(Product).filter(func.lower(Product.qr_code) == clean_id.lower())
    if not include_inactive:
        q = q.filter(Product.is_active == True)
    product = q.first()
    if product:
        return product

    # Match by product name or slug (e.g. gajalakshmi-nakshi-handcrafted-22k-gold-bridal-vaddanam)
    clean_slug = clean_id.lower().replace("_", "-")
    name_guess = clean_slug.replace("-", " ")
    q_name = db.query(Product).filter(
        or_(
            func.lower(Product.name) == name_guess,
            func.lower(Product.name) == clean_id.lower(),
            func.lower(func.replace(Product.name, " ", "-")) == clean_slug,
        )
    )
    if not include_inactive:
        q_name = q_name.filter(Product.is_active == True)
    product = q_name.first()
    if product:
        return product

    # Tolerant slug match
    target_norm = "".join(c for c in clean_slug if c.isalnum())
    if len(target_norm) >= 4:
        q_all = db.query(Product)
        if not include_inactive:
            q_all = q_all.filter(Product.is_active == True)
        for cand in q_all.limit(200).all():
            cand_norm = "".join(c for c in (cand.name or "").lower() if c.isalnum())
            if cand_norm == target_norm or (len(cand_norm) > 6 and cand_norm in target_norm) or (len(target_norm) > 6 and target_norm in cand_norm):
                return cand

    return None


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
    clean_images: List[str] = []
    if payload.images:
        for img in payload.images:
            norm = normalize_image_reference(img)
            if norm and norm not in clean_images:
                clean_images.append(norm)
        clean_images = clean_images[:3]
    if not clean_images and clean_image:
        clean_images = [clean_image]
    primary_image = clean_images[0] if clean_images else clean_image
    clean_pt = normalize_product_type(payload.product_type) or infer_product_type(payload.category)

    clean_qr = payload.qr_code.strip() if payload.qr_code else None
    if clean_qr:
        existing_qr = db.query(Product).filter(func.lower(Product.qr_code) == clean_qr.lower()).first()
        if existing_qr:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"success": False, "error": f"Product with QR Code '{clean_qr}' already exists (SKU: {existing_qr.sku})."},
            )

    product = Product(
        sku=clean_sku,
        name=payload.name.strip(),
        subtitle=payload.subtitle.strip() if payload.subtitle else None,
        description=payload.description.strip() if payload.description else None,
        product_type=clean_pt,
        category=payload.category.strip(),
        sub_category=payload.sub_category.strip() if payload.sub_category else None,
        sub_type=payload.sub_type.strip() if payload.sub_type else None,
        occasion=payload.occasion.strip() if payload.occasion else None,
        qr_code=clean_qr,
        item_type=item_type,
        price=price_dec,
        status=payload.status.strip().lower(),
        image_url=primary_image,
        images=clean_images,
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
    if payload.sub_type is not None:
        product.sub_type = payload.sub_type.strip() if payload.sub_type else None
    if payload.occasion is not None:
        product.occasion = payload.occasion.strip() if payload.occasion else None
    if payload.qr_code is not None:
        clean_qr = payload.qr_code.strip() if payload.qr_code else None
        if clean_qr and (not product.qr_code or clean_qr.lower() != product.qr_code.lower()):
            conflict = db.query(Product).filter(
                func.lower(Product.qr_code) == clean_qr.lower(),
                Product.id != product.id
            ).first()
            if conflict:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={"success": False, "error": f"Product with QR Code '{clean_qr}' already exists (SKU: {conflict.sku})."},
                )
        product.qr_code = clean_qr

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

    old_images_to_cleanup: List[str] = []
    if payload.images is not None:
        clean_images: List[str] = []
        for img in payload.images:
            norm = normalize_image_reference(img)
            if norm and norm not in clean_images:
                clean_images.append(norm)
        clean_images = clean_images[:3]

        current_images = product.images or []
        for prev_img in current_images:
            if prev_img and prev_img.startswith("products/") and prev_img not in clean_images:
                old_images_to_cleanup.append(prev_img)

        product.images = clean_images
        product.image_url = clean_images[0] if clean_images else None
    elif payload.image_url is not None:
        new_image = normalize_image_reference(payload.image_url)
        if product.image_url and product.image_url != new_image and product.image_url.startswith("products/"):
            old_images_to_cleanup.append(product.image_url)
        product.image_url = new_image
        if new_image:
            if not product.images:
                product.images = [new_image]
            else:
                product.images = [new_image] + [img for img in product.images[1:] if img != new_image][:2]
        else:
            product.images = []

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

    # Safely clean up previous replaced images only after successful DB commit
    for old_img in old_images_to_cleanup:
        minio_service.delete_object_if_unreferenced(old_img, db, exclude_product_id=product.id)

    return product


def soft_delete_product(db: Session, product: Product) -> None:
    """Soft delete product (set is_active=False and status='unavailable')."""
    product.is_active = False
    product.status = "unavailable"
    db.commit()


def delete_product_permanent(db: Session, product: Product) -> None:
    """Permanently delete product from database and cleanup unreferenced MinIO images."""
    images_to_cleanup: List[str] = []
    if product.images:
        images_to_cleanup.extend([img for img in product.images if img and img.startswith("products/")])
    elif product.image_url and product.image_url.startswith("products/"):
        images_to_cleanup.append(product.image_url)

    prod_id = product.id
    db.delete(product)
    db.commit()
    for img in set(images_to_cleanup):
        minio_service.delete_object_if_unreferenced(img, db, exclude_product_id=prod_id)
