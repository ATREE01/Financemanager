import type { User } from "@financemanager/financemanager-website-types";
import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { setCredentials } from "../features/Auth/AuthSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  credentials: "include",
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  {
    url: string;
  }, // Args
  unknown, // Result
  FetchBaseQueryError // Error
> = async (arg, api, extraOptions) => {
  let result = await baseQuery(arg, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery("auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      const data = refreshResult.data as { user: User; accessToken: string };
      api.dispatch(setCredentials(data));
      result = await baseQuery(arg, api, extraOptions);
    } else {
      // api.dispatch(resetCredentials());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
  tagTypes: ["BankSummary", "BrokerageFirmSummary"],
});
