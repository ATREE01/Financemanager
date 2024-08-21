import { IncExpRecord } from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

const IncExpApiSlice = createSlice({
  name: "IncExpRecord",
  initialState: {
    incExpRecords: [] as IncExpRecord[],
  },
  reducers: {
    setIncExpRecords: (
      state,
      action: {
        type: string;
        payload: IncExpRecord[];
      },
    ) => {
      state.incExpRecords = action.payload;
    },
  },
});

export default IncExpApiSlice.reducer;

export const { setIncExpRecords } = IncExpApiSlice.actions;

export const useIncExpRecords = () =>
  useSelector((state: RootState) => state.incExpRecord.incExpRecords);
