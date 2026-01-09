from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserResponse(BaseModel):
    id: UUID
    email: str
    name: Optional[str]
    role: str
    
    class Config:
        from_attributes = True