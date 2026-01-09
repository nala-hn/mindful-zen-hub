from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.core.response import universal_response
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.security import get_current_user, get_admin_user

router = APIRouter(prefix="/users", tags=["Users Management"])

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[str] = None

@router.get("/browse")
async def browse(
    request: Request, 
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    users = db.query(User).all()
    data = [
        {
            "id": str(u.id), 
            "email": u.email, 
            "name": u.name,
            "role": u.role, 
            "streak": u.current_streak,
            "avatar_status": u.avatar_status
        } for u in users
    ]
    return universal_response(
        result="Success",
        detail="Berhasil mengambil daftar user (Admin Access)",
        path=str(request.url.path),
        code=200,
        data=data
    )

@router.get("/browse-detail/{id}")
async def browse_detail(
    id: str, 
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and str(current_user.id) != id:
        return universal_response(
            result="Error", detail="Bukan otoritas Anda", path=str(request.url.path), code=403
        )
    
    user = db.query(User).filter(User.id == id).first()
    if not user:
        return universal_response(
            result="Error", detail="User tidak ditemukan", path=str(request.url.path), code=404
        )
    
    return universal_response(
        result="Success",
        detail="Detail user ditemukan",
        path=str(request.url.path),
        code=200,
        data={
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "streak": user.current_streak,
            "avatar_status": user.avatar_status
        }
    )

@router.put("/update/{id}")
async def update(
    id: str, 
    user_in: UserUpdate, 
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and str(current_user.id) != id:
        return universal_response(
            result="Error", detail="Akses ditolak", path=str(request.url.path), code=403
        )

    user = db.query(User).filter(User.id == id).first()
    if not user:
        return universal_response(
            result="Error", detail="User tidak ditemukan", path=str(request.url.path), code=404
        )
    
    if user_in.email: user.email = user_in.email
    if user_in.role and current_user.role == "admin": 
        user.role = user_in.role
    
    db.commit()
    return universal_response(
        result="Success", detail="User berhasil diupdate", path=str(request.url.path), code=200
    )

@router.delete("/delete/{id}")
async def delete(
    id: str, 
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and str(current_user.id) != id:
        return universal_response(
            result="Error", detail="Akses ditolak", path=str(request.url.path), code=403
        )

    user = db.query(User).filter(User.id == id).first()
    if not user:
        return universal_response(
            result="Error", detail="User tidak ditemukan", path=str(request.url.path), code=404
        )
    
    db.delete(user)
    db.commit()
    return universal_response(
        result="Success", detail="User berhasil dihapus", path=str(request.url.path), code=200
    )