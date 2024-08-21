"use client";

import { IncExpRecord } from "@financemanager/financemanager-webiste-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ConditionFilter from "@/app/components/condition-filter/condition-filter";
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

  const [duration, setDuration] = useState("default");
  const [type, setType] = useState("default");
  const [category, setCategory] = useState("default");
  const [currency, setCurrency] = useState("default");
  const [method, setMethod] = useState("default");
  const [bank, setBank] = useState("default");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
  async function delectRecord(id: number) {
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
    const now = new Date();
    let isWithinDuration = true;

    switch (duration) {
      case "7":
        isWithinDuration =
          now.getTime() - recordDate.getTime() < 8 * 24 * 60 * 60 * 1000;
        break;
      case "30":
        isWithinDuration =
          now.getTime() - recordDate.getTime() < 31 * 24 * 60 * 60 * 1000;
        break;
      case "90":
        isWithinDuration =
          now.getTime() - recordDate.getTime() < 91 * 24 * 60 * 60 * 1000;
        break;
      case "ytd":
        isWithinDuration = recordDate.getFullYear() === now.getFullYear();
        break;
      case "customize":
        isWithinDuration =
          recordDate.getTime() >= new Date(startDate).getTime() &&
          recordDate.getTime() <= new Date(endDate).getTime();
        break;
      default:
        isWithinDuration = true;
    }

    return (
      isWithinDuration &&
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
      <tr key={record.id}>
        <td className={styles["table-data-cell"]}>{record.date}</td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          {phraseMap.type[record.type]}
        </td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          {record.category.name}
        </td>
        <td className={`${styles["table-data-cell"]} text-right`}>
          {record.amount}
        </td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          {record.currency.name}
        </td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          {phraseMap.method[record.method]}
        </td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          {record.bank?.name ?? "X"}
        </td>
        <td className={`${styles["table-data-cell"]}`}>{record.charge}</td>
        <td className={styles["table-data-cell"]}>{record.note}</td>
        <td className={`${styles["table-data-cell"]} text-center`}>
          <button
            className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded m-[1px]"
            onClick={() => {
              setFormData(record);
              setShowModifyForm(!showModifyForm);
            }}
          >
            修改
          </button>
          <button
            className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded m-[1px]"
            onClick={() => delectRecord(record.id)}
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
        <div className="Detail-Inc-Exp-container">
          {/* TODO: add a column to display the total amount base on the filter */}
          <div className="h-[90vh] w-full flex flex-col justify-start items-center">
            <DurationFilter
              duration={{ data: duration, setData: setDuration }}
              startDate={{ data: startDate, setData: setStartDate }}
              endDate={{ data: endDate, setData: setEndDate }}
            />
            <div className="h-16 w-4/5 flex justify-center">
              <ConditionFilter options={typeOptions} setFilter={setType} />
              <ConditionFilter
                options={categoryOptions}
                setFilter={setCategory}
              />
              <ConditionFilter
                options={currencyOptions}
                setFilter={setCurrency}
              />
              <ConditionFilter options={methodOptions} setFilter={setMethod} />
              <ConditionFilter options={banksOptions} setFilter={setBank} />
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
      </div>
    </main>
  );
}
