import enum
from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database.session import Base

class FocusStatus(str, enum.Enum):
    COMPLETED = "completed"
    INTERRUPTED = "interrupted"

class FocusSession(Base):
    __tablename__ = "focus_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    duration_minutes = Column(Integer, nullable=False)
    session_type = Column(String, nullable=False)
    status = Column(Enum(FocusStatus), nullable=False, default=FocusStatus.COMPLETED)
    created_at = Column(DateTime, default=datetime.utcnow)