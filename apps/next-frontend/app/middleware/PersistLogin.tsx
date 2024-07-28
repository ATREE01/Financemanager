"use client";

import { User } from "@financemanager/financemanager-webiste-types";
import { useEffect, useState } from "react";

import { setCredentials } from "@/lib/features/Auth/AuthSlice";
import { useAppDispatch } from "@/lib/hook";

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
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
