import {
  IncExpMethodType,
  IncExpRecord,
} from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

const IncExpApiSlice = createSlice({
  name: "IncExpRecord",
  initialState: {
    incExpRecords: [] as IncExpRecord[],
    incExpFinRecords: [] as IncExpRecord[],
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
      state.incExpFinRecords = action.payload.filter(
        (record) => record.method === IncExpMethodType.FINANCE,
      );
    },
  },
});

export default IncExpApiSlice.reducer;

export const { setIncExpRecords } = IncExpApiSlice.actions;

export const useIncExpRecords = () =>
  useSelector((state: RootState) => state.incExpRecord.incExpRecords);
export const useIncExpFinRecords = () =>
  useSelector((state: RootState) => state.incExpRecord.incExpFinRecords);
