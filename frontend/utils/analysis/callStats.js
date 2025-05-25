export function callSummary(messages) {
  const countBySender = {};
  const durationBySender = {};
  const cancelledBySender = {};

  const records = {
    success: [],
    cancelled: [],
  };

  const cancelPatterns = ["☎ 未接來電", "☎ 無人接聽", "☎ 您已取消通話"];

  for (const msg of messages) {
    const content = msg.content.trim();
    const sender = msg.sender;
    const date = new Date(msg.datetime);
    const timeStr = date.toTimeString().slice(0, 5);

    if (content.startsWith("☎ 通話時間")) {
      const match = content.match(/通話時間(\d+):(\d+)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const totalSec = minutes * 60 + seconds;

        countBySender[sender] = (countBySender[sender] || 0) + 1;
        durationBySender[sender] = (durationBySender[sender] || 0) + totalSec;
        records.success.push([timeStr, sender, totalSec]);
      }
    } else if (cancelPatterns.some((p) => content.includes(p))) {
      cancelledBySender[sender] = (cancelledBySender[sender] || 0) + 1;
      records.cancelled.push([timeStr, sender, content]);
    }
  }

  const totalCallDuration = Object.values(durationBySender).reduce(
    (sum, v) => sum + v,
    0
  );

  return {
    call_count_by_sender: countBySender,
    call_duration_by_sender: durationBySender,
    cancelled_call_by_sender: cancelledBySender,
    total_call_duration: totalCallDuration,
    call_records: records,
  };
}
