from typing import List, Dict, Union
from collections import Counter
from app.models.chat import ChatMessage


def message_count_by_sender(
    messages: List[ChatMessage],
) -> Dict[str, Union[int, Dict[str, int]]]:
    """
    回傳訊息統計：
    {
        "total": 總訊息數量,
        "by_sender": {
            "傳送者A": 傳送數量,
            "傳送者B": 傳送數量
        }
    }
    """

    counter = Counter()
    for msg in messages:
        counter[msg.sender] += 1

    return {"total": sum(counter.values()), "by_sender": dict(counter)}
