"use client";
import { useSession } from "next-auth/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "../components/common/header";
import Sidebar from "../components/common/sidebar";
import Rightsidebar from "../components/common/Rightsidebar";
import { redirect } from "next/navigation"; // To handle redirection
import Providers from "@/lib/providers";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#18191A]">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/login"); // Redirect to login page if no session
    return null;
  }

  return (
    <div>
      <Header />
      <Sidebar />
      <Rightsidebar />
      <Providers>
      {children}
      </Providers>
     
    </div>
  );
}
