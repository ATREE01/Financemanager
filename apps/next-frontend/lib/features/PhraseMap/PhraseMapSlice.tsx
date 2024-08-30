import {
  BankRecordType,
  IncExpRecordType,
  PhraseMap,
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
          cash: "現金",
          finance: "金融",
        },
        bankRecordType: {
          [BankRecordType.DEPOSIT]: "存款",
          [BankRecordType.WITHDRAW]: "提款",
          [BankRecordType.TRANSFERIN]: "轉入",
          [BankRecordType.TRANSFEROUT]: "轉出",
        },
      } as PhraseMap;
    },
  },
});

export default PhraseMapSlice.reducer;

export const { setPhraseMap } = PhraseMapSlice.actions;

export const usePhraseMap = () =>
  useSelector((state: RootState) => state.phraseMap.phraseMap);
