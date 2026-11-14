# Vedha Radha Thangamaaligai — Luxury Jewellery Platform

A modern luxury South Indian fine jewellery e-commerce platform crafted for **Vedha Radha Thangamaaligai (Trichy)**. Features high-resolution product showcases, certified diamond vaults, temple heritage collections, sacred silver pooja articles, live metal rate integration, customer appointments, and an administrative showroom management suite.

---

## Tech Stack

* **Frontend**: React 18, Vite 5, TailwindCSS, Lucide React, React Router 6
* **Backend**: FastAPI (Python 3.12 / 3.11), SQLAlchemy 2.x, Psycopg 3, Alembic, PyJWT
* **Database**: PostgreSQL 17 (`vedharadha_db`)
* **Object Storage**: MinIO S3-compatible asset storage (with local disk fallback)

---

## Quick Start for New Clones

Follow these steps when cloning the repository to a fresh machine or environment.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "vedharadha-website"
```

### 2. Backend & Database Setup

1. **Create and activate Python virtual environment**:
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` inside `backend/`:
   ```powershell
   cp .env.example .env
   ```
   Ensure your PostgreSQL connection string in `backend/.env` matches your local credentials:
   ```env
   DATABASE_URL="postgresql+psycopg://postgres:your_password@localhost:5432/vedharadha_db"
   ```

3. **Ensure PostgreSQL Database Exists**:
   ```sql
   CREATE DATABASE vedharadha_db;
   ```

---

## 3. Start MinIO Object Storage (Optional for Images)

To run MinIO for luxury product image storage:

```powershell
# Run MinIO Server (Windows):
D:\minio\minio.exe server D:\minio\data --console-address ":9001"

# Or on systems with minio in PATH:
minio server ~/minio/data --console-address ":9001"
```

* **API Endpoint**: `http://127.0.0.1:9000`
* **Web Console**: [http://127.0.0.1:9001](http://127.0.0.1:9001)
* **Default Credentials**: Username `minioadmin`, Password `minioadmin`
* **Bucket**: `vedharadha-products` (auto-created on startup)

*(Note: The platform automatically uses high-resolution local disk fallback images in `frontend/public/images/` if MinIO is not running).*

---

## 4. Database Seeding (One Single Command — Zero Duplicates)

To seed all **201 products** across Gold, Silver, Diamond, Coins & Bars, Temple Heritage, and Silver Pooja into PostgreSQL with **0 duplicates**, run this command from `vedharadha-website`:

```powershell
.\backend\.venv\Scripts\python.exe backend/seed_database.py
```

*(Or from inside `backend/` with virtual environment activated: `python seed_database.py`)*

### Pre-Flight Deduplication & Quality Guarantees
* **0 Duplicate IDs / SKUs**: Every product has a strictly unique identifier.
* **0 Duplicate Product Names**: Case-insensitive name checking prevents repeated titles.
* **0 Duplicate Primary Images**: Guarantees no two distinct products share the same photograph.
* **Strict Metal Purity**: Gold products are isolated with zero silver images or purity; silver products contain zero gold references.
* **100% On-Disk Asset Integrity**: Checks every single image path against physical files in `frontend/public/images/`.

### Breakdown of Seeded Products (201 Total)
* **Gold (93 items)**: Chains, Bangles, Kadas, Harams, Necklaces, Earrings, Rings, Nose Pins, Pendants, Wedding & Men's Gold.
* **Silver (74 items)**: 92.5 Fine Jewellery (Payals, Metti, Bangles) + Sacred Silver Pooja (Vilakkus, Kalashes, Thalis, Idols/Murtis).
* **Diamond (29 items)**: Solitaires, Waterfall Chandelier Earrings, Tennis Bracelets, Chokers, Rings, Nose Pins.
* **Coins & Bars (5 items)**: 24K 999 Pure Gold & 999 Silver bullion coins & bars.

---

## 5. Running the Application

### Start Backend API Server
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
* **Storefront Products API**: [http://localhost:8000/api/products](http://localhost:8000/api/products)

### Start Frontend Dev Server
```powershell
cd frontend
npm install
npm run dev -- --port 5174
```
* **Storefront Home**: [http://localhost:5174/](http://localhost:5174/)
* **Certified Diamond Vault**: [http://localhost:5174/diamonds](http://localhost:5174/diamonds)
* **Sacred Silver Pooja**: [http://localhost:5174/silver-pooja](http://localhost:5174/silver-pooja)
* **Fine Silver Jewellery**: [http://localhost:5174/silver](http://localhost:5174/silver)
* **Gold Jewellery**: [http://localhost:5174/gold](http://localhost:5174/gold)
* **Curated Collections**: [http://localhost:5174/collections/mens-accessories](http://localhost:5174/collections/mens-accessories)

---

## 6. Structured Database Architecture & Schema

The platform runs on a normalized PostgreSQL schema designed for high-concurrency luxury jewellery e-commerce, customer profiles, order fulfillment, multi-view image galleries, and audit logging.

### Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : "places"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    ORDERS ||--o{ PAYMENTS : "records"
    PRODUCTS ||--o{ ORDER_ITEMS : "referenced_in"
    SHOPPING_CARTS ||--o{ SHOPPING_CART_ITEMS : "contains"
    PRODUCTS ||--o{ SHOPPING_CART_ITEMS : "added_to"
    ADMIN_USERS ||--o{ PRODUCT_IMPORT_JOBS : "executes"

    PRODUCTS {
        uuid id PK
        string sku UK
        string name
        string product_type
        string category
        string sub_category
        decimal price
        string status
        string purity
        string gross_weight
        string hallmark_details
        jsonb images
        boolean is_active
        timestamp created_at
    }

    CUSTOMERS {
        uuid id PK
        string mobile_number UK
        string customer_name
        text full_address
        string pin_code
        string password_hash
        boolean is_active
        boolean is_verified
    }

    ORDERS {
        uuid id PK
        string order_number UK
        uuid customer_id FK
        string customer_name
        string phone
        decimal total_amount
        string order_status
        string payment_status
        string payment_method
        string channel
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        string product_sku
        string product_name
        decimal unit_price
        integer quantity
        decimal subtotal
    }

    PAYMENTS {
        uuid id PK
        uuid order_id FK
        string provider
        string provider_payment_id
        decimal amount
        string payment_status
    }

    SHOPPING_CARTS {
        uuid id PK
        string cart_token_hash UK
        string status
        timestamp expires_at
    }

    SHOPPING_CART_ITEMS {
        uuid id PK
        uuid cart_id FK
        uuid product_id FK
        integer quantity
        decimal unit_price_snapshot
    }

    COUPONS {
        uuid id PK
        string code UK
        string discount_type
        decimal discount_value
        decimal min_order_amount
        boolean is_active
    }

    ADMIN_USERS {
        uuid id PK
        string username UK
        string email UK
        string password_hash
        boolean is_superuser
    }

    PRODUCT_IMPORT_JOBS {
        uuid id PK
        uuid admin_id FK
        string filename
        integer total_rows
        integer created_count
        string status
    }
```

### Table Definitions & Specifications

| Table Name | Primary Key | Key Columns & Indexes | Description |
| :--- | :---: | :--- | :--- |
| **`products`** | `id` (UUID) | `sku` (Unique), `product_type`, `category`, `sub_category`, `price`, `status`, `is_active` | Master inventory catalogue. Stores all 201 products across Gold, Silver, Diamond, and Coins & Bars with weights, purities, 4Cs, and multi-view JSONB image galleries. |
| **`orders`** | `id` (UUID) | `order_number` (Unique), `customer_id`, `phone`, `total_amount`, `order_status`, `payment_status` | Customer orders across online storefront and showroom reservations with item snapshots, addresses, and delivery statuses. |
| **`order_items`** | `id` (UUID) | `order_id` (FK), `product_id` (FK), `product_sku`, `unit_price`, `quantity`, `subtotal` | Immutable line-item snapshots preserving price, purity, and gross weight at the moment of order placement. |
| **`customers`** | `id` (UUID) | `mobile_number` (Unique), `customer_name`, `full_address`, `pin_code`, `is_verified` | Verified customer accounts with addresses, mobile OTP state, and order history. |
| **`customer_otps`** | `id` (UUID) | `mobile_number`, `otp_code_hash`, `expires_at`, `is_used` | Time-limited passwordless SMS OTP tokens with brute-force expiration. |
| **`shopping_carts`** | `id` (UUID) | `cart_token_hash` (Unique), `status`, `expires_at`, `applied_coupon_code` | Persistent shopping cart sessions for anonymous guests and authenticated shoppers. |
| **`shopping_cart_items`** | `id` (UUID) | `cart_id` (FK), `product_id` (FK), `quantity`, `unit_price_snapshot` | Line items currently held in customer shopping carts. |
| **`payments`** | `id` (UUID) | `order_id` (FK), `provider`, `provider_payment_id`, `amount`, `payment_status` | Comprehensive payment gateway audit trail (Razorpay, UPI, Cash) with refund tracking. |
| **`coupons`** | `id` (UUID) | `code` (Unique), `discount_type`, `discount_value`, `min_order_amount`, `is_active` | Promotional discount engine supporting percentage and flat discounts with minimum order thresholds. |
| **`admin_users`** | `id` (UUID) | `username` (Unique), `email` (Unique), `password_hash`, `is_active`, `is_superuser` | Showroom administrative personnel credentials with Bcrypt authentication and JWT sessions. |
| **`product_import_jobs`** | `id` (UUID) | `admin_id` (FK), `filename`, `total_rows`, `created_count`, `status` | Audit history for batch CSV / Excel product imports with dry-run logs and error summaries. |

### Core Database Design Principles
1. **Universal UUID Primary Keys:** All tables use cryptographic UUID v4 primary keys to prevent enumeration attacks and support distributed scaling.
2. **Soft Deletions (`is_active`):** Products and users are never hard-deleted; soft-deactivation preserves order fulfillment and audit history.
3. **Decimal Precision for Pricing:** Prices, taxes, and subtotals use PostgreSQL `NUMERIC(12, 2)` to guarantee zero floating-point rounding errors.
4. **JSONB Image Galleries:** Products store primary and multi-perspective camera angles (macro, clasp, side) in optimized binary JSON (`jsonb`).
5. **Strict Data Integrity:** Foreign keys use cascading or restrict constraints to prevent orphaned order or payment records.
