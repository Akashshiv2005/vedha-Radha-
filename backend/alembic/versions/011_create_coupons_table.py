"""create coupons table and add applied_coupon_code to shopping_carts

Revision ID: 011_create_coupons_table
Revises: 010_order_items_and_payments
Create Date: 2026-11-03 15:45:00.000000

"""
from typing import Sequence, Union
import uuid
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision: str = '011_create_coupons_table'
down_revision: Union[str, None] = '010_order_items_and_payments'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    # 1. Create coupons table
    if 'coupons' not in existing_tables:
        op.create_table(
            'coupons',
            sa.Column('id', UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column('code', sa.String(length=50), unique=True, nullable=False),
            sa.Column('discount_type', sa.String(length=20), nullable=False, server_default='percentage'),
            sa.Column('discount_value', sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column('min_order_amount', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
            sa.Column('max_discount_amount', sa.Numeric(precision=12, scale=2), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
            sa.Column('valid_from', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column('valid_until', sa.DateTime(timezone=True), nullable=True),
            sa.Column('times_used', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('description', sa.String(length=255), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        )
        op.create_index('ix_coupons_id', 'coupons', ['id'])
        op.create_index('ix_coupons_code', 'coupons', ['code'], unique=True)

        # Seed initial authentic discount coupons
        coupons_table = sa.table(
            'coupons',
            sa.column('id', UUID(as_uuid=True)),
            sa.column('code', sa.String),
            sa.column('discount_type', sa.String),
            sa.column('discount_value', sa.Numeric),
            sa.column('min_order_amount', sa.Numeric),
            sa.column('max_discount_amount', sa.Numeric),
            sa.column('is_active', sa.Boolean),
            sa.column('description', sa.String),
        )
        op.bulk_insert(
            coupons_table,
            [
                {
                    'id': uuid.uuid4(),
                    'code': 'WELCOME5',
                    'discount_type': 'percentage',
                    'discount_value': 5.0,
                    'min_order_amount': 5000.0,
                    'max_discount_amount': 5000.0,
                    'is_active': True,
                    'description': '5% privilege discount on orders above ₹5,000 (up to ₹5,000)',
                },
                {
                    'id': uuid.uuid4(),
                    'code': 'VEDHA1000',
                    'discount_type': 'fixed',
                    'discount_value': 1000.0,
                    'min_order_amount': 20000.0,
                    'max_discount_amount': 1000.0,
                    'is_active': True,
                    'description': 'Flat ₹1,000 off on gold and silver orders above ₹20,000',
                },
                {
                    'id': uuid.uuid4(),
                    'code': 'FESTIVE10',
                    'discount_type': 'percentage',
                    'discount_value': 10.0,
                    'min_order_amount': 50000.0,
                    'max_discount_amount': 10000.0,
                    'is_active': True,
                    'description': '10% festive saving on luxury jewellery purchases above ₹50,000',
                },
            ]
        )

    # 2. Add applied_coupon_code to shopping_carts
    if 'shopping_carts' in existing_tables:
        cart_cols = [c['name'] for c in inspector.get_columns('shopping_carts')]
        if 'applied_coupon_code' not in cart_cols:
            op.add_column('shopping_carts', sa.Column('applied_coupon_code', sa.String(50), nullable=True))

    # 3. Add coupon_code to orders
    if 'orders' in existing_tables:
        order_cols = [c['name'] for c in inspector.get_columns('orders')]
        if 'coupon_code' not in order_cols:
            op.add_column('orders', sa.Column('coupon_code', sa.String(50), nullable=True))


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    if 'shopping_carts' in existing_tables:
        cart_cols = [c['name'] for c in inspector.get_columns('shopping_carts')]
        if 'applied_coupon_code' in cart_cols:
            op.drop_column('shopping_carts', 'applied_coupon_code')

    if 'orders' in existing_tables:
        order_cols = [c['name'] for c in inspector.get_columns('orders')]
        if 'coupon_code' in order_cols:
            op.drop_column('orders', 'coupon_code')

    if 'coupons' in existing_tables:
        op.drop_table('coupons')

