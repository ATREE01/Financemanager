import { BrokerageFirm } from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";

import { useAppSelector } from "@/lib/hook";
import { RootState } from "@/lib/store";

const BrokerageFirmSlice = createSlice({
  name: "BrokerageFirm",
  initialState: {
    brokerageFirms: [] as BrokerageFirm[],
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
  },
});

export default BrokerageFirmSlice.reducer;

export const useBrokerageFirms = () =>
  useAppSelector((state: RootState) => state.brokerageFirm.brokerageFirms);

export const { setBrokerageFirms } = BrokerageFirmSlice.actions;
