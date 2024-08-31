import {
  Currency,
  CurrencyTransactionRecord,
  UserCurrency,
} from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

const CurrencySlice = createSlice({
  name: "currency",
  initialState: {
    currencies: [] as Currency[],
    userCurrencies: [] as UserCurrency[],
    currencyTransactionRecord: [] as CurrencyTransactionRecord[],
  },
  reducers: {
    setCurrencies: (state, action) => {
      state.currencies = action.payload;
    },
    setUserCurrencies: (state, action) => {
      state.userCurrencies = action.payload;
    },
    setCurrencyTransactionRecord: (state, action) => {
      state.currencyTransactionRecord = action.payload;
    },
  },
});

export const {
  setUserCurrencies,
  setCurrencies,
  setCurrencyTransactionRecord,
} = CurrencySlice.actions;

export default CurrencySlice.reducer;

export const useUserCurrencies = () =>
  useSelector((state: RootState) => state.currency.userCurrencies);
export const useCurrencies = () =>
  useSelector((state: RootState) => state.currency.currencies);
export const useCurrencyTransactionRecord = () =>
  useSelector((state: RootState) => state.currency.currencyTransactionRecord);
