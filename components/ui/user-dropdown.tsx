"use client";

import { CreditCard, HelpCircle, LogOut, Settings, User, UserIcon, AreaChart, MessageSquareText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface UserData {
  email: string | undefined;
  fullName: string | undefined;
  avatarUrl: string | undefined;
}

interface UserDropdownProps {
  variant?: 'header' | 'navbar';
}

const Shortcut = ({ children }: { children: React.ReactNode }) => {
  return <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">{children}</kbd>;
};

export function UserDropdown({ variant = 'header' }: UserDropdownProps) {
  const [userData, setUserData] = useState<UserData>({
    email: undefined,
    fullName: undefined,
    avatarUrl: undefined,
  });
  const router = useRouter();


  const handleSignOut = useCallback(async () => {

    router.push('/login');
  }, [router]);

  const handleProfile = useCallback(() => {}, []	);
  const handleBilling = useCallback(() => {}, []);
  const handleSettings = useCallback(() => {}, []);
  const handleSubmitFeedback = useCallback(() => {}, []);
  const handleGotoFeedback = useCallback(() => {}, []);
  const handleSupport = useCallback(() => {}, []);
  const handleTokenUsage = useCallback(() => {}, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Command/Control key is pressed
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            handleProfile();
            break;
          case 'b':
            e.preventDefault();
            handleBilling();
            break;
          case ',':
            e.preventDefault();
            handleSettings();
            break;
          case 'h':
            e.preventDefault();
            handleSubmitFeedback();
            break;
          case 's':
            e.preventDefault();
            handleGotoFeedback();
            break;
          case '/':
            e.preventDefault();
            handleSupport();
            break;
          case 'u':
            e.preventDefault();
            handleTokenUsage();
            break;
          case 'q':
            if (e.shiftKey) {
              e.preventDefault();
              handleSignOut();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSignOut, handleProfile, handleBilling, handleSettings, handleSubmitFeedback, handleGotoFeedback, handleSupport, handleTokenUsage]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderTrigger = () => {
    if (variant === 'navbar') {
      return (
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          type="button"
        >
          <UserIcon className="size-5" />
        </Button>
      );
    }

    return (
      <button 
        type="button"
        className="flex items-center gap-3 pl-4 border-l border-muted outline-none hover:bg-accent/50 rounded-sm px-2 py-1 transition-colors"
      >
        <div className="size-8 rounded-full bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center text-sm font-medium text-foreground">
          {userData.avatarUrl ? (
            <Image
              src={userData.avatarUrl}
              alt={userData.fullName || 'User'}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            getInitials(userData.fullName || 'U')
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-foreground">
            {userData.fullName}
          </p>
          <p className="text-xs text-muted-foreground">
            {userData.email}
          </p>
        </div>
      </button>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderTrigger()}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfile}>
            <User className="mr-2 size-4" />
            <span>Profile</span>
            <Shortcut>⌘P</Shortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleBilling}>
            <CreditCard className="mr-2 size-4" />
            <span>Billing</span>
            <Shortcut>⌘B</Shortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettings}>
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
            <Shortcut>⌘,</Shortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTokenUsage}>
            <AreaChart className="mr-2 size-4" />
            <span>Token Usage</span>
            <Shortcut>⌘U</Shortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSubmitFeedback}>
            <MessageSquareText className="mr-2 size-4" />
            <span>Submit Feedback</span>
            <Shortcut>⌘H</Shortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSupport}>
            <HelpCircle className="mr-2 size-4" />
            <span>Support</span>
            <Shortcut>⌘/</Shortcut>
          </DropdownMenuItem>
        
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem  className="group" onClick={handleSignOut}>
          <LogOut className="mr-2 size-4 group-hover:text-destructive" />
          <span className="group-hover:text-destructive">Log out</span>
          <Shortcut>⌘⇧Q</Shortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 