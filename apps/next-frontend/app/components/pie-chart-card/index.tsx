import Chart from "react-google-charts";

const PieChartCard = ({
  title,
  data,
  options,
  height = "250px",
}: {
  title: string;
  data: (string | number)[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
  height?: string;
}) => {
  const pieChartOptions = {
    legend: {
      position: "bottom",
      textStyle: { fontSize: 14 }, // Increased font size for legend
      alignment: "center",
      maxLines: 3,
      pagingTextStyle: { color: "#999" },
      pageSize: 5,
    },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
    colors: [
      "#2563eb",
      "#3b82f6",
      "#60a5fa",
      "#93c5fd",
      "#bfdbfe",
      "#dbeafe",
      "#eff6ff",
    ],
    pieHole: 0.5,
    chartArea: { left: 10, top: 10, width: "100%", height: "85%" },
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
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      ) : (
        <Chart
          chartType="PieChart"
          data={data}
          options={pieChartOptions}
          width={"100%"}
          height={height}
        />
      )}
    </div>
  );
};

export default PieChartCard;
