
import { apiSlice } from "../../app/api/apiSlice";

apiSlice.enhanceEndpoints({
    addTagTypes: ['Currency']
})

const CurrencyApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExchangeRate: builder.query({
            query: credentials => ({
                url: "/api/Currency/getExchangeRate",
                method: "GET"
            }),
            keepUnusedDataFor: 1800,
        }),
        getUserCurrency: builder.query({
            query: arg => ({
                url: `/api/Currency/getUserCurrency`,
                method: "GET",
                params: { ...arg }
            }),
            providesTags: ['Currency']
        }),
        addUserCurrency: builder.mutation({
            query: credentials => ({
                url: "/api/Currency/addUserCurrency",
                method: "POST",
                body: {...credentials}
            }),
            invalidatesTags: ['Currency']
        }),
        deleteUserCurrency: builder.mutation({
            query: credentials => ({
                url: "/api/Currency/deleteUserCurrency",
                method: "DELETE",
                body: { ...credentials }
            }),
            invalidatesTags: ['Currency']
        })
    }),
})

export const {
    useGetExchangeRateQuery,
    useGetUserCurrencyQuery,
    useAddUserCurrencyMutation,
    useDeleteUserCurrencyMutation
} = CurrencyApiSlice
