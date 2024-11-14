import Link from "next/link";
import React from "react";
import { Sparkles } from "lucide-react";

interface AINavButtonProps {
  active?: boolean;
  onClick: () => void;
  href: string;
  label?: string;
}

export function AINavButton({
  active = false,
  onClick,
  href,
  label,
}: AINavButtonProps) {
  return (
    <Link href={href} passHref>
      <button
        onClick={onClick}
        className={`group flex items-center space-x-2 p-2 rounded-lg 
          bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30
          border border-purple-500/20 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${active ? "border-purple-500/50" : ""}
        `}
      >
        <Sparkles
          className={`w-5 h-5
          ${active ? "text-purple-400" : "text-gray-300"}
          group-hover:text-purple-400 transition-colors
          animate-glow
        `}
        />
        <span
          className={`
          bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent
          group-hover:from-purple-300 group-hover:to-blue-300
          transition-all duration-300
        `}
        >
          {label}
        </span>
      </button>
    </Link>
  );
}
