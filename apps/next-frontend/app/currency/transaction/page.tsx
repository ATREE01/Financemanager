"use client";

import { CurrencyTransactionRecord } from "@financemanager/financemanager-webiste-types";
import { useState } from "react";

import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import CurrenyTransactionFormManager from "@/app/components/forms/currency-transaction-form-manager";
import PageLabel from "@/app/components/page-label";
import { useDeleteCurrencyTransactionRecordMutation } from "@/lib/features/Currency/CurrencyApiSlice";
import { useCurrencyTransactionRecord } from "@/lib/features/Currency/CurrencySlice";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";

export default function CurrencyTransaction() {
  const currencyTransactionRecords = useCurrencyTransactionRecord();
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
      } catch (e) {
        window.alert("伺服器錯誤，請稍後再試");
      }
    }
  }

  const tableTitles = [
    "日期",
    "類型",
    "出金機構",
    "入金機構",
    "賣出幣別",
    "買入幣別",
    "賣出金額",
    "買入金額",
    "匯率",
    "手續費",
    "功能",
  ];
  const tableContent = currencyTransactionRecords.map((record) => {
    return (
      <tr key={record.id} className="border-b hover:bg-gray-100">
        <td className={styles["table-data-cell"]}>{record.date}</td>
        <td className={styles["table-data-cell"]}>
          {phraseMap.currencyTransactionRecordType[record.type]}
        </td>
        <td className={styles["table-data-cell"]}>
          {record.fromBank?.name ?? "X"}
        </td>
        <td className={styles["table-data-cell"]}>
          {record.toBank?.name ?? "X"}
        </td>
        <td className={styles["table-data-cell"]}>
          {record.fromCurrency?.name ?? "X"}
        </td>
        <td className={styles["table-data-cell"]}>
          {record.toCurrency?.name ?? "X"}
        </td>
        <td className={styles["table-data-cell"]}>{record.fromAmount}</td>
        <td className={styles["table-data-cell"]}>{record.toAmount}</td>
        <td className={styles["table-data-cell"]}>{record.exchangeRate}</td>
        <td className={styles["table-data-cell"]}>{record.charge}</td>
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

  return (
    <main className="pt-[--navbar-height] bg-slate-100">
      <PageLabel title={"外幣交易"} />

      <div className="h-[80vh] w-full flex flex-col items-center pt-2">
        <CurrenyTransactionFormManager
          updateShowState={{
            isShow: showUpdateForm,
            setShow: setShowUpdateForm,
          }}
          formData={formData}
        />

        <DetailTable titles={tableTitles} tableContent={tableContent} />
      </div>
    </main>
  );
}
