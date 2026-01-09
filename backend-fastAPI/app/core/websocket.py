from fastapi import WebSocket
from typing import Dict

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        """Menerima koneksi baru dan menyimpannya berdasarkan user_id."""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"WebSocket: User {user_id} connected.")

    def disconnect(self, user_id: str):
        """Menghapus koneksi saat user menutup browser atau logout."""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"WebSocket: User {user_id} disconnected.")

    async def send_personal_message(self, message: dict, user_id: str):
        """Mengirim data JSON hanya ke user tertentu (Private)."""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_json(message)

manager = ConnectionManager()