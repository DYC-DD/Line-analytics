import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const formatSeconds = (totalSec) => {
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${d > 0 ? `${d}天 ` : ""}${h}時 ${m}分 ${s}秒`;
};

export default function CallStatsChart({ data }) {
  if (
    !data ||
    !data.call_duration_by_sender ||
    Object.keys(data.call_duration_by_sender).length === 0
  ) {
    return null;
  }

  const senders = Object.keys(data.call_duration_by_sender);
  const valuesInSec = data.call_duration_by_sender;

  const chartData = [
    {
      name: "總通話時間",
      total: data.total_call_duration,
    },
    {
      name: "通話分布",
      ...valuesInSec,
    },
  ];

  const totalInSeconds = data.total_call_duration;
  const colors = ["#42a5f5", "#66bb6a"];

  return (
    <div className="chart-card professional">
      <h3 className="chart-title">📞 通話統計</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            domain={[0, totalInSeconds]}
            tick={{ fill: "#aaa", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatSeconds(v)}
            tickCount={6}
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#aaa", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;

              const items = payload[0].payload;

              const colorMap = {
                total: "#ffa726",
                ...Object.fromEntries(
                  Object.keys(items)
                    .filter((k) => k !== "name" && k !== "total")
                    .map((k, i) => [k, colors[i % colors.length]])
                ),
              };

              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    borderRadius: "999px",
                    padding: "10px 12px",
                    fontSize: "14px",
                    lineHeight: "1.5em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {Object.entries(items).map(([key, value]) => {
                    if (key === "name") return null;
                    if (typeof value !== "number") return null;

                    const label = key === "total" ? "總通話時間" : key;
                    const color = colorMap[key] || "#000";

                    return (
                      <div key={key} style={{ color }}>
                        {label}：{formatSeconds(value)}
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />

          <Bar dataKey="total" barSize={24} fill="#ffa726">
            <LabelList
              dataKey="total"
              position="center"
              formatter={formatSeconds}
              style={{ fill: "#fff", fontSize: 13 }}
            />
          </Bar>

          {senders.map((sender, idx) => (
            <Bar
              key={sender}
              dataKey={sender}
              stackId="分布"
              fill={colors[idx % colors.length]}
              barSize={24}
            >
              <LabelList
                dataKey={sender}
                position="center"
                content={(props) => {
                  const { x, y, width, height, value } = props;
                  if (!value) return null;
                  return (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      fill="#fff"
                      fontSize={12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {`${sender}：${formatSeconds(value)}`}
                    </text>
                  );
                }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

      <h3 className="chart-title">📊 通話次數：成功 vs 取消</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          layout="vertical"
          data={senders.map((name) => {
            const total = data.call_count_by_sender[name] || 0;
            const cancelled = data.cancelled_call_by_sender[name] || 0;
            const success = total - cancelled;
            return { name, 成功: success, 取消: cancelled, 總: total };
          })}
          margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
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
            dataKey="name"
            tick={{ fill: "#aaa", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const item = payload[0].payload;
              const cancelled = item["取消"];
              const total = item["總"];
              const rate = total > 0 ? (cancelled / total) * 100 : 0;

              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    color: "red",
                    padding: "10px",
                    borderRadius: "999px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  取消率：{rate.toFixed(1)}%
                </div>
              );
            }}
          />
          <Bar dataKey="成功" stackId="calls" fill="#66bb6a" barSize={20}>
            <LabelList
              dataKey="成功"
              position="center"
              content={({ x, y, width, height, value }) => {
                if (value === 0) return null;
                return (
                  <text
                    x={x + width / 2}
                    y={y + height / 2}
                    fill="#fff"
                    fontSize={14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    成功：{value.toLocaleString()} 次
                  </text>
                );
              }}
            />
          </Bar>
          <Bar dataKey="取消" stackId="calls" fill="#ef5350" barSize={20}>
            <LabelList
              dataKey="取消"
              position="center"
              content={({ x, y, width, height, value }) => {
                if (value === 0) return null;
                return (
                  <text
                    x={x + width / 2}
                    y={y + height / 2}
                    fill="#fff"
                    fontSize={14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    取消：{value.toLocaleString()} 次
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
