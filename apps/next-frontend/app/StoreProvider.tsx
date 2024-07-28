"use client";

import { useRef } from "react";
import { Provider } from "react-redux";

import { AppStore, makeStore } from "../lib/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(makeStore());

  if (!storeRef.current)
    //Create tje store instance the first time this renders
    storeRef.current = makeStore();
  return <Provider store={storeRef.current}>{children}</Provider>;
}
