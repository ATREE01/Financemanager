"use client";

import { useEffect } from "react";

import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useGetBankRecordsQuery,
  useGetBanksQuery,
  useGetTimeDepositRecordsQuery,
} from "@/lib/features/Bank/BankApiSlice";
import {
  setBankRecords,
  setBanks,
  setTimeDepositRecords,
} from "@/lib/features/Bank/BankSlice";
import { useGetCategoriesQuery } from "@/lib/features/Category/CategoryApiSlice";
import { setCategories } from "@/lib/features/Category/CategorySlice";
import {
  useGetCurrenciesQuery,
  useGetCurrencyTransactionRecordsQuery,
  useGetUserCurrenciesQuery,
} from "@/lib/features/Currency/CurrencyApiSlice";
import {
  setCurrencies,
  setCurrencyTransactionRecord,
  setUserCurrencies,
} from "@/lib/features/Currency/CurrencySlice";
import { useGetIncExpRecordsQuery } from "@/lib/features/IncExp/IncExpApiSlice";
import { setIncExpRecords } from "@/lib/features/IncExp/IncExpSlice";
import { setPhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";
import { useAppDispatch } from "@/lib/hook";

export default function InitialStoreData({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const {
    data: categories,
    isSuccess: categoryIsSuccess,
    isLoading: categoryIsLoading,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();
  const {
    data: banks,
    isSuccess: bankIsSuccess,
    isLoading: bankIsLoading,
    refetch: refetchBanks,
  } = useGetBanksQuery();
  const {
    data: bankRecords,
    isSuccess: bankRecordIsSuccess,
    isLoading: bankRecordIsLoading,
    refetch: refetchBankRecords,
  } = useGetBankRecordsQuery();
  const {
    data: timeDepositRecords,
    isSuccess: timeDepositRecordIsSuccess,
    isLoading: timeDepositRecordIsLoading,
    refetch: refetchTimeDepositRecords,
  } = useGetTimeDepositRecordsQuery();
  const {
    data: currencies,
    isSuccess: currencyIsSuccess,
    isLoading: currencyIsLoading,
    refetch: refetchCurrencies,
  } = useGetCurrenciesQuery();
  const {
    data: userCurrencies,
    isSuccess: userCurrencyIsSuccess,
    isLoading: userCurrencyIsLoading,
    refetch: refetchUserCurrencies,
  } = useGetUserCurrenciesQuery();
  const {
    data: currencyTransactionRecords,
    isSuccess: currencyTransactionRecordIsSuccess,
    isLoading: currencyTransactionRecordIsLoading,
    refetch: refetchCurrencyTransactionRecords,
  } = useGetCurrencyTransactionRecordsQuery();
  const {
    data: incExpRecord,
    isSuccess: incExpRecordIsSuccess,
    isLoading: incExpRecordIsLoading,
    refetch: refetchIncExpRecord,
  } = useGetIncExpRecordsQuery();

  const userId = useUserId();
  useEffect(() => {
    refetchBankRecords();
    refetchCategories();
    refetchBanks();
    refetchTimeDepositRecords();
    refetchCurrencies();
    refetchUserCurrencies();
    refetchCurrencyTransactionRecords();
    refetchIncExpRecord();
  }, [userId]);

  useEffect(() => {
    if (categoryIsSuccess) dispatch(setCategories(categories));
  }, [categories]);

  useEffect(() => {
    if (bankIsSuccess) dispatch(setBanks(banks));
  }, [banks]);

  useEffect(() => {
    if (bankRecordIsSuccess) dispatch(setBankRecords(bankRecords));
  }, [bankRecords]);

  useEffect(() => {
    if (timeDepositRecordIsSuccess)
      dispatch(setTimeDepositRecords(timeDepositRecords));
  }, [timeDepositRecords]);

  useEffect(() => {
    if (currencyIsSuccess) dispatch(setCurrencies(currencies));
  }, [currencies]);

  useEffect(() => {
    if (userCurrencyIsSuccess) dispatch(setUserCurrencies(userCurrencies));
  }, [userCurrencies]);

  useEffect(() => {
    if (currencyTransactionRecordIsSuccess)
      dispatch(setCurrencyTransactionRecord(currencyTransactionRecords));
  }, [currencyTransactionRecords]);

  useEffect(() => {
    if (incExpRecordIsSuccess) dispatch(setIncExpRecords(incExpRecord));
  }, [incExpRecord]);

  useEffect(() => {
    dispatch(setPhraseMap());
  });

  const isLoading =
    categoryIsLoading &&
    bankIsLoading &&
    bankRecordIsLoading &&
    timeDepositRecordIsLoading &&
    currencyIsLoading &&
    userCurrencyIsLoading &&
    currencyTransactionRecordIsLoading &&
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
