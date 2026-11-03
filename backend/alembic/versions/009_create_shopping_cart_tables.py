"""create shopping_carts and shopping_cart_items tables

Revision ID: 009_create_shopping_cart_tables
Revises: 008_create_customers_table
Create Date: 2026-11-03 13:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision: str = '009_create_shopping_cart_tables'
down_revision: Union[str, None] = '008_create_customers_table'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    if 'shopping_carts' not in existing_tables:
        op.create_table(
            'shopping_carts',
            sa.Column('id', UUID(as_uuid=True), primary_key=True),
            sa.Column('cart_token_hash', sa.String(length=64), nullable=False),
            sa.Column('status', sa.String(length=20), nullable=False, server_default='active'),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        )
        op.create_index('ix_shopping_carts_id', 'shopping_carts', ['id'])
        op.create_index('ix_shopping_carts_cart_token_hash', 'shopping_carts', ['cart_token_hash'], unique=True)

    if 'shopping_cart_items' not in existing_tables:
        op.create_table(
            'shopping_cart_items',
            sa.Column('id', UUID(as_uuid=True), primary_key=True),
            sa.Column('cart_id', UUID(as_uuid=True), sa.ForeignKey('shopping_carts.id', ondelete='CASCADE'), nullable=False),
            sa.Column('product_id', UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
            sa.Column('quantity', sa.Integer(), nullable=False, server_default='1'),
            sa.Column('unit_price_snapshot', sa.Numeric(precision=12, scale=2), nullable=False),
            sa.Column('added_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.CheckConstraint('quantity > 0', name='chk_cart_item_quantity_positive'),
            sa.CheckConstraint('unit_price_snapshot >= 0', name='chk_cart_item_price_non_negative'),
            sa.UniqueConstraint('cart_id', 'product_id', name='uq_cart_product'),
        )
        op.create_index('ix_shopping_cart_items_id', 'shopping_cart_items', ['id'])
        op.create_index('ix_shopping_cart_items_cart_id', 'shopping_cart_items', ['cart_id'])
        op.create_index('ix_shopping_cart_items_product_id', 'shopping_cart_items', ['product_id'])


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    if 'shopping_cart_items' in existing_tables:
        op.drop_table('shopping_cart_items')
    if 'shopping_carts' in existing_tables:
        op.drop_table('shopping_carts')

