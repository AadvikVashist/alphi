"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSidebarStore } from "@/lib/store/sidebar-store";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  animate = true,
}: {
  children: React.ReactNode;
  animate?: boolean;
}) => {
  const { isOpen, setOpen } = useSidebarStore();

  return (
    <SidebarContext.Provider value={{ open: isOpen, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  animate,
}: {
  children: React.ReactNode;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-sidebar shrink-0",
        className
      )}
      initial={false}
      animate={{
        width: animate ? (open ? "200px" : "60px") : "200px",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
      onMouseEnter={() => setOpen(true)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-sidebar w-full"
        )}
      >
        <div className="flex justify-end z-20 w-full">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17
            }}
          >
            <Menu
              className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </motion.div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={cn(
                "fixed size-full inset-0 bg-background p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <motion.div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
              >
                <X />
              </motion.div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: Omit<LinkProps, 'href'>;
}) => {
  const { open, animate } = useSidebar();
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <Link
        href={link.href}
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 rounded-lg px-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50",
          className
        )}
        {...props}
      >
        {link.icon}
        <motion.span
          initial={false}
          animate={{
            opacity: animate ? (open ? 1 : 0) : 1,
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
          }}
          transition={{
            opacity: { type: "spring", stiffness: 200, damping: 30 },
          }}
          className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre inline-block !p-0 !m-0"
        >
          {link.label}
        </motion.span>
      </Link>
    </motion.div>
  );
};
