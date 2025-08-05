"use client";

import { IncExpRecordType } from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import AreaChartCard from "@/app/components/area-chart-card";
import ConditionFilter from "@/app/components/condition-filter";
import DurationFilter from "@/app/components/duration-filter";
import IncExpFormManager from "@/app/components/forms/inc-exp-form-manager";
import PageLabel from "@/app/components/page-label";
import PieChartCard from "@/app/components/pie-chart-card";
import SummaryCard from "@/app/components/summary-card";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useGetUserCurrenciesQuery } from "@/lib/features/Currency/CurrencyApiSlice";
import { useGetIncExpRecordsQuery } from "@/lib/features/IncExp/IncExpApiSlice";

export default function Dashboard() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const [currency, setCurrency] = useState("1");
  const [startDate, setStartDate] = useState(new Date("1900-01-01"));
  const [endDate, setEndDate] = useState(new Date());

  const { data: userCurrencies } = useGetUserCurrenciesQuery();
  const currencyOptions = [
    ...(userCurrencies || []).map((userCurrency) => ({
      value: userCurrency.currency.id.toString(),
      name: userCurrency.currency.name,
    })),
  ];

  const { data: incExpRecords } = useGetIncExpRecordsQuery();

  const {
    incSumValue,
    expSumValue,
    incSumData,
    expSumData,
    monthlyIncExpData,
  } = useMemo(() => {
    let incSumValue = 0;
    let expSumValue = 0;
    const incSumData: Array<Array<string | number>> = [["Category", "Amount"]];
    const expSumData: Array<Array<string | number>> = [["Category", "Amount"]];
    const monthlyData: {
      [key: string]: { income: number; expense: number };
    } = {};

    const filteredIncExpRecords = (incExpRecords || []).filter((record) => {
      const recordDate = new Date(record.date);
      return (
        startDate <= recordDate &&
        recordDate <= endDate &&
        record.currency.id.toString() === currency
      );
    });

    const categorySum = {
      income: filteredIncExpRecords.reduce(
        (acc, record) => {
          if (record.type === IncExpRecordType.INCOME)
            acc[record.category.name] =
              (acc[record.category.name] || 0) + record.amount;
          return acc;
        },
        {} as { [key: string]: number },
      ),
      expense: filteredIncExpRecords.reduce(
        (acc, record) => {
          if (record.type === IncExpRecordType.EXPENSE)
            acc[record.category.name] =
              (acc[record.category.name] || 0) + record.amount;
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

    incExpRecords?.forEach((record) => {
      const month = record.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      const exchangeRate = record.currency.exchangeRate;
      if (record.type === IncExpRecordType.INCOME) {
        monthlyData[month].income += record.amount * exchangeRate;
      } else {
        monthlyData[month].expense += record.amount * exchangeRate;
      }
    });

    const monthlyChartData: (string | number | null)[][] = [
      ["Month", "收入", "支出"],
    ];
    Object.keys(monthlyData)
      .sort()
      .forEach((month) => {
        monthlyChartData.push([
          month,
          monthlyData[month].income,
          monthlyData[month].expense,
        ]);
      });

    return {
      incSumValue,
      expSumValue,
      incSumData,
      expSumData,
      monthlyIncExpData: monthlyChartData,
    };
  }, [incExpRecords, startDate, endDate, currency]);

  return (
    <main className="min-h-screen bg-gray-50 py-5 pt-[--navbar-height]">
      <PageLabel title={"收支紀錄:總覽"} />

      <div className="flex w-full flex-col items-center space-y-6 pt-2">
        <ConditionFilter
          className="mb-4"
          options={currencyOptions}
          setFilter={setCurrency}
        />

        <div className="w-full max-w-7xl px-4">
          <DurationFilter
            startDate={{ data: startDate, setData: setStartDate }}
            endDate={{ data: endDate, setData: setEndDate }}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid w-[90vw] grid-cols-1 gap-4 md:grid-cols-2">
          <SummaryCard
            className="border-green-200 bg-green-100 text-green-700"
            title="總收入"
            value={incSumValue}
          />
          <SummaryCard
            className="border-red-200 bg-red-100 text-red-700"
            title="總支出"
            value={expSumValue}
          />
        </div>

        <div className="grid w-[90vw] grid-cols-1 gap-6 lg:grid-cols-2">
          <PieChartCard
            title="收入分類"
            data={incSumData}
            height={"300px"}
            options={{
              colors: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"],
            }}
          />
          <PieChartCard
            title="支出分類"
            data={expSumData}
            height={"300px"}
            options={{
              colors: ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"],
            }}
          />
        </div>
        <div className="w-[90vw]">
          <AreaChartCard
            title="收支趨勢"
            data={monthlyIncExpData}
            height={"300px"}
            options={{
              isStacked: false,
              colors: ["#10b981", "#ef4444"],
            }}
          />
        </div>
        <IncExpFormManager updateShowState={null} />
      </div>
    </main>
  );
}
