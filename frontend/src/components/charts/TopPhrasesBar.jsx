import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import "../../styles/charts.css";

export default function TopPhrasesBar({ data }) {
  if (!data || !Array.isArray(data)) return null;

  const chartData = data.map(([phrase, value]) => ({
    phrase,
    value,
  }));

  const maxPhraseLength = Math.max(...chartData.map((d) => d.phrase.length));
  const leftMargin = Math.max(40, Math.min(maxPhraseLength * 10, 140));

  return (
    <div className="chart-card professional">
      <h3 className="chart-title">💬 常用語句 Top 10</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: leftMargin, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "#aaa", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="phrase"
            tick={{ fill: "#aaa", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name, props) => {
              const phrase = props.payload.phrase;
              return [`${phrase}：${value.toLocaleString()} 次`];
            }}
            labelFormatter={() => ""}
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              color: "#000",
              borderRadius: "999px",
              whiteSpace: "nowrap",
              padding: "6px 12px",
            }}
          />

          <Bar dataKey="value" barSize={20} radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#42a5f5" />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: "#eee", fontSize: 12, fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
