from sqlalchemy import Column, String, Enum, Date, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database.session import Base
import enum

class ContentType(str, enum.Enum):
    QUOTE = "quote"
    HABIT_SUGGESTION = "habit_suggestion"
    AVATAR_NARRATIVE = "avatar_narrative"

class CMSContent(Base):
    __tablename__ = "cms_contents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_type = Column(String, nullable=False)
    text_body = Column(Text, nullable=False)
    mood_category = Column(String, nullable=True)
    scheduled_date = Column(Date, nullable=True)