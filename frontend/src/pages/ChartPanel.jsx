import React, { useRef } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import MessageCountBar from "../components/charts/MessageCountBar";
import DailyTrendLine from "../components/charts/DailyTrendLine";
import HourlyHeatBar from "../components/charts/HourlyHeatBar";
import TopPhrasesTreemap from "../components/charts/TopPhrasesBar";
import CallStatsChart from "../components/charts/CallStatsChart";
import MessageTypeStacked from "../components/charts/MessageTypeStacked";
import "../styles/charts.css";

export default function ChartPanel({ analysis, fileName }) {
  const panelRef = useRef(null);

  const handleDownload = async () => {
    if (!panelRef.current) return;

    const original = panelRef.current;
    const clone = original.cloneNode(true);
    clone.style.paddingLeft = "40px";
    clone.style.paddingRight = "40px";

    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "-9999px";
    wrapper.style.overflow = "visible";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    await new Promise((r) => setTimeout(r, 500));
    const width = clone.scrollWidth;
    const height = clone.scrollHeight;

    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const outputName = `${baseName}分析.png`;

    toPng(clone, {
      cacheBust: true,
      backgroundColor: "#1e1e1e",
      width,
      height,
      pixelRatio: 1,
    })
      .then((dataUrl) => {
        download(dataUrl, outputName);
      })
      .catch((err) => {
        console.error("圖片下載失敗：", err);
      })
      .finally(() => {
        document.body.removeChild(wrapper);
      });
  };

  if (!analysis) return null;

  return (
    <div className="chart-panel-wrapper">
      <div className="chart-panel" ref={panelRef}>
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

      <div className="download-button-container">
        <button className="download-button" onClick={handleDownload}>
          一鍵下載分析
        </button>
      </div>
    </div>
  );
}
