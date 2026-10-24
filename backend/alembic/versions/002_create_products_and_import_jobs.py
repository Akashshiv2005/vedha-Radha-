"""create products and product_import_jobs tables

Revision ID: 002_create_products_and_import_jobs
Revises: 001_create_admin_users
Create Date: 2026-10-17 14:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_create_products'
down_revision: Union[str, None] = '001_create_admin_users'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create products table
    op.create_table(
        'products',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('sku', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('subtitle', sa.String(length=255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('sub_category', sa.String(length=100), nullable=True),
        sa.Column('item_type', sa.String(length=20), server_default='unique', nullable=False),
        sa.Column('price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('status', sa.String(length=30), server_default='available', nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('stock_quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('purity', sa.String(length=50), nullable=True),
        sa.Column('gross_weight', sa.String(length=50), nullable=True),
        sa.Column('net_weight', sa.String(length=50), nullable=True),
        sa.Column('hallmark_details', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('price >= 0', name='chk_product_price_non_negative'),
        sa.CheckConstraint('stock_quantity >= 0', name='chk_product_stock_non_negative'),
        sa.CheckConstraint("item_type IN ('unique', 'regular')", name='chk_product_item_type'),
        sa.CheckConstraint("status IN ('available', 'reserved', 'sold', 'sold_showroom', 'unavailable')", name='chk_product_status'),
    )
    op.create_index('ix_products_id', 'products', ['id'], unique=False)
    op.create_index('ix_products_sku', 'products', ['sku'], unique=True)
    op.create_index('ix_products_name', 'products', ['name'], unique=False)
    op.create_index('ix_products_category', 'products', ['category'], unique=False)

    # 2. Create product_import_jobs table
    op.create_table(
        'product_import_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('admin_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('admin_users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('total_rows', sa.Integer(), server_default='0', nullable=False),
        sa.Column('valid_rows', sa.Integer(), server_default='0', nullable=False),
        sa.Column('invalid_rows', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('skipped_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('status', sa.String(length=50), server_default='completed', nullable=False),
        sa.Column('error_summary', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_product_import_jobs_id', 'product_import_jobs', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_product_import_jobs_id', table_name='product_import_jobs')
    op.drop_table('product_import_jobs')

    op.drop_index('ix_products_category', table_name='products')
    op.drop_index('ix_products_name', table_name='products')
    op.drop_index('ix_products_sku', table_name='products')
    op.drop_index('ix_products_id', table_name='products')
    op.drop_table('products')
