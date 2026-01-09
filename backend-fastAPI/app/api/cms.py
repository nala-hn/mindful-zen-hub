from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.cms import CMSContent
from app.schemas.cms_schema import CMSCreate, CMSUpdate
from app.core.security import get_admin_user
from app.core.response import universal_response

router = APIRouter(prefix="/cms", tags=["CMS Admin"])

@router.get("/browse")
async def browse(request: Request, db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    contents = db.query(CMSContent).all()
    return universal_response("Success", "Konten CMS berhasil dimuat", str(request.url.path), 200, contents)

@router.post("/create")
async def create(data: CMSCreate, request: Request, db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    new_content = CMSContent(
        content_type=data.content_type,
        text_body=data.text_body,
        mood_category=data.mood_category,
        scheduled_date=data.scheduled_date
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return universal_response("Success", "Konten berhasil dibuat", str(request.url.path), 201, new_content)

@router.put("/update/{id}")
async def update(id: str, data: CMSUpdate, request: Request, db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    content = db.query(CMSContent).filter(CMSContent.id == id).first()
    if not content:
        return universal_response("Error", "Konten tidak ditemukan", str(request.url.path), 404)

    if data.content_type is not None: content.content_type = data.content_type
    if data.text_body is not None: content.text_body = data.text_body
    if data.mood_category is not None: content.mood_category = data.mood_category
    if data.scheduled_date is not None: content.scheduled_date = data.scheduled_date

    db.commit()
    db.refresh(content)
    return universal_response("Success", "Konten berhasil diperbarui", str(request.url.path), 200, content)

@router.delete("/delete/{id}")
async def delete(id: str, request: Request, db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    content = db.query(CMSContent).filter(CMSContent.id == id).first()
    if not content:
        return universal_response("Error", "Konten tidak ditemukan", str(request.url.path), 404)

    db.delete(content)
    db.commit()
    return universal_response("Success", "Konten berhasil dihapus", str(request.url.path), 200)