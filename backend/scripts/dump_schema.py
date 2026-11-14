import os, sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

pg_bin = r'C:\Program Files\PostgreSQL\17\bin'
if os.path.exists(pg_bin):
    os.environ['PATH'] = pg_bin + ';' + os.environ.get('PATH', '')
os.environ.setdefault('PSYCOPG_IMPL', 'python')

from app.core.config import settings
import psycopg

db_url = str(settings.DATABASE_URL).replace("postgresql+psycopg://", "postgresql://")
conn = psycopg.connect(db_url)
with conn.cursor() as cur:
    for tname in ['products', 'orders', 'order_items', 'customers', 'shopping_carts', 'shopping_cart_items', 'payments', 'coupons', 'admin_users', 'product_import_jobs']:
        cur.execute(f"""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = '{tname}'
            ORDER BY ordinal_position;
        """)
        cols = cur.fetchall()
        print(f"\n--- TABLE: {tname} ({len(cols)} columns) ---")
        for c in cols:
            print(f"  {c[0]:<25} {c[1]:<20} Nullable={c[2]}")
conn.close()

