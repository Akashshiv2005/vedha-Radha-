"""add product_type to products table

Revision ID: 003_add_product_type
Revises: 002_create_products
Create Date: 2026-10-22 01:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '003_add_product_type'
down_revision: Union[str, None] = '002_create_products'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add product_type column
    op.add_column('products', sa.Column('product_type', sa.String(length=50), nullable=True))
    op.create_index('ix_products_product_type', 'products', ['product_type'], unique=False)

    # 2. Backfill existing products based on existing category
    op.execute("""
        UPDATE products 
        SET product_type = CASE 
            WHEN LOWER(category) LIKE '%coin%' OR LOWER(category) LIKE '%bar%' THEN 'coins_bars'
            WHEN LOWER(category) LIKE '%silver%' OR LOWER(category) LIKE '%pooja%' OR LOWER(category) LIKE '%article%' THEN 'silver'
            ELSE 'gold'
        END
        WHERE product_type IS NULL;
    """)


def downgrade() -> None:
    op.drop_index('ix_products_product_type', table_name='products')
    op.drop_column('products', 'product_type')
