"use client";
import React, { createContext } from "react";

export const AppStoreContext = createContext({});

export default function AppStoreProvider({
  contextValue,
  children,
}: {
  contextValue: any;
  children: React.ReactNode;
}) {
  return <AppStoreContext.Provider value={contextValue}>{children}</AppStoreContext.Provider>;
}
