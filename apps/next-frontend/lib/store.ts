import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/Auth/AuthSlice";
import bankReducer from "./features/Bank/BankSlice";
import brokerageFirmReducer from "./features/BrokerageFirm/BrokerageFirmSlice";
import categoryReducer from "./features/Category/CategorySlice";
import currencyReducer from "./features/Currency/CurrencySlice";
import incExpRecordReducer from "./features/IncExp/IncExpSlice";
import phraseMapReducer from "./features/PhraseMap/PhraseMapSlice";
import stockReducer from "./features/stock/StockSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      bank: bankReducer,
      brokerageFirm: brokerageFirmReducer,
      stock: stockReducer,
      category: categoryReducer,
      currency: currencyReducer,
      incExpRecord: incExpRecordReducer,
      phraseMap: phraseMapReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

//Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
