import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {setCredentials, resetCredentials } from '../../features/Auth/AuthSlice';

const baseQuery = fetchBaseQuery({
    // baseUrl: 'http://localhost:5173',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if(token){
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if(result?.error?.originalStatus === 403){
        const refreshResult = await baseQuery('/api/Refresh', api, extraOptions);
        if(refreshResult?.data){
            const username = api.getState().auth.username;
            const email = api.getState().auth.email;
            api.dispatch(setCredentials({ ...refreshResult.data, username, email}))
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(resetCredentials());
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    tagTypes:["Banks", "BankRecord", "TimeDeposit"],
    endpoints: builder => ({})
})