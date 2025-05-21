import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from "recharts";
import "../../styles/charts.css";

export default function DailyTrendLine({ data }) {
  if (!data) return null;

  const calendarData = Object.entries(data).map(([date, value]) => ({
    day: date,
    value,
  }));

  if (calendarData.length === 0) return null;

  const dates = calendarData.map((d) => d.day).sort();
  const from = dates[0];
  const to = dates[dates.length - 1];

  const startDate = new Date(from);
  const endDate = new Date(to);
  const yearCount =
    startDate.getFullYear() === endDate.getFullYear()
      ? 1
      : endDate.getFullYear() - startDate.getFullYear() + 1;
  const chartHeight = Math.max(160, yearCount * 180);

  const values = Object.values(data);
  const rawMax = Math.max(...values);
  const minValue = 10;
  const maxValue = rawMax > 500 ? 500 : rawMax;

  const lineData = Object.entries(data).map(([date, value]) => ({
    date,
    value,
  }));

  return (
    <div className="chart-card professional">
      <h3 className="chart-title">🗓️ 每日訊息數量分布</h3>
      <div style={{ height: `${chartHeight}px` }}>
        <ResponsiveCalendar
          data={calendarData}
          from={from}
          to={to}
          emptyColor="#222"
          colors={["#c8e6c9", "#81c784", "#4caf50", "#388e3c", "#1b5e20"]}
          minValue={minValue}
          maxValue={maxValue}
          margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
          yearSpacing={40}
          monthBorderColor="#555"
          dayBorderWidth={1}
          dayBorderColor="#444"
          tooltip={(datum) => (
            <div
              style={{
                background: "#fff",
                color: "#000",
                padding: "6px 12px",
                borderRadius: "999px",
                whiteSpace: "nowrap",
              }}
            >
              {datum.day}：{datum.value?.toLocaleString() ?? "無訊息"}
            </div>
          )}
          theme={{
            text: {
              fill: "#666",
              fontSize: 13,
            },
            labels: {
              text: {
                fill: "#666",
                fontSize: 13,
              },
            },
          }}
        />
      </div>

      <h3 className="chart-title" style={{ marginTop: "3rem" }}>
        📈 每日訊息趨勢
      </h3>
      <div style={{ height: "500px" }}>
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart data={lineData}>
            <CartesianGrid stroke="#444" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#ccc" }}
              fontSize={14}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              tick={{ fill: "#ccc" }}
              fontSize={14}
              tickFormatter={(v) => (v === 0 ? "" : v)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "999px" }}
              labelStyle={{ color: "#000" }}
              itemStyle={{ display: "none" }}
              formatter={() => null}
              labelFormatter={(label, payload) => {
                const value = payload?.[0]?.value;
                return `${label}：${value?.toLocaleString() ?? 0} 則`;
              }}
            />
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e1bee7" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#e1bee7" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#e1bee7"
              strokeWidth={2}
              fill="url(#purpleGradient)"
            />
            <Brush
              dataKey="date"
              height={20}
              stroke="#8884d8"
              travellerWidth={8}
              fill="#2c2c2c"
              handleStyle={{
                fill: "#e1bee7",
                stroke: "#e1bee7",
              }}
              textStyle={{
                fill: "#ccc",
                fontSize: 12,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
