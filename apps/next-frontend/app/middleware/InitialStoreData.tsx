"use client";

import { PhraseMap } from "@financemanager/financemanager-webiste-types";
import { useEffect } from "react";

import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useGetBanksQuery } from "@/lib/features/Bank/BankApiSlice";
import { setBanks } from "@/lib/features/Bank/BankSlice";
import { useGetCategoriesQuery } from "@/lib/features/Category/CategoryApiSlice";
import { setCategories } from "@/lib/features/Category/CategorySlice";
import {
  useGetCurrenciesQuery,
  useGetUserCurrencyQuery,
} from "@/lib/features/Currency/CurrencyApiSlice";
import {
  setCurrencies,
  setUserCurrencies,
} from "@/lib/features/Currency/CurrencySlice";
import { useGetIncExpRecordQuery } from "@/lib/features/IncExp/IncExpApiSlice";
import { setIncExpRecords } from "@/lib/features/IncExp/IncExpSlice";
import { setPhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";
import { useAppDispatch } from "@/lib/hook";

export default function InitialStoreData({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = useUserId() as string;
  const dispatch = useAppDispatch();

  const {
    data: categories,
    isSuccess: categoryIsSuccess,
    isLoading: categoryIsLoading,
  } = useGetCategoriesQuery(userId);
  const {
    data: banks,
    isSuccess: bankIsSuccess,
    isLoading: bankIsLoading,
  } = useGetBanksQuery(userId);
  const {
    data: currencies,
    isSuccess: currencyIsSuccess,
    isLoading: currencyIsLoading,
  } = useGetCurrenciesQuery();
  const {
    data: userCurrencies,
    isSuccess: userCurrencyIsSuccess,
    isLoading: userCurrencyIsLoading,
  } = useGetUserCurrencyQuery(userId);
  const {
    data: incExpRecord,
    isSuccess: incExpRecordIsSuccess,
    isLoading: incExpRecordIsLoading,
  } = useGetIncExpRecordQuery(userId);

  // TODO: make sure that this is the right way to do it.
  useEffect(() => {
    if (categoryIsSuccess) dispatch(setCategories(categories));
  }, [dispatch, categories, categoryIsSuccess]);

  useEffect(() => {
    if (bankIsSuccess) {
      dispatch(setBanks(banks));
    }
  }, [dispatch, banks, bankIsSuccess]);

  useEffect(() => {
    if (currencyIsSuccess) dispatch(setCurrencies(currencies));
  }, [dispatch, currencies, currencyIsSuccess]);

  useEffect(() => {
    if (userCurrencyIsSuccess) dispatch(setUserCurrencies(userCurrencies));
  }, [dispatch, userCurrencies, userCurrencyIsSuccess]);

  useEffect(() => {
    if (incExpRecordIsSuccess) dispatch(setIncExpRecords(incExpRecord));
  }, [dispatch, incExpRecord, incExpRecordIsSuccess]);

  const phraseMap = {
    type: {
      income: "收入",
      expense: "支出",
    },
    method: {
      cash: "現金",
      finance: "金融",
    },
  } as PhraseMap;

  useEffect(() => {
    dispatch(setPhraseMap(phraseMap));
  });

  const isLoading =
    categoryIsLoading &&
    bankIsLoading &&
    currencyIsLoading &&
    userCurrencyIsLoading &&
    incExpRecordIsLoading;

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
