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
    排除貼圖/圖片/連結等無意義內容
    """

    counter = Counter()
    for msg in messages:
        content = msg.content.strip()
        if content in (
            "[貼圖]",
            "[照片]",
            "[影片]",
            "[檔案]",
            "[相簿]",
        ) or content.startswith("https://"):
            continue
        words = re.findall(r"\w+", content)
        unique_words = set(words)
        counter.update(unique_words)
    return counter.most_common(top_n)
