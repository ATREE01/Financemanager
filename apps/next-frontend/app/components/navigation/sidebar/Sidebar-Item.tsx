import { ChevronDown, ChevronRight, Dot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface ParentLink {
  title: string;
  childrens: {
    title: string;
    path: string;
  }[];
}

interface ChildLink {
  title: string;
  path: string;
}

export default function SidebarItem({
  item,
  onClick,
}: {
  item: ParentLink | ChildLink;
  onClick: () => void;
}) {
  const currentPath = usePathname();
  const [open, setOpen] = useState(false);

  const isParent = (item: ParentLink | ChildLink): item is ParentLink => {
    return (item as ParentLink).childrens !== undefined;
  };

  useEffect(() => {
    if (isParent(item)) {
      const isChildActive = item.childrens.some(
        (child) => currentPath === child.path,
      );
      if (isChildActive) {
        setOpen(true);
      }
    }
  }, [currentPath, item]);

  if (isParent(item)) {
    const isChildActive = item.childrens.some(
      (child) => currentPath === child.path,
    );

    return (
      <div className="flex flex-col gap-1">
        <button
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100",
            isChildActive
              ? "text-blue-700 bg-blue-50/80"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          )}
          onClick={() => setOpen(!open)}
        >
          <span>{item.title}</span>
          {open ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>
        <div className={cn("flex-col gap-0.5 pl-3", open ? "flex" : "hidden")}>
          {item.childrens.map((child, index) => {
            const isActive = currentPath === child.path;
            return (
              <Link
                key={index}
                href={child.path}
                onClick={onClick}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100",
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Dot
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-blue-600" : "text-slate-300",
                  )}
                />
                {child.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  } else {
    const isActive = currentPath === item.path;
    return (
      <Link
        className={cn(
          "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100",
          isActive
            ? "text-blue-700 bg-blue-50/80"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        )}
        href={item.path}
        onClick={onClick}
      >
        {item.title}
      </Link>
    );
  }
}
