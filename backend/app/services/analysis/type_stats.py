from typing import List, Dict
from collections import defaultdict
from app.models.chat import ChatMessage


def type_count_by_sender(messages: List[ChatMessage]) -> Dict[str, Dict[str, int]]:
    """
    回傳每位傳送者以及總體的訊息類型統計：
    {
        "傳送者A": {
            "text": 文字訊息數,
            "image": 圖片數,
            ...
        },
        "總計": {
            "text": 總文字訊息數,
            "image": 總圖片數,
            ...
        }
    }
    """

    result = defaultdict(lambda: defaultdict(int))
    total = defaultdict(int)

    for msg in messages:
        result[msg.sender][msg.type] += 1
        total[msg.type] += 1

    result["總計"] = dict(total)
    return {sender: dict(types) for sender, types in result.items()}
