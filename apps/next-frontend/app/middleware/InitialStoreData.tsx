"use client";

import React, { useEffect } from "react";

import { useUserId } from "@/lib/features/Auth/AuthSlice";
import {
  useGetBankhistoryDataQuery,
  useGetBankRecordsQuery,
  useGetBanksQuery,
  useGetBankSummaryQuery,
  useGetTimeDepositRecordsQuery,
} from "@/lib/features/Bank/BankApiSlice";
import {
  setBankHistoryData,
  setBankRecords,
  setBanks,
  setBankSummary,
  setTimeDepositRecords,
} from "@/lib/features/Bank/BankSlice";
import {
  useGetBrokerageFirmsQuery,
  useGetBrokerageFirmSummaryQuery,
  useGetBrokerageFrimHistoryDataQuery, // Typo in original? Should likely be Firm
} from "@/lib/features/BrokerageFirm/BrokerageFirmApiSlice";
import {
  setBrokerageFirmHistoryData,
  setBrokerageFirms,
  setBrokerageFirmSummary,
} from "@/lib/features/BrokerageFirm/BrokerageFirmSlice";
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
import {
  useGetStockBundleSellRecordsQuery,
  useGetStockRecordsQuery,
  useGetStockSummaryQuery,
  useGetUserStocksQuery,
} from "@/lib/features/stock/StockApiSlice";
import {
  setStockBundleSellRecord,
  setStockRecords,
  setStocks,
  setStockSummaries,
} from "@/lib/features/stock/StockSlice";
import { useAppDispatch } from "@/lib/hook";

export default function InitialStoreData({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const userId = useUserId();

  // --- Condition to skip fetching ---
  const skipFetching = !userId;

  // --- Pass the skip option to all hooks that depend on userId ---
  const { data: categories, isSuccess: categoryIsSuccess } =
    useGetCategoriesQuery(undefined, { skip: skipFetching }); // Assuming categories depend on user
  const { data: incExpRecord, isSuccess: incExpRecordIsSuccess } =
    useGetIncExpRecordsQuery(undefined, { skip: skipFetching });
  const { data: currencies, isSuccess: currencyIsSuccess } =
    useGetCurrenciesQuery(undefined, { skip: skipFetching });
  const { data: userCurrencies, isSuccess: userCurrencyIsSuccess } =
    useGetUserCurrenciesQuery(undefined, { skip: skipFetching });
  const {
    data: currencyTransactionRecords,
    isSuccess: currencyTransactionRecordIsSuccess,
  } = useGetCurrencyTransactionRecordsQuery(undefined, { skip: skipFetching });
  const { data: bankSummary, isSuccess: bankSummaryIsSuccess } =
    useGetBankSummaryQuery(undefined, { skip: skipFetching });
  const { data: bankHistoryData, isSuccess: bankHistoryDataIsSuccess } =
    useGetBankhistoryDataQuery(undefined, { skip: skipFetching });
  const { data: banks, isSuccess: bankIsSuccess } = useGetBanksQuery(
    undefined,
    { skip: skipFetching },
  );
  const { data: bankRecords, isSuccess: bankRecordIsSuccess } =
    useGetBankRecordsQuery(undefined, { skip: skipFetching });
  const { data: timeDepositRecords, isSuccess: timeDepositRecordIsSuccess } =
    useGetTimeDepositRecordsQuery(undefined, { skip: skipFetching });
  const {
    data: brokerageFirmSummary,
    isSuccess: brokerageFirmSummaryIsSuccess,
  } = useGetBrokerageFirmSummaryQuery(undefined, { skip: skipFetching });
  const {
    data: brokerageFirmHistoryData,
    isSuccess: brokerageFirmHistoryDataIsSuccess,
  } = useGetBrokerageFrimHistoryDataQuery(undefined, { skip: skipFetching }); // Note: typo in original hook name?
  const { data: brokerageFirms, isSuccess: brokerageFirmIsSuccess } =
    useGetBrokerageFirmsQuery(undefined, { skip: skipFetching });
  const { data: userStocks, isSuccess: userStockIsSuccess } =
    useGetUserStocksQuery(undefined, { skip: skipFetching });
  const { data: stockRecords, isSuccess: stockRecordIsSuccess } =
    useGetStockRecordsQuery(undefined, { skip: skipFetching });
  const { data: stockSumaries, isSuccess: stockSumaryIsSuccess } =
    useGetStockSummaryQuery(undefined, { skip: skipFetching });
  const {
    data: stockBundleSellRecord,
    isSuccess: stockBundleSellRecordIsSuccess,
  } = useGetStockBundleSellRecordsQuery(undefined, { skip: skipFetching });

  useEffect(() => {
    if (categoryIsSuccess && categories) dispatch(setCategories(categories));
  }, [categories, categoryIsSuccess, dispatch]); // Add all dependencies

  useEffect(() => {
    if (incExpRecordIsSuccess && incExpRecord)
      dispatch(setIncExpRecords(incExpRecord));
  }, [incExpRecord, incExpRecordIsSuccess, dispatch]);

  useEffect(() => {
    if (currencyIsSuccess && currencies) dispatch(setCurrencies(currencies));
  }, [currencies, currencyIsSuccess, dispatch]);

  useEffect(() => {
    if (userCurrencyIsSuccess && userCurrencies)
      dispatch(setUserCurrencies(userCurrencies));
  }, [userCurrencies, userCurrencyIsSuccess, dispatch]);

  useEffect(() => {
    if (currencyTransactionRecordIsSuccess && currencyTransactionRecords)
      dispatch(setCurrencyTransactionRecord(currencyTransactionRecords));
  }, [
    currencyTransactionRecords,
    currencyTransactionRecordIsSuccess,
    dispatch,
  ]);

  useEffect(() => {
    if (bankSummaryIsSuccess && bankSummary) {
      dispatch(setBankSummary(bankSummary));
    }
  }, [bankSummary, bankSummaryIsSuccess, dispatch]);

  useEffect(() => {
    if (bankHistoryDataIsSuccess && bankHistoryData) {
      dispatch(setBankHistoryData(bankHistoryData));
    }
  }, [bankHistoryData, bankHistoryDataIsSuccess, dispatch]);

  useEffect(() => {
    if (bankIsSuccess && banks) dispatch(setBanks(banks));
  }, [banks, bankIsSuccess, dispatch]);

  useEffect(() => {
    if (bankRecordIsSuccess && bankRecords)
      dispatch(setBankRecords(bankRecords));
  }, [bankRecords, bankRecordIsSuccess, dispatch]);

  useEffect(() => {
    if (timeDepositRecordIsSuccess && timeDepositRecords)
      dispatch(setTimeDepositRecords(timeDepositRecords));
  }, [timeDepositRecords, timeDepositRecordIsSuccess, dispatch]);

  useEffect(() => {
    if (brokerageFirmSummaryIsSuccess && brokerageFirmSummary) {
      dispatch(setBrokerageFirmSummary(brokerageFirmSummary));
    }
  }, [brokerageFirmSummary, brokerageFirmSummaryIsSuccess, dispatch]);

  useEffect(() => {
    if (brokerageFirmHistoryDataIsSuccess && brokerageFirmHistoryData) {
      dispatch(setBrokerageFirmHistoryData(brokerageFirmHistoryData));
    }
  }, [brokerageFirmHistoryData, brokerageFirmHistoryDataIsSuccess, dispatch]);

  useEffect(() => {
    if (brokerageFirmIsSuccess && brokerageFirms)
      dispatch(setBrokerageFirms(brokerageFirms));
  }, [brokerageFirms, brokerageFirmIsSuccess, dispatch]);

  useEffect(() => {
    if (userStockIsSuccess && userStocks) dispatch(setStocks(userStocks));
  }, [userStocks, userStockIsSuccess, dispatch]);

  useEffect(() => {
    if (stockRecordIsSuccess && stockRecords)
      dispatch(setStockRecords(stockRecords));
  }, [stockRecords, stockRecordIsSuccess, dispatch]);

  useEffect(() => {
    if (stockSumaryIsSuccess && stockSumaries)
      dispatch(setStockSummaries(stockSumaries));
  }, [stockSumaries, stockSumaryIsSuccess, dispatch]);

  useEffect(() => {
    if (stockBundleSellRecordIsSuccess && stockBundleSellRecord)
      dispatch(setStockBundleSellRecord(stockBundleSellRecord));
  }, [stockBundleSellRecord, stockBundleSellRecordIsSuccess, dispatch]);

  useEffect(() => {
    // This doesn't seem to depend on fetched data or userId, assuming it's okay to run always
    dispatch(setPhraseMap());
  }, [dispatch]); // Added dispatch dependency

  return <>{children}</>;
}
