from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HabitCreate(BaseModel):
    title: str
    is_from_library: Optional[bool] = False

class HabitResponse(BaseModel):
    id: str
    title: str
    is_from_library: bool
    created_at: datetime

    class Config:
        from_attributes = True
        
class HabitUpdate(BaseModel):
    title: Optional[str] = None
    is_from_library: Optional[bool] = None