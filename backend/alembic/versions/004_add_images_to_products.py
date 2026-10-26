"""add images column to products table

Revision ID: 004_add_images
Revises: 003_add_product_type
Create Date: 2026-10-26 16:35:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '004_add_images'
down_revision: Union[str, None] = '003_add_product_type'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('images', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='[]'))


def downgrade() -> None:
    op.drop_column('products', 'images')
