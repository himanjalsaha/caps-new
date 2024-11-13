"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";


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
          <AuthProvider>
          <Toaster
            position="top-center"
            duration={3000}
            />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
