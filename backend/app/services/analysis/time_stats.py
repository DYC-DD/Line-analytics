from typing import List, Dict
from collections import Counter
from app.models.chat import ChatMessage


def hourly_distribution(messages: List[ChatMessage]) -> Dict[int, int]:
    """
    回傳每個小時的訊息分布：
    {
        0: 在 0 點的訊息數,
        1: 在 1 點的訊息數,
        ...
        23: 在 23 點的訊息數
    }
    """

    counter = Counter()
    for msg in messages:
        counter[msg.datetime.hour] += 1
    return dict(counter)
