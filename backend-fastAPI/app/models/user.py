from sqlalchemy import Column, String, Integer, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class AvatarStatus(str, enum.Enum):
    UP = "up"
    DOWN = "down"
    STABLE = "stable"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default=UserRole.USER)
    current_streak = Column(Integer, default=0)
    avatar_status = Column(String, default=AvatarStatus.STABLE)
    created_at = Column(DateTime, default=datetime.utcnow)