import { apiSlice } from "../../app/api/apiSlice";

apiSlice.enhanceEndpoints({
    addTagTypes:["IncExpRecord", "category"]
})

export const IncExpApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRecord:builder.query({
            query: credentials => ({
                url:'/api/IncExp/GetIncExpRecord',
                method:'POST',
                body:{...credentials}
            }),
            providesTags:['IncExpRecord'],
            keepUnusedDataFor: 600
        }),
        getRecordSum:builder.query({
            query: credentials => ({
                url:'/api/IncExp/GetIncExpRecordSum',
                method:'POST',
                body:{...credentials}
            }),
            providesTags:['IncExpRecord'],
            keepUnusedDataFor: 600
        }),
        getFinRecordSum:builder.query({
            query: credentials => ({
                url:'/api/IncExp/GetIncExpFinRecordSum', // financial record,
                method: "POST",
                body:{...credentials}
            }),
            keepUnusedDataFor:600,
            providesTags:['IncExpRecord']
        }),
        addRecord: builder.mutation({
            query: credentials => ({
                url: '/api/IncExp/AddIncExpRecord',
                method: 'POST',
                body:{...credentials}
            }),
            invalidatesTags:['IncExpRecord']
        }),
        modifyIncExpRecord:builder.mutation({
            query: credentials => ({
                url: "/api/IncExp/modifyIncExpRecord",
                method:"PATCH",
                body:{...credentials}
            }),
            invalidatesTags:['IncExpRecord']    
        }),
        deleteIncExpRecord: builder.mutation({
            query: args => ({
                url: "/api/IncExp/deleteIncExpRecord",
                method: "DELETE",
                params: { ...args }
            }),
            invalidatesTags:['IncExpRecord']
        }),
        getCategory:builder.query({
            query: args => ({
                url:'/api/IncExp/GetIncExpCategory',
                method:'GET',
                params:{...args}
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
    useModifyIncExpRecordMutation,
    useDeleteIncExpRecordMutation,

    useGetCategoryQuery,
    useAddIncExpCategoryMutation,
} = IncExpApiSlice