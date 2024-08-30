"use client";

import {
  BankRecord,
  BankRecordType,
} from "@financemanager/financemanager-webiste-types";
import { useState } from "react";

import ConditionFilter from "@/app/components/condition-filter";
import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import DurationFilter from "@/app/components/duration-filter";
import BankFormManager from "@/app/components/forms/bank-form-manager";
import PageLabel from "@/app/components/page-label";
import { useDeleteBankRecordMutation } from "@/lib/features/Bank/BankApiSlice";
import { useBankRecords, useBanks } from "@/lib/features/Bank/BankSlice";
import { useUserCurrencies } from "@/lib/features/Currency/CurrencySlice";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";

export default function Detail() {
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [formData, setFormData] = useState<BankRecord | null>(null);

  const [startDate, setStartDate] = useState(new Date("1900-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [type, setType] = useState("default");
  const [bank, setBank] = useState("default");
  const [currency, setCurrency] = useState("default");

  const phraseMap = usePhraseMap();
  const banks = useBanks();
  const userCurrencies = useUserCurrencies();

  const bankRecords = useBankRecords().filter(
    (record) =>
      (type === "default" || record.type === type) &&
      (bank === "default" || record.bank.id === bank) &&
      (currency === "default" ||
        record.bank.currency.id.toString() === currency),
  );

  const typeOptions = [
    { value: "default", name: "類別" },
    ...Object.keys(BankRecordType).map((type) => ({
      value: type,
      name: phraseMap.bankRecordType[type],
    })),
  ];

  const currencyOptions = [
    { value: "default", name: "幣別" },
    ...userCurrencies.map((userCurrency) => ({
      value: userCurrency.currency.id.toString(),
      name: userCurrency.currency.name,
    })),
  ];

  const banksOptions = [
    { value: "default", name: "金融機構" },
    ...banks.map((bank) => ({ value: bank.id, name: bank.name })),
  ];

  const [deleteBankRecord] = useDeleteBankRecordMutation();
  function deleteRecord(id: number) {
    const ans = window.confirm("確定要刪除此筆紀錄嗎?");
    if (ans) {
      try {
        deleteBankRecord(id).unwrap();
      } catch (e) {
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
  const tableContent = bankRecords.map((record) => {
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
              setShowModifyForm(!showModifyForm);
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
      <PageLabel title={"金融機構:明細"} />

      <div className="h-[80vh] w-full flex flex-col items-center ">
        <DurationFilter
          startDate={{ data: startDate, setData: setStartDate }}
          endDate={{ data: endDate, setData: setEndDate }}
        />

        <div className="w-[40vw] my-2 flex flex-wrap items-center justify-center gap-2">
          <div className="flex-1">
            <ConditionFilter options={typeOptions} setFilter={setType} />
          </div>
          <div className="flex-1">
            <ConditionFilter
              options={currencyOptions}
              setFilter={setCurrency}
            />
          </div>
          <div className="flex-1">
            <ConditionFilter options={banksOptions} setFilter={setBank} />
          </div>
        </div>

        <DetailTable titles={titles} tableContent={tableContent} />
        <BankFormManager
          modifyShowState={{
            isShow: showModifyForm,
            setShow: setShowModifyForm,
          }}
          formData={formData}
        />
      </div>
    </main>
  );
}
