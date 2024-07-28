import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import { SidebarData } from "./Sidebar-Data";
import SidebarItem from "./Sidebar-Item";

interface Sidebar {
  isShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ sidebar }: { sidebar: Sidebar }) {
  const onClick = () => {
    sidebar.setShow(!sidebar.isShow);
  };

  return (
    <>
      <nav
        className={`sidebar fixed top-0 w-[200px] h-screen bg-primary-100 text-center float-left overflow-auto transition-all duration-250 z-50 scrollBar ${sidebar.isShow ? "left-0" : "left-[-200px]"}`}
      >
        <div className="sidebar-header h-[50px] bg-primary-200 flex justify-end">
          <Link
            href="#"
            className="sidebar-toggle m-1 rounded hover:bg-primary-300 flex items-center"
            onClick={onClick}
          >
            {" "}
            <i className="text-xl bi bi-list text-black"></i>
          </Link>
        </div>
        <div className="sidebar-container m-0 text-black">
          {SidebarData.map((item, index) => (
            <SidebarItem key={index} item={item} onClick={onClick} />
          ))}
        </div>
      </nav>
      {sidebar.isShow ? (
        <div
          className="scrim fixed w-screen h-screen z-40"
          onClick={onClick}
        ></div>
      ) : (
        ""
      )}
    </>
  );
}
