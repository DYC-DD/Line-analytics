import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import Loader from "../components/Loader";
import { createPortal } from "react-dom";
import MessageCountBar from "../components/charts/MessageCountBar";
import DailyTrendLine from "../components/charts/DailyTrendLine";
import HourlyHeatBar from "../components/charts/HourlyHeatBar";
import TopPhrasesTreemap from "../components/charts/TopPhrasesBar";
import CallStatsChart from "../components/charts/CallStatsChart";
import MessageTypeStacked from "../components/charts/MessageTypeStacked";
import "../styles/charts.css";

export default function ChartPanel({ analysis, fileName }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [forceDesktop, setForceDesktop] = useState(false);
  const panelRef = useRef(null);

  // Detect mobile viewport
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDownload = async () => {
    if (!panelRef.current) return;

    setIsDownloading(true);
    setForceDesktop(true);
    await new Promise((r) => setTimeout(r, 3000));

    const node = panelRef.current;
    const width = 1500 + 40 * 2;
    const height = node.scrollHeight;

    node.style.width = "1500px";
    node.style.maxWidth = "none";
    node.style.paddingLeft = "40px";
    node.style.paddingRight = "40px";

    const clone = node.cloneNode(true);
    const btnInClone = clone.querySelector(".download-button-container");
    if (btnInClone) btnInClone.remove();

    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "-9999px";
    wrapper.style.overflow = "visible";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const tips = clone.querySelectorAll(
      ".recharts-tooltip-wrapper, .nivo-tooltip, .tooltip"
    );
    tips.forEach((tip) => (tip.style.display = "none"));

    await new Promise((r) => setTimeout(r, 500));

    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "analysis";
    const outputName = `${baseName}分析.png`;

    toPng(clone, {
      cacheBust: true,
      backgroundColor: "#1e1e1e",
      width,
      height,
      pixelRatio: 2,
    })
      .then((dataUrl) => download(dataUrl, outputName))
      .catch((err) => console.error("圖片下載失敗：", err))
      .finally(() => {
        document.body.removeChild(wrapper);
        node.style.width = "";
        node.style.maxWidth = "";
        node.style.paddingLeft = "";
        node.style.paddingRight = "";
        setForceDesktop(false);
        setIsDownloading(false);
      });
  };

  if (!analysis) return null;

  const panelStyle = forceDesktop
    ? {
        width: "1500px",
        maxWidth: "none",
        paddingLeft: "40px",
        paddingRight: "40px",
      }
    : {};

  return (
    <div
      className={`chart-panel-wrapper ${forceDesktop ? "desktop-mode" : ""}`}
    >
      {isDownloading &&
        createPortal(
          <div className="download-loader-overlay">
            <Loader />
          </div>,
          document.body
        )}

      <div className="chart-panel" ref={panelRef} style={panelStyle}>
        {analysis.message_stats?.by_sender && (
          <MessageCountBar
            data={analysis.message_stats.by_sender}
            forceDesktop={forceDesktop}
          />
        )}

        {analysis.daily_stats?.message_count_by_day && (
          <DailyTrendLine
            data={analysis.daily_stats.message_count_by_day}
            forceDesktop={forceDesktop}
          />
        )}

        {analysis.time_stats?.hourly_distribution && (
          <HourlyHeatBar
            data={analysis.time_stats.hourly_distribution}
            forceDesktop={forceDesktop}
          />
        )}

        {analysis.word_stats?.most_common_phrases && (
          <TopPhrasesTreemap
            data={analysis.word_stats.most_common_phrases}
            forceDesktop={forceDesktop}
          />
        )}

        {analysis.call_stats?.call_duration_by_sender && (
          <CallStatsChart
            data={analysis.call_stats}
            forceDesktop={forceDesktop}
          />
        )}

        {analysis.type_stats?.type_count_by_sender && (
          <MessageTypeStacked
            data={analysis.type_stats.type_count_by_sender}
            forceDesktop={forceDesktop}
          />
        )}

        {!isMobile && (
          <div className="download-button-container">
            <button className="download-button" onClick={handleDownload}>
              一鍵下載分析
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
