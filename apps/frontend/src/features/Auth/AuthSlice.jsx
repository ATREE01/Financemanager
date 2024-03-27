import { createSlice } from "@reduxjs/toolkit"

const AuthSlice = createSlice({
    name: 'auth',
    initialState: { user_id: null, username: null, email: null ,token: null },
    reducers: {
        resetCredentials: (state, action) => {
            state.user_id = null;
            state.username = null;
            state.email = null;
            state.token = null;
        },
        setCredentials: (state, action) => {
            const { user_id, username, email, accessToken } = action.payload
            state.user_id = user_id;
            state.username = username;
            state.email = email;
            state.token = accessToken;
        }
    },
})

export const { setCredentials, resetCredentials } = AuthSlice.actions;

export default AuthSlice.reducer; 

export const selectCurrentUserId = (state) => state.auth.user_id;
export const selectCurrentUser = (state) => state.auth.username;
export const selectCurrentEamil = (state) => state.auth.email;
export const selectCurrentToken = (state) => state.auth.token;