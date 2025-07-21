"use strict";

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
        <div className="fixed w-full h-[50px] px-10 flex items-center z-30 bg-white text-indigo-800 border-b border-indigo-200">
          <div className="p-2 font-bold ">
            <Link href="/"> 主畫面</Link>
          </div>
          <div className="flex-1"></div>
          <div className="flex">
            <Link
              href="/auth/login"
              className="p-2 font-bold bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg border-indigo-200 border"
            >
              {" "}
              登入
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-indigo-800">
          <div className="fixed w-full h-[50px] px-10 flex items-center z-30 bg-white border-b border-indigo-200">
            <div className="Link p-2 cursor-pointer" onClick={onClick}>
              {" "}
              <i className="text-xl bi bi-list"></i>
            </div>
            <div className="Link p-2 font-bold">
              <Link href="/"> Home</Link>
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center">
              <div className="Link p-2 font-bold">
                {" "}
                <Link href="/dashboard"> {username} </Link>{" "}
              </div>

              <div
                className="p-2 font-bold bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg border-indigo-200 border cursor-pointer"
                onClick={async () => {
                  await logOut({});
                  dispatch(resetCredentials());
                  dispatch(apiSlice.util.resetApiState());
                  router.replace("/");
                }}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
