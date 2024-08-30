import {
  Bank,
  BankRecord,
  CreateBankRecord,
  CreateTimeDepositRecord,
  TimeDepositRecord,
} from "@financemanager/financemanager-webiste-types";

import { apiSlice } from "@/lib/api/apiSlice";

const BankApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Bank", "BankRecord", "TimeDeposits"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getBanks: builder.query<Bank[], void>({
        query: () => ({
          url: `/users/banks`,
          method: "GET",
        }),
        providesTags: ["Bank"],
      }),
      createBank: builder.mutation<Bank, { name: string; currencyId: number }>({
        query: (args) => ({
          url: "/banks",
          method: "POST",
          body: {
            ...args,
          },
        }),
        invalidatesTags: ["Bank"],
      }),
      getBankRecords: builder.query<BankRecord[], void>({
        query: () => ({
          url: "/users/banks/records",
          method: "GET",
        }),
        providesTags: (result) => {
          return result
            ? [
                ...result.map(({ id }) => ({
                  type: "BankRecord" as const,
                  id,
                })),
                { type: "BankRecord", id: "LIST" },
              ]
            : [{ type: "BankRecord", id: "LIST" }];
        },
      }),
      createBankRecord: builder.mutation<BankRecord, CreateBankRecord>({
        query: (args) => ({
          url: "/banks/records",
          method: "POST",
          body: {
            ...args,
          },
        }),
        invalidatesTags: [{ type: "BankRecord", id: "LIST" }],
      }),
      modifyBankRecord: builder.mutation<
        boolean,
        { id: number; data: CreateBankRecord }
      >({
        query: ({ id, data }) => ({
          url: `/banks/records/${id}`,
          method: "PUT",
          body: {
            ...data,
          },
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "BankRecord", id: arg.id },
        ],
      }),
      deleteBankRecord: builder.mutation<boolean, number>({
        query: (id) => ({
          url: `/banks/records/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [{ type: "BankRecord", id }],
      }),
      getTimeDepositRecords: builder.query<TimeDepositRecord[], void>({
        query: () => ({
          url: "/users/banks/time-deposit/records",
          method: "GET",
        }),
        providesTags: (result) => {
          return result
            ? [
                ...result.map(({ id }) => ({
                  type: "TimeDeposits" as const,
                  id,
                })),
                { type: "TimeDeposits", id: "LIST" },
              ]
            : [{ type: "TimeDeposits", id: "LIST" }];
        },
      }),
      createTimeDepositRecord: builder.mutation<
        TimeDepositRecord,
        CreateTimeDepositRecord
      >({
        query: (data) => ({
          url: "/banks/time-deposit/records",
          method: "POST",
          body: {
            ...data,
          },
        }),
        invalidatesTags: [{ type: "TimeDeposits", id: "LIST" }],
      }),
      modifyTimeDepositRecord: builder.mutation<
        boolean,
        { id: number; data: CreateTimeDepositRecord }
      >({
        query: ({ id, data }) => ({
          url: `/banks/time-deposit/records/${id}`,
          method: "PUT",
          body: {
            ...data,
          },
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "TimeDeposits", id: arg.id },
        ],
      }),
      deleteTimeDepositRecord: builder.mutation<boolean, number>({
        query: (id) => ({
          url: `/banks/time-deposit/records/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [{ type: "TimeDeposits", id }],
      }),
    }),
  });

export const {
  useCreateBankMutation,
  useGetBanksQuery,
  useGetBankRecordsQuery,
  useCreateBankRecordMutation,
  useModifyBankRecordMutation,
  useDeleteBankRecordMutation,
  useGetTimeDepositRecordsQuery,
  useCreateTimeDepositRecordMutation,
  useModifyTimeDepositRecordMutation,
  useDeleteTimeDepositRecordMutation,
} = BankApiSlice;
