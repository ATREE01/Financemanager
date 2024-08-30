import {
  Bank,
  BankRecord,
  TimeDepositRecord,
} from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

const BankSlice = createSlice({
  name: "bank",
  initialState: {
    banks: [] as Bank[],
    bankRecords: [] as BankRecord[],
    timeDepositRecords: [] as TimeDepositRecord[],
  },
  reducers: {
    setBanks: (
      state,
      action: {
        type: string;
        payload: Bank[];
      },
    ) => {
      state.banks = action.payload;
    },
    setBankRecords: (
      state,
      action: {
        type: string;
        payload: BankRecord[];
      },
    ) => {
      state.bankRecords = action.payload;
    },
    setTimeDepositRecords: (
      state,
      action: {
        type: string;
        payload: TimeDepositRecord[];
      },
    ) => {
      state.timeDepositRecords = action.payload;
    },
  },
});

export default BankSlice.reducer;

export const useBanks = () =>
  useSelector((state: RootState) => state.bank.banks);

export const useBankRecords = () =>
  useSelector((state: RootState) => state.bank.bankRecords);

export const useTimeDepositRecords = () =>
  useSelector((state: RootState) => state.bank.timeDepositRecords);

export const { setBanks, setBankRecords, setTimeDepositRecords } =
  BankSlice.actions;
