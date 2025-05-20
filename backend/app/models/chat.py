from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Literal


class ChatMessage(BaseModel):
    datetime: datetime
    sender: str
    content: str
    type: Literal[
        "text", "image", "video", "sticker", "call", "call_canceled", "file", "album"
    ] = "text"
    extra: Optional[Dict] = {}
