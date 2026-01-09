from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.database.session import get_db
from app.models.user import User
from app.models.habit import Habit, HabitLog
from app.models.gratitude import Gratitude
from app.models.focus import FocusSession
from app.core.security import get_current_user
from app.core.response import universal_response

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/overview")
async def get_dashboard_overview(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    user_info = {
        "name": current_user.name,
        "avatar_status": current_user.avatar_status,
        "current_streak": current_user.current_streak
    }

    habits = db.query(Habit).filter(Habit.user_id == str(current_user.id)).all()
    habit_list = []
    for h in habits:
        is_done = db.query(HabitLog).filter(
            HabitLog.habit_id == h.id,
            func.date(HabitLog.logged_at) == today,
            HabitLog.status == True
        ).first() is not None
        
        habit_list.append({
            "id": h.id,
            "title": h.title,
            "is_completed_today": is_done
        })

    last_gratitude = db.query(Gratitude).filter(
        Gratitude.user_id == str(current_user.id),
        func.date(Gratitude.created_at) == today
    ).order_by(Gratitude.created_at.desc()).first()

    focus_today = db.query(func.sum(FocusSession.duration_minutes)).filter(
        FocusSession.user_id == str(current_user.id),
        FocusSession.is_completed == True,
        func.date(FocusSession.created_at) == today
    ).scalar() or 0

    dashboard_data = {
        "user": user_info,
        "habits": habit_list,
        "today_gratitude": last_gratitude.content if last_gratitude else None,
        "total_focus_minutes": int(focus_today)
    }

    return universal_response(
        result="Success",
        detail="Data dashboard berhasil dimuat",
        path=str(request.url.path),
        code=200,
        data=dashboard_data
    )