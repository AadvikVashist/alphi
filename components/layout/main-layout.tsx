"use client";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
      <MainLayoutContent 
        isMobileNavOpen={isMobileNavOpen} 
        setIsMobileNavOpen={setIsMobileNavOpen}
      >
        {children}
      </MainLayoutContent>
  );
}

interface MainLayoutContentProps {
  children?: React.ReactNode;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

function MainLayoutContent({ 
  children, 
  isMobileNavOpen, 
  setIsMobileNavOpen 
}: MainLayoutContentProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        isMobileNavOpen={isMobileNavOpen} 
        setIsMobileNavOpen={setIsMobileNavOpen} 
      />

      {/* Main Content Column */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header Component */}
        <Header 
          onMobileMenuToggle={() => setIsMobileNavOpen(true)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}