from typing import List, Dict
from collections import defaultdict
from app.models.chat import ChatMessage


def type_count_by_sender(messages: List[ChatMessage]) -> Dict[str, Dict[str, int]]:
    """
    回傳每位傳送者的訊息類型統計：
    {
        "傳送者A": {
            "text": 文字訊息數,
            "image": 圖片數,
            "video": 影片數,
            ...
        },
        ...
    }
    """

    result = defaultdict(lambda: defaultdict(int))

    for msg in messages:
        result[msg.sender][msg.type] += 1

    return {sender: dict(types) for sender, types in result.items()}
