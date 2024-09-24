"use client";

import {
  Bank,
  BankRecordType,
  CurrencyTransactionRecordType,
  IncExpRecordType,
} from "@financemanager/financemanager-webiste-types";
import Chart from "react-google-charts";

import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import BankFormManager from "@/app/components/forms/bank-form-manager";
import PageLabel from "@/app/components/page-label";
import {
  useBankRecords,
  useBanks,
  useTimeDepositRecords,
} from "@/lib/features/Bank/BankSlice";
import { useCurrencyTransactionRecord } from "@/lib/features/Currency/CurrencySlice";
import { useIncExpFinRecords } from "@/lib/features/IncExp/IncExpSlice";

const DashboardBank = () => {
  const pieChartOptions = {
    legend: { position: "top", maxLines: 3 },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
  };

  const banks = useBanks();
  const bankRecords = useBankRecords();
  // this record only contains income expense record with method equals to finance
  const incExpRecords = useIncExpFinRecords();
  const timeDepositRecords = useTimeDepositRecords();
  const currencyTransactionRecords = useCurrencyTransactionRecord();

  // inv record sum
  // dividend record sum

  // const getExchangeRate = (code) => {
  //     const result = exchangeRate.find(item => item.code === code);
  //     return result?.ExchangeRate ?? 1;
  // }

  // const getDividend = (bank_id) => {
  //     const result = dividendRecSum.filter(item => item.bank_id === bank_id).reduce((sum, item) => sum + item.amount, 0);
  //     return result;
  // };

  const bankData: {
    [key: string]: {
      [key: string]: number;
    };
  } = {};
  banks.forEach(
    (bank) =>
      (bankData[bank.id] = {
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
      }),
  );

  // this buy and sell here is about foreign exchange
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

  // TODO: many change to styles of total and timeDeposit

  bankRecords.forEach((record) => {
    const bankId = record.bank.id;
    bankData[bankId].charge += record.charge ?? 0;
    bankData[bankId].totla -= record.charge ?? 0;
    switch (record.type) {
      case BankRecordType.DEPOSIT || BankRecordType.TRANSFERIN:
        bankData[bankId].total += record.amount;
        bankData[bankId].deposit += record.amount;
        break;
      case BankRecordType.WITHDRAW || BankRecordType.TRANSFEROUT:
        bankData[bankId].total -= record.amount;
        bankData[bankId].withdraw += record.amount;
        break;
    }
  });

  incExpRecords.forEach((record) => {
    const bankId = (record.bank as Bank).id;
    switch (record.type) {
      case IncExpRecordType.INCOME:
        bankData[bankId].total += record.amount;
        bankData[bankId].income += record.amount;
        break;
      case IncExpRecordType.EXPENSE:
        bankData[bankId].total -= record.amount;
        bankData[bankId].expense += record.amount;
        bankData[bankId].charge += record.charge as number;
        break;
    }
  });

  timeDepositRecords.forEach((record) => {
    const bankId = record.bank.id;
    bankData[bankId].timeDeposit += record.amount;
    bankData[bankId].total -= record.amount;
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

  // TODO: need to multiply exchange rate
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
    <div className="pt-[--navbar-height] bg-slate-100 py-5 min-h-screen">
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
