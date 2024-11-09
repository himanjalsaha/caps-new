"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";


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
          <Toaster
            position="top-center"
            duration={3000}
            
          />
          {children}
        </SessionProvider>
     
      </body>
    </html>
  );
}
