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
  const {
    data: categories,
    isSuccess: categoryIsSuccess,
    isLoading: categoryIsLoading,
  } = useGetCategoriesQuery(undefined, { skip: skipFetching }); // Assuming categories depend on user
  const {
    data: incExpRecord,
    isSuccess: incExpRecordIsSuccess,
    isLoading: incExpRecordIsLoading,
  } = useGetIncExpRecordsQuery(undefined, { skip: skipFetching });
  const {
    data: currencies,
    isSuccess: currencyIsSuccess,
    isLoading: currencyIsLoading,
  } = useGetCurrenciesQuery(undefined, { skip: skipFetching });
  const {
    data: userCurrencies,
    isSuccess: userCurrencyIsSuccess,
    isLoading: userCurrencyIsLoading,
  } = useGetUserCurrenciesQuery(undefined, { skip: skipFetching });
  const {
    data: currencyTransactionRecords,
    isSuccess: currencyTransactionRecordIsSuccess,
    isLoading: currencyTransactionRecordIsLoading,
  } = useGetCurrencyTransactionRecordsQuery(undefined, { skip: skipFetching });
  const {
    data: bankSummary,
    isSuccess: bankSummaryIsSuccess,
    isLoading: bankSummaryIsLoading,
  } = useGetBankSummaryQuery(undefined, { skip: skipFetching });
  const {
    data: bankHistoryData,
    isSuccess: bankHistoryDataIsSuccess,
    isLoading: bankHistoryDataIsLoading,
  } = useGetBankhistoryDataQuery(undefined, { skip: skipFetching });
  const {
    data: banks,
    isSuccess: bankIsSuccess,
    isLoading: bankIsLoading,
  } = useGetBanksQuery(undefined, { skip: skipFetching });
  const {
    data: bankRecords,
    isSuccess: bankRecordIsSuccess,
    isLoading: bankRecordIsLoading,
  } = useGetBankRecordsQuery(undefined, { skip: skipFetching });
  const {
    data: timeDepositRecords,
    isSuccess: timeDepositRecordIsSuccess,
    isLoading: timeDepositRecordIsLoading,
  } = useGetTimeDepositRecordsQuery(undefined, { skip: skipFetching });
  const {
    data: brokerageFirmSummary,
    isSuccess: brokerageFirmSummaryIsSuccess,
    isLoading: brokerageFirmSummaryIsLoading,
  } = useGetBrokerageFirmSummaryQuery(undefined, { skip: skipFetching });
  const {
    data: brokerageFirmHistoryData,
    isSuccess: brokerageFirmHistoryDataIsSuccess,
    isLoading: brokerageFirmHistoryDataIsLoading,
  } = useGetBrokerageFrimHistoryDataQuery(undefined, { skip: skipFetching }); // Note: typo in original hook name?
  const {
    data: brokerageFirms,
    isSuccess: brokerageFirmIsSuccess,
    isLoading: brokerageFirmIsLoading,
  } = useGetBrokerageFirmsQuery(undefined, { skip: skipFetching });
  const {
    data: userStocks,
    isSuccess: userStockIsSuccess,
    isLoading: userStockIsLoading,
  } = useGetUserStocksQuery(undefined, { skip: skipFetching });
  const {
    data: stockRecords,
    isSuccess: stockRecordIsSuccess,
    isLoading: stockRecordIsLoading,
  } = useGetStockRecordsQuery(undefined, { skip: skipFetching });
  const {
    data: stockSumaries,
    isSuccess: stockSumaryIsSuccess,
    isLoading: stockSumaryIsLoading,
  } = useGetStockSummaryQuery(undefined, { skip: skipFetching });
  const {
    data: stockBundleSellRecord,
    isSuccess: stockBundleSellRecordIsSuccess,
    isLoading: stockBundleSellRecordIsLoading,
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

  // --- Revised isLoading Logic ---
  // Show loading if we don't have a userId yet OR if any query that should be running is still loading.
  const isAnyQueryLoading =
    categoryIsLoading ||
    incExpRecordIsLoading ||
    currencyIsLoading ||
    userCurrencyIsLoading ||
    currencyTransactionRecordIsLoading ||
    bankSummaryIsLoading ||
    bankHistoryDataIsLoading ||
    bankIsLoading ||
    bankRecordIsLoading ||
    timeDepositRecordIsLoading ||
    brokerageFirmSummaryIsLoading ||
    brokerageFirmHistoryDataIsLoading ||
    brokerageFirmIsLoading ||
    userStockIsLoading ||
    stockRecordIsLoading ||
    stockSumaryIsLoading ||
    stockBundleSellRecordIsLoading;

  // Consider the component loading if we are waiting for userId or if any active query is loading
  const isLoading = !skipFetching && isAnyQueryLoading;
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
