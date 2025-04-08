"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
interface HeaderProps {
  onMobileMenuToggle: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  showSearch?: boolean;
}

export function Header({ 
  onMobileMenuToggle, 

}: HeaderProps) {
  const [pendingTasks] = useState(7);

  return (
    <header className="h-16 bg-background shrink-0 border-b border-border/50 sticky top-0 z-30 pr-6">
      <div className="flex h-full items-center justify-between gap-2">
        {/* Mobile Logo and Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md p-1 flex-shrink-0">
              <Image src="/logo.webp" alt="Lunar Copilot" width={32} height={32} className="hidden dark:block" />
              <Image src="/logo-dark.webp" alt="Lunar Copilot" width={32} height={32} className="block dark:hidden" />
            </div>
            <span className="font-nothing text-xl font-bold">Lunar</span>
          </Link>
        </div>
        
        {/* Page Title - Visible on larger screens */}
        <div className="hidden md:block">
          {/* You could add page title here if needed */}
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          
          <Button variant="ghost" size="icon" className="hidden sm:relative">
            <Bell className="h-5 w-5" />
            {pendingTasks > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {pendingTasks}
              </span>
            )}
          </Button>
          <ThemeToggle/>
          <UserDropdown />
          
        
        </div>
      </div>
    </header>
  );
} 