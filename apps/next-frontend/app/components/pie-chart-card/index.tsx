import React from "react";
import type { PieSectorDataItem, TooltipContentProps } from "recharts";
import {
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PieChartOptions = {
  colors?: string[];
};

type PieChartData = (string | number)[][];

interface ParsedPieData {
  name: string;
  value: number;
  fill: string;
}

const PieChartCard = ({
  title,
  data,
  options = {},
  height = "320px", // 調整 1：將整體預設高度從 380px 降為 320px，減少不必要的留白
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

  const colors = options?.colors ?? defaultColors;

  const parsedData = React.useMemo<ParsedPieData[]>(() => {
    if (data.length <= 1) return [];
    return data.slice(1).map((row, index) => ({
      name: String(row[0] ?? "Unknown"),
      value: Number(row[1]) || 0,
      fill: colors[index % colors.length],
    }));
  }, [data, colors]);

  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const CustomTooltip = React.useCallback(
    ({ active, payload }: TooltipContentProps<ValueType, NameType>) => {
      if (!active || !payload || payload.length === 0) return null;

      const entry = payload[0];
      const dataItem = entry.payload as ParsedPieData;

      const { name, value, fill } = dataItem;
      const total = parsedData.reduce((sum, item) => sum + item.value, 0);
      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0";

      return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 text-sm min-w-[160px]">
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: fill }}
            />
            <span className="font-medium text-gray-900">{name}</span>
          </div>
          <div className="font-mono text-gray-900">
            {value.toLocaleString()}{" "}
            <span className="text-gray-500">({percent}%)</span>
          </div>
        </div>
      );
    },
    [parsedData],
  );

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

    if (isMobile) {
      return (
        <g>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={isActive ? (outerRadius ?? 0) + 8 : outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            stroke="none"
          />
          {isActive && payload?.name && (
            <text
              x={cx}
              y={cy}
              dy={6}
              textAnchor="middle"
              fill="#1f2937"
              fontSize={14}
              fontWeight={700}
            >
              {payload.name}
            </text>
          )}
        </g>
      );
    }

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
          stroke="none"
        />
      );
    }

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * (midAngle ?? 0));
    const cos = Math.cos(-RADIAN * (midAngle ?? 0));

    // 調整 2：稍微縮短外圍引線的長度，讓圓餅圖有更多放大的空間
    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 8) * cos;
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 8) * sin;
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 18) * cos;
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 18) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 16;
    const ey = my;

    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill="#1f2937"
          fontSize={15}
          fontWeight={700}
        >
          {payload?.name}
        </text>

        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none"
        />

        <Sector
          cx={cx}
          cy={cy}
          innerRadius={(outerRadius ?? 0) + 6}
          outerRadius={(outerRadius ?? 0) + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none"
        />

        <path
          d={`M${sx},${sy} L${mx},${my} L${ex},${ey}`}
          stroke={fill}
          fill="none"
          strokeWidth={1.5}
        />
        <circle cx={ex} cy={ey} r={2.5} fill={fill} stroke="none" />

        <text
          x={ex + (cos >= 0 ? 1 : -1) * 8}
          y={ey}
          textAnchor={textAnchor}
          fill="#1f2937"
          fontWeight={600}
          fontSize={13}
        >
          {Number(value ?? 0).toLocaleString()}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 8}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#6b7280"
          fontSize={12}
        >
          {`(${((percent ?? 0) * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  if (parsedData.length === 0) {
    return (
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-4 pt-5 px-6">
          <CardTitle className="text-xl font-bold text-gray-800 tracking-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <div
            className="flex items-center justify-center text-gray-400"
            style={{ height }}
          >
            尚無資料
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white">
      <CardHeader className="pb-4 pt-5 px-6">
        <CardTitle className="text-xl font-bold text-gray-800 tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2">
        <div style={{ height, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, bottom: 0, left: 30 }}>
              <Pie
                data={parsedData}
                cx="50%"
                cy="45%" // 調整 3：將中心點從 50% 移到 45%，讓圖表往上提，平衡版面
                innerRadius={isMobile ? "60%" : "55%"} // 調整 4：稍微放大內徑與外徑
                outerRadius={isMobile ? "80%" : "70%"}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                shape={renderShape}
              />

              {isMobile && <Tooltip content={CustomTooltip} />}

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={9}
                wrapperStyle={{
                  paddingTop: "20px", // 確保圖例跟圖表之間有足夠呼吸空間
                  fontSize: "13px",
                  color: "#4b5563",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
