from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class GratitudeCreate(BaseModel):
    content: str

class GratitudeUpdate(BaseModel):
    content: str

class GratitudeResponse(BaseModel):
    id: UUID
    content: str
    created_at: datetime

    class Config:
        from_attributes = True