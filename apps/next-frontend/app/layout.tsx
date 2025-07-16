import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import Navigation from "./components/navigation";
import InitialStoreData from "./middleware/InitialStoreData";
import PersistLogin from "./middleware/PersistLogin";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Manager",
  description: "My Finance manage APP created by next + next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <PersistLogin>
            <InitialStoreData>
              <Navigation />
              {children}
            </InitialStoreData>
          </PersistLogin>
        </StoreProvider>
      </body>
    </html>
  );
}
