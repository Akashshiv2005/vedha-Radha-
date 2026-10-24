from datetime import datetime
from decimal import Decimal
import re
from typing import Any, List, Optional
import uuid
from pydantic import BaseModel, ConfigDict, Field, computed_field, field_validator, model_validator

STOREFRONT_CATEGORY_MAP = {
    "earrings": ["studs", "hangings", "drops", "jhumkas", "hoops & bali", "earrings & jhumkas"],
    "rings": ["engagement rings", "casual rings"],
    "bangle & bracelets": ["bangles", "cuff bracelets", "chain bracelets", "bangles & kadas"],
    "bangles": ["bangles", "cuff bracelets", "chain bracelets", "bangles & kadas"],
    "necklace": ["short necklace", "long necklace", "chains & neckwear"],
    "necklaces": ["short necklace", "long necklace", "chains & neckwear"],
    "nosepin": [],
    "occasion": ["casual wear", "party wear", "traditional wear"],
    "chains": [],
    "pendant": [],
    "pendants": [],
    "anklets": ["anklets & kolusu"],
    "toe rings": ["toe rings & metti"],
    "gold coins": [],
    "gold bars": [],
    "silver coins": [],
    "silver bars": [],
    "gold jewellery": ["chains & neckwear", "earrings & jhumkas", "bangles & kadas", "antique temple sets", "bangles", "earrings", "rings", "necklaces"],
    "silver jewellery": ["anklets & kolusu", "toe rings & metti", "silver chains & pendants", "silver bangles & kadas", "anklets", "toe rings"],
    "silver articles": ["pooja articles", "pooja utensils", "silver lamps & deepams", "silver bowls & dinnerware", "silver idols & murti"],
    "temple jewellery": ["temple harams", "long harams", "deity ornaments", "nagapadam sets"],
    "bridal jewellery": ["muhurtham sets", "bridal chokers", "chokers", "kasu malas", "vaddanam"],
    "coins & bars": ["gold coins", "gold bars", "silver coins", "silver bars"],
}

PRODUCT_TYPE_CATEGORY_MAP = {
    "gold": [
        "earrings", "rings", "bangles & bracelets", "bangles", "necklace", "necklaces",
        "nosepin", "occasion", "chains", "pendant", "pendants", "anklets", "toe rings",
        "gold jewellery", "temple jewellery", "bridal jewellery"
    ],
    "silver": [
        "earrings", "rings", "bangles & bracelets", "bangles", "necklace", "necklaces",
        "nosepin", "occasion", "chains", "pendant", "pendants", "anklets", "toe rings",
        "silver jewellery", "silver articles"
    ],
    "coins_bars": [
        "gold coins", "gold bars", "silver coins", "silver bars", "coins & bars", "coins", "bars"
    ],
}


def normalize_product_type(v: Optional[str]) -> Optional[str]:
    if not v:
        return None
    val = v.strip().lower()
    if val == "gold":
        return "gold"
    if val == "silver":
        return "silver"
    if "coin" in val or "bar" in val:
        return "coins_bars"
    return val


def infer_product_type(category: str) -> str:
    cat = (category or "").strip().lower()
    if "coin" in cat or "bar" in cat:
        return "coins_bars"
    if "silver" in cat or "pooja" in cat or "article" in cat or "utensil" in cat:
        return "silver"
    return "gold"


class ProductBase(BaseModel):
    sku: str = Field(..., min_length=2, max_length=50, description="Unique stock keeping unit")
    name: str = Field(..., min_length=2, max_length=255, description="Product title")
    subtitle: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    product_type: Optional[str] = Field(None, max_length=50, description="'gold', 'silver', 'coins_bars'")
    category: str = Field(..., min_length=2, max_length=100)
    sub_category: Optional[str] = Field(None, max_length=100)
    item_type: str = Field("unique", description="'unique' or 'regular'")
    price: Decimal = Field(..., ge=0, description="Selling price (INR)")
    status: str = Field("available", description="'available', 'reserved', 'sold', 'sold_showroom'")
    image_url: Optional[str] = Field(None, max_length=500)
    stock_quantity: int = Field(1, ge=0, description="Stock quantity")
    purity: Optional[str] = Field(None, max_length=50)
    gross_weight: Optional[str] = Field(None, max_length=50)
    net_weight: Optional[str] = Field(None, max_length=50)
    hallmark_details: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)

    @field_validator("price", mode="before")
    @classmethod
    def parse_base_price(cls, v: Any) -> Any:
        if v is None:
            return v
        if isinstance(v, (int, float, Decimal)):
            return Decimal(str(v))
        if isinstance(v, str):
            clean = re.sub(r"[^\d.]", "", v)
            if clean:
                return Decimal(clean)
        return v

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        clean = (v or "").strip()
        if not clean:
            raise ValueError("Category cannot be empty.")
        if clean.lower() in ("all gold", "all silver", "all"):
            raise ValueError(f"'{clean}' is a storefront filter and cannot be saved as a product category.")
        return clean

    @field_validator("sub_category")
    @classmethod
    def validate_sub_category(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        clean = v.strip()
        if not clean:
            return None
        if clean.lower() in ("view all", "all"):
            raise ValueError(f"'{clean}' is a storefront filter and cannot be saved as a product subcategory.")
        return clean

    @field_validator("item_type")
    @classmethod
    def validate_item_type(cls, v: str) -> str:
        clean = (v or "").strip().lower()
        if clean not in ("unique", "regular"):
            raise ValueError("item_type must be either 'unique' or 'regular'")
        return clean

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        clean = (v or "").strip().lower()
        allowed = ("available", "reserved", "sold", "sold_showroom", "unavailable")
        if clean not in allowed:
            raise ValueError(f"status must be one of {allowed}")
        return clean


class ProductCreate(BaseModel):
    sku: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=2, max_length=255)
    subtitle: Optional[str] = None
    description: Optional[str] = None
    product_type: Optional[str] = Field(None, alias="productType")
    category: str = Field(..., min_length=2, max_length=100)
    sub_category: Optional[str] = Field(None, alias="subCategory")
    item_type: Optional[str] = Field(None, alias="itemType")
    is_unique: Optional[bool] = Field(None, alias="isUnique")
    price: Optional[Decimal] = None
    numeric_price: Optional[int] = Field(None, alias="numericPrice")
    status: str = "available"
    image_url: Optional[str] = Field(None, alias="image")
    stock_quantity: Optional[int] = Field(1, alias="stockQty")
    purity: Optional[str] = None
    gross_weight: Optional[str] = Field(None, alias="grossWeight")
    net_weight: Optional[str] = Field(None, alias="netWeight")
    hallmark_details: Optional[str] = Field(None, alias="hallmarkDetails")
    location: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    @field_validator("price", mode="before")
    @classmethod
    def parse_create_price(cls, v: Any) -> Any:
        if v is None:
            return v
        if isinstance(v, (int, float, Decimal)):
            return Decimal(str(v))
        if isinstance(v, str):
            clean = re.sub(r"[^\d.]", "", v)
            if clean:
                return Decimal(clean)
        return v

    @field_validator("category")
    @classmethod
    def validate_create_category(cls, v: str) -> str:
        clean = (v or "").strip()
        if not clean:
            raise ValueError("Category cannot be empty.")
        if clean.lower() in ("all gold", "all silver", "all"):
            raise ValueError(f"'{clean}' is a storefront filter and cannot be saved as a product category.")
        return clean

    @field_validator("sub_category")
    @classmethod
    def validate_create_sub_category(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        clean = v.strip()
        if not clean:
            return None
        if clean.lower() in ("view all", "all"):
            raise ValueError(f"'{clean}' is a storefront filter and cannot be saved as a product subcategory.")
        return clean

    @model_validator(mode="after")
    def validate_category_subcategory_combination(self) -> "ProductCreate":
        cat = (self.category or "").strip().lower()
        sub = (self.sub_category or "").strip().lower() if self.sub_category else None
        pt = normalize_product_type(self.product_type)

        if pt and cat:
            allowed_cats = PRODUCT_TYPE_CATEGORY_MAP.get(pt, [])
            if allowed_cats and not any(cat == c or c in cat or cat in c for c in allowed_cats):
                raise ValueError(f"Category '{self.category}' is not valid for Product Type '{self.product_type}'.")

        if cat and sub and cat in STOREFRONT_CATEGORY_MAP:
            allowed_subs = STOREFRONT_CATEGORY_MAP[cat]
            if allowed_subs and not any(sub in a or a in sub for a in allowed_subs):
                raise ValueError(f"Subcategory '{self.sub_category}' is incompatible with category '{self.category}'.")
        return self

    def resolve_item_type(self) -> str:
        if self.item_type:
            return self.item_type.strip().lower()
        if self.is_unique is not None:
            return "unique" if self.is_unique else "regular"
        return "unique"

    def resolve_price(self) -> Decimal:
        if self.price is not None:
            return Decimal(str(self.price))
        if self.numeric_price is not None:
            return Decimal(str(self.numeric_price))
        return Decimal("0.00")


class ProductUpdate(BaseModel):
    sku: Optional[str] = Field(None, min_length=2, max_length=50)
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    subtitle: Optional[str] = None
    description: Optional[str] = None
    product_type: Optional[str] = Field(None, alias="productType")
    category: Optional[str] = None
    sub_category: Optional[str] = Field(None, alias="subCategory")
    item_type: Optional[str] = Field(None, alias="itemType")
    is_unique: Optional[bool] = Field(None, alias="isUnique")
    price: Optional[Decimal] = None
    numeric_price: Optional[int] = Field(None, alias="numericPrice")
    status: Optional[str] = None
    image_url: Optional[str] = Field(None, alias="image")
    stock_quantity: Optional[int] = Field(None, alias="stockQty")
    purity: Optional[str] = None
    gross_weight: Optional[str] = Field(None, alias="grossWeight")
    net_weight: Optional[str] = Field(None, alias="netWeight")
    hallmark_details: Optional[str] = Field(None, alias="hallmarkDetails")
    location: Optional[str] = None
    is_active: Optional[bool] = Field(None, alias="isActive")

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    @field_validator("price", mode="before")
    @classmethod
    def parse_update_price(cls, v: Any) -> Any:
        if v is None:
            return v
        if isinstance(v, (int, float, Decimal)):
            return Decimal(str(v))
        if isinstance(v, str):
            clean = re.sub(r"[^\d.]", "", v)
            if clean:
                return Decimal(clean)
        return v

    @field_validator("category")
    @classmethod
    def validate_update_category(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        clean = v.strip()
        if not clean:
            raise ValueError("Category cannot be empty.")
        if clean.lower() in ("all gold", "all silver", "all"):
            raise ValueError(f"'{clean}' is a storefront filter and cannot be saved as a product category.")
        return clean

    @field_validator("sub_category")
    @classmethod
    def validate_update_sub_category(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        clean = v.strip()
        if not clean:
            return None
        if clean.lower() in ("view all", "all"):
            raise ValueError(f"'{clean}' is a storefront filter and cannot be saved as a product subcategory.")
        return clean

    @model_validator(mode="after")
    def validate_update_combination(self) -> "ProductUpdate":
        cat = self.category.strip().lower() if self.category else None
        sub = self.sub_category.strip().lower() if self.sub_category else None
        pt = normalize_product_type(self.product_type) if self.product_type else None

        if pt and cat:
            allowed_cats = PRODUCT_TYPE_CATEGORY_MAP.get(pt, [])
            if allowed_cats and not any(cat == c or c in cat or cat in c for c in allowed_cats):
                raise ValueError(f"Category '{self.category}' is not valid for Product Type '{self.product_type}'.")

        if cat and sub and cat in STOREFRONT_CATEGORY_MAP:
            allowed_subs = STOREFRONT_CATEGORY_MAP[cat]
            if allowed_subs and not any(sub in a or a in sub for a in allowed_subs):
                raise ValueError(f"Subcategory '{self.sub_category}' is incompatible with category '{self.category}'.")
        return self


def normalize_image_reference(image_ref: Optional[str]) -> Optional[str]:
    """
    Extract stable object key from presigned URL or preserve local/remote path.
    Prevents expiring query parameters from being stored in PostgreSQL.
    """
    if not image_ref:
        return None
    cleaned = image_ref.strip()
    if not cleaned:
        return None
    # If it contains query parameters (e.g. presigned URL), strip them
    if "?" in cleaned:
        cleaned = cleaned.split("?")[0]
    # If it contains /products/ in URL path, extract products/...
    if "/products/" in cleaned:
        idx = cleaned.find("products/")
        return cleaned[idx:]
    return cleaned


class ProductImageUploadResponse(BaseModel):
    success: bool = True
    object_key: str = Field(..., description="Collision-resistant MinIO object key")
    image_url: str = Field(..., description="Presigned URL or browser-loadable image path")
    content_type: str = Field(..., description="MIME content type")
    size: int = Field(..., description="File size in bytes")


class ProductPublic(BaseModel):
    id: uuid.UUID
    sku: str
    name: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    product_type: Optional[str] = None
    category: str
    sub_category: Optional[str] = None
    item_type: str
    price: Decimal
    status: str
    image_url: Optional[str] = None
    stock_quantity: int
    purity: Optional[str] = None
    gross_weight: Optional[str] = None
    net_weight: Optional[str] = None
    hallmark_details: Optional[str] = None
    location: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    def id_str(self) -> str:
        return str(self.id)

    @computed_field
    def productType(self) -> str:
        if self.product_type:
            pt = self.product_type.lower()
            if pt == "gold":
                return "Gold"
            if pt == "silver":
                return "Silver"
            if "coin" in pt or "bar" in pt:
                return "Coins & Bars"
            return self.product_type
        pt_inf = infer_product_type(self.category)
        if pt_inf == "coins_bars":
            return "Coins & Bars"
        return pt_inf.capitalize()

    @computed_field
    def isUnique(self) -> bool:
        return self.item_type == "unique"

    @computed_field
    def subCategory(self) -> Optional[str]:
        return self.sub_category

    @computed_field
    def stockQty(self) -> int:
        return self.stock_quantity

    @computed_field
    def numericPrice(self) -> int:
        return int(self.price)

    @computed_field
    def price_formatted(self) -> str:
        return f"{int(self.price):,}"

    @computed_field
    def image(self) -> str:
        if not self.image_url:
            return "/images/neutral_product_placeholder.svg"
        if self.image_url.startswith("products/"):
            try:
                from ..services.minio_service import minio_service
                return minio_service.get_presigned_url(self.image_url)
            except Exception:
                return self.image_url
        return self.image_url

    @computed_field
    def availability(self) -> str:
        is_sold = "sold" in self.status.lower()
        if is_sold or self.stock_quantity <= 0:
            return "out_of_stock"
        return "in_stock"

    @computed_field
    def updatedDate(self) -> str:
        return self.updated_at.strftime("%d %b %Y")

    @computed_field
    def updatedTime(self) -> str:
        return self.updated_at.strftime("%I:%M %p")

    @computed_field
    def lastUpdated(self) -> str:
        return f"{self.updatedDate}\n{self.updatedTime}"

    @computed_field
    def grossWeight(self) -> Optional[str]:
        return self.gross_weight

    @computed_field
    def netWeight(self) -> Optional[str]:
        return self.net_weight

    @computed_field
    def hallmarkDetails(self) -> Optional[str]:
        return self.hallmark_details

    @computed_field
    def badge(self) -> str:
        if "sold" in self.status.lower() or self.stock_quantity <= 0:
            return "Sold"
        if self.hallmark_details:
            return self.hallmark_details
        if "gold" in self.category.lower():
            return "22K BIS 916"
        if "silver" in self.category.lower():
            return "92.5 Silver"
        return "In stock"

    @computed_field
    def badgeType(self) -> str:
        if "sold" in self.status.lower() or self.stock_quantity <= 0:
            return "out-of-stock"
        if self.item_type == "unique":
            return "one-piece"
        return "in-stock"

    @computed_field
    def details(self) -> str:
        return self.hallmark_details or self.purity or ("22K BIS 916" if "gold" in self.category.lower() else "92.5 Silver")

    @computed_field
    def weight(self) -> Optional[str]:
        return self.gross_weight or self.net_weight

    @computed_field
    def subCategorySlug(self) -> str:
        return (self.sub_category or "").lower().replace(" ", "-")

    @computed_field
    def subType(self) -> str:
        return (self.sub_category or "").lower().replace(" ", "-")

    @computed_field
    def images(self) -> List[str]:
        img = self.image
        return [img] if img else []


class ProductListResponse(BaseModel):
    items: List[ProductPublic]
    total: int
    page: int
    page_size: int
    total_pages: int


class ProductImportRowError(BaseModel):
    row: int
    field: Optional[str] = None
    reason: str
    sku: Optional[str] = None


class ProductImportResponse(BaseModel):
    success: bool
    dry_run: bool
    total_rows: int
    valid_rows: int
    invalid_rows: int
    created_count: int
    skipped_count: int
    errors: List[ProductImportRowError]
