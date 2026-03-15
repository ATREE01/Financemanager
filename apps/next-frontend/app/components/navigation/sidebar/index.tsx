import { WalletCards, X } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import { SidebarData } from "./Sidebar-Data";
import SidebarItem from "./Sidebar-Item";

interface SidebarProps {
  isShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ sidebar }: { sidebar: SidebarProps }) {
  const onClick = () => {
    sidebar.setShow(!sidebar.isShow);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-[260px] h-screen bg-white border-r border-slate-200 flex flex-col overflow-y-auto transition-transform duration-300 z-50 ${
          sidebar.isShow ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="min-h-[var(--navbar-height)] px-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors"
            onClick={onClick}
          >
            <WalletCards className="w-5 h-5" />
            <span>Menu</span>
          </Link>
          <button
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
            onClick={onClick}
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-3">
          {SidebarData.map((item, index) => (
            <SidebarItem key={index} item={item} onClick={onClick} />
          ))}
        </div>
      </nav>
      {/* Overlay */}
      {sidebar.isShow && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClick}
          aria-hidden="true"
        />
      )}
    </>
  );
}
