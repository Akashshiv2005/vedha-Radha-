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
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    print('=== ALL TABLES IN POSTGRESQL (vedharadha_db) ===')
    for t in tables:
        tname = t[0]
        cur.execute(f'SELECT COUNT(*) FROM "{tname}";')
        cnt = cur.fetchone()[0]
        print(f'   - {tname:<25} ({cnt} records)')
conn.close()

