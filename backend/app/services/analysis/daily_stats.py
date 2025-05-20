from typing import List, Dict
from collections import Counter
from app.models.chat import ChatMessage


def message_count_by_day(messages: List[ChatMessage]) -> Dict[str, int]:
    """
    回傳每日訊息數量統計：
    {
        "2024-01-01": 當天訊息數量,
        "2024-01-02": 當天訊息數量,
        ...
    }
    """

    counter = Counter()
    for msg in messages:
        date_str = msg.datetime.date().isoformat()
        counter[date_str] += 1

    return dict(counter)
