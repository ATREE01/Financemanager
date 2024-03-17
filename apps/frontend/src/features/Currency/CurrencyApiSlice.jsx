
import { apiSlice } from "../../app/api/apiSlice";

apiSlice.enhanceEndpoints({
    addTagTypes: ['Currency', "CurTRRecord"]
})

const CurrencyApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExchangeRate: builder.query({
            query: () => ({
                url: "/api/Currency/getExchangeRate",
                method: "GET"
            }),
            keepUnusedDataFor: 1800,
        }),
        getCurTRRecord: builder.query({
            query: query => ({
                url: "/api/Currency/getCurTRRecord",
                method: "GET",
                params: { ...query }
            }),
            providesTags: ['CurTRRecord']
        }),
        getCurTRRecordSum: builder.query({
            query: query => ({
                url: "/api/Currency/getCurTRRecordSum",
                method: "GET",
                params: { ... query }
            }),
            providesTags: ['CurTRRecord']
        }),
        addCurTRRecord: builder.mutation({ //currency transaction
            query: body => ({
                url : "/api/Currency/addCurTRRecord",
                method : "POST",
                body: { ...body }
            }),
            invalidatesTags: ['CurTRRecord']
        }),
        modifyCurTRRecord: builder.mutation({
            query: body => ({
                url: "/api/Currency/modifyCurTRRecord",
                method: "PATCH",
                body: { ...body }
            }),
            invalidatesTags: ['CurTRRecord']
        }),
        deleteCurTRRecord: builder.mutation({
            query: query => ({
                url : "/api/Currency/deleteCurTRRecord",
                method: "DELETE",
                params: { ...query },
            }),
            invalidatesTags: ['CurTRRecord']
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
                params: { ...credentials }
            }),
            invalidatesTags: ['Currency']
        })
    }),
})

export const {
    useGetExchangeRateQuery,
    useGetCurTRRecordQuery,
    useGetCurTRRecordSumQuery,
    useAddCurTRRecordMutation,
    useModifyCurTRRecordMutation,
    useDeleteCurTRRecordMutation,
    useGetUserCurrencyQuery,
    useAddUserCurrencyMutation,
    useDeleteUserCurrencyMutation
} = CurrencyApiSlice
