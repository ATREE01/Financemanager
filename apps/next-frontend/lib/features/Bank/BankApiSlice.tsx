import { Bank } from "@financemanager/financemanager-webiste-types";

import { apiSlice } from "@/lib/api/apiSlice";

const BankApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Bank"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      createBank: builder.mutation<
        { bank: Bank },
        { name: string; currency: string; userId: string }
      >({
        query: (args) => ({
          url: "/banks",
          method: "POST",
          body: {
            ...args,
          },
        }),
        invalidatesTags: ["Bank"],
      }),
      getBanks: builder.query<Bank[], string>({
        query: (userId) => ({
          url: `/users/${userId}/banks`,
          method: "GET",
        }),
        providesTags: ["Bank"],
      }),
    }),
  });

export const { useCreateBankMutation, useGetBanksQuery } = BankApiSlice;
