import { PhraseMap } from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

const PhraseMapSlice = createSlice({
  name: "PhraseMap",
  initialState: {
    phraseMap: {} as PhraseMap,
  },
  reducers: {
    setPhraseMap: (
      state,
      action: {
        type: string;
        payload: PhraseMap;
      },
    ) => {
      state.phraseMap = action.payload;
    },
  },
});

export default PhraseMapSlice.reducer;

export const { setPhraseMap } = PhraseMapSlice.actions;

export const usePhraseMap = () =>
  useSelector((state: RootState) => state.phraseMap.phraseMap);
