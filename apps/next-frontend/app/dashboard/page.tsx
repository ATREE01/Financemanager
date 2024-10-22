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
    legend: { position: "top", maxLines: 3 },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
  };

  const areaGraphoptions = {
    isStacked: true,
    height: 300,
    legend: { position: "top", maxLines: 3 },
    vAxis: { minValue: 0 },
    backgroundColor: "transparent",
    crosshair: {
      trigger: "both",
      opacity: 0.5,
    },
  };

  const bankSummary = useBankSummary();
  const bankHistoryData = useBankHistoryData();
  const brokerageFirmSummary = useBrokerageFirmSummary();
  const brokerageFirmHistoryData = useBrokerageFirmHistoryData();

  let bankTotal = 0,
    brokerageFirmTotal = 0;

  const bankPieChartData = [
    ["bank", "value"],
    ...Object.entries(bankSummary).map(([key, summary]) => {
      bankTotal += summary.value;
      return [key, summary.value];
    }),
  ];
  const brokerageFirmPieChartData = [
    ["brokerageFirm", "value"],
    ...Object.entries(brokerageFirmSummary).map(([key, summary]) => {
      brokerageFirmTotal += summary.value;
      return [key, summary.value];
    }),
  ];
  const totalPieChartData = [
    ["caregory", "amount"],
    ["銀行", bankTotal],
    ["券商", brokerageFirmTotal],
  ];

  const bankAreaChartData = [
    ["Date", "Total"],
    ...bankHistoryData.map((data) => [data.date, data.value]),
  ];

  const brokerageFirmAreaChartData = [
    ["Date", "Total"],
    ...brokerageFirmHistoryData.map((data) => [data.date, data.value]),
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
      <div className="bg-slate-100 py-[--navbar-height] min-h-screen">
        <PageLabel title="總覽" />

        <div className="pie-chart-container flex flex-wrap justify-center mb-4 text-center text-black">
          <div className="pie-chart-block w-80 h-80">
            <div className="text-3xl font-bold">財產總覽</div>
            <Chart
              chartType="PieChart"
              data={totalPieChartData}
              options={pieChartOptions}
              width={"20rem"}
              height={"20rem"}
            />
          </div>
          <div className="DIE-pie-chart-block w-80 h-80">
            <div className="text-3xl font-bold">金融總覽</div>
            <Chart
              chartType="PieChart"
              data={bankPieChartData}
              options={pieChartOptions}
              width={"20rem"}
              height={"20rem"}
            />
          </div>
          <div className="DIE-pie-chart-block w-80 h-80">
            <div className="text-3xl font-bold">投資總覽</div>
            <Chart
              chartType="PieChart"
              data={brokerageFirmPieChartData}
              options={pieChartOptions}
              width={"20rem"}
              height={"20rem"}
            />
          </div>
        </div>
        <div className="area-chart-container flex flex-wrap justify-center m-2 text-center text-black">
          <div className="pie-chart-block w-96 h-80">
            <div className="text-3xl font-bold">總資產變化圖</div>
            <Chart
              chartType="AreaChart"
              data={totalAreaChartData}
              options={areaGraphoptions}
              width={"25rem"}
              height={"20rem"}
            />
          </div>
          <div className="pie-chart-block w-96 h-80">
            <div className="text-3xl font-bold">股票市值變化圖</div>
            <Chart
              chartType="AreaChart"
              data={brokerageFirmAreaChartData}
              options={areaGraphoptions}
              width={"25rem"}
              height={"20rem"}
            />
          </div>
          <div className="pie-chart-block w-96 h-80">
            <div className="text-3xl font-bold">銀行資產變化圖</div>
            <Chart
              chartType="AreaChart"
              data={bankAreaChartData}
              options={areaGraphoptions}
              width={"25rem"}
              height={"20rem"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
