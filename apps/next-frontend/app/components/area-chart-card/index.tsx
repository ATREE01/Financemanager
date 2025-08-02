import clsx from "clsx";
import Chart from "react-google-charts";

const AreaChartCard = ({
  title,
  data,
  options = {},
  height = "450px",
}: {
  title: string;
  data: (string | number | null)[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
  height?: string;
}) => {
  const defaultOptions = {
    isStacked: true,
    legend: { position: "top", textStyle: { color: "#4b5563" } },
    vAxis: {
      minValue: 0,
      gridlines: { color: "#e5e7eb" },
      textStyle: { color: "#6b7280" },
    },
    hAxis: {
      textStyle: { color: "#6b7280" },
      slantedText: true,
      slantedTextAngle: 30,
    },
    backgroundColor: "transparent",
    crosshair: {
      trigger: "both",
      opacity: 0.5,
    },
    colors: ["#2563eb", "#9333ea"],
    chartArea: { height: "65%", width: "90%" },
    tooltip: {
      textStyle: {
        color: "#1f2937",
        fontName: "Roboto",
        fontSize: 14,
      },
      showColorCode: true,
    },
  };

  // Deep merge options to allow parent to override specific nested properties
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    legend: { ...defaultOptions.legend, ...options.legend },
    vAxis: { ...defaultOptions.vAxis, ...options.vAxis },
    hAxis: { ...defaultOptions.hAxis, ...options.hAxis },
    crosshair: { ...defaultOptions.crosshair, ...options.crosshair },
    chartArea: { ...defaultOptions.chartArea, ...options.chartArea },
    tooltip: {
      ...defaultOptions.tooltip,
      ...options.tooltip,
      textStyle: {
        ...defaultOptions.tooltip.textStyle,
        ...options.tooltip?.textStyle,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      {data.length <= 1 ? (
        <div
          className={clsx(
            "flex items-center justify-center text-gray-500",
            `h-[${height}px]`,
          )}
        >
          No data available
        </div>
      ) : (
        <Chart
          chartType="AreaChart"
          data={data}
          options={mergedOptions}
          width={"100%"}
          height={height}
        />
      )}
    </div>
  );
};

export default AreaChartCard;
