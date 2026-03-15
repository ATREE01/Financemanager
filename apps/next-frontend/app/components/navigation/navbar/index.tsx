"use client";

import { LogOut, Menu, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import { apiSlice } from "@/lib/api/apiSlice";
import { useLogOutMutation } from "@/lib/features/Auth/AuthApiSlice";
import { resetCredentials, useUsername } from "@/lib/features/Auth/AuthSlice";
import { useAppDispatch } from "@/lib/hook";

interface Sidebar {
  isShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function NavBar({ sidebar }: { sidebar: Sidebar }) {
  const dispatch = useAppDispatch();
  const [logOut] = useLogOutMutation();

  const router = useRouter();
  const username = useUsername();

  const onClick = () => {
    sidebar.setShow(!sidebar.isShow);
  };

  return (
    <>
      {username === null ? (
        <div className="fixed w-full h-[var(--navbar-height)] px-6 lg:px-10 flex items-center justify-between z-30 bg-white border-b border-slate-200 shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors"
          >
            <WalletCards className="w-6 h-6" />
            <span>FinanceManager</span>
          </Link>
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
          >
            登入
          </Link>
        </div>
      ) : (
        <div className="fixed w-full h-[var(--navbar-height)] px-4 lg:px-6 flex items-center justify-between z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
              onClick={onClick}
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 hover:text-blue-600 transition-colors"
            >
              <WalletCards className="w-5 h-5 text-blue-600" />
              <span>FinanceManager</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
              {username}
            </div>
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-100"
              onClick={async () => {
                await logOut({});
                dispatch(resetCredentials());
                dispatch(apiSlice.util.resetApiState());
                router.replace("/");
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">登出</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
