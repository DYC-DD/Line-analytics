from typing import List, Tuple
from collections import Counter
from app.models.chat import ChatMessage
import re


def most_common_words(
    messages: List[ChatMessage], top_n: int = 10
) -> List[Tuple[str, int]]:
    """
    回傳最常出現的前 N 個詞語：
    [
        ("你好", 次數),
        ("明天", 次數),
        ...
    ]
    排除貼圖/圖片/連結/通話相關等無意義內容
    """
    counter = Counter()
    call_related_keywords = [
        "通話時間",
        "您已取消通話",
        "無人接聽",
        "未接來電",
    ]

    for msg in messages:
        content = msg.content.strip()
        if content in (
            "[貼圖]",
            "[照片]",
            "[影片]",
            "[檔案]",
            "[相簿] (null)",
        ) or content.startswith("https://"):
            continue

        if any(keyword in content for keyword in call_related_keywords):
            continue

        words = re.findall(r"\w+", content)
        unique_words = set(words)
        counter.update(unique_words)

    return counter.most_common(top_n)
