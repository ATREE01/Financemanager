import { Category } from "@financemanager/financemanager-website-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

const CategorySlice = createSlice({
  name: "category",
  initialState: {
    income: [] as Category[],
    expense: [] as Category[],
  },
  reducers: {
    setCategories(
      state,
      action: {
        type: string;
        payload: {
          income: Category[];
          expense: Category[];
        };
      },
    ) {
      state.income = action.payload["income"];
      state.expense = action.payload["expense"];
    },
  },
});

export const { setCategories } = CategorySlice.actions;

export default CategorySlice.reducer;

export const useCategories = () =>
  useSelector((state: RootState) => state.category);
