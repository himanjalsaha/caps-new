import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "../components/common/header";
import Sidebar from "../components/common/sidebar";
import Rightsidebar from "../components/common/Rightsidebar";



export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
     <div>
     <Header/>
   
   <Sidebar/>
   <Rightsidebar/>
       {children}
   
     </div>
      
     
   
  );
}
