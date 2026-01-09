from app.database.session import engine, Base
from app.models.user import User
from app.models.habit import Habit, HabitLog
from app.models.gratitude import Gratitude
from app.models.focus import FocusSession
from app.models.cms import CMSContent

def create_tables():
    print("Sedang menyambungkan ke database...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Berhasil! Semua tabel telah dibuat di PostgreSQL.")
    except Exception as e:
        print(f"❌ Terjadi kesalahan: {e}")

if __name__ == "__main__":
    create_tables()