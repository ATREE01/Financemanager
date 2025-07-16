"use client";

import { User } from "@financemanager/financemanager-website-types";
import React, { useEffect, useState } from "react";

import { setCredentials } from "@/lib/features/Auth/AuthSlice";
import { useAppDispatch } from "@/lib/hook";

import LoadingPage from "../components/loading-page";

export default function PersistLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response: Response = await fetch("/api/auth/refresh", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 403) setIsLoading(false);
        else {
          const result: { user: User; accessToken: string } =
            await response.json();
          dispatch(setCredentials(result));
        }
      } finally {
        setIsLoading(false);
      }
    };
    verifyRefreshToken();
  }, [dispatch]);

  return <>{isLoading ? <LoadingPage /> : children}</>;
}
