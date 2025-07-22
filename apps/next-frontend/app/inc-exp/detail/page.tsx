"use client";
import {
  IncExpMethodType,
  IncExpRecord,
  IncExpRecordType,
} from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ConditionFilter from "@/app/components/condition-filter";
import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import DurationFilter from "@/app/components/duration-filter";
import IncExpFormManager from "@/app/components/forms/inc-exp-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import SummaryCard from "@/app/components/summary-card";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useGetBanksQuery } from "@/lib/features/Bank/BankApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/Category/CategoryApiSlice";
import { useGetUserCurrenciesQuery } from "@/lib/features/Currency/CurrencyApiSlice";
import {
  useDeleteIncExpRecordMutation,
  useGetIncExpRecordsQuery,
} from "@/lib/features/IncExp/IncExpApiSlice";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";

export default function Detail() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const [startDate, setStartDate] = useState(new Date("1900-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [type, setType] = useState("default");
  const [category, setCategory] = useState("default");
  const [currency, setCurrency] = useState("default");
  const [method, setMethod] = useState("default");
  const [bank, setBank] = useState("default");
  const [formData, setFormData] = useState<IncExpRecord | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const titles = [
    "日期",
    "類別",
    "種類",
    "金額",
    "幣別",
    "方法",
    "金融機構",
    "手續費",
    "備註",
    "功能",
  ];

  const [deleteIncExpRecord] = useDeleteIncExpRecordMutation();
  async function deleteRecord(id: number) {
    const ans = window.confirm("確定要刪除此筆紀錄嗎?");
    if (ans) {
      try {
        await deleteIncExpRecord(id).unwrap();
        window.alert("刪除成功");
      } catch {
        window.alert("伺服器錯誤，請稍後再試");
      }
    }
  }

  const phraseMap = usePhraseMap();
  const { data: incExpRecords } = useGetIncExpRecordsQuery();

  const filteredIncExpRecords = (incExpRecords || []).filter((record) => {
    const recordDate = new Date(record.date);
    return (
      startDate <= recordDate &&
      recordDate <= endDate &&
      (type === "default" || record.type === type) &&
      (category === "default" || record.category.id === category) &&
      (currency === "default" || record.currency.id.toString() === currency) &&
      (method === "default" || record.method === method) &&
      (bank === "default" || record.bank?.id === bank)
    );
  });

  // Calculate totals
  let totalIncome = 0,
    totalExpense = 0;

  const { data: banks = [], isLoading: bankIsLoading } = useGetBanksQuery();
  const { data: userCurrencies = [], isLoading: userCurrenciesIsLoading } =
    useGetUserCurrenciesQuery();
  const { data: categories, isLoading: categoriesIsLoading } =
    useGetCategoriesQuery();

  const tableContent = filteredIncExpRecords.map((record) => {
    if (record.type === IncExpRecordType.INCOME) {
      totalIncome += record.amount;
    } else {
      totalExpense += record.amount;
    }

    return (
      <tr key={record.id} className="border-b hover:bg-gray-100">
        <td className={styles["table-data-cell"]}>{record.date}</td>
        <td className={`${styles["table-data-cell"]}`}>
          {phraseMap.type[record.type]}
        </td>
        <td className={styles["table-data-cell"]}>{record.category.name}</td>
        <td className={styles["table-data-cell"]}>{record.amount}</td>
        <td className={styles["table-data-cell"]}>{record.currency.name}</td>
        <td className={styles["table-data-cell"]}>
          {phraseMap.method[record.method]}
        </td>
        <td className={styles["table-data-cell"]}>
          {record.bank?.name ?? "X"}
        </td>
        <td className={styles["table-data-cell"]}>{record.charge ?? "X"}</td>
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

  const netAmount = totalIncome - totalExpense;

  const typeOptions = [
    { value: "default", name: "-- 類別 --" },
    { value: IncExpRecordType.INCOME, name: "收入" },
    { value: IncExpRecordType.EXPENSE, name: "支出" },
  ];

  const categoryOptions = useMemo(() => {
    const categoryList =
      type === IncExpRecordType.INCOME
        ? (categories?.income ?? [])
        : type === IncExpRecordType.EXPENSE
          ? (categories?.expense ?? [])
          : [...(categories?.income ?? []), ...(categories?.expense ?? [])];

    return [
      { value: "default", name: "-- 種類 --" },
      ...categoryList.map((category) => ({
        value: category.id,
        name: category.name,
      })),
    ];
  }, [type, categories]);

  const currencyOptions = [
    { value: "default", name: "-- 幣別 --" },
    ...userCurrencies.map((userCurrency) => ({
      value: userCurrency.currency.id.toString(),
      name: userCurrency.currency.name,
    })),
  ];
  const methodOptions = [
    { value: "default", name: "-- 方法 --" },
    { value: IncExpMethodType.CASH, name: "現金" },
    { value: IncExpMethodType.FINANCE, name: "金融" },
  ];
  const banksOptions = [
    { value: "default", name: "-- 金融機構 --" },
    ...banks.map((bank) => ({ value: bank.id, name: bank.name })),
  ];

  if (
    bankIsLoading ||
    userCurrenciesIsLoading ||
    !categories ||
    categoriesIsLoading
  )
    return <LoadingPage />;

  return (
    <main className="pt-[--navbar-height] pb-8">
      <PageLabel title={"收支紀錄:明細"} />
      <div className="pt-2 w-full flex flex-col justify-start items-center">
        <div className="w-full max-w-7xl px-4">
          <DurationFilter
            startDate={{ data: startDate, setData: setStartDate }}
            endDate={{ data: endDate, setData: setEndDate }}
          />
        </div>
        <div className="w-[90vw] md:w-[60vw] my-2 flex flex-wrap items-center justify-center gap-2">
          <ConditionFilter
            className="flex-1"
            options={typeOptions}
            setFilter={setType}
          />
          <ConditionFilter
            className="flex-1"
            options={categoryOptions}
            setFilter={setCategory}
          />
          <ConditionFilter
            className="flex-1"
            options={currencyOptions}
            setFilter={setCurrency}
          />
          <ConditionFilter
            className="flex-1"
            options={methodOptions}
            setFilter={setMethod}
          />
          <ConditionFilter
            className="flex-1"
            options={banksOptions}
            setFilter={setBank}
          />
        </div>
        {/* Summary Cards Section */}
        <div className="w-[90vw] grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="總收入"
            value={totalIncome}
            className="bg-green-100 border border-green-200 text-green-700"
          />
          <SummaryCard
            title="總支出"
            value={totalExpense}
            className="bg-red-100 border border-red-200 text-red-700"
          />
          <SummaryCard
            title="淨額"
            value={netAmount}
            className="bg-blue-100 border border-blue-200 text-blue-700"
          />
        </div>
        {/* --- */}

        <div className="w-[90vw] max-h-[60vh] overflow-x-auto">
          <DetailTable titles={titles} tableContent={tableContent} />
        </div>

        <IncExpFormManager
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
