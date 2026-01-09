from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database.session import Base

class Habit(Base):
    __tablename__ = "habits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    is_from_library = Column(Boolean, default=False)
    current_streak = Column(Integer, default=0)

class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(UUID(as_uuid=True), ForeignKey("habits.id", ondelete="CASCADE"))
    status = Column(Boolean, default=False)
    logged_at = Column(Date, nullable=False) # Format: YYYY-MM-DD