import { messageCountBySender } from "./analysis/messageStats";
import { messageCountByDay } from "./analysis/dailyStats";
import { hourlyDistribution } from "./analysis/timeStats";
import { mostCommonWords } from "./analysis/wordStats";
import { callSummary } from "./analysis/callStats";
import { typeCountBySender } from "./analysis/typeStats";

export function analyzeChat(messages) {
  return {
    message_stats: messageCountBySender(messages),
    daily_stats: {
      message_count_by_day: messageCountByDay(messages),
    },
    time_stats: {
      hourly_distribution: hourlyDistribution(messages),
    },
    word_stats: {
      most_common_phrases: mostCommonWords(messages),
    },
    call_stats: callSummary(messages),
    type_stats: {
      type_count_by_sender: typeCountBySender(messages),
    },
  };
}
