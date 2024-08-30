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
        <div className="fixed w-full h-[50px] px-10 flex items-center z-30 bg-white text-black">
          <div className="p-2 font-bold ">
            <Link href="/"> 主畫面</Link>
          </div>
          <div className="flex-1"></div>
          <div className="flex">
            <Link
              href="/auth/login"
              className="p-2 font-bold bg-primary-50 hover:bg-primary-200 text-primary-400 rounded-lg border-primary-200 border"
            >
              {" "}
              登入
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-black">
          <div className="fixed w-full h-[50px] px-10 flex items-center z-30 bg-white">
            <div className="Link p-2 cursor-pointer" onClick={onClick}>
              {" "}
              <i className="text-xl bi bi-list"></i>
            </div>
            <div className="Link p-2 font-bold">
              <Link href="/"> Home</Link>
            </div>
            <div className="flex-1"></div>
            <div className="flex">
              <div className="Link p-2 font-bold">
                {" "}
                <Link href="Dashboard"> {username} </Link>{" "}
              </div>

              <div
                className="p-2 font-bold bg-primary-50 hover:bg-primary-200 text-primary-400 rounded-lg border-primary-200 border cursor-pointer"
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
