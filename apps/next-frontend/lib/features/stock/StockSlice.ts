import {
  StockBundleSellRecord,
  StockRecord,
  StockSummary,
  UserStock,
} from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";

import { useAppSelector } from "@/lib/hook";
import { RootState } from "@/lib/store";

const StockSlice = createSlice({
  name: "stock",
  initialState: {
    userStocks: [] as UserStock[],
    stockRecords: [] as StockRecord[],
    stockSummaries: [] as StockSummary[],
    stockBundleSellRecords: [] as StockBundleSellRecord[],
  },
  reducers: {
    setStocks: (
      state,
      action: {
        type: string;
        payload: UserStock[];
      },
    ) => {
      state.userStocks = action.payload;
    },
    setStockRecords: (
      state,
      action: {
        type: string;
        payload: StockRecord[];
      },
    ) => {
      state.stockRecords = action.payload;
    },
    setStockSummaries: (
      state,
      action: {
        type: string;
        payload: StockSummary[];
      },
    ) => {
      state.stockSummaries = action.payload;
    },
    setStockBundleSellRecord: (
      state,
      action: {
        type: string;
        payload: StockBundleSellRecord[];
      },
    ) => {
      state.stockBundleSellRecords = action.payload;
    },
  },
});

export default StockSlice.reducer;
export const {
  setStocks,
  setStockRecords,
  setStockSummaries,
  setStockBundleSellRecord,
} = StockSlice.actions;

export const useUserStocks = () =>
  useAppSelector((state: RootState) => state.stock.userStocks);
export const useStockRecords = () =>
  useAppSelector((state: RootState) => state.stock.stockRecords);
export const useStockSummaries = () =>
  useAppSelector((state: RootState) => state.stock.stockSummaries);
export const useStockBundleSellRecords = () =>
  useAppSelector((state: RootState) => state.stock.stockBundleSellRecords);
