import React from "react";
import type { PieSectorDataItem } from "recharts";
import { Legend, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PieChartOptions = {
  colors?: string[];
};

type PieChartData = (string | number)[][];

const PieChartCard = ({
  title,
  data,
  options = {},
  height,
}: {
  title: string;
  data: PieChartData;
  options?: PieChartOptions;
  height?: string;
}) => {
  const defaultColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",  
    "#f97316",
    "#ec4899",
    "#84cc16",
    "#6366f1",
  ];

  const colors = options?.colors || defaultColors;

  const parsedData =
    data.length > 1
      ? data.slice(1).map((row, index) => ({
          name: row[0],
          value: Number(row[1]) || 0,
          fill: colors[index % colors.length],
        }))
      : [];

  // === Recharts v3.8+ 最新寫法（徹底解決 deprecated）===
  const renderShape = (props: PieSectorDataItem & { isActive?: boolean }) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
      midAngle,
      isActive,
    } = props;

    // 1. 普通狀態（非 hover）：簡單扇區 + 明確關閉黑色外框
    if (!isActive) {
      return (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none" // ← 關鍵：徹底關閉黑色外框
          strokeWidth={0}
        />
      );
    }

    // 2. Active 狀態（hover / 點擊）：自訂高亮效果
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * (midAngle ?? 1));
    const cos = Math.cos(-RADIAN * (midAngle ?? 1));

    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        {/* 中心文字：名稱 */}
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill="#1f2937"
          fontSize={16}
          fontWeight={700}
        >
          {payload?.name}
        </text>

        {/* 主扇區 */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none" // ← 關閉黑色外框
          strokeWidth={0}
        />

        {/* 外側高亮環（彩色，不是黑色） */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={(outerRadius ?? 0) + 6}
          outerRadius={(outerRadius ?? 0) + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none" // ← 關閉黑色外框
          strokeWidth={0}
        />

        {/* 指標線 */}
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

        {/* 側邊標籤：數值 + 百分比 */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#1f2937"
          fontWeight={600}
        >
          {Number(value ?? 0).toLocaleString()}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#4b5563"
          fontSize={13}
        >
          {`(${((percent ?? 0) * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 shadow-sm flex flex-col bg-white">
      <CardHeader className="pb-0 pt-2 px-6">
        <CardTitle className="text-lg font-bold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-6 px-6 pt-4">
        {parsedData.length === 0 ? (
          <div
            className="flex items-center justify-center text-gray-500"
            style={{ height: height || "100%" }}
          >
            No data available
          </div>
        ) : (
          <div style={{ height: height || "100%", width: "100%" }}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 200 }}
            >
              <PieChart>
                <Pie
                  data={parsedData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  shape={renderShape}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "13px",
                    color: "#4b5563",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
