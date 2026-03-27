import React from "react";
import type { TooltipContentProps } from "recharts"; // ← 新增這行
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ====================== 型別定義 ======================

type DataRow = (string | number | null)[];

type ChartData = DataRow[];

interface ChartOptions {
  colors?: string[];
  isStacked?: boolean;
  useBarChart?: boolean;
}

interface ParsedDataItem {
  [key: string]: string | number;
}

// ====================== 工具函式 ======================

const formatYAxis = (value: number): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000)
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (absValue >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (absValue >= 10_000) return `${Math.round(value / 1_000)}K`;
  if (absValue >= 1_000) return `${(value / 1_000).toFixed(1)}K`;

  return value.toLocaleString();
};

const calculateYAxisWidth = (
  parsedData: ParsedDataItem[],
  seriesKeys: string[],
): number => {
  if (parsedData.length === 0 || seriesKeys.length === 0) return 52;

  let maxAbsValue = 0;
  let hasNegative = false;

  for (const row of parsedData) {
    for (const key of seriesKeys) {
      const val = Number(row[key]) || 0;
      maxAbsValue = Math.max(maxAbsValue, Math.abs(val));
      if (val < 0) hasNegative = true;
    }
  }

  const formatted = formatYAxis(maxAbsValue);
  const estimatedLength = formatted.length + (hasNegative ? 1 : 0);

  return Math.max(52, Math.min(96, estimatedLength * 7.8 + 14));
};

// ====================== 元件 ======================

const AreaChartCard = ({
  title,
  data,
  options = {},
  height = "360px",
}: {
  title: string;
  data: ChartData;
  options?: ChartOptions;
  height?: string;
}) => {
  const defaultColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  const colors = options?.colors ?? defaultColors;
  const isStacked = options?.isStacked !== false;
  const useBarChart = options?.useBarChart === true;

  const parsedData = React.useMemo<ParsedDataItem[]>(() => {
    if (!data || data.length <= 1) return [];

    const headers = data[0] as string[];
    const xAxisKey = headers[0];
    const seriesKeys = headers.slice(1);

    return data.slice(1).map((row) => {
      const obj: ParsedDataItem = { [xAxisKey]: row[0] as string | number };
      seriesKeys.forEach((key, index) => {
        obj[key] = Number(row[index + 1]) || 0;
      });
      return obj;
    });
  }, [data]);

  const headers = React.useMemo<string[]>(
    () => (data?.[0] as string[]) ?? [],
    [data],
  );
  const xAxisKey = headers[0] || "name";
  const seriesKeys = headers.slice(1);

  const yAxisWidth = React.useMemo(
    () => calculateYAxisWidth(parsedData, seriesKeys),
    [parsedData, seriesKeys],
  );

  // 使用 Recharts 官方型別（解決 readonly payload 錯誤）
  const CustomTooltip = React.useCallback(
    ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
      if (!active || !payload || payload.length === 0) return null;

      const total = payload.reduce(
        (sum: number, entry) => sum + (Number(entry.value) || 0),
        0,
      );

      return (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xl p-4 text-sm backdrop-blur-sm min-w-[180px]">
          <p className="font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
            {label}
          </p>
          <div className="space-y-2.5">
            {payload.map((entry, index) => {
              const value = Number(entry.value) || 0;
              const percent =
                total > 0 ? ((value / total) * 100).toFixed(1) : "0";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-700 font-medium">
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-right font-mono text-gray-900">
                    {value.toLocaleString()}
                    <span className="text-gray-400 text-xs ml-1.5">
                      ({percent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
    [],
  );

  if (parsedData.length === 0) {
    return (
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-4 pt-5 px-6">
          <CardTitle className="text-xl font-bold text-gray-800 tracking-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <div
            className="flex items-center justify-center text-gray-400 text-sm"
            style={{ height }}
          >
            尚無資料
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-6">
        <CardTitle className="text-xl font-bold text-gray-800 tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="relative w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {useBarChart ? (
              <BarChart
                data={parsedData}
                margin={{ top: 20, right: 20, left: 8, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey={xAxisKey}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={12}
                />
                <YAxis
                  width={yAxisWidth}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={CustomTooltip} cursor={{ fill: "#f8fafc" }} />
                <Legend
                  verticalAlign="top"
                  height={44}
                  iconType="circle"
                  iconSize={9}
                  wrapperStyle={{
                    paddingBottom: "16px",
                    color: "#334155",
                    fontSize: "13px",
                  }}
                />
                {seriesKeys.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId={isStacked ? "stack" : undefined}
                    fill={colors[index % colors.length]}
                    radius={isStacked ? [0, 0, 0, 0] : [6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : (
              <AreaChart
                data={parsedData}
                margin={{ top: 20, right: 20, left: 8, bottom: 8 }}
              >
                <defs>
                  {seriesKeys.map((key, index) => (
                    <linearGradient
                      key={`grad-${index}`}
                      id={`colorGrad-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={colors[index % colors.length]}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={colors[index % colors.length]}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey={xAxisKey}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={12}
                />
                <YAxis
                  width={yAxisWidth}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={CustomTooltip} />
                <Legend
                  verticalAlign="top"
                  height={44}
                  iconType="circle"
                  iconSize={9}
                  wrapperStyle={{
                    paddingBottom: "16px",
                    color: "#334155",
                    fontSize: "13px",
                  }}
                />
                {seriesKeys.map((key, index) => (
                  <Area
                    key={key}
                    type="natural"
                    dataKey={key}
                    stackId={isStacked ? "stack" : undefined}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2.5}
                    fill={`url(#colorGrad-${index})`}
                    dot={false}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;
