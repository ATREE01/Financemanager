"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AreaChartCard from "@/app/components/area-chart-card";
import PageLabel from "@/app/components/page-label";
import PieChartCard from "@/app/components/pie-chart-card";
import SummaryCard from "@/app/components/summary-card";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useGetBankhistoryDataQuery,
  useGetBankSummaryQuery,
} from "@/lib/features/Bank/BankApiSlice";
import {
  useGetBrokerageFirmSummaryQuery,
  useGetBrokerageFrimHistoryDataQuery,
} from "@/lib/features/BrokerageFirm/BrokerageFirmApiSlice";

export default function Dashboard() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const { data: bankSummary } = useGetBankSummaryQuery();
  const { data: bankHistoryData } = useGetBankhistoryDataQuery();
  const { data: brokerageFirmSummary } = useGetBrokerageFirmSummaryQuery();
  const { data: brokerageFirmHistoryData } =
    useGetBrokerageFrimHistoryDataQuery();

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

  const safeBankAreaChartData = bankAreaChartData || [["Date", "總額"]];
  const safeBrokerageFirmAreaChartData = brokerageFirmAreaChartData || [
    ["Date", "總額"],
  ];

  while (
    bankIndex < safeBankAreaChartData.length ||
    brokerageIndex < safeBrokerageFirmAreaChartData.length
  ) {
    const bankEntry = safeBankAreaChartData[bankIndex] || [];
    const brokerageEntry = safeBrokerageFirmAreaChartData[brokerageIndex] || [];
    const [bankDate, bankValue] = bankEntry;
    const [brokerageDate, brokerageValue] = brokerageEntry;

    if (bankDate && bankDate === brokerageDate) {
      totalAreaChartData.push([bankDate, bankValue, brokerageValue]);
      bankIndex++;
      brokerageIndex++;
    } else if (
      !brokerageDate ||
      (bankDate && brokerageDate && bankDate < brokerageDate)
    ) {
      totalAreaChartData.push([bankDate, bankValue, 0]);
      bankIndex++;
    } else if (brokerageDate) {
      totalAreaChartData.push([brokerageDate, 0, brokerageValue]);
      brokerageIndex++;
    } else {
      break;
    }
  }

  const totalAssets = bankTotal + brokerageFirmTotal;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="pt-[--navbar-height]">
        <PageLabel title="資產總覽" />
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard title="總資產" value={totalAssets} />
            <SummaryCard title="銀行資產" value={bankTotal} />
            <SummaryCard title="投資資產" value={brokerageFirmTotal} />
            <SummaryCard
              title="資產比例 (銀行/投資)"
              value={`${
                totalAssets ? ((bankTotal / totalAssets) * 100).toFixed(2) : 0
              }% / ${
                totalAssets
                  ? ((brokerageFirmTotal / totalAssets) * 100).toFixed(2)
                  : 0
              }%`}
              isPercentage
            />
          </div>

          {/* Pie Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <PieChartCard title="總資產分佈" data={totalPieChartData} />
            <PieChartCard title="銀行資產分佈" data={bankPieChartData} />
            <PieChartCard
              title="投資資產分佈"
              data={brokerageFirmPieChartData}
            />
          </div>

          {/* Area Charts */}
          <div className="grid grid-cols-1 gap-6">
            <AreaChartCard title="總資產趨勢" data={totalAreaChartData} />
            <AreaChartCard
              title="銀行資產趨勢"
              data={bankAreaChartData}
              options={{ colors: ["#2563eb"] }}
            />
            <AreaChartCard
              title="投資資產趨勢"
              data={brokerageFirmAreaChartData}
              options={{ colors: ["#9333ea"] }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
