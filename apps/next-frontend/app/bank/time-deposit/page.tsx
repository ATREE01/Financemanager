"use client";

import { TimeDepositRecord } from "@financemanager/financemanager-website-types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DataTable } from "@/app/components/data-table";
import TimeDepositRecordFormManager from "@/app/components/forms/time-deposit-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import { Button } from "@/components/ui/button";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useDeleteTimeDepositRecordMutation,
  useGetTimeDepositRecordsQuery,
} from "@/lib/features/Bank/BankApiSlice";

export default function TimeDeposit() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const [updateShow, setupdateShow] = useState(false);
  const [formData, setFormData] = useState<TimeDepositRecord>();
  const [deleteTimeDepositRecord] = useDeleteTimeDepositRecordMutation();

  async function deleteRecord(id: number) {
    const ans = window.confirm("確定要刪除此筆紀錄嗎?");
    if (ans) {
      try {
        await deleteTimeDepositRecord(id);
        window.alert("刪除成功");
      } catch {
        window.alert("伺服器錯誤，請稍後再試");
      }
    }
  }

  const { data: timeDepositRecords = [], isLoading } =
    useGetTimeDepositRecordsQuery();

  const columns: ColumnDef<TimeDepositRecord>[] = [
    { accessorKey: "bank.name", header: "金融機構" },
    { accessorKey: "bank.currency.name", header: "幣別" },
    { accessorKey: "name", header: "名稱" },
    {
      accessorKey: "amount",
      header: "總金額",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.amount}</span>
      ),
    },
    {
      accessorKey: "interestRate",
      header: "利率",
      cell: ({ row }) => (
        <span className="text-blue-600 font-medium">
          {row.original.interestRate}
        </span>
      ),
    },
    { accessorKey: "startDate", header: "開始日期" },
    { accessorKey: "endDate", header: "結束日期" },
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
              setupdateShow(true);
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

  if (isLoading) return <LoadingPage />;

  return (
    <main className="min-h-screen pt-[--navbar-height] pb-8 bg-gray-50">
      <PageLabel title={"金融機構:定存"} />
      <div className="pt-4 flex justify-center">
        <div className="w-[90vw] max-w-7xl">
          <DataTable columns={columns} data={timeDepositRecords} />
        </div>

        <TimeDepositRecordFormManager
          updateShowState={{ isShow: updateShow, setShow: setupdateShow }}
          formData={formData}
        />
      </div>
    </main>
  );
}
