import React from "react";
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
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: NameType;
    value?: ValueType;
    color?: string;
  }>;
  label?: string | number;
}

const AreaChartCard = ({
  title,
  data,
  options = {},
  height = "350px",
}: {
  title: string;
  data: (string | number | null)[][];
  options?: {
    colors?: string[];
    isStacked?: boolean;
    useBarChart?: boolean;
  };
  height?: string;
}) => {
  const defaultColors = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
  ];
  const colors = options?.colors || defaultColors;
  const isStacked = options?.isStacked !== false;
  const useBarChart = options?.useBarChart === true;

  // Define a type for the parsed data object
  type ParsedData = {
    [key: string]: string | number;
  };

  // Adapt react-google-charts data format to recharts format
  const parsedData = React.useMemo(() => {
    if (!data || data.length <= 1) return [];
    const headers = data[0] as string[];
    const xAxisKey = headers[0];
    const seriesKeys = headers.slice(1);

    return data.slice(1).map((row) => {
      const obj: ParsedData = {};
      obj[xAxisKey] = row[0] as string | number;
      seriesKeys.forEach((key, index) => {
        obj[key] = Number(row[index + 1]) || 0;
      });
      return obj;
    });
  }, [data]);

  const headers = data && data.length > 0 ? (data[0] as string[]) : [];
  const xAxisKey = headers.length > 0 ? headers[0] : "name";
  const seriesKeys = headers.length > 1 ? headers.slice(1) : [];

  const chartContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    const element = chartContainerRef.current;
    if (!element) return;

    const updateSize = () => {
      const nextWidth = Math.max(0, element.clientWidth || 0);
      const nextHeight = Math.max(0, element.clientHeight || 0);
      setContainerSize({ width: nextWidth, height: nextHeight });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const canRenderChart =
    parsedData.length > 0 &&
    containerSize.width > 0 &&
    containerSize.height > 0;

  // 當有兩個以上數據時自動顯示「數值 + 占比百分比」
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const total = payload.reduce(
      (sum: number, entry) => sum + (Number(entry.value) || 0),
      0,
    );

    return (
      <div
        className="bg-white border border-gray-200 rounded-xl shadow-md p-3 text-sm"
        style={{
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        }}
      >
        <p className="font-medium text-gray-800 mb-1 border-b border-gray-200">
          {label}
        </p>
        {payload.map((entry, index) => {
          const value = Number(entry.value) || 0;
          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
          return (
            <div
              key={index}
              className="flex justify-between items-center py-0.5"
              style={{ color: entry.color }}
            >
              <span className="font-medium">{entry.name}: </span>
              <span>
                {value.toLocaleString()}{" "}
                <span className="text-gray-500 font-normal">({percent}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 shadow-sm flex flex-col bg-white">
      <CardHeader className="pb-0 pt-2 px-6">
        <CardTitle className="text-lg font-bold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-6 px-6 pt-2">
        <div
          ref={chartContainerRef}
          style={{ height }}
          className="text-sm overflow-hidden w-full"
        >
          {!canRenderChart ? (
            <div className="flex items-center justify-center text-gray-500 h-full">
              {parsedData.length === 0
                ? "No data available"
                : "Loading chart..."}
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 200 }}
            >
              {useBarChart ? (
                <BarChart
                  data={parsedData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey={xAxisKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    dx={-10}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "20px", color: "#4b5563" }}
                  />
                  {seriesKeys.map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId={isStacked ? "a" : undefined}
                      fill={colors[index % colors.length]}
                      radius={isStacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              ) : (
                <AreaChart
                  data={parsedData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    {seriesKeys.map((key, index) => (
                      <linearGradient
                        key={`colorUv-${index}`}
                        id={`colorUv-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={colors[index % colors.length]}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={colors[index % colors.length]}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey={xAxisKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "20px", color: "#4b5563" }}
                  />
                  {seriesKeys.map((key, index) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stackId={isStacked ? "1" : undefined}
                      stroke={colors[index % colors.length]}
                      fillOpacity={1}
                      fill={`url(#colorUv-${index})`}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;
