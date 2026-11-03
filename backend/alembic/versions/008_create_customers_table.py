"""create customers and customer_otps tables

Revision ID: 008_create_customers_table
Revises: 007_add_qr_code
Create Date: 2026-11-03 11:15:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision: str = '008_create_customers_table'
down_revision: Union[str, None] = '007_add_qr_code'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    if 'customers' not in existing_tables:
        op.create_table(
            'customers',
            sa.Column('id', UUID(as_uuid=True), primary_key=True),
            sa.Column('customer_name', sa.String(length=255), nullable=False),
            sa.Column('mobile_number', sa.String(length=10), nullable=False),
            sa.Column('alternative_mobile_number', sa.String(length=10), nullable=True),
            sa.Column('full_address', sa.Text(), nullable=False),
            sa.Column('pin_code', sa.String(length=6), nullable=False),
            sa.Column('password_hash', sa.String(length=255), nullable=False),
            sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
            sa.Column('is_verified', sa.Boolean(), server_default='true', nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        )
        op.create_index('ix_customers_id', 'customers', ['id'], unique=False)
        op.create_index('ix_customers_mobile_number', 'customers', ['mobile_number'], unique=True)

    if 'customer_otps' not in existing_tables:
        op.create_table(
            'customer_otps',
            sa.Column('id', UUID(as_uuid=True), primary_key=True),
            sa.Column('mobile_number', sa.String(length=10), nullable=False),
            sa.Column('otp_code', sa.String(length=10), nullable=False),
            sa.Column('purpose', sa.String(length=50), server_default='FORGOT_PASSWORD', nullable=False),
            sa.Column('is_used', sa.Boolean(), server_default='false', nullable=False),
            sa.Column('attempts', sa.Integer(), server_default='0', nullable=False),
            sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        )
        op.create_index('ix_customer_otps_id', 'customer_otps', ['id'], unique=False)
        op.create_index('ix_customer_otps_mobile_number', 'customer_otps', ['mobile_number'], unique=False)


def downgrade() -> None:
    op.drop_table('customer_otps')
    op.drop_table('customers')

