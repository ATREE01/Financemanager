"use client";

import { IncExpRecord } from "@financemanager/financemanager-webiste-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ConditionFilter from "@/app/components/condition-filter";
import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import DurationFilter from "@/app/components/duration-filter";
import IncExpFormManager from "@/app/components/forms/inc-exp-form-manager";
import PageLabel from "@/app/components/page-label";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useBanks } from "@/lib/features/Bank/BankSlice";
import { useCategories } from "@/lib/features/Category/CategorySlice";
import { useUserCurrencies } from "@/lib/features/Currency/CurrencySlice";
import { useDeleteIncExpRecordMutation } from "@/lib/features/IncExp/IncExpApiSlice";
import { useIncExpRecords } from "@/lib/features/IncExp/IncExpSlice";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";

export default function Detail() {
  const userId = useUserId();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [userId]);

  const router = useRouter();

  const [startDate, setStartDate] = useState(new Date("1900-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [type, setType] = useState("default");
  const [category, setCategory] = useState("default");
  const [currency, setCurrency] = useState("default");
  const [method, setMethod] = useState("default");
  const [bank, setBank] = useState("default");
  const [formData, setFormData] = useState<IncExpRecord | null>(null);
  const [showModifyForm, setShowModifyForm] = useState(false);

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
      } catch (e) {
        window.alert("伺服器錯誤，請稍後再試");
      }
    }
  }

  const phraseMap = usePhraseMap();
  const incExpRecords = useIncExpRecords().filter((record) => {
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

  const categories = useCategories();
  const userCurrencies = useUserCurrencies();
  const banks = useBanks();

  const tableContent = incExpRecords.map((record) => {
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
        <td className={styles["table-data-cell"]}>{record.charge}</td>
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

  const typeOptions = [
    { value: "default", name: "類別" },
    { value: "income", name: "收入" },
    { value: "expense", name: "支出" },
  ];
  const categoryOptions = [
    { value: "default", name: "種類" },
    ...[...categories.income, ...categories.expense].map((category) => ({
      value: category.id,
      name: category.name,
    })),
  ];

  const currencyOptions = [
    { value: "default", name: "幣別" },
    ...userCurrencies.map((userCurrency) => ({
      value: userCurrency.id.toString(),
      name: userCurrency.currency.name,
    })),
  ];
  const methodOptions = [
    { value: "default", name: "方法" },
    { value: "cash", name: "現金" },
    { value: "finance", name: "金融" },
  ];
  const banksOptions = [
    { value: "default", name: "金融機構" },
    ...banks.map((bank) => ({ value: bank.id, name: bank.name })),
  ];

  return (
    <main className="pt-[--navbar-height]">
      <div className="bg-slate-100">
        <PageLabel title={"收支紀錄:明細"} />
        {/* TODO: add a column to display the total amount base on the filter */}
        <div className="h-[80vh] w-full flex flex-col justify-start items-center">
          <DurationFilter
            startDate={{ data: startDate, setData: setStartDate }}
            endDate={{ data: endDate, setData: setEndDate }}
          />
          <div className="w-[60vw] my-2 flex flex-wrap items-center justify-center gap-2">
            <div className="flex-1">
              <ConditionFilter options={typeOptions} setFilter={setType} />
            </div>
            <div className="flex-1">
              <ConditionFilter
                options={categoryOptions}
                setFilter={setCategory}
              />
            </div>
            <div className="flex-1">
              <ConditionFilter
                options={currencyOptions}
                setFilter={setCurrency}
              />
            </div>
            <div className="flex-1">
              <ConditionFilter options={methodOptions} setFilter={setMethod} />
            </div>
            <div className="flex-1">
              <ConditionFilter options={banksOptions} setFilter={setBank} />
            </div>
          </div>

          <DetailTable titles={titles} tableContent={tableContent} />
          <IncExpFormManager
            modifyShowState={{
              isShow: showModifyForm,
              setShow: setShowModifyForm,
            }}
            formData={formData}
          />
        </div>
      </div>
    </main>
  );
}
