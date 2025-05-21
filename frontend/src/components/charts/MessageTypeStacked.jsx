import React from "react";
import { ResponsivePie } from "@nivo/pie";
import "../../styles/charts.css";

export default function MessageTypeStacked({ data }) {
  if (!data || typeof data !== "object") return null;

  const labelMap = {
    text: "訊息",
    image: "圖片",
    sticker: "貼圖",
    video: "影片",
    file: "檔案",
    call: "通話",
  };

  const typeColors = {
    text: "#42a5f5",
    image: "#ab47bc",
    sticker: "#26c6da",
    video: "#ffa726",
    file: "#8d6e63",
    call: "#66bb6a",
    other: "#999",
  };

  const convertToPieData = (userTypeCount) => {
    const entries = Object.entries(userTypeCount).filter(
      ([type]) => type !== "call_canceled"
    );
    const total = entries.reduce((sum, [, value]) => sum + value, 0);

    const grouped = [];
    const othersDetails = [];
    let othersTotal = 0;

    entries.forEach(([type, value]) => {
      const pct = value / total;
      const label = labelMap[type] || type;
      if (pct < 0.01) {
        othersTotal += value;
        othersDetails.push({ type, label, value, percentage: pct });
      } else {
        grouped.push({
          id: type,
          label,
          value,
          color: typeColors[type] || "#90a4ae",
          percentage: pct,
        });
      }
    });

    if (othersDetails.length === 1) {
      // ✅ 只有一筆 → 直接還原，不合併為「其他」
      const item = othersDetails[0];
      grouped.push({
        id: item.type,
        label: item.label,
        value: item.value,
        color: typeColors[item.type] || "#90a4ae",
        percentage: item.percentage,
      });
    } else if (othersDetails.length > 1) {
      grouped.push({
        id: "other",
        label: "其他",
        value: othersTotal,
        color: typeColors.other,
        percentage: othersTotal / total,
        othersDetails,
      });
    }

    return grouped;
  };

  return (
    <div className="chart-card professional">
      <h3 className="chart-title">🧾 各類型訊息分布</h3>
      <div>
        {Object.entries(data).map(([sender, typeCounts]) => (
          <div key={sender}>
            <h4 className="pie-title">{sender}</h4>
            <div style={{ height: 500 }}>
              <ResponsivePie
                data={convertToPieData(typeCounts)}
                margin={{ top: 30, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.4}
                padAngle={0}
                cornerRadius={0}
                colors={({ data }) => data.color}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                enableArcLinkLabels={true}
                arcLinkLabel={(d) => {
                  const { label, percentage, othersDetails } = d.data;
                  if (
                    d.id === "other" &&
                    Array.isArray(othersDetails) &&
                    othersDetails.length === 1
                  ) {
                    const item = othersDetails[0];
                    return `${item.label}：${(item.percentage * 100).toFixed(
                      1
                    )}%`;
                  }
                  return `${label}：${(percentage * 100).toFixed(1)}%`;
                }}
                arcLabelsSkipAngle={360}
                arcLinkLabelsSkipAngle={0}
                arcLinkLabelsDiagonalLength={20}
                arcLinkLabelsStraightLength={60}
                arcLinkLabelsTextOffset={10}
                enableArcLabels={false}
                animate={true}
                motionConfig="wobbly"
                activeOuterRadiusOffset={8}
                sortByValue={true}
                startAngle={300}
                endAngle={-60}
                tooltip={({ datum }) => {
                  const { label, value, percentage, othersDetails } =
                    datum.data;
                  const isOther = datum.id === "other";

                  const defaultStyle = {
                    background: "#fff",
                    color: "#000",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  };

                  const otherStyle = {
                    background: "#fff",
                    color: "#000",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    maxWidth: "220px",
                  };

                  if (
                    isOther &&
                    Array.isArray(othersDetails) &&
                    othersDetails.length === 1
                  ) {
                    const item = othersDetails[0];
                    return (
                      <div style={defaultStyle}>
                        {item.label}：{item.value.toLocaleString()} 次 (
                        {(item.percentage * 100).toFixed(1)}%)
                      </div>
                    );
                  }

                  return (
                    <div style={isOther ? otherStyle : defaultStyle}>
                      <div>
                        {label}：{value.toLocaleString()} 次 (
                        {(percentage * 100).toFixed(1)}%)
                      </div>
                      {isOther && Array.isArray(othersDetails) && (
                        <>
                          <hr
                            style={{ margin: "6px 0", borderColor: "#ddd" }}
                          />
                          {othersDetails.map((item, idx) => (
                            <div key={idx}>
                              {item.label}：{item.value.toLocaleString()} 次 (
                              {(item.percentage * 100).toFixed(2)}%)
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                }}
                theme={{
                  text: { fill: "#ccc", fontSize: 16 },
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
