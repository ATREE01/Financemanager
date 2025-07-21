import type {
  Bank,
  BankHistoryData,
  BankRecord,
  BankSummary,
  CreateBankRecord,
  CreateTimeDepositRecord,
  TimeDepositRecord,
} from "@financemanager/financemanager-website-types";

import { apiSlice } from "@/lib/api/apiSlice";

const BankApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Bank", "BankRecord", "TimeDeposits"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getBankSummary: builder.query<BankSummary, void>({
        query: () => ({
          url: "/banks/summary",
          method: "GET",
        }),
        providesTags: ["BankSummary"],
      }),
      getBankhistoryData: builder.query<BankHistoryData[], void>({
        query: () => ({
          url: "/banks/history-data",
          method: "GET",
        }),
        providesTags: ["BankSummary"],
      }),
      getBanks: builder.query<Bank[], void>({
        query: () => ({
          url: `/banks`,
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
        invalidatesTags: ["Bank", "BankSummary"],
      }),
      getBankRecords: builder.query<BankRecord[], void>({
        query: () => ({
          url: "/banks/records",
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
          url: "/banks/record",
          method: "POST",
          body: {
            ...args,
          },
        }),
        invalidatesTags: [{ type: "BankRecord", id: "LIST" }, "BankSummary"],
      }),
      updateBankRecord: builder.mutation<
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
          "BankSummary",
        ],
      }),
      deleteBankRecord: builder.mutation<boolean, number>({
        query: (id) => ({
          url: `/banks/records/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "BankRecord", id },
          "BankSummary",
        ],
      }),
      getTimeDepositRecords: builder.query<TimeDepositRecord[], void>({
        query: () => ({
          url: "/banks/time-deposit/records",
          method: "GET",
        }),
        providesTags: [{ type: "TimeDeposits", id: "LIST" }],
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
        invalidatesTags: [{ type: "TimeDeposits", id: "LIST" }, "BankSummary"],
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
        invalidatesTags: [{ type: "TimeDeposits", id: "LIST" }],
      }),
      deleteTimeDepositRecord: builder.mutation<boolean, number>({
        query: (id) => ({
          url: `/banks/time-deposit/records/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "TimeDeposits", id: "LIST" }, "BankSummary"],
      }),
    }),
  });

export const {
  useGetBankSummaryQuery,
  useGetBankhistoryDataQuery,
  useCreateBankMutation,
  useGetBanksQuery,
  useGetBankRecordsQuery,
  useCreateBankRecordMutation,
  useUpdateBankRecordMutation,
  useDeleteBankRecordMutation,
  useGetTimeDepositRecordsQuery,
  useCreateTimeDepositRecordMutation,
  useModifyTimeDepositRecordMutation,
  useDeleteTimeDepositRecordMutation,
} = BankApiSlice;
