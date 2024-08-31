import {
  CreateIncExpRecord,
  IncExpRecord,
} from "@financemanager/financemanager-webiste-types";

import { apiSlice } from "@/lib/api/apiSlice";

export const IncExpApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["IncExp"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getIncExpRecords: builder.query<IncExpRecord[], void>({
        query: () => ({
          url: `/users/inc-exp`,
          method: "GET",
        }),
        keepUnusedDataFor: 600,
        providesTags: (result) => {
          return result
            ? [
                ...result.map(({ id }) => ({ type: "IncExp" as const, id })),
                { type: "IncExp", id: "LIST" },
              ]
            : [{ type: "IncExp", id: "LIST" }];
        },
      }),
      createIncExpRecord: builder.mutation<IncExpRecord, CreateIncExpRecord>({
        query: (body) => ({
          url: "/inc-exp",
          method: "POST",
          body: body,
        }),
        invalidatesTags: [{ type: "IncExp", id: "LIST" }],
      }),
      updateIncExpRecord: builder.mutation<
        IncExpRecord,
        { id: number; data: CreateIncExpRecord }
      >({
        query: ({ id, data }) => ({
          url: `/inc-exp/${id}`,
          method: "PUT",
          body: { ...data },
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "IncExp", id }],
      }),
      deleteIncExpRecord: builder.mutation<boolean, number>({
        query: (id) => ({
          url: `/inc-exp/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, arg) => [{ type: "IncExp", id: arg }],
      }),
    }),
  });

export const {
  useGetIncExpRecordsQuery,
  useCreateIncExpRecordMutation,
  useUpdateIncExpRecordMutation,
  useDeleteIncExpRecordMutation,
} = IncExpApiSlice;
