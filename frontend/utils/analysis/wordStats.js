export function mostCommonWords(messages, topN = 10) {
  const counter = new Map();
  const callRelated = ["通話時間", "您已取消通話", "無人接聽", "未接來電"];

  for (const msg of messages) {
    const content = msg.content.trim();

    if (
      ["[貼圖]", "[照片]", "[影片]", "[檔案]", "[相簿] (null)"].includes(
        content
      ) ||
      content.startsWith("https://") ||
      callRelated.some((kw) => content.includes(kw))
    ) {
      continue;
    }

    const words = content.match(/[\p{L}\p{N}]{1,}/gu);
    if (!words) continue;

    const uniqueWords = new Set(words);
    for (const word of uniqueWords) {
      counter.set(word, (counter.get(word) || 0) + 1);
    }
  }

  const sorted = Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return sorted;
}
