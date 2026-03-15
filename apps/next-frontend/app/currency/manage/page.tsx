"use client";

import { Currency } from "@financemanager/financemanager-website-types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";

import { DataTable } from "@/app/components/data-table";
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

  const { data: currencies, isLoading: currenciesIsLoading } =
    useGetCurrenciesQuery();
  const { data: userCurrencies, isLoading: userCurrenciesIsLoading } =
    useGetUserCurrenciesQuery();

  const handleOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, currency: Currency) => {
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
    },
    [createUserCurrency, deleteUserCurrency],
  );

  const columns = useMemo<ColumnDef<Currency>[]>(
    () => [
      {
        id: "select",
        header: "勾選",
        cell: ({ row }) => {
          const isSelected =
            userCurrencies?.some(
              (uc) => uc.currency.code === row.original.code,
            ) ?? false;
          return (
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              checked={isSelected}
              onChange={(e) => handleOnChange(e, row.original)}
            />
          );
        },
      },
      {
        accessorKey: "code",
        header: "代號",
        cell: ({ row }) => (
          <span className="font-bold">{row.original.code}</span>
        ),
      },
      { accessorKey: "name", header: "名稱" },
      {
        accessorKey: "exchangeRate",
        header: "匯率",
        cell: ({ row }) => Number(row.original.exchangeRate).toFixed(4),
      },
    ],
    [handleOnChange, userCurrencies],
  );

  if (
    !currencies ||
    !userCurrencies ||
    currenciesIsLoading ||
    userCurrenciesIsLoading
  )
    return <LoadingPage />;

  return (
    <main className="min-h-screen bg-gray-50 pt-[--navbar-height] pb-8">
      <PageLabel title={"外幣管理"} />
      <div className="flex justify-center pt-6">
        <div className="w-full max-w-3xl px-4">
          <DataTable columns={columns} data={currencies.slice(1)} />
        </div>
      </div>
    </main>
  );
}
