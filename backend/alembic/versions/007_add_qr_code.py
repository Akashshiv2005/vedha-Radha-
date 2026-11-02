"""add qr_code column and unique index to products table

Revision ID: 007_add_qr_code
Revises: 006_add_sub_type_and_occasion
Create Date: 2026-10-30 14:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '007_add_qr_code'
down_revision: Union[str, None] = '006_add_sub_type_and_occasion'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('products')]

    if 'qr_code' not in columns:
        op.add_column('products', sa.Column('qr_code', sa.String(length=100), nullable=True))

    indexes = [idx['name'] for idx in inspector.get_indexes('products')]
    if 'ix_products_qr_code' not in indexes:
        op.create_index('ix_products_qr_code', 'products', ['qr_code'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_products_qr_code', table_name='products')
    op.drop_column('products', 'qr_code')

