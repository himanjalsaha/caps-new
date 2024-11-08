"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       
        suppressHydrationWarning={true}
      >
        <SessionProvider >
   {children}
        </SessionProvider>
     
      </body>
    </html>
  );
}
