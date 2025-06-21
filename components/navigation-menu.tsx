"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export function NavigationMenu() {
  const { theme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
  const hoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`p-2 rounded-full ${bgColor} ${hoverBgColor} ${textColor}`}>
          Menu
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <a href="/" className={textColor}>Home</a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a href="/about" className={textColor}>About</a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a href="/contact" className={textColor}>Contact</a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a href="/contact" className={textColor}>Issuer Comparison</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
