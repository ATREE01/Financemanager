import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const currentPath = usePathname();

  if ((item as ParentLink).childrens !== undefined) {
    return (
      <div
        className={`sidebar-item py-1 mx-2 my-1 block rounded ${open ? "bg-primary-300" : ""}`}
      >
        {/* "sidebar-item sidebar-item-toggle" */}
        <div
          className="sidebar-item py-2 mx-2 my-1 cursor-pointer rounded text-xl font-bold hover:bg-primary-500"
          onClick={() => setOpen(!open)}
        >
          {item.title}
          <i className="bi bi-caret-down-fill"></i>
        </div>
        <div
          className={`sidebar-container rounded ${open ? "block" : "hidden"}`}
        >
          {(item as ParentLink).childrens.map((child, index) => (
            <SidebarItem key={index} item={child} onClick={onClick} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Link
          className={`sidebar-item py-2 mx-2 my-1 block text-xl rounded hover:bg-primary-500 ${currentPath === (item as ChildLink).path ? " bg-primary-500 rounded" : ""}`}
          href={(item as ChildLink).path}
          onClick={onClick}
        >
          {item.title}
        </Link>
      </>
    );
  }
}
