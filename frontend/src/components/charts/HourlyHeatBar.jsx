import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import "../../styles/charts.css";

export default function HourlyHeatBar({ data, forceDesktop }) {
  if (!data) return null;

  const chartData = Array.from({ length: 24 }, (_, i) => {
    const hourStr = i.toString();
    return {
      hour: `${i.toString().padStart(2, "0")}:00`,
      value: data[hourStr] ?? 0,
    };
  });

  const isMobile = forceDesktop ? false : window.innerWidth < 768;

  return (
    <div className="chart-card professional">
      <h3 className="chart-title">⏰ 每小時訊息分布</h3>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 10,
            bottom: isMobile ? 20 : 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#aaa", fontSize: isMobile ? 11 : 13 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#aaa", fontSize: isMobile ? 11 : 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const barData = payload.find(
                  (p) => p.dataKey === "value" && p.payload
                );
                return (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      color: "#000",
                      borderRadius: "999px",
                      whiteSpace: "nowrap",
                      padding: "6px 12px",
                    }}
                  >
                    {barData?.payload.hour}：
                    {barData?.value?.toLocaleString() ?? 0}
                  </div>
                );
              }
              return null;
            }}
          />

          <Bar
            dataKey="value"
            barSize={isMobile ? 14 : 24}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#ffb74d" />
            ))}

            {!isMobile && (
              <LabelList
                dataKey="value"
                position="top"
                style={{ fill: "#eee", fontSize: 12, fontWeight: 500 }}
              />
            )}
          </Bar>

          <Line
            type="linear"
            dataKey="value"
            stroke="#fb8c00"
            strokeWidth={2}
            dot={{
              r: isMobile ? 2 : 3,
              stroke: "#fb8c00",
              fill: "#fff",
              strokeWidth: 2,
            }}
            activeDot={{ r: isMobile ? 3 : 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
