"use client";

import React from "react";

import { setPhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";
import { useAppDispatch } from "@/lib/hook";

export default function InitialStoreData({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  dispatch(setPhraseMap());

  return <>{children}</>;
}
