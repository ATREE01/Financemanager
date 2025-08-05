"use client";

import {
  BankRecordType,
  CurrencyTransactionRecordType,
  IncExpRecordType,
} from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import AreaChartCard from "@/app/components/area-chart-card";
import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import BankFormManager from "@/app/components/forms/bank-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import PieChartCard from "@/app/components/pie-chart-card";
import SummaryCard from "@/app/components/summary-card";
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

const titles = [
  "銀行名稱",
  "幣別",
  "現有金額",
  "定存",
  "收入",
  "支出",
  "存款",
  "提款",
  "轉入",
  "轉出",
  "證券金額",
  "手續費",
  "買入",
  "賣出",
];
const tableValues = [
  "total",
  "timeDeposit",
  "income",
  "expense",
  "deposit",
  "withdraw",
  "transferIn",
  "transferOut",
  "invt",
  "charge",
  "buy",
  "sell",
];

const DashboardBank = () => {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const { data: banks } = useGetBanksQuery();
  const { data: finIncExpRecords } = useGetFinIncExpRecordsQuery();
  const { data: bankRecords } = useGetBankRecordsQuery();
  const { data: stockBuyRecords } = useGetStockBuyRecordsQuery();
  const { data: stockBundleSellRecords } = useGetStockBundleSellRecordsQuery();
  const { data: timeDepositRecords } = useGetTimeDepositRecordsQuery();
  const { data: bankHistoryData } = useGetBankhistoryDataQuery();
  const { data: currencyTransactionRecords } =
    useGetCurrencyTransactionRecordsQuery();

  const { bankData, summaryData, bankChartData } = useMemo(() => {
    const data: {
      [key: string]: {
        [key: string]: number;
      };
    } = {};

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
        bankData: data,
        summaryData: {
          totalAssets,
          totalTimeDeposit,
          totalIncome,
          totalExpense,
        },
        bankChartData: chartData,
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
      }
    });

    return {
      bankData: data,
      summaryData: {
        totalAssets,
        totalTimeDeposit,
        totalIncome,
        totalExpense,
      },
      bankChartData: chartData,
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

  if (
    !banks ||
    !finIncExpRecords ||
    !bankRecords ||
    !stockBuyRecords ||
    !stockBundleSellRecords ||
    !timeDepositRecords ||
    !bankHistoryData ||
    !currencyTransactionRecords
  )
    return <LoadingPage />;

  const tableContent = banks.map((bank) => {
    return (
      <tr key={bank.id} className="border-b hover:bg-gray-100">
        <td className={styles["table-data-cell"]}>{bank.name}</td>
        <td className={styles["table-data-cell"]}>{bank.currency.name}</td>
        {tableValues.map((value) => (
          <td key={value} className={styles["table-data-cell"]}>
            {bankData[bank.id]?.[value] ?? 0}
          </td>
        ))}
      </tr>
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-5 pt-[--navbar-height]">
      <PageLabel title="金融機構總覽" />
      <div className="flex w-full flex-col items-center space-y-6 pt-2">
        <div className="grid w-[90vw] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            className="border-purple-200 bg-purple-100 text-purple-800"
            title="總資產"
            value={summaryData.totalAssets}
          />
          <SummaryCard title="總定存" value={summaryData.totalTimeDeposit} />
          <SummaryCard
            className="border-green-200 bg-green-100 text-green-700"
            title="總收入"
            value={summaryData.totalIncome}
          />
          <SummaryCard
            className="border-red-200 bg-red-100 text-red-700"
            title="總支出"
            value={summaryData.totalExpense}
          />
        </div>
        <div className="grid w-[90vw] grid-cols-1 gap-6 lg:grid-cols-2">
          <PieChartCard
            title="資產分布 (台幣)"
            data={bankChartData}
            height={"300px"}
          />
          <AreaChartCard
            title="資產變化圖"
            data={bankAreaChartData}
            height={"300px"}
            options={{
              isStacked: false,
            }}
          />
        </div>
        <div className="w-[90vw]">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">銀行明細</h3>
          <div className="overflow-x-auto">
            <DetailTable titles={titles} tableContent={tableContent} />
          </div>
        </div>
        <BankFormManager updateShowState={null} />
      </div>
    </div>
  );
};

export default DashboardBank;
