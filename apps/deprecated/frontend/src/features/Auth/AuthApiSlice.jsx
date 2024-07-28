import { apiSlice } from "../../app/api/apiSlice";
export const AuthApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/api/auth/Login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        logOut: builder.mutation({
            query: () =>({
                url:'/api/auth/Logout',
                method: 'POST'
            })
        })
    })
})

export const {
    useLoginMutation,
    useLogOutMutation
} = AuthApiSlice