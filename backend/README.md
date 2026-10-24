# Vedha Radha Thangamaaligai — FastAPI Backend

FastAPI backend with PostgreSQL, SQLAlchemy 2.x, Alembic, and JWT-based authentication for the Vedha Radha Thangamaaligai luxury jewellery e-commerce platform.

---

## Features

- **Framework**: FastAPI (Python 3.12 / 3.11+) with high-performance ASGI runtime.
- **Database**: PostgreSQL with SQLAlchemy 2.x ORM and Psycopg 3 native driver.
- **Migrations**: Alembic version-controlled schema migrations.
- **Authentication**:
  - Salted Bcrypt password hashing.
  - Signed JWT access tokens with configurable expiration.
  - Session revocation / token blacklisting on logout.
  - Brute-force rate limiting on login attempts.
- **Health Check**: Database ping and system status at `/api/health`.
- **Zero Frontend UI Breaking Changes**: Request/response contracts 100% matched to existing React Admin UI.

---

## Directory Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app factory, CORS, lifespan, routes
│   ├── core/
│   │   ├── config.py            # Pydantic Settings (.env loader)
│   │   ├── security.py          # Bcrypt hashing & PyJWT token utilities
│   │   └── rate_limiter.py      # Brute-force sliding-window rate limiter
│   ├── db/
│   │   ├── base.py              # Declarative Base
│   │   └── session.py           # Engine, SessionLocal, get_db, check_db_connection
│   ├── models/
│   │   ├── admin_user.py        # admin_users PostgreSQL table model
│   │   ├── product.py           # products PostgreSQL table model
│   │   └── product_import_job.py # product_import_jobs batch audit model
│   ├── schemas/
│   │   ├── auth.py              # LoginRequest, LoginSuccessResponse, etc.
│   │   ├── admin_user.py        # AdminUserPublic, AdminUserCreate
│   │   └── product.py           # ProductCreate, ProductUpdate, ProductPublic, etc.
│   ├── api/
│   │   ├── deps.py              # get_db, get_current_admin dependency
│   │   └── routes/
│   │       ├── auth.py          # /api/auth/login, /api/auth/me, /api/auth/logout
│   │       ├── products.py      # /api/admin/products CRUD and import endpoints
│   │       └── health.py        # /api/health
│   ├── services/
│   │   ├── auth_service.py      # Authentication logic, bootstrap, blacklist
│   │   ├── minio_service.py     # MinIO object storage, image validation & presigned URLs
│   │   ├── product_service.py   # Product filtering, pagination, search, CRUD
│   │   └── product_import_service.py # CSV & XLSX streaming parser, dry-run, atomic commit
├── alembic/
│   ├── env.py                   # Migration environment
│   ├── script.py.mako           # Migration template
│   └── versions/                # Migration scripts
│       ├── 001_create_admin_users.py
│       └── 002_create_products.py
├── scripts/
│   └── create_admin.py          # Safe admin creation / bootstrap CLI tool
├── tests/
│   ├── conftest.py              # TestClient fixture with isolated test DB
│   ├── test_auth.py             # Authentication & rate limiting tests
│   ├── test_health.py           # Health check test
│   ├── test_minio_image_storage.py # MinIO image upload, presigned URLs, & cleanup tests
│   ├── test_products.py         # Product CRUD, search, filter, pagination tests
│   └── test_product_import.py   # CSV/XLSX import, dry-run, safeguards, rollback tests
├── .env                         # Local environment configuration
├── .env.example                 # Configuration template
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## Product Inventory & Import Backend

### 1. API Endpoints

All product endpoints require authenticated administrator credentials via Bearer token (`Authorization: Bearer <token>`).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/products` | Paginated product list with search, category, status, and availability filters. |
| `GET` | `/api/admin/products/{id_or_sku}` | Retrieve a single product by numeric ID or SKU. |
| `POST` | `/api/admin/products` | Create a single product (rejects duplicate SKUs with `409 Conflict`). |
| `PUT` | `/api/admin/products/{id_or_sku}` | Update editable fields with status change safeguards. |
| `DELETE` | `/api/admin/products/{id_or_sku}` | Soft-deactivate product (`is_active = false`), preserving order & reservation history. |
| `POST` | `/api/admin/products/import` | Multipart CSV / XLSX batch import with dry-run validation and transactional commit. |

### 2. Search, Filter & Pagination Parameters (`GET /api/admin/products`)

- `page`: 1-indexed page number (default: `1`).
- `page_size`: items per page (default: `50`, maximum: `200`).
- `search`: Case-insensitive substring match across SKU, product name, subtitle, and description.
- `category`: Filter by product category (e.g., `Gold`, `Silver`, `Diamond`, `Coins`).
- `status`: Filter by status (`available`, `reserved`, `sold`).
- `item_type`: Filter by item type (`unique`, `regular`).
- `availability`: Filter by availability state (`in_stock`, `out_of_stock`).
- `sort_by`: Sort field (`created_at`, `updated_at`, `price`, `name`, `sku`, `stock_quantity`).
- `sort_order`: Sort direction (`asc` or `desc`, default: `desc`).

### 3. Product Import Specifications (`POST /api/admin/products/import`)

Accepts multipart form uploads (`file`) in `.csv` or `.xlsx` format.

#### Query Parameters:
- `dry_run`: `true` (default) validates the entire file without writing to PostgreSQL. `false` validates and executes an atomic database commit.

#### Required Headers:
`sku`, `name`, `category`, `price`

#### Optional Headers:
`subtitle`, `description`, `sub_category`, `item_type` (default: `unique`), `status` (default: `available`), `stock_quantity` (default: `1` for unique, `0` for regular), `gross_weight`, `net_weight`, `purity`, `hallmark`, `location`, `image_url`

#### CSV Template Example:
```csv
sku,name,category,sub_category,item_type,price,status,stock_quantity,gross_weight,net_weight,purity,hallmark,location,image_url,description
SA-101,Royal Peacock Silver Anklet,Silver,Anklets,unique,14500.00,available,1,45.2,43.5,92.5,BIS 925,Vault A-1,https://example.com/anklet.jpg,Handcrafted antique silver anklet.
GB-202,Classic Temple Gold Bangle,Gold,Bangles,regular,85000.00,available,5,22.0,21.8,916 22K,BIS 916,Display 3,https://example.com/bangle.jpg,Traditional 22K gold temple jewellery bangle.
```

#### Import Safeguards:
1. **Dry-Run Default**: Without explicitly passing `dry_run=false`, no database modifications occur.
2. **Duplicate SKU Detection**: Duplicates within the uploaded file and conflicts against existing database SKUs are flagged row-by-row.
3. **Protected Status Guarantee**: Existing products marked `sold` or `reserved` can never be accidentally reset to `available` via catalogue import.
4. **All-or-Nothing Transaction**: On actual import, all valid rows commit atomically. If unrecoverable database errors occur, the transaction rolls back cleanly.
5. **Import Audit Logging**: Every batch execution is recorded in `product_import_jobs` with admin ID, timestamp, row counts, and error summaries.

---

## Getting Started

### 1. Prerequisites
- Python 3.11+
- PostgreSQL running on `localhost:5432` with database `vedharadha_db`

### 2. Configuration
Copy `.env.example` to `.env` and verify database credentials:
```env
DATABASE_URL="postgresql+psycopg://postgres:0000@localhost:5432/vedharadha_db"
JWT_SECRET_KEY="your_secure_random_key_here"
```

### 3. Run Database Migrations
```bash
python -m alembic upgrade head
```

### 4. Bootstrap Administrator Account
```bash
python scripts/create_admin.py
```
Or create a custom administrator:
```bash
python scripts/create_admin.py --username admin --email admin@vedaradha.com --password admin@123
```

### 5. Run the Server
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive Swagger documentation will be available at:
`http://127.0.0.1:8000/docs`

### 6. MinIO Object Storage Setup & Commands

MinIO is used for storing product jewellery images in private bucket `vedharadha-products`.

#### Starting MinIO on Windows:
```powershell
# Set root credentials (development defaults)
$env:MINIO_ROOT_USER="minioadmin"
$env:MINIO_ROOT_PASSWORD="minioadmin"

# Start MinIO server pointing to data directory
D:\minio\minio.exe server D:\minio\data --console-address ":9001"
```
- API Endpoint: `http://127.0.0.1:9000`
- Web Console: `http://127.0.0.1:9001`
- Bucket Name: `vedharadha-products` (automatically verified and created if missing)

#### Environment Configuration (`.env`):
```env
MINIO_ENDPOINT="127.0.0.1:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="vedharadha-products"
MINIO_SECURE=false
MINIO_REGION=""
MINIO_AUTO_CREATE_BUCKET=true
MINIO_PRESIGNED_EXPIRY_SECONDS=86400
```

#### Upload API Endpoint (`POST /api/admin/products/upload-image`):
- Requires admin Bearer token (`Authorization: Bearer <token>`).
- Accepts multipart form-data (`file`).
- Allowed formats: JPEG, PNG, WebP (max 5 MB).
- Validates file headers via Pillow image decoding.
- Returns collision-resistant key `products/{uuid}.{ext}` and browser-ready presigned URL:
```json
{
  "success": true,
  "object_key": "products/e087d50b-4f82-4627-ae0e-7e7810555c66.jpg",
  "image_url": "http://127.0.0.1:9000/vedharadha-products/products/e087d50b-4f82-4627-ae0e-7e7810555c66.jpg?X-Amz-Algorithm=...",
  "content_type": "image/jpeg",
  "size": 885
}
```

#### Image Display & Presigned URLs:
- PostgreSQL stores only the stable object key (`products/{uuid}.{ext}`).
- FastAPI generates short-lived presigned GET URLs dynamically upon serialization into `ProductPublic.image`.
- Permanent backend redirect route: `GET /api/admin/products/images/{object_key}` redirects browsers to the current presigned MinIO URL.

#### Safe Image Cleanup:
- When a product photo is replaced or deleted, `minio_service.delete_object_if_unreferenced` checks whether other products reference the same image before deletion. Shared objects are always preserved.

#### Troubleshooting:
- **MinIO Connection Error / Port 9000 Refused**: Verify that MinIO server is running via `D:\minio\minio.exe server D:\minio\data --console-address ":9001"`. Check health via `http://127.0.0.1:9000/minio/health/live`.
- **413 Content Too Large**: File size exceeds 5 MB limit. Compress or resize image before upload.
- **400 Bad Request (Invalid/Corrupted image)**: Uploaded file is corrupted or not a valid image format.

### 7. Run Test Suite
```bash
python -m pytest tests/ -v
```
