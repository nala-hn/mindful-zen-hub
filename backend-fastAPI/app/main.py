from fastapi import FastAPI
from app.api import auth, users, websocket, habits, gratitude

app = FastAPI(title="Mindful Zen Hub API")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(websocket.router)
app.include_router(habits.router)
app.include_router(gratitude.router)

@app.get("/")
def root():
    return {"message": "connect"}