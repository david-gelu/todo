'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preload" href="/_next/static/css/app/page.css" as="style" />
      </head>
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
