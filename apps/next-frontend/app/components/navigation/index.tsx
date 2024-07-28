"use client";

import { useState } from "react";

import NavBar from "./navbar";
import Sidebar from "./sidebar";

export default function Navigation() {
  const [isShowSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <NavBar sidebar={{ isShow: isShowSidebar, setShow: setShowSidebar }} />
      <Sidebar sidebar={{ isShow: isShowSidebar, setShow: setShowSidebar }} />
    </>
  );
}
