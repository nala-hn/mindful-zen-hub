from fastapi import FastAPI
from app.api import auth, users, websocket, habits, gratitude, focus, dashboard, cms
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mindful Zen Hub API")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(websocket.router)
app.include_router(habits.router)
app.include_router(gratitude.router)
app.include_router(focus.router)
app.include_router(dashboard.router)
app.include_router(cms.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "connect"}