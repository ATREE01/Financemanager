import { Category } from "@financemanager/financemanager-webiste-types";

import { apiSlice } from "@/lib/api/apiSlice";

export const CategoryApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Category"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      createCategory: builder.mutation<
        { category: Category },
        { name: string; type: string }
      >({
        query: (args) => ({
          url: "/categories",
          method: "POST",
          body: {
            ...args,
          },
        }),
        invalidatesTags: ["Category"],
      }),
      getCategories: builder.query<
        {
          income: Category[];
          expense: Category[];
        },
        void
      >({
        query: () => ({
          url: `/users/categories`,
          method: "GET",
        }),
        transformResponse: (response: {
          income: Category[];
          expense: Category[];
        }) => {
          return {
            income: response.income.sort((a, b) => a.order - b.order),
            expense: response.expense.sort((a, b) => a.order - b.order),
          };
        },
        providesTags: ["Category"],
      }),
    }),
  });

export const { useCreateCategoryMutation, useGetCategoriesQuery } =
  CategoryApiSlice;
