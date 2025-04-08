"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("relative", sizeMap[size], className)}>
      <Image
        src="/logo.svg"
        alt="Alphi Logo"
        fill
        className="object-contain"
      />
    </div>
  );
} 