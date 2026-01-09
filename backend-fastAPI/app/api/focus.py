import asyncio
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.focus import FocusSession
from app.schemas.focus_schema import FocusCreate, FocusUpdate
from app.core.security import get_current_user
from app.core.response import universal_response
from app.core.websocket import manager

router = APIRouter(prefix="/focus", tags=["Focus Tracker"])

@router.get("/browse")
async def browse(request: Request, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    results = db.query(FocusSession).filter(FocusSession.user_id == str(current_user.id)).all()
    
    return universal_response(
        result="Success",
        detail="Riwayat fokus berhasil diambil",
        path=str(request.url.path),
        code=200,
        data=results
    )

@router.get("/browse-detail/{id}")
async def browse_detail(id: str, request: Request, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    session = db.query(FocusSession).filter(FocusSession.id == id, FocusSession.user_id == str(current_user.id)).first()
    
    if not session:
        return universal_response("Error", "Sesi tidak ditemukan", str(request.url.path), 404)
        
    return universal_response("Success", "Detail sesi ditemukan", str(request.url.path), 200, session)

@router.post("/create")
async def create(data: FocusCreate, request: Request, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    new_session = FocusSession(
        user_id=str(current_user.id),
        task_name=data.task_name,
        duration_minutes=data.duration_minutes,
        is_completed=False
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    async def run_timer(user_id, duration_sec, session_id):
        left = duration_sec
        while left > 0:
            await asyncio.sleep(1)
            left -= 1
            await manager.send_personal_message({"event": "FOCUS_TICK", "seconds_left": left}, user_id)
        
        with next(get_db()) as db_conn:
            db_conn.query(FocusSession).filter(FocusSession.id == session_id).update({"is_completed": True})
            db_conn.commit()
        await manager.send_personal_message({"event": "FOCUS_DONE", "message": "Selesai!"}, user_id)

    asyncio.create_task(run_timer(str(current_user.id), data.duration_minutes * 60, str(new_session.id)))

    return universal_response("Success", "Sesi fokus dimulai", str(request.url.path), 201, {"id": new_session.id})

@router.put("/update/{id}")
async def update(id: str, data: FocusUpdate, request: Request, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    session = db.query(FocusSession).filter(FocusSession.id == id, FocusSession.user_id == str(current_user.id)).first()
    if not session:
        return universal_response("Error", "Data tidak ditemukan", str(request.url.path), 404)

    if data.task_name: session.task_name = data.task_name
    if data.is_completed is not None: session.is_completed = data.is_completed
    
    db.commit()
    return universal_response("Success", "Sesi diperbarui", str(request.url.path), 200)

@router.delete("/delete/{id}")
async def delete(id: str, request: Request, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    session = db.query(FocusSession).filter(FocusSession.id == id, FocusSession.user_id == str(current_user.id)).first()
    if not session:
        return universal_response("Error", "Data tidak ditemukan", str(request.url.path), 404)

    db.delete(session)
    db.commit()
    return universal_response("Success", "Sesi dihapus", str(request.url.path), 200)