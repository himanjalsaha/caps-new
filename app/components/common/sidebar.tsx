import {
  Book,
  Bookmark,
  Users,
  Bell,
  Home,
  MessageCircleQuestion,
  Menu,
  X,
  MessageCircleMore,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { AINavButton } from "../ui/AINavButton";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState<string>("/");

  const handleNavClick = (href: string) => {
    setActiveLink(href);
  };
  return (
    <div>
      {" "}
      <aside className=" flex flex-col md:block hidden  justify-between h-[100vh]  w-60 fixed  border-r border-[#3E4042] p-4 left-[10px]">
        <div className="my-[60px]">
          <NavButton
            icon={<Home className="w-5 h-5" />}
            active={activeLink === "/home"}
            onClick={() => handleNavClick("/home")}
            label="Home"
            href="/home"
          />
          <NavButton
            icon={<MessageCircleQuestion className="w-5 h-5" />}
            active={activeLink === "/askteacher"}
            onClick={() => handleNavClick("/askteacher")}
            label="Ask Teacher"
            href="/askteacher"
          />
          <NavButton
            icon={<MessageCircleMore className="w-5 h-5" />}
            active={activeLink === "/chatroom"}
            onClick={() => handleNavClick("/chatroom")}
            href="/chatroom"
            label="Chat Room"
          />
          <AINavButton
            active={activeLink === "/ai"}
            onClick={() => handleNavClick("/ai")}
            label="Ask AI(Beta)"
            href="/ai"
          />

        </div>
        <div className="mb-[20px]">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

function SidebarLink({ icon, text, count }: any) {
  return (
    <Link
      href="#"
      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#3A3B3C] transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-gray-300">{text}</span>
      </div>
      {count && (
        <span className="text-xs bg-[#3A3B3C] px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  href: string;
  label?: string;
}

function NavButton({
  icon,
  active = false,
  onClick,

  href,
  label,
}: NavButtonProps) {
  return (
    <Link href={href} passHref>
      <button
        onClick={onClick}
        className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-[#3A3B3C] ${
          active ? "text-purple-500" : "text-gray-300"
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    </Link>
  );
}

export default Sidebar;
