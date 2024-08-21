import { Bank } from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

const BankSlice = createSlice({
  name: "bank",
  initialState: {
    banks: [] as Bank[],
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
  },
});

export default BankSlice.reducer;

export const useBanks = () =>
  useSelector((state: RootState) => state.bank.banks);

export const { setBanks } = BankSlice.actions;
