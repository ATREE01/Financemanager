import {
  BrokerageFirm,
  CreateBrokerageFirm,
} from "@financemanager/financemanager-webiste-types";

import { apiSlice } from "@/lib/api/apiSlice";

export const BrokerageFirmApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["BrokerageFirm"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getBrokerageFirms: builder.query<BrokerageFirm[], void>({
        query: () => ({
          url: "/users/brokerage-firms",
          method: "GET",
        }),
        providesTags: (result) => {
          return result
            ? [
                ...result.map(({ id }) => ({
                  type: "BrokerageFirm" as const,
                  id,
                })),
                { type: "BrokerageFirm", id: "LIST" },
              ]
            : [{ type: "BrokerageFirm", id: "LIST" }];
        },
      }),
      createBrokerageFirm: builder.mutation<BrokerageFirm, CreateBrokerageFirm>(
        {
          query: (data) => ({
            url: "/brokerage-firms",
            method: "POST",
            body: {
              ...data,
            },
          }),
          invalidatesTags: [{ type: "BrokerageFirm", id: "LIST" }],
        },
      ),
      updateBrokerageFirm: builder.mutation<
        BrokerageFirm,
        {
          id: string;
          data: CreateBrokerageFirm;
        }
      >({
        query: ({ id, data }) => ({
          url: `/brokerage-firms/${id}`,
          method: "PUT",
          body: {
            ...data,
          },
        }),
        invalidatesTags: (result, error, args) => [
          { type: "BrokerageFirm", id: args.id },
        ],
      }),
      deleteBrokerageFirm: builder.mutation<void, number>({
        query: (id) => ({
          url: `/brokerage-firms/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [{ type: "BrokerageFirm", id }],
      }),
    }),
  });
export const {
  useGetBrokerageFirmsQuery,
  useCreateBrokerageFirmMutation,
  useUpdateBrokerageFirmMutation,
  useDeleteBrokerageFirmMutation,
} = BrokerageFirmApiSlice;
