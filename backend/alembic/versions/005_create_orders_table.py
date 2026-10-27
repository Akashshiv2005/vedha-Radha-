"""create orders table

Revision ID: 005_create_orders
Revises: 004_add_images
Create Date: 2026-10-27 10:50:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '005_create_orders'
down_revision: Union[str, None] = '004_add_images'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    if 'orders' not in tables:
        op.create_table(
            'orders',
            sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column('order_number', sa.String(length=50), nullable=False),
            sa.Column('customer_name', sa.String(length=255), nullable=False),
            sa.Column('phone', sa.String(length=50), nullable=False),
            sa.Column('email', sa.String(length=255), nullable=True),
            sa.Column('product_sku', sa.String(length=50), nullable=False),
            sa.Column('product_name', sa.String(length=255), nullable=False),
            sa.Column('product_image', sa.String(length=500), nullable=True),
            sa.Column('unit_price', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
            sa.Column('quantity', sa.Integer(), nullable=False, server_default='1'),
            sa.Column('discount', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
            sa.Column('tax', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
            sa.Column('total_amount', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
            sa.Column('channel', sa.String(length=50), nullable=False, server_default='Showroom'),
            sa.Column('payment_method', sa.String(length=50), nullable=False, server_default='UPI'),
            sa.Column('payment_status', sa.String(length=50), nullable=False, server_default='paid'),
            sa.Column('order_status', sa.String(length=50), nullable=False, server_default='processing'),
            sa.Column('city', sa.String(length=100), nullable=True, server_default='Madurai'),
            sa.Column('delivery_address', sa.Text(), nullable=True),
            sa.Column('notes', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        )
        op.create_index('ix_orders_id', 'orders', ['id'], unique=False)
        op.create_index('ix_orders_order_number', 'orders', ['order_number'], unique=True)
        op.create_index('ix_orders_customer_name', 'orders', ['customer_name'], unique=False)
        op.create_index('ix_orders_phone', 'orders', ['phone'], unique=False)
        op.create_index('ix_orders_product_sku', 'orders', ['product_sku'], unique=False)


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    if 'orders' in tables:
        op.drop_table('orders')
