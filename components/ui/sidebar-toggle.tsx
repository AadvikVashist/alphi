"use client";

import { PanelLeftClose, PanelLeft } from "lucide-react";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  className?: string;
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <motion.button
      onClick={toggle}
      className={cn(
        "flex items-center justify-center rounded-md p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? (
        <PanelLeftClose className="size-5" />
      ) : (
        <PanelLeft className="size-5" />
      )}
    </motion.button>
  );
} 