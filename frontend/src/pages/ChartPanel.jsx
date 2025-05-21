import React from "react";
import MessageCountBar from "../components/charts/MessageCountBar";
import DailyTrendLine from "../components/charts/DailyTrendLine";
import HourlyHeatBar from "../components/charts/HourlyHeatBar";
import TopPhrasesTreemap from "../components/charts/TopPhrasesBar";
import CallStatsChart from "../components/charts/CallStatsChart";
import MessageTypeStacked from "../components/charts/MessageTypeStacked";

export default function ChartPanel({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="chart-panel">
      {analysis.message_stats?.by_sender && (
        <MessageCountBar data={analysis.message_stats.by_sender} />
      )}

      {analysis.daily_stats?.message_count_by_day && (
        <DailyTrendLine data={analysis.daily_stats.message_count_by_day} />
      )}

      {analysis.time_stats?.hourly_distribution && (
        <HourlyHeatBar data={analysis.time_stats.hourly_distribution} />
      )}

      {analysis.word_stats?.most_common_phrases && (
        <TopPhrasesTreemap data={analysis.word_stats.most_common_phrases} />
      )}

      {analysis.call_stats?.call_duration_by_sender && (
        <CallStatsChart data={analysis.call_stats} />
      )}

      {analysis.type_stats?.type_count_by_sender && (
        <MessageTypeStacked data={analysis.type_stats.type_count_by_sender} />
      )}
    </div>
  );
}
