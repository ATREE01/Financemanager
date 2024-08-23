"use client";

import { useState } from "react";
import { Chart } from "react-google-charts";

import ConditionFilter from "@/app/components/condition-filter";
import DurationFilter from "@/app/components/duration-filter";
import PageLabel from "@/app/components/page-label";
import { useUserCurrencies } from "@/lib/features/Currency/CurrencySlice";
import { useIncExpRecords } from "@/lib/features/IncExp/IncExpSlice";

export default function DashboardIncExp() {
  const pieChartOptions = {
    legend: { position: "top", maxLines: 3 },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
  };

  const [currency, setCurrency] = useState("1");
  const [startDate, setStartDate] = useState(new Date("1900-01-01"));
  const [endDate, setEndDate] = useState(new Date());

  const userCurrencies = useUserCurrencies();
  const currencyOptions = [
    ...userCurrencies.map((userCurrency) => ({
      value: userCurrency.id.toString(),
      name: userCurrency.currency.name,
    })),
  ];

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

  const categorySum = {
    income: incExpRecords.reduce(
      (acc, record) => {
        if (record.type === "income")
          acc[record.category.name] =
            acc[record.category.name] + record.amount || record.amount;
        return acc;
      },
      {} as { [key: string]: number },
    ),
    expense: incExpRecords.reduce(
      (acc, record) => {
        if (record.type === "expense")
          acc[record.category.name] =
            acc[record.category.name] + record.amount || record.amount;
        return acc;
      },
      {} as { [key: string]: number },
    ),
  };

  for (const key in categorySum.income)
    incSumData.push([key, categorySum.income[key]]);

  for (const key in categorySum.expense)
    expSumData.push([key, categorySum.expense[key]]);

  return (
    <main className="bg-slate-100 pt-[--navbar-height]">
      <PageLabel title={"收支紀錄:總覽"} />
      <div className="text-black">
        <div className="w-full flex flex-col items-center">
          <div>
            <div className="w-60 h-16">
              <ConditionFilter
                options={currencyOptions}
                setFilter={setCurrency}
              />
            </div>
          </div>

          <DurationFilter
            startDate={{ data: startDate, setData: setStartDate }}
            endDate={{ data: endDate, setData: setEndDate }}
          />

          <div className="pie-chart-container flex flex-wrap justify-center m-4 text-center">
            <div className="DIE-pie-chart-block w-96 h-[50vh]">
              <div className="text-3xl font-bold text-center">收入</div>
              <Chart
                chartType="PieChart"
                data={incSumData}
                options={pieChartOptions}
                width={"25rem"}
                height={"50vh"}
              />
            </div>
            <div className="DIE-pie-chart-block w-96 h-[50vh]">
              <div className="text-3xl font-bold text-center">支出</div>
              <Chart
                chartType="PieChart"
                data={expSumData}
                options={pieChartOptions}
                width={"25rem"}
                height={"50vh"}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
