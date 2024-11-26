import {
  BrokerageFirm,
  BrokerageFirmHistoryData,
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
    brokerageFirmHistoryData: [] as BrokerageFirmHistoryData[],
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
    setBrokerageFirmHistoryData: (
      state,
      action: {
        type: string;
        payload: BrokerageFirmHistoryData[];
      },
    ) => {
      state.brokerageFirmHistoryData = action.payload;
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

export const useBrokerageFirmHistoryData = () =>
  useAppSelector(
    (state: RootState) => state.brokerageFirm.brokerageFirmHistoryData,
  );

export const {
  setBrokerageFirms,
  setBrokerageFirmSummary,
  setBrokerageFirmHistoryData,
} = BrokerageFirmSlice.actions;
