from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.database.session import get_db
from app.core.security import get_current_user
from app.core.response import universal_response

from app.models.habit import Habit, HabitLog
from app.models.focus import FocusSession
from app.models.gratitude import Gratitude
from app.models.cms import CMSContent
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/overview")
async def get_dashboard_overview(
    request: Request, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    today = date.today()
    user_id = str(current_user.id)

    habits = db.query(Habit).filter(Habit.user_id == user_id).all()
    daily_habits = []
    completed_count = 0
    
    for h in habits:
        is_done = db.query(HabitLog).filter(
            HabitLog.habit_id == h.id, 
            func.date(HabitLog.logged_at) == today
        ).first() is not None
        
        if is_done: completed_count += 1
        daily_habits.append({
            "id": str(h.id),
            "title": h.title,
            "is_done_today": is_done
        })

    completion_rate = (completed_count / len(habits) * 100) if habits else 0

    focus_stats = db.query(
        func.count(FocusSession.id).label("total_sessions"),
        func.sum(FocusSession.duration_minutes).label("total_minutes")
    ).filter(
        FocusSession.user_id == user_id,
        func.date(FocusSession.created_at) == today
    ).first()

    last_gratitude = db.query(Gratitude).filter(
        Gratitude.user_id == user_id
    ).order_by(Gratitude.created_at.desc()).first()

    daily_quote = db.query(CMSContent).filter(
        CMSContent.content_type == "quote"
    ).order_by(func.random()).first()

    dashboard_data = {
        "user_name": current_user.name,
        "avatar_status": current_user.avatar_status,
        "daily_habits": daily_habits,
        "habit_completion_rate": round(completion_rate, 2),
        "last_gratitude": last_gratitude.content if last_gratitude else "Belum ada catatan syukur hari ini.",
        "focus_stats": {
            "total_sessions": focus_stats.total_sessions or 0,
            "total_minutes": int(focus_stats.total_minutes or 0)
        },
        "daily_quote": daily_quote.text_body if daily_quote else "Tetap tenang dan fokus."
    }

    return universal_response(
        "Success", 
        "Data dashboard berhasil dikumpulkan", 
        str(request.url.path), 
        200, 
        dashboard_data
    )