'use client';

import { motion } from 'framer-motion';
import { BarChart2, ChevronDown, HelpCircle, Layers, Menu, Sparkles, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserDropdown } from '@/components/ui/user-dropdown';
import { cn } from '@/lib/utils';

import Image from 'next/image';

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeDropdown && !target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      pointerEvents: "none" as const
    },
    open: {
      opacity: 1,
      y: 0,
      pointerEvents: "auto" as const
    },
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -5,
      scaleY: 0.95,
      transformOrigin: "top",
      pointerEvents: "none" as const
    },
    open: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      pointerEvents: "auto" as const
    },
  };

  // Navigation structure with groups
  const navGroups = [
    {
      id: 'product',
      label: 'Product',
      items: [
        { name: 'Features', href: '#features', icon: <Sparkles className="size-4" /> },
        { name: 'How It Works', href: '#how-it-works', icon: <Layers className="size-4" /> }
      ]
    },
    {
      id: 'company',
      label: 'Company',
      items: [
        { name: 'Testimonials', href: '#testimonials', icon: <Users className="size-4" /> },
        { name: 'Pricing', href: '#pricing', icon: <BarChart2 className="size-4" /> },
        { name: 'FAQ', href: '#faq', icon: <HelpCircle className="size-4" /> }
      ]
    }
  ];


  return (
    <>
      <div className="relative w-full h-24"/>
      <motion.nav
        initial={{ y: -110, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 flex justify-center w-full px-4 py-3 mt-4"
      >
        <motion.div
          className={cn(
            "flex items-center justify-between w-full max-w-6xl px-5 py-2.5 bg-background/90 backdrop-blur-lg rounded-2xl transition-all duration-300 ease-in-out border border-muted/10 dark:border-transparent shadow-[0_0_0.5rem_0_rgba(0,0,0,0.08)] dark:shadow-none",
            hasScrolled && "border-border shadow-[0_0_1rem_0_rgba(0,0,0,0.08)] dark:border-border dark:shadow-[0_0_1rem_0_rgba(0,0,0,0.05)] bg-background/80"
          )}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {/* Logo and Name */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center items-center flex-row gap-2"
            >
              
              <Image src="/logo.png" alt="Alphi Copilot" width={22} height={22} className="hidden dark:block" />
              <Image src="/logo-dark.png" alt="Alphi Copilot" width={22} height={22} className="dark:hidden" />
              <h1 className="text-2xl font-semibold text-foreground">Alphi Copilot</h1>
            </motion.div>
          </Link>

          {/* Multiple Nav Dropdowns (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navGroups.map((group) => (
              <div key={group.id} className="dropdown-container relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-muted/80 transition-colors relative group overflow-hidden"
                  onClick={() => toggleDropdown(group.id)}
                >
                  <span className="text-base font-medium relative z-10">{group.label}</span>
                  <motion.div
                    animate={{ rotate: activeDropdown === group.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <ChevronDown className={cn(
                      "size-4 transition-colors",
                      activeDropdown === group.id ? "text-primary" : "text-foreground/70"
                    )} />
                  </motion.div>
                </Button>

                <motion.div
                  className="absolute top-full right-0 mt-1 w-48 bg-card shadow-lg rounded-lg border border-border overflow-hidden z-20"
                  initial="closed"
                  animate={activeDropdown === group.id ? "open" : "closed"}
                  variants={dropdownVariants}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                >
                  <div className="py-1">
                    {group.items.map((item, index) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-3 py-2 text-sm hover:bg-muted/70 transition-colors text-foreground/80 hover:text-foreground relative group"
                        whileHover={{ x: 3 }}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: index * 0.03 } 
                        }}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {/* Subtle hover indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-primary/80 group-hover:text-primary mr-2">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}

            {/* Direct Links */}
            <Link 
              href="#pricing" 
              className="text-sm font-medium px-3 py-1.5 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <UserDropdown variant="navbar" />
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-lg text-sm font-medium hidden md:flex"
                  asChild
                >
                  <Link href="/memories">Open App</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-lg text-sm font-medium hidden md:flex"
                  asChild
                >
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Mobile Menu Dropdown */}
        <motion.div
          initial="closed"
          animate={isMobileMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
          transition={{ duration: 0.2 }}
          className="fixed top-24 inset-x-4 md:hidden bg-card/95 backdrop-blur-lg rounded-xl border border-border shadow-lg p-4"
        >
          <div className="flex flex-col space-y-1">
            {navGroups.map((group) => (
              <div key={group.id} className="mb-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-3 py-1">
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-primary/80 mr-2">{item.icon}</span>
                    {item.name}
                  </motion.a>
                ))}
              </div>
            ))}
            <div className="pt-2 mt-1 border-t border-border">
              <Button
                variant="default"
                size="sm"
                className="w-full rounded-lg text-sm font-medium"
                asChild
              >
                <Link href={isLoggedIn ? "/memories" : "/login"}>
                  {isLoggedIn ? "Open App" : "Get Started"}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}; 