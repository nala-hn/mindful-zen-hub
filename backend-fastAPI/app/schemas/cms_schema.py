from pydantic import BaseModel
from typing import Optional
from datetime import date
from uuid import UUID

class CMSCreate(BaseModel):
    content_type: str
    text_body: str
    mood_category: Optional[str] = None
    scheduled_date: Optional[date] = None

class CMSUpdate(BaseModel):
    content_type: Optional[str] = None
    text_body: Optional[str] = None
    mood_category: Optional[str] = None
    scheduled_date: Optional[date] = None