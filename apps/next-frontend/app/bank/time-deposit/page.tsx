"use client";

import { TimeDepositRecord } from "@financemanager/financemanager-webiste-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import TimeDepositRecordFormManager from "@/app/components/forms/time-deposit-manager";
import PageLabel from "@/app/components/page-label";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useDeleteTimeDepositRecordMutation } from "@/lib/features/Bank/BankApiSlice";
import { useTimeDepositRecords } from "@/lib/features/Bank/BankSlice";

export default function TimeDeposit() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [userId]);

  const [updateShow, setupdateShow] = useState(false);

  const [formData, setFormData] = useState<TimeDepositRecord>();
  const [deleteTimeDepositRecord] = useDeleteTimeDepositRecordMutation();

  async function deleteRecord(id: number) {
    const ans = window.confirm("確定要刪除此筆紀錄嗎?");
    if (ans) {
      try {
        await deleteTimeDepositRecord(id);
      } catch (e) {
        window.alert("伺服器錯誤，請稍後再試");
      }
    }
  }

  const timeDeposiRecords = useTimeDepositRecords();
  const tableTitles = [
    "金融機構",
    "幣別",
    "名稱",
    "總金額",
    "利率",
    "開始日期",
    "結束日期",
    "功能",
  ];
  const tableContent = timeDeposiRecords.map((record) => {
    return (
      <tr key={record.id} className="border-b hover:bg-gray-100">
        <td className={styles["table-data-cell"]}>{record.bank.name}</td>
        <td className={styles["table-data-cell"]}>
          {record.bank.currency.name}
        </td>
        <td className={styles["table-data-cell"]}>{record.name}</td>
        <td className={styles["table-data-cell"]}>{record.amount}</td>
        <td className={styles["table-data-cell"]}>{record.interestRate}</td>
        <td className={styles["table-data-cell"]}>{record.startDate}</td>
        <td className={styles["table-data-cell"]}>{record.endDate}</td>
        <td className={styles["table-data-cell"]}>
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 mx-1"
            onClick={() => {
              setFormData(record);
              setupdateShow(!updateShow);
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

  return (
    <main className="bg-slate-100 py-5 min-h-screen pt-[--navbar-height]">
      <PageLabel title={"金融機構:定存"} />
      <div className="mt-20 h-[80vh] w-full flex flex-col items-center">
        <div className="w-4/5 max-h-[60vh] overflow-auto">
          <DetailTable titles={tableTitles} tableContent={tableContent} />
        </div>

        <TimeDepositRecordFormManager
          updateShowState={{ isShow: updateShow, setShow: setupdateShow }}
          formData={formData}
        />
      </div>
    </main>
  );
}
