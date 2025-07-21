"use client";

import {
  BankRecord,
  BankRecordType,
} from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ConditionFilter from "@/app/components/condition-filter";
import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import DurationFilter from "@/app/components/duration-filter";
import BankFormManager from "@/app/components/forms/bank-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import SummaryCard from "@/app/components/summary-card"; // Make sure to import SummaryCard
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useDeleteBankRecordMutation,
  useGetBankRecordsQuery,
  useGetBanksQuery,
} from "@/lib/features/Bank/BankApiSlice";
import { useGetUserCurrenciesQuery } from "@/lib/features/Currency/CurrencyApiSlice";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";

export default function Detail() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState<BankRecord | null>(null);

  const [startDate, setStartDate] = useState(new Date("1900-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [type, setType] = useState("default");
  const [bank, setBank] = useState("default");
  const [currency, setCurrency] = useState("default");

  const phraseMap = usePhraseMap();
  const { data: banks = [], isLoading: isLoadingBanks } = useGetBanksQuery();
  const { data: userCurrencies = [], isLoading: isLoadingUserCurrencies } =
    useGetUserCurrenciesQuery();
  const { data: bankRecords = [], isLoading: isLoadingBankRecords } =
    useGetBankRecordsQuery();
  const [deleteBankRecord] = useDeleteBankRecordMutation();
  const isLoading =
    isLoadingBanks || isLoadingUserCurrencies || isLoadingBankRecords;

  if (isLoading) return <LoadingPage />;

  const filteredBankRecords = bankRecords.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate >= startDate &&
      recordDate <= endDate &&
      (type === "default" || record.type === type) &&
      (bank === "default" || record.bank.id === bank) &&
      (currency === "default" ||
        record.bank.currency.id.toString() === currency)
    );
  });

  const typeOptions = [
    { value: "default", name: "-- 類別 --" },
    ...Object.keys(BankRecordType).map((type) => ({
      value: type,
      name: phraseMap.bankRecordType[type],
    })),
  ];

  const currencyOptions = [
    { value: "default", name: "-- 幣別 --" },
    ...userCurrencies.map((userCurrency) => ({
      value: userCurrency.currency.id.toString(),
      name: userCurrency.currency.name,
    })),
  ];

  const banksOptions = [
    { value: "default", name: "-- 金融機構 --" },
    ...banks.map((bank) => ({ value: bank.id, name: bank.name })),
  ];

  function deleteRecord(id: number) {
    const ans = window.confirm("確定要刪除此筆紀錄嗎?");
    if (ans) {
      try {
        deleteBankRecord(id).unwrap();
        window.alert("刪除成功");
      } catch {
        window.alert("伺服器錯誤，請稍後再試");
      }
    }
  }

  const titles = [
    "日期",
    "類別",
    "金融機構",
    "金額",
    "幣別",
    "手續費",
    "備註",
    "功能",
  ];

  let totalDeposit = 0,
    totalWithdrawal = 0;
  const tableContent = filteredBankRecords.map((record) => {
    if (
      record.type === BankRecordType.DEPOSIT ||
      record.type === BankRecordType.TRANSFERIN
    ) {
      totalDeposit += record.amount;
    } else {
      totalWithdrawal += record.amount;
    }

    return (
      <tr key={record.id} className="border-b hover:bg-gray-100">
        <td className={styles["table-data-cell"]}>{record.date}</td>
        <td className={styles["table-data-cell"]}>
          {phraseMap.bankRecordType[record.type]}
        </td>
        <td className={styles["table-data-cell"]}>{record.bank.name}</td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          {record.amount}
        </td>
        <td className={styles["table-data-cell"]}>
          {record.bank.currency.name}
        </td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          {record.charge}
        </td>
        <td className={styles["table-data-cell"]}>{record.note}</td>
        <td className={styles["table-data-cell"]}>
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 mx-1"
            onClick={() => {
              setFormData(record);
              setShowUpdateForm(!showUpdateForm);
            }}
          >
            修改
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors duration-200 mx-1"
            onClick={() => deleteRecord(record.id)}
          >
            刪除
          </button>
        </td>
      </tr>
    );
  });

  const netChange = totalDeposit - totalWithdrawal;

  return (
    <main className="pt-[--navbar-height] pb-5">
      <PageLabel title={"金融機構:明細"} />
      <div className="h-[80vh] w-full flex flex-col items-center pt-2">
        <DurationFilter
          startDate={{ data: startDate, setData: setStartDate }}
          endDate={{ data: endDate, setData: setEndDate }}
        />

        <div className="w-[60vw] my-2 flex flex-wrap items-center justify-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <ConditionFilter options={typeOptions} setFilter={setType} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <ConditionFilter
              options={currencyOptions}
              setFilter={setCurrency}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <ConditionFilter options={banksOptions} setFilter={setBank} />
          </div>
        </div>

        {/* Summary Cards Section for Bank Records */}
        <div className="w-[90vw] grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="總存入"
            value={totalDeposit}
            className="bg-green-100 border border-green-200 text-green-700"
          />
          <SummaryCard
            title="總提領"
            value={totalWithdrawal}
            className="bg-red-100 border border-red-200 text-red-700"
          />
          <SummaryCard
            title="期間淨額" // Changed title to reflect "net change" for the period
            value={netChange}
            className="bg-blue-100 border border-blue-200 text-blue-700"
          />
        </div>
        {/* --- */}

        <div className="w-[90vw] max-h-[60vh] overflow-auto">
          <DetailTable titles={titles} tableContent={tableContent} />
        </div>
        <BankFormManager
          updateShowState={{
            isShow: showUpdateForm,
            setShow: setShowUpdateForm,
          }}
          formData={formData}
        />
      </div>
    </main>
  );
}
