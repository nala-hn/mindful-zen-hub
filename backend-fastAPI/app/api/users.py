from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.core.response import universal_response
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/users", tags=["Users Management"])

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None

@router.get("/browse")
async def browse(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    data = [
        {
            "id": str(u.id), 
            "email": u.email, 
            "role": u.role, 
            "streak": u.current_streak,
            "avatar_status": u.avatar_status
        } for u in users
    ]
    return universal_response(
        result="Success",
        detail="Berhasil mengambil daftar user",
        path=str(request.url.path),
        code=200,
        data=data
    )

@router.get("/browse-detail/{id}")
async def browse_detail(id: str, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        return universal_response(
            result="Error",
            detail="User tidak ditemukan",
            path=str(request.url.path),
            code=404
        )
    
    data = {
        "id": str(user.id),
        "email": user.email,
        "role": user.role,
        "streak": user.current_streak,
        "avatar_status": user.avatar_status
    }
    return universal_response(
        result="Success",
        detail="Detail user ditemukan",
        path=str(request.url.path),
        code=200,
        data=data
    )

# --- Endpoint: Update ---
@router.put("/update/{id}")
async def update(id: str, user_in: UserUpdate, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        return universal_response("Error", "User tidak ditemukan", str(request.url.path), 404)
    
    if user_in.email: user.email = user_in.email
    if user_in.role: user.role = user_in.role
    
    db.commit()
    return universal_response("Success", "User berhasil diupdate", str(request.url.path), 200)

@router.delete("/delete/{id}")
async def delete(id: str, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        return universal_response("Error", "User tidak ditemukan", str(request.url.path), 404)
    
    db.delete(user)
    db.commit()
    return universal_response("Success", "User berhasil dihapus", str(request.url.path), 200)