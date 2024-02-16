import { apiSlice } from "../../app/api/apiSlice";
export const BankApiSlce = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBank:builder.query({
            query: credentials => ({
                url:'/api/Bank/getBank',
                method:'POST',
                body:{...credentials}
            }),
            providesTags:['Banks'],
            keepUnusedDataFor: 60
        }),
        addBank:builder.mutation({
            query: credentials => ({
                url:"/api/Bank/addBank",
                method:"POST",
                body:{...credentials}
            }),
            invalidatesTags:["Banks"]
        }),
        getBankRecord:builder.query({
            query: credentials => ({
                url:"/api/Bank/getBankRecord",
                method:"POST",
                body:{...credentials}
            }),
            providesTags: (result, error, arg) =>
            result ? [...result.map(({ ID }) => ({type:"BankRecord", ID})), "BankRecord"]
            : ['BankRecord']
        }),
        getBankRecordSum:builder.query({
            query: credentials => ({
                url: "/api/Bank/getBankRecordSum",
                method:"POST",
                body:{...credentials}
            }),
            providesTags:["BankRecord"]
        }),
        modifyBankRecord:builder.mutation({
            query: credentials => ({
                url: "/api/Bank/modifyBankRecord",
                method:"PATCH",
                body:{...credentials}
            }),
            invalidatesTags:(result, error, arg) => {
                return(
                    [{type:"BankRecord", ID: arg.ID}]
                )
            }
        }),
        deleteBankRecord:builder.mutation({
            query: credentials => ({
                url:"/api/Bank/deleteBankRecord",
                method:"DELETE",
                body:{...credentials}
            }),
            invalidatesTags:['BankRecord']
        }),
        addBankRecord:builder.mutation({
            query: credentials => ({
                url:"/api/Bank/addBankRecord",
                method:"POST",
                body:{...credentials}
            }),
            invalidatesTags:["BankRecord"]
        }),
        getTimeDepositRecord:builder.query({
            query: credentials => ({
                url: "/api/Bank/getTimeDepositRecord",
                method:"POST",
                body:{...credentials}
            }),
            providesTags: (result, error, arg) =>
                result ? [...result.map(({ ID }) => ({type:"TimeDeposit", ID})), "TimeDeposit"]
                : ['TimeDeposit']
        }),
        getTimeDepositRecordSum: builder.query({
            query: credentials => ({
                url:"/api/Bank/getTimeDepositRecordSum",
                method:"POST",
                body:{...credentials}
            }),
            providesTags:['TimeDeposit']
        }),
        modifyTimeDepositRecord:builder.mutation({
            query: credentials => ({
                url:"/api/Bank/modifyTimeDepositRecord",
                method:"POST",
                body:{...credentials}
            }),
            invalidatesTags:(result, error, arg) => {
                return(
                [{type:"TimeDeposit", ID: arg.ID}]
            )}
        }),
        deleteTimeDepositRecord:builder.mutation({
            query: credentials => ({
                url:"/api/Bank/deleteTimeDepositRecord",
                method:"DELETE",
                body:{...credentials}
            }),
            invalidatesTags:["TimeDeposit"]
        }),
        addTimeDepositRecord:builder.mutation({
            query: credentials => ({
                url:"/api/Bank/addTimeDepositRecord",
                method:"POST",
                body:{...credentials}
            }),
            invalidatesTags:['TimeDeposit']
        }),
    })
})

export const {
    useGetBankQuery,
    useAddBankMutation,
    useGetBankRecordQuery,
    useGetBankRecordSumQuery,
    useModifyBankRecordMutation,
    useDeleteBankRecordMutation,
    useAddBankRecordMutation,
    useGetTimeDepositRecordQuery,
    useGetTimeDepositRecordSumQuery,
    useModifyTimeDepositRecordMutation,
    useDeleteTimeDepositRecordMutation,
    useAddTimeDepositRecordMutation
} = BankApiSlce