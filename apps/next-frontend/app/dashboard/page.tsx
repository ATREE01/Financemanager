"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Chart from "react-google-charts";

import PageLabel from "@/app/components/page-label";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useBankHistoryData,
  useBankSummary,
} from "@/lib/features/Bank/BankSlice";
import {
  useBrokerageFirmHistoryData,
  useBrokerageFirmSummary,
} from "@/lib/features/BrokerageFirm/BrokerageFirmSlice";

export default function Dashboard() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [userId]);

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
    colors: ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"],
    pieHole: 0.3,
    chartArea: { left: 10, top: 10, width: "100%", height: "80%" },
  };

  const areaGraphoptions = {
    isStacked: true,
    height: 300,
    legend: { position: "top" },
    vAxis: { minValue: 0, gridlines: { color: "#f5f5f5" } },
    backgroundColor: "transparent",
    crosshair: {
      trigger: "both",
      opacity: 0.5,
    },
    colors: ["#3366CC", "#DC3912"],
    chartArea: { height: "70%" },
  };

  const bankSummary = useBankSummary();
  const bankHistoryData = useBankHistoryData();
  const brokerageFirmSummary = useBrokerageFirmSummary();
  const brokerageFirmHistoryData = useBrokerageFirmHistoryData();

  let bankTotal = 0,
    brokerageFirmTotal = 0;

  const bankPieChartData = [
    ["bank", "value"],
    ...Object.entries(bankSummary || {}).map(([key, summary]) => {
      bankTotal += summary.value;
      return [key, summary.value];
    }),
  ];
  const brokerageFirmPieChartData = [
    ["brokerageFirm", "value"],
    ...Object.entries(brokerageFirmSummary || {}).map(([key, summary]) => {
      brokerageFirmTotal += summary.value;
      return [key, summary.value];
    }),
  ];
  const totalPieChartData = [
    ["category", "amount"],
    ["銀行", bankTotal],
    ["券商", brokerageFirmTotal],
  ];

  const bankAreaChartData = [
    ["Date", "總額"],
    ...(bankHistoryData || []).map((data) => [data.date, data.value]),
  ];

  const brokerageFirmAreaChartData = [
    ["Date", "總額"],
    ...(brokerageFirmHistoryData || []).map((data) => [data.date, data.value]),
  ];

  const totalAreaChartData: (string | number | null)[][] = [
    ["date", "銀行", "投資"],
  ];

  let bankIndex = 1;
  let brokerageIndex = 1;

  while (
    bankIndex < bankAreaChartData.length ||
    brokerageIndex < brokerageFirmAreaChartData.length
  ) {
    const bankEntry = bankAreaChartData[bankIndex] || [];
    const brokerageEntry = brokerageFirmAreaChartData[brokerageIndex] || [];
    const [bankDate, bankValue] = bankEntry;
    const [brokerageDate, brokerageValue] = brokerageEntry;
    if (bankDate === brokerageDate) {
      totalAreaChartData.push([bankDate, bankValue, brokerageValue]);
      bankIndex++;
      brokerageIndex++;
    } else if (!brokerageDate || (bankDate && bankDate < brokerageDate)) {
      totalAreaChartData.push([bankDate, bankValue, null]);
      bankIndex++;
    } else {
      totalAreaChartData.push([brokerageDate, null, brokerageValue]);
      brokerageIndex++;
    }
  }

  return (
    <main>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen pt-[--navbar-height]">
        <PageLabel title="資產總覽" />
        <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "總資產",
                value: bankTotal + brokerageFirmTotal,
                data: totalPieChartData,
              },
              {
                title: "銀行資產",
                value: bankTotal,
                data: bankPieChartData,
              },
              {
                title: "投資資產",
                value: brokerageFirmTotal,
                data: brokerageFirmPieChartData,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-500">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${card.value.toLocaleString()}
                </p>
                {card.data.length <= 1 ? (
                  <div className="flex items-center justify-center text-gray-500 mt-4">
                    無可用資料
                  </div>
                ) : (
                  <div className="h-[20vh] mt-4">
                    <Chart
                      chartType="PieChart"
                      data={card.data}
                      options={{
                        ...pieChartOptions,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: "總資產趨勢",
                data: totalAreaChartData,
              },
              {
                title: "投資資產趨勢",
                data: brokerageFirmAreaChartData,
              },
              {
                title: "銀行資產趨勢",
                data: bankAreaChartData,
              },
            ].map((chart, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 pb-20 transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {chart.title}
                </h3>
                {chart.data.length <= 1 ? (
                  <div className="flex items-center justify-center text-gray-500">
                    無可用資料
                  </div>
                ) : (
                  <div className="h-[20vh]">
                    <Chart
                      chartType="AreaChart"
                      data={chart.data}
                      options={areaGraphoptions}
                      width={"100%"}
                      height={"250px"}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
