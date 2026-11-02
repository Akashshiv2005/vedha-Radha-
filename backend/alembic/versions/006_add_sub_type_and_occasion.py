"""add sub_type and occasion to products table

Revision ID: 006_add_sub_type_and_occasion
Revises: 005_create_orders
Create Date: 2026-10-28 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '006_add_sub_type_and_occasion'
down_revision: Union[str, None] = '005_create_orders'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('products')]

    if 'sub_type' not in columns:
        op.add_column('products', sa.Column('sub_type', sa.String(length=100), nullable=True))
    if 'occasion' not in columns:
        op.add_column('products', sa.Column('occasion', sa.String(length=100), nullable=True))


def downgrade() -> None:
    op.drop_column('products', 'occasion')
    op.drop_column('products', 'sub_type')

