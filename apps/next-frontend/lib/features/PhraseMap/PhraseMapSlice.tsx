import {
  BankRecordType,
  CurrencyTransactionRecordType,
  IncExpMethodType,
  IncExpRecordType,
  PhraseMap,
  StockBuyMethod,
} from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";
const PhraseMapSlice = createSlice({
  name: "PhraseMap",
  initialState: {
    phraseMap: {} as PhraseMap,
  },
  reducers: {
    setPhraseMap: (state) => {
      state.phraseMap = {
        type: {
          [IncExpRecordType.INCOME]: "收入",
          [IncExpRecordType.EXPENSE]: "支出",
        },
        method: {
          [IncExpMethodType.CASH]: "現金",
          [IncExpMethodType.FINANCE]: "金融",
        },
        bankRecordType: {
          [BankRecordType.DEPOSIT]: "存款",
          [BankRecordType.WITHDRAW]: "提款",
          [BankRecordType.TRANSFERIN]: "轉入",
          [BankRecordType.TRANSFEROUT]: "轉出",
        },
        currencyTransactionRecordType: {
          [CurrencyTransactionRecordType.ONLINE]: "線上換匯",
          [CurrencyTransactionRecordType.COUNTER]: "臨櫃換匯",
        },
        stockBuyMethod: {
          [StockBuyMethod.MANULLY]: "手動買入",
          [StockBuyMethod.REGULAR]: "定期定額",
        },
      } as PhraseMap;
    },
  },
});

export default PhraseMapSlice.reducer;

export const { setPhraseMap } = PhraseMapSlice.actions;

export const usePhraseMap = () =>
  useSelector((state: RootState) => state.phraseMap.phraseMap);
