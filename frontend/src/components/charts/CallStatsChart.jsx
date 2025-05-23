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
  LineChart,
  Line,
  Legend,
} from "recharts";

const formatSeconds = (totalSec) => {
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${d > 0 ? `${d}天 ` : ""}${h}時 ${m}分 ${s}秒`;
};

const generateLineColors = (callRecords) => {
  const userSet = new Set();

  const collect = (records) => {
    (records || []).forEach(([, sender]) => {
      userSet.add(sender);
    });
  };

  collect(callRecords.success);
  collect(callRecords.cancelled);

  const colors = ["#42a5f5", "#66bb6a", "#ef5350", "#ffb74d"];
  const result = {};
  const allKeys = [];

  Array.from(userSet).forEach((sender, idx) => {
    const successKey = `${sender} 成功`;
    const cancelKey = `${sender} 未接`;
    result[successKey] = colors[(idx * 2) % colors.length];
    result[cancelKey] = colors[(idx * 2 + 1) % colors.length];
    allKeys.push(successKey, cancelKey);
  });

  return { lineColors: result, allKeys };
};

const generateHourlyCallData = (callRecords) => {
  const hourly = {};
  const allKeys = new Set();

  const add = (timeStr, sender, type) => {
    const [hourStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    const key = `${sender} ${type}`;
    const label = `${hour.toString().padStart(2, "0")}:00`;

    hourly[label] = hourly[label] || {};
    hourly[label][key] = (hourly[label][key] || 0) + 1;
    allKeys.add(key);
  };

  (callRecords.success || []).forEach(([time, sender]) =>
    add(time, sender, "成功")
  );
  (callRecords.cancelled || []).forEach(([time, sender]) =>
    add(time, sender, "未接")
  );

  return Array.from({ length: 24 }, (_, h) => {
    const hourLabel = `${h.toString().padStart(2, "0")}:00`;
    const base = { time: hourLabel };
    allKeys.forEach((k) => {
      base[k] = hourly[hourLabel]?.[k] || 0;
    });
    return base;
  });
};

export default function CallStatsChart({ data, forceDesktop }) {
  if (
    !data ||
    !data.call_duration_by_sender ||
    Object.keys(data.call_duration_by_sender).length === 0
  ) {
    return null;
  }

  const senders = Object.keys(data.call_duration_by_sender);
  const valuesInSec = data.call_duration_by_sender;
  const { lineColors, allKeys } = generateLineColors(data.call_records);

  const chartData = [
    {
      name: "總通話",
      total: data.total_call_duration,
    },
    {
      name: "通話分布",
      ...valuesInSec,
    },
  ];

  const countData = senders.map((name) => {
    const successCount = (data.call_records.success || []).filter(
      ([, sender]) => sender === name
    ).length;
    const cancelledCount = (data.call_records.cancelled || []).filter(
      ([, sender]) => sender === name
    ).length;
    const total = successCount + cancelledCount;
    return { name, 成功: successCount, 取消: cancelledCount, 總: total };
  });

  const totalInSeconds = data.total_call_duration;
  const colors = ["#42a5f5", "#66bb6a"];

  const isMobile = forceDesktop ? false : window.innerWidth < 768;
  const renderLegend = (props) => {
    const { payload } = props;

    const itemsPerRow = isMobile ? 2 : payload.length;
    const rows = [];

    for (let i = 0; i < payload.length; i += itemsPerRow) {
      rows.push(payload.slice(i, i + itemsPerRow));
    }

    return (
      <div style={{ marginTop: 12 }}>
        {rows.map((row, rowIndex) => (
          <div
            key={`legend-row-${rowIndex}`}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            {row.map((entry) => (
              <span
                key={entry.value}
                style={{
                  color: entry.color,
                  fontSize: isMobile ? "12px" : "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="10" height="10">
                  <rect
                    width="10"
                    height="10"
                    fill={entry.color}
                    rx={2}
                    ry={2}
                  />
                </svg>
                {entry.value}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="chart-card professional">
      <h3 className="chart-title">📞 通話統計</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{
            top: 20,
            right: isMobile ? 10 : 40,
            left: isMobile ? 0 : 40,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            domain={[0, totalInSeconds]}
            tick={{ fill: "#aaa", fontSize: isMobile ? 12 : 14 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatSeconds(v)}
            tickCount={6}
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#aaa", fontSize: isMobile ? 12 : 14 }}
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
              style={{ fill: "#fff", fontSize: isMobile ? 12 : 14 }}
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
                content={({ x, y, width, height, value }) => {
                  if (!value) return null;

                  const text = isMobile
                    ? `${formatSeconds(value)}`
                    : `${sender}：${formatSeconds(value)}`;

                  return (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      fill="#fff"
                      fontSize={isMobile ? 12 : 14}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {text}
                    </text>
                  );
                }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

      <h3 className="chart-title">📊 通話次數：成功 vs 取消</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          layout="vertical"
          data={countData}
          margin={{
            top: 20,
            right: isMobile ? 8 : 40,
            left: isMobile ? 0 : 40,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "#aaa", fontSize: isMobile ? 12 : 14 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#aaa", fontSize: isMobile ? 12 : 14 }}
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
                    fontSize={isMobile ? 12 : 14}
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
                    fontSize={isMobile ? 12 : 14}
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

      <h3 className="chart-title">📈 每小時通話趨勢</h3>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={generateHourlyCallData(data.call_records)}
          margin={{
            top: 20,
            right: isMobile ? 8 : 40,
            left: isMobile ? 0 : 40,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#aaa", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#aaa", fontSize: 14 }}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "6px",
              fontSize: "14px",
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Legend content={renderLegend} />
          {allKeys.map((key) => (
            <Line
              key={key}
              type="linear"
              dataKey={key}
              stroke={lineColors[key]}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
