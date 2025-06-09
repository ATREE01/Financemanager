"use client";

import { IncExpRecordType } from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

import ConditionFilter from "@/app/components/condition-filter";
import DurationFilter from "@/app/components/duration-filter";
import IncExpFormManager from "@/app/components/forms/inc-exp-form-manager";
import PageLabel from "@/app/components/page-label";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useUserCurrencies } from "@/lib/features/Currency/CurrencySlice";
import { useIncExpRecords } from "@/lib/features/IncExp/IncExpSlice";

export default function Dashboard() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [userId]);

  const pieChartOptions = {
    title: "",
    legend: {
      position: "top",
      alignment: "center",
      maxLines: 3,
      textStyle: {
        color: "#333",
        fontSize: 12,
      },
    },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
    chartArea: { left: 10, top: 50, width: "100%", height: "75%" },
    fontSize: 12,
    tooltip: { isHtml: true },
    is3D: false,
  };

  const [currency, setCurrency] = useState("1");
  const [startDate, setStartDate] = useState(new Date("1900-01-01"));
  const [endDate, setEndDate] = useState(new Date());

  const userCurrencies = useUserCurrencies();
  const currencyOptions = [
    ...userCurrencies.map((userCurrency) => ({
      value: userCurrency.currency.id.toString(),
      name: userCurrency.currency.name,
    })),
  ];

  let incSumValue = 0,
    expSumValue = 0;
  const incSumData: Array<Array<string | number>> = [["Category", "Amount"]];
  const expSumData: Array<Array<string | number>> = [["Category", "Amount"]];

  const incExpRecords = useIncExpRecords().filter((record) => {
    const recordDate = new Date(record.date);
    return (
      startDate <= recordDate &&
      recordDate <= endDate &&
      record.currency.id.toString() === currency
    );
  });

  // TODO: add the sum of charge.
  const categorySum = {
    income: incExpRecords.reduce(
      (acc, record) => {
        if (record.type === IncExpRecordType.INCOME)
          acc[record.category.name] =
            acc[record.category.name] + record.amount || record.amount;
        return acc;
      },
      {} as { [key: string]: number },
    ),
    expense: incExpRecords.reduce(
      (acc, record) => {
        if (record.type === IncExpRecordType.EXPENSE)
          acc[record.category.name] =
            acc[record.category.name] + record.amount || record.amount;
        return acc;
      },
      {} as { [key: string]: number },
    ),
  };

  for (const key in categorySum.income) {
    incSumValue += categorySum.income[key];
    incSumData.push([key, categorySum.income[key]]);
  }

  for (const key in categorySum.expense) {
    expSumValue += categorySum.expense[key];
    expSumData.push([key, categorySum.expense[key]]);
  }

  return (
    <main className="bg-slate-100 pt-[--navbar-height] min-h-screen">
      <PageLabel title={"收支紀錄:總覽"} />

      <div className="w-full h-full flex flex-col items-center text-black">
        <div className="w-60 h-16 flex items-center">
          <ConditionFilter options={currencyOptions} setFilter={setCurrency} />
        </div>

        <div className="w-full max-w-7xl px-4">
          <DurationFilter
            startDate={{ data: startDate, setData: setStartDate }}
            endDate={{ data: endDate, setData: setEndDate }}
          />
        </div>

        {/* Summary Cards */}
        <div className="w-full max-w-[80vw] sm:max-w-[90vw] px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
              <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">
                收入
              </div>
              <div className="text-base sm:text-lg font-semibold text-green-600 mb-2">
                ${incSumValue.toLocaleString()}
              </div>
              <div className="h-[25vh] sm:h-[35vh]">
                <Chart
                  chartType="PieChart"
                  data={incSumData}
                  options={pieChartOptions}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
              <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">
                支出
              </div>
              <div className="text-base sm:text-lg font-semibold text-red-600 mb-2">
                ${expSumValue.toLocaleString()}
              </div>
              <div>
                <div className="h-[25vh] sm:h-[35vh]">
                  <Chart
                    chartType="PieChart"
                    data={expSumData}
                    options={pieChartOptions}
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <IncExpFormManager updateShowState={null} />
      </div>
    </main>
  );
}
