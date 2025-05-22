from typing import List, Dict
from collections import Counter
from app.models.chat import ChatMessage
import re


def call_summary(messages: List[ChatMessage]) -> Dict:
    """
    回傳通話統計資訊（時長以秒為單位）與紀錄清單：
    {
        "call_count_by_sender": 每位傳送者的通話次數,
        "call_duration_by_sender": 每位傳送者總通話時間（單位：秒）,
        "cancelled_call_by_sender": 每位傳送者取消通話次數,
        "total_call_duration": 所有通話總時長（單位：秒）,
        "call_records": {
            "success": [ [HH:MM, sender, 秒數], ... ],
            "cancelled": [ [HH:MM, sender, 原始訊息], ... ]
        }
    }
    """

    count_by_sender = Counter()
    duration_by_sender = Counter()
    cancelled_by_sender = Counter()

    records = {
        "success": [],
        "cancelled": [],
    }

    patterns = ["☎ 未接來電", "☎ 無人接聽", "☎ 您已取消通話"]

    for msg in messages:
        content = msg.content.strip()
        sender = msg.sender
        time_str = msg.datetime.strftime("%H:%M")

        if "☎ 通話時間" in content:
            count_by_sender[sender] += 1
            m = re.search(r"通話時間(\d+):(\d+)", content)
            if m:
                secs = int(m.group(1)) * 60 + int(m.group(2))
                duration_by_sender[sender] += secs
                records["success"].append([time_str, sender, secs])

        elif any(p in content for p in patterns):
            cancelled_by_sender[sender] += 1
            records["cancelled"].append([time_str, sender, content])

    total_call_seconds = sum(duration_by_sender.values())

    return {
        "call_count_by_sender": dict(count_by_sender),
        "call_duration_by_sender": dict(duration_by_sender),
        "cancelled_call_by_sender": dict(cancelled_by_sender),
        "total_call_duration": total_call_seconds,
        "call_records": records,
    }
