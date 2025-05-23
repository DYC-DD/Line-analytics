// import React, { useRef, useState } from "react";
// import { toPng } from "html-to-image";
// import download from "downloadjs";
// import MessageCountBar from "../components/charts/MessageCountBar";
// import DailyTrendLine from "../components/charts/DailyTrendLine";
// import HourlyHeatBar from "../components/charts/HourlyHeatBar";
// import TopPhrasesTreemap from "../components/charts/TopPhrasesBar";
// import CallStatsChart from "../components/charts/CallStatsChart";
// import MessageTypeStacked from "../components/charts/MessageTypeStacked";
// import "../styles/charts.css";

// export default function ChartPanel({ analysis, fileName }) {
//   const [forceDesktop, setForceDesktop] = useState(false);
//   const panelRef = useRef(null);

//   const handleDownload = async () => {
//     if (!panelRef.current) return;

//     setForceDesktop(true);
//     await new Promise((r) => setTimeout(r, 3000));

//     const node = panelRef.current;
//     const width = 1500 + 40 * 2;
//     const height = node.scrollHeight;

//     const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "analysis";
//     const outputName = `${baseName}分析.png`;

//     toPng(node, {
//       cacheBust: true,
//       backgroundColor: "#1e1e1e",
//       width,
//       height,
//       pixelRatio: 2,
//     })
//       .then((dataUrl) => download(dataUrl, outputName))
//       .catch((err) => console.error("圖片下載失敗：", err))
//       .finally(() => {
//         setForceDesktop(false);
//       });
//   };

//   if (!analysis) return null;

//   const panelStyle = forceDesktop
//     ? {
//         width: "1500px",
//         maxWidth: "none",
//         paddingLeft: "40px",
//         paddingRight: "40px",
//       }
//     : {};

//   return (
//     <div
//       className={`chart-panel-wrapper ${forceDesktop ? "desktop-mode" : ""}`}
//     >
//       <div className="download-button-container">
//         <button className="download-button" onClick={handleDownload}>
//           一鍵下載分析
//         </button>
//       </div>

//       <div className="chart-panel" ref={panelRef} style={panelStyle}>
//         {analysis.message_stats?.by_sender && (
//           <MessageCountBar
//             data={analysis.message_stats.by_sender}
//             forceDesktop={forceDesktop}
//           />
//         )}
//         {analysis.daily_stats?.message_count_by_day && (
//           <DailyTrendLine
//             data={analysis.daily_stats.message_count_by_day}
//             forceDesktop={forceDesktop}
//           />
//         )}
//         {analysis.time_stats?.hourly_distribution && (
//           <HourlyHeatBar
//             data={analysis.time_stats.hourly_distribution}
//             forceDesktop={forceDesktop}
//           />
//         )}
//         {analysis.word_stats?.most_common_phrases && (
//           <TopPhrasesTreemap
//             data={analysis.word_stats.most_common_phrases}
//             forceDesktop={forceDesktop}
//           />
//         )}
//         {analysis.call_stats?.call_duration_by_sender && (
//           <CallStatsChart
//             data={analysis.call_stats}
//             forceDesktop={forceDesktop}
//           />
//         )}
//         {analysis.type_stats?.type_count_by_sender && (
//           <MessageTypeStacked
//             data={analysis.type_stats.type_count_by_sender}
//             forceDesktop={forceDesktop}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import Loader from "../components/Loader";
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

  const handleDownload = async () => {
    if (!panelRef.current) return;

    setIsDownloading(true);

    // 1. 強制桌面版重渲染
    setForceDesktop(true);
    await new Promise((r) => setTimeout(r, 3000));

    // 2. 直接截原生節點
    const node = panelRef.current;
    const width = 1500 + 40 * 2;
    const height = node.scrollHeight;

    // 3. 暫時把寬度／padding 直接寫在 inline style
    node.style.width = "1500px";
    node.style.maxWidth = "none";
    node.style.paddingLeft = "40px";
    node.style.paddingRight = "40px";

    // 4. clone 出一份到畫面外
    const clone = node.cloneNode(true);
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "-9999px";
    wrapper.style.overflow = "visible";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // 5. 隱藏所有開啟的 Tooltip（Recharts + Nivo）
    const tips = clone.querySelectorAll(
      ".recharts-tooltip-wrapper, .nivo-tooltip, .tooltip"
    );
    tips.forEach((tip) => {
      tip.style.display = "none";
    });

    // 6. 再等一下，確保重渲染完畢
    await new Promise((r) => setTimeout(r, 500));

    // 7. 動態命名
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "analysis";
    const outputName = `${baseName}分析.png`;

    // 8. 呼叫 html-to-image
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
        // 9. 清理
        document.body.removeChild(wrapper);
        // 10. 還原原生節點的 inline style 及 forceDesktop
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
      {/* 若正在下載，覆蓋顯示半透層與 Loader */}
      {isDownloading && (
        <div className="download-loader-overlay">
          <Loader />
        </div>
      )}

      <div className="download-button-container">
        <button className="download-button" onClick={handleDownload}>
          一鍵下載分析
        </button>
      </div>

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
      </div>
    </div>
  );
}
