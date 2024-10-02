import {
  BrokerageFirm,
  BrokerageFirmSummary,
} from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";

import { useAppSelector } from "@/lib/hook";
import { RootState } from "@/lib/store";

const BrokerageFirmSlice = createSlice({
  name: "BrokerageFirm",
  initialState: {
    brokerageFirms: [] as BrokerageFirm[],
    brokerageFirmSummary: {} as BrokerageFirmSummary,
  },
  reducers: {
    setBrokerageFirms: (
      state,
      action: {
        type: string;
        payload: BrokerageFirm[];
      },
    ) => {
      state.brokerageFirms = action.payload;
    },
    setBrokerageFirmSummary: (
      state,
      action: {
        type: string;
        payload: BrokerageFirmSummary;
      },
    ) => {
      state.brokerageFirmSummary = action.payload;
    },
  },
});

export default BrokerageFirmSlice.reducer;

export const useBrokerageFirms = () =>
  useAppSelector((state: RootState) => state.brokerageFirm.brokerageFirms);

export const useBrokerageFirmSummary = () =>
  useAppSelector(
    (state: RootState) => state.brokerageFirm.brokerageFirmSummary,
  );

export const { setBrokerageFirms, setBrokerageFirmSummary } =
  BrokerageFirmSlice.actions;
