"use client";

import {
  IncExpMethodType,
  IncExpRecord,
  IncExpRecordType,
} from "@financemanager/financemanager-website-types";
import { ColumnDef } from "@tanstack/react-table";
import { startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import ConditionFilter from "@/app/components/condition-filter";
import { DataTable } from "@/app/components/data-table";
import DurationFilter from "@/app/components/duration-filter";
import IncExpFormManager from "@/app/components/forms/inc-exp-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import SummaryCard from "@/app/components/summary-card";
import { Button } from "@/components/ui/button";
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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState(new Date());
  const [type, setType] = useState("default");
  const [category, setCategory] = useState("default");
  const [currency, setCurrency] = useState("default");
  const [method, setMethod] = useState("default");
  const [bank, setBank] = useState("default");
  const [formData, setFormData] = useState<IncExpRecord | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [deleteIncExpRecord] = useDeleteIncExpRecordMutation();

  const deleteRecord = useCallback(
    async (id: number) => {
      const ans = window.confirm("確定要刪除此筆紀錄嗎?");
      if (ans) {
        try {
          await deleteIncExpRecord(id).unwrap();
          window.alert("刪除成功");
        } catch {
          window.alert("伺服器錯誤，請稍後再試");
        }
      }
    },
    [deleteIncExpRecord],
  );

  const phraseMap = usePhraseMap();
  const { data: incExpRecords, isLoading: incExpLoading } =
    useGetIncExpRecordsQuery();

  const filteredIncExpRecords = useMemo(() => {
    const start = startDate ? startOfDay(startDate) : null;
    const end = endDate ? startOfDay(endDate) : null;
    return (incExpRecords || []).filter((record) => {
      const recordDate = startOfDay(new Date(record.date));
      return (
        (!start || recordDate >= start) &&
        (!end || recordDate <= end) &&
        (type === "default" || record.type === type) &&
        (category === "default" || record.category.id === category) &&
        (currency === "default" ||
          record.currency.id.toString() === currency) &&
        (method === "default" || record.method === method) &&
        (bank === "default" || record.bank?.id === bank)
      );
    });
  }, [
    incExpRecords,
    startDate,
    endDate,
    type,
    category,
    currency,
    method,
    bank,
  ]);

  // Calculate totals
  let totalIncome = 0,
    totalExpense = 0;

  filteredIncExpRecords.forEach((record) => {
    if (record.type === IncExpRecordType.INCOME) {
      totalIncome += record.amount;
    } else {
      totalExpense += record.amount;
    }
  });

  const netAmount = totalIncome - totalExpense;

  const { data: banks = [], isLoading: bankIsLoading } = useGetBanksQuery();
  const { data: userCurrencies = [], isLoading: userCurrenciesIsLoading } =
    useGetUserCurrenciesQuery();
  const { data: categories, isLoading: categoriesIsLoading } =
    useGetCategoriesQuery();

  const columns = useMemo<ColumnDef<IncExpRecord>[]>(
    () => [
      { accessorKey: "date", header: "日期" },
      {
        accessorKey: "type",
        header: "類別",
        cell: ({ row }) =>
          phraseMap?.type?.[row.original.type] || row.original.type,
      },
      { accessorKey: "category.name", header: "種類" },
      {
        accessorKey: "amount",
        header: "金額",
        cell: ({ row }) => (
          <span
            className={
              row.original.type === IncExpRecordType.INCOME
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {row.original.amount}
          </span>
        ),
      },
      { accessorKey: "currency.name", header: "幣別" },
      {
        accessorKey: "method",
        header: "方法",
        cell: ({ row }) =>
          phraseMap?.method?.[row.original.method] || row.original.method,
      },
      {
        accessorKey: "bank.name",
        header: "金融機構",
        cell: ({ row }) => row.original.bank?.name || "-",
      },
      {
        accessorKey: "charge",
        header: "手續費",
        cell: ({ row }) => row.original.charge || "-",
      },
      {
        accessorKey: "note",
        header: "備註",
        cell: ({ row }) => row.original.note || "-",
      },
      {
        id: "actions",
        header: "功能",
        cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => {
                setFormData(row.original);
                setShowUpdateForm(true);
              }}
            >
              修改
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
              onClick={() => deleteRecord(row.original.id)}
            >
              刪除
            </Button>
          </div>
        ),
      },
    ],
    [deleteRecord, phraseMap],
  );

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
    categoriesIsLoading ||
    incExpLoading ||
    !categories ||
    !phraseMap.type
  )
    return <LoadingPage />;

  return (
    <main className="pt-[--navbar-height] pb-8 bg-gray-50 min-h-screen">
      <PageLabel title={"收支紀錄:明細"} />
      <div className="pt-4 w-full flex flex-col justify-start items-center">
        <div className="w-full max-w-7xl px-4">
          <DurationFilter
            startDate={{ data: startDate, setData: setStartDate }}
            endDate={{ data: endDate, setData: setEndDate }}
          />
        </div>
        <div className="w-[90vw] max-w-7xl  md:w-[60vw] my-4 flex flex-wrap items-center justify-center gap-3">
          <ConditionFilter
            className="flex-1 min-w-[120px]"
            options={typeOptions}
            value={type}
            setFilter={setType}
          />
          <ConditionFilter
            className="flex-1 min-w-[120px]"
            options={categoryOptions}
            value={category}
            setFilter={setCategory}
          />
          <ConditionFilter
            className="flex-1 min-w-[120px]"
            options={currencyOptions}
            value={currency}
            setFilter={setCurrency}
          />
          <ConditionFilter
            className="flex-1 min-w-[120px]"
            options={methodOptions}
            value={method}
            setFilter={setMethod}
          />
          <ConditionFilter
            className="flex-1 min-w-[120px]"
            options={banksOptions}
            value={bank}
            setFilter={setBank}
          />
        </div>

        {/* Summary Cards Section */}
        <div className="w-[90vw] max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard
            title="期間總收入"
            value={totalIncome}
            className="bg-green-50 border-green-200 text-green-700 shadow-sm"
          />
          <SummaryCard
            title="期間總支出"
            value={totalExpense}
            className="bg-red-50 border-red-200 text-red-700 shadow-sm"
          />
          <SummaryCard
            title="期間淨額"
            value={netAmount}
            className="bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
          />
        </div>

        <div className="w-[90vw] max-w-7xl">
          <DataTable columns={columns} data={filteredIncExpRecords} />
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
