"""create order_items, payments tables and expand orders table

Revision ID: 010_order_items_and_payments
Revises: 009_create_shopping_cart_tables
Create Date: 2026-11-03 14:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision: str = '010_order_items_and_payments'
down_revision: Union[str, None] = '009_create_shopping_cart_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    # Expand orders table if columns do not exist
    if 'orders' in existing_tables:
        existing_cols = [c['name'] for c in inspector.get_columns('orders')]
        
        if 'customer_id' not in existing_cols:
            op.add_column('orders', sa.Column('customer_id', UUID(as_uuid=True), sa.ForeignKey('customers.id', ondelete='SET NULL'), nullable=True))
        if 'state' not in existing_cols:
            op.add_column('orders', sa.Column('state', sa.String(100), nullable=True))
        if 'pin_code' not in existing_cols:
            op.add_column('orders', sa.Column('pin_code', sa.String(20), nullable=True))
        if 'alternate_phone' not in existing_cols:
            op.add_column('orders', sa.Column('alternate_phone', sa.String(50), nullable=True))
        if 'subtotal' not in existing_cols:
            op.add_column('orders', sa.Column('subtotal', sa.Numeric(12, 2), nullable=True, server_default='0.00'))
        if 'delivery_charge' not in existing_cols:
            op.add_column('orders', sa.Column('delivery_charge', sa.Numeric(12, 2), nullable=True, server_default='0.00'))
        if 'idempotency_key' not in existing_cols:
            op.add_column('orders', sa.Column('idempotency_key', sa.String(64), nullable=True))
        if 'guest_token_hash' not in existing_cols:
            op.add_column('orders', sa.Column('guest_token_hash', sa.String(64), nullable=True))

    # Create order_items table
    if 'order_items' not in existing_tables:
        op.create_table(
            'order_items',
            sa.Column('id', UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column('order_id', UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
            sa.Column('product_id', UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='SET NULL'), nullable=True),
            sa.Column('product_sku', sa.String(50), nullable=False),
            sa.Column('product_name', sa.String(255), nullable=False),
            sa.Column('product_image', sa.String(500), nullable=True),
            sa.Column('purity', sa.String(50), nullable=True),
            sa.Column('weight_grams', sa.Numeric(10, 3), nullable=True),
            sa.Column('unit_price', sa.Numeric(12, 2), nullable=False, server_default='0.00'),
            sa.Column('quantity', sa.Integer(), nullable=False, server_default='1'),
            sa.Column('subtotal', sa.Numeric(12, 2), nullable=False, server_default='0.00'),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        )
        op.create_index('ix_order_items_id', 'order_items', ['id'])
        op.create_index('ix_order_items_order_id', 'order_items', ['order_id'])
        op.create_index('ix_order_items_product_id', 'order_items', ['product_id'])

    # Create payments table
    if 'payments' not in existing_tables:
        op.create_table(
            'payments',
            sa.Column('id', UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column('order_id', UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
            sa.Column('provider', sa.String(50), nullable=False),
            sa.Column('provider_order_id', sa.String(100), nullable=True),
            sa.Column('provider_payment_id', sa.String(100), nullable=True),
            sa.Column('amount', sa.Numeric(12, 2), nullable=False),
            sa.Column('currency', sa.String(10), nullable=False, server_default='INR'),
            sa.Column('payment_method', sa.String(50), nullable=False),
            sa.Column('payment_status', sa.String(50), nullable=False, server_default='pending'),
            sa.Column('signature', sa.String(255), nullable=True),
            sa.Column('error_message', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        )
        op.create_index('ix_payments_id', 'payments', ['id'])
        op.create_index('ix_payments_order_id', 'payments', ['order_id'])
        op.create_index('ix_payments_provider_order_id', 'payments', ['provider_order_id'])


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    if 'payments' in existing_tables:
        op.drop_table('payments')
    if 'order_items' in existing_tables:
        op.drop_table('order_items')

