from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.gratitude import Gratitude
from app.schemas.gratitude_schema import GratitudeCreate, GratitudeUpdate
from app.core.security import get_current_user
from app.core.response import universal_response
from app.core.websocket import manager

router = APIRouter(prefix="/gratitude", tags=["Gratitude"])

@router.post("/create")
async def create(
    data: GratitudeCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_gratitude = Gratitude(
        user_id=str(current_user.id),
        content=data.content
    )
    db.add(new_gratitude)
    db.commit()
    db.refresh(new_gratitude)

    await manager.send_personal_message(
        {"event": "NEW_GRATITUDE", "message": "Energi positif tersimpan!"},
        str(current_user.id)
    )

    return universal_response("Success", "Berhasil menyimpan syukur", str(request.url.path), 201, {"id": str(new_gratitude.id)})

@router.get("/browse")
async def browse(
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    results = db.query(Gratitude).filter(Gratitude.user_id == str(current_user.id)).order_by(Gratitude.created_at.desc()).all()
    
    data = [{"id": str(g.id), "content": g.content, "created_at": g.created_at} for g in results]
    
    return universal_response("Success", "Daftar syukur ditemukan", str(request.url.path), 200, data)

@router.put("/update/{id}")
async def update(
    id: str,
    data: GratitudeUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    item = db.query(Gratitude).filter(Gratitude.id == id, Gratitude.user_id == str(current_user.id)).first()
    
    if not item:
        return universal_response("Error", "Data tidak ditemukan atau bukan milik Anda", str(request.url.path), 404)

    item.content = data.content
    db.commit()
    
    return universal_response("Success", "Rasa syukur diperbarui", str(request.url.path), 200)

@router.delete("/delete/{id}")
async def delete(
    id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    item = db.query(Gratitude).filter(Gratitude.id == id, Gratitude.user_id == str(current_user.id)).first()
    
    if not item:
        return universal_response("Error", "Data tidak ditemukan", str(request.url.path), 404)

    db.delete(item)
    db.commit()
    
    return universal_response("Success", "Data berhasil dihapus", str(request.url.path), 200)