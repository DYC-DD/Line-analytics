import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import "../../styles/charts.css";

export default function MessageCountBar({ data }) {
  if (!data) return null;

  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  const chartData = [
    ...Object.entries(data)
      .map(([sender, count]) => ({
        name: sender,
        value: count,
      }))
      .sort((a, b) => a.value - b.value),
    { name: "總計", value: total },
  ];

  return (
    <div className="chart-card professional">
      <h3 className="chart-title">📊 傳送者訊息統計</h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 40, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#444" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#aaa", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#aaa", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name, props) => [
              `${props.payload.name}：${value.toLocaleString()}`,
            ]}
            labelFormatter={() => ""}
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              color: "#000",
              borderRadius: 999,
              padding: "0.4rem 1rem",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "總計" ? "#f4b400" : "#00bcd4"}
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: "#eee", fontWeight: 600, fontSize: 14 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
