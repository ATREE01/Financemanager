"use client";

import { CurrencyTransactionRecord } from "@financemanager/financemanager-website-types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DataTable } from "@/app/components/data-table";
import CurrenyTransactionFormManager from "@/app/components/forms/currency-transaction-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import { Button } from "@/components/ui/button";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useDeleteCurrencyTransactionRecordMutation,
  useGetCurrencyTransactionRecordsQuery,
} from "@/lib/features/Currency/CurrencyApiSlice";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";

export default function CurrencyTransaction() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const { data: currencyTransactionRecords, isLoading } =
    useGetCurrencyTransactionRecordsQuery();
  const phraseMap = usePhraseMap();

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState<CurrencyTransactionRecord>();

  const [deleteCurrencyTransactionRecord] =
    useDeleteCurrencyTransactionRecordMutation();

  async function deleteRecord(id: number) {
    const ans = window.confirm("確定要刪除此筆紀錄嗎?");
    if (ans) {
      try {
        await deleteCurrencyTransactionRecord(id).unwrap();
        window.alert("刪除成功");
      } catch {
        window.alert("伺服器錯誤，請稍後再試");
      }
    }
  }

  const columns: ColumnDef<CurrencyTransactionRecord>[] = [
    { accessorKey: "date", header: "日期" },
    {
      accessorKey: "type",
      header: "類型",
      cell: ({ row }) =>
        phraseMap.currencyTransactionRecordType?.[row.original.type] ||
        row.original.type,
    },
    {
      accessorKey: "fromBank.name",
      header: "出金機構",
      cell: ({ row }) => row.original.fromBank?.name || "-",
    },
    {
      accessorKey: "toBank.name",
      header: "入金機構",
      cell: ({ row }) => row.original.toBank?.name || "-",
    },
    {
      accessorKey: "fromCurrency.name",
      header: "賣出幣別",
      cell: ({ row }) => row.original.fromCurrency?.name || "-",
    },
    {
      accessorKey: "toCurrency.name",
      header: "買入幣別",
      cell: ({ row }) => row.original.toCurrency?.name || "-",
    },
    {
      accessorKey: "fromAmount",
      header: "賣出金額",
      cell: ({ row }) => (
        <span className="font-medium text-red-500">
          {row.original.fromAmount}
        </span>
      ),
    },
    {
      accessorKey: "toAmount",
      header: "買入金額",
      cell: ({ row }) => (
        <span className="font-medium text-green-500">
          {row.original.toAmount}
        </span>
      ),
    },
    { accessorKey: "exchangeRate", header: "匯率" },
    { accessorKey: "charge", header: "手續費" },
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
  ];

  if (isLoading || !phraseMap.currencyTransactionRecordType)
    return <LoadingPage />;

  return (
    <main className="min-h-screen pt-[--navbar-height] bg-gray-50 pb-8">
      <PageLabel title={"外幣交易"} />

      <div className="flex flex-col items-center py-6 gap-8">
        <CurrenyTransactionFormManager
          updateShowState={{
            isShow: showUpdateForm,
            setShow: setShowUpdateForm,
          }}
          formData={formData}
        />
        <div className="w-[90vw] max-w-[1400px]">
          <DataTable
            columns={columns}
            data={currencyTransactionRecords || []}
          />
        </div>
      </div>
    </main>
  );
}
