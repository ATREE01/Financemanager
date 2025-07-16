"use client";

import { Currency } from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import DetailTable from "@/app/components/detail-table";
import styles from "@/app/components/detail-table/index.module.css";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useCreateUserCurrencyMutation,
  useDeleteUserCurrencyMutation,
  useGetCurrenciesQuery,
  useGetUserCurrenciesQuery,
} from "@/lib/features/Currency/CurrencyApiSlice";

export default function CurrencyManage() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const [createUserCurrency] = useCreateUserCurrencyMutation();
  const [deleteUserCurrency] = useDeleteUserCurrencyMutation();

  const { data: currencies } = useGetCurrenciesQuery();
  const { data: userCurrencies } = useGetUserCurrenciesQuery();
  const selectedCurrencies: { [key: string]: boolean } = {};

  if (!currencies || !userCurrencies) return <LoadingPage />;

  userCurrencies.forEach((userCurrency) => {
    selectedCurrencies[userCurrency.currency.code] = true;
  });

  const handleOnChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    currency: Currency,
  ) => {
    const value = e.target.checked;
    try {
      if (value === true) {
        await createUserCurrency({
          currencyId: Number(currency.id),
        }).unwrap();
        window.alert("新增成功");
      } else if (value === false) {
        await deleteUserCurrency(Number(currency.id)).unwrap();
        window.alert("刪除成功");
      }
    } catch {
      window.alert("伺服器錯誤，請稍後再試");
    }
  };

  const tableTitles = ["勾選", "代號", "名稱", "匯率"];
  const tableContent = (currencies || []).slice(1).map((currency, index) => (
    <tr key={index}>
      <td className={styles["table-data-cell"]}>
        <input
          onChange={(e) => handleOnChange(e, currency)}
          type="checkbox"
          checked={selectedCurrencies[currency.code] ?? false}
        />
      </td>
      <td className={styles["table-data-cell"]}>{currency.code}</td>
      <td className={styles["table-data-cell"]}>{currency.name}</td>
      <td className={styles["table-data-cell"]}>{currency.exchangeRate}</td>
    </tr>
  ));

  return (
    <main className="pt-[--navbar-height] bg-slate-100">
      <PageLabel title={"外幣管理"} />
      <div className="flex justify-center pt-1">
        <div className="w-full h-[80vh] sm:w-[80vw] lg:w-[35vw] p-4">
          <DetailTable titles={tableTitles} tableContent={tableContent} />
        </div>
      </div>
    </main>
  );
}
