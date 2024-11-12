"use client";
import { Bell, Home, MessageCircleQuestion, Menu, X } from "lucide-react";
import Logo from "./logo";
import React, { useState } from "react";
import Link from "next/link";
import PostButton from "./PostModalButton";

const Header = () => {
  const [activeLink, setActiveLink] = useState<string>("/");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Toggle drawer open/close
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Handle active link change on click
  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setIsDrawerOpen(false); // Close drawer when link is clicked
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#242526] border-b border-[#3E4042] px-4">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="hidden md:flex items-center ml-4 space-x-1"></div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleDrawer} className="text-gray-300">
            {isDrawerOpen ? (
              <Menu className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <PostButton buttonText="Ask Question" />
          <NavButton
            icon={<Bell className="w-5 h-5" />}
            active={activeLink === "/notifications"}
            onClick={() => handleNavClick("/notifications")}
            href="/notifications"
          />
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-semibold"
          >
            A
          </Link>
        </div>
      </div>

      {/* Drawer for Mobile */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
        >
          <div
            className="fixed top-0 left-0 w-64 h-full bg-[#242526] p-4 z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner clicks
          >
            <button
              onClick={toggleDrawer}
              className="self-end text-gray-300 mb-4"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col space-y-4">
              <NavButton
                icon={<Home className="w-5 h-5" />}
                active={activeLink === "/home"}
                onClick={() => handleNavClick("/home")}
                href="/home"
                label="Home"
              />
              <NavButton
                icon={<MessageCircleQuestion className="w-5 h-5" />}
                active={activeLink === "/askteacher"}
                onClick={() => handleNavClick("/askteacher")}
                href="/askteacher"
                label="Ask Teacher"
              />
              <NavButton
                icon={<Bell className="w-5 h-5" />}
                active={activeLink === "/notifications"}
                onClick={() => handleNavClick("/notifications")}
                href="/notifications"
                label="Notifications"
              />
              <PostButton buttonText="Ask Your Doubt" />
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-semibold"
              >
                A
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

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

export default Header;
