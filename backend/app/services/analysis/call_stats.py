from typing import List, Dict
from collections import Counter
from app.models.chat import ChatMessage
import re


def seconds_to_ddhhmmss(total_seconds: int) -> str:
    days = total_seconds // 86400
    hours = (total_seconds % 86400) // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{days:02}:{hours:02}:{minutes:02}:{seconds:02}"


def call_summary(messages: List[ChatMessage]) -> Dict:
    """
    回傳通話統計資訊：
    {
        "call_count_by_sender": 每位傳送者的通話次數,
        "call_duration_by_sender": 每位傳送者總通話時間（格式：DD:HH:MM:SS）,
        "cancelled_call_by_sender": 每位傳送者取消通話次數,
        "total_call_duration": 所有通話總時長（格式：DD:HH:MM:SS）
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
        elif "☎ 您已取消通話" in content:
            cancelled_by_sender[sender] += 1

    formatted_durations = {
        sender: seconds_to_ddhhmmss(total_sec)
        for sender, total_sec in duration_by_sender.items()
    }

    total_call_seconds = sum(duration_by_sender.values())
    total_call_duration = seconds_to_ddhhmmss(total_call_seconds)

    return {
        "call_count_by_sender": dict(count_by_sender),
        "call_duration_by_sender": formatted_durations,
        "cancelled_call_by_sender": dict(cancelled_by_sender),
        "total_call_duration": total_call_duration,
    }
