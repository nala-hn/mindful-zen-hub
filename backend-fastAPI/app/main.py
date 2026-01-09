from fastapi import FastAPI
from app.api import auth, users

app = FastAPI(title="Mindful Zen Hub API")

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "connect"}