import { apiSlice } from "../../app/api/apiSlice";
export const IncExpApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRecord:builder.query({
            query: credentials => ({
                url:'/api/IncExp/GetIncExpRecord',
                method:'POST',
                body:{...credentials}
            }),
            providesTags:['IncExpRecord'],
            keepUnusedDataFor: 60
        }),
        getRecordSum:builder.query({
            query: credentials => ({
                url:'/api/IncExp/GetIncExpRecordSum',
                method:'POST',
                body:{...credentials}
            }),
            providesTags:['IncExpRecord'],
            keepUnusedDataFor: 300
        }),
        getFinRecordSum:builder.query({// TODO: need to add tag for this
            query: credentials => ({
                url:'/api/IncExp/GetIncExpFinRecordSum', // financial record,
                method: "POST",
                body:{...credentials}
            }),
            keepUnusedDataFor:300,
            providesTags:['IncExpRecord']
        }),
        addRecord: builder.mutation({ // TODO: also invalid tag provided from getFinRecordSum
            query: credentials => ({
                url: '/api/IncExp/AddIncExpRecord',
                method: 'POST',
                body:{...credentials}
            }),
            invalidatesTags:['IncExpRecord']
        }),
        getCategory:builder.query({
            query: credentials => ({
                url:'/api/IncExp/GetIncExpCategory',
                method:'POST',
                body:{...credentials}
            }),
            providesTags:['category']
        }),
        addIncExpCategory:builder.mutation({
            query: credentials => ({
                url:'/api/IncExp/AddIncExpCategory',
                method:'POST',
                body:{...credentials}
            }),
            invalidatesTags:['category']
        }),
    })
})

export const {
    useGetRecordQuery,
    useGetRecordSumQuery,
    useGetFinRecordSumQuery,
    useAddRecordMutation,

    useGetCategoryQuery,
    useAddIncExpCategoryMutation,
} = IncExpApiSlice