import {
  Currency,
  UserCurrency,
} from "@financemanager/financemanager-webiste-types";

import { apiSlice } from "@/lib/api/apiSlice";

export const CurrencyApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserCurrency", "Currency"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCurrencies: builder.query<Currency[], void>({
        query: () => ({
          url: "/currencies",
          method: "GET",
          providesTags: [{ type: "Currency", id: "List" }],
        }),
      }),
      getUserCurrency: builder.query<UserCurrency[], string>({
        query: (userId) => ({
          url: `/users/${userId}/currencies`,
          method: "GET",
          providesTags: [{ type: "UserCurrency", id: "List" }],
        }),
      }),
    }),
  });

export const { useGetCurrenciesQuery, useGetUserCurrencyQuery } =
  CurrencyApiSlice;
