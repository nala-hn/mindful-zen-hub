from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.habit import Habit, HabitLog
from app.models.user import User
from app.schemas.habit_schema import HabitCreate, HabitUpdate
from app.crud import habit_crud
from app.core.security import get_current_user
from app.core.response import universal_response
from app.core.evolution import check_avatar_evolution
from app.core.websocket import manager
from uuid import UUID
from datetime import date
from typing import Optional

router = APIRouter(prefix="/habits", tags=["Habits"])

@router.post("/create")
async def create_habit_endpoint(data: HabitCreate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_habit = habit_crud.create_habit(db=db, habit=data, user_id=current_user.id)
    return universal_response("Success", "Habit berhasil dibuat", str(request.url.path), 201, new_habit)

@router.get("/browse")
async def browse_habits_endpoint(request: Request, filter_date: Optional[date] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habits = habit_crud.get_habits_by_user(db=db, user_id=current_user.id, filter_date=filter_date)
    return universal_response("Success", "Daftar habit ditemukan", str(request.url.path), 200, habits)

@router.post("/log/{habit_id}")
async def log_habit(habit_id: str, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_log = HabitLog(habit_id=habit_id, status=True)
    db.add(new_log)
    
    total_done = db.query(HabitLog).join(Habit).filter(Habit.user_id == str(current_user.id), HabitLog.status == True).count()
    new_status = check_avatar_evolution(total_done)
    
    if current_user.avatar_status != new_status:
        current_user.avatar_status = new_status
        db.commit()
        await manager.send_personal_message(
            {"event": "AVATAR_EVOLVED", "new_status": new_status, "message": f"Wohoo! Evolusi menjadi {new_status}!"},
            str(current_user.id)
        )

    db.commit()
    db.refresh(new_log)

    return universal_response("Success", "Progress dicatat", str(request.url.path), 200, {
        "log": new_log,
        "total_done": total_done,
        "current_avatar": new_status
    })

@router.put("/update/{habit_id}")
async def update_habit_endpoint(habit_id: UUID, data: HabitUpdate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_habit = habit_crud.update_habit(db=db, habit_id=habit_id, habit=data, user_id=current_user.id)
    if not updated_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return universal_response("Success", "Habit berhasil diperbarui", str(request.url.path), 200, updated_habit)

@router.delete("/delete/{habit_id}")
async def delete_habit_endpoint(habit_id: UUID, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted_habit = habit_crud.delete_habit(db=db, habit_id=habit_id, user_id=current_user.id)
    if not deleted_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    temp_data = {"id": str(deleted_habit.id), "title": deleted_habit.title}
    return universal_response("Success", "Habit berhasil dihapus", str(request.url.path), 200, temp_data)