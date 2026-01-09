from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.habit import Habit, HabitLog
from app.models.user import User
from app.schemas.habit_schema import HabitCreate, HabitUpdate
from app.core.security import get_current_user
from app.core.response import universal_response
from app.core.evolution import check_avatar_evolution
from app.core.websocket import manager

router = APIRouter(prefix="/habits", tags=["Habits"])

@router.post("/create")
async def create_habit(data: HabitCreate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_habit = Habit(
        user_id=str(current_user.id),
        title=data.title,
        is_from_library=data.is_from_library
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return universal_response("Success", "Habit berhasil dibuat", str(request.url.path), 201, new_habit)

@router.get("/browse")
async def browse_habits(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habits = db.query(Habit).filter(Habit.user_id == str(current_user.id)).all()
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
async def update_habit(habit_id: str, data: HabitUpdate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == str(current_user.id)).first()
    
    if not habit:
        return universal_response("Error", "Habit tidak ditemukan", str(request.url.path), 404)

    if data.title is not None: habit.title = data.title
    if data.is_from_library is not None: habit.is_from_library = data.is_from_library

    db.commit()
    db.refresh(habit)
    
    return universal_response("Success", "Habit berhasil diperbarui", str(request.url.path), 200, habit)

@router.delete("/delete/{habit_id}")
async def delete_habit(habit_id: str, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == str(current_user.id)).first()
    
    if not habit:
        return universal_response("Error", "Habit tidak ditemukan", str(request.url.path), 404)

    temp_data = {"id": str(habit.id), "title": habit.title}
    
    db.delete(habit)
    db.commit()
    
    return universal_response("Success", "Habit berhasil dihapus", str(request.url.path), 200, temp_data)