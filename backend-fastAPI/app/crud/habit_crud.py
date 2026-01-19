from sqlalchemy.orm import Session
from app.models.habit import Habit
from app.schemas.habit_schema import HabitCreate, HabitUpdate
from uuid import UUID
from datetime import date
from sqlalchemy import func

def create_habit(db: Session, habit: HabitCreate, user_id: UUID):
    db_habit = Habit(
        **habit.model_dump(),
        user_id=user_id,
        complete=False
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

def get_habits_by_user(db: Session, user_id: UUID, filter_date: date = None):
    query = db.query(Habit).filter(Habit.user_id == user_id)
    if filter_date:
        query = query.filter(func.date(Habit.created_at) == filter_date)
    return query.all()

def get_habit(db: Session, habit_id: UUID, user_id: UUID):
    return db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()

def update_habit(db: Session, habit_id: UUID, habit: HabitUpdate, user_id: UUID):
    db_habit = get_habit(db, habit_id, user_id)
    if db_habit:
        update_data = habit.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_habit, key, value)
        db.commit()
        db.refresh(db_habit)
    return db_habit

def delete_habit(db: Session, habit_id: UUID, user_id: UUID):
    db_habit = get_habit(db, habit_id, user_id)
    if db_habit:
        db.delete(db_habit)
        db.commit()
    return db_habit
