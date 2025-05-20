from typing import List, Dict, Any
from app.models.chat import ChatMessage

from app.services.analysis.message_stats import message_count_by_sender
from app.services.analysis.daily_stats import message_count_by_day
from app.services.analysis.time_stats import hourly_distribution
from app.services.analysis.word_stats import most_common_words
from app.services.analysis.call_stats import call_summary
from app.services.analysis.type_stats import type_count_by_sender


def analyze_chat(messages: List[ChatMessage]) -> Dict[str, Any]:
    result = {}

    # 訊息總數統計
    result["message_stats"] = message_count_by_sender(messages)

    # 每日訊息數量統計
    result["daily_stats"] = {"message_count_by_day": message_count_by_day(messages)}

    # 傳送時間分布
    result["time_stats"] = {"hourly_distribution": hourly_distribution(messages)}

    # 詞頻統計
    result["word_stats"] = {"most_common_phrases": most_common_words(messages)}

    # 通話資訊
    result["call_stats"] = call_summary(messages)

    # 各類型統計
    result["type_stats"] = {"type_count_by_sender": type_count_by_sender(messages)}

    return result
