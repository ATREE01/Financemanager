"use client";

import { useEffect } from "react";

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
  useGetBrokerageFrimHistoryDataQuery,
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

  const {
    data: categories,
    isSuccess: categoryIsSuccess,
    isLoading: categoryIsLoading,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();
  const {
    data: incExpRecord,
    isSuccess: incExpRecordIsSuccess,
    isLoading: incExpRecordIsLoading,
    refetch: refetchIncExpRecord,
  } = useGetIncExpRecordsQuery();
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
    data: bankSummary,
    isSuccess: bankSummaryIsSuccess,
    isLoading: bankSummaryIsLoading,
    refetch: refetchBankSummars,
  } = useGetBankSummaryQuery();
  const {
    data: bankHistoryData,
    isSuccess: bankHistoryDataIsSuccess,
    isLoading: bankHistoryDataIsLoading,
    refetch: refetchBankHistoryData,
  } = useGetBankhistoryDataQuery();
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
    data: brokerageFirmSummary,
    isSuccess: brokerageFirmSummaryIsSuccess,
    isLoading: brokerageFirmSummaryIsLoading,
    refetch: refetchBrokerageFirmSummary,
  } = useGetBrokerageFirmSummaryQuery();
  const {
    data: brokerageFirmHistoryData,
    isSuccess: brokerageFirmHistoryDataIsSuccess,
    isLoading: brokerageFirmHistoryDataIsLoading,
    refetch: refetchBrokerageFirmHistoryData,
  } = useGetBrokerageFrimHistoryDataQuery();
  const {
    data: brokerageFirms,
    isSuccess: brokerageFirmIsSuccess,
    isLoading: brokerageFirmIsLoading,
    refetch: refetchBrokerageFirms,
  } = useGetBrokerageFirmsQuery();
  const {
    data: userStocks,
    isSuccess: userStockIsSuccess,
    isLoading: userStockIsLoading,
    refetch: refetchUserStock,
  } = useGetUserStocksQuery();
  const {
    data: stockRecords,
    isSuccess: stockRecordIsSuccess,
    isLoading: stockRecordIsLoading,
    refetch: refetchStockRecords,
  } = useGetStockRecordsQuery();
  const {
    data: stockSumaries,
    isSuccess: stockSumaryIsSuccess,
    isLoading: stockSumaryIsLoading,
    refetch: refetchStockSumaries,
  } = useGetStockSummaryQuery();
  const {
    data: stockBundleSellRecord,
    isSuccess: stockBundleSellRecordIsSuccess,
    isLoading: stockBundleSellRecordIsLoading,
    refetch: refetchStockBundleSellRecord,
  } = useGetStockBundleSellRecordsQuery();

  const userId = useUserId();
  useEffect(() => {
    refetchCategories();
    refetchIncExpRecord();
    refetchCurrencies();
    refetchUserCurrencies();
    refetchCurrencyTransactionRecords();
    refetchBankSummars();
    refetchBankHistoryData();
    refetchBanks();
    refetchBankRecords();
    refetchTimeDepositRecords();
    refetchBrokerageFirmSummary();
    refetchBrokerageFirms();
    refetchBrokerageFirmHistoryData();
    refetchUserStock();
    refetchStockRecords();
    refetchStockSumaries();
    refetchStockBundleSellRecord();
  }, [userId]);

  useEffect(() => {
    if (categoryIsSuccess) dispatch(setCategories(categories));
  }, [categories]);

  useEffect(() => {
    if (incExpRecordIsSuccess) dispatch(setIncExpRecords(incExpRecord));
  }, [incExpRecord]);

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
    if (bankSummaryIsSuccess) {
      dispatch(setBankSummary(bankSummary));
    }
  }, [bankSummary]);

  useEffect(() => {
    if (bankHistoryDataIsSuccess) {
      dispatch(setBankHistoryData(bankHistoryData));
    }
  }, [bankHistoryData]);

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
    if (brokerageFirmSummaryIsSuccess) {
      dispatch(setBrokerageFirmSummary(brokerageFirmSummary));
    }
  }, [brokerageFirmSummary]);

  useEffect(() => {
    if (brokerageFirmHistoryDataIsSuccess) {
      dispatch(setBrokerageFirmHistoryData(brokerageFirmHistoryData));
    }
  }, [brokerageFirmHistoryData]);

  useEffect(() => {
    if (brokerageFirmIsSuccess) dispatch(setBrokerageFirms(brokerageFirms));
  }, [brokerageFirms]);

  useEffect(() => {
    if (userStockIsSuccess) dispatch(setStocks(userStocks));
  }, [userStocks]);

  useEffect(() => {
    if (stockRecordIsSuccess) dispatch(setStockRecords(stockRecords));
  }, [stockRecords]);

  useEffect(() => {
    if (stockSumaryIsSuccess) dispatch(setStockSummaries(stockSumaries));
  }, [stockSumaries]);

  useEffect(() => {
    if (stockBundleSellRecordIsSuccess)
      dispatch(setStockBundleSellRecord(stockBundleSellRecord));
  }, [stockBundleSellRecord]);

  useEffect(() => {
    dispatch(setPhraseMap());
  });

  const isLoading =
    categoryIsLoading &&
    incExpRecordIsLoading &&
    currencyIsLoading &&
    userCurrencyIsLoading &&
    currencyTransactionRecordIsLoading &&
    bankSummaryIsLoading &&
    bankHistoryDataIsLoading &&
    bankIsLoading &&
    bankRecordIsLoading &&
    timeDepositRecordIsLoading &&
    brokerageFirmSummaryIsLoading &&
    brokerageFirmHistoryDataIsLoading &&
    brokerageFirmIsLoading &&
    userStockIsLoading &&
    stockRecordIsLoading &&
    stockSumaryIsLoading &&
    stockBundleSellRecordIsLoading;

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
