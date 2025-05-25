import { parseLineChat } from "../../utils/parser";
import { analyzeChat } from "../../utils/analyzer";

export async function uploadChatFile(file) {
  if (!file.name.endsWith(".txt")) {
    throw new Error("請選擇 .txt 聊天記錄檔案");
  }

  const text = await file.text();
  const parsedMessages = parseLineChat(text);
  const analysis = analyzeChat(parsedMessages);

  return { analysis };
}
