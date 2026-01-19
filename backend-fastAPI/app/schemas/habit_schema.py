from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HabitBase(BaseModel):
    title: str
    is_from_library: Optional[bool] = False

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    title: Optional[str] = None
    is_from_library: Optional[bool] = None

class Habit(HabitBase):
    id: str
    user_id: str
    complete: bool
    created_at: datetime
    current_streak: int

    class Config:
        from_attributes = True