import {
  CreateStockBundleSellRecord,
  CreateStockRecord,
  CreateStockSplit,
  CreateUserStock,
  StockBundleSellRecord,
  StockRecord,
  StockSummary,
  UpdateStockBundleSellRecord,
  UpdateStockRecord,
  UpdateStockSellRecord,
  UserStock,
} from "@financemanager/financemanager-website-types";

import { apiSlice } from "@/lib/api/apiSlice";

export const StockApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [
      "Stock",
      "StockRecord",
      "StockSummary",
      "StockBundleSellRecord",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserStocks: builder.query<UserStock[], void>({
        query: () => ({
          url: "/users/stocks",
        }),
        providesTags: ["Stock"],
      }),
      createUserStock: builder.mutation<UserStock, CreateUserStock>({
        query: (data) => ({
          url: "/stocks",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Stock"],
      }),
      updateUserStock: builder.mutation<
        void,
        {
          id: string;
          data: CreateUserStock;
        }
      >({
        query: ({ id, data }) => ({
          url: `/stock/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Stock"],
      }),
      deleteUserStock: builder.mutation<void, string>({
        query: (id: string) => ({
          url: `/stock/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Stock"],
      }),
      getStockRecords: builder.query<StockRecord[], void>({
        query: () => ({
          url: "/users/stocks/records",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({
                  type: "StockRecord" as const,
                  id,
                })),
                { type: "StockRecord", id: "LIST" },
              ]
            : [{ type: "StockRecord", id: "LIST" }],
      }),

      getStockSummary: builder.query<StockSummary[], void>({
        query: () => ({
          url: "users/stocks/summaries",
          method: "GET",
        }),
        providesTags: [{ type: "StockSummary", id: "LIST" }],
      }),

      createStockSplit: builder.mutation<void, CreateStockSplit>({
        query: (data) => ({
          url: "/stocks/split",
          method: "POST",
          body: data,
        }),
        invalidatesTags: [
          { type: "StockSummary", id: "LIST" },
          { type: "StockRecord", id: "LIST" },
          "BrokerageFirmSummary",
          "StockBundleSellRecord",
        ],
      }),

      createStockRecord: builder.mutation<StockRecord, CreateStockRecord>({
        query: (data) => ({
          url: "/stocks/record",
          method: "POST",
          body: data,
        }),
        invalidatesTags: [
          { type: "StockSummary", id: "LIST" },
          { type: "StockRecord", id: "LIST" },
          "BrokerageFirmSummary",
          "BankSummary",
        ],
      }),
      updateStockRecord: builder.mutation<void, UpdateStockRecord>({
        query: (data) => ({
          url: `/stocks/record`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "StockRecord", id: arg.id },
          { type: "StockSummary", id: "LIST" },
          "BrokerageFirmSummary",
        ],
      }),
      deleteStockBuyRecord: builder.mutation<void, number>({
        query: (id) => ({
          url: `/stocks/record/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [
          { type: "StockRecord", id: "LIST" },
          "BrokerageFirmSummary",
        ],
      }),

      getStockBundleSellRecords: builder.query<StockBundleSellRecord[], void>({
        query: () => ({
          url: "/users/stocks/bundle-sell-records",
          method: "GET",
        }),
        providesTags: [{ type: "StockBundleSellRecord", id: "LIST" }],
      }),
      createStockBundleSellRecord: builder.mutation<
        void,
        CreateStockBundleSellRecord
      >({
        query: (data) => ({
          url: "/stocks/bundle-sell-record",
          method: "POST",
          body: data,
        }),
        invalidatesTags: [
          { type: "StockSummary", id: "LIST" },
          { type: "StockBundleSellRecord", id: "LIST" },
          "BrokerageFirmSummary",
        ],
      }),
      udpateStockBundleSellRecord: builder.mutation<
        void,
        {
          id: number;
          data: UpdateStockBundleSellRecord;
        }
      >({
        query: ({ id, data }) => ({
          url: `/stocks/bundle-sell-records/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: [
          { type: "StockSummary", id: "LIST" },
          { type: "StockBundleSellRecord", id: "LIST" },
          "BrokerageFirmSummary",
        ],
      }),
      deleteStockBundleSellRecord: builder.mutation<void, number>({
        query: (id) => ({
          url: `stocks/bundle-sell-records/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [
          { type: "StockSummary", id: "LIST" },
          { type: "StockBundleSellRecord", id: "LIST" },
          "BrokerageFirmSummary",
        ],
      }),
      updateStockSellRecord: builder.mutation<
        void,
        {
          id: number;
          data: UpdateStockSellRecord;
        }
      >({
        query: ({ id, data }) => ({
          url: `/stocks/stock-sell-records/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: [
          { type: "StockSummary", id: "LIST" },
          { type: "StockBundleSellRecord", id: "LIST" },
          "BrokerageFirmSummary",
        ],
      }),
      deleteStockSellRecord: builder.mutation<void, number>({
        query: (id) => ({
          url: `/stocks/stock-sell-records/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [
          { type: "StockSummary", id: "LIST" },
          { type: "StockBundleSellRecord", id: "LIST" },
          "BrokerageFirmSummary",
        ],
      }),
    }),
  });

export const {
  useGetUserStocksQuery,
  useCreateUserStockMutation,
  useUpdateUserStockMutation,
  useDeleteUserStockMutation,

  useGetStockRecordsQuery,
  useGetStockSummaryQuery,
  useCreateStockSplitMutation,
  useCreateStockRecordMutation,
  useUpdateStockRecordMutation,

  useDeleteStockBuyRecordMutation,

  useGetStockBundleSellRecordsQuery,
  useCreateStockBundleSellRecordMutation,
  useUdpateStockBundleSellRecordMutation,
  useDeleteStockBundleSellRecordMutation,

  useUpdateStockSellRecordMutation,
  useDeleteStockSellRecordMutation,
} = StockApiSlice;
