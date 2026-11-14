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
try:
    conn = psycopg.connect(db_url)
    print('SUCCESS: Connected to PostgreSQL using settings.DATABASE_URL')
    with conn.cursor() as cur:
        cur.execute('SELECT COUNT(*) FROM products;')
        print(f'   Total products in DB: {cur.fetchone()[0]}')
        cur.execute('SELECT product_type, COUNT(*) FROM products GROUP BY product_type;')
        print(f'   By product_type: {cur.fetchall()}')
        cur.execute("SELECT sku, name, price, product_type FROM products WHERE product_type = 'diamond' LIMIT 5;")
        print('   Sample Diamonds in DB:')
        for row in cur.fetchall():
            print(f'      - [{row[0]}] {row[1]} (Price: {row[2]})')
    conn.close()
except Exception as e:
    print('Failed to connect to PostgreSQL:', e)

