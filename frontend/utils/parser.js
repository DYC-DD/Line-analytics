export function parseLineChat(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  let currentDate = null;

  const datePattern = /^(\d{4}\/\d{1,2}\/\d{1,2})（[一二三四五六日]）$/;
  const messagePattern = /^(\d{2}:\d{2})\t(.+?)\t(.+)$/;

  for (const line of lines) {
    const trimmed = line.trim();

    const dateMatch = trimmed.match(datePattern);
    if (dateMatch) {
      currentDate = dateMatch[1];
      continue;
    }

    const msgMatch = trimmed.match(messagePattern);
    if (msgMatch && currentDate) {
      const [_, time, sender, content] = msgMatch;
      const datetimeStr = `${currentDate} ${time}`;
      const datetime = new Date(datetimeStr.replace(/\//g, "-"));

      let type = "text";
      let extra = {};

      switch (content) {
        case "[貼圖]":
          type = "sticker";
          break;
        case "[照片]":
          type = "image";
          break;
        case "[影片]":
          type = "video";
          break;
        case "[檔案]":
          type = "file";
          break;
        case "[相簿]":
          type = "album";
          break;
        case "☎ 您已取消通話":
          type = "call_canceled";
          break;
        default:
          if (content.startsWith("☎ 通話時間")) {
            const m = content.match(/通話時間(\d+):(\d+)/);
            if (m) {
              type = "call";
              const minutes = parseInt(m[1], 10);
              const seconds = parseInt(m[2], 10);
              extra = { duration: minutes * 60 + seconds };
            }
          }
          break;
      }

      result.push({ datetime, sender, content, type, extra });
    }
  }

  return result;
}
