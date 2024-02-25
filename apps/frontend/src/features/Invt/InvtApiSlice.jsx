import { apiSlice } from "../../app/api/apiSlice";

apiSlice.enhanceEndpoints({
    addTagTypes: ['Brokerage', "Stock", "StockRecord", "Dividend"]
})

export const InvtApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBrokerage: builder.query({
            query: credentials => ({
                url: "/api/Invt/getBrokerage",
                method: "GET",
                params: { ...credentials }
            }),
            providesTags: ['Brokerage']
        }),
        addBrokerage: builder.mutation({
            query: credentials => ({
                url: '/api/Invt/addBrokerage',
                method: 'POST',
                body: { ...credentials }
            }),
            invalidatesTags:['Brokerage']
        }),
        getStock: builder.query({
            query: args => ({
                url: "/api/Invt/getStock",
                method: "GET",
                params: { ...args } 
            }),
            keepUnusedDataFor: 600,
            providesTags: ['Stock']
        }),
        getStockPrice: builder.query({
            query: args => ({
                url: "/api/Invt/getStockPrice",
                method: "GET",
                params: { ...args }
            }),
            keepUnusedDataFor: 600,
            providesTags: ['Stock']
        }),
        addStock: builder.mutation({
            query: credentials => ({
                url: "/api/Invt/addStock",
                method: "POST",
                body: { ...credentials }
            }),
            invalidatesTags: ['Stock']
        }),
        getStockRecordSum: builder.query({
            query: args => ({
                url: "/api/Invt/getStockRecordSum",
                method: "GET",
                params: { ...args } 
            }),
            providesTags: ['StockRecord'],
            keepUnusedDataFor: 600
        }),
        getStockRecord: builder.query({
            query: args => ({
                url: "/api/Invt/getStockRecord",
                method: "GET",
                params: { ...args }
            }),
            providesTags: ['StockRecord'],
            keepUnusedDataFor: 600
        }),
        getStkRecPriceSum: builder.query({
            query: args => ({
                url: "/api/Invt/getStkRecPriceSum",
                method: "GET",
                params: { ...args }
            }),
            providesTags: ['StockRecord'],
            keepUnusedDataFor: 600
        }),
        addStockRecord: builder.mutation({
            query: credentials => ({
                url: "/api/Invt/addStockRecord",
                method: "POST",
                body: { ...credentials }
            }),
            invalidatesTags: ['StockRecord']
        }),
        modifyStockRecord: builder.mutation({
            query: args => ({
                url: "/api/Invt/modifyStockRecord",
                method: "PATCH",
                params: { ...args }
            }),
            invalidatesTags: ['StockRecord']
        }),
        deleteStockRecord: builder.mutation({
            query: args => ({
                url: "/api/Invt/deleteStockRecord",
                method: "DELETE",
                params: { ...args }
            }),
            invalidatesTags: ["StockRecord"]
        }),
        getDividendRecord: builder.query({
            query: args => ({
                url: "/api/Invt/getDividnedRecord",
                method: "GET",
                params: { ...args }
            }),
            keepUnusedDataFor: 600,
            providesTags: ['Dividend']
        }),
        getDividendRecordSum: builder.query({
            query: args => ({
                url: "/api/Invt/getDividendRecordSum",
                method: "GET",
                params: { ...args }
            }),
            keepUnusedDataFor: 600,
            providesTags: ['Dividend']
        }),
        addDividendRecord: builder.mutation({
            query: credentials => ({
                url: "/api/Invt/addDividendRecord",
                method: "POST",
                body: { ...credentials }
            }),
            invalidatesTags: ['Dividend']
        }),
        modifyDividendRecord: builder.mutation({
            query: args => ({
                url: "/api/Invt/modifyDividendRecord",
                method: "PATCH",
                params: { ...args }
            }),
            invalidatesTags: ['Dividend']
        }),
        deleteDividendRecord: builder.mutation({
            query: args => ({
                url: "/api/Invt/deleteDividendRecord",
                method: "DELETE",
                params: { ...args }
            }),
            invalidatesTags: ['Dividend']
        }),
        getInvtRecordSum: builder.query({
            query: args => ({
                url: "/api/Invt/getInvtRecordSum",
                method: "GET",
                params: { ...args }
            }),
            keepUnusedDataFor: 600,
            providesTags:['Dividend', 'Record']
        })
    })
})

export const {
    useGetBrokerageQuery,
    useAddBrokerageMutation,
    useGetStockQuery,
    useGetStockPriceQuery,
    useAddStockMutation,
    useGetStockRecordSumQuery,
    useGetStockRecordQuery,
    useGetStkRecPriceSumQuery,

    useAddStockRecordMutation,
    useModifyStockRecordMutation,
    useDeleteStockRecordMutation,

    useGetDividendRecordQuery,
    useGetDividendRecordSumQuery,
    useAddDividendRecordMutation,
    useModifyDividendRecordMutation,
    
    useDeleteDividendRecordMutation,

    useGetInvtRecordSumQuery
} = InvtApiSlice