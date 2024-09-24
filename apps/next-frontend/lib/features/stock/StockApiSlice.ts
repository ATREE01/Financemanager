import {
  CreateStockBundleSellRecord,
  CreateStockRecord,
  CreateUserStock,
  StockBundleSellRecord,
  StockRecord,
  StockSummary,
  UpdateStockBundleSellRecord,
  UpdateStockRecord,
  UpdateStockSellRecord,
  UserStock,
} from "@financemanager/financemanager-webiste-types";

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
          url: "/users/records",
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

      createStockRecord: builder.mutation<StockRecord, CreateStockRecord>({
        query: (data) => ({
          url: "/stocks/record",
          method: "POST",
          body: data,
        }),
        invalidatesTags: [{ type: "StockRecord", id: "LIST" }],
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
        ],
      }),
      deleteStockBuyRecor: builder.mutation<void, number>({
        query: (id) => ({
          url: `/stocks/record/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "StockRecord", id: "LIST" }],
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
  useCreateStockRecordMutation,
  useUpdateStockRecordMutation,

  useDeleteStockBuyRecorMutation,

  useGetStockBundleSellRecordsQuery,
  useCreateStockBundleSellRecordMutation,
  useUdpateStockBundleSellRecordMutation,
  useDeleteStockBundleSellRecordMutation,

  useUpdateStockSellRecordMutation,
  useDeleteStockSellRecordMutation,
} = StockApiSlice;
