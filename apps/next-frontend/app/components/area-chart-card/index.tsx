import Chart from "react-google-charts";

const AreaChartCard = ({
  title,
  data,
  options,
}: {
  title: string;
  data: (string | number | null)[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
}) => {
  const areaGraphOptions = {
    isStacked: true,
    legend: { position: "top", textStyle: { color: "#4b5563" } },
    vAxis: {
      minValue: 0,
      gridlines: { color: "#e5e7eb" },
      textStyle: { color: "#6b7280" },
    },
    hAxis: {
      textStyle: { color: "#6b7280" },
      // Allow labels to be slanted to prevent overlapping
      slantedText: true,
      slantedTextAngle: 30,
    },
    backgroundColor: "transparent",
    crosshair: {
      trigger: "both",
      opacity: 0.5,
    },
    colors: ["#2563eb", "#9333ea"],
    // Adjust chartArea to provide more space for the x-axis labels
    chartArea: { height: "65%", width: "90%" },
    tooltip: {
      textStyle: {
        color: "#1f2937",
        fontName: "Roboto",
        fontSize: 14,
      },
      showColorCode: true,
    },
    ...options,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      {data.length <= 1 ? (
        <div className="flex items-center justify-center h-80 text-gray-500">
          No data available
        </div>
      ) : (
        <Chart
          chartType="AreaChart"
          data={data}
          options={areaGraphOptions}
          width={"100%"}
          height={"400px"}
        />
      )}
    </div>
  );
};

export default AreaChartCard;
