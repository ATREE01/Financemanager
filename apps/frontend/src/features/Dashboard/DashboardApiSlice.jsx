
import { apiSlice } from "../../app/api/apiSlice";

apiSlice.enhanceEndpoints({
    // addTagTypes: ['Currency']
})

const DashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBankAreaChartData: builder.query({//TODO: maybe add tag to this and invt
            query: args => ({
                url: "/api/Dashboard/getBankAreaChartData",
                method: "GET",
                params: { ...args }
            }),
            providesTags:['BankRecord', "IncExpRecord", "CurTRRecord"]
        }),
        getBankData: builder.query({
            query: args => ({
                url: "/api/Dashboard/getBankData",
                method: "GET",
                params: { ...args }
            }),
        }),
        getInvtAreaChartData: builder.query({
            query: args => ({
                url: "/api/Dashboard/getInvtAreaChartData",
                method: "GET",
                params: { ...args }
            })
        }),
        getInvtData: builder.query({
            query: args => ({
                url: "/api/Dashboard/getInvtData",
                method: "GET",
                params: { ...args }
            })
        })
    }),
})

export const {
    useGetBankAreaChartDataQuery,
    useGetBankDataQuery,
    useGetInvtAreaChartDataQuery,
    useGetInvtDataQuery
} = DashboardApiSlice
