from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from .habit_schema import HabitCreate

class HabitSummary(BaseModel):
    id: str
    title: str
    is_done_today: bool

class FocusSummary(BaseModel):
    total_sessions: int
    total_minutes: int

class DashboardData(BaseModel):
    user_nickname: str
    avatar_status: str
    
    daily_habits: List[HabitSummary]
    habit_completion_rate: float
    
    last_gratitude: Optional[str] = None
    
    focus_stats: FocusSummary
    
    daily_quote: Optional[str] = "Tetap tenang dan fokus."

class DashboardResponse(BaseModel):
    result: str
    detail: str
    data: DashboardData