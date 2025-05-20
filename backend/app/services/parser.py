import re
from datetime import datetime
from typing import List
from app.models.chat import ChatMessage


def parse_line_chat(text: str) -> List[ChatMessage]:
    result = []
    current_date = None
    date_pattern = re.compile(r"^(\d{4}/\d{2}/\d{2})")
    message_pattern = re.compile(r"^(\d{2}:\d{2})\t(.+?)\t(.+)$")

    for line in text.splitlines():
        line = line.strip()

        # 日期判斷
        if date_match := date_pattern.match(line):
            current_date = date_match.group(1)
            continue

        # 訊息判斷
        if message_match := message_pattern.match(line):
            if current_date:
                time, sender, content = message_match.groups()
                dt_str = f"{current_date} {time}"

                try:
                    dt_obj = datetime.strptime(dt_str, "%Y/%m/%d %H:%M")
                except ValueError:
                    continue

                # 預設類型與附加資訊
                msg_type = "text"
                extra_data = {}

                # 類型判斷
                if content == "[貼圖]":
                    msg_type = "sticker"
                elif content == "[照片]":
                    msg_type = "image"
                elif content == "[影片]":
                    msg_type = "video"
                elif content == "[檔案]":
                    msg_type = "file"
                elif content == "[相簿]":
                    msg_type = "album"
                elif content.startswith("☎ 通話時間"):
                    msg_type = "call"
                    match = re.search(r"通話時間(\d+):(\d+)", content)
                    if match:
                        minutes = int(match.group(1))
                        seconds = int(match.group(2))
                        duration = minutes * 60 + seconds
                        extra_data = {"duration": duration}
                elif content == "☎ 您已取消通話":
                    msg_type = "call_canceled"

                # 建立訊息物件
                result.append(
                    ChatMessage(
                        datetime=dt_obj,
                        sender=sender,
                        content=content,
                        type=msg_type,
                        extra=extra_data,
                    )
                )

    return result
