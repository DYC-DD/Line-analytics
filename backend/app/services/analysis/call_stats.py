from typing import List, Dict
from collections import Counter
from app.models.chat import ChatMessage
import re


def call_summary(messages: List[ChatMessage]) -> Dict:
    """
    回傳通話統計資訊（時長以秒為單位）：
    {
        "call_count_by_sender": 每位傳送者的通話次數,
        "call_duration_by_sender": 每位傳送者總通話時間（單位：秒）,
        "cancelled_call_by_sender": 每位傳送者取消通話次數,
        "total_call_duration": 所有通話總時長（單位：秒）
    }
    """

    count_by_sender = Counter()
    duration_by_sender = Counter()
    cancelled_by_sender = Counter()

    for msg in messages:
        content = msg.content.strip()
        sender = msg.sender

        if "☎ 通話時間" in content:
            count_by_sender[sender] += 1
            match = re.search(r"通話時間(\d+):(\d+)", content)
            if match:
                minutes = int(match.group(1))
                seconds = int(match.group(2))
                total_seconds = minutes * 60 + seconds
                duration_by_sender[sender] += total_seconds

        elif any(keyword in content for keyword in ["☎ 您已取消通話", "☎ 無人接聽"]):
            cancelled_by_sender[sender] += 1

    total_call_seconds = sum(duration_by_sender.values())

    return {
        "call_count_by_sender": dict(count_by_sender),
        "call_duration_by_sender": dict(duration_by_sender),
        "cancelled_call_by_sender": dict(cancelled_by_sender),
        "total_call_duration": total_call_seconds,
    }
