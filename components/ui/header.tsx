"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export function Header({ title, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6",
        className
      )}
      {...props}
    >
      <SidebarTrigger className="h-6 w-6 md:hidden" />
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Add additional header items here (search, profile, etc.) */}
      </div>
    </header>
  )
}
