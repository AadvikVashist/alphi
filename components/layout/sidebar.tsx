'use client';

import {
  LayoutDashboard,
  X,
  Brain,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  onClick?: () => void;
}

function NavItem({ href, icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors relative',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-foreground/70 hover:text-foreground hover:bg-accent'
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span>{label}</span>
      {badge && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {active && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute left-0 top-0 h-full w-1 rounded-r-md bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
}

interface SidebarProps {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (value: boolean) => void;
}

export function Sidebar({
  isMobileNavOpen,
  setIsMobileNavOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    { label: 'Alphi Copilot',
      href: '/alphi-copilot',
      icon: <Brain className="h-5 w-5" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },


  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-52 h-full bg-background relative flex-col justify-between items-center">
        {/* Sidebar Header with Logo */}
        <div className="h-16 flex items-center px-4 bg-background w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md p-1 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Alphi Copilot"
                width={32}
                height={32}
                className="hidden dark:block"
              />
              <Image
                src="/logo-dark.png"
                alt="Alphi Copilot"
                width={32}
                height={32}
                className="block dark:hidden"
              />
            </div>
            <span className="font-nothing text-xl font-bold">
              Alphi
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 px-3 gap-1 flex flex-col ">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              badge={item.badge}
            />
          ))}
        </nav>
        <div className="h-16 w-full bg-background"/>

      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileNavOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 z-50 h-full min-w-32 w-3/4 max-w-sm bg-background border-r border-border/50 p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="rounded-md p-1 flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="Alphi Copilot"
                      width={32}
                      height={32}
                      className="hidden dark:block"
                    />
                    <Image
                      src="/logo-dark.png"
                      alt="Alphi Copilot"
                      width={32}
                      height={32}
                      className="block dark:hidden"
                    />
                  </div>
                  <span className="font-nothing text-xl font-bold">
                    Alphi Copilot
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.href}
                    badge={item.badge}
                    onClick={() => setIsMobileNavOpen(false)}
                  />
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
