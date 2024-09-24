import {
  CreateCurrencyTransactionRecord,
  CreateUserCurrency,
  Currency,
  CurrencyTransactionRecord,
  UserCurrency,
} from "@financemanager/financemanager-webiste-types";

import { apiSlice } from "@/lib/api/apiSlice";

export const CurrencyApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserCurrency", "Currency", "CurrencyTransactionRecord"],
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
      // userCurrency
      getUserCurrencies: builder.query<UserCurrency[], void>({
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
          url: "/currencies",
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
      // currecy transaction records
      getCurrencyTransactionRecords: builder.query<
        CurrencyTransactionRecord[],
        void
      >({
        query: () => ({
          url: "/currencies/transaction/records",
          method: "GET",
        }),
        providesTags: (result) => {
          return result
            ? [
                ...result.map((record) => ({
                  type: "CurrencyTransactionRecord" as const,
                  id: record.id,
                })),
                { type: "CurrencyTransactionRecord", id: "List" },
              ]
            : [{ type: "CurrencyTransactionRecord", id: "List" }];
        },
      }),
      createCurrencyTransactionRecord: builder.mutation<
        CurrencyTransactionRecord,
        CreateCurrencyTransactionRecord
      >({
        query: (data) => ({
          url: "/currencies/transaction/records",
          method: "POST",
          body: {
            ...data,
          },
        }),
        invalidatesTags: [{ type: "CurrencyTransactionRecord", id: "List" }],
      }),
      updateCurrencyTransactionRecord: builder.mutation<
        CurrencyTransactionRecord,
        {
          id: number;
          data: CreateCurrencyTransactionRecord;
        }
      >({
        query: ({ id, data }) => ({
          url: `/currencies/transaction/records/${id}`,
          method: "PUT",
          body: {
            ...data,
          },
        }),
        invalidatesTags: [{ type: "CurrencyTransactionRecord", id: "List" }],
      }),
      deleteCurrencyTransactionRecord: builder.mutation<void, number>({
        query: (id) => ({
          url: `/currencies/transaction/records/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "CurrencyTransactionRecord", id: id },
        ],
      }),
    }),
  });

export const {
  useGetCurrenciesQuery,
  useGetUserCurrenciesQuery,
  useCreateUserCurrencyMutation,
  useDeleteUserCurrencyMutation,
  useGetCurrencyTransactionRecordsQuery,
  useCreateCurrencyTransactionRecordMutation,
  useUpdateCurrencyTransactionRecordMutation,
  useDeleteCurrencyTransactionRecordMutation,
} = CurrencyApiSlice;
