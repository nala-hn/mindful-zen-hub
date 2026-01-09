from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FocusCreate(BaseModel):
    task_name: str
    duration_minutes: int = 25

class FocusResponse(BaseModel):
    id: str
    task_name: str
    duration_minutes: int
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
        
class FocusUpdate(BaseModel):
    session_type: Optional[str] = None
    is_completed: Optional[bool] = None
    duration_minutes: Optional[int] = None