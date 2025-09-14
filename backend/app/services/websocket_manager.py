"""
WebSocket connection manager for real-time communication
"""

from fastapi import WebSocket
from typing import List, Dict
import json


class WebSocketManager:
    """Manages WebSocket connections for real-time transcription"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.session_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, session_id: str = None):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        
        if session_id:
            if session_id not in self.session_connections:
                self.session_connections[session_id] = []
            self.session_connections[session_id].append(websocket)
        
        print(f"✅ WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket, session_id: str = None):
        """Remove WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        if session_id and session_id in self.session_connections:
            if websocket in self.session_connections[session_id]:
                self.session_connections[session_id].remove(websocket)
            
            # Clean up empty session
            if not self.session_connections[session_id]:
                del self.session_connections[session_id]
        
        print(f"❌ WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to specific WebSocket connection"""
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error sending message to WebSocket: {e}")
            self.disconnect(websocket)
    
    async def send_to_session(self, message: str, session_id: str):
        """Send message to all connections in a session"""
        if session_id in self.session_connections:
            disconnected = []
            for websocket in self.session_connections[session_id]:
                try:
                    await websocket.send_text(message)
                except Exception as e:
                    print(f"Error sending to session {session_id}: {e}")
                    disconnected.append(websocket)
            
            # Clean up disconnected websockets
            for ws in disconnected:
                self.disconnect(ws, session_id)
    
    async def broadcast(self, message: str):
        """Broadcast message to all active connections"""
        disconnected = []
        for websocket in self.active_connections:
            try:
                await websocket.send_text(message)
            except Exception as e:
                print(f"Error broadcasting message: {e}")
                disconnected.append(websocket)
        
        # Clean up disconnected websockets
        for ws in disconnected:
            self.disconnect(ws)
    
    def get_connection_count(self) -> int:
        """Get total number of active connections"""
        return len(self.active_connections)
    
    def get_session_count(self) -> int:
        """Get number of active sessions"""
        return len(self.session_connections)
