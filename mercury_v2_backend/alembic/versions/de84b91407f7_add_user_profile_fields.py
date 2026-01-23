"""add_user_profile_fields

Revision ID: de84b91407f7
Revises: 536af074756e
Create Date: 2026-01-23 14:31:38.087076

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'de84b91407f7'
down_revision: Union[str, Sequence[str], None] = '536af074756e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add new profile fields to users table
    op.add_column('users', sa.Column('nickname', sa.String(length=100), nullable=True))
    op.add_column('users', sa.Column('job_title', sa.String(length=100), nullable=True))
    op.add_column('users', sa.Column('bio', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('avatar_url', sa.String(length=500), nullable=True))
    op.add_column('users', sa.Column('preferences', sa.dialects.postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('users', sa.Column('notification_settings', sa.dialects.postgresql.JSONB(astext_type=sa.Text()), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove profile fields from users table
    op.drop_column('users', 'notification_settings')
    op.drop_column('users', 'preferences')
    op.drop_column('users', 'avatar_url')
    op.drop_column('users', 'bio')
    op.drop_column('users', 'job_title')
    op.drop_column('users', 'nickname')
