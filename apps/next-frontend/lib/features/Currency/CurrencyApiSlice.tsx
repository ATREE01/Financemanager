import {
  CreateUserCurrency,
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
        }),
        providesTags: [{ type: "Currency", id: "List" }],
      }),
      getUserCurrency: builder.query<UserCurrency[], void>({
        query: () => ({
          url: `/users/currencies`,
          method: "GET",
        }),
        transformResponse: (response: UserCurrency[]) => {
          return response.sort((a, b) => a.currency.id - b.currency.id);
        },
        providesTags: [{ type: "UserCurrency", id: "List" }],
      }),
      createUserCurrency: builder.mutation<UserCurrency, CreateUserCurrency>({
        query: (data) => ({
          url: "/users/currencies",
          method: "POST",
          body: {
            ...data,
          },
        }),
        invalidatesTags: [{ type: "UserCurrency", id: "List" }],
      }),
      deleteUserCurrency: builder.mutation<void, number>({
        query: (id) => ({
          url: `/users/currencies/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "UserCurrency", id: "List" }],
      }),
    }),
  });

export const {
  useGetCurrenciesQuery,
  useGetUserCurrencyQuery,
  useCreateUserCurrencyMutation,
  useDeleteUserCurrencyMutation,
} = CurrencyApiSlice;
