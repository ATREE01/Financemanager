"use client";

import {
  BankRecord,
  BankRecordType,
} from "@financemanager/financemanager-website-types";
import { ColumnDef } from "@tanstack/react-table";
import { startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import ConditionFilter from "@/app/components/condition-filter";
import { DataTable } from "@/app/components/data-table";
import DurationFilter from "@/app/components/duration-filter";
import BankFormManager from "@/app/components/forms/bank-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import SummaryCard from "@/app/components/summary-card";
import { Button } from "@/components/ui/button";
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

  const [startDate, setStartDate] = useState<Date | null>(null);
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
    isLoadingBanks ||
    isLoadingUserCurrencies ||
    isLoadingBankRecords ||
    !phraseMap.bankRecordType;

  const filteredBankRecords = useMemo(() => {
    const start = startDate ? startOfDay(startDate) : null;
    const end = endDate ? startOfDay(endDate) : null;
    return bankRecords.filter((record) => {
      const recordDate = startOfDay(new Date(record.date));

      // 3. Date 物件在經過 startOfDay 統一天平後，可以直接用 >= 和 <= 進行精準的日期比較
      return (
        (!start || recordDate >= start) &&
        (!end || recordDate <= end) && // 加上 !end 判斷更安全
        (type === "default" || record.type === type) &&
        (bank === "default" || record.bank.id === bank) &&
        (currency === "default" ||
          record.bank.currency.id.toString() === currency)
      );
    });
  }, [bankRecords, startDate, endDate, type, bank, currency]);

  let totalDeposit = 0,
    totalWithdrawal = 0;

  filteredBankRecords.forEach((record) => {
    if (
      record.type === BankRecordType.DEPOSIT ||
      record.type === BankRecordType.TRANSFERIN
    ) {
      totalDeposit += record.amount;
    } else {
      totalWithdrawal += record.amount;
    }
  });

  const netChange = totalDeposit - totalWithdrawal;

  const deleteRecord = useCallback(
    async (id: number) => {
      const ans = window.confirm("確定要刪除此筆紀錄嗎?");
      if (ans) {
        try {
          await deleteBankRecord(id).unwrap();
          window.alert("刪除成功");
        } catch {
          window.alert("伺服器錯誤，請稍後再試");
        }
      }
    },
    [deleteBankRecord],
  );

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

  const columns = useMemo<ColumnDef<BankRecord>[]>(
    () => [
      { accessorKey: "date", header: "日期" },
      {
        accessorKey: "type",
        header: "類別",
        cell: ({ row }) =>
          phraseMap?.bankRecordType?.[row.original.type] || row.original.type,
      },
      { accessorKey: "bank.name", header: "金融機構" },
      {
        accessorKey: "amount",
        header: "金額",
        cell: ({ row }) => {
          const isDeposit =
            row.original.type === BankRecordType.DEPOSIT ||
            row.original.type === BankRecordType.TRANSFERIN;
          return (
            <span
              className={
                isDeposit
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {row.original.amount}
            </span>
          );
        },
      },
      { accessorKey: "bank.currency.name", header: "幣別" },
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
    [deleteRecord, phraseMap?.bankRecordType],
  );

  if (isLoading) return <LoadingPage />;

  return (
    <main className="pt-[--navbar-height] pb-8 bg-gray-50 min-h-screen">
      <PageLabel title={"金融機構:明細"} />
      <div className="pt-4 w-full flex flex-col justify-start items-center">
        <div className="w-full max-w-7xl px-4">
          <DurationFilter
            startDate={{ data: startDate, setData: setStartDate }}
            endDate={{ data: endDate, setData: setEndDate }}
          />
        </div>
        <div className="max-w-7xl my-4 flex flex-wrap items-center justify-center gap-4 p-2">
          <div className="flex-1 min-w-[150px]">
            <ConditionFilter
              options={typeOptions}
              setFilter={setType}
              value={type}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <ConditionFilter
              options={currencyOptions}
              setFilter={setCurrency}
              value={currency}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <ConditionFilter
              options={banksOptions}
              setFilter={setBank}
              value={bank}
            />
          </div>
        </div>

        {/* Summary Cards Section for Bank Records */}
        <div className="w-[90vw] max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard
            title="期間總存入"
            value={totalDeposit}
            className="bg-green-50 border-green-200 text-green-700 shadow-sm"
          />
          <SummaryCard
            title="期間總提領"
            value={totalWithdrawal}
            className="bg-red-50 border-red-200 text-red-700 shadow-sm"
          />
          <SummaryCard
            title="期間淨額"
            value={netChange}
            className="bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
          />
        </div>
        {/* --- */}

        <div className="w-[90vw] max-w-7xl">
          <DataTable columns={columns} data={filteredBankRecords} />
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
