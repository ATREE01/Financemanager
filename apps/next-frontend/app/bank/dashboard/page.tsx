"use client";

import {
  BankRecordType,
  CurrencyTransactionRecordType,
  IncExpRecordType,
} from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Chart from "react-google-charts";

import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import BankFormManager from "@/app/components/forms/bank-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
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

const DashboardBank = () => {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const pieChartOptions = {
    legend: { position: "top", maxLines: 3 },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
  };

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

  const { data: banks } = useGetBanksQuery();
  const { data: finIncExpRecords } = useGetFinIncExpRecordsQuery();
  const { data: bankRecords } = useGetBankRecordsQuery();
  const { data: stockBuyRecords } = useGetStockBuyRecordsQuery();
  const { data: stockBundleSellRecords } = useGetStockBundleSellRecordsQuery();
  const { data: timeDepositRecords } = useGetTimeDepositRecordsQuery();
  const { data: currencyTransactionRecords } =
    useGetCurrencyTransactionRecordsQuery();
  // this record only contains income expense record with method equals to finance
  if (
    !banks ||
    !finIncExpRecords ||
    !bankRecords ||
    !stockBuyRecords ||
    !stockBundleSellRecords ||
    !timeDepositRecords ||
    !currencyTransactionRecords
  )
    return <LoadingPage />;

  // inv record sum
  // this buy and sell here is about foreign exchange

  const bankData: {
    [key: string]: {
      [key: string]: number;
    };
  } = {};
  banks.forEach((bank) => {
    bankData[bank.id] = {
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

  timeDepositRecords.forEach((record) => {
    const bankId = record.bank.id;
    const today = new Date().toISOString().split("T")[0];
    if (record.startDate > today || record.endDate <= today) return;
    bankData[bankId].timeDeposit += record.amount;
    bankData[bankId].total -= record.amount;
  });

  stockBundleSellRecords.forEach((record) => {
    const bankId = record.bank.id;
    bankData[bankId].invt += Number(record.amount);
    bankData[bankId].total += Number(record.amount);
  });

  stockBuyRecords.forEach((record) => {
    const bankId = record.bank.id;
    bankData[bankId].invt -= Number(record.amount);
    bankData[bankId].total -= Number(record.amount);
  });
  bankRecords.forEach((record) => {
    const bankId = record.bank.id;
    const { amount, charge = 0, type } = record;

    bankData[bankId].charge += charge ?? 0;
    bankData[bankId].total -= charge ?? 0;

    const isIncoming =
      type === BankRecordType.DEPOSIT || type === BankRecordType.TRANSFERIN;
    const multiplier = isIncoming ? 1 : -1;

    bankData[bankId].total += amount * multiplier;

    switch (type) {
      case BankRecordType.DEPOSIT:
        bankData[bankId].deposit += amount;
        break;
      case BankRecordType.TRANSFERIN:
        bankData[bankId].transferIn += amount;
        break;
      case BankRecordType.WITHDRAW:
        bankData[bankId].withdraw += amount;
        break;
      case BankRecordType.TRANSFEROUT:
        bankData[bankId].transferOut += amount;
        break;
    }
  });

  finIncExpRecords.forEach((record) => {
    const bankId = record.bank?.id as string;
    switch (record.type) {
      case IncExpRecordType.INCOME:
        bankData[bankId].total += record.amount;
        bankData[bankId].income += record.amount;
        break;
      case IncExpRecordType.EXPENSE:
        bankData[bankId].total -= record.amount + (record.charge ?? 0);
        bankData[bankId].expense += record.amount;
        bankData[bankId].charge += record.charge ?? 0;
        break;
    }
  });

  currencyTransactionRecords.forEach((record) => {
    const fromBankId = record.fromBank?.id as string;
    const toBankId = record.toBank?.id as string;
    switch (record.type) {
      case CurrencyTransactionRecordType.ONLINE:
        bankData[fromBankId].sell += record.fromAmount;
        bankData[fromBankId].total -= record.fromAmount;
        bankData[toBankId].buy += record.toAmount;
        bankData[toBankId].total += record.toAmount;
        break;
    }
  });

  const bankChartData: Array<Array<string | number>> = [["bank", "amount"]];
  const tableContent = banks.map((bank) => {
    if (bankData[bank.id].total + bankData[bank.id].timeDeposit >= 0)
      bankChartData.push([
        bank.name,
        (bankData[bank.id].total + bankData[bank.id].timeDeposit) *
          bank.currency.exchangeRate,
      ]);
    return (
      <tr key={bank.id} className="border-b hover:bg-gray-100">
        <td className={styles["table-data-cell"]}>{bank.name}</td>
        <td className={styles["table-data-cell"]}>{bank.currency.name}</td>
        {tableValues.map((value) => (
          <td key={value} className={styles["table-data-cell"]}>
            {bankData[bank.id][value]}
          </td>
        ))}
      </tr>
    );
  });

  return (
    <div className="pt-[--navbar-height] py-5 min-h-screen">
      <PageLabel title={"金融機構:總覽"} />
      <div className="mt-4 px-10 max-h-full flex flex-wrap justify-center">
        <div className="text-center text-black">
          <div className="text-3xl font-bold">資產分布(台)</div>
          <Chart
            chartType="PieChart"
            data={bankChartData}
            options={pieChartOptions}
            width={"20rem"}
            height={"20rem"}
          />
        </div>
        <div className="flex-1 min-w-[50vw] flex flex-col items-center overflow-auto">
          <DetailTable titles={titles} tableContent={tableContent} />
        </div>
        <BankFormManager updateShowState={null} />
      </div>
    </div>
  );
};

export default DashboardBank;
