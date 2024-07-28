"use client";

import { User } from "@financemanager/financemanager-webiste-types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "@/lib/store";

interface AuthState {
  userId: null | string;
  username: null | string;
  email: null | string;
  accessToken: null | string;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    username: null,
    email: null,
    accessToken: null,
  } as AuthState,
  reducers: {
    resetCredentials: (state) => {
      state.userId = null;
      state.username = null;
      state.email = null;
      state.accessToken = null;
    },
    setCredentials: (
      state,
      action: { payload: { user: User; accessToken: string }; type: string },
    ) => {
      const { user, accessToken } = action.payload;
      state.userId = user.id;
      state.username = user.profile.username;
      state.email = user.profile.email;
      state.accessToken = accessToken;
    },
  },
});

export const { resetCredentials, setCredentials } = authSlice.actions;

export default authSlice.reducer;

export const useUserId = () =>
  useSelector((state: RootState) => state.auth.userId);
export const useUsername = () =>
  useSelector((state: RootState) => state.auth.username);
export const useEmail = () =>
  useSelector((state: RootState) => state.auth.email);
export const useAccessToken = () =>
  useSelector((state: RootState) => state.auth.accessToken);
