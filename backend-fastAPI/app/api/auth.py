from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud import user_crud
from app.schemas.user_schema import UserCreate
from app.core.response import universal_response
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(request: Request, user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = user_crud.get_user_by_email(db, email=user_in.email)
    if existing_user:
        return universal_response(
            result="Error",
            detail="Email sudah terdaftar",
            path=str(request.url.path),
            code=409
        )
    
    new_user = user_crud.create_user(db, user_in)
    
    return universal_response(
        result="Success",
        detail="Registrasi berhasil",
        path=str(request.url.path),
        code=201,
        data={"email": new_user.email, "role": new_user.role}
    )

@router.post("/login")
async def login(request: Request, login_data: LoginRequest, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_email(db, email=login_data.email)
    
    if not user or not user_crud.pwd_context.verify(login_data.password, user.password_hash):
        return universal_response(
            result="Error",
            detail="Email atau password salah",
            path=str(request.url.path),
            code=401
        )
    return universal_response(
        result="Success",
        detail="Login berhasil",
        path=str(request.url.path),
        code=200,
        data={
            "access_token": "INI_TOKEN_DUMMY_NANTI_KITA_BUAT_LOGICNYA",
            "token_type": "bearer",
            "user": {"email": user.email, "role": user.role}
        }
    )