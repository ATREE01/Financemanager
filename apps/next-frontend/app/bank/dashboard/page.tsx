"use client";

import {
  BankRecordType,
  CurrencyTransactionRecordType,
  IncExpRecordType,
} from "@financemanager/financemanager-website-types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import AreaChartCard from "@/app/components/area-chart-card";
import { DataTable } from "@/app/components/data-table";
import BankFormManager from "@/app/components/forms/bank-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import PieChartCard from "@/app/components/pie-chart-card";
import SummaryCard from "@/app/components/summary-card";
import TimeRangeFilter, {
  filterDataByTimeRange,
  TimeRange,
} from "@/app/components/time-range-filter";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useGetBankhistoryDataQuery,
  useGetBankRecordsQuery,
  useGetBanksQuery,
  useGetTimeDepositRecordsQuery,
} from "@/lib/features/Bank/BankApiSlice";
import { useGetCurrencyTransactionRecordsQuery } from "@/lib/features/Currency/CurrencyApiSlice";
import { useGetFinIncExpRecordsQuery } from "@/lib/features/IncExp/IncExpApiSlice";
import {
  useGetStockBundleSellRecordsQuery,
  useGetStockBuyRecordsQuery,
} from "@/lib/features/stock/StockApiSlice";

type BankData = {
  total: number;
  timeDeposit: number;
  income: number;
  expense: number;
  deposit: number;
  withdraw: number;
  transferIn: number;
  transferOut: number;
  invt: number;
  charge: number;
  buy: number;
  sell: number;
};

type TableArrayItem = {
  id: string;
  name: string;
  currencyName: string;
} & BankData;

const DashboardBank = () => {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const [timeRange, setTimeRange] = useState<TimeRange>("1Y");

  const { data: banks, isLoading: isLoadingBanks } = useGetBanksQuery();
  const { data: finIncExpRecords, isLoading: isLoadingFinIncExp } =
    useGetFinIncExpRecordsQuery();
  const { data: bankRecords, isLoading: isLoadingBankRecords } =
    useGetBankRecordsQuery();
  const { data: stockBuyRecords, isLoading: isLoadingStockBuy } =
    useGetStockBuyRecordsQuery();
  const { data: stockBundleSellRecords, isLoading: isLoadingStockSell } =
    useGetStockBundleSellRecordsQuery();
  const { data: timeDepositRecords, isLoading: isLoadingTimeDeposit } =
    useGetTimeDepositRecordsQuery();
  const { data: bankHistoryData, isLoading: isLoadingBankHistory } =
    useGetBankhistoryDataQuery();
  const {
    data: currencyTransactionRecords,
    isLoading: isLoadingCurrencyTrans,
  } = useGetCurrencyTransactionRecordsQuery();

  const isLoading =
    isLoadingBanks ||
    isLoadingFinIncExp ||
    isLoadingBankRecords ||
    isLoadingStockBuy ||
    isLoadingStockSell ||
    isLoadingTimeDeposit ||
    isLoadingBankHistory ||
    isLoadingCurrencyTrans;

  const { summaryData, bankChartData, tableDataArray } = useMemo(() => {
    const data: { [key: string]: BankData } = {};

    let totalAssets = 0;
    let totalTimeDeposit = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    const chartData: Array<Array<string | number>> = [["bank", "amount"]];
    const monthlyData: {
      [key: string]: { income: number; expense: number };
    } = {};

    if (!banks)
      return {
        summaryData: {
          totalAssets,
          totalTimeDeposit,
          totalIncome,
          totalExpense,
        },
        bankChartData: chartData,
        tableDataArray: [],
      };
    banks.forEach((bank) => {
      data[bank.id] = {
        total: 0,
        timeDeposit: 0,
        income: 0,
        expense: 0,
        deposit: 0,
        withdraw: 0,
        transferIn: 0,
        transferOut: 0,
        invt: 0,
        charge: 0,
        buy: 0,
        sell: 0,
      };
    });

    timeDepositRecords?.forEach((record) => {
      const bankId = record.bank.id;
      const today = new Date().toISOString().split("T")[0];
      if (record.startDate > today || record.endDate <= today) return;
      data[bankId].timeDeposit += record.amount;
      data[bankId].total -= record.amount;
    });

    stockBundleSellRecords?.forEach((record) => {
      const bankId = record.bank.id;
      data[bankId].invt += Number(record.amount);
      data[bankId].total += Number(record.amount);
    });

    stockBuyRecords?.forEach((record) => {
      const bankId = record.bank.id;
      data[bankId].invt -= Number(record.amount);
      data[bankId].total -= Number(record.amount);
    });

    bankRecords?.forEach((record) => {
      const bankId = record.bank.id;
      const { amount, charge = 0, type } = record;

      data[bankId].charge += charge ?? 0;
      data[bankId].total -= charge ?? 0;

      const isIncoming =
        type === BankRecordType.DEPOSIT || type === BankRecordType.TRANSFERIN;
      const multiplier = isIncoming ? 1 : -1;

      data[bankId].total += amount * multiplier;

      switch (type) {
        case BankRecordType.DEPOSIT:
          data[bankId].deposit += amount;
          break;
        case BankRecordType.TRANSFERIN:
          data[bankId].transferIn += amount;
          break;
        case BankRecordType.WITHDRAW:
          data[bankId].withdraw += amount;
          break;
        case BankRecordType.TRANSFEROUT:
          data[bankId].transferOut += amount;
          break;
      }
    });

    finIncExpRecords?.forEach((record) => {
      const bankId = record.bank?.id as string;
      if (!bankId || !data[bankId]) return;
      const bank = banks.find((b) => b.id === bankId);
      const exchangeRate = bank?.currency.exchangeRate ?? 1;

      // Process monthly data
      const month = record.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      switch (record.type) {
        case IncExpRecordType.INCOME:
          data[bankId].total += record.amount;
          data[bankId].income += record.amount;
          monthlyData[month].income += record.amount * exchangeRate;
          break;
        case IncExpRecordType.EXPENSE:
          data[bankId].total -= record.amount + (record.charge ?? 0);
          data[bankId].expense += record.amount;
          data[bankId].charge += record.charge ?? 0;
          monthlyData[month].expense += record.amount * exchangeRate;
          break;
      }
    });

    currencyTransactionRecords?.forEach((record) => {
      const fromBankId = record.fromBank?.id as string;
      const toBankId = record.toBank?.id as string;
      if (!fromBankId || !toBankId || !data[fromBankId] || !data[toBankId])
        return;
      switch (record.type) {
        case CurrencyTransactionRecordType.ONLINE:
          data[fromBankId].sell += record.fromAmount;
          data[fromBankId].total -= record.fromAmount;
          data[toBankId].buy += record.toAmount;
          data[toBankId].total += record.toAmount;
          break;
      }
    });

    const tableArray: TableArrayItem[] = [];

    // Calculate summary data and chart data
    banks.forEach((bank) => {
      const bankInfo = data[bank.id];
      if (bankInfo) {
        const exchangeRate = bank.currency.exchangeRate;
        totalAssets += (bankInfo.total + bankInfo.timeDeposit) * exchangeRate;
        totalTimeDeposit += bankInfo.timeDeposit * exchangeRate;
        totalIncome += bankInfo.income * exchangeRate;
        totalExpense += bankInfo.expense * exchangeRate;

        // Chart data
        if (bankInfo.total + bankInfo.timeDeposit >= 0) {
          chartData.push([
            bank.name,
            (bankInfo.total + bankInfo.timeDeposit) * exchangeRate,
          ]);
        }

        tableArray.push({
          id: bank.id,
          name: bank.name,
          currencyName: bank.currency.name,
          ...bankInfo,
        });
      }
    });

    return {
      summaryData: {
        totalAssets,
        totalTimeDeposit,
        totalIncome,
        totalExpense,
      },
      bankChartData: chartData,
      tableDataArray: tableArray,
    };
  }, [
    banks,
    timeDepositRecords,
    stockBundleSellRecords,
    stockBuyRecords,
    bankRecords,
    finIncExpRecords,
    currencyTransactionRecords,
  ]);
  const bankAreaChartData = useMemo(() => {
    return [
      ["Date", "總額"],
      ...(bankHistoryData || []).map((data) => [data.date, data.value]),
    ];
  }, [bankHistoryData]);

  const columns = useMemo<ColumnDef<TableArrayItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "銀行名稱",
        cell: ({ row }) => (
          <span className="font-bold">{row.original.name}</span>
        ),
      },
      { accessorKey: "currencyName", header: "幣別" },
      {
        accessorKey: "total",
        header: "現有金額",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600">
            {Number(row.original.total)}
          </span>
        ),
      },
      {
        accessorKey: "timeDeposit",
        header: "定存",
        cell: ({ row }) => Number(row.original.timeDeposit),
      },
      {
        accessorKey: "income",
        header: "收入",
        cell: ({ row }) => (
          <span className="text-green-600">{Number(row.original.income)}</span>
        ),
      },
      {
        accessorKey: "expense",
        header: "支出",
        cell: ({ row }) => (
          <span className="text-red-600">{Number(row.original.expense)}</span>
        ),
      },
      {
        accessorKey: "deposit",
        header: "存款",
        cell: ({ row }) => Number(row.original.deposit),
      },
      {
        accessorKey: "withdraw",
        header: "提款",
        cell: ({ row }) => Number(row.original.withdraw),
      },
      {
        accessorKey: "transferIn",
        header: "轉入",
        cell: ({ row }) => Number(row.original.transferIn),
      },
      {
        accessorKey: "transferOut",
        header: "轉出",
        cell: ({ row }) => Number(row.original.transferOut),
      },
      {
        accessorKey: "invt",
        header: "證券金額",
        cell: ({ row }) => Number(row.original.invt),
      },
      {
        accessorKey: "charge",
        header: "手續費",
        cell: ({ row }) => Number(row.original.charge),
      },
      {
        accessorKey: "buy",
        header: "買入",
        cell: ({ row }) => Number(row.original.buy),
      },
      {
        accessorKey: "sell",
        header: "賣出",
        cell: ({ row }) => Number(row.original.sell),
      },
    ],
    [],
  );

  if (isLoading) return <LoadingPage />;

  const filteredBankAreaChartData = filterDataByTimeRange(
    bankAreaChartData,
    timeRange,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-5">
      <div className="pt-[--navbar-height]">
        <PageLabel title="金融機構總覽" />
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <SummaryCard
              className="bg-purple-100 border-purple-200 text-purple-800"
              title="總資產"
              value={summaryData.totalAssets}
            />
            <SummaryCard title="總定存" value={summaryData.totalTimeDeposit} />
            <SummaryCard
              className="bg-green-100 border-green-200 text-green-700"
              title="總收入"
              value={summaryData.totalIncome}
            />
            <SummaryCard
              className="bg-red-100 border-red-200 text-red-700"
              title="總支出"
              value={summaryData.totalExpense}
            />
          </div>

          <div className="flex w-full justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">歷史資產趨勢</h2>
            <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
          </div>

          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <AreaChartCard
              title="資產變化圖"
              data={filteredBankAreaChartData}
              height="350px"
              options={{ isStacked: false, colors: ["#2563eb"] }}
            />
            <PieChartCard
              title="資產分布 (台幣)"
              data={bankChartData}
              height="350px"
            />
          </div>

          <div className="w-full">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              銀行明細
            </h3>
            <DataTable columns={columns} data={tableDataArray} />
          </div>
          <BankFormManager updateShowState={null} />
        </div>
      </div>
    </div>
  );
};

export default DashboardBank;
